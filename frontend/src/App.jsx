import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LeftPane from './components/LeftPane';
import CenterPane from './components/CenterPane';
import RightPane from './components/RightPane';
import A2ACardModal from './components/A2ACardModal';
import RequestDetailDrawer from './components/views/RequestDetailDrawer';
import AgentTrafficView from './components/views/AgentTrafficView';
import ReviewQueueView from './components/views/ReviewQueueView';
import PolicyGuardrailsView from './components/views/PolicyGuardrailsView';
import DataAirlockView from './components/views/DataAirlockView';
import AuditTrailView from './components/views/AuditTrailView';
import AnalyticsView from './components/views/AnalyticsView';
import IntegrationsView from './components/views/IntegrationsView';
import SettingsView from './components/views/SettingsView';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export default function App() {
  const [activeMode, setActiveMode] = useState('OUTBOUND'); // 'OUTBOUND' | 'INBOUND'
  const [currentView, setCurrentView] = useState('command_center');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
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
  const [selectedDrawerRecord, setSelectedDrawerRecord] = useState(null);

  // Fetch initial telemetry, scenarios and agent card
  const fetchAllData = async () => {
    setIsRefreshing(true);
    try {
      const [scenariosRes, kpisRes, logsRes, a2aRes] = await Promise.allSettled([
        fetch(`${API_BASE}/api/v1/scenarios`).then(r => r.json()),
        fetch(`${API_BASE}/api/v1/kpis`).then(r => r.json()),
        fetch(`${API_BASE}/api/v1/audit-logs`).then(r => r.json()),
        fetch(`${API_BASE}/.well-known/agent.json`).then(r => r.json())
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
      const res = await fetch(`${API_BASE}/api/v1/intercept`, {
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
        fetch(`${API_BASE}/api/v1/kpis`).then(r => r.json()),
        fetch(`${API_BASE}/api/v1/audit-logs`).then(r => r.json())
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
      const res = await fetch(`${API_BASE}/api/v1/audit-logs/${logId}/resolve`, {
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

      // Update drawer record if open
      if (selectedDrawerRecord && selectedDrawerRecord.log_id === logId) {
        setSelectedDrawerRecord({
          ...selectedDrawerRecord,
          resolved_status: result.resolved_status
        });
      }

      // Refresh audit logs and KPIs
      const [updatedLogs, updatedKpis] = await Promise.all([
        fetch(`${API_BASE}/api/v1/audit-logs`).then(r => r.json()),
        fetch(`${API_BASE}/api/v1/kpis`).then(r => r.json())
      ]);
      setAuditLogs(updatedLogs);
      setKpis(updatedKpis);
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

  const handleLoadIntoCockpit = (log) => {
    setInterceptResult(log);
    if (log.direction) {
      setActiveMode(log.direction);
    }
    setFormData({
      jurisdiction_route: log.jurisdiction_route || 'ID -> SG',
      target_dialect: log.target_dialect || 'English',
      customer_context: log.customer_context || '',
      draft_message: log.original_message || '',
      payload_text: log.original_message || '',
      payment_channel: log.direction === 'INBOUND' ? 'Instant Wire / UPI Transfer' : 'Commercial Facility'
    });
    setCurrentView('command_center');
  };

  const pendingReviewsCount = auditLogs.filter(
    l => (l.verdict === 'BLOCKED_ESCALATED' || l.verdict === 'CIRCUIT_BREAKER_FROZEN') && !l.resolved_status
  ).length;

  return (
    <div className="min-h-screen flex bg-navy-950 text-slate-100 font-sans selection:bg-brand-teal/20 selection:text-brand-teal">
      
      {/* Persistent / Responsive Left Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        pendingReviewsCount={pendingReviewsCount}
        isMobileOpen={isMobileNavOpen}
        setIsMobileOpen={setIsMobileNavOpen}
      />

      {/* Main Execution View Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <Header
          activeMode={activeMode}
          setActiveMode={setActiveMode}
          kpis={kpis}
          onOpenA2ACard={() => setIsA2AModalOpen(true)}
          onRefreshData={fetchAllData}
          isRefreshing={isRefreshing}
          currentView={currentView}
          setCurrentView={setCurrentView}
          isMobileNavOpen={isMobileNavOpen}
          setIsMobileNavOpen={setIsMobileNavOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Dynamic View Container */}
        <main className="flex-1 max-w-[1920px] w-full mx-auto p-3 sm:p-4 lg:p-5 overflow-y-auto">
          
          {/* 1. COMMAND CENTER (PRIMARY 3-PANE COCKPIT) */}
          {currentView === 'command_center' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full min-h-[calc(100vh-125px)]">
              
              {/* LANE 1: INPUT COCKPIT (4 cols on large displays) */}
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

              {/* LANE 2: INSPECTION TELEMETRY (4.5 cols on large displays) */}
              <div className="lg:col-span-4 xl:col-span-4.5 h-[680px] lg:h-auto">
                <CenterPane
                  activeMode={activeMode}
                  interceptResult={interceptResult}
                  isExecuting={isLoading}
                />
              </div>

              {/* LANE 3: DECISION & AUDIT (4 cols on large displays) */}
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
          )}

          {/* 2. AGENT TRAFFIC VIEW */}
          {currentView === 'traffic' && (
            <AgentTrafficView
              auditLogs={auditLogs}
              onSelectRequest={(item) => setSelectedDrawerRecord(item)}
              onLoadIntoCockpit={handleLoadIntoCockpit}
            />
          )}

          {/* 3. REVIEW QUEUE VIEW */}
          {currentView === 'reviews' && (
            <ReviewQueueView
              auditLogs={auditLogs}
              onResolveLog={handleResolveLog}
              isResolving={isResolving}
              onLoadIntoCockpit={handleLoadIntoCockpit}
            />
          )}

          {/* 4. POLICY & GUARDRAILS MATRIX */}
          {currentView === 'policies' && (
            <PolicyGuardrailsView />
          )}

          {/* 5. DATA AIRLOCK LAB */}
          {currentView === 'airlock' && (
            <DataAirlockView />
          )}

          {/* 6. AUDIT TRAIL VIEW */}
          {currentView === 'audit' && (
            <AuditTrailView
              auditLogs={auditLogs}
              onSelectAuditLog={(item) => setSelectedDrawerRecord(item)}
              onLoadIntoCockpit={handleLoadIntoCockpit}
            />
          )}

          {/* 7. RISK INTELLIGENCE ANALYTICS */}
          {currentView === 'analytics' && (
            <AnalyticsView
              auditLogs={auditLogs}
              kpis={kpis}
            />
          )}

          {/* 8. INTEGRATIONS & A2A SPEC */}
          {currentView === 'integrations' && (
            <IntegrationsView
              onOpenA2ACard={() => setIsA2AModalOpen(true)}
              agentCardData={agentCardData}
            />
          )}

          {/* 9. GOVERNANCE SETTINGS */}
          {currentView === 'settings' && (
            <SettingsView />
          )}

        </main>
      </div>

      {/* A2A Protocol Agent Card Modal */}
      <A2ACardModal
        isOpen={isA2AModalOpen}
        onClose={() => setIsA2AModalOpen(false)}
        agentCardData={agentCardData}
      />

      {/* Telemetry Deep-Dive Record Drawer */}
      <RequestDetailDrawer
        isOpen={Boolean(selectedDrawerRecord)}
        onClose={() => setSelectedDrawerRecord(null)}
        requestData={selectedDrawerRecord}
        onLoadIntoCockpit={handleLoadIntoCockpit}
        onResolveLog={handleResolveLog}
        isResolving={isResolving}
      />
    </div>
  );
}

