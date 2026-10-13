import { Link, type LinkProps } from "react-router-dom";
import type { ModelId } from "./filmMedia";

import { setCarry } from "./navigationCarry";
export function TransitionLink({
  actor,
  children,
  ...props
}: LinkProps & { actor?: ModelId }) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        setCarry(null);
        if (
          !actor ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        )
          return;
        const image = event.currentTarget.querySelector<HTMLImageElement>(
          `[data-mi-actor="${actor}"] img`,
        );
        if (!image?.complete) return;
        const imageRect = image.getBoundingClientRect();
        const rect = (
          image.closest(".mi-photo") ?? image
        ).getBoundingClientRect();
        setCarry({
          id: actor,
          src: image.currentSrc,
          position: image.style.objectPosition,
          filter: getComputedStyle(image).filter,
          rect: {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
          },
          imageRect: {
            left: imageRect.left,
            top: imageRect.top,
            width: imageRect.width,
            height: imageRect.height,
          },
          time: performance.now(),
        });
      }}
    >
      {children}
    </Link>
  );
}
