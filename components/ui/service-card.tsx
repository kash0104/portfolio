import type { LucideIcon } from "lucide-react";

export function ServiceCard({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return (
    <div className="group border border-border bg-surface/60 backdrop-blur p-6 rounded-lg flex flex-col hover:border-accent/60 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/5 transition-all duration-200">
      <div className="w-10 h-10 rounded border border-border bg-bg flex items-center justify-center group-hover:border-accent transition-colors">
        <Icon className="text-accent" size={20} />
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-text-muted flex-1 leading-relaxed">{body}</p>
      <a
        href="#schedule"
        className="mt-5 font-mono text-xs text-accent hover:underline self-start"
      >
        ./book-a-call →
      </a>
    </div>
  );
}
