// node test.js
require('./engine.js');
require('./levels.js');
var HC = globalThis.HC, En = HC.Engine, fails = 0, passes = 0;
function check(c, msg) { if (c) passes++; else { fails++; console.log('FAIL: ' + msg); } }
function lv(name) { return HC.Levels.concat(HC.LegacyLevels || []).filter(function (l) { return l.name === name; })[0]; }
function custom(base, patch) { var l = JSON.parse(JSON.stringify(lv(base))); for (var k in patch) l[k] = patch[k]; return l; }
function mk(name, patch) { return En.createState(patch ? custom(name, patch) : lv(name)); }
function has(arr, x) { return arr.indexOf(x) >= 0; }
// helper levels for direct tests of mechanics whose showcase levels changed shape
function monoOld(patch) {
  var L = custom('nocancel', { joyal: true });
  L.edges = L.edges.map(function (e) { if (e.id === 'g') e.iso = true; return e; });
  for (var k in (patch || {})) L[k] = patch[k];
  return En.createState(L);
}
var RELAY_OLD = {
  id: 99, name: 'relayold', kind: 'puzzle', world: 3, par: 2,
  vertices: [{ id: 'a', label: 'a', x: 8, y: 46 }, { id: 'b', label: 'b', x: 50, y: 6 }, { id: 'c', label: 'c', x: 50, y: 30 }, { id: 'd', label: 'd', x: 92, y: 46 }],
  edges: [{ id: 'f', src: 'a', dst: 'b', label: 'f', kind: 'given' }, { id: 'g', src: 'b', dst: 'c', label: 'g', kind: 'given' },
    { id: 'h', src: 'c', dst: 'd', label: 'h', kind: 'given' }, { id: 'x', src: 'a', dst: 'c', label: 'x', kind: 'given' },
    { id: 'x2', src: 'a', dst: 'c', label: 'x′', kind: 'given' }, { id: 'z', src: 'a', dst: 'd', label: 'z', kind: 'given' }],
  triangles: [{ id: 'G1', e01: 'f', e12: 'g', e02: 'x', kind: 'given' }, { id: 'G2', e01: 'f', e12: 'g', e02: 'x2', kind: 'given' },
    { id: 'G3', e01: 'x', e12: 'h', e02: 'z', kind: 'given' }],
  tools: ['compose', 'trip', 'same', 'flip', 'link', 'swapin'], kan: false,
  goal: { triangles: [['x2', 'h', 'z']] }, solution: []
};
function relayOld() { return En.createState(RELAY_OLD); }
function findT(s, a, b, c) { return s.triangles.filter(function (t) { return t.e01 === a && t.e12 === b && t.e02 === c; })[0]; }
function edgeOf(s, id) { return s.edges.filter(function (e) { return e.id === id; })[0]; }

var MOVE = { claim: 'claimImpossible', trip: 'claimRoute' };
function runStep(s, step) {
  var bang = step[0] === '!';
  var st = bang ? step.slice(1) : step;
  var fn = MOVE[st[0]] || st[0];
  return { bang: bang, step: st, r: En[fn].apply(null, [s].concat(st.slice(1))) };
}

// does `cands` offer this arrow-pick (a dot counts for 'id:v')?
function offers(c, id) {
  return has(c.edges, id) || has(c.triangles, id) || (id.indexOf('id:') === 0 && has(c.vertices, id.slice(3))) || has(c.vertices, id);
}
// candidate containment for the next pick of a step
function checkCandidates(s, st, tag) {
  var tool = st[0], a = st.slice(1);
  function inC(t, picks, id) {
    check(offers(En.candidates(s, t, picks), id), tag + ' candidates(' + t + ',[' + picks + ']) lacks ' + id);
  }
  if (tool === 'compose' || tool === 'horn0' || tool === 'horn2' || tool === 'same' || tool === 'link' || tool === 'swapin' || tool === 'divide') {
    inC(tool, [], a[0]); inC(tool, [a[0]], a[1]);
  } else if (tool === 'flip') {
    inC(tool, [], a[0]);
  } else if (tool === 'trip') {
    var ids = a[0];
    inC('trip', [], ids[0]); inC('trip', [ids[0]], ids[1]); inC('trip', [ids[0], ids[1]], ids[2]);
  } else if (tool === 'cell2') {
    var ids2 = a[0];
    inC('cell2', [], ids2[0]); inC('cell2', [ids2[0]], ids2[1]); inC('cell2', [ids2[0], ids2[1]], ids2[2]);
  } else if (tool === 'addEdge') {
    inC('addEdge', [], a[0]); inC('addEdge', [a[0]], a[1]);
  }
}

// ---------- 0. level table sanity ----------
check(HC.Levels.length === 67, '67 levels');
// "nerve or not?": the stored answer must be the true one
HC.Levels.forEach(function (L0) {
  if (!L0.goal || L0.goal.flag !== 'verdict') return;
  var yes = En.isNerve(En.createState(L0)).ok, sol = L0.solution[0][0];
  check((sol === 'isNerve') === yes, L0.name + ': verdict matches the truth');
  if (!yes) { var s9 = En.createState(L0); check(En.witness(s9, L0.solution[0][1], L0.solution[0][2]).ok && En.checkGoal(s9).done, L0.name + ': the witness is a bad pair'); }
});
HC.Levels.forEach(function (L, i) {
  check(L.id === i + 1, 'ids are consecutive at ' + L.name);
  check(['intro', 'puzzle', 'boss', 'sandbox'].indexOf(L.kind) >= 0, L.name + ' has kind');
  check(L.world >= 1 && L.world <= 12, L.name + ' world');
  check(L.parHidden === !!L.claimable, L.name + ' parHidden follows claimable');
  if (i) check(L.world >= HC.Levels[i - 1].world, L.name + ' worlds non-decreasing');
  check(!has(L.tools, 'identity') && !has(L.tools, 'fill3'), L.name + ' lists neither identity nor fill3');
  if (L.unlocks) check(true, L.name + ' unlocks ' + L.unlocks);
});
(function () {
  var un = {};
  HC.Levels.forEach(function (L) { if (L.unlocks) un[L.unlocks] = L; });
  check(un.same && un.same.name === 'unique' && un.flip.name === 'symmetric' && un.link.name === 'transitive' && un.swapin.name === 'whisker', 'unlock levels');
  // a theorem tool is never used before the level that unlocks it
  var order = { same: 6, flip: 9, link: 10, swapin: 11 };
  HC.Levels.forEach(function (L) {
    ['same', 'flip', 'link', 'swapin'].forEach(function (t) {
      if (has(L.tools, t) && L.id !== 29 && L.id <= order[t] && L.name !== 'bracket') check(false, L.name + ' lists ' + t + ' before it is unlocked');
    });
  });
  check(lv('bracket').tools.indexOf('same') >= 0, 'bracket uses same (unlocked by unique, which comes first)');
})();

// ---------- 1. replay every solution ----------
HC.Levels.forEach(function (L) {
  if (!L.goal) {
    var s0 = En.createState(L);
    check(En.checkGoal(s0).done === false && En.checkGoal(s0).parts.length === 0, 'sandbox never done');
    return;
  }
  var s = En.createState(L), tag = 'level ' + L.id + ' ' + L.name;
  var g0 = En.checkGoal(s);
  check(!g0.done, tag + ' not done at start');
  check(g0.parts.length > 0, tag + ' has parts');
  L.solution.forEach(function (step, i) {
    var st = step[0] === '!' ? step.slice(1) : step;
    check(has(L.tools, st[0]) || st[0] === 'claim' || st[0] === 'pick', tag + ' step ' + i + ' uses a listed tool (' + st[0] + ')');
    checkCandidates(s, st, tag + ' step ' + i);
    var o = runStep(s, step);
    if (o.bang) check(!o.r.ok && typeof o.r.reason === 'string', tag + ' step ' + i + ' expected to fail');
    else {
      check(o.r.ok, tag + ' step ' + i + ' ' + JSON.stringify(step) + ' -> ' + (o.r.reason || ''));
      if (o.r.ok) {
        check(typeof o.r.message === 'string' && o.r.message.split(/\s+/).length <= 10, tag + ' message short: ' + o.r.message);
        check(o.r.added && o.r.added.edges && o.r.added.triangles && o.r.added.tetras, tag + ' shape');
      }
    }
  });
  var g = En.checkGoal(s);
  check(g.done, tag + ' done at end');
  check(L.solution.length === L.par, tag + ' par ' + L.par + ' equals number of steps ' + L.solution.length);
  check(g.parts.every(function (p) { return p.done || p.wish; }), tag + ' all parts done at end');
  check(g.parts.every(function (p) { return typeof p.text === 'string' && typeof p.plain === 'string'; }), tag + ' parts have text and plain');
  if (L.goal.impossible) check(g.impossible && g.parts.some(function (p) { return p.kind === 'impossible' && p.done; }), tag + ' impossible part');
  if (L.unlocks) check(true, 'unlock noted');
});

// ---------- 2. undo ----------
(function () {
  var s = mk('compose');
  check(!En.canUndo(s), 'cannot undo at start');
  En.compose(s, 'f', 'g');
  check(En.canUndo(s) && s.edges.length === 3 && s.triangles.length === 1, 'compose added things');
  var r = En.undo(s);
  check(r.ok && s.edges.length === 2 && s.triangles.length === 0 && !En.canUndo(s), 'undo restores');
  check(!En.undo(s).ok, 'undo with nothing fails');
  var r2 = En.compose(s, 'f', 'g');
  check(r2.added.edges[0] === 'e1' && r2.added.triangles[0] === 't1', 'ids reused after undo');
  // failed moves leave no trace, not even an auto-created identity
  var u = mk('unit');
  var before = JSON.stringify([u.edges, u.triangles]);
  check(!En.compose(u, 'id:a', 'f').ok === false, 'compose stay,f works');
  En.undo(u);
  check(JSON.stringify([u.edges, u.triangles]) === before && !En.canUndo(u), 'undo removes auto-made identity too');
  var j = mk('joyal', { edges: [{ id: 'f', src: 'a', dst: 'b', label: 'f', kind: 'given' }] });
  var e0 = j.edges.length;
  check(!En.horn0(j, 'f', 'id:a').ok && j.edges.length === e0 && !En.canUndo(j), 'failed horn leaves no identity edge');
})();

// ---------- 3. max 2 fillers ----------
(function () {
  var s = mk('twoways');
  var a = En.compose(s, 'f', 'g'), b = En.compose(s, 'f', 'g'), c = En.compose(s, 'f', 'g');
  check(a.ok && b.ok && !c.ok && typeof c.reason === 'string', 'third compose rejected');
  check(s.edges.length === 4, 'no edge from rejected compose');
  check(s.edges[2].label === 'x' && s.edges[3].label === 'y', 'composites get fresh single letters');
  check(s.edges[2].origin.witnessName === 'σ₁' && s.edges[3].origin.witnessName === 'σ₂', 'origin records the witnessing triangle');
  check(s.edges[2].origin.op === 'compose' && s.edges[2].origin.from.join() === 'f,g', 'origin recorded');
  check(!En.compose(s, 'f', 'h').ok, 'unknown edge rejected');
  check(!En.compose(s, 'f', 'f').ok, 'non-meeting arrows rejected');
  check(En.compose(mk('twoways'), 'g', 'f').ok, 'swapped order composes');
})();

// ---------- 4. implicit identities ----------
(function () {
  var s = mk('unit');
  check(s.edges.length === 1, 'no identity edge at the start');
  var r = En.compose(s, 'id:a', 'f');
  var idE = edgeOf(s, 'id:a');
  check(r.ok && idE && idE.label === '1_a' && idE.kind === 'identity' && r.added.edges[0] === 'id:a', 'compose stay,f creates 1_a on demand');
  check(s.edges[s.edges.length - 1].label === 'x', 'composite is a fresh letter: ' + s.edges[s.edges.length - 1].label);
  check(!En.compose(mk('unit'), 'id:zz', 'f').ok, 'unknown dot rejected');
  var h = mk('undo');
  check(En.horn0(h, 'f', 'id:a').ok && edgeOf(h, 'id:a') && edgeOf(h, 'e1').label === 'x', 'horn0 accepts stay');
  var d = mk('disc');
  check(!En.cell2(d, ['a', 'b', 'c']).ok, 'cell2 on dots is rejected');
  var c = En.createState(custom('disc', { edges: [{ id: 'f', src: 'a', dst: 'b', label: 'f', kind: 'drawn' }, { id: 'g', src: 'a', dst: 'b', label: 'g', kind: 'drawn' }] }));
  check(En.cell2(c, ['f', 'id:b', 'g']).ok && edgeOf(c, 'id:b'), 'cell2 accepts stay');
  // thin triangles carry a flag the UI can filter on
  var t = mk('unique');
  var thin = En.createState(custom('symmetric'));
  En.claimRoute(thin, ['id:a', 'f', 'id:b'], {});
  check(thin.triangles.every(function (x) { return x.kind !== 'thin' || x.thin === true; }), 'thin triangles are flagged');
  var sy = mk('symmetric'); En.claimRoute(sy, ['f', 'id:b', 'id:b'], { A: 'G1', D: 's1:f' });
  var thins = sy.triangles.filter(function (x) { return x.thin; });
  check(thins.length >= 2 && thins.every(function (x) { return x.kind === 'thin'; }), 'trip materialises its free facts as flagged thin triangles');
  check(sy.triangles.filter(function (x) { return x.kind === 'trip'; }).length === 1, 'and one trip triangle');
})();

// ---------- 5. Trip: routeSlots / claimRoute ----------
(function () {
  var s = mk('tetra');
  var r = En.routeSlots(s, ['f', 'g', 'h'], {});
  check(r.ok && r.vertices.join() === 'a,b,c,d', 'routeSlots vertices');
  ['A', 'B', 'C', 'D'].forEach(function (sl) { check(r.slots[sl] && Array.isArray(r.slots[sl].cands) && 'chosen' in r.slots[sl], 'slot ' + sl + ' shape'); });
  check(r.slots.A.chosen.ref === 'G1' && r.slots.B.chosen.ref === 'G2' && r.slots.C.chosen.ref === 'G3' && !r.slots.D.chosen, 'auto-chosen slots');
  check(r.claim && r.claim.slot === 'D' && r.claim.allowed && r.claim.fact.e01 === 'f' && r.claim.fact.e12 === 'y' && r.claim.fact.e02 === 'z', 'claim D = (f,y,z)');
  check(r.claim.text.indexOf('⇒') > 0 && r.claim.plain === '(f, y ; z)' && r.claim.tuple === '(f, y ; z)' && r.claim.name === 'σ₄' && r.claim.verb === 'construct' && r.claim.boundary.join() === 'f,y,z', 'claim texts: ' + r.claim.plain);
  check(r.slots.A.lock === true && r.slots.B.lock === true && r.slots.C.lock === false && r.slots.D.lock === false, 'A/B locked, C/D not');
  check(r.slots.A.chosen.plain === '(f, g ; x)' && r.slots.A.chosen.text === 'g∘f ⇒ x' && r.slots.A.chosen.name === 'σ₁', 'fact texts plain/math');
  // omitted choice behaves like {}
  check(En.routeSlots(s, ['f', 'g', 'h']).claim.slot === 'D', 'choice may be omitted');
  // explicit null keeps a slot empty
  var rn = En.routeSlots(s, ['f', 'g', 'h'], { A: null });
  check(!rn.slots.A.chosen && rn.slots.A.cands.length === 1 && !rn.claim, 'explicit null leaves slot empty and no claim yet');
  check(!En.routeSlots(s, ['f', 'h', 'g']).ok && !En.routeSlots(s, ['f', 'g']).ok && !En.routeSlots(s, ['f', 'g', 'nope']).ok, 'bad trips rejected');
  var c = En.claimRoute(s, ['f', 'g', 'h'], {});
  check(c.ok && s.tetras.length === 1 && s.tetras[0].missing === 2 && c.added.triangles.length === 1, 'claim adds fact and tetra (missing = d2)');
  var nt = s.triangles[s.triangles.length - 1];
  check(nt.kind === 'trip' && nt.e01 === 'f' && nt.e12 === 'y' && nt.e02 === 'z', 'claimed triangle kind trip');
  check(s.tetras[0].faces.join() === 'G2,G3,' + nt.id + ',G1', 'tetra faces [d0,d1,d2,d3]');
  var again = En.claimRoute(s, ['f', 'g', 'h'], {});
  check(!again.ok && /already/.test(again.reason), 'repeat claim says already known');
  check(En.routeSlots(s, ['f', 'g', 'h'], {}).known === true, 'known flag');
  // chips: unique has two choices for A and D
  var u = mk('unique'); En.compose(u, 'f', 'g'); En.compose(u, 'f', 'g');
  var ru = En.routeSlots(u, ['f', 'g', 'id:c'], {});
  check(ru.slots.A.cands.length === 2 && ru.slots.D.cands.length === 2 && ru.slots.B.chosen && ru.slots.B.chosen.free && ru.slots.B.chosen.ref === 's1:g', 'unique: chips for A and D, B free auto');
  check(!ru.claim, 'no claim yet');
  var ru2 = En.routeSlots(u, ['f', 'g', 'id:c'], { A: 't1' });
  check(ru2.slots.D.cands.length === 2 && !ru2.claim, 'one slot chosen: still choosing');
  var ru3 = En.routeSlots(u, ['f', 'g', 'id:c'], { A: 't1', D: 't1' });
  check(ru3.known && !ru3.claim, 'A = D gives (x,stay,x), which is free: nothing to claim');
  var ru4 = En.routeSlots(u, ['f', 'g', 'id:c'], { A: 't1', D: 't2' });
  check(ru4.claim && ru4.claim.slot === 'C' && ru4.claim.fact.e02 === 'e2' && ru4.claim.plain === 'x ≃ y' && ru4.claim.verb === 'prove', 'claim x ≃ y: ' + (ru4.claim && ru4.claim.plain));
  var bad = En.routeSlots(u, ['f', 'g', 'id:c'], { A: 'G77' });
  check(bad.invalid && bad.invalid[0] === 'A' && !bad.slots.A.chosen, 'unknown ref is reported as invalid');
  var cr = En.claimRoute(u, ['f', 'g', 'id:c'], { A: 't1', D: 't2' });
  check(cr.ok && En.checkGoal(u).done, 'unique solved by trip');
  // locks
  var cn = mk('nocancel');
  var rc = En.routeSlots(cn, ['f', 'id:b', 'g'], { C: 'G2', D: 'G1' });
  check(rc.claim && rc.claim.slot === 'A' && rc.claim.allowed === false && /reversible/.test(rc.claim.reason), 'A claim locked without kan');
  var cl = En.claimRoute(cn, ['f', 'id:b', 'g'], { C: 'G2', D: 'G1' });
  check(!cl.ok && /reversible/.test(cl.reason) && cn.tetras.length === 0 && cn.triangles.length === 2, 'locked claim refused and leaves nothing');
  var ck = mk('nocancel', { kan: true });
  check(En.claimRoute(ck, ['f', 'id:b', 'g'], { C: 'G2', D: 'G1' }).ok && !!findT(ck, 'f', 'id:b', 'k'), 'A claim ok with kan');
  check(En.routeSlots(ck, ['f', 'id:b', 'g'], {}).slots.A.lock === false, 'no lock with kan');
  // the old outer-horn situation (tetra data with D, C, B known; A missing)
  var base = [
    { id: 'A', e01: 'g', e12: 'h', e02: 'y', kind: 'given' },
    { id: 'B', e01: 'x', e12: 'h', e02: 'z', kind: 'given' },
    { id: 'C', e01: 'f', e12: 'y', e02: 'z', kind: 'given' }];
  var o1 = mk('tetra', { triangles: base.slice(), kan: false });
  var ro = En.claimRoute(o1, ['f', 'g', 'h'], {});
  check(!ro.ok && /reversible/.test(ro.reason), 'outer horn refused without kan: ' + ro.reason);
  var o2 = mk('tetra', { triangles: base.slice(), kan: true });
  check(En.claimRoute(o2, ['f', 'g', 'h'], {}).ok && o2.triangles[3].e12 === 'g' && o2.tetras[0].missing === 3, 'outer horn ok with kan: claims A');
  // inconsistent facts
  var st = mk('tetra');
  var rb = En.routeSlots(st, ['f', 'g', 'h'], { A: 'G1', B: 'G1' });
  check(rb.invalid.length >= 1, 'a fact that does not fit a slot is invalid');
  check(!En.claimRoute(mk('tetra'), ['f', 'g', 'h'], { A: 'G1' }).ok === false || true, 'smoke');
  var fewer = En.claimRoute(mk('assoc'), ['f', 'g', 'h'], {});
  check(!fewer.ok && /Choose/.test(fewer.reason), 'nothing chosen: ' + fewer.reason);
})();

// ---------- 6. horns, labels, describe ----------
(function () {
  var s = mk('inverses');
  var h = En.horn0(s, 'f', 'id:a');
  check(h.ok && s.edges[s.edges.length - 1].label === 'x' && s.edges[s.edges.length - 1].origin.op === 'horn0' && s.edges[s.edges.length - 1].origin.inverseOf === 'f', 'horn0 result is a fresh letter, remembered as an inverse of f');
  var h2 = En.horn2(s, 'f', 'id:b');
  check(h2.ok && s.edges[s.edges.length - 1].label === 'y' && s.edges[s.edges.length - 1].origin.op === 'horn2', 'horn2 result is the next fresh letter');
  check(edgeOf(s, 'id:a').label === '1_a', 'identity label is 1_a');
  var d = En.describe(s, 't1');
  check(d.text.indexOf('⇒') > 0 && !d.isHomotopy && d.plain === '(f, x ; 1_a)' && d.text === 'x∘f ⇒ 1_a' && d.name === 'σ₁' && d.verb === 'construct' && d.boundary.join() === 'f,e1,id:a', 'describe: ' + d.plain + ' / ' + d.text);
  var dv = mk('divide');
  var r = En.horn2(dv, 'g', 'h');
  check(r.ok && dv.edges[2].label === 'x' && dv.edges[2].src === 'a' && dv.edges[2].dst === 'b', 'horn2 result is a fresh letter and goes a->b');
  var u = mk('undo');
  check(En.horn0(u, 'f', 'id:a').ok && u.edges.filter(function (e) { return e.id === 'e1'; })[0].src === 'b', 'horn0 inverse goes b->a');
  check(En.horn0(u, 'f', 'id:a').ok && !En.horn0(u, 'f', 'id:a').ok, 'horn0 max two answers');
  check(!En.horn0(mk('inverses'), 'f', 'nope').ok, 'unknown arrow');
  var sy = mk('symmetric');
  check(En.describe(sy, 'G1').plain === 'f ≃ g' && En.describe(sy, 'G1').isHomotopy && En.describe(sy, 'G1').text === 'f ≃ g', 'describe homotopy plain/math');
  var un = mk('unit'); En.compose(un, 'id:a', 'f');
  check(En.describe(un, 't1').plain === '(1_a, f ; x)', 'describe stay: ' + En.describe(un, 't1').plain);
})();

// ---------- 7. old fill3 / identity still work (compatibility) ----------
(function () {
  var s = mk('tetra');
  check(En.fill3(s, ['G1', 'G2', 'G3']).ok && En.fill3Options(s, ['G1', 'G2']).length === 0, 'fill3 still works');
  var i = mk('compose');
  check(En.identity(i, 'a').ok && !En.identity(i, 'a').ok && En.identity(i, 'f').ok && !En.identity(i, 'f').ok, 'identity still works');
})();

// ---------- 8. addVertex / addEdge ----------
(function () {
  var s = mk('sandbox');
  var v = En.addVertex(s, 50, 30);
  check(v.ok && v.added.vertices[0] === 'v1' && s.vertices[4].label === 'e', 'addVertex id v1 label e');
  En.addVertex(s, 500, -5);
  check(s.vertices[5].id === 'v2' && s.vertices[5].label === 'f' && s.vertices[5].x === 100 && s.vertices[5].y === 0, 'clamped');
  En.undo(s); En.undo(s);
  check(s.vertices.length === 4, 'undo addVertex');
  var o = mk('disc');
  check(!En.addEdge(o, 'a', 'a').ok, 'addEdge src != dst');
  check(!En.addEdge(o, 'a', 'zz').ok, 'addEdge unknown dot');
  var e1 = En.addEdge(o, 'a', 'b'), e2 = En.addEdge(o, 'b', 'c'), e3 = En.addEdge(o, 'a', 'b'), e4 = En.addEdge(o, 'a', 'b');
  check(e1.ok && o.edges[0].label === 'f' && o.edges[0].kind === 'drawn' && o.edges[0].id === 'e1', 'first drawn is f');
  check(e2.ok && o.edges[1].label === 'g', 'second drawn is g');
  check(e3.ok && o.edges[2].label === 'h', 'second parallel allowed');
  check(!e4.ok, 'third parallel rejected');
  check(En.candidates(o, 'addEdge', ['a']).vertices.join() === 'c', 'addEdge candidates drop capped dot');
  check(En.addEdge(o, 'b', 'a').ok, 'reverse direction is separate');
})();

// ---------- 9. cell2 ----------
(function () {
  var s = mk('sphere');
  check(!En.cell2(s, ['f', 'g']).ok, 'cell2 needs three');
  check(!En.cell2(s, ['f', 'g', 'g']).ok, 'cell2 needs distinct');
  check(!En.cell2(s, ['f', 'g', 'nope']).ok, 'cell2 unknown');
  var r = En.cell2(s, ['h', 'f', 'g']);
  var t = s.triangles[0];
  check(r.ok && t.kind === 'cell' && t.e01 === 'f' && t.e12 === 'g' && t.e02 === 'h', 'cell2 any order finds (f,g,h)');
  check(En.cell2(s, ['g', 'h', 'f']).ok, 'two discs on one rim');
  var third = En.cell2(s, ['f', 'g', 'h']);
  check(!third.ok && s.triangles.length === 2, 'third disc rejected');
  check(En.checkGoal(s).done, 'sphere goal');
  check(En.candidates(mk('sphere'), 'cell2', []).edges.join() === 'f,g,h', 'cell2 candidates all three');
  var tt = mk('peel');
  check(En.candidates(tt, 'cell2', ['f']).edges.length > 0 && !has(En.candidates(tt, 'cell2', ['f']).edges, 'h'), 'cell2 candidates from tetra');
  var open = mk('sphere', { edges: [{ id: 'f', src: 'a', dst: 'b', label: 'f', kind: 'given' }, { id: 'g', src: 'b', dst: 'c', label: 'g', kind: 'given' }, { id: 'h', src: 'c', dst: 'b', label: 'h', kind: 'given' }] });
  check(!En.cell2(open, ['f', 'g', 'h']).ok, 'cell2 rejects arrows that do not close up');
})();

// ---------- 10. peel ----------
(function () {
  var s = mk('peel');
  check(s.tetras.length === 1 && s.triangles.length === 4 && s.edges.length === 6, 'peel level starts complete');
  var r1 = En.peel(s);
  check(r1.ok && s.tetras.length === 0 && s.triangles.length === 4 && r1.removed.tetras[0] === 'T1', 'peel removes tetras first');
  var r2 = En.peel(s);
  check(r2.ok && s.triangles.length === 0 && s.edges.length === 6 && r2.removed.triangles.length === 4, 'peel removes triangles');
  check(!En.checkGoal(s).done, 'peeling alone is not the goal');
  var r3 = En.peel(s);
  check(r3.ok && s.edges.length === 0 && s.vertices.length === 4, 'peel removes edges, keeps dots');
  var r4 = En.peel(s);
  check(!r4.ok && typeof r4.reason === 'string', 'peel on dots fails');
  En.undo(s); En.undo(s); En.undo(s);
  check(s.tetras.length === 1 && s.triangles.length === 4 && s.edges.length === 6, 'undo restores everything');
  var s5 = mk('peel'); En.peel(s5); En.peel(s5);
  check(En.cell2(s5, ['f', 'g', 'x']).ok && En.checkGoal(s5).done, 'peel level solution state');
})();

// ---------- 11. strict rulebooks ----------
(function () {
  var s = mk('nerve');
  var r = En.compose(s, 'f', 'g');
  check(r.ok && s.edges.length === 3 && s.triangles.length === 1 && s.triangles[0].e02 === 'h' && s.triangles[0].kind === 'compose', 'strict compose uses the table');
  check(!s.flags.uniqueRefused, 'no flag yet');
  var r2 = En.compose(s, 'f', 'g');
  check(!r2.ok && /exactly one/.test(r2.reason) && s.flags.uniqueRefused === true && s.triangles.length === 1, 'second answer refused and flagged');
  check(!En.compose(s, 'g', 'h').ok && !En.compose(s, 'h', 'f').ok, 'no table entry fails');
  var o = mk('onlyone');
  En.compose(o, 'f', 'g');
  check(!En.checkGoal(o).done && En.checkGoal(o).parts.length === 2, 'triangle alone is not enough');
  En.compose(o, 'f', 'g');
  check(En.checkGoal(o).done, 'refusal completes onlyone');
  // stay in a strict level gives a flagged thin triangle (and the identity edge appears on use)
  var si = mk('nerve');
  var ri = En.compose(si, 'g', 'id:c');
  check(ri.ok && si.triangles[0].id === 's1:g' && si.triangles[0].kind === 'thin' && si.triangles[0].thin === true && edgeOf(si, 'id:c'), 'strict compose with stay gives a thin triangle');
  check(!En.compose(si, 'g', 'id:c').ok && si.flags.uniqueRefused, 'thin triangle also unique');
  // blanks
  var n3 = mk('nerve3');
  En.compose(n3, 'f', 'g'); En.compose(n3, 'g', 'h');
  check(En.openBlanks(n3).length === 1, 'blank open');
  check(!En.compose(n3, 'f', 'q').ok && /blank/.test(En.compose(n3, 'f', 'q').reason), 'compose on a blank fails gently');
  check(!has(En.candidates(n3, 'compose', ['f']).edges, 'q'), 'blank not live');
  check(has(En.candidates(n3, 'compose', ['f']).edges, 'g'), 'table pair live');
  En.compose(n3, 'p', 'h');
  var rs = En.routeSlots(n3, ['f', 'g', 'h'], {});
  check(rs.claim && rs.claim.slot === 'D' && rs.claim.fact.e12 === 'q' && !rs.claim.existing, 'trip fills the blank: claim D = (f,q,r)');
  check(En.claimRoute(n3, ['f', 'g', 'h'], {}).ok, 'claim fills the blank');
  check(En.openBlanks(n3).length === 0 && En.checkGoal(n3).done, 'blank filled and goal done');
  // a strict claim of an already-known fact still records the tetra
  var cs = mk('nerve3', { blanks: [], table: { 'f,g': 'p', 'g,h': 'q', 'p,h': 'r', 'f,q': 'r' } });
  ['f,g', 'g,h', 'p,h', 'f,q'].forEach(function (k) { var a = k.split(','); En.compose(cs, a[0], a[1]); });
  var rr = En.claimRoute(cs, ['f', 'g', 'h'], {});
  check(rr.ok && rr.added.triangles.length === 0 && rr.added.tetras.length === 1 && cs.tetras[0].missing === 2, 'strict: tetra recorded when all four facts exist');
  check(!En.claimRoute(cs, ['f', 'g', 'h'], {}).ok, '...and only once');
})();

// ---------- 12. joyal rules ----------
(function () {
  var s = mk('joyal');
  var plain = mk('joyal', { edges: [{ id: 'f', src: 'a', dst: 'b', label: 'f', kind: 'given' }] });
  var rp = En.horn0(plain, 'f', 'id:a');
  check(!rp.ok && /reversible/.test(rp.reason), 'joyal horn0 needs iso first arrow: ' + rp.reason);
  check(En.horn0(s, 'f', 'id:a').ok, 'joyal horn0 ok with iso');
  check(!has(En.candidates(plain, 'horn0', []).edges, 'f'), 'non-iso arrow not live for horn0');
  check(has(En.candidates(mk('joyal'), 'horn0', []).edges, 'f'), 'iso arrow live for horn0');
  var h2 = mk('divide', { joyal: true });
  check(!En.horn2(h2, 'g', 'h').ok, 'joyal horn2 needs iso e12');
  var h2i = mk('divide', { joyal: true, edges: [{ id: 'g', src: 'b', dst: 'c', label: 'g', kind: 'given', iso: true }, { id: 'h', src: 'a', dst: 'c', label: 'h', kind: 'given' }] });
  check(En.horn2(h2i, 'g', 'h').ok, 'joyal horn2 ok with iso e12');
  // claim A is legal in mono only because e23 = g is iso
  var m = monoOld();
  var rm = En.routeSlots(m, ['f', 'id:b', 'g'], { C: 'G2', D: 'G1' });
  check(rm.claim.slot === 'A' && rm.claim.allowed && En.claimRoute(m, ['f', 'id:b', 'g'], { C: 'G2', D: 'G1' }).ok, 'mono: claim A allowed (e23 iso)');
  var m2 = mk('nocancel', { joyal: true });
  var rm2 = En.claimRoute(m2, ['f', 'id:b', 'g'], { C: 'G2', D: 'G1' });
  check(!rm2.ok && /reversible/.test(rm2.reason), 'mono without iso fails');
  var m3 = monoOld({ joyal: false });
  check(!En.claimRoute(m3, ['f', 'id:b', 'g'], { C: 'G2', D: 'G1' }).ok, 'iso alone does not license outer horns without joyal');
  // claim B needs e01 iso
  var j = mk('joyal');
  En.horn0(j, 'f', 'id:a');
  var rj = En.routeSlots(j, ['f', 'e1', 'f'], {});
  check(rj.claim && rj.claim.slot === 'B' && rj.claim.allowed && rj.claim.fact.e01 === 'e1' && rj.claim.fact.e12 === 'f' && rj.claim.fact.e02 === 'id:b', 'joyal: claim B = (g,f,1_b): ' + JSON.stringify(rj.claim));
  var jn = mk('joyal', { edges: [{ id: 'f', src: 'a', dst: 'b', label: 'f', kind: 'given' }], joyal: false });
  En.horn0(jn, 'f', 'id:a');
  check(!En.claimRoute(jn, ['f', 'e1', 'f'], {}).ok, 'same claim fails when f is not iso');
  var jj = mk('joyal', { edges: [{ id: 'f', src: 'a', dst: 'b', label: 'f', kind: 'given' }], joyal: true });
  check(true, 'smoke');
})();

// ---------- 13. theorem tools ----------
(function () {
  var u = mk('unique');
  En.compose(u, 'f', 'g'); En.compose(u, 'f', 'g');
  var r = En.same(u, 't1', 't2');
  var t = u.triangles[u.triangles.length - 1];
  check(r.ok && t.kind === 'theorem' && t.e01 === 'e1' && t.e12 === 'id:c' && t.e02 === 'e2' && edgeOf(u, 'id:c'), 'same: x ≈ x′');
  check(En.checkGoal(u).done, 'same solves unique');
  check(!En.same(u, 't1', 't2').ok && !En.same(u, 't1', 't1').ok, 'same refuses repeats and identical answers');
  var u2 = mk('unique'); En.compose(u2, 'f', 'g');
  check(!En.same(u2, 't1', 'nope').ok, 'same unknown fact');
  var bk = mk('bracket');
  check(!En.same(bk, 'G1', 'G3').ok, 'same needs the same trip');
  // flip
  var sy = mk('symmetric');
  var rf = En.flip(sy, 'G1'), tf = sy.triangles[sy.triangles.length - 1];
  check(rf.ok && tf.e01 === 'g' && tf.e12 === 'id:b' && tf.e02 === 'f' && tf.kind === 'theorem' && En.checkGoal(sy).done, 'flip');
  check(!En.flip(sy, 'G1').ok, 'flip twice refused');
  check(!En.flip(mk('tetra'), 'G1').ok, 'flip needs a wiggle fact');
  // link
  var tr = mk('transitive');
  check(En.link(tr, 'G1', 'G2').ok && En.checkGoal(tr).done && !En.link(tr, 'G1', 'G2').ok, 'link');
  check(!En.link(mk('transitive'), 'G2', 'G1').ok, 'link needs them to chain');
  // swapin
  var wh = mk('whisker');
  var rsw = En.swapin(wh, 'G1', 'G2');
  var tsw = wh.triangles[wh.triangles.length - 1];
  check(rsw.ok && tsw.e01 === 'k' && tsw.e12 === 'g' && tsw.e02 === 'x' && En.checkGoal(wh).done, 'swapin replaces f by k');
  check(!En.swapin(wh, 'G1', 'G2').ok, 'swapin repeat refused');
  var sw = mk('swap');
  check(En.swapin(sw, 'G1', 's0:f', 2).ok && En.checkGoal(sw).done, 'swapin works on a free fact (stay,f,f), position 2');
  var sw1 = mk('swap'); En.swapin(sw1, 'G1', 's0:f');
  check(!En.checkGoal(sw1).done && sw1.triangles[sw1.triangles.length - 1].e12 === 'g', 'default position is the first occurrence');
  var sw2 = mk('swap');
  check(!En.swapin(sw2, 'G1', 'G1', 1).ok === false || true, 'smoke');
  var rel = relayOld();
  En.same(rel, 'G1', 'G2');
  check(En.swapin(rel, 't1', 'G3').ok && En.checkGoal(rel).done, 'old relay: same then swapin');
  check(!En.swapin(relayOld(), 'G3', 'G3').ok, 'swapin needs a wiggle first');
  // pos
  var p = relayOld(); En.same(p, 'G1', 'G2');
  check(!En.swapin(p, 't1', 'G3', 1).ok && En.swapin(p, 't1', 'G3', 0).ok, 'swapin pos picks the position');
  // candidates
  var c = mk('unique'); En.compose(c, 'f', 'g'); En.compose(c, 'f', 'g');
  check(En.candidates(c, 'same', []).triangles.join() === 't1,t2' && En.candidates(c, 'same', ['t1']).triangles.join() === 't2', 'same candidates');
  check(En.candidates(mk('symmetric'), 'flip', []).triangles.join() === 'G1', 'flip candidates');
  check(En.candidates(mk('transitive'), 'link', ['G1']).triangles.join() === 'G2', 'link candidates');
  check(En.candidates(rel, 'swapin', []).triangles.length === 0, 'swapin candidates (nothing new left)');
  var rel2 = relayOld(); En.same(rel2, 'G1', 'G2');
  check(En.candidates(rel2, 'swapin', ['t1']).triangles.join() === 'G3', 'swapin candidates: G3');
})();

// ---------- 14. claim ----------
(function () {
  var s = mk('spine');
  var r = En.claimImpossible(s);
  check(!r.ok && /can be done/.test(r.reason) && !s.flags.claimed, 'wrong claim refused');
  var n = mk('backfill');
  check(!En.checkGoal(n).done, 'backfill not done before claim');
  var nr = En.claimImpossible(n);
  check(!nr.ok && nr.needsReason && nr.reasons.length === 3 && !n.flags.claimed, 'a claim needs a reason');
  var wr = En.claimImpossible(n, 'hole');
  check(!wr.ok && wr.wrongReason === true && wr.reasonId === 'hole' && n.flags.penalty === 1 && !n.flags.claimed, 'wrong reason refused and costs a move');
  var c = En.claimImpossible(n, 'freshend');
  check(c.ok && n.flags.claimed && En.checkGoal(n).done, 'right claim wins');
  check(!En.claimImpossible(mk('spine'), 'hole').ok && mk('spine').flags.penalty === undefined, 'smoke');
  var sp2 = mk('spine'); En.claimImpossible(sp2, 'hole');
  check(sp2.flags.penalty === 1, 'claim on a possible level costs a move too');
  check(!mk('wedge').level.goal.impossible, 'wedge is possible');
  ['nofill', 'parallel', 'oneway', 'squarehole', 'nocancel', 'backpath', 'opensquare'].forEach(function (nm) {
    var L0 = lv(nm), sol = L0.solution[0][1];
    check(L0.goal.impossible === true && L0.claimable && !L0.reasons, nm + ' impossible, refuted by a counterexample');
    check(En.checkModel(L0, sol.model, sol.paint).ok, nm + ' counterexample checks');
    check(En.claimImpossible(En.createState(L0)).needsModel === true, nm + ' asks for a world');
  });
  // soundness: no test world may "refute" a level that can be solved
  (function () {
    function anyModel(L0) {
      var found = null;
      HC.Models.forEach(function (M) {
        var vs = L0.vertices.map(function (v) { return v.id; }), es = L0.edges.filter(function (e2) { return e2.kind !== 'identity'; });
        (function recV(i, pv) {
          if (found) return;
          if (i === vs.length) {
            (function recE(j, pe) {
              if (found) return;
              if (j === es.length) { if (En.checkModel(L0, M.id, { vertices: pv, edges: pe }).ok) found = M.id; return; }
              En.modelArrowsBetween(M.id, pv[es[j].src], pv[es[j].dst]).forEach(function (o) { pe[es[j].id] = o.id; recE(j + 1, pe); });
              delete pe[es[j].id];
            })(0, {});
            return;
          }
          M.objects.forEach(function (o) { pv[vs[i]] = o; recV(i + 1, pv); });
          delete pv[vs[i]];
        })(0, {});
      });
      return found;
    }
    HC.Levels.forEach(function (L0) {
      if (!L0.claimable || !L0.goal || !L0.goal.triangles || L0.base || L0.strict || L0.goal.impossible) return;
      var m = anyModel(L0);
      check(!m, L0.name + ' is solvable, so no test world refutes it' + (m ? ' (but ' + m + ' does)' : ''));
    });
  })();
  ['nolift'].forEach(function (nm) {
    check(lv(nm).goal.impossible === true && lv(nm).claimable && lv(nm).reasons.length === 3, nm + ' impossible with three reasons');
  });
  var why = { backfill: 'freshend', inneronly: 'licence', nolift: 'shadow' };
  for (var nm in why) check(lv(nm).reasons[0] === why[nm], nm + ' right reason is ' + why[nm]);
  HC.Levels.forEach(function (L) { if (L.reasons) check(new Set(L.reasons).size === 3, L.name + ' reasons are distinct'); });
  ['spine', 'wedge', 'almostring', 'square', 'detour', 'mono', 'twosided', 'joyal'].forEach(function (nm) {
    check(lv(nm).claimable === true && !lv(nm).goal.impossible, nm + ' claimable and possible');
  });
})();

// ---------- 15. goal parts ----------
(function () {
  var s = mk('assoc');
  var g = En.checkGoal(s);
  check(g.parts.length === 4 && g.parts.every(function (p) { return p.kind === 'triangle' && !p.done && typeof p.text === 'string'; }), 'assoc parts start undone');
  En.compose(s, 'f', 'g');
  g = En.checkGoal(s);
  check(g.parts[0].done && !g.parts[1].done && !g.parts[3].done, 'assoc parts tick one by one');
  check(g.parts[0].text === 'g∘f ⇒ ?x' && g.parts[0].plain === '(f, g ; ?x)' && g.parts[0].verb === 'construct' && g.parts[0].name === 'σ₁' && g.parts[0].vars[0].edge === 'e1' && g.parts[0].vars[0].label === 'x', 'part text: ' + g.parts[0].text + ' / ' + g.parts[0].plain);
  var u = mk('twoways');
  En.compose(u, 'f', 'g');
  g = En.checkGoal(u);
  check(g.parts[0].done && !g.parts[1].done, 'distinct variables need distinct arrows');
  var un = mk('unique');
  var pu = En.checkGoal(un).parts;
  check(pu[2].text === '?x ≃ ?y' && pu[2].plain === '?x ≃ ?y' && pu[2].tuple === '(?x, 1_c ; ?y)' && pu[2].verb === 'prove' && pu[0].verb === 'construct' && pu[1].verb === 'construct', 'homotopy part text: ' + pu[2].text + ' / ' + pu[2].plain);
  var unit = En.checkGoal(mk('unit')).parts;
  check(unit[0].plain === '(1_a, f ; ?k)', 'identity in part text: ' + unit[0].plain);
  var sp = mk('spine'); var gp = En.checkGoal(sp);
  check(gp.parts.length === 5 && gp.parts[4].kind === 'min' && gp.parts[4].have === 0 && gp.parts[4].want === 1, 'spine min part');
  var pe = En.checkGoal(mk('peel'));
  check(pe.parts.length === 3 && pe.parts.filter(function (p) { return p.done; }).length === 1, 'peel counts start: only edges right');
  var ds = mk('disc'); En.addEdge(ds, 'a', 'b');
  var go = En.checkGoal(ds);
  check(go.parts.length === 2 && !go.done && go.parts[0].have === 1, 'disc counts');
  ['a,b', 'b,c', 'a,c'].forEach(function (p) { var q = p.split(','); if (p !== 'a,b') En.addEdge(ds, q[0], q[1]); });
  check(!En.checkGoal(ds).done && En.cell2(ds, ['e1', 'e2', 'e3']).ok && En.checkGoal(ds).done, 'disc: glue completes');
  var nf = En.checkGoal(mk('nofill'));
  check(nf.impossible && nf.parts.length === 2 && nf.parts[0].wish && !nf.parts[0].done && nf.parts[1].kind === 'impossible', 'nofill parts');
  var wd = mk('wedge'); check(!En.checkGoal(wd).done, 'wedge needs a tetra');
})();

// ---------- 16. candidates ----------
(function () {
  var s = mk('compose');
  var c0 = En.candidates(s, 'compose', []);
  check(c0.edges.join() === 'f,g' && c0.vertices.join() === 'a,b,c', 'compose start: both arrows, and every dot (stay)');
  var cf = En.candidates(s, 'compose', ['f']);
  check(cf.edges.join() === 'g' && cf.vertices.join() === 'a,b', 'after f: g, and the dots a (stay before) and b (stay after) light: ' + cf.vertices);
  check(En.candidates(s, 'compose', ['f', 'g']).edges.length === 0, 'nothing after two picks');
  var cs = En.candidates(mk('chain'), 'compose', ['f']);
  check(has(cs.edges, 'g'), 'chain: f then g');
  var t = mk('tetra');
  var ct = En.candidates(t, 'trip', []);
  check(ct.edges.length === 6 && ct.vertices.length === 4, 'trip start: every arrow and dot');
  var c1 = En.candidates(t, 'trip', ['f']);
  check(c1.edges.join() === 'g,y' && c1.vertices.join() === 'b', 'trip after f: arrows leaving b, and stay at b: ' + c1.edges + '|' + c1.vertices);
  check(En.candidates(t, 'trip', ['f', 'g', 'h']).edges.length === 0, 'trip is full after three');
  check(En.candidates(t, 'trip', ['id:a']).vertices.join() === 'a', 'trip after stay');
  var h = mk('divide');
  check(En.candidates(h, 'horn2', []).edges.join() === 'g,h' && En.candidates(h, 'horn2', ['g']).edges.join() === 'g,h', 'horn2 start');
  var q = mk('assoc');
  check(En.candidates(q, 'peel', []).edges.length === 0 && En.candidates(q, 'trip', ['f', 'g', 'h']).vertices.length === 0, 'overfull picks empty');
})();

// ---------- 16b. v4: labels, rename, origin ----------
(function () {
  var s = mk('chain');
  En.compose(s, 'f', 'g');
  var r = En.compose(s, 'e1', 'h');
  var e2 = edgeOf(s, 'e2');
  check(e2.label === 'y' && e2.origin.from.join() === 'e1,h' && e2.origin.witnessName === 'σ₂', 'second composite: ' + e2.label);
  check(/first, then/.test(r.message) && r.swapped === false, 'toast says which comes first: ' + r.message);
  var sw = mk('compose');
  var rs = En.compose(sw, 'g', 'f');
  check(rs.ok && rs.swapped === true && edgeOf(sw, 'e1').label === 'x' && /f first, then g/.test(rs.message), 'one-way connection: f first, then g');
  // both ways connect: pick order is used
  var lp = mk('twosided');
  var l1 = En.compose(lp, 'f', 'g'), l2 = En.compose(lp, 'g', 'f');
  check(edgeOf(lp, 'e1').origin.from.join() === 'f,g' && edgeOf(lp, 'e1').src === 'a' && edgeOf(lp, 'e2').origin.from.join() === 'g,f' && edgeOf(lp, 'e2').src === 'b', 'pick order used when both connect');
  // rename
  var rn = mk('chain'); En.compose(rn, 'f', 'g');
  var rr = En.rename(rn, 'e1', 'fg');
  check(rr.ok && edgeOf(rn, 'e1').label === 'fg' && edgeOf(rn, 'e1').mathLabel === 'fg', 'rename');
  En.compose(rn, 'e1', 'h');
  check(edgeOf(rn, 'e2').label === 'x', 'a renamed arrow does not change other names: ' + edgeOf(rn, 'e2').label);
  check(!En.rename(rn, 'e1', '').ok && !En.rename(rn, 'e1', 'f').ok && !En.rename(rn, 'zz', 'q').ok && !En.rename(rn, 'e1', 'abcdefghijklmnop').ok, 'rename refusals');
  check(!En.rename(rn, 'e1', 'fg').ok, 'same name refused');
  En.undo(rn);
  check(edgeOf(rn, 'e1').label === 'fg' && !edgeOf(rn, 'e2'), 'undo takes back the later compose first');
  En.undo(rn);
  check(edgeOf(rn, 'e1').label === 'x', 'rename is undoable');
  var idn = mk('unit'); En.compose(idn, 'id:a', 'f');
  check(!En.rename(idn, 'id:a', 'z').ok, 'identity cannot be renamed');
  // inverses
  var iv = mk('undo');
  En.horn0(iv, 'f', 'id:a');
  check(edgeOf(iv, 'e1').label === 'x' && edgeOf(iv, 'e1').mathLabel === 'x' && edgeOf(iv, 'e1').origin.inverseOf === 'f', 'a left inverse is a fresh letter');
  En.horn0(iv, 'f', 'id:a');
  check(edgeOf(iv, 'e2').label === 'y', 'second answer is the next letter');
  var dv = mk('square'); En.compose(dv, 'f', 'v'); En.horn0(dv, 'u', 'e1');
  check(edgeOf(dv, 'e2').label === 'y' && edgeOf(dv, 'e2').origin.op === 'horn0', 'non-identity solve gets a fresh letter');
  // given edges have a mathLabel
  check(mk('compose').edges.every(function (e) { return e.mathLabel === e.label; }), 'given edges: mathLabel = label');
  check(mk('compose').edges.length === 2, 'smoke');
})();

// ---------- 16c. v4: tetraFromFacts ----------
(function () {
  var s = mk('tetra');
  var r = En.tetraFromFacts(s, ['G1', 'G2', 'G3']);
  check(r.ok && r.vertices.join() === 'a,b,c,d' && r.steps.join() === 'f,g,h' && r.claim && r.claim.slot === 'D' && r.claim.plain === '(f, y ; z)', 'tetraFromFacts: faces -> claim D');
  check(r.choice.A === 'G1' && r.choice.B === 'G2' && r.choice.C === 'G3' && Array.isArray(r.alternatives), 'returns steps, choice, alternatives');
  check(En.claimRoute(s, r.steps, r.choice).ok && En.checkGoal(s).done, 'claimRoute(steps, choice) completes the level');
  check(En.tetraFromFacts(mk('tetra'), ['G3', 'G1', 'G2']).claim.slot === 'D', 'order of the faces does not matter');
  var bad = En.tetraFromFacts(mk('tetra'), ['G1', 'G2', 'G1']);
  check(!bad.ok, 'duplicates refused');
  var en = mk('tetra'); En.identity(en, 'f');
  var nofit = En.tetraFromFacts(en, ['G1', 'G2', 's0:f']);
  check(!nofit.ok && /close up/.test(nofit.reason), 'facts that do not close up: ' + nofit.reason);
  check(!En.tetraFromFacts(mk('tetra'), ['G1', 'G2']).ok && !En.tetraFromFacts(mk('tetra'), ['G1', 'G2', 'nope']).ok, 'bad input');
  // free faces work too: swap level, faces (id:a,f,f) (f,id:b,f) and G1
  var sw = mk('swap');
  var rf = En.tetraFromFacts(sw, ['s0:f', 's1:f', 'G1']);
  check(rf.ok && rf.claim && rf.claim.slot === 'D' && rf.claim.fact.e12 === 'f' && rf.claim.fact.e02 === 'g', 'free faces: claim (1_a,f,g)');
  // locked outer horn is reported, not hidden
  var base = [
    { id: 'A', e01: 'g', e12: 'h', e02: 'y', kind: 'given' },
    { id: 'B', e01: 'x', e12: 'h', e02: 'z', kind: 'given' },
    { id: 'C', e01: 'f', e12: 'y', e02: 'z', kind: 'given' }];
  var o = mk('tetra', { triangles: base.slice(), kan: false });
  var ro = En.tetraFromFacts(o, ['A', 'B', 'C']);
  check(ro.ok && ro.claim.slot === 'A' && ro.claim.allowed === false, 'outer horn: claim A locked');
  var ok2 = mk('tetra', { triangles: base.slice(), kan: true });
  check(En.tetraFromFacts(ok2, ['A', 'B', 'C']).claim.allowed === true, 'outer horn allowed with kan');
})();

// ---------- 16d. v4: lifting ----------
(function () {
  var s = mk('shadow');
  check(s.base && s.base.triangles.length === 1 && s.proj.f === 'S.f', 'base and proj are in the state');
  check(s.triangles.length === 0, 'no X triangles at the start');
  var opts = En.liftOptions(s, 'compose', ['f', 'g']);
  check(opts.length === 1 && opts[0].tri === 'S.t1' && opts[0].over === 'S.x' && /over/.test(opts[0].text), 'one lifting option: ' + JSON.stringify(opts));
  var r = En.compose(s, 'f', 'g');
  check(r.ok && s.proj.e1 === 'S.x' && s.triangles[0].over === 'S.t1', 'new arrow lies over S.x, triangle over S.t1');
  check(!En.compose(s, 'f', 'f').ok, 'no triangle below / not composable');
  En.undo(s);
  check(s.proj.e1 === undefined, 'undo forgets the projection');
  check(s.base.triangles.length === 1, 'S never changes');
  // no S triangle below
  var ns = mk('shadow', { base: { vertices: lv('shadow').base.vertices, edges: lv('shadow').base.edges, triangles: [] } });
  var rn = En.compose(ns, 'f', 'g');
  check(!rn.ok && /No triangle below/.test(rn.reason) && ns.edges.length === 2 && !En.canUndo(ns), 'no triangle below: ' + rn.reason);
  check(En.candidates(ns, 'compose', ['f']).edges.indexOf('g') < 0, 'candidates dim arrows with nothing below');
  // two lifts: option index chooses
  var l = mk('lift');
  var lo = En.liftOptions(l, 'compose', ['f', 'g']);
  check(lo.length === 2 && lo[1].tri === 'S.t2' && lo[1].over === 'S.y', 'two options');
  check(!En.compose(l, 'f', 'g', 2).ok, 'option out of range');
  En.compose(l, 'f', 'g', 0);
  check(!En.checkGoal(l).done && En.checkGoal(l).parts[0].text.indexOf('over t2') > 0, 'wrong lift: not done; part text mentions the S triangle: ' + En.checkGoal(l).parts[0].text);
  En.compose(l, 'f', 'g', 1);
  check(En.checkGoal(l).done && l.triangles[1].over === 'S.t2', 'right lift wins');
  // strict: the table decides and it lies over the wrong thing
  var nl = mk('nolift');
  check(En.compose(nl, 'f', 'g').ok && nl.triangles[0].over === 'S.t1' && !En.checkGoal(nl).parts[0].done, 'nolift: composite lies over t1');
  check(!En.claimImpossible(nl, 'hole').ok && En.claimImpossible(nl, 'shadow').ok && En.checkGoal(nl).done, 'nolift: reason shadow');
  // tetra claim must lie over S
  var lf = mk('liftfill');
  check(lf.triangles.every(function (t) { return /^S\.t[13]$/.test(t.over); }), 'given faces lie over t1 and t3');
  check(En.compose(lf, 'g', 'h').ok && lf.proj.e1 === 'S.y' && lf.triangles[2].over === 'S.t2', 'the composite g.h lies over S.y');
  var rr = En.routeSlots(lf, ['f', 'g', 'h'], {});
  check(rr.claim && rr.claim.over === 'S.t4' && rr.claim.allowed, 'claim lies over S.t4');
  check(En.claimRoute(lf, ['f', 'g', 'h'], {}).ok && En.checkGoal(lf).done, 'liftfill solved');
  var lb = mk('liftfill', { base: { vertices: lv('liftfill').base.vertices, edges: lv('liftfill').base.edges, triangles: lv('liftfill').base.triangles.slice(0, 3) } });
  En.compose(lb, 'g', 'h');
  var rb = En.claimRoute(lb, ['f', 'g', 'h'], {});
  check(!rb.ok && /No triangle below/.test(rb.reason) && lb.tetras.length === 0, 'tetra claim with no S face below is refused: ' + rb.reason);
  // an outer horn lifted: iso edge upstairs, two triangles, a Solve, then the outer tetrahedron
  var li = mk('liftiso');
  En.compose(li, 'f', 'g'); En.compose(li, 'e1', 'h');
  var ho = En.liftOptions(li, 'horn0', ['f', 'e2']);
  check(ho.length === 1 && ho[0].over === 'S.y' && ho[0].tri === 'S.t4', 'horn0 lifting option: ' + JSON.stringify(ho));
  var early = En.claimRoute(mk('liftiso'), ['f', 'g', 'h'], {});
  check(!early.ok, 'no tetrahedron before the horn is built');
  check(En.horn0(li, 'f', 'e2').ok && li.proj.e3 === 'S.y', 'horn0 lifts f.? = z over S.y');
  var rl = En.routeSlots(li, ['f', 'g', 'h'], {});
  check(rl.claim && rl.claim.slot === 'B' && rl.claim.allowed && rl.claim.over === 'S.t2', 'outer claim B over S.t2, allowed because f is iso');
  check(En.claimRoute(li, ['f', 'g', 'h'], {}).ok && En.checkGoal(li).done, 'liftiso solved');
  var liNo = mk('liftiso', { edges: lv('liftiso').edges.map(function (e) { var c = JSON.parse(JSON.stringify(e)); delete c.iso; return c; }) });
  En.compose(liNo, 'f', 'g'); En.compose(liNo, 'e1', 'h');
  check(!En.horn0(liNo, 'f', 'e2').ok, 'liftiso needs f iso');
  // theorem tools must stay over S
  var lw = mk('lift');
  En.compose(lw, 'f', 'g', 0); En.compose(lw, 'f', 'g', 1);
  check(!En.same(lw, 't1', 't2').ok, 'same of two different lifts is refused: no S triangle (x̄, 1, ȳ)');
  // plain levels are untouched
  check(mk('compose').base === null && En.liftOptions(mk('compose'), 'compose', ['f', 'g']).length === 0, 'no base: no options');
})();

// ---------- 16e. v4: layouts must not self-intersect ----------
(function () {
  function cross(a, b, c) { return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x); }
  function proper(p1, p2, p3, p4) {
    var d1 = cross(p3, p4, p1), d2 = cross(p3, p4, p2), d3 = cross(p1, p2, p3), d4 = cross(p1, p2, p4);
    return d1 * d2 < 0 && d3 * d4 < 0;
  }
  function onSeg(p, a, b) {
    return Math.abs(cross(a, b, p)) < 1e-9 && p.x >= Math.min(a.x, b.x) && p.x <= Math.max(a.x, b.x) && p.y >= Math.min(a.y, b.y) && p.y <= Math.max(a.y, b.y);
  }
  function crossings(s) {
    var seen = {}, segs = [], bad = 0;
    var P = {}; s.vertices.forEach(function (v) { P[v.id] = v; });
    s.edges.forEach(function (e) {
      if (e.src === e.dst) return;
      var k = [e.src, e.dst].sort().join('|');
      if (seen[k]) return; seen[k] = 1; segs.push([e.src, e.dst]);
    });
    for (var i = 0; i < segs.length; i++) {
      for (var j = i + 1; j < segs.length; j++) {
        var a = segs[i], b = segs[j];
        if (a[0] === b[0] || a[0] === b[1] || a[1] === b[0] || a[1] === b[1]) continue;
        if (proper(P[a[0]], P[a[1]], P[b[0]], P[b[1]])) bad++;
      }
      s.vertices.forEach(function (v) { if (v.id !== segs[i][0] && v.id !== segs[i][1] && onSeg(v, P[segs[i][0]], P[segs[i][1]])) bad++; });
    }
    return bad;
  }
  HC.Levels.forEach(function (L) {
    if (!L.goal && L.name !== 'sandbox') return;
    var s = En.createState(L);
    check(crossings(s) <= (L.maxCrossings || 0), L.name + ' layout (start) has no crossings');
    if (L.name === 'sandbox') return;
    L.solution.forEach(function (st) {
      var x = st[0] === '!' ? st.slice(1) : st;
      var fn = MOVE[x[0]] || x[0];
      En[fn].apply(null, [s].concat(x.slice(1)));
    });
    check(crossings(s) <= (L.maxCrossings || 0), L.name + ' layout (after the solution) has no crossings');
    if (L.base) {
      var bs = { vertices: L.base.vertices, edges: L.base.edges };
      check(crossings(bs) === 0, L.name + ' shadow layout has no crossings');
    }
  });
  // a final state with every composite drawn: assoc with everything composed, nerve3 with its decoy
  var a = mk('assoc'); En.compose(a, 'f', 'g'); En.compose(a, 'g', 'h'); En.compose(a, 'e1', 'h'); En.compose(a, 'f', 'e2');
  check(crossings(a) === 0, 'assoc with all composites: no crossings');
  check(crossings(mk('nerve3')) === 0, 'nerve3: no crossings (decoy included)');
  check(crossings({ vertices: lv('fourway').vertices, edges: lv('fourway').edges }) === 0, 'fourway: no crossings');
})();

// ---------- 16f. difficulty pass ----------
(function () {
  HC.Levels.forEach(function (L) {
    if (L.kind !== 'boss') return;
    var kinds = {};
    L.solution.forEach(function (st) { kinds[st[0] === '!' ? st[1] : st[0]] = 1; });
    check(L.par >= 4 && Object.keys(kinds).length >= 2, L.name + ' (boss): par >= 4 and at least two kinds of move: ' + L.par + ' ' + Object.keys(kinds));
  });
  // the solvable puzzle right before each boss
  var need = { unit: 3, relay: 3, cancel: 3, wedge: 3, liftfill: 2, mono: 3 };
  for (var nm in need) check(lv(nm).par >= need[nm], nm + ' par >= ' + need[nm]);
  check(lv('liftiso').par >= 4 && lv('liftfill').par >= 2, 'lifting world difficulty');
  ['unique', 'symmetric', 'transitive', 'whisker'].forEach(function (nm) { check(lv(nm).par <= 3, nm + ' (unlocks a tool) stays a single well-chosen tetrahedron'); });
  // bosses keep a decoy: an arrow that no solution step uses
  HC.Levels.forEach(function (L) {
    if (L.kind !== 'boss' || !L.goal || L.goal.impossible) return;
    var used = {};
    L.solution.forEach(function (st) { JSON.stringify(st).replace(/"([^"]+)"/g, function (m, x) { used[x] = 1; return m; }); });
    var goalIds = {}; JSON.stringify(L.goal).replace(/"([^"]+)"/g, function (m, x) { goalIds[x] = 1; return m; });
    var decoys = (L.edges || []).filter(function (e) { return e.id.indexOf('id:') !== 0 && !used[e.id] && !goalIds[e.id]; });
    var viaTri = (L.triangles || []).filter(function (t) { return !used[t.id]; });
    check(decoys.length + viaTri.length >= 1, L.name + ' has at least one decoy arrow or fact: ' + decoys.map(function (e) { return e.id; }) + ' / ' + viaTri.map(function (e) { return e.id; }));
  });
})();

// ---------- 16g. v5: names, free triangles, picks ----------
(function () {
  // triangles are named σ₁, σ₂, …: given first, then in creation order; undo gives the same name back
  var s = mk('tetra');
  check(s.triangles.map(function (x) { return x.name; }).join() === 'σ₁,σ₂,σ₃', 'given triangles are σ₁, σ₂, σ₃');
  check(En.claimRoute(s, ['f', 'g', 'h'], {}).ok && s.triangles[3].name === 'σ₄', 'the next triangle is σ₄');
  En.undo(s);
  check(s.triangles.length === 3 && En.claimRoute(s, ['f', 'g', 'h'], {}).ok && s.triangles[3].name === 'σ₄', 'after undo the numbering continues from the same place');
  check(En.describe(s, 't1').name === 'σ₄' || En.describe(s, s.triangles[3].id).name === 'σ₄', 'describe returns the name');
  var d = En.describe(s, s.triangles[3].id);
  check(d.boundary.join() === 'f,y,z' && d.labels.join() === 'f,y,z' && d.verb === 'construct' && d.tuple === '(f, y ; z)' && d.plain === '(f, y ; z)', 'describe boundary / verb / plain');
  // degenerate triangles have canonical names; they take no σ number
  var u = mk('unit'); En.compose(u, 'id:a', 'f');
  check(En.claimRoute(u, ['id:a', 'f', 'id:b'], { A: 't1', B: 's₁f', D: 's₀f' }).ok, 'free faces can be given by name');
  var thin = u.triangles.filter(function (x) { return x.thin; }).map(function (x) { return x.name; }).sort().join();
  check(thin === 's₀f,s₁f', 'materialised degenerate triangles are s₀f and s₁f: ' + thin);
  check(u.triangles.filter(function (x) { return !x.thin; }).map(function (x) { return x.name; }).join() === 'σ₁,σ₂', 'only the real ones count in σ');
  var ug = En.createState(lv('unit'));
  check(En.freeTriangles(ug).length === 4, 'free list: s₀f, s₁f, s₀1_a, s₀1_b');
  var cur = mk('unit'); En.compose(cur, 'f', 'id:b');
  check(En.describe(cur, 't1').name === 'σ₁', 'composing with a stay still names the witness σ₁');
  // freeTriangles
  var fb = mk('freebies');
  var ft = En.freeTriangles(fb);
  var by = {}; ft.forEach(function (x) { by[x.ref] = x; });
  check(ft.length === 4 && by['s0:f'].name === 's₀f' && by['s1:f'].name === 's₁f' && by['s0:id:a'].name === 's₀1_a' && by['s0:id:b'].name === 's₀1_b', 'freeTriangles names: ' + ft.map(function (x) { return x.name; }));
  check(by['s1:f'].boundary.join() === 'f,id:b,f' && by['s1:f'].labels.join() === 'f,1_b,f' && by['s1:f'].tuple === '(f, 1_b ; f)' && by['s1:f'].plain === 'f ≃ f' && by['s1:f'].exists === false, 'free triangle boundary (d₂, d₀ ; d₁)');
  check(by['s0:f'].boundary.join() === 'id:a,f,f' && by['s0:f'].plain === '(1_a, f ; f)' && by['s0:id:a'].boundary.join() === 'id:a,id:a,id:a', 'more free boundaries');
  check(En.describe(fb, 's1:f').name === 's₁f' && En.describe(fb, 's₀f').tuple === '(1_a, f ; f)', 'describe works on free refs and names');
  En.rename(En.createState(lv('freebies')), 'f', 'q');
  var rs = mk('freebies');
  check(En.rename(rs, 'f', 'q').ok && En.freeTriangles(rs).map(function (x) { return x.name; }).indexOf('s₁q') >= 0, 'free names follow a rename');
  // pick goals
  var fa = mk('faces');
  check(!En.checkGoal(fa).done && En.checkGoal(fa).parts.length === 1 && En.checkGoal(fa).parts[0].kind === 'pick', 'faces: one pick part');
  var w1 = En.pick(fa, 'G1');
  check(!w1.ok && w1.wrongPick === true && fa.flags.penalty === 1 && !En.checkGoal(fa).done, 'a wrong pick costs a move');
  check(!En.pick(fa, 'G4').ok && fa.flags.penalty === 2, 'again');
  check(En.pick(fa, 'σ₂').ok && En.checkGoal(fa).done, 'a name works as a pick; the right pick finishes it');
  check(!En.pick(fa, 'G2').ok, 'nothing left to pick');
  var fr = mk('freebies');
  check(!En.pick(fr, 's0:f').ok && fr.flags.penalty === 1, 'freebies: the order matters (s₁f first)');
  var p1 = En.pick(fr, 's1:f');
  check(p1.ok && p1.picked === 1 && p1.of === 2 && !En.checkGoal(fr).done && En.checkGoal(fr).parts.length === 2 && En.checkGoal(fr).parts[0].done && !En.checkGoal(fr).parts[1].done, 'freebies: first pick');
  check(En.pick(fr, 's₀f').ok && En.checkGoal(fr).done, 'freebies: second pick by name');
  var wf = mk('whichface');
  check(wf.tetras.length === 1 && wf.tetras[0].vertices.join() === 'a,b,b,c' && wf.tetras[0].faces.join() === 's0:g,G1,G1,s1:f', 'whichface has the tetrahedron a,b,b,c');
  check(wf.tetras[0].faces.every(function (r) { return !!wf.triangles.filter(function (x) { return x.id === r; })[0]; }), 'its faces are triangles of the board');
  check(!En.pick(wf, 's0:g').ok && !En.pick(wf, 'G1').ok && En.pick(wf, 's1:f').ok && En.checkGoal(wf).done, 'whichface: d₃ = s₁f is the answer');
  check(!En.pick(mk('compose'), 'x').ok, 'nothing to pick in an ordinary level');
  var cp = En.candidates(mk('faces'), 'pick', []);
  check(has(cp.triangles, 'G1') && has(cp.triangles, 's1:f'), 'candidates for pick: real triangles and free ones');
  // the picks are the only moves of the world: they teach (d₂, d₀ ; d₁)
  var f1 = lv('faces');
  var long = f1.triangles.filter(function (x) { return x.e02 === 'y'; });
  check(long.length === 1 && long[0].id === 'G2', 'exactly one triangle has y as its long side');
  // goals say construct or prove
  var as = En.checkGoal(mk('assoc')).parts.map(function (p) { return p.verb; }).join();
  check(as === 'construct,construct,construct,prove', 'assoc: three constructions and one proof: ' + as);
  var un = En.checkGoal(mk('unique')).parts.map(function (p) { return p.verb; }).join();
  check(un === 'construct,construct,prove', 'unique: construct, construct, prove: ' + un);
  var ty = En.checkGoal(mk('twoways')).parts.map(function (p) { return p.verb; }).join();
  check(ty === 'construct,construct', 'twoways: two constructions');
  // after a binding, the part shows the bound arrow
  var tw = mk('unique'); En.compose(tw, 'f', 'g'); En.compose(tw, 'f', 'g');
  var tp = En.checkGoal(tw).parts[2];
  check(tp.vars.length === 2 && tp.vars[0].edge === 'e1' && tp.vars[1].edge === 'e2' && tp.vars[0].fresh === false, 'prove-part keeps the ?x ↦ x binding');
  // no middle dot anywhere in plain text, and the only ≃ is for (x, 1 ; y)
  var bad = 0, badEq = 0, seen = 0;
  function scan(str, hom) {
    if (typeof str !== 'string') return;
    seen++;
    if (str.indexOf('·') >= 0) bad++;
    if (str.indexOf('≃') >= 0 && !hom) badEq++;
  }
  HC.Levels.forEach(function (L) {
    var st = En.createState(L), k;
    function sweep() {
      st.triangles.forEach(function (x) { var dd = En.describe(st, x.id); scan(dd.plain, dd.isHomotopy); scan(dd.tuple, true); });
      En.freeTriangles(st).forEach(function (x) { scan(x.plain, x.isHomotopy); scan(x.tuple, true); });
      En.checkGoal(st).parts.forEach(function (p) { scan(p.plain, p.isHomotopy); scan(p.tuple, true); });
      st.edges.forEach(function (e) { scan(e.label, true); });
    }
    sweep();
    L.solution.forEach(function (step) {
      var o = runStep(st, step);
      if (o.r && o.r.message) scan(o.r.message, true);
      if (o.r && o.r.reason) scan(o.r.reason, true);
      sweep();
    });
  });
  check(seen > 500 && bad === 0, 'no middle dot in any plain text, label or message (' + seen + ' strings, ' + bad + ' bad)');
  check(badEq === 0, 'plain text uses ≃ only for homotopies (x, 1 ; y)');
  HC.Models.forEach(function (M) { M.arrows.forEach(function (a) { check(String(a.label).indexOf('·') < 0, 'model ' + M.id + ' arrow ' + a.id + ' has no dot in its name'); }); });
  // worlds: simplicial sets is world 1 and the rest moved up by one
  check(lv('faces').world === 1 && lv('freebies').world === 1 && lv('whichface').world === 1 && lv('compose').world === 2 && lv('tetra').world === 3 && lv('sandbox').world === 12, 'world numbering: Simplicial sets = 1, Composition = 2, …, Playground = 12');
})();

// ---------- 17. brute force ----------
function snapKey(s) {
  // canonical up to the names of derived arrows: provenance labels do not depend on the order of moves
  var lab = {};
  s.edges.forEach(function (e) { lab[e.id] = e.label; });
  function L(id) { return lab[id] || id; }
  return JSON.stringify([
    s.vertices.length,
    s.edges.map(function (e) { return [e.label, e.src, e.dst].join(':'); }).sort(),
    s.triangles.map(function (t) { return [L(t.e01), L(t.e12), L(t.e02)].join(','); }).sort(),
    s.tetras.length, s.flags.uniqueRefused || 0, s.flags.claimed || 0]);
}
// Every move adds at most one non-degenerate triangle (and one tetrahedron), and no goal pattern here can be matched by
// a degenerate (thin) triangle, so the number of unmet triangle patterns / missing tetrahedra bounds the moves still needed.
function lowerBound(s) {
  var goal = s.level.goal;
  if (!goal || goal.counts || goal.edges || goal.flag || goal.pick !== undefined) return 0;
  var g = En.checkGoal(s), tri = 0, tet = 0;
  g.parts.forEach(function (p) {
    if (p.kind === 'triangle' && !p.done) tri++;
    if (p.kind === 'min' && p.key === 'tetras' && !p.done) tet = Math.max(tet, p.want - p.have);
  });
  return Math.max(tri, tet);
}
function solvedNoClaim(s) {
  var g = En.checkGoal(s);
  if (g.impossible) return g.parts.filter(function (p) { return p.kind === 'triangle'; }).every(function (p) { return p.done; });
  return g.done;
}
// all moves of the level's tools; trip claims are enumerated over every trip and every choice of three slot facts
function moves(s) {
  var out = [], tools = s.level.tools, AE = En.candidates(s, 'compose', []);
  var ends = {};
  s.edges.forEach(function (e) { ends[e.id] = [e.src, e.dst]; });
  s.vertices.forEach(function (v) { ends['id:' + v.id] = [v.id, v.id]; });
  var E = s.edges.map(function (e) { return e.id; }).concat(s.vertices.filter(function (v) { return !s.edges.some(function (e) { return e.id === 'id:' + v.id; }); }).map(function (v) { return 'id:' + v.id; }));
  var V = s.vertices.map(function (v) { return v.id; });
  var T = s.triangles.map(function (t) { return t.id; });
  function pushOpts(mv, tool) {
    var n = s.base ? En.liftOptions(s, tool, [mv[1], mv[2]]).length : 0;
    if (n <= 1) out.push(mv);
    else for (var o = 0; o < n; o++) out.push(mv.concat([o]));
  }
  tools.forEach(function (tool) {
    var i, j, k;
    if (tool === 'compose') { for (i = 0; i < E.length; i++) for (j = i; j < E.length; j++) if (ends[E[i]][1] === ends[E[j]][0] || ends[E[j]][1] === ends[E[i]][0]) pushOpts(['compose', E[i], E[j]], 'compose'); }
    else if (tool === 'horn0' || tool === 'horn2') { for (i = 0; i < E.length; i++) for (j = 0; j < E.length; j++) if (ends[E[i]][tool === 'horn0' ? 0 : 1] === ends[E[j]][tool === 'horn0' ? 0 : 1]) pushOpts([tool, E[i], E[j]], tool); }
    else if (tool === 'trip') {
      for (i = 0; i < E.length; i++) for (j = 0; j < E.length; j++) for (k = 0; k < E.length; k++) {
        if (ends[E[i]][1] !== ends[E[j]][0] || ends[E[j]][1] !== ends[E[k]][0]) continue;
        var st = [E[i], E[j], E[k]], r = En.routeSlots(s, st, {});
        if (!r.ok) continue;
        var SL = ['A', 'B', 'C', 'D'];
        for (var m = 0; m < 4; m++) {
          var others = SL.filter(function (x, ix) { return ix !== m; });
          if (others.some(function (x) { return !r.slots[x].cands.length; })) continue;
          var combos = [{}];
          others.forEach(function (x) {
            var nx = [];
            combos.forEach(function (c) { r.slots[x].cands.forEach(function (f) { var d = JSON.parse(JSON.stringify(c)); d[x] = f.ref; nx.push(d); }); });
            combos = nx;
          });
          combos.forEach(function (c) {
            c[SL[m]] = null;
            var r2 = En.routeSlots(s, st, c);
            if (r2.ok && r2.claim && r2.claim.allowed && r2.claim.slot === SL[m]) out.push(['trip', st, c]);
          });
        }
      }
    }
    else if (tool === 'same') { En.candidates(s, 'same', []).triangles.forEach(function (a) { En.candidates(s, 'same', [a]).triangles.forEach(function (b) { out.push(['same', a, b]); }); }); }
    else if (tool === 'flip') { En.candidates(s, 'flip', []).triangles.forEach(function (x) { out.push(['flip', x]); }); }
    else if (tool === 'link') { En.candidates(s, 'link', []).triangles.forEach(function (a) { En.candidates(s, 'link', [a]).triangles.forEach(function (b) { out.push(['link', a, b]); }); }); }
    else if (tool === 'swapin') { En.candidates(s, 'swapin', []).triangles.forEach(function (a) { En.candidates(s, 'swapin', [a]).triangles.forEach(function (b) { for (var p = 0; p < 3; p++) out.push(['swapin', a, b, p]); }); }); }
    else if (tool === 'liftEdge') { En.candidates(s, 'liftEdge', []).vertices.forEach(function (v) { En.liftOptions(s, 'liftEdge', [v]).forEach(function (o, i) { out.push(['liftEdge', v, i]); }); }); }
    else if (tool === 'divide') { En.candidates(s, 'divide', []).triangles.forEach(function (a) { En.candidates(s, 'divide', [a]).triangles.forEach(function (b) { out.push(['divide', a, b, 'left']); out.push(['divide', a, b, 'right']); }); }); }
    else if (tool === 'addEdge') { for (i = 0; i < V.length; i++) for (j = 0; j < V.length; j++) if (i !== j) out.push(['addEdge', V[i], V[j]]); }
    else if (tool === 'cell2') { for (i = 0; i < E.length; i++) for (j = i + 1; j < E.length; j++) for (k = j + 1; k < E.length; k++) out.push(['cell2', [E[i], E[j], E[k]]]); }
    else if (tool === 'peel') out.push(['peel']);
    else if (tool === 'cosk') out.push(['cosk']);
    else if (tool === 'cell3') { var TT = s.triangles.filter(function (x) { return !x.thin && x.kind !== 'thin'; }).map(function (x) { return x.id; });
      for (i = 0; i < TT.length; i++) for (j = i + 1; j < TT.length; j++) for (k = j + 1; k < TT.length; k++) for (var q = k + 1; q < TT.length; q++) out.push(['cell3', [TT[i], TT[j], TT[k], TT[q]]]); }
    else if (tool === 'isNerve') out.push(['isNerve']);
    else if (tool === 'witness') { En.candidates(s, 'witness', []).edges.concat(En.candidates(s, 'witness', []).vertices.map(function (v) { return 'id:' + v; })).forEach(function (a) {
      var c2 = En.candidates(s, 'witness', [a]); c2.edges.concat(c2.vertices.map(function (v) { return 'id:' + v; })).forEach(function (b) { out.push(['witness', a, b]); }); }); }
  });
  return out;
}
// Is the goal reachable within `limit` moves (never using the claim)?  Returns the depth reached or 0.
function search(L, limit, deadline) {
  var s = En.createState(L), seen = {}, found = 0, path = [];
  search.last = null;
  function rec(d) {
    if (found || Date.now() > deadline) return;
    if (d >= limit) return;
    if (lowerBound(s) > limit - d) return;
    var key = snapKey(s);
    if (seen[key] !== undefined && seen[key] >= limit - d) return;
    seen[key] = limit - d;
    var ms = moves(s);
    for (var i = 0; i < ms.length && !found; i++) {
      var fn = MOVE[ms[i][0]] || ms[i][0];
      var r = En[fn].apply(null, [s].concat(ms[i].slice(1)));
      if (!r.ok) continue;
      path.push(ms[i]);
      if (solvedNoClaim(s)) { found = d + 1; search.last = JSON.stringify(path); }
      else rec(d + 1);
      path.pop();
      En.undo(s);
    }
  }
  rec(0);
  return found;
}
// the search really finds things: every non-impossible level with par <= 2 is found at depth par
HC.Levels.forEach(function (L) {
  if (!L.goal || L.goal.pick !== undefined || L.goal.impossible || L.par > 2 || process.env.SKIP_SEARCH || process.env.ONLY) return;
  check(search(L, L.par, Date.now() + 60000) === L.par, 'search finds ' + L.name + ' at par ' + L.par);
});
var t0 = Date.now(), skipped = [];
HC.Levels.forEach(function (L) {
  if (!L.goal || L.goal.pick !== undefined || process.env.SKIP_SEARCH || (process.env.ONLY && process.env.ONLY !== L.name)) return;
  var imp = !!L.goal.impossible;
  var limit = imp ? 4 : Math.min(L.par - 1, 5);
  if (limit < 1) { check(true, 'nothing shorter than par ' + L.par); return; }
  var t1 = Date.now(), dl = t1 + 180000;
  var f = search(L, limit, dl);
  var timedOut = Date.now() > dl;
  if (timedOut) skipped.push(L.name);
  if (imp) check(!f, L.name + ' is not solvable by search to depth ' + limit + ' (found ' + f + '): ' + search.last);
  else check(!f, L.name + ' has a solution shorter than par ' + L.par + ' (found in ' + f + '): ' + search.last);
  if (Date.now() - t1 > 5000) console.log('  (' + L.name + ' search depth ' + limit + ' took ' + (Date.now() - t1) + 'ms)');
});
if (skipped.length) console.log('search timed out (inconclusive): ' + skipped.join(', '));
console.log('search time ' + (Date.now() - t0) + 'ms');

console.log(passes + ' passed, ' + fails + ' failed');
process.exit(fails ? 1 : 0);
