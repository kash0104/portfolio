import { experience } from "@/data/experience";
import { TimelineItem } from "@/components/ui/timeline-item";
import { SectionHeading } from "@/components/ui/section-heading";

export function Experience() {
  return (
    <section id="experience" className="py-20">
      <SectionHeading label="experience" />
      <ul className="max-w-3xl">
        {experience.map((e) => <TimelineItem key={e.role + e.period} {...e} />)}
      </ul>
    </section>
  );
}
