import { useState, type FormEvent } from 'react';
import { AlertCircle, Home, LogIn } from 'lucide-react';
import { useAdminAuth } from './AdminAuthProvider';
import { Field, inputClassOnDark, PrimaryButton } from './ui';

export function AdminLogin() {
  const { signIn, signInWithGoogle } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed.');
    } finally {
      setBusy(false);
    }
  };

  // The browser leaves for Google, so there is no "success" state to end up
  // in — the button just shows progress until the page navigates away.
  const handleGoogle = async () => {
    setError(null);
    setGoogleBusy(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed.');
      setGoogleBusy(false);
    }
  };

  return (
    <div className="grid min-h-dvh place-items-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-red-600 to-amber-500 font-display text-lg font-bold text-white">
            L
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold tracking-wide text-white">LESEKESE Admin</h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to manage orders, leads and blog posts.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/70 p-6">
          <button
            type="button"
            onClick={() => void handleGoogle()}
            disabled={googleBusy || busy}
            className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 active:scale-[0.98] disabled:opacity-70"
          >
            <GoogleMark />
            <span>{googleBusy ? 'Redirecting to Google…' : 'Continue with Google'}</span>
          </button>

          <div className="flex items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">or</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <Field label="Email address" htmlFor="admin-email" tone="dark">
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClassOnDark}
            />
          </Field>

          <Field label="Password" htmlFor="admin-password" tone="dark">
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClassOnDark}
            />
          </Field>

          {error && (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {error}
            </p>
          )}

          <PrimaryButton type="submit" busy={busy} className="w-full">
            <LogIn className="h-4 w-4" aria-hidden="true" />
            Sign in
          </PrimaryButton>

          <p className="text-center text-xs text-slate-400">
            Access is limited to allowlisted staff accounts.
          </p>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-white"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Back to website
          </a>
        </div>
      </div>
    </div>
  );
}

/** Inline so the button needs no network request or icon dependency. */
function GoogleMark() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.8Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.94-2.91l-3.88-3.01c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.11A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.29 14.28a7.2 7.2 0 0 1 0-4.56V6.61H1.28a12 12 0 0 0 0 10.78l4.01-3.11Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.61l4.01 3.11C6.23 6.86 8.88 4.75 12 4.75Z"
      />
    </svg>
  );
}
