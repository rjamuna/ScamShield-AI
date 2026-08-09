import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return setError('All fields are required');
    setLoading(true); setError('');
    try {
      await login(form.email, form.password);
      setToast({ message: 'Welcome back!', type: 'success' });
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0f1e]">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield size={28} className="text-[#00d4ff]" />
            <span className="font-bold text-white text-xl">ScamShield AI</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-slate-400 mt-1">Sign in to your account</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-[#f87171] text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label className="text-slate-300 text-sm mb-1.5 block">Email</label>
              <input
                type="email" className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-slate-300 text-sm mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} className="input pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-primary justify-center py-3 mt-2" disabled={loading}>
              {loading ? <span className="w-4 h-4 border-2 border-[#0a0f1e] border-t-transparent rounded-full spinner" /> : null}
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
          <p className="text-center text-slate-400 text-sm mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#00d4ff] hover:underline">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
