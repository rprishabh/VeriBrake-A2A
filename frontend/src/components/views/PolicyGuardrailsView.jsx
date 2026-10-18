import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Scale, 
  Lock, 
  AlertTriangle, 
  FileText, 
  Globe2, 
  Sparkles,
  Info,
  CheckCircle2,
  Check,
  ChevronRight
} from 'lucide-react';

export default function PolicyGuardrailsView() {
  const [selectedPolicyId, setSelectedPolicyId] = useState('POL-MAS-01');
  const [activeTab, setActiveTab] = useState('ALL');

  const [policies, setPolicies] = useState([
    {
      id: 'POL-MAS-01',
      name: 'MAS FEAT: Demographic Fairness & Veritas Neutrality',
      category: 'Fairness',
      pillar: 'Fairness',
      severity: 'CRITICAL',
      jurisdiction: 'SG (MAS / Veritas)',
      enforcement: 'BLOCK_AND_ESCALATE',
      enabled: true,
      lastUpdated: '2026-10-15',
      description: 'Prohibits autonomous underwriting models from penalizing credit limits, APR, or eligibility based on gender, postal district, or protected demographic traits.',
      impactExplanation: 'When triggered, trips the Outbound Circuit Breaker immediately and prevents unauthorized AI messages from reaching customers. A Veritas complaint audit record is generated.'
    },
    {
      id: 'POL-MAS-02',
      name: 'MAS FEAT: Ethics & Anti-Coercive Deception',
      category: 'Ethics',
      pillar: 'Ethics',
      severity: 'HIGH',
      jurisdiction: 'SG (MAS)',
      enforcement: 'AUTO_REWRITE',
      enabled: true,
      lastUpdated: '2026-10-12',
      description: 'Disallows artificial countdown timers, manufactured pressure, or false claims of exclusive immediate credit quotas.',
      impactExplanation: 'The Vernacular Rewriter automatically strips manipulative sales countdowns and substitutes fact-based bank advisory language with full AI disclosure notice.'
    },
    {
      id: 'POL-MAS-03',
      name: 'MAS FEAT: Accountability & Human Escalation Ownership',
      category: 'Accountability',
      pillar: 'Accountability',
      severity: 'HIGH',
      jurisdiction: 'SG (MAS)',
      enforcement: 'ESCALATE_TO_OFFICER',
      enabled: true,
      lastUpdated: '2026-10-10',
      description: 'Requires high-impact autonomous loan decisions over $10,000 SGD to maintain human supervisor review rights before dispatch.',
      impactExplanation: 'Routes candidate drafts directly to the Supervisory Review Queue with clear explanations and audit trail persistence.'
    },
    {
      id: 'POL-MAS-04',
      name: 'MAS FEAT: Truthful APR & Transparent AI Disclosure',
      category: 'Transparency',
      pillar: 'Transparency',
      severity: 'CRITICAL',
      jurisdiction: 'SG (MAS)',
      enforcement: 'BLOCK_AND_ESCALATE',
      enabled: true,
      lastUpdated: '2026-10-18',
      description: 'Fact-checks draft rates against ground_truth.json (minimum 4.5% APR) and mandates inclusion of official Veritas AI assistance notice.',
      impactExplanation: 'Halts hallucinated 0% APR offers instantly. Mandates inclusion of standard Veritas disclaimer: "[Disclosed: Prepared with AI assistance in compliance with MAS FEAT Principles]".'
    },
    {
      id: 'POL-ID-GR71',
      name: 'Indonesia GR 71/2019 & PDP Law: NIK Residency Lock',
      category: 'Data Sovereignty',
      pillar: 'Sovereignty',
      severity: 'CRITICAL',
      jurisdiction: 'ID (GR 71 / PDP Law)',
      enforcement: 'DETERMINISTIC_MASK',
      enabled: true,
      lastUpdated: '2026-10-08',
      description: 'Deterministic perimeter airlock scrubs 16-digit Nomor Induk Kependudukan (NIK) before any outbound AI inference crosses sovereign borders.',
      impactExplanation: 'Replaces raw NIK with [ID_NIK_REDACTED]. Blocks unredacted cross-border transmission under Government Regulation No. 71/2019.'
    },
    {
      id: 'POL-IN-DPDP',
      name: 'India DPDP Act 2023: Aadhaar Masking Protocol',
      category: 'Data Sovereignty',
      pillar: 'Sovereignty',
      severity: 'CRITICAL',
      jurisdiction: 'IN (DPDP Act)',
      enforcement: 'DETERMINISTIC_MASK',
      enabled: true,
      lastUpdated: '2026-10-11',
      description: 'Deterministic regex scrubs 12-digit Aadhaar national identification numbers and Virtual IDs from customer interaction channels.',
      impactExplanation: 'Replaces raw Aadhaar digits with [Aadhaar Redacted] and flags Purpose Limitation requirements under the Digital Personal Data Protection Act 2023.'
    },
    {
      id: 'POL-I4C-ARREST',
      name: 'I4C & RBI: Digital Arrest & Skype Extortion Interception',
      category: 'Fraud Defense',
      pillar: 'Coercion Defense',
      severity: 'CRITICAL',
      jurisdiction: 'IN / JAPAC (I4C)',
      enforcement: 'FREEZE_PAYMENT_AND_SOS',
      enabled: true,
      lastUpdated: '2026-10-16',
      description: 'Detects fake law enforcement impersonation (CBI, Customs, Police), manufactured 15-minute countdowns, and demands for "verification escrow" liquidation.',
      impactExplanation: 'Engages Circuit Breaker payment freeze, renders 120-second calming citizen guidance screen, and dispatches automated family emergency contact SOS alert.'
    },
    {
      id: 'POL-AU-PSPF',
      name: 'Australia PSPF & Data61: Cross-Border Airlock Tiers',
      category: 'Data Sovereignty',
      pillar: 'Sovereignty',
      severity: 'HIGH',
      jurisdiction: 'AU (PSPF / Data61)',
      enforcement: 'TIER_CLASSIFICATION',
      enabled: true,
      lastUpdated: '2026-10-05',
      description: 'Enforces security classification tiers: OFFICIAL, PROTECTED, and SECRET before multi-agent routing.',
      impactExplanation: 'Classifies data flows deterministically and enforces sovereign storage isolation.'
    }
  ]);

  const togglePolicy = (id) => {
    setPolicies(policies.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
  };

  const filteredPolicies = policies.filter(p => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'FEAT') return p.pillar !== 'Sovereignty' && p.pillar !== 'Coercion Defense';
    if (activeTab === 'SOVEREIGNTY') return p.pillar === 'Sovereignty';
    if (activeTab === 'COERCION') return p.pillar === 'Coercion Defense';
    return true;
  });

  const selectedPolicy = policies.find(p => p.id === selectedPolicyId) || policies[0];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-navy-900/85 border border-navy-750 panel-base shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-500/10 text-brand-teal border border-teal-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Policy &amp; Guardrails Matrix</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-brand-teal border border-teal-800 font-semibold">
                {policies.filter(p => p.enabled).length} Active Guardrails
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Singapore MAS FEAT, Veritas Consortium, India DPDP, Indonesia GR 71 &amp; I4C Digital Arrest Defense
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center bg-navy-950 border border-navy-750 rounded-xl p-0.5 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${activeTab === 'ALL' ? 'bg-navy-800 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            All Rules
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('FEAT')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${activeTab === 'FEAT' ? 'bg-teal-950 text-brand-teal font-bold border border-teal-800' : 'text-slate-400 hover:text-white'}`}
          >
            MAS FEAT
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('SOVEREIGNTY')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${activeTab === 'SOVEREIGNTY' ? 'bg-indigo-950 text-indigo-300 font-bold border border-indigo-800' : 'text-slate-400 hover:text-white'}`}
          >
            Data Sovereignty
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('COERCION')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${activeTab === 'COERCION' ? 'bg-rose-950 text-rose-300 font-bold border border-rose-800' : 'text-slate-400 hover:text-white'}`}
          >
            Anti-Extortion
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Policy List */}
        <div className="lg:col-span-7 space-y-2">
          {filteredPolicies.map((p) => {
            const isSelected = p.id === selectedPolicyId;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPolicyId(p.id)}
                className={`p-3.5 rounded-2xl border transition-all text-xs cursor-pointer ${
                  isSelected
                    ? 'bg-navy-800/90 border-brand-teal shadow-lg shadow-teal-950/30 ring-1 ring-brand-teal/40'
                    : 'bg-navy-950/70 border-navy-750 hover:bg-navy-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-[11px] font-bold text-brand-teal">
                      {p.id}
                    </span>
                    <span className="font-bold text-white text-xs truncate">
                      {p.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
                      p.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border-rose-800' : 'bg-amber-950 text-amber-300 border-amber-800'
                    }`}>
                      {p.severity}
                    </span>
                    
                    {/* Enable / Disable Switch */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePolicy(p.id);
                      }}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                        p.enabled ? 'bg-teal-600 justify-end' : 'bg-navy-750 justify-start'
                      }`}
                      aria-label={`Toggle ${p.name}`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed mb-2 font-sans">
                  {p.description}
                </p>

                <div className="flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-400 border-t border-navy-750/70 pt-2">
                  <span>Jurisdiction: <strong className="text-slate-200">{p.jurisdiction}</strong></span>
                  <span>Enforcement: <strong className="text-brand-teal">{p.enforcement}</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Policy Deep Dive & Veritas Architecture Explanation */}
        <div className="lg:col-span-5 space-y-3.5">
          <div className="p-4 rounded-2xl bg-navy-900/85 border border-navy-750 panel-base space-y-3.5 sticky top-20 shadow-xl">
            <div className="border-b border-navy-750 pb-2.5">
              <span className="text-[10px] font-mono uppercase text-brand-teal font-bold block mb-1">
                Policy Rule Specification &bull; {selectedPolicy.id}
              </span>
              <h3 className="text-sm font-bold text-white tracking-tight">
                {selectedPolicy.name}
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-750 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Governance Objective</span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {selectedPolicy.description}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-750 space-y-1">
                <span className="text-[10px] font-mono text-brand-teal uppercase block">Pipeline Enforcement Effect</span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {selectedPolicy.impactExplanation}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-750 space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Regulatory Standards &amp; Principles</span>
                <div className="space-y-1 text-[11px] text-slate-300 font-mono">
                  <div>&bull; MAS FEAT: Fairness, Ethics, Accountability, Transparency</div>
                  <div>&bull; MAS Veritas Consortium Methodology v2.0</div>
                  <div>&bull; Indonesia UU PDP No. 27/2022 &amp; PP 71/2019</div>
                  <div>&bull; I4C Cyber Crime Directives for Video Coercion</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-teal-950/40 border border-teal-800/60 text-[11px] text-teal-200 flex items-start gap-2">
                <Info className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                <span>
                  All guardrail policies execute deterministically and via Gemini 2.5 Flash with sub-second execution latency under the unified Google ADK pipeline.
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
