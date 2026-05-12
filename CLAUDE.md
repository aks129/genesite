# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Eugene Vestel's personal site. Static single-page Vite + React 18 + TypeScript SPA with a custom WebGL fragment-shader background. Deployed at `eugenevestel.com` (Vercel, project `aks129s-projects/genesite`, connected to GitHub `aks129/genesite`). Pushes to `main` auto-deploy to production.

## Commands

```bash
npm run dev            # Vite dev server on :5173
npm run build          # tsc -b && vite build  (both must succeed)
npm run preview        # serve the built dist/ locally
npm test               # vitest run --passWithNoTests
npm run test:watch
npm test -- Reveal     # run a single test file by name fragment
```

`npm run build` uses TypeScript project references (`tsc -b`), which emits sibling `vite.config.js`, `vite.config.d.ts`, and `*.tsbuildinfo` files. These are gitignored — leave them alone.

## Architecture

**Section composition.** `src/App.tsx` is the one place sections compose; they render top-to-bottom inside `<main className="page">` (640px reading column). `WindBackground` and `LegoGene` live outside `<main>` as fixed-position overlays.

**Section skeleton.** Every content section (About, Projects, Passions, Travels, Contact, Socials) follows the same shape:

```tsx
<Reveal>
  <section aria-labelledby="X-h">
    <h2 id="X-h">Title</h2>
    {/* content */}
  </section>
</Reveal>
```

Hero is the exception — it's above the fold so it uses a scroll-parallax `<motion.img>` instead of `Reveal`.

**Data-driven content.** Lists live in `src/data/{projects,passions,travels,socials}.ts` as typed arrays. Section components map over them; adding an entry is one object literal. `src/data/data.test.ts` enforces shape integrity (e.g. travels src matches `/^\/travels\/.+\.(jpg|jpeg|png|webp)$/i`, passions are 3 professional + 3 personal). Bio prose lives inline in `About.tsx` — it's unique enough not to abstract.

**Reduced-motion contract.** Every motion source gates on framer-motion's `useReducedMotion()`. There are four:
- `Reveal` (src/components/Reveal.tsx) — returns `<>{children}</>` unwrapped when reduced
- `WindBackground` — renders `<div className="wind-bg fallback">` (static gradient) instead of the canvas
- `Hero` parallax — `useTransform` output range collapses to `[0, 0]`
- `Travels` stagger + `LegoGene` walk loop — `variants={reduce ? undefined : {...}}` / early `return`

When adding new animation, follow the same pattern. Never animate unconditionally.

**WindBackground fallback chain.** 3 layers, all falling through to the same gradient div: reduced motion → `canvas.getContext('webgl')` returns null → `buildProgram` returns null. DPR clamped to 2, rAF capped to ~60fps, paused on `document.hidden`, cleans up program/buffer/RO/RAF on unmount.

**Visual breakouts.** The 640px reading column is preserved for text. Two sections break out with negative side margins:
- `.hero-photo` — up to 800px wide with `margin: 0 -80px` on desktop (collapses at ≤800px viewport)
- `.travels-grid` — `margin: 2em -120px 1.4em` for the polaroid scrapbook, with stepped breakpoints

Don't grep for `max-width: 640px` to set responsive behavior here — breakpoints are 800px (hero), 1024/960/540 (travels grid).

## Testing

- `vite.config.ts` imports `defineConfig` from `"vitest/config"` (not `"vite"`) so the `test` block type-checks. Don't "fix" this.
- `src/test-setup.ts` polyfills `IntersectionObserver` because framer-motion's `whileInView` needs it under jsdom.
- To mock framer-motion's `useReducedMotion`, use `vi.mock("framer-motion", async () => { const actual = await vi.importActual<typeof import("framer-motion")>("framer-motion"); return { ...actual, useReducedMotion: vi.fn() }; })`. Don't try to mock via `Object.defineProperty(window, "matchMedia", ...)` — framer-motion caches the value internally and the mock won't take effect.

## Assets

`public/headshot.jpg` (~1200×900, displayed at natural aspect ratio, not cropped) and `public/travels/01.jpg` … `28.jpg` (~1600px on the long edge, JPEG q80). Travel photos are originally HEIC from iPhone — convert with `sips`:

```bash
sips -s format jpeg -s formatOptions 80 -Z 1600 input.HEIC --out output.jpg
sips -g pixelWidth -g pixelHeight output.jpg   # get dimensions for travels.ts
```

After adding photos, update `src/data/travels.ts` with intrinsic `width`/`height` (data test enforces presence). Never commit `.MOV` or other large binaries to `public/` — Vite copies the whole tree into `dist/`.

## Deploy

Vercel project is already linked (`.vercel/project.json`). Connected to GitHub for push-to-deploy. To deploy from CLI: `vercel --prod`. The Vercel CLI on this machine may be older than current; `vercel domains add <domain> <project>` syntax has varied between versions — use `vercel alias set <deployment> <domain>` to attach domains to specific deployments if `domains add` fails.

`eugenevestel.com` is the custom production domain (registered through Vercel, Vercel nameservers, attached via alias). If the domain returns the Vercel SSO login wall instead of the site, the team has Vercel Authentication enabled — change "Deployment Protection" in project settings to "Only Preview Deployments" to make production public.

## Plans and specs

`docs/superpowers/specs/` and `docs/superpowers/plans/` hold the original design spec and 14-task implementation plan. Useful as historical context for "why is this structured this way" questions; not used at runtime.
