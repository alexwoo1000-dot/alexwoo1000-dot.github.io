# HORNFILLER — a NandGame-style puzzle game teaching ∞-categories

Player audience: curious people with little math. NandGame gives you one primitive (NAND) and you build a
computer. Here the one primitive is **filling a horn**: from it the player builds composition, identities,
associativity, homotopy, inverses. Math follows Kerodon (simplicial sets, quasi-categories, Kan complexes).
Every puzzle is a real proof, but the player only clicks arrows and "fact cards".

## Files (plain `<script>` tags, NO ES modules, no build step, no external resources; must work from file://)
All attach to a global `window.HC` (`var HC = window.HC || (window.HC = {})`; in node: `globalThis.HC`).

| file | owner | contents |
|---|---|---|
| `engine.js` | engine agent | `HC.Engine` — pure logic, no DOM, runs in node too |
| `levels.js` | engine agent | `HC.Levels` — array of level data incl. solutions |
| `test.js`   | engine agent | `node test.js` replays every solution and asserts goal reached |
| `text.js`   | prose agent  | `HC.Text` (per-level prose), `HC.Worlds`, `HC.Glossary` |
| `index.html`, `style.css`, `ui.js` | UI agent | everything visual |

Load order in index.html: engine.js, levels.js, text.js, ui.js.

## The math model
A state is a small simplicial set, stored up to dimension 3:
- vertex `{id, label, x, y}` — x in 0..100, y in 0..60 (logical board coords)
- edge `{id, src, dst, label, kind}` — kind: `given | composite | identity | solved`
- triangle `{id, e01, e12, e02, kind}` — a 2-simplex on vertices 0,1,2. It is a **witness that e02 is a
  composite of e01 then e12** ("e12∘e01 ⇒ e02"). Requires e01.dst=e12.src, e01.src=e02.src, e12.dst=e02.dst.
  kind: `given | compose | thin | solved | filled`
- tetra `{id, faces:[d0,d1,d2,d3], missing}` — a 3-simplex with edges e01,e02,e03,e12,e13,e23. Faces:
  d3=(e01,e12,e02), d2=(e01,e13,e03), d1=(e02,e23,e03), d0=(e12,e23,e13)  (each written (e01,e12,e02) of that face)

**Homotopy**: f ≃ g (parallel edges a→b) means a triangle (f, id:b, g) exists.

Deterministic ids: created edges `e1,e2,…`, created triangles `t1,t2,…`, tetras `T1,…` in creation order;
identity edge of vertex v is always `id:v` (label `1` + subscript-ish, e.g. `1ₐ`); thin triangles of edge e are `s0:e` = (id:src, e, e) and
`s1:e` = (e, id:dst, e). For an identity edge both coincide: one triangle `s0:id:v` = (id:v,id:v,id:v).

## Moves (tools) — `HC.Engine`
```
createState(level) -> state {vertices, edges, triangles, tetras, level}   (deep copy of level data)
compose(state, fId, gId)      Λ²₁. needs f.dst==g.src (if not, try swapped order). ALWAYS creates a NEW edge
                              (label "g∘f", parenthesise compound operands, 2nd filler of same horn gets a ′)
                              + triangle (f,g,new). Max 2 fillers per (f,g) pair, 3rd attempt fails nicely.
identity(state, id)           id is a vertex -> ensure id:v exists. id is an edge -> ensure both thin triangles
                              (creating identity edges as needed). Fails nicely if nothing new.
horn0(state, e01Id, e02Id)    Λ²₀ "solve ?∘f = h": edges share source. New edge e12: e01.dst -> e02.dst, + triangle.
                              label "h/f"; if e02 is an identity: "f⁻ᴸ".
horn2(state, e12Id, e02Id)    Λ²₂ "solve g∘? = h": edges share target. New edge e01: e02.src -> e12.src, + triangle.
                              label "g\h"; if e02 is an identity: "g⁻ᴿ".
fill3(state, [t1,t2,t3])      Try every assignment of the 3 triangles to three of the slots d0..d3 such that the six
                              tetra edges are consistent and the missing face's 3 edges are all determined.
                              Inner horns (missing d1 or d2) always allowed; outer (missing d0/d3) only if
                              state.level.kan. Prefer an assignment whose missing triangle does not exist yet.
                              Adds triangle (kind filled) + tetra. If the triangle already exists: fail nicely
                              ("you already know this").
undo(state), canUndo(state)   snapshot-based
checkGoal(state) -> {done, bindings}
describe(state, triId) -> {text, isHomotopy}   e.g. "g∘f ⇒ x", or "f ≃ g" when e12 is an identity
```
Every move returns `{ok:true, added:{edges:[ids],triangles:[ids],tetras:[ids]}, message}` or
`{ok:false, reason}` — `reason`/`message` are short friendly sentences shown to the player (no jargon).
Moves not in `level.tools` are still callable (UI enforces tool availability).

## Level data — `HC.Levels[i]`
```
{ id, world: 1|2|3|4, vertices:[…], edges:[…], triangles:[…],
  tools: ['compose','identity','horn0','horn2','fill3'] (subset), kan: bool,
  goal: { triangles: [[e01,e12,e02], …] } | null,
  solution: [['compose','f','g'], ['identity','f'], ['fill3',['t1','t2','s1:g']], …] }
```
Goal entries are edge ids or variables (`'?x'`). All patterns must match simultaneously (backtracking);
different variables must bind to different edges. `id:v` in a goal only matches if that identity exists.

## Levels (exact structure; engine agent picks pleasant vertex coordinates)
World 1 — Arrows
1. `compose` — a,b,c; f:a→b, g:b→c. tools compose. goal [f,g,?x]
2. `chain` — a,b,c,d; f,g,h in a row. tools compose. goal [f,g,?x],[?x,h,?z]
3. `identity` — a,b; f. tools compose,identity. goal [f,id:b,f],[id:a,f,f]

World 2 — Triangles are proofs
4. `twoways` — like 1. goal [f,g,?x],[f,g,?y]  (fillers are not unique!)
5. `tetra` — a,b,c,d; f:a→b,g:b→c,h:c→d,x:a→c,y:b→d,z:a→d; given triangles [f,g,x],[g,h,y],[x,h,z]. tools fill3. goal [f,y,z]
6. `assoc` — f,g,h in a row. tools compose,fill3. goal [f,g,?x],[g,h,?y],[?x,h,?z],[f,?y,?z]
   (compose f,g→x; g,h→y; x,h→z; fill3 → (f,y,z))
7. `unique` — f,g. tools compose,identity,fill3. goal [f,g,?x],[f,g,?y],[?x,id:c,?y]
   (compose twice; identity on g; fill3 on (f,g,x),(f,g,x′),s1:g — tetra a,b,c,c)
8. `unit` — a,b; f. tools compose,identity,fill3. goal [id:a,f,?k],[?k,id:b,f]
   (identity a; compose id:a,f→k; identity f; fill3 on (id:a,f,k), s0:f, s1:f)
9. `symmetric` — a,b; f,g parallel, id:b given, triangle [f,id:b,g] given. tools identity,fill3. goal [g,id:b,f]
   (identity f; identity id:b; fill3 on given, s1:f, s0:id:b)
10. `transitive` — f,g,h parallel a→b, id:b given, [f,id:b,g],[g,id:b,h] given. tools identity,fill3. goal [f,id:b,h]

World 3 — Undo everything (kan: true)
11. `undo` — a,b; f. tools identity,horn0. goal [f,?g,id:a]
12. `divide` — a,b,c; g:b→c, h:a→c. tools horn2. goal [?f,g,h]
13. `inverses` — a,b; f. tools identity,horn0,horn2,fill3. goal [f,?g,id:a],[?k,f,id:b],[?k,id:a,?g]
    (left inverse g, right inverse k, identity on g, fill3 on (k,f,id:b),(f,g,id:a),s0:g → k ≃ g)

World 4 — Playground
14. `sandbox` — 4 vertices, 4–5 edges, all tools, kan true, goal null.

## Prose — `text.js`
```
HC.Worlds = [{id:1, title, blurb}, …]
HC.Text[levelId] = { title, story, goalText, hints:[3 escalating, last is near-solution], win, term }
HC.Glossary = [{term, plain, formal}]
```
`story` ≤ 60 words, warm, concrete metaphors (arrows = journeys/recipes/moves; triangle = a signed receipt
"doing f then g counts as x"; tetrahedron = four receipts that must agree; horn = a shape with one side missing).
`win` ≤ 70 words: what you just proved + the real name (e.g. "inner horn Λ²₁", "quasi-category",
"Kan complex", "homotopy", "degenerate simplex", "∞-groupoid"), `term` = the headline real-math term unlocked.
Strings may contain simple inline HTML (`<b>`, `<i>`, `<code>`).
