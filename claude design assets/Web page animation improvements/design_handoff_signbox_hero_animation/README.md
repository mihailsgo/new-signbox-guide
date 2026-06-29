# Handoff: SignBox Hero Signing-Flow Animation

## Overview
An animated hero for the **TrustLynx SignBox** guide (https://mihailsgo.github.io/new-signbox-guide/).
It tells the 5-step signing story on a loop: **Upload → Workflow → Recipients → Sign → Signed**.

This bundle contains a **side-by-side comparison artifact** (`BEFORE` = the current flat hero, `AFTER` = the
proposed cinematic version). **For the live page you only need the `AFTER` (improved) panel** — the `BEFORE`
panel exists purely to show the contrast. Everything below documents the `AFTER` design.

## ★ Start here — the 1:1 reference build
**`signbox-hero-reference.html`** is a complete, **runnable, framework-free** implementation of the AFTER hero
(plain HTML + CSS + one `<script>`, no build step, no dependencies except Google Fonts). Open it in any browser
to watch the exact animation, then port it 1:1 into the Astro component. It is the source of truth for markup,
CSS, easing, timing, and the JS driver — everything in this README is reflected there verbatim.

- All motion is driven by a single integer `step` (0–4) in the `<script>` at the bottom; read `render()` for the
  exact per-element style mapping per step.
- A `CONFIG` block at the top exposes `ACCENT` (Signal blue / Royal violet / Emerald) and `PACE`
  (Calm / Standard / Snappy).
- `prefers-reduced-motion` is already handled (shows the finished state, no loop).
- **Porting to Astro:** copy the `.hero` markup into `SignBoxHero.astro`, move the `<style>` into the component's
  scoped style block, and move the `<script>` IIFE into a `<script>` tag (or run it on `astro:page-load` and
  clear the interval on `astro:before-swap` so view-transitions don't stack timers).

## About the Design Files
`signbox-hero-reference.html` is runnable vanilla code (port this). `SignBox Hero - Current vs Improved.dc.html`
is the original **design reference** showing both BEFORE and AFTER side-by-side; it was authored as a "Design
Component" and depends on a preview-only runtime (`support.js`, `<x-dc>`, `{{ }}` template holes), so **it will
not run as-is** — use it only to eyeball the BEFORE/AFTER contrast.

The site is **Astro + Starlight** (with `astro:view-transitions` enabled). The task is to **recreate this
design natively in that stack** — recommended as a single self-contained **Astro component**
(e.g. `src/components/SignBoxHero.astro`) using scoped `<style>` + a small vanilla `<script>` (no React, no DC
runtime). All motion here is plain CSS transitions/keyframes driven by one integer `step` state, so it ports
cleanly to vanilla JS. Drop the component into the existing hero slot / `index.mdx` splash.

## Fidelity
**High-fidelity.** Exact colors, type, spacing, timing, and easing are specified below — recreate the `AFTER`
panel pixel-for-pixel, then theme it with SignBox brand tokens where they exist.

---

## Structure of the AFTER panel
A dark "stage" with two stacked regions:

1. **Step rail** (top, ~150px tall): 5 nodes connected by a progress line, plus a small PDF chip that glides
   along the line to the active node. Past nodes = green/done, current node = glowing brand-blue + scaled up,
   upcoming = faint.
2. **Stage** (fills the rest): the active step's detailed scene. All 5 scenes are mounted and stacked
   (absolute, `inset:0`); only the active one is `opacity:1`, the rest fade/blur out.

A header above both shows `Step N of 5 · <title>`, a progress bar, and a **Pause/Play** button.

### Timeline / state
- Single state variable: `step` (0–4), advanced on an interval, wrapping `4 → 0`.
- **Pace (interval):** Calm `3400ms`, **Standard `2600ms` (default)**, Snappy `1800ms`.
- Pause/Play stops/starts the interval.
- Everything (rail, scenes, header) is derived from `step` in one render pass, so the two panels stay in sync.

### Easing (use verbatim)
- `ease  = cubic-bezier(.22, 1, .36, 1)`  — standard smooth
- `spring = cubic-bezier(.34, 1.5, .5, 1)` — playful overshoot

### Per-property transitions
- Rail orb: `all .6s spring`
- Rail progress fill: `width .8s ease`
- Traveling PDF chip: `left .8s spring`
- Stage glow parallax: `transform 1s ease` (`translate(-step*10px, -step*4px)`)
- Scene enter (active): `opacity/transform/filter .75s ease` — from `{opacity:0; translateY(30px) scale(.965); blur(7px)}` to `{opacity:1; translateY(0) scale(1); blur(0)}`
- Scene leave (inactive): same but `.55s` and `pointer-events:none`
- **Seal stamp (step 4):** `transform: scale(1.8) rotate(-12deg); opacity:0` → `scale(1) rotate(-12deg); opacity:1`, `.55s spring` with `.15s` delay
- **Signature draw (step 4):** SVG path `stroke-dasharray:330`, `stroke-dashoffset:330 → 0`, `1.15s ease` with `.35s` delay

### Keyframes (ambient, always running)
```css
@keyframes sbFloat   { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-9px)} }
@keyframes sbPulse   { 0%,100%{box-shadow:0 0 0 0 rgba(61,123,255,.5)} 70%,100%{box-shadow:0 0 0 16px rgba(61,123,255,0)} }
@keyframes sbSweep   { 0%{transform:translateX(-130%) skewX(-18deg)} 100%{transform:translateX(360%) skewX(-18deg)} }
@keyframes sbFlow    { to {background-position:14px 0} }                 /* dashed pipeline flow */
@keyframes sbProg    { 0%{width:6%} 55%{width:88%} 100%{width:88%} }     /* upload progress bar */
@keyframes sbTwinkle { 0%,100%{opacity:.15;transform:scale(.6)} 50%{opacity:.9;transform:scale(1.15)} }
@keyframes sbDrift   { 0%{transform:translate(0,0)} 100%{transform:translate(26px,-30px)} }
@keyframes sbSpin    { to {transform:rotate(360deg)} }                    /* engine dashed ring */
```
Ambient extras in the stage: a faint 34px grid, a soft radial blue glow top-left + green glow bottom-right, a
slow light "sweep" bar (`sbSweep`), and ~6 floating particle dots (`sbTwinkle`/`sbDrift`). These can be toggled
off (the design exposes an `ambient` boolean).

---

## Scenes (the stage content per step)

**Step 0 — Upload.** A glassy dashed drop-card containing a floating PDF page (white→`#dbe6ff`, folded corner),
filename `Agreement.pdf · 248 KB`, a blue progress bar looping via `sbProg`, caption "Drop a PDF or Word file to begin".

**Step 1 — Workflow.** A horizontal pipeline with labels under each block:
- left: a small **Document** (PDF chip)
- animated dashed flow line (`sbFlow`)
- center: the **SignBox** engine — a 94px rounded-square blue tile with a nodes icon, a slowly spinning dashed ring (`sbSpin`), label "Sets routing + profile"
- another flow line
- right: **Recipients** — three small rows, each `avatar + name + order badge`: `Legal (1)`, `Finance (2)`, `Director (3)` (1/2 blue, 3 violet = approver)

**Step 2 — Recipients & Roles.** Three glass cards (floating, staggered `sbFloat` delays): photo avatar + name +
role chip — `Legal · Signer · must sign`, `Finance · Signer · must sign`, `Director · Approver · approves`
(signers blue, approver violet). Each avatar has a green "online" status dot.

**Step 3 — Sign (National e-ID).** A floating dark phone mock showing a **Smart-ID** screen: lock glyph + title,
"Enter PIN2 to sign", four filled violet PIN dots (glowing), then a green confirmation block with a pulsing
check (`sbPulse`) reading "Signature applied".

**Step 4 — Signed document.** The payoff:
- left: a compact "sealed layers" legend with green checks — `Original document`, `Digital signature`, `Trusted timestamp`, `Validation · CRL/OCSP` (staggered `translateX`)
- center/right: the **Agreement.pdf** page. A blue ink **signature draws itself** across the signature line (label "Signed by · Legal", footer `Smart-ID · PIN2` / `2026-06-26`), and a circular green **QES "VALID · eIDAS" seal stamps** onto the top-right corner with an overshoot.
- bottom chips (mono font): `ASiC-E`, `XAdES-LT`, `QES`

---

## Design Tokens

### Type
- **Manrope** 400–800 — body, names, captions
- **Space Grotesk** 500–700 — titles, the big "Step N of 5", engine/seal labels
- **Space Mono** 400/700 — technical chips (QES, XAdES-LT, ASiC-E), document footer dates
Google Fonts: `Manrope:400,500,600,700,800 | Space Grotesk:500,600,700 | Space Mono:400,700`

### Color
| Role | Value |
|---|---|
| Stage background | `linear-gradient(165deg,#0c1326,#0a0f1f 55%,#0b1024)` |
| Brand blue (primary) | `#3D7BFF` → `#6AA1FF` (gradients), deep `#2a5fd6` |
| Approver violet | `#8B6BFF` → `#B49BFF` |
| Success / valid green | `#2DD27E` → `#23b76d` / `#1ea862`; light `#7fe0ad`, `#8ff0bd`, `#bff3d6` |
| Timestamp gold | `#F5C451` |
| Text (bright) | `#eaf0ff` / `#dfe7fb` |
| Text (muted) | `#8da0c8` |
| Text (label/blue) | `#bcd0ff` |
| Text (faint/upcoming) | `rgba(170,182,212,.5)` |
| Hairlines / card borders | `rgba(140,165,225,.12–.2)` |
| Glass card fill | `linear-gradient(160deg, rgba(255,255,255,.08), rgba(255,255,255,.02))` |
| Brand glow | `rgba(61,123,255, .14–.55)` |

**Optional accent theming** (the design exposes an `accent` switch — pick one, or wire to brand):
`Signal blue` `#3D7BFF/#6AA1FF` · `Royal violet` `#8B6BFF/#B49BFF` · `Emerald` `#16C784/#4BE0A8`.
Only the rail orbs, progress fill and traveling chip recolor with the accent; scene internals stay blue.

### Geometry
- Rail orb: `52px`, radius `16px`; active `scale(1.16)`; done `border-radius` stays, green fill.
- Node positions: `left = (i/4)*100%` inside a track inset `44px` each side, `translateX(-50%)`.
- Progress fill width: `(step/4)*100%`; traveling chip `left` same formula.
- Glass cards radius `16–18px`; document page `~202×252`, radius `13px`.
- Seal circle `98px` (in the document scene), radius `50%`.

### Shadows
- Active orb: `0 0 0 6px rgba(61,123,255,.16), 0 16px 34px rgba(61,123,255,.55)`
- Done orb: `0 10px 22px rgba(45,210,126,.4)`
- Glass card: `0 16px 32px -16px rgba(0,0,0,.6)`
- Document: `0 28px 54px -18px rgba(0,0,0,.75), 0 0 0 1px rgba(255,255,255,.35)`
- Seal: `0 0 0 5px rgba(45,210,126,.2), 0 20px 40px rgba(45,210,126,.55), inset 0 2px 6px rgba(255,255,255,.35)`

---

## Assets
- **Icons** are inline SVGs (stroke `currentColor`, 1.7–1.9 stroke-width): upload tray, nodes/branch, users,
  shield-check, badge-check/seal, padlock, checkmark. No icon font needed — copy the SVG paths from the source file.
- **Avatars** currently use placeholder photos from `https://i.pravatar.cc/...?img=12|47|68`.
  **Replace these** with real TrustLynx headshots / illustrated avatars, or your own asset pipeline, before
  shipping — do not depend on pravatar in production.
- **Logo / fonts:** use the site's existing font loading; the SignBox logos already in the repo
  (`trustlynx-logo*.png`) are unaffected.

## Integration notes (Astro / Starlight)
- Build as one `.astro` component with scoped `<style>` (keyframes can be `:global` if needed) and a
  `<script>` that: reads a `pace` const, runs `setInterval` to bump `step`, and toggles a `data-step` attribute
  / classes on the root so CSS transitions fire. Drive scene visibility with `[data-step="N"]` selectors rather
  than per-element inline styles.
- Respect `prefers-reduced-motion`: pause the interval and show step 4 (the finished state) statically.
- The hero is sized `1640×960` in the artifact for the comparison; in the page make the stage **fluid width**
  (max-width container) and keep the rail/stage proportions — it is not meant to be a fixed 1640px block.
- It plays well with `astro:view-transitions`: start the interval on `astro:page-load`, clear it on
  `astro:before-swap` to avoid duplicate timers.

## Files
- **`signbox-hero-reference.html`** — ★ the runnable 1:1 vanilla build. Port this. Contains the exact markup,
  scoped-able CSS, all keyframes, and the JS `step` driver with a `CONFIG` block.
- `SignBox Hero - Current vs Improved.dc.html` — the original side-by-side design reference (BEFORE vs AFTER).
  Does not run standalone; use it to compare against the current flat hero. The AFTER scenes here match the
  reference build exactly.
