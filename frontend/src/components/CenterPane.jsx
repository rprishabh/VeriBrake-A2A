import React from 'react';
import { 
  Cpu, 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertOctagon, 
  Layers, 
  Scale, 
  Eye, 
  UserX, 
  AlertTriangle, 
  Flame, 
  PhoneOff, 
  ZapOff 
} from 'lucide-react';
import FeatGauge from './FeatGauge';

export default function CenterPane({ activeMode, interceptResult, isExecuting }) {
  const isOutbound = activeMode === 'OUTBOUND';

  if (isExecuting) {
    return (
      <div className="flex flex-col h-full bg-slate-900/60 border border-slate-800 rounded-xl items-center justify-center p-8 glass-panel text-center">
        <div className="relative mb-6">
          <div className={`w-16 h-16 rounded-full border-4 ${
            isOutbound ? 'border-emerald-500/20 border-t-emerald-400' : 'border-rose-500/20 border-t-rose-400'
          } animate-spin`} />
          <Cpu className={`w-8 h-8 ${isOutbound ? 'text-emerald-400' : 'text-rose-400'} absolute inset-0 m-auto animate-pulse`} />
        </div>
        <h3 className="text-base font-semibold text-white mb-2">
          {isOutbound ? "Executing Outbound 3-Agent Assembly Line" : "Analyzing Inbound Psychological Coercion"}
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mb-4">
          {isOutbound 
            ? "Data Airlock \u2192 MAS FEAT Auditor (Gemini 2.5 Flash) \u2192 Vernacular Rewriter" 
            : "Data Airlock \u2192 Digital Arrest Extortion Engine \u2192 Friction & SOS Dispatch"}
        </p>
        <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/60">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          Shared Google ADK Sovereign Defense Pipeline Active
        </div>
      </div>
    );
  }

  if (!interceptResult) {
    return (
      <div className="flex flex-col h-full bg-slate-900/60 border border-slate-800 rounded-xl items-center justify-center p-8 glass-panel text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center mb-4 text-slate-400">
          <Layers className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-white mb-1">Awaiting Interception Trigger</h3>
        <p className="text-xs text-slate-400 max-w-xs mb-4">
          Select a benchmark scenario from the Left Pane or enter custom text and click the Intercept button.
        </p>
        <div className="text-[11px] font-mono text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
          {isOutbound 
            ? "Pipeline: Data Airlock \u2192 MAS FEAT \u2192 Circuit Breaker" 
            : "Pipeline: Data Airlock \u2192 Extortion Detection \u2192 Friction Funnel"}
        </div>
      </div>
    );
  }

  const { airlock, auditor, rewriter, coercion, total_latency_ms } = interceptResult;

  // Format highlighted sanitized airlock text
  const renderHighlightedSanitized = (text) => {
    if (!text) return null;
    const tokens = [
      '[SG_NRIC_REDACTED]',
      '[ID_NIK_REDACTED]',
      '[Aadhaar Redacted]',
      '[MyNumber Redacted]',
      '[RRN Omitted]',
      '[ACCOUNT_NO_REDACTED]',
      '[CARD_NO_REDACTED]',
      '[PHONE_REDACTED]',
      '[EMAIL_REDACTED]'
    ];

    const regex = new RegExp(`(${tokens.map(t => t.replace(/\[/g, '\\[').replace(/\]/g, '\\]')).join('|')})`, 'g');
    const parts = text.split(regex);

    return parts.map((part, i) => {
      if (tokens.includes(part)) {
        return (
          <span key={i} className="redacted-token mx-0.5 animate-pulse-subtle">
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden glass-panel">
      {/* Pane Header with Total Pipeline Telemetry */}
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">
              {isOutbound ? "2. Live MAS FEAT Telemetry & Guardrail" : "2. Inbound Coercion & Fraud Defense Telemetry"}
            </h2>
            <p className="text-[11px] text-slate-400">
              {isOutbound 
                ? "Outbound deterministic scrubbing + Gemini 2.5 Flash evaluation" 
                : "Psychological extortion analysis & Digital Arrest vector scoring"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-white">{total_latency_ms} ms</span> total
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-4">

        {/* AGENT 1: DATA AIRLOCK (APPLIES TO BOTH MODES) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/40">
                1
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Agent 1: Data Airlock &amp; Sovereign Perimeter
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                airlock.classification_tier === "SECRET"
                  ? "bg-rose-950 text-rose-300 border-rose-800"
                  : airlock.classification_tier === "PROTECTED"
                  ? "bg-amber-950 text-amber-300 border-amber-800"
                  : "bg-emerald-950 text-emerald-300 border-emerald-800"
              }`}>
                Tier: {airlock.classification_tier}
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                {airlock.latency_ms} ms
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] text-slate-400 leading-snug">
              <span className="font-semibold text-slate-300">Sovereign Policy: </span>
              {airlock.jurisdiction_policy}
            </div>

            <div className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-2.5 text-xs text-slate-200 font-mono leading-relaxed">
              <div className="text-[10px] uppercase font-sans text-slate-400 mb-1 flex items-center justify-between">
                <span>Sanitized Local Boundary Payload:</span>
                <span className="text-amber-400 font-bold">{airlock.redacted_entities_count} PII Tokens Scrubbed</span>
              </div>
              <div>{renderHighlightedSanitized(airlock.sanitized_text)}</div>
            </div>
          </div>
        </div>

        {/* MODE 1: OUTBOUND MAS FEAT & REWRITER */}
        {isOutbound && auditor && rewriter && (
          <>
            {/* AGENT 2: MAS FEAT AUDITOR */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold border border-purple-500/40">
                    2
                  </span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Agent 2: MAS FEAT &amp; Hallucination Auditor
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
                    auditor.verdict === 'APPROVED' 
                      ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700/80' 
                      : auditor.verdict === 'AUTO_REWRITTEN' 
                      ? 'bg-amber-950/90 text-amber-300 border-amber-700/80' 
                      : 'bg-rose-950/90 text-rose-300 border-rose-700/80'
                  }`}>
                    {auditor.verdict === 'APPROVED' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                    {auditor.verdict}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                    {auditor.latency_ms} ms
                  </span>
                </div>
              </div>

              {/* Model & Risk Score */}
              <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 mb-3 text-xs">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span className="font-mono text-[11px] text-slate-300">{auditor.model_used}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Overall Risk Score:</span>
                  <span className={`text-sm font-mono font-bold px-2 py-0.5 rounded border ${
                    auditor.overall_risk_score > 75 
                      ? 'bg-rose-950/90 text-rose-300 border-rose-800' 
                      : auditor.overall_risk_score > 35 
                      ? 'bg-amber-950/90 text-amber-300 border-amber-800' 
                      : 'bg-emerald-950/90 text-emerald-300 border-emerald-800'
                  }`}>
                    {auditor.overall_risk_score}/100
                  </span>
                </div>
              </div>

              {/* 4 MAS FEAT Score Gauges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                <FeatGauge 
                  label="Fairness" 
                  score={auditor.feat_scores.fairness} 
                  description="Veritas: Demographic neutrality"
                />
                <FeatGauge 
                  label="Ethics" 
                  score={auditor.feat_scores.ethics} 
                  description="Anti-coercion & fair dealing"
                />
                <FeatGauge 
                  label="Accountability" 
                  score={auditor.feat_scores.accountability} 
                  description="Traceability & HITL oversight"
                />
                <FeatGauge 
                  label="Transparency" 
                  score={auditor.feat_scores.transparency} 
                  description="Truthful APR & AI disclosure"
                />
              </div>

              {/* Violations List */}
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                  <span>Detected Breaches &amp; Regulatory Citations</span>
                  <span className="font-mono text-slate-400">{auditor.violations_detected?.length || 0} Breaches</span>
                </div>

                {auditor.violations_detected?.length === 0 ? (
                  <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-900/50 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Zero regulatory violations detected. Clean alignment with MAS FEAT, PDPA &amp; Veritas.</span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {auditor.violations_detected.map((v, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-900/50 text-xs">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-semibold text-rose-300 flex items-center gap-1.5">
                            <AlertOctagon className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            {v.category}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-900/60 text-rose-200 border border-rose-700/60">
                            {v.regulation_cited}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed pl-5">
                          {v.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AGENT 3: VERNACULAR REWRITER */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold border border-cyan-500/40">
                    3
                  </span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Agent 3: Vernacular Rewriter &amp; Circuit Breaker
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                    rewriter.circuit_breaker_active 
                      ? 'bg-rose-950 text-rose-300 border-rose-700' 
                      : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                  }`}>
                    {rewriter.circuit_breaker_active ? "CIRCUIT BREAKER: TRIPPED" : "CIRCUIT BREAKER: CLEAR"}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                    {rewriter.latency_ms} ms
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Action Dispatched:</span>
                  <span className="font-mono font-semibold text-slate-200">{rewriter.action_taken}</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">MAS Transparency Notice:</span>
                  <span className="font-mono text-emerald-400 font-semibold">Mandatory Enforced</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* MODE 2: INBOUND COERCION & DIGITAL ARREST DEFENSE */}
        {!isOutbound && coercion && (
          <>
            {/* AGENT 2: COERCION DEFENSE ENGINE */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/40">
                    2
                  </span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Agent 2: Psychological Coercion &amp; Digital Arrest Interceptor
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
                    coercion.verdict === 'CIRCUIT_BREAKER_FROZEN' 
                      ? 'bg-rose-950/90 text-rose-300 border-rose-700/80 animate-pulse' 
                      : coercion.verdict === 'DYNAMIC_FRICTION_INJECTED' 
                      ? 'bg-amber-950/90 text-amber-300 border-amber-700/80' 
                      : 'bg-emerald-950/90 text-emerald-300 border-emerald-700/80'
                  }`}>
                    {coercion.verdict === 'CIRCUIT_BREAKER_FROZEN' ? <Flame className="w-3.5 h-3.5 text-rose-400" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                    {coercion.verdict.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                    {coercion.latency_ms} ms
                  </span>
                </div>
              </div>

              {/* Coercion Severity Gauge & Mule Risk */}
              <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-900/80 border border-slate-800 rounded-lg p-3 mb-3 gap-3">
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-400 mb-0.5">Scam Taxonomy Detected</div>
                  <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{coercion.threat_narrative_detected}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="block text-[10px] uppercase text-slate-400 font-mono">Mule Account Risk</span>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                      coercion.mule_account_risk === 'CRITICAL'
                        ? 'bg-rose-950 text-rose-300 border-rose-700'
                        : coercion.mule_account_risk === 'MEDIUM'
                        ? 'bg-amber-950 text-amber-300 border-amber-700'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    }`}>
                      {coercion.mule_account_risk}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="block text-[10px] uppercase text-slate-400 font-mono">Coercion Severity</span>
                    <span className={`text-base font-mono font-bold px-2.5 py-0.5 rounded border ${
                      coercion.coercion_severity_score >= 75
                        ? 'bg-rose-950 text-rose-300 border-rose-700'
                        : coercion.coercion_severity_score >= 35
                        ? 'bg-amber-950 text-amber-300 border-amber-700'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    }`}>
                      {coercion.coercion_severity_score}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 Psychological Trigger Progress Bars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                <FeatGauge 
                  label="Authority Impersonation" 
                  score={coercion.psychological_markers.authority_impersonation} 
                  description="Fake Police, CBI, Supreme Court"
                />
                <FeatGauge 
                  label="Manufactured Urgency" 
                  score={coercion.psychological_markers.manufactured_urgency} 
                  description="15-minute countdowns & arrest"
                />
                <FeatGauge 
                  label="Isolation Coercion" 
                  score={coercion.psychological_markers.isolation_tactics} 
                  description="Do not disconnect video call"
                />
                <FeatGauge 
                  label="Mule Liquidation" 
                  score={coercion.psychological_markers.financial_liquidation} 
                  description="Transfer to verification escrow"
                />
              </div>

              {/* Actionable De-escalation Protocol */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1.5">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-slate-300">
                    <PhoneOff className="w-3.5 h-3.5 text-amber-400" />
                    Recommended De-Escalation Protocol
                  </span>
                  <span className="text-emerald-400 font-mono font-semibold">120s Citizen Breathing Room</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  {coercion.recommended_intervention}
                </p>
              </div>
            </div>

            {/* AGENT 3: DYNAMIC FRICTION & SOS ALERT */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/40">
                    3
                  </span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Agent 3: Dynamic Friction &amp; Family SOS Dispatch
                  </span>
                </div>
                
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                  coercion.webhook_sent 
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700' 
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}>
                  {coercion.webhook_sent ? "EMERGENCY SOS: SENT" : "SOS: STANDBY"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Transaction Status:</span>
                  <span className="font-mono font-semibold text-rose-400">
                    {coercion.verdict === 'CIRCUIT_BREAKER_FROZEN' ? "QUARANTINED / FROZEN" : "CLEARED"}
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Cool-down Duration:</span>
                  <span className="font-mono text-cyan-400 font-semibold">{coercion.cooldown_seconds} Seconds Mandated</span>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
