import { Button } from "@/components/core/Button";
import { Tag } from "@/components/core/Tag";
import { TerminalPrompt } from "@/components/core/TerminalPrompt";

const STACK = ["typescript", "react", "rust", "postgres", "linux"];

export default function Home() {
  return (
    <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "90px 24px 60px", width: "100%" }}>
      <div
        style={{
          marginBottom: "18px",
          font: "var(--text-h6)",
          color: "var(--fg-muted)",
          textTransform: "uppercase",
          letterSpacing: "var(--tracking-widest)",
        }}
      >
        iskander · software engineer
      </div>
      <TerminalPrompt text="cat about.md" typing size="lg" style={{ marginBottom: "22px" }} />
      <h1 style={{ font: "var(--text-h1)", color: "var(--fg-primary)", margin: "0 0 18px" }}>
        Building small, sharp tools
        <br />
        for the web.
      </h1>
      <p style={{ font: "var(--text-body-lg)", color: "var(--fg-secondary)", maxWidth: "560px", margin: "0 0 30px" }}>
        I write about frontend engineering, developer tooling, and the occasional terminal
        rabbit hole. Based in Berlin, shipping in public.
      </p>
      <div style={{ display: "flex", gap: "12px", marginBottom: "70px", flexWrap: "wrap" }}>
        <Button variant="primary" href="/blog">
          read the blog
        </Button>
        <Button variant="secondary" href="/projects">
          view projects
        </Button>
      </div>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {STACK.map((t) => (
          <Tag key={t} tone="accent">
            {t}
          </Tag>
        ))}
      </div>
    </div>
  );
}
