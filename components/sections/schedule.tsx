import { site } from "@/data/site";
import { Calendar } from "lucide-react";

export function Schedule() {
  return (
    <section id="schedule" className="py-16 border-t border-border">
      <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">{"// schedule"}</h2>
      <p className="mt-2 text-text-muted">30-min intro call — talk through your project scope.</p>
      <div className="mt-6">
        <a
          href={`https://cal.com/${site.cal.username}`}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2 font-mono text-sm px-5 py-3 bg-accent text-black rounded hover:opacity-90"
        >
          <Calendar size={16} />
          Book a 30-min call →
        </a>
      </div>
    </section>
  );
}
