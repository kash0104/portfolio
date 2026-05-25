# Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a public, dark-terminal-themed Next.js portfolio for Kashyap Vadhel (Senior Data Engineer) at a Vercel URL, serving recruiters, Upwork clients, and direct freelance leads.

**Architecture:** Single Next.js 15 (App Router) site, statically rendered, MDX-driven case studies, Tailwind v4 for styling, file-based content under `/content` and typed data modules under `/data`. Cal.com embed for booking. Resend-backed contact form. Repo public on GitHub, auto-deployed by Vercel from `main`.

**Tech Stack:** Next.js 15, TypeScript (strict), Tailwind CSS v4, MDX (`next-mdx-remote`), `shiki`, `framer-motion`, `lucide-react`, `simple-icons`, `@vercel/og`, Resend, `pnpm`, Vercel.

**Spec:** [docs/superpowers/specs/2026-05-25-portfolio-design.md](../specs/2026-05-25-portfolio-design.md)

---

## File Structure

```
portfolio/                              ← project root (current directory)
├── .github/workflows/ci.yml            CI: typecheck + lint + build
├── .gitignore
├── LICENSE                             MIT
├── README.md                           Project intro + deploy button
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json                       strict: true
├── next.config.mjs
├── postcss.config.mjs
├── eslint.config.mjs
├── app/
│   ├── layout.tsx                      Root layout: fonts, metadata, JSON-LD
│   ├── globals.css                     Tailwind v4 tokens + base
│   ├── page.tsx                        Landing (composes all sections)
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── projects/[slug]/page.tsx        Project case study
│   ├── blog/page.tsx                   Blog index
│   ├── blog/[slug]/page.tsx            Blog post
│   ├── uses/page.tsx
│   ├── og/[slug]/route.tsx             Dynamic OG image (@vercel/og)
│   └── api/contact/route.ts            Resend handler
├── components/
│   ├── nav.tsx
│   ├── footer.tsx
│   ├── sections/
│   │   ├── hero.tsx
│   │   ├── about.tsx
│   │   ├── stats-strip.tsx
│   │   ├── tech-stack.tsx
│   │   ├── featured-projects.tsx
│   │   ├── experience.tsx
│   │   ├── services.tsx
│   │   ├── certifications.tsx
│   │   ├── blog-teaser.tsx
│   │   ├── schedule.tsx
│   │   └── contact.tsx
│   └── ui/
│       ├── terminal-prompt.tsx
│       ├── stat-card.tsx
│       ├── tech-badge.tsx
│       ├── project-card.tsx
│       ├── timeline-item.tsx
│       ├── service-card.tsx
│       ├── code-block.tsx
│       └── cal-embed.tsx
├── content/
│   ├── projects/
│   │   ├── cdc-data-lake.mdx
│   │   ├── ecom-analytics.mdx
│   │   └── realtime-lakehouse.mdx
│   └── blog/.gitkeep
├── data/
│   ├── site.ts
│   ├── skills.ts
│   ├── experience.ts
│   ├── services.ts
│   ├── certifications.ts
│   └── stats.ts
├── lib/
│   ├── mdx.ts                          MDX loader + typed frontmatter
│   ├── og.tsx                          OG image template
│   ├── seo.ts                          metadata + JSON-LD helpers
│   └── utils.ts                        cn(), formatDate()
├── public/
│   ├── favicon.svg
│   └── images/projects/                Architecture diagrams (placeholder OK at launch)
└── docs/superpowers/                   Spec + plan (already exists)
```

**Decisions locked in here (resolving spec advisories):**
- MDX loader: **`next-mdx-remote`** with frontmatter parsed via `gray-matter`. Simpler than contentlayer, no extra build pipeline.
- Project frontmatter `githubUrl`/`demoUrl` are **optional** (`z.string().url().optional()`).
- Cal.com embed is **lazy** (intersection-observed) and falls back to a "Book a call" button if the viewport never reaches it.

---

## Task 1: Scaffold Next.js project + tooling

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`, `eslint.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `.gitignore`

- [ ] **Step 1: Scaffold via temp dir + move (avoids non-empty-dir prompt)**

The project root already contains `docs/`, so `create-next-app .` will block on a "directory not empty" prompt. Scaffold into a sibling temp dir and move files in:

```bash
pnpm dlx create-next-app@latest .portfolio-tmp --typescript --tailwind --app --no-eslint --no-src-dir --import-alias "@/*" --use-pnpm
# move everything (including dotfiles) up, then remove the temp dir
mv .portfolio-tmp/* .portfolio-tmp/.* . 2>/dev/null || true
rmdir .portfolio-tmp
```

On Windows PowerShell, use (`-Force` on `Get-ChildItem` includes dotfiles):
```powershell
Get-ChildItem .portfolio-tmp -Force | Move-Item -Destination . -Force
Remove-Item .portfolio-tmp -Recurse -Force
```

Expected: a Next.js 15 app's files sitting next to the existing `docs/` folder.

- [ ] **Step 2: Verify it boots**

```bash
pnpm dev
```
Open `http://localhost:3000` — expect the default Next.js page. Stop with Ctrl+C.

- [ ] **Step 3: Add strict TS settings**

In `tsconfig.json`, ensure `"strict": true`, `"noUncheckedIndexedAccess": true`, and `"forceConsistentCasingInFileNames": true`.

- [ ] **Step 4: Install ESLint (flat config via FlatCompat) + Prettier**

```bash
pnpm add -D eslint@^9 @eslint/js @eslint/eslintrc typescript-eslint eslint-config-next prettier eslint-config-prettier
```

`eslint-config-next` is published as a legacy (eslintrc) config in v15 and is not directly a flat-config callable. Use `FlatCompat` to bridge it:

Create `eslint.config.mjs`:
```js
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  prettier,
  { ignores: [".next/**", "node_modules/**", "public/**"] },
];
```

Add scripts to `package.json`:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "typecheck": "tsc --noEmit",
  "format": "prettier --write ."
}
```

- [ ] **Step 5: Verify lint + typecheck pass**

```bash
pnpm typecheck && pnpm lint
```
Expected: both pass with no errors.

- [ ] **Step 6: Init git + first commit**

```bash
git init -b main
git add .
git commit -m "chore: scaffold Next.js 15 + Tailwind + TS"
```

---

## Task 2: Theme + fonts + global styles

**Files:**
- Modify: `app/layout.tsx`, `app/globals.css`
- Create: `lib/utils.ts`

- [ ] **Step 1: Install fonts via `next/font` + utility deps**

```bash
pnpm add clsx tailwind-merge
```

- [ ] **Step 2: Create `lib/utils.ts`**

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 3: Wire fonts in `app/layout.tsx`**

```tsx
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="bg-bg text-text antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Define Tailwind v4 theme tokens in `app/globals.css`**

```css
@import "tailwindcss";

@theme {
  --color-bg: #0a0a0a;
  --color-surface: #111111;
  --color-border: #1f1f1f;
  --color-text: #ededed;
  --color-text-muted: #a3a3a3;
  --color-text-dim: #525252;
  --color-accent: #10b981;
  --color-accent-2: #38bdf8;
  --color-danger: #f43f5e;
  --font-sans: var(--font-sans), ui-sans-serif, system-ui;
  --font-mono: var(--font-mono), ui-monospace, SFMono-Regular, Menlo;
}

@layer base {
  html { scroll-behavior: smooth; }
  body { font-family: var(--font-sans); }
  ::selection { background: var(--color-accent); color: #000; }
  *:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 5: Replace `app/page.tsx` body with a theme smoke test**

```tsx
export default function Home() {
  return (
    <main className="min-h-screen p-10">
      <h1 className="font-mono text-accent text-3xl">$ kashyap.vadhel</h1>
      <p className="text-text-muted mt-2">Theme is wired.</p>
    </main>
  );
}
```

- [ ] **Step 6: Verify visually**

```bash
pnpm dev
```
Open `http://localhost:3000` — expect dark background, green monospace heading, muted-grey subtitle. Stop.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: dark terminal theme tokens, Inter + JetBrains Mono fonts"
```

---

## Task 3: Site metadata + typed data modules

**Files:**
- Create: `data/site.ts`, `data/skills.ts`, `data/experience.ts`, `data/services.ts`, `data/certifications.ts`, `data/stats.ts`

- [ ] **Step 1: `data/site.ts`** — single source of truth for socials/metadata

```ts
export const site = {
  name: "Kashyap Vadhel",
  title: "Kashyap Vadhel — Senior Data Engineer",
  role: "Senior Data Engineer",
  tagline: "Building scalable ETL pipelines and cloud data platforms.",
  description:
    "AWS & Snowflake certified Data Engineer with 4+ years building scalable ETL pipelines, CDC data lakes, and dbt warehouses.",
  url: "https://kashyap-vadhel.vercel.app",
  email: "vadhelkashyap@gmail.com",
  location: "Gandhinagar, Gujarat, India",
  socials: {
    github: "https://github.com/kash0104",
    githubRepo: "https://github.com/kash0104/portfolio",
    linkedin: "https://www.linkedin.com/in/kashyapvadhel/",
    upwork: "https://www.upwork.com/freelancers/~0102ee754bbfdbb126",
  },
  cal: { username: "kashyapvadhel" }, // adjust at Cal.com signup time
} as const;
```

- [ ] **Step 2: `data/stats.ts`** — hero strip numbers

```ts
export const stats = [
  { value: "4+", label: "Years experience" },
  { value: "1000+", label: "Client DBs onboarded" },
  { value: "60%", label: "Fewer Glue jobs" },
  { value: "30%", label: "Snowflake cost saved" },
] as const;
```

- [ ] **Step 3: `data/skills.ts`** — grouped tech stack (verbatim from resume)

```ts
export const skillGroups = [
  {
    title: "Cloud & Data Services",
    items: ["AWS Glue", "Redshift", "S3", "Lambda", "Athena", "Step Functions", "Kinesis", "Clean Rooms"],
  },
  { title: "Languages", items: ["SQL", "Python"] },
  { title: "Data Warehouse", items: ["Snowflake", "Redshift"] },
  { title: "Data Processing", items: ["dbt", "PySpark", "Apache NiFi"] },
  { title: "Databases", items: ["PostgreSQL", "MySQL", "MS SQL Server"] },
  { title: "Optimization", items: ["Query tuning", "Indexing", "Sort/Dist Key design"] },
] as const;
```

- [ ] **Step 4: `data/experience.ts`** — timeline

```ts
export const experience = [
  {
    role: "Senior Data Engineer",
    company: "Simform Solutions",
    period: "Present",
    bullets: [
      "Architected a CDC ingestion platform serving 1000+ client databases on Iceberg.",
      "Reduced Glue job executions ~60% by switching to event-driven CDC.",
      "Led Snowflake → Iceberg migration, cutting storage costs ~30%.",
      "Mentored junior data engineers and conducted technical interviews.",
    ],
  },
] as const;
```
(Add more entries here as career history grows — for now the resume lists one role.)

- [ ] **Step 5: `data/services.ts`** — three service cards

```ts
import type { LucideIcon } from "lucide-react";
import { ClipboardCheck, Database, Cloud } from "lucide-react";

export const services: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: ClipboardCheck,
    title: "Data Pipeline Audit",
    body: "Review your existing pipelines, identify bottlenecks, deliver a prioritized optimization roadmap with cost-impact estimates.",
  },
  {
    icon: Database,
    title: "dbt + Snowflake Setup",
    body: "Greenfield dbt project on Snowflake with CI/CD, incremental models, tests, and documentation — ready for your team to extend.",
  },
  {
    icon: Cloud,
    title: "Cloud Data Migration",
    body: "Migrate from legacy ETL or warehouse to AWS + Snowflake (or Iceberg). Includes parallel-run validation and cutover plan.",
  },
];
```

- [ ] **Step 6: `data/certifications.ts`**

```ts
export const certifications = [
  {
    name: "AWS Certified Data Analytics – Specialty",
    issuer: "Amazon Web Services",
    verifyUrl: "https://www.credly.com/users/kashyap-vadhel",
    badgeImg: "/images/certs/aws-daa.png",
  },
  {
    name: "Snowflake SnowPro Core Certification",
    issuer: "Snowflake",
    verifyUrl: "https://achieve.snowflake.com/profile/kashyapvadhel",
    badgeImg: "/images/certs/snowflake-snowpro.png",
  },
];
```
(URLs above are placeholders — verify and replace with the real verify links from the actual cert profiles when available.)

- [ ] **Step 7: Verify**

```bash
pnpm typecheck
```
Expected: passes.

- [ ] **Step 8: Commit**

```bash
git add data/
git commit -m "feat: typed data modules for site, skills, experience, services, certs"
```

---

## Task 4: MDX content pipeline

**Files:**
- Create: `lib/mdx.ts`, `content/projects/cdc-data-lake.mdx`, `content/projects/ecom-analytics.mdx`, `content/projects/realtime-lakehouse.mdx`, `content/blog/.gitkeep`

- [ ] **Step 1: Install MDX deps**

```bash
pnpm add next-mdx-remote gray-matter zod
pnpm add -D @types/mdx
```

- [ ] **Step 2: Define `lib/mdx.ts` with a zod-validated frontmatter schema**

```ts
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
  githubUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
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
```

- [ ] **Step 3: Author `content/projects/cdc-data-lake.mdx`**

```mdx
---
title: "Multi-Tenant CDC Data Lake Architecture"
slug: "cdc-data-lake"
summary: "Event-driven CDC ingestion from 1000+ client databases into an Apache Iceberg lake."
role: "Senior Data Engineer · Architecture Lead"
date: "2025-08-01"
stack: ["AWS DMS", "S3", "SQS", "Lambda", "AWS Glue", "Apache Iceberg", "DynamoDB", "EventBridge", "Snowflake"]
metrics:
  - { label: "Glue jobs eliminated", value: "~60%" }
  - { label: "Snowflake storage saved", value: "~30%" }
  - { label: "DMS performance gain", value: "35%" }
featured: true
---

## Problem
Table-level Glue jobs opened 100+ concurrent JDBC connections across 1000+ client databases, hit connection limits, and caused ingestion failures at scale.

## Architecture
`AWS DMS → S3 → SQS → Lambda → Glue → Apache Iceberg`. DMS streams CDC events; Lambda routes them; Glue lands them as Iceberg tables that Snowflake queries via external tables.

## Key Decisions
- Replaced table-level Glue jobs with **event-driven CDC**, removing the connection bottleneck.
- Fault-tolerant recovery via **DynamoDB + EventBridge + Lambda** to track and re-drive failed Glue jobs.
- Tuned DMS streams for **CPU efficiency** on minimal instance sizes — 35% gain.
- Migrated Snowflake-native tables to **Iceberg on S3**, separating storage from compute.

## Outcomes
~60% fewer Glue executions, ~30% storage cost reduction, dramatically reduced ingestion failures.

## Reflection
With more time I'd add lineage instrumentation (OpenLineage / DataHub) and a per-tenant SLO dashboard.
```

- [ ] **Step 4: Author `content/projects/ecom-analytics.mdx`**

```mdx
---
title: "Scalable E-commerce Analytics Platform"
slug: "ecom-analytics"
summary: "ELT platform integrating 6+ e-commerce data sources into Snowflake + dbt + Looker."
role: "Senior Data Engineer"
date: "2024-12-01"
stack: ["Fivetran", "Snowflake", "dbt", "Shopify", "Amazon", "Google Ads", "Meta Ads", "Google Sheets", "Looker"]
metrics:
  - { label: "Compute + runtime cut", value: "~40%" }
  - { label: "Data sources integrated", value: "6+" }
  - { label: "Dashboards delivered", value: "3" }
featured: true
---

## Problem
Marketing and inventory data lived in 6+ disconnected sources. Reporting was manual and stale; legacy dbt models ran nightly and were expensive.

## Architecture
Fivetran ingests Shopify, Amazon, Google & Meta Ads, and Google Sheets/Drive into Snowflake. dbt transforms staging → marts. Looker dashboards land for stakeholders.

## Key Decisions
- Re-architected legacy dbt into **incremental models** — ~40% reduction in compute + runtime.
- Built **automated validation + monitoring** so quality issues surface before stakeholders see them.
- Modeled marts around three audiences: inventory, sales performance, marketing ROI.

## Outcomes
Faster decisions for stakeholders, lower Snowflake spend, far fewer data-quality fire drills.
```

- [ ] **Step 5: Author `content/projects/realtime-lakehouse.mdx`** (showcase, build-in-progress)

```mdx
---
title: "Real-time E-commerce Lakehouse (Showcase)"
slug: "realtime-lakehouse"
summary: "Open-source end-to-end streaming lakehouse: Kinesis → Iceberg → Snowflake → dbt → Streamlit."
role: "Solo build"
date: "2026-05-25"
stack: ["Python", "Kinesis", "Lambda", "S3", "Apache Iceberg", "AWS Glue", "Step Functions", "Snowflake", "dbt", "Streamlit", "Terraform"]
metrics:
  - { label: "Build status", value: "In progress" }
  - { label: "Stack breadth", value: "Full lakehouse" }
  - { label: "License", value: "MIT" }
githubUrl: "https://github.com/kash0104/realtime-lakehouse"
featured: true
---

## Why
A buildable, public reference for a real-time lakehouse using only managed AWS + Snowflake + dbt. Demonstrates the full stack end-to-end and stays cheap to run.

## Architecture
1. Mock Shopify event generator (Python Faker) streams orders to **Kinesis Data Streams**.
2. **Lambda** writes to **S3 in Iceberg format** via the Glue catalog.
3. **Step Functions** orchestrate **Glue** bronze → silver → gold jobs.
4. **Snowflake** queries Iceberg via external tables; **dbt** layers staging + marts.
5. **Streamlit** dashboard reads from Snowflake.

## Status
Repo is being seeded; this page links to it as artefacts land (Terraform modules, dbt project, CI workflow, cost analysis writeup).

[GitHub repo →](https://github.com/kash0104/realtime-lakehouse)
```

- [ ] **Step 6: Create `content/blog/.gitkeep`** (empty file to track the directory).

- [ ] **Step 7: Verify the loader by smoke-printing**

Add a temporary script `scripts/check-mdx.ts`:
```ts
import { getAllProjects } from "../lib/mdx";
const projects = getAllProjects();
console.log(`Loaded ${projects.length} projects:`, projects.map((p) => p.slug));
```
Run:
```bash
pnpm dlx tsx scripts/check-mdx.ts
```
Expected output: `Loaded 3 projects: [ 'realtime-lakehouse', 'cdc-data-lake', 'ecom-analytics' ]` (order may vary by date).

Delete `scripts/check-mdx.ts` after verifying.

- [ ] **Step 8: Commit**

```bash
git add lib/mdx.ts content/
git commit -m "feat: MDX content pipeline + three project case studies"
```

---

## Task 5: UI primitives

**Files:**
- Create: `components/ui/terminal-prompt.tsx`, `components/ui/stat-card.tsx`, `components/ui/tech-badge.tsx`, `components/ui/project-card.tsx`, `components/ui/timeline-item.tsx`, `components/ui/service-card.tsx`, `components/ui/code-block.tsx`

- [ ] **Step 1: Install icon + syntax-highlighting deps**

```bash
pnpm add lucide-react shiki
```

(Framer Motion was on the table but not actually used in v1 — cursor blink uses CSS `animate-pulse`, and reveal animations are deferred. Drop from the bundle to honor the <100 KB JS budget.)

- [ ] **Step 2: `components/ui/terminal-prompt.tsx`**

```tsx
export function TerminalPrompt({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={"font-mono " + (className ?? "")}>
      <span className="text-accent">$</span> {children}
      <span className="ml-1 inline-block w-2 h-[1em] bg-accent align-middle animate-pulse" aria-hidden />
    </span>
  );
}
```

- [ ] **Step 3: `components/ui/stat-card.tsx`**

```tsx
export function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="border border-border bg-surface px-5 py-4 rounded">
      <div className="font-mono text-3xl text-accent-2 font-semibold">{value}</div>
      <div className="text-xs uppercase tracking-wider text-text-dim mt-1">{label}</div>
    </div>
  );
}
```

- [ ] **Step 4: `components/ui/tech-badge.tsx`**

```tsx
export function TechBadge({ label }: { label: string }) {
  return (
    <span className="font-mono text-xs px-2.5 py-1 border border-border bg-surface text-text-muted rounded">
      {label}
    </span>
  );
}
```

- [ ] **Step 5: `components/ui/project-card.tsx`**

```tsx
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TechBadge } from "./tech-badge";
import type { Project } from "@/lib/mdx";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block border border-border bg-surface p-6 rounded hover:border-accent transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{project.title}</h3>
          <p className="text-text-muted mt-2 text-sm">{project.summary}</p>
        </div>
        <ArrowUpRight className="text-text-dim group-hover:text-accent transition-colors shrink-0" size={18} />
      </div>
      <div className="grid grid-cols-3 gap-3 mt-5">
        {project.metrics.slice(0, 3).map((m) => (
          <div key={m.label}>
            <div className="font-mono text-accent-2 font-semibold">{m.value}</div>
            <div className="text-[10px] uppercase tracking-wider text-text-dim">{m.label}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5 mt-5">
        {project.stack.slice(0, 6).map((s) => <TechBadge key={s} label={s} />)}
        {project.stack.length > 6 && <TechBadge label={`+${project.stack.length - 6}`} />}
      </div>
    </Link>
  );
}
```

- [ ] **Step 6: `components/ui/timeline-item.tsx`**

```tsx
export function TimelineItem({
  role, company, period, bullets,
}: { role: string; company: string; period: string; bullets: readonly string[] }) {
  return (
    <li className="relative pl-8 pb-10 last:pb-0">
      <span className="absolute left-0 top-2 w-3 h-3 rounded-full bg-accent" />
      <span className="absolute left-[5px] top-5 bottom-0 w-px bg-border" />
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold">{role} · <span className="text-text-muted font-normal">{company}</span></h3>
        <span className="font-mono text-xs text-text-dim">{period}</span>
      </div>
      <ul className="mt-2 space-y-1.5 text-sm text-text-muted">
        {bullets.map((b, i) => <li key={i} className="before:content-['→_'] before:text-accent">{b}</li>)}
      </ul>
    </li>
  );
}
```

- [ ] **Step 7: `components/ui/service-card.tsx`**

```tsx
import type { LucideIcon } from "lucide-react";

export function ServiceCard({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return (
    <div className="border border-border bg-surface p-6 rounded flex flex-col">
      <Icon className="text-accent" size={22} />
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-text-muted flex-1">{body}</p>
      <a
        href="#schedule"
        className="mt-5 font-mono text-xs text-accent hover:underline self-start"
      >
        ./book-a-call →
      </a>
    </div>
  );
}
```

- [ ] **Step 8: `components/ui/code-block.tsx`** (Shiki, server component)

```tsx
import { codeToHtml } from "shiki";

export async function CodeBlock({ code, lang = "typescript" }: { code: string; lang?: string }) {
  const html = await codeToHtml(code, { lang, theme: "github-dark-default" });
  return <div className="rounded border border-border overflow-hidden text-sm" dangerouslySetInnerHTML={{ __html: html }} />;
}
```

- [ ] **Step 9: Verify build + typecheck**

```bash
pnpm typecheck && pnpm build
```
Expected: both pass.

- [ ] **Step 10: Commit**

```bash
git add components/ui/
git commit -m "feat: UI primitives (terminal prompt, stat/tech/project/timeline/service/code)"
```

---

## Task 6: Page sections (compose primitives)

**Files:**
- Create: `components/nav.tsx`, `components/footer.tsx`, `components/sections/*.tsx`

- [ ] **Step 1: `components/nav.tsx`**

```tsx
import Link from "next/link";
import { site } from "@/data/site";

const links = [
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur border-b border-border">
      <nav className="max-w-[1100px] mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
        <Link href="/" className="font-mono text-sm"><span className="text-accent">$</span> kashyap.vadhel</Link>
        <div className="hidden md:flex gap-6 text-sm text-text-muted">
          {links.map((l) => <a key={l.href} href={l.href} className="hover:text-text">{l.label}</a>)}
        </div>
        <a href="#schedule" className="font-mono text-xs px-3 py-1.5 bg-accent text-black rounded hover:opacity-90">Book a call</a>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: `components/footer.tsx`**

```tsx
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-8 text-sm text-text-dim flex flex-col md:flex-row gap-2 justify-between">
        <span>© {new Date().getFullYear()} {site.name}.</span>
        <span>Built with Next.js · <a className="hover:text-text underline" href={site.socials.githubRepo}>Open source on GitHub</a></span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: `components/sections/hero.tsx`**

```tsx
import { TerminalPrompt } from "@/components/ui/terminal-prompt";
import { site } from "@/data/site";

export function Hero() {
  return (
    <section className="pt-20 pb-16">
      <p className="font-mono text-xs text-text-dim"><TerminalPrompt>whoami</TerminalPrompt></p>
      <h1 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight">{site.name}</h1>
      <p className="mt-3 font-mono text-accent text-sm md:text-base">// {site.role.toLowerCase()}</p>
      <p className="mt-6 max-w-2xl text-text-muted md:text-lg">{site.description}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a href="#projects" className="font-mono text-sm px-4 py-2 bg-accent text-black rounded hover:opacity-90">./projects</a>
        <a href="#schedule" className="font-mono text-sm px-4 py-2 border border-border rounded text-text-muted hover:text-text hover:border-text-muted">./book-a-call</a>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: `components/sections/about.tsx`**

```tsx
export function About() {
  return (
    <section id="about" className="py-16 border-t border-border">
      <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">// about</h2>
      <p className="mt-4 max-w-3xl text-text-muted leading-relaxed text-base md:text-lg">
        I design and build scalable data platforms — CDC pipelines, Iceberg lakes, dbt warehouses on Snowflake.
        I work with teams that need to ingest at scale, model their data well, and keep cloud spend honest.
        Available for senior data-engineering roles and selective freelance engagements.
      </p>
    </section>
  );
}
```

- [ ] **Step 5: `components/sections/stats-strip.tsx`**

```tsx
import { stats } from "@/data/stats";
import { StatCard } from "@/components/ui/stat-card";

export function StatsStrip() {
  return (
    <section className="py-10 grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => <StatCard key={s.label} value={s.value} label={s.label} />)}
    </section>
  );
}
```

- [ ] **Step 6: `components/sections/tech-stack.tsx`**

```tsx
import { skillGroups } from "@/data/skills";
import { TechBadge } from "@/components/ui/tech-badge";

export function TechStack() {
  return (
    <section id="stack" className="py-16 border-t border-border">
      <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">// stack</h2>
      <div className="mt-6 grid md:grid-cols-2 gap-x-10 gap-y-6">
        {skillGroups.map((g) => (
          <div key={g.title}>
            <h3 className="text-sm font-semibold mb-2">{g.title}</h3>
            <div className="flex flex-wrap gap-1.5">
              {g.items.map((i) => <TechBadge key={i} label={i} />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 7: `components/sections/featured-projects.tsx`**

```tsx
import { getFeaturedProjects } from "@/lib/mdx";
import { ProjectCard } from "@/components/ui/project-card";

export function FeaturedProjects() {
  const projects = getFeaturedProjects();
  return (
    <section id="projects" className="py-16 border-t border-border">
      <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">// projects</h2>
      <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => <ProjectCard key={p.slug} project={p} />)}
      </div>
    </section>
  );
}
```

- [ ] **Step 8: `components/sections/experience.tsx`**

```tsx
import { experience } from "@/data/experience";
import { TimelineItem } from "@/components/ui/timeline-item";

export function Experience() {
  return (
    <section id="experience" className="py-16 border-t border-border">
      <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">// experience</h2>
      <ul className="mt-8 max-w-3xl">
        {experience.map((e) => <TimelineItem key={e.role + e.company} {...e} />)}
      </ul>
    </section>
  );
}
```

- [ ] **Step 9: `components/sections/services.tsx`**

```tsx
import { services } from "@/data/services";
import { ServiceCard } from "@/components/ui/service-card";

export function Services() {
  return (
    <section id="services" className="py-16 border-t border-border">
      <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">// services</h2>
      <p className="mt-2 text-text-muted max-w-2xl">Available for selective freelance engagements. Typical timelines 2–8 weeks.</p>
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        {services.map((s) => <ServiceCard key={s.title} {...s} />)}
      </div>
    </section>
  );
}
```

- [ ] **Step 10: `components/sections/certifications.tsx`**

```tsx
import { certifications } from "@/data/certifications";

export function Certifications() {
  return (
    <section id="certifications" className="py-16 border-t border-border">
      <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">// certifications</h2>
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {certifications.map((c) => (
          <a key={c.name} href={c.verifyUrl} target="_blank" rel="noreferrer"
             className="border border-border bg-surface p-5 rounded flex items-center gap-4 hover:border-accent transition-colors">
            <div>
              <div className="font-semibold">{c.name}</div>
              <div className="text-sm text-text-muted">{c.issuer}</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 11: `components/sections/blog-teaser.tsx`** (placeholder until blog has posts)

```tsx
export function BlogTeaser() {
  return (
    <section id="blog" className="py-16 border-t border-border">
      <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">// writing</h2>
      <p className="mt-4 text-text-muted">Articles on data engineering coming soon.</p>
    </section>
  );
}
```

- [ ] **Step 12: `components/ui/cal-embed.tsx`** (lazy via intersection observer)

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";

export function CalEmbed() {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) { setShouldLoad(true); obs.disconnect(); } },
      { rootMargin: "200px" }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="min-h-[480px] border border-border bg-surface rounded">
      {shouldLoad ? (
        <iframe
          src={`https://cal.com/${site.cal.username}?embed=true&theme=dark`}
          className="w-full h-[640px] rounded"
          loading="lazy"
          title="Schedule a call"
        />
      ) : (
        <div className="flex items-center justify-center h-[480px]">
          <a href={`https://cal.com/${site.cal.username}`} className="font-mono text-sm px-4 py-2 bg-accent text-black rounded">
            Open scheduler →
          </a>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 13: `components/sections/schedule.tsx`**

```tsx
import { CalEmbed } from "@/components/ui/cal-embed";

export function Schedule() {
  return (
    <section id="schedule" className="py-16 border-t border-border">
      <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">// schedule</h2>
      <p className="mt-2 text-text-muted">30-min intro call — talk through your project scope.</p>
      <div className="mt-6"><CalEmbed /></div>
    </section>
  );
}
```

- [ ] **Step 14: `components/sections/contact.tsx`** (with form — submits to `/api/contact`)

```tsx
"use client";
import { useState } from "react";
import { site } from "@/data/site";
import { Mail, Linkedin, Github, Briefcase } from "lucide-react";

export function Contact() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/contact", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
    });
    setState(res.ok ? "sent" : "error");
  }

  return (
    <section id="contact" className="py-16 border-t border-border">
      <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">// contact</h2>
      <div className="mt-6 grid md:grid-cols-2 gap-8">
        <div>
          <div className="space-y-3 text-sm">
            <a href={`mailto:${site.email}`} className="flex items-center gap-3 text-text-muted hover:text-text"><Mail size={16}/> {site.email}</a>
            <a href={site.socials.linkedin} className="flex items-center gap-3 text-text-muted hover:text-text"><Linkedin size={16}/> LinkedIn</a>
            <a href={site.socials.github} className="flex items-center gap-3 text-text-muted hover:text-text"><Github size={16}/> GitHub</a>
            <a href={site.socials.upwork} className="flex items-center gap-3 text-text-muted hover:text-text"><Briefcase size={16}/> Upwork</a>
          </div>
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          <input required name="name" placeholder="Your name" className="w-full bg-surface border border-border rounded px-3 py-2 text-sm" />
          <input required type="email" name="email" placeholder="Email" className="w-full bg-surface border border-border rounded px-3 py-2 text-sm" />
          <textarea required name="message" placeholder="Tell me about your project" rows={4} className="w-full bg-surface border border-border rounded px-3 py-2 text-sm" />
          <button disabled={state === "sending"} className="font-mono text-sm px-4 py-2 bg-accent text-black rounded disabled:opacity-50">
            {state === "sending" ? "Sending…" : state === "sent" ? "Sent ✓" : "Send"}
          </button>
          {state === "error" && <p className="text-danger text-sm">Something went wrong. Try emailing directly.</p>}
        </form>
      </div>
    </section>
  );
}
```

- [ ] **Step 15: Compose `app/page.tsx`**

```tsx
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
```

- [ ] **Step 16: Visual smoke test**

```bash
pnpm dev
```
Open `http://localhost:3000` — verify each section renders, dark theme is right, no console errors, scroll is smooth, and the Book-a-call button targets the schedule section.

- [ ] **Step 17: Commit**

```bash
git add -A
git commit -m "feat: landing page sections wired end-to-end"
```

---

## Task 7: Project case study route

**Files:**
- Create: `app/projects/[slug]/page.tsx`

- [ ] **Step 1: Implement the route with `generateStaticParams` + `generateMetadata`**

```tsx
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
        <p className="font-mono text-xs text-text-dim">// {project.role}</p>
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
```

- [ ] **Step 2: Install Tailwind typography for `prose` styling**

```bash
pnpm add -D @tailwindcss/typography
```

Add to `app/globals.css` at the **top level** of the file (immediately after `@import "tailwindcss";`, NOT inside the `@theme { ... }` block):
```css
@plugin "@tailwindcss/typography";
```

- [ ] **Step 3: Verify each project page loads**

```bash
pnpm dev
```
Visit:
- `http://localhost:3000/projects/cdc-data-lake`
- `http://localhost:3000/projects/ecom-analytics`
- `http://localhost:3000/projects/realtime-lakehouse`

Expect: rendered MDX, metrics + stack visible. No console errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: project case study route with static generation"
```

---

## Task 8: Blog index + post route + Uses page

**Files:**
- Create: `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, `app/uses/page.tsx`
- Modify: `lib/mdx.ts` (add blog loader)

- [ ] **Step 1: Extend `lib/mdx.ts` with a blog post schema + loader**

Add to `lib/mdx.ts`:
```ts
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
```

- [ ] **Step 2: `app/blog/page.tsx`** (empty-state OK)

```tsx
import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata = { title: "Blog" };

export default function BlogIndex() {
  const posts = getAllPosts();
  return (
    <>
      <Nav />
      <main className="max-w-[800px] mx-auto px-6 md:px-10 py-16">
        <h1 className="text-3xl md:text-5xl font-semibold">Writing</h1>
        {posts.length === 0 ? (
          <p className="mt-6 text-text-muted">Articles on data engineering coming soon.</p>
        ) : (
          <ul className="mt-10 space-y-6">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="block">
                  <h2 className="text-lg font-semibold hover:text-accent">{p.title}</h2>
                  <p className="text-text-muted text-sm mt-1">{p.summary}</p>
                  <p className="font-mono text-xs text-text-dim mt-1">{p.date}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: `app/blog/[slug]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return post ? { title: post.title, description: post.summary } : {};
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  return (
    <>
      <Nav />
      <main className="max-w-[720px] mx-auto px-6 md:px-10 py-16">
        <h1 className="text-3xl md:text-5xl font-semibold">{post.title}</h1>
        <p className="font-mono text-xs text-text-dim mt-2">{post.date}</p>
        <article className="prose prose-invert mt-8 max-w-none"><MDXRemote source={post.body} /></article>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: `app/uses/page.tsx`** (lightweight, hand-curated)

```tsx
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
```

- [ ] **Step 5: Verify routes**

```bash
pnpm dev
```
Open `/blog` (empty state), `/uses`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: blog index + post route + uses page"
```

---

## Task 9: Contact API (Resend) — TDD

**Files:**
- Create: `app/api/contact/route.ts`, `app/api/contact/route.test.ts`

@superpowers:test-driven-development applies here — this is a logic surface, not UI.

- [ ] **Step 1: Install deps**

```bash
pnpm add resend
pnpm add -D vitest @vitejs/plugin-react happy-dom
```

Add to `package.json` scripts: `"test": "vitest run"`.

Create `vitest.config.ts` (uses `fileURLToPath` so the `@` alias resolves correctly on Windows):
```ts
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: { environment: "happy-dom" },
  resolve: { alias: { "@": root } },
});
```

- [ ] **Step 2: Write failing test `app/api/contact/route.test.ts`**

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

// vi.mock is hoisted above all imports — use vi.hoisted so the factory
// can see the mock at hoist time. Plain top-level consts would not exist yet.
const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));
vi.mock("resend", () => ({ Resend: vi.fn(() => ({ emails: { send: sendMock } })) }));

import { POST } from "./route";

function req(body: unknown) {
  return new Request("http://localhost/api/contact", {
    method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => { sendMock.mockReset(); sendMock.mockResolvedValue({ data: { id: "x" }, error: null }); process.env.RESEND_API_KEY = "test"; process.env.CONTACT_TO_EMAIL = "to@example.com"; });

  it("400s when fields are missing", async () => {
    const res = await POST(req({ name: "", email: "", message: "" }));
    expect(res.status).toBe(400);
  });

  it("400s on invalid email", async () => {
    const res = await POST(req({ name: "A", email: "not-an-email", message: "hi" }));
    expect(res.status).toBe(400);
  });

  it("sends the email and returns 200 on valid input", async () => {
    const res = await POST(req({ name: "A", email: "a@b.com", message: "hello world" }));
    expect(res.status).toBe(200);
    expect(sendMock).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 3: Run test — expect failure**

```bash
pnpm test
```
Expected: tests fail because `./route` doesn't exist yet.

- [ ] **Step 4: Implement `app/api/contact/route.ts`**

```ts
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  message: z.string().min(1).max(5000),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) return Response.json({ error: "Invalid input" }, { status: 400 });

  const { name, email, message } = parsed.data;
  const resend = new Resend(process.env.RESEND_API_KEY!);
  const { error } = await resend.emails.send({
    from: "Portfolio <onboarding@resend.dev>",
    to: process.env.CONTACT_TO_EMAIL!,
    replyTo: email,
    subject: `New portfolio inquiry from ${name}`,
    text: message,
  });
  if (error) return Response.json({ error: "Send failed" }, { status: 500 });
  return Response.json({ ok: true });
}
```

- [ ] **Step 5: Re-run tests — expect pass**

```bash
pnpm test
```
Expected: all 3 tests pass.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: contact API with Resend, validated input, tested"
```

---

## Task 10: SEO — metadata, JSON-LD, sitemap, robots, OG image

**Files:**
- Create: `lib/seo.ts`, `app/sitemap.ts`, `app/robots.ts`, `app/og/[slug]/route.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: `lib/seo.ts`**

```ts
import { site } from "@/data/site";

export const baseMetadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: {
    title: site.title, description: site.description, url: site.url, siteName: site.name,
    images: [{ url: `/og/home`, width: 1200, height: 630 }], type: "website",
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
  robots: { index: true, follow: true },
};

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    jobTitle: site.role,
    email: `mailto:${site.email}`,
    knowsAbout: ["AWS", "Snowflake", "Apache Iceberg", "dbt", "Python", "SQL", "Data Engineering"],
    sameAs: [site.socials.linkedin, site.socials.github, site.socials.upwork],
  };
}
```

- [ ] **Step 2: Wire base metadata + JSON-LD in `app/layout.tsx`**

Replace `app/layout.tsx`:
```tsx
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { baseMetadata, personJsonLd } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata = baseMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="bg-bg text-text antialiased">
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }} />
      </body>
    </html>
  );
}
```

- [ ] **Step 3: `app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { getAllProjects, getAllPosts } from "@/lib/mdx";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const projects = getAllProjects().map((p) => ({ url: `${site.url}/projects/${p.slug}`, lastModified: new Date(p.date) }));
  const posts = getAllPosts().map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: new Date(p.date) }));
  return [
    { url: site.url, lastModified: now },
    { url: `${site.url}/blog`, lastModified: now },
    { url: `${site.url}/uses`, lastModified: now },
    ...projects,
    ...posts,
  ];
}
```

- [ ] **Step 4: `app/robots.ts`**

```ts
import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${site.url}/sitemap.xml` };
}
```

- [ ] **Step 5: `app/og/[slug]/route.tsx`** — dynamic OG image

```tsx
import { ImageResponse } from "next/og";
import { site } from "@/data/site";
import { getProjectBySlug } from "@/lib/mdx";

// Node runtime — `lib/mdx` uses node:fs to read MDX from disk.
// Edge runtime cannot import fs and would 500 in production.
export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = slug === "home" ? null : getProjectBySlug(slug);
  const title = project?.title ?? site.title;
  const subtitle = project?.summary ?? site.description;
  return new ImageResponse(
    (
      <div style={{ background: "#0a0a0a", color: "#ededed", width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: 64, fontFamily: "monospace" }}>
        <div style={{ color: "#10b981", fontSize: 24 }}>$ kashyap.vadhel</div>
        <div style={{ fontSize: 64, marginTop: 32, fontWeight: 600, lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontSize: 28, color: "#a3a3a3", marginTop: 24 }}>{subtitle}</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

- [ ] **Step 6: Verify OG + sitemap + robots**

```bash
pnpm dev
```
Open:
- `http://localhost:3000/og/home` — should render a 1200x630 PNG
- `http://localhost:3000/og/cdc-data-lake` — should render with the project title
- `http://localhost:3000/sitemap.xml` — should list all routes
- `http://localhost:3000/robots.txt` — should reference the sitemap

View page source on `/` — confirm a `<script type="application/ld+json">` Person blob is present.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: SEO — base metadata, JSON-LD, sitemap, robots, dynamic OG images"
```

---

## Task 11: Quality gate (typecheck, lint, build, Lighthouse)

@superpowers:verification-before-completion applies here — verify before shipping.

- [ ] **Step 1: Run the full local gate**

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```
Expected: all pass with zero errors.

- [ ] **Step 2: Local Lighthouse pass**

```bash
pnpm start
# in another shell:
pnpm dlx lighthouse http://localhost:3000 --view --preset=desktop
```
Targets: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95. If any score < 95, address findings before moving on (most common: image sizing, missing alt, JS bundle bloat).

- [ ] **Step 3: Commit any fixes**

```bash
git add -A
git commit -m "perf: address Lighthouse findings"
```

---

## Task 12: CI workflow, README, LICENSE

**Files:**
- Create: `.github/workflows/ci.yml`, `README.md`, `LICENSE`

- [ ] **Step 1: `.github/workflows/ci.yml`**

```yaml
name: CI
on:
  push: { branches: [main] }
  pull_request:
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
```

- [ ] **Step 2: `LICENSE`** — MIT, with year 2026 and "Kashyap Vadhel" as the copyright holder. (Standard MIT text.)

- [ ] **Step 3: `README.md`** (outer 4-backtick fence so the inner ```` ```bash ```` block renders cleanly)

````md
# kashyap.vadhel — Portfolio

Personal portfolio for **Kashyap Vadhel**, Senior Data Engineer (AWS + Snowflake certified).
Live: https://kashyap-vadhel.vercel.app

## Stack
Next.js 15 · TypeScript · Tailwind CSS v4 · MDX (`next-mdx-remote`) · Shiki · Cal.com embed · Resend · Vercel.

## Local dev
```bash
pnpm install
pnpm dev
```
Open http://localhost:3000.

## Commands
- `pnpm dev` — start dev server
- `pnpm build` — production build
- `pnpm typecheck` — TypeScript check
- `pnpm lint` — ESLint
- `pnpm test` — Vitest

## Content
- Case studies: `content/projects/*.mdx` — drop a new `.mdx` to add a project.
- Blog: `content/blog/*.mdx`.

## Deploy
Connect this repo on Vercel. Set env vars:
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kash0104/portfolio)

## License
MIT.
````

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: CI workflow, README, MIT license"
```

---

## Task 13: Deploy to GitHub + Vercel

- [ ] **Step 1: Create the public GitHub repo**

Using GitHub CLI:
```bash
gh repo create kash0104/portfolio --public --source=. --remote=origin --description "Personal portfolio — Senior Data Engineer (AWS + Snowflake)"
git push -u origin main
```
If `gh` is not installed, create the repo via the web UI at `https://github.com/new`, then:
```bash
git remote add origin https://github.com/kash0104/portfolio.git
git push -u origin main
```

- [ ] **Step 2: Connect Vercel (one-time)**

1. Go to https://vercel.com/new
2. Import `kash0104/portfolio`
3. Framework preset: Next.js (auto-detected)
4. Build command: `pnpm build` (auto)
5. Add environment variables:
   - `RESEND_API_KEY` = (from https://resend.com — create a free account)
   - `CONTACT_TO_EMAIL` = `vadhelkashyap@gmail.com`
6. Click Deploy

> **Resend free-tier gotcha:** The contact API ships with `from: "Portfolio <onboarding@resend.dev>"`. With Resend's default unverified sender, delivery is **only** allowed to the account-owner's email. Sign up to Resend with `vadhelkashyap@gmail.com` so that constraint and `CONTACT_TO_EMAIL` line up. If you later want delivery to a different inbox (or want a `from:` on your own domain), verify a domain in Resend and update the `from:` in `app/api/contact/route.ts`.

- [ ] **Step 3: Production smoke test**

After deploy completes, visit the assigned `https://kashyap-vadhel.vercel.app` (or the Vercel-generated subdomain). Verify:
- Landing renders end-to-end
- `/projects/cdc-data-lake` renders
- `/blog` shows "coming soon"
- Contact form submits and a real email arrives in `CONTACT_TO_EMAIL`
- `/sitemap.xml`, `/robots.txt`, `/og/home` all load
- Lighthouse on production URL still ≥ 95 across the board

- [ ] **Step 4: Update `data/site.ts`** with the actual production URL if Vercel assigned a different subdomain, then push:

```bash
git add data/site.ts
git commit -m "chore: lock in production URL"
git push
```

- [ ] **Step 5: Verify CI is green**

Open the GitHub Actions tab on the repo — the latest `CI` workflow should be green. If red, address findings before considering the task complete.

---

## Done criteria

- [ ] Site is live at a public URL
- [ ] All three case studies render with metrics and stack visible
- [ ] Contact form delivers a real email
- [ ] Cal.com section loads on scroll and is functional
- [ ] Sitemap, robots, JSON-LD, OG images all valid
- [ ] CI green on `main`
- [ ] Lighthouse ≥ 95 on production for all four categories
- [ ] Repo is public, has README, MIT LICENSE, working "Deploy with Vercel" button

## Out of scope (post-launch backlog)

- Implementation of the Real-time Lakehouse showcase (separate repo).
- First blog posts.
- Custom domain (`kashyapvadhel.com` or similar).
- Testimonials block in Services.
- Analytics deeper than Vercel built-ins (e.g., Plausible).
