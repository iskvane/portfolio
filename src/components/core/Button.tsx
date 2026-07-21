"use client";

import Link from "next/link";
import React, { useState } from "react";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "prefix"> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  /** Text/glyph shown before the label, defaults to "$". Pass false to hide. */
  prefix?: string | false;
  /** If set, renders as a Next.js Link styled like a button instead of a <button>. */
  href?: string;
}

const base: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: ".875rem",
  fontWeight: 500,
  letterSpacing: "var(--tracking-wide)",
  borderRadius: "var(--radius-sm)",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  border: "1px solid transparent",
  transition:
    "background var(--dur-fast) var(--ease-out),border-color var(--dur-fast) var(--ease-out),box-shadow var(--dur-fast) var(--ease-out),color var(--dur-fast) var(--ease-out)",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, React.CSSProperties> = {
  sm: { padding: "6px 12px", fontSize: ".75rem" },
  md: { padding: "9px 16px", fontSize: ".875rem" },
  lg: { padding: "12px 20px", fontSize: ".9375rem" },
};

const variants: Record<NonNullable<ButtonProps["variant"]>, React.CSSProperties> = {
  primary: {
    background: "var(--accent-500)",
    color: "var(--bg-0)",
    borderColor: "var(--accent-500)",
  },
  secondary: {
    background: "transparent",
    color: "var(--fg-primary)",
    borderColor: "var(--border-strong)",
  },
  ghost: {
    background: "transparent",
    color: "var(--fg-secondary)",
    borderColor: "transparent",
  },
};

const hovers: Record<NonNullable<ButtonProps["variant"]>, React.CSSProperties> = {
  primary: { background: "var(--accent-400)", boxShadow: "var(--shadow-glow)" },
  secondary: { borderColor: "var(--accent-500)", color: "var(--accent-400)" },
  ghost: { color: "var(--accent-400)", background: "var(--bg-2)" },
};

/** Terminal-style button. variant: primary | secondary | ghost. Optional `$` prompt prefix via prefix prop. */
export function Button({
  variant = "primary",
  size = "md",
  prefix,
  disabled,
  children,
  style,
  href,
  ...props
}: ButtonProps) {
  const [hover, setHover] = useState(false);
  const v = variants[variant] ?? variants.primary;
  const h = hovers[variant] ?? {};

  const computedStyle: React.CSSProperties = {
    ...base,
    ...sizes[size],
    ...v,
    ...(hover && !disabled ? h : {}),
    opacity: disabled ? 0.45 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
    ...style,
  };

  const content = (
    <>
      {prefix !== false && <span style={{ opacity: 0.7 }}>{prefix || "$"}</span>}
      {children}
    </>
  );

  const hoverHandlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
  };

  if (href) {
    return (
      <Link href={href} style={computedStyle} {...hoverHandlers}>
        {content}
      </Link>
    );
  }

  return (
    <button {...props} disabled={disabled} style={computedStyle} {...hoverHandlers}>
      {content}
    </button>
  );
}
