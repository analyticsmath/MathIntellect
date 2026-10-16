# Math Intellect — product story and redesign brief

**Date:** 17 October 2026  
**Scope:** Public experience at /, /models, /workbench, and /method. The authenticated application remains outside this redesign.

## Product promise

Math Intellect makes assumptions and possible outcomes inspectable. A person should be able to change a model condition, see the calculated paths respond, compare that run to a stated baseline, and understand the boundary of the result. The site must never imply that an illustrative model or a stock photograph is a forecast, a real market observation, or customer evidence.

The story is one real experiment that opens into four mathematical lenses:

1. **Start with a question.** The hero makes the value plain: see the range behind a result. Editorial photography adds human scale; nearby copy makes clear that the model—not the photograph—produces evidence.
2. **Make the starting conditions visible.** Introduce the public additive-diffusion example with its actual values: 24 paths, 50 steps, seed 42, drift 0.05, volatility 0.35, and a start at zero.
3. **Change one condition.** The volatility control changes the calculation immediately. Drift, seed, path count, and horizon stay fixed so the change has a clear interpretation.
4. **Compare the runs.** Place current paths and baseline on the same coordinate system. Report actual endpoint statistics, and state that a within-model comparison does not establish real-world cause or probability.
5. **Explore other model families.** On wider screens, ordinary vertical scrolling carries the reader across Monte Carlo, Game Theory, Market Dynamics, and Agent Interaction in a pinned horizontal gallery. Each stop presents its question, actual inputs and outputs, and distinct editorial context photography. On smaller screens, the sequence becomes a normal vertical stack.
6. **Reproduce the evidence.** Replay the same inputs and show that the seeded result matches. Keep exploration linked to the workbench and method.
7. **Explain the calculation.** The method page shows the equation, sampling process, statistics, seed behavior, and limitations in readable language.

The public interface will not use internal storyboard language such as “next chapter,” “chapter 01,” “section 03,” or “question 05.” Generic eyebrow/tag rows are out. Section headings carry meaning; no copy is filler.

## Page roles

- **Home:** Establish the promise, show a real trajectory plot, let visitors change volatility, compare with the baseline, and move through the scroll-controlled model gallery.
- **Models:** Give each supported model family a distinct visual and a direct explanation of its assumptions, inputs, and outputs. Keep the public diffusion demo separate from authenticated simulations.
- **Workbench:** Preserve all current controls, deterministic calculations, replay, result export, and accessibility. Prioritize the experiment panel over decorative imagery.
- **Method:** Explain the exact public calculation and its limits. Use editorial photography for pacing, never as a substitute for data.

## Art direction

Move from generic cold dashboard blue toward a brighter mineral-paper canvas with ink-green typography and one restrained vermilion signal. Use warm natural photography as context against quiet surfaces; use distinct chart colors only where they encode data. Keep legends, control states, and comparisons legible without color alone.

Retain the bundled Syne variable display face, Hanken Grotesk reading/UI face, and IBM Plex Mono for parameters. Create contrast through scale, weight, line length, and editorial spacing. Set major headings in a wide measure so they remain within two or three lines. Remove repetitive outlined cards; rely on whitespace, purposeful image crops, tonal surfaces, and only the borders that explain chart or control structure.

Use an editorial split for the opening, an asymmetric evidence spread for the experiment, and a horizontal model index. Give each route its own hierarchy instead of repeating one hero template.

## Motion and navigation

Motion should explain a real change and leave time to read it:

- Use a visible, brief transition between public routes: old content recedes and fades; new content settles in, over about 600 ms with a gentle cubic-bezier. Preserve browser history and hash navigation.
- Reveal hero copy and imagery in separate beats; let the plotted paths draw more slowly than interface text.
- Let ordinary page scroll drive the desktop model rail through GSAP ScrollTrigger. Use one pinned passage with bounded travel, not a second scroll system or a click-only carousel.
- Draw plotted paths once on entry. Parameter changes update the plot directly; do not replay a long entrance animation while a visitor uses the control.
- Vary small entrances for supporting content rather than repeating one fade-up everywhere.
- Provide an unpinned, readable mobile layout and honor reduced-motion preferences. The model sequence remains discoverable without animation.
- Avoid loaders and spinners where the local model calculates synchronously. Add progress only for an actual wait.

Interaction references: [Charles Leclerc homepage scroll and image transition](https://www.awwwards.com/inspiration/homepage-scroll-charles-leclerc) and [iN scroll, section, and page transitions](https://www.awwwards.com/inspiration/scroll-animations-in). The closest product-story reference is Clarity Innovations’ [Journeys in Visual Mathematics](https://www.clarity-innovations.com/portfolio/maier-math-foundation/journeys-visual-mathematics-website), which connects mathematical visual models with a cohesive learning narrative. Transfer the relationship between story and interaction, not its visual identity or wording.

## Existing local photography

Use already optimized local WebP assets; do not add remote hotlinked image URLs or imply the pictures are model output.

- Opening and Monte Carlo: Pete Godfrey, impact-origin image.
- Volatility/comparison: Pete Godfrey, impact-aftermath image.
- Repeated paths and variation: Pete Godfrey, impact-variation image.
- Game Theory: Adam Rutkowski, game-theory image.
- Market Dynamics: Jakub Żerdzicki, market-observation image.
- Agent Interaction: James Wainscoat, murmuration image.
- Method: Eric Prouzet, measurement image.

Keep photographer/source credit available in the footer. Preserve the existing media manifest as the provenance source; do not use the rejected fencing image.

## Completion criteria

- The home page tells the complete experiment story and still contains several substantive sections.
- Changing volatility updates the real seeded model and baseline comparison; replay and JSON export still work.
- Desktop vertical scrolling drives the complete four-model gallery; mobile has an uninterrupted vertical equivalent.
- Each public route has a distinct hierarchy. Route transitions are visible, quiet, and usable.
- Photography is local, credited, responsive, and clearly illustrative.
- No placeholder, storyboard-only, or meta-eyebrow copy appears in the public experience.
- Keyboard focus, contrast, labels, direct route loading, hash links, and reduced-motion behavior remain intact.
