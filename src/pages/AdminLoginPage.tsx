import { useEffect } from 'react';
import { LoadingRows } from '../components/admin/ui';
import { AdminAuthProvider, useAdminAuth } from '../components/admin/AdminAuthProvider';
import { AdminLogin } from '../components/admin/AdminLogin';
import { NotConfigured } from './AdminPage';
import { isSupabaseConfigured } from '../lib/supabase';

/**
 * URL-based staff login at /adminlogin.
 *
 * Deliberately never linked from the site: nobody must know the login URL from
 * the public pages, and the dashboard itself forwards anonymous visitors here
 * instead of showing the form at /admin. Once a session exists, the page
 * pushes on to the dashboard at /admin.
 */
export function AdminLoginPage() {
  return (
    <AdminAuthProvider>
      <LoginGate />
    </AdminAuthProvider>
  );
}

function LoginGate() {
  const { session, loading } = useAdminAuth();

  // Email/password and Google round-trips both land sign-in-side here, so a
  // successful session means "go to the dashboard". A full reload is fine for
  // an auth boundary and avoids depending on App's in-memory router.
  useEffect(() => {
    if (!loading && session) {
      window.location.replace('/admin');
    }
  }, [session, loading]);

  if (!isSupabaseConfigured) {
    return <NotConfigured />;
  }

  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center bg-slate-950 px-4">
        <div className="w-full max-w-sm">
          <LoadingRows rows={3} label="Checking your session" />
        </div>
      </div>
    );
  }

  return <AdminLogin />;
}