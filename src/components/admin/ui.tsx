import type { ReactNode } from 'react';
import { AlertCircle, Inbox, Loader2 } from 'lucide-react';

/* ------------------------------------------------------------------ *
 * Status pill
 * ------------------------------------------------------------------ */

const TONE: Record<string, string> = {
  new: 'bg-red-50 text-red-700 border-red-200',
  contacted: 'bg-amber-50 text-amber-800 border-amber-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  converted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-slate-100 text-slate-600 border-slate-200',
  closed: 'bg-slate-100 text-slate-600 border-slate-200',
  draft: 'bg-slate-100 text-slate-600 border-slate-200',
  published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  archived: 'bg-amber-50 text-amber-800 border-amber-200',
};

export function StatusPill({ value, label }: { value: string; label?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold capitalize ${
        TONE[value] ?? TONE.closed
      }`}
    >
      {label ?? value}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * States
 * ------------------------------------------------------------------ */

export function LoadingRows({ rows = 5, label }: { rows?: number; label?: string }) {
  return (
    <div className="space-y-2" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{label ?? 'Loading'}</span>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-14 animate-pulse rounded-xl border border-slate-200 bg-slate-100"
          style={{ animationDelay: `${i * 90}ms` }}
        />
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-14 text-center">
      <span className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white">
        <Inbox className="h-5 w-5 text-slate-400" aria-hidden="true" />
      </span>
      <p className="font-display text-lg font-bold text-slate-800">{title}</p>
      {hint && <p className="max-w-sm text-sm text-slate-500">{hint}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-2xl border border-red-200 bg-red-50/70 px-5 py-4"
    >
      <div className="flex items-start gap-2.5">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-red-900">Something went wrong</p>
          <p className="mt-0.5 text-sm text-red-800">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 transition-transform active:scale-[0.98] hover:bg-red-50"
        >
          Try again
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Form controls
 * ------------------------------------------------------------------ */

const CONTROL =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/30 disabled:bg-slate-50';

/**
 * Input for the dark auth card.
 *
 * Deliberately written out in full instead of `inputClass + overrides`:
 * Tailwind resolves conflicting utilities by their order in the compiled
 * stylesheet, NOT by their order in the class attribute. Appending
 * `text-white`/`bg-slate-950` to CONTROL therefore does not reliably win, and
 * produced white text on a white background. Keeping this self-contained
 * removes the conflict at the source.
 */
const CONTROL_ON_DARK =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/30 disabled:bg-slate-50';

export function Field({
  label,
  hint,
  error,
  children,
  htmlFor,
  tone = 'light',
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  htmlFor?: string;
  /** 'dark' is for labels sitting on the near-black auth card. */
  tone?: 'light' | 'dark';
}) {
  const labelTone = tone === 'dark' ? 'text-slate-200' : 'text-slate-700';
  const hintTone = tone === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const errorTone = tone === 'dark' ? 'text-red-300' : 'text-red-700';

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className={`text-xs font-semibold ${labelTone}`}>
        {label}
      </label>
      {children}
      {hint && !error && <p className={`text-xs ${hintTone}`}>{hint}</p>}
      {error && (
        <p className={`text-xs font-medium ${errorTone}`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputClass = CONTROL;
export const inputClassOnDark = CONTROL_ON_DARK;
export const textareaClass = `${CONTROL} min-h-32 resize-y`;

/* ------------------------------------------------------------------ *
 * Buttons
 * ------------------------------------------------------------------ */

export function PrimaryButton({
  children,
  busy,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { busy?: boolean }) {
  return (
    <button
      {...rest}
      disabled={rest.disabled || busy}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export function DangerButton({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3.5 py-2 text-sm font-semibold text-red-700 transition-colors hover:border-red-300 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ *
 * Formatting
 * ------------------------------------------------------------------ */

export const naira = (n: number) => `₦${n.toLocaleString('en-NG')}`;

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' });
}
