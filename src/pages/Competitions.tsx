import { useState, useMemo } from 'react';
import { Plus, Pencil, Archive, Trash2, Trophy, Filter, X } from 'lucide-react';
import { competitions as initialData, categories } from '../data/mockData';
import type { Competition, CompetitionStatus, PublicationStatus } from '../types';
import StatusBadge from '../components/ui/StatusBadge';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import { useAppToast } from '../components/layout/AppLayout';

const statusOptions: CompetitionStatus[] = ['draft', 'active', 'judging', 'archived'];

interface Filters { status: string; category: string; publication: string; search: string; }
const defaultFilters: Filters = { status: '', category: '', publication: '', search: '' };

type FormState = Omit<Competition, 'id' | 'submissions_count' | 'judges_count' | 'last_updated'>;
const defaultForm: FormState = {
  title: '', status: 'draft', publication_status: 'unpublished', category: '',
  start_date: '', end_date: '', judging_end_date: '', judges_type: 'panel',
  price: 0, attachments_count: 3, description: '',
};

export default function Competitions() {
  const { addToast } = useAppToast();
  const [data, setData] = useState<Competition[]>(initialData);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Competition | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<Competition | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<Competition | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => data.filter((c) => {
    if (filters.status && c.status !== filters.status) return false;
    if (filters.category && c.category !== filters.category) return false;
    if (filters.publication && c.publication_status !== filters.publication) return false;
    if (filters.search && !c.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  }), [data, filters]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const activeFilters = Object.values(filters).filter(Boolean).length;

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required.';
    if (!form.category) e.category = 'Category is required.';
    if (!form.start_date) e.start_date = 'Start date is required.';
    if (!form.end_date) e.end_date = 'End date is required.';
    if (form.price < 0) e.price = 'Price must be ≥ 0.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openCreate = () => { setForm(defaultForm); setErrors({}); setEditing(null); setShowForm(true); };
  const openEdit = (c: Competition) => {
    setForm({ title: c.title, status: c.status, publication_status: c.publication_status, category: c.category, start_date: c.start_date, end_date: c.end_date, judging_end_date: c.judging_end_date, judges_type: c.judges_type, price: c.price, attachments_count: c.attachments_count, description: c.description });
    setErrors({}); setEditing(c); setShowForm(true);
  };

  const handleSave = () => {
    if (!validate()) return;
    const now = new Date().toISOString().slice(0, 10);
    if (editing) {
      setData((prev) => prev.map((c) => c.id === editing.id ? { ...c, ...form, last_updated: now } : c));
      addToast('Competition updated.');
    } else {
      setData((prev) => [...prev, { id: `comp-${Date.now()}`, ...form, submissions_count: 0, judges_count: 0, last_updated: now }]);
      addToast('Competition created.');
    }
    setShowForm(false);
  };

  const handleArchive = () => {
    if (!archiveTarget) return;
    setData((prev) => prev.map((c) => c.id === archiveTarget.id ? { ...c, status: 'archived', last_updated: new Date().toISOString().slice(0, 10) } : c));
    addToast('Competition archived.');
    setArchiveTarget(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setData((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    addToast('Competition deleted.');
    setDeleteTarget(null);
  };

  const f = (k: keyof FormState, v: unknown) => setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white">Competitions</h1>
          <p className="text-slate-400 text-sm">{filtered.length} competitions</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 border text-sm rounded-lg transition-colors ${activeFilters > 0 ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}
          >
            <Filter className="w-4 h-4" /> Filter {activeFilters > 0 && `(${activeFilters})`}
          </button>
          <button onClick={openCreate} className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors">
            <Plus className="w-4 h-4" /> New Competition
          </button>
        </div>
      </div>

      {/* Search */}
      <input
        value={filters.search}
        onChange={(e) => { setFilters((f) => ({ ...f, search: e.target.value })); setPage(1); }}
        placeholder="Search competitions…"
        className="w-full bg-[#161b27] border border-white/8 text-slate-200 placeholder-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
      />

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-[#161b27] border border-white/8 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-300">Filter Competitions</h3>
            <button onClick={() => { setFilters(defaultFilters); setPage(1); }} className="text-xs text-indigo-400 hover:text-indigo-300">Reset</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Status', key: 'status' as const, options: statusOptions },
              { label: 'Category', key: 'category' as const, options: categories.map((c) => c.title) },
              { label: 'Publication', key: 'publication' as const, options: ['published', 'unpublished'] as PublicationStatus[] },
            ].map(({ label, key, options }) => (
              <div key={key}>
                <label className="block text-xs text-slate-500 mb-1">{label}</label>
                <select
                  value={filters[key]}
                  onChange={(e) => { setFilters((f) => ({ ...f, [key]: e.target.value })); setPage(1); }}
                  className="w-full bg-[#252d40] border border-white/10 text-slate-300 rounded px-2 py-1.5 text-sm"
                >
                  <option value="">All</option>
                  {options.map((o) => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#161b27] border border-white/8 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-[#0d1018]">
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Title</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Published</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Category</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Dates</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Price</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Submissions</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Judges</th>
                <th className="px-4 py-3 w-24" />
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={9}><EmptyState icon={Trophy} title="No competitions found" description="Adjust filters or create a new competition." /></td></tr>
              ) : (
                paginated.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-200 max-w-xs truncate">{c.title}</p>
                      <p className="text-xs text-slate-500">{c.judges_type} judging</p>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3"><StatusBadge status={c.publication_status} /></td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{c.category}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-slate-400">{c.start_date} – {c.end_date}</p>
                      <p className="text-xs text-slate-600">Judging: {c.judging_end_date}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-300 font-mono text-xs">€{c.price}</td>
                    <td className="px-4 py-3">
                      <button className="text-indigo-400 hover:text-indigo-300 font-mono text-sm transition-colors">{c.submissions_count}</button>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-mono text-sm ${c.judges_count === 0 && c.status === 'active' ? 'text-yellow-400' : 'text-slate-400'}`}>{c.judges_count}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => openEdit(c)} title="Edit" className="p-1.5 rounded hover:bg-white/8 text-slate-400 hover:text-slate-200 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                        {c.status !== 'archived' && (
                          <button onClick={() => setArchiveTarget(c)} title="Archive" className="p-1.5 rounded hover:bg-yellow-500/10 text-slate-400 hover:text-yellow-400 transition-colors"><Archive className="w-3.5 h-3.5" /></button>
                        )}
                        <button
                          onClick={() => c.submissions_count > 0 ? addToast('Cannot delete: competition has submissions.', 'warning') : setDeleteTarget(c)}
                          title={c.submissions_count > 0 ? 'Has submissions' : 'Delete'}
                          className={`p-1.5 rounded transition-colors ${c.submissions_count > 0 ? 'text-slate-600 cursor-not-allowed' : 'hover:bg-red-500/10 text-slate-400 hover:text-red-400'}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-8">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowForm(false)} />
          <div className="relative bg-[#1e2435] border border-white/10 rounded-xl shadow-2xl w-full max-w-2xl mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-white">{editing ? 'Edit Competition' : 'New Competition'}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Title *</label>
                <input value={form.title} onChange={(e) => f('title', e.target.value)} className="w-full bg-[#252d40] border border-white/10 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Category *</label>
                <select value={form.category} onChange={(e) => f('category', e.target.value)} className="w-full bg-[#252d40] border border-white/10 text-slate-300 rounded-lg px-3 py-2 text-sm">
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c.id} value={c.title}>{c.title}</option>)}
                </select>
                {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Status</label>
                <select value={form.status} onChange={(e) => f('status', e.target.value as CompetitionStatus)} className="w-full bg-[#252d40] border border-white/10 text-slate-300 rounded-lg px-3 py-2 text-sm">
                  {statusOptions.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Publication Status</label>
                <select value={form.publication_status} onChange={(e) => f('publication_status', e.target.value as PublicationStatus)} className="w-full bg-[#252d40] border border-white/10 text-slate-300 rounded-lg px-3 py-2 text-sm">
                  <option value="unpublished">Unpublished</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Price (€)</label>
                <input type="number" min={0} value={form.price} onChange={(e) => f('price', Number(e.target.value))} className="w-full bg-[#252d40] border border-white/10 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Start Date *</label>
                <input type="date" value={form.start_date} onChange={(e) => f('start_date', e.target.value)} className="w-full bg-[#252d40] border border-white/10 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
                {errors.start_date && <p className="text-red-400 text-xs mt-1">{errors.start_date}</p>}
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">End Date *</label>
                <input type="date" value={form.end_date} onChange={(e) => f('end_date', e.target.value)} className="w-full bg-[#252d40] border border-white/10 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
                {errors.end_date && <p className="text-red-400 text-xs mt-1">{errors.end_date}</p>}
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Judging End Date</label>
                <input type="date" value={form.judging_end_date} onChange={(e) => f('judging_end_date', e.target.value)} className="w-full bg-[#252d40] border border-white/10 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Judges Type</label>
                <select value={form.judges_type} onChange={(e) => f('judges_type', e.target.value)} className="w-full bg-[#252d40] border border-white/10 text-slate-300 rounded-lg px-3 py-2 text-sm">
                  {['panel', 'expert', 'community'].map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Attachments Count</label>
                <input type="number" min={1} value={form.attachments_count} onChange={(e) => f('attachments_count', Number(e.target.value))} className="w-full bg-[#252d40] border border-white/10 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => f('description', e.target.value)} className="w-full bg-[#252d40] border border-white/10 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-300 bg-white/5 hover:bg-white/10 rounded-lg">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                {editing ? 'Save Changes' : 'Create Competition'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!archiveTarget} title="Archive Competition" message={`Archive "${archiveTarget?.title}"?`} confirmLabel="Archive" variant="warning" onConfirm={handleArchive} onCancel={() => setArchiveTarget(null)} />
      <ConfirmDialog open={!!deleteTarget} title="Delete Competition" message={`Delete "${deleteTarget?.title}"? This cannot be undone.`} confirmLabel="Delete" variant="danger" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
