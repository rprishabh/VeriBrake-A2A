import React, { useState } from 'react';
import { 
  Inbox, 
  AlertOctagon, 
  Send, 
  Ban, 
  Unlock, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  Building2, 
  FileCheck2,
  Lock,
  UserCheck,
  Check,
  Copy,
  Layers
} from 'lucide-react';

export default function ReviewQueueView({
  auditLogs = [],
  onResolveLog,
  isResolving,
  onLoadIntoCockpit
}) {
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [reviewerNotes, setReviewerNotes] = useState('');

  // Find all cases needing review or resolved
  const escalatedCases = auditLogs.filter(log => {
    return (
      log.verdict === 'BLOCKED_ESCALATED' || 
      log.verdict === 'CIRCUIT_BREAKER_FROZEN' || 
      log.overall_risk_score >= 70 ||
      Boolean(log.resolved_status)
    );
  });

  const selectedCase = escalatedCases.find(c => c.log_id === selectedCaseId) || escalatedCases[0] || null;
  const isOutbound = selectedCase?.direction === 'OUTBOUND';
  const resolvedStatus = selectedCase?.resolved_status;

  const handleExecuteAction = async (action) => {
    if (!selectedCase) return;
    await onResolveLog(selectedCase.log_id, action);
  };

  return (
    <div className="space-y-4">
      {/* View Header */}
      <div className="p-4 rounded-2xl bg-navy-900/85 border border-navy-750 panel-base shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Supervisory Human-in-the-Loop (HITL) Queue</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800 font-semibold">
                {escalatedCases.filter(c => !c.resolved_status).length} Action Pending
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              High-impact governance escalations, demographic bias breaches, and frozen cyber-extortion funds
            </p>
          </div>
        </div>
      </div>

      {escalatedCases.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-navy-900/85 border border-navy-750 panel-base">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-white mb-1">Review Queue Clear</h3>
          <p className="text-xs text-slate-400">No high-risk violations or payment freezes currently require manual supervisor sign-off.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left Column: Case List */}
          <div className="lg:col-span-5 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Pending &amp; Historical Escalations
            </div>
            
            <div className="space-y-2 max-h-[720px] overflow-y-auto pr-1">
              {escalatedCases.map((c) => {
                const isSelected = selectedCase?.log_id === c.log_id;
                const isCaseOut = c.direction === 'OUTBOUND';
                const isCaseResolved = Boolean(c.resolved_status);

                return (
                  <button
                    key={c.log_id}
                    type="button"
                    onClick={() => {
                      setSelectedCaseId(c.log_id);
                      setReviewerNotes('');
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs cursor-pointer ${
                      isSelected
                        ? 'bg-navy-800 border-brand-teal shadow-lg shadow-teal-950/30 ring-1 ring-brand-teal/40'
                        : 'bg-navy-950/70 border-navy-750 hover:bg-navy-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono font-bold text-white text-[11px]">
                        {c.log_id}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono uppercase font-bold border ${
                          isCaseOut ? 'bg-teal-950 text-brand-teal border-teal-800' : 'bg-rose-950 text-rose-300 border-rose-800'
                        }`}>
                          {c.direction}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono uppercase font-bold border ${
                          isCaseResolved 
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border-amber-800'
                        }`}>
                          {isCaseResolved ? 'Resolved' : 'Needs Review'}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] font-semibold text-slate-200 line-clamp-1 mb-1">
                      {isCaseOut 
                        ? (c.auditor?.violations_detected?.[0]?.explanation || 'MAS FEAT Policy Violation')
                        : (c.coercion?.threat_narrative_detected || 'Coercion Extortion Escrow Alert')}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{c.jurisdiction_route}</span>
                      <span className="font-bold text-rose-400">Risk {c.overall_risk_score}/100</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Case Deep Dive & Decision Console */}
          {selectedCase && (
            <div className="lg:col-span-7 space-y-3.5">
              
              {/* Evidence Section */}
              <div className="p-4 rounded-2xl bg-navy-900/85 border border-navy-750 panel-base space-y-3">
                <div className="flex items-center justify-between border-b border-navy-750 pb-2.5">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Evidence &amp; Threat Forensics
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Case: {selectedCase.log_id} &bull; {selectedCase.jurisdiction_route}
                    </p>
                  </div>

                  {onLoadIntoCockpit && (
                    <button
                      type="button"
                      onClick={() => onLoadIntoCockpit(selectedCase)}
                      className="px-2.5 py-1 rounded-lg bg-navy-950 border border-navy-750 hover:border-brand-teal text-slate-300 hover:text-white text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5 text-brand-teal" />
                      <span>Open in Cockpit</span>
                    </button>
                  )}
                </div>

                {/* Candidate Message */}
                <div className="space-y-1">
                  <div className="text-[10px] font-mono uppercase text-slate-400">
                    Candidate Payload (Pre-Scrubbed)
                  </div>
                  <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-750 font-mono text-[11px] text-rose-200 leading-relaxed break-words">
                    {selectedCase.original_message}
                  </div>
                </div>

                {/* Sanitized Text */}
                {selectedCase.airlock && (
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono uppercase text-slate-400 flex items-center justify-between">
                      <span>Sovereign Perimeter Masking</span>
                      <span className="text-amber-400 font-bold">{selectedCase.airlock.redacted_entities_count} PII Tokens Scrubbed</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-750 font-mono text-[11px] text-slate-200 leading-relaxed break-words">
                      {selectedCase.airlock.sanitized_text}
                    </div>
                  </div>
                )}

                {/* Proposed Rewrite */}
                {isOutbound && selectedCase.auditor?.safe_rewritten_message && (
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono uppercase text-emerald-400">
                      VeriBrake Fact-Checked Compliant Rewrite
                    </div>
                    <div className="p-2.5 rounded-xl bg-navy-950 border border-emerald-900/60 font-mono text-[11px] text-emerald-200 leading-relaxed break-words">
                      {selectedCase.auditor.safe_rewritten_message}
                    </div>
                  </div>
                )}
              </div>

              {/* Decision Section */}
              <div className="p-4 rounded-2xl bg-navy-900/85 border border-navy-750 panel-base space-y-3">
                <div className="flex items-center justify-between border-b border-navy-750 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-brand-teal" />
                    <span>Supervisor Decision Console</span>
                  </span>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                    resolvedStatus
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      : 'bg-amber-950 text-amber-300 border-amber-700'
                  }`}>
                    {resolvedStatus ? resolvedStatus.replace(/_/g, ' ') : 'ACTION REQUIRED'}
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Compliance Officer Audit Notes
                  </label>
                  <textarea
                    rows={2}
                    value={reviewerNotes}
                    onChange={(e) => setReviewerNotes(e.target.value)}
                    placeholder="Enter supervisory rationale for compliance log..."
                    className="w-full bg-navy-950 border border-navy-750 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-teal font-sans resize-none"
                  />
                </div>

                {!resolvedStatus ? (
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    {isOutbound ? (
                      <>
                        <button
                          type="button"
                          disabled={isResolving}
                          onClick={() => handleExecuteAction('APPROVE_REWRITE')}
                          className="py-2 px-3 rounded-xl bg-teal-900/60 hover:bg-teal-800 text-teal-200 text-xs font-semibold border border-teal-700 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <Send className="w-3.5 h-3.5 text-teal-300" />
                          <span>Approve Safe Rewrite</span>
                        </button>
                        <button
                          type="button"
                          disabled={isResolving}
                          onClick={() => handleExecuteAction('CONFIRM_BLOCK')}
                          className="py-2 px-3 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-200 text-xs font-semibold border border-rose-800 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <Ban className="w-3.5 h-3.5 text-rose-400" />
                          <span>Confirm Permanent Block</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          disabled={isResolving}
                          onClick={() => handleExecuteAction('CONFIRM_BLOCK')}
                          className="py-2 px-3 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-200 text-xs font-semibold border border-rose-800 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <Ban className="w-3.5 h-3.5 text-rose-400" />
                          <span>Confirm Fraud Block</span>
                        </button>
                        <button
                          type="button"
                          disabled={isResolving}
                          onClick={() => handleExecuteAction('UNFREEZE_PAYMENT')}
                          className="py-2 px-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-200 text-xs font-semibold border border-emerald-700 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <Unlock className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Unfreeze After Verification</span>
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-navy-950 border border-navy-750 text-xs text-slate-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>This case was resolved and committed to the immutable compliance ledger.</span>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  );
}
