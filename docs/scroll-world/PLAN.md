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
