"use client";

import React, { useState } from "react";
import {
  IconShield,
  IconClock,
  IconCpu,
  IconLayers,
  IconTerminal,
  IconFileText,
  IconChevronDown,
  IconCheck,
  IconInfo,
} from "./Icons";

interface AboutSectionProps {
  onNavigateTab: (tab: string) => void;
  onOpenTour: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onNavigateTab, onOpenTour }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", paddingBottom: "3rem" }}>
      {/* HEADER SECTION */}
      <section
        style={{
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-lg)",
          backgroundColor: "var(--surface-default)",
          padding: "2.5rem 2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="brand-badge">ARCHITECTURE &amp; RESEARCH SPECIFICATION</span>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            PROJECT SPECIFICATION 1.0.0
          </span>
        </div>

        <div>
          <h1
            style={{
              fontSize: "2.2rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              lineHeight: 1.2,
            }}
          >
            About Q-LIFELOCK &amp; The Data Lifetime Migration Framework
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-secondary)",
              lineHeight: 1.65,
              maxWidth: "880px",
              marginTop: "0.75rem",
            }}
          >
            Q-LIFELOCK is the world&apos;s first post-quantum migration platform designed around the principle of
            <strong> Data Lifetime Attenuation</strong>. Developed to solve the looming threat of nation-state Harvest-Now-Decrypt-Later
            (HNDL) programs, Q-LIFELOCK bridges the gap between static software analysis, mathematical quantum cryptanalysis,
            and regulatory compliance mandates.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => onNavigateTab("overview")}
          >
            <span>Open Posture Console</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigateTab("quantumlab")}
          >
            <span>Explore Quantum Proofs (Shor&apos;s Lab)</span>
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onOpenTour}
          >
            <span>Run Interactive Tour</span>
          </button>
        </div>
      </section>

      {/* SECTION 1: THE CORE THESIS & MATHEMATICAL FOUNDATION */}
      <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 700 }}>
            Mathematical Proof
          </span>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            The Data Lifetime Thesis: Formal Proof
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", maxWidth: "800px" }}>
            Understanding why traditional vulnerability scanners create dangerous complacency in enterprise post-quantum planning.
          </p>
        </div>

        <div
          style={{
            padding: "1.75rem",
            backgroundColor: "var(--surface-default)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-default)",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>1. The Mosca Theorem Formalization</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              In 2015, quantum cryptographer Dr. Michele Mosca established the foundational inequality governing cryptographic obsolescence:
            </p>
          </div>

          <div
            style={{
              padding: "1rem 1.25rem",
              backgroundColor: "var(--surface-subtle)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-default)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.95rem",
              fontWeight: 700,
            }}
          >
            X + Y &gt; Z ⟹ Active Breach Condition
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", fontSize: "0.825rem" }}>
            <div style={{ padding: "0.75rem", backgroundColor: "var(--surface-subtle)", borderRadius: "var(--radius-sm)" }}>
              <strong>Variable X (Shelf-Life):</strong>
              <p style={{ color: "var(--text-muted)", marginTop: "0.25rem" }}>
                How long data must remain confidential under regulatory mandates (e.g. GLBA requires 30 years for loan registries; HIPAA requires 25+ years for health records).
              </p>
            </div>

            <div style={{ padding: "0.75rem", backgroundColor: "var(--surface-subtle)", borderRadius: "var(--radius-sm)" }}>
              <strong>Variable Y (Migration Time):</strong>
              <p style={{ color: "var(--text-muted)", marginTop: "0.25rem" }}>
                The time required to re-engineer infrastructure, audit codebases, deploy post-quantum algorithms, and validate non-regression (typically 3–5 years).
              </p>
            </div>

            <div style={{ padding: "0.75rem", backgroundColor: "var(--surface-subtle)", borderRadius: "var(--radius-sm)" }}>
              <strong>Variable Z (Quantum Emergence):</strong>
              <p style={{ color: "var(--text-muted)", marginTop: "0.25rem" }}>
                The timeline until a Cryptographically Relevant Quantum Computer (CRQC) is deployed by a nation-state or cloud provider (~9–14 years, baseline: 2035).
              </p>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border-default)", paddingTop: "1rem" }}>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.35rem" }}>
              2. The Retroactive Exposure Window Equation
            </h4>
            <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Q-LIFELOCK computes the exact breach window (T_breach) for every cryptographic finding in source code:
            </p>
            <div
              style={{
                marginTop: "0.5rem",
                padding: "0.75rem 1rem",
                backgroundColor: "var(--surface-subtle)",
                borderRadius: "var(--radius-sm)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem",
                fontWeight: 700,
              }}
            >
              T_breach = max(0, (T_current + X) - T_CRQC)
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.5rem", lineHeight: 1.5 }}>
              For a 30-year customer master ledger encrypted in 2026: (2026 + 30) - 2035 = <strong>21 Years of Unauthorized Exposure</strong>.
              Even if the company migrates to quantum-resistant cryptography tomorrow, ciphertexts intercepted over the wire today will be decrypted by adversaries for over two decades.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: SYSTEM ARCHITECTURE & ENGINES */}
      <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 700 }}>
            Core Technology
          </span>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Q-LIFELOCK Engine Architecture
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Modular, high-throughput engines built in Python and TypeScript adhering to institutional software standards.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1rem" }}>
          {/* Engine 1: Scanner */}
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <IconTerminal size={18} color="var(--text-primary)" />
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>core.scanner (AST Engine)</h3>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              Zero-regex Abstract Syntax Tree parser analyzing Python, JavaScript, TypeScript, C, and Go repositories.
              Extracts cryptographic primitives, key lengths, initialization vectors, and padding schemes with 100% deterministic reproducibility.
            </p>
            <div style={{ marginTop: "0.75rem", fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
              AST Nodes · Path Traversal Protected · Multi-language
            </div>
          </div>

          {/* Engine 2: Risk & Context */}
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <IconShield size={18} color="var(--text-primary)" />
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>core.risk (Lifetime Prioritization)</h3>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              Multi-variable mathematical risk function evaluating algorithm breakability, key entropy, regulatory data retention shelf-life, and execution context. Automatically attenuates test mocks.
            </p>
            <div style={{ marginTop: "0.75rem", fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
              Score: 0–100 · Context Attenuation · Overlap Multiplier
            </div>
          </div>

          {/* Engine 3: Time Machine */}
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <IconClock size={18} color="var(--text-primary)" />
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>core.timemachine (Parametric Scrubber)</h3>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              Dynamic simulation module enabling real-time temporal scrubbing across projected quantum arrival horizons (2027 to 2045).
              Computes delta shifts, re-classifying cryptographic assets dynamically as arrival forecasts accelerate.
            </p>
            <div style={{ marginTop: "0.75rem", fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
              Parametric Simulation · Horizon Deltas · Real-time
            </div>
          </div>

          {/* Engine 4: Migration & CBOM */}
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <IconLayers size={18} color="var(--text-primary)" />
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>core.migration &amp; core.export</h3>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              Translates legacy findings into NIST FIPS 203 (ML-KEM), 204 (ML-DSA), and 205 (SLH-DSA) parameter sets.
              Generates fully compliant CycloneDX 1.6 Cryptographic BOM (CBOM) JSON and CISO Executive Audit reports.
            </p>
            <div style={{ marginTop: "0.75rem", fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
              CycloneDX 1.6 Spec · FIPS Recommendations · Board Audit
            </div>
          </div>

          {/* Engine 5: Quantum Lab */}
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <IconCpu size={18} color="var(--text-primary)" />
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>core.quantum (Cryptanalysis Proofs)</h3>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              Interactive Shor&apos;s period-finding quantum order-finding simulator (factoring benchmarks such as N=15, 21, 33, 35) and peer-reviewed physical qubit scaling models under planar surface codes.
            </p>
            <div style={{ marginTop: "0.75rem", fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
              Shor Quantum Circuit · Gidney-Ekerå Scaling · Surface Codes
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: OFFICIAL NIST POST-QUANTUM SPECIFICATIONS TABLE */}
      <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 700 }}>
            Standards Authority
          </span>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Ratified NIST Post-Quantum Cryptographic Standards (August 2024)
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            The official US Government post-quantum standards governing all federal, financial, and enterprise infrastructure.
          </p>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Standard</th>
                <th>Underlying Primitive</th>
                <th>Mathematical Family</th>
                <th>Primary Legacy Replacement</th>
                <th>Recommended Parameter Set</th>
                <th>NIST Security Level</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 700, fontFamily: "var(--font-mono)" }}>NIST FIPS 203</td>
                <td>ML-KEM (CRYSTALS-Kyber)</td>
                <td>Module Learning With Errors (MLWE)</td>
                <td>RSA Key Encapsulation, ECDH, Diffie-Hellman</td>
                <td><strong>ML-KEM-768</strong></td>
                <td>Level 3 (AES-192 equivalent)</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, fontFamily: "var(--font-mono)" }}>NIST FIPS 204</td>
                <td>ML-DSA (CRYSTALS-Dilithium)</td>
                <td>Module Short Integer Solution (MSIS)</td>
                <td>RSA-PSS, ECDSA (secp256k1, P-256)</td>
                <td><strong>ML-DSA-65</strong></td>
                <td>Level 3 (AES-192 equivalent)</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, fontFamily: "var(--font-mono)" }}>NIST FIPS 205</td>
                <td>SLH-DSA (SPHINCS+)</td>
                <td>Stateless Hash-Based Tree Signature</td>
                <td>Root CAs, Firmware Signing, Long-lived Certs</td>
                <td><strong>SLH-DSA-SHAKE-128f</strong></td>
                <td>Level 1 (AES-128 equivalent)</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, fontFamily: "var(--font-mono)" }}>NIST FIPS 206</td>
                <td>FN-DSA (FALCON)</td>
                <td>Fast-Fourier Lattice Trapdoors</td>
                <td>Constrained IoT Devices, Low-Bandwidth Networks</td>
                <td><strong>FN-DSA-512</strong></td>
                <td>Level 1 (AES-128 equivalent)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 4: FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION */}
      <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 700 }}>
            Knowledge Base
          </span>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Frequently Asked Questions &amp; Technical Deep-Dive
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Clear, authoritative answers to the most common engineering and executive questions regarding post-quantum cryptography.
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
    </div>
  );
};
