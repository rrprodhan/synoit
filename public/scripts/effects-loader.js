/* Pick the runtime that can stay smooth on this device.
   The shared pointer bus loads everywhere, and anything that cannot run the
   cinematic WebGL engine gets the Canvas2D net instead — so the background
   structure is present on every page at every viewport. */
(() => {
  'use strict';

  function load(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      // Dynamically inserted scripts run in insertion order with async off, so
      // they can all download in parallel and still execute in dependency order.
      script.async = false;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  // The pointer bus must exist before any renderer reads window.__synoitPointer.
  const cursor = load('/scripts/site-cursor.js').catch(() => {});

  function adaptive() {
    return cursor
      .then(() => load('/scripts/net-field.js').catch(() => {}))
      .then(() => load('/scripts/pricing-experience.js'));
  }

  const capable = innerWidth > 900
    && matchMedia('(pointer: fine)').matches
    && !matchMedia('(prefers-reduced-motion: reduce)').matches
    && !(navigator.connection && navigator.connection.saveData === true);

  if (!capable) {
    adaptive();
    return;
  }

  /* Every dependency starts downloading at once rather than in a five-deep
     request chain; ordering is guaranteed by async=false, and home-experience is
     appended last so THREE and the GSAP globals are in place when it runs. */
  const libs = [
    'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js',
    'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js',
    'https://cdn.jsdelivr.net/npm/lenis@1.3.11/dist/lenis.min.js',
  ].map(load);
  const three = import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js')
    .then(module => { window.THREE = module; });

  Promise.all([cursor, three].concat(libs))
    .then(() => load('/scripts/home-experience.js'))
    .catch(() => adaptive());
})();
