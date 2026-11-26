import * as THREE from 'three';

const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const C = { paper: 0xfaf9f7, tan: 0xe9e5de, ink: 0x141414, hot: 0xffa01e, side: 0xd9d4ca };
const TILE_H = 0.14, TILE_D = 0.46, PX = 128 / TILE_D; // texture px per world unit
const SHEET = { w: 6.3, d: 2.7, z: -1.05 };
const BIN = { x: 2.05, z: 1.75, w: 1.5, d: 0.95, h: 1.15 };
const DIAL = { x: -1.75, z: 1.7, r: 0.46 };
const ANG = [-1.6, -0.8, 0, 0.8, 1.6]; // knob angle per level
const ease = t => 1 - Math.pow(1 - t, 3);
const easeIO = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function textTexture(text, { bg = '#faf9f7', fg = '#141414', font = '400 60px "Source Serif 4"', strike = false } = {}) {
  const m = document.createElement('canvas').getContext('2d');
  m.font = font;
  const tw = Math.ceil(m.measureText(text).width);
  const w = Math.min(1024, tw + 52), h = 128;
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const g = cv.getContext('2d');
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  g.font = font; g.fillStyle = fg; g.textBaseline = 'middle'; g.textAlign = 'center';
  g.fillText(text, w / 2, h / 2 + 4, w - 30);
  if (strike) { g.fillRect(18, h / 2 + 2, w - 36, 6); }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  return { tex, w: w / PX };
}

function roundedBox(w, h, d, r) {
  const s = new THREE.Shape();
  const x = -w / 2, y = -d / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + d - r); s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
  s.lineTo(x + r, y + d); s.quadraticCurveTo(x, y + d, x, y + d - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: false, curveSegments: 6 });
  g.rotateX(Math.PI / 2); g.translate(0, h, 0);
  return g;
}

export function createScene(canvas, { onLevel, onScore, tooltip, reduced }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  const camBase = new THREE.Vector3(0, 6.9, 6.5), look = new THREE.Vector3(0, 0.1, 0.35);

  const hemi = new THREE.HemisphereLight(0xffffff, 0xcfc8bc, 1.5); scene.add(hemi);
  const key = new THREE.DirectionalLight(0xfff6ea, 2.2);
  key.position.set(-3.5, 9, 4); key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 6; key.shadow.bias = -0.0004;
  Object.assign(key.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 25 });
  scene.add(key);
  const rim = new THREE.PointLight(C.hot, 0, 12, 1.6); rim.position.set(3.2, 2.4, -2.2); scene.add(rim);

  // ground (shadows only) + paper sheet
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.16 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  const sheet = new THREE.Mesh(roundedBox(SHEET.w, 0.06, SHEET.d, 0.22), new THREE.MeshStandardMaterial({ color: C.paper, roughness: 0.9 }));
  sheet.position.set(0, 0, SHEET.z); sheet.receiveShadow = true; sheet.castShadow = true; scene.add(sheet);
  const sheetTop = 0.06;

  // ---------- bin (the pile) ----------
  const bin = new THREE.Group(); bin.position.set(BIN.x, 0, BIN.z); scene.add(bin);
  const binFloor = new THREE.Mesh(roundedBox(BIN.w, 0.05, BIN.d, 0.08), new THREE.MeshStandardMaterial({ color: C.tan, roughness: 1 }));
  binFloor.receiveShadow = true; bin.add(binFloor);
  const glass = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.16, roughness: 0.1, depthWrite: false });
  const wallBack = new THREE.Mesh(new THREE.BoxGeometry(BIN.w, BIN.h, 0.03), glass); wallBack.position.set(0, BIN.h / 2, -BIN.d / 2); bin.add(wallBack);
  const wallL = new THREE.Mesh(new THREE.BoxGeometry(0.03, BIN.h, BIN.d), glass); wallL.position.set(-BIN.w / 2, BIN.h / 2, 0); bin.add(wallL);
  const wallR = wallL.clone(); wallR.position.x = BIN.w / 2; bin.add(wallR);
  const wallF = new THREE.Mesh(new THREE.BoxGeometry(BIN.w, BIN.h * 0.55, 0.03), glass); wallF.position.set(0, BIN.h * 0.275, BIN.d / 2); bin.add(wallF);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(BIN.w, BIN.h, BIN.d)), new THREE.LineBasicMaterial({ color: C.ink, transparent: true, opacity: 0.55 }));
  edges.position.y = BIN.h / 2; bin.add(edges);
  // ruler on the back wall
  {
    const cv = document.createElement('canvas'); cv.width = 96; cv.height = 512; const g = cv.getContext('2d');
    g.fillStyle = '#141414'; g.font = '600 26px ui-monospace, monospace'; g.textBaseline = 'middle';
    for (let v = 0; v <= 100; v += 10) {
      const y = 500 - v / 100 * 488; const big = v % 50 === 0;
      g.fillRect(0, y - 1.5, big ? 30 : 16, 3);
      if (big) g.fillText(String(v), 36, y);
    }
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
    const ruler = new THREE.Mesh(new THREE.PlaneGeometry(BIN.h * 96 / 512, BIN.h), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
    ruler.position.set(-BIN.w / 2 + 0.2, BIN.h / 2 + 0.01, -BIN.d / 2 + 0.03); bin.add(ruler);
  }
  // score line: an orange band around the walls at the score height
  const level = new THREE.Group(); level.position.y = 0.03; bin.add(level);
  { const mat = new THREE.MeshBasicMaterial({ color: C.hot });
    [[BIN.w, 0.035, 0.035, 0, -BIN.d / 2], [BIN.w, 0.035, 0.035, 0, BIN.d / 2], [0.035, 0.035, BIN.d, -BIN.w / 2, 0], [0.035, 0.035, BIN.d, BIN.w / 2, 0]]
      .forEach(([w, h, d, x, z]) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); b.position.set(x, 0, z); level.add(b); }); }
  const binLabel = (() => {
    const { tex, w } = textTexture('the pile', { bg: '#e9e5de', font: '600 52px "Instrument Sans"' });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.55, TILE_D * 0.55), new THREE.MeshBasicMaterial({ map: tex }));
    m.rotation.x = -Math.PI / 2; m.position.set(0, 0.002, BIN.d / 2 + 0.24); bin.add(m); return m;
  })();

  // ---------- dial ----------
  const dial = new THREE.Group(); dial.position.set(DIAL.x, 0, DIAL.z); scene.add(dial);
  {
    const cv = document.createElement('canvas'); cv.width = cv.height = 800; const g = cv.getContext('2d');
    g.translate(400, 400);
    const names = ['Diplomatic', 'Measured', 'Balanced', 'Blunt', 'Obliterate'];
    g.textAlign = 'center'; g.textBaseline = 'middle';
    names.forEach((n, i) => {
      const a = ANG[i] - Math.PI / 2; // canvas angle (0 = right, top = -PI/2)
      g.save(); g.rotate(a);
      g.fillStyle = i === 4 ? '#c46a00' : '#141414';
      g.fillRect(178, -5, 40, 10);
      g.restore();
      const ca = Math.cos(a); const rx = ca * 234, ry = Math.sin(a) * 234;
      g.textAlign = ca < -0.35 ? 'right' : ca > 0.35 ? 'left' : 'center';
      g.font = '700 25px "Instrument Sans"'; g.fillStyle = i === 4 ? '#c46a00' : '#141414';
      g.fillText(n, rx, ry);
    });
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
    const plate = new THREE.Mesh(new THREE.CircleGeometry(2.0, 64), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
    plate.rotation.x = -Math.PI / 2; plate.position.y = 0.004; dial.add(plate);
  }
  const base = new THREE.Mesh(new THREE.CylinderGeometry(DIAL.r + 0.1, DIAL.r + 0.14, 0.1, 48), new THREE.MeshStandardMaterial({ color: C.ink, roughness: 0.5 }));
  base.position.y = 0.05; base.castShadow = true; dial.add(base);
  const knob = new THREE.Group(); knob.position.y = 0.1; dial.add(knob);
  const knobBody = new THREE.Mesh(new THREE.CylinderGeometry(DIAL.r, DIAL.r, 0.34, 48), new THREE.MeshStandardMaterial({ color: C.paper, roughness: 0.35, metalness: 0.05 }));
  knobBody.position.y = 0.17; knobBody.castShadow = true; knob.add(knobBody);
  for (let i = 0; i < 28; i++) { // grip ridges
    const r = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.3, 0.05), new THREE.MeshStandardMaterial({ color: C.side }));
    const a = i / 28 * Math.PI * 2; r.position.set(Math.sin(a) * DIAL.r, 0.17, Math.cos(a) * DIAL.r); r.rotation.y = a; knob.add(r);
  }
  const pointer = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.03, DIAL.r * 0.8), new THREE.MeshStandardMaterial({ color: C.hot, emissive: C.hot, emissiveIntensity: 0.25 }));
  pointer.position.set(0, 0.35, -DIAL.r * 0.42); knob.add(pointer);
  const dialHit = [knobBody, base];

  // ---------- tiles ----------
  const tileGeo = new THREE.BoxGeometry(1, TILE_H, TILE_D);
  const sideMat = new THREE.MeshStandardMaterial({ color: C.side, roughness: 0.8 });
  const inkSide = new THREE.MeshStandardMaterial({ color: 0x2a2826, roughness: 0.6 });
  const hotSide = new THREE.MeshStandardMaterial({ color: 0xd07a00, roughness: 0.6 });
  const hotSide2 = new THREE.MeshStandardMaterial({ color: 0xb86a00, roughness: 0.6 });
  let inputTiles = [], outTiles = [], pileTiles = [];
  const anims = [];

  function makeTile(text, style) {
    const opts = style === 'out' ? { bg: '#141414', fg: '#faf9f7', font: '600 56px "Instrument Sans"' } : {};
    const { tex, w } = textTexture(text, opts);
    const top = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85 });
    const sm = style === 'out' ? inkSide : sideMat;
    const mesh = new THREE.Mesh(tileGeo, [sm, sm, top, sm, sm, sm]);
    const width = Math.min(w, 3.2);
    mesh.scale.set(width, 1, 1);
    mesh.castShadow = true; mesh.receiveShadow = true;
    mesh.userData = { w: width, text };
    scene.add(mesh);
    return mesh;
  }
  function hotify(mesh) {
    const { tex } = textTexture(mesh.userData.text, { bg: '#ffa01e', strike: true });
    const top = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7, emissive: C.hot, emissiveIntensity: 0.12 });
    const hs = (hotify.n = (hotify.n || 0) + 1) % 2 ? hotSide : hotSide2;
    mesh.material = [hs, hs, top, hs, hs, hs];
  }
  function dispose(m) {
    scene.remove(m);
    (Array.isArray(m.material) ? m.material : [m.material]).forEach(x => { if (x.map) x.map.dispose(); if (x !== sideMat && x !== inkSide && x !== hotSide && x !== hotSide2) x.dispose(); });
  }

  function layout(meshes, { maxRows = 5 } = {}) {
    const gap = 0.1, maxW = SHEET.w - 0.5;
    let s = 1, rows;
    for (let tries = 0; tries < 8; tries++) {
      rows = [[]]; let x = 0;
      meshes.forEach(m => {
        const w = m.userData.w * s;
        if (x > 0 && x + w > maxW) { rows.push([]); x = 0; }
        rows[rows.length - 1].push(m); x += w + gap;
      });
      const rowD = (TILE_D + 0.12) * s;
      if (rows.length * rowD <= SHEET.d - 0.35 && rows.length <= maxRows) break;
      s *= 0.86;
    }
    const rowD = (TILE_D + 0.12) * s;
    const z0 = SHEET.z - (rows.length - 1) * rowD / 2;
    const out = [];
    rows.forEach((r, ri) => {
      const total = r.reduce((a, m) => a + m.userData.w * s, 0) + gap * (r.length - 1);
      let x = -total / 2;
      r.forEach(m => {
        const w = m.userData.w * s;
        out.push({ m, x: x + w / 2, z: z0 + ri * rowD, s });
        x += w + gap;
      });
    });
    return out;
  }

  const animate = (dur, fn, delay = 0) => new Promise(res => anims.push({ t0: performance.now() + delay, dur, fn, res }));

  let gen = 0;
  function setInput(tokens) {
    gen++;
    inputTiles.forEach(dispose); inputTiles = [];
    const list = tokens.slice(0, 44);
    if (tokens.length > 44) list.push({ text: '…', jargon: false });
    inputTiles = list.map(t => { const m = makeTile(t.text); m.userData.token = t; return m; });
    layout(inputTiles).forEach(({ m, x, z, s }) => {
      m.position.set(x, sheetTop + TILE_H / 2, z); m.scale.x = m.userData.w * s; m.scale.z = s; m.scale.y = s;
      m.userData.home = m.position.clone(); m.userData.s = s;
    });
  }

  function clearOutput() {
    outTiles.forEach(dispose); outTiles = [];
    pileTiles.forEach(dispose); pileTiles = [];
    level.position.y = 0.03;
  }

  let currentLevel = 2, shaking = 0;
  async function shift({ out, score }) {
    const my = ++gen;
    clearOutput();
    // restore any sunk input tiles
    inputTiles.forEach(m => { if (m.userData.home) { m.position.copy(m.userData.home); m.visible = true; } });
    const jar = inputTiles.filter(m => m.userData.token?.jargon);
    const plain = inputTiles.filter(m => !m.userData.token?.jargon);
    const intensity = 0.4 + currentLevel * 0.25;
    const speed = reduced ? 0 : 1;

    // 1. flag the jargon
    jar.forEach(m => { hotify(m); m.userData.thrown = true; });
    if (speed) {
      await Promise.all(jar.map((m, i) => animate(420, t => {
        const h = m.userData.home;
        m.position.y = h.y + Math.sin(t * Math.PI) * 0.35 + (t > .5 ? 0.12 : t * .24);
        m.rotation.z = Math.sin(t * 22) * 0.06 * intensity * (1 - t);
      }, i * 40)));
      if (my !== gen) return;
    }

    // 2. throw them into the pile
    const H = Math.max(0.1, score / 100 * (BIN.h - 0.05));
    const n = Math.max(jar.length, 1);
    const thick = THREE.MathUtils.clamp(H / n, 0.09, 0.2);
    const binWorld = new THREE.Vector3(BIN.x, 0, BIN.z);
    const landings = jar.map((m, i) => {
      const fit = Math.min(1, (BIN.w - 0.45) / (m.userData.w * m.userData.s));
      return {
        m, fit,
        to: new THREE.Vector3(binWorld.x + (Math.random() - .5) * 0.2, 0.05 + thick * i + thick / 2, binWorld.z + (Math.random() - .5) * 0.22),
        ry: (Math.random() - .5) * 0.9, rz: (Math.random() - .5) * 0.12,
        sy: thick / TILE_H,
      };
    });
    let landed = 0;
    const land = () => {
      landed++;
      onScore(Math.round(score * landed / n));
      level.position.y = 0.03 + (H * landed / n);
      if (currentLevel >= 3) shaking = Math.max(shaking, 0.04 + (currentLevel - 3) * 0.06);
    };
    if (!jar.length) onScore(score);
    if (speed) {
      await Promise.all(landings.map((L, i) => {
        const from = L.m.position.clone(); const sx = L.m.scale.x, sz = L.m.scale.z, sy0 = L.m.scale.y;
        const peak = 1.6 + Math.random() * 0.6 + currentLevel * 0.15;
        const spin = (Math.random() > .5 ? 1 : -1) * (0.6 + currentLevel * 0.35) * Math.PI;
        return animate(780 - currentLevel * 60, t => {
          const e = easeIO(t);
          L.m.position.lerpVectors(from, L.to, e);
          L.m.position.y = THREE.MathUtils.lerp(from.y, L.to.y, e) + Math.sin(t * Math.PI) * peak;
          L.m.rotation.set(spin * e * (1 - e) * 2 * 0.3, L.ry * e, L.rz * e + spin * (1 - e) * 0.25 * Math.sin(t * Math.PI));
          L.m.scale.set(sx * THREE.MathUtils.lerp(1, L.fit, e), THREE.MathUtils.lerp(sy0, L.sy, e), THREE.MathUtils.lerp(sz, 1, e));
          if (t === 1) land();
        }, 120 + i * (150 - currentLevel * 18));
      }));
    } else {
      landings.forEach(L => { L.m.position.copy(L.to); L.m.rotation.set(0, L.ry, L.rz); L.m.scale.set(L.m.scale.x * L.fit, L.sy, 1); land(); });
    }
    if (my !== gen) return;
    pileTiles = jar.slice(); inputTiles = plain;
    pileTiles.forEach(m => { m.userData.inPile = true; });

    // 3. sink what's left, raise the plain version
    if (speed) {
      await Promise.all(plain.map((m, i) => animate(340, t => { m.position.y = m.userData.home.y - ease(t) * 0.3; m.scale.y = m.userData.s * (1 - ease(t)); if (t === 1) m.visible = false; }, i * 10)));
    } else plain.forEach(m => m.visible = false);
    if (my !== gen) return;

    outTiles = out.split(/\s+/).filter(Boolean).map(w => makeTile(w, 'out'));
    const pos = layout(outTiles, { maxRows: 4 });
    pos.forEach(({ m, x, z, s }) => { m.scale.set(m.userData.w * s, 0.001, s); m.position.set(x, sheetTop, z); m.userData.s = s; });
    if (speed) {
      await Promise.all(pos.map(({ m, s }, i) => animate(420, t => {
        const e = ease(t); m.scale.y = Math.max(0.001, s * e); m.position.y = sheetTop + TILE_H * s / 2 + Math.sin(t * Math.PI) * 0.25;
      }, i * 55)));
    } else pos.forEach(({ m, s }) => { m.scale.y = s; m.position.y = sheetTop + TILE_H * s / 2; });
  }

  // ---------- level / dial ----------
  let knobAngle = ANG[2], knobTarget = ANG[2];
  function setLevel(i, fromScene = false) {
    currentLevel = i; knobTarget = ANG[i];
    rim.intensity = [0, 0.6, 2, 6, 14][i];
    key.color.setHex([0xfff4e8, 0xfff6ec, 0xfff6ea, 0xfff0dc, 0xffe2b8][i]);
    hemi.intensity = [1.7, 1.6, 1.5, 1.35, 1.15][i];
    if (fromScene) onLevel(i);
  }
  setLevel(2);

  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
  let drag = null;
  function pick(e, list) {
    const r = canvas.getBoundingClientRect();
    ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ptr, camera);
    return ray.intersectObjects(list, false)[0];
  }
  function angleAt(e) {
    const r = canvas.getBoundingClientRect();
    const c = new THREE.Vector3(DIAL.x, 0.3, DIAL.z).project(camera);
    const cx = (c.x + 1) / 2 * r.width + r.left, cy = (1 - c.y) / 2 * r.height + r.top;
    return Math.atan2(e.clientX - cx, -(e.clientY - cy)); // 0 = up
  }
  canvas.addEventListener('pointerdown', e => {
    if (pick(e, dialHit)) {
      drag = { start: angleAt(e), knob0: knobTarget, moved: false };
      canvas.setPointerCapture(e.pointerId); e.preventDefault();
    } else if (e.pointerType !== 'mouse') hover(e);
  });
  function hover(e) {
    const overPile = pileTiles.length ? pick(e, pileTiles) : null;
    if (overPile) {
      const t = overPile.object.userData.token; const r = canvas.getBoundingClientRect();
      tooltip.show(`<b>${esc(t.text.replace(/[^\w\s'’-]+$/g, ''))}</b>${t.meaning ? ' = ' + esc(t.meaning) : ''}`, e.clientX - r.left, e.clientY - r.top);
    } else tooltip.hide();
    return overPile;
  }
  canvas.addEventListener('pointermove', e => {
    if (drag) {
      let d = angleAt(e) - drag.start; d = Math.atan2(Math.sin(d), Math.cos(d));
      if (Math.abs(d) > 0.08) drag.moved = true;
      // screen clockwise = knob clockwise from above = negative y rotation
      knobTarget = THREE.MathUtils.clamp(drag.knob0 + d, ANG[0] - 0.2, ANG[4] + 0.2);
      const near = ANG.reduce((b, a, i) => Math.abs(a - knobTarget) < Math.abs(ANG[b] - knobTarget) ? i : b, 0);
      if (near !== currentLevel) { currentLevel = near; onLevel(near); setLevel(near); knobTarget = THREE.MathUtils.clamp(drag.knob0 + d, ANG[0] - 0.2, ANG[4] + 0.2); }
      return;
    }
    if (e.pointerType !== 'mouse') return;
    const overDial = pick(e, dialHit);
    const overPile = overDial ? (tooltip.hide(), null) : hover(e);
    canvas.style.cursor = overDial ? 'grab' : overPile ? 'help' : '';
  });
  const endDrag = e => {
    if (!drag) return;
    if (!drag.moved) { const n = (currentLevel + 1) % 5; setLevel(n, true); }
    else setLevel(currentLevel, true);
    drag = null;
  };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') tooltip.hide(); });

  // ---------- loop ----------
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const fit = Math.max(1.18, 1.5 / camera.aspect);
    camera.position.copy(camBase).sub(look).multiplyScalar(fit).add(look);
    camera.lookAt(look);
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas); resize();

  let visible = true;
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(canvas);
  const clock = new THREE.Clock();
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    for (let i = anims.length - 1; i >= 0; i--) {
      const a = anims[i]; if (now < a.t0) continue;
      const t = Math.min(1, (now - a.t0) / a.dur); a.fn(t);
      if (t >= 1) { anims.splice(i, 1); a.res(); }
    }
    if (!visible) return;
    knobAngle += (knobTarget - knobAngle) * Math.min(1, dt * 14);
    knob.rotation.y = -knobAngle;
    if (!reduced) {
      // idle life: obliterate makes the unshifted words tremble
      const tremble = currentLevel === 4 ? 0.012 : currentLevel === 3 ? 0.004 : 0;
      inputTiles.forEach((m, i) => { if (m.userData.home && m.visible && !m.userData.thrown && !anims.length) { m.position.y = m.userData.home.y + Math.sin(now / 90 + i) * tremble; } });
      outTiles.forEach((m, i) => { if (!anims.length) m.position.y = sheetTop + TILE_H * m.userData.s / 2 + Math.sin(now / 700 + i * .6) * 0.012; });
    }
    camera.position.copy(camBase).sub(look).multiplyScalar(Math.max(1.18, 1.5 / camera.aspect)).add(look);
    if (shaking > 0.001) {
      camera.position.x += (Math.random() - .5) * shaking; camera.position.y += (Math.random() - .5) * shaking;
      shaking *= 0.86;
    }
    camera.lookAt(look);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);

  return { setInput, shift, setLevel: i => setLevel(i), reset: () => { gen++; clearOutput(); onScore(null); } };
}
