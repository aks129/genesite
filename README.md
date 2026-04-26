# genesite

Eugene Vestel's personal site. Vite + React + TypeScript single-page app with a WebGL fabric-shader background.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Test

```bash
npm test
```

## Deploy

Push to GitHub and import the repo in Vercel. Framework preset: Vite. No env vars required.

## Editing content

- **Bio paragraphs:** `src/components/About.tsx`
- **Hero copy:** `src/components/Hero.tsx`
- **Projects list:** `src/data/projects.ts`
- **Passions list:** `src/data/passions.ts`
- **Travel photos list:** `src/data/travels.ts`
- **Socials list:** `src/data/socials.ts`

## Assets you must drop in

- `public/headshot.jpg` — square, ~600×600, ≤200KB.
- `public/travels/01.jpg` … — 6–12 favorites from your Google Photos album, resized to ≤1600px on the long edge and ≤300KB each. Update `src/data/travels.ts` with the matching filenames, alt text, and intrinsic width/height. Get dimensions with `sips -g pixelWidth -g pixelHeight public/travels/01.jpg`.

## Design tokens

```css
--paper:     #FFFFFF;
--ink:       #0A0A0A;
--mute:      #6B6B6B;
--rule:      #E5E5E5;
```

Pure black-and-white minimalist, no accent color.
