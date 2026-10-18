import React, { useState, useEffect } from 'react';
import { X, Copy, Check, FileCode, Shield, ExternalLink, Cpu, CheckCircle2, Lock, Radio } from 'lucide-react';

export default function A2ACardModal({ isOpen, onClose, agentCardData }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'raw'

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(agentCardData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const capabilities = agentCardData?.capabilities || {};
  const frameworks = agentCardData?.supported_frameworks || [];
  const services = agentCardData?.services || [];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/85 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="a2a-modal-title"
    >
      <div 
        className="bg-navy-900 border border-navy-750 rounded-2xl w-full max-w-3xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden panel-elevated"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-navy-750 flex items-center justify-between bg-navy-950/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/10 text-brand-teal border border-teal-500/30">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="a2a-modal-title" className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Agent2Agent (A2A) Protocol Card
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950/90 text-brand-teal border border-teal-800 font-semibold">
                  /.well-known/agent.json
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official Google Cloud &amp; Open A2A Standard Metadata Specification (v0.4.0)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-xs text-slate-200 border border-navy-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy Agent Card JSON to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied JSON' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 py-2 border-b border-navy-750 bg-navy-950/40 flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('summary')}
            className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'summary'
                ? 'bg-navy-800 text-brand-teal border border-navy-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Capabilities &amp; Compliance Matrix
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('raw')}
            className={`px-3 py-1 rounded-md font-mono transition-colors cursor-pointer ${
              activeTab === 'raw'
                ? 'bg-navy-800 text-brand-teal border border-navy-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Raw JSON Document
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {activeTab === 'summary' ? (
            <div className="space-y-4">
              {/* Telemetry Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-navy-950/70 border border-navy-750">
                  <div className="text-[10px] uppercase font-mono text-slate-400 mb-1">Standard Spec</div>
                  <div className="text-xs font-semibold text-brand-teal font-mono">
                    {agentCardData?.protocol_version ? `A2A Protocol v${agentCardData.protocol_version}` : 'A2A Protocol v0.4.0'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Autonomous Interoperability</div>
                </div>

                <div className="p-3 rounded-xl bg-navy-950/70 border border-navy-750">
                  <div className="text-[10px] uppercase font-mono text-slate-400 mb-1">Execution Orchestrator</div>
                  <div className="text-xs font-semibold text-indigo-400 font-mono">Google Cloud ADK</div>
                  <div className="text-[10px] text-slate-400 mt-1">Gemini 2.5 Flash + Deterministic</div>
                </div>

                <div className="p-3 rounded-xl bg-navy-950/70 border border-navy-750">
                  <div className="text-[10px] uppercase font-mono text-slate-400 mb-1">Sovereign Air-Lock</div>
                  <div className="text-xs font-semibold text-cyan-400 font-mono">Data61 / PSPF Tiers</div>
                  <div className="text-[10px] text-slate-400 mt-1">Deterministic Regex Scrubbing</div>
                </div>
              </div>

              {/* Verified Capabilities */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-brand-teal" />
                  Published Agent Capabilities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(capabilities).map(([key, val]) => (
                    <div 
                      key={key} 
                      className="p-2 rounded-lg bg-navy-950/50 border border-navy-750 flex items-center justify-between"
                    >
                      <span className="font-mono text-slate-300 text-[11px] truncate">{key}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        val ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-900 text-slate-400'
                      }`}>
                        {val ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supported Regional Frameworks */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  JAPAC Regulatory Frameworks
                </h4>
                <div className="space-y-2">
                  {frameworks.map((fw, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-navy-950/50 border border-navy-750 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-200 font-mono">{fw.id}</span>
                        <span className="text-[10px] text-slate-400">{fw.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {fw.scope || (fw.pillars ? `Pillars: ${fw.pillars.join(', ')}` : fw.version || '')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Endpoints */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-amber-400" />
                  A2A Mesh Service Endpoints
                </h4>
                <div className="space-y-1.5">
                  {services.map((srv, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-navy-950/50 border border-navy-750 flex items-start justify-between text-xs gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-1 py-0.2 rounded bg-navy-800 font-mono text-[9px] text-brand-teal font-bold border border-navy-700">
                            {srv.method}
                          </span>
                          <span className="font-mono text-white text-[11px]">{srv.route}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{srv.description}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">{srv.name}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* Raw JSON viewer */
            <div className="rounded-xl border border-navy-750 bg-navy-950 p-4 overflow-x-auto">
              <pre className="text-xs font-mono text-emerald-300/90 leading-relaxed">
                {JSON.stringify(agentCardData, null, 2)}
              </pre>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-navy-750 bg-navy-950 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px]">VeriBrake A2A Mesh Gateway &bull; Google Cloud AI Builder Cup</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold transition-colors cursor-pointer text-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

