export function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="group border border-border bg-surface/50 backdrop-blur px-5 py-5 rounded-lg hover:border-accent/60 hover:-translate-y-0.5 hover:bg-surface transition-all duration-200">
      <div className="font-mono text-3xl md:text-4xl text-accent-2 font-semibold tracking-tight">{value}</div>
      <div className="text-xs uppercase tracking-wider text-text-dim mt-2">{label}</div>
    </div>
  );
}
