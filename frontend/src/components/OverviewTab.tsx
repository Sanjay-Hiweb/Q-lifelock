"use client";

import React, { useState } from "react";
import { ScanSummary } from "../types";
import { ConceptTrigger } from "./ConceptTrigger";
import {
  IconAlertTriangle,
  IconShield,
  IconLayers,
  IconClock,
  IconArrowRight,
  IconSparkles,
} from "./Icons";

interface OverviewTabProps {
  scanSummary: ScanSummary | null;
  onNavigateTab: (tab: string) => void;
  onOpenConcept: (key: string) => void;
  teacherMode?: boolean;
  onToggleTeacherMode?: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  scanSummary,
  onNavigateTab,
  onOpenConcept,
  teacherMode = false,
  onToggleTeacherMode,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<"ledger" | "wire" | "token">("ledger");

  if (!scanSummary) return null;

  const findings = scanSummary.findings || [];

  // Group by algorithm
  const algoCounts: Record<string, number> = {};
  findings.forEach((f) => {
    const algo = f.algorithm || "UNKNOWN";
    algoCounts[algo] = (algoCounts[algo] || 0) + 1;
  });

  // Group by function
  const functionCounts: Record<string, number> = {};
  findings.forEach((f) => {
    const func = f.function || "unknown";
    functionCounts[func] = (functionCounts[func] || 0) + 1;
  });

  // Group by lifetime
  const lifetimeCounts: Record<string, number> = {};
  findings.forEach((f) => {
    const cat = f.data_lifetime_category || "unknown";
    lifetimeCounts[cat] = (lifetimeCounts[cat] || 0) + 1;
  });

  const scenarioYear = scanSummary.scenario_year || 2035;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Top Header / Mode Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.6rem 0.85rem",
          backgroundColor: "var(--surface-default)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-md)",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--text-muted)",
                }}
              >
                System Posture Telemetry
              </span>
              <span style={{ color: "var(--border-strong)" }}>•</span>
              <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                Baseline: <strong>2026</strong> | CRQC Horizon: <strong>{scenarioYear}</strong> | NSA CNSA 2.0 Mandate: <strong>2030</strong>
              </span>
            </div>
          </div>
        </div>

        {onToggleTeacherMode && (
          <div className="segmented-control">
            <button
              type="button"
              className={`segmented-btn ${!teacherMode ? "active" : ""}`}
              onClick={() => teacherMode && onToggleTeacherMode()}
            >
              Telemetry View
            </button>
            <button
              type="button"
              className={`segmented-btn ${teacherMode ? "active" : ""}`}
              onClick={() => !teacherMode && onToggleTeacherMode()}
              style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}
            >
              <IconSparkles size={12} color="currentColor" />
              <span>Threat Intelligence Mode</span>
            </button>
          </div>
        )}
      </div>

      {/* High-Alert HNDL Threat Assessment */}
      <div
        style={{
          backgroundColor: "var(--surface-default)",
          border: "1px solid var(--border-default)",
          borderTop: "3px solid var(--text-primary)",
          borderRadius: "var(--radius-md)",
          padding: "1.25rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <IconAlertTriangle size={18} color="var(--text-primary)" />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  Harvest Now, Decrypt Later (HNDL) Threat Assessment
                </h3>
                <ConceptTrigger conceptKey="hndl" label="HNDL Dynamics" onOpenConcept={onOpenConcept} />
                <ConceptTrigger conceptKey="mosca" label="Mosca's Theorem" onOpenConcept={onOpenConcept} />
              </div>
            </div>
          </div>

          {/* Scenario Segmented Selector */}
          <div className="segmented-control">
            <button
              type="button"
              className={`segmented-btn ${selectedScenario === "ledger" ? "active" : ""}`}
              onClick={() => setSelectedScenario("ledger")}
            >
              30-Yr Master Ledger (Critical)
            </button>
            <button
              type="button"
              className={`segmented-btn ${selectedScenario === "wire" ? "active" : ""}`}
              onClick={() => setSelectedScenario("wire")}
            >
              Interbank Wire Authorization (High)
            </button>
            <button
              type="button"
              className={`segmented-btn ${selectedScenario === "token" ? "active" : ""}`}
              onClick={() => setSelectedScenario("token")}
            >
              15-Min Session Token (Safe)
            </button>
          </div>
        </div>

        {/* Mosca Equation & Core Threat Explanation */}
        <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          Under <strong>Mosca&apos;s Theorem</strong>, when data confidentiality shelf-life (<em>X</em>) plus migration timeline (<em>Y</em>) exceeds the Cryptographically Relevant Quantum Computer emergence horizon (<em>Z</em>), encrypted assets are compromised today. With a projected CRQC horizon of <strong>{scenarioYear}</strong>, long-lived ciphertexts intercepted across network perimeters will be decrypted <strong>prior to their legal confidentiality expiration</strong>.
        </p>

        {/* Dynamic Scenario Intelligence Box */}
        <div
          style={{
            padding: "0.85rem 1rem",
            backgroundColor: "var(--surface-subtle)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-default)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          {selectedScenario === "ledger" && (
            <>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="badge-risk badge-risk-critical">CRITICAL RISK</span>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    30-Year Customer Master Ledger Keys (RSA-2048)
                  </span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  Subject to GLBA &amp; HIPAA retention through 2056. Intercepted ciphertext decrypted at {scenarioYear} CRQC horizon → <strong>21 years of unauthorized plaintext exposure</strong>.
                </div>
              </div>
              <div style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--text-primary)" }}>
                X (30y) + Y (3y) &gt; Z (14y) · Breach Window: 19 Years
              </div>
            </>
          )}

          {selectedScenario === "wire" && (
            <>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="badge-risk badge-risk-high">HIGH INTEGRITY RISK</span>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    Interbank Wire Transfer Authorization Signatures (ECDSA-256)
                  </span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  10-year audit &amp; regulatory non-repudiation requirement. Enables retroactive signature forgery and payment repudiation.
                </div>
              </div>
              <div style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--text-primary)" }}>
                Target: NIST FIPS 204 (ML-DSA-65)
              </div>
            </>
          )}

          {selectedScenario === "token" && (
            <>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="badge-risk badge-risk-low">LOW / NEGLIGIBLE</span>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    15-Minute Web Session Token (RSA-2048)
                  </span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  Ephemeral session token expires within minutes. Quantum decryption in {scenarioYear} grants zero replay access or credential theft.
                </div>
              </div>
              <div style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--text-muted)" }}>
                X (15m) &lt; Z (14y) → Fully Mitigated
              </div>
            </>
          )}
        </div>

        {/* Action CTAs */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.25rem" }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigateTab("findings")}
          >
            <span>Inspect Critical Findings ({scanSummary.critical_count || 0})</span>
            <IconArrowRight size={13} />
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigateTab("timemachine")}
          >
            <span>Simulate in Quantum Time Machine</span>
            <IconArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Analysis Grids: 3-column balanced cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1rem" }}>
        {/* Card 1: Algorithm Inventory */}
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div className="card-title-row">
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <IconShield size={16} color="var(--text-primary)" />
              <h3 className="card-title" style={{ fontSize: "0.9rem" }}>Algorithm Threat Distribution</h3>
            </div>
            <ConceptTrigger conceptKey="shor" label="Shor vs Grover" onOpenConcept={onOpenConcept} />
          </div>

          <p className="card-description" style={{ fontSize: "0.78rem" }}>
            Asymmetric factoring vulnerability (Shor) vs symmetric reduction (Grover).
          </p>

          {teacherMode && (
            <div
              style={{
                padding: "0.5rem 0.65rem",
                backgroundColor: "var(--surface-subtle)",
                borderRadius: "var(--radius-sm)",
                borderLeft: "2px solid var(--text-primary)",
                fontSize: "0.72rem",
                lineHeight: 1.45,
                color: "var(--text-secondary)",
              }}
            >
              <div><strong style={{ color: "var(--text-primary)" }}>Cryptanalysis:</strong> Shor&apos;s algorithm achieves polynomial speedup O((log N)³) to factor RSA primes and solve elliptic curve discrete logs.</div>
              <div style={{ color: "var(--text-muted)", marginTop: "2px" }}>Grover&apos;s algorithm provides quadratic speedup O(√N), leaving AES-256 with 128-bit quantum security margin.</div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "auto" }}>
            {Object.entries(algoCounts).map(([algo, count]) => {
              const isVulnerable = ["RSA", "ECDSA", "ECDH", "DSA", "Diffie-Hellman"].includes(algo);
              const totalFindings = findings.length || 1;
              const pct = ((count / totalFindings) * 100).toFixed(0);
              return (
                <div key={algo} style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
                    <span style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      {algo}
                      <span
                        className={isVulnerable ? "badge-risk badge-risk-critical" : "badge-risk badge-risk-low"}
                        style={{ fontSize: "0.6rem", padding: "1px 5px" }}
                      >
                        {isVulnerable ? "Shor Vulnerable" : "Quantum Resilient"}
                      </span>
                    </span>
                    <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: isVulnerable ? "var(--text-primary)" : "var(--border-strong)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 2: Cryptographic Functions */}
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div className="card-title-row">
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <IconLayers size={16} color="var(--text-primary)" />
              <h3 className="card-title" style={{ fontSize: "0.9rem" }}>Functional Replacements</h3>
            </div>
            <ConceptTrigger conceptKey="nist" label="NIST Standards" onOpenConcept={onOpenConcept} />
          </div>

          <p className="card-description" style={{ fontSize: "0.78rem" }}>
            Target NIST FIPS post-quantum replacements by architectural role.
          </p>

          {teacherMode && (
            <div
              style={{
                padding: "0.5rem 0.65rem",
                backgroundColor: "var(--surface-subtle)",
                borderRadius: "var(--radius-sm)",
                borderLeft: "2px solid var(--text-primary)",
                fontSize: "0.72rem",
                lineHeight: 1.45,
                color: "var(--text-secondary)",
              }}
            >
              <div><strong style={{ color: "var(--text-primary)" }}>NIST Standards:</strong> Ratified August 2024. Key exchange transitions to lattice MLWE; signatures transition to lattice MSIS.</div>
              <div style={{ color: "var(--text-muted)", marginTop: "2px" }}>Mandated under NSA CNSA 2.0 timeline for software by 2030.</div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.82rem" }}>Key Establishment (KEM)</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Target: NIST FIPS 203 (ML-KEM-768)</div>
              </div>
              <span className="badge-status status-planned">
                {functionCounts["key_establishment"] || 0} Assets
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.82rem" }}>Digital Signatures (DSA)</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Target: NIST FIPS 204 (ML-DSA-65)</div>
              </div>
              <span className="badge-status status-in_progress">
                {functionCounts["digital_signature"] || 0} Assets
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.82rem" }}>Authentication &amp; Tokens</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Target: ML-DSA-65 / Ed25519</div>
              </div>
              <span className="badge-status status-validated">
                {functionCounts["authentication"] || 0} Assets
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.82rem" }}>Data-at-Rest Encryption</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Target: AES-256 (CNSA 2.0 Compliant)</div>
              </div>
              <span className="badge-status status-completed">
                {functionCounts["encryption"] || 0} Assets
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Data Lifetime Matrix */}
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div className="card-title-row">
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <IconClock size={16} color="var(--text-primary)" />
              <h3 className="card-title" style={{ fontSize: "0.9rem" }}>Data Retention Risk Matrix</h3>
            </div>
            <ConceptTrigger conceptKey="lifetime" label="Why Lifetime Matters" onOpenConcept={onOpenConcept} />
          </div>

          <p className="card-description" style={{ fontSize: "0.78rem" }}>
            Regulatory confidentiality retention brackets (GLBA, HIPAA, SEC).
          </p>

          {teacherMode && (
            <div
              style={{
                padding: "0.5rem 0.65rem",
                backgroundColor: "var(--surface-subtle)",
                borderRadius: "var(--radius-sm)",
                borderLeft: "2px solid var(--text-primary)",
                fontSize: "0.72rem",
                lineHeight: 1.45,
                color: "var(--text-secondary)",
              }}
            >
              <div><strong style={{ color: "var(--text-primary)" }}>HNDL Economics:</strong> Adversary storage ROI is highest on multi-decade retention data; short-lived tokens offer zero quantum payoff.</div>
              <div style={{ color: "var(--text-muted)", marginTop: "2px" }}>Priority is computed as: Severity = f(Algorithm, Retention, T_CRQC - T_current).</div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", marginTop: "auto" }}>
            {Object.entries(lifetimeCounts).map(([cat, count]) => {
              const isLong = ["30+_years", "20-30_years", "10-20_years", "5-10_years"].includes(cat);
              const displayCat = String(cat || "").replace(/_/g, " ");
              return (
                <div
                  key={cat}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.4rem 0.65rem",
                    backgroundColor: "var(--surface-subtle)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-default)",
                  }}
                >
                  <span style={{ fontSize: "0.78rem", fontWeight: 500, textTransform: "capitalize" }}>
                    {displayCat}
                  </span>
                  <span
                    className={isLong ? "badge-risk badge-risk-critical" : "badge-risk badge-risk-low"}
                    style={{ fontSize: "0.65rem", padding: "1px 5px" }}
                  >
                    {count} {count === 1 ? "asset" : "assets"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
