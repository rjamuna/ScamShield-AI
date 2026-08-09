import { useEffect, useState } from 'react';
import { History as HistoryIcon, Search } from 'lucide-react';
import api from '../services/api';
import ScanCard from '../components/ScanCard';
import Toast from '../components/Toast';

const FILTERS = ['all', 'safe', 'suspicious', 'dangerous'];

export default function History() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  const fetchScans = async (risk = 'all') => {
    setLoading(true);
    try {
      const res = await api.get(`/scans${risk !== 'all' ? `?risk=${risk}` : ''}`);
      setScans(res.data.scans);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchScans(filter); }, [filter]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/scans/${id}`);
      setScans(prev => prev.filter(s => s._id !== id));
      setToast({ message: 'Scan deleted', type: 'success' });
    } catch {
      setToast({ message: 'Failed to delete', type: 'error' });
    }
  };

  const filtered = scans.filter(s =>
    !search || s.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <HistoryIcon size={22} className="text-[#00d4ff]" /> Scan History
        </h1>
        <p className="text-slate-400 mt-1">All your previous scam analyses</p>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text" className="input pl-9" placeholder="Search scans..."
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === f
                  ? 'bg-[rgba(0,212,255,0.15)] text-[#00d4ff] border border-[rgba(0,212,255,0.3)]'
                  : 'bg-[#111d35] text-slate-400 border border-[rgba(255,255,255,0.06)] hover:text-white'
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#00d4ff] border-t-transparent rounded-full spinner" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <HistoryIcon size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No scans found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(scan => (
            <ScanCard key={scan._id} scan={scan} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
