const Scan = require('../models/Scan');
const { analyzeWithAI } = require('../services/aiService');
const { analyzeURL } = require('../services/urlAnalyzer');

const analyze = async (req, res) => {
  const { content, type } = req.body;
  if (!content || !content.trim())
    return res.status(400).json({ error: 'Content is required' });
  if (!['message', 'email', 'job', 'url'].includes(type))
    return res.status(400).json({ error: 'Invalid scan type' });

  try {
    let technicalFindings = null;
    let analysisContent = content;

    if (type === 'url') {
      technicalFindings = analyzeURL(content);
      analysisContent = `URL: ${content}\n\nTechnical findings: ${JSON.stringify(technicalFindings)}`;
    }

    const result = await analyzeWithAI(analysisContent, type);

    const scan = await Scan.create({
      userId: req.user._id,
      type,
      content: content.substring(0, 2000),
      riskLevel: result.riskLevel,
      score: result.score,
      summary: result.summary,
      redFlags: result.redFlags || [],
      explanation: result.explanation || '',
      recommendations: result.recommendations || [],
      technicalFindings,
      analysisMode: result.analysisMode,
    });

    res.json({ scan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const analyzeUrl = async (req, res) => {
  req.body.type = 'url';
  return analyze(req, res);
};

const getScans = async (req, res) => {
  try {
    const { risk } = req.query;
    const filter = { userId: req.user._id };
    if (risk && risk !== 'all') filter.riskLevel = risk.toUpperCase();

    const scans = await Scan.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json({ scans });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getScan = async (req, res) => {
  try {
    const scan = await Scan.findOne({ _id: req.params.id, userId: req.user._id });
    if (!scan) return res.status(404).json({ error: 'Scan not found' });
    res.json({ scan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteScan = async (req, res) => {
  try {
    const scan = await Scan.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!scan) return res.status(404).json({ error: 'Scan not found' });
    res.json({ message: 'Scan deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { analyze, analyzeUrl, getScans, getScan, deleteScan };
