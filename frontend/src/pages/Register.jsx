import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true); setErrors({});
    try {
      await register(form.name, form.email, form.password);
      setToast({ message: 'Account created!', type: 'success' });
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err) {
      setErrors({ api: err.response?.data?.error || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  const f = (field) => ({
    value: form[field],
    onChange: e => setForm({ ...form, [field]: e.target.value }),
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0f1e] py-8">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield size={28} className="text-[#00d4ff]" />
            <span className="font-bold text-white text-xl">ScamShield AI</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-slate-400 mt-1">Start protecting yourself today</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {errors.api && (
              <div className="bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-[#f87171] text-sm px-4 py-3 rounded-lg">
                {errors.api}
              </div>
            )}
            {[
              { label: 'Full Name', field: 'name', type: 'text', placeholder: 'Jamuna' },
              { label: 'Email', field: 'email', type: 'email', placeholder: 'you@example.com' },
            ].map(({ label, field, type, placeholder }) => (
              <div key={field}>
                <label className="text-slate-300 text-sm mb-1.5 block">{label}</label>
                <input type={type} className="input" placeholder={placeholder} {...f(field)} />
                {errors[field] && <p className="text-[#f87171] text-xs mt-1">{errors[field]}</p>}
              </div>
            ))}
            <div>
              <label className="text-slate-300 text-sm mb-1.5 block">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} className="input pr-10" placeholder="Min. 6 characters" {...f('password')} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-[#f87171] text-xs mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="text-slate-300 text-sm mb-1.5 block">Confirm Password</label>
              <input type="password" className="input" placeholder="Repeat password" {...f('confirm')} />
              {errors.confirm && <p className="text-[#f87171] text-xs mt-1">{errors.confirm}</p>}
            </div>
            <button type="submit" className="btn-primary justify-center py-3 mt-2" disabled={loading}>
              {loading ? <span className="w-4 h-4 border-2 border-[#0a0f1e] border-t-transparent rounded-full spinner" /> : null}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-slate-400 text-sm mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-[#00d4ff] hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
