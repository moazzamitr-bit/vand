import { useState } from 'react';
import { Plus, Pencil, Trash2, Layers } from 'lucide-react';
import { categories as initialCategories } from '../data/mockData';
import type { Category } from '../types';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import { useAppToast } from '../components/layout/AppLayout';

interface FormState {
  title: string;
  single_art: boolean;
  attachments_min: number;
  attachments_max: number;
}

const defaultForm: FormState = { title: '', single_art: false, attachments_min: 1, attachments_max: 5 };

export default function Categories() {
  const { addToast } = useAppToast();
  const [data, setData] = useState<Category[]>(initialCategories);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.title.trim()) e.title = 'Title is required.';
    if (form.attachments_min < 1) e.attachments_min = 'Min must be ≥ 1.';
    if (form.attachments_max < form.attachments_min) e.attachments_max = 'Max must be ≥ min.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openCreate = () => { setForm(defaultForm); setErrors({}); setEditing(null); setShowForm(true); };
  const openEdit = (c: Category) => { setForm({ title: c.title, single_art: c.single_art, attachments_min: c.attachments_min, attachments_max: c.attachments_max }); setErrors({}); setEditing(c); setShowForm(true); };

  const handleSave = () => {
    if (!validate()) return;
    if (editing) {
      setData((prev) => prev.map((c) => c.id === editing.id ? { ...c, ...form, last_updated: new Date().toISOString().slice(0, 10) } : c));
      addToast('Category updated.');
    } else {
      const newCat: Category = { id: `cat-${Date.now()}`, ...form, use_count: 0, last_updated: new Date().toISOString().slice(0, 10) };
      setData((prev) => [...prev, newCat]);
      addToast('Category created.');
    }
    setShowForm(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setData((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    addToast('Category deleted.');
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white">Categories</h1>
          <p className="text-slate-400 text-sm">{data.length} categories</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> New Category
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#161b27] border border-white/8 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-[#0d1018]">
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider font-medium">Title</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider font-medium">Single Art</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider font-medium">Attachments</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider font-medium">Use Count</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider font-medium">Last Updated</th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={6}><EmptyState icon={Layers} title="No categories" description="Create your first category to get started." /></td></tr>
              ) : (
                data.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-200">{c.title}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded border ${c.single_art ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30' : 'bg-slate-500/15 text-slate-400 border-slate-500/30'}`}>
                        {c.single_art ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{c.attachments_min}–{c.attachments_max}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-mono ${c.use_count > 0 ? 'text-slate-200' : 'text-slate-500'}`}>{c.use_count}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{c.last_updated}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => openEdit(c)}
                          title="Edit category"
                          className="p-1.5 rounded hover:bg-white/8 text-slate-400 hover:text-slate-200 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => c.use_count === 0 ? setDeleteTarget(c) : addToast('Cannot delete: category is in use.', 'warning')}
                          title={c.use_count > 0 ? 'Cannot delete: in use' : 'Delete category'}
                          className={`p-1.5 rounded transition-colors ${c.use_count > 0 ? 'text-slate-600 cursor-not-allowed' : 'hover:bg-red-500/10 text-slate-400 hover:text-red-400'}`}
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
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowForm(false)} />
          <div className="relative bg-[#1e2435] border border-white/10 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <h2 className="font-semibold text-white mb-4">{editing ? 'Edit Category' : 'New Category'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full bg-[#252d40] border border-white/10 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.single_art} onChange={(e) => setForm((f) => ({ ...f, single_art: e.target.checked }))} className="accent-indigo-500 w-4 h-4" />
                <span className="text-sm text-slate-300">Single Art Only</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Min Attachments *</label>
                  <input type="number" min={1} value={form.attachments_min} onChange={(e) => setForm((f) => ({ ...f, attachments_min: Number(e.target.value) }))} className="w-full bg-[#252d40] border border-white/10 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
                  {errors.attachments_min && <p className="text-red-400 text-xs mt-1">{errors.attachments_min}</p>}
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Max Attachments *</label>
                  <input type="number" min={1} value={form.attachments_max} onChange={(e) => setForm((f) => ({ ...f, attachments_max: Number(e.target.value) }))} className="w-full bg-[#252d40] border border-white/10 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
                  {errors.attachments_max && <p className="text-red-400 text-xs mt-1">{errors.attachments_max}</p>}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-300 bg-white/5 hover:bg-white/10 rounded-lg">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                {editing ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Category"
        message={`Delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
