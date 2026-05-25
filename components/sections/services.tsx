import { services } from "@/data/services";
import { ServiceCard } from "@/components/ui/service-card";

export function Services() {
  return (
    <section id="services" className="py-16 border-t border-border">
      <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">{"// services"}</h2>
      <p className="mt-2 text-text-muted max-w-2xl">Available for selective freelance engagements. Typical timelines 2–8 weeks.</p>
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        {services.map((s) => <ServiceCard key={s.title} {...s} />)}
      </div>
    </section>
  );
}
