"use client";

import React from "react";
import { IconShield, IconTerminal, IconClock, IconLayers, IconSparkles, IconLock } from "./Icons";

interface FooterProps {
  onNavigateTab: (tab: string) => void;
  onOpenTour: () => void;
  onOpenScanModal: () => void;
  onOpenExportModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateTab,
  onOpenTour,
  onOpenScanModal,
  onOpenExportModal,
}) => {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-default)",
        backgroundColor: "var(--bg-canvas)",
        padding: "3rem 1.5rem 2rem",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "2.5rem",
        }}
      >
        {/* Top Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "2rem",
          }}
        >
          {/* Brand Col */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div className="brand-logo-icon">Q</div>
              <span style={{ fontSize: "1.1rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Q-LIFELOCK</span>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              Enterprise post-quantum cryptographic posture and migration platform prioritizing quantum risk by legal data retention lifecycles.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
              <span className="pulse-dot" />
              <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
                AST Scanner: Operational (CycloneDX 1.6)
              </span>
            </div>
          </div>

          {/* Navigation Col */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <span style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 700 }}>
              Platform Navigation
            </span>
            <button
              type="button"
              onClick={() => onNavigateTab("home")}
              style={{ background: "none", border: "none", padding: 0, textAlign: "left", fontSize: "0.825rem", color: "var(--text-secondary)", cursor: "pointer" }}
            >
              Home &amp; Product Overview
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab("overview")}
              style={{ background: "none", border: "none", padding: 0, textAlign: "left", fontSize: "0.825rem", color: "var(--text-secondary)", cursor: "pointer" }}
            >
              Posture &amp; Telemetry Console
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab("findings")}
              style={{ background: "none", border: "none", padding: 0, textAlign: "left", fontSize: "0.825rem", color: "var(--text-secondary)", cursor: "pointer" }}
            >
              Cryptographic Findings Inventory
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab("timemachine")}
              style={{ background: "none", border: "none", padding: 0, textAlign: "left", fontSize: "0.825rem", color: "var(--text-secondary)", cursor: "pointer" }}
            >
              Quantum Time Machine
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab("migration")}
              style={{ background: "none", border: "none", padding: 0, textAlign: "left", fontSize: "0.825rem", color: "var(--text-secondary)", cursor: "pointer" }}
            >
              NIST Migration Roadmap
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab("quantumlab")}
              style={{ background: "none", border: "none", padding: 0, textAlign: "left", fontSize: "0.825rem", color: "var(--text-secondary)", cursor: "pointer" }}
            >
              Quantum Cryptanalysis Lab
            </button>
          </div>

          {/* Standards & Authority Col */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <span style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 700 }}>
              Standards &amp; Mandates
            </span>
            <button
              type="button"
              onClick={() => onNavigateTab("about")}
              style={{ background: "none", border: "none", padding: 0, textAlign: "left", fontSize: "0.825rem", color: "var(--text-secondary)", cursor: "pointer" }}
            >
              About &amp; Technical Architecture
            </button>
            <span style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>
              NIST FIPS 203 (ML-KEM-768)
            </span>
            <span style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>
              NIST FIPS 204 (ML-DSA-65)
            </span>
            <span style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>
              NIST FIPS 205 (SLH-DSA)
            </span>
            <span style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>
              NSA CNSA 2.0 (2030 Mandate)
            </span>
            <span style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>
              White House OMB M-23-02
            </span>
          </div>

          {/* Quick Actions Col */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <span style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 700 }}>
              Quick Actions
            </span>
            <button
              type="button"
              onClick={onOpenScanModal}
              style={{ background: "none", border: "none", padding: 0, textAlign: "left", fontSize: "0.825rem", color: "var(--text-secondary)", cursor: "pointer" }}
            >
              Initiate Repository Scan
            </button>
            <button
              type="button"
              onClick={onOpenExportModal}
              style={{ background: "none", border: "none", padding: 0, textAlign: "left", fontSize: "0.825rem", color: "var(--text-secondary)", cursor: "pointer" }}
            >
              Export CycloneDX 1.6 CBOM
            </button>
            <button
              type="button"
              onClick={onOpenTour}
              style={{ background: "none", border: "none", padding: 0, textAlign: "left", fontSize: "0.825rem", color: "var(--text-secondary)", cursor: "pointer" }}
            >
              Open Interactive Walkthrough
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid var(--border-default)",
            paddingTop: "1.25rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} Q-LIFELOCK Cryptographic Engineering Systems. All rights reserved.
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <span>NIST FIPS 203/204/205 Compliant</span>
            <span>•</span>
            <span>CycloneDX v1.6 Validated</span>
            <span>•</span>
            <span>Zero-AI Hallucination Guaranteed</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
