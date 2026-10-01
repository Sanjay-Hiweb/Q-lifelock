"""Deterministic, Explainable Risk Engine for Q-LIFELOCK."""
from typing import Tuple
from core.domain.models import (
    CryptoAlgorithm,
    AlgorithmFamily,
    CryptoFunction,
    UsageContext,
    DataSensitivity,
    QuantumExposure,
    Finding,
    QuantumScenario,
)
from core.domain.lifetime import assess_hndl_exposure_window, years_to_category


class RiskEngine:
    """
    Deterministic risk calculation service.
    
    Combines:
    - Algorithm quantum vulnerability (Shor's impact)
    - Cryptographic function (Confidentiality / HNDL vs Authenticity)
    - Key size / strength parameters
    - Data sensitivity
    - Data lifetime & threat horizon overlap
    - Usage context (Production vs Test)
    - Detection confidence
    """
    VERSION = "1.0.0"

    # Algorithm vulnerability factors (0.0 to 1.0)
    ALGO_VULNERABILITY = {
        CryptoAlgorithm.RSA: 1.0,           # Broken by Shor's
        CryptoAlgorithm.ECDSA: 1.0,         # Broken by Shor's
        CryptoAlgorithm.ECDH: 1.0,          # Broken by Shor's
        CryptoAlgorithm.DSA: 1.0,           # Broken by Shor's
        CryptoAlgorithm.DIFFIE_HELLMAN: 1.0,# Broken by Shor's
        CryptoAlgorithm.ED25519: 1.0,       # Broken by Shor's
        CryptoAlgorithm.AES: 0.05,          # Grover only; AES-256 quantum-safe
        CryptoAlgorithm.CHACHA20: 0.05,     # Grover only; 256-bit safe
        CryptoAlgorithm.SHA256: 0.05,       # Pre-image Grover only
        CryptoAlgorithm.UNKNOWN: 0.5,
    }

    # Function vulnerability factor for HNDL (Confidentiality is at immediate risk)
    FUNCTION_HNDL_FACTOR = {
        CryptoFunction.KEY_ESTABLISHMENT: 1.0,  # Highest HNDL threat
        CryptoFunction.ENCRYPTION: 1.0,         # Highest HNDL threat
        CryptoFunction.DIGITAL_SIGNATURE: 0.65, # Authenticity/repudiation threat
        CryptoFunction.AUTHENTICATION: 0.60,    # Session/handshake threat
        CryptoFunction.CERTIFICATE_PKI: 0.70,   # Trust chain threat
        CryptoFunction.CONFIGURATION: 0.50,
        CryptoFunction.UNKNOWN: 0.50,
    }

    SENSITIVITY_WEIGHT = {
        DataSensitivity.CRITICAL: 1.0,
        DataSensitivity.HIGH: 0.8,
        DataSensitivity.MEDIUM: 0.5,
        DataSensitivity.LOW: 0.2,
        DataSensitivity.UNKNOWN: 0.6,
    }

    CONTEXT_WEIGHT = {
        UsageContext.PRODUCTION: 1.0,
        UsageContext.CONFIGURATION: 0.75,
        UsageContext.GENERATED: 0.50,
        UsageContext.SAMPLE: 0.20,
        UsageContext.TEST: 0.10,
        UsageContext.DOCUMENTATION: 0.05,
        UsageContext.UNKNOWN: 0.70,
    }

    @classmethod
    def evaluate_finding(
        cls,
        finding: Finding,
        scenario: QuantumScenario,
        analysis_year: int = 2026,
    ) -> Tuple[float, QuantumExposure, str]:
        """
        Evaluate risk score, exposure priority, and explainable rationale.
        
        Returns:
            (risk_score, priority, rationale)
        """
        # 1. Base algorithm vulnerability (0 to 1)
        algo_vuln = cls.ALGO_VULNERABILITY.get(finding.algorithm, 0.5)

        # 2. Function risk factor
        func_factor = cls.FUNCTION_HNDL_FACTOR.get(finding.function, 0.5)

        # 3. Data Sensitivity
        sens_weight = cls.SENSITIVITY_WEIGHT.get(finding.data_sensitivity, 0.6)

        # 4. Context weight
        ctx_weight = cls.CONTEXT_WEIGHT.get(finding.usage_context, 0.7)

        # 5. Data Lifetime & HNDL Exposure Overlap
        lifetime = finding.data_lifetime_years
        threat_year = scenario.threat_horizon_year
        is_exposed_past_crqc, overlap_years = assess_hndl_exposure_window(
            analysis_year=analysis_year,
            lifetime_years=lifetime,
            crqc_horizon_year=threat_year,
        )

        if lifetime is None:
            # Explicit unknown lifetime: treat as moderate risk with explicit uncertainty
            lifetime_factor = 0.5
            lifetime_desc = "Unknown lifetime (assumed moderate risk pending declaration)"
        elif not is_exposed_past_crqc:
            # Expires before CRQC arrival: low HNDL risk
            lifetime_factor = 0.25
            lifetime_desc = f"Expires in {analysis_year + lifetime} (before {threat_year} CRQC scenario)"
        else:
            # Actively exposed past CRQC: scaled by overlap
            if overlap_years >= 10:
                lifetime_factor = 1.0
            elif overlap_years >= 5:
                lifetime_factor = 0.85
            else:
                lifetime_factor = 0.70
            lifetime_desc = f"Confidentiality required until {analysis_year + lifetime} (+{overlap_years}y beyond {threat_year} CRQC)"

        # 6. Raw score calculation (0 to 100)
        # Core equation combining algorithm, function, sensitivity, lifetime, and context
        raw_score = (
            (algo_vuln * 35.0) +
            (func_factor * 20.0) +
            (sens_weight * 25.0) +
            (lifetime_factor * 20.0)
        ) * ctx_weight

        # Factor in detection confidence
        # A low confidence detection is attenuated so it doesn't alarm inappropriately
        confidence_factor = 0.5 + (0.5 * finding.confidence)
        final_score = round(min(100.0, max(0.0, raw_score * confidence_factor)), 1)

        # Categorize Exposure Level
        if ctx_weight <= 0.1:  # Test/Docs
            priority = QuantumExposure.LOW
        elif final_score >= 70.0:
            priority = QuantumExposure.CRITICAL
        elif final_score >= 45.0:
            priority = QuantumExposure.HIGH
        elif final_score >= 25.0:
            priority = QuantumExposure.MEDIUM
        else:
            priority = QuantumExposure.LOW

        # Generate Explainable Rationale
        rationale = (
            f"{priority.value} Priority (Score: {final_score}/100): "
            f"{finding.algorithm.value} ({finding.function.value}) detected in {finding.usage_context.value} code. "
            f"Sensitivity: {finding.data_sensitivity.value}. {lifetime_desc}. "
            f"Under scenario {scenario.name} (CRQC: {threat_year}), "
            f"{'Harvest-Now-Decrypt-Later exposure is ACTIVE' if is_exposed_past_crqc else 'no post-CRQC exposure window'}. "
            f"Detection confidence: {int(finding.confidence * 100)}%."
        )

        return (final_score, priority, rationale)
