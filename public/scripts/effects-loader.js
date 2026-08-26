/* One visual runtime at every normal viewport. Mobile and desktop both receive
   the same Three.js shader/net choreography; Canvas2D is only the resilience
   fallback for reduced motion, data-saving, or WebGL/library failures. */
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

  function adaptive() {
    // Touch layouts use autonomous net motion, so they do not need the pointer
    // bus or its document-wide input listeners.
    return load('/scripts/net-field.js').catch(() => {})
      .then(() => load('/scripts/pricing-experience.js'));
  }

  function boot() {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = Boolean(navigator.connection && navigator.connection.saveData === true);

    if (reduced || saveData) {
      adaptive();
      return;
    }

    // The pointer bus must exist before the WebGL renderer reads it.
    const cursor = load('/scripts/site-cursor.js').catch(() => {});
    const desktopScroller = innerWidth >= 900 && matchMedia('(pointer: fine)').matches;
    // Mobile runs the exact cinematic shader but uses the lightweight native
    // shell. GSAP, ScrollTrigger, and Lenis are desktop content/scroll concerns,
    // not requirements of the WebGL field itself.
    if (!desktopScroller) {
      document.body.dataset.netOnly = 'true';
      const workerNet = 'OffscreenCanvas' in window
        && 'Worker' in window
        && HTMLCanvasElement.prototype.transferControlToOffscreen;
      if (workerNet) document.body.dataset.offscreenNet = 'true';
      const mobileThree = workerNet
        ? Promise.resolve()
        : import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js')
          .then(module => { window.THREE = module; });
      Promise.all([cursor, mobileThree])
        .then(() => load('/scripts/home-experience.js'))
        .catch(() => adaptive());
      return;
    }

    const three = import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js')
      .then(module => { window.THREE = module; });

    /* Every dependency starts downloading at once rather than in a five-deep
       request chain; ordering is guaranteed by async=false, and home-experience is
       appended last so THREE and the GSAP globals are in place when it runs. */
    const libs = [
      'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js',
      'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js',
      'https://cdn.jsdelivr.net/npm/lenis@1.3.11/dist/lenis.min.js',
    ].map(load);

    Promise.all([cursor, three].concat(libs))
      .then(() => load('/scripts/home-experience.js'))
      .catch(() => adaptive());
  }

  // Protect the first hero paint from continuous canvas startup. Two frames are
  // short enough to be imperceptible while allowing FCP/LCP to land first.
  requestAnimationFrame(() => requestAnimationFrame(boot));
})();
