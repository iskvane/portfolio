import React from "react";

export interface TerminalPromptProps {
  text?: string;
  /** Prompt glyph, defaults to "$". */
  prompt?: string;
  /** Plays a one-shot typing reveal on mount. */
  typing?: boolean;
  size?: "sm" | "md" | "lg";
  style?: React.CSSProperties;
}

/** Signature terminal-prompt element: "$ " prefix + text + blinking block caret. If `typing` is true, text reveals via CSS width animation once on mount. */
export function TerminalPrompt({
  text = "",
  prompt = "$",
  typing = false,
  size = "md",
  style,
}: TerminalPromptProps) {
  const fontSize = size === "lg" ? "1.25rem" : size === "sm" ? ".8125rem" : "1rem";
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: ".6em",
        fontFamily: "var(--font-mono)",
        fontSize,
        color: "var(--fg-primary)",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <span style={{ color: "var(--accent-400)" }}>{prompt}</span>
      <span
        style={
          typing
            ? {
                display: "inline-block",
                overflow: "hidden",
                whiteSpace: "nowrap",
                animation: `typing 1.1s steps(${Math.max(text.length, 1)}) 1`,
              }
            : undefined
        }
      >
        {text}
      </span>
      <span
        style={{
          display: "inline-block",
          width: ".55em",
          height: "1.1em",
          background: "var(--accent-400)",
          animation: "caret-blink 1s step-end infinite",
          transform: "translateY(.1em)",
        }}
      />
    </div>
  );
}
