# Portfolio Site Design — Kashyap Vadhel

**Date:** 2026-05-25
**Author:** Kashyap Vadhel
**Status:** Approved (pending implementation)

## 1. Purpose & Audience

A public personal portfolio site for **Kashyap Vadhel** (Senior Data Engineer, 4+ years, AWS + Snowflake certified). The site serves three audiences simultaneously:

1. **Recruiters / hiring managers** — scannable career story, certifications, contact.
2. **Upwork / freelance clients** — clear services, social proof via case studies, fast booking.
3. **Direct leads** — email and scheduled call CTAs.

**Success criteria:**
- Lighthouse 95+ on Performance, Accessibility, Best Practices, SEO.
- First Contentful Paint < 1.5s on a cold visit (Vercel Edge).
- A visitor can identify Kashyap's specialty, see one case study, and book a call in under 60 seconds.
- Repo is public on GitHub and itself reads as a portfolio artefact (clean README, sensible commits, typed code, CI green).

## 2. Tech Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSG/ISR, MDX, strong Vercel integration, future-proof. |
| Language | TypeScript (strict) | Demonstrates engineering rigor. |
| Styling | Tailwind CSS v4 | Fast, low-bundle, easy theming. |
| Content | MDX (`@next/mdx` + `contentlayer`-style typed loader, or `next-mdx-remote`) | Case studies and blog posts as files. |
| Animations | Framer Motion | Subtle reveal + cursor blink only. |
| Icons | `lucide-react` + `simple-icons` (for tech logos) | Standard, small. |
| Code blocks | `shiki` | SSR syntax highlighting, no JS cost on client. |
| Scheduling | Cal.com embed (free, open source) | Aligns with "open source" requirement. |
| Email/contact | Resend API (free tier 100/day) with a Next.js route handler | Real form, no third-party widget. |
| Analytics | Vercel Analytics + Vercel Speed Insights | Privacy-friendly, no cookie banner needed. |
| Hosting | Vercel (free Hobby tier) | Zero-config, Edge, preview deployments. |
| Repo | GitHub (public) | Doubles as a portfolio piece; visitors can fork. |

## 3. Information Architecture

### Routes

```
/                         Landing (anchor-scrolled sections)
/projects/cdc-data-lake          Case study 1
/projects/ecom-analytics         Case study 2
/projects/realtime-lakehouse     Showcase case study 3
/blog                            Blog index
/blog/[slug]                     Blog post
/uses                            Tools / setup / stack the author uses
/og/[slug]                       Dynamic OG image route (@vercel/og)
/api/contact                     Resend-backed contact form handler
/sitemap.xml, /robots.txt        Auto-generated
```

### Landing sections (top to bottom)

1. **Hero** — terminal-style intro: `$ whoami`, name, "Senior Data Engineer", short value prop, two CTAs (`./projects`, `./book-a-call`). Blinking cursor.
2. **About** — 2–3 sentence intro framed for both recruiters and clients.
3. **Stats strip** — 4 monospace stat cards: `4+ yrs`, `1000+ clients (CDC platform)`, `60% Glue job reduction`, `30% Snowflake cost saved`.
4. **Tech Stack** — 5 grouped grids: Cloud & Data Services / Data Warehouse / Data Processing / Languages / Databases. Pill badges with `simple-icons` logos.
5. **Featured Projects** — 3 cards (CDC Data Lake, E-commerce Analytics, Real-time Lakehouse). Each card: title, one-line summary, 3 key metrics, stack chips, link to full case study.
6. **Experience Timeline** — vertical timeline with role / dates / 2–3 bullet wins.
7. **Services / Hire Me** — 3 service cards:
   - **Data Pipeline Audit** — review existing pipelines, deliver report with optimization roadmap.
   - **dbt + Snowflake Setup** — greenfield dbt project on Snowflake with CI/CD and tests.
   - **Cloud Data Migration** — migrate from legacy ETL or warehouse to AWS + Snowflake/Iceberg.
   Each card has a "Book a call" CTA scrolling to the Cal.com section.
8. **Certifications** — AWS Certified Data Analytics – Specialty + Snowflake SnowPro Core. Badge image + verify link.
9. **Blog teaser** — 3 latest posts (or "Articles coming soon" placeholder while empty).
10. **Schedule a call** — embedded Cal.com inline widget.
11. **Contact** — email, LinkedIn, GitHub, Upwork links + a contact form (Resend-backed).
12. **Footer** — minimal, terminal-style: copyright line, "built with Next.js · open source on GitHub" link.

## 4. Visual System

### Colors

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0a0a0a` | Page background |
| `--surface` | `#111111` | Cards, code blocks |
| `--border` | `#1f1f1f` | Dividers, card borders |
| `--text` | `#ededed` | Primary text |
| `--text-muted` | `#a3a3a3` | Secondary text |
| `--text-dim` | `#525252` | Tertiary / labels |
| `--accent` | `#10b981` | Terminal green: prompts, CTAs, highlights |
| `--accent-2` | `#38bdf8` | Data blue: metric numbers, links |
| `--danger` | `#f43f5e` | Reserved (errors, "live" badge optional) |

### Typography

- **Sans**: Inter Variable (`next/font` self-hosted) — headings + body.
- **Mono**: JetBrains Mono Variable — code, terminal prompts, stat numbers, badges.
- Type scale (Tailwind defaults adjusted): hero `text-5xl`/`md:text-6xl`, section title `text-3xl`, body `text-base` with `leading-relaxed`.

### Components

- **TerminalPrompt** — `$` glyph + cursor blink (CSS keyframes, respects `prefers-reduced-motion`).
- **StatCard** — monospace big number + label.
- **TechBadge** — pill with icon + label.
- **ProjectCard** — title, summary, 3 metrics, stack chips, link.
- **TimelineItem** — dotted vertical line, role, dates, bullets.
- **ServiceCard** — icon, title, description, "Book a call" CTA.
- **CodeBlock** — `shiki`-highlighted, monospace, copy button.

### Layout

- Max width `1100px` centered, `px-6 md:px-10`.
- Section spacing `py-24 md:py-32`.
- Sticky minimalist nav with anchors and a "Book a call" button.
- Mobile: single column, nav collapses to a sheet.

### Accessibility

- WCAG AA contrast on all text on dark surfaces (verified for `#a3a3a3` on `#0a0a0a`).
- Visible focus rings (`focus-visible:ring-2 ring-accent`).
- Semantic landmarks: `<header>`, `<main>`, `<section>` with `aria-labelledby`, `<footer>`.
- All animations gated on `prefers-reduced-motion: no-preference`.
- All images have `alt`; decorative ones use `alt=""`.

## 5. Content Structure

```
/content
  /projects
    cdc-data-lake.mdx
    ecom-analytics.mdx
    realtime-lakehouse.mdx
  /blog
    .gitkeep
/data
  site.ts             // site metadata, social links
  skills.ts           // grouped tech stack
  experience.ts       // timeline entries
  services.ts         // 3 service cards
  certifications.ts   // cert metadata + verify URLs
  stats.ts            // hero stat strip
```

### Project MDX frontmatter

```yaml
title: "Multi-Tenant CDC Data Lake Architecture"
slug: "cdc-data-lake"
summary: "Event-driven CDC ingestion serving 1000+ client databases into Apache Iceberg."
role: "Senior Data Engineer, Architecture Lead"
date: "2025-08-01"
stack: ["AWS DMS", "S3", "SQS", "Lambda", "AWS Glue", "Apache Iceberg", "Snowflake"]
metrics:
  - { label: "Glue job reduction", value: "~60%" }
  - { label: "Snowflake storage cost saved", value: "~30%" }
  - { label: "DMS performance gain", value: "35%" }
architectureImage: "/images/projects/cdc-data-lake-arch.png"
githubUrl: null
demoUrl: null
featured: true
```

Each MDX body has standard sections: Problem · Constraints · Architecture · Key Decisions · Outcomes · What I'd do differently.

### Showcase project (Real-time Lakehouse)

A buildable open-source project. Repo lives separately and is linked from the case study.

- **Pipeline**: mock Shopify event generator (Python Faker) → Kinesis Data Streams → Lambda → S3 (Iceberg via Glue catalog) → Step Functions orchestrates Glue bronze→silver→gold jobs → Snowflake external tables on Iceberg → dbt models (staging/marts) → Streamlit dashboard.
- **IaC**: Terraform modules for all AWS resources.
- **Observability**: CloudWatch dashboards + dbt test artifacts published to GitHub Pages.
- **Repo deliverables**: README with architecture diagram, cost analysis, "run it yourself" instructions, GitHub Actions CI for Terraform validate + dbt build + tests.
- The case study on the portfolio links to: live demo dashboard, GitHub repo, blog writeup.

> Note: building this showcase is a separate project from shipping the portfolio. Portfolio launch should not block on its completion — the case study page can ship with a "Build in progress" badge and a link to the repo as it grows.

## 6. SEO

- `metadata` per page (Next.js App Router metadata API): title template `"%s | Kashyap Vadhel"`, description, keywords.
- Open Graph + Twitter cards via dynamic OG image route (`/og/[slug]`) using `@vercel/og`.
- JSON-LD Person schema on the root layout: `name`, `jobTitle`, `knowsAbout`, `sameAs` (LinkedIn, GitHub, Upwork), `image`.
- Sitemap and robots.txt generated via `app/sitemap.ts` and `app/robots.ts`.
- Canonical URLs.

## 7. Performance

- All third-party scripts deferred or lazy. Cal.com embed lazy-loaded on viewport intersection.
- `next/image` with explicit `width`/`height`, AVIF then WebP.
- `next/font` for self-hosted Inter + JetBrains Mono (no FOUT, no network round trip).
- Static rendering everywhere except the `/api/contact` handler.
- Bundle budget: < 100 KB JS shipped on the landing page (gzipped).

## 8. Deployment

1. Init a new git repo locally; initial commit with spec + scaffold.
2. Create a public GitHub repo: `<github-handle>/portfolio`.
3. Connect Vercel to the repo. Vercel auto-deploys `main` to production and PR branches to previews.
4. Domain (optional, recommended): purchase `kashyapvadhel.com` from Cloudflare or Namecheap (~$12/yr); point DNS to Vercel. Until then, `<project>.vercel.app` is fine.
5. Add secrets to Vercel project settings: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CAL_USERNAME`.
6. License: MIT in repo. README explains the project, lists the stack, includes a `Deploy with Vercel` button.

## 9. CI/CD

GitHub Actions workflow `.github/workflows/ci.yml` running on PR + push to `main`:

- `pnpm install --frozen-lockfile`
- `pnpm typecheck` (`tsc --noEmit`)
- `pnpm lint` (ESLint flat config + Tailwind plugin)
- `pnpm build` (catch build-time errors)
- `pnpm test` (only if/when tests are added — initial scaffold may skip)

Vercel handles deploy on push to `main`. No separate deploy step in GH Actions.

## 10. Out of Scope (v1)

- CMS — content is file-based MDX. Revisit only if blog grows past ~30 posts.
- Multilingual (English only at launch).
- Newsletter signup — defer until there is regular blog cadence.
- Authentication / private routes — not needed.
- Building the Real-time Lakehouse showcase implementation — it has its own repo and timeline; portfolio ships independently and links to it.

## 11. Resolved Inputs

| Item | Value |
|---|---|
| GitHub repo | `https://github.com/kash0104/portfolio` |
| GitHub profile | `https://github.com/kash0104` |
| LinkedIn | `https://www.linkedin.com/in/kashyapvadhel/` |
| Upwork profile | `https://www.upwork.com/freelancers/~0102ee754bbfdbb126` |
| Email | `vadhelkashyap@gmail.com` |
| Phone (display optional) | `+91 7048525374` |
| Launch domain | `kashyap-vadhel.vercel.app` (or Vercel-assigned). Custom domain deferred. |
| Testimonials | None at launch. Services section ships without a testimonials block; can be added later if quotes become available. |

All site metadata (Section 6 JSON-LD `sameAs`, footer links, contact section) draws from `data/site.ts` populated with the values above.
