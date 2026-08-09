import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Search, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ScanCard from '../components/ScanCard';
import { getRiskColor } from '../utils/helpers';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/scans').then(res => setScans(res.data.scans)).finally(() => setLoading(false));
  }, []);

  const stats = {
    total: scans.length,
    safe: scans.filter(s => s.riskLevel === 'SAFE').length,
    suspicious: scans.filter(s => s.riskLevel === 'SUSPICIOUS').length,
    dangerous: scans.filter(s => s.riskLevel === 'DANGEROUS').length,
  };

  const statCards = [
    { label: 'Total Scans', value: stats.total, icon: TrendingUp, color: '#00d4ff' },
    { label: 'Safe', value: stats.safe, icon: CheckCircle, color: '#10b981' },
    { label: 'Suspicious', value: stats.suspicious, icon: AlertTriangle, color: '#f59e0b' },
    { label: 'Dangerous', value: stats.dangerous, icon: Shield, color: '#ef4444' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Welcome, {user?.name} 👋</h1>
        <p className="text-slate-400 mt-1">Here's your scam detection overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-400 text-sm">{label}</p>
              <Icon size={18} style={{ color }} />
            </div>
            <p className="text-3xl font-bold text-white">{loading ? '—' : value}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="card border-[rgba(0,212,255,0.2)] mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
        <div>
          <h2 className="text-white font-semibold text-lg">Analyze Something Suspicious</h2>
          <p className="text-slate-400 text-sm mt-1">Paste a message, email, job offer, or URL for instant AI analysis</p>
        </div>
        <button onClick={() => navigate('/analyze')} className="btn-primary py-3 px-6 whitespace-nowrap pulse-glow">
          <Search size={18} /> Analyze Now
        </button>
      </div>

      {/* Recent Scans */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <Clock size={18} className="text-[#00d4ff]" /> Recent Scans
          </h2>
          {scans.length > 0 && (
            <button onClick={() => navigate('/history')} className="text-[#00d4ff] text-sm hover:underline">
              View all
            </button>
          )}
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#00d4ff] border-t-transparent rounded-full spinner" />
          </div>
        ) : scans.length === 0 ? (
          <div className="card text-center py-12">
            <Shield size={40} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No scans yet. Analyze your first suspicious content!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scans.slice(0, 6).map(scan => <ScanCard key={scan._id} scan={scan} />)}
          </div>
        )}
      </div>
    </div>
  );
}
