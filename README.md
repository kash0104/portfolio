# kashyap.vadhel — Portfolio

Personal portfolio for **Kashyap Vadhel**, Senior Data Engineer (AWS + Snowflake certified).
Live: https://kashyap-vadhel.vercel.app

## Stack
Next.js 16 · TypeScript · Tailwind CSS v4 · MDX (`next-mdx-remote`) · Shiki · Cal.com embed · Resend · Vercel.

## Local dev

    pnpm install
    pnpm dev

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

MIT — see [LICENSE](./LICENSE).
