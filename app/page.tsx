import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Reveal } from "@/components/ui/reveal";
import { Marquee } from "@/components/ui/marquee";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { StatsStrip } from "@/components/sections/stats-strip";
import { TechStack } from "@/components/sections/tech-stack";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { Experience } from "@/components/sections/experience";
import { Services } from "@/components/sections/services";
import { Certifications } from "@/components/sections/certifications";
import { Schedule } from "@/components/sections/schedule";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="max-w-[1100px] mx-auto px-6 md:px-10">
        <Hero />
        <Reveal><About /></Reveal>
        <Reveal><StatsStrip /></Reveal>
        <Reveal><TechStack /></Reveal>
        <Reveal><FeaturedProjects /></Reveal>
        <Reveal><Experience /></Reveal>
        <Reveal><Services /></Reveal>
        <Reveal><Certifications /></Reveal>
        <Reveal><Schedule /></Reveal>
        <Reveal><Contact /></Reveal>
      </main>
      {/* Full-bleed marquee strip above the footer */}
      <Marquee />
      <Footer />
    </>
  );
}
