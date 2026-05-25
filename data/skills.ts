export const skillGroups = [
  {
    title: "Cloud & Data Services",
    items: [
      "AWS Glue",
      "Redshift",
      "S3",
      "Lambda",
      "Athena",
      "Step Functions",
      "Kinesis",
      "Clean Rooms",
    ],
  },
  { title: "Languages", items: ["SQL", "Python"] },
  { title: "Data Warehouse", items: ["Snowflake", "Redshift"] },
  { title: "Data Processing", items: ["dbt", "PySpark", "Apache NiFi"] },
  { title: "Databases", items: ["PostgreSQL", "MySQL", "MS SQL Server"] },
  {
    title: "Optimization",
    items: ["Query tuning", "Indexing", "Sort/Dist Key design"],
  },
] as const;
