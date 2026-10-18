import React from 'react';

export default function FeatGauge({ label, score = 0, description, isRiskScore = false }) {
  // Safe clamped score
  const safeScore = Math.max(0, Math.min(100, Math.round(Number(score) || 0)));

  let colorClass = 'text-emerald-400';
  let bgBarClass = 'bg-emerald-500';
  let badgeBg = 'bg-emerald-950/90 text-emerald-300 border-emerald-700/70';
  let statusText = 'Compliant';

  if (isRiskScore) {
    // For threat vectors: higher is riskier
    if (safeScore >= 75) {
      colorClass = 'text-rose-400';
      bgBarClass = 'bg-rose-500';
      badgeBg = 'bg-rose-950/95 text-rose-300 border-rose-700/90';
      statusText = 'Critical Vector';
    } else if (safeScore >= 35) {
      colorClass = 'text-amber-400';
      bgBarClass = 'bg-amber-500';
      badgeBg = 'bg-amber-950/95 text-amber-300 border-amber-700/90';
      statusText = 'Elevated Risk';
    } else {
      colorClass = 'text-emerald-400';
      bgBarClass = 'bg-emerald-500';
      badgeBg = 'bg-emerald-950/90 text-emerald-300 border-emerald-700/70';
      statusText = 'Low Risk';
    }
  } else {
    // For compliance pillars: higher is better
    if (safeScore < 50) {
      colorClass = 'text-rose-400';
      bgBarClass = 'bg-rose-500';
      badgeBg = 'bg-rose-950/90 text-rose-300 border-rose-700/70';
      statusText = 'Breach Detected';
    } else if (safeScore < 80) {
      colorClass = 'text-amber-400';
      bgBarClass = 'bg-amber-500';
      badgeBg = 'bg-amber-950/90 text-amber-300 border-amber-700/70';
      statusText = 'Attention Needed';
    } else {
      statusText = 'Verified Safe';
    }
  }

  return (
    <div className="bg-navy-900/95 border border-navy-750 hover:border-navy-650 rounded-xl p-3 flex flex-col justify-between transition-all shadow-sm hover:shadow-md">
      {/* Header: Full readable label + score badge */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-slate-100 leading-snug">
          {label}
        </span>
        <span className={`text-[11px] px-2 py-0.5 rounded-md font-mono font-bold border shrink-0 ${badgeBg}`}>
          {safeScore}/100
        </span>
      </div>
      
      {/* Progress Bar with semantic track */}
      <div 
        className="w-full bg-navy-950 rounded-full h-1.5 overflow-hidden my-1 border border-navy-800"
        role="progressbar"
        aria-valuenow={safeScore}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={`${label}: ${safeScore}% (${statusText})`}
      >
        <div 
          className={`h-full rounded-full transition-all duration-700 ease-out ${bgBarClass}`}
          style={{ width: `${Math.max(5, safeScore)}%` }}
        />
      </div>

      {/* Footer: Explanatory description and status pill */}
      <div className="flex items-center justify-between gap-1.5 mt-1.5 pt-1.5 border-t border-navy-800/80 text-[10px]">
        <span className="text-slate-400 truncate max-w-[65%]" title={description}>
          {description || statusText}
        </span>
        <span className={`font-mono font-bold text-[10px] shrink-0 ${colorClass}`}>
          {statusText}
        </span>
      </div>
    </div>
  );
}
