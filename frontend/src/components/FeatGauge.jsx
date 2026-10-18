import React from 'react';

export default function FeatGauge({ label, score = 0, description, isRiskScore = false }) {
  // Safe clamped score
  const safeScore = Math.max(0, Math.min(100, Math.round(Number(score) || 0)));

  let colorClass = 'text-emerald-400';
  let bgBarClass = 'bg-emerald-500';
  let badgeBg = 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60';
  let statusText = 'Compliant';

  if (isRiskScore) {
    // For threat vectors: higher is riskier
    if (safeScore >= 75) {
      colorClass = 'text-rose-400';
      bgBarClass = 'bg-rose-500';
      badgeBg = 'bg-rose-950/90 text-rose-300 border-rose-700/80';
      statusText = 'Critical Vector';
    } else if (safeScore >= 35) {
      colorClass = 'text-amber-400';
      bgBarClass = 'bg-amber-500';
      badgeBg = 'bg-amber-950/90 text-amber-300 border-amber-700/80';
      statusText = 'Elevated Risk';
    } else {
      colorClass = 'text-emerald-400';
      bgBarClass = 'bg-emerald-500';
      badgeBg = 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60';
      statusText = 'Low Risk';
    }
  } else {
    // For compliance pillars: higher is better
    if (safeScore < 50) {
      colorClass = 'text-rose-400';
      bgBarClass = 'bg-rose-500';
      badgeBg = 'bg-rose-950/80 text-rose-300 border-rose-700/60';
      statusText = 'Breach Detected';
    } else if (safeScore < 80) {
      colorClass = 'text-amber-400';
      bgBarClass = 'bg-amber-500';
      badgeBg = 'bg-amber-950/80 text-amber-300 border-amber-700/60';
      statusText = 'Attention Required';
    } else {
      statusText = 'Verified Safe';
    }
  }

  return (
    <div className="bg-navy-850/90 border border-navy-750 rounded-lg p-2.5 hover:border-navy-700 transition-colors">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-medium text-slate-200 truncate pr-1" title={label}>
          {label}
        </span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold border shrink-0 ${badgeBg}`}>
          {safeScore}/100
        </span>
      </div>
      
      {/* Progress Bar with semantic track */}
      <div 
        className="w-full bg-navy-950 rounded-full h-1.5 overflow-hidden mb-1 border border-navy-750/50"
        role="progressbar"
        aria-valuenow={safeScore}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={`${label}: ${safeScore}% (${statusText})`}
      >
        <div 
          className={`h-full rounded-full transition-all duration-700 ease-out ${bgBarClass}`}
          style={{ width: `${Math.max(4, safeScore)}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[10px]">
        <span className="text-slate-400 truncate max-w-[70%]" title={description}>
          {description || statusText}
        </span>
        <span className={`font-mono text-[9px] ${colorClass}`}>
          {statusText}
        </span>
      </div>
    </div>
  );
}

