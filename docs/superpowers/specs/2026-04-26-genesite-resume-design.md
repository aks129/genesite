# Genesite — Resume Site Design

Personal resume site for Eugene Vestel. Single-page React app with a fabric-shader wind background, headshot, project highlights, passions, work-travel gallery, and contact info.

## Goals

- Distinctive, editorial-quality personal site that does not look AI-generated.
- Conveys both professional gravity (healthcare-data executive, FHIR, AI) and personal warmth (family, travel, fishing).
- Pure black-and-white minimalist aesthetic with one quiet motion element (the wind background).
- Loads fast, deploys static to Vercel, and is easy to update by editing TS data files.

## Non-goals

- No CMS, blog engine, or MDX. External writing lives on Substack and is linked out.
- No contact form. Direct mailto only.
- No accent color. No badges, cards-with-shadows, or animated reveals beyond the wind background and quiet scroll fade-ins.
- No third-party analytics, tag managers, or trackers.

## Stack

- **Build:** Vite + React 18 + TypeScript.
- **Animation:** framer-motion for scroll-into-view fades; custom WebGL fragment shader for the wind background (no shader library — ~80 lines of GLSL).
- **Styling:** Plain CSS in `src/styles.css` (no Tailwind, no CSS-in-JS). CSS custom properties for tokens.
- **Hosting:** Vercel (static SPA). No server runtime.

## File layout

```text
genesite/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── public/
│   ├── headshot.jpg              # user-supplied
│   └── travels/                  # user-supplied, 6–12 favorites from Google album
│       ├── 01.jpg
│       ├── 02.jpg
│       └── ...
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── styles.css
    ├── components/
    │   ├── WindBackground.tsx
    │   ├── Hero.tsx
    │   ├── About.tsx
    │   ├── Projects.tsx
    │   ├── Passions.tsx
    │   ├── Travels.tsx
    │   ├── Contact.tsx
    │   ├── Socials.tsx
    │   └── Reveal.tsx            # framer-motion scroll-fade wrapper
    └── data/
        ├── projects.ts
        ├── passions.ts
        ├── travels.ts            # filenames + alt text for gallery
        └── socials.ts
```

## Design tokens

```css
:root {
  --paper:     #FFFFFF;
  --ink:       #0A0A0A;
  --mute:      #6B6B6B;
  --faint:     #9A9A9A;
  --rule:      #E5E5E5;
  --underline: #C9C9C9;
  --selection: #EDEDED;

  --serif: "Newsreader", "Source Serif Pro", Charter, Cambria, Georgia, serif;

  --measure: 640px;     /* main content column */
  --gutter: clamp(24px, 5vw, 40px);
}
```

**Breakpoints** (used uniformly across all sections):

- `≤640px` — mobile: single column, hero stacks, passions/travels collapse to 1 col.
- `641–960px` — tablet: travels masonry = 2 cols, passions still 2 cols, hero side-by-side.
- `≥961px` — desktop: travels masonry = 3 cols.

No accent color. Links are underlined; on hover the underline thickens from 1px to 2px and the underline color goes from `--underline` to `--ink`. No color change.

## Typography

- **Family:** Newsreader (Google Fonts) for everything. Loaded with `display=swap` and weights 400, 500, 600 plus italic 400/500.
- **Sizes:** body 19px / 1.65; lede 21px / 1.55; H1 clamp(34px, 5vw, 44px); H2 13px uppercase tracked.
- **Variable axes:** Newsreader is variable; use `font-variation-settings: "opsz" <size>` to tune optical size for headlines vs body.

## Wind background

A full-viewport `<canvas>` fixed at `z-index: -1`, rendered with a single WebGL fragment shader.

**Visual:** very faint horizontal bands of value-noise that drift left-to-right and slowly distort, like fabric in a slow wind. Color range `#F4F4F4` to `#FAFAFA` over the `#FFFFFF` paper. The motion is intentionally subtle — at a glance the page looks static; only sustained attention reveals movement.

**Implementation:**

- Single full-screen triangle (no geometry buffer needed).
- Fragment shader: layered simplex/value noise, time-driven UV displacement, output is a near-white grayscale.
- `requestAnimationFrame` loop. Time uniform in seconds.
- Resize observer updates the canvas size and viewport uniform.
- DPR clamped to `Math.min(devicePixelRatio, 2)` to keep fragment cost down on retina.
- Pause when `document.hidden` (page-visibility API).
- If `prefers-reduced-motion: reduce` OR WebGL is unavailable, render a static CSS gradient instead and skip mounting the canvas entirely.

**Performance budget:** must hold 60fps on a 2020 MacBook Air at 1440×900. Shader complexity should be tuned down (fewer noise octaves) before sacrificing this.

## Sections (in scroll order)

### 1. Hero

- Two-column on desktop, stacked on mobile (≤640px).
- Left: round-cropped 220px headshot (`public/headshot.jpg`), 1px `--rule` border.
- Right: dateline ("Pittsburgh, Pennsylvania · April 2026"), H1 name "Eugene Vestel", lede sentence ("I work on healthcare data — mostly the parts where standards, AI, and human judgment have to meet.").
- 4–8px parallax on the headshot tied to scroll position.

### 2. About Me

- The four bio paragraphs from the reference HTML (Outcomes role, FHIR IQ, prior roles at b.well/UPMC/AHN, MBA).
- Lightly tightened for the new format. Numbers stay in prose ($180M, 50,000+ pharmacies, 300+ exchanges, $18B, etc.).

### 3. Projects

- H2 "Projects".
- Stacked entries (no cards), each entry = italic project name (linked) + em-dash + one-paragraph description.
- Initial entries: HealthClaw, Smart Health Connect, FHIR Builders, AI NPI, *Out of the FHIR* podcast, *FHIR IQ Playbook* newsletter.
- Data lives in `src/data/projects.ts` as a typed array, so adding a project is one object literal.

### 4. Passions

- H2 "Passions".
- Two-column grid on desktop, single column on mobile.
- Six short paragraphs (~50 words each), each with a one-line italic title and 2–3 sentences of prose:
  - **Professional:** FHIR / interoperability, AI safety in clinical contexts, building the Pittsburgh Health Analytics community.
  - **Personal:** travel with Stacy, sports & fishing with the kids, music + history & reading.
- Data lives in `src/data/passions.ts`.

### 5. Work Travels

- H2 "Work Travels".
- Lead paragraph (1–2 sentences) framing the gallery.
- Masonry grid (CSS columns, 3 cols desktop / 2 tablet / 1 mobile) of self-hosted JPEGs from `public/travels/`. Subtle hover lift (translateY -2px, transition 180ms).
- Each photo loads with `loading="lazy"` and a stable aspect ratio derived from intrinsic dimensions to prevent layout shift.
- Below the grid, one quiet link: "See the full album on Google Photos →" pointing to `https://photos.app.goo.gl/REpyEw2T14UsGcju8`.
- Photos staggered into view (50ms apart) when the gallery enters the viewport.
- Filenames + alt text live in `src/data/travels.ts`.

### 6. Get in Touch

- H2 "Get in Touch".
- One large mailto link to `eugene.vestel@gmail.com`, set in display weight.
- One sentence below it: "I read everything; I respond to most things within a week."
- No form.

### 7. Socials

- H2 "Socials".
- Plain text list, one per line: LinkedIn, GitHub, Substack, Spotify, Apple Podcasts, YouTube. URLs from the reference HTML.
- Data lives in `src/data/socials.ts`.

### Footer (colophon)

- Single line: "© 2026 Eugene Vestel. Pittsburgh, Pennsylvania." (Year computed at runtime.)

## Motion system

- `Reveal` component wraps section content. On mount-into-viewport (framer-motion `whileInView`, `viewport={{ once: true, margin: "-80px" }}`), child fades from opacity 0 / translateY 12px to opacity 1 / translateY 0 over 600ms, ease `[0.22, 1, 0.36, 1]`.
- Travel photos use the same primitive but with a 50ms stagger via `staggerChildren`.
- Headshot parallax: framer-motion `useScroll` + `useTransform`, 0–8px translateY across the first 100vh.
- All motion is gated on `prefers-reduced-motion`. When reduced motion is set, the `Reveal` wrapper renders children directly with no animation, the parallax transform is identity, and the wind canvas is replaced by a static gradient.

## Accessibility

- Semantic landmarks: `<main>`, `<section aria-labelledby="...">` for each H2, `<footer>`.
- Headshot has descriptive alt text ("Eugene Vestel, head and shoulders, dark blazer over light blue shirt").
- Travel images each have alt text in `travels.ts` (location/subject).
- Wind canvas has `aria-hidden="true"` and `role="presentation"`.
- Color contrast: `--ink` on `--paper` is ~20:1; `--mute` on `--paper` is ~5.7:1 — both pass WCAG AA at body size.
- Visible focus styles on every interactive element (2px outline in `--ink`, 2px offset).
- Page works without JavaScript: the static markup is the same HTML; only the wind background and scroll-fade animations require JS.

## Data files

Each section that lists items pulls from a typed TS module so adding/removing/reordering content is a one-object edit:

- `projects.ts` — `{ name, href?, description }[]`
- `passions.ts` — `{ kind: "professional" | "personal", title, body }[]`
- `travels.ts` — `{ src, alt, width, height }[]`
- `socials.ts` — `{ label, href }[]`

Bio paragraphs in About and the Hero copy live inline in their components — they are unique enough that abstracting them into data buys nothing.

## Asset handling

- Headshot: user drops `public/headshot.jpg` (recommended 600×600, square, ≤200KB). Component references it as `/headshot.jpg`.
- Travel photos: user downloads 6–12 favorites from `https://photos.app.goo.gl/REpyEw2T14UsGcju8`, resizes to ≤1600px on the long edge and ≤300KB each, names them `01.jpg` … `NN.jpg`, and lists them in `src/data/travels.ts` with alt text + intrinsic width/height.
- Fonts loaded from Google Fonts CDN, preconnected.
- No build-time image processing, no `next/image` analog. Plain `<img>` with `loading="lazy"`, `decoding="async"`, and `width`/`height` attributes for CLS protection.

## Build & deploy

- `npm run dev` — Vite dev server.
- `npm run build` — emits static `dist/`.
- `npm run preview` — local preview of the build.
- Vercel: framework preset = Vite, output = `dist`, no env vars needed.

## Browser support

Modern evergreen browsers (last 2 versions of Chrome, Edge, Firefox, Safari). WebGL1 fallback to gradient. No IE.

## Open items the user must provide before launch

- `public/headshot.jpg` (the attached photo, saved to that path).
- `public/travels/*.jpg` (downloaded from the Google album, ≤12 files).
- Alt text for each travel photo (or I'll write generic ones from filenames).
