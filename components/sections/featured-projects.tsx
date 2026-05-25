import { getFeaturedProjects } from "@/lib/mdx";
import { ProjectCard } from "@/components/ui/project-card";

export function FeaturedProjects() {
  const projects = getFeaturedProjects();
  return (
    <section id="projects" className="py-16 border-t border-border">
      <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">{"// projects"}</h2>
      <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => <ProjectCard key={p.slug} project={p} />)}
      </div>
    </section>
  );
}
