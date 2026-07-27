import type { Project } from "@/components/content/ProjectCard";

export const projects: Project[] = [
  {
    title: "ivane.dev",
    description: "Personal site, blog & project log built with Next.js + this design system.",
    tags: ["next.js", "tailwind", "mdx"],
    year: "2026",
    href: "#",
  },
  {
    title: "cli-notes",
    description: "A terminal-first note-taking tool with fuzzy search and git sync.",
    tags: ["rust", "sqlite"],
    year: "2025",
    href: "https://github.com/iskvane/cli-notes",
  },
  {
    title: "git-user",
    description: "A small Rust CLI for managing multiple Git commit identities.",
    tags: ["rust", "serde"],
    year: "2025",
    href: "#",
  },
  {
    title: "termcast",
    description: "Record and share terminal sessions as lightweight embeddable clips.",
    tags: ["typescript", "wasm"],
    year: "2024",
    href: "#",
  },
];
