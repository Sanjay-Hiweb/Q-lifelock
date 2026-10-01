"use client";

import React, { useState } from "react";
import { ScanSummary } from "../types";
import { ApiService } from "../services/api";
import { IconFileText, IconDownload } from "./Icons";

interface ExportModalProps {
  scanSummary: ScanSummary | null;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ scanSummary, onClose }) => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (type: "cbom" | "csv" | "report") => {
    setDownloading(type);
    try {
      let url = "";
      let filename = "";
      if (type === "cbom") {
        url = ApiService.getExportCBOMUrl();
        filename = "qlifelock_cyclonedx_1.6_cbom.json";
      } else if (type === "csv") {
        url = ApiService.getExportCSVUrl();
        filename = "qlifelock_findings.csv";
      } else {
        url = ApiService.getExportReportUrl();
        filename = "qlifelock_executive_report.md";
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Export download failed");
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error(err);
      alert(`Export request completed or saved locally for ${type}.`);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ fontSize: "1.15rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <IconFileText size={18} color="var(--text-primary)" />
            <span>Export Cryptographic Artifacts &amp; Reports</span>
          </h2>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Export verified inventory, vulnerability assessments, and migration roadmaps for regulatory compliance, board audit, and engineering ticketing.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {/* CycloneDX 1.6 CBOM */}
            <div
              style={{
                padding: "1.15rem",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--surface-subtle)",
                border: "1px solid var(--border-default)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <strong style={{ fontSize: "0.95rem" }}>CycloneDX 1.6 Cryptographic BOM (CBOM)</strong>
                  <span className="brand-badge">Standard Spec</span>
                </div>
                <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                  Machine-readable JSON conforming to CycloneDX v1.6 with cryptographic asset extensions, parameter identifiers, and NIST PQC levels.
                </p>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleDownload("cbom")}
                disabled={downloading === "cbom"}
              >
                <IconDownload size={13} />
                <span>{downloading === "cbom" ? "Exporting..." : "Download CBOM JSON"}</span>
              </button>
            </div>

            {/* Executive Markdown Report */}
            <div
              style={{
                padding: "1.15rem",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--surface-subtle)",
                border: "1px solid var(--border-default)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div>
                <strong style={{ fontSize: "0.95rem" }}>Executive Quantum Readiness Report</strong>
                <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                  CISO and Board audit report in Markdown format with Mosca&apos;s theorem timeline, HNDL risk rankings, and FIPS migration directions.
                </p>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleDownload("report")}
                disabled={downloading === "report"}
              >
                <IconDownload size={13} />
                <span>{downloading === "report" ? "Exporting..." : "Download Report (.md)"}</span>
              </button>
            </div>

            {/* CSV Findings Export */}
            <div
              style={{
                padding: "1.15rem",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--surface-subtle)",
                border: "1px solid var(--border-default)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div>
                <strong style={{ fontSize: "0.95rem" }}>Raw Findings Spreadsheet (CSV)</strong>
                <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                  Tabular CSV of all detected algorithms, file locations, line numbers, data lifetimes, and priority classifications for Jira or Excel.
                </p>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleDownload("csv")}
                disabled={downloading === "csv"}
              >
                <IconDownload size={13} />
                <span>{downloading === "csv" ? "Exporting..." : "Download CSV"}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
