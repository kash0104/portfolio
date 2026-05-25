import { experience } from "@/data/experience";
import { TimelineItem } from "@/components/ui/timeline-item";

export function Experience() {
  return (
    <section id="experience" className="py-16 border-t border-border">
      <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">{"// experience"}</h2>
      <ul className="mt-8 max-w-3xl">
        {experience.map((e) => <TimelineItem key={e.role + e.company} {...e} />)}
      </ul>
    </section>
  );
}
