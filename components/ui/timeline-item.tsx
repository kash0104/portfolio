export function TimelineItem({
  role,
  company,
  period,
  bullets,
}: {
  role: string;
  company?: string;
  period: string;
  bullets: readonly string[];
}) {
  return (
    <li className="relative pl-8 pb-10 last:pb-0">
      <span className="absolute left-0 top-2 w-3 h-3 rounded-full bg-accent ring-4 ring-accent/20" />
      <span className="absolute left-[5px] top-5 bottom-0 w-px bg-border" />
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold">
          {role}
          {company && (
            <>
              {" · "}
              <span className="text-text-muted font-normal">{company}</span>
            </>
          )}
        </h3>
        <span className="font-mono text-xs text-text-dim">{period}</span>
      </div>
      <ul className="mt-3 space-y-2 text-sm text-text-muted leading-relaxed">
        {bullets.map((b, i) => (
          <li key={i} className="pl-5 relative before:content-['→'] before:absolute before:left-0 before:text-accent">
            {b}
          </li>
        ))}
      </ul>
    </li>
  );
}
