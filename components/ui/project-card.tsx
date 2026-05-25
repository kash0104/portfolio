import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TechBadge } from "./tech-badge";
import type { Project } from "@/lib/mdx";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative block border border-border bg-surface/60 backdrop-blur p-6 rounded-lg hover:border-accent/60 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/5 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">{project.title}</h3>
          <p className="text-text-muted mt-2 text-sm leading-relaxed">{project.summary}</p>
        </div>
        <ArrowUpRight
          className="text-text-dim group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
          size={18}
        />
      </div>
      <div className="grid grid-cols-3 gap-3 mt-6">
        {project.metrics.slice(0, 3).map((m) => (
          <div key={m.label}>
            <div className="font-mono text-accent-2 font-semibold">{m.value}</div>
            <div className="text-[10px] uppercase tracking-wider text-text-dim mt-0.5">{m.label}</div>
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
