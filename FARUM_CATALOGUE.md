# FARUM catalogue: course-note exercises as HORNFILLER levels

Sources (all read in full, every page):
- **SM1**: `Simplicial_methods_1-print.pdf` (2 pages)
- **SM2**: `Simplicial_methods_2_print.pdf` (2 pages)
- **INF**: `infinity_categories_farum_1_print.pdf` ("∞-categories 1", 4 pages)

Conventions used below (the game's own): a triangle is written `(e01, e12, e02)` = `(d2, d0, d1)`, i.e. "e02 is a
composite of e01 then e12". `1_a` is an identity (a degenerate edge). Moves: **Compose** (inner Λ²₁), **Solve L/R**
(Λ²₀ / Λ²₂; needs `kan`, or `joyal` + iso), **Tetra** (fill a 3-horn from three faces; outer faces locked unless
kan/joyal-iso), theorems **Same / Flip / Link / Swap in**, **Draw arrow**, **Glue** (cell2), **Peel**, strict levels
(composition table), claimable "This can't be done" + reasons, Lifting (`base`/`proj`).

Each item: **Statement** · **Play** (what the player does) · **Mech** (existing / new mechanic needed) ·
**Fun/Diff** (fun 1–5 / difficulty 1–5) · **Pre** (prerequisites) · **CE** (counterexamples / traps).
Items that are only definitions are marked *(def)*: they become Notes or glossary entries, not levels.

New mechanics the catalogue keeps asking for (defined once here, referred to by name):
- **COUNT**: a panel "how many (non-degenerate) k-simplices?" per dimension, or "tap every non-degenerate simplex"
  on a drawn picture; checked against the true numbers.
- **NAME**: a simplex of Δⁿ shown as a vertex string like `(0,0,1,2,2)`; the player writes its Eilenberg–Zilber form
  (non-degenerate core + surjection) or a degeneracy word `s_i…`.
- **VERDICT**: a decision panel ("nerve? quasi-category? Kan complex?") where a "no" must come with a **witness**:
  the player picks a horn on the board and the engine checks it has no filler (or, for "not a nerve", two
  different fillers).
- **PAINT** (a better "This can't be done"): the player proves impossibility by giving a *counter-model*: they
  colour every dot with an object and every arrow with a morphism of a small strict **test category** (a palette
  with a composition table), so that every given triangle commutes and every arrow marked ≅ becomes invertible.
  The engine then checks that the goal fails in the palette (no choice of `?` morphisms makes it commute).
  Sound because every board move is an inner (or, with kan, any) horn filling, and a nerve N(C) (of a groupoid,
  for kan levels) fills those horns, so the painting extends to everything the player could ever build.
  Lifting version: paint into a set-valued functor (category of elements) for left fibrations.
- **COLLAPSE**: pick an arrow; its two ends become one dot and the arrow becomes an identity (a pushout
  `* ← Δ¹ → X`).
- **HCAT**: the homotopy-category panel: lists, for a chosen pair of dots, the morphisms of hX (strings of arrows
  modulo triangles); the player answers "how many morphisms b→d?" or merges arrows that are equal in hX.
- **INVERT** (strict levels): add a formal inverse to an arrow of a composition table (localization) and explore
  the new table.
- **LICENCE** (lifting levels): the map p: X → S carries a licence: `inner`, `left` (Λⁿ₀ lifts too), `right`,
  `iso` (inner + lift equivalences from a chosen start), `trivial` (every boundary lifts). The licence, not the
  board, decides which lifts are legal.

---

## 1. Simplicial methods 1 (SM1)

### SM1 · "Simplicial methods 1" list

**SM1-1.1 n-simplex** *(def + count)*. Δⁿ = Hom(−,[n]); its m-simplices are the order-preserving maps [m]→[n],
i.e. weakly increasing strings of length m+1 in {0..n}; there are C(n+m+1, m+1) of them.
- Play: COUNT "how many arrows does Δ² have?" (6: three real + three identities) and "how many triangles?" (10).
- Mech: needs COUNT. Fun 3 / Diff 2. Pre: none. CE/trap: answering 3 and 1 (forgetting degenerate simplices).

**SM1-1.2 Boundary** *(def)*. ∂Δⁿ ⊂ Δⁿ: the non-surjective maps [m]→[n] (everything except the top simplex and
its degeneracies).
- Play: "which simplices of Δ² are missing from ∂Δ²?" → exactly the strings that use 0, 1 and 2 (e.g. (0,1,2),
  (0,0,1,2)…). Mech: COUNT/tap. Fun 2 / Diff 1. Pre: 1.1.

**SM1-1.3 i-th horn** *(def)*. Λⁿᵢ: maps whose image is neither [n] nor [n]∖{i}; non-degenerate simplices = all
faces except the top one and the face opposite i.
- Play: already the core of the game (Compose = Λ²₁, Tetra = Λ³ₖ). Glue-building version in Arc B (B2).
- Mech: existing. Fun 3 / Diff 1. Pre: 1.2.

**SM1-1.4 Spine** *(def)*. Iⁿ ⊂ Δⁿ: the chain of edges {i,i+1}. Existing level `spine` (n=3).
- Mech: existing. Fun 2 / Diff 1.

**SM1-1.5 Degenerate simplex** *(def)*. x is degenerate iff x = s_i(y) for some i (image of a surjection).
- Play: on Δ², tap the degenerate edges (the identities). Mech: COUNT/tap. Fun 1 / Diff 1.

**SM1-1.6 Eilenberg–Zilber** *(small prop)*. Every x ∈ Xₙ is θ*(y) for a *unique* pair (θ: [n]↠[m], y non-degenerate).
- Play (NAME): given the 4-simplex `(0,0,1,2,2)` of Δ², give its core `(0,1,2)` and surjection `00122`; then
  write it as a degeneracy word. Twist: find **two different words** for it: `s₃s₀(012)` and `s₀s₂(012)` are both
  correct (simplicial identity s₀s₂ = s₃s₀), while the *pair* (θ, y) is unique. Aha: words aren't unique, the
  EZ pair is.
- Mech: needs NAME. Fun 3 / Diff 2. Pre: 1.5.

### SM1 · sk_n and cosk_n

**SM1-sk.1** sk_n = i_! i*, cosk_n = i_* i*, adjoint; cosk_n X = Hom(sk_n Δ^•, X). Adjunction → *skipped*, but the
concrete formula (cosk_n X)_m = maps sk_n Δᵐ → X gives levels (see SM1-Ex2e).

**SM1-sk.2** sk_n X ⊂ X is the smallest sub-simplicial set containing all m-simplices for m ≤ n.
- Play: Peel a tetrahedron down to sk₁ (existing `peel`). New twist: COUNT shows sk₁∂Δ³ = sk₁Δ³ (SM1-Ex2d).
- Mech: existing (Peel). Fun 2 / Diff 1.

### SM1 · Cells

**SM1-cells** colim sk_n X ≅ X (skip), and sk_n X is the pushout of sk_{n−1}X ← ∐ ∂Δⁿ → ∐ Δⁿ over the
non-degenerate n-simplices ("check in all degrees").
- Play: rebuild a given picture cell by cell: Draw arrows (1-cells, attached to dots) then Glue triangles (2-cells
  attached along a hollow triangle); the goal is "the same picture as the ghost". Gluing two cells on the same
  boundary (sphere) shows cells are not determined by their boundary.
- Mech: existing (Draw arrow, Glue). Fun 2 / Diff 1. Pre: sk.2. Existing levels `disc`, `sphere`.

### SM1 · h and N

**SM1-hN.a** (NC)ₙ = {x₀→…→xₙ} (strings of n composable morphisms).
- Play: strict levels already are nerves; COUNT "how many 2-simplices does N of the category a→b→c (with its
  composite) have, degenerate included?" = number of strings of length 2 = 10 (it is Δ²).
- Mech: existing strict + COUNT. Fun 2 / Diff 2.

**SM1-hN.b** (NC)ₙ^nd = strings with **no identity**.
- Play (COUNT): N(BZ/2) (one dot, loop σ, table σ·σ = 1): one non-degenerate simplex in *every* dimension
  (σ,σ,…,σ). Aha: (σ,σ) is non-degenerate although its composite is the identity. N(BZ/3): 2ⁿ in dimension n.
- Mech: COUNT on a strict board. Fun 4 / Diff 2. Pre: hN.a. CE: "σσ = 1 so (σ,σ) is degenerate" is false.

**SM1-hN.c** hX: objects X₀, morphisms = strings of edges modulo the relation generated by 2-simplices.
- Play (HCAT): "how many morphisms a→c in h(this board)?" for hollow vs filled triangle (2 vs 1). See SM1-Ex3.
- Mech: needs HCAT. Fun 4 / Diff 2.

**SM1-hN.d** N fully faithful, h ⊣ N, bonus h preserves finite products: *skipped* (adjunction / products).

### SM1 · |−| and Sing, Internal Hom, products

**SM1-top** topological simplex, |−| ⊣ Sing: *skipped* (topology/adjunction).

**SM1-ihom** Fun(X,Y)ₙ = Hom(X×Δⁿ, Y); show N Fun(C,D) ≅ Fun(NC, ND).
- Play (concrete case): build Fun(Δ¹,Δ¹): its dots are the 3 order-preserving maps [1]→[1] (`00`, `01`, `11`),
  its arrows are natural transformations (`00⇒01`, `01⇒11`, `00⇒11` + identities), and it is exactly Δ²
  (N of the poset 00 ≤ 01 ≤ 11). Player places the three map-dots and draws the arrows; trap: drawing `11⇒00`
  (not a natural transformation: needs 1 ≤ 0).
- Mech: Draw arrow on labelled dots + a check. Fun 3 / Diff 3. Pre: 1.1. The general isomorphism: skipped.

**SM1-prod** |Δⁿ×Δᵐ| ≅ |Δⁿ|×|Δᵐ|, |X×Y| ≅ |X|×|Y| for Y finite: topology *skipped*; the combinatorial core
(Δⁿ×Δᵐ is triangulated by C(n+m, n) top simplices = staircase paths) is SM1-Ex1b.

### SM1 · Examples ("determine/draw the non-degenerate simplices of")

**SM1-Ex1a Δ¹×Δ¹.** Non-degenerate: 4 dots, 5 arrows (four sides + the diagonal (0,0)→(1,1)), 2 triangles.
- Play: COUNT/tap on the 2×2 grid. Trap: the anti-diagonal (1,0)→(0,1) is **not** an arrow (not ≤ in both
  coordinates). Euler check 4−5+2 = 1.
- Mech: COUNT. Fun 3 / Diff 2. Pre: 1.1, 1.5.

**SM1-Ex1b Δⁿ×Δᵐ.** Non-degenerate k-simplices = strictly increasing chains of length k+1 in the grid
[n]×[m]; top dimension n+m, with C(n+m, n) top simplices (lattice paths).
- Play: Δ¹×Δ²: 6 dots, 12 arrows, 10 triangles, 3 tetrahedra (6−12+10−3 = 1). Player draws the 3 staircase
  paths; each is one tetrahedron.
- Mech: COUNT + "trace a path". Fun 4 / Diff 3. Pre: Ex1a.

**SM1-Ex1c pushout of * ← Δ¹ → Δ² (0,1 ↦ 1,2).** Collapse the edge 1→2 of Δ² to a point *. Non-degenerate:
2 dots (0, *), 2 arrows e = (0→1), e′ = (0→2), now both 0→*, and 1 triangle with faces (e, 1_*, e′).
- Play (COLLAPSE): start with Δ² (f, g, h, filled), collapse g. The triangle becomes `f ≃ h` (a homotopy!).
  Aha: "a homotopy is a triangle with one side squashed". COUNT afterwards: (2,2,1).
- Mech: needs COLLAPSE. Fun 4 / Diff 2. Pre: Ex1a, homotopy levels (W3).

**SM1-Ex1d N(B(Z/2)).** One non-degenerate simplex in each dimension (see hN.b). Fun 4 / Diff 2.

**SM1-Ex1e N(BZ).** Non-degenerate n-simplices = n-tuples of non-zero integers: infinitely many in every
dimension ≥ 1. Play: "how many non-degenerate arrows?" → ∞ (answer button). Fun 2 / Diff 2.

**SM1-Ex2a Δ² ⊔_{∂Δ²} Δ².** A 2-sphere: 3 dots, 3 arrows, 2 triangles on the same boundary. Existing `sphere`.

**SM1-Ex2b sk₂Δ³.** Hollow tetrahedron: 4, 6, 4, no solid. Existing `peel` start/end states.

**SM1-Ex2c sk₁Δ³.** 4 dots, 6 arrows. **SM1-Ex2d sk₁∂Δ³** = the *same* (4, 6): ∂Δ³ already has all edges.
- Play: "spot the difference" between the two 1-skeleta → none. Mech: COUNT. Fun 2 / Diff 1.

**SM1-Ex2e cosk₁(Δ²).** (cosk₁Δ²)ₘ = maps sk₁Δᵐ → Δ² = vertex maps [m]→[2] that send every edge i<j to an edge,
i.e. order-preserving maps: so cosk₁Δ² ≅ Δ² (nerves of posets are 1-coskeletal).
- Play: COUNT "how many 3-simplices does cosk₁Δ² have?" → 15 (= C(6,4), same as Δ²). Trap: 3⁴ = 81 (all vertex
  maps). Companion: cosk₁(∂Δ²) ≅ Δ² too (sk₁∂Δ² = sk₁Δ²): **the coskeleton fills the hole**.
- Mech: COUNT. Fun 4 / Diff 4. Pre: Ex2c, 1.1.

**SM1-Ex3 homotopy categories** (all true; all via HCAT; hX only depends on sk₂X):
- a. h(Δⁿ) = [n]. b. h(∂Δⁿ) = [n] for n ≥ 3 (sk₂∂Δⁿ = sk₂Δⁿ). c. h(∂Δ²) = "a triangle": the free category
  on 0→1→2 and 0→2, which has **two** morphisms 0→2 (h and g∘f).
- d. h(Λⁿᵢ) = [n] for n ≥ 4 (every 2-face {a,b,c} lies in some face d_j with j ∉ {a,b,c}, j ≠ i, since there
  are ≥ 2 other vertices). e. h(Λⁿᵢ) = [n] for 0 < i < n (n = 2: free on 0→1→2; n = 3, i = 1: the missing
  relation 23∘02 = 03 follows from the other three: this is the existing `tetra` level).
- f. h(Λ²₀) = span 1←0→2 (no morphism 1→2). g. h(Λ²₂) = cospan 0→2←1.
- h. **h(Λ³₀) ≠ [3]**: relations 12∘01 = 02, 13∘01 = 03, 23∘02 = 03 give (23∘12)∘01 = 13∘01, but 01 can't be
  cancelled, so there are **two** morphisms 1→3 (13 and 23∘12).
- Play: HCAT "how many morphisms 1→3?" on Λ³₁ vs Λ³₀ (1 vs 2). Fun 5 / Diff 3. Pre: hN.c, tetra levels.
  CE: h(Λ³₀) is the cleanest counterexample in the notes; becomes level E1 (PAINT).

**SM1-Ex4 realizations** (build a simplicial set whose realization is …):
- a. Sⁿ: Δⁿ/∂Δⁿ (one dot, one non-degenerate n-cell with all faces degenerate) or two n-simplices glued along
  their boundary. b. ∨ₙ S^{n−2}: n copies of Δ^{n−2} with all boundaries collapsed to one dot.
- c. **Möbius strip**: one dot x, loops e and h, one triangle (e, e, h) (boundary word e·e·h⁻¹: an "aa" gluing
  = cross-cap, free edge h). d. **RP²**: add a second triangle (1_x, 1_x, h) capping h. Euler checks: Möbius
  1−2+1 = 0, RP² 1−2+2 = 1, S² (Δ²/∂Δ²) 1−0+1 = 2.
- Play: one dot, Draw arrow (loops) + Glue; goal = the exact picture; aha "a Möbius band is 'h is e then e'".
- Mech: existing Draw/Glue but needs Glue to accept loops and identity edges as new non-degenerate cells.
  Topology itself is not checked (only the combinatorial target and χ). Fun 4 / Diff 3. Pre: cells.

**SM1-Ex5 in the image of N?**
- a. Iⁿ (n ≥ 2): **no**: f, g composable, no triangle (Λ²₁ has no filler). (n = 0, 1: yes.)
- b. Sing(S¹): **no**: inner fillers are far from unique (many different singular triangles share a boundary).
  Topological, so a Note only.
- c. **Δ²/Δ^{01}**: dots *, 2; arrows e = (1→2), e′ = (0→2), both *→2; triangle σ = (1_*, e, e′). **Not a nerve**:
  the horn (1_*, e) has two fillers, σ (third edge e′) and the degenerate s₀e (third edge e). In a nerve,
  (1, e, e′) forces e = e′.
- Play: VERDICT with witness. Fun 5 / Diff 3. Pre: EssIm.1. Trap: everything composes, so it "looks" fine.

### SM1 · Kan complexes, essential image of N

**SM1-Kan** Sing: Top → sSet lands in Kan. Topology: *skipped* (Note only).

**SM1-EssIm.1** X ≅ NC for a category C ⇔ every inner horn has a **unique** filler.
- Play: VERDICT levels (Arc C): decide "nerve?" and give a witness (missing or double filler).
- Mech: VERDICT. Fun 4 / Diff 3. Pre: strict world (W5).

**SM1-EssIm.2** X ≅ NG for a groupoid G ⇔ every horn (inner and outer) has a unique filler.
- Play: VERDICT "Kan?" on nerves: N(BZ/3) yes; N({1,e}, e·e = e) (idempotent monoid) no: Λ²₀ (e, 1) needs
  s with s∘e = 1. Fun 4 / Diff 3. Pre: EssIm.1, W4. CE: Δ¹ = N([1]) is a nerve but not Kan.

---

## 2. Simplicial methods 2 (SM2)

### SM2 · The boundary and the horn ("for fun")

**SM2-B.1** ∂Δⁿ is the coequalizer of ∐_{0≤i<j≤n} Δ^{n−2} ⇉ ∐_{i=0}^{n} Δ^{n−1}: the boundary is n+1 faces glued
along their C(n+1,2) shared (n−2)-faces.
- Play: n = 3: four separate triangles lie on the table; glue them edge to edge (6 gluings) into a hollow
  tetrahedron. Each gluing must match direction (a→b onto a→b); trap: a triangle offered upside down
  (reversed edge) can't be used.
- Mech: needs an "identify two arrows" (glue-edges) tool; or reuse Glue on a pre-drawn 1-skeleton (6 arrows,
  4 Glue moves, goal "each arrow in exactly two triangles"). Fun 3 / Diff 2. Pre: cells.

**SM2-B.2** Λⁿₖ is the coequalizer of the same fork with all indices ≠ k.
- Play: glue three triangles; then the game asks which horn you built (Λ³₀/Λ³₁/Λ³₂/Λ³₃) and whether it is inner.
- Mech: as B.1 + horn-name quiz. Fun 2 / Diff 2. Pre: B.1.

### SM2 · RLP, LLP and sat

**SM2-R.0** *(def)* χ_L, χ_R (maps with LLP/RLP against S), sat(S) = χ_L(χ_R(S)).
**SM2-R.1** χ_R χ_L χ_R = χ_R (Galois connection). Formal, no board: *skipped* as a level, used in Notes.
**SM2-R.2** RLP(RLP(∅→*)) in Top: topology, *skipped*.
**SM2-R.3** sat(S) closed under pushout/coproduct/countable composition, small object factorization: *skipped*.
- The usable idea: "anything built from S-pieces by gluing lifts against what S lifts against" is exactly why
  a *sequence of horn fills* (a board solution) is a map in sat(horns): this is the Note behind PAINT.

### SM2 · Fibrations

**SM2-F.1** *(def)* inner/left/right/Kan/trivial fibrations = χ_R of inner horns / Λⁿ_{i<n} / Λⁿ_{i>0} / all horns
/ boundaries; X contractible if X→* is a trivial fibration. → the LICENCE mechanic in Arc G.

**SM2-F.2** Sing(X) → * is a Kan fibration: topology, *skipped*.

**SM2-F.3** A map of simplicial sets is a monomorphism ⇔ injective in every degree (cofibrations).
- Play: VERDICT "is this map injective (a cofibration)?" Trap: two parallel arrows a ⇉ b mapped onto Δ¹ are
  injective on dots but not on arrows → not a mono. Mech: lifting board with a "check map" verdict.
  Fun 2 / Diff 1.

**SM2-F.4 anodyne examples** (all true; these are the best "fill it from almost nothing" levels):
- a. **Δ¹×{0} ∪ ∂Δ¹×Δ¹ → Δ¹×Δ¹ is left anodyne.** Square a=(0,0), b=(1,0), c=(0,1), d=(1,1); given the three
  sides f: a→b, u: a→c, v: b→d. Fill: Compose f,v → x: a→d (inner Λ²₁, triangle (f,v,x)), then Solve-left on
  u with x (Λ²₀: edges u = d2, x = d1, missing w: c→d = d0) → triangle (u,w,x). Two moves, the second needs the
  left licence (Λ²₀). Without that licence it is impossible (nothing leaves c) → twin levels E5/E5b and G3.
  Fun 4 / Diff 3. Pre: W1, W4.
- b. **Δ² ⊔_{Δ¹} Δ² → Δ³ is inner anodyne** (two triangles 012 and 123 glued along edge 12). Given f, g, h, x =
  0→2, y = 1→3 with (f,g,x), (g,h,y). Fill: Compose f,y → z, then Tetra on f,g,h with faces (f,g,x), (g,h,y),
  (f,y,z) → claim (x,h,z) (Λ³₁). Fun 3 / Diff 2. Pre: W2.
- c. **Iⁿ → Δⁿ is inner anodyne.** n = 3 is the existing `spine`. n = 4, up to all 10 triangles: build Δ^{0123}
  as in `spine` (3 composites, 1 claim), then compose 2→3→4 (edge 24), 1→3→4 (14), 0→3→4 (04), then Tetra
  claims 124 (from 123, 234, 134), 014 (from 013, 034, 134), 024 (from 023, 034, 234): 6 composites + 4 claims.
  The fifth tetrahedron 0124 then has all four faces but no solid, and the 4-simplex itself would need a Λ⁴
  tool. Fun 3 / Diff 3 (long; boss-length).
- d. **Δ¹ → N(J) is left anodyne** (J = walking isomorphism; footnote: filtration F₁ ⊂ F₂ ⊂ … each a pushout of
  Λⁿ₀ → Δⁿ). Worked out: N(J) has exactly 2 non-degenerate n-simplices (0101… and 1010…). Step n attaches
  Λⁿ₀ → Δⁿ along (0,1,0,1,…) (n+1 letters): its faces d₁…dₙ are present (degenerate or older), and the step adds
  the n-simplex and its face d₀ = (1,0,1,…). n = 2: adds g = (1→0) and (f, g, 1₀); n = 3: adds (g, f, 1₁) and the
  solid (f,g,f). This is precisely the existing `joyal` boss read as a filtration. Fun 5 / Diff 3. Pre: W4, W9.

### SM2 · Kan complexes

**SM2-K.1** Δⁿ is not a Kan complex for n ≥ 2. **Note: also true for n = 1** (the notes' bound is not sharp):
Λ²₀ → Δ¹ with vertices 0,1,0 (edges 0→1 and 0→0) would need an edge 1→0. Existing `oneway`. Fun 2 / Diff 1.

**SM2-K.2** "Use (NC)ₙ to show NC is a Kan complex." **False as written**: NC is always a quasi-category
(unique inner fillers by composition) and is Kan **iff C is a groupoid**. Counterexample: N([1]) = Δ¹ (K.1).
- Play: VERDICT pair "Is N(C) Kan?" for C = [1] (no: witness Λ²₀ (f, 1₀)) and C = J (yes). Fun 4 / Diff 2.

**SM2-K.3 (Hard)** "Every Kan complex has infinitely many non-degenerate simplices." **False as written**: Δ⁰,
or any discrete set, is Kan with finitely many. True version: a Kan complex with finitely many non-degenerate
simplices is discrete (equivalently: one non-degenerate edge forces infinitely many simplices).
- Play: "Peel never ends": a single non-identity iso σ in N(BZ/2) produces a non-degenerate simplex in every
  dimension. Engine shows dimensions 0–4. Fun 3 / Diff 3. Pre: SM1-hN.b.

### SM2 · Quasi-categories

**SM2-Q.0** *(def)* quasi-category = inner horns fill; objects, morphisms, composition morphisms. The game's W1–W3.

**SM2-Q.1 Equivalence (homotopy).** f ≃ g iff ∂Δ² → C with (id, f, g) fills. Show ≃ is an equivalence relation
and any two composites are equivalent. Existing `symmetric`, `transitive`, `unique` (+ tools Flip, Link, Same).
Fun 4 / Diff 2.

**SM2-Q.2** f is an equivalence if some g has fg ≃ id and gf ≃ id. Footnote: for Kan X, Π(|X|) ≃ hX (*skip*).
Existing W4/W9 (`inverses`, `twosided`).

**SM2-Q.3** hC: objects C₀, morphisms C₁/≃; h ⊣ N (*adjunction skipped*). Composition well defined on classes:
existing `whisker`/`bracket`/`relay`.

**SM2-Q.4** Essential image of N (Cat / Grpd) via h(Δⁿ) ≅ [n], h(Λⁿᵢ) ≅ [n] (n ≥ 4 or inner). Same as SM1-EssIm
and SM1-Ex3 (cross-reference; not double-counted in levels).

### SM2 · Exercise 1 (Composition)

**SM2-Ex1** Composition C^{Δ¹} ×_C C^{Δ¹} → C^{Δ¹} via a section of the trivial fibration Fun(Δ²,C) → Fun(Λ²₁,C);
show it is associative up to homotopy; hint: the maps marked * are (inner) anodyne:
Δ^{01}∪Δ^{12}∪Δ^{23} → Δ^{012}∪Δ^{23} (one Λ²₁), → Δ^{01}∪Δ^{123} (one Λ²₁), Δ^{01}∪Δ^{123} → Δ³,
Δ^{012}∪Δ^{23} → Δ³, Δ^{02}∪Δ^{23} → Δ^{023}, Δ^{01}∪Δ^{13} → Δ^{013}.
- Play: one board, the spine f,g,h, and **two** goal routes that must meet: "left bracketing" (f·g)·h and "right
  bracketing" f·(g·h); a full Δ³ makes them agree. The diagram's interesting arrow is
  **Δ^{01} ∪ Δ^{123} → Δ³**: given f and the full triangle (g,h,y), compose f,g → x, compose f,y → z, Tetra
  claims (x,h,z) (Λ³₁). Existing `assoc` covers the core; a new variant starts from Δ^{01} ∪ Δ^{123}.
- Mech: existing. Fun 3 / Diff 2. The mapping-space framing (P, Map(x,y)) is *skipped*.

---

## 3. ∞-categories 1 (INF)

### INF p.1

**INF-1.0** *(def)* Kan ⊂ QCat ⊂ sSet. Note material (the game's world order already follows it).

**INF-1.1** *(def)* objects, morphisms, composition morphisms (= SM2-Q.0). Existing W1.

**INF-1.2 Equivalence.** ≃ is an equivalence relation; any two composites are equivalent (= SM2-Q.1; existing
`symmetric`, `transitive`, `unique`). Fun 4 / Diff 2.

**INF-1.3** *(def)* hC and N, h ⊣ N (*adjunction skipped*). Existing W5.

**INF-1.4** *(def)* functor = vertex of Fun(C,D); Fun(C,D)₀ = Hom_sSet(C,D). Note only.

**INF-1.5 Map(x,y) and slice C_{x/}** (defined by pullbacks; footnote: Map(x,y) is Kan, C_{x/} and C^{Δ¹} are
quasi-categories).
- Play ("zoom into Map(a,b)"): a second small board whose dots are the arrows a→b and whose arrows are
  homotopies (triangles (f, 1_b, g)). Building it = listing the arrows a→b and drawing one arrow per homotopy
  triangle. Aha: every arrow in Map(a,b) can be reversed (Flip): Map(a,b) is Kan (INF-3.9), the game version of
  "a mapping space is a space".
- Mech: needs a derived "sub-board view"; otherwise existing Flip/Link. Fun 3 / Diff 3. Pre: W3.
  (The pullback definition itself: skipped.)

**INF-1.6 Full subcategory.** For S₀ ⊂ C₀, C_{S₀} (simplices with all vertices in S₀) is a quasi-category.
Reason: every horn Λⁿᵢ (n ≥ 2) already contains all vertices of Δⁿ, so its filler in C has vertices in S₀.
- Play: VERDICT "remove dot c: still a quasi-category?" → yes, always. Contrast INF-1.7, where removing an
  *arrow* can break it. Fun 3 / Diff 2. Pre: Arc C intro.

**INF-1.7 Subcategory.** If S₁ ⊂ C₁ contains identities and is closed under equivalence and composition, then
C_{S₁} (simplices with all edges in S₁) is a quasi-category. (For n ≥ 3 every horn contains all edges; for Λ²₁ the
filler's third edge is *a* composite, which lies in S₁ by the two closure conditions.)
- Play: strict board of the poset [2] (p: 0→1, q: 1→2, r: 0→2). Choose arrows to keep; VERDICT checks. Keeping
  {p, q} without r breaks it (witness: the horn (p, q)). Twist on a non-strict board: keep f, g and a composite x
  but drop a homotopic x′ (x ≃ x′). That violates "closed under equivalence", yet *on that board* the result is
  still a quasi-category (the horn (f, g) still fills with (f, g, x)). The condition is sufficient, not necessary:
  a good "possible or not" twist.
- Mech: VERDICT + keep/remove selection. Fun 4 / Diff 3. Pre: 1.6.

**INF-1.8 Groupoid core** C^≃ = subcategory of equivalences, pullback of N((hC)^≃) → N(hC) (the adjunctions
QCat ⇄ Kan ⇄ sSet: *skipped*).
- Play ("pick the core"): select every arrow that is an equivalence; an inverse justifies a selected arrow, and
  PAINT refutes an unselected one. Level F3.
- Mech: selection + PAINT. Fun 4 / Diff 4. Pre: W4, W9, PAINT.

**INF-1.9 More fibrations** *(defs)*: (a) isofibration = inner fibration with RLP against {0} → Δ¹ for Δ¹ an
equivalence in D; (b) Joyal equivalence (G with FG ≃ id, GF ≃ id); (c) weak equivalence (|X| → |Y|).
(a) → LICENCE `iso` in Arc G; (b), (c) *skipped* (need Fun / topology).

**INF-1.10 SM7** (the pullback-power of a cofibration and a fibration is a fibration, trivial if i is anodyne):
*skipped* (heavy). It is only the reason behind 2.1–2.3.

### INF p.2

**INF-2.1 SM7-ex (1)** Fun(X, C) is a quasi-category (resp. Kan) if C is; in particular C^{Δ¹} and C_{x/}.
- Play (C^{Δ¹} concretely): an arrow of C^{Δ¹} from f to f′ is a commuting square = two triangles sharing a
  diagonal. Level: given squares f⇒f′ and f′⇒f″ (each two triangles), build the composite square f⇒f″ (compose
  the verticals, then tetra moves). The existing `square` boss is the one-square version.
- Mech: existing Compose/Tetra. Fun 3 / Diff 4. Pre: W2, `square`.

**INF-2.2 SM7-ex (2)** Comp(f,g) (all fillers of the horn (f,g)) is contractible.
- Play: its π₀ part is `unique` (any two composites are homotopic). The next layer, "two different homotopies
  x ≃ y are themselves homotopic", needs a goal about 2-cells being related by a tetrahedron; the board shows
  this poorly. *Partial*.
- Mech: Tetra can express it (path f, g, 1_c), but a new goal type is needed. Fun 2 / Diff 4.

**INF-2.3 SM7-ex (3)** A trivial fibration X → Y has a section, and sections form a contractible Kan complex
(the contractibility part is *skipped*).
- Play ("section"): LICENCE `trivial`: build a section of p over a small S by lifting dots, then arrows, then
  triangles; every boundary lifts, so **no choice is ever wrong**. Twin with an `inner`-licence map where an
  early dot choice dead-ends. Mech: LICENCE + lift moves. Fun 3 / Diff 2. Pre: Lifting intro.

**INF-2.4 Exercise 1 (Composition)**: same as SM2-Ex1 (cross-reference, not double-counted).

**INF-2.5 Joyal lifting theorem (2002).** For an inner fibration C → D of quasi-categories and n ≥ 2, a lifting
problem Λⁿ₀ → C, Δⁿ → D is solvable when the edge Δ^{01} goes to an equivalence in C.
- Play: existing `liftiso` (Λ²₀ form) and `joyal` (over a point, Λ³₀). Epilogue level G8 of Arc G.
- Mech: existing (`joyal` flag). Fun 4 / Diff 4.

**INF-2.6 Joyal-ex (1)** Left/right fibrations are conservative isofibrations.
- Play (conservative): LICENCE `left`. S = N(J) (f̄: x̄→ȳ, ḡ: ȳ→x̄, both inverse triangles, strict). X: x, y,
  f over f̄. Goal: g with (f, g, 1_x) and (g, f, 1_y). Solution (par 5): Solve-left (f, 1_x) over (f̄, ḡ, 1) → g;
  Solve-left (g, 1_y) over (ḡ, f̄, 1) → h with (g, h, 1_y); Tetra on f, g, h (corners x, y, x, y) with faces
  (f,g,1_x), (g,h,1_y) and the degenerate (1_x, h, h) → claim (f, 1_y, h), i.e. f ≃ h (inner Λ³₂); Flip; Swap in
  → (g, f, 1_y). Aha: the second inverse h is a *different* arrow, and you must prove h ≃ f.
- Isofibration half: {0} → Δ¹ is left anodyne (it is Λ¹₀), so any arrow lifts from any start. Level G1.
- Mech: LICENCE `left` (Solve-left allowed when it lies over an S triangle) + existing. Fun 5 / Diff 4.
  Pre: W4, W9, Lifting intro.

**INF-2.7 Joyal-ex (2)** An inner fibration p is conservative ⇔ every Λⁿ₀ lifting problem (n ≥ 2) whose first
edge φ has p(φ) an equivalence is solvable.
- Play: covered by G7/G6 (conservative vs. merely inner). CE: Δ¹ → N(J) is an inner fibration (the nerve of any
  functor is) that is **not** conservative: f lies over an iso but has no inverse. Fun 4 / Diff 3.

**INF-2.8 Joyal-ex (3) Grothendieck hypothesis** (∞-groupoid ⇔ Kan complex).
- Play: a board where every arrow carries inverse triangles (marked ≅, joyal on), so every outer horn becomes
  fillable: existing `joyal` + Arc D. The converse (Kan ⇒ every arrow invertible) is `undo`/`inverses` (W4).
  Fun 4 / Diff 3.

### INF p.3

**INF-3.1 Mixed (1)** Equivalences Δ¹ → C are exactly the 1-simplices that extend to N(J) (Δ¹ → N(J) is left
anodyne + Joyal lifting).
- Play ("walking iso"): extend f (≅) to the 2-skeleton of N(J) plus its first solid: = SM2-F.4d / `joyal`.
  Fun 5 / Diff 3.

**INF-3.2 Mixed (2)** Conservative inner fibrations are stable under base change: pullback, *skipped*.

**INF-3.3 Mixed (3)** If the spine of Δⁿ → C lands in C^≃, so does the whole simplex (composites of
equivalences are equivalences; Iⁿ → Δⁿ is inner anodyne).
- Play ("socks both ways"): f: a→b, g: b→c, inverses f̄: b→a, ḡ: c→b with all four inverse triangles
  (f,f̄,1_a), (f̄,f,1_b), (g,ḡ,1_b), (ḡ,g,1_c), and (f, g, x). Goal: w with (x, w, 1_a) **and** (w, x, 1_c).
  Solution (par 5): Compose ḡ, f̄ → w. Tetra on f, g, ḡ (faces (f,g,x), (g,ḡ,1_b), degenerate (f,1_b,f)) →
  (x, ḡ, f). Tetra on x, ḡ, f̄ (faces (x,ḡ,f), (ḡ,f̄,w), (f,f̄,1_a)) → (x, w, 1_a). Tetra on ḡ, f̄, f (faces
  (ḡ,f̄,w), (f̄,f,1_b), degenerate (ḡ,1_b,ḡ)) → (w, f, ḡ). Tetra on w, f, g (faces (w,f,ḡ), (f,g,x), (ḡ,g,1_c)) →
  (w, x, 1_c). All four claims are inner. Fun 4 / Diff 4. Pre: `socks`.

**INF-3.4 Mixed (4)** An inner fibration is an isofibration ⇔ C^≃ → D^≃ is a Kan fibration: *skipped* (heavy).

**INF-3.5 Mixed (5)** An inner fibration is an isofibration ⇔ RLP against {0} → N(J); hence stable under base
change (base change *skipped*).
- Play ("lift the walking iso"): LICENCE `iso`. S = N(J); X has x over x̄. Lift f̄ from x (result marked ≅,
  following Kerodon's form of the definition: an equivalence downstairs lifts to an equivalence), then Joyal
  Solve-left (f, 1_x) → g over ḡ, then Tetra f, g, f claims (g, f, 1_y) (outer, legal as f ≅). Level G5.
  Fun 4 / Diff 3.

**INF-3.6 Natural transformation** *(def)*: an arrow of Fun(C,D); Fun(C,D)₁ = Hom(C×Δ¹, D).

**INF-3.7 Thm.** Fun(K,C) → Fun(sk₀K, C) is (as printed) "an equivalence"; **the walkthrough proves it is
conservative**, which is the correct statement (a natural transformation is a natural equivalence iff every
component is an equivalence). Walkthrough (0)–(3): skeletal induction, reduce to K = Δⁿ, the spine for n ≥ 2,
combinatorics for n = 1.
- Play (the n = 1 combinatorics, "pointwise iso"): dots a, b (top), a′, b′ (bottom). f: a→b, f′: a′→b′,
  α: a→a′, β: b→b′ (components), ᾱ: a′→a, β̄: b′→b; given (ᾱ, α, 1_{a′}) and (β, β̄, 1_b) (plus decoys
  (α, ᾱ, 1_a), (β̄, β, 1_{b′})) and the naturality square (f, β, d), (α, f′, d). Goal: the inverse square
  (ᾱ, f, ?e) and (f′, β̄, ?e). Solution (par 4): Compose ᾱ, f → e. Tetra on ᾱ, α, f′ (faces (ᾱ,α,1_{a′}),
  (α,f′,d), degenerate (1_{a′}, f′, f′)) → (ᾱ, d, f′). Tetra on ᾱ, f, β (faces (ᾱ,f,e), (f,β,d), (ᾱ,d,f′)) →
  (e, β, f′). Tetra on e, β, β̄ (faces (e,β,f′), (β,β̄,1_b), degenerate (e, 1_b, e)) → (f′, β̄, e). All claims
  inner. Trap: the decoy inverse triangles invite outer moves that are locked.
- Mech: existing. Fun 5 / Diff 5. Pre: W2–W4, `square`.

**INF-3.8 Exercises (1)** sk₀K → sk₀L equivalence ⇒ Fun(L,C) → Fun(K,C) conservative: *skipped*.

**INF-3.9 Exercises (2)** Map(x,y) is a Kan complex (hint: X is an ∞-groupoid iff X → * is a conservative inner
fibration).
- Play: in the Map(a,b) sub-board (INF-1.5) every arrow (homotopy) reverses by Flip: the existing `symmetric` in a
  new frame. Fun 2 / Diff 2.

**INF-3.10 bullets and (3), (4)**: Joyal equivalence ⇒ C^≃ → D^≃ is one; C → D is a Joyal equivalence ⇔ C^E → D^E
is for all E; a trivial fibration is a Joyal equivalence; (3) an inner anodyne map is a Joyal equivalence; (4)
every simplicial set is Joyal equivalent to a quasi-category; F is a trivial fibration ⇔ Joyal equivalence +
isofibration; 2-out-of-3. All *skipped* (heavy), but (3)–(4) justify the game's premise that a solved board "is"
the same ∞-category as its starting data (Note).

### INF p.3–4 · Localization

**INF-4.0 Theorem** (C[W⁻¹] exists, γ* fully faithful onto Fun^W): *skipped* (universal property).

**INF-4.1** Intuitively Δ¹ → N(J) is the localization at the unique non-degenerate edge.
- Play (INVERT on strict tables): invert 0→1 in [1] → J (4 morphisms). More surprising:
  - invert p: 0→1 in the poset [2] → a category equivalent to [1] (0 ≅ 1): one morphism 1→0 (p⁻¹), none 2→0.
  - **Kronecker**: two parallel arrows f, g: a→b, invert f only. Then t = f⁻¹∘g: a→a and its powers are pairwise
    different: End(a) ≅ ℕ (free monoid on t), **infinitely many** morphisms from a finite category. Invert both:
    End(a) ≅ ℤ.
- Mech: INVERT + HCAT counting. Fun 5 / Diff 3. Pre: W5.

**INF-4.2** Localization at all morphisms exists (footnote: glue N(J) along every edge, then a fibrant
replacement): *skipped* beyond a "groupoidify" INVERT level (invert every arrow of a small table and count).

**INF-4.3** Finish the proof via C_S and a Kan approximation: *skipped*.

**INF-4.4 Exercise 1** γ: C → C[W⁻¹] is essentially surjective. Trivial in the INVERT levels (no dots are added):
a quiz line inside 4.1. Fun 1.

**INF-4.5 Exercise 2** (C×D)[(W×W′)⁻¹] ≃ C[W⁻¹] × D[W′⁻¹]: *skipped* (products/adjunction).

**INF-4.6 Cat∞ and An** (defs; Map_Cat∞ = Fun(C,D)^≃; An → Cat∞ fully faithful): *skipped*.

**INF-4.7 Fully faithful + essentially surjective (Bonus)** with (i), (ii), LES, Whitehead, the Reedy lemma and
the pullback bullet: *skipped* (homotopy groups / model categories). The one game-sized fact inside it,
"Iⁿ → Δⁿ is anodyne", is SM2-F.4c.

---

## 4. Skipped (one line each: why)

- SM1-sk.1 sk_n ⊣ cosk_n: an adjunction (its concrete formula is used in SM1-Ex2e).
- SM1-cells, first half: colim sk_n X ≅ X is a sequential colimit.
- SM1-hN.d: N fully faithful, h ⊣ N, h preserves finite products: adjunction/products.
- SM1-top: Δⁿ_Top, |−| ⊣ Sing: topology + adjunction.
- SM1-ihom (general case): Fun(X,−) adjunction, N Fun(C,D) ≅ Fun(NC,ND) in general (one concrete case kept).
- SM1-prod: |Δⁿ×Δᵐ| ≅ |Δⁿ|×|Δᵐ|, |X×Y| ≅ |X|×|Y|: point-set topology (compact Hausdorff, colimits).
- SM1-Kan: Sing(T) is Kan: needs retractions of topological simplices.
- SM1-Ex5b: Sing(S¹) not a nerve: topological (Note only).
- SM2-R.1: χ_R χ_L χ_R = χ_R: a formal Galois-connection fact, no board.
- SM2-R.2: RLP(RLP(∅→*)) in Top: topology (and LLP/RLP placement in the printed statement is ambiguous).
- SM2-R.3: sat(S) closure and the small-object factorization: transfinite colimits.
- SM2-F.2: Sing(X) → * is a Kan fibration: topology.
- SM2-Q.2 footnote: Π(|X|) ≃ hX for Kan X: topology.
- SM2-Ex1 mapping-space framing (P → Map(x,z)): pullbacks of functor quasi-categories (associativity part kept).
- INF-1.5 definition of Map(x,y), C_{x/} by pullback squares: limits (a concrete "zoom" level kept).
- INF-1.8 adjunctions QCat ⇄ Kan ⇄ sSet: adjunctions.
- INF-1.9 (b), (c): Joyal equivalence and weak equivalence: need Fun(C,D) / topology.
- INF-1.10 SM7: pullback-power theorem: heavy.
- INF-2.2 higher part (contractibility of Comp(f,g)): needs 2-cells-between-2-cells goals.
- INF-2.3 contractibility of the space of sections: heavy (existence of a section kept).
- INF-3.2, INF-3.5 base change: pullbacks.
- INF-3.4 isofibration ⇔ core map Kan fibration: heavy.
- INF-3.7 general theorem (skeletal induction): heavy (the n = 1 combinatorics kept as a level).
- INF-3.8, INF-3.10: Joyal-equivalence calculus, fibrant replacement, 2-out-of-3: heavy.
- INF-4.0, 4.2 (general), 4.3, 4.5: localization universal property, fibrant replacement, products: heavy.
- INF-4.6 Cat∞, An: definitions via localization.
- INF-4.7 FF + ES ⇔ Joyal equivalence: homotopy groups, LES, Whitehead, Reedy lemma.

## 5. Errors / sharpenings found in the notes (keep levels on the true side)

1. SM2-K.1 "Δⁿ is not Kan for n ≥ 2": true, but **also for n = 1** (Δ¹ fails Λ²₀); only Δ⁰ is Kan.
2. SM2-K.2 "show NC is a Kan complex": **false** unless C is a groupoid; true statement: NC is a quasi-category.
3. SM2-K.3 "every Kan complex has infinitely many non-degenerate simplices": **false** for Δ⁰ or any discrete set;
   true version: a Kan complex with finitely many non-degenerate simplices is discrete.
4. INF-3.7 "Fun(K,C) → Fun(sk₀K,C) is an equivalence": should read **conservative** (as its own walkthrough says).
5. Not in the notes but found while checking: the **existing level `liftiso`** marks f ≅ upstairs over S.f, but S
   (a plain tetrahedron) has no inverse for S.f. A map of simplicial sets sends an equivalence (with its inverse
   triangles) to an equivalence, so this configuration cannot occur. Fix: give S an inverse of S.f with both
   triangles (S = nerve of a category in which f̄ is invertible), or drop ≅ and give the map a `left` licence.
   (E6/E7 below do this.)

---

## 6. Proposed level arcs

Ordering by prerequisites: **A Counting → B Gluing → C Nerve or not? → D Homotopy categories & inverting →
E Possible or not? II → F Inverses and cores → G Shadows (new Lifting world)**. A and B extend W6 "Bones"; C and D
extend W5 "Rulebooks"; E replaces/extends W7 and the impossible half of W9; F extends W4/W9; G replaces the
current Lifting world. Level data uses the game's notation: dots, arrows `name: src→dst`, triangles
`(e01, e12, e02)`, goals as patterns, `?` = to be found. Every level below has been checked by hand; impossible
ones carry their proof.

### Arc A: Counting simplices (new: COUNT, NAME). "What is actually in Δⁿ?"

| # | name | data | goal | solution | trap / aha |
|---|---|---|---|---|---|
| A1 | `identities` [intro] | Δ²: dots 0,1,2; f: 0→1, g: 1→2, h: 0→2; triangle (f,g,h) | COUNT all arrows and all triangles, degenerate included | 6 arrows (3 + identities 1₀,1₁,1₂), 10 triangles (C(5,3) order-preserving maps [2]→[2]) | answering 3 and 1. Unfold shows (f,1₁,f), (1₀,1₀,1₀)… |
| A2 | `squash` [puzzle] | the 4-simplex `(0,0,1,2,2)` of Δ² | NAME: core + surjection; then two different degeneracy words | core (0,1,2), surjection 00122; words s₃s₀ and s₀s₂ | "words are unique" is false; the EZ pair (θ, y) is unique |
| A3 | `grid` [puzzle] | Δ¹×Δ¹: dots (0,0),(1,0),(0,1),(1,1), faint decoy line (1,0)–(0,1) | tap every non-degenerate simplex | 4 dots, 5 arrows (4 sides + diagonal (0,0)→(1,1)), 2 triangles; χ = 1 | tapping the anti-diagonal (not ≤ in both coordinates) |
| A4 | `prism` [puzzle] | Δ¹×Δ²: 2×3 grid | COUNT per dimension; trace the top simplices as staircase paths | 6, 12, 10, 3; three paths (one per position of the single "up" step) | missing degenerate-looking but genuine edges like (0,0)→(1,2) |
| A5 | `onefloor` [puzzle] | strict: one dot ★, loop σ, table σ·σ = 1 (BZ/2); second board loop τ with τ·τ = τ², τ²·τ = 1 (BZ/3) | COUNT non-degenerate simplices in dims 1–3 | BZ/2: 1, 1, 1; BZ/3: 2, 4, 8 | "(σ,σ) composes to 1, so it is degenerate": no, degenerate means *an identity in the string* |
| A6 | `cosk` [boss] | ∂Δ² (hollow triangle f, g, h); operation "cosk₁" shown as a button | COUNT non-degenerate triangles of cosk₁(∂Δ²), and all 3-simplices | 1 triangle (the hole is filled: cosk₁∂Δ² ≅ Δ²), 15 3-simplices | 0 triangles ("it's hollow"), or 81 3-simplices (all vertex maps) |

### Arc B: Gluing (extends Bones; existing Draw/Glue/Peel + new COLLAPSE, Glue on loops)

- **B1 `faces`** [intro]. 4 dots, 6 arrows f,g,h,x,y,z (tetFaces), no triangles. Tools Glue. Goal: hollow
  tetrahedron (each arrow in exactly two triangles, 4 triangles). Solution: Glue (f,g,x), (g,h,y), (x,h,z),
  (f,y,z). Trap: gluing (f,g,x) twice reaches "4 triangles" but fails the per-arrow rule (that's a sphere plus
  junk). Quiz: χ = 4−6+4 = 2.
- **B2 `whichhorn`** [puzzle]. Same dots/arrows; ghost of Λ³₁. Goal: glue exactly the three faces of Λ³₁
  ((f,g,x) d3, (g,h,y) d0, (f,y,z) d2; missing d1 = (x,h,z)), then answer "which horn? inner?" (Λ³₁, inner).
  Reward: Tetra unlocks and fills it. Trap: gluing (x,h,z) instead of (f,y,z) gives Λ³₂ (also inner), wrong
  answer for the ghost.
- **B3 `squashed`** [puzzle]. Δ² filled: f: a→b, g: b→c, h: a→c, (f,g,h). Tool COLLAPSE. Goal pattern
  (f, 1_*, h). Solution: collapse g (b and c merge into *; the triangle becomes (f, 1_*, h), i.e. f ≃ h). Trap:
  collapsing f gives (1_*, g, h), "g ≃ h" from the *other* side, a different pattern. Aha: a homotopy is a
  squashed triangle (SM1-Ex1c).
- **B4 `balloon`** [puzzle]. One dot a. Tools Glue (accepts identity edges). Goal: a non-degenerate triangle
  whose three edges are 1_a (S² = Δ²/∂Δ²). Quiz: "is it the degenerate triangle s₀s₀(a)?" No: it is a new cell
  with the same boundary. COUNT afterwards: 1 dot, 0 arrows, 1 triangle (χ = 2).
- **B5 `mobius`** [puzzle]. One dot x. Tools Draw arrow (loops allowed), Glue. Goal: exactly two loops e, h and
  one triangle (e, e, h) (boundary word e·e·h⁻¹, the "aa" gluing; the free edge h is the band's boundary circle).
  χ = 1−2+1 = 0. Trap: other gluing patterns of the same three edges, e.g. (e, h, e), give different spaces; the
  level checks the exact pattern.
- **B6 `rp2`** [boss]. Continue from B5. Goal: cap the boundary: add triangle (1_x, 1_x, h). Result: RP²
  (Möbius band ∪ disc), χ = 1. Trap: capping with (h, 1_x, 1_x) also has boundary h, also valid (accept either
  pattern with two identity edges and h).

### Arc C: Nerve or not? (new: VERDICT with witness; extends Rulebooks)

A "no" answer must point to a horn: either it has no filler, or (for "nerve?") two different fillers.

- **C1 `spine2`** [intro]. f: a→b, g: b→c, no triangle. Verdict: not a nerve (not even a quasi-category).
  Witness: horn (f, g), no filler.
- **C2 `twodiag`** [puzzle]. Square a, b, c, d; p: a→b, q: b→d, u: a→c, v: c→d, x, y: a→d; triangles (p,q,x),
  (u,v,y). Verdict: **nerve** (of the category where the square does *not* commute: chains of non-identities
  have length ≤ 2, and these are exactly the two triangles). Trap: "the square doesn't commute, so it's not a
  nerve". Aha: non-commuting diagrams are fine; *double answers* are not.
- **C3 `doublefill`** [puzzle]. Same square with x only: (p,q,x), (u,v,x), plus a second arrow y: a→d and a
  triangle (p,q,y). Verdict: not a nerve; witness: horn (p,q) has two fillers (third edges x and y).
- **C4 `collapsed`** [puzzle]. Δ²/Δ^{01}: dots *, c; e: *→c, e′: *→c, 1_*; triangle σ = (1_*, e, e′). Verdict:
  not a nerve; witness: horn (1_*, e) has fillers σ (third edge e′) and the degenerate (1_*, e, e) (third edge
  e). Trap: everything composes, so it looks fine (SM1-Ex5c).
- **C5 `idempotent`** [puzzle]. Two strict boards, both one dot ★: (i) loop e, table e·e = e; (ii) loop σ, table
  σ·σ = 1. Question per board: "Kan complex?" (i) no; witness Λ²₀ (e, 1_★): needs s with s∘e = 1, but s ∈ {1, e}
  gives e both times. (ii) yes (a group). Trap: (i) has all its triangles and looks "complete". (SM1-EssIm.2,
  SM2-K.2)
- **C6 `keep`** [puzzle]. Strict [2] (p: 0→1, q: 1→2, r: 0→2). Two questions: remove dot 1 → still a
  quasi-category? yes (full subcategory, INF-1.6). Remove arrow r → ? no; witness horn (p, q).
- **C7 `ahorn`** [boss]. The horn Λ³₁ itself as a simplicial set: dots 0–3, all 6 arrows, triangles 012, 123,
  013 (missing 023). Verdict: not a quasi-category; witness: horn (x: 0→2, h: 2→3), no triangle although the
  edge 0→3 exists. Trap: "all edges are there and Tetra could fill it". Aha: *filling* a horn builds a new,
  bigger simplicial set; the horn alone is not a quasi-category.

### Arc D: Homotopy categories & inverting (new: HCAT, INVERT)

- **D1 `howmany`** [intro]. Three mini boards: Λ²₁ (f, g), ∂Δ² (f, g, h hollow), Δ² (filled). HCAT: number of
  morphisms a→c in hX: 1, 2, 1. Trap: Λ²₁ answered 0 (the string g∘f *is* a morphism of hX).
- **D2 `span`** [puzzle]. Λ²₀ (edges 0→1, 0→2). Morphisms 1→2 in h: 0. Trap: 1 ("it's just Δ² minus a face").
- **D3 `corner`** [puzzle]. Λ³₁ vs Λ³₀ (both: dots 0–3, all six arrows; Λ³₁ has faces 012, 123, 013; Λ³₀ has
  012, 013, 023). Morphisms 1→3 in h: Λ³₁: 1; **Λ³₀: 2** (13 and 23∘12; the relation (23∘12)∘01 = 13∘01 can't
  be cancelled). Prepares E1.
- **D4 `squashedh`** [puzzle]. h(Δ²/Δ^{01}) (C4's board). Morphisms *→c: **1** (σ says e∘1 = e′). Trap: 2.
- **D5 `invert`** [puzzle]. Strict poset [2]; INVERT p: 0→1. Questions: morphisms 1→0? 1 (p⁻¹). 2→0? 0. Is the
  result equivalent to [1]? yes.
- **D6 `kronecker`** [boss]. Strict f, g: a ⇉ b. INVERT f. "How many morphisms a→a?" Answer ∞: t = f⁻¹∘g and
  t∘t, t∘t∘t, … are all different (End(a) ≅ ℕ). Inverting g too gives ℤ. Trap: 2. Aha: localization can turn a
  finite category infinite (INF localization intro).

### Arc E: Possible or not? II (new: PAINT; replaces the reason multiple-choice in W7/W9)

Design rules answering "needs more thinking": (1) an impossible claim needs a **PAINT** counter-model (or the
`hole` reason for the one topological case), not one of three reasons; (2) levels come in **twins** that differ
by one flag (≅, kan, licence) and have opposite answers; (3) impossible levels give tempting partial progress
(three of four faces); possible levels look impossible; (4) par hidden; a wrong verdict costs the star.

- **E0 `paint`** [intro]. `oneway` data (f: a→b; goal (f, ?g, 1_a)). Palette [1] (0 → 1). Paint a↦0, b↦1,
  f↦(0→1). No morphism 1→0, so no ?g: impossible.
- **E1 `corner`** [puzzle]. Λ³₀: f: a→b, g: b→c, h: c→d, x: a→c, y: b→d, z: a→d; given (f,g,x), (f,y,z),
  (x,h,z). Goal (g, h, y). Tools Compose, Tetra, theorems. **Impossible**: palette h(Λ³₀) with two morphisms
  b→d named y₁ = h∘g and y₂, where y₂∘f = y₁∘f. Paint y ↦ y₂ (everything else by name): all three given
  triangles commute, but h∘g = y₁ ≠ y₂. Trap: the Tetra panel shows 3 of 4 faces known (the 4th face is
  locked: outer Λ³₀). Compose g,h → y′ then Tetra gives (f, y′, z): you'd need to cancel f to get y′ ≃ y.
- **E1b `corner≅`** [puzzle]. Same, f marked ≅, joyal on. **Possible**: Tetra on f, g, h, claim face d0
  = (g, h, y) (outer, allowed because the first edge is an equivalence: Joyal's Λ³₀). Par 1.
- **E2 `twotri`** [puzzle]. SM2-F.4b: f, g, h, x: a→c, y: b→d; given (f,g,x), (g,h,y). Goal: a solid with faces
  (f,g,x), (g,h,y) and (f, y, ?z), (x, h, ?z). **Possible** (par 2): Compose f, y → z; Tetra (A, B, D known) →
  claim (x, h, z). Looks hopeless ("two faces only").
- **E3 `almosthollow`** [puzzle]. tetFaces arrows plus z′: a→d; given (f,g,x), (g,h,y), (f,y,z), (x,h,z′).
  Goal z ≃ z′, i.e. (z, 1_d, z′). **Possible** (par 2): Tetra with (f,g,x), (g,h,y), (f,y,z) → claim (x,h,z);
  Same on (x,h,z), (x,h,z′). Decoy reason `hole` is wrong: the four faces don't even agree, so there is no
  sphere.
- **E4 `hollow`** [puzzle]. Same with z′ = z: four consistent faces. Goal: a solid whose four faces are exactly
  these four. **Impossible**, reason `hole` (no paint needed): every move is an inner horn filling, which never
  changes the homotopy type; a solid with this boundary would make the 2-sphere |∂Δ³| contractible inside a
  space that is still a 2-sphere. (Engine note: a solid with a *new* face, e.g. via a fresh composite z″, must not
  satisfy the goal; the goal names the four faces.)
- **E5 `opensquare`** [puzzle]. Square a, b, c, d; f: a→b, u: a→c, v: b→d. Goal (f, v, ?x), (u, ?w, ?x). kan off.
  **Impossible**: palette = poset {a < b < d, a < c}, c and d incomparable; paint by name. No morphism c→d, so
  no ?w. Trap: "three sides of a square, surely it closes".
- **E5b `opensquare-kan`** [puzzle]. Same, kan on. **Possible** (par 2): Compose f, v → x; Solve-left on u with
  x → w and (u, w, x). (SM2-F.4a: this inclusion is left anodyne.)
- **E6 `idem`** [puzzle]. f: a→b, g: b→a, given (f, g, 1_a). Compose g, f → e: b→b is allowed. Goal (e, e, e)
  (e is idempotent). **Possible** (par 3): Compose g, f → e; Tetra on g, f, g (corners b, a, b, a; faces (g,f,e),
  (f,g,1_a), degenerate (g,1_a,g)) → claim (e, g, g); Tetra on e, g, f (corners b, b, a, b; faces (e,g,g),
  (g,f,e), and (g, f, e) again as face 023) → claim (e, e, e). Looks impossible because nothing says anything
  about e.
- **E6b `idem≠1`** [boss]. Same data. Goal (e, 1_b, 1_b), i.e. e ≃ 1_b. **Impossible**: palette = split
  idempotent: objects 0, 1; i: 0→1, r: 1→0, r∘i = 1₀, i∘r = ε, ε∘ε = ε ≠ 1₁ (morphisms: 1₀; i; r; 1₁, ε). Paint
  a↦0, b↦1, f↦i, g↦r, e↦ε: (f, g, 1_a) commutes; ε ≠ 1. Replaces `backpath`'s multiple choice.
- **E7 `parallel`** (rework). Existing data (f, g: a→b; goal f ≃ g). Palette: Kronecker (two distinct parallel
  morphisms). Same answer, now proved.

### Arc F: Inverses and cores (extends W4/W9; uses ≅/joyal and PAINT)

- **F1 `floors`** [intro]. The existing `joyal` boss re-read as SM2-F.4d: f ≅ given, build g, (f,g,1_a) by
  Solve-left, then (g,f,1_b) by Tetra on f, g, f (outer Λ³₀, legal as f ≅). Then COUNT: N(J) has 2
  non-degenerate simplices per dimension (0101…, 1010…); each "floor" of the filtration adds the next one and its
  0-th face.
- **F2 `socksboth`** [puzzle]. INF-3.3 data and par-5 solution (four inner Tetra claims after one Compose). Goal
  (x, w, 1_a) and (w, x, 1_c). Trap: composing f̄, ḡ (wrong order: not composable) or using outer claims.
- **F3 `core`** [puzzle]. a, b, c; f: a→b, f̄: b→a with (f, f̄, 1_a), (f̄, f, 1_b); h: b→c, k: c→b with only
  (h, k, 1_b); x: a→c with (f, h, x). Goal: select the core (all equivalences). Answer {f, f̄} (+ identities).
  h, k, x are not equivalences: PAINT into the split-idempotent palette: a, b ↦ 0, c ↦ 1, f, f̄ ↦ 1₀, h ↦ i,
  k ↦ r, x ↦ i (all given triangles commute; i, r are not invertible). Trap: x "inherits" invertibility from f,
  and h has a one-sided inverse.
- **F4 `pointwise`** [boss]. INF-3.7 data and par-4 solution (Compose ᾱ, f; three inner Tetra claims). The
  "natural transformation with invertible components is invertible" level.

### Arc G: Shadows (replaces the current Lifting world: shadow, lift, nolift, liftfill, liftiso)

Why the current world is not fun: each level is one forced click (the shadow decides everything), and `nolift`
is a lookup. New idea: the **map's licence** (inner / left / iso) is the variable that decides which lifts are
legal; lifted arrows can land on *fresh* dots, so the order of moves matters; impossibility is shown by a
counter-model *map*. New mechanics: LICENCE badge on the map, **Lift arrow** (Λ¹₀: pick a start dot upstairs and
an arrow downstairs; creates a fresh end dot), Solve-left allowed when it lies over an S triangle and the licence
is `left` (or `iso`/joyal with first edge ≅). Base S is always a strict nerve.

- **G1 `liftarrow`** [intro] (licence `left`). S: ā, b̄, c̄; f̄: ā→b̄, ḡ: c̄→b̄. X: x over ā. Goal: an arrow over f̄
  starting at x. Lift arrow (1 move). Note: {0} → Δ¹ is Λ¹₀, left anodyne.
- **G2 `wrongend`** [puzzle, claimable] (licence `left`). Same S; X: z over c̄, y over b̄. Goal: an arrow z→y over
  ḡ. **Impossible**: Lift arrow from z gives a fresh end w, not y. Counter-model: the left fibration of a
  set-valued functor F with F(ā) = {x}, F(c̄) = {z}, F(b̄) = {y, w}, F(ḡ)(z) = w: X maps into it, every left
  horn lifts there, and z ↦ w ≠ y. Reason `licence`: "a left licence fixes where you start, not where you land".
- **G3 `prism`** [puzzle] (licence `left`). S = N([1]×[1]): corners ā, b̄, c̄, d̄; f̄, ū, v̄, w̄ (c̄→d̄), diagonal
  d̄; S triangles t1 = (f̄, v̄, d̄), t2 = (ū, w̄, d̄). X: a, b, c, d over the corners; f, u, v over f̄, ū, v̄. Goal
  (f, v, ?x) and (u, ?w, ?x) over t2. Solution (par 2): Compose f, v → x (over d̄); Solve-left on u with x → w
  over w̄. Trap: Lift arrow w̄ from c lands on a fresh dot d′ ≠ d, and the square no longer closes. Twin of E5.
- **G4 `isofib?`** [puzzle] (VERDICT). Two maps: (i) X = N(J) ⊔ {z} → N(J), z over x̄; (ii) X = Δ¹ ⊔ {z} → Δ¹,
  z over 0. "Isofibration?" (i) **no**: witness z and the equivalence f̄: nothing over f̄ starts at z. (ii)
  **yes**: Δ¹'s only equivalences are identities, which always lift (degenerate edges). Both are inner fibrations
  (nerves of functors). Trap: the pictures are almost the same; the difference is whether the base arrow is
  invertible.
- **G5 `liftiso`** [puzzle] (licence `iso`, INF-3.5). S = N(J) (f̄: x̄→ȳ, ḡ: ȳ→x̄, both inverse triangles, the
  tetrahedra of N(J)). X: x over x̄. Goal: f, g with (f, g, 1_x) and (g, f, 1_y). Solution (par 3): Lift arrow f̄
  from x → f (marked ≅); Solve-left (f, 1_x) over (f̄, ḡ, 1) → g (Joyal, f ≅); Tetra on f, g, f over the S
  tetrahedron (x̄ ȳ x̄ ȳ), claim face d0 = (g, f, 1_y) (outer Λ³₀, f ≅). Trap: lifting ḡ separately from y gives
  g′ with no triangles linking it to f. (Replaces the flawed old `liftiso`, see section 5.)
- **G6 `inneronly`** [puzzle, claimable] (licence `inner`). S = N(J); X: x, y, f: x→y over f̄. Goal: g with
  (f, g, 1_x). **Impossible**: counter-model X = Δ¹ → N(J), an inner fibration (nerve of a functor) in which f
  has no inverse although f̄ has. Reason `licence`: "only inner horns lift; an inverse needs an outer horn".
  Twin of G7.
- **G7 `conservative`** [boss] (licence `left`, INF-2.6). Same S and X as G6. Goal: g with (f, g, 1_x) and
  (g, f, 1_y). Solution (par 5): Solve-left (f, 1_x) over (f̄, ḡ, 1) → g; Solve-left (g, 1_y) over (ḡ, f̄, 1) → h
  with (g, h, 1_y); Tetra on f, g, h (corners x, y, x, y) with faces (f,g,1_x), (g,h,1_y), degenerate
  (1_x, h, h) → claim (f, 1_y, h) (inner Λ³₂); Flip → (h, 1_y, f); Swap in → (g, f, 1_y). Aha: you get a
  second inverse h and must prove it is f. "Left fibrations are conservative."
- (optional) **G8 `corner-shadow`**: E1b over a shadow (S = nerve of 0̄ ≅ 1̄ → 2̄ → 3̄, X the Λ³₀ corner with f ≅
  over the invertible f̄): Joyal's lifting theorem in Λ³₀ form, par 1, as the epilogue's "the theorem you've
  been using".
