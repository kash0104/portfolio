import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TechBadge } from "./tech-badge";
import type { Project } from "@/lib/mdx";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block border border-border bg-surface p-6 rounded hover:border-accent transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{project.title}</h3>
          <p className="text-text-muted mt-2 text-sm">{project.summary}</p>
        </div>
        <ArrowUpRight className="text-text-dim group-hover:text-accent transition-colors shrink-0" size={18} />
      </div>
      <div className="grid grid-cols-3 gap-3 mt-5">
        {project.metrics.slice(0, 3).map((m) => (
          <div key={m.label}>
            <div className="font-mono text-accent-2 font-semibold">{m.value}</div>
            <div className="text-[10px] uppercase tracking-wider text-text-dim">{m.label}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5 mt-5">
        {project.stack.slice(0, 6).map((s) => <TechBadge key={s} label={s} />)}
        {project.stack.length > 6 && <TechBadge label={`+${project.stack.length - 6}`} />}
      </div>
    </Link>
  );
}
