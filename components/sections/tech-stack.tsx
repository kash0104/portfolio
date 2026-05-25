import { skillGroups } from "@/data/skills";
import { TechBadge } from "@/components/ui/tech-badge";

export function TechStack() {
  return (
    <section id="stack" className="py-16 border-t border-border">
      <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">{"// stack"}</h2>
      <div className="mt-6 grid md:grid-cols-2 gap-x-10 gap-y-6">
        {skillGroups.map((g) => (
          <div key={g.title}>
            <h3 className="text-sm font-semibold mb-2">{g.title}</h3>
            <div className="flex flex-wrap gap-1.5">
              {g.items.map((i) => <TechBadge key={i} label={i} />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
