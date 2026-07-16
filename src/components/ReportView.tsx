/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AnalysisResult, Settings } from '../types';
import { 
  FileText, 
  Printer, 
  Copy, 
  Download, 
  MapPin, 
  Flag, 
  Activity, 
  CheckCircle,
  CopyCheck
} from 'lucide-react';

interface ReportViewProps {
  result: AnalysisResult;
  settings: Settings;
}

export default function ReportView({ result, settings }: ReportViewProps) {
  const { score, metrics, summary, strengths, weaknesses, priorityIssues, categories } = result;
  const [copied, setCopied] = React.useState(false);

  // Derive formal grade
  let grade = "F";
  let gradeColor = "text-red-500 border-red-500/20 bg-red-500/5";
  let gradeDesc = "Requires Immediate Restructuring";

  if (score >= 95) {
    grade = "A+";
    gradeColor = "text-emerald-400 border-emerald-400/20 bg-emerald-500/5";
    gradeDesc = "Excellent Quality & Low Defect Ratio";
  } else if (score >= 90) {
    grade = "A";
    gradeColor = "text-emerald-400 border-emerald-400/20 bg-emerald-500/5";
    gradeDesc = "High Quality, Near Zero Security Risks";
  } else if (score >= 80) {
    grade = "B";
    gradeColor = "text-blue-400 border-blue-400/20 bg-blue-500/5";
    gradeDesc = "Stable Standing, Moderate Refactoring Needed";
  } else if (score >= 70) {
    grade = "C";
    gradeColor = "text-yellow-400 border-yellow-400/20 bg-yellow-500/5";
    gradeDesc = "Refactoring Strongly Advised";
  } else if (score >= 60) {
    grade = "D";
    gradeColor = "text-orange-400 border-orange-400/20 bg-orange-500/5";
    gradeDesc = "Substandard Code Health";
  }

  // Formatting report data for copying
  const generateMarkdownReport = () => {
    return `=========================================
CODEDOCTOR AI AUDIT REPORT
Generated Offline on: ${new Date().toLocaleDateString()}
=========================================

OVERALL Health Score: ${score}/100
GRADE: ${grade} (${gradeDesc})

-----------------------------------------
EXECUTIVE SUMMARY:
${summary}

-----------------------------------------
CODE SYNTATIC METRICS:
- Lines of Code (LOC): ${metrics.linesOfCode}
- Functions/Blocks: ${metrics.functions}
- Variables/Declarations: ${metrics.variables}
- Comments written: ${metrics.comments}
- Class/Object templates: ${metrics.classes}
- Loops & Map mappings: ${metrics.loops}
- Conditional Paths: ${metrics.conditions}
- AST Complexity Rating: ${metrics.estimatedComplexity}

-----------------------------------------
KEY ARCHITECTURE STRENGTHS:
${strengths.map(s => `* ${s}`).join('\n')}

-----------------------------------------
REMEDIAL CONCERNS / ANTI-PATTERNS:
${weaknesses.map(w => `* ${w}`).join('\n')}

-----------------------------------------
IMPROVEMENT ROADMAP PLAN:
1. CRITICAL: Resolve any Hardcoded credentials or SQL query concatenations.
2. OPTIMIZATION: Refactor nested iterations into hash map filters to lower time complexities.
3. BEST PRACTICE: Supplement missing alt attributes and label descriptors to hit AAA accessibility.
4. DOCUMENTATION: Enforce documentation comments on functions with missing docstrings.

=========================================
Report compiled by CodeDoctor AI. No API or cloud data leaks occurred.`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const reportText = generateMarkdownReport();
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `codedoctor_report_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
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

  const isDark = settings.theme === 'dark';

  return (
    <div id="report-view-container" className="space-y-6 font-sans print:bg-white print:text-black">
      
      {/* Report Controls bar (Hidden in print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 print:hidden">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold tracking-tight">Executive Code Audit</h2>
            <p className="text-xs text-slate-400">Export formatted summary, roadmap metrics, and printable audits</p>
          </div>
        </div>

        {/* Exports Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="btn-print-report"
            onClick={handlePrint}
            className={`px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-xs font-semibold text-slate-300 ${cardRadiusClass} transition-colors flex items-center gap-1.5`}
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
          <button
            id="btn-copy-report"
            onClick={handleCopy}
            className={`px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-xs font-semibold text-slate-300 ${cardRadiusClass} transition-colors flex items-center gap-1.5`}
          >
            {copied ? (
              <>
                <CopyCheck className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                Copied Report!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Markdown
              </>
            )}
          </button>
          <button
            id="btn-download-report"
            onClick={handleDownload}
            className={`px-3 py-2 bg-gradient-to-tr ${accentColorClass} text-xs font-semibold text-white ${cardRadiusClass} hover:opacity-90 transition flex items-center gap-1.5`}
          >
            <Download className="w-3.5 h-3.5" />
            Download TXT
          </button>
        </div>
      </div>

      {/* Actual Report Sheet */}
      <div className={`p-8 bg-slate-950/20 border border-slate-800/80 ${cardRadiusClass} space-y-6 print:border-none print:p-0 print:bg-white`}>
        
        {/* Title Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <h3 className="text-xl font-display font-bold text-white print:text-black">CODEDOCTOR™ ARCHITECTURAL REPORT</h3>
            <p className="text-[10px] font-mono text-slate-500 uppercase">
              Engine Version: Core v3.1 | Sandbox: Enabled | UTC: {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className={`p-4 border ${cardRadiusClass} text-center flex flex-col items-center justify-center min-w-[120px] ${gradeColor}`}>
            <span className="text-3xl font-display font-black leading-none">{grade}</span>
            <span className="text-[9px] font-semibold tracking-wider font-mono uppercase mt-1.5">{gradeDesc}</span>
          </div>
        </div>

        {/* Executive summary details */}
        <div className="space-y-2">
          <h4 className="text-xs font-display font-bold text-slate-300 print:text-black uppercase tracking-wider">Executive Review</h4>
          <p className="text-xs text-slate-300 print:text-black leading-relaxed">{summary}</p>
        </div>

        {/* Metric Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-display font-bold text-slate-300 print:text-black uppercase tracking-wider">Audit Metadata Metrics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-900/40 border border-slate-800/40 rounded print:border-black/10">
              <span className="text-[9px] text-slate-500 uppercase font-mono block">Lines of Code (LOC)</span>
              <span className="text-sm font-mono font-bold text-slate-200 print:text-black">{metrics.linesOfCode}</span>
            </div>
            <div className="p-3 bg-slate-900/40 border border-slate-800/40 rounded print:border-black/10">
              <span className="text-[9px] text-slate-500 uppercase font-mono block">Logical Functions</span>
              <span className="text-sm font-mono font-bold text-slate-200 print:text-black">{metrics.functions}</span>
            </div>
            <div className="p-3 bg-slate-900/40 border border-slate-800/40 rounded print:border-black/10">
              <span className="text-[9px] text-slate-500 uppercase font-mono block">Inline Comment lines</span>
              <span className="text-sm font-mono font-bold text-slate-200 print:text-black">{metrics.comments}</span>
            </div>
            <div className="p-3 bg-slate-900/40 border border-slate-800/40 rounded print:border-black/10">
              <span className="text-[9px] text-slate-500 uppercase font-mono block">Ast Complexity Score</span>
              <span className="text-sm font-mono font-bold text-slate-200 print:text-black">{metrics.estimatedComplexity}</span>
            </div>
          </div>
        </div>

        {/* Strengths / Weaknesses Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2.5">
            <h4 className="text-xs font-display font-bold text-emerald-400 print:text-black uppercase tracking-wider">Architecture Strengths</h4>
            <ul className="space-y-1.5 text-xs text-slate-300 print:text-black">
              {strengths.map((str, idx) => (
                <li key={idx} className="flex gap-2">
                  <span>✓</span>
                  {str}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2.5">
            <h4 className="text-xs font-display font-bold text-yellow-400 print:text-black uppercase tracking-wider">Detected Concerns</h4>
            <ul className="space-y-1.5 text-xs text-slate-300 print:text-black">
              {weaknesses.map((weak, idx) => (
                <li key={idx} className="flex gap-2">
                  <span>✗</span>
                  {weak}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Remediation Action Roadmap */}
        <div className="space-y-3 pt-4 border-t border-slate-800/40">
          <h4 className="text-xs font-display font-bold text-slate-300 print:text-black uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-purple-400" />
            Incremental Quality Roadmap (Action Plan)
          </h4>

          <div className="space-y-3.5">
            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0">1</div>
              <div>
                <h5 className="text-xs font-bold text-slate-200 print:text-black">Resolve Critical Security Exposures</h5>
                <p className="text-[11px] text-slate-400 print:text-black/80 mt-0.5 leading-relaxed">
                  Purge any instances of raw 'eval()' commands and avoid innerHTML configurations. Move static tokens or API credentials securely to sandbox '.env' parameters immediately.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0">2</div>
              <div>
                <h5 className="text-xs font-bold text-slate-200 print:text-black">Lower Mathematical Complexity Profiles</h5>
                <p className="text-[11px] text-slate-400 print:text-black/80 mt-0.5 leading-relaxed">
                  Refactor nested loops into O(N) hash lookups using Map or Set. Break up long functions into independent, highly testable helper modules.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0">3</div>
              <div>
                <h5 className="text-xs font-bold text-slate-200 print:text-black">Enforce W3C & WCAG Accessibility</h5>
                <p className="text-[11px] text-slate-400 print:text-black/80 mt-0.5 leading-relaxed">
                  Complement image elements with alternative descriptive text (alt) and assign matching labels to input fields to comply with accessibility rules.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
