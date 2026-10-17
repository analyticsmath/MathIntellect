# Math Intellect public copy

Final proposed wording for review. Headings below identify copy locations; they are not extra labels to render. Render no eyebrows, overlines, decorative numbering, or internal scene names. Home introduces the product; Models explains choices; Workbench offers one clearly bounded public example; Method explains that example. Account features and the public example remain distinct.

## Shared navigation

Math Intellect

Models · Try an example · How it works

Sign in · Create an account

Destinations: `/models`, `/workbench`, `/method`, `/login`, `/signup`.

## Home

### Opening

# Explore what your assumptions produce.

Build simulations for uncertain inputs, strategic choices, market scenarios, and agent interactions. See what follows from the conditions you choose.

**Create an account** → `/signup`

**Try an example** → `/workbench`

### Model introduction

## Different questions need different models.

A range of possible values. A choice shaped by another player. Resources changing through repeated interactions. Start with the question you want to explore.

**Find your model** → `/models`

### Model descriptions

**Monte Carlo**

Give uncertain inputs a distribution. Explore how they affect a calculated result.

**Game theory**

Define the choices and payoffs. Look for strategies that remain stable when players can change their minds.

**Market simulation**

Set price, drift, and volatility assumptions. Inspect the range of simulated outcomes.

**Agent interactions**

Choose starting resources and behavior. Follow what happens as agents interact.

### Product workflow

## Make the assumptions explicit.

Choose a model, enter its parameters, and name your run. You decide what the calculation starts with.

## Take a closer look at the result.

Inspect the summary and available visualizations. Return to previous runs when you want to examine them again.

### Public example invitation

## What changes when uncertainty grows?

Try a small example in your browser. Change volatility, compare the result with a fixed baseline, and repeat the calculation with the same seed.

**Try the example** → `/workbench`

### Closing

## Start with a question.

Create an account to build and run your own simulations.

**Create an account** → `/signup`

Already have an account? **Sign in** → `/login`

## Models

### Opening

# Choose a model for your question.

Each model makes a different set of assumptions. Choose the structure that fits what you want to examine.

### Monte Carlo

## How do uncertain inputs affect a result?

Define variables and their probability distributions, then write the expression you want to calculate. Monte Carlo samples those inputs repeatedly to show a distribution of results.

**You set:** Variables, distributions, expression, sample count, and an optional seed.

**You inspect:** Sampled results, average, variance, percentiles, and a histogram.

### Game theory

## What happens when choices depend on others?

Name two players, define their strategies, and enter the payoffs for each combination. Inspect dominant strategies and pure-strategy Nash equilibria, where no player benefits by changing their choice alone.

**You set:** Players, strategies, and payoffs.

**You inspect:** Dominant strategies, equilibria, and calculated payoffs.

### Market simulation

## What could follow from these price assumptions?

Set a starting price, drift, volatility, and time horizon. Generate simulated price paths and examine their final values and drawdowns.

**You set:** Initial price, drift, volatility, horizon, path count, and an optional seed.

**You inspect:** Simulated paths, final-price statistics, and drawdown.

### Agent interactions

## How does behavior change the outcome?

Give agents starting resources and interaction strategies. Run repeated rounds to examine actions, payoffs, cooperation, and changes in resources.

**You set:** Agents, resources, strategies, rounds, and an optional seed.

**You inspect:** Round history, cooperation rate, and each agent's final resources.

### Boundary and action

Simulation results depend on the model and assumptions you choose. They do not establish what will happen in the real world.

**Create an account to build a simulation** → `/signup`

**Try the public example** → `/workbench`

## Workbench

### Opening

# Change an assumption. See what follows.

This public example calculates 24 paths from the same starting value. Change volatility, drift, or seed to explore how the result changes.

### Instrument heading

## Your conditions

Volatility

Scales the random variation at each step.

Drift

Adds a steady directional change at each step.

Random seed

Sets the sampling sequence. Keep it fixed to compare volatility changes using the same random samples.

Starting value: 0

Paths: 24

Steps: 50

**Reset conditions**

### Result heading and comparison

## The calculated paths

Every path starts at zero. The baseline uses volatility 0.35 with your current drift and seed.

Legend: Baseline · Current

Metrics: Mean endpoint · Current endpoint variance · Baseline endpoint variance · Variance change

### Actions and states

**Repeat this calculation**

**Download JSON**

Default status: Change an input to recalculate.

Confirmed status: Recalculated. Every path and statistic matches.

Download success: Downloaded the current inputs and calculated result.

Download error: The download could not be created. Try again.

### Scope

## One example, with clear limits.

These paths come from an additive diffusion model with constant drift and volatility. They are simulated values, not observations or a forecast.

The JSON file contains the current model, inputs, and result. This public example does not save a run to an account.

**See how this example works** → `/method`

**Explore the model families** → `/models`

### Account invitation

## Build a simulation around your own question.

Create an account to choose a model, set its parameters, and inspect the result.

**Create an account** → `/signup`

## Method

### Opening

# Understand the calculation.

Follow the public example from its starting conditions to its endpoint statistics. This explains the example on this site, not every model available in an account.

Contents: Starting conditions · Sampling · Comparison · Repeating a run · Limits

### Starting conditions

## Every path starts at zero.

The example calculates 24 paths over 50 equal steps. Drift and volatility stay constant during each run.

The opening conditions are drift 0.05, volatility 0.35, and seed 42. Changing a control recalculates the paths in your browser.

### Equation

xₜ₊₁ = xₜ + μΔt + σ√Δt Zₜ

**Current value, xₜ:** The value carried forward from the previous step.

**Drift, μΔt:** The same directional increment added at every step.

**Volatility, σ√Δt:** The scale of the random increment.

**Random sample, Zₜ:** A seeded sample from a standard normal distribution.

### Sampling

## One rule, many sampled paths.

Each path applies the same update rule with its own sequence of random samples. The endpoint statistics describe the values reached after the final step.

The mean endpoint is the average final value. Endpoint variance measures how widely the final values are spread around that mean.

### Comparison

## Change volatility. Hold the sampling sequence.

The baseline always uses volatility 0.35. It shares your current drift, seed, path count, and number of steps.

Both runs use the same vertical scale. Solid current paths and dashed baseline paths let you compare their spread without changing the conditions around them.

### Repeating a run

## Repeat the same calculation.

The public example uses a deterministic random-number generator. With the same inputs and seed, it produces the same paths and statistics.

**Repeat this calculation**

Default status: The current conditions are ready to repeat.

Confirmed status: Recalculated. Every path and statistic matches.

### Limits

## A result belongs to its assumptions.

This example assumes constant drift and volatility, independent normal increments, and a fixed number of sampled paths. Twenty-four paths do not describe every possible outcome.

The calculation does not use observed market data or establish what will happen outside the model. Its purpose is to make the relationship between inputs and results easier to inspect.

### Closing

## Try changing the conditions.

**Open the example** → `/workbench`

**Explore other models** → `/models`

## Shared footer

Math Intellect

Explore assumptions through mathematical simulation.

Home · Models · Try an example · How it works · Sign in · Create an account

## Editorial implementation notes

Use the exact counts and dynamic values supplied by the public scenario. Do not hard-code current metrics into prose. Render download success/error copy only if corresponding state is implemented. The comparison copy assumes the actual shared scale and dashed baseline remain available. No account promise of one-click replay, saved templates, full-run export, private storage, forecasting accuracy, or mixed-strategy equilibrium solving is included. Current illustrative AR(1), spatial-agent, and zero-sum graphics must not sit under the new account-model descriptions as if they depict those engines.
