"use client";

import React from "react";
import { Finding, MigrationStatus } from "../types";
import { ConceptTrigger } from "./ConceptTrigger";
import { IconCode, IconClock, IconAlertTriangle, IconShield } from "./Icons";

interface FindingDrawerProps {
  finding: Finding | null;
  onClose: () => void;
  onUpdateStatus: (findingId: string, status: MigrationStatus) => void;
  onOpenConcept?: (key: string) => void;
}

export const FindingDrawer: React.FC<FindingDrawerProps> = ({
  finding,
  onClose,
  onUpdateStatus,
  onOpenConcept,
}) => {
  if (!finding) return null;

  const currentYear = 2026;
  const lifetime = finding.data_lifetime_years || 0;
  const expirationYear = currentYear + lifetime;
  const crqcYear = 2035;
  const overlap = Math.max(0, expirationYear - crqcYear);
  const priority = finding.priority || "UNKNOWN";
  const riskScore = Number(finding.risk_score || 0).toFixed(1);
  const funcDisplay = String(finding.function || "unknown").replace(/_/g, " ");

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span className={`badge-risk badge-risk-${priority.toLowerCase()}`}>
              {priority}
            </span>
            <div>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
                {finding.finding_id}: {finding.algorithm}
              </h2>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                {funcDisplay} in {finding.file_path}:{finding.line_number}
              </span>
            </div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Quick Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.75rem" }}>
            <div style={{ padding: "0.75rem", backgroundColor: "var(--surface-subtle)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-default)" }}>
              <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", fontWeight: 600 }}>Risk Score</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700, fontFamily: "var(--font-mono)" }}>{riskScore} / 100</div>
            </div>
            <div style={{ padding: "0.75rem", backgroundColor: "var(--surface-subtle)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-default)" }}>
              <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", fontWeight: 600 }}>Required Lifetime</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                {finding.data_lifetime_years !== undefined && finding.data_lifetime_years !== null
                  ? `${finding.data_lifetime_years} Years`
                  : "Unknown"}
              </div>
            </div>
            <div style={{ padding: "0.75rem", backgroundColor: "var(--surface-subtle)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-default)" }}>
              <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", fontWeight: 600 }}>Usage Context</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700, textTransform: "capitalize" }}>
                {finding.usage_context || "production"}
              </div>
            </div>
            <div style={{ padding: "0.75rem", backgroundColor: "var(--surface-subtle)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-default)" }}>
              <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", fontWeight: 600 }}>PQC Target</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>
                {finding.recommended_pqc_target || "N/A (Safe)"}
              </div>
            </div>
          </div>

          {/* Code Evidence */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
              <IconCode size={15} color="var(--text-primary)" />
              <h4 style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                Cryptographic Source Evidence
              </h4>
            </div>
            <div className="code-box">
              <code>
                {`// ${finding.file_path}:${finding.line_number}\n` +
                  (finding.evidence?.surrounding_context || finding.evidence?.line_content || "")}
              </code>
            </div>
          </div>

          {/* HNDL Timeline Analysis */}
          <div
            style={{
              padding: "1rem",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--surface-subtle)",
              border: overlap > 0 ? "1.5px solid var(--text-primary)" : "1px solid var(--border-default)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <IconClock size={16} color="var(--text-primary)" />
                <h4 style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  Harvest-Now-Decrypt-Later (HNDL) Analysis
                </h4>
              </div>
              {onOpenConcept && (
                <ConceptTrigger conceptKey="hndl" label="Explain HNDL" onOpenConcept={onOpenConcept} />
              )}
            </div>
            <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              {finding.priority_reason || "Analyzed against CRQC arrival horizon."}
            </p>
            {overlap > 0 && (
              <div style={{ marginTop: "0.5rem", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <IconAlertTriangle size={14} color="var(--text-primary)" />
                <span>Decryption vulnerability window: {overlap} years past CRQC horizon ({crqcYear} to {expirationYear}).</span>
              </div>
            )}
          </div>

          {/* Migration Recommendations */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <IconShield size={15} color="var(--text-primary)" />
                <h4 style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                  Actionable Post-Quantum Migration Strategy
                </h4>
              </div>
              {onOpenConcept && (
                <ConceptTrigger conceptKey="nist" label="NIST Standards" onOpenConcept={onOpenConcept} />
              )}
            </div>
            <div
              style={{
                padding: "1rem",
                backgroundColor: "var(--surface-subtle)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-default)",
                fontSize: "0.825rem",
                lineHeight: 1.6,
                color: "var(--text-secondary)",
              }}
            >
              {finding.migration_strategy || "Follow NIST FIPS 203/204 transition guidelines."}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginRight: "auto" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 600 }}>Workflow Status:</span>
            <select
              className="select-control"
              style={{ padding: "0.3rem 0.65rem", fontSize: "0.78rem" }}
              value={finding.migration_status || "not_started"}
              onChange={(e) => onUpdateStatus(finding.finding_id, e.target.value as MigrationStatus)}
            >
              <option value="not_started">Not Started</option>
              <option value="planned">Planned</option>
              <option value="in_progress">In Progress</option>
              <option value="validated">Validated</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
