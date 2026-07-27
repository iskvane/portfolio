import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/content/Markdown";
import { Tag } from "@/components/core/Tag";
import { getPost, getPosts } from "@/lib/posts";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
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
      <Markdown markdown={post.body} />
    </div>
  );
}
