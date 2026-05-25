export function TimelineItem({
  role, company, period, bullets,
}: { role: string; company: string; period: string; bullets: readonly string[] }) {
  return (
    <li className="relative pl-8 pb-10 last:pb-0">
      <span className="absolute left-0 top-2 w-3 h-3 rounded-full bg-accent" />
      <span className="absolute left-[5px] top-5 bottom-0 w-px bg-border" />
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold">{role} · <span className="text-text-muted font-normal">{company}</span></h3>
        <span className="font-mono text-xs text-text-dim">{period}</span>
      </div>
      <ul className="mt-2 space-y-1.5 text-sm text-text-muted">
        {bullets.map((b, i) => <li key={i} className="before:content-['→_'] before:text-accent">{b}</li>)}
      </ul>
    </li>
  );
}
