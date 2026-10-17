import React, { useState } from 'react';
import { 
  FileCheck2, 
  AlertCircle, 
  Send, 
  Ban, 
  Copy, 
  Check, 
  History, 
  ExternalLink, 
  UserCheck, 
  Database, 
  Eye, 
  ShieldAlert, 
  PhoneCall, 
  Lock, 
  HeartHandshake, 
  Unlock, 
  Radio 
} from 'lucide-react';

export default function RightPane({
  activeMode,
  interceptResult,
  auditLogs,
  onResolveLog,
  onSelectAuditLog,
  isResolving
}) {
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedRewritten, setCopiedRewritten] = useState(false);
  const [copiedAlert, setCopiedAlert] = useState(false);
  const [filterDirection, setFilterDirection] = useState('ALL');

  const isOutbound = activeMode === 'OUTBOUND';
  const currentLog = interceptResult;

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'original') {
      setCopiedOriginal(true);
      setTimeout(() => setCopiedOriginal(false), 2000);
    } else if (type === 'rewritten') {
      setCopiedRewritten(true);
      setTimeout(() => setCopiedRewritten(false), 2000);
    } else {
      setCopiedAlert(true);
      setTimeout(() => setCopiedAlert(false), 2000);
    }
  };

  const isBlocked = isOutbound 
    ? currentLog?.auditor?.verdict === 'BLOCKED_ESCALATED'
    : currentLog?.coercion?.verdict === 'CIRCUIT_BREAKER_FROZEN';

  const resolvedStatus = currentLog?.resolved_status;

  // Filter logs based on active tab
  const filteredLogs = auditLogs.filter(log => {
    if (filterDirection === 'ALL') return true;
    return log.direction === filterDirection;
  });

  return (
    <div className="flex flex-col h-full bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden glass-panel">
      {/* Pane Header */}
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">
              {isOutbound ? "3. Output Diff & Supervisory Audit Trail" : "3. Friction Funnel & Citizen Defense Card"}
            </h2>
            <p className="text-[11px] text-slate-400">
              {isOutbound ? "Side-by-side compliance diff & HITL governance" : "Dynamic cooling-off card & emergency dispatch"}
            </p>
          </div>
        </div>

        {currentLog?.log_id && (
          <span className="font-mono text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            {currentLog.log_id}
          </span>
        )}
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-4">

        {/* OUTBOUND MODE: SIDE-BY-SIDE DIFF */}
        {isOutbound && currentLog && currentLog.auditor && (
          <div className="space-y-3">
            {/* Top Card: Original Dangerous AI Output */}
            <div className="bg-slate-950/90 border border-rose-900/60 rounded-xl overflow-hidden shadow-lg shadow-rose-950/20">
              <div className="px-3 py-2 bg-rose-950/50 border-b border-rose-900/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  Original Dangerous AI Output (Pre-Scrubbed)
                </span>
                <button
                  onClick={() => handleCopy(currentLog.original_message, 'original')}
                  className="p-1 rounded text-rose-400 hover:text-white hover:bg-rose-900/40 transition-colors cursor-pointer"
                  title="Copy Original"
                >
                  {copiedOriginal ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="p-3 text-xs text-rose-200/90 font-mono leading-relaxed bg-rose-950/20">
                {currentLog.original_message}
              </div>
            </div>

            {/* Bottom Card: VeriBrake Auto-Rewritten Compliant Output */}
            <div className="bg-slate-950/90 border border-emerald-900/60 rounded-xl overflow-hidden shadow-lg shadow-emerald-950/20">
              <div className="px-3 py-2 bg-emerald-950/50 border-b border-emerald-900/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                  VeriBrake Auto-Rewritten Compliant Output
                </span>
                <button
                  onClick={() => handleCopy(currentLog.auditor.safe_rewritten_message, 'rewritten')}
                  className="p-1 rounded text-emerald-400 hover:text-white hover:bg-emerald-900/40 transition-colors cursor-pointer"
                  title="Copy Compliant Rewrite"
                >
                  {copiedRewritten ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="p-3 text-xs text-emerald-200/95 font-mono leading-relaxed bg-emerald-950/20">
                {currentLog.auditor.safe_rewritten_message || currentLog.airlock.sanitized_text}
              </div>
            </div>

            {/* Outbound HITL Action Bar */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Human-in-the-Loop (HITL) Governance
                </span>
                
                {resolvedStatus && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                    resolvedStatus === 'DISPATCHED_SAFE'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      : 'bg-rose-950 text-rose-300 border-rose-700'
                  }`}>
                    {resolvedStatus.replace(/_/g, ' ')}
                  </span>
                )}
              </div>

              {isBlocked && !resolvedStatus ? (
                <div className="space-y-1.5 pt-1">
                  <p className="text-[11px] text-slate-400">
                    High risk verdict intercepted. Compliance officer decision required before dispatch:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={isResolving}
                      onClick={() => onResolveLog(currentLog.log_id, 'APPROVE_REWRITE')}
                      className="py-1.5 px-3 rounded-lg bg-emerald-900/70 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold border border-emerald-700/80 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3 h-3 text-emerald-300" />
                      Approve Safe Rewrite
                    </button>

                    <button
                      type="button"
                      disabled={isResolving}
                      onClick={() => onResolveLog(currentLog.log_id, 'CONFIRM_BLOCK')}
                      className="py-1.5 px-3 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-200 text-xs font-semibold border border-rose-800/80 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Ban className="w-3 h-3 text-rose-400" />
                      Confirm Block
                    </button>
                  </div>
                </div>
              ) : resolvedStatus ? (
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                  Officer action verified and stored in immutable compliance ledger.
                </div>
              ) : (
                <div className="text-[11px] text-slate-400">
                  Autonomous verdict cleared without requiring manual escalation intervention.
                </div>
              )}
            </div>
          </div>
        )}

        {/* INBOUND MODE: DYNAMIC FRICTION FUNNEL & CITIZEN CALM CARD */}
        {!isOutbound && currentLog && currentLog.coercion && (
          <div className="space-y-3">
            
            {/* Payment Status Banner */}
            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              currentLog.coercion.verdict === 'CIRCUIT_BREAKER_FROZEN'
                ? 'bg-rose-950/80 border-rose-700 text-rose-200 animate-pulse'
                : currentLog.coercion.verdict === 'DYNAMIC_FRICTION_INJECTED'
                ? 'bg-amber-950/80 border-amber-700 text-amber-200'
                : 'bg-emerald-950/80 border-emerald-700 text-emerald-200'
            }`}>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider font-mono">
                    {currentLog.coercion.verdict === 'CIRCUIT_BREAKER_FROZEN'
                      ? "PAYMENT FROZEN BY CIRCUIT BREAKER"
                      : currentLog.coercion.verdict === 'DYNAMIC_FRICTION_INJECTED'
                      ? "DYNAMIC FRICTION INJECTED (COOLDOWN ACTIVE)"
                      : "TRANSACTION CLEAN - PROCEEDING"}
                  </div>
                  <div className="text-[11px] opacity-90">
                    {currentLog.coercion.verdict === 'CIRCUIT_BREAKER_FROZEN'
                      ? "High coercion & extortion probability detected. Funds quarantined in user account."
                      : "Friction checks applied before gateway dispatch."}
                  </div>
                </div>
              </div>
            </div>

            {/* Calming De-escalation Screen (Simulated Citizen Card) */}
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border border-cyan-500/30 rounded-xl p-4 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                  <HeartHandshake className="w-4 h-4 text-cyan-400" />
                  Simulated Citizen De-Escalation Screen
                </span>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-700 font-mono">
                  120s Breathing Room
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <p className="font-semibold text-white leading-snug">
                  "Take a deep breath. Law enforcement, CBI, Police, and Reserve Banks never ask citizens to transfer money to personal escrow accounts over Skype or WhatsApp video calls."
                </p>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Your pending transfer has been held safely for 120 seconds. An immediate alert has been dispatched to your registered emergency contact:
                  <strong className="text-emerald-300 ml-1">
                    {currentLog.customer_context.includes("Daughter") ? "[Daughter: Pooja]" : "[Family Emergency Contact]"}
                  </strong>.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <a
                    href="tel:1930"
                    className="px-2.5 py-1 rounded bg-rose-900/60 hover:bg-rose-800 border border-rose-700 text-rose-200 text-[11px] font-mono font-bold flex items-center gap-1"
                  >
                    <PhoneCall className="w-3 h-3" />
                    Helpline: 1930 (Cyber Crime)
                  </a>
                  <span className="text-[11px] text-slate-400 font-mono">ScamShield Hotline: 1799</span>
                </div>
              </div>
            </div>

            {/* Live Webhook Telemetry Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-mono">
                  <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                  Emergency Family Contact SOS Webhook
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  DISPATCHED (Telegram / SMS)
                </span>
              </div>

              <div className="p-2.5 rounded bg-slate-900/90 border border-slate-850 text-[11px] text-slate-200 font-mono leading-relaxed relative">
                <button
                  onClick={() => handleCopy(currentLog.coercion.emergency_contact_alert_payload, 'alert')}
                  className="absolute top-2 right-2 p-1 rounded text-slate-400 hover:text-white bg-slate-800 transition-colors"
                  title="Copy Alert Text"
                >
                  {copiedAlert ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
                <div className="text-[10px] text-slate-400 uppercase mb-1">Dispatched Payload:</div>
                <div className="pr-6">{currentLog.coercion.emergency_contact_alert_payload}</div>
              </div>
            </div>

            {/* Inbound HITL Officer Action Bar */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Security Operations Center (SOC) Action
                </span>
                
                {resolvedStatus && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                    resolvedStatus === 'PERMANENT_BLOCKED'
                      ? 'bg-rose-950 text-rose-300 border-rose-700'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                  }`}>
                    {resolvedStatus.replace(/_/g, ' ')}
                  </span>
                )}
              </div>

              {!resolvedStatus ? (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    disabled={isResolving}
                    onClick={() => onResolveLog(currentLog.log_id, 'CONFIRM_BLOCK')}
                    className="py-1.5 px-3 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-200 text-xs font-semibold border border-rose-800/80 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Ban className="w-3 h-3 text-rose-400" />
                    Confirm Fraud Quarantine
                  </button>

                  <button
                    type="button"
                    disabled={isResolving}
                    onClick={() => onResolveLog(currentLog.log_id, 'UNFREEZE_PAYMENT')}
                    className="py-1.5 px-3 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-200 text-xs font-semibold border border-emerald-700/80 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Unlock className="w-3 h-3 text-emerald-300" />
                    Unfreeze After Verification
                  </button>
                </div>
              ) : (
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                  Officer action recorded in immutable risk ledger: {resolvedStatus}
                </div>
              )}
            </div>

          </div>
        )}

        {/* IMMUTABLE AUDIT TRAIL TABLE WITH FILTER TABS */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-blue-400" />
              Unified Audit Trail
            </span>

            {/* Filter Tabs */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => setFilterDirection('ALL')}
                className={`px-2 py-0.5 rounded cursor-pointer ${filterDirection === 'ALL' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilterDirection('OUTBOUND')}
                className={`px-2 py-0.5 rounded cursor-pointer ${filterDirection === 'OUTBOUND' ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800' : 'text-slate-400 hover:text-white'}`}
              >
                Outbound AI
              </button>
              <button
                type="button"
                onClick={() => setFilterDirection('INBOUND')}
                className={`px-2 py-0.5 rounded cursor-pointer ${filterDirection === 'INBOUND' ? 'bg-rose-950 text-rose-300 font-bold border border-rose-800' : 'text-slate-400 hover:text-white'}`}
              >
                Inbound Fraud
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
            <div className="overflow-x-auto max-h-56">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900/90 text-[10px] uppercase text-slate-400 border-b border-slate-800 sticky top-0">
                  <tr>
                    <th className="py-2 px-2.5">Type</th>
                    <th className="py-2 px-2.5">Time</th>
                    <th className="py-2 px-2.5">Route</th>
                    <th className="py-2 px-2.5">Severity</th>
                    <th className="py-2 px-2.5">Verdict</th>
                    <th className="py-2 px-2.5 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-[11px]">
                  {filteredLogs.map((log) => {
                    const isSelected = currentLog?.log_id === log.log_id;
                    const isLogInbound = log.direction === 'INBOUND';

                    let vColor = "text-rose-400 bg-rose-950/60 border-rose-800/80";
                    if (log.verdict === "APPROVED" || log.verdict === "TRANSACTION_CLEAN") {
                      vColor = "text-emerald-400 bg-emerald-950/60 border-emerald-800/80";
                    } else if (log.verdict === "AUTO_REWRITTEN" || log.verdict === "DYNAMIC_FRICTION_INJECTED") {
                      vColor = "text-amber-400 bg-amber-950/60 border-amber-800/80";
                    }

                    const timeStr = log.timestamp 
                      ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                      : '--:--:--';

                    return (
                      <tr 
                        key={log.log_id}
                        className={`hover:bg-slate-900/60 transition-colors cursor-pointer ${
                          isSelected ? 'bg-slate-900/90 border-l-2 border-emerald-500' : ''
                        }`}
                        onClick={() => onSelectAuditLog(log)}
                      >
                        <td className="py-1.5 px-2.5 whitespace-nowrap">
                          <span className={`px-1 py-0.2 rounded text-[9px] uppercase font-bold border ${
                            isLogInbound ? 'bg-purple-950 text-purple-300 border-purple-800' : 'bg-blue-950 text-blue-300 border-blue-800'
                          }`}>
                            {isLogInbound ? 'IN' : 'OUT'}
                          </span>
                        </td>
                        <td className="py-1.5 px-2.5 text-slate-400 whitespace-nowrap">{timeStr}</td>
                        <td className="py-1.5 px-2.5 text-slate-300 whitespace-nowrap">{log.jurisdiction_route}</td>
                        <td className="py-1.5 px-2.5 font-bold">
                          <span className={log.overall_risk_score > 75 ? 'text-rose-400' : log.overall_risk_score > 35 ? 'text-amber-400' : 'text-emerald-400'}>
                            {log.overall_risk_score}
                          </span>
                        </td>
                        <td className="py-1.5 px-2.5 whitespace-nowrap">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] border ${vColor}`}>
                            {log.verdict}
                          </span>
                        </td>
                        <td className="py-1.5 px-2.5 text-right">
                          <button
                            type="button"
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                            title="Inspect Payload"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
