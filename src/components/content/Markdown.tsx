import { Lexer, Parser, type Token } from "marked";
import { CodeBlock } from "./CodeBlock";

/**
 * Fence info strings carry both fields, e.g. ```tsx app/layout.tsx — marked
 * hands back the whole string as `lang`, so the first word is the language and
 * whatever follows is the filename shown in the CodeBlock tab.
 */
function parseInfoString(info: string | undefined) {
  const [lang, ...rest] = (info ?? "").trim().split(/\s+/);
  return { lang: lang || undefined, filename: rest.join(" ") || undefined };
}

/**
 * Renders markdown as React, splitting the token stream so fenced code goes
 * through <CodeBlock> (keeping the terminal chrome and highlighting) while runs
 * of prose are parsed to HTML in one pass. The wrappers use `display: contents`
 * so the generated elements are laid out as direct children of `.post-body`.
 */
export function Markdown({ markdown }: { markdown: string }) {
  const tokens = Lexer.lex(markdown);
  const blocks: React.ReactNode[] = [];
  let prose: Token[] = [];

  const flushProse = () => {
    if (prose.length === 0) return;
    // The lead paragraph of the post gets the larger body size.
    const isLead = blocks.length === 0;
    blocks.push(
      <div
        key={`prose-${blocks.length}`}
        className={isLead ? "lead" : undefined}
        style={{ display: "contents" }}
        dangerouslySetInnerHTML={{ __html: Parser.parse(prose) }}
      />
    );
    prose = [];
  };

  for (const token of tokens) {
    if (token.type === "code") {
      flushProse();
      const { lang, filename } = parseInfoString(token.lang);
      blocks.push(
        <div key={`code-${blocks.length}`} style={{ margin: "0 0 26px" }}>
          <CodeBlock code={token.text} lang={lang} filename={filename} />
        </div>
      );
    } else {
      prose.push(token);
    }
  }
  flushProse();

  return <div className="post-body">{blocks}</div>;
}
