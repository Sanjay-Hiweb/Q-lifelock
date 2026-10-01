"use client";

import React, { useState } from "react";
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
  IconDownload,
  IconChevronDown,
  IconInfo,
  IconLock,
} from "./Icons";

interface WebsiteViewProps {
  scanSummary: ScanSummary | null;
  onLaunchConsole: (initialTab?: string) => void;
  onOpenScanModal: () => void;
  onOpenExportModal: () => void;
  onOpenTour: () => void;
  onOpenConcept: (key: string) => void;
}

export const WebsiteView: React.FC<WebsiteViewProps> = ({
  scanSummary,
  onLaunchConsole,
  onOpenScanModal,
  onOpenExportModal,
  onOpenTour,
  onOpenConcept,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedScenario, setSelectedScenario] = useState<"ledger" | "wire" | "token">("ledger");

  const scenarioYear = scanSummary?.scenario_year || 2035;
  const totalFindings = scanSummary?.total_findings || 0;
  const criticalFindings = scanSummary?.critical_count || 0;
  const highFindings = scanSummary?.high_count || 0;
  const readiness = Number(scanSummary?.readiness_score || 0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: "Why should an enterprise act today if a Cryptographically Relevant Quantum Computer (CRQC) is years away?",
      a: "Because of Harvest Now, Decrypt Later (HNDL). Foreign intelligence agencies and threat actors intercept and archive encrypted traffic across internet backbone switches and WAN perimeters today. If you encrypt a 30-year customer master ledger or financial transaction using RSA-2048 today, that secret must remain confidential through 2056. When a quantum computer arrives in 2035, the adversary decrypts the stored ciphertext, creating 21 years of illegal, retroactive exposure. Under Mosca's Theorem (X + Y > Z), if your data lifetime (X) plus your migration timeline (Y) exceeds the quantum horizon (Z), your security is already compromised.",
    },
    {
      q: "How does Q-LIFELOCK infer data lifetime from source code?",
      a: "Q-LIFELOCK utilizes a deterministic Abstract Syntax Tree (AST) engine that examines variable identifiers, function calls, class hierarchies, and database persistence schemas. It maps data handling patterns against statutory retention mandates: GLBA and banking ledger retention (30 years), medical records under HIPAA (25+ years), tax and audit trails under SEC/IRS regulations (7–10 years), and transient authorization tokens (15–60 minutes). Furthermore, it recognizes testing environments and mocks, automatically attenuating non-production assets to Low Priority.",
    },
    {
      q: "Why does Shor's Algorithm destroy RSA and Elliptic Curve Cryptography while AES-256 remains safe?",
      a: "Shor's algorithm (1994) uses quantum Fourier transforms and modular order-finding to solve prime integer factorization and discrete logarithms in polynomial time O((log N)³). This entirely eliminates the mathematical hardness of RSA, ECDSA, ECDH, and DSA. In contrast, symmetric encryption (AES) and hash functions are only subject to Grover's algorithm, which provides a quadratic speedup O(√N). Applying Grover's algorithm against AES-256 reduces its effective brute-force search space from 256 bits to 128 bits—which still requires 2¹²⁸ quantum operations, a computation that remains physically impossible under known physics.",
    },
    {
      q: "What are the officially ratified NIST Post-Quantum Cryptographic (PQC) standards?",
      a: "In August 2024, the US National Institute of Standards and Technology (NIST) officially released the final Federal Information Processing Standards (FIPS): FIPS 203 (ML-KEM, based on CRYSTALS-Kyber) for post-quantum key establishment; FIPS 204 (ML-DSA, based on CRYSTALS-Dilithium) for general digital signatures; and FIPS 205 (SLH-DSA, based on SPHINCS+) for stateless hash-based signatures. Q-LIFELOCK's migration planner directly maps discovered legacy primitives into these exact NIST FIPS parameter sets.",
    },
    {
      q: "What is a CycloneDX 1.6 Cryptographic Bill of Materials (CBOM)?",
      a: "CycloneDX v1.6 is an international OWASP standard specification designed to catalog software cryptographic dependencies. A CBOM provides an auditable, machine-readable inventory of all cryptographic algorithms, key lengths, curves, implementation providers, and NIST quantum-readiness levels. Q-LIFELOCK exports native CycloneDX 1.6 CBOM JSON files to satisfy federal compliance under White House OMB Memo M-23-02 and National Security Memorandum 10 (NSM-10).",
    },
    {
      q: "How does Q-LIFELOCK handle unit tests and mock keys to prevent alert fatigue?",
      a: "Traditional scanners flag every hardcoded key indiscriminately, resulting in hundreds of false alerts from test directories (e.g. `tests/test_crypto.py`). Q-LIFELOCK applies Context Attenuation: files located in test directories or containing mock assertions are tagged as `usage_context: test`. Their risk score is capped at 15/100 and priority is downgraded to LOW, allowing engineering teams to focus 100% of their bandwidth on live production credentials.",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "3.5rem", paddingBottom: "3rem" }}>
      {/* 1. HERO SECTION */}
      <section
        id="overview"
        style={{
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-lg)",
          backgroundColor: "var(--surface-default)",
          padding: "3rem 2.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.75rem",
          position: "relative",
        }}
      >
        {/* Personalized Welcome Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
          <span className="badge-risk badge-risk-critical" style={{ fontSize: "0.65rem", padding: "2px 8px" }}>
            CLIENT CONFIDENTIAL EVALUATION ACCESS
          </span>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            POST-QUANTUM DEFENSE PORTAL · HORIZON: {scenarioYear}
          </span>
        </div>

        {/* Main Headline */}
        <div>
          <h1
            style={{
              fontSize: "2.8rem",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.12,
              color: "var(--text-primary)",
              maxWidth: "1000px",
            }}
          >
            The First Post-Quantum Cryptographic Migration Platform Prioritized by Data Lifetime
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              color: "var(--text-secondary)",
              lineHeight: 1.65,
              maxWidth: "880px",
              marginTop: "1rem",
            }}
          >
            Engineered for enterprise banking, sovereign defense, and critical infrastructure.
            Traditional scanners overwhelm engineering teams with hundreds of flat RSA warnings.
            <strong> Q-LIFELOCK</strong> evaluates statutory data retention shelf-lives to pinpoint the <strong>10% of long-lived secrets</strong> under
            active Harvest-Now-Decrypt-Later (HNDL) exposure today.
          </p>
        </div>

        {/* Primary Action Button Row */}
        <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap", alignItems: "center" }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onLaunchConsole("overview")}
            style={{ padding: "0.75rem 1.6rem", fontSize: "0.92rem", fontWeight: 700 }}
          >
            <IconShield size={16} />
            <span>Launch Live Project Console</span>
            <IconArrowRight size={14} />
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onLaunchConsole("timemachine")}
            style={{ padding: "0.75rem 1.35rem", fontSize: "0.92rem" }}
          >
            <IconClock size={16} />
            <span>Simulate Quantum Horizon</span>
          </button>

          <button
            type="button"
            className="btn btn-outline"
            onClick={onOpenTour}
            style={{ padding: "0.75rem 1.35rem", fontSize: "0.92rem" }}
          >
            <span>Guided Walkthrough</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onOpenScanModal}
            style={{ padding: "0.75rem 1.35rem", fontSize: "0.92rem" }}
          >
            <IconTerminal size={15} />
            <span>Scan Codebase</span>
          </button>
        </div>

        {/* Live Horizon Metric Ribbon */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "0.85rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--border-default)",
          }}
        >
          <div style={{ padding: "0.85rem", backgroundColor: "var(--surface-subtle)", borderRadius: "var(--radius-sm)" }}>
            <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 600 }}>
              Current Era
            </div>
            <div style={{ fontSize: "1.45rem", fontWeight: 700, fontFamily: "var(--font-mono)" }}>2026</div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Active ciphertext collection</div>
          </div>

          <div style={{ padding: "0.85rem", backgroundColor: "var(--surface-subtle)", borderRadius: "var(--radius-sm)" }}>
            <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 600 }}>
              CRQC Arrival Horizon
            </div>
            <div style={{ fontSize: "1.45rem", fontWeight: 700, fontFamily: "var(--font-mono)" }}>{scenarioYear}</div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>NIST consensus benchmark</div>
          </div>

          <div style={{ padding: "0.85rem", backgroundColor: "var(--surface-subtle)", borderRadius: "var(--radius-sm)" }}>
            <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 600 }}>
              Max Data Shelf-Life
            </div>
            <div style={{ fontSize: "1.45rem", fontWeight: 700, fontFamily: "var(--font-mono)" }}>30 Years</div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Master ledgers &amp; GLBA (2056)</div>
          </div>

          <div style={{ padding: "0.85rem", backgroundColor: "var(--surface-subtle)", borderRadius: "var(--radius-sm)", border: "1.5px solid var(--text-primary)" }}>
            <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-primary)", fontWeight: 700 }}>
              HNDL Breach Overlap
            </div>
            <div style={{ fontSize: "1.45rem", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>
              21 Years
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Retroactive unauthorized exposure</div>
          </div>
        </div>
      </section>

      {/* 2. LIVE SYSTEM TELEMETRY PREVIEW (BRIDGES WEBSITE DIRECTLY TO PROJECT) */}
      <section
        style={{
          border: "1.5px solid var(--text-primary)",
          borderRadius: "var(--radius-md)",
          backgroundColor: "var(--surface-default)",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="badge-risk badge-risk-critical" style={{ fontSize: "0.65rem" }}>LIVE AUDIT DATA</span>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 700 }}>Active Repository Telemetry Preview</h2>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.3rem" }}>
              Live results from the AST cryptographic engine across scanned source files.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => onLaunchConsole("overview")}
            style={{ fontWeight: 700 }}
          >
            <span>Enter Full Console Experience →</span>
          </button>
        </div>

        {/* Telemetry Snapshot Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          <div style={{ padding: "1rem", backgroundColor: "var(--surface-subtle)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-default)" }}>
            <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 600 }}>
              Crypto Inventory
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, fontFamily: "var(--font-mono)", marginTop: "0.2rem" }}>
              {totalFindings}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Across {scanSummary?.total_files_scanned || 0} files · CycloneDX 1.6
            </div>
          </div>

          <div style={{ padding: "1rem", backgroundColor: "var(--surface-subtle)", borderRadius: "var(--radius-sm)", borderLeft: "3px solid var(--text-primary)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-primary)", fontWeight: 700 }}>
                Critical HNDL Exposure
              </span>
              <span className="badge-risk badge-risk-critical" style={{ fontSize: "0.58rem" }}>THREAT</span>
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, fontFamily: "var(--font-mono)", marginTop: "0.2rem" }}>
              {criticalFindings}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Data retention exceeds {scenarioYear}
            </div>
          </div>

          <div style={{ padding: "1rem", backgroundColor: "var(--surface-subtle)", borderRadius: "var(--radius-sm)", borderLeft: "2px solid var(--border-strong)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 600 }}>
                High Urgency (CNSA 2.0)
              </span>
              <span className="badge-risk badge-risk-high" style={{ fontSize: "0.58rem" }}>FIPS 204</span>
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, fontFamily: "var(--font-mono)", marginTop: "0.2rem" }}>
              {highFindings}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Signatures &amp; authentication keys
            </div>
          </div>

          <div style={{ padding: "1rem", backgroundColor: "var(--surface-subtle)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-default)" }}>
            <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 600 }}>
              Quantum Readiness
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, fontFamily: "var(--font-mono)", marginTop: "0.2rem" }}>
              {readiness.toFixed(1)}%
            </div>
            <div className="progress-bar-bg" style={{ marginTop: "0.4rem" }}>
              <div className="progress-bar-fill" style={{ width: `${Math.min(100, Math.max(5, readiness))}%` }} />
            </div>
          </div>
        </div>

        {/* Quick Jump Buttons to Project Modules */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", borderTop: "1px solid var(--border-default)", paddingTop: "1rem" }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onLaunchConsole("findings")}
          >
            <span>Inspect Findings Code Snippets ({totalFindings}) →</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onLaunchConsole("timemachine")}
          >
            <span>Open Interactive Scrubber (2027–2045) →</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onLaunchConsole("migration")}
          >
            <span>View NIST Kanban Roadmap →</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onLaunchConsole("quantumlab")}
          >
            <span>View Shor&apos;s Factoring Proofs →</span>
          </button>
        </div>
      </section>

      {/* 3. THE PROBLEM VS. THE Q-LIFELOCK INNOVATION */}
      <section id="threat" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div>
          <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 700 }}>
            Market Deficiency
          </span>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.03em" }}>
            Why Legacy Cybersecurity Scanners Fail at Post-Quantum Security
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", maxWidth: "840px", marginTop: "0.25rem" }}>
            Standard vulnerability scanners treat post-quantum migration like an open-source dependency CVE scan, generating fatal alert fatigue.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
          {/* Legacy Tool Box */}
          <div
            style={{
              padding: "1.75rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--surface-subtle)",
              border: "1px solid var(--border-default)",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="badge-risk badge-risk-low">LEGACY PARADIGM</span>
              <strong style={{ fontSize: "1rem" }}>Generic Static Scanners</strong>
            </div>

            <ul style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.75rem", paddingLeft: "1.2rem", lineHeight: 1.5 }}>
              <li>
                <strong>Flat lists of hundreds of alerts:</strong> Flags 500+ RSA/ECC instances with zero context of whether they protect a 15-minute session token or a 30-year patient record.
              </li>
              <li>
                <strong>Executive budget paralysis:</strong> CISOs cannot justify tens of millions of dollars to rewrite every crypto library simultaneously without risk differentiation.
              </li>
              <li>
                <strong>Zero test attenuation:</strong> Unit test mocks in test suites are flagged as critical vulnerabilities, wasting months of engineering triage.
              </li>
              <li>
                <strong>Blind to retroactive HNDL:</strong> Does not measure adversary storage ROI or legal confidentiality expiration dates.
              </li>
            </ul>
          </div>

          {/* Q-LIFELOCK Box */}
          <div
            style={{
              padding: "1.75rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--surface-default)",
              border: "2px solid var(--text-primary)",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="badge-risk badge-risk-critical">THE Q-LIFELOCK ADVANTAGE</span>
              <strong style={{ fontSize: "1rem" }}>Data-Lifetime Attenuation</strong>
            </div>

            <ul style={{ fontSize: "0.85rem", color: "var(--text-primary)", display: "flex", flexDirection: "column", gap: "0.75rem", paddingLeft: "1.2rem", lineHeight: 1.5 }}>
              <li>
                <strong>Statutory Shelf-Life Inference:</strong> Discovers data persistence patterns to rank risk by legal confidentiality requirements (GLBA, HIPAA, GDPR, SEC).
              </li>
              <li>
                <strong>Pinpoints the Critical 10%:</strong> Directs engineering migration budgets to the small fraction of long-lived secrets genuinely vulnerable to HNDL.
              </li>
              <li>
                <strong>Automatic Test Attenuation:</strong> Mocks and test fixtures are detected and automatically downgraded to Low Priority.
              </li>
              <li>
                <strong>CycloneDX 1.6 CBOM Delivery:</strong> Directly outputs machine-readable Cryptographic Bills of Materials for OMB M-23-02 federal compliance.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. MOSCA'S THEOREM & SCENARIO DEMONSTRATION */}
      <section
        style={{
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-md)",
          padding: "2rem",
          backgroundColor: "var(--surface-default)",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <IconClock size={18} color="var(--text-primary)" />
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                Mosca&apos;s Theorem: Formal Proof of Harvest-Now-Decrypt-Later Risk
              </h3>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.3rem" }}>
              Why organizations are already compromised today if they wait for quantum hardware before initiating software migration.
            </p>
          </div>

          <div className="segmented-control">
            <button
              type="button"
              className={`segmented-btn ${selectedScenario === "ledger" ? "active" : ""}`}
              onClick={() => setSelectedScenario("ledger")}
            >
              30-Yr Master Ledger
            </button>
            <button
              type="button"
              className={`segmented-btn ${selectedScenario === "wire" ? "active" : ""}`}
              onClick={() => setSelectedScenario("wire")}
            >
              Interbank Wire Signatures
            </button>
            <button
              type="button"
              className={`segmented-btn ${selectedScenario === "token" ? "active" : ""}`}
              onClick={() => setSelectedScenario("token")}
            >
              15-Min Session Token
            </button>
          </div>
        </div>

        {/* Mosca Equation Box */}
        <div
          style={{
            padding: "1.25rem",
            backgroundColor: "var(--surface-subtle)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-default)",
            fontFamily: "var(--font-mono)",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <div style={{ fontSize: "1.15rem", fontWeight: 800 }}>
            CONDITION: IF (X + Y &gt; Z) ⟹ ACTIVE BREACH WINDOW EXISTS TODAY
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            • <strong>X:</strong> Confidentiality shelf-life of protected data · <strong>Y:</strong> Migration and validation engineering time · <strong>Z:</strong> Years until CRQC deployment
          </div>
        </div>

        {/* Dynamic Scenario Analysis Box */}
        <div
          style={{
            padding: "1.25rem",
            backgroundColor: "var(--surface-subtle)",
            borderRadius: "var(--radius-sm)",
            border: "1.5px solid var(--text-primary)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          {selectedScenario === "ledger" && (
            <>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="badge-risk badge-risk-critical">CRITICAL RISK</span>
                  <strong style={{ fontSize: "0.95rem" }}>Customer Master Ledger Keys (RSA-2048)</strong>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", marginTop: "0.35rem", maxWidth: "680px" }}>
                  GLBA/HIPAA 30-year retention (through 2056). Decryption occurs at CRQC horizon in {scenarioYear}.
                  Results in <strong>21 years of illegal, retroactive plaintext data exposure</strong>.
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>MOSCA OVERLAP</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, fontFamily: "var(--font-mono)" }}>19–21 Years</div>
              </div>
            </>
          )}

          {selectedScenario === "wire" && (
            <>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="badge-risk badge-risk-high">HIGH INTEGRITY RISK</span>
                  <strong style={{ fontSize: "0.95rem" }}>Interbank Wire Transfer Authorization Signatures (ECDSA-256)</strong>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", marginTop: "0.35rem", maxWidth: "680px" }}>
                  10-year audit and regulatory non-repudiation requirement. Enables retroactive signature forgery and payment repudiation.
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>REPLACEMENT</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, fontFamily: "var(--font-mono)" }}>NIST FIPS 204 (ML-DSA)</div>
              </div>
            </>
          )}

          {selectedScenario === "token" && (
            <>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="badge-risk badge-risk-low">SAFE / MITIGATED</span>
                  <strong style={{ fontSize: "0.95rem" }}>15-Minute Web Session Token (RSA-2048)</strong>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", marginTop: "0.35rem", maxWidth: "680px" }}>
                  Ephemeral session token expires within minutes. Quantum decryption in {scenarioYear} grants zero adversary access or credential theft.
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>ACTION</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, fontFamily: "var(--font-mono)" }}>De-prioritized</div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 5. ARCHITECTURE & ENGINES */}
      <section id="architecture" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div>
          <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 700 }}>
            Enterprise Technology
          </span>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.03em" }}>
            The Five Core Q-LIFELOCK Engines
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Deterministic, audited cryptographic modules providing automated migration workflows.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          <div className="card" style={{ cursor: "pointer" }} onClick={() => onLaunchConsole("overview")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <IconShield size={18} color="var(--text-primary)" />
              <span className="brand-badge">TELEMETRY</span>
            </div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700 }}>1. Posture &amp; Threat Telemetry</h4>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.35rem", lineHeight: 1.5 }}>
              Continuous posture scoring aggregating CBOM findings, active HNDL exposures, and NSA CNSA 2.0 readiness.
            </p>
            <div style={{ marginTop: "1rem", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span>Launch Module →</span>
            </div>
          </div>

          <div className="card" style={{ cursor: "pointer" }} onClick={() => onLaunchConsole("findings")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <IconTerminal size={18} color="var(--text-primary)" />
              <span className="brand-badge">AST SCANNER</span>
            </div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700 }}>2. Cryptographic Findings</h4>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.35rem", lineHeight: 1.5 }}>
              Zero-regex Abstract Syntax Tree parser examining Python, JS, C, and Go for exact line-by-line crypto primitives.
            </p>
            <div style={{ marginTop: "1rem", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span>Launch Module →</span>
            </div>
          </div>

          <div className="card" style={{ cursor: "pointer" }} onClick={() => onLaunchConsole("timemachine")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <IconClock size={18} color="var(--text-primary)" />
              <span className="brand-badge">SIMULATOR</span>
            </div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700 }}>3. Quantum Time Machine</h4>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.35rem", lineHeight: 1.5 }}>
              Temporal timeline scrubber modeling shifting breach windows under aggressive (2029) to conservative (2040) scenarios.
            </p>
            <div style={{ marginTop: "1rem", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span>Launch Module →</span>
            </div>
          </div>

          <div className="card" style={{ cursor: "pointer" }} onClick={() => onLaunchConsole("migration")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <IconLayers size={18} color="var(--text-primary)" />
              <span className="brand-badge">FIPS 203/204</span>
            </div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700 }}>4. NIST Migration Roadmap</h4>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.35rem", lineHeight: 1.5 }}>
              Interactive Kanban lifecycle board guiding engineering teams through ML-KEM and ML-DSA replacements.
            </p>
            <div style={{ marginTop: "1rem", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span>Launch Module →</span>
            </div>
          </div>

          <div className="card" style={{ cursor: "pointer" }} onClick={() => onLaunchConsole("quantumlab")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <IconSparkles size={18} color="var(--text-primary)" />
              <span className="brand-badge">SHOR PROOF</span>
            </div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700 }}>5. Quantum Cryptanalysis Lab</h4>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.35rem", lineHeight: 1.5 }}>
              Shor&apos;s period-finding simulation and Gidney-Ekerå physical qubit resource scaling under surface codes.
            </p>
            <div style={{ marginTop: "1rem", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span>Launch Module →</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. RATIFIED NIST STANDARDS REFERENCE TABLE */}
      <section id="standards" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div>
          <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 700 }}>
            Official Mandates
          </span>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.03em" }}>
            Ratified NIST Post-Quantum Standards (August 2024)
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            The official standards governing all federal, banking, and critical infrastructure migrations.
          </p>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Standard</th>
                <th>Primitive</th>
                <th>Underlying Math</th>
                <th>Legacy Target</th>
                <th>Recommended Parameter</th>
                <th>Security Level</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 700, fontFamily: "var(--font-mono)" }}>NIST FIPS 203</td>
                <td>ML-KEM (Kyber)</td>
                <td>Module Learning With Errors (MLWE)</td>
                <td>RSA Key Exchange, ECDH, DH</td>
                <td><strong>ML-KEM-768</strong></td>
                <td>Level 3 (AES-192)</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, fontFamily: "var(--font-mono)" }}>NIST FIPS 204</td>
                <td>ML-DSA (Dilithium)</td>
                <td>Module Short Integer Solution (MSIS)</td>
                <td>RSA-PSS, ECDSA (secp256k1, P-256)</td>
                <td><strong>ML-DSA-65</strong></td>
                <td>Level 3 (AES-192)</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, fontFamily: "var(--font-mono)" }}>NIST FIPS 205</td>
                <td>SLH-DSA (SPHINCS+)</td>
                <td>Stateless Hash-Based Tree Signature</td>
                <td>Root CAs, Firmware, Long-Term Certs</td>
                <td><strong>SLH-DSA-SHAKE-128f</strong></td>
                <td>Level 1 (AES-128)</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, fontFamily: "var(--font-mono)" }}>NIST FIPS 206</td>
                <td>FN-DSA (FALCON)</td>
                <td>Fast-Fourier Lattice Trapdoors</td>
                <td>IoT Devices, Constrained Networks</td>
                <td><strong>FN-DSA-512</strong></td>
                <td>Level 1 (AES-128)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div>
          <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 700 }}>
            Client Due Diligence
          </span>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.03em" }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Clear, authoritative answers addressing executive, architectural, and mathematical inquiries.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                style={{
                  border: "1px solid var(--border-default)",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--surface-default)",
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: "100%",
                    padding: "1rem 1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                    textAlign: "left",
                    backgroundColor: isOpen ? "var(--surface-subtle)" : "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-primary)",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                  }}
                >
                  <span>{faq.q}</span>
                  <span
                    style={{
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                      flexShrink: 0,
                    }}
                  >
                    <IconChevronDown size={16} />
                  </span>
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: "1.25rem",
                      borderTop: "1px solid var(--border-default)",
                      fontSize: "0.825rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.65,
                      backgroundColor: "var(--surface-default)",
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. EXECUTIVE FINAL CALL TO ACTION BANNER */}
      <section
        style={{
          padding: "2.5rem",
          borderRadius: "var(--radius-md)",
          backgroundColor: "var(--surface-subtle)",
          border: "2px solid var(--text-primary)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}
      >
        <div>
          <span className="badge-risk badge-risk-critical" style={{ fontSize: "0.62rem" }}>
            READY FOR DEPLOYMENT
          </span>
          <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "0.35rem" }}>
            Access the Operational Project Console
          </h3>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.35rem", maxWidth: "640px" }}>
            Execute repository scans, inspect line-by-line AST evidence, simulate shifting quantum horizons, and generate CycloneDX 1.6 CBOM audits.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onOpenExportModal}
          >
            <IconDownload size={14} />
            <span>Export CBOM</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onLaunchConsole("overview")}
            style={{ fontWeight: 800, padding: "0.65rem 1.5rem" }}
          >
            <span>Launch Live Console →</span>
          </button>
        </div>
      </section>
    </div>
  );
};
