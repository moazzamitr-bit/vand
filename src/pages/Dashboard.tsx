import { Users, DollarSign, BadgeCheck, CreditCard, Trophy, Clock, AlertCircle, Eye } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';
import { dashboardMetrics, revenueByStream, monthlyProfit, topCountries, officialMembers, payments } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

const tooltipStyle = {
  contentStyle: { background: '#1e2435', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 },
  labelStyle: { color: '#94a3b8' },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const pending = officialMembers.filter((m) => m.review_status === 'pending_review');
  const unpaidApproved = officialMembers.filter((m) => m.review_status === 'approved' && m.payment_status === 'pending');
  const failedPayments = payments.filter((p) => p.status === 'failed');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-0.5">Platform overview — last 30 days</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        <StatCard title="Visitors" value={dashboardMetrics.visitors.toLocaleString()} icon={Eye} trend={{ value: 12, label: 'vs last month' }} />
        <StatCard title="Revenue (€)" value={`€${dashboardMetrics.earnings_eur}`} icon={DollarSign} trend={{ value: 8, label: 'vs last month' }} />
        <StatCard title="Certificates" value={dashboardMetrics.certificates} icon={BadgeCheck} />
        <StatCard title="Total Members" value={dashboardMetrics.official_members_total.toLocaleString()} icon={BadgeCheck} />
        <StatCard title="Total Payments" value={dashboardMetrics.payments_total.toLocaleString()} icon={CreditCard} />
        <StatCard title="Registered Users" value={dashboardMetrics.users_total.toLocaleString()} icon={Users} />
        <StatCard title="Active Competitions" value={dashboardMetrics.active_competitions} icon={Trophy} />
      </div>

      {/* Alerts */}
      {(pending.length > 0 || unpaidApproved.length > 0 || failedPayments.length > 0) && (
        <div className="space-y-2">
          <h2 className="text-xs text-slate-400 uppercase tracking-wider font-medium">Actionable Alerts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {pending.length > 0 && (
              <button
                onClick={() => navigate('/official-members?tab=pending_review')}
                className="flex items-center gap-3 px-4 py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-left hover:bg-yellow-500/15 transition-colors"
              >
                <Clock className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <div>
                  <p className="text-yellow-300 text-sm font-medium">{pending.length} pending reviews</p>
                  <p className="text-yellow-400/70 text-xs">Membership applications awaiting review</p>
                </div>
              </button>
            )}
            {unpaidApproved.length > 0 && (
              <button
                onClick={() => navigate('/official-members?tab=approved')}
                className="flex items-center gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-left hover:bg-amber-500/15 transition-colors"
              >
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-amber-300 text-sm font-medium">{unpaidApproved.length} unpaid approved</p>
                  <p className="text-amber-400/70 text-xs">Approved members with pending payment</p>
                </div>
              </button>
            )}
            {failedPayments.length > 0 && (
              <button
                onClick={() => navigate('/payments')}
                className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-left hover:bg-red-500/15 transition-colors"
              >
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <div>
                  <p className="text-red-300 text-sm font-medium">{failedPayments.length} failed payments</p>
                  <p className="text-red-400/70 text-xs">Payments that failed and may need attention</p>
                </div>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue by stream */}
        <div className="lg:col-span-2 bg-[#161b27] border border-white/8 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-200 mb-4">Revenue by Income Stream (€)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueByStream} barSize={14} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              <Bar dataKey="membership" name="Membership" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
              <Bar dataKey="competitions" name="Competitions" stackId="a" fill="#22d3ee" />
              <Bar dataKey="materials" name="Materials" stackId="a" fill="#a78bfa" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly net profit */}
        <div className="bg-[#161b27] border border-white/8 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-200 mb-4">Monthly Net Profit (€)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyProfit}>
              <defs>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="profit" name="Net Profit" stroke="#6366f1" fill="url(#profitGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top countries */}
        <div className="bg-[#161b27] border border-white/8 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-200 mb-4">Top Countries by Users</h3>
          <div className="space-y-2">
            {topCountries.map((c, i) => (
              <div key={c.country} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-4">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-300">{c.country}</span>
                    <span className="text-slate-400">{c.users} users · €{c.revenue.toLocaleString()}</span>
                  </div>
                  <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${(c.users / topCountries[0].users) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-[#161b27] border border-white/8 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-200 mb-4">Recent Membership Requests</h3>
          <div className="space-y-2">
            {officialMembers.slice(0, 6).map((m) => (
              <div key={m.id} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-sm text-slate-200">{m.name}</p>
                  <p className="text-xs text-slate-500">{m.design_field} · {m.request_date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={m.review_status} />
                  <StatusBadge status={m.payment_status} />
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/official-members')}
            className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            View all members →
          </button>
        </div>
      </div>
    </div>
  );
}
