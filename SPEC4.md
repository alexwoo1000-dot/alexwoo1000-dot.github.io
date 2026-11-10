# HORNFILLER v4 — playtest feedback pass (wins over SPEC.md, SPEC2.md, SPEC3.md where they differ)

The user played v3. Their notes, grouped, with the design answer. Everything not changed here stays.

## 0. Tone: real words, explained (replaces "wiggle", "slide", "stay", "free facts" wording)
"The average player is not a complete idiot." Use the real terms — composite, identity, homotopy,
isomorphism, equivalence, horn, filler, simplex, quasi-category, nerve, lifting — and explain each one the first
time it appears. Explain subtleties (equality vs equivalence; *a* composite vs *the* composite).

Three depths of text, all always available:
1. **Bullets** (≤ 2, ≤ 14 words): what to do. Always shown.
2. **Explain** (collapsible `<details>`, 50–120 words, plain English + real terms, inline `$…$`): what this
   level means and why it matters. Closed by default; open by default on intro levels the first time.
3. **Math mode** (existing toggle): formal Kerodon statement + proof.

## 1. Notation (both modes)
- Composites are labelled by **provenance**, never a fresh single letter:
  - plain mode, diagrammatic order: composite of f then g is **`f·g`** (read "f then g"); a second composite of
    the same pair is `f·g′`. Math mode shows the same arrow as `g∘f`. Labels nest with brackets: `(f·g)·h`.
  - horn0 "solve f·? = h": result `f\h` is opaque → use **`f⁻¹`** when h is an identity (a left inverse),
    otherwise a fresh letter; horn2 result likewise **`g⁻¹`** / fresh letter. Every derived arrow carries
    `origin` = {op, from:[ids]} and the UI shows "made by …" on hover/select.
  - Every arrow is **renamable** (double-click / long-press its label, or `R` with it selected). Rename is
    display-only (engine `rename(state, edgeId, label)`, undoable). Labels may be several characters.
- A 2-simplex (fact) is shown as a **mini triangle picture** (three dots, three labelled directed edges, shaded)
  plus text. Text form: plain **`f·g ≃ x`** read "x is a composite of f then g" (no "then … =" sentences:
  "x then h = y" was parsed as "x, then (h = y)"). When the middle edge is an identity: **`x ≃ y`**
  ("homotopic"). Math mode: `σ: d₂=f, d₀=g, d₁=x`.
- Identity arrows are `1_a` (rendered 1 with subscript a), explained as "the do-nothing arrow at a".
- Compose order: if f and g only connect one way, the engine uses that order and the toast says
  "f first, then g". If both orders connect (a→b, b→a), the pick order is used.

## 2. Board: you can touch it
- **Drag dots** (pointer moves > 4 px = drag, else click). Arrows follow. Positions are per level, saved in
  localStorage, reset by a "tidy" button. Dragging must never trigger a pick.
- **Unfold identities** (toggle, also key `U`): every identity used in a shown fact gets a ghost copy of its
  dot (a′ next to a, draggable) joined by a short `1_a` arrow, so a degenerate triangle like (x, 1_c, y)
  becomes a real visible triangle a, c, c′. Pull the ghost away to watch a homotopy open up into a sheet
  between x and y; let go and it springs back (spring animation, skipped for reduced motion).
- **Overlaps**: if a click hits several things, pick the top one and show a tiny chooser listing the others;
  clicking the same spot again cycles. Hit areas never steal from dots (dots win).
- **Show bar** above the board: `dots · arrows · triangles · solids` toggles + `unfold` + `3D` (when a solid
  exists). Clicking a fact card **isolates** it: everything not in it dims until clicked again.
- **Goal ghost**: hovering/tapping a goal item draws the wanted triangle on the board as a dashed outline with
  `?` on unknown edges and the known edges lit.
- **Keyboard** (also a `?` overlay listing them): tools by letter shown on the button (`C` compose, `T`
  tetrahedron, `L`/`R` solve-left/right, theorem tools `1–4`, `G` glue, `D` draw arrow, `P` peel);
  while a tool is active every live target gets a small number badge, pressing the number picks it;
  `Enter` = confirm/claim/next level, `Esc` = clear, `Z`/Ctrl+Z undo, `H` hint, `U` unfold, `?` help.

## 3. The tetrahedron (replaces the confusing "Trip" panel)
One tool, **Tetrahedron**, two ways in: click **three facts** (faces) — the old card-picking, now the default —
or click **three arrows end to end** (a path). Either way a panel opens with:
- a **3D view**: rotatable (drag), corners 0–3 always drawn as four separate points labelled with their dot
  (a, b, b, c: repeated dots are separate corners — that is how identities become visible), edges as
  directed arrows with their labels, faces shaded by status: known (filled), chosen, missing (dashed), locked
  (outer horn not allowed here, with a padlock). Hover a face → its fact card and board triangle light up.
- the four faces listed by their edges, each with candidate chips when ambiguous (click a face in 3D or its
  row to cycle), and one sentence: "A solid tetrahedron's four faces must agree. Three are known — the fourth
  is forced." The missing face gets **Fill** (Enter).
- Horn names under the picture in both modes ("missing face 1 of 3 → horn Λ³₁, inner"), so the notation is
  learnt by exposure.
Engine: `routeSlots` gains a faces entry point: `tetraFromFacts(state, [t1,t2,t3])` → same output shape as
`routeSlots` (vertices, slots, claim). `claimRoute` unchanged.

Tetra levels must have a 2D layout that does not look self-intersecting: one dot inside the triangle of the
other three, or a convex quad whose only crossing is the two diagonals; parallel arrows bend apart, away from the
inside. (Fix `nerve3`: `hgf` and decoy `s` both a→d bent the same way looked like a fold.)

## 4. "Possible or not?" that needs thinking
- Claimable levels hide par ("par ?") until solved.
- "This can't be done" opens **Why?** with three reasons (from `level.reasons`, texts in `HC.Reasons`); only the
  right one wins; a wrong one gets a one-line explanation of why that reason doesn't apply and costs a move.
- Reasons (ids): `hole` (horn filling never fills a hole), `backwards` (inner moves never make an arrow point
  back), `unrelated` (nothing links arrows that share no triangle), `nocancel` (you can't cancel without an
  inverse), `onesided` (a one-sided inverse isn't an isomorphism), `shadow` (the filler upstairs is already
  decided and lies over the wrong thing).
- World 7 becomes 7 levels, mixed, order chosen so it is not guessable:
  spine (possible), nofill (impossible: hole), **almostring** (possible, looks like nofill), wedge (possible),
  **squarehole** (impossible: hole), parallel (impossible: unrelated), square (possible, boss).
- World 8 gains **nocancel** (impossible: nocancel — `cancel`'s data with kan off, nothing iso) and
  **backpath** (impossible: onesided — f:a→b, g:b→a, given (f,g,1_a), goal (g,f,1_b), no kan/joyal; the
  walking retraction) placed before `twosided`, which shows what *does* suffice.
- New level data:
  - `almostring`: a,b,c; f:a→b, g:b→c, h:a→c, x:a→c; given (f,g,x), (x,1_c,h). tools compose, tetra, theorems.
    goal (f,g,h). (substitute h for x)
  - `squarehole`: a top-left, b top-right, c bottom-left, d bottom-right; f:a→b, g:b→d, u:a→c, v:c→d.
    tools compose, tetra, theorems. goal {triangles:[[f·g composite '?x'],[u,v,'?x']]} i.e. both composites
    homotopic: patterns [f,g,?x],[u,v,?x]. impossible (reason hole).
- Brute-force tests as before (impossible levels unsolvable at depth ≥ 4 with all tools, other levels nothing
  under par).

## 5. New world: Lifting (between "Possible or not?" and "The licence")
A **map** p: X → S. The board splits: X on top, S ("the shadow") below, faint vertical guides; every X dot,
arrow and triangle is coloured/labelled by what it lies over (hover shows its shadow lit below).
S never changes. Engine:
- level fields `base: {vertices, edges, triangles}` (S, strict, ids prefixed `S.`), `proj: {xId: sId}` for X's
  given dots and arrows (triangles project through their edges).
- In a level with `base`, every new X simplex must lie over an existing S simplex: compose f,g looks for S
  triangles (p f, p g, ?); none → fail "No triangle below to lift"; one → the new arrow lies over its third edge;
  several → options (UI chips, solution option index). horn0/horn2 and tetra claims likewise.
- Goal patterns may carry a 4th entry, an S triangle id: the X triangle must lie over it.
Levels (world 9; worlds after it renumber):
- `shadow` [intro] X: f:a→b, g:b→c over S: f̄,ḡ with one S triangle (f̄,ḡ,x̄). tools compose. goal [f,g,?x].
- `lift` [puzzle] S has two triangles over (f̄,ḡ): x̄ and ȳ. goal [f,g,?x,'S.t2'] (choose the right lift).
- `nolift` [puzzle, claimable] X is strict with table {f,g → z}, z lies over x̄; goal [f,g,?w,'S.t2'] over ȳ.
  impossible, reason `shadow`.
- `liftfill` [puzzle] a lifting problem for an inner 3-horn: S has a solid tetrahedron, X has three of the faces
  over it; fill the fourth upstairs over S's fourth face. tools tetra. (Kerodon: inner fibration.)
- `liftiso` [boss] Joyal's lifting form for Λ²₀: S has triangle (f̄, ḡ, h̄); X has f (iso) over f̄ and h over h̄;
  joyal on; tools horn0(Solve), tetra, theorems. goal [f,?g,h,'S.t1'].
The Licence world's final boss `joyal` stays last; the epilogue states Joyal's theorem in extension and lifting
form and points back to `liftiso`.

## 6. Learning between puzzles
- **Notes**: optional theory pages, shown on the map as 📖 entries between levels and auto-offered (not forced)
  before the level they precede. 150–350 words each, short paragraphs, with small diagrams. Content in
  `HC.Notes = [{id, before: levelName, title, body: [block]}]` where a block is `{p: html}`, `{diagram: spec}`,
  or `{demo: id}`; `spec` is a tiny declarative picture: `{dots:[{id,label,x,y}], arrows:[{from,to,label,dashed?}],
  fills:[[a,b,c]], ghost?:[[a,b,c]]}` drawn by the UI in the board's style. Demos (UI-built, small, interactive):
  `horn-fill` (drag a missing edge into a horn; a non-example where it can't close), `split-vertex`
  (pull a′ off a), `tetra-3d` (spin a labelled Δ³), `order-maps` ([1]→[2] maps as arrows in Δ²).
  Required notes (in this order): arrows & composition (g∘f reads right to left, why we also write f·g);
  what a filled triangle means (a witness; *a* composite not *the*; why composition stops being an operation);
  equality vs equivalence (homotopy, isomorphism, equivalence, with everyday and maths examples);
  simplices (Δⁿ as the ordered set 0<1<…<n; faces; order-preserving maps; degenerate simplices = identities);
  horns and the notation Λⁿₖ (n dimension, k the missing face opposite vertex k; inner vs outer; filling as
  extending a map; **counterexamples where a horn does not fill**: two composable arrows with nothing in between,
  a hollow triangle, a one-way arrow); quasi-categories (definition, examples: nerves, Kan complexes;
  non-examples); Kan complexes & ∞-groupoids (spaces); the nerve; skeleta & cells; maps & lifting problems
  (the square diagram); anodyne maps; Joyal's theorem (= epilogue).
- **World briefings**: entering a world the first time shows a small panel (and it stays reachable from the
  world header): `title`, "So far: …", "Now: …", "New: …" (one line each) and a link to that world's first note.
- **Glossary**: grouped by world in the order terms are met; entries `{term, world, essential, plain, formal}`.
  When an `essential` term unlocks, a toast "New word: homotopy" that opens the entry when tapped.
- Win panel: bullets, term, and (math mode) proof — plus "Read the note on …" when a note follows.

## 7. Engine API additions (summary)
`rename`, `origin` on edges, `tetraFromFacts`, `base`/`proj`/lift logic + options, goal 4th entry,
`claimImpossible(state, reasonId)` (wrong reason → `{ok:false, reason, wrongReason:true}` and counts a move),
`level.reasons` (3 ids, first is right — UI shuffles), `parHidden` derived from `claimable`. Plain and math
text for every fact/goal part (`plain` uses `f·g ≃ x`, `x ≃ y`; `text` math form).
