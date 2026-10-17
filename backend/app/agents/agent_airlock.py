import re
import time
from typing import Dict, Any, List, Tuple
from ..schemas import AirlockResult

class DataAirlockAgent:
    """
    Agent 1: Data Airlock & Sovereignty Classifier
    Inspired by Australia's 3-Tier Data Classification Framework (OFFICIAL, PROTECTED, SECRET)
    and Data61's Data Airlock principle.
    
    Guarantees deterministic regex + token redaction pass BEFORE any payload leaves the
    sovereign boundary.
    """
    
    PATTERNS: List[Tuple[str, re.Pattern, str, str]] = [
        # (Pattern Name, Regex, Replacement, Tier)
        (
            "Singapore NRIC/FIN",
            re.compile(r"\b[SFTGM]\d{7}[A-Z]\b", re.IGNORECASE),
            "[SG_NRIC_REDACTED]",
            "SECRET"
        ),
        (
            "Indonesia NIK (Nomor Induk Kependudukan)",
            re.compile(r"\b(?:NIK|ktp)?\s*(\d{16})\b", re.IGNORECASE),
            "[ID_NIK_REDACTED]",
            "SECRET"
        ),
        (
            "India Aadhaar Card",
            re.compile(r"\b\d{4}\s\d{4}\s\d{4}\b|\b(?:Aadhaar|UIDAI)\s*[:#]?\s*(\d{12})\b", re.IGNORECASE),
            "[Aadhaar Redacted]",
            "SECRET"
        ),
        (
            "Japan My Number",
            re.compile(r"\b(?:MyNumber|My Number|マイナンバー)\s*[:#]?\s*(\d{12})\b", re.IGNORECASE),
            "[MyNumber Redacted]",
            "SECRET"
        ),
        (
            "South Korea RRN",
            re.compile(r"\b\d{6}[-\s]?[1-4]\d{6}\b"),
            "[RRN Omitted]",
            "SECRET"
        ),
        (
            "Credit Card Number (16-digit)",
            re.compile(r"\b(?:\d{4}[-\s]){3}\d{4}\b"),
            "[CARD_NO_REDACTED]",
            "PROTECTED"
        ),
        (
            "Bank Account Number",
            re.compile(r"\b(?:rekening|account|a/c)\s*[:#]?\s*(\d{10,16})\b", re.IGNORECASE),
            "[ACCOUNT_NO_REDACTED]",
            "PROTECTED"
        ),
        (
            "Raw 10-12 Digit Commercial Account Token",
            re.compile(r"\b(?:account|acct|no\.)\s*(\d{10,12})\b", re.IGNORECASE),
            "[ACCOUNT_NO_REDACTED]",
            "PROTECTED"
        ),
        (
            "Customer Email Address",
            re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"),
            "[EMAIL_REDACTED]",
            "PROTECTED"
        )
    ]

    def _determine_jurisdiction_policy(self, route: str, classification_tier: str) -> str:
        route_lower = route.lower()
        if "id" in route_lower or "indonesia" in route_lower:
            return "Indonesia GR 71/2019 (PSTE) & PDP Law No. 27/2022: Strict National Residency for Personal Data & National ID Identifiers (NIK)."
        elif "sg" in route_lower or "singapore" in route_lower or "mas" in route_lower:
            return "Singapore PDPA 2012 & MAS Technology Risk Management Guidelines: Mandatory NRIC Masking & Veritas Fair Governance."
        elif "in" in route_lower or "india" in route_lower:
            return "India Digital Personal Data Protection Act 2023 (DPDP): Mandatory Aadhaar Masking and Purpose Specification."
        elif "kr" in route_lower or "korea" in route_lower:
            return "South Korea PIPA Art. 24-2: Resident Registration Number (RRN) Encryption & Strict Prohibition on Cross-Border Cloud Transmission."
        elif "au" in route_lower or "australia" in route_lower:
            return "Australian PSPF & Data61 Airlock Framework: Multi-Tier Perimeter Redaction & Cryptographic Scrubbing."
        else:
            return "ASEAN Model Contractual Clauses & Cross-Border Data Flow Framework (Cross-Border Safe Harbor Protocol)."

    def process(self, draft_message: str, jurisdiction_route: str = "SG Domestic") -> AirlockResult:
        start_time = time.perf_counter()
        
        sanitized_text = draft_message
        redacted_count = 0
        detected_tokens: List[str] = []
        highest_tier = "OFFICIAL"

        tier_weights = {"OFFICIAL": 0, "PROTECTED": 1, "SECRET": 2}

        # Handle specific prefix-linked patterns first
        # Handle Aadhaar format: 4 digits space 4 digits space 4 digits
        aadhaar_pattern = re.compile(r"\b\d{4}\s\d{4}\s\d{4}\b")
        if aadhaar_pattern.search(sanitized_text):
            sanitized_text = aadhaar_pattern.sub("[Aadhaar Redacted]", sanitized_text)
            redacted_count += 1
            detected_tokens.append("[Aadhaar Redacted]")
            highest_tier = "SECRET"

        # Handle Singapore NRIC
        sg_pattern = re.compile(r"\b[SFTGM]\d{7}[A-Z]\b", re.IGNORECASE)
        sg_matches = sg_pattern.findall(sanitized_text)
        if sg_matches:
            sanitized_text = sg_pattern.sub("[SG_NRIC_REDACTED]", sanitized_text)
            redacted_count += len(sg_matches)
            detected_tokens.append("[SG_NRIC_REDACTED]")
            highest_tier = "SECRET"

        # Handle Indonesia NIK: 16 digits
        # Often preceded by NIK or standalone 16 digit number
        nik_pattern = re.compile(r"\b(?:NIK\s*)?(\d{16})\b", re.IGNORECASE)
        nik_matches = nik_pattern.findall(sanitized_text)
        if nik_matches:
            sanitized_text = nik_pattern.sub("[ID_NIK_REDACTED]", sanitized_text)
            redacted_count += len(nik_matches)
            detected_tokens.append("[ID_NIK_REDACTED]")
            highest_tier = "SECRET"

        # Handle South Korea RRN
        rrn_pattern = re.compile(r"\b\d{6}[-\s]?[1-4]\d{6}\b")
        if rrn_pattern.search(sanitized_text):
            sanitized_text = rrn_pattern.sub("[RRN Omitted]", sanitized_text)
            redacted_count += 1
            detected_tokens.append("[RRN Omitted]")
            highest_tier = "SECRET"

        # Handle Japan My Number (12 digits with prefix)
        mynum_pattern = re.compile(r"\b(?:MyNumber|My Number)\s*[:#]?\s*(\d{12})\b", re.IGNORECASE)
        if mynum_pattern.search(sanitized_text):
            sanitized_text = mynum_pattern.sub("[MyNumber Redacted]", sanitized_text)
            redacted_count += 1
            detected_tokens.append("[MyNumber Redacted]")
            highest_tier = "SECRET"

        # Handle Bank Account / Account numbers (e.g., rekening 10928392019 or account 409182390192)
        acct_pattern = re.compile(r"\b(?:rekening|account|acct|a/c)\s*[:#]?\s*(\d{8,16})\b", re.IGNORECASE)
        acct_matches = acct_pattern.findall(sanitized_text)
        if acct_matches:
            sanitized_text = acct_pattern.sub(r"account [ACCOUNT_NO_REDACTED]", sanitized_text)
            redacted_count += len(acct_matches)
            detected_tokens.append("[ACCOUNT_NO_REDACTED]")
            if tier_weights["PROTECTED"] > tier_weights[highest_tier]:
                highest_tier = "PROTECTED"

        # Secondary catch for raw 10-14 digit numbers that look like account numbers if not already redacted
        raw_digits_pattern = re.compile(r"\b(\d{10,14})\b")
        for match in raw_digits_pattern.finditer(sanitized_text):
            num = match.group(1)
            # if not part of a date or year (e.g. 2026)
            if len(num) >= 10:
                sanitized_text = sanitized_text.replace(num, "[ACCOUNT_NO_REDACTED]")
                redacted_count += 1
                if "[ACCOUNT_NO_REDACTED]" not in detected_tokens:
                    detected_tokens.append("[ACCOUNT_NO_REDACTED]")
                if tier_weights["PROTECTED"] > tier_weights[highest_tier]:
                    highest_tier = "PROTECTED"

        jurisdiction_policy = self._determine_jurisdiction_policy(jurisdiction_route, highest_tier)
        
        elapsed_ms = (time.perf_counter() - start_time) * 1000.0

        return AirlockResult(
            sanitized_text=sanitized_text,
            redacted_entities_count=redacted_count,
            classification_tier=highest_tier,
            jurisdiction_policy=jurisdiction_policy,
            redacted_tokens=detected_tokens,
            latency_ms=round(elapsed_ms, 2)
        )

airlock_agent = DataAirlockAgent()
