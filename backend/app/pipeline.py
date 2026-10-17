import time
import uuid
import datetime
from typing import Dict, Any
from .schemas import InterceptRequest, InterceptResponse
from .agents import airlock_agent, auditor_agent, rewriter_agent, coercion_agent
from .storage import storage

class VeriBrakePipeline:
    """
    Unified Bidirectional Enterprise Risk & Compliance Mesh:
    
    1. MODE 1 (OUTBOUND): Enterprise AI Governance (MAS FEAT / Veritas)
       - Agent 1: Data Airlock (Sovereignty & PII Redaction)
       - Agent 2: MAS FEAT & Hallucination Auditor (Gemini 2.5 Flash + Ground Truth)
       - Agent 3: Vernacular Auto-Rewriter & Circuit Breaker
       
    2. MODE 2 (INBOUND): Psychological Coercion & Fraud Defense (Digital Arrest Interceptor)
       - Agent 1: Data Airlock (Scrubbing incoming transcripts & sender credentials)
       - Agent Coercion: Extortion vectors, Digital Arrest detection, Mule risk & SOS alerts
    """

    def execute(self, req: InterceptRequest) -> InterceptResponse:
        total_start = time.perf_counter()
        
        prefix = "VB-IN" if req.direction == "INBOUND" else "VB-OUT"
        log_id = f"{prefix}-{datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()
        
        effective_text = req.get_effective_text()
        effective_route = req.get_effective_route()

        # Step 1: Agent 1 (Data Airlock) applies to BOTH directions
        airlock_res = airlock_agent.process(
            draft_message=effective_text,
            jurisdiction_route=effective_route
        )

        if req.direction == "INBOUND":
            # Mode 2: Inbound Coercion & Digital Arrest Defense
            coercion_res = coercion_agent.analyze(
                airlock_result=airlock_res,
                jurisdiction=req.jurisdiction or "IN",
                customer_context=req.customer_context or ""
            )

            total_elapsed_ms = (time.perf_counter() - total_start) * 1000.0

            response = InterceptResponse(
                log_id=log_id,
                timestamp=timestamp,
                direction="INBOUND",
                jurisdiction_route=effective_route,
                target_dialect=req.target_dialect or "English / Vernacular",
                original_message=effective_text,
                customer_context=req.customer_context or "",
                airlock=airlock_res,
                coercion=coercion_res,
                total_latency_ms=round(total_elapsed_ms, 2),
                resolved_status=None
            )
        else:
            # Mode 1: Outbound AI Agent Governance (MAS FEAT / Veritas)
            auditor_res = auditor_agent.audit(
                airlock_result=airlock_res,
                jurisdiction_route=effective_route,
                target_dialect=req.target_dialect or "English (Singapore Formal)",
                customer_context=req.customer_context or ""
            )

            rewriter_res = rewriter_agent.process(
                auditor_result=auditor_res,
                airlock_result=airlock_res,
                log_id=log_id,
                jurisdiction_route=effective_route
            )

            total_elapsed_ms = (time.perf_counter() - total_start) * 1000.0

            response = InterceptResponse(
                log_id=log_id,
                timestamp=timestamp,
                direction="OUTBOUND",
                jurisdiction_route=effective_route,
                target_dialect=req.target_dialect or "English (Singapore Formal)",
                original_message=effective_text,
                customer_context=req.customer_context or "",
                airlock=airlock_res,
                auditor=auditor_res,
                rewriter=rewriter_res,
                total_latency_ms=round(total_elapsed_ms, 2),
                resolved_status=None
            )

        # Save to persistent audit trail (SQLite / Google Cloud Firestore)
        storage.save_intercept(response.model_dump())

        return response

pipeline = VeriBrakePipeline()
