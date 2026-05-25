import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-8 text-sm text-text-dim flex flex-col md:flex-row gap-2 justify-between">
        <span>© {new Date().getFullYear()} {site.name}.</span>
        <span>Built with Next.js · <a className="hover:text-text underline" href={site.socials.githubRepo}>Open source on GitHub</a></span>
      </div>
    </footer>
  );
}
