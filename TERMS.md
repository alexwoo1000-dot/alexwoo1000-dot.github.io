# Vocabulary (all agents; wins over every earlier spec)

The user: "don't introduce your own jargon to avoid technical math words; it doesn't make it any easier to
understand and just makes it more confusing." Use the standard mathematical word and explain it in plain language
the first time. Never substitute a made-up word for it.

Later relaxations from the user (these win):
- **Tool buttons keep their short names**: Compose, Solve (with the equation), Tetrahedron, Same, Flip, Link,
  Swap in, Divide, Glue triangle, Glue solid, Peel, Fill in, Lift arrow, 4-simplex. Tooltips give the standard
  name (Same = uniqueness of composites, Flip = symmetry, Link = transitivity, Swap in = substitution along a
  homotopy, Divide = cancel an isomorphism, Peel = pass to the skeleton, Fill in = coskeleton, Glue = attach a
  cell). Hints in text.js must use exactly the labels the buttons show.
- **"upstairs" / "downstairs"** are fine when used in the lifting sense (in X over S).
- **"glue"** is fine when used in the pushout sense (attaching along a shared part).

| never write | write |
|---|---|
| dot | vertex |
| wiggle, slide | homotopy, homotopic, deform |
| stay, do-nothing arrow | identity, degenerate edge |
| free triangle, thin triangle, fact, card, receipt | degenerate triangle; triangle (2-simplex); witness is fine |
| solid | tetrahedron (3-simplex) |
| trip, route | tetrahedron, the horn Λ³ₖ, spine |
| rulebook | composition table; nerve of a category |
| shadow, licence | the base S, the total space X, lies over; left / inner fibration |
| test world, paint | counterexample (a category in which the givens hold and the goal fails) |
| bad pair | a horn Λ²₁ with no filler, or with two |

World titles are the mathematical topic: Simplicial sets, Composition, Tetrahedra, Homotopy, Higher simplices,
Kan complexes, Subcategories, Nerves of categories, Skeleta and cells, Anodyne maps, Lifting, Isomorphisms,
Natural transformations, Challenges, Sandbox. Internal ids in code may stay.
