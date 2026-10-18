import React, { useState } from 'react';
import { 
  Settings, 
  Shield, 
  RotateCcw, 
  Check, 
  Sliders, 
  User, 
  Globe2, 
  AlertTriangle,
  Info
} from 'lucide-react';

export default function SettingsView({ onResetDemoData }) {
  const [operatorName, setOperatorName] = useState('Senior Compliance Officer - JAPAC Risk');
  const [defaultJurisdiction, setDefaultJurisdiction] = useState('ID -> SG');
  const [criticalThreshold, setCriticalThreshold] = useState(75);
  const [warningThreshold, setWarningThreshold] = useState(35);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-navy-900/85 border border-navy-750 panel-base shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-500/10 text-brand-teal border border-teal-500/30">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Operator &amp; Governance Preferences</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-brand-teal border border-teal-800 font-semibold">
                Control Deck
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Configure risk evaluation thresholds, supervisor identity, and regional compliance defaults
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Supervisor Profile Card */}
        <div className="p-4 rounded-2xl bg-navy-900/85 border border-navy-750 panel-base shadow-xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 border-b border-navy-750 pb-2">
            <User className="w-4 h-4 text-brand-teal" />
            <span>Authorized Supervisor Profile</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Officer Name &amp; Title
              </label>
              <input
                type="text"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                className="w-full bg-navy-950 border border-navy-750 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-teal font-sans"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Default Corridor Routing
              </label>
              <select
                value={defaultJurisdiction}
                onChange={(e) => setDefaultJurisdiction(e.target.value)}
                className="w-full bg-navy-950 border border-navy-750 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-teal font-mono"
              >
                <option value="ID -> SG">ID -&gt; SG (Indonesia GR 71 / Singapore MAS)</option>
                <option value="SG Domestic (MAS / PDPA)">SG Domestic (MAS FEAT &amp; Veritas)</option>
                <option value="MY -> IN Corridors">MY -&gt; IN (India DPDP Protocol)</option>
                <option value="AU -> SG (Data Airlock)">AU -&gt; SG (Australian PSPF)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Risk Threshold Sliders Card */}
        <div className="p-4 rounded-2xl bg-navy-900/85 border border-navy-750 panel-base shadow-xl space-y-3.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 border-b border-navy-750 pb-2">
            <Sliders className="w-4 h-4 text-brand-teal" />
            <span>Autonomous Risk &amp; Interception Thresholds</span>
          </span>

          <div className="space-y-4 text-xs">
            {/* Critical Threshold */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Critical Circuit Breaker Trip Threshold</span>
                  <span className="text-[11px] text-slate-400">Triggers automatic message block or payment quarantine</span>
                </div>
                <span className="font-mono text-sm font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-950 border border-rose-800">
                  {criticalThreshold}/100
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={criticalThreshold}
                onChange={(e) => setCriticalThreshold(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            {/* Warning Threshold */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Elevated Friction / Auto-Rewrite Threshold</span>
                  <span className="text-[11px] text-slate-400">Triggers vernacular fact-checked rewrite or cooling-off card</span>
                </div>
                <span className="font-mono text-sm font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-950 border border-amber-800">
                  {warningThreshold}/100
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="60"
                value={warningThreshold}
                onChange={(e) => setWarningThreshold(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2 text-xs">
            {savedSuccess && (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5 animate-fade-in">
                <Check className="w-4 h-4" />
                <span>Preferences updated locally</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="submit"
              className="py-2 px-5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-md shadow-teal-950/30"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
