import { AlertTriangle, X } from 'lucide-react';

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open, title, message, confirmLabel = 'Confirm', variant = 'danger', onConfirm, onCancel,
}: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onCancel} />
      <div className="relative bg-[#1e2435] border border-white/10 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        <button onClick={onCancel} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 p-2 rounded-lg ${variant === 'danger' ? 'bg-red-500/15' : 'bg-yellow-500/15'}`}>
            <AlertTriangle className={`w-5 h-5 ${variant === 'danger' ? 'text-red-400' : 'text-yellow-400'}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white text-sm">{title}</h3>
            <p className="text-slate-400 text-sm mt-1">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-slate-300 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              variant === 'danger'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-yellow-600 hover:bg-yellow-700 text-white'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
