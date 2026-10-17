import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LeftPane from './components/LeftPane';
import CenterPane from './components/CenterPane';
import RightPane from './components/RightPane';
import A2ACardModal from './components/A2ACardModal';

export default function App() {
  const [activeMode, setActiveMode] = useState('OUTBOUND'); // 'OUTBOUND' | 'INBOUND'
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState('');
  
  const [formData, setFormData] = useState({
    jurisdiction_route: 'ID -> SG',
    target_dialect: 'Bahasa Indonesia / English (Bilingual)',
    customer_context: 'PT Nusantara Jaya Sentosa (NIK: 3171012803890005)',
    draft_message: '',
    payload_text: '',
    payment_channel: 'UPI Transfer - ₹5,00,000'
  });

  const [interceptResult, setInterceptResult] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [kpis, setKpis] = useState({
    total_intercepts: 0,
    hallucinations_blocked: 0,
    pii_tokens_redacted: 0,
    avg_latency_ms: 0,
    outbound: {
      outbound_ai_checks: 0,
      mas_violations_blocked: 0,
      avg_latency_ms: 0
    },
    inbound: {
      active_transits_protected: 0,
      coercion_interceptions: 0,
      mule_freezes_triggered: 0
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [isA2AModalOpen, setIsA2AModalOpen] = useState(false);
  const [agentCardData, setAgentCardData] = useState(null);

  // Fetch initial telemetry, scenarios and agent card
  const fetchAllData = async () => {
    setIsRefreshing(true);
    try {
      const [scenariosRes, kpisRes, logsRes, a2aRes] = await Promise.allSettled([
        fetch('/api/v1/scenarios').then(r => r.json()),
        fetch('/api/v1/kpis').then(r => r.json()),
        fetch('/api/v1/audit-logs').then(r => r.json()),
        fetch('/.well-known/agent.json').then(r => r.json())
      ]);

      if (scenariosRes.status === 'fulfilled' && Array.isArray(scenariosRes.value)) {
        setScenarios(scenariosRes.value);
        if (!selectedScenarioId && scenariosRes.value.length > 0) {
          const first = scenariosRes.value[0];
          setSelectedScenarioId(first.id);
          setActiveMode(first.mode || 'OUTBOUND');
          setFormData({
            jurisdiction_route: first.jurisdiction_route,
            target_dialect: first.target_dialect,
            customer_context: first.customer_context,
            draft_message: first.draft_message,
            payload_text: first.payload_text || first.draft_message,
            payment_channel: 'UPI Transfer - ₹5,00,000'
          });
        }
      }

      if (kpisRes.status === 'fulfilled') {
        setKpis(kpisRes.value);
      }

      if (logsRes.status === 'fulfilled' && Array.isArray(logsRes.value)) {
        setAuditLogs(logsRes.value);
        if (!interceptResult && logsRes.value.length > 0) {
          setInterceptResult(logsRes.value[0]);
          if (logsRes.value[0].direction) {
            setActiveMode(logsRes.value[0].direction);
          }
        }
      }

      if (a2aRes.status === 'fulfilled') {
        setAgentCardData(a2aRes.value);
      }
    } catch (err) {
      console.error("Error fetching initial telemetry:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSelectScenario = (sc) => {
    setSelectedScenarioId(sc.id);
    if (sc.mode) {
      setActiveMode(sc.mode);
    }
    setFormData({
      jurisdiction_route: sc.jurisdiction_route,
      target_dialect: sc.target_dialect,
      customer_context: sc.customer_context,
      draft_message: sc.draft_message,
      payload_text: sc.payload_text || sc.draft_message,
      payment_channel: sc.mode === 'INBOUND' ? 'Instant Wire / UPI Transfer' : 'Commercial Facility'
    });
  };

  const handleRunInterceptor = async () => {
    const textToSend = formData.payload_text || formData.draft_message || '';
    if (!textToSend.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/v1/intercept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          direction: activeMode,
          jurisdiction: formData.jurisdiction_route,
          jurisdiction_route: formData.jurisdiction_route,
          target_dialect: formData.target_dialect,
          customer_context: formData.customer_context,
          payload_text: textToSend,
          draft_message: textToSend
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setInterceptResult(data);

      // Re-fetch KPIs and Audit Logs
      const [kpiRes, logsRes] = await Promise.all([
        fetch('/api/v1/kpis').then(r => r.json()),
        fetch('/api/v1/audit-logs').then(r => r.json())
      ]);
      setKpis(kpiRes);
      setAuditLogs(logsRes);
    } catch (err) {
      console.error("Failed to run interceptor:", err);
      alert(`Interception request failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolveLog = async (logId, action) => {
    if (!logId) return;
    setIsResolving(true);

    try {
      const res = await fetch(`/api/v1/audit-logs/${logId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          officer_notes: `Resolved as ${action} via VeriBrake A2A Command Center`
        })
      });

      if (!res.ok) {
        throw new Error(`Resolve failed: ${res.statusText}`);
      }

      const result = await res.json();

      // Update current intercept result in state
      if (interceptResult && interceptResult.log_id === logId) {
        setInterceptResult({
          ...interceptResult,
          resolved_status: result.resolved_status
        });
      }

      // Refresh audit logs
      const updatedLogs = await fetch('/api/v1/audit-logs').then(r => r.json());
      setAuditLogs(updatedLogs);
    } catch (err) {
      console.error("Failed to resolve audit log:", err);
      alert(`Resolution error: ${err.message}`);
    } finally {
      setIsResolving(false);
    }
  };

  const handleSelectAuditLog = (log) => {
    setInterceptResult(log);
    if (log.direction) {
      setActiveMode(log.direction);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* Top Header with Mode Switcher */}
      <Header
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        kpis={kpis}
        onOpenA2ACard={() => setIsA2AModalOpen(true)}
        onRefreshData={fetchAllData}
        isRefreshing={isRefreshing}
      />

      {/* Main 3-Pane Command Center Workspace */}
      <main className="flex-1 max-w-[1850px] w-full mx-auto p-3 sm:p-4 lg:p-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full min-h-[calc(100vh-130px)]">
          
          {/* LEFT PANE (3.5 cols on large displays) */}
          <div className="lg:col-span-4 xl:col-span-3.5 h-[680px] lg:h-auto">
            <LeftPane
              activeMode={activeMode}
              setActiveMode={setActiveMode}
              scenarios={scenarios}
              selectedScenarioId={selectedScenarioId}
              onSelectScenario={handleSelectScenario}
              formData={formData}
              setFormData={setFormData}
              onRunInterceptor={handleRunInterceptor}
              isLoading={isLoading}
            />
          </div>

          {/* CENTER PANE (4.5 cols on large displays) */}
          <div className="lg:col-span-4 xl:col-span-4.5 h-[680px] lg:h-auto">
            <CenterPane
              activeMode={activeMode}
              interceptResult={interceptResult}
              isExecuting={isLoading}
            />
          </div>

          {/* RIGHT PANE (4 cols on large displays) */}
          <div className="lg:col-span-4 xl:col-span-4 h-[680px] lg:h-auto">
            <RightPane
              activeMode={activeMode}
              interceptResult={interceptResult}
              auditLogs={auditLogs}
              onResolveLog={handleResolveLog}
              onSelectAuditLog={handleSelectAuditLog}
              isResolving={isResolving}
            />
          </div>

        </div>
      </main>

      {/* A2A Protocol Agent Card Modal */}
      <A2ACardModal
        isOpen={isA2AModalOpen}
        onClose={() => setIsA2AModalOpen(false)}
        agentCardData={agentCardData}
      />
    </div>
  );
}
