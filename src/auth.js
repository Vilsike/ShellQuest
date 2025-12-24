import { supabase, isSupabaseConfigured } from './supabaseClient.js';
import { normalizeUsername, validateUsername } from './validators.js';

export const USERNAME_TAKEN_CODE = '23505';

export function assertValidUsername(username) {
  if (!validateUsername(username)) {
    const error = new Error('Invalid username');
    error.code = 'invalid_username';
    throw error;
  }
}

export async function createCloudProfile(username) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }
  assertValidUsername(username);
  const normalized = normalizeUsername(username);
  const { data, error } = await supabase
    .from('profiles')
    .insert({ username: normalized })
    .select('id, username')
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchCloudProfile(username) {
  if (!isSupabaseConfigured()) return null;
  const normalized = normalizeUsername(username);
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username')
    .eq('username', normalized)
    .maybeSingle();
  if (error) {
    if (error.code === 'PGRST116' || error.message?.includes('No rows')) {
      return null;
    }
    throw error;
  }
  return data || null;
}

export function usernameTaken(error) {
  return error?.code === USERNAME_TAKEN_CODE;
}
