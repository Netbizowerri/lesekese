import { AlertTriangle, Database, LogOut, RefreshCw } from 'lucide-react';
import { AdminAuthProvider, useAdminAuth } from '../components/admin/AdminAuthProvider';
import { AdminShell, type AdminView } from '../components/admin/AdminShell';
import { OverviewPanel } from '../components/admin/OverviewPanel';
import { OrdersPanel } from '../components/admin/OrdersPanel';
import { PostsPanel } from '../components/admin/PostsPanel';
import { LeadsPanel } from '../components/admin/LeadsPanel';
import { GhostButton, LoadingRows, PrimaryButton } from '../components/admin/ui';
import { isSupabaseConfigured } from '../lib/supabase';
import { useEffect, useState, type ReactNode } from 'react';

/**
 * LESEKESE Admin CMS.
 *
 * Replaces the previous passkey form, which compared a hardcoded string in the
 * browser bundle and read from mock data. Access is now a Supabase session
 * plus a row in the `admin_users` allowlist, enforced by RLS.
 *
 * The dashboard is deliberately chrome-free: no site Navbar or Footer, since
 * staff should not have to scroll past marketing content to work.
 */
export function AdminPage() {
  return (
    <AdminAuthProvider>
      <AdminGate />
    </AdminAuthProvider>
  );
}

function AdminGate() {
  const { session, profile, loading, notAuthorised, signOut, refreshProfile, rechecking } = useAdminAuth();
  const [view, setView] = useState<AdminView>('dashboard');

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

  if (!session) {
    // The login form has moved to /adminlogin. Anonymous visitors to /admin
    // are forwarded there so the dashboard URL itself never exposes the form.
    return <ForwardTo to="/adminlogin" />;
  }

  if (notAuthorised || !profile) {
    return (
      <NotAuthorised
        email={session.user.email ?? null}
        onSignOut={() => void signOut()}
        onRetry={() => void refreshProfile(session)}
        retrying={rechecking}
      />
    );
  }

  return (
    <AdminShell view={view} onViewChange={setView}>
      {view === 'dashboard' && <OverviewPanel onNavigate={setView} />}
      {view === 'orders' && <OrdersPanel />}
      {view === 'posts' && <PostsPanel />}
      {view === 'leads' && <LeadsPanel />}
    </AdminShell>
  );
}

function ForwardTo({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return (
    <div className="grid min-h-dvh place-items-center bg-slate-950 px-4">
      <div className="w-full max-w-sm">
        <LoadingRows rows={3} label="Redirecting to sign in" />
      </div>
    </div>
  );
}

export function NotConfigured() {
  return (
    <div className="grid min-h-dvh place-items-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900/70 p-6">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-500/20">
          <Database className="h-5 w-5 text-amber-400" aria-hidden="true" />
        </span>
        <h1 className="mt-4 font-display text-xl font-bold text-white">Supabase is not connected</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          The admin CMS needs your Supabase project credentials before it can load orders, leads or
          blog posts. The public website is unaffected.
        </p>

        <ol className="mt-5 space-y-2.5 text-sm text-slate-300">
          <Step n={1}>Create the project in the Supabase dashboard.</Step>
          <Step n={2}>
            Run <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs">supabase/migrations/0001_admin_cms.sql</code>.
          </Step>
          <Step n={3}>
            Add <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs">VITE_SUPABASE_URL</code> and{' '}
            <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs">
              VITE_SUPABASE_PUBLISHABLE_KEY
            </code>{' '}
            to <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs">.env</code>.
          </Step>
          <Step n={4}>Create a user in Authentication, then add their email to the admin allowlist.</Step>
        </ol>
      </div>
    </div>
  );
}

function Step({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li className="flex gap-2.5">
      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/10 text-[11px] font-bold text-white">
        {n}
      </span>
      <span className="min-w-0">{children}</span>
    </li>
  );
}

function NotAuthorised({
  email,
  onSignOut,
  onRetry,
  retrying,
}: {
  email: string | null;
  onSignOut: () => void;
  onRetry: () => void;
  retrying: boolean;
}) {
  return (
    <div className="grid min-h-dvh place-items-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-center">
        <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-red-500/20">
          <AlertTriangle className="h-5 w-5 text-red-300" aria-hidden="true" />
        </span>
        <h1 className="mt-4 font-display text-xl font-bold text-white">Not an authorised admin</h1>
        <p className="mt-2 text-sm text-slate-300">
          You are signed in{email ? <> as <span className="font-mono text-white">{email}</span></> : null}, but this
          account is not on the staff allowlist. Ask a team lead to add it.
        </p>
        <p className="mt-3 text-xs leading-relaxed text-slate-400">
          Signing in with Google still requires an allowlist entry — a Google account on its own grants no access.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <GhostButton type="button" onClick={onSignOut}>
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </GhostButton>
          <PrimaryButton type="button" onClick={onRetry} busy={retrying}>
            <RefreshCw className={`h-4 w-4 ${retrying ? 'animate-spin' : ''}`} aria-hidden="true" />
            Check again
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
