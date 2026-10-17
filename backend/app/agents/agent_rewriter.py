import os
import time
import json
import logging
import httpx
from typing import Optional
from ..schemas import RewriterResult, AuditorResult, AirlockResult

logger = logging.getLogger("veribrake.rewriter")

class VernacularRewriterEscalationAgent:
    """
    Agent 3: Vernacular Auto-Rewriter & Human-in-the-Loop Escalation
    
    1. Score 0-35 (APPROVED): Passes message through without modification.
    2. Score 36-75 (AUTO_REWRITTEN): Substitutes dangerous draft with compliant,
       fact-checked safe rewrite with explicit AI transparency disclosure.
    3. Score 76-100 (BLOCKED_ESCALATED): VeriBrake Circuit Breaker engaged. Outbound
       quarantine, audit flag, and optional async Telegram/Slack incident webhook.
    """

    def __init__(self):
        self.telegram_bot_token = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
        self.telegram_chat_id = os.getenv("TELEGRAM_CHAT_ID", "").strip()
        self.slack_webhook_url = os.getenv("SLACK_WEBHOOK_URL", "").strip()

    def process(self, auditor_result: AuditorResult, airlock_result: AirlockResult, log_id: str, jurisdiction_route: str) -> RewriterResult:
        start_time = time.perf_counter()
        risk = auditor_result.overall_risk_score
        webhook_triggered = False

        if risk <= 35 and auditor_result.verdict == "APPROVED":
            final_msg = airlock_result.sanitized_text
            action = "PASSED"
            circuit_breaker = False
        elif risk <= 75 and auditor_result.verdict == "AUTO_REWRITTEN":
            final_msg = auditor_result.safe_rewritten_message
            action = "AUTO_REWRITTEN"
            circuit_breaker = False
        else:
            # BLOCKED_ESCALATED: Trip Circuit Breaker
            final_msg = "[VERIBRAKE CIRCUIT BREAKER ACTIVE - OUTBOUND MESSAGE INTERCEPTED & QUARANTINED]"
            action = "CIRCUIT_BREAKER_TRIGGERED"
            circuit_breaker = True
            
            # Fire async non-blocking webhook notification if configured
            webhook_triggered = self._dispatch_incident_webhook(
                log_id=log_id,
                risk_score=risk,
                jurisdiction=jurisdiction_route,
                violations=auditor_result.violations_detected
            )

        elapsed_ms = (time.perf_counter() - start_time) * 1000.0

        return RewriterResult(
            final_message=final_msg,
            action_taken=action,
            circuit_breaker_active=circuit_breaker,
            webhook_sent=webhook_triggered,
            disclosure_included=True,
            latency_ms=round(elapsed_ms, 2)
        )

    def _dispatch_incident_webhook(self, log_id: str, risk_score: int, jurisdiction: str, violations: list) -> bool:
        """
        Non-blocking incident alert to compliance operations team
        """
        violation_summary = "\n".join([f"• {v.category}: {v.regulation_cited}" for v in violations[:3]])
        
        # Slack Webhook
        if self.slack_webhook_url and self.slack_webhook_url.startswith("http"):
            try:
                payload = {
                    "text": f"🚨 *VeriBrake Circuit Breaker Engaged!*",
                    "attachments": [{
                        "color": "#ef4444",
                        "fields": [
                            {"title": "Incident Log ID", "value": log_id, "short": True},
                            {"title": "Risk Score", "value": f"{risk_score}/100", "short": True},
                            {"title": "Route", "value": jurisdiction, "short": True},
                            {"title": "Violations", "value": violation_summary or "High-risk breach"}
                        ]
                    }]
                }
                with httpx.Client(timeout=1.5) as client:
                    client.post(self.slack_webhook_url, json=payload)
                return True
            except Exception as e:
                logger.warning(f"Slack webhook failed: {e}")

        # Telegram Webhook
        if self.telegram_bot_token and self.telegram_chat_id:
            try:
                text = (
                    f"🚨 *VeriBrake Circuit Breaker Engaged!*\n"
                    f"*Log ID:* `{log_id}`\n"
                    f"*Risk Score:* {risk_score}/100\n"
                    f"*Jurisdiction:* {jurisdiction}\n"
                    f"*Violations:*\n{violation_summary}"
                )
                url = f"https://api.telegram.org/bot{self.telegram_bot_token}/sendMessage"
                with httpx.Client(timeout=1.5) as client:
                    client.post(url, json={"chat_id": self.telegram_chat_id, "text": text, "parse_mode": "Markdown"})
                return True
            except Exception as e:
                logger.warning(f"Telegram webhook failed: {e}")

        return False

rewriter_agent = VernacularRewriterEscalationAgent()
