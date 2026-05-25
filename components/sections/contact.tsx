"use client";
import { useState } from "react";
import { site } from "@/data/site";
import { Mail, Link as LinkIcon, Code2, Briefcase } from "lucide-react";

export function Contact() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/contact", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
    });
    setState(res.ok ? "sent" : "error");
  }

  return (
    <section id="contact" className="py-16 border-t border-border">
      <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">{"// contact"}</h2>
      <div className="mt-6 grid md:grid-cols-2 gap-8">
        <div>
          <div className="space-y-3 text-sm">
            <a href={`mailto:${site.email}`} className="flex items-center gap-3 text-text-muted hover:text-text"><Mail size={16}/> {site.email}</a>
            <a href={site.socials.linkedin} className="flex items-center gap-3 text-text-muted hover:text-text"><LinkIcon size={16}/> LinkedIn</a>
            <a href={site.socials.github} className="flex items-center gap-3 text-text-muted hover:text-text"><Code2 size={16}/> GitHub</a>
            <a href={site.socials.upwork} className="flex items-center gap-3 text-text-muted hover:text-text"><Briefcase size={16}/> Upwork</a>
          </div>
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          <input required name="name" placeholder="Your name" className="w-full bg-surface border border-border rounded px-3 py-2 text-sm" />
          <input required type="email" name="email" placeholder="Email" className="w-full bg-surface border border-border rounded px-3 py-2 text-sm" />
          <textarea required name="message" placeholder="Tell me about your project" rows={4} className="w-full bg-surface border border-border rounded px-3 py-2 text-sm" />
          <button disabled={state === "sending"} className="font-mono text-sm px-4 py-2 bg-accent text-black rounded disabled:opacity-50">
            {state === "sending" ? "Sending…" : state === "sent" ? "Sent ✓" : "Send"}
          </button>
          {state === "error" && <p className="text-danger text-sm">Something went wrong. Try emailing directly.</p>}
        </form>
      </div>
    </section>
  );
}
