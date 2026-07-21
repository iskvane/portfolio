export interface CodeBlockProps {
  filename?: string;
  code: string;
  lang?: string;
}

// Single combined pattern (comment | string | keyword), matched in one pass over
// the already-escaped line. Chaining separate global .replace() calls instead
// (comments, then strings, then keywords) would re-scan each pass's own output —
// and since the injected spans use inline `style="color:var(--warning)"`, the
// keyword pass would then match the literal word "var" inside that attribute
// and corrupt the markup. One pass avoids that self-collision entirely.
const TOKEN = new RegExp(
  [
    "(\\/\\/.*$)", // comment
    "('[^']*'|\"[^\"]*\")", // string
    "\\b(const|let|var|function|return|import|export|from|default|if|else|for|while|async|await|new|class|extends|this|null|true|false|typeof|of|in)\\b", // keyword
  ].join("|"),
  "gm"
);

function highlight(line: string) {
  const escaped = line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return escaped.replace(TOKEN, (match, comment, string, keyword) => {
    if (comment) return `<span style="color:var(--fg-muted)">${comment}</span>`;
    if (string) return `<span style="color:var(--warning)">${string}</span>`;
    if (keyword) return `<span style="color:var(--accent-400)">${keyword}</span>`;
    return match;
  });
}

/** Terminal-look code block with filename tab and line numbers. code: string (newline-separated). */
export function CodeBlock({ filename = "index.ts", code = "", lang = "ts" }: CodeBlockProps) {
  const lines = code.replace(/^\n/, "").split("\n");
  return (
    <div
      style={{
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border)",
        overflow: "hidden",
        background: "var(--bg-1)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "9px 14px",
          background: "var(--bg-2)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span style={{ font: "var(--text-code)", fontSize: ".75rem", color: "var(--fg-secondary)" }}>
          {filename}
        </span>
        <span
          style={{
            marginLeft: "auto",
            font: "var(--text-code)",
            fontSize: ".6875rem",
            color: "var(--fg-muted)",
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-wide)",
          }}
        >
          {lang}
        </span>
      </div>
      <pre style={{ margin: 0, padding: "14px 0", overflowX: "auto", font: "var(--text-code)" }}>
        {lines.map((line, i) => (
          <div key={i} style={{ display: "flex", padding: "0 14px" }}>
            <span style={{ color: "var(--fg-muted)", width: "2em", flexShrink: 0, userSelect: "none" }}>
              {i + 1}
            </span>
            <span
              style={{ color: "var(--fg-primary)", whiteSpace: "pre" }}
              dangerouslySetInnerHTML={{ __html: highlight(line) }}
            />
          </div>
        ))}
      </pre>
    </div>
  );
}
