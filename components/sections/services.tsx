import { services } from "@/data/services";
import { ServiceCard } from "@/components/ui/service-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

export function Services() {
  return (
    <section id="services" className="py-20">
      <SectionHeading
        number="05"
        label="services"
        subtitle="Available for selective freelance engagements. Typical timelines 2–8 weeks."
      />
      <Reveal stagger>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s) => <ServiceCard key={s.title} {...s} />)}
        </div>
      </Reveal>
    </section>
  );
}
