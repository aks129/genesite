# Scroll-world fly-through — build state

Working state for the `scroll-world` skill build (skill installed at
`.claude/skills/scroll-world/`). Everything here is decided; the only thing
missing is the render.

## Decisions (made 2026-08-17)

| Question | Answer |
|---|---|
| Placement | **Replaces the home hero** |
| Mobile | **Desktop only** (no 9:16 chain) |
| Spend | **Stills only for now** — approve art direction before any video |
| Tier | `seedance_2_0_mini` (720p draft) — Standard 1080p does not fit the balance |
| Stills source | Higgsfield `gpt_image_2` (Codex path is dead, see below) |

## Scene concept — The Ridge Station

Revised 2026-08-16. The first pass was a plain studio interior; it read
competent but said nothing. The brief now is **confidence, authenticity,
credibility, and AI technology sitting inside nature rather than on top of
it.**

A low timber-and-glass research pavilion set into a misty evergreen ridge at
golden hour. The technology is implied by the architecture and the one warm
screen visible through the glass — never by holograms, circuitry, neon, or
data-viz overlays. Nature is the dominant mass; the building is the precise,
quiet thing inside it. Forest green is the world, orange is the only light
coming from human work.

Why this reads credible rather than sci-fi: real materials (wet slate, damp
timber, board-formed concrete, moss), one honest light source, no invented
future tech. The genre reference is Nordic architectural photography, not
"AI website".

**Hard negatives in the prompt** — no text, letters, logos, signage, readable
screen content, holograms, glowing circuitry, neon, lens flare, or people.
Image models will scrawl gibberish on any screen unless told not to.

## Camera architecture — A (continuous forward walkthrough)

The camera only ever moves inward — down the boardwalk, through the glass,
across the room — so this is Architecture A, not the diorama fly-through:

- **No connectors.** Each leg's `--start-image` is the *actual last frame* of
  the previous leg (extract with ffmpeg), so seams are frame-identical.
- **Never pass `--end-image`** on a leg — an establishing end-image forces the
  camera to pull back, which is the #1 cause of seam stutter.
- Each leg ends settling into a slow forward drift; the next begins by
  continuing it (the motion handoff contract).
- Lateral/arcing moves are safe *within* a leg. Only reversals *across* a seam
  break the illusion.

### Flight path

| Leg | Camera move | Lands on | Site section |
|---|---|---|---|
| 0 — Approach | Glide forward down the boardwalk toward the pavilion, mist parting, warm glass ahead; settle still drifting in | The lit glass entrance | Hero — *Build things. Make them better.* |
| 1 — Inside | Continue through the glass into the room, push along the oak worktable toward the glowing display | The display | Projects |
| 2 — The corner | Continue forward, arcing right past the table to the reading corner and the window over the valley | Bookshelf / valley window | About |

Two prompt rules exist specifically to protect the chain, not the still:

- **Deep focus, not shallow.** The chaining references (worktable, display,
  reading corner) are far away and behind glass. If the establishing frame
  blurs them, leg 1 has nothing to stay consistent with and invents the room.
- **An open entrance, not a glass wall.** "Continue through the glass" is the
  riskiest move in the path — models phase through solid glass badly. The
  still specifies a frameless door slid fully open so leg 1 flies through a
  doorway, which models handle, instead of a wall, which they do not.

Aim for all three destinations to read from the establishing frame. Golden
hour plus glass means reflections may still render the interior small or
mirrored over, so this is a goal, not a guarantee — check leg 1's output
before spending on leg 2.

Only `still_1.png` is needed as a start image. Legs 1–2 chain from rendered
frames, and their section posters are extracted from the clips with ffmpeg
(free, and a better match than a separately generated still).

## What landed (job `af5202e5-c2a3-4d21-bbb9-fc0756cf383e`)

Shipped as `public/world/scene-1.jpg` (1600×1062, 529 KB, from a 2048×1360 PNG).

Every element the chain needs is present and sharp: wet boardwalk in centred
one-point perspective, glass sliders fully open, long oak worktable down the
middle, large matte display on the back wall, full-height bookshelf and low
chair in the glass corner at the right, cantilever over a misty valley. Moss,
granite, ferns, conifers. No people, text, logos, or neon.

Two deviations from the prompt, both improvements — keep them:

- It rendered overcast/blue-hour rather than golden hour. The cool forest
  makes the warm interior read far harder, which is exactly the site's
  green-plus-orange contrast.
- The display is dark rather than glowing; the amber comes from cove lighting
  behind it. More credible, and no risk of gibberish UI text. Leg 1 should
  land on the table-and-screen composition, not on a lit screen.

## Budget

Balance: **96 credits** (plus plan, eugene.vestel@gmail.com) after two stills.

Measured rates, not guesses:

- `gpt_image_2` still, 3:2 / 2k / high = **7 credits** (110 → 103 → 96). The
  skill's note of ~15 was CLI-era and is wrong for the MCP path.
- Video is still unmeasured. Preflight every leg with `get_cost: true` before
  submitting — the same call that caught the 15-vs-7 error.
- Standard 1080p was projected at 120–165 for the legs alone and does not fit;
  hence `seedance_2_0_mini`.
- Keep headroom: interiors trip Seedance's NSFW filter; budget re-rolls.

## Blockers hit (and what actually fixed them)

- **Higgsfield CLI generation is refused**: `{"error_type":"only_mcp_usage_on_trial_is_available"}`.
  The account authenticates and shows credits, but the trial permits only the
  MCP interface. → Installed the hosted MCP at `https://mcp.higgsfield.ai/mcp`
  (`claude mcp add --transport http --scope user higgsfield …`), authorized via
  `/mcp`. **MCP tools register at session start, so a restart is required
  before they can be called.**
- **Codex `image_gen` is dead here**: every model is rejected on a ChatGPT
  account (`gpt-5.6-sol`, `gpt-5.1-codex` → "not supported when using Codex
  with a ChatGPT account"). Do not retry this path.
- **Monid CLI**: not installed, not on npm under that name.

## BUILT — 2026-08-16

Chain rendered and wired. Balance **110 → 46** (2 stills at 7, 3 legs at 50).

| Leg | Job | Dur | Credits | Shipped as |
|---|---|---|---|---|
| 0 Approach | `7a72c9fc` | 8s | 20 | `public/world/vid/approach.mp4` |
| 1 Inside | `939270dc` | 6s | 15 | `public/world/vid/inside.mp4` |
| 2 Valley | `8f3b713a` | 6s | 15 | `public/world/vid/valley.mp4` |

Leg 2 was **re-planned mid-build**: the original brief sent the camera back to
the bookshelf, but leg 1 had already passed it, so returning would have reversed
across a seam. It arcs out to the misty valley instead — which is a better
ending anyway (forest → the work → back to the forest), and the bookshelf still
reads inside leg 1.

### What the model actually does (correct the skill's assumption)

`seedance_2_0_mini` echoes a `start_image` back as `reference_images`. It is a
**strong reference, not a hard frame lock**. Measured:

- still → leg 0 frame 0: **14.8 dB** (mostly the 3:2 → 16:9 reframe)
- leg 0 last → leg 1 first: **23.2 dB**
- leg 1 last → leg 2 first: **21.9 dB**

All far below the skill's ≳30 dB "frame-identical" bar, yet every seam reads as
continuous because the **composition** carries over. Judge seams by composition,
as SKILL Step 8 says; do not gate on PSNR with this model.

### Encoding

crf **26**, not the skill's 20. At 1:1 crf 26 is indistinguishable from the
source (31.4 dB) because the 720p AI footage is the ceiling, not the compression
— and it halved the payload (22 MB → 9.2 MB). Everything else per Step 6:
`-g 8`, `-an`, `+faststart`, light unsharp.

### Wiring

The skill's `mountScrollWorld` is **not** used: it is built for a standalone
page (seven layers are `position: fixed; inset: 0`), so mounting it in Home
would pin an opaque stage over Pillars/About/Socials. `src/components/ScrollWorld.tsx`
is a scoped equivalent — sticky stage in a tall container — that keeps the
engine's blob loading, seek coalescing, target lerp, and poster-until-painted.
See DESIGN.md for the contract and the measured contrast figures.

## Superseded — original next steps

1. Confirm the higgsfield MCP tools are visible (ToolSearch `higgsfield`).
2. Generate `still_1.txt` (3:2, high). Show it for approval. Report credits burned.
3. Only after approval, render the 3 legs on `seedance_2_0_mini`, sequentially,
   chaining each from the previous leg's last frame.
4. Encode per skill Step 6 (`-g 8`, crf 20, `-an`, faststart, light unsharp).
5. Wire `references/scrub-engine.js` into the home hero; theme with
   `--sw-bg`/`--sw-ink`/`--sw-accent` to match the forest/orange tokens.
6. QA seams per Step 8 — judge by composition, not raw PSNR.

## BUILT — 2026-08-19: the world across every tab

The ask: make the other tabs flow into the same nature-and-house aesthetic, so
navigating the site feels like moving through one place ("my wheel house").

**Cost: 0 credits.** Balance was **7.5** — a still is 7, a video leg 15–20, so
generating new rooms was never on the table. It turned out not to matter: the
three existing clips are one unbroken 20.1s camera flight through a single
building, which is exactly the material a connected world needs. Every tab is a
different frame of that same take, cut with ffmpeg.

### The map

| Route | Place | Frame | u |
|---|---|---|---|
| `/` | the flight itself | scrubbed 0 → 1 | — |
| `/career` | the boardwalk | approach @ 1.6s | 0.080 |
| `/expertise`, `/services` | the threshold | approach @ 6.6s | 0.328 |
| `/writing` | the reading corner | inside @ 3.2s | 0.559 |
| `/projects` | the worktable | inside @ 4.6s | 0.628 |
| `/speaking` | the screen wall | valley @ 1.4s | 0.769 |
| `/hobbies` | the overlook | valley @ 4.6s | 0.958 |

Waypoints were picked off a contact sheet of 24 frames, chosen so each room is
visibly distinct *and* semantically right — the bookshelf frame is the writing
page, the worktable is projects, the valley is off-hours.

### What shipped

- `src/world/timeline.ts` — the map, `u` ↔ `(clip, seconds)`, waypoints
- `src/world/engine.ts` — module singleton camera; survives page unmounts
- `src/world/clips.ts` — one blob cache, shared with the home film
- `src/world/useWorldEnabled.ts` — the single gate everything reads
- `src/components/WorldStage.tsx` — fixed backdrop, route travel, veils
- `src/components/Waypoint.tsx` — the page-head chip and position dot
- `public/world/wp/*.jpg` — six posters cut from the parked frames (628 KB)
- `ScrollWorld` now publishes its position, so leaving `/` mid-film flies on
  from that exact frame instead of restarting

### Measured, not assumed

- Travel `/career` → `/hobbies` sampled frame by frame: approach 1.07 → 7.99,
  handoff to inside 1.06 → 1.83, handoff to valley 3.87 → 5.15. It really does
  walk the boardwalk, cross the house, and step out to the valley in ~1.2s.
- Clips fetched **once** each across a session visiting all six tabs.
- Reduced motion / iPhone / 800px desktop: **zero** mp4 requests, no world, no
  chip, aurora untouched.
- Contrast measured on real composited pixels with the page text hidden, not
  modelled. Figures and the one `--text-faint` regression are in DESIGN.md.

### Two things the first attempt got wrong

- **A flat dim cannot do this job.** At 0.52 the interior waypoints read as
  murk. Moving the contrast work into a centred column mask let the flat dim
  drop to 0.20, which shows the room at the edges of the frame — where the
  forest and the lit glass actually are — while the text column stays dark.
- **Symmetric drift reverses the camera.** Parking at `waypoint ± DRIFT/2` meant
  arriving, then sliding backwards. Forward-only drift fixed it, and moved
  `/hobbies` from valley@5.2 to @4.6 to keep the whole drift inside the clip.

### Still priced, not built

Distinct *new* rooms — a podcast studio for `/writing`, a stage for `/speaking`,
a workshop for `/projects` — need generation: ~7 credits per still, 15–20 per
video leg, so roughly 100–130 credits to do all three properly as chained legs
off the existing flight. Worth doing only if the reused frames start feeling
repetitive.

## BUILT — 2026-08-19 (late): spent the last of the trial credits

The MCP trial was ending within the hour with **7.5 credits** left. Video legs
start at 15, so new geography was impossible. Preflighted the alternatives and
found `bytedance_image_upscale` at **2 credits** for a 4K upscale, same price at
2K, which made the best available purchase obvious: the waypoint posters were
720p frames stretched across a 1440px+ viewport.

**Spent 6 of 7.5 credits on three 4K upscales.** Picked the frames with the most
high-frequency detail, where upscaling pays: `career` (forest, moss, wet
planks), `writing` (the bookshelf), `hobbies` (misty valley, conifer edges).
`expertise`, `projects` and `speaking` are darker, smoother interiors that gain
least, and are still 720p cuts. The remaining **1.5 credits buy nothing** — one
more upscale costs 2.

The upscales are faithful, not inventive: same books, same vessels, same tree,
same layout, with real detail recovered rather than new objects hallucinated.
And no gibberish on the book spines, which is the failure mode the original
prompt's hard negatives exist to avoid.

| Poster | Before | After |
|---|---|---|
| career | 1280×720, 171 KB | 2560×1440, 434 KB |
| writing | 1280×720, 83 KB | 2560×1440, 286 KB |
| hobbies | 1280×720, 73 KB | 2560×1440, 225 KB |

### The change that made the credits count

Shipping sharper posters alone would have been pointless, and actually worse:
the 720p video takes over a few seconds after arrival, so the page would have
started sharp and then gone soft. So the handoff was inverted. `--w-still` holds
the still above the clip while the visitor is parked and looking at the room,
and releases it as the camera starts to drift, which is exactly when the veil
thickens toward 0.93. The resolution drop happens where it cannot be seen.
During a travel `--w-still` is pinned to 0, because there the moving camera is
the point.

Sampled both transitions in the browser to confirm: arrival shows a 2560-wide
still at opacity 1 over a loaded video; scrolling takes the still to 0 with the
clip drifting at 3.65s; a travel keeps the still at 0 while the camera crosses
inside 3.31 → 6.00 and valley 0.00 → 4.58, then flips to 1 the frame it settles.

### Still not built

Everything from the interactive list (the TV as a podcast viewer, the bookshelf
as projects, mementos and photos) needs **zero credits** and remains the real
work. See the pricing note above for what new rooms would cost.

## BUILT — 2026-08-19 (later): the screen plays the podcast

First of the interactive list, and it cost **0 credits** — as predicted, none of
it needed generation.

The display on the back wall of the screen-wall frame now shows *Out of the
FHIR*, and a button below it opens a real Spotify player.

### The split that makes it work

A perspective-warped iframe would be unusable and an accessibility hole, so the
two halves are separate:

- **The control** is an ordinary button in `SpeakingPage`. Keyboard, screen
  reader, phones and reduced-motion all get it, with the same player behind it.
  The world is not required for the feature to work, only to make it beautiful.
- **The plate** is decoration warped onto the panel, `pointer-events: none`,
  carrying type only.

### Getting the geometry right

Corners were read off the parked frame with a pixel grid, then drawn back over
the frame to confirm they traced the panel. They live on the waypoint as frame
fractions, so `coverProject` can replay `object-fit: cover` and keep the plate
glued at any window size. `transform-origin: 0 0` is mandatory; the default
centre origin puts the plate nowhere near the wall.

### Three bugs worth remembering

1. **A hard black line across the TV.** The page-head scrim is a radial gradient
   whose vertical radius exceeded 50% of its own box, so it was still opaque
   where the box ended and the clip drew a visible edge across everything
   behind it. Radius is now 48%.
2. **A frame of fully lit screen at the start of every travel.** The plate
   mounts inheriting the previous route's `--w-still`. Both world effects are
   now layout effects, so the suppression lands before paint.
3. **The guard latching on a mid-animation measurement.** `getBoundingClientRect`
   on the page head reads a position PageShell is still animating away from, and
   the answer was cached until the next resize. Now measured through
   `offsetParent`, which sees settled layout on the first frame, plus a re-read
   on `document.fonts.ready` because Fraunces changes the head's height.

### Verified

- 8 viewport sizes: at every size where the screen is on, no head copy sits on
  its lit area; at every size where copy would, the screen is off.
- Zero spotify.com requests on a plain visit; 29 once opened.
- Esc closes, backdrop closes, focus returns to the button, iframe unmounts.
- Travel holds the plate at 0 throughout and lifts it to 1 on arrival.
- Reduced motion and iPhone: no plate, no world, working button and player.

### Next on the list

The bookshelf as projects is the same mechanism — a `Surface` on the `/writing`
waypoint plus hotspots — and needs no new architecture. Photos and mementos need
Gene's actual images, not generated ones.
