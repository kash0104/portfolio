"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TechBadge } from "./tech-badge";
import type { Project } from "@/lib/mdx";

/** Max tilt angle in degrees — kept subtle so it reads as life, not as a gimmick. */
const MAX_TILT = 6;

export function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLAnchorElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = (x - rect.width / 2) / (rect.width / 2);  // -1..1
    const dy = (y - rect.height / 2) / (rect.height / 2); // -1..1
    el.style.setProperty("--tilt-x", `${-dy * MAX_TILT}deg`);
    el.style.setProperty("--tilt-y", `${dx * MAX_TILT}deg`);
    el.style.setProperty("--glow-x", `${x}px`);
    el.style.setProperty("--glow-y", `${y}px`);
  }

  function handleMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <Link
      ref={ref}
      href={`/projects/${project.slug}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="tilt-card group relative block border border-border bg-surface/60 backdrop-blur p-6 rounded-lg hover:border-accent/60 transition-colors"
    >
      {/* Mouse-following glow */}
      <div className="tilt-glow" aria-hidden />

      <div className="relative">
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
      </div>
    </Link>
  );
}
