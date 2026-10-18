import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  Filter, 
  RotateCcw, 
  Eye, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowUpDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function AuditTrailView({
  auditLogs = [],
  onSelectAuditLog,
  onLoadIntoCockpit
}) {
  const [search, setSearch] = useState('');
  const [directionFilter, setDirectionFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((item) => {
      if (directionFilter !== 'ALL' && item.direction !== directionFilter) {
        return false;
      }
      if (severityFilter !== 'ALL') {
        const score = item.overall_risk_score ?? 0;
        if (severityFilter === 'CRITICAL' && score < 75) return false;
        if (severityFilter === 'MEDIUM' && (score < 35 || score >= 75)) return false;
        if (severityFilter === 'LOW' && score >= 35) return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchId = (item.log_id || '').toLowerCase().includes(q);
        const matchRoute = (item.jurisdiction_route || '').toLowerCase().includes(q);
        const matchVerdict = (item.verdict || '').toLowerCase().includes(q);
        const matchMsg = (item.original_message || '').toLowerCase().includes(q);
        if (!matchId && !matchRoute && !matchVerdict && !matchMsg) return false;
      }
      return true;
    });
  }, [auditLogs, directionFilter, severityFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) return;
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
    link.setAttribute("download", `veribrake_audit_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* View Header */}
      <div className="p-4 rounded-2xl bg-navy-900/85 border border-navy-750 panel-base shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-500/10 text-brand-teal border border-teal-500/30">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Supervisory Audit Trail Ledger</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-brand-teal border border-teal-800 font-semibold">
                {filteredLogs.length} Records Persisted
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Persistent, verifiable ledger across autonomous agent decisions, privacy scrubbing, and human escalations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="text-xs text-slate-200 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-800 hover:bg-navy-750 border border-navy-700 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-brand-teal" />
            <span>Export Audit Report (CSV)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3.5 rounded-2xl bg-navy-900/85 border border-navy-750 panel-base">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by Log ID, Route, Verdict, or Content..."
            className="w-full bg-navy-950 border border-navy-750 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-teal font-mono"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={directionFilter}
            onChange={(e) => {
              setDirectionFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-navy-950 border border-navy-750 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-teal font-mono"
          >
            <option value="ALL">Direction: All</option>
            <option value="OUTBOUND">Outbound AI</option>
            <option value="INBOUND">Inbound Coercion</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={severityFilter}
            onChange={(e) => {
              setSeverityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-navy-950 border border-navy-750 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-teal font-mono"
          >
            <option value="ALL">Risk: All Levels</option>
            <option value="CRITICAL">Critical (Score 75-100)</option>
            <option value="MEDIUM">Medium (Score 35-74)</option>
            <option value="LOW">Low (Score 0-34)</option>
          </select>
        </div>
      </div>

      {/* Audit Table */}
      <div className="rounded-2xl border border-navy-750 bg-navy-900/85 panel-base overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-navy-950 text-[10px] uppercase text-slate-400 border-b border-navy-750 sticky top-0">
              <tr>
                <th className="py-3 px-3.5">Log ID</th>
                <th className="py-3 px-3.5">Timestamp</th>
                <th className="py-3 px-3.5">Direction</th>
                <th className="py-3 px-3.5">Route</th>
                <th className="py-3 px-3.5">Risk Score</th>
                <th className="py-3 px-3.5">Verdict</th>
                <th className="py-3 px-3.5">HITL Status</th>
                <th className="py-3 px-3.5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-750/70 text-[11px]">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No matching audit records found.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => {
                  const isOut = log.direction === 'OUTBOUND';
                  let vBadge = "bg-rose-950/80 text-rose-300 border-rose-700/80";
                  if (log.verdict === 'APPROVED' || log.verdict === 'TRANSACTION_CLEAN') {
                    vBadge = "bg-emerald-950/80 text-emerald-300 border-emerald-700/80";
                  } else if (log.verdict === 'AUTO_REWRITTEN' || log.verdict === 'DYNAMIC_FRICTION_INJECTED') {
                    vBadge = "bg-amber-950/80 text-amber-300 border-amber-700/80";
                  }

                  const timeStr = log.timestamp 
                    ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                    : '--:--:--';

                  return (
                    <tr 
                      key={log.log_id}
                      onClick={() => onSelectAuditLog(log)}
                      className="hover:bg-navy-850/60 transition-colors cursor-pointer group"
                    >
                      <td className="py-2.5 px-3.5 font-bold text-brand-teal whitespace-nowrap group-hover:underline">
                        {log.log_id}
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-400 whitespace-nowrap">
                        {timeStr}
                      </td>
                      <td className="py-2.5 px-3.5 whitespace-nowrap">
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase border ${
                          isOut ? 'bg-teal-950 text-brand-teal border-teal-800' : 'bg-indigo-950 text-indigo-300 border-indigo-800'
                        }`}>
                          {log.direction}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-300 whitespace-nowrap truncate max-w-[120px]">
                        {log.jurisdiction_route}
                      </td>
                      <td className="py-2.5 px-3.5 font-bold">
                        <span className={`px-2 py-0.5 rounded border text-[10px] ${
                          log.overall_risk_score > 75 ? 'bg-rose-950 text-rose-400 border-rose-800' :
                          log.overall_risk_score > 35 ? 'bg-amber-950 text-amber-400 border-amber-800' :
                          'bg-emerald-950 text-emerald-400 border-emerald-800'
                        }`}>
                          {log.overall_risk_score ?? 0}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] border font-bold uppercase ${vBadge}`}>
                          {log.verdict}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                          log.resolved_status 
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : 'bg-navy-950 text-slate-400 border-navy-750'
                        }`}>
                          {log.resolved_status ? log.resolved_status.replace(/_/g, ' ') : 'Autonomous'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => onSelectAuditLog(log)}
                            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
                            title="Inspect in Drawer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onLoadIntoCockpit(log)}
                            className="p-1 rounded-md text-slate-400 hover:text-brand-teal hover:bg-navy-800 transition-colors"
                            title="Load into 3-Pane Cockpit"
                          >
                            <Layers className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-3 border-t border-navy-750 bg-navy-950 flex items-center justify-between text-xs text-slate-400">
            <span>
              Page {currentPage} of {totalPages} ({filteredLogs.length} total records)
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1.5 rounded-lg bg-navy-850 hover:bg-navy-800 disabled:opacity-40 text-slate-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-1.5 rounded-lg bg-navy-850 hover:bg-navy-800 disabled:opacity-40 text-slate-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
