import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-border/60 mt-24">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-10 text-sm text-text-dim flex flex-col md:flex-row gap-3 justify-between items-center">
        <span className="font-mono">
          <span className="text-accent">$</span> © {new Date().getFullYear()} {site.name}
        </span>
        <span>
          Built with Next.js ·{" "}
          <a className="hover:text-accent underline underline-offset-4 transition-colors" href={site.socials.githubRepo} target="_blank" rel="noreferrer">
            Open source
          </a>
        </span>
      </div>
    </footer>
  );
}
