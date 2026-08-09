import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Mail, Briefcase, Link, Shield, AlertTriangle, Zap } from 'lucide-react';
import api from '../services/api';
import RiskScore from '../components/RiskScore';
import { getRiskColor } from '../utils/helpers';

const TABS = [
  { id: 'message', label: 'Message', icon: MessageSquare },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'job', label: 'Job Offer', icon: Briefcase },
  { id: 'url', label: 'URL', icon: Link },
];

const EXAMPLES = {
  dangerous: "URGENT! Your bank account will be blocked today. Verify your account immediately by clicking this link and entering your OTP.",
  suspicious: "Congratulations! You have been selected for a work-from-home opportunity. Pay a small registration fee to continue.",
  safe: "Your appointment with ABC Clinic is confirmed for tomorrow at 10:00 AM.",
};

export default function Analyze() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('message');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!content.trim()) return setError('Please enter content to analyze');
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await api.post('/scans/analyze', { content, type: tab });
      setResult(res.data.scan);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setResult(null); setContent(''); setError(''); };

  if (result) return <AnalysisResult result={result} onReset={reset} onViewHistory={() => navigate('/history')} />;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Analyze Content</h1>
        <p className="text-slate-400 mt-1">Paste suspicious content for AI-powered scam detection</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => { setTab(id); setContent(''); setError(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === id
                ? 'bg-[rgba(0,212,255,0.15)] text-[#00d4ff] border border-[rgba(0,212,255,0.3)]'
                : 'bg-[#111d35] text-slate-400 border border-[rgba(255,255,255,0.06)] hover:text-white'
            }`}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* Example Buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <span className="text-slate-500 text-xs self-center">Try:</span>
        {Object.entries(EXAMPLES).map(([key, val]) => (
          <button key={key} onClick={() => { setContent(val); setTab('message'); setError(''); }}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              key === 'dangerous' ? 'border-[rgba(239,68,68,0.3)] text-[#f87171] hover:bg-[rgba(239,68,68,0.1)]'
              : key === 'suspicious' ? 'border-[rgba(245,158,11,0.3)] text-[#fbbf24] hover:bg-[rgba(245,158,11,0.1)]'
              : 'border-[rgba(16,185,129,0.3)] text-[#34d399] hover:bg-[rgba(16,185,129,0.1)]'
            }`}>
            {key.charAt(0).toUpperCase() + key.slice(1)} Example
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="card mb-4">
        {tab === 'url' ? (
          <input
            type="text" className="input" placeholder="Paste suspicious URL here... e.g. http://suspicious-bank-verify.com/login"
            value={content} onChange={e => setContent(e.target.value)}
          />
        ) : (
          <textarea
            className="input resize-none" rows={7}
            placeholder="Paste suspicious content here..."
            value={content} onChange={e => setContent(e.target.value)}
          />
        )}
      </div>

      {error && (
        <div className="bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-[#f87171] text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <button onClick={handleAnalyze} disabled={loading || !content.trim()} className="btn-primary py-3 px-8 w-full justify-center text-base">
        {loading ? (
          <>
            <span className="w-5 h-5 border-2 border-[#0a0f1e] border-t-transparent rounded-full spinner" />
            Analyzing with AI...
          </>
        ) : (
          <><Zap size={18} /> Analyze with AI</>
        )}
      </button>
    </div>
  );
}

function AnalysisResult({ result, onReset, onViewHistory }) {
  const riskColor = getRiskColor(result.riskLevel);

  return (
    <div className="p-6 max-w-3xl mx-auto fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Analysis Result</h1>
        <span className={`text-xs px-3 py-1 rounded-full border ${
          result.analysisMode === 'AI'
            ? 'border-[rgba(0,212,255,0.3)] text-[#00d4ff] bg-[rgba(0,212,255,0.08)]'
            : 'border-[rgba(245,158,11,0.3)] text-[#fbbf24] bg-[rgba(245,158,11,0.08)]'
        }`}>
          {result.analysisMode === 'AI' ? '⚡ AI Analysis' : '📋 Rule-Based Fallback'}
        </span>
      </div>

      {/* Score + Summary */}
      <div className="card mb-4 flex flex-col sm:flex-row items-center gap-6">
        <RiskScore score={result.score} riskLevel={result.riskLevel} />
        <div className="flex-1">
          <h2 className="text-white font-semibold text-lg mb-2">Summary</h2>
          <p className="text-slate-300">{result.summary}</p>
        </div>
      </div>

      {/* Red Flags */}
      {result.redFlags?.length > 0 && (
        <div className="card mb-4">
          <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle size={18} style={{ color: riskColor }} /> Detected Red Flags
          </h2>
          <div className="flex flex-wrap gap-2">
            {result.redFlags.map((flag, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg text-sm border"
                style={{ background: `${riskColor}15`, color: riskColor, borderColor: `${riskColor}40` }}>
                {flag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Explanation */}
      {result.explanation && (
        <div className="card mb-4">
          <h2 className="text-white font-semibold mb-2">Why is this suspicious?</h2>
          <p className="text-slate-300 text-sm leading-relaxed">{result.explanation}</p>
        </div>
      )}

      {/* Recommendations */}
      {result.recommendations?.length > 0 && (
        <div className="card mb-4">
          <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Shield size={18} className="text-[#00d4ff]" /> Recommended Actions
          </h2>
          <ul className="flex flex-col gap-2">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                <span className="text-[#00d4ff] mt-0.5">✓</span> {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Technical Findings (URL) */}
      {result.technicalFindings && (
        <div className="card mb-4">
          <h2 className="text-white font-semibold mb-3">Technical Findings</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(result.technicalFindings).map(([key, val]) => {
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

      <div className="flex gap-3 mt-6">
        <button onClick={onReset} className="btn-primary flex-1 justify-center py-3">
          <Zap size={16} /> Analyze Another
        </button>
        <button onClick={onViewHistory} className="btn-secondary py-3 px-5">
          View History
        </button>
      </div>
    </div>
  );
}
