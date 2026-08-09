import { Link } from 'react-router-dom';
import { Shield, Zap, Eye, CheckCircle, MessageSquare, Mail, Briefcase, Link as LinkIcon, CreditCard, Phone } from 'lucide-react';

const features = [
  { icon: Zap, title: 'Instant AI Analysis', desc: 'Groq-powered analysis in seconds' },
  { icon: Eye, title: 'Red Flag Detection', desc: 'Identifies scam patterns and tactics' },
  { icon: CheckCircle, title: 'Safety Recommendations', desc: 'Clear actions to protect yourself' },
];

const steps = [
  'Paste suspicious content',
  'AI analyzes for scam indicators',
  'Get your risk score (0–100)',
  'Understand the red flags',
  'Take safer action',
];

const contentTypes = [
  { icon: Phone, label: 'SMS' },
  { icon: MessageSquare, label: 'WhatsApp' },
  { icon: Mail, label: 'Email' },
  { icon: Briefcase, label: 'Job Offers' },
  { icon: LinkIcon, label: 'URLs' },
  { icon: CreditCard, label: 'Payment Requests' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Shield size={24} className="text-[#00d4ff]" />
          <span className="font-bold text-white text-lg">ScamShield AI</span>
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="btn-secondary text-sm py-2 px-4">Login</Link>
          <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 py-24 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.2)] rounded-full px-4 py-1.5 text-[#00d4ff] text-sm mb-6">
          <Shield size={14} /> AI-Powered Scam Detection
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Don't Trust It.<br />
          <span className="text-[#00d4ff]">Check It.</span>
        </h1>
        <p className="text-slate-400 text-xl mb-10 max-w-2xl mx-auto">
          AI-powered scam detection that helps you identify suspicious messages, emails and links before they cause harm.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="btn-primary text-base py-3 px-8 pulse-glow">
            <Shield size={18} /> Analyze a Scam
          </Link>
          <a href="#how-it-works" className="btn-secondary text-base py-3 px-8">
            How It Works
          </a>
        </div>
      </section>

      {/* Why ScamShield */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-3">Why ScamShield AI?</h2>
        <p className="text-slate-400 text-center mb-12">Built to protect you from modern digital scams</p>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card text-center hover:border-[rgba(0,212,255,0.2)] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[rgba(0,212,255,0.1)] flex items-center justify-center mx-auto mb-4">
                <Icon size={22} className="text-[#00d4ff]" />
              </div>
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-slate-400 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
        <div className="flex flex-col gap-4">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-4 card py-4">
              <div className="w-8 h-8 rounded-full bg-[rgba(0,212,255,0.15)] border border-[rgba(0,212,255,0.3)] flex items-center justify-center text-[#00d4ff] font-bold text-sm flex-shrink-0">
                {i + 1}
              </div>
              <p className="text-slate-300">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Supported Content */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Supported Content</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {contentTypes.map(({ icon: Icon, label }) => (
            <div key={label} className="card text-center py-6 hover:border-[rgba(0,212,255,0.2)] transition-colors">
              <Icon size={24} className="text-[#00d4ff] mx-auto mb-3" />
              <p className="text-slate-300 text-sm font-medium">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto card border-[rgba(0,212,255,0.2)]">
          <Shield size={40} className="text-[#00d4ff] mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Stay Protected Today</h2>
          <p className="text-slate-400 mb-8">Free to use. No credit card required.</p>
          <Link to="/register" className="btn-primary text-base py-3 px-10">
            Start Analyzing for Free
          </Link>
        </div>
      </section>

      <footer className="text-center py-8 text-slate-600 text-sm border-t border-[rgba(255,255,255,0.04)]">
        © 2024 ScamShield AI · HackDevengers 1.0
      </footer>
    </div>
  );
}
