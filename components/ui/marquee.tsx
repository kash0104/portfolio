/**
 * Horizontally scrolling strip of tech badges.
 * Pure CSS animation — duplicate children twice and translate by -50% for a seamless loop.
 * Edge fade-out gradients hide the wrap-around point.
 */
const items = [
  "AWS",
  "Snowflake",
  "Apache Iceberg",
  "dbt",
  "Python",
  "SQL",
  "AWS Glue",
  "Lambda",
  "S3",
  "Step Functions",
  "Kinesis",
  "DynamoDB",
  "Athena",
  "Redshift",
  "PySpark",
  "Fivetran",
];

export function Marquee() {
  // Render twice — translateX(-50%) brings copy #2 into copy #1's place seamlessly.
  return (
    <div className="relative overflow-hidden border-y border-border/60 bg-surface/20 py-6 my-8">
      <div className="flex gap-12 marquee-track">
        {[...items, ...items].map((label, i) => (
          <span
            key={`${label}-${i}`}
            className="font-mono text-sm text-text-dim whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span className="text-accent">▸</span>
            {label}
          </span>
        ))}
      </div>
      {/* Edge fades */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-24"
        style={{ background: "linear-gradient(to right, var(--color-bg), transparent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-24"
        style={{ background: "linear-gradient(to left, var(--color-bg), transparent)" }}
      />
    </div>
  );
}
