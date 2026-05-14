# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Eugene Vestel's personal site. Multi-page Vite + React 18 + TypeScript SPA with `react-router-dom` v7, a custom WebGL fragment-shader background, and an SVG mascot ("LegoGene") that walks across the bottom of every page. Deployed at `eugenevestel.com` (Vercel, project `aks129s-projects/genesite`, connected to GitHub `aks129/genesite`). Pushes to `main` auto-deploy to production.

## Commands

```bash
npm run dev            # Vite dev server on :5173
npm run build          # tsc -b && vite build  (both must succeed)
npm run preview        # serve the built dist/ locally
npm test               # vitest run --passWithNoTests  (13 tests as of latest)
npm run test:watch
npm test -- Reveal     # run a single test file by name fragment
```

`npm run build` uses TypeScript project references (`tsc -b`), which emits sibling `vite.config.js`, `vite.config.d.ts`, and `*.tsbuildinfo` files. These are gitignored — leave them.

## Routing & layout

Six routes, all served by a single `BrowserRouter` in `src/App.tsx`. SPA — Vercel rewrites everything to `/` (`vercel.json` `rewrites`), client-side router handles the rest.

```text
/            Home          Hero + About + Travels + Contact + Socials
/projects    ProjectsPage  Technical project cards (HealthClaw, etc.)
/career      CareerPage    USMap + timeline + expertise + events
/hobbies     HobbiesPage   Personal passions + freeform list
/writing     WritingPage   Newsletter + podcast entries
/speaking    SpeakingPage  Talks list with "Upcoming" callout
*            Home          fallback
```

`App.tsx` layout:

- `<WindBackground />` and `<LegoGene />` sit **outside** `<Routes>` so they persist across navigation.
- `<Nav />` is sticky at the top, also outside `<Routes>`.
- `<ScrollToTop />` resets scroll to 0 on every `pathname` change.
- Pages render inside `<main className="page">` (640px reading column, padding clamped).

**Adding a new page:** create `src/pages/NewPage.tsx`, add a `<Route>` in `App.tsx`, and add an entry to the `items` array in `src/components/Nav.tsx`. Nothing else.

## Section skeleton

Every content section across all pages uses the same shape so motion + a11y stay consistent:

```tsx
<Reveal>
  <section aria-labelledby="X-h">
    <h2 id="X-h">Title</h2>
    {/* content */}
  </section>
</Reveal>
```

Hero is the exception — above-the-fold, so it uses scroll-parallax `<motion.img>` instead of `Reveal`. Page heads (`<header className="page-head">`) on non-home pages share a common style: dateline, h1, lede.

## Data-driven content

All lists live in typed modules in `src/data/`:

```text
projects.ts    Project cards    (technical, NOT podcast/newsletter)
writings.ts    Newsletter + podcast detail
career.ts      Career roles + cityCoords (NYC, NJ, PGH) for the SVG map
speaking.ts    Talks + upcoming flag
expertise.ts   Subject-matter expertise groups + tenureYears banner
events.ts      Connectathons + hackathons
passions.ts    6 entries (3 professional + 3 personal)
travels.ts    28 photo entries + ALBUM_URL
socials.ts    Outbound links
```

`src/data/data.test.ts` enforces shape integrity across all of these (truthy fields, URL formats, balanced kind counts, etc.). When adding a new data file, add an integrity test too — `vi.spyOn` isn't needed, just `expect()` over the array.

Bio prose, Hero copy, and the contact intro live **inline** in their components — unique enough not to abstract.

## Reduced-motion contract

Every motion source gates on framer-motion's `useReducedMotion()`. There are five now:

- `Reveal` — returns `<>{children}</>` unwrapped when reduced
- `WindBackground` — renders `<div className="wind-bg fallback">` (static gradient) instead of the canvas
- `Hero` parallax — `useTransform` output range collapses to `[0, 0]`
- `Travels` polaroid stagger + tilt — `variants={reduce ? undefined : {...}}`, `style={{ rotate: reduce ? 0 : tilt }}`
- `LegoGene` walk loop — early `return` from the effect that drives the animation
- `USMap` — pin pop-in transitions and the dotted journey-path `pathLength` animation collapse to instant when reduced

When adding new animation, follow the same pattern. Never animate unconditionally.

## WindBackground fallback chain

3 layers, all falling through to the same gradient div: reduced motion → `canvas.getContext('webgl')` returns null → `buildProgram` returns null. DPR clamped to 2, rAF capped to ~60fps, paused on `document.hidden`, cleans up program/buffer/ResizeObserver/RAF on unmount.

## Visual breakouts

The 640px reading column is preserved for text. Several elements deliberately break out with negative side margins:

- `.hero-photo` — up to 800px wide with `margin: 0 -80px` on desktop (collapses at ≤800px viewport)
- `.travels-grid` — `margin: 2em -120px 1.4em` for the polaroid scrapbook (stepped breakpoints at 1024/960/540)
- `.us-map` — same `-120px` breakout pattern as travels-grid for the career map

Don't grep for `max-width: 640px` to set responsive behavior here — relevant breakpoints are 800px (hero), 1024/960/540 (travels grid + map).

## Notable components

- **`Nav.tsx`** — sticky top nav. Uses `NavLink` with `end` for the home route (so non-home routes don't keep `/` highlighted). Active state via the `className` callback `({ isActive }) => ...`.
- **`USMap.tsx`** — hand-traced SVG outline of the contiguous U.S. East. Hardcoded `USA_PATH` constant; **do not regenerate from a real GeoJSON** — the stylized look is intentional. Takes `activeCity` + `onCityHover`. Career timeline cards sync to it bidirectionally (`useState<City | null>` in `CareerPage`).
- **`LegoGene.tsx`** — fixed `position: fixed; bottom: 12px; left: 0` SVG minifigure. Walks side-to-side via `useAnimationControls()`, hops every ~4.2s, flips 360° on click. The animation loop is in a `useEffect` with `alive` flag for cleanup.
- **`Travels.tsx`** — polaroid scatter. `tiltFor(i)` is a deterministic LCG-derived rotation (-6° to +6°) so each photo's tilt is stable across renders but the scatter looks organic.

## Testing

- `vite.config.ts` imports `defineConfig` from `"vitest/config"` (**not** `"vite"`) so the `test` block type-checks. Don't "fix" this.
- `src/test-setup.ts` polyfills `IntersectionObserver` because framer-motion's `whileInView` needs it under jsdom.
- To mock framer-motion's `useReducedMotion`, use `vi.mock("framer-motion", async () => { const actual = await vi.importActual<typeof import("framer-motion")>("framer-motion"); return { ...actual, useReducedMotion: vi.fn() }; })`. **Don't** try to mock via `Object.defineProperty(window, "matchMedia", ...)` — framer-motion caches the value internally and the mock won't take effect.
- Component tests (`Reveal.test.tsx`, `WindBackground.test.tsx`) verify behavior contracts. The rest of the suite is data-shape integrity in `src/data/data.test.ts`.

## Assets — the hard-won rule

**Never commit raw HEIC, MOV, or other binary originals to the repo.** They are explicitly gitignored AND vercelignored after one near-miss where iCloud Drive re-synced a 6 GB `public/travels/work travels/` folder back onto disk after I had deleted it. The patterns:

```text
# .gitignore + .vercelignore
public/main.HEIC
public/travels/work travels/
*.HEIC
*.MOV
```

The shipped assets are derivatives: `public/headshot.jpg` (1200×900, ~400 KB) and `public/travels/01.jpg`…`28.jpg` (≤1600px long edge, JPEG q80, ~500 KB each). Convert + size with `sips`:

```bash
sips -s format jpeg -s formatOptions 80 -Z 1600 input.HEIC --out output.jpg
sips -g pixelWidth -g pixelHeight output.jpg   # for travels.ts width/height
```

After adding photos, update `src/data/travels.ts` with intrinsic `width`/`height` — the data integrity test asserts presence, and they're required to prevent CLS.

## Deploy

Vercel project is already linked (`.vercel/project.json`). Connected to GitHub for push-to-deploy. To deploy from CLI: `vercel --prod`. The Vercel CLI on this machine may be older than current; `vercel domains add <domain> <project>` syntax has varied between versions — use `vercel alias set <deployment> <domain>` to attach domains to specific deployments if `domains add` fails.

`eugenevestel.com` is the custom production domain (Vercel-registered, Vercel nameservers, attached via alias). After every `vercel --prod`, **re-set the apex alias explicitly** — Vercel sometimes only auto-promotes `www.*` and not the apex:

```bash
vercel alias set <new-deployment> eugenevestel.com
```

If the domain returns the Vercel SSO login wall instead of the site, the team has Vercel Authentication enabled at the team level — change "Deployment Protection" in project settings to "Only Preview Deployments" to make production public.

`vercel.json` declares the SPA rewrite (`{ "source": "/(.*)", "destination": "/" }`) so deep links like `/career` resolve client-side. Don't remove it.

## Plans and specs

`docs/superpowers/specs/` and `docs/superpowers/plans/` hold the original design spec and 14-task implementation plan from the initial single-page build. Useful as historical context; the multi-page restructure and later content additions aren't documented there.
