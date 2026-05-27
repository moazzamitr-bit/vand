import { Bell } from 'lucide-react';

interface Props {
  user: { name: string; role: string };
}

export default function TopBar({ user }: Props) {
  return (
    <header className="h-14 bg-[#0d1018] border-b border-white/8 flex items-center justify-between px-6 flex-shrink-0">
      <div />
      <div className="flex items-center gap-4">
        <button className="relative p-1.5 text-slate-400 hover:text-white transition-colors">
          <Bell className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-indigo-600/40 flex items-center justify-center">
            <span className="text-indigo-300 text-xs font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm text-slate-200 leading-tight">{user.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user.role.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
