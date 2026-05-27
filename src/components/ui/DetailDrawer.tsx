import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export default function DetailDrawer({ open, title, subtitle, onClose, children, footer }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-lg h-full bg-[#161b27] border-l border-white/8 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <div>
            <h2 className="font-semibold text-white text-sm">{title}</h2>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-white/8 text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-white/8">{footer}</div>}
      </div>
    </div>
  );
}

export function DrawerSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-3">{title}</h3>
      {children}
    </div>
  );
}

export function DrawerField({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 mb-3">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-sm text-slate-200">{value ?? <span className="text-slate-500 italic">—</span>}</span>
    </div>
  );
}
