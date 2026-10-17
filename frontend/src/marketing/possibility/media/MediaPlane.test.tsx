// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { MediaPlane } from "./MediaPlane";
afterEach(cleanup);
it("falls back to the approved WebP when the preferred source fails", () => {
  const { container } = render(
    <MediaPlane role="worldCollision" alt="Crowd context" />,
  );
  fireEvent.error(screen.getByAltText("Crowd context"));
  expect(container.querySelectorAll("source").length).toBe(0);
  expect(screen.getByAltText("Crowd context").getAttribute("src")).toMatch(
    /world-collision-wide.webp$/,
  );
});
