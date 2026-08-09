export const getRiskColor = (level) => {
  if (level === 'SAFE') return '#10b981';
  if (level === 'SUSPICIOUS') return '#f59e0b';
  return '#ef4444';
};

export const getRiskBadgeClass = (level) => {
  if (level === 'SAFE') return 'badge-safe';
  if (level === 'SUSPICIOUS') return 'badge-suspicious';
  return 'badge-dangerous';
};

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

export const truncate = (str, n = 80) =>
  str?.length > n ? str.substring(0, n) + '...' : str;

export const SCAN_TYPE_LABELS = {
  message: 'SMS / Message',
  email: 'Email',
  job: 'Job Offer',
  url: 'URL',
};
