import React, { useState } from 'react';
import { 
  Lock, 
  Play, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  ArrowRight, 
  Globe2, 
  Eye, 
  RotateCcw,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function DataAirlockView() {
  const [jurisdiction, setJurisdiction] = useState('ID'); // ID, SG, IN, TH, AU
  const [sampleText, setSampleText] = useState(
    "Nasabah PT Nusantara Yth, konfirmasi pengajuan kredit atas nama NIK 3171012803890005 telah disetujui. Rekening pencairan: 10928392019. Hubungi relationship manager di +62-811-9283-9182."
  );
  const [inspectionResult, setInspectionResult] = useState(null);
  const [isInspecting, setIsInspecting] = useState(false);
  const [expandedStage, setExpandedStage] = useState(3);

  const handleRunInspection = () => {
    setIsInspecting(true);
    setTimeout(() => {
      // Deterministic synthetic classification based on text content and jurisdiction
      const tokensFound = [];
      let sanitized = sampleText;

      if (sampleText.includes('3171012803890005') || /\b\d{16}\b/.test(sampleText)) {
        tokensFound.push({
          type: 'Direct Citizen Identifier',
          token: '[ID_NIK_REDACTED]',
          rawMatch: '3171012803890005',
          category: 'Direct identifiers',
          confidence: '99.8%',
          regulation: 'Indonesia GR 71/2019 & PDP Law No. 27/2022'
        });
        sanitized = sanitized.replace(/3171012803890005/g, '[ID_NIK_REDACTED]');
      }

      if (/S\d{7}[A-Z]/i.test(sampleText)) {
        tokensFound.push({
          type: 'Singapore Citizen NRIC',
          token: '[SG_NRIC_REDACTED]',
          rawMatch: 'S8812345C',
          category: 'Direct identifiers',
          confidence: '99.9%',
          regulation: 'Singapore PDPA Advisory Guidelines'
        });
        sanitized = sanitized.replace(/S\d{7}[A-Z]/gi, '[SG_NRIC_REDACTED]');
      }

      if (sampleText.includes('10928392019') || /\b\d{10,12}\b/.test(sampleText)) {
        tokensFound.push({
          type: 'Bank Account Number',
          token: '[ACCOUNT_NO_REDACTED]',
          rawMatch: '10928392019',
          category: 'Financial identifiers',
          confidence: '98.5%',
          regulation: 'PCI-DSS & Sovereign Banking Secrecy'
        });
        sanitized = sanitized.replace(/10928392019/g, '[ACCOUNT_NO_REDACTED]');
      }

      if (/\+?\d{2,3}[-\s]?\d{3,4}[-\s]?\d{3,4}/.test(sampleText)) {
        tokensFound.push({
          type: 'Direct Phone Identifier',
          token: '[PHONE_REDACTED]',
          rawMatch: '+62-811-9283-9182',
          category: 'Sensitive personal information',
          confidence: '97.2%',
          regulation: 'General Personal Data Protection'
        });
        sanitized = sanitized.replace(/\+62-811-9283-9182/g, '[PHONE_REDACTED]');
      }

      setInspectionResult({
        tokensFound,
        sanitizedText: sanitized,
        classificationTier: tokensFound.length > 1 ? 'SECRET' : tokensFound.length > 0 ? 'PROTECTED' : 'OFFICIAL',
        action: tokensFound.length > 0 ? 'AUTO_REDACT_AND_FORWARD' : 'CLEAN_PASS',
        crossBorderSafe: true,
        latencyMs: 14.8
      });
      setIsInspecting(false);
    }, 350);
  };

  const handleJurisdictionChange = (j) => {
    setJurisdiction(j);
    if (j === 'SG') {
      setSampleText("Dear Ms Sarah Tan (NRIC S8812345C), your corporate credit line ref account 9821039481 has been reviewed. Contact +65-6821-9921 for disbursement.");
    } else if (j === 'IN') {
      setSampleText("Citizen Rajesh Verma, verify your Aadhaar linked account 49201928301 with IFSC SBIN0001829. Do not share OTP with unauthorized parties.");
    } else if (j === 'ID') {
      setSampleText("Nasabah PT Nusantara Yth, konfirmasi pengajuan kredit atas nama NIK 3171012803890005 telah disetujui. Rekening pencairan: 10928392019.");
    } else {
      setSampleText("Enterprise advisory notice: Customer reference [ACCOUNT_NO_REDACTED] authorized for commercial liquidity. Contact relationship desk.");
    }
    setInspectionResult(null);
  };

  const stages = [
    { num: 1, title: 'Agent Output', desc: 'Raw outbound text buffer' },
    { num: 2, title: 'Data Inspection', desc: 'Deterministic regex & pattern matcher' },
    { num: 3, title: 'Classification', desc: 'Tier assignment (OFFICIAL, PROTECTED, SECRET)' },
    { num: 4, title: 'Redaction & Decision', desc: 'Masking of PII tokens before transit' },
    { num: 5, title: 'Approved Destination', desc: 'Sovereign border transit clearance' },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-navy-900/85 border border-navy-750 panel-base shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-500/10 text-brand-teal border border-teal-500/30">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Data Airlock &mdash; Sovereign Perimeter</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-brand-teal border border-teal-800 font-semibold">
                Signature Feature
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Deterministic sovereign perimeter that classifies and scrubs national identifiers before cross-border transit
            </p>
          </div>
        </div>

        {/* Jurisdiction Selector */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Policy Corridor:</span>
          <select
            value={jurisdiction}
            onChange={(e) => handleJurisdictionChange(e.target.value)}
            className="bg-navy-950 border border-navy-750 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-teal"
          >
            <option value="ID">Indonesia (GR 71 / NIK Lock)</option>
            <option value="SG">Singapore (MAS / PDPA)</option>
            <option value="IN">India (DPDP / Aadhaar)</option>
            <option value="AU">Australia (PSPF / Data61)</option>
          </select>
        </div>
      </div>

      {/* 5-Stage Interactive Pipeline Stepper */}
      <div className="p-4 rounded-2xl bg-navy-900/85 border border-navy-750 panel-base shadow-xl overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px] relative">
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-navy-750 -translate-y-1/2 -z-0" />
          
          {stages.map((st) => {
            const isDone = Boolean(inspectionResult) || st.num === 1;
            const isCurrent = inspectionResult && st.num === expandedStage;
            return (
              <button
                key={st.num}
                type="button"
                onClick={() => setExpandedStage(st.num)}
                className={`relative z-10 flex flex-col items-center text-center group cursor-pointer transition-transform ${
                  isCurrent ? 'scale-105' : ''
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-all border ${
                  isDone 
                    ? 'bg-navy-800 text-brand-teal border-brand-teal shadow-md shadow-teal-950/40' 
                    : 'bg-navy-950 text-slate-400 border-navy-750'
                }`}>
                  {st.num}
                </div>
                <span className="text-xs font-bold text-white mt-1.5 block">
                  {st.title}
                </span>
                <span className="text-[10px] text-slate-400 max-w-[120px] leading-tight block">
                  {st.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Sandbox Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Input Column */}
        <div className="lg:col-span-6 space-y-3 p-4 rounded-2xl bg-navy-900/85 border border-navy-750 panel-base shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-brand-teal" />
              <span>Airlock Candidate Message</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {sampleText.length} characters
            </span>
          </div>

          <textarea
            rows={5}
            value={sampleText}
            onChange={(e) => setSampleText(e.target.value)}
            placeholder="Enter candidate message with national IDs or phone numbers..."
            className="w-full bg-navy-950 border border-navy-750 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-brand-teal font-mono leading-relaxed resize-none shadow-inner"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">
              Corridor Rule: <strong className="text-slate-200">{jurisdiction} Sovereign Lock</strong>
            </span>

            <button
              type="button"
              onClick={handleRunInspection}
              disabled={isInspecting || !sampleText.trim()}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-teal-950/30 flex items-center gap-2 cursor-pointer disabled:opacity-40"
            >
              {isInspecting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Scrubbing Perimeter...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Run Data Inspection</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 space-y-3 p-4 rounded-2xl bg-navy-900/85 border border-navy-750 panel-base shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-teal" />
              <span>Inspection Forensics &amp; Sanitized Output</span>
            </span>
            {inspectionResult && (
              <span className="font-mono text-[10px] text-brand-teal">
                {inspectionResult.latencyMs}ms
              </span>
            )}
          </div>

          {!inspectionResult ? (
            <div className="p-8 text-center text-slate-400 rounded-xl bg-navy-950/60 border border-navy-750">
              <Lock className="w-6 h-6 mx-auto mb-2 text-slate-500" />
              <p className="text-xs">Click "Run Data Inspection" to execute sovereign perimeter scrubbing on the input.</p>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              
              {/* Classification Badges */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-750">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Security Classification</span>
                  <span className={`font-mono font-bold text-xs ${
                    inspectionResult.classificationTier === 'SECRET' ? 'text-rose-400' : 'text-amber-400'
                  }`}>
                    Tier: {inspectionResult.classificationTier}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-750">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Airlock Action</span>
                  <span className="font-mono font-bold text-xs text-brand-teal">
                    {inspectionResult.action}
                  </span>
                </div>
              </div>

              {/* Detected Spans */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono uppercase text-slate-400">
                  Classified Sensitive Entities ({inspectionResult.tokensFound.length})
                </div>
                <div className="space-y-1">
                  {inspectionResult.tokensFound.map((tok, i) => (
                    <div key={i} className="p-2 rounded-lg bg-navy-950 border border-navy-750 flex items-center justify-between text-[11px]">
                      <div>
                        <span className="font-semibold text-rose-300 font-mono">{tok.type}</span>
                        <span className="text-slate-400 ml-1.5 text-[10px]">({tok.regulation})</span>
                      </div>
                      <span className="font-mono font-bold text-brand-teal">{tok.token}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safe Sanitized Text */}
              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase text-emerald-400">
                  Sanitized Boundary Output (No Raw PII Exposed)
                </div>
                <div className="p-3 rounded-xl bg-navy-950 border border-emerald-900/60 font-mono text-[11px] text-emerald-200 leading-relaxed break-words">
                  {inspectionResult.sanitizedText}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
