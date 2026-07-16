/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Suggestion, 
  Severity, 
  Settings 
} from '../types';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle, 
  ArrowRight, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Compass, 
  Code
} from 'lucide-react';

interface SuggestionCardsProps {
  suggestions: Suggestion[];
  settings: Settings;
}

export default function SuggestionCards({ suggestions, settings }: SuggestionCardsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<Severity | 'All'>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  // Filtering Logic
  const filteredSuggestions = suggestions.filter(s => {
    const matchesSearch = 
      s.issue.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.why.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = severityFilter === 'All' || s.severity === severityFilter;

    return matchesSearch && matchesSeverity;
  });

  const getSeverityBadge = (sev: Severity) => {
    switch (sev) {
      case 'Critical':
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold font-mono uppercase bg-red-500/10 text-red-400 border border-red-500/20 rounded">
            Critical
          </span>
        );
      case 'High':
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold font-mono uppercase bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded">
            High Severity
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold font-mono uppercase bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded">
            Medium
          </span>
        );
      case 'Low':
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold font-mono uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
            Optimization
          </span>
        );
    }
  };

  const getDifficultyColor = (diff: Suggestion['difficulty']) => {
    switch (diff) {
      case 'Easy': return 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/5 border-yellow-500/20';
      case 'Hard': return 'text-red-400 bg-red-500/5 border-red-500/20';
    }
  };

  const cardRadiusClass = 
    settings.cardRadius === 'none' ? 'rounded-none' :
    settings.cardRadius === 'sm' ? 'rounded-sm' :
    settings.cardRadius === 'md' ? 'rounded-md' :
    settings.cardRadius === 'lg' ? 'rounded-lg' : 'rounded-2xl';

  const accentColorClass = 
    settings.accentColor === 'purple' ? 'border-purple-500/40 focus:border-purple-500 text-purple-400' :
    settings.accentColor === 'blue' ? 'border-blue-500/40 focus:border-blue-500 text-blue-400' :
    settings.accentColor === 'emerald' ? 'border-emerald-500/40 focus:border-emerald-500 text-emerald-400' :
    'border-rose-500/40 focus:border-rose-500 text-rose-400';

  const filterButtonClass = (sev: Severity | 'All') => {
    const isSelected = severityFilter === sev;
    const isDark = settings.theme === 'dark';
    
    const activeColorClass = 
      settings.accentColor === 'purple' ? 'bg-indigo-600 text-white border-indigo-500' :
      settings.accentColor === 'blue' ? 'bg-blue-600 text-white border-blue-500' :
      settings.accentColor === 'emerald' ? 'bg-emerald-600 text-white border-emerald-500' :
      'bg-rose-600 text-white border-rose-500';

    if (isSelected) {
      return `${activeColorClass} shadow-md`;
    }
    return isDark 
      ? 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40' 
      : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200/50';
  };

  return (
    <div id="suggestion-cards-container" className="space-y-6 font-sans">
      
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        
        {/* Instant Search Bar */}
        <div className="relative w-full md:w-80">
          <input
            id="suggestion-search-input"
            type="text"
            placeholder="Search code issues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full text-xs bg-slate-900 border border-slate-800 px-4 py-2.5 pl-9 text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 ${cardRadiusClass}`}
          />
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
        </div>

        {/* Severity Toggle Filter */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-[10px] font-mono text-slate-400 font-bold mr-2 uppercase">Filter:</span>
          {(['All', 'Critical', 'High', 'Medium', 'Low'] as const).map((sev) => (
            <button
              id={`filter-sev-${sev}`}
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 text-xs font-semibold border ${cardRadiusClass} transition-all duration-200 ${filterButtonClass(sev)}`}
            >
              {sev === 'All' ? 'Show All' : sev}
            </button>
          ))}
        </div>

      </div>

      {/* Suggestion list */}
      <div className="space-y-4">
        {filteredSuggestions.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl bg-slate-950/20">
            <CheckCircle className="w-8 h-8 text-slate-600 mx-auto mb-2.5 animate-pulse" />
            <p className="text-slate-400 text-xs font-semibold">No issues match current filter parameters</p>
            <p className="text-[10px] text-slate-500 mt-1">Excellent job! Your code is fully aligned with CodeDoctor rules.</p>
          </div>
        ) : (
          filteredSuggestions.map((s) => {
            const isExpanded = expandedId === s.id;
            
            return (
              <div
                id={`suggestion-card-${s.id}`}
                key={s.id}
                className={`glassmorphism ${cardRadiusClass} border border-slate-800/80 overflow-hidden transition-all duration-300 hover:border-slate-700/80`}
              >
                {/* Collapsed Header */}
                <div
                  id={`suggestion-header-${s.id}`}
                  onClick={() => toggleExpand(s.id)}
                  className="p-4 flex items-center justify-between cursor-pointer select-none hover:bg-slate-800/20"
                >
                  <div className="flex items-center gap-3.5 flex-wrap md:flex-nowrap">
                    {getSeverityBadge(s.severity)}
                    <div>
                      <h4 className="text-xs font-display font-bold text-slate-100 flex items-center gap-1.5 flex-wrap">
                        {s.issue}
                        {s.lineStart && (
                          <span className="text-[10px] font-mono bg-slate-950 px-1.5 py-0.5 rounded text-slate-400 font-medium">
                            Line {s.lineStart}
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono uppercase mt-1">Category: {s.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-500">
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10">
                      {s.estimatedImprovement}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="p-4 border-t border-slate-800/60 bg-slate-950/20 space-y-4">
                    
                    {/* Meta Parameters Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className={`p-2.5 border rounded bg-slate-900/40 border-slate-800/80`}>
                        <span className="text-[9px] uppercase font-mono text-slate-500 font-bold block">Correction Effort</span>
                        <span className={`text-xs font-semibold mt-1 inline-block px-2 py-0.5 rounded border ${getDifficultyColor(s.difficulty)}`}>
                          {s.difficulty}
                        </span>
                      </div>
                      <div className="p-2.5 border rounded bg-slate-900/40 border-slate-800/80 md:col-span-3">
                        <span className="text-[9px] uppercase font-mono text-slate-500 font-bold block">Impact Estimate</span>
                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-1">
                          <Zap className="w-3.5 h-3.5 text-emerald-400" />
                          {s.estimatedImprovement}
                        </span>
                      </div>
                    </div>

                    {/* Explanations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <h5 className="text-[10px] uppercase font-mono text-slate-400 font-bold tracking-wider">Analysis (Why)</h5>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">{s.why}</p>
                      </div>
                      <div className="space-y-1.5">
                        <h5 className="text-[10px] uppercase font-mono text-slate-400 font-bold tracking-wider">Remediation Guide</h5>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">{s.solution}</p>
                      </div>
                    </div>

                    {/* Before-After Code Improvement Grid */}
                    <div className="space-y-2">
                      <h5 className="text-[10px] uppercase font-mono text-slate-400 font-bold tracking-wider flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5 text-indigo-400" />
                        Interactive Code Improvement Diff
                      </h5>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Before block */}
                        <div className="border border-red-500/20 rounded-lg overflow-hidden bg-red-950/5">
                          <div className="bg-red-950/20 border-b border-red-500/10 px-3 py-1.5 flex items-center justify-between text-[10px] font-mono text-red-400 font-bold">
                            <span>Vulnerable Code (Before)</span>
                            <span className="px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 font-sans">Tripped</span>
                          </div>
                          <pre className="p-3 text-red-300 font-mono text-[11px] overflow-x-auto whitespace-pre leading-5">
                            <code>{s.exampleBefore}</code>
                          </pre>
                        </div>

                        {/* After block */}
                        <div className="border border-emerald-500/20 rounded-lg overflow-hidden bg-emerald-950/5">
                          <div className="bg-emerald-950/20 border-b border-emerald-500/10 px-3 py-1.5 flex items-center justify-between text-[10px] font-mono text-emerald-400 font-bold">
                            <span>Remediated Code (After)</span>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 font-sans">Resolved</span>
                          </div>
                          <pre className="p-3 text-emerald-300 font-mono text-[11px] overflow-x-auto whitespace-pre leading-5">
                            <code>{s.exampleAfter}</code>
                          </pre>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
