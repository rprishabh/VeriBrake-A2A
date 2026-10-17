from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field

class InterceptRequest(BaseModel):
    direction: Literal["OUTBOUND", "INBOUND"] = Field("OUTBOUND", description="Traffic inspection direction: OUTBOUND or INBOUND")
    jurisdiction: Optional[str] = Field("SG", description="Jurisdiction code: SG, ID, IN, MY, TH")
    customer_context: Optional[str] = Field("", description="Customer profile, account or transaction context")
    payload_text: Optional[str] = Field(None, description="Message draft or inbound transaction/chat transcript")
    
    # Backward compatibility with existing fields
    draft_message: Optional[str] = Field(None, description="Alias for payload_text")
    jurisdiction_route: Optional[str] = Field(None, description="Full jurisdiction route string e.g. 'ID -> SG'")
    target_dialect: Optional[str] = Field("English (Singapore Formal)", description="Target locale/dialect")
    source_agent_id: Optional[str] = Field("agent-bank-outbound-v1", description="ID of source autonomous AI agent")

    def get_effective_text(self) -> str:
        if self.payload_text is not None and self.payload_text.strip():
            return self.payload_text
        if self.draft_message is not None:
            return self.draft_message
        return ""

    def get_effective_route(self) -> str:
        if self.jurisdiction_route:
            return self.jurisdiction_route
        if self.jurisdiction:
            return self.jurisdiction
        return "SG Domestic"

class AirlockResult(BaseModel):
    sanitized_text: str
    redacted_entities_count: int
    classification_tier: str = Field("OFFICIAL", description="OFFICIAL | PROTECTED | SECRET")
    jurisdiction_policy: str
    redacted_tokens: List[str] = []
    latency_ms: float = 0.0

class FEATScores(BaseModel):
    fairness: int = Field(100, ge=0, le=100)
    ethics: int = Field(100, ge=0, le=100)
    accountability: int = Field(100, ge=0, le=100)
    transparency: int = Field(100, ge=0, le=100)

class DataSovereigntyStatus(BaseModel):
    classification_tier: str
    jurisdiction_lock: str
    cross_border_safe: bool

class Violation(BaseModel):
    category: str
    regulation_cited: str
    explanation: str

class AuditorResult(BaseModel):
    verdict: str = Field(..., description="APPROVED | AUTO_REWRITTEN | BLOCKED_ESCALATED")
    overall_risk_score: int = Field(..., ge=0, le=100)
    feat_scores: FEATScores
    data_sovereignty_status: DataSovereigntyStatus
    violations_detected: List[Violation] = []
    safe_rewritten_message: str
    human_escalation_required: bool
    model_used: str = "gemini-2.5-flash"
    latency_ms: float = 0.0

class RewriterResult(BaseModel):
    final_message: str
    action_taken: str = Field(..., description="PASSED | AUTO_REWRITTEN | CIRCUIT_BREAKER_TRIGGERED")
    circuit_breaker_active: bool = False
    webhook_sent: bool = False
    disclosure_included: bool = True
    latency_ms: float = 0.0

class CoercionAnalysis(BaseModel):
    verdict: Literal["TRANSACTION_CLEAN", "DYNAMIC_FRICTION_INJECTED", "CIRCUIT_BREAKER_FROZEN"]
    coercion_severity_score: int = Field(..., ge=0, le=100, description="0 to 100 severity index")
    psychological_markers: Dict[str, int] = Field(
        default_factory=lambda: {
            "authority_impersonation": 0,
            "manufactured_urgency": 0,
            "isolation_tactics": 0,
            "financial_liquidation": 0
        },
        description="Psychological coercion vector scores (0-100)"
    )
    threat_narrative_detected: str = Field(..., description="e.g. 'Digital Arrest - Fake Police Skype Call'")
    recommended_intervention: str = Field(..., description="Actionable de-escalation steps")
    emergency_contact_alert_payload: str = Field(..., description="Ready-to-dispatch SMS/WhatsApp SOS text")
    mule_account_risk: Literal["LOW", "MEDIUM", "CRITICAL"] = "LOW"
    latency_ms: float = 0.0
    model_used: str = "gemini-2.5-flash"
    cooldown_seconds: int = 120
    webhook_sent: bool = False

class InterceptResponse(BaseModel):
    log_id: str
    timestamp: str
    direction: Literal["OUTBOUND", "INBOUND"] = "OUTBOUND"
    jurisdiction_route: str
    target_dialect: str = "English"
    original_message: str
    customer_context: Optional[str] = ""
    airlock: AirlockResult
    
    # Outbound mode payload
    auditor: Optional[AuditorResult] = None
    rewriter: Optional[RewriterResult] = None
    
    # Inbound mode payload
    coercion: Optional[CoercionAnalysis] = None
    
    total_latency_ms: float
    resolved_status: Optional[str] = None  # None | "DISPATCHED_SAFE" | "PERMANENT_BLOCKED" | "UNFROZEN_BY_OFFICER"

class ResolveRequest(BaseModel):
    action: str = Field(..., description="APPROVE_REWRITE | CONFIRM_BLOCK | UNFREEZE_PAYMENT")
    officer_notes: Optional[str] = "Reviewed via VeriBrake A2A Command Center"

class ResolveResponse(BaseModel):
    success: bool
    log_id: str
    resolved_status: str
    message: str
