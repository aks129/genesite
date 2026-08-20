# Design System: eugenevestel.com

Foundational DNA for the site's visual language. Any agent or human touching the
UI follows this file. When code and this file disagree, fix one of them — never
let them drift.

Aesthetic direction: **dark editorial, mission-first** (references:
animaapp.com for surface — deep forest canvas, orange accent, hairline borders,
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

Forest green + vibrant orange (Merlin Studio direction). `#324434` is the
specified forest; `--bg` sits darker than it so body text keeps its contrast,
with the forest used for raised surfaces and fills.

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#141B15` | page background (deep forest black) |
| `--bg-raised` | `#1C261D` | cards, panels |
| `--forest` | `#324434` | the specified green — fills, banners |
| `--text` | `#F3F0E6` | headings, primary text (warm cream) |
| `--text-soft` | `#B3BCAD` | body/secondary text |
| `--text-faint` | `#7E8A7C` | tertiary text, captions, ticks |
| `--rule` | `#2E3B2F` | hairlines, borders |
| `--accent` | `#FFA61E` | vibrant orange — links, active states, section numbers |
| `--accent-deep` | `#E08A0C` | button fills, hover darken |
| `--accent-wash` | `rgba(255,166,30,0.14)` | selection, subtle fills |
| `--pop` | `#FFD37A` | rare light-amber highlight |

*   **Banned:** purple/violet anything (superseded), neon glows beyond the soft
    card halo, pure #FFF backgrounds, hospital blue.
*   **Measured contrast** on this palette (worst-case background in the reading
    column): body 5.9-7.7:1, headings 10.2-13.3:1, orange accent 6.0-7.7:1 —
    all past WCAG AA. Re-measure after any palette or shader change.

## 4. Spacing & Layout

*   680px reading measure, gutters `clamp(24px, 5vw, 48px)`.
*   Section rhythm: hairline rule + orange mono section number + Fraunces
    heading (CSS counters — no markup changes needed).
*   Breakout elements (map, chart) exceed the measure symmetrically
    (`margin-inline: -120px`, collapsing at 1024/800px).
*   Generous whitespace between sections; never cram.

## 5. UI Components & Elements

*   **Buttons:** `--accent-deep` fill, white text, radius 8px. Hover:
    `--accent` + translateY(-1px) + warm shadow, 180ms ease.
*   **Cards:** `--bg-raised`, 1px `--rule` border, radius 12px. Hover: border →
    orange, translateY(-3px), deep shadow + faint warm halo.
*   **Borders:** 1px hairlines in `--rule`; radius is 8px (controls) or 12px
    (cards/panels) — nothing else.
*   **Tags/pills:** mono, 1px border, radius 999px.
*   **Focus:** 2px solid `--accent`, 2px offset, on everything interactive.

## 6. Motion & Interactions

*   **Scroll:** Lenis smooth scroll, created only when
    `prefers-reduced-motion` is off.
*   **Living background:** WebGL aurora (`WindBackground`) — silky forest-green
    curtains with a thin warm rim, drifting across a deep green-black sky, built from double
    domain-warped fbm ridged into bands, plus sparse twinkling stars, a soft
    corner falloff, and a 1/255 dither to kill banding. Reference: hatom.com
    (flowing depth, not a static gradient). Full-viewport `position: fixed`
    so it moves under every page.
    **Constraint:** the aurora is masked to the upper sky and outer thirds —
    the center reading column stays near-black. Measured worst-case contrast
    in the text column must stay ≥ 4.5:1 for body text; it is currently
    5.9–7.7:1 (body) and 10.2–13.3:1 (headings). Re-measure if you touch the
    mask or palette. Falls back to a layered static gradient.
*   **ScrollWorld hero** (`/` only): three frame-locked clips of one continuous
    camera move — down a boardwalk, through open glass, out to a misty valley —
    scrubbed by scroll position rather than played. A sticky full-bleed stage
    inside a tall container; the page continues normally underneath.
    - **Desktop + motion only.** Gated on `useReducedMotion()` and
      `(min-width: 861px) and (pointer: fine)`. Anything else renders the
      original `<Hero />` and downloads **zero video**. Keep `Hero.tsx` — it is
      the live fallback, not dead code.
    - Clips are fetched as **Blobs** (seeking never depends on HTTP range),
      seeks are **coalesced** (never queued while the decoder is mid-seek), the
      target is **lerped** at 0.18 so a flick reads as a glide, and the poster
      holds until a real frame paints.
    - The engine shipped by the `scroll-world` skill is **not** used directly:
      seven of its layers are `position: fixed; inset: 0`, which pins an opaque
      stage over the rest of the page. `ScrollWorld.tsx` is a scoped equivalent
      that keeps the skill's playback techniques.
    - The left scrim carries the copy, so its opacity **tracks copy opacity**
      (`--sw-scrim`) — a dark band over footage with no text in it looks like a
      mistake.
    - Measured worst-case contrast against the **brightest single background
      pixel** under each text block, before the text-shadow: hero h1 6.2:1,
      identity line 14.4:1, mid line 8.0:1, valley line 11.2:1. Re-measure if
      you touch the scrim stops, copy width, or swap footage.
    - Source assets and prompts: `docs/scroll-world/`.
*   **The world** (`WorldStage`, every route except `/`): the site is one
    building, and each tab is a place in it. The same three clips the home film
    scrubs are re-cut as **waypoints** — a route parks the camera on one frame
    of the single unbroken take, so navigating between tabs flies through the
    house rather than cutting between themed pages. Nothing here was generated;
    the whole map is sliced out of footage that already existed.

    | Route | Place | Frame |
    |---|---|---|
    | `/career` | the boardwalk | approach @ 1.6s |
    | `/expertise`, `/services` | the threshold | approach @ 6.6s |
    | `/writing` | the reading corner | inside @ 3.2s |
    | `/projects` | the worktable | inside @ 4.6s |
    | `/speaking` | the screen wall | valley @ 1.4s |
    | `/hobbies` | the overlook | valley @ 4.6s |

    - **Same gate as the home film** — `useWorldEnabled()` (`861px` + fine
      pointer + not reduced-motion), shared by the stage, the curtain bypass,
      the page-head chip, and the aurora it stands in for. Verified: reduced
      motion, iPhone, and an 800px desktop all download **zero** mp4 and keep
      today's aurora untouched.
    - **Travel** is a fixed ~1.1s eased tween in `u`, never scaled by distance —
      `/career` → `/hobbies` crosses the whole house and pacing it by distance
      would read as broken-slow. `RouteTransition` **drops its slats** while the
      world is up (a curtain over the one thing worth watching), keeping only
      the mono readout, now `▸ ~/projects · the worktable`. `PageShell` holds
      the incoming page for 0.55s so the room arrives before the text does.
    - **Drift is forward only.** A route parks exactly on its frame and reading
      walks the camera `DRIFT` (0.9s) further in. Reversing across a seam is the
      one move that breaks a single-take illusion, so `timeline.test.ts` fails
      the build if any waypoint plus its full drift overruns its clip.
    - **The camera outlives the page.** `world/engine.ts` is a module singleton,
      not a hook — navigation unmounts a page mid-flight and the camera has to
      keep going through it. `world/clips.ts` is one blob cache shared with the
      home film: measured, each clip is fetched **once** across a session that
      visits all six tabs (3 requests, not 12). Only the current leg loads
      eagerly; the two adjacent ones warm on idle, and `saveData`/2g skips video
      entirely and lets the waypoint stills carry the page.
    - **Readability is the whole constraint.** Three veils, all keyed to
      `--w-open` (1 on arrival → 0 once you have scrolled 0.45vh): a flat dim
      (0.20 → 0.93), a lower-screen settle, and a **column mask** that holds the
      middle 680px down while leaving the outer thirds bright. The column mask
      is what buys the contrast, which is why the flat dim can afford to be thin
      enough to actually show the room. Page heads carry their own pool of
      shadow plus the `.sw-copy` text-shadow.
    - Measured on the brightest waypoint (the overlook) against the **brightest
      8px block** of real composited backdrop, text hidden — worst case across
      the whole reading column:

      | State | `--text` | `--text-soft` | `--accent` | `--text-faint` |
      |---|---|---|---|---|
      | arrival (`--w-open` 1) | 11.7 | 6.8 | 6.8 | 3.7 |
      | scrolled (`--w-open` 0) | 11.8 | 6.9 | 6.9 | 3.7 |

      Cross-checked on the boardwalk (bright sky through trees), which measures
      better at 13.0 / 7.6 / 7.6 / 4.1 — the overlook is the true worst case.
      Body and headings land at or above the site's existing 5.9–7.7 / 10.2–13.3
      range. **`--text-faint` is the one regression**: ~5.0 on plain `--bg`,
      3.7 here against the worst-case highlight (mean case ~4.9, unchanged). It
      carries only tertiary metadata — chart ticks, city labels, hud indices.
      Re-measure with the backdrop-only method if you touch a veil stop, a
      waypoint, or the footage.
*   **The screen on the wall** (`/speaking`): the display in the footage plays
    the podcast. Two separate pieces, deliberately:
    - **The control is a real button in the page**, never a hotspot on the
      footage. It is keyboard-reachable, screen-reader-legible, and identical
      on phones and under reduced motion, which get the same button and the
      same player with no room behind it. The `screen-slot` only reserves wall
      space when `body.world-on`.
    - **The plate is decoration**: a flat element warped onto the panel with a
      projective transform (`world/homography.ts`), `pointer-events: none`
      throughout, `z-index: 8` so it sits above every veil — a screen emits its
      own light. It carries type only, no fetched artwork, per the
      no-stock-imagery rule.
    - The surface lives on the waypoint (`Surface` in timeline.ts) as corners in
      frame fractions, read off the parked frame with a pixel grid and verified
      by drawing them back over it. `coverProject` replays what `object-fit:
      cover` + `object-position: center 45%` does, so the plate stays glued as
      the window changes. **`transform-origin: 0 0` is mandatory** — with the
      default centre origin the matrix lands nowhere near the wall.
    - Only valid while the camera is parked, so the plate is bound to
      `--w-still`: it is suppressed for the whole of a travel and fades with the
      still on scroll.
    - **The collision guard.** Where the panel lands is decided by the footage
      and the window, not the layout, so the two can meet. `--w-fit` measures it
      every read: if the panel's lit area reaches into the page head, the screen
      stays off. Verified across 8 viewport sizes — at every size where the
      screen is on, no head copy sits on its lit area; at every size where copy
      would, it is off (1280×800, 1366×768, 900×900, 1600×700 are all off; the
      button still works there). The head is measured through `offsetParent`
      rather than `getBoundingClientRect`, because PageShell slides content in
      from 14px down and a rect read during that animation gets latched.
    - The Spotify iframe **mounts only when the player opens** — measured zero
      spotify.com requests on a plain page visit, 29 after opening. Esc and
      backdrop close it, focus returns to the button, and the iframe unmounts.
    - The panel is 760px wide because Spotify's 352px-tall embed clips its own
      episode title under roughly 700px of inner width.
    - Waypoint posters (`public/world/wp/*.jpg`, 1.2 MB total) are cut from the
      exact parked frame with ffmpeg, so a page shows the correct image before
      its video lands — and forever, if video never loads.
    - **The still outranks the clip on arrival.** `career`, `writing` and
      `hobbies` are 4K upscales (`bytedance_image_upscale`, 2 credits each)
      shipped at 2560×1440; the footage beneath them is 720p. Letting video take
      over on arrival would make a page get *softer* the longer you looked at
      it, so `--w-still` holds the still over the clip while parked and open,
      and hands off as the camera starts to drift — which is also when the veil
      is thickening, so the resolution drop happens under cover of darkness.
      `--w-still` is forced to 0 for the length of a travel, because there the
      moving camera is the entire point. Verified by DOM sampling in both
      directions. `expertise`, `projects` and `speaking` are still 720p cuts;
      upscaling them is 2 credits each whenever there is budget.
*   **Reveals:** framer-motion `Reveal` per section (existing contract).
*   **Reduced-motion contract:** every motion source gates on
    `useReducedMotion()` — see CLAUDE.md. Lenis included.
*   **Hover:** every interactive element has a defined hover state (color,
    underline thickness, or lift). Transitions 150–200ms ease.
*   **HUD interaction layer** (reference: adrian-vlasov-portfolio — terminal /
    heads-up-display feel, adapted to the orange accent):
    - `.hud` panels (project cards, pillars) get corner brackets that snap in
      on hover/focus-within, a pointer-tracking glow (`--mx`/`--my` written by
      `useCursorGlow`, painted as a background *image* so the panel's own
      background-color survives), and a mono `hud-index` that lights orange.
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
    - `ScrollProgress` is a 2px orange readout of scroll position.
    - `Parallax` drifts breakout visuals against page scroll for depth.
    - The contact block is a HUD panel with a pulsing status dot and
      staggered entrance.
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
