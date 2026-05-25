export function TechBadge({ label }: { label: string }) {
  return (
    <span className="font-mono text-xs px-2.5 py-1 border border-border bg-surface text-text-muted rounded">
      {label}
    </span>
  );
}
