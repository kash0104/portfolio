import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata = { title: "Uses" };

export default function Uses() {
  return (
    <>
      <Nav />
      <main className="max-w-[720px] mx-auto px-6 md:px-10 py-16">
        <h1 className="text-3xl md:text-5xl font-semibold">Uses</h1>
        <p className="mt-4 text-text-muted">Tools and services I use day-to-day as a data engineer.</p>
        <h2 className="mt-10 font-semibold">Cloud & data</h2>
        <ul className="mt-2 text-text-muted space-y-1 text-sm">
          <li>AWS — Glue, Lambda, S3, Step Functions, DMS, Kinesis</li>
          <li>Snowflake (warehouse) · Apache Iceberg (open table format on S3)</li>
          <li>dbt Core for transformations</li>
        </ul>
        <h2 className="mt-8 font-semibold">Local dev</h2>
        <ul className="mt-2 text-text-muted space-y-1 text-sm">
          <li>VS Code · pnpm · Docker Desktop</li>
          <li>DBeaver for SQL · ChatGPT/Claude for rubber-ducking</li>
        </ul>
      </main>
      <Footer />
    </>
  );
}
