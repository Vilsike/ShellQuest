let createClient;
const isNode = typeof process !== 'undefined' && !!process.versions?.node;
const isBrowser = !isNode && typeof window !== 'undefined' && typeof document !== 'undefined';

if (!isBrowser) {
  // Node/Jest: rely on the installed dependency
  const pkg = await import('@supabase/supabase-js');
  createClient = pkg.createClient;
} else {
  // Browser: load from the CDN so we can stay static without bundling
  const pkg = await import('https://esm.sh/@supabase/supabase-js@2.45.4');
  createClient = pkg.createClient;
}

const supabaseUrl = (typeof window !== 'undefined' && window.SUPABASE_URL) || process.env.SUPABASE_URL || 'https://YOUR_PROJECT.supabase.co';
const supabaseAnonKey = (typeof window !== 'undefined' && window.SUPABASE_ANON_KEY) || process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const isSupabaseConfigured = () => {
  const urlReady = supabaseUrl && !supabaseUrl.includes('YOUR_PROJECT');
  const keyReady = supabaseAnonKey && !supabaseAnonKey.includes('YOUR_SUPABASE_ANON_KEY');
  return urlReady && keyReady;
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true },
});
