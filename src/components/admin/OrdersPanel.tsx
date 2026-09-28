import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteOrder, fetchOrders, updateOrderStatus } from '../../lib/queries';
import { ORDER_STATUSES, type Order, type OrderStatus } from '../../lib/types';
import {
  DangerButton,
  EmptyState,
  ErrorState,
  formatDate,
  LoadingRows,
  naira,
  StatusPill,
} from './ui';

export function OrdersPanel() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');

  const load = useCallback(async () => {
    setError(null);
    try {
      setOrders(await fetchOrders(filter === 'all' ? undefined : filter));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load orders.');
      setOrders([]);
    }
  }, [filter]);

  useEffect(() => {
    setOrders(null);
    void load();
  }, [load]);

  const changeStatus = async (id: string, status: OrderStatus) => {
    // Optimistic: the table is the admin's main working surface.
    setOrders((prev) => prev?.map((o) => (o.id === id ? { ...o, status } : o)) ?? prev);
    try {
      await updateOrderStatus(id, status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update status.');
      void load();
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this order permanently? This cannot be undone.')) return;
    try {
      await deleteOrder(id);
      setOrders((prev) => prev?.filter((o) => o.id !== id) ?? prev);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete order.');
    }
  };

  const revenue = (orders ?? []).filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total_ngn, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-wide text-slate-900">Orders</h2>
          <p className="mt-0.5 text-sm text-slate-600">
            Checkout records from the website. {orders && `${orders.length} shown · ${naira(revenue)} value`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter orders by status">
          <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>
            All
          </FilterChip>
          {ORDER_STATUSES.map((s) => (
            <FilterChip key={s} active={filter === s} onClick={() => setFilter(s)}>
              {s}
            </FilterChip>
          ))}
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={() => void load()} />}

      {orders === null ? (
        <LoadingRows rows={6} label="Loading orders" />
      ) : orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          hint="Orders appear here as soon as a customer completes checkout on the website."
        />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} onStatus={changeStatus} onDelete={remove} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderRow({
  order,
  onStatus,
  onDelete,
}: {
  order: Order;
  onStatus: (id: string, status: OrderStatus) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-semibold text-slate-500">{order.reference}</span>
            <StatusPill value={order.status} />
          </div>
          <p className="mt-1.5 font-display text-lg font-bold text-slate-900">{order.customer_name}</p>
          <p className="text-sm text-slate-600">
            {order.product_name} · {order.bottle_count} × 500ml
          </p>
        </div>

        <div className="text-right">
          <p className="font-display text-xl font-bold text-slate-900">{naira(order.total_ngn)}</p>
          <p className="text-xs text-slate-500">{formatDate(order.created_at)}</p>
        </div>
      </div>

      <dl className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
        <div className="flex gap-2">
          <dt className="text-slate-500">Phone</dt>
          <dd className="font-medium text-slate-900">
            <a className="hover:text-red-700" href={`tel:${order.phone.replace(/\s+/g, '')}`}>
              {order.phone}
            </a>
          </dd>
        </div>
        {order.email && (
          <div className="flex gap-2">
            <dt className="text-slate-500">Email</dt>
            <dd className="truncate font-medium text-slate-900">{order.email}</dd>
          </div>
        )}
        {(order.address || order.city) && (
          <div className="flex gap-2 sm:col-span-2">
            <dt className="shrink-0 text-slate-500">Deliver to</dt>
            <dd className="font-medium text-slate-900">{[order.address, order.city].filter(Boolean).join(', ')}</dd>
          </div>
        )}
        {order.notes && (
          <div className="flex gap-2 sm:col-span-2">
            <dt className="shrink-0 text-slate-500">Notes</dt>
            <dd className="text-slate-700">{order.notes}</dd>
          </div>
        )}
      </dl>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
        <span className="text-xs font-semibold text-slate-500">Status</span>
        <div className="flex flex-wrap gap-1.5">
          {ORDER_STATUSES.map((s) => (
            <FilterChip key={s} active={order.status === s} onClick={() => onStatus(order.id, s)}>
              {s}
            </FilterChip>
          ))}
        </div>
        <DangerButton type="button" onClick={() => onDelete(order.id)} className="ml-auto px-2.5 py-1.5">
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">Delete</span>
        </DangerButton>
      </div>
    </article>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'rounded-lg px-2.5 py-1.5 text-xs font-semibold capitalize transition-colors',
        active
          ? 'bg-slate-900 text-white'
          : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-50',
      ].join(' ')}
    >
      {children}
    </button>
  );
}
