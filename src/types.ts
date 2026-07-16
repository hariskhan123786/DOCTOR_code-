/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export type Category = 
  | 'Security' 
  | 'Performance' 
  | 'Readability' 
  | 'Maintainability' 
  | 'Accessibility' 
  | 'Best Practices' 
  | 'Documentation' 
  | 'Complexity' 
  | 'Optimization';

export interface Suggestion {
  id: string;
  issue: string;
  severity: Severity;
  category: Category;
  why: string;
  solution: string;
  exampleBefore: string;
  exampleAfter: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedImprovement: string;
  lineStart?: number;
}

export interface CodeMetrics {
  linesOfCode: number;
  functions: number;
  variables: number;
  comments: number;
  classes: number;
  imports: number;
  loops: number;
  conditions: number;
  estimatedComplexity: string;
}

export interface AnalysisResult {
  score: number;
  metrics: CodeMetrics;
  suggestions: Suggestion[];
  summary: string;
  strengths: string[];
  weaknesses: string[];
  priorityIssues: string[];
  categories: Record<Category, number>;
}

export interface Settings {
  animationSpeed: 'slow' | 'normal' | 'fast';
  accentColor: 'purple' | 'blue' | 'emerald' | 'rose';
  cardRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  theme: 'dark' | 'light';
}

export type SelectedLanguage = 
  | 'auto'
  | 'html'
  | 'css'
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'java'
  | 'c'
  | 'cpp'
  | 'csharp'
  | 'php'
  | 'sql'
  | 'go'
  | 'rust'
  | 'swift'
  | 'kotlin';

export const LANGUAGE_LABELS: Record<SelectedLanguage, string> = {
  auto: 'Auto Detect',
  html: 'HTML',
  css: 'CSS',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  java: 'Java',
  c: 'C',
  cpp: 'C++',
  csharp: 'C#',
  php: 'PHP',
  sql: 'SQL',
  go: 'Go',
  rust: 'Rust',
  swift: 'Swift',
  kotlin: 'Kotlin',
};
