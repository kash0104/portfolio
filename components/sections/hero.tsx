import { TerminalPrompt } from "@/components/ui/terminal-prompt";
import { site } from "@/data/site";

export function Hero() {
  return (
    <section className="pt-20 pb-16">
      <p className="font-mono text-xs text-text-dim"><TerminalPrompt>whoami</TerminalPrompt></p>
      <h1 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight">{site.name}</h1>
      <p className="mt-3 font-mono text-accent text-sm md:text-base">{`// ${site.role.toLowerCase()}`}</p>
      <p className="mt-6 max-w-2xl text-text-muted md:text-lg">{site.description}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a href="#projects" className="font-mono text-sm px-4 py-2 bg-accent text-black rounded hover:opacity-90">./projects</a>
        <a href="#schedule" className="font-mono text-sm px-4 py-2 border border-border rounded text-text-muted hover:text-text hover:border-text-muted">./book-a-call</a>
      </div>
    </section>
  );
}
