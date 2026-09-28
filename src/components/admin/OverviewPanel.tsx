import { useEffect, useState } from 'react';
import { FileText, MessageSquare, ShoppingBag } from 'lucide-react';
import { fetchLeads, fetchOrders, fetchPosts } from '../../lib/queries';
import type { Lead, Order, Post } from '../../lib/types';
import { formatDate, naira, StatusPill } from './ui';
import type { AdminView } from './AdminShell';

export function OverviewPanel({ onNavigate }: { onNavigate: (v: AdminView) => void }) {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    // Dashboard is a summary: failures here must not blank the other tiles.
    fetchOrders().then(setOrders).catch(() => setOrders([]));
    fetchLeads().then(setLeads).catch(() => setLeads([]));
    fetchPosts().then(setPosts).catch(() => setPosts([]));
  }, []);

  const live = orders?.filter((o) => o.status !== 'cancelled') ?? [];
  const revenue = live.reduce((s, o) => s + o.total_ngn, 0);
  const openLeads = leads?.filter((l) => l.status === 'new').length;
  const draftPosts = posts?.filter((p) => p.status === 'draft').length;
  const recent = orders?.slice(0, 5) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-wide text-slate-900">Dashboard</h2>
        <p className="mt-0.5 text-sm text-slate-600">Live figures from the website.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatTile
          label="Live orders"
          value={orders ? String(live.length) : '—'}
          sub={orders ? `${naira(revenue)} value` : 'Loading'}
          icon={ShoppingBag}
          onClick={() => onNavigate('orders')}
        />
        <StatTile
          label="New leads"
          value={leads ? String(openLeads ?? 0) : '—'}
          sub={leads ? 'Awaiting first response' : 'Loading'}
          icon={MessageSquare}
          onClick={() => onNavigate('leads')}
        />
        <StatTile
          label="Draft posts"
          value={posts ? String(draftPosts ?? 0) : '—'}
          sub={posts ? 'Not yet published' : 'Loading'}
          icon={FileText}
          onClick={() => onNavigate('posts')}
        />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <h3 className="font-display text-lg font-bold text-slate-900">Latest orders</h3>
          <button
            type="button"
            onClick={() => onNavigate('orders')}
            className="text-xs font-semibold text-red-700 hover:underline"
          >
            View all
          </button>
        </div>

        {!orders ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">Loading orders…</p>
        ) : recent.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">
            No orders yet. They will appear here as customers check out.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recent.map((order) => (
              <li key={order.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3">
                <span className="font-mono text-xs text-slate-500">{order.reference}</span>
                <span className="min-w-0 flex-1 truncate font-medium text-slate-900">{order.customer_name}</span>
                <span className="text-xs text-slate-500">{formatDate(order.created_at)}</span>
                <span className="font-semibold text-slate-900">{naira(order.total_ngn)}</span>
                <StatusPill value={order.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatTile({
  label,
  value,
  sub,
  icon: Icon,
  onClick,
}: {
  label: string;
  value: string;
  sub: string;
  icon: typeof ShoppingBag;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-transform active:scale-[0.99] hover:border-slate-300"
    >
      <div className="flex items-center gap-2 text-slate-500">
        <Icon className="h-4 w-4" aria-hidden="true" />
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 font-display text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-0.5 text-xs text-slate-500">{sub}</p>
    </button>
  );
}
