import React from 'react';
import { 
  Shield, 
  FileCode, 
  RefreshCw, 
  AlertOctagon, 
  Scale, 
  Activity, 
  Menu, 
  X, 
  Search,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react';

export default function Header({
  activeMode,
  setActiveMode,
  kpis,
  onOpenA2ACard,
  onRefreshData,
  isRefreshing,
  currentView = 'command_center',
  setCurrentView,
  isMobileNavOpen,
  setIsMobileNavOpen,
  searchQuery = '',
  setSearchQuery
}) {
  const isOutbound = activeMode === 'OUTBOUND';

  return (
    <header className="border-b border-navy-750 bg-navy-950/95 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-5 py-2.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Left Side: Brand, Mesh Badge, and Mobile Menu Toggle */}
        <div className="flex items-center justify-between md:justify-start gap-3">
          <div className="flex items-center gap-3">
            {/* Mobile Nav Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen?.(!isMobileNavOpen)}
              className="md:hidden p-1.5 rounded-lg bg-navy-850 border border-navy-750 text-slate-300 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {isMobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            {/* Brand Logo & Name */}
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-teal via-cyan-500 to-indigo-600 shadow-md shadow-teal-500/15 ring-1 ring-brand-teal/40 shrink-0">
                <Shield className="w-4 h-4 text-navy-950 stroke-[2.5]" />
                <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-teal ring-2 ring-navy-950"></span>
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1">
                    VeriBrake <span className="text-brand-teal font-mono">A2A</span>
                  </span>
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-teal-950/80 text-brand-teal border border-teal-800/80 font-bold tracking-wider">
                    Mesh v2.0
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live ADK
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 tracking-tight hidden sm:block">
                  Bidirectional Financial Safety Layer: Outbound AI Governance &amp; Inbound Coercion Defense
                </p>
              </div>
            </div>
          </div>

          {/* Quick A2A protocol card on mobile */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenA2ACard}
              className="p-1.5 rounded-lg bg-navy-850 border border-navy-750 text-brand-teal hover:bg-navy-800"
              title="A2A Protocol Spec"
            >
              <FileCode className="w-4 h-4" />
            </button>
            <button
              onClick={onRefreshData}
              disabled={isRefreshing}
              className="p-1.5 rounded-lg bg-navy-850 border border-navy-750 text-slate-300 hover:text-white"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-brand-teal' : ''}`} />
            </button>
          </div>
        </div>

        {/* Center: High-Contrast Direction Mode Switcher */}
        <div 
          className="flex items-center bg-navy-900 border border-navy-750 p-1 rounded-xl shadow-inner self-center w-full sm:w-auto"
          role="radiogroup"
          aria-label="Inspection Vector Direction"
        >
          <button
            type="button"
            role="radio"
            aria-checked={isOutbound}
            onClick={() => setActiveMode('OUTBOUND')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              isOutbound
                ? 'bg-navy-800 text-white shadow-md border border-brand-teal/40 text-brand-teal ring-1 ring-brand-teal/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-navy-850/60'
            }`}
          >
            <Scale className={`w-3.5 h-3.5 shrink-0 ${isOutbound ? 'text-brand-teal' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Outbound: AI Governance</span>
            <span className="sm:hidden">Outbound</span>
            <span className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold uppercase shrink-0 ${
              isOutbound ? 'bg-teal-950 text-brand-teal border border-teal-800' : 'bg-navy-950 text-slate-400'
            }`}>
              <span className="hidden sm:inline">MAS FEAT</span>
              <span className="sm:hidden">FEAT</span>
            </span>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={!isOutbound}
            onClick={() => setActiveMode('INBOUND')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              !isOutbound
                ? 'bg-navy-800 text-white shadow-md border border-brand-coral/40 text-rose-300 ring-1 ring-brand-coral/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-navy-850/60'
            }`}
          >
            <AlertOctagon className={`w-3.5 h-3.5 shrink-0 ${!isOutbound ? 'text-rose-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Inbound: Digital Arrest &amp; Fraud</span>
            <span className="sm:hidden">Inbound</span>
            <span className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold uppercase shrink-0 ${
              !isOutbound ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-navy-950 text-slate-400'
            }`}>
              <span className="hidden sm:inline">Anti-Extortion</span>
              <span className="sm:hidden">Defense</span>
            </span>
          </button>
        </div>

        {/* Right Side: Dynamic KPI Counters & Action Badges */}
        <div className="hidden md:flex items-center gap-2.5">
          
          {/* Global Search Filter */}
          {setSearchQuery && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search telemetry..."
                className="w-32 lg:w-44 bg-navy-900 border border-navy-750 rounded-lg pl-8 pr-2.5 py-1 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-teal font-mono"
              />
            </div>
          )}

          {/* Clickable A2A Protocol Agent Card Button */}
          <button
            onClick={onOpenA2ACard}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-850 border border-navy-750 hover:border-brand-teal/40 text-xs text-slate-200 transition-all cursor-pointer font-mono shadow-sm"
            title="Inspect Agent2Agent Protocol Specification at /.well-known/agent.json"
          >
            <FileCode className="w-3.5 h-3.5 text-brand-teal" />
            <span className="text-[11px]">agent.json</span>
            <span className="text-[9px] bg-teal-950 text-brand-teal px-1 rounded border border-teal-800">
              v0.4.0
            </span>
          </button>

          {/* Real Live KPI Counters Bar */}
          <div className="flex items-center gap-3 text-xs font-mono bg-navy-900 border border-navy-750 px-3 py-1.5 rounded-xl shadow-inner">
            {isOutbound ? (
              <>
                <div className="text-right">
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400">Outbound Checks</span>
                  <span className="font-bold text-white text-xs">
                    {kpis?.outbound?.outbound_ai_checks ?? kpis?.total_intercepts ?? 0}
                  </span>
                </div>
                
                <div className="h-5 w-px bg-navy-750" />

                <div className="text-right">
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400">Violations Blocked</span>
                  <span className="font-bold text-rose-400 text-xs">
                    {kpis?.outbound?.mas_violations_blocked ?? kpis?.hallucinations_blocked ?? 0}
                  </span>
                </div>

                <div className="h-5 w-px bg-navy-750" />

                <div className="text-right">
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400">Avg Latency</span>
                  <span className="font-bold text-brand-teal text-xs">
                    {kpis?.outbound?.avg_latency_ms ?? kpis?.avg_latency_ms ?? 0}ms
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="text-right">
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400">Transits Protected</span>
                  <span className="font-bold text-cyan-400 text-xs">
                    {kpis?.inbound?.active_transits_protected ?? 0}
                  </span>
                </div>
                
                <div className="h-5 w-px bg-navy-750" />

                <div className="text-right">
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400">Coercion Alerts</span>
                  <span className="font-bold text-amber-400 text-xs">
                    {kpis?.inbound?.coercion_interceptions ?? 0}
                  </span>
                </div>

                <div className="h-5 w-px bg-navy-750" />

                <div className="text-right">
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400">Mule Freezes</span>
                  <span className="font-bold text-rose-400 text-xs">
                    {kpis?.inbound?.mule_freezes_triggered ?? 0}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefreshData}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg bg-navy-900 border border-navy-750 text-slate-400 hover:text-white hover:border-navy-700 transition-colors cursor-pointer"
            title="Refresh KPIs and Audit Trail"
            aria-label="Refresh telemetry data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-brand-teal' : ''}`} />
          </button>
        </div>

      </div>
    </header>
  );
}

