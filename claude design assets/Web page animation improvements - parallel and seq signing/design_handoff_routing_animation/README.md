# Handoff: SignBox — Parallel vs. Sequential signing animation

## Overview
An animated diagram for the **TrustLynx SignBox** guide (https://mihailsgo.github.io/new-signbox-guide/)
contrasting the two routing modes on a single loop:

- **Sequential** — the document is routed signer→signer in a fixed order (Legal → Finance → Director). Each
  signer activates, signs, turns green, *then* the next begins. The document's three signature slots fill
  **one-by-one**.
- **Parallel** — all signers receive the document at the same time and sign independently; the document's three
  slots fill **all at once**, finishing noticeably sooner (a green "Signed" stamp drops onto the doc).

Both modes share one timeline (`--cycle`) so the speed difference is the takeaway.

## ★ Start here — the 1:1 reference build
**`signbox-routing-reference.html`** is a complete, **runnable, framework-free** implementation (plain HTML +
CSS + one small `<script>`, no build step, no dependencies except Google Fonts + the avatar images). Open it in
any browser to watch the exact animation and use the demo controls, then port it 1:1 into the Astro component.
It is the source of truth for markup, CSS, keyframes, timing, and the JS driver — everything in this README is
reflected there verbatim.

The file has demo `<select>`/`<button>` controls at the top (play/pause, zoom, look, pace) — these are **for the
demo only**; remove them when embedding and drive the same values from props/site config.

## About the other file
`SignBox Routing - Parallel vs Sequential.dc.html` is the original **design reference**. It depends on a
preview-only runtime (`support.js`, `<x-dc>`, `{{ }}` template holes), so **it will not run as-is**. Use the
reference build above for porting; this file is only for cross-checking.

## Target stack & how to port
The site is **Astro + Starlight** with `astro:view-transitions`. Recreate this as a single self-contained
**Astro component** (e.g. `src/components/SignBoxRouting.astro`):
- Copy the `#wrap` → `#frame` markup into the component.
- Move the `<style>` (keyframes + the `.demo-controls`/reduced-motion rules you keep) into the component's
  scoped `<style>`. Keyframes can be global. **All element styling is inline** in the markup — leave it inline or
  migrate to classes, your call; it works either way.
- Move the `<script>` IIFE into the component. Start it on `astro:page-load` and clear the `ResizeObserver` /
  `resize` listener on `astro:before-swap` so view-transitions don't stack observers.
- Delete the demo control bar; wire `zoom` / `look` / `pace` / play from props or hard-code the defaults
  (Extra large / Midnight glass / Standard).

## Keep the human avatars
The signer photos are intentional — **keep real human avatars**. They currently load from
`https://i.pravatar.cc/120?img=12` (Legal), `?img=47` (Finance), `?img=68` (Director).
**Before shipping, replace the pravatar URLs with your own hosted headshots** (e.g. files in `src/assets/` or
`/public/avatars/`) — same three people in both the Sequential and Parallel rows (6 `<img>` total, 2 per
person). Keep them circular, `object-fit:cover`, with the existing 2px colored ring.

---

## How it works (mechanics)
- **One CSS variable drives the clock:** `--cycle` (animation duration). Every keyframe is authored as a
  **percentage of the cycle**, so all elements stay in lockstep and the whole thing just loops.
- **Play/pause:** the `--pstate` variable (`running` | `paused`) is set on `animation-play-state` of every
  animated element. Flip the var — no animations restart.
- **Zoom:** the design is a fixed-width canvas. `zoom` picks a **reference width** (`Comfortable 1520`,
  `Standard 1360`, `Large 1200`, `Extra large 1060`). Smaller ref = components pack tighter = they render
  bigger. JS sets `frame.style.width = ref` and scales the frame to fill the wrapper.
- **Fit-to-width (fluid):** `scale = wrapper.clientWidth / ref`; applied as `transform: scale()` on the frame
  (`transform-origin: top left`), and the wrapper height is set to `1000 * scale`. A `ResizeObserver` keeps it
  correct. Net effect: fills the container width at any size, capped by the wrapper's `max-width:1280px`.
- **Look:** swaps a small palette object onto CSS vars (`--acc1/--acc2/--glow/--panel-bg/--panel-border/
  --panel-bloom/--grid-op/--grid-col`).

### Timeline (percent of --cycle)
Sequential signers complete at ~27% (Legal), ~45% (Finance), ~63% (Director); the doc signatures draw at
~33 / ~51 / ~69%; "All signed" appears ~66%. Parallel: all lines fill by ~22%, all sign ~26–34%, doc stamp
~38%, "All signed" ~42%. Everything resets in the 86→92% window. **Read the `@keyframes` in the reference file
for exact stops** — don't re-derive them.

### Pace (cycle duration)
`Calm 15s` · **`Standard 11s` (default)** · `Snappy 7s`.

---

## Design tokens

### Type
- **Manrope** 400–800 — body, names, captions
- **Space Grotesk** 500–700 — section titles, the H1, hub/"SignBox" + doc title labels
- **Space Mono** 400/700 — available for technical chips (not heavily used here)
Google Fonts: `Manrope:400,500,600,700,800 | Space Grotesk:500,600,700 | Space Mono:400,700`

### Color
| Role | Value |
|---|---|
| Page background (behind panel) | `radial-gradient(1200px 600px at 50% -10%, #eef2f9, #e1e7f1 60%, #d8dfeb)` |
| Panel background (default "Midnight glass") | `linear-gradient(165deg,#0c1326,#0a0f1f 55%,#0b1024)` |
| Accent / Signer blue | `#3D7BFF` → `#6AA1FF` (deep `#2a5fd6`) |
| Approver violet | `#8B6BFF` → `#B49BFF` |
| Success / signed green | `#2DD27E` → `#1ea862`; light `#8ff0bd`, `#7fe0ad`, `#bff3d6` |
| Document paper | `linear-gradient(160deg,#ffffff,#eaf1fb)`; slot fill `#f4f7fc` |
| Text on dark (bright/muted/label) | `#eaf0ff` / `#8da0c8` / `#bcd0ff` |
| Hairlines / glass borders | `rgba(140,165,225,.12–.22)` |
| Glass card fill | `linear-gradient(160deg, rgba(255,255,255,.08), rgba(255,255,255,.02))` |

**Look presets** (swap palettes): Midnight glass (default), Aurora bloom, Blueprint, Onyx minimal, Royal violet
— full values in the reference file's `LOOKS` object.

### Geometry
- Frame design size `ref × 1000` (ref from zoom); padding `40px`.
- SignBox hub: `62px`, radius `18px`, dashed spinning ring.
- Sequential signer card: `114px` wide; Parallel signer pill: `200px` wide.
- Avatar: `46px` (sequential) / `34px` (parallel), circular, 2px ring (blue for signers, violet for approver).
- Document: `196px` wide, radius `14px`, folded corner; three signature slots `18px` tall each.
- Connector/pipeline lines: `4px` tall, rounded; progress bars `6px`.

### Signatures
Each slot's signature is an inline SVG `<path>` (a handwriting scribble) drawn via `stroke-dasharray:180` +
animated `stroke-dashoffset` (180→0). Signer slots use `--acc1`; the Director (approver) slot uses `#8B6BFF`.
Sequential uses `sigS1/sigS2/sigS3` (staggered); parallel uses `sigP` (all together).

### Icons
All inline SVG (stroke `currentColor`/white): SignBox nodes/branch glyph, checkmarks. No icon font.

---

## Accessibility
`prefers-reduced-motion: reduce` is handled — the reference disables all animation (showing a static frame) and
the JS sets `playing=false`. Keep this behavior in the port.

## Files
- **`signbox-routing-reference.html`** — ★ the runnable 1:1 vanilla build. Port this.
- `SignBox Routing - Parallel vs Sequential.dc.html` — original design reference (does not run standalone).
