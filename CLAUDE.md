# Read the Rise: project notes

Fly fishing "river intelligence" site. Brand: Read the Rise. Companion fishing-video account: @troutsite.
The angle is the science behind fishing (what's under the surface and why), not generic fishing tips.

## Stack
- Next.js 15 (App Router), TypeScript, plain CSS in `src/app/globals.css` (design tokens at the top).
- All pages are statically generated. Content is TypeScript data, no database yet.

## Where things are
- `src/data/types.ts`: content types (River, Species, Fly…). Months are 0–11.
- `src/data/deschutes.ts`: Deschutes content. One file per river; register rivers in `src/data/index.ts`.
- `src/components/RiverExplorer.tsx`: animated SVG river scene + month filter (client component). Actor positions are in `ACTORS`.
- `src/components/CritterArt.tsx`: SVG drawings of each fish/insect, keyed by species slug.
- `src/components/SpeciesTabs.tsx`: species page tabs; all panels render into HTML for SEO.
- `src/components/RiseDecoder.tsx`, `EmailSignup.tsx`, `RiseMark.tsx` (logo).

## Conventions
- Look: paper #eef0ea, ink #1c2a2b, river teal #0f3d47, salmonfly orange #d4652a. Fonts: Instrument Serif (display), IBM Plex Sans (body), IBM Plex Mono (labels).
- Mobile first: tap targets ≥ 44px; check pages at 390px wide.
- Every species/river must have its own URL with good `generateMetadata` titles (SEO is a core goal).
- Never invent data (gauge readings, stats). Use placeholders until a real source is connected.
- Bull trout are protected: never recommend flies to target them.
- Keep the regulations note on method sections; don't state specific regulations unless verified.

## Roadmap
1. Phase 1 (this): Deschutes, species pages, rise decoder, email sign-up.
2. Live USGS flow/temperature + "Today on the river" view.
3. Accounts, field log, downloadable hatch cards, Stripe payments.
4. More rivers (Metolius, McKenzie, Yakima), later Australia.
