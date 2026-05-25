import { CalEmbed } from "@/components/ui/cal-embed";

export function Schedule() {
  return (
    <section id="schedule" className="py-16 border-t border-border">
      <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">{"// schedule"}</h2>
      <p className="mt-2 text-text-muted">30-min intro call — talk through your project scope.</p>
      <div className="mt-6"><CalEmbed /></div>
    </section>
  );
}
