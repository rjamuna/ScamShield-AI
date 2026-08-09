import { useNavigate } from 'react-router-dom';
import { getRiskBadgeClass, formatDate, truncate, SCAN_TYPE_LABELS } from '../utils/helpers';
import { Trash2, Eye, MessageSquare, Mail, Briefcase, Link } from 'lucide-react';

const typeIcons = { message: MessageSquare, email: Mail, job: Briefcase, url: Link };

export default function ScanCard({ scan, onDelete }) {
  const navigate = useNavigate();
  const Icon = typeIcons[scan.type] || MessageSquare;

  return (
    <div className="card fade-in flex flex-col gap-3 hover:border-[rgba(0,212,255,0.2)] transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[rgba(0,212,255,0.08)]">
            <Icon size={16} className="text-[#00d4ff]" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">{SCAN_TYPE_LABELS[scan.type]}</p>
            <p className="text-slate-500 text-xs">{formatDate(scan.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={getRiskBadgeClass(scan.riskLevel)}>{scan.riskLevel}</span>
          <span className="text-slate-400 text-xs font-mono">{scan.score}/100</span>
        </div>
      </div>
      <p className="text-slate-400 text-sm">{truncate(scan.content)}</p>
      <div className="flex gap-2 mt-1">
        <button onClick={() => navigate(`/history/${scan._id}`)} className="btn-secondary text-xs py-1.5 px-3 flex-1 justify-center">
          <Eye size={14} /> View
        </button>
        {onDelete && (
          <button onClick={() => onDelete(scan._id)} className="btn-danger text-xs py-1.5 px-3">
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
