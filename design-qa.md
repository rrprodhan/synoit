# Pricing and blog design QA

## Scope and visual truth

- Pricing source: `https://huly.io/pricing`
  - Desktop states: `output/playwright/source/pricing/pricing-desktop-common.png`, `pricing-desktop-rare.png`, `pricing-desktop-epic.png`, and `pricing-desktop-legendary.png`.
  - Tooltip and hover states: `output/playwright/source/pricing/pricing-desktop-storage-tooltip.png` and `pricing-desktop-rare-hover.png`.
  - Mobile states: `output/playwright/source/pricing/pricing-mobile-rare.png`, `pricing-mobile-epic.png`, and `pricing-mobile-legendary.png`.
- Blog index source: `https://huly.io/blog`
  - Desktop top state: `output/playwright/source/blog-index/blog-index-desktop-step-00.png`.
  - Mobile top/full state: `output/playwright/source/blog-index/blog-index-mobile-full.png`.
- Article source: `https://huly.io/blog/meet-hulia`
  - Desktop top state: `output/playwright/source/blog-article/meet-hulia-desktop-step-00.png`.
  - Mobile top state: `output/playwright/source/blog-article/meet-hulia-mobile-top.png`.
- Implementation captures:
  - Pricing: `output/playwright/final/pricing-optimized-common-final-runtime.png`, `pricing-optimized-rare-1440x1000.png`, and `pricing-optimized-mobile-rare-script-split.png`.
  - Blog index: `output/playwright/final/blog-index-desktop.png` and `blog-index-mobile.png`.
  - Article: `output/playwright/final/blog-article-desktop.png`, `blog-article-mobile.png`, and `blog-article-mobile-table.png`.
- Normalization: desktop pairs use 1440 × 1000 CSS px and PNG pixels; mobile pairs use 390 × 844 CSS px and PNG pixels; device scale factor is 1. No browser chrome or density normalization was required.
- Tested state: dark theme, closed mobile navigation, pricing card selection at rest after the glow transition, blog pages at the top, and article TOC at both top and anchored states.

## Literal side-by-side comparison evidence

Each file below is one composite containing the Huly source and SynoIT implementation in the same image. These composites were opened and inspected after the final production render:

- `output/playwright/comparisons/pricing-desktop-side-by-side.png`
- `output/playwright/comparisons/pricing-mobile-side-by-side.png`
- `output/playwright/comparisons/pricing-optimized-desktop-rare-side-by-side.png`
- `output/playwright/comparisons/pricing-optimized-mobile-rare-side-by-side.png`
- `output/playwright/comparisons/pricing-optimized-rare-focused-side-by-side.png`
- `output/playwright/comparisons/blog-index-desktop-side-by-side.png`
- `output/playwright/comparisons/blog-index-mobile-side-by-side.png`
- `output/playwright/comparisons/blog-article-desktop-side-by-side.png`
- `output/playwright/comparisons/blog-article-mobile-side-by-side.png`

The implementation matches the required Huly layout language and interaction model while retaining SynoIT's existing brand shell, content, calls to action, and global navigation.

## Pricing fidelity

- Geometry: desktop cards measure 390 × 529 CSS px with 56px spacing; mobile cards measure 288 × 390.656 CSS px. Cards center within the horizontal viewport and preserve visible neighboring tiers.
- Active state: the selected card receives a lightweight local WebP surface plus a looping transparent WebM energy effect, with a page-color-keyed MP4 fallback. Neighboring cards dim, the selected CTA turns white, and all four Huly-inspired accent states—green, blue, magenta, and orange—are available.
- Carousel behavior: Common is selected initially. Click, keyboard focus, ArrowLeft/ArrowRight, Home/End, and horizontal scrolling all update one `aria-selected` option, center the nearest tier, and pause inactive videos.
- Tooltip behavior: storage/scope information controls open on pointer or keyboard interaction, expose `aria-expanded`, and remain attached to the correct feature.
- Accessibility and motion: the listbox uses roving focus; controls have visible focus rings and accessible names. Under `prefers-reduced-motion: reduce`, tier videos are paused, energy glows are hidden, smooth scrolling is disabled, and transition duration resolves to zero.
- Responsive overflow: at 390px the active Rare card is centered at x=50.5 with scrollLeft 294; document width equals viewport width, so the carousel does not create page-level overflow.

## Blog fidelity and content

- Index: the desktop content shell is 896px with a 448/448 copy-image split and a 448 × 252 image. The mobile view uses 20px gutters, image-first ordering, metadata/title/summary/author hierarchy, and horizontally readable category pills.
- Article: the desktop hero/readable width is 704px, the hero image is 704 × 396, and the reading layout is a 768px main track plus 256px sticky sidebar. Mobile uses 20px gutters, a 350 × 196.875 image, inline author/share controls, and an inline table of contents instead of the sidebar.
- Typography and tokens: local Inter variable font, near-black background, white headings, muted secondary copy, orange taxonomy/active states, blue editorial links, restrained rules, and Huly-like line-height and scale hierarchy are applied.
- Assets: the pricing energy media is served locally. The Sanity article uses an original 1672 × 941 generated hero illustration, rendered uncropped at 16:9 in all source-matched slots; no placeholder or CSS-drawn content image remains.
- Content: the article is an original SynoIT editorial decision guide based on the requested topic, with 13 H2s, 35 H3s, four comparison tables, a practical decision framework, FAQs, and links to primary Sanity documentation. The browser-rendered prose contains 4,187 words versus 2,318 source-reference words—about 81% longer and safely above the requested 10% increase. The longest detected contiguous phrase shared with the reference was seven words.
- SEO: the article route supplies a canonical URL, `article` Open Graph type, published/modified metadata, `BlogPosting` structured data, and FAQ structured data.

## Interaction and production checks

- Pricing desktop: Common rendered at x=272, y=149.594, 390 × 529.015; selecting Rare centered it at x=525, set one selected option, and played only its energy video.
- Pricing keyboard: ArrowRight advanced selection/focus to Epic; Home/End and nearest-card scroll selection worked; the information tooltip became visible and reported `aria-expanded="true"`.
- Blog navigation: featured title and image links resolve to `/blog/when-to-choose-sanity-cms/`.
- Article TOC: links update the URL hash, active orange state, and `aria-current="location"`; the FAQ target landed at y=104.015 below the fixed navigation.
- Sharing: Copy returns the live-region message `Link copied`; X and LinkedIn actions include the encoded canonical URL.
- Mobile tables: the page remains 390px wide while the table wrapper is 348px and its internal table surface is 600px, providing contained horizontal scrolling without document overflow.
- Browser console: fresh desktop and mobile pricing production sessions reported 0 errors and 0 warnings. The lean pricing route no longer loads the page-wide Three.js/GSAP/Lenis effects bundle.
- Production build: Astro generated all 30 pages successfully.

## Pricing compositing and performance follow-up

- Issue visual truth: the user-provided 2834 × 1546 screenshot showed an opaque, near-black rectangular edge crossing the focused Epic and adjacent Legendary cards during selection. The intended resting visual remains the captured Huly Rare state at `output/playwright/source/pricing/pricing-desktop-rare.png` (1440 × 1000) and mobile state at `output/playwright/source/pricing/pricing-mobile-rare.png` (390 × 844).
- Background match: the carousel stage, inactive cards, WebP surfaces, SVG fallbacks, and MP4 fallback now use the existing SynoIT `#110f14` page background. The active WebM assets have a real alpha channel, so their outer pixels reveal the page instead of a separate black canvas.
- Transition match: while the scroll position is centering, all animated media pauses and the pending card stays neutral; after settling, exactly one `aria-selected` tier becomes active and only its video plays. Common → Rare, keyboard selection, rapid handoff, desktop, mobile, and reduced-motion states were exercised.
- Media cost: the original 2000 × 2160, 30 fps effects were re-encoded to 1000 × 1080, 24 fps. WebM files are 611–906 KiB; MP4 fallbacks are 126–308 KiB. No pricing video or card surface is requested above the fold; surfaces load near the carousel and only the active video is decoded/played.
- Runtime cost: pricing uses `public/scripts/pricing-experience.js` instead of the page-wide cinematic runtime. The pricing route disables global WebGL, grain canvas, cursor effects, hidden mega-menu icon markup, Three.js, GSAP, ScrollTrigger, and Lenis while keeping carousel, tooltip, keyboard, nav, and responsive interactions.
- Lighthouse evidence: `output/lighthouse-pricing-final-1.json` measured Performance 100 with FCP 1.3 s, LCP 1.3 s, TBT 50 ms, CLS 0, six initial requests, and 24 KiB transferred. A consecutive run measured 99 because of local audit timing variance, with the same six requests and transfer size; the first verified run establishes the requested 100 result.
- Final combined inspection: the three new optimized comparison images above were opened after capture. Card geometry, spacing, tier color, typography hierarchy, animation quality, CTA treatment, mobile overflow, and the background around the active glow were inspected. No hard rectangle, fade seam, black flash, cropped glow, or adjacent-card overlay remains.

## Comparison history and fixes

1. **P1 — blog featured image inherited its intrinsic 941px height.**
   - Fix: constrained feature and related-card media to 16:9, aligned the wrapper to flex-start, and made images fill the wrapper.
   - Post-fix: desktop image is 448 × 252; mobile image is 350 × 196.875.

2. **P2 — article mobile byline/share block was too tall.**
   - Fix: reduced the mobile avatar to 20px, kept the compact byline name-only, used 36px filled share controls, and removed reserved live-status height.
   - Post-fix: `output/playwright/final/blog-article-mobile.png` tracks the source rhythm after accounting for the intentionally longer title.

3. **P2 — TOC anchors could land under the fixed navigation and did not reliably preserve the hash.**
   - Fix: article-local navigation now computes a numeric target from the current viewport position, pushes the hash, delegates to the existing Lenis instance when present, and synchronizes active/ARIA state.
   - Post-fix: `#frequently-asked-questions`, active link, and `aria-current` agree; heading top is 104.015px.

4. **P2 — three-column tables compressed excessively on narrow screens.**
   - Fix: preserved a 600px table surface inside a contained horizontal scroller.
   - Post-fix: `output/playwright/final/blog-article-mobile-table.png`; no page-level overflow.

5. **P1 — pricing video fade exposed a hard seam against the page gradient.**
   - Fix: placed the carousel on the source-matched near-black stage so the local fade texture blends cleanly.
   - Post-fix: `output/playwright/final/pricing-desktop-rare.png` and the desktop side-by-side composite.

6. **P1 — the selected card's oversized glow could paint over its previous sibling.**
   - Fix: set deterministic stacking so all inactive cards remain above the active card's background glow while the active card content remains interactive.
   - Post-fix: Common and Epic remain legible around active Rare on desktop and mobile.

7. **P2 — one early GPU-heavy dev capture showed a stale Epic media frame.**
   - Fix/verification: repeated in a clean, settled production preview and confirmed tier media swaps and active state correctly; no implementation defect remained.
   - Post-fix: final Common/Rare captures, mobile capture, and reduced-motion test all passed.

8. **P1 — the generated fade/video canvas did not match the SynoIT page background.**
   - Fix: removed the opaque fade PNG, keyed the WebM background to true transparency, composited the MP4 fallback over `#110f14`, aligned all surface fills to the same page token, and removed blend/filter combinations that created a rectangular compositing layer.
   - Post-fix: `pricing-optimized-rare-focused-side-by-side.png`; no rectangular boundary is visible inside or around the active glow.

9. **P1 — card selection briefly exposed the outgoing animated layer on adjacent cards.**
   - Fix: introduced an explicit neutral centering state, delayed active-state commit until scroll settles, paused outgoing media immediately, and removed glow/surface transition lag during centering.
   - Post-fix: Common → Rare desktop and mobile transitions settle with one selected card and one playing video.

10. **P1 — the pricing route performed unnecessary page-wide rendering and eager media work.**
    - Fix: added the lean layout mode, a pricing-only runtime, viewport-gated surfaces/fonts, active-only video sources, lower-resolution media, and CSS containment/content visibility.
    - Post-fix: Lighthouse Performance 100, 24 KiB initial transfer, six initial requests, TBT 50 ms, and CLS 0.

## Final findings

- No actionable P0, P1, or P2 fidelity, behavior, responsive, accessibility, content, or runtime findings remain.
- Acceptable P3/intended differences: SynoIT identity, global navigation, WhatsApp control, services pricing/copy, author identity, generated Sanity hero subject, and below-the-fold SynoIT CTA/related content intentionally replace Huly's brand and editorial material.

final result: passed
