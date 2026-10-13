# Math Intellect story and reference study

**Prepared:** 13 October 2026  
**Scope:** Public homepage, model index, workbench and method page

## What the product does

Math Intellect is a workspace for configuring and examining mathematical simulations. The public workbench is a small, self-contained example: a seeded additive diffusion calculation starts 24 paths at zero, applies drift and volatility over 50 steps, and reports the endpoint mean and population variance. A visitor can change volatility while drift, seed, path count and horizon remain fixed. The result can be replayed and saved as a local JSON file.

The model builder exposes four engines: Monte Carlo, Game Theory, Market Dynamics and Agent Interaction. The marketing site now names only those four. The old fifth “Custom” card was removed because the current model selector does not expose a custom engine.

## Story direction

The scenario is the protagonist. It starts from a stated condition, branches into calculated paths, changes when one input moves, sits beside its baseline, then returns on replay. That is the story a visitor can see and test.

1. **Start:** Twenty-four paths begin at zero. The hero chart is the actual seeded calculation, not a photograph or generated illustration.
2. **Intervene:** The visitor moves volatility. The chart recalculates from the same drift, seed and horizon.
3. **Compare:** Baseline and changed paths share one scale. Endpoint variance makes the change legible, with a note about what the calculation cannot establish.
4. **Choose another question:** Four model cards show a computed path plot, the product's opening payoff matrix, one relevant market photograph, and the model builder's actual default agent setup.
5. **Return and inspect:** Replay verifies the same result. The workbench keeps the current inputs visible and can save them. The method page explains the calculation and its limits.

This carries forward a principle from the Personality Assessor work: let the product's own evidence lead the story, and keep the same state coherent as the user moves between scenes. It uses the scenario and its changing evidence rather than personality imagery or a copied brand treatment.

## Six reference sites

The references were reviewed to understand how premise, visual focus and interaction work together. Their copy, imagery, marks and code are not reused.

| Reference | What was observed | What informs this site |
| --- | --- | --- |
| [Lando Norris](https://landonorris.com/) | A dark opening resolves to a large personal mark. Scrolling connects biography, career figures, current context and an archive of helmets. | One scenario stays in view from the first path to comparison and replay. Data belongs to the same subject as the opening. |
| [White Desert](https://white-desert.com/) | Itineraries identify concrete places, dates and stops. Photography sets a world, while cards explain how a trip unfolds. | Replace abstract claims with the actual run: inputs, path count, steps, comparison and replay. |
| [LIKOVA](https://likova.space/) and the [Vide Infra case study](https://videinfra.com/work/likova) | The building remains the visual subject. Its form and site-plan interaction give the project details a reason to appear. | The calculated path field is the main visual. Every annotation names a real value or action. |
| [Oryzo](https://oryzo.ai/) and [Lusion's project notes](https://lusion.co/projects/oryzo_ai/) | The project notes describe one deliberately ordinary object carrying a dry campaign premise. The cloud browser remained on a black preloader, so its visual transitions were not evaluated. | Keep one clear premise from headline through interaction. Do not claim a motion pattern that was not observed. |
| [Siena Film Foundation](https://www.siena.film/) | The browser exposed the archive labels for title, format, year and runtime, but its visual canvas did not render in this session. | Give each model a useful name, question, inputs and outputs. Do not make access to a canvas necessary to understand the page. |
| [Moto Card](https://www.moto-card.com/) | A real physical card leads the first composition. Scrolling moves into a concise product statement and concrete product details. | Put the actual product artifact first. Here that artifact is the computed path field. |

### Additional references and source limits

- [Lenis](https://lenis.dev/) documents a smooth-scroll library, but the marketing pages use native browser scrolling. No scroll hijack is needed for this story.
- [Studio Ardē](https://www.studio-arde.com/work/) informed the use of varied model compositions within one shared system.
- [Fabian Ferdinand Fallend](https://www.fabianfallend.com/) makes authorship and portfolio categories legible alongside strong typography; the market photograph is credited at its use and in the footer.
- The connected Drive “Design Ideas” folder contained dashboard, fintech and product-landing references. The browser preview for the available images was access-gated, so those files were not used as visual evidence.

## Visual and motion direction

- **Hero:** A dark navy field, large editorial headline and a chart generated from the active scenario. No generated hero image and no generic finance portrait.
- **Palette:** Deep navy and cool porcelain establish the instrument surface. Cobalt identifies the current run. Cyan marks the active path and interaction. IBM Plex Mono is reserved for parameters and measured values. The existing Syne and Hanken Grotesk families remain in use.
- **Photography:** One local Unsplash photograph appears in the Market Dynamics section as setting only. It is credited to Daniel Brzdęk and explicitly identified as context, not a calculation. The hero, payoff matrix, agent setup and trajectory figures are product visuals.
- **Motion:** The hero paths draw once. Moving a control recalculates the paths and statistics immediately. Scroll reveals use a short opacity and crop transition; route changes use a restrained View Transition. The mobile menu is an accessible overlay. Native scrolling remains in control. There is no pinned hero, decorative image parallax or vertical text gimmick.
- **Access:** Reduced-motion settings remove reveal and transition movement. All important values remain text. Charts have accessible labels, controls have names and focus states remain visible.

## Review questions

The finished experience should answer these questions in order:

1. What is the model calculating?
2. Which conditions are held fixed?
3. What changed when the visitor moved the control?
4. Can the result be reproduced?
5. What can this result not claim?

Remove any image, phrase or animation that obscures one of those answers or makes an illustrative asset look like evidence.

## Image source

- Daniel Brzdęk, [financial stock market data displayed on a screen](https://unsplash.com/photos/financial-stock-market-data-displayed-on-a-screen-EuIqk6LpUU0), stored at `frontend/public/media/math-intellect/unsplash/finance-screen.webp`.
