"""
Repository Scanner Engine for Q-LIFELOCK.

Orchestrates:
1. Safe file discovery and sandbox containment
2. Cryptographic usage detection
3. Provenance and evidence preservation
4. Risk assessment
5. Migration planning
6. Quantum readiness evaluation
"""
import os
import time
from pathlib import Path
from typing import List, Optional
from core.domain.models import (
    Finding,
    ScanSummary,
    QuantumScenario,
    QuantumExposure,
)
from core.scanner.security import ScannerSecurity
from core.scanner.detectors import CryptoDetector
from core.risk.engine import RiskEngine
from core.migration.planner import MigrationPlanner
from core.readiness.metric import ReadinessEngine


class ScannerEngine:
    """End-to-end scanner execution engine."""

    @classmethod
    def scan_directory(
        cls,
        target_dir: str | Path,
        repository_name: Optional[str] = None,
        scenario_year: int = 2035,
    ) -> ScanSummary:
        """
        Scan a local directory safely, producing an explainable ScanSummary.
        """
        base_path = Path(target_dir).resolve()
        repo_name = repository_name or base_path.name
        start_time = time.time()

        all_findings: List[Finding] = []
        files_scanned = 0

        scenario = QuantumScenario(
            scenario_id=f"scan_scenario_{scenario_year}",
            name=f"Threat Horizon {scenario_year}",
            threat_horizon_year=scenario_year,
            crqc_arrival_year=scenario_year,
        )

        # Safe directory traversal
        for root, dirs, files in os.walk(base_path):
            # Mutate dirs in place to skip ignored directories
            dirs[:] = [d for d in dirs if d not in ScannerSecurity.IGNORE_DIRS and not d.startswith(".")]

            for file_name in files:
                if files_scanned >= ScannerSecurity.MAX_TOTAL_FILES:
                    break

                file_path = Path(root) / file_name
                try:
                    safe_file = ScannerSecurity.resolve_safe_path(base_path, str(file_path.relative_to(base_path)))
                except Exception:
                    continue

                if not ScannerSecurity.is_safe_file(safe_file):
                    continue

                # Read text content safely
                try:
                    with open(safe_file, "r", encoding="utf-8", errors="replace") as f:
                        content = f.read(ScannerSecurity.MAX_FILE_SIZE_BYTES)
                except Exception:
                    continue

                files_scanned += 1
                rel_path = str(file_path.relative_to(base_path)).replace("\\", "/")

                # Detect cryptographic usage
                raw_findings = CryptoDetector.scan_file_content(
                    file_path=rel_path,
                    content=content,
                    repository_name=repo_name,
                )

                # Enrich findings with Risk Engine & Migration Planner
                for finding in raw_findings:
                    score, exposure, reason = RiskEngine.evaluate_finding(
                        finding=finding,
                        scenario=scenario,
                    )
                    finding.risk_score = score
                    finding.quantum_exposure = exposure
                    finding.priority = exposure
                    finding.priority_reason = reason

                    pqc_target, strategy, compat = MigrationPlanner.plan_migration(finding)
                    finding.recommended_pqc_target = pqc_target
                    finding.migration_strategy = f"{strategy} Compatibility: {compat}"

                    all_findings.append(finding)

        # Calculate counts
        crit_count = sum(1 for f in all_findings if f.priority == QuantumExposure.CRITICAL)
        high_count = sum(1 for f in all_findings if f.priority == QuantumExposure.HIGH)
        med_count = sum(1 for f in all_findings if f.priority == QuantumExposure.MEDIUM)
        low_count = sum(1 for f in all_findings if f.priority == QuantumExposure.LOW)
        unk_count = sum(1 for f in all_findings if f.priority == QuantumExposure.UNKNOWN)

        # Calculate Readiness
        readiness_result = ReadinessEngine.calculate_readiness(all_findings)

        scan_id = f"SCAN-{int(time.time())}-{repo_name}"

        return ScanSummary(
            scan_id=scan_id,
            repository_path=str(base_path),
            scanned_at=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            total_files_scanned=files_scanned,
            total_findings=len(all_findings),
            critical_count=crit_count,
            high_count=high_count,
            medium_count=med_count,
            low_count=low_count,
            unknown_count=unk_count,
            readiness_score=readiness_result["readiness_score"],
            scenario_year=scenario_year,
            findings=all_findings,
        )
