import os
import json
import logging
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load local environment variables if .env exists
load_dotenv()

from .schemas import InterceptRequest, InterceptResponse, ResolveRequest, ResolveResponse
from .pipeline import pipeline
from .storage import storage

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("veribrake.main")

app = FastAPI(
    title="VeriBrake A2A",
    description="Unified Bidirectional Enterprise Risk & Compliance Mesh (MAS FEAT AI Governance & Inbound Digital Arrest Defense)",
    version="2.0.0"
)

# Enable Full CORS for Cloud Run + Firebase Hosting integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# -------------------------------------------------------------
# A2A Protocol Agent Card (/.well-known/agent.json)
# -------------------------------------------------------------
@app.get("/.well-known/agent.json")
def get_a2a_agent_card() -> Dict[str, Any]:
    """
    Official Agent2Agent (A2A) Protocol Agent Card.
    Defines VeriBrake A2A's bidirectional autonomous guardrail mesh capabilities, schemas,
    and compliance boundaries for autonomous multi-agent interoperability.
    """
    return {
        "$schema": "https://a2a-protocol.org/schemas/v1/agent-card.json",
        "protocol_version": "0.4.0",
        "agent_id": "veribrake-japac-bidirectional-guardrail-mesh",
        "name": "VeriBrake A2A",
        "display_name": "VeriBrake A2A: Unified Enterprise Risk & Compliance Mesh",
        "description": "Enterprise-grade bidirectional autonomous guardrail proxy that handles both Outbound Enterprise AI Governance (MAS FEAT & Veritas, Cross-Border PII Airlock) and Inbound Psychological Coercion & Fraud Defense (Digital Arrest & Cyber-Extortion Interception).",
        "provider": {
            "name": "Google Cloud AI Builder Cup (JAPAC)",
            "organization": "VeriBrake Autonomous Governance Labs",
            "cloud_platform": "Google Cloud Run & Gemini 2.5 Flash",
            "license": "Apache-2.0"
        },
        "capabilities": {
            "autonomous_interception": True,
            "bidirectional_inspection": True,
            "governance.mas_feat_auditing": True,
            "fraud.psychological_coercion_interception": True,
            "streaming": False,
            "cross_border_airlock": True,
            "vernacular_localization": True,
            "human_in_the_loop_escalation": True,
            "circuit_breaker": True,
            "dynamic_friction_injection": True
        },
        "supported_frameworks": [
            {
                "id": "MAS_FEAT",
                "name": "Monetary Authority of Singapore (MAS) FEAT Principles",
                "pillars": ["Fairness", "Ethics", "Accountability", "Transparency"]
            },
            {
                "id": "MAS_VERITAS",
                "name": "MAS Veritas Consortium Responsible AI Metrics",
                "version": "Phase 2"
            },
            {
                "id": "I4C_DIGITAL_ARREST",
                "name": "Indian Cyber Crime Coordination Centre (I4C) & RBI Digital Arrest Defense Directives",
                "scope": "Inbound Video Call Extortion, Escrow Coercion & Urgent Fund Liquidation"
            },
            {
                "id": "ID_GR71",
                "name": "Indonesia Government Regulation No. 71/2019 & PDP Law No. 27/2022",
                "scope": "Data Residency and NIK Identification Protection"
            },
            {
                "id": "IN_DPDP",
                "name": "India Digital Personal Data Protection Act 2023",
                "scope": "Aadhaar Masking and Explicit Consent Architecture"
            },
            {
                "id": "KR_PIPA",
                "name": "South Korea Personal Information Protection Act (PIPA)",
                "scope": "Resident Registration Number (RRN) Sovereign Lock"
            },
            {
                "id": "AU_AIRLOCK",
                "name": "Australian PSPF & Data61 Airlock Framework",
                "tiers": ["OFFICIAL", "PROTECTED", "SECRET"]
            }
        ],
        "services": [
            {
                "name": "bidirectional_intercept",
                "route": "/api/v1/intercept",
                "method": "POST",
                "description": "Inspects Outbound AI draft messages or Inbound payment transcripts, applies sovereign airlock scrubbing, evaluates compliance / coercion, and enforces circuit breakers."
            },
            {
                "name": "immutable_audit_trail",
                "route": "/api/v1/audit-logs",
                "method": "GET",
                "description": "Queries historical telemetry and compliance logs across Outbound and Inbound vectors."
            },
            {
                "name": "hitl_resolution",
                "route": "/api/v1/audit-logs/{log_id}/resolve",
                "method": "POST",
                "description": "Permits compliance officers to approve safe rewrites, permanently quarantine dangerous AI outputs, or release frozen transactions."
            }
        ],
        "runtime_telemetry": {
            "orchestrator": "Google Agent Development Kit (ADK)",
            "llm_engine": "Gemini 2.5 Flash (fallback to Gemini 2.0 Flash & Deterministic MAS Veritas / Coercion Engine)",
            "persistence": "Dual-mode Cloud Firestore / SQLite",
            "latency_target_ms": "< 400ms"
        }
    }

# -------------------------------------------------------------
# Core API Endpoints
# -------------------------------------------------------------
@app.get("/")
def root():
    return {
        "service": "VeriBrake A2A",
        "tagline": "Unified Bidirectional Enterprise Risk & Compliance Mesh",
        "modes": [
            "MODE 1: OUTBOUND_GOVERNANCE (MAS FEAT / Veritas)",
            "MODE 2: INBOUND_COERCION (Digital Arrest & Cyber-Extortion Defense)"
        ],
        "status": "ONLINE",
        "agent_card": "/.well-known/agent.json",
        "docs": "/docs"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "firestore_connected": storage.use_firestore,
        "active_gemini_key": bool(os.getenv("GEMINI_API_KEY") and not os.getenv("GEMINI_API_KEY", "").startswith("your_")),
        "default_model": "gemini-2.5-flash",
        "supported_modes": ["OUTBOUND_GOVERNANCE", "INBOUND_COERCION"]
    }

@app.post("/api/v1/intercept", response_model=InterceptResponse)
def intercept_message(request: InterceptRequest):
    """
    Executes bidirectional inspection:
    - If OUTBOUND: Data Airlock -> MAS FEAT Auditor -> Vernacular Rewriter
    - If INBOUND: Data Airlock -> Inbound Coercion & Digital Arrest Interceptor -> Friction Engine
    """
    try:
        response = pipeline.execute(request)
        return response
    except Exception as e:
        logger.error(f"Error during interception pipeline: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"VeriBrake pipeline error: {str(e)}"
        )

@app.get("/api/v1/audit-logs")
def get_audit_logs(
    limit: int = 30,
    direction: Optional[str] = Query(None, description="Filter by OUTBOUND or INBOUND")
) -> List[Dict[str, Any]]:
    """Returns intercepted payloads with complete telemetry, with optional direction filter"""
    return storage.get_audit_logs(limit=limit, direction=direction)

@app.post("/api/v1/audit-logs/{log_id}/resolve", response_model=ResolveResponse)
def resolve_audit_log(log_id: str, payload: ResolveRequest):
    """
    Human-in-the-Loop (HITL) compliance action:
    Allows officer to 'Approve Safe Rewrite', 'Confirm Block', or 'Unfreeze Payment'.
    """
    valid_actions = {
        "APPROVE_REWRITE": "DISPATCHED_SAFE",
        "CONFIRM_BLOCK": "PERMANENT_BLOCKED",
        "UNFREEZE_PAYMENT": "UNFROZEN_BY_OFFICER"
    }
    
    if payload.action not in valid_actions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid action. Must be 'APPROVE_REWRITE', 'CONFIRM_BLOCK', or 'UNFREEZE_PAYMENT'"
        )

    new_status = valid_actions[payload.action]
    updated = storage.update_audit_log_status(log_id, new_status, payload.officer_notes or "")
    
    if not updated:
        raise HTTPException(status_code=404, detail=f"Audit log ID {log_id} not found")

    return ResolveResponse(
        success=True,
        log_id=log_id,
        resolved_status=new_status,
        message=f"Log {log_id} successfully updated to {new_status} by Compliance Officer."
    )

@app.get("/api/v1/kpis")
def get_kpis() -> Dict[str, Any]:
    """Returns aggregated real-time dashboard KPIs for both Outbound and Inbound modes"""
    return storage.get_kpis()

@app.get("/api/v1/scenarios")
def get_scenarios() -> List[Dict[str, Any]]:
    """Returns the 5 preset benchmark scenarios for one-click testing"""
    scenarios_path = os.path.join(BASE_DIR, "data", "scenarios.json")
    try:
        with open(scenarios_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Failed to read scenarios: {e}")
        return []

@app.get("/api/v1/ground-truth")
def get_ground_truth() -> Dict[str, Any]:
    """Returns official bank products and regulatory ground truth"""
    gt_path = os.path.join(BASE_DIR, "data", "ground_truth.json")
    try:
        with open(gt_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        return {}
