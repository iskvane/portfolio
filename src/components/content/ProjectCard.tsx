"use client";

import { useState } from "react";
import { Tag } from "../core/Tag";

export interface Project {
  title: string;
  description: string;
  tags?: string[];
  href?: string;
  year?: string;
  status?: "shipped" | "wip" | "archived";
}

export interface ProjectCardProps {
  project: Project;
}

/** Portfolio/project card. */
export function ProjectCard({ project }: ProjectCardProps) {
  const [hover, setHover] = useState(false);
  const p = project || ({} as Project);
  return (
    <a
      href={p.href || "#"}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "block",
        padding: "20px",
        borderRadius: "var(--radius-md)",
        background: "var(--bg-1)",
        border: `1px solid ${hover ? "var(--accent-600)" : "var(--border)"}`,
        boxShadow: hover ? "var(--shadow-glow)" : "none",
        textDecoration: "none",
        color: "inherit",
        transition:
          "border-color var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-out)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
        <h3 style={{ font: "var(--text-h5)", margin: 0, color: "var(--fg-primary)" }}>{p.title}</h3>
        <span style={{ font: "var(--text-small)", color: "var(--fg-muted)" }}>{p.year}</span>
      </div>
      <p style={{ font: "var(--text-body)", fontSize: ".875rem", color: "var(--fg-secondary)", margin: "0 0 14px" }}>
        {p.description}
      </p>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
        {(p.tags || []).map((t) => (
          <Tag key={t} tone="neutral">
            {t}
          </Tag>
        ))}
        <span
          style={{
            marginLeft: "auto",
            font: "var(--text-code)",
            fontSize: ".75rem",
            color: hover ? "var(--accent-400)" : "var(--fg-muted)",
          }}
        >
          {hover ? "→ open" : "→"}
        </span>
      </div>
    </a>
  );
}
