const URL_SHORTENERS = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 'short.link', 'rb.gy', 'cutt.ly'];
const SUSPICIOUS_KEYWORDS = ['login', 'verify', 'account', 'secure', 'update', 'confirm', 'banking', 'password', 'signin', 'payment', 'free', 'prize', 'winner', 'claim'];

function analyzeURL(url) {
  const findings = {
    https: false,
    ipAddress: false,
    suspiciousKeywords: [],
    excessiveSubdomains: false,
    longUrl: false,
    atSymbol: false,
    shortenedUrl: false,
    suspiciousChars: false,
  };

  try {
    const parsed = new URL(url.startsWith('http') ? url : `http://${url}`);

    findings.https = parsed.protocol === 'https:';
    findings.ipAddress = /^\d{1,3}(\.\d{1,3}){3}$/.test(parsed.hostname);
    findings.longUrl = url.length > 75;
    findings.atSymbol = url.includes('@');
    findings.suspiciousChars = /[<>{}|\\^`]/.test(url);

    const parts = parsed.hostname.split('.');
    findings.excessiveSubdomains = parts.length > 4;

    findings.shortenedUrl = URL_SHORTENERS.some(s => parsed.hostname.includes(s));

    const lowerUrl = url.toLowerCase();
    findings.suspiciousKeywords = SUSPICIOUS_KEYWORDS.filter(k => lowerUrl.includes(k));
  } catch {
    findings.parseError = true;
  }

  return findings;
}

module.exports = { analyzeURL };
