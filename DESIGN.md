# Design tokens

The public marketing experience is scoped to .mi-cinema in frontend/src/marketing/film/film.css. The authenticated application keeps its separate theme.

| Purpose | Token | Value |
| --- | --- | --- |
| Main canvas | --mi-paper | #F1F3EE |
| Raised surface | --mi-paper-light | #FBFCF7 |
| Deep forest surface | --mi-ink | #18231E |
| Secondary dark surface | --mi-ink-soft | #26352E |
| Main text | --mi-copy | #17221D |
| Secondary text | --mi-muted | #58645D |
| Current path | --chart-current | #587562 |
| Focused path and action | --mi-signal | #D96549 |
| Baseline path | --chart-baseline | #A8B0A9 |

Typography retains the locally bundled Syne variable display face, Hanken Grotesk reading face, and IBM Plex Mono for parameters. The public experience uses local optimized photography as editorial context, never as simulation output. The wider-screen model gallery is controlled by vertical scrolling; small screens use an unpinned vertical sequence. Reduced-motion users receive the full content without scroll choreography.
