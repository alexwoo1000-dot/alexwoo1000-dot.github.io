/* HORNFILLER notes: small pictures and demos in the board's visual language.
 * HC.NotesView.renderDiagram(spec) -> <svg>
 *   spec = { dots:[{id,label,x,y}], arrows:[{from,to,label,dashed?,bend?,kind?}], fills:[[a,b,c]], ghost?:[[a,b,c]] }
 *   x 0..100, y 0..60. bend: signed sideways offset of the arrow's middle as a fraction of its length
 *   (positive = to the left of the direction of travel, i.e. up for a left-to-right arrow).
 *   Parallel arrows without an explicit bend are curved apart automatically. from === to draws a loop.
 *   kind: given|composite|solved|identity (dashed: true or a label like "1_a" means identity).
 *   A fill/ghost [a,b,c] follows the arrows between those dots (the first one listed, if several).
 * HC.NotesView.mountDemo(container, id) -> { el, destroy() }   ids: horn-fill, split-vertex, tetra-3d, order-maps */
(function () {
  'use strict';
  var HC = window.HC || (window.HC = {});
  var NS = 'http://www.w3.org/2000/svg';
  var SC = 6, VR = 20, AFONT = 29, AH = 17, AW = 7;
  var HATCH_SEQ = 0;

  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    if (attrs) for (var k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function hel(tag, cls, parent, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    if (parent) parent.appendChild(e);
    return e;
  }
  function r1(x) { return Math.round(x * 10) / 10; }
  function pt(p) { return r1(p.x) + ',' + r1(p.y); }
  function reducedMotion() {
    try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { return false; }
  }

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
  function fillLabel(tx, label) {
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

  /* ---------- geometry ---------- */
  function towards(P, Q, d) { var dx = Q.x - P.x, dy = Q.y - P.y, L = Math.hypot(dx, dy) || 1; return { x: P.x + dx / L * d, y: P.y + dy / L * d }; }
  function arrowKind(a) {
    if (/^(given|composite|solved|identity)$/.test(a.kind)) return a.kind;
    if (a.dashed) return 'identity';
    if (/^1_/.test(String(a.label || ''))) return 'identity';
    return 'given';
  }
  // bendPx: sideways displacement of the curve's middle (positive = left of travel on screen)
  function arrowGeo(P0, P1, bendPx) {
    var dx = P1.x - P0.x, dy = P1.y - P0.y, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
    var n = { x: uy, y: -ux };
    var mid = { x: (P0.x + P1.x) / 2, y: (P0.y + P1.y) / 2 };
    var C = { x: mid.x + n.x * 2 * bendPx, y: mid.y + n.y * 2 * bendPx };
    var S = towards(P0, C, VR + 3), E = towards(P1, C, VR + 4);
    var top = { x: mid.x + n.x * bendPx, y: mid.y + n.y * bendPx };
    return { type: 'q', P0: P0, P1: P1, C: C, S: S, E: E, top: top, n: n, L: L, bend: bendPx, dir: towards({ x: 0, y: 0 }, { x: E.x - C.x, y: E.y - C.y }, 1) };
  }
  // a loop leaving the dot in direction `deg` (screen degrees, -90 = straight up)
  function loopGeo(P, deg) {
    var m = (typeof deg === 'number' && isFinite(deg) ? deg : -90) * Math.PI / 180;
    var a1 = m - 0.5, a2 = m + 0.5, far = VR + 92;
    var S = { x: P.x + Math.cos(a1) * (VR + 3), y: P.y + Math.sin(a1) * (VR + 3) }, E = { x: P.x + Math.cos(a2) * (VR + 4), y: P.y + Math.sin(a2) * (VR + 4) };
    var C1 = { x: P.x + Math.cos(a1 - 0.08) * far, y: P.y + Math.sin(a1 - 0.08) * far }, C2 = { x: P.x + Math.cos(a2 + 0.08) * far, y: P.y + Math.sin(a2 + 0.08) * far };
    var top = { x: (S.x + E.x) / 8 + 3 * (C1.x + C2.x) / 8, y: (S.y + E.y) / 8 + 3 * (C1.y + C2.y) / 8 };
    return { type: 'loop', P0: P, P1: P, S: S, E: E, C1: C1, C2: C2, top: top, n: { x: Math.cos(m), y: Math.sin(m) }, L: 0, bend: 1, dir: towards({ x: 0, y: 0 }, { x: E.x - C2.x, y: E.y - C2.y }, 1) };
  }
  function headPoints(T, u) {
    return [[T.x, T.y], [T.x - u.x * AH - u.y * AW, T.y - u.y * AH + u.x * AW], [T.x - u.x * AH * 0.72, T.y - u.y * AH * 0.72], [T.x - u.x * AH + u.y * AW, T.y - u.y * AH - u.x * AW]]
      .map(function (q) { return r1(q[0]) + ',' + r1(q[1]); }).join(' ');
  }
  function lineD(g) {
    var e = { x: g.E.x - g.dir.x * AH * 0.6, y: g.E.y - g.dir.y * AH * 0.6 };
    if (g.type === 'loop') return 'M' + pt(g.S) + ' C' + pt(g.C1) + ' ' + pt(g.C2) + ' ' + pt(e);
    if (Math.abs(g.bend) < 0.5) return 'M' + pt(g.S) + ' L' + pt(e);
    return 'M' + pt(g.S) + ' Q' + pt(g.C) + ' ' + pt(e);
  }

  /* draw a spec into an svg (cleared first). o: { fresh:{arrow index:1, 'fill:i':1}, unit: SC } -> geometry */
  function drawInto(svg, spec, o) {
    o = o || {};
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    spec = spec || {};
    var dots = Array.isArray(spec.dots) ? spec.dots : [], arrows = Array.isArray(spec.arrows) ? spec.arrows : [];
    var pos = {}, box = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
    function grow(x, y, hw, hh) { box.x0 = Math.min(box.x0, x - hw); box.x1 = Math.max(box.x1, x + hw); box.y0 = Math.min(box.y0, y - hh); box.y1 = Math.max(box.y1, y + hh); }
    dots.forEach(function (d) { if (d && d.id != null) { pos[d.id] = { x: (+d.x || 0) * SC, y: (+d.y || 0) * SC }; grow(pos[d.id].x, pos[d.id].y, VR + 6, VR + 6); } });
    var cx = 0, cy = 0, nd = 0;
    for (var id in pos) { cx += pos[id].x; cy += pos[id].y; nd++; }
    if (nd) { cx /= nd; cy /= nd; }

    // parallel groups
    var groups = {};
    arrows.forEach(function (a, i) {
      if (!a || !pos[a.from] || !pos[a.to] || a.from === a.to) return;
      var k = [String(a.from), String(a.to)].sort().join('\u0000');
      (groups[k] = groups[k] || []).push(i);
    });
    var geo = [];
    arrows.forEach(function (a, i) {
      if (!a || !pos[a.from] || !pos[a.to]) return;
      if (a.from === a.to) { geo[i] = loopGeo(pos[a.from], a.loopDir); return; }
      var P0 = pos[a.from], P1 = pos[a.to], L = Math.hypot(P1.x - P0.x, P1.y - P0.y);
      var bendPx = 0;
      if (typeof a.bend === 'number' && isFinite(a.bend)) bendPx = a.bend * L;
      else {
        var k = [String(a.from), String(a.to)].sort().join('\u0000'), g = groups[k];
        if (g.length > 1) {
          var free = g.filter(function (j) { return typeof arrows[j].bend !== 'number'; }), at = free.indexOf(i), nf = free.length;
          var spacing = Math.max(30, 0.2 * L), canon = String(a.from) <= String(a.to) ? 1 : -1;
          var off = nf > 1 ? (at - (nf - 1) / 2) * spacing : spacing * 0.5;
          bendPx = off * canon;
        }
      }
      geo[i] = arrowGeo(P0, P1, bendPx);
    });

    var gB = el('g', { class: 'nv-back' }, svg), gF = el('g', { class: 'nv-fills' }, svg), gG = el('g', { class: 'nv-ghosts' }, svg), gX = el('g', { class: 'nv-extra' }, svg),
      gA = el('g', { class: 'nv-arrows' }, svg), gL = el('g', { class: 'nv-labels' }, svg), gD = el('g', { class: 'nv-dots' }, svg);

    function triD(t) {
      if (!Array.isArray(t) || t.length < 3 || !pos[t[0]] || !pos[t[1]] || !pos[t[2]]) return null;
      function seg(X, Y) {
        for (var i = 0; i < arrows.length; i++) {
          var a = arrows[i], g = geo[i];
          if (!g || g.type !== 'q') continue;
          if ((a.from === X && a.to === Y) || (a.from === Y && a.to === X)) return Math.abs(g.bend) < 0.5 ? ' L' + pt(pos[Y]) : ' Q' + pt(g.C) + ' ' + pt(pos[Y]);
        }
        return ' L' + pt(pos[Y]);
      }
      return 'M' + pt(pos[t[0]]) + seg(t[0], t[1]) + seg(t[1], t[2]) + seg(t[2], t[0]) + 'Z';
    }
    // a solid: one gradient per face (light falling across the surface) with a glow inside the body
    var gradUrls = {};
    function gradFill(g) {
      var key = JSON.stringify(g);
      if (gradUrls[key]) return gradUrls[key];
      var pid = 'nv-grad-' + (++HATCH_SEQ);
      var defs = el('defs', null, svg);
      var lg = el('linearGradient', { id: pid, gradientUnits: 'objectBoundingBox', x1: g.x1 == null ? 0 : g.x1, y1: g.y1 == null ? 0 : g.y1, x2: g.x2 == null ? 1 : g.x2, y2: g.y2 == null ? 1 : g.y2 }, defs);
      el('stop', { offset: '0', style: 'stop-color: var(--vol);stop-opacity:' + (g.a == null ? 0.05 : g.a) }, lg);
      el('stop', { offset: '1', style: 'stop-color: var(--vol);stop-opacity:' + (g.b == null ? 0.3 : g.b) }, lg);
      gradUrls[key] = 'url(#' + pid + ')';
      return gradUrls[key];
    }
    if (spec.glow && Array.isArray(spec.glow.pts) && spec.glow.pts.length === 3) {
      var gl = spec.glow, gid = 'nv-glow-' + (++HATCH_SEQ), gdefs = el('defs', null, svg);
      var rg = el('radialGradient', { id: gid, gradientUnits: 'userSpaceOnUse', cx: r1((gl.cx || 0) * SC), cy: r1((gl.cy || 0) * SC), r: r1((gl.r || 20) * SC) }, gdefs);
      el('stop', { offset: '0', style: 'stop-color: var(--vol);stop-opacity:' + (gl.op == null ? 0.2 : gl.op) }, rg);
      el('stop', { offset: '1', style: 'stop-color: var(--vol);stop-opacity:0' }, rg);
      var gd = triD(gl.pts);
      if (gd) el('path', { d: gd, fill: 'url(#' + gid + ')' }, gB);
    }
    (spec.fills || []).forEach(function (f, i) {
      // a fill is [a,b,c], or { pts:[a,b,c], cls:'...', hatch?:true } when it needs its own shading
      var t = Array.isArray(f) ? f : (f && f.pts) || null;
      var extra = (!Array.isArray(f) && f && f.cls) ? ' ' + f.cls : '';
      var d = triD(t); if (!d) return;
      var grad = (!Array.isArray(f) && f && f.grad) ? f.grad : null;
      if (grad) el('path', { d: d, class: 'nv-grad' + extra + (o.fresh && o.fresh['fill:' + i] ? ' fresh' : ''), fill: gradFill(grad) }, gF);
      else el('path', { d: d, class: 'nv-fill tc' + (i % 4) + extra + (o.fresh && o.fresh['fill:' + i] ? ' fresh' : '') }, gF);
    });
    (spec.ghost || []).forEach(function (t) {
      var d = triD(t); if (!d) return;
      el('path', { d: d, class: 'nv-ghost' }, gG);
    });

    var placed = [];
    arrows.forEach(function (a, i) {
      var g = geo[i]; if (!g) return;
      var kind = arrowKind(a);
      var cls = 'nv-arrow k-' + kind + (a.hi ? ' hi' : '') + (a.cls ? ' ' + a.cls : '') + (o.fresh && o.fresh[i] ? ' fresh' : '');
      var grp = el('g', { class: cls }, gA);
      var line = el('path', { d: lineD(g), class: 'nv-line' }, grp);
      if (o.fresh && o.fresh[i]) line.setAttribute('pathLength', '1');
      el('polygon', { points: headPoints(g.E, g.dir), class: 'nv-ah' }, grp);
      if (g.type === 'q') grow(g.top.x, g.top.y, 6, 6); else grow(g.top.x - g.n.x * 20, g.top.y - g.n.y * 20, 46, 46);
      if (a.label == null || a.label === '') return;
      var text = String(a.label), hw = Math.max(0.6, labelWidth(text)) * AFONT * 0.28 + 3, hh = AFONT * 0.62;
      var side;
      if (g.type === 'loop') side = 1;
      else if (Math.abs(g.bend) >= 0.5) side = g.bend > 0 ? 1 : -1;
      else {
        var mdx = (g.P0.x + g.P1.x) / 2 - cx, mdy = (g.P0.y + g.P1.y) / 2 - cy, dot = mdx * g.n.x + mdy * g.n.y;
        side = Math.abs(dot) < 1 ? (g.n.y <= 0 ? 1 : -1) : (dot > 0 ? 1 : -1);
        if (a.side === 'in') side = -side;
      }
      var d = hw * Math.abs(g.n.x) + hh * Math.abs(g.n.y) + 8;
      var lx = g.top.x + g.n.x * side * d, ly = g.top.y + g.n.y * side * d;
      if (g.type === 'loop') { lx = g.top.x + g.n.x * (hw + 6); ly = g.top.y + g.n.y * (hh + 6); }
      // nudge off earlier labels
      for (var it = 0; it < 8; it++) {
        var hit = placed.some(function (p) { return Math.abs(p.x - lx) < p.hw + hw && Math.abs(p.y - ly) < p.hh + hh; });
        if (!hit) break;
        lx += g.n.x * side * 6; ly += g.n.y * side * 6;
      }
      placed.push({ x: lx, y: ly, hw: hw, hh: hh });
      grow(lx, ly, hw + 2, hh + 2);
      var tx = el('text', { x: r1(lx), y: r1(ly), class: 'nv-alabel k-' + kind + (a.hi ? ' hi' : '') + (a.cls ? ' ' + a.cls : '') + (o.fresh && o.fresh[i] ? ' fresh' : ''), 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': AFONT }, gL);
      fillLabel(tx, text);
    });

    dots.forEach(function (d) {
      if (!d || !pos[d.id]) return;
      var p = pos[d.id];
      var g = el('g', { class: 'nv-dot' + (d.cls ? ' ' + d.cls : ''), transform: 'translate(' + pt(p) + ')', 'data-id': d.id }, gD);
      el('circle', { r: VR + 6, class: 'nv-vring' }, g);
      el('circle', { r: VR, class: 'nv-vdot' }, g);
      var lab = d.label == null ? String(d.id) : String(d.label);
      var tx = el('text', { class: 'nv-vlabel', 'text-anchor': 'middle', 'dominant-baseline': 'central', y: 1, 'font-size': labelWidth(lab) > 1.5 ? 17 : 23 }, g);
      fillLabel(tx, lab);
    });
    return { pos: pos, geo: geo, box: box, extra: gX };
  }

  function renderDiagram(spec) {
    var svg = el('svg', { class: 'nv-svg nv-diagram', role: 'img' });
    var g;
    try { g = drawInto(svg, spec); } catch (e) { g = { box: { x0: Infinity } }; }
    var b = g.box, m = 8;
    if (!isFinite(b.x0)) b = { x0: 0, y0: 0, x1: 600, y1: 360 };
    var w = b.x1 - b.x0 + 2 * m, h = b.y1 - b.y0 + 2 * m;
    svg.setAttribute('viewBox', [r1(b.x0 - m), r1(b.y0 - m), r1(w), r1(h)].join(' '));
    svg.style.maxWidth = Math.round(Math.min(520, w * 0.62)) + 'px';
    var labels = (spec && spec.arrows || []).map(function (a) { return a && a.label ? a.label + ': ' + a.from + ' to ' + a.to : ''; }).filter(Boolean);
    svg.setAttribute('aria-label', 'Diagram' + (labels.length ? ' with arrows ' + labels.join('; ') : ''));
    return svg;
  }

  /* ---------- demos ---------- */
  function frame(container, id, vb) {
    var fig = hel('figure', 'nv-demo nv-demo-' + id, container);
    var svg = el('svg', { class: 'nv-svg', viewBox: vb.join(' ') }, fig);
    var cap = hel('figcaption', 'nv-cap', fig);
    cap.setAttribute('aria-live', 'polite');
    var ctrl = hel('div', 'nv-ctrl', fig);
    return { fig: fig, svg: svg, cap: cap, ctrl: ctrl };
  }
  function button(parent, label, onClick, cls) {
    var b = hel('button', cls || 'mini', parent); b.type = 'button'; b.innerHTML = label;
    b.addEventListener('click', onClick);
    return b;
  }
  function svgPoint(svg, e) {
    var m = svg.getScreenCTM(); if (!m) return { x: 0, y: 0 };
    var p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
    var q = p.matrixTransform(m.inverse());
    return { x: q.x, y: q.y };
  }
  function near(p, q, r) { return Math.hypot(p.x - q.x, p.y - q.y) <= r; }

  var DEMOS = {};

  /* horn-fill: drag the missing side into Λ²₁ */
  DEMOS['horn-fill'] = function (container) {
    var F = frame(container, 'horn-fill', [0, -10, 600, 340]);
    var svg = F.svg, mode = 'horn', filled = false, armed = false, band = null, fresh = null, geo = null, failT = 0;
    var DOTS = [{ id: '0', label: '0', x: 12, y: 46 }, { id: '1', label: '1', x: 50, y: 6 }, { id: '2', label: '2', x: 88, y: 46 }];
    var CAP = {
      horn: 'A horn Λ<sup>2</sup><sub>1</sub>: <i>f</i> then <i>g</i>, with the side 0→2 missing. Drag from 0 to 2 to fill it.',
      filled: 'Filled! The new arrow <i>f·g</i> is <em>a</em> composite of <i>f</i> then <i>g</i>; the shaded triangle is the witness.',
      non: 'Not a horn: <i>f</i>: 0→1 and <i>g</i>: 2→1 both arrive at 1. Try dragging from 0 to 2 anyway.',
      nonFail: 'Nothing to fill: <i>f</i> and <i>g</i> don’t meet end to end, so there is no path 0→1→2 to compose.',
      start: 'Start at 0: the missing arrow goes from 0 to 2.',
      miss: 'Let go on 2 to close the triangle.'
    };
    function spec() {
      var s = { dots: DOTS.map(function (d) { var c = {}; for (var k in d) c[k] = d[k]; return c; }), arrows: [], fills: [], ghost: [] };
      s.arrows.push({ from: '0', to: '1', label: 'f' });
      s.arrows.push(mode === 'horn' ? { from: '1', to: '2', label: 'g' } : { from: '2', to: '1', label: 'g' });
      if (mode === 'horn' && filled) { s.arrows.push({ from: '0', to: '2', label: 'f·g', kind: 'composite' }); s.fills.push(['0', '1', '2']); }
      else if (mode === 'horn') { s.ghost.push(['0', '1', '2']); s.arrows.push({ from: '0', to: '2', label: '?', kind: 'given', cls: 'want' }); }
      if (failT) { s.arrows[0].cls = 'nope'; s.arrows[1].cls = 'nope'; }
      if (armed || band) s.dots[0].cls = 'sel';
      if ((armed || band) && !filled) s.dots[2].cls = 'pulse';
      return s;
    }
    function draw() {
      geo = drawInto(svg, spec(), { fresh: fresh });
      fresh = null;
      if (band) {
        var P0 = geo.pos['0'], S = towards(P0, band, VR + 3), L = Math.hypot(band.x - S.x, band.y - S.y);
        if (L > AH) {
          var u = { x: (band.x - S.x) / L, y: (band.y - S.y) / L };
          var g = el('g', { class: 'nv-band' + (band.back ? ' back' : '') }, geo.extra);
          el('path', { d: 'M' + pt(S) + ' L' + pt({ x: band.x - u.x * AH * 0.6, y: band.y - u.y * AH * 0.6 }), class: 'nv-line' }, g);
          el('polygon', { points: headPoints(band, u), class: 'nv-ah' }, g);
        }
      }
    }
    function say(k) { F.cap.innerHTML = CAP[k]; }
    function succeed() {
      armed = false; band = null;
      if (mode === 'horn') {
        filled = true; fresh = reducedMotion() ? null : { 2: 1, 'fill:0': 1 };
        say('filled'); draw(); F.fig.classList.remove('won'); void F.fig.offsetWidth; F.fig.classList.add('won');
        reset.hidden = false; auto.hidden = true;
      } else fail();
    }
    var springRaf = 0;
    function fail() {
      armed = false;
      say('nonFail');
      failT = 1;
      var from = band || { x: geo.pos['2'].x, y: geo.pos['2'].y };
      band = null;
      if (reducedMotion()) { draw(); setTimeout(function () { failT = 0; draw(); }, 900); return; }
      // the arrow slides back into 0 and fades
      var P0 = geo.pos['0'], t0 = 0;
      cancelAnimationFrame(springRaf);
      (function step(ts) {
        if (!t0) t0 = ts;
        var k = Math.min(1, (ts - t0) / 450), e = k * k;
        band = { x: from.x + (P0.x - from.x) * e, y: from.y + (P0.y - from.y) * e, back: true };
        if (k >= 1) band = null;
        draw();
        if (k < 1) springRaf = requestAnimationFrame(step);
        else setTimeout(function () { failT = 0; draw(); }, 600);
      })(performance.now());
    }
    var down = null;
    svg.addEventListener('pointerdown', function (e) {
      if (filled) return;
      var p = svgPoint(svg, e);
      down = { p: p, moved: false, id: e.pointerId };
      if (near(p, geo.pos['0'], VR + 20)) { down.from0 = true; try { svg.setPointerCapture(e.pointerId); } catch (er) {} e.preventDefault(); }
    });
    svg.addEventListener('pointermove', function (e) {
      if (!down || e.pointerId !== down.id || !down.from0) return;
      var p = svgPoint(svg, e);
      if (!down.moved && !near(p, down.p, 5)) down.moved = true;
      if (down.moved) {
        var t = geo.pos['2'];
        band = near(p, t, VR + 16) ? { x: t.x, y: t.y } : p;
        armed = false; draw();
      }
      e.preventDefault();
    });
    function up(e) {
      if (!down || e.pointerId !== down.id) return;
      var d = down; down = null;
      var p = svgPoint(svg, e), on2 = near(p, geo.pos['2'], VR + 18);
      if (d.moved && d.from0) {
        if (on2) { succeed(); return; }
        band = null; draw(); say('miss'); return;
      }
      // taps: 0 then 2
      if (near(p, geo.pos['0'], VR + 20)) { armed = !armed; draw(); if (armed) say('miss'); return; }
      if (on2 && armed) { band = { x: geo.pos['2'].x, y: geo.pos['2'].y }; succeed(); return; }
      if (near(p, geo.pos['1'], VR + 20) || on2) say('start');
    }
    svg.addEventListener('pointerup', up);
    svg.addEventListener('pointercancel', function () { down = null; band = null; draw(); });

    var toggle = button(F.ctrl, 'Show a non-example', function () {
      mode = mode === 'horn' ? 'non' : 'horn'; filled = false; armed = false; band = null; failT = 0;
      toggle.innerHTML = mode === 'horn' ? 'Show a non-example' : 'Back to the horn';
      toggle.setAttribute('aria-pressed', mode === 'non' ? 'true' : 'false');
      reset.hidden = true; auto.hidden = false; auto.innerHTML = mode === 'horn' ? 'Fill it for me' : 'Try it for me';
      say(mode); draw();
    });
    var auto = button(F.ctrl, 'Fill it for me', function () { if (!filled) { band = { x: geo.pos['2'].x, y: geo.pos['2'].y }; succeed(); } }, 'linklike');
    var reset = button(F.ctrl, 'Again', function () { filled = false; reset.hidden = true; auto.hidden = false; say(mode); draw(); }, 'linklike');
    reset.hidden = true;
    say('horn'); draw();
    return { el: F.fig, destroy: function () { cancelAnimationFrame(springRaf); F.fig.remove(); } };
  };

  /* split-vertex: pull c′ off c; the degenerate triangle (x, 1_c, y) opens into a sheet */
  DEMOS['split-vertex'] = function (container) {
    var F = frame(container, 'split-vertex', [0, 70, 600, 260]);
    var svg = F.svg;
    var A = { x: 14, y: 36 }, C = { x: 80, y: 36 }, REST = { x: 82.4, y: 38.4 };
    var cp = { x: REST.x, y: REST.y }, vel = { x: 0, y: 0 }, dragging = false, raf = 0, hold = 0, geo = null;
    var CAP = {
      idle: 'A triangle whose third side is the identity 1<sub><i>c</i></sub>: it says <i>x</i> ≃ <i>y</i>. Drag <i>c′</i> off <i>c</i>.',
      open: 'The triangle opens into a sheet between <i>x</i> and <i>y</i>: a homotopy, <i>x</i> ≃ <i>y</i>.',
      back: 'Let go and <i>c′</i> springs back: the same triangle, drawn squashed flat (degenerate).'
    };
    function sep() { return Math.hypot(cp.x - C.x, cp.y - C.y) * SC; }
    function draw() {
      var s = sep(), open = Math.min(1, Math.max(0, (s - 2 * VR) / (5 * VR)));
      var spec = {
        dots: [{ id: 'a', label: 'a', x: A.x, y: A.y }, { id: 'c', label: 'c', x: C.x, y: C.y }, { id: 'cp', label: 'c′', x: cp.x, y: cp.y, cls: 'copy' + (dragging ? ' sel' : (s < 3 * VR ? ' pulse' : '')) }],
        arrows: [{ from: 'a', to: 'c', label: 'x', bend: 0.14 }, { from: 'a', to: 'cp', label: 'y', bend: -0.14 * (1 - open) }],
        fills: [['a', 'c', 'cp']]
      };
      if (s > 2 * VR + 6) spec.arrows.push({ from: 'c', to: 'cp', label: open > 0.35 ? '1_c' : '', kind: 'identity' });
      geo = drawInto(svg, spec);
    }
    function say(k) { F.cap.innerHTML = CAP[k]; }
    function springBack() {
      cancelAnimationFrame(raf);
      if (reducedMotion()) { cp = { x: REST.x, y: REST.y }; draw(); return; }
      vel = { x: 0, y: 0 };
      (function step() {
        var ax = (REST.x - cp.x) * 0.16, ay = (REST.y - cp.y) * 0.16;
        vel.x = (vel.x + ax) * 0.74; vel.y = (vel.y + ay) * 0.74;
        cp.x += vel.x; cp.y += vel.y;
        if (Math.hypot(REST.x - cp.x, REST.y - cp.y) < 0.05 && Math.hypot(vel.x, vel.y) < 0.05) { cp = { x: REST.x, y: REST.y }; draw(); return; }
        draw(); raf = requestAnimationFrame(step);
      })();
    }
    function clampTo(p) { return { x: Math.max(4, Math.min(96, p.x / SC)), y: Math.max(16, Math.min(51, p.y / SC)) }; }
    var down = null;
    svg.addEventListener('pointerdown', function (e) {
      var p = svgPoint(svg, e);
      if (!near(p, { x: cp.x * SC, y: cp.y * SC }, VR + 22) && !near(p, { x: C.x * SC, y: C.y * SC }, VR + 16)) return;
      cancelAnimationFrame(raf); clearTimeout(hold);
      down = { id: e.pointerId, off: { x: cp.x * SC - p.x, y: cp.y * SC - p.y } };
      dragging = true; try { svg.setPointerCapture(e.pointerId); } catch (er) {}
      draw(); e.preventDefault();
    });
    svg.addEventListener('pointermove', function (e) {
      if (!down || e.pointerId !== down.id) return;
      var p = svgPoint(svg, e);
      cp = clampTo({ x: p.x + down.off.x, y: p.y + down.off.y });
      if (sep() > 3 * VR) say('open');
      draw(); e.preventDefault();
    });
    function up(e) {
      if (!down || e.pointerId !== down.id) return;
      down = null; dragging = false;
      if (sep() > 3 * VR) say('back');
      springBack();
    }
    svg.addEventListener('pointerup', up);
    svg.addEventListener('pointercancel', up);
    button(F.ctrl, 'Pull it for me', function () {
      cancelAnimationFrame(raf); clearTimeout(hold);
      var target = { x: 64, y: 54 };
      if (reducedMotion()) { cp = target; draw(); say('open'); hold = setTimeout(function () { say('back'); springBack(); }, 1800); return; }
      var from = { x: cp.x, y: cp.y }, t0 = 0;
      say('open');
      (function step(ts) {
        if (!t0) t0 = ts;
        var k = Math.min(1, (ts - t0) / 700), e = 1 - Math.pow(1 - k, 3);
        cp = { x: from.x + (target.x - from.x) * e, y: from.y + (target.y - from.y) * e };
        draw();
        if (k < 1) raf = requestAnimationFrame(step);
        else hold = setTimeout(function () { say('back'); springBack(); }, 1400);
      })(performance.now());
    }, 'linklike');
    say('idle'); draw();
    return { el: F.fig, destroy: function () { cancelAnimationFrame(raf); clearTimeout(hold); F.fig.remove(); } };
  };

  /* tetra-3d: a spinning Δ³; tap a face for its name and the horn left behind */
  DEMOS['tetra-3d'] = function (container) {
    var fig = hel('figure', 'nv-demo nv-demo-tetra-3d', container);
    var holder = hel('div', 'nv-t3', fig);
    var cap = hel('figcaption', 'nv-cap', fig);
    cap.setAttribute('aria-live', 'polite');
    var SUBD = '₀₁₂₃';
    var idle = 'Δ<sup>3</sup>: four corners 0 &lt; 1 &lt; 2 &lt; 3, every arrow going up. Drag to turn it; tap a face.';
    if (!HC.Tetra3D) { cap.innerHTML = idle; holder.innerHTML = '<p class="nv-demo-missing">(3D view not loaded)</p>'; return { el: fig, destroy: function () { fig.remove(); } }; }
    var picked = null, ctl;
    function model() {
      var edges = [];
      for (var i = 0; i < 4; i++) for (var j = i + 1; j < 4; j++) edges.push({ i: i, j: j, label: '', kind: 'given' });
      return {
        corners: [{ label: '0' }, { label: '1' }, { label: '2' }, { label: '3' }], edges: edges,
        faces: [0, 1, 2, 3].map(function (k) { return { index: k, status: picked === k ? 'missing' : 'known' }; })
      };
    }
    function pick(k) {
      picked = picked === k ? null : k;
      ctl.update(model());
      if (picked == null) { cap.innerHTML = idle; return; }
      var vs = HC.Tetra3D.FACE_VERTS[k], h = HC.Tetra3D.hornName(k, 3);
      cap.innerHTML = '<i>d</i><sub>' + k + '</sub>: the face opposite ' + k + ' (corners ' + vs.join(', ') + '). Remove it and you get the horn Λ<sup>3</sup><sub>' + k + '</sub>, ' + (h.inner ? 'inner' : 'outer') + '.';
      void SUBD;
    }
    ctl = HC.Tetra3D.mount(holder, model(), { size: 240, indices: false, onFaceClick: pick });
    cap.innerHTML = idle;
    return { el: fig, destroy: function () { ctl.destroy(); fig.remove(); } };
  };

  /* order-maps: the six order-preserving maps [1] -> [2] */
  DEMOS['order-maps'] = function (container) {
    var F = frame(container, 'order-maps', [-10, -40, 620, 410]);
    var svg = F.svg, sel = null, geo;
    var T = { '0': { x: 36, y: 50 }, '1': { x: 64, y: 16 }, '2': { x: 92, y: 50 } };
    var LOOPDIR = { '0': 160, '1': -90, '2': 20 };
    function draw() {
      var spec = {
        dots: [{ id: 's0', label: '0', x: 5, y: 12, cls: 'small' }, { id: 's1', label: '1', x: 5, y: 44, cls: 'small' },
          { id: '0', label: '0', x: T['0'].x, y: T['0'].y }, { id: '1', label: '1', x: T['1'].x, y: T['1'].y }, { id: '2', label: '2', x: T['2'].x, y: T['2'].y }],
        arrows: [{ from: 's0', to: 's1', cls: 'thin' }, { from: '0', to: '1' }, { from: '1', to: '2' }, { from: '0', to: '2' }],
        fills: [['0', '1', '2']]
      };
      if (sel) {
        var i = sel[0], j = sel[1];
        if (i === j) {
          spec.arrows.push({ from: i, to: i, label: '1_' + i, kind: 'identity', hi: true, loopDir: LOOPDIR[i] });
          spec.dots[2 + +i].cls = 'hi';
        } else spec.arrows.forEach(function (a) { if (a.from === i && a.to === j) a.hi = true; });
      }
      geo = drawInto(svg, spec);
      // the domain [1] and where its two points go
      var t = el('text', { x: 5 * SC, y: -14, class: 'nv-tag', 'text-anchor': 'middle' }, geo.extra);
      t.textContent = '[1]';
      var t2 = el('text', { x: T['1'].x * SC + 46, y: T['1'].y * SC - 14, class: 'nv-tag', 'text-anchor': 'start' }, geo.extra);
      t2.textContent = '[2]';
      if (sel) [0, 1].forEach(function (s) {
        var P = geo.pos['s' + s], Q = geo.pos[sel[s]];
        var C = { x: (P.x + Q.x) / 2, y: (P.y + Q.y) / 2 - 40 + s * 80 };
        var a = towards(P, C, VR + 4), b = towards(Q, C, VR + 8);
        el('path', { d: 'M' + pt(a) + ' Q' + pt(C) + ' ' + pt(b), class: 'nv-mapline' + (reducedMotion() ? '' : ' fresh') }, geo.extra);
      });
    }
    var btns = [];
    ['00', '01', '02', '11', '12', '22'].forEach(function (m) {
      var b = button(F.ctrl, m, function () {
        sel = sel === m ? null : m;
        btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b && sel ? 'true' : 'false'); });
        say(); draw();
      });
      b.setAttribute('aria-pressed', 'false');
      b.classList.add('nv-map');
      btns.push(b);
    });
    function say() {
      if (!sel) { F.cap.innerHTML = 'Δ<sup>2</sup> is the ordered set 0 &lt; 1 &lt; 2. An order-preserving map [1]→[2] picks <i>i</i> ≤ <i>j</i>: choose one.'; return; }
      var i = sel[0], j = sel[1];
      F.cap.innerHTML = i === j
        ? '<b>' + sel + '</b> sends both 0 and 1 to ' + i + ': degenerate: an identity, 1<sub>' + i + '</sub>, at the vertex ' + i + '.'
        : '<b>' + sel + '</b> sends 0 ↦ ' + i + ' and 1 ↦ ' + j + ': it picks out the edge ' + i + '→' + j + '.';
    }
    say(); draw();
    return { el: F.fig, destroy: function () { F.fig.remove(); } };
  };

  function mountDemo(container, id) {
    var make = DEMOS[id];
    if (make) {
      try { return make(container); } catch (e) { if (window.console) console.error('NotesView demo ' + id + ' failed', e); }
    }
    var p = hel('p', 'nv-demo-missing muted', container);
    p.textContent = '(demo “' + String(id) + '” is not available yet)';
    return { el: p, destroy: function () { p.remove(); } };
  }

  HC.NotesView = { renderDiagram: renderDiagram, mountDemo: mountDemo, demos: Object.keys(DEMOS) };
})();
