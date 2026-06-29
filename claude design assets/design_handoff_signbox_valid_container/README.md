# Handoff: SignBox "What Makes a Signature Legally Valid" Animation

## Overview
A looping, self-running animated infographic for the TrustLynx SignBox marketing/product page. It explains how a legally-valid e-signature is built from four stacked layers that seal into a single **ASiC-E** container, valid long-term under **eIDAS**.

The animation runs on a continuous loop (~13s). Over one cycle, four layers drop into the container one at a time (each earning a green check), the matching explanation row on the right brightens, and at the end a circular **VALID** seal stamps onto the container with a green scan-beam and glow. Then it resets and repeats.

## About the Design Files
The file in this bundle — `SignBox Valid Container.dc.html` — is a **design reference created in HTML**. It is a prototype showing the intended look and behavior, **not production code to copy directly**. It is authored in a proprietary "Design Component" format (`<x-dc>` + a logic class), so it will not run as-is in a normal app.

The task is to **recreate this design in the target codebase's existing environment** (React/Vue/Svelte/plain JS, etc.) using its established patterns and libraries. If no front-end environment exists yet, choose the most appropriate one for the project and implement there. The visual structure is plain HTML + inline CSS + CSS `@keyframes`, so it ports cleanly to any framework — the animation logic is pure CSS, driven by a single `--cycle` duration variable.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, layout, and animation timing are all specified below and should be recreated pixel-accurately. Adapt only where the host design system already defines equivalent tokens.

## Layout

The design has three nested regions inside a fixed **1360 × 900 px** art-board (it is scaled to fit its container via a transform; see Responsive Behavior).

```
┌─ frame (1360×900, padding 40px, light radial bg) ─────────────────┐
│  HEADER  (eyebrow + H1 left,  supporting paragraph right)         │
│                                                                   │
│  PANEL  (dark glass card, flex row, gap 48px, border-radius 22px) │
│   ┌── LEFT (width 430px) ──────┐   ┌── RIGHT (flex:1, max 520) ─┐ │
│   │  ASiC-E container card      │   │  "Each layer adds legal    │ │
│   │   • Validation data (top)   │   │   weight" label            │ │
│   │   • Trusted timestamp       │   │  • Original document row   │ │
│   │   • Digital signature       │   │  • Digital signature row   │ │
│   │   • Original document (btm) │   │  • Trusted timestamp row   │ │
│   │  + VALID seal (top-right)   │   │  • Validation data row     │ │
│   │  container chips below      │   │  + final "Long-term valid" │ │
│   └─────────────────────────────┘   └────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘
```

- **Frame**: `display:flex; flex-direction:column; padding:40px;` Background `radial-gradient(1200px 600px at 50% -10%, #eef2f9, #e1e7f1 60%, #d8dfeb)`. Font `'Manrope', system-ui, sans-serif`.
- **Header**: `display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:22px`.
- **Panel**: `position:relative; flex:1; border-radius:22px; padding:34px 40px; display:flex; gap:48px; align-items:center; overflow:hidden`. Dark glass background (default "Midnight glass": `linear-gradient(165deg,#0c1326 0%,#0a0f1f 55%,#0b1024 100%)`), `border:1px solid rgba(120,150,220,.14)`, `box-shadow:0 30px 70px -30px rgba(10,16,36,.8), inset 0 1px 0 rgba(255,255,255,.05)`. Contains three absolutely-positioned decorative overlays (bloom radial-gradient, faint 34px grid, and a slow diagonal light sweep), plus optional ambient floating dots.
- **Left column**: `flex:none; width:430px; display:flex; flex-direction:column; align-items:center; gap:18px`.
- **Right column**: `flex:1; min-width:0; max-width:520px`.

## Components

### Header
- **Eyebrow**: a 9×9px rounded gradient dot (`linear-gradient(135deg,#3D7BFF,#6AA1FF)`, `border-radius:3px`) + text `TrustLynx SignBox · legally-valid container` — 12.5px, weight 700, letter-spacing 1.6px, uppercase, color `#6B7689`. gap 10px, margin-bottom 10px.
- **H1**: `What makes a signature legally valid` — font `'Space Grotesk'`, 34px, weight 700, letter-spacing -0.5px, color `#141B2B`.
- **Supporting paragraph** (right, max-width 330px, right-aligned): 13px, weight 600, line-height 1.5, color `#5b6b85`: "Four layers stack into one sealed **ASiC-E** container — valid long-term under **eIDAS**." (bolded terms color `#141B2B`).

### Left: ASiC-E container card
- Card: `width:400px; border-radius:20px; padding:22px 22px 24px; background:linear-gradient(160deg, rgba(255,255,255,.05), rgba(255,255,255,.015)); border:1px solid rgba(140,165,225,.16); box-shadow:inset 0 1px 0 rgba(255,255,255,.06)`. Gentle float animation (`sbFloat`, 6s ease-in-out infinite, ±7px translateY).
- **Card header row**: folder icon (17px, stroke `#8da0c8`) + `ASiC-E container` (Space Grotesk, 13px, 700, `#dfe7fb`) + right-aligned `Agreement.asice` (Space Mono, 10px, `#8da0c8`). margin-bottom 16px.
- **Four layer rows** (`display:flex; flex-direction:column; gap:11px`). Visual stack order top→bottom is Validation, Timestamp, Signature, Document — but they animate in **bottom-up** (Document first). Each row: `display:flex; align-items:center; gap:13px; padding:13px 15px; border-radius:13px`, tinted background `linear-gradient(160deg, <accent>/.12, <accent>/.03)`, `border:1px solid <accent>/.3`, `border-left:4px solid <accent>`. Each contains:
  - 38×38px rounded icon tile (`border-radius:10px`, accent gradient fill, white/dark stroke icon, accent glow shadow).
  - Title (13.5px, 700, `#eaf0ff`) + subtitle (11px, `#9fb0cf`).
  - A monospace tag chip (Space Mono, 9.5px, 700) on the right.
  - A 22px green circular **check badge** at `top:-7px; right:-7px` (`linear-gradient(150deg,#2DD27E,#1ea862)`, white check, glow shadow) that pops in when the layer settles.

  Layer details:
  | Layer | Accent | Title / subtitle | Tag |
  |---|---|---|---|
  | Original document | `#3D7BFF` (blue) | Original document / `Agreement.pdf · the content` | `PDF` |
  | Digital signature | `#8B6BFF` (violet) | Digital signature / `XAdES · identifies the signer` | `B` |
  | Trusted timestamp | `#F5C451` (amber) | Trusted timestamp / `Qualified TSA · proves when` | `T` |
  | Validation data | `#2DD27E` (green) | Validation data / `CRL / OCSP revocation proof` | `LT` |

- **VALID seal** (absolute `top:8px; right:8px`): 88×88px circle, `linear-gradient(150deg,#2DD27E,#1ea862)`, white border `2px solid rgba(255,255,255,.5)`, layered shadow `0 0 0 5px rgba(45,210,126,.2), 0 18px 36px rgba(45,210,126,.5), inset 0 2px 6px rgba(255,255,255,.35)`. Contents: 26px white check, `VALID` (Space Grotesk, 12px, 700, letter-spacing 1px, white), `QES · eIDAS` (7.5px, 700, `#d6ffe7`). Stamps in near the end of the cycle.
- **Container chips** (below card, gap 8px): `ASiC-E`, `XAdES-LT` (blue chips), `QES` (green chip). Space Mono 10.5px, padding 4px 9px, border-radius 6px. Fade up at end of cycle.

### Right: "Each layer adds legal weight"
- Section label: 11px, weight 800, letter-spacing 1.2px, uppercase, color `#8da0c8`, margin-bottom 20px.
- **Four explanation rows** (`display:flex; flex-direction:column; gap:14px`), in order Document → Signature → Timestamp → Validation. Each: 34×34px rounded icon tile (`border-radius:9px`, accent-tinted bg + border, accent-colored stroke icon) + title (15px, 700, `#eaf0ff`, with a colored qualifier span) + description (12.5px, `#9fb0cf`, margin-top 2px). Each row sits at 28% opacity and brightens to 100% when its layer drops.
  - Original document — *the content* (`#6AA1FF`): "The exact file everyone agrees to. Everything else binds to this."
  - Digital signature — *who* (`#b49bff`): "A qualified XAdES signature ties a verified identity (Smart-ID, eID) to the file."
  - Trusted timestamp — *when* (`#f6d488`): "A qualified TSA proves the signature existed at a specific moment in time."
  - Validation data — *still valid* (`#7fe0ad`): "Embedded CRL/OCSP proof keeps it verifiable for years (LT — long-term)."
- **Final conclusion bar** (margin-top 22px): `display:flex; align-items:center; gap:14px; padding:16px 18px; border-radius:14px; background:linear-gradient(160deg,rgba(45,210,126,.14),rgba(45,210,126,.04)); border:1px solid rgba(45,210,126,.4)`. 40px green shield-check tile + title `Long-term legally valid` (Space Grotesk, 15px, 800, `#bff3d6`) + subtitle "A qualified electronic signature (QES) — equivalent to a handwritten one under eIDAS." (12.5px, `#9fcfb4`). Fades up at end of cycle.

## Interactions & Behavior

This is a **non-interactive, auto-looping** display. All motion is CSS `@keyframes` driven off one timeline duration `--cycle` (default 13s). The keyframe percentages below are fractions of that cycle. Easing is `linear` for the timeline keyframes (so percentages map directly to time), `ease-in-out` for ambient/float loops.

**Timeline (% of cycle):**
- **0–9%** — Document layer drops in (slides from +34px / scale .96 → settled), its check pops at ~10% (overshoot scale 1.25 → 1.0 at 13%), right-side Document row brightens.
- **25–32%** — Signature layer drops, check at ~32%, Signature row brightens.
- **47–54%** — Timestamp layer drops, check at ~54%, Timestamp row brightens.
- **69–76%** — Validation layer drops, check at ~76%, Validation row brightens.
- **84–91%** — Seal moment: green border glow fades in on the container, a green scan-beam sweeps top→bottom, the VALID seal stamps (scale 1.7 rotate -12° → scale 1, stays rotated -12°), container chips and the final conclusion bar fade up.
- **96–100%** — Everything fades out and the loop resets.

**Named keyframes in source** (recreate equivalents): `layD/layS/layT/layV` (layer drop-ins), `ckD/ckS/ckT/ckV` (per-layer check pops), `rowD/rowS/rowT/rowV` (right-side row brighten, .28 → 1 opacity), `sealGlow`, `sweepBeam`, `sealStamp`, `chipsIn`, `finalRow`. Plus ambient loops: `sbFloat` (card bob), `sbSweep` (panel light sweep, 8s), `sbTwinkle` / `sbDrift` (ambient dots).

**Play/pause**: the prototype exposes a `--pstate` variable (`running`/`paused`) applied to every `animation-play-state`. In production, wire this to pause when off-screen (IntersectionObserver) and respect `prefers-reduced-motion: reduce` (render the final, fully-sealed state with no motion).

## State Management
Minimal. The animation itself is pure CSS — no JS state required to run it. The prototype's logic class only handles:
- **Configurable props** (optional to port; see Design Tokens / Variants): `pace`, `look`, `zoom`, `ambient`.
- **playing** boolean → toggles `--pstate`.
- **fit-to-width scaling** via ResizeObserver (see below).

If reproduced in a component framework, the only real state needed is play/pause (+ reduced-motion) and the chosen visual variant.

## Responsive Behavior
The design is a fixed 1360×900 art-board scaled to fit its parent's width. The prototype measures the wrapper width, sets `frame.style.transform = scale(wrapperWidth / refWidth)` and sets the wrapper height to `900 * scale`, keeping aspect ratio. `refWidth` depends on the `zoom` prop: Comfortable 1520, Standard 1360, Large 1200, Extra large 1060 (smaller ref = larger apparent content).

In production, prefer a responsive reflow if the host page needs it (e.g. stack the left/right columns under ~900px), otherwise the transform-scale approach is fine for a fixed widget. Keep `transform-origin:top left`.

## Design Tokens

**Accent colors**
- Blue (document): `#3D7BFF`, light `#6AA1FF`
- Violet (signature): `#8B6BFF`, light `#B49BFF` / `#b49bff`
- Amber (timestamp): `#F5C451`, light `#f6d488`
- Green (validation / valid): `#2DD27E`, deep `#1ea862`, light `#7fe0ad` / `#8ff0bd`

**Text colors (on dark panel)**: titles `#eaf0ff`, body `#9fb0cf`, muted/labels `#8da0c8`, container-header `#dfe7fb`.
**Text colors (on light frame)**: H1 `#141B2B`, eyebrow `#6B7689`, paragraph `#5b6b85`.
**Frame background**: `radial-gradient(1200px 600px at 50% -10%, #eef2f9, #e1e7f1 60%, #d8dfeb)`.

**Typography**
- Display / labels in caps: `'Space Grotesk'` (500/600/700)
- Body / UI: `'Manrope'` (400/500/600/700/800)
- Monospace tags & filenames: `'Space Mono'` (400/700)
- (Google Fonts; substitute the host's equivalents if it has a type system.)

**Radii**: frame N/A, panel 22px, container card 20px, layer rows 13px, icon tiles 9–11px, chips 5–6px, badges/seal 50%.
**Spacing**: panel gap 48px, layer-row gap 11px, right-row gap 14px, panel padding 34/40px, frame padding 40px.
**Key shadows**: panel `0 30px 70px -30px rgba(10,16,36,.8)`; icon tiles `0 8px 18px <accent>/.4`; seal `0 0 0 5px rgba(45,210,126,.2), 0 18px 36px rgba(45,210,126,.5), inset 0 2px 6px rgba(255,255,255,.35)`.
**Timeline duration `--cycle`**: Calm 18s · Standard 13s · Snappy 9s (default 13s).

### Optional visual variants (`look` prop)
The prototype offers five panel themes by swapping a handful of CSS vars (`--acc1/--acc2/--glow/--panel-bg/--panel-border/--panel-bloom/--grid-op/--grid-col`): **Midnight glass** (default, blue), **Aurora bloom** (blue/violet), **Blueprint** (teal, strong grid), **Onyx minimal** (near-black, faint), **Royal violet** (purple). The full var values per theme are in the source `applyVars()` method. Porting these is optional — Midnight glass is the canonical look.

## Assets
**No raster/image assets.** All icons are inline SVG (folder, shield-check, clock, signature scribble, document, checkmark) drawn with `stroke="currentColor"` / accent strokes, 1.8–3.2 stroke-width, rounded caps/joins. Reuse the host codebase's icon set where equivalents exist (shield-check, clock, file, pen/signature, folder, check). Fonts are Google Fonts (see Typography).

## Files
- `SignBox Valid Container.dc.html` — the full design reference (markup + CSS keyframes + the variant/scaling logic class). Read the `<helmet><style>` block for the exact `@keyframes`, the body markup for structure, and the trailing `<script>` for variant token values and the fit-scale logic.
