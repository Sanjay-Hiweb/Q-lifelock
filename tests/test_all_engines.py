"""
Comprehensive Test Suite for Q-LIFELOCK Core Engines.
"""
import pytest
from pathlib import Path

from core.domain.models import (
    CryptoAlgorithm,
    CryptoFunction,
    UsageContext,
    DataSensitivity,
    DataLifetimeCategory,
    QuantumExposure,
    MigrationStatus,
    PQCTarget,
    Finding,
    Evidence,
    QuantumScenario,
)
from core.domain.lifetime import (
    years_to_category,
    assess_hndl_exposure_window,
    infer_data_lifetime_preset,
)
from core.risk.engine import RiskEngine
from core.timemachine.scenario import TimeMachineEngine
from core.migration.planner import MigrationPlanner
from core.readiness.metric import ReadinessEngine
from core.quantum.adapter import QuantumAdapter
from core.scanner.security import ScannerSecurity, SecurityException
from core.scanner.engine import ScannerEngine


# ---------------------------------------------------------
# 1. Lifetime Engine Tests
# ---------------------------------------------------------
def test_lifetime_categories():
    assert years_to_category(None) == DataLifetimeCategory.UNKNOWN
    assert years_to_category(0) == DataLifetimeCategory.UNDER_1_YEAR
    assert years_to_category(2) == DataLifetimeCategory.Y1_TO_3
    assert years_to_category(4) == DataLifetimeCategory.Y3_TO_5
    assert years_to_category(7) == DataLifetimeCategory.Y5_TO_10
    assert years_to_category(15) == DataLifetimeCategory.Y10_TO_20
    assert years_to_category(25) == DataLifetimeCategory.Y20_TO_30
    assert years_to_category(40) == DataLifetimeCategory.OVER_30_YEARS


def test_hndl_exposure_window():
    # Analysis year 2026, lifetime 30 years -> expires 2056
    # CRQC horizon 2035 -> expires 21 years AFTER CRQC
    exposed, overlap = assess_hndl_exposure_window(
        analysis_year=2026,
        lifetime_years=30,
        crqc_horizon_year=2035,
    )
    assert exposed is True
    assert overlap == 21

    # Ephemeral session: lifetime 0 years -> expires 2026
    exposed_short, overlap_short = assess_hndl_exposure_window(
        analysis_year=2026,
        lifetime_years=0,
        crqc_horizon_year=2035,
    )
    assert exposed_short is False
    assert overlap_short == 0


# ---------------------------------------------------------
# 2. Risk Engine Tests & Core Thesis Validation
# ---------------------------------------------------------
def test_risk_lifetime_differentiation():
    """
    CRITICAL TEST: The core thesis of Q-LIFELOCK.
    Two identical ECDH findings:
    - Finding A protects patient records (30y lifetime)
    - Finding B protects an ephemeral session (0y lifetime)
    Finding A MUST have significantly higher risk score and priority than Finding B.
    """
    scenario = QuantumScenario(threat_horizon_year=2035)

    finding_long_lived = Finding(
        finding_id="TEST-001",
        repository="test",
        file_path="src/health.py",
        line_number=10,
        language="python",
        algorithm=CryptoAlgorithm.ECDH,
        function=CryptoFunction.KEY_ESTABLISHMENT,
        usage_context=UsageContext.PRODUCTION,
        data_sensitivity=DataSensitivity.CRITICAL,
        data_lifetime_years=30,
        confidence=0.95,
        evidence=Evidence(file_path="src/health.py", line_number=10, line_content="ec.ECDH()"),
    )

    finding_ephemeral = Finding(
        finding_id="TEST-002",
        repository="test",
        file_path="src/session.py",
        line_number=20,
        language="python",
        algorithm=CryptoAlgorithm.ECDH,
        function=CryptoFunction.KEY_ESTABLISHMENT,
        usage_context=UsageContext.PRODUCTION,
        data_sensitivity=DataSensitivity.LOW,
        data_lifetime_years=0,
        confidence=0.95,
        evidence=Evidence(file_path="src/session.py", line_number=20, line_content="ec.ECDH()"),
    )

    score_long, priority_long, reason_long = RiskEngine.evaluate_finding(finding_long_lived, scenario)
    score_short, priority_short, reason_short = RiskEngine.evaluate_finding(finding_ephemeral, scenario)

    assert score_long > score_short
    assert score_long >= 70.0
    assert priority_long == QuantumExposure.CRITICAL
    assert "Harvest-Now-Decrypt-Later exposure is ACTIVE" in reason_long
    assert "no post-CRQC exposure window" in reason_short


def test_test_code_context_attenuation():
    """Test code should receive low priority even if RSA is used."""
    scenario = QuantumScenario(threat_horizon_year=2035)
    finding_test = Finding(
        finding_id="TEST-003",
        repository="test",
        file_path="tests/test_mock.py",
        line_number=5,
        language="python",
        algorithm=CryptoAlgorithm.RSA,
        function=CryptoFunction.KEY_ESTABLISHMENT,
        usage_context=UsageContext.TEST,
        data_sensitivity=DataSensitivity.CRITICAL,
        data_lifetime_years=30,
        confidence=0.90,
        evidence=Evidence(file_path="tests/test_mock.py", line_number=5, line_content="rsa.generate_private_key()"),
    )
    score, priority, reason = RiskEngine.evaluate_finding(finding_test, scenario)
    assert priority == QuantumExposure.LOW


# ---------------------------------------------------------
# 3. Migration Planner Tests (NIST FIPS 203/204/205)
# ---------------------------------------------------------
def test_function_aware_migration_planning():
    # RSA Key Establishment -> Must recommend ML-KEM (FIPS 203), NOT a signature scheme!
    finding_kem = Finding(
        finding_id="F-KEM",
        repository="test",
        file_path="crypto.py",
        line_number=1,
        language="python",
        algorithm=CryptoAlgorithm.RSA,
        function=CryptoFunction.KEY_ESTABLISHMENT,
        evidence=Evidence(file_path="crypto.py", line_number=1, line_content="PKCS1_OAEP"),
    )
    target_kem, strat_kem, _ = MigrationPlanner.plan_migration(finding_kem)
    assert target_kem in (PQCTarget.ML_KEM_768, PQCTarget.ML_KEM_1024)
    assert "FIPS 203" in strat_kem

    # RSA Signature -> Must recommend ML-DSA (FIPS 204), NOT a KEM!
    finding_sig = Finding(
        finding_id="F-SIG",
        repository="test",
        file_path="jwt.py",
        line_number=1,
        language="python",
        algorithm=CryptoAlgorithm.RSA,
        function=CryptoFunction.DIGITAL_SIGNATURE,
        evidence=Evidence(file_path="jwt.py", line_number=1, line_content="PKCS1v15"),
    )
    target_sig, strat_sig, _ = MigrationPlanner.plan_migration(finding_sig)
    assert target_sig == PQCTarget.ML_DSA_65
    assert "FIPS 204" in strat_sig

    # Bootloader firmware signing -> Must recommend SLH-DSA (FIPS 205)
    finding_boot = Finding(
        finding_id="F-BOOT",
        repository="test",
        file_path="bootloader_signer.py",
        line_number=1,
        language="python",
        algorithm=CryptoAlgorithm.RSA,
        function=CryptoFunction.DIGITAL_SIGNATURE,
        evidence=Evidence(file_path="bootloader_signer.py", line_number=1, line_content="padding.PSS"),
    )
    target_boot, strat_boot, _ = MigrationPlanner.plan_migration(finding_boot)
    assert target_boot == PQCTarget.SLH_DSA_SHA2_128F
    assert "FIPS 205" in strat_boot


# ---------------------------------------------------------
# 4. Time Machine Recalculation Tests
# ---------------------------------------------------------
def test_time_machine_scenario_shift():
    # If we shift scenario from 2040 to 2029 (accelerated threat):
    # A finding with 7-year lifetime (expires 2033) is safe under 2040, but vulnerable under 2029!
    finding = Finding(
        finding_id="TM-001",
        repository="test",
        file_path="gateway.py",
        line_number=1,
        language="python",
        algorithm=CryptoAlgorithm.RSA,
        function=CryptoFunction.KEY_ESTABLISHMENT,
        data_sensitivity=DataSensitivity.HIGH,
        data_lifetime_years=7,  # Expires 2033
        confidence=0.90,
        evidence=Evidence(file_path="gateway.py", line_number=1, line_content="encrypt()"),
    )

    result_2040 = TimeMachineEngine.simulate_year([finding], scenario_year=2040)
    result_2029 = TimeMachineEngine.simulate_year([finding], scenario_year=2029)

    score_2040 = result_2040["findings"][0].risk_score
    score_2029 = result_2029["findings"][0].risk_score

    assert score_2029 > score_2040


# ---------------------------------------------------------
# 5. Readiness Engine Tests
# ---------------------------------------------------------
def test_readiness_calculation():
    f1 = Finding(
        finding_id="R-1", repository="test", file_path="a.py", line_number=1, language="python",
        algorithm=CryptoAlgorithm.RSA,
        function=CryptoFunction.KEY_ESTABLISHMENT, priority=QuantumExposure.HIGH,
        migration_status=MigrationStatus.NOT_STARTED,
        evidence=Evidence(file_path="a.py", line_number=1, line_content=""),
    )
    f2 = Finding(
        finding_id="R-2", repository="test", file_path="b.py", line_number=1, language="python",
        algorithm=CryptoAlgorithm.ECDSA,
        function=CryptoFunction.DIGITAL_SIGNATURE, priority=QuantumExposure.HIGH,
        migration_status=MigrationStatus.COMPLETED,
        evidence=Evidence(file_path="b.py", line_number=1, line_content=""),
    )

    readiness = ReadinessEngine.calculate_readiness([f1, f2])
    assert readiness["readiness_score"] == 50.0
    assert readiness["completed_count"] == 1
    assert readiness["not_started_count"] == 1


# ---------------------------------------------------------
# 6. Scanner Security Tests
# ---------------------------------------------------------
def test_scanner_security_path_traversal():
    base = Path("d:/Q-LIFELOCK").resolve()
    with pytest.raises(SecurityException):
        ScannerSecurity.resolve_safe_path(base, "../../../windows/system32/cmd.exe")


# ---------------------------------------------------------
# 7. Quantum Adapter Tests
# ---------------------------------------------------------
def test_toy_shor_factoring_15():
    res = QuantumAdapter.run_toy_shor_factoring(N=15, a=7)
    assert res["status"] == "success"
    assert res["target_integer"] == 15
    assert res["derived_factors"] == [3, 5]

def test_resource_estimates():
    est = QuantumAdapter.get_resource_estimates("RSA", 2048)
    assert est is not None
    assert est["logical_qubits"] == 4098


# ---------------------------------------------------------
# 8. Full Scanner Engine on Synthetic Fixture Repository
# ---------------------------------------------------------
def test_full_scanner_on_synthetic_repo():
    fixture_dir = Path("tests/fixtures/synthetic_repo").resolve()
    assert fixture_dir.exists()

    summary = ScannerEngine.scan_directory(fixture_dir, repository_name="synthetic_repo", scenario_year=2035)
    assert summary.total_files_scanned >= 5
    assert summary.total_findings >= 5

    # Check for RSA, ECDSA, ECDH presence
    algos = {f.algorithm for f in summary.findings}
    assert CryptoAlgorithm.RSA in algos
    assert CryptoAlgorithm.ECDSA in algos
    assert CryptoAlgorithm.ECDH in algos

    # Check that high or critical exposures are detected for patient health / financial records
    priorities = {f.priority for f in summary.findings}
    assert (QuantumExposure.CRITICAL in priorities) or (QuantumExposure.HIGH in priorities)
