/* Mobile WebGL net bootstrap.
   Three.js and all rendering live in the worker, keeping the desktop cinematic
   bundle and continuous canvas work off the mobile main thread. */
(() => {
  'use strict';

  const canvas = document.getElementById('gl');
  if (!canvas || window.__netField || !canvas.transferControlToOffscreen) return;

  const worker = new Worker('/scripts/net-worker.js', { type: 'module' });
  const offscreen = canvas.transferControlToOffscreen();
  const size = () => ({
    width: innerWidth,
    height: innerHeight,
    dpr: Math.min(devicePixelRatio || 1, 1),
  });

  worker.postMessage({ type: 'init', canvas: offscreen, ...size(), touch: true }, [offscreen]);

  let resizeTimer = 0;
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => worker.postMessage({ type: 'resize', ...size() }), 120);
  }, { passive: true });

  // Touch and pen input drive the same highlight and press wave as a desktop
  // pointer. With no input, the worker continues its autonomous breathing spin.
  let pointerFrame = 0;
  let pointerX = innerWidth / 2;
  let pointerY = innerHeight / 2;
  addEventListener('pointermove', event => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0;
      worker.postMessage({ type: 'pointer', x: pointerX, y: pointerY });
    });
  }, { passive: true });
  addEventListener('pointerdown', event => {
    worker.postMessage({ type: 'press', x: event.clientX, y: event.clientY });
  }, { passive: true });

  window.__netField = {
    setState(next) {
      if (next) worker.postMessage({ type: 'state', state: next });
    },
    start() { worker.postMessage({ type: 'visibility', visible: true }); },
    stop() { worker.postMessage({ type: 'visibility', visible: false }); },
  };

  document.addEventListener('visibilitychange', () => {
    worker.postMessage({ type: 'visibility', visible: !document.hidden });
  });
})();
