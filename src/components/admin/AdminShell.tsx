import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FileText, LayoutDashboard, LogOut, Menu, MessageSquare, ShoppingBag, X } from 'lucide-react';
import { useAdminAuth } from './AdminAuthProvider';
import type { AdminRole } from '../../lib/types';

export type AdminView = 'dashboard' | 'orders' | 'posts' | 'leads';

export interface NavItem {
  id: AdminView;
  label: string;
  icon: typeof Menu;
  hint: string;
}

export const ADMIN_NAV: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, hint: 'Overview' },
  { id: 'orders', label: 'Orders', icon: ShoppingBag, hint: 'Checkout' },
  { id: 'posts', label: 'Blog Posts', icon: FileText, hint: 'Content' },
  { id: 'leads', label: 'Leads', icon: MessageSquare, hint: 'Inquiries' },
];

interface AdminShellProps {
  view: AdminView;
  onViewChange: (view: AdminView) => void;
  children: ReactNode;
}

export function AdminShell({ view, onViewChange, children }: AdminShellProps) {
  const { profile, signOut } = useAdminAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Escape closes the drawer on mobile.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [drawerOpen, setDrawerOpen]);

  /**
   * The core mobile behaviour: choosing a section closes the drawer so the
   * panel yields the full viewport to the page, then returns to the top.
   */
  const handleSelect = (id: AdminView) => {
    onViewChange(id);
    setDrawerOpen(false);
    window.scrollTo({ top: 0 });
  };

  const active = ADMIN_NAV.find((n) => n.id === view) ?? ADMIN_NAV[0];

  return (
    <div className="min-h-dvh bg-slate-100 font-sans text-slate-900">
      {/* ---------- Mobile top bar ---------- */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white px-3 py-2.5 lg:hidden">
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setDrawerOpen((v) => !v)}
          aria-expanded={drawerOpen}
          aria-controls="admin-drawer"
          aria-label={drawerOpen ? 'Close admin menu' : 'Open admin menu'}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-300 text-slate-700 transition-transform active:scale-[0.98]"
        >
          {drawerOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-bold uppercase tracking-wide text-slate-900">
            {active.label}
          </p>
          <p className="truncate text-[11px] text-slate-500">LESEKESE Admin</p>
        </div>
      </header>

      {/* ---------- Scrim (mobile only) ---------- */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setDrawerOpen(false)}
            aria-label="Close admin menu"
            className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ---------- Sidebar ---------- */}
      <aside
        id="admin-drawer"
        className={[
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-950 text-slate-300',
          'transition-[transform,width] duration-200 ease-out',
          drawerOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full',
          collapsed ? 'lg:w-20' : 'lg:w-64',
          'lg:translate-x-0 lg:shadow-none',
        ].join(' ')}
      >
        {/* Brand */}
        <div className={`flex h-16 items-center gap-2.5 border-b border-white/10 px-4 ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-red-600 to-amber-500 font-display text-sm font-bold text-white">
            L
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-bold tracking-wide text-white">LESEKESE</p>
              <p className="truncate text-[10px] uppercase tracking-[0.18em] text-slate-400">Admin CMS</p>
            </div>
          )}
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close admin menu"
            className="ml-auto grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:bg-white/10 lg:hidden"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3" aria-label="Admin sections">
          <ul className="space-y-1">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === view;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={[
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors',
                      isActive
                        ? 'bg-red-600 text-white'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white',
                      collapsed ? 'lg:justify-center lg:px-0' : '',
                    ].join(' ')}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {!collapsed && (
                      <span className="flex-1 truncate">
                        {item.label}
                        <span className={`block text-[10px] font-normal ${isActive ? 'text-red-100' : 'text-slate-500'}`}>
                          {item.hint}
                        </span>
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Account */}
        <div className={`border-t border-white/10 p-3 ${collapsed ? 'lg:px-2' : ''}`}>
          <div className={`flex items-center gap-3 rounded-lg px-2 py-2 ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-bold text-white">
              {(profile?.email ?? '?').charAt(0).toUpperCase()}
            </span>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white">{profile?.email ?? 'Signed in'}</p>
                <p className="truncate text-[10px] uppercase tracking-wider text-slate-400">
                  {(profile?.role ?? 'admin') as AdminRole}
                </p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => void signOut()}
            className={[
              'mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white',
              collapsed ? 'lg:justify-center lg:px-0' : '',
            ].join(' ')}
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* ---------- Content ---------- */}
      <div className={`transition-[padding] duration-200 ${collapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {/* Desktop collapse control */}
        <div className="hidden items-center gap-3 border-b border-slate-200 bg-white px-5 py-2.5 lg:flex">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expand admin menu' : 'Collapse admin menu'}
            aria-expanded={!collapsed}
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-300 text-slate-600 transition-transform active:scale-[0.98] hover:bg-slate-50"
          >
            <Menu className="h-4 w-4" aria-hidden="true" />
          </button>
          <p className="font-display text-sm font-bold uppercase tracking-wide text-slate-900">{active.label}</p>
        </div>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
