# Handoff: Employee Onboarding Animation ("How it works" section)

## Overview
An attractive, horizontal **left → right** animation for the "How it works" section
(the **"Example · Hiring a new employee"** block) of the TrustLynx SignBox website.

A small avatar carries a document along a five-stop track. As it reaches each stop,
that step's node and card light up in sequence — visually narrating how an employee's
document is onboarded from upload to a sealed, verifiable signature. It ends with an
"Onboarded!" badge and a confetti burst.

The animation **plays once when the section scrolls into view** and is built with
**pure CSS keyframes + a tiny vanilla `IntersectionObserver`** — no animation library,
no framework dependency. It is designed to drop into the existing **Astro** site.

## About the Design Files
The files in this bundle are **design references created in HTML** — a working prototype
showing the intended look and behavior, not a finished component wired to your codebase.

`onboarding-animation.html` is **already framework-agnostic, self-contained vanilla
HTML/CSS/JS** (no React, no build step). The goal is a **1:1 visual recreation** in the
site, so you can either:
- **Lift the markup + CSS + script verbatim** into an Astro component (recommended — see
  "How to integrate" below), or
- Recreate it using the site's existing component patterns, keeping every value identical.

`OnboardingAnimation.dc.html` is the original prototype (uses a React-based preview
runtime) — included only as a secondary reference. **Use the standalone file for porting.**

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, timing, and easing are all
locked in. Recreate pixel-for-pixel and keep the exact hex values, delays, and keyframes.

## How to integrate (Astro)
1. Drop the markup (`<div class="om-onboard">…</div>`) into an Astro component, e.g.
   `src/components/OnboardingAnimation.astro`, replacing the current static 5-step block.
2. Move the contents of the `<style>` block into the component's `<style is:global>` (or a
   scoped `<style>` — all selectors are already namespaced under `.om-onboard` / `.om-*`,
   so global is safe and won't leak).
3. Move the `<script>` (IIFE) into a `<script>` tag in the component. It is plain DOM JS
   and runs client-side; no hydration directive needed since it's not a framework island.
4. The fonts use **Manrope** via Google Fonts `<link>`. If the site already loads Manrope
   (or you prefer the site's heading font), delete the `<link>` and change
   `font-family` on `.om-onboard` to `inherit` to adopt the page's typeface automatically.

The component is fully responsive in width up to `max-width:1100px`; below ~800px it keeps
a `min-width:760px` on the track and will scroll horizontally inside its container. If you
need a small-screen treatment, wrap `.om-scene` in an `overflow-x:auto` container, or ask
for a stacked mobile variant.

## The Scene / View
**Name:** Onboarding animation (replaces the static 5-step "How it works" example).
**Purpose:** Visually explain the SignBox employee-hiring flow in one glance.
**Layout:**
- Outer card: `max-width:1100px`, centered, `padding:34px 40px 30px`, `border-radius:20px`,
  background `#0E131D`, `1px` border `rgba(255,255,255,.08)`, `overflow:hidden`.
- Header: amber eyebrow line + one grey subtitle line.
- Below it, a `position:relative` **scene** `height:360px`, `min-width:760px`.
- A horizontal **rail** sits at `top:130px`, inset `left:10% right:10%`, `height:6px`.
- **Five station dots** centered on the rail at `left: 10% / 30% / 50% / 70% / 90%`.
- **Five step cards** hang below the rail at `top:172px`, each centered on the same
  `left` percentages (`transform:translateX(-50%)`), `width:165px`, text-centered, with a
  vertical connector line up to the rail.
- The **avatar** (52×80px) walks across the top at `top:56px`.

### Components & exact values

**Eyebrow** — text `Example · Hiring a new employee`; `font-weight:700`,
`font-size:13px`, `letter-spacing:.16em`, `text-transform:uppercase`, color `#E0A43B` (amber).

**Subtitle** — `Watch one document travel from HR to a sealed, independently verifiable signature.`;
`font-size:15px`, color `#94A0B5`, `max-width:640px`, `margin-top:8px`.

**Rail** — track `background:rgba(255,255,255,.08)`, `border-radius:6px`. Fill bar
`background:linear-gradient(90deg,#4F8EF7,#8B5CF6 55%,#34D399)`, animates `width` 0→100%
in stepped jumps synced to the avatar (keyframe `om-fill`, 9s linear).

**Station dots** — 16×16px circles, `box-shadow:0 0 0 4px #0E131D` (cut-out ring). Start
`#2A3344`; on arrival pop to their step color with a glow (keyframe `om-dot`). Per-dot
`--c` color and `animation-delay` (see timeline).

**Avatar** — flat-style figure made of divs: indigo body `#4F8EF7`, skin `#E8B98F`, dark
hair `#2A2320`, navy legs `#1B2740`, two arm shades `#3D74D6` / `#5C97F5`, and a small
white **document** (`#EEF3FB`) held in the front hand. Continuous bob + leg/arm swing while
walking; horizontal position driven by keyframe `om-walk` (9s) in the same stepped rhythm.

**Step cards** — each has:
- Connector line `width:2px height:30px`, grey→step-color on activation (`om-conn`).
- Icon tile `46×46px`, `border-radius:13px`. Idle: `background:rgba(255,255,255,.06)`,
  icon color `#6B7689`. Active: fills with `--c`, icon goes `#0B0F18`, gains
  `box-shadow:0 6px 18px -4px var(--c)`, with a springy scale pop (`om-icon`).
- "Step N" label `font-size:11px`, `letter-spacing:.1em`, uppercase, grey→`--c` (`om-label`).
- Title `font-size:15px`, `font-weight:700`, color `#F1F4FA`.
- Description `font-size:12.5px`, `line-height:1.45`, color `#8B97AC`.
- Whole card lifts `translateY(-9px)` and goes `opacity .4→1` on activation (`om-card`).

The five steps (icon · color · title · description):
1. Upload (arrow-into-tray) · `#4F8EF7` · **Upload agreement** — HR uploads the employment agreement.
2. Envelope · `#6E78F2` · **Signing link sent** — A secure link arrives by email — no account needed.
3. Phone-check · `#8B5CF6` · **Verified & signed** — Identity confirmed and signed on their phone with Smart-ID.
4. Activity-pulse · `#5FB89A` · **Status auto-updates** — HR sees the status update automatically.
5. Shield-check · `#34D399` · **Sealed & verifiable** — The signed file is stored and independently verifiable.

> Note: step copy was written to fit the SignBox flow shown on the page. Adjust wording to
> match your final site copy if it differs — only the text in `.om-title` / `.om-desc` and
> the eyebrow/subtitle need changing; structure and timing stay the same.

**"Onboarded!" badge** — green pill `#34D399`, text `#062B1C`, check icon, appears at the
final stop with a spring scale-in (`om-badge`, delay 7.7s).

**Confetti** — 22 small divs (mix of circles + rects) in the palette colors, burst radially
from the final stop (`om-confetti`, staggered ~7.6s). Generated by the script.

## Interactions & Behavior
- **Trigger:** `IntersectionObserver` at `threshold:0.35`; on first intersection the scene's
  `--om-ps` custom property flips `paused → running`, starting every animation. Plays **once**
  (observer unobserves the element). No loop.
- **Mechanism:** every animated element has `animation-play-state:var(--om-ps,paused)`, so all
  animations are pre-armed and paused until the observer sets `--om-ps:running` on the scene.
- **Total duration:** 9s.
- **Easing:** card/dot/icon/badge pops use `cubic-bezier(.34,1.56,.64,1)` (springy overshoot);
  rail fill and avatar walk use `ease-in-out` / `linear`.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` disables all animation and
  shows the **completed** end-state (avatar at the end, all cards lit, badge visible).
- **Fallback:** if `IntersectionObserver` is unavailable, the script starts the scene immediately.

## Timeline (animation-delay per stop, seconds)
| Stop | Dot | Card / icon / label / connector |
|---|---|---|
| 1 | 0.7 | 0.7 |
| 2 | 2.5 | 2.5 |
| 3 | 4.1 | 4.1 |
| 4 | 5.8 | 5.8 |
| 5 | 7.4 | 7.4 |

Badge: 7.7s. Confetti: ~7.6s + small per-piece stagger. The avatar's `om-walk` and the rail's
`om-fill` keyframes hit each stop's percentage at these same moments (encoded as keyframe %
of the 9s run).

## State Management
None required — it is a fire-once CSS animation gated by one observer. No app state, no data
fetching. If you want it to replay (e.g. on a "watch again" button), reset by removing and
re-adding the scene element, or set `--om-ps:paused`, force reflow, then `--om-ps:running`.

## Design Tokens
**Colors**
- Card background `#0E131D`; page behind (demo) `#070A11`; border `rgba(255,255,255,.08)`.
- Amber accent (eyebrow / badge text bg-contrast) `#E0A43B`.
- Step / rail gradient: `#4F8EF7` (blue) → `#6E78F2` → `#8B5CF6` (purple) → `#5FB89A` → `#34D399` (green).
- Text: heading `#F1F4FA`, body `#8B97AC`, subtitle `#94A0B5`, idle label/icon `#6B7689`.
- Idle surfaces: icon tile `rgba(255,255,255,.06)`, connector/track `rgba(255,255,255,.08–.1)`,
  dot idle `#2A3344`.

**Typography** — Manrope (400–800). Sizes: 30/15/13/12.5/11px as noted per element.

**Radius** — card `20px`, icon tile `13px`, dots `50%`, pills `999px`.

**Shadow** — active icon `0 6px 18px -4px var(--c)`; badge `0 8px 22px -6px rgba(52,211,153,.6)`;
active dot glow `0 0 14px 1px var(--c)`.

**Spacing** — card padding `34px 40px 30px`; scene height `360px`; rail top `130px`;
cards top `172px`; avatar top `56px`; stop positions `10/30/50/70/90%`.

## Assets
- **Icons:** inline SVGs (Lucide-style strokes), no external icon dependency. Swap freely for
  the site's existing icon set if preferred — keep `22×22`, `stroke-width:2`.
- **Avatar:** built entirely from divs (no image asset).
- **Font:** Manrope via Google Fonts (or inherit the site font — see "How to integrate").

## Files
- `onboarding-animation.html` — **the standalone, port-ready reference** (markup + CSS + JS).
- `OnboardingAnimation.dc.html` — original prototype (preview-runtime version, secondary reference).
