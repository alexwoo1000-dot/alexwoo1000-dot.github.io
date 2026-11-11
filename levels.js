/* HORNFILLER levels (v4). Works as a <script> (window.HC) and in node (globalThis.HC).
   Given triangles have ids G1, G2, ... (created ones are t1, t2, ...).
   kind: intro | puzzle | boss (| sandbox).  par = number of moves in the solution (a '!' step counts: it is an attempt).
   unlocks: the theorem tool a level grants.  parHidden: claimable levels hide par until solved.
   reasons: for impossible levels, three reason ids, the FIRST is the right one (the UI shuffles).
   base / proj: lifting levels. base = {vertices, edges, triangles} is the shadow S (ids prefixed 'S.'), proj maps
   the level's own dots and arrows to S. A goal triangle may carry a 4th entry: the S triangle it must lie over.
   Solution steps: ['compose',f,g(,option)] ['horn0',a,b(,option)] ['horn2',a,b(,option)]
   ['trip',[s1,s2,s3],{A,B,C,D}] ['same',t1,t2] ['flip',t] ['link',t1,t2] ['swapin',h,t(,pos)]
   ['addEdge',a,b] ['cell2',[..]] ['peel'] ['claim',reasonId];  '!' first = expected to fail. */
(function (root) {
  var HC = root.HC || (root.HC = {});

  function V(id, x, y, label) { return { id: id, label: label || id, x: x, y: y }; }
  function E(id, src, dst, label, extra) {
    var e = { id: id, src: src, dst: dst, label: label || id, kind: 'given' };
    for (var k in (extra || {})) e[k] = extra[k];
    return e;
  }
  function ID(v) { return { id: 'id:' + v, src: v, dst: v, label: '1_' + v, kind: 'identity' }; }
  function T(id, a, b, c) { return { id: id, e01: a, e12: b, e02: c, kind: 'given' }; }
  var BAR = '̄';   // combining macron: shadow names are drawn with a bar
  function SV(id, x, y) { return { id: 'S.' + id, label: id + BAR, x: x, y: y }; }
  function SE(id, src, dst) { return { id: 'S.' + id, src: 'S.' + src, dst: 'S.' + dst, label: id + BAR, kind: 'given' }; }
  function ST(id, a, b, c) { return { id: 'S.' + id, e01: 'S.' + a, e12: 'S.' + b, e02: 'S.' + c, kind: 'given' }; }

  var tri3 = [V('a', 18, 42), V('b', 50, 16), V('c', 82, 42)];
  var two = [V('a', 24, 30), V('b', 76, 30)];
  var row4 = [V('a', 14, 40), V('b', 38, 20), V('c', 62, 40), V('d', 86, 20)];
  var row3 = [V('a', 16, 36), V('b', 50, 22), V('c', 84, 36)];
  // four dots with one inside the triangle of the other three: all six arrows can be drawn without crossing
  var tet4 = function () { return [V('a', 8, 46), V('b', 50, 6), V('c', 50, 30), V('d', 92, 46)]; };
  var tet4S = function () { return [SV('a', 8, 46), SV('b', 50, 6), SV('c', 50, 30), SV('d', 92, 46)]; };
  // five dots (K5 minus b-d): outer triangle a, d, e with c and b inside
  var five = function () { return [V('a', 8, 46), V('b', 50, 40), V('c', 50, 26), V('d', 50, 4), V('e', 92, 46)]; };
  // five dots, nine arrows (K5 minus b-e) without crossings: outer triangle a, b, c; d in the middle; e inside a-c-d
  var five2 = function () { return [V('a', 8, 46), V('b', 50, 4), V('c', 92, 46), V('d', 50, 26), V('e', 36, 40)]; };
  var sq5 = function () { return [V('a', 24, 14), V('b', 76, 14), V('c', 24, 46), V('d', 76, 46), V('e', 4, 58)]; };
  var tri3a = [V('a', 10, 42), V('c', 50, 10), V('d', 90, 42)];
  var sq4 = [V('a', 24, 14), V('b', 76, 14), V('c', 24, 46), V('d', 76, 46)];
  var rowEdges = function () { return [E('f', 'a', 'b'), E('g', 'b', 'c'), E('h', 'c', 'd')]; };
  var assocGoal = [['f', 'g', '?x'], ['g', 'h', '?y'], ['?x', 'h', '?z'], ['f', '?y', '?z']];
  var hollow = function () { return [E('f', 'a', 'b'), E('g', 'b', 'c'), E('h', 'a', 'c')]; };
  var cancelEdges = function (isoG) {
    return [E('f', 'a', 'b'), E('k', 'a', 'b'), isoG ? E('g', 'b', 'c', 'g', { iso: true }) : E('g', 'b', 'c'), E('x', 'a', 'c')];
  };
  // Δ⁴ drawn as a pentagon a,b,c,d,e (corners 0..4): ten arrows, ten triangles, solids D_i omit corner i
  var pent5 = function () { return [V('a', 50, 10), V('b', 73, 27), V('c', 64, 53), V('d', 36, 53), V('e', 27, 27)]; };
  var pentEdges = function () {
    return [E('f', 'a', 'b'), E('g', 'b', 'c'), E('h', 'c', 'd'), E('i', 'd', 'e'), E('j', 'a', 'c'), E('k', 'b', 'd'),
      E('l', 'c', 'e'), E('m', 'a', 'd'), E('n', 'b', 'e'), E('o', 'a', 'e')];
  };
  // triples 012 013 014 023 024 034 123 124 134 234 = G1 … G10, written (first leg, second leg ; long side)
  var pentTriangles = function () {
    return [T('G1', 'f', 'g', 'j'), T('G2', 'f', 'k', 'm'), T('G3', 'f', 'n', 'o'), T('G4', 'j', 'h', 'm'), T('G5', 'j', 'l', 'o'),
      T('G6', 'm', 'i', 'o'), T('G7', 'g', 'h', 'k'), T('G8', 'g', 'l', 'n'), T('G9', 'k', 'i', 'n'), T('G10', 'h', 'i', 'l')];
  };
  // a solid on four of the five corners (faces d0..d3 given); its dots and arrows are read off its faces
  var pentSolid = function (id, faces) {
    var tri = {}; pentTriangles().concat([T('G11', 'j', 'h', 'm')]).forEach(function (t) { tri[t.id] = t; });
    var d0 = tri[faces[0]], d1 = tri[faces[1]], d2 = tri[faces[2]], d3 = tri[faces[3]];
    var ed = { '01': d3.e01, '12': d3.e12, '02': d3.e02, '13': d2.e12, '03': d2.e02, '23': d1.e12 };
    var src = { f: 'a', g: 'b', h: 'c', i: 'd', j: 'a', k: 'b', l: 'c', m: 'a', n: 'b', o: 'a' }, dst = { f: 'b', g: 'c', h: 'd', i: 'e', j: 'c', k: 'd', l: 'e', m: 'd', n: 'e', o: 'e' };
    return { id: id, faces: faces, missing: null, vertices: [src[ed['01']], dst[ed['01']], dst[ed['12']], dst[ed['23']]], edges: ed };
  };
  var THM = ['same', 'flip', 'link', 'swapin', 'divide'];
  var assocSol = [['compose', 'f', 'g'], ['compose', 'g', 'h'], ['compose', 'e1', 'h'],
    ['trip', ['f', 'g', 'h'], { A: 't1', B: 't2', C: 't3' }]];
  var tetFaces = function () {
    return [E('f', 'a', 'b'), E('g', 'b', 'c'), E('h', 'c', 'd'), E('x', 'a', 'c'), E('y', 'b', 'd'), E('z', 'a', 'd')];
  };
  // the shadow of a two-step trip: S has S.f, S.g and one or two composites
  var shadowBase = function (two) {
    var es = [SE('f', 'a', 'b'), SE('g', 'b', 'c'), SE('x', 'a', 'c')], ts = [ST('t1', 'f', 'g', 'x')];
    if (two) { es.push(SE('y', 'a', 'c')); ts.push(ST('t2', 'f', 'g', 'y')); }
    return { vertices: [SV('a', 18, 42), SV('b', 50, 16), SV('c', 82, 42)], edges: es, triangles: ts };
  };
  // S = a -> b -> c with its composite (the nerve of [2])
  function chainBase() {
    return { vertices: [V('S.a', 16, 40, 'a' + BAR), V('S.b', 50, 12, 'b' + BAR), V('S.c', 84, 40, 'c' + BAR)],
      edges: [SE('f', 'a', 'b'), SE('g', 'b', 'c'), SE('x', 'a', 'c')], triangles: [ST('t1', 'f', 'g', 'x')] };
  }
  // S = N(J): x and y with mutually inverse arrows
  function isoBase() {
    return { vertices: [V('S.x', 24, 30, 'x' + BAR), V('S.y', 76, 30, 'y' + BAR)],
      edges: [SE('f', 'x', 'y'), SE('g', 'y', 'x')],
      triangles: [{ id: 'S.t1', e01: 'S.f', e12: 'S.g', e02: 'id:S.x', kind: 'given' }, { id: 'S.t2', e01: 'S.g', e12: 'S.f', e02: 'id:S.y', kind: 'given' }] };
  }
  var shadowProj = { a: 'S.a', b: 'S.b', c: 'S.c', f: 'S.f', g: 'S.g' };
  function withProj(o, extra) { var r = {}, k; for (k in o) r[k] = o[k]; for (k in extra) r[k] = extra[k]; return r; }

  HC.Levels = [
    // ---- A first look at the interface: the answer is a card in the Facts list on the right. ----
    { id: 0, name: 'welcome', kind: 'intro', world: 0, par: 1, vertices: tri3,
      edges: [E('f', 'a', 'b'), E('g', 'b', 'c'), E('x', 'a', 'c')],
      triangles: [T('G1', 'f', 'g', 'x')],
      tools: [], kan: false,
      goal: { pick: 'G1', ask: [{ card: true }] },
      solution: [['pick', 'G1']] },

    // ---- World 0 (shown as world 1): Simplicial sets. Pick-a-fact levels: no tools, goal.pick. ----
    // goal.pick: a fact ref, or a list of refs picked in order; a wrong pick costs a move.
    // goal.ask: what the question asks (for the prose): face = which face of the triangle, edge = which arrow.
    { id: 0, name: 'faces', kind: 'intro', world: 0, par: 1, vertices: tet4(),
      edges: tetFaces(),
      triangles: [T('G1', 'f', 'g', 'x'), T('G2', 'g', 'h', 'y'), T('G3', 'x', 'h', 'z'), T('G4', 'f', 'y', 'z')],
      tools: [], kan: false,
      goal: { pick: 'G2', ask: [{ face: 'd1', edge: 'y' }] },
      solution: [['pick', 'G2']] },

    { id: 0, name: 'freebies', kind: 'intro', world: 0, par: 2, freeOpen: true, vertices: two,
      edges: [E('f', 'a', 'b')], triangles: [],
      tools: [], kan: false,
      goal: { pick: ['s1:f', 's0:f'], ask: [{ d0: '1_b', d1: 'f' }, { d2: '1_a', d1: 'f' }] },
      solution: [['pick', 's1:f'], ['pick', 's0:f']] },

    // corners 0,1,2,3 = a,b,b,c. Its faces d₃ = (f, 1_b ; f) and d₀ = (1_b, g ; g) are degenerate (d₂ and d₁ are the real triangle).
    { id: 0, name: 'whichface', kind: 'intro', world: 0, par: 1, freeOpen: true, vertices: tri3,
      edges: [E('f', 'a', 'b'), E('g', 'b', 'c'), E('h', 'a', 'c'), ID('b')],
      triangles: [T('G1', 'f', 'g', 'h'),
        { id: 's1:f', e01: 'f', e12: 'id:b', e02: 'f', kind: 'thin' },
        { id: 's0:g', e01: 'id:b', e12: 'g', e02: 'g', kind: 'thin' }],
      tetras: [{ id: 'T1', faces: ['s0:g', 'G1', 'G1', 's1:f'], missing: null, vertices: ['a', 'b', 'b', 'c'],
        edges: { '01': 'f', '12': 'id:b', '23': 'g', '02': 'f', '13': 'g', '03': 'h' } }],
      tools: [], kan: false,
      goal: { pick: 's1:f', ask: [{ face: 'd3', degenerate: true }] },
      solution: [['pick', 's1:f']] },

    // ---- World 1: Steps ----
    { id: 1, name: 'compose', kind: 'intro', world: 1, par: 1, vertices: tri3,
      edges: [E('f', 'a', 'b'), E('g', 'b', 'c')], triangles: [],
      tools: ['compose'], kan: false,
      goal: { triangles: [['f', 'g', '?x']] },
      solution: [['compose', 'f', 'g']] },

    { id: 2, name: 'chain', kind: 'intro', world: 1, par: 2, vertices: tet4(),
      edges: rowEdges(), triangles: [],
      tools: ['compose'], kan: false,
      goal: { triangles: [['f', 'g', '?x'], ['?x', 'h', '?z']] },
      solution: [['compose', 'f', 'g'], ['compose', 'e1', 'h']] },

    { id: 3, name: 'twoways', kind: 'intro', world: 1, par: 2, vertices: tri3,
      edges: [E('f', 'a', 'b'), E('g', 'b', 'c')], triangles: [],
      tools: ['compose'], kan: false,
      goal: { triangles: [['f', 'g', '?x'], ['f', 'g', '?y']] },
      solution: [['compose', 'f', 'g'], ['compose', 'f', 'g']] },

    // ---- World 2: Trips of three ----,

    // ---- World 2: Trips of three ----
    { id: 4, name: 'tetra', kind: 'intro', world: 2, par: 1, vertices: tet4(),
      edges: tetFaces(),
      triangles: [T('G1', 'f', 'g', 'x'), T('G2', 'g', 'h', 'y'), T('G3', 'x', 'h', 'z')],
      tools: ['trip'], kan: false,
      goal: { triangles: [['f', 'y', 'z']] },
      solution: [['trip', ['f', 'g', 'h'], { A: 'G1', B: 'G2', C: 'G3' }]] },

    { id: 5, name: 'assoc', kind: 'puzzle', world: 2, par: 4, vertices: tet4(),
      edges: rowEdges(), triangles: [],
      tools: ['compose', 'trip'], kan: false,
      goal: { triangles: assocGoal },
      solution: assocSol },

    { id: 6, name: 'unique', kind: 'puzzle', world: 2, par: 3, unlocks: 'same', vertices: tri3,
      edges: [E('f', 'a', 'b'), E('g', 'b', 'c')], triangles: [],
      tools: ['compose', 'trip'], kan: false,
      goal: { triangles: [['f', 'g', '?x'], ['f', 'g', '?y'], ['?x', 'id:c', '?y']] },
      solution: [['compose', 'f', 'g'], ['compose', 'f', 'g'], ['trip', ['f', 'g', 'id:c'], { A: 't1', D: 't2' }]] },

    { id: 7, name: 'unit', kind: 'puzzle', world: 2, par: 4, vertices: two,
      edges: [E('f', 'a', 'b')], triangles: [],
      tools: ['compose', 'trip'], kan: false,
      goal: { triangles: [['id:a', 'f', '?k'], ['?k', 'id:b', 'f'], ['f', 'id:b', '?m'], ['?m', 'id:b', 'f']] },
      solution: [['compose', 'id:a', 'f'], ['trip', ['id:a', 'f', 'id:b'], { A: 't1', B: 's1:f', D: 's0:f' }],
        ['compose', 'f', 'id:b'], ['trip', ['f', 'id:b', 'id:b'], { A: 't3', B: 's0:id:b', D: 's1:f' }]] },

    { id: 8, name: 'bracket', kind: 'boss', world: 2, par: 4, vertices: tet4(),
      edges: [E('f', 'a', 'b'), E('g', 'b', 'c'), E('h', 'c', 'd'), E('y', 'b', 'd'), E('y2', 'b', 'd', 'y′'), E('w', 'a', 'd')],
      triangles: [T('G1', 'g', 'h', 'y'), T('G2', 'g', 'h', 'y2'), T('G3', 'f', 'y', 'w')],
      tools: ['compose', 'trip', 'same'], kan: false,
      goal: { triangles: [['f', 'g', '?x'], ['?x', 'h', '?s'], ['?s', 'id:d', 'w']] },
      solution: [['compose', 'f', 'g'], ['compose', 'e1', 'h'],
        ['trip', ['f', 'g', 'h'], { A: 't1', B: 'G1', C: 't2' }], ['same', 't3', 'G3']] },

    // ---- World 3: Same up to wiggle ----
    { id: 9, name: 'symmetric', kind: 'puzzle', world: 3, par: 1, unlocks: 'flip', startUnfolded: true, vertices: [V('a', 20, 30), V('b', 80, 30)],
      edges: [E('f', 'a', 'b'), E('g', 'a', 'b'), ID('b')], triangles: [T('G1', 'f', 'id:b', 'g')],
      tools: ['trip'], kan: false,
      goal: { triangles: [['g', 'id:b', 'f']] },
      solution: [['trip', ['f', 'id:b', 'id:b'], { A: 'G1', B: 's0:id:b', D: 's1:f' }]] },

    { id: 10, name: 'transitive', kind: 'puzzle', world: 3, par: 1, unlocks: 'link', vertices: [V('a', 20, 30), V('b', 80, 30)],
      edges: [E('f', 'a', 'b'), E('g', 'a', 'b'), E('h', 'a', 'b'), ID('b')],
      triangles: [T('G1', 'f', 'id:b', 'g'), T('G2', 'g', 'id:b', 'h')],
      tools: ['trip', 'flip'], kan: false,
      goal: { triangles: [['f', 'id:b', 'h']] },
      solution: [['trip', ['f', 'id:b', 'id:b'], { A: 'G1', C: 'G2' }]] },

    { id: 11, name: 'whisker', kind: 'puzzle', world: 3, par: 1, unlocks: 'swapin', vertices: tri3,
      edges: [E('f', 'a', 'b'), E('k', 'a', 'b'), E('g', 'b', 'c'), E('x', 'a', 'c'), ID('b')],
      triangles: [T('G1', 'f', 'id:b', 'k'), T('G2', 'f', 'g', 'x')],
      tools: ['trip', 'flip', 'link'], kan: false,
      goal: { triangles: [['k', 'g', 'x']] },
      solution: [['trip', ['f', 'id:b', 'g'], { A: 'G1', D: 'G2' }]] },

    { id: 12, name: 'swap', kind: 'puzzle', world: 3, par: 1, vertices: [V('a', 20, 30), V('b', 80, 30)],
      edges: [E('f', 'a', 'b'), E('g', 'a', 'b'), ID('b')], triangles: [T('G1', 'f', 'id:b', 'g')],
      tools: ['trip', 'flip', 'link', 'swapin'], kan: false,
      goal: { triangles: [['id:a', 'f', 'g']] },
      solution: [['trip', ['id:a', 'f', 'id:b'], { A: 's0:f', B: 's1:f', C: 'G1' }]] },

    { id: 13, name: 'relay', kind: 'puzzle', world: 3, par: 4, vertices: tri3a,
      edges: [E('x0', 'a', 'c'), E('x1', 'a', 'c'), E('x2', 'a', 'c'), E('x3', 'a', 'c'), E('x4', 'a', 'c'),
        E('h', 'c', 'd'), E('z', 'a', 'd'), ID('c')],
      triangles: [T('G1', 'x1', 'id:c', 'x0'), T('G2', 'x2', 'id:c', 'x1'), T('G3', 'x3', 'id:c', 'x2'),
        T('G4', 'x1', 'id:c', 'x4'), T('G5', 'x0', 'h', 'z')],
      tools: ['flip', 'link', 'swapin'], kan: false,
      goal: { triangles: [['x3', 'h', 'z']] },
      solution: [['link', 'G3', 'G2'], ['link', 't1', 'G1'], ['flip', 't2'], ['swapin', 't3', 'G5']] },

    { id: 14, name: 'fourway', kind: 'boss', world: 3, par: 5, vertices: five(),
      edges: [E('f', 'a', 'b'), E('g', 'b', 'c'), E('h', 'c', 'd'), E('i', 'd', 'e'),
        E('x', 'a', 'c'), E('y', 'c', 'e'), E('u', 'b', 'e'), E('u2', 'b', 'e', 'u′'), E('s', 'a', 'e')],
      triangles: [T('G1', 'f', 'g', 'x'), T('G2', 'h', 'i', 'y'), T('G3', 'g', 'y', 'u'),
        T('G4', 'f', 'u', 's'), T('G5', 'g', 'y', 'u2')],
      tools: ['compose', 'trip', 'same'], kan: false,
      goal: { triangles: [['f', 'g', '?x'], ['?x', 'h', '?z'], ['?z', 'i', '?t'], ['?t', 'id:e', 's']] },
      solution: [['compose', 'x', 'h'], ['compose', 'e1', 'i'],
        ['trip', ['x', 'h', 'i'], { A: 't1', B: 'G2', C: 't2' }],
        ['trip', ['f', 'g', 'y'], { A: 'G1', B: 'G3', C: 't3' }],
        ['same', 't4', 'G4']] },

    // ---- World 4 (Solids): tetrahedra are facts, and four of them force a fifth. Inner horns Λ⁴ₖ. ----
    // goal.solids: patterns [d0, d1, d2, d3] of triangle refs or ?variables (a solid with those faces must exist).
    { id: 0, name: 'solidfact', kind: 'intro', world: 4, par: 1, vertices: tet4(),
      edges: tetFaces(),
      triangles: [T('G1', 'f', 'g', 'x'), T('G2', 'g', 'h', 'y'), T('G3', 'x', 'h', 'z')],
      tools: ['trip'], kan: false,
      goal: { solids: [['G2', 'G3', '?w', 'G1']] },
      solution: [['trip', ['f', 'g', 'h'], { A: 'G1', B: 'G2', C: 'G3' }]] },

    // the three degenerate solids of a triangle: s₀σ (corners 0,0,1,2), s₁σ (0,1,1,2), s₂σ (0,1,2,2).
    // Only s₂σ has d₂ = d₃ = σ.
    { id: 0, name: 'thicken', kind: 'intro', world: 4, par: 1, vertices: tri3,
      edges: [E('f', 'a', 'b'), E('g', 'b', 'c'), E('x', 'a', 'c')],
      triangles: [T('G1', 'f', 'g', 'x')],
      tools: [], kan: false,
      goal: { pick: 'S2:G1', ask: [{ solid: true, d2: 'G1', d3: 'G1' }] },
      solution: [['pick', 'S2:G1']] },

    // Δ⁴ as a pentagon: ten arrows, ten triangles, and four of its five solids (D2 is missing). One solid is a decoy.
    { id: 0, name: 'pentagon', kind: 'puzzle', world: 4, par: 1, maxCrossings: 5, vertices: pent5(),
      edges: pentEdges(), triangles: pentTriangles().concat([T('G11', 'j', 'h', 'm')]),
      tetras: [pentSolid('T1', ['G10', 'G9', 'G8', 'G7']), pentSolid('T2', ['G10', 'G6', 'G5', 'G4']),
        pentSolid('T3', ['G8', 'G5', 'G3', 'G1']), pentSolid('T4', ['G7', 'G4', 'G2', 'G1']),
        pentSolid('T5', ['G10', 'G6', 'G5', 'G11'])],
      tools: ['fill4'], kan: false,
      goal: { solids: [['G9', 'G6', 'G3', 'G2']] },
      solution: [['fill4', ['T1', 'T2', 'T3', 'T4']]] },

    // SM7 (2): Comp(f, g) is contractible, one level up from 'unique'.
    // Two different homotopies η, η′ : x ≃ y, and two solids with the same faces except d₁ = η, η′.
    // Goal: a homotopy between them. Proof: the 4-simplex on (a, b, c, c, c) with D4 = τ₁, D3 = τ₂, D2 = s₂σ₂, D0 = s₂(s₁g).
    { id: 0, name: 'twohomotopies', kind: 'puzzle', world: 4, par: 1, vertices: tri3,
      edges: [E('f', 'a', 'b'), E('g', 'b', 'c'), E('x', 'a', 'c'), E('y', 'a', 'c'), ID('c')],
      triangles: [T('G1', 'f', 'g', 'x'), T('G2', 'f', 'g', 'y'), T('G3', 'x', 'id:c', 'y'), T('G4', 'x', 'id:c', 'y'),
        { id: 's1:g', e01: 'g', e12: 'id:c', e02: 'g', kind: 'thin' }],
      tetras: [{ id: 'T1', faces: ['s1:g', 'G3', 'G2', 'G1'], missing: null, vertices: ['a', 'b', 'c', 'c'],
          edges: { '01': 'f', '12': 'g', '23': 'id:c', '02': 'x', '13': 'g', '03': 'y' } },
        { id: 'T2', faces: ['s1:g', 'G4', 'G2', 'G1'], missing: null, vertices: ['a', 'b', 'c', 'c'],
          edges: { '01': 'f', '12': 'g', '23': 'id:c', '02': 'x', '13': 'g', '03': 'y' } }],
      tools: ['fill4'], kan: false,
      goal: { solids: [['s0:id:c', 's1:y', 'G4', 'G3']] },
      solution: [['fill4', ['T1', 'T2', 'S2:G2', 'S2:s1:g'], 1]] },

    // Mac Lane's pentagon: three composites, four solids, one 4-horn. Par 8 is forced: three arrows (ad, be, ae) can only
    // come from Compose, each of the five solids costs one move, and Compose never makes a solid.
    { id: 0, name: 'pentagonproof', kind: 'boss', world: 4, par: 8, maxCrossings: 5, vertices: pent5(),
      edges: [E('f', 'a', 'b'), E('g', 'b', 'c'), E('h', 'c', 'd'), E('i', 'd', 'e'),
        E('j', 'a', 'c'), E('k', 'b', 'd'), E('l', 'c', 'e'), E('o0', 'a', 'e', 'o₀')],
      triangles: [T('G1', 'f', 'g', 'j'), T('G2', 'g', 'h', 'k'), T('G3', 'h', 'i', 'l')],
      tools: ['compose', 'trip', 'fill4'], kan: false,
      goal: { solids: [['G3', '?t134', '?t124', 'G2'], ['G3', '?t034', '?t024', '?t023'], ['?t124', '?t024', '?t014', 'G1'],
        ['G2', '?t023', '?t013', 'G1'], ['?t134', '?t034', '?t014', '?t013']] },
      solution: [['compose', 'j', 'h'], ['compose', 'k', 'i'], ['compose', 'e1', 'i'],
        ['trip', ['f', 'g', 'h'], { A: 'G1', B: 'G2', C: 't1' }],
        ['trip', ['g', 'h', 'i'], { A: 'G2', B: 'G3', C: 't2' }],
        ['trip', ['j', 'h', 'i'], { A: 't1', B: 'G3', C: 't3' }],
        ['trip', ['f', 'g', 'l'], { A: 'G1', B: 't5', C: 't6' }],
        ['fill4', ['T2', 'T3', 'T4', 'T1']]] },

    // ---- World 4: Undo everything ----
    { id: 15, name: 'undo', kind: 'intro', world: 5, par: 1, vertices: two,
      edges: [E('f', 'a', 'b')], triangles: [],
      tools: ['horn0'], kan: true,
      goal: { triangles: [['f', '?g', 'id:a']] },
      solution: [['horn0', 'f', 'id:a']] },

    { id: 16, name: 'divide', kind: 'intro', world: 5, par: 1, vertices: tri3,
      edges: [E('g', 'b', 'c'), E('h', 'a', 'c')], triangles: [],
      tools: ['horn2'], kan: true,
      goal: { triangles: [['?f', 'g', 'h']] },
      solution: [['horn2', 'g', 'h']] },

    { id: 17, name: 'inverses', kind: 'puzzle', world: 5, par: 3, vertices: two,
      edges: [E('f', 'a', 'b')], triangles: [],
      tools: ['horn0', 'horn2', 'trip'].concat(THM), kan: true,
      goal: { triangles: [['f', '?g', 'id:a'], ['?k', 'f', 'id:b'], ['?k', 'id:a', '?g']] },
      solution: [['horn0', 'f', 'id:a'], ['horn2', 'f', 'id:b'],
        ['trip', ['e2', 'f', 'e1'], { A: 't2', B: 't1' }]] },

    { id: 18, name: 'cancel', kind: 'puzzle', world: 5, par: 3, vertices: tet4(),
      edges: [E('f', 'a', 'b'), E('k', 'a', 'b'), E('g', 'b', 'c'), E('h', 'c', 'd'),
        E('p', 'a', 'c'), E('q', 'a', 'c'), E('x', 'a', 'd')],
      triangles: [T('G1', 'f', 'g', 'p'), T('G2', 'k', 'g', 'q'), T('G3', 'p', 'h', 'x'), T('G4', 'q', 'h', 'x')],
      tools: ['trip'].concat(THM, ['horn0', 'horn2']), kan: true,
      goal: { triangles: [['f', 'id:b', 'k']] },
      solution: [['trip', ['p', 'id:c', 'h'], { C: 'G4', D: 'G3' }], ['swapin', 't1', 'G1'],
        ['trip', ['f', 'id:b', 'g'], { C: 'G2', D: 't2' }]] },

    { id: 19, name: 'socks', kind: 'boss', world: 5, par: 4, vertices: row3,
      edges: [E('f', 'a', 'b'), E('g', 'b', 'c'), E('p', 'b', 'a', 'f\u0304'), E('q', 'c', 'b', 'g\u0304'),
        E('q1', 'c', 'b', 'g\u0304′'), E('q2', 'c', 'b', 'g\u0304″'), E('w', 'c', 'a'), ID('a'), ID('b')],
      triangles: [T('G1', 'f', 'p', 'id:a'), T('G2', 'g', 'q1', 'id:b'), T('G3', 'g', 'q2', 'id:b'),
        T('G4', 'q', 'p', 'w'), T('G5', 'q1', 'id:b', 'q')],
      tools: ['compose', 'trip', 'flip', 'link', 'swapin'], kan: false,
      goal: { triangles: [['f', 'g', '?x'], ['?x', 'w', 'id:a']] },
      solution: [['compose', 'f', 'g'], ['swapin', 'G5', 'G2'],
        ['trip', ['f', 'g', 'q'], { A: 't1', B: 't2' }],
        ['trip', ['e1', 'q', 'p'], { A: 't3', B: 'G4', C: 'G1' }]] },

    // ---- World 6 (Subcategories): select puzzles. goal.select = { edges: answer, seeds, prompt }. ----
    { id: 0, name: 'fullsub', kind: 'intro', world: 6, par: 1, vertices: tri3,
      edges: [E('f', 'a', 'b'), E('g', 'b', 'c'), E('h', 'a', 'c'), E('h2', 'a', 'c', 'h′'), E('k', 'c', 'a'), E('p', 'c', 'b'), E('q', 'b', 'a')],
      triangles: [], tools: [], kan: false,
      goal: { select: { edges: ['h', 'h2', 'k'], seeds: [], prompt: 'fullsub', dots: ['a', 'c'] } },
      solution: [['select', ['h', 'h2', 'k']]] },

    { id: 0, name: 'subcat', kind: 'puzzle', world: 6, par: 1, vertices: tet4(),
      edges: [E('f', 'a', 'b'), E('g', 'b', 'c'), E('x', 'a', 'c'), E('x2', 'a', 'c', 'x′'), E('w', 'a', 'c'), E('h', 'a', 'c'), E('k', 'c', 'd'), ID('c')],
      triangles: [T('G1', 'f', 'g', 'x'), T('G2', 'f', 'g', 'x2'), T('G3', 'x2', 'id:c', 'w')],
      tools: [], kan: false,
      goal: { select: { edges: ['f', 'g', 'x', 'x2', 'w'], seeds: ['f', 'g'], prompt: 'subcat' } },
      solution: [['select', ['f', 'g', 'x', 'x2', 'w']]] },

    { id: 0, name: 'subcat2', kind: 'puzzle', world: 6, par: 1, vertices: tet4(),
      edges: [E('f', 'a', 'b'), E('g', 'b', 'c'), E('p', 'c', 'd'), E('q', 'c', 'd', 'q'), E('x', 'a', 'c'), E('x2', 'a', 'c', 'x′'),
        E('s', 'b', 'd'), E('t', 'b', 'd'), E('r', 'a', 'd'), E('y', 'a', 'd'), ID('c')],
      triangles: [T('G1', 'f', 'g', 'x'), T('G2', 'x', 'id:c', 'x2'), T('G3', 'x2', 'p', 'r'), T('G4', 'g', 'p', 's'),
        T('G5', 'f', 's', 'y'), T('G6', 'g', 'q', 't')],
      tools: [], kan: false,
      goal: { select: { edges: ['f', 'g', 'p', 'x', 'x2', 'r', 's', 'y'], seeds: ['f', 'g', 'p'], prompt: 'subcat2' } },
      solution: [['select', ['f', 'g', 'p', 'x', 'x2', 'r', 's', 'y']]] },

    { id: 0, name: 'core', kind: 'boss', world: 6, par: 1, vertices: tet4(),
      edges: [E('i', 'a', 'b'), E('j', 'b', 'a'), E('i2', 'a', 'b', 'i′'), E('k', 'b', 'a', 'k'), E('m', 'b', 'c'), E('n', 'c', 'b'),
        E('x', 'a', 'c'), E('r', 'c', 'd'), E('s', 'd', 'c'), ID('a'), ID('b'), ID('c')],
      triangles: [T('G1', 'i', 'j', 'id:a'), T('G2', 'j', 'i', 'id:b'), T('G3', 'i', 'id:b', 'i2'),
        T('G4', 'm', 'n', 'id:b'), T('G5', 'n', 'm', 'id:c'), T('G6', 'i', 'm', 'x'),
        T('G7', 'r', 's', 'id:c'), T('G8', 'i', 'k', 'id:a')],
      tools: [], kan: false,
      goal: { select: { edges: ['i', 'j', 'i2', 'k', 'm', 'n', 'x'], seeds: [], prompt: 'core' } },
      solution: [['select', ['i', 'j', 'i2', 'k', 'm', 'n', 'x']]] },

    // ---- World 5: Nerves of categories (strict composition tables) ----
    { id: 20, name: 'nerve', kind: 'intro', world: 7, par: 1, vertices: tri3,
      edges: hollow(), triangles: [],
      strict: true, table: { 'f,g': 'h' },
      tools: ['compose'], kan: false,
      goal: { triangles: [['f', 'g', 'h']] },
      solution: [['compose', 'f', 'g']] },

    { id: 21, name: 'onlyone', kind: 'intro', world: 7, par: 2, vertices: tri3,
      edges: hollow(), triangles: [],
      strict: true, table: { 'f,g': 'h' },
      tools: ['compose'], kan: false,
      goal: { triangles: [['f', 'g', 'h']], flag: 'uniqueRefused' },
      solution: [['compose', 'f', 'g'], ['!', 'compose', 'f', 'g']] },

    { id: 22, name: 'nerve3', kind: 'puzzle', world: 7, par: 4, vertices: tet4(),
      edges: [E('f', 'a', 'b'), E('g', 'b', 'c'), E('h', 'c', 'd'),
        E('p', 'a', 'c', 'gf'), E('q', 'b', 'd', 'hg'), E('r', 'a', 'd', 'hgf'), E('s', 'a', 'd')],
      triangles: [],
      strict: true, table: { 'f,g': 'p', 'g,h': 'q', 'p,h': 'r' }, blanks: [['f', 'q']],
      tools: ['compose', 'trip'], kan: false,
      goal: { triangles: [['f', 'q', 'r']], min: { tetras: 1 } },
      solution: [['compose', 'f', 'g'], ['compose', 'g', 'h'], ['compose', 'p', 'h'], ['trip', ['f', 'g', 'h'], {}]] },

    // ---- World 6: Bones ----,

    // "nerve or not?": decide, and back a "no" with a pair of arrows that has no composite or two
    { id: 0, name: 'segalno', kind: 'intro', world: 7, par: 1, vertices: tri3,
      edges: [E('f', 'a', 'b'), E('g', 'b', 'c')], triangles: [],
      tools: ['witness', 'isNerve'], kan: false,
      goal: { flag: 'verdict' },
      solution: [['witness', 'f', 'g']] },

    { id: 0, name: 'segalyes', kind: 'puzzle', world: 7, par: 1, vertices: tri3,
      edges: hollow(), triangles: [T('G1', 'f', 'g', 'h')],
      tools: ['witness', 'isNerve'], kan: false,
      goal: { flag: 'verdict' },
      solution: [['isNerve']] },

    { id: 0, name: 'twofill', kind: 'puzzle', world: 7, par: 1, vertices: tri3,
      edges: [E('f', 'a', 'b'), E('g', 'b', 'c'), E('x', 'a', 'c'), E('x2', 'a', 'c', 'x′')],
      triangles: [T('G1', 'f', 'g', 'x'), T('G2', 'f', 'g', 'x2')],
      tools: ['witness', 'isNerve'], kan: false,
      goal: { flag: 'verdict' },
      solution: [['witness', 'f', 'g']] },

    { id: 0, name: 'hiddenhole', kind: 'puzzle', world: 7, par: 1, vertices: tet4(),
      edges: tetFaces(),
      triangles: [T('G1', 'f', 'g', 'x'), T('G2', 'g', 'h', 'y'), T('G3', 'x', 'h', 'z')],
      tools: ['witness', 'isNerve'], kan: false,
      goal: { flag: 'verdict' },
      solution: [['witness', 'f', 'y']] },

    { id: 0, name: 'quotient', kind: 'puzzle', world: 7, par: 1, vertices: [V('s', 24, 30, 'p'), V('c', 76, 30)],
      edges: [E('e', 's', 'c'), E('e2', 's', 'c', 'e′'), ID('s')],
      triangles: [T('G1', 'id:s', 'e', 'e2')],
      tools: ['witness', 'isNerve'], kan: false,
      goal: { flag: 'verdict' },
      solution: [['witness', 'id:s', 'e']] },

    // ---- World 6: Bones ----
    { id: 23, name: 'disc', kind: 'intro', world: 8, par: 4, vertices: tri3,
      edges: [], triangles: [],
      tools: ['addEdge', 'cell2'], kan: false,
      goal: { counts: { edges: 3, triangles: 1 } },
      solution: [['addEdge', 'a', 'b'], ['addEdge', 'b', 'c'], ['addEdge', 'a', 'c'], ['cell2', ['e1', 'e2', 'e3']]] },

    { id: 24, name: 'sphere', kind: 'puzzle', world: 8, par: 2, vertices: tri3,
      edges: hollow(), triangles: [],
      tools: ['cell2'], kan: false,
      goal: { counts: { triangles: 2 } },
      solution: [['cell2', ['f', 'g', 'h']], ['cell2', ['f', 'g', 'h']]] },

    { id: 25, name: 'peel', kind: 'puzzle', world: 8, par: 3, vertices: tet4(),
      edges: tetFaces(),
      triangles: [T('G1', 'f', 'g', 'x'), T('G2', 'g', 'h', 'y'), T('G3', 'x', 'h', 'z'), T('G4', 'f', 'y', 'z')],
      tetras: [{ id: 'T1', faces: ['G2', 'G3', 'G4', 'G1'], missing: null,
        vertices: ['a', 'b', 'c', 'd'],
        edges: { '01': 'f', '12': 'g', '23': 'h', '02': 'x', '13': 'y', '03': 'z' } }],
      tools: ['peel', 'cell2'], kan: false,
      goal: { counts: { tetras: 0, triangles: 1, edges: 6 } },
      solution: [['peel'], ['peel'], ['cell2', ['f', 'g', 'x']]] },

    { id: 0, name: 'hollowtet', kind: 'puzzle', world: 8, par: 4, vertices: tet4(),
      edges: tetFaces(), triangles: [],
      tools: ['cell2'], kan: false,
      goal: { triangles: [['f', 'g', 'x'], ['g', 'h', 'y'], ['x', 'h', 'z'], ['f', 'y', 'z']], counts: { tetras: 0 } },
      solution: [['cell2', ['f', 'g', 'x']], ['cell2', ['g', 'h', 'y']], ['cell2', ['x', 'h', 'z']], ['cell2', ['f', 'y', 'z']]] },

    { id: 0, name: 'ball', kind: 'puzzle', world: 8, par: 5, vertices: tet4(),
      edges: tetFaces(), triangles: [],
      tools: ['cell2', 'cell3'], kan: false,
      goal: { counts: { triangles: 4, tetras: 1 } },
      solution: [['cell2', ['f', 'g', 'x']], ['cell2', ['g', 'h', 'y']], ['cell2', ['x', 'h', 'z']], ['cell2', ['f', 'y', 'z']],
        ['cell3', ['t1', 't2', 't3', 't4']]] },

    { id: 0, name: 'fillin', kind: 'intro', world: 8, par: 1, vertices: tri3,
      edges: hollow(), triangles: [],
      tools: ['cosk'], kan: false,
      goal: { triangles: [['f', 'g', 'h']] },
      solution: [['cosk']] },

    { id: 0, name: 'rebuild', kind: 'puzzle', world: 8, par: 2, vertices: tet4(),
      edges: tetFaces(), triangles: [],
      tools: ['cosk', 'peel', 'cell2'], kan: false,
      goal: { counts: { tetras: 0, triangles: 4, edges: 6 } },
      solution: [['cosk'], ['peel']] },

    // ---- World 7: Possible or not? ----,

    // ---- World 7: Possible or not? ----
    { id: 26, name: 'spine', kind: 'puzzle', world: 9, par: 4, claimable: true, vertices: tet4(),
      edges: rowEdges(), triangles: [],
      tools: ['compose', 'trip'], kan: false,
      goal: { triangles: assocGoal, min: { tetras: 1 } },
      solution: assocSol },

    { id: 27, name: 'nofill', kind: 'puzzle', world: 9, par: 1, claimable: true, vertices: tri3,
      edges: hollow(), triangles: [],
      tools: ['compose', 'trip'], kan: false,
      
      goal: { triangles: [['f', 'g', 'h']], impossible: true },
      solution: [['claim', { model: 'triangle', paint: { vertices: {"a":"0","b":"1","c":"2"}, edges: {"f":"f","g":"g","h":"h"} } }]] },

    { id: 28, name: 'squarehole', kind: 'puzzle', world: 9, par: 1, claimable: true, vertices: sq4,
      edges: [E('f', 'a', 'b'), E('g', 'b', 'd'), E('u', 'a', 'c'), E('v', 'c', 'd')], triangles: [],
      tools: ['compose', 'trip'].concat(THM), kan: false,
      
      goal: { triangles: [['f', 'g', '?x'], ['u', 'v', '?x']], impossible: true },
      solution: [['claim', { model: 'square', paint: { vertices: {"a":"0","b":"1","c":"2","d":"3"}, edges: {"f":"f","g":"g","u":"u","v":"v"} } }]] },

    { id: 29, name: 'parallel', kind: 'puzzle', world: 9, par: 1, claimable: true, vertices: two,
      edges: [E('f', 'a', 'b'), E('g', 'a', 'b')], triangles: [],
      tools: ['compose', 'trip'].concat(THM), kan: false,
      
      goal: { triangles: [['f', 'id:b', 'g']], impossible: true },
      solution: [['claim', { model: 'parallel', paint: { vertices: {"a":"0","b":"1"}, edges: {"f":"p","g":"q"} } }]] },

    { id: 30, name: 'almostring', kind: 'puzzle', world: 9, par: 3, claimable: true, vertices: tri3,
      edges: [E('f', 'a', 'b'), E('g', 'b', 'c'), E('h', 'a', 'c'), E('x', 'a', 'c'), E('m', 'a', 'c'), ID('c')],
      triangles: [T('G1', 'f', 'g', 'x'), T('G2', 'x', 'id:c', 'm'), T('G3', 'h', 'id:c', 'm')],
      tools: ['compose', 'trip'].concat(THM), kan: false,
      goal: { triangles: [['f', 'g', 'h']] },
      solution: [['swapin', 'G2', 'G1'], ['flip', 'G3'], ['swapin', 't2', 't1']] },

    { id: 31, name: 'wedge', kind: 'puzzle', world: 9, par: 4, claimable: true, vertices: five2(),
      edges: [E('f', 'a', 'b'), E('g', 'b', 'c'), E('h', 'c', 'd'), E('i', 'd', 'e'),
        E('x', 'a', 'c'), E('z', 'a', 'd'), E('t', 'a', 'e')],
      triangles: [T('G1', 'f', 'g', 'x'), T('G2', 'x', 'h', 'z'), T('G3', 'z', 'i', 't')],
      tools: ['compose', 'trip'], kan: false,
      goal: { triangles: [['g', 'h', '?y'], ['f', '?y', 'z'], ['h', 'i', '?w'], ['x', '?w', 't']] },
      solution: [['compose', 'g', 'h'], ['trip', ['f', 'g', 'h'], { A: 'G1', B: 't1', C: 'G2' }],
        ['compose', 'h', 'i'], ['trip', ['x', 'h', 'i'], { A: 'G2', B: 't3', C: 'G3' }]] },

    { id: 0, name: 'halfspine', kind: 'puzzle', world: 9, par: 3, claimable: true, vertices: tet4(),
      edges: [E('f', 'a', 'b'), E('g', 'b', 'c'), E('h', 'c', 'd'), E('y', 'b', 'd')],
      triangles: [T('G1', 'g', 'h', 'y')],
      tools: ['compose', 'trip'], kan: false,
      goal: { triangles: [['f', 'g', '?x'], ['f', 'y', '?z'], ['?x', 'h', '?z']], min: { tetras: 1 } },
      solution: [['compose', 'f', 'g'], ['compose', 'f', 'y'], ['trip', ['f', 'g', 'h'], { A: 't1', B: 'G1', D: 't2' }]] },

    { id: 0, name: 'opensquare', kind: 'puzzle', world: 9, par: 1, claimable: true, vertices: sq4,
      edges: [E('f', 'a', 'b'), E('v', 'b', 'd'), E('u', 'a', 'c')], triangles: [],
      tools: ['compose', 'trip'].concat(THM), kan: false,
      goal: { triangles: [['f', 'v', '?x'], ['u', '?w', '?x']], impossible: true },
      solution: [['claim', { model: 'vee', paint: { vertices: {"a":"0","b":"1","c":"2","d":"3"}, edges: {"f":"f","v":"v","u":"u"} } }]] },

    { id: 32, name: 'square', kind: 'boss', world: 9, par: 5, claimable: true, vertices: sq5(),
      edges: [E('f', 'a', 'b'), E('v', 'b', 'd'), E('u', 'a', 'c'), E('t', 'd', 'e'), E('w0', 'c', 'd'), E('t2', 'd', 'e', 't′')],
      triangles: [],
      tools: ['compose', 'horn0', 'horn2', 'trip'], kan: true,
      goal: { triangles: [['f', 'v', '?x'], ['u', '?w', '?x'], ['?w', 't', '?r'], ['?x', 't', '?y'], ['u', '?r', '?y']] },
      solution: [['compose', 'f', 'v'], ['horn0', 'u', 'e1'], ['compose', 'e2', 't'], ['compose', 'e1', 't'],
        ['trip', ['u', 'e2', 't'], { A: 't2', B: 't3', C: 't4' }]] },

    // ---- World 8: Lifting (left fibrations). licence: which horns the map p: X -> S lifts. ----
    { id: 0, name: 'liftpath', kind: 'intro', world: 10, par: 3, licence: 'left',
      vertices: [V('x', 16, 40)], edges: [], triangles: [],
      base: chainBase(), proj: { x: 'S.a' },
      tools: ['liftEdge', 'compose'], kan: false,
      goal: { triangles: [['?f', '?g', '?k', 'S.t1']] },
      solution: [['liftEdge', 'x', 0], ['liftEdge', 'v1', 0], ['compose', 'e1', 'e2']] },

    { id: 0, name: 'backfill', kind: 'puzzle', world: 10, par: 1, claimable: true, licence: 'left',
      vertices: [V('x', 16, 40), V('y', 50, 12), V('z', 84, 40)],
      edges: [E('g', 'y', 'z'), E('k', 'x', 'z')], triangles: [],
      base: chainBase(), proj: { x: 'S.a', y: 'S.b', z: 'S.c', g: 'S.g', k: 'S.x' },
      tools: ['liftEdge', 'compose', 'horn0', 'trip'], kan: false,
      reasons: ['freshend', 'hole', 'unrelated'],
      goal: { triangles: [['?f', 'g', 'k', 'S.t1']], impossible: true },
      solution: [['claim', 'freshend']] },

    { id: 0, name: 'prism', kind: 'puzzle', world: 10, par: 2, licence: 'left',
      vertices: [V('a', 18, 10), V('b', 82, 10), V('c', 18, 46), V('d', 82, 46)],
      edges: [E('f', 'a', 'b'), E('v', 'b', 'd'), E('u', 'a', 'c')], triangles: [],
      base: { vertices: [V('S.a', 18, 10, 'a' + BAR), V('S.b', 82, 10, 'b' + BAR), V('S.c', 18, 46, 'c' + BAR), V('S.d', 82, 46, 'd' + BAR)],
        edges: [SE('f', 'a', 'b'), SE('v', 'b', 'd'), SE('u', 'a', 'c'), SE('w', 'c', 'd'), SE('x', 'a', 'd')],
        triangles: [ST('t1', 'f', 'v', 'x'), ST('t2', 'u', 'w', 'x')] },
      proj: { a: 'S.a', b: 'S.b', c: 'S.c', d: 'S.d', f: 'S.f', v: 'S.v', u: 'S.u' },
      tools: ['liftEdge', 'compose', 'horn0', 'trip'], kan: false,
      goal: { triangles: [['f', 'v', '?x'], ['u', '?w', '?x', 'S.t2']] },
      solution: [['compose', 'f', 'v'], ['horn0', 'u', 'e1']] },

    { id: 0, name: 'inneronly', kind: 'puzzle', world: 10, par: 1, claimable: true, licence: 'inner',
      vertices: [V('x', 24, 30), V('y', 76, 30)],
      edges: [E('f', 'x', 'y')], triangles: [],
      base: isoBase(), proj: { x: 'S.x', y: 'S.y', f: 'S.f' },
      tools: ['compose', 'horn0', 'trip'], kan: false,
      reasons: ['licence', 'hole', 'unrelated'],
      goal: { triangles: [['f', '?g', 'id:x']], impossible: true },
      solution: [['claim', 'licence']] },

    { id: 0, name: 'conservative', kind: 'puzzle', world: 10, par: 2, licence: 'left',
      vertices: [V('x', 24, 30), V('y', 76, 30)],
      edges: [E('f', 'x', 'y')], triangles: [],
      base: isoBase(), proj: { x: 'S.x', y: 'S.y', f: 'S.f' },
      tools: ['liftEdge', 'compose', 'horn0', 'trip', 'flip', 'swapin'], kan: false,
      goal: { triangles: [['f', '?g', 'id:x'], ['?g', 'f', 'id:y']] },
      solution: [['horn0', 'f', 'id:x'], ['trip', ['f', 'e1', 'f'], { A: 't1', C: 's0:f', D: 's1:f' }]] },

    { id: 0, name: 'twolifts', kind: 'boss', world: 10, par: 4, licence: 'left',
      vertices: [V('x', 12, 38), V('y', 40, 10), V('z', 66, 30), V('z2', 94, 54, 'z′')],
      edges: [E('f', 'x', 'y'), E('g', 'y', 'z'), E('k2', 'x', 'z2', 'k′'), E('q', 'z2', 'z')], triangles: [],
      base: chainBase(), proj: { x: 'S.a', y: 'S.b', z: 'S.c', z2: 'S.c', f: 'S.f', g: 'S.g', k2: 'S.x', q: 'id:S.c' },
      tools: ['liftEdge', 'compose', 'horn0', 'trip', 'flip', 'swapin'], kan: false,
      goal: { triangles: [['f', 'g', '?k'], ['?k', '?m', 'k2'], ['?m', '?n', 'id:z'], ['?n', '?m', 'id:z2']] },
      solution: [['compose', 'f', 'g'], ['horn0', 'e1', 'k2'], ['horn0', 'e2', 'id:z'],
        ['trip', ['e2', 'e3', 'e2'], { A: 't3', C: 's0:e2', D: 's1:e2' }]] },

    // ---- World 9: The licence ----
    { id: 38, name: 'oneway', kind: 'puzzle', world: 11, par: 1, claimable: true, vertices: two,
      edges: [E('f', 'a', 'b')], triangles: [],
      tools: ['compose', 'trip'], kan: false,
      
      goal: { triangles: [['f', '?g', 'id:a']], impossible: true },
      solution: [['claim', { model: 'arrow', paint: { vertices: {"a":"0","b":"1"}, edges: {"f":"u"} } }]] },

    { id: 39, name: 'nocancel', kind: 'puzzle', world: 11, par: 1, claimable: true, vertices: tri3,
      edges: cancelEdges(false),
      triangles: [T('G1', 'f', 'g', 'x'), T('G2', 'k', 'g', 'x')],
      tools: ['trip'].concat(THM), kan: false,
      
      goal: { triangles: [['f', 'id:b', 'k']], impossible: true },
      solution: [['claim', { model: 'fork', paint: { vertices: {"a":"0","b":"1","c":"2"}, edges: {"f":"p","k":"q","g":"g","x":"x"} } }]] },

    { id: 40, name: 'backpath', kind: 'puzzle', world: 11, par: 1, claimable: true, vertices: two,
      edges: [E('f', 'a', 'b'), E('g', 'b', 'a'), ID('a')],
      triangles: [T('G1', 'f', 'g', 'id:a')],
      tools: ['compose', 'trip'].concat(THM), kan: false,
      
      goal: { triangles: [['g', 'f', 'id:b']], impossible: true },
      solution: [['claim', { model: 'retract', paint: { vertices: {"a":"0","b":"1"}, edges: {"f":"i","g":"r"} } }]] },

    { id: 0, name: 'idem', kind: 'puzzle', world: 11, par: 3, claimable: true, vertices: two,
      edges: [E('f', 'a', 'b'), E('g', 'b', 'a'), ID('a')],
      triangles: [T('G1', 'f', 'g', 'id:a')],
      tools: ['compose', 'trip'].concat(THM), kan: false,
      goal: { triangles: [['g', 'f', '?e'], ['?e', '?e', '?e']] },
      solution: [['compose', 'g', 'f'], ['trip', ['g', 'f', 'g'], { A: 't1', B: 'G1', D: 's1:g' }],
        ['trip', ['e1', 'g', 'f'], { A: 't2', B: 't1', C: 't1' }]] },

    { id: 41, name: 'detour', kind: 'puzzle', world: 11, par: 2, claimable: true, vertices: tri3,
      edges: [E('f', 'a', 'b', 'f', { iso: true }), E('g', 'b', 'a'), ID('a'), E('h', 'a', 'c')],
      triangles: [T('G1', 'f', 'g', 'id:a')],
      tools: ['compose', 'trip'].concat(THM), kan: false,
      goal: { triangles: [['f', '?w', 'h']] },
      solution: [['compose', 'g', 'h'], ['trip', ['f', 'g', 'h'], { A: 'G1', B: 't1' }]] },

    { id: 42, name: 'mono', kind: 'puzzle', world: 11, par: 3, claimable: true, vertices: tri3,
      edges: [E('f', 'a', 'b'), E('k', 'a', 'b'), E('g', 'b', 'c', 'g', { iso: true }),
        E('x', 'a', 'c'), E('x2', 'a', 'c', 'x′'), E('m', 'a', 'c'), ID('c')],
      triangles: [T('G1', 'f', 'g', 'x'), T('G2', 'k', 'g', 'x2'), T('G3', 'x', 'id:c', 'm'), T('G4', 'x2', 'id:c', 'm')],
      joyal: true,
      tools: ['trip', 'flip', 'link', 'swapin'], kan: false,
      goal: { triangles: [['f', 'id:b', 'k']] },
      solution: [['swapin', 'G3', 'G1'], ['swapin', 'G4', 'G2'], ['trip', ['f', 'id:b', 'g'], { C: 't2', D: 't1' }]] },

    { id: 43, name: 'twosided', kind: 'boss', world: 11, par: 4, claimable: true, vertices: two,
      edges: [E('f', 'a', 'b'), E('g', 'b', 'a'), E('g3', 'b', 'a', 'g′'), E('g2', 'b', 'a', 'g″'),
        E('k', 'b', 'a'), E('k2', 'b', 'a', 'k′'), ID('a'), ID('b')],
      triangles: [T('G1', 'f', 'g', 'id:a'), T('G2', 'k', 'f', 'id:b'), T('G3', 'g', 'id:a', 'g3'),
        T('G4', 'g3', 'id:a', 'g2'), T('G5', 'k2', 'f', 'id:b')],
      tools: ['trip', 'link', 'swapin'], kan: false,
      goal: { triangles: [['g2', 'f', 'id:b']] },
      solution: [['trip', ['k', 'f', 'g'], { A: 'G2', B: 'G1' }], ['link', 't1', 'G3'], ['link', 't2', 'G4'],
        ['swapin', 't3', 'G2']] },

    { id: 44, name: 'joyal', kind: 'boss', world: 11, par: 4, claimable: true, vertices: two,
      edges: [E('f', 'a', 'b', 'f', { iso: true }), E('h', 'a', 'b', 'h')], triangles: [],
      joyal: true,
      tools: ['horn0', 'horn2', 'trip', 'flip', 'swapin'], kan: false,
      goal: { triangles: [['f', '?g', 'id:a'], ['?k', 'f', 'id:b'], ['?k', 'id:a', '?g'], ['?g', 'f', 'id:b']] },
      solution: [['horn0', 'f', 'id:a'], ['horn2', 'f', 'id:b'], ['trip', ['e2', 'f', 'e1'], { A: 't2', B: 't1' }],
        ['swapin', 't3', 't2']] },

    // ---- World 10: Squares (natural transformations). From the course notes: Fun(Δ¹, C), composites of
    //      equivalences, and "a natural transformation with invertible components is invertible". ----
    { id: 45, name: 'natsq', kind: 'intro', world: 12, par: 1, vertices: [V('a', 18, 12), V('b', 82, 12), V('a2', 18, 48, 'a′'), V('b2', 82, 48, 'b′')],
      edges: [E('f', 'a', 'b'), E('be', 'b', 'b2', 'β'), E('al', 'a', 'a2', 'α'), E('f2', 'a2', 'b2', 'f′'),
        E('d', 'a', 'b2'), E('d2', 'a', 'b2', 'd′'), ID('b2')],
      triangles: [T('G1', 'f', 'be', 'd'), T('G2', 'al', 'f2', 'd2'), T('G3', 'd', 'id:b2', 'd2')],
      tools: ['flip', 'link', 'swapin'], kan: false,
      goal: { triangles: [['f', 'be', '?x'], ['al', 'f2', '?x']] },
      solution: [['swapin', 'G3', 'G1']] },

    { id: 46, name: 'moveacross', kind: 'puzzle', world: 12, par: 1, unlocks: 'divide',
      vertices: [V('a', 14, 44), V('a2', 50, 12, 'a′'), V('c', 86, 44)],
      edges: [E('al', 'a', 'a2', 'α', { iso: true }), E('ali', 'a2', 'a', 'ᾱ'), E('p', 'a2', 'c'), E('q', 'a', 'c'), ID('a'), ID('a2')],
      triangles: [T('G1', 'ali', 'al', 'id:a2'), T('G2', 'al', 'p', 'q'), T('G3', 'al', 'ali', 'id:a')],
      tools: ['trip'], kan: false,
      goal: { triangles: [['ali', 'q', 'p']] },
      solution: [['trip', ['ali', 'al', 'p'], { A: 'G1', B: 'G2', C: 's0:p' }]] },

    { id: 47, name: 'acrossagain', kind: 'puzzle', world: 12, par: 2,
      vertices: [V('a', 14, 44), V('b', 50, 12), V('b2', 86, 44, 'b′')],
      edges: [E('p', 'a', 'b'), E('be', 'b', 'b2', 'β', { iso: true }), E('bei', 'b2', 'b', 'β̄'), E('q', 'a', 'b2'), E('q2', 'a', 'b2', 'q′'), ID('b'), ID('b2')],
      triangles: [T('G1', 'be', 'bei', 'id:b'), T('G2', 'bei', 'be', 'id:b2'), T('G3', 'p', 'be', 'q'), T('G4', 'q2', 'id:b2', 'q')],
      tools: ['trip', 'divide', 'flip', 'link', 'swapin'], kan: false,
      goal: { triangles: [['q2', 'bei', 'p']] },
      solution: [['divide', 'G1', 'G3'], ['trip', ['q2', 'id:b2', 'bei'], { A: 'G4', B: 's0:bei', C: 't1' }]] },

    { id: 48, name: 'sqpaste', kind: 'puzzle', world: 12, par: 4, maxCrossings: 1,
      vertices: [V('a', 14, 8), V('b', 86, 8), V('a2', 30, 30, 'a′'), V('b2', 70, 30, 'b′'), V('a3', 14, 52, 'a″'), V('b3', 86, 52, 'b″')],
      edges: [E('f', 'a', 'b'), E('f2', 'a2', 'b2', 'f′'), E('f3', 'a3', 'b3', 'f″'),
        E('al', 'a', 'a2', 'α'), E('be', 'b', 'b2', 'β'), E('al2', 'a2', 'a3', 'α′'), E('be2', 'b2', 'b3', 'β′'),
        E('d', 'a', 'b2'), E('d2', 'a2', 'b3', 'd′'), E('A', 'a', 'a3'), E('B', 'b', 'b3')],
      triangles: [T('G1', 'f', 'be', 'd'), T('G2', 'al', 'f2', 'd'), T('G3', 'f2', 'be2', 'd2'), T('G4', 'al2', 'f3', 'd2'),
        T('G5', 'al', 'al2', 'A'), T('G6', 'be', 'be2', 'B')],
      tools: ['compose', 'trip', 'same', 'flip', 'link', 'swapin'], kan: false,
      goal: { triangles: [['f', 'B', '?D'], ['A', 'f3', '?D']] },
      solution: [['compose', 'f', 'B'], ['trip', ['f', 'be', 'be2'], { A: 'G1', B: 'G6', D: 't1' }],
        ['trip', ['al', 'f2', 'be2'], { A: 'G2', B: 'G3', C: 't2' }], ['trip', ['al', 'al2', 'f3'], { A: 'G5', B: 'G4', D: 't3' }]] },

    { id: 49, name: 'isocomp', kind: 'boss', world: 12, par: 5,
      vertices: [V('a', 12, 46), V('b', 50, 10), V('c', 88, 46)],
      edges: [E('f', 'a', 'b', 'f', { iso: true }), E('g', 'b', 'c', 'g', { iso: true }), E('fi', 'b', 'a', 'f̄'), E('gi', 'c', 'b', 'ḡ'),
        E('x', 'a', 'c'), E('h', 'c', 'a'), ID('a'), ID('b'), ID('c')],
      triangles: [T('G1', 'f', 'fi', 'id:a'), T('G2', 'fi', 'f', 'id:b'), T('G3', 'g', 'gi', 'id:b'), T('G4', 'gi', 'g', 'id:c'), T('G5', 'f', 'g', 'x')],
      tools: ['compose', 'trip', 'divide', 'flip', 'link', 'swapin'], kan: false,
      goal: { triangles: [['gi', 'fi', '?w'], ['x', '?w', 'id:a'], ['?w', 'x', 'id:c']] },
      solution: [['compose', 'gi', 'fi'], ['divide', 'G3', 'G5'], ['trip', ['x', 'gi', 'fi'], { A: 't2', B: 't1', C: 'G1' }],
        ['divide', 'G2', 't1'], ['trip', ['e1', 'f', 'g'], { A: 't4', B: 'G5', C: 'G4' }]] },

    { id: 50, name: 'natiso', kind: 'boss', world: 12, par: 4, maxCrossings: 1, vertices: [V('a', 18, 12), V('b', 82, 12), V('a2', 18, 48, 'a′'), V('b2', 82, 48, 'b′')],
      edges: [E('f', 'a', 'b'), E('f2', 'a2', 'b2', 'f′'), E('al', 'a', 'a2', 'α', { iso: true }), E('be', 'b', 'b2', 'β', { iso: true }),
        E('ali', 'a2', 'a', 'ᾱ'), E('bei', 'b2', 'b', 'β̄'), E('d', 'a', 'b2'), ID('a'), ID('a2'), ID('b'), ID('b2')],
      triangles: [T('G1', 'ali', 'al', 'id:a2'), T('G2', 'be', 'bei', 'id:b'), T('G3', 'f', 'be', 'd'), T('G4', 'al', 'f2', 'd'),
        T('G5', 'al', 'ali', 'id:a'), T('G6', 'bei', 'be', 'id:b2')],
      tools: ['compose', 'trip', 'divide', 'flip', 'link', 'swapin'], kan: false,
      goal: { triangles: [['ali', 'f', '?e'], ['f2', 'bei', '?e']] },
      solution: [['compose', 'ali', 'f'], ['divide', 'G1', 'G4'], ['trip', ['ali', 'f', 'be'], { A: 't1', B: 'G3', D: 't2' }],
        ['divide', 'G2', 't3']] },

    // ---- World 11: Sandbox ----
    { id: 51, name: 'sandbox', kind: 'sandbox', world: 13, par: 0, vertices: tet4(),
      edges: [E('f', 'a', 'b'), E('g', 'b', 'c'), E('h', 'c', 'd'), E('x', 'a', 'c'), E('y', 'b', 'd')],
      triangles: [],
      tools: ['compose', 'horn0', 'horn2', 'trip'].concat(THM, ['addVertex', 'addEdge', 'cell2', 'peel']), kan: true,
      goal: null,
      solution: [] }

  ];
  HC.Levels.forEach(function (L, i) { L.id = i + 1; L.world = L.world + 1; });   // world 0 (simplicial sets) is shown as world 1
  HC.LegacyLevels = [
    // ---- World 8: Lifting ----
    { id: 33, name: 'shadow', kind: 'intro', world: 8, par: 1, vertices: tri3,
      edges: [E('f', 'a', 'b'), E('g', 'b', 'c')], triangles: [],
      base: shadowBase(false), proj: shadowProj,
      tools: ['compose'], kan: false,
      goal: { triangles: [['f', 'g', '?x']] },
      solution: [['compose', 'f', 'g']] },

    { id: 34, name: 'lift', kind: 'puzzle', world: 8, par: 1, vertices: tri3,
      edges: [E('f', 'a', 'b'), E('g', 'b', 'c')], triangles: [],
      base: shadowBase(true), proj: shadowProj,
      tools: ['compose'], kan: false,
      goal: { triangles: [['f', 'g', '?x', 'S.t2']] },
      solution: [['compose', 'f', 'g', 1]] },

    { id: 35, name: 'nolift', kind: 'puzzle', world: 8, par: 1, claimable: true, vertices: tri3,
      edges: [E('f', 'a', 'b'), E('g', 'b', 'c'), E('z', 'a', 'c')], triangles: [],
      strict: true, table: { 'f,g': 'z' },
      base: shadowBase(true), proj: withProj(shadowProj, { z: 'S.x' }),
      tools: ['compose', 'trip'], kan: false,
      reasons: ['shadow', 'hole', 'unrelated'],
      goal: { triangles: [['f', 'g', '?w', 'S.t2']], impossible: true },
      solution: [['claim', 'shadow']] },

    { id: 36, name: 'liftfill', kind: 'puzzle', world: 8, par: 2, vertices: tet4(),
      edges: [E('f', 'a', 'b'), E('g', 'b', 'c'), E('h', 'c', 'd'), E('x', 'a', 'c'), E('z', 'a', 'd')],
      triangles: [T('G1', 'f', 'g', 'x'), T('G2', 'x', 'h', 'z')],
      base: { vertices: tet4S(),
        edges: [SE('f', 'a', 'b'), SE('g', 'b', 'c'), SE('h', 'c', 'd'), SE('x', 'a', 'c'), SE('y', 'b', 'd'), SE('z', 'a', 'd')],
        triangles: [ST('t1', 'f', 'g', 'x'), ST('t2', 'g', 'h', 'y'), ST('t3', 'x', 'h', 'z'), ST('t4', 'f', 'y', 'z')] },
      proj: { a: 'S.a', b: 'S.b', c: 'S.c', d: 'S.d', f: 'S.f', g: 'S.g', h: 'S.h', x: 'S.x', z: 'S.z' },
      tools: ['compose', 'trip'], kan: false,
      goal: { triangles: [['g', 'h', '?y'], ['f', '?y', 'z', 'S.t4']] },
      solution: [['compose', 'g', 'h'], ['trip', ['f', 'g', 'h'], { A: 'G1', B: 't1', C: 'G2' }]] },

    { id: 37, name: 'liftiso', kind: 'boss', world: 8, par: 4, vertices: tet4(),
      edges: [E('f', 'a', 'b', 'f', { iso: true }), E('g', 'b', 'c'), E('h', 'c', 'd'), E('y0', 'b', 'd', 'y₀')],
      triangles: [],
      joyal: true,
      base: { vertices: tet4S(),
        edges: [SE('f', 'a', 'b'), SE('g', 'b', 'c'), SE('h', 'c', 'd'), SE('x', 'a', 'c'), SE('y', 'b', 'd'), SE('z', 'a', 'd')],
        triangles: [ST('t1', 'f', 'g', 'x'), ST('t2', 'g', 'h', 'y'), ST('t3', 'x', 'h', 'z'), ST('t4', 'f', 'y', 'z')] },
      proj: { a: 'S.a', b: 'S.b', c: 'S.c', d: 'S.d', f: 'S.f', g: 'S.g', h: 'S.h', y0: 'S.y' },
      tools: ['compose', 'horn0', 'trip'], kan: false,
      goal: { triangles: [['f', 'g', '?x'], ['?x', 'h', '?z'], ['f', '?y', '?z'], ['g', 'h', '?y', 'S.t2']] },
      solution: [['compose', 'f', 'g'], ['compose', 'e1', 'h'], ['horn0', 'f', 'e2'],
        ['trip', ['f', 'g', 'h'], { A: 't1', C: 't2', D: 't3' }]] }
  ];
  HC.Levels.forEach(function (L) { L.parHidden = !!L.claimable; });
  // identity arrows are named after their dot's label (1_a′, not 1_a2)
  HC.Levels.forEach(function (L) {
    var lab = {}; (L.vertices || []).forEach(function (v) { lab[v.id] = v.label || v.id; });
    (L.edges || []).forEach(function (e) { if (e.kind === 'identity' && lab[e.src]) { e.label = '1_' + lab[e.src]; if (e.mathLabel) e.mathLabel = e.label; } });
  });
})(typeof window !== 'undefined' ? window : globalThis);
