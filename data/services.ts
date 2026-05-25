import type { LucideIcon } from "lucide-react";
import { ClipboardCheck, Database, Cloud } from "lucide-react";

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
    icon: Cloud,
    title: "Cloud Data Migration",
    body: "Migrate from legacy ETL or warehouse to AWS + Snowflake (or Iceberg). Includes parallel-run validation and cutover plan.",
  },
];
