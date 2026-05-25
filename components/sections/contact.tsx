"use client";
import { useState } from "react";
import { site } from "@/data/site";
import { Mail, Briefcase } from "lucide-react";
import { LinkedInIcon, GitHubIcon } from "@/components/ui/brand-icons";
import { SectionHeading } from "@/components/ui/section-heading";

export function Contact() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setState(res.ok ? "sent" : "error");
  }

  const socialLink = "flex items-center gap-3 text-text-muted hover:text-accent transition-colors";
  const inputClass = "w-full bg-surface/60 backdrop-blur border border-border rounded px-3 py-2.5 text-sm focus:border-accent focus:outline-none transition-colors";

  return (
    <section id="contact" className="py-20">
      <SectionHeading
        number="08"
        label="contact"
        title="Let's build something together."
        subtitle="Got a data platform to scale, or a pipeline that needs an audit? Drop a line."
      />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-3 text-sm">
          <a href={`mailto:${site.email}`} className={socialLink}>
            <Mail size={16} /> {site.email}
          </a>
          <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className={socialLink}>
            <LinkedInIcon size={16} /> LinkedIn
          </a>
          <a href={site.socials.github} target="_blank" rel="noreferrer" className={socialLink}>
            <GitHubIcon size={16} /> GitHub
          </a>
          <a href={site.socials.upwork} target="_blank" rel="noreferrer" className={socialLink}>
            <Briefcase size={16} /> Upwork
          </a>
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          <input required name="name" placeholder="Your name" className={inputClass} />
          <input required type="email" name="email" placeholder="Email" className={inputClass} />
          <textarea required name="message" placeholder="Tell me about your project" rows={4} className={inputClass} />
          <button
            disabled={state === "sending"}
            className="font-mono text-sm px-5 py-2.5 bg-accent text-black rounded hover:opacity-90 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {state === "sending" ? "Sending…" : state === "sent" ? "Sent ✓" : "Send"}
          </button>
          {state === "error" && <p className="text-danger text-sm">Something went wrong. Try emailing directly.</p>}
        </form>
      </div>
    </section>
  );
}
