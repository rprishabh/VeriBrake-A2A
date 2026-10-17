import React from 'react';

export default function FeatGauge({ label, score, description }) {
  // Score 0-100
  let colorClass = 'text-emerald-400';
  let bgBarClass = 'bg-emerald-500';
  let badgeBg = 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60';
  
  if (score < 50) {
    colorClass = 'text-rose-400';
    bgBarClass = 'bg-rose-500';
    badgeBg = 'bg-rose-950/80 text-rose-300 border-rose-700/60';
  } else if (score < 80) {
    colorClass = 'text-amber-400';
    bgBarClass = 'bg-amber-500';
    badgeBg = 'bg-amber-950/80 text-amber-300 border-amber-700/60';
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
          {label}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold border ${badgeBg}`}>
          {score}/100
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-1">
        <div 
          className={`h-2 rounded-full transition-all duration-700 ease-out ${bgBarClass}`}
          style={{ width: `${Math.max(4, score)}%` }}
        />
      </div>

      {description && (
        <p className="text-[10px] text-slate-400 leading-tight truncate" title={description}>
          {description}
        </p>
      )}
    </div>
  );
}
