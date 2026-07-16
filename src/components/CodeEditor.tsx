/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  SelectedLanguage, 
  LANGUAGE_LABELS, 
  Settings 
} from '../types';
import { PRESETS_CODE, detectLanguage } from '../utils/analyzer';
import { 
  Terminal, 
  Play, 
  Code, 
  Sparkles, 
  FileCode,
  Trash2,
  RefreshCw,
  Cpu
} from 'lucide-react';

interface CodeEditorProps {
  settings: Settings;
  code: string;
  setCode: (code: string) => void;
  language: SelectedLanguage;
  setLanguage: (lang: SelectedLanguage) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export default function CodeEditor({
  settings,
  code,
  setCode,
  language,
  setLanguage,
  onAnalyze,
  isAnalyzing
}: CodeEditorProps) {
  const [detected, setDetected] = useState<SelectedLanguage>('javascript');

  useEffect(() => {
    if (language === 'auto') {
      setDetected(detectLanguage(code));
    }
  }, [code, language]);

  const loadPreset = (lang: SelectedLanguage) => {
    const target = lang === 'auto' ? 'javascript' : lang;
    setCode(PRESETS_CODE[target]);
  };

  const clearCode = () => {
    setCode('');
  };

  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(1, lineCount) }, (_, i) => i + 1);

  const roundedClass = 
    settings.cardRadius === 'none' ? 'rounded-none' :
    settings.cardRadius === 'sm' ? 'rounded-sm' :
    settings.cardRadius === 'md' ? 'rounded-md' :
    settings.cardRadius === 'lg' ? 'rounded-lg' : 'rounded-2xl';

  const accentColorClass = 
    settings.accentColor === 'purple' ? 'from-purple-600 to-indigo-600 hover:shadow-purple-500/20 shadow-purple-500/10' :
    settings.accentColor === 'blue' ? 'from-blue-600 to-cyan-600 hover:shadow-blue-500/20 shadow-blue-500/10' :
    settings.accentColor === 'emerald' ? 'from-emerald-600 to-teal-600 hover:shadow-emerald-500/20 shadow-emerald-500/10' :
    'from-rose-600 to-pink-600 hover:shadow-rose-500/20 shadow-rose-500/10';

  const accentBorderClass = 
    settings.accentColor === 'purple' ? 'border-purple-500 text-purple-400 focus-within:border-purple-500/50' :
    settings.accentColor === 'blue' ? 'border-blue-500 text-blue-400 focus-within:border-blue-500/50' :
    settings.accentColor === 'emerald' ? 'border-emerald-500 text-emerald-400 focus-within:border-emerald-500/50' :
    'border-rose-500 text-rose-400 focus-within:border-rose-500/50';

  const accentBgButtonClass = 
    settings.accentColor === 'purple' ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/30' :
    settings.accentColor === 'blue' ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30' :
    settings.accentColor === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30' :
    'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30';

  const accentTextClass =
    settings.accentColor === 'purple' ? 'text-purple-400' :
    settings.accentColor === 'blue' ? 'text-blue-400' :
    settings.accentColor === 'emerald' ? 'text-emerald-400' :
    'text-rose-400';

  const isDark = settings.theme === 'dark';

  return (
    <div id="code-editor-card" className={`glassmorphism ${roundedClass} overflow-hidden border border-slate-800 flex flex-col h-[580px] font-sans shadow-xl`}>
      {/* Editor Header */}
      <div className={`p-4 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 ${isDark ? 'bg-[#0d0d0d]' : 'bg-slate-50'}`}>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-red-500/80" />
            <span className="w-3.5 h-3.5 rounded-full bg-yellow-500/80" />
            <span className="w-3.5 h-3.5 rounded-full bg-green-500/80" />
          </div>
          <span className="text-slate-800 dark:text-slate-400 text-xs font-mono font-medium flex items-center gap-1.5 border-l border-slate-800 pl-3">
            <Terminal className="w-3.5 h-3.5 text-purple-400" />
            workspace_source_buffer
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Preset templates loader */}
          <div className="flex items-center gap-1">
            <button
              id="btn-load-preset"
              onClick={() => loadPreset(language)}
              className="px-2.5 py-1.5 text-[11px] font-semibold font-mono rounded bg-slate-800/80 dark:bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800/80 transition flex items-center gap-1.5"
              title="Load standard preset containing detectable anti-patterns for review"
            >
              <RefreshCw className="w-3 h-3 text-indigo-400" />
              Load Template
            </button>
            <button
              id="btn-clear-editor"
              onClick={clearCode}
              className="p-1.5 text-xs text-slate-400 hover:text-red-400 rounded hover:bg-slate-800/40 transition"
              title="Clear entire editor"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5">
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value as SelectedLanguage)}
              className="bg-slate-900 border border-slate-800 text-slate-300 text-xs py-1 px-2.5 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 font-medium font-mono"
            >
              {Object.entries(LANGUAGE_LABELS).map(([value, label]) => (
                <option key={value} value={value} className="bg-slate-950 text-slate-300">
                  {label}
                </option>
              ))}
            </select>
            {language === 'auto' && (
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold tracking-wider animate-pulse">
                Auto: {LANGUAGE_LABELS[detected]}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Editor Body Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Side: Line Numbers Rail */}
        <div className="w-12 bg-slate-950/60 dark:bg-[#08080a] border-r border-slate-800/60 select-none py-4 text-right pr-3 font-mono text-[11px] text-slate-600 space-y-1 h-full overflow-hidden leading-6">
          {lineNumbers.map((num) => (
            <div key={num} className="h-6 leading-6">{num}</div>
          ))}
        </div>

        {/* Right Side: Large Textarea */}
        <textarea
          id="editor-textarea"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={`// Paste your HTML, CSS, JavaScript, Python, C++, Java, PHP, SQL, or other code here...
// Then click the analyze button below to trigger CodeDoctor's local rule-based inspection!
// Or click 'Load Template' above to generate pre-packaged vulnerable code instantly.`}
          className="flex-1 h-full bg-slate-900/10 dark:bg-[#0a0a0a] resize-none p-4 text-slate-800 dark:text-slate-300 font-mono text-xs leading-6 focus:outline-none overflow-y-auto"
          spellCheck={false}
          style={{ whiteSpace: 'pre', overflowX: 'auto' }}
        />

        {/* Watermark Logo */}
        {code.trim().length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-6">
            <div className="p-4 rounded-full bg-slate-800/20 text-slate-700 dark:text-slate-500 mb-3 animate-bounce">
              <FileCode className="w-12 h-12" />
            </div>
            <p className="text-sm font-display text-slate-600 dark:text-slate-400 font-semibold">Active Code Workspace</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Ready for static analysis. Paste code blocks, load template presets, or configure language detections.
            </p>
          </div>
        )}
      </div>

      {/* Editor Footer */}
      <div className={`p-4 border-t border-slate-800/80 flex items-center justify-between gap-4 ${isDark ? 'bg-[#0d0d0d]' : 'bg-slate-50'}`}>
        <div className="text-[10px] text-slate-500 font-mono flex items-center gap-3">
          <span>LINES: {lineCount}</span>
          <span>CHARS: {code.length}</span>
          <span className="text-slate-700 font-bold">|</span>
          <span className="flex items-center gap-1 text-emerald-500/80">
            <Cpu className="w-3.5 h-3.5" />
            LOCAL ENGINE SECURED
          </span>
        </div>

        {/* Analyze button */}
        <button
          id="btn-analyze-code"
          onClick={onAnalyze}
          disabled={isAnalyzing || !code.trim()}
          className={`flex items-center justify-center gap-2 px-5 py-2.5 font-display text-xs font-bold ${roundedClass} transition-all shadow-md duration-200 uppercase tracking-wider
            ${accentBgButtonClass} disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              Analyze Code
            </>
          )}
        </button>
      </div>
    </div>
  );
}
