"use client";

import React, { useState } from "react";
import { Finding, MigrationStatus } from "../types";
import { ConceptTrigger } from "./ConceptTrigger";

interface FindingsTabProps {
  findings: Finding[];
  onSelectFinding: (finding: Finding) => void;
  onUpdateStatus: (findingId: string, status: MigrationStatus) => void;
  onOpenConcept?: (key: string) => void;
}

export const FindingsTab: React.FC<FindingsTabProps> = ({
  findings = [],
  onSelectFinding,
  onUpdateStatus,
  onOpenConcept,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlgo, setSelectedAlgo] = useState("ALL");
  const [selectedPriority, setSelectedPriority] = useState("ALL");
  const [selectedContext, setSelectedContext] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const safeFindings = Array.isArray(findings) ? findings : [];

  const filtered = safeFindings.filter((f) => {
    if (!f) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const lineContent = f.evidence?.line_content || "";
      const matchText = `${f.finding_id || ""} ${f.algorithm || ""} ${f.file_path || ""} ${lineContent} ${f.data_class || ""}`.toLowerCase();
      if (!matchText.includes(term)) return false;
    }
    if (selectedAlgo !== "ALL" && f.algorithm !== selectedAlgo) return false;
    if (selectedPriority !== "ALL" && f.priority !== selectedPriority) return false;
    if (selectedContext !== "ALL" && f.usage_context !== selectedContext) return false;
    if (selectedStatus !== "ALL" && f.migration_status !== selectedStatus) return false;
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Information Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.5rem",
          padding: "0.75rem 1rem",
          backgroundColor: "var(--surface-subtle)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-default)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>
            Showing {filtered.length} of {safeFindings.length} cryptographic assets
          </span>
          <span style={{ color: "var(--text-muted)" }}>•</span>
          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            Priority is derived from: Algorithm + Data Lifetime + Usage Context
          </span>
        </div>
        {onOpenConcept && (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <ConceptTrigger conceptKey="lifetime" label="How is priority scored?" onOpenConcept={onOpenConcept} />
            <ConceptTrigger conceptKey="nist" label="NIST PQC Targets" onOpenConcept={onOpenConcept} />
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Filter findings by file, code, algorithm, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="select-control"
          value={selectedAlgo}
          onChange={(e) => setSelectedAlgo(e.target.value)}
        >
          <option value="ALL">All Algorithms</option>
          <option value="RSA">RSA</option>
          <option value="ECDSA">ECDSA</option>
          <option value="ECDH">ECDH</option>
          <option value="AES">AES</option>
        </select>

        <select
          className="select-control"
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
        >
          <option value="ALL">All Risk Priorities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        <select
          className="select-control"
          value={selectedContext}
          onChange={(e) => setSelectedContext(e.target.value)}
        >
          <option value="ALL">All Contexts</option>
          <option value="production">Production</option>
          <option value="test">Test / Mock</option>
        </select>

        <select
          className="select-control"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="not_started">Not Started</option>
          <option value="planned">Planned</option>
          <option value="in_progress">In Progress</option>
          <option value="validated">Validated</option>
          <option value="completed">Completed</option>
        </select>

        {(searchTerm || selectedAlgo !== "ALL" || selectedPriority !== "ALL" || selectedContext !== "ALL" || selectedStatus !== "ALL") && (
          <button
            className="btn btn-outline btn-sm"
            onClick={() => {
              setSearchTerm("");
              setSelectedAlgo("ALL");
              setSelectedPriority("ALL");
              setSelectedContext("ALL");
              setSelectedStatus("ALL");
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Findings Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Finding ID</th>
              <th>Algorithm</th>
              <th>Function</th>
              <th>File & Line</th>
              <th>Data Lifetime</th>
              <th>Priority</th>
              <th>Risk Score</th>
              <th>PQC Target</th>
              <th>Workflow Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                  No cryptographic findings match the selected filter criteria.
                </td>
              </tr>
            ) : (
              filtered.map((finding) => {
                const priority = finding.priority || "UNKNOWN";
                const priorityClass = `badge-risk-${priority.toLowerCase()}`;
                const funcDisplay = String(finding.function || "unknown").replace(/_/g, " ");
                const riskScore = Number(finding.risk_score || 0).toFixed(1);

                return (
                  <tr key={finding.finding_id} onClick={() => onSelectFinding(finding)}>
                    <td className="font-mono" style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                      {finding.finding_id}
                    </td>
                    <td>
                      <strong>{finding.algorithm}</strong>
                      {finding.key_size && (
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: "4px" }}>
                          ({finding.key_size}-bit)
                        </span>
                      )}
                    </td>
                    <td>
                      <span style={{ textTransform: "capitalize", fontSize: "0.8rem" }}>
                        {funcDisplay}
                      </span>
                    </td>
                    <td className="font-mono">
                      {finding.file_path}:{finding.line_number}
                      {finding.usage_context === "test" && (
                        <span
                          className="badge-status status-not_started"
                          style={{ marginLeft: "6px", fontSize: "0.65rem" }}
                        >
                          TEST
                        </span>
                      )}
                    </td>
                    <td>
                      {finding.data_lifetime_years !== undefined && finding.data_lifetime_years !== null ? (
                        <span style={{ fontWeight: 600 }}>
                          {finding.data_lifetime_years} yrs
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-muted)" }}>Unknown</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge-risk ${priorityClass}`}>
                        {priority}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                        {riskScore}
                      </span>
                    </td>
                    <td>
                      {finding.recommended_pqc_target ? (
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: "var(--text-primary)",
                          }}
                        >
                          {finding.recommended_pqc_target}
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Safe (AES)</span>
                      )}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <select
                        className="select-control"
                        style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                        value={finding.migration_status || "not_started"}
                        onChange={(e) =>
                          onUpdateStatus(finding.finding_id, e.target.value as MigrationStatus)
                        }
                      >
                        <option value="not_started">Not Started</option>
                        <option value="planned">Planned</option>
                        <option value="in_progress">In Progress</option>
                        <option value="validated">Validated</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectFinding(finding);
                        }}
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
