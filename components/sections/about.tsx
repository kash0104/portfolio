export function About() {
  return (
    <section id="about" className="py-16 border-t border-border">
      <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">{"// about"}</h2>
      <p className="mt-4 max-w-3xl text-text-muted leading-relaxed text-base md:text-lg">
        I design and build scalable data platforms — CDC pipelines, Iceberg lakes, dbt warehouses on Snowflake.
        I work with teams that need to ingest at scale, model their data well, and keep cloud spend honest.
        Available for senior data-engineering roles and selective freelance engagements.
      </p>
    </section>
  );
}
