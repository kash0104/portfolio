import { getFeaturedProjects } from "@/lib/mdx";
import { ProjectCard } from "@/components/ui/project-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

export function FeaturedProjects() {
  const projects = getFeaturedProjects();
  return (
    <section id="projects" className="py-20">
      <SectionHeading number="03" label="projects" />
      <Reveal stagger>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => <ProjectCard key={p.slug} project={p} />)}
        </div>
      </Reveal>
    </section>
  );
}
