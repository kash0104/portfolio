export function TerminalPrompt({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={"font-mono " + (className ?? "")}>
      <span className="text-accent">$</span> {children}
      <span className="ml-1 inline-block w-2 h-[1em] bg-accent align-middle animate-pulse" aria-hidden />
    </span>
  );
}
