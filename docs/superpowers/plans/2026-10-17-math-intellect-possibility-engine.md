# Math Intellect Possibility Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current public Math Intellect marketing visual system with the approved Possibility Engine experience while preserving the real deterministic model, Workbench behavior, semantic routes, accessibility, and protected application functionality.

**Architecture:** Build a new `frontend/src/marketing/possibility/` visual system beside the legacy `film/` implementation, migrate public routes onto it scene-by-scene, then delete legacy photographic/film code only after all routes use the new system. Product state stays in the existing `ScenarioProvider`; product-native SVG/DOM visuals render the real deterministic data, while new licensed Unsplash/Unsplash+ photography is referenced only through a role-based media manifest. Macro scroll choreography belongs to a route-scoped GSAP owner; public navigation continuity is moved out of `App.tsx` into a cancellable marketing transition provider.

**Tech Stack:** React 19, TypeScript 6, React Router 7, GSAP 3 + ScrollTrigger, Lenis 1 only for fine-pointer desktop smoothing, KaTeX, SVG/DOM/CSS masks, existing deterministic model helpers, Vitest + Testing Library, Sharp for non-generative image derivatives. Three.js is optional and is not part of the baseline plan.

**Spec:** `docs/superpowers/specs/2026-10-17-math-intellect-possibility-engine-design.md`

## Global Constraints

- Public scope is `/`, `/models`, `/workbench`, `/method`, shared public navigation, and public-route transitions. Protected `/app/*` routes are not redesigned.
- Hero contains no stock photograph.
- All current installed marketing photographs are rejected as final cast and must not be used as fallback art direction.
- Final licensed photography comes from Unsplash / Unsplash+ only unless the user changes that rule.
- No AI-generated final photography or AI-generated substitute illustration.
- The public scenario remains `x₀=0`, initial `σ=0.35`, initial `μ=0.05`, `seed=42`, `24 paths`, `50 steps`.
- Baseline remains `σ=0.35` with the current drift and seed.
- Workbench preserves volatility, drift, seed, reset, replay, baseline comparison, JSON export, limitations, labels, and keyboard-native inputs.
- Photography represents context only. It must never be labeled or composed as model output.
- No em dash character in final marketing copy.
- No generic split hero, repeated card grid, equal model panels, decorative marquee, decorative spinner, glassmorphism, purple AI gradients, or orange default brand accent.
- Mobile primary canvases are 390×844 and 430×930; 360×800 is a QA size. Mobile uses native touch scroll by default.
- Reduced motion is a complete parallel composition: no long pins, no pointer lag, no blank spacer sections, no opacity-zero content waiting for timelines.
- Core content must survive no-WebGL/GPU failure.
- Do not add Playwright. Visual acceptance is manual/live-browser review.
- Do not install a new animation library unless a concrete missing capability is demonstrated.
- One library owns a given transform property on a given element.
- Product interaction must never be slowed to make the site feel cinematic.

## Review Focus

1. **Missing or unapproved media masters:** the new site must fail the media gate or omit the photographic scene; it must never silently fall back to old liquid/water/river/laptop/shipping/flock assets. Task 2 adds manifest/source tests.
2. **Rapid second public navigation:** a second click must cancel the active transition, restore body scrolling, remove overlays, and navigate to the latest destination. Task 14 adds cancellation tests.
3. **Reduced-motion / no-GPU browsing:** every route must remain complete and readable with no long spacers or hidden scenes. Tasks 4, 8, 11, 12, and 15 add static/reduced-motion assertions and manual gates.
4. **Native input during cinematic scenes:** focused range/number inputs keep arrow-key and typing behavior, update model state immediately, and are never intercepted for camera/chamber travel. Tasks 7 and 11 pin this behavior.
5. **History, hashes, and direct entry:** `/models#game-theory`, Method anchors, Back/Forward, modified clicks, and direct route loads must work without transition state. Tasks 10, 12, and 14 add route-level tests.

---

## File Structure Decision

### New shared visual system

- Create `frontend/src/marketing/possibility/media/mediaManifest.ts` — role-based licensed media metadata and derivative paths.
- Create `frontend/src/marketing/possibility/media/mediaManifest.test.ts` — rejects legacy asset paths and incomplete manifest entries.
- Create `frontend/scripts/build-possibility-media.mjs` — Sharp-only crop/resize/AVIF/WebP derivative generation; no generative edits.
- Create `frontend/src/marketing/possibility/styles/tokens.css` — palette, grid, type roles, spacing, focus, z-index, safe-area tokens.
- Create `frontend/src/marketing/possibility/styles/base.css` — new public surface primitives and responsive/reduced-motion base rules.
- Create `frontend/src/marketing/possibility/runtime/useMarketingCapabilities.ts` — fine-pointer, reduced-motion, and viewport capability state.
- Create `frontend/src/marketing/possibility/runtime/DesktopScrollBridge.tsx` — single optional Lenis owner for supported desktop states.

### Product-native visual language

- Create `frontend/src/marketing/possibility/trajectory/trajectoryGeometry.ts` — shared-domain and SVG path geometry from real Monte Carlo results.
- Create `frontend/src/marketing/possibility/trajectory/trajectoryGeometry.test.ts`.
- Create `frontend/src/marketing/possibility/trajectory/TrajectoryField.tsx` — accessible Origin State / path renderer used by Home and Workbench.
- Create `frontend/src/marketing/possibility/trajectory/OriginMark.tsx` — semantic visual origin primitive.
- Create `frontend/src/marketing/possibility/models/modelVisualData.ts` — deterministic Game Theory, Market, and Agent visual data derived from existing helpers.
- Create `frontend/src/marketing/possibility/models/GameMatrixGraphic.tsx`.
- Create `frontend/src/marketing/possibility/models/MarketFlowGraphic.tsx`.
- Create `frontend/src/marketing/possibility/models/AgentNetworkGraphic.tsx`.

### Home film

- Create `frontend/src/marketing/possibility/home/HomeFilm.tsx` — H0–H15 orchestrator only.
- Create `frontend/src/marketing/possibility/home/OriginEntryHero.tsx` — H0–H1.
- Create `frontend/src/marketing/possibility/home/RealityConditions.tsx` — H2–H3.
- Create `frontend/src/marketing/possibility/home/BranchPerturbCompare.tsx` — H4–H6.
- Create `frontend/src/marketing/possibility/home/ModelChambers.tsx` — H7–H11.
- Create `frontend/src/marketing/possibility/home/ReproduceFinale.tsx` — H12–H15.
- Create `frontend/src/marketing/possibility/home/useHomeFilmMotion.ts` — the only GSAP ScrollTrigger owner for Home macro choreography.
- Create `frontend/src/marketing/possibility/home/home.css`.
- Create `frontend/src/marketing/possibility/home/HomeFilm.test.tsx`.

### Secondary public routes

- Create `frontend/src/marketing/possibility/models/ModelAtlas.tsx` and `model-atlas.css`.
- Create `frontend/src/marketing/possibility/models/ModelAtlas.test.tsx`.
- Create `frontend/src/marketing/possibility/workbench/WorkbenchInstrument.tsx` and `workbench.css`.
- Create `frontend/src/marketing/possibility/workbench/WorkbenchInstrument.test.tsx`.
- Create `frontend/src/marketing/possibility/method/MethodPublication.tsx` and `method.css`.
- Create `frontend/src/marketing/possibility/method/MethodPublication.test.tsx`.

### Navigation and continuity

- Create `frontend/src/marketing/possibility/transitions/PublicTransitionProvider.tsx`.
- Create `frontend/src/marketing/possibility/transitions/TransitionOverlay.tsx`.
- Create `frontend/src/marketing/possibility/transitions/publicTransitions.test.tsx`.
- Modify `frontend/src/marketing/components/SiteHeader.tsx` — remove photo previews; preview Origin State representations.
- Modify `frontend/src/marketing/components/SiteFooter.tsx` — quiet utility footer after Home resolves.
- Modify `frontend/src/marketing/MarketingShell.tsx` — mount new tokens/base, capability runtime, transition provider; remove generic global reveal owner.
- Modify `frontend/src/App.tsx` — remove the old timed `AppTransitionLayer` curtain interception while preserving auth/protected routing and `RouteExperienceManager` behavior.

### Route entry points and cleanup

- Modify `frontend/src/marketing/pages/HomePage.tsx`.
- Modify `frontend/src/marketing/pages/ModelsPage.tsx`.
- Modify `frontend/src/marketing/pages/WorkbenchPage.tsx`.
- Modify `frontend/src/marketing/pages/MethodPage.tsx`.
- Modify `frontend/package.json` so `test:marketing` runs the complete marketing test directory.
- Rewrite or remove legacy `frontend/src/marketing/film/film.test.tsx` assertions that require rejected photography.
- After migration, delete unused legacy `film/` components/CSS/media metadata only when `rg`/search confirms no mounted imports.

---

### Task 1: Establish the new marketing test harness and freeze product behavior

**Files:**
- Modify: `frontend/package.json`
- Create: `frontend/src/marketing/possibility/productBehavior.test.tsx`
- Modify or replace: `frontend/src/marketing/film/film.test.tsx`

**Interfaces:**
- Consumes: existing `ScenarioProvider`, `runDeterministicMonteCarlo`, current public routes.
- Produces: a marketing-wide Vitest command and behavior tests that remain valid after visual markup is replaced.

- [ ] **Step 1: Change the marketing test script**

Set `test:marketing` to run the complete `src/marketing` test tree rather than only `film/film.test.tsx`.

- [ ] **Step 2: Write behavior-first tests**

Add tests named:

```ts
it("keeps the canonical public scenario deterministic")
it("preserves changed volatility across Home and Workbench")
it("invalidates replay confirmation after any input changes")
it("exports the exact current scenario without invented fields")
```

Pin the canonical values `0.35`, `0.05`, `50`, `24`, and `42`, and preserve the existing expected variances within the current tolerance.

- [ ] **Step 3: Remove legacy visual assertions**

Delete the test that requires `/media/math-intellect/unsplash/finance-screen.webp` and any assertion whose purpose is preserving old photographs, old copy, or old class names.

- [ ] **Step 4: Run the baseline**

Run: `cd frontend && npm run test:marketing`

Expected: PASS before visual migration begins.

- [ ] **Step 5: Commit**

```bash
git add frontend/package.json frontend/src/marketing
 git commit -m "test: freeze public model behavior before redesign"
```

---

### Task 2: Create the licensed-media gate and non-generative derivative pipeline

**Files:**
- Create: `frontend/src/marketing/possibility/media/mediaManifest.ts`
- Create: `frontend/src/marketing/possibility/media/mediaManifest.test.ts`
- Create: `frontend/scripts/build-possibility-media.mjs`
- Create directory at execution time: `frontend/public/media/math-intellect/possibility/source/`
- Create derivative directory at execution time: `frontend/public/media/math-intellect/possibility/optimized/`

**Interfaces:**
- Produces:

```ts
export type MediaRole = "worldCollision" | "gameForeground" | "marketEnvironment" | "agentCollective" | "methodStructure";
export interface LicensedMediaAsset {
  role: MediaRole;
  photoId: string;
  creator: string;
  sourceUrl: string;
  license: "Unsplash+" | "Unsplash";
  intrinsic: { width: number; height: number };
  focalIntent: string;
  nonEndorsement?: string;
  wideSrc: string;
  portraitSrc: string;
  detailSrc?: string;
  foregroundCutoutSrc?: string;
}
export const POSSIBILITY_MEDIA: Record<MediaRole, LicensedMediaAsset>;
```

- [ ] **Step 1: Acquire approved masters outside the code path**

The user downloads the approved licensed masters from the source pages in the spec and places/renames them as:

```text
world-collision-master.jpg
game-foreground-master.jpg
market-environment-master.jpg
agent-collective-master.jpg
method-structure-master.jpg
```

under `frontend/public/media/math-intellect/possibility/source/`.

For `market-environment-master.jpg`, use M1 or M2 only after the full-resolution crop passes the spec's flow/topology test. If neither passes, stop this task and research a replacement rather than using an old asset.

- [ ] **Step 2: Supply the real Game Theory cutout**

Create `game-foreground-cutout.png` or lossless WebP by manually isolating the hand + bishop from the licensed master. No generative fill, subject replacement, or synthesized pixels.

- [ ] **Step 3: Write manifest tests first**

Tests must assert:

```ts
expect(Object.keys(POSSIBILITY_MEDIA)).toEqual([
  "worldCollision", "gameForeground", "marketEnvironment", "agentCollective", "methodStructure"
]);
```

and no `wideSrc`, `portraitSrc`, `detailSrc`, or `foregroundCutoutSrc` contains legacy tokens such as `impact`, `water`, `river`, `shipping`, `murmuration`, `strategy-dialogue`, or `/cinematic/`.

Also assert every asset has a canonical `https://unsplash.com/photos/` source URL, non-zero intrinsic dimensions, and a non-empty focal intent.

- [ ] **Step 4: Implement the Sharp derivative script**

The script reads the five exact source names and produces role-specific responsive derivatives. It may resize, crop, compress, and change format only. It must never upscale beyond source dimensions.

Required outputs:

```text
world-collision-wide.avif/.webp
world-collision-portrait.avif/.webp
game-foreground-wide.avif/.webp
game-foreground-portrait.avif/.webp
game-foreground-cutout.webp
market-environment-wide.avif/.webp
market-environment-portrait.avif/.webp
agent-collective-wide.avif/.webp
agent-collective-portrait.avif/.webp
method-structure-wide.avif/.webp
method-structure-portrait.avif/.webp
```

- [ ] **Step 5: Populate exact provenance after reading master metadata**

Use Sharp metadata output to fill `intrinsic`. Record creator, photo ID, source page, actual license tier, retrieval date in a source comment or companion constant, and focal intent from the spec.

- [ ] **Step 6: Run media tests and derivative build**

Run:

```bash
cd frontend
node scripts/build-possibility-media.mjs
npm run test:marketing -- mediaManifest
```

Expected: all required outputs exist, no upscale warning, tests PASS.

- [ ] **Step 7: Commit**

Commit source masters only if project policy allows licensed masters in-repo; otherwise commit derivatives + manifest and retain masters in the approved asset store. Never commit credentials.

```bash
git add frontend/scripts frontend/src/marketing/possibility/media frontend/public/media/math-intellect/possibility
 git commit -m "feat: add Possibility Engine licensed media pipeline"
```

---

### Task 3: Build the new visual foundation and capability runtime

**Files:**
- Create: `frontend/src/marketing/possibility/styles/tokens.css`
- Create: `frontend/src/marketing/possibility/styles/base.css`
- Create: `frontend/src/marketing/possibility/runtime/useMarketingCapabilities.ts`
- Create: `frontend/src/marketing/possibility/runtime/DesktopScrollBridge.tsx`
- Create: `frontend/src/marketing/possibility/runtime/runtime.test.tsx`
- Modify: `frontend/src/marketing/MarketingShell.tsx`

**Interfaces:**
- Produces:

```ts
export interface MarketingCapabilities {
  reducedMotion: boolean;
  finePointer: boolean;
  desktop: boolean;
  allowSmoothScroll: boolean;
}
export function useMarketingCapabilities(): MarketingCapabilities;
export function DesktopScrollBridge(): null;
```

- [ ] **Step 1: Write capability tests**

Test media-query changes after mount, not only initial values. Assert `allowSmoothScroll` is false on reduced motion and coarse pointer/mobile.

- [ ] **Step 2: Implement capability subscription**

Use `matchMedia` listeners for reduced motion and fine pointer plus resize-derived desktop state. Clean up every listener.

- [ ] **Step 3: Implement one Lenis owner**

`DesktopScrollBridge` creates Lenis only when `allowSmoothScroll === true`, feeds GSAP/ScrollTrigger from one clock, stops/destroys on capability changes and unmount, and never runs on touch/reduced motion.

- [ ] **Step 4: Add visual tokens**

Encode the spec's carbon/graphite/mineral/cobalt/steel/error roles, 12-column desktop grid, mobile margins, focus style, safe-area variables, typography roles, and z-index layers. Do not import legacy film palette variables into the new components.

- [ ] **Step 5: Simplify `MarketingShell`**

Remove the generic global `[data-reveal]` fade-up and global path-draw timelines. Mount new CSS and `DesktopScrollBridge`; keep `ScenarioProvider`, skip link, header, main, and footer.

- [ ] **Step 6: Verify**

Run: `cd frontend && npm run test:marketing && npm run build`

Expected: PASS; public routes still render even before new scene migration.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/marketing/possibility frontend/src/marketing/MarketingShell.tsx
 git commit -m "feat: add Possibility Engine visual runtime"
```

---

### Task 4: Build the Origin State and trajectory geometry as reusable product-native visuals

**Files:**
- Create: `frontend/src/marketing/possibility/trajectory/trajectoryGeometry.ts`
- Create: `frontend/src/marketing/possibility/trajectory/trajectoryGeometry.test.ts`
- Create: `frontend/src/marketing/possibility/trajectory/OriginMark.tsx`
- Create: `frontend/src/marketing/possibility/trajectory/TrajectoryField.tsx`
- Create: `frontend/src/marketing/possibility/trajectory/trajectory.css`

**Interfaces:**
- Produces:

```ts
export interface TrajectoryDomain { min: number; max: number }
export function getSharedTrajectoryDomain(results: MonteCarloResult[]): TrajectoryDomain;
export function pathToSvg(points: number[], domain: TrajectoryDomain, width: number, height: number): string;

export interface TrajectoryFieldProps {
  current: MonteCarloResult;
  baseline?: MonteCarloResult;
  compare?: boolean;
  variant: "hero" | "field" | "comparison" | "instrument";
  focusPathIndex?: number;
  className?: string;
}
export function TrajectoryField(props: TrajectoryFieldProps): JSX.Element;
```

- [ ] **Step 1: Write geometry tests**

Assert shared domain contains every current/baseline point, includes zero, adds finite padding, and `pathToSvg` preserves first/last step order without clipping values.

- [ ] **Step 2: Implement pure geometry**

No DOM measurement in geometry functions. Inputs fully determine output.

- [ ] **Step 3: Write renderer accessibility test**

Render 24 paths and assert the SVG accessible title reports path count, mean endpoint, and variance while decorative individual paths are hidden from the accessibility tree.

- [ ] **Step 4: Implement `OriginMark` and `TrajectoryField`**

Keep actual computed paths. Support baseline/current style distinction without color alone. Expose stable `data-origin-state` and `data-transition-actor="trajectory"` hooks for later motion/transition tasks.

- [ ] **Step 5: Verify**

Run: `cd frontend && npm run test:marketing -- trajectory`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/marketing/possibility/trajectory
 git commit -m "feat: add reusable Origin State trajectory system"
```

---

### Task 5: Derive real model-family visual data

**Files:**
- Create: `frontend/src/marketing/possibility/models/modelVisualData.ts`
- Create: `frontend/src/marketing/possibility/models/modelVisualData.test.ts`
- Create: `frontend/src/marketing/possibility/models/GameMatrixGraphic.tsx`
- Create: `frontend/src/marketing/possibility/models/MarketFlowGraphic.tsx`
- Create: `frontend/src/marketing/possibility/models/AgentNetworkGraphic.tsx`

**Interfaces:**
- Consumes: `calculateGameEquilibrium`, `runMarketDynamics`, `runConflictInteraction` from `frontend/src/math/deterministicModels.ts`.
- Produces:

```ts
export const DEFAULT_GAME_VISUAL: GameTheoryResult;
export const DEFAULT_MARKET_VISUAL: MarketDynamicsResult;
export const DEFAULT_AGENT_VISUAL: ConflictResult;
```

and three SVG/DOM graphics that receive those exact result types.

- [ ] **Step 1: Write determinism/shape tests**

Assert the Game matrix is 2×2, Market series is deterministic and non-empty, and Agent visual contains the deterministic 32-agent field. Do not invent additional “AI” metrics.

- [ ] **Step 2: Implement shared default visual data**

Use existing helpers and their default parameters. Mark these visuals as public illustrative model structures, not photographed evidence.

- [ ] **Step 3: Implement semantic graphics**

Game: visible matrix with accessible label. Market: flow/series graphic with accessible summary. Agent: point/link field using actual agent positions; no fake motion data beyond the returned positions/vectors.

- [ ] **Step 4: Verify**

Run: `cd frontend && npm run test:marketing -- modelVisualData`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/marketing/possibility/models
 git commit -m "feat: derive truthful model-family visuals"
```

---

### Task 6: Compose Home H0–H4 as strong static frames before motion

**Files:**
- Create: `frontend/src/marketing/possibility/home/HomeFilm.tsx`
- Create: `frontend/src/marketing/possibility/home/OriginEntryHero.tsx`
- Create: `frontend/src/marketing/possibility/home/RealityConditions.tsx`
- Create: `frontend/src/marketing/possibility/home/home.css`
- Create: `frontend/src/marketing/possibility/home/HomeFilm.test.tsx`
- Modify: `frontend/src/marketing/pages/HomePage.tsx`

**Interfaces:**
- Consumes: `useScenario()`, `TrajectoryField`, `OriginMark`, `POSSIBILITY_MEDIA.worldCollision`.
- Produces: static H0–H4 composition with scene IDs `home-entry`, `home-hero`, `home-reality`, `home-conditions`, `home-branch`.

- [ ] **Step 1: Write structural tests**

Assert the Home hero contains no `<img>`, contains the primary headline and CTA, exposes one semantic origin actor, and the first photograph on the route is `worldCollision`, not any legacy source.

- [ ] **Step 2: Implement H0–H1 static composition**

Use completed trajectory geometry in the hero. Do not add scroll animation yet. The hero must work as a still at 1440×900 and 390×844.

- [ ] **Step 3: Implement H2 static composition**

Render `worldCollision` as structural media with art-directed picture sources and path overlay. Include context wording that does not imply the photograph is model output.

- [ ] **Step 4: Implement H3 Conditions Chamber**

Render exact `x₀`, `μ`, `σ`, paths, steps, and seed from scenario state. No evenly spaced “stat cards.”

- [ ] **Step 5: Implement H4 Branch hold**

Use the actual current 24-path data. No decorative extra paths in the static baseline.

- [ ] **Step 6: Run tests/build**

Run: `cd frontend && npm run test:marketing && npm run build`

Expected: PASS.

- [ ] **Step 7: Manual static-frame gate**

Inspect at 1440×900, 390×844, and 430×930 with motion disabled. Reject before continuing if F01/F02/F03/F04 fail the spec silhouettes, if the hero reads as a split SaaS hero, or if photography is merely background decoration.

- [ ] **Step 8: Commit**

```bash
git add frontend/src/marketing/pages/HomePage.tsx frontend/src/marketing/possibility/home
 git commit -m "feat: compose Possibility Engine opening frames"
```

---

### Task 7: Add Home H5–H6 direct manipulation and comparison

**Files:**
- Create: `frontend/src/marketing/possibility/home/BranchPerturbCompare.tsx`
- Modify: `frontend/src/marketing/possibility/home/HomeFilm.tsx`
- Modify: `frontend/src/marketing/possibility/home/home.css`
- Modify: `frontend/src/marketing/possibility/home/HomeFilm.test.tsx`

**Interfaces:**
- Consumes: `useScenario()` setters/results and `TrajectoryField` comparison variant.
- Produces: one native volatility range input and a baseline/current comparison membrane composition.

- [ ] **Step 1: Write interaction tests**

Assert changing the Home volatility slider to `0.60` updates scenario state immediately, updates displayed current variance, keeps seed/drift/path/step values unchanged, and preserves native ArrowLeft/ArrowRight semantics.

- [ ] **Step 2: Implement H5**

Embed the native range control into the field composition. Do not re-run long entrance animation on `input/change`.

- [ ] **Step 3: Implement H6**

Render one shared coordinate field. Use CSS clipping/masking for the membrane so baseline/current paths share geometry. Provide semantic exact metrics outside the clipped visual so information is not color-only.

- [ ] **Step 4: Add static reduced-motion comparison**

When reduced motion is active, render a fixed split/shared-field state with explicit labels and no scrub dependency.

- [ ] **Step 5: Verify**

Run: `cd frontend && npm run test:marketing -- HomeFilm`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/marketing/possibility/home
 git commit -m "feat: add direct model intervention and comparison"
```

---

### Task 8: Build Home H7–H11 model chambers without repeated panels

**Files:**
- Create: `frontend/src/marketing/possibility/home/ModelChambers.tsx`
- Modify: `frontend/src/marketing/possibility/home/HomeFilm.tsx`
- Modify: `frontend/src/marketing/possibility/home/home.css`
- Modify: `frontend/src/marketing/possibility/home/HomeFilm.test.tsx`

**Interfaces:**
- Consumes: real `TrajectoryField`, `GameMatrixGraphic`, `MarketFlowGraphic`, `AgentNetworkGraphic`, and approved media roles `gameForeground`, `marketEnvironment`, `agentCollective`.
- Produces: semantic chamber sections with IDs `monte-carlo`, `game-theory`, `market-dynamics`, `agent-interaction`.

- [ ] **Step 1: Write chamber-content tests**

Assert all four model names are present, Monte Carlo renders no photograph, Game Theory uses only the approved Game media, Market uses only approved Market media, and Agent uses only approved Agent media.

- [ ] **Step 2: Implement H7/H8**

Create the chamber threshold and Monte Carlo field using product-native trajectories. If additional higher-density paths are ever added, label them illustrative; baseline implementation should remain actual 24-path data.

- [ ] **Step 3: Implement H9**

Compose matrix technical plane + board image + real hand/bishop cutout foreground. The cutout uses empty alt if the underlying contextual image already carries the description.

- [ ] **Step 4: Implement H10**

Compose Market flow graphic over/through the approved environment without implying the environment is market data.

- [ ] **Step 5: Implement H11**

Compose collective image + selected point overlay + actual deterministic Agent network visual. Include context copy/accessible wording that keeps photo and model distinct.

- [ ] **Step 6: Implement mobile static composition**

At mobile widths, chambers are normal vertical sections. No horizontal overflow track, no drag-only navigation, no hidden model content.

- [ ] **Step 7: Manual static-frame gate**

Inspect F07–F10 and M7–M10 before adding chamber motion. F08 and F10 target 9/10. Reject equal silhouettes or card-like repetition.

- [ ] **Step 8: Commit**

```bash
git add frontend/src/marketing/possibility/home frontend/src/marketing/possibility/models
 git commit -m "feat: compose four Possibility Engine model chambers"
```

---

### Task 9: Build Home H12–H15 reproducibility, analyst threshold, and finale

**Files:**
- Create: `frontend/src/marketing/possibility/home/ReproduceFinale.tsx`
- Modify: `frontend/src/marketing/possibility/home/HomeFilm.tsx`
- Modify: `frontend/src/marketing/possibility/home/home.css`
- Modify: `frontend/src/marketing/possibility/home/HomeFilm.test.tsx`

**Interfaces:**
- Consumes: `useScenario().replay`, `replayed`, current result, semantic links to `/method`, `/workbench`, `/models`.
- Produces: replay equality state, non-fabricated system-level analyst record preview, Method threshold, and Origin State finale.

- [ ] **Step 1: Write replay/finale tests**

Assert replay changes status to `Reproduced`/equivalent truthful copy only after actual replay equality, no user-specific Analyst numbers are fabricated, and final CTA links to Workbench.

- [ ] **Step 2: Implement H12**

Show run A/run B from actual current state and replay. Their visual overlay resolves only from `demo.replayed === true`.

- [ ] **Step 3: Implement H13**

Use system-level labels only: simulation history, Analyst Level, Verification Units, run streak/progression language without invented personal values.

- [ ] **Step 4: Implement H14**

Record-to-equation static composition and Method CTA.

- [ ] **Step 5: Implement H15**

Resolve visually back to the Origin State. Footer remains after the narrative scene; it does not perform the emotional resolution.

- [ ] **Step 6: Verify and static-frame review**

Run: `cd frontend && npm run test:marketing -- HomeFilm && npm run build`

Then review F11–F14 and M11–M14 with motion disabled.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/marketing/possibility/home
 git commit -m "feat: resolve Home film through reproducibility and origin finale"
```

---

### Task 10: Add the Home macro motion system only after static frames pass

**Files:**
- Create: `frontend/src/marketing/possibility/home/useHomeFilmMotion.ts`
- Modify: `frontend/src/marketing/possibility/home/HomeFilm.tsx`
- Modify: `frontend/src/marketing/possibility/home/home.css`
- Create: `frontend/src/marketing/possibility/home/homeMotion.test.tsx`

**Interfaces:**
- Produces:

```ts
export function useHomeFilmMotion(rootRef: RefObject<HTMLElement | null>, capabilities: MarketingCapabilities): void;
```

- [ ] **Step 1: Write lifecycle tests**

Mock GSAP/ScrollTrigger enough to assert the hook does nothing in reduced motion, creates one route-scoped context in full motion, and reverts/cleans all triggers on unmount.

- [ ] **Step 2: Implement H0–H6 choreography**

Use the spec's `MOVE → HOLD → COUNTER-MOVE → OVERLAP → HANDOFF → RESOLVE → READ` rhythm. Keep source values in CSS custom properties or explicit timeline constants close to scene code. Do not animate numerical input from scroll.

- [ ] **Step 3: Implement H7–H11 chamber travel**

Desktop vertical input may drive lateral/spatial travel, but each chamber owns a different silhouette. Measure actual chamber geometry; do not hard-code a generic 6000px track.

- [ ] **Step 4: Implement H12–H15 resolution**

Reproduction alignment and finale collapse are motion enhancements over already-valid static states.

- [ ] **Step 5: Add fast-scroll handling**

Use `ScrollTrigger` lifecycle/velocity where useful to settle at valid scene states. No delayed reveal should fire after its scene has exited.

- [ ] **Step 6: Validate reverse cleanup**

Every scene timeline must be scrub-safe in reverse; old/current/incoming owners cannot remain simultaneously visible after direction change.

- [ ] **Step 7: Verify**

Run: `cd frontend && npm run test:marketing && npm run build`

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add frontend/src/marketing/possibility/home
 git commit -m "feat: choreograph Possibility Engine Home motion"
```

---

### Task 11: Replace `/models` with the Model Atlas

**Files:**
- Create: `frontend/src/marketing/possibility/models/ModelAtlas.tsx`
- Create: `frontend/src/marketing/possibility/models/model-atlas.css`
- Create: `frontend/src/marketing/possibility/models/ModelAtlas.test.tsx`
- Modify: `frontend/src/marketing/pages/ModelsPage.tsx`

**Interfaces:**
- Consumes: model visual data/graphics, approved model media, semantic IDs.
- Produces:

```ts
export type ModelFamilyId = "monte-carlo" | "game-theory" | "market-dynamics" | "agent-interaction";
export function ModelAtlas(): JSX.Element;
```

- [ ] **Step 1: Write direct-entry/hash tests**

Assert all four semantic model anchors exist and `/models#game-theory` can render/focus the correct section without any prior Home transition state.

- [ ] **Step 2: Implement dominant selected state**

One model owns the composition while neighboring models appear as partial previews/index entries. Do not reuse Home's chamber markup wholesale.

- [ ] **Step 3: Add desktop selection interaction**

Wheel/drag may enhance exploration, but buttons/semantic anchors and keyboard selection remain fully operable.

- [ ] **Step 4: Add mobile atlas mode**

Use vertical model sections or an accessible tab/index pattern. No drag requirement.

- [ ] **Step 5: Verify**

Run: `cd frontend && npm run test:marketing -- ModelAtlas && npm run build`

- [ ] **Step 6: Commit**

```bash
git add frontend/src/marketing/pages/ModelsPage.tsx frontend/src/marketing/possibility/models
 git commit -m "feat: replace Models gallery with exploratory atlas"
```

---

### Task 12: Replace `/workbench` with the precision instrument

**Files:**
- Create: `frontend/src/marketing/possibility/workbench/WorkbenchInstrument.tsx`
- Create: `frontend/src/marketing/possibility/workbench/workbench.css`
- Create: `frontend/src/marketing/possibility/workbench/WorkbenchInstrument.test.tsx`
- Modify: `frontend/src/marketing/pages/WorkbenchPage.tsx`

**Interfaces:**
- Consumes: existing scenario state and `TrajectoryField variant="instrument"`.
- Produces: an integrated instrument retaining all current behavior.

- [ ] **Step 1: Write preservation tests**

Tests must assert volatility, drift, seed, reset, replay, JSON save, 24 paths, 50 steps, baseline comparison, Method link, and Models link all remain available.

- [ ] **Step 2: Add native-input focus test**

Focus volatility and drift controls, send arrow-key events, and assert values change as native inputs. No scroll/chamber handler may prevent the event.

- [ ] **Step 3: Implement the instrument layout**

Plot owns 65–75% of primary visual mass. Controls live along/near the plot geometry rather than a stack of decorative cards. Exact metrics remain readable in one restrained ledger.

- [ ] **Step 4: Preserve download implementation**

Keep the JSON schema exactly tied to current model/input/result data. Refactor helper only if it improves testability; do not add visual metadata to the exported model result unless explicitly required.

- [ ] **Step 5: Add reduced-motion/mobile composition**

No special motion is required for direct calculation updates. Mobile keeps large touch controls and readable plot/metrics.

- [ ] **Step 6: Verify**

Run: `cd frontend && npm run test:marketing -- WorkbenchInstrument && npm run build`

- [ ] **Step 7: Commit**

```bash
git add frontend/src/marketing/pages/WorkbenchPage.tsx frontend/src/marketing/possibility/workbench
 git commit -m "feat: redesign Workbench as precision instrument"
```

---

### Task 13: Replace `/method` with the technical publication

**Files:**
- Create: `frontend/src/marketing/possibility/method/MethodPublication.tsx`
- Create: `frontend/src/marketing/possibility/method/method.css`
- Create: `frontend/src/marketing/possibility/method/MethodPublication.test.tsx`
- Modify: `frontend/src/marketing/pages/MethodPage.tsx`

**Interfaces:**
- Consumes: `KaTeXBlock`, current scenario/replay, optional `methodStructure` image.
- Produces: anchors `starting-state`, `sampling`, `comparison`, `replay`, `limits` plus a persistent mathematical spine.

- [ ] **Step 1: Write truth/anchor tests**

Assert the additive equation remains `x_{t+1}=x_t+μΔt+σ√Δt Z_t`, the five anchors exist, canonical public values are shown, replay remains functional, and limitations explicitly reject real-world prediction claims.

- [ ] **Step 2: Implement publication structure**

Keep reading primary. Use the mathematical spine to connect sections; no long pin or horizontal gallery.

- [ ] **Step 3: Add equation-term focus/hover behavior**

Every hover treatment must have a focus equivalent. Term selection highlights its relevant explanation without hiding text from non-JS/reduced-motion states.

- [ ] **Step 4: Add at most one structural photograph**

Use `methodStructure` only if its crop/geometry genuinely transitions into axis/grid/measurement composition. If static review says it is decorative, remove the image rather than substituting legacy media.

- [ ] **Step 5: Verify direct hashes**

Render direct entries such as `/method#comparison` and assert the section is present independent of route animation.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/marketing/pages/MethodPage.tsx frontend/src/marketing/possibility/method
 git commit -m "feat: redesign Method as technical publication"
```

---

### Task 14: Redesign navigation around the Origin State without photographic previews

**Files:**
- Modify: `frontend/src/marketing/components/SiteHeader.tsx`
- Modify: `frontend/src/marketing/components/SiteFooter.tsx`
- Create: `frontend/src/marketing/components/SiteHeader.test.tsx`
- Create: `frontend/src/marketing/possibility/navigation/menu.css`

**Interfaces:**
- Consumes: `OriginMark`, lightweight route-preview representations.
- Produces: same semantic link destinations and accessible dialog behavior, with product-native visual previews.

- [ ] **Step 1: Port focus-trap tests out of legacy film test**

Assert menu open locks body scroll, first control receives focus, Shift+Tab wraps, Escape closes and returns focus, and unmount restores previous body overflow.

- [ ] **Step 2: Remove `PHOTO_LIBRARY` from `SiteHeader`**

Routes contain only label/to/preview-kind metadata. No menu image may reference rejected photography.

- [ ] **Step 3: Implement Origin State route previews**

Focus/hover transforms a small central product-native actor: Models branches, Workbench becomes plot/control, Method becomes equation, account routes reduce to quiet origin. Preview is decorative enhancement; link text remains sufficient.

- [ ] **Step 4: Make footer quiet**

Footer follows narrative resolution and contains navigation/legal/account utility without a mandatory giant wordmark or photographic reprise.

- [ ] **Step 5: Verify**

Run: `cd frontend && npm run test:marketing -- SiteHeader`

- [ ] **Step 6: Commit**

```bash
git add frontend/src/marketing/components frontend/src/marketing/possibility/navigation
 git commit -m "feat: redesign public navigation around Origin State"
```

---

### Task 15: Replace the timed App curtain with cancellable public-route continuity

**Files:**
- Create: `frontend/src/marketing/possibility/transitions/PublicTransitionProvider.tsx`
- Create: `frontend/src/marketing/possibility/transitions/TransitionOverlay.tsx`
- Create: `frontend/src/marketing/possibility/transitions/publicTransitions.test.tsx`
- Modify: `frontend/src/marketing/MarketingShell.tsx`
- Modify: `frontend/src/App.tsx`

**Interfaces:**
- Produces:

```ts
export type PublicTransitionKind = "trajectory" | "model" | "record" | "curtain" | "quiet";
export interface PublicTransitionIntent {
  to: string;
  kind: PublicTransitionKind;
  actorId?: string;
}
```

Anchors may opt in with `data-transition-kind` and `data-transition-actor-id`; normal links remain valid without these attributes.

- [ ] **Step 1: Write routing-interception tests**

Assert modified clicks, downloads, external links, same-route links, and target `_blank` remain native. Reduced-motion navigation must navigate directly without overlay travel.

- [ ] **Step 2: Write cancellation test**

Start one transition, trigger a second destination before completion, and assert only the latest navigation completes, overlays are removed, body overflow is restored, and no stale timer/listener remains.

- [ ] **Step 3: Implement source capture**

On an opted-in internal link, capture the real source actor rect and DOM/SVG visual. Do not fabricate a placeholder rectangle as the shared actor.

- [ ] **Step 4: Implement destination handoff**

After route mount, find the exact matching destination actor ID. Animate measured translate/scale/crop into it with a bounded timeout. If no target appears, fall back to immediate route content plus a short settle; never show a blank waiting screen.

- [ ] **Step 5: Implement generic curtain**

Use the 24-path mask family only for links with `kind="curtain"`. Total target remains within 0.35–0.85s and is not repeated for hash-only navigation.

- [ ] **Step 6: Preserve history and focus behavior**

Keep `RouteExperienceManager` Back/Forward and hash behavior. After normal PUSH navigation, focus the destination `h1[tabindex="-1"]` when appropriate without breaking browser history.

- [ ] **Step 7: Remove old `AppTransitionLayer` interception**

`App.tsx` returns to routing/error/suspense responsibilities. Marketing-specific transitions live inside MarketingShell; protected application navigation is untouched.

- [ ] **Step 8: Verify**

Run: `cd frontend && npm run test:marketing -- publicTransitions && npm run build`

- [ ] **Step 9: Commit**

```bash
git add frontend/src/App.tsx frontend/src/marketing/MarketingShell.tsx frontend/src/marketing/possibility/transitions
 git commit -m "feat: add cancellable public route continuity"
```

---

### Task 16: Finish responsive, reduced-motion, no-GPU, and fast/reverse-scroll states

**Files:**
- Modify: all new `possibility/**/*.css`
- Modify: `frontend/src/marketing/possibility/home/useHomeFilmMotion.ts`
- Modify: relevant route tests

**Interfaces:**
- Consumes: completed static and full-motion routes.
- Produces: authored desktop/tablet/mobile/reduced-motion modes without separate content forks.

- [ ] **Step 1: Add responsive tests for semantic completeness**

In jsdom, capability mocks should verify reduced-motion mode does not mount ScrollTrigger/Lenis and all Home scene headings/controls remain present.

- [ ] **Step 2: Implement 820px tablet mode**

Reduce simultaneous planes, shorten pins, simplify overlaps, and keep photography rather than removing it.

- [ ] **Step 3: Implement 430/390/360 mobile modes**

Use native flow, portrait crops, one dominant visual actor per viewport, touch-safe controls, safe-area padding, and vertical model sequence.

- [ ] **Step 4: Add no-GPU feature gate**

Baseline SVG/DOM is the default, so any optional GPU enhancement must fail closed: remove the canvas and leave the DOM composition untouched.

- [ ] **Step 5: Tune fast/reverse behavior**

At fast input, skip microstates and settle ownership. On immediate reverse, reconstruct semantic states without ghosts, stale pointer events, or delayed copy.

- [ ] **Step 6: Verify**

Run: `cd frontend && npm run test:marketing && npm run lint && npm run build`

Expected: all PASS.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/marketing/possibility
 git commit -m "feat: complete responsive and fallback art direction"
```

---

### Task 17: Remove the rejected legacy film visual system only after migration is complete

**Files:**
- Delete if unused: `frontend/src/marketing/film/HomeHero.tsx`
- Delete if unused: `frontend/src/marketing/film/ObservationBridge.tsx`
- Delete if unused: `frontend/src/marketing/film/ModelJourney.tsx`
- Delete if unused: `frontend/src/marketing/film/ModelCinema.tsx`
- Delete if unused: `frontend/src/marketing/film/photoLibrary.ts`
- Delete if unused: `frontend/src/marketing/film/filmMedia.ts`
- Delete if unused: `frontend/src/marketing/film/film.css`
- Delete if unused: `frontend/src/marketing/film/refinement.css`
- Keep or relocate only functional files still imported: `ScenarioContext.tsx`, `scenario.ts`, and any calculation-neutral utility that remains justified.

**Interfaces:**
- Consumes: fully migrated public routes.
- Produces: no mounted/public import of rejected visual media or CSS.

- [ ] **Step 1: Search imports before deletion**

Run from repo root:

```bash
rg "HomeHero|ObservationBridge|ModelJourney|ModelCinema|PHOTO_LIBRARY|filmMedia|film\.css|refinement\.css" frontend/src
```

Expected: only files scheduled for deletion or documentation references; no mounted public route imports.

- [ ] **Step 2: Search served legacy media references**

```bash
rg "impact|water-study|branching-river|strategy-dialogue|shipping-port|collective-flight|hero-interchange" frontend/src frontend/public
```

Do not delete provenance/archive files outside public serving if they are intentionally retained for audit, but no new public component may reference them.

- [ ] **Step 3: Delete dead visual implementation**

Delete only files proven unused. Preserve scenario functionality.

- [ ] **Step 4: Verify full frontend**

Run:

```bash
cd frontend
npm run test:marketing
npm run lint
npm run build
```

Expected: PASS with no missing legacy asset imports.

- [ ] **Step 5: Commit**

```bash
git add -A frontend/src/marketing frontend/public/media/math-intellect
 git commit -m "refactor: retire rejected Math Intellect film system"
```

---

### Task 18: Production-grade manual/live visual QA and correction gate

**Files:**
- Modify only files implicated by concrete QA findings.
- Create: `docs/ui-ux/MATH_INTELLECT_POSSIBILITY_ENGINE_QA_2026-10-17.md`

**Interfaces:**
- Consumes: built/deployed implementation.
- Produces: evidence-based acceptance ledger; no self-awarded 9/10 claim.

- [ ] **Step 1: Deploy a preview or inspect the approved live target**

Do not replace production merely to collect screenshots unless release has been explicitly approved. Record the exact commit/deployment inspected.

- [ ] **Step 2: Desktop manual pass**

Inspect 1440×900 and 1366×768 at first viewport, 25/50/75% Home progress, all model chamber midpoints, Workbench, Models, Method, menu, route transitions, finale.

- [ ] **Step 3: Motion stress pass**

Check normal wheel/trackpad, fast wheel, immediate reverse, PageDown/End, scrollbar drag where relevant, repeated route clicks, transition cancellation, Back/Forward, and hash navigation.

- [ ] **Step 4: Mobile/tablet pass**

Inspect 820×1180, 430×930, 390×844, 360×800. Confirm portrait crops, no desktop pinning, no tiny controls, no horizontal overflow, no fixed chrome covering content.

- [ ] **Step 5: Reduced-motion / keyboard / fallback pass**

Enable reduced motion, keyboard through menu/routes/controls, and test no-GPU path where environment permits. All content must remain complete.

- [ ] **Step 6: Static acceptance review**

Review F00–F14 against the spec. Flag each as `ACCEPTED`, `ACCEPTED WITH CORRECTIONS`, `CONDITIONAL REJECT`, or `REJECTED`. Do not add points for build correctness.

- [ ] **Step 7: Correct only observed issues**

Apply surgical changes tied to recorded evidence, then re-run the exact failed state. Do not introduce new art direction during QA.

- [ ] **Step 8: Final engineering verification**

```bash
cd frontend
npm run test:marketing
npm run lint
npm run build
```

Expected: PASS.

- [ ] **Step 9: Commit QA corrections and ledger**

```bash
git add frontend docs/ui-ux/MATH_INTELLECT_POSSIBILITY_ENGINE_QA_2026-10-17.md
 git commit -m "fix: close Possibility Engine visual QA findings"
```

---

## Self-Review Against the Design Spec

### Spec coverage

- Media acquisition/provenance/derivatives: Task 2.
- Visual foundation/tokens/capability runtime: Task 3.
- Origin/trajectory visual language: Task 4.
- Truthful model-family visual grammar: Task 5.
- Home H0–H15 static composition: Tasks 6–9.
- Home macro choreography, fast/reverse: Task 10 and Task 16.
- Models atlas: Task 11.
- Workbench instrument: Task 12.
- Method publication: Task 13.
- Navigation: Task 14.
- Route continuity/cancellation/history: Task 15.
- Mobile/reduced-motion/no-GPU: Task 16.
- Rejected visual-system deletion: Task 17.
- Manual/live acceptance: Task 18.

### Architectural decisions that are intentionally fixed

- New design code lives under `marketing/possibility/`; legacy `film/` remains only until migration finishes.
- Existing `ScenarioProvider` remains the public numerical state owner.
- Hero and Monte Carlo chamber do not depend on photography.
- Product-native visuals use existing deterministic helpers rather than fabricated decorative diagrams.
- GSAP owns Home macro scroll; React owns state; Lenis is optional desktop substrate; native scroll owns touch/reduced motion.
- Route-transition logic moves out of top-level `App.tsx` into marketing scope.
- Media filenames are role-based rather than stock-subject-based.
- Static frame review happens before flagship motion is implemented.
- Legacy media is never an automatic fallback.

### Execution dependency

Task 2 requires the user's licensed Unsplash/Unsplash+ master downloads before photographic Home/Models/Method scenes can be completed. Tasks 1, 3, 4, 5 and the photo-free portions of Home can technically begin first, but no implementation should substitute rejected old media while waiting for the approved masters.
