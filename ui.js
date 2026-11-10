/* HORNFILLER: UI layer (map, board, tools, facts, goal, rulebook, glossary, ending).
 * Talks to HC.Engine / HC.Levels / HC.Text / HC.Worlds / HC.Glossary / HC.Epilogue per SPEC.md + SPEC2.md
 * and degrades gracefully when a function or field is missing. */
(function () {
  'use strict';
  var HC = window.HC || (window.HC = {});
  var SVGNS = 'http://www.w3.org/2000/svg';

  /* board geometry (svg units = logical coords * S) */
  var S = 10, VR = 21, SPACING = 62, LOOP_R = 124, LOOP_SPREAD = 25 * Math.PI / 180, LABEL_FONT = 30;

  var reduceMotion = false;
  try { reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  var DEFAULT_WORLDS = {
    1: 'Arrows', 2: 'Triangles are proofs', 3: 'Undo everything', 4: 'Nerves of categories',
    5: 'Bones', 6: 'Possible or not?', 7: 'The licence', 8: 'Playground'
  };
  var KIND_NAMES = { given: 'given', compose: 'made', thin: 'free', solved: 'solved', filled: 'deduced', cell: 'glued', trip: 'trip', theorem: 'theorem' };

  /* ---------- helpers ---------- */
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function hEl(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) { if (k === 'class') n.className = attrs[k]; else n.setAttribute(k, attrs[k]); }
    if (html != null) n.innerHTML = html;
    return n;
  }
  function sEl(tag, attrs) {
    var n = document.createElementNS(SVGNS, tag);
    if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }
  function r1(n) { return Math.round(n * 10) / 10; }
  function pt(p) { return r1(p.x) + ',' + r1(p.y); }
  function prettify(id) { id = String(id == null ? '' : id); return id.charAt(0).toUpperCase() + id.slice(1).replace(/[-_]/g, ' '); }
  function isVar(x) { return typeof x === 'string' && x.charAt(0) === '?'; }
  function arr(x) { return Array.isArray(x) ? x : []; }
  function towards(P0, Q, d) {
    var dx = Q.x - P0.x, dy = Q.y - P0.y, l = Math.sqrt(dx * dx + dy * dy) || 1;
    return { x: P0.x + dx / l * d, y: P0.y + dy / l * d };
  }
  function stripTags(s) { return String(s == null ? '' : s).replace(/<[^>]*>/g, ''); }
  function setOf(list) { var o = {}; arr(list).forEach(function (x) { o[x] = 1; }); return o; }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }

  /* ================= math rendering =================
   * Everything mathematical is built as TeX and goes through math(). With KaTeX loaded it is typeset;
   * without it a small TeX -> HTML converter gives the same content in plain serif italics. */
  var TEXSYM = {
    circ: '∘', approx: '≈', Rightarrow: '⇒', rightarrow: '→', to: '→', simeq: '≃', cong: '≅', Lambda: 'Λ', Delta: 'Δ',
    partial: '∂', infty: '∞', subset: '⊂', subseteq: '⊆', in: '∈', le: '≤', leq: '≤', ge: '≥', geq: '≥', ne: '≠',
    neq: '≠', cdot: '·', times: '×', prime: '′', backslash: '\\', ldots: '…', dots: '…', cdots: '⋯', mapsto: '↦',
    alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', sigma: 'σ', Sigma: 'Σ', pi: 'π', lambda: 'λ',
    Leftrightarrow: '⇔', iff: '⇔', hookrightarrow: '↪', sim: '∼', equiv: '≡', colon: ':', mid: '|',
    langle: '⟨', rangle: '⟩', lbrace: '{', rbrace: '}', setminus: '∖', cup: '∪', cap: '∩', emptyset: '∅',
    qquad: '  ', quad: ' ', ',': ' ', ';': ' ', ':': ' ', '!': '', ' ': ' ', '{': '{', '}': '}', '_': '_', '%': '%',
    '&': '&', '#': '#', '$': '$', Big: '', big: '', left: '', right: '', bigl: '', bigr: ''
  };
  function texToHtml(src) {
    var s = String(src), i = 0;
    function group() {
      // read one argument: {…} or a single token
      while (s[i] === ' ') i++;
      if (s[i] === '{') {
        var depth = 0, start = i + 1;
        for (; i < s.length; i++) {
          if (s[i] === '\\') { i++; continue; }
          if (s[i] === '{') depth++;
          else if (s[i] === '}') { depth--; if (!depth) { i++; return s.slice(start, i - 1); } }
        }
        return s.slice(start);
      }
      if (s[i] === '\\') { var m = /^\\([A-Za-z]+|.)/.exec(s.slice(i)); i += m ? m[0].length : 1; return m ? m[0] : ''; }
      return s[i++] || '';
    }
    var out = '';
    while (i < s.length) {
      var c = s[i];
      if (c === '\\') {
        var m = /^\\([A-Za-z]+|.)/.exec(s.slice(i));
        var name = m ? m[1] : '';
        i += m ? m[0].length : 1;
        if (name === 'text' || name === 'textrm' || name === 'textit' || name === 'mbox') out += '<span class="up">' + esc(group()) + '</span>';
        else if (name === 'mathrm' || name === 'operatorname' || name === 'mathsf') out += '<span class="up">' + texToHtml(group()) + '</span>';
        else if (name === 'mathbf' || name === 'boldsymbol') out += '<b>' + texToHtml(group()) + '</b>';
        else if (name === 'mathit' || name === 'mathcal' || name === 'mathbb' || name === 'mathscr') out += texToHtml(group());
        else if (name === 'xrightarrow') out += ' <span class="up">—</span>' + texToHtml(group()) + '<span class="up">→</span> ';
        else if (name === 'frac') { var a = texToHtml(group()), b = texToHtml(group()); out += a + '/' + b; }
        else if (name === 'sqrt') out += '√(' + texToHtml(group()) + ')';
        else if (name === 'overline' || name === 'bar') out += texToHtml(group()) + '̄';
        else if (name === 'hat' || name === 'tilde' || name === 'widetilde') out += texToHtml(group());
        else if (TEXSYM[name] != null) out += '<span class="up">' + esc(TEXSYM[name]) + '</span>';
        else out += esc(name);
      } else if (c === '_' || c === '^') {
        i++;
        var g = group();
        out += c === '_' ? '<sub>' + texToHtml(g) + '</sub>' : '<sup>' + texToHtml(g) + '</sup>';
      } else if (c === '{' ) { out += texToHtml(group()); }
      else if (c === '}') { i++; }
      else if (c === ' ' || c === '~') { i++; if (c === '~') out += ' '; }
      else if (c === "'") { i++; out += '′'; }
      else if (/[A-Za-z]/.test(c)) { i++; out += '<i>' + c + '</i>'; }
      else { i++; out += '<span class="up">' + esc(c) + '</span>'; }
    }
    return out;
  }
  function hasKatex() { return !!(window.katex && typeof window.katex.renderToString === 'function'); }
  function math(tex) {
    if (hasKatex()) {
      try { return window.katex.renderToString(String(tex), { throwOnError: true, strict: 'ignore', output: 'htmlAndMathml' }); }
      catch (e) { /* fall through to the plain version, never raw TeX */ }
    }
    return '<span class="mf">' + texToHtml(tex) + '</span>';
  }
  // prose: HTML with inline $…$ spans; also turns a bare 1_a outside math into 1<sub>a</sub>
  function prose(html) {
    var s = String(html == null ? '' : html), out = '', i = 0;
    while (i < s.length) {
      var j = s.indexOf('$', i);
      while (j > 0 && s[j - 1] === '\\') j = s.indexOf('$', j + 1);
      if (j < 0) { out += plainBits(s.slice(i)); break; }
      var k = s.indexOf('$', j + 1);
      if (k < 0) { out += plainBits(s.slice(i)); break; }
      out += plainBits(s.slice(i, j)) + math(s.slice(j + 1, k));
      i = k + 1;
    }
    return out;
  }
  function plainBits(h) { return h.replace(/\\\$/g, '$').replace(/\b1_\{?([a-z0-9])\}?/g, '1<sub>$1</sub>'); }

  /* engine labels -> TeX, all in one place */
  var USUB = { 'ₐ': 'a', 'ₑ': 'e', 'ₕ': 'h', 'ᵢ': 'i', 'ⱼ': 'j', 'ₖ': 'k', 'ₗ': 'l', 'ₘ': 'm', 'ₙ': 'n', 'ₒ': 'o', 'ₚ': 'p', 'ᵣ': 'r', 'ₛ': 's', 'ₜ': 't', 'ᵤ': 'u', 'ᵥ': 'v', 'ₓ': 'x',
    '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
  var USUP = { 'ᴸ': 'L', 'ᴿ': 'R', '¹': '1', '²': '2', '³': '3' };
  function labTeX(label) {
    var s = String(label == null ? '' : label), out = '', i = 0;
    while (i < s.length) {
      var c = s[i];
      if (c === '_') {
        i++;
        if (s[i] === '{') { var e = s.indexOf('}', i); if (e < 0) e = s.length; out += '_{' + s.slice(i + 1, e) + '}'; i = e + 1; }
        else { out += '_{' + (s[i] || '') + '}'; i++; }
      } else if (USUB[c]) {
        var sub = ''; while (i < s.length && USUB[s[i]]) sub += USUB[s[i++]];
        out += '_{' + sub + '}';
      } else if (c === '⁻' || USUP[c] || c === '′') {
        // collect a run of superscripts (and primes) into one ^{…}
        var sup = '';
        while (i < s.length && (s[i] === '⁻' || USUP[s[i]] || s[i] === '′')) {
          sup += s[i] === '⁻' ? '-' : s[i] === '′' ? '\\prime ' : USUP[s[i]];
          i++;
        }
        out += '^{' + sup.trim() + '}';
      } else if (c === "'") { out += "'"; i++; }
      else if (c === '̄' || c === '̅') {
        // combining bar over the previous letter: f̄ -> \bar{f}
        var mm = /([A-Za-z0-9])$/.exec(out);
        out = mm ? out.slice(0, -1) + '\\bar{' + mm[1] + '}' : out;
        i++;
      }
      else if (c === '∘') { out += '\\circ '; i++; }
      else if (c === '·') { out += '\\cdot '; i++; }
      else if (c === '\\') { out += '\\backslash '; i++; }
      else if (c === '≃') { out += '\\simeq '; i++; }
      else if (c === '≅') { out += '\\cong '; i++; }
      else if (/[A-Za-z0-9()\/?+\-=,]/.test(c)) { out += c; i++; }
      else if (c === ' ') { i++; }
      else { out += '\\text{' + c + '}'; i++; }
    }
    return out;
  }
  function isCompound(l) { return /[∘·\/\\]/.test(l); }

  /* SVG label: plain text with real subscripts as tspans (1_a, 1ₐ) */
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
  function labelWidth(label) {
    var w = 0; labelRuns(label).forEach(function (r) { w += r.t.length * (r.sub ? 0.62 : 1); });
    return w;
  }
  function fillLabel(tx, label) {
    var runs = labelRuns(label);
    if (runs.length === 1 && !runs[0].sub) { tx.textContent = runs[0].t; return; }
    var down = false;
    runs.forEach(function (r) {
      var ts = sEl('tspan');
      if (r.sub && !down) { ts.setAttribute('dy', '0.32em'); ts.setAttribute('class', 'sub'); down = true; }
      else if (r.sub) { ts.setAttribute('class', 'sub'); }
      else if (!r.sub && down) { ts.setAttribute('dy', '-0.32em'); down = false; }
      ts.textContent = r.t;
      tx.appendChild(ts);
    });
  }

  /* ---------- storage ---------- */
  var STORE_KEY = 'hornfiller.progress.v1';
  function loadProgress() {
    var p = { solved: {}, best: {}, seenTools: {}, unlockAll: false, theme: null, mode: 'plain',
      briefed: {}, explained: {}, notesRead: {}, wordsSeen: {}, pos: {} };
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      if (raw) {
        var o = JSON.parse(raw);
        if (o && typeof o === 'object') for (var k in p) if (o[k] !== undefined) p[k] = o[k];
      }
    } catch (e) {}
    ['solved', 'best', 'seenTools', 'briefed', 'explained', 'notesRead', 'wordsSeen', 'pos'].forEach(function (k) {
      if (!p[k] || typeof p[k] !== 'object') p[k] = {};
    });
    return p;
  }
  var progress = loadProgress();
  function saveProgress() { try { window.localStorage.setItem(STORE_KEY, JSON.stringify(progress)); } catch (e) {} }

  /* ---------- data access ---------- */
  function levels() { return (HC.Levels && HC.Levels.length) ? HC.Levels : []; }
  function lkey(lv) { return lv ? String(lv.name != null && lv.name !== '' ? lv.name : lv.id) : ''; }
  function textFor(lv) { return (lv && HC.Text && (HC.Text[lv.name] || HC.Text[lv.id])) || {}; }
  function titleFor(lv) { return textFor(lv).title || prettify(lkey(lv)); }
  function bulletsOf(x) { if (Array.isArray(x)) return x.filter(Boolean); return x ? [x] : []; }
  function worldInfo(id) {
    var w = null;
    arr(HC.Worlds).forEach(function (x) { if (x && x.id == id) w = x; });
    var t = (w && w.title) || DEFAULT_WORLDS[id] || 'World ' + id;
    if (mathMode() && w && w.mathTitle) t = w.mathTitle;
    return { id: id, title: t, blurb: (w && w.blurb) || '' };
  }
  function isSandbox(lv) {
    if (!lv || !lv.goal) return true;
    var g = lv.goal;
    return !(arr(g.triangles).length || arr(g.edges).length || g.counts || g.min || g.flag || g.impossible);
  }
  // Worlds branch: a world opens once the worlds it needs are finished (their boss levels are optional);
  // inside a world, each level opens when the one before it is solved.
  function worldNeeds(w) { var n = HC.WorldNeeds && HC.WorldNeeds[w]; return Array.isArray(n) ? n : (w > 1 ? [w - 1] : []); }
  function worldDone(w) {
    var L = levels(), any = false, ok = true;
    L.forEach(function (lv) { if ((lv.world || 1) !== w || isSandbox(lv) || lv.kind === 'boss') return; any = true; if (!progress.solved[lkey(lv)]) ok = false; });
    return any && ok;
  }
  function worldOpen(w) {
    if (progress.unlockAll) return true;
    return worldNeeds(w).every(worldDone);
  }
  function isUnlocked(i) {
    var L = levels();
    if (progress.unlockAll || i === 0) return true;
    if (!L[i]) return false;
    if (progress.solved[lkey(L[i])]) return true;
    var w = L[i].world || 1;
    if (!worldOpen(w)) return false;
    for (var j = i - 1; j >= 0; j--) if ((L[j].world || 1) === w) return !!progress.solved[lkey(L[j])];
    return true;
  }
  function endingUnlocked() {
    if (!HC.Epilogue) return false;
    if (progress.unlockAll || progress.solved.joyal) return true;
    return false;
  }

  /* ---------- play state ---------- */
  var P = {
    idx: -1, level: null, state: null, moves: 0, tools: [], tool: null, picks: [], choice: null,
    fresh: { edges: {}, triangles: {}, vertices: {}, tetras: {} }, hintsShown: 0, won: false,
    hoverTri: null, pinnedTri: null, previewEdges: null, geo: null, m: null, pulse: false, newTools: {},
    goalPrev: [], blanksPrev: {}, skel: 3, layers: { v: true, e: true, t: true, s: true }, unfold: false, ghostPos: {},
    selEdge: null, goalGhost: null, goalBind: null, badges: [], vbFrozen: null, trip: null, offered: {}, hoverEdge: null,
    els: { edge: {}, vert: {}, tri: {}, tet: {}, card: {} }
  };

  function maps(st) {
    var m = { v: {}, e: {}, t: {} };
    arr(st && st.vertices).forEach(function (v) { m.v[v.id] = v; });
    arr(st && st.edges).forEach(function (e) { m.e[e.id] = e; });
    arr(st && st.triangles).forEach(function (t) { m.t[t.id] = t; });
    return m;
  }
  function rawLabel(m, id) {
    var e = m.e[id];
    if (e) return e.label != null && e.label !== '' ? String(e.label) : String(id);
    if (typeof id === 'string' && id.indexOf('id:') === 0) { var v = m.v[id.slice(3)]; return '1_' + (v ? (v.label || v.id) : id.slice(3)); }
    return String(id);
  }
  // SPEC4: composites carry provenance. Plain mode shows the engine label (f·g, diagrammatic order);
  // math mode shows the same arrow as g∘f, built from its origin, unless the player renamed it.
  function dispLabel(m, id, depth) {
    var e = m.e[id];
    if (mathMode() && e && e.mathLabel) return String(e.mathLabel);
    if (mathMode() && e && e.origin && e.origin.op === 'compose' && !e.renamed && arr(e.origin.from).length === 2 && (depth || 0) < 6) {
      var a = dispLabel(m, e.origin.from[0], (depth || 0) + 1), b = dispLabel(m, e.origin.from[1], (depth || 0) + 1);
      var pa = isCompound(a) ? '(' + a + ')' : a, pb = isCompound(b) ? '(' + b + ')' : b;
      return pb + '∘' + pa;
    }
    return rawLabel(m, id);
  }
  var THEN = ' \\cdot ';
  function eTeX(m, id) { return labTeX(dispLabel(m, id)); }
  function eTeXp(m, id) { var l = dispLabel(m, id); return isCompound(l) ? '(' + labTeX(l) + ')' : labTeX(l); }
  function boardLabel(m, id) { return dispLabel(m, id); }
  function originText(m, id) {
    var e = m.e[id], o = e && e.origin;
    if (!o) return '';
    var from = arr(o.from).map(function (x) { return math(eTeX(m, x)); });
    var op = o.op;
    if (op === 'compose') return 'made by composing ' + from.join(' then ');
    if (op === 'horn0' || op === 'solveLeft') return 'solved for, from ' + from.join(' and ');
    if (op === 'horn2' || op === 'solveRight') return 'solved for, from ' + from.join(' and ');
    if (op === 'trip' || op === 'tetra') return 'forced by a tetrahedron';
    return 'made by ' + esc(op) + (from.length ? ' from ' + from.join(', ') : '');
  }
  function vLabel(m, id) { var v = m.v[id]; return v ? (v.label != null ? String(v.label) : v.id) : String(id); }
  function isIdentityEdge(m, id) {
    if (typeof id !== 'string') return false;
    var e = m.e[id];
    return (e && e.kind === 'identity') || id.indexOf('id:') === 0;
  }
  function isThin(t) { return t && (t.kind === 'thin' || /^s[01]:/.test(String(t.id))); }
  function triTeXIds(m, a, b, c) {
    if (mathMode()) return 'd_2 = ' + eTeX(m, a) + ',\\ d_0 = ' + eTeX(m, b) + ',\\ d_1 = ' + eTeX(m, c);
    // plain: f·g ≃ x ("x is a composite of f then g"); with an identity in the middle: x ≃ y (homotopic)
    if (isIdentityEdge(m, b) && !isIdentityEdge(m, a)) return eTeX(m, a) + ' \\simeq ' + eTeX(m, c);
    return eTeXp(m, a) + ' \\cdot ' + eTeXp(m, b) + ' \\simeq ' + eTeX(m, c);
  }
  function triReadPlain(m, a, b, c) {
    var L = function (id) { return stripTags(dispLabel(m, id)); };
    if (isIdentityEdge(m, b) && !isIdentityEdge(m, a)) return L(a) + ' and ' + L(c) + ' are homotopic';
    return L(c) + ' is a composite of ' + L(a) + ' then ' + L(b);
  }
  function triTeX(m, t) { return triTeXIds(m, t.e01, t.e12, t.e02); }
  function edgeTeXFull(m, id) { var e = m.e[id]; return eTeX(m, id) + (e ? ' : ' + labTeX(vLabel(m, e.src)) + ' \\to ' + labTeX(vLabel(m, e.dst)) : ''); }

  /* ---------- tools ---------- */
  var ICONS = {
    compose: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17 L11 7 L21 17" fill="none"/><path d="M3 17 H21" fill="none" stroke-dasharray="2 2.5"/><circle cx="3" cy="17" r="1.8"/><circle cx="11" cy="7" r="1.8"/><circle cx="21" cy="17" r="1.8"/></svg>',
    identity: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 18 C3 8 21 8 12 18" fill="none"/><circle cx="12" cy="18" r="2"/></svg>',
    horn0: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5 L3 19 H21" fill="none"/><path d="M12 5 L21 19" fill="none" stroke-dasharray="2 2.5"/><circle cx="3" cy="19" r="1.8"/><circle cx="12" cy="5" r="1.8"/><circle cx="21" cy="19" r="1.8"/></svg>',
    horn2: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 19 H21 L12 5" fill="none"/><path d="M3 19 L12 5" fill="none" stroke-dasharray="2 2.5"/><circle cx="3" cy="19" r="1.8"/><circle cx="12" cy="5" r="1.8"/><circle cx="21" cy="19" r="1.8"/></svg>',
    fill3: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 L3 17 L11 21 L21 16 Z M12 3 L11 21" fill="none"/><path d="M3 17 L21 16" fill="none" stroke-dasharray="2 2.5"/></svg>',
    cell2: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4 L3 19 H21 Z" fill="currentColor" fill-opacity=".25"/><path d="M12 4 L3 19 H21 Z" fill="none"/></svg>',
    addVertex: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="14" r="4"/><path d="M18 3 V9 M15 6 H21" fill="none"/></svg>',
    addEdge: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18 L17 7" fill="none"/><path d="M11 7 H17 V13" fill="none"/><circle cx="4" cy="18" r="1.8"/></svg>',
    peel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6 H20 M7 11 H17" fill="none"/><path d="M10 15 L12 21 L14 15" fill="none"/></svg>'
  };
  function pickStep(say, accept, role) { return { say: say, accept: accept, role: role }; }
  var TOOLS = {
    compose: { label: 'Compose', key: 'C', desc: 'Compose two arrows that meet end to start.',
      picks: [pickStep('Pick the first arrow.', ['edge'], 'first'), pickStep('Pick the arrow that comes next.', ['edge'], 'then')],
      run: function (p) { return ['compose', p[0].id, p[1].id]; } },
    identity: { label: 'Identity', key: 'I', desc: 'Identity arrows and their degenerate triangles.',
      picks: [pickStep('Tap a dot or an arrow.', ['vertex', 'edge'], 'dot or arrow')],
      run: function (p) { return ['identity', p[0].id]; } },
    horn0: { labelTeX: 'f\\cdot ? \\simeq h', label: 'Solve', key: 'L', desc: 'Find the missing second arrow (horn \u039B\u00B2\u2080).',
      picks: [pickStep('Pick the first arrow <i>f</i>. A dot means its identity.', ['edge'], 'f'), pickStep('Pick the whole way <i>h</i>.', ['edge'], 'h')],
      run: function (p) { return ['horn0', p[0].id, p[1].id]; } },
    horn2: { labelTeX: '? \\cdot g \\simeq h', label: 'Solve', key: 'R', desc: 'Find the missing first arrow (horn \u039B\u00B2\u2082).',
      picks: [pickStep('Pick the last arrow <i>g</i>.', ['edge'], 'g'), pickStep('Pick the whole way <i>h</i>.', ['edge'], 'h')],
      run: function (p) { return ['horn2', p[0].id, p[1].id]; } },
    fill3: { label: 'Fill tetrahedron', desc: 'Three faces force a fourth.',
      picks: [pickStep('Pick 3 facts that fit together.', ['tri'], '1'), pickStep('Pick a 2nd fact.', ['tri'], '2'), pickStep('Pick a 3rd fact.', ['tri'], '3')],
      run: function (p) { return ['fill3', [p[0].id, p[1].id, p[2].id]]; } },
    tetra: { label: 'Tetrahedron', key: 'T', desc: 'Three faces (facts) or three arrows end to end. A dot means its identity.',
      picks: [pickStep('Pick 3 facts (faces) \u2014 or 3 arrows end to end.', ['tri', 'edge'], '1'), pickStep('Pick a 2nd one.', ['tri', 'edge'], '2'), pickStep('Pick a 3rd one.', ['tri', 'edge'], '3')],
      run: null },
    cell2: { label: 'Glue triangle', key: 'G', desc: 'Fill in three arrows that close up.',
      picks: [pickStep('Pick 3 arrows that close up.', ['edge'], '1'), pickStep('Pick a 2nd arrow.', ['edge'], '2'), pickStep('Pick a 3rd arrow.', ['edge'], '3')],
      run: function (p) { return ['cell2', [p[0].id, p[1].id, p[2].id]]; } },
    addEdge: { label: 'Draw arrow', key: 'D', desc: 'From one dot to another.',
      picks: [pickStep('Tap the start dot.', ['vertex'], 'from'), pickStep('Tap the end dot.', ['vertex'], 'to')],
      run: function (p) { return ['addEdge', p[0].id, p[1].id]; } },
    addVertex: { label: 'Add dot', key: 'A', desc: 'Tap an empty spot.',
      picks: [pickStep('Tap an empty spot.', ['point'], 'spot')],
      run: function (p) { return ['addVertex', p[0].x, p[0].y]; } },
    peel: { label: 'Peel', key: 'P', desc: 'Remove the top layer.', instant: true, picks: [],
      run: function () { return ['peel']; } },
    same: { label: 'Same', key: '1', desc: 'Two composites of the same pair are homotopic.', theorem: true,
      picks: [pickStep('Pick a composite fact.', ['tri'], '1'), pickStep('Pick another composite of the same pair.', ['tri'], '2')],
      run: function (p) { return ['same', p[0].id, p[1].id]; } },
    flip: { label: 'Flip', key: '2', desc: 'x \u2243 y gives y \u2243 x.', theorem: true,
      picks: [pickStep('Pick a homotopy x \u2243 y.', ['tri'], '1')],
      run: function (p) { return ['flip', p[0].id]; } },
    link: { label: 'Link', key: '3', desc: 'x \u2243 y and y \u2243 z give x \u2243 z.', theorem: true,
      picks: [pickStep('Pick x \u2243 y.', ['tri'], '1'), pickStep('Pick y \u2243 z.', ['tri'], '2')],
      run: function (p) { return ['link', p[0].id, p[1].id]; } },
    swapin: { label: 'Swap in', key: '4', desc: 'Use p \u2243 q to replace p by q in a fact.', theorem: true,
      picks: [pickStep('Pick a homotopy p \u2243 q.', ['tri'], '1'), pickStep('Pick a fact that uses p.', ['tri'], '2')],
      run: function (p) { return ['swapin', p[0].id, p[1].id]; } },
    witness: { label: 'Not a nerve: show a bad pair', key: 'W', desc: 'Two arrows end to end with no composite, or with two different ones. A dot means its identity.',
      picks: [pickStep('Pick the first arrow of the pair.', ['edge'], '1st'), pickStep('Pick the arrow that follows it.', ['edge'], '2nd')],
      run: function (p) { return ['witness', p[0].id, p[1].id]; } },
    isNerve: { label: 'It is a nerve', key: 'N', desc: 'Every two arrows end to end have exactly one composite.', instant: true, picks: [],
      run: function () { return ['isNerve']; } },
    cosk: { label: 'Fill in', key: 'K', desc: 'Coskeleton: fill every hollow shape, in the only possible way.', instant: true, picks: [],
      run: function () { return ['cosk']; } },
    liftEdge: { label: 'Lift arrow', key: 'F', desc: 'Lift an arrow of the shadow, starting at a dot above its start. It ends at a new dot.',
      picks: [pickStep('Pick the dot to start from.', ['vertex'], 'start')],
      run: function (p) { return ['liftEdge', p[0].id]; } },
    divide: { label: 'Divide', key: '5', desc: 'If u then v is an identity, move u or v to the other side of a fact.', theorem: true,
      picks: [pickStep('Pick a fact saying two arrows compose to an identity.', ['tri'], '1'), pickStep('Pick a fact that uses one of those arrows.', ['tri'], '2')],
      run: function (p) { return ['divide', p[0].id, p[1].id]; } }
  };
  TOOLS.trip = TOOLS.tetra;
  var MATH_TOOL = {
    compose: '\\Lambda^2_1', identity: 's_0,\\, s_1', horn0: '\\Lambda^2_0', horn2: '\\Lambda^2_2', fill3: '\\Lambda^3_i', tetra: '\\Lambda^3_i',
    cell2: '\\partial\\Delta^2 \\hookrightarrow \\Delta^2', addEdge: '\\Delta^1', addVertex: '\\Delta^0', peel: '\\mathrm{sk}',
    same: '\\sigma,\\sigma\'\\Rightarrow\\simeq', flip: '\\simeq^{-1}', link: '\\simeq\\cdot\\simeq', swapin: 'p\\simeq q', divide: 'u^{-1}', liftEdge: '\\Lambda^1_0', cosk: '\\mathrm{cosk}', witness: '\\Lambda^2_1\\ \\text{fails}', isNerve: 'N(\\mathcal C)'
  };
  ICONS.tetra = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 L3 17 L11 21 L21 16 Z M12 3 L11 21" fill="none"/><path d="M3 17 L21 16" fill="none" stroke-dasharray="2 2.5"/></svg>';
  ICONS.same = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9 H19 M5 15 H19" fill="none"/></svg>';
  ICONS.flip = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8 H18 L15 5 M20 16 H6 L9 19" fill="none"/></svg>';
  ICONS.link = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14 L14 10 M8 12 L5 15 a3 3 0 0 0 4 4 L12 16 M16 12 L19 9 a3 3 0 0 0 -4 -4 L12 8" fill="none"/></svg>';
  ICONS.swapin = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12 H14 M11 8 L15 12 L11 16" fill="none"/><path d="M18 5 V19" fill="none"/></svg>';
  ICONS.liftEdge = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19 H18 M15 16 L19 19 L15 22" fill="none" stroke-dasharray="2 2.5"/><path d="M4 8 H18 M15 5 L19 8 L15 11" fill="none"/><circle cx="4" cy="8" r="2"/></svg>';
  ICONS.witness = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 18 L11 7 L19 18" fill="none"/><path d="M15 4 L21 10 M21 4 L15 10" fill="none"/></svg>';
  ICONS.isNerve = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 19 L11 7 L19 19 Z" fill="none"/><path d="M14 6 L17 9 L22 3" fill="none"/></svg>';
  ICONS.cosk = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19 L12 5 L20 19 Z" fill="currentColor" fill-opacity=".25"/></svg>';
  ICONS.divide = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12 H19" fill="none"/><circle cx="12" cy="6.5" r="1.6"/><circle cx="12" cy="17.5" r="1.6"/></svg>';
  var TOOL_ORDER = ['witness', 'isNerve', 'liftEdge', 'compose', 'identity', 'horn0', 'horn2', 'fill3', 'tetra', 'addVertex', 'addEdge', 'cell2', 'peel', 'cosk', 'same', 'flip', 'link', 'swapin', 'divide'];
  ['compose', 'horn0', 'horn2', 'tetra', 'witness'].forEach(function (t) { TOOLS[t].stay = true; });
  var THEOREM_NAMES = { same: 'Same', flip: 'Flip', link: 'Link', swapin: 'Swap in', divide: 'Divide' };
  function toolName(t) { return t === 'trip' ? 'tetra' : t; }

  function engineHas(name) { return !!(HC.Engine && typeof HC.Engine[name] === 'function'); }
  function runEntry(st, entry) {
    var name = entry[0], args = entry.slice(1);
    if (name === 'trip' || name === 'tetra') name = 'claimRoute';
    if (!engineHas(name)) return { ok: false, reason: 'That tool is not ready yet.' };
    return HC.Engine[name].apply(HC.Engine, [st].concat(args));
  }

  /* ---------- level lifecycle ---------- */
  function freshState(lv) {
    if (!engineHas('createState')) throw new Error('engine.js is missing');
    return HC.Engine.createState(lv);
  }
  function hasSkeleton(lv) {
    if (!lv) return false;
    if (isSandbox(lv)) return true;
    return arr(lv.tools).some(function (t) { return t === 'addEdge' || t === 'cell2' || t === 'peel' || t === 'addVertex' || t === 'cosk'; });
  }
  function isIntro(lv) { return !lv || !lv.kind || lv.kind === 'intro' || lv.kind === 'sandbox'; }
  function mathMode() { return progress.mode === 'math'; }

  function startLevel(i) {
    var lv = levels()[i];
    if (!lv) return;
    var st;
    try { st = freshState(lv); } catch (e) { toast('Could not load this level.', 'warn'); return; }
    P.idx = i; P.level = lv; P.state = st; P.moves = 0;
    var tools = arr(lv.tools).length ? lv.tools.slice() : ['compose', 'identity', 'horn0', 'horn2', 'fill3'];
    if (isSandbox(lv)) ['addVertex', 'addEdge', 'cell2', 'peel'].forEach(function (t) { if (tools.indexOf(t) < 0 && engineHas(t)) tools.push(t); });
    tools = tools.map(toolName).filter(function (t, i, a) { return TOOLS[t] && a.indexOf(t) === i; });
    tools.sort(function (a, b) { return TOOL_ORDER.indexOf(a) - TOOL_ORDER.indexOf(b); });
    P.tools = tools;
    P.newTools = {};
    tools.forEach(function (t) { if (!progress.seenTools[t]) { P.newTools[t] = 1; progress.seenTools[t] = 1; } });
    saveProgress();
    P.pulse = Object.keys(P.newTools).length > 0 || i === 0;
    var modal = tools.filter(function (t) { return !TOOLS[t].instant; });
    P.tool = modal.length === 1 ? modal[0] : null;
    P.picks = []; P.choice = null; P.trip = null; P.hintsShown = 0; P.won = false; P.hoverTri = null; P.pinnedTri = null; P.previewEdges = null;
    P.fresh = emptyFresh(); P.goalPrev = []; P.blanksPrev = {}; P.skel = 3; P.selEdge = null; P.goalGhost = null; P.ghostPos = {}; P.vbFrozen = null;
    P.layers = { v: true, e: true, t: true, s: true }; P.unfold = !!lv.startUnfolded; P.unfoldTripKey = ''; stopRename(); closeWhy(); hideChooser(); close3D();
    hideTetra(); hideWin();
    showScreen('play');
    renderPlayStatic();
    renderAll();
    P.blanksPrev = currentBlanks();
    try { history.replaceState(null, '', '#level-' + encodeURIComponent(lkey(lv))); } catch (e) {}
    announceNewWords();
  }
  function emptyFresh() { return { edges: {}, triangles: {}, vertices: {}, tetras: {} }; }

  function doMove(entry, involved, mopts) {
    mopts = mopts || {};
    var ghosts = entry[0] === 'peel' ? peelGhosts() : null;
    var flagsBefore = JSON.stringify(P.state && P.state.flags || {});
    var res;
    try { res = runEntry(P.state, entry); } catch (e) {
      try { console.error(e); } catch (e2) {}
      res = { ok: false, reason: 'Hmm, that move hit a snag.' };
    }
    P.picks = []; P.choice = null; P.previewEdges = null;
    if (!res || !res.ok) {
      // a refusal that taught the board something (a flag) still counts as a move
      if (JSON.stringify(P.state && P.state.flags || {}) !== flagsBefore || (res && res.wrongReason)) { P.moves++; renderMoves(); }
      renderPicks();
      if (entry[0] === 'claimImpossible') {
        nudge($('btn-claim'));
        var rr = res && res.wrongReason && HC.Reasons && HC.Reasons[res.reasonId || entry[1]];
        var msg = rr && rr.whyNot ? 'Not that: ' + rr.whyNot : (res && res.reason) || 'It can be done. Keep going!';
        toast(prose(msg) + ' <span class="muted">(+1 move)</span>', 'info', 5200);
      }
      else {
        shakeItems(involved);
        var why = (res && res.reason) || "That didn't work.";
        if (entry[0] === 'fill3' && /fit/i.test(why)) why = 'These don’t close up.';
        toast(prose(why), 'warn');
      }
      // a refused move can still change flags (e.g. the rulebook refusal) -> goal may tick
      renderGoals(); renderRulebook();
      checkWin();
      return res || { ok: false };
    }
    if (res.state) P.state = res.state;
    if (!mopts.free) P.moves++;
    P.pulse = false;
    var a = res.added || {};
    P.fresh = emptyFresh();
    ['edges', 'triangles', 'vertices', 'tetras'].forEach(function (k) { arr(a[k]).forEach(function (id) { P.fresh[k][id] = 1; }); });
    if (P.pinnedTri && !maps(P.state).t[P.pinnedTri]) P.pinnedTri = null;
    renderAll();
    if (ghosts) dropGhosts(ghosts);
    P.fresh = emptyFresh();
    var m = P.m;
    var newTris = arr(a.triangles).map(function (id) { return m.t[id]; }).filter(Boolean);
    var real = newTris.filter(function (t) { return !isThin(t); });
    if (entry[0] === 'fill3') {
      var T = arr(P.state.tetras).filter(function (x) { return arr(a.tetras).indexOf(x.id) >= 0; })[0];
      var face = T && T.faces && m.t[T.faces[T.missing]];
      if (face || real.length) showTetra(face || real[0], T);
    }
    if (entry[0] !== 'claimImpossible') toast(successText(entry, a, res), 'ok');
    checkWin(entry[0] === 'fill3' ? 520 : 200);
    return res;
  }

  function successText(entry, a, res) {
    var m = P.m;
    var tris = arr(a.triangles).map(function (id) { return m.t[id]; }).filter(Boolean);
    var real = tris.filter(function (t) { return !isThin(t); });
    if (real.length) return 'New fact ' + math(triTeX(m, real[real.length - 1]));
    if (arr(a.tetras).length) return 'Filled, and it agrees with what you had.';
    if (tris.length) return 'Free facts for ' + math(eTeX(m, tris[0].e02));
    var es = arr(a.edges).filter(function (id) { return m.e[id]; });
    if (es.length) return 'New arrow ' + math(edgeTeXFull(m, es[es.length - 1]));
    if (arr(a.vertices).length) return 'New dot ' + math(labTeX(vLabel(m, a.vertices[0])));
    return prose(res.message || 'Done.');
  }

  function undo() {
    if (!P.level) return;
    if (!engineHas('undo') || (engineHas('canUndo') && !HC.Engine.canUndo(P.state))) { toast('Nothing to undo.', 'info'); return; }
    var r;
    try { r = HC.Engine.undo(P.state); } catch (e) { r = null; }
    if (!r || !r.ok) { toast('Nothing to undo.', 'info'); return; }
    if (r.state) P.state = r.state;
    P.moves = Math.max(0, P.moves - 1);
    P.picks = []; P.choice = null; P.trip = null; renderTrip(); P.fresh = emptyFresh();
    if (P.pinnedTri && !maps(P.state).t[P.pinnedTri]) P.pinnedTri = null;
    P.hoverTri = null;
    hideTetra();
    renderAll();
    if (!goalDone()) { P.won = false; hideWin(); }
  }

  function resetLevel() {
    if (!P.level) return;
    try { P.state = freshState(P.level); } catch (e) { return; }
    P.moves = 0; P.picks = []; P.choice = null; P.trip = null; renderTrip(); P.fresh = emptyFresh();
    P.pinnedTri = null; P.hoverTri = null; P.won = false;
    hideTetra(); hideWin();
    renderAll();
  }

  /* ---------- goals ---------- */
  function engineGoal() {
    if (!engineHas('checkGoal') || !P.state) return null;
    try { return HC.Engine.checkGoal(P.state) || null; } catch (e) { return null; }
  }
  function goalDone() { if (isSandbox(P.level)) return false; var g = engineGoal(); return !!(g && g.done); }

  function bestPartial(pats, st) {
    var tris = arr(st.triangles), best = { n: -1, b: {}, hit: [] };
    var literal = {}; pats.forEach(function (p) { p.forEach(function (x) { if (!isVar(x)) literal[x] = 1; }); });
    function rec(i, b, used, hit, n) {
      if (n + (pats.length - i) <= best.n) return;
      if (i === pats.length) { if (n > best.n) best = { n: n, b: Object.assign({}, b), hit: hit.slice() }; return; }
      var pat = pats[i];
      for (var k = 0; k < tris.length; k++) {
        var t = tris[k], es = [t.e01, t.e12, t.e02], nb = Object.assign({}, b), nu = Object.assign({}, used), ok = true;
        for (var j = 0; j < 3 && ok; j++) {
          var p = pat[j];
          if (isVar(p)) {
            if (nb[p] != null) { if (nb[p] !== es[j]) ok = false; }
            else if (literal[es[j]] || (nu[es[j]] && nu[es[j]] !== p)) ok = false;
            else { nb[p] = es[j]; nu[es[j]] = p; }
          } else if (p !== es[j]) ok = false;
        }
        if (ok) { hit.push(true); rec(i + 1, nb, nu, hit, n + 1); hit.pop(); }
      }
      hit.push(false); rec(i + 1, b, used, hit, n); hit.pop();
    }
    rec(0, {}, {}, [], 0);
    return best;
  }

  function countNonDeg(st) {
    var c = { edges: 0, triangles: 0, tetras: arr(st.tetras).length, vertices: arr(st.vertices).length };
    var m = maps(st);
    arr(st.edges).forEach(function (e) { if (!isIdentityEdge(m, e.id)) c.edges++; });
    arr(st.triangles).forEach(function (t) { if (!isThin(t)) c.triangles++; });
    return c;
  }
  var DIM_WORD = { edges: ['arrow', 'arrows'], triangles: ['triangle', 'triangles'], tetras: ['tetrahedron', 'tetrahedra'], vertices: ['dot', 'dots'] };

  // the checklist: local list of parts, ticked by the engine's parts when they line up
  function goalParts() {
    var lv = P.level, g = lv && lv.goal, st = P.state, m = P.m || maps(st);
    if (!g) return [];
    var parts = [];
    var pats = arr(g.triangles), part = bestPartial(pats, st);
    var eg = engineGoal() || {};
    var b = part.b;
    if (eg.done && eg.bindings && typeof eg.bindings === 'object') { b = {}; for (var k in eg.bindings) b[k.charAt(0) === '?' ? k : '?' + k] = eg.bindings[k]; }
    P.goalBind = b;
    pats.forEach(function (pat, i) {
      var ok = !!part.hit[i] || !!eg.done;
      parts.push({ kind: 'triangle', ti: i, done: ok, html: patternHTML(pat, b, m) + (pat[3] ? ' <span class="note">over ' + math(eTeX(maps(baseOf() || {}), (arr((baseOf() || {}).triangles).filter(function (t) { return t.id === pat[3]; })[0] || {}).e02 || '')) + '</span>' : '') });
    });
    var usedE = {};
    arr(g.edges).forEach(function (pr) {
      var hit = arr(st.edges).filter(function (e) { return e.src === pr[0] && e.dst === pr[1] && !isIdentityEdge(m, e.id) && !usedE[e.id]; })[0];
      if (hit) usedE[hit.id] = 1;
      parts.push({ kind: 'edge', done: !!hit, html: math('? : ' + labTeX(vLabel(m, pr[0])) + ' \\to ' + labTeX(vLabel(m, pr[1]))) });
    });
    var cnt = countNonDeg(st);
    ['counts', 'min'].forEach(function (key) {
      var o = g[key]; if (!o || typeof o !== 'object') return;
      ['edges', 'triangles', 'tetras'].concat(Object.keys(o).filter(function (k) { return ['edges', 'triangles', 'tetras'].indexOf(k) < 0; })).forEach(function (dim) {
        if (o[dim] === undefined) return;
        var n = +o[dim], have = cnt[dim] != null ? cnt[dim] : 0, w = DIM_WORD[dim] || [dim, dim];
        var txt = key === 'min' ? 'at least ' + plural(n, w[0], w[1]) : (n === 0 ? 'no ' + w[1] : 'exactly ' + plural(n, w[0], w[1]));
        var ok = key === 'min' ? have >= n : have === n;
        parts.push({ kind: key, done: ok, html: esc(txt) + ' <span class="now">(now ' + have + ')</span>' });
      });
    });
    if (g.flag) parts.push({ kind: 'flag', done: !!(st.flags && st.flags[g.flag]), html: g.flag === 'uniqueRefused' ? 'ask for a second answer' : g.flag === 'verdict' ? 'decide: is this the nerve of a category?' : esc(g.flag) });
    // engine parts, if they line up (impossible/claim parts are never shown: that is the player's call)
    var ep = arr(eg.parts).filter(function (p) { return p && !/impossible|claim/i.test(p.kind || ''); });
    if (ep.length === parts.length) parts.forEach(function (p, i) { p.done = !!ep[i].done; });
    var claimed = !!(g.impossible && st.flags && st.flags.claimed);
    if (claimed) {
      // the wished-for fact was never made: strike it, and tick the decision instead
      parts.forEach(function (p) { if (p.kind === 'triangle' && !p.done) p.struck = true; });
    } else if (eg.done) parts.forEach(function (p) { p.done = true; });
    // prose may supply its own wording
    var gp = arr(textFor(lv).goalParts);
    if (gp.length === parts.length) parts.forEach(function (p, i) { if (gp[i]) p.html = prose(gp[i]) + (p.kind === 'counts' || p.kind === 'min' ? ' ' + p.html.replace(/^.*?(<span class="now">)/, '$1') : ''); });
    if (claimed) parts.push({ kind: 'claim', done: true, html: 'shown: it can’t be done' });
    return parts;
  }

  function patternHTML(pat, b, m) {
    function tok(x, paren) {
      if (isVar(x)) {
        if (b && b[x] != null) return paren ? eTeXp(m, b[x]) : eTeX(m, b[x]);
        return '?';
      }
      return paren ? eTeXp(m, x) : eTeX(m, x);
    }
    if (mathMode()) return math('d_2 = ' + tok(pat[0]) + ',\\ d_0 = ' + tok(pat[1]) + ',\\ d_1 = ' + tok(pat[2]));
    var mid = isVar(pat[1]) ? (b && b[pat[1]]) : pat[1];
    var first = isVar(pat[0]) ? (b && b[pat[0]]) : pat[0];
    if (mid && isIdentityEdge(m, mid) && !(first && isIdentityEdge(m, first))) return math(tok(pat[0]) + ' \\simeq ' + tok(pat[2]));
    return math(tok(pat[0], true) + THEN + tok(pat[1], true) + ' \\simeq ' + tok(pat[2]));
  }

  function checkWin(delay) {
    if (!P.level || isSandbox(P.level) || P.won) return;
    if (!goalDone()) return;
    P.won = true;
    applyHighlights();
    var key = lkey(P.level);
    progress.solved[key] = true;
    if (!(progress.best[key] <= P.moves)) progress.best[key] = P.moves;
    saveProgress();
    var lvAt = P.level;
    var wrap = $('board-wrap');
    wrap.classList.remove('won'); void wrap.offsetWidth; wrap.classList.add('won');
    setTimeout(function () { if (P.level === lvAt && P.won) showWin(); }, reduceMotion ? 0 : (delay || 200));
  }

  /* ---------- live targets ---------- */
  function liveSets() {
    if (!P.tool || P.choice || P.trip) return null;
    var T = TOOLS[P.tool];
    if (!T || !T.picks.length || T.picks[0].accept[0] === 'point') return null;
    if (!engineHas('candidates')) return null;
    // puzzles and bosses: the game steps back. Fill tetrahedron gives no hints about which facts close up.
    if (P.tool === 'fill3' && !isIntro(P.level)) return null;
    var ids = P.picks.map(function (p) { return p.id; });
    function ask(tool, picks) { try { return HC.Engine.candidates(P.state, tool, picks) || null; } catch (e) { return null; } }
    var out;
    if (P.tool === 'tetra') {
      var intro = isIntro(P.level), first = P.picks[0];
      var path = (!first || first.kind === 'edge') ? ask('trip', first ? ids : []) : null;
      var faces = intro && (!first || first.kind === 'tri') ? ask('fill3', first ? ids : []) : null;
      out = { vertex: setOf(path && path.vertices), edge: setOf(path && path.edges), tri: setOf(faces && faces.triangles) };
      if (!first) out.tri = null;               // any fact may start a face pick
      if (first && first.kind === 'tri' && !faces) out.tri = null;
      // in a puzzle the tetrahedron is the puzzle: still refuse paths that don't connect, but don't light the way
      if (!intro) out.quiet = true;
      return out;
    }
    var c = ask(P.tool, ids);
    if (!c) return null;
    return { vertex: setOf(c.vertices), edge: setOf(c.edges), tri: setOf(c.triangles) };
  }
  function isLive(live, item) {
    if (!live) return true;
    if (item.stay) return !!((live.vertex && live.vertex[item.v]) || (live.edge && live.edge[item.id]));
    return !live[item.kind] || !!live[item.kind][item.id];
  }
  function currentStep() {
    var T = P.tool && TOOLS[P.tool]; if (!T) return null;
    var s = T.picks[P.picks.length]; if (!s) return null;
    // the tetrahedron keeps to one way in: all faces or all arrows
    if (P.tool === 'tetra' && P.picks.length) return { say: s.say, accept: [P.picks[0].kind], role: s.role };
    return s;
  }

  /* ---------- picking ---------- */
  function handlePick(item) {
    if (!P.level) return;
    hideChooser();
    if (P.choice) { if (item.kind === 'tri') toggleIsolate(item.id); return; }
    if (!P.tool) {
      if (item.kind === 'tri') { toggleIsolate(item.id); return; }
      if (item.kind === 'edge') { selectEdge(item.id); return; }
      if (item.kind === 'vertex') { nudge($('toolbar')); }
      return;
    }
    var T = TOOLS[P.tool];
    if (item.kind === 'tri' && T.picks.length && !(T.picks[P.picks.length] || T.picks[0]).accept.some(function (a) { return a === 'tri'; })) { toggleIsolate(item.id); return; }
    // a dot in an arrow-picking tool means "its identity arrow"
    if (item.kind === 'vertex' && T.stay && !(P.tool === 'tetra' && P.picks.length && P.picks[0].kind === 'tri')) item = { kind: 'edge', id: 'id:' + item.id, stay: true, v: item.id };
    if (P.tool === 'tetra' && P.trip) { closeTrip(); }
    if (P.tool !== 'tetra' || item.kind === 'tri') {
      for (var i = 0; i < P.picks.length; i++) {
        var q = P.picks[i];
        if (q.kind === item.kind && q.id != null && q.id === item.id && !q.stay) { P.picks.splice(i, 1); renderPicks(); return; }
      }
    }
    var step = currentStep();
    if (!step) return;
    if (step.accept.indexOf(item.kind) < 0) {
      if (item.kind === 'point') return;
      shakeItems([item]);
      return;
    }
    var last = P.picks.length === T.picks.length - 1;
    var live = liveSets();
    if (live && (!last || (P.tool === 'tetra' && item.kind === 'edge')) && !isLive(live, item)) {
      // gentle: just a shake; lit things are what fits
      shakeItems([item]);
      return;
    }
    P.picks.push(item);
    if (P.picks.length === T.picks.length) {
      var picks = P.picks.slice();
      if (P.tool === 'tetra') { P.picks = []; openTetra(picks); return; }
      // lifting: several triangles below to lie over -> the player chooses
      if (baseOf() && engineHas('liftOptions') && (P.tool === 'compose' || P.tool === 'horn0' || P.tool === 'horn2' || P.tool === 'liftEdge')) {
        var lo = null, entry = T.run(picks);
        try { lo = HC.Engine.liftOptions(P.state, P.tool, entry.slice(1)); } catch (e) { lo = null; }
        if (lo && lo.length > 1) { P.choice = { entry: entry, opts: lo, picks: picks, lift: true }; renderPicks(); return; }
      }
      if (P.tool === 'fill3' && engineHas('fill3Options')) {
        var ids2 = picks.map(function (p) { return p.id; }), opts = null;
        try { opts = HC.Engine.fill3Options(P.state, ids2); } catch (e) { opts = null; }
        if (opts && opts.length > 1) { P.choice = { ids: ids2, opts: opts, picks: picks }; renderPicks(); return; }
      }
      renderPicks();
      doMove(T.run(picks), picks);
    } else renderPicks();
  }

  function chooseOption(i) {
    if (!P.choice) return;
    var c = P.choice;
    if (c.entry) doMove(c.entry.concat([i]), c.picks);
    else doMove(['fill3', c.ids, i], c.picks);
  }

  function selectTool(name) {
    name = toolName(name);
    if (P.tools.indexOf(name) < 0) return;
    P.selEdge = null; hideChooser();
    if (TOOLS[name].instant) { doMove(TOOLS[name].run([])); return; }
    P.tool = P.tool === name && P.picks.length === 0 && !P.choice && !P.trip ? null : name;
    if (P.tools.filter(function (t) { return !TOOLS[t].instant; }).length === 1) P.tool = name;
    P.picks = []; P.choice = null; P.previewEdges = null; P.trip = null; renderTrip();
    renderToolbar(); renderPicks();
    $('board').classList.toggle('placing', P.tool === 'addVertex');
    // theorem tools pick fact cards: on a phone the Facts list sits below the board, so bring it into view
    if (P.tool && TOOLS[P.tool].theorem && window.innerWidth < 900) {
      try { var fp = $('facts').parentNode; fp.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' }); } catch (e) {}
    }
  }
  function clearPicks() { if (P.trip) closeTrip(); P.picks = []; P.choice = null; P.previewEdges = null; P.pinnedTri = null; P.hoverTri = null; renderPicks(); }
  function togglePin(id) { P.pinnedTri = (P.pinnedTri === id) ? null : id; applyHighlights(); }

  function pickTeX(p) {
    var m = P.m;
    if (p.kind === 'edge') return p.stay && mathMode() ? '1_{' + labTeX(vLabel(m, p.v)) + '}' : eTeX(m, p.id);
    if (p.kind === 'vertex') return labTeX(vLabel(m, p.id));
    if (p.kind === 'tri') { var t = m.t[p.id]; return t ? triTeX(m, t) : '?'; }
    return '';
  }

  /* ---------- feel: shakes and nudges ---------- */
  function restartAnim(el, cls) {
    if (!el || reduceMotion) return;
    el.classList.remove(cls); void (el.getBoundingClientRect && el.getBoundingClientRect()); el.classList.add(cls);
    setTimeout(function () { el.classList.remove(cls); }, 450);
  }
  function nudge(el) { restartAnim(el, 'shake'); }
  function shakeItems(items) {
    arr(items).forEach(function (it) {
      if (!it) return;
      if (it.stay) { var sv = P.els.vert[it.v]; restartAnim(sv && sv.querySelector('.vbody'), 'shake'); }
      else if (it.kind === 'edge') restartAnim(P.els.edge[it.id], 'shake');
      else if (it.kind === 'vertex') { var v = P.els.vert[it.id]; restartAnim(v && v.querySelector('.vbody'), 'shake'); }
      else if (it.kind === 'tri') restartAnim(P.els.card[it.id], 'shake');
    });
  }

  /* ---------- rendering: play screen ---------- */
  function renderPlayStatic() {
    var lv = P.level, T = textFor(lv);
    $('lvl-tag').textContent = 'world ' + (lv.world || '?') + ' · ' + (P.idx + 1) + ' of ' + levels().length;
    $('lvl-title').innerHTML = prose(titleFor(lv));
    var bl = arr(T.bullets).length ? T.bullets : bulletsOf(T.story);
    if (mathMode() && T.math && T.math.say) bl = bulletsOf(T.math.say);
    $('bullets').classList.toggle('formal', mathMode() && !!(T.math && T.math.say));
    if (!bl.length && isSandbox(lv)) bl = ['No goal. Make dots, arrows and facts.'];
    $('bullets').innerHTML = bl.map(function (b, i) { var t = prose(b); return (i === bl.length - 1 && bl.length > 1 && !mathMode()) ? '<b class="task">' + t + '</b>' : t; }).join(' ');
    // Explain: closed by default, open the first time on intro levels
    var ex = $('explain'), exText = T.explain || (T.math && !mathMode() ? null : null);
    progress.explained = progress.explained || {};
    if (exText) {
      var openIt = isIntro(lv) && !progress.explained[lkey(lv)];
      ex.innerHTML = '<details' + (openIt ? ' open' : '') + '><summary>Explain</summary><div class="explain-body">' + (Array.isArray(exText) ? exText.map(function (p) { return '<p>' + prose(p) + '</p>'; }).join('') : '<p>' + prose(exText) + '</p>') + '</div></details>';
      ex.hidden = false;
      if (openIt) { progress.explained[lkey(lv)] = true; saveProgress(); }
    } else { ex.hidden = true; ex.innerHTML = ''; }
    // world briefing: the full panel the first time, then one click to bring it back
    progress.briefed = progress.briefed || {};
    var bh = paintBriefing();
    // one thing at a time: with a briefing up (it links the note), Explain starts closed and no note is offered
    if (bh) { var dd = ex.querySelector('details'); if (dd) dd.open = false; }
    // a note that comes before this level is offered, never forced
    var nb = noteBefore(lv.name), of = $('offer');
    progress.notesRead = progress.notesRead || {};
    if (nb && !bh && !progress.notesRead[nb.id] && !P.offered[nb.id]) {
      P.offered[nb.id] = true;
      of.innerHTML = '<span>\uD83D\uDCD6 Before this level: <b>' + prose(nb.title || 'a short note') + '</b></span> <button type="button" class="btn" data-note="' + esc(nb.id) + '">Read</button> <button type="button" class="linklike" data-act="offer-skip">skip</button>';
      of.hidden = false;
    } else { of.hidden = true; of.innerHTML = ''; }
    $('btn-claim').hidden = !lv.claimable;
    $('rulebook-panel').hidden = !(lv.strict || lv.table);
    closeWhy();
    renderHints();
  }

  // the briefing can be put away and brought back: it collapses to one line, it is not thrown out
  function paintBriefing() {
    var bf = $('briefing'), lv = P.level;
    if (!bf) return '';
    if (!lv || !briefingFor(lv.world)) { bf.hidden = true; bf.innerHTML = ''; bf.className = 'panel briefing'; return ''; }
    progress.briefed = progress.briefed || {};
    var open = !progress.briefed[lv.world];
    if (open) {
      bf.className = 'panel briefing';
      bf.innerHTML = briefingHTML(lv.world, true);
    } else {
      bf.className = 'panel brief-closed';
      bf.innerHTML = '<button type="button" class="brief-open" data-act="brief-show" aria-expanded="false">' +
        '<span class="brief-open-i" aria-hidden="true">ⓘ</span> About this world: ' + prose(worldInfo(lv.world).title) + '</button>';
    }
    bf.hidden = false;
    return open ? 'open' : '';
  }

  function renderAll() {
    P.m = maps(P.state);
    renderToolbar();
    renderBoard();
    renderFacts();
    renderGoals();
    renderRulebook();
    renderTrip();
    renderPicks();
    renderMoves();
    var u = $('btn-undo');
    if (u) u.disabled = engineHas('canUndo') ? !HC.Engine.canUndo(P.state) : !P.moves;
  }

  function renderMoves() {
    var el = $('moves');
    if (!P.level || isSandbox(P.level)) { el.textContent = ''; return; }
    var par = P.level.par;
    var hidePar = (P.level.parHidden || P.level.claimable) && !progress.solved[lkey(P.level)];
    el.innerHTML = 'moves ' + P.moves + (par != null ? ' \u00B7 par ' + (hidePar ? '?' : par) : '');
    el.classList.toggle('over', par != null && P.moves > par);
  }

  function renderToolbar() {
    var bar = $('toolbar'); bar.innerHTML = '';
    var firstTheorem = true;
    P.tools.forEach(function (name, i) {
      var T = TOOLS[name];
      if (T.theorem && firstTheorem) {
        firstTheorem = false;
        bar.appendChild(hEl('span', { class: 'tool-group' }, mathMode() ? 'lemmas' : 'your theorems'));
      } else if (T.instant && i > 0) bar.appendChild(hEl('span', { class: 'tool-sep', 'aria-hidden': 'true' }));
      var cls = 'tool' + (P.tool === name ? ' active' : '') + (P.newTools[name] ? ' newtool' : '') + (T.instant ? ' instant' : '');
      var lab = mathMode() && MATH_TOOL[name] ? math(MATH_TOOL[name]) : esc(T.label) + (T.labelTeX ? ' ' + math(T.labelTeX) : '');
      var b = hEl('button', { type: 'button', class: cls, 'data-tool': name, 'aria-pressed': T.instant ? null : String(P.tool === name), title: stripTags(T.desc) + (T.key ? ' (key ' + T.key + ')' : ''), 'aria-keyshortcuts': T.key || null },
        (ICONS[name] || '') + '<span>' + lab + '</span>' + (T.key ? '<span class="kbd tkey" aria-hidden="true">' + T.key + '</span>' : ''));
      if (!T.key) b.removeAttribute('aria-keyshortcuts');
      if (T.instant) b.removeAttribute('aria-pressed');
      bar.appendChild(b);
    });
    // a new tool pulses once
    setTimeout(function () { P.newTools = {}; }, 0);
  }

  function renderToolHint() {
    var el = $('toolhint');
    if (P.trip) {
      var r = P.trip.res, msg;
      if (P.trip.claimed) msg = 'Filled. Pick another tetrahedron any time.';
      else if (!r || !r.ok) msg = 'That isn\u2019t a tetrahedron. Pick again.';
      else if (r.claim && r.claim.allowed !== false) msg = 'Three faces known: fill the fourth (Enter).';
      else if (r.claim) msg = 'The missing face is an outer horn: locked here.';
      else if (r.known) msg = 'All four faces are known already.';
      else msg = 'Choose faces below.';
      el.innerHTML = '<span class="say">' + msg + '</span>';
      return;
    }
    if (P.choice) {
      var m = P.m;
      var mB = P.choice.lift ? maps(baseOf() || {}) : null;
      el.innerHTML = '<span class="say">' + (P.choice.lift ? 'Which triangle below should it lie over?' : 'Fits ' + (P.choice.opts.length === 2 ? 'two' : P.choice.opts.length) + ' ways:') + '</span>' +
        P.choice.opts.map(function (o, i) {
          var tex = P.choice.lift ? (o && o.over ? '\\text{over }' + eTeX(mB, o.over) : null) : o && o.e01 ? triTeXIds(m, o.e01, o.e12, o.e02) : null;
          return '<button type="button" class="mini opt" data-opt="' + i + '">' + (tex ? math(tex) : prose(o && o.text || 'option ' + (i + 1))) + '</button>';
        }).join('') + '<button type="button" class="linklike" data-act="clear">cancel</button>';
      return;
    }
    if (!P.tool) {
      if (P.selEdge && P.m && P.m.e[P.selEdge]) { el.innerHTML = '<span class="say">' + edgeInfoHTML(P.selEdge) + '</span>'; return; }
      el.innerHTML = '<span class="say muted">' + (P.tools.length ? 'Choose a tool (or press its letter). Press ? for keys.' : '') + '</span>';
      return;
    }
    var T = TOOLS[P.tool], i = P.picks.length, step = T.picks[Math.min(i, T.picks.length - 1)];
    var say = step.say;
    if (P.level && P.level.joyal && (P.tool === 'horn0') && i === 0) say = 'Pick a first step marked ' + math('\\cong') + '.';
    if (P.level && P.level.joyal && (P.tool === 'horn2') && i === 0) say = 'Pick a last step marked ' + math('\\cong') + '.';
    var html = '<span class="say">' + say + '</span>';
    if (T.picks.length > 1 && i > 0) {
      html += '<span class="chips">' + P.picks.map(function (p) { return '<span class="chip">' + math(pickTeX(p)) + '</span>'; }).join('') + '</span>' +
        '<button type="button" class="linklike" data-act="clear">clear</button>';
    }
    el.innerHTML = html;
  }

  function renderPicks() { renderToolHint(); applyHighlights(); }

  /* ---------- board geometry ---------- */
  function labelBox(label) { var k = LABEL_FONT / 30; return { hw: Math.max(10, labelWidth(label) * 8.6 * k), hh: 17 * k }; }
  // small screens: the board is scaled down a lot, so draw dots and labels bigger in board units
  function sizeBoard() {
    var w = 0; try { w = $('board-wrap').clientWidth; } catch (e) {}
    var big = w > 0 && w < 560;
    LABEL_FONT = big ? 44 : 30; VR = big ? 28 : 21; LOOP_R = big ? 150 : 124;
    $('board').classList.toggle('big', big);
  }

  function computeGeometry(st, m, gopts) {
    gopts = gopts || {};
    var pos = {}, cx = 0, cy = 0, n = 0;
    var over = (!gopts.noOverride && P.level && progress.pos && progress.pos[lkey(P.level)]) || {};
    arr(st.vertices).forEach(function (v) {
      var x = +v.x, y = +v.y; if (!isFinite(x)) x = 50; if (!isFinite(y)) y = 30;
      if (over[v.id]) { x = over[v.id].x; y = over[v.id].y; }
      pos[v.id] = { x: x * S, y: y * S }; cx += x * S; cy += y * S; n++;
    });
    var cen = n ? { x: cx / n, y: cy / n } : { x: 500, y: 300 };
    var geo = { pos: pos, e: {} };
    var groups = {}, order = [];
    arr(st.edges).forEach(function (e) {
      if (!pos[e.src] || !pos[e.dst] || e.src === e.dst) return;
      var k = e.src < e.dst ? e.src + '\u0001' + e.dst : e.dst + '\u0001' + e.src;
      if (!groups[k]) { groups[k] = []; order.push(k); }
      groups[k].push(e);
    });
    order.forEach(function (k) {
      var list = groups[k], ab = k.split('\u0001'), A = pos[ab[0]], B = pos[ab[1]];
      var dx = B.x - A.x, dy = B.y - A.y, len = Math.sqrt(dx * dx + dy * dy) || 1;
      var nx = -dy / len, ny = dx / len;
      var mid = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
      var side = ((mid.x - cen.x) * nx + (mid.y - cen.y) * ny) >= 0 ? 1 : -1;
      var cnt = list.length;
      list.forEach(function (e, i) {
        var off = (i - (cnt - 1) / 2) * SPACING;
        if (cnt > 1) off *= side;
        var C = { x: mid.x + nx * off * 2, y: mid.y + ny * off * 2 };
        var apex = { x: mid.x + nx * off, y: mid.y + ny * off };
        var lb = labelBox(boardLabel(m, e.id)), sg, onLine = false;
        if (cnt === 1) sg = side; else if (Math.abs(off) < 1e-6) { sg = 0; onLine = true; } else sg = off > 0 ? 1 : -1;
        var gap = 7 + (e.iso ? 16 : 0) + lb.hw * Math.abs(nx) + lb.hh * Math.abs(ny);
        var lab = { x: apex.x + nx * sg * gap, y: apex.y + ny * sg * gap, onLine: onLine, hw: lb.hw, hh: lb.hh, dx: nx * (sg || 1), dy: ny * (sg || 1), fixed: onLine };
        geo.e[e.id] = { type: 'q', P0: pos[e.src], C: C, P1: pos[e.dst], label: lab, mid: apex };
      });
    });
    // loops: in the largest free angular gap around the dot
    var dirs = {};
    arr(st.vertices).forEach(function (v) { dirs[v.id] = []; });
    arr(st.edges).forEach(function (e) {
      var g = geo.e[e.id]; if (!g) return;
      dirs[e.src].push(Math.atan2(g.C.y - g.P0.y, g.C.x - g.P0.x));
      dirs[e.dst].push(Math.atan2(g.C.y - g.P1.y, g.C.x - g.P1.x));
    });
    var loops = {};
    arr(st.edges).forEach(function (e) { if (e.src === e.dst && pos[e.src]) (loops[e.src] = loops[e.src] || []).push(e); });
    Object.keys(loops).forEach(function (vid) {
      var list = loops[vid], V = pos[vid];
      var a = dirs[vid].slice().sort(function (x, y) { return x - y; });
      var base, gap;
      if (!a.length) {
        base = Math.atan2(V.y - cen.y, V.x - cen.x); if (!isFinite(base) || (V.x === cen.x && V.y === cen.y)) base = -Math.PI / 2;
        gap = 2 * Math.PI;
      } else {
        gap = -1;
        for (var i = 0; i < a.length; i++) {
          var nxt = i + 1 < a.length ? a[i + 1] : a[0] + 2 * Math.PI, g = nxt - a[i];
          if (g > gap) { gap = g; base = a[i] + g / 2; }
        }
      }
      var k = list.length, deg = Math.PI / 180;
      var step = Math.min(62 * deg, Math.max(46 * deg, gap / (k + 0.5)));
      list.forEach(function (e, j) {
        var ang = base + (j - (k - 1) / 2) * step;
        var c1 = { x: V.x + LOOP_R * Math.cos(ang - LOOP_SPREAD), y: V.y + LOOP_R * Math.sin(ang - LOOP_SPREAD) };
        var c2 = { x: V.x + LOOP_R * Math.cos(ang + LOOP_SPREAD), y: V.y + LOOP_R * Math.sin(ang + LOOP_SPREAD) };
        var reach = 0.75 * LOOP_R * Math.cos(LOOP_SPREAD), ux = Math.cos(ang), uy = Math.sin(ang);
        var lb = labelBox(boardLabel(m, e.id));
        var d = reach + 8 + lb.hw * Math.abs(ux) + lb.hh * Math.abs(uy);
        geo.e[e.id] = { type: 'c', P0: V, C1: c1, C2: c2, P1: V, mid: { x: V.x + ux * reach, y: V.y + uy * reach },
          label: { x: V.x + ux * d, y: V.y + uy * d, hw: lb.hw, hh: lb.hh, dx: ux, dy: uy } };
      });
    });
    relaxLabels(geo);
    // viewBox
    var minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity;
    function grow(x, y, px, py) { minx = Math.min(minx, x - px); maxx = Math.max(maxx, x + px); miny = Math.min(miny, y - py); maxy = Math.max(maxy, y + py); }
    if (isSandbox(P.level)) { grow(0, 0, 40, 40); grow(1000, 600, 40, 40); }
    Object.keys(pos).forEach(function (id) { grow(pos[id].x, pos[id].y, 90, 80); });
    Object.keys(geo.e).forEach(function (id) {
      var g = geo.e[id];
      grow(g.label.x, g.label.y, g.label.hw + 12, g.label.hh + 12);
      if (g.type === 'c') { grow(g.C1.x, g.C1.y, 12, 12); grow(g.C2.x, g.C2.y, 12, 12); }
      else grow(g.mid.x, g.mid.y, 20, 20);
    });
    if (!isFinite(minx)) { minx = -50; miny = -50; maxx = 1050; maxy = 650; }
    var w = maxx - minx, hgt = maxy - miny;
    if (w < 560) { minx -= (560 - w) / 2; w = 560; }
    if (hgt < 300) { miny -= (300 - hgt) / 2; hgt = 300; }
    geo.vb = [r1(minx), r1(miny), r1(w), r1(hgt)];
    // while a dot is being dragged the view must not jump around
    if (P.vbFrozen && !gopts.noFreeze) geo.vb = P.vbFrozen.slice();
    return geo;
  }

  // push overlapping labels apart along their own outward direction; also keep them off the dots and arrow midpoints
  function relaxLabels(geo) {
    var L = Object.keys(geo.e).map(function (id) { return geo.e[id].label; });
    var obst = Object.keys(geo.pos).map(function (id) { return { x: geo.pos[id].x, y: geo.pos[id].y, hw: VR + 4, hh: VR + 4 }; });
    function over(a, b) { return Math.abs(a.x - b.x) < a.hw + b.hw + 2 && Math.abs(a.y - b.y) < a.hh + b.hh + 2; }
    for (var it = 0; it < 40; it++) {
      var moved = false;
      for (var i = 0; i < L.length; i++) {
        var a = L[i], hit = false;
        if (a.fixed) continue;
        for (var j = 0; j < L.length && !hit; j++) if (j !== i && over(a, L[j])) hit = true;
        for (var k = 0; k < obst.length && !hit; k++) if (over(a, obst[k])) hit = true;
        if (hit && (a.pushed || 0) < 90) { a.x += a.dx * 6; a.y += a.dy * 6; a.pushed = (a.pushed || 0) + 6; moved = true; }
      }
      if (!moved) break;
    }
  }

  function edgeD(g) {
    if (g.type === 'q') {
      var a = towards(g.P0, g.C, VR + 3), b = towards(g.P1, g.C, VR + 4);
      return 'M' + pt(a) + ' Q' + pt(g.C) + ' ' + pt(b);
    }
    var a2 = towards(g.P0, g.C1, VR + 3), b2 = towards(g.P1, g.C2, VR + 4);
    return 'M' + pt(a2) + ' C' + pt(g.C1) + ' ' + pt(g.C2) + ' ' + pt(b2);
  }
  function seg(g, fwd) {
    if (g.type === 'q') return ' Q' + pt(g.C) + ' ' + pt(fwd ? g.P1 : g.P0);
    return ' C' + pt(fwd ? g.C1 : g.C2) + ' ' + pt(fwd ? g.C2 : g.C1) + ' ' + pt(fwd ? g.P1 : g.P0);
  }
  // The fill runs exactly along the three drawn arrows: from each corner dot, along the arrow's own curve, to the
  // next corner dot. An identity side is a single point, so it adds nothing (it must not fill its loop).
  function triPath(t, geo, m) {
    var e01 = m.e[t.e01], e12 = m.e[t.e12], e02 = m.e[t.e02];
    if (!e01 || !e12 || !e02) return null;
    var a = geo.pos[e01.src], b = geo.pos[e01.dst], c = geo.pos[e12.dst];
    if (!a || !b || !c) return null;
    var d = 'M' + pt(a);
    function side(id, e, fwd, to) {
      var g = geo.e[id];
      if (!g || e.src === e.dst) { d += ' L' + pt(to); return; }
      d += ' L' + pt(fwd ? (g.type === 'q' ? g.P0 : g.P0) : g.P1);
      if (g.type === 'q') d += ' Q' + pt(g.C) + ' ' + pt(fwd ? g.P1 : g.P0);
      else d += ' C' + pt(fwd ? g.C1 : g.C2) + ' ' + pt(fwd ? g.C2 : g.C1) + ' ' + pt(fwd ? g.P1 : g.P0);
      d += ' L' + pt(to);
    }
    side(t.e01, e01, true, b);
    side(t.e12, e12, true, c);
    side(t.e02, e02, false, a);
    return d + ' Z';
  }
  function edgeKindClass(e) {
    var k = e.kind || 'given';
    if (k === 'drawn') k = 'given';
    if (k !== 'given' && k !== 'composite' && k !== 'identity' && k !== 'solved') k = 'given';
    return k;
  }
  function tetraVerts(T, m) {
    if (Array.isArray(T.vertices) && T.vertices.length) return T.vertices.slice();
    var vs = [];
    arr(T.faces).forEach(function (fid) {
      var t = m.t[fid]; if (!t) return;
      [t.e01, t.e12, t.e02].forEach(function (eid) { var e = m.e[eid]; if (e) { vs.push(e.src, e.dst); } });
    });
    return vs;
  }
  function uniq(a) { var o = {}, r = []; a.forEach(function (x) { if (x != null && !o[x]) { o[x] = 1; r.push(x); } }); return r; }
  function hull(points) {
    var p = points.slice().sort(function (a, b) { return a.x - b.x || a.y - b.y; });
    if (p.length < 3) return p;
    function cross(o, a, b) { return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x); }
    var lo = [], up = [];
    p.forEach(function (q) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); });
    for (var i = p.length - 1; i >= 0; i--) { var q = p[i]; while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
    return lo.slice(0, -1).concat(up.slice(0, -1));
  }

  // plain mode: stay loops are drawn only once a shown fact or the current pick uses them; free stay-facts are not drawn
  function shownFact(t) { return mathMode() || !isThin(t); }
  function viewState(st, m) {
    if (mathMode()) return st;
    var used = {};
    arr(st.triangles).forEach(function (t) { if (shownFact(t)) used[t.e01] = used[t.e12] = used[t.e02] = 1; });
    (P.trip ? P.trip.steps : P.picks.map(function (p) { return p.id; })).forEach(function (id) { used[id] = 1; });
    if (P.trip && P.trip.res && P.trip.res.slots) SLOTS.forEach(function (k) {
      var f = P.trip.res.slots[k] && factInfo(P.trip.res.slots[k].chosen);
      if (f && !f.free) used[f.e01] = used[f.e12] = used[f.e02] = 1;
    });
    var edges = arr(st.edges).filter(function (e) { return !isIdentityEdge(m, e.id) || used[e.id]; });
    var keep = setOf(edges.map(function (e) { return e.id; }));
    return { vertices: st.vertices, edges: edges, tetras: st.tetras,
      triangles: arr(st.triangles).filter(function (t) { return shownFact(t) && keep[t.e01] && keep[t.e12] && keep[t.e02]; }) };
  }

  // lifting levels: what each X simplex lies over in S (the shadow)
  function projMap() { return (P.state && (P.state.proj || (P.state.level && P.state.level.proj))) || (P.level && P.level.proj) || {}; }
  function baseOf() { return (P.state && P.state.base) || (P.state && P.state.level && P.state.level.base) || (P.level && P.level.base) || null; }

  function drawEdges(st, geo, m, gE, opts) {
    opts = opts || {};
    arr(st.edges).forEach(function (e) {
      var g = geo.e[e.id]; if (!g) return;
      if (opts.skip && opts.skip[e.id]) return;
      var kc = edgeKindClass(e), lab = boardLabel(m, e.id);
      var isFresh = !opts.shadow && P.fresh.edges[e.id] && !reduceMotion;
      var over = opts.overClass ? opts.overClass(e.id) : '';
      var attrs = { class: 'edge k-' + kc + (isFresh ? ' fresh' : '') + (over ? ' ' + over : '') + (opts.shadow ? ' shadow' : '') };
      if (!opts.shadow) {
        attrs['data-eid'] = e.id; attrs.tabindex = '0'; attrs.role = 'button';
        attrs['aria-label'] = 'arrow ' + stripTags(lab) + ' from ' + vLabel(m, e.src) + ' to ' + vLabel(m, e.dst) + (e.iso ? ', an isomorphism' : '');
      } else attrs['data-sid'] = e.id;
      var grp = sEl('g', attrs);
      var d = edgeD(g);
      if (!opts.shadow) {
        var ttl = sEl('title'); ttl.textContent = stripTags(lab) + ': ' + vLabel(m, e.src) + ' → ' + vLabel(m, e.dst) + (e.origin ? ' (' + stripTags(originText(m, e.id)) + ')' : '');
        grp.appendChild(ttl);
        grp.appendChild(sEl('path', { d: d, class: 'hit' }));
      }
      var line = sEl('path', { d: d, class: 'line', 'marker-end': 'url(#ah-' + kc + ')' });
      if (isFresh && kc !== 'identity') { line.setAttribute('pathLength', '1'); line.classList.add('draw'); }
      grp.appendChild(line);
      if (e.iso) {
        var iso = sEl('text', { x: r1(g.mid.x), y: r1(g.mid.y), class: 'iso', 'text-anchor': 'middle', 'dominant-baseline': 'central' });
        iso.textContent = '≅';
        grp.appendChild(iso);
      }
      var tx = sEl('text', { x: r1(g.label.x), y: r1(g.label.y), class: 'elabel' + (g.label.onLine ? ' online' : ''), 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': LABEL_FONT });
      fillLabel(tx, lab);
      grp.appendChild(tx);
      grp.setAttribute('data-kind', kc);
      gE.appendChild(grp);
      if (!opts.shadow) P.els.edge[e.id] = grp; else P.els.sedge[e.id] = grp;
    });
  }
  function drawVerts(st, geo, m, gV, opts) {
    opts = opts || {};
    arr(st.vertices).forEach(function (v) {
      var p = geo.pos[v.id];
      var over = opts.overClass ? opts.overClass(v.id) : '';
      var attrs = { class: 'vert' + (over ? ' ' + over : '') + (opts.shadow ? ' shadow' : ''), transform: 'translate(' + pt(p) + ')' };
      if (!opts.shadow) { attrs['data-vid'] = v.id; attrs.tabindex = '0'; attrs.role = 'button'; attrs['aria-label'] = 'dot ' + vLabel(m, v.id); }
      else attrs['data-sid'] = v.id;
      var grp = sEl('g', attrs);
      var body = sEl('g', { class: 'vbody' + (!opts.shadow && P.fresh.vertices[v.id] && !reduceMotion ? ' fresh' : '') });
      if (!opts.shadow) body.appendChild(sEl('circle', { r: VR + 24, class: 'vhit' }));
      body.appendChild(sEl('circle', { r: VR + 6, class: 'vring' }));
      body.appendChild(sEl('circle', { r: VR, class: 'vdot' }));
      var tx = sEl('text', { class: 'vlabel', 'text-anchor': 'middle', 'dominant-baseline': 'central', y: 1 });
      fillLabel(tx, vLabel(m, v.id));
      body.appendChild(tx);
      grp.appendChild(body);
      gV.appendChild(grp);
      if (!opts.shadow) P.els.vert[v.id] = grp; else P.els.svert[v.id] = grp;
    });
  }

  function renderBoard() {
    var svg = $('board'), st = P.state, m = P.m;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    sizeBoard();
    st = viewState(st, m);
    var geo = computeGeometry(st, m);
    var L = P.layers || {};
    // lifting: S (the shadow) is drawn below X, never changes and is not clickable
    var base = baseOf(), geoS = null, mS = null, sDy = 0;
    if (base) {
      var sst = { vertices: arr(base.vertices), edges: arr(base.edges), triangles: arr(base.triangles) };
      mS = maps(sst);
      geoS = computeGeometry(sst, mS, { noOverride: true, noFreeze: true });
      // The frame comes from X's DEFAULT layout, not from where the player dragged its dots: otherwise
      // dragging a dot re-fits the board, the shadow S jumps, and the dot runs away from the cursor.
      var geo0 = computeGeometry(st, m, { noOverride: true, noFreeze: true });
      sDy = (geo0.vb[1] + geo0.vb[3]) - geoS.vb[1] + 50;
      var x0 = Math.min(geo0.vb[0], geoS.vb[0]), x1 = Math.max(geo0.vb[0] + geo0.vb[2], geoS.vb[0] + geoS.vb[2]);
      geo.vb = [x0, geo0.vb[1], r1(x1 - x0), r1(geoS.vb[1] + geoS.vb[3] + sDy - geo0.vb[1])];
      // dragged X dots must stay in X's part of the board, above the line that separates it from S
      P.dragBounds = { x0: x0 + VR + 4, x1: x1 - VR - 4, y0: geo0.vb[1] + VR + 4, y1: geoS.vb[1] - 25 + sDy - VR - 20 };
    } else P.dragBounds = null;
    P.geo = geo;
    svg.setAttribute('viewBox', geo.vb.join(' '));
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.classList.toggle('placing', P.tool === 'addVertex');
    svg.classList.toggle('lifting', !!base);
    var sk = P.skel;

    var defs = sEl('defs');
    ['given', 'composite', 'identity', 'solved', 'sel', 'hi'].forEach(function (k) {
      var mk = sEl('marker', { id: 'ah-' + k, viewBox: '0 0 12 10', refX: '11', refY: '5', markerWidth: '20', markerHeight: '17', markerUnits: 'userSpaceOnUse', orient: 'auto' });
      mk.appendChild(sEl('path', { d: 'M0,0 L12,5 L0,10 L3,5 Z', class: 'ah ah-' + k }));
      defs.appendChild(mk);
    });
    var pat = sEl('pattern', { id: 'hatch', width: '14', height: '14', patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' });
    pat.appendChild(sEl('line', { x1: '0', y1: '0', x2: '0', y2: '14', class: 'hatch-line' }));
    defs.appendChild(pat);
    svg.appendChild(defs);
    svg.appendChild(sEl('rect', { x: geo.vb[0], y: geo.vb[1], width: geo.vb[2], height: geo.vb[3], class: 'board-bg' }));

    var gS = sEl('g', { class: 'solids' }), gF = sEl('g', { class: 'fills' }), gE = sEl('g', { class: 'edges' }), gV = sEl('g', { class: 'verts' }),
      gT = sEl('g', { class: 'tags' }), gG = sEl('g', { class: 'ghosts' }), gB = sEl('g', { class: 'badges' }), gGoal = sEl('g', { class: 'goalghost' });
    P.els = { edge: {}, vert: {}, tri: {}, tet: {}, sedge: {}, svert: {}, card: P.els.card, tags: gT, ghosts: gG, badges: gB, ghostGoal: gGoal };

    // the shadow S
    if (base && geoS) {
      var gSh = sEl('g', { class: 'shadow-layer', transform: 'translate(0,' + r1(sDy) + ')' });
      gSh.appendChild(sEl('line', { x1: geo.vb[0], x2: geo.vb[0] + geo.vb[2], y1: r1(geoS.vb[1] - 25), y2: r1(geoS.vb[1] - 25), class: 'shadow-rule' }));
      var lab = sEl('text', { x: r1(geo.vb[0] + 16), y: r1(geoS.vb[1] - 6), class: 'shadow-name' }); var lic = P.level && P.level.licence;
      lab.textContent = 'S, the shadow' + (lic === 'left' ? ', under a left fibration' : lic === 'inner' ? ', under an inner fibration' : '');
      gSh.appendChild(lab);
      var sIdx = {}; arr(base.edges).forEach(function (e, i) { sIdx[e.id] = i % 4; });
      var sF = sEl('g'), sE = sEl('g'), sV = sEl('g');
      arr(base.triangles).forEach(function (t, i) { var d = triPath(t, geoS, mS); if (d) sF.appendChild(sEl('path', { d: d, class: 'tri tc' + (i % 4), 'data-sid': t.id })); });
      drawEdges({ edges: arr(base.edges) }, geoS, mS, sE, { shadow: true, overClass: function (id) { return 'ov' + sIdx[id]; } });
      drawVerts({ vertices: arr(base.vertices) }, geoS, mS, sV, { shadow: true });
      gSh.appendChild(sF); gSh.appendChild(sE); gSh.appendChild(sV);
      svg.appendChild(gSh);
      // faint guides from each X dot down to the dot it lies over
      var pr = projMap(), gGuide = sEl('g', { class: 'guides' });
      arr(st.vertices).forEach(function (v) {
        var s = pr[v.id], a = geo.pos[v.id], b = s && geoS.pos[s];
        if (a && b) gGuide.appendChild(sEl('line', { x1: r1(a.x), y1: r1(a.y + VR), x2: r1(b.x), y2: r1(b.y + sDy - VR), class: 'guide' }));
      });
      svg.appendChild(gGuide);
      P.shadowIdx = sIdx;
    }
    var pr2 = base ? projMap() : null;
    function overClass(id) { var s = pr2 && pr2[id]; return s != null && P.shadowIdx && P.shadowIdx[s] != null ? 'ov' + P.shadowIdx[s] : ''; }

    if (sk >= 3 && L.s !== false) arr(st.tetras).forEach(function (T) {
      var vs = uniq(tetraVerts(T, m)).filter(function (v) { return geo.pos[v]; });
      if (vs.length < 4) return;
      var h = hull(vs.map(function (v) { return geo.pos[v]; }));
      var p = sEl('path', { d: 'M' + h.map(pt).join(' L') + 'Z', class: 'tet' + (P.fresh.tetras[T.id] && !reduceMotion ? ' fresh' : ''), 'data-tet': T.id });
      gS.appendChild(p); P.els.tet[T.id] = p;
    });

    // unfold identities: degenerate triangles get a ghost copy of their repeated dot
    var unf = unfoldModel(st, geo, m);
    P.unfoldModel = unf;
    if (unf && !P.vbFrozen) {
      var vb = geo.vb.slice(), x0 = vb[0], y0 = vb[1], x1 = vb[0] + vb[2], y1 = vb[1] + vb[3];
      Object.keys(unf.ghosts).forEach(function (k) { var r0 = unf.ghosts[k].rest; x0 = Math.min(x0, r0.x - 70); y0 = Math.min(y0, r0.y - 60); x1 = Math.max(x1, r0.x + 70); y1 = Math.max(y1, r0.y + 60); });
      geo.vb = [r1(x0), r1(y0), r1(x1 - x0), r1(y1 - y0)];
      svg.setAttribute('viewBox', geo.vb.join(' '));
      var bg = svg.querySelector('.board-bg'); if (bg) { bg.setAttribute('x', geo.vb[0]); bg.setAttribute('y', geo.vb[1]); bg.setAttribute('width', geo.vb[2]); bg.setAttribute('height', geo.vb[3]); }
    }
    var unfolded = {};
    if (unf) unf.tris.forEach(function (u) { unfolded[u.t.id] = 1; unfolded['loop:' + u.idArrow.v] = 1; });

    if (sk >= 2 && L.t !== false) arr(st.triangles).forEach(function (t, i) {
      if (unfolded[t.id]) return;
      var d = triPath(t, geo, m); if (!d) return;
      var p = sEl('path', { d: d, class: 'tri tc' + (i % 4) + (P.fresh.triangles[t.id] && !reduceMotion ? ' fresh' : ''), 'data-tid': t.id, 'fill-rule': 'nonzero' });
      gF.appendChild(p); P.els.tri[t.id] = p;
    });

    if (sk >= 1 && L.e !== false) {
      var skip = {};
      if (unf) arr(st.edges).forEach(function (e) { if (isIdentityEdge(m, e.id) && unfolded['loop:' + e.src]) skip[e.id] = 1; });
      drawEdges(st, geo, m, gE, { skip: skip, overClass: base ? overClass : null });
    }
    if (L.v !== false) drawVerts(st, geo, m, gV, { overClass: base ? overClass : null });
    if (unf && L.t !== false) {
      drawUnfold(unf, gF, gE, gV, m);
      Array.prototype.forEach.call(gF.querySelectorAll('.tri.unf'), function (n) { var id = n.getAttribute('data-tid'); if (!P.els.tri[id]) P.els.tri[id] = n; });
    }

    svg.classList.toggle('unf-tetra', !!(unf && unf.tetra));
    svg.appendChild(gS); svg.appendChild(gF); svg.appendChild(gGoal); svg.appendChild(gE); svg.appendChild(gV); svg.appendChild(gG); svg.appendChild(gT); svg.appendChild(gB);
    if (!arr(st.vertices).length) {
      var t = sEl('text', { x: r1(geo.vb[0] + geo.vb[2] / 2), y: r1(geo.vb[1] + geo.vb[3] / 2), class: 'board-empty', 'text-anchor': 'middle' });
      t.textContent = engineHas('addVertex') ? 'Empty. Use “Add dot”.' : 'Empty.';
      svg.appendChild(t);
    }
    renderShowBar();
  }

  /* peel: copy the top layer before it goes, then let it fall */
  function peelGhosts() {
    var st = P.state, list = [];
    if (arr(st.tetras).length) Object.keys(P.els.tet).forEach(function (id) { list.push(P.els.tet[id]); });
    else if (arr(st.triangles).length) Object.keys(P.els.tri).forEach(function (id) { list.push(P.els.tri[id]); });
    else Object.keys(P.els.edge).forEach(function (id) { list.push(P.els.edge[id]); });
    return list.map(function (n) { return n.cloneNode(true); });
  }
  function dropGhosts(ghosts) {
    if (reduceMotion || !ghosts.length) return;
    var g = P.els.ghosts; if (!g) return;
    ghosts.forEach(function (n, i) {
      n.removeAttribute('tabindex'); n.removeAttribute('data-eid'); n.removeAttribute('data-tid'); n.removeAttribute('role');
      n.classList.remove('fresh', 'hi', 'sel', 'live', 'dim', 'pulse');
      n.classList.add('peeled');
      n.style.animationDelay = (i * 40) + 'ms';
      g.appendChild(n);
    });
    setTimeout(function () { ghosts.forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); }); }, 1100 + ghosts.length * 40);
  }

  function applyHighlights() {
    var m = P.m; if (!m) return;
    var hiE = {}, hiT = {}, selE = {}, selV = {}, selT = {};
    [P.hoverTri, P.pinnedTri].forEach(function (id) {
      var t = id && m.t[id]; if (!t) return;
      hiT[id] = 1; hiE[t.e01] = hiE[t.e12] = hiE[t.e02] = 1;
    });
    arr(P.previewEdges).forEach(function (id) { hiE[id] = 1; });
    var picks = P.choice ? P.choice.picks : P.trip ? P.trip.picks : P.picks;
    picks.forEach(function (p, i) {
      if (p.stay) selV[p.v] = i + 1;
      else if (p.kind === 'edge') selE[p.id] = i + 1;
      else if (p.kind === 'vertex') selV[p.id] = i + 1;
      else if (p.kind === 'tri') { selT[p.id] = i + 1; var t = m.t[p.id]; if (t) hiE[t.e01] = hiE[t.e12] = hiE[t.e02] = 1; }
    });
    // the trip's shortcuts light up as the slots are chosen
    if (P.trip && P.trip.res && P.trip.res.slots) {
      var sl = P.trip.res.slots;
      ['A', 'B', 'C', 'D'].forEach(function (k) {
        var f = sl[k] && factInfo(sl[k].chosen);
        if (f) { hiE[f.e02] = 1; if (k === 'C') hiE[f.e01] = 1; if (k === 'D') hiE[f.e12] = 1; }
      });
      picks.forEach(function (p) { delete hiE[p.id]; });
    }
    var step = currentStep(), live = liveSets();
    var acc = step && !P.choice && !P.trip && !(P.won && !P.picks.length) ? step.accept.slice() : [];
    var stayTool = P.tool && TOOLS[P.tool] && TOOLS[P.tool].stay;
    if (stayTool && acc.indexOf('edge') >= 0) acc.push('vertex');
    function state(kind, id) {
      if (acc.indexOf(kind) < 0) return '';
      if (!live || live.quiet) return 'live';
      if (kind === 'vertex' && stayTool) return isLive(live, { stay: true, v: id, id: 'id:' + id }) ? 'live' : 'dim';
      if (!live[kind]) return 'live';
      return live[kind][id] ? 'live' : 'dim';
    }
    var pulse = P.pulse && !!P.tool && !(live && live.quiet);
    // guided trip (intro levels): pulse exactly the next step of the intended trip
    var guide = introTripTarget();
    if (guide) pulse = false;
    Object.keys(P.els.edge).forEach(function (id) {
      var g = P.els.edge[id], k = g.getAttribute('data-kind');
      var sel = !!selE[id], hi = !!hiE[id], s = sel ? '' : state('edge', id);
      g.classList.toggle('sel', sel); g.classList.toggle('hi', hi && !sel);
      g.classList.toggle('live', s === 'live'); g.classList.toggle('dim', s === 'dim');
      g.classList.toggle('pulse', (pulse && s === 'live') || (!!guide && guide === id));
      var line = g.querySelector('.line');
      if (line) line.setAttribute('marker-end', 'url(#ah-' + (sel ? 'sel' : hi ? 'hi' : k) + ')');
    });
    Object.keys(P.els.tri).forEach(function (id) {
      P.els.tri[id].classList.toggle('hi', !!hiT[id]);
      P.els.tri[id].classList.toggle('sel', !!selT[id]);
    });
    Object.keys(P.els.vert).forEach(function (id) {
      var v = P.els.vert[id], s = selV[id] ? '' : state('vertex', id);
      v.classList.toggle('sel', !!selV[id]);
      v.classList.toggle('live', s === 'live'); v.classList.toggle('dim', s === 'dim');
      v.classList.toggle('pulse', (pulse && s === 'live' && !(stayTool && acc.indexOf('vertex') >= 0 && TOOLS[P.tool].picks[0].accept.indexOf('vertex') < 0)) || (!!guide && guide === 'id:' + id));
    });
    Object.keys(P.els.card).forEach(function (id) {
      var c = P.els.card[id], s = selT[id] ? '' : state('tri', id);
      c.classList.toggle('pinned', P.pinnedTri === id);
      c.classList.toggle('picked', !!selT[id]);
      c.classList.toggle('live', s === 'live'); c.classList.toggle('dim', s === 'dim');
      c.classList.toggle('pulse', (pulse && s === 'live') || (!!guide && guide === 'tri:' + id));
      c.setAttribute('aria-pressed', String(!!selT[id] || P.pinnedTri === id));
      var badge = c.querySelector('.pnum');
      if (badge) badge.textContent = selT[id] ? String(selT[id]) : '';
    });
    $('facts').classList.toggle('picking', acc.indexOf('tri') >= 0);
    // isolate: a clicked fact card dims everything that is not part of it
    var iso = P.pinnedTri && m.t[P.pinnedTri], isoE = {}, isoV = {};
    if (iso) { [iso.e01, iso.e12, iso.e02].forEach(function (id) { isoE[id] = 1; var e = m.e[id]; if (e) { isoV[e.src] = isoV[e.dst] = 1; } else if (/^id:/.test(id)) isoV[id.slice(3)] = 1; }); }
    Object.keys(P.els.edge).forEach(function (id) { P.els.edge[id].classList.toggle('isodim', !!iso && !isoE[id]); P.els.edge[id].classList.toggle('selinfo', P.selEdge === id); });
    Object.keys(P.els.vert).forEach(function (id) { P.els.vert[id].classList.toggle('isodim', !!iso && !isoV[id]); });
    Object.keys(P.els.tri).forEach(function (id) { P.els.tri[id].classList.toggle('isodim', !!iso && id !== P.pinnedTri); });
    Object.keys(P.els.card).forEach(function (id) { P.els.card[id].classList.toggle('isolated', P.pinnedTri === id); });
    // lifting: the shadow of what is highlighted lights up below
    if (P.els.sedge) {
      var pr = projMap(), lit = {};
      Object.keys(hiE).concat(Object.keys(selE)).concat(P.hoverEdge ? [P.hoverEdge] : []).forEach(function (id) { if (pr[id]) lit[pr[id]] = 1; });
      Object.keys(P.els.sedge).forEach(function (id) { P.els.sedge[id].classList.toggle('hi', !!lit[id]); });
    }
    drawGoalGhost();
    drawBadges();
    // numbered pick tags on the board
    var gT = P.els.tags; if (!gT || !P.geo) return;
    while (gT.firstChild) gT.removeChild(gT.firstChild);
    var seen = {};
    picks.forEach(function (p, i) {
      var at = null, key = p.stay ? 'v:' + p.v : p.id, k = seen[key] || 0;
      seen[key] = k + 1;
      if (p.stay && P.geo.pos[p.v]) at = { x: P.geo.pos[p.v].x + VR + 6 + k * 30, y: P.geo.pos[p.v].y - VR - 6 };
      else if (p.kind === 'edge' && P.geo.e[p.id]) { var L = P.geo.e[p.id].label; at = { x: L.x + L.hw + 12 + k * 30, y: L.y - L.hh - 2 }; }
      else if (p.kind === 'vertex' && P.geo.pos[p.id]) at = { x: P.geo.pos[p.id].x + VR + 6 + k * 30, y: P.geo.pos[p.id].y - VR - 6 };
      if (!at) return;
      var g = sEl('g', { class: 'ptag', transform: 'translate(' + pt(at) + ')' });
      g.appendChild(sEl('circle', { r: 14 }));
      var tx = sEl('text', { 'text-anchor': 'middle', 'dominant-baseline': 'central', y: 1 }); tx.textContent = String(i + 1);
      g.appendChild(tx); gT.appendChild(g);
    });
  }

  /* ================= the Tetrahedron panel (SPEC4 §3) =================
   * Two ways in: three facts (faces, the default) or three arrows end to end (a path; a dot = identity).
   * Corners 0..3; face k is the one opposite corner k. Slots: A = d3 (0 1 2), B = d0 (1 2 3), C = d1 (0 2 3), D = d2 (0 1 3).
   * Once open, everything runs through routeSlots on the spine (e01, e12, e23). */
  var SLOTS = ['A', 'B', 'C', 'D'];
  var SLOT_FACE = { A: 3, B: 0, C: 1, D: 2 };
  var FACE_CORNERS = { A: [0, 1, 2], B: [1, 2, 3], C: [0, 2, 3], D: [0, 1, 3] };
  var FACE_EDGES = { A: ['e01', 'e12', 'e02'], B: ['e12', 'e23', 'e13'], C: ['e02', 'e23', 'e03'], D: ['e01', 'e13', 'e03'] };

  // a fact may come as a triangle id, a free 's0:<edge>' / 's1:<edge>' ref, or an object
  function factRef(x) { return x == null ? null : typeof x === 'string' ? x : (x.ref || x.id || null); }
  function factInfo(x) {
    if (x == null) return null;
    var m = P.m || maps(P.state);
    if (typeof x === 'object' && x.e01 != null) return { ref: factRef(x), e01: x.e01, e12: x.e12, e02: x.e02, free: !!x.free || /^s[01]:/.test(factRef(x) || '') };
    var ref = factRef(x);
    if (!ref) return null;
    var t = m.t[ref];
    if (t) return { ref: ref, e01: t.e01, e12: t.e12, e02: t.e02, free: isThin(t) };
    var mm = /^s([01]):(.+)$/.exec(ref);
    if (mm) {
      var eid = mm[2];
      if (isIdentityEdge(m, eid)) return { ref: ref, e01: eid, e12: eid, e02: eid, free: true };
      var e = m.e[eid]; if (!e) return null;
      return mm[1] === '0' ? { ref: ref, e01: 'id:' + e.src, e12: eid, e02: eid, free: true } : { ref: ref, e01: eid, e12: 'id:' + e.dst, e02: eid, free: true };
    }
    return null;
  }
  function factTeX(f) { return f ? triTeXIds(P.m, f.e01, f.e12, f.e02) : '?'; }
  function tripVerts(steps) {
    var m = P.m, vs = [];
    steps.forEach(function (id, i) {
      var src, dst;
      if (isIdentityEdge(m, id)) { src = dst = id.slice(3); }
      else { var e = m.e[id]; src = e && e.src; dst = e && e.dst; }
      if (i === 0) vs.push(src);
      vs.push(dst);
    });
    return vs;
  }
  function tetraEdges(r) {
    var ed = (r && r.edges) || {};
    var st = P.trip ? P.trip.steps : [];
    return { e01: ed.e01 || st[0] || null, e12: ed.e12 || st[1] || null, e23: ed.e23 || st[2] || null, e02: ed.e02 || null, e13: ed.e13 || null, e03: ed.e03 || null };
  }

  function openTetra(picks) {
    var mode = picks[0].kind === 'tri' ? 'faces' : 'path';
    P.trip = { mode: mode, picks: picks, steps: mode === 'path' ? picks.map(function (p) { return p.id; }) : null,
      ids: picks.map(function (p) { return p.id; }), choice: {}, res: null, claimed: null };
    if (mode === 'faces') {
      var r = null;
      if (engineHas('tetraFromFacts')) {
        try { r = HC.Engine.tetraFromFacts(P.state, P.trip.ids.slice()); } catch (e) { try { console.error(e); } catch (e2) {} r = null; }
      }
      if (!r && !engineHas('tetraFromFacts')) {
        // older engine: no panel, just fill the fourth face
        P.trip = null;
        doMove(['fill3', picks.map(function (p) { return p.id; })], picks);
        return;
      }
      if (!r || !r.ok) {
        P.trip.res = r || { ok: false, reason: 'These don’t fit as faces of one tetrahedron.' };
        shakeItems(picks);
        renderTrip(); applyHighlights(); renderToolHint();
        return;
      }
      // from now on the panel works on the spine of that tetrahedron, with the picked facts as fixed choices
      var ed = tetraEdges(r);
      P.trip.steps = Array.isArray(r.steps) && r.steps.length === 3 ? r.steps.slice() : [ed.e01, ed.e12, ed.e23];
      if (r.choice && typeof r.choice === 'object') Object.keys(r.choice).forEach(function (k) { P.trip.choice[k] = r.choice[k]; });
      else SLOTS.forEach(function (k) {
        var c = r.slots && r.slots[k] && factRef(r.slots[k].chosen);
        if (c && P.trip.ids.indexOf(c) >= 0) P.trip.choice[k] = c;
      });
    }
    refreshTrip();
    try { var el = $('trip'); if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' }); } catch (e) {}
  }
  function closeTrip() { P.trip = null; P.hoverTri = null; P.previewEdges = null; unmountTetra3D(); renderTrip(); applyHighlights(); renderToolHint(); }
  function refreshTrip() {
    if (!P.trip) { renderTrip(); return; }
    var r = null;
    if (!P.trip.steps || P.trip.steps.some(function (s) { return !s; })) r = { ok: false, reason: 'These don’t fit as faces of one tetrahedron.' };
    else if (engineHas('routeSlots')) {
      try { r = HC.Engine.routeSlots(P.state, P.trip.steps.slice(), Object.keys(P.trip.choice).length ? P.trip.choice : undefined); }
      catch (e) { try { console.error(e); } catch (e2) {} r = { ok: false, reason: 'Hmm, that tetrahedron hit a snag.' }; }
    } else r = { ok: false, reason: 'The tetrahedron tool is not ready yet.' };
    P.trip.res = r || { ok: false, reason: 'Those steps don’t connect end to end.' };
    // auto-filled faces can cascade into "all four known"; also ask what fits given only the player's own choices
    P.trip.alt = null;
    if (r && r.ok && r.slots) {
      var alt = {}, any = false;
      SLOTS.forEach(function (k) {
        if (P.trip.choice[k] !== undefined) alt[k] = P.trip.choice[k];
        else { alt[k] = null; if (r.slots[k] && r.slots[k].chosen) any = true; }
      });
      if (any) try { P.trip.alt = HC.Engine.routeSlots(P.state, P.trip.steps.slice(), alt); } catch (e) { P.trip.alt = null; }
    }
    renderTrip(); applyHighlights(); renderToolHint();
  }
  function tripChoose(slot, ref) {
    if (!P.trip) return;
    P.trip.claimed = null;
    P.trip.choice[slot] = ref == null ? null : ref;
    refreshTrip();
  }
  // cycle a face through its candidates (click on a face in the 3D view or its row)
  function tripCycle(slot) {
    if (!P.trip || !P.trip.res || !P.trip.res.slots) return;
    var s = P.trip.res.slots[slot]; if (!s) return;
    var pool = arr(s.cands);
    if (P.trip.choice[slot] === undefined && P.trip.alt && P.trip.alt.slots && P.trip.alt.slots[slot]) pool = arr(P.trip.alt.slots[slot].cands);
    var refs = pool.map(factRef).filter(Boolean);
    if (!refs.length) return;
    var cur = factRef(s.chosen), i = refs.indexOf(cur);
    tripChoose(slot, refs[(i + 1) % refs.length]);
  }
  function tripChosenRefs() {
    var r = P.trip && P.trip.res, out = {};
    if (!r || !r.slots) return out;
    SLOTS.forEach(function (k) { var c = r.slots[k] && factRef(r.slots[k].chosen); if (c) out[k] = c; });
    return out;
  }
  function tripClaim() {
    if (!P.trip || !P.trip.res || !P.trip.res.claim) return false;
    var cl = P.trip.res.claim, steps = P.trip.steps.slice(), choice = tripChosenRefs();
    delete choice[cl.slot];
    if (cl.allowed === false) {
      restartAnim(document.querySelector('#trip [data-act="claim"]') || $('trip'), 'shake');
      toast(prose(cl.reason || 'Only an isomorphism allows that.'), 'info');
      return false;
    }
    var picks = P.trip.picks;
    var res = doMove(['trip', steps, choice], picks);
    if (res && res.ok && P.trip) {
      var newT = arr(res.added && res.added.triangles).filter(function (id) { return P.m.t[id] && !isThin(P.m.t[id]); })[0];
      P.trip.choice = choice;
      if (newT) P.trip.choice[cl.slot] = newT;
      var keep = cl.slot;
      refreshTrip();
      if (P.trip) { P.trip.claimed = keep; renderTrip(); renderToolHint(); }
    }
    return !!(res && res.ok);
  }
  function introTripTarget() {
    if (!P.level || !isIntro(P.level) || P.tool !== 'tetra' || P.trip || P.won) return null;
    var s = arr(P.level.solution).filter(function (x) { return x && (x[0] === 'trip' || x[0] === 'tetra'); })[0];
    if (!s || !Array.isArray(s[1])) return null;
    // faces are the default way in: if the intended tetrahedron has three known faces, light those cards
    var refs = s[2] && typeof s[2] === 'object' ? Object.keys(s[2]).map(function (k) { return s[2][k]; }).filter(function (r) { return P.m && P.m.t[r]; }) : [];
    if (refs.length === 3 && (!P.picks.length || P.picks[0].kind === 'tri')) {
      var left = refs.filter(function (r) { return !P.picks.some(function (p) { return p.id === r; }); });
      return left.length ? 'tri:' + left[0] : null;
    }
    var steps = s[1];
    for (var i = 0; i < P.picks.length; i++) if (P.picks[i].id !== steps[i]) return null;
    return steps[P.picks.length] || null;
  }

  /* 3D view: HC.Tetra3D when the components file is there, else a flat labelled sketch */
  var t3d = null;
  function unmountTetra3D() { if (t3d && typeof t3d.destroy === 'function') { try { t3d.destroy(); } catch (e) {} } t3d = null; }
  function tetraModel(r, vl) {
    var m = P.m, ed = tetraEdges(r), sl = (r && r.slots) || {}, cl = r && r.claim, done = P.trip && P.trip.claimed;
    var faces = {};
    SLOTS.forEach(function (k) {
      var s = sl[k] || {}, st = 'unknown';
      if (k === done) st = 'new';
      else if (cl && cl.slot === k) st = cl.allowed === false ? 'locked' : 'missing';
      else if (s.chosen) st = (P.trip && P.trip.choice[k] != null) ? 'chosen' : 'known';
      faces[SLOT_FACE[k]] = st;
    });
    var edges = {};
    ['01', '12', '23', '02', '13', '03'].forEach(function (k) {
      var id = ed['e' + k];
      edges[k] = id ? stripTags(dispLabel(m, id)) : '?';
    });
    var kinds = {};
    ['01', '12', '23', '02', '13', '03'].forEach(function (k) { var id = ed['e' + k], e = id && m.e[id]; kinds[k] = id && isIdentityEdge(m, id) ? 'identity' : e ? edgeKindClass(e) : 'given'; });
    var labels = {};
    SLOTS.forEach(function (k) { var s = sl[k], f = s && factInfo(s.chosen); if (f) labels[SLOT_FACE[k]] = stripTags(triReadPlain(m, f.e01, f.e12, f.e02)); });
    return { corners: vl, edges: edges, faces: faces, kinds: kinds, labels: labels };
  }
  function sketchSVG(model) {
    var V = [{ x: 12, y: 86 }, { x: 58, y: 10 }, { x: 128, y: 70 }, { x: 70, y: 118 }];
    var order = [3, 1, 2, 0];
    var faceSlot = { 3: 'A', 0: 'B', 1: 'C', 2: 'D' };
    var faceCorners = { 3: [0, 1, 2], 0: [1, 2, 3], 1: [0, 2, 3], 2: [0, 1, 3] };
    var faces = order.map(function (f) {
      var ps = faceCorners[f].map(function (i) { return V[i]; });
      return '<path class="sk-face ' + (model.faces[f] || '') + '" data-face="' + faceSlot[f] + '" d="M' + ps.map(pt).join(' L') + ' Z"><title>face ' + f + '</title></path>';
    }).join('');
    var E = [['01', 0, 1], ['12', 1, 2], ['23', 2, 3], ['02', 0, 2], ['13', 1, 3], ['03', 0, 3]];
    var edges = E.map(function (e) {
      var A = V[e[1]], B = V[e[2]];
      var a = towards(A, B, 6), b = towards(B, A, 8);
      var mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
      var dx = B.x - A.x, dy = B.y - A.y, l = Math.sqrt(dx * dx + dy * dy) || 1, nx = -dy / l, ny = dx / l;
      var cx = 65, cy = 70; if ((mx - cx) * nx + (my - cy) * ny < 0) { nx = -nx; ny = -ny; }
      var lab = model.edges[e[0]] || '?';
      return '<path class="sk-edge' + (e[0] === '01' || e[0] === '12' || e[0] === '23' ? ' spine' : '') + '" marker-end="url(#sk-ah)" d="M' + pt(a) + ' L' + pt(b) + '"/>' +
        '<text class="sk-el' + (lab === '?' ? ' q' : '') + '" x="' + r1(mx + nx * 9) + '" y="' + r1(my + ny * 9 + 4) + '" text-anchor="middle">' + esc(lab) + '</text>';
    }).join('');
    var dots = V.map(function (p, i) {
      var off = [{ x: -9, y: 4 }, { x: 0, y: -6 }, { x: 9, y: 4 }, { x: 0, y: 14 }][i];
      return '<circle class="sk-v" cx="' + p.x + '" cy="' + p.y + '" r="4"/>' +
        '<text class="sk-l" x="' + (p.x + off.x) + '" y="' + (p.y + off.y) + '" text-anchor="middle">' + esc(model.corners[i] != null ? model.corners[i] : '?') + '<tspan class="sk-i" dy="3">' + i + '</tspan></text>';
    }).join('');
    var lock = '';
    Object.keys(model.faces).forEach(function (f) {
      if (model.faces[f] !== 'locked') return;
      var c = faceCorners[f].map(function (i) { return V[i]; });
      var cx = (c[0].x + c[1].x + c[2].x) / 3, cy = (c[0].y + c[1].y + c[2].y) / 3;
      lock = '<g class="sk-lock" transform="translate(' + r1(cx - 5) + ',' + r1(cy - 6) + ')"><rect x="0" y="5" width="10" height="8" rx="1.5"/><path d="M2 5 V3 a3 3 0 0 1 6 0 V5" fill="none"/></g>';
    });
    return '<svg class="trip-sketch" viewBox="-6 -8 152 140" role="img" aria-label="tetrahedron sketch"><defs><marker id="sk-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 z" class="sk-ahp"/></marker></defs>' +
      faces + edges + dots + lock + '</svg>';
  }
  function t3Model(model) {
    var pairs = { '01': [0, 1], '12': [1, 2], '23': [2, 3], '02': [0, 2], '13': [1, 3], '03': [0, 3] };
    return {
      corners: model.corners.map(function (c) { return { label: c == null ? '?' : c }; }),
      edges: Object.keys(pairs).map(function (k) { return { i: pairs[k][0], j: pairs[k][1], label: model.edges[k], kind: (model.kinds && model.kinds[k]) || 'given' }; }),
      faces: [0, 1, 2, 3].map(function (f) { var st = model.faces[f]; return { index: f, status: st === 'unknown' ? 'missing' : st || 'known', label: (model.labels && model.labels[f]) || '' }; })
    };
  }
  var FACE_TO_SLOT = { 3: 'A', 0: 'B', 1: 'C', 2: 'D' };
  function mountView(host, model) {
    if (HC.Tetra3D && typeof HC.Tetra3D.mount === 'function') {
      try {
        var tm = t3Model(model);
        if (t3d && t3d.host === host && host.isConnected) { t3d.update(tm); return true; }
        unmountTetra3D();
        // the panel is re-rendered on every choice: keep the 3D view (and its rotation) alive across renders
        var inst = HC.Tetra3D.mount(host, tm, { size: 260,
          onFaceClick: function (f) { var k = FACE_TO_SLOT[f]; if (k) tripCycle(k); },
          onFaceHover: function (f) { hoverFace(f == null ? null : FACE_TO_SLOT[f]); } });
        if (inst) { t3d = inst; t3d.host = host; return true; }
      } catch (e) { try { console.error(e); } catch (e2) {} }
    }
    host.innerHTML = sketchSVG(model);
    return false;
  }
  function hoverFace(k) {
    var r = P.trip && P.trip.res, f = k && r && r.slots && r.slots[k] && factInfo(r.slots[k].chosen);
    if (!f && k && r && r.claim && r.claim.slot === k) f = factInfo(r.claim.fact);
    P.hoverTri = f && P.m.t[f.ref] ? f.ref : null;
    P.previewEdges = f ? [f.e01, f.e12, f.e02] : null;
    applyHighlights();
  }

  function renderTrip() {
    var el = $('trip'); if (!el) return;
    // the board's unfold view follows the open tetrahedron (or goes back to per-triangle unfolding)
    var tkey = P.trip && P.trip.res && P.trip.res.ok !== false ? JSON.stringify([P.trip.res.vertices, P.trip.res.edges, P.trip.res.claim && P.trip.res.claim.slot]) : '';
    if (P.unfold && tkey !== P.unfoldTripKey && P.geo) { P.unfoldTripKey = tkey; P.ghostPos = {}; renderBoard(); applyHighlights(); }
    P.unfoldTripKey = tkey;
    if (!P.trip) { el.hidden = true; el.innerHTML = ''; return; }
    var m = P.m, r = P.trip.res || {};
    var steps = P.trip.steps || [];
    var vs = (r.vertices && r.vertices.length === 4) ? r.vertices : (steps.length === 3 && steps.every(Boolean) ? tripVerts(steps) : [null, null, null, null]);
    var vl = vs.map(function (v) { return v == null ? '?' : vLabel(m, v); });
    var head = '<div class="trip-head"><b>Tetrahedron</b> <span class="note">' + (P.trip.mode === 'faces' ? 'from three faces' : 'from a path') + '</span>' +
      ' <button type="button" class="linklike" data-act="tripclose">close <span class="kbd">Esc</span></button></div>';
    if (!r.ok) {
      unmountTetra3D();
      el.innerHTML = head + '<p class="trip-err">' + prose(r.reason || 'These don’t fit together.') + '</p>';
      el.hidden = false; return;
    }
    var sl = r.slots || {}, cl = r.claim, claimed = P.trip.claimed, intro = isIntro(P.level), ed = tetraEdges(r);
    function q(id) { return id ? eTeXp(m, id) : '?'; }
    var rows = SLOTS.map(function (k) {
      var s = sl[k] || {}, f = factInfo(s.chosen), cands = arr(s.cands).map(factInfo).filter(Boolean);
      var fe = FACE_EDGES[k], tmpl = q(ed[fe[0]]) + ' \\cdot ' + q(ed[fe[1]]) + ' \\simeq ' + (ed[fe[2]] ? eTeX(m, ed[fe[2]]) : '?');
      if (mathMode()) tmpl = 'd_2 = ' + q(ed[fe[0]]) + ',\\ d_0 = ' + q(ed[fe[1]]) + ',\\ d_1 = ' + (ed[fe[2]] ? eTeX(m, ed[fe[2]]) : '?');
      var corners = FACE_CORNERS[k].map(function (i) { return esc(vl[i]) + '<sub>' + i + '</sub>'; }).join(' ');
      var lab = '<span class="tcorn">' + corners + '</span>' + (mathMode() ? ' ' + math('d_' + SLOT_FACE[k]) : '');
      var val, cls = '';
      if (f) {
        var mine = P.trip.choice[k] != null, alts = [];
        if (!claimed) {
          var pool = !mine && P.trip.alt && P.trip.alt.slots && P.trip.alt.slots[k] ? arr(P.trip.alt.slots[k].cands) : arr(s.cands);
          alts = pool.map(factInfo).filter(function (c) { return c && c.ref !== f.ref && !(c.e01 === f.e01 && c.e12 === f.e12 && c.e02 === f.e02); });
        }
        cls = k === claimed ? ' new' : ' set';
        val = '<span class="tfact' + (k === claimed ? ' claimed' : '') + '">' + math(factTeX(f)) + '</span>' +
          (alts.length ? ' <span class="note">or</span> ' + alts.map(function (c) {
            return '<button type="button" class="mini chip-f alt" data-slot="' + k + '" data-ref="' + esc(c.ref) + '">' + math(factTeX(c)) + '</button>';
          }).join(' ') : '') +
          (!claimed && mine && P.trip.mode === 'path' ? ' <button type="button" class="linklike tx" data-clear="' + k + '">unset</button>' : '');
      } else if (cl && cl.slot === k) {
        var cf = factInfo(cl.fact) || cl.fact, allowed = cl.allowed !== false;
        cls = allowed ? ' want' : ' locked';
        val = '<span class="tmust">' + math(cf && cf.e01 ? factTeX(cf) : '?') + '</span> ' +
          '<button type="button" class="btn claim' + (allowed ? '' : ' locked') + (allowed && intro ? ' pulse' : '') + '" data-act="claim"' +
          (allowed ? '' : ' title="' + esc(stripTags(cl.reason || '')) + '"') + '>' +
          (allowed ? 'Fill <span class="kbd">Enter</span>' : LOCK_SVG + ' Locked') + '</button>';
      } else if (cands.length) {
        val = '<span class="ttmpl">' + math(tmpl) + '</span> ' + cands.map(function (c) {
          return '<button type="button" class="mini chip-f" data-slot="' + k + '" data-ref="' + esc(c.ref) + '">' + math(factTeX(c)) + '</button>';
        }).join(' ');
      } else {
        cls = ' unknown';
        val = '<span class="ttmpl unknown">' + math(tmpl) + '</span>';
      }
      return '<div class="tslot s' + k + cls + '" data-face="' + k + '"><span class="tlab">' + lab + '</span><span class="tval">' + val + '</span></div>';
    }).join('');
    var sentence = 'A solid tetrahedron’s four faces must agree. Three are known — the fourth is forced.';
    var horn = '';
    if (cl) {
      var kf = SLOT_FACE[cl.slot], inner = kf === 1 || kf === 2;
      horn = '<p class="trip-horn">missing face ' + kf + ' of 3 \u2192 horn ' + math('\\Lambda^3_' + kf) + ', ' + (inner ? 'inner' : 'outer') +
        (cl.allowed === false ? ' — ' + prose(cl.reason || 'outer horns need an isomorphism here') : '') + '</p>';
    } else if (r.known) horn = '<p class="trip-horn">All four faces are already known. Try another choice.</p>';
    else horn = '<p class="trip-horn note">Choose faces until three are known.</p>';
    var host = t3d && t3d.host && t3d.host.isConnected ? t3d.host : null;
    if (host) host.parentNode.removeChild(host);
    el.innerHTML = head + '<div class="trip-body"><div class="trip-view-slot"></div><div class="trip-slots">' + rows + '</div></div>' +
      '<p class="trip-rule">' + sentence + '</p>' + horn;
    el.hidden = false;
    var slot = el.querySelector('.trip-view-slot');
    if (!host) { host = document.createElement('div'); host.className = 'trip-view'; host.id = 'trip-view'; }
    slot.parentNode.replaceChild(host, slot);
    mountView(host, tetraModel(r, vl));
  }
  var LOCK_SVG = '<svg class="lock" viewBox="0 0 16 16" aria-hidden="true"><rect x="3.5" y="7" width="9" height="7" rx="1.2"/><path d="M5.5 7 V5 a2.5 2.5 0 0 1 5 0 V7" fill="none"/></svg>';

  /* ================= SPEC4 §2: you can touch the board ================= */

  /* --- isolate a fact (click its card with no fact-picking tool) --- */
  function toggleIsolate(id) {
    P.pinnedTri = (P.pinnedTri === id) ? null : id;
    applyHighlights();
  }

  /* --- select an arrow (no tool): provenance + rename --- */
  function selectEdge(id) {
    P.selEdge = (P.selEdge === id) ? null : id;
    renderToolHint(); applyHighlights();
  }
  function edgeInfoHTML(id) {
    var m = P.m, e = m.e[id];
    if (!e) return '';
    var o = originText(m, id);
    return math(edgeTeXFull(m, id)) + (o ? ' <span class="note">— ' + o + '</span>' : '') +
      (isIdentityEdge(m, id) ? ' <span class="note">— the identity (do-nothing) arrow at ' + math(labTeX(vLabel(m, e.src))) + '</span>' : '') +
      ' <button type="button" class="linklike" data-act="rename" data-eid="' + esc(id) + '">rename <span class="kbd">R</span></button>';
  }
  var renameBox = null;
  function startRename(id) {
    var m = P.m, e = m && m.e[id];
    if (!e || isIdentityEdge(m, id)) return;
    stopRename();
    var g = P.els.edge[id], tx = g && g.querySelector('.elabel');
    var wrap = $('board-wrap'), wr = wrap.getBoundingClientRect();
    var r = tx ? tx.getBoundingClientRect() : { left: wr.left + wr.width / 2 - 40, top: wr.top + 10, width: 80, height: 24 };
    var inp = document.createElement('input');
    inp.type = 'text'; inp.className = 'rename'; inp.value = rawLabel(m, id); inp.maxLength = 16;
    inp.setAttribute('aria-label', 'New name for this arrow');
    inp.style.left = Math.max(0, r.left - wr.left + r.width / 2 - 55) + 'px';
    inp.style.top = Math.max(0, r.top - wr.top + r.height / 2 - 16) + 'px';
    wrap.appendChild(inp);
    renameBox = { el: inp, id: id };
    inp.focus(); inp.select();
    inp.addEventListener('keydown', function (ev) {
      ev.stopPropagation();
      if (ev.key === 'Enter') { ev.preventDefault(); commitRename(); }
      else if (ev.key === 'Escape') { ev.preventDefault(); stopRename(); }
    });
    inp.addEventListener('blur', function () { setTimeout(commitRename, 0); });
  }
  function stopRename() { if (renameBox && renameBox.el.parentNode) renameBox.el.parentNode.removeChild(renameBox.el); renameBox = null; }
  function commitRename() {
    if (!renameBox) return;
    var id = renameBox.id, v = String(renameBox.el.value || '').trim().slice(0, 16);
    stopRename();
    var m = P.m, e = m.e[id];
    if (!e || !v || v === rawLabel(m, id)) return;
    if (engineHas('rename')) doMove(['rename', id, v], null, { free: true });
    else { e.label = v; e.renamed = true; renderAll(); toast('Renamed to ' + math(labTeX(v)), 'ok'); }
  }

  /* --- overlap chooser: a click that hits several things picks the top one, lists the rest --- */
  var lastHit = null, chooserTimer = null;
  function hitsAt(x, y) {
    var list = [], seen = {};
    var els = document.elementsFromPoint ? document.elementsFromPoint(x, y) : [];
    for (var i = 0; i < els.length; i++) {
      var el = els[i], g = el.closest && el.closest('[data-vid],[data-eid],[data-ghost]');
      if (!g || !$('board').contains(g)) continue;
      var it = g.hasAttribute('data-vid') ? { kind: 'vertex', id: g.getAttribute('data-vid') } :
        g.hasAttribute('data-eid') ? { kind: 'edge', id: g.getAttribute('data-eid') } : null;
      if (!it) continue;
      var k = it.kind + ':' + it.id;
      if (seen[k]) continue;
      seen[k] = 1; list.push(it);
    }
    // dots always win
    var dots = list.filter(function (h) { return h.kind === 'vertex'; });
    return dots.length ? dots.slice(0, 1) : list;
  }
  function itemLabel(it) {
    var m = P.m;
    if (it.kind === 'vertex') return math(labTeX(vLabel(m, it.id)));
    return math(eTeX(m, it.id));
  }
  function showChooser(list, cur, x, y) {
    var c = $('chooser'); if (!c) return;
    var wr = $('board-wrap').getBoundingClientRect();
    c.innerHTML = '<span class="note">here:</span> ' + list.map(function (it, i) {
      return '<button type="button" class="mini' + (i === cur ? ' on' : '') + '" data-ci="' + i + '">' + itemLabel(it) + '</button>';
    }).join(' ');
    c.style.left = Math.max(4, Math.min(wr.width - 180, x - wr.left + 10)) + 'px';
    c.style.top = Math.max(4, y - wr.top + 12) + 'px';
    c.hidden = false;
    clearTimeout(chooserTimer);
    chooserTimer = setTimeout(hideChooser, 4500);
  }
  function hideChooser() { var c = $('chooser'); if (c) c.hidden = true; }
  function samePick(a, b) { return a && b && a.kind === b.kind && a.id === b.id; }
  // replace the pick we just made with another item from the same spot
  function rePick(prev, next) {
    if (P.tool) {
      var last = P.picks[P.picks.length - 1];
      var lastIt = last && (last.stay ? { kind: 'vertex', id: last.v } : last);
      if (lastIt && samePick(lastIt, prev)) { P.picks.pop(); }
      else if (P.trip) closeTrip();
    }
    if (!P.tool && prev.kind === 'edge' && P.selEdge === prev.id) P.selEdge = null;
    handlePick({ kind: next.kind, id: next.id });
  }
  function boardClickAt(x, y) {
    var list = hitsAt(x, y);
    if (!list.length) return false;
    var now = Date.now();
    if (list.length > 1 && lastHit && Math.abs(lastHit.x - x) < 8 && Math.abs(lastHit.y - y) < 8 && now - lastHit.t < 2500 &&
        lastHit.keys === list.map(function (h) { return h.kind + h.id; }).join('|')) {
      var nextI = (lastHit.i + 1) % list.length;
      var prev = list[lastHit.i];
      lastHit = { x: x, y: y, t: now, i: nextI, keys: lastHit.keys, list: list };
      rePick(prev, list[nextI]);
      showChooser(list, nextI, x, y);
      return true;
    }
    lastHit = { x: x, y: y, t: now, i: 0, keys: list.map(function (h) { return h.kind + h.id; }).join('|'), list: list };
    handlePick({ kind: list[0].kind, id: list[0].id });
    if (list.length > 1) showChooser(list, 0, x, y); else hideChooser();
    return true;
  }

  /* --- number badges: every live target gets a digit; pressing it picks the target --- */
  function badgeTargets() {
    if (!P.tool || P.trip || P.choice || P.won && !P.picks.length) return [];
    var step = currentStep(); if (!step) return [];
    var live = liveSets(), out = [];
    function ok(kind, id, stay) {
      if (!live || live.quiet) return true;
      if (stay) return isLive(live, { stay: true, v: id, id: 'id:' + id });
      return !live[kind] || !!live[kind][id];
    }
    var T = TOOLS[P.tool];
    // numbers are stable while a tool is in use: every item the tool could ever take gets a fixed number,
    // and only the ones that fit right now are shown
    var all = T.picks.reduce(function (a, s) { return a.concat(s.accept); }, []);
    var full = [];
    if (all.indexOf('tri') >= 0) Object.keys(P.els.card).forEach(function (id) { full.push({ kind: 'tri', id: id }); });
    if (all.indexOf('edge') >= 0) Object.keys(P.els.edge).forEach(function (id) { if (!/^id:/.test(id)) full.push({ kind: 'edge', id: id }); });
    if (all.indexOf('vertex') >= 0 || P.tool === 'tetra') Object.keys(P.els.vert).forEach(function (id) { full.push({ kind: 'vertex', id: id }); });
    full.forEach(function (b, i) { b.n = i + 1; });
    full = full.filter(function (b) { return b.n <= 9; });
    full.forEach(function (b) {
      if (b.kind === 'tri') { if (step.accept.indexOf('tri') >= 0 && ok('tri', b.id)) out.push(b); }
      else if (b.kind === 'edge') { if (step.accept.indexOf('edge') >= 0 && ok('edge', b.id)) out.push(b); }
      // dots as identities only get a number in the tetrahedron's path mode (elsewhere it would just be noise)
      else if (step.accept.indexOf('vertex') >= 0 || (P.tool === 'tetra' && P.picks.length && step.accept.indexOf('edge') >= 0)) {
        if (ok('vertex', b.id, T.stay && step.accept.indexOf('vertex') < 0)) out.push(b);
      }
    });
    return out;
  }
  function setKbdMode(on) {
    document.body.classList.toggle('kbd-mode', !!on);
    if (on) toast('Press a number to pick. Click anywhere to hide numbers.', 'info');
  }
  document.addEventListener('pointerdown', function () { if (document.body.classList.contains('kbd-mode')) document.body.classList.remove('kbd-mode'); }, true);
  function drawBadges() {
    Array.prototype.forEach.call(document.querySelectorAll('.kbadge'), function (n) { n.parentNode.removeChild(n); });
    var gB = P.els.badges; if (gB) while (gB.firstChild) gB.removeChild(gB.firstChild);
    P.badges = badgeTargets();
    P.badges.forEach(function (b) {
      var n = String(b.n);
      if (b.kind === 'tri') {
        var c = P.els.card[b.id]; if (c) c.appendChild(hEl('span', { class: 'kbadge', 'aria-hidden': 'true' }, n));
        return;
      }
      if (!gB || !P.geo) return;
      var at = null;
      if (b.kind === 'edge' && P.geo.e[b.id]) { var L = P.geo.e[b.id].label; at = { x: L.x - L.hw - 14, y: L.y - L.hh }; }
      else if (b.kind === 'vertex' && P.geo.pos[b.id]) at = { x: P.geo.pos[b.id].x - VR - 8, y: P.geo.pos[b.id].y - VR - 8 };
      if (!at) return;
      var g = sEl('g', { class: 'kbadge-svg', transform: 'translate(' + pt(at) + ')' });
      g.appendChild(sEl('rect', { x: -11, y: -12, width: 22, height: 24, rx: 4 }));
      var tx = sEl('text', { 'text-anchor': 'middle', 'dominant-baseline': 'central', y: 1 }); tx.textContent = n;
      g.appendChild(tx); gB.appendChild(g);
    });
  }

  /* --- goal ghost: hover/tap a goal item to see the wanted triangle on the board --- */
  function drawGoalGhost() {
    var g = P.els.ghostGoal; if (!g) return;
    while (g.firstChild) g.removeChild(g.firstChild);
    var i = P.goalGhost; if (i == null || !P.level || !P.level.goal || !P.geo) return;
    var pats = arr(P.level.goal.triangles), pat = pats[i]; if (!pat) return;
    var m = P.m, b = (P.goalBind || {});
    function id(x) { return isVar(x) ? (b[x] || null) : x; }
    var e01 = id(pat[0]), e12 = id(pat[1]), e02 = id(pat[2]);
    function src(e) { if (!e) return null; if (isIdentityEdge(m, e)) return e.slice(3); var x = m.e[e]; return x ? x.src : null; }
    function dst(e) { if (!e) return null; if (isIdentityEdge(m, e)) return e.slice(3); var x = m.e[e]; return x ? x.dst : null; }
    var v0 = src(e01) || src(e02), v1 = dst(e01) || src(e12), v2 = dst(e12) || dst(e02);
    var P0 = v0 && P.geo.pos[v0], P1 = v1 && P.geo.pos[v1], P2 = v2 && P.geo.pos[v2];
    if (!P0 || !P1 || !P2) return;
    // a degenerate corner (identity) is pushed off a little so the triangle is visible
    function nudgeP(a, b2) { return (a.x === b2.x && a.y === b2.y) ? { x: a.x + 46, y: a.y - 46 } : a; }
    P1 = nudgeP(P1, P0); P2 = nudgeP(P2, P1);
    g.appendChild(sEl('path', { class: 'goal-ghost', d: 'M' + pt(P0) + ' L' + pt(P1) + ' L' + pt(P2) + ' Z' }));
    [[e01, P0, P1, pat[0]], [e12, P1, P2, pat[1]], [e02, P0, P2, pat[2]]].forEach(function (s) {
      if (s[0] && P.els.edge[s[0]]) { P.els.edge[s[0]].classList.add('hi'); return; }
      var mid = { x: (s[1].x + s[2].x) / 2, y: (s[1].y + s[2].y) / 2 };
      g.appendChild(sEl('path', { class: 'goal-ghost-edge', d: 'M' + pt(towards(s[1], s[2], VR + 4)) + ' L' + pt(towards(s[2], s[1], VR + 6)) }));
      var t = sEl('text', { x: r1(mid.x), y: r1(mid.y), class: 'goal-q', 'text-anchor': 'middle', 'dominant-baseline': 'central' });
      t.textContent = s[0] ? stripTags(dispLabel(m, s[0])) : '?';
      g.appendChild(t);
    });
  }

  /* --- unfold identities --------------------------------------------------------------
     A triangle like (x, 1_b, y) is degenerate: two of its corners are the same dot b, so on the
     board it lies flat (a thin lens between x and y). Unfold gives EACH such triangle its own copy
     of the repeated dot (b′, b″, …), joined to b by the identity arrow 1_b, so every triangle opens
     into a real face. Copies of the same dot fan out at different angles so faces never cover each
     other. Ghost keys are triangle ids. */
  function unfoldModel(vst, geo, m) {
    if (!P.unfold) return null;
    var ghosts = {}, tris = [];
    var cen = { x: 0, y: 0 }, n = 0;
    Object.keys(geo.pos).forEach(function (k) { cen.x += geo.pos[k].x; cen.y += geo.pos[k].y; n++; });
    if (n) { cen.x /= n; cen.y /= n; }
    // pass 1: which triangles unfold, and around which dot
    var plan = [], perDot = {};
    arr(vst.triangles).forEach(function (t, i) {
      var id01 = isIdentityEdge(m, t.e01), id12 = isIdentityEdge(m, t.e12);
      if (id01 === id12) return;                       // nothing degenerate, or fully degenerate
      var v, other, e;
      if (id12) { e = m.e[t.e01]; if (!e) return; v = t.e12.slice(3); other = e.src; }
      else { e = m.e[t.e12]; if (!e) return; v = t.e01.slice(3); other = e.dst; }
      if (!geo.pos[v] || !geo.pos[other]) return;
      perDot[v] = perDot[v] || [];
      plan.push({ t: t, i: i, v: v, other: other, j: perDot[v].length, right: !!id12 });
      perDot[v].push(t.id);
    });
    // pass 2: place one ghost per triangle, fanned around its dot
    function restFor(p, o, j, count) {
      var dx, dy, l;
      if (o.x !== p.x || o.y !== p.y) {
        var ax = p.x - o.x, ay = p.y - o.y, al = Math.sqrt(ax * ax + ay * ay) || 1;
        dx = -ay / al; dy = ax / al;
        var mx = (p.x + o.x) / 2, my = (p.y + o.y) / 2;
        if ((mx - cen.x) * dx + (my - cen.y) * dy < 0 && n > 2) { dx = -dx; dy = -dy; }
        if (n <= 2 && dy > 0) { dx = -dx; dy = -dy; }
        dx = dx * 0.85 + ax / al * 0.35; dy = dy * 0.85 + ay / al * 0.35;
      } else { dx = p.x - cen.x; dy = p.y - cen.y; if (Math.abs(dx) + Math.abs(dy) < 1) { dx = 0; dy = -1; } }
      l = Math.sqrt(dx * dx + dy * dy) || 1; dx /= l; dy /= l;
      var ang = (j - (count - 1) / 2) * 1.05;            // fan copies of one dot apart (~60° each)
      var c = Math.cos(ang), s = Math.sin(ang);
      var rx = dx * c - dy * s, ry = dx * s + dy * c;
      // far enough from the dot that the opened face is a real triangle, not a sliver
      var dist = Math.max(130, 0.5 * Math.sqrt((p.x - o.x) * (p.x - o.x) + (p.y - o.y) * (p.y - o.y)));
      return { x: p.x + rx * dist, y: p.y + ry * dist };
    }
    var PRIMES = ['′', '″', '‴'];
    // While the Tetrahedron panel is open on a solid with repeated corners (e.g. a, b, b, b),
    // unfold THAT solid: each repeat of a dot becomes its own copy, so the four faces are visible.
    var tr = P.trip && P.trip.res && P.trip.res.ok !== false ? P.trip.res : null;
    if (tr && arr(tr.vertices).length === 4 && tr.edges) {
      var vs = tr.vertices, seen = {}, corners = [], repeats = {};
      vs.forEach(function (v) { repeats[v] = (repeats[v] || 0) + 1; });
      if (Object.keys(repeats).length < 4 && vs.every(function (v) { return geo.pos[v]; })) {
        var other0 = vs.filter(function (v) { return repeats[v] === 1; })[0] || vs[0];
        vs.forEach(function (v, i) {
          if (!(v in seen)) { seen[v] = 0; corners.push({ v: v, p: geo.pos[v] }); return; }
          var j = seen[v]++, key = 'T' + i;
          var o = geo.pos[other0 === v ? vs.filter(function (w) { return w !== v; })[0] || v : other0];
          var rest = restFor(geo.pos[v], o, j, repeats[v] - 1);
          var drag = P.ghostPos && P.ghostPos[key];
          ghosts[key] = { key: key, v: v, rest: rest, at: drag && drag.x != null ? { x: drag.x, y: drag.y } : rest, mark: PRIMES[j] || '′' };
          corners.push({ v: v, p: ghosts[key].at, ghost: key });
        });
        var status = {}, sl = tr.slots || {};
        SLOTS.forEach(function (k) { status[k] = sl[k] && sl[k].chosen ? 'known' : (tr.claim && tr.claim.slot === k ? 'claim' : 'open'); });
        return { ghosts: ghosts, tris: [], tetra: { corners: corners, edges: tr.edges, status: status } };
      }
    }
    plan.forEach(function (u) {
      var p = geo.pos[u.v], o = geo.pos[u.other];
      var key = u.t.id, rest = restFor(p, o, u.j, perDot[u.v].length);
      var drag = P.ghostPos && P.ghostPos[key];
      var gh = ghosts[key] = { key: key, v: u.v, rest: rest, at: drag && drag.x != null ? { x: drag.x, y: drag.y } : rest,
        mark: PRIMES[u.j] || ('′' + (u.j + 1)) };
      if (u.right) tris.push({ t: u.t, i: u.i, key: key, pts: [o, p, gh.at], copy: { id: u.t.e02, from: o, to: gh.at }, idArrow: { v: u.v, from: p, to: gh.at } });
      else tris.push({ t: u.t, i: u.i, key: key, pts: [p, gh.at, o], copy: { id: u.t.e12, from: gh.at, to: o }, idArrow: { v: u.v, from: p, to: gh.at } });
    });
    return { ghosts: ghosts, tris: tris };
  }
  var SLOT_CORNERS = { A: [0, 1, 2], B: [1, 2, 3], C: [0, 2, 3], D: [0, 1, 3] };
  function drawUnfoldTetra(T, gF, gE, m) {
    var c = T.corners;
    SLOTS.forEach(function (k, n) {
      var ps = SLOT_CORNERS[k].map(function (i) { return c[i].p; });
      var st = T.status[k];
      gF.appendChild(sEl('path', { class: st === 'known' ? 'tri unf tc' + (n % 4) : 'unf-open' + (st === 'claim' ? ' unf-claim' : ''), d: 'M' + ps.map(pt).join(' L') + ' Z' }));
    });
    ['01', '02', '03', '12', '13', '23'].forEach(function (ij) {
      var a = c[+ij[0]].p, b = c[+ij[1]].p, id = T.edges['e' + ij]; if (!a || !b) return;
      var idEdge = !!id && isIdentityEdge(m, id);
      var p0 = towards(a, b, VR + 3), p1 = towards(b, a, VR + 4);
      var grp = sEl('g', { class: 'unf-edge' + (idEdge ? ' unf-id' : '') + (id ? '' : ' unf-unknown') });
      grp.appendChild(sEl('path', { d: 'M' + pt(p0) + ' L' + pt(p1), class: 'line', 'marker-end': 'url(#ah-' + (idEdge ? 'identity' : 'given') + ')' }));
      var mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, dx = b.x - a.x, dy = b.y - a.y, l = Math.sqrt(dx * dx + dy * dy) || 1;
      var tx = sEl('text', { x: r1(mid.x - dy / l * 20), y: r1(mid.y + dx / l * 20), class: 'elabel', 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': Math.round(LABEL_FONT * 0.85) });
      if (id) fillLabel(tx, idEdge ? '1_' + vLabel(m, c[+ij[0]].v) : dispLabel(m, id)); else tx.textContent = '?';
      grp.appendChild(tx); gE.appendChild(grp);
    });
  }
  function drawUnfold(model, gF, gE, gV, m) {
    if (!model) return;
    if (model.tetra) drawUnfoldTetra(model.tetra, gF, gE, m);
    model.tris.forEach(function (u) {
      if (u.pts.some(function (p) { return !p; })) return;
      gF.appendChild(sEl('path', { class: 'tri unf tc' + (u.i % 4), d: 'M' + u.pts.map(pt).join(' L') + ' Z', 'data-tid': u.t.id }));
    });
    model.tris.forEach(function (u) {
      [u.idArrow, u.copy].forEach(function (a, j) {
        if (!a.from || !a.to) return;
        var p0 = towards(a.from, a.to, VR + 3), p1 = towards(a.to, a.from, VR + 4);
        var grp = sEl('g', { class: 'unf-edge' + (j === 0 ? ' unf-id' : ''), 'data-unf': u.key });
        grp.appendChild(sEl('path', { d: 'M' + pt(p0) + ' L' + pt(p1), class: 'line', 'marker-end': 'url(#ah-' + (j === 0 ? 'identity' : 'given') + ')' }));
        var mid = { x: (a.from.x + a.to.x) / 2, y: (a.from.y + a.to.y) / 2 };
        var dx = a.to.x - a.from.x, dy = a.to.y - a.from.y, l = Math.sqrt(dx * dx + dy * dy) || 1;
        var tx = sEl('text', { x: r1(mid.x - dy / l * 22), y: r1(mid.y + dx / l * 22), class: 'elabel', 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': Math.round(LABEL_FONT * 0.85) });
        fillLabel(tx, j === 0 ? '1_' + vLabel(m, u.idArrow.v) : dispLabel(m, u.copy.id));
        grp.appendChild(tx);
        gE.appendChild(grp);
      });
    });
    Object.keys(model.ghosts).forEach(function (key) {
      var gh = model.ghosts[key], v = gh.v;
      var grp = sEl('g', { class: 'vert ghostv', 'data-ghost': key, transform: 'translate(' + pt(gh.at) + ')' });
      var tt = sEl('title', {}); tt.textContent = 'A copy of ' + vLabel(m, v) + ', joined to it by its identity arrow. Drag it to open the triangle; it springs back.';
      grp.appendChild(tt);
      var body = sEl('g', { class: 'vbody' });
      body.appendChild(sEl('circle', { r: VR + 22, class: 'vhit' }));
      body.appendChild(sEl('circle', { r: VR, class: 'vdot' }));
      var tx = sEl('text', { class: 'vlabel', 'text-anchor': 'middle', 'dominant-baseline': 'central', y: 1 });
      tx.textContent = vLabel(m, v) + gh.mark;
      body.appendChild(tx);
      grp.appendChild(body);
      gV.appendChild(grp);
    });
  }
  // let go of a ghost dot: it springs back to its rest place
  function springBack(v) {
    var gp = P.ghostPos && P.ghostPos[v];
    if (!gp) return;
    if (reduceMotion) { delete P.ghostPos[v]; renderBoard(); applyHighlights(); return; }
    var start = { x: gp.x, y: gp.y }, t0 = null;
    var rest = gp.rest;
    if (!rest) { delete P.ghostPos[v]; renderBoard(); applyHighlights(); return; }
    function frame(ts) {
      if (!P.ghostPos || P.ghostPos[v] !== gp) return;
      if (t0 == null) t0 = ts;
      var t = (ts - t0) / 1000;
      var k = Math.exp(-6 * t) * Math.cos(14 * t);            // damped spring
      gp.x = rest.x + (start.x - rest.x) * k; gp.y = rest.y + (start.y - rest.y) * k;
      if (t > 0.9) { delete P.ghostPos[v]; renderBoard(); applyHighlights(); return; }
      renderBoard(); applyHighlights();
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    // if frames are throttled (background tab), still end up back at rest
    setTimeout(function () { if (P.ghostPos && P.ghostPos[v] === gp) { delete P.ghostPos[v]; renderBoard(); applyHighlights(); } }, 1200);
  }

  /* --- drag dots (and ghost dots); a move of more than 4px is a drag, never a pick --- */
  var drag = null, suppressClick = false;
  function levelPos() {
    var k = lkey(P.level);
    if (!progress.pos) progress.pos = {};
    return progress.pos[k] || (progress.pos[k] = {});
  }
  function onBoardPointerDown(e) {
    if (e.button != null && e.button !== 0) return;
    var t = e.target, vg = t.closest && t.closest('[data-vid],[data-ghost]');
    var eg = t.closest && t.closest('[data-eid]');
    if (eg && !vg) {
      // long-press on an arrow renames it
      var id = eg.getAttribute('data-eid');
      clearTimeout(P.lpTimer);
      P.lp = { x: e.clientX, y: e.clientY, id: id };
      P.lpTimer = setTimeout(function () { if (P.lp && P.lp.id === id) { suppressClick = true; startRename(id); } }, 650);
      return;
    }
    if (!vg) return;
    var ghost = vg.getAttribute('data-ghost');
    drag = { vid: ghost || vg.getAttribute('data-vid'), ghost: !!ghost, x: e.clientX, y: e.clientY, moved: false, id: e.pointerId };
  }
  function onBoardPointerMove(e) {
    if (P.lp && (Math.abs(e.clientX - P.lp.x) > 6 || Math.abs(e.clientY - P.lp.y) > 6)) { clearTimeout(P.lpTimer); P.lp = null; }
    if (!drag || drag.id !== e.pointerId) return;
    if (!drag.moved && Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) <= 4) return;
    if (!drag.moved) {
      drag.moved = true;
      try { $('board').setPointerCapture(e.pointerId); } catch (er) {}
      P.vbFrozen = P.geo ? P.geo.vb.slice() : null;
      $('board').classList.add('dragging');
      hideChooser();
    }
    e.preventDefault();
    var q = svgPoint($('board'), e); if (!q) return;
    if (drag.ghost) {
      if (!P.ghostPos) P.ghostPos = {};
      var model = P.unfoldModel && P.unfoldModel.ghosts[drag.vid];
      var gp = P.ghostPos[drag.vid] || (P.ghostPos[drag.vid] = { rest: model ? model.rest : null });
      gp.x = q.x; gp.y = q.y;
    } else {
      var lp = levelPos(), B = P.dragBounds;
      if (B) { q = { x: Math.max(B.x0, Math.min(B.x1, q.x)), y: Math.max(B.y0, Math.min(B.y1, q.y)) }; }
      lp[drag.vid] = { x: Math.max(-20, Math.min(120, q.x / S)), y: Math.max(-20, Math.min(80, q.y / S)) };
    }
    renderBoard(); applyHighlights();
  }
  function onBoardPointerUp(e) {
    clearTimeout(P.lpTimer); P.lp = null;
    if (!drag || drag.id !== e.pointerId) { drag = null; return; }
    var d = drag; drag = null;
    if (!d.moved) return;
    suppressClick = true;
    setTimeout(function () { suppressClick = false; }, 0);
    try { $('board').releasePointerCapture(e.pointerId); } catch (er) {}
    $('board').classList.remove('dragging');
    P.vbFrozen = null;
    if (d.ghost) springBack(d.vid);
    else { saveProgress(); renderBoard(); applyHighlights(); }
  }
  function tidy() {
    if (!P.level) return;
    if (progress.pos) delete progress.pos[lkey(P.level)];
    saveProgress(); P.ghostPos = {};
    renderBoard(); applyHighlights();
  }

  /* --- show bar: layers, unfold, 3D, tidy --- */
  var LAYERS = [['v', 'dots'], ['e', 'arrows'], ['t', 'triangles'], ['s', 'solids']];
  function renderShowBar() {
    var bar = $('showbar'); if (!bar || !P.level) return;
    var hasSolid = arr(P.state && P.state.tetras).length > 0;
    var html = '<span class="note">show</span> ' + LAYERS.map(function (l) {
      return '<button type="button" class="seg" data-layer="' + l[0] + '" aria-pressed="' + (P.layers[l[0]] !== false) + '">' + l[1] + '</button>';
    }).join('') +
      ' <button type="button" class="seg" data-act="unfold" aria-pressed="' + !!P.unfold + '" title="Open up flat triangles that use an identity arrow (U)">unfold <span class="kbd">U</span></button>' +
      (hasSolid ? ' <button type="button" class="seg" data-act="view3d" title="Look at a solid in 3D">3D</button>' : '') +
      ' <button type="button" class="seg" data-act="tidy" title="Put the dots back where they started">tidy</button>';
    if (P.unfold && P.unfoldModel && P.unfoldModel.tetra) {
      var tc = P.unfoldModel.tetra.corners.map(function (c) { return vLabel(P.m, c.v) + (c.ghost ? P.unfoldModel.ghosts[c.ghost].mark : ''); });
      html += '<p class="unf-note">This tetrahedron has corners ' + math(tc.map(function (s) { return s.replace(/′/g, "'").replace(/″/g, "''"); }).join(', ')) +
        ': some dots repeat, so it lies flat on the board. Unfolded, each repeat gets its own copy, joined by identity arrows. Shaded faces are the ones you know; the outlined face is the one Fill will add.</p>';
    } else if (P.unfold) {
      var nDeg = P.unfoldModel ? P.unfoldModel.tris.length : 0;
      html += '<p class="unf-note">' + (nDeg
        ? 'A triangle like ' + math('x\\simeq y') + ' really has corners ' + math('a, b, b') + ': its middle side is the identity ' + math('1_b') +
          ', so it lies flat. Unfold draws each one with its own copy ' + math("b'") + ' of the repeated dot, so you can see the face. ' +
          'Drag a copy to stretch the face (a homotopy is this sheet between ' + math('x') + ' and ' + math('y') + '); it springs back. Nothing changes in the puzzle.'
        : 'Nothing to unfold yet: no triangle here uses an identity arrow. Unfold opens up triangles like ' + math('x\\simeq y') + ', whose middle side is an identity.') + '</p>';
    }
    if (bar._html === html) return;                  // renderBoard runs every drag frame; don't rebuild the bar each time
    bar._html = html;
    bar.innerHTML = html;
  }

  /* --- 3D view of a solid on the board --- */
  var view3d = { i: 0 };
  function open3D(i) {
    var tets = arr(P.state && P.state.tetras); if (!tets.length) return;
    view3d.i = ((i || 0) % tets.length + tets.length) % tets.length;
    var T = tets[view3d.i], m = P.m;
    var vs = arr(T.vertices).length === 4 ? T.vertices : uniq(tetraVerts(T, m)).concat([null, null, null, null]).slice(0, 4);
    var edges = {};
    var te = T.edges || {};
    ['01', '12', '23', '02', '13', '03'].forEach(function (k) { var id = te[k] || te['e' + k]; edges[k] = id ? stripTags(dispLabel(m, id)) : '?'; });
    var faces = {}; [0, 1, 2, 3].forEach(function (f) { faces[f] = f === T.missing ? 'new' : 'known'; });
    var model = { corners: vs.map(function (v) { return v == null ? '?' : vLabel(m, v); }), edges: edges, faces: faces };
    var box = $('t3d');
    box.querySelector('.t3d-title').innerHTML = 'Solid ' + (view3d.i + 1) + ' of ' + tets.length + (T.missing != null ? ' <span class="note">— filled face ' + T.missing + ' (' + math('\\Lambda^3_' + T.missing) + ')</span>' : '');
    box.querySelector('[data-act="t3d-prev"]').hidden = box.querySelector('[data-act="t3d-next"]').hidden = tets.length < 2;
    box.hidden = false;
    var host = box.querySelector('.t3d-view');
    if (!mountSolid(host, model)) host.innerHTML = sketchSVG(model);
  }
  var solidInst = null;
  function mountSolid(host, model) {
    if (!HC.Tetra3D) return false;
    try {
      if (solidInst && typeof solidInst.destroy === 'function') solidInst.destroy();
      solidInst = null; host.innerHTML = '';
      solidInst = typeof HC.Tetra3D.mount === 'function' ? HC.Tetra3D.mount(host, t3Model(model), { size: 320 }) : null;
      return !!solidInst;
    } catch (e) { return false; }
  }
  function close3D() { $('t3d').hidden = true; if (solidInst && typeof solidInst.destroy === 'function') { try { solidInst.destroy(); } catch (e) {} } solidInst = null; }

  /* --- keyboard help overlay --- */
  function openHelp() {
    var rows = [
      ['C', 'Compose'], ['T', 'Tetrahedron'], ['L / R', 'Solve for the second / first arrow'], ['1–4', 'Your theorems (when no tool is picking)'],
      ['G', 'Glue triangle'], ['D', 'Draw arrow'], ['P', 'Peel'], ['A', 'Add dot'],
      ['1–9', 'With a tool active: the first press shows numbers on the targets, the next picks one'], ['Enter', 'Fill / claim / next level'], ['Esc', 'Clear picks / close'],
      ['Z or Ctrl+Z', 'Undo'], ['Backspace', 'Remove the last pick'], ['H', 'Hint'], ['U', 'Unfold identities'],
      ['R', 'Rename the selected arrow'], ['?', 'This help']
    ];
    $('help-list').innerHTML = rows.map(function (r) { return '<dt><span class="kbd">' + esc(r[0]) + '</span></dt><dd>' + esc(r[1]) + '</dd>'; }).join('') +
      '<dt>mouse</dt><dd>Drag dots to move them. Double-click (or long-press) an arrow’s name to rename it. Hover a goal to see it on the board.</dd>';
    $('help').hidden = false;
    try { $('help-close').focus(); } catch (e) {}
  }

  /* --- "This can't be done": a real decision with reasons --- */
  function reasonText(id) {
    var R = HC.Reasons || {}, r = R[id];
    if (r && typeof r === 'object') return r.label || r.text || r.title || id;
    if (typeof r === 'string') return r;
    return { hole: 'Horn filling never fills a hole.', backwards: 'Inner moves never make an arrow point back.',
      unrelated: 'Nothing links arrows that share no triangle.', nocancel: 'You can’t cancel without an inverse.',
      onesided: 'A one-sided inverse isn’t an isomorphism.', shadow: 'The filler upstairs is already decided, over the wrong thing.' }[id] || id;
  }
  function shuffledReasons(lv) {
    var rs = arr(lv.reasons).slice();
    var seed = 0; String(lkey(lv)).split('').forEach(function (ch) { seed = (seed * 31 + ch.charCodeAt(0)) >>> 0; });
    for (var i = rs.length - 1; i > 0; i--) { seed = (seed * 1103515245 + 12345) >>> 0; var j = seed % (i + 1); var t = rs[i]; rs[i] = rs[j]; rs[j] = t; }
    return rs;
  }
  /* --- counterexamples: prove "it can't be done" by placing the starting picture in a small test world --- */
  var CE = null;
  function usesModels(lv) { return !!(lv && lv.claimable && !lv.base && !(lv.reasons && lv.reasons.length) && engineHas('checkModel') && arr(HC.Models).length); }
  function ceModel() { return CE && CE.model ? arr(HC.Models).filter(function (m) { return m.id === CE.model; })[0] : null; }
  function ceAutofill() {
    var lv = P.level;
    arr(lv.edges).forEach(function (ed) {
      if (ed.kind === 'identity') return;
      var a = CE.v[ed.src], b = CE.v[ed.dst];
      if (a == null || b == null) { delete CE.e[ed.id]; return; }
      var opts = HC.Engine.modelArrowsBetween(CE.model, a, b);
      if (opts.length === 1) CE.e[ed.id] = opts[0].id;
      else if (!opts.some(function (o) { return o.id === CE.e[ed.id]; })) delete CE.e[ed.id];
    });
  }
  function openCounter() {
    if (!CE || CE.level !== P.level) CE = { level: P.level, model: null, v: {}, e: {}, msg: null };
    renderCounter();
    try { $('why').scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' }); } catch (e) {}
  }
  function renderCounter() {
    var box = $('why'), lv = P.level, M = ceModel(), vl = {};
    arr(lv.vertices).forEach(function (v) { vl[v.id] = v.label || v.id; });
    var html = '<p class="why-h"><b>Prove it can’t be done.</b> <button type="button" class="linklike" data-act="why-close">cancel</button></p>' +
      '<p class="ce-note">Pick a small test world and place the <i>starting</i> picture in it so every given fact is true there. If the goal is false in that world, no sequence of moves can ever reach it: every move you can make also works in the test world.</p>' +
      '<div class="ce-models">' + arr(HC.Models).map(function (m) {
        return '<button type="button" class="ce-model' + (CE.model === m.id ? ' on' : '') + '" data-model="' + esc(m.id) + '"><span class="ce-pic" data-pic="' + esc(m.id) + '"></span><span class="ce-name">' + esc(m.name) + '</span></button>';
      }).join('') + '</div>';
    if (M) {
      if (M.note) html += '<p class="ce-note">In this world: ' + esc(M.note) + '</p>';
      html += '<div class="ce-place"><div><p class="ce-h">Dots</p>' + arr(lv.vertices).map(function (v) {
        return '<label class="ce-row">' + math(labTeX(vl[v.id])) + ' <span class="note">goes to</span> <select data-cev="' + esc(v.id) + '"><option value="">?</option>' +
          M.objects.map(function (o) { return '<option value="' + esc(o) + '"' + (CE.v[v.id] === o ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('') + '</select></label>';
      }).join('') + '</div><div><p class="ce-h">Arrows</p>' + arr(lv.edges).filter(function (ed) { return ed.kind !== 'identity'; }).map(function (ed) {
        var a = CE.v[ed.src], b = CE.v[ed.dst], opts = (a != null && b != null) ? HC.Engine.modelArrowsBetween(CE.model, a, b) : null;
        var body;
        if (!opts) body = '<span class="note">place its dots first</span>';
        else if (!opts.length) body = '<span class="ce-bad">nothing goes from ' + esc(a) + ' to ' + esc(b) + '</span>';
        else body = '<select data-cee="' + esc(ed.id) + '">' + (opts.length > 1 ? '<option value="">?</option>' : '') + opts.map(function (o) {
          return '<option value="' + esc(o.id) + '"' + (CE.e[ed.id] === o.id ? ' selected' : '') + '>' + esc(o.label.replace(/^1_/, 'identity at ')) + '</option>'; }).join('') + '</select>';
        return '<div class="ce-row">' + math(labTeX(ed.label) + ' : ' + labTeX(vl[ed.src]) + ' \\to ' + labTeX(vl[ed.dst])) + ' <span class="note">goes to</span> ' + body + '</div>';
      }).join('') + '</div></div>' +
      '<p><button type="button" class="btn primary" data-act="ce-check">Check this world</button> ' + (CE.msg ? '<span class="ce-msg">' + esc(CE.msg) + '</span>' : '') + '</p>';
    }
    box.innerHTML = html; box.hidden = false;
    Array.prototype.forEach.call(box.querySelectorAll('[data-pic]'), function (n) {
      var m = arr(HC.Models).filter(function (x) { return x.id === n.getAttribute('data-pic'); })[0];
      try { if (m && m.diagram && HC.NotesView && HC.NotesView.renderDiagram) n.appendChild(HC.NotesView.renderDiagram(m.diagram)); } catch (e) {}
    });
    Array.prototype.forEach.call(box.querySelectorAll('[data-model]'), function (b) {
      b.addEventListener('click', function () { CE.model = b.getAttribute('data-model'); CE.v = {}; CE.e = {}; CE.msg = null; renderCounter(); });
    });
    Array.prototype.forEach.call(box.querySelectorAll('[data-cev]'), function (sel) {
      sel.addEventListener('change', function () { var k = sel.getAttribute('data-cev'); if (sel.value === '') delete CE.v[k]; else CE.v[k] = sel.value; CE.msg = null; ceAutofill(); renderCounter(); });
    });
    Array.prototype.forEach.call(box.querySelectorAll('[data-cee]'), function (sel) {
      sel.addEventListener('change', function () { var k = sel.getAttribute('data-cee'); if (sel.value === '') delete CE.e[k]; else CE.e[k] = sel.value; CE.msg = null; renderCounter(); });
    });
    var ck = box.querySelector('[data-act="ce-check"]');
    if (ck) ck.addEventListener('click', ceCheck);
  }
  function ceCheck() {
    if (!CE || !CE.model) return;
    var arg = { model: CE.model, paint: { vertices: Object.assign({}, CE.v), edges: Object.assign({}, CE.e) } };
    var res = HC.Engine.checkModel(P.level, arg.model, arg.paint);
    if (!res.ok) { CE.msg = res.reason; renderCounter(); return; }
    closeWhy(); CE = null;
    doMove(['claimImpossible', arg]);
  }
  function openWhy() {
    var lv = P.level; if (!lv) return;
    if (usesModels(lv)) { openCounter(); return; }
    var rs = shuffledReasons(lv);
    if (!rs.length) { claim(); return; }
    var box = $('why');
    box.innerHTML = '<p class="why-h"><b>Why can’t it be done?</b> <span class="note">a wrong reason costs a move</span>' +
      ' <button type="button" class="linklike" data-act="why-close">cancel</button></p>' +
      rs.map(function (id, i) { return '<button type="button" class="btn why-r" data-reason="' + esc(id) + '"><span class="kbd">' + (i + 1) + '</span> ' + prose(reasonText(id)) + '</button>'; }).join('');
    box.hidden = false;
    try { box.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' }); } catch (e) {}
  }
  function closeWhy() { var b = $('why'); if (b) { b.hidden = true; b.innerHTML = ''; } }
  function claimWith(reasonId) {
    closeWhy();
    if (!engineHas('claimImpossible')) { toast('Not available yet.', 'info'); return; }
    doMove(['claimImpossible', reasonId]);
  }

  /* ================= SPEC4 §6: learning between puzzles ================= */
  function notes() { return arr(HC.Notes); }
  function noteBefore(levelName) { return notes().filter(function (n) { return n && n.before === levelName; })[0] || null; }
  function noteById(id) { return notes().filter(function (n) { return n && n.id === id; })[0] || null; }
  function briefingFor(wid) {
    var w = null; arr(HC.Worlds).forEach(function (x) { if (x && x.id == wid) w = x; });
    var b = (w && (w.briefing || w.brief)) || (HC.Briefings && (HC.Briefings[wid] || (Array.isArray(HC.Briefings) ? HC.Briefings.filter(function (x) { return x && x.world == wid; })[0] : null)));
    if (!b) return null;
    if (typeof b === 'string') return { now: b };
    return { title: b.title || (w && w.title), soFar: b.soFar || b.so_far || b.sofar, now: b.now,
      new: b['new'] || b.newWords || b.terms, note: b.note, about: b.about || b.idea, picture: b.picture };
  }
  function briefingHTML(wid, closable) {
    var b = briefingFor(wid); if (!b) return '';
    var first = notes().filter(function (n) { var L = levels().filter(function (l) { return l.name === n.before; })[0]; return L && L.world == wid; })[0];
    var noteId = b.note || (first && first.id);
    var nw = Array.isArray(b['new']) ? b['new'].join(', ') : b['new'];
    var rows = '';
    if (b.soFar) rows += '<dt>So far</dt><dd>' + prose(b.soFar) + '</dd>';
    if (b.now) rows += '<dt>Now</dt><dd>' + prose(b.now) + '</dd>';
    if (nw) rows += '<dt>New</dt><dd>' + prose(nw) + '</dd>';
    var pic = b.picture && b.picture.dots ? '<figure class="brief-fig">' + drawSpecSVG(b.picture) +
      (b.picture.caption ? '<figcaption>' + prose(b.picture.caption) + '</figcaption>' : '') + '</figure>' : '';
    return '<div class="brief-body">' +
      '<div class="brief-head"><h3 class="brief-t">' + prose(b.title || worldInfo(wid).title) + '</h3>' +
      (closable ? '<button type="button" class="ghost brief-x" data-act="brief-ok" title="Hide this: you can open it again from the level list" aria-label="Hide the briefing">✕</button>' : '') +
      '</div>' +
      (rows ? '<dl class="brief-rows">' + rows + '</dl>' : '') +
      pic +
      (b.about ? '<p class="brief-about">' + prose(b.about) + '</p>' : '') +
      '<p class="brief-act">' + (noteId && noteById(noteId) ? '<button type="button" class="linklike" data-note="' + esc(noteId) + '">Read the note: ' + prose(noteById(noteId).title || '') + '</button>' : '') + '</p>' +
      '</div>';
  }

  function drawSpecSVG(spec) {
    var dots = arr(spec.dots), byId = {};
    dots.forEach(function (d) { byId[d.id] = d; });
    var xs = dots.map(function (d) { return +d.x || 0; }), ys = dots.map(function (d) { return +d.y || 0; });
    var minx = Math.min.apply(null, xs.concat([0])), maxx = Math.max.apply(null, xs.concat([10])), miny = Math.min.apply(null, ys.concat([0])), maxy = Math.max.apply(null, ys.concat([10]));
    var sc = 300 / Math.max(10, maxx - minx, (maxy - miny) * 1.6);
    function P2(d) { return { x: ((+d.x || 0) - minx) * sc + 30, y: ((+d.y || 0) - miny) * sc + 30 }; }
    var W = (maxx - minx) * sc + 60, H = (maxy - miny) * sc + 60;
    var out = '<svg class="spec" viewBox="0 0 ' + r1(W) + ' ' + r1(H) + '" role="img"><defs><marker id="spec-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,1 L9,5 L0,9 z"/></marker></defs>';
    arr(spec.fills).forEach(function (f, i) { var ps = f.map(function (id) { return byId[id] && P2(byId[id]); }); if (ps.every(Boolean)) out += '<path class="sp-fill tc' + (i % 4) + '" d="M' + ps.map(pt).join(' L') + ' Z"/>'; });
    arr(spec.ghost).forEach(function (f) { var ps = f.map(function (id) { return byId[id] && P2(byId[id]); }); if (ps.every(Boolean)) out += '<path class="sp-ghost" d="M' + ps.map(pt).join(' L') + ' Z"/>'; });
    arr(spec.arrows).forEach(function (a) {
      var A = byId[a.from] && P2(byId[a.from]), B = byId[a.to] && P2(byId[a.to]); if (!A || !B) return;
      var p0 = towards(A, B, 9), p1 = towards(B, A, 11), mid = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
      var dx = B.x - A.x, dy = B.y - A.y, l = Math.sqrt(dx * dx + dy * dy) || 1;
      out += '<path class="sp-arrow' + (a.dashed ? ' dashed' : '') + '" marker-end="url(#spec-ah)" d="M' + pt(p0) + ' L' + pt(p1) + '"/>';
      if (a.label) out += '<text class="sp-l" x="' + r1(mid.x - dy / l * 12) + '" y="' + r1(mid.y + dx / l * 12 + 4) + '" text-anchor="middle">' + esc(stripTags(a.label)) + '</text>';
    });
    dots.forEach(function (d) { var p = P2(d); out += '<circle class="sp-dot" cx="' + r1(p.x) + '" cy="' + r1(p.y) + '" r="7"/>' + (d.label ? '<text class="sp-dl" x="' + r1(p.x) + '" y="' + r1(p.y - 12) + '" text-anchor="middle">' + esc(stripTags(d.label)) + '</text>' : ''); });
    return out + '</svg>';
  }
  function renderNote(id) {
    var n = noteById(id), box = $('note');
    if (!n) { box.innerHTML = '<p class="empty">That note is not available yet.</p>'; return; }
    progress.notesRead = progress.notesRead || {}; progress.notesRead[id] = true; saveProgress();
    destroyDemos();
    box.innerHTML = '<h1>' + prose(n.title || 'Note') + '</h1><div class="note-body"></div>';
    var body = box.querySelector('.note-body');
    arr(n.body).forEach(function (b) {
      if (!b) return;
      if (typeof b === 'string') { body.appendChild(hEl('p', null, prose(b))); return; }
      if (b.p != null) { body.appendChild(hEl('p', null, prose(b.p))); return; }
      if (b.h != null) { body.appendChild(hEl('h3', null, prose(b.h))); return; }
      var fig = hEl('figure', { class: 'note-fig' });
      body.appendChild(fig);
      var NV = HC.NotesView;
      try {
        if (b.diagram) {
          if (NV && typeof NV.renderDiagram === 'function') { var r = NV.renderDiagram(b.diagram); if (typeof r === 'string') fig.innerHTML = r; else if (r && r.nodeType) fig.appendChild(r); }
          else fig.innerHTML = drawSpecSVG(b.diagram);
          if (b.caption || b.diagram.caption) fig.appendChild(hEl('figcaption', null, prose(b.caption || b.diagram.caption)));
        } else if (b.demo) {
          if (NV && typeof NV.mountDemo === 'function') { var d2 = NV.mountDemo(fig, b.demo); if (d2) noteDemos.push(d2); }
          else fig.innerHTML = '<p class="empty">(An interactive demo goes here once notesview.js is loaded.)</p>';
        }
      } catch (e) { try { console.error(e); } catch (e2) {} fig.innerHTML = '<p class="empty">(This picture could not be drawn.)</p>'; }
    });
    var L = levels(), li = -1; L.forEach(function (l, i) { if (l.name === n.before) li = i; });
    var foot = hEl('p', { class: 'note-foot' });
    foot.innerHTML = (li >= 0 && isUnlocked(li) ? '<button type="button" class="btn primary" data-play="' + li + '">Play: ' + prose(titleFor(L[li])) + '</button> ' : '') +
      '<button type="button" class="linklike" data-act="note-back">Back</button>';
    box.appendChild(foot);
  }
  var noteReturn = null, noteDemos = [];
  function destroyDemos() { noteDemos.forEach(function (d) { try { if (d && d.destroy) d.destroy(); } catch (e) {} }); noteDemos = []; }
  function showNote(id, ret) {
    noteReturn = ret || null;
    P.noteId = id;
    showScreen('note');
    renderNote(id);
    try { history.replaceState(null, '', '#note-' + encodeURIComponent(id)); } catch (e) {}
  }

  /* glossary: terms unlock as worlds are reached; essential ones announce themselves */
  function glossaryEntries() { return arr(HC.Glossary).filter(Boolean); }
  function maxWorldReached() {
    var mw = 1;
    levels().forEach(function (lv) { if (progress.solved[lkey(lv)]) mw = Math.max(mw, (lv.world || 1) + 1); });
    if (P.level && P.level.world) mw = Math.max(mw, P.level.world);
    return progress.unlockAll ? 99 : mw;
  }
  function termUnlocked(g) {
    if (progress.unlockAll) return true;
    if (g.level) return !!progress.solved[g.level];
    if (g.world != null) return g.world <= maxWorldReached();
    var t = stripTags(g.term || '').replace(/\$/g, '').toLowerCase();
    return unlockedTerms().some(function (u) { return u === t || u.indexOf(t) >= 0 || t.indexOf(u) >= 0; });
  }
  function announceNewWords() {
    progress.wordsSeen = progress.wordsSeen || {};
    var fresh = glossaryEntries().filter(function (g) { var k = stripTags(g.term || ''); return g.essential && termUnlocked(g) && !progress.wordsSeen[k]; });
    glossaryEntries().forEach(function (g) { if (termUnlocked(g)) progress.wordsSeen[stripTags(g.term || '')] = true; });
    saveProgress();
    if (!fresh.length) return;
    var g = fresh[0];
    setTimeout(function () {
      toast('<button type="button" class="linklike toast-link" data-term="' + esc(stripTags(g.term || '')) + '">New word: ' + prose(g.term) + '</button>' + (fresh.length > 1 ? ' <span class="muted">+' + (fresh.length - 1) + ' more</span>' : ''), 'info', 4200);
    }, 900);
  }
  function openGlossaryAt(term) {
    resetGlossary(); renderGlossary(); openModal('glossary');
    var el = term && document.querySelector('#glossary [data-term="' + CSS.escape(term) + '"]');
    if (el) { el.classList.add('flash'); try { el.scrollIntoView({ block: 'center' }); } catch (e) {} }
    else try { $('glossary-close').focus(); } catch (e) {}
  }

  /* ---------- facts ---------- */
  function renderFacts() {
    var box = $('facts'), st = P.state, m = P.m;
    box.innerHTML = '';
    P.els.card = {};
    var tris = P.skel >= 2 ? arr(st.triangles).filter(shownFact) : [];
    // solids only matter where the level is about shapes (or in math mode)
    var tets = P.skel >= 3 && (mathMode() || hasSkeleton(P.level) || (P.level.goal && (P.level.goal.min || P.level.goal.counts))) ? arr(st.tetras) : [];
    $('facts-count').textContent = tris.length ? String(tris.length) : '';
    if (!tris.length && !tets.length) { box.innerHTML = '<p class="empty">' + (P.skel < 2 && arr(st.triangles).length ? 'Hidden by the view.' : 'None yet.') + '</p>'; return; }
    tris.forEach(function (t, i) {
      var kind = KIND_NAMES[t.kind] || t.kind || '';
      var hom = isIdentityEdge(m, t.e12);
      var c = hEl('button', { type: 'button', class: 'fact tc' + (i % 4) + (hom ? ' homotopy' : '') + (P.fresh.triangles[t.id] && !reduceMotion ? ' fresh' : ''), 'data-tid': t.id, 'aria-pressed': 'false', title: triReadPlain(m, t.e01, t.e12, t.e02) + '. Click to isolate it on the board.' },
        '<span class="swatch" aria-hidden="true"></span>' + miniTri(m, t, i) + '<span class="ftext">' + math(triTeX(m, t)) + '</span><span class="fkind k-' + esc(t.kind || '') + '">' + esc(kind) + '</span><span class="pnum" aria-hidden="true"></span>');
      box.appendChild(c); P.els.card[t.id] = c;
    });
    tets.forEach(function (T) {
      var vs = uniq(tetraVerts(T, m)).map(function (v) { return vLabel(m, v); });
      box.appendChild(hEl('div', { class: 'fact solid' + (P.fresh.tetras[T.id] && !reduceMotion ? ' fresh' : '') },
        '<span class="swatch" aria-hidden="true"></span><span class="ftext">solid ' + math(vs.map(labTeX).join('\\,')) + '</span><span class="fkind">tetrahedron</span>'));
    });
  }

  function miniTri(m, t, i) {
    var A = { x: 6, y: 33 }, B = { x: 28, y: 6 }, C = { x: 50, y: 33 };
    function lab(id) { var s = stripTags(dispLabel(m, id)); return s.length > 5 ? s.slice(0, 4) + '\u2026' : s; }
    function ln(p, q, id, ox, oy, anchor) {
      var a = towards(p, q, 4), b = towards(q, p, 6), mx = (p.x + q.x) / 2 + ox, my = (p.y + q.y) / 2 + oy;
      return '<path class="mt-e' + (isIdentityEdge(m, id) ? ' id' : '') + '" d="M' + pt(a) + ' L' + pt(b) + '" marker-end="url(#mt-ah)"/>' +
        '<text class="mt-l" x="' + r1(mx) + '" y="' + r1(my) + '" text-anchor="' + anchor + '">' + esc(lab(id)) + '</text>';
    }
    return '<svg class="mini-tri" viewBox="-14 -4 84 50" aria-hidden="true"><path class="mt-fill tc' + (i % 4) + '" d="M' + [A, B, C].map(pt).join(' L') + ' Z"/>' +
      ln(A, B, t.e01, -4, -2, 'end') + ln(B, C, t.e12, 4, -2, 'start') + ln(A, C, t.e02, 0, 11, 'middle') +
      [A, B, C].map(function (p) { return '<circle class="mt-v" cx="' + p.x + '" cy="' + p.y + '" r="2.6"/>'; }).join('') + '</svg>';
  }

  /* ---------- goal checklist ---------- */
  var TICK = '<svg viewBox="0 0 16 16"><path d="M3 8.5 L6.5 12 L13 4" fill="none"/></svg>';
  function renderGoals() {
    var ul = $('goals'); ul.innerHTML = '';
    if (isSandbox(P.level)) { ul.innerHTML = '<li class="free">none: free play</li>'; P.goalPrev = []; return; }
    var parts = goalParts();
    parts.forEach(function (p, i) {
      var just = p.done && !P.goalPrev[i];
      ul.appendChild(hEl('li', { class: (p.done ? 'ok' : '') + (p.struck ? ' struck' : '') + (just && !reduceMotion ? ' just' : '') + (p.kind === 'triangle' ? ' ghostable' : '') + (P.goalGhost === p.ti && p.kind === 'triangle' ? ' showing' : ''), 'data-goal': p.kind === 'triangle' ? String(p.ti) : null, tabindex: p.kind === 'triangle' ? '0' : null },
        '<span class="box" aria-hidden="true">' + (p.done ? TICK : '') + '</span><span class="pat">' + p.html + '</span><span class="sr-only">' + (p.done ? ' (done)' : ' (to do)') + '</span>'));
    });
    P.goalPrev = parts.map(function (p) { return p.done; });
    Array.prototype.forEach.call(ul.querySelectorAll('li'), function (li) { if (li.getAttribute('data-goal') == null || li.getAttribute('data-goal') === 'null') { li.removeAttribute('data-goal'); li.removeAttribute('tabindex'); } });
  }

  /* ---------- rulebook (strict levels) ---------- */
  function currentBlanks() {
    var out = {}, lv = P.level, st = P.state;
    if (!lv) return out;
    arr(lv.blanks).forEach(function (pr) {
      var t = arr(st.triangles).filter(function (t) { return t.e01 === pr[0] && t.e12 === pr[1]; })[0];
      if (t) out[pr[0] + ',' + pr[1]] = t.e02;
    });
    return out;
  }
  function ruleTeX(m, f, g, h) {
    var rhs = h ? eTeX(m, h) : '\\,?\\,';
    return mathMode() ? eTeXp(m, g) + ' \\circ ' + eTeXp(m, f) + ' = ' + rhs : eTeXp(m, f) + ' \\cdot ' + eTeXp(m, g) + ' = ' + rhs;
  }
  function renderRulebook() {
    var ul = $('rulebook'), lv = P.level;
    if (!lv || !(lv.strict || lv.table)) { ul.innerHTML = ''; return; }
    var m = P.m, rows = [];
    var tab = lv.table || {};
    Object.keys(tab).forEach(function (k) {
      var ab = k.split(',');
      rows.push('<li>' + math(ruleTeX(m, ab[0], ab[1], tab[k])) + '</li>');
    });
    var now = currentBlanks();
    arr(lv.blanks).forEach(function (pr) {
      var k = pr[0] + ',' + pr[1], r = now[k];
      var just = r && !P.blanksPrev[k] && !reduceMotion;
      rows.push('<li class="blank' + (r ? ' filled' : '') + (just ? ' just' : '') + '">' +
        math(ruleTeX(m, pr[0], pr[1], r)) + '</li>');
    });
    P.blanksPrev = now;
    ul.innerHTML = rows.join('') || '<li class="empty">empty</li>';
  }

  /* ---------- hints ---------- */
  function renderHints() {
    var hints = arr(textFor(P.level).hints), ol = $('hints'), btn = $('btn-hint');
    ol.innerHTML = '';
    for (var i = 0; i < Math.min(P.hintsShown, hints.length); i++) ol.appendChild(hEl('li', null, prose(hints[i])));
    btn.hidden = !hints.length;
    btn.disabled = P.hintsShown >= hints.length;
    btn.textContent = P.hintsShown ? 'Hint ' + Math.min(P.hintsShown + 1, hints.length) + '/' + hints.length : 'Hint';
  }

  /* ---------- tetrahedron pop (never blocks: pointer-events none, short) ---------- */
  var tetraTimer = null;
  function showTetra(tri, T) {
    var box = $('tetrapop'); if (!box || !tri) return;
    var A = { x: 100, y: 14 }, B = { x: 22, y: 112 }, C = { x: 178, y: 106 }, D = { x: 96, y: 150 };
    function poly(ps, cls, delay) { return '<path class="' + cls + '" style="--d:' + delay + 's" d="M' + ps.map(pt).join(' L') + ' Z"/>'; }
    var svg = '<svg viewBox="0 0 200 165" aria-hidden="true">' +
      poly([A, B, C], 'tp-face lit back', 0) + poly([B, C, D], 'tp-face lit', 0.08) + poly([A, B, D], 'tp-face lit', 0.16) +
      poly([A, C, D], 'tp-face newf', 0.3) +
      '<g class="tp-edges"><path d="M' + [A, B, C, A, D, B].map(pt).join(' L') + ' M' + pt(C) + ' L' + pt(D) + '"/></g>' +
      [A, B, C, D].map(function (p) { return '<circle class="tp-v" cx="' + p.x + '" cy="' + p.y + '" r="5"/>'; }).join('') + '</svg>';
    var head = mathMode() && T && T.missing != null ? '<div class="tp-head">filled ' + math('\\Lambda^3_{' + T.missing + '}') + '</div>' : '';
    box.innerHTML = '<div class="tp-card">' + head + svg + '<div class="tp-cap">' + math(triTeX(P.m, tri)) + '</div></div>';
    box.hidden = false;
    box.classList.remove('show', 'out'); void box.offsetWidth; box.classList.add('show');
    clearTimeout(tetraTimer);
    tetraTimer = setTimeout(function () { box.classList.add('out'); tetraTimer = setTimeout(hideTetra, 300); }, reduceMotion ? 1400 : 1500);
  }
  function hideTetra() { var b = $('tetrapop'); if (b) { b.hidden = true; b.classList.remove('show', 'out'); } clearTimeout(tetraTimer); }

  /* ---------- win panel (small, above the board, never covers it) ---------- */
  function showWin() {
    var lv = P.level, T = textFor(lv), key = lkey(lv);
    var wins = bulletsOf(T.win);
    var hasNext = P.idx + 1 < levels().length;
    var par = lv.par, atPar = par != null && P.moves <= par;
    var html = '<p class="win-h"><b>Solved.</b>' + (par != null ? ' <span class="note">' + plural(P.moves, 'move', 'moves') + (atPar ? ', at par <span class="star">★</span>' : ', par is ' + par) + '</span>' : '') + '</p>';
    if (wins.length) html += '<p class="win-p">' + wins.map(function (w) { return prose(w); }).join(' ') + '</p>';
    var unl = arr(lv.unlocks).length ? lv.unlocks : (lv.unlocks ? [lv.unlocks] : []);
    unl.forEach(function (t) {
      var nm = THEOREM_NAMES[t] || (TOOLS[t] && TOOLS[t].label) || t;
      html += '<p class="unlock">' + (ICONS[t] || '') + '<span><b>New tool: ' + esc(nm) + '.</b> You proved it; now it’s one click.</span></p>';
    });
    if (mathMode() && T.math && T.math.proof) html += '<div class="proof"><span class="note">proof.</span> ' + prose(T.math.proof) + ' <span class="qed">∎</span></div>';
    if (T.term) html += '<p class="term"><span class="note">new word:</span> ' + prose(T.term) + '</p>';
    html += '<p class="win-act"><button type="button" class="btn primary" id="win-next">' + (hasNext ? 'Next' : 'Levels') + ' <span class="kbd">Enter</span></button>';
    if (key === 'joyal' && HC.Epilogue) html += ' <button type="button" class="btn" id="win-ending">Read the ending</button>';
    var nextLv = levels()[P.idx + 1], nn = nextLv && noteBefore(nextLv.name);
    if (nn) html += ' <button type="button" class="linklike" data-note="' + esc(nn.id) + '">\uD83D\uDCD6 Read the note on ' + prose(nn.title || 'what comes next') + '</button>';
    html += '</p>';
    var box = $('winbox');
    box.innerHTML = html;
    box.hidden = false;
    box.classList.remove('in'); void box.offsetWidth; box.classList.add('in');
    try { if (box.scrollIntoView) box.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' }); } catch (e) {}
  }
  function hideWin() { var b = $('winbox'); if (b) { b.hidden = true; b.innerHTML = ''; } }
  function winShown() { var b = $('winbox'); return !!b && !b.hidden; }
  function nextLevel() {
    if (P.idx + 1 < levels().length) {
      var i = P.idx + 1;
      if (!isUnlocked(i)) { showScreen('map'); return; }
      startLevel(i);
    } else showScreen('map');
  }

  /* ---------- glossary ---------- */
  // the drawer is a reference, not a scroll: search it, or filter it by the world a word belongs to
  var GL = { q: '', world: null };
  function unlockedTerms() {
    var out = [];
    levels().forEach(function (lv) { if (progress.solved[lkey(lv)]) { var t = textFor(lv).term; if (t) out.push(stripTags(String(t)).replace(/\$/g, '').toLowerCase()); } });
    return out;
  }
  function glossaryWorlds() {
    var seen = [], out = [];
    glossaryEntries().forEach(function (g) {
      var w = g.world == null ? null : g.world;
      if (seen.indexOf(String(w)) < 0) { seen.push(String(w)); out.push(w); }
    });
    return out.sort(function (a, b) { return (a == null ? 99 : a) - (b == null ? 99 : b); });
  }
  function glossaryHit(g, q) {
    if (!q) return true;
    var hay = [g.term, g.plain, g.formal, g.eg, arr(g.see).join(' ')].map(function (x) { return stripTags(String(x || '')); }).join(' ');
    hay = hay.replace(/\$/g, '').toLowerCase();
    return q.split(/\s+/).every(function (w) { return hay.indexOf(w) >= 0; });
  }
  function normTerm(s) {
    return stripTags(String(s || '')).replace(/\$[^$]*\$/g, ' ').replace(/[^A-Za-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
  }
  // a term is "met" in the level that introduces it (its text has a `term` of the same name)
  function glossaryLevel(g) {
    var want = normTerm(String(g.term || '').split(' (')[0]);
    if (!want) return -1;
    var hit = -1;
    levels().forEach(function (lv, i) {
      if (hit >= 0) return;
      var t = normTerm(textFor(lv).term);
      if (!t) return;
      if (t === want || t.indexOf(want) === 0) hit = i;
    });
    return hit;
  }
  function resetGlossary() {
    GL.q = ''; GL.world = null;
    var s = $('glossary-search'); if (s) s.value = '';
  }
  function renderGlossary() {
    var list = $('glossary-list'), ALL = glossaryEntries();
    // group by world, keeping the order terms are met in; the data may be appended out of order
    var G = ALL.map(function (g, i) { return { g: g, i: i }; }).sort(function (a, b) {
      return ((a.g.world == null ? 99 : a.g.world) - (b.g.world == null ? 99 : b.g.world)) || (a.i - b.i);
    }).map(function (o) { return o.g; });
    if (!list) return;
    var q = (GL.q || '').trim().toLowerCase();
    var open = G.filter(termUnlocked).length;
    var idx = $('glossary-index');
    if (idx) {
      idx.innerHTML = '<button type="button" class="gl-chip" data-world="" aria-pressed="' + (GL.world == null) + '">All</button>' +
        glossaryWorlds().map(function (w) {
          return '<button type="button" class="gl-chip" data-world="' + (w == null ? 'none' : w) + '" aria-pressed="' + (GL.world === w) + '"' +
            (w == null ? '' : ' title="' + esc(worldInfo(w).title) + '"') + '>' + (w == null ? 'more' : esc(w)) + '</button>';
        }).join('');
    }
    var shown = G.filter(function (g) {
      var w = g.world == null ? null : g.world;
      return (GL.world == null || w === GL.world) && glossaryHit(g, q);
    }).length;
    list.innerHTML = '';
    if (!G.length) { list.innerHTML = '<p class="empty">Not available.</p>'; return; }
    if (!shown) {
      list.innerHTML = '<p class="gl-empty">No term matches “' + esc(GL.q) + '”. ' +
        '<button type="button" class="linklike" data-act="gl-clear">Clear the filters</button></p>';
    }
    var sub = $('glossary-sub');
    if (sub) sub.textContent = (q || GL.world != null)
      ? 'showing ' + shown + ' of ' + G.length + ' terms · ' + open + ' unlocked'
      : open + ' of ' + G.length + ' terms unlocked by solving levels';
    var lastW = '~none~', grid = null;
    G.forEach(function (g) {
      var w = g.world == null ? null : g.world;
      if (GL.world != null && w !== GL.world) return;
      if (q && !glossaryHit(g, q)) return;
      if (String(w) !== String(lastW) || !grid) {
        lastW = w;
        var sec = hEl('section', { class: 'gl-sec' });
        sec.appendChild(hEl('h3', { class: 'gl-world' }, (w == null ? 'More' : esc(w) + '. ' + prose(worldInfo(w).title)) +
          ' <span class="gl-n">' + G.filter(function (x) { return (x.world == null ? null : x.world) === w; }).length + '</span>'));
        grid = hEl('div', { class: 'gl-grid' });
        sec.appendChild(grid); list.appendChild(sec);
      }
      var unlocked = termUnlocked(g);
      var card = hEl('article', { class: 'gl-card' + (g.essential ? ' essential' : '') + (unlocked ? '' : ' locked'), 'data-term': stripTags(g.term || '') });
      var body;
      if (!unlocked && !q) {
        // still readable on a fresh save: the plain sentence, plus where the term turns up
        body = (g.plain ? '<p class="gl-plain gl-plain-locked">' + prose(g.plain) + '</p>' : '') +
          '<p class="gl-lock">You meet this one in ' + (w == null ? 'a later world' : 'world ' + esc(w)) + '.</p>';
      } else {
        var main = mathMode()
          ? (g.formal ? '<p class="gl-formal first">' + prose(g.formal) + '</p>' : '') + (g.plain ? '<p class="gl-plain">' + prose(g.plain) + '</p>' : '')
          : (g.plain ? '<p class="gl-plain">' + prose(g.plain) + '</p>' : '') + (g.formal ? '<p class="gl-formal">' + prose(g.formal) + '</p>' : '');
        var eg = g.eg ? '<p class="gl-eg"><span class="gl-lbl">e.g.</span> ' + prose(g.eg) + '</p>' : '';
        var li = glossaryLevel(g);
        var met = (li >= 0 && isUnlocked(li)) ? '<p class="gl-met"><span class="gl-lbl">met in</span> ' +
          '<button type="button" class="linklike" data-level="' + li + '">' + prose(titleFor(levels()[li])) + '</button></p>' : '';
        var see = arr(g.see).length ? '<p class="gl-see"><span class="gl-lbl">see</span> ' +
          arr(g.see).map(function (s) { return '<button type="button" class="gl-ref" data-ref="' + esc(s) + '">' + esc(s) + '</button>'; }).join(' ') + '</p>' : '';
        body = main + eg + met + see;
      }
      card.innerHTML = '<h4 class="gl-term">' + prose(g.term || '?') + (unlocked ? '' : ' <span class="gl-tag">locked</span>') + '</h4>' + body;
      grid.appendChild(card);
    });
  }

  /* ---------- level map ---------- */
  var ICON_TICK = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5 L6.5 12 L13 4" fill="none"/></svg>';
  function renderMap() {
    var root = $('worlds'), L = levels();
    root.innerHTML = '';
    var solvedN = L.filter(function (lv) { return progress.solved[lkey(lv)]; }).length;
    $('progress-text').textContent = L.length ? solvedN + ' of ' + L.length + ' solved' : '';
    if (!L.length) { root.innerHTML = '<p class="empty">No levels found. Is levels.js next to this page?</p>'; return; }
    var byW = {}, wids = [];
    L.forEach(function (lv, i) { var w = lv.world || 1; if (!byW[w]) { byW[w] = []; wids.push(w); } byW[w].push(i); });
    wids.sort(function (a, b) { return a - b; });
    var current = -1;
    for (var i = 0; i < L.length; i++) if (isUnlocked(i) && !progress.solved[lkey(L[i])]) { current = i; break; }
    // one obvious thing to click: the next level. The list below is for choosing something else.
    var sh = $('starthere');
    if (sh) {
      if (current >= 0) {
        var clv = L[current], cw = clv.world || 1, started = Object.keys(progress.solved).length > 0;
        sh.innerHTML = '<button type="button" class="sh-card" data-level="' + current + '">' +
          '<span class="sh-k">' + (started ? 'Next up' : 'Start here') + '</span>' +
          '<span class="sh-t">' + prose(titleFor(clv)) + '</span>' +
          '<span class="sh-w">world ' + esc(cw) + ' · ' + prose(worldInfo(cw).title) +
          (clv.par != null && !(clv.parHidden || clv.claimable) ? ' · par ' + esc(clv.par) : '') + '</span>' +
          '<span class="sh-go" aria-hidden="true">→</span>' +
          '</button>' + (started ? '' : '<p class="sh-hint">New here? Click the card to start, and the arrows on the board will show you what to do. Every other level is in the list below.</p>');
        sh.hidden = false;
      } else { sh.hidden = true; sh.innerHTML = ''; }
    }
    wids.forEach(function (w) {
      var info = worldInfo(w), idxs = byW[w];
      var done = idxs.filter(function (i) { return progress.solved[lkey(L[i])]; }).length;
      var sec = hEl('section', { class: 'world' },
        '<h3><span class="wnum">' + esc(w) + '.</span> ' + prose(info.title) + ' <span class="wcount">' + done + '/' + idxs.length + '</span></h3>' +
        (worldNeeds(w).length ? '<p class="needs' + (worldOpen(w) ? '' : ' shut') + '">' + (worldOpen(w) ? 'after ' : 'opens after you finish ') + worldNeeds(w).map(function (n) { return prose(worldInfo(n).title); }).join(' and ') + '</p>' : '') +
        
        (briefingFor(w) ? '<details class="brief-map"><summary>briefing</summary>' + briefingHTML(w, false) + '</details>' : ''));
      var ol = hEl('ol', { class: 'path', start: String(idxs[0] + 1) });
      idxs.forEach(function (i) {
        var lv = L[i], key = lkey(lv), solved = !!progress.solved[key], open = isUnlocked(i);
        var star = solved && lv.par != null && progress.best[key] != null && progress.best[key] <= lv.par;
        var li = hEl('li', { value: String(i + 1), class: (solved ? 'solved' : '') + (open ? '' : ' locked') + (i === current ? ' current' : '') });
        var nb = noteBefore(lv.name);
        if (nb) { var nli = hEl('li', { class: 'noteli' }, '<button type="button" class="node notenode" data-note="' + esc(nb.id) + '">\uD83D\uDCD6 ' + prose(nb.title || 'Note') + '</button>' + (progress.notesRead && progress.notesRead[nb.id] ? ' <span class="note">read</span>' : '')); ol.appendChild(nli); }
        var boss = lv.kind === 'boss';
        if (boss) li.className += ' boss';
        li.innerHTML = '<button type="button" class="node" data-level="' + i + '"' + (open ? '' : ' aria-disabled="true"') + '>' + prose(titleFor(lv)) + '</button>' +
          (boss ? ' <span class="bossmark" title="boss level">boss</span>' : '') +
          (solved ? ' <span class="mark" title="solved">' + ICON_TICK + '</span>' : '') +
          (star ? '<span class="star" title="solved at par">★</span>' : '') +
          (i === current ? ' <span class="here">← next</span>' : '');
        ol.appendChild(li);
      });
      sec.appendChild(ol);
      root.appendChild(sec);
    });
    $('ending-link').hidden = !endingUnlocked();
    var ub = $('btn-unlock');
    if (ub) ub.textContent = progress.unlockAll ? 'Re-lock levels' : 'Unlock all levels';
  }

  function renderEnding() {
    var E = HC.Epilogue || {};
    $('ending').innerHTML = '<h1>' + prose(E.title || 'The end') + '</h1>' + '<div class="ending-body">' + prose(E.html || '<p>Thanks for playing.</p>') + '</div>';
  }

  /* ---------- screens, toast, theme ---------- */
  function showScreen(name) {
    ['map', 'play', 'ending', 'note'].forEach(function (s) { var el = $('screen-' + s); if (el) el.hidden = name !== s; });
    if (name !== 'play') { closeTrip(); close3D(); closeWhy(); stopRename(); }
    document.body.setAttribute('data-screen', name);
    if (name !== 'play') { P.level = null; hideTetra(); hideWin(); }
    if (name === 'map') { renderMap(); try { if (location.hash) history.replaceState(null, '', location.pathname + location.search); } catch (e) {} }
    if (name === 'ending') { renderEnding(); try { history.replaceState(null, '', '#ending'); } catch (e) {} }
    try { window.scrollTo(0, 0); } catch (e) {}
  }
  function openModal(id) { $(id).hidden = false; }
  function closeModal(id) { $(id).hidden = true; }

  var toastTimer = null;
  function toast(html, kind, ms) {
    var t = $('toast');
    t.className = 'toast show ' + (kind || 'info');
    t.innerHTML = html;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.className = 'toast ' + (kind || 'info'); }, ms || (kind === 'warn' ? 3200 : 2200));
  }

  function applyTheme() {
    var root = document.documentElement;
    if (progress.theme === 'light' || progress.theme === 'dark') root.setAttribute('data-theme', progress.theme);
    else root.removeAttribute('data-theme');
  }
  function cycleTheme() {
    var dark = false;
    try { dark = window.matchMedia('(prefers-color-scheme: dark)').matches; } catch (e) {}
    var cur = progress.theme || (dark ? 'dark' : 'light');
    progress.theme = cur === 'dark' ? 'light' : 'dark';
    saveProgress(); applyTheme();
  }
  function applyMode() {
    var b = $('btn-mode');
    if (b) { b.setAttribute('aria-pressed', String(mathMode())); b.innerHTML = mathMode() ? '<b>math</b> / plain' : 'math / <b>plain</b>'; }
    document.body.classList.toggle('mode-math', mathMode());
  }
  function toggleMode() {
    progress.mode = mathMode() ? 'plain' : 'math';
    saveProgress(); applyMode(); rerenderMath();
    if (!$('glossary').hidden) renderGlossary();
  }

  /* ---------- events ---------- */
  function svgPoint(svg, evt) {
    try {
      var p = svg.createSVGPoint(); p.x = evt.clientX; p.y = evt.clientY;
      var q = p.matrixTransform(svg.getScreenCTM().inverse());
      return { x: q.x, y: q.y };
    } catch (e) { return null; }
  }
  function onBoardActivate(evt) {
    if (evt.type === 'click' && suppressClick) { suppressClick = false; return; }
    var t = evt.target;
    if (t.closest && t.closest('[data-ghost]')) return;
    if (evt.type === 'click' && evt.clientX != null && (evt.clientX || evt.clientY)) {
      if (boardClickAt(evt.clientX, evt.clientY)) return;
    } else {
      var eg = t.closest && t.closest('[data-eid]'), vg = t.closest && t.closest('[data-vid]');
      if (vg) { handlePick({ kind: 'vertex', id: vg.getAttribute('data-vid') }); return; }
      if (eg) { handlePick({ kind: 'edge', id: eg.getAttribute('data-eid') }); return; }
    }
    if (evt.type !== 'click') return;
    hideChooser();
    var q = svgPoint($('board'), evt);
    if (!q) return;
    if (P.tool === 'addVertex') pickPoint(q.x / S, q.y / S);
    else if (P.pinnedTri || P.selEdge) { P.pinnedTri = null; P.selEdge = null; renderToolHint(); applyHighlights(); }
  }
  function pickPoint(x, y) {
    x = Math.max(0, Math.min(100, Math.round(x))); y = Math.max(0, Math.min(60, Math.round(y)));
    handlePick({ kind: 'point', x: x, y: y });
  }
  function claim(reasonId) {
    if (!P.level) return;
    if (!engineHas('claimImpossible')) { toast('Not available yet.', 'info'); return; }
    if (!reasonId && arr(P.level.reasons).length) { openWhy(); return; }
    var r = reasonId ? doMove(['claimImpossible', reasonId]) : doMove(['claimImpossible']);
    if (r && r.needsReason) openWhy();
  }
  function playing() { return P.level && !$('screen-play').hidden; }
  function anyOverlay() { return !$('glossary').hidden || !$('help').hidden || !$('t3d').hidden; }

  function onKey(e) {
    var tg = e.target && e.target.tagName;
    if (tg === 'INPUT' || tg === 'TEXTAREA' || tg === 'SELECT') return;
    if (e.altKey) return;
    var k = e.key;
    if (k === 'Escape') {
      if (!$('help').hidden) { $('help').hidden = true; return; }
      if (!$('t3d').hidden) { close3D(); return; }
      if (!$('glossary').hidden) { closeModal('glossary'); return; }
      if (!$('screen-note').hidden) { noteBack(); return; }
      hideTetra(); hideChooser();
      if (!playing()) return;
      if (!$('why').hidden) { closeWhy(); return; }
      if (P.trip) { closeTrip(); return; }
      if (P.picks.length || P.choice || P.pinnedTri || P.selEdge || P.goalGhost != null) { P.selEdge = null; P.goalGhost = null; clearPicks(); renderToolHint(); return; }
      if (P.tool && P.tools.filter(function (t) { return !TOOLS[t].instant; }).length > 1) selectTool(P.tool);
      return;
    }
    if (k === '?' || (k === '/' && e.shiftKey)) { e.preventDefault(); if ($('help').hidden) openHelp(); else $('help').hidden = true; return; }
    if (anyOverlay() || !playing()) return;
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (k === 'z' || k === 'Z')) { e.preventDefault(); undo(); return; }
    if (e.ctrlKey || e.metaKey) return;
    if (k === 'Enter') {
      if (tg === 'BUTTON' || tg === 'A' || tg === 'SUMMARY') return;
      if (e.target && e.target.closest && e.target.closest('#board [tabindex]')) return;
      if (P.trip && P.trip.res && P.trip.res.claim) { e.preventDefault(); tripClaim(); return; }
      if (winShown()) { e.preventDefault(); nextLevel(); return; }
      return;
    }
    if (k === 'Backspace') { if (P.picks.length) { e.preventDefault(); P.picks.pop(); renderPicks(); } return; }
    if (/^[0-9]$/.test(k)) {
      var n = +k;
      if (!$('why').hidden) { var rb = $('why').querySelectorAll('[data-reason]')[n - 1]; if (rb) { e.preventDefault(); rb.click(); } return; }
      var bb = (P.badges || []).filter(function (x) { return x.n === n; })[0];
      // number badges stay hidden until you start picking by keyboard: the first number press only reveals them
      if (bb && !document.body.classList.contains('kbd-mode')) { e.preventDefault(); setKbdMode(true); return; }
      if (bb) { e.preventDefault(); handlePick({ kind: bb.kind, id: bb.id }); return; }
      if (P.tool && P.badges && P.badges.length && n >= 1) { e.preventDefault(); return; }
      var th = P.tools.filter(function (t) { return TOOLS[t].key === k; })[0];
      if (th) { e.preventDefault(); selectTool(th); }
      return;
    }
    var up = k.length === 1 ? k.toUpperCase() : '';
    if (!up) return;
    if (up === 'Z') { e.preventDefault(); undo(); return; }
    if (up === 'H') { e.preventDefault(); $('btn-hint').click(); return; }
    if (up === 'U') { e.preventDefault(); P.unfold = !P.unfold; renderBoard(); applyHighlights(); return; }
    if (up === 'R' && P.selEdge && !P.tool) { e.preventDefault(); startRename(P.selEdge); return; }
    var tool = P.tools.filter(function (t) { return TOOLS[t].key === up; })[0];
    if (tool) { e.preventDefault(); selectTool(tool); return; }
    if (up === 'R' && P.selEdge) { e.preventDefault(); startRename(P.selEdge); }
  }

  function noteBack() {
    var r = noteReturn; noteReturn = null;
    if (r && r.level != null && levels()[r.level]) startLevel(r.level); else showScreen('map');
  }

  function bind() {
    var board = $('board');
    board.addEventListener('click', onBoardActivate);
    board.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' && !winShown()) || e.key === ' ') { e.preventDefault(); onBoardActivate(e); }
    });
    board.addEventListener('pointerdown', onBoardPointerDown);
    board.addEventListener('pointermove', onBoardPointerMove);
    board.addEventListener('pointerup', onBoardPointerUp);
    board.addEventListener('pointercancel', onBoardPointerUp);
    board.addEventListener('dblclick', function (e) {
      var eg = e.target.closest && e.target.closest('[data-eid]');
      if (eg) { e.preventDefault(); startRename(eg.getAttribute('data-eid')); }
    });
    board.addEventListener('pointerover', function (e) {
      var eg = e.target.closest && e.target.closest('[data-eid]');
      var id = eg ? eg.getAttribute('data-eid') : null;
      if (id !== P.hoverEdge && P.els.sedge && Object.keys(P.els.sedge).length) { P.hoverEdge = id; applyHighlights(); }
    });
    $('toolbar').addEventListener('click', function (e) { var b = e.target.closest('[data-tool]'); if (b) selectTool(b.getAttribute('data-tool')); });
    $('trip').addEventListener('click', function (e) {
      var t = e.target.closest ? e.target : null; if (!t) return;
      if (t.closest('[data-act="tripclose"]')) { closeTrip(); return; }
      if (t.closest('[data-act="claim"]')) { tripClaim(); return; }
      var c = t.closest('[data-clear]'); if (c) { tripChoose(c.getAttribute('data-clear'), null); return; }
      var ch = t.closest('[data-slot]'); if (ch) { tripChoose(ch.getAttribute('data-slot'), ch.getAttribute('data-ref')); return; }
      var fc = t.closest('#trip-view [data-face]'); if (fc) { tripCycle(fc.getAttribute('data-face')); return; }
    });
    $('trip').addEventListener('pointerover', function (e) {
      var ch = e.target.closest && e.target.closest('[data-ref]');
      if (ch) { var f = factInfo(ch.getAttribute('data-ref')); P.previewEdges = f ? [f.e01, f.e12, f.e02] : null; P.hoverTri = f && P.m.t[f.ref] ? f.ref : null; applyHighlights(); return; }
      var fc = e.target.closest && e.target.closest('[data-face]');
      if (fc) hoverFace(fc.getAttribute('data-face'));
    });
    $('trip').addEventListener('pointerout', function () { if (P.previewEdges || P.hoverTri) { P.previewEdges = null; P.hoverTri = null; applyHighlights(); } });
    $('toolhint').addEventListener('click', function (e) {
      if (e.target.closest('[data-act="clear"]')) { clearPicks(); return; }
      if (e.target.closest('[data-act="rename"]')) { startRename(e.target.closest('[data-act="rename"]').getAttribute('data-eid')); return; }
      var o = e.target.closest('[data-opt]'); if (o) chooseOption(+o.getAttribute('data-opt'));
    });
    $('toolhint').addEventListener('pointerover', function (e) {
      var o = e.target.closest && e.target.closest('[data-opt]');
      if (!o || !P.choice) return;
      var op = P.choice.opts[+o.getAttribute('data-opt')];
      if (P.choice.lift) { P.hoverEdge = null; Object.keys(P.els.sedge || {}).forEach(function (id) { P.els.sedge[id].classList.toggle('hi', !!op && id === op.over); }); return; }
      P.previewEdges = op ? [op.e01, op.e12, op.e02] : null; applyHighlights();
    });
    $('toolhint').addEventListener('pointerout', function () { if (P.previewEdges && P.choice) { P.previewEdges = null; applyHighlights(); } });
    $('showbar').addEventListener('click', function (e) {
      var l = e.target.closest('[data-layer]');
      if (l) { var k = l.getAttribute('data-layer'); P.layers[k] = P.layers[k] === false; renderBoard(); applyHighlights(); return; }
      var a = e.target.closest('[data-act]'); if (!a) return;
      var act = a.getAttribute('data-act');
      if (act === 'unfold') { P.unfold = !P.unfold; renderBoard(); applyHighlights(); }
      else if (act === 'view3d') open3D(view3d.i || 0);
      else if (act === 'tidy') tidy();
    });
    $('chooser').addEventListener('click', function (e) {
      var b = e.target.closest('[data-ci]'); if (!b || !lastHit || !lastHit.list) return;
      var i = +b.getAttribute('data-ci'), prev = lastHit.list[lastHit.i];
      if (i === lastHit.i) { hideChooser(); return; }
      lastHit.i = i; lastHit.t = Date.now();
      rePick(prev, lastHit.list[i]);
      showChooser(lastHit.list, i, lastHit.x, lastHit.y);
    });
    var facts = $('facts');
    facts.addEventListener('click', function (e) { var c = e.target.closest('[data-tid]'); if (c) handlePick({ kind: 'tri', id: c.getAttribute('data-tid') }); });
    function hov(e, on) {
      var c = e.target.closest && e.target.closest('[data-tid]');
      if (!c || e.pointerType === 'touch') return;
      P.hoverTri = on ? c.getAttribute('data-tid') : null;
      applyHighlights();
    }
    facts.addEventListener('pointerover', function (e) { hov(e, true); });
    facts.addEventListener('pointerout', function (e) { hov(e, false); });
    facts.addEventListener('focusin', function (e) { hov(e, true); });
    facts.addEventListener('focusout', function (e) { hov(e, false); });
    var goals = $('goals');
    function gl(e, on) {
      var li = e.target.closest && e.target.closest('[data-goal]');
      if (!li && on) return;
      var v = on && li ? +li.getAttribute('data-goal') : null;
      if (e.pointerType === 'touch') return;
      if (P.goalGhost !== v) { P.goalGhost = v; applyHighlights(); }
    }
    goals.addEventListener('pointerover', function (e) { gl(e, true); });
    goals.addEventListener('pointerout', function (e) { gl(e, false); });
    goals.addEventListener('focusin', function (e) { gl(e, true); });
    goals.addEventListener('focusout', function (e) { gl(e, false); });
    goals.addEventListener('click', function (e) {
      var li = e.target.closest('[data-goal]'); if (!li) return;
      var v = +li.getAttribute('data-goal');
      P.goalGhost = P.goalGhost === v && e.pointerType !== 'mouse' ? null : v;
      applyHighlights();
      if (window.innerWidth < 900) try { $('board-wrap').scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' }); } catch (er) {}
    });

    $('btn-undo').addEventListener('click', undo);
    $('btn-reset').addEventListener('click', resetLevel);
    $('btn-claim').addEventListener('click', function () { if ($('why').hidden) openWhy(); else closeWhy(); });
    $('why').addEventListener('click', function (e) {
      var r = e.target.closest('[data-reason]'); if (r) { claimWith(r.getAttribute('data-reason')); return; }
      if (e.target.closest('[data-act="why-close"]')) closeWhy();
    });
    $('btn-hint').addEventListener('click', function () {
      var n = arr(textFor(P.level).hints).length;
      if (P.hintsShown < n) { P.hintsShown++; renderHints(); }
    });
    $('btn-help').addEventListener('click', openHelp);
    $('help-close').addEventListener('click', function () { $('help').hidden = true; });
    $('help').addEventListener('click', function (e) { if (e.target === $('help')) $('help').hidden = true; });
    $('t3d').addEventListener('click', function (e) {
      if (e.target === $('t3d') || e.target.closest('[data-act="t3d-close"]')) { close3D(); return; }
      if (e.target.closest('[data-act="t3d-prev"]')) open3D(view3d.i - 1);
      if (e.target.closest('[data-act="t3d-next"]')) open3D(view3d.i + 1);
    });
    $('winbox').addEventListener('click', function (e) {
      if (e.target.closest('#win-next')) nextLevel();
      else if (e.target.closest('#win-ending')) showScreen('ending');
    });
    // notes and briefings, wherever they are linked from
    document.addEventListener('click', function (e) {
      var nb = e.target.closest && e.target.closest('[data-note]');
      if (nb) { e.preventDefault(); var ret = P.level ? { level: P.idx } : null; if (nb.closest('#winbox')) ret = { level: P.idx + 1 }; showNote(nb.getAttribute('data-note'), ret); return; }
      var tl = e.target.closest && e.target.closest('[data-term]');
      if (tl && tl.closest('#toast')) { openGlossaryAt(tl.getAttribute('data-term')); return; }
      if (e.target.closest && e.target.closest('[data-act="brief-ok"]')) {
        if (P.level) { progress.briefed = progress.briefed || {}; progress.briefed[P.level.world] = true; saveProgress(); paintBriefing(); }
        return;
      }
      if (e.target.closest && e.target.closest('[data-act="brief-show"]')) {
        if (P.level) { progress.briefed = progress.briefed || {}; progress.briefed[P.level.world] = false; saveProgress(); paintBriefing(); }
        return;
      }
      if (e.target.closest && e.target.closest('[data-act="offer-skip"]')) { $('offer').hidden = true; return; }
      if (e.target.closest && e.target.closest('[data-act="note-back"]')) { noteBack(); return; }
      var pl = e.target.closest && e.target.closest('[data-play]');
      if (pl) { startLevel(+pl.getAttribute('data-play')); }
    });
    $('btn-back').addEventListener('click', function () { showScreen('map'); });
    $('btn-ending-back').addEventListener('click', function () { showScreen('map'); });
    $('btn-note-back').addEventListener('click', noteBack);
    $('btn-ending').addEventListener('click', function () { showScreen('ending'); });
    $('brand').addEventListener('click', function () { closeModal('glossary'); showScreen('map'); });

    $('worlds').addEventListener('click', function (e) {
      var b = e.target.closest('[data-level]'); if (!b) return;
      var i = +b.getAttribute('data-level');
      if (!isUnlocked(i)) { nudge(b); toast(worldOpen(levels()[i].world || 1) ? 'Solve the one before it first.' : 'This world opens after the worlds listed under its title.', 'info'); return; }
      startLevel(i);
    });
    var shBox = $('starthere');
    if (shBox) shBox.addEventListener('click', function (e) {
      var b = e.target.closest('[data-level]'); if (!b) return;
      var i = +b.getAttribute('data-level');
      if (!isUnlocked(i)) { toast('Solve the one before it first.', 'info'); return; }
      startLevel(i);
    });
    $('btn-unlock').addEventListener('click', function () { progress.unlockAll = !progress.unlockAll; saveProgress(); renderMap(); });
    $('btn-resetprog').addEventListener('click', function () {
      if (!window.confirm('Erase all progress on this device?')) return;
      progress.solved = {}; progress.best = {}; progress.seenTools = {}; progress.unlockAll = false; progress.pos = {};
      progress.briefed = {}; progress.notesRead = {}; progress.wordsSeen = {}; progress.explained = {};
      saveProgress(); renderMap();
    });
    $('btn-glossary').addEventListener('click', function () {
      resetGlossary(); renderGlossary(); openModal('glossary');
      try { ($('glossary-search') || $('glossary-close')).focus(); } catch (e) {}
    });
    (function () {
      var gs = $('glossary-search'), gi = $('glossary-index'), gl = $('glossary-list');
      if (gs) {
        gs.addEventListener('input', function () { GL.q = gs.value; renderGlossary(); });
        gs.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') {
            e.stopPropagation();
            if (gs.value) { gs.value = ''; GL.q = ''; renderGlossary(); } else closeModal('glossary');
          }
        });
      }
      if (gi) gi.addEventListener('click', function (e) {
        var b = e.target.closest('[data-world]'); if (!b) return;
        var w = b.getAttribute('data-world');
        GL.world = (w === '' || w == null) ? null : (w === 'none' ? null : +w);
        if (w === 'none') GL.world = null;
        renderGlossary();
        var sec = gl && gl.querySelector('.gl-sec');
        if (sec) try { gl.scrollTop = 0; } catch (err) {}
      });
      if (gl) gl.addEventListener('click', function (e) {
        if (e.target.closest('[data-act="gl-clear"]')) { resetGlossary(); renderGlossary(); try { $('glossary-search').focus(); } catch (err) {} return; }
        var ref = e.target.closest('[data-ref]');
        if (ref) {                       // "see also": jump to that term
          GL.world = null;
          GL.q = ref.getAttribute('data-ref');
          if (gs) gs.value = GL.q;
          renderGlossary();
          try { gl.scrollTop = 0; } catch (err) {}
          return;
        }
        var go = e.target.closest('[data-level]');
        if (go) { var i = +go.getAttribute('data-level'); closeModal('glossary'); if (isUnlocked(i)) startLevel(i); }
      });
    })();
    $('glossary-close').addEventListener('click', function () { closeModal('glossary'); });
    $('glossary').addEventListener('click', function (e) { if (e.target === $('glossary')) closeModal('glossary'); });
    $('btn-theme').addEventListener('click', cycleTheme);
    $('btn-mode').addEventListener('click', toggleMode);

    document.addEventListener('keydown', onKey);
    var rsT = null;
    window.addEventListener('resize', function () {
      clearTimeout(rsT);
      rsT = setTimeout(function () {
        if (!P.level || $('screen-play').hidden) return;
        var was = $('board').classList.contains('big');
        sizeBoard();
        if (was !== $('board').classList.contains('big')) { renderBoard(); applyHighlights(); }
      }, 150);
    });
    // KaTeX may arrive after first paint: re-typeset when it does
    var kj = $('katex-js');
    if (kj && !hasKatex()) kj.addEventListener('load', rerenderMath);
  }
  function rerenderMath() {
    if (!$('screen-map').hidden) renderMap();
    if (!$('screen-ending').hidden) renderEnding();
    if ($('screen-note') && !$('screen-note').hidden && P.noteId) renderNote(P.noteId);
    if (P.level) { renderPlayStatic(); renderAll(); if (winShown()) showWin(); }
  }

  function init() {
    applyTheme();
    applyMode();
    bind();
    // a refresh always lands on the level select, never inside a level
    try { if (location.hash) history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    showScreen('map');
    if (!HC.Engine) toast('engine.js did not load.', 'warn');
  }

  /* test / debug hooks */
  /* --- Back: our own trail of screens, plus previous / next level --- */
  var NAV = [], navQuiet = false;
  function navPush(t, k) {
    if (navQuiet) return;
    var l = NAV[NAV.length - 1];
    if (l && l.t === t && l.k === k) return;
    NAV.push({ t: t, k: k }); if (NAV.length > 60) NAV.shift();
    updBack();
  }
  // reading order: each note sits just before the level it introduces
  function readingOrder() {
    var out = [];
    levels().forEach(function (lv, i) { var nb = noteBefore(lv.name); if (nb) out.push({ t: 'note', k: nb.id, lv: i }); out.push({ t: 'level', k: i, lv: i }); });
    return out;
  }
  function hereInOrder() {
    var scr = document.body.getAttribute('data-screen'), R = readingOrder();
    for (var i = 0; i < R.length; i++) {
      if (scr === 'play' && P.level && R[i].t === 'level' && R[i].k === P.idx) return i;
      if (scr === 'note' && R[i].t === 'note' && R[i].k === P.noteId) return i;
    }
    return -1;
  }
  function stepOrder(dir) {
    var R = readingOrder(), i = hereInOrder();
    if (i < 0) return null;
    for (var j = i + dir; j >= 0 && j < R.length; j += dir) {
      if (R[j].t === 'note' ? isUnlocked(R[j].lv) : isUnlocked(R[j].k)) return R[j];
      if (dir > 0) return null;
    }
    return null;
  }
  function goStep(dir) {
    var s = stepOrder(dir); if (!s) return;
    if (s.t === 'note') showNote(s.k); else startLevel(s.k);
  }
  function updBack() {
    var b = $('btn-goback'); if (b) b.hidden = NAV.length < 2;
    ['', 'n'].forEach(function (sfx) {
      var pv = $('btn-prev' + sfx), nx = $('btn-next' + sfx);
      if (!pv || !nx) return;
      var p = stepOrder(-1), n = stepOrder(1);
      pv.disabled = !p; nx.disabled = !n;
      pv.title = p ? (p.t === 'note' ? 'Note: ' : '') + stripTags(p.t === 'note' ? (noteById(p.k).title || '') : titleFor(levels()[p.k])) : '';
      nx.title = n ? (n.t === 'note' ? 'Note: ' : '') + stripTags(n.t === 'note' ? (noteById(n.k).title || '') : titleFor(levels()[n.k])) : '';
    });
  }
  function goBack() {
    if (NAV.length < 2) { if (document.body.getAttribute('data-screen') !== 'map') showScreen('map'); return; }
    NAV.pop();
    var p = NAV[NAV.length - 1];
    navQuiet = true;
    try {
      if (p.t === 'level') startLevel(p.k);
      else if (p.t === 'note') showNote(p.k);
      else if (p.t === 'ending') showScreen('ending');
      else showScreen('map');
    } finally { navQuiet = false; }
    updBack();
  }
  // one line saying what kind of space this level happens in, and so which fillings are allowed
  function settingHTML(lv) {
    if (!lv) return '';
    var tl = arr(lv.tools), has = function (x) { return tl.indexOf(x) >= 0; };
    if (isSandbox(lv)) return 'Free play in a <b>Kan complex</b>, where every horn can be filled, with every tool available.';
    if (lv.base) return lv.licence === 'left'
      ? 'You are working over a <b>left fibration</b>. Upstairs you may lift any arrow of the shadow from a start you choose, and fill a horn that is missing its first face, provided a matching shape lies below it.'
      : 'You are working over an <b>inner fibration</b>, so upstairs only inner horns can be filled, and only over a matching shape below.';
    if (has('witness') || has('isNerve')) return 'This is a bare <b>simplicial set</b>. Nothing gets filled here; you are judging the picture as it stands.';
    if (has('cell2') || has('addEdge') || has('peel') || has('cosk')) return 'This is a bare <b>simplicial set</b>. Nothing fills by itself, so you add and remove cells by hand.';
    if (lv.strict) return 'You are working in the <b>nerve of a category</b>, where every two arrows end to end have exactly one composite, read off the composition table.';
    if (lv.kan) return 'You are working in a <b>Kan complex</b>. Every horn can be filled, inner or outer, which means every arrow can be undone.';
    if (lv.joyal) return 'You are working in an <b>∞-category</b>. Inner horns fill as usual, and an outer horn fills only when the arrow it has to undo is marked ≅, an isomorphism.';
    return 'You are working in an <b>∞-category</b> (a quasi-category). Inner horns fill, so arrows compose and tetrahedra close.';
  }
  var startLevel0 = startLevel, showScreen0 = showScreen, showNote0 = showNote;
  startLevel = function (i) { navPush('level', i); var r = startLevel0.apply(null, arguments); updBack(); var se = $('setting'); if (se) se.innerHTML = settingHTML(P.level); return r; };
  showNote = function (id) { navPush('note', id); var r = showNote0.apply(null, arguments); updBack(); return r; };
  showScreen = function (name) { if (name === 'map') navPush('map', 0); else if (name === 'ending') navPush('ending', 0); var r = showScreen0.apply(null, arguments); updBack(); return r; };
  (function () {
    var gb = $('btn-goback'); if (gb) gb.addEventListener('click', goBack);
    ['btn-prev', 'btn-prevn'].forEach(function (id) { var el = $(id); if (el) el.addEventListener('click', function () { goStep(-1); }); });
    ['btn-next', 'btn-nextn'].forEach(function (id) { var el = $(id); if (el) el.addEventListener('click', function () { goStep(1); }); });
    // the browser's own Back button: follow the address
    window.addEventListener('hashchange', function () {
      var hh = location.hash || '', scr = document.body.getAttribute('data-screen');
      var mm = /^#level-(.+)$/.exec(hh);
      if (mm) {
        var id = decodeURIComponent(mm[1]), idx = -1;
        levels().forEach(function (lv, i) { if (lkey(lv) === id && isUnlocked(i)) idx = i; });
        if (idx >= 0 && !(scr === 'play' && P.level && P.idx === idx)) startLevel(idx);
      } else if (hh === '' && scr === 'play') showScreen('map');
    });
    navPush(document.body.getAttribute('data-screen') === 'play' && P.level ? 'level' : 'map', P.level ? P.idx : 0);
  })();

  HC.UI = {
    startLevel: startLevel, selectTool: selectTool, undo: undo, reset: resetLevel,
    pickEdge: function (id) { handlePick({ kind: 'edge', id: id }); },
    pickVertex: function (id) { handlePick({ kind: 'vertex', id: id }); },
    pickTri: function (id) { handlePick({ kind: 'tri', id: id }); },
    pickPoint: pickPoint,
    pickOption: chooseOption,
    trip: function () { return P.trip ? { mode: P.trip.mode, steps: (P.trip.steps || []).slice(), res: P.trip.res, choice: P.trip.choice } : null; },
    tetra: function () { return HC.UI.trip(); },
    claimWith: claimWith, why: openWhy, rename: function (id, label) { if (engineHas('rename')) return doMove(['rename', id, label], null, { free: true }); },
    unfold: function (on) { P.unfold = !!on; renderBoard(); applyHighlights(); },
    dragTo: function (vid, x, y) { levelPos()[vid] = { x: x, y: y }; saveProgress(); renderBoard(); applyHighlights(); },
    tidy: tidy, isolate: toggleIsolate, goalGhost: function (i) { P.goalGhost = i; applyHighlights(); },
    badges: function () { return (P.badges || []).slice(); }, key: function (k, opts) { onKey(Object.assign({ key: k, target: document.body, preventDefault: function () {} }, opts || {})); },
    showNote: function (id) { showNote(id); }, view3d: open3D,
    tripChoose: tripChoose,
    tripClaim: tripClaim,
    options: function () { return P.choice ? P.choice.opts.slice() : null; },
    peel: function () { if (P.tools.indexOf('peel') >= 0) selectTool('peel'); else doMove(['peel']); },
    claim: claim,
    next: nextLevel,
    won: function () { return P.won; },
    moves: function () { return P.moves; },
    state: function () { return P.state; },
    goal: function () { return { done: goalDone(), parts: P.level ? goalParts() : [] }; },
    level: function () { return P.level; },
    showMap: function () { showScreen('map'); },
    showEnding: function () { showScreen('ending'); },
    setSkeleton: function (k) { var b = document.querySelector('[data-skel="' + k + '"]'); if (b) b.click(); },
    setMode: function (m) { if ((m === 'math') !== mathMode()) toggleMode(); },
    math: math, prose: prose, labTeX: labTeX
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();