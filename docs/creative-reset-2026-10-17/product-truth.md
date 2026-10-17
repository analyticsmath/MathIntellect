# Product truth for the marketing reset

Source inspection only, 17 October 2026. This inventory reads authenticated frontend and backend implementation, not marketing copy. It establishes implemented capabilities, not a live deployment/service-health certification. No code changed.

## Strongest honest story

Math Intellect lets someone define a mathematical experiment, run it, and inspect its result. Its strongest defensible sequence is **choose the question → specify assumptions → calculate → inspect the result → return to previous runs**. The website can explain these actions through readable examples and actual interface details. It does not need a graph-led hero, decorative numbering, eyebrows, or invented statistics.

Suggested lead: **Explore what your assumptions produce.**

Suggested support: **Build simulations for uncertain inputs, strategic choices, market scenarios, and agent interactions. Inspect the results and return to previous runs.**

Primary account action: **Create an account** → `/signup`. Secondary: **Sign in** → `/login`. A public demonstration can be offered as **Try an example**, provided it is clearly distinguished from the account product.

## Actual model families

The builder exposes four selectable families, but several existing builder names/equations are misleading. Do not repeat them as product truth. Evidence: `frontend/src/components/simulation/SimulationForm.tsx:9–33,36–73,158–196`.

| Family | Inputs visible in authenticated builder | Actual calculation and outputs | Plain copy |
|---|---|---|---|
| Monte Carlo | Sample count; expression; named variables; normal, uniform, exponential, or Bernoulli distributions with parameters; optional seed | Samples the variables and evaluates the supplied arithmetic expression per iteration. Returns sampled outputs, mean, variance, standard deviation, extrema, median, percentiles and histogram. This is not the public additive-diffusion demo. | “Give uncertain inputs a distribution. See how they affect your result.” |
| Game theory | Two player names; editable strategies; a payoff for each player at each strategy combination | Finds dominant strategies and pure-strategy Nash equilibria. Default expected payoffs use uniform weighting across profiles. Do not claim a general mixed-strategy Nash solver or require zero-sum payoffs. | “Set the choices and payoffs. Inspect which strategies hold up.” |
| Market simulation | Initial price; volatility; drift; time horizon; path count; optional seed | Simulates multiplicative price evolution using exponential updates. Returns paths, final-price statistics, a fifth-percentile price value labeled VaR95, drawdown, annualized return/volatility. It is not an AR(1) engine despite the builder label. | “Change price assumptions. Explore the simulated range of outcomes.” |
| Agent interactions | Agents with names, starting resources and strategies; interaction rounds; optional seed. Strategies: aggressive, cooperative, tit-for-tat, random, defector | Repeated interactions with actions, payoffs, cumulative resources and cooperation statistics. Returns per-agent outcomes, round history and winner/tie. This is not a spatial flock/consensus simulator. | “Choose how agents behave. Follow their interactions and resources over time.” |

Evidence for actual inputs: `frontend/src/components/simulation/forms/MonteCarloForm.tsx:19–55,96–193`; `GameTheoryForm.tsx:73–158`; `MarketForm.tsx:14–25,32–108`; `ConflictForm.tsx:13–18,34–48,78–153`.

Evidence for calculation: `backend/src/modules/simulations/engine/monte-carlo.engine.ts:25–33,114,153–170,174–212`; `game-theory.engine.ts:25–49,169–236`; `market.engine.ts:26–36,145,236–260`; `conflict.engine.ts:37–44,341–356,365–439`. Result contracts: `backend/src/modules/simulations/interfaces/engine.interfaces.ts:31–78,102–156,200–252,278–329`.

Backend engines also contain advanced options such as portfolio assets/correlations, shocks and regime settings; game evolution/coalitions; agent alliances; correlated Monte Carlo variables. These are not exposed by the inspected builder forms. Keep these out of primary marketing promises unless a real UI workflow is demonstrated.

## What can be claimed about the workflow

**Run and inspect:** Builder posts to `/simulations/run`. Run completion offers analytics. Analytics has overview, charts, and 3D tabs, with separately loaded data. Evidence: `frontend/src/services/simulations.service.ts:17–22`; `frontend/src/pages/SimulationPage.tsx:30–47`; `frontend/src/pages/AnalyticsPage.tsx:41,63–64,179–215,226–269`.

Safe copy: “Run your model, then inspect its summary and visualizations.” Avoid implying every model has identical chart/3D representations.

**History/persistence:** Simulations are persisted, listed newest first, and retrievable with results. Dashboard renders recent runs and status counts. Evidence: `backend/src/modules/simulations/simulations.service.ts:155–181,266–298,593`; `frontend/src/pages/DashboardPage.tsx:15–22,191–225`.

Safe copy: “Return to previous runs and inspect their results.” Do not say “private personal history”: current simulation list/get/delete methods do not filter records by current owner (`simulations.controller.ts:64–88`; service `167–195`). Auth is required, but authentication alone is not evidence of tenant isolation.

**Saved model templates:** Backend supports user-scoped config creation/list/deletion, and frontend has a service/hook. No mounted consumer of `useSavedModels` or `modelsService.create` was found in authenticated TSX. Evidence: `backend/src/modules/saved-models/saved-models.controller.ts:25–49`; `saved-models.service.ts:15–45`; `frontend/src/hooks/useSavedModels.ts:5–37`. Do not advertise a user-facing “save templates and reopen them” flow yet. Automatic persisted run records are supported.

**Reproducibility/replay:** Stochastic engines accept seeds. Execution service resolves effective/input seed or generates one. However account progression adapts parameters before execution, so “same typed inputs always produce the same account result forever” is too strong. No dedicated rerun-original-snapshot button was found in authenticated screens. Evidence: `backend/src/modules/simulations/simulations.service.ts:255–263,988–1010`; `engine/simulation-engine.service.ts:87–102`. Safe technical wording: “Seeded execution supports reproducible calculations when the effective parameters are held fixed.” Do not headline one-click account replay without verification.

**Export:** The authenticated 3D renderer implements PNG screenshot download (`frontend/src/components/charts/ChartRenderer.tsx:1288–1297,1778`). No authenticated full-run JSON/CSV/PDF download was found. Public-demo JSON export is a separate feature, not proof of account export. Safe copy only where relevant: “Save a PNG of the 3D view.” Avoid “export every result” or “download your research archive.”

**Progression:** Profile/dashboard render level, XP and streak days; run service computes novelty/improvement/repetition-sensitive reward and progression, updates progression after runs, and adapts model parameters. Evidence: `frontend/src/pages/ProfilePage.tsx:80–90`; `DashboardPage.tsx:233`; `backend/src/modules/simulations/simulations.service.ts:417–533,841–847`. Safe copy: “Track your activity and progression as you explore.” Do not frame XP/level as a verified mathematical qualification or proven improvement in real-world decisions.

**AI explanations:** Analytics requests intelligence and an explanation, exposes loading/error states. Backend external generation needs `OPENAI_API_KEY`; do not promise guaranteed always-available external AI. Evidence: `frontend/src/pages/AnalyticsPage.tsx:85–105,115–137`; `backend/src/modules/ai/services/openai-client.service.ts:50–56`. Safe copy: “Request an explanation of a completed run.” Prefer subordinate feature placement over an unqualified AI-led promise.

## Exact access and routes

`frontend/src/App.tsx:104–146` establishes public `/`, `/models`, `/workbench`, `/method`; `/features` redirects to `/models`, `/product` and `/pricing` redirect to `/workbench`. There is no implemented pricing/subscription checkout route here.

Login/signup are `/login` and `/signup` within PublicOnlyRoute. Protected application routes are `/app` (dashboard), `/app/simulations/new`, `/app/analytics/:id`, `/app/feed`, `/app/profile`. Legacy `/simulations/new` and `/analytics/:id` redirect into `/app`.

Unauthenticated protected access redirects to `/login?next=...` preserving path/query/hash: `frontend/src/shared/ui/ProtectedRoute.tsx:7–25`. Backend simulation and saved-model controllers use JwtAuthGuard: `backend/src/modules/simulations/simulations.controller.ts:28–29`; `backend/src/modules/saved-models/saved-models.controller.ts:25–26`.

## Limits to communicate plainly

Outputs describe the model and supplied assumptions. No inspected engine establishes predictive accuracy against real-world observations, imports live market data, guarantees financial outcomes, or infers a person's real behavior. Market “sentiment” is explicitly a proxy derived from simulated metrics (`market.engine.ts:464–507`). Avoid “predict the market,” “find the winning strategy,” “understand reality,” “validated intelligence,” or guaranteed decision improvement.

Suitable boundary sentence near examples: “Simulation results depend on the assumptions you choose. They do not establish what will happen in the real world.”

## Suggested content sequence

Lead with the action and purpose: “Explore what your assumptions produce.” Follow with a clear account action. Explain the four model families through distinct concrete questions, not decorative model imagery. Show how a user specifies one experiment and reads its actual result. Then explain persisted runs and optional interpretation, before a final account action. Keep progression as secondary context rather than the central scientific value proposition.

Candidate headings: “Choose the question.” / “Make the assumptions explicit.” / “Inspect the result.” / “Return to what you ran.”

These headings are content candidates, not approval of a layout or visual direction. No implementation should begin from this report alone.
