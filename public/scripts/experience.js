(() => {
  'use strict';

  const nav = document.querySelector('.nav');
  const progress = document.querySelector('.scroll-progress');
  const cursor = document.querySelector('.cursor');
  const toTop = document.querySelector('[data-to-top]');
  const mobileBtn = document.querySelector('[data-mobile-toggle]');
  const mobilePanel = document.querySelector('.mobile-panel');
  const hasGsap = window.gsap && window.ScrollTrigger;
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);
  if (hasGsap) document.body.classList.add('motion-ready');
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  const lenis = (() => {
    if (!window.Lenis || !hasGsap) return null;
    const instance = new Lenis({ lerp: .095, smoothWheel: true, wheelMultiplier: 1 });
    instance.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => instance.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    new ResizeObserver(() => instance.resize()).observe(document.body);
    ScrollTrigger.addEventListener('refresh', () => instance.resize());
    window.__lenis = instance;
    return instance;
  })();

  mobileBtn?.addEventListener('click', () => {
    const open = !mobilePanel?.classList.contains('is-open');
    mobilePanel?.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    mobileBtn.setAttribute('aria-expanded', String(open));
  });
  mobilePanel?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    mobilePanel.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    mobileBtn?.setAttribute('aria-expanded', 'false');
  }));

  document.querySelectorAll('.faq-item button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      item?.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(item?.classList.contains('is-open')));
      if (hasGsap) ScrollTrigger.refresh();
    });
  });

  function updateScrollUi(scroll = scrollY) {
    const max = document.documentElement.scrollHeight - innerHeight;
    const pct = max > 0 ? scroll / max : 0;
    if (!hasGsap && progress) progress.style.transform = `scaleX(${pct})`;
    nav?.classList.toggle('is-solid', scroll > 20);
    toTop?.classList.toggle('is-visible', scroll > innerHeight * .7);
  }
  if (lenis) {
    lenis.on('scroll', ({ scroll }) => updateScrollUi(scroll));
    toTop?.addEventListener('click', () => lenis.scrollTo(0, { duration: 1.2 }));
  } else {
    addEventListener('scroll', () => updateScrollUi(), { passive: true });
    toTop?.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  }
  updateScrollUi();

  if (hasGsap && progress) {
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => gsap.set(progress, { scaleX: self.progress }) });
  }

  const reasonCards = [...document.querySelectorAll('[data-reason-card]')];
  const reasonLinks = [...document.querySelectorAll('[data-reason-link]')];
  const reasonCore = document.querySelector('.why-core');
  function setReasonActive(id) {
    reasonCards.forEach((card) => card.classList.toggle('is-active', card.dataset.reasonCard === id));
    reasonLinks.forEach((path) => {
      const key = path.dataset.reasonLink;
      path.classList.toggle('is-active', key === id || (id && key === 'spine'));
    });
    reasonCore?.classList.toggle('is-active', Boolean(id));
  }
  reasonCards.forEach((card) => {
    card.addEventListener('mouseenter', () => setReasonActive(card.dataset.reasonCard));
    card.addEventListener('focusin', () => setReasonActive(card.dataset.reasonCard));
    card.addEventListener('mouseleave', () => setReasonActive(''));
    card.addEventListener('focusout', () => setReasonActive(''));
  });

  const stepList = document.querySelector('.step-list');
  const processSteps = [...document.querySelectorAll('.step-list .step')];
  let processStepIndex = 0;
  let processTimer;
  function setProcessStep(index) {
    if (!stepList || !processSteps.length) return;
    processStepIndex = (index + processSteps.length) % processSteps.length;
    processSteps.forEach((step, stepIndex) => {
      step.classList.toggle('is-active', stepIndex === processStepIndex);
      step.classList.toggle('is-past', stepIndex < processStepIndex);
    });
    const active = processSteps[processStepIndex];
    const activeNum = active.querySelector('.step-num');
    const listBox = stepList.getBoundingClientRect();
    const numBox = activeNum.getBoundingClientRect();
    const railY = numBox.top + numBox.height / 2 - listBox.top - 8;
    stepList.style.setProperty('--rail-y', `${Math.max(18, railY)}px`);
  }
  function startProcessTimer() {
    clearInterval(processTimer);
    processTimer = setInterval(() => setProcessStep(processStepIndex + 1), 6000);
  }
  if (processSteps.length) {
    setProcessStep(0);
    startProcessTimer();
    processSteps.forEach((step, index) => {
      step.addEventListener('mouseenter', () => {
        setProcessStep(index);
        startProcessTimer();
      });
      step.addEventListener('focusin', () => {
        setProcessStep(index);
        startProcessTimer();
      });
    });
    addEventListener('resize', () => setProcessStep(processStepIndex));
  }

  const pricingCards = [...document.querySelectorAll('[data-pricing-card]')];
  if (pricingCards.length) {
    const clearPricingActive = () => {
      pricingCards.forEach((card) => card.classList.remove('is-active'));
    };
    pricingCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        clearPricingActive();
        card.classList.add('is-active');
      });
      card.addEventListener('focusin', () => {
        clearPricingActive();
        card.classList.add('is-active');
      });
      card.addEventListener('mouseleave', () => {
        card.classList.remove('is-active');
      });
      card.addEventListener('focusout', () => {
        if (!card.contains(document.activeElement)) card.classList.remove('is-active');
      });
    });
  }

  if (cursor && matchMedia('(pointer: fine)').matches) {
    addEventListener('pointermove', (e) => {
      cursor.style.transform = `translate3d(${e.clientX - 19}px,${e.clientY - 19}px,0)`;
    }, { passive: true });
    document.addEventListener('pointerover', (e) => {
      cursor.classList.toggle('is-hover', !!e.target.closest('a, button, input, textarea, select, .card, .chip, .pricing-tier'));
    });
  }

  const grain = document.getElementById('grain');
  if (grain) {
    const ctx = grain.getContext('2d');
    const frames = [];
    function bake() {
      grain.width = innerWidth / 3;
      grain.height = innerHeight / 3;
      frames.length = 0;
      for (let f = 0; f < 6; f++) {
        const c = document.createElement('canvas');
        c.width = grain.width;
        c.height = grain.height;
        const x = c.getContext('2d');
        const d = x.createImageData(c.width, c.height);
        const b = new Uint32Array(d.data.buffer);
        for (let i = 0; i < b.length; i++) {
          const v = Math.random() * 255 | 0;
          b[i] = (255 << 24) | (v << 16) | (v << 8) | v;
        }
        x.putImageData(d, 0, 0);
        frames.push(c);
      }
    }
    bake();
    let tick = 0;
    function loop() {
      if (tick++ % 3 === 0 && frames.length) ctx.drawImage(frames[(tick / 3 | 0) % frames.length], 0, 0);
      requestAnimationFrame(loop);
    }
    loop();
    addEventListener('resize', bake);
  }

  const orbState = { x: 0, y: -.08, scale: 1.46, amp: .58, alpha: .62 };
  function initGL() {
    const canvas = document.getElementById('gl');
    if (!canvas || !window.THREE) return;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      canvas.style.display = 'none';
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, .1, 100);
    camera.position.z = 7;

    const count = innerWidth < 900 ? 5600 : 11200;
    const pos = new Float32Array(count * 3);
    const rnd = new Float32Array(count);
    const off = new Float32Array(count);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
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

    const uniforms = {
      uTime: { value: 0 },
      uAmp: { value: .58 },
      uAlpha: { value: .62 },
      uPulse: { value: 1 },
      uColA: { value: new THREE.Color('#8F6BFF') },
      uColB: { value: new THREE.Color('#E23A9E') },
      uColC: { value: new THREE.Color('#3E6BFF') },
      uMouse: { value: new THREE.Vector3(0, 0, 1) },
      uMouseStr: { value: 0 },
      uClickDir: { value: new THREE.Vector3(0, 0, 1) },
      uClickT: { value: -100 }
    };
    const pointVertex = `
      attribute float aRnd; attribute float aOff;
      uniform float uTime, uAmp, uPulse, uMouseStr, uClickT;
      uniform vec3 uMouse, uClickDir;
      varying float vMix, vGlow, vRim, vStray;
      void main(){
        vec3 n0 = position;
        float tt = uTime * .16;
        float d1 = sin(n0.x*1.7 + tt*1.3) * sin(n0.y*2.1 - tt);
        float d2 = sin(n0.y*3.1 + tt*.8) * sin(n0.z*2.6 + tt*1.1) * .6;
        float d3 = sin(n0.z*4.6 - tt*1.5) * sin(n0.x*3.8 + tt*.7) * .35;
        float body = (d1 + d2 + d3) * .42;
        float fine = sin(n0.x*5.2 - uTime*.6) * sin(n0.z*4.4 + uTime*.5) * .12;
        float band = sin(n0.y*6.0 - uTime*.9) * .5 + .5;
        float disp = (body + fine) * uPulse * (0.6 + uAmp);
        float md = distance(n0, uMouse);
        float mi = smoothstep(.78, .0, md) * uMouseStr;
        disp += mi * .3;
        float cd = acos(clamp(dot(n0, uClickDir), -1., 1.));
        float ct = uTime - uClickT;
        float ring = exp(-pow((cd - ct*2.0)*4.0, 2.)) * exp(-ct*1.2) * step(0., ct);
        disp += ring * .7;
        vec3 p = n0 * (1. + disp + aOff);
        vGlow = mi + ring;
        vStray = step(.001, aOff);
        vMix = clamp(n0.y*.5 + .5 + body*.3, 0., 1.);
        vec3 nv = normalize(normalMatrix * n0);
        vRim = pow(1. - abs(nv.z), 2.2);
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mv;
        float size = 1.15 + aRnd*.45 + band*.4 + vRim*1.1 + (mi + ring)*2.2;
        size *= mix(1., .6, vStray);
        gl_PointSize = size * (300. / -mv.z) * .02;
      }`;
    const pointFragment = `
      uniform vec3 uColA, uColB, uColC; uniform float uAlpha;
      varying float vMix, vGlow, vRim, vStray;
      void main(){
        vec2 uv = gl_PointCoord - .5; float d = length(uv); if (d > .5) discard;
        float core = smoothstep(.12, .0, d);
        float halo = smoothstep(.4, .1, d);
        vec3 col = mix(uColB, uColA, smoothstep(.05, .55, vMix));
        col = mix(col, uColC, smoothstep(.6, 1., vMix) * .85);
        col *= 1.2; col += vRim * .38 + vGlow * .3;
        col = mix(col, vec3(1., .97, 1.), core * .38 + vGlow * .3);
        float a = (halo*.62 + core*.52) * uAlpha * (.68 + vRim*1.0 + vGlow*1.0);
        a *= mix(1., .45, vStray);
        gl_FragColor = vec4(col, a);
      }`;
    const mat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms, vertexShader: pointVertex, fragmentShader: pointFragment });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    const segLon = 70;
    const segLat = 44;
    const lv = [];
    for (let la = 1; la < segLat; la++) {
      const phi = la / segLat * Math.PI;
      const sp = Math.sin(phi);
      const cp = Math.cos(phi);
      for (let lo = 0; lo < segLon; lo++) {
        const t1 = lo / segLon * Math.PI * 2;
        const t2 = (lo + 1) / segLon * Math.PI * 2;
        lv.push(sp * Math.cos(t1), cp, sp * Math.sin(t1), sp * Math.cos(t2), cp, sp * Math.sin(t2));
      }
    }
    for (let lo = 0; lo < segLon; lo++) {
      const th = lo / segLon * Math.PI * 2;
      const ct = Math.cos(th);
      const st = Math.sin(th);
      for (let la = 0; la < segLat; la++) {
        const p1 = la / segLat * Math.PI;
        const p2 = (la + 1) / segLat * Math.PI;
        lv.push(Math.sin(p1) * ct, Math.cos(p1), Math.sin(p1) * st, Math.sin(p2) * ct, Math.cos(p2), Math.sin(p2) * st);
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lv), 3));
    const lineMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms,
      vertexShader: `
        uniform float uTime, uAmp, uPulse, uMouseStr, uClickT;
        uniform vec3 uMouse, uClickDir;
        varying float vMix, vRim, vGlow;
        void main(){
          vec3 n0 = normalize(position);
          float tt = uTime * .16;
          float d1 = sin(n0.x*1.7 + tt*1.3) * sin(n0.y*2.1 - tt);
          float d2 = sin(n0.y*3.1 + tt*.8) * sin(n0.z*2.6 + tt*1.1) * .6;
          float d3 = sin(n0.z*4.6 - tt*1.5) * sin(n0.x*3.8 + tt*.7) * .35;
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
        }`,
      fragmentShader: `
        uniform vec3 uColA, uColB, uColC; uniform float uAlpha;
        varying float vMix, vRim, vGlow;
        void main(){
          vec3 col = mix(uColB, uColA, smoothstep(.05, .55, vMix));
          col = mix(col, uColC, smoothstep(.6, 1., vMix) * .85);
          col *= 1.2; col += vRim * .35 + vGlow * .3;
          float a = (.07 + vRim*.28 + vGlow*.33) * uAlpha;
          gl_FragColor = vec4(col, a);
        }`
    });
    const wire = new THREE.LineSegments(lineGeo, lineMat);
    points.add(wire);

    const starCount = innerWidth < 900 ? 800 : 1700;
    const sPos = new Float32Array(starCount * 3);
    const sRnd = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      sPos[i * 3] = (Math.random() - .5) * 46;
      sPos[i * 3 + 1] = (Math.random() - .5) * 28;
      sPos[i * 3 + 2] = -4 - Math.pow(Math.random(), 1.4) * 28;
      sRnd[i] = Math.random();
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    starGeo.setAttribute('aRnd', new THREE.BufferAttribute(sRnd, 1));
    const starMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        attribute float aRnd; uniform float uTime; varying float vA;
        void main(){
          vec4 mv = modelViewMatrix * vec4(position, 1.);
          gl_Position = projectionMatrix * mv;
          vA = .5 + .5 * sin(uTime * (.35 + aRnd*1.4) + aRnd*80.);
          gl_PointSize = (.8 + aRnd*1.7) * (300. / -mv.z) * .02;
        }`,
      fragmentShader: `
        varying float vA;
        void main(){
          vec2 uv = gl_PointCoord - .5; float d = length(uv); if (d > .5) discard;
          gl_FragColor = vec4(.78, .72, 1., smoothstep(.5,.06,d) * (.2 + vA*.32));
        }`
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0, speed: 0 };
    const rayDir = new THREE.Vector3(0, 0, 1);
    const rayTarget = new THREE.Vector3(0, 0, 1);
    const tmpV = new THREE.Vector3();
    const tmpQ = new THREE.Quaternion();
    let lastPX = 0;
    let lastPY = 0;
    let lastPT = performance.now();
    function pointerToOrbDir(e) {
      tmpV.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1, .5)
        .unproject(camera).sub(camera.position).normalize();
      const oc = tmpV.clone().multiplyScalar(-camera.position.dot(tmpV)).add(camera.position);
      oc.sub(points.position);
      if (oc.lengthSq() < 1e-6) oc.set(0, 0, 1);
      return oc.normalize();
    }
    addEventListener('pointermove', (e) => {
      mouse.tx = (e.clientX / innerWidth - .5) * 2;
      mouse.ty = (e.clientY / innerHeight - .5) * 2;
      const now = performance.now();
      const dt = Math.max(16, now - lastPT);
      const dist = Math.hypot(e.clientX - lastPX, e.clientY - lastPY);
      mouse.speed = Math.min(1.3, mouse.speed + dist / dt * .18);
      lastPX = e.clientX;
      lastPY = e.clientY;
      lastPT = now;
      rayTarget.copy(pointerToOrbDir(e));
    }, { passive: true });
    addEventListener('pointerdown', (e) => {
      uniforms.uClickDir.value.copy(pointerToOrbDir(e).applyQuaternion(tmpQ.copy(points.quaternion).invert()));
      uniforms.uClickT.value = uniforms.uTime.value;
      mouse.speed = Math.min(2.6, mouse.speed + 1.25);
    }, { passive: true });

    function resize() {
      renderer.setSize(innerWidth, innerHeight);
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
    }
    addEventListener('resize', resize);
    resize();

    const clock = new THREE.Clock();
    function animate() {
      const t = clock.getElapsedTime();
      uniforms.uTime.value = t;
      uniforms.uAmp.value += (orbState.amp - uniforms.uAmp.value) * .03;
      uniforms.uAlpha.value += (orbState.alpha - uniforms.uAlpha.value) * .03;
      const voice = .8 + .2 * (Math.abs(Math.sin(t * 1.4)) * .6 + Math.sin(t * 2.4) * Math.sin(t * .55) * .4);
      uniforms.uPulse.value += (voice - uniforms.uPulse.value) * .08;
      mouse.speed *= .965;
      uniforms.uMouseStr.value += (Math.min(1, .28 + mouse.speed) - uniforms.uMouseStr.value) * .035;
      rayDir.lerp(rayTarget, .045).normalize();
      uniforms.uMouse.value.copy(rayDir).applyQuaternion(tmpQ.copy(points.quaternion).invert());
      mouse.x += (mouse.tx - mouse.x) * .04;
      mouse.y += (mouse.ty - mouse.y) * .04;
      starMat.uniforms.uTime.value = t;
      stars.rotation.y = t * .0045;
      camera.position.x += (mouse.x * .55 - camera.position.x) * .03;
      camera.position.y += (-mouse.y * .35 - camera.position.y) * .03;
      camera.lookAt(0, 0, 0);
      points.rotation.y = t * .032 + mouse.x * .16 + scrollY * .00014;
      points.rotation.x = mouse.y * .11;
      points.position.x += (orbState.x - points.position.x) * .028;
      points.position.y += (orbState.y - points.position.y) * .028;
      const s = 2.1 * orbState.scale;
      points.scale.x += (s - points.scale.x) * .028;
      points.scale.y += (s - points.scale.y) * .028;
      points.scale.z += (s - points.scale.z) * .028;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
  }
  initGL();

  if (!hasGsap) return;

  const drawPaths = gsap.utils.toArray('path[data-draw]');
  drawPaths.forEach((p) => {
    const length = p.getTotalLength();
    p.style.strokeDasharray = length;
    p.style.strokeDashoffset = length;
  });
  const heroPaths = gsap.utils.toArray('path[data-hero-draw]');

  gsap.utils.toArray('path[data-pulse]').forEach((p) => {
    const length = p.getTotalLength();
    const segment = Math.min(90, length * .18);
    p.style.strokeDasharray = `${segment} ${length}`;
    p.style.strokeDashoffset = segment;
    gsap.to(p, {
      strokeDashoffset: -length,
      duration: 2.1 + Math.random() * 2.2,
      repeat: -1,
      ease: 'none',
      delay: Math.random() * 1.3,
      repeatDelay: .25 + Math.random() * .65
    });
  });

  gsap.set(['.hero .kicker', '.hero-title', '.hero-sub', '.hero-actions'], { y: 42, opacity: 0 });
  gsap.set('#heroChip', { scale: 0, opacity: 0, rotationY: -80 });
  const tl = gsap.timeline({ delay: .08 });
  tl.to('.hero .kicker', { y: 0, opacity: 1, duration: .72, ease: 'power3.out' })
    .to('.hero-title', { y: 0, opacity: 1, duration: .95, ease: 'power4.out' }, '-=.42')
    .to('.hero-sub', { y: 0, opacity: 1, duration: .82, ease: 'power3.out' }, '-=.58')
    .to('.hero-actions', { y: 0, opacity: 1, duration: .82, ease: 'power3.out' }, '-=.62')
    .to('#heroChip', { scale: 1, opacity: 1, rotationY: 0, duration: .9, ease: 'back.out(1.6)' }, '-=.54')
    .to(heroPaths, { strokeDashoffset: 0, duration: 1.35, ease: 'power2.inOut', stagger: { each: .07, from: 'random' } }, '-=.58');

  const revealEls = gsap.utils.toArray('[data-reveal]').filter((el) => !el.closest('.hero'));
  gsap.set(revealEls, { y: 34, opacity: 0 });
  revealEls.forEach((el, i) => {
    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: .9,
      ease: 'power3.out',
      delay: Math.min(i * .025, .18),
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  drawPaths.filter((path) => !path.hasAttribute('data-hero-draw')).forEach((path) => {
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: .95,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: path.closest('svg') || path,
        start: 'top 88%',
        once: true
      }
    });
  });

  gsap.to('#heroChip', { y: -12, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.2 });
  gsap.to('#heroChip', {
    rotationY: 360,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });
  gsap.to('.hero-content', {
    yPercent: -18,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });
  gsap.to('#heroVisual', {
    yPercent: -34,
    scale: 1.08,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });

  function orbTo(vals, selector) {
    const el = document.querySelector(selector);
    if (!el) return;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => Object.assign(orbState, vals),
      onEnterBack: () => Object.assign(orbState, vals)
    });
  }
  const isMobile = innerWidth < 900;
  orbTo({ x: 0, y: -.08, scale: 1.46, amp: .58, alpha: .62 }, '.hero');
  orbTo({ x: 0, y: 0, scale: 1.28, amp: .62, alpha: .5 }, '.statement');
  orbTo({ x: isMobile ? 0 : 2.3, y: 0, scale: .76, amp: .5, alpha: .42 }, '.steps-body');
  orbTo({ x: isMobile ? 0 : -2.15, y: 0, scale: .72, amp: .38, alpha: .36 }, '.feature-row');
  orbTo({ x: 0, y: 0, scale: 1.18, amp: .55, alpha: .5 }, '.cta-panel');

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') {
        e.preventDefault();
        return;
      }
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      ScrollTrigger.refresh();
      lenis ? lenis.scrollTo(target, { duration: 1 }) : target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
