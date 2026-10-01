"use client";

import React from "react";
import { Finding, MigrationStatus } from "../types";
import { ConceptTrigger } from "./ConceptTrigger";
import { IconShield, IconLayers } from "./Icons";

interface MigrationPlannerTabProps {
  findings: Finding[];
  onUpdateStatus: (findingId: string, status: MigrationStatus) => void;
  onSelectFinding: (finding: Finding) => void;
  onOpenConcept?: (key: string) => void;
}

export const MigrationPlannerTab: React.FC<MigrationPlannerTabProps> = ({
  findings = [],
  onUpdateStatus,
  onSelectFinding,
  onOpenConcept,
}) => {
  const safeFindings = Array.isArray(findings) ? findings : [];

  const statuses: { key: MigrationStatus; label: string; color: string }[] = [
    { key: "not_started", label: "Not Started", color: "var(--text-muted)" },
    { key: "planned", label: "Planned", color: "var(--text-secondary)" },
    { key: "in_progress", label: "In Progress", color: "var(--text-primary)" },
    { key: "validated", label: "Validated", color: "var(--text-primary)" },
    { key: "completed", label: "Completed", color: "var(--text-primary)" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* NIST FIPS Reference Card */}
      <div className="card" style={{ borderTop: "2px solid var(--text-primary)" }}>
        <div className="card-title-row">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <IconShield size={16} color="var(--text-primary)" />
            <h3 className="card-title" style={{ fontSize: "0.92rem" }}>
              NIST Post-Quantum Cryptographic Standards (FIPS 203 / 204 / 205)
            </h3>
            {onOpenConcept && (
              <ConceptTrigger conceptKey="nist" label="FIPS Specifications" onOpenConcept={onOpenConcept} />
            )}
          </div>
        </div>
        <p className="card-description" style={{ fontSize: "0.78rem" }}>
          Federal Information Processing Standards officially ratified by NIST in August 2024.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          <div
            style={{
              padding: "1rem",
              backgroundColor: "var(--surface-subtle)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-default)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ color: "var(--text-primary)", fontSize: "0.95rem" }}>FIPS 203 — ML-KEM</strong>
              <span className="brand-badge">Key Encapsulation</span>
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
              Primary replacement for RSA key exchange and Diffie-Hellman / ECDH. Recommended parameter set: <strong>ML-KEM-768</strong> (NIST Level 3).
            </div>
          </div>

          <div
            style={{
              padding: "1rem",
              backgroundColor: "var(--surface-subtle)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-default)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ color: "var(--text-primary)", fontSize: "0.95rem" }}>FIPS 204 — ML-DSA</strong>
              <span className="brand-badge">Digital Signature</span>
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
              Primary replacement for RSA-PSS and ECDSA signatures in transactions and authentication. Recommended: <strong>ML-DSA-65</strong>.
            </div>
          </div>

          <div
            style={{
              padding: "1rem",
              backgroundColor: "var(--surface-subtle)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-default)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ color: "var(--text-primary)", fontSize: "0.95rem" }}>FIPS 205 — SLH-DSA</strong>
              <span className="brand-badge">Stateless Hash Sig</span>
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
              Stateless hash-based signature scheme. Backstop for firmware updates & long-term certificates without lattice hardness dependencies.
            </div>
          </div>
        </div>
      </div>

      {/* Migration Kanban Columns */}
      <div className="card">
        <div className="card-title-row">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <IconLayers size={16} color="var(--text-primary)" />
            <h3 className="card-title" style={{ fontSize: "0.92rem" }}>Migration Lifecycle Tracking</h3>
          </div>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            Select or change status to dynamically update readiness score
          </span>
        </div>

        <div className="kanban-grid">
          {statuses.map((status) => {
            const columnFindings = safeFindings.filter(
              (f) => (f.migration_status || "not_started") === status.key
            );
            return (
              <div key={status.key} className="kanban-col">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600, fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: status.color, display: "inline-block" }} />
                    <span>{status.label}</span>
                  </span>
                  <span className="tab-badge" style={{ fontWeight: 600, fontFamily: "var(--font-mono)" }}>
                    {columnFindings.length}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {columnFindings.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "1.5rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      No items
                    </div>
                  ) : (
                    columnFindings.map((finding) => {
                      const priority = finding.priority || "UNKNOWN";
                      const funcDisplay = String(finding.function || "unknown").replace(/_/g, " ");

                      return (
                        <div
                          key={finding.finding_id}
                          className="kanban-card"
                          onClick={() => onSelectFinding(finding)}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span className="font-mono" style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--text-primary)" }}>
                              {finding.finding_id}
                            </span>
                            <span className={`badge-risk badge-risk-${priority.toLowerCase()}`} style={{ fontSize: "0.62rem" }}>
                              {priority}
                            </span>
                          </div>

                          <div style={{ fontWeight: 600, fontSize: "0.82rem" }}>
                            {finding.algorithm} — {funcDisplay}
                          </div>

                          <div className="font-mono" style={{ fontSize: "0.7rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {finding.file_path}
                          </div>

                          {finding.recommended_pqc_target && (
                            <div
                              style={{
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                fontFamily: "var(--font-mono)",
                                color: "var(--text-primary)",
                                marginTop: "0.25rem",
                              }}
                            >
                              Target: {finding.recommended_pqc_target}
                            </div>
                          )}

                          <div style={{ marginTop: "0.5rem" }} onClick={(e) => e.stopPropagation()}>
                            <select
                              className="select-control"
                              style={{ width: "100%", padding: "0.2rem 0.4rem", fontSize: "0.7rem" }}
                              value={finding.migration_status || "not_started"}
                              onChange={(e) =>
                                onUpdateStatus(finding.finding_id, e.target.value as MigrationStatus)
                              }
                            >
                              <option value="not_started">Move to: Not Started</option>
                              <option value="planned">Move to: Planned</option>
                              <option value="in_progress">Move to: In Progress</option>
                              <option value="validated">Move to: Validated</option>
                              <option value="completed">Move to: Completed</option>
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
