# HORNFILLER v3 — "Trips" redesign (wins over SPEC.md and SPEC2.md wherever they differ)

Why: honest design review found (1) nothing you prove becomes a tool, (2) "pick three cards that close up" is
symbol-pushing nobody can picture, (3) `g∘f ⇒ x` reads backwards, (4) too many click-only levels.
User: "make it actually fun and easy to understand and actually teaching the concept, and like you're building
up layers of abstraction."

Everything in SPEC2 not contradicted here stays (plain look, text diet, KaTeX, par, Plain/Math toggle,
strict/blanks, claimable, joyal/iso, cells/peel, kinds intro/puzzle/boss, guided intros).

## 1. Language (Plain mode)
- An arrow is a **step**. A fact `(e01,e12,e02)` reads **`f then g = x`** ("x is a shortcut for f then g").
- The identity arrow at a dot is **stay**. It always exists implicitly at every dot: no Identity tool. In any
  arrow-picking tool, clicking a dot means "stay here". The loop is drawn only once it appears in a fact or pick.
- Facts about stay are **free** and never need making: `f then stay = f`, `stay then f = f`, `stay then stay = stay`.
  They never appear in the Facts list (they are obvious), but every tool may use them.
- `x then stay = y` is shown as **`x ≈ y`** ("same up to wiggle"). `stay then x = y` is shown literally.
- Math mode keeps simplicial language (`σ`, `d_i`, `1_a`, `∘`, `≃`, horn names).

## 2. The Trip tool (replaces Fill tetrahedron / fill3 card-picking)
The player picks a **trip of three steps** on the board: three arrows end to end, where a step may be "stay"
(click the dot you are standing on). The trip is the spine e01,e12,e23 of a tetrahedron. A panel then shows the
four facts every trip has:

```
Trip   f → g → h
A  first two merged     f then g = [x]
B  last two merged      g then h = [y]
C  whole trip, way 1    (A) then h = [z]
D  whole trip, way 2    f then (B) = [z]
Rule: both ways give the same whole trip.
```
Slots: A=(e01,e12,e02)=d3, B=(e12,e23,e13)=d0, C=(e02,e23,e03)=d1, D=(e01,e13,e03)=d2.
- Each slot lists the known facts that fit (including free stay-facts), given the other slots' current choices.
  One candidate → auto-filled. Several → shown as chips, player taps one. A slot can always be set back to `?`.
- When exactly three slots are filled, consistently, and the fourth fact is not already known, the fourth shows
  what it must be and a **Claim** button. Claiming adds the fact (kind `trip`) and records the tetra.
- Claiming C or D is always allowed (inner horns). Claiming A needs `level.kan` or e23 iso; claiming B needs
  `level.kan` or e01 iso (only checked like that when `level.joyal`; when neither kan nor joyal: refused with
  "Only reversible steps allow that." ). The panel shows A/B claims as locked (with a small lock) rather than
  hiding them, so the player meets the limit by bumping into it.
- In strict levels a claim that produces an existing fact still records the tetra, and fills a rulebook blank.
- Intro levels: the trip to pick pulses, slots auto-fill, Claim pulses. Puzzle/boss levels: no pre-lighting;
  finding the trip and the slot choices IS the puzzle.
- The board shows the picked trip highlighted and, once A and B are chosen, their shortcut arrows too. A small
  tetrahedron sketch in the panel lights the three known faces and pops the fourth on Claim.

Engine API
```
routeSlots(state, [s1,s2,s3], choice)   // steps are edge ids or 'id:v'; choice = {A?,B?,C?,D?} fact refs or null
  -> { ok, reason?, vertices:[v0..v3],
       slots: { A:{cands:[fact], chosen:fact|null}, B:…, C:…, D:… },
       claim: null | { slot, fact:{e01,e12,e02}, text, allowed, reason? } }
  // a fact ref is a triangle id, or a free thin fact as 's0:<edge>' / 's1:<edge>' (materialised on claim)
  // with choice omitted the engine auto-chooses every slot that has exactly one consistent candidate
claimRoute(state, [s1,s2,s3], choice)  -> normal move result (adds triangle + tetra, creating identity edges used)
```
`fill3`, `fill3Options`, `identity` stay exported for compatibility but no level lists them as tools.
`candidates(state,'trip',picks)` returns valid next steps (edges, and vertices meaning stay).
compose / horn0 / horn2 / cell2 accept `'id:v'` (auto-creating the identity edge).

## 3. Theorems become tools (the layers of abstraction)
Proving a level can unlock a one-click tool that is exactly what was just proved. Levels list them in `tools`
like any other; `level.unlocks` names the tool a level grants (UI celebrates: "New tool: Same. You proved it;
now it's one click."). Toolbar groups: **Moves** (Compose, Solve…, Trip, Draw/Glue/Peel) and **Your theorems**.
```
same(state, t1, t2)     t1=(f,g,x), t2=(f,g,y)  -> adds x ≈ y  i.e. (x, id, y)        unlocked by `unique`
flip(state, t)          t=(f,id,g)              -> (g,id,f)                             unlocked by `symmetric`
link(state, t1, t2)     (f,id,g),(g,id,h)       -> (f,id,h)                             unlocked by `transitive`
swapin(state, h, t, pos?)  h=(p,id,q), t any fact containing p -> t with p replaced by q   unlocked by `whisker`
                           (if p occurs in several positions, pos picks; default first)
```
All add a triangle of kind `theorem`; each is sound in any ∞-category (inner horns only). Friendly ≤10-word fails.
`candidates` supports them (facts as picks).

## 4. Levels (36). `kind` in brackets; tools exactly as listed; `unlocks` where shown.
Coordinates: keep existing ones; new levels get clear layouts. Solutions use steps
`['compose',f,g]`, `['horn0',a,b]`, `['horn2',a,b]`, `['trip',[s1,s2,s3],{A:..,B:..,C:..,D:..}]` (the three
chosen slots; refs as above), `['same',t1,t2]`, `['flip',t]`, `['link',t1,t2]`, `['swapin',h,t]`,
`['addEdge',a,b]`, `['cell2',[..]]`, `['peel']`, `['claim']`, and `'!'`-prefixed expected failures.

W1 Steps
1 compose [intro] tools compose. goal [f,g,?x]
2 chain [intro] compose. goal [f,g,?x],[?x,h,?z]
3 twoways [intro] compose. goal [f,g,?x],[f,g,?y]

W2 Trips of three
4 tetra [intro] trip. (as before: G1,G2,G3 given, goal [f,y,z]; trip f,g,h claim D)
5 assoc [puzzle] compose, trip. goal as before.
6 unique [puzzle] compose, trip. goal [f,g,?x],[f,g,?y],[?x,id:c,?y].  unlocks `same`
   (trip f,g,stay: A=x, B=free, D=(f,g,x′) → claim C = x ≈ x′)
7 unit [puzzle] compose, trip. names ['k']. goal [id:a,f,?k],[?k,id:b,f].
   (compose stay,f → k; trip stay,f,stay: A=(stay,f,k), B free, D=free (stay,f,f) → claim C = k ≈ f)
8 bracket [boss] compose, trip, same. (data as SPEC2; goal [z,id:d,w])

W3 Same up to wiggle
9 symmetric [puzzle] trip. goal [g,id:b,f]. unlocks `flip`   (trip f,stay,stay: A=given, B free, D=free (f,stay,f) → C)
10 transitive [puzzle] trip, flip. goal [f,id:b,h]. unlocks `link`  (trip f,stay,stay: A, B free, C=(g,stay,h) → D)
11 whisker [puzzle] trip, flip, link. goal [k,g,x]. unlocks `swapin`  (trip f,stay,g: A=f≈k, B free, D=(f,g,x) → C)
12 swap [puzzle] trip, flip, link, swapin. goal [id:a,f,g].  (trip stay,f,stay)
13 relay [puzzle] compose, trip, same, flip, link, swapin. (data as SPEC2; goal [x2,h,z])
14 fourway [boss] NEW. a,b,c,d,e in a row; f:a→b, g:b→c, h:c→d, i:d→e; x:a→c, z:a→d, t:a→e, y:c→e, u:b→e, s:a→e.
   Given (f,g,x), (x,h,z), (z,i,t), (h,i,y), (g,y,u), (f,u,s). tools compose, trip, same, flip, link, swapin.
   goal [t,id:e,s].
   (trip x,h,i: A=(x,h,z), B=(h,i,y), C=(z,i,t) → D=(x,y,t); trip f,g,y: A=(f,g,x), B=(g,y,u), C=(x,y,t) → D=(f,u,t);
    same (f,u,t),(f,u,s))

W4 Undo everything  (kan: true)
15 undo [intro] horn0. goal [f,?g,id:a]   (Solve ?∘f = h on f, stay-at-a)
16 divide [intro] horn2. goal [?f,g,h]
17 inverses [puzzle] horn0, horn2, trip, same, flip, link, swapin. goal [f,?g,id:a],[?k,f,id:b],[?k,id:a,?g]
18 cancel [puzzle] trip, same, flip, link, swapin (+horn0, horn2). goal [f,id:b,k]  (trip f,stay,g → claim A, outer)
19 socks [boss] NEW. a,b,c in a row; f:a→b, g:b→c, p:b→a (label f̄), q:c→b (label ḡ), x:a→c, w:c→a.
   Given (f,p,id:a), (g,q,id:b), (f,g,x), (q,p,w); id:a, id:b given. kan FALSE on this level.
   tools compose, trip, same, flip, link, swapin. goal [x,w,id:a].
   (trip f,g,q: A=(f,g,x), B=(g,q,id:b), D=free (f,stay,f) → C=(x,q,f); trip x,q,p: A=(x,q,f), B=(q,p,w),
    C=(f,p,id:a) → D=(x,w,id:a))

W5 Rulebooks (strict)
20 nerve [intro] compose.  21 onlyone [intro] compose.  22 nerve3 [puzzle] compose, trip (blank fills on claim).

W6 Bones
23 disc [intro] addEdge, cell2. dots a,b,c only. goal [?f,?g,?h] as a glued triangle: counts {edges:3, triangles:1}.
24 sphere [puzzle] cell2. counts {triangles:2}.
25 peel [puzzle] peel, cell2. (as SPEC2)

W7 Possible or not?  (all claimable)
26 spine [puzzle] compose, trip.  27 nofill [puzzle] compose, trip (impossible).
28 wedge [puzzle] compose, trip.  29 parallel [puzzle] compose, trip, same, flip, link, swapin (impossible).
30 square [boss] compose, horn0, horn2, trip; kan.

W8 The licence  (all claimable)
31 oneway [puzzle] compose, trip (impossible).
32 detour [puzzle] compose, trip, same, flip, link, swapin.  (trip f,g,h: A=G1, B=(g,h,w), C=free (stay,h,h) → D)
33 mono [puzzle] joyal; trip + theorems. (claim A, legal because e23 = g is ≅)
34 twosided [boss] compose, trip + theorems. (trip k,f,g → k ≈ g; swapin on (k,f,id:b) → (g,f,id:b))
35 joyal [boss] joyal; horn0, trip + theorems. goal [f,?g,id:a],[?g,f,id:b]
   (horn0 f,stay → g; trip f,g,f: A=(f,g,id:a), C=free (stay,f,f), D=free (f,stay,f) → claim B, legal as e01=f is ≅)

W9 Playground: 36 sandbox (everything).

Removed: identity, outline, doublewhisker. Goal patterns mentioning `id:v` match implicit identities.

## 5. Tests
Replay all; candidates contain next pick; brute force (compose/horns/trip-claims over all trips and slot
choices/theorem tools; depth par−1, impossible levels depth ≥ 4) finds nothing under par and never solves
nofill/parallel/oneway. If the search finds a shorter solution, adopt it and report it.
