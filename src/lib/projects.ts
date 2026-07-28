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
    description: "A terminal-first note-taking tool with fuzzy search.",
    tags: ["rust", "sqlite"],
    year: "2026",
    href: "https://github.com/iskvane/cli-notes",
  },
  {
    title: "git-user",
    description: "A small Rust CLI for managing multiple Git commit identities.",
    tags: ["rust", "serde"],
    year: "2026",
    href: "#",
  },
  {
    title: "bun-fuzz",
    description: "Collaborative band-jam app. Built with Bun and Rust as DSP-Backend.",
    tags: ["typescript", "rust", "bun"],
    year: "2026",
    href: "https://github.com/iskvane/bun-fuzz",
  },
];
