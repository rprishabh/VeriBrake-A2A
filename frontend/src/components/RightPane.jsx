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
  Radio,
  Download,
  ShieldCheck,
  CheckCircle2,
  Clock
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
    if (!text) return;
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

  const handleExportCSV = () => {
    if (!auditLogs || auditLogs.length === 0) return;
    const headers = ["LogID", "Direction", "Timestamp", "Route", "Verdict", "RiskScore", "LatencyMs", "ResolvedStatus"];
    const rows = filteredLogs.map(l => [
      `"${l.log_id || ''}"`,
      `"${l.direction || ''}"`,
      `"${l.timestamp || ''}"`,
      `"${l.jurisdiction_route || ''}"`,
      `"${l.verdict || ''}"`,
      l.overall_risk_score ?? '',
      l.total_latency_ms ?? '',
      `"${l.resolved_status || 'UNRESOLVED'}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `veribrake_audit_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <div className="flex flex-col h-full bg-navy-900/85 border border-navy-750 rounded-2xl overflow-hidden panel-base shadow-xl">
      {/* Pane Header */}
      <div className="px-4 py-3 border-b border-navy-750 bg-navy-950/90 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>{isOutbound ? "3. Output Diff & Supervisory Action" : "3. Citizen Defense & SOC Action"}</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              {isOutbound ? "Side-by-side compliance diff & HITL resolution" : "Citizen de-escalation card & emergency dispatch"}
            </p>
          </div>
        </div>

        {currentLog?.log_id && (
          <span className="font-mono text-[10px] text-brand-teal bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800/80 font-semibold">
            {currentLog.log_id}
          </span>
        )}
      </div>

      <div className="p-3.5 sm:p-4 flex-1 overflow-y-auto space-y-3.5">

        {/* OUTBOUND MODE: SIDE-BY-SIDE DIFF */}
        {isOutbound && currentLog && currentLog.auditor && (
          <div className="space-y-3">
            {/* Top Card: Original Dangerous AI Output */}
            <div className="bg-navy-950/95 border border-rose-900/60 rounded-xl overflow-hidden shadow-lg shadow-rose-950/20">
              <div className="px-3 py-2 bg-rose-950/40 border-b border-rose-900/50 flex items-center justify-between">
                <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>Original Candidate Output (Unfiltered)</span>
                </span>
                <button
                  onClick={() => handleCopy(currentLog.original_message, 'original')}
                  className="p-1 rounded-md text-rose-400 hover:text-white hover:bg-rose-900/40 transition-colors cursor-pointer"
                  title="Copy Original text"
                  aria-label="Copy original message"
                >
                  {copiedOriginal ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="p-3 text-xs text-rose-200/90 font-mono leading-relaxed bg-rose-950/10 break-words">
                {currentLog.original_message}
              </div>
            </div>

            {/* Bottom Card: VeriBrake Auto-Rewritten Compliant Output */}
            <div className="bg-navy-950/95 border border-emerald-900/60 rounded-xl overflow-hidden shadow-lg shadow-emerald-950/20">
              <div className="px-3 py-2 bg-emerald-950/40 border-b border-emerald-900/50 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>VeriBrake Compliant Output (Safe Rewrite)</span>
                </span>
                <button
                  onClick={() => handleCopy(currentLog.auditor.safe_rewritten_message, 'rewritten')}
                  className="p-1 rounded-md text-emerald-400 hover:text-white hover:bg-emerald-900/40 transition-colors cursor-pointer"
                  title="Copy Compliant Rewrite"
                  aria-label="Copy safe rewritten message"
                >
                  {copiedRewritten ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="p-3 text-xs text-emerald-200/95 font-mono leading-relaxed bg-emerald-950/10 break-words">
                {currentLog.auditor.safe_rewritten_message || currentLog.airlock?.sanitized_text}
              </div>
            </div>

            {/* Outbound HITL Action Bar */}
            <div className="p-3 rounded-xl bg-navy-950 border border-navy-750 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-brand-teal" />
                  <span>Human-in-the-Loop (HITL) Governance</span>
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
                    High risk threshold intercepted. Compliance supervisor authorization required before release:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={isResolving}
                      onClick={() => onResolveLog(currentLog.log_id, 'APPROVE_REWRITE')}
                      className="py-1.5 px-3 rounded-lg bg-teal-900/60 hover:bg-teal-800 text-teal-200 text-xs font-semibold border border-teal-700/80 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3 h-3 text-teal-300" />
                      <span>Approve Safe Rewrite</span>
                    </button>

                    <button
                      type="button"
                      disabled={isResolving}
                      onClick={() => onResolveLog(currentLog.log_id, 'CONFIRM_BLOCK')}
                      className="py-1.5 px-3 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-200 text-xs font-semibold border border-rose-800/80 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Ban className="w-3 h-3 text-rose-400" />
                      <span>Confirm Block</span>
                    </button>
                  </div>
                </div>
              ) : resolvedStatus ? (
                <div className="p-2 rounded-lg bg-navy-900 border border-navy-750 text-[11px] text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Officer action recorded and committed to audit ledger.</span>
                </div>
              ) : (
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Autonomous verdict cleared. No manual escalation required.</span>
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
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider font-mono">
                    {currentLog.coercion.verdict === 'CIRCUIT_BREAKER_FROZEN'
                      ? "PAYMENT FROZEN BY CIRCUIT BREAKER"
                      : currentLog.coercion.verdict === 'DYNAMIC_FRICTION_INJECTED'
                      ? "DYNAMIC FRICTION INJECTED (COOLDOWN ACTIVE)"
                      : "TRANSACTION CLEAN - PROCEEDING"}
                  </div>
                  <div className="text-[11px] opacity-90 leading-tight mt-0.5">
                    {currentLog.coercion.verdict === 'CIRCUIT_BREAKER_FROZEN'
                      ? "High coercion & extortion probability detected. Funds quarantined safely in customer account."
                      : "Friction checks applied before gateway dispatch."}
                  </div>
                </div>
              </div>
            </div>

            {/* Calming De-escalation Screen (Simulated Citizen Defense Card) */}
            <div className="bg-gradient-to-br from-navy-950 via-navy-900 to-indigo-950/40 border border-teal-500/30 rounded-xl p-3.5 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-navy-750">
                <span className="text-xs font-bold text-brand-teal flex items-center gap-1.5 uppercase tracking-wider font-mono">
                  <HeartHandshake className="w-4 h-4 text-brand-teal" />
                  <span>Citizen De-Escalation Screen (Calm Card)</span>
                </span>
                <span className="text-[10px] bg-teal-950 text-brand-teal px-2 py-0.5 rounded border border-teal-800 font-mono font-semibold">
                  120s Breathing Room
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <p className="font-semibold text-white leading-snug">
                  "Take a deep breath. Law enforcement, CBI, Police, and Reserve Banks never ask citizens to transfer money to personal escrow accounts over Skype, WhatsApp, or video calls."
                </p>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Your pending transfer has been safely paused for 120 seconds. An immediate alert has been dispatched to your registered emergency contact:
                  <strong className="text-brand-teal ml-1">
                    {currentLog.customer_context?.includes("Daughter") ? "[Daughter: Pooja]" : "[Emergency Family Contact]"}
                  </strong>.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <a
                    href="tel:1930"
                    className="px-2.5 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-800 border border-rose-700 text-rose-200 text-[11px] font-mono font-bold flex items-center gap-1 transition-colors"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Helpline: 1930 (Cyber Crime)</span>
                  </a>
                  <span className="text-[11px] text-slate-400 font-mono">ScamShield Hotline: 1799</span>
                </div>
              </div>
            </div>

            {/* Live Webhook Telemetry Card */}
            <div className="bg-navy-950 border border-navy-750 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-mono">
                  <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                  <span>Emergency Family Contact SOS Webhook</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  DISPATCHED (Telegram / SMS)
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-navy-900 border border-navy-750 text-[11px] text-slate-200 font-mono leading-relaxed relative">
                <button
                  onClick={() => handleCopy(currentLog.coercion.emergency_contact_alert_payload, 'alert')}
                  className="absolute top-2 right-2 p-1 rounded text-slate-400 hover:text-white bg-navy-800 transition-colors"
                  title="Copy Alert Text"
                  aria-label="Copy emergency alert payload"
                >
                  {copiedAlert ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
                <div className="text-[10px] text-slate-400 uppercase mb-1">Dispatched Alert Payload:</div>
                <div className="pr-6 break-words">{currentLog.coercion.emergency_contact_alert_payload}</div>
              </div>
            </div>

            {/* Inbound SOC Officer Action Bar */}
            <div className="p-3 rounded-xl bg-navy-950 border border-navy-750 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-brand-teal" />
                  <span>Security Operations Center (SOC) Action</span>
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
                    <span>Confirm Fraud Quarantine</span>
                  </button>

                  <button
                    type="button"
                    disabled={isResolving}
                    onClick={() => onResolveLog(currentLog.log_id, 'UNFREEZE_PAYMENT')}
                    className="py-1.5 px-3 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-200 text-xs font-semibold border border-emerald-700/80 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Unlock className="w-3 h-3 text-emerald-300" />
                    <span>Unfreeze After Verification</span>
                  </button>
                </div>
              ) : (
                <div className="p-2 rounded-lg bg-navy-900 border border-navy-750 text-[11px] text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Officer action recorded in risk ledger: {resolvedStatus}</span>
                </div>
              )}
            </div>

          </div>
        )}

        {/* RECENT AUDIT TRAIL TABLE WITH FILTER TABS */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-brand-teal" />
              <span>Audit Trail Stream</span>
            </span>

            {/* Filter Tabs & Export */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center bg-navy-950 border border-navy-750 rounded-lg p-0.5 text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => setFilterDirection('ALL')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${filterDirection === 'ALL' ? 'bg-navy-800 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setFilterDirection('OUTBOUND')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${filterDirection === 'OUTBOUND' ? 'bg-teal-950 text-brand-teal font-bold border border-teal-800' : 'text-slate-400 hover:text-white'}`}
                >
                  Outbound
                </button>
                <button
                  type="button"
                  onClick={() => setFilterDirection('INBOUND')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${filterDirection === 'INBOUND' ? 'bg-rose-950 text-rose-300 font-bold border border-rose-800' : 'text-slate-400 hover:text-white'}`}
                >
                  Inbound
                </button>
              </div>

              <button
                type="button"
                onClick={handleExportCSV}
                className="p-1 rounded-md bg-navy-950 hover:bg-navy-800 border border-navy-750 text-slate-300 hover:text-white transition-colors"
                title="Export filtered records to CSV"
                aria-label="Export audit report CSV"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-navy-750 bg-navy-950 overflow-hidden shadow-inner">
            <div className="overflow-x-auto max-h-56">
              <table className="w-full text-left text-xs font-mono min-w-[440px]">
                <thead className="bg-navy-900 text-[10px] uppercase text-slate-400 border-b border-navy-750 sticky top-0 z-10">
                  <tr>
                    <th className="py-2 px-2.5">Type</th>
                    <th className="py-2 px-2.5">Time</th>
                    <th className="py-2 px-2.5">Route</th>
                    <th className="py-2 px-2.5">Risk</th>
                    <th className="py-2 px-2.5">Verdict</th>
                    <th className="py-2 px-2.5 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-750/70 text-[11px]">
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
                        className={`hover:bg-navy-850/60 transition-colors cursor-pointer ${
                          isSelected ? 'bg-navy-800/90 border-l-2 border-brand-teal' : ''
                        }`}
                        onClick={() => onSelectAuditLog(log)}
                      >
                        <td className="py-1.5 px-2.5 whitespace-nowrap">
                          <span className={`px-1 py-0.2 rounded text-[9px] uppercase font-bold border ${
                            isLogInbound ? 'bg-indigo-950 text-indigo-300 border-indigo-800' : 'bg-teal-950 text-brand-teal border-teal-800'
                          }`}>
                            {isLogInbound ? 'IN' : 'OUT'}
                          </span>
                        </td>
                        <td className="py-1.5 px-2.5 text-slate-400 whitespace-nowrap">{timeStr}</td>
                        <td className="py-1.5 px-2.5 text-slate-300 whitespace-nowrap truncate max-w-[120px]">{log.jurisdiction_route}</td>
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
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-navy-800"
                            title="Inspect in Cockpit"
                            aria-label={`Inspect ${log.log_id}`}
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

