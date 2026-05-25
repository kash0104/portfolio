import { TerminalPrompt } from "@/components/ui/terminal-prompt";
import { site } from "@/data/site";

export function Hero() {
  return (
    <section className="relative pt-24 pb-20 overflow-hidden">
      {/* Animated gradient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -left-20 w-[28rem] h-[28rem] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-accent), transparent 60%)", animation: "var(--animate-blob)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-10 right-0 w-[24rem] h-[24rem] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-accent-2), transparent 60%)", animation: "var(--animate-blob)", animationDelay: "-9s" }}
      />

      <div className="relative">
        {/* Availability pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-border bg-surface/60 backdrop-blur rounded-full text-xs">
          <span
            className="inline-block w-2 h-2 rounded-full bg-accent"
            style={{ animation: "var(--animate-pulse-dot)" }}
            aria-hidden
          />
          <span className="text-text-muted font-mono">Available for work</span>
        </div>

        <p className="mt-6 font-mono text-xs text-text-dim"><TerminalPrompt>whoami</TerminalPrompt></p>
        <h1 className="mt-4 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] text-gradient">
          {site.name}
        </h1>
        <p className="mt-4 font-mono text-accent text-sm md:text-base">{`// ${site.role.toLowerCase()}`}</p>
        <p className="mt-6 max-w-2xl text-text-muted md:text-lg leading-relaxed">{site.description}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="font-mono text-sm px-5 py-3 bg-accent text-black rounded hover:opacity-90 hover:-translate-y-0.5 transition-all"
          >
            ./projects
          </a>
          <a
            href="#schedule"
            className="font-mono text-sm px-5 py-3 border border-border rounded text-text-muted hover:text-text hover:border-accent hover:-translate-y-0.5 transition-all"
          >
            ./book-a-call
          </a>
        </div>
      </div>
    </section>
  );
}
