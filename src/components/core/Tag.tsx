import React from "react";

export interface TagProps {
  tone?: "neutral" | "accent" | "success" | "warning" | "error";
  children?: React.ReactNode;
}

const tones: Record<NonNullable<TagProps["tone"]>, { color: string; border: string; bg: string }> = {
  neutral: { color: "var(--fg-secondary)", border: "var(--border-strong)", bg: "var(--bg-2)" },
  accent: { color: "var(--accent-400)", border: "var(--accent-600)", bg: "rgba(53,212,136,.08)" },
  success: { color: "var(--success)", border: "var(--success)", bg: "rgba(53,212,136,.08)" },
  warning: { color: "var(--warning)", border: "var(--warning)", bg: "rgba(230,180,80,.1)" },
  error: { color: "var(--error)", border: "var(--error)", bg: "rgba(239,83,80,.1)" },
};

/** Small monospace tag/badge for tech stacks, post categories, or status. tone: neutral | accent | success | warning | error */
export function Tag({ tone = "neutral", children }: TagProps) {
  const t = tones[tone] ?? tones.neutral;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily: "var(--font-mono)",
        fontSize: ".6875rem",
        fontWeight: 500,
        letterSpacing: "var(--tracking-wide)",
        textTransform: "lowercase",
        padding: "3px 8px",
        borderRadius: "var(--radius-sm)",
        color: t.color,
        background: t.bg,
        border: `1px solid ${t.border}`,
      }}
    >
      {children}
    </span>
  );
}
