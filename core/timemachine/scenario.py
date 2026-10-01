"""Time Machine scenario engine for Q-LIFELOCK."""
from typing import List, Dict, Any
from copy import deepcopy
from core.domain.models import Finding, QuantumScenario, QuantumExposure
from core.domain.lifetime import assess_hndl_exposure_window
from core.risk.engine import RiskEngine


class TimeMachineEngine:
    """
    Time Machine scenario recalculator.
    
    Allows selecting any target CRQC arrival year (e.g. 2029, 2033, 2035, 2040)
    and deterministically recalculates quantum exposure and priority changes.
    """

    PRESET_SCENARIOS = {
        2029: QuantumScenario(
            scenario_id="aggressive_2029",
            name="Aggressive Acceleration (2029)",
            threat_horizon_year=2029,
            crqc_arrival_year=2029,
            hndl_active=True,
            description="Accelerated quantum breakthrough scenario; immediate urgent migration required.",
        ),
        2035: QuantumScenario(
            scenario_id="standard_2035",
            name="Standard Industry Consensus (2035)",
            threat_horizon_year=2035,
            crqc_arrival_year=2035,
            hndl_active=True,
            description="NIST deprecation and projected commercial fault-tolerant quantum computing timeline.",
        ),
        2040: QuantumScenario(
            scenario_id="conservative_2040",
            name="Conservative Horizon (2040)",
            threat_horizon_year=2040,
            crqc_arrival_year=2040,
            hndl_active=True,
            description="Extended quantum scaling horizon with longer development cycles for fault-tolerant qubits.",
        ),
    }

    @classmethod
    def get_scenario(cls, year: int) -> QuantumScenario:
        if year in cls.PRESET_SCENARIOS:
            return cls.PRESET_SCENARIOS[year]
        return QuantumScenario(
            scenario_id=f"custom_{year}",
            name=f"Custom Scenario ({year})",
            threat_horizon_year=year,
            crqc_arrival_year=year,
            hndl_active=True,
            description=f"Custom quantum threat horizon evaluated for year {year}.",
        )

    @classmethod
    def simulate_year(
        cls,
        findings: List[Finding],
        scenario_year: int,
        analysis_year: int = 2026,
    ) -> Dict[str, Any]:
        """
        Recalculate all findings under the specified scenario year.
        
        Returns:
            Dict containing:
                - scenario_year
                - scenario_details
                - updated_findings
                - priority_shifts (count of increased, decreased, unchanged)
                - exposure_counts (critical, high, medium, low)
        """
        scenario = cls.get_scenario(scenario_year)
        updated_findings: List[Finding] = []
        shifts = {"increased": 0, "decreased": 0, "unchanged": 0}
        counts = {
            QuantumExposure.CRITICAL.value: 0,
            QuantumExposure.HIGH.value: 0,
            QuantumExposure.MEDIUM.value: 0,
            QuantumExposure.LOW.value: 0,
            QuantumExposure.UNKNOWN.value: 0,
        }

        order_map = {
            QuantumExposure.LOW: 1,
            QuantumExposure.MEDIUM: 2,
            QuantumExposure.HIGH: 3,
            QuantumExposure.CRITICAL: 4,
            QuantumExposure.UNKNOWN: 0,
        }

        for orig in findings:
            item = orig.model_copy(deep=True)
            old_priority = item.priority
            new_score, new_priority, rationale = RiskEngine.evaluate_finding(
                finding=item,
                scenario=scenario,
                analysis_year=analysis_year,
            )
            item.risk_score = new_score
            item.priority = new_priority
            item.quantum_exposure = new_priority
            item.priority_reason = rationale
            updated_findings.append(item)

            counts[new_priority.value] = counts.get(new_priority.value, 0) + 1

            old_rank = order_map.get(old_priority, 0)
            new_rank = order_map.get(new_priority, 0)
            if new_rank > old_rank:
                shifts["increased"] += 1
            elif new_rank < old_rank:
                shifts["decreased"] += 1
            else:
                shifts["unchanged"] += 1

        detailed_shifts = []
        for orig, item in zip(findings, updated_findings):
            hndl_exp, overlap = assess_hndl_exposure_window(
                analysis_year=analysis_year,
                lifetime_years=item.data_lifetime_years,
                crqc_horizon_year=scenario_year,
            )
            detailed_shifts.append({
                "finding_id": item.finding_id,
                "algorithm": item.algorithm.value if hasattr(item.algorithm, "value") else str(item.algorithm),
                "file_path": item.file_path,
                "old_priority": orig.priority.value if hasattr(orig.priority, "value") else str(orig.priority),
                "new_priority": item.priority.value if hasattr(item.priority, "value") else str(item.priority),
                "old_risk_score": orig.risk_score,
                "new_risk_score": item.risk_score,
                "data_lifetime_years": item.data_lifetime_years,
                "hndl_exposed": hndl_exp,
                "overlap_years": overlap,
            })

        return {
            "scenario_year": scenario_year,
            "scenario": scenario.model_dump(),
            "shifts": shifts,
            "detailed_shifts": detailed_shifts,
            "exposure_counts": counts,
            "findings": updated_findings,
        }

