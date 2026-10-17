import React, { useState } from 'react';
import { X, Copy, Check, FileCode, Shield, ExternalLink, Cpu } from 'lucide-react';

export default function A2ACardModal({ isOpen, onClose, agentCardData }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(agentCardData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden glass-panel-elevated">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Agent2Agent (A2A) Protocol Card</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  /.well-known/agent.json
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official Google Cloud &amp; Open A2A Standard Metadata Specification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {/* Quick Summary Pill Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] uppercase font-mono text-slate-400 mb-1">Standard Spec</div>
              <div className="text-xs font-semibold text-emerald-400 font-mono">A2A Protocol v0.3.0</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] uppercase font-mono text-slate-400 mb-1">Governance Engine</div>
              <div className="text-xs font-semibold text-purple-400 font-mono">ADK + Gemini 2.5 Flash</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] uppercase font-mono text-slate-400 mb-1">Sovereign Air-Lock</div>
              <div className="text-xs font-semibold text-cyan-400 font-mono">Australia PSPF / Data61</div>
            </div>
          </div>

          {/* Raw JSON viewer */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 overflow-x-auto">
            <pre className="text-xs font-mono text-emerald-300 leading-relaxed">
              {JSON.stringify(agentCardData, null, 2)}
            </pre>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>VeriBrake A2A Mesh Gateway &bull; Google Cloud AI Builder Cup</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
