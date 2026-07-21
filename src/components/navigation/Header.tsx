"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

export interface HeaderLink {
  label: string;
  href: string;
}

export interface HeaderProps {
  brand?: string;
  links?: HeaderLink[];
}

const DEFAULT_LINKS: HeaderLink[] = [
  { label: "home", href: "/" },
  { label: "blog", href: "/blog" },
  { label: "projects", href: "/projects" },
];

// The theme lives on the DOM (data-theme attribute) and localStorage, not in
// React state — a blocking script in the root layout sets it before paint.
// useSyncExternalStore lets the toggle button read/react to that external
// source without the cascading-render "setState in effect" anti-pattern.
type Theme = "dark" | "light";
const themeListeners = new Set<() => void>();

function getThemeSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function getServerThemeSnapshot(): Theme {
  return "dark";
}

function subscribeToTheme(callback: () => void) {
  themeListeners.add(callback);
  return () => themeListeners.delete(callback);
}

function setTheme(next: Theme) {
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch {
    /* localStorage unavailable (private mode, etc) — theme just won't persist */
  }
  themeListeners.forEach((notify) => notify());
}

/** Site header/nav: logo-as-prompt, primary links, theme toggle. The toggle is the
 * one piece of client interactivity on the site — it persists to localStorage and
 * mirrors the choice to a data-theme attribute on <html>. */
export function Header({ brand = "iskander@ivane:~$", links = DEFAULT_LINKS }: HeaderProps) {
  const pathname = usePathname();
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 28px",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-0)",
        fontFamily: "var(--font-mono)",
        flexWrap: "wrap",
        gap: "12px",
      }}
    >
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "var(--fg-primary)",
          fontSize: ".9375rem",
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        <span style={{ color: "var(--accent-400)" }}>{brand}</span>
      </Link>
      <nav style={{ display: "flex", alignItems: "center", gap: "26px" }}>
        {links.map((l) => {
          const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontSize: ".8125rem",
                letterSpacing: "var(--tracking-wide)",
                color: active ? "var(--accent-400)" : "var(--fg-secondary)",
                borderBottom: active ? "1px solid var(--accent-400)" : "1px solid transparent",
                paddingBottom: "2px",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--accent-400)";
                e.currentTarget.style.borderBottomColor = "var(--accent-400)";
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.color = "var(--fg-secondary)";
                  e.currentTarget.style.borderBottomColor = "transparent";
                }
              }}
            >
              {l.label}
            </Link>
          );
        })}
        <button
          onClick={toggleTheme}
          aria-label="toggle theme"
          style={{
            background: "transparent",
            border: "1px solid var(--border-strong)",
            color: "var(--fg-secondary)",
            borderRadius: "var(--radius-sm)",
            width: "30px",
            height: "30px",
            cursor: "pointer",
            fontFamily: "var(--font-mono)",
            fontSize: ".75rem",
          }}
        >
          {theme === "dark" ? "☾" : "☀"}
        </button>
      </nav>
    </header>
  );
}
