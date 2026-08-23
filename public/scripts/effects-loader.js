/* Load the cinematic desktop engine only where it can stay smooth. */
(() => {
  'use strict';

  const lightweight = window.innerWidth < 900
    || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    || navigator.connection?.saveData === true;

  function load(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  if (lightweight) {
    load('/scripts/pricing-experience.js');
    return;
  }

  import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js')
    .then(module => { window.THREE = module; })
    .then(() => [
    'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js',
    'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js',
    'https://cdn.jsdelivr.net/npm/lenis@1.3.11/dist/lenis.min.js',
    '/scripts/home-experience.js',
    ].reduce((promise, src) => promise.then(() => load(src)), Promise.resolve()))
    .catch(() => load('/scripts/pricing-experience.js'));
})();
