import Link from "next/link";

const links = [
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 bg-bg/70 backdrop-blur-md border-b border-border/60">
      <nav className="max-w-[1100px] mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
        <Link href="/" className="font-mono text-sm hover:text-accent transition-colors">
          <span className="text-accent">$</span> kashyap.vadhel
        </Link>
        <div className="hidden md:flex gap-7 text-sm text-text-muted">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-text transition-colors">
              {l.label}
            </a>
          ))}
        </div>
        <a
          href="#schedule"
          className="font-mono text-xs px-3.5 py-1.5 bg-accent text-black rounded hover:opacity-90 hover:-translate-y-0.5 transition-all"
        >
          Book a call
        </a>
      </nav>
    </header>
  );
}
