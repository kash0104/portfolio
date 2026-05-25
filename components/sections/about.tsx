import { SectionHeading } from "@/components/ui/section-heading";

export function About() {
  return (
    <section id="about" className="py-20">
      <SectionHeading label="about" />
      <p className="max-w-3xl text-text-muted leading-relaxed text-base md:text-lg">
        I design and build scalable data platforms — CDC pipelines, Iceberg lakes, dbt warehouses on Snowflake.
        I work with teams that need to ingest at scale, model their data well, and keep cloud spend honest.
        Available for senior data-engineering roles and selective freelance engagements.
      </p>
    </section>
  );
}
