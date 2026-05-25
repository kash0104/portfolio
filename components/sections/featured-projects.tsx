import { getFeaturedProjects } from "@/lib/mdx";
import { ProjectCard } from "@/components/ui/project-card";
import { SectionHeading } from "@/components/ui/section-heading";

export function FeaturedProjects() {
  const projects = getFeaturedProjects();
  return (
    <section id="projects" className="py-20">
      <SectionHeading number="03" label="projects" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => <ProjectCard key={p.slug} project={p} />)}
      </div>
    </section>
  );
}
