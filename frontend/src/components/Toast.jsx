import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl fade-in max-w-sm ${
      type === 'success' ? 'bg-[#0d2a1f] border border-[rgba(16,185,129,0.4)] text-[#34d399]'
        : 'bg-[#2a0d0d] border border-[rgba(239,68,68,0.4)] text-[#f87171]'
    }`}>
      {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100"><X size={16} /></button>
    </div>
  );
}
