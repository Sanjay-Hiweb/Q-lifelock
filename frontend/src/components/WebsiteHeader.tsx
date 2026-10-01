"use client";

import React from "react";
import { IconSun, IconMoon, IconArrowRight, IconShield } from "./Icons";

interface WebsiteHeaderProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onLaunchConsole: (initialTab?: string) => void;
}

export const WebsiteHeader: React.FC<WebsiteHeaderProps> = ({
  theme,
  onToggleTheme,
  onLaunchConsole,
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="navbar" style={{ padding: "0.85rem 2rem" }}>
      <div className="nav-brand" style={{ cursor: "pointer" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <div className="brand-logo-icon">Q</div>
        <div className="brand-text">
          <div className="brand-title">
            <span>Q-LIFELOCK</span>
            <span className="brand-badge">ENTERPRISE EDITION</span>
          </div>
          <span className="brand-subtitle">
            Post-Quantum Cryptographic Posture &amp; Migration
          </span>
        </div>
      </div>

      <nav className="nav-center" style={{ gap: "1.25rem", padding: "0.4rem 1.25rem" }}>
        <button
          type="button"
          onClick={() => scrollTo("overview")}
          style={{ background: "none", border: "none", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer" }}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={() => scrollTo("threat")}
          style={{ background: "none", border: "none", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer" }}
        >
          HNDL Threat
        </button>
        <button
          type="button"
          onClick={() => scrollTo("architecture")}
          style={{ background: "none", border: "none", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer" }}
        >
          Architecture
        </button>
        <button
          type="button"
          onClick={() => scrollTo("standards")}
          style={{ background: "none", border: "none", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer" }}
        >
          NIST Standards
        </button>
        <button
          type="button"
          onClick={() => scrollTo("faq")}
          style={{ background: "none", border: "none", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer" }}
        >
          FAQ
        </button>
      </nav>

      <div className="nav-actions">
        <button
          className="btn btn-secondary btn-sm"
          onClick={onToggleTheme}
          title="Toggle Dark/Light Mode"
        >
          {theme === "dark" ? <IconSun size={14} /> : <IconMoon size={14} />}
          <span>{theme === "dark" ? "Light" : "Dark"}</span>
        </button>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => onLaunchConsole("overview")}
          style={{ padding: "0.4rem 1rem", fontWeight: 700 }}
        >
          <IconShield size={14} />
          <span>Launch Project Console</span>
          <IconArrowRight size={13} />
        </button>
      </div>
    </header>
  );
};
