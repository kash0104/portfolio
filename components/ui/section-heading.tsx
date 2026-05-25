export function SectionHeading({
  number,
  label,
  title,
  subtitle,
}: {
  number: string;
  label: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-accent">{number}.</span>
        <span className="font-mono text-xs uppercase tracking-widest text-text-dim">{label}</span>
        <div className="flex-1 h-px bg-border" />
      </div>
      {title && <h2 className="mt-4 text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>}
      {subtitle && <p className="mt-2 text-text-muted max-w-2xl">{subtitle}</p>}
    </div>
  );
}
