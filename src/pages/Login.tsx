import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface Props {
  onLogin: (email: string, role: string) => void;
}

export default function Login({ onLogin }: Props) {
  const [email, setEmail] = useState('admin@vand.io');
  const [password, setPassword] = useState('password');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (password === 'password') {
        const role = email.includes('finance') ? 'finance'
          : email.includes('competitions') ? 'competition_manager'
          : email.includes('viewer') ? 'viewer'
          : 'admin';
        onLogin(email, role);
      } else {
        setError('Invalid email or password.');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          <h1 className="text-xl font-semibold text-white">VAND Admin</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#161b27] border border-white/8 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@vand.io"
              className="w-full bg-[#252d40] border border-white/10 text-slate-200 placeholder-slate-600 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[#252d40] border border-white/10 text-slate-200 placeholder-slate-600 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-xs text-slate-600 mt-4">Demo: any email + password "password"</p>
      </div>
    </div>
  );
}
