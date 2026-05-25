import { skillGroups } from "@/data/skills";
import { TechBadge } from "@/components/ui/tech-badge";
import { SectionHeading } from "@/components/ui/section-heading";

export function TechStack() {
  return (
    <section id="stack" className="py-20">
      <SectionHeading number="02" label="stack" />
      <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
        {skillGroups.map((g) => (
          <div key={g.title}>
            <h3 className="text-sm font-semibold mb-3 text-text">{g.title}</h3>
            <div className="flex flex-wrap gap-1.5">
              {g.items.map((i) => <TechBadge key={i} label={i} />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
