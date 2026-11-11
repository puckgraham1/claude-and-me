# Read the Rise

Interactive fly fishing river guides. Phase 1: the Deschutes.

## What's in here

| Page | What it does |
|---|---|
| `/` | Home page with river list and email sign-up |
| `/deschutes` | Animated river scene, month filter, "hatching this month" list, species preview |
| `/deschutes/<species>` | One page per fish/insect: best flies, life cycle, methods, ID (each is its own page for Google) |
| `/rise-decoder` | Pick a rise type and see what the trout is eating and what to tie on |
| `/sitemap.xml`, `/robots.txt` | Generated automatically for search engines |

## Editing content (no coding needed)

All river content lives in **`src/data/deschutes.ts`**. Each fish or insect is one block with its flies,
life cycle, methods and facts. Change the text, save, and the site updates.

- **Months** are numbers: 0 = January … 11 = December. `active` = in the river / adults out, `peak` = best months.
- **Add a river:** copy `deschutes.ts` to e.g. `metolius.ts`, edit it, then add it to the list in `src/data/index.ts`.
  It gets its own pages and sitemap entries automatically.

## Run it on your computer

1. Install [Node.js](https://nodejs.org) (the LTS version).
2. In this folder, run:
   ```bash
   npm install
   npm run dev
   ```
3. Open http://localhost:3000

## Put it online (Vercel, free to start)

1. Put this folder in a GitHub repository.
2. Go to [vercel.com](https://vercel.com), sign in with GitHub, click **Add New → Project**, pick the repo, and click **Deploy**.
3. In the Vercel project's **Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_SITE_URL` = your domain, e.g. `https://readtherise.com` (used for the sitemap and SEO)
   - `NEXT_PUBLIC_SIGNUP_URL` = your email provider's form endpoint (Beehiiv, Kit/ConvertKit, Mailchimp…)
4. In **Settings → Domains**, add your domain and follow the DNS steps.

Every time you push a change to GitHub, Vercel redeploys automatically.

## Working on it with Claude Code

Open this folder in Claude Code and describe what you want, e.g.
"add the Metolius River", "add a water-types layer to the river scene", or "connect live USGS flow data".
See `CLAUDE.md` for the project notes Claude reads first.

## Before launch

- [ ] Have a local fly shop or guide review the fly picks and timing in `src/data/deschutes.ts`
- [ ] Connect the email sign-up (`NEXT_PUBLIC_SIGNUP_URL`)
- [ ] Set `NEXT_PUBLIC_SITE_URL` and connect the domain
- [ ] Submit `https://yourdomain/sitemap.xml` in Google Search Console
