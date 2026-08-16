import { animate } from 'animejs';

/**
 * Animate a numerical parameter value smoothly to its target
 */
export function animateParameterValue(
  targetObj: { value: number },
  toValue: number,
  duration = 350,
  onUpdate?: () => void
) {
  return animate(targetObj, {
    value: toValue,
    duration,
    ease: 'outQuad',
    onUpdate: () => {
      if (onUpdate) onUpdate();
    },
  });
}

/**
 * Propagate visual feedback on parameter change
 */
export function propagateIndicator(
  element: HTMLElement | SVGElement | null,
  duration = 280
) {
  if (!element) return;
  return animate(element, {
    opacity: [0.4, 1],
    duration,
    ease: 'outQuad',
  });
}

/**
 * Morph SVG path between states
 */
export function animateSvgMorph(
  targetElement: SVGPathElement | null,
  dPath: string,
  duration = 400
) {
  if (!targetElement) return;
  return animate(targetElement, {
    d: dPath,
    duration,
    ease: 'outCubic',
  });
}
