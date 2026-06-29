# Handoff: SignBox — Process Lifecycle (Draft → Started → Completed → Finished)

## Overview
An animated diagram for the **TrustLynx SignBox** guide (https://mihailsgo.github.io/new-signbox-guide/)
showing a signing process advance through its four lifecycle states on a single loop:

**Draft → Started → Completed → Finished.**

As the loop runs, a single document **visibly evolves**: its status badge changes (DRAFT → IN PROGRESS →
COMPLETED → FINISHED), a "DRAFT" watermark fades out, a signature **draws itself** onto the page during
*Started*, an "All 3 parties signed" row appears at *Completed*, and a green **VALID / QES · eIDAS** seal
stamps onto the corner at *Finished* (with ASiC-E / XAdES-LT / QES container chips). A synced **process
timeline** log on the right reveals one event per state.

## ★ Start here — the 1:1 reference build
**`signbox-lifecycle-reference.html`** is a complete, **runnable, framework-free** implementation (plain HTML +
CSS + one small `<script>`, no build step, no dependencies except Google Fonts). Open it in any browser to watch
the exact animation and use the demo controls, then port it 1:1 into the Astro component. It is the source of
truth for markup, CSS, keyframes, timing, and the JS driver — everything in this README is reflected there
verbatim.

The demo `<select>`/`<button>` bar at the top is **for the demo only** — remove it when embedding and drive the
same values from props/site config.

## About the other file
`SignBox Process Lifecycle.dc.html` is the original **design reference**. It depends on a preview-only runtime
(`support.js`, `<x-dc>`, `{{ }}` template holes), so **it will not run as-is**. Use the reference build above for
porting; this file is only for cross-checking.

## Target stack & how to port
The site is **Astro + Starlight** with `astro:view-transitions`. Recreate this as a single self-contained
**Astro component** (e.g. `src/components/SignBoxLifecycle.astro`):
- Copy the `#wrap` → `#frame` markup into the component.
- Move the `<style>` (keyframes + reduced-motion rule) into the component's scoped `<style>`. Keyframes can be
  global. All element styling is inline in the markup — leave it inline or migrate to classes; both work.
- Move the `<script>` IIFE into the component. Start it on `astro:page-load`; clear the `ResizeObserver` /
  `resize` listener on `astro:before-swap` so view-transitions don't stack observers.
- Delete the demo control bar; wire `zoom` / `look` / `pace` / play from props or hard-code the defaults
  (Standard / Midnight glass / Standard).

---

## How it works (mechanics)
- **One CSS variable drives the clock:** `--cycle` (animation duration). Every keyframe is authored as a
  **percentage of the cycle**, so all elements stay in lockstep and the whole thing just loops.
- **Play/pause:** the `--pstate` variable (`running` | `paused`) is set on `animation-play-state` of every
  animated element. Flip the var — nothing restarts.
- **Zoom:** the design is a fixed-width canvas. `zoom` picks a **reference width** (`Comfortable 1520`,
  `Standard 1360` (default), `Large 1200`, `Extra large 1060`). Smaller ref = tighter packing = bigger
  components. JS sets `frame.style.width = ref` then scales.
- **Fit-to-width (fluid):** `scale = wrapper.clientWidth / ref`, applied as `transform: scale()` on the frame
  (`transform-origin: top left`); wrapper height set to `940 * scale`. A `ResizeObserver` keeps it correct.
  Capped by the wrapper's `max-width:1280px`.
- **Look:** swaps a palette onto CSS vars (`--acc1/--acc2/--glow/--panel-bg/--panel-border/--panel-bloom/
  --grid-op/--grid-col`).

### State machine — the 4 phases (percent of --cycle)
Each state occupies one quarter of the loop; a brief 96→100% window resets everything for a seamless repeat.
- **Draft** 0–25% — gray node active; DRAFT watermark + DRAFT badge visible; log entry 1 in at ~4%.
- **Started** 25–50% — blue node; IN PROGRESS badge; the document signature **draws** (27→44%); log 2 at ~28%.
- **Completed** 50–75% — violet node; COMPLETED badge; "All 3 parties signed" row in (~53%); log 3 at ~53%.
- **Finished** 75–97% — green node; FINISHED badge; VALID seal stamps (78%) + container chips (80%); log 4 ~78%.
The rail's progress fill and traveling document token advance to the active node at each transition; each node
pulses (ring) only during its own phase, then stays colored ("reached") for the rest of the loop.

**Read the `@keyframes` in the reference file for exact stops** — don't re-derive them. Key animation names:
`lcFill` (rail fill), `lcTravel` (token), `reach1–4` (node reached), `act1–4` (node active ring gate),
`bD/bS/bC/bF` (badge + watermark crossfades), `docSig` (signature draw), `compRow`, `sealStamp`, `chipsIn`,
`log1–4` (timeline entries).

### Pace (cycle duration)
`Calm 18s` · **`Standard 13s` (default)** · `Snappy 9s`.

---

## Design tokens

### Type
- **Manrope** 400–800 — body, names, captions
- **Space Grotesk** 500–700 — H1, document title, node labels, VALID seal, status badges
- **Space Mono** 400/700 — timestamps, container chips, doc footer
Google Fonts: `Manrope:400,500,600,700,800 | Space Grotesk:500,600,700 | Space Mono:400,700`

### Color — the four state colors are semantic (do not theme these)
| State | Color |
|---|---|
| Draft | `#8DA0C8` → `#6f82a8` (slate) |
| Started / in-progress | `#3D7BFF` → `#6AA1FF` (accent blue — *this one* recolors with Look) |
| Completed | `#8B6BFF` → `#b49bff` (violet) |
| Finished / valid | `#2DD27E` → `#1ea862` (green) |

Other tokens: page bg `radial-gradient(1200px 600px at 50% -10%, #eef2f9, #e1e7f1 60%, #d8dfeb)`; panel bg
(default Midnight glass) `linear-gradient(165deg,#0c1326,#0a0f1f 55%,#0b1024)`; document paper
`linear-gradient(160deg,#ffffff,#eaf1fb)`; text bright `#eaf0ff`, muted `#8da0c8`, label `#bcd0ff`; glass
borders `rgba(140,165,225,.12–.2)`.

**Look presets** (panel theming only): Midnight glass (default), Aurora bloom, Blueprint, Onyx minimal, Royal
violet — full values in the reference file's `LOOKS` object. Note: only the `--acc*`/`--glow` (Started state +
rail) follow the Look; Draft/Completed/Finished stay semantic.

### Geometry
- Frame design size `ref × 940` (ref from zoom); padding `40px`; panel radius `22px`.
- Rail: track inset `70px`; nodes `50px` circles at `0 / 33.33 / 66.66 / 100%`; traveling token `30×38px`.
- Document: `280 × 354px`, radius `16px`, folded corner, `50px` top padding (keeps the badge above the title).
- Seal: `92px` circle. Timeline node dots: `28px`.

### Icons
All inline SVG (stroke `currentColor`): pencil (Draft), paper-plane (Started), double-check (Completed),
shield-check (Finished), check (seal). No icon font.

> Note: this animation uses **no avatar photos** (unlike the routing animation) — the parties are referenced by
> role text only. Nothing to swap.

## Accessibility
`prefers-reduced-motion: reduce` is handled — the reference disables all animation (static frame) and sets
`playing=false`. Keep this in the port.

## Files
- **`signbox-lifecycle-reference.html`** — ★ the runnable 1:1 vanilla build. Port this.
- `SignBox Process Lifecycle.dc.html` — original design reference (does not run standalone).
