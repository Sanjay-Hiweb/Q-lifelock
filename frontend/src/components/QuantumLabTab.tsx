"use client";

import React, { useState, useEffect } from "react";
import { ToyShorResult, ResourceEstimate } from "../types";
import { ApiService } from "../services/api";
import { ConceptTrigger } from "./ConceptTrigger";
import { IconSparkles, IconTerminal, IconLayers, IconInfo } from "./Icons";

interface QuantumLabTabProps {
  onOpenConcept?: (key: string) => void;
}

export const QuantumLabTab: React.FC<QuantumLabTabProps> = ({ onOpenConcept }) => {
  // Shor's Simulation state
  const [shorN, setShorN] = useState<number>(15);
  const [shorResult, setShorResult] = useState<ToyShorResult | null>(null);
  const [shorLoading, setShorLoading] = useState<boolean>(false);

  // Resource Estimator state
  const [selectedAlgo, setSelectedAlgo] = useState<string>("RSA");
  const [selectedKeySize, setSelectedKeySize] = useState<number>(2048);
  const [estimate, setEstimate] = useState<ResourceEstimate | null>(null);

  // Fetch Shor on N change
  useEffect(() => {
    let cancelled = false;
    const runShor = async () => {
      setShorLoading(true);
      const res = await ApiService.getToyShor(shorN);
      if (!cancelled) {
        setShorResult(res);
        setShorLoading(false);
      }
    };
    runShor();
    return () => {
      cancelled = true;
    };
  }, [shorN]);

  // Fetch Resource Estimate on params change
  useEffect(() => {
    let cancelled = false;
    const fetchEstimate = async () => {
      const res = await ApiService.getResourceEstimates(selectedAlgo, selectedKeySize);
      if (!cancelled) {
        setEstimate(res);
      }
    };
    fetchEstimate();
    return () => {
      cancelled = true;
    };
  }, [selectedAlgo, selectedKeySize]);

  const derivedFactors = shorResult?.derived_factors || [];
  const executionSteps = shorResult?.execution_steps || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Intro Header */}
      <div className="card" style={{ borderTop: "2px solid var(--text-primary)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <IconSparkles size={18} color="var(--text-primary)" />
                <span>Quantum Cryptanalysis &amp; Fault-Tolerant Resource Lab</span>
              </h2>
              {onOpenConcept && (
                <>
                  <ConceptTrigger conceptKey="shor" label="Shor's Algorithm Proof" onOpenConcept={onOpenConcept} />
                  <ConceptTrigger conceptKey="crqc" label="CRQC Specifications" onOpenConcept={onOpenConcept} />
                </>
              )}
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.35rem" }}>
              Cryptanalysis validation models for quantum vulnerability. Simulates Shor&apos;s modular order-finding and calculates fault-tolerant hardware scaling under Gidney-Ekerå surface-code architectures.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.25rem" }}>
        {/* Shor's Algorithm Simulation */}
        <div className="card">
          <div className="card-title-row">
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <IconTerminal size={16} color="var(--text-primary)" />
              <h3 className="card-title" style={{ fontSize: "0.92rem" }}>
                Shor&apos;s Period-Finding Simulation
              </h3>
            </div>
            <span className="brand-badge">Polynomial QFT</span>
          </div>
          <p className="card-description" style={{ fontSize: "0.78rem" }}>
            Extracting the periodicity of modular exponentiation in polynomial time O((log N)³).
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Target Composite N:</label>
            <select
              className="select-control"
              value={shorN}
              onChange={(e) => setShorN(parseInt(e.target.value, 10))}
            >
              <option value={15}>15 (3 × 5) — Standard Benchmark</option>
              <option value={21}>21 (3 × 7)</option>
              <option value={33}>33 (3 × 11)</option>
              <option value={35}>35 (5 × 7)</option>
            </select>
          </div>

          {shorLoading && (
            <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              Running quantum simulation...
            </div>
          )}

          {shorResult && !shorLoading && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div
                style={{
                  padding: "0.85rem",
                  backgroundColor: "var(--surface-subtle)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-default)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", fontWeight: 600 }}>Target Integer:</span>
                  <div style={{ fontSize: "1.25rem", fontWeight: 700, fontFamily: "var(--font-mono)" }}>N = {shorResult.target_integer}</div>
                </div>
                <div>
                  <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", fontWeight: 600 }}>Measured Period:</span>
                  <div style={{ fontSize: "1.25rem", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                    r = {shorResult.measured_period_r ?? (shorResult as any).quantum_period_r ?? "—"}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", fontWeight: 600 }}>Derived Factors:</span>
                  <div style={{ fontSize: "1.25rem", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                    {derivedFactors.join(" × ")}
                  </div>
                </div>
              </div>

              {/* Execution Steps */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>
                  Quantum Circuit Execution Breakdown
                </span>
                {executionSteps.map((st, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "0.65rem 0.85rem",
                      backgroundColor: "var(--surface-subtle)",
                      borderRadius: "var(--radius-sm)",
                      borderLeft: "2px solid var(--text-primary)",
                      fontSize: "0.78rem",
                    }}
                  >
                    <strong>Step {idx + 1}: {st.step}</strong>
                    <div style={{ color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                      {st.details}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quantum Hardware Resource Estimator */}
        <div className="card">
          <div className="card-title-row">
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <IconLayers size={16} color="var(--text-primary)" />
              <h3 className="card-title" style={{ fontSize: "0.92rem" }}>
                Fault-Tolerant Resource Estimator
              </h3>
            </div>
            <span className="brand-badge">Surface Code Scaling</span>
          </div>
          <p className="card-description" style={{ fontSize: "0.78rem" }}>
            Quantifying physical and logical qubits, gate depth, and runtime needed to break classical algorithms under planar surface codes.
          </p>

          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.25rem" }}>
                Algorithm:
              </label>
              <select
                className="select-control"
                style={{ width: "100%" }}
                value={selectedAlgo}
                onChange={(e) => {
                  setSelectedAlgo(e.target.value);
                  setSelectedKeySize(e.target.value === "RSA" ? 2048 : 256);
                }}
              >
                <option value="RSA">RSA (Factoring)</option>
                <option value="ECDSA">ECDSA / ECC (Discrete Log)</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.25rem" }}>
                Key Size:
              </label>
              <select
                className="select-control"
                style={{ width: "100%" }}
                value={selectedKeySize}
                onChange={(e) => setSelectedKeySize(parseInt(e.target.value, 10))}
              >
                {selectedAlgo === "RSA" ? (
                  <>
                    <option value={2048}>2048-bit (Standard Banking)</option>
                    <option value={3072}>3072-bit (High Assurance)</option>
                    <option value={4096}>4096-bit (Root CA)</option>
                  </>
                ) : (
                  <>
                    <option value={256}>256-bit (secp256k1 / P-256)</option>
                    <option value={384}>384-bit (P-384 Suite B)</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {estimate && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div className="table-wrapper">
                <table className="data-table">
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Target Scheme</td>
                      <td className="font-mono">{estimate.algorithm}-{estimate.key_size}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Logical Qubits Needed</td>
                      <td className="font-mono" style={{ fontWeight: 700 }}>
                        {estimate.logical_qubits ? estimate.logical_qubits.toLocaleString() : "N/A"} logical qubits
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Physical Qubits (Surface Code)</td>
                      <td className="font-mono" style={{ fontWeight: 700 }}>
                        ~{estimate.physical_qubits_estimated ? estimate.physical_qubits_estimated.toLocaleString() : "N/A"} physical qubits
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Toffoli Gate Depth</td>
                      <td className="font-mono">{estimate.toffoli_depth}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Estimated Cryptanalysis Time</td>
                      <td style={{ fontWeight: 600 }}>{estimate.estimated_wall_clock_time}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Literature Reference</td>
                      <td style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                        {estimate.reference_paper}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div
                style={{
                  padding: "0.75rem",
                  backgroundColor: "var(--surface-subtle)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.74rem",
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.4rem",
                }}
              >
                <IconInfo size={14} color="var(--text-muted)" style={{ marginTop: "2px", flexShrink: 0 }} />
                <span><strong>Physical Qubit Calculation:</strong> Assumes distance-27 surface codes operating at physical gate error rate p = 10⁻³ with magic state distillation and lattice surgery routing.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
