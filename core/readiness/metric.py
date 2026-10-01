"""Quantum Readiness Metric Calculation."""
from typing import List, Dict, Any
from core.domain.models import Finding, MigrationStatus, QuantumExposure


class ReadinessEngine:
    """
    Computes explainable Quantum Readiness Score (0-100%).
    
    Weights each finding by its risk priority and migration progress.
    """
    
    PROGRESS_WEIGHTS = {
        MigrationStatus.NOT_STARTED: 0.0,
        MigrationStatus.PLANNED: 0.25,
        MigrationStatus.IN_PROGRESS: 0.60,
        MigrationStatus.VALIDATED: 0.90,
        MigrationStatus.COMPLETED: 1.0,
    }

    SEVERITY_WEIGHTS = {
        QuantumExposure.CRITICAL: 4.0,
        QuantumExposure.HIGH: 3.0,
        QuantumExposure.MEDIUM: 2.0,
        QuantumExposure.LOW: 1.0,
        QuantumExposure.UNKNOWN: 1.5,
    }

    @classmethod
    def calculate_readiness(cls, findings: List[Finding]) -> Dict[str, Any]:
        """
        Calculate overall readiness percentage, breakdown, and explainable summary.
        """
        if not findings:
            return {
                "readiness_score": 100.0,
                "completed_count": 0,
                "in_progress_count": 0,
                "planned_count": 0,
                "not_started_count": 0,
                "total_weighted_points": 0.0,
                "max_possible_points": 0.0,
                "summary": "100% Ready — No quantum-vulnerable cryptography identified.",
            }

        total_weighted_progress = 0.0
        max_possible = 0.0

        counts = {
            MigrationStatus.COMPLETED: 0,
            MigrationStatus.VALIDATED: 0,
            MigrationStatus.IN_PROGRESS: 0,
            MigrationStatus.PLANNED: 0,
            MigrationStatus.NOT_STARTED: 0,
        }

        for f in findings:
            status = f.migration_status
            counts[status] = counts.get(status, 0) + 1
            
            sev_wt = cls.SEVERITY_WEIGHTS.get(f.priority, 1.0)
            prog_wt = cls.PROGRESS_WEIGHTS.get(status, 0.0)

            total_weighted_progress += (prog_wt * sev_wt)
            max_possible += sev_wt

        score = round((total_weighted_progress / max_possible) * 100.0, 1) if max_possible > 0 else 100.0

        summary = (
            f"Readiness: {score}% — {counts[MigrationStatus.COMPLETED] + counts[MigrationStatus.VALIDATED]}/{len(findings)} "
            f"remediated/validated findings. {counts[MigrationStatus.NOT_STARTED]} unaddressed exposures."
        )

        return {
            "readiness_score": score,
            "completed_count": counts[MigrationStatus.COMPLETED],
            "validated_count": counts[MigrationStatus.VALIDATED],
            "in_progress_count": counts[MigrationStatus.IN_PROGRESS],
            "planned_count": counts[MigrationStatus.PLANNED],
            "not_started_count": counts[MigrationStatus.NOT_STARTED],
            "total_findings": len(findings),
            "summary": summary,
        }
