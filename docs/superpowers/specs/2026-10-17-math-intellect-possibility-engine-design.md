# Math Intellect — Possibility Engine Design Contract

**Date:** 17 October 2026  
**Scope:** Public marketing routes only: `/`, `/models`, `/workbench`, `/method`, plus public navigation and route transitions. Authenticated application routes are intentionally outside this redesign.  
**Status:** DESIGN SPECIFICATION FOR REVIEW. No frontend implementation is authorized by this document alone.  
**Authority:** This document supersedes the visual direction, photography, story, scene composition, hero treatment, model-gallery composition, and media decisions in the prior Math Intellect Film 01–08 documents and the 17 October redirection/refinement notes where they conflict with this contract. Product truth, working calculations, accessibility behavior, semantic routes, and protected application functionality remain authoritative.

---

## 0. Why a new contract is necessary

The current public site is not a refinement target. It is a functional substrate with a visual direction that is being rejected.

The prior Film 05 review already identified the central weaknesses of the liquid-impact concept: the opening could read like a sophisticated split landing page, the impact image risked becoming one good stock photograph repeated too often, and the physical liquid metaphor could imply a fluid-dynamics product. Film 08 nevertheless implemented the liquid-impact photograph as the recurring hero and finale actor, then built the four-model cinema around editorial photography. The live result is therefore coherent with its old brief but below the new Valtum standard.

This contract makes the correction explicit:

- The white liquid-impact hero is removed.
- Water, river-delta, laptop-conversation, shipping-container, current flock, current chess, current city-crossing, and all other installed public marketing photographs receive no retention preference.
- The old editorial green / photographic-science visual grammar is removed.
- The existing model cinema panel grammar is removed.
- The existing page silhouettes are not protected.
- AI-generated photography and AI-generated substitute illustrations are prohibited for final public media.
- New licensed photography is sourced from Unsplash / Unsplash+ only unless the user explicitly changes that rule.
- The hero contains no stock photograph.

What remains valuable is product truth: a deterministic seeded public model, real adjustable inputs, shared-scale comparison, replay, result export, model families, semantic routes, accessibility behavior, and the protected product behind the marketing layer.

---

# 1. Product truth

## 1.1 Verified public scenario

The current marketing scenario state is real repository functionality:

- starting value: `0`
- volatility: `σ = 0.35` initially
- drift: `μ = 0.05` initially
- seed: `42` initially
- paths: `24`
- steps: `50`
- baseline: same current drift and seed with `σ = 0.35`
- changed state: recalculated in-browser when volatility, drift, or seed changes
- replay: reruns the same deterministic function and checks equality with the current result

The user can already change volatility, drift, and seed in Workbench, replay the calculation, and export the current inputs/results as JSON. These are product-native creative materials and must remain truthful.

## 1.2 Public model families

Current public model families are:

- Monte Carlo
- Game Theory
- Market Dynamics
- Agent Interaction

The current source calls the Agent Interaction ID `conflict`; the public label is Agent Interaction. The redesign must preserve working destinations and product truth rather than force a new route structure for visual convenience.

## 1.3 Product promise

**Math Intellect turns assumptions into inspectable model states.**

A visitor should be able to understand that:

1. a model begins from explicit conditions;
2. those conditions produce inspectable possible states;
3. changing a condition changes the model output;
4. a baseline and changed state can be compared honestly;
5. different questions require different mathematical structures;
6. a seeded run can be reproduced;
7. every model has a boundary and should not be confused with prediction outside its assumptions.

---

# 2. Creative thesis

## Internal directing title

# THE POSSIBILITY ENGINE

This is not necessarily public copy. It is the internal world-building concept.

## One-sentence creative contract

**Math Intellect is a cinematic possibility engine in which one mathematical origin survives the entire journey, continuously transforming from state to path to field to matrix to network to reproducible evidence, while real-world photography enters only as environmental context and every motion is caused by a mathematical relationship, user action, or change of representation.**

---

# 3. Protagonist

## 3.1 The Origin State

The persistent protagonist is the **Origin State**.

For the public diffusion example it begins as:

`x₀ = 0`

The same semantic actor evolves through the site:

`origin → equation → parameter anchor → path source → endpoint field → comparison state → decision node → market state → agent → network → run record → equation → origin`

It does not have to be one permanent DOM node. It must remain semantically continuous.

## 3.2 Why this is stronger than a photographic protagonist

A licensed photograph can be excellent, but it belongs to another creator and another physical event. Making a stock photograph the hero makes Math Intellect visually dependent on stock art.

The Origin State is ownable because it is derived from the product itself. It can become the loader, hero, route carry, navigation preview, model transformation, Workbench graph origin, Method equation anchor, and finale.

---

# 4. World laws

These laws govern every route, scene, transition, and interaction.

## Law 1: Nothing important appears from nowhere

A point becomes a line. A line becomes a path. Paths become a field. A field becomes a distribution or matrix. A matrix becomes nodes. Nodes become agents. Agents become a network. A run becomes a record. The record collapses back to the origin.

Generic section fades are not the primary scene-transition language.

## Law 2: Representation may change; identity does not

The visitor should understand that the same underlying state is being represented differently.

## Law 3: Photography belongs to reality, not calculation

Photography represents environment, human action, physical systems, scale, context, collective behavior, and consequence.

The model layer represents equations, paths, states, matrices, networks, parameters, statistics, and evidence.

The two layers may overlap. They may never be visually or verbally conflated.

## Law 4: Scroll creates narrative time

Pinning is used only where the visitor needs to witness transformation. Normal flow resumes for reading and action.

## Law 5: Direct manipulation outranks spectacle

During slider, seed, replay, or other product interaction, the model responds immediately. The interface must never invent cinematic latency for a calculation that is already synchronous.

## Law 6: Every loud scene earns a quiet scene

The intensity curve alternates spectacle, reading, anticipation, acceleration, release, and calm.

## Law 7: One owner per state

At any progress state there is one dominant actor, at most one incoming actor, and optional residue/foreground. Old, current, and next scenes must not pile up simultaneously.

---

# 5. Visual system

## 5.1 Interface palette

Initial art-direction targets, to be tuned against static frames:

- `void`: near-black carbon, approximately `#090A0C`
- `graphite`: approximately `#17191D`
- `mineral`: warm mineral white, approximately `#F2F1ED`
- `ink`: near-black text on mineral surfaces
- `current`: saturated cobalt / electric blue, not cyan
- `baseline`: steel grey
- `verification`: restrained mineral green only where state meaning requires it
- `boundary/error`: restrained signal red / vermilion

Hard exclusions:

- purple AI gradients
- decorative neon glow
- glassmorphism as a generic premium signal
- orange as a default brand accent
- full-site rainbow data palette

Photography keeps its own natural color range. UI color remains narrow.

## 5.2 Typography

Do not redesign the project around a fashionable font swap. The current repository already contains Syne, Hanken Grotesk, Instrument Sans, and IBM Plex Mono.

Initial role test:

- display: Syne or Instrument Sans, selected after static-frame comparison
- body/UI: Hanken Grotesk or Instrument Sans
- mathematical / parameter metadata: IBM Plex Mono

Selection criteria:

- display width must support integrated image/diagram compositions
- no 800/900 weight dependence
- no italic-serif-in-sans gimmick
- no colored-keyword gimmick
- no giant wordmark as an automatic finale device
- hierarchy through line break, width, scale, overlap, spacing, placement, and controlled weight

## 5.3 Grid

Desktop reference canvas: `1440 × 900`.

Use a 12-column fluid composition grid with full-bleed media allowed outside the grid.

Suggested desktop gutters:

- 1440+: 48–64px
- 1280–1439: 40–48px
- 960–1279: 32–40px

Mobile primary canvases:

- `390 × 844`
- `430 × 930`
- QA secondary: `360 × 800`

Mobile side margin target: 18–24px depending scene.

---

# 6. Media doctrine

## 6.1 Final-media rule

No AI-generated final photography. No AI-generated final substitute illustration for photographic roles.

Licensed photography: Unsplash / Unsplash+.

Product-native diagrams, SVG, data plots, equations, interface states, and WebGL/SVG transformations may be authored from the actual Math Intellect product and are not treated as “generated photography.”

## 6.2 Existing media status

All currently installed marketing photographs are **REJECTED AS FINAL CAST**. They may remain temporarily in the repository until replacement assets are delivered, but implementation must not use them as visual defaults simply because they exist.

The old `PHOTO_LIBRARY` subject-driven naming also should not determine the new architecture. New media keys are role-driven, for example:

- `worldCollision`
- `gameForeground`
- `marketEnvironment`
- `agentCollective`
- `methodStructure`

## 6.3 Hero photography

`heroPhoto = none`

The first viewport belongs to the Origin State and trajectory field.

## 6.4 Current exact shortlist

### WORLD COLLISION — preferred shortlist

**Candidate W1: Georgi Kalaydzhiev, aerial crowd intersection, Unsplash+**  
https://unsplash.com/photos/aerial-view-of-people-crossing-a-busy-intersection-6bjy7iQL93Q

Role: first major real-world takeover after the hero.

Why it works:

- top-down people can plausibly align with mathematical points;
- multiple movement directions create real system behavior;
- enough visual density for tracking selected people;
- strong transformation opportunity from people → points → model state.

Required derivatives after download:

- desktop wide context
- desktop detail crop
- 4:5 / portrait mobile crop
- darkened transition plane

### GAME THEORY — preferred lock

**Candidate G1: Aaron Burden, hand moving a white bishop, Unsplash+**  
https://unsplash.com/photos/a-hand-moves-a-white-bishop-on-a-wooden-chessboard-DVfzTH9CZN8

Role: Game Theory foreground actor.

Required derivatives:

- wide contextual board image
- 4:5 mobile crop
- transparent-background hand + bishop cutout made from the licensed master
- optional bishop macro crop

The foreground cutout is a derivative of the real licensed photograph, not AI-generated media.

### MARKET DYNAMICS — preferred direction, final visual check required after download

**Candidate M1: Faruk Tokluoğlu, aerial busy highway intersection, Unsplash+**  
https://unsplash.com/photos/an-aerial-view-of-a-busy-highway-intersection-k_8-mABciDQ

Alternative:

**Candidate M2: Ahmet Kurt, aerial highway intersection with multiple lanes, Unsplash+**  
https://unsplash.com/photos/an-aerial-view-of-a-highway-intersection-with-multiple-lanes-gMQMUMEeA_E

Role: contextual flow environment behind mathematically truthful market-state overlays.

Selection test after download:

- must show multiple meaningful flow directions rather than one road;
- must support a panoramic crop without losing system topology;
- must contain a region where mathematical flow/state graphics can sit without covering the subject;
- must not read primarily as a logistics advert.

If neither passes the static-frame test, both are rejected and research continues. The site will not accept a weak Market image merely to complete an asset list.

### AGENT INTERACTION — preferred lock

**Candidate A1: Eduardo Ramos, school of fish in deep blue, Unsplash+**  
https://unsplash.com/photos/school-of-fish-swimming-in-deep-blue-ocean-water-4ymezFYxacA

Role: collective-behavior field that can transform to selected points and network links.

Required derivatives:

- full-width environmental crop
- portrait/mobile crop
- dark blue transition crop
- optional selected-cluster detail crop

### METHOD STRUCTURE — preferred shortlist

**Candidate H1: Georgi Kalaydzhiev, geometric architecture with light and shadows, Unsplash+**  
https://unsplash.com/photos/geometric-architecture-with-light-and-shadows-TI7XasmQ498

Alternative:

**Candidate H2: Evelyn Verdín, concrete architecture and geometric shadows, Unsplash+**  
https://unsplash.com/photos/concrete-architecture-casts-shadows-on-the-wall-VB0ryi0Pm_8

Role: one quiet structural break in Method. Architecture must transition into axis/grid/measurement logic, not appear as generic premium decoration.

## 6.5 Source record requirements

For every licensed master store:

- internal media key
- creator
- source URL
- photo ID
- license type
- intrinsic dimensions
- retrieval date
- focal intent
- desktop crop
- tablet crop
- mobile crop
- derivative list
- non-endorsement note where people appear

Do not show mandatory public credit UI unless the user explicitly chooses to. Keep provenance internally.

---

# 7. Home route operating mode

**Role:** cinematic product thesis.  
**Primary material:** mathematical visualization first, photography second.  
**Interaction:** scroll-driven transformation + one real product control + semantic navigation.  
**Copy target:** most scenes 0–25 words visible.  
**Intensity:** mystery → impact → calm → build → intervention → analysis → travel → calm → climax → resolution.

---

# 8. Home scene contract

The progress values below describe scene-local normalized progress. They are choreography targets, not fixed page pixels.

## Scene H0 — Entry / Seed

### Purpose

Introduce the world with product-native material and transition directly into the hero.

### Visible content

- black/carbon field
- one origin point
- minimal `seed 42` readout, optional and brief
- 24 trajectory cuts derived from the public path count

### Dominant actor

Origin State.

### Geometry

At start, point located approximately 54% viewport width / 56% height to avoid generic dead-center symmetry. Twenty-four path cuts grow from this coordinate and expand beyond all edges.

### Motion

No fake percentage loader.

Target handoff if critical assets are ready: roughly 0.7–1.2s.

Sequence:

- point visible
- first few paths appear
- 24 paths complete the field
- paths become slicing planes / mask divisions
- black surface separates
- hero field is revealed beneath the same geometry

### Interaction

None. Do not gate entry behind a click.

### Mobile

Do not animate 24 heavy planes. Show 6–8 visually dominant cuts while the complete 24-path hero resolves beneath them.

### Reduced motion

Skip slicing. Show origin for a brief frame then reveal completed hero state.

### No-GPU

Identical concept with SVG/DOM masks. GPU is not required.

### Acceptance frame

At 60% progress, the frame must already read as a distinctive Math Intellect composition, not a loader screen.

---

## Scene H1 — Origin Hero

### Purpose

State the value proposition while establishing the trajectory field as the site's identity carrier.

### Draft public copy

**Every outcome starts with a condition.**

Support: **Change one variable. Watch the possible paths respond. Compare what changed, then reproduce the same run.**

Primary CTA: **Enter the model**

### Dominant actor

Actual trajectory field and common origin.

### Geometry at 1440×900

- trajectory field owns approximately 65–75% perceived mass
- field bleeds off right and bottom edges
- headline occupies left/top negative-space corridor, not a separate text panel
- origin remains visible inside lower-middle zone
- CTA sits near headline, never in a detached button island

### Layering

1. void field
2. distant trajectory paths
3. main trajectory paths
4. typographic layer
5. origin marker / tiny parameter residue
6. navigation

### Progress map

- 0–0.25: hero stable, short read
- 0.25–0.58: foreground paths travel faster than distant paths
- 0.58–0.82: headline begins counter-move / partial occlusion
- 0.82–1: next photographic environment becomes faintly visible beneath selected path regions

### Motion values

Initial tuning targets:

- background/distant field relative travel: `-3vw to -6vw`
- foreground path relative travel: `+6vw to +10vw`
- typography counter movement: `-24px to -48px`
- origin translation: near zero; it is the stability anchor

No generic `fadeUp` reveal should own the hero.

### Mobile

- no fixed desktop hero pin
- trajectory field behind / around headline
- headline maximum 3 lines
- CTA visible within first viewport
- origin becomes start of the vertical protagonist spine

### Acceptance

If a still screenshot of the hero could plausibly be a generic AI or finance SaaS landing page after swapping the logo, reject it.

---

## Scene H2 — Reality / Model Collision

### Purpose

Introduce photography as the world outside the model, then show that Math Intellect imposes an inspectable structure on that world.

### Media

`worldCollision`, likely candidate W1.

### Draft public copy

**Reality moves. Models choose what to measure.**

### Geometry

- photograph begins as partial crop occupying 30–45vw
- expands to 80–100vw environmental takeover
- trajectory field remains as foreground residue
- type uses photographic negative space, never a boxed overlay

### Motion

- image frame expands from ~38vw to full environmental ownership
- inner crop counter-moves 3–6% inside overscan
- selected trajectory lines align visually with selected people / flows where composition allows
- image is gradually segmented by model geometry
- one segment survives and becomes the Conditions Chamber coordinate plane

### Mobile

Portrait crop occupies about 75–85svh, with vertical model spine crossing through it.

### Acceptance

The photograph must determine type placement and transition geometry. If it is merely a beautiful background behind text, reject.

---

## Scene H3 — Conditions Chamber

### Purpose

Make starting assumptions spatial and calm.

### Draft public copy

**Hold the conditions. Read the paths.**

### Dominant actor

Origin State with parameter system.

### Visible values

- `x₀ = 0`
- `μ = 0.05`
- `σ = 0.35`
- `24 paths`
- `50 steps`
- `seed 42`

### Geometry

Mineral surface. Origin sits slightly below optical center. Parameter labels are attached to a true relational geometry, not evenly distributed decorative labels.

Suggested arrangement:

- origin at 56% x / 56% y
- `μ` and `σ` as primary left/right condition pair
- seed near origin as deterministic identity
- paths and steps aligned with axis / temporal dimension

### Motion

Mechanical lock-in. No bounce/spring styling.

Each condition enters and settles. Final 20–30% is a reading hold.

### Mobile

Vertical measurement spine. One dominant value group at a time, never six tiny labels around a small diagram.

---

## Scene H4 — Branch

### Purpose

Show one common state becoming many possible outcomes.

### Draft public copy

**One origin. 24 paths.**

### Dominant actor

Actual computed path field.

### Motion

- one path establishes the unit
- remaining 23 appear in controlled stagger
- ensemble expands to full field
- endpoints gain subtle emphasis only after the ensemble is readable
- final interval is a hold, not another headline

### Product-truth rule

Use current computed data. Do not fake path geometry for composition. If an extreme path complicates the composition, adjust chart domain honestly rather than clip the data.

### Mobile

Show complete data with fewer simultaneous decorative path effects. The chart itself must remain readable.

---

## Scene H5 — Perturbation

### Purpose

Give the visitor agency early enough that the site proves it is software.

### Draft public copy

**Change one condition.**

### Interaction

Volatility slider controls actual scenario state.

### Geometry

The control is integrated into the coordinate field rather than isolated in a conventional sidebar card.

Desktop target:

- chart/field 70–78% width
- control embedded along lower or left edge of field
- current `σ` value physically close to the axis it affects
- fixed values remain accessible but secondary

### Motion

While the slider moves:

- no scroll-driven layout animation
- no long entrance replay
- current paths recompute immediately
- previous baseline remains as reference
- new endpoints update directly

### Accessibility

Native range input remains keyboard operable. Color is not the only comparison encoding.

---

## Scene H6 — Comparison Membrane

### Purpose

Turn baseline/current comparison into one strong viewport rather than two chart cards and a KPI strip.

### Draft public copy

**Same seed. Different volatility.**

### Geometry

One shared coordinate field.

A movable / scroll-driven membrane separates baseline and current view states.

- baseline side: muted solid/low-contrast path treatment
- current side: cobalt + distinct dash/weight pattern
- endpoint variance labels sit near endpoint cloud
- exact values remain available in semantic text below / beside the field

### Motion

Membrane passes across the viewport. Old and new states overlap briefly. Intersections become geometric seeds for the model-chamber transition.

### Reduced motion

Static split comparison with clear labels.

---

## Scene H7 — Four Chambers introduction

### Purpose

Establish that different questions need different mathematical structures.

### Draft public copy

**Four structures. Four kinds of question.**

No paragraph is necessary if the four subsequent chambers are clear.

### Desktop operating mode

Vertical input drives lateral / spatial travel through four authored chambers.

Do not implement as four equal panels on one translated flex track.

The next chamber must become visible before ownership transfers.

Handoff rhythm:

`READ → ANTICIPATE → TRAVEL → HOLD → OVERLAP → TAKEOVER → RESOLVE → READ`

---

## Scene H8 — Monte Carlo Chamber

### Dominant material

Pure mathematical field. No stock photograph.

### Draft public copy

**Sample the possible.**

### Composition

The original 24-path field expands conceptually to a denser possibility field. Clearly distinguish actual public run data from any illustrative higher-density extension.

Recommended approach:

- keep actual 24 paths as solid / primary layer
- optional additional faint field can be labeled illustrative if used at all
- endpoint density/distribution becomes secondary actor

### Transition out

Curves progressively quantize into orthogonal relationships that prepare the payoff matrix.

---

## Scene H9 — Game Theory Chamber

### Dominant material

Payoff matrix + real photographic foreground action.

### Media

`gameForeground`, candidate G1.

### Draft public copy

**Map the payoff.**

Support, if needed: **Every choice changes the field for someone else.**

### Geometry

- matrix owns background/technical plane
- board image resolves under matrix
- transparent hand+bishop cutout enters foreground and occludes part of matrix
- copy sits in negative space, not in a separate text column

### Motion

- matrix cells derive from the outgoing path/grid geometry
- board aligns beneath it
- foreground hand travels faster than board
- bishop movement / selection causes one matrix cell or node to take ownership
- hand exits; selected cell survives into next scene

### Mobile

Use complete hand/bishop crop. Foreground enters from lower/right. Matrix remains legible and focusable.

---

## Scene H10 — Market Dynamics Chamber

### Dominant material

Mathematical flow + one contextual environmental photograph.

### Media

`marketEnvironment`, selected from M1/M2 after source download and static-frame crop test.

### Draft public copy

**Systems respond to systems.**

### Composition

No Bloomberg screens, traders-at-laptops, generic candlestick photography, or shipping containers.

Market environment must read as interacting flow. Mathematical state remains clearly separate from the photograph.

### Motion

Selected Game Theory grid cell stretches into a temporal/flow axis. Rows become directional streams. Environmental image expands behind it. Individual nodes eventually separate from the flow and become agents.

### Mobile

Portrait image with one model overlay, not multiple floating panels.

---

## Scene H11 — Agent Interaction Chamber

### Dominant material

Collective photograph transforming into mathematical network.

### Media

`agentCollective`, candidate A1.

### Draft public copy

**Local rules. Collective behaviour.**

### Motion

- image resolves as collective fish formation
- selected individuals receive point markers
- image contrast/density reduces
- points persist after photography disappears
- local links emerge
- selected agent becomes dominant and becomes the Run Record seed for the next scene

### Product-truth rule

The photograph is an analogy for collective behavior, not model output. Never imply the product simulated the photographed animals.

---

## Scene H12 — Reproduce

### Purpose

Turn reproducibility into a visible event.

### Draft public copy

**Run it again.**

Support: **Same inputs. Same seeded run.**

### Motion

- current result appears as run A
- replay produces run B
- states are shown slightly offset for a brief readable interval
- exact equality resolves into perfect overlay

Avoid language such as “scientifically verified” unless independently supported.

Preferred completion word: **Reproduced**.

---

## Scene H13 — Analyst Record

### Purpose

Reveal that Math Intellect is a larger analytical product without turning the marketing page into a dashboard preview carousel.

### Dominant actor

The reproduced run compresses into a Run Record.

### Visible concepts

May reference real protected-product concepts such as:

- simulation history
- status
- Analyst Level
- XP / progression
- run streak
- Verification Units

Do not fabricate user-specific values. Use clearly illustrative / system-level values or omit numerical examples until product data is available.

### Draft public copy

**Build a history of evidence.**

### Motion

One record becomes a small archive field. This is a quiet scene.

---

## Scene H14 — Method Threshold

### Purpose

Transform the Run Record into its calculation and invite deeper inspection.

### Draft public copy

**Inspect the calculation.**

CTA: **Read the method**

### Motion

Record grows to viewport. Metadata separates into equation terms. One trajectory contracts into a mathematical term / equation stroke.

No photograph required here on Home.

---

## Scene H15 — Resolution / Finale

### Purpose

Resolve the protagonist before utility/footer content.

### Draft public copy

**Start with one condition.**

Primary CTA: **Build a model**

Secondary text link: **Explore the model families**

### Motion

Residual representations collapse in reverse semantic order:

`record → network → nodes → paths → one path → origin`

The origin ends at the same spatial identity used at entry.

The Workbench CTA grows from the final origin state.

Only after resolution does the ordinary utility footer enter.

No giant MATH INTELLECT wordmark is required for emotional closure.

---

# 9. Desktop static-frame acceptance board

Each of these must be designed and reviewed as a still before implementation is considered visually complete.

| Frame | Required still | Dominant actor | Reject if |
|---|---|---|---|
| F00 | loader 60% | trajectory cuts | looks like generic loader |
| F01 | hero | origin + path field | could sell another SaaS unchanged |
| F02 | reality collision | full photograph + path structure | image is decorative background |
| F03 | conditions | spatial parameter system | labels are a UI demo scattered around |
| F04 | branch hold | actual 24-path field | too much copy competes with paths |
| F05 | perturbation | interactive state | looks like standard sidebar dashboard |
| F06 | comparison | one shared field | becomes two generic chart cards |
| F07 | Monte Carlo | mathematical field | stock photo added without need |
| F08 | Game Theory | matrix + cutout action | photo and diagram sit politely side-by-side |
| F09 | Market | flow + environment | reads primarily as logistics stock |
| F10 | Agent | photograph → network midpoint | network is decorative, subject relation weak |
| F11 | reproduce | two runs aligning | equality is explained only by prose |
| F12 | analyst record | record/archive | looks like a gamified dashboard advert |
| F13 | method threshold | record/equation | unrelated page teaser |
| F14 | finale | origin + CTA | footer is doing the emotional work |

Minimum internal target before animation credit:

- flagship frames F01/F04/F08/F10/F14: `9/10`
- remaining cinematic frames: `8.5/10`

Technical correctness does not increase these visual scores.

---

# 10. Mobile storyboard

Mobile is a separate edit.

## M0 — Entry

Origin plus reduced set of dominant cuts. Complete hero appears immediately after.

## M1 — Hero

Trajectory field behind/around headline. One dominant visual idea. CTA in first viewport. No giant pin.

## M2 — Reality

Portrait crop owns 75–85svh. Model spine crosses image vertically.

## M3 — Conditions

Vertical measurement spine. Conditions appear in short groups rather than all simultaneously.

## M4 — Branch

Full-width plot in normal document flow. Paths remain complete and readable.

## M5 — Intervention

Large touch-friendly volatility slider. Result below/behind it. No hover dependence.

## M6 — Compare

Vertical before/current membrane or stacked shared-axis comparison. No 45vw side-by-side mini charts.

## M7–M10 — Model families

Normal vertical sequence:

- Monte Carlo: pure path field
- Game Theory: matrix with hand+bishop foreground
- Market: one portrait environment + one truthful model overlay
- Agent: fish collective + point/network transformation

No forced desktop horizontal track.

## M11 — Reproduce

Replay and equality state in normal flow.

## M12 — Analyst

Two or three records maximum, not a dense archive wall.

## M13 — Method threshold

Equation / record transition simplified to direct compositional handoff.

## M14 — Finale

Origin returns to center. CTA immediately below. Footer follows.

### Mobile hard requirements

- safe-area aware
- no hover-only interaction
- no fixed elements hiding content
- no long 300–600svh pin
- no desktop SVG simply shrunk to fit
- no complete removal of imagery as “optimization”
- native touch scroll by default

---

# 11. Models route

## Operating mode

**Exploratory atlas**, not cinematic replay of Home.

Working internal title: **Model Atlas**.

## Page thesis

The same Origin State can be represented by different mathematical structures depending on the question.

## Composition

One selected model dominates the viewport. Remaining model families are visible as partial adjacent states / previews.

Do not create a 4-card or 4-panel repeated shell.

Suggested selected-state silhouettes:

- Monte Carlo: full field / panoramic possibility map
- Game Theory: matrix plane + foreground action
- Market: flow/environment viewport
- Agent: swarm/network viewport

## Navigation

Persistent semantic model index. Keyboard and direct hash routes must work independently of motion.

Possible direct links remain anchored to genuine destinations. Do not invent detail routes solely for transition convenience.

## Interaction

Desktop may support drag plus wheel/scroll selection if semantic links remain available. Mobile uses vertical selected sections/tabs, not drag dependence.

---

# 12. Workbench route

## Operating mode

**Precision instrument.**

This route intentionally reduces cinematic spectacle.

## Preserve

- current scenario provider/state
- volatility control
- drift control
- seed input
- 24 paths
- 50 steps
- baseline comparison
- replay
- reset
- JSON download
- limitations
- keyboard labels / native controls

## Redesign goals

The current Workbench works functionally but still uses a conventional controls-left / result-right panel grammar. The redesign should move toward one integrated instrument surface.

### Desktop concept

- plot occupies 65–75% of primary viewport mass
- parameter controls sit along the plot's geometry rather than inside a generic card stack where practical
- baseline/current legend integrated near data
- exact metrics appear near relevant field regions or in one restrained ledger
- replay and save actions are clear, not decorative
- Method / Models links remain conventional and visible

### Product interaction law

Never animate a control response more slowly than the calculation itself. Interaction state is direct.

### Photography

None required.

---

# 13. Method route

## Operating mode

**Technical publication.**

Reading is a valid primary task here.

## Visual spine

One mathematical line / equation relationship persists down the route.

Suggested progression:

`state → additive step → random sample → path ensemble → endpoint statistics → baseline comparison → seed replay → limitations`

## Interaction

- hover/focus equation term highlights relevant explanation
- selected term may connect to the public Workbench example
- replay explanation can show A/B path equality
- anchors available for direct navigation

## Photography

Maximum one major contextual structural image using `methodStructure`.

The image must transition into axis/grid/measurement geometry. If it does not earn that transformation, remove it.

## Motion

Quiet. No long pins. No horizontal gallery.

---

# 14. Public navigation

## Default navigation

Conventional semantic links remain available:

- Home
- Models
- Workbench
- Method
- Sign in
- Create account

## Full menu visual concept

Current Origin State persists in the menu world.

Focus/hover route preview transforms the central actor:

- Models → origin branches into model structures
- Workbench → origin becomes active plot/control state
- Method → origin becomes equation
- Sign in / account → origin reduces to a quiet point

Do not require the preview to understand the link.

## Accessibility

- focus containment where dialog semantics are used
- Escape closes
- focus returns to trigger
- body scroll restored
- visible focus states
- reduced motion keeps route preview static

---

# 15. Route transition contract

Route transitions either preserve meaningful continuity or remain quiet. They do not exist simply to cover navigation.

## Home → Workbench

Actor: current trajectory field / input state.

- capture actual source rect before navigation
- navigate with current scenario state preserved through existing marketing provider or explicit route state
- measure real destination plot
- carry true visual geometry, not a guessed rectangle
- transfer ownership into destination

Target travel: approximately 450–750ms after destination readiness.

Fallback: immediate navigation + 200–300ms opacity/layout settle.

## Home → Models

Actor: current model representation.

Selected geometry decomposes into four family structures while destination atlas mounts.

Do not block navigation if effect cannot run.

## Home → Method

Actor: selected path / Run Record.

Path becomes equation stroke / record becomes publication surface.

Target: 350–600ms.

## Models → Workbench

Only carry a model state if a truthful Workbench destination exists. Do not fake unsupported working models.

## Generic public navigation

Use the 24-path curtain/mask family as a brief world-consistent cover/reveal only when no meaningful shared actor exists.

Recommended total transition budget: 0.35–0.85s.

## Cancellation

Rapid second navigation cancels the previous transition cleanly. No body lock or overlay may survive.

## History

Back/Forward restores route and scroll behavior correctly. Modified/new-tab clicks remain native.

---

# 16. Motion ownership and technology

The repository already includes React 19, GSAP, Lenis, Anime.js, Three.js, Embla, KaTeX, and current marketing tests. Do not install a new animation stack without a clear missing capability.

## Ownership table

| Responsibility | Owner |
|---|---|
| route/component state | React |
| public scenario calculation | existing deterministic model helpers |
| desktop smooth-scroll substrate | Lenis, only if it improves continuity |
| touch / reduced-motion scrolling | native browser scroll |
| macro scroll timelines / pinning | GSAP ScrollTrigger |
| shared geometry / route carry | GSAP Flip or explicit measured transforms |
| SVG path drawing / morph / masks | GSAP first; Anime.js only if a local sequence genuinely benefits |
| equations | KaTeX / semantic DOM |
| optional GPU enhancement | Three.js only when a scene cannot be achieved convincingly with DOM/SVG |
| carousel/gallery convenience | Embla only on routes where semantic carousel behavior is appropriate; not the Home flagship chamber system by default |

## One-owner rule

Do not let multiple libraries write the same transform property on the same element.

## WebGL decision

Baseline concept does **not** require WebGL.

Three.js may be used later for one justified transformation, such as a persistent particle/field treatment, only if:

- static frame is already strong;
- DOM/SVG fallback preserves the concept;
- performance remains acceptable;
- reduced motion does not depend on the canvas;
- the canvas does not own navigation or essential information.

---

# 17. Scroll choreography

Master rhythm:

`MOVE → HOLD → COUNTER-MOVE → OVERLAP → HANDOFF → RESOLVE → READ`

## Fast scroll

At high wheel/trackpad velocity:

- skip nonessential microstates
- settle to valid state boundaries
- do not leave opacity ghosts
- do not wait seconds for smooth-scroll catch-up
- do not run delayed text reveals after the actor has left

## Reverse scroll

The world reconstructs semantically:

- network → agents
- agents → market flow
- flow → matrix
- matrix → paths
- comparison → baseline field
- path field → conditions

No nonsensical reverse text order.

---

# 18. Reduced motion

`prefers-reduced-motion` is a parallel art direction.

Requirements:

- native scroll
- no long pins
- no pointer lag
- no prolonged parallax
- no viewport-spanning camera travel
- no hidden opacity-zero content waiting on timelines
- preserve all copy, images, controls, and model relationships
- model chambers become authored static/short-transition sections
- shared route carry becomes simple direct layout/opacity continuity

Target visual quality: at least 80–90% of full-motion mode.

---

# 19. No-GPU fallback

The core site must remain premium without GPU acceleration.

Required fallback:

- SVG trajectory field
- CSS/DOM image masks
- static or short-transform model chamber transitions
- semantic route links
- all Workbench controls
- complete Method publication
- authored image crops

If an optional WebGL layer fails to initialize, it must be removed without blanking the page or leaving invisible essential controls.

---

# 20. Accessibility

Every unusual interaction receives an alternate operation.

- hover preview → focus preview
- drag → buttons/index/keyboard
- scroll pin → natural reduced-motion flow
- visual comparison membrane → explicit labels and semantic metric output
- image cutout → alt text on source contextual image, cutout decorative if duplicate
- route carry → normal navigation remains valid

Do not trap focus inside visual scenes. Inputs keep native semantics.

---

# 21. Performance art direction

Performance is part of perceived premium quality.

## Critical-path principles

- hero contains no photo, reducing initial media dependency
- do not preload every model photograph
- preload/prefetch only the next likely environmental image
- use responsive AVIF/WebP where practical
- preserve high-resolution source masters outside the served critical path
- never upscale derivatives beyond source dimensions
- lazy-decode below-the-fold media
- cancel offscreen animation work
- avoid React state updates on every scroll frame
- separate layout measurement from per-frame transforms

## Image transfer targets

Targets, not guarantees until masters are downloaded:

- first photographic takeover desktop: aim ~250–450KB
- mobile derivative: aim ~120–250KB
- individual below-fold media: normally under ~500KB transfer where visual quality allows

Quality wins over arbitrary compression artifacts. Do not turn premium photography into mush to hit a vanity number.

---

# 22. Copy budget

## Hero

- headline: 5–9 words
- support: ≤24 words
- one primary CTA
- optional one text action

## Cinematic scene

- headline: 2–7 words
- support: 0–20 words
- one small factual note only when product truth requires it

## Workbench

More labels allowed because manipulation is the task.

## Method

Long-form reading allowed.

## Prohibitions in public copy

- no internal scene labels such as ACT 04 / FRAME 09
- no generic AI cadence
- no “revolutionary”, “next-gen”, “seamless” without proof
- no fabricated metrics
- no decorative pseudo-scientific labels
- no em dash character in final marketing copy

---

# 23. Final public-copy working set

These are design-copy candidates to compose around. Final editorial polish can change words without changing scene purpose.

| Scene | Primary line |
|---|---|
| Hero | Every outcome starts with a condition. |
| Reality | Reality moves. Models choose what to measure. |
| Conditions | Hold the conditions. Read the paths. |
| Branch | One origin. 24 paths. |
| Perturb | Change one condition. |
| Compare | Same seed. Different volatility. |
| Models intro | Four structures. Four kinds of question. |
| Monte Carlo | Sample the possible. |
| Game Theory | Map the payoff. |
| Market Dynamics | Systems respond to systems. |
| Agent Interaction | Local rules. Collective behaviour. |
| Reproduce | Run it again. |
| Analyst | Build a history of evidence. |
| Method threshold | Inspect the calculation. |
| Finale | Start with one condition. |

---

# 24. Repository implications, not implementation authorization

When implementation planning begins later, expect the existing visual layer to be replaced substantially rather than patched.

Likely affected public marketing areas include:

- `frontend/src/marketing/pages/HomePage.tsx`
- `frontend/src/marketing/pages/ModelsPage.tsx`
- `frontend/src/marketing/pages/WorkbenchPage.tsx`
- `frontend/src/marketing/pages/MethodPage.tsx`
- `frontend/src/marketing/MarketingShell.tsx`
- existing `frontend/src/marketing/film/*` scene components
- current `photoLibrary.ts` / `filmMedia.ts`
- `film.css` / `refinement.css`
- route transition layer in `App.tsx` or a replacement public-transition architecture

Protected application pages are outside scope.

This section describes likely architecture impact only. It is not an instruction to preserve current scene components.

---

# 25. Supersession / deletion map for implementation phase

Once replacement assets exist and implementation is approved:

## Remove from mounted public experience

- liquid-impact hero and its repeated finale use
- water/ripple story material
- branching-river Monte Carlo metaphor
- laptop-conversation Game Theory image
- shipping-port Market image
- current flock Agent image
- current current-image credit UI
- equal model-panel structure
- any CSS that exists only to preserve those compositions

## Keep only when functionally useful

- deterministic scenario hook
- TrajectoryPlot calculation/data semantics, though visual rendering may be redesigned
- semantic model IDs/anchors
- Workbench inputs/replay/export behavior
- existing accessible menu mechanics if they support the new visual shell
- route/history logic that remains correct
- tests that verify product behavior rather than old visual markup

---

# 26. QA matrix

No Playwright visual acceptance.

## Desktop

- 1440×900
- 1366×768

## Tablet

- representative ~820×1180

## Mobile

- 430×930
- 390×844
- 360×800

## Inspect manually

- first load
- hero still
- 25/50/75% progress states
- every model chamber midpoint
- slider interaction
- unchanged baseline state
- changed volatility state
- replay state
- fast wheel
- immediate reverse
- scrollbar drag / PageDown / End where relevant
- route transitions
- Back/Forward
- menu focus
- keyboard controls
- reduced motion
- no-GPU fallback where possible
- crop quality
- footer/finale

---

# 27. Hard-fail conditions

Reject implementation if any of these occur:

- old liquid hero survives because it is already wired
- existing photographs remain simply because replacements are not ready
- first viewport becomes a generic split hero
- Home becomes a sequence of cards
- model chambers become equal repeated panels
- photography sits beside copy as decoration
- mobile becomes a text stack after desktop effects are disabled
- route transition produces blank waiting states
- reduced motion leaves overlaps or giant spacers
- model output is visually conflated with photography
- scroll animation is imperceptible at normal trackpad speed
- animation works only at slow demo scrolling
- WebGL failure destroys core content
- Workbench interaction is slowed by spectacle
- source comments claim cinematic quality without visible composition
- page can be recreated almost unchanged by a generic “premium AI SaaS” prompt

---

# 28. Design-review gate before implementation planning

This written spec is the next design artifact. It requires user review before any implementation plan is authored.

After approval, the next step is **implementation planning**, not ad-hoc coding. The implementation plan must decompose:

1. media acquisition / provenance / derivative pipeline;
2. new public visual foundation and tokens;
3. Origin / trajectory visual system;
4. Home scene architecture;
5. Models atlas;
6. Workbench instrument redesign;
7. Method publication;
8. public navigation and route continuity;
9. mobile/reduced-motion/fallback states;
10. tests and manual/live visual QA.

Until the design spec is approved, no production frontend rewrite should begin.

---

# 29. Research basis

Internal authority consulted:

- Valtum Studio UI/UX + Creative Frontend Brain, current master operating system
- Animation motion catalogue and choreography rules
- Valtum Studio Reference Corpus Report
- prior Math Intellect Film 01–08 documents, especially Film 05 failure notes and Film 07–08 implementation records
- current repository public marketing source
- current deterministic scenario implementation

External references rechecked / expanded for this redesign:

- Lando Norris: https://landonorris.com/
- White Desert: https://white-desert.com/
- LIKOVA and creator case study: https://likova.space/ and https://videinfra.com/work/likova
- Oryzo: https://oryzo.ai/
- Siena Film Foundation: https://www.siena.film/
- Wembi case study: https://www.e-t.studio/works/wembi
- AIR case study: https://videinfra.com/work/air/ajax
- Gucci La Famiglia interactive case: https://monogrid.com/en/project/la-famiglia-mystery-unfolds/
- current/recent Awwwards references explored during research, including Neutomni, MilleDollars, The Renaissance Edition, Immersive Garden, KINORIA, and Why Zero

Transfer principle: copy reasoning, never surface styling.

---

# 30. Director's reset

The old site attempted to become premium by improving photography, transitions, typography, horizontal scroll, and correctness inside an already familiar award-site grammar.

This redesign starts one level earlier.

**The product supplies the world.**  
**The Origin State supplies continuity.**  
**Mathematics supplies the identity.**  
**Photography supplies reality and human scale.**  
**The viewport supplies composition.**  
**Motion supplies physics.**  
**Interaction proves the software.**  
**The finale resolves the same state that opened the experience.**

That is the design standard to implement after approval.
