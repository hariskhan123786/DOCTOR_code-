/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Settings, SelectedLanguage } from '../types';
import { 
  Sliders, 
  Sparkles, 
  Layout, 
  Activity, 
  Check, 
  Palette, 
  Sun, 
  Moon,
  Info
} from 'lucide-react';

interface SettingsPanelProps {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

export default function SettingsPanel({ settings, setSettings }: SettingsPanelProps) {
  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const accentColors: { value: Settings['accentColor']; name: string; bg: string; text: string }[] = [
    { value: 'purple', name: 'Cosmic Purple', bg: 'bg-purple-600', text: 'text-purple-400' },
    { value: 'blue', name: 'Linear Blue', bg: 'bg-blue-600', text: 'text-blue-400' },
    { value: 'emerald', name: 'Mint Emerald', bg: 'bg-emerald-600', text: 'text-emerald-400' },
    { value: 'rose', name: 'Crimson Rose', bg: 'bg-rose-600', text: 'text-rose-400' },
  ];

  const borderRadii: { value: Settings['cardRadius']; name: string; rounded: string }[] = [
    { value: 'none', name: 'Strict (Sharp)', rounded: 'rounded-none' },
    { value: 'sm', name: 'Compact (Small)', rounded: 'rounded-sm' },
    { value: 'md', name: 'SaaS (Medium)', rounded: 'rounded-md' },
    { value: 'lg', name: 'Modern (Large)', rounded: 'rounded-lg' },
    { value: 'xl', name: 'Fluid (2XL)', rounded: 'rounded-xl' },
  ];

  const animationSpeeds: { value: Settings['animationSpeed']; name: string; desc: string }[] = [
    { value: 'slow', name: 'Cinematic', desc: 'Detailed, sweeping layouts' },
    { value: 'normal', name: 'Balanced', desc: 'Standard visual rhythm' },
    { value: 'fast', name: 'Instant', desc: 'No-delay workspace clicks' },
  ];

  const accentColorClass = 
    settings.accentColor === 'purple' ? 'border-purple-500 text-purple-400 bg-purple-500/5' :
    settings.accentColor === 'blue' ? 'border-blue-500 text-blue-400 bg-blue-500/5' :
    settings.accentColor === 'emerald' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' :
    'border-rose-500 text-rose-400 bg-rose-500/5';

  const accentTextClass = 
    settings.accentColor === 'purple' ? 'text-purple-400' :
    settings.accentColor === 'blue' ? 'text-blue-400' :
    settings.accentColor === 'emerald' ? 'text-emerald-400' :
    'text-rose-400';

  const accentBgButtonClass = 
    settings.accentColor === 'purple' ? 'bg-purple-600 hover:bg-purple-500' :
    settings.accentColor === 'blue' ? 'bg-blue-600 hover:bg-blue-500' :
    settings.accentColor === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-500' :
    'bg-rose-600 hover:bg-rose-500';

  const cardRadiusClass = 
    settings.cardRadius === 'none' ? 'rounded-none' :
    settings.cardRadius === 'sm' ? 'rounded-sm' :
    settings.cardRadius === 'md' ? 'rounded-md' :
    settings.cardRadius === 'lg' ? 'rounded-lg' : 'rounded-2xl';

  return (
    <div id="settings-panel-container" className="space-y-6 font-sans">
      {/* Settings Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold tracking-tight">System Customization</h2>
            <p className="text-xs text-slate-400">Configure visual themes, rendering variables, and micro-animations</p>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Color Palette & Base Theme */}
        <div className={`p-5 glassmorphism ${cardRadiusClass} space-y-4`}>
          <div className="flex items-center gap-2 text-slate-300 font-display font-semibold text-sm">
            <Palette className="w-4 h-4 text-purple-400" />
            Theme & Palette Color
          </div>
          <p className="text-xs text-slate-400">Select base darkness profiles and brand color tones</p>

          {/* Theme Switcher */}
          <div className="space-y-2 pt-2">
            <label className="text-xs text-slate-400 font-medium">Dark / Light Mode Toggle</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                id="setting-theme-dark"
                onClick={() => updateSetting('theme', 'dark')}
                className={`flex items-center justify-center gap-2 p-3 text-xs font-semibold border ${cardRadiusClass} transition-all
                  ${settings.theme === 'dark' ? accentColorClass : 'border-slate-800 text-slate-400 bg-slate-900/40 hover:bg-slate-800/50'}`}
              >
                <Moon className="w-4 h-4" />
                Dark (Modern Slate)
              </button>
              <button
                id="setting-theme-light"
                onClick={() => updateSetting('theme', 'light')}
                className={`flex items-center justify-center gap-2 p-3 text-xs font-semibold border ${cardRadiusClass} transition-all
                  ${settings.theme === 'light' ? 'border-purple-600 text-purple-600 bg-purple-50/50' : 'border-slate-800 text-slate-400 bg-slate-900/40 hover:bg-slate-800/50'}`}
              >
                <Sun className="w-4 h-4" />
                Light (Clean Paper)
              </button>
            </div>
          </div>

          {/* Brand Accent */}
          <div className="space-y-2 pt-2">
            <label className="text-xs text-slate-400 font-medium font-mono">Brand Accent Hue</label>
            <div className="grid grid-cols-2 gap-2">
              {accentColors.map((color) => (
                <button
                  id={`setting-accent-${color.value}`}
                  key={color.value}
                  onClick={() => updateSetting('accentColor', color.value)}
                  className={`flex items-center justify-between p-2.5 text-xs font-medium border ${cardRadiusClass} transition-all
                    ${settings.accentColor === color.value ? accentColorClass : 'border-slate-800 text-slate-400 hover:bg-slate-800/30'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-3.5 h-3.5 rounded-full ${color.bg}`} />
                    {color.name}
                  </div>
                  {settings.accentColor === color.value && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Layout Settings */}
        <div className={`p-5 glassmorphism ${cardRadiusClass} space-y-4`}>
          <div className="flex items-center gap-2 text-slate-300 font-display font-semibold text-sm">
            <Layout className="w-4 h-4 text-blue-400" />
            Border & Card Radius
          </div>
          <p className="text-xs text-slate-400">Control structural curvature of card elements across interfaces</p>

          <div className="grid grid-cols-1 gap-2 pt-2">
            {borderRadii.map((radius) => (
              <button
                id={`setting-radius-${radius.value}`}
                key={radius.value}
                onClick={() => updateSetting('cardRadius', radius.value)}
                className={`flex items-center justify-between p-3 text-xs font-medium border ${cardRadiusClass} transition-all
                  ${settings.cardRadius === radius.value ? accentColorClass : 'border-slate-800 text-slate-400 hover:bg-slate-800/30'}`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-4 border border-slate-600 bg-slate-900/60 ${radius.rounded}`} />
                  {radius.name}
                </div>
                {settings.cardRadius === radius.value && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>

        {/* Animation Speeds */}
        <div className={`p-5 glassmorphism ${cardRadiusClass} space-y-4 lg:col-span-2`}>
          <div className="flex items-center gap-2 text-slate-300 font-display font-semibold text-sm">
            <Activity className="w-4 h-4 text-emerald-400" />
            Transitions & Rendering Pace
          </div>
          <p className="text-xs text-slate-400">Configure processing lags and CSS entry transition velocities</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {animationSpeeds.map((speed) => (
              <button
                id={`setting-speed-${speed.value}`}
                key={speed.value}
                onClick={() => updateSetting('animationSpeed', speed.value)}
                className={`flex flex-col text-left p-3.5 border ${cardRadiusClass} transition-all
                  ${settings.animationSpeed === speed.value ? accentColorClass : 'border-slate-800 text-slate-400 hover:bg-slate-800/30'}`}
              >
                <span className="text-xs font-semibold flex items-center gap-1.5">
                  {speed.name}
                  {settings.animationSpeed === speed.value && <Check className="w-3.5 h-3.5" />}
                </span>
                <span className="text-[10px] text-slate-500 mt-1">{speed.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Offline Disclaimer Info */}
        <div className={`p-4 bg-slate-950/60 border border-slate-800/80 ${cardRadiusClass} lg:col-span-2 flex gap-3`}>
          <div className={`p-1.5 h-fit rounded-md ${accentColorClass}`}>
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-300">Local Sandbox Architecture</h4>
            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
              CodeDoctor AI operates entirely sandboxed within local browser processes. By running lexical parse checkers in pure client-side JavaScript, your workspace remains fully offline, private, and fast, processing files instantly without transmitting your code to third-party endpoints.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
