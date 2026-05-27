import { useState, useMemo } from 'react';
import { Search, Trash2, Users as UsersIcon, AlertTriangle, Eye, X } from 'lucide-react';
import { users as initialData } from '../data/mockData';
import type { User, UserRole } from '../types';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import DetailDrawer, { DrawerSection, DrawerField } from '../components/ui/DetailDrawer';
import { useAppToast } from '../components/layout/AppLayout';

const roleOptions: UserRole[] = ['admin', 'finance', 'competition_manager', 'viewer', 'member'];

interface Filters { search: string; role: string; }

export default function Users() {
  const { addToast } = useAppToast();
  const [data, setData] = useState<User[]>(initialData);
  const [filters, setFilters] = useState<Filters>({ search: '', role: '' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [confirmText, setConfirmText] = useState('');
  const [showChangeEmail, setShowChangeEmail] = useState<User | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [showChangePw, setShowChangePw] = useState<User | null>(null);
  const [newPw, setNewPw] = useState('');

  const normalizedEmails = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((u) => { const key = u.email.toLowerCase(); counts[key] = (counts[key] ?? 0) + 1; });
    return counts;
  }, [data]);

  const filtered = useMemo(() => data.filter((u) => {
    if (filters.search && !u.name.toLowerCase().includes(filters.search.toLowerCase()) && !u.email.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.role && !u.roles.includes(filters.role as UserRole)) return false;
    return true;
  }), [data, filters]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const duplicateEmails = useMemo(() => new Set(Object.entries(normalizedEmails).filter(([, v]) => v > 1).map(([k]) => k)), [normalizedEmails]);

  const handleDelete = () => {
    if (!deleteTarget || confirmText !== deleteTarget.email) return;
    setData((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    addToast(`User ${deleteTarget.email} deleted.`);
    setDeleteTarget(null);
    setConfirmText('');
  };

  const handleChangeEmail = () => {
    if (!showChangeEmail || !newEmail.trim()) return;
    setData((prev) => prev.map((u) => u.id === showChangeEmail.id ? { ...u, email: newEmail.toLowerCase().trim() } : u));
    addToast('Email updated.');
    setShowChangeEmail(null);
    setNewEmail('');
  };

  const handleChangePw = () => {
    if (!showChangePw || newPw.length < 8) { addToast('Password must be at least 8 characters.', 'error'); return; }
    addToast('Password updated (mock).');
    setShowChangePw(null);
    setNewPw('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white">Users</h1>
          <p className="text-slate-400 text-sm">{filtered.length} users</p>
        </div>
        {duplicateEmails.size > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-yellow-300">{duplicateEmails.size} duplicate email(s) detected</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={filters.search} onChange={(e) => { setFilters((f) => ({ ...f, search: e.target.value })); setPage(1); }} placeholder="Search name or email…" className="w-full bg-[#161b27] border border-white/8 text-slate-200 placeholder-slate-600 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500" />
        </div>
        <select value={filters.role} onChange={(e) => { setFilters((f) => ({ ...f, role: e.target.value })); setPage(1); }} className="bg-[#161b27] border border-white/8 text-slate-300 rounded-lg px-3 py-2 text-sm">
          <option value="">All Roles</option>
          {roleOptions.map((r) => <option key={r} value={r}>{r.replace('_', ' ').replace(/^\w/, (c) => c.toUpperCase())}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#161b27] border border-white/8 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-[#0d1018]">
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">User</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Roles</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Registered</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Last Active</th>
                <th className="px-4 py-3 w-28" />
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={5}><EmptyState icon={UsersIcon} title="No users found" /></td></tr>
              ) : (
                paginated.map((u) => {
                  const isDuplicate = duplicateEmails.has(u.email.toLowerCase());
                  return (
                    <tr key={u.id} onClick={() => setSelected(u)} className="border-b border-white/5 hover:bg-white/2 transition-colors cursor-pointer">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-indigo-600/30 flex-shrink-0 flex items-center justify-center">
                            <span className="text-indigo-300 text-xs font-semibold">{u.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-200">{u.name}</p>
                            <div className="flex items-center gap-1">
                              <p className="text-xs text-slate-500">{u.email}</p>
                              {isDuplicate && <span title="Duplicate email (case-insensitive)"><AlertTriangle className="w-3 h-3 text-yellow-400" /></span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {u.roles.map((r) => <StatusBadge key={r} status={r} />)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">{u.register_date}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{u.last_activity}</td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => setSelected(u)} title="View" className="p-1.5 rounded hover:bg-white/8 text-slate-400 hover:text-slate-200 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                          <button
                            onClick={() => { setDeleteTarget(u); setConfirmText(''); }}
                            title="Delete user"
                            className="p-1.5 rounded hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} pageSize={pageSize} total={filtered.length} onPageChange={setPage} onPageSizeChange={setPageSize} />
      </div>

      {/* Detail drawer */}
      <DetailDrawer
        open={!!selected}
        title={selected?.name ?? ''}
        subtitle={selected?.email}
        onClose={() => setSelected(null)}
        footer={
          <div className="flex gap-2">
            <button onClick={() => { setShowChangeEmail(selected); setNewEmail(selected?.email ?? ''); setSelected(null); }} className="flex-1 py-2 text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg transition-colors">Change Email</button>
            <button onClick={() => { setShowChangePw(selected); setNewPw(''); setSelected(null); }} className="flex-1 py-2 text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg transition-colors">Change Password</button>
          </div>
        }
      >
        {selected && (
          <>
            <DrawerSection title="Account">
              <DrawerField label="Name" value={selected.name} />
              <DrawerField label="Email" value={selected.email} />
              <DrawerField label="Roles" value={<div className="flex flex-wrap gap-1 mt-0.5">{selected.roles.map((r) => <StatusBadge key={r} status={r} />)}</div>} />
              <DrawerField label="Registered" value={selected.register_date} />
              <DrawerField label="Last Active" value={selected.last_activity} />
            </DrawerSection>
          </>
        )}
      </DetailDrawer>

      {/* Delete confirmation (strong) */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-[#1e2435] border border-white/10 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Delete User</h2>
              <button onClick={() => setDeleteTarget(null)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <p className="text-slate-400 text-sm mb-1">This action is <span className="text-red-300 font-medium">irreversible</span>. All data associated with this user will be lost.</p>
            <p className="text-slate-400 text-sm mb-3">Type <code className="text-red-300 bg-red-500/10 px-1 rounded text-xs">{deleteTarget.email}</code> to confirm.</p>
            <input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder={deleteTarget.email} className="w-full bg-[#252d40] border border-white/10 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 mb-4" />
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm text-slate-300 bg-white/5 hover:bg-white/10 rounded-lg">Cancel</button>
              <button
                onClick={handleDelete}
                disabled={confirmText !== deleteTarget.email}
                className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change email modal */}
      {showChangeEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowChangeEmail(null)} />
          <div className="relative bg-[#1e2435] border border-white/10 rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6">
            <h2 className="font-semibold text-white mb-4">Change Email</h2>
            <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">New Email</label>
            <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="w-full bg-[#252d40] border border-white/10 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 mb-4" />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowChangeEmail(null)} className="px-4 py-2 text-sm text-slate-300 bg-white/5 hover:bg-white/10 rounded-lg">Cancel</button>
              <button onClick={handleChangeEmail} className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Change password modal */}
      {showChangePw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowChangePw(null)} />
          <div className="relative bg-[#1e2435] border border-white/10 rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6">
            <h2 className="font-semibold text-white mb-4">Change Password for {showChangePw.name}</h2>
            <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">New Password</label>
            <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Minimum 8 characters" className="w-full bg-[#252d40] border border-white/10 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 mb-4" />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowChangePw(null)} className="px-4 py-2 text-sm text-slate-300 bg-white/5 hover:bg-white/10 rounded-lg">Cancel</button>
              <button onClick={handleChangePw} className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">Update Password</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
