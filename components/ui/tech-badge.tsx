export function TechBadge({ label }: { label: string }) {
  return (
    <span className="font-mono text-xs px-2.5 py-1 border border-border bg-surface/70 text-text-muted rounded hover:border-accent/40 hover:text-text transition-colors">
      {label}
    </span>
  );
}
