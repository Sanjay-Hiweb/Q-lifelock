"use client";

import React, { useState, useEffect } from "react";
import { ScanSummary, Finding, MigrationStatus } from "../types";
import { ApiService, MOCK_SCAN_SUMMARY } from "../services/api";

import { WebsiteHeader } from "../components/WebsiteHeader";
import { WebsiteView } from "../components/WebsiteView";
import { Navbar } from "../components/Navbar";
import { AboutSection } from "../components/AboutSection";
import { Footer } from "../components/Footer";
import { MetricCards } from "../components/MetricCards";
import { OverviewTab } from "../components/OverviewTab";
import { FindingsTab } from "../components/FindingsTab";
import { TimeMachineTab } from "../components/TimeMachineTab";
import { MigrationPlannerTab } from "../components/MigrationPlannerTab";
import { QuantumLabTab } from "../components/QuantumLabTab";
import { FindingDrawer } from "../components/FindingDrawer";
import { ExportModal } from "../components/ExportModal";
import { ScanModal } from "../components/ScanModal";
import { GuidedTourModal } from "../components/GuidedTourModal";
import { ConceptModal } from "../components/ConceptModal";
import {
  IconShield,
  IconTerminal,
  IconClock,
  IconLayers,
  IconSparkles,
  IconCpu,
} from "../components/Icons";

export default function Home() {
  const [scanSummary, setScanSummary] = useState<ScanSummary>(MOCK_SCAN_SUMMARY);
  const [viewMode, setViewMode] = useState<"website" | "console">("website");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [showScanModal, setShowScanModal] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showTour, setShowTour] = useState<boolean>(false);
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [teacherMode, setTeacherMode] = useState<boolean>(true);

  // Load initial scan from API
  useEffect(() => {
    const loadScan = async () => {
      try {
        const summary = await ApiService.getLatestScan();
        if (summary) {
          setScanSummary(summary);
        }
      } catch (err) {
        console.warn("Using baseline fallback scan summary", err);
      }
    };
    loadScan();
  }, []);

  // Theme switcher
  const handleToggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", nextTheme);
    }
  };

  // Switch to project console
  const handleLaunchConsole = (initialTab?: string) => {
    setViewMode("console");
    if (initialTab) {
      setActiveTab(initialTab);
    }
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Return to corporate website
  const handleReturnToWebsite = () => {
    setViewMode("website");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Update finding status
  const handleUpdateStatus = async (findingId: string, status: MigrationStatus) => {
    setScanSummary((prev) => {
      if (!prev) return prev;
      const baseFindings = prev.findings || [];
      const updatedFindings = baseFindings.map((f) =>
        f.finding_id === findingId ? { ...f, migration_status: status } : f
      );

      // Recompute readiness
      const total = updatedFindings.length;
      const completed = updatedFindings.filter((f) => f.migration_status === "completed").length;
      const validated = updatedFindings.filter((f) => f.migration_status === "validated").length;
      const inProgress = updatedFindings.filter((f) => f.migration_status === "in_progress").length;
      const planned = updatedFindings.filter((f) => f.migration_status === "planned").length;
      const newScore = total > 0 ? ((completed * 1.0 + validated * 0.75 + inProgress * 0.4 + planned * 0.15) / total) * 100 : 0;

      return {
        ...prev,
        readiness_score: Number(newScore.toFixed(1)),
        findings: updatedFindings,
      };
    });

    if (selectedFinding && selectedFinding.finding_id === findingId) {
      setSelectedFinding((prev) => (prev ? { ...prev, migration_status: status } : null));
    }

    try {
      await ApiService.updateFindingStatus(findingId, status);
    } catch (e) {
      console.error("Failed to update status on server", e);
    }
  };

  // Trigger scan handler
  const handleRunScan = async (repoPath: string, scenarioYear: number, repoName: string) => {
    try {
      const newSummary = await ApiService.triggerScan(repoPath, scenarioYear, repoName);
      if (newSummary) {
        setScanSummary(newSummary);
        setViewMode("console");
        setActiveTab("overview");
      }
    } catch (err) {
      console.error("Scan error", err);
    }
  };

  const totalFindings = scanSummary?.findings ? scanSummary.findings.length : 0;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ============================================================== */}
      {/* MODE 1: CLIENT-FACING FULL WEBSITE                             */}
      {/* ============================================================== */}
      {viewMode === "website" && (
        <>
          <WebsiteHeader
            theme={theme}
            onToggleTheme={handleToggleTheme}
            onLaunchConsole={handleLaunchConsole}
          />

          <main className="app-container" style={{ paddingTop: "2.5rem" }}>
            <WebsiteView
              scanSummary={scanSummary}
              onLaunchConsole={handleLaunchConsole}
              onOpenScanModal={() => setShowScanModal(true)}
              onOpenExportModal={() => setShowExportModal(true)}
              onOpenTour={() => setShowTour(true)}
              onOpenConcept={(k) => setSelectedConcept(k)}
            />
          </main>

          <Footer
            onNavigateTab={handleLaunchConsole}
            onOpenTour={() => setShowTour(true)}
            onOpenScanModal={() => setShowScanModal(true)}
            onOpenExportModal={() => setShowExportModal(true)}
          />
        </>
      )}

      {/* ============================================================== */}
      {/* MODE 2: OPERATIONAL PROJECT CONSOLE                            */}
      {/* ============================================================== */}
      {viewMode === "console" && (
        <>
          {/* Top Switcher Banner: Easily Return to Website */}
          <div
            style={{
              backgroundColor: "var(--surface-subtle)",
              borderBottom: "1px solid var(--border-default)",
              padding: "0.45rem 1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.78rem",
            }}
          >
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleReturnToWebsite}
              style={{ padding: "0.25rem 0.65rem", fontSize: "0.75rem", fontWeight: 700 }}
            >
              <span>← Return to Main Website</span>
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span className="brand-badge">LIVE PROJECT ENVIRONMENT</span>
              <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.72rem" }}>
                OPERATIONAL TELEMETRY &amp; MIGRATION CONSOLE
              </span>
            </div>
          </div>

          <Navbar
            scanSummary={scanSummary}
            onOpenScanModal={() => setShowScanModal(true)}
            onOpenExportModal={() => setShowExportModal(true)}
            onOpenTour={() => setShowTour(true)}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            onNavigateTab={handleReturnToWebsite}
          />

          {/* Console Tab Navigation Bar */}
          <div className="tabs-container">
            <button
              className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <IconShield size={14} />
              <span>Overview &amp; Posture</span>
            </button>

            <button
              className={`tab-btn ${activeTab === "findings" ? "active" : ""}`}
              onClick={() => setActiveTab("findings")}
            >
              <IconTerminal size={14} />
              <span>Cryptographic Findings</span>
              <span className="tab-badge">{totalFindings}</span>
            </button>

            <button
              className={`tab-btn ${activeTab === "timemachine" ? "active" : ""}`}
              onClick={() => setActiveTab("timemachine")}
            >
              <IconClock size={14} />
              <span>Quantum Time Machine</span>
            </button>

            <button
              className={`tab-btn ${activeTab === "migration" ? "active" : ""}`}
              onClick={() => setActiveTab("migration")}
            >
              <IconLayers size={14} />
              <span>Migration Roadmap</span>
            </button>

            <button
              className={`tab-btn ${activeTab === "quantumlab" ? "active" : ""}`}
              onClick={() => setActiveTab("quantumlab")}
            >
              <IconSparkles size={14} />
              <span>Quantum Simulation Lab</span>
            </button>

            <button
              className={`tab-btn ${activeTab === "about" ? "active" : ""}`}
              onClick={() => setActiveTab("about")}
            >
              <IconCpu size={14} />
              <span>Architecture &amp; Proofs</span>
            </button>
          </div>

          <main className="app-container">
            {/* Render Metrics Ribbon on Telemetry Tabs */}
            {(activeTab === "overview" || activeTab === "findings") && (
              <MetricCards
                scanSummary={scanSummary}
                onOpenConcept={(k) => setSelectedConcept(k)}
                teacherMode={teacherMode}
              />
            )}

            {/* Console Tab 1: Overview & Posture */}
            {activeTab === "overview" && (
              <OverviewTab
                scanSummary={scanSummary}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenConcept={(k) => setSelectedConcept(k)}
                teacherMode={teacherMode}
                onToggleTeacherMode={() => setTeacherMode(!teacherMode)}
              />
            )}

            {/* Console Tab 2: Findings Inventory */}
            {activeTab === "findings" && (
              <FindingsTab
                findings={scanSummary.findings || []}
                onSelectFinding={(f) => setSelectedFinding(f)}
                onUpdateStatus={handleUpdateStatus}
                onOpenConcept={(k) => setSelectedConcept(k)}
              />
            )}

            {/* Console Tab 3: Quantum Time Machine */}
            {activeTab === "timemachine" && (
              <TimeMachineTab
                findings={scanSummary.findings || []}
                currentScenarioYear={scanSummary.scenario_year || 2035}
                onOpenConcept={(k) => setSelectedConcept(k)}
              />
            )}

            {/* Console Tab 4: Migration Roadmap */}
            {activeTab === "migration" && (
              <MigrationPlannerTab
                findings={scanSummary.findings || []}
                onUpdateStatus={handleUpdateStatus}
                onSelectFinding={(f) => setSelectedFinding(f)}
                onOpenConcept={(k) => setSelectedConcept(k)}
              />
            )}

            {/* Console Tab 5: Quantum Simulation Lab */}
            {activeTab === "quantumlab" && (
              <QuantumLabTab
                onOpenConcept={(k) => setSelectedConcept(k)}
              />
            )}

            {/* Console Tab 6: Architecture & Proofs */}
            {activeTab === "about" && (
              <AboutSection
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenTour={() => setShowTour(true)}
              />
            )}
          </main>

          <Footer
            onNavigateTab={(tab) => {
              if (tab === "home") {
                handleReturnToWebsite();
              } else {
                setActiveTab(tab);
              }
            }}
            onOpenTour={() => setShowTour(true)}
            onOpenScanModal={() => setShowScanModal(true)}
            onOpenExportModal={() => setShowExportModal(true)}
          />
        </>
      )}

      {/* Global Modals & Drawers */}
      <FindingDrawer
        finding={selectedFinding}
        onClose={() => setSelectedFinding(null)}
        onUpdateStatus={handleUpdateStatus}
        onOpenConcept={(k) => setSelectedConcept(k)}
      />

      {showExportModal && (
        <ExportModal
          scanSummary={scanSummary}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {showScanModal && (
        <ScanModal
          onClose={() => setShowScanModal(false)}
          onScan={handleRunScan}
        />
      )}

      <GuidedTourModal
        isOpen={showTour}
        onClose={() => setShowTour(false)}
        onNavigateTab={(tab) => {
          setViewMode("console");
          setActiveTab(tab);
        }}
      />

      <ConceptModal
        conceptKey={selectedConcept}
        onClose={() => setSelectedConcept(null)}
      />
    </div>
  );
}
