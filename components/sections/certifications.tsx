import { certifications } from "@/data/certifications";

export function Certifications() {
  return (
    <section id="certifications" className="py-16 border-t border-border">
      <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">{"// certifications"}</h2>
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {certifications.map((c) => (
          <a key={c.name} href={c.verifyUrl} target="_blank" rel="noreferrer"
             className="border border-border bg-surface p-5 rounded flex items-center gap-4 hover:border-accent transition-colors">
            <div>
              <div className="font-semibold">{c.name}</div>
              <div className="text-sm text-text-muted">{c.issuer}</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
