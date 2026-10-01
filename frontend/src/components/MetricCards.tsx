"use client";

import React from "react";
import { ScanSummary } from "../types";
import { ConceptTrigger } from "./ConceptTrigger";
import { IconLock, IconAlertTriangle, IconShield, IconCheckCircle } from "./Icons";

interface MetricCardsProps {
  scanSummary: ScanSummary | null;
  onOpenConcept?: (key: string) => void;
  teacherMode?: boolean;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  scanSummary,
  onOpenConcept,
  teacherMode = false,
}) => {
  if (!scanSummary) return null;

  const total = scanSummary.total_findings || 0;
  const critical = scanSummary.critical_count || 0;
  const high = scanSummary.high_count || 0;
  const readiness = Number(scanSummary.readiness_score || 0);
  const scenarioYear = scanSummary.scenario_year || 2035;

  return (
    <div className="metrics-grid">
      {/* CARD 1: Crypto Inventory */}
      <div className="metric-card">
        <div className="metric-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <span className="metric-label">Crypto Inventory</span>
            <span className="brand-badge">CBOM AUDIT</span>
          </div>
          <IconLock size={15} color="var(--text-muted)" />
        </div>

        <div className="metric-value-row">
          <span className="metric-value">{total}</span>
          <span className="metric-subtext">primitives</span>
        </div>

        <div className="metric-subtext" style={{ marginTop: "auto" }}>
          Across {scanSummary.total_files_scanned || 0} source files · CycloneDX 1.6 verified
        </div>

        {teacherMode && (
          <div
            style={{
              marginTop: "0.5rem",
              paddingTop: "0.5rem",
              borderTop: "1px solid var(--border-default)",
              fontSize: "0.72rem",
              color: "var(--text-secondary)",
              lineHeight: 1.45,
            }}
          >
            <div><strong style={{ color: "var(--text-primary)" }}>Architecture:</strong> Complete inventory of cryptographic primitives across AST parse trees.</div>
            <div style={{ color: "var(--text-muted)", marginTop: "2px" }}>Identifies RSA, ECC, AES, SHA, HMAC implementations and key sizes.</div>
          </div>
        )}
      </div>

      {/* CARD 2: Critical HNDL Exposure */}
      <div className="metric-card critical-card">
        <div className="metric-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <span className="metric-label">Critical HNDL Exposure</span>
            {onOpenConcept && (
              <ConceptTrigger conceptKey="hndl" variant="icon" onOpenConcept={onOpenConcept} />
            )}
            <span className="badge-risk badge-risk-critical" style={{ fontSize: "0.6rem", padding: "1px 5px" }}>
              ACTIVE THREAT
            </span>
          </div>
          <IconAlertTriangle size={15} color="var(--text-primary)" />
        </div>

        <div className="metric-value-row">
          <span className="metric-value">
            {critical}
          </span>
          <span className="metric-subtext">assets exposed</span>
        </div>

        <div className="metric-subtext" style={{ marginTop: "auto" }}>
          Retention duration exceeds {scenarioYear} CRQC quantum arrival horizon
        </div>

        {teacherMode && (
          <div
            style={{
              marginTop: "0.5rem",
              paddingTop: "0.5rem",
              borderTop: "1px solid var(--border-default)",
              fontSize: "0.72rem",
              color: "var(--text-secondary)",
              lineHeight: 1.45,
            }}
          >
            <div><strong style={{ color: "var(--text-primary)" }}>Threat Model:</strong> Adversaries harvest encrypted ciphertexts today for retroactive decryption.</div>
            <div style={{ color: "var(--text-muted)", marginTop: "2px" }}>Shor&apos;s algorithm factors RSA/ECC moduli in polynomial time O((log N)³).</div>
          </div>
        )}
      </div>

      {/* CARD 3: High Urgency Migration */}
      <div className="metric-card high-card">
        <div className="metric-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <span className="metric-label">High Urgency Migration</span>
            {onOpenConcept && (
              <ConceptTrigger conceptKey="nist" variant="icon" onOpenConcept={onOpenConcept} />
            )}
            <span className="badge-risk badge-risk-high" style={{ fontSize: "0.6rem", padding: "1px 5px" }}>
              CNSA 2.0
            </span>
          </div>
          <IconShield size={15} color="var(--text-primary)" />
        </div>

        <div className="metric-value-row">
          <span className="metric-value">
            {high}
          </span>
          <span className="metric-subtext">signatures at risk</span>
        </div>

        <div className="metric-subtext" style={{ marginTop: "auto" }}>
          Digital signatures and PKI requiring NIST FIPS 204 migration
        </div>

        {teacherMode && (
          <div
            style={{
              marginTop: "0.5rem",
              paddingTop: "0.5rem",
              borderTop: "1px solid var(--border-default)",
              fontSize: "0.72rem",
              color: "var(--text-secondary)",
              lineHeight: 1.45,
            }}
          >
            <div><strong style={{ color: "var(--text-primary)" }}>Integrity Risk:</strong> CRQC emergence enables retroactive signature forgery on long-lived contracts.</div>
            <div style={{ color: "var(--text-muted)", marginTop: "2px" }}>Target: Transition ECDSA/RSA to ML-DSA-65 (CRYSTALS-Dilithium).</div>
          </div>
        )}
      </div>

      {/* CARD 4: Quantum Readiness */}
      <div className="metric-card">
        <div className="metric-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <span className="metric-label">Quantum Readiness</span>
            <span className="brand-badge">POSTURE INDEX</span>
          </div>
          <IconCheckCircle size={15} color="var(--text-primary)" />
        </div>

        <div className="metric-value-row">
          <span className="metric-value">
            {readiness.toFixed(1)}%
          </span>
          <span className="metric-subtext">PQC compliance</span>
        </div>

        <div className="progress-bar-bg" style={{ marginTop: "auto" }}>
          <div
            className="progress-bar-fill"
            style={{
              width: `${Math.min(100, Math.max(4, readiness))}%`,
              backgroundColor: "var(--text-primary)",
            }}
          />
        </div>

        {teacherMode && (
          <div
            style={{
              marginTop: "0.5rem",
              paddingTop: "0.5rem",
              borderTop: "1px solid var(--border-default)",
              fontSize: "0.72rem",
              color: "var(--text-secondary)",
              lineHeight: 1.45,
            }}
          >
            <div><strong style={{ color: "var(--text-primary)" }}>Compliance:</strong> Normalized PQC score S = 100 × (∑ w_i · s_i) / (∑ w_i).</div>
            <div style={{ color: "var(--text-muted)", marginTop: "2px" }}>Mandated target: 100% compliance under NSA CNSA 2.0 timeline.</div>
          </div>
        )}
      </div>
    </div>
  );
};
