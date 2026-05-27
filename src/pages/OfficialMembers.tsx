import { useState, useMemo } from 'react';
import { Search, Download, CheckCircle, XCircle, BadgeCheck, X } from 'lucide-react';
import { officialMembers as initialData, auditLogs as initialAudit } from '../data/mockData';
import type { OfficialMember, PaymentStatus, AuditLog } from '../types';
import StatusBadge from '../components/ui/StatusBadge';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import DetailDrawer, { DrawerSection, DrawerField } from '../components/ui/DetailDrawer';
import { useAppToast } from '../components/layout/AppLayout';

type Tab = 'all' | 'pending_review' | 'approved' | 'payment_pending' | 'completed' | 'rejected';

const TABS: { id: Tab; label: string }[] = [
  { id: 'pending_review', label: 'Pending Review' },
  { id: 'approved', label: 'Approved' },
  { id: 'payment_pending', label: 'Payment Pending' },
  { id: 'completed', label: 'Completed' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'all', label: 'All' },
];

export default function OfficialMembers() {
  const { addToast } = useAppToast();
  const [data, setData] = useState<OfficialMember[]>(initialData);
  const [audit, setAudit] = useState<AuditLog[]>(initialAudit);
  const [tab, setTab] = useState<Tab>('pending_review');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<OfficialMember | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState<OfficialMember | null>(null);
  const [confirmPayment, setConfirmPayment] = useState<{ member: OfficialMember; status: PaymentStatus } | null>(null);

  const filtered = useMemo(() => data.filter((m) => {
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()) || m.certificate_code.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (tab === 'all') return true;
    if (tab === 'pending_review') return m.review_status === 'pending_review';
    if (tab === 'approved') return m.review_status === 'approved' && m.payment_status !== 'completed';
    if (tab === 'payment_pending') return m.payment_status === 'pending' && m.review_status === 'approved';
    if (tab === 'completed') return m.review_status === 'approved' && m.payment_status === 'completed';
    if (tab === 'rejected') return m.review_status === 'rejected';
    return true;
  }), [data, tab, search]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const tabCount = (t: Tab) => {
    if (t === 'all') return data.length;
    if (t === 'pending_review') return data.filter((m) => m.review_status === 'pending_review').length;
    if (t === 'approved') return data.filter((m) => m.review_status === 'approved' && m.payment_status !== 'completed').length;
    if (t === 'payment_pending') return data.filter((m) => m.payment_status === 'pending' && m.review_status === 'approved').length;
    if (t === 'completed') return data.filter((m) => m.review_status === 'approved' && m.payment_status === 'completed').length;
    if (t === 'rejected') return data.filter((m) => m.review_status === 'rejected').length;
    return 0;
  };

  const addAudit = (action: string, target: string, details: string) => {
    const entry: AuditLog = { id: `al-${Date.now()}`, timestamp: new Date().toISOString(), user: 'Admin', action, target, details };
    setAudit((prev) => [entry, ...prev]);
  };

  const approve = (m: OfficialMember) => {
    setData((prev) => prev.map((x) => x.id === m.id ? { ...x, review_status: 'approved', reviewed_by: 'Admin', reviewed_at: new Date().toISOString().slice(0, 10) } : x));
    addAudit('APPROVED', `Member: ${m.name}`, 'Membership application approved');
    addToast(`${m.name} approved.`);
    if (selected?.id === m.id) setSelected((s) => s ? { ...s, review_status: 'approved' } : s);
  };

  const reject = () => {
    if (!showRejectModal) return;
    if (!rejectReason.trim()) { addToast('Please provide a rejection reason.', 'error'); return; }
    setData((prev) => prev.map((x) => x.id === showRejectModal.id ? { ...x, review_status: 'rejected', reject_reason: rejectReason, reviewed_by: 'Admin', reviewed_at: new Date().toISOString().slice(0, 10) } : x));
    addAudit('REJECTED', `Member: ${showRejectModal.name}`, `Reason: ${rejectReason}`);
    addToast(`${showRejectModal.name} rejected.`);
    setShowRejectModal(null);
    setRejectReason('');
  };

  const updatePayment = () => {
    if (!confirmPayment) return;
    const { member, status } = confirmPayment;
    setData((prev) => prev.map((x) => x.id === member.id ? { ...x, payment_status: status } : x));
    addAudit('PAYMENT_UPDATED', `Member: ${member.name}`, `Payment status set to ${status}`);
    addToast(`Payment status updated to ${status}.`);
    setConfirmPayment(null);
  };

  const exportCSV = () => {
    const rows = [
      ['Certificate Code', 'Name', 'Email', 'Design Field', 'Position', 'Review Status', 'Payment Status', 'Request Date', 'Country'],
      ...filtered.map((m) => [m.certificate_code, m.name, m.email, m.design_field, m.position, m.review_status, m.payment_status, m.request_date, m.country]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'official_members.csv'; a.click();
    URL.revokeObjectURL(url);
    addToast('Export complete.');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white">Official Members</h1>
          <p className="text-slate-400 text-sm">{filtered.length} records in current view</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm rounded-lg transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search name, email or certificate code…" className="w-full bg-[#161b27] border border-white/8 text-slate-200 placeholder-slate-600 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-white/8 overflow-x-auto">
        {TABS.map((t) => {
          const count = tabCount(t.id);
          return (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setPage(1); }}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${tab === t.id ? 'border-indigo-500 text-indigo-300' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              {t.label}
              {count > 0 && <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.id ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/8 text-slate-400'}`}>{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-[#161b27] border border-white/8 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-[#0d1018]">
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Member</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Certificate</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Field / Position</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Review</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Payment</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 w-32" />
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={7}><EmptyState icon={BadgeCheck} title="No members in this view" /></td></tr>
              ) : (
                paginated.map((m) => (
                  <tr key={m.id} className="border-b border-white/5 hover:bg-white/2 transition-colors cursor-pointer" onClick={() => setSelected(m)}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-200">{m.name}</p>
                      <p className="text-xs text-slate-500">{m.email}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">{m.certificate_code}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-slate-300">{m.design_field}</p>
                      <p className="text-xs text-slate-500">{m.position}</p>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={m.review_status} /></td>
                    <td className="px-4 py-3"><StatusBadge status={m.payment_status} /></td>
                    <td className="px-4 py-3 text-xs text-slate-500">{m.request_date}</td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1 justify-end">
                        {m.review_status === 'pending_review' && (
                          <>
                            <button onClick={() => approve(m)} title="Approve" className="p-1.5 rounded hover:bg-green-500/15 text-slate-400 hover:text-green-400 transition-colors"><CheckCircle className="w-4 h-4" /></button>
                            <button onClick={() => { setShowRejectModal(m); setRejectReason(''); }} title="Reject" className="p-1.5 rounded hover:bg-red-500/15 text-slate-400 hover:text-red-400 transition-colors"><XCircle className="w-4 h-4" /></button>
                          </>
                        )}
                        {m.review_status === 'approved' && m.payment_status !== 'completed' && (
                          <select
                            value={m.payment_status}
                            onChange={(e) => setConfirmPayment({ member: m, status: e.target.value as PaymentStatus })}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#252d40] border border-white/10 text-slate-300 rounded px-2 py-1 text-xs"
                          >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                            <option value="canceled">Canceled</option>
                          </select>
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

      {/* Detail drawer */}
      <DetailDrawer
        open={!!selected}
        title={selected?.name ?? ''}
        subtitle={selected?.certificate_code}
        onClose={() => setSelected(null)}
        footer={
          selected?.review_status === 'pending_review' ? (
            <div className="flex gap-2">
              <button onClick={() => { approve(selected); setSelected(null); }} className="flex-1 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">Approve</button>
              <button onClick={() => setShowRejectModal(selected)} className="flex-1 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">Reject</button>
            </div>
          ) : null
        }
      >
        {selected && (
          <>
            <DrawerSection title="Identity">
              <DrawerField label="Full Name" value={selected.name} />
              <DrawerField label="Email" value={selected.email} />
              <DrawerField label="Phone" value={selected.phone} />
              <DrawerField label="Country" value={selected.country} />
              <DrawerField label="Portfolio" value={selected.portfolio_url ? <a href={selected.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">{selected.portfolio_url}</a> : undefined} />
            </DrawerSection>
            <DrawerSection title="Membership">
              <DrawerField label="Certificate Code" value={<code className="font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded text-xs">{selected.certificate_code}</code>} />
              <DrawerField label="Design Field" value={selected.design_field} />
              <DrawerField label="Position" value={selected.position} />
              <DrawerField label="Request Date" value={selected.request_date} />
            </DrawerSection>
            <DrawerSection title="Status">
              <DrawerField label="Review Status" value={<StatusBadge status={selected.review_status} />} />
              <DrawerField label="Payment Status" value={<StatusBadge status={selected.payment_status} />} />
              {selected.reject_reason && <DrawerField label="Rejection Reason" value={<span className="text-red-300">{selected.reject_reason}</span>} />}
              <DrawerField label="Reviewed By" value={selected.reviewed_by} />
              <DrawerField label="Reviewed At" value={selected.reviewed_at} />
            </DrawerSection>
            <DrawerSection title="Audit Log">
              {audit.filter((a) => a.target.includes(selected.name)).length === 0
                ? <p className="text-xs text-slate-500 italic">No audit entries for this member.</p>
                : audit.filter((a) => a.target.includes(selected.name)).map((a) => (
                  <div key={a.id} className="flex items-start gap-2 mb-2 text-xs">
                    <span className="text-slate-600 min-w-32">{a.timestamp.replace('T', ' ')}</span>
                    <span className="font-medium text-slate-300">{a.action}</span>
                    <span className="text-slate-500">{a.details}</span>
                  </div>
                ))
              }
            </DrawerSection>
          </>
        )}
      </DetailDrawer>

      {/* Reject modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowRejectModal(null)} />
          <div className="relative bg-[#1e2435] border border-white/10 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Reject Application</h2>
              <button onClick={() => setShowRejectModal(null)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <p className="text-slate-400 text-sm mb-3">Rejecting application for <span className="text-slate-200 font-medium">{showRejectModal.name}</span>.</p>
            <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Rejection Reason *</label>
            <textarea rows={3} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Explain why this application is being rejected…" className="w-full bg-[#252d40] border border-white/10 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 resize-none" />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowRejectModal(null)} className="px-4 py-2 text-sm text-slate-300 bg-white/5 hover:bg-white/10 rounded-lg">Cancel</button>
              <button onClick={reject} className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg">Reject Application</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmPayment}
        title="Update Payment Status"
        message={`Set payment status to "${confirmPayment?.status}" for ${confirmPayment?.member.name}? This action is logged.`}
        confirmLabel="Confirm"
        variant="warning"
        onConfirm={updatePayment}
        onCancel={() => setConfirmPayment(null)}
      />
    </div>
  );
}
