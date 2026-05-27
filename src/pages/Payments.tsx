import { useState, useMemo } from 'react';
import { Search, Download, CreditCard, AlertTriangle } from 'lucide-react';
import { payments as initialData } from '../data/mockData';
import type { Payment } from '../types';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import DetailDrawer, { DrawerSection, DrawerField } from '../components/ui/DetailDrawer';
import { useAppToast } from '../components/layout/AppLayout';

interface Filters { search: string; type: string; status: string; }
const defaultFilters: Filters = { search: '', type: '', status: '' };

export default function Payments() {
  const { addToast } = useAppToast();
  const [data] = useState<Payment[]>(initialData);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<Payment | null>(null);

  const filtered = useMemo(() => {
    const lower = filters.search.toLowerCase();
    return data.filter((p) => {
      if (filters.search && !p.email.toLowerCase().includes(lower) && !p.reference_code.toLowerCase().includes(lower)) return false;
      if (filters.type && p.type !== filters.type) return false;
      if (filters.status && p.status !== filters.status) return false;
      return true;
    });
  }, [data, filters]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const totals = useMemo(() => ({
    amount: filtered.reduce((s, p) => s + p.amount, 0),
    discount: filtered.reduce((s, p) => s + p.discount, 0),
    tax: filtered.reduce((s, p) => s + p.tax, 0),
    total: filtered.reduce((s, p) => s + p.total, 0),
    successful: filtered.filter((p) => p.status === 'successful').length,
    failed: filtered.filter((p) => p.status === 'failed').length,
  }), [filtered]);

  const emailCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((p) => { const key = p.email.toLowerCase(); counts[key] = (counts[key] ?? 0) + 1; });
    return counts;
  }, [data]);

  const exportCSV = () => {
    const rows = [
      ['Reference', 'Email', 'Type', 'Amount', 'Discount', 'Tax', 'Total', 'Status', 'Date'],
      ...filtered.map((p) => [p.reference_code, p.email, p.type, p.amount, p.discount, p.tax, p.total, p.status, p.last_update]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'payments.csv'; a.click();
    URL.revokeObjectURL(url);
    addToast('Export complete.');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white">Payment History</h1>
          <p className="text-slate-400 text-sm">{filtered.length} records</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm rounded-lg transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Gross Amount', value: `€${totals.amount.toFixed(2)}` },
          { label: 'Discounts', value: `-€${totals.discount.toFixed(2)}` },
          { label: 'Tax', value: `€${totals.tax.toFixed(2)}` },
          { label: 'Net Total', value: `€${totals.total.toFixed(2)}`, highlight: true },
        ].map((s) => (
          <div key={s.label} className={`bg-[#161b27] border rounded-lg px-4 py-3 ${s.highlight ? 'border-indigo-500/30' : 'border-white/8'}`}>
            <p className="text-xs text-slate-400 uppercase tracking-wider">{s.label}</p>
            <p className={`text-lg font-semibold mt-0.5 ${s.highlight ? 'text-indigo-300' : 'text-slate-200'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={filters.search} onChange={(e) => { setFilters((f) => ({ ...f, search: e.target.value })); setPage(1); }} placeholder="Search email or reference…" className="w-full bg-[#161b27] border border-white/8 text-slate-200 placeholder-slate-600 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500" />
        </div>
        <select value={filters.type} onChange={(e) => { setFilters((f) => ({ ...f, type: e.target.value })); setPage(1); }} className="bg-[#161b27] border border-white/8 text-slate-300 rounded-lg px-3 py-2 text-sm">
          <option value="">All Types</option>
          <option value="membership">Membership</option>
          <option value="award">Award</option>
        </select>
        <select value={filters.status} onChange={(e) => { setFilters((f) => ({ ...f, status: e.target.value })); setPage(1); }} className="bg-[#161b27] border border-white/8 text-slate-300 rounded-lg px-3 py-2 text-sm">
          <option value="">All Statuses</option>
          <option value="successful">Successful</option>
          <option value="pending">Pending</option>
          <option value="canceled">Canceled</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#161b27] border border-white/8 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-[#0d1018]">
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Reference</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Type</th>
                <th className="text-right px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="text-right px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Discount</th>
                <th className="text-right px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Tax</th>
                <th className="text-right px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Total</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={9}><EmptyState icon={CreditCard} title="No payments found" /></td></tr>
              ) : (
                paginated.map((p) => {
                  const isDuplicate = emailCounts[p.email.toLowerCase()] > 1;
                  return (
                    <tr key={p.id} onClick={() => setSelected(p)} className="border-b border-white/5 hover:bg-white/2 transition-colors cursor-pointer">
                      <td className="px-4 py-3">
                        <code className="font-mono text-xs text-slate-400">{p.reference_code}</code>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-300 text-xs">{p.email}</span>
                          {isDuplicate && <span title="Duplicate email detected"><AlertTriangle className="w-3 h-3 text-yellow-400 flex-shrink-0" /></span>}
                        </div>
                        {p.user_name && <p className="text-xs text-slate-500">{p.user_name}</p>}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={p.type} /></td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-slate-300">€{p.amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-slate-400">{p.discount > 0 ? `-€${p.discount.toFixed(2)}` : '—'}</td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-slate-400">€{p.tax.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-mono text-sm font-medium text-slate-200">€{p.total.toFixed(2)}</td>
                      <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                      <td className="px-4 py-3 text-xs text-slate-500">{p.last_update}</td>
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
      <DetailDrawer open={!!selected} title={selected?.reference_code ?? ''} subtitle={`${selected?.type} payment`} onClose={() => setSelected(null)}>
        {selected && (
          <>
            <DrawerSection title="Payment Details">
              <DrawerField label="Reference Code" value={<code className="font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded text-xs">{selected.reference_code}</code>} />
              <DrawerField label="Email" value={selected.email} />
              <DrawerField label="Customer" value={selected.user_name} />
              <DrawerField label="Type" value={<StatusBadge status={selected.type} />} />
              <DrawerField label="Status" value={<StatusBadge status={selected.status} />} />
              <DrawerField label="Date" value={selected.last_update} />
            </DrawerSection>
            <DrawerSection title="Financials">
              <DrawerField label="Gross Amount" value={`€${selected.amount.toFixed(2)}`} />
              <DrawerField label="Discount" value={selected.discount > 0 ? `-€${selected.discount.toFixed(2)}` : '—'} />
              <DrawerField label="Tax" value={`€${selected.tax.toFixed(2)}`} />
              <DrawerField label="Net Total" value={<span className="text-lg font-semibold text-white">€{selected.total.toFixed(2)}</span>} />
            </DrawerSection>
          </>
        )}
      </DetailDrawer>
    </div>
  );
}
