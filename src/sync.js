import { supabase, isSupabaseConfigured } from './supabaseClient.js';

let pendingSync = false;
let debounceTimer = null;
const DEBOUNCE_MS = 2500;

function isCloudMode(account) {
  return account?.mode === 'cloud' && Boolean(account.profileId);
}

function normalizeStateForSave(state) {
  const cleanState = structuredClone(state);
  cleanState.updatedAt = new Date().toISOString();
  return cleanState;
}

export function mergeSaves(localState, cloudRecord) {
  const cloudState = cloudRecord ? { ...cloudRecord.state, updatedAt: cloudRecord.updated_at } : null;
  const local = localState ? { ...localState, updatedAt: localState.updatedAt || new Date().toISOString() } : null;

  if (!cloudState && local) return { save: local, source: 'local' };
  if (cloudState && !local) return { save: cloudState, source: 'cloud' };

  const localTime = new Date(local.updatedAt || 0).getTime();
  const cloudTime = new Date(cloudState.updatedAt || 0).getTime();

  if (cloudTime > localTime) {
    return { save: cloudState, source: 'cloud' };
  }
  return { save: local, source: 'local' };
}

export async function fetchCloudSave(profileId) {
  if (!profileId) return { data: null, error: new Error('Missing profileId') };
  if (!isSupabaseConfigured()) return { data: null, error: new Error('Supabase not configured') };
  return supabase.from('saves').select('state, updated_at').eq('profile_id', profileId).maybeSingle();
}

export async function pullLatestState(localState, account) {
  if (!isCloudMode(account)) {
    return { applied: 'local', save: localState };
  }
  const { data, error } = await fetchCloudSave(account.profileId);
  if (error) {
    console.warn('Could not fetch cloud save', error);
    pendingSync = true;
    return { applied: 'local', save: localState };
  }

  if (!data) {
    await pushSave(localState, account);
    return { applied: 'local', save: localState };
  }

  const merged = mergeSaves(localState, data);
  if (merged.source === 'local') {
    await pushSave(merged.save, account);
  }
  return { applied: merged.source, save: merged.save };
}

export async function pushSave(state, account) {
  if (!isCloudMode(account)) return null;
  if (!isSupabaseConfigured()) return null;
  const payload = {
    profile_id: account.profileId,
    state: normalizeStateForSave(state),
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from('saves').upsert(payload, { onConflict: 'profile_id' });
  if (error) throw error;
  return payload;
}

export function markPendingSync() {
  pendingSync = true;
}

export function hasPendingSync() {
  return pendingSync;
}

export function scheduleAutosave(state) {
  if (!isCloudMode(state.account)) return;
  if (!isSupabaseConfigured()) return;
  pendingSync = true;
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    try {
      await pushSave(state, state.account);
      pendingSync = false;
    } catch (error) {
      console.warn('Autosave failed', error);
      pendingSync = true;
    }
  }, DEBOUNCE_MS);
}

export async function attemptPendingSync(state) {
  if (!pendingSync) return;
  if (!isCloudMode(state?.account)) return;
  try {
    await pushSave(state, state.account);
    pendingSync = false;
  } catch (error) {
    console.warn('Retry sync failed', error);
    pendingSync = true;
  }
}

export async function flushPendingSync(state) {
  if (!isCloudMode(state?.account)) return { status: 'local' };
  if (!isSupabaseConfigured()) return { status: 'offline' };
  try {
    await pushSave(state, state.account);
    pendingSync = false;
    return { status: 'synced' };
  } catch (error) {
    pendingSync = true;
    return { status: 'error', error };
  }
}

export function syncStatus() {
  if (pendingSync) return 'Cloud sync pending';
  return 'All changes synced';
}
