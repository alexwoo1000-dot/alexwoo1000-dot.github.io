var HC = (typeof window !== 'undefined' ? window : globalThis).HC || ((typeof window !== 'undefined' ? window : globalThis).HC = {});

/* Text for HORNFILLER v5. Strings may contain inline HTML and $...$ LaTeX.
   Triangles are written by their boundary (d_2, d_0 ; d_1) = (first leg, second leg ; long side), e.g. (f, g ; x),
   and by name: sigma_1, sigma_2, ... (given ones first, then in creation order); degenerate ones are s_0 f = (1_a, f ; f)
   and s_1 f = (f, 1_b ; f). The relation x ~ y (homotopy) is written only after it has been defined as a triangle (x, 1_b ; y). */

// needs: worlds that must be finished (bosses optional) before a world opens. The map branches.
HC.WorldNeeds = { 1: [], 2: [1], 3: [2], 4: [3], 5: [4], 6: [3], 7: [2], 8: [4], 9: [5], 10: [5], 11: [10], 12: [2] };

HC.Worlds = [

  { id: 1, title: "Simplicial sets", mathTitle: "Simplicial sets", blurb: "",
    definition: "A <b>simplicial set</b> $X$ is a family of sets: dots $X_0$, arrows $X_1$, triangles $X_2$, tetrahedra $X_3$, and so on. An arrow has a source and a target. A triangle $\\sigma$ has three faces, all arrows: $d_2\\sigma$ joins its corners $0$ and $1$, $d_0\\sigma$ joins $1$ and $2$, and $d_1\\sigma$ joins $0$ and $2$. We write $\\sigma=(d_2\\sigma,\\,d_0\\sigma\\,;\\,d_1\\sigma)$: first leg, second leg, long side. Every dot $a$ has a <b>degenerate</b> arrow $1_a$, and every arrow $f:a\\to b$ has two degenerate triangles, $s_0f=(1_a,f\\,;\\,f)$ and $s_1f=(f,1_b\\,;\\,f)$; the same pattern continues in higher dimensions.",
    definitionDiagram: { dots: [{id:"a",label:"0",x:12,y:44},{id:"b",label:"1",x:50,y:8},{id:"c",label:"2",x:88,y:44}],
      arrows: [{from:"a",to:"b",label:"d₂σ"},{from:"b",to:"c",label:"d₀σ"},{from:"a",to:"c",label:"d₁σ"}], fills: [["a","b","c"]] },
    hornsFill: "none",
    brief: {
      sofar: "You have not played anything yet.",
      now: "You will read triangles by their three sides and find the degenerate ones that every simplicial set contains for free.",
      new: "Faces $d_0,d_1,d_2$, the notation $(f,g\\,;\\,x)$, and the degenerate arrows and triangles $1_a$, $s_0f$, $s_1f$.",
      about: "No arrow or triangle is built in this world. Each level asks you to identify a simplex from its faces, which is the skill every later proof depends on.",
      picture: { caption: "A triangle $\\sigma=(f,g\\,;\\,x)$: legs $f,g$ and long side $x$.",
        dots: [{ id: "a", label: "0", x: 12, y: 44 }, { id: "b", label: "1", x: 50, y: 10 }, { id: "c", label: "2", x: 88, y: 44 }],
        arrows: [{ from: "a", to: "b", label: "f" }, { from: "b", to: "c", label: "g" }, { from: "a", to: "c", label: "x" }],
        fills: [["a", "b", "c"]] } } },

  { id: 2, title: "Composition", mathTitle: "The inner horn $\\Lambda^2_1$", blurb: "",
    definition: "Let $f:a\\to b$ and $g:b\\to c$ be arrows. A <b>composite</b> of $f$ and $g$ is an arrow $x:a\\to c$ together with a triangle $\\sigma=(f,g\\,;\\,x)$ that witnesses it. The two arrows $f,g$ form the <b>horn</b> $\\Lambda^2_1$, a triangle with its long side removed, and a <b>filler</b> of the horn is a triangle with those two sides. In this world every such horn has a filler, but nothing says the filler is unique: a pair may have several composites, each with its own witness.",
    definitionDiagram: { dots: [{id:"a",label:"a",x:12,y:44},{id:"b",label:"b",x:50,y:8},{id:"c",label:"c",x:88,y:44}],
      arrows: [{from:"a",to:"b",label:"f"},{from:"b",to:"c",label:"g"},{from:"a",to:"c",label:"x",dashed:true}], ghost: [["a","b","c"]] },
    hornsFill: "inner",
    brief: {
      sofar: "You can read a triangle by its boundary and name the degenerate ones.",
      now: "You will fill the horn $\\Lambda^2_1$ to construct composites, and discover that a pair of arrows can have more than one.",
      new: "The tool Compose; a composite and its witnessing triangle.",
      about: "Composition here is a construction with a witness, not a function. Constructing a composite means choosing a filler of $\\Lambda^2_1$.",
      picture: { caption: "Two sides given; the long side is what you construct.",
        dots: [{ id: "a", label: "a", x: 12, y: 44 }, { id: "b", label: "b", x: 50, y: 10 }, { id: "c", label: "c", x: 88, y: 44 }],
        arrows: [{ from: "a", to: "b", label: "f" }, { from: "b", to: "c", label: "g" }, { from: "a", to: "c", label: "?", dashed: true }],
        fills: [], ghost: [["a", "b", "c"]] } } },

  { id: 3, title: "Tetrahedra", mathTitle: "Inner horns $\\Lambda^3_1,\\Lambda^3_2$", blurb: "",
    definition: "A <b>tetrahedron</b> is a 3-simplex with corners $0,1,2,3$ and four triangular faces $d_0,\\dots,d_3$, where $d_i$ is the face omitting corner $i$. Its corners may lie over the same dot, and then some faces are degenerate. If three faces of a tetrahedron are known and the fourth is $d_1$ or $d_2$, the three form an inner horn $\\Lambda^3_1$ or $\\Lambda^3_2$. In this world every such horn has a filler, which is a tetrahedron, and the filler's remaining face is a new triangle. The same tetrahedra define homotopy: parallel arrows $x,y:a\to b$ are <b>homotopic</b>, $x\simeq y$, if a triangle $(x,1_b\,;\,y)$ exists. That is only a definition; the next world studies the relation.",
    definitionDiagram: { dots: [{id:"a",label:"0",x:8,y:46},{id:"b",label:"1",x:50,y:6},{id:"c",label:"2",x:50,y:32},{id:"d",label:"3",x:92,y:46}],
      arrows: [{from:"a",to:"b",label:""},{from:"b",to:"d",label:""},{from:"a",to:"d",label:""},{from:"a",to:"c",label:""},{from:"c",to:"d",label:""},{from:"b",to:"c",label:""}], fills: [["a","b","c"],["b","c","d"],["a","c","d"]] },
    hornsFill: "inner",
    brief: {
      sofar: "You can construct composites, and you have seen that a pair of arrows can have several.",
      now: "You will use tetrahedra to relate composites to each other, and to show that following an identity changes nothing up to a triangle.",
      new: "The tool Tetrahedron, the face names $d_0,\\dots,d_3$, and the inner horns $\\Lambda^3_1$, $\\Lambda^3_2$.",
      about: "A tetrahedron is the smallest shape whose faces constrain one another. Filling a 3-horn is how the game proves that two constructions agree.",
      picture: { caption: "Three faces fit together; the fourth is forced.",
        dots: [{ id: "a", label: "0", x: 8, y: 46 }, { id: "b", label: "1", x: 50, y: 6 }, { id: "c", label: "2", x: 50, y: 32 }, { id: "d", label: "3", x: 92, y: 46 }],
        arrows: [{ from: "a", to: "b", label: "" }, { from: "b", to: "d", label: "" }, { from: "a", to: "d", label: "" }, { from: "a", to: "c", label: "" }, { from: "c", to: "d", label: "" }, { from: "b", to: "c", label: "" }],
        fills: [["a", "b", "c"], ["b", "c", "d"], ["a", "c", "d"]] } } },

  { id: 4, title: "Homotopy", mathTitle: "Homotopy of morphisms", blurb: "",
    definition: "Let $x,y:a\\to b$ be parallel arrows. We say $x$ is <b>homotopic</b> to $y$, and write $x\\simeq y$, if there is a triangle with boundary $(x,1_b\\,;\\,y)$. This is the whole definition, and different triangles give different witnesses. Symmetry, transitivity and compatibility with composition are not part of it. They are theorems, proved in this world by filling inner horns $\\Lambda^3_k$. Each proof becomes a tool: Flip, Link, Swap in.",
    definitionDiagram: { dots: [{id:"a",label:"0 = a",x:10,y:44},{id:"b",label:"1 = b",x:50,y:8},{id:"c",label:"2 = b",x:90,y:44}],
      arrows: [{from:"a",to:"b",label:"x"},{from:"b",to:"c",label:"1_b",kind:"identity",dashed:true},{from:"a",to:"c",label:"y"}], fills: [["a","b","c"]] },
    hornsFill: "inner",
    brief: {
      sofar: "You can build tetrahedra and use them to show that two composites are related.",
      now: "You will prove that homotopy, defined as a triangle $(x,1_b\\,;\\,y)$, is symmetric and transitive, and that homotopic arrows can replace one another in triangles.",
      new: "The theorem tools Flip, Link and Swap in, each the one-click form of a proof you give.",
      about: "Homotopy is introduced as a bare definition. Everything that makes it behave like equality has to be proved, and the proofs are the puzzles.",
      picture: { caption: "$x\\simeq y$ means a triangle $(x,1_b\\,;\\,y)$ exists.",
        dots: [{ id: "a", label: "a", x: 10, y: 44 }, { id: "b", label: "b", x: 50, y: 10 }, { id: "c", label: "b", x: 90, y: 44 }],
        arrows: [{ from: "a", to: "b", label: "x" }, { from: "b", to: "c", label: "1_b", kind: "identity" }, { from: "a", to: "c", label: "y" }],
        fills: [["a", "b", "c"]] } } },

  { id: 5, title: "Undo everything", mathTitle: "Kan complexes", blurb: "",
    definition: "A simplicial set is a <b>Kan complex</b> if every horn $\\Lambda^n_k\\to X$ has a filler, outer horns ($k=0$ and $k=n$) included. For $\\Lambda^2_0$ this means: given arrows $f:a\\to b$ and $h:a\\to c$, there is an arrow $g:b\\to c$ and a triangle $(f,g\\,;\\,h)$. Taking $h=1_a$ gives $g$ with $(f,g\\,;\\,1_a)$, a left inverse of $f$. Dually $\\Lambda^2_2$ gives right inverses. In this world all horns fill, so every arrow can be undone up to homotopy.",
    definitionDiagram: { dots: [{id:"a",label:"0",x:12,y:10},{id:"b",label:"1",x:88,y:10},{id:"c",label:"2",x:50,y:48}],
      arrows: [{from:"a",to:"b",label:"f"},{from:"a",to:"c",label:"h"},{from:"b",to:"c",label:"?",dashed:true}], ghost: [["a","b","c"]] },
    hornsFill: "all",
    brief: {
      sofar: "Only horns missing a middle side could be filled, and homotopy is a relation you can manipulate with tools.",
      now: "You will fill outer horns to construct left and right inverses, and show that the two agree up to homotopy.",
      new: "The tools Solve $f\\cdot ?=h$ and Solve $?\\cdot g=h$, which fill $\\Lambda^2_0$ and $\\Lambda^2_2$; isomorphisms.",
      about: "Outer horns are the new fillings available. They allow an arrow to be walked backwards, and so they change what the space can contain.",
      picture: { caption: "Two sides leave the same dot; the missing one is an inverse when $h=1_a$.",
        dots: [{ id: "a", label: "a", x: 12, y: 10 }, { id: "b", label: "b", x: 88, y: 10 }, { id: "c", label: "c", x: 50, y: 46 }],
        arrows: [{ from: "a", to: "b", label: "f" }, { from: "a", to: "c", label: "h" }, { from: "b", to: "c", label: "?", dashed: true }],
        fills: [], ghost: [["a", "b", "c"]] } } },

  { id: 6, title: "Nerves of categories", mathTitle: "Nerves of categories", blurb: "",
    definition: "The <b>nerve</b> $N(\\mathcal C)$ of a category $\\mathcal C$ has the objects as dots, the morphisms as arrows, and as $n$-simplices the chains of $n$ composable morphisms. A triangle is a pair $f,g$ together with their composite. In a nerve every inner horn has exactly one filler, and a simplicial set in which every inner horn has a unique filler is the nerve of a category. Quasi-categories only ask for existence, so composites there are unique up to homotopy but not literally.",
    definitionDiagram: { dots: [{id:"a",label:"a",x:8,y:36},{id:"b",label:"b",x:36,y:12},{id:"c",label:"c",x:64,y:36},{id:"d",label:"d",x:92,y:12}],
      arrows: [{from:"a",to:"b",label:"f"},{from:"b",to:"c",label:"g"},{from:"c",to:"d",label:"h"}] },
    hornsFill: "inner",
    brief: {
      sofar: "Composites existed but were many, related by homotopy.",
      now: "You will meet simplicial sets in which each pair of composable arrows has exactly one triangle, and learn to tell such a set from one that does not.",
      new: "Nerves, the composition table (Rulebook), and the verdict tools for deciding whether a picture is a nerve.",
      about: "A nerve is a quasi-category with no slack: every composite is determined. Spotting a missing or doubled triangle is how you show a picture is not one.",
      picture: { caption: "Every pair has a composite, and only one.",
        dots: [{ id: "a", label: "a", x: 8, y: 26 }, { id: "b", label: "b", x: 50, y: 26 }, { id: "c", label: "c", x: 92, y: 26 }],
        arrows: [{ from: "a", to: "b", label: "f" }, { from: "b", to: "c", label: "g" }, { from: "a", to: "c", label: "x" }],
        fills: [] } } },

  { id: 7, title: "Bones", mathTitle: "Skeleta and cells", blurb: "",
    definition: "The <b>$n$-skeleton</b> $\\mathrm{sk}_nX$ is the simplicial subset generated by the simplices of dimension at most $n$. The <b>boundary</b> $\\partial\\Delta^n=\\mathrm{sk}_{n-1}\\Delta^n$ is the union of all faces of $\\Delta^n$ without its interior. To <b>attach an $n$-cell</b> to $X$ along a map $\\partial\\Delta^n\\to X$ is to form the pushout $X\\sqcup_{\\partial\\Delta^n}\\Delta^n$. The <b>coskeleton</b> $\\mathrm{cosk}_n$ is right adjoint to $\\mathrm{sk}_n$; it fills every boundary above dimension $n$ in the unique possible way.",
    definitionDiagram: { dots: [{id:"a",label:"0",x:12,y:46},{id:"b",label:"1",x:50,y:8},{id:"c",label:"2",x:88,y:46}],
      arrows: [{from:"a",to:"b",label:""},{from:"b",to:"c",label:""},{from:"a",to:"c",label:""}], ghost: [["a","b","c"]] },
    hornsFill: "none",
    brief: {
      sofar: "You have filled horns inside shapes that were given to you.",
      now: "You will assemble and dismantle shapes by dimension, using skeleta, cells and coskeleta.",
      new: "The tools Draw arrow, Glue triangle, Peel and Fill in; boundaries and cells.",
      about: "Nothing fills a horn here. Shapes are built by gluing cells along boundaries, which is a different operation from filling a horn, and the next world depends on the difference.",
      picture: { caption: "$\\partial\\Delta^2$: a boundary with no interior. A 2-cell fills it.",
        dots: [{ id: "a", label: "0", x: 12, y: 46 }, { id: "b", label: "1", x: 50, y: 8 }, { id: "c", label: "2", x: 88, y: 46 }],
        arrows: [{ from: "a", to: "b", label: "" }, { from: "b", to: "c", label: "" }, { from: "a", to: "c", label: "" }],
        fills: [], ghost: [["a", "b", "c"]] } } },

  { id: 8, title: "Possible or not?", mathTitle: "Anodyne maps", blurb: "",
    definition: "A map of simplicial sets is <b>anodyne</b> if it is built from horn inclusions $\\Lambda^n_k\\hookrightarrow\\Delta^n$ by pushouts, composition and retracts; it is <b>inner anodyne</b> if only inner horns are used. Anodyne maps are weak homotopy equivalences, so they never change the shape. By contrast $\\partial\\Delta^2\\hookrightarrow\\Delta^2$ is not anodyne, since it turns a circle into a disc. To show a goal is impossible, exhibit a quasi-category that contains your data but not the goal, and say why.",
    definitionDiagram: { dots: [{id:"a",label:"0",x:12,y:46},{id:"b",label:"1",x:50,y:8},{id:"c",label:"2",x:88,y:46}],
      arrows: [{from:"a",to:"b",label:""},{from:"b",to:"c",label:""},{from:"a",to:"c",label:"",dashed:true}], ghost: [["a","b","c"]] },
    hornsFill: "inner",
    brief: {
      sofar: "You know that gluing a cell and filling a horn are different operations.",
      now: "You will decide, goal by goal, whether horn fillings can reach it; when they cannot, you will build a model that proves it.",
      new: "The button This can't be done, with the counter-models and reasons behind it; anodyne maps.",
      about: "Horn fillings add a face but never change the shape, so a goal that would change the shape cannot be reached. Recognising that is the skill tested here.",
      picture: { caption: "A closed loop of arrows: no horn is missing a side.",
        dots: [{ id: "a", label: "", x: 12, y: 8 }, { id: "b", label: "", x: 56, y: 8 }, { id: "c", label: "", x: 56, y: 46 }, { id: "d", label: "", x: 12, y: 46 }],
        arrows: [{ from: "a", to: "b", label: "" }, { from: "b", to: "c", label: "" }, { from: "c", to: "d", label: "" }, { from: "d", to: "a", label: "" }],
        fills: [] } } },

  { id: 9, title: "Lifting", mathTitle: "Left fibrations", blurb: "",
    definition: "A map $p:X\\to S$ of simplicial sets sends dots, arrows and triangles of $X$ to those of $S$, preserving faces. A <b>lifting problem</b> for $p$ is a map $\\Lambda^n_k\\to X$ together with a filler $\\Delta^n\\to S$ of its image; a <b>lift</b> is a filler $\\Delta^n\\to X$ over it. The map $p$ is an <b>inner fibration</b> if every lifting problem with $0<k<n$ has a lift, and a <b>left fibration</b> if every problem with $0\\le k<n$ does. Here $S$ is fixed and everything you build in $X$ must lie over what exists in $S$.",
    definitionDiagram: { dots: [{id:"a",label:"x",x:10,y:8},{id:"b",label:"y",x:50,y:8},{id:"c",label:"z",x:90,y:8},{id:"A",label:"a",x:10,y:48},{id:"B",label:"b",x:50,y:48},{id:"C",label:"c",x:90,y:48}],
      arrows: [{from:"a",to:"b",label:"f"},{from:"b",to:"c",label:"g"},{from:"A",to:"B",label:"p f"},{from:"B",to:"C",label:"p g"},{from:"a",to:"A",label:"",dashed:true},{from:"b",to:"B",label:"",dashed:true},{from:"c",to:"C",label:"",dashed:true}] },
    hornsFill: "left",
    brief: {
      sofar: "Every shape you built was filled in by horn fillings inside a single simplicial set.",
      now: "You will build over a second, fixed simplicial set $S$, where the kind of map $p$ decides which horns can be filled.",
      new: "The tool Lift arrow, and the difference between inner fibrations and left fibrations.",
      about: "A lift must lie over a piece of $S$ that is already there. When a filling has a choice, the game asks which piece of $S$ your simplex should lie over.",
      picture: { caption: "Every simplex upstairs lies over one below.",
        dots: [{ id: "a", label: "x", x: 10, y: 8 }, { id: "b", label: "y", x: 50, y: 8 }, { id: "c", label: "z", x: 90, y: 8 }, { id: "A", label: "a", x: 10, y: 46 }, { id: "B", label: "b", x: 50, y: 46 }, { id: "C", label: "c", x: 90, y: 46 }],
        arrows: [{ from: "a", to: "b", label: "f" }, { from: "b", to: "c", label: "g" }, { from: "A", to: "B", label: "" }, { from: "B", to: "C", label: "" }, { from: "a", to: "A", label: "", dashed: true }, { from: "b", to: "B", label: "", dashed: true }, { from: "c", to: "C", label: "", dashed: true }],
        fills: [] } } },

  { id: 10, title: "Isomorphisms", mathTitle: "Joyal's theorem", blurb: "",
    definition: "An arrow $f:a\\to b$ is an <b>isomorphism</b>, or equivalence, if there are arrows $g,k:b\\to a$ and triangles $(f,g\\,;\\,1_a)$ and $(k,f\\,;\\,1_b)$. <b>Joyal's theorem</b> says that in a quasi-category an outer horn $\\Lambda^n_0\\to X$ with $n\\ge2$ has a filler whenever its first edge is an isomorphism, and dually for $\\Lambda^n_n$ and the last edge. In this world the padlock on an outer face opens exactly for arrows marked $\\cong$; for all other arrows only inner horns fill.",
    definitionDiagram: { dots: [{id:"a",label:"0",x:14,y:30},{id:"b",label:"1",x:86,y:30}],
      arrows: [{from:"a",to:"b",label:"f ≅"},{from:"b",to:"a",label:"g"}] },
    hornsFill: "inner+iso",
    brief: {
      sofar: "In a Kan complex every outer horn fills, and every arrow can be undone.",
      now: "You will find out when an outer horn can be filled in a space that is only a quasi-category, and what cancelling and inverting need.",
      new: "The mark $\\cong$, one-sided and two-sided inverses, and Joyal's theorem.",
      about: "Without a blanket assumption, outer horns are filled only where an isomorphism makes it legitimate. Several goals here are impossible for exactly that reason.",
      picture: { caption: "A reversible arrow: outer horns along it may be filled.",
        dots: [{ id: "a", label: "a", x: 14, y: 26 }, { id: "b", label: "b", x: 86, y: 26 }],
        arrows: [{ from: "a", to: "b", label: "f ≅" }, { from: "b", to: "a", label: "g" }],
        fills: [] } } },

  { id: 11, title: "Squares", mathTitle: "Natural transformations", blurb: "",
    definition: "A <b>square</b> in a simplicial set is a map $\\Delta^1\\times\\Delta^1\\to X$: two triangles $(f,\\beta\\,;\\,d)$ and $(\\alpha,f'\\,;\\,d)$ that share the long side $d$. It is an arrow from $f$ to $f'$ in the arrow category, that is, a natural transformation with components $\\alpha$ and $\\beta$. Squares can be pasted, and when $\\alpha,\\beta$ are isomorphisms a square can be inverted. Each of these facts is a proof by inner horns plus the tool Divide.",
    definitionDiagram: { dots: [{id:"a",label:"a",x:10,y:8},{id:"b",label:"b",x:58,y:8},{id:"c",label:"a′",x:10,y:46},{id:"d",label:"b′",x:58,y:46}],
      arrows: [{from:"a",to:"b",label:"f"},{from:"a",to:"c",label:"α"},{from:"b",to:"d",label:"β"},{from:"c",to:"d",label:"f′"},{from:"a",to:"d",label:"d"}], fills: [["a","b","d"],["a","c","d"]] },
    hornsFill: "inner+iso",
    brief: {
      sofar: "You can invert isomorphisms and cancel them.",
      now: "You will treat a square as an arrow between arrows and show that squares paste and invert.",
      new: "The tool Divide, commuting squares, and natural isomorphisms.",
      about: "A square is two triangles sharing a long side. Pasting and inverting squares is the same reasoning as before, one level up.",
      picture: { caption: "A square: two triangles on one long side.",
        dots: [{ id: "a", label: "a", x: 10, y: 8 }, { id: "b", label: "b", x: 58, y: 8 }, { id: "c", label: "a′", x: 10, y: 46 }, { id: "d", label: "b′", x: 58, y: 46 }],
        arrows: [{ from: "a", to: "b", label: "f" }, { from: "a", to: "c", label: "α" }, { from: "b", to: "d", label: "β" }, { from: "c", to: "d", label: "f′" }, { from: "a", to: "d", label: "d" }],
        fills: [["a", "b", "d"], ["a", "c", "d"]] } } },

  { id: 12, title: "Playground", mathTitle: "Simplicial sets", blurb: "",
    definition: "Every tool is available and no goal has to be met. The playground is a simplicial set that you modify: add dots and arrows, fill horns, glue and peel cells. Whatever you build is a legitimate simplicial set, and with the Kan option on every horn can be filled.",
    definitionDiagram: { dots: [{id:"a",label:"0",x:14,y:44},{id:"b",label:"1",x:50,y:10},{id:"c",label:"2",x:86,y:44}],
      arrows: [{from:"a",to:"b",label:""},{from:"b",to:"c",label:""},{from:"a",to:"c",label:""}], fills: [["a","b","c"]] },
    hornsFill: "all",
    brief: {
      sofar: "You have used every tool.",
      now: "You can build whatever you like, to test a guess about a shape or to construct one you have not seen.",
      new: "Nothing is new here.",
      about: "No goal has to be met. It is a place to test a guess about a shape you have met, or to build one you have not.",
      picture: { caption: "No goal: build any shape you like.",
        dots: [{ id: "a", label: "a", x: 14, y: 44 }, { id: "b", label: "b", x: 50, y: 10 }, { id: "c", label: "c", x: 86, y: 44 }],
        arrows: [{ from: "a", to: "b", label: "" }, { from: "b", to: "c", label: "" }, { from: "a", to: "c", label: "" }],
        fills: [["a", "b", "c"]] } } }
];

HC.Text = {

  /* ---------------- World 1: Composition ---------------- */

  compose: {
    title: "Constructing a composite",
    bullets: ["Given arrows $f:a\\to b$ and $g:b\\to c$.", "Construct a triangle $(f,g\\,;\\,?)$: a composite of $f$ then $g$."],
    explain: "The arrows $f$ and $g$ meet at $b$, so together they form the horn $\\Lambda^2_1$: a triangle with its long side removed. Compose fills it. The game adds a new arrow from $a$ to $c$, which it labels with a fresh letter, and a triangle $\\sigma_1=(f,g\\,;\\,x)$ whose boundary is $f$, $g$ and the new arrow. That triangle is the witness: it is what makes $x$ <i>a</i> composite of $f$ then $g$. The goal says Construct because one side is unknown; once you have built the triangle, the unknown is bound to $x$.",
    hints: ["Compose needs two arrows that meet at a dot.", "Compose: click $f$, then $g$."],
    win: ["You filled $\\Lambda^2_1$: $x$ is a composite of $f$ then $g$, witnessed by $\\sigma_1$."],
    term: "Composite",
    math: {
      say: "A 2-simplex $\\sigma$ of $X$ with $d_2\\sigma=f$, $d_0\\sigma=g$, $d_1\\sigma=h$ (a map $\\Delta^2\\to X$) witnesses $h$ as a composite of $f$ and $g$. Every inner horn $\\Lambda^2_1\\to X$ in a quasi-category extends to such a $\\sigma$.",
      proof: "Fill $\\Lambda^2_1\\to X$ on $(f,g)$: the filler $\\sigma_1$ has $d_1\\sigma_1=x$."
    }
  },

  chain: {
    title: "Composing a composite",
    bullets: ["Given arrows $f:a\\to b$, $g:b\\to c$, $h:c\\to d$.", "Construct a composite of a composite of $f,g$ with $h$."],
    explain: "A composite is an arrow like any other, so it can itself be composed. First construct a composite $x$ of $f$ and $g$, witnessed by $\\sigma_1=(f,g\\,;\\,x)$. It runs from $a$ to $c$, where $h$ begins, so $x$ and $h$ form another horn $\\Lambda^2_1$. Filling it gives an arrow $y$ from $a$ to $d$ and a triangle $\\sigma_2=(x,h\\,;\\,y)$. The triangle $\\sigma_2$ shows that $y$ is a composite of $x$ and $h$. It does not yet relate $y$ to a composite built in the other order, from $g$ and $h$ first.",
    hints: ["Join two neighbours first. Then use the result.", "Compose: $f$, $g$. Compose: $x$, $h$."],
    win: ["$y$ is a composite of $x$ and $h$, witnessed by $\\sigma_2$."],
    term: "Iterated composite",
    math: {
      say: "In a quasi-category every inner horn $\\Lambda^n_i\\to X$ ($0<i<n$) has a filler. Composition therefore iterates: composable $f,g,h$ give a composite $x$ of $(f,g)$, then a composite $y$ of $(x,h)$.",
      proof: "Fill $\\Lambda^2_1$ on $(f,g)$ for $\\sigma_1$, then again on $(x,h)$ for $\\sigma_2$."
    }
  },

  twoways: {
    title: "Composites are not unique",
    bullets: ["Given arrows $f:a\\to b$ and $g:b\\to c$.", "Construct two composites of $f$ then $g$."],
    explain: "Compose $f$ and $g$ twice. Each time the game fills the same horn $\\Lambda^2_1$, but a filler is a choice and not a computation: you obtain two arrows $x$ and $y$ with different witnesses, $\\sigma_1=(f,g\\,;\\,x)$ and $\\sigma_2=(f,g\\,;\\,y)$. Both are composites of $f$ then $g$, and nothing yet relates $x$ to $y$. Later you will prove they are homotopic, which is weaker than being equal. Until then, say “a composite” of $f$ then $g$, since no one of them is singled out.",
    hints: ["Fill the same horn $(f,g)$ a second time.", "Compose: $f$, $g$. Compose: $f$, $g$ again."],
    win: ["$x$ and $y$ are composites of $f$ then $g$, with witnesses $\\sigma_1$ and $\\sigma_2$."],
    term: "Non-unique composites",
    math: {
      say: "A filler of $\\Lambda^2_1\\to X$ is not unique: a composite of $f$ and $g$ is any edge $h$ carrying a 2-simplex with boundary $(f,g;h)$. Different fillers give different composites, unique only up to homotopy.",
      proof: "Fill $\\Lambda^2_1$ on $(f,g)$ twice, choosing fillers $\\sigma_1\\ne\\sigma_2$ with different $d_1$."
    }
  },

  /* ---------------- World 2: Tetrahedra ---------------- */

  tetra: {
    title: "A fourth face",
    bullets: ["Given $\\sigma_1=(f,g\\,;\\,x)$, $\\sigma_2=(g,h\\,;\\,y)$, $\\sigma_3=(x,h\\,;\\,z)$.", "Prove a triangle $(f,y\\,;\\,z)$ exists."],
    explain: "A tetrahedron has corners $0,1,2,3$ and four faces; $d_i$ is the face that omits corner $i$. Take the path $f,g,h$ with corners $a,b,c,d$. Then $d_3=(f,g\\,;\\,x)=\\sigma_1$, $d_0=(g,h\\,;\\,y)=\\sigma_2$ and $d_1=(x,h\\,;\\,z)=\\sigma_3$ are the three faces you have, and the missing $d_2=(f,y\\,;\\,z)$ is the one you want. The three known faces form the horn $\\Lambda^3_2$, which is inner, so it has a filler: a tetrahedron whose fourth face is the new triangle.",
    hints: ["Tetrahedron takes three triangles that fit together.", "Tetrahedron: path $f,g,h$; $d_3=\\sigma_1$, $d_0=\\sigma_2$, $d_1=\\sigma_3$. Fill."],
    win: ["Face $d_2$ is $(f,y\\,;\\,z)$: $z$ is also a composite of $f$ and $y$."],
    term: "Inner horn $\\Lambda^3_2$",
    math: {
      say: "A 3-simplex has faces $d_0,\\dots,d_3$. Given three of them forming an inner horn $\\Lambda^3_1$ or $\\Lambda^3_2$, a quasi-category supplies a 3-simplex $\\Delta^3\\to X$, and its remaining face is a new 2-simplex.",
      proof: "Fill $\\Lambda^3_2\\to X$ on $(a,b,c,d)$ with faces $d_3=\\sigma_1,d_0=\\sigma_2,d_1=\\sigma_3$; $d_2$ is the target."
    }
  },

  assoc: {
    title: "Two bracketings",
    bullets: ["Given arrows $f$, $g$, $h$ end to end.", "Relate the two ways of bracketing them by a triangle."],
    explain: "A path $f,g,h$ can be composed in two orders: $f$ with $g$ first and then with $h$, or $g$ with $h$ first and then $f$ with the result. In ordinary algebra the answers agree. Here they are different arrows, and what you prove is that they are related by a triangle. If $x$ is a composite of $f,g$, $y$ of $g,h$ and $z$ of $x,h$, then $(f,y\\,;\\,z)$ exists, so $z$ is also a composite of $f$ and $y$. The three constructions are three faces of a tetrahedron, and the fourth face is the relation. The two bracketings therefore agree up to a witness, a triangle, and not by an equation.",
    hints: ["Construct three composites, then use one tetrahedron.", "Compose: $f$, $g$. $g$, $h$. $x$, $h$. Tetrahedron: path $f,g,h$ with $\\sigma_1,\\sigma_2,\\sigma_3$. Fill."],
    win: ["$z$ is a composite of $x,h$ and also of $f,y$, by $\\sigma_4$."],
    term: "Associativity",
    math: {
      say: "Composites $x$ of $(f,g)$, $y$ of $(g,h)$ and $z$ of $(x,h)$ give an inner horn $\\Lambda^3_2$. Its filler yields a 2-simplex $(f,y;z)$: $z$ is also a composite of $f$ and $y$. Associativity holds up to homotopy.",
      proof: "Fill $\\Lambda^3_2$ on $(a,b,c,d)$ with $d_3=\\sigma_1$, $d_0=\\sigma_2$, $d_1=\\sigma_3$; $d_2=\\sigma_4=(f,y;z)$."
    }
  },

  unique: {
    title: "Two composites, one triangle",
    bullets: ["Construct two composites $x,y$ of $f$ then $g$.", "Prove a triangle $(x,1_c\\,;\\,y)$ exists: $x\\simeq y$."],
    explain: "Parallel arrows $x,y$ are <b>homotopic</b>, written $x\\simeq y$, if there is a triangle $(x,1_c\\,;\\,y)$ whose second leg is the degenerate arrow $1_c$. This is the whole definition; that homotopy is an equivalence relation has still to be proved. Here you construct two composites of $f,g$ and prove they are homotopic. The tetrahedron has corners $a,b,c,c$ and path $f,g,1_c$. Its faces $d_3=\\sigma_1$ and $d_2=\\sigma_2$ are your two witnesses, and $d_0=s_1g=(g,1_c\\,;\\,g)$ is degenerate, so it exists without being made. The missing face $d_1$ is the homotopy.",
    hints: ["The path ends in the degenerate arrow $1_c$.", "Compose: $f$, $g$ twice. Tetrahedron: path $f,g,1_c$; $d_3=\\sigma_1$, $d_2=\\sigma_2$. Fill."],
    win: ["The face $d_1$ is $(x,1_c\\,;\\,y)$, so $x\\simeq y$. New tool: Same."],
    term: "Homotopy",
    math: {
      say: "Edges $f,g:a\\to b$ are homotopic if some 2-simplex has boundary $(f,1_b;g)$. Any two composites $x,y$ of $(f,g)$ are homotopic: the horn $\\Lambda^3_1$ with faces $\\sigma_1,\\sigma_2,s_1(g)$ fills.",
      proof: "Fill $\\Lambda^3_1$ on $(a,b,c,c)$ with $d_3=\\sigma_1$, $d_2=\\sigma_2$, $d_0=s_1g$; $d_1$ is $(x,1_c;y)$."
    }
  },

  unit: {
    title: "Composing with an identity",
    bullets: ["Construct composites $x$ of $(1_a,f)$ and $y$ of $(f,1_b)$.", "Prove $x\\simeq f$ and $y\\simeq f$."],
    explain: "Every dot has a degenerate arrow: $1_a$ at $a$ and $1_b$ at $b$. They are arrows like any other, so they can be composed. Compose $1_a$ with $f$ for a composite $x$ with witness $\\sigma_1=(1_a,f\\,;\\,x)$. The tetrahedron on the path $1_a,f,1_b$ has corners $a,a,b,b$. It has $d_3=\\sigma_1$ and the free faces $d_2=s_0f=(1_a,f\\,;\\,f)$ and $d_0=s_1f$; its missing $d_1$ is $(x,1_b\\,;\\,f)$, which says $x\\simeq f$. The same argument on the path $f,1_b,1_b$, using $s_1f=(f,1_b\\,;\\,f)$, handles composing with $1_b$ on the right.",
    hints: ["Each tetrahedron here has degenerate faces.", "Compose: $1_a$, $f$. Tetrahedron: path $1_a,f,1_b$; $\\sigma_1,s_1f,s_0f$. Compose: $f$, $1_b$. Tetrahedron: path $f,1_b,1_b$; $\\sigma_3,s_01_b,s_1f$."],
    win: ["Both composites with an identity are homotopic to $f$."],
    term: "Unit law",
    math: {
      say: "Unit laws up to homotopy: a composite $x$ of $(1_a,f)$ and a composite $y$ of $(f,1_b)$ both satisfy $x\\simeq f\\simeq y$. The horns $\\Lambda^3_1$ with faces $\\sigma,s_0(f)$ resp. $\\sigma,s_1(f)$ fill.",
      proof: "Fill $\\Lambda^3_1$ on $(a,a,b,b)$ with $d_3=\\sigma_1$, $d_2=s_0f$; $d_1=(x,1_b;f)$. Repeat on $(a,b,b,b)$ with $\\sigma_3,s_1f$."
    }
  },

  bracket: {
    title: "Two routes round",
    bullets: ["Given $\\sigma_1=(g,h\\,;\\,y)$ and $\\sigma_3=(f,y\\,;\\,w)$.", "Construct $x$ for $f,g$, then $z$ for $x,h$; prove $z\\simeq w$."],
    explain: "You are given one bracketing: $w$ is a composite of $f$ and $y$, and $y$ is a composite of $g$ and $h$. You construct the other: $x$ for $f,g$, then $z$ for $x,h$. The tetrahedron on the path $f,g,h$ has $d_3=\\sigma_4=(f,g\\,;\\,x)$, $d_0=\\sigma_1$ and $d_1=\\sigma_5=(x,h\\,;\\,z)$, and its missing face is $(f,y\\,;\\,z)$. Now $z$ and $w$ are both composites of the same pair $f,y$, and an earlier result gives homotopy between any two such composites. The proof is therefore a tetrahedron followed by a tool.",
    hints: ["You already know how to compare two composites of one pair.", "Compose: $f$, $g$. $x$, $h$. Tetrahedron: path $f,g,h$ with $\\sigma_4,\\sigma_1,\\sigma_5$. Fill. Same: $\\sigma_6,\\sigma_3$."],
    win: ["$z$ and $w$ are composites of $f,y$, so $z\\simeq w$."],
    term: "Coherence of bracketing",
    math: {
      say: "Both $z$ and $w$ are composites of $(f,y)$, once the associativity 2-simplex $(f,y;z)$ exists. Any two composites of the same pair are homotopic, so $z\\simeq w$ using two inner horns.",
      proof: "Fill $\\Lambda^3_2$ on $(a,b,c,d)$ to get $(f,y;z)$; then fill $\\Lambda^3_1$ on $(a,b,d,d)$ with $s_1y$ to get $(z,1_d;w)$."
    }
  },

  /* ---------------- World 3: Homotopy ---------------- */

  symmetric: {
    title: "Symmetry is a theorem",
    bullets: ["Given $f\\simeq g$, witnessed by $\\sigma_1=(f,1_b\\,;\\,g)$.", "Prove $g\\simeq f$."],
    explain: "By definition $f\\simeq g$ means that a triangle $(f,1_b\\,;\\,g)$ exists, and the definition says nothing about the other direction. To obtain $(g,1_b\\,;\\,f)$ use the tetrahedron on the path $f,1_b,1_b$. Its corners $1,2,3$ all lie over $b$, so the edges $12$ and $23$ are two different copies of $1_b$. The faces are $d_3=\\sigma_1$, the degenerate $d_2=s_1f=(f,1_b\\,;\\,f)$ and the degenerate $d_0=s_01_b$. The missing face $d_1$ is the triangle you want, so symmetry follows from the inner horn $\\Lambda^3_1$.",
    hints: ["Three corners of the tetrahedron lie over the same dot.", "Tetrahedron: path $f,1_b,1_b$; $d_3=\\sigma_1$, $d_2=s_1f$, $d_0=s_01_b$. Fill."],
    win: ["$d_1$ is $(g,1_b\\,;\\,f)$, so $g\\simeq f$. New tool: Flip."],
    term: "Symmetry of $\\simeq$",
    math: {
      say: "Homotopy of edges is symmetric: from $\\sigma$ with boundary $(f,1_b;g)$, an inner horn $\\Lambda^3_1$ with faces $\\sigma$, $s_1f$, $s_0(1_b)$ fills, and $d_1$ has boundary $(g,1_b;f)$.",
      proof: "Fill $\\Lambda^3_1$ on $(a,b,b,b)$ with $d_3=\\sigma_1$, $d_2=s_1f$, $d_0=s_01_b$; $d_1$ is $g\\simeq f$."
    }
  },

  transitive: {
    title: "Transitivity is a theorem",
    bullets: ["Given $f\\simeq g$ and $g\\simeq h$, witnessed by $\\sigma_1,\\sigma_2$.", "Prove $f\\simeq h$."],
    explain: "A relation defined by a triangle must be shown to chain. Take the same path $f,1_b,1_b$. This time the known faces are $d_3=\\sigma_1=(f,1_b\\,;\\,g)$ and $d_1=\\sigma_2=(g,1_b\\,;\\,h)$, plus the degenerate $d_0=s_01_b$. They form the horn $\\Lambda^3_2$, and the missing face $d_2$ is $(f,1_b\\,;\\,h)$. Together with symmetry, and with the degenerate triangle $s_1f$ which shows $f\\simeq f$, this makes $\\simeq$ an equivalence relation on the arrows from $a$ to $b$.",
    hints: ["Use the same path as before, with different faces.", "Tetrahedron: path $f,1_b,1_b$; $d_3=\\sigma_1$, $d_1=\\sigma_2$. Fill."],
    win: ["$d_2$ is $(f,1_b\\,;\\,h)$, so $f\\simeq h$. New tool: Link."],
    term: "Transitivity of $\\simeq$",
    math: {
      say: "Homotopy is transitive: an inner horn $\\Lambda^3_2$ with faces for $f\\simeq g$, $g\\simeq h$ and $s_0(1_b)$ gives $f\\simeq h$. So homotopy is an equivalence relation, and edges modulo it form the homotopy category $hX$.",
      proof: "Fill $\\Lambda^3_2$ on $(a,b,b,b)$ with $d_3=\\sigma_1$, $d_1=\\sigma_2$, $d_0=s_01_b$; $d_2$ is $f\\simeq h$."
    }
  },

  whisker: {
    title: "Homotopy and composition",
    bullets: ["Given $f\\simeq k$ by $\\sigma_1$ and $x$ a composite of $f,g$ by $\\sigma_2$.", "Prove $x$ is also a composite of $k,g$."],
    explain: "Homotopic arrows ought to be interchangeable inside triangles, or the relation would be of little use. Here $\\sigma_1=(f,1_b\\,;\\,k)$ and $\\sigma_2=(f,g\\,;\\,x)$. The tetrahedron on the path $f,1_b,g$ has corners $a,b,b,c$, with faces $d_3=\\sigma_1$ and $d_2=\\sigma_2$, and the degenerate face $d_0=s_0g=(1_b,g\\,;\\,g)$. The missing face $d_1$ is $(k,g\\,;\\,x)$: replacing $f$ by $k$ keeps $x$ a composite. The three known faces form the inner horn $\\Lambda^3_1$. Swap in will do the same for any triangle.",
    hints: ["The corners are $a,b,b,c$; one face is degenerate.", "Tetrahedron: path $f,1_b,g$; $d_3=\\sigma_1$, $d_2=\\sigma_2$. Fill."],
    win: ["$d_1$ is $(k,g\\,;\\,x)$. New tool: Swap in."],
    term: "Compatibility with composition",
    math: {
      say: "If $f\\simeq k$ and $\\sigma$ witnesses $x$ as a composite of $(f,g)$, then $x$ is also a composite of $(k,g)$. The inner horn $\\Lambda^3_1$ on $(a,b,b,c)$ fills.",
      proof: "Fill $\\Lambda^3_1$ on $(a,b,b,c)$ with $d_3=\\sigma_1$, $d_2=\\sigma_2$, $d_0=s_0g$; $d_1$ is $(k,g;x)$."
    }
  },

  swap: {
    title: "Homotopy from either end",
    bullets: ["Given $f\\simeq g$, witnessed by $\\sigma_1=(f,1_b\\,;\\,g)$.", "Prove a triangle $(1_a,f\\,;\\,g)$ exists."],
    explain: "The definition of $f\\simeq g$ puts the degenerate arrow at the end: $(f,1_b\\,;\\,g)$. One can ask for it at the start instead, $(1_a,f\\,;\\,g)$. These are different triangles with different boundaries, and no definition says that they exist together. The tetrahedron on $1_a,f,1_b$, with corners $a,a,b,b$, has the degenerate faces $d_3=s_0f$ and $d_0=s_1f$, and $d_1=\\sigma_1$. The missing face $d_2$ is the triangle you want, from the inner horn $\\Lambda^3_2$.",
    hints: ["Two of the three known faces are degenerate.", "Tetrahedron: path $1_a,f,1_b$; $d_3=s_0f$, $d_0=s_1f$, $d_1=\\sigma_1$. Fill."],
    win: ["$d_2$ is $(1_a,f\\,;\\,g)$: the homotopy exists from either end."],
    term: "Two-sided homotopy",
    math: {
      say: "Edges are homotopic if some 2-simplex has boundary $(f,1_b;g)$. In a quasi-category this is equivalent to a 2-simplex with boundary $(1_a,f;g)$, via an inner horn $\\Lambda^3_2$.",
      proof: "Fill $\\Lambda^3_2$ on $(a,a,b,b)$ with $d_3=s_0f$, $d_0=s_1f$, $d_1=\\sigma_1$; $d_2$ has boundary $(1_a,f;g)$."
    }
  },

  relay: {
    title: "Chains of homotopies",
    bullets: ["Given $x_3\\simeq x_2\\simeq x_1\\simeq x_0$ and $\\sigma_5=(x_0,h\\,;\\,z)$.", "Prove $z$ is a composite of $x_3$ and $h$."],
    explain: "Each given homotopy points one way: $\\sigma_3$ relates $x_3$ to $x_2$, $\\sigma_2$ relates $x_2$ to $x_1$, $\\sigma_1$ relates $x_1$ to $x_0$. The triangle you have, $\\sigma_5$, has $x_0$ as its first leg, and the goal wants $x_3$ there. To substitute you need a homotopy $x_0\\simeq x_3$, so chain the three given ones into $x_3\\simeq x_0$ and reverse it. Link chains two homotopies end to end, Flip reverses one, and Swap in replaces a leg of a triangle. These are the theorems you proved, now used as tools.",
    hints: ["Chain the homotopies first, then reverse the result.", "Link: $\\sigma_3,\\sigma_2$. Link: $\\sigma_6,\\sigma_1$. Flip: $\\sigma_7$. Swap in: $\\sigma_8,\\sigma_5$."],
    win: ["$(x_3,h\\,;\\,z)$ exists: homotopic arrows are interchangeable in a triangle."],
    term: "Interchangeability",
    math: {
      say: "Homotopic edges are interchangeable in 2-simplices: $x_3\\simeq x_0$ and $(x_0,h;z)$ give $(x_3,h;z)$. Chaining three homotopies and reversing the result uses the symmetry and transitivity of $\\simeq$.",
      proof: "Link $\\sigma_3,\\sigma_2$ and $\\sigma_6,\\sigma_1$ (each $\\Lambda^3_2$); Flip $\\sigma_7$ ($\\Lambda^3_1$); Swap in on $\\sigma_5$ ($\\Lambda^3_1$)."
    }
  },

  fourway: {
    title: "Five dots, two routes",
    bullets: ["Given triangles $\\sigma_1,\\dots,\\sigma_4$ on arrows $f,g,h,i$ in a row.", "Construct a long composite via $x,h,i$; prove it is $\\simeq s$."],
    explain: "Two routes lead from $a$ to $e$. One is given: $s$ is a composite of $f$ and $u$. The other you build from $x$: a composite $z$ of $x,h$, and then a composite $w$ of $z,i$. To compare them, use two tetrahedra in turn. The first, on the path $x,h,i$, has faces $\\sigma_6=(x,h\\,;\\,z)$, $\\sigma_2$ and $\\sigma_7=(z,i\\,;\\,w)$, and produces $(x,y\\,;\\,w)$. The second, on $f,g,y$, uses $\\sigma_1$, $\\sigma_3$ and that new triangle, and produces $(f,u\\,;\\,w)$. Now $w$ and $s$ are both composites of $f$ and $u$. Each step needs a triangle that the previous one made, so plan the chain before you click.",
    hints: ["Two tetrahedra build a triangle on $f$ and $u$ ending at $w$.", "Compose: $x$, $h$. $z$, $i$. Tetrahedron: $x,h,i$ with $\\sigma_6,\\sigma_2,\\sigma_7$. Tetrahedron: $f,g,y$. Same: $\\sigma_9,\\sigma_4$."],
    win: ["$w$ and $s$ are composites of $f,u$, so $w\\simeq s$."],
    term: "Higher associativity",
    math: {
      say: "Two composites of the five-vertex chain are related by the associahedron relation: tetrahedra fill inner horns $\\Lambda^3_k$ to produce $(f,u;w)$, and uniqueness of composites up to homotopy gives $w\\simeq s$.",
      proof: "Fill $\\Lambda^3_2$ on $(a,c,d,e)$ for $(x,y;w)$, then $\\Lambda^3_2$ on $(a,b,c,e)$ for $(f,u;w)$; apply Same to $\\sigma_9,\\sigma_4$."
    }
  },

  /* ---------------- World 4: Undo everything ---------------- */

  undo: {
    title: "A left inverse",
    bullets: ["Given an arrow $f:a\\to b$.", "Construct a triangle $(f,?\\,;\\,1_a)$."],
    explain: "The arrows $f$ and $1_a$ both leave $a$, so they form the horn $\\Lambda^2_0$: a triangle with its second leg removed. This horn is outer, because the missing face is $d_0$, which omits corner 0 and lies at the end of the trip rather than in the middle. A general quasi-category need not fill it; in this world every horn fills. Solve fills it, giving an arrow $x$ from $b$ to $a$ and a triangle $\\sigma_1=(f,x\\,;\\,1_a)$. The arrow $x$ is a <b>left inverse</b> of $f$: following $f$ with $x$ is, by the triangle, the identity at $a$.",
    hints: ["The two arrows leave the same dot.", "Solve $f\\cdot ?=h$: click $f$, then $1_a$."],
    win: ["$x$ satisfies $(f,x\\,;\\,1_a)$: it is a left inverse of $f$."],
    term: "Outer horn $\\Lambda^2_0$",
    math: {
      say: "A horn $\\Lambda^2_0\\to X$ with edges $f$ and $1_a$ has a filler $\\sigma$ with $d_2\\sigma=f$, $d_1\\sigma=1_a$; then $x=d_0\\sigma$ is a left inverse of $f$. Kan complexes fill all $\\Lambda^n_k$, including outer horns.",
      proof: "Fill $\\Lambda^2_0$ on $(f,1_a)$: the filler $\\sigma_1$ has $d_0\\sigma_1=x$."
    }
  },

  divide: {
    title: "A missing first leg",
    bullets: ["Given $g:b\\to c$ and $h:a\\to c$.", "Construct a triangle $(?,g\\,;\\,h)$."],
    explain: "Now $g$ and $h$ end at the same dot $c$, so they form $\\Lambda^2_2$, the horn missing its first leg. Filling it gives an arrow $x:a\\to b$ and a triangle $\\sigma_1=(x,g\\,;\\,h)$: $h$ is a composite of $x$ then $g$. It is the mirror image of the previous level, and it resembles solving for an unknown factor: you know the second step $g$ and the whole trip $h$, and you recover the first step. Again a general quasi-category need not allow this; here every horn fills.",
    hints: ["The two arrows arrive at the same dot.", "Solve $?\\cdot g=h$: click $g$, then $h$."],
    win: ["$h$ is a composite of $x$ then $g$, witnessed by $\\sigma_1$."],
    term: "Outer horn $\\Lambda^2_2$",
    math: {
      say: "A horn $\\Lambda^2_2\\to X$ with edges $g:b\\to c$ and $h:a\\to c$ has a filler $\\sigma$ with $d_0\\sigma=g$, $d_1\\sigma=h$; $x=d_2\\sigma$ is a left divisor of $h$ by $g$. Kan complexes fill these.",
      proof: "Fill $\\Lambda^2_2$ on $(g,h)$; the filler $\\sigma_1$ has $d_2\\sigma_1=x$."
    }
  },

  inverses: {
    title: "Inverses on both sides",
    bullets: ["Given an arrow $f:a\\to b$.", "Construct a left and a right inverse, and prove they are homotopic."],
    explain: "A left inverse of $f$ is an arrow $x$ with a triangle $(f,x\\,;\\,1_a)$. A right inverse is an arrow $y$ with $(y,f\\,;\\,1_b)$. Two different Solve tools build them, from $\\Lambda^2_0$ and $\\Lambda^2_2$. They need not be literally equal, but one tetrahedron proves $y\\simeq x$. Its path is $y,f,x$, with corners $b,a,b,a$. The faces $d_3=\\sigma_2=(y,f\\,;\\,1_b)$ and $d_0=\\sigma_1=(f,x\\,;\\,1_a)$ are the two inverse triangles, and $d_1=s_0x$ is degenerate. An arrow with both inverses is an <b>isomorphism</b>, and its inverse is determined up to homotopy.",
    hints: ["One Solve for each side, then a tetrahedron.", "Solve $f\\cdot ?=h$: $f$, $1_a$. Solve $?\\cdot g=h$: $f$, $1_b$. Tetrahedron: path $y,f,x$; $\\sigma_2,\\sigma_1,s_0x$."],
    win: ["$y\\simeq x$: the left and right inverses are homotopic.", "So $f$ is an isomorphism."],
    term: "Isomorphism",
    math: {
      say: "In a Kan complex an edge $f$ has a left inverse $x$ ($\\Lambda^2_0$) and a right inverse $y$ ($\\Lambda^2_2$), and $y\\simeq x$ by an inner horn $\\Lambda^3_2$. So $f$ is an equivalence and $X$ is an $\\infty$-groupoid.",
      proof: "Fill $\\Lambda^3_2$ on $(b,a,b,a)$ with $d_3=\\sigma_2$, $d_0=\\sigma_1$, $d_1=s_0x$; $d_2$ is $y\\simeq x$."
    }
  },

  cancel: {
    title: "Cancelling an arrow",
    bullets: ["Given $\\sigma_1,\\dots,\\sigma_4$: $p$ and $q$ both compose with $h$ to $x$.", "Prove $f\\simeq k$."],
    explain: "Cancelling means that if two arrows give the same result after a further step, they were homotopic before it. Here $p$ is a composite of $f,g$ and $q$ of $k,g$, and both compose with $h$ to reach $x$. The tetrahedron on $p,1_c,h$ has the two $h$ triangles as faces $d_1=\\sigma_4$ and $d_2=\\sigma_3$, plus the degenerate $d_0=s_0h$. Its missing face is $d_3=(p,1_c\\,;\\,q)$, so $p\\simeq q$. The missing face omits corner 3, so the three known faces form the outer horn $\\Lambda^3_3$, which can be filled because every horn fills in this world. Swapping $q$ for $p$ in $\\sigma_1$ gives $(f,g\\,;\\,q)$, and a second outer tetrahedron on $f,1_b,g$ cancels $g$.",
    hints: ["Cancel one arrow at a time. The missing face is the last one.", "Tetrahedron: path $p,1_c,h$ with $\\sigma_4,\\sigma_3$. Swap in: $\\sigma_5,\\sigma_1$. Tetrahedron: $f,1_b,g$ with $\\sigma_2,\\sigma_6$."],
    win: ["$(p,1_c\\,;\\,q)$ cancels $h$ and $(f,1_b\\,;\\,k)$ cancels $g$: $f\\simeq k$."],
    term: "Cancellation",
    math: {
      say: "In a Kan complex, if $x$ is a composite of $(p,h)$ and of $(q,h)$ then $p\\simeq q$: right cancellation by $h$, via the outer horn $\\Lambda^3_3\\to X$. Applied twice it cancels $g$ as well.",
      proof: "Fill $\\Lambda^3_3$ on $(a,c,c,d)$ with $d_1=\\sigma_4$, $d_2=\\sigma_3$, $d_0=s_0h$; Swap in; fill $\\Lambda^3_3$ on $(a,b,b,c)$ for $f\\simeq k$."
    }
  },

  socks: {
    title: "Socks and shoes",
    bullets: ["Given left inverses $\\bar f,\\bar g$ of $f,g$, and $w$ composing $\\bar g,\\bar f$.", "Construct a composite $x$ of $f,g$ and prove $(x,w\\,;\\,1_a)$."],
    explain: "A left inverse of $f$ is an arrow $\\bar f$ with a triangle $(f,\\bar f\\,;\\,1_a)$. You are given such arrows for $f$ and $g$, and $w$ is a composite of $\\bar g$ and $\\bar f$ by $\\sigma_4$. To show that $w$ undoes a composite $x$ of $f,g$, cancel from the inside, as you take off shoes before socks. First show $(x,\\bar g\\,;\\,f)$: after $x$, following $\\bar g$ leaves $f$. Then follow with $\\bar f$. Each step is one tetrahedron using only inner horns. A given homotopy may be needed so that the triangle for $g$ matches the one the tetrahedron wants.",
    hints: ["Cancel $g$ with $\\bar g$ first, then $f$ with $\\bar f$.", "Compose: $f$, $g$. Swap in: $\\sigma_5,\\sigma_2$. Tetrahedron: $f,g,\\bar g$ with $\\sigma_6,\\sigma_7$. Tetrahedron: $x,\\bar g,\\bar f$ with $\\sigma_8,\\sigma_4,\\sigma_1$."],
    win: ["$(x,w\\,;\\,1_a)$ exists: $w$ undoes $x$, in reverse order."],
    term: "Inverse of a composite",
    math: {
      say: "If $f,g$ have left inverses $\\bar f,\\bar g$, then a composite $w$ of $(\\bar g,\\bar f)$ is a left inverse of a composite $x$ of $(f,g)$. Both steps use only inner horns $\\Lambda^3_1,\\Lambda^3_2$, so this holds in every quasi-category.",
      proof: "Fill an inner horn on $(a,b,c,b)$ to get $(x,\\bar g;f)$, then on $(a,c,b,a)$ to get $(x,w;1_a)$."
    }
  },

  /* ---------------- World 5: Nerves of categories ---------------- */

  nerve: {
    title: "The Rulebook",
    bullets: ["The Rulebook lists a composite for each pair.", "Construct a triangle $(f,g\\,;\\,?)$."],
    explain: "In a category composition is a function: each pair $f,g$ has exactly one composite. The Rulebook shows the table for this picture, and Compose follows it, so the triangle you make is $(f,g\\,;\\,h)$ with the long side already listed. The simplicial set built from a category in this way is its <b>nerve</b>: dots are objects, arrows are morphisms, triangles are composable pairs together with their composite, and higher simplices are longer chains. In a nerve every inner horn has exactly one filler.",
    hints: ["Look up the pair in the Rulebook.", "Compose: click $f$, then $g$."],
    win: ["The Rulebook gave $(f,g\\,;\\,h)$: $h$ is the composite of $f$ and $g$."],
    term: "Nerve of a category",
    math: {
      say: "The nerve $N_\\bullet(\\mathcal C)$ of a category has $n$-simplices the chains of $n$ composable morphisms. Every inner horn $\\Lambda^n_i\\to N_\\bullet(\\mathcal C)$ has a unique filler; for $n=2$ it is the composite $g\\circ f$.",
      proof: "The 2-simplex $(f,g;h)$ with $h=g\\circ f$ is the unique filler of $\\Lambda^2_1$."
    }
  },

  onlyone: {
    title: "Only one filler",
    bullets: ["The same Rulebook.", "Try to construct a second composite of $f$ and $g$."],
    explain: "In earlier worlds, composing the same pair twice gave two different arrows. In a nerve that cannot happen: the Rulebook has a single entry for $f,g$, so once the triangle $(f,g\\,;\\,h)$ exists a second attempt would have to produce the same triangle again, and the game refuses. This is what unique fillers mean: the horn $\\Lambda^2_1$ has exactly one filler. In a general quasi-category fillers are only unique up to homotopy, and uniqueness on the nose separates the nerve of a category from an arbitrary ∞-category. The goal is reached when the second attempt is refused.",
    hints: ["Compose $f,g$ once. Then try the same again.", "Compose: $f$, $g$. Compose: $f$, $g$ again."],
    win: ["The second attempt was refused: $\\Lambda^2_1$ has exactly one filler."],
    term: "Unique fillers",
    math: {
      say: "Unique inner horn fillers characterise nerves: $X\\cong N_\\bullet(\\mathcal C)$ iff each inner horn $\\Lambda^n_i\\to X$ has exactly one extension to $\\Delta^n$. In a general quasi-category fillers are only unique up to homotopy.",
      proof: "A second filler of $\\Lambda^2_1$ on $(f,g)$ is refused: it would equal $\\sigma_1$."
    }
  },

  nerve3: {
    title: "A blank Rulebook entry",
    bullets: ["One Rulebook entry, for $f$ and the composite of $g,h$, is blank.", "Prove a triangle exists there."],
    explain: "The Rulebook lists composites for $f,g$, for $g,h$ and for the composite of $f,g$ with $h$. It has no entry for $f$ together with the composite of $g,h$. In a category the missing entry follows from associativity. In a simplicial set it follows from a tetrahedron: compose what the Rulebook allows, then use Tetrahedron on the path $f,g,h$. Its three faces are the triangles you made, and the fourth face is the triangle that fills in the blank. In a nerve, associativity is recorded by this solid.",
    hints: ["Compose the listed entries. A tetrahedron fills the blank.", "Compose: $f$, $g$. $g$, $h$. $f\\!g$, $h$. Tetrahedron: path $f,g,h$ with $\\sigma_1,\\sigma_2,\\sigma_3$. Fill."],
    win: ["The tetrahedron's fourth face filled in the blank entry."],
    term: "Associativity in a nerve",
    math: {
      say: "A 3-simplex of $N_\\bullet(\\mathcal C)$ is a chain $a\\to b\\to c\\to d$ with all its composites; associativity $h\\circ(g\\circ f)=(h\\circ g)\\circ f$ says its faces are consistent. Inner horns $\\Lambda^3_k$ fill uniquely.",
      proof: "Fill $\\Lambda^3_2$ on $(a,b,c,d)$ with $d_3=\\sigma_1$, $d_0=\\sigma_2$, $d_1=\\sigma_3$; $d_2$ fills the blank."
    }
  },

  segalno: {
    title: "Nerve or not?",
    bullets: ["A nerve has exactly one triangle on every composable pair.", "Decide whether this picture is a nerve; justify a No with a pair."],
    explain: "The nerve of a category has, for every two arrows end to end, exactly one triangle with those two legs: not none, and not two. Equivalently, every inner horn $\\Lambda^2_1$ has exactly one filler. This picture has arrows $f$ and $g$ meeting at $b$ and no triangle at all, so the pair $f,g$ breaks the rule. Either declare the picture a nerve, or name a pair of arrows whose horn has no filler or more than one.",
    hints: ["Is there a triangle with legs $f$ and $g$?", "Not a nerve: pick $f$, then $g$."],
    win: ["No triangle has legs $f,g$: that horn $\\Lambda^2_1$ has no filler."],
    term: "Spine",
    math: {
      say: "$X\\cong N(\\mathcal C)$ for a category $\\mathcal C$ iff every inner horn has a unique filler; equivalently every spine $I^n\\to X$ extends uniquely to $\\Delta^n$ (the Segal condition).",
      proof: "The horn $\\Lambda^2_1\\to X$ given by $(f,g)$ has no filler."
    }
  },

  segalyes: {
    title: "One of each",
    bullets: ["Given $\\sigma_1=(f,g\\,;\\,h)$ on $a\\to b\\to c$.", "Decide whether this picture is a nerve."],
    explain: "Check every pair of arrows that meet end to end, identities included. Each dot has a degenerate arrow, and for every arrow $f$ the degenerate triangles $s_0f=(1_a,f\\,;\\,f)$ and $s_1f=(f,1_b\\,;\\,f)$ exist automatically, so a pair containing an identity already has its triangle. The only other pair is $f,g$, and it has exactly one triangle, $\\sigma_1$. Every pair has exactly one triangle, so every inner horn has exactly one filler and the picture is the nerve of the category $a\\to b\\to c$.",
    hints: ["List the pairs that meet end to end. There are few.", "Press It is a nerve."],
    win: ["Every pair has exactly one triangle: this is the nerve of $a\\to b\\to c$."],
    term: "Segal condition",
    math: {
      say: "This simplicial set is $\\Delta^2=N([2])$: every horn $\\Lambda^2_1\\to\\Delta^2$ has exactly one filler, as composition in the poset $[2]$ is unique.",
      proof: "The only non-degenerate horn is $(f,g)$, filled uniquely by $\\sigma_1$ with long side $h$."
    }
  },

  twofill: {
    title: "Too many fillers",
    bullets: ["Given $\\sigma_1=(f,g\\,;\\,x)$ and $\\sigma_2=(f,g\\,;\\,x')$.", "Decide whether this picture is a nerve."],
    explain: "A picture can fail to be a nerve because something is missing, and also because something is doubled. In a category, composing $f$ then $g$ has one answer. Here the pair $f,g$ has two triangles with different long sides $x$ and $x'$. In earlier worlds that was normal: such a picture can be a perfectly good ∞-category, with $x$ and $x'$ homotopic. It is therefore not the nerve of an ordinary category, because the horn $\\Lambda^2_1$ on $(f,g)$ has two fillers.",
    hints: ["Count the triangles whose legs are $f$ and $g$.", "Not a nerve: pick $f$, then $g$."],
    win: ["Two triangles on $f,g$: possibly an ∞-category, but not a nerve."],
    term: "Unique fillers",
    math: {
      say: "A quasi-category is the nerve of a category iff inner horns fill uniquely. Here $\\Lambda^2_1\\to X$ given by $(f,g)$ has two distinct fillers.",
      proof: "The 2-simplices $\\sigma_1,\\sigma_2$ both fill the horn $(f,g)$."
    }
  },

  hiddenhole: {
    title: "Find the missing triangle",
    bullets: ["Given $\\sigma_1,\\sigma_2,\\sigma_3$ on four dots and six arrows.", "Decide whether this picture is a nerve."],
    explain: "With more arrows there are more pairs to check, and composites are arrows too: a pair can start or end with one. List every pair that meets end to end and look for its triangle among $\\sigma_1=(f,g\\,;\\,x)$, $\\sigma_2=(g,h\\,;\\,y)$ and $\\sigma_3=(x,h\\,;\\,z)$, and among the degenerate triangles. A single pair with no triangle is enough to say No, and a single pair with two triangles is enough as well. Pairs involving $x$ and $y$ are the easiest to overlook.",
    hints: ["Pairs may involve the composites $x$ and $y$.", "Not a nerve: pick $f$, then $y$."],
    win: ["The pair $f,y$ has no triangle: its horn $\\Lambda^2_1$ has no filler."],
    term: "Inner horn",
    math: {
      say: "A nerve fills every spine uniquely, so with $(f,g;x)$, $(g,h;y)$, $(x,h;z)$ present the face $(f,y;z)$ is forced. Here the horn $\\Lambda^2_1$ on $(f,y)$ has no filler.",
      proof: "No 2-simplex has legs $(f,y)$: the horn $\\Lambda^2_1\\to X$ they define does not extend."
    }
  },

  quotient: {
    title: "A collapsed triangle",
    bullets: ["Given $\\sigma_1=(1_p,e\\,;\\,e')$, with $e,e':p\\to c$.", "Decide whether this picture is a nerve."],
    explain: "The degenerate triangle $s_0e=(1_p,e\\,;\\,e)$ exists in every simplicial set, so the pair $1_p,e$ already has one triangle. The given triangle $\\sigma_1=(1_p,e\\,;\\,e')$ is a second one, with a different long side $e'$. Hence the horn $\\Lambda^2_1$ on $(1_p,e)$ has two fillers and the picture is not a nerve. Geometrically $\\sigma_1$ is a full triangle with one side collapsed to a dot, the dot $p$. A triangle with an identity for a leg relates two different arrows, which a nerve never allows.",
    hints: ["The degenerate triangle on $1_p,e$ is always present.", "Not a nerve: click the dot $p$, then $e$."],
    win: ["Two triangles on $(1_p,e)$: the degenerate $s_0e$ and $\\sigma_1$."],
    term: "Collapsed triangle",
    math: {
      say: "$\\Delta^2/\\Delta^{\\{0,1\\}}$ is not a nerve: the horn $(1_p,e)$ has two fillers, the degenerate $s_0(e)$ and the image $\\sigma$ of the top simplex, with $d_1\\sigma=e'\\neq e$.",
      proof: "$s_0e$ has boundary $(1_p,e;e)$ and $\\sigma_1$ has boundary $(1_p,e;e')$: two fillers of one inner horn."
    }
  },

  /* ---------------- World 6: Bones ---------------- */

  disc: {
    title: "Attaching a cell",
    bullets: ["Given three dots $a,b,c$.", "Draw a loop of three arrows and glue one triangle onto it."],
    explain: "We now build shapes instead of filling horns. The <b>boundary</b> $\\partial\\Delta^2$ of a triangle is its three sides without the interior, and Draw arrow produces one when you connect $a,b,c$ in a loop. Gluing a triangle onto it attaches a 2-cell: the boundary of the new triangle lands on arrows you already have. No new arrow is made for the sides of the glued triangle, unlike in composing, where the long side is new. Formally, attaching a cell is the pushout of $\\partial\\Delta^2\\hookrightarrow\\Delta^2$ along the loop of three arrows.",
    hints: ["Glue triangle needs three arrows that close up.", "Draw arrow: $a,b$. $b,c$. $a,c$. Glue triangle: the three arrows."],
    win: ["You drew $\\partial\\Delta^2$, then glued a 2-cell onto it."],
    term: "Attaching a cell",
    math: {
      say: "Given $\\partial\\Delta^2\\to X$, the pushout $X\\sqcup_{\\partial\\Delta^2}\\Delta^2$ attaches a 2-cell to $X$ along it. Here $X=\\mathrm{sk}_1\\Delta^2=\\partial\\Delta^2$ and the loop is the identity map.",
      proof: "Pushout along $\\partial\\Delta^2\\hookrightarrow\\Delta^2$ on the loop of the three drawn edges gives $\\Delta^2$."
    }
  },

  sphere: {
    title: "Two cells, one boundary",
    bullets: ["Given the hollow triangle $f,g,h$.", "Make it carry two triangles."],
    explain: "Glue a second triangle over the same boundary. The two triangles are different 2-simplices with identical sides, so in a simplicial set a boundary can have more than one filler. The result is hollow like the surface of a ball: a 2-sphere, topologically two discs glued along their common circle. Compare this with a horn, which also had many fillers: a cell is glued along a whole boundary, while a horn filler is attached along all but one of its faces.",
    hints: ["Glue onto the same three arrows twice.", "Glue triangle: $f,g,h$. Glue triangle: $f,g,h$ again."],
    win: ["Two 2-cells on one boundary form a 2-sphere."],
    term: "2-sphere",
    math: {
      say: "Attaching two 2-cells along the same map $\\partial\\Delta^2\\to X$ gives $\\Delta^2\\sqcup_{\\partial\\Delta^2}\\Delta^2$, a simplicial model of the 2-sphere: its geometric realisation is homotopy equivalent to $S^2$.",
      proof: "Two pushouts of $\\partial\\Delta^2\\hookrightarrow\\Delta^2$ along the same loop $(f,g,h)$."
    }
  },

  peel: {
    title: "Skeleta",
    bullets: ["Given a solid tetrahedron with its faces and six arrows.", "End with the six arrows and exactly one triangle."],
    explain: "Peel removes the top layer of simplices. The first Peel deletes the 3-simplex and leaves its four faces, which is the 2-skeleton $\\mathrm{sk}_2\\Delta^3=\\partial\\Delta^3$. The second Peel deletes the triangles and leaves the 1-skeleton: six arrows on four dots. Then glue one triangle back along a closed loop of three arrows. A skeleton forgets everything above a chosen dimension, and a cell puts back one simplex along its boundary.",
    hints: ["Peel twice, then glue one triangle.", "Peel. Peel. Glue triangle: $f,g,x$."],
    win: ["Skeleta keep the lower layers; a cell restores one simplex."],
    term: "Skeleton",
    math: {
      say: "$\\mathrm{sk}_n$ forgets simplices of dimension $>n$: $\\mathrm{sk}_2\\Delta^3=\\partial\\Delta^3$, and $\\mathrm{sk}_1\\Delta^3$ is its six edges. Re-attaching one 2-cell along $\\partial\\Delta^2\\hookrightarrow\\Delta^2$ restores one face.",
      proof: "Take $\\mathrm{sk}_2$, then $\\mathrm{sk}_1$, then glue one $\\Delta^2$ along its boundary."
    }
  },

  hollowtet: {
    title: "A hollow tetrahedron",
    bullets: ["Given six arrows on four dots.", "Glue the four faces of a tetrahedron and nothing inside."],
    explain: "The boundary of a tetrahedron is four triangles glued along their shared edges, with no solid inside. A face needs three arrows that close up: two end to end and one going straight across. Among the twenty ways to choose three of the six arrows, only four close up in this way. The result is $\\partial\\Delta^3$, which is topologically a sphere. The goal checks both that the four faces are present and that there is no tetrahedron.",
    hints: ["A face is two arrows end to end plus the arrow across.", "Glue triangle: $f,g,x$. $g,h,y$. $x,h,z$. $f,y,z$."],
    win: ["$\\partial\\Delta^3$: four faces glued along six edges."],
    term: "Boundary $\\partial\\Delta^3$",
    math: {
      say: "$\\partial\\Delta^n$ is the union of the $n+1$ faces of $\\Delta^n$ glued along their pairwise intersections. For $n=3$: four 2-simplices along six edges, and $|\\partial\\Delta^3|\\cong S^2$.",
      proof: "Attach four 2-cells to $\\mathrm{sk}_1\\Delta^3$ along the four subcomplexes $\\partial\\Delta^2$ spanned by three vertices."
    }
  },

  fillin: {
    title: "The coskeleton",
    bullets: ["A hollow triangle: three arrows and no face.", "Fill it in."],
    explain: "Peel forgets everything above a dimension and leaves a skeleton. The <b>coskeleton</b> $\\mathrm{cosk}_1$ goes the other way: for every boundary that is present with nothing inside it, it adds exactly one simplex, filling the shape in the only possible way. No choice is involved, which is why this is one click. Here the boundary of a triangle is present, so $\\mathrm{cosk}_1$ adds the triangle $(f,g\\,;\\,h)$.",
    hints: ["There is only one tool.", "Press Fill in."],
    win: ["The coskeleton filled the hollow triangle with one 2-simplex."],
    term: "Coskeleton",
    math: {
      say: "$(\\mathrm{cosk}_nX)_m=\\mathrm{Hom}(\\mathrm{sk}_n\\Delta^m,X)$: an $m$-simplex of the coskeleton is a compatible family of its faces of dimension $\\le n$. $\\mathrm{cosk}_n$ is right adjoint to $\\mathrm{sk}_n$.",
      proof: "$\\mathrm{cosk}_1(\\partial\\Delta^2)$ has a unique 2-simplex with the given boundary, so it is $\\Delta^2$."
    }
  },

  rebuild: {
    title: "Wire frame to shell",
    bullets: ["Given six arrows on four dots.", "End with the four faces of a tetrahedron and no solid."],
    explain: "Gluing the four faces took four careful moves. Fill in does all of them at once, but it does not stop there: once the four faces exist, the boundary of the tetrahedron is itself a hollow shape and the coskeleton fills it. It therefore produces more than the boundary alone. Combine it with the tool that removes the top layer. Skeleton and coskeleton are opposite operations, and a useful shape often lies between them: $\\mathrm{sk}_2\\mathrm{cosk}_1$ applied to the six arrows is the boundary $\\partial\\Delta^3$.",
    hints: ["Fill in adds too much. Peel removes the top layer.", "Press Fill in. Then Peel."],
    win: ["Fill in, then Peel once: the boundary of a tetrahedron."],
    term: "$\\mathrm{sk}_2\\,\\mathrm{cosk}_1$",
    math: {
      say: "$\\mathrm{cosk}_1(\\mathrm{sk}_1\\Delta^3)=\\Delta^3$, since nerves of posets are 1-coskeletal, and $\\mathrm{sk}_2\\Delta^3=\\partial\\Delta^3$. So $\\mathrm{sk}_2\\mathrm{cosk}_1\\mathrm{sk}_1\\Delta^3=\\partial\\Delta^3$.",
      proof: "The coskeleton adds the four 2-simplices and the 3-simplex; the 2-skeleton discards the 3-simplex."
    }
  },

  /* ---------------- World 7: Possible or not? ---------------- */

  spine: {
    title: "Fill the spine",
    bullets: ["Given arrows $f,g,h$ in a row.", "Build the full tetrahedron on them, or say it can't be done."],
    explain: "From here on some goals are possible and some are not, and you must decide which. If you decide a goal is impossible, press This can't be done and build a model that shows it. The three arrows $f,g,h$ are the <b>spine</b> of a tetrahedron: its edges $01$, $12$ and $23$. The question is whether inner horn fillings can build the whole solid on them. They can, by the assembly of Two bracketings. Inclusions built from inner horns never change the shape, which is why a spine always extends to a full simplex in a quasi-category.",
    hints: ["You solved a version of this earlier.", "Compose: $f$, $g$. $g$, $h$. $x$, $h$. Tetrahedron: path $f,g,h$ with $\\sigma_1,\\sigma_2,\\sigma_3$. Fill."],
    win: ["Possible: inner horns built the whole tetrahedron on its spine."],
    term: "Inner anodyne",
    math: {
      say: "The spine inclusion $\\mathrm{Spine}^3\\hookrightarrow\\Delta^3$ is inner anodyne: it lies in the saturated class generated by inner horn inclusions $\\Lambda^n_i\\hookrightarrow\\Delta^n$. So it has the left lifting property against inner fibrations.",
      proof: "Fill $\\Lambda^2_1$ three times for the composites; then $\\Lambda^3_2$ gives the 3-simplex on $(a,b,c,d)$."
    }
  },

  nofill: {
    title: "A closed loop",
    bullets: ["Given a loop $f,g,h$ with no triangle.", "Prove $(f,g\\,;\\,h)$ exists, or say it can't be done."],
    explain: "The three arrows form a closed loop: $f$ then $g$, and $h$ straight across. Every tool here fills a <i>horn</i>, a shape with exactly one face missing. The loop is the boundary $\\partial\\Delta^2$, which lacks its whole interior and so is not a horn. Compose on $f,g$ adds a new arrow with a triangle on it and leaves $h$ without one. If you decide that $(f,g\\,;\\,h)$ cannot be built, press the button and show it with a model: a quasi-category that contains the loop but has no such triangle.",
    hints: ["Check whether a horn with long side $h$ is present.", "Press This can't be done. Build the triangle model."],
    win: ["Impossible: horn fillings cannot fill a hole."],
    term: "Not anodyne",
    math: {
      say: "$\\partial\\Delta^2\\hookrightarrow\\Delta^2$ is not anodyne: anodyne maps are weak homotopy equivalences, but $|\\partial\\Delta^2|\\simeq S^1$ while $|\\Delta^2|$ is contractible. Horn fillings cannot cap a hollow triangle.",
      proof: "Every horn move adds a new edge; none attaches a 2-cell to the existing $h$."
    }
  },

  squarehole: {
    title: "Two routes, one composite?",
    bullets: ["Given routes $f,g$ and $u,v$ from $a$ to $d$.", "Prove one arrow composes both pairs, or say it can't be done."],
    explain: "Two routes, $f$ then $g$ and $u$ then $v$, both go from $a$ to $d$. Composing each pair gives an arrow, and the goal asks for a single arrow that is a composite of both pairs. Nothing joins the routes: the square is a closed loop with no triangle across it. Horn fillings add faces to rims that exist and never close a hole. So the two composites are different arrows. To prove this impossible, exhibit a model in which the four arrows exist but no arrow is a composite of both pairs.",
    hints: ["Compose each route and compare the results.", "Press This can't be done. Build the square model."],
    win: ["Impossible: nothing fills the hole between the two routes."],
    term: "A hole",
    math: {
      say: "With no 2-simplex joining the routes $(f,g)$ and $(u,v)$, composites of the two routes are different edges; no horn $\\Lambda^n_k$ in this simplicial set relates them, since fillers only add simplices over existing boundaries.",
      proof: "Every filler creates a new edge for each composite; none identifies a composite of $f,g$ with one of $u,v$."
    }
  },

  parallel: {
    title: "Two lone arrows",
    bullets: ["Given parallel arrows $f,g:a\\to b$ and nothing else.", "Prove $f\\simeq g$, or say it can't be done."],
    explain: "Two parallel arrows are not homotopic merely because they share endpoints. By definition $f\\simeq g$ needs a triangle $(f,1_b\\,;\\,g)$, and no tool creates one from nothing: every move starts from triangles that already exist, and there are none. To show impossibility, exhibit a quasi-category with two parallel arrows that are not homotopic. Compare with the Homotopy world, where the first triangle was always given.",
    hints: ["Check whether any triangle exists to start from.", "Press This can't be done. Build the parallel model."],
    win: ["Impossible: nothing relates arrows that share no triangle."],
    term: "No free homotopy",
    math: {
      say: "Parallel edges $f,g:a\\to b$ need not be homotopic: the simplicial set with just these two edges has no 2-simplex with boundary $(f,1_b;g)$, and horn fillings never create a relation between existing edges.",
      proof: "Each horn move creates a new edge or a degenerate cell; none joins $f$ and $g$."
    }
  },

  almostring: {
    title: "Almost a loop",
    bullets: ["Given $\\sigma_1=(f,g\\,;\\,x)$, $x\\simeq m$ and $h\\simeq m$.", "Prove $(f,g\\,;\\,h)$ exists, or say it can't be done."],
    explain: "This resembles the closed loop of the earlier level: arrows $f,g,h$ with no triangle on $h$. The difference is the two homotopies, $\\sigma_2=(x,1_c\\,;\\,m)$ and $\\sigma_3=(h,1_c\\,;\\,m)$, where $x$ is a composite of $f,g$. The loop is filled up to homotopy. Replace $x$ by $m$ in $\\sigma_1$ with Swap in, reverse $h\\simeq m$ with Flip so that it reads $m\\simeq h$, and replace $m$ by $h$. Each of these is a theorem you already own.",
    hints: ["Move from $x$ to $m$, then from $m$ to $h$.", "Swap in: $\\sigma_2,\\sigma_1$. Flip: $\\sigma_3$. Swap in: $\\sigma_5,\\sigma_4$."],
    win: ["Possible: $(f,g\\,;\\,h)$ exists, since $h\\simeq m$ and $x\\simeq m$."],
    term: "Swapping homotopic arrows",
    math: {
      say: "If $x\\simeq m$ and $h\\simeq m$, and $\\sigma$ has $d_1\\sigma=x$, then $h$ replaces $x$ in $\\sigma$: homotopic edges are exchangeable in a 2-simplex, via inner horns $\\Lambda^3_1,\\Lambda^3_2$.",
      proof: "Swap in $\\sigma_2$ into $\\sigma_1$ for $(f,g;m)$; Flip $\\sigma_3$ for $(m,1_c;h)$; Swap in again for $(f,g;h)$."
    }
  },

  wedge: {
    title: "Two prepared tetrahedra",
    bullets: ["Given $\\sigma_1,\\sigma_2,\\sigma_3$ on a path $f,g,h,i$.", "Construct composites $y$ of $g,h$ and $w$ of $h,i$; prove $(f,y\\,;\\,z)$ and $(x,w\\,;\\,t)$."],
    explain: "The given triangles are $\\sigma_1=(f,g\\,;\\,x)$, $\\sigma_2=(x,h\\,;\\,z)$ and $\\sigma_3=(z,i\\,;\\,t)$. They are faces of two tetrahedra, on the paths $f,g,h$ and $x,h,i$. Each tetrahedron lacks one triangle: a composite of $g,h$ for the first and of $h,i$ for the second. With that composite built, three faces of each tetrahedron are present, forming the horn $\\Lambda^3_2$, and the fourth face is the triangle you are asked for. So the goal is possible: two inner horn fillings, each prepared by one composition.",
    hints: ["Prepare each tetrahedron with one composition.", "Compose: $g$, $h$. Tetrahedron: $f,g,h$ with $\\sigma_1,\\sigma_4,\\sigma_2$. Compose: $h$, $i$. Tetrahedron: $x,h,i$ with $\\sigma_2,\\sigma_6,\\sigma_3$."],
    win: ["Possible: two inner horns, each filled after one composition."],
    term: "Inner horn $\\Lambda^3_2$",
    math: {
      say: "Two 2-simplices sharing the edge $x$ extend, after composing $g,h$ to $y$, to a horn $\\Lambda^3_2\\to X$; the same holds for $h,i$ and $w$. The inclusion is inner anodyne, so each horn extends over $\\Delta^3$.",
      proof: "Fill $\\Lambda^2_1$ on $(g,h)$, then $\\Lambda^3_2$ on $(a,b,c,d)$ for $(f,y;z)$; repeat with $(h,i)$ and $(a,c,d,e)$ for $(x,w;t)$."
    }
  },

  opensquare: {
    title: "An open square",
    bullets: ["Given $f:a\\to b$, $v:b\\to d$ and $u:a\\to c$.", "Construct $(f,v\\,;\\,x)$ and $(u,w\\,;\\,x)$, or say it can't be done."],
    explain: "This resembles the boss that follows, where the square does close. Here the world allows fewer fillings. Closing the square needs an arrow $w$ from $c$ to $d$ that is the <i>second</i> leg of a triangle $(u,w\\,;\\,x)$, whose first leg $u$ and long side $x$ are known: an outer horn $\\Lambda^2_0$, and a general quasi-category need not fill it. To prove impossibility, find a small quasi-category containing the three given arrows in which no arrow from $c$ to $d$ exists at all.",
    hints: ["Ask which horn would produce the missing arrow.", "Press This can't be done. Build the open-square model."],
    win: ["Impossible: the missing arrow comes from an outer horn, which need not fill."],
    term: "Outer horn $\\Lambda^2_0$",
    math: {
      say: "The inclusion $(\\Delta^1\\times\\{0\\})\\cup(\\partial\\Delta^1\\times\\Delta^1)\\hookrightarrow\\Delta^1\\times\\Delta^1$ is left anodyne but not inner anodyne: a quasi-category need not extend it.",
      proof: "Counter-model: the nerve of the poset $0<1<3$, $0<2$. It contains the three sides and has no edge $2\\to 3$."
    }
  },

  square: {
    title: "A square and a prism",
    bullets: ["Given $f,v,u,t$ on five dots; every horn fills.", "Construct and prove the five triangles listed in the goal."],
    explain: "Every horn fills here, outer horns included. First compose $f$ and $v$ for a diagonal $x$ of the first square. Then use Solve to find its fourth side $y$, with a triangle $(u,y\\,;\\,x)$: an outer horn $\\Lambda^2_0$. The second square lies on top of the first. Compose $y$ with $t$ and $x$ with $t$ to get its two new sides, $z$ and $w$. Finally one tetrahedron on the path $u,y,t$ makes the two new triangles agree, giving $(u,z\\,;\\,w)$. Each step prepares the faces of the next.",
    hints: ["Build the first square, then extend it by $t$ along both sides.", "Compose: $f$, $v$. Solve $f\\cdot ?=h$: $u$, $x$. Compose: $y$, $t$. $x$, $t$. Tetrahedron: $u,y,t$."],
    win: ["Possible: horns of both kinds filled the square and the prism above it."],
    term: "Anodyne map",
    math: {
      say: "The square $\\Delta^1\\times\\Delta^1$ is two 2-simplices glued along the diagonal; the prism $\\Delta^1\\times\\Delta^2$ is three tetrahedra. Each is built by an inner horn followed by outer horns, which fill in a Kan complex.",
      proof: "Fill $\\Lambda^2_1$ on $(f,v)$, $\\Lambda^2_0$ on $(u,x)$, $\\Lambda^2_1$ twice with $t$, then $\\Lambda^3_2$ on $(a,c,d,e)$ for $(u,z;w)$."
    }
  },

  /* ---------------- World 9: Lifting ---------------- */

  liftpath: {
    title: "Lifting a path",
    bullets: ["One dot $x$ lies over $\\bar a$ in the shadow $S$.", "Construct a triangle over $S$'s triangle $(\\bar f,\\bar g\\,;\\,\\bar x)$, starting at $x$."],
    explain: "A <b>map</b> $p:X\\to S$ sends dots, arrows and triangles of $X$ to those of $S$, compatibly with faces, and the shadow $S$ is fixed. This map is a <b>left fibration</b>: for every arrow of $S$ and every dot of $X$ over its source, there is an arrow of $X$ over it starting at that dot. Lift arrow does this. The lift ends at a new dot, and you do not choose where. Lift $\\bar f$ from $x$, lift $\\bar g$ from the dot where you landed, and compose the two lifts. That composite lies over the triangle $(\\bar f,\\bar g\\,;\\,\\bar x)$ of $S$.",
    hints: ["Lift arrow twice, then compose the two lifts.", "Lift arrow: $x$, $\\bar f$. Lift arrow: new dot, $\\bar g$. Compose: the lifts."],
    win: ["A path of $S$ lifted to $X$, with a triangle over $S$'s triangle."],
    term: "Left fibration",
    math: {
      say: "$p:X\\to S$ is a left fibration if it has the right lifting property against $\\Lambda^n_i\\hookrightarrow\\Delta^n$ for $0\\le i<n$. The case $n=1$: every edge of $S$ lifts with a prescribed source.",
      proof: "Lift $\\Lambda^1_0\\hookrightarrow\\Delta^1$ twice, then the inner horn $\\Lambda^2_1$ over the 2-simplex $(\\bar f,\\bar g;\\bar x)$ of $S$."
    }
  },

  backfill: {
    title: "A missing first leg, lifted",
    bullets: ["$g$ and $k$ lie over $\\bar g$ and $\\bar x$ in $S$.", "Construct $(?,g\\,;\\,k)$ over $(\\bar f,\\bar g\\,;\\,\\bar x)$, or say it can't be done."],
    explain: "Downstairs the triangle $(\\bar f,\\bar g\\,;\\,\\bar x)$ is complete. Upstairs you have the second leg $g$ and the long side $k$ and want the first leg: that is the horn $\\Lambda^2_2$. A left fibration lifts horns $\\Lambda^n_i$ with $i<n$, so $\\Lambda^2_2$ is not covered. Lifting $\\bar f$ by itself begins at a dot you choose and lands on a dot you do not, and that dot need not be the one you want. Whether the goal is possible depends on the kind of map; the same picture over a different kind of map can have the opposite answer.",
    hints: ["Lift $\\bar f$ from $x$ and look at where it ends.", "Press This can't be done. The lift lands on a new dot."],
    win: ["A left fibration chooses where a lift starts, never where it ends."],
    term: "No lift of $\\Lambda^2_2$",
    math: {
      say: "A left fibration need not lift $\\Lambda^2_2\\hookrightarrow\\Delta^2$. Counter-model: the left fibration over $\\Delta^2$ classified by a functor $F$ with $F(\\bar b)=\\{y,y'\\}$ and $F(\\bar f)(x)=y'$ has no edge $x\\to y$.",
      proof: "Every move here is a left-anodyne extension, so it maps to the counter-model; there the only lift of $\\bar f$ from $x$ ends at $y'\\ne y$."
    }
  },

  prism: {
    title: "Closing a lifted square",
    bullets: ["Three sides of a square; all of the square exists in $S$.", "Construct $(f,v\\,;\\,x)$ and $(u,w\\,;\\,x)$ over the two triangles of $S$."],
    explain: "The shadow is a full commuting square: two triangles sharing a diagonal. Upstairs the bottom side is missing. The first triangle is an inner horn $\\Lambda^2_1$, which lifts over any of these maps. The second has its first leg $u$ and long side $x$ and misses its second leg: the horn $\\Lambda^2_0$, which is exactly what a left fibration adds. There is a tempting wrong move: lifting the bottom arrow by itself lands on a new dot, and the square never closes.",
    hints: ["Build the diagonal first. Then solve for the bottom side.", "Compose: $f$, $v$. Solve $f\\cdot ?=h$: $u$, then the diagonal $x$."],
    win: ["A left fibration lifts horns that know their first leg."],
    term: "Left horn $\\Lambda^2_0$",
    math: {
      say: "The inclusion $(\\Delta^1\\times\\{0\\})\\cup(\\partial\\Delta^1\\times\\Delta^1)\\hookrightarrow\\Delta^1\\times\\Delta^1$ is left anodyne: a pushout of $\\Lambda^2_1$ followed by a pushout of $\\Lambda^2_0$. So it lifts against any left fibration.",
      proof: "Lift $\\Lambda^2_1$ over $(\\bar f,\\bar v,\\bar x)$ for the diagonal, then $\\Lambda^2_0$ over $(\\bar u,\\bar w,\\bar x)$ for the missing side."
    }
  },

  inneronly: {
    title: "Invertible below only",
    bullets: ["$\\bar f$ has an inverse in $S$; this map is only an inner fibration.", "Construct $(f,?\\,;\\,1_x)$, or say it can't be done."],
    explain: "Downstairs $\\bar f$ is an isomorphism: $\\bar g$ undoes it on both sides. Whether $f$ is then an isomorphism upstairs depends on the map. An inner fibration lifts inner horns only, and an inverse of $f$ is the missing side of an <i>outer</i> horn $\\Lambda^2_0$. Compare this level with the next: the board is identical and only the kind of map changes, from inner fibration to left fibration.",
    hints: ["An inverse is an outer horn. Check what this map lifts.", "Press This can't be done. The reason is the licence of the map."],
    win: ["Lying over an isomorphism does not make an arrow invertible."],
    term: "Not conservative",
    math: {
      say: "An inner fibration need not be conservative. $\\Delta^1\\to N(J)$, $J$ the walking isomorphism, is an inner fibration (the nerve of a functor) sending the non-invertible edge to an isomorphism.",
      proof: "$X=\\Delta^1$ is a counter-model: all inner horns lift against $\\Delta^1\\to N(J)$, yet no edge $y\\to x$ exists."
    }
  },

  conservative: {
    title: "Invertible above too",
    bullets: ["The same board, but now the map is a left fibration.", "Construct a left inverse of $f$ and prove it is also a right inverse."],
    explain: "Over a left fibration the inverse can be built. Downstairs, $(\\bar f,\\bar g\\,;\\,1)$ is a triangle. Upstairs you know its first leg $f$ and its long side $1_x$: the horn $\\Lambda^2_0$, whose filler gives a new arrow, a left inverse of $f$. For the other side look at the tetrahedron on the path $f$, the new arrow, $f$: its missing face is again the first one, $d_0$, and a left fibration lifts that too. A map is <b>conservative</b> when an arrow over an isomorphism must itself be an isomorphism. Left fibrations are conservative.",
    hints: ["Solve for a left inverse. Then a tetrahedron on $f$, it, $f$.", "Solve $f\\cdot ?=h$: $f$, $1_x$. Tetrahedron: path $f$, new arrow, $f$; $\\sigma_1,s_0f,s_1f$."],
    win: ["Left fibrations are conservative."],
    term: "Conservative",
    math: {
      say: "Left fibrations are conservative: if $p(f)$ is an isomorphism in $S$ then $f$ is an isomorphism in $X$. The inverse is the lift of $\\Lambda^2_0$, and it is two-sided by a lift of $\\Lambda^3_0$.",
      proof: "Lift $\\Lambda^2_0$ over $(\\bar f,\\bar g;1)$ for $g$; lift $\\Lambda^3_0$ on $(x,y,x,y)$ with faces $\\sigma_1$, $s_0f$, $s_1f$: the new face is $(g,f;1_y)$."
    }
  },

  twolifts: {
    title: "Two lifts, one destination",
    bullets: ["Two routes lift $\\bar x$ from $x$: $f$ then $g$, and $k'$ directly.", "Prove their endpoints $z$ and $z'$ are isomorphic."],
    explain: "Lifts land on fresh dots, so two ways of lifting the same arrow can end at different dots. They should still agree up to isomorphism. Compose $f$ and $g$ for the long route. Both it and $k'$ lie over $\\bar x$ and start at $x$, so a left fibration lets you solve for a new arrow between their ends, lying over an identity. Then prove that this arrow is invertible, as in the last level.",
    hints: ["Solve for an arrow from $z$ to $z'$, then invert it.", "Compose: $f$, $g$. Solve: the long route, $k'$. Solve: that arrow, $1_z$. Tetrahedron."],
    win: ["Any two lifts of one arrow end at isomorphic dots."],
    term: "Uniqueness of lifts",
    math: {
      say: "For a left fibration $p$, lifts of an edge with a fixed source are unique up to isomorphism in the fibre: the fibres are Kan complexes, and $\\Lambda^2_0$, $\\Lambda^3_0$ lift over degenerate simplices.",
      proof: "Lift $\\Lambda^2_1$; lift $\\Lambda^2_0$ over $s_1(\\bar x)$ for $m$; lift $\\Lambda^2_0$ over $s_0s_0(\\bar c)$ for its inverse; lift $\\Lambda^3_0$ on $(z,z',z,z')$."
    }
  },

  /* ---------------- World 10: Isomorphisms ---------------- */

  oneway: {
    title: "One way only",
    bullets: ["Given one arrow $f:a\\to b$.", "Construct $(f,?\\,;\\,1_a)$, or say it can't be done."],
    explain: "Every move here fills an inner horn: a gap in the middle of a trip. Starting from one arrow $a\\to b$ such moves can only produce arrows that follow existing ones forwards: arrows $a\\to a$, $a\\to b$ and $b\\to b$. An arrow from $b$ back to $a$ never appears, so $f$ has no left inverse. To prove the goal impossible, exhibit a quasi-category containing $f$ with no arrow from $b$ to $a$. The smallest one is the nerve of the poset $0<1$. It shows that not every arrow of a quasi-category can be undone.",
    hints: ["Check which way each new arrow points.", "Press This can't be done. Build the arrow model."],
    win: ["Impossible: inner moves never make an arrow point backwards."],
    term: "Not every arrow inverts",
    math: {
      say: "Not every edge of a quasi-category is an equivalence. Starting from a single edge $f:a\\to b$, inner horn fillers only produce edges $a\\to a$, $a\\to b$, $b\\to b$; none is a left inverse $b\\to a$.",
      proof: "The nerve of the poset $0<1$ is a quasi-category with one non-degenerate edge and no edge $b\\to a$."
    }
  },

  nocancel: {
    title: "No cancelling",
    bullets: ["Given $\\sigma_1=(f,g\\,;\\,x)$ and $\\sigma_2=(k,g\\,;\\,x)$.", "Prove $f\\simeq k$, or say it can't be done."],
    explain: "The goal is the cancellation of the earlier level, now with the Kan property switched off and no arrow marked reversible. Cancelling $g$ needed an outer face of a tetrahedron, the face that carries a padlock. Without an inverse for $g$, nothing in the rules opens that padlock: $f$ and $k$ could be genuinely different arrows that $g$ cannot tell apart. To prove the goal impossible, build a quasi-category in which two non-homotopic arrows compose with $g$ to the same arrow $x$.",
    hints: ["Remember the padlock on the outer face.", "Press This can't be done. Build the fork model."],
    win: ["Impossible: without an inverse for $g$ you cannot cancel it."],
    term: "No cancellation",
    math: {
      say: "Cancellation ($g\\circ f\\simeq g\\circ k\\Rightarrow f\\simeq k$) needs the outer horn $\\Lambda^3_3$, which fills only if $X$ is Kan or $g$ is an equivalence. Neither holds here, and inner horns are not enough.",
      proof: "The only open face is $d_3$, an outer horn; no tool fills it here."
    }
  },

  backpath: {
    title: "A one-sided inverse",
    bullets: ["Given $\\sigma_1=(f,g\\,;\\,1_a)$, with $f:a\\to b$ and $g:b\\to a$.", "Prove $(g,f\\,;\\,1_b)$ exists, or say it can't be done."],
    explain: "Here $g$ undoes $f$ on one side only: $f$ followed by $g$ is the identity at $a$ by $\\sigma_1$. Does $g$ also undo $f$ the other way round? With only this much structure it need not. The smallest example of a one-sided inverse is called a <b>retraction</b>, and it need not be an isomorphism. To prove the goal impossible, build a quasi-category that contains $\\sigma_1$ but has no triangle $(g,f\\,;\\,1_b)$. The next levels show what extra data would settle it.",
    hints: ["Check what a one-sided inverse gives you.", "Press This can't be done. Build the retraction model."],
    win: ["Impossible: a one-sided inverse need not be an isomorphism."],
    term: "Retraction",
    math: {
      say: "The simplicial set with $f:a\\to b$, $g:b\\to a$ and a 2-simplex $(f,g;1_a)$ has $g$ as a left inverse of $f$ but no 2-simplex $(g,f;1_b)$; a one-sided inverse need not be an equivalence.",
      proof: "Inner horns here only compose; none produces a 2-simplex with boundary $(g,f;1_b)$."
    }
  },

  idem: {
    title: "Twice is once",
    bullets: ["Given $\\sigma_1=(f,g\\,;\\,1_a)$, as in the last level.", "Construct a composite $x$ of $g,f$ and prove $(x,x\\,;\\,x)$."],
    explain: "You just saw that $g$ followed by $f$ need not be an identity. It is still special: doing it twice is the same as doing it once. Doing $x$ twice means following $g,f,g,f$ in turn, and the middle $f$ then $g$ cancels against $1_a$. Here the cancellation is two tetrahedra. An arrow $x$ with a triangle $(x,x\\,;\\,x)$ is <b>idempotent</b>, and every one-sided inverse produces one. Whether a goal is possible depends on what it asks, and this one is possible.",
    hints: ["Cancel the middle: first show $(x,g\\,;\\,g)$.", "Compose: $g$, $f$. Tetrahedron: path $g,f,g$ with $\\sigma_2,\\sigma_1,s_1g$. Tetrahedron: path $x,g,f$ with $\\sigma_3,\\sigma_2,\\sigma_2$."],
    win: ["A one-sided inverse produces an idempotent arrow."],
    term: "Idempotent",
    math: {
      say: "If $(f,g;1_a)$ is a 2-simplex and $x$ is a composite of $(g,f)$, then there is a 2-simplex $(x,x;x)$: $x$ is idempotent, by two inner 3-horns.",
      proof: "Fill $\\Lambda^3_1$ on $(b,a,b,a)$ with $\\sigma_2,\\sigma_1,s_1g$ for $(x,g;g)$; fill $\\Lambda^3_2$ on $(b,b,a,b)$ with $\\sigma_3,\\sigma_2,\\sigma_2$ for $(x,x;x)$."
    }
  },

  detour: {
    title: "Factoring through an inverse",
    bullets: ["Given $\\sigma_1=(f,g\\,;\\,1_a)$ with $f$ an isomorphism ($\\cong$), and $h:a\\to c$.", "Prove $h$ is a composite of $f$ with some arrow."],
    explain: "You can go from $a$ to $c$ along $h$. Since $g$ undoes $f$ on one side, $h$ should factor as $f$ followed by some arrow from $b$ to $c$, and the natural candidate is a composite $x$ of $g$ and $h$. The tetrahedron on the path $f,g,h$ has $d_3=\\sigma_1=(f,g\\,;\\,1_a)$ and $d_0=(g,h\\,;\\,x)$, and the degenerate $d_1=s_0h=(1_a,h\\,;\\,h)$. Its missing face $d_2$ is $(f,x\\,;\\,h)$. Only inner faces are used, so the argument works in every quasi-category.",
    hints: ["First compose $g$ and $h$.", "Compose: $g$, $h$. Tetrahedron: path $f,g,h$; $d_3=\\sigma_1$, $d_0=\\sigma_2$, $d_1=s_0h$. Fill."],
    win: ["$(f,x\\,;\\,h)$ exists: $h$ factors through $f$ via $x$."],
    term: "Factoring through an inverse",
    math: {
      say: "Given $f$ and a 2-simplex $(f,g;1_a)$, any $h$ out of $a$ factors through $f$: with $x$ a composite of $(g,h)$ there is a 2-simplex $(f,x;h)$. The proof needs only an inner horn $\\Lambda^3_2$.",
      proof: "Fill $\\Lambda^2_1$ on $(g,h)$ giving $x$; fill $\\Lambda^3_2$ on $(a,b,a,c)$ with $\\sigma_1,\\sigma_2,s_0h$."
    }
  },

  mono: {
    title: "Cancel, with a licence",
    bullets: ["Given $g$ an isomorphism ($\\cong$), $\\sigma_1=(f,g\\,;\\,x)$, $\\sigma_2=(k,g\\,;\\,x')$, $x\\simeq m\\simeq x'$.", "Prove $f\\simeq k$."],
    explain: "The data is as in No cancelling, with two differences. The arrow $g$ is marked as an isomorphism, so the outer face of a tetrahedron that was locked is open there. And the two composites are not literally equal: $x$ and $x'$ are both homotopic to $m$, so you first have to transport $\\sigma_1$ and $\\sigma_2$ to a common long side $m$ with Swap in. After that the tetrahedron on $f,1_b,g$ has two faces on $g$ and cancels it: this is the outer horn $\\Lambda^3_3$, legal because the last edge $g$ is an isomorphism.",
    hints: ["First give both triangles the same long side.", "Swap in: $\\sigma_3,\\sigma_1$. Swap in: $\\sigma_4,\\sigma_2$. Tetrahedron: path $f,1_b,g$ with $\\sigma_5,\\sigma_6$. Fill."],
    win: ["Isomorphisms can be cancelled: $f\\simeq k$."],
    term: "Isomorphisms cancel",
    math: {
      say: "Joyal-type cancellation: if $g$ is an equivalence in an $\\infty$-category, the outer horn $\\Lambda^3_3\\to X$ whose last edge is $g$ fills. Hence $g\\circ f\\simeq g\\circ k$ implies $f\\simeq k$.",
      proof: "Swap in to get $(f,g;m)$, $(k,g;m)$; fill $\\Lambda^3_3$ on $(a,b,b,c)$ with $d_2=\\sigma_5$, $d_1=\\sigma_6$, $d_0=s_0g$; $d_3$ is $f\\simeq k$."
    }
  },

  twosided: {
    title: "One on each side",
    bullets: ["$g$ undoes $f$ on one side ($\\sigma_1$), $k$ on the other ($\\sigma_2$).", "Prove $g''$ also undoes $f$ on the other side."],
    explain: "Compare with the one-sided inverse: here there is a second inverse $k$ on the other side. A tetrahedron on the path $k,f,g$ shows $k\\simeq g$. The goal, however, names a different copy $g''$ of the inverse, related to $g$ only through two further homotopies, so you chain homotopies with Link until $k\\simeq g''$ and then substitute with Swap in. The substitution is legitimate because homotopic arrows are interchangeable in a triangle. So $g''$ works on both sides: an arrow with a left and a right inverse is an isomorphism.",
    hints: ["Compare $k$ and $g$ first. Then chain homotopies.", "Tetrahedron: path $k,f,g$ with $\\sigma_2,\\sigma_1$. Link: $\\sigma_6,\\sigma_3$. Link: $\\sigma_7,\\sigma_4$. Swap in: $\\sigma_8,\\sigma_2$."],
    win: ["The inverses agree up to homotopy, so $f$ is an isomorphism."],
    term: "Two-sided inverse",
    math: {
      say: "A left inverse $g$ and a right inverse $k$ of $f$ are homotopic, so any arrow homotopic to $g$ is also a right inverse. Only inner horns are used: $f$ is an equivalence in any quasi-category.",
      proof: "Fill $\\Lambda^3_2$ on $(b,a,b,a)$ for $k\\simeq g$; Link twice to $k\\simeq g''$; Swap in $g''$ for $k$ in $\\sigma_2$."
    }
  },

  joyal: {
    title: "Joyal's theorem",
    bullets: ["Given $f:a\\to b$ marked $\\cong$, and a second arrow $h:a\\to b$ without the mark.", "Construct inverses $x$ and $y$ on each side; prove $(y,1_a\\,;\\,x)$ and $(x,f\\,;\\,1_b)$."],
    explain: "Solve on $f$ and $1_a$ fills an outer horn $\\Lambda^2_0$, which in a general quasi-category cannot be filled. <b>Joyal's theorem</b> says it can whenever the edge you start along is an isomorphism, so both Solve tools work on $f$ but not on $h$. That gives a left inverse and a right inverse, and you know how to show the two are homotopic. A final substitution then yields $(x,f\\,;\\,1_b)$. In a quasi-category, outer horns fill exactly when their first (or last) edge is an isomorphism.",
    hints: ["Solve on both sides of $f$, then compare the two answers.", "Solve $f\\cdot ?=h$: $f$, $1_a$. Solve $?\\cdot g=h$: $f$, $1_b$. Tetrahedron: $y,f,x$. Swap in: $\\sigma_3,\\sigma_2$."],
    win: ["Outer horns fill when their first edge is an isomorphism."],
    term: "Joyal's theorem",
    math: {
      say: "Joyal: in a quasi-category $X$, a morphism $f$ is an isomorphism iff every $\\Lambda^n_0\\to X$ ($n\\ge2$) with first edge $f$ extends to $\\Delta^n$. Consequently $X$ is a Kan complex iff its homotopy category is a groupoid.",
      proof: "Fill $\\Lambda^2_0$ and $\\Lambda^2_2$ along $f$ for inverses $x,y$; $\\Lambda^3_2$ gives $y\\simeq x$; transport by Swap in."
    }
  },

  /* ---------------- World 11: Squares ---------------- */

  natsq: {
    title: "A commuting square",
    bullets: ["Given $\\sigma_1=(f,\\beta\\,;\\,d)$, $\\sigma_2=(\\alpha,f'\\,;\\,d')$ and $d\\simeq d'$ by $\\sigma_3$.", "Prove both triangles can have the same long side."],
    explain: "From $a$ to $b'$ there are two ways round: along $f$ and then $\\beta$, or along $\\alpha$ and then $f'$. A square is a pair of triangles on these two routes <i>sharing one long side</i>. Here the long sides $d$ and $d'$ are different arrows, related only by the homotopy $\\sigma_3$. So transport one triangle onto the other's long side with Swap in. The result is a map $\\Delta^1\\times\\Delta^1\\to X$, and it can be read as an arrow from $f$ to $f'$: a natural transformation with components $\\alpha$ and $\\beta$.",
    hints: ["The two long sides are homotopic. Use that.", "Swap in: $\\sigma_3,\\sigma_1$."],
    win: ["Two triangles now share one long side: a commuting square from $f$ to $f'$."],
    term: "Commuting square",
    math: {
      say: "A square in $C$ is a map $\\Delta^1\\times\\Delta^1\\to C$: two 2-simplices $(f,\\beta;d)$ and $(\\alpha,f';d)$ sharing the diagonal $d$. It is an edge $f\\to f'$ of $\\mathrm{Fun}(\\Delta^1,C)$.",
      proof: "Transport $(f,\\beta;d)$ along the homotopy $d\\simeq d'$ to get $(f,\\beta;d')$, which shares its diagonal with $\\sigma_2$."
    }
  },

  moveacross: {
    title: "Moving an isomorphism across",
    bullets: ["Given $\\sigma_2=(\\alpha,p\\,;\\,q)$, with $\\bar\\alpha$ undoing $\\alpha$ by $\\sigma_1$.", "Prove $(\\bar\\alpha,q\\,;\\,p)$ exists."],
    explain: "In school algebra $\\alpha p=q$ gives $p=\\alpha^{-1}q$: you divide both sides by $\\alpha$. The same holds here, but it is a proof and not a rule. Take the path $\\bar\\alpha,\\alpha,p$, with corners $a',a,a',c$. Its first two steps cancel against $1_{a'}$ by $\\sigma_1$, and the free triangle $s_0p$ makes the face $d_1$ degenerate. That leaves one face open: $d_2$, which is exactly $(\\bar\\alpha,q\\,;\\,p)$. Afterwards you own <b>Divide</b>, which does this on either side in one click.",
    hints: ["Use a path that starts by undoing $\\alpha$.", "Tetrahedron: path $\\bar\\alpha,\\alpha,p$; $d_3=\\sigma_1$, $d_0=\\sigma_2$, $d_1=s_0p$. Fill."],
    win: ["An isomorphism can be moved across, like dividing. New tool: Divide."],
    term: "Dividing by an isomorphism",
    math: {
      say: "If $(\\bar\\alpha,\\alpha;1_{a'})$ is a 2-simplex, so $\\bar\\alpha$ undoes $\\alpha$, and $(\\alpha,p;q)$ is a 2-simplex, there is a 2-simplex $(\\bar\\alpha,q;p)$: left multiplication by an isomorphism is invertible up to homotopy.",
      proof: "Fill $\\Lambda^3_2$ on $(a',a,a',c)$ with $d_3=\\sigma_1$, $d_0=\\sigma_2$, $d_1=s_0p$; the new face $d_2$ is $(\\bar\\alpha,q;p)$."
    }
  },

  acrossagain: {
    title: "The other side",
    bullets: ["Given $\\sigma_3=(p,\\beta\\,;\\,q)$, $q'\\simeq q$ by $\\sigma_4$, and $\\bar\\beta$ undoing $\\beta$.", "Prove $(q',\\bar\\beta\\,;\\,p)$ exists."],
    explain: "Divide also works from the right: if $\\sigma_3=(p,\\beta\\,;\\,q)$ and $\\bar\\beta$ undoes $\\beta$, then $(q,\\bar\\beta\\,;\\,p)$ exists. Here the fact you want is stated for $q'$ and not for $q$, so one more step carries the result along the homotopy $q'\\simeq q$. The two tools combine: Divide gives the triangle for $q$, and a tetrahedron on the path $q',1_{b'},\\bar\\beta$ moves it to $q'$. Tools you proved earlier combine freely with new ones.",
    hints: ["Divide first. Then carry the result from $q$ to $q'$.", "Divide: $\\sigma_1,\\sigma_3$. Tetrahedron: path $q',1_{b'},\\bar\\beta$; $d_3=\\sigma_4$, $d_0=s_0\\bar\\beta$, $d_1=\\sigma_5$. Fill."],
    win: ["Dividing works on the right as well."],
    term: "Right division",
    math: {
      say: "Given $(\\beta,\\bar\\beta;1_b)$ and a 2-simplex $(p,\\beta;q)$ there is a 2-simplex $(q,\\bar\\beta;p)$, and 2-simplices transport along homotopies of any edge.",
      proof: "Fill $\\Lambda^3_1$ on $(a,b,b',b)$ with $(p,\\beta;q)$, $(\\beta,\\bar\\beta;1_b)$, $s_1p$; then $\\Lambda^3_2$ on $(a,b',b',b)$ transports along $q'\\simeq q$."
    }
  },

  sqpaste: {
    title: "Pasting squares",
    bullets: ["Two commuting squares, one on top of the other.", "Prove the tall outer square commutes."],
    explain: "Squares are arrows between arrows, so they should compose: a square from $f$ to $f'$ stacked on a square from $f'$ to $f''$ gives one from $f$ to $f''$. Its sides are the composites $A$ and $B$. Pick one way round the tall square and build its diagonal: compose $f$ with $B$. Then walk that diagonal across the picture, one tetrahedron at a time. Each tetrahedron trades a triangle you know for its neighbour, and three trades reach the other side.",
    hints: ["Build the diagonal $f$ with $B$, then move it left tetrahedron by tetrahedron.", "Compose: $f$, $B$. Tetrahedra, paths: $f,\\beta,\\beta'$; $\\alpha,f',\\beta'$; $\\alpha,\\alpha',f''$."],
    win: ["Commuting squares paste: arrows between arrows compose."],
    term: "Pasting squares",
    math: {
      say: "$\\mathrm{Fun}(\\Delta^1,C)$ is a quasi-category when $C$ is: two composable squares have a composite. The prism $\\Delta^1\\times\\Delta^2$ is a union of three 3-simplices, each filled by an inner horn.",
      proof: "With $D$ the composite of $(f,B)$: fill $\\Lambda^3_1$ on $(a,b,b',b'')$, $\\Lambda^3_2$ on $(a,a',b',b'')$, $\\Lambda^3_1$ on $(a,a',a'',b'')$; the last face is $(A,f'';D)$."
    }
  },

  isocomp: {
    title: "Isomorphisms compose",
    bullets: ["Given isomorphisms $f,g$ with inverses, and $\\sigma_5=(f,g\\,;\\,x)$.", "Construct an arrow undoing $x$ on both sides."],
    explain: "An <b>isomorphism</b> is an arrow with a left and a right inverse up to homotopy. If $f$ and $g$ are isomorphisms, a composite $x$ of them should be one too, and as with socks and shoes its inverse should be a composite $y$ of $\\bar g$ and $\\bar f$. Build that candidate, then prove both halves. Each half has the same shape: Divide cancels one arrow against its inverse, and a tetrahedron cancels the other. Not every arrow pointing backwards is the inverse you need.",
    hints: ["The inverse composes $\\bar g$ and $\\bar f$. Each side: Divide, then a tetrahedron.", "Compose: $\\bar g$, $\\bar f$. Divide: $\\sigma_3,\\sigma_5$. Tetrahedron: path $x,\\bar g,\\bar f$. Divide: $\\sigma_2,\\sigma_6$. Tetrahedron: path $y,f,g$."],
    win: ["A composite of isomorphisms is an isomorphism."],
    term: "Isomorphisms compose",
    math: {
      say: "If the spine of a simplex lands in the equivalences, so does every edge: for isomorphisms $f,g$ with inverses $\\bar f,\\bar g$, any composite $x$ of $(f,g)$ has a two-sided inverse, a composite $y$ of $(\\bar g,\\bar f)$.",
      proof: "From $(f,g;x)$ get $(x,\\bar g;f)$; fill $\\Lambda^3_2$ on $(a,c,b,a)$ for $(x,y;1_a)$. From $(\\bar g,\\bar f;y)$ get $(y,f;\\bar g)$; fill $\\Lambda^3_2$ on $(c,a,b,c)$."
    }
  },

  natiso: {
    title: "Invertible, piece by piece",
    bullets: ["A commuting square from $f$ to $f'$ whose sides $\\alpha,\\beta$ are isomorphisms.", "Construct the square going back, with sides $\\bar\\alpha$ and $\\bar\\beta$."],
    explain: "A <b>natural transformation</b> is a family of arrows making squares commute; here it is a single square with sides $\\alpha$ and $\\beta$. The theorem is that if every side is an isomorphism, the whole transformation is invertible: the inverses $\\bar\\alpha,\\bar\\beta$ fit into a commuting square going back. Pick the diagonal of the return square, then show both ways round reach it. Divide moves $\\alpha$ and $\\beta$ across, and one tetrahedron joins the two halves.",
    hints: ["Take the diagonal $\\bar\\alpha$ with $f$. Divide twice, with a tetrahedron between.", "Compose: $\\bar\\alpha$, $f$. Divide: $\\sigma_1,\\sigma_4$. Tetrahedron: path $\\bar\\alpha,f,\\beta$. Divide: $\\sigma_2,\\sigma_9$."],
    win: ["Invertible sides give an invertible square."],
    term: "Natural isomorphism",
    math: {
      say: "Theorem: a natural transformation is an equivalence in $\\mathrm{Fun}(K,C)$ iff each component is an equivalence in $C$, i.e. $\\mathrm{Fun}(K,C)\\to\\mathrm{Fun}(\\mathrm{sk}_0K,C)$ is conservative. This level is the case $K=\\Delta^1$.",
      proof: "From $(\\alpha,f';d)$ get $(\\bar\\alpha,d;f')$; fill $\\Lambda^3_1$ on $(a',a,b,b')$; dividing by $\\beta$ completes the return square."
    }
  },

  /* ---------------- World 12: Playground ---------------- */

  sandbox: {
    title: "Sandbox",
    bullets: ["Every tool is unlocked.", "There is no goal. Undo is always available."],
    explain: "Everything you have learnt is available: Compose, Solve, Tetrahedron, the theorem tools, Draw arrow, Glue triangle, Peel and Fill in, with the Kan option on, so that every horn can be filled. Try constructing an inverse, relating two composites, or building a sphere. A construction that does not work out costs nothing, since Undo restores the previous state. The Facts panel lists the free triangles as well, so you can use $s_0f$ and $s_1f$ in a tetrahedron whenever it needs one.",
    hints: ["Compose two arrows.", "Compose two arrows. Tetrahedron on a path of three."],
    win: [],
    term: "Simplicial set",
    math: {
      say: "A simplicial set is a functor $\\Delta^{op}\\to\\mathrm{Set}$. Here you build finite ones by hand: add vertices, edges and 2-cells, fill horns, and take skeleta.",
      proof: ""
    }
  },

  /* ---------------- World 1: Simplicial sets ---------------- */

  faces: {
    title: "Reading a triangle",
    bullets: ["Four triangles are drawn on four dots.", "Tap the triangle whose long side $d_1$ is $y$."],
    explain: "A triangle $\\sigma$ has three faces, all of them arrows. The face $d_2\\sigma$ joins corners $0$ and $1$ (the first leg), $d_0\\sigma$ joins corners $1$ and $2$ (the second leg), and $d_1\\sigma$ joins corners $0$ and $2$ (the long side). The index names the corner the face omits: $d_1$ omits the middle corner, so it is the arrow that skips it. The game writes $\\sigma=(d_2\\sigma,\\,d_0\\sigma\\,;\\,d_1\\sigma)$, so $(f,g\\,;\\,x)$ is the triangle with legs $f,g$ and long side $x$. Every triangle in the Facts list is shown in this form.",
    hints: ["Read the entry after the semicolon.", "Tap $\\sigma_2$, whose boundary ends in $y$."],
    win: ["$d_1\\sigma_2=y$: the long side is the entry after the semicolon."],
    term: "Faces of a triangle",
    math: {
      say: "A 2-simplex $\\sigma:\\Delta^2\\to X$ has faces $d_i\\sigma=\\sigma\\circ\\delta^i$, where $\\delta^i:[1]\\to[2]$ omits $i$: $d_2\\sigma$ is the edge $01$, $d_0\\sigma$ the edge $12$ and $d_1\\sigma$ the edge $02$.",
      proof: "$d_1\\sigma_2=y$, the edge from corner $0$ to corner $2$."
    }
  },

  freebies: {
    title: "Free triangles",
    bullets: ["An arrow $f:a\\to b$ is given.", "Tap the free triangles $(f,1_b\\,;\\,f)$ and $(1_a,f\\,;\\,f)$."],
    explain: "Every dot $a$ has a degenerate arrow $1_a$, and every arrow $f:a\\to b$ has two degenerate triangles: $s_0f=(1_a,f\\,;\\,f)$ and $s_1f=(f,1_b\\,;\\,f)$. They exist in every simplicial set without being made, which is why the Facts panel lists them separately as free triangles. The subscript says which corner of $f$ is repeated: $s_0f$ repeats the start of $f$, and $s_1f$ repeats its end. You will use them whenever a proof needs an identity to take part, and from now on every dot on the board shows its faint loop $1_a$.",
    hints: ["Read the legs: look for the one that is $1_b$.", "Tap $s_1f$ first, then $s_0f$."],
    win: ["$s_1f=(f,1_b\\,;\\,f)$ and $s_0f=(1_a,f\\,;\\,f)$ exist for every arrow $f$."],
    term: "Degenerate triangles",
    math: {
      say: "Degeneracy maps $s_i:X_n\\to X_{n+1}$ repeat a vertex. $1_a=s_0a$; for $f:a\\to b$, $s_0f$ and $s_1f$ are the 2-simplices with boundaries $(1_a,f;f)$ and $(f,1_b;f)$.",
      proof: "$s_1f=(f,1_b;f)$ repeats the end of $f$; $s_0f=(1_a,f;f)$ repeats its start."
    }
  },

  whichface: {
    title: "Repeated corners",
    bullets: ["The tetrahedron has corners $0,1,2,3$ over the dots $a,b,b,c$.", "Tap its degenerate face $d_3$."],
    explain: "A tetrahedron has four corners, but they need not lie over four different dots. Here corners $1$ and $2$ both lie over $b$; they are different corners, joined by the arrow $12=1_b$. The face $d_i$ omits corner $i$. Face $d_3$ omits the corner over $c$ and keeps the corners over $a,b,b$: its legs are $f$ and $1_b$ and its long side is $f$, which is exactly the free triangle $s_1f$. Face $d_0$ is degenerate in the same way, with legs $1_b,g$. The other two faces, $d_1$ and $d_2$, are the real triangle $\\sigma_1$.",
    hints: ["Face $d_3$ omits the last corner.", "Tap $s_1f$, the free triangle with legs $f$ and $1_b$."],
    win: ["$d_3=s_1f$: a repeated corner makes a degenerate face."],
    term: "Degenerate faces",
    math: {
      say: "The tetrahedron $\\tau=s_1\\sigma$ has $d_3\\tau=s_1d_2\\sigma=s_1f$ and $d_0\\tau=s_0d_0\\sigma=s_0g$ degenerate, while $d_1\\tau=d_2\\tau=\\sigma$.",
      proof: "$\\tau=s_1\\sigma_1$, so $d_3\\tau=s_1d_2\\sigma_1=s_1f$."
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

  { id: "simplicial", before: "faces", title: "Dots, arrows, triangles", body: [
    { p: "A <b>simplicial set</b> is a collection of directed "triangles" of every dimension: dots, arrows, triangles, tetrahedra, and so on. We call these <b>simplexes</b>, which we will formally define later. 
	
	Note the boundary of each simplex consists of simplicies of lower dimension" },
    { diagram: { dots: [{id:"a",label:"0",x:15,y:44},{id:"b",label:"1",x:50,y:10},{id:"c",label:"2",x:85,y:44}],
                 arrows: [{from:"a",to:"b",label:"d₂"},{from:"b",to:"c",label:"d₀"},{from:"a",to:"c",label:"d₁"}], fills: [["a","b","c"]] } },
    { p: "For example, an arrow ($1$-simplex) has a source and a target, which are both $0$-simplices. A triangle has three corners numbered $0,1,2$ and three faces, each an arrow: $d_2$ joins corners $0$ and $1$, $d_0$ joins $1$ and $2$, and $d_1$ joins $0$ and $2$. 
	
	Each face is named numerically for the corner it omits. For convention, we will denote a triangle as the triple $(d_2,d_0\\,;\\,d_1)$: first leg, second leg, long side." },
    { demo: "tetra-3d" },
    { p: "Similarily, a tetrahedron has four corners and four triangular faces $d_0,\\dots,d_3$, with $d_i$ omitting corner $i$. 
	Note how every arrow runs from a lower corner to a higher one, and how every face of the tetrahedron is oriented either clockwise or counterclockwise." },
    { p: "Let's look at some simple examples of simplicial sets." }
  ]},

  { id: "degenerate", before: "freebies", title: "Identities and degenerate simplices", body: [
    { p: "Every dot $a$ comes with an <b>identity</b> arrow $1_a:a\\to a$. It needs no construction, because the dot itself, regarded as a simplex of dimension one, is a <i>degenerate</i> arrow. The board shows it as a faint loop at each dot." },
    { p: "The same happens one dimension up. An arrow $f:a\\to b$ has two degenerate triangles, $s_0f=(1_a,f\\,;\\,f)$ and $s_1f=(f,1_b\\,;\\,f)$. The names come from the <i>degeneracy maps</i> $s_0,s_1$, which repeat a corner: $s_0f$ is the triangle with corners over $a,a,b$, and $s_1f$ the one over $a,b,b$." },
    { diagram: { dots: [{id:"a",label:"0 = a",x:10,y:44},{id:"b",label:"1 = a",x:30,y:10},{id:"c",label:"2 = b",x:50,y:44},{id:"d",label:"0 = a",x:60,y:44},{id:"e",label:"1 = b",x:80,y:10},{id:"f",label:"2 = b",x:98,y:44}],
                 arrows: [{from:"a",to:"b",label:"1_a",kind:"identity"},{from:"b",to:"c",label:"f"},{from:"a",to:"c",label:"f"},{from:"d",to:"e",label:"f"},{from:"e",to:"f",label:"1_b",kind:"identity"},{from:"d",to:"f",label:"f"}], fills: [["a","b","c"],["d","e","f"]] } },
    { p: "These triangles always exist, so you never build them. Hence $(f,1_b\\,;\\,f)$ and $(1_a,f\\,;\\,f)$ can be used in a proof without appearing among the triangles you have made; the Facts panel lists them under Free triangles." },
    { demo: "split-vertex" },
    { p: "In a tetrahedron the corners may lie over the same dot. A tetrahedron over the dots $a,b,b,c$ still has four separate corners; corners $1$ and $2$ are joined by the identity $1_b$, and some of its faces are degenerate. Reading the corners as four distinct points is what makes proofs with identities visible." },
    { p: "Identities matter because they let a proof talk about doing nothing. Homotopy, in a later world, will be a triangle with an identity as its second leg, and the unit laws are statements about degenerate triangles. A proof that appears to use an identity only sometimes is using a degenerate face of a tetrahedron." }
  ]},

  { id: "arrows", before: "compose", title: "Arrows and composition", body: [
    { p: "Two arrows $f:a\\to b$ and $g:b\\to c$ <i>meet</i> when the target of the first is the source of the second. In an ordinary category they have a composite $g\\circ f$, written right to left like function application. The game writes diagrams in the order you travel, so a composite of $f$ then $g$ is a triangle $(f,g\\,;\\,x)$." },
    { diagram: { dots: [{id:"a",label:"a",x:15,y:42},{id:"b",label:"b",x:50,y:12},{id:"c",label:"c",x:85,y:42}],
                 arrows: [{from:"a",to:"b",label:"f"},{from:"b",to:"c",label:"g"},{from:"a",to:"c",label:"x",dashed:true}], ghost: [["a","b","c"]] } },
    { p: "In this game a <b>composite</b> of $f$ then $g$ is an arrow $x$ together with a triangle $(f,g\\,;\\,x)$ that witnesses it, and a pair of arrows may have several composites. The new arrow gets a fresh letter, and its tooltip says that it is a composite of $f$ then $g$." },
    { p: "Paths in a space show why. Following $f$ and then $g$ gives a path, and so does any path obtained from it by a small deformation, with nothing to single one out. A theory that remembers the witnesses can express this, and an ordinary category is the case in which the witness is unique." }
  ]},

  { id: "triangle", before: "twoways", title: "What a triangle witnesses", body: [
    { p: "A triangle with legs $f,g$ and long side $x$ is a <b>proof</b> that $x$ is a composite of $f$ then $g$. It is written $(f,g\\,;\\,x)$." },
    { diagram: { dots: [{id:"a",label:"a",x:15,y:42},{id:"b",label:"b",x:50,y:12},{id:"c",label:"c",x:85,y:42}],
                 arrows: [{from:"a",to:"b",label:"f"},{from:"b",to:"c",label:"g"},{from:"a",to:"c",label:"x"}], fills: [["a","b","c"]] } },
    { p: "The triangle states that $x$ is <i>a</i> composite of $f$ then $g$ and does not select it. Another triangle on the same $f$ and $g$ may have a different long side $y$, and then both $x$ and $y$ are composites of $f$ then $g$, with neither preferred." },
    { p: "Composition is therefore a relation, “$x$ is a composite of $f$ then $g$”, and each triangle witnesses one instance of it. It is no longer a function with a single value." },
    { p: "The next levels show that two composites of the same pair are always <i>homotopic</i>, which is the appropriate notion of being interchangeable, and that associativity and the unit laws hold in the same sense. Until then, read every triangle as saying that its long side is a composite." }
  ]},

  { id: "simplices", before: "tetra", title: "Simplices and order-preserving maps", body: [
    { p: "The <b>$n$-simplex</b> $\\Delta^n$ is the shape with corners $0<1<\\dots<n$, one arrow $i\\to j$ for every $i<j$, and everything filled in. So $\\Delta^0$ is a dot, $\\Delta^1$ an arrow, $\\Delta^2$ a filled triangle and $\\Delta^3$ a solid tetrahedron." },
    { demo: "tetra-3d" },
    { p: "Its faces come from deleting one corner: $d_i$ is the face that omits corner $i$. A triangle has three edges, and a tetrahedron has four triangular faces." },
    { demo: "order-maps" },
    { p: "A simplex of a simplicial set $X$ is a map $\\Delta^n\\to X$. Order-preserving maps between the shapes act on simplices: the inclusion $[1]\\to[2]$ omitting corner $i$ takes a triangle to its face $d_i$, and a map $[2]\\to[1]$ that sends two corners to one takes an arrow to a degenerate triangle. Here $[n]=\\{0<\\dots<n\\}$." },
    { p: "A tetrahedron may therefore have a repeated corner: it is a map from $\\Delta^3$ whose corners land on the same dot. Its faces then include degenerate triangles, such as $s_1f$." }
  ]},

  { id: "horns", before: "assoc", title: "Horns and the notation $\\Lambda^n_k$", body: [
    { p: "Take the simplex $\\Delta^n$ and remove its interior together with one face. What remains is a <b>horn</b> $\\Lambda^n_k$: $n$ is the dimension, and $k$ names the missing face, the one opposite corner $k$ (so the missing face is $d_k$)." },
    { diagram: { dots: [{id:"a",label:"0",x:12,y:42},{id:"b",label:"1",x:50,y:12},{id:"c",label:"2",x:88,y:42}],
                 arrows: [{from:"a",to:"b",label:"d₂"},{from:"b",to:"c",label:"d₀"},{from:"a",to:"c",label:"d₁ missing",dashed:true}] } },
    { p: "This is $\\Lambda^2_1$: two arrows end to end, missing the long side. $\\Lambda^2_0$ is two arrows leaving the same dot, missing the side between their ends. $\\Lambda^2_2$ is two arrows arriving at the same dot. A horn is <b>inner</b> if $0<k<n$ and <b>outer</b> if $k=0$ or $k=n$." },
    { p: "To <b>fill</b> a horn in a simplicial set $X$ means: given the faces of the horn in $X$, find an $n$-simplex of $X$ having them as faces. Equivalently, extend a map $\\Lambda^n_k\\to X$ to a map $\\Delta^n\\to X$." },
    { demo: "horn-fill" },
    { p: "<b>Fillers need not exist.</b> In a simplicial set with two arrows $f,g$ end to end and no triangles, $\\Lambda^2_1$ has no filler. In the simplicial set consisting of one arrow $a\\to b$, the outer horn $\\Lambda^2_0$ on $f$ and $1_a$ would need an arrow from $b$ to $a$, and there is none. In a hollow triangle, the horn on $f,g$ has no filler because there is no triangle at all. Much of the game is deciding which horns fill in which simplicial sets." }
  ]},

  { id: "equivalence", before: "unique", title: "Homotopy, equality and isomorphism", body: [
    { p: "Two things can be <b>equal</b>, literally the same, or merely <b>equivalent</b>: interchangeable for the purposes at hand. In topology two paths from $p$ to $q$ are <b>homotopic</b> if one can be deformed continuously into the other with the ends fixed." },
    { p: "In this game parallel arrows $x,y:a\\to b$ are <b>homotopic</b>, written $x\\simeq y$, if a triangle $(x,1_b\\,;\\,y)$ exists. This is the definition. It does not assert that $y\\simeq x$ or that $\\simeq$ chains; these are theorems, which you prove in the next world." },
    { diagram: { dots: [{id:"a",label:"a",x:15,y:42},{id:"b",label:"b",x:50,y:12},{id:"c",label:"b",x:85,y:42}],
                 arrows: [{from:"a",to:"b",label:"x"},{from:"b",to:"c",label:"1_b",kind:"identity"},{from:"a",to:"c",label:"y"}], fills: [["a","b","c"]] } },
    { p: "The word “equal” is avoided because a space may contain many different witnesses that two arrows agree, and the choice of witness can matter later. Equivalence keeps the witness, and equality would discard it. Homotopic arrows can replace one another inside triangles, but they remain different arrows." },
    { p: "An arrow $f:a\\to b$ is an <b>isomorphism</b>, also called an <b>equivalence</b>, if there are arrows $g,k:b\\to a$ with triangles $(f,g\\,;\\,1_a)$ and $(k,f\\,;\\,1_b)$. Dots joined by an isomorphism are equivalent: weaker than equal, stronger than merely similar, since the comparison is explicit and invertible." },
    { demo: "split-vertex" }
  ]},

  { id: "quasicat", before: "symmetric", title: "Quasi-categories", body: [
    { p: "A <b>quasi-category</b> is a simplicial set in which every inner horn $\\Lambda^n_k\\to X$ with $0<k<n$ has a filler. In words: any path of arrows can be composed, consistently in higher dimensions, though not uniquely. It is also called an <b>$\\infty$-category</b> (model)." },
    { p: "<b>Examples.</b> The nerve of any ordinary category, where fillers are even unique. Any Kan complex, where all horns fill. Everything you have built so far lives in a quasi-category." },
    { p: "<b>Non-examples.</b> A simplicial set with two arrows end to end and no triangle: $\\Lambda^2_1$ has no filler. A hollow triangle $\\partial\\Delta^2$: the horn on $f,g$ has no filler, since no triangle exists. Both are simplicial sets but not quasi-categories." },
    { diagram: { dots: [{id:"a",label:"a",x:12,y:42},{id:"b",label:"b",x:30,y:15},{id:"c",label:"c",x:48,y:42},{id:"d",label:"a",x:60,y:42},{id:"e",label:"b",x:78,y:15},{id:"f",label:"c",x:96,y:42}],
                 arrows: [{from:"a",to:"b",label:"f"},{from:"b",to:"c",label:"g"},{from:"d",to:"e",label:"f"},{from:"e",to:"f",label:"g"},{from:"d",to:"f",label:"h"}], fills: [["d","e","f"]] } },
    { p: "Non-unique fillers are accepted because composing paths in a space is defined only up to deformation. Being a quasi-category is a <i>property</i> of a simplicial set and adds no structure: composites exist, and any two are homotopic. Everything you prove about homotopy in the next world holds in every quasi-category. Later worlds ask what more you get from more fillers, such as being Kan or being a nerve." }
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
    { p: "Every inner horn in a nerve has <i>exactly one</i> filler: the composite is forced. A category is therefore a quasi-category with unique fillers. In the next levels a composition table lists the entries; ask for a second answer and you are refused." },
    { demo: "tetra-3d" },
    { p: "Associativity becomes a solid: the tetrahedron on the path $f,g,h$ has faces $(f,g\\,;\\,x)$, $(g,h\\,;\\,y)$, $(x,h\\,;\\,z)$ and $(f,y\\,;\\,z)$. In a nerve $x,y,z$ are composites in the category, so the fourth face says $h\\circ(g\\circ f)=(h\\circ g)\\circ f$. In a general quasi-category the two bracketings are only related by a triangle, which is why the earlier worlds needed tetrahedra at all." },
    { p: "Nerves can be recognised by a condition on spines. A chain of arrows end to end is called a <b>spine</b>. In a nerve, every spine extends to a full simplex in exactly one way: a spine of two arrows has one triangle, a spine of three has one tetrahedron, and so on. This is called the <b>Segal condition</b>. If a spine has no extension, composition is undefined there, and if it has two, composition involves a choice. The later levels of this world ask you to judge pictures by this rule." }
  ]},

  { id: "skeleta", before: "disc", title: "Skeleta and cells", body: [
    { p: "The <b>$n$-skeleton</b> $\\mathrm{sk}_n X$ keeps only the simplices of dimension at most $n$. So $\\mathrm{sk}_0$ is the dots, $\\mathrm{sk}_1$ the dots and arrows, $\\mathrm{sk}_2$ adds the triangles. Peel takes the top layer off." },
    { p: "The <b>boundary</b> $\\partial\\Delta^n$ is $\\mathrm{sk}_{n-1}\\Delta^n$: all the faces, without the filling. So $\\partial\\Delta^2$ is a hollow triangle." },
    { diagram: { dots: [{id:"a",label:"a",x:15,y:42},{id:"b",label:"b",x:50,y:12},{id:"c",label:"c",x:85,y:42}],
                 arrows: [{from:"a",to:"b",label:"f"},{from:"b",to:"c",label:"g"},{from:"a",to:"c",label:"h"}], ghost: [["a","b","c"]] } },
    { p: "To <b>attach an $n$-cell</b> to $X$ along a map $\\partial\\Delta^n\\to X$, glue in a new $\\Delta^n$ whose boundary lands on that part of $X$. Formally this is a pushout of $\\partial\\Delta^n\\hookrightarrow\\Delta^n$. Every simplicial set can be built from nothing by attaching cells, one dimension at a time." },
    { p: "Attaching a cell differs from filling a horn: a horn lacks exactly one face, while a boundary lacks the whole interior. This difference matters in a few worlds: filling a horn never changes the overall shape, but attaching a cell can." },
    { p: "The skeleton has an opposite, the <b>coskeleton</b>. Where the $n$-skeleton forgets everything above dimension $n$, the $n$-coskeleton puts back exactly one cell wherever a boundary is present above dimension $n$. A shape is called $n$-coskeletal when it is determined by its simplices up to dimension $n$ in this way. Nerves of ordinary categories are like that: everything above the triangles is forced." }
  ]},

  { id: "anodyne", before: "spine", title: "Anodyne maps", body: [
    { p: "Some inclusions $A\\hookrightarrow B$ can be built purely from horn fillings. The class of such maps, the <b>anodyne</b> maps, is the smallest class containing every horn inclusion $\\Lambda^n_k\\hookrightarrow\\Delta^n$ and closed under gluing, composition and retracts. Using only inner horns gives the <b>inner anodyne</b> maps." },
    { p: "Anodyne maps never change the shape. Each one is a weak homotopy equivalence, because a horn is contractible, just as $\\Delta^n$ is. For example the <b>spine</b>, the path of $n$ arrows inside $\\Delta^n$, is inner anodyne. Hence composable chains always extend to a full simplex in a quasi-category." },
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
    { p: "A <b>left fibration</b> lifts more: every horn $\\Lambda^n_k$ with $k<n$, which includes $\\Lambda^1_0$: an arrow of $S$ lifts from any chosen start. The end of the lift is chosen by the map and not by you. Think of a family of sets varying over $S$: an arrow of $S$ carries each element of one set to an element of the next." },
    { p: "In the next levels the shadow $S$ is fixed, every new simplex of $X$ must lie over a simplex of $S$, and the kind of map decides which horns lift. The same picture can be solvable over a left fibration and impossible over an inner one." }
  ]},

  { id: "joyal", before: "joyal", title: "Joyal's theorem", body: [
    { p: "Outer horns do not fill in a general quasi-category. But they do fill when the first edge is an isomorphism. <b>Joyal's theorem</b>: in a quasi-category $X$, for $n\\ge 2$, every horn $\\Lambda^n_0\\to X$ whose first edge is an equivalence has a filler. Dually for $\\Lambda^n_n$ and the last edge. Without the isomorphism hypothesis the statement fails: the one-way arrow showed that." },
    { diagram: { dots: [{id:"a",label:"0",x:20,y:32},{id:"b",label:"1",x:50,y:10},{id:"c",label:"2",x:80,y:32}],
                 arrows: [{from:"a",to:"b",label:"f (iso)"},{from:"a",to:"c",label:"h"},{from:"b",to:"c",label:"?",dashed:true}] } },
    { p: "Conversely, if an edge has this extension property then it is an equivalence. So an $\\infty$-groupoid is exactly a quasi-category in which every arrow is an equivalence." },
    { p: "The relative version: let $p:X\\to S$ be an inner fibration. A lifting problem for $\\Lambda^n_0\\hookrightarrow\\Delta^n$ against $p$ has a solution when the first edge of the horn is an equivalence in $X$." },
    { p: "You used both forms: Solve built an inverse, and the padlock on the outer face of Tetrahedron opened because the edge involved was an isomorphism. In both cases invertibility of one edge permitted an outer filling." }
  ]},

  { id: "spaces", before: "sphere", title: "Pictures as spaces", body: [
    { p: "Every picture in this game is also a shape you could build out of paper. Each dot is a point, each arrow a stretch of string, each filled triangle a solid triangle, each solid tetrahedron a solid tetrahedron, all glued along their faces. The result is the <b>geometric realisation</b> $|X|$ of the simplicial set $X$. Arrow directions are forgotten; only the shape is kept." },
    { diagram: { dots: [{id:"a",label:"a",x:20,y:46},{id:"b",label:"b",x:50,y:12},{id:"c",label:"c",x:80,y:46}],
                 arrows: [{from:"a",to:"b",label:"f"},{from:"b",to:"c",label:"g"},{from:"a",to:"c",label:"h"}], fills: [["a","b","c"]] } },
    { p: "A hollow triangle realises to a circle. A filled one is a disc. Two triangles glued along the same three sides, as in the next level, form a sphere, and so does the hollow tetrahedron you build later. These shapes are genuinely different: a loop around a circle cannot be shrunk to a point without leaving it, and a sphere encloses a hollow that a disc does not." },
    { p: "Counting dots minus arrows plus triangles minus tetrahedra, using only the non-degenerate ones, gives the <b>Euler characteristic</b>, which already separates many of these shapes. A disc gives $3-3+1=1$, a circle $3-3=0$, a sphere $3-3+2=2$. Peeling and gluing change it. Filling a horn never does: it adds one new face and one new cell at once, which is the arithmetic shadow of the fact you will meet in the anodyne world." }
  ]},

  { id: "paths", before: "cancel", title: "Paths, loops and why undoing is natural", body: [
    { p: "Kan complexes look like a technical condition: every horn fills. They describe spaces. Given any space, take every way of mapping a triangle, a tetrahedron, and so on into it; these form a simplicial set, called its <b>singular complex</b>, and it is always a Kan complex. Conversely every Kan complex has the same homotopy information as its realisation." },
    { p: "Read the arrows of a singular complex as paths in the space. Composing is following one path and then the next. Undoing is running a path backwards, which is why every horn fills: a path can always be reversed and squashed back. A homotopy between two paths is a deformation of one into the other with the ends held fixed, exactly a triangle with an identity side." },
    { diagram: { dots: [{id:"a",label:"a",x:20,y:30},{id:"b",label:"b",x:80,y:30}],
                 arrows: [{from:"a",to:"b",label:"x",bend:0.3},{from:"a",to:"b",label:"y",bend:-0.3}], fills: [] } },
    { p: "Loops at a point, up to homotopy, form a group: compose by following one loop then another, invert by running backwards. These classes form the <b>fundamental group</b>. Around a circle it is the integers, counting how many times you wind round, which is one more way to see that the hollow triangle is not a disc. In an ∞-groupoid every level of this story is present at once: paths, homotopies between paths, homotopies between those, and so on." }
  ]},

  { id: "counter", before: "nofill", title: "How to prove something is impossible", body: [
    { p: "Showing a goal <i>can</i> be reached is easy to check: you do it. Showing it can <i>never</i> be reached is harder, because you cannot try every sequence of moves. Mathematicians use a <b>counterexample</b>: one concrete world in which everything you were given is true and the goal is false." },
    { diagram: { dots: [{id:"a",label:"0",x:20,y:46},{id:"b",label:"1",x:50,y:12},{id:"c",label:"2",x:80,y:46}],
                 arrows: [{from:"a",to:"b",label:"f"},{from:"b",to:"c",label:"g"},{from:"a",to:"c",label:"h"},{from:"a",to:"c",label:"k"}] } },
    { p: "Here the worlds are small ordinary categories, where composing has exactly one answer. In the picture, the pair $f,g$ has its own composite $k$, a different arrow from $h$. If your starting picture fits inside this world, with $h$ on $h$, then the claim that $h$ is a composite of $f$ and $g$ is false there." },
    { p: "One world settles it because every move you have is a horn filling, and an ordinary category can fill every inner horn too: composites exist and associativity holds. So anything you could ever build from the starting picture can also be built in the test world. If the goal were reachable, it would be true there. It is false there, so it is not reachable." },
    { p: "Two things can go wrong, and both teach something. If a given fact fails in your world, the world does not contain your picture. If the goal is <i>true</i> in your world, the world proves nothing: try a different one. And if the level allows undoing every arrow, the test world must allow it too." }
  ]},

  { id: "squares", before: "natsq", title: "Arrows between arrows", body: [
    { p: "So far arrows went between dots. Now treat an arrow $f$ itself as a thing, and ask what an arrow from $f$ to another arrow $f'$ should be. The answer is a <b>commuting square</b>: sides $\\alpha$ and $\\beta$ joining the ends of $f$ to the ends of $f'$, so that going round either way agrees." },
    { diagram: { dots: [{id:"a",label:"a",x:25,y:12},{id:"b",label:"b",x:75,y:12},{id:"c",label:"a'",x:25,y:48},{id:"d",label:"b'",x:75,y:48}],
                 arrows: [{from:"a",to:"b",label:"f"},{from:"a",to:"c",label:"α"},{from:"b",to:"d",label:"β"},{from:"c",to:"d",label:"f'"},{from:"a",to:"d",label:"d"}],
                 fills: [["a","b","d"],["a","c","d"]] } },
    { p: "In an $\\infty$-category \"agrees\" cannot mean equal. Each way round is a composite, so each is a triangle. The square commutes when the two triangles <i>share their diagonal</i>: $d$ is a composite of $f$ then $\\beta$, and also of $\\alpha$ then $f'$. A square is two triangles glued along one side." },
    { p: "These squares are the arrows of a new $\\infty$-category, written $\\mathrm{Fun}(\\Delta^1,C)$: its dots are the arrows of $C$. Stack two squares and you can paste them into one; that is composition there. With a bigger shape $K$ in place of a single arrow you get <b>natural transformations</b>: one square for every arrow of $K$." },
    { p: "The last theorem of the game lives here. A natural transformation is invertible as soon as each of its sides is. No property of the squares needs to be assumed: the return squares can be <i>built</i>, using only horn filling." }
  ]}
];

/* Glossary, grouped by world in the order terms are met. */
HC.Glossary = [
  {"term":"Dot (vertex)","world":1,"essential":false,"plain":"A place on the board. Arrows begin and end at dots, and a dot on its own is the simplest shape there is.","formal":"A 0-simplex: a single point of the simplicial set.","eg":"Every board starts with dots: in <i>Constructing a composite</i> they are the three corners of a trip.","see":["Arrow (edge)","Simplicial set"]},
  {"term":"Arrow (edge)","world":1,"essential":false,"plain":"A one-way trip from one dot to another. It has a direction, so a trip from a to b is not a trip from b to a.","formal":"A 1-simplex, with a source vertex and a target vertex.","eg":"In <i>Constructing a composite</i> you click f and then g, because g starts where f ends.","see":["Dot (vertex)","Composite","Identity (degenerate simplex)"]},
  {"term":"Composite","world":2,"essential":true,"plain":"An arrow $x$ together with a triangle $(f,g\\,;\\,x)$ as evidence. A pair of arrows can have several.","formal":"An edge $x$ with a 2-simplex $\\sigma$ whose boundary is $(f,g\\,;\\,x)$. In an $\\infty$-category it is unique only up to homotopy.","eg":"In <i>Composites are not unique</i> the pair $f,g$ gets two composites, and neither is more correct than the other.","see":["Triangle","Homotopy","Associativity"]},
  {"term":"Triangle","world":1,"essential":true,"plain":"A 2-simplex with three corners and three faces. It is written by its boundary $(d_2,d_0\\,;\\,d_1)$.","formal":"A 2-simplex $\\Delta^2\\to X$: three vertices, three edges and one face. Faces: $d_2$ joins corners 0, 1; $d_0$ joins 1, 2; $d_1$ joins 0, 2.","eg":"<i>Reading a triangle</i> asks which triangle has a given long side.","see":["Composite","Simplex","Tetrahedron"]},
  {"term":"Simplex","world":1,"essential":false,"plain":"A shape of one fixed dimension: a dot in dimension 0, an arrow in 1, a triangle in 2, a solid in 3. The game never needs anything above dimension 3.","formal":"The $n$-simplex $\\Delta^n$: the convex hull of $n+1$ vertices, with faces obtained by forgetting one vertex at a time.","eg":"The solid in <i>A fourth face</i> is a 3-simplex with four triangles for faces.","see":["Triangle","Tetrahedron","Simplicial set"]},
  {"term":"Face","world":1,"essential":false,"plain":"One of the sides of a simplex: an edge of a triangle, or a triangle on a solid. What you are given and what you are asked to fill are always faces.","formal":"A face of $\\Delta^n$ is the image of a coface map $d^i:\\Delta^{n-1}\\to\\Delta^n$, which forgets the vertex $i$.","eg":"In <i>Reading a triangle</i> you find a triangle from its face $d_1$.","see":["Simplex","Horn","Boundary"]},
  {"term":"Tetrahedron","world":3,"essential":true,"plain":"A solid with four triangles for faces that have to agree along their edges. Three faces that fit always leave exactly one more to fill.","formal":"A 3-simplex $\\Delta^3$ with four 2-faces, six edges and four vertices.","eg":"In <i>Two bracketings</i> the solid relates the two ways of bracketing three arrows.","see":["Horn","Associativity","Simplex"]},
  {"term":"Simplicial set","world":1,"essential":false,"plain":"A shape built from dots, arrows, triangles and solids, glued so that shared sides agree. Every board in the game is one.","formal":"A functor $\\Delta^{op}\\to\\mathrm{Set}$: a set of $n$-simplices for each $n$, with face and degeneracy maps satisfying the simplicial identities.","eg":"<i>Sandbox</i> lets you build one by hand.","see":["Simplex","Map","Nerve"]},
  {"term":"Horn","world":2,"essential":true,"plain":"A simplex with its inside and one face removed — the situation you are given to complete. Which face is missing decides whether the horn may be filled.","formal":"$\\Lambda^n_k\\subset\\Delta^n$: the union of all faces of $\\Delta^n$ except the one opposite vertex $k$.","eg":"Every puzzle starts with a horn: three sides of a triangle, or three faces of a solid.","see":["Inner horn","Outer horn","Filler"]},
  {"term":"Inner horn","world":2,"essential":true,"plain":"A horn whose missing face is not at either end of the trip. These are the ones an $\\infty$-category is guaranteed to fill.","formal":"$\\Lambda^n_k$ with $0<k<n$.","eg":"<i>A fourth face</i> fills $\\Lambda^3_2$, a solid missing a middle face.","see":["Horn","Outer horn","Quasi-category (∞-category)"]},
  {"term":"Filler","world":2,"essential":false,"plain":"A simplex that completes a horn: the piece the puzzle asks you to add. A filling exists only if the faces already there agree.","formal":"An extension $\\Delta^n\\to X$ of a map $\\Lambda^n_k\\to X$.","eg":"The new triangle in <i>Constructing a composite</i> is a filler.","see":["Horn","Lift"]},
  {"term":"Identity (degenerate simplex)","world":1,"essential":true,"plain":"The do-nothing arrow $1_a$ at a dot, and the degenerate triangles $s_0f$, $s_1f$ built on it.","formal":"$s_0(v)=1_v$ is the identity edge; $s_0(f)$ and $s_1(f)$ are degenerate 2-simplices.","eg":"<i>Free triangles</i> shows the two degenerate triangles of an arrow.","see":["Arrow (edge)","Associativity","Homotopy"]},
  {"term":"Degenerate triangle","world":1,"essential":true,"plain":"A triangle with a repeated corner, such as $s_0f$ or $s_1f$. It exists without being built.","formal":"$s_0f=(1_a,f\\,;\\,f)$ and $s_1f=(f,1_b\\,;\\,f)$ for $f:a\\to b$; the degenerate 2-simplices on $f$.","eg":"<i>Free triangles</i> asks you to find both, and <i>Repeated corners</i> finds one as a face of a tetrahedron.","see":["Identity (degenerate simplex)","Face","Triangle"]},
  {"term":"Associativity","world":3,"essential":false,"plain":"The two ways of bracketing three arrows are related by a triangle, not by an equation.","formal":"The two bracketings of $f,g,h$ are faces of a 3-simplex; in a quasi-category they are homotopic, not equal.","eg":"<i>Two bracketings</i> proves exactly this.","see":["Tetrahedron","Homotopy","Quasi-category (∞-category)"]},
  {"term":"Homotopy","world":3,"essential":true,"plain":"Parallel arrows $x,y$ joined by a triangle $(x,1_b\\,;\\,y)$. This is the definition; symmetry and transitivity are theorems.","formal":"$x\\simeq y$ iff some 2-simplex has boundary $(x,1_b\\,;\\,y)$. In a quasi-category this is an equivalence relation.","eg":"<i>Two composites, one triangle</i> shows two different composites are homotopic.","see":["Equivalence relation","Homotopy category","Identity (degenerate simplex)"]},
  {"term":"Equivalence relation","world":4,"essential":false,"plain":"A relation that is reflexive, symmetric and transitive: everything is related to itself, the relation runs both ways, and it chains. Homotopy of arrows is one.","formal":"Homotopy of edges is reflexive, symmetric and transitive, so $hX$ has well-defined hom-sets.","eg":"<i>Transitivity is a theorem</i> builds a chain of homotopies into a single one.","see":["Homotopy","Homotopy category"]},
  {"term":"Quasi-category (∞-category)","world":4,"essential":true,"plain":"A shape where every inner horn fills. Arrows compose and solids close, consistently, though not uniquely.","formal":"A simplicial set with fillers for all inner horns $\\Lambda^n_k\\to\\Delta^n$, $0<k<n$ (Boardman-Vogt, Joyal).","eg":"Every level except the Bones and Possible-or-not worlds happens in one.","see":["Inner horn","Nerve","Kan complex"]},
  {"term":"Homotopy category","world":4,"essential":false,"plain":"What you get by declaring homotopic arrows to be equal. It is an ordinary category, obtained from the $\\infty$-category by forgetting the witnesses.","formal":"$hX$: objects are the vertices, morphisms are homotopy classes of edges.","eg":"<i>Chains of homotopies</i> settles a statement that is read in $hX$.","see":["Homotopy","Equivalence relation","Nerve"]},
  {"term":"Outer horn","world":5,"essential":true,"plain":"A horn missing a face at one of the ends of the trip. A general $\\infty$-category need not fill it, except along reversible arrows.","formal":"$\\Lambda^n_0$ or $\\Lambda^n_n$.","eg":"<i>A left inverse</i> fills $\\Lambda^2_0$ to produce an inverse; <i>One way only</i> shows a case where no filling exists.","see":["Inner horn","Kan complex","Joyal's theorem"]},
  {"term":"Kan complex","world":5,"essential":true,"plain":"A simplicial set where every horn fills, inner and outer. Every arrow then has inverses up to homotopy.","formal":"A simplicial set with fillers for all horns $\\Lambda^n_k\\to\\Delta^n$, $0\\le k\\le n$.","eg":"<i>A missing first leg</i> would be impossible in a general $\\infty$-category but is fine here.","see":["Outer horn","∞-groupoid","Isomorphism (equivalence)"]},
  {"term":"Left / right inverse","world":5,"essential":false,"plain":"An arrow that undoes $f$, either before it or after it. One side alone is weaker than an inverse on both sides.","formal":"$g$ with a triangle $(f,g\\,;\\,1_a)$ (left inverse), $k$ with $(k,f\\,;\\,1_b)$ (right inverse).","eg":"<i>A one-sided inverse</i> has a left inverse but no right one.","see":["Isomorphism (equivalence)","Retraction"]},
  {"term":"Isomorphism (equivalence)","world":5,"essential":true,"plain":"A reversible arrow: it has inverses on both sides, up to homotopy. Along an isomorphism, outer horns can be filled.","formal":"An edge with a left and a right inverse up to homotopy; an isomorphism in $hX$.","eg":"<i>Inverses on both sides</i> builds both inverses and shows they agree.","see":["Kan complex","Joyal's theorem","Natural isomorphism"]},
  {"term":"∞-groupoid","world":5,"essential":true,"plain":"Another name for a Kan complex: a shape where every arrow reverses. It models a space.","formal":"By the homotopy hypothesis, Kan complexes model spaces up to homotopy.","eg":"The Playground, with every tool unlocked, is one.","see":["Kan complex","Homotopy hypothesis","Fundamental group"]},
  {"term":"Homotopy hypothesis","world":5,"essential":false,"plain":"Kan complexes, where all arrows are invertible, model spaces; and every space can be built this way.","formal":"The homotopy theory of Kan complexes is equivalent to that of CW complexes; both model homotopy types.","eg":"<i>Two cells, one boundary</i> builds a 2-sphere from two triangles glued along their rims.","see":["∞-groupoid","Kan complex","Geometric realisation"]},
  {"term":"Fundamental group","world":5,"essential":false,"plain":"Loops at a point, up to homotopy, with composition. It records which round trips can be tightened to nothing.","formal":"$\\pi_1(X,x)$: endomorphisms of $x$ in the homotopy category of a Kan complex $X$.","eg":"<i>A closed loop</i> shows a loop that cannot be filled in, so its class is not the identity.","see":["∞-groupoid","Homotopy hypothesis"]},
  {"term":"Category","world":6,"essential":false,"plain":"Objects and arrows between them, where arrows compose and every object has a do-nothing arrow. Composition gives a definite arrow instead of a homotopy class.","formal":"A category $\\mathcal C$: objects, morphisms, associative composition, an identity morphism per object.","eg":"The composition table in <i>Only one filler</i> is a category's table.","see":["Functor","Nerve","Associativity"]},
  {"term":"Functor","world":6,"essential":false,"plain":"A map between categories that sends objects to objects and arrows to arrows, keeping composition and identities.","formal":"A functor $F:\\mathcal C\\to\\mathcal D$ with $F(g\\circ f)=F(g)\\circ F(f)$ and $F(1_x)=1_{Fx}$.","eg":"The map you follow in <i>Lifting a path</i> carries one shape onto the other.","see":["Category","Map","Natural transformation"]},
  {"term":"Nerve","world":6,"essential":true,"plain":"A category drawn as shapes: its dots are objects, its arrows are maps, and its higher simplices are chains of maps run one after another.","formal":"$N(\\mathcal C)$: $n$-simplices are chains of $n$ composable morphisms. Every inner horn fills uniquely.","eg":"<i>The Rulebook</i> is the smallest example, with a single arrow.","see":["Category","Segal condition","Spine"]},
  {"term":"Spine","world":6,"essential":true,"plain":"The path of consecutive arrows inside a simplex, with everything else thrown away. Whether the spine can be filled, and how many ways, tells you what kind of shape you have.","formal":"$\\mathrm{Spine}^n\\subset\\Delta^n$: the union of the edges $\\{i,i+1\\}$. The inclusion is inner anodyne, and filling every spine uniquely is the Segal condition.","eg":"<i>Fill the spine</i> fills it; <i>Nerve or not?</i> asks when the filling is unique.","see":["Nerve","Segal condition","Inner anodyne map"]},
  {"term":"Segal condition","world":6,"essential":false,"plain":"Every spine fills in exactly one way. It is the test that turns a shape into the nerve of a category.","formal":"$X_n\\to X_1\\times_{X_0}\\cdots\\times_{X_0}X_1$ is a bijection for each $n$; equivalent to being a nerve.","eg":"<i>One of each</i> passes the test; <i>Too many fillers</i> fails it.","see":["Spine","Nerve"]},
  {"term":"Skeleton","world":7,"essential":true,"plain":"What is left after you throw away everything above a dimension: the dots alone, or the dots and arrows.","formal":"$\\mathrm{sk}_nX$: the simplicial subset generated by simplices of dimension $\\le n$.","eg":"<i>Skeleta</i> removes a top-dimensional cell and reveals the skeleton below.","see":["Coskeleton","Boundary","Cell"]},
  {"term":"Boundary","world":7,"essential":false,"plain":"The rim of a shape with its inside removed: a hollow triangle, or a solid with no interior.","formal":"$\\partial\\Delta^n=\\mathrm{sk}_{n-1}\\Delta^n$: the union of all faces of $\\Delta^n$.","eg":"<i>A hollow tetrahedron</i> starts from the boundary of a tetrahedron.","see":["Skeleton","Cell","Horn"]},
  {"term":"Cell","world":7,"essential":true,"plain":"A triangle or solid glued onto a rim. Adding cells one dimension at a time is how this world builds shapes and takes them apart.","formal":"Attaching an $n$-cell: glue $\\Delta^n$ to $X$ along a map $\\partial\\Delta^n\\to X$ (a pushout).","eg":"<i>Attaching a cell</i> glues a triangle onto a circle and fills its hole.","see":["Boundary","Skeleton","Coskeleton"]},
  {"term":"Coskeleton","world":7,"essential":true,"plain":"Fill every hollow shape in the only way possible. If a filling is not forced, the coskeleton leaves it out.","formal":"$(\\mathrm{cosk}_nX)_m=\\mathrm{Hom}(\\mathrm{sk}_n\\Delta^m,X)$; right adjoint to $\\mathrm{sk}_n$.","eg":"<i>The coskeleton</i> builds a coskeleton one dimension at a time.","see":["Skeleton","Cell","Nerve"]},
  {"term":"Geometric realisation","world":7,"essential":false,"plain":"The space you get by treating the picture as made of solid pieces: dots become points, arrows become intervals, triangles become filled triangles.","formal":"$|X|=\\mathrm{colim}_{\\Delta^n\\to X}|\\Delta^n|$, gluing topological simplices along their faces.","eg":"<i>Two cells, one boundary</i> realises to a sphere.","see":["Homotopy hypothesis","Euler characteristic"]},
  {"term":"Euler characteristic","world":7,"essential":false,"plain":"Dots minus arrows plus triangles, and so on. Horn filling does not change it, so a hole is preserved.","formal":"$\\chi(X)=\\sum_n(-1)^n\\,\\#\\{\\text{non-degenerate } n\\text{-simplices}\\}$ for finite $X$.","eg":"A hollow triangle has $\\chi=0$; filled, $\\chi=1$, and no sequence of horn fillings can change that.","see":["Geometric realisation","Anodyne map"]},
  {"term":"Anodyne map","world":8,"essential":true,"plain":"An inclusion built purely out of horn fillings, so it never changes the shape. If a goal would change the shape, no horn move can reach it.","formal":"The saturated class generated by $\\Lambda^n_k\\subset\\Delta^n$. $\\partial\\Delta^2\\subset\\Delta^2$ is not anodyne.","eg":"<i>Fill the spine</i> is anodyne; <i>Two routes, one composite?</i> is not.","see":["Inner anodyne map","Counterexample","Left lifting property"]},
  {"term":"Inner anodyne map","world":8,"essential":false,"plain":"Anodyne, but built only from inner horns. It is weaker than anodyne, and it is the one that matches $\\infty$-categories.","formal":"Saturated class generated by $\\Lambda^n_k\\subset\\Delta^n$ with $0<k<n$.","eg":"The spine inclusion in <i>Fill the spine</i> is inner anodyne.","see":["Anodyne map","Spine"]},
  {"term":"Counterexample","world":8,"essential":true,"plain":"A shape where the givens hold but the goal cannot be reached. Finding one is how you prove that a goal is impossible.","formal":"A map to the nerve of a category in which the required simplex does not exist.","eg":"<i>Two lone arrows</i> is a counterexample to a homotopy that is not forced.","see":["Anodyne map","Nerve"]},
  {"term":"Left lifting property","world":8,"essential":false,"plain":"The property of a shape $A\\to B$ that every square from it can be filled. Horn inclusions have it against $\\infty$-categories, and that is what makes them anodyne.","formal":"$i:A\\to B$ has the left lifting property against $p:X\\to S$ if every square $A\\to X$, $B\\to S$ has a diagonal.","eg":"In <i>Lifting a path</i> the lift exists exactly because the horn inclusion has this property.","see":["Anodyne map","Lifting problem","Inner fibration"]},
  {"term":"Map","world":9,"essential":true,"plain":"A rule sending each piece of one shape to a piece of another, keeping faces. Think of the second shape as the shadow of the first.","formal":"A morphism of simplicial sets $p:X\\to S$.","eg":"In <i>Lifting a path</i> the lower triangle is the shadow of the upper one.","see":["Lifting problem","Functor","Simplicial set"]},
  {"term":"Lift","world":9,"essential":true,"plain":"A solution to a lifting problem: a simplex upstairs over the right piece below, extending what is already there.","formal":"A map $B\\to X$ making the square commute.","eg":"In <i>Two lifts, one destination</i> two different arrows upstairs lie over the same arrow below.","see":["Lifting problem","Filler","Left fibration"]},
  {"term":"Lifting problem","world":9,"essential":true,"plain":"A square: a shape below, part of it upstairs, and the question of whether the rest can be filled upstairs without moving the shadow.","formal":"A square $A\\to X$, $B\\to S$ with $A\\subset B$; find $B\\to X$ making both triangles commute.","eg":"<i>Lifting a path</i> is the first one.","see":["Lift","Inner fibration","Left fibration"]},
  {"term":"Inner fibration","world":9,"essential":true,"plain":"A map for which every inner horn upstairs fills whenever its shadow downstairs already has.","formal":"$p$ has the right lifting property against $\\Lambda^n_k\\subset\\Delta^n$ for $0<k<n$.","eg":"In <i>Closing a lifted square</i> only the inner horn may be filled upstairs.","see":["Left fibration","Joyal's theorem","Right lifting property"]},
  {"term":"Left fibration","world":9,"essential":true,"plain":"A map that lets you lift any arrow of the shadow from a start you choose, and fill the horns that already know their first arrow.","formal":"$p$ has the right lifting property against $\\Lambda^n_k\\subset\\Delta^n$ for $0\\le k<n$.","eg":"<i>Lifting a path</i> and <i>A missing first leg, lifted</i> are both about this map.","see":["Inner fibration","Lift","Conservative"]},
  {"term":"Kan fibration","world":9,"essential":false,"plain":"A map for which every horn upstairs fills whenever its shadow downstairs does — inner and outer alike.","formal":"$p$ has the right lifting property against all $\\Lambda^n_k\\subset\\Delta^n$, $0\\le k\\le n$. A Kan complex is a Kan fibration over a point.","eg":"An inner fibration is the softer version in <i>Closing a lifted square</i>; a Kan fibration would fill outer horns too.","see":["Inner fibration","Left fibration","Kan complex"]},
  {"term":"Conservative","world":9,"essential":false,"plain":"A map that does not lose reversibility: an arrow above the shadow is reversible whenever its shadow is.","formal":"$p$ reflects equivalences: $p(f)$ an equivalence implies $f$ an equivalence.","eg":"<i>Invertible above too</i> is conservative; <i>Invertible below only</i> is not.","see":["Left fibration","Isomorphism (equivalence)"]},
  {"term":"Right lifting property","world":9,"essential":false,"plain":"The property of a map that every square into it can be filled. Fibrations are exactly the maps with this property against horn inclusions.","formal":"$p:X\\to S$ has the right lifting property against $i:A\\to B$ if every square $A\\to X$, $B\\to S$ has a diagonal $B\\to X$.","eg":"Being an inner fibration is the right lifting property against inner horn inclusions.","see":["Left lifting property","Inner fibration"]},
  {"term":"Idempotent","world":10,"essential":false,"plain":"An arrow $e$ with a triangle $(e,e\\,;\\,e)$: doing it twice is a composite of doing it once.","formal":"An edge $e$ with a 2-simplex $(e,e,e)$.","eg":"<i>Twice is once</i>.","see":["Isomorphism (equivalence)"]},
  {"term":"Retraction","world":10,"essential":false,"plain":"A one-sided inverse: an arrow that undoes $f$ in one direction only.","formal":"$r$ with $r\\circ f\\simeq 1$ is a retraction of $f$; dually a section.","eg":"<i>A one-sided inverse</i> has a retraction but no section.","see":["Left / right inverse","Isomorphism (equivalence)"]},
  {"term":"Joyal's theorem","world":10,"essential":true,"plain":"An outer horn can be filled when the arrow it has to undo is an isomorphism.","formal":"In an $\\infty$-category, $\\Lambda^n_0\\to X$ ($n\\ge2$) extends to $\\Delta^n$ if its first edge is an equivalence; conversely such an edge is an equivalence.","eg":"<i>Joyal's theorem</i> is the boss level that uses it.","see":["Outer horn","Isomorphism (equivalence)","Inner fibration"]},
  {"term":"Commuting square","world":11,"essential":true,"plain":"Two routes from one corner to the opposite one, plus a filling between them. It is an arrow between arrows.","formal":"A map $\\Delta^1\\times\\Delta^1\\to C$; an edge of $\\mathrm{Fun}(\\Delta^1,C)$.","eg":"<i>A commuting square</i> is the first one.","see":["Natural transformation","Homotopy","Natural isomorphism"]},
  {"term":"Natural transformation","world":11,"essential":true,"plain":"A family of arrows, one per object, that makes every square commute. It is how a construction on objects becomes a construction on maps.","formal":"An edge of $\\mathrm{Fun}(K,C)$, i.e. a map $K\\times\\Delta^1\\to C$.","eg":"<i>Pasting squares</i> composes two of them.","see":["Commuting square","Natural isomorphism","Functor"]},
  {"term":"Natural isomorphism","world":11,"essential":false,"plain":"A natural transformation whose every side is reversible. It says two constructions agree everywhere, coherently.","formal":"An equivalence in $\\mathrm{Fun}(K,C)$; equivalently each component is an equivalence in $C$.","eg":"<i>Invertible, piece by piece</i>.","see":["Natural transformation","Isomorphism (equivalence)"]}
];

HC.Epilogue = {
  "title": "What you did, and where to go next",
  "html": "<h3>What you did</h3><p>Every level used one idea. A <b>horn</b> is a simplex with one face and its inside removed, and a move fills it back in. In an ∞-category the inner horns can always be filled, and that single rule replaces the composition law of an ordinary category.</p><p>Filling a horn of two arrows gave you <b>composition</b>, and filling it twice showed that a composite is something you choose, with a triangle as the record of the choice. Tetrahedra then made the choices agree: you proved that any two composites are <b>homotopic</b>, that homotopy is an equivalence relation, that it is respected by composition, and that bracketing three or four arrows makes no difference. Those are exactly the statements needed to say that an ∞-category has a <b>homotopy category</b>, an ordinary category obtained by treating homotopic arrows as equal.</p><p>You saw the two extremes. In the <b>nerve</b> of a category every horn has exactly one filler, so nothing is left to choose. In a <b>Kan complex</b> every horn fills, outer ones included, so every arrow can be undone, and the shape behaves like a space. <b>Joyal's theorem</b> connects them: in an ∞-category an outer horn $\\Lambda^n_0$ can be filled exactly when the arrow it starts with is an <b>isomorphism</b>. So a Kan complex is the same thing as an ∞-category in which every arrow is an isomorphism. There is also a relative form, which the lifting world used: for an inner fibration $p:X\\to S$, a lifting problem against $\\Lambda^n_0\\hookrightarrow\\Delta^n$ has a solution whenever the first edge is an isomorphism in $X$.</p><p>You also proved things impossible, by placing a picture inside a small category where the goal is false. You built shapes cell by cell, took <b>skeleta</b> and <b>coskeleta</b>, and worked over a second shape through a <b>left fibration</b>, where an arrow over an isomorphism must itself be one. The last world treated arrows as objects: commuting squares are the arrows of $\\mathrm{Fun}(\\Delta^1,C)$, and you showed that a <b>natural transformation</b> is invertible as soon as each of its components is.</p><h3>Further reading</h3><p><b>1. Ordinary category theory.</b> The game used categories, functors and natural transformations informally. The next things to learn are limits and colimits, adjunctions, and the Yoneda lemma, since every one of them has a higher version. Good places to start are Tom Leinster's <i>Basic Category Theory</i> and Emily Riehl's <i>Category Theory in Context</i>, both free online.</p><p><b>2. Simplicial sets and homotopy.</b> Here a simplicial set was a picture. Formally it is a functor from the category of finite ordered sets, and the pictures are its non-degenerate simplices. Learn the face and degeneracy maps, geometric realisation, and why Kan complexes model spaces. Greg Friedman's <i>An elementary illustrated introduction to simplicial sets</i> is gentle, and Goerss and Jardine's <i>Simplicial Homotopy Theory</i> is the standard reference.</p><p><b>3. Quasi-categories properly.</b> Now redo what you did here in general: mapping spaces, the homotopy category, equivalences, Joyal's lifting theorem, and the fibrations (inner, left and right, Kan, isofibrations). Charles Rezk's notes <i>Introduction to quasicategories</i> and Markus Land's <i>Introduction to Infinity-Categories</i> are written for a first pass. Denis-Charles Cisinski's <i>Higher Categories and Homotopical Algebra</i> goes further.</p><p><b>4. The theory itself.</b> Limits and colimits in an ∞-category, adjunctions, straightening and unstraightening (which turns the left fibrations you met into functors to spaces), presentable and stable ∞-categories. Jacob Lurie's <i>Higher Topos Theory</i> and <i>Higher Algebra</i> are the main sources, and Riehl and Verity's <i>Elements of ∞-Category Theory</i> develops the same material in a way that does not depend on the model.</p><p>A practical suggestion: when a proof in one of these books says a map is inner anodyne, or that some horn can be filled, try drawing the picture and filling it by hand.</p>"
};
