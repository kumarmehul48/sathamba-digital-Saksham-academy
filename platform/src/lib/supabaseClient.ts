import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfiguredUrl = (u?: string): boolean => {
  if (!u || typeof u !== 'string') return false;
  const trimmed = u.trim();
  if (!trimmed || trimmed === '' || trimmed.includes('your-supabase-id')) return false;
  return trimmed.startsWith('http://') || trimmed.startsWith('https://');
};

const isConfiguredKey = (k?: string): boolean => {
  if (!k || typeof k !== 'string') return false;
  const trimmed = k.trim();
  return trimmed !== '' && !trimmed.includes('your-supabase-anon-key');
};

export const isBackendConfigured = isConfiguredUrl(rawUrl) && isConfiguredKey(rawAnonKey);

if (!isBackendConfigured) {
  console.warn('SDSA: missing or unconfigured VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.');
}

// Syntactically valid inert fallback URL & JWT key to prevent createClient initialization crashes on static builds
const inertUrl = 'https://unconfigured.supabase.co';
const inertAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.s653eP02B8iC63567-5555';

export const supabase = createClient(
  isBackendConfigured ? (rawUrl as string).trim() : inertUrl,
  isBackendConfigured ? (rawAnonKey as string).trim() : inertAnonKey
);

export default supabase;
