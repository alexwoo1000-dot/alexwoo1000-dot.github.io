/* HORNFILLER: a real 3D tetrahedron, projected to SVG.
 * HC.Tetra3D.mount(container, model, opts) -> { update(model), highlight(faceIndex|null), destroy() }
 * HC.Tetra3D.hornName(missingIndex[, n=3]) -> { tex, inner, text, plain, face }
 * Vanilla JS + SVG, colours only via style.css custom properties (see components.css, .t3-*). */
(function () {
  'use strict';
  var HC = window.HC || (window.HC = {});
  var NS = 'http://www.w3.org/2000/svg';

  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    if (attrs) for (var k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function r1(x) { return Math.round(x * 10) / 10; }
  function reducedMotion() {
    try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { return false; }
  }

  /* labels: "1_a", "x_{12}", unicode subscripts all render as baseline + subscript runs (same rules as the board) */
  var USUB = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
  function labelRuns(label) {
    var s = String(label == null ? '' : label), runs = [], cur = '', i = 0;
    function flush() { if (cur) { runs.push({ t: cur, sub: false }); cur = ''; } }
    while (i < s.length) {
      var c = s[i];
      if (c === '_' && i + 1 < s.length) {
        flush(); i++;
        if (s[i] === '{') { var e = s.indexOf('}', i); if (e < 0) e = s.length; runs.push({ t: s.slice(i + 1, e), sub: true }); i = e + 1; }
        else { runs.push({ t: s[i], sub: true }); i++; }
      } else if (USUB[c]) {
        flush(); var sub = ''; while (i < s.length && USUB[s[i]]) sub += USUB[s[i++]];
        runs.push({ t: sub, sub: true });
      } else { cur += c; i++; }
    }
    flush();
    return runs;
  }
  function labelWidth(label) { var w = 0; labelRuns(label).forEach(function (r) { w += r.t.length * (r.sub ? 0.62 : 1); }); return w; }
  function plainLabel(label) { return labelRuns(label).map(function (r) { return r.t; }).join(''); }
  function fillLabel(tx, label) {
    while (tx.firstChild) tx.removeChild(tx.firstChild);
    var runs = labelRuns(label);
    if (runs.length === 1 && !runs[0].sub) { tx.textContent = runs[0].t; return; }
    var down = false;
    runs.forEach(function (r) {
      var ts = el('tspan');
      if (r.sub && !down) { ts.setAttribute('dy', '0.32em'); ts.setAttribute('class', 'sub'); down = true; }
      else if (r.sub) ts.setAttribute('class', 'sub');
      else if (down) { ts.setAttribute('dy', '-0.32em'); down = false; }
      ts.textContent = r.t;
      tx.appendChild(ts);
    });
  }

  /* 3x3 row-major matrices */
  function mul(A, B) {
    var C = new Array(9);
    for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) C[i * 3 + j] = A[i * 3] * B[j] + A[i * 3 + 1] * B[3 + j] + A[i * 3 + 2] * B[6 + j];
    return C;
  }
  function rotX(a) { var c = Math.cos(a), s = Math.sin(a); return [1, 0, 0, 0, c, -s, 0, s, c]; }
  function rotY(a) { var c = Math.cos(a), s = Math.sin(a); return [c, 0, s, 0, 1, 0, -s, 0, c]; }
  function apply(M, v) { return [M[0] * v[0] + M[1] * v[1] + M[2] * v[2], M[3] * v[0] + M[4] * v[1] + M[5] * v[2], M[6] * v[0] + M[7] * v[1] + M[8] * v[2]]; }
  function orthonormalize(M) {
    var a = [M[0], M[1], M[2]], b = [M[3], M[4], M[5]];
    function n(v) { var l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }
    a = n(a); var d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    b = n([b[0] - d * a[0], b[1] - d * a[1], b[2] - d * a[2]]);
    var c = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    return a.concat(b, c);
  }

  /* regular tetrahedron, circumradius 1, y up, z towards the viewer: base 0,1,2 (1 in front), apex 3 */
  var K = Math.sqrt(8 / 9);
  var BASE = [
    [-K * Math.cos(Math.PI / 6), -1 / 3, -K * 0.5],
    [0, -1 / 3, K],
    [K * Math.cos(Math.PI / 6), -1 / 3, -K * 0.5],
    [0, 1, 0]
  ];
  var DEFAULT_VIEW = mul(rotX(0.42), rotY(-0.17));
  var FACE_VERTS = [[1, 2, 3], [0, 2, 3], [0, 1, 3], [0, 1, 2]]; // face k is opposite corner k
  var VB_W = 300, VB_H = 238, CX = 150, CY = 126, SCALE = 102, PERSP = 6, DOT_R = 14, LABEL_FONT = 17;
  var SUPD = '⁰¹²³⁴⁵⁶⁷⁸⁹', SUBD = '₀₁₂₃₄₅₆₇₈₉';
  function digits(n, set) { return String(n).replace(/\d/g, function (d) { return set[+d]; }); }

  function hornName(k, n) {
    n = n == null ? 3 : n;
    k = +k;
    var inner = k > 0 && k < n;
    var br = function (x) { return String(x).length > 1 ? '{' + x + '}' : String(x); };
    var text = 'Λ' + digits(n, SUPD) + digits(k, SUBD);
    return {
      tex: '\\Lambda^' + br(n) + '_' + br(k),
      inner: inner,
      text: text,
      face: 'd' + digits(k, SUBD),
      plain: 'missing face ' + k + ' of ' + n + ' → horn ' + text + ', ' + (inner ? 'inner' : 'outer')
    };
  }

  function mount(container, model, opts) {
    opts = opts || {};
    var size = opts.size || 280;
    var showIdx = opts.indices !== false;
    var R = (opts.view || DEFAULT_VIEW).slice();
    var sway = 0, swayT = 0, raf = 0, lastTs = 0, visible = true, inside = false, destroyed = false;
    var hl = null, hoverFace = null, prevStatus = {}, lastOrder = '';
    var labelPick = {};

    var root = el('svg', {
      class: 't3', viewBox: '0 0 ' + VB_W + ' ' + VB_H, role: 'group', tabindex: '0',
      'aria-label': 'Tetrahedron. Drag or use the arrow keys to turn it; tap a face to pick it.'
    });
    root.style.maxWidth = size + 'px';
    var gBackF = el('g', { class: 't3-layer back' }, root), gBackE = el('g', { class: 't3-layer back' }, root),
      gFrontF = el('g', { class: 't3-layer front' }, root), gFrontE = el('g', { class: 't3-layer front' }, root),
      gLocks = el('g', { class: 't3-locks' }, root), gLabels = el('g', { class: 't3-labels' }, root),
      gDots = el('g', { class: 't3-dots' }, root);

    var faces = [], edges = [], dots = [];
    for (var f = 0; f < 4; f++) {
      var fg = el('g', { class: 't3-face', 'data-face': f, tabindex: '0', role: 'button' });
      var fill = el('polygon', { class: 't3-fill' }, fg);
      var inset = el('polygon', { class: 't3-inset' }, fg);
      var title = el('title', null, fg);
      var lock = el('g', { class: 't3-lock' }, gLocks);
      el('path', { d: 'M-3.6,-1.5 V-4.2 A3.6,3.6 0 0 1 3.6,-4.2 V-1.5' }, lock);
      el('rect', { x: -5.6, y: -1.5, width: 11.2, height: 8.5, rx: 1.4 }, lock);
      faces.push({ g: fg, fill: fill, inset: inset, title: title, lock: lock, status: 'known' });
    }
    for (var c = 0; c < 4; c++) {
      var dg = el('g', { class: 't3-dot' }, gDots);
      el('circle', { r: DOT_R, class: 't3-vdot' }, dg);
      var dl = el('text', { class: 't3-vlabel', 'text-anchor': 'middle', 'dominant-baseline': 'central', y: 1 }, dg);
      var di = el('text', { class: 't3-idx', 'text-anchor': 'middle', 'dominant-baseline': 'central' }, gDots);
      dots.push({ g: dg, label: dl, idx: di });
    }
    container.appendChild(root);

    function setModel(m) {
      model = m || { corners: [], edges: [], faces: [] };
      var corners = model.corners || [];
      dots.forEach(function (d, i) {
        var lab = corners[i] && corners[i].label != null ? corners[i].label : String(i);
        fillLabel(d.label, lab);
        d.label.setAttribute('font-size', labelWidth(lab) > 1.4 ? 12 : 16);
        d.idx.textContent = showIdx ? String(i) : '';
      });
      edges.forEach(function (e) { e.g.remove(); e.lab.remove(); });
      edges = [];
      (model.edges || []).forEach(function (m2, n) {
        if (m2.i == null || m2.j == null || m2.i === m2.j || m2.i > 3 || m2.j > 3) return;
        var kind = /^(given|composite|solved|identity)$/.test(m2.kind) ? m2.kind : 'given';
        var g = el('g', { class: 't3-edge k-' + kind });
        var line = el('path', { class: 't3-line' }, g);
        var head = el('polygon', { class: 't3-ah' }, g);
        var lab = el('text', { class: 't3-elabel k-' + kind, 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': LABEL_FONT }, gLabels);
        var text = m2.label == null ? '' : String(m2.label);
        fillLabel(lab, text);
        var w = Math.max(0.6, labelWidth(text)) * LABEL_FONT * 0.56;
        edges.push({ i: +m2.i, j: +m2.j, kind: kind, g: g, line: line, head: head, lab: lab, text: text, hw: w / 2 + 2, hh: LABEL_FONT * 0.55, key: m2.i + '-' + m2.j + '-' + n });
      });
      var byIdx = {};
      (model.faces || []).forEach(function (fm) { if (fm && fm.index >= 0 && fm.index < 4) byIdx[fm.index] = fm; });
      faces.forEach(function (F, k) {
        var fm = byIdx[k] || { status: 'known' };
        var st = /^(known|chosen|missing|locked|new)$/.test(fm.status) ? fm.status : 'known';
        F.status = st;
        F.label = fm.label == null ? '' : String(fm.label);
        var vs = FACE_VERTS[k], cl = function (i) { var c2 = corners[i]; return c2 && c2.label != null ? plainLabel(c2.label) : String(i); };
        var desc = 'face ' + k + ', opposite corner ' + k + ' (' + vs.map(cl).join(', ') + '): ' + st + (F.label ? ', ' + plainLabel(F.label) : '');
        F.title.textContent = desc;
        F.g.setAttribute('aria-label', desc);
        if (st === 'new' && prevStatus[k] !== 'new' && !reducedMotion()) {
          F.g.classList.remove('pop'); void F.g.getBoundingClientRect(); F.g.classList.add('pop');
        }
        prevStatus[k] = st;
      });
      paintClasses();
    }
    function paintClasses() {
      faces.forEach(function (F, k) {
        F.g.setAttribute('class', 't3-face s-' + F.status + (hl === k ? ' hl' : '') + (hoverFace === k ? ' hov' : '') + (F.g.classList.contains('pop') ? ' pop' : '') + (F.back ? ' is-back' : ''));
        F.lock.style.display = F.status === 'locked' ? '' : 'none';
      });
    }

    function project() {
      var M = sway ? mul(rotY(sway), R) : R;
      return BASE.map(function (v) {
        var q = apply(M, v), p = PERSP / (PERSP - q[2]);
        return { x: CX + q[0] * SCALE * p, y: CY - q[1] * SCALE * p, z: q[2], p: p };
      });
    }

    function render() {
      if (destroyed) return;
      var P = project();
      var cx = (P[0].x + P[1].x + P[2].x + P[3].x) / 4, cy = (P[0].y + P[1].y + P[2].y + P[3].y) / 4;
      // faces: front-facing if the outward normal points to the viewer (outward = away from the opposite corner)
      var front = {};
      faces.forEach(function (F, k) {
        // outward normal of face k is parallel to (face centroid - corner k): it faces us iff the face is nearer than corner k
        var v = FACE_VERTS[k], a = P[v[0]], b = P[v[1]], d = P[v[2]], o = P[k];
        var fz = (a.z + b.z + d.z) / 3;
        F.back = fz < o.z;
        F.depth = fz;
        front[k] = !F.back;
        var pts = [a, b, d].map(function (q) { return r1(q.x) + ',' + r1(q.y); }).join(' ');
        F.fill.setAttribute('points', pts);
        var gx = (a.x + b.x + d.x) / 3, gy = (a.y + b.y + d.y) / 3, s = 0.72;
        F.inset.setAttribute('points', [a, b, d].map(function (q) { return r1(gx + (q.x - gx) * s) + ',' + r1(gy + (q.y - gy) * s); }).join(' '));
        F.lock.setAttribute('transform', 'translate(' + r1(gx) + ',' + r1(gy) + ')');
        F.cx = gx; F.cy = gy;
      });
      var order = faces.map(function (F, k) { return k; }).sort(function (a, b) { return faces[a].depth - faces[b].depth; });
      var key = order.map(function (k) { return k + (faces[k].back ? 'b' : 'f'); }).join('');
      if (key !== lastOrder) {
        var act = document.activeElement;
        order.forEach(function (k) { (faces[k].back ? gBackF : gFrontF).appendChild(faces[k].g); });
        if (act && act !== document.activeElement && root.contains(act)) try { act.focus({ preventScroll: true }); } catch (e) {}
        lastOrder = key;
      }
      // edges: back if no front-facing face contains it
      edges.forEach(function (E) {
        var a = P[E.i], b = P[E.j];
        var onFront = false;
        for (var k = 0; k < 4; k++) if (k !== E.i && k !== E.j && front[k]) onFront = true;
        if (E.front !== onFront || !E.g.parentNode) { (onFront ? gFrontE : gBackE).appendChild(E.g); E.front = onFront; E.g.classList.toggle('is-back', !onFront); }
        var dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
        var ra = DOT_R * a.p + 2, rb = DOT_R * b.p + 3, AH = 11, AW = 4.6;
        var tx = b.x - ux * rb, ty = b.y - uy * rb;
        if (L < ra + rb + AH) { E.line.setAttribute('d', ''); E.head.setAttribute('points', ''); }
        else {
          E.line.setAttribute('d', 'M' + r1(a.x + ux * ra) + ',' + r1(a.y + uy * ra) + ' L' + r1(tx - ux * AH * 0.6) + ',' + r1(ty - uy * AH * 0.6));
          E.head.setAttribute('points', [
            [tx, ty], [tx - ux * AH - uy * AW, ty - uy * AH + ux * AW], [tx - ux * AH * 0.72, ty - uy * AH * 0.72], [tx - ux * AH + uy * AW, ty - uy * AH - ux * AW]
          ].map(function (q) { return r1(q[0]) + ',' + r1(q[1]); }).join(' '));
        }
        E.a = a; E.b = b; E.ux = ux; E.uy = uy; E.L = L;
      });
      placeLabels(P, cx, cy);
      dots.forEach(function (D, i) {
        var q = P[i];
        D.g.setAttribute('transform', 'translate(' + r1(q.x) + ',' + r1(q.y) + ') scale(' + r1(q.p * 100) / 100 + ')');
        var ox = q.x - cx, oy = q.y - cy, ol = Math.hypot(ox, oy) || 1;
        D.idx.setAttribute('x', r1(q.x + ox / ol * (DOT_R * q.p + 9)));
        D.idx.setAttribute('y', r1(q.y + oy / ol * (DOT_R * q.p + 9)));
      });
      // nearer dots on top
      var dorder = [0, 1, 2, 3].sort(function (a, b) { return P[a].z - P[b].z; });
      if (dorder.join('') !== dots.order) { dorder.forEach(function (i) { gDots.appendChild(dots[i].g); }); dots.order = dorder.join(''); }
      paintClasses();
    }

    // greedy label placement with a little hysteresis so labels don't flicker while the solid turns
    var TS = [0.5, 0.38, 0.62, 0.28, 0.72];
    function placeLabels(P, cx, cy) {
      var placed = [];
      faces.forEach(function (F) { if (F.status === 'locked') placed.push({ x: F.cx, y: F.cy, hw: 8, hh: 8 }); });
      function boxHit(x, y, hw, hh, o) { var ox = Math.min(x + hw, o.x + o.hw) - Math.max(x - hw, o.x - o.hw), oy = Math.min(y + hh, o.y + o.hh) - Math.max(y - hh, o.y - o.hh); return ox > 0 && oy > 0 ? ox * oy : 0; }
      function segDist(px, py, a, b) {
        var dx = b.x - a.x, dy = b.y - a.y, L2 = dx * dx + dy * dy || 1, t = Math.max(0, Math.min(1, ((px - a.x) * dx + (py - a.y) * dy) / L2));
        return Math.hypot(px - a.x - t * dx, py - a.y - t * dy);
      }
      var order = edges.slice().sort(function (a, b) { return b.L - a.L; });
      order.forEach(function (E) {
        if (!E.text) { E.lab.setAttribute('x', -99); return; }
        var nx = -E.uy, ny = E.ux, mx = (E.a.x + E.b.x) / 2, my = (E.a.y + E.b.y) / 2;
        var outSign = ((mx - cx) * nx + (my - cy) * ny) >= 0 ? 1 : -1;
        var best = null;
        for (var ti = 0; ti < TS.length; ti++) for (var si = 0; si < 2; si++) {
          var t = TS[ti], sg = si === 0 ? outSign : -outSign, d = E.hw * Math.abs(nx) + E.hh * Math.abs(ny) + 3;
          var x = E.a.x + (E.b.x - E.a.x) * t + nx * sg * d, y = E.a.y + (E.b.y - E.a.y) * t + ny * sg * d;
          var cost = Math.abs(t - 0.5) * 18 + si * 5;
          for (var k = 0; k < 4; k++) { var q = P[k], rr = DOT_R * q.p + 3; cost += boxHit(x, y, E.hw, E.hh, { x: q.x, y: q.y, hw: rr, hh: rr }) * 0.6; }
          for (var j = 0; j < placed.length; j++) cost += boxHit(x, y, E.hw, E.hh, placed[j]) * 1.2;
          for (var m2 = 0; m2 < edges.length; m2++) {
            var O = edges[m2]; if (O === E || !O.a) continue;
            var dd = segDist(x, y, O.a, O.b), lim = Math.min(E.hw, E.hh) + 2;
            if (dd < lim) cost += (lim - dd) * 4;
          }
          if (x - E.hw < 2 || x + E.hw > VB_W - 2 || y - E.hh < 2 || y + E.hh > VB_H - 2) cost += 40;
          var id = ti * 2 + si;
          if (labelPick[E.key] === id) cost -= 6;
          if (!best || cost < best.cost) best = { cost: cost, x: x, y: y, id: id };
        }
        labelPick[E.key] = best.id;
        placed.push({ x: best.x, y: best.y, hw: E.hw, hh: E.hh });
        E.lab.setAttribute('x', r1(best.x));
        E.lab.setAttribute('y', r1(best.y));
      });
    }

    /* motion: gentle sway, paused while the pointer or focus is inside, off-screen, or reduced motion */
    function swayOn() { return !reducedMotion() && opts.sway !== false && visible && !inside && !drag; }
    function tick(ts) {
      raf = 0;
      if (destroyed) return;
      var dt = lastTs ? Math.min(64, ts - lastTs) : 16; lastTs = ts;
      if (swayOn()) { swayT += dt / 1000; sway = 0.2 * Math.sin(swayT * 0.55); render(); raf = requestAnimationFrame(tick); }
      else lastTs = 0;
    }
    function kick() { if (!raf && !destroyed && swayOn()) { lastTs = 0; raf = requestAnimationFrame(tick); } }

    var io = null;
    if (window.IntersectionObserver) {
      io = new IntersectionObserver(function (en) { visible = en[0] && en[0].isIntersecting; kick(); });
      io.observe(root);
    }

    /* input */
    var drag = null;
    function faceAt(target) { var g = target && target.closest ? target.closest('[data-face]') : null; return g && root.contains(g) ? +g.getAttribute('data-face') : null; }
    function setHover(k) {
      if (k === hoverFace) return;
      hoverFace = k; paintClasses();
      if (opts.onFaceHover) opts.onFaceHover(k);
    }
    function turn(dx, dy) {
      R = orthonormalize(mul(rotY(dx), mul(rotX(dy), R)));
      render();
    }
    root.addEventListener('pointerdown', function (e) {
      if (e.button != null && e.button > 0) return;
      drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY, face: faceAt(e.target), moved: false };
      try { root.setPointerCapture(e.pointerId); } catch (er) {}
    });
    root.addEventListener('pointermove', function (e) {
      if (drag && e.pointerId === drag.id) {
        if (!drag.moved && Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) > 4) { drag.moved = true; root.classList.add('turning'); setHover(null); }
        if (drag.moved) {
          var rect = root.getBoundingClientRect(), k = (VB_W / (rect.width || VB_W)) * 0.012;
          turn((e.clientX - drag.x) * k, (e.clientY - drag.y) * k);
        }
        drag.x = e.clientX; drag.y = e.clientY;
        e.preventDefault();
      } else if (e.pointerType === 'mouse') setHover(faceAt(e.target));
    });
    function endDrag(e, cancelled) {
      if (!drag || e.pointerId !== drag.id) return;
      var d = drag; drag = null;
      root.classList.remove('turning');
      if (!cancelled && !d.moved && d.face != null && opts.onFaceClick) opts.onFaceClick(d.face);
      kick();
    }
    root.addEventListener('pointerup', function (e) { endDrag(e, false); });
    root.addEventListener('pointercancel', function (e) { endDrag(e, true); });
    root.addEventListener('pointerenter', function () { inside = true; });
    root.addEventListener('pointerleave', function (e) { inside = false; if (e.pointerType === 'mouse') setHover(null); kick(); });
    root.addEventListener('focusin', function (e) { inside = true; var k = faceAt(e.target); if (k != null) setHover(k); });
    root.addEventListener('focusout', function () { inside = false; setHover(null); kick(); });
    root.addEventListener('keydown', function (e) {
      var st = Math.PI / 18;
      if (e.key === 'ArrowLeft') turn(-st, 0); else if (e.key === 'ArrowRight') turn(st, 0);
      else if (e.key === 'ArrowUp') turn(0, -st); else if (e.key === 'ArrowDown') turn(0, st);
      else if ((e.key === 'Enter' || e.key === ' ') && faceAt(e.target) != null) { if (opts.onFaceClick) opts.onFaceClick(faceAt(e.target)); }
      else return;
      e.preventDefault();
    });
    faces.forEach(function (F) { F.g.addEventListener('animationend', function () { F.g.classList.remove('pop'); }); });

    setModel(model);
    render();
    kick();

    return {
      el: root,
      update: function (m) { setModel(m); render(); },
      highlight: function (k) { hl = (k == null || k < 0 || k > 3) ? null : +k; paintClasses(); },
      reset: function () { R = (opts.view || DEFAULT_VIEW).slice(); render(); },
      destroy: function () {
        destroyed = true;
        if (raf) cancelAnimationFrame(raf);
        if (io) io.disconnect();
        if (root.parentNode) root.parentNode.removeChild(root);
      }
    };
  }

  HC.Tetra3D = { mount: mount, hornName: hornName, FACE_VERTS: FACE_VERTS };
})();
