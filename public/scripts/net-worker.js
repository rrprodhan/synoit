import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';

let renderer;
let scene;
let camera;
let points;
let stars;
let mat;
let starMat;
let baseScale = 1.15;
let width = 390;
let height = 844;
let visible = true;
let timer = 0;
let startedAt = performance.now();
let lastRender = 0;
const orbState = { x: 0, y: 0, scale: 1, amp: 0.35, alpha: 0.55 };
const mouse = { x: 0, y: 0, tx: 0, ty: 0, speed: 0 };
const rayDir = new THREE.Vector3(0, 0, 1);
const rayTarget = new THREE.Vector3(0, 0, 1);
const tmpV = new THREE.Vector3();
const tmpRay = new THREE.Vector3();
const tmpQ = new THREE.Quaternion();

const pointVertex = `
  attribute float aRnd;
  attribute float aOff;
  uniform float uTime, uAmp, uPulse, uMouseStr, uClickT;
  uniform vec3 uMouse, uClickDir;
  varying float vMix, vRnd, vGlow, vRim, vStray;
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
    vRnd = aRnd;
    vec3 nv = normalize(normalMatrix * n0);
    vRim = pow(1. - abs(nv.z), 2.2);
    vec4 mv = modelViewMatrix * vec4(p, 1.);
    gl_Position = projectionMatrix * mv;
    float size = 1.15 + aRnd*.45 + band*.4 + vRim*1.1 + (mi + ring)*2.2;
    size *= mix(1., .6, vStray);
    gl_PointSize = size * (300. / -mv.z) * .02;
  }
`;

const pointFragment = `
  uniform vec3 uColA, uColB, uColC;
  uniform float uAlpha;
  varying float vMix, vRnd, vGlow, vRim, vStray;
  void main(){
    vec2 uv = gl_PointCoord - .5;
    float d = length(uv);
    if (d > .5) discard;
    float core = smoothstep(.12, .0, d);
    float halo = smoothstep(.4, .1, d);
    vec3 col = mix(uColB, uColA, smoothstep(.05, .55, vMix));
    col = mix(col, uColC, smoothstep(.6, 1., vMix) * .85);
    col *= 1.2;
    col += vRim * .38 + vGlow * .3;
    col = mix(col, vec3(1., .97, 1.), core * .38 + vGlow * .3);
    float a = (halo*.62 + core*.52) * uAlpha * (.68 + vRim + vGlow);
    a *= mix(1., .45, vStray);
    gl_FragColor = vec4(col, a);
  }
`;

const lineVertex = `
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
  }
`;

const lineFragment = `
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
`;

function pointerToOrbDir(clientX, clientY) {
  tmpV.set((clientX / width) * 2 - 1, -(clientY / height) * 2 + 1, .5)
    .unproject(camera).sub(camera.position).normalize();
  tmpRay.copy(tmpV).multiplyScalar(-camera.position.dot(tmpV)).add(camera.position)
    .sub(points.position);
  if (tmpRay.lengthSq() < 1e-6) tmpRay.set(0, 0, 1);
  return tmpRay.normalize();
}

function build(canvas, nextWidth, nextHeight, dpr) {
  width = nextWidth;
  height = nextHeight;
  renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(dpr, 1));
  renderer.setSize(width, height, false);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, width / height, .1, 100);
  camera.position.z = 7;

  const count = 1400;
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
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geometry.setAttribute('aRnd', new THREE.BufferAttribute(rnd, 1));
  geometry.setAttribute('aOff', new THREE.BufferAttribute(off, 1));
  mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 }, uAmp: { value: .35 }, uAlpha: { value: .55 }, uPulse: { value: 1 },
      uColA: { value: new THREE.Color('#8F6BFF') }, uColB: { value: new THREE.Color('#E23A9E') },
      uColC: { value: new THREE.Color('#3E6BFF') }, uMouse: { value: new THREE.Vector3(0, 0, 1) },
      uMouseStr: { value: 0 }, uClickDir: { value: new THREE.Vector3(0, 0, 1) }, uClickT: { value: -100 },
    },
    vertexShader: pointVertex,
    fragmentShader: pointFragment,
  });
  points = new THREE.Points(geometry, mat);
  points.scale.setScalar(baseScale);
  scene.add(points);

  const segLon = 28;
  const segLat = 18;
  const vertices = [];
  for (let la = 1; la < segLat; la++) {
    const phi = la / segLat * Math.PI;
    const sp = Math.sin(phi);
    const cp = Math.cos(phi);
    for (let lo = 0; lo < segLon; lo++) {
      const t1 = lo / segLon * Math.PI * 2;
      const t2 = (lo + 1) / segLon * Math.PI * 2;
      vertices.push(sp * Math.cos(t1), cp, sp * Math.sin(t1), sp * Math.cos(t2), cp, sp * Math.sin(t2));
    }
  }
  for (let lo = 0; lo < segLon; lo++) {
    const th = lo / segLon * Math.PI * 2;
    const ct = Math.cos(th);
    const st = Math.sin(th);
    for (let la = 0; la < segLat; la++) {
      const p1 = la / segLat * Math.PI;
      const p2 = (la + 1) / segLat * Math.PI;
      vertices.push(Math.sin(p1) * ct, Math.cos(p1), Math.sin(p1) * st, Math.sin(p2) * ct, Math.cos(p2), Math.sin(p2) * st);
    }
  }
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
  const lineMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: mat.uniforms,
    vertexShader: lineVertex,
    fragmentShader: lineFragment,
  });
  points.add(new THREE.LineSegments(lineGeometry, lineMaterial));

  const starCount = 360;
  const foreground = 24;
  const starPositions = new Float32Array((starCount + foreground) * 3);
  const starRandom = new Float32Array(starCount + foreground);
  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - .5) * 46;
    starPositions[i * 3 + 1] = (Math.random() - .5) * 28;
    starPositions[i * 3 + 2] = -3.5 - Math.pow(Math.random(), 1.4) * 26;
    starRandom[i] = Math.random();
  }
  for (let i = starCount; i < starCount + foreground; i++) {
    starPositions[i * 3] = (Math.random() - .5) * 14;
    starPositions[i * 3 + 1] = (Math.random() - .5) * 9;
    starPositions[i * 3 + 2] = 3.2 + Math.random() * 1.6;
    starRandom[i] = Math.random();
  }
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeometry.setAttribute('aRnd', new THREE.BufferAttribute(starRandom, 1));
  starMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uColA: { value: new THREE.Color('#B4A6FF') }, uColB: { value: new THREE.Color('#E23A9E') } },
    vertexShader: `
      attribute float aRnd; uniform float uTime; varying float vA, vC;
      void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mv;
        vA = .5 + .5 * sin(uTime * (.35 + aRnd*1.4) + aRnd*80.); vC = aRnd;
        gl_PointSize = (.8 + aRnd*1.7) * (300. / -mv.z) * .02; }
    `,
    fragmentShader: `
      uniform vec3 uColA, uColB; varying float vA, vC;
      void main(){ vec2 uv = gl_PointCoord - .5; float d = length(uv); if (d > .5) discard;
        float a = smoothstep(.5, .06, d) * (.22 + vA*.3);
        vec3 col = mix(vec3(.88, .87, 1.), mix(uColA, uColB, step(.88, vC)), .4);
        gl_FragColor = vec4(col, a); }
    `,
  });
  stars = new THREE.Points(starGeometry, starMat);
  scene.add(stars);
  startedAt = performance.now();
  schedule();
}

function draw(now) {
  if (!renderer || !visible) return;
  const t = (now - startedAt) / 1000;
  mat.uniforms.uTime.value = t;
  mat.uniforms.uAmp.value += (orbState.amp - mat.uniforms.uAmp.value) * .03;
  mat.uniforms.uAlpha.value += (orbState.alpha - mat.uniforms.uAlpha.value) * .03;
  const voice = .8 + .2 * (Math.abs(Math.sin(t * 1.4)) * .6 + Math.sin(t * 2.4) * Math.sin(t * .55) * .4);
  mat.uniforms.uPulse.value += (voice - mat.uniforms.uPulse.value) * .08;
  mouse.speed *= .965;
  const strength = Math.min(1, .28 + mouse.speed);
  mat.uniforms.uMouseStr.value += (strength - mat.uniforms.uMouseStr.value) * .035;
  rayDir.lerp(rayTarget, .045).normalize();
  mat.uniforms.uMouse.value.copy(rayDir).applyQuaternion(tmpQ.copy(points.quaternion).invert());
  mouse.x += (mouse.tx - mouse.x) * .04;
  mouse.y += (mouse.ty - mouse.y) * .04;
  starMat.uniforms.uTime.value = t;
  stars.rotation.y = t * .0045;
  camera.position.x += (mouse.x * .55 - camera.position.x) * .03;
  camera.position.y += (-mouse.y * .35 - camera.position.y) * .03;
  camera.lookAt(0, 0, 0);
  points.rotation.y = t * .032 + mouse.x * .16;
  points.rotation.x = mouse.y * .11;
  points.position.x += (orbState.x - points.position.x) * .028;
  points.position.y += (orbState.y - points.position.y) * .028;
  const scale = baseScale * orbState.scale;
  points.scale.x += (scale - points.scale.x) * .028;
  points.scale.y += (scale - points.scale.y) * .028;
  points.scale.z += (scale - points.scale.z) * .028;
  renderer.render(scene, camera);
}

function schedule() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    const now = performance.now();
    if (visible && now - lastRender >= 32) {
      lastRender = now;
      draw(now);
    }
    schedule();
  }, 16);
}

self.onmessage = event => {
  const message = event.data;
  if (message.type === 'init') {
    build(message.canvas, message.width, message.height, message.dpr);
    return;
  }
  if (message.type === 'resize' && renderer) {
    width = message.width;
    height = message.height;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(message.dpr, 1));
    renderer.setSize(width, height, false);
    return;
  }
  if (message.type === 'pointer' && points) {
    mouse.tx = (message.x / width) * 2 - 1;
    mouse.ty = (message.y / height) * 2 - 1;
    mouse.speed = Math.min(1.2, mouse.speed + .18);
    rayTarget.copy(pointerToOrbDir(message.x, message.y));
    return;
  }
  if (message.type === 'press' && points) {
    mat.uniforms.uClickDir.value.copy(
      pointerToOrbDir(message.x, message.y).applyQuaternion(tmpQ.copy(points.quaternion).invert())
    );
    mat.uniforms.uClickT.value = mat.uniforms.uTime.value;
    mouse.speed = Math.min(2.5, mouse.speed + 1.2);
    return;
  }
  if (message.type === 'state') Object.assign(orbState, message.state);
  if (message.type === 'visibility') visible = message.visible;
};
