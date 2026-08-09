const SCAM_PATTERNS = [
  { pattern: /urgent|immediately|act now|right now/i, weight: 15, flag: 'Creates urgency' },
  { pattern: /otp|one.?time.?password/i, weight: 20, flag: 'Requests OTP' },
  { pattern: /password|credentials|login details/i, weight: 20, flag: 'Requests credentials' },
  { pattern: /bank account|account blocked|account suspended/i, weight: 20, flag: 'Bank account threat' },
  { pattern: /verify.{0,20}account|account.{0,20}verify/i, weight: 15, flag: 'Account verification request' },
  { pattern: /click.{0,20}link|click here|click now/i, weight: 10, flag: 'Suspicious link prompt' },
  { pattern: /winner|won|lottery|prize|congratulations/i, weight: 20, flag: 'Fake prize or lottery' },
  { pattern: /send money|transfer|payment required|pay now/i, weight: 20, flag: 'Payment request' },
  { pattern: /investment|returns|profit|earn \$|make money/i, weight: 15, flag: 'Investment scam indicators' },
  { pattern: /registration fee|joining fee|processing fee/i, weight: 20, flag: 'Suspicious fee request' },
  { pattern: /claim now|claim your|limited time|expires soon/i, weight: 10, flag: 'Artificial scarcity' },
  { pattern: /confidential|secret|private offer/i, weight: 10, flag: 'Secrecy request' },
  { pattern: /work from home|job offer|hiring now|earn \d+/i, weight: 10, flag: 'Suspicious job offer' },
  { pattern: /free gift|free money|free reward/i, weight: 15, flag: 'Too-good-to-be-true offer' },
  { pattern: /ssn|social security|aadhar|pan card/i, weight: 25, flag: 'Requests government ID' },
];

function analyzeWithRules(content) {
  let score = 0;
  const redFlags = [];

  for (const { pattern, weight, flag } of SCAM_PATTERNS) {
    if (pattern.test(content)) {
      score += weight;
      redFlags.push(flag);
    }
  }

  score = Math.min(score, 100);

  let riskLevel;
  if (score <= 30) riskLevel = 'SAFE';
  else if (score <= 70) riskLevel = 'SUSPICIOUS';
  else riskLevel = 'DANGEROUS';

  const summaries = {
    SAFE: 'No significant scam indicators detected. This content appears likely safe.',
    SUSPICIOUS: 'Some potentially suspicious patterns detected. Exercise caution.',
    DANGEROUS: 'Multiple high-risk scam indicators detected. This content is likely a scam.',
  };

  const recommendations = {
    SAFE: ['Continue to stay vigilant', 'Verify sender identity if unsure'],
    SUSPICIOUS: [
      'Do not share personal information',
      'Verify the sender through official channels',
      'Do not click unknown links',
    ],
    DANGEROUS: [
      'Do not respond to this message',
      'Do not click any links',
      'Do not share OTPs, passwords, or financial details',
      'Report this to relevant authorities',
      'Block the sender',
    ],
  };

  return {
    riskLevel,
    score,
    summary: summaries[riskLevel],
    redFlags: redFlags.length ? redFlags : ['No specific red flags detected'],
    explanation:
      redFlags.length
        ? `Rule-based analysis detected ${redFlags.length} suspicious pattern(s): ${redFlags.join(', ')}.`
        : 'No suspicious patterns were matched in this content.',
    recommendations: recommendations[riskLevel],
    analysisMode: 'RULE_BASED',
  };
}

module.exports = { analyzeWithRules };
