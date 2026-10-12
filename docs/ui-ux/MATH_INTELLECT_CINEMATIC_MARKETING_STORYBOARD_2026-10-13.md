# Math Intellect — The Model in Motion
## Product-truth audit, creative direction, and cinematic marketing storyboard
**Date:** 13 October 2026  
**Status:** Pre-implementation design authority; no marketing-code changes in this document  
**Repository:** analyticsmath/MathIntellect  
**Working branch:** main only  
**Scope:** /, /models, /workbench, /method, public navigation and footer. Protected app and backend are preserved.

---

## 1. Evidence and scope

### Verified source truth
- Math Intellect is a mathematical simulation and decision workbench, not a mathematics course, generic AI chatbot, or stock-market prediction service.
- The engine dispatcher supports Monte Carlo, Game Theory, Market, Conflict, and Custom model execution. Custom currently maps through configured Monte Carlo execution.
- Protected routes include dashboard, new simulation, analytics by simulation ID, feed, and profile.
- Deterministic execution and replay are represented in backend source, including seed, parameter snapshot, and output hashes; replay/snapshot access requires authentication. Do not promise universal replay on legacy simulations.
- Public Workbench is a deliberately simplified, browser-side, seeded Monte Carlo demonstration in deterministicModels.ts, not the full authenticated simulation engine.
- Current public routes are Home, Models, Workbench and Method. No new public route is needed.

### Verified design baseline
- Current Home is divided into nine React scenes named RealityStructure, Uncertainty, SystemsReel, Strategy, MarketRegime, ConflictInteraction, PerturbCompare, Replay, and Return, mostly branded as sequential 'Movement' chapters.
- Public CSS uses Instrument Sans, IBM Plex Mono, near-white/pale-green surfaces and ink; pages repeatedly use narrow headings, technical labels, grid frames, charts and factual paragraphs.
- Existing media catalogue has numerous aerial river, rail, roadway, water and port photographs, with AVIF/WebP responsive derivatives and focal metadata.
- Desktop Lenis integration exists, along with GSAP ScrollTrigger; explicit cross-route cinematic transitions are not yet present in the top-level React Router shell.
- Existing footer is chiefly an informational/nav block rather than an authored concluding composition.
- The public marketing environment must remain accessible and functional when motion is disabled.

### Evidence hierarchy
VERIFIED = checked in repository; DESIGN DECISION = proposed creative direction; NEEDS LIVE QA = cannot be established solely from source. Do not turn visual inferences or purported marketing performance into facts.

## 2. Why the current experience is not acceptable

This is a failure of editorial ownership, not of dependency count.
1. Metaphors do not reliably lead to the product. A river delta and freight yard can signify branching, but visitors must decode those metaphors before understanding a mathematical workbench.
2. Ten explicit 'Movement' labels read like production notes, not persuasive consumer storytelling.
3. A sequence of isolated pinned stages makes each viewport an illustration of a concept instead of a transformation of one continuing object.
4. Paragraphs, chart frames, micro-labels and model matrices create report-like density; one chart is evidence, nine charts are not cinema.
5. Photographs do not always own the composition. Many are contained behind explanatory frames, captions and borders.
6. Models and Method contain valuable product substance, but their repeating information hierarchy needs distinctive route-level compositions.
7. The footer does not deliver the requested large, authored MATH INTELLECT closing identity.
8. React Router currently scrolls/reset positions on navigation without a meaningful media/typographic route handoff.
9. Static source review cannot establish a score or validate actual viewport/crop/performance; production-browser QA remains mandatory.

## 3. North star: THE MODEL IN MOTION

**Creative thesis:** Change one condition. See what changes with it.

**Product-native protagonist:** ONE REPRODUCIBLE MATHEMATICAL SCENARIO. It starts as a human question, becomes a visible model with explicit inputs, branches into simulated possibilities, is perturbed, compared, and replayed. The identity is semantic, not a mascot, particle orb, or arbitrary 3D prop.

**Narrative premise:** The world rarely gives one answer. Math Intellect lets you define the question, examine the possible outcomes, and understand what caused them to differ.

**Promise we can substantiate:** Explore uncertainty and strategic systems through mathematical models, inspect outputs, change assumptions and compare runs. Distinguish public examples from authenticated engine features.

**Narrative verbs:** OBSERVE → DEFINE → BRANCH → CHANGE → COMPARE → CHOOSE → REPLAY → BEGIN.

### Distinct visual world
'Precision meets consequence': photographic evidence of authentic physical and human decision systems, interrupted by only the *meaningful* mathematical marks. Think unusually precise editorial photography, image scale and spacious negative space—not traffic panoramas as filler, holographic AI effects, fake market metrics, concept diagrams beside lengthy explanations, or copied Personality Assessor treatments.

The protagonist is an actual model/state trajectory. The supporting medium is *licensed original photography* from real-world contexts. Use CSS/SVG/canvas only for truth-bearing traces, controls, equation setting and real numerical outcomes. Do not create replacement 3D models or fabricated product screenshots.

## 4. Art direction

### Composition
- Design each desktop viewport as a poster: one dominant actor, a controlled reading direction, 60–80% media presence in the major photographic scenes, and very few lines of copy.
- No consecutive marketing viewports whose main visual weight is text. A methodology page is intentionally the reading-first exception.
- Avoid repeated centered cards, KPI strips, rounded SaaS decks, border grids, random marquees, arrows used as decoration, and all 'Movement 04' eyebrow text.
- Scenes need uneven durations: kinetic reveal, a readable pause, counter-motion, overlap, handoff and quiet resolution.

### Provisional palette — to validate against procured photography
- Precision black: #121718.
- Light neutral: #EEF0EE (cool/mineral, not ivory/cream/bone).
- Pure highlight: #FAFBFA.
- Mineral grey: #64706C.
- Source green: #26765C, used only for validated selections and the active scenario.
- Change red: #AC443C, used only for changed parameters / differences / error semantics.
No gradients, glass, glow, purple/indigo AI color, or orange accent. Photography supplies the environmental palette; UI chroma remains disciplined. Confirm AA contrast for each text/background pairing.

### Typography exploration
- Display/body candidates: Hanken Grotesk or a comparably distinct commercially licensed modern grotesk, checked visually in hero, long-form text and large footer. Do not carry Instrument Sans over merely because it is installed.
- Mathematical type: existing reliable KaTeX fonts.
- Technical data: IBM Plex Mono where numbers/units benefit from monospacing; not on every label.
- Large typography earns its place by composition, not constant 100px headlines. Variable weight should stay typically 400–650.

## 5. Photography procurement and acceptance

Every photograph must do a precise job. Proposed subject families:
1. HERO / OBSERVATION: a genuine, thoughtfully lit human or physical decision situation where the subject is visible and the image itself creates visual suspense. No anonymous abstract infrastructure solely to imply complexity.
2. ASSUMPTION: real calibration, physical experiment, instrument setting, marks or hands making a controlled change. Tight cinematic macro, not AI-themed stock.
3. UNCERTAINTY: a physical system showing repeated trajectories or variation, photographed honestly, used only when its relationship to branching outcomes is immediately legible.
4. STRATEGY / INTERACTION: credible human negotiation, strategic choices, or genuine multi-agent dynamics; no chess cliché unless the game-theory context is explicit.
5. CHANGE / EVIDENCE: matched angle or visual repeat; repeat an earlier photograph with a different crop rather than introducing unrelated imagery.
6. FINALE: reprise the main visual in a transformed or wider context.

Procure through authorized Unsplash Plus or other properly licensed photographic sources; there is not yet a verified connected Unsplash Plus session in this environment. Do not imply photographs are images of actual Math Intellect customers. Preserve creator, source, asset ID, license evidence, dimensions, retrieval date, crop intent and any restrictions in a media manifest. Download originals, then generate AVIF/WebP sources at appropriate intrinsic sizes with responsive focal points. Do not point production JSX directly at unverified external hotlinks. Every image must pass a relevance test without reading the alt text.

### Lessons from the user's Design Ideas folder
- Swiss editorial collage: transfer the rhythm of carefully positioned photographic interruptions inside exceptional typography; do not reproduce the precise composition.
- Spinner reference: transfer physical stacking and tangible angularity only for a meaningful model/gallery selection, not gratuitous rotating decoration.
- Landscape wordmark footer: transfer the immersive gigantic-wordmark finale but make Math Intellect's own photographic environment and brand title the content.
- Scrapbook carousel: transfer selected-item depth, foreground/background hierarchy and neighboring material for an intentional model atlas; avoid fake 3D cards.

## 6. The Home storyboard — eight acts

### ACT 01 / The unresolved world
**Still frame:** decisive, art-directed hero photograph becomes the entire first impression. Title is spatially positioned for legibility, not in a rectangular text panel. A short living model marker offers continuity without dominating the photo.
**Copy:** 'The world does not give one answer.'  
**Support:** 'Math Intellect makes uncertainty something you can investigate.'  
**Action:** 'Explore the workbench' → /workbench; secondary 'Explore the models' → /models.
**Motion:** photograph opens at full resolution with restrained inner-image drift; typographic masks arrive as part of the picture composition, no prolonged loader.
**Mobile:** dedicated portrait crop, short headline, CTA visible without forced scroll.

### ACT 02 / Isolate the assumption
**Still frame:** close-up photo of a real instrument or deliberately altered physical condition; a clean model input enters the composition. No large chart yet.
**Copy:** 'Every outcome starts with an assumption.'
**Real proof:** seeded public Monte Carlo model; show the actual input that the live browser demo will use. Data comes from the existing deterministic helper, not hand-written synthetic numbers.
**Motion:** a photographed region narrows into a precise experimental field; model mark persists through the handoff.

### ACT 03 / Many possible paths
**Still frame:** branch trajectories own the scene overlaid on calibrated photographic material. The visualization is made from real seeded sample paths, not random decorative filaments.
**Copy:** 'One question. More than one possible future.'
**Motion:** branch emergence, hold for inspection, active path highlighting; movement directly scrubs with scroll. Avoid long graph labels and fake real-time counters.

### ACT 04 / Change the condition
**Still frame:** bold before/after spatial opposition with an actual input control and persistent scene identity. The photograph's crop/field changes to indicate perturbation.
**Copy:** 'Change one thing. Watch what follows.'
**Action:** adjust volatility; keep every other input and the seed fixed. State changes must update numerical results from the deterministic helper.
**Motion:** a clear source-to-comparison transition, not a second disconnected line chart.

### ACT 05 / See the difference
**Still frame:** single high-contrast result comparison, exceptionally legible to an analyst and understandable to a first-time visitor.
**Copy:** 'Know what moved. And why.'
**Real proof:** mean/variance and one intuitive outcome metric labelled as a public demonstration. Numbers are functions of current inputs; no invented advantages or testimonials.
**Motion:** matched before/after evidence splits or converges; reverse scrolling reconstructs the prior state.

### ACT 06 / Different systems, different models
**Still frame:** curated photographic model atlas, one dominant image at a time, distinctive crops for Monte Carlo, Game Theory, Market, Conflict, Custom. No five-equal-card grid.
**Copy:** 'Different questions need different mathematics.'
**Interaction:** hover AND keyboard focus reveal previews; click opens /models with model anchor. Use a carousel/kinetic rail only if tab/keyboard and mobile behavior remain obvious.
**Motion:** selected image grows into the next subject; meaningful detail survives; avoid meaningless infinite spinners.

### ACT 07 / Run it again
**Still frame:** original scenario returns as a clear source with replayed result verification. This is a quiet, trust-building scene.
**Copy:** 'A result you can return to.'
**Real proof:** browser demonstration recomputes exactly from the same explicit seed and inputs; authenticated backend replay and snapshot fidelity are explained accurately as separate capabilities.
**Motion:** return path recovers earlier marks; no fake output-hash overlay unless calculated.

### ACT 08 / The opening to action
**Still frame:** reprise hero photo in a new crop with restrained product action and a giant authored MATH INTELLECT identity flowing into the substantial footer.
**Copy:** 'Make the unknown something you can work with.'
**Action:** 'Start modeling' → /signup; 'Try the workbench' → /workbench.
**Motion:** scene resolves before the footer becomes utility. Large identity is fully recomposed for mobile.

## 7. Secondary public route contracts

### /models — The Field Guide
Each actual engine owns a distinctly composed photographic/mathematical chapter rather than being one repeating feature-card object. Intro chooses the model by the *question* the user wants to ask. Selection image and title become the destination via route transition. Keep verified parameters, outputs, limits, method and links. Monte Carlo and the four other types must not falsely imply equivalent implementation or capabilities. Equation blocks are subordinate to questions and outcomes. Mobile uses a native vertical selection stack with full-width images and short explanations.

### /workbench — The Live Proof
This route is a real working instrument, not a theatrical fake dashboard. The public deterministic Monte Carlo demonstration must continue working through explicit controls, a reproducible seed, generated paths, user-driven comparison and result labels. Opening uses one short photographic image-to-instrument handoff. Give the control panel, output, focus and error states proper usability precedence over drama. State plainly that the public demonstration is simplified and the authenticated app offers the broader workbench.

### /method — How We Know
Editorial reading as a deliberate quiet contrast to the Home film. Use chapter navigation with a meaningful photographic or mathematical anchor, progressive diagrams only where useful and exact factual definitions. Preserve mathematical expressions, model limits, determinism and AI distinction. No made-up scientific credentials, accuracy guarantees, or AI certainty claims. Short route transition into a sober publication mode.

## 8. Route-transition design (mandatory)

- Intercept only public-to-public navigation to protect the existing authenticated flows.
- Share the *current scenario / photographed model evidence* as a transition actor when origin/destination pairs legitimately share content.
- Lifecycle: capture real source bounds before navigation → preserve or clone actor → mount destination → measure real destination bounds → animate geometry → hand over ownership → clean up.
- For non-shared transitions: short, deliberate graphic/media wipe or native View Transition API with semantic fallback; never flash blank white or hold the user hostage to loader theater.
- Preserve focus placement, scroll restoration on browser Back, anchor navigation, keyboard navigation and reduced-motion instant transitions.
- Avoid animating page geometry with CSS and GSAP simultaneously.

## 9. Motion physics and engineering

- Lenis desktop/fine pointer only, feeding the single GSAP ticker; ScrollTrigger synchronizes on Lenis scroll. Native mobile and reduced-motion scroll.
- One scene owns each actor/property at a time. Implement clean ScrollTrigger/context lifecycles and route teardown; stop/cleanup old effects upon navigation.
- Preferred grammar: MOVE → HOLD → COUNTER-MOVE → OVERLAP → HANDOFF → RESOLVE → READ.
- Use pinned sequences for the core model transformation, not one pin per paragraph. Images should visibly change crop/scale/ownership; merely installing GSAP is not creative direction.
- Hover content must work on focus; cursor modes only if they reveal meaningful hidden evidence. Do not conceal interaction behind mouse-only affordances.
- Never use Playwright for screenshot/visual acceptance. Build, typecheck, lint, integration/unit tests, source review and browser-native live QA are allowed.

## 10. Large footer as final composition

- Authored final photographic/environmental scene extends into the footer; enormous 'MATH INTELLECT' wordmark is the central typographic ending.
- Include useful navigation to Models, Workbench, Method, Sign In and Start Modeling; copyright and factual notes remain readable.
- Wordmark must not clip horizontally or reduce into unrecognizable text on 390px/430px phones. Break/reflow deliberately.
- No fake social links, newsletter, four-equal-column default grid, legal claims not backed by product truth, or decorative infinite marquee.

## 11. Copy law

Words must sound like a confident human creative writer, not a model manual. Headlines are short and speak to a real user tension; exposition is selective and functional. No 'Movement', 'Part 1 of 4', 'Eng 01' as the main editorial identity, 'unlock the power', 'AI-powered revolutionary', 'future of intelligence', fabricated numbers, fake clients, or empty aspirational promises. Technical language is retained when an analyst needs it, in legible supporting locations.

## 12. Build order and acceptance gates

1. Audit/confirm product contracts and media provenance; lock storyboard and static-frame compositions.
2. Procure a first coherent set of licensed photographs, log sources, inspect subject and crops, generate optimized responsive variants.
3. Implement new global typography, neutral palette and layout primitives in marketing scope without breaking protected app styles.
4. Implement Home's persistent scenario/model journey, functional parameter changes, image cinematography and coherent scenes.
5. Rebuild Models, Workbench, Method as distinct route modes.
6. Implement true page transitions, mobile navigation, persistent media ownership and meaningful hover/focus interactions.
7. Compose cinematic finale and giant Math Intellect footer.
8. Run build/lint/type/unit verification; inspect changed files and deployed Vercel checks.
9. Perform actual browser/manual desktop, 390×844 and 430×930 visual QA, keyboard/reduced-motion/fast-scroll/reverse-scroll and navigation QA; correct what visibly fails.

### Reject if
- Hero static still is not at least an internal 8/10.
- Two consecutive Home viewports become primarily text.
- Photographs are generic decor or unrelated to the section's question.
- Scroll is smooth but movement lacks cause/effect.
- Any public controls use dummy metrics.
- Mobile is desktop pinned choreography scaled down.
- Header/menu/route transition prevents reaching authenticated tools.
- Footer is minor utility rather than an authored large identity.
- Low-powered and reduced-motion browsers do not retain product value.
- Build/CI reports are passed off as proof of visual quality.

### Release discipline
Main branch only; do not make feature branches, preview/demo pages, or alter protected backend behavior for aesthetic reasons. Avoid shipping a half-designed experience between visual stages. Production Vercel deployment will follow verified commits on main. An external award or 9/10 is never claimed without actual independent visual acceptance.

## 13. References consulted

- Attached Valtum Studio UI/UX Creative Frontend Brain (latest footer-update priority), Design Elements list, Animation reference, and 57-page live-browser corpus.
- GitHub sources: analyticsmath/MathIntellect, analyticsmath/PersonalityAnalysis.
- Valtum Design Ideas Drive folder: Swiss editorial photographic type, landscape big-wordmark footer, collage/gallery stack and spinner references.
- Lenis official reference: https://lenis.dev/ and https://github.com/darkroomengineering/lenis.
- Award reference corpus: Lando Norris for data-as-design and persistent actor; LIKOVA for subject continuity and commercial action; White Desert for atmosphere/information pacing; Peak'n Film and REF Digital for selective photographic and transition mechanics. Transfer principles only, not visual templates.

**Next irreversible action:** Do not replace live marketing code until actual licensed lead photography and static-frame compositional direction have been checked together against this storyboard.