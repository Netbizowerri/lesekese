import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;

// Supabase renamed the browser-safe key from "anon" (a long JWT) to
// "publishable" (sb_publishable__...). Accept either so older projects keep
// working without a code change.
const key =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ??
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined);

/**
 * True when both Supabase env vars are present.
 *
 * The public site must keep working when the CMS is not configured (a fresh
 * clone, a preview deploy, CI), so every caller checks this first and renders
 * a setup notice instead of throwing.
 */
export const isSupabaseConfigured = Boolean(url && key);

let client: SupabaseClient | null = null;

/** Lazily created so bundlers never inline an undefined-key client. */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient(url!, key!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        // Required for the OAuth round trip: on returning from Google,
        // supabase-js finds the ?code= (PKCE) or #access_token= fragment and
        // exchanges it for a session before the app renders.
        detectSessionInUrl: true,
      },
    });
  }
  return client;
}
