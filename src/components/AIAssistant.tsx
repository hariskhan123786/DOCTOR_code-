/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Terminal,
  Cpu,
  Bookmark
} from 'lucide-react';
import { Settings } from '../types';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

interface AIAssistantProps {
  settings: Settings;
  currentScore?: number;
  criticalCount: number;
}

export default function AIAssistant({ settings, currentScore, criticalCount }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "Hello! I am CodeDoctor's integrated AI agent. I can explain code diagnostics, security compliance, or provide custom optimization advice. Ask me anything!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = {
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking speed
    const speedMultiplier = settings.animationSpeed === 'fast' ? 0.5 : settings.animationSpeed === 'slow' ? 1.5 : 1;
    setTimeout(() => {
      let responseText = "";
      const lower = text.toLowerCase();

      if (lower.includes('score') || lower.includes('low') || lower.includes('increase')) {
        responseText = `To boost your score from ${currentScore || 92}/100, prioritize resolving the ${criticalCount} Critical violations. Transitioning away from 'eval()', sanitizing inputs from HTML wrappers, and eliminating nested loop constructs will instantly yield a score exceeding 95+.`;
      } else if (lower.includes('eval') || lower.includes('security')) {
        responseText = "The 'eval()' function executes code with string level compiler permissions. This allows malicious payload scripts to hijack client session variables. Always leverage direct object key index indexing (e.g. `window[key]`) or parse structural data natively using standard `JSON.parse()`.";
      } else if (lower.includes('performance') || lower.includes('loop') || lower.includes('slow')) {
        responseText = "To optimize your execution runtime, resolve nested loop structures. If you are checking cross-references, index elements into a Javascript `Map` or `Set` first. This converts quadratic operations O(N²) into linear O(N) operations, which execute virtually instantly.";
      } else if (lower.includes('sql') || lower.includes('injection')) {
        responseText = "SQL injection takes place when raw inputs are appended into query command strings. If an input contains quotes or boolean overrides, query blocks are modified. Safeguard this by using Parameterized Queries or standard ORM libraries (like Prisma or Drizzle) to sanitize structural parameters.";
      } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('who are you')) {
        responseText = "I'm the CodeDoctor AI assistant. I operate offline right here in your browser, analyzing abstract syntax paths and security rules to secure and optimize your files. How can I guide your engineering tasks today?";
      } else if (lower.includes('alt') || lower.includes('accessibility')) {
        responseText = "Accessibility guarantees your product remains navigable to everyone, including users relying on screen readers. Adding 'alt' tags to images and clear descriptive 'labels' to input forms is required for WCAG AAA accessibility rating.";
      } else {
        responseText = "That is a very good question! I suggest refactoring this class to optimize modularity. Always separate side-effect operations from core business state computation. Also ensure strict parameter typing and try-catch wrappers to enforce enterprise robustness.";
      }

      const aiMsg: Message = {
        sender: 'assistant',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200 * speedMultiplier);
  };

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

  const accentBgClass =
    settings.accentColor === 'purple' ? 'bg-purple-600' :
    settings.accentColor === 'blue' ? 'bg-blue-600' :
    settings.accentColor === 'emerald' ? 'bg-emerald-600' :
    'bg-rose-600';

  const textAccentClass =
    settings.accentColor === 'purple' ? 'text-purple-400' :
    settings.accentColor === 'blue' ? 'text-blue-400' :
    settings.accentColor === 'emerald' ? 'text-emerald-400' :
    'text-rose-400';

  return (
    <div id="ai-assistant-container" className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Button */}
      {!isOpen && (
        <button
          id="btn-open-ai-assistant"
          onClick={() => setIsOpen(true)}
          className={`relative group p-4 bg-gradient-to-tr ${accentColorClass} text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center border border-white/10`}
          title="Open CodeDoctor AI Assistant"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900/90 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/5 backdrop-blur-md">
            Ask CodeDoctor AI
          </span>
          {criticalCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-slate-950 animate-bounce">
              {criticalCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          id="ai-chat-window"
          className={`w-[360px] md:w-[400px] h-[520px] ${roundedClass} flex flex-col shadow-2xl overflow-hidden border border-white/10 transition-all duration-300 transform scale-100 origin-bottom-right
            ${settings.theme === 'dark' ? 'bg-slate-900/95 text-slate-100' : 'bg-white text-slate-800'}`}
        >
          {/* Header */}
          <div className={`p-4 bg-gradient-to-r ${settings.theme === 'dark' ? 'from-slate-950 to-slate-900 border-b border-white/5' : 'from-slate-100 to-slate-50 border-b border-slate-200'} flex items-center justify-between`}>
            <div className="flex items-center gap-2.5">
              <div className={`p-1.5 rounded-lg ${settings.theme === 'dark' ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm flex items-center gap-1.5">
                  CodeDoctor Agent
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Expert Mode Enabled</p>
              </div>
            </div>
            <button
              id="btn-close-ai-assistant"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md hover:bg-slate-800/10 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className={`flex-1 p-4 overflow-y-auto space-y-4 ${settings.theme === 'dark' ? 'bg-slate-950/20' : 'bg-slate-50/50'}`}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                <div
                  className={`p-3 text-xs leading-relaxed ${roundedClass} ${
                    msg.sender === 'user'
                      ? settings.theme === 'dark' ? 'bg-purple-600 text-white' : 'bg-purple-600 text-white'
                      : settings.theme === 'dark' ? 'bg-slate-800/80 text-slate-200 border border-white/5' : 'bg-white text-slate-800 border border-slate-200/80'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1 font-mono">{msg.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex flex-col items-start mr-auto max-w-[85%]">
                <div className={`p-3 text-xs ${roundedClass} ${settings.theme === 'dark' ? 'bg-slate-800/80 border border-white/5' : 'bg-white border border-slate-200/80'} flex items-center gap-1`}>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className={`p-2 px-3 border-t ${settings.theme === 'dark' ? 'bg-slate-950/40 border-white/5' : 'bg-slate-50 border-slate-200'} flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none`}>
            <button
              onClick={() => handleSendMessage("How can I increase my score?")}
              className={`text-[10px] px-2.5 py-1 ${roundedClass} ${settings.theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-200/60 hover:bg-slate-200 text-slate-700'} border border-transparent hover:border-purple-500/20 transition-all font-medium`}
            >
              Increase Score
            </button>
            <button
              onClick={() => handleSendMessage("Why is eval() bad?")}
              className={`text-[10px] px-2.5 py-1 ${roundedClass} ${settings.theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-200/60 hover:bg-slate-200 text-slate-700'} border border-transparent hover:border-purple-500/20 transition-all font-medium`}
            >
              Explain eval()
            </button>
            <button
              onClick={() => handleSendMessage("How to prevent SQL Injection?")}
              className={`text-[10px] px-2.5 py-1 ${roundedClass} ${settings.theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-200/60 hover:bg-slate-200 text-slate-700'} border border-transparent hover:border-purple-500/20 transition-all font-medium`}
            >
              SQL Injection
            </button>
          </div>

          {/* Chat Form */}
          <form
            id="ai-assistant-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className={`p-3 border-t ${settings.theme === 'dark' ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-200'} flex gap-2`}
          >
            <input
              id="ai-assistant-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask CodeDoctor..."
              className={`flex-1 text-xs px-3 py-2 bg-transparent border focus:outline-none focus:ring-1 ${roundedClass} ${
                settings.theme === 'dark'
                  ? 'border-white/10 text-white focus:ring-purple-500/50 bg-slate-950/40'
                  : 'border-slate-300 text-slate-800 focus:ring-purple-500/50 bg-slate-50'
              }`}
            />
            <button
              id="btn-ai-assistant-submit"
              type="submit"
              disabled={!inputValue.trim()}
              className={`p-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
