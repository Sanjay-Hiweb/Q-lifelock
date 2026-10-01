"use client";

import React, { useState } from "react";

interface GuidedTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export const GuidedTourModal: React.FC<GuidedTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      title: "Welcome to Q-LIFELOCK",
      badge: "The Game Changer",
      headline: "Why Traditional Security Scanners Fail at Post-Quantum Security",
      content:
        "Standard security tools just give you a flat list: 'You have 50 RSA keys in your code.' That causes panic and alert fatigue because you don't know what to fix first.\n\nQ-LIFELOCK changes the paradigm by asking: What data does this key protect, and how long must that data legally stay confidential?",
      example:
        "Example: A 15-minute login token using RSA is completely safe. But a 30-year patient health record using RSA is under active attack right now.",
      actionLabel: "Next: The Core Thesis →",
      targetTab: "overview",
    },
    {
      title: "Step 1: The Data Lifetime Thesis",
      badge: "Core Innovation",
      headline: "Sorting Quantum Urgency by How Long Data Lives",
      content:
        "A quantum computer capable of breaking RSA does not exist today. But adversaries are recording encrypted data today to decrypt it later (Harvest Now, Decrypt Later).\n\nIf you encrypt a 30-year banking mortgage or trade secret in 2026, its confidentiality must survive until 2056. When a quantum computer arrives in 2035, that secret will be exposed for 21 years!",
      example:
        "Formula: Overlap Window = (Today + Data Lifetime) - Quantum Arrival Year. If Overlap > 0, you face an active security breach.",
      actionLabel: "Next: See Findings Inventory →",
      targetTab: "findings",
    },
    {
      title: "Step 2: Cryptographic Findings & Evidence",
      badge: "Zero Guesswork",
      headline: "Line-by-Line Code Evidence with Context Attenuation",
      content:
        "Q-LIFELOCK scans your repository and flags the exact line of code where quantum-vulnerable cryptography occurs.\n\nCrucially, it recognizes context: Unit test mocks are automatically attenuated (downgraded to Low Priority), while live payment gateways and master vaults are highlighted as Critical.",
      example:
        "Click 'Inspect' on any finding row to see the exact code snippet, data classification, and NIST replacement recommendation.",
      actionLabel: "Next: Try the Time Machine →",
      targetTab: "timemachine",
    },
    {
      title: "Step 3: The Quantum Time Machine",
      badge: "Interactive Simulation",
      headline: "Simulate Future Scenarios in Real-Time",
      content:
        "No one knows the exact year a fault-tolerant quantum computer will arrive. Will it be 2029 (aggressive nation-state breakthrough), 2035 (NIST baseline), or 2040 (conservative)?\n\nThe Quantum Time Machine lets you scrub the timeline from 2027 to 2045 and watch in real-time as your assets shift from Safe to Critical.",
      example:
        "Try dragging the slider to 2029: Watch assets with 7-year lifetimes suddenly jump into the High/Critical danger zone!",
      actionLabel: "Next: NIST Migration Roadmap →",
      targetTab: "migration",
    },
    {
      title: "Step 4: NIST FIPS Migration Roadmap",
      badge: "Official Standards",
      headline: "Actionable Post-Quantum Replacement (FIPS 203, 204, 205)",
      content:
        "In August 2024, NIST officially ratified the final post-quantum standards. Q-LIFELOCK recommends the exact replacement standard based on cryptographic function:\n\n• Key Encapsulation (replacing RSA/ECDH) ➔ NIST FIPS 203 (ML-KEM)\n• Digital Signatures (replacing RSA-PSS/ECDSA) ➔ NIST FIPS 204 (ML-DSA)\n• Firmware & Root CAs ➔ NIST FIPS 205 (SLH-DSA)",
      example:
        "Our interactive Kanban board lets engineering teams track migration progress from 'Discovered' to 'Completed', updating the Quantum Readiness Score dynamically.",
      actionLabel: "Next: Quantum Lab & Shor's Math →",
      targetTab: "quantumlab",
    },
    {
      title: "Step 5: The Quantum Simulation Lab",
      badge: "The Mathematical Proof",
      headline: "Educational Proof: Shor's Factoring & Physical Qubits",
      content:
        "For technical judges, students, and executives who ask 'Why does quantum break RSA?', our Quantum Lab provides an interactive Shor's Algorithm Simulator.\n\nWatch quantum superposition and inverse QFT period-finding factor composite numbers (like N=15) step-by-step, and explore peer-reviewed resource estimates for breaking RSA-2048.",
      example:
        "Factoring RSA-2048 requires ~4,098 logical qubits and ~20 million physical qubits under distance-27 surface codes (Gidney & Ekerå 2021).",
      actionLabel: "Finish Tour & Explore Dashboard →",
      targetTab: "overview",
    },
  ];

  const step = tourSteps[currentStep] || tourSteps[0];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      try {
        const tab = tourSteps[nextStep]?.targetTab;
        if (tab) onNavigateTab(tab);
      } catch (e) {
        console.warn("Tour tab navigation non-fatal error", e);
      }
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      try {
        const tab = tourSteps[prevStep]?.targetTab;
        if (tab) onNavigateTab(tab);
      } catch (e) {
        console.warn("Tour tab navigation non-fatal error", e);
      }
    }
  };

  const handleSkip = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("qlifelock_tour_seen", "true");
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 120 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "680px", borderRadius: "var(--radius-xl)" }}
      >
        {/* Header */}
        <div className="modal-header" style={{ padding: "1.25rem 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="brand-badge" style={{ fontSize: "0.75rem" }}>
              {step.badge}
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Step {currentStep + 1} of {tourSteps.length}
            </span>
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={handleSkip}
            style={{ fontSize: "0.8rem", padding: "0.25rem 0.65rem" }}
          >
            Skip Guide ✕
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.35rem" }}>
              {step.headline}
            </h2>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              {step.title}
            </div>
          </div>

          <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6, whiteSpace: "pre-line" }}>
            {step.content}
          </div>

          <div
            style={{
              padding: "0.85rem 1.1rem",
              backgroundColor: "var(--surface-subtle)",
              borderRadius: "var(--radius-sm)",
              borderLeft: "2px solid var(--text-primary)",
              fontSize: "0.825rem",
              color: "var(--text-primary)",
              lineHeight: 1.5,
            }}
          >
            <strong>Key Takeaway:</strong> {step.example}
          </div>

          {/* Progress Indicators */}
          <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.5rem" }}>
            {tourSteps.map((_, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setCurrentStep(idx);
                  onNavigateTab(tourSteps[idx].targetTab);
                }}
                style={{
                  flex: 1,
                  height: "3px",
                  borderRadius: "var(--radius-full)",
                  backgroundColor: idx <= currentStep ? "var(--text-primary)" : "var(--border-default)",
                  cursor: "pointer",
                  transition: "background-color 0.15s ease",
                }}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ padding: "1rem 1.5rem" }}>
          {currentStep > 0 && (
            <button className="btn btn-secondary btn-sm" onClick={handlePrev}>
              ← Previous
            </button>
          )}
          <button
            className="btn btn-outline btn-sm"
            onClick={handleSkip}
            style={{ marginRight: "auto" }}
          >
            Skip to App
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleNext}>
            {step.actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
