import { useState, useMemo } from 'react';
import { Plus, Pencil, PowerOff, Ticket, AlertTriangle, X } from 'lucide-react';
import { invitationCodes as initialData } from '../data/mockData';
import type { InvitationCode, CodeType, CodeScope } from '../types';
import StatusBadge from '../components/ui/StatusBadge';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import { useAppToast } from '../components/layout/AppLayout';

interface Filters { search: string; type: string; active: string; scope: string; }
const defaultFilters: Filters = { search: '', type: '', active: '', scope: '' };

type FormState = Omit<InvitationCode, 'id' | 'use_count' | 'last_updated'>;
const defaultForm: FormState = { code: '', type: 'percentage', value: 10, active_status: true, max_uses: null, expires_at: null, scope: 'all', campaign_name: '' };

export default function InvitationCodes() {
  const { addToast } = useAppToast();
  const [data, setData] = useState<InvitationCode[]>(initialData);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<InvitationCode | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deactivateTarget, setDeactivateTarget] = useState<InvitationCode | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => data.filter((c) => {
    if (filters.search && !c.code.toLowerCase().includes(filters.search.toLowerCase()) && !c.campaign_name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.type && c.type !== filters.type) return false;
    if (filters.active === 'active' && !c.active_status) return false;
    if (filters.active === 'inactive' && c.active_status) return false;
    if (filters.scope && c.scope !== filters.scope) return false;
    return true;
  }), [data, filters]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const highRisk = data.filter((c) => c.type === 'percentage' && c.value === 100 && c.active_status);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.code.trim()) e.code = 'Code is required.';
    if (form.value <= 0) e.value = 'Value must be > 0.';
    if (form.type === 'percentage' && form.value > 100) e.value = 'Percentage cannot exceed 100.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openCreate = () => { setForm(defaultForm); setErrors({}); setEditing(null); setShowForm(true); };
  const openEdit = (c: InvitationCode) => {
    setForm({ code: c.code, type: c.type, value: c.value, active_status: c.active_status, max_uses: c.max_uses, expires_at: c.expires_at, scope: c.scope, campaign_name: c.campaign_name });
    setErrors({}); setEditing(c); setShowForm(true);
  };

  const handleSave = () => {
    if (!validate()) return;
    const now = new Date().toISOString().slice(0, 10);
    if (editing) {
      setData((prev) => prev.map((c) => c.id === editing.id ? { ...c, ...form, last_updated: now } : c));
      addToast('Code updated.');
    } else {
      setData((prev) => [...prev, { id: `ic-${Date.now()}`, ...form, use_count: 0, last_updated: now }]);
      addToast('Code created.');
    }
    setShowForm(false);
  };

  const handleDeactivate = () => {
    if (!deactivateTarget) return;
    setData((prev) => prev.map((c) => c.id === deactivateTarget.id ? { ...c, active_status: false, last_updated: new Date().toISOString().slice(0, 10) } : c));
    addToast('Code deactivated.');
    setDeactivateTarget(null);
  };

  const f = (k: keyof FormState, v: unknown) => setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white">Invitation Codes</h1>
          <p className="text-slate-400 text-sm">{filtered.length} codes</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> New Code
        </button>
      </div>

      {highRisk.length > 0 && (
        <div className="flex items-start gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-300"><span className="font-medium">{highRisk.length} high-risk code(s) active:</span> {highRisk.map((c) => c.code).join(', ')} — 100% discount, consider deactivating.</p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          value={filters.search}
          onChange={(e) => { setFilters((f) => ({ ...f, search: e.target.value })); setPage(1); }}
          placeholder="Search code or campaign…"
          className="flex-1 min-w-40 bg-[#161b27] border border-white/8 text-slate-200 placeholder-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
        />
        {([
          { key: 'type' as const, opts: [['', 'All Types'], ['fixed', 'Fixed'], ['percentage', 'Percentage']] },
          { key: 'active' as const, opts: [['', 'All Status'], ['active', 'Active'], ['inactive', 'Inactive']] },
          { key: 'scope' as const, opts: [['', 'All Scopes'], ['membership', 'Membership'], ['award', 'Award'], ['all', 'All Products']] },
        ] as const).map(({ key, opts }) => (
          <select key={key} value={filters[key]} onChange={(e) => { setFilters((f) => ({ ...f, [key]: e.target.value })); setPage(1); }}
            className="bg-[#161b27] border border-white/8 text-slate-300 rounded-lg px-3 py-2 text-sm">
            {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#161b27] border border-white/8 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-[#0d1018]">
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Code</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Value</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Scope</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Usage</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Expires</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Campaign</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={9}><EmptyState icon={Ticket} title="No codes found" /></td></tr>
              ) : (
                paginated.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded text-xs">{c.code}</code>
                        {c.type === 'percentage' && c.value === 100 && c.active_status && (
                          <span title="High risk: 100% discount"><AlertTriangle className="w-3.5 h-3.5 text-red-400" /></span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize text-slate-400 text-xs">{c.type}</td>
                    <td className="px-4 py-3 font-mono text-slate-200 text-sm">
                      {c.type === 'percentage' ? `${c.value}%` : `€${c.value}`}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={c.scope === 'all' ? 'member' : c.scope} /></td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {c.use_count} / {c.max_uses ?? '∞'}
                      {c.max_uses && (
                        <div className="h-1 w-16 bg-white/8 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(100, (c.use_count / c.max_uses) * 100)}%` }} />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{c.expires_at ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{c.campaign_name || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded border ${c.active_status ? 'bg-green-500/15 text-green-400 border-green-500/30' : 'bg-slate-500/15 text-slate-400 border-slate-500/30'}`}>
                        {c.active_status ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => openEdit(c)} title="Edit" className="p-1.5 rounded hover:bg-white/8 text-slate-400 hover:text-slate-200 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                        {c.active_status && (
                          <button onClick={() => setDeactivateTarget(c)} title="Deactivate" className="p-1.5 rounded hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"><PowerOff className="w-3.5 h-3.5" /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} pageSize={pageSize} total={filtered.length} onPageChange={setPage} onPageSizeChange={setPageSize} />
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowForm(false)} />
          <div className="relative bg-[#1e2435] border border-white/10 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-white">{editing ? 'Edit Code' : 'New Invitation Code'}</h2>
              <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Code *</label>
                <input value={form.code} onChange={(e) => f('code', e.target.value.toUpperCase())} placeholder="e.g. SUMMER25" className="w-full bg-[#252d40] border border-white/10 text-slate-200 font-mono rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
                {errors.code && <p className="text-red-400 text-xs mt-1">{errors.code}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Type</label>
                  <select value={form.type} onChange={(e) => f('type', e.target.value as CodeType)} className="w-full bg-[#252d40] border border-white/10 text-slate-300 rounded-lg px-3 py-2 text-sm">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed (€)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Value *</label>
                  <input type="number" min={0} max={form.type === 'percentage' ? 100 : undefined} value={form.value} onChange={(e) => f('value', Number(e.target.value))} className="w-full bg-[#252d40] border border-white/10 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
                  {errors.value && <p className="text-red-400 text-xs mt-1">{errors.value}</p>}
                </div>
              </div>
              {form.type === 'percentage' && form.value === 100 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <p className="text-xs text-red-300">This is a 100% discount code — high risk. Use with caution.</p>
                </div>
              )}
              <div>
                <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Scope</label>
                <select value={form.scope} onChange={(e) => f('scope', e.target.value as CodeScope)} className="w-full bg-[#252d40] border border-white/10 text-slate-300 rounded-lg px-3 py-2 text-sm">
                  <option value="all">All Products</option>
                  <option value="membership">Membership Only</option>
                  <option value="award">Award Only</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Max Uses</label>
                  <input type="number" min={1} value={form.max_uses ?? ''} onChange={(e) => f('max_uses', e.target.value ? Number(e.target.value) : null)} placeholder="Unlimited" className="w-full bg-[#252d40] border border-white/10 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Expires At</label>
                  <input type="date" value={form.expires_at ?? ''} onChange={(e) => f('expires_at', e.target.value || null)} className="w-full bg-[#252d40] border border-white/10 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Campaign Name</label>
                <input value={form.campaign_name} onChange={(e) => f('campaign_name', e.target.value)} className="w-full bg-[#252d40] border border-white/10 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active_status} onChange={(e) => f('active_status', e.target.checked)} className="accent-indigo-500 w-4 h-4" />
                <span className="text-sm text-slate-300">Active</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-300 bg-white/5 hover:bg-white/10 rounded-lg">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                {editing ? 'Save Changes' : 'Create Code'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deactivateTarget} title="Deactivate Code" message={`Deactivate code "${deactivateTarget?.code}"? It will no longer be usable.`} confirmLabel="Deactivate" variant="warning" onConfirm={handleDeactivate} onCancel={() => setDeactivateTarget(null)} />
    </div>
  );
}
