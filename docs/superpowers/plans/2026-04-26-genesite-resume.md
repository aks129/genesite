# Genesite Resume Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Eugene Vestel's personal resume site as a single-page Vite + React app with a WebGL fabric-shader wind background, headshot, project highlights, passions, work-travel gallery, and contact info.

**Architecture:** Static SPA. One `App.tsx` composes seven sections. A fixed-position WebGL canvas runs a value-noise fragment shader behind everything. Section copy lives inline; lists (projects, passions, travels, socials) live in typed data modules so adding entries is one object literal. All motion gates on `prefers-reduced-motion`. Deploys to Vercel as a static build.

**Tech Stack:** Vite 5, React 18, TypeScript 5, framer-motion 11, Vitest + @testing-library/react for the few bits of logic that warrant tests. Plain CSS (no Tailwind, no CSS-in-JS). Newsreader from Google Fonts.

**Spec:** [docs/superpowers/specs/2026-04-26-genesite-resume-design.md](../specs/2026-04-26-genesite-resume-design.md)

---

## File Structure

After implementation, the repo will look like this:

```text
genesite/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
├── README.md
├── public/
│   ├── headshot.jpg              ← user drops in (Task 14)
│   └── travels/                  ← user drops in (Task 14)
│       └── .gitkeep
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── styles.css
    ├── vite-env.d.ts
    ├── components/
    │   ├── Reveal.tsx
    │   ├── Reveal.test.tsx
    │   ├── WindBackground.tsx
    │   ├── WindBackground.test.tsx
    │   ├── Hero.tsx
    │   ├── About.tsx
    │   ├── Projects.tsx
    │   ├── Passions.tsx
    │   ├── Travels.tsx
    │   ├── Contact.tsx
    │   ├── Socials.tsx
    │   └── Footer.tsx
    └── data/
        ├── projects.ts
        ├── passions.ts
        ├── travels.ts
        ├── socials.ts
        └── data.test.ts
```

Each component file contains exactly one section component and its local helpers. Data files export typed arrays only — no JSX.

---

## Task 1: Scaffold Vite + React + TS, install deps, configure tooling

**Files:**

- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/vite-env.d.ts`
- Create: `.gitignore`

- [ ] **Step 1: Initialize package.json**

Create `package.json`:

```json
{
  "name": "genesite",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "framer-motion": "^11.18.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "jsdom": "^25.0.1",
    "typescript": "^5.6.3",
    "vite": "^5.4.11",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Expected: `node_modules/` populated, `package-lock.json` created, no peer-dep errors.

- [ ] **Step 3: Create tsconfig.json**

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 4: Create tsconfig.node.json**

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 5: Create vite.config.ts**

Create `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
  },
});
```

- [ ] **Step 6: Create test setup**

Create `src/test-setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 7: Create index.html**

Create `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Eugene Vestel</title>
    <meta name="description" content="Eugene Vestel — Senior Lead for Payer Interoperability, Analytics & AI at Outcomes. Founder of FHIR IQ. Host of Out of the FHIR." />
    <meta property="og:title" content="Eugene Vestel" />
    <meta property="og:description" content="I work on healthcare data — mostly the parts where standards, AI, and human judgment have to meet." />
    <meta property="og:type" content="website" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 8: Create src/vite-env.d.ts**

Create `src/vite-env.d.ts`:

```ts
/// <reference types="vite/client" />
```

- [ ] **Step 9: Create src/main.tsx and stub App.tsx**

Create `src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

Create `src/App.tsx`:

```tsx
export default function App() {
  return <main>genesite</main>;
}
```

Create `src/styles.css`:

```css
/* tokens + base styles land in Task 2 */
body { margin: 0; font-family: system-ui, sans-serif; }
```

- [ ] **Step 10: Create .gitignore**

Create `.gitignore`:

```text
node_modules
dist
*.local
.DS_Store
.vite
coverage
```

- [ ] **Step 11: Verify dev server boots**

Run: `npm run dev`
Expected: Vite prints a local URL (e.g. `http://localhost:5173`) and visiting it shows the word "genesite" with no console errors. Stop the dev server (`Ctrl+C`).

- [ ] **Step 12: Verify type check and build pass**

Run: `npm run build`
Expected: `tsc -b` succeeds, Vite emits `dist/index.html` and `dist/assets/`.

- [ ] **Step 13: Verify test runner works**

Run: `npm test`
Expected: Vitest reports "No test files found" (success — runner is wired up correctly).

- [ ] **Step 14: Commit**

```bash
git add package.json package-lock.json tsconfig.json tsconfig.node.json vite.config.ts index.html src/main.tsx src/App.tsx src/styles.css src/test-setup.ts src/vite-env.d.ts .gitignore
git commit -m "chore: scaffold Vite + React + TS project"
```

---

## Task 2: Base styles — tokens, typography, reset

**Files:**

- Modify: `src/styles.css`

- [ ] **Step 1: Replace styles.css with the full base stylesheet**

Replace the contents of `src/styles.css`:

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

  --measure: 640px;
  --gutter: clamp(24px, 5vw, 40px);
}

*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
html { -webkit-text-size-adjust: 100%; }

body {
  background: var(--paper);
  color: var(--ink);
  font-family: var(--serif);
  font-size: 19px;
  line-height: 1.65;
  font-weight: 400;
  font-variation-settings: "opsz" 18;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
}

::selection { background: var(--selection); color: var(--ink); }

.page {
  max-width: var(--measure);
  margin: 0 auto;
  padding: clamp(48px, 9vw, 110px) var(--gutter) 100px;
  position: relative;
  z-index: 1;
}

p { margin: 0 0 1.1em; hanging-punctuation: first last; }
p strong { font-weight: 600; color: var(--ink); }
em { font-style: italic; }

h1 {
  font-family: var(--serif);
  font-weight: 600;
  font-size: clamp(34px, 5vw, 44px);
  line-height: 1.1;
  letter-spacing: -0.015em;
  margin: 0 0 24px;
  font-variation-settings: "opsz" 60;
}

h2 {
  font-family: var(--serif);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--mute);
  margin: 4em 0 1.4em;
  padding-top: 2.2em;
  border-top: 1px solid var(--rule);
  font-variation-settings: "opsz" 14;
}

a {
  color: inherit;
  text-decoration: underline;
  text-decoration-color: var(--underline);
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  transition: text-decoration-color 0.15s ease, text-decoration-thickness 0.15s ease;
}
a:hover {
  text-decoration-color: var(--ink);
  text-decoration-thickness: 2px;
}

a:focus-visible, button:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: 2px;
  border-radius: 2px;
}

.lede {
  font-size: 21px;
  line-height: 1.55;
  margin: 0 0 1.6em;
  font-variation-settings: "opsz" 24;
}

.dateline {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--faint);
  margin-bottom: 24px;
  font-variation-settings: "opsz" 14;
}
.dateline .sep { margin: 0 8px; opacity: 0.5; }

@media print {
  body { background: white; color: black; }
  a { color: black; text-decoration: underline; }
  h2 { page-break-after: avoid; }
}
```

- [ ] **Step 2: Verify dev server still renders**

Run: `npm run dev`
Expected: Browser shows "genesite" in Newsreader serif at 19px on white background. Check fonts.googleapis.com loads in Network tab. Stop the server.

- [ ] **Step 3: Commit**

```bash
git add src/styles.css
git commit -m "feat(styles): base tokens, typography, reset"
```

---

## Task 3: Reveal motion wrapper with reduced-motion gating

**Files:**

- Create: `src/components/Reveal.tsx`
- Create: `src/components/Reveal.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/Reveal.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import Reveal from "./Reveal";

function setReducedMotion(reduced: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("reduce") && reduced,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("Reveal", () => {
  beforeEach(() => {
    setReducedMotion(false);
  });

  it("renders children", () => {
    render(<Reveal><p>hello</p></Reveal>);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("renders children unwrapped when reduced motion is requested", () => {
    setReducedMotion(true);
    const { container } = render(<Reveal><p data-testid="kid">hi</p></Reveal>);
    expect(screen.getByTestId("kid")).toBeInTheDocument();
    // No motion wrapper element when reduced
    expect(container.querySelector("[style*='opacity']")).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Reveal`
Expected: FAIL with module-not-found error for `./Reveal`.

- [ ] **Step 3: Implement Reveal**

Create `src/components/Reveal.tsx`:

```tsx
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
};

export default function Reveal({ children, delay = 0 }: Props) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- Reveal`
Expected: PASS, both tests green.

- [ ] **Step 5: Commit**

```bash
git add src/components/Reveal.tsx src/components/Reveal.test.tsx
git commit -m "feat(motion): Reveal wrapper with reduced-motion gating"
```

---

## Task 4: WindBackground — WebGL fabric shader with reduced-motion fallback

**Files:**

- Create: `src/components/WindBackground.tsx`
- Create: `src/components/WindBackground.test.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Add background styles**

Append to `src/styles.css`:

```css
.wind-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}
.wind-bg canvas { display: block; width: 100%; height: 100%; }
.wind-bg.fallback {
  background: linear-gradient(180deg, #FFFFFF 0%, #F8F8F8 50%, #FFFFFF 100%);
}
```

- [ ] **Step 2: Write the failing test**

Create `src/components/WindBackground.test.tsx`:

```tsx
import { render } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import WindBackground from "./WindBackground";

function setReducedMotion(reduced: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("reduce") && reduced,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("WindBackground", () => {
  beforeEach(() => setReducedMotion(false));

  it("renders a fallback div when reduced motion is requested", () => {
    setReducedMotion(true);
    const { container } = render(<WindBackground />);
    const node = container.querySelector(".wind-bg.fallback");
    expect(node).not.toBeNull();
    expect(container.querySelector("canvas")).toBeNull();
  });

  it("renders a fallback div when WebGL is unavailable (jsdom)", () => {
    // jsdom does not support WebGL — getContext('webgl') returns null
    const { container } = render(<WindBackground />);
    expect(container.querySelector(".wind-bg")).not.toBeNull();
    // Either canvas mounted (if env had WebGL) or fallback class present
    const fallback = container.querySelector(".wind-bg.fallback");
    expect(fallback).not.toBeNull();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- WindBackground`
Expected: FAIL with module-not-found.

- [ ] **Step 4: Implement WindBackground**

Create `src/components/WindBackground.tsx`:

```tsx
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = (a_pos + 1.0) * 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;
varying vec2 v_uv;
uniform float u_time;
uniform vec2 u_res;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = v_uv;
  uv.x *= u_res.x / u_res.y;

  float t = u_time * 0.04;
  vec2 q = vec2(fbm(uv * 1.2 + vec2(t, 0.0)), fbm(uv * 1.2 + vec2(0.0, t)));
  float f = fbm(uv * 2.5 + q * 1.8 + vec2(t * 0.3, t * 0.5));

  // Map to a very narrow near-white band
  float v = mix(0.957, 0.980, smoothstep(0.3, 0.7, f));
  gl_FragColor = vec4(v, v, v, 1.0);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

function buildProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const vs = compileShader(gl, gl.VERTEX_SHADER, VERT);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export default function WindBackground() {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) {
      setSupported(false);
      return;
    }
    setSupported(true);

    const program = buildProgram(gl);
    if (!program) {
      setSupported(false);
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // Single full-screen triangle
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_res");

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas || !gl) return;
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    }
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    const start = performance.now();
    let lastDraw = 0;

    function frame(now: number) {
      if (!gl) return;
      if (document.hidden) {
        raf = requestAnimationFrame(frame);
        return;
      }
      // Cap to ~60fps to match the page motion budget in the spec.
      if (now - lastDraw >= 16) {
        lastDraw = now;
        gl.uniform1f(uTime, (now - start) / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, [reduce]);

  if (reduce || supported === false) {
    return <div className="wind-bg fallback" aria-hidden="true" role="presentation" />;
  }
  return (
    <div className="wind-bg" aria-hidden="true" role="presentation">
      <canvas ref={canvasRef} />
    </div>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- WindBackground`
Expected: PASS. (jsdom returns null from `getContext('webgl')`, which trips the `setSupported(false)` branch and renders the fallback.)

- [ ] **Step 6: Run full test suite**

Run: `npm test`
Expected: All tests pass (Reveal + WindBackground).

- [ ] **Step 7: Commit**

```bash
git add src/components/WindBackground.tsx src/components/WindBackground.test.tsx src/styles.css
git commit -m "feat(bg): WebGL fabric-shader wind background with reduced-motion fallback"
```

---

## Task 5: Data layer — projects, passions, travels, socials

**Files:**

- Create: `src/data/projects.ts`
- Create: `src/data/passions.ts`
- Create: `src/data/travels.ts`
- Create: `src/data/socials.ts`
- Create: `src/data/data.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/data/data.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { projects } from "./projects";
import { passions } from "./passions";
import { travels } from "./travels";
import { socials } from "./socials";

describe("data integrity", () => {
  it("projects have a name and description", () => {
    expect(projects.length).toBeGreaterThan(0);
    for (const p of projects) {
      expect(p.name).toBeTruthy();
      expect(p.description).toBeTruthy();
      if (p.href) expect(p.href).toMatch(/^https?:\/\//);
    }
  });

  it("passions have kind, title, body, and a balanced mix", () => {
    expect(passions.length).toBe(6);
    const kinds = passions.map(p => p.kind);
    expect(kinds.filter(k => k === "professional")).toHaveLength(3);
    expect(kinds.filter(k => k === "personal")).toHaveLength(3);
    for (const p of passions) {
      expect(p.title).toBeTruthy();
      expect(p.body.length).toBeGreaterThan(40);
    }
  });

  it("travels reference files in /travels/ with alt text and intrinsic dimensions", () => {
    for (const t of travels) {
      expect(t.src).toMatch(/^\/travels\/.+\.(jpg|jpeg|png|webp)$/i);
      expect(t.alt).toBeTruthy();
      expect(t.width).toBeGreaterThan(0);
      expect(t.height).toBeGreaterThan(0);
    }
  });

  it("socials have label and absolute href (or mailto)", () => {
    expect(socials.length).toBeGreaterThanOrEqual(3);
    for (const s of socials) {
      expect(s.label).toBeTruthy();
      expect(s.href).toMatch(/^(https?:\/\/|mailto:)/);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- data`
Expected: FAIL with module-not-found errors.

- [ ] **Step 3: Implement data files**

Create `src/data/projects.ts`:

```ts
export type Project = {
  name: string;
  href?: string;
  description: string;
};

export const projects: Project[] = [
  {
    name: "HealthClaw",
    href: "https://healthclaw.io",
    description:
      "A security layer between AI agents and clinical data. Redacts PHI on every read; enforces multi-step human approval for clinical writes — proposal, permission evaluation, HMAC confirmation, immutable audit log. Twelve MCP tools. FHIR R4/R6, US Core v9.",
  },
  {
    name: "Smart Health Connect",
    description:
      "A SMART-on-FHIR patient records platform that aggregates data from Epic, Cerner, and other EHRs into a single secure interface. The data layer HealthClaw agents work against.",
  },
  {
    name: "FHIR Builders",
    href: "https://fhirbuilders.com",
    description:
      "A companion site for the implementer community — patterns, examples, and small tools for people doing the actual FHIR work.",
  },
  {
    name: "AI NPI",
    href: "https://ainpi.dev",
    description:
      "An experiment in identity for AI agents operating in healthcare contexts. Early, opinionated, and small.",
  },
  {
    name: "Out of the FHIR",
    href: "https://evestel.substack.com/",
    description:
      "A podcast where healthcare data gets real. Twenty-five episodes in, with HL7 work-group chairs, founders, and CMS policy makers.",
  },
  {
    name: "FHIR IQ Playbook",
    href: "https://evestel.substack.com/",
    description:
      "A weekly newsletter on FHIR implementation, healthcare AI, and quality measurement. Written for the people doing the actual work. 550+ readers.",
  },
];
```

Create `src/data/passions.ts`:

```ts
export type Passion = {
  kind: "professional" | "personal";
  title: string;
  body: string;
};

export const passions: Passion[] = [
  {
    kind: "professional",
    title: "FHIR and interoperability",
    body:
      "Healthcare data is mostly a coordination problem dressed up as a technical one. I keep working on the seams — payer/provider, EHR/agent, standard/implementation — because that is where the leverage is.",
  },
  {
    kind: "professional",
    title: "AI safety in clinical contexts",
    body:
      "Agents writing to clinical systems is a fundamentally different problem than agents writing emails. HealthClaw is my attempt to take that difference seriously: redaction by default, multi-step human approval, immutable audit.",
  },
  {
    kind: "professional",
    title: "Building the Pittsburgh community",
    body:
      "I founded Pittsburgh Health Analytics and helped grow it past 110 members. The point is the room — the conversations between sessions are usually worth more than the talks.",
  },
  {
    kind: "personal",
    title: "Travel with Stacy",
    body:
      "My wife Stacy and I plan trips the way other people plan careers. The work-travel section below is mostly her doing.",
  },
  {
    kind: "personal",
    title: "Sports and fishing with the kids",
    body:
      "Most weekends find us on a field, a court, or a dock. Fishing with the kids is the closest thing I have to a meditation practice.",
  },
  {
    kind: "personal",
    title: "Music, history, reading",
    body:
      "I listen across genres without much loyalty to any of them. History and long-form reading are the counterweight to a job that mostly happens in tabs.",
  },
];
```

Create `src/data/travels.ts`:

```ts
export type Travel = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

// Intrinsic dimensions are required to prevent layout shift.
// Update the list once you drop your selected favorites into public/travels/.
// To get dimensions: `sips -g pixelWidth -g pixelHeight public/travels/01.jpg`
export const travels: Travel[] = [
  { src: "/travels/01.jpg", alt: "Work travel — placeholder", width: 1600, height: 1067 },
  { src: "/travels/02.jpg", alt: "Work travel — placeholder", width: 1600, height: 1067 },
  { src: "/travels/03.jpg", alt: "Work travel — placeholder", width: 1067, height: 1600 },
  { src: "/travels/04.jpg", alt: "Work travel — placeholder", width: 1600, height: 1067 },
  { src: "/travels/05.jpg", alt: "Work travel — placeholder", width: 1600, height: 900 },
  { src: "/travels/06.jpg", alt: "Work travel — placeholder", width: 1067, height: 1600 },
];

export const ALBUM_URL = "https://photos.app.goo.gl/REpyEw2T14UsGcju8";
```

Create `src/data/socials.ts`:

```ts
export type Social = { label: string; href: string };

export const socials: Social[] = [
  { label: "LinkedIn", href: "https://linkedin.com/in/evestel" },
  { label: "GitHub", href: "https://github.com/aks129" },
  { label: "Substack", href: "https://evestel.substack.com/" },
  { label: "Spotify (podcast)", href: "https://open.spotify.com/show/6GBZT7KA1Ug8xMZ4l5LThU" },
  { label: "Apple Podcasts", href: "https://podcasts.apple.com/us/podcast/out-of-the-fhir-podcast/id1822845248" },
  { label: "YouTube", href: "https://www.youtube.com/@OutoftheFHIRPodcast" },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- data`
Expected: PASS, all four data integrity assertions green.

- [ ] **Step 5: Commit**

```bash
git add src/data/
git commit -m "feat(data): typed data modules for projects, passions, travels, socials"
```

---

## Task 6: Hero section

**Files:**

- Create: `src/components/Hero.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Add hero styles**

Append to `src/styles.css`:

```css
.hero {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 32px;
  align-items: center;
  margin-bottom: 2.4em;
}

.hero-photo {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--rule);
  display: block;
}

.hero h1 { margin-bottom: 16px; }

@media (max-width: 640px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 20px;
    text-align: left;
  }
  .hero-photo { width: 160px; height: 160px; }
}
```

- [ ] **Step 2: Implement Hero**

Create `src/components/Hero.tsx`:

```tsx
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export default function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, reduce ? 0 : -8]);

  return (
    <section className="hero" aria-labelledby="hero-name">
      <motion.img
        src="/headshot.jpg"
        alt="Eugene Vestel, head and shoulders, dark blazer over light blue shirt"
        className="hero-photo"
        style={{ y }}
        width={220}
        height={220}
      />
      <div>
        <div className="dateline">
          Pittsburgh, Pennsylvania <span className="sep">·</span> April 2026
        </div>
        <h1 id="hero-name">Eugene Vestel</h1>
        <p className="lede">
          I work on healthcare data — mostly the parts where standards, AI, and human
          judgment have to meet.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire Hero into App temporarily for visual check**

Replace `src/App.tsx`:

```tsx
import WindBackground from "./components/WindBackground";
import Hero from "./components/Hero";

export default function App() {
  return (
    <>
      <WindBackground />
      <main className="page">
        <Hero />
      </main>
    </>
  );
}
```

- [ ] **Step 4: Visual acceptance — run dev server and verify**

Run: `npm run dev`

Verify in browser at the printed URL:

- Round headshot on the left (broken-image icon is fine until user drops the file in Task 14).
- "PITTSBURGH, PENNSYLVANIA · APRIL 2026" in small uppercase grey above the name.
- "Eugene Vestel" as a large serif headline.
- Lede paragraph below.
- Background is white with a barely-perceptible animated noise (the wind shader).
- No console errors except possibly a 404 for `/headshot.jpg`.
- Resize to ~500px wide: layout stacks, photo shrinks to 160px.

Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.tsx src/App.tsx src/styles.css
git commit -m "feat(hero): headshot + name + lede with scroll parallax"
```

---

## Task 7: About section

**Files:**

- Create: `src/components/About.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Implement About**

Create `src/components/About.tsx`:

```tsx
import Reveal from "./Reveal";

export default function About() {
  return (
    <Reveal>
      <section aria-labelledby="about-h">
        <h2 id="about-h">About Me</h2>
        <p>
          Right now I am Senior Lead for Payer Interoperability, Analytics, and AI at{" "}
          <a href="https://www.outcomes.com" target="_blank" rel="noopener">Outcomes</a>,
          the pharmacy technology company behind 50,000+ U.S. independent pharmacies and
          the country's leading CMR/MTM vendor. I built that pillar's interoperability
          strategy from scratch and serve as the AI champion for the product organization
          — helping teams move from PowerPoint mocks to working agentic prototypes in
          days rather than months.
        </p>
        <p>
          In parallel I run <a href="https://fhiriq.com" target="_blank" rel="noopener">FHIR IQ</a>,
          an independent practice and open-source studio. There I host the{" "}
          <em>Out of the FHIR</em> podcast, write the <em>FHIR IQ Playbook</em> Substack,
          and ship small open-source tools — including <em>HealthClaw</em>, a HIPAA-aware
          security layer for AI agents working on clinical data, and{" "}
          <em>Smart Health Connect</em>, a SMART-on-FHIR personal health record.
        </p>
        <p>
          Before this, I was Director of Analytics at b.well Connected Health from 2022
          to 2025, where the platform I architected was used by Walgreens and Samsung
          Health and connected to over 300 healthcare organizations through national
          exchanges. For five years before that I led quality analytics at UPMC, an $18B
          integrated payer-provider, where the work translated to roughly $180M of
          cumulative impact across HEDIS, patient-safety, and operational programs.
          Earlier still, I built BI for Allegheny Health Network and worked at Express
          Scripts, Medco, and Duane Reade.
        </p>
        <p>
          I hold an MBA in Healthcare from the University of Pittsburgh's Katz School of
          Business and live in Pittsburgh.
        </p>
      </section>
    </Reveal>
  );
}
```

- [ ] **Step 2: Wire About into App**

Replace `src/App.tsx`:

```tsx
import WindBackground from "./components/WindBackground";
import Hero from "./components/Hero";
import About from "./components/About";

export default function App() {
  return (
    <>
      <WindBackground />
      <main className="page">
        <Hero />
        <About />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Visual acceptance**

Run: `npm run dev`

Verify:

- "ABOUT ME" heading appears below the hero with a top hairline rule.
- Four paragraphs of body copy, all readable.
- "Outcomes" and "FHIR IQ" links are underlined and open in new tabs.
- Section fades in as it enters the viewport (scroll up and back down to retest).

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/About.tsx src/App.tsx
git commit -m "feat(about): bio paragraphs"
```

---

## Task 8: Projects section

**Files:**

- Create: `src/components/Projects.tsx`
- Modify: `src/styles.css`
- Modify: `src/App.tsx`

- [ ] **Step 1: Add projects styles**

Append to `src/styles.css`:

```css
.project {
  margin-bottom: 1.6em;
}
.project .name {
  font-weight: 600;
  font-style: italic;
}
.project .name a {
  text-decoration: none;
  border-bottom: 1px solid var(--underline);
  padding-bottom: 1px;
  transition: border-color 0.15s ease;
}
.project .name a:hover {
  border-bottom-color: var(--ink);
}
```

- [ ] **Step 2: Implement Projects**

Create `src/components/Projects.tsx`:

```tsx
import Reveal from "./Reveal";
import { projects } from "../data/projects";

export default function Projects() {
  return (
    <Reveal>
      <section aria-labelledby="projects-h">
        <h2 id="projects-h">Projects</h2>
        {projects.map(p => (
          <div className="project" key={p.name}>
            <p>
              <span className="name">
                {p.href ? (
                  <a href={p.href} target="_blank" rel="noopener">{p.name}</a>
                ) : (
                  p.name
                )}
              </span>{" "}
              — {p.description}
            </p>
          </div>
        ))}
      </section>
    </Reveal>
  );
}
```

- [ ] **Step 3: Wire into App**

Modify `src/App.tsx` — add `import Projects from "./components/Projects";` at the top and `<Projects />` after `<About />` in the JSX.

- [ ] **Step 4: Visual acceptance**

Run: `npm run dev`

Verify:

- "PROJECTS" heading.
- Six entries, each as italic project name followed by em-dash and a paragraph.
- HealthClaw, FHIR Builders, AI NPI, Out of the FHIR, FHIR IQ Playbook are linked (italic with bottom border); Smart Health Connect is plain italic.
- Section fades in on scroll.

Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add src/components/Projects.tsx src/App.tsx src/styles.css
git commit -m "feat(projects): stacked project entries from data"
```

---

## Task 9: Passions section

**Files:**

- Create: `src/components/Passions.tsx`
- Modify: `src/styles.css`
- Modify: `src/App.tsx`

- [ ] **Step 1: Add passions styles**

Append to `src/styles.css`:

```css
.passions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px 40px;
}
.passion .title {
  font-style: italic;
  font-weight: 500;
  display: block;
  margin-bottom: 6px;
}
.passion .body {
  margin: 0;
  color: var(--ink);
  font-size: 17px;
  line-height: 1.55;
}

@media (max-width: 640px) {
  .passions-grid { grid-template-columns: 1fr; gap: 24px; }
}
```

- [ ] **Step 2: Implement Passions**

Create `src/components/Passions.tsx`:

```tsx
import Reveal from "./Reveal";
import { passions } from "../data/passions";

export default function Passions() {
  return (
    <Reveal>
      <section aria-labelledby="passions-h">
        <h2 id="passions-h">Passions</h2>
        <div className="passions-grid">
          {passions.map(p => (
            <div className="passion" key={p.title}>
              <span className="title">{p.title}</span>
              <p className="body">{p.body}</p>
            </div>
          ))}
        </div>
      </section>
    </Reveal>
  );
}
```

- [ ] **Step 3: Wire into App**

Add `import Passions from "./components/Passions";` and `<Passions />` after `<Projects />`.

- [ ] **Step 4: Visual acceptance**

Run: `npm run dev`

Verify:

- "PASSIONS" heading.
- Two-column grid with six entries (FHIR/interop, AI safety, Pittsburgh community, Travel with Stacy, Sports/fishing, Music/history/reading).
- Each entry has italic title above body text.
- Resize to ~500px wide: collapses to single column.

Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add src/components/Passions.tsx src/App.tsx src/styles.css
git commit -m "feat(passions): two-column grid of professional + personal passions"
```

---

## Task 10: Work Travels section — gallery + Google Photos link

**Files:**

- Create: `src/components/Travels.tsx`
- Modify: `src/styles.css`
- Modify: `src/App.tsx`
- Create: `public/travels/.gitkeep`

- [ ] **Step 1: Create the empty travels directory**

```bash
mkdir -p public/travels
touch public/travels/.gitkeep
```

- [ ] **Step 2: Add travels styles**

Append to `src/styles.css`:

```css
.travels-grid {
  column-count: 3;
  column-gap: 16px;
  margin: 1.4em 0 1em;
}
.travels-grid figure {
  margin: 0 0 16px;
  break-inside: avoid;
  display: block;
  transition: transform 180ms ease;
}
.travels-grid figure:hover { transform: translateY(-2px); }
.travels-grid img {
  width: 100%;
  height: auto;
  display: block;
  border: 1px solid var(--rule);
  background: #F5F5F5;
}
.album-link {
  font-size: 16px;
  color: var(--mute);
}

@media (max-width: 960px) { .travels-grid { column-count: 2; } }
@media (max-width: 540px) { .travels-grid { column-count: 1; } }
```

- [ ] **Step 3: Implement Travels**

Create `src/components/Travels.tsx`:

```tsx
import { motion, useReducedMotion } from "framer-motion";
import Reveal from "./Reveal";
import { travels, ALBUM_URL } from "../data/travels";

export default function Travels() {
  const reduce = useReducedMotion();

  return (
    <Reveal>
      <section aria-labelledby="travels-h">
        <h2 id="travels-h">Work Travels</h2>
        <p>
          Most of what makes a career interesting is the rooms you end up in. A
          handful of favorites from recent trips with Stacy and the team.
        </p>
        <motion.div
          className="travels-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={reduce ? undefined : { visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {travels.map(t => (
            <motion.figure
              key={t.src}
              variants={reduce ? undefined : {
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <img
                src={t.src}
                alt={t.alt}
                width={t.width}
                height={t.height}
                loading="lazy"
                decoding="async"
              />
            </motion.figure>
          ))}
        </motion.div>
        <p className="album-link">
          <a href={ALBUM_URL} target="_blank" rel="noopener">
            See the full album on Google Photos →
          </a>
        </p>
      </section>
    </Reveal>
  );
}
```

- [ ] **Step 4: Wire into App**

Add `import Travels from "./components/Travels";` and `<Travels />` after `<Passions />`.

- [ ] **Step 5: Visual acceptance**

Run: `npm run dev`

Verify:

- "WORK TRAVELS" heading + intro paragraph.
- 3-column masonry grid showing six broken-image placeholders (the actual images go in during Task 14). The placeholder boxes should be in proportions roughly matching the data widths/heights.
- "See the full album on Google Photos →" link below the grid in a slightly muted color, opens the Google Photos album in a new tab.
- Resize: drops to 2 cols at ~960px, 1 col at ~540px.
- Each placeholder fades in with a small stagger when scrolled into view.

Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add src/components/Travels.tsx src/App.tsx src/styles.css public/travels/.gitkeep
git commit -m "feat(travels): masonry gallery with Google Photos link-out"
```

---

## Task 11: Contact section

**Files:**

- Create: `src/components/Contact.tsx`
- Modify: `src/styles.css`
- Modify: `src/App.tsx`

- [ ] **Step 1: Add contact styles**

Append to `src/styles.css`:

```css
.contact-mail {
  display: inline-block;
  font-size: clamp(28px, 4vw, 36px);
  font-weight: 600;
  font-variation-settings: "opsz" 36;
  margin: 0.4em 0 0.4em;
  letter-spacing: -0.01em;
}
.contact-note {
  color: var(--mute);
  font-size: 17px;
}
```

- [ ] **Step 2: Implement Contact**

Create `src/components/Contact.tsx`:

```tsx
import Reveal from "./Reveal";

export default function Contact() {
  return (
    <Reveal>
      <section aria-labelledby="contact-h">
        <h2 id="contact-h">Get in Touch</h2>
        <a className="contact-mail" href="mailto:eugene.vestel@gmail.com">
          eugene.vestel@gmail.com
        </a>
        <p className="contact-note">
          I read everything; I respond to most things within a week.
        </p>
      </section>
    </Reveal>
  );
}
```

- [ ] **Step 3: Wire into App**

Add `import Contact from "./components/Contact";` and `<Contact />` after `<Travels />`.

- [ ] **Step 4: Visual acceptance**

Run: `npm run dev`

Verify:

- "GET IN TOUCH" heading.
- Email address as a large display-weight link.
- One muted line below it.
- Clicking the email opens the system mail client.

Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add src/components/Contact.tsx src/App.tsx src/styles.css
git commit -m "feat(contact): large mailto link, no form"
```

---

## Task 12: Socials section + Footer

**Files:**

- Create: `src/components/Socials.tsx`
- Create: `src/components/Footer.tsx`
- Modify: `src/styles.css`
- Modify: `src/App.tsx`

- [ ] **Step 1: Add socials + footer styles**

Append to `src/styles.css`:

```css
.socials {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 18px;
  line-height: 2;
}
.socials li { padding: 2px 0; }

.colophon {
  margin-top: 6em;
  padding-top: 2em;
  border-top: 1px solid var(--rule);
  font-size: 13px;
  color: var(--faint);
  font-style: italic;
  letter-spacing: 0.02em;
}
```

- [ ] **Step 2: Implement Socials**

Create `src/components/Socials.tsx`:

```tsx
import Reveal from "./Reveal";
import { socials } from "../data/socials";

export default function Socials() {
  return (
    <Reveal>
      <section aria-labelledby="socials-h">
        <h2 id="socials-h">Socials</h2>
        <ul className="socials">
          {socials.map(s => (
            <li key={s.href}>
              <a href={s.href} target="_blank" rel="noopener">{s.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </Reveal>
  );
}
```

- [ ] **Step 3: Implement Footer**

Create `src/components/Footer.tsx`:

```tsx
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="colophon">
      © {year} Eugene Vestel. Pittsburgh, Pennsylvania.
    </footer>
  );
}
```

- [ ] **Step 4: Wire into App (final composition)**

Replace `src/App.tsx`:

```tsx
import WindBackground from "./components/WindBackground";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Passions from "./components/Passions";
import Travels from "./components/Travels";
import Contact from "./components/Contact";
import Socials from "./components/Socials";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <WindBackground />
      <main className="page">
        <Hero />
        <About />
        <Projects />
        <Passions />
        <Travels />
        <Contact />
        <Socials />
        <Footer />
      </main>
    </>
  );
}
```

- [ ] **Step 5: Visual acceptance — full page walk-through**

Run: `npm run dev`

Verify, scrolling top to bottom:

1. Wind shader animates faintly behind everything; page background reads as white at a glance.
2. Hero: dateline, name, lede, headshot (placeholder is fine).
3. About: four bio paragraphs, fades in.
4. Projects: 6 entries, fades in.
5. Passions: 2-col grid of 6 entries, fades in.
6. Travels: 3-col masonry of 6 placeholders + Google Photos link, staggered fade-in.
7. Contact: large mailto + note.
8. Socials: 6-line list, fades in.
9. Footer: "© 2026 Eugene Vestel. Pittsburgh, Pennsylvania." in small italic grey.
10. No console errors.
11. Resize window from 1400px down to 360px; all sections reflow cleanly with no horizontal scrollbar.

Stop the dev server.

- [ ] **Step 6: Run all tests + production build**

Run: `npm test && npm run build`
Expected: All tests green; `dist/` produced with no TypeScript errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/Socials.tsx src/components/Footer.tsx src/App.tsx src/styles.css
git commit -m "feat(socials,footer): finish full-page composition"
```

---

## Task 13: Reduced-motion + accessibility verification

**Files:**

- (no code changes; verification + any fixes that surface)

- [ ] **Step 1: Reduced-motion verification**

In macOS System Settings → Accessibility → Display → enable "Reduce motion." (Or in Chrome DevTools: Rendering tab → "Emulate CSS media feature prefers-reduced-motion" → "reduce".)

Run: `npm run dev`

Verify:

- The wind background renders as a static gradient (no animation).
- Section fade-ins do not animate — content is visible immediately.
- Headshot does not parallax.

Disable reduced motion when done.

- [ ] **Step 2: Keyboard navigation verification**

Tab through the page from the URL bar. Verify:

- Every link is reachable in document order.
- Focused links show a 2px ink outline.
- Skip-the-headshot is fine — it is decorative.

- [ ] **Step 3: Screen reader spot-check**

If VoiceOver is available (Cmd+F5 on macOS): navigate by headings (Ctrl+Opt+Cmd+H). Verify each section has an audible heading: About Me, Projects, Passions, Work Travels, Get in Touch, Socials.

- [ ] **Step 4: Run lint/build one more time**

Run: `npm run build && npm test`
Expected: green.

- [ ] **Step 5: Commit if anything changed**

If steps 1–4 surfaced fixes, commit them with a clear message. Otherwise skip.

---

## Task 14: Vercel config + README + asset placeholders

**Files:**

- Create: `vercel.json`
- Modify: `README.md`

- [ ] **Step 1: Create vercel.json**

Create `vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

- [ ] **Step 2: Replace README**

Replace `README.md`:

````markdown
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
````

- [ ] **Step 3: Drop in your headshot**

Save the headshot Eugene attached to `public/headshot.jpg` (square crop recommended, ~600×600 px, JPEG quality ~85).

- [ ] **Step 4: Drop in travel photos**

Download 6–12 favorites from `https://photos.app.goo.gl/REpyEw2T14UsGcju8`. Resize each to ≤1600px on the long edge (e.g., `sips -Z 1600 *.jpg`). Save to `public/travels/01.jpg`, `02.jpg`, etc.

For each file, get the actual dimensions:

```bash
for f in public/travels/*.jpg; do sips -g pixelWidth -g pixelHeight "$f"; done
```

Update `src/data/travels.ts` to replace the placeholder entries with the real `width`, `height`, and `alt` text for each photo.

- [ ] **Step 5: Final visual + production build verification**

Run: `npm run dev`

Verify:

- Headshot renders.
- Travel gallery renders with real photos in correct proportions.
- No layout shift while images load.

Stop the dev server.

Run: `npm run build && npm run preview`

Verify the production build also looks correct.

- [ ] **Step 6: Commit**

```bash
git add vercel.json README.md public/headshot.jpg public/travels/ src/data/travels.ts
git commit -m "chore: vercel config, README, and real assets"
```

---

## Done

The site is now feature-complete and ready to deploy. From the Vercel dashboard: New Project → Import the GitHub repo → accept the Vite preset → Deploy.
