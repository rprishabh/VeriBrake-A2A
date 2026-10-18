import os
import urllib.request
import json
import logging

logger = logging.getLogger("veribrake.webhook")

def send_telegram_alert(mode: str, verdict: str, risk_score: int, summary: str):
    """
    Fires real-time Telegram alert when VeriBrake Circuit Breaker trips or high risk detected.
    Supports OUTBOUND governance blocks and INBOUND digital arrest SOS alerts.
    """
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")
    if not token or not chat_id:
        return {"status": "skipped", "reason": "Telegram credentials not configured"}

    icon = "🛡️ OUTBOUND GOVERNANCE BLOCK" if mode == "OUTBOUND" else "🚨 INBOUND DIGITAL ARREST SOS"
    text = (
        f"*{icon}*\n"
        f"*Verdict:* `{verdict}`\n"
        f"*Risk Score:* `{risk_score}/100`\n"
        f"*Details:* {summary}\n\n"
        f"_Action Required in VeriBrake Command Center_"
    )

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = json.dumps({
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "Markdown"
    }).encode("utf-8")
    
    try:
        req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=3) as response:
            return {"status": "sent", "http_code": response.getcode()}
    except Exception as e:
        logger.warning(f"send_telegram_alert failed: {e}")
        return {"status": "error", "message": str(e)}

def send_security_alert(channel: str, verdict: str, score: int, details: str):
    """
    Alternative signature for incident notifications across channels.
    """
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")
    if not token or not chat_id:
        return {"status": "skipped", "message": "Telegram credentials missing"}

    message = (
        f"🚨 *VERIBRAKE CIRCUIT BREAKER ENGAGED*\n"
        f"• *Channel:* `{channel}`\n"
        f"• *Verdict:* `{verdict}`\n"
        f"• *Risk Score:* `{score}/100`\n"
        f"• *Incident:* {details}\n\n"
        f"⚡ *Action:* Transaction halted pending supervisory override."
    )

    payload = json.dumps({
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "Markdown"
    }).encode("utf-8")
    
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    req = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=4) as res:
            return {"status": "dispatched", "code": res.getcode()}
    except Exception as e:
        logger.warning(f"send_security_alert failed: {e}")
        return {"status": "failed", "error": str(e)}
