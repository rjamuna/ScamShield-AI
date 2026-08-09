import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Shield } from 'lucide-react';
import api from '../services/api';
import RiskScore from '../components/RiskScore';
import { getRiskColor, formatDate, SCAN_TYPE_LABELS } from '../utils/helpers';

export default function ScanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/scans/${id}`)
      .then(res => setScan(res.data.scan))
      .catch(() => setError('Scan not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-[#00d4ff] border-t-transparent rounded-full spinner" />
    </div>
  );

  if (error) return (
    <div className="p-6 text-center">
      <p className="text-[#f87171]">{error}</p>
      <button onClick={() => navigate('/history')} className="btn-secondary mt-4">Back to History</button>
    </div>
  );

  const riskColor = getRiskColor(scan.riskLevel);

  return (
    <div className="p-6 max-w-3xl mx-auto fade-in">
      <button onClick={() => navigate('/history')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm transition-colors">
        <ArrowLeft size={16} /> Back to History
      </button>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">{SCAN_TYPE_LABELS[scan.type]} Analysis</h1>
          <p className="text-slate-500 text-sm mt-1">{formatDate(scan.createdAt)}</p>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full border ${
          scan.analysisMode === 'AI'
            ? 'border-[rgba(0,212,255,0.3)] text-[#00d4ff] bg-[rgba(0,212,255,0.08)]'
            : 'border-[rgba(245,158,11,0.3)] text-[#fbbf24] bg-[rgba(245,158,11,0.08)]'
        }`}>
          {scan.analysisMode === 'AI' ? '⚡ AI Analysis' : '📋 Rule-Based Fallback'}
        </span>
      </div>

      <div className="card mb-4 flex flex-col sm:flex-row items-center gap-6">
        <RiskScore score={scan.score} riskLevel={scan.riskLevel} />
        <div className="flex-1">
          <h2 className="text-white font-semibold text-lg mb-2">Summary</h2>
          <p className="text-slate-300">{scan.summary}</p>
        </div>
      </div>

      <div className="card mb-4">
        <h2 className="text-white font-semibold mb-2">Analyzed Content</h2>
        <p className="text-slate-400 text-sm bg-[#0a0f1e] rounded-lg p-3 break-all">{scan.content}</p>
      </div>

      {scan.redFlags?.length > 0 && (
        <div className="card mb-4">
          <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle size={18} style={{ color: riskColor }} /> Detected Red Flags
          </h2>
          <div className="flex flex-wrap gap-2">
            {scan.redFlags.map((flag, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg text-sm border"
                style={{ background: `${riskColor}15`, color: riskColor, borderColor: `${riskColor}40` }}>
                {flag}
              </span>
            ))}
          </div>
        </div>
      )}

      {scan.explanation && (
        <div className="card mb-4">
          <h2 className="text-white font-semibold mb-2">Why is this suspicious?</h2>
          <p className="text-slate-300 text-sm leading-relaxed">{scan.explanation}</p>
        </div>
      )}

      {scan.recommendations?.length > 0 && (
        <div className="card mb-4">
          <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Shield size={18} className="text-[#00d4ff]" /> Recommended Actions
          </h2>
          <ul className="flex flex-col gap-2">
            {scan.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                <span className="text-[#00d4ff] mt-0.5">✓</span> {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {scan.technicalFindings && (
        <div className="card mb-4">
          <h2 className="text-white font-semibold mb-3">Technical Findings</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(scan.technicalFindings).map(([key, val]) => {
              if (key === 'suspiciousKeywords') return (
                <div key={key} className="col-span-2 sm:col-span-3 bg-[#0a0f1e] rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-1">Suspicious Keywords</p>
                  <p className="text-white text-sm">{Array.isArray(val) && val.length ? val.join(', ') : 'None'}</p>
                </div>
              );
              const isRisk = val === true && key !== 'https';
              const isSafe = (val === true && key === 'https') || val === false;
              return (
                <div key={key} className="bg-[#0a0f1e] rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <p className={`text-sm font-medium ${isRisk ? 'text-[#f87171]' : isSafe ? 'text-[#34d399]' : 'text-slate-300'}`}>
                    {typeof val === 'boolean' ? (val ? 'Yes' : 'No') : String(val)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
