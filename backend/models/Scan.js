const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['message', 'email', 'job', 'url'], required: true },
  content: { type: String, required: true },
  riskLevel: { type: String, enum: ['SAFE', 'SUSPICIOUS', 'DANGEROUS'], required: true },
  score: { type: Number, min: 0, max: 100, required: true },
  summary: { type: String, required: true },
  redFlags: [{ type: String }],
  explanation: { type: String },
  recommendations: [{ type: String }],
  technicalFindings: { type: mongoose.Schema.Types.Mixed },
  analysisMode: { type: String, enum: ['AI', 'RULE_BASED'], default: 'AI' },
}, { timestamps: true });

module.exports = mongoose.model('Scan', scanSchema);
