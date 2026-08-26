/* Canvas2D background net — the mobile/fallback renderer for the same breathing
   lat/long lattice the desktop WebGL orb draws. It reuses the shader's exact
   displacement function and palette so the two read as one design, but costs a
   handful of draw calls per frame instead of a WebGL context and 170KB of Three.js.

   Draws into <canvas id="gl">. Exposes window.__netField so the homepage's
   existing orbTo() choreography can drive it identically. */
(() => {
  'use strict';

  const canvas = document.getElementById('gl');
  if (!canvas || window.__netField) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const connection = navigator.connection;
  const saveData = Boolean(connection && connection.saveData);
  const narrow = innerWidth <= 480;
  const fine = matchMedia('(pointer: fine)').matches;

  /* ── geometry: the same lat/long wireframe as home-experience.js ── */
  const SEG_LON = narrow ? 20 : 28;
  const SEG_LAT = narrow ? 12 : 18;
  const NV = (SEG_LAT + 1) * SEG_LON;

  const dirX = new Float32Array(NV);
  const dirY = new Float32Array(NV);
  const dirZ = new Float32Array(NV);
  const band = new Uint8Array(NV);
  const projX = new Float32Array(NV);
  const projY = new Float32Array(NV);
  const projS = new Float32Array(NV);

  for (let la = 0; la <= SEG_LAT; la++) {
    const phi = (la / SEG_LAT) * Math.PI;
    const sp = Math.sin(phi);
    const cp = Math.cos(phi);
    /* vMix in the shader is n0.y * .5 + .5, so the top of the sphere leans blue,
       the equator violet and the base magenta. Banding by latitude lets every
       segment of one colour be stroked in a single pass. */
    const mix = cp * 0.5 + 0.5;
    const tone = mix > 0.66 ? 0 : mix > 0.33 ? 1 : 2;
    for (let lo = 0; lo < SEG_LON; lo++) {
      const theta = (lo / SEG_LON) * Math.PI * 2;
      const i = la * SEG_LON + lo;
      dirX[i] = sp * Math.cos(theta);
      dirY[i] = cp;
      dirZ[i] = sp * Math.sin(theta);
      band[i] = tone;
    }
  }

  const segA = [[], [], []];
  const segB = [[], [], []];
  for (let la = 1; la < SEG_LAT; la++) {
    for (let lo = 0; lo < SEG_LON; lo++) {
      const a = la * SEG_LON + lo;
      const b = la * SEG_LON + ((lo + 1) % SEG_LON);
      segA[band[a]].push(a);
      segB[band[a]].push(b);
    }
  }
  for (let lo = 0; lo < SEG_LON; lo++) {
    for (let la = 0; la < SEG_LAT; la++) {
      const a = la * SEG_LON + lo;
      const b = (la + 1) * SEG_LON + lo;
      segA[band[a]].push(a);
      segB[band[a]].push(b);
    }
  }
  const strands = [0, 1, 2].map(tone => ({
    a: Int32Array.from(segA[tone]),
    b: Int32Array.from(segB[tone]),
  }));

  /* Colours lifted from the shader uniforms: uColC / uColA / uColB. */
  const TONES = ['90, 123, 255', '143, 107, 255', '226, 58, 158'];

  const NODE_CAP = narrow ? 56 : 120;
  const nodeStep = Math.max(1, Math.ceil(NV / NODE_CAP));
  const nodes = [];
  for (let i = 0; i < NV; i += nodeStep) nodes.push(i);

  /* ── starfield: three twinkle buckets so the whole field is three fills ── */
  const STARS = narrow ? 130 : 240;
  const starX = new Float32Array(STARS);
  const starY = new Float32Array(STARS);
  const starDepth = new Float32Array(STARS);
  const starPhase = new Float32Array(STARS);
  for (let i = 0; i < STARS; i++) {
    starX[i] = Math.random();
    starY[i] = Math.random();
    starDepth[i] = 0.25 + Math.random() * 0.75;
    starPhase[i] = Math.random() * Math.PI * 2;
  }

  /* ── pre-baked sprites: a node glow and one central bloom ── */
  function sprite(size, stops) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    stops.forEach(([at, color]) => grad.addColorStop(at, color));
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
    return c;
  }
  const nodeSprite = sprite(48, [
    [0, 'rgba(255,253,255,0.95)'],
    [0.22, 'rgba(196,180,255,0.55)'],
    [0.55, 'rgba(143,107,255,0.16)'],
    [1, 'rgba(143,107,255,0)'],
  ]);
  const bloomSprite = sprite(256, [
    [0, 'rgba(154,138,251,0.20)'],
    [0.42, 'rgba(124,92,240,0.09)'],
    [1, 'rgba(124,92,240,0)'],
  ]);

  /* ── state: mirrors orbState so the homepage choreography transfers verbatim ── */
  const target = { x: 0, y: 0, scale: 1, amp: 0.35, alpha: 0.55 };
  const state = { x: 0, y: 0, scale: 1, amp: 0.35, alpha: 0.55 };
  let pulse = 1;

  const pointer = fine ? window.__synoitPointer : null;
  let energy = 0;
  let prevDist = pointer ? pointer.dist : 0;
  let parX = 0;
  let parY = 0;
  let bulgeX = 0;
  let bulgeY = 0;
  let bulgeZ = 1;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let running = false;
  let frame = 0;
  let last = 0;
  let started = 0;
  function resize() {
    width = innerWidth;
    height = innerHeight;
    dpr = saveData ? 1 : Math.min(devicePixelRatio || 1, 1.25);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function smoothstep(edge0, edge1, x) {
    const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }

  function draw(now) {
    const t = (now - started) / 1000;

    /* Pointer energy comes from the shared bus' travelled-distance counter, so
       nothing here has to mutate state another consumer also reads. */
    if (pointer) {
      const moved = pointer.dist - prevDist;
      prevDist = pointer.dist;
      energy += (Math.min(1.2, moved / 14) - energy) * 0.14;
    }
    const strength = Math.min(1, 0.28 + energy);

    let aimX;
    let aimY;
    if (fine && pointer) {
      aimX = pointer.nx;
      aimY = pointer.ny;
    } else {
      /* Touch layouts run a calm autonomous highlight. This preserves the exact
         field design without coupling every frame to touch or scroll input. */
      aimX = Math.sin(t * 0.23) * 0.72;
      aimY = Math.cos(t * 0.17) * 0.62;
    }
    parX += (aimX * 26 - parX) * 0.05;
    parY += (aimY * -16 - parY) * 0.05;

    /* Unproject the aim into a direction on the sphere, then take it into the
       lattice's local space (a single Y rotation, so the inverse is -angle). */
    const spin = t * 0.09;
    let tx = aimX * 1.15;
    let ty = -aimY * 0.9;
    const planar = tx * tx + ty * ty;
    if (planar > 0.98) {
      const k = Math.sqrt(0.98 / planar);
      tx *= k;
      ty *= k;
    }
    const tz = Math.sqrt(Math.max(0.02, 1 - tx * tx - ty * ty));
    const cs = Math.cos(-spin);
    const sn = Math.sin(-spin);
    bulgeX += (tx * cs + tz * sn - bulgeX) * 0.05;
    bulgeY += (ty - bulgeY) * 0.05;
    bulgeZ += (-tx * sn + tz * cs - bulgeZ) * 0.05;

    /* Voice-like cadence, matching the shader's uPulse easing. */
    const voice = 0.8 + 0.2 * (Math.abs(Math.sin(t * 1.4)) * 0.6 + Math.sin(t * 2.4) * Math.sin(t * 0.55) * 0.4);
    pulse += (voice - pulse) * 0.08;
    state.x += (target.x - state.x) * 0.028;
    state.y += (target.y - state.y) * 0.028;
    state.scale += (target.scale - state.scale) * 0.028;
    state.amp += (target.amp - state.amp) * 0.03;
    state.alpha += (target.alpha - state.alpha) * 0.03;

    const radius = Math.min(width, height) * 0.42 * state.scale;
    const focal = radius * 3.2;
    const cx = width / 2 + state.x * radius * 0.42 + parX;
    const cy = height / 2 + state.y * radius * 0.42 + parY;

    const tt = t * 0.16;
    const swell = pulse * (0.6 + state.amp);
    const spinCos = Math.cos(spin);
    const spinSin = Math.sin(spin);

    for (let i = 0; i < NV; i++) {
      const x = dirX[i];
      const y = dirY[i];
      const z = dirZ[i];
      /* The identical displacement stack the vertex shader runs. */
      const d1 = Math.sin(x * 1.7 + tt * 1.3) * Math.sin(y * 2.1 - tt);
      const d2 = Math.sin(y * 3.1 + tt * 0.8) * Math.sin(z * 2.6 + tt * 1.1) * 0.6;
      const d3 = Math.sin(z * 4.6 - tt * 1.5) * Math.sin(x * 3.8 + tt * 0.7) * 0.35;
      const body = (d1 + d2 + d3) * 0.42;
      const grain = Math.sin(x * 5.2 - t * 0.6) * Math.sin(z * 4.4 + t * 0.5) * 0.12;
      let disp = (body + grain) * swell;
      const md = Math.hypot(x - bulgeX, y - bulgeY, z - bulgeZ);
      disp += smoothstep(0.78, 0, md) * strength * 0.3;

      const r = 1 + disp;
      const px = x * r;
      const py = y * r;
      const pz = z * r;
      const rz = px * spinSin + pz * spinCos;
      const persp = focal / Math.max(focal * 0.25, focal - rz * radius);
      projX[i] = cx + (px * spinCos - pz * spinSin) * radius * persp;
      projY[i] = cy - py * radius * persp;
      projS[i] = persp;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    /* Additive compositing stands in for THREE.AdditiveBlending. */
    ctx.globalCompositeOperation = 'lighter';

    ctx.drawImage(bloomSprite, cx - radius * 1.5, cy - radius * 1.5, radius * 3, radius * 3);

    /* Stars: three alpha buckets, one filled path each. */
    for (let bucket = 0; bucket < 3; bucket++) {
      const path = new Path2D();
      let used = false;
      for (let i = bucket; i < STARS; i += 3) {
        const twinkle = 0.5 + 0.5 * Math.sin(t * (0.35 + starDepth[i] * 1.4) + starPhase[i]);
        if (twinkle < 0.12) continue;
        const depth = starDepth[i];
        const sx = starX[i] * width - parX * depth * 0.7;
        const sy = starY[i] * height - parY * depth * 0.7;
        const size = 0.7 + depth * 1.5;
        path.rect(sx, sy, size, size);
        used = true;
      }
      if (!used) continue;
      ctx.fillStyle = `rgba(206,199,255,${(0.16 + bucket * 0.09) * state.alpha})`;
      ctx.fill(path);
    }

    /* The lattice: one stroked path per colour band. */
    ctx.lineWidth = narrow ? 0.9 : 1.05;
    ctx.lineCap = 'round';
    for (let tone = 0; tone < 3; tone++) {
      const strand = strands[tone];
      const path = new Path2D();
      for (let s = 0; s < strand.a.length; s++) {
        const a = strand.a[s];
        const b = strand.b[s];
        path.moveTo(projX[a], projY[a]);
        path.lineTo(projX[b], projY[b]);
      }
      ctx.strokeStyle = `rgba(${TONES[tone]},${0.19 * state.alpha})`;
      ctx.stroke(path);
    }

    /* Nodes: the pre-baked glow, scaled by depth so the field reads volumetric. */
    for (let n = 0; n < nodes.length; n++) {
      const i = nodes[n];
      const size = 5 + projS[i] * 7;
      ctx.globalAlpha = Math.min(1, Math.max(0, (projS[i] - 0.45) * 1.6)) * state.alpha * 1.5;
      ctx.drawImage(nodeSprite, projX[i] - size / 2, projY[i] - size / 2, size, size);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  /* Touch screens only need occasional lattice deformation because the field's
     motion is deliberately slow. Keeping those frames sparse preserves the
     complete drawing while leaving a genuine CPU-idle window for taps, scroll,
     and page startup on entry-level phones. */
  const budget = 1000 / (fine ? 30 : 5);

  function loop(now) {
    if (!running) return;
    frame = requestAnimationFrame(loop);
    if (document.hidden || now - last < budget) return;
    last = now;
    draw(now);
  }

  let resizeTimer = 0;
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      if (!running) draw(performance.now());
    }, 150);
  }, { passive: true });

  function start() {
    if (running) return;
    running = true;
    started = performance.now();
    last = 0;
    frame = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
  }

  window.__netField = {
    setState(next) {
      if (next) Object.assign(target, next);
    },
    start,
    stop,
  };

  resize();
  if (reduced) {
    /* Reduced motion still deserves the structure — it just holds still. */
    started = performance.now();
    Object.assign(state, target);
    draw(performance.now() + 2400);
  } else {
    start();
  }
})();
