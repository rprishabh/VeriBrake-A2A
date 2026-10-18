import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Eye, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  RotateCcw,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function AgentTrafficView({
  auditLogs = [],
  onSelectRequest,
  onLoadIntoCockpit
}) {
  const [search, setSearch] = useState('');
  const [directionFilter, setDirectionFilter] = useState('ALL');
  const [verdictFilter, setVerdictFilter] = useState('ALL');
  const [sortField, setSortField] = useState('timestamp'); // 'timestamp' | 'risk' | 'latency'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter and sort records
  const filteredRecords = useMemo(() => {
    return auditLogs.filter((item) => {
      // Direction filter
      if (directionFilter !== 'ALL' && item.direction !== directionFilter) {
        return false;
      }
      // Verdict filter
      if (verdictFilter !== 'ALL') {
        const v = item.verdict || '';
        if (verdictFilter === 'BLOCKED' && !v.includes('BLOCK') && !v.includes('FROZEN')) return false;
        if (verdictFilter === 'APPROVED' && !v.includes('APPROV') && !v.includes('CLEAN')) return false;
        if (verdictFilter === 'REWRITTEN' && !v.includes('REWRIT') && !v.includes('FRICTION')) return false;
      }
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchId = (item.log_id || '').toLowerCase().includes(q);
        const matchRoute = (item.jurisdiction_route || '').toLowerCase().includes(q);
        const matchText = (item.original_message || '').toLowerCase().includes(q);
        const matchVerdict = (item.verdict || '').toLowerCase().includes(q);
        if (!matchId && !matchRoute && !matchText && !matchVerdict) return false;
      }
      return true;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortField === 'risk') {
        valA = a.overall_risk_score ?? 0;
        valB = b.overall_risk_score ?? 0;
      } else if (sortField === 'latency') {
        valA = a.total_latency_ms ?? 0;
        valB = b.total_latency_ms ?? 0;
      }
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [auditLogs, directionFilter, verdictFilter, search, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setDirectionFilter('ALL');
    setVerdictFilter('ALL');
    setSortField('timestamp');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-navy-900/85 border border-navy-750 panel-base shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-500/10 text-brand-teal border border-teal-500/30">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Agent Traffic &amp; Interception Stream</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-navy-950 text-brand-teal border border-navy-750 font-semibold">
                {filteredRecords.length} Events Inspected
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Live inspection stream across enterprise AI agents and incoming citizen transaction transits
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetFilters}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-950 border border-navy-750 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3.5 rounded-2xl bg-navy-900/85 border border-navy-750 panel-base">
        {/* Search Input */}
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by Request ID, Route, or Payload remarks..."
            className="w-full bg-navy-950 border border-navy-750 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-teal font-mono"
          />
        </div>

        {/* Direction Filter */}
        <div className="sm:col-span-3">
          <select
            value={directionFilter}
            onChange={(e) => {
              setDirectionFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-navy-950 border border-navy-750 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-teal font-mono"
          >
            <option value="ALL">Direction: All Vectors</option>
            <option value="OUTBOUND">Direction: Outbound AI (MAS FEAT)</option>
            <option value="INBOUND">Direction: Inbound Coercion (Digital Arrest)</option>
          </select>
        </div>

        {/* Verdict Filter */}
        <div className="sm:col-span-4">
          <select
            value={verdictFilter}
            onChange={(e) => {
              setVerdictFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-navy-950 border border-navy-750 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-teal font-mono"
          >
            <option value="ALL">Verdict: All Outcomes</option>
            <option value="APPROVED">Verdict: Approved / Clean Pass</option>
            <option value="REWRITTEN">Verdict: Rewritten / Friction Injected</option>
            <option value="BLOCKED">Verdict: Blocked / Circuit Breaker Frozen</option>
          </select>
        </div>
      </div>

      {/* Traffic Table */}
      <div className="rounded-2xl border border-navy-750 bg-navy-900/85 panel-base overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-navy-950 text-[10px] uppercase text-slate-400 border-b border-navy-750 sticky top-0">
              <tr>
                <th className="py-3 px-3.5">
                  <button 
                    type="button" 
                    onClick={() => toggleSort('timestamp')}
                    className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>Timestamp</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3.5">Request ID</th>
                <th className="py-3 px-3.5">Lane / Agent</th>
                <th className="py-3 px-3.5">Jurisdiction</th>
                <th className="py-3 px-3.5">
                  <button 
                    type="button" 
                    onClick={() => toggleSort('risk')}
                    className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>Risk Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3.5">Verdict</th>
                <th className="py-3 px-3.5">
                  <button 
                    type="button" 
                    onClick={() => toggleSort('latency')}
                    className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>Latency</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-750/70 text-[11px]">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No matching agent traffic records found for the active filter.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((item) => {
                  const isOut = item.direction === 'OUTBOUND';
                  let vBadge = "bg-rose-950/80 text-rose-300 border-rose-700/80";
                  if (item.verdict === 'APPROVED' || item.verdict === 'TRANSACTION_CLEAN') {
                    vBadge = "bg-emerald-950/80 text-emerald-300 border-emerald-700/80";
                  } else if (item.verdict === 'AUTO_REWRITTEN' || item.verdict === 'DYNAMIC_FRICTION_INJECTED') {
                    vBadge = "bg-amber-950/80 text-amber-300 border-amber-700/80";
                  }

                  const timeStr = item.timestamp 
                    ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                    : '--:--:--';

                  return (
                    <tr 
                      key={item.log_id} 
                      className="hover:bg-navy-850/60 transition-colors cursor-pointer group"
                      onClick={() => onSelectRequest(item)}
                    >
                      <td className="py-2.5 px-3.5 text-slate-400 whitespace-nowrap">
                        {timeStr}
                      </td>
                      <td className="py-2.5 px-3.5 font-bold text-white whitespace-nowrap">
                        <span className="font-mono text-brand-teal group-hover:underline">
                          {item.log_id}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                          isOut ? 'bg-teal-950 text-brand-teal border-teal-800' : 'bg-indigo-950 text-indigo-300 border-indigo-800'
                        }`}>
                          {isOut ? 'Outbound AI' : 'Inbound Transit'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-300 whitespace-nowrap">
                        {item.jurisdiction_route}
                      </td>
                      <td className="py-2.5 px-3.5 font-bold">
                        <span className={`px-2 py-0.5 rounded border text-[10px] ${
                          item.overall_risk_score > 75 ? 'bg-rose-950 text-rose-400 border-rose-800' :
                          item.overall_risk_score > 35 ? 'bg-amber-950 text-amber-400 border-amber-800' :
                          'bg-emerald-950 text-emerald-400 border-emerald-800'
                        }`}>
                          {item.overall_risk_score ?? 0}/100
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] border font-bold uppercase ${vBadge}`}>
                          {item.verdict}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-400 whitespace-nowrap">
                        {item.total_latency_ms ? `${item.total_latency_ms} ms` : '320 ms'}
                      </td>
                      <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => onSelectRequest(item)}
                            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
                            title="Inspect Deep Dive Drawer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onLoadIntoCockpit(item)}
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
              Page {currentPage} of {totalPages} ({filteredRecords.length} records)
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
