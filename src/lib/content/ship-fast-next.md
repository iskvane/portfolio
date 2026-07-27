---
title: Shipping a Next.js blog in a weekend
date: 2026-04-18
tags: [next.js, howto]
excerpt: The exact stack and shortcuts I used for ivane.dev.
---

The stack: Next.js App Router, plain markdown files for posts, Tailwind for utility styling, and this design system's tokens layered on top for the terminal feel. The whole thing builds to static HTML and lives on GitHub Pages, so hosting costs nothing and there's no server to keep alive.

Two days, most of which went into the design tokens rather than the plumbing. Here's the plumbing, since that's the part that's reusable.

## Posts are files, not a CMS

Every post is a markdown file in `src/lib/content/` with YAML frontmatter. There's no database, no admin UI, and no build step to sync anything. Publishing is `git push`.

```ts src/lib/posts.ts
const CONTENT_DIR = path.join(process.cwd(), "src/lib/content");

function readPost(filename: string): Post {
  const slug = filename.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: requireString(data.title, "title", slug),
    date: toDateString(data.date, slug),
    excerpt: requireString(data.excerpt, "excerpt", slug),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    body: content.trim(),
  };
}
```

Two details in there that cost me time. First, those `requireString` calls: frontmatter is untyped, and a post missing a `title` should fail the build loudly rather than render an empty heading. Second, YAML auto-types an unquoted `2026-04-18` into a `Date` object, which React refuses to render as a child — so dates get normalized back to a `YYYY-MM-DD` string on the way in, rather than making me remember to quote the field every time.

The whole list gets read once and memoized in a module-level variable. Files can't change between calls during `next build`, so there's no cache invalidation problem to solve.

## Markdown, not MDX

I started with MDX and backed out within an hour. MDX is the right tool if posts need to embed live components; mine need paragraphs, lists, and code blocks. What I actually wanted was control over how fenced code renders — the terminal chrome with a filename tab and line numbers — and that turned out to be easier without a compiler in the way.

So the renderer walks the token stream from `marked` and splits it: fenced code goes through a React `<CodeBlock>`, runs of prose get parsed to HTML in one pass.

```tsx src/components/content/Markdown.tsx
for (const token of tokens) {
  if (token.type === "code") {
    flushProse();
    const { lang, filename } = parseInfoString(token.lang);
    blocks.push(<CodeBlock code={token.text} lang={lang} filename={filename} />);
  } else {
    prose.push(token);
  }
}
flushProse();
```

The info string carries both fields — ` ```ts src/lib/posts.ts ` — and `marked` hands the whole thing back as `lang`, so the first word is the language and the rest is the filename shown in the tab.

The prose wrappers use `display: contents` so the generated elements lay out as direct children of `.post-body`. Without that, every run of paragraphs between two code blocks becomes a `div` that breaks the margin rules.

## One client component

Everything renders on the server. The only interactive piece is the theme toggle, and the interesting part isn't the toggle — it's avoiding the flash of the wrong theme before it mounts.

```tsx src/app/layout.tsx
// Runs before first paint, so the persisted choice is applied
// without a flash of the wrong theme.
const THEME_INIT =
  "(function(){try{var t=localStorage.getItem('theme');" +
  "document.documentElement.setAttribute('data-theme'," +
  "t==='light'?'light':'dark');}catch(e){}})();";

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT}
        </Script>
        {children}
      </body>
    </html>
  );
}
```

A blocking inline script sets `data-theme` before first paint, the CSS keys everything off that attribute, and `suppressHydrationWarning` stops React from complaining that the server said `dark` and the DOM says `light`. No client-side font swap, no flash. That's the whole trick.

## Static export, and what you give up

The site is exported as static files, which is what makes GitHub Pages viable:

```ts next.config.ts
const nextConfig: NextConfig = {
  output: "export",
  // Emit blog/<slug>/index.html rather than blog/<slug>.html so Pages
  // resolves nested routes without extension rewrites.
  trailingSlash: true,
  // The default image loader needs a server.
  images: { unoptimized: true },
};
```

`output: "export"` is a real constraint, not a flag you set and forget. Off the table: Server Actions, route handlers that read the `Request`, cookies, redirects and headers from config, ISR, draft mode, and `next/image` with the default loader. Dynamic routes have to enumerate themselves at build time — for the post pages that's a four-line `generateStaticParams` over the same `getPosts()` the index uses.

For a blog, none of that stings. If I ever want a comment form or a newsletter signup, it'll be a third-party embed or a separate function somewhere else, and I'd rather have that boundary be explicit than accidentally rely on a server I'm not paying for.

## What I skipped

No RSS feed yet, no search, no tag pages, no reading-time estimate. Each of those is an afternoon, and none of them matter until there are more than a handful of posts. The one thing I'd add first is the feed, because it's the only item on that list that other people can notice is missing.
