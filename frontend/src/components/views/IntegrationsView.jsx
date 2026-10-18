import React from 'react';
import { 
  Cpu, 
  Server, 
  Database, 
  Sparkles, 
  Radio, 
  FileCode, 
  ExternalLink, 
  CheckCircle2, 
  Info,
  Shield,
  Layers
} from 'lucide-react';

export default function IntegrationsView({ onOpenA2ACard, agentCardData }) {
  const integrations = [
    {
      name: 'Google Cloud Run',
      category: 'Serverless Hosting & Container Mesh',
      status: 'Cloud Run Ready',
      region: 'asia-southeast1 (Singapore)',
      latency: '< 150ms Cold-Start',
      description: 'Host the containerized FastAPI backend and Vite frontend with automatic horizontal scaling under peak financial transaction loads.',
      badge: 'Certified',
      badgeColor: 'bg-teal-950 text-brand-teal border-teal-800'
    },
    {
      name: 'Gemini 2.5 Flash',
      category: 'Enterprise Generative AI Model',
      status: 'Active Auditor',
      region: 'Google GenAI Vertex / Studio',
      latency: '~280ms Inference',
      description: 'Powers Agent 2A MAS FEAT & Veritas multi-pillar auditing and Vernacular fact-checked message rewriting with zero demographic hallucination.',
      badge: 'LLM Engine',
      badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-800'
    },
    {
      name: 'Google Agent Development Kit (ADK)',
      category: 'Multi-Agent Assembly Pipeline',
      status: 'Orchestrating',
      region: 'Runtime Core',
      latency: '< 5ms Pipeline Overhead',
      description: 'Shared 3-agent pipeline coordinating deterministic sovereign perimeter airlocks, Gemini auditors, and dynamic circuit breakers.',
      badge: 'Orchestrator',
      badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800'
    },
    {
      name: 'Dual-Mode Persistence (Firestore / SQLite)',
      category: 'Immutable Audit Ledger',
      status: 'Dual Ledger Active',
      region: 'Local SQLite (Default) \u2194 Cloud Firestore',
      latency: '< 10ms Write',
      description: 'Stores tamper-evident records of all intercepted requests, PII redaction metrics, risk scores, and human supervisor sign-offs.',
      badge: 'Persistence',
      badgeColor: 'bg-amber-950 text-amber-300 border-amber-800'
    },
    {
      name: 'Agent2Agent (A2A) Protocol v0.4.0',
      category: 'Open Agent Interoperability Spec',
      status: 'Published at /.well-known/agent.json',
      region: 'Open Standard (A2A Specification)',
      latency: 'Sub-millisecond Discovery',
      description: 'Standardized Agent Card exposing autonomous inspection capabilities, compliance boundaries, and webhook endpoints for multi-agent meshes.',
      badge: 'Protocol Spec',
      badgeColor: 'bg-teal-950 text-brand-teal border-teal-800',
      action: onOpenA2ACard
    },
    {
      name: 'Emergency Family SOS Dispatch Webhook',
      category: 'Citizen Anti-Extortion Telephony',
      status: 'Simulated Webhook Active',
      region: 'Telegram / Twilio SMS / WhatsApp Bridge',
      latency: '< 200ms Dispatch',
      description: 'Instantly alerts trusted family contacts and emergency responders when severe psychological coercion (Digital Arrest) is intercepted.',
      badge: 'Anti-Extortion',
      badgeColor: 'bg-rose-950 text-rose-300 border-rose-800'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-navy-900/85 border border-navy-750 panel-base shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-500/10 text-brand-teal border border-teal-500/30">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Cloud &amp; Protocol Integrations</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-brand-teal border border-teal-800 font-semibold">
                6 Connectors
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Google Cloud Platform ecosystem, Agent2Agent (A2A) standard, and Gemini 2.5 Flash infrastructure
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenA2ACard}
          className="text-xs text-slate-200 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-850 hover:bg-navy-800 border border-navy-700 transition-colors shadow-sm font-mono cursor-pointer"
        >
          <FileCode className="w-3.5 h-3.5 text-brand-teal" />
          <span>Inspect agent.json</span>
        </button>
      </div>

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {integrations.map((item, idx) => (
          <div 
            key={idx}
            className="p-4 rounded-2xl bg-navy-900/85 border border-navy-750 panel-base shadow-xl flex flex-col justify-between space-y-3 hover:border-navy-700 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  {item.category}
                </span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold border ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white tracking-tight mb-1">
                {item.name}
              </h3>

              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                {item.description}
              </p>
            </div>

            <div className="pt-2.5 border-t border-navy-750/70 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Status:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {item.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Region / Zone:</span>
                <span className="text-slate-200">{item.region}</span>
              </div>

              {item.action && (
                <button
                  type="button"
                  onClick={item.action}
                  className="w-full mt-2 py-1.5 px-3 rounded-lg bg-navy-800 hover:bg-navy-750 text-brand-teal text-xs font-semibold border border-navy-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Open A2A Protocol Metadata</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
