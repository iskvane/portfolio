import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CodeBlock } from "@/components/content/CodeBlock";
import { Tag } from "@/components/core/Tag";
import { getPost, posts } from "@/lib/posts";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return { title: post ? `${post.title} — ivane.dev` : "ivane.dev" };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "70px 24px 80px", width: "100%" }}>
      <Link href="/blog" style={{ font: "var(--text-code)", fontSize: ".8125rem", color: "var(--fg-muted)" }}>
        &larr; cd ../posts
      </Link>
      <h1 style={{ font: "var(--text-h1)", color: "var(--fg-primary)", margin: "18px 0 10px" }}>{post.title}</h1>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "34px", flexWrap: "wrap" }}>
        <span style={{ font: "var(--text-small)", color: "var(--fg-muted)" }}>{post.date}</span>
        {post.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
      {post.body.map((paragraph, i) => (
        <p
          key={i}
          style={{
            font: i === 0 ? "var(--text-body-lg)" : "var(--text-body)",
            color: "var(--fg-secondary)",
            margin: "0 0 22px",
          }}
        >
          {paragraph}
        </p>
      ))}
      {post.code && <CodeBlock filename={post.code.filename} lang={post.code.lang} code={post.code.code} />}
      {post.outro && (
        <p style={{ font: "var(--text-body)", color: "var(--fg-secondary)", margin: "26px 0 0" }}>{post.outro}</p>
      )}
    </div>
  );
}
