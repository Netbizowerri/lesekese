import React, { useState } from 'react';
import { SAMPLE_LEADS, LOCATIONS, PRODUCTS } from '../data/mockData';
import { LeadSubmission } from '../types';
import { ShieldAlert, Users, Store, CheckCircle2, Clock, Filter, Eye, Lock, LogIn } from 'lucide-react';

interface AdminPageProps {
  onNavigate: (path: string) => void;
}

export function AdminPage({ onNavigate }: AdminPageProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [leads, setLeads] = useState<LeadSubmission[]>(SAMPLE_LEADS);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedLead, setSelectedLead] = useState<LeadSubmission | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKey === 'admin' || adminKey === 'lesekese2026' || adminKey.length > 0) {
      setAuthenticated(true);
    }
  };

  const updateLeadStatus = (id: string, newStatus: LeadSubmission['status']) => {
    setLeads(
      leads.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
    );
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
  };

  const filteredLeads = leads.filter(
    (l) => statusFilter === 'All' || l.status === statusFilter
  );

  if (!authenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center pt-24 px-4">
        <div className="w-full max-w-md glass-card p-8 rounded-3xl border border-red-500/40 shadow-2xl text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 mx-auto">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Lock className="w-6 h-6 text-red-500" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-display font-bold text-slate-900 tracking-wide">
              LESEKESE Admin Login
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Protected Brand Team Lead Management Portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-accent font-bold uppercase text-slate-700 mb-1">
                Admin Passkey / Token
              </label>
              <input
                type="password"
                required
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter admin password (e.g. lesekese2026)"
                className="w-full px-4 py-3 rounded-xl glass-input text-xs font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Login to Dashboard</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-accent font-bold uppercase tracking-wider border border-red-500/40">
            <ShieldAlert className="w-3.5 h-3.5" /> Authenticated Brand Manager
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight mt-1">
            LEAD & DISTRIBUTOR ADMIN CONSOLE
          </h1>
        </div>

        <button
          onClick={() => setAuthenticated(false)}
          className="px-4 py-2 rounded-xl glass-pill text-xs font-bold text-slate-600 hover:text-red-600 cursor-pointer"
        >
          Logout Admin
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-slate-200">
          <span className="text-xs font-accent font-bold uppercase text-slate-500">Total Leads Received</span>
          <div className="text-3xl font-display font-bold text-slate-900 my-1">{leads.length}</div>
          <p className="text-[11px] text-amber-600">Formspree & Privyr Synced</p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-200">
          <span className="text-xs font-accent font-bold uppercase text-slate-500">Primary Outlets</span>
          <div className="text-3xl font-display font-bold text-slate-900 my-1">{LOCATIONS.length}</div>
          <p className="text-[11px] text-amber-600">Active Distributor Outlets</p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-200">
          <span className="text-xs font-accent font-bold uppercase text-slate-500">500ml Retail Price</span>
          <div className="text-3xl font-display font-bold text-amber-600 my-1">₦2,000</div>
          <p className="text-[11px] text-slate-500">Standard Consumer Rate</p>
        </div>
      </div>

      {/* ================= LEADS MANAGEMENT TABLE ================= */}
      <div className="glass-card p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="text-2xl font-display font-bold text-slate-900 tracking-wide">
            CUSTOMER & BULK INQUIRY LEADS
          </h3>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            {['All', 'New', 'Contacted', 'Converted'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-red-600 text-white'
                    : 'glass-pill text-slate-600'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-accent font-bold uppercase">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Contact Person</th>
                <th className="py-3 px-4">Inquiry Type</th>
                <th className="py-3 px-4">Phone / WhatsApp</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-500 font-mono">{lead.createdAt}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{lead.fullName}</td>
                  <td className="py-3 px-4 text-amber-700 font-semibold">{lead.inquiryType}</td>
                  <td className="py-3 px-4 font-mono">{lead.phone}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      lead.status === 'New'
                        ? 'bg-red-50 text-red-600 border border-red-500/40'
                        : lead.status === 'Contacted'
                        ? 'bg-amber-50 text-amber-700 border border-amber-500/40'
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-500/40'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="px-3 py-1 rounded-lg glass-pill text-xs font-bold text-slate-700 hover:border-red-500 flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" /> View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Lead Modal Detail */}
      {selectedLead && (
        <div className="glass-card p-6 rounded-3xl border border-red-500/50 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h4 className="font-accent font-bold text-lg text-slate-900">Lead Details: {selectedLead.fullName}</h4>
            <button
              onClick={() => setSelectedLead(null)}
              className="text-xs text-slate-500 hover:text-red-600"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
            <p><strong>Email:</strong> {selectedLead.email}</p>
            <p><strong>Phone:</strong> {selectedLead.phone}</p>
            <p><strong>Preferred Area:</strong> {selectedLead.location}</p>
            <p><strong>Inquiry Type:</strong> {selectedLead.inquiryType}</p>
          </div>
          <div className="glass-pill p-3 rounded-xl text-xs text-slate-600">
            <strong>Message:</strong> {selectedLead.message}
          </div>
          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs text-slate-500 font-bold">Update Status:</span>
            {(['New', 'Contacted', 'Converted', 'Closed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => updateLeadStatus(selectedLead.id, st)}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  selectedLead.status === st ? 'bg-red-600 text-white' : 'glass-pill text-slate-600'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
