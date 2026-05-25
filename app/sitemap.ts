import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { getAllProjects, getAllPosts } from "@/lib/mdx";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const projects = getAllProjects().map((p) => ({
    url: `${site.url}/projects/${p.slug}`,
    lastModified: new Date(p.date),
  }));
  const posts = getAllPosts().map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: new Date(p.date),
  }));
  return [
    { url: site.url, lastModified: now },
    { url: `${site.url}/blog`, lastModified: now },
    { url: `${site.url}/uses`, lastModified: now },
    ...projects,
    ...posts,
  ];
}
