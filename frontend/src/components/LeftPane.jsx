import React from 'react';
import { 
  Play, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  Zap, 
  Globe2, 
  MessageSquare, 
  Building2, 
  ShieldAlert, 
  UserX, 
  CreditCard, 
  PhoneCall, 
  RotateCcw,
  Info
} from 'lucide-react';

export default function LeftPane({
  activeMode,
  setActiveMode,
  scenarios,
  selectedScenarioId,
  onSelectScenario,
  formData,
  setFormData,
  onRunInterceptor,
  isLoading
}) {
  const isOutbound = activeMode === 'OUTBOUND';

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRunInterceptor();
    }
  };

  const handleResetCurrentScenario = () => {
    const current = scenarios.find(s => s.id === selectedScenarioId);
    if (current) {
      setFormData({
        jurisdiction_route: current.jurisdiction_route,
        target_dialect: current.target_dialect,
        customer_context: current.customer_context,
        draft_message: current.draft_message,
        payload_text: current.payload_text || current.draft_message,
        payment_channel: current.mode === 'INBOUND' ? 'Instant Wire / UPI Transfer' : 'Commercial Facility'
      });
    }
  };

  const currentScenario = scenarios.find(s => s.id === selectedScenarioId);
  const currentChars = (formData.payload_text ?? formData.draft_message ?? "").length;

  return (
    <div className="flex flex-col h-full bg-navy-900/85 border border-navy-750 rounded-2xl overflow-hidden panel-base shadow-xl">
      {/* Pane Header with Direction Traffic Lane */}
      <div className="px-4 py-3 border-b border-navy-750 bg-navy-950/90 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg border ${
            isOutbound 
              ? 'bg-teal-500/10 text-brand-teal border-teal-500/30' 
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}>
            {isOutbound ? <Zap className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>{isOutbound ? "1. Outbound Inspection Lane" : "1. Inbound Coercion Lane"}</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              {isOutbound 
                ? "Autonomous bank AI message compliance & data residency" 
                : "Real-time payment remarks & extortion transcript defense"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border tracking-wider ${
            isOutbound 
              ? 'bg-teal-950 text-brand-teal border-teal-800' 
              : 'bg-rose-950 text-rose-300 border-rose-800'
          }`}>
            {activeMode}
          </span>
        </div>
      </div>

      <div className="p-3.5 sm:p-4 flex-1 overflow-y-auto space-y-4">
        
        {/* 5 Instant JAPAC Benchmark Preset Scenarios */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <span>Benchmark Scenarios</span>
              <span className="text-[10px] font-normal font-sans text-slate-400 lowercase">(select to load)</span>
            </label>
            <span className="text-[10px] font-mono text-slate-400 bg-navy-950 px-2 py-0.5 rounded border border-navy-750">
              5 Vectors
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {scenarios.map((sc) => {
              const isSelected = selectedScenarioId === sc.id;
              const isScInbound = sc.mode === 'INBOUND';
              
              let badgeColor = "bg-rose-950/80 text-rose-300 border-rose-700/80";
              let Icon = AlertTriangle;

              if (sc.expected_verdict === "APPROVED" || sc.expected_verdict === "TRANSACTION_CLEAN") {
                badgeColor = "bg-emerald-950/80 text-emerald-300 border-emerald-700/80";
                Icon = ShieldCheck;
              } else if (sc.expected_verdict === "AUTO_REWRITTEN" || sc.expected_verdict === "DYNAMIC_FRICTION_INJECTED") {
                badgeColor = "bg-amber-950/80 text-amber-300 border-amber-700/80";
                Icon = Sparkles;
              } else if (isScInbound) {
                badgeColor = "bg-rose-950/90 text-rose-300 border-rose-700/90";
                Icon = UserX;
              }

              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => onSelectScenario(sc)}
                  className={`text-left p-2.5 rounded-xl border transition-all text-xs cursor-pointer ${
                    isSelected
                      ? 'bg-navy-800/95 border-brand-teal shadow-lg shadow-teal-950/30 ring-1 ring-brand-teal/40'
                      : 'bg-navy-950/60 border-navy-750 hover:bg-navy-850 hover:border-navy-700'
                  }`}
                  aria-pressed={isSelected}
                >
                  <div className="flex flex-col gap-1 mb-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-slate-100 flex items-center gap-1.5 text-xs leading-snug">
                        <Icon className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isSelected ? 'text-brand-teal' : 'text-slate-400'}`} />
                        <span>{sc.name}</span>
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono border uppercase shrink-0 font-bold ${badgeColor}`}>
                        {sc.expected_verdict.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px]">
                      <span className={`px-1.5 py-0.2 rounded font-mono border uppercase font-bold text-[8px] ${
                        isScInbound ? 'bg-indigo-950 text-indigo-300 border-indigo-800' : 'bg-teal-950 text-brand-teal border-teal-800'
                      }`}>
                        {sc.mode}
                      </span>
                      <span className="text-slate-400 font-mono text-[10px] truncate">
                        {sc.jurisdiction_route || sc.jurisdiction}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {sc.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Form Controls Area */}
        <div className="space-y-3 pt-3 border-t border-navy-750">
          
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Inspection Parameters
            </span>
            {currentScenario && (
              <button
                type="button"
                onClick={handleResetCurrentScenario}
                className="text-[10px] text-slate-400 hover:text-brand-teal flex items-center gap-1 transition-colors cursor-pointer"
                title="Reset input to benchmark original"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Preset</span>
              </button>
            )}
          </div>

          {/* Jurisdiction Route & Dialect/Channel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Globe2 className="w-3 h-3 text-cyan-400" />
                <span>{isOutbound ? "Jurisdiction Route" : "Transit Corridor"}</span>
              </label>
              <select
                value={formData.jurisdiction_route}
                onChange={(e) => setFormData({ ...formData, jurisdiction_route: e.target.value })}
                className="w-full bg-navy-950 border border-navy-750 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-teal font-mono"
              >
                {isOutbound ? (
                  <>
                    <option value="ID -> SG">ID -&gt; SG (Indonesia GR 71 / PDP)</option>
                    <option value="SG Domestic (MAS / PDPA)">SG Domestic (MAS FEAT &amp; PDPA)</option>
                    <option value="MY -> IN Corridors">MY -&gt; IN Corridors (India DPDP)</option>
                    <option value="SG -> ASEAN Regional">SG -&gt; ASEAN Regional (Cross-Border)</option>
                    <option value="KR -> SG (PIPA RRN)">KR -&gt; SG (South Korea PIPA)</option>
                    <option value="AU -> SG (Data Airlock)">AU -&gt; SG (Australian PSPF)</option>
                  </>
                ) : (
                  <>
                    <option value="IN Domestic (UPI / IMPS)">IN Domestic (UPI / IMPS / RTGS)</option>
                    <option value="MY -> SG Corridors">MY -&gt; SG (FAST Wire / PayNow)</option>
                    <option value="ID Domestic (BI-FAST)">ID Domestic (BI-FAST / QRIS)</option>
                    <option value="TH Domestic (PromptPay)">TH Domestic (PromptPay Instant)</option>
                    <option value="SG Domestic (FAST / PayNow)">SG Domestic (PayNow / MEPS)</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1 flex items-center gap-1">
                {isOutbound ? (
                  <>
                    <MessageSquare className="w-3 h-3 text-indigo-400" />
                    <span>Target Dialect / Locale</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-3 h-3 text-amber-400" />
                    <span>Channel &amp; Target Amount</span>
                  </>
                )}
              </label>
              {isOutbound ? (
                <select
                  value={formData.target_dialect}
                  onChange={(e) => setFormData({ ...formData, target_dialect: e.target.value })}
                  className="w-full bg-navy-950 border border-navy-750 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-teal"
                >
                  <option value="Bahasa Indonesia / English (Bilingual)">Bahasa Indonesia (Formal/Bilingual)</option>
                  <option value="English (Singapore Formal)">English (Singapore MAS Standard)</option>
                  <option value="Hinglish / Vernacular Slang">Hinglish / Vernacular Slang</option>
                  <option value="English (Enterprise Standard)">English (Enterprise Standard)</option>
                  <option value="Singlish (Colloquial)">Singlish (Colloquial Advisory)</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={formData.payment_channel || "UPI Wire / ₹5,00,000"}
                  onChange={(e) => setFormData({ ...formData, payment_channel: e.target.value })}
                  placeholder="e.g., UPI Instant / ₹5,00,000"
                  className="w-full bg-navy-950 border border-navy-750 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-teal font-mono"
                />
              )}
            </div>
          </div>

          {/* Customer / Citizen Context */}
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-amber-400" />
              <span>{isOutbound ? "Client Identity & Account Context" : "Protected Citizen & Registered Emergency SOS"}</span>
            </label>
            <input
              type="text"
              value={formData.customer_context}
              onChange={(e) => setFormData({ ...formData, customer_context: e.target.value })}
              placeholder={isOutbound 
                ? "e.g., PT Nusantara Jaya Sentosa (NIK: 3171012803890005)" 
                : "e.g., Rajesh Verma (Targeted ₹5,00,000 / Emergency Contact: Daughter Pooja)"
              }
              className="w-full bg-navy-950 border border-navy-750 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-teal font-mono"
            />
          </div>

          {/* Message / Transcript Area */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
                {isOutbound ? (
                  <>
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    <span>Candidate Outbound AI Draft</span>
                  </>
                ) : (
                  <>
                    <PhoneCall className="w-3 h-3 text-rose-400" />
                    <span>Payment Remarks / Video Call Transcript</span>
                  </>
                )}
              </label>
              <span className={`text-[10px] font-mono ${currentChars > 0 ? 'text-slate-400' : 'text-amber-400'}`}>
                {currentChars} chars
              </span>
            </div>
            <textarea
              rows={5}
              value={formData.payload_text ?? formData.draft_message ?? ""}
              onChange={(e) => setFormData({ ...formData, payload_text: e.target.value, draft_message: e.target.value })}
              onKeyDown={handleKeyDown}
              placeholder={isOutbound
                ? "Enter candidate AI message containing potential hallucinations, demographic bias, or sovereign PII..."
                : "Enter incoming payment memo, Skype/video interrogation transcript, or courier seizure threat..."
              }
              className="w-full bg-navy-950 border border-navy-750 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-teal font-mono leading-relaxed resize-none shadow-inner"
            />
          </div>

        </div>
      </div>

      {/* Pane Footer Action Button */}
      <div className="p-3 border-t border-navy-750 bg-navy-950/90">
        <button
          type="button"
          onClick={onRunInterceptor}
          disabled={isLoading || !currentChars}
          className={`w-full py-2.5 px-4 rounded-xl text-white text-xs font-bold tracking-wide shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            isOutbound
              ? 'bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 hover:from-teal-500 hover:via-teal-400 hover:to-cyan-500 shadow-teal-900/30 text-white'
              : 'bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-500 hover:via-rose-400 hover:to-amber-500 shadow-rose-900/30 text-white'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>
                {isOutbound 
                  ? "Evaluating MAS FEAT & Sovereign Airlock..." 
                  : "Intercepting Coercion & Digital Arrest..."}
              </span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white text-white" />
              <span>
                {isOutbound 
                  ? "Run VeriBrake A2A Interceptor" 
                  : "Inspect Incoming Transit & Coercion"}
              </span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-black/40 border border-white/20 text-[10px] font-mono font-normal">
                Ctrl+Enter
              </kbd>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

