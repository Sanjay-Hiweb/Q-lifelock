"use client";

import React, { useState, useEffect } from "react";
import { Finding, TimeMachineSimulationResult } from "../types";
import { ApiService } from "../services/api";
import { ConceptTrigger } from "./ConceptTrigger";
import { IconClock, IconSliders, IconAlertTriangle, IconCheck } from "./Icons";

interface TimeMachineTabProps {
  findings: Finding[];
  currentScenarioYear: number;
  onOpenConcept?: (key: string) => void;
}

export const TimeMachineTab: React.FC<TimeMachineTabProps> = ({
  findings = [],
  currentScenarioYear = 2035,
  onOpenConcept,
}) => {
  const [scenarioYear, setScenarioYear] = useState<number>(currentScenarioYear);
  const [simulation, setSimulation] = useState<TimeMachineSimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const runSimulation = async () => {
      setLoading(true);
      const safeFindings = Array.isArray(findings) ? findings : [];
      const res = await ApiService.simulateTimeMachine(scenarioYear, safeFindings);
      if (!isCancelled) {
        setSimulation(res);
        setLoading(false);
      }
    };
    runSimulation();
    return () => {
      isCancelled = true;
    };
  }, [scenarioYear, findings]);

  const presets = [
    { label: "Aggressive (2029 CRQC)", year: 2029, desc: "Nation-state breakthrough" },
    { label: "Consensus Baseline (2035 CRQC)", year: 2035, desc: "NIST & industry consensus" },
    { label: "Conservative (2040 CRQC)", year: 2040, desc: "Extended hardware fault-tolerance scaling" },
  ];

  const currentYear = 2026;
  const shiftList = React.useMemo(() => {
    if (Array.isArray(simulation?.detailed_shifts) && simulation.detailed_shifts.length > 0) {
      return simulation.detailed_shifts;
    }
    if (Array.isArray(simulation?.shifts) && simulation.shifts.length > 0) {
      return simulation.shifts;
    }
    const sourceFindings = Array.isArray(simulation?.findings) && simulation.findings.length > 0
      ? simulation.findings
      : Array.isArray(findings)
      ? findings
      : [];

    return sourceFindings.map((f) => {
      const lifetime = f.data_lifetime_years || 0;
      const expiryYear = currentYear + lifetime;
      const isExposed = expiryYear > scenarioYear;
      const overlap = Math.max(0, expiryYear - scenarioYear);
      let simulatedPriority = f.priority || "LOW";
      let simulatedScore = Number(f.risk_score || 0);

      if (f.usage_context === "test") {
        simulatedPriority = "LOW";
        simulatedScore = 15;
      } else if (f.algorithm === "AES") {
        simulatedPriority = "LOW";
        simulatedScore = 20;
      } else if (overlap > 10) {
        simulatedPriority = "CRITICAL";
        simulatedScore = Math.min(100, 75 + overlap * 1.5);
      } else if (overlap > 0) {
        simulatedPriority = "HIGH";
        simulatedScore = Math.min(85, 60 + overlap * 2);
      } else if (scenarioYear <= 2030) {
        simulatedPriority = "MEDIUM";
        simulatedScore = 50;
      } else {
        simulatedPriority = "LOW";
        simulatedScore = 25;
      }

      return {
        finding_id: f.finding_id,
        algorithm: f.algorithm,
        file_path: f.file_path,
        old_priority: f.priority || "UNKNOWN",
        new_priority: simulatedPriority,
        old_risk_score: Number(f.risk_score || 0),
        new_risk_score: Number(simulatedScore.toFixed(1)),
        data_lifetime_years: f.data_lifetime_years,
        hndl_exposed: isExposed,
        overlap_years: overlap,
      };
    });
  }, [simulation, findings, scenarioYear]);

  const exposureCounts = React.useMemo(() => {
    if (simulation?.exposure_counts && typeof simulation.exposure_counts === "object") {
      return simulation.exposure_counts;
    }
    return {
      CRITICAL: shiftList.filter((s) => s.new_priority === "CRITICAL").length,
      HIGH: shiftList.filter((s) => s.new_priority === "HIGH").length,
      MEDIUM: shiftList.filter((s) => s.new_priority === "MEDIUM").length,
      LOW: shiftList.filter((s) => s.new_priority === "LOW").length,
      UNKNOWN: 0,
    };
  }, [simulation, shiftList]);

  return (
    <div className="time-machine-container">
      {/* Interactive Scrubber Card */}
      <div className="scrubber-panel">
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <IconClock size={18} color="var(--text-primary)" />
                  <span>Quantum Time Machine Projection</span>
                </h2>
                {onOpenConcept && (
                  <>
                    <ConceptTrigger conceptKey="crqc" label="CRQC Emergence" onOpenConcept={onOpenConcept} />
                    <ConceptTrigger conceptKey="hndl" label="Simulation Methodology" onOpenConcept={onOpenConcept} />
                  </>
                )}
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                Shift the projected quantum arrival horizon and observe in real-time which data becomes exposed.
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setShowExplanation(!showExplanation)}
                style={{ fontSize: "0.78rem" }}
              >
                {showExplanation ? "Hide Explanation ▲" : "How does this work? ▼"}
              </button>
              <div
                style={{
                  fontSize: "2.4rem",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-mono)",
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                }}
              >
                {scenarioYear}
              </div>
            </div>
          </div>
        </div>

        {/* How this works explainer box */}
        {showExplanation && (
          <div
            style={{
              padding: "1rem 1.25rem",
              backgroundColor: "var(--surface-subtle)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-default)",
              fontSize: "0.825rem",
              lineHeight: 1.6,
            }}
          >
            <strong>How the Time Machine works:</strong>
            <p style={{ color: "var(--text-secondary)", marginTop: "0.25rem" }}>
              Every cryptographic asset has an expiration year: <code>Current Year (2026) + Required Data Lifetime</code>.
              When you drag the slider to an earlier year (e.g. <strong>2029</strong>), data that expires in 2033 or 2036 suddenly becomes vulnerable because a quantum computer will exist before the data expires!
            </p>
          </div>
        )}

        {/* Timeline Slider */}
        <div className="slider-row">
          <input
            type="range"
            min={2027}
            max={2045}
            step={1}
            value={scenarioYear}
            onChange={(e) => setScenarioYear(parseInt(e.target.value, 10))}
            className="timeline-slider"
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.72rem",
              color: "var(--text-muted)",
              fontWeight: 600,
              fontFamily: "var(--font-mono)",
            }}
          >
            <span>2027 (Imminent Threat)</span>
            <span>2035 (NIST Target)</span>
            <span>2045 (Conservative)</span>
          </div>
        </div>

        {/* Presets */}
        <div className="preset-pills">
          <span style={{ fontSize: "0.75rem", fontWeight: 700, alignSelf: "center", marginRight: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
            Scenario Presets:
          </span>
          {presets.map((preset) => (
            <button
              key={preset.year}
              className={`preset-pill-btn ${scenarioYear === preset.year ? "active" : ""}`}
              onClick={() => setScenarioYear(preset.year)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Simulation Result Statistics */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div className="metrics-grid">
          <div className="metric-card critical-card">
            <span className="metric-label">
              Simulated Critical Exposure
            </span>
            <div className="metric-value-row">
              <span className="metric-value">
                {exposureCounts.CRITICAL || 0}
              </span>
              <span className="metric-subtext">assets at immediate risk</span>
            </div>
          </div>

          <div className="metric-card high-card">
            <span className="metric-label">
              Simulated High Exposure
            </span>
            <div className="metric-value-row">
              <span className="metric-value">
                {exposureCounts.HIGH || 0}
              </span>
              <span className="metric-subtext">assets near horizon</span>
            </div>
          </div>

          <div className="metric-card">
            <span className="metric-label">Simulated Medium Exposure</span>
            <div className="metric-value-row">
              <span className="metric-value">
                {exposureCounts.MEDIUM || 0}
              </span>
              <span className="metric-subtext">assets moderate risk</span>
            </div>
          </div>

          <div className="metric-card">
            <span className="metric-label">Simulated Low / Safe</span>
            <div className="metric-value-row">
              <span className="metric-value">
                {exposureCounts.LOW || 0}
              </span>
              <span className="metric-subtext">assets protected</span>
            </div>
          </div>
        </div>

        {/* Delta Shifts Table */}
        <div className="card">
          <div className="card-title-row">
            <h3 className="card-title">
              <IconSliders size={16} color="var(--text-primary)" />
              <span>Threat Horizon Impact Analysis ({scenarioYear})</span>
            </h3>
            {loading && (
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                Recalculating...
              </span>
            )}
          </div>
          <p className="card-description">
            Comparing how cryptographic assets shift across risk tiers as the CRQC emergence date changes.
          </p>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Finding ID</th>
                  <th>Algorithm</th>
                  <th>File Location</th>
                  <th>Data Lifetime</th>
                  <th>Baseline Priority</th>
                  <th>Simulated Priority</th>
                  <th>Risk Score Delta</th>
                  <th>HNDL Overlap Window</th>
                </tr>
              </thead>
              <tbody>
                {shiftList.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "1.5rem", color: "var(--text-muted)" }}>
                      No shifts recorded for this scenario.
                    </td>
                  </tr>
                ) : (
                  shiftList.map((shift) => {
                    const oldScore = Number(shift.old_risk_score || 0);
                    const newScore = Number(shift.new_risk_score || 0);
                    const scoreDiff = newScore - oldScore;
                    const diffSign = scoreDiff > 0 ? `+${scoreDiff.toFixed(1)}` : scoreDiff.toFixed(1);
                    const oldPri = shift.old_priority || "UNKNOWN";
                    const newPri = shift.new_priority || "UNKNOWN";

                    return (
                      <tr key={shift.finding_id}>
                        <td className="font-mono" style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                          {shift.finding_id}
                        </td>
                        <td>
                          <strong>{shift.algorithm}</strong>
                        </td>
                        <td className="font-mono">{shift.file_path}</td>
                        <td>
                          {shift.data_lifetime_years !== undefined && shift.data_lifetime_years !== null
                            ? `${shift.data_lifetime_years} yrs`
                            : "N/A"}
                        </td>
                        <td>
                          <span className={`badge-risk badge-risk-${oldPri.toLowerCase()}`}>
                            {oldPri}
                          </span>
                        </td>
                        <td>
                          <span className={`badge-risk badge-risk-${newPri.toLowerCase()}`}>
                            {newPri}
                          </span>
                        </td>
                        <td className="font-mono" style={{ fontWeight: 700 }}>
                          {diffSign}
                        </td>
                        <td>
                          {shift.hndl_exposed ? (
                            <span style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: "0.35rem" }}>
                              <IconAlertTriangle size={13} color="var(--text-primary)" />
                              <span>{shift.overlap_years} yrs post-CRQC</span>
                            </span>
                          ) : (
                            <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                              <IconCheck size={13} color="var(--text-muted)" />
                              <span>No overlap</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
