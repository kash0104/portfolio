import { skillGroups } from "@/data/skills";
import { TechBadge } from "@/components/ui/tech-badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

export function TechStack() {
  return (
    <section id="stack" className="py-20">
      <SectionHeading label="stack" />
      <Reveal stagger>
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
      </Reveal>
    </section>
  );
}
