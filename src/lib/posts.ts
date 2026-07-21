export interface PostCode {
  filename: string;
  lang: string;
  code: string;
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  /** Body paragraphs, first-person and low-ceremony per the site's voice. */
  body: string[];
  code?: PostCode;
  outro?: string;
}

export const posts: Post[] = [
  {
    slug: "why-terminals",
    title: "Why I still live in the terminal",
    date: "2026-06-02",
    tags: ["dev", "opinion"],
    excerpt: "A case for the command line as the calmest place to think.",
    body: [
      "Most of my day happens inside a terminal window. Not because it's faster to type `git status` than to click a button — it usually isn't — but because nothing in it is trying to get my attention.",
      "Every GUI I've used eventually accretes notification badges, animated panels, and a sidebar that wants to be relevant. The terminal doesn't do any of that. It shows you exactly what you asked for and waits.",
      "That's the whole pitch, really: a tool that stays still until you tell it not to. Everything else — tmux, a decent shell prompt, fzf — is just making that stillness a little more convenient.",
    ],
  },
  {
    slug: "ship-fast-next",
    title: "Shipping a Next.js blog in a weekend",
    date: "2026-04-18",
    tags: ["next.js", "howto"],
    excerpt: "The exact stack and shortcuts I used for ivane.dev.",
    body: [
      "The stack: Next.js App Router, MDX for posts, Tailwind for utility styling, and this design system's tokens layered on top for the terminal feel.",
      "Everything renders server-side by default. The only client component is the theme toggle in the header — persisted to localStorage and mirrored to a data-theme attribute on the html tag.",
    ],
    code: {
      filename: "app/layout.tsx",
      lang: "tsx",
      code: 'export default function RootLayout({ children }) {\n  return (\n    <html data-theme="dark">\n      <body>{children}</body>\n    </html>\n  );\n}',
    },
    outro: "That's the whole trick. No client-side font swap, no flash of the wrong theme.",
  },
  {
    slug: "rust-for-web-devs",
    title: "Rust for web developers: a gentle start",
    date: "2026-02-11",
    tags: ["rust", "learning"],
    excerpt: "What clicked, what didn't, and where to begin.",
    body: [
      "I came to Rust from TypeScript, expecting the borrow checker to feel like an adversary. It mostly doesn't — it feels like a linter that's unusually honest about the bugs you were about to ship.",
      "What clicked first was `Option` and `Result` replacing null checks and try/catch. What didn't click for weeks was lifetimes — not the syntax, but when the compiler actually needs me to spell one out versus when it's inferring fine on its own.",
      "If you're starting from web dev, skip the whole-book approach. Write a small CLI tool, hit every error the compiler throws, and read its explanation each time. That's most of the curriculum right there.",
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
