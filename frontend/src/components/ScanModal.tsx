"use client";

import React, { useState } from "react";
import { IconTerminal, IconInfo } from "./Icons";

interface ScanModalProps {
  onClose: () => void;
  onScan: (repoPath: string, scenarioYear: number, repoName: string) => Promise<void>;
}

export const ScanModal: React.FC<ScanModalProps> = ({ onClose, onScan }) => {
  const [repoPath, setRepoPath] = useState("tests/fixtures/synthetic_repo");
  const [scenarioYear, setScenarioYear] = useState(2035);
  const [repoName, setRepoName] = useState("Synthetic-Core-Banking-Services");
  const [isScanning, setIsScanning] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    try {
      await onScan(repoPath, scenarioYear, repoName);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Scan failed. Ensure backend API is operational or check directory path.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ fontSize: "1.15rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <IconTerminal size={18} color="var(--text-primary)" />
            <span>Initiate Cryptographic Inventory Scan</span>
          </h2>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              The scanner discovers RSA, ECDSA, ECDH, and symmetric ciphers, infers usage context (production vs test), and calculates Harvest-Now-Decrypt-Later exposure.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, display: "block", marginBottom: "0.25rem" }}>
                  Repository Source (GitHub URL or Local Path):
                </label>
                <input
                  type="text"
                  className="search-input"
                  style={{ width: "100%" }}
                  value={repoPath}
                  onChange={(e) => setRepoPath(e.target.value)}
                  placeholder="e.g. https://github.com/owner/repo or tests/fixtures/synthetic_repo or D:/project"
                  required
                />
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  Paste a public GitHub repo URL (https://github.com/...) or a local folder path.
                </span>

              </div>

              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, display: "block", marginBottom: "0.25rem" }}>
                  Repository Alias / Label:
                </label>
                <input
                  type="text"
                  className="search-input"
                  style={{ width: "100%" }}
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  placeholder="e.g. Core-Banking-Gateway"
                />
              </div>

              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, display: "block", marginBottom: "0.25rem" }}>
                  Cryptographically Relevant Quantum Computer (CRQC) Threat Horizon:
                </label>
                <select
                  className="select-control"
                  style={{ width: "100%" }}
                  value={scenarioYear}
                  onChange={(e) => setScenarioYear(parseInt(e.target.value, 10))}
                >
                  <option value={2029}>2029 (Aggressive / Rapid Breakthrough)</option>
                  <option value={2035}>2035 (NIST &amp; Industry Consensus Baseline)</option>
                  <option value={2040}>2040 (Conservative Estimation)</option>
                </select>
              </div>

              <div
                style={{
                  padding: "0.75rem",
                  backgroundColor: "var(--surface-subtle)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-default)",
                  fontSize: "0.76rem",
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.4rem",
                }}
              >
                <IconInfo size={14} color="var(--text-muted)" style={{ marginTop: "2px", flexShrink: 0 }} />
                <span><strong>Pre-configured Target:</strong> The test fixture includes mock banking ledger RSA keys (30-year lifetime), interbank wire ECDSA signatures, TLS ECDH handshakes, and test attenuation mocks.</span>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose} disabled={isScanning}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={isScanning}>
              {isScanning ? "Scanning Repository..." : "Start Scan →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
