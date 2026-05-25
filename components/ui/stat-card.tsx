export function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="border border-border bg-surface px-5 py-4 rounded">
      <div className="font-mono text-3xl text-accent-2 font-semibold">{value}</div>
      <div className="text-xs uppercase tracking-wider text-text-dim mt-1">{label}</div>
    </div>
  );
}
