import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Layers, Trophy, Ticket, Users, CreditCard,
  BadgeCheck, LogOut, ChevronRight, KeyRound,
} from 'lucide-react';

interface Props {
  onLogout: () => void;
}

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/categories', icon: Layers, label: 'Categories' },
  { to: '/competitions', icon: Trophy, label: 'Competitions' },
  { to: '/invitation-codes', icon: Ticket, label: 'Invitation Codes' },
  { to: '/official-members', icon: BadgeCheck, label: 'Official Members' },
  { to: '/payments', icon: CreditCard, label: 'Payment History' },
  { to: '/users', icon: Users, label: 'Users' },
];

export default function Sidebar({ onLogout }: Props) {
  return (
    <aside className="w-60 flex-shrink-0 bg-[#0d1018] border-r border-white/8 flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/8">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">V</span>
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">VAND</p>
            <p className="text-slate-500 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors group ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-400' : ''}`} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight className="w-3 h-3 text-indigo-400" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User area */}
      <div className="border-t border-white/8 px-3 py-3 space-y-0.5">
        <NavLink
          to="/change-password"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive ? 'bg-white/8 text-slate-200' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`
          }
        >
          <KeyRound className="w-4 h-4" />
          <span>Change Password</span>
        </NavLink>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/8 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
