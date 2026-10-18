import React, { useEffect } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Clock, 
  AlertTriangle,
  Building2,
  FileCheck2,
  Send,
  Ban,
  Unlock,
  Layers,
  FileCode
} from 'lucide-react';

export default function RequestDetailDrawer({
  isOpen,
  onClose,
  requestData,
  onLoadIntoCockpit,
  onResolveLog,
  isResolving
}) {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !requestData) return null;

  const isOutbound = requestData.direction === 'OUTBOUND';
  const isBlocked = isOutbound
    ? requestData.auditor?.verdict === 'BLOCKED_ESCALATED' || requestData.verdict === 'BLOCKED_ESCALATED'
    : requestData.coercion?.verdict === 'CIRCUIT_BREAKER_FROZEN' || requestData.verdict === 'CIRCUIT_BREAKER_FROZEN';

  const resolvedStatus = requestData.resolved_status;

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(requestData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-navy-950/80 backdrop-blur-sm animate-fade-in flex justify-end">
      <div 
        className="w-full max-w-2xl bg-navy-900 border-l border-navy-750 h-full flex flex-col shadow-2xl overflow-hidden panel-elevated"
        role="dialog"
        aria-modal="true"
        aria-label="Request Telemetry Deep Dive Drawer"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-navy-750 bg-navy-950/95 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl border ${
              isOutbound ? 'bg-teal-500/10 text-brand-teal border-teal-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}>
              {isOutbound ? <Sparkles className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Telemetry Record Detail
                </h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-navy-950 text-brand-teal border border-navy-750">
                  {requestData.log_id || 'ID-PENDING'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {requestData.timestamp ? new Date(requestData.timestamp).toLocaleString() : 'Recent Execution'} &bull; {requestData.jurisdiction_route}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJSON}
              className="p-1.5 rounded-lg bg-navy-850 hover:bg-navy-800 text-slate-300 hover:text-white border border-navy-750 transition-colors"
              title="Copy Full Record JSON"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          
          {/* Quick Metrics Header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 rounded-xl bg-navy-950/70 border border-navy-750">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Direction</span>
              <span className={`font-bold font-mono text-xs ${isOutbound ? 'text-brand-teal' : 'text-rose-400'}`}>
                {requestData.direction}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-navy-950/70 border border-navy-750">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Risk Score</span>
              <span className={`font-bold font-mono text-xs ${
                requestData.overall_risk_score > 75 ? 'text-rose-400' : requestData.overall_risk_score > 35 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {requestData.overall_risk_score ?? 0}/100
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-navy-950/70 border border-navy-750">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Verdict</span>
              <span className="font-bold font-mono text-[11px] text-white truncate block">
                {requestData.verdict || (isOutbound ? requestData.auditor?.verdict : requestData.coercion?.verdict) || 'INSPECTED'}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-navy-950/70 border border-navy-750">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Latency</span>
              <span className="font-bold font-mono text-xs text-brand-teal">
                {requestData.total_latency_ms ? `${requestData.total_latency_ms}ms` : '320ms'}
              </span>
            </div>
          </div>

          {/* Context Details */}
          {requestData.customer_context && (
            <div className="p-3 rounded-xl bg-navy-950/60 border border-navy-750">
              <div className="text-[10px] font-mono text-slate-400 uppercase mb-1 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-amber-400" />
                Customer / Protected Profile Context
              </div>
              <div className="text-slate-200 font-mono text-[11px]">
                {requestData.customer_context}
              </div>
            </div>
          )}

          {/* Candidate / Input Message */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono uppercase text-slate-400">
              Original Input Payload (Pre-Scrubbed)
            </div>
            <div className="p-3 rounded-xl bg-navy-950/90 border border-navy-750 text-slate-300 font-mono text-[11px] leading-relaxed break-words">
              {requestData.original_message}
            </div>
          </div>

          {/* Data Airlock Sanitized Output */}
          {requestData.airlock && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase text-slate-400 flex items-center justify-between">
                <span>Sovereign Data Airlock Scrubbed Result</span>
                <span className="text-amber-400 font-bold">{requestData.airlock.redacted_entities_count} PII Tokens Masked</span>
              </div>
              <div className="p-3 rounded-xl bg-navy-950/90 border border-navy-750 text-slate-200 font-mono text-[11px] leading-relaxed break-words">
                {requestData.airlock.sanitized_text}
              </div>
            </div>
          )}

          {/* Outbound Rewrite / Compliant Final */}
          {isOutbound && requestData.auditor?.safe_rewritten_message && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase text-emerald-400 flex items-center gap-1">
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>VeriBrake Safe Compliant Rewrite</span>
              </div>
              <div className="p-3 rounded-xl bg-navy-950/90 border border-emerald-900/50 text-emerald-200 font-mono text-[11px] leading-relaxed break-words">
                {requestData.auditor.safe_rewritten_message}
              </div>
            </div>
          )}

          {/* Inbound Coercion Details */}
          {!isOutbound && requestData.coercion && (
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-navy-950/90 border border-navy-750 space-y-2">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Threat Vector Detection</div>
                <div className="text-sm font-bold text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{requestData.coercion.threat_narrative_detected}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  {requestData.coercion.recommended_intervention}
                </p>
              </div>

              {requestData.coercion.emergency_contact_alert_payload && (
                <div className="p-3 rounded-xl bg-navy-950/90 border border-navy-750">
                  <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Emergency SOS Webhook Payload</div>
                  <div className="text-[11px] font-mono text-emerald-300 break-words">
                    {requestData.coercion.emergency_contact_alert_payload}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Supervisory Resolution Bar */}
          <div className="p-3 rounded-xl bg-navy-950 border border-navy-750 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Supervisory Resolution State
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                resolvedStatus 
                  ? resolvedStatus.includes('SAFE') || resolvedStatus.includes('UNFROZEN')
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    : 'bg-rose-950 text-rose-300 border-rose-700'
                  : 'bg-amber-950 text-amber-300 border-amber-700'
              }`}>
                {resolvedStatus ? resolvedStatus.replace(/_/g, ' ') : 'PENDING SUPERVISOR ACTION'}
              </span>
            </div>

            {isBlocked && !resolvedStatus && onResolveLog && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                {isOutbound ? (
                  <>
                    <button
                      type="button"
                      disabled={isResolving}
                      onClick={() => onResolveLog(requestData.log_id, 'APPROVE_REWRITE')}
                      className="py-1.5 px-3 rounded-lg bg-teal-900/60 hover:bg-teal-800 text-teal-200 text-xs font-semibold border border-teal-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3 h-3 text-teal-300" />
                      Approve Rewrite
                    </button>
                    <button
                      type="button"
                      disabled={isResolving}
                      onClick={() => onResolveLog(requestData.log_id, 'CONFIRM_BLOCK')}
                      className="py-1.5 px-3 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-200 text-xs font-semibold border border-rose-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Ban className="w-3 h-3 text-rose-400" />
                      Confirm Block
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      disabled={isResolving}
                      onClick={() => onResolveLog(requestData.log_id, 'CONFIRM_BLOCK')}
                      className="py-1.5 px-3 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-200 text-xs font-semibold border border-rose-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Ban className="w-3 h-3 text-rose-400" />
                      Confirm Fraud Block
                    </button>
                    <button
                      type="button"
                      disabled={isResolving}
                      onClick={() => onResolveLog(requestData.log_id, 'UNFREEZE_PAYMENT')}
                      className="py-1.5 px-3 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-200 text-xs font-semibold border border-emerald-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Unlock className="w-3 h-3 text-emerald-300" />
                      Unfreeze Payment
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-navy-750 bg-navy-950 flex items-center justify-between gap-3">
          {onLoadIntoCockpit && (
            <button
              type="button"
              onClick={() => {
                onLoadIntoCockpit(requestData);
                onClose();
              }}
              className="py-2 px-3 rounded-xl bg-navy-800 hover:bg-navy-750 text-slate-200 hover:text-white border border-navy-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-brand-teal" />
              <span>Load into Command Center</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-colors cursor-pointer ml-auto"
          >
            Close Drawer
          </button>
        </div>

      </div>
    </div>
  );
}
