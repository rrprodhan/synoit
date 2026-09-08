# Homepage Lighthouse verification

8 September 2026. Lighthouse 13.0.2, clean headless Chrome, default simulated throttling. Audited the production Astro build at http://localhost:4321/, including the updated next-step card. No user-agent detection, disabled audits or reduced-motion override was used.

| Mode | Performance | Accessibility | Best practices | SEO | LCP | Blocking time | Layout shift |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Mobile | 100 | 100 | 100 | 100 | 1.7 s | 0 ms | 0 |
| Desktop | 100 | 100 | 100 | 100 | 0.5 s | 0 ms | 0 |

Latest reports: [mobile](home-mobile-4321.json) and [desktop](home-desktop-4321.json). Earlier port-4330 reports are retained for comparison.

Both latest reports have no run warnings, failed network requests or console errors. These are observed local lab results, not a guarantee of every future run or deployed performance.

## Why the supplied reports differed

The supplied reports target Astro's development server on port 4321. They include Vite's development client, unminified modules, a development WebSocket and approximately 2 seconds of document latency. Their sole best-practices failure references `window.__chromium_devtools_metrics_reporter`, with no application file in the stack. This error did not reproduce in either clean production audit. No error suppression or fake reporter was added to the site.

Production rendering already achieves the requested scores. Performance code and visual effects were therefore retained. The actual source change in this pass stacks the next-step label above its paragraph, removes the narrow 440px cap for this card, permits the label to wrap, and increases paragraph size and line spacing.

## Reproduce

Stop any existing server on port 4321, then run:

```sh
npm start
```

This builds the site and serves the production output at **http://localhost:4321/**. Refresh an existing browser tab before auditing. `npm run dev` runs the development server and is intended for editing, not production performance measurement. If you need both at once, run development on another port with `npm run dev -- --port 4320`.

In another terminal:

```sh
npx --yes lighthouse@13.0.2 http://localhost:4321/ --output=json --output-path=reports/lighthouse/home-mobile.json --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage" --quiet
npx --yes lighthouse@13.0.2 http://localhost:4321/ --preset=desktop --output=json --output-path=reports/lighthouse/home-desktop.json --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage" --quiet
```

The no-sandbox flag was needed for this audit environment; omit it on a normal machine that supports Chrome sandboxing. You can also audit the preview URL in a fresh Chrome profile through DevTools. Do not compare a dev-server score directly with a production score as if it were a code-only improvement.

Lighthouse's [official CLI documentation](https://github.com/GoogleChrome/lighthouse/blob/main/readme.md) describes report generation. [Chrome's performance tutorial](https://developer.chrome.com/docs/devtools/lighthouse/) also covers testing production resources.

The production build succeeds (65 pages). The next-step card was checked visually at desktop and mobile widths. No deployment was performed.
