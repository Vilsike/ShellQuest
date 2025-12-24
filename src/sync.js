import { supabase, isSupabaseConfigured } from './supabaseClient.js';
import { getLocalSave, setLocalSave } from './storage.js';

let pendingSync = false;
let currentUserId = null;

export function setCurrentUser(userId) {
  currentUserId = userId;
}

function normalizeSave(save, updatedAt) {
  if (!save) return null;
  return { ...save, updatedAt: updatedAt || save.updatedAt || new Date().toISOString() };
}

export function mergeSaves(localSave, cloudRecord) {
  const cloudSave = cloudRecord ? normalizeSave(cloudRecord.save, cloudRecord.updated_at) : null;
  const local = normalizeSave(localSave, localSave?.updatedAt);

  if (!cloudSave && local) return { save: local, source: 'local' };
  if (cloudSave && !local) return { save: cloudSave, source: 'cloud' };

  const localTime = new Date(local.updatedAt || 0).getTime();
  const cloudTime = new Date(cloudSave.updatedAt || 0).getTime();

  if (cloudTime > localTime) {
    return { save: cloudSave, source: 'cloud' };
  }
  return { save: local, source: 'local' };
}

async function fetchCloudSave() {
  if (!currentUserId) return { data: null, error: null };
  if (!isSupabaseConfigured()) return { data: null, error: new Error('Supabase not configured') };
  return supabase.from('progress').select('save, updated_at').eq('user_id', currentUserId).maybeSingle();
}

export async function syncFromCloud() {
  const local = getLocalSave();
  const { data, error } = await fetchCloudSave();
  if (error) {
    console.warn('Could not fetch cloud save', error);
    pendingSync = true;
    return { applied: 'local', save: local };
  }

  if (!data) {
    await pushSave(local);
    return { applied: 'local', save: local };
  }

  const merged = mergeSaves(local, data);
  setLocalSave(merged.save);
  if (merged.source === 'local') {
    await pushSave(merged.save);
  }
  return { applied: merged.source, save: merged.save };
}

export async function pushSave(save) {
  if (!currentUserId) return null;
  if (!isSupabaseConfigured()) return null;
  const payload = { user_id: currentUserId, save, updated_at: new Date().toISOString() };
  const { error } = await supabase.from('progress').upsert(payload, { onConflict: 'user_id' });
  if (error) throw error;
  return payload;
}

export function markPendingSync() {
  pendingSync = true;
}

export function hasPendingSync() {
  return pendingSync;
}

export async function attemptPendingSync() {
  if (!pendingSync) return;
  if (!currentUserId) return;
  try {
    const local = getLocalSave();
    await pushSave(local);
    pendingSync = false;
  } catch (error) {
    console.warn('Retry sync failed', error);
    pendingSync = true;
  }
}
