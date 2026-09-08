# Steps visuals and production Lighthouse audit

8 September 2026. The shared `src/components/StepsPhone.astro` renders on all 56 generated pages containing a steps section. The homepage retains its four original SVG process illustrations. Other pages now show contextual stage titles and descriptions, a stage icon, a highlighted roadmap, and a stage counter. Existing step controllers select the active screen. No new JavaScript library or image download is required for the new dashboard screens.

## Design and validation

- Replaced placeholder bars on service, project, pricing, contact, template, dedicated-team, technology-detail and industry-detail pages.
- Removed obsolete global placeholder styling that would conflict with dashboard content; homepage images now fill the phone frame without placeholder padding.
- Increased the mobile phone width to fit the illustration more clearly.
- Checked desktop contact layout, mobile contact and landing-page layouts, and the longest service process copy (web design) at a 320px viewport. All four screens fit their containers without content overflow.
- Clicking the third landing-page process selector updates both the active description and phone heading to Visual Design.
- All 65 generated pages have one H1. Every steps section has one phone frame and the same number of screens as steps. Step button accessible names now include the visible two-digit number.
- `npm run build` and `git diff --check` pass.

## Performance change

The chat widget now uses the system font stack instead of requesting the 48 KB Inter font for its launcher. Pricing cards retain their existing Inter typography. The new screen graphics use CSS and inline vector paths; repeated descriptions are marked decorative because accessible text already exists in the adjacent process list.

## Measured scores

Lighthouse 13.0.2, clean headless Chrome, default mobile or desktop simulated throttling, production preview on port 4321. The sample covers ten routes and every changed page template. This is **not an individual Lighthouse audit of all 65 URLs**. A perfect lab score is not a guarantee of every device, browser session, hosting environment or future run.

| Route | Mode | Performance | Accessibility | Best practices | SEO | Report |
| --- | --- | --- | --- | --- | --- | --- |
| /contact/ | desktop | 100 | 100 | 100 | 100 | [JSON](contact-desktop.json) |
| /contact/ | mobile | 100 | 100 | 100 | 100 | [JSON](contact-mobile.json) |
| /dedicated-team/ | desktop | 100 | 100 | 100 | 100 | [JSON](dedicated-team-desktop.json) |
| /dedicated-team/ | mobile | 100 | 100 | 100 | 100 | [JSON](dedicated-team-mobile.json) |
| / | desktop | 100 | 100 | 100 | 100 | [JSON](home-desktop.json) |
| / | mobile | 100 | 100 | 100 | 100 | [JSON](home-mobile.json) |
| /industries/ai-consulting-services/ | desktop | 100 | 100 | 100 | 100 | [JSON](industries-ai-consulting-services-desktop.json) |
| /industries/ai-consulting-services/ | mobile | 100 | 100 | 100 | 100 | [JSON](industries-ai-consulting-services-mobile.json) |
| /pricing/ | desktop | 100 | 100 | 100 | 100 | [JSON](pricing-desktop.json) |
| /pricing/ | mobile | 100 | 100 | 100 | 100 | [JSON](pricing-mobile.json) |
| /projects/ | desktop | 100 | 100 | 100 | 100 | [JSON](projects-desktop.json) |
| /projects/ | mobile | 100 | 100 | 100 | 100 | [JSON](projects-mobile.json) |
| /services/ai-automation/ | desktop | 100 | 100 | 100 | 100 | [JSON](services-ai-automation-desktop.json) |
| /services/ai-automation/ | mobile | 100 | 100 | 100 | 100 | [JSON](services-ai-automation-mobile.json) |
| /services/landing-page-design/ | desktop | 100 | 100 | 100 | 100 | [JSON](services-landing-page-design-desktop.json) |
| /services/landing-page-design/ | mobile | 100 | 100 | 100 | 100 | [JSON](services-landing-page-design-mobile.json) |
| /technologies/astro/ | desktop | 100 | 100 | 100 | 100 | [JSON](technologies-astro-desktop.json) |
| /technologies/astro/ | mobile | 100 | 100 | 100 | 100 | [JSON](technologies-astro-mobile.json) |
| /templates/ | desktop | 100 | 100 | 100 | 100 | [JSON](templates-desktop.json) |
| /templates/ | mobile | 100 | 100 | 100 | 100 | [JSON](templates-mobile.json) |

## Supplied reports

The supplied port-4323 reports measured mobile Performance 99 (other categories 100), desktop Performance 100 and Best Practices 96. The desktop console exception names `window.__chromium_devtools_metrics_reporter`; that symbol is absent from application source. It did not reproduce in clean audits. Its exact external origin was not established; no stub, exception suppression or Lighthouse-specific behavior was added to the application.

## Reproduce

Use the production build, with any prior server on port 4321 stopped:

```sh
npm start
```

In another terminal, audit a route:

```sh
npx --yes lighthouse@13.0.2 http://localhost:4321/contact/ --output=json --output-path=contact-mobile.json --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage"
npx --yes lighthouse@13.0.2 http://localhost:4321/contact/ --preset=desktop --output=json --output-path=contact-desktop.json --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage"
```

The sandbox flags reflect this execution environment; use normal Chrome sandboxing on machines that support it. For manual DevTools checks, refresh the production URL in a fresh browser profile. If the metrics-reporter error persists there, investigate the DevTools/browser environment separately from site code.

Changes have not been deployed.
