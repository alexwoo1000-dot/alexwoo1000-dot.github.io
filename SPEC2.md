# HORNFILLER — expansion spec (read SPEC.md first; this extends it and wins on conflict)

Goal: carry the player from the existing 13 levels to **nerves, skeleta, anodyne maps and the statement of
Joyal's theorem**, while staying fun for someone with no background. Fun and clarity beat coverage: every new
idea arrives as a toy the player pokes, never as a definition to read.

Existing files/owners are unchanged (engine.js, levels.js, test.js / text.js / index.html, style.css, ui.js).
Node here is `C:\Users\imidazoliumeow\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin\node.exe`.

## Things already changed since SPEC.md (keep them)
- Levels have numeric `id` and string `name`; text is keyed by `name`. Given triangles are `G1,G2…`.
- `compose` names its new arrow with a fresh letter: pool `level.names` (optional) then `x y z w u v p q r s t m n`,
  skipping labels in use; a second filler of the same horn is the first one's label + `′`.
- The site was restyled to a deliberately plain, light, "hand-written HTML" look (serif text, underlined links,
  1px borders, no cards/gradients/stamps; colour and animation live only in the board). KEEP THAT LOOK.

## Label conventions (all three agents)
- Identity arrow of vertex v: engine label is ALWAYS the string `1_v` (e.g. `1_a`, `1_b`). The UI renders
  `1_v` as 1 with a real subscript (SVG tspan / HTML `<sub>`) everywhere. Prose writes `1<sub>a</sub>`.
- horn0 result: `h/f`, or `f⁻ᴸ` when e02 is an identity. horn2 result: `g\h`, or `g⁻ᴿ` when e02 is an identity.
- Composites are x, y, z… (see above). In level `unit` the composite is `k`.

## TEXT DIET (user feedback: "a lot of text and exposition, hard to parse; simple bullets and teaching through
## game design is easier"). This overrides every word limit in SPEC.md.
Prose shape is now, for EVERY level (old ones rewritten too):
```
HC.Text[name] = { title,            // ≤ 4 words
  bullets: [..],                    // 1–2 bullets, each ≤ 12 words, plain words, no jargon. What's new / what to try.
  hints: [..],                      // 2 hints, each ≤ 14 words; the 2nd is the click sequence
  win: [..],                        // 1–2 bullets, each ≤ 14 words: what you just showed
  term }                            // the real-math name, ≤ 4 words (shown small, as a collectible)
```
No `story`, no `goalText` (the goal is ONLY the visual checklist). World blurbs ≤ 10 words. Glossary `plain`
≤ 14 words. Only the epilogue may be a paragraph. If a bullet needs a comma-heavy sentence, the level design
is carrying too little: say less.

UI carries the teaching instead:
- No intro modal. Level 1 starts with the tool already selected and the first thing to click gently pulsing.
- Whenever a level has exactly one tool it is pre-selected. The first time a tool appears in the game, its
  button pulses once and the next valid click targets pulse until the player's first successful move.
- While a tool is active, valid next picks are visibly "live" and invalid ones dim (e.g. after picking f in
  Compose, only arrows starting where f ends stay lit; in Fill tetrahedron, cards that cannot fit with the
  picks so far dim). This is the main teaching device: the player sees what a horn is by what lights up.
- Bullets render as a plain `<ul>` above the board; win panel is title + bullets + term + Next. Toasts ≤ 10 words
  (engine messages too: rewrite them short).
- Goal checklist items are compact pictures/notation (`g∘f ⇒ ?`), never sentences.

## Engine additions
New level fields
- `strict: true` + `table: {"f,g":"h"}` (edge ids). In a strict level `compose(f,g)` does NOT create an arrow:
  it looks up the table and adds triangle (f,g,table[f,g]) (kind `compose`). Composing with an identity gives the
  thin triangle. If that triangle already exists: fail with a friendly "in a rulebook there is exactly one
  answer, and you already have it" AND set `state.flags.uniqueRefused = true`. No table entry: friendly fail.
- edge field `iso: true` (a reversible arrow, drawn with a ≅ mark by the UI).
- `joyal: true`: `horn0` requires e01.iso, `horn2` requires e12.iso (friendly fail otherwise). In `fill3`, an
  outer horn is allowed when `level.kan`, OR missing d0 and the tetra's e01 is iso, OR missing d3 and e23 is iso.
- `claimable: true`: UI shows a "This can't be done" button (see claimImpossible).
- `state.flags` object (survives undo is fine).

New moves (same result shape as before; all undoable)
- `addVertex(state, x, y)` → new vertex id `v1…`, label = next unused lowercase letter.
- `addEdge(state, srcId, dstId)` → new edge kind `drawn`, label next unused of `f g h p q r s t u v w`; src≠dst;
  at most 2 parallel drawn/given edges per ordered pair.
- `cell2(state, [e1,e2,e3])` "glue a triangle": the three edges, in any order, must form a triangle boundary
  (find the assignment e01,e12,e02). Adds a triangle kind `cell`. At most 2 triangles on the same boundary.
- `peel(state)` removes all simplices of the current top dimension: tetras if any; else all non-thin triangles
  (thin ones go too once no non-thin remain... simply: remove ALL triangles); else all edges. Fails on dots only.
- `claimImpossible(state)` → ok only if `level.goal.impossible`; sets `flags.claimed`. Otherwise
  `{ok:false, reason:"It can be done. Keep going!"}`.
- If several different triangles could result from `fill3` on the same three cards, repeated calls must yield
  them one after another (already implied by "prefer a result that does not exist yet").

Goal object may combine (all must hold):
`triangles` (as before), `edges: [[src,dst],…]` (each matched by a distinct non-identity edge),
`counts: {edges?, triangles?, tetras?}` exact numbers of NON-degenerate simplices (identity edges and thin
triangles don't count), `min: {…}` same but minimum, `flag: 'uniqueRefused'`, `impossible: true` (done iff
`flags.claimed`). `checkGoal` additionally returns `parts: [{kind, text?, done}]` so the UI can tick each part.

Solution steps may be prefixed with `'!'` (`['!','compose','f','g']`) = this step is expected to FAIL.
Other new step forms: `['addEdge','a','b']`, `['cell2',['f','g','h']]`, `['peel']`, `['claim']`.

## New levels (append after the 13; sandbox moves to the end as world 8, all tools incl. addVertex/addEdge/cell2/peel)
World 4 — Rulebooks (the nerve). `strict: true`.
14 `nerve` — a,b,c; f:a→b, g:b→c, h:a→c; table {f,g→h}; tools compose; goal [f,g,h].
15 `onlyone` — same picture. goal: triangle [f,g,h] AND flag uniqueRefused. ("Try to break it: find a second
   answer.") solution: compose f g; ! compose f g.
16 `nerve3` — a,b,c,d; f,g,h in a row plus p:a→c (label `gf`), q:b→d (label `hg`), r:a→d (label `hgf`);
   table {f,g→p; g,h→q; p,h→r; f,q→r}; tools compose, fill3; goal all four triangles + min tetras 1.

World 5 — Bones (skeleta and cells)
17 `outline` — dots a,b,c only; tools addEdge; goal edges [[a,b],[b,c],[a,c]].  (∂Δ², the 1-skeleton of Δ²)
18 `disc` — hollow triangle f,g,h (a→b,b→c,a→c) given; tools cell2; goal [f,g,h].  (attach a 2-cell)
19 `sphere` — same hollow triangle; tools cell2; goal counts {triangles:2}.  (two discs on one rim = a sphere)
20 `peel` — a complete tetrahedron given (4 dots, 6 edges, 4 triangles, 1 tetra); tools peel, cell2;
   goal counts {tetras:0, triangles:1, edges:6}.  (peel to sk₂ = hollow, peel to sk₁ = wireframe, glue one face back)

World 6 — Harmless moves (anodyne). `claimable: true` on all three.
21 `spine` — f,g,h in a row; tools compose, fill3; goal as `assoc` + min tetras 1. (spine ⊂ Δ³ is inner anodyne)
22 `square` — a,b,c,d as corners (a top-left, b top-right, c bottom-left, d bottom-right); f:a→b, v:b→d, u:a→c;
   kan true; tools compose, horn0, horn2; goal [f,v,?x],[u,?w,?x]. (compose f,v; horn0 u,x)
23 `nofill` — hollow triangle f,g,h; tools compose, identity, fill3; goal {triangles:[[f,g,h]], impossible:true};
   solution [['claim']]. (∂Δ² ⊂ Δ² is NOT anodyne: horn moves never change the shape, and a ring is not a disc)

World 7 — The licence (Joyal)
24 `detour` — a,b,c; f:a→b (iso:true), g:b→a, `id:a` given, triangle G1=(f,g,id:a) given, h:a→c; kan false;
   tools compose, identity, fill3; goal [f,?w,h].
   (compose g,h→w; identity h; fill3 on G1,(g,h,w),s0:h — tetra a,b,a,c, inner horn Λ³₂ gives (f,w,h))
25 `joyal` — a,b; f:a→b iso:true; joyal:true, kan false; tools identity, horn0, fill3;
   goal [f,?g,id:a],[?g,f,id:b].
   (identity a; horn0 f,1_a → g; identity f; fill3 on (f,g,1_a), s0:f, s1:f — outer horn Λ³₀, legal because its
   first edge f is ≅ — gives (g,f,1_b))
26 `sandbox`.

## UI additions
- Tools: `addEdge` "Draw arrow" (click start dot, end dot), `addVertex` "Add dot" (sandbox), `cell2` "Glue
  triangle" (click three arrows that close up), `peel` "Peel" (one click, with a satisfying fall-away animation),
  and for `claimable` levels a quiet "This can't be done" button next to Hint (calls claimImpossible; a wrong
  claim just toasts the reason).
- Strict levels: show the level's `table` as a tiny "Rulebook" list in the side column (`g∘f = h`).
- iso arrows carry a small ≅ on the arrow; joyal-level tool hints mention it.
- Goal checklist renders every goal part (use `checkGoal().parts`; write the human text in the UI or take
  prose's `goalParts` if present).
- Level map handles 8 worlds; after winning `joyal` the win panel offers "Read the ending", an epilogue page
  rendered from `HC.Epilogue` (also reachable from the map once unlocked).
- A "skeleton view" control on world-5+ levels and the sandbox: sk₀ / sk₁ / sk₂ / all — purely visual, hides
  simplices above that dimension on the board and in Facts.

## Prose additions (`text.js`)
(Shape per TEXT DIET above.) `HC.Worlds` now 8 entries; `HC.Text` for all 26 names; glossary gains nerve, skeleton, boundary, cell, anodyne,
inner anodyne, spine, isomorphism/equivalence, Joyal's theorem, lifting problem.
`HC.Epilogue = {title, html}`: ≤ 220 words. States Joyal's theorem plainly (in an ∞-category, a horn Λⁿ₀ whose
first edge is an equivalence can always be filled, n ≥ 2; conversely an edge with that property is an
equivalence — so "∞-groupoid = ∞-category where every arrow is reversible"), mentions the relative "lifting"
form in one sentence (the same holds for lifting against an inner fibration; anodyne maps are exactly what
lifts against Kan fibrations), and points to kerodon.net for more.

# PUZZLE PASS (added later; wins over everything above)
User feedback: "design actually good puzzles". Tutorial levels stay short, but every world now ends in real
puzzles: the goal is one fact, the player must find WHICH tetrahedron proves it and which free (thin) facts it
needs. No level text may give the method away; only hint 2 does.

## Mechanics added for puzzles
- **Par.** Each level has `par` = number of successful moves in its solution. UI shows `moves 3 · par 3` and
  marks a level solved-at-par with a star on the map. Purely for replay; never blocks.
- **Fill choices.** `Engine.fill3Options(state, [t1,t2,t3])` → array of distinct new results
  `{e01,e12,e02, missing, text}`; `fill3(state, tris, optionIndex=0)` picks one. When there is more than one
  option the UI shows them as small buttons ("fits two ways: …") instead of guessing. Solutions may give the
  index: `['fill3',[…],1]`.
- **Blanks.** Strict levels may have `blanks: [['f','q']]`: pairs missing from `table`. The Rulebook shows them
  as `q∘f = ?`; compose on a blank fails gently ("the rulebook is blank here"); when a triangle (f,q,r) appears
  by fill3 the blank fills in with a little flourish.
- **Possible or not.** `claimable: true` levels show "This can't be done" (already specified). Now used as a
  real decision: some claimable levels are possible, some are not, and the player has to work out which.
- Decoy arrows/tools are fine where listed. Don't add others.

## Final level list (34). Existing level data unchanged unless stated. New ones marked NEW.
World 1 Arrows: compose, chain, identity
World 2 Triangles are proofs: twoways, tetra, assoc, unique, unit, symmetric, transitive, then
- NEW `swap` — a,b; f,g parallel a→b; id:b given; G1=(f,id:b,g). tools identity, fill3. goal [id:a,f,g].
  (identity f; fill3 on G1, s0:f, s1:f → tetra a,a,b,b, missing d2)
- NEW `whisker` — a,b,c; f,k parallel a→b; g:b→c; x:a→c; id:b given; G1=(f,id:b,k), G2=(f,g,x).
  tools identity, fill3. goal [k,g,x].  (identity g; fill3 on G1,G2,s0:g → tetra a,b,b,c, missing d1)
- NEW `relay` — a,b,c,d; f:a→b, g:b→c, h:c→d; x and x2 (label x′) both a→c; z:a→d;
  G1=(f,g,x), G2=(f,g,x2), G3=(x,h,z). tools compose, identity, fill3. goal [x2,h,z].
  (identity g; fill3 G1,G2,s1:g → (x,1_c,x2); identity h; fill3 on that, G3, s0:h → tetra a,c,c,d missing d1)
World 3 Undo everything (kan): undo, divide, inverses, then
- NEW `cancel` — a,b,c; f,k parallel a→b; g:b→c; x:a→c; G1=(f,g,x), G2=(k,g,x). kan. tools identity, horn0,
  horn2, fill3. goal [f,id:b,k].  (identity g; fill3 G1,G2,s0:g → outer horn missing d3)
World 4 Rulebooks (strict): nerve, onlyone, then
- CHANGED `nerve3` — as specified but table = {f,g→p; g,h→q; p,h→r}, blanks [['f','q']], plus a decoy arrow
  s:a→d. tools compose, fill3. goal [f,q,r] + min tetras 1. (compose f,g; g,h; p,h; fill3 → blank fills in)
World 5 Bones: outline, disc, sphere, peel
World 6 Possible or not? (anodyne; all claimable)
- `spine` (possible)
- `nofill` (impossible)
- NEW `wedge` — a,b,c,d; f,g,h in a row; x:a→c; z:a→d; G1=(f,g,x), G2=(x,h,z). tools compose, identity, fill3.
  goal min tetras 1.  (possible: compose g,h→y; fill3 G1,(g,h,y),G2)
- NEW `parallel` — a,b; f,g parallel a→b. tools compose, identity, fill3. goal {triangles:[[f,id:b,g]],
  impossible:true}.  (nothing relates two unrelated arrows)
- `square` (possible, kan)
World 7 The licence (Joyal; all claimable)
- NEW `oneway` — a,b; f:a→b. kan false. tools compose, identity, fill3. goal {triangles:[[f,'?g',id:a]],
  impossible:true}.  (inner tools never make an arrow point backwards)
- `detour`
- NEW `mono` — same data as `cancel` but kan false, joyal true, g has iso:true; tools identity, fill3.
  goal [f,id:b,k].  (outer horn missing d3 is legal because e23 = g is ≅)
- `joyal`
World 8: sandbox

test.js: bounded brute force (depth ≥ 4, all listed tools, all fill3 options) must NOT solve the three
impossible levels, and must solve nothing in fewer moves than `par`.

# PACING PASS (latest; wins over everything above)
User: "you want the puzzles to be actually fun and hard and paced" + "a toggle between Kerodon-style math
explanations and puzzle solving that makes sense to a normal person".

## Pacing: every world is intro → practice → twist → boss
Each level gets `kind: 'intro' | 'puzzle' | 'boss'`. Intro levels teach one click and are guided (live targets,
dimming). In `puzzle` and `boss` levels the Fill-tetrahedron tool does NOT dim or pre-light cards: the player
must work out which three facts close up (a wrong triple gets a small shake and "these don't close up").
Arrow/dot tools keep their live targets everywhere. The map marks bosses (★ outline) and shows par stars.

## Final worlds and order (9 worlds, 37 levels)
1 Arrows: compose(intro), chain(intro), identity(intro)
2 Triangles are proofs: twoways(intro), tetra(intro), assoc(puzzle), unique(puzzle), unit(puzzle), NEW bracket(boss)
3 Same up to wiggle (homotopy): symmetric(intro), transitive(puzzle), swap(puzzle), whisker(puzzle), relay(puzzle),
  NEW doublewhisker(boss)
4 Undo everything (kan): undo(intro), divide(intro), inverses(puzzle), cancel(boss)
5 Rulebooks: nerve(intro), onlyone(intro), nerve3(puzzle)
6 Bones: outline(intro), disc(intro), sphere(puzzle), peel(puzzle)
7 Possible or not?: spine(puzzle), nofill(puzzle), wedge(puzzle), parallel(puzzle), square(boss)
8 The licence: oneway(puzzle), detour(puzzle), mono(puzzle), NEW twosided(boss), joyal(boss)
9 Playground: sandbox

NEW levels
- `bracket` — a,b,c,d; f,g,h in a row; x:a→c, y:b→d, z:a→d, w:a→d; G1=(f,g,x), G2=(g,h,y), G3=(x,h,z),
  G4=(f,y,w). tools compose, identity, fill3. goal [z,id:d,w].
  (fill3 G1,G2,G3 → (f,y,z); identity y; fill3 on (f,y,z), G4, s1:y → (z,1_d,w))
- `doublewhisker` — a,b,c; f,k parallel a→b; g,m parallel b→c; x:a→c; id:b, id:c given;
  G1=(f,id:b,k), G2=(g,id:c,m), G3=(f,g,x). tools compose, identity, fill3. goal [k,m,x].
  (identity g; fill3 G1,G3,s0:g → (k,g,x); identity x; fill3 on (k,g,x), G2, s1:x → (k,m,x))
- `twosided` — a,b; f:a→b; g:b→a; k:b→a; id:a, id:b given; G1=(f,g,id:a), G2=(k,f,id:b). kan false, not joyal.
  tools compose, identity, fill3. goal [g,f,id:b].
  (identity g; fill3 G2,G1,s0:g → (k,1_a,g); identity f; fill3 on that, G2, s0:f → (g,f,1_b))

## Plain / Math toggle
A switch in the top bar, remembered. Plain mode is the game as specified. Math mode keeps the same puzzles but
speaks Kerodon:
- above the board: `HC.Text[name].math.say` (formal statement) instead of the bullets; after solving, the win
  panel adds `math.proof`.
- world titles use `mathTitle`; tool names become `Λ²₁`, `s₀/s₁` (degeneracy), `Λ²₀`, `Λ²₂`, `Λ³ᵢ`, `∂Δ² ↪ Δ²`
  (glue), `sk` (peel); fact cards read as simplices (`σ: d₂=f, d₀=g, d₁=x`), tetra pop names the horn it
  filled (`Λ³₁`, from the tetra's `missing`), goal checklist the same way; glossary shows `formal` first.
- Nothing about solvability changes between modes.
