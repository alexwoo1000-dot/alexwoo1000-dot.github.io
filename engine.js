/* HORNFILLER engine: pure logic, no DOM. Works as a <script> (window.HC) and in node (globalThis.HC).
   v3: identities are implicit ('id:v' is accepted everywhere and created on use), stay-facts are free,
   the Trip tool (routeSlots / claimRoute) fills 3-horns, and four theorem tools (same, flip, link, swapin). */
(function (root) {
  var HC = root.HC || (root.HC = {});

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function fail(reason) { return { ok: false, reason: reason }; }

  function idLabel(vl) { return '1_' + vl; }
  function paren(l) { return /[∘\/\\]/.test(l) ? '(' + l + ')' : l; }   // math labels
  function pp(l) { return /[·\/\\]/.test(l) ? '(' + l + ')' : l; }       // plain labels

  function getEdge(s, id) { for (var i = 0; i < s.edges.length; i++) if (s.edges[i].id === id) return s.edges[i]; return null; }
  function getTri(s, id) { for (var i = 0; i < s.triangles.length; i++) if (s.triangles[i].id === id) return s.triangles[i]; return null; }
  function getVert(s, id) { for (var i = 0; i < s.vertices.length; i++) if (s.vertices[i].id === id) return s.vertices[i]; return null; }
  function isIdId(id) { return typeof id === 'string' && id.indexOf('id:') === 0; }
  function isIdEdge(e) { return !!e && (e.kind === 'identity' || isIdId(e.id)); }
  function findTri(s, a, b, c) {
    for (var i = 0; i < s.triangles.length; i++) {
      var t = s.triangles[i];
      if (t.e01 === a && t.e12 === b && t.e02 === c) return t;
    }
    return null;
  }
  function vlabel(s, v) { var x = getVert(s, v); return x ? x.label : v; }
  // an edge that exists, or the (virtual) identity edge of a dot
  function lookupEdge(s, id) {
    var e = getEdge(s, id);
    if (e) return e;
    if (isIdId(id)) {
      var v = getVert(s, id.slice(3));
      if (v) return { id: id, src: v.id, dst: v.id, label: idLabel(v.label), mathLabel: idLabel(v.label), kind: 'identity', virtual: true };
    }
    return null;
  }
  function allEdges(s) {
    var list = s.edges.slice();
    s.vertices.forEach(function (v) { if (!getEdge(s, 'id:' + v.id)) list.push(lookupEdge(s, 'id:' + v.id)); });
    return list;
  }
  // is (a,b,c) one of the free "stay" facts?  (stay,e,e) or (e,stay,e)
  function isFreeShape(a, b, c) { return (isIdId(a) && b === c) || (isIdId(b) && a === c); }
  function shapeKnown(s, a, b, c) { return !!findTri(s, a, b, c) || isFreeShape(a, b, c); }

  function getVertex(s, id) { for (var i = 0; i < s.vertices.length; i++) if (s.vertices[i].id === id) return s.vertices[i]; return null; }
  // ---------- lifting: levels with a base S and a projection ----------
  function projOf(s, id) {
    if (!id || !s.proj) return null;
    if (s.proj[id]) return s.proj[id];
    if (isIdId(id) && s.proj[id.slice(3)]) return 'id:' + s.proj[id.slice(3)];
    return null;
  }
  function baseEdgeObj(s, id) {
    if (isIdId(id)) return { id: id, src: id.slice(3), dst: id.slice(3), label: '1' };
    for (var i = 0; i < s.base.edges.length; i++) if (s.base.edges[i].id === id) return s.base.edges[i];
    return null;
  }
  function baseLabel(s, id) {
    var e = baseEdgeObj(s, id);
    if (!e) return id;
    if (isIdId(id)) { var v = null; s.base.vertices.forEach(function (x) { if (x.id === id.slice(3)) v = x; }); return idLabel(v ? v.label : id.slice(3)); }
    return e.label;
  }
  // the S triangle (id, or 'free' for a degenerate one) with these three edges, or null
  function baseTriOf(s, pa, pb, pc) {
    if (!pa || !pb || !pc) return null;
    for (var i = 0; i < s.base.triangles.length; i++) {
      var t = s.base.triangles[i];
      if (t.e01 === pa && t.e12 === pb && t.e02 === pc) return t.id;
    }
    return isFreeShape(pa, pb, pc) ? 'free' : null;
  }
  function overOf(s, a, b, c) { return baseTriOf(s, projOf(s, a), projOf(s, b), projOf(s, c)); }
  // exactly one of pa, pb, pc is null: all ways to complete it to an S triangle
  function baseSolve(s, pa, pb, pc) {
    var out = [], seen = {};
    function add(tri, val) { var k = tri + '|' + val; if (!seen[k]) { seen[k] = 1; out.push({ tri: tri, value: val }); } }
    s.base.triangles.forEach(function (t) {
      if ((pa === null || t.e01 === pa) && (pb === null || t.e12 === pb) && (pc === null || t.e02 === pc))
        add(t.id, pa === null ? t.e01 : (pb === null ? t.e12 : t.e02));
    });
    if (pc === null) { if (isIdId(pa)) add('free', pb); if (isIdId(pb)) add('free', pa); }
    else if (pb === null) {
      if (isIdId(pa)) add('free', pc);
      var ea = baseEdgeObj(s, pa); if (pa === pc && ea) add('free', 'id:' + ea.dst);
    } else {
      if (isIdId(pb)) add('free', pc);
      var eb = baseEdgeObj(s, pb); if (pb === pc && eb) add('free', 'id:' + eb.src);
    }
    return out;
  }
  function liftSolutions(s, tool, a, b) {   // a, b are edge objects, already in order
    var pa = projOf(s, a.id), pb = projOf(s, b.id);
    if (!pa || !pb) return [];
    if (tool === 'compose') return baseSolve(s, pa, pb, null);
    if (tool === 'horn0') return baseSolve(s, pa, null, pb);
    return baseSolve(s, null, pa, pb);
  }

  function snap(s) {
    return JSON.stringify({ vertices: s.vertices, edges: s.edges, triangles: s.triangles, tetras: s.tetras, counters: s.counters, proj: s.proj });
  }
  function restore(s, str) {
    var p = JSON.parse(str);
    s.vertices = p.vertices; s.edges = p.edges; s.triangles = p.triangles; s.tetras = p.tetras; s.counters = p.counters; s.proj = p.proj;
  }
  // every mutating move: snapshot first, keep it only when the move succeeded (failed moves leave no trace)
  function mut(fn) {
    return function (s) {
      var before = snap(s);
      var r = fn.apply(null, arguments);
      if (r && r.ok) s.history.push(before); else restore(s, before);
      s._ver = (s._ver || 0) + 1;
      return r;
    };
  }
  function newAdded() { return { vertices: [], edges: [], triangles: [], tetras: [] }; }

  function pushEdge(s, added, e) {
    if (!e.id) e.id = 'e' + (++s.counters.e);
    if (!e.mathLabel) e.mathLabel = e.label;
    s.edges.push(e); added.edges.push(e.id); return e;
  }
  function pushTri(s, added, t) {
    if (!t.id) t.id = 't' + (++s.counters.t);
    if (s.base && t.over === undefined) t.over = overOf(s, t.e01, t.e12, t.e02);
    s.triangles.push(t); added.triangles.push(t.id); return t;
  }
  function ensureIdEdge(s, added, v) {
    var id = 'id:' + v;
    if (getEdge(s, id)) return false;
    pushEdge(s, added, { id: id, src: v, dst: v, label: idLabel(vlabel(s, v)), kind: 'identity' });
    return true;
  }
  function ensureThin(s, added, name, a, b, c) {
    if (getTri(s, name)) return false;
    pushTri(s, added, { id: name, e01: a, e12: b, e02: c, kind: 'thin', thin: true });
    return true;
  }
  // an edge object that really exists in the state (creates the identity edge on demand)
  function realEdge(s, added, id) {
    var e = getEdge(s, id);
    if (e) return e;
    var l = lookupEdge(s, id);
    if (!l) return null;
    ensureIdEdge(s, added, l.src);
    return getEdge(s, id);
  }
  function countFillers(s, f, g) {
    var n = 0;
    s.triangles.forEach(function (t) { if (t.e01 === f.id && t.e12 === g.id) n++; });
    return n;
  }
  function orient(f, g) {
    if (f.dst === g.src) return [f, g];
    if (g.dst === f.src) return [g, f];
    return null;
  }
  function permutations(arr) {
    if (arr.length <= 1) return [arr.slice()];
    var out = [];
    arr.forEach(function (x, i) {
      var rest = arr.slice(0, i).concat(arr.slice(i + 1));
      permutations(rest).forEach(function (p) { out.push([x].concat(p)); });
    });
    return out;
  }
  function isBlank(s, a, b) {
    var bl = (s.level && s.level.blanks) || [];
    for (var i = 0; i < bl.length; i++) if (bl[i][0] === a && bl[i][1] === b) return true;
    return false;
  }

  var Engine = {};
  Engine.idLabel = idLabel;

  Engine.createState = function (level) {
    var lv = clone(level);
    var st = {
      vertices: lv.vertices || [], edges: lv.edges || [], triangles: lv.triangles || [], tetras: lv.tetras || [],
      level: lv, counters: { e: 0, t: 0, T: 0, v: 0 }, history: [], flags: {},
      base: lv.base || null, proj: lv.proj || {}
    };
    function scan(list, re, key) {
      list.forEach(function (x) { var m = re.exec(x.id); if (m) st.counters[key] = Math.max(st.counters[key], +m[1]); });
    }
    scan(st.edges, /^e(\d+)$/, 'e'); scan(st.triangles, /^t(\d+)$/, 't');
    scan(st.tetras, /^T(\d+)$/, 'T'); scan(st.vertices, /^v(\d+)$/, 'v');
    st.triangles.forEach(function (t) { if (t.kind === 'thin') t.thin = true; });
    st.edges.forEach(function (e) { if (!e.mathLabel) e.mathLabel = e.label; });
    if (st.base) st.triangles.forEach(function (t) { if (t.over === undefined) t.over = overOf(st, t.e01, t.e12, t.e02); });
    return st;
  };

  Engine.undo = function (s) {
    if (!s.history.length) return fail('Nothing to undo.');
    restore(s, s.history.pop());
    s._ver = (s._ver || 0) + 1;
    return { ok: true, added: newAdded(), message: 'Undone.' };
  };
  Engine.canUndo = function (s) { return s.history.length > 0; };

  // ---------- texts ----------
  function edgeLabel(s, id) { var e = lookupEdge(s, id); return e ? e.label : id; }
  function mathLabelOf(s, id) { var e = lookupEdge(s, id); return e ? (e.mathLabel || e.label) : id; }
  // plain: "f·g ≃ x" (x is a composite of f then g), "x ≃ y" when the middle arrow is an identity.
  // text (math): "g∘f ⇒ x" / "x ≃ y".
  function shapeTexts(s, a, b, c) {
    var la = edgeLabel(s, a), lb = edgeLabel(s, b), lc = edgeLabel(s, c);
    var ma = mathLabelOf(s, a), mb = mathLabelOf(s, b), mc = mathLabelOf(s, c);
    if (isIdId(b)) return { text: ma + ' ≃ ' + mc, plain: la + ' ≃ ' + lc, isHomotopy: true };
    return { text: paren(mb) + '∘' + paren(ma) + ' ⇒ ' + mc, plain: pp(la) + '·' + pp(lb) + ' ≃ ' + lc, isHomotopy: false };
  }
  Engine.describe = function (s, triId) {
    var t = getTri(s, triId);
    if (!t) return { text: '?', plain: '?', isHomotopy: false };
    return shapeTexts(s, t.e01, t.e12, t.e02);
  };
  // display-only renaming of an arrow
  Engine.rename = mut(function (s, edgeId, label) {
    var e = getEdge(s, edgeId);
    if (!e) return fail("I can't find that arrow.");
    if (isIdEdge(e)) return fail('Identity arrows keep their name.');
    label = String(label === undefined || label === null ? '' : label).trim();
    if (!label) return fail('Give it a name.');
    if (label.length > 12) return fail('Keep the name short.');
    if (label === e.label) return fail('That is already its name.');
    for (var i = 0; i < s.edges.length; i++) if (s.edges[i].id !== e.id && s.edges[i].label === label) return fail('Another arrow has that name.');
    e.label = label; e.mathLabel = label;
    return { ok: true, added: newAdded(), message: 'Renamed to ' + label + '.' };
  });

  // ---------- add dots / arrows / cells ----------
  Engine.addVertex = mut(function (s, x, y) {
    var used = {};
    s.vertices.forEach(function (v) { used[v.label] = 1; });
    var label = null, letters = 'abcdefghijklmnopqrstuvwxyz';
    for (var i = 0; i < letters.length && label === null; i++) if (!used[letters.charAt(i)]) label = letters.charAt(i);
    if (label === null) label = 'v' + (s.counters.v + 1);
    var id = 'v' + (++s.counters.v);
    x = Math.max(0, Math.min(100, +x || 0)); y = Math.max(0, Math.min(60, +y || 0));
    s.vertices.push({ id: id, label: label, x: x, y: y });
    var added = newAdded(); added.vertices.push(id);
    return { ok: true, added: added, message: 'New dot ' + label + '.' };
  });

  function parallelCount(s, a, b) {
    var n = 0;
    s.edges.forEach(function (e) { if (e.src === a && e.dst === b && (e.kind === 'given' || e.kind === 'drawn')) n++; });
    return n;
  }
  Engine.addEdge = mut(function (s, srcId, dstId) {
    var a = getVert(s, srcId), b = getVert(s, dstId);
    if (!a || !b) return fail("I can't find one of those dots.");
    if (a.id === b.id) return fail('An arrow needs two different dots.');
    if (parallelCount(s, a.id, b.id) >= 2) return fail('Already two arrows there.');
    var used = {}, label = null;
    s.edges.forEach(function (e) { used[e.label] = 1; });
    var pool = 'fghpqrstuvw'.split('');
    for (var i = 0; i < pool.length && label === null; i++) if (!used[pool[i]]) label = pool[i];
    if (label === null) label = 'f' + (s.edges.length + 1);
    var added = newAdded();
    pushEdge(s, added, { src: a.id, dst: b.id, label: label, kind: 'drawn' });
    return { ok: true, added: added, message: 'Drew ' + label + ' from ' + a.label + ' to ' + b.label + '.' };
  });

  function boundary(es) {
    var ps = permutations(es);
    for (var i = 0; i < ps.length; i++) {
      var x = ps[i][0], y = ps[i][1], z = ps[i][2];
      if (x.dst === y.src && x.src === z.src && y.dst === z.dst) return { e01: x, e12: y, e02: z };
    }
    return null;
  }
  function cellCheck(s, es) {
    var b = boundary(es);
    if (!b) return { err: "Those arrows don't close up into a triangle." };
    var n = 0;
    s.triangles.forEach(function (t) { if (t.e01 === b.e01.id && t.e12 === b.e12.id && t.e02 === b.e02.id) n++; });
    if (n >= 2) return { err: 'Already two triangles fill that.' };
    return { b: b };
  }
  Engine.cell2 = mut(function (s, ids) {
    if (!Array.isArray(ids) || ids.length !== 3) return fail('Pick exactly three arrows.');
    if (ids[0] === ids[1] || ids[1] === ids[2] || ids[0] === ids[2]) return fail('Pick three different arrows.');
    var es = [];
    for (var i = 0; i < 3; i++) { var e = lookupEdge(s, ids[i]); if (!e) return fail("I can't find one of those arrows."); es.push(e); }
    var c = cellCheck(s, es);
    if (c.err) return fail(c.err);
    var added = newAdded();
    es.forEach(function (e) { realEdge(s, added, e.id); });
    pushTri(s, added, { e01: c.b.e01.id, e12: c.b.e12.id, e02: c.b.e02.id, kind: 'cell' });
    return { ok: true, added: added, message: 'Glued a triangle onto the loop.' };
  });

  // coskeleton: fill every hollow triangle, then every hollow tetrahedron, in the only possible way
  Engine.cosk = mut(function (s) {
    var added = newAdded(), E = s.edges.filter(function (x) { return !isIdEdge(x) && x.src !== x.dst; }), n = 0;
    E.forEach(function (a) { E.forEach(function (b) {
      if (a.dst !== b.src || a.id === b.id) return;
      E.forEach(function (c) {
        if (c.id === a.id || c.id === b.id || c.src !== a.src || c.dst !== b.dst) return;
        if (!findTri(s, a.id, b.id, c.id)) { pushTri(s, added, { e01: a.id, e12: b.id, e02: c.id, kind: 'cell' }); n++; }
      });
    }); });
    var T = s.triangles.filter(function (t) { return !t.thin && t.kind !== 'thin'; });
    T.forEach(function (A) { T.forEach(function (B) {
      if (B.e01 !== A.e12) return;
      T.forEach(function (C) {
        if (C.e01 !== A.e02 || C.e12 !== B.e12) return;
        var D = findTri(s, A.e01, B.e02, C.e02); if (!D) return;
        var e01 = lookupEdge(s, A.e01), e12 = lookupEdge(s, A.e12), e23 = lookupEdge(s, B.e12);
        var vs = [e01.src, e01.dst, e12.dst, e23.dst];
        if (vs.filter(function (v, i) { return vs.indexOf(v) === i; }).length < 4) return;
        var faces = [B.id, C.id, D.id, A.id];
        if (tetExists(s, faces)) return;
        var tt = { id: 'T' + (++s.counters.T), faces: faces, missing: null, vertices: vs,
          edges: { '01': A.e01, '12': A.e12, '23': B.e12, '02': A.e02, '13': B.e02, '03': C.e02 } };
        s.tetras.push(tt); added.tetras.push(tt.id); n++;
      });
    }); });
    if (!n) return fail('Nothing hollow is left to fill.');
    return { ok: true, added: added, message: 'Filled every hollow shape.' };
  });

  // "nerve or not?": a nerve has EXACTLY ONE composite for every two arrows end to end
  function fillerCount(s, a, b) {
    var keys = {};
    s.triangles.forEach(function (t) { if (t.e01 === a.id && t.e12 === b.id) keys[(t.thin || t.kind === 'thin') ? 'free:' + t.e02 : t.id] = 1; });
    if (isIdEdge(a)) keys['free:' + b.id] = 1;
    if (isIdEdge(b)) keys['free:' + a.id] = 1;
    return Object.keys(keys).length;
  }
  Engine.witness = function (s, aId, bId) {
    var a = lookupEdge(s, aId), b = lookupEdge(s, bId);
    if (!a || !b) return fail("I can't find one of those arrows.");
    if (a.dst !== b.src) return fail('Those two do not meet end to end.');
    var n = fillerCount(s, a, b);
    if (n === 1) { s.flags.penalty = (s.flags.penalty || 0) + 1; return { ok: false, reason: 'That pair has exactly one composite.', wrongReason: true }; }
    s.flags.verdict = true;
    return { ok: true, added: newAdded(), message: n === 0 ? 'No composite at all: not a nerve.' : 'Two different composites: not a nerve.' };
  };
  Engine.isNerve = function (s) {
    var all = s.edges.filter(function (x) { return !isIdEdge(x); });
    s.vertices.forEach(function (v) { var ie = lookupEdge(s, 'id:' + v.id); if (ie) all.push(ie); });
    var bad = false;
    all.forEach(function (a) { all.forEach(function (b) { if (a.dst === b.src && fillerCount(s, a, b) !== 1) bad = true; }); });
    if (bad) { s.flags.penalty = (s.flags.penalty || 0) + 1; return { ok: false, reason: 'Not a nerve: some pair has no composite, or two.', wrongReason: true }; }
    s.flags.verdict = true;
    return { ok: true, added: newAdded(), message: 'Every pair has exactly one composite: a nerve.' };
  };

  Engine.peel = mut(function (s) {
    var removed = { vertices: [], edges: [], triangles: [], tetras: [] };
    if (s.tetras.length) {
      s.tetras.forEach(function (t) { removed.tetras.push(t.id); }); s.tetras = [];
    } else if (s.triangles.length) {
      s.triangles.forEach(function (t) { removed.triangles.push(t.id); }); s.triangles = [];
    } else if (s.edges.length) {
      s.edges.forEach(function (t) { removed.edges.push(t.id); }); s.edges = [];
    } else return fail('Only dots are left.');
    return { ok: true, added: newAdded(), removed: removed, message: 'Peeled off the top layer.' };
  });

  // reasonId is one of level.reasons (the first is right). A wrong reason, or a claim on a possible level,
  // costs a move: flags.penalty counts them and the result says wrongReason / reasonId.
  // ---------- counterexamples: small test categories ----------
  // comp keys are "first,second" (first then second); identities are implicit ('id:<object>').
  function A(id, src, dst, label) { return { id: id, src: src, dst: dst, label: label || id }; }
  HC.Models = [
    { id: 'arrow', name: 'One arrow', objects: ['0', '1'], arrows: [A('u', '0', '1')], comp: {},
      diagram: { dots: [{ id: '0', label: '0', x: 25, y: 30 }, { id: '1', label: '1', x: 75, y: 30 }], arrows: [{ from: '0', to: '1', label: 'u' }] } },
    { id: 'iso', name: 'An isomorphism', objects: ['0', '1'], arrows: [A('j', '0', '1'), A('jb', '1', '0', 'j⁻¹')],
      comp: { 'j,jb': 'id:0', 'jb,j': 'id:1' },
      diagram: { dots: [{ id: '0', label: '0', x: 25, y: 30 }, { id: '1', label: '1', x: 75, y: 30 }], arrows: [{ from: '0', to: '1', label: 'j' }, { from: '1', to: '0', label: 'j⁻¹' }] } },
    { id: 'parallel', name: 'Two parallel arrows', objects: ['0', '1'], arrows: [A('p', '0', '1'), A('q', '0', '1')], comp: {},
      diagram: { dots: [{ id: '0', label: '0', x: 25, y: 30 }, { id: '1', label: '1', x: 75, y: 30 }], arrows: [{ from: '0', to: '1', label: 'p' }, { from: '0', to: '1', label: 'q' }] } },
    { id: 'retract', name: 'One-sided inverse', objects: ['0', '1'],
      arrows: [A('i', '0', '1'), A('r', '1', '0'), A('e', '1', '1', 'ε')],
      comp: { 'i,r': 'id:0', 'r,i': 'e', 'e,e': 'e', 'i,e': 'i', 'e,r': 'r' },
      note: 'i then r is the identity; r then i is ε, which is not an identity.',
      diagram: { dots: [{ id: '0', label: '0', x: 25, y: 30 }, { id: '1', label: '1', x: 75, y: 30 }], arrows: [{ from: '0', to: '1', label: 'i' }, { from: '1', to: '0', label: 'r' }, { from: '1', to: '1', label: 'ε' }] } },
    { id: 'triangle', name: 'Hollow triangle', objects: ['0', '1', '2'],
      arrows: [A('f', '0', '1'), A('g', '1', '2'), A('h', '0', '2'), A('k', '0', '2', 'f·g')], comp: { 'f,g': 'k' },
      note: 'f then g is its own arrow f·g, different from h.',
      diagram: { dots: [{ id: '0', label: '0', x: 20, y: 46 }, { id: '1', label: '1', x: 50, y: 12 }, { id: '2', label: '2', x: 80, y: 46 }],
        arrows: [{ from: '0', to: '1', label: 'f' }, { from: '1', to: '2', label: 'g' }, { from: '0', to: '2', label: 'h' }, { from: '0', to: '2', label: 'f·g' }] } },
    { id: 'fork', name: 'Fork', objects: ['0', '1', '2'],
      arrows: [A('p', '0', '1'), A('q', '0', '1'), A('g', '1', '2'), A('x', '0', '2')], comp: { 'p,g': 'x', 'q,g': 'x' },
      note: 'p then g and q then g are the same arrow x, but p and q differ.',
      diagram: { dots: [{ id: '0', label: '0', x: 15, y: 30 }, { id: '1', label: '1', x: 50, y: 30 }, { id: '2', label: '2', x: 85, y: 30 }],
        arrows: [{ from: '0', to: '1', label: 'p' }, { from: '0', to: '1', label: 'q' }, { from: '1', to: '2', label: 'g' }] } },
    { id: 'square', name: 'Square that does not commute', objects: ['0', '1', '2', '3'],
      arrows: [A('f', '0', '1'), A('g', '1', '3'), A('u', '0', '2'), A('v', '2', '3'), A('x', '0', '3', 'f·g'), A('y', '0', '3', 'u·v')],
      comp: { 'f,g': 'x', 'u,v': 'y' }, note: 'The two ways round, f·g and u·v, are different arrows.',
      diagram: { dots: [{ id: '0', label: '0', x: 25, y: 12 }, { id: '1', label: '1', x: 75, y: 12 }, { id: '2', label: '2', x: 25, y: 48 }, { id: '3', label: '3', x: 75, y: 48 }],
        arrows: [{ from: '0', to: '1', label: 'f' }, { from: '1', to: '3', label: 'g' }, { from: '0', to: '2', label: 'u' }, { from: '2', to: '3', label: 'v' }] } },
    { id: 'vee', name: 'Open square', objects: ['0', '1', '2', '3'],
      arrows: [A('f', '0', '1'), A('v', '1', '3'), A('u', '0', '2'), A('x', '0', '3', 'f·v')], comp: { 'f,v': 'x' },
      note: 'Nothing goes from 2 to 3.',
      diagram: { dots: [{ id: '0', label: '0', x: 25, y: 12 }, { id: '1', label: '1', x: 75, y: 12 }, { id: '2', label: '2', x: 25, y: 48 }, { id: '3', label: '3', x: 75, y: 48 }],
        arrows: [{ from: '0', to: '1', label: 'f' }, { from: '1', to: '3', label: 'v' }, { from: '0', to: '2', label: 'u' }] } }
  ];
  function modelById(id) { for (var i = 0; i < HC.Models.length; i++) if (HC.Models[i].id === id) return HC.Models[i]; return null; }
  function mEnds(M, a) {
    if (a.indexOf('id:') === 0) return { src: a.slice(3), dst: a.slice(3) };
    for (var i = 0; i < M.arrows.length; i++) if (M.arrows[i].id === a) return M.arrows[i];
    return null;
  }
  function mComp(M, a, b) {            // a then b, or null if they do not meet
    var ea = mEnds(M, a), eb = mEnds(M, b);
    if (!ea || !eb || ea.dst !== eb.src) return null;
    if (a.indexOf('id:') === 0) return b;
    if (b.indexOf('id:') === 0) return a;
    return M.comp[a + ',' + b] || null;
  }
  function mAll(M) { return M.objects.map(function (o) { return 'id:' + o; }).concat(M.arrows.map(function (x) { return x.id; })); }
  function mInvertible(M, a) {
    var ea = mEnds(M, a); if (!ea) return false;
    return mAll(M).some(function (b) { return mComp(M, a, b) === 'id:' + ea.src && mComp(M, b, a) === 'id:' + ea.dst; });
  }
  function mLabel(M, a) { if (a.indexOf('id:') === 0) return '1_' + a.slice(3); var x = mEnds(M, a); return x ? x.label : a; }
  Engine.modelArrowsBetween = function (modelId, src, dst) {
    var M = modelById(modelId); if (!M) return [];
    return mAll(M).filter(function (a) { var x = mEnds(M, a); return x.src === src && x.dst === dst; })
      .map(function (a) { return { id: a, label: mLabel(M, a) }; });
  };
  // Does this placing of the level's STARTING picture into a test category refute the goal?
  // Sound because every move is a horn filling that the nerve of the test category can also do.
  Engine.checkModel = function (level, modelId, paint) {
    var M = modelById(modelId), lv = level || {};
    if (!M) return { ok: false, reason: 'Pick a test world first.' };
    if (lv.base || lv.strict) return { ok: false, reason: 'Counterexamples are not used on this level.' };
    paint = paint || {}; var pv = paint.vertices || {}, pe = paint.edges || {};
    var img = {}, i, missing = false;
    (lv.vertices || []).forEach(function (v) { if (M.objects.indexOf(pv[v.id]) < 0) missing = true; });
    if (missing) return { ok: false, reason: 'Place every dot first.' };
    var bad = null;
    (lv.edges || []).forEach(function (ed) {
      if (ed.src === ed.dst && ed.kind === 'identity') { img[ed.id] = 'id:' + pv[ed.src]; return; }
      var a = pe[ed.id], x = a ? mEnds(M, a) : null;
      if (!x) { missing = true; return; }
      if (x.src !== pv[ed.src] || x.dst !== pv[ed.dst]) bad = bad || ed;
      img[ed.id] = a;
    });
    if (missing) return { ok: false, reason: 'Place every arrow first.' };
    if (bad) return { ok: false, reason: bad.label + ' does not fit between those dots.' };
    function im(id) { if (id.indexOf('id:') === 0) return 'id:' + pv[id.slice(3)]; return img[id]; }
    var tris = lv.triangles || [];
    for (i = 0; i < tris.length; i++) {
      var t = tris[i], c = mComp(M, im(t.e01), im(t.e12));
      if (c !== im(t.e02)) {
        var tx = shapeTextsRaw(lv, t.e01, t.e12, t.e02);
        return { ok: false, broken: t.id, reason: 'A given fact fails there: ' + tx + '.' };
      }
    }
    var needIso = (lv.edges || []).filter(function (ed) { return ed.iso; });
    for (i = 0; i < needIso.length; i++) if (!mInvertible(M, img[needIso[i].id])) return { ok: false, reason: needIso[i].label + ' is reversible, so its image must be too.' };
    if (lv.kan && !mAll(M).every(function (a) { return mInvertible(M, a); })) return { ok: false, reason: 'Here every arrow can be undone. This world has one that cannot.' };
    // is the goal satisfiable in the model?
    var pats = (lv.goal && lv.goal.triangles) || [], all = mAll(M);
    if (!pats.length || !(lv.goal && lv.goal.triangles)) return { ok: false, reason: 'This goal cannot be tested in a world.' };
    function val(x, b) { return x.charAt(0) === '?' ? b[x] : im(x); }
    function rec(k, b) {
      if (k === pats.length) return true;
      var p = pats[k], vars = [], j;
      for (j = 0; j < 3; j++) if (p[j].charAt(0) === '?' && b[p[j]] === undefined && vars.indexOf(p[j]) < 0) vars.push(p[j]);
      function assign(n) {
        if (n === vars.length) { return mComp(M, val(p[0], b), val(p[1], b)) === val(p[2], b) && val(p[2], b) != null && rec(k + 1, b); }
        for (var q = 0; q < all.length; q++) { b[vars[n]] = all[q]; if (assign(n + 1)) return true; }
        delete b[vars[n]]; return false;
      }
      return assign(0);
    }
    if (rec(0, {})) return { ok: false, goalHolds: true, reason: 'In that world the goal is true, so it proves nothing.' };
    return { ok: true, message: 'A world where the goal fails: it cannot be done.' };
  };
  function shapeTextsRaw(lv, a, b, c) {
    function lab(id) { if (id.indexOf('id:') === 0) return '1'; var r = id; (lv.edges || []).forEach(function (ed) { if (ed.id === id) r = ed.label; }); return r; }
    return lab(a) + '·' + lab(b) + ' ≃ ' + lab(c);
  }

  Engine.claimImpossible = function (s, reasonId) {
    var lv = s.level || {}, goal = lv.goal;
    if (reasonId && typeof reasonId === 'object') {
      var cm = Engine.checkModel(lv, reasonId.model, reasonId.paint);
      if (!cm.ok) { s.flags.penalty = (s.flags.penalty || 0) + 1; return { ok: false, reason: cm.reason, wrongReason: true, goalHolds: !!cm.goalHolds }; }
      s.flags.claimed = true;
      return { ok: true, added: newAdded(), model: reasonId.model, message: cm.message };
    }
    if (goal && goal.impossible && lv.claimable && !(lv.reasons && lv.reasons.length) && !lv.base)
      return { ok: false, reason: 'Show a world where the goal fails.', needsModel: true };
    if (goal && goal.impossible) {
      var rs = lv.reasons;
      if (rs && rs.length) {
        if (!reasonId) return { ok: false, reason: 'Say why it cannot be done.', needsReason: true, reasons: rs.slice() };
        if (rs.indexOf(reasonId) !== 0) {
          s.flags.penalty = (s.flags.penalty || 0) + 1;
          return { ok: false, reason: "That is not what stops it.", wrongReason: true, reasonId: reasonId };
        }
      }
      s.flags.claimed = true;
      return { ok: true, added: newAdded(), reasonId: reasonId || null, message: "Right: it can't be done." };
    }
    s.flags.penalty = (s.flags.penalty || 0) + 1;
    return { ok: false, reason: 'It can be done. Keep going!', wrongReason: false, possible: true };
  };

  // ---------- compose ----------
  var FRESH = 'xyzwuvpqrstmn'.split('');
  function freshLabel(s) {
    var used = {};
    s.edges.forEach(function (ed) { used[ed.label] = 1; });
    var pool = ((s.level && s.level.names) || []).concat(FRESH);
    for (var i = 0; i < pool.length; i++) if (!used[pool[i]]) return pool[i];
    return 'x' + (s.edges.length + 1);
  }
  function uniqueLabel(s, base) {
    var used = {};
    s.edges.forEach(function (ed) { used[ed.label] = 1; });
    while (used[base]) base += '′';
    return base;
  }
  function strictCompose(s, added, f, g, swapped) {
    var a, b, c, name = null;
    if (isIdEdge(f)) { a = f.id; b = g.id; c = g.id; name = 's0:' + g.id; }
    else if (isIdEdge(g)) { a = f.id; b = g.id; c = f.id; name = 's1:' + f.id; }
    else {
      if (isBlank(s, f.id, g.id)) return fail('The composition table is blank here.');
      var h = (s.level.table || {})[f.id + ',' + g.id];
      if (!h) return fail('The composition table has no entry for these.');
      a = f.id; b = g.id; c = h;
    }
    if (findTri(s, a, b, c) || (name && getTri(s, name))) {
      s.flags.uniqueRefused = true;
      return fail('A category has exactly one composite. You have it.');
    }
    if (s.base) {
      var pa = projOf(s, a), pb = projOf(s, b), pc = projOf(s, c);
      if (!pa || !pb || !pc || !baseTriOf(s, pa, pb, pc)) return fail('No triangle below to lift.');
    }
    realEdge(s, added, f.id); realEdge(s, added, g.id);
    if (name) pushTri(s, added, { id: name, e01: a, e12: b, e02: c, kind: 'thin', thin: true });
    else pushTri(s, added, { e01: a, e12: b, e02: c, kind: 'compose' });
    var ce = getEdge(s, c);
    return { ok: true, added: added, swapped: !!swapped, message: (ce ? ce.label : c) + ': ' + f.label + ' first, then ' + g.label + '.' };
  }

  // compose(f, g): if the arrows connect one way only, that order is used (the message says which comes first).
  // In a level with a base, optionIndex chooses among the S triangles to lift.
  Engine.compose = mut(function (s, fId, gId, optionIndex) {
    var f = lookupEdge(s, fId), g = lookupEdge(s, gId);
    if (!f || !g) return fail("I can't find one of those arrows.");
    var o = orient(f, g);
    if (!o) return fail('Arrows must meet: one ends where the other starts.');
    var swapped = o[0].id !== f.id || o[1].id !== g.id;
    var added = newAdded();
    if (s.level && s.level.strict) return strictCompose(s, added, o[0], o[1], swapped);
    var opt = null;
    if (s.base) {
      var sol = liftSolutions(s, 'compose', o[0], o[1]);
      if (!sol.length) return fail('No triangle below to lift.');
      var oi = optionIndex || 0;
      if (oi < 0 || oi >= sol.length) return fail("That option doesn't exist.");
      opt = sol[oi];
    }
    var fillers = 0;
    s.triangles.forEach(function (t) { if (t.e01 === o[0].id && t.e12 === o[1].id && (!opt || t.over === opt.tri)) fillers++; });
    if (fillers >= 2) return fail('Already two answers for this pair.');
    f = realEdge(s, added, o[0].id); g = realEdge(s, added, o[1].id);
    var label = uniqueLabel(s, pp(f.label) + '·' + pp(g.label));
    var mlabel = paren(g.mathLabel || g.label) + '∘' + paren(f.mathLabel || f.label);
    var mused = {};
    s.edges.forEach(function (ed) { mused[ed.mathLabel] = 1; });
    while (mused[mlabel]) mlabel += '′';
    var e = pushEdge(s, added, { src: f.src, dst: g.dst, label: label, mathLabel: mlabel, kind: 'composite',
      origin: { op: 'compose', from: [f.id, g.id] } });
    if (opt) s.proj[e.id] = opt.value;
    pushTri(s, added, { e01: f.id, e12: g.id, e02: e.id, kind: 'compose' });
    return { ok: true, added: added, swapped: swapped, message: label + ': ' + f.label + ' first, then ' + g.label + '.' };
  });

  // ---------- identity (kept for compatibility; no level lists it) ----------
  function identityNeeds(s, e) {
    if (isIdEdge(e)) return !getTri(s, 's0:' + e.id);
    return !getEdge(s, 'id:' + e.src) || !getEdge(s, 'id:' + e.dst) || !getTri(s, 's0:' + e.id) || !getTri(s, 's1:' + e.id);
  }
  Engine.identity = mut(function (s, id) {
    var v = getVert(s, id);
    var added = newAdded();
    if (v) {
      if (getEdge(s, 'id:' + id)) return fail('That dot already has its identity arrow.');
      ensureIdEdge(s, added, id);
      return { ok: true, added: added, message: 'Added ' + idLabel(v.label) + ' at ' + v.label + '.' };
    }
    var e = getEdge(s, id);
    if (!e) return fail("I can't find that dot or arrow.");
    if (!identityNeeds(s, e)) return fail('Nothing new to learn there.');
    if (isIdEdge(e)) {
      ensureThin(s, added, 's0:' + e.id, e.id, e.id, e.id);
    } else {
      ensureIdEdge(s, added, e.src);
      ensureIdEdge(s, added, e.dst);
      ensureThin(s, added, 's0:' + e.id, 'id:' + e.src, e.id, e.id);
      ensureThin(s, added, 's1:' + e.id, e.id, 'id:' + e.dst, e.id);
    }
    return { ok: true, added: added, message: 'Doing nothing around ' + e.label + ' changes nothing.' };
  });

  // ---------- horns ----------
  function horn0Err(s, a, h) {
    if (a.src !== h.src) return 'These must start at the same dot.';
    if (s.level && s.level.joyal && !a.iso) return 'Only a reversible arrow (≅) works there.';
    if (s.base && s.level && s.level.licence && s.level.licence !== 'left') return 'This map only lifts inner horns.';
    if (s.base && !liftSolutions(s, 'horn0', a, h).length) return 'No triangle below to lift.';
    var n = 0;
    s.triangles.forEach(function (t) { if (t.e01 === a.id && t.e02 === h.id) n++; });
    if (n >= 2) return 'Already two answers here.';
    return null;
  }
  function horn2Err(s, g, h) {
    if (g.dst !== h.dst) return 'These must end at the same dot.';
    if (s.level && s.level.joyal && !g.iso) return 'Only a reversible arrow (≅) works there.';
    if (s.base && s.level && s.level.licence) return "This map doesn't lift that horn.";
    if (s.base && !liftSolutions(s, 'horn2', g, h).length) return 'No triangle below to lift.';
    var n = 0;
    s.triangles.forEach(function (t) { if (t.e12 === g.id && t.e02 === h.id) n++; });
    if (n >= 2) return 'Already two answers here.';
    return null;
  }
  Engine.horn0 = mut(function (s, e01Id, e02Id, optionIndex) {
    var a = lookupEdge(s, e01Id), h = lookupEdge(s, e02Id);
    if (!a || !h) return fail("I can't find one of those arrows.");
    var err = horn0Err(s, a, h); if (err) return fail(err);
    var opt = null;
    if (s.base) {
      var sol = liftSolutions(s, 'horn0', a, h), oi = optionIndex || 0;
      if (oi < 0 || oi >= sol.length) return fail("That option doesn't exist.");
      opt = sol[oi];
    }
    var added = newAdded();
    a = realEdge(s, added, a.id); h = realEdge(s, added, h.id);
    // a left inverse is called a⁻¹; any other solution gets a fresh letter
    var label = isIdEdge(h) ? uniqueLabel(s, pp(a.label) + '⁻¹') : freshLabel(s);
    var e = pushEdge(s, added, { src: a.dst, dst: h.dst, label: label, mathLabel: label, kind: 'solved',
      origin: { op: 'horn0', from: [a.id, h.id] } });
    if (opt) s.proj[e.id] = opt.value;
    pushTri(s, added, { e01: a.id, e12: e.id, e02: h.id, kind: 'solved' });
    return { ok: true, added: added, message: label + ': ' + a.label + ' then ' + label + ' gives ' + h.label + '.' };
  });
  Engine.horn2 = mut(function (s, e12Id, e02Id, optionIndex) {
    var g = lookupEdge(s, e12Id), h = lookupEdge(s, e02Id);
    if (!g || !h) return fail("I can't find one of those arrows.");
    var err = horn2Err(s, g, h); if (err) return fail(err);
    var opt = null;
    if (s.base) {
      var sol = liftSolutions(s, 'horn2', g, h), oi = optionIndex || 0;
      if (oi < 0 || oi >= sol.length) return fail("That option doesn't exist.");
      opt = sol[oi];
    }
    var added = newAdded();
    g = realEdge(s, added, g.id); h = realEdge(s, added, h.id);
    var label = isIdEdge(h) ? uniqueLabel(s, pp(g.label) + '⁻¹') : freshLabel(s);
    var e = pushEdge(s, added, { src: h.src, dst: g.src, label: label, mathLabel: label, kind: 'solved',
      origin: { op: 'horn2', from: [g.id, h.id] } });
    if (opt) s.proj[e.id] = opt.value;
    pushTri(s, added, { e01: e.id, e12: g.id, e02: h.id, kind: 'solved' });
    return { ok: true, added: added, message: label + ': ' + label + ' then ' + g.label + ' gives ' + h.label + '.' };
  });
  // liftEdge: with a left licence, an arrow of S lifts from any dot over its start. The lift ends at a FRESH dot.
  function edgeLifts(s, vId) {
    if (!s.base || !s.level || s.level.licence !== 'left') return [];
    var pv = s.proj[vId]; if (!pv) return [];
    return s.base.edges.filter(function (be) { return be.src === pv && be.src !== be.dst; });
  }
  Engine.liftEdge = mut(function (s, vId, optionIndex) {
    var v = getVertex(s, vId);
    if (!v) return fail("I can't find that dot.");
    if (!s.base) return fail('There is nothing below to lift.');
    if (!s.level || s.level.licence !== 'left') return fail('This map only lifts inner horns.');
    var opts = edgeLifts(s, vId);
    if (!opts.length) return fail('No arrow below starts under that dot.');
    var oi = optionIndex || 0;
    if (oi < 0 || oi >= opts.length) return fail("That option doesn't exist.");
    var be = opts[oi], n = 0;
    s.edges.forEach(function (ed) { if (ed.src === vId && s.proj[ed.id] === be.id && ed.origin && ed.origin.op === 'lift') n++; });
    if (n >= 2) return fail('Already two lifts of that arrow from here.');
    var added = newAdded();
    var used = {}; s.vertices.forEach(function (x) { used[x.label] = 1; });
    var bv = null; s.base.vertices.forEach(function (x) { if (x.id === be.dst) bv = x; });
    var baseName = bv ? String(bv.label).replace(/\u0304/g, '') : 'v', vlab = baseName;
    while (used[vlab]) vlab += '\u2032';
    var x = bv ? bv.x : v.x + 20, y = bv ? bv.y : v.y, tries = 0;
    var clash = function () { return s.vertices.some(function (q) { return Math.abs(q.x - x) < 9 && Math.abs(q.y - y) < 9; }); };
    while (clash() && tries++ < 6) { x = Math.min(96, x + 12); y = Math.max(4, y - 7); }
    var nid = 'v' + (++s.counters.v);
    s.vertices.push({ id: nid, label: vlab, x: x, y: y });
    added.vertices.push(nid);
    s.proj[nid] = be.dst;
    var elab = uniqueLabel(s, String(be.label).replace(/\u0304/g, ''));
    var ne = pushEdge(s, added, { src: vId, dst: nid, label: elab, mathLabel: elab, kind: 'solved', origin: { op: 'lift', from: [vId] } });
    s.proj[ne.id] = be.id;
    return { ok: true, added: added, message: elab + ' lifts ' + be.label + ' and ends at a new dot ' + vlab + '.' };
  });

  // the ways a lifting problem can be solved (S triangles to lie over): [{tri, over, text}]
  Engine.liftOptions = function (s, tool, args) {
    if (!s.base || !args) return [];
    if (tool === 'liftEdge') return edgeLifts(s, args[0]).map(function (be) { return { tri: null, over: be.id, text: 'over ' + be.label }; });
    var a = lookupEdge(s, args[0]), b = lookupEdge(s, args[1]);
    if (!a || !b) return [];
    if (tool === 'compose') { var o = orient(a, b); if (!o) return []; a = o[0]; b = o[1]; }
    else if (tool !== 'horn0' && tool !== 'horn2') return [];
    return liftSolutions(s, tool, a, b).map(function (x) {
      return { tri: x.tri, over: x.value, text: 'over ' + baseLabel(s, x.value) };
    });
  };

  // ---------- fill3 (old card-picking; kept for compatibility, no level lists it) ----------
  var SLOT = { 3: ['01', '12', '02'], 2: ['01', '13', '03'], 1: ['02', '23', '03'], 0: ['12', '23', '13'] };
  var ENDS = { '01': [0, 1], '02': [0, 2], '03': [0, 3], '12': [1, 2], '13': [1, 3], '23': [2, 3] };

  function tetExists(s, faces) {
    var key = faces.slice().sort().join('|');
    for (var i = 0; i < s.tetras.length; i++) {
      if ((s.tetras[i].faces || []).filter(function (x) { return x; }).slice().sort().join('|') === key) return true;
    }
    return false;
  }

  function planFill3(s, ids) {
    if (!Array.isArray(ids) || ids.length !== 3) return { err: 'Pick exactly three triangles.' };
    if (ids[0] === ids[1] || ids[1] === ids[2] || ids[0] === ids[2]) return { err: 'Pick three different triangles.' };
    var tris = [];
    for (var i = 0; i < 3; i++) {
      var t = getTri(s, ids[i]);
      if (!t) return { err: "I can't find one of those triangles." };
      tris.push(t);
    }
    var lv = s.level || {}, kan = !!lv.kan, joyal = !!lv.joyal, strict = !!lv.strict;
    var cands = [];
    for (var m = 0; m < 4; m++) {
      var slots = [3, 2, 1, 0].filter(function (k) { return k !== m; });
      permutations(tris).forEach(function (perm) {
        var edge = {}, vert = [null, null, null, null], ok = true;
        for (var k = 0; k < 3 && ok; k++) {
          var tri = perm[k], names = SLOT[slots[k]], vals = [tri.e01, tri.e12, tri.e02];
          for (var j = 0; j < 3; j++) {
            if (edge[names[j]] !== undefined && edge[names[j]] !== vals[j]) { ok = false; break; }
            edge[names[j]] = vals[j];
          }
        }
        if (!ok) return;
        for (var n in edge) {
          var ed = getEdge(s, edge[n]); if (!ed) { ok = false; break; }
          var ends = ENDS[n], pair = [ed.src, ed.dst];
          for (var q = 0; q < 2; q++) {
            if (vert[ends[q]] !== null && vert[ends[q]] !== pair[q]) { ok = false; break; }
            vert[ends[q]] = pair[q];
          }
          if (!ok) break;
        }
        if (!ok) return;
        var ms = SLOT[m], miss = [edge[ms[0]], edge[ms[1]], edge[ms[2]]];
        if (miss[0] === undefined || miss[1] === undefined || miss[2] === undefined) return;
        var faces = [null, null, null, null];
        for (var k2 = 0; k2 < 3; k2++) faces[slots[k2]] = perm[k2].id;
        var ex = findTri(s, miss[0], miss[1], miss[2]);
        cands.push({ m: m, edge: edge, vert: vert, miss: miss, faces: faces, idx: cands.length, existing: ex ? ex.id : null });
      });
    }
    if (!cands.length) return { err: "Those triangles don't fit together as a tetrahedron." };
    function outerOk(c) {
      if (c.m === 1 || c.m === 2 || kan) return true;
      if (joyal) {
        var e;
        if (c.m === 0) { e = getEdge(s, c.edge['01']); if (e && e.iso) return true; }
        if (c.m === 3) { e = getEdge(s, c.edge['23']); if (e && e.iso) return true; }
      }
      return false;
    }
    var allowed = cands.filter(outerOk);
    if (!allowed.length) return { err: "That's an outer horn: it needs reversible arrows." };
    var fresh = allowed.filter(function (c) { return !c.existing; });
    if (!fresh.length && strict) {
      fresh = allowed.filter(function (c) {
        var f = c.faces.slice(); f[c.m] = c.existing; return !tetExists(s, f);
      });
    }
    if (!fresh.length) return { err: 'You already know this triangle.' };
    fresh.sort(function (a, b) {
      var ai = (a.m === 1 || a.m === 2) ? 0 : 1, bi = (b.m === 1 || b.m === 2) ? 0 : 1;
      return ai - bi || a.idx - b.idx;
    });
    var seen = {}, options = [];
    fresh.forEach(function (c) {
      var key = c.miss.join('|');
      if (seen[key]) return;
      seen[key] = 1; options.push(c);
    });
    return { options: options, tris: tris };
  }

  Engine.fill3Options = function (s, ids) {
    var p = planFill3(s, ids);
    if (p.err) return [];
    return p.options.map(function (c) {
      var tx = shapeTexts(s, c.miss[0], c.miss[1], c.miss[2]);
      return { e01: c.miss[0], e12: c.miss[1], e02: c.miss[2], missing: c.m, text: tx.text, plain: tx.plain, existing: !!c.existing };
    });
  };

  Engine.fill3 = mut(function (s, ids, optionIndex) {
    var p = planFill3(s, ids);
    if (p.err) return fail(p.err);
    var i = optionIndex || 0;
    if (i < 0 || i >= p.options.length) return fail("That option doesn't exist.");
    var c = p.options[i];
    var added = newAdded(), nt;
    if (c.existing) { nt = getTri(s, c.existing); }
    else nt = pushTri(s, added, { e01: c.miss[0], e12: c.miss[1], e02: c.miss[2], kind: 'filled' });
    c.faces[c.m] = nt.id;
    var T = { id: 'T' + (++s.counters.T), faces: c.faces, missing: c.m, vertices: c.vert, edges: c.edge };
    s.tetras.push(T); added.tetras.push(T.id);
    return { ok: true, added: added, message: 'The four faces agree: ' + Engine.describe(s, nt.id).text + '.' };
  });

  // ---------- the Trip tool ----------
  var SLOTS = ['A', 'B', 'C', 'D'];
  var SLOT_FACE = { A: 3, B: 0, C: 1, D: 2 };   // slot -> tetra face index (d3, d0, d1, d2)

  // every fact we may use: real triangles plus the free stay-facts that have not been made yet
  function universe(s) {
    var list = [], seen = {};
    s.triangles.forEach(function (t) {
      var k = t.e01 + '|' + t.e12 + '|' + t.e02;
      list.push({ ref: t.id, e01: t.e01, e12: t.e12, e02: t.e02, free: false, thin: t.kind === 'thin' || !!t.thin, shape: k });
      seen[k] = 1;
    });
    allEdges(s).forEach(function (e) {
      var shapes = [];
      if (isIdEdge(e)) shapes.push(['s0:' + e.id, e.id, e.id, e.id]);
      else {
        shapes.push(['s0:' + e.id, 'id:' + e.src, e.id, e.id]);
        shapes.push(['s1:' + e.id, e.id, 'id:' + e.dst, e.id]);
      }
      shapes.forEach(function (sh) {
        var k = sh[1] + '|' + sh[2] + '|' + sh[3];
        if (seen[k]) return;
        seen[k] = 1;
        list.push({ ref: sh[0], e01: sh[1], e12: sh[2], e02: sh[3], free: true, thin: true, shape: k });
      });
    });
    return list;
  }
  function factObj(s, u) {
    var tx = shapeTexts(s, u.e01, u.e12, u.e02);
    return { ref: u.ref, e01: u.e01, e12: u.e12, e02: u.e02, text: tx.text, plain: tx.plain,
      isHomotopy: tx.isHomotopy, free: u.free, thin: u.thin };
  }
  // materialise a fact (real triangle id or free 's0:'/'s1:' ref) and return the triangle
  function getFact(s, added, ref) {
    var t = getTri(s, ref);
    if (t) return t;
    var m = /^s([01]):(.+)$/.exec(ref || '');
    if (!m) return null;
    var e = lookupEdge(s, m[2]);
    if (!e) return null;
    realEdge(s, added, e.id);
    ensureIdEdge(s, added, e.src); ensureIdEdge(s, added, e.dst);
    if (isIdEdge(e)) ensureThin(s, added, 's0:' + e.id, e.id, e.id, e.id);
    else if (m[1] === '0') ensureThin(s, added, ref, 'id:' + e.src, e.id, e.id);
    else ensureThin(s, added, ref, e.id, 'id:' + e.dst, e.id);
    return getTri(s, ref);
  }

  function bindOf(slot, u) {
    if (slot === 'A') return { E02: u.e02 };
    if (slot === 'B') return { E13: u.e02 };
    if (slot === 'C') return { E02: u.e01, E03: u.e02 };
    return { E13: u.e12, E03: u.e02 };
  }
  function consistentWith(slot, u, chosen) {
    var b = bindOf(slot, u);
    for (var o in chosen) {
      if (o === slot || !chosen[o]) continue;
      var b2 = bindOf(o, chosen[o]);
      for (var k in b) if (b2[k] !== undefined && b2[k] !== b[k]) return false;
    }
    return true;
  }
  function canClaim(s, slot, steps) {
    var lv = s.level || {};
    if (slot === 'C' || slot === 'D') return { allowed: true };
    var bad = { allowed: false, reason: 'Only reversible steps allow that.' };
    if (lv.kan) return { allowed: true };
    if (s.base && lv.licence === 'left' && slot === 'B') return { allowed: true };   // a left fibration lifts horns missing face 0
    if (s.base && lv.licence) return { allowed: false, reason: lv.licence === 'left' ? "A left fibration doesn't lift that face." : 'This map only lifts inner horns.' };
    if (lv.joyal) {
      var e = slot === 'A' ? steps[2] : steps[0];
      if (e && e.iso) return { allowed: true };
    }
    return bad;
  }

  // Non-mutating description of a trip; see SPEC3 section 2.
  Engine.routeSlots = function (s, stepIds, choice) {
    if (!Array.isArray(stepIds) || stepIds.length !== 3) return fail('Pick three steps.');
    var steps = [];
    for (var i = 0; i < 3; i++) {
      var e = lookupEdge(s, stepIds[i]);
      if (!e) return fail("I can't find one of those steps.");
      steps.push(e);
    }
    if (steps[0].dst !== steps[1].src || steps[1].dst !== steps[2].src) return fail("Those steps don't connect end to end.");
    var V = [steps[0].src, steps[0].dst, steps[1].dst, steps[2].dst];
    var U;
    if (s._uc && s._uc.ver === (s._ver || 0)) U = s._uc.U; else { U = universe(s); s._uc = { ver: s._ver || 0, U: U }; }
    var strict = !!(s.level && s.level.strict);
    function srcOf(id) { var x = lookupEdge(s, id); return x ? x.src : null; }
    function dstOf(id) { var x = lookupEdge(s, id); return x ? x.dst : null; }
    var fits = {};
    SLOTS.forEach(function (sl) {
      var seen = {};
      fits[sl] = U.filter(function (u) {
        var ok;
        if (sl === 'A') ok = u.e01 === steps[0].id && u.e12 === steps[1].id;
        else if (sl === 'B') ok = u.e01 === steps[1].id && u.e12 === steps[2].id;
        else if (sl === 'C') ok = u.e12 === steps[2].id && srcOf(u.e01) === V[0];
        else ok = u.e01 === steps[0].id && dstOf(u.e12) === V[3];
        if (!ok || seen[u.shape]) return false;
        seen[u.shape] = 1; return true;
      });
    });
    var chosen = {}, fixed = {}, invalid = [];
    if (choice && typeof choice === 'object') {
      SLOTS.forEach(function (sl) {
        var c = choice[sl];
        if (c === undefined) return;
        fixed[sl] = true;
        if (c === null) return;
        var ref = typeof c === 'string' ? c : c.ref, u = null;
        fits[sl].forEach(function (x) { if (x.ref === ref) u = x; });
        if (u && consistentWith(sl, u, chosen)) chosen[sl] = u; else invalid.push(sl);
      });
    }
    // Explicit choices constrain everything; automatic choices are only hints (recomputed each call, never cascading).
    var explicit = {};
    SLOTS.forEach(function (sl) { if (chosen[sl]) explicit[sl] = chosen[sl]; });
    function cands(sl) { return fits[sl].filter(function (u) { return consistentWith(sl, u, explicit); }); }
    function nChosen() { var n = 0; SLOTS.forEach(function (x) { if (chosen[x]) n++; }); return n; }
    SLOTS.forEach(function (sl) {
      if (chosen[sl] || fixed[sl]) return;
      if (strict && nChosen() === 3) return;
      var cs = cands(sl);
      if (cs.length === 1 && consistentWith(sl, cs[0], chosen)) chosen[sl] = cs[0];
    });
    var slots = {};
    SLOTS.forEach(function (sl) {
      var cc = cands(sl).map(function (u) { return factObj(s, u); });
      slots[sl] = { cands: cc, chosen: chosen[sl] ? factObj(s, chosen[sl]) : null, lock: !canClaim(s, sl, steps).allowed };
    });
    var res = { ok: true, vertices: V, slots: slots, claim: null, known: false, invalid: invalid };
    var E02 = chosen.A ? chosen.A.e02 : (chosen.C ? chosen.C.e01 : null);
    var E13 = chosen.B ? chosen.B.e02 : (chosen.D ? chosen.D.e12 : null);
    var E03 = chosen.C ? chosen.C.e02 : (chosen.D ? chosen.D.e02 : null);
    res.edges = { e01: steps[0].id, e12: steps[1].id, e23: steps[2].id, e02: E02, e13: E13, e03: E03 };
    var n = nChosen();
    if (n === 4) { res.known = true; return res; }
    if (n === 3) {
      var X = SLOTS.filter(function (x) { return !chosen[x]; })[0], f;
      if (X === 'A') f = [steps[0].id, steps[1].id, E02];
      else if (X === 'B') f = [steps[1].id, steps[2].id, E13];
      else if (X === 'C') f = [E02, steps[2].id, E03];
      else f = [steps[0].id, E13, E03];
      var key = f.join('|'), exists = null;
      U.forEach(function (u) { if (u.shape === key) exists = exists || u; });
      var cl = canClaim(s, X, steps);
      var tx = shapeTexts(s, f[0], f[1], f[2]);
      var claim = { slot: X, fact: { e01: f[0], e12: f[1], e02: f[2] }, text: tx.text, plain: tx.plain,
        allowed: cl.allowed, existing: false };
      if (!cl.allowed) claim.reason = cl.reason;
      if (s.base) {
        claim.over = overOf(s, f[0], f[1], f[2]);
        if (!claim.over) { claim.allowed = false; claim.reason = 'No triangle below to lift.'; }
      }
      if (exists) {
        // only a strict level still records the tetrahedron for a fact that is already known
        var faces = [null, null, null, null];
        SLOTS.forEach(function (sl) { if (chosen[sl]) { faces[SLOT_FACE[sl]] = chosen[sl].ref; } });
        faces[SLOT_FACE[X]] = exists.ref;
        if (strict && !exists.free && !tetExists(s, faces)) claim.existing = true;
        else { res.known = true; return res; }
      }
      res.claim = claim;
    }
    return res;
  };

  // Entry point from three facts (faces): find the tetrahedron they are faces of.
  // Same shape as routeSlots plus steps (the spine) and choice (the explicit slot facts) to hand to claimRoute,
  // and alternatives (other ways the three facts can sit in a tetrahedron).
  var SLOT_EDGES = { A: ['01', '12', '02'], B: ['12', '23', '13'], C: ['02', '23', '03'], D: ['01', '13', '03'] };
  Engine.tetraFromFacts = function (s, refs) {
    if (!Array.isArray(refs) || refs.length !== 3) return fail('Pick three facts.');
    if (refs[0] === refs[1] || refs[1] === refs[2] || refs[0] === refs[2]) return fail('Pick three different facts.');
    var U = universe(s), facts = [];
    for (var i = 0; i < 3; i++) {
      var u = null;
      U.forEach(function (x) { if (x.ref === refs[i]) u = x; });
      if (!u) return fail("I can't find one of those facts.");
      facts.push(u);
    }
    var found = [], seen = {};
    ['D', 'C', 'A', 'B'].forEach(function (miss) {
      var slots = SLOTS.filter(function (x) { return x !== miss; });
      permutations(facts).forEach(function (perm) {
        var edge = {}, ok = true;
        for (var k = 0; k < 3 && ok; k++) {
          var names = SLOT_EDGES[slots[k]], vals = [perm[k].e01, perm[k].e12, perm[k].e02];
          for (var j = 0; j < 3; j++) {
            if (edge[names[j]] !== undefined && edge[names[j]] !== vals[j]) { ok = false; break; }
            edge[names[j]] = vals[j];
          }
        }
        if (!ok || !edge['01'] || !edge['12'] || !edge['23']) return;
        var steps = [edge['01'], edge['12'], edge['23']], choice = {};
        for (var q = 0; q < 3; q++) choice[slots[q]] = perm[q].ref;
        var key = steps.join(',') + '|' + JSON.stringify(choice);
        if (seen[key]) return;
        seen[key] = 1;
        var r = Engine.routeSlots(s, steps, choice);
        if (!r.ok || (r.invalid && r.invalid.length)) return;
        if (!r.claim && !r.known) return;
        var score = r.claim ? (r.claim.allowed ? 0 : 1) : 2;
        found.push({ r: r, steps: steps, choice: choice, score: score, order: found.length });
      });
    });
    if (!found.length) return fail("These don't close up.");
    found.sort(function (a, b) { return a.score - b.score || a.order - b.order; });
    var best = found[0], out = best.r;
    out.steps = best.steps; out.choice = best.choice;
    out.alternatives = found.slice(1).map(function (f) { return { steps: f.steps, choice: f.choice }; });
    return out;
  };

  Engine.claimRoute = mut(function (s, stepIds, choice) {
    var r = Engine.routeSlots(s, stepIds, choice);
    if (!r.ok) return fail(r.reason);
    if (!r.claim) return fail(r.known ? 'You already know this.' : 'Choose three facts first.');
    if (!r.claim.allowed) return fail(r.claim.reason);
    var added = newAdded(), faces = [null, null, null, null];
    stepIds.forEach(function (id) { realEdge(s, added, id); });
    var X = r.claim.slot;
    SLOTS.forEach(function (sl) {
      var c = r.slots[sl].chosen;
      if (!c) return;
      var t = getFact(s, added, c.ref);
      faces[SLOT_FACE[sl]] = t.id;
    });
    var cf = r.claim.fact, nt;
    [cf.e01, cf.e12, cf.e02, r.edges.e02, r.edges.e13, r.edges.e03].forEach(function (id) { if (id) realEdge(s, added, id); });
    if (r.claim.existing) nt = findTri(s, cf.e01, cf.e12, cf.e02);
    else nt = pushTri(s, added, { e01: cf.e01, e12: cf.e12, e02: cf.e02, kind: 'trip' });
    faces[SLOT_FACE[X]] = nt.id;
    var T = { id: 'T' + (++s.counters.T), faces: faces, missing: SLOT_FACE[X], vertices: r.vertices,
      edges: { '01': r.edges.e01, '12': r.edges.e12, '23': r.edges.e23, '02': r.edges.e02, '13': r.edges.e13, '03': r.edges.e03 } };
    s.tetras.push(T); added.tetras.push(T.id);
    return { ok: true, added: added, message: 'New fact: ' + shapeTexts(s, cf.e01, cf.e12, cf.e02).plain + '.' };
  });

  // ---------- theorem tools ----------
  function factFor(s, added, ref) {
    var t = getFact(s, added, ref);
    return t;
  }
  function addTheorem(s, added, a, b, c, msg) {
    if (s.base && !overOf(s, a, b, c)) return fail('No triangle below to lift.');
    var nt = pushTri(s, added, { e01: a, e12: b, e02: c, kind: 'theorem' });
    return { ok: true, added: added, message: msg + ' ' + shapeTexts(s, a, b, c).plain + '.' };
  }
  function sameResult(s, t1, t2) {
    if (t1.e01 !== t2.e01 || t1.e12 !== t2.e12) return { err: 'They must be two answers for the same trip.' };
    if (t1.e02 === t2.e02) return { err: 'Those are the same answer.' };
    var dst = lookupEdge(s, t1.e02).dst, idE = 'id:' + dst;
    if (shapeKnown(s, t1.e02, idE, t2.e02)) return { err: 'You already know this.' };
    return { r: [t1.e02, idE, t2.e02] };
  }
  Engine.same = mut(function (s, r1, r2) {
    var added = newAdded();
    var t1 = factFor(s, added, r1), t2 = factFor(s, added, r2);
    if (!t1 || !t2) return fail("I can't find one of those facts.");
    var x = sameResult(s, t1, t2);
    if (x.err) return fail(x.err);
    realEdge(s, added, x.r[1]);
    return addTheorem(s, added, x.r[0], x.r[1], x.r[2], 'Proved:');
  });
  function flipResult(s, t) {
    if (!isIdId(t.e12)) return { err: 'That fact has no wiggle to flip.' };
    if (shapeKnown(s, t.e02, t.e12, t.e01)) return { err: 'You already know this.' };
    return { r: [t.e02, t.e12, t.e01] };
  }
  Engine.flip = mut(function (s, ref) {
    var added = newAdded();
    var t = factFor(s, added, ref);
    if (!t) return fail("I can't find that fact.");
    var x = flipResult(s, t);
    if (x.err) return fail(x.err);
    return addTheorem(s, added, x.r[0], x.r[1], x.r[2], 'Proved:');
  });
  function linkResult(s, t1, t2) {
    if (!isIdId(t1.e12) || !isIdId(t2.e12)) return { err: 'Both facts must say "same up to wiggle".' };
    if (t1.e02 !== t2.e01) return { err: 'They must chain: second starts where first ends.' };
    if (shapeKnown(s, t1.e01, t1.e12, t2.e02)) return { err: 'You already know this.' };
    return { r: [t1.e01, t1.e12, t2.e02] };
  }
  Engine.link = mut(function (s, r1, r2) {
    var added = newAdded();
    var t1 = factFor(s, added, r1), t2 = factFor(s, added, r2);
    if (!t1 || !t2) return fail("I can't find one of those facts.");
    var x = linkResult(s, t1, t2);
    if (x.err) return fail(x.err);
    return addTheorem(s, added, x.r[0], x.r[1], x.r[2], 'Proved:');
  });
  function swapResults(s, h, t) {
    // h = (p, stay, q): replace p by q inside t, at each position where p occurs
    var out = [];
    if (!isIdId(h.e12) || h.e01 === h.e02) return out;
    var vals = [t.e01, t.e12, t.e02];
    for (var pos = 0; pos < 3; pos++) {
      if (vals[pos] !== h.e01) continue;
      var v = vals.slice(); v[pos] = h.e02;
      if (shapeKnown(s, v[0], v[1], v[2])) continue;
      out.push({ pos: pos, r: v });
    }
    return out;
  }
  Engine.swapin = mut(function (s, rh, rt, pos) {
    var added = newAdded();
    var h = factFor(s, added, rh), t = factFor(s, added, rt);
    if (!h || !t) return fail("I can't find one of those facts.");
    if (!isIdId(h.e12) || h.e01 === h.e02) return fail('The first fact must say two different steps are the same.');
    var rs = swapResults(s, h, t);
    if (pos !== undefined && pos !== null) rs = rs.filter(function (x) { return x.pos === pos; });
    if (!rs.length) return fail([t.e01, t.e12, t.e02].indexOf(h.e01) < 0 ? "That step doesn't appear there." : 'You already know this.');
    var v = rs[0].r;
    return addTheorem(s, added, v[0], v[1], v[2], 'Proved:');
  });

  // divide: I = (u, v, id) says "u then v is an identity". Then
  //   left:  (v, p, q)  gives  (u, q, p)     [inner horn on the path u, v, p with the free fact (id, p, p)]
  //   right: (p, u, q)  gives  (q, v, p)     [inner horn on the path p, u, v with the free fact (p, id, p)]
  function divideResults(s, I, t) {
    var out = [];
    if (!isIdId(I.e02) || isIdId(I.e01) || isIdId(I.e12)) return out;
    if (t.e01 === I.e12 && !shapeKnown(s, I.e01, t.e02, t.e12)) out.push({ side: 'left', r: [I.e01, t.e02, t.e12] });
    if (t.e12 === I.e01 && !shapeKnown(s, t.e02, I.e12, t.e01)) out.push({ side: 'right', r: [t.e02, I.e12, t.e01] });
    return out;
  }
  Engine.divide = mut(function (s, rI, rT, which) {
    var added = newAdded();
    var I = factFor(s, added, rI), t = factFor(s, added, rT);
    if (!I || !t) return fail("I can't find one of those facts.");
    if (!isIdId(I.e02) || isIdId(I.e01) || isIdId(I.e12)) return fail('The first fact must say two arrows compose to an identity.');
    var rs = divideResults(s, I, t);
    if (which !== undefined && which !== null) rs = rs.filter(function (x, i) { return x.side === which || i === which; });
    if (!rs.length) return fail((t.e01 !== I.e12 && t.e12 !== I.e01) ? "That fact doesn't use the arrow being undone." : 'You already know this.');
    var v = rs[0].r;
    return addTheorem(s, added, v[0], v[1], v[2], 'Proved:');
  });

  // ---------- strict levels: blanks ----------
  Engine.openBlanks = function (s) {
    return ((s.level && s.level.blanks) || []).filter(function (p) {
      return !s.triangles.some(function (t) { return t.e01 === p[0] && t.e12 === p[1]; });
    });
  };

  // ---------- goals ----------
  function nonDegenCounts(s) {
    return {
      edges: s.edges.filter(function (e) { return !isIdEdge(e); }).length,
      triangles: s.triangles.filter(function (t) { return t.kind !== 'thin'; }).length,
      tetras: s.tetras.length
    };
  }
  function matchTriangles(s, pats) {
    var literal = {};
    pats.forEach(function (p) { p.forEach(function (x) { if (x.charAt(0) !== '?') literal[x] = true; }); });
    function rec(i, b) {
      if (i === pats.length) return b;
      var p = pats[i];
      for (var ti = 0; ti < s.triangles.length; ti++) {
        var t = s.triangles[ti], vals = [t.e01, t.e12, t.e02], nb = {}, ok = true, k;
        for (var key in b) nb[key] = b[key];
        for (k = 0; k < 3 && ok; k++) {
          var pv = p[k], tv = vals[k];
          if (pv.charAt(0) === '?') {
            if (nb[pv] !== undefined) { if (nb[pv] !== tv) ok = false; }
            else {
              if (literal[tv]) ok = false;
              for (var o in nb) if (nb[o] === tv) ok = false;
              if (ok) nb[pv] = tv;
            }
          } else if (pv !== tv) ok = false;
        }
        if (ok && p.length > 3 && t.over !== p[3]) ok = false;
        if (ok) { var r = rec(i + 1, nb); if (r) return r; }
      }
      return null;
    }
    return rec(0, {});
  }
  function matchEdges(s, pairs) {
    var es = s.edges.filter(function (e) { return !isIdEdge(e); });
    function rec(i, used) {
      if (i === pairs.length) return true;
      for (var k = 0; k < es.length; k++) {
        if (used[k] || es[k].src !== pairs[i][0] || es[k].dst !== pairs[i][1]) continue;
        used[k] = true;
        if (rec(i + 1, used)) { used[k] = false; return true; }
        used[k] = false;
      }
      return false;
    }
    return rec(0, {});
  }
  function patTexts(s, p) {
    function lab(x) {
      if (x.charAt(0) === '?') return '?';
      var e = lookupEdge(s, x);
      return e ? e.label : x;
    }
    function mlab(x) {
      if (x.charAt(0) === '?') return '?';
      var e = lookupEdge(s, x);
      return e ? (e.mathLabel || e.label) : x;
    }
    var suffix = p.length > 3 ? ' over ' + String(p[3]).replace(/^S\./, '') : '';
    if (isIdId(p[1])) return { text: mlab(p[0]) + ' ≃ ' + mlab(p[2]) + suffix, plain: lab(p[0]) + ' ≃ ' + lab(p[2]) + suffix };
    return { text: paren(mlab(p[1])) + '∘' + paren(mlab(p[0])) + ' ⇒ ' + mlab(p[2]) + suffix,
      plain: pp(lab(p[0])) + '·' + pp(lab(p[1])) + ' ≃ ' + lab(p[2]) + suffix };
  }

  Engine.checkGoal = function (s) {
    var goal = s.level && s.level.goal;
    if (!goal) return { done: false, bindings: null, parts: [] };
    var parts = [], allDone = true, bindings = null, wish = !!goal.impossible;
    function add(p) { if (p.plain === undefined) p.plain = p.text; parts.push(p); if (!p.done && !p.wish) allDone = false; }
    if (goal.triangles && goal.triangles.length) {
      var acc = [];
      goal.triangles.forEach(function (p) {
        var trial = acc.concat([p]);
        var d = !!matchTriangles(s, trial);
        if (d) acc = trial;
        var tx = patTexts(s, p);
        var part = { kind: 'triangle', pattern: p, text: tx.text, plain: tx.plain, done: d };
        if (wish) part.wish = true;
        add(part);
      });
      bindings = matchTriangles(s, goal.triangles);
    }
    if (goal.edges) {
      goal.edges.forEach(function (pr) {
        add({ kind: 'edge', pair: pr, text: vlabel(s, pr[0]) + ' → ' + vlabel(s, pr[1]), done: false });
      });
      var k0 = parts.length - goal.edges.length, acc2 = [];
      goal.edges.forEach(function (pr, i) {
        var trial = acc2.concat([pr]);
        if (matchEdges(s, trial)) { acc2 = trial; parts[k0 + i].done = true; }
      });
      allDone = parts.every(function (p) { return p.done || p.wish; });
    }
    var cnt = nonDegenCounts(s);
    ['counts', 'min'].forEach(function (kind) {
      var g = goal[kind]; if (!g) return;
      ['edges', 'triangles', 'tetras'].forEach(function (key) {
        if (g[key] === undefined) return;
        var d = kind === 'counts' ? cnt[key] === g[key] : cnt[key] >= g[key];
        add({ kind: kind, key: key, have: cnt[key], want: g[key],
          text: (kind === 'min' ? '≥ ' : '') + g[key] + ' ' + key, done: d });
      });
    });
    if (goal.flag) add({ kind: 'flag', flag: goal.flag, text: goal.flag, done: !!s.flags[goal.flag] });
    if (goal.impossible) {
      var cl = !!s.flags.claimed;
      parts.push({ kind: 'impossible', text: "This can't be done", plain: "This can't be done", done: cl });
      allDone = cl;
    }
    if (!parts.length) allDone = false;
    var out = { done: allDone, bindings: allDone ? bindings : null, parts: parts };
    if (goal.impossible) out.impossible = true;
    return out;
  };

  // ---------- candidates (what is a valid next pick?) ----------
  function composeOk(s, a, b) {
    var o = orient(a, b); if (!o) return false;
    if (s.level && s.level.strict) {
      if (isIdEdge(o[0]) || isIdEdge(o[1])) return true;
      if (isBlank(s, o[0].id, o[1].id)) return false;
      return !!(s.level.table || {})[o[0].id + ',' + o[1].id];
    }
    if (s.base && !liftSolutions(s, 'compose', o[0], o[1]).length) return false;
    return countFillers(s, o[0], o[1]) < 2;
  }
  function addPick(out, e) {
    if (!e.virtual) { if (out.edges.indexOf(e.id) < 0) out.edges.push(e.id); }
    if (isIdEdge(e) && out.vertices.indexOf(e.src) < 0) out.vertices.push(e.src);
  }

  Engine.candidates = function (s, tool, picks) {
    picks = picks || [];
    var out = { vertices: [], edges: [], triangles: [] };
    var E = allEdges(s), i, j, k;
    if (tool === 'identity') {
      if (picks.length) return out;
      s.vertices.forEach(function (v) { if (!getEdge(s, 'id:' + v.id)) out.vertices.push(v.id); });
      s.edges.forEach(function (e) { if (identityNeeds(s, e)) out.edges.push(e.id); });
    } else if (tool === 'compose') {
      if (picks.length >= 2) return out;
      if (!picks.length) {
        E.forEach(function (a) { if (E.some(function (b) { return composeOk(s, a, b); })) addPick(out, a); });
      } else {
        var p = lookupEdge(s, picks[0]); if (!p) return out;
        E.forEach(function (b) { if (composeOk(s, p, b)) addPick(out, b); });
      }
    } else if (tool === 'horn0' || tool === 'horn2') {
      var errf = tool === 'horn0' ? horn0Err : horn2Err;
      if (picks.length >= 2) return out;
      if (!picks.length) {
        E.forEach(function (a) { if (E.some(function (b) { return !errf(s, a, b); })) addPick(out, a); });
      } else {
        var q = lookupEdge(s, picks[0]); if (!q) return out;
        E.forEach(function (b) { if (!errf(s, q, b)) addPick(out, b); });
      }
    } else if (tool === 'trip') {
      if (picks.length >= 3) return out;
      if (!picks.length) {
        s.edges.forEach(function (e) { out.edges.push(e.id); });
        s.vertices.forEach(function (v) { out.vertices.push(v.id); });
      } else {
        var last = lookupEdge(s, picks[picks.length - 1]); if (!last) return out;
        s.edges.forEach(function (e) { if (e.src === last.dst) out.edges.push(e.id); });
        out.vertices.push(last.dst);
      }
    } else if (tool === 'fill3') {
      if (picks.length >= 3) return out;
      var T = s.triangles, ok = {};
      var test = function (ids) { return Engine.fill3Options(s, ids).length > 0; };
      if (picks.length === 2) {
        T.forEach(function (t) { if (picks.indexOf(t.id) < 0 && test(picks.concat([t.id]))) out.triangles.push(t.id); });
      } else {
        for (i = 0; i < T.length; i++) for (j = i + 1; j < T.length; j++) for (k = j + 1; k < T.length; k++) {
          var ids = [T[i].id, T[j].id, T[k].id];
          if (picks.some(function (pk) { return ids.indexOf(pk) < 0; })) continue;
          if (test(ids)) ids.forEach(function (x) { ok[x] = true; });
        }
        T.forEach(function (t) { if (ok[t.id] && picks.indexOf(t.id) < 0) out.triangles.push(t.id); });
      }
    } else if (tool === 'cell2') {
      if (picks.length >= 3) return out;
      var ok2 = {};
      for (i = 0; i < E.length; i++) for (j = i + 1; j < E.length; j++) for (k = j + 1; k < E.length; k++) {
        var tr = [E[i], E[j], E[k]];
        if (picks.some(function (pk) { return !tr.some(function (x) { return x.id === pk; }); })) continue;
        if (!cellCheck(s, tr).err) tr.forEach(function (x) { ok2[x.id] = x; });
      }
      E.forEach(function (e) { if (ok2[e.id] && picks.indexOf(e.id) < 0) addPick(out, e); });
    } else if (tool === 'witness') {
      if (!picks.length) { s.edges.forEach(function (x) { out.edges.push(x.id); }); s.vertices.forEach(function (v) { out.vertices.push(v.id); }); }
      else if (picks.length === 1) {
        var w0 = lookupEdge(s, picks[0]);
        if (w0) { s.edges.forEach(function (x) { if (x.src === w0.dst) out.edges.push(x.id); }); out.vertices.push(w0.dst); }
      }
    } else if (tool === 'liftEdge') {
      if (!picks.length) s.vertices.forEach(function (v) { if (edgeLifts(s, v.id).length) out.vertices.push(v.id); });
    } else if (tool === 'addEdge') {
      if (picks.length >= 2) return out;
      if (!picks.length) {
        s.vertices.forEach(function (a) {
          if (s.vertices.some(function (b) { return b.id !== a.id && parallelCount(s, a.id, b.id) < 2; })) out.vertices.push(a.id);
        });
      } else {
        s.vertices.forEach(function (b) { if (b.id !== picks[0] && parallelCount(s, picks[0], b.id) < 2) out.vertices.push(b.id); });
      }
    } else if (tool === 'same' || tool === 'flip' || tool === 'link' || tool === 'swapin' || tool === 'divide') {
      var T2 = s.triangles;
      var tri = function (id) { return getTri(s, id); };
      var pairOk;
      if (tool === 'flip') {
        if (picks.length) return out;
        T2.forEach(function (t) { if (!flipResult(s, t).err) out.triangles.push(t.id); });
        return out;
      }
      if (tool === 'same') pairOk = function (a, b) { return a.id !== b.id && !sameResult(s, a, b).err; };
      else if (tool === 'link') pairOk = function (a, b) { return !linkResult(s, a, b).err; };
      else if (tool === 'divide') pairOk = function (I, t) { return divideResults(s, I, t).length > 0; };
      else pairOk = function (h, t) { return swapResults(s, h, t).length > 0; };
      if (picks.length >= 2) return out;
      if (!picks.length) {
        T2.forEach(function (a) { if (T2.some(function (b) { return pairOk(a, b); })) out.triangles.push(a.id); });
      } else {
        var first = tri(picks[0]); if (!first) return out;
        T2.forEach(function (b) { if (pairOk(first, b)) out.triangles.push(b.id); });
      }
    }
    return out;
  };

  HC.Engine = Engine;
})(typeof window !== 'undefined' ? window : globalThis);
