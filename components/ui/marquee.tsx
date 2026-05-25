/**
 * Horizontally scrolling strip of tech badges.
 * Pure CSS animation — duplicate children twice and translate by -50% for a seamless loop.
 * Solid background hides the page grid behind the strip; edge fades hide the wrap-around.
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
  return (
    <div className="relative overflow-hidden border-y border-border bg-surface py-6 my-12">
      <div className="flex gap-12 marquee-track">
        {[...items, ...items].map((label, i) => (
          <span
            key={`${label}-${i}`}
            className="font-mono text-sm text-text whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span className="text-accent">▸</span>
            {label}
          </span>
        ))}
      </div>
      {/* Edge fades into the surface color so the loop point is hidden */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-24"
        style={{ background: "linear-gradient(to right, var(--color-surface), transparent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-24"
        style={{ background: "linear-gradient(to left, var(--color-surface), transparent)" }}
      />
    </div>
  );
}
