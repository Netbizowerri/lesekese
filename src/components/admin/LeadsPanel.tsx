import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { fetchLeads, updateLeadStatus } from '../../lib/queries';
import { LEAD_STATUSES, type Lead, type LeadStatus } from '../../lib/types';
import { EmptyState, ErrorState, formatDate, LoadingRows, StatusPill } from './ui';

export function LeadsPanel() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<LeadStatus | 'all'>('all');

  const load = useCallback(async () => {
    setError(null);
    try {
      setLeads(await fetchLeads(filter === 'all' ? undefined : filter));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load leads.');
      setLeads([]);
    }
  }, [filter]);

  useEffect(() => {
    setLeads(null);
    void load();
  }, [load]);

  const changeStatus = async (id: string, status: LeadStatus) => {
    setLeads((prev) => prev?.map((l) => (l.id === id ? { ...l, status } : l)) ?? prev);
    try {
      await updateLeadStatus(id, status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update status.');
      void load();
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-wide text-slate-900">Leads</h2>
          <p className="mt-0.5 text-sm text-slate-600">Bulk, retailer and support inquiries from the contact form.</p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter leads by status">
          <Chip active={filter === 'all'} onClick={() => setFilter('all')}>
            All
          </Chip>
          {LEAD_STATUSES.map((s) => (
            <Chip key={s} active={filter === s} onClick={() => setFilter(s)}>
              {s}
            </Chip>
          ))}
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={() => void load()} />}

      {leads === null ? (
        <LoadingRows rows={5} label="Loading leads" />
      ) : leads.length === 0 ? (
        <EmptyState title="No leads yet" hint="Inquiries submitted through the contact form will land here." />
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <article key={lead.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display text-lg font-bold text-slate-900">{lead.full_name}</p>
                  {lead.inquiry_type && (
                    <p className="text-sm font-medium text-amber-700">{lead.inquiry_type}</p>
                  )}
                </div>
                <StatusPill value={lead.status} />
              </div>

              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                {lead.phone && (
                  <a className="font-medium text-slate-900 hover:text-red-700" href={`tel:${lead.phone.replace(/\s+/g, '')}`}>
                    {lead.phone}
                  </a>
                )}
                {lead.email && (
                  <a className="font-medium text-slate-900 hover:text-red-700" href={`mailto:${lead.email}`}>
                    {lead.email}
                  </a>
                )}
                {lead.location && <span className="text-slate-600">{lead.location}</span>}
                <span className="text-xs text-slate-500">{formatDate(lead.created_at)}</span>
              </div>

              {lead.message && (
                <p className="mt-3 whitespace-pre-wrap rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700">
                  {lead.message}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3">
                <span className="mr-1 text-xs font-semibold text-slate-500">Set status</span>
                {LEAD_STATUSES.map((s) => (
                  <Chip key={s} active={lead.status === s} onClick={() => changeStatus(lead.id, s)}>
                    {s}
                  </Chip>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'rounded-lg px-2.5 py-1.5 text-xs font-semibold capitalize transition-colors',
        active ? 'bg-slate-900 text-white' : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-50',
      ].join(' ')}
    >
      {children}
    </button>
  );
}
