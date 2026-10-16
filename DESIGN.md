# Math Intellect — experience direction

## Product truth

Math Intellect helps people define mathematical models, run simulations, compare outcomes, and inspect the assumptions behind them. The public workbench currently demonstrates one concrete calculation: seeded additive diffusion with 24 paths, 50 steps, drift 0.05, volatility 0.35, and seed 42. Other model families are represented as conceptual structures until their corresponding calculations are running.

A plot may be presented as a result only when it is generated from the stated inputs. Conceptual diagrams and commissioned visual art must remain visually distinct from calculated evidence.

## Story

**Thesis:** A result is a consequence of its assumptions. Visitors should be able to move from the stated conditions to the full outcome field, change one condition, and inspect what that change does.

The home page follows one real calculation rather than making a vague promise about mathematical intelligence.

1. **Set the scene.** A bespoke, decorative path-field image establishes the idea of many possible outcomes. The headline stays in one color. The exact public example is stated clearly below it.
2. **Trace one run.** A scroll-led sequence moves from the fixed inputs, through the 24 calculated paths, to a distribution of their 24 endpoints. The same result stays in view while each explanation comes forward.
3. **Change one assumption.** The visitor changes volatility while drift, seed, path count, and horizon remain fixed. Baseline and current paths share a scale; the endpoint mean and variance are described as summaries of this finite sample.
4. **Choose the model structure.** A horizontal, scroll-controlled gallery presents Monte Carlo, Game Theory, Market Dynamics, and Agent Interaction with different visual grammars and concrete input/output descriptions.
5. **Inspect the method and its limits.** The formula, random-number method, replay behavior, and limits lead naturally to the workbench.

The Models page introduces the four structures without implying that every family is demonstrated by the public example. The Workbench remains the functional place to change inputs. The Method page makes the calculation inspectable.

## Reference analysis

- Google Research Language Explorer received Awwwards Site of the Day on 16 January 2026. Its data map is the interface, and its restrained monochrome field keeps exploration focused on the information. Transfer the principle that the primary object should be the data itself; do not copy its geographic map or interface.
- Bright Biotech received Awwwards Site of the Day on 18 July 2025. Its science story advances through scroll-driven sections and transitions. Transfer the ordered reveal and one continuous narrative; do not copy its biological imagery, 3D language, or palette.
- Oryzo AI received Awwwards Site of the Day on 13 April 2026. Its product story uses material shifts and 3D-to-2D transitions to make a simple object feel considered. Transfer continuity between page states and a deliberate visual handoff; do not copy its product visuals or effects.
- The Personality Assessor project established a stronger rhythm by giving one meaningful object continuity across several movements. Here, the path field and the assumptions behind it are that object.

## Art direction

- Deep graphite, cool paper, and one considered lime signal. Use a single color for every complete heading. Never color a word or line of a headline separately.
- No eyebrows, kicker labels, fake chapter names, decorative numbering, placeholder copy, or unrelated stock photography.
- The new path-field artwork is commissioned visual art, not a calculated plot. The browser-generated trajectory plot and endpoint distribution are the evidence. Other model visuals are clearly conceptual schemas.
- Use the bundled Instrument Sans for display and reading text; use IBM Plex Mono for actual parameter values and mathematical notation.
- Build depth through scale, crop, contrast, spatial layering, and drawing motion. Avoid generic gradients, glow, glass, pill navigation, template card grids, and repeated photo/text alternation.

## Motion and interaction

- Let the hero art arrive first, then reveal the complete headline, explanatory copy, exact conditions, and actions in a deliberate sequence.
- The path plot should draw long enough to read as a set of trajectories. Do not overlap its reveal with unrelated title or control animation.
- Keep the three-part calculation story on a sticky visual field while text advances with scroll. Crossfade each state over roughly 650–750 ms; ordinary scrolling remains in control.
- The model gallery translates horizontally from vertical scroll on desktop, settles on a complete model after a pause, and draws each model's structural paths as it enters. Touch and reduced-motion layouts use natural vertical scrolling.
- Route changes retain the header and use a restrained reveal of the incoming page. Public routes must not fall back to a blank full-screen lazy-load state.
- Respect reduced motion, keep controls keyboard usable, and keep all essential text and values visible without animation.

## Copy and integrity

Name the actual model, input, output, and limits. Never imply that a conceptual illustration is a measured result, call a parameter “AI,” invent a result, or suggest a simulation predicts an outcome outside the model. Keep all public text useful without hover or animation.