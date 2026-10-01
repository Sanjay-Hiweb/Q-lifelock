"use client";

import React from "react";
import { ScanSummary } from "../types";
import {
  IconShield,
  IconClock,
  IconTerminal,
  IconLayers,
  IconSparkles,
  IconArrowRight,
  IconAlertTriangle,
  IconCheck,
  IconCpu,
  IconGlobe,
  IconDownload,
  IconLock,
} from "./Icons";

interface HomeSectionProps {
  scanSummary: ScanSummary | null;
  onNavigateTab: (tab: string) => void;
  onOpenScanModal: () => void;
  onOpenTour: () => void;
  onOpenExportModal: () => void;
  onOpenConcept: (key: string) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  scanSummary,
  onNavigateTab,
  onOpenScanModal,
  onOpenTour,
  onOpenExportModal,
  onOpenConcept,
}) => {
  const scenarioYear = scanSummary?.scenario_year || 2035;
  const totalFindings = scanSummary?.total_findings || 0;
  const criticalFindings = scanSummary?.critical_count || 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", paddingBottom: "2rem" }}>
      {/* HERO SECTION */}
      <section
        style={{
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-lg)",
          backgroundColor: "var(--surface-default)",
          padding: "2.5rem 2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top Announcement Pill */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <span className="badge-risk badge-risk-critical" style={{ fontSize: "0.65rem", padding: "2px 8px" }}>
            NIST FIPS 203 &amp; 204 RATIFIED
          </span>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            NSA CNSA 2.0 TIMELINE ACTIVE · HORIZON: {scenarioYear}
          </span>
        </div>

        {/* Main Headline */}
        <div>
          <h1
            style={{
              fontSize: "2.4rem",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.15,
              color: "var(--text-primary)",
              maxWidth: "960px",
            }}
          >
            Post-Quantum Cryptography Migration Prioritized by Data Lifetime
          </h1>
          <p
            style={{
              fontSize: "1.05rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              maxWidth: "840px",
              marginTop: "0.85rem",
            }}
          >
            A quantum computer capable of breaking RSA and ECC does not need to exist today to breach your infrastructure.
            Adversaries harvest encrypted ciphertexts today to decrypt them later. <strong>Q-LIFELOCK</strong> evaluates the legal retention
            shelf-life of your underlying data to isolate the <strong>10% of critical long-lived assets</strong> that face immediate quantum threat.
          </p>
        </div>

        {/* Action Button Row */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onNavigateTab("overview")}
            style={{ padding: "0.6rem 1.25rem", fontSize: "0.875rem" }}
          >
            <IconShield size={16} />
            <span>Launch Posture Console</span>
            <IconArrowRight size={14} />
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onNavigateTab("timemachine")}
            style={{ padding: "0.6rem 1.1rem", fontSize: "0.875rem" }}
          >
            <IconClock size={16} />
            <span>Simulate Horizon (Time Machine)</span>
          </button>

          <button
            type="button"
            className="btn btn-outline"
            onClick={onOpenTour}
            style={{ padding: "0.6rem 1.1rem", fontSize: "0.875rem" }}
          >
            <span>Interactive Guided Tour</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onOpenScanModal}
            style={{ padding: "0.6rem 1.1rem", fontSize: "0.875rem" }}
          >
            <IconTerminal size={15} />
            <span>Scan Source Repository</span>
          </button>
        </div>

        {/* Live Horizon Metric Ribbon */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "0.75rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid var(--border-default)",
          }}
        >
          <div style={{ padding: "0.75rem", backgroundColor: "var(--surface-subtle)", borderRadius: "var(--radius-sm)" }}>
            <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 600 }}>
              Current Baseline
            </div>
            <div style={{ fontSize: "1.35rem", fontWeight: 700, fontFamily: "var(--font-mono)" }}>2026</div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Current active collection era</div>
          </div>

          <div style={{ padding: "0.75rem", backgroundColor: "var(--surface-subtle)", borderRadius: "var(--radius-sm)" }}>
            <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 600 }}>
              CRQC Arrival Horizon
            </div>
            <div style={{ fontSize: "1.35rem", fontWeight: 700, fontFamily: "var(--font-mono)" }}>{scenarioYear}</div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>NIST consensus benchmark</div>
          </div>

          <div style={{ padding: "0.75rem", backgroundColor: "var(--surface-subtle)", borderRadius: "var(--radius-sm)" }}>
            <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 600 }}>
              Maximum Data Shelf-Life
            </div>
            <div style={{ fontSize: "1.35rem", fontWeight: 700, fontFamily: "var(--font-mono)" }}>30 Years</div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Master ledgers &amp; healthcare (2056)</div>
          </div>

          <div style={{ padding: "0.75rem", backgroundColor: "var(--surface-subtle)", borderRadius: "var(--radius-sm)", border: "1px solid var(--text-primary)" }}>
            <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-primary)", fontWeight: 700 }}>
              HNDL Overlap Breach
            </div>
            <div style={{ fontSize: "1.35rem", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>
              21 Years
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Retroactive unauthorized exposure</div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE PROBLEM VS. THE Q-LIFELOCK INNOVATION */}
      <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 700 }}>
            Paradigm Shift
          </span>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Why Legacy CBOM Scanners Fail at Quantum Risk
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", maxWidth: "800px" }}>
            Traditional security compliance tools produce flat checklists of every RSA and ECC key found in your source code, creating panic and alert fatigue.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1rem" }}>
          {/* Traditional Scanners Card */}
          <div
            style={{
              padding: "1.5rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--surface-subtle)",
              border: "1px solid var(--border-default)",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="badge-risk badge-risk-low">LEGACY APPROACH</span>
              <strong style={{ fontSize: "0.95rem" }}>Traditional Static Scanners</strong>
            </div>

            <ul style={{ fontSize: "0.825rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.6rem", paddingLeft: "1.2rem" }}>
              <li>
                <strong>Flat lists of hundreds of keys:</strong> Flags 500 RSA instances without knowing if they protect a 15-minute cookie or a 30-year banking mortgage.
              </li>
              <li>
                <strong>Alert fatigue &amp; paralysis:</strong> Security teams cannot migrate everything at once, causing executive inaction.
              </li>
              <li>
                <strong>Zero context attenuation:</strong> Treats automated unit test mocks with the same severity as live production financial vaults.
              </li>
              <li>
                <strong>Stateless snapshots:</strong> Fails to model future quantum hardware breakthroughs or regulatory deadlines.
              </li>
            </ul>
          </div>

          {/* Q-LIFELOCK Solution Card */}
          <div
            style={{
              padding: "1.5rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--surface-default)",
              border: "1.5px solid var(--text-primary)",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="badge-risk badge-risk-critical">THE GAME CHANGER</span>
              <strong style={{ fontSize: "0.95rem" }}>Q-LIFELOCK Lifetime Engine</strong>
            </div>

            <ul style={{ fontSize: "0.825rem", color: "var(--text-primary)", display: "flex", flexDirection: "column", gap: "0.6rem", paddingLeft: "1.2rem" }}>
              <li>
                <strong>Lifetime-Attenuated Prioritization:</strong> Identifies the underlying data retention mandate (GLBA, HIPAA, SEC) to rank real breach risk.
              </li>
              <li>
                <strong>Context-Aware Filtration:</strong> Automatically downgrades unit test mocks while escalating production signing keys to Critical.
              </li>
              <li>
                <strong>Interactive Quantum Time Machine:</strong> Parametrically models shifting CRQC horizons (2027 to 2045) in real-time.
              </li>
              <li>
                <strong>Turnkey NIST FIPS Migration:</strong> Direct mapping from RSA/ECC to NIST FIPS 203 (ML-KEM) and FIPS 204 (ML-DSA) with CycloneDX 1.6 CBOM export.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 3: MOSCA'S THEOREM MATHEMATICAL FORMALIZATION */}
      <section
        style={{
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-md)",
          padding: "1.75rem",
          backgroundColor: "var(--surface-default)",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <IconClock size={18} color="var(--text-primary)" />
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                Mosca&apos;s Theorem: Mathematical Proof of Imminent Quantum Risk
              </h3>
            </div>
            <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
              Formulated by quantum cryptographer Dr. Michele Mosca to prove why organizations must migrate years before a quantum computer arrives.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => onOpenConcept("mosca")}
          >
            Explain Mosca&apos;s Theorem
          </button>
        </div>

        {/* Formula Box */}
        <div
          style={{
            padding: "1.25rem",
            backgroundColor: "var(--surface-subtle)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-default)",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            fontFamily: "var(--font-mono)",
          }}
        >
          <div style={{ fontSize: "1.2rem", fontWeight: 800, letterSpacing: "0.05em", color: "var(--text-primary)" }}>
            IF (X + Y &gt; Z) ➔ SYSTEM COMPROMISED TODAY
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            • <strong>X (Data Shelf-Life):</strong> Years the data must remain confidential (e.g. 30 years under GLBA/HIPAA).<br />
            • <strong>Y (Migration Timeline):</strong> Years required to re-architect, test, and deploy post-quantum algorithms (typically 3–5 years).<br />
            • <strong>Z (Quantum Emergence Horizon):</strong> Years until a Cryptographically Relevant Quantum Computer (CRQC) emerges (~9–14 years).
          </div>
        </div>

        {/* Real World 3-Scenario Comparison */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.75rem" }}>
          <div style={{ padding: "1rem", backgroundColor: "var(--surface-subtle)", borderRadius: "var(--radius-sm)", borderLeft: "3px solid var(--text-primary)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="badge-risk badge-risk-critical">CRITICAL</span>
              <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)" }}>X=30y · Y=3y · Z=14y</span>
            </div>
            <strong style={{ fontSize: "0.875rem", display: "block", marginTop: "0.4rem" }}>
              30-Year Customer Master Ledger
            </strong>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
              30 + 3 = 33 &gt; 14. Ciphertexts stored today by adversaries will be decrypted in 2035, yielding <strong>21 years of illegal plaintext exposure</strong>.
            </p>
          </div>

          <div style={{ padding: "1rem", backgroundColor: "var(--surface-subtle)", borderRadius: "var(--radius-sm)", borderLeft: "2px solid var(--border-strong)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="badge-risk badge-risk-high">HIGH URGENCY</span>
              <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)" }}>X=10y · Y=3y · Z=14y</span>
            </div>
            <strong style={{ fontSize: "0.875rem", display: "block", marginTop: "0.4rem" }}>
              Interbank Wire Transfer Signatures
            </strong>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
              Regulatory 10-year audit window. Shor&apos;s algorithm enables retroactive signature forgery and non-repudiation collapse.
            </p>
          </div>

          <div style={{ padding: "1rem", backgroundColor: "var(--surface-subtle)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-default)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="badge-risk badge-risk-low">SAFE / MITIGATED</span>
              <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)" }}>X=15m · Y=3y · Z=14y</span>
            </div>
            <strong style={{ fontSize: "0.875rem", display: "block", marginTop: "0.4rem" }}>
              15-Minute Web Session Token
            </strong>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Token expires in 15 minutes. Quantum decryption in 2035 grants zero adversary access. Automatically de-prioritized by Q-LIFELOCK.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: PLATFORM CORE MODULES & WORKFLOW */}
      <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 700 }}>
            Architecture
          </span>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            The Complete Post-Quantum Cryptographic Suite
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Explore the five deterministic engines powering the Q-LIFELOCK operational suite.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
          {/* Card 1: Overview Console */}
          <div
            className="card"
            style={{ cursor: "pointer" }}
            onClick={() => onNavigateTab("overview")}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <IconShield size={18} color="var(--text-primary)" />
              <span className="brand-badge">TELEMETRY</span>
            </div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700 }}>1. Posture &amp; Threat Telemetry</h4>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.35rem", lineHeight: 1.5 }}>
              Continuous dashboard tracking total cryptographic primitives, HNDL exposure counts, NSA CNSA 2.0 readiness scores, and algorithmic distribution.
            </p>
            <div style={{ marginTop: "1rem", fontSize: "0.75rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span>Open Posture Console</span>
              <IconArrowRight size={12} />
            </div>
          </div>

          {/* Card 2: Cryptographic Findings */}
          <div
            className="card"
            style={{ cursor: "pointer" }}
            onClick={() => onNavigateTab("findings")}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <IconTerminal size={18} color="var(--text-primary)" />
              <span className="brand-badge">AST SCANNER</span>
            </div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700 }}>2. Cryptographic Findings</h4>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.35rem", lineHeight: 1.5 }}>
              Deterministic AST code analysis identifying line-by-line implementations of RSA, ECC, AES, SHA, and HMAC with contextual test attenuation.
            </p>
            <div style={{ marginTop: "1rem", fontSize: "0.75rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span>View Findings ({totalFindings})</span>
              <IconArrowRight size={12} />
            </div>
          </div>

          {/* Card 3: Quantum Time Machine */}
          <div
            className="card"
            style={{ cursor: "pointer" }}
            onClick={() => onNavigateTab("timemachine")}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <IconClock size={18} color="var(--text-primary)" />
              <span className="brand-badge">SIMULATOR</span>
            </div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700 }}>3. Quantum Time Machine</h4>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.35rem", lineHeight: 1.5 }}>
              Interactive timeline scrubber allowing CISOs and architects to project risk across aggressive (2029), consensus (2035), and conservative (2040) arrival horizons.
            </p>
            <div style={{ marginTop: "1rem", fontSize: "0.75rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span>Launch Simulation</span>
              <IconArrowRight size={12} />
            </div>
          </div>

          {/* Card 4: Migration Roadmap */}
          <div
            className="card"
            style={{ cursor: "pointer" }}
            onClick={() => onNavigateTab("migration")}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <IconLayers size={18} color="var(--text-primary)" />
              <span className="brand-badge">FIPS 203/204</span>
            </div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700 }}>4. Migration Roadmap</h4>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.35rem", lineHeight: 1.5 }}>
              Actionable Kanban workflow transitioning discovered legacy keys to ratified NIST post-quantum standards (ML-KEM, ML-DSA, SLH-DSA).
            </p>
            <div style={{ marginTop: "1rem", fontSize: "0.75rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span>Manage Roadmap</span>
              <IconArrowRight size={12} />
            </div>
          </div>

          {/* Card 5: Quantum Simulation Lab */}
          <div
            className="card"
            style={{ cursor: "pointer" }}
            onClick={() => onNavigateTab("quantumlab")}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <IconSparkles size={18} color="var(--text-primary)" />
              <span className="brand-badge">SHOR PROOF</span>
            </div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700 }}>5. Quantum Cryptanalysis Lab</h4>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.35rem", lineHeight: 1.5 }}>
              Mathematical proof simulator demonstrating Shor&apos;s period-finding quantum circuit and Gidney-Ekerå physical qubit resource estimates for breaking RSA-2048.
            </p>
            <div style={{ marginTop: "1rem", fontSize: "0.75rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span>Enter Quantum Lab</span>
              <IconArrowRight size={12} />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: REGULATORY MANDATES & STANDARDS TIMELINE */}
      <section
        style={{
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-md)",
          padding: "1.75rem",
          backgroundColor: "var(--surface-default)",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        <div>
          <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 700 }}>
            Compliance Deadlines
          </span>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginTop: "0.2rem" }}>
            Global Post-Quantum Migration Deadlines
          </h3>
          <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
            Government bodies, central banks, and defense agencies have established binding migration schedules.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          <div style={{ padding: "1rem", backgroundColor: "var(--surface-subtle)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-default)" }}>
            <span className="badge-status status-completed">AUGUST 2024</span>
            <strong style={{ display: "block", fontSize: "0.85rem", marginTop: "0.5rem" }}>NIST FIPS Ratified</strong>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              NIST releases final standards for FIPS 203 (ML-KEM), 204 (ML-DSA), and 205 (SLH-DSA).
            </p>
          </div>

          <div style={{ padding: "1rem", backgroundColor: "var(--surface-subtle)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-default)" }}>
            <span className="badge-status status-in_progress">2026 AUDIT</span>
            <strong style={{ display: "block", fontSize: "0.85rem", marginTop: "0.5rem" }}>White House OMB M-23-02</strong>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Mandatory cryptographic inventory and CBOM reporting for federal contractors and critical infrastructure.
            </p>
          </div>

          <div style={{ padding: "1rem", backgroundColor: "var(--surface-subtle)", borderRadius: "var(--radius-sm)", border: "1.5px solid var(--text-primary)" }}>
            <span className="badge-risk badge-risk-critical">2030 MANDATE</span>
            <strong style={{ display: "block", fontSize: "0.85rem", marginTop: "0.5rem" }}>NSA CNSA 2.0 Hard Deadline</strong>
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
              All software and operating systems must enforce post-quantum algorithms; classical algorithms banned for national security systems.
            </p>
          </div>

          <div style={{ padding: "1rem", backgroundColor: "var(--surface-subtle)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-default)" }}>
            <span className="badge-risk badge-risk-high">2035 HORIZON</span>
            <strong style={{ display: "block", fontSize: "0.85rem", marginTop: "0.5rem" }}>Projected CRQC Emergence</strong>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Fault-tolerant quantum hardware with ~4,098 logical qubits capable of factoring RSA-2048 in hours.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6: EXECUTIVE CTA BANNER */}
      <section
        style={{
          padding: "2rem",
          borderRadius: "var(--radius-md)",
          backgroundColor: "var(--surface-subtle)",
          border: "1px solid var(--border-strong)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}
      >
        <div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" }}>
            Begin Your Post-Quantum Migration Today
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem", maxWidth: "600px" }}>
            Generate a CycloneDX 1.6 Cryptographic Bill of Materials (CBOM), identify HNDL exposure, and start moving vulnerable keys to NIST FIPS 203/204.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onOpenExportModal}
          >
            <IconDownload size={14} />
            <span>Download Sample CBOM</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onNavigateTab("overview")}
          >
            <span>Open Posture Console →</span>
          </button>
        </div>
      </section>
    </div>
  );
};
