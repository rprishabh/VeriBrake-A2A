import React from 'react';
import { Shield, Sparkles, Server, FileCode, RefreshCw, AlertOctagon, Scale } from 'lucide-react';

export default function Header({
  activeMode,
  setActiveMode,
  kpis,
  onOpenA2ACard,
  onRefreshData,
  isRefreshing
}) {
  const isOutbound = activeMode === 'OUTBOUND';

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-[1850px] mx-auto px-4 py-2.5 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/40 shrink-0">
            <Shield className="w-5 h-5 text-white" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ring-slate-950"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                VeriBrake <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">A2A</span>
              </h1>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 font-semibold tracking-wider">
                Unified Mesh v2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 tracking-tight">
              Enterprise AI Governance (MAS FEAT) &amp; Psychological Coercion Defense (Digital Arrest)
            </p>
          </div>
        </div>

        {/* Central Mode Switcher Pill */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl shadow-inner">
          <button
            type="button"
            onClick={() => setActiveMode('OUTBOUND')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isOutbound
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/40 ring-1 ring-emerald-400/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-emerald-300" />
            <span>Outbound: AI Governance</span>
            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-black/30 text-emerald-200">MAS FEAT</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('INBOUND')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              !isOutbound
                ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md shadow-rose-900/40 ring-1 ring-rose-400/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5 text-rose-300" />
            <span>Inbound: Digital Arrest &amp; Fraud</span>
            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-black/30 text-rose-200">Anti-Extortion</span>
          </button>
        </div>

        {/* Status Badges & Dynamic KPI Header */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
          
          {/* Clickable A2A Protocol Agent Card Badge */}
          <button
            onClick={onOpenA2ACard}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/60 text-xs text-emerald-300 transition-all cursor-pointer hover:shadow-md hover:shadow-emerald-900/30 font-mono"
            title="Inspect Agent2Agent Protocol Specification"
          >
            <FileCode className="w-3.5 h-3.5 text-emerald-400" />
            <span>/.well-known/agent.json</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1 rounded">A2A Dual-Mesh</span>
          </button>

          {/* DYNAMIC KPI COUNTERS */}
          <div className="flex items-center gap-4 text-xs font-mono bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl">
            {isOutbound ? (
              <>
                <div className="text-right">
                  <span className="block text-[10px] uppercase tracking-wider text-slate-400">Outbound AI Checks</span>
                  <span className="font-bold text-white text-sm">
                    {kpis?.outbound?.outbound_ai_checks ?? kpis?.total_intercepts ?? 0}
                  </span>
                </div>
                
                <div className="h-6 w-px bg-slate-800" />

                <div className="text-right">
                  <span className="block text-[10px] uppercase tracking-wider text-slate-400">MAS Violations Blocked</span>
                  <span className="font-bold text-rose-400 text-sm">
                    {kpis?.outbound?.mas_violations_blocked ?? kpis?.hallucinations_blocked ?? 0}
                  </span>
                </div>

                <div className="h-6 w-px bg-slate-800" />

                <div className="text-right">
                  <span className="block text-[10px] uppercase tracking-wider text-slate-400">Avg Latency</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {kpis?.outbound?.avg_latency_ms ?? kpis?.avg_latency_ms ?? 0}ms
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="text-right">
                  <span className="block text-[10px] uppercase tracking-wider text-slate-400">Active Transits Protected</span>
                  <span className="font-bold text-cyan-400 text-sm">
                    {kpis?.inbound?.active_transits_protected ?? 0}
                  </span>
                </div>
                
                <div className="h-6 w-px bg-slate-800" />

                <div className="text-right">
                  <span className="block text-[10px] uppercase tracking-wider text-slate-400">Coercion Interceptions</span>
                  <span className="font-bold text-amber-400 text-sm">
                    {kpis?.inbound?.coercion_interceptions ?? 0}
                  </span>
                </div>

                <div className="h-6 w-px bg-slate-800" />

                <div className="text-right">
                  <span className="block text-[10px] uppercase tracking-wider text-slate-400">Mule Freezes Triggered</span>
                  <span className="font-bold text-rose-400 text-sm">
                    {kpis?.inbound?.mule_freezes_triggered ?? 0}
                  </span>
                </div>
              </>
            )}
          </div>

          <button
            onClick={onRefreshData}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            title="Refresh KPIs and Audit Trail"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>

      </div>
    </header>
  );
}
