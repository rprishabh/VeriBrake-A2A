import os
import json
import sqlite3
import datetime
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger("veribrake.storage")

class VeriBrakeStorage:
    def __init__(self, db_path: str = "veribrake_audit.db"):
        self.db_path = db_path
        self.firestore_client = None
        self.use_firestore = False
        
        # Check if Google Cloud Project is configured
        gcp_project = os.getenv("GOOGLE_CLOUD_PROJECT")
        if gcp_project:
            try:
                from google.cloud import firestore
                self.firestore_client = firestore.Client(project=gcp_project)
                self.use_firestore = True
                logger.info(f"Google Cloud Firestore activated for project: {gcp_project}")
            except Exception as e:
                logger.warning(f"Firestore initialization skipped ({e}). Falling back to local SQLite store.")
                self.use_firestore = False

        self._init_sqlite()
        self._seed_if_empty()

    def _get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_sqlite(self):
        with self._get_connection() as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS audit_logs (
                    log_id TEXT PRIMARY KEY,
                    timestamp TEXT NOT NULL,
                    direction TEXT DEFAULT 'OUTBOUND',
                    jurisdiction_route TEXT NOT NULL,
                    target_dialect TEXT NOT NULL,
                    customer_context TEXT,
                    original_message TEXT NOT NULL,
                    sanitized_text TEXT NOT NULL,
                    redacted_entities_count INTEGER DEFAULT 0,
                    classification_tier TEXT NOT NULL,
                    verdict TEXT NOT NULL,
                    overall_risk_score INTEGER NOT NULL,
                    feat_fairness INTEGER DEFAULT 100,
                    feat_ethics INTEGER DEFAULT 100,
                    feat_accountability INTEGER DEFAULT 100,
                    feat_transparency INTEGER DEFAULT 100,
                    circuit_breaker_active BOOLEAN DEFAULT 0,
                    final_message TEXT NOT NULL,
                    total_latency_ms REAL NOT NULL,
                    resolved_status TEXT,
                    officer_notes TEXT,
                    raw_payload_json TEXT NOT NULL
                )
            """)
            # Check if 'direction' column exists in case db was previously created without it
            cursor = conn.cursor()
            cursor.execute("PRAGMA table_info(audit_logs)")
            columns = [row[1] for row in cursor.fetchall()]
            if "direction" not in columns:
                conn.execute("ALTER TABLE audit_logs ADD COLUMN direction TEXT DEFAULT 'OUTBOUND'")
            conn.commit()

    def _seed_if_empty(self):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM audit_logs")
            count = cursor.fetchone()[0]
            if count == 0:
                logger.info("Seeding initial mock historical audit trail for demo completeness...")
                seed_data = [
                    {
                        "log_id": "VB-OUT-SEED-001",
                        "direction": "OUTBOUND",
                        "timestamp": (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(minutes=14)).isoformat(),
                        "jurisdiction_route": "ID -> SG",
                        "target_dialect": "Bahasa Indonesia",
                        "customer_context": "PT Nusantara Jaya Sentosa (NIK 3171012803890005)",
                        "original_message": "Selamat siang Ibu Rina, bank kami pra-setujui bunga 0.5% APR fix tanpa jaminan! NIK 3171012803890005 dana 1 Milyar cair segera.",
                        "sanitized_text": "Selamat siang Ibu Rina, bank kami pra-setujui bunga 0.5% APR fix tanpa jaminan! NIK [ID_NIK_REDACTED] dana 1 Milyar cair segera.",
                        "redacted_entities_count": 1,
                        "classification_tier": "SECRET",
                        "verdict": "BLOCKED_ESCALATED",
                        "overall_risk_score": 92,
                        "feat_fairness": 55,
                        "feat_ethics": 20,
                        "feat_accountability": 30,
                        "feat_transparency": 15,
                        "circuit_breaker_active": True,
                        "final_message": "[VERIBRAKE CIRCUIT BREAKER ACTIVE - OUTBOUND MESSAGE INTERCEPTED & QUARANTINED]",
                        "total_latency_ms": 342.5,
                        "resolved_status": None,
                        "officer_notes": "",
                        "raw_payload_json": json.dumps({
                            "log_id": "VB-OUT-SEED-001",
                            "direction": "OUTBOUND",
                            "jurisdiction_route": "ID -> SG",
                            "target_dialect": "Bahasa Indonesia",
                            "customer_context": "PT Nusantara Jaya Sentosa (NIK 3171012803890005)",
                            "original_message": "Selamat siang Ibu Rina, bank kami pra-setujui bunga 0.5% APR fix tanpa jaminan! NIK 3171012803890005 dana 1 Milyar cair segera.",
                            "airlock": {
                                "sanitized_text": "Selamat siang Ibu Rina, bank kami pra-setujui bunga 0.5% APR fix tanpa jaminan! NIK [ID_NIK_REDACTED] dana 1 Milyar cair segera.",
                                "redacted_entities_count": 1,
                                "classification_tier": "SECRET",
                                "jurisdiction_policy": "Indonesia GR 71/2019",
                                "redacted_tokens": ["[ID_NIK_REDACTED]"],
                                "latency_ms": 2.1
                            },
                            "auditor": {
                                "verdict": "BLOCKED_ESCALATED",
                                "overall_risk_score": 92,
                                "feat_scores": {"fairness": 55, "ethics": 20, "accountability": 30, "transparency": 15},
                                "data_sovereignty_status": {"classification_tier": "SECRET", "jurisdiction_lock": "SOVEREIGN_LOCK", "cross_border_safe": False},
                                "violations_detected": [{"category": "Product Truth", "regulation_cited": "MAS FEAT", "explanation": "Hallucinated 0.5% APR loan"}],
                                "safe_rewritten_message": "Compliant rewrite",
                                "human_escalation_required": True,
                                "model_used": "gemini-2.5-flash",
                                "latency_ms": 320.0
                            },
                            "rewriter": {
                                "final_message": "[VERIBRAKE CIRCUIT BREAKER ACTIVE]",
                                "action_taken": "CIRCUIT_BREAKER_TRIGGERED",
                                "circuit_breaker_active": True,
                                "latency_ms": 1.2
                            },
                            "total_latency_ms": 342.5
                        })
                    },
                    {
                        "log_id": "VB-IN-SEED-002",
                        "direction": "INBOUND",
                        "timestamp": (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(minutes=5)).isoformat(),
                        "jurisdiction_route": "IN (Domestic UPI/IMPS)",
                        "target_dialect": "English / Hindi",
                        "customer_context": "Citizen Rajesh Verma (Targeted ₹5,00,000 liquidation)",
                        "original_message": "Sir do not disconnect Skype call. CBI Officer Sharma stating 24 bank accounts opened under your name in money laundering case. Court ordered asset liquidation to Supreme Court verification escrow account within 15 minutes or arrest warrant dispatched.",
                        "sanitized_text": "Sir do not disconnect Skype call. CBI Officer Sharma stating 24 bank accounts opened under your name in money laundering case. Court ordered asset liquidation to Supreme Court verification escrow account within 15 minutes or arrest warrant dispatched.",
                        "redacted_entities_count": 0,
                        "classification_tier": "OFFICIAL",
                        "verdict": "CIRCUIT_BREAKER_FROZEN",
                        "overall_risk_score": 95,
                        "feat_fairness": 100,
                        "feat_ethics": 100,
                        "feat_accountability": 100,
                        "feat_transparency": 100,
                        "circuit_breaker_active": True,
                        "final_message": "Digital Arrest Extortion (Impersonation of Central Bureau of Investigation & Fake Supreme Court Escrow)",
                        "total_latency_ms": 184.2,
                        "resolved_status": None,
                        "officer_notes": "",
                        "raw_payload_json": json.dumps({
                            "log_id": "VB-IN-SEED-002",
                            "direction": "INBOUND",
                            "jurisdiction_route": "IN (Domestic UPI/IMPS)",
                            "target_dialect": "English / Hindi",
                            "customer_context": "Citizen Rajesh Verma (Targeted ₹5,00,000 liquidation)",
                            "original_message": "Sir do not disconnect Skype call. CBI Officer Sharma stating 24 bank accounts opened under your name in money laundering case. Court ordered asset liquidation to Supreme Court verification escrow account within 15 minutes or arrest warrant dispatched.",
                            "airlock": {
                                "sanitized_text": "Sir do not disconnect Skype call. CBI Officer Sharma stating 24 bank accounts opened under your name in money laundering case. Court ordered asset liquidation to Supreme Court verification escrow account within 15 minutes or arrest warrant dispatched.",
                                "redacted_entities_count": 0,
                                "classification_tier": "OFFICIAL",
                                "jurisdiction_policy": "India DPDP Act 2023 & UIDAI Guidelines",
                                "redacted_tokens": [],
                                "latency_ms": 1.4
                            },
                            "coercion": {
                                "verdict": "CIRCUIT_BREAKER_FROZEN",
                                "coercion_severity_score": 95,
                                "psychological_markers": {
                                    "authority_impersonation": 95,
                                    "manufactured_urgency": 90,
                                    "isolation_tactics": 95,
                                    "financial_liquidation": 90
                                },
                                "threat_narrative_detected": "Digital Arrest Extortion (Impersonation of Central Bureau of Investigation & Fake Supreme Court Escrow)",
                                "recommended_intervention": "IMMEDIATE ACTION: Circuit Breaker has FROZEN the outgoing transfer. Instruct customer to terminate ongoing Skype call immediately.",
                                "emergency_contact_alert_payload": "🚨 CRITICAL SOS ALERT: VeriBrake Inbound Guard has FROZEN an outgoing ₹5,00,000 transfer for your family member. Please call them on phone now and instruct them to disconnect the Skype video call immediately.",
                                "mule_account_risk": "CRITICAL",
                                "model_used": "gemini-2.5-flash",
                                "cooldown_seconds": 180,
                                "webhook_sent": True,
                                "latency_ms": 182.8
                            },
                            "total_latency_ms": 184.2
                        })
                    }
                ]
                for item in seed_data:
                    conn.execute("""
                        INSERT INTO audit_logs (
                            log_id, timestamp, direction, jurisdiction_route, target_dialect, customer_context,
                            original_message, sanitized_text, redacted_entities_count, classification_tier,
                            verdict, overall_risk_score, feat_fairness, feat_ethics, feat_accountability,
                            feat_transparency, circuit_breaker_active, final_message, total_latency_ms,
                            resolved_status, officer_notes, raw_payload_json
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        item["log_id"], item["timestamp"], item["direction"], item["jurisdiction_route"], item["target_dialect"],
                        item["customer_context"], item["original_message"], item["sanitized_text"],
                        item["redacted_entities_count"], item["classification_tier"], item["verdict"],
                        item["overall_risk_score"], item["feat_fairness"], item["feat_ethics"],
                        item["feat_accountability"], item["feat_transparency"], item["circuit_breaker_active"],
                        item["final_message"], item["total_latency_ms"], item["resolved_status"],
                        item["officer_notes"], item["raw_payload_json"]
                    ))
                conn.commit()

    def save_intercept(self, payload: Dict[str, Any]) -> str:
        log_id = payload["log_id"]
        timestamp = payload["timestamp"]
        direction = payload.get("direction", "OUTBOUND")
        jurisdiction_route = payload["jurisdiction_route"]
        target_dialect = payload.get("target_dialect", "English")
        customer_context = payload.get("customer_context", "")
        original_message = payload["original_message"]
        
        airlock = payload["airlock"]
        
        if direction == "INBOUND":
            coercion = payload["coercion"]
            verdict = coercion["verdict"]
            overall_risk_score = coercion["coercion_severity_score"]
            fairness = 100
            ethics = 100
            accountability = 100
            transparency = 100
            circuit_breaker = (verdict == "CIRCUIT_BREAKER_FROZEN")
            final_message = coercion["threat_narrative_detected"]
        else:
            auditor = payload["auditor"]
            rewriter = payload["rewriter"]
            verdict = auditor["verdict"]
            overall_risk_score = auditor["overall_risk_score"]
            fairness = auditor["feat_scores"]["fairness"]
            ethics = auditor["feat_scores"]["ethics"]
            accountability = auditor["feat_scores"]["accountability"]
            transparency = auditor["feat_scores"]["transparency"]
            circuit_breaker = rewriter["circuit_breaker_active"]
            final_message = rewriter["final_message"]
        
        # Save to SQLite
        with self._get_connection() as conn:
            conn.execute("""
                INSERT OR REPLACE INTO audit_logs (
                    log_id, timestamp, direction, jurisdiction_route, target_dialect, customer_context,
                    original_message, sanitized_text, redacted_entities_count, classification_tier,
                    verdict, overall_risk_score, feat_fairness, feat_ethics, feat_accountability,
                    feat_transparency, circuit_breaker_active, final_message, total_latency_ms,
                    resolved_status, raw_payload_json
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                log_id,
                timestamp,
                direction,
                jurisdiction_route,
                target_dialect,
                customer_context,
                original_message,
                airlock["sanitized_text"],
                airlock["redacted_entities_count"],
                airlock["classification_tier"],
                verdict,
                overall_risk_score,
                fairness,
                ethics,
                accountability,
                transparency,
                circuit_breaker,
                final_message,
                payload["total_latency_ms"],
                payload.get("resolved_status"),
                json.dumps(payload)
            ))
            conn.commit()

        # If Cloud Firestore is enabled, save document asynchronously
        if self.use_firestore and self.firestore_client:
            try:
                doc_ref = self.firestore_client.collection("veribrake_audit_logs").document(log_id)
                doc_ref.set(payload)
            except Exception as e:
                logger.error(f"Failed to write to Google Cloud Firestore: {e}")

        return log_id

    def get_audit_logs(self, limit: int = 30, direction: Optional[str] = None) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            if direction and direction in ["OUTBOUND", "INBOUND"]:
                cursor.execute("""
                    SELECT log_id, timestamp, direction, jurisdiction_route, target_dialect, customer_context,
                           classification_tier, verdict, overall_risk_score, circuit_breaker_active,
                           total_latency_ms, resolved_status, raw_payload_json
                    FROM audit_logs
                    WHERE direction = ?
                    ORDER BY timestamp DESC
                    LIMIT ?
                """, (direction, limit))
            else:
                cursor.execute("""
                    SELECT log_id, timestamp, direction, jurisdiction_route, target_dialect, customer_context,
                           classification_tier, verdict, overall_risk_score, circuit_breaker_active,
                           total_latency_ms, resolved_status, raw_payload_json
                    FROM audit_logs
                    ORDER BY timestamp DESC
                    LIMIT ?
                """, (limit,))
                
            rows = cursor.fetchall()
            logs = []
            for r in rows:
                try:
                    payload = json.loads(r["raw_payload_json"])
                    payload["resolved_status"] = r["resolved_status"]
                    if "direction" not in payload:
                        payload["direction"] = r["direction"] or "OUTBOUND"
                    logs.append(payload)
                except Exception:
                    logs.append({
                        "log_id": r["log_id"],
                        "timestamp": r["timestamp"],
                        "direction": r["direction"] or "OUTBOUND",
                        "jurisdiction_route": r["jurisdiction_route"],
                        "verdict": r["verdict"],
                        "overall_risk_score": r["overall_risk_score"],
                        "resolved_status": r["resolved_status"],
                        "circuit_breaker_active": bool(r["circuit_breaker_active"])
                    })
            return logs

    def update_audit_log_status(self, log_id: str, status: str, notes: str = "") -> bool:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE audit_logs 
                SET resolved_status = ?, officer_notes = ?
                WHERE log_id = ?
            """, (status, notes, log_id))
            conn.commit()
            updated = cursor.rowcount > 0

        if updated and self.use_firestore and self.firestore_client:
            try:
                doc_ref = self.firestore_client.collection("veribrake_audit_logs").document(log_id)
                doc_ref.update({"resolved_status": status, "officer_notes": notes})
            except Exception as e:
                logger.error(f"Failed to update Firestore doc {log_id}: {e}")

        return updated

    def get_kpis(self) -> Dict[str, Any]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            
            # Overall KPIs
            cursor.execute("SELECT COUNT(*) FROM audit_logs")
            total_intercepts = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM audit_logs WHERE verdict = 'BLOCKED_ESCALATED' OR verdict = 'CIRCUIT_BREAKER_FROZEN' OR circuit_breaker_active = 1")
            hallucinations_blocked = cursor.fetchone()[0]

            cursor.execute("SELECT SUM(redacted_entities_count) FROM audit_logs")
            sum_tokens = cursor.fetchone()[0]
            pii_tokens_redacted = sum_tokens if sum_tokens is not None else 0

            cursor.execute("SELECT AVG(total_latency_ms) FROM audit_logs")
            avg_lat = cursor.fetchone()[0]
            avg_latency_ms = round(avg_lat, 1) if avg_lat is not None else 0.0

            # Mode 1: Outbound AI Governance KPIs
            cursor.execute("SELECT COUNT(*) FROM audit_logs WHERE direction = 'OUTBOUND'")
            outbound_ai_checks = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM audit_logs WHERE direction = 'OUTBOUND' AND (verdict = 'BLOCKED_ESCALATED' OR circuit_breaker_active = 1)")
            mas_violations_blocked = cursor.fetchone()[0]

            cursor.execute("SELECT AVG(total_latency_ms) FROM audit_logs WHERE direction = 'OUTBOUND'")
            out_lat = cursor.fetchone()[0]
            outbound_avg_latency_ms = round(out_lat, 1) if out_lat is not None else 0.0

            # Mode 2: Inbound Coercion & Fraud Defense KPIs
            cursor.execute("SELECT COUNT(*) FROM audit_logs WHERE direction = 'INBOUND'")
            active_transits_protected = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM audit_logs WHERE direction = 'INBOUND' AND overall_risk_score >= 35")
            coercion_interceptions = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM audit_logs WHERE direction = 'INBOUND' AND (verdict = 'CIRCUIT_BREAKER_FROZEN' OR overall_risk_score >= 75)")
            mule_freezes_triggered = cursor.fetchone()[0]

            return {
                "total_intercepts": total_intercepts,
                "hallucinations_blocked": hallucinations_blocked,
                "pii_tokens_redacted": pii_tokens_redacted,
                "avg_latency_ms": avg_latency_ms,
                "outbound": {
                    "outbound_ai_checks": outbound_ai_checks,
                    "mas_violations_blocked": mas_violations_blocked,
                    "avg_latency_ms": outbound_avg_latency_ms
                },
                "inbound": {
                    "active_transits_protected": active_transits_protected,
                    "coercion_interceptions": coercion_interceptions,
                    "mule_freezes_triggered": mule_freezes_triggered
                }
            }

storage = VeriBrakeStorage()
