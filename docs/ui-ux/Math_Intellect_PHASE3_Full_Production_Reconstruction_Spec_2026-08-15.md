# Math Intellect — Phase 3 Full Production Frontend Reconstruction Specification
## Complete implementation contract for Codex
### 15 August 2026

**Repository:** `analyticsmath/MathIntellect`  
**Audited branch:** `main`  
**Audited remote HEAD:** `c8d2a686da134df1c460502a6f3ec68afda03723`  
**Scope:** complete frontend reconstruction only. Backend, database, API semantics, authentication semantics, simulation engines, persistence, scoring/progression, realtime contracts and server-side behavior are protected unless a frontend compatibility defect makes a minimal change unavoidable.  
**Status:** design is complete. This document is implementation authority, not another exploration brief.

---

# 0. Read order and authority

Codex must **not edit production code before reading the governing documents fully**.

Read in this order:

1. `docs/ui-ux/Valtum_UI_UX_Frontend_Brain_MASTER_WITH_C54_C55_MATH_INTELLECT_2026-08-15.md`
2. this document, `PHASE3_FULL_PRODUCTION_RECONSTRUCTION_SPEC.md`
3. current frontend source named in the source audit sections below
4. current API/types/hooks/services used by those routes

If the Brain is not already in the Math Intellect repository, copy the canonical file into:

```text
docs/ui-ux/Valtum_UI_UX_Frontend_Brain_MASTER_WITH_C54_C55_MATH_INTELLECT_2026-08-15.md
```

Recommended location for this specification:

```text
docs/ui-ux/math-intellect/PHASE3_FULL_PRODUCTION_RECONSTRUCTION_SPEC.md
```

### Supersession

For Math Intellect frontend decisions:

- this Phase 3 specification supersedes the current rendered frontend and all old visual/layout decisions;
- C54/C55 and the latest Master Brain remain binding negative/positive design doctrine;
- existing backend/API/product truth wins over any visual idea;
- if old frontend code conflicts with this specification, rebuild the frontend representation rather than preserving legacy presentation;
- passing TypeScript, lint or build does **not** constitute design acceptance.

---

# 1. Mission

Reconstruct the entire visible Math Intellect frontend so it is credible as:

- a top-tier Valtum portfolio case study;
- a premium product suitable for serious high-value client scrutiny;
- an award-submission-caliber digital experience in visual design, usability, mobile craft, motion, performance and product specificity;
- a real mathematical workbench rather than an AI/SaaS template.

The redesign is a **complete frontend rebuild**, not a patch and not a reskin.

The visual frontend that exists today is negative evidence. Do not preserve its composition simply because components already exist.

Preserve product logic where it is correct. Re-author the visible experience.

---

# 2. Core product thesis

Math Intellect is a mathematical simulation and decision workbench with adaptive interpretation/progression layers.

Its native transformation is:

```text
real system
→ structure
→ assumptions
→ mathematical model
→ simulation
→ evidence
→ interpretation
→ comparison / decision
→ changed assumptions
→ rerun
```

The visual north star is:

> **Scientific Editorial × Real Systems × Living Mathematics**

The experience must feel intelligent because the mathematics is legible and manipulable — not because the interface uses blue/purple light, neural imagery, glass panels, fake telemetry or “intelligence” language.

---

# 3. Non-negotiable complete-rebuild boundary

## 3.1 Do not preserve the old visual frontend

The following are **not** design foundations:

- old hero;
- `IntelligenceSurfaceScene` / neural orb;
- dark navy/cyan/violet identity;
- global gradients and glows;
- `premium-card` as a macro pattern;
- `MarketingCard` tilt behavior;
- old header/footer composition;
- section kickers/dashes;
- fake `Live` states;
- trusted-metric strips;
- generic feature grids;
- “Mission Command” / “Intelligence Cockpit” / “Engine Fleet” language;
- execution tunnel / cinematic launch overlay;
- generic `Overview / Charts / 3D` result IA;
- glass mobile dock;
- auth orbs/glass auth card;
- generic fade-up reveal system;
- cursor-follow glow;
- ripple-everywhere;
- card-lift hover language;
- page-level `overflow-x:hidden` used as geometry concealment;
- hard-coded community theatre;
- random/fabricated preview metrics;
- fake ROI / fake authority metrics.

## 3.2 What may survive

Preserve or refactor, where technically correct:

- React 19 + TypeScript + Vite architecture;
- React Router route behavior;
- auth session logic and protected-route behavior;
- API client and service layer;
- `VITE_API_URL`, `VITE_WS_URL`, `VITE_APP_NAME`, `VITE_ENV` semantics;
- simulation API contracts and actual engine request shapes;
- realtime Socket.IO integration;
- saved-model behavior;
- profile/progression behavior backed by API truth;
- chart parsing / geometry / responsive measurement where correct;
- 3D returned-data renderer engineering where correct;
- device-capability / reduced-motion / cleanup patterns where useful;
- error boundaries and honest loading/error states;
- accessible native form semantics.

Do **not** rewrite backend or database to fit the new UI.

---

# 4. Current verified source baseline

The current frontend package uses:

```text
React 19.2.x
React DOM 19.2.x
React Router DOM 7.14.x
TypeScript 6.0.x
Vite 8.0.x
GSAP 3.13.x
Three.js 0.183.x
Axios
Socket.IO Client
TailwindCSS 3.4.x
```

Current route shell lives in:

```text
frontend/src/App.tsx
```

Current public source areas:

```text
frontend/src/marketing/components/
frontend/src/marketing/pages/
frontend/src/marketing/sections/
frontend/src/marketing/three/
```

Current protected-page wrappers:

```text
frontend/src/app/pages/
```

Actual protected screens:

```text
frontend/src/pages/DashboardPage.tsx
frontend/src/pages/SimulationPage.tsx
frontend/src/pages/AnalyticsPage.tsx
frontend/src/pages/FeedPage.tsx
frontend/src/pages/ProfilePage.tsx
```

Current application shell:

```text
frontend/src/layouts/MainLayout.tsx
frontend/src/layouts/Sidebar.tsx
frontend/src/layouts/Topbar.tsx
frontend/src/layouts/MobileDock.tsx
frontend/src/layouts/PageShell.tsx
```

Current major data/rendering infrastructure:

```text
frontend/src/components/charts/ChartRenderer.tsx
frontend/src/components/charts/ChartsTabPanel.tsx
frontend/src/components/charts/ThreeDTabPanel.tsx
frontend/src/components/charts/chartTheme.ts
frontend/src/components/simulation/SimulationForm.tsx
frontend/src/components/simulation/SimulationCard.tsx
frontend/src/components/simulation/forms/*
frontend/src/hooks/*
frontend/src/services/*
frontend/src/types/*
```

The implementation must inspect the current local working tree before changing files. If local HEAD is newer than the audited remote HEAD above, treat the local current source as canonical and reconcile this specification against it before editing.

---

# 5. Forbidden visual language — hard failure list

The following patterns are automatic rejection unless this document explicitly authorizes a narrowly defined instance.

## 5.1 TEXT–CONTAINER–CARD LOOP

Never create:

```text
heading
paragraph
rounded/bordered container
heading
paragraph
4 equal cards
another heading
another paragraph
3 cards
CTA card
```

Changing card color, radius, shadow, animation or arrangement does not change the information architecture.

## 5.2 Intelligence Theater

Never use as product identity:

- glowing AI orb;
- neural sphere;
- particle intelligence core;
- blue-purple bloom;
- “Live” pulsing dot without real live state;
- fake system health;
- fake telemetry;
- fake confidence/prediction;
- fake throughput;
- fake user/community counts;
- fake social proof;
- fake “AI is thinking” progress;
- fake scanner overlays;
- random quantitative animation.

## 5.3 Technology costume

Never imply technicality through:

- mono font everywhere;
- uppercase tracked micro-labels everywhere;
- cyan hairlines;
- terminal/chrome motifs;
- grids as decorative wallpaper;
- “command center” language;
- military/space mission metaphors;
- WebGL simply because it looks advanced.

## 5.4 Template hero

Never rebuild:

```text
left: headline + paragraph + CTA
right: rectangular image / product mockup / 3D object
```

The new hero is the **Systems Atlas** and must follow the exact composition logic in this specification.

## 5.5 Microinteraction soup

Do not globally apply:

- fade-up on every section;
- card tilt;
- ripple on every button;
- hover-lift everywhere;
- cursor glow;
- ambient floating;
- generic shimmer;
- count-up animation for ordinary numbers;
- springy tooltips for decoration.

## 5.6 Concealment

No page-level `overflow-x:hidden` / `overflow-x:clip` as a fix for layout defects. Fix the owning actor.

Local clipping is permitted only where a visual stage semantically requires clipping.

---

# 6. New frontend visual foundation

## 6.1 Identity palette

Replace the current dark/gradient token system with this high-luminance neutral foundation:

```css
--mi-canvas: #F4F6F5;
--mi-paper: #FFFFFF;
--mi-ink: #111412;
--mi-ink-2: #2D3330;
--mi-text: #505753;
--mi-muted: #78807C;
--mi-rule: #D8DDDA;
--mi-rule-strong: #BAC1BD;
--mi-surface-soft: #ECEFEE;

--mi-change: #E35A35;
--mi-focus: #2457E6;
--mi-success: #23755B;
--mi-warning: #9D6814;
--mi-danger: #B64049;
```

Rules:

- no gradients anywhere as identity treatment;
- no permanent cyan/violet/green/lime brand accent;
- `--mi-change` is a state/data-change signal, **not** decorative brand paint;
- charts have an independent accessible data-color system;
- success/warning/danger are semantic only;
- default public and app world is high-luminance neutral;
- do not introduce a default full-site dark mode in this reconstruction. If existing user settings contain theme data, do not break those contracts, but do not let legacy dark visuals dictate the new design. A future fully designed dark mode is separate work.

## 6.2 Surfaces

Do not define a universal “premium surface”.

Use boundaries only when information is truly independent/selectable/actionable.

Allowed bounded-object examples:

- a saved-model row/item;
- a discrete feed entry;
- a popover;
- a sheet/dialog;
- a selected input editor;
- a mobile bottom sheet;
- a table row group;
- a genuine data comparison object.

Public narrative chapters should mostly use open composition, media, mathematical fields, typography and whitespace rather than card shells.

## 6.3 Radius

No universal 24–28px radius system.

Recommended functional scale:

```css
--mi-radius-xs: 4px;
--mi-radius-sm: 8px;
--mi-radius-md: 12px;
--mi-radius-lg: 18px;
```

Use `0` for major photography when editorial composition is stronger without rounding.

Avoid pill-shaped containers unless the control semantically benefits from pill geometry (rare).

## 6.4 Shadows

Default major composition uses **little to no shadow**.

Use shadow only for real elevation: floating sheet, menu, dialog, transient overlay.

No cyan/brand glow.

---

# 7. Typography system

## 7.1 Intended family

**Primary:** ABC Diatype family  
**Mathematical notation:** STIX2 via MathJax 4 where equation rendering is required.

### Licensing rule

Codex must **not scrape, download or embed unlicensed commercial font files**.

If licensed ABC Diatype webfont files are already available locally in the repository or supplied by the user, integrate them with correct `@font-face`, preload only critical cuts, and use WOFF2.

If the files are not available:

- implement the complete type-token system using a neutral fallback stack during engineering;
- keep the intended family names/tokens ready for substitution;
- explicitly report `ABC Diatype licensed files required for final visual acceptance`;
- do not silently replace Diatype with Sora, Inter, Mona Sans, Poppins, Space Grotesk or another trendy font and call the design final.

Suggested fallback during implementation only:

```css
font-family: Arial, "Helvetica Neue", sans-serif;
```

This fallback is not final art approval.

## 7.2 Roles

- Diatype Regular: body, controls, navigation, reading.
- Diatype Medium: selective hierarchy/emphasis.
- Diatype Semi Mono: sparse technical metadata only — simulation IDs, exact compact parameter fingerprints, timestamps where alignment benefits.
- STIX2: actual mathematical expressions/formulas, not decorative labels.

No decorative programmer mono.

## 7.3 Type scale

Target ranges:

| Role | 1440/large | 1366×768 | 390 mobile |
|---|---:|---:|---:|
| Hero display | 82–92px | 72–78px | 50–56px |
| Major chapter | 54–64px | 48–56px | 36–42px |
| Public subhead | 26–32px | 24–28px | 24–28px |
| Public body | 17–18px | 16–17px | 16px |
| App page title | 30–34px | 28–32px | 24–28px |
| App section | 20–24px | 20–22px | 19–22px |
| Task/body | 15–16px | 15–16px | 16px |
| Parameter labels | 13–14px | 13–14px | 13–14px |
| Metadata | 12–13px | 12–13px | 12px |
| Major numeric result | 48–64px | 42–56px | 36–46px |

Use fluid `clamp()` only where it preserves deliberate line breaks and viewport budgets.

Avoid 700/800/900 as default hierarchy. Most hierarchy should be regular/medium plus scale/spacing/position.

No tiny uppercase eyebrow system.

---

# 8. Mathematical typography and MathJax

Add MathJax only for pages/components that require formal mathematical typesetting.

Official package: `mathjax@4`.

Implementation rules:

- do not load MathJax globally into the initial homepage bundle if no formula is visible above the fold;
- lazy-load it for Method / Explain / formula-rich states;
- use accessible MathJax output/exploration where practical;
- do not render formulas as PNG/SVG screenshots;
- do not use formulas decoratively to make the site look mathematical.

If integration complexity risks the core reconstruction, keep simple inline equations as semantic text temporarily and isolate MathJax behind a `MathExpression` component so it can be finalized without touching app logic.

---

# 9. Motion technology ownership

## 9.1 Add Anime.js

Install from the official `animejs` npm package.

Use Anime.js only for local/product-native mathematical interactions:

- direct draggable assumption controls where enhancement is needed;
- SVG path drawing/morphing;
- deterministic trajectory/field transitions;
- parameter-to-visual propagation;
- local compare transitions.

Do not create a second global animation architecture.

## 9.2 GSAP + ScrollTrigger

Retain GSAP.

Use ScrollTrigger only for:

1. desktop `World → Structure` handoff if it genuinely benefits from an owned sequence;
2. desktop Model Worlds persistent-stage progression;
3. Evidence transformation if a persistent owned timeline is materially better than native scrolling.

Do not pin every chapter.

No global ScrollSmoother.

## 9.3 Three.js

Retain Three.js only for real returned 3D data:

- surface;
- scatter 3D;
- multi-trace state space.

Delete the decorative marketing intelligence sphere when no legitimate consumer remains.

## 9.4 React / CSS

React owns real state.

CSS owns ordinary focus/hover/pressed/disabled feedback.

Scroll never chooses a user's simulation parameter or answer.

## 9.5 Motion verbs

All branded motion must map to one of:

- **Propagate** — input changes linked representations;
- **Accumulate** — paths/samples build evidence;
- **Resolve** — running/noisy state settles to result;
- **Compare** — A/B states align and differences become visible;
- **Inspect** — exact evidence appears on user intent;
- **Carry** — one actor persists across scene/state/route;
- **Explain** — formula/annotation connects to evidence.

If a proposed animation cannot be justified by one of these verbs or ordinary UI feedback, remove it.

---

# 10. Responsive design targets

Primary acceptance sizes:

```text
1920×1080
1440×900
1366×768
1024×768
768×1024
430×932
390×844
375×812
360×800
320×568
```

Critical quality gates:

- 1366×768 — compact laptop; no viewport-budget failures;
- 390×844 — primary phone art direction;
- 320×568 — no hidden critical action or clipped task state.

Mobile must be recomposed, not desktop stacked.

---

# 11. Media system — selected production sources

The public site uses a restrained set of high-resolution editorial system photography.

Do not hotlink remote files in production. Download legally permitted originals and create local responsive derivatives.

## MI-01 — Systems Atlas dominant

**Source:** Haim Charbit, Unsplash  
**Page:** `https://unsplash.com/photos/aerial-view-of-a-complex-highway-interchange-sTfJ10a5-CM`  
**Role:** dominant hero world; engineered flow, crossings, branching, density.  
**Usage:** hero + first scroll carry.  
**Crop:** wide desktop; independently art-directed mobile portrait crop.  
**Priority:** high/early.

## MI-02 — Strategy / human system

**Source:** ommy, Pexels  
**Page:** `https://www.pexels.com/photo/aerial-view-of-crowd-in-sunny-porto-plaza-33710818/`  
**Role:** human agents and spatial interaction without staged corporate imagery.

## MI-03 — Analytical detail

**Source:** Ron Lach, Pexels  
**Page:** `https://www.pexels.com/photo/mans-hands-on-drawing-accessories-9617889/`  
**Role:** close physical reasoning/detail actor; may appear in hero foreground and/or later human-scale release.  
**Do not:** turn it into a normal card.

## MI-04 — World → Structure bridge

**Source:** Bernd Dittrich, Unsplash  
**Page:** `https://unsplash.com/photos/an-aerial-view-of-a-highway-intersection-in-a-city-40lOEmDssF8`  
**Role:** alternate engineered/environmental system for handoff/chapter bridge.

## MI-05 — Uncertainty world

**Source:** Cosmin Andrei Buzamat, Unsplash  
**Page:** `https://unsplash.com/photos/aerial-view-of-a-river-delta-with-branching-streams-2Mt6dVvoLLs/`  
**Role:** branching/variation metaphor supporting the deterministic illustrative uncertainty model.  
**Fallback:** if the exact source cannot be verified/downloaded under the intended license at implementation time, **do not substitute generic stock**. Report the missing asset and use MI-01/MI-04 crop temporarily until design authority supplies a replacement.

## MI-06 — Dynamics world

**Source:** Daniel Miksha, Unsplash  
**Page:** `https://unsplash.com/photos/aerial-view-of-stacked-shipping-containers-at-a-port-37mW7MvAOvU`  
**Role:** logistics/state flow, movement through an organized system.

## MI-07 — Interaction world

**Source:** Lara Farber, Pexels  
**Page:** `https://www.pexels.com/photo/aerial-view-of-people-gathering-near-park-28898230/`  
**Role:** multi-agent spatial environment.

## MI-08 — Method/final detail

**Source:** ThisIsEngineering, Pexels  
**Page:** `https://www.pexels.com/photo/civil-engineer-looking-at-blueprint-3862628/`  
**Role:** human reasoning / method / final release.

## 11.1 Asset naming

Create a local media registry with semantic filenames, for example:

```text
frontend/src/assets/media/math-intellect/
  systems-atlas-highway/
  strategy-porto-plaza/
  analytical-drafting-detail/
  structure-highway-river/
  uncertainty-river-delta/
  dynamics-container-port/
  interaction-park-agents/
  method-blueprint/
```

Derivatives should use width/source descriptors, e.g.:

```text
mi-01-hero-640.avif
mi-01-hero-960.avif
mi-01-hero-1440.avif
mi-01-hero-1920.avif
mi-01-hero-mobile-640.avif
...
```

Do not create dozens of redundant derivatives. Generate sizes based on actual rendered geometry.

## 11.2 Responsive image contract

Every major image must define:

- source/creator/license page;
- local filename;
- intrinsic width/height;
- desktop crop;
- mobile crop/source;
- focal point;
- `srcset` / `sizes`;
- AVIF + WebP, fallback as warranted;
- eager/lazy behavior;
- `fetchpriority` only where appropriate;
- alt intent;
- transition role;
- reduced-motion behavior.

Do not lazy-load the true LCP image.

Do not preload all Model World images at startup.

---

# 12. Deterministic public model demos

The public experience may demonstrate mathematics, but it may not fabricate authority or random intelligence.

All illustrative public models must:

- be explicitly identified as illustrative/demo;
- use deterministic fixed seeds where pseudo-random sequences are required;
- produce stable results across reloads/builds;
- have formulas/parameters that match the visual behavior;
- never be presented as a forecast, customer result or actual user simulation.

## 12.1 Uncertainty / Monte Carlo

Use a seeded discrete stochastic process:

```text
x_t = x_(t-1) + μ·Δt + σ·sqrt(Δt)·ε_t
```

Fixed defaults:

- start = 0;
- μ = small fixed drift or 0;
- Δt = fixed;
- deterministic PRNG seed;
- N paths chosen for performance and clarity;
- primary user control: `σ`.

Visual outputs:

- path ensemble;
- endpoint density/distribution;
- threshold/tail selection;
- exact probability derived from the deterministic sample.

No random values on render.

## 12.2 Strategy / Game Theory

Use an explicitly defined 2×2 zero-sum matrix whose mixed equilibrium can be calculated deterministically.

User changes one payoff term or controlled scalar.

Visual outputs:

- payoff relationship;
- best-response/equilibrium position;
- mixed-strategy probability change;
- one concise annotation.

Avoid decorative chess imagery.

## 12.3 Dynamics / Market

Use a deterministic seeded AR(1)-style illustrative process:

```text
x_t = ρ·x_(t-1) + ε_t
```

Primary user control: `ρ` persistence.

Visual outputs:

- time-series state;
- range/variation;
- persistence/regime visual behavior.

Label as illustrative process, not market forecast.

## 12.4 Interaction / Conflict

Use a deterministic seeded agent-alignment / neighborhood interaction illustration.

Primary user control: interaction radius `r` or coupling strength.

Visual outputs:

- agent trajectories;
- local interactions;
- global order/coherence metric if correctly derived from the model.

Do not invent “success probability”.

## 12.5 Build / Custom

Do not invent another demo model.

This world transitions to the real Product Model Builder.

---

# 13. Public routing reconstruction

## 13.1 New public IA

Target routes:

```text
/
/models
/workbench
/method
/login
/signup
```

Protected routes remain:

```text
/app
/app/simulations/new
/app/analytics/:id
/app/feed
/app/profile
```

## 13.2 Legacy redirects

Preserve compatibility:

```text
/features  -> /models
/product   -> /workbench
/pricing   -> /workbench   (temporary until verified billing/product tier truth exists)
/simulations/new -> /app/simulations/new
/analytics/:id -> /app/analytics/:id
```

Do not ship invented pricing just to keep `/pricing` visually populated.

## 13.3 App.tsx

Rebuild route imports and route experience handling.

Preserve:

- BrowserRouter;
- Suspense/lazy route loading;
- ProtectedRoute semantics;
- PublicOnlyRoute semantics;
- scroll restoration/history logic where correct;
- API error notification behavior, but restyle it.

Remove:

- global `useMicroInteractions(location.pathname)`;
- legacy public page imports after redirects/replacements;
- visual hard-coding in `PageLoader` / `ApiErrorToast` based on removed tokens.

Do not implement arbitrary global route zoom/fade for every route. Route transitions should be minimal and contextual.

---

# 14. Public header

## 14.1 Opening state

Header belongs to the Systems Atlas world.

Desktop target:

```text
Math Intellect                      Models   Method   Workbench   Sign in
```

Rules:

- no floating capsule;
- no separate nav slab;
- no decorative divider line;
- no gradient logo mark;
- no tiny tagline;
- no “Live”; no system status;
- wordmark may be text-first until a separately authored brand mark exists.

## 14.2 Released state

After hero release, header may become sticky with opaque/high-luminance background when needed for readability.

Transition ownership should be tied to the hero's actual release state, not an arbitrary global `scrollY > 20` aesthetic threshold.

## 14.3 Mobile

Approx. 58–62px visual zone.

Wordmark left, menu right; workbench action may be visible if geometry allows.

Menu uses accessible dialog/drawer behavior; no glass/neon.

---

# 15. Homepage — seven authored chapters

The homepage is not built from a repeated `<SectionHeader /> + <CardGrid />` primitive.

Each chapter has a different silhouette and information behavior.

## Chapter 01 — Systems Atlas

### Purpose

Establish Math Intellect through real systems and editorial spatial composition.

### Copy

**Headline:** `Model what changes.`

**Support:** `Build simulations for uncertainty, strategy, markets and interacting systems. Inspect the mathematics behind every result.`

**Primary CTA:** `Open workbench`

**Secondary CTA:** `Explore models`

### Desktop 1440×900

- `min-height: 100svh`;
- outer gutters around 48–56px;
- integrated header;
- MI-01 dominant image around 48–54vw visual width and 58–68svh height;
- MI-03 close detail actor around 13–17vw visual width;
- one structural/diagrammatic actor foreshadowing the next transformation;
- typography uses open negative space — no fixed 50/50 grid;
- major image may leave right/top edge;
- no default rounded card framing;
- no metrics strip;
- no hero model/graph as protagonist;
- no old Three.js marketing scene.

### 1366×768

- hero must fit as a composed field without requiring the user to scroll simply to see the headline/CTA;
- title target 72–78px;
- reduce secondary-image pressure before shrinking the dominant image too far;
- all essential controls visible in the opening viewport.

### 390×844

- 18–20px gutters;
- portrait art-directed MI-01 crop;
- title 50–56px;
- third desktop actor may be removed;
- CTA remains reachable without awkward overlap;
- no forced absolute-position collage that clips at 375/360/320.

### Motion

Entry is restrained: media establishes, typography establishes, then stops.

No perpetual floating.

---

## Chapter 02 — World → Structure

### Purpose

Show the conceptual transition from physical system to modelable structure.

### Rule

This is **editorial analogy**, not computer vision or a claimed product feature.

### States

```text
world
→ attention
→ structure
→ model language
→ release
```

Photography decreases in dominance while selected authored lines/relationships gain hierarchy.

Never show scanner lines, object-detection boxes, HUD grids or fake inference labels.

### Desktop motion

May use a short owned ScrollTrigger sequence.

The final structural actor becomes the first visual material of Model Worlds.

### Mobile

Short natural-scroll handoff; no long pin.

### Reduced motion

Static world image followed by resolved structural illustration.

---

## Chapter 03 — Model Worlds

### Purpose

Demonstrate the five real engine families without feature cards.

### Worlds

1. Uncertainty — Monte Carlo
2. Strategy — Game Theory
3. Dynamics — Market
4. Interaction — Conflict
5. Build — Custom/product handoff

### Desktop stage

One viewport-height persistent stage.

Active world receives 55–65% of visual pressure.

Neighboring worlds remain partial context at unequal scales.

Never use same-sized rail cards.

### Required state labels

Implement semantic labels/states, e.g.:

```text
uncertainty-establish
uncertainty-dwell
strategy-transition
strategy-establish
strategy-dwell
dynamics-transition
dynamics-establish
dynamics-dwell
interaction-transition
interaction-establish
interaction-dwell
build-transition
build-establish
build-dwell
release
```

A stable dwell exists after each establish state.

Direct world controls map to the same states/timeline rather than creating a second state machine.

### Uncertainty

Media: MI-05 / MI-01-compatible system imagery.  
Math: deterministic path ensemble → distribution → tail.  
Verb: **Accumulate / Resolve**.  
Copy: `Vary uncertainty. Inspect the spread.`

### Strategy

Media: MI-02.  
Math: defined payoff relationship/equilibrium.  
Verb: **Rebalance** (implemented through Compare/Propagate grammar; do not add a new global motion brand).  
Copy: `Change a payoff. Watch equilibrium move.`

### Dynamics

Media: MI-06.  
Math: deterministic time/process state.  
Verb: **Propagate/Evolve**.  
Copy: `Change persistence. Follow the state through time.`

### Interaction

Media: MI-07.  
Math: deterministic agent interaction/trajectory field.  
Verb: **Propagate**.  
Copy: `Change the rule. See the system reorganize.`

### Build

Photography retreats. Real product Model Builder language enters.  
Copy: `Define the assumptions. Build your own model.`

### Mobile

No desktop pin timeline.

Use one world at a time with:

- large portrait media where applicable;
- mathematical representation;
- direct manipulation;
- direct world selector;
- optional native horizontal snap/swipe, but never swipe-only navigation.

---

## Chapter 04 — Evidence

### Purpose

Show that simulation output becomes inspectable evidence.

### Headline

`From run to evidence.`

### Persistent transformation

Use one stable illustrative result whose representations transform relationally:

```text
samples / paths
→ density
→ distribution
→ selected region
→ exact probability / statistic
→ mathematical explanation
```

Do not create six cards.

The user should understand these are multiple views of the **same result**.

AI/generated interpretation does not appear until mathematical evidence is established.

Desktop may use a compact owned narrative sequence if needed; mobile should remain normal readable vertical flow.

---

## Chapter 05 — Compare

### Purpose

Demonstrate iteration/decision reasoning.

### Headline

`Change one thing. Read the difference.`

### Representation

A and B occupy the same coordinate field.

Do not create `Scenario A` and `Scenario B` cards.

Baseline is quieter.

Changed scenario receives the change signal.

Differences attach to the exact region they describe.

Provide a deterministic input control and an accessible textual summary of the delta.

---

## Chapter 06 — Workbench

### Purpose

Bridge authored public narrative into the actual product.

### Headline

`Build the model yourself.`

### Representation

Do not display a fake browser/device frame.

Use real Product Model Builder DOM/components or a production-faithful non-interactive projection sourced from the same design primitives.

The public visitor should recognize continuity in typography, spacing, mathematical geometry, control design and motion.

Provide direct CTA into signup/login/workbench depending auth state.

---

## Chapter 07 — Resolve

### Purpose

Establish method/epistemic boundaries and end the website intentionally.

### Headline

`Know what came from the model.`

### Support

`Calculated evidence, uncertainty and generated interpretation stay distinct.`

### Visual structure

Simplify the mathematical actor.

Optionally bring MI-08 / MI-03 as a restrained human/physical detail after the dense analytical/product chapters.

Make visible distinctions between:

- calculated result;
- model uncertainty/limits;
- generated interpretation.

Then integrate final workbench action + utility footer into the same composition.

No giant CTA card. No generic black footer slab.

---

# 16. `/models` — engine atlas

Purpose: deeper reference for real simulation families.

Do not make a five-card features page.

Recommended composition:

- compact integrated public header;
- model index that stays available;
- each engine gets its own native visual representation and concise explanation;
- input → behavior → output → what user can inspect;
- illustrative data clearly labeled;
- links to actual Workbench engine selection.

Engine areas:

### Monte Carlo

Show distribution/path logic, uncertainty controls and real result families supported by frontend contracts.

### Game Theory

Show payoff/matrix/equilibrium logic.

### Market

Show time/process state, risk/variation, not fake candles.

### Conflict

Show agents/interaction/outcome logic only where the actual product contract supports it.

### Custom

Show actual build/edit flexibility, not another fabricated visualization.

Avoid repeating one hero pattern five times.

---

# 17. `/workbench` — public product walkthrough

Purpose: prove the actual product, not describe features.

Sequence:

1. choose model/engine;
2. set assumptions;
3. validate;
4. run;
5. inspect result;
6. compare;
7. explain.

Use real product UI primitives.

Do not show fake user data or hard-coded authority metrics.

Do not create device mockups around the UI.

Provide explicit links into signup/login or `/app/simulations/new` depending auth.

---

# 18. `/method` — mathematical method, limits and AI boundary

This route can contain more reading, but it still must not become cards of text.

Use:

- equations;
- diagrams;
- deterministic illustrative plots;
- annotated examples;
- source/provenance distinctions;
- method flow.

Suggested major territories:

1. `What the simulation calculates`
2. `Deterministic vs stochastic`
3. `How uncertainty is represented`
4. `What generated interpretation does`
5. `What generated interpretation does not prove`
6. `Model assumptions and limits`

Only make claims supported by current product/backend behavior.

No invented scientific certification, accuracy percentage, security/compliance claim or retention policy.

---

# 19. Marketing layout/footer components

`frontend/src/marketing/components/MarketingLayout.tsx` should be substantially rebuilt.

Retain only useful routing/accessibility behavior.

Create a public layout that supports:

- opening integrated header;
- released header state;
- route-level compact header on secondary routes;
- authored footer;
- mobile menu;
- accessibility skip link;
- sensible scroll restoration.

`MarketingCard.tsx` must no longer be the macro composition engine. Delete it if it has no legitimate bounded-object use after reconstruction.

`ProductVisualization.tsx` may be replaced or decomposed; do not preserve invented schematic visuals merely because the component exists.

---

# 20. Authentication reconstruction

Current visual AuthShell is rejected.

Preserve auth behavior and validation.

## 20.1 Desktop

- high-luminance open field;
- form width ~380–420px;
- optional one restrained mathematical/system actor on opposite/open territory;
- no giant glass container;
- no background orbs;
- no AI/intelligence marketing copy;
- no stock person image merely to fill space.

Login copy:

**Title:** `Welcome back`  
**Support:** `Return to your models and previous simulations.`

Signup copy should focus on account creation and workbench access, not inflated marketing.

## 20.2 Form geometry

- visible labels;
- 48–52px input control target where practical;
- clear focus ring;
- errors attached to actual field;
- password behavior preserved;
- keyboard/navigation correct;
- loading/disabled states honest.

## 20.3 Mobile

Form first.

Art direction does not push critical controls below the fold unnecessarily.

---

# 21. Protected application shell

Replace current radial-gradient fixed-sidebar world.

## 21.1 Desktop shell

Target composition:

```text
functional nav rail | contextual workspace
```

Recommended nav width around 196–216px at 1440+; narrower compact rail may be used at intermediate widths if it materially improves workspace.

The rail is calm and functional.

No `Engine Fleet`, fake system health or ambient glow.

Possible navigation:

```text
Home
Build
Results / recent work (route semantics must match real product)
Community
Profile
```

Do not invent a new route that backend/product does not support merely to fill navigation.

## 21.2 Contextual top bar

Approx. 56–64px.

May show current model/run name, status, route task and actual actions.

No universal huge page title + subtitle block.

## 21.3 Mobile shell

Preserve safe-area behavior.

Replace floating glass dock with integrated bottom navigation.

No oversized glowing center FAB.

Use `env(safe-area-inset-bottom)`.

Controls remain clear at 320px width.

---

# 22. Dashboard reconstruction

`frontend/src/pages/DashboardPage.tsx` should preserve useful hooks/API state but the visible experience is rebuilt.

## 22.1 Information order

1. **Resume work**
2. **What changed / needs attention** if real data exists
3. **Recent models / simulations**
4. **Progression** as secondary

## 22.2 Empty/no-work state

Show:

- concise explanation;
- one primary `Create a model` / `Start a simulation` action;
- optional deterministic small mathematical illustration;
- no fake scores/charts/metrics.

## 22.3 Existing work state

Dominant recent/current model may show:

- title/type;
- last real status;
- updated time;
- meaningful real result preview if available;
- real changed parameter/delta if available;
- `Continue` / `Inspect result` actions.

Do not fabricate deltas if the backend does not provide historical comparison.

## 22.4 Recent work

Use list/table/timeline based on real data density.

Do not default to a 3×2 card grid.

## 22.5 Progression

If real XP/skill data exists, present calmly.

No `Level X Strategist` as the primary user identity.

No Badge Vault as a dominant dashboard chapter.

---

# 23. Model Builder — `/app/simulations/new`

This is the core product screen.

`SimulationPage.tsx`, `SimulationForm.tsx` and engine form components should be treated as behavior/data sources, not immutable layout architecture.

## 23.1 Desktop composition

Three functional territories, not three decorative cards:

### Assumptions

Approx. 280–320px at 1440+.

Contains:

- engine selection;
- name/context where required;
- grouped parameters;
- constraints;
- saved model/template behavior where supported;
- validation.

### Model field

Flexible and visually dominant, ideally 680px+ at large desktop.

Shows the mathematical structure relevant to the selected engine.

If a live pre-run preview cannot be truthfully calculated from current client/product logic, show a structural/parameter representation rather than inventing output.

### Inspector

Approx. 280–320px when open.

Contextual/collapsible.

Shows selected parameter definition, units, assumptions, constraints, help and validation.

Do not keep it permanently visible if it has no useful content.

## 23.2 Engine selection

Do not use five large marketing cards.

Use a compact selectable list/index with concise description and relevant preview.

## 23.3 Parameters

- sentence-case labels;
- units visible where known;
- numeric input paired with slider only when continuous manipulation is meaningful;
- no rainbow engine colors;
- no tinted selected card edge;
- validation next to the relevant control;
- preserve accessible labels and keyboard behavior.

## 23.4 Primary actions

Use plain task language:

- `Run simulation`
- `Save model` where supported
- `Reset` where appropriate

Remove:

- Mission Launch;
- Strategic Win;
- predicted skill gain;
- fake estimated duration;
- decorative pre-launch mission card;
- tunnel/rings.

## 23.5 Mobile

The mathematical/model area owns roughly 45–55% of useful viewport height where feasible.

Assumptions use a safe-area-aware bottom sheet / focused edit mode.

Sheet states can be:

- collapsed context;
- half-height edit;
- expanded/full edit.

The model remains visible at collapsed/half states.

Run action remains thumb reachable.

Do not render desktop columns as vertically stacked full-width cards.

---

# 24. Model Builder state matrix

Implement coherent states:

## M0 — engine/new state

Useful engine structure visible immediately.

## M1 — editing

Selected parameter clearly associated with its model representation.

## M2 — valid/ready

Primary run action enabled; no fake celebratory state.

## M3 — invalid

Inline/local errors; preserve user inputs.

## M4 — running

Same workspace remains; truthful real/indeterminate progress.

## M5 — completed

Model/result resolves into result transition; link/route to result workbench.

## M6 — failed

Error attached to run state, retry available, inputs retained.

No full-screen failure theatre.

---

# 25. Running simulation truth contract

Never synthesize progress.

If `useRealtimeSimulation` / API provides real progress:

- show actual progress;
- show actual stage only if backend provides stage semantics.

If only status exists:

- display `Running simulation`;
- optional elapsed time calculated locally;
- indeterminate progress affordance;
- stable assumptions/model context.

Do not infer “Sampling probability space”, “AI interpreting”, etc. unless backend explicitly reports those phases.

---

# 26. Result Workbench — `/app/analytics/:id`

Replace `Overview / Charts / 3D` as primary user IA.

New information architecture:

1. **Result** — What happened?
2. **Uncertainty** — How variable is it?
3. **Drivers** — What influenced it?
4. **Compare** — What changed?
5. **Explain** — Why?
6. **Surface** — conditional, only when meaningful 3D data exists

Use actual available result contracts. Hide a view if required data does not exist.

Do not show an empty “Drivers” tab just because the design lists one.

## 26.1 Result

Show:

- run/model identity;
- execution status/metadata;
- primary real result;
- strongest engine-appropriate representation;
- exact metrics near evidence.

Do not start with four KPI cards.

## 26.2 Uncertainty

Use histogram/CDF/box/ranges/quantiles where available and meaningful.

Missing data is explicitly absent, not zero.

## 26.3 Drivers

Only show real sensitivity/influence/engine-supported evidence.

Never invent feature importance.

## 26.4 Compare

If compare data/history is not available directly, allow the user to select another compatible run if the existing product APIs make that feasible without backend redesign.

Otherwise provide only existing comparison behavior.

Use shared-coordinate representations, not A-card/B-card.

## 26.5 Explain

Separate:

- computed mathematical explanation;
- formula/method;
- generated AI interpretation;
- recommendation/alternatives where actually returned.

Make generated content visibly identified as generated interpretation.

## 26.6 Surface

Render only if real 3D data exists.

Provide a 2D/textual summary/fallback.

---

# 27. Engine-specific visualization grammar

## Monte Carlo

Primary:

- endpoint distribution;
- selected region/tail;
- key exact metric.

Secondary:

- path ensemble;
- CDF;
- box/quantile view.

## Game Theory

Primary:

- payoff relationship/matrix;
- equilibrium/strategy state.

Secondary:

- response or comparison representation where contract supports it.

## Market

Primary:

- time-series state + range/context.

Secondary:

- distribution/risk/regime representation backed by actual result.

Do not generate fake candlesticks from random values.

## Conflict

Primary:

- agent/outcome relationship or returned engine-native result.

Secondary:

- trajectories/heat/state distribution when the backend data supports them.

Do not show meaningless network lines.

## Custom

Representation follows returned data.

Do not force a universal chart merely for consistency.

---

# 28. Chart system reconstruction

`ChartRenderer.tsx` is large and may contain useful geometry/data handling. Audit before deleting.

## 28.1 Preserve if correct

- parsing of current chart contracts;
- responsive measurement;
- ResizeObserver;
- value formatting;
- keyboard/touch behavior if already robust;
- low-power/reduced-motion branches;
- 3D data adaptation.

## 28.2 Replace art direction

Remove/rebuild:

- dark glass shell;
- chart glow;
- gradient overlays;
- brand rainbow palette;
- inner glow;
- decorative spring tooltip behavior;
- generic chart-card container.

## 28.3 New chart rules

Default field:

- paper/canvas neutral;
- graphite labels;
- subtle structural grid only when useful;
- exact-value inspection;
- annotation near evidence;
- active selection uses semantic/data color;
- non-color distinction where needed;
- touch equivalent of hover;
- textual summary/table when exact comparison requires it.

## 28.4 Data colors

Create separate accessible utilities for:

- categorical;
- sequential;
- diverging;
- semantic state.

Do not tie all chart colors to product brand.

---

# 29. 3D result system

`ThreeDTabPanel.tsx` may retain useful renderer/performance logic.

Rules:

- no bloom by default;
- neutral analytical environment;
- axes/labels readable;
- camera control only where helpful;
- explicit Reset View;
- quality tiers preserved/refined;
- cleanup/disposal mandatory;
- reduced-motion/static state;
- 2D fallback/summary;
- no essential navigation inside canvas;
- no auto-orbit merely to show 3D.

Delete `frontend/src/marketing/three/IntelligenceSurfaceScene.tsx` if it has no remaining nondecorative consumer after reconstruction.

---

# 30. AI interpretation design

AI is a secondary interpretive layer.

Correct visual hierarchy:

```text
model
→ calculated output
→ uncertainty/evidence
→ generated interpretation
→ recommendation / alternatives
```

Generated text must be clearly labeled as interpretation when appropriate.

Never use AI as:

- hero icon;
- palette rationale;
- ambient visual field;
- badge system;
- glowing state;
- fake confidence authority.

Do not claim generated confidence is scientific certainty unless backend semantics explicitly define it.

---

# 31. Feed/community reconstruction

`FeedPage.tsx` should preserve real `useSocialFeed` / service behavior, but remove seeded/fabricated community theatre.

Do not show hard-coded:

- active simulator count;
- missions today;
- XP community total;
- fake Top 10 usernames;
- fake trending states.

A real feed item should emphasize:

- author;
- model/scenario;
- small deterministic/real result thumbnail if available;
- time;
- real actions supported by current product (inspect/fork/share/etc.).

Visualize an activity item as content-first editorial object, not a generic social glass card.

If an item needs a boundary because it is independently actionable/selectable, a restrained boundary is valid.

---

# 32. Profile reconstruction

Separate three concerns:

## Identity

- avatar;
- name;
- bio;
- timezone;
- account fields.

## Analytical progression

- actual skill profile/progression values;
- learning/behavior data if truly available;
- calm evidence-based representation.

## Settings

- user preferences;
- notification/theme controls that actually exist.

Remove gamified language as default identity.

XP/badges may remain secondary if backed by product truth.

Prefer precise horizontal measures / lists over decorative radar if comparison/readability is better.

---

# 33. Empty/loading/error-state constitution

Every major protected route needs explicit states.

## Loading

Use task-specific skeleton/placeholder or concise status.

Do not use fake animated data.

## Empty

Explain what is missing and provide one meaningful next action.

Do not fill emptiness with fake charts.

## Error

Preserve user context and retry ability.

Do not clear unsaved Model Builder input because analytics fetch failed.

## Partial

If one AI endpoint fails but mathematical result exists, show result and a local interpretation failure state instead of failing the entire page.

This separation is especially important because AI is not the calculation layer.

---

# 34. Accessibility contract

Target WCAG 2.2 AA as baseline.

Implementation requirements:

- semantic headings with logical hierarchy;
- skip link;
- keyboard access to all controls;
- visible focus;
- no hover-only critical information;
- touch equivalents;
- no color-only state distinction;
- accessible names for icon controls;
- math controls support keyboard increments;
- charts have accessible summary/value alternative;
- 3D has non-3D alternative;
- reduced-motion composition;
- dialogs/sheets trap/restore focus correctly;
- sticky/fixed UI does not obscure focused elements;
- validation programmatically associated with fields;
- route/page title changes sensible;
- loading/status announcements use ARIA live only where useful, not noisy;
- target size appropriate for mobile;
- dragging always has an alternative control method.

### Mathematical accessibility

Where MathJax is used, configure it in a way that retains accessible expression behavior rather than rendering inaccessible decorative output.

---

# 35. Reduced-motion contract

`prefers-reduced-motion: reduce` is an alternate understandable composition, not `duration: 0` on a giant pinned story.

Public:

- Systems Atlas becomes static layered editorial composition;
- World → Structure becomes direct state handoff;
- Model Worlds becomes direct selectable worlds without long scrub travel;
- Evidence uses discrete representation changes;
- Compare updates immediately/briefly;
- no parallax.

App:

- all tasks remain functional;
- no auto-animated chart transitions required for comprehension;
- no auto-orbit 3D;
- no decorative pulses.

---

# 36. Performance contract

Performance is part of visual quality.

## 36.1 General

- route-level code split stays;
- do not load Three.js marketing code on homepage if it is not used;
- lazy-load heavy 3D result code;
- lazy-load MathJax where needed;
- only load Anime.js modules/features actually used;
- remove dead old marketing visual code from production bundles;
- avoid giant client-side object arrays when Canvas can render efficiently;
- avoid excessive DOM nodes for path ensembles;
- avoid forced layout loops during scroll.

## 36.2 Images

- local optimized derivatives;
- correct `srcset` / `sizes`;
- hero LCP discoverable early;
- below-fold media lazy loaded;
- Model World neighbors may preload strategically, not all at once;
- explicit width/height/aspect metadata to control CLS;
- do not ship 4K master to 390px phone.

## 36.3 Core quality targets

Aim for good Core Web Vitals in field conditions. Do not sacrifice the first meaningful state for decorative enhancement.

## 36.4 Slow connection

The interface must remain understandable if HD media or 3D is delayed.

Text/navigation/core controls appear independently of optional enhancement.

---

# 37. SEO and metadata

Update `frontend/index.html` and route-level metadata approach as available in the current SPA architecture.

At minimum:

- product title/description no longer use generic “AI intelligence” language;
- meaningful OpenGraph/social title/description;
- accessible favicon/logo treatment;
- canonical path behavior if already supported/deployment appropriate;
- preserve `robots.txt` unless product requirements change;
- no fake structured-data claims/ratings/reviews.

Do not invent schema.org ratings, customers or pricing.

---

# 38. Source code architecture target

Exact folders may adapt to existing conventions, but responsibilities should become clear.

Recommended conceptual structure:

```text
frontend/src/
  marketing/
    layout/
    pages/
      HomePage.tsx
      ModelsPage.tsx
      WorkbenchPage.tsx
      MethodPage.tsx
    scenes/
      SystemsAtlasHero.tsx
      WorldStructureTransition.tsx
      ModelWorlds.tsx
      EvidenceSequence.tsx
      ScenarioCompare.tsx
      WorkbenchBridge.tsx
      ResolveScene.tsx

  app/
    shell/
    dashboard/
    model-builder/
    result-workbench/
    feed/
    profile/

  visualization/
    demos/
    charts/
    three/
    annotations/
    color/

  math/
    deterministic/
    formatting/
    typesetting/

  media/
    registry.ts
    ResponsiveMedia.tsx

  motion/
    animeMath.ts
    scrollStories.ts
    reducedMotion.ts

  design-system/
    tokens.css
    typography.css
    utilities.css
```

Do not reorganize the entire repository merely for aesthetic cleanliness if a smaller migration preserves working logic more safely.

The goal is ownership clarity, not churn.

---

# 39. File-by-file disposition

## `frontend/src/App.tsx`

**Rebuild:** route map, public routes, loading/toast visuals.  
**Preserve:** auth protection, history/scroll concepts, lazy loading, error boundary.  
**Delete:** global `useMicroInteractions` call/import.

## `frontend/src/index.css`

**Replace governing design system.**

Remove old root tokens:

- dark backgrounds;
- cyan/violet brand tokens;
- gradients;
- glass surfaces;
- glow shadows;
- old Sora/Inter/JetBrains identity;
- cursor coordinates/glow;
- `premium-card`;
- `section-kicker` decorative line;
- hero metric card system;
- auth orbs/glass;
- global ripple;
- generic appearance/fade-up choreography;
- page-level overflow concealment.

Retain only useful reset/accessibility mechanics after review.

## `frontend/tailwind.config.js`

Audit and remove/rebuild old AI-theme colors, gradients, shadows and generic motion tokens if they are still active.

Do not maintain two competing token systems.

## `frontend/index.html`

Remove old Sora/Inter/JetBrains external font identity.

Integrate legal final font resources only when available.

Update metadata.

## `frontend/src/hooks/useMicroInteractions.ts`

Delete or reduce to zero consumers; global behavior is rejected.

## `frontend/src/marketing/components/MarketingCard.tsx`

Delete if no legitimate bounded-object need remains.

## `frontend/src/marketing/components/MarketingLayout.tsx`

Rebuild.

## `frontend/src/marketing/components/ProductVisualization.tsx`

Replace invented visualizations with real/deterministic product-native representations or remove.

## `frontend/src/marketing/pages/HomePage.tsx`

Complete replacement with seven-chapter authored homepage.

## `FeaturesPage.tsx`

Replace functionality with `/models` page or retire through redirect.

## `ProductPage.tsx`

Replace with `/workbench` public walkthrough or retire through redirect.

## `PricingPage.tsx`

Do not present current invented pricing/ROI. Route redirects until verified business truth exists.

## `frontend/src/marketing/sections/HeroSection.tsx`

Complete replacement; old split hero is banned.

## `CoreCapabilitiesSection.tsx`

Retire; capabilities become Model Worlds / Models atlas, not a feature-card section.

## `HowItWorksStorySection.tsx`

Retire/rebuild logic into Workbench/Method representation; no generic story cards.

## `frontend/src/marketing/three/IntelligenceSurfaceScene.tsx`

Delete after verifying no legitimate consumer. Do not reuse in hero.

## `frontend/src/layouts/MainLayout.tsx`

Rebuild visual shell. Preserve child composition/context patterns only if useful.

## `Sidebar.tsx`

Replace content/visual architecture; remove fake system-health/engine-fleet language.

## `MobileDock.tsx`

Preserve safe-area reasoning; rebuild as integrated mobile navigation.

## `Topbar.tsx`

Rebuild into contextual workspace bar.

## `PageShell.tsx`

Audit. Do not let a universal shell force every page into identical card/title structure.

## `DashboardPage.tsx`

Preserve data hooks; rebuild representation.

## `SimulationPage.tsx`

Preserve simulation request/realtime behavior; rebuild Model Builder and run states.

## `AnalyticsPage.tsx`

Preserve real analytics/AI hooks; rebuild IA and visual hierarchy.

## `FeedPage.tsx`

Remove seeded community theatre; preserve real feed calls.

## `ProfilePage.tsx`

Preserve real profile/progression mutations; rebuild presentation.

## `SimulationForm.tsx` + engine forms

Preserve request shape/validation where correct; decompose/recompose UI into Assumptions/Model/Inspector architecture.

## `ChartRenderer.tsx`

Audit/refactor rather than blind rewrite; preserve useful geometry/data logic.

## `ChartsTabPanel.tsx`

Retire as `Charts` category architecture; repurpose internal rendering as needed inside question-based result views.

## `ThreeDTabPanel.tsx`

Refactor into conditional `Surface` view; preserve real 3D engineering.

## `chartTheme.ts`

Complete visual theme replacement.

## Services/hooks/types

Default disposition: preserve.

Any API-semantic change requires explicit evidence of a frontend compatibility bug and must be reported.

---

# 40. Copy constitution

Use concrete mathematical verbs/nouns.

Prefer:

```text
model
change
vary
inspect
compare
simulate
sample
estimate
constrain
rerun
explain
isolate
distribution
variance
payoff
equilibrium
scenario
parameter
outcome
uncertainty
```

Avoid repeated identity claims:

```text
premium
powerful
strategic intelligence
cutting-edge
next-generation
high-trust
decision-ready
mission
command
engine fleet
intelligence core
```

No em-dash-heavy AI-copy cadence as a default style.

No section-kicker grammar.

No claim that is not backed by product truth.

---

# 41. State/data truth rules

Hard requirements:

- no `Math.random()` for user-facing prediction/intelligence/progress;
- no hardcoded authority metrics presented as real;
- no fake user/community counts;
- no fake leaderboard;
- no fake “Live” status;
- no fake health status;
- no fake ROI;
- no fabricated confidence;
- no invented progress stage;
- no invented retention/privacy/security/compliance claim;
- no demo data represented as production customer/user data;
- missing data shown as missing/unknown, not zero;
- AI failure does not erase deterministic result if deterministic result is available.

Search the frontend for current violations and remove them from production presentation.

---

# 42. Public/protected visual continuity

The marketing and application worlds must visibly belong to the same product through:

- same typography system;
- same neutral/graphite foundation;
- same mathematical color semantics;
- same annotation style;
- same direct-manipulation philosophy;
- same motion verbs;
- same chart language;
- same spacing discipline.

Do **not** carry marketing cinematic scroll behavior into operational app screens.

Marketing is expressive. Workbench is direct.

---

# 43. Interaction principles

1. Direct manipulation beats decorative explanation.
2. Mathematical changes should update linked representations.
3. User intent controls parameters; scroll does not choose parameter values.
4. Every sticky/pinned actor must arrive, settle, dwell and release coherently.
5. Reverse scroll must be coherent.
6. Fast scroll must not create impossible intermediate states.
7. Mobile never depends on hover.
8. Dragging always has numeric/keyboard alternative.
9. Charts support inspect/select rather than merely animate.
10. Do not delay repeated work with cinematic transitions.

---

# 44. Visual acceptance tests — mandatory

Before declaring completion, run these design tests against actual rendered production routes.

## Blur / silhouette test

Blur/zoom out the public page.

Reject if silhouette becomes:

```text
rectangle
rectangle
rectangle
big rectangle
three rectangles
CTA rectangle
```

## Paragraph-hide test

Temporarily hide body paragraphs.

Core public experience should still communicate:

- real systems;
- model families;
- evidence;
- comparison;
- workbench.

## Swap-logo test

Ask whether the homepage could become another AI SaaS by changing only logo/copy.

If yes, reject.

## Card-count test

Count prominent bounded rectangles on public routes.

If they dominate the silhouette, reject unless semantics require boundaries.

## Typography test

Remove photography. Typography + math should still look authored, not generic AI startup.

## Motion test

Test slow scroll, fast scroll, reverse and micro-oscillation.

Owned actors must establish → dwell → transition coherently.

## Sticky test

Pinned actor reaches intended optical position and stops. If it continuously drifts or swaps before settlement, reject.

## Artifact test

Immediate rejection for:

- duplicate text;
- debug labels;
- transition ghosts;
- accidental guide bars;
- z-index collision;
- clipping;
- broken overlays;
- unintentional giant empty region;
- temporary placeholder copy/asset visible in production.

## Core representation test

If a route can be described as `heading + paragraph + cards + image beside it`, redesign the representation.

---

# 45. Viewport acceptance matrix

## 1440×900

Verify:

- Systems Atlas visual pressure;
- image crops;
- headline/CTA;
- World → Structure continuity;
- Model Worlds dwell;
- Evidence/Compare readability;
- Workbench bridge;
- app workspace widths;
- analytics labels/legends.

## 1366×768

Critical:

- no hero overflow;
- no chapter requiring two scrolls just to see title + active actor;
- Model Worlds active media + title + interaction fit together;
- app top bar/nav do not steal work area;
- Model Builder fields usable without excessive vertical compression.

## 1024×768 / 768×1024

- transition out of desktop rail layout deliberately;
- no “almost desktop” broken composition;
- media crops authored;
- app inspector behavior sensible.

## 430×932 / 390×844

Primary mobile quality gate:

- feels like an app;
- hero art direction intentional;
- Model Worlds touch-native;
- model field remains primary;
- bottom sheet usable;
- chart inspect works on touch;
- bottom nav safe area correct.

## 375 / 360 / 320

- no clipped CTA;
- no hidden form field;
- no horizontal layout concealment;
- no tiny chart labels masquerading as responsiveness;
- no modal/sheet overflow.

---

# 46. Browser/reduced-motion/failure acceptance

At minimum manually verify current Chrome/Chromium-class desktop and mobile responsive mode.

Also verify:

- `prefers-reduced-motion: reduce`;
- keyboard-only navigation;
- touch-like interaction for drag/inspect;
- media request failure/fallback;
- 3D unavailable/low-power fallback;
- API loading/error states;
- unauthenticated public-only redirects;
- authenticated redirect from login/signup;
- protected route behavior;
- browser back/forward scroll behavior.

Do not install a huge E2E framework solely for this visual pass unless one already exists or a focused defect cannot be verified otherwise.

---

# 47. Dependency policy

Current dependencies are already sufficient for most work.

Expected additions:

```text
animejs
mathjax@4   (only if/when formal math typesetting implementation is included)
```

Do not add:

- Lenis;
- Barba;
- Framer Motion/Motion just because it is familiar;
- another chart library without a concrete gap;
- Rive without a real authored state-machine need;
- Lottie as a default animation solution;
- another 3D abstraction library;
- component frameworks that impose generic SaaS styling.

If MathJax is deferred behind a clear `MathExpression` adapter because formula pages can ship semantically without it, report that explicitly; do not block the whole reconstruction on ornamental math typesetting.

---

# 48. Implementation order

Implement in this exact high-level order to minimize regressions.

## Stage 1 — Baseline and safety

1. inspect local git status/HEAD;
2. record current changed/untracked files;
3. do not overwrite unrelated user work;
4. read Brain + Phase 3 spec fully;
5. inspect API/types/hooks/services used by each route;
6. identify backend-coupled frontend behavior.

## Stage 2 — Foundation

1. replace token/type/reset foundation;
2. remove global old background/glow/ripple/microinteraction architecture;
3. create media registry/responsive media primitive;
4. install/import Anime.js only after foundation is clean;
5. add/lazy-isolate math typesetting adapter if used;
6. rebuild public/app shared primitives.

## Stage 3 — Public shell/routes

1. new public layout/header/footer;
2. route map `/models`, `/workbench`, `/method`;
3. redirects;
4. auth restyling can wait until public/product foundation established.

## Stage 4 — Homepage

1. Systems Atlas static composition first;
2. responsive/mobile art direction;
3. World → Structure static states;
4. Model Worlds static/dwell states;
5. Evidence;
6. Compare;
7. Workbench bridge;
8. Resolve;
9. only then add motion.

Do not animate a weak static composition.

## Stage 5 — Secondary public routes

Models → Workbench → Method.

## Stage 6 — App shell/auth

Rebuild navigation, top bar, mobile bottom nav, login/signup.

## Stage 7 — Dashboard

Rebuild around real recent work and empty states.

## Stage 8 — Model Builder

Recompose existing simulation forms/behavior into Assumptions / Model / Inspector.

Remove mission/pre-launch/synthetic state theatre.

## Stage 9 — Running/result

Truthful running states, result IA, charts, compare/explain.

## Stage 10 — Feed/profile

Remove synthetic social theater; rebuild hierarchy.

## Stage 11 — Motion/enhancement

Anime local math interactions; GSAP selected public story sequences; Three conditional 3D.

## Stage 12 — Cleanup

Delete dead old visual code/assets/classes, update imports, remove old fonts/tokens.

## Stage 13 — Validation

Lint/build + focused browser acceptance + final source search for banned artifacts.

---

# 49. Source-level negative searches before completion

Run repository searches to prove these old patterns are absent from active production code, except comments/history/tests where clearly harmless:

```text
premium-card
section-kicker
IntelligenceSurfaceScene
Intelligence Core
Mission Command
Intelligence Cockpit
Engine Fleet
Badge Vault
quantum-violet
signal-cyan
brand-gradient
cursor-x
cursor-y
useMicroInteractions
Math.random()
syntheticProgress
Initializing Mission
Community Pulse
```

Also search active CSS for:

```text
linear-gradient(
radial-gradient(
backdrop-filter
box-shadow
```

These are not globally banned CSS features in all contexts, but every active occurrence must be justified. Identity gradients/glows/glass are prohibited.

Search for page-level:

```text
overflow-x: hidden
overflow-x: clip
```

Any occurrence must be local/intentional; page/root concealment is prohibited.

---

# 50. Testing and validation commands

The current frontend `package.json` exposes:

```text
npm run lint
npm run build
```

It does not currently expose a general frontend `npm test` script.

Therefore do **not** report `npm test` as passed unless a legitimate test command exists after implementation.

Required baseline:

```bash
cd frontend
npm run lint
npm run build
```

If dependencies were added:

```bash
npm install
```

must update `package-lock.json` normally.

Do not disable lint/type errors just to complete the phase.

If existing project-specific tests/scripts exist locally beyond audited remote `package.json`, run focused relevant tests and report exact commands/results.

---

# 51. Performance source audit before completion

Report:

- initial public route bundle impact;
- whether Three.js is excluded from homepage initial path;
- whether MathJax is lazy;
- whether Model World images are appropriately lazy/prioritized;
- whether old intelligence scene code is removed from active bundle;
- whether path ensembles use Canvas or otherwise avoid huge DOM cost;
- whether animation listeners/timelines clean up on route change;
- whether ResizeObserver/Three resources clean up;
- whether mobile image candidates are distinct/appropriately sized.

Do not chase a vanity Lighthouse score by deleting meaningful content or disabling interaction.

---

# 52. Accessibility source audit before completion

Report:

- focus management;
- keyboard parameter editing;
- mobile sheet/dialog focus;
- chart accessible summaries;
- reduced motion;
- non-color-only distinction;
- 3D fallback;
- alt text strategy for MI assets;
- form validation association;
- route heading/title hierarchy.

---

# 53. No-lab rule

This is direct production implementation.

Do not create:

- hidden redesign route;
- `/__lab`;
- phase-3 playground;
- alternate hero route;
- temporary A/B implementation;
- Storybook-only design instead of production routes;
- parallel CSS theme that leaves the old design active.

Build the approved design directly into real production routes.

---

# 54. No-design-discretion rule for Codex

Codex is the implementation agent.

It must not:

- choose another palette;
- choose another font identity;
- replace selected media with generic stock;
- decide a card grid is “cleaner”;
- reintroduce gradients/glows;
- invent metrics/copy;
- invent testimonials;
- invent billing;
- invent AI states;
- reframe the hero as graph/AI orb/product screenshot;
- silently simplify mobile into stacked desktop;
- replace the authored Model Worlds with a standard carousel;
- add technology because it looks premium.

If an implementation constraint makes a design instruction impossible, Codex should preserve product truth, implement the strongest compliant fallback, and clearly report the conflict rather than independently redesigning the product.

---

# 55. Definition of done

Phase 3 implementation is code-complete only when:

- public homepage is completely reconstructed;
- `/models`, `/workbench`, `/method` exist;
- legacy public redirects work;
- auth is rebuilt;
- protected app shell is rebuilt;
- dashboard is rebuilt;
- Model Builder is rebuilt while preserving real simulation behavior;
- running state is truthful;
- Result Workbench uses question-based IA;
- charts use new analytical art direction;
- real 3D remains available conditionally;
- feed synthetic theater is removed;
- profile is rebuilt;
- selected media pipeline is local/responsive or exact missing assets are reported without silent substitutions;
- old AI-theme CSS/design system is removed from active production;
- global microinteraction hook is removed;
- no fabricated metrics/progress remain;
- lint passes;
- build passes;
- critical desktop/mobile/reduced-motion states were visually checked;
- final report below is complete.

**Final visual approval still belongs to the design authority after rendered production inspection.**

---

# 56. Mandatory Codex completion report

Return the following sections in this exact order:

1. **Local starting state** — branch, short HEAD, working-tree status before edits.
2. **Brain/spec confirmation** — confirm both governing docs were read fully.
3. **Files added**.
4. **Files changed**.
5. **Files deleted**.
6. **Dependencies added/removed** and why.
7. **Public route map** after reconstruction.
8. **Legacy redirects**.
9. **Systems Atlas implementation** — composition/media/crops.
10. **World → Structure implementation** — state ownership and mobile/reduced-motion behavior.
11. **Model Worlds implementation** — all five worlds, dwell states, direct controls, mobile transformation.
12. **Evidence implementation**.
13. **Compare implementation**.
14. **Workbench bridge + Resolve/footer implementation**.
15. **Media pipeline** — source files, derivative sizes/formats, priority/lazy behavior, any missing media.
16. **Typography implementation** — Diatype status/license-file availability, fallback if applicable, STIX/MathJax status.
17. **Palette/token replacement**.
18. **Motion ownership** — Anime/GSAP/Three/CSS/React responsibilities.
19. **App shell** — desktop + mobile.
20. **Dashboard** — empty/existing-work behavior.
21. **Model Builder** — engine forms, assumptions/model/inspector, mobile sheet.
22. **Running states** — real vs indeterminate progress behavior.
23. **Result Workbench** — Result/Uncertainty/Drivers/Compare/Explain/Surface.
24. **Chart + 3D changes**.
25. **Feed/profile/auth changes**.
26. **Truth cleanup** — list fake metrics/random progress/community theater removed.
27. **Accessibility** — keyboard, reduced motion, charts, forms, mobile sheets.
28. **Performance** — bundle/media/heavy dependency loading and cleanup.
29. **Responsive checks** — 1440×900, 1366×768, 390×844, 320×568; describe findings/fixes.
30. **Source-level banned-pattern search** — exact commands/searches and remaining justified matches.
31. **Lint result** — exact command/output summary.
32. **Build result** — exact command/output summary.
33. **Known limitations / external requirements** — especially licensed Diatype files or inaccessible media.
34. **Visual approval status** — must state `Implementation complete; final visual approval pending design-authority inspection.`

Do not provide a vague “implemented successfully” paragraph in place of this report.

---

# 57. Final implementation quality statement

The reconstruction is successful only if Math Intellect no longer looks like a website decorated to communicate intelligence.

It should feel like an authored system in which:

- high-resolution real-world media establishes the system;
- structure emerges from the world;
- mathematics explains behavior;
- the workbench lets the user change assumptions;
- analytical evidence is inspectable;
- comparison reveals consequence;
- AI interprets rather than visually dominates;
- mobile feels like a purpose-built mathematical application;
- the product remains truthful about what is calculated, unknown, illustrative or generated.

If the final public page can be summarized as:

> “large heading, some explanatory copy, cards, a product screenshot, more cards”

then Phase 3 has failed even if all tests pass.

The intended quality bar is a highly authored, product-specific, award-submission-caliber frontend — not an imitation of award websites, but a Math Intellect experience that derives its visual and interaction grammar from the product itself.

---

# Appendix A — Current verified technical references

Current package baseline comes from `frontend/package.json` on audited `main`.

Current production env names:

```text
VITE_API_URL
VITE_WS_URL
VITE_APP_NAME
VITE_ENV
```

Official technical references used for dependency decisions:

- Anime.js installation: `https://animejs.com/documentation/getting-started/installation/`
- GSAP ScrollTrigger: `https://gsap.com/docs/v3/Plugins/ScrollTrigger/`
- MathJax 4 package/repository: `https://github.com/mathjax/MathJax`
- MathJax documentation: `https://docs.mathjax.org/`

Selected media source pages are listed in Section 11.

---

# Appendix B — One-line implementation reminder

> **Preserve the mathematics and product contracts; replace the visual frontend completely.**
