# Design System: eugenevestel.com

Foundational DNA for the site's visual language. Any agent or human touching the
UI follows this file. When code and this file disagree, fix one of them — never
let them drift.

Aesthetic direction: **dark editorial, mission-first** (references:
animaapp.com for surface — near-black canvas, violet accent, hairline borders,
soft card glow, film grain; whoisjoa.studio for structure — mission statement
before name, mixed-type headlines with italic-serif emphasis, underscore mono
eyebrows, few words, huge calm space).

Content structure: the home page leads with the mission ("build things, make
them better, help people solve real problems"), then **two pillars, kept
separate: Artificial Intelligence and Healthcare Technology.** The person
comes last and briefly.

## 1. Brand Voice & Tone

*   **Personality:** Gene, a builder. Playful, plainspoken, a little dry.
    Mission before self — the work is the subject, not the person. The Lego
    mascot is on brand.
*   **Copywriting Rules:** No marketing fluff ("seamless", "robust",
    "cutting-edge"). No repeated brags. Instructions under 20 words,
    descriptions under 25. Truth over persuasion.

## 2. Typography

*   **Primary Font (Headings):** Fraunces (variable; opsz + SOFT/WONK axes).
    High optical size, negative tracking — the Anima-style high-contrast serif.
    Self-hosted via `@fontsource-variable/fraunces` (`full.css`).
*   **Secondary Font (Body):** Instrument Sans (variable). Self-hosted via
    `@fontsource-variable/instrument-sans`. The npm-installable equivalent of
    Switzer/Satoshi — no CDN dependency.
*   **Annotation Font (datelines, labels, tags, section numbers, chart ticks):**
    Spline Sans Mono (variable), self-hosted.
*   **Banned Fonts:** Inter, Roboto, Arial, default system stacks as primary
    faces. No Google Fonts CDN — all fonts ship with the bundle.
*   **Rules:** Mono is for metadata only, never body copy. Eyebrows/labels may
    be uppercase only when letter-spaced ≥ 0.1em and ≤ 13px.

## 3. Color Palette

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#131216` | page background (near-black, warm-violet cast) |
| `--bg-raised` | `#1B1A21` | cards, panels |
| `--text` | `#F2F0EC` | headings, primary text (warm white) |
| `--text-soft` | `#A8A4B0` | body/secondary text |
| `--text-faint` | `#6E6A7A` | tertiary text, captions, ticks |
| `--rule` | `#2B2933` | hairlines, borders |
| `--accent` | `#8577F3` | violet — links, active states, section numbers |
| `--accent-deep` | `#6E5FE0` | button fills, hover darken |
| `--accent-wash` | `rgba(133,119,243,0.14)` | selection, subtle fills |
| `--pop` | `#E8734A` | rare ember accent — "Upcoming" tag, one per screen |

*   **Banned:** purple *gradients* (flat violet fills only), neon glows beyond
    the soft card halo, pure #FFF backgrounds, hospital blue.

## 4. Spacing & Layout

*   680px reading measure, gutters `clamp(24px, 5vw, 48px)`.
*   Section rhythm: hairline rule + violet mono section number + Fraunces
    heading (CSS counters — no markup changes needed).
*   Breakout elements (map, chart) exceed the measure symmetrically
    (`margin-inline: -120px`, collapsing at 1024/800px).
*   Generous whitespace between sections; never cram.

## 5. UI Components & Elements

*   **Buttons:** `--accent-deep` fill, white text, radius 8px. Hover:
    `--accent` + translateY(-1px) + violet shadow, 180ms ease.
*   **Cards:** `--bg-raised`, 1px `--rule` border, radius 12px. Hover: border →
    violet, translateY(-3px), deep shadow + faint violet halo.
*   **Borders:** 1px hairlines in `--rule`; radius is 8px (controls) or 12px
    (cards/panels) — nothing else.
*   **Tags/pills:** mono, 1px border, radius 999px.
*   **Focus:** 2px solid `--accent`, 2px offset, on everything interactive.

## 6. Motion & Interactions

*   **Scroll:** Lenis smooth scroll, created only when
    `prefers-reduced-motion` is off.
*   **Living background:** WebGL aurora (`WindBackground`) — silky violet
    curtains drifting across a near-black sky, built from double
    domain-warped fbm ridged into bands, plus sparse twinkling stars, a soft
    corner falloff, and a 1/255 dither to kill banding. Reference: hatom.com
    (flowing depth, not a static gradient). Full-viewport `position: fixed`
    so it moves under every page.
    **Constraint:** the aurora is masked to the upper sky and outer thirds —
    the center reading column stays near-black. Measured worst-case contrast
    in the text column must stay ≥ 4.5:1 for body text; it is currently
    5.5–6.8:1 (body) and 11.8–14.5:1 (headings). Re-measure if you touch the
    mask or palette. Falls back to a layered static gradient.
*   **Reveals:** framer-motion `Reveal` per section (existing contract).
*   **Reduced-motion contract:** every motion source gates on
    `useReducedMotion()` — see CLAUDE.md. Lenis included.
*   **Hover:** every interactive element has a defined hover state (color,
    underline thickness, or lift). Transitions 150–200ms ease.
*   **HUD interaction layer** (reference: adrian-vlasov-portfolio — terminal /
    heads-up-display feel, adapted to violet rather than its neon green):
    - `.hud` panels (project cards, pillars) get corner brackets that snap in
      on hover/focus-within, a pointer-tracking glow (`--mx`/`--my` written by
      `useCursorGlow`, painted as a background *image* so the panel's own
      background-color survives), and a mono `hud-index` that lights violet.
    - `ScrambleText` decodes text on mount or on hover of the nearest
      `[data-hud]`. It keeps an invisible copy of the real string to hold the
      width (proportional fonts would otherwise shift the page) plus a
      `visually-hidden` copy for assistive tech; the animated spans are
      `aria-hidden`.
    - `.glitch-target` inside a hovered `.hud` plays one short chromatic split.
    - `RouteTransition` wipes vertical slats over route changes with a mono
      readout of the destination. Unmount is driven by a **timer**, not
      framer's `onAnimationComplete` — the wrapper's own animation settles
      instantly and would cut the slats off mid-sweep.
    - Display headings use a per-line clip reveal (`.hero-h .hl`), never a
      scramble — mixed serif/sans lines shift too much.
    - A sheen sweeps once across a `.hud` panel on hover (second background
      layer, animated via `background-position`).
    - `useMagnetic` leans buttons toward the pointer (capped at 10px) and
      springs them back; applied to hero CTAs, nav actions, the booking
      button. Pair it with the `.magnetic` class for the return easing.
    - `Cursor` draws a trailing reticle that widens over anything
      interactive. Fine pointers only, never on touch. The native cursor
      stays visible — the ring is an accent, not a replacement.
    - `ScrollProgress` is a 2px violet readout of scroll position.
*   **Route curtain timing:** slats **translate**, never scale — scaling a
    gradient stretches its leading edge and looks cheap. Ease is a soft
    in-out (`[0.62, 0, 0.30, 1]`); easeInOutQuint snapped through the middle
    (95px/frame vs 42px). It falls, holds ~0.16s, then continues *downward*
    out of frame rather than retracting, so it passes through instead of
    rewinding. `PageShell` settles the incoming content in behind it so the
    reveal never lands on a hard cut.
    **All of the above collapse under `prefers-reduced-motion`** via the media
    query at the end of the HUD block plus early returns in the components.

## 7. Iconography & Assets

*   No icon library. Arrows and marks are typographic (→, ↗) or hand-drawn
    inline SVG (LegoGene, USMap). Do NOT add Lucide/FontAwesome.
*   LegoGene mascot and the hand-traced US map stay — they are the signature.
*   Texture: one subtle SVG grain overlay on `body`; no stock imagery.
