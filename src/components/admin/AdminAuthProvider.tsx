import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSupabase } from '../../lib/supabase';
import {
  fetchAdminProfile,
  signIn as sbSignIn,
  signInWithGoogle as sbSignInWithGoogle,
  signOut as sbSignOut,
} from '../../lib/queries';
import type { AdminUser } from '../../lib/types';

interface AdminAuthValue {
  session: Session | null;
  profile: AdminUser | null;
  /** True until the first session + allowlist lookup settles. */
  loading: boolean;
  /** Set when the user is signed in but absent from the admin allowlist. */
  notAuthorised: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  /** Re-reads the allowlist for the current session. */
  refreshProfile: (next: Session | null) => Promise<void>;
  /** True while refreshProfile is in flight. */
  rechecking: boolean;
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function useAdminAuth(): AdminAuthValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used inside <AdminAuthProvider>');
  return ctx;
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [notAuthorised, setNotAuthorised] = useState(false);
  /**
   * Re-checks the allowlist for an already-signed-in user. Needed because the
   * first lookup is cached for the life of the session: an admin who is added
   * to admin_users *after* they signed in would otherwise be stuck on
   * "not authorised" until they signed out and back in.
   */
  const [rechecking, setRechecking] = useState(false);

  const refreshProfile = async (next: Session | null) => {
    const sb = getSupabase();
    if (!sb || !next) return;
    setRechecking(true);
    try {
      const row = await fetchAdminProfile(next.user.id);
      setProfile(row);
      setNotAuthorised(row === null);
    } catch {
      setProfile(null);
      setNotAuthorised(true);
    } finally {
      setRechecking(false);
    }
  };

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setLoading(false);
      return;
    }

    let active = true;

    // Resolve the allowlist row whenever the identity changes.
    const resolveProfile = async (next: Session | null) => {
      if (!active) return;
      if (!next) {
        setProfile(null);
        setNotAuthorised(false);
        setLoading(false);
        return;
      }
      try {
        const row = await fetchAdminProfile(next.user.id);
        if (!active) return;
        setProfile(row);
        setNotAuthorised(row === null);
      } catch {
        if (!active) return;
        setProfile(null);
        setNotAuthorised(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    sb.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session ?? null);
      void resolveProfile(data.session ?? null);
    });

    const { data: sub } = sb.auth.onAuthStateChange(async (event, next) => {
      // supabase-js can emit SIGNED_OUT when the tab regains focus and an
      // in-place token refresh fails, even though a valid session still
      // exists in this tab. Belief had it that a sign-out is a sign-out, so
      // the whole admin (and any unsaved post draft below it) unmounted.
      // Verify against getSession() before believing it.
      if (event === 'SIGNED_OUT' && !next) {
        const { data: recovered } = await sb.auth.getSession();
        if (recovered.session) {
          setSession(recovered.session);
          setLoading(false);
          return;
        }
      }
      setSession(next);
      setLoading(true);
      void resolveProfile(next);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // refreshProfile/rechecking are added below, outside the memo, because
  // refreshProfile is recreated on every render and would defeat memoisation.
  const value = useMemo<Omit<AdminAuthValue, 'refreshProfile' | 'rechecking'>>(
    () => ({
      session,
      profile,
      loading,
      notAuthorised,
      signIn: async (email, password) => {
        await sbSignIn(email, password);
      },
      signInWithGoogle: async () => {
        await sbSignInWithGoogle();
      },
      signOut: async () => {
        await sbSignOut();
        setProfile(null);
        setNotAuthorised(false);
      },
    }),
    [session, profile, loading, notAuthorised]
  );

  return (
    <AdminAuthContext.Provider value={{ ...value, refreshProfile, rechecking }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
