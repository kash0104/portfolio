import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllProjects, getProjectBySlug } from "@/lib/mdx";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { TechBadge } from "@/components/ui/tech-badge";
import { site } from "@/data/site";

export async function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: { title: project.title, description: project.summary, url: `${site.url}/projects/${project.slug}` },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  return (
    <>
      <Nav />
      <main className="max-w-[800px] mx-auto px-6 md:px-10 py-16">
        <p className="font-mono text-xs text-text-dim">{"// "}{project.role}</p>
        <h1 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">{project.title}</h1>
        <p className="mt-3 text-text-muted">{project.summary}</p>
        <div className="grid grid-cols-3 gap-4 mt-8 border border-border bg-surface rounded p-5">
          {project.metrics.map((m) => (
            <div key={m.label}>
              <div className="font-mono text-2xl text-accent-2 font-semibold">{m.value}</div>
              <div className="text-[10px] uppercase tracking-wider text-text-dim">{m.label}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-6">
          {project.stack.map((s) => <TechBadge key={s} label={s} />)}
        </div>
        {project.architectureImage && (
          <div className="mt-8 border border-border rounded overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.architectureImage} alt={`${project.title} architecture diagram`} className="w-full" />
          </div>
        )}
        <article className="prose prose-invert mt-10 max-w-none">
          <MDXRemote source={project.body} />
        </article>
      </main>
      <Footer />
    </>
  );
}
