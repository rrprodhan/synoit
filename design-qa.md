# Pricing, shared motion, and blog theme QA

## Scope and visual truth

- Shared-shell reference: `src/pages/index.astro` rendered at 1440 × 900 and 390 × 844 CSS px, device scale factor 1.
- Pricing-card reference: `https://huly.io/pricing`, plus the previously approved SynoIT pricing implementation and the user's black-transition regression screenshot.
- Blog references: `https://huly.io/blog` and `https://huly.io/blog/meet-hulia`, with the homepage shell and SynoIT theme as the current color/navigation truth.
- Homepage reference capture: `output/playwright/source/current-home-shell-1440x900.png`.
- Final captures:
  - `output/playwright/final/pricing-desktop-top.png`
  - `output/playwright/final/pricing-desktop-carousel-epic.png`
  - `output/playwright/final/pricing-mobile-top.png`
  - `output/playwright/final/pricing-mobile-carousel-rare.png`
  - `output/playwright/final/blog-desktop-top.png`
  - `output/playwright/final/blog-mobile-top.png`
  - `output/playwright/final/blog-article-mobile-top.png`

## Literal comparison evidence

These combined images place the 1440 × 900 homepage reference and final implementation in one visual input. Both were opened and inspected after the production build:

- `output/playwright/final/comparison-home-pricing-desktop.png`
- `output/playwright/final/comparison-home-blog-desktop.png`

The pricing hero now uses the same navigation geometry, WebGL net, grain/vignette treatment, purple-to-magenta type gradient, hero entrances, circuit drawing, scrolling choreography, and page background as the homepage. The pricing cards themselves retain the approved Huly-inspired dimensions, storm media, typography, dimmed neighbors, centering model, and tier colors.

The blog index and article retain their editorial layouts while sharing the homepage navigation markup, spacing, purple action treatment, near-black/purple page background, line colors, text colors, and brand tokens.

## Interaction and responsive checks

- Desktop pricing runtime reports `cinematic`; Three.js, GSAP, ScrollTrigger, and Lenis are loaded. The hero and below-fold page use the same animation engine as the homepage.
- Mobile full-effect pages report `adaptive`; WebGL/grain are replaced by lightweight equivalents while visible entrances, path drawing, pulses, marquee motion, navigation, and section reveals remain intact.
- Blog routes report `shell`; navigation, scroll progress, mobile menu, cursor, and anchor behavior remain available without loading the homepage's article-irrelevant 3D engine.
- Pricing Common → Rare at 390 × 844 selected exactly one option, played exactly one active video, and kept document overflow at zero. The final screenshot shows no black box, seam, or adjacent-card compositing flash.
- Pricing Common → Epic at 1440 × 900 selected Epic, centered scroll position at 639px, and played exactly one active video.
- Mobile navigation opens with `aria-expanded="true"` and exposes all 26 menu links.
- Homepage, pricing, blog index, and article all satisfy `document.documentElement.scrollWidth === innerWidth` at 390px.
- Fresh pricing and blog desktop/mobile sessions reported zero console errors and zero warnings after settled navigation.
- Blog responsive images select WebP sources; the article mobile hero selected the 1200px WebP candidate instead of the former 1.6MB PNG.

## Performance evidence

- Astro production build generated all 30 routes successfully.
- A clean Lighthouse mobile performance audit was run sequentially against every generated route in `dist`.
- Results: 29 routes scored 100; `/blog/when-to-choose-sanity-cms/` scored 99. Every route exceeded the requested score of 80, with zero measured Total Blocking Time in the final clean run.
- Representative desktop scores also exceeded 80: homepage 84, pricing 89, blog index 94, article 91, web-design service 84, and templates 87.
- Reports are stored under `output/lighthouse-all-final/` and ignored by Git alongside Playwright screenshots/reports.

## Performance implementation notes

- Desktop retains the complete cinematic runtime.
- Mobile/reduced-motion/save-data clients receive an adaptive runtime that avoids costly WebGL and continuous scroll-loop work while retaining the visual motion language.
- Pricing carousel listeners and media setup initialize just before the carousel reaches the viewport; inactive videos remain paused and their sources are not decoded.
- Global animation loops pause on hidden tabs, WebGL resolution/geometry is bounded, grain is throttled, and Lenis is limited to desktop precision-pointer contexts.
- Below-fold mobile sections use layout/paint containment and content visibility, while path measurements and media surfaces are deferred until their sections approach the viewport.
- Blog imagery uses 768px, 1200px, and 1672px responsive WebP variants; below-fold editorial sections use content visibility and intrinsic-size hints.

## Comparison history and fixes

1. The pricing page used the lean layout, so the rest of the page no longer matched the homepage motion. It now uses the shared full layout and desktop cinematic engine.
2. Re-enabling full effects initially restored unnecessary continuous work on mobile. Runtime selection is now adaptive by viewport, motion preference, and data-saver state.
3. Pricing media initialization happened before the carousel was needed. It is now near-viewport gated without changing card design or behavior.
4. Blog CSS overrode the shared background with a flat black theme and hid the homepage visual shell. Those overrides were removed and replaced with homepage tokens.
5. Blog routes generated missing-target warnings by loading the full homepage scene. A lightweight editorial shell now preserves the shared header and theme with no warnings.
6. The blog hero PNG transferred approximately 1.6MB. Responsive WebP variants now reduce the delivered candidate dramatically without changing its composition.
7. Persistent QA browser sessions initially contaminated local Lighthouse timings. They were closed, and the final all-route audit was rerun sequentially in a clean environment.

## Final findings

- No actionable P0, P1, or P2 visual, interaction, responsive, console, build, or performance findings remain.
- The intentional differences are page content: pricing and blog retain their requested designs, while their global shell, palette, and motion language now match the homepage.

final result: passed
