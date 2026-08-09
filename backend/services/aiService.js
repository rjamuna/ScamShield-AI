const Groq = require('groq-sdk');
const { analyzeWithRules } = require('./fallbackAnalyzer');

let groqClient = null;

function getGroqClient() {
  if (!process.env.GROQ_API_KEY) return null;
  if (!groqClient) groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return groqClient;
}

const SYSTEM_PROMPT = `You are a cybersecurity scam detection assistant. Analyze the provided content and identify scam indicators.

Look for:
- Urgency or fear tactics
- Requests for OTP, passwords, or credentials
- Payment or money transfer requests
- Fake prizes, lotteries, or job offers
- Impersonation of banks, government, or companies
- Suspicious links or phishing language
- Investment scams or too-good-to-be-true offers
- Account verification or suspension threats

IMPORTANT: Do NOT claim absolute certainty. Use language like "likely", "potentially", "indicators suggest".

Respond ONLY with valid JSON in this exact format:
{
  "riskLevel": "SAFE" | "SUSPICIOUS" | "DANGEROUS",
  "score": <number 0-100>,
  "summary": "<one sentence summary>",
  "redFlags": ["<flag1>", "<flag2>"],
  "explanation": "<detailed explanation>",
  "recommendations": ["<action1>", "<action2>"]
}

Score guide: 0-30 = SAFE, 31-70 = SUSPICIOUS, 71-100 = DANGEROUS`;

async function analyzeWithAI(content, type) {
  const client = getGroqClient();
  if (!client) return analyzeWithRules(content);

  try {
    const completion = await client.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Analyze this ${type} for scam indicators:\n\n${content}` },
      ],
      temperature: 0.3,
      max_tokens: 800,
    });

    const raw = completion.choices[0]?.message?.content?.trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const result = JSON.parse(jsonMatch[0]);

    if (!result.riskLevel || !['SAFE', 'SUSPICIOUS', 'DANGEROUS'].includes(result.riskLevel)) {
      throw new Error('Invalid riskLevel');
    }
    if (typeof result.score !== 'number') throw new Error('Invalid score');

    return { ...result, analysisMode: 'AI' };
  } catch (err) {
    console.error('Groq AI error, using fallback:', err.message);
    return analyzeWithRules(content);
  }
}

module.exports = { analyzeWithAI };
