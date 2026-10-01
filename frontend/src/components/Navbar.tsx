"use client";

import React from "react";
import { ScanSummary } from "../types";
import { IconCompass, IconSun, IconMoon, IconDownload, IconTerminal } from "./Icons";

interface NavbarProps {
  scanSummary: ScanSummary | null;
  onOpenScanModal: () => void;
  onOpenExportModal: () => void;
  onOpenTour: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  scanSummary,
  onOpenScanModal,
  onOpenExportModal,
  onOpenTour,
  theme,
  onToggleTheme,
  onNavigateTab,
}) => {
  return (
    <header className="navbar">
      <div
        className="nav-brand"
        onClick={() => onNavigateTab && onNavigateTab("home")}
        style={{ cursor: onNavigateTab ? "pointer" : "default" }}
        title="Go to Q-LIFELOCK Home"
      >
        <div className="brand-logo-icon">Q</div>
        <div className="brand-text">
          <div className="brand-title">
            <span>Q-LIFELOCK</span>
            <span className="brand-badge">FIPS 203/204</span>
          </div>
          <span className="brand-subtitle">
            Post-Quantum Cryptographic Posture &amp; Migration
          </span>
        </div>
      </div>

      <div className="nav-center">
        <div className="pulse-dot" />
        <span style={{ fontSize: "0.78rem", fontWeight: 500, color: "var(--text-secondary)" }}>
          CRQC Horizon: <strong style={{ color: "var(--text-primary)" }}>{scanSummary?.scenario_year || 2035}</strong>
        </span>
        <span style={{ color: "var(--border-strong)" }}>•</span>
        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
          HNDL Threat: <span style={{ color: "var(--text-primary)", fontWeight: 700, fontFamily: "var(--font-mono)" }}>ACTIVE</span>
        </span>
      </div>

      <div className="nav-actions">
        <button
          className="btn btn-secondary btn-sm"
          onClick={onOpenTour}
          title="Open interactive walkthrough & guide"
        >
          <IconCompass size={14} />
          <span>Guide</span>
        </button>

        <button
          className="btn btn-secondary btn-sm"
          onClick={onToggleTheme}
          title="Toggle Dark/Light Mode"
        >
          {theme === "dark" ? <IconSun size={14} /> : <IconMoon size={14} />}
          <span>{theme === "dark" ? "Light" : "Dark"}</span>
        </button>

        <button
          className="btn btn-secondary btn-sm"
          onClick={onOpenExportModal}
        >
          <IconDownload size={14} />
          <span>Export CBOM</span>
        </button>

        <button
          className="btn btn-primary btn-sm"
          onClick={onOpenScanModal}
        >
          <IconTerminal size={14} />
          <span>Scan Repository</span>
        </button>
      </div>
    </header>
  );
};
