# ivane.dev

Personal site and blog for Iskander — a terminal-flavoured, dark-mode-first portfolio built with
Next.js and exported as a fully static site to GitHub Pages.

Live at **[ivane.dev](https://ivane.dev)**.

## Stack

- **Next.js 16** (App Router) with `output: "export"` — no Node.js runtime in production
- **React 19**, **TypeScript**
- **Tailwind CSS 4** alongside a CSS custom-property design system in `src/app/globals.css`
- **gray-matter** + **marked** for the markdown blog pipeline
- **Bun** as package manager and CI runner

## Getting started

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
bun run build   # static export into out/
bun run start   # serve a production build
bun run lint    # eslint
```

## Project layout

```
src/
  app/
    page.tsx            # landing page
    blog/               # post index + [slug] detail route
    projects/           # project list
    globals.css         # design tokens (colors, type scale, spacing)
    layout.tsx          # fonts, theme bootstrap, header
  components/
    core/               # Button, Tag, TerminalPrompt
    content/            # Markdown, CodeBlock, ProjectCard
    navigation/         # Header
  lib/
    content/*.md        # blog posts
    posts.ts            # frontmatter parsing + post lookup
    projects.ts         # project list data
public/CNAME            # custom domain for GitHub Pages
```

## Writing a post

Drop a markdown file into `src/lib/content/`. The filename becomes the slug
(`why-terminals.md` → `/blog/why-terminals/`), and the frontmatter is required:

```markdown
---
title: Why I still live in the terminal
date: 2026-06-02
tags: [dev, opinion]
excerpt: A case for the command line as the calmest place to think.
---

Body starts here. The first paragraph is rendered as the lead.
```

Posts are read at build time and sorted newest-first; a missing `title`, `date`, or `excerpt`
fails the build rather than rendering a half-empty page.

Fenced code blocks render through `<CodeBlock>`, which shows terminal chrome. The info string
carries both a language and an optional filename tab:

````markdown
```tsx app/layout.tsx
export default function RootLayout() { /* ... */ }
```
````

## Theming

Dark is the default. `layout.tsx` inlines a small pre-paint script that reads the persisted
`theme` value from `localStorage` and stamps `data-theme` on `<html>`, so there is no flash of the
wrong theme. Both themes are defined as token overrides at the top of `globals.css` — components
reference tokens (`var(--fg-primary)`, `var(--accent-500)`) rather than hard-coded colors.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`: Bun installs from the frozen lockfile,
`next build` writes the static export to `out/`, and `actions/deploy-pages` publishes it. The
custom domain comes from `public/CNAME`.
