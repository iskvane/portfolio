import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a fully static site into `out/` for GitHub Pages, which serves plain
  // HTML/CSS/JS with no Node.js runtime.
  output: "export",
  // Emit `blog/<slug>/index.html` rather than `blog/<slug>.html` so Pages
  // resolves nested routes without extension rewrites.
  trailingSlash: true,
  // The default image loader needs a server; there is no `next/image` usage
  // today, but this keeps a future <Image> from breaking the export.
  images: { unoptimized: true },
};

export default nextConfig;
