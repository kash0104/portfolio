import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { StatsStrip } from "@/components/sections/stats-strip";
import { TechStack } from "@/components/sections/tech-stack";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { Experience } from "@/components/sections/experience";
import { Services } from "@/components/sections/services";
import { Certifications } from "@/components/sections/certifications";
import { BlogTeaser } from "@/components/sections/blog-teaser";
import { Schedule } from "@/components/sections/schedule";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="max-w-[1100px] mx-auto px-6 md:px-10">
        <Hero />
        <About />
        <StatsStrip />
        <TechStack />
        <FeaturedProjects />
        <Experience />
        <Services />
        <Certifications />
        <BlogTeaser />
        <Schedule />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
