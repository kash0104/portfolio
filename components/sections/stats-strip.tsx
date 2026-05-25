import { stats } from "@/data/stats";
import { StatCard } from "@/components/ui/stat-card";

export function StatsStrip() {
  return (
    <section className="py-8 grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => <StatCard key={s.label} value={s.value} label={s.label} />)}
    </section>
  );
}
