"use client";

import React from "react";

export interface ConceptInfo {
  title: string;
  subtitle: string;
  simpleExplanation: string;
  realWorldAnalogy: string;
  whyItMatters: string;
  tag: string;
}

export const CONCEPTS: Record<string, ConceptInfo> = {
  hndl: {
    title: "Harvest Now, Decrypt Later (HNDL)",
    subtitle: "The primary quantum threat to long-term confidentiality",
    simpleExplanation:
      "Hostile intelligence agencies and adversaries are intercepting and storing encrypted internet traffic and backups right now, even though they cannot break it today. When a sufficiently powerful quantum computer is built in the future, they will decrypt all of it.",
    realWorldAnalogy:
      "Imagine a burglar stealing a high-tech locked safe from your house today. They don't have the key right now, so they store it in a warehouse. Ten years from now, a master key is invented — and they open the safe and read every document inside.",
    whyItMatters:
      "If your customer data or medical records must remain confidential for 30 years, they are already in danger today if encrypted with legacy algorithms like RSA or ECC.",
    tag: "Threat Model",
  },
  mosca: {
    title: "Mosca's Theorem (X + Y > Z)",
    subtitle: "The mathematical rule for when an organization is already too late",
    simpleExplanation:
      "Created by quantum pioneer Dr. Michele Mosca. It states: If the time your data must stay secret (X) plus the time it takes your organization to migrate its systems (Y) is greater than the time until a quantum computer arrives (Z), then your security is already compromised.",
    realWorldAnalogy:
      "If you need 30 years of secrecy (X = 30) and 3 years to upgrade your software (Y = 3), that equals 33 years. If quantum computers arrive in 9 years (Z = 9), then 33 > 9. You are 24 years behind schedule!",
    whyItMatters:
      "This theorem proves that waiting for quantum computers to be built before migrating is fatal. Migration must happen years in advance.",
    tag: "Security Math",
  },
  crqc: {
    title: "CRQC (Cryptographically Relevant Quantum Computer)",
    subtitle: "The threshold of quantum capability that breaks modern encryption",
    simpleExplanation:
      "A quantum computer with enough stable, error-corrected qubits to execute Shor's algorithm at scale, which will instantly break RSA-2048, ECDSA, and Diffie-Hellman encryption.",
    realWorldAnalogy:
      "Modern computers guessing an RSA key is like one person trying every combination on a lock with a trillion dials — it would take millions of years. A CRQC checks all combinations simultaneously in hours.",
    whyItMatters:
      "All modern financial systems, HTTPS web traffic, passwords, and digital signatures depend on classical public-key cryptography that a CRQC will render obsolete.",
    tag: "Quantum Computing",
  },
  lifetime: {
    title: "Data Lifetime as a Prioritization Variable",
    subtitle: "The core innovation of Q-LIFELOCK",
    simpleExplanation:
      "Not all cryptographic keys are equal. Traditional scanners panic and say 'You have 10 RSA keys'. Q-LIFELOCK evaluates how long the underlying information actually needs to stay secret.",
    realWorldAnalogy:
      "A temporary one-time password (OTP) expires in 60 seconds — who cares if someone can decrypt it 10 years from now? But a patient's genetic health history or an interbank financial treaty must stay secret for 30+ years.",
    whyItMatters:
      "By sorting by data lifetime, security teams focus their budget and engineering time on the 10% of critical long-lived assets that actually face immediate quantum threat.",
    tag: "Q-LIFELOCK Thesis",
  },
  nist: {
    title: "NIST Post-Quantum Standards (FIPS 203, 204, 205)",
    subtitle: "The official replacements for legacy public-key cryptography",
    simpleExplanation:
      "In August 2024, the US National Institute of Standards and Technology (NIST) officially released the final standards for quantum-safe cryptography based on structured lattice math and hash trees.",
    realWorldAnalogy:
      "FIPS 203 (ML-KEM) is the new quantum-safe padlock for encrypting files and connections. FIPS 204 (ML-DSA) is the new quantum-safe signature pen for authorizing payments and contracts.",
    whyItMatters:
      "These are the exact standards organizations worldwide must implement to achieve quantum compliance before government deadlines.",
    tag: "Standards",
  },
  shor: {
    title: "Shor's Algorithm & Quantum Fourier Transform",
    subtitle: "The mathematical formula that breaks RSA",
    simpleExplanation:
      "Invented by mathematician Peter Shor in 1994. It solves the prime factoring problem and discrete logarithms in polynomial time by finding the repeating period of modular powers using quantum superposition.",
    realWorldAnalogy:
      "Instead of searching for a hidden repeating frequency by testing one note at a time, quantum interference cancels out all wrong frequencies instantly, leaving only the correct period.",
    whyItMatters:
      "Shor's algorithm is the exact reason classical asymmetric cryptography will fail when fault-tolerant quantum hardware reaches maturity.",
    tag: "Quantum Theory",
  },
};

interface ConceptModalProps {
  conceptKey: string | null;
  onClose: () => void;
}

export const ConceptModal: React.FC<ConceptModalProps> = ({ conceptKey, onClose }) => {
  if (!conceptKey || !CONCEPTS[conceptKey]) return null;

  const concept = CONCEPTS[conceptKey];

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 110 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "600px" }}
      >
        <div className="modal-header">
          <div>
            <span className="brand-badge" style={{ marginBottom: "0.35rem", display: "inline-block" }}>
              {concept.tag}
            </span>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)" }}>
              {concept.title}
            </h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{concept.subtitle}</p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Plain English Explanation */}
          <div>
            <h4 style={{ fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
              Core Technical Meaning
            </h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {concept.simpleExplanation}
            </p>
          </div>

          {/* Real World Analogy */}
          <div
            style={{
              padding: "0.85rem 1rem",
              backgroundColor: "var(--surface-subtle)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-default)",
            }}
          >
            <h4 style={{ fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-primary)", marginBottom: "0.25rem" }}>
              Real-World Analogy
            </h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              {concept.realWorldAnalogy}
            </p>
          </div>

          {/* Why it matters */}
          <div>
            <h4 style={{ fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
              Architectural Significance in Q-LIFELOCK
            </h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              {concept.whyItMatters}
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary btn-sm" onClick={onClose}>
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
