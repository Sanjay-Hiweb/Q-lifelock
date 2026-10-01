"use client";

import React from "react";

interface ConceptTriggerProps {
  conceptKey: string;
  label?: string;
  onOpenConcept: (key: string) => void;
  variant?: "pill" | "icon";
}

export const ConceptTrigger: React.FC<ConceptTriggerProps> = ({
  conceptKey,
  label = "What is this?",
  onOpenConcept,
  variant = "pill",
}) => {
  if (variant === "icon") {
    return (
      <button
        type="button"
        className="concept-icon-btn"
        onClick={(e) => {
          e.stopPropagation();
          onOpenConcept(conceptKey);
        }}
        title="Click for a simple explanation"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          backgroundColor: "var(--surface-subtle)",
          border: "1px solid var(--border-strong)",
          color: "var(--text-secondary)",
          fontSize: "0.65rem",
          fontWeight: 700,
          cursor: "pointer",
          marginLeft: "0.35rem",
          verticalAlign: "middle",
        }}
      >
        ?
      </button>
    );
  }

  return (
    <button
      type="button"
      className="btn btn-outline btn-sm"
      onClick={(e) => {
        e.stopPropagation();
        onOpenConcept(conceptKey);
      }}
      style={{
        fontSize: "0.7rem",
        padding: "0.15rem 0.45rem",
        borderRadius: "var(--radius-full)",
        color: "var(--text-secondary)",
        borderColor: "var(--border-default)",
        backgroundColor: "var(--surface-subtle)",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
      }}
    >
      <span>💡</span> {label}
    </button>
  );
};
