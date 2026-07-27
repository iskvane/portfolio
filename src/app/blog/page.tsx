import type { Metadata } from "next";
import Link from "next/link";
import { Tag } from "@/components/core/Tag";
import { getPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "blog — ivane.dev",
};

export default function BlogPage() {
  const posts = getPosts();
  return (
    <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "70px 24px 60px", width: "100%" }}>
      <h1 style={{ font: "var(--text-h2)", color: "var(--fg-primary)", margin: "0 0 8px" }}>$ ls posts/</h1>
      <p style={{ font: "var(--text-body)", color: "var(--fg-secondary)", margin: "0 0 40px" }}>
        Notes on building things, mostly for the web.
      </p>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {posts.map((p, i) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            style={{
              display: "block",
              padding: "22px 0",
              textDecoration: "none",
              color: "inherit",
              borderTop: i === 0 ? "1px solid var(--border)" : "none",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "8px" }}>
              <h3 style={{ font: "var(--text-h4)", margin: 0, color: "var(--fg-primary)" }}>{p.title}</h3>
              <span style={{ font: "var(--text-small)", color: "var(--fg-muted)", whiteSpace: "nowrap" }}>
                {p.date}
              </span>
            </div>
            <p style={{ font: "var(--text-body)", fontSize: ".9375rem", color: "var(--fg-secondary)", margin: "0 0 10px" }}>
              {p.excerpt}
            </p>
            <div style={{ display: "flex", gap: "6px" }}>
              {p.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
