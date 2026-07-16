/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  SelectedLanguage, 
  AnalysisResult, 
  Settings, 
  LANGUAGE_LABELS 
} from './types';
import { analyzeCode, PRESETS_CODE } from './utils/analyzer';
import LandingPage from './components/LandingPage';
import CodeEditor from './components/CodeEditor';
import ResultsView from './components/ResultsView';
import SuggestionCards from './components/SuggestionCards';
import ReportView from './components/ReportView';
import SettingsPanel from './components/SettingsPanel';
import AIAssistant from './components/AIAssistant';
import { 
  Code2, 
  Play, 
  Activity, 
  Sparkles, 
  Sliders, 
  Layers, 
  FileText, 
  LogOut, 
  ChevronUp, 
  Sun, 
  Moon, 
  Cpu,
  RefreshCw,
  Search,
  MessageSquare
} from 'lucide-react';

export default function App() {
  // Global App View Mode: 'landing' or 'workspace'
  const [mode, setMode] = useState<'landing' | 'workspace'>('landing');
  
  // Workspace Tab Routing
  const [activeTab, setActiveTab] = useState<'editor' | 'results' | 'suggestions' | 'report' | 'settings'>('editor');

  // Custom Settings State
  const [settings, setSettings] = useState<Settings>({
    animationSpeed: 'normal',
    accentColor: 'purple',
    cardRadius: 'lg',
    theme: 'dark'
  });

  // Source code state (pre-seeded with default functional JavaScript sample)
  const [code, setCode] = useState<string>(PRESETS_CODE.javascript);
  const [language, setLanguage] = useState<SelectedLanguage>('auto');

  // Analysis result states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // Loader animations lines
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingMessages = [
    'Initializing lexical abstract syntax tree (AST)...',
    'Running security integrity checklist...',
    'Analyzing nested scope time complexities...',
    'Enforcing accessibility structures...',
    'Assembling quality recommendations...'
  ];

  // Scroll Progress and Back-to-Top
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync theme with HTML document element for light/dark switching
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
      root.style.backgroundColor = '#050505';
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#fafafa';
    }
  }, [settings.theme]);

  const handleLaunchWorkspace = () => {
    setMode('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnLanding = () => {
    setMode('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Diagnostic Analyzer Trigger
  const handleTriggerAnalysis = () => {
    if (!code.trim()) return;

    setIsAnalyzing(true);
    setLoadingStep(0);

    // Speed parameter from settings config
    const intervalTime = settings.animationSpeed === 'fast' ? 120 : settings.animationSpeed === 'slow' ? 350 : 200;

    // Run custom loading screen steps
    const timer = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= loadingMessages.length - 1) {
          clearInterval(timer);
          
          // Complete analysis offline
          const result = analyzeCode(code, language);
          setAnalysisResult(result);
          setIsAnalyzing(false);
          setActiveTab('results'); // Auto redirect to results pane
          return 0;
        }
        return prev + 1;
      });
    }, intervalTime);
  };

  // Quick helper classes based on settings
  const cardRadiusClass = 
    settings.cardRadius === 'none' ? 'rounded-none' :
    settings.cardRadius === 'sm' ? 'rounded-sm' :
    settings.cardRadius === 'md' ? 'rounded-md' :
    settings.cardRadius === 'lg' ? 'rounded-lg' : 'rounded-2xl';

  const accentColorClass = 
    settings.accentColor === 'purple' ? 'from-indigo-500 to-purple-600' :
    settings.accentColor === 'blue' ? 'from-blue-600 to-cyan-600' :
    settings.accentColor === 'emerald' ? 'from-emerald-600 to-teal-600' :
    'from-rose-600 to-pink-600';

  const accentBorderClass = 
    settings.accentColor === 'purple' ? 'border-indigo-500/30' :
    settings.accentColor === 'blue' ? 'border-blue-500/30' :
    settings.accentColor === 'emerald' ? 'border-emerald-500/30' :
    'border-rose-500/30';

  const textAccentClass = 
    settings.accentColor === 'purple' ? 'text-indigo-400' :
    settings.accentColor === 'blue' ? 'text-blue-400' :
    settings.accentColor === 'emerald' ? 'text-emerald-400' :
    'text-rose-400';

  const accentBgClass = 
    settings.accentColor === 'purple' ? 'bg-indigo-600' :
    settings.accentColor === 'blue' ? 'bg-blue-600' :
    settings.accentColor === 'emerald' ? 'bg-emerald-600' :
    'bg-rose-600';

  const totalCritical = analysisResult ? analysisResult.suggestions.filter(s => s.severity === 'Critical').length : 0;

  return (
    <div className={`min-h-screen relative overflow-x-hidden transition-colors duration-300
      ${settings.theme === 'dark' ? 'bg-[#050505] text-slate-100 grid-bg-dark' : 'bg-[#fafafa] text-slate-800 grid-bg-light'}`}
    >
      
      {/* Scroll Progress line */}
      <div 
        id="scroll-progress-bar" 
        className={`fixed top-0 left-0 h-1 bg-gradient-to-r ${accentColorClass} z-50 transition-all duration-100`}
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Sticky Top Header Navbar */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors
        ${settings.theme === 'dark' ? 'bg-[#0a0a0a]/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          
          {/* Logo Name */}
          <div 
            id="brand-logo" 
            onClick={handleReturnLanding}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className={`p-2 rounded-xl bg-gradient-to-tr ${accentColorClass} text-white shadow-lg transition-transform group-hover:scale-105`}>
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-black text-base tracking-tight text-white dark:text-slate-100 uppercase">
                CodeDoctor <span className={textAccentClass}>AI</span>
              </span>
              <p className="text-[10px] text-slate-500 font-mono tracking-wider -mt-1 font-bold">LOCAL STATIC ANALYZER</p>
            </div>
          </div>

          {/* Quick Header Navigation Links */}
          <div className="flex items-center gap-3">
            {mode === 'landing' ? (
              <button
                id="btn-nav-launch"
                onClick={handleLaunchWorkspace}
                className={`px-4 py-2 bg-gradient-to-tr ${accentColorClass} text-white text-xs font-bold ${cardRadiusClass} hover:opacity-95 transition-all shadow-md uppercase tracking-wider flex items-center gap-1`}
              >
                Launch Workspace
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              </button>
            ) : (
              <div className="flex items-center gap-3">
                {/* Score counter shorthand */}
                {analysisResult && (
                  <div className={`hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 ${cardRadiusClass} text-xs font-mono font-semibold text-slate-300`}>
                    <Activity className={`w-3.5 h-3.5 ${textAccentClass}`} />
                    Score: <strong className={textAccentClass}>{analysisResult.score}/100</strong>
                  </div>
                )}
                <button
                  id="btn-nav-logout"
                  onClick={handleReturnLanding}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Landing Page</span>
                </button>
              </div>
            )}

            {/* Quick theme toggler in navbar */}
            <button
              id="theme-toggler"
              onClick={() => setSettings(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }))}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition"
              title="Toggle theme"
            >
              {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>
          </div>

        </div>
      </header>

      {/* Main Wrapper Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative">
        
        {/* Animated Loading Overlay Screen for Compilation */}
        {isAnalyzing && (
          <div className="fixed inset-0 bg-slate-950/90 z-50 flex flex-col items-center justify-center text-center p-6 backdrop-blur-sm font-sans">
            <div className={`p-5 rounded-full bg-slate-900 border border-slate-800/80 text-purple-400 shadow-2xl mb-6 relative animate-float`}>
              <RefreshCw className="w-10 h-10 animate-spin text-purple-400" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-purple-500"></span>
              </span>
            </div>
            
            <div className="space-y-2 max-w-sm">
              <h3 className="text-white font-display font-extrabold text-base tracking-tight uppercase">Executing Sandbox Review</h3>
              <p className="text-xs text-slate-400">Analysing code scripts offline safely in browser sandbox</p>
            </div>

            {/* Simulated compiler line */}
            <div className="mt-8 p-3 px-5 bg-slate-900 border border-slate-800 rounded-lg min-w-[280px] text-[11px] font-mono text-indigo-300 flex items-center justify-center gap-2 animate-pulse shadow-lg">
              <Cpu className="w-4 h-4 text-purple-400 animate-spin" />
              {loadingMessages[loadingStep]}
            </div>
          </div>
        )}

        {/* Core Router */}
        {mode === 'landing' ? (
          <LandingPage 
            settings={settings} 
            onLaunchWorkspace={handleLaunchWorkspace} 
          />
        ) : (
          /* Workspace mode */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Navigation Panel */}
            <div className="lg:col-span-1 space-y-4">
              <div className={`p-4 glassmorphism ${cardRadiusClass} border border-slate-800/60 space-y-3.5 shadow-lg`}>
                <h3 className="text-[10px] uppercase font-mono text-slate-500 tracking-wider font-bold">Analysis Suite Navigation</h3>
                
                <div className="flex flex-col gap-1.5">
                  <button
                    id="tab-editor"
                    onClick={() => setActiveTab('editor')}
                    className={`flex items-center gap-2.5 p-3 text-xs font-semibold ${cardRadiusClass} transition-all text-left border
                      ${activeTab === 'editor' 
                        ? `bg-slate-900 border-purple-500/20 text-white ${textAccentClass}` 
                        : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'}`}
                  >
                    <Code2 className="w-4 h-4" />
                    Source Editor
                  </button>

                  <button
                    id="tab-results"
                    disabled={!analysisResult}
                    onClick={() => setActiveTab('results')}
                    className={`flex items-center justify-between p-3 text-xs font-semibold ${cardRadiusClass} transition-all text-left border disabled:opacity-40 disabled:cursor-not-allowed
                      ${activeTab === 'results' 
                        ? `bg-slate-900 border-purple-500/20 text-white ${textAccentClass}` 
                        : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Activity className="w-4 h-4" />
                      Audit Scores
                    </div>
                    {analysisResult && (
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${accentBgClass} text-white`}>
                        {analysisResult.score}
                      </span>
                    )}
                  </button>

                  <button
                    id="tab-suggestions"
                    disabled={!analysisResult}
                    onClick={() => setActiveTab('suggestions')}
                    className={`flex items-center justify-between p-3 text-xs font-semibold ${cardRadiusClass} transition-all text-left border disabled:opacity-40 disabled:cursor-not-allowed
                      ${activeTab === 'suggestions' 
                        ? `bg-slate-900 border-purple-500/20 text-white ${textAccentClass}` 
                        : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Layers className="w-4 h-4" />
                      Review Suggestions
                    </div>
                    {analysisResult && (
                      <span className="text-[10px] font-mono font-bold bg-slate-950 px-2 py-0.5 rounded text-slate-400 border border-slate-800">
                        {analysisResult.suggestions.length}
                      </span>
                    )}
                  </button>

                  <button
                    id="tab-report"
                    disabled={!analysisResult}
                    onClick={() => setActiveTab('report')}
                    className={`flex items-center gap-2.5 p-3 text-xs font-semibold ${cardRadiusClass} transition-all text-left border disabled:opacity-40 disabled:cursor-not-allowed
                      ${activeTab === 'report' 
                        ? `bg-slate-900 border-purple-500/20 text-white ${textAccentClass}` 
                        : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'}`}
                  >
                    <FileText className="w-4 h-4" />
                    Printable Report
                  </button>

                  <div className="h-px bg-slate-800/60 my-2" />

                  <button
                    id="tab-settings"
                    onClick={() => setActiveTab('settings')}
                    className={`flex items-center gap-2.5 p-3 text-xs font-semibold ${cardRadiusClass} transition-all text-left border
                      ${activeTab === 'settings' 
                        ? `bg-slate-900 border-purple-500/20 text-white ${textAccentClass}` 
                        : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'}`}
                  >
                    <Sliders className="w-4 h-4" />
                    Diagnostics Settings
                  </button>
                </div>
              </div>

              {/* Sidebar stats banner */}
              {analysisResult && (
                <div className={`p-4 bg-slate-950/40 border border-slate-900 ${cardRadiusClass} space-y-3.5 text-xs text-slate-400`}>
                  <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase text-slate-500">
                    <span>Audit Status</span>
                    <span className="text-emerald-400">PASSED</span>
                  </div>
                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span>Total Lines Checked:</span>
                      <strong className="text-slate-200">{analysisResult.metrics.linesOfCode}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Critical Security Warnings:</span>
                      <strong className={totalCritical > 0 ? 'text-red-400' : 'text-slate-400'}>{totalCritical}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Complexity Forecast:</span>
                      <strong className="text-indigo-400">{analysisResult.metrics.estimatedComplexity}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic Panel Content Router */}
            <div className="lg:col-span-3 space-y-6">
              {activeTab === 'editor' && (
                <CodeEditor
                  settings={settings}
                  code={code}
                  setCode={setCode}
                  language={language}
                  setLanguage={setLanguage}
                  onAnalyze={handleTriggerAnalysis}
                  isAnalyzing={isAnalyzing}
                />
              )}

              {activeTab === 'results' && analysisResult && (
                <ResultsView 
                  result={analysisResult} 
                  settings={settings} 
                />
              )}

              {activeTab === 'suggestions' && analysisResult && (
                <SuggestionCards 
                  suggestions={analysisResult.suggestions} 
                  settings={settings} 
                />
              )}

              {activeTab === 'report' && analysisResult && (
                <ReportView 
                  result={analysisResult} 
                  settings={settings} 
                />
              )}

              {activeTab === 'settings' && (
                <SettingsPanel 
                  settings={settings} 
                  setSettings={setSettings} 
                />
              )}
            </div>

          </div>
        )}
      </main>

      {/* Floating AI Agent Chat Widget */}
      <AIAssistant 
        settings={settings} 
        currentScore={analysisResult?.score} 
        criticalCount={totalCritical}
      />

      {/* Sticky Back-to-Top Control */}
      {showScrollTop && (
        <button
          id="btn-back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-6 left-6 p-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-105 z-40`}
          title="Back to Top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* Footer Block */}
      <footer className={`mt-24 border-t transition-colors
        ${settings.theme === 'dark' ? 'bg-[#0d0d0d] border-slate-800' : 'bg-slate-50 border-slate-200'}`}
      >
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 font-sans">
          <div className="flex items-center gap-2">
            <Code2 className={`w-4 h-4 ${textAccentClass}`} />
            <span className="font-semibold text-slate-400 font-display">CodeDoctor AI © 2026</span>
            <span className="text-slate-700">|</span>
            <span>Your Personal AI Code Reviewer</span>
          </div>

          <div className="flex gap-4 items-center">
            <span className="font-mono text-[10px] uppercase text-emerald-500/80 tracking-wider">Zero External Hops Safeguard Active</span>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <a href="#features-section" className="hover:text-slate-300 transition-colors">Specs</a>
            <a href="#" className="hover:text-slate-300 transition-colors" onClick={(e) => { e.preventDefault(); handleReturnLanding(); }}>Landing</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
