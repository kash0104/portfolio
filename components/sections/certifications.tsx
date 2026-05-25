import { certifications } from "@/data/certifications";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Award } from "lucide-react";

export function Certifications() {
  return (
    <section id="certifications" className="py-20">
      <SectionHeading number="06" label="certifications" />
      <Reveal stagger>
        <div className="grid md:grid-cols-2 gap-4">
          {certifications.map((c) => (
            <a
              key={c.name}
              href={c.verifyUrl}
              target="_blank"
              rel="noreferrer"
              className="group border border-border bg-surface/60 backdrop-blur p-5 rounded-lg flex items-center gap-4 hover:border-accent/60 hover:-translate-y-0.5 transition-all"
            >
              <div className="w-10 h-10 rounded border border-border bg-bg flex items-center justify-center group-hover:border-accent transition-colors shrink-0">
                <Award className="text-accent" size={20} />
              </div>
              <div>
                <div className="font-semibold group-hover:text-accent transition-colors">{c.name}</div>
                <div className="text-sm text-text-muted mt-0.5">{c.issuer}</div>
              </div>
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
