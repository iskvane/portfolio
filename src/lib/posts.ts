import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  /** Raw markdown body with frontmatter stripped; rendered by <Markdown>. */
  body: string;
}

const CONTENT_DIR = path.join(process.cwd(), "src/lib/content");

/**
 * YAML auto-types an unquoted `2026-06-02` into a Date, which React refuses to
 * render as a child. Normalize back to the plain `YYYY-MM-DD` the UI expects,
 * so frontmatter authors don't have to remember to quote the field.
 */
function toDateString(value: unknown, slug: string): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string") return value;
  throw new Error(`${slug}.md: frontmatter "date" must be a date or string`);
}

function requireString(value: unknown, field: string, slug: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${slug}.md: frontmatter "${field}" is required`);
  }
  return value;
}

function readPost(filename: string): Post {
  const slug = filename.replace(/\.md$/, "");
  const { data, content } = matter(fs.readFileSync(path.join(CONTENT_DIR, filename), "utf8"));

  return {
    slug,
    title: requireString(data.title, "title", slug),
    date: toDateString(data.date, slug),
    excerpt: requireString(data.excerpt, "excerpt", slug),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    body: content.trim(),
  };
}

// Read once per build. Every page that lists or renders a post calls through
// here, and the files cannot change between calls during `next build`.
let cache: Post[] | undefined;

/** All posts, newest first. */
export function getPosts(): Post[] {
  cache ??= fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(readPost)
    .sort((a, b) => b.date.localeCompare(a.date));
  return cache;
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}
