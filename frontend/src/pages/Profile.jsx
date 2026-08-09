import { useEffect, useState } from 'react';
import { User, Mail, Calendar, BarChart2, Edit2, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Toast from '../components/Toast';
import { formatDate } from '../utils/helpers';

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    api.get('/users/profile').then(res => {
      setProfile(res.data);
      setName(res.data.user.name);
    });
  }, []);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const res = await api.put('/users/profile', { name });
      updateUser(res.data.user);
      setProfile(prev => ({ ...prev, user: res.data.user }));
      setEditing(false);
      setToast({ message: 'Profile updated', type: 'success' });
    } catch {
      setToast({ message: 'Update failed', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-[#00d4ff] border-t-transparent rounded-full spinner" />
    </div>
  );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>

      <div className="card mb-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-[rgba(0,212,255,0.15)] border border-[rgba(0,212,255,0.3)] flex items-center justify-center">
            <span className="text-[#00d4ff] text-2xl font-bold">{profile.user.name[0].toUpperCase()}</span>
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg">{profile.user.name}</h2>
            <p className="text-slate-400 text-sm">{profile.user.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Name Edit */}
          <div className="flex items-center gap-3 p-3 bg-[#0a0f1e] rounded-lg">
            <User size={16} className="text-slate-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-slate-500 text-xs mb-1">Full Name</p>
              {editing ? (
                <input
                  type="text" className="input py-1 text-sm"
                  value={name} onChange={e => setName(e.target.value)}
                  autoFocus
                />
              ) : (
                <p className="text-white text-sm">{profile.user.name}</p>
              )}
            </div>
            {editing ? (
              <div className="flex gap-2">
                <button onClick={handleSave} disabled={saving} className="text-[#34d399] hover:text-[#10b981] p-1">
                  {saving ? <span className="w-4 h-4 border-2 border-[#34d399] border-t-transparent rounded-full spinner block" /> : <Check size={16} />}
                </button>
                <button onClick={() => { setEditing(false); setName(profile.user.name); }} className="text-[#f87171] hover:text-[#ef4444] p-1">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button onClick={() => setEditing(true)} className="text-slate-500 hover:text-[#00d4ff] p-1">
                <Edit2 size={15} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#0a0f1e] rounded-lg">
            <Mail size={16} className="text-slate-500 flex-shrink-0" />
            <div>
              <p className="text-slate-500 text-xs mb-1">Email</p>
              <p className="text-white text-sm">{profile.user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#0a0f1e] rounded-lg">
            <Calendar size={16} className="text-slate-500 flex-shrink-0" />
            <div>
              <p className="text-slate-500 text-xs mb-1">Member Since</p>
              <p className="text-white text-sm">{formatDate(profile.user.createdAt)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#0a0f1e] rounded-lg">
            <BarChart2 size={16} className="text-slate-500 flex-shrink-0" />
            <div>
              <p className="text-slate-500 text-xs mb-1">Total Scans</p>
              <p className="text-white text-sm font-semibold">{profile.totalScans}</p>
            </div>
          </div>
        </div>
      </div>

      <button onClick={logout} className="btn-danger w-full justify-center py-3">
        Logout
      </button>
    </div>
  );
}
