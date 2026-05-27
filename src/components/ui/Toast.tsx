import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning';

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface Props {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

function Toast({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  const cfg = {
    success: { icon: CheckCircle, className: 'bg-green-500/15 border-green-500/30 text-green-400' },
    error: { icon: XCircle, className: 'bg-red-500/15 border-red-500/30 text-red-400' },
    warning: { icon: AlertTriangle, className: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400' },
  }[toast.type];

  const Icon = cfg.icon;

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl ${cfg.className} bg-[#1e2435]`}>
      <Icon className="w-4 h-4 flex-shrink-0" />
      <p className="text-sm text-slate-200 flex-1">{toast.message}</p>
      <button onClick={() => onDismiss(toast.id)} className="text-slate-400 hover:text-white ml-2">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function ToastContainer({ toasts, onDismiss }: Props) {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((t) => <Toast key={t.id} toast={t} onDismiss={onDismiss} />)}
    </div>
  );
}

export type { ToastItem };
