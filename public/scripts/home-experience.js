/* SynoIT homepage — adapted from /js/main.js cinematic experience. */
(() => {
  'use strict';
  gsap.registerPlugin(ScrollTrigger);
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  /* ───────── split helpers ───────── */
  function splitChars(el) {
    // chars are grouped per word so lines can only wrap at word boundaries
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    const chars = [];
    words.forEach((word, wi) => {
      const w = document.createElement('span');
      w.className = 'word-w';
      for (const ch of word) {
        const s = document.createElement('span');
        s.className = 'char';
        s.textContent = ch;
        w.appendChild(s);
        chars.push(s);
      }
      el.appendChild(w);
      if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
    return chars;
  }
  function splitWords(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(' ');
    return el.querySelectorAll('.word');
  }

  /* ───────── pricing tier selector ───────── */
  document.querySelectorAll('[data-pricing-carousel]').forEach(carousel => {
    const viewport = carousel.querySelector('[data-pricing-viewport]');
    const cards = Array.from(carousel.querySelectorAll('[data-pricing-card]'));
    if (!viewport || !cards.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let activeIndex = Math.max(0, cards.findIndex(card => card.classList.contains('is-active')));
    let suppressScrollSelection = false;
    let scrollFrame = 0;
    let releaseTimer = 0;

    function optionFor(card) {
      return card.querySelector('[data-pricing-select]');
    }

    function closeTooltips(except) {
      carousel.querySelectorAll('.pricing-tier__info-wrap.is-open').forEach(wrap => {
        if (wrap === except) return;
        wrap.classList.remove('is-open');
        const trigger = wrap.querySelector('[data-pricing-tooltip-button]');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
    }

    function syncMedia() {
      cards.forEach((card, index) => {
        const video = card.querySelector('video');
        if (!video) return;
        if (index === activeIndex && !reducedMotion.matches) {
          const playback = video.play();
          if (playback && typeof playback.catch === 'function') playback.catch(() => {});
        } else {
          video.pause();
        }
      });
    }

    function nearestCardIndex() {
      // Huly keeps the first tier selected at the track's anchored start even
      // though its deliberately offset desktop composition favours card two.
      if (viewport.scrollLeft <= 64) return 0;
      const viewportRect = viewport.getBoundingClientRect();
      const viewportCenter = viewportRect.left + viewportRect.width / 2;
      let nearest = 0;
      let nearestDistance = Infinity;
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const distance = Math.abs(rect.left + rect.width / 2 - viewportCenter);
        if (distance < nearestDistance) {
          nearest = index;
          nearestDistance = distance;
        }
      });
      return nearest;
    }

    function centerCard(card) {
      const viewportRect = viewport.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const rawTarget = viewport.scrollLeft
        + cardRect.left - viewportRect.left
        - (viewportRect.width - cardRect.width) / 2;
      const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      const target = Math.min(maxScroll, Math.max(0, rawTarget));
      if (Math.abs(target - viewport.scrollLeft) < 1) return;

      suppressScrollSelection = true;
      window.clearTimeout(releaseTimer);
      viewport.scrollTo({
        left: target,
        behavior: reducedMotion.matches ? 'auto' : 'smooth',
      });
      releaseTimer = window.setTimeout(() => {
        suppressScrollSelection = false;
        setActive(nearestCardIndex());
      }, reducedMotion.matches ? 0 : 520);
    }

    function setActive(nextIndex, options = {}) {
      const index = Math.min(cards.length - 1, Math.max(0, nextIndex));
      activeIndex = index;
      cards.forEach((card, cardIndex) => {
        const selected = cardIndex === index;
        const option = optionFor(card);
        card.classList.toggle('is-active', selected);
        if (option) {
          option.setAttribute('aria-selected', selected ? 'true' : 'false');
          option.tabIndex = selected ? 0 : -1;
        }
      });
      syncMedia();
      if (options.scroll) centerCard(cards[index]);
      if (options.focus) {
        const option = optionFor(cards[index]);
        if (option) option.focus({ preventScroll: true });
      }
    }

    cards.forEach((card, index) => {
      const option = optionFor(card);
      if (option) {
        option.addEventListener('click', () => {
          closeTooltips();
          setActive(index, { scroll: true });
        });
        option.addEventListener('focus', () => {
          if (activeIndex !== index) setActive(index, { scroll: true });
        });
        option.addEventListener('keydown', event => {
          let next = null;
          if (event.key === 'ArrowLeft') next = Math.max(0, index - 1);
          if (event.key === 'ArrowRight') next = Math.min(cards.length - 1, index + 1);
          if (event.key === 'Home') next = 0;
          if (event.key === 'End') next = cards.length - 1;
          if (next === null) return;
          event.preventDefault();
          setActive(next, { scroll: true, focus: true });
        });
      }

      card.addEventListener('focusin', event => {
        if (event.target === option || activeIndex === index) return;
        setActive(index, { scroll: true });
      });
    });

    carousel.querySelectorAll('[data-pricing-tooltip-button]').forEach(trigger => {
      trigger.addEventListener('click', event => {
        event.stopPropagation();
        const wrap = trigger.closest('.pricing-tier__info-wrap');
        const willOpen = wrap && !wrap.classList.contains('is-open');
        closeTooltips(wrap);
        if (!wrap) return;
        wrap.classList.toggle('is-open', willOpen);
        trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    });

    viewport.addEventListener('scroll', () => {
      closeTooltips();
      if (suppressScrollSelection || scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        setActive(nearestCardIndex());
      });
    }, { passive: true });

    function releaseProgrammaticScroll() {
      suppressScrollSelection = false;
      window.clearTimeout(releaseTimer);
    }
    viewport.addEventListener('pointerdown', releaseProgrammaticScroll, { passive: true });
    viewport.addEventListener('wheel', releaseProgrammaticScroll, { passive: true });

    window.addEventListener('resize', () => {
      closeTooltips();
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        setActive(nearestCardIndex());
      });
    }, { passive: true });

    document.addEventListener('click', event => {
      if (!carousel.contains(event.target)) closeTooltips();
    });
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      closeTooltips();
    });

    const handleMotionChange = () => {
      syncMedia();
      if (reducedMotion.matches) suppressScrollSelection = false;
    };
    if (typeof reducedMotion.addEventListener === 'function') {
      reducedMotion.addEventListener('change', handleMotionChange);
    } else {
      reducedMotion.addListener(handleMotionChange);
    }

    setActive(activeIndex);
  });

  /* ───────── film grain ───────── */
  const grainCanvas = document.getElementById('grain');
  const gtx = grainCanvas.getContext('2d');
  function sizeGrain() {
    grainCanvas.width = window.innerWidth / 3;
    grainCanvas.height = window.innerHeight / 3;
  }
  sizeGrain();
  // pre-baked noise frames — regenerating random pixels every frame was a CPU hog
  const grainFrames = [];
  function bakeGrain() {
    grainFrames.length = 0;
    for (let f = 0; f < 6; f++) {
      const c = document.createElement('canvas');
      c.width = grainCanvas.width; c.height = grainCanvas.height;
      const x = c.getContext('2d');
      const d = x.createImageData(c.width, c.height);
      const b = new Uint32Array(d.data.buffer);
      for (let i = 0; i < b.length; i++) {
        const v = (Math.random() * 255) | 0;
        b[i] = (255 << 24) | (v << 16) | (v << 8) | v;
      }
      x.putImageData(d, 0, 0);
      grainFrames.push(c);
    }
  }
  bakeGrain();
  let grainTick = 0;
  (function grainLoop() {
    if (grainTick++ % 3 === 0 && grainFrames.length) {
      gtx.drawImage(grainFrames[(grainTick / 3 | 0) % grainFrames.length], 0, 0);
    }
    requestAnimationFrame(grainLoop);
  })();

  /* ───────── WebGL voice orb (ambient) ───────── */
  const glCanvas = document.getElementById('gl');
  const orbState = { x: 0, y: 0, scale: 1, amp: 0.35, alpha: 0.55 };

  function initGL() {
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: glCanvas, antialias: true, alpha: true });
    } catch (e) { glCanvas.style.display = 'none'; return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, .1, 100);
    camera.position.z = 7;

    // dense, structured fibonacci lattice — double the previous resolution
    const COUNT = innerWidth < 900 ? 5500 : 11000;
    const pos = new Float32Array(COUNT * 3);
    const rnd = new Float32Array(COUNT);
    const off = new Float32Array(COUNT); // stray particles floating off the surface
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      pos[i * 3] = Math.cos(th) * r;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(th) * r;
      rnd[i] = Math.random();
      off[i] = rnd[i] > .9 ? (rnd[i] - .9) / .1 * (.12 + Math.random() * .45) : 0;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aRnd', new THREE.BufferAttribute(rnd, 1));
    geo.setAttribute('aOff', new THREE.BufferAttribute(off, 1));

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uAmp: { value: .35 },
        uAlpha: { value: .55 },
        uPulse: { value: 1 },
        uColA: { value: new THREE.Color('#8F6BFF') },
        uColB: { value: new THREE.Color('#E23A9E') },
        uColC: { value: new THREE.Color('#3E6BFF') },
        uMouse: { value: new THREE.Vector3(0, 0, 1) },
        uMouseStr: { value: 0 },
        uClickDir: { value: new THREE.Vector3(0, 0, 1) },
        uClickT: { value: -100 },
      },
      vertexShader: `
        attribute float aRnd;
        attribute float aOff;
        uniform float uTime, uAmp, uPulse, uMouseStr, uClickT;
        uniform vec3 uMouse, uClickDir;
        varying float vMix, vRnd, vGlow, vRim, vStray;
        void main(){
          vec3 n0 = position;
          // free-form body: strong low-frequency lumps, slowly evolving
          float tt = uTime * .16;
          float d1 = sin(n0.x*1.7 + tt*1.3) * sin(n0.y*2.1 - tt);
          float d2 = sin(n0.y*3.1 + tt*.8)  * sin(n0.z*2.6 + tt*1.1) * .6;
          float d3 = sin(n0.z*4.6 - tt*1.5) * sin(n0.x*3.8 + tt*.7)  * .35;
          float body = (d1 + d2 + d3) * .42;
          // fine shimmer on the surface
          float fine = sin(n0.x*5.2 - uTime*.6) * sin(n0.z*4.4 + uTime*.5) * .12;
          float band = sin(n0.y*6.0 - uTime*.9) * .5 + .5;
          float disp = (body + fine) * uPulse * (0.6 + uAmp);
          // cursor magnetism — soft, trailing
          float md = distance(n0, uMouse);
          float mi = smoothstep(.78, .0, md) * uMouseStr;
          disp += mi * .3;
          // click shockwave
          float cd = acos(clamp(dot(n0, uClickDir), -1., 1.));
          float ct = uTime - uClickT;
          float ring = exp(-pow((cd - ct*2.0)*4.0, 2.)) * exp(-ct*1.2) * step(0., ct);
          disp += ring * .7;
          vec3 p = n0 * (1. + disp + aOff);
          vGlow = mi + ring;
          vStray = step(.001, aOff);
          vMix = clamp(n0.y*.5 + .5 + body*.3, 0., 1.);
          vRnd = aRnd;
          // silhouette rim (fresnel-style) for the glowing edge
          vec3 nv = normalize(normalMatrix * n0);
          vRim = pow(1. - abs(nv.z), 2.2);
          vec4 mv = modelViewMatrix * vec4(p, 1.);
          gl_Position = projectionMatrix * mv;
          float size = 1.15 + aRnd*.45 + band*.4 + vRim*1.1 + (mi + ring)*2.2;
          size *= mix(1., .6, vStray);
          gl_PointSize = size * (300. / -mv.z) * .02;
        }
      `,
      fragmentShader: `
        uniform vec3 uColA, uColB, uColC;
        uniform float uAlpha;
        varying float vMix, vRnd, vGlow, vRim, vStray;
        void main(){
          vec2 uv = gl_PointCoord - .5;
          float d = length(uv);
          if (d > .5) discard;
          float core = smoothstep(.12, .0, d);
          float halo = smoothstep(.4, .1, d);
          // pink at the bottom, violet through the middle, blue at the top
          vec3 col = mix(uColB, uColA, smoothstep(.05, .55, vMix));
          col = mix(col, uColC, smoothstep(.6, 1., vMix) * .85);
          col *= 1.2; // saturated pop under additive blending
          col += vRim * .38 + vGlow * .3;
          col = mix(col, vec3(1., .97, 1.), core * .38 + vGlow * .3);
          float a = (halo*.62 + core*.52) * uAlpha * (.68 + vRim*1.0 + vGlow*1.0);
          a *= mix(1., .45, vStray);
          gl_FragColor = vec4(col, a);
        }
      `,
    });

    const points = new THREE.Points(geo, mat);
    points.scale.setScalar(2.1);
    scene.add(points);

    // wireframe net: a lat/long grid deformed by the exact same displacement,
    // so the lines connect through the dots and move as one organism
    const SEG_LON = 64, SEG_LAT = 42;
    const lv = [];
    for (let la = 1; la < SEG_LAT; la++) {
      const phi = la / SEG_LAT * Math.PI, sp = Math.sin(phi), cp = Math.cos(phi);
      for (let lo = 0; lo < SEG_LON; lo++) {
        const t1 = lo / SEG_LON * Math.PI * 2, t2 = (lo + 1) / SEG_LON * Math.PI * 2;
        lv.push(sp * Math.cos(t1), cp, sp * Math.sin(t1), sp * Math.cos(t2), cp, sp * Math.sin(t2));
      }
    }
    for (let lo = 0; lo < SEG_LON; lo++) {
      const th = lo / SEG_LON * Math.PI * 2, ct = Math.cos(th), st = Math.sin(th);
      for (let la = 0; la < SEG_LAT; la++) {
        const p1 = la / SEG_LAT * Math.PI, p2 = (la + 1) / SEG_LAT * Math.PI;
        lv.push(Math.sin(p1) * ct, Math.cos(p1), Math.sin(p1) * st, Math.sin(p2) * ct, Math.cos(p2), Math.sin(p2) * st);
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lv), 3));
    const lineMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: mat.uniforms, // shared — one heartbeat for dots and lines
      vertexShader: `
        uniform float uTime, uAmp, uPulse, uMouseStr, uClickT;
        uniform vec3 uMouse, uClickDir;
        varying float vMix, vRim, vGlow;
        void main(){
          vec3 n0 = normalize(position);
          float tt = uTime * .16;
          float d1 = sin(n0.x*1.7 + tt*1.3) * sin(n0.y*2.1 - tt);
          float d2 = sin(n0.y*3.1 + tt*.8)  * sin(n0.z*2.6 + tt*1.1) * .6;
          float d3 = sin(n0.z*4.6 - tt*1.5) * sin(n0.x*3.8 + tt*.7)  * .35;
          float body = (d1 + d2 + d3) * .42;
          float fine = sin(n0.x*5.2 - uTime*.6) * sin(n0.z*4.4 + uTime*.5) * .12;
          float disp = (body + fine) * uPulse * (0.6 + uAmp);
          float md = distance(n0, uMouse);
          float mi = smoothstep(.78, .0, md) * uMouseStr;
          disp += mi * .3;
          float cd = acos(clamp(dot(n0, uClickDir), -1., 1.));
          float ct2 = uTime - uClickT;
          float ring = exp(-pow((cd - ct2*2.0)*4.0, 2.)) * exp(-ct2*1.2) * step(0., ct2);
          disp += ring * .7;
          vec3 p = n0 * (1. + disp);
          vGlow = mi + ring;
          vMix = clamp(n0.y*.5 + .5 + body*.3, 0., 1.);
          vec3 nv = normalize(normalMatrix * n0);
          vRim = pow(1. - abs(nv.z), 2.2);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
        }
      `,
      fragmentShader: `
        uniform vec3 uColA, uColB, uColC;
        uniform float uAlpha;
        varying float vMix, vRim, vGlow;
        void main(){
          vec3 col = mix(uColB, uColA, smoothstep(.05, .55, vMix));
          col = mix(col, uColC, smoothstep(.6, 1., vMix) * .85);
          col *= 1.2;
          col += vRim * .35 + vGlow * .3;
          float a = (.062 + vRim*.27 + vGlow*.33) * uAlpha;
          gl_FragColor = vec4(col, a);
        }
      `,
    });
    const net = new THREE.LineSegments(lineGeo, lineMat);
    points.add(net); // inherits rotation / scale / drift

    // deep space: a volumetric starfield behind the orb + a few dust specks in front,
    // so camera parallax reads as true depth
    const SCOUNT = innerWidth < 900 ? 700 : 1500;
    const FG = 70; // foreground dust
    const sPos = new Float32Array((SCOUNT + FG) * 3);
    const sRnd = new Float32Array(SCOUNT + FG);
    for (let i = 0; i < SCOUNT; i++) {
      sPos[i * 3]     = (Math.random() - .5) * 46;
      sPos[i * 3 + 1] = (Math.random() - .5) * 28;
      sPos[i * 3 + 2] = -3.5 - Math.pow(Math.random(), 1.4) * 26; // behind the orb
      sRnd[i] = Math.random();
    }
    for (let i = SCOUNT; i < SCOUNT + FG; i++) {
      sPos[i * 3]     = (Math.random() - .5) * 14;
      sPos[i * 3 + 1] = (Math.random() - .5) * 9;
      sPos[i * 3 + 2] = 3.2 + Math.random() * 1.6; // between camera and orb
      sRnd[i] = Math.random();
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    starGeo.setAttribute('aRnd', new THREE.BufferAttribute(sRnd, 1));
    const starMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uColA: { value: new THREE.Color('#B4A6FF') },
        uColB: { value: new THREE.Color('#E23A9E') },
      },
      vertexShader: `
        attribute float aRnd;
        uniform float uTime;
        varying float vA, vC;
        void main(){
          vec4 mv = modelViewMatrix * vec4(position, 1.);
          gl_Position = projectionMatrix * mv;
          // slow twinkle, each star on its own rhythm
          vA = .5 + .5 * sin(uTime * (.35 + aRnd*1.4) + aRnd*80.);
          vC = aRnd;
          gl_PointSize = (.8 + aRnd*1.7) * (300. / -mv.z) * .02;
        }
      `,
      fragmentShader: `
        uniform vec3 uColA, uColB;
        varying float vA, vC;
        void main(){
          vec2 uv = gl_PointCoord - .5;
          float d = length(uv);
          if (d > .5) discard;
          float a = smoothstep(.5, .06, d) * (.22 + vA*.3);
          vec3 col = mix(vec3(.88, .87, 1.), mix(uColA, uColB, step(.88, vC)), .4);
          gl_FragColor = vec4(col, a);
        }
      `,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);



    // pointer → direction on the orb (for magnetism + shockwaves)
    const mouse = { x: 0, y: 0, tx: 0, ty: 0, speed: 0 };
    const rayDir = new THREE.Vector3(0, 0, 1);
    const rayTarget = new THREE.Vector3(0, 0, 1);
    const tmpV = new THREE.Vector3();
    const tmpQ = new THREE.Quaternion();
    let lastPX = 0, lastPY = 0, lastPT = 0;
    function pointerToOrbDir(e) {
      // unproject the pointer into a world ray from the camera
      tmpV.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1, .5)
        .unproject(camera).sub(camera.position).normalize();
      // closest point of the ray to the orb center → direction on the sphere
      const oc = tmpV.clone().multiplyScalar(-camera.position.dot(tmpV)).add(camera.position);
      oc.sub(points.position);
      if (oc.lengthSq() < 1e-6) oc.set(0, 0, 1);
      return oc.normalize();
    }
    addEventListener('pointermove', e => {
      mouse.tx = (e.clientX / innerWidth - .5) * 2;
      mouse.ty = (e.clientY / innerHeight - .5) * 2;
      const now = performance.now();
      const dt = Math.max(16, now - lastPT);
      const dist = Math.hypot(e.clientX - lastPX, e.clientY - lastPY);
      mouse.speed = Math.min(1.2, mouse.speed + dist / dt * .18);
      lastPX = e.clientX; lastPY = e.clientY; lastPT = now;
      rayTarget.copy(pointerToOrbDir(e));
    });
    // click / tap → shockwave through the sphere
    addEventListener('pointerdown', e => {
      mat.uniforms.uClickDir.value.copy(
        pointerToOrbDir(e).applyQuaternion(tmpQ.copy(points.quaternion).invert())
      );
      mat.uniforms.uClickT.value = mat.uniforms.uTime.value;
      mouse.speed = Math.min(2.5, mouse.speed + 1.2);
    });

    addEventListener('resize', () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
      sizeGrain();
    });

    const clock = new THREE.Clock();
    (function tick() {
      const t = clock.getElapsedTime();
      mat.uniforms.uTime.value = t;
      mat.uniforms.uAmp.value += (orbState.amp - mat.uniforms.uAmp.value) * .03;
      mat.uniforms.uAlpha.value += (orbState.alpha - mat.uniforms.uAlpha.value) * .03;
      // voice-like cadence: irregular organic pulse, like the orb is speaking
      const voice = .8 + .2 * (Math.abs(Math.sin(t * 1.4)) * .6 + Math.sin(t * 2.4) * Math.sin(t * .55) * .4);
      mat.uniforms.uPulse.value += (voice - mat.uniforms.uPulse.value) * .08;
      // cursor presence: base glow when hovering, boosted by pointer speed, decays smoothly
      mouse.speed *= .965;
      const strTarget = Math.min(1.0, .28 + mouse.speed);
      mat.uniforms.uMouseStr.value += (strTarget - mat.uniforms.uMouseStr.value) * .035;
      rayDir.lerp(rayTarget, .045).normalize(); // the glow trails the cursor, never snaps
      // pointer direction into the orb's rotating local space
      mat.uniforms.uMouse.value.copy(rayDir).applyQuaternion(tmpQ.copy(points.quaternion).invert());
      mouse.x += (mouse.tx - mouse.x) * .04;
      mouse.y += (mouse.ty - mouse.y) * .04;
      starMat.uniforms.uTime.value = t;
      stars.rotation.y = t * .0045; // slow galactic drift
      // camera parallax: layers separate by depth = the orb floats in space
      camera.position.x += (mouse.x * .55 - camera.position.x) * .03;
      camera.position.y += (-mouse.y * .35 - camera.position.y) * .03;
      camera.lookAt(0, 0, 0);
      points.rotation.y = t * .032 + mouse.x * .16;
      points.rotation.x = mouse.y * .11;
      points.position.x += (orbState.x - points.position.x) * .028;
      points.position.y += (orbState.y - points.position.y) * .028;
      const s = 2.1 * orbState.scale;
      points.scale.x += (s - points.scale.x) * .028;
      points.scale.y += (s - points.scale.y) * .028;
      points.scale.z += (s - points.scale.z) * .028;
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    })();
  }
  if (window.THREE) initGL(); else glCanvas.style.display = 'none';

  /* ───────── custom cursor: visible dot + ring, zero catch-up lag ─────────
     (design review: the thin line was hard to see and the trailing lerp made
     the whole site feel sluggish — the cursor now tracks the pointer 1:1) */
  const cursorEl = document.getElementById('cursor');
  if (cursorEl && matchMedia('(pointer: fine)').matches) {
    addEventListener('pointermove', e => {
      cursorEl.style.transform = `translate(${e.clientX - 19}px, ${e.clientY - 19}px)`;
    });
    // grow over anything clickable
    document.addEventListener('pointerover', e => {
      cursorEl.classList.toggle('is-hover', !!e.target.closest('a, button, summary, .plan, .lang-btn, .step-item'));
    });
    document.addEventListener('pointerleave', () => { cursorEl.style.opacity = '0'; });
    document.addEventListener('pointerenter', () => { cursorEl.style.opacity = '1'; });
  }

  /* every play-once reveal registers here so anchor jumps can complete them
     instantly instead of letting the user watch blocks flicker in */
  const REVEALS = [];

  /* ───────── smooth scroll (extra buttery) ───────── */
  const lenis = new Lenis({ lerp: .095, smoothWheel: true, wheelMultiplier: 1 });
  window.__lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  // keep Lenis's scroll limit in sync with the real page height — pin spacers
  // and reveals grow the page after init, and a stale limit made wheel
  // scrolling stop short of the footer (scrollbar still reached it)
  new ResizeObserver(() => lenis.resize()).observe(document.body);
  ScrollTrigger.addEventListener('refresh', () => lenis.resize());
  addEventListener('load', () => {
    ScrollTrigger.refresh();
    // arriving with a hash (e.g. from a blog page's "Pricing" link) must land
    // on that section instead of being reset to the top
    if (location.hash.length > 1 && document.querySelector(location.hash)) {
      completeAllReveals();
      lenis.scrollTo(location.hash, { immediate: true });
    } else {
      lenis.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
    }
    ScrollTrigger.refresh();
  });

  /* ───────── logo click = fresh reload of the home page ───────── */
  const navLogo = document.querySelector('.nav-logo');
  if (navLogo) {
    navLogo.addEventListener('click', e => {
      e.preventDefault();
      window.location.href = '/';
    });
  }

  /* ───────── global scroll progress bar ───────── */
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: self => gsap.set('#scrollProgress', { scaleX: self.progress }),
  });

  /* ───────── circuit paths: draw once on entry, then stay solid ─────────
     (design review: half-drawn scrubbed traces read as broken lines —
     each trace now completes in one stroke and remains continuous) */
  document.querySelectorAll('path[data-draw]').forEach(p => {
    const L = p.getTotalLength();
    p.style.strokeDasharray = L;
    p.style.strokeDashoffset = L;
    REVEALS.push(gsap.to(p, {
      strokeDashoffset: 0, duration: .9, ease: 'power2.out',
      scrollTrigger: { trigger: p.closest('svg'), start: 'top 92%', once: true },
    }));
  });

  document.querySelectorAll('path[data-pulse]').forEach(p => {
    const L = p.getTotalLength();
    const seg = Math.min(60, L * .22);
    p.style.strokeDasharray = `${seg} ${L}`;
    p.style.strokeDashoffset = seg;
    gsap.to(p, {
      strokeDashoffset: -L, duration: 2.2 + Math.random() * 2.4,
      repeat: -1, ease: 'none', delay: Math.random() * 2.5,
      repeatDelay: .6 + Math.random() * 1.4,
    });
  });

  /* ───────── hero net: draws on entrance ───────── */
  const heroPaths = [...document.querySelectorAll('path[data-hero-draw]')];
  heroPaths.forEach(p => {
    const L = p.getTotalLength();
    p.style.strokeDasharray = L;
    p.style.strokeDashoffset = L;
  });

  /* ───────── SynoIT service marquee ───────── */
  document.querySelectorAll('.service-marquee-track').forEach(track => {
    const half = () => track.scrollWidth / 2;
    gsap.to(track, {
      x: () => -half(),
      duration: 50, ease: 'none', repeat: -1,
      modifiers: { x: gsap.utils.unitize(x => parseFloat(x) % half()) },
    });
  });

  // when Google Translate is active, letter-splitting would garble the translation
  // (each letter gets translated separately) — so animate whole lines instead
  const isTranslated = /googtrans=\/en\/(?!en)/.test(document.cookie);
  // translated nav labels run long — collapse links into the dropdown menu
  if (isTranslated) document.body.classList.add('is-translated');
  const navMenuBtn = document.getElementById('navMenuBtn');
  const navDrop = document.getElementById('navDrop');
  if (navMenuBtn && navDrop) {
    const closeNavMenu = () => {
      navDrop.classList.remove('is-open');
      navMenuBtn.setAttribute('aria-expanded', 'false');
    };
    navMenuBtn.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = navDrop.classList.toggle('is-open');
      navMenuBtn.setAttribute('aria-expanded', String(isOpen));
    });
    navDrop.addEventListener('click', e => e.stopPropagation());
    addEventListener('click', closeNavMenu);
    addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeNavMenu();
        navMenuBtn.focus();
      }
    });
  }
  const heroChars = [];
  const ctaChars = [];
  if (!isTranslated) {
    document.querySelectorAll('.hero-title [data-split]').forEach(l => heroChars.push(...splitChars(l)));
    document.querySelectorAll('.cta-title [data-split]').forEach(l => ctaChars.push(...splitChars(l)));
  }
  const heroTargets = isTranslated ? '.hero-title .line' : heroChars;
  const ctaTargets = isTranslated ? '.cta-title .line' : ctaChars;
  const heroFromVars = isTranslated ? { y: 46, opacity: 0 } : { yPercent: 110 };
  gsap.set(heroTargets, heroFromVars);
  gsap.set('.hero-sub span, .hero-badges .badges-wrap', { yPercent: 120 });
  gsap.set('#heroChip', { scale: 0, opacity: 0 });
  gsap.set('#heroPhone', { opacity: 0, y: 90, rotation: -6, scale: .9 });

  // no preloader (design review: the 0→100% screen was a barrier between the
  // user and the content) — the hero entrance starts immediately
  setTimeout(enter, 60);

  function enter() {
    const tl = gsap.timeline();
    // the phone lands first, headline rises up behind the hand
    tl.to('#heroPhone', { opacity: 1, y: 0, rotation: 0, scale: 1, duration: 1.2, ease: 'power3.out' })
      .to(heroTargets,
        isTranslated
          ? { y: 0, opacity: 1, duration: 1, stagger: .14, ease: 'power4.out' }
          : { yPercent: 0, duration: 1.1, stagger: .022, ease: 'power4.out' }, '-=.75')
      .to('.hero-sub span', { yPercent: 0, duration: .9, ease: 'power3.out' }, '-=.8')
      .to('.hero-badges .badges-wrap', { yPercent: 0, duration: .9, ease: 'power3.out' }, '-=.7')
      .to('#heroChip', { scale: 1, opacity: 1, duration: .9, ease: 'back.out(1.6)' }, '-=.6')
      .to(heroPaths, {
        strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut',
        stagger: { each: .07, from: 'random' },
      }, '-=.5')
      // release the reveal masks so hover lifts are never clipped
      .set('.reveal-line', { overflow: 'visible' });
  }

  /* ───────── hero phone: idle float + scroll parallax ───────── */
  gsap.to('#heroPhone .hero-device', {
    y: 13, rotation: 1.4, duration: 3.4, yoyo: true, repeat: -1,
    ease: 'sine.inOut', delay: 2.4,
  });
  gsap.to('#heroPhone', {
    yPercent: -20, ease: 'none', immediateRender: false,
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 },
  });

  /* ───────── hero chip: scroll rotates it (scrub) ───────── */
  gsap.to('#heroChip', {
    rotationY: 360, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 },
  });
  // idle float so it always feels alive
  gsap.to('#heroChip', { y: -10, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });

  /* ───────── nav solid on scroll ───────── */
  ScrollTrigger.create({
    start: 80, onToggle: self => document.getElementById('nav').classList.toggle('is-solid', self.isActive),
  });

  /* ───────── orb choreography ───────── */
  const isMobile = innerWidth < 900;
  function orbTo(vals, trigger) {
    if (!document.querySelector(trigger)) return;
    ScrollTrigger.create({
      trigger, start: 'top 60%', end: 'bottom 40%',
      onEnter: () => Object.assign(orbState, vals),
      onEnterBack: () => Object.assign(orbState, vals),
    });
  }
  Object.assign(orbState, { x: 0, y: 0, scale: 1, amp: .35, alpha: .55 });
  orbTo({ x: 0, y: 0, scale: 1.3, amp: .6, alpha: .5 }, '#statement');
  orbTo({ x: 0, y: 0, scale: .85, amp: .3, alpha: .35 }, '.languages');
  orbTo({ x: isMobile ? 0 : 2.6, y: 0, scale: .7, amp: .5, alpha: .4 }, '#steps');
  orbTo({ x: isMobile ? 0 : -2.4, y: 0, scale: .7, amp: .4, alpha: .35 }, '#inside');
  orbTo({ x: isMobile ? 0 : 2.4, y: 0, scale: .75, amp: .3, alpha: .3 }, '#features');
  orbTo({ x: 0, y: 0, scale: 1, amp: .45, alpha: .45 }, '#pricing');
  orbTo({ x: 0, y: 0, scale: 1.6, amp: .85, alpha: .8 }, '#cta');
  orbTo({ x: 0, y: 0, scale: 1, amp: .35, alpha: .55 }, '#hero');

  /* ───────── statement: pinned story — PCB frame draws around the text ───────── */
  const statementText = document.getElementById('statementText');
  const statementSection = document.getElementById('statement');
  if (statementText && statementSection) {
    const words = isTranslated ? [] : splitWords(statementText);
    if (isTranslated) statementText.style.color = 'var(--text)';
    const sDraws = gsap.utils.toArray('path[data-sdraw]');
    const sPulses = gsap.utils.toArray('.statement-net .s-pulse');
    sDraws.forEach(p => {
      const L = p.getTotalLength();
      p.style.strokeDasharray = L;
      p.style.strokeDashoffset = L;
    });
    const stl = gsap.timeline({
      scrollTrigger: {
        trigger: '#statement', start: 'top top', end: '+=130%',
        pin: '#statementPin', scrub: 1,
        onUpdate: self => {
          // words light up after the frame starts drawing
          const wp = gsap.utils.clamp(0, 1, (self.progress - .18) / .68);
          const n = Math.floor(wp * (words.length + 2));
          words.forEach((w, i) => w.classList.toggle('is-on', i <= n));
        },
      },
    });
    stl.to(sDraws[0], { strokeDashoffset: 0, duration: .14, ease: 'none' })
       .to(sDraws[1], { strokeDashoffset: 0, duration: .5, ease: 'none' })
       .to(sPulses, { opacity: .95, duration: .06 }, '>-.05')
       .to(sDraws[2], { strokeDashoffset: 0, duration: .18, ease: 'none' })
       .to({}, { duration: .12 });
    sPulses.forEach((p, i) => {
      const L = p.getTotalLength();
      const seg = L * .1;
      p.style.strokeDasharray = `${seg} ${L - seg}`;
      gsap.fromTo(p,
        { strokeDashoffset: i === 0 ? 0 : -L / 2 },
        { strokeDashoffset: (i === 0 ? 0 : -L / 2) - L, duration: 7, repeat: -1, ease: 'none' });
    });
  }

  /* ───────── steps: regular block, auto-advancing ─────────
     (design review: the pinned scroll animation demanded too much scrolling and
     ran out of sync — now each step holds 6 seconds with a progress line under
     the active step, then switches automatically; the phone video follows) */
  const stepsSection = document.getElementById('steps');
  const stepItems = document.querySelectorAll('.step-item');
  const stepVideos = document.querySelectorAll('.step-video');
  const stepLineFills = document.querySelectorAll('.step-line-fill');
  const stepDots = document.querySelectorAll('.steps-dots button');
  const railFill = document.getElementById('stepsRailFill');
  const railDot = document.getElementById('stepsRailDot');
  const counterNum = document.getElementById('stepsCounterNum');
  let activeStep = 0;
  function setStep(i) {
    if (i === activeStep) return;
    activeStep = i;
    if (counterNum) counterNum.textContent = '0' + (i + 1);
    stepItems.forEach((el, k) => el.classList.toggle('is-active', k === i));
    stepDots.forEach((d, k) => {
      d.classList.toggle('is-active', k === i);
      d.setAttribute('aria-selected', String(k === i));
    });
    stepVideos.forEach((v, k) => {
      v.classList.toggle('is-active', k === i);
      if (k === i && typeof v.play === 'function') v.play().catch(() => {});
      else if (typeof v.pause === 'function') v.pause();
    });
  }
  if (stepVideos[0] && typeof stepVideos[0].play === 'function') stepVideos[0].play().catch(() => {});

  const STEP_SECONDS = 6;
  const stepProg = { p: 0 };
  let stepTween = null;
  function runStep(i) {
    if (stepTween) stepTween.kill(); // a manual switch must not leave two timers running
    setStep(i);
    stepLineFills.forEach(el => { el.style.width = '0%'; });
    stepTween = gsap.fromTo(stepProg, { p: 0 }, {
      p: 1, duration: STEP_SECONDS, ease: 'none',
      onUpdate() {
        if (stepLineFills[i]) stepLineFills[i].style.width = (stepProg.p * 100) + '%';
        const total = ((i + stepProg.p) / 4) * 100;
        if (railFill) railFill.style.height = total + '%';
        if (railDot) railDot.style.top = total + '%';
      },
      onComplete() { runStep((i + 1) % 4); },
    });
  }
  // manual switching: the step items themselves (desktop) and the 01–04
  // dots (mobile, where only the active item is visible) are clickable;
  // the 6s auto-advance restarts from the chosen step
  function userStep(i) {
    stepsStarted = true;
    runStep(i);
  }
  stepItems.forEach((el, i) => el.addEventListener('click', () => userStep(i)));
  stepDots.forEach((d, i) => d.addEventListener('click', () => userStep(i)));
  // run only while the section is on screen; pause when it scrolls away
  let stepsStarted = false;
  if (stepsSection && stepItems.length) {
    new IntersectionObserver(entries => {
      if (window.__capFrozen) return; // screenshot capture: keep the frozen step
      entries.forEach(en => {
        if (en.isIntersecting) {
          if (!stepsStarted) { stepsStarted = true; runStep(activeStep); }
          else if (stepTween) stepTween.play();
        } else if (stepTween) stepTween.pause();
      });
    }, { threshold: .25 }).observe(stepsSection);
  }

  /* ───────── inside: connected rows reveal on entry (no pin) ───────── */
  gsap.utils.toArray('.i-row').forEach((row, idx) => {
    const tile = row.querySelector('.i-tile');
    const info = row.querySelector('.i-info');
    const line = row.querySelector('.i-line');
    const pulse = row.querySelector('.i-pulse');
    const pads = row.querySelectorAll('.i-pad');
    // pre-set states + play-once timelines (immune to ScrollTrigger refresh reverts)
    gsap.set(tile, { scale: .6, opacity: 0 });
    gsap.set(info, { x: 48, opacity: 0 });
    gsap.set(pads, { opacity: 0 });
    if (line) {
      const L = line.getTotalLength();
      line.style.strokeDasharray = L;
      line.style.strokeDashoffset = L;
    }
    const tl = gsap.timeline({ paused: true });
    tl.to(tile, { scale: 1, opacity: 1, duration: .8, ease: 'back.out(1.7)' })
      .to(line, { strokeDashoffset: 0, duration: .7, ease: 'power2.inOut' }, '-=.45')
      .to(pads, { opacity: 1, duration: .35 }, '-=.35')
      .to(info, { x: 0, opacity: 1, duration: .7, ease: 'power3.out' }, '-=.4');
    REVEALS.push(tl);
    ScrollTrigger.create({ trigger: row, start: 'top 86%', once: true, onEnter: () => tl.play() });
    // perpetual light gliding along the routed trace
    if (pulse) {
      const L = pulse.getTotalLength();
      const seg = L * .16;
      pulse.style.strokeDasharray = `${seg} ${L}`;
      gsap.set(pulse, { opacity: .95, strokeDashoffset: seg });
      gsap.to(pulse, {
        strokeDashoffset: -L, duration: 3 + idx * .45,
        repeat: -1, ease: 'none', delay: 1.4 + idx * .4, repeatDelay: 1.1,
      });
    }
  });

  /* ───────── feature cards + chip reveal ───────── */
  gsap.utils.toArray('.f-card').forEach((card, i) => {
    REVEALS.push(gsap.from(card, {
      y: 50, opacity: 0, duration: .9, ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 90%' }, delay: (i % 3) * .1,
    }));
  });
  REVEALS.push(gsap.from('.f-chip', {
    scale: 0, opacity: 0, duration: 1, ease: 'back.out(1.7)',
    scrollTrigger: { trigger: '.features-wrap', start: 'top 70%' },
  }));

  /* ───────── imagine section: reveal + floating phones image ───────── */
  const imagine = document.querySelector('.imagine');
  if (imagine) {
    const phonesImg = imagine.querySelector('.imagine-device') || imagine.querySelector('.imagine-phones img');
    // pre-set states + play-once timeline; float starts only after the entrance ends
    gsap.set('.imagine-title', { y: 50, opacity: 0 });
    gsap.set('.imagine-points li', { x: -36, opacity: 0 });
    gsap.set(['.imagine-stat', '.imagine-badges'], { y: 28, opacity: 0 });
    gsap.set(phonesImg, { y: 100, opacity: 0, scale: .94 });
    const tl = gsap.timeline({
      paused: true,
      onComplete() {
        gsap.to(phonesImg, { y: '+=16', duration: 3.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      },
    });
    tl.to('.imagine-title', { y: 0, opacity: 1, duration: .8, ease: 'power3.out' })
      .to('.imagine-points li', { x: 0, opacity: 1, duration: .6, stagger: .12, ease: 'power3.out' }, '-=.4')
      .to('.imagine-stat', { y: 0, opacity: 1, duration: .6, ease: 'power3.out' }, '-=.3')
      .to('.imagine-badges', { y: 0, opacity: 1, duration: .5, ease: 'power3.out' }, '-=.3')
      .to(phonesImg, { y: 0, opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out' }, .2);
    REVEALS.push(tl);
    ScrollTrigger.create({ trigger: imagine, start: 'top 72%', once: true, onEnter: () => tl.play() });
  }

  /* ───────── signature features: per-row reveal + floating phones ───────── */
  gsap.utils.toArray('.sig-row').forEach((row, idx) => {
    const copy = row.querySelector('.sig-copy');
    const phone = row.querySelector('.sig-device');
    const fromLeft = !row.classList.contains('sig-rev');
    // the whole row arrives sideways: copy from its edge, phone from the opposite edge
    gsap.set(copy, { x: fromLeft ? -110 : 110, opacity: 0 });
    gsap.set(phone, { x: fromLeft ? 110 : -110, y: 30, opacity: 0, scale: .95 });
    const tl = gsap.timeline({
      paused: true,
      onComplete() {
        gsap.to(phone, { y: '+=14', duration: 3.4 + idx * .3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      },
    });
    tl.to(copy, { x: 0, opacity: 1, duration: .9, ease: 'power3.out' })
      .to(phone, { x: 0, y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }, .1);
    REVEALS.push(tl);
    ScrollTrigger.create({ trigger: row, start: 'top 74%', once: true, onEnter: () => tl.play() });
  });

  /* ───────── generic reveals ───────── */
  gsap.utils.toArray('.section-kicker, .features-title, .pricing h2, .price-card, .steps-head, .exploded-head, .reviews-title, .review-card, .qr-box').forEach(el => {
    REVEALS.push(gsap.from(el, {
      y: 40, opacity: 0, duration: .9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
    }));
  });

  /* ───────── CTA reveal ───────── */
  gsap.set(ctaTargets, isTranslated ? { y: 46, opacity: 0 } : { yPercent: 110 });
  const ctaTween = gsap.to(ctaTargets,
    isTranslated
      ? { y: 0, opacity: 1, duration: 1, stagger: .14, ease: 'power4.out', paused: true }
      : { yPercent: 0, duration: 1, stagger: .015, ease: 'power4.out', paused: true });
  REVEALS.push(ctaTween);
  ScrollTrigger.create({
    trigger: '#cta', start: 'top 65%',
    onEnter: () => ctaTween.play(),
    once: true,
  });

  /* ───────── pricing plan toggle (visual) ─────────
     yearly is the default (lowest rate) and the badge shows what the
     user saves vs paying monthly for the same period */
  document.querySelectorAll('.plan').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.plan').forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      const amount = document.querySelector('.price-amount');
      amount.innerHTML = (btn.dataset.price || 'Custom') + '<span>' + (btn.dataset.unit || 'scope') + '</span>';
      const saveEl = document.getElementById('priceSave');
      if (saveEl) {
        if (btn.dataset.save) {
          saveEl.style.visibility = 'visible';
          saveEl.innerHTML = '<b>' + btn.dataset.save + '</b>';
        } else {
          saveEl.style.visibility = 'hidden';
        }
      }
      gsap.fromTo(amount, { scale: .92, opacity: .4 }, { scale: 1, opacity: 1, duration: .5, ease: 'power3.out' });
    });
  });

  /* ───────── FAQ reveal ───────── */
  gsap.utils.toArray('.faq-item').forEach((item, i) => {
    REVEALS.push(gsap.from(item, {
      y: 34, opacity: 0, duration: .7, ease: 'power3.out',
      scrollTrigger: { trigger: item, start: 'top 92%' }, delay: (i % 4) * .05,
    }));
  });
  REVEALS.push(gsap.from('.faq-title', {
    y: 40, opacity: 0, duration: .9, ease: 'power3.out',
    scrollTrigger: { trigger: '.faq-title', start: 'top 90%' },
  }));

  /* ───────── language switcher (Google Translate) ───────── */
  const SUPPORTED = { en: 'EN', es: 'ES', fr: 'FR', de: 'DE', it: 'IT', pt: 'PT', ru: 'RU' };
  const langBtn = document.getElementById('langBtn');
  const langMenu = document.getElementById('langMenu');
  const langCur = document.getElementById('langCur');
  function currentLang() {
    const m = document.cookie.match(/googtrans=\/en\/(\w{2})/);
    return (m && SUPPORTED[m[1]]) ? m[1] : 'en';
  }
  function applyLang(l) {
    // expire any old cookie first (both plain and dotted-domain variants)
    const kill = 'googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = kill;
    document.cookie = kill + ';domain=' + location.hostname;
    if (l !== 'en') document.cookie = `googtrans=/en/${l};path=/`;
    location.reload();
  }
  if (langBtn) {
    langCur.textContent = SUPPORTED[currentLang()];
    langMenu.querySelectorAll('button').forEach(b => {
      b.classList.toggle('is-active', b.dataset.lang === currentLang());
      b.addEventListener('click', () => applyLang(b.dataset.lang));
    });
    langBtn.addEventListener('click', e => {
      e.stopPropagation();
      langMenu.classList.toggle('is-open');
    });
    addEventListener('click', () => langMenu.classList.remove('is-open'));
    // first visit: match the visitor's browser language (e.g. Spain → Spanish)
    if (!document.cookie.includes('googtrans') && !localStorage.getItem('synoit-lang-auto')) {
      localStorage.setItem('synoit-lang-auto', '1');
      const nav2 = (navigator.language || 'en').slice(0, 2).toLowerCase();
      if (SUPPORTED[nav2] && nav2 !== 'en') {
        document.cookie = `googtrans=/en/${nav2};path=/`;
        location.reload();
      }
    }
  }

  /* ───────── anchor links via lenis ─────────
     (design review: jumping to an anchor made the fade-in animations of other
     blocks flicker — before jumping, every play-once reveal is completed so
     the content is already fully visible) */
  function completeAllReveals() {
    REVEALS.forEach(t => { try { t.progress(1); } catch (e) {} });
  }
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length > 1 && document.querySelector(id)) {
        e.preventDefault();
        completeAllReveals();
        // re-measure before scrolling, then correct on arrival — completing
        // the reveals shifts positions after the target was computed
        ScrollTrigger.refresh();
        lenis.scrollTo(id, {
          offset: 0, duration: 1,
          onComplete() {
            const el = document.querySelector(id);
            if (el && Math.abs(el.getBoundingClientRect().top) > 4) {
              lenis.scrollTo(id, { offset: 0, duration: .35 });
            }
          },
        });
      } else {
        // placeholder links ("#") must never yank the page to the top
        e.preventDefault();
      }
    });
  });

})();
