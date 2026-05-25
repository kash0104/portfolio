import type { LucideIcon } from "lucide-react";
import { ClipboardCheck, Database, Cloud, ArrowRightLeft } from "lucide-react";

export const services: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: ClipboardCheck,
    title: "Data Pipeline Audit",
    body: "Review your existing pipelines, identify bottlenecks, deliver a prioritized optimization roadmap with cost-impact estimates.",
  },
  {
    icon: Database,
    title: "dbt + Snowflake Setup",
    body: "Greenfield dbt project on Snowflake with CI/CD, incremental models, tests, and documentation — ready for your team to extend.",
  },
  {
    icon: ArrowRightLeft,
    title: "Data Migration",
    body: "Move data between warehouses, clouds, or on-prem to AWS/Snowflake. Includes CDC bootstrap, parallel-run validation, and cutover plan.",
  },
  {
    icon: Cloud,
    title: "Cloud Data Architecture",
    body: "Design scalable AWS + Snowflake (or Iceberg) data platforms — ingestion, orchestration, observability, and cost controls baked in.",
  },
];
