# Math Intellect experience direction

## Product truth

Math Intellect lets people define mathematical models, run simulations, compare outcomes, and inspect the assumptions behind them. The public experiment is a seeded additive diffusion calculation: 24 paths, 50 steps, drift 0.05, volatility 0.35, seed 42. The four public model families are Monte Carlo, Game Theory, Market Dynamics, and Agent Interaction. Only the seeded diffusion example is presented as a live calculation. Other families are described as structures and their visuals are illustrative.

## Story thesis

**Make uncertainty visible.**

The protagonist is one repeatable run. The visitor sees its conditions, its complete set of outcomes, the effect of changing one value, and the limits of what that run can tell them. Photography establishes real systems and people; the plot remains the only evidence of the calculation.

The site moves through a deliberate intensity curve: a cinematic real-world system, a precise model setup, a full outcome field, a live comparison, distinct model questions, and an inspectable method. The same example remains recognizable as the visual story changes from photograph to inputs to computed paths.

## Storyboard

### Opening: a system in motion

A complete physical fluid-impact photograph shares one graphite viewport with a two-line title. Its subject is the entry into the story, not a visualization of the public model. The title is single-colour and the primary action is immediately useful. Desktop scrolling brings the image toward the visitor while the title holds before receding. Mobile uses the full portrait subject below the copy with native scrolling.

A separate water-surface passage changes scale from isolated impact to a field of possible motion. The words “One starting point. Many possible paths.” reveal on scroll as the photographic frame expands. The next section then explicitly switches from physical context to calculated data.

### Conditions: make the model legible

The photograph hands off to the real seeded example. Show the equation and its five conditions as part of one working surface, not a row of cards: drift 0.05, volatility 0.35, 24 paths, 50 steps, and seed 42. Each value has a short explanation. The visitor should understand what stays fixed before seeing the output.

### Outcomes: reveal the complete field

Draw the 24 paths from the shared starting point, then settle on all endpoints. This is the actual browser calculation. Keep the full plot in view while explanatory copy advances. State that the paths are one seeded finite run, not a forecast. The transition from photograph to chart is a clear change of representation, not a suggestion that the photograph contains measured data.

### Comparison: change one thing

Keep the baseline run visible. Let the visitor adjust volatility while drift, seed, path count, and horizon remain fixed. Recompute the paths and compare them on one shared scale. The value and output move together; no separate decoration competes with the calculation.

### Model choice: match the structure to the question

A horizontal, scroll-linked gallery moves through Monte Carlo, Game Theory, Market Dynamics, and Agent Interaction. Each scene pairs one carefully chosen photograph of a relevant real-world context with its model diagram, question, inputs, and outputs. The photography establishes context; diagrams explain structure. Do not present conceptual examples as active calculations. Desktop motion settles into complete scenes. Touch layouts use natural vertical scrolling.

### Method: inspect and reproduce

Show the calculation, seed behavior, input boundaries, and limits in a readable method view. The public example can be replayed from the same inputs. Link directly to the workbench, where the visitor can change the model.

### Closing: start a model

End on the actual calculation surface and a direct invitation to build a model. The final action grows out of the story rather than appearing in a generic call-to-action banner.

## Photography plan

The current casting follows `docs/design/math-intellect-refinement-2026-10-17.md`. All active photos are local WebP, visibly credited, and contextual rather than calculated output. Source metadata and dimensions are maintained in `frontend/src/marketing/film/photoLibrary.ts`. Earlier city, chess and crossing derivatives remain in the repository as archived assets.

| Role | Photographer | Source | Local delivery |
| --- | --- | --- | --- |
| Physical impact hero | Pete Godfrey | https://unsplash.com/photos/milk-splash-frozen-in-time-against-black-background-6ieRRBACAqM | 2560 × 1707; portrait 960 × 1280, existing verified repository photo |
| Surface and scale bridge | Valeriia Miller | https://unsplash.com/photos/dark-water-ripples-create-an-interesting-pattern-ye_2-LjeFVM | New download 17 October 2026; WebP 1800 × 1100 |
| Monte Carlo | Cosmin Andrei Buzamat | https://unsplash.com/photos/aerial-view-of-a-river-delta-with-branching-waterways-mVNA-yH7wNM | 1400 × 960; 800 × 1100 |
| Strategic exchange | Adam Rutkowski | https://unsplash.com/photos/two-men-sitting-at-a-table-with-a-laptop-r_WVQzfgClw | New WebP derivative 1400 × 933; retain both people on mobile |
| Market system | Daniel Miksha | https://unsplash.com/photos/aerial-view-of-stacked-shipping-containers-at-a-port-37mW7MvAOvU | 1400 × 960; 800 × 1100 |
| Collective behaviour | James Wainscoat | https://unsplash.com/photos/b7MZ6iGIoSI | New WebP derivative 1600 × 1067; retain the flock formation |

No generated artwork or invented brand icon is used. The current live source checks reconfirmed free Unsplash licensing for the hero, water surface and strategic exchange. The flock retains the repository's prior provenance record and standard Unsplash licensing. No photograph represents a customer, forecast, or model result.
## Art direction

- Graphite, pure white, cool grey and restrained mineral green. Let photography supply the broader colour. Green marks controls and plotted current data; no red or orange interface accent.
- No gradients, glows, glass, cyan, purple, indigo, orange-led interface, cream surfaces, or decorative texture.
- Use one colour for each complete heading. Do not colour a word or line independently.
- Keep the Math Intellect name as a typographic wordmark. Add no invented symbol or replacement logo.
- No eyebrows, kickers, overlines, decorative chapter numbering, fake “next chapter” labels, filler text, or em dashes in public copy.
- Avoid template card grids, generic split heroes, and repeated photo-and-text alternation. Let the photograph, calculation, and typography own different moments.

## Motion grammar

- Use a slow, deliberate image reveal, then the headline, then supporting copy and actions. Never make them compete for attention.
- Use scroll-linked movement for the sticky calculation story. Progress follows the reader, holds on each meaningful state, and reconstructs cleanly on reverse scroll.
- Keep plot drawing long enough to read as trajectories. The plot must resolve before explanatory text advances.
- Map vertical scrolling to the horizontal model gallery on desktop. Each panel completes before the next takes over. Use native vertical panels for touch and reduced motion.
- Preserve the approved page curtain exactly. The refinement must not modify App.tsx or its curtain rules in film.css. Add independent hero camera motion, image-plane expansion and a scroll-composed model gallery with complete reading holds.
- Motion must not hide essential information. Honor reduced motion and fast scrolling.

## Reference principles

- Google Research Language Explorer: let the data be the interface. Preserve the principle of exploration through the primary object, not its geographic map.
- Bright Biotech: advance the story through a sequence of scroll-driven scenes. Preserve its narrative pacing, not its biological imagery or 3D language.
- Oryzo AI: use a material handoff to make changes in representation feel continuous. Translate that idea into a photo-to-calculation transition, not an imitation of its 3D product scenes.
- Valtum’s current creative frontend brain is the governing design authority: product truth first, a product-native protagonist, strong viewport compositions, photography with an intentional layout role, and distinct motion rather than template choreography.

## Acceptance

The opening image must be real, locally served, and credited. The complete Math Intellect name occupies the footer width on one line. The menu must work with keyboard focus, Escape and restored body scrolling. The generated hero file and invented logo mark must be absent. Every public statement must describe an actual capability, model input, output, or limitation. All four model scenes must be reachable by scrolling without clicking. Image, plot, and copy must resolve at a readable pace on desktop, mobile, keyboard navigation, and reduced motion.
