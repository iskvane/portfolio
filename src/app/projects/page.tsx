import type { Metadata } from "next";
import { ProjectCard } from "@/components/content/ProjectCard";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "projects — ivane.dev",
};

export default function ProjectsPage() {
  return (
    <div style={{ maxWidth: "var(--container-wide)", margin: "0 auto", padding: "70px 24px 80px", width: "100%" }}>
      <h1 style={{ font: "var(--text-h2)", color: "var(--fg-primary)", margin: "0 0 8px" }}>$ ls projects/</h1>
      <p style={{ font: "var(--text-body)", color: "var(--fg-secondary)", margin: "0 0 36px" }}>
        Things I&apos;ve built and kept running.
      </p>
      <div className="project-grid">
        {projects.map((p) => (
          <ProjectCard key={p.title} project={p} />
        ))}
      </div>
    </div>
  );
}
