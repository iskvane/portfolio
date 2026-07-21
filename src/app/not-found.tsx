import { Button } from "@/components/core/Button";
import { TerminalPrompt } from "@/components/core/TerminalPrompt";

export default function NotFound() {
  return (
    <div
      style={{
        maxWidth: "var(--container-max)",
        margin: "0 auto",
        padding: "120px 24px",
        width: "100%",
        textAlign: "center",
      }}
    >
      <TerminalPrompt text="cat: 404: No such file or directory" style={{ justifyContent: "center", marginBottom: "22px" }} />
      <h1 style={{ font: "var(--text-h2)", color: "var(--fg-primary)", margin: "0 0 14px" }}>page not found</h1>
      <p style={{ font: "var(--text-body)", color: "var(--fg-secondary)", margin: "0 0 30px" }}>
        Whatever you were looking for isn&apos;t at this path.
      </p>
      <Button variant="secondary" href="/">
        cd ~
      </Button>
    </div>
  );
}
