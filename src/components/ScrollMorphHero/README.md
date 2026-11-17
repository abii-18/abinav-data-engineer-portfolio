# Technology scroll hero

Adapted from the user-supplied plain-CSS ScrollMorphHero component, referencing [Prashant Som’s Scroll Morph Hero](https://21st.dev/@prashantsom75/components/scroll-morph-hero).

The intro plays scatter (0–0.5 seconds), line (0.5–2.5 seconds), then circle. The section spans 120svh, limiting the pinned animation runway to roughly 20% of a viewport plus the header offset. Native page scrolling morphs the circle into the lower arc; there are no wheel or touch blockers. Early scrolling is excluded from the intro transition. Twenty named technology cards reuse local SVG assets. The existing portfolio colour variables support both themes.

Reduced-motion mode replaces the animated layout with a static wrapping toolkit. ResizeObserver fits the geometry to the visible stage; the shared reveal observer excludes this sticky section.

Validation: strict TypeScript and production Vite build; desktop Chrome circle and arc rendering. Mobile rendering has not been checked.
