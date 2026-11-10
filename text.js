var HC = (typeof window !== 'undefined' ? window : globalThis).HC || ((typeof window !== 'undefined' ? window : globalThis).HC = {});

/* Text for HORNFILLER v4. Strings may contain inline HTML and $...$ LaTeX.
   Facts are written f\cdot g \simeq x (x is a composite of f then g) and x \simeq y (homotopic). */

// needs: worlds that must be finished (bosses optional) before a world opens. The map branches.
HC.WorldNeeds = { 1: [], 2: [1], 3: [2], 4: [3], 5: [2], 6: [1], 7: [3], 8: [4], 9: [4], 10: [9], 11: [1] };
HC.Worlds = [
  { id: 1, title: "Arrows", mathTitle: "2-simplices and composition", blurb: "",
    brief: {
      sofar: "Nothing yet.",
      now: "Compose arrows and see what a triangle proves.",
      new: "Composite, and why it is not unique.",
      about: "An arrow is a trip from one dot to another. When one arrow ends where the next one begins you can follow both in a single step, and the game records that step as a new arrow together with the triangle that proves it. The triangle is the proof: it says the new arrow is a composite of the two you used. Nothing here is unique yet, so a second composite of the same pair is simply another arrow that happens to travel the same way.",
      picture: { caption: "Two sides given; the third is what you fill.",
        dots: [{ id: "a", label: "a", x: 12, y: 44 }, { id: "b", label: "b", x: 50, y: 10 }, { id: "c", label: "c", x: 88, y: 44 }],
        arrows: [{ from: "a", to: "b", label: "f" }, { from: "b", to: "c", label: "g" }, { from: "a", to: "c", label: "?", dashed: true }],
        fills: [], ghost: [["a", "b", "c"]] } } },
  { id: 2, title: "Tetrahedra", mathTitle: "Inner horns $\\Lambda^3_k$", blurb: "",
    brief: {
      sofar: "You can compose two arrows.",
      now: "Use solid tetrahedra to relate composites.",
      new: "Associativity, identities, homotopy.",
      about: "A solid has four triangles for faces, and the rule now bites one dimension up: three faces that fit together always leave room for exactly one more. That is the machine behind everything in this world. It is what proves the two ways of bracketing three arrows agree, and that following an arrow with its identity changes nothing. Out of those facts comes homotopy, the relation that lets the game say “the same” about two arrows no filler can separate.",
      picture: { caption: "Three faces fit together; the fourth closes the solid.",
        dots: [{ id: "a", label: "a", x: 8, y: 46 }, { id: "b", label: "b", x: 92, y: 46 }, { id: "c", label: "c", x: 50, y: 6 }, { id: "d", label: "d", x: 50, y: 34 }],
        arrows: [{ from: "a", to: "b", label: "" }, { from: "b", to: "c", label: "" }, { from: "a", to: "c", label: "" }, { from: "d", to: "a", label: "" }, { from: "d", to: "b", label: "" }, { from: "d", to: "c", label: "" }],
        fills: [["a", "b", "d"], ["b", "c", "d"], ["a", "c", "d"]] } } },
  { id: 3, title: "Homotopy", mathTitle: "Homotopy of morphisms", blurb: "",
    brief: {
      sofar: "Any two composites are homotopic.",
      now: "Show homotopy behaves like sameness.",
      new: "Theorem tools: Flip, Link, Swap in.",
      about: "Two parallel arrows are homotopic when a triangle joins them with a do-nothing side: a flat sheet between the two trips. The puzzles in this world are about that relation rather than about shapes, so the proofs you earned are now one-click lemmas — Flip, Link and Swap in. Using them is legitimate because each one was a filler first: homotopy behaves like equality because a solid says so.",
      picture: { caption: "A triangle with an identity side is a homotopy f ≃ g.",
        dots: [{ id: "a", label: "a", x: 10, y: 42 }, { id: "b", label: "b", x: 48, y: 10 }, { id: "c", label: "b", x: 90, y: 42 }],
        arrows: [{ from: "a", to: "b", label: "f" }, { from: "b", to: "c", label: "1" }, { from: "a", to: "c", label: "g" }],
        fills: [["a", "b", "c"]] } } },
  { id: 4, title: "Undo everything", mathTitle: "Kan complexes", blurb: "",
    brief: {
      sofar: "Only gaps in the middle could be filled.",
      now: "Fill gaps at the ends: build inverses.",
      new: "Outer horns, inverses, isomorphisms.",
      about: "Every gap so far was in the middle: the faces around it forced the missing one. At the ends of a trip nothing forces anything, and that is exactly the freedom needed to walk an arrow backwards. In a Kan complex every horn fills, outer ones included, so every arrow has an inverse and every dot is a place you can return to.",
      picture: { caption: "Two sides leave the same dot; the missing one is an inverse.",
        dots: [{ id: "a", label: "a", x: 12, y: 10 }, { id: "b", label: "b", x: 88, y: 10 }, { id: "c", label: "c", x: 50, y: 46 }],
        arrows: [{ from: "a", to: "b", label: "f" }, { from: "a", to: "c", label: "h" }, { from: "b", to: "c", label: "?", dashed: true }],
        fills: [] } } },
  { id: 5, title: "Nerves of categories", mathTitle: "Nerves of categories", blurb: "",
    brief: {
      sofar: "Composites were many and homotopic.",
      now: "Meet spaces where every composite is unique.",
      new: "The nerve of a category.",
      about: "A category drawn as shapes gives a nerve: its dots are objects, its arrows are maps, and its higher simplices are chains of maps you can follow one after another. Inner horns still fill, so you can still compose — but there is exactly one filler, because the composite is a definite arrow and not a class of homotopic ones. That uniqueness is the whole difference between a nerve and a general ∞-category.",
      picture: { caption: "Every pair has a composite, and only one.",
        dots: [{ id: "a", label: "a", x: 8, y: 26 }, { id: "b", label: "b", x: 50, y: 26 }, { id: "c", label: "c", x: 92, y: 26 }],
        arrows: [{ from: "a", to: "b", label: "f" }, { from: "b", to: "c", label: "g" }, { from: "a", to: "c", label: "g∘f" }],
        fills: [] } } },
  { id: 6, title: "Bones", mathTitle: "Skeleta and cells", blurb: "",
    brief: {
      sofar: "You filled horns inside given shapes.",
      now: "Build and take apart shapes by dimension.",
      new: "Skeleta, boundaries, cells.",
      about: "Here nothing fills by itself. You assemble a shape one cell at a time — a dot, then an arrow, then a triangle glued onto a rim — and you can take it apart the same way. This is where dimensions become visible: what the boundary of a shape is, what of it survives after you drop everything above dimension one, and why gluing a triangle to a circle fills its hole rather than making a bigger one.",
      picture: { caption: "A rim with no inside. A cell is what fills it.",
        dots: [{ id: "a", label: "0", x: 12, y: 46 }, { id: "b", label: "1", x: 50, y: 8 }, { id: "c", label: "2", x: 88, y: 46 }],
        arrows: [{ from: "a", to: "b", label: "" }, { from: "b", to: "c", label: "" }, { from: "a", to: "c", label: "" }],
        fills: [], ghost: [["a", "b", "c"]] } } },
  { id: 7, title: "Possible or not?", mathTitle: "Anodyne maps", blurb: "",
    brief: {
      sofar: "Horn filling and cells are two different things.",
      now: "Decide which goals horn moves can reach.",
      new: "Anodyne maps, and why a hole stays a hole.",
      about: "Not every goal can be reached. A horn move only ever fills in a rim that already exists, so it can add a face but it cannot conjure an arrow nobody supplied: a hole stays a hole, and no sequence of fillings turns a hollow circle into a disc. Deciding which goals are reachable is the same as knowing which inclusions are anodyne, and saying why is part of the puzzle.",
      picture: { caption: "A hole in the middle: no horn move fills it.",
        dots: [{ id: "a", label: "", x: 12, y: 8 }, { id: "b", label: "", x: 56, y: 8 }, { id: "c", label: "", x: 56, y: 46 }, { id: "d", label: "", x: 12, y: 46 }],
        arrows: [{ from: "a", to: "b", label: "" }, { from: "b", to: "c", label: "" }, { from: "c", to: "d", label: "" }, { from: "d", to: "a", label: "" }],
        fills: [] } } },
  { id: 8, title: "Lifting", mathTitle: "Left fibrations", blurb: "",
    brief: {
      sofar: "You fill horns in one shape.",
      now: "Fill horns over a second, fixed shape, where the kind of map decides what lifts.",
      new: "Lift arrow. Left fibrations. Lifts land on new dots.",
      about: "Now there are two shapes at once. Everything you build upstairs has to sit over something downstairs, and a horn may only be filled when its pattern already lies below. When a filling would have a choice, the game asks which piece below yours should lie over — so the arrow down, not just the shape up, decides what counts as a solution.",
      picture: { caption: "Every piece upstairs sits over one below.",
        dots: [{ id: "a", label: "a", x: 10, y: 8 }, { id: "b", label: "b", x: 50, y: 8 }, { id: "c", label: "c", x: 90, y: 8 }, { id: "A", label: "a", x: 10, y: 46 }, { id: "B", label: "b", x: 50, y: 46 }, { id: "C", label: "c", x: 90, y: 46 }],
        arrows: [{ from: "a", to: "b", label: "f" }, { from: "b", to: "c", label: "g" }, { from: "A", to: "B", label: "" }, { from: "B", to: "C", label: "" }, { from: "a", to: "A", label: "", dashed: true }, { from: "b", to: "B", label: "", dashed: true }, { from: "c", to: "C", label: "", dashed: true }],
        fills: [] } } },
  { id: 9, title: "Isomorphisms", mathTitle: "Joyal's theorem", blurb: "",
    brief: {
      sofar: "Inner horns fill. Outer ones need inverses.",
      now: "Find when an outer gap may be filled.",
      new: "Isomorphisms cancel. Joyal's theorem.",
      about: "An arrow is an isomorphism when it can be undone, up to homotopy. That is exactly what opens the padlock on an outer horn: with an inverse to go back along, the missing face is forced after all. This is Joyal's theorem, and it is also why a shape whose arrows are all reversible is really a space, with no direction left in it.",
      picture: { caption: "A reversible arrow: outer horns may now fill.",
        dots: [{ id: "a", label: "a", x: 14, y: 26 }, { id: "b", label: "b", x: 86, y: 26 }],
        arrows: [{ from: "a", to: "b", label: "f" }, { from: "b", to: "a", label: "f⁻¹" }],
        fills: [] } } },
  { id: 10, title: "Squares", mathTitle: "Natural transformations", blurb: "",
    brief: {
      sofar: "You can undo arrows, cancel them, and fill outer horns.",
      now: "Work with commuting squares: arrows between arrows.",
      new: "Divide, pasting squares, natural isomorphisms.",
      about: "Two different routes from one corner to the opposite one, together with a filling between them, is a square — an arrow between arrows, the shape of a natural transformation. Squares can be pasted, divided along a side, and slid past each other, which is how a construction on objects becomes one on maps.",
      picture: { caption: "A square is a homotopy between two paths.",
        dots: [{ id: "a", label: "a", x: 10, y: 8 }, { id: "b", label: "b", x: 58, y: 8 }, { id: "c", label: "c", x: 10, y: 46 }, { id: "d", label: "d", x: 58, y: 46 }],
        arrows: [{ from: "a", to: "b", label: "f" }, { from: "a", to: "c", label: "g" }, { from: "b", to: "d", label: "h" }, { from: "c", to: "d", label: "k" }, { from: "a", to: "d", label: "?", dashed: true }],
        fills: [] } } },
  { id: 11, title: "Playground", mathTitle: "Simplicial sets", blurb: "",
    brief: {
      sofar: "Everything.",
      now: "Build whatever you like.",
      new: "Nothing.",
      about: "Every tool is unlocked, every shape is available, and no goal has to be met. Good for testing a guess about a shape you have seen, or for building one you have not.",
      picture: { caption: "No goal: build any shape you like.",
        dots: [{ id: "a", label: "a", x: 14, y: 44 }, { id: "b", label: "b", x: 50, y: 10 }, { id: "c", label: "c", x: 86, y: 44 }],
        arrows: [{ from: "a", to: "b", label: "" }, { from: "b", to: "c", label: "" }, { from: "a", to: "c", label: "" }],
        fills: [["a", "b", "c"]] } } }
];

HC.Text = {

  /* ---------------- World 1: Arrows ---------------- */

  compose: {
    title: "Two arrows, one more",
    bullets: ["Two arrows end to end have a composite.", "Compose $f$ and $g$."],
    explain: "An arrow goes from one dot to another. When $g$ starts where $f$ ends, you can follow $f$, then $g$. A <b>composite</b> is a single arrow that stands for that whole trip. The game draws it together with a triangle, and the triangle is the proof that the new arrow really is a composite of $f$ then $g$. The plain name for it is $f\\cdot g$: first $f$, then $g$.",
    hints: ["Compose needs two arrows meeting at a dot.", "Compose: click $f$, then $g$."],
    win: ["The new arrow $f\\cdot g$ is a composite of $f$ then $g$.", "The triangle is the proof."],
    term: "Composite",
    math: {
      say: "A 2-simplex $\\sigma$ of $X$ with $d_2\\sigma=f$, $d_0\\sigma=g$, $d_1\\sigma=h$ (a map $\\Delta^2\\to X$) witnesses $h$ as a composite of $f$ and $g$. Every inner horn $\\Lambda^2_1\\to X$ in a quasi-category extends to such a $\\sigma$.",
      proof: "Fill $\\Lambda^2_1\\to X$ on $(f,g)$: the filler $\\sigma$ has $d_1\\sigma=f\\cdot g$."
    }
  },

  chain: {
    title: "Three in a row",
    bullets: ["Three arrows in a row.", "Make one arrow for the whole trip."],
    explain: "Composites are arrows too, so they can be composed again. First make $f\\cdot g$. It runs from $a$ to $c$, where $h$ begins, so you can compose it with $h$ to get $(f\\cdot g)\\cdot h$. Each step leaves a triangle behind, so every composite carries its own proof. Mathematicians usually write $g\\circ f$ for what we write $f\\cdot g$: the same arrow, spelled in the other order.",
    hints: ["Join two neighbours first. Then use the result.", "Compose: $f$, $g$. Compose: $f\\cdot g$, $h$."],
    win: ["You built $(f\\cdot g)\\cdot h$ from two triangles.", "Composites of composites work too."],
    term: "Iterated composite",
    math: {
      say: "In a quasi-category every inner horn $\\Lambda^n_k\\to X$ ($0<k<n$) has a filler. Composition therefore iterates: composable $f,g,h$ give a composite of $(f,g)$, then a composite of that edge with $h$.",
      proof: "Fill $\\Lambda^2_1$ on $(f,g)$, then again on $(f\\cdot g,h)$."
    }
  },

  twoways: {
    title: "Two answers",
    bullets: ["Compose $f$ and $g$.", "Then try to make a second, different composite."],
    explain: "Here is a surprise. Compose $f$ and $g$ twice and you get two different arrows, $f\\cdot g$ and $f\\cdot g'$, each with its own triangle. Neither is wrong. A triangle only says its arrow is <i>a</i> composite of $f$ and $g$, not <i>the</i> composite. So composition here is not a function that returns one answer. Later you will prove that any two composites are homotopic, which is the right notion of 'the same'.",
    hints: ["Use the same two arrows again.", "Compose: $f$, $g$. Compose: $f$, $g$ again."],
    win: ["Two different composites of the same pair.", "A triangle shows a composite, not the composite."],
    term: "Non-unique composites",
    math: {
      say: "A filler of $\\Lambda^2_1\\to X$ is not unique: a composite of $f$ and $g$ is any edge $h$ carrying a 2-simplex with boundary $(f,g,h)$. Different fillers give different composites, unique only up to homotopy.",
      proof: "Fill $\\Lambda^2_1$ on $(f,g)$ twice, choosing fillers $\\sigma\\ne\\sigma'$ with different $d_1$."
    }
  },

  /* ---------------- World 2: Tetrahedra ---------------- */

  tetra: {
    title: "Three force a fourth",
    bullets: ["Three triangles are given.", "Use Tetrahedron to get the fourth face."],
    explain: "A tetrahedron has four corners and four triangular faces. Here three faces are known: $f\\cdot g\\simeq x$, $g\\cdot h\\simeq y$ and $x\\cdot h\\simeq z$. A solid tetrahedron makes its four faces agree, so the fourth, $f\\cdot y\\simeq z$, is forced. Faces are numbered by the corner they avoid; the missing one avoids corner 2, so this is an inner horn $\\Lambda^3_2$.",
    hints: ["Tetrahedron takes three triangles that fit together.", "Tetrahedron: click the three given triangles. Fill."],
    win: ["Three faces fixed the fourth.", "The new face is $f\\cdot y\\simeq z$."],
    term: "Inner horn $\\Lambda^3_2$",
    math: {
      say: "A 3-simplex has faces $d_0,\\dots,d_3$. Given three of them forming an inner horn $\\Lambda^3_1$ or $\\Lambda^3_2$, a quasi-category supplies a 3-simplex $\\Delta^3\\to X$, and its remaining face is a new 2-simplex.",
      proof: "Fill $\\Lambda^3_2\\to X$ on $(a,b,c,d)$ with faces $d_3,d_1,d_0$; the new face $d_2$ is the target."
    }
  },

  assoc: {
    title: "Either bracketing",
    bullets: ["Bracket $f, g, h$ both ways.", "Show both brackets meet in one triangle."],
    explain: "Three arrows can be combined in two orders: $(f\\cdot g)\\cdot h$ or $f\\cdot(g\\cdot h)$. In ordinary algebra these are equal. Here they are two arrows, built by different composites. A tetrahedron relates them: it gives a triangle saying one is a composite of $f$ and $g\\cdot h$. This is <i>associativity up to homotopy</i>: the two brackets agree, but through a witness rather than an equation.",
    hints: ["Make three composites, then use Tetrahedron.", "Compose: $f$, $g$. $g$, $h$. $f\\cdot g$, $h$. Tetrahedron: path $f,g,h$. Fill."],
    win: ["The two bracketings are related by a triangle.", "Associativity holds, up to homotopy."],
    term: "Associativity",
    math: {
      say: "Composites $x$ of $(f,g)$, $y$ of $(g,h)$ and $z$ of $(x,h)$ give an inner horn $\\Lambda^3_2$. Its filler yields a 2-simplex $(f,y,z)$: $z$ is also a composite of $f$ and $y$. Associativity holds up to homotopy.",
      proof: "Fill $\\Lambda^3_2$ on $(a,b,c,d)$ with faces $(f,g,x)$, $(g,h,y)$, $(x,h,z)$; $d_2$ is $(f,y,z)$."
    }
  },

  unique: {
    title: "Any two composites agree",
    bullets: ["Make two composites of $f$ and $g$.", "Show they are homotopic."],
    explain: "Two parallel arrows $x,x'$ are <b>homotopic</b>, written $x\\simeq x'$, when a triangle joins them whose third side is a do-nothing arrow. Homotopic is weaker than equal: they may be different arrows, but they are interchangeable for everything we do. A tetrahedron whose path ends with the do-nothing arrow $1_c$ proves it for any two composites of $f$ and $g$. You also earn a tool: Same does this in one click.",
    hints: ["End the path with a do-nothing arrow at $c$.", "Compose $f$, $g$ twice. Tetrahedron: path $f,g,1_c$, both new triangles. Fill."],
    win: ["Any two composites of $f,g$ are homotopic.", "New tool: Same."],
    term: "Homotopy",
    math: {
      say: "Edges $f,g:a\\to b$ are homotopic if some 2-simplex has boundary $(f,1_b,g)$. Any two composites $x,x'$ of $(f,g)$ are homotopic: the horn $\\Lambda^3_1$ with faces $\\sigma,\\sigma',s_1(g)$ fills.",
      proof: "Fill $\\Lambda^3_1$ on $(a,b,c,c)$ with faces $\\sigma,\\sigma',s_1(g)$; the new face $d_1$ is the homotopy $x\\simeq x'$."
    }
  },

  unit: {
    title: "Doing nothing, both sides",
    bullets: ["Doing nothing before $f$, or after it, should give $f$ back.", "Show both, up to homotopy."],
    explain: "Every dot $a$ has an <b>identity</b> arrow $1_a$: the do-nothing arrow. The game makes it whenever you need it. Composing $1_a$ with $f$ gives a new arrow, and composites are not unique, so the honest claim is that it is <b>homotopic</b> to $f$, not equal. Prove it on the left, then on the right. Each side needs one composite and one tetrahedron whose path uses an identity. These are the <b>unit laws</b>, up to homotopy.",
    hints: ["Each side: compose with the identity, then a tetrahedron through it.", "Compose $1_a$, $f$. Tetrahedron: path $1_a,f,1_b$. Same for $f$, $1_b$, $1_b$."],
    win: ["Identities do nothing, up to homotopy, on either side.", "These are the unit laws."],
    term: "Unit laws",
    math: {
      say: "Unit laws up to homotopy: if $k$ is a composite of $(1_a,f)$ then $k\\simeq f$, and if $m$ is a composite of $(f,1_b)$ then $m\\simeq f$. Each follows by filling an inner horn $\\Lambda^3_1$ whose other faces are degenerate.",
      proof: "Fill $\\Lambda^3_1$ on $(a,a,b,b)$ with faces $(1_a,f,k)$, $s_0f$, $s_1f$; then $\\Lambda^3_1$ on $(a,b,b,b)$ with $(f,1_b,m)$, $s_1f$, $s_0 1_b$."
    }
  },

  bracket: {
    title: "Two ways round",
    bullets: ["$g\\cdot h\\simeq y$ and $f\\cdot y\\simeq w$ are given.", "Show $(f\\cdot g)\\cdot h$ is homotopic to $w$."],
    explain: "You have one bracketing, $f\\cdot(g\\cdot h)$, recorded as $w$. Build the other bracketing, $(f\\cdot g)\\cdot h$, then connect the two. Associativity says both brackets are composites of the same pair, and your <b>Same</b> tool says two composites of the same pair are homotopic. So the plan has two halves: make the other bracket, then show it is a composite of $f$ and $y$. Careful: not every given triangle about $g$ and $h$ is the one you need.",
    hints: ["You need a triangle saying $(f\\cdot g)\\cdot h$ is a composite of $f$, $y$.", "Compose $f,g$; then $f\\cdot g,h$. Tetrahedron: path $f,g,h$ using $g\\cdot h\\simeq y$. Same."],
    win: ["The two bracketings of $f, g, h$ are homotopic.", "Associativity plus uniqueness of composites."],
    term: "Coherence of bracketing",
    math: {
      say: "Given $(g,h,y)$ and $(f,y,w)$, the composite $(f\\circ g)\\circ h$ is homotopic to $w$. Associativity ($\\Lambda^3_2$) makes $(f\\circ g)\\circ h$ a composite of $(f,y)$; uniqueness of composites up to homotopy finishes.",
      proof: "Fill $\\Lambda^3_2$ on $(a,b,c,d)$ with faces $(f,g,f{\\cdot}g)$, $(g,h,y)$, $(f{\\cdot}g,h,\\cdot)$; then Same with $(f,y,w)$."
    }
  },

  /* ---------------- World 3: Homotopy ---------------- */

  symmetric: {
    title: "Homotopy runs both ways",
    bullets: ["$f\\simeq g$ is given.", "Show $g\\simeq f$. Unfold is on to help you see it."],
    explain: "Equality is symmetric: if $f=g$ then $g=f$. Homotopy is a weaker kind of sameness, so symmetry must be proved. The proof is a tetrahedron with corners $a, b, b, b$: the path $f$, then $1_b$, then $1_b$. Flat on the board it is invisible, so unfold is switched on: the repeated $b$s become $b, b', b''$. Pick the path, and you will see four faces: $f\\simeq g$ (given), $f\\simeq f$ and $1_b\\simeq 1_b$ (free), and the missing face $g\\simeq f$. Afterwards you own Flip.",
    hints: ["The tetrahedron's corners are $a, b, b, b$. Watch the unfolded picture.", "Tetrahedron: click $f$, $b$, $b$. Faces: $f\\simeq g$ and $f\\simeq f$. Fill."],
    win: ["Homotopy is symmetric.", "New tool: Flip."],
    term: "Symmetry",
    math: {
      say: "Homotopy of edges is symmetric: from $\\sigma$ with boundary $(f,1_b,g)$, an inner horn $\\Lambda^3_1$ with faces $\\sigma$, $s_1(f)$, $s_0(1_b)$ fills, and $d_1$ has boundary $(g,1_b,f)$.",
      proof: "Fill $\\Lambda^3_1$ on $(a,b,b,b)$ with faces $\\sigma$, $s_1(f)$, $s_0(1_b)$; $d_1$ is $g\\simeq f$."
    }
  },

  transitive: {
    title: "Homotopy chains",
    bullets: ["$f\\simeq g$ and $g\\simeq h$ are given.", "Show $f\\simeq h$."],
    explain: "Equality chains: $f=g$ and $g=h$ give $f=h$. For homotopy that needs a proof too, and again a tetrahedron does it. With symmetry and the obvious $f\\simeq f$, homotopy becomes an <b>equivalence relation</b>: parallel arrows sort into groups of mutually homotopic ones. You earn Link, which joins two homotopies in one click.",
    hints: ["Use the same path, with both homotopies.", "Tetrahedron: path $f,1_b,1_b$, with $f\\simeq g$ and $g\\simeq h$. Fill."],
    win: ["Homotopy is transitive.", "New tool: Link."],
    term: "Equivalence relation",
    math: {
      say: "Homotopy is transitive: an inner horn $\\Lambda^3_2$ with faces for $f\\simeq g$, $g\\simeq h$ and $s_0(1_b)$ gives $f\\simeq h$. So homotopy is an equivalence relation, and edges modulo it form the homotopy category $hX$.",
      proof: "Fill $\\Lambda^3_2$ on $(a,b,b,b)$ with $d_3,d_1$ the two homotopies and $d_0=s_0(1_b)$; $d_2$ is $f\\simeq h$."
    }
  },

  whisker: {
    title: "Swap in homotopic arrows",
    bullets: ["$f\\simeq k$ and $f\\cdot g\\simeq x$ are given.", "Show $k\\cdot g\\simeq x$."],
    explain: "If two arrows are homotopic, replacing one by the other inside a composite should change nothing that matters. This is what lets us treat homotopic arrows as interchangeable. A tetrahedron with path $f,1_b,g$ proves it. You earn Swap in: a tool that replaces an arrow by a homotopic one inside any triangle you choose.",
    hints: ["Use the path $f$, do-nothing, then $g$.", "Tetrahedron: path $f,1_b,g$, with $f\\simeq k$ and $f\\cdot g\\simeq x$. Fill."],
    win: ["Homotopic arrows can be swapped inside a composite.", "New tool: Swap in."],
    term: "Homotopy respects composition",
    math: {
      say: "If $f\\simeq k$ and $\\sigma$ witnesses $x$ as a composite of $(f,g)$, then $x$ is also a composite of $(k,g)$. The inner horn $\\Lambda^3_1$ on $(a,b,b,c)$ fills.",
      proof: "Fill $\\Lambda^3_1$ on $(a,b,b,c)$ with faces: the homotopy $f\\simeq k$, $\\sigma$, $s_0(g)$; $d_1$ is $(k,g,x)$."
    }
  },

  swap: {
    title: "Homotopy from either end",
    bullets: ["$f\\simeq g$ ends with $1_b$.", "Build a version that begins with $1_a$."],
    explain: "The homotopy $f\\simeq g$ is a triangle with the do-nothing arrow $1_b$ at the end. There is also a mirror version with $1_a$ at the beginning: a triangle $1_a\\cdot f\\simeq g$. In a quasi-category the two ways of being homotopic agree. The path $1_a,f,1_b$ has do-nothing arrows at both ends, which is what makes the comparison possible.",
    hints: ["Use a path with do-nothing arrows at both ends.", "Tetrahedron: path $1_a,f,1_b$, with $f\\simeq g$. Fill."],
    win: ["The two ways of being homotopic agree."],
    term: "Two-sided homotopy",
    math: {
      say: "Edges are homotopic if some 2-simplex has boundary $(f,1_b,g)$. In a quasi-category this is equivalent to a 2-simplex with boundary $(1_a,f,g)$, via an inner horn $\\Lambda^3_2$.",
      proof: "Fill $\\Lambda^3_2$ on $(a,a,b,b)$ with faces $\\sigma$, $s_0(f)$, $s_1(f)$; $d_2$ has boundary $(1_a,f,g)$."
    }
  },

  relay: {
    title: "Pass it along",
    bullets: ["A chain of homotopies runs from $x_3$ to $x_0$.", "Show $x_3\\cdot h\\simeq z$, using only theorems."],
    explain: "You only know that $x_0\\cdot h\\simeq z$. But $x_3$ is homotopic to $x_2$, which is homotopic to $x_1$, which is homotopic to $x_0$. Homotopy behaves like sameness: you can <b>chain</b> it (Link), <b>reverse</b> it (Flip), and <b>substitute</b> along it (Swap in). That is exactly what makes it an <b>equivalence relation</b> that composites respect. No tetrahedra this time: only the theorems you proved. Watch the directions: a homotopy goes from one arrow to another.",
    hints: ["Chain the homotopies into one, then substitute.", "Link $x_3\\simeq x_2$, $x_2\\simeq x_1$; link with $x_1\\simeq x_0$. Flip. Swap in."],
    win: ["Homotopy is an equivalence relation that composites respect."],
    term: "Equivalence relation",
    math: {
      say: "In a quasi-category, homotopy of morphisms $a\\to c$ is an equivalence relation, and 2-simplices can be transported along it: if $x\\simeq x'$ and $(x,h,z)$ is a 2-simplex, there is a 2-simplex $(x',h,z)$.",
      proof: "Compose $x_3\\simeq x_2\\simeq x_1\\simeq x_0$ by transitivity, invert by symmetry, then transport $(x_0,h,z)$ along $x_0\\simeq x_3$."
    }
  },

  fourway: {
    title: "Five dots, two routes",
    bullets: ["Four arrows in a row, with some shortcuts given.", "Show $((x\\cdot h)\\cdot i)$ is homotopic to $s$."],
    explain: "With four steps there are many ways to bracket, and each bracketing is its own arrow. You will build one bracketing yourself, then walk it, one tetrahedron at a time, until it is a composite of the same pair as $s$. Then your Same tool closes the gap. This is how associativity <i>propagates</i>: each tetrahedron moves one bracket. Expect to plan two tetrahedra ahead; one of the given triangles looks useful and isn't.",
    hints: ["Aim for a triangle saying your arrow is a composite of $f$, $u$.", "Compose $x,h$; then $x\\cdot h,i$. Tetrahedra: path $x,h,i$, then $f,g,y$. Same."],
    win: ["Every bracketing of four arrows is homotopic to every other."],
    term: "Higher associativity",
    math: {
      say: "For composable $f,g,h,i$ all bracketings are homotopic. Each reassociation is a filler of $\\Lambda^3_2$; chaining two of them and using uniqueness of composites relates $(x\\circ h)\\circ i$ to $s$, a composite of $(f,u)$.",
      proof: "Fill $\\Lambda^3_2$ on $(a,c,d,e)$, giving $(x,y,\\cdot)$; fill $\\Lambda^3_2$ on $(a,b,c,e)$, giving $(f,u,\\cdot)$; then Same with $(f,u,s)$."
    }
  },

  /* ---------------- World 4: Undo everything ---------------- */

  undo: {
    title: "Back out",
    bullets: ["Find an arrow back from $b$ to $a$.", "Solve $f\\cdot ? = h$ finds a missing arrow."],
    explain: "So far every gap was in the middle of a trip: an inner horn. Now the space is generous and may fill any one missing side. Give Solve the arrow $f$ and the do-nothing arrow $1_a$. It makes a new arrow $f^{-1}$ from $b$ back to $a$, with a triangle saying $f$ then $f^{-1}$ is $1_a$. The gap is at the end of the trip, so this is an <i>outer</i> horn $\\Lambda^2_0$.",
    hints: ["Solve $f\\cdot ? = h$ needs two arrows leaving one dot.", "Solve $f\\cdot ? = h$: click $f$, then $1_a$."],
    win: ["$f^{-1}$ undoes $f$: $f$ then $f^{-1}$ is $1_a$.", "A left inverse."],
    term: "Outer horn $\\Lambda^2_0$",
    math: {
      say: "A horn $\\Lambda^2_0\\to X$ with edges $f$ and $1_a$ has a filler $\\sigma$ with $d_2\\sigma=f$, $d_1\\sigma=1_a$; then $g=d_0\\sigma$ is a left inverse of $f$. Kan complexes fill all $\\Lambda^n_k$, including outer horns.",
      proof: "Fill $\\Lambda^2_0$ on $(f,1_a)$; the filler's $d_0$ is $f^{-1}$."
    }
  },

  divide: {
    title: "Divide",
    bullets: ["You know $g$ and a shortcut $h$.", "Find $f$ so that $h$ is a composite of $f$ then $g$."],
    explain: "This is the mirror image. You know the second arrow $g$ and the shortcut $h$, and you want the first arrow. The missing side is at the start of the trip, an outer horn $\\Lambda^2_2$. It is like solving $?\\times g = h$ for the unknown, except that no arithmetic is involved: the space is generous enough to supply a missing side of a triangle.",
    hints: ["Solve $?\\cdot g = h$ needs two arrows ending at $c$.", "Solve $?\\cdot g = h$: click $g$, then $h$."],
    win: ["You solved for the first arrow."],
    term: "Outer horn $\\Lambda^2_2$",
    math: {
      say: "A horn $\\Lambda^2_2\\to X$ with edges $g:b\\to c$ and $h:a\\to c$ has a filler $\\sigma$ with $d_0\\sigma=g$, $d_1\\sigma=h$; $f=d_2\\sigma$ is a left divisor of $h$ by $g$. Kan complexes fill these.",
      proof: "Fill $\\Lambda^2_2$ on $(g,h)$; the filler's $d_2$ is the quotient $f$."
    }
  },

  inverses: {
    title: "Undo on both sides",
    bullets: ["Find an inverse on each side of $f$.", "Show the two inverses are homotopic."],
    explain: "A <b>left inverse</b> $g$ has $f\\cdot g\\simeq 1_a$. A <b>right inverse</b> $k$ has $k\\cdot f\\simeq 1_b$. Two different Solve tools build them. They need not be the same arrow, but one tetrahedron shows they are homotopic, which is the sameness that matters. An arrow with both is an <b>isomorphism</b>, also called an <b>equivalence</b>: reversible, with an inverse unique up to homotopy.",
    hints: ["One Solve per side, then one Tetrahedron.", "Solve $f\\cdot ? = h$: $f$, $1_a$. Solve $?\\cdot g = h$: $f$, $1_b$. Tetrahedron: path second inverse, $f$, first."],
    win: ["Left and right inverses are homotopic.", "So $f$ is an isomorphism."],
    term: "Equivalence",
    math: {
      say: "In a Kan complex an edge $f$ has a left inverse $g$ ($\\Lambda^2_0$) and a right inverse $k$ ($\\Lambda^2_2$), and $k\\simeq g$ by an inner horn $\\Lambda^3_2$. So $f$ is an equivalence and $X$ is an $\\infty$-groupoid.",
      proof: "Fill $\\Lambda^3_2$ on $(b,a,b,a)$ with the two inverse 2-simplices and $s_0(g)$; $d_2$ is $k\\simeq g$."
    }
  },

  cancel: {
    title: "Cancel twice",
    bullets: ["$f\\cdot g\\simeq p$, $k\\cdot g\\simeq q$, and $p\\cdot h$, $q\\cdot h$ both give $x$.", "Show $f\\simeq k$."],
    explain: "In this world every horn fills, including the <b>outer</b> ones, so you may cancel: if two arrows give the same result after $h$, they are homotopic. Do it twice. First cancel $h$ to relate $p$ and $q$. Then use that to rewrite a triangle so both $f$ and $k$ composite with $g$ to the same arrow, and cancel $g$. Cancelling is exactly what fails in a general ∞-category; here it works because every arrow can be undone.",
    hints: ["Cancel $h$ first, to relate $p$ and $q$.", "Tetrahedron: path $p,1_c,h$. Swap in. Tetrahedron: path $f,1_b,g$. Fill each outer face."],
    win: ["When every horn fills, arrows cancel from the right."],
    term: "Right cancellation",
    math: {
      say: "In a Kan complex, if $(p,h,x)$ and $(q,h,x)$ are 2-simplices then $p\\simeq q$: fill the outer horn $\\Lambda^3_3$. Applied twice, with transport in between, $f\\circ g\\simeq k\\circ g$ cancels to $f\\simeq k$.",
      proof: "Fill $\\Lambda^3_3$ on $(a,c,c,d)$ for $p\\simeq q$; transport $(f,g,p)$ to $(f,g,q)$; fill $\\Lambda^3_3$ on $(a,b,b,c)$ for $f\\simeq k$."
    }
  },

  socks: {
    title: "Socks and shoes",
    bullets: ["$\\bar f$ undoes $f$, and $\\bar g$ undoes $g$, up to homotopy.", "Show $w=\\bar g\\cdot\\bar f$ undoes $f\\cdot g$."],
    explain: "You put on socks, then shoes; to undo it you take off shoes first, then socks. So the inverse of $f$ then $g$ is $\\bar g$ then $\\bar f$: the order reverses. Proving it means cancelling from the inside out: $g$ against $\\bar g$, then $f$ against $\\bar f$. Here the fact you need about $g$ is stated about a homotopic copy of $\\bar g$, so you will substitute first. Each cancellation is one tetrahedron.",
    hints: ["Get $g\\cdot\\bar g\\simeq 1_b$ exactly, then cancel inside out.", "Compose $f,g$. Swap in $\\bar g'\\simeq\\bar g$. Tetrahedra: path $f,g,\\bar g$; path $f\\cdot g,\\bar g,\\bar f$."],
    win: ["Undo a two-step trip by undoing the steps in reverse order."],
    term: "Inverse of a composite",
    math: {
      say: "If $\\bar f\\circ f\\simeq 1_a$ and $\\bar g\\circ g\\simeq 1_b$, and $w$ is a composite of $(\\bar g,\\bar f)$, then $w\\circ(g\\circ f)\\simeq 1_a$. Two inner 3-horns do the cancelling.",
      proof: "Transport $(g,\\bar g',1_b)$ to $(g,\\bar g,1_b)$; fill $\\Lambda^3_1$ on $(a,b,c,b)$ with $s_1f$; fill $\\Lambda^3_2$ on $(a,c,b,a)$."
    }
  },

  /* ---------------- World 5: Nerves of categories ---------------- */

  nerve: {
    title: "A category's nerve",
    bullets: ["A composition table lists each composite.", "Compose $f$ and $g$."],
    explain: "This world is a category in the everyday sense: its <b>composition table</b> says what $f$ then $g$ gives, with exactly one answer. The shape built from a category's objects, arrows and composition rules is called its <b>nerve</b>. Every horn in a nerve has exactly one filler. Look at the composition table to see the entry for $f$ and $g$; Compose will follow it.",
    hints: ["The composition table has the answer.", "Compose: $f$, $g$."],
    win: ["The table gave exactly the triangle you expected."],
    term: "Nerve of a category",
    math: {
      say: "The nerve $N_\\bullet(\\mathcal C)$ of a category has $n$-simplices the chains of $n$ composable morphisms. Every inner horn $\\Lambda^n_k\\to N_\\bullet(\\mathcal C)$ has a unique filler; for $n=2$ it is the composite $g\\circ f$.",
      proof: "The 2-simplex $(f,g,g\\circ f)$ is the unique filler of $\\Lambda^2_1$."
    }
  },

  onlyone: {
    title: "Only one answer",
    bullets: ["Same composition table.", "Try to make a second composite."],
    explain: "In earlier worlds composing twice gave two different arrows. In a nerve that fails: the composition table has one entry, so the second attempt is refused. Unique fillers are what make a nerve an ordinary category rather than a general quasi-category, where composites are only unique up to homotopy. Being refused is the point of this level.",
    hints: ["Compose $f$, $g$, then try again.", "Compose: $f$, $g$. Compose: $f$, $g$ again."],
    win: ["The second attempt was refused.", "Exactly one composite exists."],
    term: "Unique fillers",
    math: {
      say: "Unique inner horn fillers characterise nerves: $X\\cong N_\\bullet(\\mathcal C)$ iff each inner horn $\\Lambda^n_k\\to X$ has exactly one extension to $\\Delta^n$. In a general quasi-category fillers are only unique up to homotopy.",
      proof: "A second filler of $\\Lambda^2_1$ on $(f,g)$ is refused: it would equal $\\sigma$."
    }
  },

  nerve3: {
    title: "Associativity, forced",
    bullets: ["One composition table entry is blank.", "Find the triangle $f\\cdot q\\simeq r$."],
    explain: "Not every entry is listed, but a solid tetrahedron forces the missing one. Compose what the table allows, then use Tetrahedron: its fourth face fills the blank. In an ordinary category that fourth face is just associativity, $(f\\cdot g)\\cdot h=f\\cdot(g\\cdot h)$. The nerve records it as a solid, and the blank is that solid's fourth face. Your tetrahedron proves associativity for these three arrows, even though the table never listed it.",
    hints: ["Compose what you can. A tetrahedron fills the blank.", "Compose: $f$, $g$. $g$, $h$. $gf$, $h$. Tetrahedron: path $f,g,h$. Fill."],
    win: ["A tetrahedron forced the blank entry.", "Associativity is a solid in the nerve."],
    term: "Nerve is a quasi-category",
    math: {
      say: "A 3-simplex of $N_\\bullet(\\mathcal C)$ is a chain $a\\to b\\to c\\to d$ with all its composites; associativity $h\\circ(g\\circ f)=(h\\circ g)\\circ f$ says its faces are consistent. Inner horns $\\Lambda^3_k$ fill uniquely.",
      proof: "Fill $\\Lambda^3_2$ on $(a,b,c,d)$ with faces $(f,g,p)$, $(g,h,q)$, $(p,h,r)$; $d_2=(f,q,r)$ fills the blank."
    }
  },

  segalno: {
    title: "Nerve or not?",
    bullets: ["A nerve has exactly one composite for every two arrows end to end.", "Is this picture a nerve? If not, show the pair that fails."],
    explain: "The nerve of a category is a very particular kind of shape: whenever two arrows meet end to end, there is <i>exactly one</i> triangle on them. Not zero, not two. A chain of arrows end to end is called a <b>spine</b>, and the rule says every spine has one and only one filling. From here on you are the judge: either declare the picture a nerve, or point at a pair of arrows that breaks the rule.",
    hints: ["Do $f$ and $g$ have a composite at all?", "Not a nerve: pick $f$, then $g$."],
    win: ["No composite for $f$ then $g$, so no category gives this picture."],
    term: "Spine",
    math: {
      say: "$X\\cong N(\\mathcal C)$ for a category $\\mathcal C$ iff every inner horn has a unique filler; equivalently every spine $I^n\\to X$ extends uniquely to $\\Delta^n$ (the Segal condition).",
      proof: "The horn $\\Lambda^2_1\\to X$ given by $(f,g)$ has no filler."
    }
  },

  segalyes: {
    title: "One of each",
    bullets: ["Same question, new picture.", "Nerve, or not?"],
    explain: "Check every pair of arrows that meet end to end. Do not forget the identity arrows: every dot has one, and an identity followed by $f$ always has the free triangle saying the result is $f$. If every pair has exactly one triangle, the picture is the nerve of a category whose composition table you can read straight off it.",
    hints: ["List the pairs that meet end to end. There are few.", "Press It is a nerve."],
    win: ["One composite for every pair: this is the nerve of $a\\to b\\to c$."],
    term: "Segal condition",
    math: {
      say: "This simplicial set is $\\Delta^2=N([2])$: every horn $\\Lambda^2_1\\to\\Delta^2$ has exactly one filler, as composition in the poset $[2]$ is unique.",
      proof: "The only non-degenerate horn is $(f,g)$, filled uniquely by the 2-simplex with third edge $h$."
    }
  },

  twofill: {
    title: "Too many answers",
    bullets: ["Everything composes here.", "Nerve, or not?"],
    explain: "It is tempting to think a picture fails to be a nerve only when something is missing. The rule cuts both ways. In a category, composing $f$ then $g$ is an operation with one answer. In earlier worlds you met pictures where it had two, related by a homotopy. Those pictures are perfectly good ∞-categories, but they are not nerves of ordinary categories.",
    hints: ["Count the triangles on $f$ and $g$.", "Not a nerve: pick $f$, then $g$."],
    win: ["Two composites for one pair: an ∞-category, but not a nerve."],
    term: "Unique fillers",
    math: {
      say: "A quasi-category is the nerve of a category iff inner horns fill uniquely. Here $\\Lambda^2_1\\to X$ given by $(f,g)$ has two distinct fillers.",
      proof: "The 2-simplices with boundaries $(f,g,x)$ and $(f,g,x')$ both fill the horn $(f,g)$."
    }
  },

  hiddenhole: {
    title: "Find the gap",
    bullets: ["Four dots, six arrows, three triangles.", "Nerve, or not? Check every pair."],
    explain: "With more arrows there are more pairs to check, and composites are arrows too: a pair can start or end with one. Work through them in order. For each pair that meets end to end, look for its triangle in the Facts list. A single pair with no triangle is enough to refuse.",
    hints: ["Pairs can involve the composites $x$ and $y$ as well.", "Not a nerve: pick $f$, then $y$."],
    win: ["$f$ then $y$ has no triangle, so associativity is not recorded."],
    term: "Inner horn $\\Lambda^3_1$",
    math: {
      say: "A nerve fills every spine uniquely, so with $(f,g,x)$, $(g,h,y)$, $(x,h,z)$ present the face $(f,y,z)$ is forced. Here that horn $\\Lambda^2_1$ on $(f,y)$ has no filler.",
      proof: "No 2-simplex has first two edges $(f,y)$: the horn $\\Lambda^2_1\\to X$ they define does not extend."
    }
  },

  quotient: {
    title: "The squashed triangle",
    bullets: ["Two arrows from $p$ to $c$, and one triangle through the identity at $p$.", "Nerve, or not?"],
    explain: "This picture is a full triangle with one side squashed to a point: that side became the identity at $p$. Everything seems to compose. But remember the free facts: an identity followed by $e$ always has the triangle saying the result is $e$. Now look at what the given triangle says about the very same pair. A homotopy between two different arrows can never live in a nerve.",
    hints: ["An identity then $e$ already has a free composite: $e$.", "Not a nerve: click the dot $p$, then $e$."],
    win: ["The identity then $e$ has two composites: $e$ for free, and $e'$."],
    term: "Quotient $\\Delta^2/\\Delta^{\\{0,1\\}}$",
    math: {
      say: "$\\Delta^2/\\Delta^{\\{0,1\\}}$ is not a nerve: the horn $(1_p,e)$ has two fillers, the degenerate $s_0(e)$ and the image $\\sigma$ of the top simplex, with $d_1\\sigma=e'\\neq e$.",
      proof: "$s_0(e)$ has boundary $(1_p,e,e)$ and $\\sigma$ has boundary $(1_p,e,e')$: two fillers of one inner horn."
    }
  },

  /* ---------------- World 6: Bones ---------------- */

  disc: {
    title: "Cover it",
    bullets: ["Draw the three sides of a triangle.", "Then glue a triangle onto them."],
    explain: "We now build shapes. A <b>skeleton</b> keeps only low dimensions: first dots, then arrows, then triangles. Draw three arrows and you have the boundary of a triangle, written $\\partial\\Delta^2$. Gluing a triangle over it is called <i>attaching a cell</i>: the new triangle's boundary must land on arrows you already have. Unlike composing, nothing new is made for the sides.",
    hints: ["Glue triangle needs three arrows that close up.", "Draw arrow: $a,b$. $b,c$. $a,c$. Glue triangle: the three arrows."],
    win: ["You drew an outline, then glued a 2-cell onto it."],
    term: "Attaching a cell",
    math: {
      say: "Given $\\partial\\Delta^2\\to X$, the pushout $X\\sqcup_{\\partial\\Delta^2}\\Delta^2$ attaches a 2-cell to $X$ along it. Here $X=\\mathrm{sk}_1\\Delta^2=\\partial\\Delta^2$ and the loop is the identity map.",
      proof: "Pushout along $\\partial\\Delta^2\\hookrightarrow\\Delta^2$ on the loop of the three drawn edges gives $\\Delta^2$."
    }
  },

  sphere: {
    title: "Two lids",
    bullets: ["Same hollow triangle.", "Glue two triangles onto it."],
    explain: "Glue a second triangle over the same boundary and the result is hollow like the surface of a ball: a <b>2-sphere</b>. The two triangles are different simplices with the same three sides. So in a simplicial set a boundary can have many fillers, and shapes built by attaching cells are the building blocks of spaces.",
    hints: ["Glue the same three arrows twice.", "Glue triangle: $f,g,h$. Glue triangle: $f,g,h$ again."],
    win: ["Two cells on one boundary form a sphere."],
    term: "2-sphere",
    math: {
      say: "Attaching two 2-cells along the same map $\\partial\\Delta^2\\to X$ gives $\\Delta^2\\sqcup_{\\partial\\Delta^2}\\Delta^2$, a simplicial model of the 2-sphere: its geometric realisation is homotopy equivalent to $S^2$.",
      proof: "Two pushouts of $\\partial\\Delta^2\\hookrightarrow\\Delta^2$ along the same loop $(f,g,h)$."
    }
  },

  peel: {
    title: "Peel it",
    bullets: ["A solid tetrahedron.", "End with six arrows and one triangle."],
    explain: "Peel takes the top layer off. Peel once and the solid disappears, leaving its four faces: the 2-skeleton, which is also the boundary $\\partial\\Delta^3$. Peel again and only the six arrows and four dots remain, the 1-skeleton. Then glue one triangle back along its boundary. Skeleta forget everything above a given dimension; cells put pieces back.",
    hints: ["Peel twice, then glue one triangle back.", "Peel. Peel. Glue triangle: $f,g,x$."],
    win: ["Skeleta keep the lower layers.", "Cells add upper layers back."],
    term: "Skeleton",
    math: {
      say: "$\\mathrm{sk}_n$ forgets simplices of dimension $>n$: $\\mathrm{sk}_2\\Delta^3=\\partial\\Delta^3$, and $\\mathrm{sk}_1\\Delta^3$ is its six edges. Re-attaching one 2-cell along $\\partial\\Delta^2\\hookrightarrow\\Delta^2$ restores one face.",
      proof: "Take $\\mathrm{sk}_2$, then $\\mathrm{sk}_1$, then glue one $\\Delta^2$ along its boundary."
    }
  },

  hollowtet: {
    title: "Four faces, no inside",
    bullets: ["A wire frame: four dots and six arrows.", "Glue on exactly the four faces. Leave the inside empty."],
    explain: "The <b>boundary</b> of a tetrahedron is four triangles glued along their shared edges, with nothing inside. Each face uses three arrows that close up: two end to end, and one going straight across. With six arrows there are twenty ways to choose three, and only four of them close up. This hollow shape is written $\\partial\\Delta^3$, and it is a sphere.",
    hints: ["A face is two arrows end to end plus the arrow across.", "Glue $f,g,x$. Glue $g,h,y$. Glue $x,h,z$. Glue $f,y,z$."],
    win: ["The boundary of a tetrahedron: four faces, glued along six edges."],
    term: "Boundary $\\partial\\Delta^3$",
    math: {
      say: "$\\partial\\Delta^n$ is the coequalizer of $\\coprod_{i<j}\\Delta^{n-2}\\rightrightarrows\\coprod_i\\Delta^{n-1}$: the $n+1$ faces glued along their pairwise intersections. For $n=3$: four 2-simplices along six edges.",
      proof: "Attach four 2-cells to $\\mathrm{sk}_1\\Delta^3$ along the four subcomplexes $\\partial\\Delta^2$ spanned by three vertices."
    }
  },

  fillin: {
    title: "Fill in",
    bullets: ["Peel removes the top layer. Fill in does the opposite.", "Fill the hollow triangle."],
    explain: "Peel forgets everything above a dimension: that is the <b>skeleton</b>. The <b>coskeleton</b> goes the other way. It looks at every hollow shape, every place where a boundary is present with nothing inside, and fills each one in the only way possible: with exactly one cell. It never has to choose, which is why it is one click.",
    hints: ["There is only one tool.", "Press Fill in."],
    win: ["The coskeleton filled the one hollow triangle."],
    term: "Coskeleton",
    math: {
      say: "$(\\mathrm{cosk}_n X)_m=\\mathrm{Hom}(\\mathrm{sk}_n\\Delta^m,X)$: an $m$-simplex of the coskeleton is a compatible family of its faces of dimension $\\le n$. $\\mathrm{cosk}_n$ is right adjoint to $\\mathrm{sk}_n$.",
      proof: "$\\mathrm{cosk}_1(\\partial\\Delta^2)$ has a unique 2-simplex with the given boundary, so it is $\\Delta^2$."
    }
  },

  rebuild: {
    title: "Wire frame to shell",
    bullets: ["A wire frame again.", "Make the hollow tetrahedron in two moves."],
    explain: "Last time gluing the four faces took four careful moves. Fill in does all of them at once, but it does not stop there: once the four faces are present, the inside is a hollow shape too, and it gets filled. So the coskeleton overshoots. Combine it with the tool that removes the top layer. Skeleton and coskeleton are opposite operations, and useful shapes often sit between them.",
    hints: ["Fill in gives too much. What removes the top layer?", "Press Fill in. Then Peel."],
    win: ["Fill in, then peel once: the hollow tetrahedron."],
    term: "$\\mathrm{sk}_2\\,\\mathrm{cosk}_1$",
    math: {
      say: "$\\mathrm{cosk}_1(\\mathrm{sk}_1\\Delta^3)=\\Delta^3$, since nerves of posets are 1-coskeletal, and $\\mathrm{sk}_2\\Delta^3=\\partial\\Delta^3$. So $\\mathrm{sk}_2\\mathrm{cosk}_1\\mathrm{sk}_1\\Delta^3=\\partial\\Delta^3$.",
      proof: "The coskeleton adds the four 2-simplices and the 3-simplex; the 2-skeleton discards the 3-simplex."
    }
  },

  /* ---------------- World 7: Possible or not? ---------------- */

  spine: {
    title: "Fill the spine",
    bullets: ["Three arrows in a row.", "Build the full tetrahedron, or say it can't be done."],
    explain: "From here on some goals are possible and some are not, and you must decide. If you think a goal cannot be done, press <b>This can't be done</b> and give the reason; a wrong reason costs a move. Here the three arrows, the <i>spine</i> of a tetrahedron, are laid out in a row. Check whether inner horn fillings can build the whole solid on top of them.",
    hints: ["You solved this earlier in Either bracketing.", "Compose: $f$, $g$. $g$, $h$. $f\\cdot g$, $h$. Tetrahedron: path $f,g,h$. Fill."],
    win: ["Possible: inner moves built the full tetrahedron.", "The shape did not change."],
    term: "Inner anodyne",
    math: {
      say: "The spine inclusion $\\mathrm{Spine}^3\\hookrightarrow\\Delta^3$ is inner anodyne: it lies in the saturated class generated by inner horn inclusions $\\Lambda^n_k\\hookrightarrow\\Delta^n$. So it has the left lifting property against inner fibrations.",
      proof: "Fill $\\Lambda^2_1$ three times for the composites; then $\\Lambda^3_2$ gives the 3-simplex on $(a,b,c,d)$."
    }
  },

  nofill: {
    title: "Fill the ring",
    bullets: ["A hollow triangle.", "Cover it, or say it can't be done."],
    explain: "The triangle has three arrows but no filled face. Every tool here fills a <i>horn</i>: a shape with exactly one face missing. This shape is not a horn. It is a closed loop, and composing $f$ and $g$ makes a new arrow instead of covering $h$. If you decide it cannot be done, press the button and choose the reason.",
    hints: ["No horn is present, so try to prove it impossible.", "This can't be done: Hollow triangle. Place $a,b,c$ on $0,1,2$."],
    win: ["Impossible: horn filling never covers a hole."],
    term: "Not anodyne",
    math: {
      say: "$\\partial\\Delta^2\\hookrightarrow\\Delta^2$ is not anodyne: anodyne maps are weak homotopy equivalences, but $|\\partial\\Delta^2|\\simeq S^1$ while $|\\Delta^2|$ is contractible. Horn fillings cannot cap a hollow triangle.",
      proof: "Every horn move adds a new edge; none attaches a 2-cell to the existing $h$."
    }
  },

  almostring: {
    title: "Almost a ring",
    bullets: ["Looks like the hollow triangle, but more is known.", "Show $h$ is a composite of $f$ then $g$."],
    explain: "The ring $f, g, h$ looks just like the hollow triangle you could not fill. The difference is the extra facts: $x$ is a composite of $f$ and $g$, and both $x$ and $h$ are homotopic to $m$. Homotopy lets you <b>substitute</b> one arrow for another inside a triangle, so you can walk the triangle from $x$ to $m$ to $h$. Being possible or not depends on the whole picture, not just its outline.",
    hints: ["Walk the triangle $f\\cdot g\\simeq x$ along homotopies until it ends at $h$.", "Swap in $x\\simeq m$. Flip $h\\simeq m$. Swap in $m\\simeq h$."],
    win: ["The ring fills because a homotopy fills the hole."],
    term: "Transport along homotopy",
    math: {
      say: "If $(f,g,x)$ is a 2-simplex and $x\\simeq m\\simeq h$ (in either direction), then there is a 2-simplex $(f,g,h)$: 2-simplices transport along homotopies, which form an equivalence relation.",
      proof: "Transport $(f,g,x)$ along $x\\simeq m$; reverse $h\\simeq m$; transport along $m\\simeq h$."
    }
  },

  wedge: {
    title: "Two tetrahedra",
    bullets: ["Shortcuts $x$, $z$, $t$ cover four arrows in a row.", "Build both missing tetrahedra, or say it can't be done."],
    explain: "A tetrahedron needs three faces before you can fill the fourth. Here each tetrahedron is missing two: one face you can make by composing, and the face you are asked for. That is still an <b>inner horn</b> once you add the composite, so it fills. The second tetrahedron shares an edge with the first. The skill here is noticing that a missing face can sometimes simply be built.",
    hints: ["Each tetrahedron lacks a face you can make with Compose.", "Compose $g,h$; Tetrahedron $f,g,h$. Compose $h,i$; Tetrahedron $x,h,i$."],
    win: ["Missing faces you can build don't block a filling."],
    term: "Inner anodyne",
    math: {
      say: "The union of two 2-simplices along an edge, extended by composites, includes into the 3-simplices by inner horn fillings: the inclusion is inner anodyne, so any map from it to a quasi-category extends.",
      proof: "Fill $\\Lambda^2_1$ for $g{\\cdot}h$, then $\\Lambda^3_2$ on $(a,b,c,d)$; fill $\\Lambda^2_1$ for $h{\\cdot}i$, then $\\Lambda^3_2$ on $(a,c,d,e)$."
    }
  },

  squarehole: {
    title: "Hole in the square",
    bullets: ["Two routes from $a$ to $d$.", "Make both routes give the same arrow, or say it can't be done."],
    explain: "Two routes, $f$ then $g$ and $u$ then $v$, both go from $a$ to $d$. Composing each gives an arrow, and the goal wants both composites to be the <i>same</i> arrow. But nothing joins the two routes: the square is hollow, with no triangle making them agree. Horn fillings never fill a hole, and they cannot identify arrows that nothing relates.",
    hints: ["Compose both ways round. Are the two results related?", "This can't be done: Square that does not commute. Place the dots in order."],
    win: ["Impossible: nothing fills the hole between the routes."],
    term: "A hole",
    math: {
      say: "With no 2-simplex joining the routes $(f,g)$ and $(u,v)$, composites of the two routes are different edges; no horn $\\Lambda^n_k$ in this simplicial set relates them, since fillers only add simplices over existing boundaries.",
      proof: "Every filler creates a new edge for each composite; none identifies $f\\cdot g$ with $u\\cdot v$."
    }
  },

  parallel: {
    title: "Two lone arrows",
    bullets: ["$f$ and $g$ both go from $a$ to $b$.", "Join them with a homotopy, or say it can't be done."],
    explain: "Two parallel arrows are not homotopic just because they share endpoints. A homotopy is a triangle $f\\simeq g$, and no tool here creates one out of nothing. Every move starts from triangles that already exist, and there are none. Compare with the Homotopy world, where the first triangle was always given.",
    hints: ["Is there any fact linking the two arrows?", "This can't be done: Two parallel arrows. Send $f$ to $p$, $g$ to $q$."],
    win: ["Impossible: nothing links arrows that share no triangle."],
    term: "No free homotopy",
    math: {
      say: "Parallel edges $f,g:a\\to b$ need not be homotopic: the simplicial set with just these two edges has no 2-simplex with boundary $(f,1_b,g)$, and horn fillings never create a relation between existing edges.",
      proof: "Each horn move creates a new edge or a degenerate cell; none joins $f$ and $g$."
    }
  },

  square: {
    title: "Fill the square",
    bullets: ["$f, v$ and $u$ form an open square; $t$ leaves its corner.", "Cover it with triangles and a tetrahedron, or say it can't be done."],
    explain: "A square with a missing side looks like it has a hole. But in this world every horn fills, including outer ones, so you can <b>solve</b> for the missing side: find $x$ with $u\\cdot x\\simeq f\\cdot v$. Then the square is two triangles glued along the diagonal. Extending it by $t$ asks for a tetrahedron, which needs composites with $t$ first. Some arrows here lead nowhere.",
    hints: ["Make the diagonal, solve for the missing side, then extend by $t$.", "Compose $f,v$. Solve $u$, $f\\cdot v$. Compose $x,t$ and $f\\cdot v,t$. Tetrahedron $u,x,t$."],
    win: ["An open square fills when every horn can be filled."],
    term: "Anodyne extension",
    math: {
      say: "In a Kan complex the open square (a horn of $\\Delta^1\\times\\Delta^1$) extends: fill $\\Lambda^2_1$ for the diagonal, $\\Lambda^2_0$ for the missing side; the inclusion is anodyne, and the extension by $t$ fills $\\Lambda^3_2$.",
      proof: "Fill $\\Lambda^2_1$ ($f{\\cdot}v$), $\\Lambda^2_0$ ($x$), two $\\Lambda^2_1$ with $t$, then $\\Lambda^3_2$ on $(a,c,d,e)$."
    }
  },

  /* ---------------- World 8: Lifting ---------------- */

  liftpath: {
    title: "Follow the shadow",
    bullets: ["Only one dot exists upstairs.", "Build a triangle over the one below."],
    explain: "A <b>map</b> $p:X\\to S$ sends everything upstairs to something in the shadow $S$. This map is a <b>left fibration</b>: any arrow of $S$ can be lifted, starting from any dot that sits over its start. The lifted arrow ends at a <i>new</i> dot: you choose where a lift begins, never where it lands. Lift $\\bar f$, then $\\bar g$ from where you landed, then compose. That one rule is the whole definition, and it has surprising consequences.",
    hints: ["Lift arrow from $x$. Then lift again from the new dot.", "Lift arrow: $x$, over $\\bar f$. Lift arrow: the new dot. Compose the two lifts."],
    win: ["A path downstairs lifts to a path upstairs, from any start."],
    term: "Left fibration",
    math: {
      say: "$p:X\\to S$ is a left fibration if it has the right lifting property against $\\Lambda^n_i\\hookrightarrow\\Delta^n$ for $0\\le i<n$. The case $n=1$: every edge of $S$ lifts with a prescribed source.",
      proof: "Lift $\\Lambda^1_0\\hookrightarrow\\Delta^1$ twice, then the inner horn $\\Lambda^2_1$ over the 2-simplex $(\\bar f,\\bar g,\\bar x)$ of $S$."
    }
  },

  backfill: {
    title: "The missing first leg",
    bullets: ["$g$ and $k$ lie over $\\bar g$ and $\\bar x$.", "Find $f$ with $f\\cdot g\\simeq k$, or say it can't be done."],
    explain: "Downstairs the triangle is complete: $\\bar x$ is the composite of $\\bar f$ then $\\bar g$. Upstairs you have the last leg $g$ and the whole trip $k$, and want the first leg. A left fibration lifts arrows <i>forwards from their start</i>. Try it and watch where the lift lands. Whether this is possible depends on the kind of map, not on the picture: the same shape over a different kind of map can have the opposite answer.",
    hints: ["Lift $\\bar f$ from $x$ and look at where it ends.", "Press This can't be done. The lift lands on a new dot."],
    win: ["A left fibration lets you choose where a lift starts, never where it ends."],
    term: "No right lifting",
    math: {
      say: "A left fibration need not lift $\\Lambda^2_2\\hookrightarrow\\Delta^2$. Counter-model: the left fibration over $\\Delta^2$ classified by a functor $F$ with $F(\\bar b)=\\{y,y'\\}$ and $F(\\bar f)(x)=y'$ has no edge $x\\to y$.",
      proof: "Every move here is a left-anodyne extension, so it maps to the counter-model; there the only lift of $\\bar f$ from $x$ ends at $y'\\ne y$."
    }
  },

  prism: {
    title: "Close the square",
    bullets: ["Three sides of a square are upstairs; all of it is below.", "Finish the square over the shadow."],
    explain: "The shadow is a full commuting square: two triangles sharing a diagonal. Upstairs the bottom side is missing. One triangle is an inner horn, so it lifts over any of these maps. The other is missing its <i>second</i> arrow, with the first one known: a horn missing its first face. That is exactly what a left fibration adds. There is a tempting wrong move: lifting the bottom arrow on its own lands on a new dot, and the square never closes.",
    hints: ["Build the diagonal first. Then solve for the bottom side.", "Compose $f$, $v$. Solve $f\\cdot ? = h$: $u$, then the diagonal."],
    win: ["A left fibration fills horns that know their first arrow."],
    term: "Left horn $\\Lambda^2_0$",
    math: {
      say: "The inclusion $(\\Delta^1\\times\\{0\\})\\cup(\\partial\\Delta^1\\times\\Delta^1)\\hookrightarrow\\Delta^1\\times\\Delta^1$ is left anodyne: a pushout of $\\Lambda^2_1$ followed by a pushout of $\\Lambda^2_0$. So it lifts against any left fibration.",
      proof: "Lift $\\Lambda^2_1$ over $(\\bar f,\\bar v,\\bar x)$ for the diagonal, then $\\Lambda^2_0$ over $(\\bar u,\\bar w,\\bar x)$ for the missing side."
    }
  },

  inneronly: {
    title: "Invertible below",
    bullets: ["$\\bar f$ has an inverse downstairs. This map is only an inner fibration.", "Find $g$ with $f\\cdot g\\simeq 1_x$, or say it can't be done."],
    explain: "Downstairs $\\bar f$ is an isomorphism: $\\bar g$ undoes it on both sides. Does that make $f$ an isomorphism upstairs? Look at what kind of map this is. An inner fibration lifts inner horns only, and an inverse is the missing side of an <i>outer</i> horn. Compare this level with the next one: the board is identical and only the kind of map changes.",
    hints: ["An inverse is an outer horn. Check what this map lifts.", "Press This can't be done. Reason: only inner horns lift."],
    win: ["Lying over an isomorphism does not make an arrow invertible."],
    term: "Not conservative",
    math: {
      say: "An inner fibration need not be conservative. $\\Delta^1\\to N(J)$, $J$ the walking isomorphism, is an inner fibration (the nerve of a functor) sending the non-invertible edge to an isomorphism.",
      proof: "$X=\\Delta^1$ is a counter-model: all inner horns lift against $\\Delta^1\\to N(J)$, yet no edge $y\\to x$ exists."
    }
  },

  conservative: {
    title: "Invertible above",
    bullets: ["Same board, but now the map is a left fibration.", "Find an inverse of $f$ on both sides."],
    explain: "Over a left fibration the inverse can be built. Downstairs, $\\bar f\\cdot\\bar g\\simeq 1$ is a triangle, and upstairs you know its first arrow $f$ and its third arrow $1_x$: a horn missing its first face. Solving gives $g$ on one side. For the other side, look for a tetrahedron on the path $f, g, f$ whose missing face is again the first one. A map is <b>conservative</b> when an arrow over an isomorphism must itself be an isomorphism.",
    hints: ["Solve for $g$. Then a tetrahedron on the path $f,g,f$.", "Solve $f\\cdot ? = h$: $f$, $1_x$. Tetrahedron: path $f,g,f$; other faces are identities. Fill."],
    win: ["Left fibrations are conservative."],
    term: "Conservative",
    math: {
      say: "Left fibrations are conservative: if $p(f)$ is an isomorphism in $S$ then $f$ is an isomorphism in $X$. The inverse is the lift of $\\Lambda^2_0$, and it is two-sided by a lift of $\\Lambda^3_0$.",
      proof: "Lift $\\Lambda^2_0$ over $(\\bar f,\\bar g,1)$ for $g$; lift $\\Lambda^3_0$ on $(x,y,x,y)$ with faces $(f,g,1_x)$, $s_0f$, $s_1f$: the new face is $(g,f,1_y)$."
    }
  },

  twolifts: {
    title: "Two lifts, one destination",
    bullets: ["Two routes lift $\\bar x$ from $x$: via $y$, and directly.", "Show their endpoints $z$ and $z'$ are isomorphic."],
    explain: "Lifts land on fresh dots, so two ways of lifting the same thing end in different places. They should still be the same place <i>up to isomorphism</i>. Compose the long route, then compare it with the short one: both lie over $\\bar x$ and start at $x$, so a left fibration lets you solve for an arrow $m$ between their ends, lying over an identity. Then prove $m$ is invertible, the way you proved it in the last level. One arrow already drawn between the two ends is not the one you need.",
    hints: ["Solve for an arrow from $z$ to $z'$, then invert it.", "Compose $f,g$. Solve: $f\\cdot g$, $k'$. Solve: $m$, $1_z$. Tetrahedron: path $m,n,m$. Fill."],
    win: ["Any two lifts of the same arrow end at isomorphic dots.", "Transport along a left fibration is well defined."],
    term: "Uniqueness of lifts",
    math: {
      say: "For a left fibration $p$, lifts of an edge with a fixed source are unique up to isomorphism in the fibre: the fibres are Kan complexes, and $\\Lambda^2_0$, $\\Lambda^3_0$ lift over degenerate simplices.",
      proof: "Lift $\\Lambda^2_1$; lift $\\Lambda^2_0$ over $s_1(\\bar x)$ for $m$; lift $\\Lambda^2_0$ over $s_0s_0(\\bar c)$ for $n$; lift $\\Lambda^3_0$ on $(z,z',z,z')$."
    }
  },

  shadow: {
    title: "The shadow",
    bullets: ["The lower shape $S$ is the shadow of $X$.", "Compose $f$ and $g$."],
    explain: "A <b>map</b> $p:X\\to S$ sends each dot, arrow and triangle of $X$ to one of $S$. Think of $S$, below, as the shadow of $X$, above. The shadow never changes. Anything you build in $X$ must lie over something that already exists in $S$. Composing $f$ and $g$ upstairs works because $\\bar f$ and $\\bar g$ have a triangle below.",
    hints: ["Compose as before. The shadow decides.", "Compose: $f$, $g$."],
    win: ["Your new triangle lies over the triangle below."],
    term: "Map of simplicial sets",
    math: {
      say: "A map $p:X\\to S$ of simplicial sets sends $n$-simplices to $n$-simplices compatibly with faces. A 2-simplex of $X$ with edges $f,g$ must lie over a 2-simplex of $S$ with edges $p f,p g$.",
      proof: "Compose $f,g$ over the 2-simplex $(\\bar f,\\bar g,\\bar x)$."
    }
  },

  lift: {
    title: "Choose the lift",
    bullets: ["Two triangles lie below $\\bar f$ and $\\bar g$.", "Compose $f$ and $g$ over the second one."],
    explain: "The shadow has two composites of $\\bar f$ and $\\bar g$: a triangle with third side $\\bar x$, and another with $\\bar y$. Composing upstairs now offers a choice, and the goal says which triangle yours must lie over. Finding upstairs simplices that project to a given downstairs one is a <b>lifting problem</b>, and each solution is a <b>lift</b>.",
    hints: ["Compose offers options. Look at what lies below.", "Compose: $f$, $g$. Choose the arrow over $\\bar y$."],
    win: ["You chose the lift over the triangle you wanted."],
    term: "Lift",
    math: {
      say: "A lifting problem asks for a dotted arrow in a square: given $A\\to X$, $B\\to S$ and $A\\hookrightarrow B$, find $B\\to X$ making both triangles commute. Here $A=\\Lambda^2_1$, $B=\\Delta^2$, and $S$ offers two fillers.",
      proof: "Compose over the 2-simplex $\\bar y$ rather than $\\bar x$."
    }
  },

  nolift: {
    title: "No lift",
    bullets: ["$X$ has one composite of $f$ and $g$.", "Lift over $\\bar y$, or say it can't be done."],
    explain: "In this $X$ the composition table fixes the composite of $f$ and $g$, and it lies over $\\bar x$, not $\\bar y$. The goal wants a composite over $\\bar y$. Upstairs there is only one composite, and the shadow cannot change it. So a lifting problem can have no solution: the answer upstairs is already decided, and it lies over the wrong thing.",
    hints: ["Check which triangle the table's composite lies over.", "Press This can't be done. Pick the reason about the shadow."],
    win: ["Impossible: the only composite lies over the wrong triangle."],
    term: "No lift exists",
    math: {
      say: "A lift need not exist: if the only 2-simplex of $X$ on $(f,g)$ lies over $\\bar x$, then the horn $\\Lambda^2_1\\to X$ has no lift against $\\Delta^2\\to S$ choosing the 2-simplex $\\bar y$.",
      proof: "The unique filler of $(f,g)$ in $X$ lies over $\\bar x\\ne\\bar y$."
    }
  },

  liftfill: {
    title: "Lift a tetrahedron",
    bullets: ["Below, a solid tetrahedron. Above, only some of its faces.", "Fill upstairs, lying over the tetrahedron below."],
    explain: "A <b>lifting problem</b>: the shadow below already has its tetrahedron, and you must build one upstairs whose shadow is exactly that. Upstairs you are missing a face you can compose, and the face you are asked for. Every new piece upstairs must lie over a piece below; the game checks it. A map with this property for inner horns is called an <b>inner fibration</b>.",
    hints: ["Upstairs you can build one face by composing.", "Compose $g,h$. Tetrahedron: path $f,g,h$. Fill."],
    win: ["The tetrahedron below lifted to one above."],
    term: "Inner fibration",
    math: {
      say: "A map $p: X\\to S$ is an inner fibration if every square from $\\Lambda^n_k\\hookrightarrow\\Delta^n$ ($0<k<n$) to $p$ has a diagonal lift. Here: $\\Lambda^3_2\\to X$ over a 3-simplex of $S$ extends to $\\Delta^3\\to X$ over it.",
      proof: "Lift $\\Lambda^2_1$ for $g{\\cdot}h$ over its shadow, then lift $\\Lambda^3_2$ on $(a,b,c,d)$ over the 3-simplex of $S$."
    }
  },

  liftiso: {
    title: "Lift with an isomorphism",
    bullets: ["$f$ is an isomorphism ($\\cong$) lying over $\\bar f$.", "Fill the outer face upstairs, over the triangle below."],
    explain: "This is <b>Joyal's lifting theorem</b> in miniature. An outer horn usually can't be lifted, because nothing tells you how to go back along its first arrow. When that first arrow is an <b>isomorphism</b>, it can be undone, and the outer filling becomes legal. You need three faces upstairs first: two composites, and one arrow solved for using $f$. Then the outer tetrahedron fills, lying over the one below. One arrow here is a decoy.",
    hints: ["Build three faces, then fill the outer face through $f$.", "Compose $f,g$; then $f\\cdot g,h$. Solve $f$, $(f\\cdot g)\\cdot h$. Tetrahedron: path $f,g,h$."],
    win: ["An outer horn lifts when its first edge is an isomorphism."],
    term: "Joyal lifting",
    math: {
      say: "Joyal: if $p: X\\to S$ is an inner fibration and $\\Lambda^n_0\\to X$ sends the edge $0\\to1$ to an isomorphism, then every lifting problem from $\\Lambda^n_0\\hookrightarrow\\Delta^n$ to $p$ has a solution ($n\\ge2$).",
      proof: "Lift $\\Lambda^2_1$ twice, then $\\Lambda^2_0$ (legal: $f$ iso); then lift $\\Lambda^3_0$ on $(a,b,c,d)$ over $S$, legal since $f$ is an isomorphism."
    }
  },

  /* ---------------- World 9: Isomorphisms ---------------- */

  oneway: {
    title: "One way only",
    bullets: ["$f$ goes from $a$ to $b$.", "Undo it with a new arrow, or say it can't be done."],
    explain: "Every move here fills an inner horn: a gap in the middle of a trip. Starting from one arrow $a\\to b$, such moves can only produce arrows that follow existing ones forwards: $a\\to a$, $a\\to b$ or $b\\to b$. An arrow from $b$ back to $a$ never appears. Not every arrow has an inverse, and this is the smallest example.",
    hints: ["Which way does every arrow you can make point?", "This can't be done: One arrow. Send $a$ to $0$, $b$ to $1$."],
    win: ["Impossible: inner moves never point an arrow backwards."],
    term: "Not every arrow inverts",
    math: {
      say: "Not every edge of a quasi-category is an equivalence. Starting from a single edge $f:a\\to b$, inner horn fillers only produce edges $a\\to a$, $a\\to b$, $b\\to b$; none is a left inverse $b\\to a$.",
      proof: "Inner fillers never create a $b\\to a$ edge."
    }
  },

  nocancel: {
    title: "No cancelling",
    bullets: ["$f\\cdot g\\simeq x$ and $k\\cdot g\\simeq x$ are given.", "Show $f\\simeq k$, or say it can't be done."],
    explain: "This is Cancel again, but with the Kan property switched off and no arrow reversible. Cancelling $g$ needed the outer face that carries a padlock. Without an inverse for $g$, nothing in the rules lets you cancel it: $f$ and $k$ could be genuinely different arrows that $g$ simply cannot tell apart.",
    hints: ["Could two different arrows give the same composite?", "This can't be done: Fork. Send $f$ to $p$, $k$ to $q$."],
    win: ["Impossible: without an inverse you can't cancel $g$."],
    term: "No cancellation",
    math: {
      say: "Cancellation ($g\\circ f\\simeq g\\circ k\\Rightarrow f\\simeq k$) needs the outer horn $\\Lambda^3_3$, which fills only if $X$ is Kan or $g$ is an equivalence. Neither holds here, and inner horns are not enough.",
      proof: "The only open face is $d_3$, an outer horn; no tool fills it here."
    }
  },

  detour: {
    title: "Via the inverse",
    bullets: ["$f$ is an isomorphism ($\\cong$) undone by $g$.", "Find a triangle for $f$ and $h$."],
    explain: "You can go from $a$ to $c$ along $h$. Since $g$ undoes $f$, $h$ should also factor as $f$ followed by some arrow $b\\to c$, and the natural candidate is $g\\cdot h$. A tetrahedron with path $f,g,h$ confirms it using only inner faces, so the argument works in every quasi-category, with no Kan assumption.",
    hints: ["First compose $g$ and $h$.", "Compose: $g$, $h$. Tetrahedron: path $f,g,h$, with $f\\cdot g\\simeq 1_a$. Fill."],
    win: ["$h$ factors through $f$ via $g\\cdot h$."],
    term: "Factoring through an inverse",
    math: {
      say: "Given $f$ and a 2-simplex $(f,g,1_a)$, any $h$ out of $a$ factors through $f$: with $w$ a composite of $(g,h)$ there is a 2-simplex $(f,w,h)$. The proof needs only an inner horn $\\Lambda^3_2$.",
      proof: "Fill $\\Lambda^2_1$ on $(g,h)$ giving $w$; fill $\\Lambda^3_2$ on $(a,b,a,c)$ with $(f,g,1_a)$, $(g,h,w)$, $s_0(h)$."
    }
  },

  mono: {
    title: "Cancel an isomorphism",
    bullets: ["$g$ is an isomorphism ($\\cong$).", "$f\\cdot g$ and $k\\cdot g$ are each homotopic to something. Show $f\\simeq k$."],
    explain: "Earlier you saw that cancelling needs undoing. Here only $g$ can be undone: it is an <b>isomorphism</b>. That is enough to fill the one outer face whose last edge is $g$. But the two triangles don't end at the same arrow yet. Substitute along the homotopies to make them meet, then cancel $g$. An isomorphism is an arrow with an inverse up to homotopy: an <b>equivalence</b>, not an equality.",
    hints: ["Make both triangles end at $m$ first.", "Swap in $x\\simeq m$. Swap in $x'\\simeq m$. Tetrahedron: path $f,1_b,g$. Fill."],
    win: ["Isomorphisms cancel, even where other arrows don't."],
    term: "Isomorphisms cancel",
    math: {
      say: "In a quasi-category, if $g$ is an isomorphism then $\\Lambda^3_3\\to X$ with last edge $g$ extends (dual Joyal). So $f\\circ g\\simeq k\\circ g$ implies $f\\simeq k$.",
      proof: "Transport $(f,g,x)$ and $(k,g,x')$ to end at $m$; fill $\\Lambda^3_3$ on $(a,b,b,c)$, legal because $g$ is an isomorphism."
    }
  },

  backpath: {
    title: "A one-sided inverse",
    bullets: ["$f\\cdot g\\simeq 1_a$ is given.", "Show $g\\cdot f\\simeq 1_b$, or say it can't be done."],
    explain: "Here $g$ undoes $f$ on one side only: $f$ then $g$ is the identity at $a$. Does it also undo $f$ the other way? With only this much structure, no. This is the smallest example of a one-sided inverse, also called a retraction, which need not be an isomorphism. The next level has one extra piece of data, and that is enough.",
    hints: ["Does undoing on one side force undoing on the other?", "This can't be done: One-sided inverse. Send $f$ to $i$, $g$ to $r$."],
    win: ["Impossible: a one-sided inverse isn't an isomorphism."],
    term: "Retraction",
    math: {
      say: "The simplicial set with $f:a\\to b$, $g:b\\to a$ and a 2-simplex $(f,g,1_a)$ has $g$ as a left inverse of $f$ but no 2-simplex $(g,f,1_b)$; a one-sided inverse need not be an equivalence.",
      proof: "Inner horns here only compose; none produces a 2-simplex with boundary $(g,f,1_b)$."
    }
  },

  twosided: {
    title: "Both sides",
    bullets: ["$g$ undoes $f$ on one side, $k$ on the other.", "Show $g''$ undoes $f$ on the other side too."],
    explain: "A <b>left inverse</b> $k$ and a <b>right inverse</b> $g$ of the same arrow must be homotopic: compare them through a tetrahedron. Once you know $k\\simeq g$, and $g$ is homotopic to its copies $g'$ and $g''$, you can transport the fact about $k$. So a two-sided inverse exists as soon as both one-sided ones do. With only one side, as you saw, it fails.",
    hints: ["Show $k\\simeq g$ first, then chain to $g''$.", "Tetrahedron: path $k,f,g$. Link with $g\\simeq g'$, then $g'\\simeq g''$. Swap in."],
    win: ["Left and right inverses agree, up to homotopy."],
    term: "Two-sided inverse",
    math: {
      say: "If $f\\circ g\\simeq 1_a$ and $k\\circ f\\simeq 1_b$, then $k\\simeq g$, so $g$ is a two-sided homotopy inverse and $f$ is an isomorphism.",
      proof: "Fill $\\Lambda^3_2$ on $(b,a,b,a)$ with $(k,f,1_b)$, $(f,g,1_a)$, $s_0g$; link to $g''$; transport $(k,f,1_b)$."
    }
  },

  joyal: {
    title: "Joyal's theorem",
    bullets: ["$f$ is an isomorphism ($\\cong$); $h$ is not.", "Find an arrow that undoes $f$ on both sides."],
    explain: "Solving $f\\cdot ? = 1_a$ is an <b>outer</b> horn: it normally can't be filled. <b>Joyal's theorem</b> says it can whenever the edge you go back along is an isomorphism. So both Solve tools work on $f$, but not on $h$. That gives a left and a right inverse, and you already know how to show they agree. This is the whole theorem in one picture: in an ∞-category, outer horns fill exactly when their first edge is an isomorphism.",
    hints: ["Solve on both sides of $f$, then compare the two answers.", "Solve $f$, $1_a$. Solve $f$, $1_b$. Tetrahedron: both inverse triangles. Swap in."],
    win: ["Outer horns fill when their first edge is an isomorphism.", "That is Joyal's theorem."],
    term: "Joyal's theorem",
    math: {
      say: "Joyal: in a quasi-category $X$, a morphism $f$ is an isomorphism iff every $\\Lambda^n_0\\to X$ ($n\\ge2$) with first edge $f$ extends to $\\Delta^n$. Consequently $X$ is a Kan complex iff its homotopy category is a groupoid.",
      proof: "Fill $\\Lambda^2_0$ and $\\Lambda^2_2$ along $f$ for inverses $f^{-1}$, $f^{-1\\prime}$; $\\Lambda^3_2$ gives $f^{-1\\prime}\\simeq f^{-1}$; transport."
    }
  },

  opensquare: {
    title: "Three sides",
    bullets: ["Three sides of a square. Nothing here can be undone.", "Close the square, or prove it can't be done."],
    explain: "This looks like the boss that follows, where the square does close. The difference is what the world allows. Closing the square needs an arrow from $c$ to $d$, and that arrow is the <i>second</i> side of a triangle whose first side you know: an outer horn. In a general ∞-category outer horns need not fill. To be sure, find a small world containing these three sides in which no arrow from $c$ to $d$ exists at all.",
    hints: ["Which arrow would you need, and what could ever produce it?", "This can't be done: Open square. Place the dots in order."],
    win: ["An open square need not close.", "Closing it takes an outer horn."],
    term: "Outer horn $\\Lambda^2_0$",
    math: {
      say: "The inclusion $(\\Delta^1\\times\\{0\\})\\cup(\\partial\\Delta^1\\times\\Delta^1)\\hookrightarrow\\Delta^1\\times\\Delta^1$ is left anodyne but not inner anodyne: a quasi-category need not extend it.",
      proof: "Counter-model: the nerve of the poset $0<1<3$, $0<2$. It contains the three sides and has no edge $2\\to 3$."
    }
  },

  idem: {
    title: "Twice is once",
    bullets: ["$f\\cdot g\\simeq 1_a$, as in the last level.", "Show $e=g\\cdot f$ satisfies $e\\cdot e\\simeq e$, or prove it can't be done."],
    explain: "You just showed that $g\\cdot f$ need not be an identity. It is still special: doing it twice is the same as doing it once. In symbols, $e\\cdot e=g\\cdot f\\cdot g\\cdot f$, and the middle $f\\cdot g$ cancels. Here that cancellation is two tetrahedra. An arrow with $e\\cdot e\\simeq e$ is called <b>idempotent</b>, and every one-sided inverse produces one. Whether a goal is possible depends on what exactly it asks.",
    hints: ["Cancel the middle: first show $e\\cdot g\\simeq g$.", "Compose $g,f$. Tetrahedron: path $g,f,g$. Then path $e,g,f$, using $g\\cdot f\\simeq e$ twice."],
    win: ["A one-sided inverse gives an idempotent, not an identity."],
    term: "Idempotent",
    math: {
      say: "If $(f,g,1_a)$ is a 2-simplex and $e$ is a composite of $(g,f)$, then there is a 2-simplex $(e,e,e)$: $e$ is idempotent, by two inner 3-horns.",
      proof: "Fill $\\Lambda^3_1$ on $(b,a,b,a)$ with $s_1(g)$ for $(e,g,g)$; fill $\\Lambda^3_2$ on $(b,b,a,b)$ with $(g,f,e)$ twice for $(e,e,e)$."
    }
  },

  /* ---------------- World 10: Squares ---------------- */

  natsq: {
    title: "A square that commutes",
    bullets: ["A square commutes when both ways round share one diagonal.", "Make this square commute."],
    explain: "Go from $a$ to $b'$ two ways: along the top then down, or down then along the bottom. In ordinary algebra the square <b>commutes</b> if the two results are equal. Here each way round is a triangle with its own diagonal, and a commuting square is <i>two triangles sharing one diagonal</i>. The diagonals $d$ and $d'$ are only homotopic, so one triangle must be moved onto the other's diagonal. A commuting square is how one arrow maps to another: $f$ to $f'$.",
    hints: ["The two diagonals are homotopic. Use that.", "Swap in: $d\\simeq d'$, then $f\\cdot\\beta\\simeq d$."],
    win: ["Two triangles on one diagonal: a commuting square.", "It is an arrow from $f$ to $f'$."],
    term: "Commuting square",
    math: {
      say: "A square in $C$ is a map $\\Delta^1\\times\\Delta^1\\to C$: two 2-simplices $(f,\\beta,d)$ and $(\\alpha,f',d)$ sharing the diagonal $d$. It is an edge $f\\to f'$ of $\\mathrm{Fun}(\\Delta^1,C)$.",
      proof: "Transport $(f,\\beta,d)$ along the homotopy $d\\simeq d'$ to get $(f,\\beta,d')$, which shares its diagonal with $(\\alpha,f',d')$."
    }
  },

  moveacross: {
    title: "Move it across",
    bullets: ["$\\alpha\\cdot p\\simeq q$, and $\\bar\\alpha$ undoes $\\alpha$.", "Show $\\bar\\alpha\\cdot q\\simeq p$."],
    explain: "In school algebra, $\\alpha p=q$ gives $p=\\alpha^{-1}q$: you move $\\alpha$ to the other side by dividing. The same works here, but it is a proof, not a rule. Follow the path $\\bar\\alpha$, then $\\alpha$, then $p$. Its first two steps cancel to an identity, and doing nothing before $p$ is a free fact. That leaves one face of the tetrahedron open: exactly the one you want. Afterwards you own <b>Divide</b>, which does this on either side in one click.",
    hints: ["Use a path that starts by undoing $\\alpha$.", "Tetrahedron: path $\\bar\\alpha,\\alpha,p$. Faces $\\bar\\alpha\\cdot\\alpha\\simeq 1$, $\\alpha\\cdot p\\simeq q$. Fill."],
    win: ["An isomorphism can be moved across, like dividing.", "New tool: Divide."],
    term: "Dividing by an isomorphism",
    math: {
      say: "If $(\\bar\\alpha,\\alpha,1_{a'})$ is a 2-simplex, so $\\bar\\alpha$ undoes $\\alpha$, and $(\\alpha,p,q)$ is a 2-simplex, there is a 2-simplex $(\\bar\\alpha,q,p)$: left multiplication by an isomorphism is invertible up to homotopy.",
      proof: "Fill $\\Lambda^3_2$ on $(a',a,a',c)$ with faces $(\\bar\\alpha,\\alpha,1_{a'})$, $(\\alpha,p,q)$ and $s_0(p)$; the new face is $(\\bar\\alpha,q,p)$."
    }
  },

  acrossagain: {
    title: "The other side",
    bullets: ["$p\\cdot\\beta\\simeq q$, and $q'\\simeq q$.", "Show $q'\\cdot\\bar\\beta\\simeq p$."],
    explain: "Divide also works from the right: if $p\\cdot\\beta\\simeq q$ and $\\bar\\beta$ undoes $\\beta$, then $q\\cdot\\bar\\beta\\simeq p$. Here the fact you want is about $q'$, not $q$, so one more step is needed to carry the result along the homotopy. There is more than one route: reverse the homotopy and substitute, or use a tetrahedron that ends in an identity. Tools you proved earlier combine freely with new ones.",
    hints: ["Divide first. Then carry the result from $q$ to $q'$.", "Divide: $\\beta\\cdot\\bar\\beta\\simeq 1$, $p\\cdot\\beta\\simeq q$. Tetrahedron: path $q',1_{b'},\\bar\\beta$. Fill."],
    win: ["Dividing works on the right as well."],
    term: "Right division",
    math: {
      say: "Given $(\\beta,\\bar\\beta,1_b)$ and a 2-simplex $(p,\\beta,q)$ there is a 2-simplex $(q,\\bar\\beta,p)$, and 2-simplices transport along homotopies of any edge.",
      proof: "Fill $\\Lambda^3_1$ on $(a,b,b',b)$ with $(p,\\beta,q)$, $(\\beta,\\bar\\beta,1_b)$, $s_1(p)$; then $\\Lambda^3_2$ on $(a,b',b',b)$ transports along $q'\\simeq q$."
    }
  },

  sqpaste: {
    title: "Paste two squares",
    bullets: ["Two commuting squares, one on top of the other.", "Show the tall outer square commutes."],
    explain: "Squares are arrows between arrows, so they should compose: a square from $f$ to $f'$ stacked on one from $f'$ to $f''$ gives one from $f$ to $f''$. Its sides are the composites $A$ and $B$. Pick one way round the tall square and build its diagonal. Then walk that diagonal across the picture, one tetrahedron at a time: each tetrahedron trades a triangle you know for its neighbour. Three trades reach the other side.",
    hints: ["Make the diagonal $f\\cdot B$. Then move it left, one tetrahedron at a time.", "Compose $f$, $B$. Tetrahedron paths: $f,\\beta,\\beta'$; then $\\alpha,f',\\beta'$; then $\\alpha,\\alpha',f''$."],
    win: ["Commuting squares paste: arrows between arrows compose."],
    term: "Pasting squares",
    math: {
      say: "$\\mathrm{Fun}(\\Delta^1,C)$ is a quasi-category when $C$ is: two composable squares have a composite. The prism $\\Delta^1\\times\\Delta^2$ is a union of three 3-simplices, each filled by an inner horn.",
      proof: "With $D=B\\circ f$: fill $\\Lambda^3_1$ on $(a,b,b',b'')$, $\\Lambda^3_2$ on $(a,a',b',b'')$, $\\Lambda^3_1$ on $(a,a',a'',b'')$; the last face is $(A,f'',D)$."
    }
  },

  isocomp: {
    title: "Isomorphisms compose",
    bullets: ["$f$ and $g$ are isomorphisms; $x$ is their composite.", "Find an arrow that undoes $x$ on both sides."],
    explain: "An <b>isomorphism</b> is an arrow with an inverse up to homotopy, on both sides. If $f$ and $g$ are isomorphisms, their composite $x$ should be one too, and by socks-and-shoes its inverse is $\\bar g$ then $\\bar f$. Build that candidate, then prove both halves. Each half is the same idea: divide to cancel one arrow against its inverse, then a tetrahedron cancels the other. Not every arrow pointing backwards is the inverse.",
    hints: ["The inverse is $\\bar g\\cdot\\bar f$. For each side: Divide once, then one tetrahedron.", "Compose $\\bar g,\\bar f$. Divide $f\\cdot g\\simeq x$ by $g$; path $x,\\bar g,\\bar f$. Divide by $\\bar f$; path $w,f,g$."],
    win: ["A composite of isomorphisms is an isomorphism."],
    term: "Isomorphisms compose",
    math: {
      say: "If the spine of a simplex lands in the equivalences, so does every edge: for isomorphisms $f,g$ with inverses $\\bar f,\\bar g$, any composite $x$ of $(f,g)$ has two-sided inverse a composite $w$ of $(\\bar g,\\bar f)$.",
      proof: "From $(f,g,x)$ get $(x,\\bar g,f)$; fill $\\Lambda^3_2$ on $(a,c,b,a)$ for $(x,w,1_a)$. From $(\\bar g,\\bar f,w)$ get $(w,f,\\bar g)$; fill $\\Lambda^3_2$ on $(c,a,b,c)$."
    }
  },

  natiso: {
    title: "Invertible, piece by piece",
    bullets: ["A commuting square from $f$ to $f'$ whose sides $\\alpha$, $\\beta$ are isomorphisms.", "Build the square going back, with sides $\\bar\\alpha$ and $\\bar\\beta$."],
    explain: "A <b>natural transformation</b> is a family of arrows making squares commute; here it is one square with sides $\\alpha$ and $\\beta$. The theorem: if every side is an isomorphism, the whole transformation is invertible, because the inverses $\\bar\\alpha,\\bar\\beta$ fit into a commuting square going back. Pick the diagonal of the return square, then show both ways round reach it. You have every tool you need: Divide moves $\\alpha$ and $\\beta$ across, and one tetrahedron joins the two halves.",
    hints: ["Diagonal: $\\bar\\alpha\\cdot f$. Divide twice, with one tetrahedron in between.", "Compose $\\bar\\alpha,f$. Divide $\\alpha\\cdot f'\\simeq d$ by $\\alpha$. Tetrahedron: path $\\bar\\alpha,f,\\beta$. Divide the result by $\\beta$."],
    win: ["Invertible sides give an invertible square.", "A natural transformation is an isomorphism when its components are."],
    term: "Natural isomorphism",
    math: {
      say: "Theorem: a natural transformation is an equivalence in $\\mathrm{Fun}(K,C)$ iff each component is an equivalence in $C$, i.e. $\\mathrm{Fun}(K,C)\\to\\mathrm{Fun}(\\mathrm{sk}_0K,C)$ is conservative. This level is the case $K=\\Delta^1$.",
      proof: "With $e=f\\circ\\bar\\alpha$: $(\\alpha,f',d)$ gives $(\\bar\\alpha,d,f')$; fill $\\Lambda^3_1$ on $(a',a,b,b')$ for $(e,\\beta,f')$; dividing by $\\beta$ gives $(f',\\bar\\beta,e)$."
    }
  },

  /* ---------------- World 11 ---------------- */

  sandbox: {
    title: "Sandbox",
    bullets: ["Free play. Every tool is unlocked.", "No goal. Undo is always there."],
    explain: "Everything you have learnt is available: Compose, Solve, Tetrahedron, the theorem tools, Draw arrow, Glue triangle and Peel, with the Kan property on. Try making an inverse, relating two composites, or building a sphere. There is no goal and no wrong move, and Undo is always available if a construction goes somewhere you did not intend.",
    hints: ["Compose two arrows.", "Compose two arrows. Tetrahedron on a path of three."],
    win: [],
    term: "Simplicial set",
    math: {
      say: "A simplicial set is a functor $\\Delta^{op}\\to\\mathrm{Set}$. Here you build finite ones by hand: add vertices, edges and 2-cells, fill horns, and take skeleta.",
      proof: ""
    }
  }
};

HC.Reasons = {
  freshend:   { label: "A left lift picks its start, never its end.",
                whyNot: "No lift is involved in that goal: nothing here needs to land on a given dot." },
  licence:    { label: "This map lifts inner horns only; an inverse is an outer horn.",
                whyNot: "This map does lift the horn you need." },
  hole:       { label: "Horn filling never fills a hole.",
                whyNot: "Nothing is hollow here: a horn really is missing one side." },
  backwards:  { label: "Inner moves never make an arrow point backwards.",
                whyNot: "Direction is not the problem here." },
  unrelated:  { label: "Nothing links arrows that share no triangle.",
                whyNot: "These arrows already share a triangle." },
  nocancel:   { label: "You can't cancel an arrow that has no inverse.",
                whyNot: "No cancelling is needed here." },
  onesided:   { label: "A one-sided inverse is not an isomorphism.",
                whyNot: "Both sides are already covered here." },
  shadow:     { label: "The shadow below fixes the answer, and it is wrong.",
                whyNot: "The shadow allows this, so a lift exists." }
};

/* Notes: optional theory pages. Blocks: {p}, {diagram}, {demo}.
   diagram = {dots:[{id,label,x,y}], arrows:[{from,to,label,dashed}], fills:[[a,b,c]], ghost:[[a,b,c]]}, coordinates 0..100 by 0..60. */
HC.Notes = [

  { id: "arrows", before: "compose", title: "Arrows and composition", body: [
    { p: "An <b>arrow</b> $f:a\\to b$ goes from a dot $a$ to a dot $b$. Two arrows $f:a\\to b$ and $g:b\\to c$ can be followed one after the other." },
    { diagram: { dots: [{id:"a",label:"a",x:15,y:40},{id:"b",label:"b",x:50,y:15},{id:"c",label:"c",x:85,y:40}],
                 arrows: [{from:"a",to:"b",label:"f"},{from:"b",to:"c",label:"g"},{from:"a",to:"c",label:"?",dashed:true}] } },
    { p: "A <b>composite</b> is one arrow $a\\to c$ that stands for the whole trip. Mathematicians write it $g\\circ f$, reading right to left like function application: first $f$, then $g$. This game writes it $f\\cdot g$, in the order you walk. Same arrow, two spellings." },
    { p: "Every dot $a$ also has an <b>identity</b> arrow $1_a$, the do-nothing trip. In an ordinary category composites are unique, and following $1_a$ changes nothing." },
    { p: "Here is the twist. In many natural settings, such as paths in a space, composites are only defined up to a deformation. The rest of the game builds a theory that allows this, by replacing the question 'what is the composite?' with 'what proves that this arrow is a composite?'. The answer is a triangle. Keep this in mind: a triangle is the unit of evidence in everything that follows." }
  ]},

  { id: "triangle", before: "twoways", title: "What a filled triangle means", body: [
    { p: "A filled triangle with sides $f$, $g$ and $h$ is a <b>proof</b>. It says: $h$ is a composite of $f$ then $g$. The game writes this $f\\cdot g\\simeq h$." },
    { diagram: { dots: [{id:"a",label:"a",x:15,y:42},{id:"b",label:"b",x:50,y:12},{id:"c",label:"c",x:85,y:42}],
                 arrows: [{from:"a",to:"b",label:"f"},{from:"b",to:"c",label:"g"},{from:"a",to:"c",label:"h"}], fills: [["a","b","c"]] } },
    { p: "Notice what it does not say. It does not say $h$ is <i>the</i> composite. Another triangle on the same $f$ and $g$ might end in a different arrow $h'$. Both are composites, and neither is privileged." },
    { p: "So composition stops being an operation, a function that returns one answer, and becomes a relation: 'is a composite of'. Each triangle witnesses one instance of it. That sounds loose, but it is exactly right for paths in a space, where two paths can be followed one after the other in many equivalent ways." },
    { p: "The looseness costs nothing, because any two witnesses turn out to be homotopic. You will prove that yourself soon. Until then, read every triangle as 'this arrow is a composite', never as 'this arrow equals the composite'." }
  ]},

  { id: "simplices", before: "tetra", title: "Simplices", body: [
    { p: "The <b>$n$-simplex</b> $\\Delta^n$ is the shape with $n+1$ corners $0<1<\\dots<n$, one arrow $i\\to j$ for each $i<j$, and everything filled in. So $\\Delta^0$ is a dot, $\\Delta^1$ an arrow, $\\Delta^2$ a filled triangle, $\\Delta^3$ a solid tetrahedron." },
    { demo: "tetra-3d" },
    { p: "Its <b>faces</b> come from deleting one corner. The face $d_i$ is the one opposite corner $i$. A triangle has three edges, and a tetrahedron has four triangular faces." },
    { demo: "order-maps" },
    { p: "Maps that keep the order, such as $[1]\\to[2]$ where $[n]=\\{0<\\dots<n\\}$, send an arrow to an arrow. Send both ends of an arrow to the same corner and it collapses to a dot. A simplex that is collapsed like this is <b>degenerate</b>: identities are simplices too, and so are the flat triangles built from them." },
    { demo: "split-vertex" },
    { p: "A <b>simplicial set</b> is a collection of such shapes, one family for each dimension, glued by face maps and collapse maps. Every board in this game is one. Dots, arrows, triangles and solids are its pieces; identity arrows and flat triangles are its degenerate pieces." }
  ]},

  { id: "horns", before: "assoc", title: "Horns and the notation $\\Lambda^n_k$", body: [
    { p: "Take the simplex $\\Delta^n$ and remove its inside and one face. What remains is a <b>horn</b> $\\Lambda^n_k$. Here $n$ is the dimension and $k$ names the missing face: the one opposite corner $k$." },
    { diagram: { dots: [{id:"a",label:"0",x:12,y:42},{id:"b",label:"1",x:50,y:12},{id:"c",label:"2",x:88,y:42}],
                 arrows: [{from:"a",to:"b",label:""},{from:"b",to:"c",label:""},{from:"a",to:"c",label:"missing",dashed:true}] } },
    { p: "That picture is $\\Lambda^2_1$: two arrows end to end, with the long side missing. $\\Lambda^2_0$ is two arrows leaving the same dot, missing the side between their ends. $\\Lambda^2_2$ is two arrows arriving at the same dot." },
    { p: "A horn is <b>inner</b> if $0<k<n$ and <b>outer</b> if $k=0$ or $k=n$. To <b>fill</b> a horn in a space $X$ means: given the horn's faces in $X$, find an $n$-simplex of $X$ having them as faces. Compose and Solve do exactly this." },
    { demo: "horn-fill" },
    { p: "Fillers need not exist. In a space with two arrows $f,g$ end to end and no triangles at all, $\\Lambda^2_1$ has no filler. In the space consisting of a single arrow $a\\to b$, the outer horn $\\Lambda^2_0$ on $f$ and $1_a$ would need an arrow $b\\to a$, and there is none. Much of the game is deciding which horns fill in which spaces." }
  ]},

  { id: "equivalence", before: "unique", title: "Equal, homotopic, isomorphic", body: [
    { p: "Two things can be <b>equal</b>, literally the same, or merely <b>equivalent</b>, interchangeable for every purpose that matters. Two routes from home to work are different routes but equivalent for arriving at work." },
    { p: "In topology, two paths from $p$ to $q$ are <b>homotopic</b> if one can be deformed continuously into the other. In this game, parallel arrows $f,g:a\\to b$ are homotopic, written $f\\simeq g$, when a triangle with sides $f$, $1_b$, $g$ exists." },
    { diagram: { dots: [{id:"a",label:"a",x:15,y:42},{id:"b",label:"b",x:50,y:12},{id:"c",label:"b",x:85,y:42}],
                 arrows: [{from:"a",to:"b",label:"f"},{from:"b",to:"c",label:"1_b"},{from:"a",to:"c",label:"g"}], fills: [["a","b","c"]] } },
    { p: "Why not just say equal? Because in a space there may be many different witnesses that two arrows agree, and the choice of witness can matter later. Equivalence keeps the witness; equality would throw it away." },
    { p: "An arrow $f:a\\to b$ is an <b>isomorphism</b>, or <b>equivalence</b>, if arrows go back with $f\\cdot g\\simeq 1_a$ and $k\\cdot f\\simeq 1_b$. Dots joined by an isomorphism are 'the same' in the sense of equivalence. That is weaker than equal but stronger than merely similar: it comes with an explicit invertible comparison." },
    { demo: "split-vertex" }
  ]},

  { id: "quasicat", before: "symmetric", title: "Quasi-categories", body: [
    { p: "A <b>quasi-category</b> is a simplicial set in which every inner horn $\\Lambda^n_k\\to X$ with $0<k<n$ has a filler. In words: any path of arrows can be composed, consistently in higher dimensions, though not uniquely." },
    { p: "<b>Examples.</b> The nerve of any ordinary category, where fillers are even unique. Any Kan complex, where all horns fill. Everything you have built so far lives in a quasi-category." },
    { p: "<b>Non-examples.</b> A simplicial set with two arrows end to end and no triangle: $\\Lambda^2_1$ has no filler. A hollow triangle $\\partial\\Delta^2$: its horn on $f,g$ has no filler, since no triangle exists. Both are simplicial sets but not quasi-categories." },
    { diagram: { dots: [{id:"a",label:"a",x:12,y:42},{id:"b",label:"b",x:30,y:15},{id:"c",label:"c",x:48,y:42},{id:"d",label:"a",x:60,y:42},{id:"e",label:"b",x:78,y:15},{id:"f",label:"c",x:96,y:42}],
                 arrows: [{from:"a",to:"b",label:"f"},{from:"b",to:"c",label:"g"},{from:"d",to:"e",label:"f"},{from:"e",to:"f",label:"g"},{from:"d",to:"f",label:"h"}] } },
    { p: "Why accept non-unique fillers? Because composing paths in a space is only defined up to deformation. Being a quasi-category is a <i>property</i>, not extra structure: composites exist and are unique up to homotopy. Everything you prove in the Homotopy world holds in every quasi-category. Later worlds ask what more you get by asking for more fillers, such as being Kan or being a nerve." }
  ]},

  { id: "kan", before: "undo", title: "Kan complexes", body: [
    { p: "A simplicial set is a <b>Kan complex</b> if every horn fills, inner and outer. A Kan complex is an <b>$\\infty$-groupoid</b>: a space, described combinatorially by points, paths, homotopies between paths, and so on." },
    { p: "For any topological space, the simplicial set of its singular simplices is a Kan complex. Every path can be reversed, because you can walk it backwards; that is what the outer horns encode." },
    { diagram: { dots: [{id:"a",label:"a",x:20,y:32},{id:"b",label:"b",x:50,y:10},{id:"c",label:"a",x:80,y:32}],
                 arrows: [{from:"a",to:"b",label:"f"},{from:"a",to:"c",label:"1_a"},{from:"b",to:"c",label:"?",dashed:true}] } },
    { p: "In a Kan complex the outer horn $\\Lambda^2_0$ on $f$ and $1_a$ fills. Its third side is a left inverse $f^{-1}$. Hence every arrow is an isomorphism." },
    { p: "Not every quasi-category is Kan. The shape $a\\to b$ with a single arrow, the nerve of the two-element order, is a quasi-category, since every inner horn fills there. But the outer horn on $f$ and $1_a$ asks for an arrow $b\\to a$, and none exists. It is not Kan." },
    { p: "So: Kan complexes are the quasi-categories in which every arrow is an isomorphism. Joyal's theorem makes this precise, near the end of the game." }
  ]},

  { id: "nerve", before: "nerve", title: "The nerve of a category", body: [
    { p: "Take an ordinary category: objects, arrows, composition, identities, associativity. Its <b>nerve</b> $N(\\mathcal C)$ is a simplicial set. The dots are objects, the arrows are arrows, and an $n$-simplex is a chain of $n$ composable arrows." },
    { diagram: { dots: [{id:"a",label:"a",x:8,y:38},{id:"b",label:"b",x:34,y:20},{id:"c",label:"c",x:62,y:38},{id:"d",label:"d",x:90,y:20}],
                 arrows: [{from:"a",to:"b",label:"f"},{from:"b",to:"c",label:"g"},{from:"c",to:"d",label:"h"}] } },
    { p: "Each pair of composable arrows gets a filled triangle whose third side is their composite. Each chain of three gets a solid tetrahedron, whose faces are the composites in every bracketing." },
    { p: "Every inner horn in a nerve has <i>exactly one</i> filler: the composite is forced. That is why a category is a quasi-category with unique fillers. In the next levels a composition table lists the entries; ask for a second answer and you are refused." },
    { demo: "tetra-3d" },
    { p: "Associativity becomes a solid: the tetrahedron on $f,g,h$ has faces $f\\cdot g$, $g\\cdot h$, $(f\\cdot g)\\cdot h$ and $f\\cdot(g\\cdot h)$, and in a nerve the last two are the same arrow. In a general quasi-category they are only related by a triangle, which is why the earlier worlds needed tetrahedra at all." },
    { p: "There is a neat way to say which shapes are nerves. A chain of arrows end to end is called a <b>spine</b>. In a nerve, every spine extends to a full simplex in exactly one way: a spine of two arrows has one triangle, a spine of three has one tetrahedron, and so on. This is the <b>Segal condition</b>. Fail it by having no extension and composition is undefined; fail it by having two and composition is a choice. The later levels of this world ask you to judge pictures by this rule." }
  ]},

  { id: "skeleta", before: "disc", title: "Skeleta and cells", body: [
    { p: "The <b>$n$-skeleton</b> $\\mathrm{sk}_n X$ keeps only the simplices of dimension at most $n$. So $\\mathrm{sk}_0$ is the dots, $\\mathrm{sk}_1$ the dots and arrows, $\\mathrm{sk}_2$ adds the triangles. Peel takes the top layer off." },
    { p: "The <b>boundary</b> $\\partial\\Delta^n$ is $\\mathrm{sk}_{n-1}\\Delta^n$: all the faces, without the filling. So $\\partial\\Delta^2$ is a hollow triangle." },
    { diagram: { dots: [{id:"a",label:"a",x:15,y:42},{id:"b",label:"b",x:50,y:12},{id:"c",label:"c",x:85,y:42}],
                 arrows: [{from:"a",to:"b",label:"f"},{from:"b",to:"c",label:"g"},{from:"a",to:"c",label:"h"}], ghost: [["a","b","c"]] } },
    { p: "To <b>attach an $n$-cell</b> to $X$ along a map $\\partial\\Delta^n\\to X$, glue in a new $\\Delta^n$ whose boundary lands on that part of $X$. Formally this is a pushout of $\\partial\\Delta^n\\hookrightarrow\\Delta^n$. Every simplicial set can be built from nothing by attaching cells, one dimension at a time." },
    { p: "Attaching a cell is not the same as filling a horn. A horn has exactly one face missing, while a boundary is missing the whole interior. This difference matters in a few worlds: filling a horn never changes the overall shape, but attaching a cell can. Keep the difference in mind when you meet the word anodyne." },
    { p: "The skeleton has an opposite, the <b>coskeleton</b>. Where the $n$-skeleton forgets everything above dimension $n$, the $n$-coskeleton puts back exactly one cell wherever a boundary is present above dimension $n$. A shape is called $n$-coskeletal when it is determined by its simplices up to dimension $n$ in this way. Nerves of ordinary categories are like that: everything above the triangles is forced." }
  ]},

  { id: "anodyne", before: "spine", title: "Anodyne maps", body: [
    { p: "Some inclusions $A\\hookrightarrow B$ can be built purely from horn fillings. The class of such maps, the <b>anodyne</b> maps, is the smallest class containing every horn inclusion $\\Lambda^n_k\\hookrightarrow\\Delta^n$ and closed under gluing, composition and retracts. Using only inner horns gives the <b>inner anodyne</b> maps." },
    { p: "Anodyne maps never change the shape. Each one is a weak homotopy equivalence, because a horn is contractible, just as $\\Delta^n$ is. For example the <b>spine</b>, the path of $n$ arrows inside $\\Delta^n$, is inner anodyne. That is why composable chains always extend to a full simplex in a quasi-category." },
    { diagram: { dots: [{id:"a",label:"0",x:8,y:38},{id:"b",label:"1",x:34,y:20},{id:"c",label:"2",x:62,y:38},{id:"d",label:"3",x:90,y:20}],
                 arrows: [{from:"a",to:"b",label:""},{from:"b",to:"c",label:""},{from:"c",to:"d",label:""},{from:"a",to:"c",label:"",dashed:true},{from:"b",to:"d",label:"",dashed:true},{from:"a",to:"d",label:"",dashed:true}] } },
    { p: "The inclusion $\\partial\\Delta^2\\hookrightarrow\\Delta^2$ is <i>not</i> anodyne. The hollow triangle is a circle; the filled one is a disc. No sequence of horn fillings can fill a hole without changing the shape." },
    { p: "In the levels of this world, decide whether horn moves can reach the goal. If doing so would change the shape, say that it can't be done, and say why." }
  ]},

  { id: "lifting", before: "liftpath", title: "Maps and lifting problems", body: [
    { p: "A <b>map</b> $p:X\\to S$ of simplicial sets sends dots to dots, arrows to arrows and triangles to triangles, keeping faces. Think of $S$ as the shadow of $X$." },
    { diagram: { dots: [{id:"a",label:"a",x:15,y:10},{id:"b",label:"b",x:50,y:10},{id:"c",label:"c",x:85,y:10},{id:"A",label:"p(a)",x:15,y:48},{id:"B",label:"p(b)",x:50,y:48},{id:"C",label:"p(c)",x:85,y:48}],
                 arrows: [{from:"a",to:"b",label:"f"},{from:"b",to:"c",label:"g"},{from:"A",to:"B",label:"pf"},{from:"B",to:"C",label:"pg"},{from:"a",to:"A",label:"",dashed:true},{from:"b",to:"B",label:"",dashed:true},{from:"c",to:"C",label:"",dashed:true}] } },
    { p: "A <b>lifting problem</b> is a square: a map $A\\to X$, a map $B\\to S$, and an inclusion $A\\hookrightarrow B$. A <b>lift</b> is a map $B\\to X$ that restricts to the first map on $A$ and projects to the second." },
    { p: "A map is an <b>inner fibration</b> if every lifting problem with $A$ an inner horn $\\Lambda^n_k$ and $B=\\Delta^n$ has a lift, and a <b>Kan fibration</b> if all horns do. A simplicial set $X$ is a quasi-category exactly when $X\\to\\Delta^0$, the map to a point, is an inner fibration. So 'filling a horn in $X$' is the special case where the shadow is a point." },
    { p: "A <b>left fibration</b> lifts more: every horn $\\Lambda^n_k$ with $k<n$, which includes $\\Lambda^1_0$: an arrow of $S$ lifts from any chosen start. Its end is not yours to choose. Think of a family of sets varying over $S$: an arrow of $S$ carries each element of one set to an element of the next." },
    { p: "In the next levels the shadow $S$ is fixed, every new simplex of $X$ must lie over a simplex of $S$, and the kind of map decides which horns lift. The same picture can be solvable over a left fibration and impossible over an inner one." }
  ]},

  { id: "joyal", before: "joyal", title: "Joyal's theorem", body: [
    { p: "Outer horns do not fill in a general quasi-category. But they do fill when the first edge is an isomorphism. <b>Joyal's theorem</b>: in a quasi-category $X$, for $n\\ge 2$, every horn $\\Lambda^n_0\\to X$ whose first edge is an equivalence has a filler. Dually for $\\Lambda^n_n$ and the last edge. Without the isomorphism hypothesis the statement fails: the one-way arrow showed that." },
    { diagram: { dots: [{id:"a",label:"0",x:20,y:32},{id:"b",label:"1",x:50,y:10},{id:"c",label:"2",x:80,y:32}],
                 arrows: [{from:"a",to:"b",label:"f (iso)"},{from:"a",to:"c",label:"h"},{from:"b",to:"c",label:"?",dashed:true}] } },
    { p: "Conversely, if an edge has this extension property then it is an equivalence. So an $\\infty$-groupoid is exactly a quasi-category in which every arrow is an equivalence." },
    { p: "The relative version: let $p:X\\to S$ be an inner fibration. A lifting problem for $\\Lambda^n_0\\hookrightarrow\\Delta^n$ against $p$ has a solution when the first edge of the horn is an equivalence in $X$." },
    { p: "You used both forms: Solve built an inverse, and the padlock on the outer face of Tetrahedron opened because the edge involved was an isomorphism. That is the whole theorem in action: invertibility of one edge licenses an outer filling." }
  ]},

  { id: "spaces", before: "sphere", title: "Pictures as spaces", body: [
    { p: "Every picture in this game is also a shape you could build out of paper. Each dot is a point, each arrow a stretch of string, each filled triangle a solid triangle, each solid tetrahedron a solid tetrahedron, all glued along their faces. This is the <b>geometric realisation</b> $|X|$ of the simplicial set $X$. Arrow directions are forgotten; only the shape is kept." },
    { diagram: { dots: [{id:"a",label:"a",x:20,y:46},{id:"b",label:"b",x:50,y:12},{id:"c",label:"c",x:80,y:46}],
                 arrows: [{from:"a",to:"b",label:"f"},{from:"b",to:"c",label:"g"},{from:"a",to:"c",label:"h"}], fills: [["a","b","c"]] } },
    { p: "A hollow triangle realises to a circle. A filled one is a disc. Two triangles glued along the same three sides, as in the next level, form a sphere, and so does the hollow tetrahedron you build later. These shapes are genuinely different: a loop around a circle cannot be shrunk to a point without leaving it, and a sphere encloses a hollow that a disc does not." },
    { p: "One number already tells many shapes apart. Count dots minus arrows plus triangles minus tetrahedra, using only the non-degenerate ones: this is the <b>Euler characteristic</b>. A disc gives $3-3+1=1$, a circle $3-3=0$, a sphere $3-3+2=2$. Peeling and gluing change it. Filling a horn never does: it adds one new face and one new cell at once, which is the arithmetic shadow of the fact you will meet in the anodyne world." }
  ]},

  { id: "paths", before: "cancel", title: "Paths, loops and why undoing is natural", body: [
    { p: "Kan complexes look like a technical condition: every horn fills. They are really the same thing as spaces. Given any space, take every way of mapping a triangle, a tetrahedron, and so on into it; these form a simplicial set, called its <b>singular complex</b>, and it is always a Kan complex. Conversely every Kan complex has the same homotopy information as its realisation." },
    { p: "Read the arrows of a singular complex as paths in the space. Composing is following one path and then the next. Undoing is running a path backwards, which is why every horn fills: a path can always be reversed and squashed back. A homotopy between two paths is a way of sliding one onto the other with the ends held fixed, exactly a triangle with an identity side." },
    { diagram: { dots: [{id:"a",label:"a",x:20,y:30},{id:"b",label:"b",x:80,y:30}],
                 arrows: [{from:"a",to:"b",label:"x",bend:0.3},{from:"a",to:"b",label:"y",bend:-0.3}], fills: [] } },
    { p: "Loops at a point, up to homotopy, form a group: compose by following one loop then another, invert by running backwards. This is the <b>fundamental group</b>. Around a circle it is the integers, counting how many times you wind round, which is one more way to see that the hollow triangle is not a disc. In an ∞-groupoid every level of this story is present at once: paths, homotopies between paths, homotopies between those, and so on." }
  ]},

  { id: "counter", before: "nofill", title: "How to prove something is impossible", body: [
    { p: "Showing a goal <i>can</i> be reached is easy to check: you do it. Showing it can <i>never</i> be reached is harder, because you cannot try every sequence of moves. Mathematicians use a <b>counterexample</b>: one concrete world in which everything you were given is true and the goal is false." },
    { diagram: { dots: [{id:"a",label:"0",x:20,y:46},{id:"b",label:"1",x:50,y:12},{id:"c",label:"2",x:80,y:46}],
                 arrows: [{from:"a",to:"b",label:"f"},{from:"b",to:"c",label:"g"},{from:"a",to:"c",label:"h"},{from:"a",to:"c",label:"f·g"}] } },
    { p: "Here the worlds are small ordinary categories, where composing has exactly one answer. In the picture, $f$ then $g$ is its own arrow $f\\cdot g$, different from $h$. If your starting picture fits inside this world, with $h$ on $h$, then the claim that $h$ is a composite of $f$ and $g$ is simply false there." },
    { p: "Why does one world settle it? Every move you have is a horn filling, and an ordinary category can fill every inner horn too: composites exist and associativity holds. So anything you could ever build from the starting picture can also be built in the test world. If the goal were reachable, it would be true there. It is not, so it is not reachable." },
    { p: "Two things can go wrong, and both teach something. If a given fact fails in your world, the world does not contain your picture. If the goal is <i>true</i> in your world, the world proves nothing: try a different one. And if the level allows undoing every arrow, the test world must allow it too." }
  ]},

  { id: "squares", before: "natsq", title: "Arrows between arrows", body: [
    { p: "So far arrows went between dots. Now treat an arrow $f$ itself as a thing, and ask what an arrow from $f$ to another arrow $f'$ should be. The answer is a <b>commuting square</b>: sides $\\alpha$ and $\\beta$ joining the ends of $f$ to the ends of $f'$, so that going round either way agrees." },
    { diagram: { dots: [{id:"a",label:"a",x:25,y:12},{id:"b",label:"b",x:75,y:12},{id:"c",label:"a'",x:25,y:48},{id:"d",label:"b'",x:75,y:48}],
                 arrows: [{from:"a",to:"b",label:"f"},{from:"a",to:"c",label:"α"},{from:"b",to:"d",label:"β"},{from:"c",to:"d",label:"f'"},{from:"a",to:"d",label:"d"}],
                 fills: [["a","b","d"],["a","c","d"]] } },
    { p: "In an $\\infty$-category \"agrees\" cannot mean equal. Each way round is a composite, so each is a triangle. The square commutes when the two triangles <i>share their diagonal</i>: $d$ is a composite of $f$ then $\\beta$, and also of $\\alpha$ then $f'$. A square is two triangles glued along one side." },
    { p: "These squares are the arrows of a new $\\infty$-category, written $\\mathrm{Fun}(\\Delta^1,C)$: its dots are the arrows of $C$. Stack two squares and you can paste them into one; that is composition there. With a bigger shape $K$ in place of a single arrow you get <b>natural transformations</b>: one square for every arrow of $K$." },
    { p: "The last theorem of the game lives here. A natural transformation is invertible as soon as each of its sides is. Nothing about the squares needs to be assumed: the return squares can be <i>built</i>, using only horn filling. That is the kind of statement higher category theory is made of: check something pointwise, get it globally." }
  ]}
];

/* Glossary, grouped by world in the order terms are met. */
HC.Glossary = [
  { term: "Dot (vertex)", world: 1, essential: false, plain: "A place. Arrows go between dots.", formal: "A 0-simplex." },
  { term: "Arrow (edge)", world: 1, essential: false, plain: "A route from one dot to another.", formal: "A 1-simplex, with a source and a target vertex." },
  { term: "Composite", world: 1, essential: true, plain: "An arrow that stands for following two arrows in turn.", formal: "An edge $h$ with a 2-simplex $\\sigma$ with boundary $(f,g,h)$. Unique only up to homotopy." },
  { term: "Triangle", world: 1, essential: true, plain: "A proof that one arrow is a composite of two.", formal: "A 2-simplex $\\Delta^2$: three vertices, three edges, and the face." },
  { term: "Tetrahedron", world: 2, essential: true, plain: "A solid with four triangular faces that must agree.", formal: "A 3-simplex $\\Delta^3$ with four 2-faces, six edges and four vertices." },
  { term: "Simplicial set", world: 2, essential: false, plain: "Dots, arrows, triangles and solids glued along shared sides.", formal: "A functor $\\Delta^{op}\\to\\mathrm{Set}$: $n$-simplices for each $n$, with face and degeneracy maps." },
  { term: "Horn", world: 2, essential: true, plain: "A simplex with its inside and one face removed.", formal: "$\\Lambda^n_k\\subset\\Delta^n$: the union of all faces of $\\Delta^n$ except the one opposite vertex $k$." },
  { term: "Inner horn", world: 2, essential: true, plain: "A horn whose missing face is not at either end.", formal: "$\\Lambda^n_k$ with $0<k<n$." },
  { term: "Filler", world: 2, essential: false, plain: "A simplex that completes a horn.", formal: "An extension $\\Delta^n\\to X$ of a map $\\Lambda^n_k\\to X$." },
  { term: "Identity (degenerate simplex)", world: 2, essential: true, plain: "The do-nothing arrow at a dot, and its flat triangles.", formal: "$s_0(v)=1_v$ is the identity edge; $s_0(f)$, $s_1(f)$ are degenerate 2-simplices." },
  { term: "Associativity", world: 2, essential: false, plain: "Combining three arrows gives the same result either way.", formal: "Here: the two bracketings are related by a 3-simplex, not equal." },
  { term: "Homotopy", world: 2, essential: true, plain: "Parallel arrows joined by a triangle with a do-nothing side.", formal: "A 2-simplex with boundary $(f,1,g)$. In a quasi-category this is an equivalence relation." },
  { term: "Equivalence relation", world: 3, essential: false, plain: "Reflexive, symmetric and transitive: it sorts things into groups.", formal: "Homotopy of edges is one, so $hX$ has well-defined hom-sets." },
  { term: "Quasi-category (∞-category)", world: 3, essential: true, plain: "Every inner horn fills: composites exist, up to homotopy.", formal: "A simplicial set with fillers for all inner horns $\\Lambda^n_k\\to\\Delta^n$, $0<k<n$ (Boardman-Vogt, Joyal)." },
  { term: "Homotopy category", world: 3, essential: false, plain: "Arrows modulo homotopy form an ordinary category.", formal: "$hX$: objects the vertices, morphisms homotopy classes of edges." },
  { term: "Outer horn", world: 4, essential: true, plain: "A horn missing its first or last face.", formal: "$\\Lambda^n_0$ or $\\Lambda^n_n$." },
  { term: "Kan complex", world: 4, essential: true, plain: "Every horn fills, inner and outer. Everything can be undone.", formal: "A simplicial set with fillers for all horns $\\Lambda^n_k\\to\\Delta^n$, $0\\le k\\le n$." },
  { term: "Left / right inverse", world: 4, essential: false, plain: "An arrow undoing $f$ before, or after, it.", formal: "$g$ with $f\\cdot g\\simeq 1_a$ (left), $k$ with $k\\cdot f\\simeq 1_b$ (right)." },
  { term: "Isomorphism (equivalence)", world: 4, essential: true, plain: "A reversible arrow: it has inverses up to homotopy.", formal: "An edge with a left and a right inverse up to homotopy; an isomorphism in $hX$." },
  { term: "$\\infty$-groupoid", world: 4, essential: true, plain: "Another name for a Kan complex: a space where all paths reverse.", formal: "By the homotopy hypothesis, Kan complexes model spaces up to homotopy." },
  { term: "Nerve", world: 5, essential: true, plain: "A category drawn as dots, arrows, triangles and solids.", formal: "$N(\\mathcal C)$: $n$-simplices are chains of $n$ composable morphisms. Inner horns fill uniquely." },
  { term: "Skeleton", world: 6, essential: true, plain: "What remains after removing everything above a dimension.", formal: "$\\mathrm{sk}_nX$: the simplicial subset generated by simplices of dimension $\\le n$." },
  { term: "Boundary", world: 6, essential: false, plain: "The outer rim of a shape, without its inside.", formal: "$\\partial\\Delta^n=\\mathrm{sk}_{n-1}\\Delta^n$: the union of all faces of $\\Delta^n$." },
  { term: "Cell", world: 6, essential: true, plain: "A triangle or solid glued onto a rim.", formal: "Attaching an $n$-cell: glue $\\Delta^n$ to $X$ along a map $\\partial\\Delta^n\\to X$ (a pushout)." },
  { term: "Anodyne map", world: 7, essential: true, plain: "Built from horn fillings only, so the shape never changes.", formal: "The saturated class generated by $\\Lambda^n_k\\subset\\Delta^n$. $\\partial\\Delta^2\\subset\\Delta^2$ is not anodyne." },
  { term: "Inner anodyne map", world: 7, essential: false, plain: "Anodyne, using only inner horns.", formal: "Saturated class generated by $\\Lambda^n_k\\subset\\Delta^n$, $0<k<n$." },
  { term: "Spine", world: 7, essential: false, plain: "A solid's path of consecutive arrows, nothing else.", formal: "$\\mathrm{Spine}^n\\subset\\Delta^n$: the union of the edges $\\{i,i+1\\}$. The inclusion is inner anodyne." },
  { term: "Map", world: 8, essential: true, plain: "A rule sending each simplex of one shape to one of another.", formal: "A morphism of simplicial sets $p:X\\to S$." },
  { term: "Lifting problem", world: 8, essential: true, plain: "Extend a map over a bigger shape, staying above a fixed shadow.", formal: "A square $A\\to X$, $B\\to S$ with $A\\subset B$; find $B\\to X$ making both triangles commute." },
  { term: "Inner fibration", world: 8, essential: true, plain: "A map for which every inner horn lifts.", formal: "$p$ with the right lifting property against $\\Lambda^n_k\\subset\\Delta^n$, $0<k<n$." },
  { term: "Geometric realisation", world: 6, essential: false, plain: "The space you get by building the picture out of solid pieces.", formal: "$|X|=\\mathrm{colim}_{\\Delta^n\\to X}|\\Delta^n|$, gluing topological simplices along faces." },
  { term: "Euler characteristic", world: 6, essential: false, plain: "Dots minus arrows plus triangles, and so on.", formal: "$\\chi(X)=\\sum_n(-1)^n\\,\\#\\{\\text{non-degenerate } n\\text{-simplices}\\}$ for finite $X$." },
  { term: "Fundamental group", world: 4, essential: false, plain: "Loops at a point up to homotopy, with composition.", formal: "$\\pi_1(X,x)$: endomorphisms of $x$ in the homotopy category of a Kan complex $X$." },
  { term: "Spine", world: 5, essential: true, plain: "A chain of arrows end to end.", formal: "$I^n\\subset\\Delta^n$: the union of the edges $\\{i,i+1\\}$." },
  { term: "Segal condition", world: 5, essential: false, plain: "Every spine fills in exactly one way.", formal: "$X_n\\to X_1\\times_{X_0}\\cdots\\times_{X_0}X_1$ is a bijection; equivalent to being a nerve." },
  { term: "Coskeleton", world: 6, essential: true, plain: "Fill every hollow shape in the only possible way.", formal: "$(\\mathrm{cosk}_nX)_m=\\mathrm{Hom}(\\mathrm{sk}_n\\Delta^m,X)$; right adjoint to $\\mathrm{sk}_n$." },
  { term: "Counterexample", world: 7, essential: true, plain: "A world where the givens hold and the goal fails.", formal: "A map to the nerve of a category in which the required simplex does not exist." },
  { term: "Idempotent", world: 9, essential: false, plain: "An arrow that, done twice, is the same as done once.", formal: "An edge $e$ with a 2-simplex $(e,e,e)$." },
  { term: "Left fibration", world: 8, essential: true, plain: "A map that lifts arrows from any start, and horns that know their first arrow.", formal: "A map with the right lifting property against $\\Lambda^n_k\\hookrightarrow\\Delta^n$ for $0\\le k<n$." },
  { term: "Conservative", world: 8, essential: false, plain: "An arrow over an isomorphism must be an isomorphism.", formal: "$p$ reflects equivalences: $p(f)$ an equivalence implies $f$ an equivalence." },
  { term: "Commuting square", world: 10, essential: true, plain: "Two triangles sharing a diagonal: an arrow between arrows.", formal: "A map $\\Delta^1\\times\\Delta^1\\to C$; an edge of $\\mathrm{Fun}(\\Delta^1,C)$." },
  { term: "Natural transformation", world: 10, essential: true, plain: "A family of arrows making every square commute.", formal: "An edge of $\\mathrm{Fun}(K,C)$, i.e. a map $K\\times\\Delta^1\\to C$." },
  { term: "Natural isomorphism", world: 10, essential: false, plain: "A natural transformation whose every side is an isomorphism.", formal: "An equivalence in $\\mathrm{Fun}(K,C)$; equivalently, each component is an equivalence in $C$." },
  { term: "Joyal's theorem", world: 9, essential: true, plain: "Outer horns fill when their first arrow is reversible.", formal: "In an $\\infty$-category, $\\Lambda^n_0\\to X$ ($n\\ge2$) extends to $\\Delta^n$ if its first edge is an equivalence; conversely such an edge is an equivalence." }
];

HC.Epilogue = {
  title: "What you did, and where to go next",
  html:
    "<h3>What you did</h3>" +
    "<p>Every level used one idea. A <b>horn</b> is a simplex with one face and its inside removed, and a move fills it back in. In an ∞-category the inner horns can always be filled, and that single rule replaces the composition law of an ordinary category.</p>" +
    "<p>Filling a horn of two arrows gave you <b>composition</b>, and filling it twice showed that a composite is something you choose, with a triangle as the record of the choice. Tetrahedra then made the choices agree: you proved that any two composites are <b>homotopic</b>, that homotopy is an equivalence relation, that it is respected by composition, and that bracketing three or four arrows makes no difference. Those are exactly the statements needed to say that an ∞-category has a <b>homotopy category</b>, an ordinary category obtained by treating homotopic arrows as equal.</p>" +
    "<p>You saw the two extremes. In the <b>nerve</b> of a category every horn has exactly one filler, so nothing is left to choose. In a <b>Kan complex</b> every horn fills, outer ones included, so every arrow can be undone, and the shape behaves like a space. <b>Joyal's theorem</b> connects them: in an ∞-category an outer horn $\\Lambda^n_0$ can be filled exactly when the arrow it starts with is an <b>isomorphism</b>. So a Kan complex is the same thing as an ∞-category in which every arrow is an isomorphism.</p>" +
    "<p>You also proved things impossible, by placing a picture inside a small category where the goal is false. You built shapes cell by cell, took <b>skeleta</b> and <b>coskeleta</b>, and worked over a second shape through a <b>left fibration</b>, where an arrow over an isomorphism must itself be one. The last world treated arrows as objects: commuting squares are the arrows of $\\mathrm{Fun}(\\Delta^1,C)$, and you showed that a <b>natural transformation</b> is invertible as soon as each of its components is.</p>" +
    "<h3>A roadmap</h3>" +
    "<p><b>1. Ordinary category theory.</b> The game used categories, functors and natural transformations informally. The next things to learn are limits and colimits, adjunctions, and the Yoneda lemma, since every one of them has a higher version. Good places to start are Tom Leinster's <i>Basic Category Theory</i> and Emily Riehl's <i>Category Theory in Context</i>, both free online.</p>" +
    "<p><b>2. Simplicial sets and homotopy.</b> Here a simplicial set was a picture. Formally it is a functor from the category of finite ordered sets, and the pictures are its non-degenerate simplices. Learn the face and degeneracy maps, geometric realisation, and why Kan complexes model spaces. Greg Friedman's <i>An elementary illustrated introduction to simplicial sets</i> is gentle, and Goerss and Jardine's <i>Simplicial Homotopy Theory</i> is the standard reference.</p>" +
    "<p><b>3. Quasi-categories properly.</b> Now redo what you did here in general: mapping spaces, the homotopy category, equivalences, Joyal's lifting theorem, and the fibrations (inner, left and right, Kan, isofibrations). Charles Rezk's notes <i>Introduction to quasicategories</i> and Markus Land's <i>Introduction to Infinity-Categories</i> are written for a first pass. Denis-Charles Cisinski's <i>Higher Categories and Homotopical Algebra</i> goes further.</p>" +
    "<p><b>4. The theory itself.</b> Limits and colimits in an ∞-category, adjunctions, straightening and unstraightening (which turns the left fibrations you met into functors to spaces), presentable and stable ∞-categories. Jacob Lurie's <i>Higher Topos Theory</i> and <i>Higher Algebra</i> are the main sources, and Riehl and Verity's <i>Elements of ∞-Category Theory</i> develops the same material in a way that does not depend on the model.</p>" +
    "<p>A practical suggestion: when a proof in one of these books says a map is inner anodyne, or that some horn can be filled, try drawing the picture and filling it by hand. Most of them are levels.</p>"
};
