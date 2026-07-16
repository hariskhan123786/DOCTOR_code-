/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Cpu, 
  LineChart, 
  Code2, 
  ChevronDown, 
  ChevronUp, 
  User, 
  Star,
  Lock,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { Settings } from '../types';

interface LandingPageProps {
  settings: Settings;
  onLaunchWorkspace: () => void;
}

export default function LandingPage({ settings, onLaunchWorkspace }: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Stats numerical count-up timers
  const [reviewsCount, setReviewsCount] = useState(2300000);
  const [accuracyRate, setAccuracyRate] = useState(94.5);
  const [analysisSpeed, setAnalysisSpeed] = useState(25);

  useEffect(() => {
    const reviewsInterval = setInterval(() => {
      setReviewsCount(prev => (prev < 2450000 ? prev + 1250 : prev));
    }, 40);

    const speedInterval = setInterval(() => {
      setAnalysisSpeed(prev => (prev > 12 ? prev - 1 : prev));
    }, 150);

    return () => {
      clearInterval(reviewsInterval);
      clearInterval(speedInterval);
    };
  }, []);

  const toggleFaq = (idx: number) => {
    setActiveFaq(prev => (prev === idx ? null : idx));
  };

  const cardRadiusClass = 
    settings.cardRadius === 'none' ? 'rounded-none' :
    settings.cardRadius === 'sm' ? 'rounded-sm' :
    settings.cardRadius === 'md' ? 'rounded-md' :
    settings.cardRadius === 'lg' ? 'rounded-lg' : 'rounded-2xl';

  const accentColorClass = 
    settings.accentColor === 'purple' ? 'from-purple-600 to-indigo-600' :
    settings.accentColor === 'blue' ? 'from-blue-600 to-cyan-600' :
    settings.accentColor === 'emerald' ? 'from-emerald-600 to-teal-600' :
    'from-rose-600 to-pink-600';

  const textAccentClass = 
    settings.accentColor === 'purple' ? 'text-purple-400' :
    settings.accentColor === 'blue' ? 'text-blue-400' :
    settings.accentColor === 'emerald' ? 'text-emerald-400' :
    'text-rose-400';

  const bgGlowClass = 
    settings.accentColor === 'purple' ? 'bg-purple-500/10' :
    settings.accentColor === 'blue' ? 'bg-blue-500/10' :
    settings.accentColor === 'emerald' ? 'bg-emerald-500/10' :
    'bg-rose-500/10';

  const borderAccentHoverClass = 
    settings.accentColor === 'purple' ? 'hover:border-purple-500/30' :
    settings.accentColor === 'blue' ? 'hover:border-blue-500/30' :
    settings.accentColor === 'emerald' ? 'hover:border-emerald-500/30' :
    'hover:border-rose-500/30';

  const stats = [
    { label: 'Analyses Run Globally', value: `${(reviewsCount / 1000000).toFixed(2)}M+` },
    { label: 'Rule-Based Accuracy', value: '99.8%' },
    { label: 'Mean Audit Time', value: `<${analysisSpeed}ms` },
  ];

  const features = [
    {
      icon: <Lock className="w-5 h-5 text-purple-400" />,
      title: '100% Offline Privacy',
      desc: 'All compilation and syntax inspections occur completely sandbox in-browser. Your proprietary scripts never transit external networks.'
    },
    {
      icon: <Cpu className="w-5 h-5 text-blue-400" />,
      title: 'Multi-Language Parsing',
      desc: 'Native support for HTML, CSS, JavaScript, TypeScript, Python, Java, C++, PHP, SQL, Rust, Go, Swift, and Kotlin.'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      title: 'Vulnerability Detection',
      desc: 'Scans for dangerous innerHTML operations, unhandled try-catches, raw memory pointers, hardcoded keys, and SQL Injection vectors.'
    },
    {
      icon: <LineChart className="w-5 h-5 text-pink-400" />,
      title: 'Structural AST Metrics',
      desc: 'Calculates structural densities like Lines of Code, comment-to-logic ratios, conditional forks, loops, and cognitive complexity indicators.'
    },
    {
      icon: <Sparkles className="w-5 h-5 text-yellow-400" />,
      title: 'Interactive Code Diffing',
      desc: 'View side-by-side Before-vs-After suggestions with automated improvements. Understand exactly why bad practices trip rules.'
    },
    {
      icon: <Layers className="w-5 h-5 text-cyan-400" />,
      title: 'Executive PDF/TXT Audits',
      desc: 'Compile comprehensive code reviews, score cards, and roadmap priorities. Perfect for technical lead audits and team reports.'
    }
  ];

  const pricingPlans = [
    {
      name: 'Independent Hacker',
      price: '$0',
      period: 'Forever free',
      desc: 'Perfect for individual builders looking to review standalone scripts offline.',
      features: [
        'Full offline local compiler',
        'Auto Language detection',
        'Search & Severity Filters',
        'Interactive Before/After Diffs',
        'Copy Markdown Report'
      ],
      cta: 'Launch Core Editor',
      popular: false
    },
    {
      name: 'Pro Architect',
      price: '$19',
      period: 'per seat / month',
      desc: 'Enhanced diagnostic sets for active professionals managing larger application folders.',
      features: [
        'Everything in Free Plan',
        'Extended Security checklist',
        'Comprehensive PDF & TXT downloads',
        'Priority Roadmap builder',
        'Integrated Floating AI Chat Agent'
      ],
      cta: 'Start Pro Sandbox',
      popular: true
    },
    {
      name: 'Enterprise Core',
      price: '$49',
      period: 'per seat / month',
      desc: 'Ultimate diagnostic engine with custom rules, CI integrations, and security guarantees.',
      features: [
        'Everything in Pro Plan',
        'Custom Pre-commit Hooks',
        'SLA Security Certification',
        'SSO Admin panel control',
        'Dedicated Architect reviews'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const faqs = [
    {
      q: 'Is my source code sent to any remote servers?',
      a: 'Absolutely not. CodeDoctor operates on a Zero-Server architecture. Your code input stays entirely inside your browser execution engine, running lexical regex compilers locally. There are no API hops, cloud uploads, or database caches.'
    },
    {
      q: 'How does the offline rule analyzer calculate scores?',
      a: 'The local engine parses code line-by-line using abstract pattern matching. It starts with a base score of 96 and deducts weighted penalties for violations: -12 for Critical Security issues, -8 for High Severity bugs, and -4/-2 for Readability or Optimization advice.'
    },
    {
      q: 'Which programming languages are supported?',
      a: 'We offer Auto Detection and dedicated checklists for 15+ environments, including HTML, CSS, JS, TS, Python, Java, C++, PHP, SQL, Go, Rust, Kotlin, and Swift.'
    },
    {
      q: 'Can I print or copy diagnostic audits?',
      a: 'Yes. CodeDoctor includes dedicated Export controls in the Report tab, which let you instantly print formatted physical reports, copy styled markdown logs to your clipboard, or download full-scale TXT files.'
    }
  ];

  return (
    <div id="landing-container" className="space-y-24 pb-16 font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto pt-12 md:pt-20 space-y-6">
        
        {/* Glow Element */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] ${bgGlowClass} rounded-full blur-[100px] pointer-events-none animate-pulse-slow`} />

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-[11px] font-mono text-slate-400 font-semibold uppercase tracking-wider animate-float shadow-xl">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          Offline Sandboxed static analyzer
        </div>

        {/* Header Display */}
        <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight leading-tight text-white">
          Review. Secure. Perfect.<br />
          <span className={`bg-gradient-to-r ${accentColorClass} bg-clip-text text-transparent`}>
            Your Local AI Code Doctor
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
          Instantly review code variables, check for critical security leaks, analyze complexity, and get side-by-side diff refactors. Operates 100% offline in your browser.
        </p>

        {/* Call to Actions */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <button
            id="hero-launch-button"
            onClick={onLaunchWorkspace}
            className={`px-6 py-3.5 bg-gradient-to-tr ${accentColorClass} hover:opacity-95 text-white text-xs font-bold rounded-lg shadow-xl hover:shadow-purple-500/10 flex items-center gap-2 transition-all duration-300 uppercase tracking-wider`}
          >
            Launch Free Analyzer
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="#features-section"
            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 uppercase tracking-wider"
          >
            Explore Specs
          </a>
        </div>
      </section>

      {/* 2. Real-Time numerical stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto border-y border-slate-800/60 py-8 text-center bg-slate-950/20 backdrop-blur-sm">
        {stats.map((stat, idx) => (
          <div key={idx} className="space-y-1">
            <p className="text-3xl md:text-4xl font-mono font-extrabold text-white">{stat.value}</p>
            <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* 3. Features Bento Grid */}
      <section id="features-section" className="space-y-12 max-w-6xl mx-auto scroll-mt-20">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Full-Scale Sandbox Diagnostics</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Everything you need to audit, secure, and document codebases without ever uploading your scripts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className={`p-5 glassmorphism ${cardRadiusClass} border border-slate-800/60 hover:bg-slate-900/10 transition-all duration-300 flex flex-col justify-between ${borderAccentHoverClass}`}
            >
              <div className="space-y-3">
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 w-fit">
                  {feat.icon}
                </div>
                <h3 className="text-sm font-display font-bold text-slate-200">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Chronological How It Works */}
      <section className="space-y-12 max-w-5xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Four Steps to Perfection</h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">How CodeDoctor resolves code debt</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800/40 hidden lg:block -translate-y-1/2 -z-10" />

          {[
            { step: '01', title: 'Paste source code', desc: 'Paste HTML, CSS, JS, Python, SQL, C++, Java, or let the engine auto-detect.' },
            { step: '02', title: 'Execute Audit', desc: 'The engine parses syntax structures line-by-line, matching anti-pattern rules.' },
            { step: '03', title: 'Review Quality', desc: 'Analyze quality scores, SVG radar metrics, and side-by-side diff refactors.' },
            { step: '04', title: 'Export Audits', desc: 'Copy markdown reviews, compile PDFs, or consult the floating AI chat bot.' }
          ].map((item, idx) => (
            <div key={idx} className={`p-5 glassmorphism ${cardRadiusClass} border border-slate-800/60 bg-slate-950/40 space-y-3 relative`}>
              <span className={`text-xs font-mono font-bold ${textAccentClass}`}>{item.step}</span>
              <h4 className="text-xs font-display font-bold text-slate-200">{item.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Pricing Matrix */}
      <section className="space-y-12 max-w-6xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Pragmatic, Local Pricing</h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">Choose a plan that matches your development scope</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPlans.map((plan, idx) => (
            <div
              key={idx}
              className={`p-6 glassmorphism ${cardRadiusClass} flex flex-col justify-between border relative overflow-hidden
                ${plan.popular ? 'border-purple-500/50 scale-100 md:scale-105' : 'border-slate-800/80'}`}
            >
              {plan.popular && (
                <span className="absolute top-3 right-3 px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 text-[9px] font-mono font-bold uppercase rounded text-purple-400 tracking-wider">
                  Developer Pick
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-display font-bold text-slate-200">{plan.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 font-sans">{plan.desc}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-mono font-extrabold text-white">{plan.price}</span>
                  <span className="text-xs text-slate-500 font-mono">{plan.period}</span>
                </div>

                <ul className="space-y-2.5 pt-4 border-t border-slate-800/40">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="text-xs text-slate-300 flex items-center gap-2">
                      <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${plan.popular ? 'text-purple-400' : 'text-slate-500'}`} />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={onLaunchWorkspace}
                className={`w-full mt-6 py-2.5 text-xs font-semibold uppercase tracking-wider ${cardRadiusClass} transition-colors
                  ${plan.popular 
                    ? `bg-gradient-to-tr ${accentColorClass} text-white shadow-xl hover:opacity-95` 
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800/50'}`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ Accordion */}
      <section className="space-y-8 max-w-3xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white">General Inquiries</h2>
          <p className="text-xs text-slate-400">Everything you need to know about CodeDoctor AI</p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isFaqActive = activeFaq === idx;
            return (
              <div
                id={`faq-item-${idx}`}
                key={idx}
                className={`glassmorphism ${cardRadiusClass} border border-slate-800/80 overflow-hidden transition-all duration-250`}
              >
                <div
                  id={`faq-question-${idx}`}
                  onClick={() => toggleFaq(idx)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/20 select-none"
                >
                  <span className="text-xs font-display font-bold text-slate-200">{faq.q}</span>
                  {isFaqActive ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>

                {isFaqActive && (
                  <div className="p-4 border-t border-slate-800/60 bg-slate-950/25 text-xs text-slate-400 leading-relaxed font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. CTA Hero bottom */}
      <section className={`p-8 md:p-12 bg-gradient-to-tr ${accentColorClass} ${cardRadiusClass} max-w-5xl mx-auto text-center space-y-4 border border-white/10 shadow-2xl`}>
        <h3 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight text-white">Ready to secure your code paths offline?</h3>
        <p className="text-xs text-slate-200/80 max-w-md mx-auto leading-relaxed">
          Launch our local analysis suite and check raw scripts, SQL arrays, and HTML images instantly.
        </p>
        <button
          id="btn-footer-cta-launch"
          onClick={onLaunchWorkspace}
          className="px-6 py-3 bg-white text-slate-900 text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg hover:bg-slate-50 transition-all duration-300 inline-flex items-center gap-2"
        >
          Initialize Workspace
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>

    </div>
  );
}
