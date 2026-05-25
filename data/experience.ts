export const experience = [
  {
    role: "Senior Data Engineer",
    period: "2022 — Present",
    bullets: [
      "Architected an AWS DMS → S3 → SQS → Lambda → Glue → Apache Iceberg CDC platform ingesting from 1000+ client databases into a centralized lake.",
      "Cut AWS Glue executions ~60% by replacing table-level ingestion with event-driven, queue-buffered CDC — eliminating JDBC connection bottlenecks.",
      "Led Snowflake → Apache Iceberg migration on S3, decoupling storage from compute and reducing Snowflake storage spend ~30%.",
      "Built a recovery fabric using DynamoDB (job ledger) + EventBridge (re-drive) + Lambda for automatic Glue job reprocessing.",
      "Tuned AWS DMS streams for CPU efficiency on minimal instance sizes — 35% performance gain.",
      "Stood up Athena for ad-hoc analytics directly on Iceberg tables; integrated Step Functions for orchestration of multi-stage Glue pipelines.",
      "Designed a Fivetran + Snowflake + dbt ELT platform across Shopify, Amazon, Google Ads, Meta Ads and Google Sheets — 6+ sources, ~40% compute reduction via incremental models.",
      "Mentored junior data engineers on AWS data architecture, dbt patterns, and warehouse cost optimization.",
    ],
  },
] as const;
