/* Shared pointer bus + custom cursor renderer.
   One pointermove listener for the whole site: the WebGL orb and the canvas net
   read window.__synoitPointer instead of each registering their own handler, and
   the reticle is written at most once per layer per animation frame. */
(() => {
  'use strict';

  const fine = matchMedia('(pointer: fine)').matches;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* `dist` is a monotonic pixels-travelled accumulator. Consumers keep their own
     previous reading and derive per-frame speed from the delta, so no render loop
     has to mutate shared state just to make an energy value decay. */
  const pointer = window.__synoitPointer = {
    x: innerWidth / 2,
    y: innerHeight / 2,
    nx: 0,
    ny: 0,
    dist: 0,
    lastMove: 0,
    down: false,
    active: false,
    fine,
  };

  const cursor = document.getElementById('cursor');
  const ring = cursor && cursor.querySelector('.cursor-ring');
  const dot = cursor && cursor.querySelector('.cursor-dot');
  const draws = Boolean(ring && dot && fine && !reduced);

  let px = pointer.x;
  let py = pointer.y;
  let rx = pointer.x;
  let ry = pointer.y;
  let frame = 0;
  let live = false;

  /* The dot tracks 1:1 so pointing never feels laggy; the ring trails just enough
     to read as weight rather than delay. Once it has caught up the loop stops
     instead of idling at 60fps forever. */
  function render() {
    frame = 0;
    const tx = pointer.x;
    const ty = pointer.y;
    dot.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    const dx = tx - rx;
    const dy = ty - ry;
    if (Math.abs(dx) < 0.15 && Math.abs(dy) < 0.15) {
      rx = tx;
      ry = ty;
    } else {
      rx += dx * 0.22;
      ry += dy * 0.22;
      frame = requestAnimationFrame(render);
    }
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
  }

  /* Activation waits for the first real move: hiding the native cursor any
     earlier would leave a moment with no pointer at all, and the reticle would
     fade in at the middle of the screen. */
  function activate() {
    if (live) return;
    live = true;
    rx = pointer.x;
    ry = pointer.y;
    document.body.classList.add('has-custom-cursor');
    render();
    cursor.classList.add('is-live');
  }

  addEventListener('pointermove', event => {
    const x = event.clientX;
    const y = event.clientY;
    pointer.dist += Math.hypot(x - px, y - py);
    px = x;
    py = y;
    pointer.x = x;
    pointer.y = y;
    pointer.nx = (x / innerWidth - 0.5) * 2;
    pointer.ny = (y / innerHeight - 0.5) * 2;
    pointer.lastMove = event.timeStamp;
    pointer.active = true;
    if (!draws) return;
    if (!live) {
      activate();
      return;
    }
    // a class read costs nothing; re-asserting every move would not
    if (cursor.classList.contains('is-out')) {
      cursor.classList.remove('is-out');
      document.body.classList.add('has-custom-cursor');
    }
    if (!frame) frame = requestAnimationFrame(render);
  }, { passive: true });

  addEventListener('pointerdown', () => { pointer.down = true; }, { passive: true });
  addEventListener('pointerup', () => { pointer.down = false; }, { passive: true });
  addEventListener('pointercancel', () => { pointer.down = false; }, { passive: true });

  if (!draws) return;

  const HOVERABLE = 'a, button, summary, label, input, select, textarea, [role="button"], .plan, .lang-btn, .step-item';
  let hovered = null;
  document.addEventListener('pointerover', event => {
    const target = event.target;
    const hit = target && target.closest ? target.closest(HOVERABLE) : null;
    if (hit === hovered) return;
    hovered = hit;
    cursor.classList.toggle('is-hover', Boolean(hit));
  }, { passive: true });

  document.addEventListener('pointerdown', () => cursor.classList.add('is-press'), { passive: true });
  document.addEventListener('pointerup', () => cursor.classList.remove('is-press'), { passive: true });
  document.addEventListener('pointercancel', () => cursor.classList.remove('is-press'), { passive: true });

  /* Leaving the document should retire the reticle rather than park it at an edge. */
  document.addEventListener('pointerleave', () => cursor.classList.add('is-out'), { passive: true });
  document.addEventListener('pointerenter', () => cursor.classList.remove('is-out'), { passive: true });
  addEventListener('blur', () => cursor.classList.add('is-out'));

  /* A hybrid laptop that gets touched should hand the native affordances back. */
  addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch') return;
    cursor.classList.add('is-out');
    document.body.classList.remove('has-custom-cursor');
  }, { passive: true });
})();
