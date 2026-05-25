import type { LucideIcon } from "lucide-react";

export function ServiceCard({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return (
    <div className="border border-border bg-surface p-6 rounded flex flex-col">
      <Icon className="text-accent" size={22} />
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-text-muted flex-1">{body}</p>
      <a
        href="#schedule"
        className="mt-5 font-mono text-xs text-accent hover:underline self-start"
      >
        ./book-a-call →
      </a>
    </div>
  );
}
