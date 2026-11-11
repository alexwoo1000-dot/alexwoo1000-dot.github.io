# HORNFILLER v6 — solids as facts, 4-horns, subcategories (extends SPEC5; work in this repo folder)

Source: the user's course notes ("The language of category theory", SM7 exercises). Two new worlds.

## A. World "Solids" (mathTitle: Inner horns Λ⁴ₖ). Opens after Homotopy.
Until now a tetrahedron was only a way to get a triangle. Here tetrahedra (3-simplices) are facts in their own
right, and four of them force a fifth.

### Engine
- Every tetrahedron gets a name `τ₁, τ₂, …` (given first, then creation order; like σ for triangles) and
  `faces: [d0, d1, d2, d3]` as triangle refs (real ids or free refs like `s1:g`), normalised so equal triangles
  compare equal. `Engine.describeSolid(state, ref)` → `{name, faces:[refs], faceNames:[…], vertices, text}`.
- **Degenerate solids.** For a triangle σ on corners (0,1,2), `s₀σ, s₁σ, s₂σ` are the tetrahedra on
  (0,0,1,2), (0,1,1,2), (0,1,2,2). Refs `S0:<triRef>`, `S1:…`, `S2:…`; they are free (always exist), and their
  four faces follow from the simplicial identities (compute them from the repeated-corner picture; faces that are
  degenerate triangles are free refs). `Engine.degenerateSolids(state, triRef)` lists the three with faces.
- **4-horn filling.** A 4-simplex has corners 0..4 and five tetrahedral faces D₀..D₄ (Dᵢ omits corner i).
  `Engine.fill4Options(state, [four solid refs])` / `Engine.fill4(state, refs, option=0)`: try every way of placing
  the four solids as four of the Dᵢ so that all shared triangles agree (by identity, not just boundary). The
  missing Dₖ must be inner (k = 1, 2, 3) unless `level.kan`. Its four faces are then all determined; add that
  tetrahedron (kind `fill4`), named τₙ. Fail nicely if the solids don't fit, if it is an outer horn, or if that
  solid already exists. `candidates(state, 'fill4', picks)` for the UI.
- **Goals.** `goal.solids: [[d0, d1, d2, d3], …]` (triangle refs; each entry may also be a `'?'`-variable shared
  between patterns): satisfied when a tetrahedron with those faces exists (degenerate ones count only if
  materialised by being used; a goal that is a free solid is pointless, tests should forbid it).
  `checkGoal().parts` gets `{kind:'solid', verb:'prove', faces, faceNames, name, done}`.
- Given triangles with the same boundary must be fully supported as distinct facts everywhere (candidates,
  tetra faces, goals): two different homotopies `(x, 1_c ; y)` are the point of level `twohomotopies`.

### Levels (engine agent finalises data, verifies by running, sets par by search)
1. `solidfact` [intro] — the existing `tetra` picture; goal is the solid itself: `goal.solids` with the four
   named faces. One Tetrahedron move. Teaches "the solid is a fact too" and shows τ₁ in a Solids list.
2. `thicken` [intro] — one triangle σ₁ = (f, g ; x). Goal: pick, from σ₁'s three degenerate solids, the one whose
   faces d₂ and d₃ are both σ₁ (answer s₂σ₁… compute it; the `pick` goal type extended to solid refs).
3. `pentagon` [puzzle] — Δ⁴ drawn as a pentagon a,b,c,d,e with all 10 arrows and all 10 triangles given, and
   four of its five solids given (the inner one D₂ missing). Goal: the fifth solid. One 4-horn move, but the
   player must find which four solids fit (add one decoy solid elsewhere if it can be made honest).
   `maxCrossings` as needed.
4. `twohomotopies` [puzzle] — SM7 exercise (2), "Comp(f, g) is contractible", one level up from `unique`.
   Given σ₁ = (f, g ; x), σ₂ = (f, g ; y), two different homotopies η = (x, 1_c ; y), η′ = (x, 1_c ; y), and the
   solids τ₁ (faces s₁g, η, σ₂, σ₁) and τ₂ (faces s₁g, η′, σ₂, σ₁). Goal: a solid with faces
   (s₀1_c, s₁y, η′, η): a homotopy between the two homotopies. Proof: the 4-simplex on (a, b, c, c, c) with
   D₄ = τ₁, D₃ = τ₂, D₂ = s₂σ₂ (degenerate), D₀ = the degenerate solid of s₁g on (b, c, c, c); the inner horn Λ⁴₁
   gives D₁. The puzzle is finding the two degenerate solids.
5. `pentagonproof` [boss] — Mac Lane's pentagon from scratch: four arrows in a row and enough given composites
   that the player builds the remaining triangles and four solids with Compose/Tetrahedron, then closes the
   4-simplex with one 4-horn. Aim for par 6–8; tune with the search (cap search depth sensibly, say how).

## B. World "Subcategories" (mathTitle: Subcategories and the groupoid core). Opens after Undo everything.
A new kind of puzzle: **select**. The board is fixed; the player marks arrows and presses Check.

### Engine
- `goal.select: { edges: [ids], prompt: <id> }`; `Engine.checkSelect(state, ids)` → ok when the set is exactly
  right (sets `flags.selected`); otherwise `{ok:false, extra:n, missing:m}` counts only, and a penalty move.
- `Engine.closure(state, seedIds)` → the smallest set of arrows containing the seeds and all identities that is
  closed under composition (kept a, b and any triangle (a, b ; c) ⇒ c) and under homotopy (c kept and a triangle
  (c, 1 ; d) or (d, 1 ; c) ⇒ d). Used by tests to verify `subcat` answers.
- `Engine.provableEquivalences(state)` → arrows with a two-sided inverse derivable from the facts on the board:
  start from pairs with both inverse triangles, close under composition, homotopy and inverses, and "a one-sided
  inverse of an equivalence is an equivalence". Used by tests to verify `core` answers.

### Levels
1. `fullsub` [intro] — "Full subcategory spanned by a and c": select every arrow with both ends in {a, c}.
2. `subcat` [puzzle] — seeds f, g: select the smallest subcategory containing them. The board has two composites
   x, x′ of (f, g), an arrow w with x′ ≃ w, an unrelated parallel arrow h, and an arrow leaving c. Answer by closure.
3. `subcat2` [puzzle] — a harder closure where a composite of two kept arrows only appears after using a homotopy,
   and one tempting arrow is a composite of a kept arrow with an unkept one.
4. `core` [boss] — "Select exactly the arrows that the facts force to be equivalences." Include: a pair with both
   inverse triangles; an arrow homotopic to one of them; a composite of two equivalences; a one-sided inverse
   pair (neither forced); an arrow that is a one-sided inverse of a known equivalence (forced).

## UI
- A **Solids** section in the facts panel (names τᵢ, the four face names, a mini picture or the 3D view on
  click) and, under each triangle fact, a small "degenerate solids" disclosure listing s₀σ, s₁σ, s₂σ.
- Tool **4-simplex** (key `4`… pick a free key): pick four solids; a panel shows the five faces D₀–D₄ of the
  4-simplex on corners 0–4 (drawn as a pentagon with all diagonals), which solid sits in each, and the forced
  fifth with a Fill button; outer ones locked unless kan. Never auto-choose when ambiguous.
- Goal lines for solids: `Prove a solid with faces (σ₃, s₁y, η′, η)` with face pictures.
- **Select** levels: clicking an arrow toggles "kept" (clearly marked), a Check button, and the counts-only
  feedback. No other tools.
- World map: the two new worlds with their prerequisites (HC.WorldNeeds in text.js; the prose agent owns that
  file — coordinate through the main session).
