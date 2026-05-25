import { site } from "@/data/site";
import { Calendar } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

export function Schedule() {
  return (
    <section id="schedule" className="py-20">
      <SectionHeading
        label="schedule"
        subtitle="30-min intro call — talk through your project scope."
      />
      <a
        href={`https://cal.com/${site.cal.username}`}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex items-center gap-2 font-mono text-sm px-5 py-3 bg-accent text-black rounded hover:opacity-90 hover:-translate-y-0.5 transition-all"
      >
        <Calendar size={16} />
        Book a 30-min call →
      </a>
    </section>
  );
}
