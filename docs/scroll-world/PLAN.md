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

## Camera architecture — A (continuous forward walkthrough)

All three scenes are inside **one room** and the camera only ever moves
inward, so this is Architecture A, not the diorama fly-through:

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
| 0 — Arrive | Glide forward from the doorway into the studio, past the long oak worktable; settle drifting toward the desk | Mid-room, desk ahead | Hero — *Build things. Make them better.* |
| 1 — The desk | Continue the drift forward, push in close on the glowing laptop until the screen dominates | The laptop screen | Projects |
| 2 — The shelf | Continue forward, arcing left past the desk to the bookshelf corner, settle on the reading chair | Bookshelf corner | About |

Only `still_1.png` is needed as a start image. Legs 1–2 chain from rendered
frames, and their section posters are extracted from the clips with ffmpeg
(free, and a better match than a separately generated still).

## Budget

Balance at time of writing: **110 credits** (plus plan, eugene.vestel@gmail.com).
Observed rates: still ≈ 15, Standard video ≈ 40–55, mini ≈ ¼ of Standard.

- 1 still (~15) + 3 mini legs (~30–42) = **~45–57 credits**, ~41–52% of balance.
- Standard 1080p would be 120–165 for the legs alone — does not fit.
- Keep headroom: interiors trip Seedance's NSFW filter; budget re-rolls.

**Calibrate, don't guess** — diff `higgsfield workspace list` before/after the
first still and the first leg, then extrapolate.

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

## Next session — start here

1. Confirm the higgsfield MCP tools are visible (ToolSearch `higgsfield`).
2. Generate `still_1.txt` (3:2, high). Show it for approval. Report credits burned.
3. Only after approval, render the 3 legs on `seedance_2_0_mini`, sequentially,
   chaining each from the previous leg's last frame.
4. Encode per skill Step 6 (`-g 8`, crf 20, `-an`, faststart, light unsharp).
5. Wire `references/scrub-engine.js` into the home hero; theme with
   `--sw-bg`/`--sw-ink`/`--sw-accent` to match the forest/orange tokens.
6. QA seams per Step 8 — judge by composition, not raw PSNR.
