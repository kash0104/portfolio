export const experience = [
  {
    role: "Senior Data Engineer",
    company: "Simform Solutions",
    period: "Present",
    bullets: [
      "Architected a CDC ingestion platform serving 1000+ client databases on Iceberg.",
      "Reduced Glue job executions ~60% by switching to event-driven CDC.",
      "Led Snowflake → Iceberg migration, cutting storage costs ~30%.",
      "Mentored junior data engineers and conducted technical interviews.",
    ],
  },
] as const;
