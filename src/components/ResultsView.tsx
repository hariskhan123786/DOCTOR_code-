/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { 
  AnalysisResult, 
  Settings, 
  Category 
} from '../types';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Flame, 
  BookOpen, 
  Maximize2, 
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';

interface ResultsViewProps {
  result: AnalysisResult;
  settings: Settings;
}

export default function ResultsView({ result, settings }: ResultsViewProps) {
  const { score, metrics, summary, strengths, weaknesses, priorityIssues, categories } = result;
  
  // Animation for counter
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = settings.animationSpeed === 'fast' ? 400 : settings.animationSpeed === 'slow' ? 1500 : 800;
    const stepTime = Math.abs(Math.floor(duration / score));
    
    const timer = setInterval(() => {
      start += 1;
      if (start >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score, settings.animationSpeed]);

  // Determine Badge
  let badgeName = "Critical Adjustments";
  let badgeColor = "bg-red-500/10 text-red-400 border-red-500/20";
  let badgeIcon = <ShieldAlert className="w-4 h-4 text-red-400" />;
  
  if (score >= 90) {
    badgeName = "Excellent Standing";
    badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    badgeIcon = <Award className="w-4 h-4 text-emerald-400" />;
  } else if (score >= 75) {
    badgeName = "Good Architectural Health";
    badgeColor = "bg-blue-500/10 text-blue-400 border-blue-500/20";
    badgeIcon = <CheckCircle2 className="w-4 h-4 text-blue-400" />;
  } else if (score >= 60) {
    badgeName = "Needs Improvement";
    badgeColor = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    badgeIcon = <AlertTriangle className="w-4 h-4 text-yellow-400" />;
  }

  // Radial score colors
  const radialColor = 
    score >= 90 ? 'stroke-emerald-500' :
    score >= 75 ? 'stroke-blue-500' :
    score >= 60 ? 'stroke-yellow-500' :
    'stroke-red-500';

  const cardRadiusClass = 
    settings.cardRadius === 'none' ? 'rounded-none' :
    settings.cardRadius === 'sm' ? 'rounded-sm' :
    settings.cardRadius === 'md' ? 'rounded-md' :
    settings.cardRadius === 'lg' ? 'rounded-lg' : 'rounded-2xl';

  // Custom SVG Radar Math
  const radarAxes: { name: Category; key: Category }[] = [
    { name: 'Security', key: 'Security' },
    { name: 'Performance', key: 'Performance' },
    { name: 'Readability', key: 'Readability' },
    { name: 'Maintainability', key: 'Maintainability' },
    { name: 'Accessibility', key: 'Accessibility' },
    { name: 'Documentation', key: 'Documentation' },
  ];

  const radarWidth = 260;
  const radarHeight = 260;
  const cx = radarWidth / 2;
  const cy = radarHeight / 2;
  const r = 85;

  const getCoordinates = (index: number, val: number) => {
    const angle = (index * 2 * Math.PI) / radarAxes.length - Math.PI / 2;
    const valueRatio = val / 100;
    const x = cx + r * valueRatio * Math.cos(angle);
    const y = cy + r * valueRatio * Math.sin(angle);
    return { x, y };
  };

  // Generate grid lines
  const gridPolygons = [0.2, 0.4, 0.6, 0.8, 1.0].map((ratio) => {
    const points = radarAxes.map((_, i) => {
      const angle = (i * 2 * Math.PI) / radarAxes.length - Math.PI / 2;
      const x = cx + r * ratio * Math.cos(angle);
      const y = cy + r * ratio * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
    return points;
  });

  // Calculate user score points path
  const userScorePoints = radarAxes.map((axis, i) => {
    const scoreVal = categories[axis.key] || 50;
    const { x, y } = getCoordinates(i, scoreVal);
    return `${x},${y}`;
  }).join(' ');

  // Labels positioning
  const radarLabels = radarAxes.map((axis, i) => {
    const angle = (i * 2 * Math.PI) / radarAxes.length - Math.PI / 2;
    // Pushing label slightly further than max radius
    const labelX = cx + (r + 20) * Math.cos(angle);
    const labelY = cy + (r + 14) * Math.sin(angle);
    
    // Anchor alignment helper
    let textAnchor = 'middle';
    if (Math.cos(angle) > 0.1) textAnchor = 'start';
    if (Math.cos(angle) < -0.1) textAnchor = 'end';

    return { name: axis.name, x: labelX, y: labelY, textAnchor };
  });

  // Code Metrics layout values
  const metricsList = [
    { name: 'Lines of Code (LOC)', value: metrics.linesOfCode, color: 'text-purple-400 bg-purple-500/10' },
    { name: 'Functions / Blocks', value: metrics.functions, color: 'text-blue-400 bg-blue-500/10' },
    { name: 'Variables / Constants', value: metrics.variables, color: 'text-emerald-400 bg-emerald-500/10' },
    { name: 'Comments & Docs', value: metrics.comments, color: 'text-pink-400 bg-pink-500/10' },
    { name: 'Loops & Map Iterations', value: metrics.loops, color: 'text-amber-400 bg-amber-500/10' },
    { name: 'Conditional Paths', value: metrics.conditions, color: 'text-cyan-400 bg-cyan-500/10' },
  ];

  const themeDark = settings.theme === 'dark';

  const radarColorClass = 
    settings.accentColor === 'purple' ? 'fill-indigo-500/10 stroke-indigo-500' :
    settings.accentColor === 'blue' ? 'fill-blue-500/10 stroke-blue-500' :
    settings.accentColor === 'emerald' ? 'fill-emerald-500/10 stroke-emerald-500' :
    'fill-rose-500/10 stroke-rose-500';

  const vertexColorClass = 
    settings.accentColor === 'purple' ? 'fill-indigo-400' :
    settings.accentColor === 'blue' ? 'fill-blue-400' :
    settings.accentColor === 'emerald' ? 'fill-emerald-400' :
    'fill-rose-400';

  return (
    <div id="results-view-container" className="space-y-6 font-sans">
      
      {/* Overview Block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Animated Circle Circular score */}
        <div className={`p-6 glassmorphism ${cardRadiusClass} flex flex-col items-center justify-center text-center space-y-4 border border-slate-800/80`}>
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Overall Audit Grade</h3>
          
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="60"
                className="stroke-slate-800/40 fill-none"
                strokeWidth="8"
              />
              <circle
                cx="72"
                cy="72"
                r="60"
                className={`fill-none ${radialColor} transition-all ease-out`}
                strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 60}`}
                strokeDashoffset={`${2 * Math.PI * 60 * (1 - animatedScore / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span id="animated-score-number" className="text-4xl font-display font-extrabold text-white leading-none">
                {animatedScore}
              </span>
              <span className="text-[10px] text-slate-500 font-mono mt-1 font-bold">/ 100</span>
            </div>
          </div>

          <div className={`px-3 py-1.5 border rounded-full text-xs font-semibold flex items-center gap-1.5 ${badgeColor}`}>
            {badgeIcon}
            {badgeName}
          </div>
        </div>

        {/* AI summary & diagnostics */}
        <div className={`md:col-span-2 p-6 glassmorphism ${cardRadiusClass} flex flex-col justify-between border border-slate-800/80`}>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="font-display font-bold text-sm text-slate-200">Diagnostics Executive Summary</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{summary}</p>
          </div>

          {/* Quick Priorities */}
          <div className="border-t border-slate-800/60 pt-4 mt-4 space-y-2">
            <h4 className="text-[10px] uppercase font-mono text-slate-400 tracking-wider font-bold">Priority Resolution Issues</h4>
            <div className="flex flex-wrap gap-2">
              {priorityIssues.map((issue, idx) => (
                <div 
                  key={idx} 
                  className={`px-2.5 py-1 text-[10px] rounded border font-mono font-semibold bg-slate-950/80 text-red-400 border-red-500/20 flex items-center gap-1.5`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  {issue}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Strengths & Weaknesses Block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Strengths */}
        <div className={`p-5 glassmorphism ${cardRadiusClass} space-y-4 border border-slate-800/60`}>
          <h4 className="text-xs font-display font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Key Architecture Strengths
          </h4>
          <ul className="space-y-2.5">
            {strengths.map((str, idx) => (
              <li key={idx} className="flex gap-2.5 items-start text-xs text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                {str}
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className={`p-5 glassmorphism ${cardRadiusClass} space-y-4 border border-slate-800/60`}>
          <h4 className="text-xs font-display font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            Vulnerabilities / Anti-Patterns Detected
          </h4>
          <ul className="space-y-2.5">
            {weaknesses.map((weak, idx) => (
              <li key={idx} className="flex gap-2.5 items-start text-xs text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                {weak}
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Advanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Custom SVG Radar Chart */}
        <div className={`p-6 glassmorphism ${cardRadiusClass} flex flex-col items-center justify-center border border-slate-800/60 text-center`}>
          <div className="flex items-center gap-2 mb-4 self-start">
            <Layers className="w-4 h-4 text-indigo-400" />
            <h3 className="font-display font-bold text-sm text-slate-200">Quality Vector Analysis</h3>
          </div>
          
          <div className="relative">
            <svg width={radarWidth} height={radarHeight}>
              {/* Radar Grid Polygons */}
              {gridPolygons.map((points, index) => (
                <polygon
                  key={index}
                  points={points}
                  className="fill-none stroke-slate-800"
                  strokeWidth="1"
                />
              ))}

              {/* Angle Axes Lines */}
              {radarAxes.map((_, i) => {
                const { x, y } = getCoordinates(i, 100);
                return (
                  <line
                    key={i}
                    x1={cx}
                    y1={cy}
                    x2={x}
                    y2={y}
                    className="stroke-slate-800"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                );
              })}

              {/* User Score Filled Polygon with Glow effect */}
              <polygon
                points={userScorePoints}
                className={radarColorClass}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Axis vertices circles */}
              {radarAxes.map((axis, i) => {
                const scoreVal = categories[axis.key] || 50;
                const { x, y } = getCoordinates(i, scoreVal);
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    className={`${vertexColorClass} stroke-slate-950`}
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Labels */}
              {radarLabels.map((lbl, idx) => (
                <text
                  key={idx}
                  x={lbl.x}
                  y={lbl.y}
                  textAnchor={lbl.textAnchor}
                  className="fill-slate-400 font-mono text-[9px] font-medium"
                >
                  {lbl.name}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Categories Progress Bars & Metrics */}
        <div className={`p-6 glassmorphism ${cardRadiusClass} space-y-4 border border-slate-800/60`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="font-display font-bold text-sm text-slate-200">Category Compliance Metrics</h3>
          </div>

          <div className="space-y-3.5">
            {Object.entries(categories).slice(0, 5).map(([categoryName, catScore]) => {
              const progressColor = 
                catScore >= 90 ? 'bg-emerald-500 glow-green' :
                catScore >= 75 ? 'bg-blue-500' :
                catScore >= 60 ? 'bg-yellow-500' :
                'bg-red-500';

              return (
                <div key={categoryName} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">{categoryName}</span>
                    <span className="font-mono text-slate-200 font-bold">{catScore}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className={`h-full ${progressColor} transition-all duration-1000`}
                      style={{ width: `${catScore}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Code Metrics Grid Counter */}
      <div className={`p-6 glassmorphism ${cardRadiusClass} space-y-4 border border-slate-800/60`}>
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-4 h-4 text-purple-400" />
          <h3 className="font-display font-bold text-sm text-slate-200">Code Syntax Metrics</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {metricsList.map((item, idx) => (
            <div 
              key={idx} 
              className={`p-3.5 bg-slate-950/50 border border-slate-800/80 ${cardRadiusClass} flex flex-col justify-between`}
            >
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{item.name}</span>
              <span className="text-2xl font-mono font-bold text-slate-100 mt-2">{item.value}</span>
            </div>
          ))}
        </div>
        
        <div className="pt-3 flex flex-wrap gap-4 items-center justify-between border-t border-slate-800/40 text-[10px] text-slate-500 font-mono">
          <span className="flex items-center gap-1">
            <Maximize2 className="w-3.5 h-3.5 text-slate-600" />
            AST COMPLEXITY DEPTH: <strong className="text-slate-300">{metrics.estimatedComplexity}</strong>
          </span>
          <span>Diagnostics executed strictly offline.</span>
        </div>
      </div>

    </div>
  );
}
