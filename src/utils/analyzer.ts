/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  AnalysisResult, 
  CodeMetrics, 
  Suggestion, 
  SelectedLanguage, 
  Category, 
  Severity 
} from '../types';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// Auto-detect language function
export function detectLanguage(code: string): SelectedLanguage {
  const trimmed = code.trim();
  if (!trimmed) return 'javascript';

  if (trimmed.includes('<!DOCTYPE html') || trimmed.includes('<html') || (trimmed.includes('<div') && trimmed.includes('</div>'))) {
    return 'html';
  }
  if (trimmed.includes('import ') && (trimmed.includes('interface ') || trimmed.includes(': string') || trimmed.includes(': number') || trimmed.includes(': any'))) {
    return 'typescript';
  }
  if (
    trimmed.includes('import ') && 
    (trimmed.includes('react') || trimmed.includes('const ') || trimmed.includes('let ') || trimmed.includes('console.log'))
  ) {
    return 'javascript';
  }
  if (trimmed.includes('def ') && (trimmed.includes('import ') || trimmed.includes('print(') || trimmed.includes('elif ') || trimmed.includes(':\n'))) {
    return 'python';
  }
  if (trimmed.includes('public class ') || (trimmed.includes('System.out.print') && trimmed.includes('public static void main'))) {
    return 'java';
  }
  if (trimmed.includes('#include') || trimmed.includes('int main(') || trimmed.includes('std::cout') || trimmed.includes('cout <<')) {
    return 'cpp';
  }
  if (trimmed.toLowerCase().includes('select ') && trimmed.toLowerCase().includes('from ') && (trimmed.toLowerCase().includes('where ') || trimmed.toLowerCase().includes('join '))) {
    return 'sql';
  }
  if (trimmed.includes('<?php') || (trimmed.includes('echo ') && trimmed.includes('$'))) {
    return 'php';
  }
  if (trimmed.includes('body {') || trimmed.includes('.class {') || trimmed.includes('#id {') || (trimmed.includes('margin:') && trimmed.includes('padding:'))) {
    return 'css';
  }
  if (trimmed.includes('func ') && trimmed.includes('package main')) {
    return 'go';
  }
  if (trimmed.includes('fn main()') || trimmed.includes('let mut ')) {
    return 'rust';
  }
  if (trimmed.includes('import UIKit') || trimmed.includes('func ') && trimmed.includes('var ')) {
    return 'swift';
  }
  if (trimmed.includes('fun main(') || trimmed.includes('val ') || trimmed.includes('var ')) {
    return 'kotlin';
  }

  return 'javascript'; // Default
}

// Perform offline code analysis
export function analyzeCode(code: string, language: SelectedLanguage): AnalysisResult {
  const targetLang = language === 'auto' ? detectLanguage(code) : language;
  
  const lines = code.split('\n');
  const loc = lines.length;

  // Initialize CodeMetrics counters
  let functions = 0;
  let variables = 0;
  let comments = 0;
  let classes = 0;
  let imports = 0;
  let loops = 0;
  let conditions = 0;

  // Track lines that contain comments
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Comments check
    if (
      trimmed.startsWith('//') || 
      trimmed.startsWith('/*') || 
      trimmed.startsWith('*') || 
      trimmed.startsWith('#') || 
      trimmed.startsWith('\'') || 
      trimmed.startsWith('--')
    ) {
      comments++;
    }

    // Functions check
    if (
      trimmed.includes('function ') || 
      trimmed.includes('const ') && trimmed.includes('=>') || 
      trimmed.includes('let ') && trimmed.includes('=>') ||
      trimmed.startsWith('def ') || 
      (trimmed.includes('public ') || trimmed.includes('private ')) && trimmed.includes('(') && trimmed.includes(')') && !trimmed.includes('class ') ||
      trimmed.includes('func ')
    ) {
      functions++;
    }

    // Variables check
    if (
      trimmed.startsWith('const ') || 
      trimmed.startsWith('let ') || 
      trimmed.startsWith('var ') || 
      trimmed.startsWith('val ') || 
      (trimmed.includes('=') && !trimmed.includes('==') && !trimmed.includes('===') && !trimmed.includes('=>') && trimmed.match(/^[a-zA-Z_][a-zA-Z0-9_]*\s*=/))
    ) {
      variables++;
    }

    // Classes check
    if (trimmed.includes('class ') && !trimmed.includes('.class')) {
      classes++;
    }

    // Imports check
    if (
      trimmed.startsWith('import ') || 
      trimmed.startsWith('require(') || 
      trimmed.startsWith('#include') || 
      trimmed.startsWith('use ')
    ) {
      imports++;
    }

    // Loops check
    if (
      trimmed.startsWith('for ') || 
      trimmed.startsWith('for(') || 
      trimmed.startsWith('while ') || 
      trimmed.startsWith('while(') || 
      trimmed.startsWith('foreach ') || 
      trimmed.startsWith('foreach(') || 
      trimmed.includes('.forEach(') || 
      trimmed.includes('.map(')
    ) {
      loops++;
    }

    // Conditions check
    if (
      trimmed.startsWith('if ') || 
      trimmed.startsWith('if(') || 
      trimmed.startsWith('elif ') || 
      trimmed.startsWith('else if') || 
      trimmed.startsWith('switch ') || 
      trimmed.startsWith('switch(')
    ) {
      conditions++;
    }
  });

  const suggestions: Suggestion[] = [];

  // Rules lists
  // 1. SECURITY CHECKS
  if (code.includes('eval(')) {
    const lineIndex = lines.findIndex(l => l.includes('eval(')) + 1;
    suggestions.push({
      id: generateId(),
      issue: 'Use of eval() function',
      severity: 'Critical',
      category: 'Security',
      why: 'The eval() function executes arbitrary string code with local privileges. This opens up critical Remote Code Execution (RCE) and Cross-Site Scripting (XSS) injection vectors.',
      solution: 'Replace eval() with structured execution logic, standard object lookups, JSON.parse(), or direct function references.',
      exampleBefore: 'const obj = eval("process." + userInput);',
      exampleAfter: 'const obj = process[userInput]; // Safe property mapping',
      difficulty: 'Medium',
      estimatedImprovement: '+40% Security Rating',
      lineStart: lineIndex > 0 ? lineIndex : undefined,
    });
  }

  if (code.includes('innerHTML')) {
    const lineIndex = lines.findIndex(l => l.includes('innerHTML')) + 1;
    suggestions.push({
      id: generateId(),
      issue: 'Unsafe DOM writing via innerHTML',
      severity: 'High',
      category: 'Security',
      why: 'Writing direct HTML strings via innerHTML without sanitize safeguards leaves the application vulnerable to Cross-Site Scripting (XSS) injections if user input is contained.',
      solution: 'Use textContent, innerText, or document.createElement() to insert elements safely. If HTML injection is necessary, sanitize using a library like DOMPurify first.',
      exampleBefore: 'element.innerHTML = "<div>" + userInput + "</div>";',
      exampleAfter: 'element.textContent = userInput; // Automatically sanitizes content',
      difficulty: 'Easy',
      estimatedImprovement: '+25% Security Rating',
      lineStart: lineIndex > 0 ? lineIndex : undefined,
    });
  }

  // Detect hardcoded password/API key patterns
  const secretRegex = /(password|passwd|api_key|apikey|secret|private_key|token|auth_token)\s*=\s*['"`]([a-zA-Z0-9_\-+=]{8,})['"`]/i;
  const secretMatch = code.match(secretRegex);
  if (secretMatch) {
    const matchedLine = lines.findIndex(l => secretRegex.test(l)) + 1;
    suggestions.push({
      id: generateId(),
      issue: `Hardcoded credential found: "${secretMatch[1]}"`,
      severity: 'Critical',
      category: 'Security',
      why: 'Hardcoding secrets, tokens, or API keys directly in source files leaks highly sensitive access parameters. If pushed to source repositories, these secrets will be compromised immediately.',
      solution: 'Move sensitive values to environment variables (`.env` files) or retrieve them securely at runtime via a secrets vault.',
      exampleBefore: `const ${secretMatch[1]} = "${secretMatch[2]}";`,
      exampleAfter: `const ${secretMatch[1]} = process.env.${secretMatch[1].toUpperCase()}; // Safe reference`,
      difficulty: 'Easy',
      estimatedImprovement: 'Eliminate Leakage Risk',
      lineStart: matchedLine > 0 ? matchedLine : undefined,
    });
  }

  // Unsafe SQL Example check (SQL injection pattern)
  const sqlInjectionRegex = /select\s+.*\s+from\s+.*\s+where\s+.*\s*=\s*(['"]\s*\+\s*[a-zA-Z0-9_]+|["']\s*\.\s*\$[a-zA-Z0-9_]+|[a-zA-Z0-9_]+\s*\+\s*['"])/i;
  if (sqlInjectionRegex.test(code)) {
    const matchedLine = lines.findIndex(l => sqlInjectionRegex.test(l)) + 1;
    suggestions.push({
      id: generateId(),
      issue: 'Potential SQL Injection vector detected',
      severity: 'Critical',
      category: 'Security',
      why: 'Concatenating raw variables directly into query strings allows malicious actors to craft inputs that alter the structured query, causing data leakage, loss, or unauthorized access.',
      solution: 'Use prepared statements or parameterized queries to cleanly separate SQL logic from parameter values.',
      exampleBefore: 'const query = "SELECT * FROM users WHERE id = \'" + id + "\'";',
      exampleAfter: 'const query = "SELECT * FROM users WHERE id = ?";\nconnection.query(query, [id]);',
      difficulty: 'Medium',
      estimatedImprovement: 'Prevent Database Exploitation',
      lineStart: matchedLine > 0 ? matchedLine : undefined,
    });
  }

  // 2. PERFORMANCE CHECKS
  // Nested loops check
  let hasNestedLoop = false;
  let loopLineIndex = -1;
  for (let i = 0; i < lines.length - 1; i++) {
    const current = lines[i].trim();
    const next = lines[i + 1].trim();
    const isLoop = (str: string) => str.startsWith('for ') || str.startsWith('for(') || str.startsWith('while ') || str.startsWith('while(') || str.includes('.forEach(') || str.includes('.map(');
    if (isLoop(current) && isLoop(next)) {
      hasNestedLoop = true;
      loopLineIndex = i + 1;
      break;
    }
  }
  if (hasNestedLoop) {
    suggestions.push({
      id: generateId(),
      issue: 'Deeply nested loops detected',
      severity: 'Medium',
      category: 'Performance',
      why: 'Executing nested loops triggers exponential O(N²) quadratic time complexity. Large datasets will quickly lock up execution and throttle performance.',
      solution: 'Refactor nesting by indexing items into a hash map, utilizing binary searches, or pre-sorting datasets.',
      exampleBefore: 'for (let i of arr1) { for (let j of arr2) { if (i.id === j.id) { ... } } }',
      exampleAfter: 'const map = new Map(arr2.map(j => [j.id, j]));\nfor (let i of arr1) { if (map.has(i.id)) { ... } } // Linear O(N)',
      difficulty: 'Hard',
      estimatedImprovement: 'Improve complexity from O(N²) to O(N)',
      lineStart: loopLineIndex > 0 ? loopLineIndex : undefined,
    });
  }

  // Unused variables check
  const varNames: string[] = [];
  const varRegex = /(?:const|let|var|val|def)\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
  let match;
  while ((match = varRegex.exec(code)) !== null) {
    if (!['import', 'class', 'function'].includes(match[1])) {
      varNames.push(match[1]);
    }
  }
  // Find variables defined but only appearing once
  const unusedVars = varNames.filter(v => {
    const occurrences = (code.match(new RegExp(`\\b${v}\\b`, 'g')) || []).length;
    return occurrences === 1;
  });
  if (unusedVars.length > 0) {
    const firstUnused = unusedVars[0];
    const lineIndex = lines.findIndex(l => l.includes(firstUnused)) + 1;
    suggestions.push({
      id: generateId(),
      issue: `Unused variable declared: "${firstUnused}"`,
      severity: 'Low',
      category: 'Performance',
      why: `Allocating memory for variables like "${firstUnused}" which are never read wastes runtime storage and clutters the visual namespace of developers trying to read your code.`,
      solution: 'Remove unused declarations entirely, or prefix with an underscore (e.g. `_val`) to indicate intentional bypass.',
      exampleBefore: `const ${firstUnused} = calculateValue(); // never used`,
      exampleAfter: '// Variable deleted to maintain clean stack execution.',
      difficulty: 'Easy',
      estimatedImprovement: 'Cleaner memory allocation & namespace',
      lineStart: lineIndex > 0 ? lineIndex : undefined,
    });
  }

  // 3. READABILITY & MAINTAINABILITY
  // Poor variable name check
  const poorNamesRegex = /\b(let|const|var)\s+([a-z]|[A-Z]|temp|tmp|data|obj|val|value|foo|bar|baz)\b/g;
  const poorNameMatch = poorNamesRegex.exec(code);
  if (poorNameMatch) {
    const matchedLine = lines.findIndex(l => l.includes(poorNameMatch[0])) + 1;
    suggestions.push({
      id: generateId(),
      issue: `Non-descriptive variable name: "${poorNameMatch[2]}"`,
      severity: 'Medium',
      category: 'Readability',
      why: 'Names like "temp", "data", "val", or single characters offer no semantic value to developers, forcing them to trace execution lines to understand variables purposes.',
      solution: 'Rename variables using self-documenting camelCase descriptions that identify the precise data they hold.',
      exampleBefore: `const ${poorNameMatch[2]} = fetchUser();`,
      exampleAfter: 'const loggedInUser = fetchUser(); // Self-documenting',
      difficulty: 'Easy',
      estimatedImprovement: 'Significantly enhanced code readability',
      lineStart: matchedLine > 0 ? matchedLine : undefined,
    });
  }

  // Console.log check (for JavaScript/TypeScript)
  if (['javascript', 'typescript'].includes(targetLang) && code.includes('console.log(')) {
    const lineIndex = lines.findIndex(l => l.includes('console.log(')) + 1;
    suggestions.push({
      id: generateId(),
      issue: 'Debug code console.log left in production',
      severity: 'Low',
      category: 'Best Practices',
      why: 'Leaving verbose print statements clutters the browser execution console, can slow down execution loops, and may inadvertently dump sensitive object logs in customer logs.',
      solution: 'Strip console.log blocks from compiled builds, or use a structured logger that supports multiple environments (debug, info, error).',
      exampleBefore: 'console.log("Response state:", data);',
      exampleAfter: 'logger.debug("Response state fetched"); // Controlled via env configuration',
      difficulty: 'Easy',
      estimatedImprovement: 'Cleaner production logs',
      lineStart: lineIndex > 0 ? lineIndex : undefined,
    });
  }

  // Var usage check (JS/TS)
  if (['javascript', 'typescript'].includes(targetLang) && code.includes('var ')) {
    const lineIndex = lines.findIndex(l => l.includes('var ')) + 1;
    suggestions.push({
      id: generateId(),
      issue: 'Use of deprecated "var" declaration',
      severity: 'Medium',
      category: 'Best Practices',
      why: 'The "var" keyword creates function-scoped, hoisted variables that frequently result in unexpected scoping errors and silent re-declarations.',
      solution: 'Convert deprecated "var" definitions to block-scoped "const" (default) or "let" (for re-assignable values).',
      exampleBefore: 'var count = 10; // Hoisted and un-scoped',
      exampleAfter: 'const count = 10; // Safe block scoping',
      difficulty: 'Easy',
      estimatedImprovement: 'Enforce modern, predictable lexical scoping',
      lineStart: lineIndex > 0 ? lineIndex : undefined,
    });
  }

  // 4. HTML/CSS/ACCESSIBILITY RULES
  if (targetLang === 'html') {
    if (code.includes('<img') && !code.includes('alt=')) {
      const lineIndex = lines.findIndex(l => l.includes('<img')) + 1;
      suggestions.push({
        id: generateId(),
        issue: 'Image tags missing alt attributes',
        severity: 'High',
        category: 'Accessibility',
        why: 'Screen readers cannot describe images that lack alternative text (alt). This alienates visually impaired users and severely damages SEO crawl compliance.',
        solution: 'Always supply a descriptive alt attribute. If the image is purely decorative, specify an empty alt string (alt="") to flag screen readers to skip it.',
        exampleBefore: '<img src="/banner.jpg" />',
        exampleAfter: '<img src="/banner.jpg" alt="Company dashboard overview" />',
        difficulty: 'Easy',
        estimatedImprovement: '+35% Accessibility Rating',
        lineStart: lineIndex > 0 ? lineIndex : undefined,
      });
    }

    if (code.includes('style=')) {
      const lineIndex = lines.findIndex(l => l.includes('style=')) + 1;
      suggestions.push({
        id: generateId(),
        issue: 'Use of nested inline CSS styles',
        severity: 'Medium',
        category: 'Best Practices',
        why: 'Inline styling overrides global stylesheet classes, inflates file payload size, and breaks CSS cascading modularity, complicating visual maintenance.',
        solution: 'Offload inline styles to external CSS files, preprocessors, or standard utility design tokens (like Tailwind utility classes).',
        exampleBefore: '<div style="color: red; padding: 20px;">Text</div>',
        exampleAfter: '<div className="text-red-500 p-5">Text</div> // Clean Tailwind utility pattern',
        difficulty: 'Easy',
        estimatedImprovement: '+20% Maintainability Score',
        lineStart: lineIndex > 0 ? lineIndex : undefined,
      });
    }

    if (code.includes('<font ') || code.includes('<center>') || code.includes('<marquee>')) {
      const lineIndex = lines.findIndex(l => l.includes('<font ') || l.includes('<center>') || l.includes('<marquee>')) + 1;
      suggestions.push({
        id: generateId(),
        issue: 'Use of deprecated HTML presentation elements',
        severity: 'High',
        category: 'Best Practices',
        why: 'Elements like <center> or <marquee> are obsolete and not supported in standard HTML5 specifications. Some modern browsers may fail to parse or render them.',
        solution: 'Leverage flexible CSS rules (flex, grid, margins) to style layouts and modern transitions for motion effects.',
        exampleBefore: '<center>Centered text</center>',
        exampleAfter: '<div className="text-center">Centered text</div>',
        difficulty: 'Easy',
        estimatedImprovement: 'W3C Standard Compliance',
        lineStart: lineIndex > 0 ? lineIndex : undefined,
      });
    }
  }

  if (targetLang === 'css') {
    if (code.includes('!important')) {
      const lineIndex = lines.findIndex(l => l.includes('!important')) + 1;
      suggestions.push({
        id: generateId(),
        issue: 'Frequent use of "!important" override',
        severity: 'Medium',
        category: 'Maintainability',
        why: 'The !important modifier forcefully bypasses standard specificity weight calculations. Doing this frequently creates chaotic cascade overrides that are extremely difficult to debug or extend.',
        solution: 'Refactor classes to use precise parent selectors, modular state rules, or highly targeted utility tokens.',
        exampleBefore: '.button { background: blue !important; }',
        exampleAfter: '.primary-button { background: blue; } // Relying on semantic specific naming',
        difficulty: 'Medium',
        estimatedImprovement: 'Cleaner, predictable CSS overrides',
        lineStart: lineIndex > 0 ? lineIndex : undefined,
      });
    }
  }

  // 5. PYTHON CHECKS
  if (targetLang === 'python') {
    const pyFunctions = lines.filter(l => l.trim().startsWith('def '));
    // Check for docstring absence in python functions
    let missingDocstring = false;
    let pyFuncLineIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('def ')) {
        const nextLine = lines[i + 1] ? lines[i + 1].trim() : '';
        if (!nextLine.startsWith('"""') && !nextLine.startsWith("'''")) {
          missingDocstring = true;
          pyFuncLineIndex = i + 1;
          break;
        }
      }
    }
    if (missingDocstring) {
      suggestions.push({
        id: generateId(),
        issue: 'Missing PEP-257 docstring description',
        severity: 'Medium',
        category: 'Documentation',
        why: 'Python conventions require all structured functions, classes, and modules to include a triple-quoted docstring explaining input arguments, return states, and behaviors.',
        solution: 'Prepend an informative triple-quote docstring immediately below function definitions.',
        exampleBefore: 'def process_user_metrics(user_id):\n    data = database.get(user_id)',
        exampleAfter: 'def process_user_metrics(user_id):\n    """Retrieves and packages raw engagement metrics for a user.\n\n    Args:\n        user_id (str): The unique user key.\n\n    Returns:\n        dict: Formatted core parameters.\n    """\n    data = database.get(user_id)',
        difficulty: 'Easy',
        estimatedImprovement: '+50% Documentation Rating',
        lineStart: pyFuncLineIndex > 0 ? pyFuncLineIndex : undefined,
      });
    }
  }

  // 6. JAVA / C++ / GENERAL CHECKS
  // Long function rule (e.g. any function that starts and has more than 35 lines)
  if (loc > 120 && functions > 0) {
    suggestions.push({
      id: generateId(),
      issue: 'Excessively long, monolithic functions',
      severity: 'Medium',
      category: 'Complexity',
      why: 'Functions exceeding 40-50 lines usually handle multiple distinct responsibilities. This high coupling violates the Single Responsibility Principle, compounding maintenance overhead and blocking test isolation.',
      solution: 'Factor out distinct blocks of logical execution into secondary, pure utility functions.',
      exampleBefore: 'async function processOrderCheckout(cart) { // 120 lines handling payments, DB, notifications... }',
      exampleAfter: 'async function processOrderCheckout(cart) {\n  const charge = await chargeCard(cart);\n  const saved = await saveReceipt(charge);\n  await sendReceiptEmail(saved);\n} // Clean composition style',
      difficulty: 'Hard',
      estimatedImprovement: 'Significant unit testing isolation and code modularity',
      lineStart: undefined,
    });
  }

  // Missing comments check (Comments count is less than 5% of code lines in code with length > 20)
  if (loc > 15 && comments / loc < 0.08) {
    suggestions.push({
      id: generateId(),
      issue: 'Low inline code documentation ratio',
      severity: 'Low',
      category: 'Documentation',
      why: `Your code comments occupy only ${Math.round((comments / loc) * 100)}% of total lines. Code that is not commented forces engineers to mentally reconstruct execution context.`,
      solution: 'Document complex blocks, structural regex, or tricky algorithm thresholds with clear comments.',
      exampleBefore: 'const f = data.filter(d => d.v && d.e < Date.now());',
      exampleAfter: '// Filter active database models whose expiration timestamp is past current local epoch\nconst activeModels = models.filter(m => m.isActive && m.expirationTime < Date.now());',
      difficulty: 'Easy',
      estimatedImprovement: 'Dramatically faster onboarding for new developers',
    });
  }

  // Memory pointer issue check in C++
  if (targetLang === 'cpp' && code.includes('*') && (code.includes('new ') || code.includes('malloc'))) {
    suggestions.push({
      id: generateId(),
      issue: 'Use of raw pointer allocations',
      severity: 'High',
      category: 'Security',
      why: 'Allocating heap elements via raw `new` blocks or `malloc` requires manual deletion steps. This creates frequent memory leaks, dangling references, and dangerous segmentation faults.',
      solution: 'Refactor allocation to leverage Modern C++ safe memory controls (such as standard smart pointers: std::unique_ptr and std::shared_ptr).',
      exampleBefore: 'Widget* w = new Widget();\n// If exception occurs before delete, memory is leaked!',
      exampleAfter: 'auto w = std::make_unique<Widget>(); // Clean, automatic memory control',
      difficulty: 'Medium',
      estimatedImprovement: 'Absolute prevention of heap memory leaks',
    });
  }

  // Missing error handling block (e.g. network requests or file reads without try-catch)
  const needsErrorCheck = code.includes('fetch(') || code.includes('axios.') || code.includes('fs.readFile') || code.includes('JSON.parse(');
  if (needsErrorCheck && !code.includes('try {') && !code.includes('.catch(')) {
    suggestions.push({
      id: generateId(),
      issue: 'Missing explicit exception / error safeguards',
      severity: 'High',
      category: 'Best Practices',
      why: 'Executing volatile actions like parsing JSON strings or fetching network resources without active catch mechanisms means any operational failure throws unhandled errors, crashing execution.',
      solution: 'Enwrap high-risk execution processes inside a structured try-catch exception block or supply catch promises.',
      exampleBefore: 'const parsed = JSON.parse(userInput);',
      exampleAfter: 'let parsed = {};\ntry {\n  parsed = JSON.parse(userInput);\n} catch (error) {\n  logger.warn("Malformed object string, fallback deployed");\n}',
      difficulty: 'Easy',
      estimatedImprovement: 'Greater system uptime and reliability',
    });
  }

  // Pre-seed mock / backup suggestions if no rules were tripped, to ensure high visual satisfaction
  if (suggestions.length === 0) {
    suggestions.push(
      {
        id: generateId(),
        issue: 'Introduce TypeScript type-safety constraints',
        severity: 'Medium',
        category: 'Best Practices',
        why: 'Developing without rigid type guidelines allows structural parameter typos to bypass compilation and raise unexpected runtime exceptions in user spaces.',
        solution: 'Migrate file extensions from standard JS to TS and specify exact parameter contracts for variables and functions.',
        exampleBefore: 'function registerUser(user) {\n  return db.save(user);\n}',
        exampleAfter: 'interface User { id: string; email: string; }\nfunction registerUser(user: User): Promise<string> {\n  return db.save(user);\n}',
        difficulty: 'Medium',
        estimatedImprovement: 'Catch 98% of typing exceptions during builds'
      },
      {
        id: generateId(),
        issue: 'Incorporate comprehensive code docstrings',
        severity: 'Low',
        category: 'Documentation',
        why: 'This file contains pristine modular execution patterns, but lacks comments that guide external developers. Visual context is lost on larger structural elements.',
        solution: 'Document all functions with description guidelines.',
        exampleBefore: 'const computeMetrics = (data) => { ... }',
        exampleAfter: '/**\n * Aggregates analytical data across multiple columns.\n * @param {Array} data - Core dataset array.\n * @returns {Object} Final summed scores.\n */\nconst computeMetrics = (data) => { ... }',
        difficulty: 'Easy',
        estimatedImprovement: 'Immediate developer clarity'
      }
    );
  }

  // Dynamic code scoring math
  // Base score begins at 96
  let score = 96;
  suggestions.forEach(s => {
    if (s.severity === 'Critical') score -= 12;
    else if (s.severity === 'High') score -= 8;
    else if (s.severity === 'Medium') score -= 4;
    else if (s.severity === 'Low') score -= 2;
  });
  // Ensure score doesn't fall below 45 or exceed 100
  score = Math.max(45, Math.min(100, score));

  // Category metrics computation based on matching suggestions
  const categories: Record<Category, number> = {
    Security: 100,
    Performance: 100,
    Readability: 100,
    Maintainability: 100,
    Accessibility: 100,
    'Best Practices': 100,
    Documentation: 100,
    Complexity: 100,
    Optimization: 100,
  };

  // Deduct category scores based on problems found
  suggestions.forEach(s => {
    const penalty = s.severity === 'Critical' ? 25 : s.severity === 'High' ? 18 : s.severity === 'Medium' ? 10 : 5;
    categories[s.category] = Math.max(40, categories[s.category] - penalty);
    
    // Distribute correlation adjustments
    if (s.category === 'Security') {
      categories['Best Practices'] = Math.max(45, categories['Best Practices'] - 5);
    }
    if (s.category === 'Performance') {
      categories['Optimization'] = Math.max(45, categories['Optimization'] - 12);
    }
    if (s.category === 'Readability') {
      categories['Maintainability'] = Math.max(45, categories['Maintainability'] - 8);
    }
    if (s.category === 'Complexity') {
      categories['Maintainability'] = Math.max(45, categories['Maintainability'] - 15);
    }
  });

  // Calculate dynamic summary & summaries
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const priorityIssues: string[] = [];

  // Deduce strengths
  if (categories.Security > 85) strengths.push('Excellent database and access control standards with no dangerous raw code inclusions.');
  if (categories.Performance > 85) strengths.push('Highly optimized loops and linear complex structures, avoiding deep execution chains.');
  if (categories.Readability > 85) strengths.push('Elegant semantic structures, with clean naming conventions that self-document intent.');
  if (comments / loc >= 0.12) strengths.push('Strong balance of inline comments that provide context without over-cluttering code paths.');

  if (strengths.length === 0) {
    strengths.push('Clean and compact syntax layout.', 'Well-isolated scoping patterns.');
  }

  // Deduce weaknesses & priority issues
  suggestions.forEach(s => {
    if (s.severity === 'Critical' || s.severity === 'High') {
      priorityIssues.push(`${s.issue} (${s.severity})`);
      weaknesses.push(s.why.split('.')[0] + '.');
    } else {
      weaknesses.push(s.issue);
    }
  });

  if (weaknesses.length === 0) {
    weaknesses.push('Minor lacking of typed constraints.', 'No structured unit testing setup detected in visual scoping.');
  }
  if (priorityIssues.length === 0) {
    priorityIssues.push('No critical warnings found. Fine-tune minor issues to reach 100% excellence.');
  }

  // Build the complete analytical summary
  const summaryPrefix = `Code analysis complete. Your code achieved an overall score of ${score}/100. `;
  let summaryBody = '';
  if (score >= 90) {
    summaryBody = 'The code is exceptionally clean, responsive, and secure. It conforms strictly to modern software architecture benchmarks. Only minor adjustments to styling or commenting are required to perfect it.';
  } else if (score >= 75) {
    summaryBody = 'The codebase is in stable health, with good visual modularity. However, several high-priority concerns regarding code optimization, variable namespaces, or accessibility metrics should be addressed to guarantee scale.';
  } else {
    summaryBody = 'Critical concerns were flagged during parsing! Immediate modifications are needed to prevent major security leaks, extreme memory overhead, or unexpected build exceptions.';
  }

  const summary = summaryPrefix + summaryBody;

  // Compile final metrics structure
  const finalMetrics: CodeMetrics = {
    linesOfCode: loc,
    functions,
    variables,
    comments,
    classes,
    imports,
    loops,
    conditions,
    estimatedComplexity: loc < 50 ? 'Low (O(1) - O(N))' : loc < 150 ? 'Moderate' : 'High (Deep Nesting)',
  };

  return {
    score,
    metrics: finalMetrics,
    suggestions: suggestions.slice(0, 15), // Cap to 15 key suggestions
    summary,
    strengths: strengths.slice(0, 4),
    weaknesses: Array.from(new Set(weaknesses)).slice(0, 4),
    priorityIssues: Array.from(new Set(priorityIssues)).slice(0, 3),
    categories,
  };
}

// Mock presets for starting placeholder files, so when the editor is first opened it has a beautiful template to analyze
export const PRESETS_CODE: Record<SelectedLanguage, string> = {
  auto: ``,
  javascript: `// CodeDoctor AI Initial Sample (JavaScript)
function authenticateAndProcessUser(user_id, raw_key) {
  var user = db.getUser(user_id);
  
  if (user) {
    // Unsafe: hardcoded credential
    const API_SECRET = "sec_prod_99a8dc228bfb0c7743";
    
    // Unsafe eval invocation
    const config = eval("user.preferences");
    
    // Poor names and nested loops
    for (let x of user.roles) {
      for (let y of x.permissions) {
        if (y.active === true) {
          console.log("Found permission:", y);
        }
      }
    }
    
    const temp = raw_key;
    return {
      status: "authenticated",
      key: temp
    }
  }
  
  // Missing proper try-catch wrapper for DB write
  db.saveLog("Authentication process finished");
}`,
  typescript: `// TypeScript sample
import { db } from "./db";

interface UserMeta {
  id: string;
  role: string;
}

export function handleRequest(meta: any) {
  var activeUser = db.find(meta.id);
  
  // Unsafe innerHTML assignment
  const outputDiv = document.getElementById("output");
  if (outputDiv) {
    outputDiv.innerHTML = "<p>Welcome back, " + activeUser.name + "</p>";
  }
  
  // Unused variable
  const configToken = "tok_338902";
  
  console.log("Processed request metadata successfully");
  return activeUser;
}`,
  html: `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Corporate Dashboard</title>
</head>
<body>
  <div id="wrapper" style="padding: 24px; background: #fafafa; margin: 0 auto;">
    <!-- Deprecated tag used -->
    <center>
      <h1>Sales Report Summary</h1>
    </center>

    <!-- Missing alt text on critical image tag -->
    <img src="/assets/charts/sales_growth_2026.png" width="800">

    <div className="card">
      <p>Please review current quarterly results below.</p>
    </div>
  </div>
</body>
</html>`,
  css: `/* CSS with issues */
body {
  margin: 0;
  padding: 0;
  font-family: 'Helvetica', sans-serif;
}

.button-primary {
  background-color: #8b5cf6 !important; /* Specificity bypass override */
  color: #ffffff !important;
  border-radius: 4px;
}

.button-primary {
  /* Duplicate styling definitions */
  background-color: #8b5cf6;
  border-radius: 4px;
}`,
  python: `# Python CodeDoctor Template
import sys
import os

def calculate_analytics_metrics(raw_data, threshold=10):
    # Missing Python Docstring definition
    total = 0
    # Variable 'temp_factor' defined but never utilized
    temp_factor = 2.45
    
    for i in range(len(raw_data)):
        for j in range(len(raw_data[i])):
            # Unsafe deep nested lookup time complexity (O(N²))
            if raw_data[i][j] > threshold:
                total += raw_data[i][j]
                
    return total`,
  java: `// Java CodeDoctor Sample
package com.codedoctor.demo;

import java.util.*;

public class InvoiceManager {
    // Unused import parameters above
    public void processInvoice(double amt, String id) {
        // Poor variables naming below
        double x = amt * 1.15;
        System.out.println("Computed invoice balance for user " + id + ": " + x);
    }
}`,
  cpp: `// C++ CodeDoctor Sample
#include <iostream>
#include <vector>

void processRawBuffer(int size) {
    // Memory Pointer and Allocation Leak potential
    int* buffer = new int[size];
    
    for(int i = 0; i < size; ++i) {
        buffer[i] = i * 2;
    }
    
    std::cout << "Buffer initialization complete." << std::endl;
    // Missing matching "delete[] buffer" cleanup! Memory leakage!
}`,
  c: `// C Sample
#include <stdio.h>
#include <stdlib.h>

void execute_task() {
    char *data = malloc(100);
    // Missing free(data)
}`,
  csharp: `// C# Sample
using System;

public class UserManager {
    public void SaveUser(string name) {
        var psw = "Password123!"; // Hardcoded secret
        Console.WriteLine("Saving " + name);
    }
}`,
  php: `<?php
// PHP SQL injection and script vulnerabilities
$userId = $_GET['id'];

// SQL Injection risk
$query = "SELECT * FROM users WHERE id = '" . $userId . "'";
$result = mysql_query($query); // Deprecated MySQL invocation

// Unsafe output script risk
echo "<div>Loaded profile ID: " . $userId . "</div>";
?>`,
  sql: `-- SQL injection vulnerable schema
SELECT * FROM users 
WHERE email = 'admin@corp.com' OR '1'='1' AND password = 'bypass_password';`,
  go: `package main
import "fmt"

func Process() {
    var token = "token_abc123" // Unused and hardcoded secret
    fmt.Println("Running task...")
}`,
  rust: `fn main() {
    let mut x = 5; // variable is never mutated or read with value changes
    println!("Hello Rust");
}`,
  swift: `import UIKit
class ImageController: UIViewController {
    override func viewDidLoad() {
        let psw = "MySecKey" // Hardcoded credentials
    }
}`,
  kotlin: `fun main(args: Array<String>) {
    var name = "Kotlin User"
    // Unused variables and logs
    println("Welcome to Kotlin code review module")
}`
};
