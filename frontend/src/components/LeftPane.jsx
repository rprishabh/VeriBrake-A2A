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
  Layers 
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

  return (
    <div className="flex flex-col h-full bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden glass-panel">
      {/* Pane Header */}
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded border ${
            isOutbound 
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            {isOutbound ? <Zap className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">
              {isOutbound ? "1. Outbound Enterprise AI Simulation" : "1. Inbound Transit & Coercion Interceptor"}
            </h2>
            <p className="text-[11px] text-slate-400">
              {isOutbound 
                ? "Simulate bank AI bot messages before reaching customers" 
                : "Intercept high-stress payment initiation & chat transcripts"}
            </p>
          </div>
        </div>

        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
          isOutbound 
            ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
            : 'bg-rose-950 text-rose-300 border-rose-800'
        }`}>
          {activeMode}
        </span>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        
        {/* 5 Instant JAPAC Benchmark Preset Scenarios */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Preset Benchmark Scenarios (Click to Load)
            </label>
            <span className="text-[10px] font-mono text-slate-400">5 Pre-Configured</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {scenarios.map((sc) => {
              const isSelected = selectedScenarioId === sc.id;
              const isScInbound = sc.mode === 'INBOUND';
              
              let badgeColor = "bg-rose-950/70 text-rose-300 border-rose-800/60";
              let Icon = AlertTriangle;

              if (sc.expected_verdict === "APPROVED" || sc.expected_verdict === "TRANSACTION_CLEAN") {
                badgeColor = "bg-emerald-950/70 text-emerald-300 border-emerald-800/60";
                Icon = ShieldCheck;
              } else if (sc.expected_verdict === "AUTO_REWRITTEN" || sc.expected_verdict === "DYNAMIC_FRICTION_INJECTED") {
                badgeColor = "bg-amber-950/70 text-amber-300 border-amber-800/60";
                Icon = Sparkles;
              } else if (isScInbound) {
                badgeColor = "bg-rose-950/90 text-rose-300 border-rose-700/80";
                Icon = UserX;
              }

              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => onSelectScenario(sc)}
                  className={`text-left p-2.5 rounded-lg border transition-all text-xs cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-emerald-500/80 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-semibold text-slate-200 line-clamp-1 flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      {sc.name}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className={`px-1 py-0.2 rounded text-[9px] font-mono border uppercase font-bold ${
                        isScInbound ? 'bg-purple-950 text-purple-300 border-purple-800' : 'bg-blue-950 text-blue-300 border-blue-800'
                      }`}>
                        {sc.mode}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono border uppercase shrink-0 ${badgeColor}`}>
                        {sc.expected_verdict.replace(/_/g, ' ')}
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

        {/* Dynamic Form Controls */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          
          {/* Jurisdiction & Channel in 2 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Globe2 className="w-3 h-3 text-cyan-400" />
                {isOutbound ? "Jurisdiction Route" : "Transit Jurisdiction"}
              </label>
              <select
                value={formData.jurisdiction_route}
                onChange={(e) => setFormData({ ...formData, jurisdiction_route: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
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
                    <MessageSquare className="w-3 h-3 text-purple-400" />
                    Target Dialect / Locale
                  </>
                ) : (
                  <>
                    <CreditCard className="w-3 h-3 text-amber-400" />
                    Payment Channel &amp; Amount
                  </>
                )}
              </label>
              {isOutbound ? (
                <select
                  value={formData.target_dialect}
                  onChange={(e) => setFormData({ ...formData, target_dialect: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                />
              )}
            </div>
          </div>

          {/* Customer / Citizen Context */}
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-amber-400" />
              {isOutbound ? "Customer Enterprise Context" : "Protected Citizen & Emergency Contact"}
            </label>
            <input
              type="text"
              value={formData.customer_context}
              onChange={(e) => setFormData({ ...formData, customer_context: e.target.value })}
              placeholder={isOutbound 
                ? "e.g., PT Nusantara Jaya Sentosa (NIK: 3171012803890005)" 
                : "e.g., Rajesh Verma (Targeted ₹5,00,000 / Emergency Contact: Daughter Pooja)"
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          {/* Message / Transcript Area */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
                {isOutbound ? (
                  <>
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    Outbound Agent Draft Message (Unsafe / Candidate)
                  </>
                ) : (
                  <>
                    <PhoneCall className="w-3 h-3 text-rose-400" />
                    Incoming Payment Initiation Memo / Chat Transcript
                  </>
                )}
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {formData.payload_text?.length || formData.draft_message?.length || 0} chars
              </span>
            </div>
            <textarea
              rows={6}
              value={formData.payload_text ?? formData.draft_message ?? ""}
              onChange={(e) => setFormData({ ...formData, payload_text: e.target.value, draft_message: e.target.value })}
              onKeyDown={handleKeyDown}
              placeholder={isOutbound
                ? "Enter synthetic outbound AI message containing potential hallucinations, demographic bias, or PII..."
                : "Enter incoming payment remarks, Skype/video interrogation transcript, or courier customs threat..."
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed resize-none"
            />
          </div>

        </div>
      </div>

      {/* Pane Footer Button */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/90">
        <button
          type="button"
          onClick={onRunInterceptor}
          disabled={isLoading || !(formData.payload_text || formData.draft_message)?.trim()}
          className={`w-full py-2.5 px-4 rounded-lg text-white text-xs font-bold tracking-wide shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            isOutbound
              ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 shadow-emerald-700/20'
              : 'bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:via-red-500 hover:to-amber-500 shadow-rose-700/20'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>
                {isOutbound 
                  ? "Executing Outbound MAS FEAT Guardrail..." 
                  : "Analyzing Inbound Coercion & Digital Arrest..."}
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
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-black/30 border border-white/20 text-[10px] font-mono">
                Ctrl+Enter
              </kbd>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
