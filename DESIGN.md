# Math Intellect — redesign direction

## Product truth

Math Intellect helps people specify mathematical models, run simulations, compare outcomes, and inspect the assumptions behind them. The public workbench currently demonstrates one concrete calculation: seeded additive diffusion with 24 paths, 50 steps, drift 0.05, volatility 0.35, and seed 42. The site also describes four model families: Monte Carlo, Game Theory, Market Dynamics, and Agent Interaction.

The public site must distinguish the live additive-diffusion experiment from the broader model families. A chart may be shown as a calculation only when it is generated from the actual inputs and outputs. A conceptual model diagram must read as a schema, never as a simulation result.

## Story

**Thesis:** A model turns stated conditions into a field of possible outcomes.

The visitor follows one calculation from its origin to its limits. The same seeded path field stays visually present so each movement feels like a consequence of the last one.

1. **Establish the model.** Begin with a zero origin and the actual seeded additive-diffusion paths. Introduce the idea through the full path field, not a stock metaphor.
2. **Change one condition.** Let the visitor adjust volatility while drift, seed, path count, and horizon remain fixed. Show the current run and baseline on one scale.
3. **Read the spread.** Bring the endpoints together. Explain mean and variance as summaries of these 24 sampled endpoints, not guarantees about a real-world process.
4. **Choose the right model family.** Move horizontally through four distinct model grammars: a distribution sample, a payoff matrix, a stochastic market path, and an agent-interaction network. The family name and actual inputs/outputs remain readable throughout.
5. **Repeat and understand the boundary.** Replay the current inputs with the same seed. Then state plainly what the calculation does and does not establish.
6. **Continue in the workbench.** Offer the working experiment as the natural next step.

The home page teaches one concrete example before introducing the wider model catalogue. The Models page gives each family its own visual grammar and exact input/output summary. The Workbench stays the functional place to change the model. The Method page documents the calculation in readable language and notation.

## Reference analysis

- The Personality Assessor experience works best when one meaningful object carries the visitor across several visual movements. Transfer that continuity to the path field and the change from one condition to many outcomes. Do not reuse its personality-specific art, language, palette, or compositions.
- Lando Norris's site binds its sections to one recognizable protagonist and lets the visual record change in scale and pace. Transfer the narrative continuity and varied pacing. Math Intellect's protagonist is its model output, so photography of people, trading floors, liquid splashes, or unrelated objects would imply a story the product cannot support.
- The Valtum Studio reference corpus favors a distinct visual protagonist, deliberate holds, consequential movement, and a coherent handoff between sections. Apply these as motion principles, not as copied layouts or effects.

## Art direction

- Deep graphite for the opening and model journey; cool white for evidence and technical explanation; one phosphor-lime signal for the active result, controls, and current path. Neutral gray carries secondary text and baseline data.
- One color for each complete headline. Do not color a word, phrase, or second line to manufacture emphasis.
- Remove eyebrows, kicker labels, fake chapter names, decorative numbering, placeholder copy, and stock-photo captions from the public experience.
- The main visual material is the calculation itself: custom SVG data plots and model-specific vector schemas. These replace the current unrelated Unsplash photographs. Do not style an illustration as if it were measured output.
- No gradients, glow, glass, pill-shaped navigation, generic card grid, decorative rules, or repeated text/photo alternation. Separate movements through scale, space, surface, crop, and purposeful motion.
- Use the bundled Instrument Sans for display and reading text; use IBM Plex Mono for actual parameter values and mathematical labels.

## Motion and interaction

- Let the path field establish first, then hold long enough to read the conditions before the volatility comparison begins.
- The current/baseline comparison follows scroll progress; it must stay reversible when scrolling back.
- The four model families form a desktop horizontal journey controlled by vertical scroll. Each panel gets a readable hold before the next visual handoff. Touch and reduced-motion layouts use ordinary scrolling with every section available.
- Route changes use the browser's View Transition API with a single restrained reveal of the new page. Keep header and footer continuity; never cover navigation with a long loader.
- Use motion to reveal actual relationships and state changes. Do not animate every label or run unrelated loops.
- Respect reduced-motion preferences, keep all controls keyboard usable, and make the underlying experience complete without animation.

## Copy and integrity

Use direct, specific language. Name the actual model, input, output, and limits. Never call an input “AI,” invent a result, or imply that a simulated path predicts what will happen outside the model. Do not publish internal production notes or dummy labels.

The complete public headline, paragraph, and control labels must remain readable without hover or animation.