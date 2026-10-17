# Focused motion and account refinement

Preserve the accepted photographic design. Main priorities: continuous page transitions, a more animated Models page, and account pages that belong to the same experience.

## Reference review

- https://palominoprod.com/en — revisited in the browser: wide, staggered display words over full-frame film; compact navigation. Its pale route handoff was visible when following Work. Adopt the sense of photographic continuity and generous type; retain Math Intellect's warmer palette and original imagery.
- https://landonorris.com/ — official home and On-track/Off-track pages revisited through search; retain prior findings on oversized typography and interaction. No new claim about a fully rendered WebGL scene.
- https://lenis.dev/ and https://github.com/darkroomengineering/lenis — retain one existing animation-frame driver and native touch. Do not add a competing smooth-scroll loop.

## Implementation

- Move the transition provider above both marketing and account routes. Its DOM now survives route-shell changes. Account modules are eager-loaded to avoid replacing the entire route experience with a lazy loading fallback.
- A curved photographic cover, individually revealed words, and an upward aperture reveal replace the two-color split curtain. Keep its scene mounted across both phases, preserve reduced-motion bypass, modified links, history cancellation, and rapid-navigation handling.
- Models: clipped image expansions tied to scroll, staggered content, individually revealed input/output rows, sticky desktop photography, animated opening and model navigation interactions.
- Method: opening line choreography, expanding banner, independently moving headings. Workbench: sequential control/result panel entrances without animating numerical values or obscuring live calculation behavior.
- Account pages: full-height photographic territory, oversized editorial headings, open forms, animated entrances, warm paper and aubergine controls. Preserve the existing submission handlers, validation, autocomplete and error focus. Remove fictitious placeholder names and emails. Add visible signup password guidance and matching native minimum length.
- Home hero: gentle focal movement through the established expanding frame; keep the accepted composition and all photographs.

## Validation

Lint, production build, and marketing regression suite run. Added regression coverage for transition DOM continuity across marketing/account shell changes and history interruption during reveal. Preview review completed at 1363 × 936 desktop and 390px mobile. The full registration form is readable and contained; both account routes retain their labelled fields. Keyboard Tab advances from email to password. Models chapter navigation reaches its anchor, sticky photography and scroll-driven clip progression are active, and inspected pages have no horizontal overflow or broken loaded photographs. Corrected the glider crop and increased responsive source selection for tall image frames. The transition scene remains mounted and occupies the full viewport after a route-shell change. Authentication submission was not exercised with real credentials.
