import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const projectFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  role: z.string(),
  date: z.string(),
  stack: z.array(z.string()),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })),
  architectureImage: z.string().optional(),
  githubUrl: z.url().optional(),
  demoUrl: z.url().optional(),
  featured: z.boolean().optional(),
});

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
export type Project = ProjectFrontmatter & { body: string };

const projectsDir = path.join(process.cwd(), "content/projects");

export function getAllProjects(): Project[] {
  const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith(".mdx"));
  const projects = files.map((file) => {
    const raw = fs.readFileSync(path.join(projectsDir, file), "utf8");
    const { data, content } = matter(raw);
    const frontmatter = projectFrontmatterSchema.parse(data);
    return { ...frontmatter, body: content };
  });
  return projects.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getAllProjects().find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((p) => p.featured);
}

const postFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  date: z.string(),
  tags: z.array(z.string()).optional(),
  draft: z.boolean().optional(),
});
export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;
export type Post = PostFrontmatter & { body: string };

const postsDir = path.join(process.cwd(), "content/blog");

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDir)) return [];
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx"));
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
      const { data, content } = matter(raw);
      return { ...postFrontmatterSchema.parse(data), body: content };
    })
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}
