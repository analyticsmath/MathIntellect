// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { runDeterministicMonteCarlo } from "../../../math/deterministicModels";
import { TrajectoryField } from "./TrajectoryField";
afterEach(cleanup);
it("reports the actual ensemble statistics with decorative paths hidden", () => {
  const result = runDeterministicMonteCarlo();
  const { container } = render(
    <TrajectoryField current={result} variant="hero" />,
  );
  expect(screen.getByRole("img").textContent).toContain(
    `24 paths. Mean endpoint ${result.mean.toFixed(4)}. Variance ${result.variance.toFixed(4)}`,
  );
  expect(container.querySelectorAll(".pe-path")).toHaveLength(24);
  expect(container.querySelector(".pe-path")?.getAttribute("aria-hidden")).toBe(
    "true",
  );
});
