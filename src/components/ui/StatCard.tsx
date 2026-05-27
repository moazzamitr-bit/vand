import type { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  alert?: boolean;
  onClick?: () => void;
}

export default function StatCard({ title, value, icon: Icon, trend, alert, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`bg-[#161b27] border rounded-lg p-4 transition-colors ${
        alert ? 'border-yellow-500/40' : 'border-white/8'
      } ${onClick ? 'cursor-pointer hover:bg-[#1e2435]' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">{title}</p>
          <p className="text-2xl font-semibold text-white mt-1">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trend.value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
            </p>
          )}
        </div>
        <div className={`p-2 rounded-lg ${alert ? 'bg-yellow-500/15' : 'bg-indigo-500/15'}`}>
          <Icon className={`w-5 h-5 ${alert ? 'text-yellow-400' : 'text-indigo-400'}`} />
        </div>
      </div>
    </div>
  );
}
