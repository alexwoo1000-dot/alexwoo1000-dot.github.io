# Vocabulary (all agents; wins over every earlier spec)

The user: "don't introduce your own jargon to avoid technical math words; it doesn't make it any easier to
understand and just makes it more confusing." Use the standard mathematical word, and explain it in plain
language the first time. Never substitute a made-up word for it.

| never write | write |
|---|---|
| dot | vertex (the user already changed this) |
| wiggle, slide, "same up to wiggle" | homotopy, homotopic |
| stay, do-nothing arrow | identity (morphism), degenerate edge |
| free triangle, thin triangle, free fact | degenerate triangle (2-simplex); "free" may be used only as an adjective explaining that it always exists |
| fact, fact card, receipt | triangle (2-simplex); "witness" is fine, it is standard |
| solid | tetrahedron (3-simplex) |
| trip, route, path tool | tetrahedron; "the horn Λ³ₖ"; a chain of composable arrows is a "spine" |
| rulebook | composition table; nerve of a category |
| shadow, upstairs, downstairs | the base S, the total space X, "lies over", fibre |
| licence | left fibration / inner fibration (the kind of map) |
| test world, paint | counterexample: a category (its nerve) in which the givens hold and the goal fails |
| Glue triangle / Glue solid | Attach a 2-cell / Attach a 3-cell (gluing is fine as the explanation: "attach, i.e. glue along the boundary") |
| Peel | Skeleton (pass to sk_{n−1}) |
| Fill in | Coskeleton |
| Same | Uniqueness of composites (button: "Uniqueness") |
| Flip | Symmetry |
| Link | Transitivity |
| Swap in | Substitution (transport along a homotopy) |
| Divide | Cancel an isomorphism |
| Solve f·? ≃ h / ?·g ≃ h | Fill Λ²₀ / Fill Λ²₂ (keep the equation as the subtitle) |
| Compose | Compose (fill Λ²₁) — fine |
| "Possible or not?" | Anodyne maps (the question "can it be done?" stays in the level text) |
| Bones | Skeleta and cells |
| Undo everything | Kan complexes |
| Squares | Natural transformations |
| Solids | 3-simplices and Λ⁴ (or "Higher simplices") |
| bad pair | a horn Λ²₁ with no filler, or with two |

World titles are the mathematical topic. Button labels use the standard name; the tooltip may say what it does in
plain words. Plain language is for *explaining* a term, never for *replacing* it. Internal ids in code
(`trip`, `peel`, `swapin`, …) may stay; only what the player reads changes.
