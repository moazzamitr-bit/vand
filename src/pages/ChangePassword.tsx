import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { useAppToast } from '../components/layout/AppLayout';

export default function ChangePassword() {
  const { addToast } = useAppToast();
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.current) errs.current = 'Current password is required.';
    if (form.next.length < 8) errs.next = 'New password must be at least 8 characters.';
    if (form.next !== form.confirm) errs.confirm = 'Passwords do not match.';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    addToast('Password changed successfully.');
    setForm({ current: '', next: '', confirm: '' });
  };

  return (
    <div className="max-w-sm">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-white">Change Password</h1>
        <p className="text-slate-400 text-sm mt-0.5">Update your admin account password.</p>
      </div>
      <form onSubmit={handleSubmit} className="bg-[#161b27] border border-white/8 rounded-lg p-5 space-y-4">
        {[
          { key: 'current' as const, label: 'Current Password', placeholder: 'Enter current password' },
          { key: 'next' as const, label: 'New Password', placeholder: 'Minimum 8 characters' },
          { key: 'confirm' as const, label: 'Confirm New Password', placeholder: 'Repeat new password' },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">{label}</label>
            <input
              type="password"
              value={form[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              placeholder={placeholder}
              className="w-full bg-[#252d40] border border-white/10 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
            {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
          </div>
        ))}
        <button type="submit" className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
          <KeyRound className="w-4 h-4" /> Update Password
        </button>
      </form>
    </div>
  );
}
