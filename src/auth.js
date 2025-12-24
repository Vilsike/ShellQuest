import { supabase, isSupabaseConfigured } from './supabaseClient.js';
import { validateUsername } from './validators.js';
import { setCurrentUser, syncFromCloud, markPendingSync } from './sync.js';

export async function bootstrapSession() {
  if (!isSupabaseConfigured()) {
    return { session: null, profile: null };
  }
  const { data } = await supabase.auth.getSession();
  if (data?.session) {
    setCurrentUser(data.session.user.id);
    const profile = await loadProfile();
    await syncFromCloud();
    return { session: data.session, profile };
  }
  return { session: null, profile: null };
}

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  if (data?.session?.user) setCurrentUser(data.session.user.id);
  markPendingSync();
  return data;
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (data?.session?.user) setCurrentUser(data.session.user.id);
  await syncFromCloud();
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
  setCurrentUser(null);
}

export async function loadProfile() {
  const session = await supabase.auth.getSession();
  const userId = session?.data?.session?.user?.id;
  if (!userId) return null;
  setCurrentUser(userId);
  const { data, error } = await supabase.from('profiles').select('username').eq('user_id', userId).maybeSingle();
  if (error) {
    console.warn('Profile fetch failed', error);
    return null;
  }
  return data;
}

export async function claimUsername(username) {
  const trimmed = username?.trim();
  if (!validateUsername(trimmed)) {
    throw new Error('Invalid username');
  }
  const session = await supabase.auth.getSession();
  const userId = session?.data?.session?.user?.id;
  if (!userId) throw new Error('Not signed in');
  const { error } = await supabase.from('profiles').insert({ user_id: userId, username: trimmed });
  if (error) throw error;
  return { username: trimmed };
}
