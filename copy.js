/* HORNFILLER — every word the game shows, in one file. Nothing else needs editing.

   Strings are String.raw`...`, so LaTeX keeps its single backslashes: $f : a \to b$.
   A backtick or the two characters ${ inside prose is written with a backslash.
   Anything wrapped in ordinary "double quotes" instead contains one of those, and is escaped normally.
   Layout: worlds, intro, then one block per level (in world order), then reasons, notes, glossary, ending. */

var HC = (typeof window !== 'undefined' ? window : globalThis).HC || ((typeof window !== 'undefined' ? window : globalThis).HC = {});

HC.Copy = {
  /* ==== worlds ============================================================ */

  worlds: [
    {
      id: 1,
      title: String.raw`Simplicial sets`,
      mathTitle: String.raw`Simplicial sets`,
      blurb: String.raw``,
      definition: String.raw`A <b>simplicial set</b> $X$ has a set of vertices, a set of arrows, a set of triangles, a set of tetrahedra, and so on, with face maps: an arrow has a source and a target, and a triangle $\sigma$ has three arrows as faces, $d_2\sigma$ from corner $0$ to $1$, $d_0\sigma$ from $1$ to $2$ and $d_1\sigma$ from $0$ to $2$, written $\sigma=(d_2\sigma,\,d_0\sigma\,;\,d_1\sigma)$. It also has degeneracies: every vertex $a$ has an arrow $1_a:a\to a$, and every arrow $f:a\to b$ has triangles $s_0f=(1_a,f\,;\,f)$ and $s_1f=(f,1_b\,;\,f)$.`,
      definitionDiagram: {
        dots: [
          { id: String.raw`a`, label: String.raw`0`, x: 12, y: 44 },
          { id: String.raw`b`, label: String.raw`1`, x: 50, y: 8 },
          { id: String.raw`c`, label: String.raw`2`, x: 88, y: 44 }
        ],
        arrows: [
          { from: String.raw`a`, to: String.raw`b`, label: String.raw`d₂σ` },
          { from: String.raw`b`, to: String.raw`c`, label: String.raw`d₀σ` },
          { from: String.raw`a`, to: String.raw`c`, label: String.raw`d₁σ` }
        ],
        fills: [[String.raw`a`, String.raw`b`, String.raw`c`]]
      },
      hornsFill: String.raw`none`,
      brief: {
        sofar: String.raw`Nothing yet. Every board in this game is a simplicial set, so this world teaches you to read one.`,
        now: String.raw`You will look at triangles and tetrahedra that are already drawn and pick out the one a question describes. Nothing is built here; you only point.`,
        new: String.raw`Faces $d_0,d_1,d_2$ of a triangle, the notation $(f,g\,;\,x)$ for a triangle with legs $f,g$ and long side $x$, the identity arrow $1_a$ at each vertex, and the two degenerate triangles $s_0f$ and $s_1f$ on each arrow.`,
        about: String.raw`Every later level names triangles by their three sides, so a minute spent learning to read $(f,g\,;\,x)$ here saves a lot of squinting later.`,
        picture: {
          caption: String.raw`The triangle $(f,g\,;\,x)$: first leg $f$, second leg $g$, long side $x$.`,
          dots: [
            { id: String.raw`a`, label: String.raw`0`, x: 12, y: 44 },
            { id: String.raw`b`, label: String.raw`1`, x: 50, y: 10 },
            { id: String.raw`c`, label: String.raw`2`, x: 88, y: 44 }
          ],
          arrows: [
            { from: String.raw`a`, to: String.raw`b`, label: String.raw`f` },
            { from: String.raw`b`, to: String.raw`c`, label: String.raw`g` },
            { from: String.raw`a`, to: String.raw`c`, label: String.raw`x` }
          ],
          fills: [[String.raw`a`, String.raw`b`, String.raw`c`]]
        }
      }
    },
    {
      id: 2,
      title: String.raw`Composition`,
      mathTitle: String.raw`Composition`,
      blurb: String.raw``,
      definition: String.raw`Arrows $f:a\to b$ and $g:b\to c$ form a <b>horn</b> $\Lambda^2_1$. A <b>composite</b> of $f$ and $g$ is an arrow $x:a\to c$ together with a triangle $(f,g\,;\,x)$; that triangle is a <b>filler</b> of the horn.`,
      definitionDiagram: {
        dots: [
          { id: String.raw`a`, label: String.raw`a`, x: 12, y: 44 },
          { id: String.raw`b`, label: String.raw`b`, x: 50, y: 8 },
          { id: String.raw`c`, label: String.raw`c`, x: 88, y: 44 }
        ],
        arrows: [
          { from: String.raw`a`, to: String.raw`b`, label: String.raw`f` },
          { from: String.raw`b`, to: String.raw`c`, label: String.raw`g` },
          { from: String.raw`a`, to: String.raw`c`, label: String.raw`x`, dashed: true }
        ],
        ghost: [[String.raw`a`, String.raw`b`, String.raw`c`]]
      },
      hornsFill: String.raw`inner`,
      brief: {
        sofar: String.raw`You can read a triangle from its three sides and you know the degenerate triangles $s_0f$ and $s_1f$.`,
        now: String.raw`You will take two arrows that meet end to start and add the missing third side together with a triangle on all three. Then you'll do it twice on the same pair and get two different answers.`,
        new: String.raw`The tool Compose, which fills the horn $\Lambda^2_1$; the words horn, filler and composite.`,
        about: String.raw`Here a composite comes with a witness, the triangle that shows it's one. The game never decides that one composite is the right one, and the third level makes that visible.`,
        picture: {
          caption: String.raw`Two sides are given. Compose draws the third side and fills the triangle.`,
          dots: [
            { id: String.raw`a`, label: String.raw`a`, x: 12, y: 44 },
            { id: String.raw`b`, label: String.raw`b`, x: 50, y: 10 },
            { id: String.raw`c`, label: String.raw`c`, x: 88, y: 44 }
          ],
          arrows: [
            { from: String.raw`a`, to: String.raw`b`, label: String.raw`f` },
            { from: String.raw`b`, to: String.raw`c`, label: String.raw`g` },
            { from: String.raw`a`, to: String.raw`c`, label: String.raw`?`, dashed: true }
          ],
          fills: [],
          ghost: [[String.raw`a`, String.raw`b`, String.raw`c`]]
        }
      }
    },
    {
      id: 3,
      title: String.raw`Tetrahedra`,
      mathTitle: String.raw`Tetrahedra`,
      blurb: String.raw``,
      definition: String.raw`A <b>tetrahedron</b> has corners $0,1,2,3$ and four triangular faces $d_0,\dots,d_3$, where $d_i$ is the face that omits corner $i$. Three faces whose missing fourth face is $d_1$ or $d_2$ form an <b>inner horn</b> $\Lambda^3_1$ or $\Lambda^3_2$, and a filler of it is a tetrahedron with those three faces.`,
      definitionDiagram: {
        dots: [
          { id: String.raw`a`, label: String.raw`0`, x: 8, y: 46 },
          { id: String.raw`b`, label: String.raw`1`, x: 50, y: 6 },
          { id: String.raw`c`, label: String.raw`2`, x: 50, y: 32 },
          { id: String.raw`d`, label: String.raw`3`, x: 92, y: 46 }
        ],
        arrows: [
          { from: String.raw`a`, to: String.raw`b`, label: String.raw`` },
          { from: String.raw`b`, to: String.raw`d`, label: String.raw`` },
          { from: String.raw`a`, to: String.raw`d`, label: String.raw`` },
          { from: String.raw`a`, to: String.raw`c`, label: String.raw`` },
          { from: String.raw`c`, to: String.raw`d`, label: String.raw`` },
          { from: String.raw`b`, to: String.raw`c`, label: String.raw`` }
        ],
        fills: [
          [String.raw`a`, String.raw`b`, String.raw`c`],
          [String.raw`b`, String.raw`c`, String.raw`d`],
          [String.raw`a`, String.raw`c`, String.raw`d`]
        ]
      },
      hornsFill: String.raw`inner`,
      brief: {
        sofar: String.raw`You can construct composites, and you have seen one pair of arrows get two different ones.`,
        now: String.raw`You will hand the Tetrahedron tool three triangles that fit together and receive the fourth face. With it you relate the two ways of composing three arrows, compare two composites of the same pair, and check what composing with an identity does.`,
        new: String.raw`The tool Tetrahedron, which fills the inner horns $\Lambda^3_1$ and $\Lambda^3_2$; homotopy $x\simeq y$, defined in the note before the third level; the tool Same, which you earn there.`,
        about: String.raw`Each answer you get here is a triangle, never an equation. A tetrahedron is the smallest place where three triangles can force a fourth.`,
        picture: {
          caption: String.raw`Three faces of a tetrahedron are filled; the tool supplies the fourth.`,
          dots: [
            { id: String.raw`a`, label: String.raw`0`, x: 8, y: 46 },
            { id: String.raw`b`, label: String.raw`1`, x: 50, y: 6 },
            { id: String.raw`c`, label: String.raw`2`, x: 50, y: 32 },
            { id: String.raw`d`, label: String.raw`3`, x: 92, y: 46 }
          ],
          arrows: [
            { from: String.raw`a`, to: String.raw`b`, label: String.raw`` },
            { from: String.raw`b`, to: String.raw`d`, label: String.raw`` },
            { from: String.raw`a`, to: String.raw`d`, label: String.raw`` },
            { from: String.raw`a`, to: String.raw`c`, label: String.raw`` },
            { from: String.raw`c`, to: String.raw`d`, label: String.raw`` },
            { from: String.raw`b`, to: String.raw`c`, label: String.raw`` }
          ],
          fills: [
            [String.raw`a`, String.raw`b`, String.raw`c`],
            [String.raw`b`, String.raw`c`, String.raw`d`],
            [String.raw`a`, String.raw`c`, String.raw`d`]
          ]
        }
      }
    },
    {
      id: 4,
      title: String.raw`Homotopy`,
      mathTitle: String.raw`Homotopy`,
      blurb: String.raw``,
      definition: String.raw`Parallel arrows $x,y:a\to b$ are <b>homotopic</b>, written $x\simeq y$, if there is a triangle $(x,1_b\,;\,y)$.`,
      definitionDiagram: {
        dots: [
          { id: String.raw`a`, label: String.raw`0 = a`, x: 10, y: 44 },
          { id: String.raw`b`, label: String.raw`1 = b`, x: 50, y: 8 },
          { id: String.raw`c`, label: String.raw`2 = b`, x: 90, y: 44 }
        ],
        arrows: [
          { from: String.raw`a`, to: String.raw`b`, label: String.raw`x` },
          {
            from: String.raw`b`,
            to: String.raw`c`,
            label: String.raw`1_b`,
            kind: String.raw`identity`,
            dashed: true
          },
          { from: String.raw`a`, to: String.raw`c`, label: String.raw`y` }
        ],
        fills: [[String.raw`a`, String.raw`b`, String.raw`c`]]
      },
      hornsFill: String.raw`inner`,
      brief: {
        sofar: String.raw`You can build tetrahedra, and you showed that two composites of the same pair are homotopic.`,
        now: String.raw`You will prove that homotopy can be reversed, that it chains, and that a homotopic arrow can replace another inside a triangle. Each proof is one tetrahedron with an identity among its edges, and each one you finish becomes a tool.`,
        new: String.raw`The theorem tools Flip (reverse a homotopy), Link (chain two) and Swap in (replace an arrow in a triangle by a homotopic one).`,
        about: String.raw`The definition $x\simeq y$ reads in one direction only, with $x$ first and $1_b$ after it. Everything that lets you treat homotopic arrows as interchangeable has to be earned, one tetrahedron at a time.`,
        picture: {
          caption: String.raw`A homotopy from $x$ to $y$: a triangle whose second leg is $1_b$.`,
          dots: [
            { id: String.raw`a`, label: String.raw`a`, x: 10, y: 44 },
            { id: String.raw`b`, label: String.raw`b`, x: 50, y: 10 },
            { id: String.raw`c`, label: String.raw`b`, x: 90, y: 44 }
          ],
          arrows: [
            { from: String.raw`a`, to: String.raw`b`, label: String.raw`x` },
            { from: String.raw`b`, to: String.raw`c`, label: String.raw`1_b`, kind: String.raw`identity` },
            { from: String.raw`a`, to: String.raw`c`, label: String.raw`y` }
          ],
          fills: [[String.raw`a`, String.raw`b`, String.raw`c`]]
        }
      }
    },
    {
      id: 5,
      title: String.raw`Kan complexes`,
      mathTitle: String.raw`Kan complexes`,
      blurb: String.raw``,
      definition: String.raw`A <b>Kan complex</b> is a simplicial set in which every horn $\Lambda^n_k$, $0\le k\le n$, has a filler. For $f:a\to b$, an arrow $g$ with a triangle $(f,g\,;\,1_a)$ is a <b>left inverse</b> of $f$, and an arrow $k$ with a triangle $(k,f\,;\,1_b)$ is a <b>right inverse</b>.`,
      definitionDiagram: {
        dots: [
          { id: String.raw`a`, label: String.raw`0`, x: 12, y: 10 },
          { id: String.raw`b`, label: String.raw`1`, x: 88, y: 10 },
          { id: String.raw`c`, label: String.raw`2`, x: 50, y: 48 }
        ],
        arrows: [
          { from: String.raw`a`, to: String.raw`b`, label: String.raw`f` },
          { from: String.raw`a`, to: String.raw`c`, label: String.raw`h` },
          { from: String.raw`b`, to: String.raw`c`, label: String.raw`?`, dashed: true }
        ],
        ghost: [[String.raw`a`, String.raw`b`, String.raw`c`]]
      },
      hornsFill: String.raw`all`,
      brief: {
        sofar: String.raw`Only inner horns could be filled, and homotopy became something you can reverse, chain and substitute.`,
        now: String.raw`You will fill outer horns too. Two arrows leaving the same vertex give you the third side; with $1_a$ as one of them, that third side is an inverse. Then you cancel arrows and invert a composite.`,
        new: String.raw`The two Solve tools, which fill the outer horns $\Lambda^2_0$ and $\Lambda^2_2$; outer tetrahedra $\Lambda^3_0$, $\Lambda^3_3$; left and right inverses; isomorphisms.`,
        about: String.raw`Think of the arrows as paths you can walk in a space. Walking a path backwards is always allowed in a space, and that is what the outer horns provide. The boss of this world turns the outer horns off again, so watch which steps needed them.`,
        picture: {
          caption: String.raw`Two arrows leave $a$. Solve supplies the side between their ends; with $h=1_a$ it's an inverse of $f$.`,
          dots: [
            { id: String.raw`a`, label: String.raw`a`, x: 12, y: 10 },
            { id: String.raw`b`, label: String.raw`b`, x: 88, y: 10 },
            { id: String.raw`c`, label: String.raw`c`, x: 50, y: 46 }
          ],
          arrows: [
            { from: String.raw`a`, to: String.raw`b`, label: String.raw`f` },
            { from: String.raw`a`, to: String.raw`c`, label: String.raw`h` },
            { from: String.raw`b`, to: String.raw`c`, label: String.raw`?`, dashed: true }
          ],
          fills: [],
          ghost: [[String.raw`a`, String.raw`b`, String.raw`c`]]
        }
      }
    },
    {
      id: 6,
      title: String.raw`Nerves of categories`,
      mathTitle: String.raw`Nerves of categories`,
      blurb: String.raw``,
      definition: String.raw`The <b>nerve</b> $N(\mathcal C)$ of a category $\mathcal C$ is the simplicial set whose $n$-simplices are chains $a_0\to a_1\to\dots\to a_n$ of composable morphisms. Its vertices are the objects, its arrows are the morphisms, and its triangles are the pairs $(f,g)$ with boundary $(f,g\,;\,g\circ f)$.`,
      definitionDiagram: {
        dots: [
          { id: String.raw`a`, label: String.raw`a`, x: 8, y: 36 },
          { id: String.raw`b`, label: String.raw`b`, x: 36, y: 12 },
          { id: String.raw`c`, label: String.raw`c`, x: 64, y: 36 },
          { id: String.raw`d`, label: String.raw`d`, x: 92, y: 12 }
        ],
        arrows: [
          { from: String.raw`a`, to: String.raw`b`, label: String.raw`f` },
          { from: String.raw`b`, to: String.raw`c`, label: String.raw`g` },
          { from: String.raw`c`, to: String.raw`d`, label: String.raw`h` }
        ]
      },
      hornsFill: String.raw`inner`,
      brief: {
        sofar: String.raw`In the worlds so far a pair of arrows could have many composites, related by homotopies.`,
        now: String.raw`You will work in pictures that come from ordinary categories, where a composition table gives each pair exactly one composite. Then you'll judge pictures yourself: is this one a nerve, and if not, which pair of arrows gives it away?`,
        new: String.raw`Nerves of categories; the composition table; the buttons It is a nerve and Not a nerve, which asks for a horn $\Lambda^2_1$ with no filler or with two.`,
        about: String.raw`A nerve is the special case with no choices left: every pair of arrows that meet has exactly one triangle on it. A picture fails the test when some pair has no triangle or has two.`,
        picture: {
          caption: String.raw`In a nerve the pair $f,g$ has exactly one triangle, with long side $g\circ f$.`,
          dots: [
            { id: String.raw`a`, label: String.raw`a`, x: 12, y: 44 },
            { id: String.raw`b`, label: String.raw`b`, x: 50, y: 10 },
            { id: String.raw`c`, label: String.raw`c`, x: 88, y: 44 }
          ],
          arrows: [
            { from: String.raw`a`, to: String.raw`b`, label: String.raw`f` },
            { from: String.raw`b`, to: String.raw`c`, label: String.raw`g` },
            { from: String.raw`a`, to: String.raw`c`, label: String.raw`g∘f` }
          ],
          fills: [[String.raw`a`, String.raw`b`, String.raw`c`]]
        }
      }
    },
    {
      id: 7,
      title: String.raw`Skeleta and cells`,
      mathTitle: String.raw`Skeleta and cells`,
      blurb: String.raw``,
      definition: String.raw`The <b>$n$-skeleton</b> $\mathrm{sk}_nX$ is the simplicial subset of $X$ generated by its simplices of dimension at most $n$, and $\partial\Delta^n=\mathrm{sk}_{n-1}\Delta^n$ is the <b>boundary</b> of the $n$-simplex. <b>Attaching an $n$-cell</b> to $X$ along a map $\partial\Delta^n\to X$ means forming the pushout $X\sqcup_{\partial\Delta^n}\Delta^n$, and the <b>coskeleton</b> $\mathrm{cosk}_n$ is the right adjoint of $\mathrm{sk}_n$.`,
      definitionDiagram: {
        dots: [
          { id: String.raw`a`, label: String.raw`0`, x: 12, y: 46 },
          { id: String.raw`b`, label: String.raw`1`, x: 50, y: 8 },
          { id: String.raw`c`, label: String.raw`2`, x: 88, y: 46 }
        ],
        arrows: [
          { from: String.raw`a`, to: String.raw`b`, label: String.raw`` },
          { from: String.raw`b`, to: String.raw`c`, label: String.raw`` },
          { from: String.raw`a`, to: String.raw`c`, label: String.raw`` }
        ],
        ghost: [[String.raw`a`, String.raw`b`, String.raw`c`]]
      },
      hornsFill: String.raw`none`,
      brief: {
        sofar: String.raw`You filled horns: shapes with exactly one face missing.`,
        now: String.raw`You will build shapes from parts. Draw arrows, glue a triangle into a closed loop of three, attach two triangles to the same loop to get a sphere, pass to skeleta of a tetrahedron, attach four 2-cells to the edges of a tetrahedron, and finally fill that shell with a 3-cell to get a ball.`,
        new: String.raw`The tools Draw arrow, Glue triangle and Glue solid (attaching a 2-cell or a 3-cell), Peel (passing to a skeleton) and Fill in (the coskeleton); boundaries, cells, skeleta and coskeleta.`,
        about: String.raw`No horn is filled in this world. Gluing a cell onto a closed boundary can change the shape, for example by capping a circle with a disc, and the world after this one shows that filling horns never can.`,
        picture: {
          caption: String.raw`$\partial\Delta^2$: three sides with nothing inside. Glue triangle fills it with a 2-cell.`,
          dots: [
            { id: String.raw`a`, label: String.raw`0`, x: 12, y: 46 },
            { id: String.raw`b`, label: String.raw`1`, x: 50, y: 8 },
            { id: String.raw`c`, label: String.raw`2`, x: 88, y: 46 }
          ],
          arrows: [
            { from: String.raw`a`, to: String.raw`b`, label: String.raw`` },
            { from: String.raw`b`, to: String.raw`c`, label: String.raw`` },
            { from: String.raw`a`, to: String.raw`c`, label: String.raw`` }
          ],
          fills: [],
          ghost: [[String.raw`a`, String.raw`b`, String.raw`c`]]
        }
      }
    },
    {
      id: 8,
      title: String.raw`Anodyne maps`,
      mathTitle: String.raw`Anodyne maps`,
      blurb: String.raw``,
      definition: String.raw`A map of simplicial sets is <b>anodyne</b> if it belongs to the smallest class of maps that contains the horn inclusions $\Lambda^n_k\hookrightarrow\Delta^n$ and is closed under pushouts, composition and retracts. It is <b>inner anodyne</b> if the same holds with inner horns ($0<k<n$) only.`,
      definitionDiagram: {
        dots: [
          { id: String.raw`a`, label: String.raw`0`, x: 12, y: 46 },
          { id: String.raw`b`, label: String.raw`1`, x: 50, y: 8 },
          { id: String.raw`c`, label: String.raw`2`, x: 88, y: 46 }
        ],
        arrows: [
          { from: String.raw`a`, to: String.raw`b`, label: String.raw`` },
          { from: String.raw`b`, to: String.raw`c`, label: String.raw`` },
          { from: String.raw`a`, to: String.raw`c`, label: String.raw``, dashed: true }
        ],
        ghost: [[String.raw`a`, String.raw`b`, String.raw`c`]]
      },
      hornsFill: String.raw`inner`,
      brief: {
        sofar: String.raw`You have filled horns in many worlds and, in Skeleta and cells, attached cells onto closed boundaries.`,
        now: String.raw`Each level states a goal, and some of the goals are impossible. When a goal can be reached, reach it. When it cannot, press This can't be done and build a small category in which everything you were given holds and the goal fails.`,
        new: String.raw`The button This can't be done and the counter-models behind it; anodyne and inner anodyne maps.`,
        about: String.raw`Your moves fill horns, and a category can fill every inner horn itself. So if the goal is false in some category that contains your picture, no sequence of moves can reach it.`,
        picture: {
          caption: String.raw`A closed square of arrows with nothing across it. No horn here is missing a side.`,
          dots: [
            { id: String.raw`a`, label: String.raw``, x: 12, y: 8 },
            { id: String.raw`b`, label: String.raw``, x: 56, y: 8 },
            { id: String.raw`c`, label: String.raw``, x: 56, y: 46 },
            { id: String.raw`d`, label: String.raw``, x: 12, y: 46 }
          ],
          arrows: [
            { from: String.raw`a`, to: String.raw`b`, label: String.raw`` },
            { from: String.raw`b`, to: String.raw`c`, label: String.raw`` },
            { from: String.raw`c`, to: String.raw`d`, label: String.raw`` },
            { from: String.raw`d`, to: String.raw`a`, label: String.raw`` }
          ],
          fills: []
        }
      }
    },
    {
      id: 9,
      title: String.raw`Lifting`,
      mathTitle: String.raw`Left fibrations`,
      blurb: String.raw``,
      definition: String.raw`A <b>lifting problem</b> for a map $p:X\to S$ is a horn $\Lambda^n_k\to X$ together with an $n$-simplex of $S$ whose faces are the images of the horn's faces; a <b>lift</b> is a filler of the horn in $X$ that $p$ sends to that simplex. The map $p$ is an <b>inner fibration</b> if every lifting problem with $0<k<n$ has a lift, and a <b>left fibration</b> if every lifting problem with $0\le k<n$ has one.`,
      definitionDiagram: {
        dots: [
          { id: String.raw`a`, label: String.raw`x`, x: 10, y: 8 },
          { id: String.raw`b`, label: String.raw`y`, x: 50, y: 8 },
          { id: String.raw`c`, label: String.raw`z`, x: 90, y: 8 },
          { id: String.raw`A`, label: String.raw`a`, x: 10, y: 48 },
          { id: String.raw`B`, label: String.raw`b`, x: 50, y: 48 },
          { id: String.raw`C`, label: String.raw`c`, x: 90, y: 48 }
        ],
        arrows: [
          { from: String.raw`a`, to: String.raw`b`, label: String.raw`f` },
          { from: String.raw`b`, to: String.raw`c`, label: String.raw`g` },
          { from: String.raw`A`, to: String.raw`B`, label: String.raw`p f` },
          { from: String.raw`B`, to: String.raw`C`, label: String.raw`p g` },
          { from: String.raw`a`, to: String.raw`A`, label: String.raw``, dashed: true },
          { from: String.raw`b`, to: String.raw`B`, label: String.raw``, dashed: true },
          { from: String.raw`c`, to: String.raw`C`, label: String.raw``, dashed: true }
        ]
      },
      hornsFill: String.raw`left`,
      brief: {
        sofar: String.raw`Every shape so far lived on its own. You filled horns in one simplicial set at a time.`,
        now: String.raw`Now there are two simplicial sets and a map $p:X\to S$ between them. The base $S$ is fixed, and everything you build in the total space $X$ must lie over something that already exists in $S$, so the kind of map decides which horns you may fill in $X$.`,
        new: String.raw`The tool Lift arrow; the base $S$, the total space $X$ and the map $p:X\to S$; inner fibrations and left fibrations.`,
        about: String.raw`A left fibration lets you lift an arrow of $S$ from any vertex you choose, but the lift ends wherever the map puts it. Several levels hinge on that: you control where a lift starts, and only a horn can control where it ends.`,
        picture: {
          caption: String.raw`Each vertex and arrow of $X$ lies over a vertex or arrow of $S$.`,
          dots: [
            { id: String.raw`a`, label: String.raw`x`, x: 10, y: 8 },
            { id: String.raw`b`, label: String.raw`y`, x: 50, y: 8 },
            { id: String.raw`c`, label: String.raw`z`, x: 90, y: 8 },
            { id: String.raw`A`, label: String.raw`a`, x: 10, y: 46 },
            { id: String.raw`B`, label: String.raw`b`, x: 50, y: 46 },
            { id: String.raw`C`, label: String.raw`c`, x: 90, y: 46 }
          ],
          arrows: [
            { from: String.raw`a`, to: String.raw`b`, label: String.raw`f` },
            { from: String.raw`b`, to: String.raw`c`, label: String.raw`g` },
            { from: String.raw`A`, to: String.raw`B`, label: String.raw`` },
            { from: String.raw`B`, to: String.raw`C`, label: String.raw`` },
            { from: String.raw`a`, to: String.raw`A`, label: String.raw``, dashed: true },
            { from: String.raw`b`, to: String.raw`B`, label: String.raw``, dashed: true },
            { from: String.raw`c`, to: String.raw`C`, label: String.raw``, dashed: true }
          ],
          fills: []
        }
      }
    },
    {
      id: 10,
      title: String.raw`Isomorphisms`,
      mathTitle: String.raw`Joyal's theorem`,
      blurb: String.raw``,
      definition: String.raw`An arrow $f:a\to b$ is an <b>isomorphism</b> if there are arrows $g,k:b\to a$ and triangles $(f,g\,;\,1_a)$ and $(k,f\,;\,1_b)$. <b>Joyal's theorem</b>: in a quasi-category, a horn $\Lambda^n_0$ ($n\ge2$) whose edge from corner $0$ to corner $1$ is an isomorphism has a filler, and so does a horn $\Lambda^n_n$ whose edge from corner $n-1$ to corner $n$ is an isomorphism.`,
      definitionDiagram: {
        dots: [
          { id: String.raw`a`, label: String.raw`0`, x: 14, y: 30 },
          { id: String.raw`b`, label: String.raw`1`, x: 86, y: 30 }
        ],
        arrows: [
          { from: String.raw`a`, to: String.raw`b`, label: String.raw`f ≅` },
          { from: String.raw`b`, to: String.raw`a`, label: String.raw`g` }
        ]
      },
      hornsFill: String.raw`inner+iso`,
      brief: {
        sofar: String.raw`In the Kan complexes world every horn filled, so every arrow could be undone and cancelled.`,
        now: String.raw`Here only inner horns fill, as in a general quasi-category. You'll find goals that are now impossible, such as inverting an arbitrary arrow or cancelling one, and then see which of them come back when an arrow is marked $\cong$.`,
        new: String.raw`The mark $\cong$ on an arrow, one-sided inverses, idempotents, and Joyal's theorem. On the Tetrahedron tool an outer missing face shows a padlock, and the padlock opens only along an arrow marked $\cong$.`,
        about: String.raw`Each impossible goal here was easy in the Kan world, and the counter-model you pick shows which outer horn it secretly needed.`,
        picture: {
          caption: String.raw`An isomorphism $f$ with an inverse $g$. Outer horns whose end edge is $f$ can be filled.`,
          dots: [
            { id: String.raw`a`, label: String.raw`a`, x: 14, y: 26 },
            { id: String.raw`b`, label: String.raw`b`, x: 86, y: 26 }
          ],
          arrows: [
            { from: String.raw`a`, to: String.raw`b`, label: String.raw`f ≅` },
            { from: String.raw`b`, to: String.raw`a`, label: String.raw`g` }
          ],
          fills: []
        }
      }
    },
    {
      id: 11,
      title: String.raw`Natural transformations`,
      mathTitle: String.raw`Natural transformations`,
      blurb: String.raw``,
      definition: String.raw`A <b>commuting square</b> from $f:a\to b$ to $f':a'\to b'$ consists of arrows $\alpha:a\to a'$, $\beta:b\to b'$ and $d:a\to b'$ with triangles $(f,\beta\,;\,d)$ and $(\alpha,f'\,;\,d)$; equivalently, it is a map $\Delta^1\times\Delta^1\to X$.`,
      definitionDiagram: {
        dots: [
          { id: String.raw`a`, label: String.raw`a`, x: 10, y: 8 },
          { id: String.raw`b`, label: String.raw`b`, x: 58, y: 8 },
          { id: String.raw`c`, label: String.raw`a′`, x: 10, y: 46 },
          { id: String.raw`d`, label: String.raw`b′`, x: 58, y: 46 }
        ],
        arrows: [
          { from: String.raw`a`, to: String.raw`b`, label: String.raw`f` },
          { from: String.raw`a`, to: String.raw`c`, label: String.raw`α` },
          { from: String.raw`b`, to: String.raw`d`, label: String.raw`β` },
          { from: String.raw`c`, to: String.raw`d`, label: String.raw`f′` },
          { from: String.raw`a`, to: String.raw`d`, label: String.raw`d` }
        ],
        fills: [[String.raw`a`, String.raw`b`, String.raw`d`], [String.raw`a`, String.raw`c`, String.raw`d`]]
      },
      hornsFill: String.raw`inner+iso`,
      brief: {
        sofar: String.raw`You can invert isomorphisms, cancel them, and fill outer horns along them.`,
        now: String.raw`You will treat a commuting square as an arrow from its top side $f$ to its bottom side $f'$. You build squares, move isomorphisms across triangles, paste two squares into one, and show that a square with invertible sides can be turned around.`,
        new: String.raw`Commuting squares; the theorem tool Divide, earned in the second level; composites of isomorphisms; natural isomorphisms.`,
        about: String.raw`The arguments are the ones you already know, with tetrahedra and Swap in, applied to arrows whose endpoints are themselves arrows.`,
        picture: {
          caption: String.raw`A commuting square: two triangles sharing the diagonal $d$.`,
          dots: [
            { id: String.raw`a`, label: String.raw`a`, x: 10, y: 8 },
            { id: String.raw`b`, label: String.raw`b`, x: 58, y: 8 },
            { id: String.raw`c`, label: String.raw`a′`, x: 10, y: 46 },
            { id: String.raw`d`, label: String.raw`b′`, x: 58, y: 46 }
          ],
          arrows: [
            { from: String.raw`a`, to: String.raw`b`, label: String.raw`f` },
            { from: String.raw`a`, to: String.raw`c`, label: String.raw`α` },
            { from: String.raw`b`, to: String.raw`d`, label: String.raw`β` },
            { from: String.raw`c`, to: String.raw`d`, label: String.raw`f′` },
            { from: String.raw`a`, to: String.raw`d`, label: String.raw`d` }
          ],
          fills: [[String.raw`a`, String.raw`b`, String.raw`d`], [String.raw`a`, String.raw`c`, String.raw`d`]]
        }
      }
    },
    {
      id: 12,
      title: String.raw`Challenges`,
      mathTitle: String.raw`Challenges`,
      blurb: String.raw``,
      definition: String.raw`Four harder problems. Each one uses only ideas from earlier worlds, and none of them says how.`,
      hornsFill: String.raw`inner`,
      brief: {
        sofar: String.raw`You've met every tool the game has.`,
        now: String.raw`Challenge puzzles here.`,
        new: String.raw`Nothing new: only harder.`
      }
    },
    {
      id: 13,
      title: String.raw`Sandbox`,
      mathTitle: String.raw`Sandbox`,
      blurb: String.raw``,
      definition: String.raw`The sandbox is a simplicial set that you edit with every tool; no goal is set.`,
      definitionDiagram: {
        dots: [
          { id: String.raw`a`, label: String.raw`0`, x: 14, y: 44 },
          { id: String.raw`b`, label: String.raw`1`, x: 50, y: 10 },
          { id: String.raw`c`, label: String.raw`2`, x: 86, y: 44 }
        ],
        arrows: [
          { from: String.raw`a`, to: String.raw`b`, label: String.raw`` },
          { from: String.raw`b`, to: String.raw`c`, label: String.raw`` },
          { from: String.raw`a`, to: String.raw`c`, label: String.raw`` }
        ],
        fills: [[String.raw`a`, String.raw`b`, String.raw`c`]]
      },
      hornsFill: String.raw`all`
    }
  ],

  /* ==== the intro screen ================================================== */

  intro: {
    title: String.raw`Hornfiller`,
    lede: String.raw`A puzzle game about higher category theory.`,
    demo: {
      hint: String.raw`Tap $f$, then $g$.`,
      done: String.raw`The triangle is the proof that $x$ is a composite of $f$ then $g$, and every level in the game is about building or finding shapes like that one.`
    },
    start: String.raw`Start the first level`,
    note: String.raw`Read the first note instead`,
    noteId: String.raw`simplicial`
  },

  /* ==== levels ============================================================ */

  text: {
    /* 0. A triangle */
    welcome: {
      title: String.raw`A triangle`,
      bullets: [
        String.raw`Here is your first <b>simplicial set</b>: three vertices, three arrows and one filled triangle. The <b>Goal</b> panel on the right says what to do, and the list on the right shows the triangles on the board, which you can tap.`,
        String.raw`Tap $\sigma_1$.`
      ],
      explain: String.raw`The board on the left is a picture, and the list on the right is how you answer, because every tool in the game asks you to tap triangles or arrows. Right now there's one triangle, shaded, which the list writes as $\sigma_1=(f,g\,;\,x)$: walk $f$, then $g$, and $x$ is the shortcut. Tap it and you have finished your first level, which is about as hard as this game will ever be, so enjoy it.`,
      hints: [String.raw`The list of triangles is on the right, below the goal.`, String.raw`Tap $\sigma_1$.`],
      win: [String.raw`Press Enter to continue.`],
      term: String.raw`Triangle`,
      math: {
        say: String.raw`A simplicial set is a collection of simplices glued along faces. Here it is the single 2-simplex $\sigma_1$ on three vertices, and the list shows its non-degenerate 2-simplices.`,
        proof: String.raw`$\sigma_1$ exists.`
      }
    },
    /* 0. Reading a triangle */
    faces: {
      title: String.raw`Reading a triangle`,
      bullets: [
        String.raw`Four triangles are drawn on four vertices.`,
        String.raw`Tap the triangle whose long side $d_1$ is $y$.`
      ],
      explain: String.raw`Every triangle on the board has corners $0,1,2$ and three sides. The first leg $d_2$ runs from corner $0$ to $1$, the second leg $d_0$ from $1$ to $2$, and the long side $d_1$ goes straight from $0$ to $2$. Each face is named after the corner it skips, so $d_1$ is the side that skips the middle. The list on the right writes a triangle as $(d_2,\,d_0\,;\,d_1)$: legs before the semicolon, long side after it. The four triangles here are $\sigma_1=(f,g\,;\,x)$, $\sigma_2=(g,h\,;\,y)$, $\sigma_3=(x,h\,;\,z)$ and $\sigma_4=(f,y\,;\,z)$, and exactly one of them has $y$ after the semicolon.`,
      hints: [
        String.raw`Look at what comes after the semicolon in each entry.`,
        String.raw`Tap $\sigma_2=(g,h\,;\,y)$.`
      ],
      win: [String.raw`$d_1\sigma_2=y$: the long side is the entry after the semicolon.`],
      term: String.raw`Faces of a triangle`,
      math: {
        say: String.raw`A 2-simplex $\sigma:\Delta^2\to X$ has faces $d_i\sigma=\sigma\circ\delta^i$, where $\delta^i:[1]\to[2]$ omits $i$: $d_2\sigma$ is the edge $01$, $d_0\sigma$ the edge $12$ and $d_1\sigma$ the edge $02$.`,
        proof: String.raw`$d_1\sigma_2=y$, the edge from corner $0$ to corner $2$.`
      }
    },
    /* 0. Degenerate triangles */
    freebies: {
      title: String.raw`Degenerate triangles`,
      bullets: [String.raw`An arrow $f:a\to b$ is given.`, String.raw`Tap $(f,1_b\,;\,f)$, then $(1_a,f\,;\,f)$.`],
      explain: String.raw`The board shows one arrow $f:a\to b$ and no triangles, yet the panel on the right already lists two under Degenerate triangles. Every vertex $a$ carries an identity arrow $1_a$, drawn as a faint loop, and every arrow $f$ carries two flat triangles. $s_0f=(1_a,f\,;\,f)$ says that the identity at $a$ followed by $f$ has $f$ as a composite. $s_1f=(f,1_b\,;\,f)$ says the same for $f$ followed by the identity at $b$. They exist in every simplicial set because they are $f$ itself with one corner repeated, $s_0$ repeating the start and $s_1$ the end. You never build them, and you'll use them constantly.`,
      hints: [
        String.raw`Find the degenerate triangle whose second leg is $1_b$.`,
        String.raw`Tap $s_1f$, then $s_0f$.`
      ],
      win: [String.raw`$s_1f=(f,1_b\,;\,f)$ and $s_0f=(1_a,f\,;\,f)$ exist for every arrow $f$.`],
      term: String.raw`Degenerate triangles`,
      math: {
        say: String.raw`Degeneracy maps $s_i:X_n\to X_{n+1}$ repeat a vertex. $1_a=s_0a$; for $f:a\to b$, $s_0f$ and $s_1f$ are the 2-simplices with boundaries $(1_a,f;f)$ and $(f,1_b;f)$.`,
        proof: String.raw`$s_1f=(f,1_b;f)$ repeats the end of $f$; $s_0f=(1_a,f;f)$ repeats its start.`
      }
    },
    /* 0. Repeated corners */
    whichface: {
      title: String.raw`Repeated corners`,
      bullets: [
        String.raw`A tetrahedron has corners $0,1,2,3$ over the vertices $a,b,b,c$.`,
        String.raw`Tap its face $d_3$, which is degenerate.`
      ],
      explain: String.raw`A tetrahedron has four corners, but two of them may sit on the same vertex. Here corners $1$ and $2$ both sit on $b$, and the edge between them is $1_b$. The face $d_3$ skips corner $3$, so it keeps the corners over $a,b,b$: its first leg is $f$, its second leg is $1_b$, and its long side runs from $a$ to $b$, which is $f$ again. That is the degenerate triangle $s_1f=(f,1_b\,;\,f)$. The face $d_0$ is the other degenerate one, $s_0g=(1_b,g\,;\,g)$, and the two middle faces $d_1$ and $d_2$ are both the real triangle $\sigma_1=(f,g\,;\,h)$.`,
      hints: [String.raw`$d_3$ is the face that skips the corner over $c$.`, String.raw`Tap $s_1f$.`],
      win: [String.raw`$d_3=s_1f$: a repeated corner gives a degenerate face.`],
      term: String.raw`Degenerate faces`,
      math: {
        say: String.raw`The tetrahedron $\tau=s_1\sigma$ has $d_3\tau=s_1d_2\sigma=s_1f$ and $d_0\tau=s_0d_0\sigma=s_0g$ degenerate, while $d_1\tau=d_2\tau=\sigma$.`,
        proof: String.raw`$\tau=s_1\sigma_1$, so $d_3\tau=s_1d_2\sigma_1=s_1f$.`
      }
    },
    /* 0. Constructing a composite */
    compose: {
      title: String.raw`Constructing a composite`,
      bullets: [
        String.raw`Given arrows $f:a\to b$ and $g:b\to c$.`,
        String.raw`Construct a triangle $(f,g\,;\,?)$.`
      ],
      explain: String.raw`You can walk from $a$ to $b$ along $f$ and then on to $c$ along $g$. The two arrows meet at $b$ and form the horn $\Lambda^2_1$: a triangle with its long side missing. Compose fills that horn. It draws a new arrow $x:a\to c$ and the triangle $\sigma_1=(f,g\,;\,x)$ on all three sides. The triangle is what makes $x$ a composite of $f$ and $g$; the arrow alone would just be some arrow from $a$ to $c$. The question mark in the goal stands for whatever long side you end up with.`,
      hints: [
        String.raw`Compose wants two arrows where the first ends where the second starts.`,
        String.raw`Compose: $f$, then $g$.`
      ],
      win: [String.raw`$\sigma_1=(f,g\,;\,x)$ fills the horn: $x$ is a composite of $f$ and $g$.`],
      term: String.raw`Composite`,
      math: {
        say: String.raw`A 2-simplex $\sigma$ of $X$ with $d_2\sigma=f$, $d_0\sigma=g$, $d_1\sigma=h$ witnesses $h$ as a composite of $f$ and $g$. In a quasi-category every inner horn $\Lambda^2_1\to X$ extends to such a $\sigma$.`,
        proof: String.raw`Fill $\Lambda^2_1\to X$ on $(f,g)$: the filler $\sigma_1$ has $d_1\sigma_1=x$.`
      }
    },
    /* 0. Composing a composite */
    chain: {
      title: String.raw`Composing a composite`,
      bullets: [
        String.raw`Given arrows $f:a\to b$, $g:b\to c$, $h:c\to d$ in a row.`,
        String.raw`Construct $(f,g\,;\,x)$, then $(x,h\,;\,?)$.`
      ],
      explain: String.raw`A composite is an ordinary arrow once it exists, so you can compose it again. First fill the horn on $f,g$: you get $x:a\to c$ and $\sigma_1=(f,g\,;\,x)$. Now $x$ ends at $c$, where $h$ starts, so $x$ and $h$ form a new horn $\Lambda^2_1$. Filling it gives $y:a\to d$ with $\sigma_2=(x,h\,;\,y)$. You have reached $d$ by bracketing $(f,g)$ first. The other bracketing, $g$ with $h$ first, would give different arrows, and the next world relates the two.`,
      hints: [
        String.raw`Compose two neighbours, then compose the result with the third arrow.`,
        String.raw`Compose: $f$, $g$. Compose: $x$, $h$.`
      ],
      win: [String.raw`$\sigma_2=(x,h\,;\,y)$: $y$ is a composite of $x$ and $h$.`],
      term: String.raw`Iterated composite`,
      math: {
        say: String.raw`In a quasi-category every inner horn $\Lambda^n_i\to X$ ($0<i<n$) has a filler. Composition therefore iterates: composable $f,g,h$ give a composite $x$ of $(f,g)$, then a composite $y$ of $(x,h)$.`,
        proof: String.raw`Fill $\Lambda^2_1$ on $(f,g)$ for $\sigma_1$, then again on $(x,h)$ for $\sigma_2$.`
      }
    },
    /* 0. Two composites of one pair */
    twoways: {
      title: String.raw`Two composites of one pair`,
      bullets: [
        String.raw`Given arrows $f:a\to b$ and $g:b\to c$.`,
        String.raw`Construct two triangles $(f,g\,;\,x)$ and $(f,g\,;\,y)$.`
      ],
      explain: String.raw`Fill the same horn twice. Compose $f$ and $g$ once and you get $x$ with $\sigma_1=(f,g\,;\,x)$; do it again and you get a second arrow $y$ with $\sigma_2=(f,g\,;\,y)$. A filler is a choice, so nothing forces the second answer to equal the first, and the game always draws a new one. Both $x$ and $y$ are composites of $f$ and $g$, with equal standing. For now nothing on the board connects $x$ to $y$; the third level of the next world builds a triangle between them.`,
      hints: [
        String.raw`Use Compose on the pair $f,g$ a second time.`,
        String.raw`Compose: $f$, $g$. Compose: $f$, $g$ again.`
      ],
      win: [String.raw`$\sigma_1=(f,g\,;\,x)$ and $\sigma_2=(f,g\,;\,y)$: one pair, two composites.`],
      term: String.raw`Non-unique composites`,
      math: {
        say: String.raw`A filler of $\Lambda^2_1\to X$ need not be unique: a composite of $f$ and $g$ is any edge $h$ carrying a 2-simplex with boundary $(f,g;h)$, and different fillers can have different $d_1$.`,
        proof: String.raw`Fill $\Lambda^2_1$ on $(f,g)$ twice, choosing fillers $\sigma_1\ne\sigma_2$ with $d_1\sigma_1=x\ne y=d_1\sigma_2$.`
      }
    },
    /* 0. A fourth face */
    tetra: {
      title: String.raw`A fourth face`,
      bullets: [
        String.raw`Given $\sigma_1=(f,g\,;\,x)$, $\sigma_2=(g,h\,;\,y)$, $\sigma_3=(x,h\,;\,z)$.`,
        String.raw`Prove a triangle $(f,y\,;\,z)$ exists.`
      ],
      explain: String.raw`Put a tetrahedron on the path $f,g,h$, with corners $0,1,2,3$ over $a,b,c,d$. Its faces are $d_3=(f,g\,;\,x)$, $d_0=(g,h\,;\,y)$, $d_1=(x,h\,;\,z)$ and $d_2=(f,y\,;\,z)$, where $d_i$ skips corner $i$. The first three are $\sigma_1,\sigma_2,\sigma_3$, so only $d_2$ is missing. Three faces with $d_2$ missing form the inner horn $\Lambda^3_2$, and Tetrahedron fills it. The filler is a tetrahedron whose fourth face is $(f,y\,;\,z)$, so $z$ is a composite of $f$ and $y$ as well as of $x$ and $h$.`,
      hints: [
        String.raw`Tetrahedron takes three triangles that are faces of one tetrahedron.`,
        String.raw`Tetrahedron: path $f,g,h$; $d_3=\sigma_1$, $d_0=\sigma_2$, $d_1=\sigma_3$. Fill.`
      ],
      win: [String.raw`The fourth face is $\sigma_4=(f,y\,;\,z)$.`],
      term: String.raw`Inner horn $\Lambda^3_2$`,
      math: {
        say: String.raw`A 3-simplex has faces $d_0,\dots,d_3$. Three of them forming an inner horn $\Lambda^3_1$ or $\Lambda^3_2$ extend, in a quasi-category, to a 3-simplex $\Delta^3\to X$, whose remaining face is a new 2-simplex.`,
        proof: String.raw`Fill $\Lambda^3_2\to X$ on $(a,b,c,d)$ with faces $d_3=\sigma_1,d_0=\sigma_2,d_1=\sigma_3$; $d_2$ is the target.`
      }
    },
    /* 0. Two bracketings */
    assoc: {
      title: String.raw`Two bracketings`,
      bullets: [
        String.raw`Given arrows $f,g,h$ end to end.`,
        String.raw`Construct composites $x$ of $f,g$, $y$ of $g,h$, $z$ of $x,h$, and prove $(f,y\,;\,z)$.`
      ],
      explain: String.raw`Three arrows in a row can be composed in two orders: $f$ with $g$ first, or $g$ with $h$ first. Build both starts: $x$ from $f,g$ with $\sigma_1$, and $y$ from $g,h$ with $\sigma_2$. Then finish one bracketing with $z$ from $x,h$ and $\sigma_3=(x,h\,;\,z)$. Now you're in the previous level: $\sigma_1,\sigma_2,\sigma_3$ are the faces $d_3,d_0,d_1$ of the tetrahedron on $f,g,h$, and its missing face $d_2=(f,y\,;\,z)$ says that $z$ also finishes the other bracketing. Associativity holds in the form of a triangle.`,
      hints: [
        String.raw`Make three composites, then hand them to one tetrahedron.`,
        String.raw`Compose: $f$, $g$. Compose: $g$, $h$. Compose: $x$, $h$. Tetrahedron: path $f,g,h$; $d_3=\sigma_1$, $d_0=\sigma_2$, $d_1=\sigma_3$. Fill.`
      ],
      win: [String.raw`$\sigma_4=(f,y\,;\,z)$: $z$ is a composite of $x,h$ and also of $f,y$.`],
      term: String.raw`Associativity`,
      math: {
        say: String.raw`Composites $x$ of $(f,g)$, $y$ of $(g,h)$ and $z$ of $(x,h)$ give an inner horn $\Lambda^3_2$. Its filler yields a 2-simplex $(f,y;z)$: $z$ is also a composite of $f$ and $y$. Associativity holds up to homotopy.`,
        proof: String.raw`Fill $\Lambda^3_2$ on $(a,b,c,d)$ with $d_3=\sigma_1$, $d_0=\sigma_2$, $d_1=\sigma_3$; $d_2=\sigma_4=(f,y;z)$.`
      }
    },
    /* 0. Comparing two composites */
    unique: {
      title: String.raw`Comparing two composites`,
      bullets: [
        String.raw`Construct two composites $x$ and $y$ of $f$ and $g$.`,
        String.raw`Prove a triangle $(x,1_c\,;\,y)$ exists, which says $x\simeq y$.`
      ],
      explain: String.raw`Two arrows $x,y:a\to c$ are homotopic, $x\simeq y$, when there's a triangle $(x,1_c\,;\,y)$; the note before this level explains the picture behind that. Compose $f,g$ twice to get $\sigma_1=(f,g\,;\,x)$ and $\sigma_2=(f,g\,;\,y)$. Then take the tetrahedron on the path $f,g,1_c$, with corners over $a,b,c,c$. Its face $d_3$ is $\sigma_1$, its face $d_2$ is $\sigma_2$, and its face $d_0=(g,1_c\,;\,g)$ is the degenerate triangle $s_1g$, which exists because $g$ does. The missing face is $d_1=(x,1_c\,;\,y)$, an inner horn $\Lambda^3_1$.`,
      hints: [
        String.raw`End the path with the identity at $c$.`,
        String.raw`Compose: $f$, $g$. Compose: $f$, $g$. Tetrahedron: path $f,g,1_c$; $d_3=\sigma_1$, $d_2=\sigma_2$ ($d_0=s_1g$ is degenerate). Fill.`
      ],
      win: [
        String.raw`$\sigma_3=(x,1_c\,;\,y)$, so $x\simeq y$. New tool: Same, which is uniqueness of composites up to homotopy and does this for any two composites of one pair.`
      ],
      term: String.raw`Homotopy`,
      math: {
        say: String.raw`Edges $x,y:a\to c$ are homotopic if some 2-simplex has boundary $(x,1_c;y)$. Any two composites $x,y$ of $(f,g)$ are homotopic: the horn $\Lambda^3_1$ with faces $\sigma_1,\sigma_2,s_1g$ fills.`,
        proof: String.raw`Fill $\Lambda^3_1$ on $(a,b,c,c)$ with $d_3=\sigma_1$, $d_2=\sigma_2$, $d_0=s_1g$; $d_1$ is $(x,1_c;y)$.`
      }
    },
    /* 0. Composing with an identity */
    unit: {
      title: String.raw`Composing with an identity`,
      bullets: [
        String.raw`Given one arrow $f:a\to b$.`,
        String.raw`Construct composites $x$ of $1_a,f$ and $y$ of $f,1_b$; prove $x\simeq f$ and $y\simeq f$.`
      ],
      explain: String.raw`Composing the identity $1_a$ with $f$ ought to give $f$ back, at least up to homotopy. Compose $1_a$ with $f$ to get $x$ and $\sigma_1=(1_a,f\,;\,x)$. The tetrahedron on the path $1_a,f,1_b$ has corners over $a,a,b,b$, face $d_3=\sigma_1$, and two degenerate faces: $d_2=s_0f=(1_a,f\,;\,f)$ and $d_0=s_1f=(f,1_b\,;\,f)$. Its missing face is $d_1=(x,1_b\,;\,f)$, which says $x\simeq f$. On the right, compose $f$ with $1_b$ to get $y$ and $\sigma_3$, and use the path $f,1_b,1_b$ with degenerate faces $s_1f$ and $s_01_b=(1_b,1_b\,;\,1_b)$.`,
      hints: [
        String.raw`Each tetrahedron gets two of its faces for free.`,
        String.raw`Compose: $1_a$, $f$. Tetrahedron: path $1_a,f,1_b$; $d_3=\sigma_1$, $d_0=s_1f$, $d_2=s_0f$. Compose: $f$, $1_b$. Tetrahedron: path $f,1_b,1_b$; $d_3=\sigma_3$, $d_0=s_01_b$, $d_2=s_1f$.`
      ],
      win: [
        String.raw`$\sigma_2=(x,1_b\,;\,f)$ and $\sigma_4=(y,1_b\,;\,f)$: composing with an identity changes $f$ only up to homotopy.`
      ],
      term: String.raw`Unit law`,
      math: {
        say: String.raw`Unit laws up to homotopy: a composite $x$ of $(1_a,f)$ and a composite $y$ of $(f,1_b)$ satisfy $x\simeq f$ and $y\simeq f$, by inner horns $\Lambda^3_1$ with degenerate faces.`,
        proof: String.raw`Fill $\Lambda^3_1$ on $(a,a,b,b)$ with $d_3=\sigma_1$, $d_0=s_1f$, $d_2=s_0f$; $d_1=(x,1_b;f)$. Fill $\Lambda^3_1$ on $(a,b,b,b)$ with $d_3=\sigma_3$, $d_0=s_01_b$, $d_2=s_1f$; $d_1=(y,1_b;f)$.`
      }
    },
    /* 0. Comparing bracketings */
    bracket: {
      title: String.raw`Comparing bracketings`,
      bullets: [
        String.raw`Given $\sigma_1=(g,h\,;\,y)$ and $\sigma_3=(f,y\,;\,w)$.`,
        String.raw`Construct $x$ from $f,g$ and $z$ from $x,h$; prove $z\simeq w$.`
      ],
      explain: String.raw`Someone has already composed $f,g,h$ with the right-hand bracket: $y$ from $g,h$ by $\sigma_1$, then $w$ from $f,y$ by $\sigma_3$, so you go the other way. Compose $f,g$ to get $x$ ($\sigma_4$) and then $x,h$ to get $z$ ($\sigma_5$). The tetrahedron on $f,g,h$ with $d_3=\sigma_4$, $d_0=\sigma_1$, $d_1=\sigma_5$ produces $\sigma_6=(f,y\,;\,z)$. Now $z$ and $w$ are two composites of the same pair $f,y$, and Same, which you earned two levels ago, turns that into $z\simeq w$. The triangle $\sigma_2$ on $y'$ is there to tempt you; it's a composite of $g,h$ that nothing else uses.`,
      hints: [
        String.raw`Get $z$ and $w$ onto the same pair of legs, then compare them.`,
        String.raw`Compose: $f$, $g$. Compose: $x$, $h$. Tetrahedron: path $f,g,h$; $d_3=\sigma_4$, $d_0=\sigma_1$, $d_1=\sigma_5$. Fill. Same: $\sigma_6$, $\sigma_3$.`
      ],
      win: [String.raw`$\sigma_7=(z,1_d\,;\,w)$: the two bracketings give homotopic arrows.`],
      term: String.raw`Coherence of bracketing`,
      math: {
        say: String.raw`Both $z$ and $w$ are composites of $(f,y)$ once the associativity 2-simplex $(f,y;z)$ exists. Any two composites of the same pair are homotopic, so $z\simeq w$, using two inner horns.`,
        proof: String.raw`Fill $\Lambda^3_2$ on $(a,b,c,d)$ to get $(f,y;z)$; then fill $\Lambda^3_1$ on $(a,b,d,d)$ with $\sigma_6,\sigma_3,s_1y$ to get $(z,1_d;w)$.`
      }
    },
    /* 0. Symmetry of homotopy */
    symmetric: {
      title: String.raw`Symmetry of homotopy`,
      bullets: [
        String.raw`Given $\sigma_1=(f,1_b\,;\,g)$, so $f\simeq g$.`,
        String.raw`Prove $(g,1_b\,;\,f)$, so $g\simeq f$.`
      ],
      explain: String.raw`The triangle $\sigma_1$ deforms $f$ into $g$, and you want a triangle that deforms $g$ back into $f$. Use the tetrahedron on the path $f,1_b,1_b$. Its corners sit over $a,b,b,b$, so three of them share the vertex $b$; the unfold toggle draws them as separate copies if the picture is too flat. The faces are $d_3=\sigma_1$, $d_2=s_1f=(f,1_b\,;\,f)$, which exists because $f$ does, and $d_0=s_01_b=(1_b,1_b\,;\,1_b)$, which exists because $1_b$ does. The missing face $d_1=(g,1_b\,;\,f)$ makes this the inner horn $\Lambda^3_1$.`,
      hints: [
        String.raw`Two of the three faces you need are degenerate triangles.`,
        String.raw`Tetrahedron: path $f,1_b,1_b$; $d_3=\sigma_1$, $d_2=s_1f$, $d_0=s_01_b$. Fill.`
      ],
      win: [
        String.raw`$\sigma_2=(g,1_b\,;\,f)$, so $g\simeq f$. New tool: Flip, which is symmetry of homotopy.`
      ],
      term: String.raw`Symmetry of $\simeq$`,
      math: {
        say: String.raw`Homotopy of edges is symmetric: from $\sigma$ with boundary $(f,1_b;g)$, the inner horn $\Lambda^3_1$ with faces $\sigma$, $s_1f$, $s_0(1_b)$ fills, and $d_1$ has boundary $(g,1_b;f)$.`,
        proof: String.raw`Fill $\Lambda^3_1$ on $(a,b,b,b)$ with $d_3=\sigma_1$, $d_2=s_1f$, $d_0=s_01_b$; $d_1$ is $g\simeq f$.`
      }
    },
    /* 0. Transitivity of homotopy */
    transitive: {
      title: String.raw`Transitivity of homotopy`,
      bullets: [
        String.raw`Given $\sigma_1=(f,1_b\,;\,g)$ and $\sigma_2=(g,1_b\,;\,h)$.`,
        String.raw`Prove $(f,1_b\,;\,h)$, so $f\simeq h$.`
      ],
      explain: String.raw`Deform $f$ into $g$, then $g$ into $h$, and you should be able to deform $f$ into $h$ in one go. The same tetrahedron as before, on the path $f,1_b,1_b$, does it with its faces assigned differently. Put $\sigma_1=(f,1_b\,;\,g)$ as $d_3$ and $\sigma_2=(g,1_b\,;\,h)$ as $d_1$; the face $d_0=s_01_b$ is degenerate. The missing face is $d_2=(f,1_b\,;\,h)$, so this is the inner horn $\Lambda^3_2$. With symmetry from the last level and reflexivity from the degenerate triangle $s_1f=(f,1_b\,;\,f)$, homotopy is now an equivalence relation on arrows $a\to b$.`,
      hints: [
        String.raw`Same path as the last level; put the second homotopy in a different slot.`,
        String.raw`Tetrahedron: path $f,1_b,1_b$; $d_3=\sigma_1$, $d_1=\sigma_2$ ($d_0=s_01_b$ is degenerate). Fill.`
      ],
      win: [
        String.raw`$\sigma_3=(f,1_b\,;\,h)$, so $f\simeq h$. New tool: Link, which is transitivity of homotopy.`
      ],
      term: String.raw`Transitivity of $\simeq$`,
      math: {
        say: String.raw`Homotopy is transitive: an inner horn $\Lambda^3_2$ with faces for $f\simeq g$, $g\simeq h$ and $s_0(1_b)$ gives $f\simeq h$. So homotopy is an equivalence relation, and edges modulo it form the homotopy category $hX$.`,
        proof: String.raw`Fill $\Lambda^3_2$ on $(a,b,b,b)$ with $d_3=\sigma_1$, $d_1=\sigma_2$, $d_0=s_01_b$; $d_2$ is $f\simeq h$.`
      }
    },
    /* 0. Homotopy and composition */
    whisker: {
      title: String.raw`Homotopy and composition`,
      bullets: [
        String.raw`Given $\sigma_1=(f,1_b\,;\,k)$ and $\sigma_2=(f,g\,;\,x)$.`,
        String.raw`Prove $(k,g\,;\,x)$: $x$ is also a composite of $k$ and $g$.`
      ],
      explain: String.raw`If $f$ is homotopic to $k$, then $x$ should still be a composite of $k$ and $g$. The tetrahedron on the path $f,1_b,g$ has corners over $a,b,b,c$. Its faces are $d_3=\sigma_1=(f,1_b\,;\,k)$, $d_2=\sigma_2=(f,g\,;\,x)$, and $d_0=s_0g=(1_b,g\,;\,g)$, the degenerate triangle on $g$ whose first leg is the identity $1_b$. The missing face is $d_1=(k,g\,;\,x)$, the inner horn $\Lambda^3_1$. The tool you earn, Swap in, replaces any arrow of a triangle by a homotopic one in a single click.`,
      hints: [
        String.raw`Put the identity in the middle of the path.`,
        String.raw`Tetrahedron: path $f,1_b,g$; $d_3=\sigma_1$, $d_2=\sigma_2$ ($d_0=s_0g$ is degenerate). Fill.`
      ],
      win: [String.raw`$\sigma_3=(k,g\,;\,x)$. New tool: Swap in, which is substitution along a homotopy.`],
      term: String.raw`Compatibility with composition`,
      math: {
        say: String.raw`If $f\simeq k$ and $\sigma$ witnesses $x$ as a composite of $(f,g)$, then $x$ is also a composite of $(k,g)$: the inner horn $\Lambda^3_1$ on $(a,b,b,c)$ fills.`,
        proof: String.raw`Fill $\Lambda^3_1$ on $(a,b,b,c)$ with $d_3=\sigma_1$, $d_2=\sigma_2$, $d_0=s_0g$; $d_1$ is $(k,g;x)$.`
      }
    },
    /* 0. The identity on the other side */
    swap: {
      title: String.raw`The identity on the other side`,
      bullets: [String.raw`Given $\sigma_1=(f,1_b\,;\,g)$.`, String.raw`Prove a triangle $(1_a,f\,;\,g)$ exists.`],
      explain: String.raw`The definition puts the identity after the arrow: $(f,1_b\,;\,g)$, $f$ followed by the identity. You could just as well put the identity first, which gives $(1_a,f\,;\,g)$, and this level shows the two versions agree. Use the tetrahedron on $1_a,f,1_b$, with corners over $a,a,b,b$. Two of its faces are degenerate: $d_3=s_0f=(1_a,f\,;\,f)$ and $d_0=s_1f=(f,1_b\,;\,f)$. The third is $d_1=\sigma_1$. The missing face is $d_2=(1_a,f\,;\,g)$, so the horn is $\Lambda^3_2$.`,
      hints: [
        String.raw`Two of the three faces are degenerate triangles on $f$.`,
        String.raw`Tetrahedron: path $1_a,f,1_b$; $d_3=s_0f$, $d_0=s_1f$, $d_1=\sigma_1$. Fill.`
      ],
      win: [String.raw`$\sigma_2=(1_a,f\,;\,g)$: the identity can stand on either side.`],
      term: String.raw`Two-sided homotopy`,
      math: {
        say: String.raw`In a quasi-category a 2-simplex with boundary $(f,1_b;g)$ exists if and only if one with boundary $(1_a,f;g)$ does. This direction uses an inner horn $\Lambda^3_2$.`,
        proof: String.raw`Fill $\Lambda^3_2$ on $(a,a,b,b)$ with $d_3=s_0f$, $d_0=s_1f$, $d_1=\sigma_1$; $d_2$ has boundary $(1_a,f;g)$.`
      }
    },
    /* 0. Chains of homotopies */
    relay: {
      title: String.raw`Chains of homotopies`,
      bullets: [
        String.raw`Given $\sigma_3:x_3\simeq x_2$, $\sigma_2:x_2\simeq x_1$, $\sigma_1:x_1\simeq x_0$ and $\sigma_5=(x_0,h\,;\,z)$.`,
        String.raw`Prove $(x_3,h\,;\,z)$.`
      ],
      explain: String.raw`This level has no Tetrahedron, only the three tools you earned. The triangle $\sigma_5$ has first leg $x_0$, and you want $x_3$ there. Swap in needs a homotopy pointing from the arrow you remove to the arrow you insert, that is $x_0\simeq x_3$. The given homotopies run the other way, from $x_3$ down to $x_0$. So Link $\sigma_3$ with $\sigma_2$ to get $x_3\simeq x_1$, Link that with $\sigma_1$ to get $x_3\simeq x_0$, Flip it to $x_0\simeq x_3$, and Swap it into $\sigma_5$. The homotopy $\sigma_4$ to $x_4$ leads nowhere useful.`,
      hints: [
        String.raw`Chain the three homotopies into one, then turn it around.`,
        String.raw`Link: $\sigma_3,\sigma_2$. Link: $\sigma_6,\sigma_1$. Flip: $\sigma_7$. Swap in: $\sigma_8,\sigma_5$.`
      ],
      win: [String.raw`$\sigma_9=(x_3,h\,;\,z)$, after a chain of three homotopies and one flip.`],
      term: String.raw`Interchangeability`,
      math: {
        say: String.raw`Homotopic edges are interchangeable in 2-simplices: $x_0\simeq x_3$ and $(x_0,h;z)$ give $(x_3,h;z)$. Obtaining $x_0\simeq x_3$ uses transitivity twice and symmetry once.`,
        proof: String.raw`Link $\sigma_3,\sigma_2$ and $\sigma_6,\sigma_1$ (each $\Lambda^3_2$); Flip $\sigma_7$ ($\Lambda^3_1$); Swap in $\sigma_8$ on $\sigma_5$ ($\Lambda^3_1$).`
      }
    },
    /* 0. Comparing composites of four arrows */
    fourway: {
      title: String.raw`Comparing composites of four arrows`,
      bullets: [
        String.raw`Given $\sigma_1,\dots,\sigma_5$ on the path $f,g,h,i$ from $a$ to $e$.`,
        String.raw`Construct $z$ from $x,h$ and $w$ from $z,i$; prove $w\simeq s$.`
      ],
      explain: String.raw`Two composites of the whole path $f,g,h,i$ are on offer. The given one, $s$, comes from $\sigma_4=(f,u\,;\,s)$, where $u$ composes $g$ with $y$ by $\sigma_3$, and $y$ composes $h,i$ by $\sigma_2$. You build the other from the left: $z$ from $x,h$ ($\sigma_6$), then $w$ from $z,i$ ($\sigma_7$). The tetrahedron on $x,h,i$ with faces $\sigma_6,\sigma_2,\sigma_7$ gives $\sigma_8=(x,y\,;\,w)$. The tetrahedron on $f,g,y$ with $\sigma_1,\sigma_3,\sigma_8$ gives $\sigma_9=(f,u\,;\,w)$. Then $w$ and $s$ are composites of the same pair $f,u$, and Same finishes. The triangle $\sigma_5$ on $u'$ is a decoy.`,
      hints: [
        String.raw`Two tetrahedra move $w$ onto the legs $f,u$.`,
        String.raw`Compose: $x$, $h$. Compose: $z$, $i$. Tetrahedron: path $x,h,i$; $d_3=\sigma_6$, $d_0=\sigma_2$, $d_1=\sigma_7$. Tetrahedron: path $f,g,y$; $d_3=\sigma_1$, $d_0=\sigma_3$, $d_1=\sigma_8$. Same: $\sigma_9$, $\sigma_4$.`
      ],
      win: [String.raw`$\sigma_{10}=(w,1_e\,;\,s)$: the two composites of four arrows are homotopic.`],
      term: String.raw`Higher associativity`,
      math: {
        say: String.raw`Two composites of a chain of four edges are homotopic: two inner horns $\Lambda^3_2$ produce $(f,u;w)$, and any two composites of $(f,u)$ are homotopic, so $w\simeq s$.`,
        proof: String.raw`Fill $\Lambda^3_2$ on $(a,c,d,e)$ for $(x,y;w)$, then $\Lambda^3_2$ on $(a,b,c,e)$ for $(f,u;w)$; apply Same to $\sigma_9,\sigma_4$.`
      }
    },
    /* 0. A left inverse */
    undo: {
      title: String.raw`A left inverse`,
      bullets: [String.raw`Given an arrow $f:a\to b$.`, String.raw`Construct a triangle $(f,?\,;\,1_a)$.`],
      explain: String.raw`Given $f$, you want an arrow back to $a$ such that $f$ followed by it has the identity $1_a$ as a composite. In triangle form that is $(f,?\,;\,1_a)$, with first leg $f$, long side $1_a$, and the second leg unknown. Two arrows leaving the same vertex form the horn $\Lambda^2_0$, which is outer because the missing face $d_0$ is at the end of the path. In a Kan complex outer horns fill too. Solve fills it, giving $x:b\to a$ and $\sigma_1=(f,x\,;\,1_a)$, so $x$ is a left inverse of $f$.`,
      hints: [
        String.raw`Both arrows you need leave the vertex $a$.`,
        String.raw`Solve $f\cdot ?\simeq h$: pick $f$, then $1_a$ (tap the vertex $a$).`
      ],
      win: [String.raw`$\sigma_1=(f,x\,;\,1_a)$: $x$ is a left inverse of $f$.`],
      term: String.raw`Outer horn $\Lambda^2_0$`,
      math: {
        say: String.raw`A horn $\Lambda^2_0\to X$ with edges $f$ and $1_a$ has a filler $\sigma$ with $d_2\sigma=f$, $d_1\sigma=1_a$ in a Kan complex; then $x=d_0\sigma$ is a left inverse of $f$.`,
        proof: String.raw`Fill $\Lambda^2_0$ on $(f,1_a)$: the filler $\sigma_1$ has $d_0\sigma_1=x$.`
      }
    },
    /* 0. A missing first leg */
    divide: {
      title: String.raw`A missing first leg`,
      bullets: [String.raw`Given $g:b\to c$ and $h:a\to c$.`, String.raw`Construct a triangle $(?,g\,;\,h)$.`],
      explain: String.raw`This time you know the second leg $g$ and the long side $h$, and you need the first leg: an arrow $a\to b$ that, followed by $g$, gives $h$. It's like solving $?\cdot g=h$ for the unknown factor. The arrows $g$ and $h$ both arrive at $c$, and they form the other outer horn, $\Lambda^2_2$, whose missing face $d_2$ is at the start of the path. In a Kan complex it fills. The second Solve tool gives $x:a\to b$ and $\sigma_1=(x,g\,;\,h)$.`,
      hints: [String.raw`Both arrows end at $c$.`, String.raw`Solve $?\cdot g\simeq h$: pick $g$, then $h$.`],
      win: [String.raw`$\sigma_1=(x,g\,;\,h)$: $h$ is a composite of $x$ and $g$.`],
      term: String.raw`Outer horn $\Lambda^2_2$`,
      math: {
        say: String.raw`A horn $\Lambda^2_2\to X$ with edges $g:b\to c$ and $h:a\to c$ has a filler $\sigma$ with $d_0\sigma=g$, $d_1\sigma=h$ in a Kan complex; $x=d_2\sigma$ solves $x$ then $g$ gives $h$.`,
        proof: String.raw`Fill $\Lambda^2_2$ on $(g,h)$; the filler $\sigma_1$ has $d_2\sigma_1=x$.`
      }
    },
    /* 0. Inverses on both sides */
    inverses: {
      title: String.raw`Inverses on both sides`,
      bullets: [
        String.raw`Given an arrow $f:a\to b$.`,
        String.raw`Construct a left inverse $x$ and a right inverse $y$, and prove $y\simeq x$.`
      ],
      explain: String.raw`Build both inverses: Solve $f\cdot ?\simeq h$ on $f,1_a$ gives $x$ with $\sigma_1=(f,x\,;\,1_a)$, and Solve $?\cdot g\simeq h$ on $f,1_b$ gives $y$ with $\sigma_2=(y,f\,;\,1_b)$. Two different horns made them, so they are different arrows, and the question is whether they are homotopic. Take the tetrahedron on the path $y,f,x$, with corners over $b,a,b,a$. Its faces are $d_3=\sigma_2$, $d_0=\sigma_1$ and $d_1=s_0x=(1_b,x\,;\,x)$, which is degenerate. The missing face is $d_2=(y,1_a\,;\,x)$. An arrow with a left and a right inverse is an <b>isomorphism</b>.`,
      hints: [
        String.raw`One Solve for each side, then one tetrahedron through all three arrows.`,
        String.raw`Solve $f\cdot ?\simeq h$: $f$, $1_a$. Solve $?\cdot g\simeq h$: $f$, $1_b$. Tetrahedron: path $y,f,x$; $d_3=\sigma_2$, $d_0=\sigma_1$ ($d_1=s_0x$ is degenerate). Fill.`
      ],
      win: [
        String.raw`$\sigma_3=(y,1_a\,;\,x)$: the right and left inverses are homotopic, and $f$ is an isomorphism.`
      ],
      term: String.raw`Isomorphism`,
      math: {
        say: String.raw`In a Kan complex an edge $f$ has a left inverse $x$ ($\Lambda^2_0$) and a right inverse $y$ ($\Lambda^2_2$), and $y\simeq x$ by an inner horn $\Lambda^3_2$. So every edge is an equivalence and $X$ is an $\infty$-groupoid.`,
        proof: String.raw`Fill $\Lambda^3_2$ on $(b,a,b,a)$ with $d_3=\sigma_2$, $d_0=\sigma_1$, $d_1=s_0x$; $d_2$ is $y\simeq x$.`
      }
    },
    /* 0. Cancelling an arrow */
    cancel: {
      title: String.raw`Cancelling an arrow`,
      bullets: [
        String.raw`Given $\sigma_1=(f,g\,;\,p)$, $\sigma_2=(k,g\,;\,q)$, $\sigma_3=(p,h\,;\,x)$, $\sigma_4=(q,h\,;\,x)$.`,
        String.raw`Prove $f\simeq k$.`
      ],
      explain: String.raw`Two spines run from $a$ to $d$, $f,g,h$ and $k,g,h$, and both have the same composite $x$, so cancel the last arrows one at a time. The tetrahedron on $p,1_c,h$ has faces $d_1=\sigma_4$, $d_2=\sigma_3$ and the degenerate $d_0=s_0h=(1_c,h\,;\,h)$; its missing face is $d_3=(p,1_c\,;\,q)$. That is the outer horn $\Lambda^3_3$, allowed because this world is Kan. Swap $q$ for $p$ in $\sigma_1$ to get $\sigma_6=(f,g\,;\,q)$. The tetrahedron on $f,1_b,g$ with $d_1=\sigma_2$, $d_2=\sigma_6$ and degenerate $d_0=s_0g$ is again $\Lambda^3_3$, and its last face is $(f,1_b\,;\,k)$.`,
      hints: [
        String.raw`Cancel $h$ first, then $g$. In both tetrahedra the missing face is $d_3$.`,
        String.raw`Tetrahedron: path $p,1_c,h$; $d_1=\sigma_4$, $d_2=\sigma_3$. Swap in: $\sigma_5$, $\sigma_1$. Tetrahedron: path $f,1_b,g$; $d_1=\sigma_2$, $d_2=\sigma_6$.`
      ],
      win: [
        String.raw`$\sigma_5=(p,1_c\,;\,q)$ cancelled $h$ and $\sigma_7=(f,1_b\,;\,k)$ cancelled $g$: $f\simeq k$.`
      ],
      term: String.raw`Cancellation`,
      math: {
        say: String.raw`In a Kan complex, if $x$ is a composite of $(p,h)$ and of $(q,h)$ then $p\simeq q$: right cancellation by $h$, via the outer horn $\Lambda^3_3\to X$. Applied again it cancels $g$.`,
        proof: String.raw`Fill $\Lambda^3_3$ on $(a,c,c,d)$ with $d_1=\sigma_4$, $d_2=\sigma_3$, $d_0=s_0h$; Swap in; fill $\Lambda^3_3$ on $(a,b,b,c)$ with $d_1=\sigma_2$, $d_2=\sigma_6$, $d_0=s_0g$.`
      }
    },
    /* 0. The inverse of a composite */
    socks: {
      title: String.raw`The inverse of a composite`,
      bullets: [
        String.raw`Given left inverses: $\sigma_1=(f,\bar f\,;\,1_a)$, $\sigma_2=(g,\bar g'\,;\,1_b)$ with $\bar g'\simeq\bar g$ by $\sigma_5$; and $\sigma_4=(\bar g,\bar f\,;\,w)$.`,
        String.raw`Construct $x$ from $f,g$ and prove $(x,w\,;\,1_a)$.`
      ],
      explain: String.raw`You put on socks, then shoes; to undo it you take off shoes first. Here $x$ is $f$ then $g$, and $w$ is $\bar g$ then $\bar f$. The world is Kan, but this boss needs only inner horns. Compose $f,g$ for $\sigma_6=(f,g\,;\,x)$. The undo triangle for $g$ uses $\bar g'$, so Swap in $\sigma_5$ to get $\sigma_7=(g,\bar g\,;\,1_b)$. The tetrahedron on $f,g,\bar g$ with $d_3=\sigma_6$, $d_0=\sigma_7$ and degenerate $d_2=s_1f$ gives $\sigma_8=(x,\bar g\,;\,f)$: after $x$, undoing $g$ leaves $f$. The tetrahedron on $x,\bar g,\bar f$ with $\sigma_8,\sigma_4,\sigma_1$ gives $(x,w\,;\,1_a)$.`,
      hints: [
        String.raw`Undo $g$ first, then $f$. Make the triangle for $\bar g$ match first.`,
        String.raw`Compose: $f$, $g$. Swap in: $\sigma_5$, $\sigma_2$. Tetrahedron: path $f,g,\bar g$; $d_3=\sigma_6$, $d_0=\sigma_7$. Tetrahedron: path $x,\bar g,\bar f$; $d_3=\sigma_8$, $d_0=\sigma_4$, $d_1=\sigma_1$.`
      ],
      win: [String.raw`$\sigma_9=(x,w\,;\,1_a)$: $w$ undoes $x$, in reverse order.`],
      term: String.raw`Inverse of a composite`,
      math: {
        say: String.raw`If $f,g$ have left inverses $\bar f,\bar g$, then a composite $w$ of $(\bar g,\bar f)$ is a left inverse of a composite $x$ of $(f,g)$. Only inner horns are used, so this holds in every quasi-category.`,
        proof: String.raw`Swap $\bar g$ in for $\bar g'$; fill $\Lambda^3_1$ on $(a,b,c,b)$ for $(x,\bar g;f)$, then $\Lambda^3_2$ on $(a,c,b,a)$ for $(x,w;1_a)$.`
      }
    },
    /* 0. The composition table */
    nerve: {
      title: String.raw`The composition table`,
      bullets: [
        String.raw`The composition table says the composite of $f$ then $g$ is $h$.`,
        String.raw`Construct a triangle $(f,g\,;\,?)$.`
      ],
      explain: String.raw`This picture comes from an ordinary category, and its composition table is shown in a panel: for the pair $f,g$ it lists $h$. Compose obeys the table here. It draws no new arrow; it puts the triangle $\sigma_1=(f,g\,;\,h)$ on the arrows that are already there. The simplicial set you get from a category this way is its <b>nerve</b>: objects as vertices, morphisms as arrows, and a triangle for each composable pair, with the listed composite as its long side.`,
      hints: [String.raw`Check the composition table entry for $f,g$.`, String.raw`Compose: $f$, then $g$.`],
      win: [String.raw`$\sigma_1=(f,g\,;\,h)$, exactly as the composition table lists.`],
      term: String.raw`Nerve of a category`,
      math: {
        say: String.raw`The nerve $N(\mathcal C)$ of a category has $n$-simplices the chains of $n$ composable morphisms. Every inner horn $\Lambda^n_i\to N(\mathcal C)$ has a unique filler; for $n=2$ it is the composite $g\circ f$.`,
        proof: String.raw`The 2-simplex $(f,g;h)$ with $h=g\circ f$ is the unique filler of $\Lambda^2_1$.`
      }
    },
    /* 0. Only one filler */
    onlyone: {
      title: String.raw`Only one filler`,
      bullets: [
        String.raw`The same composition table, with $h$ as the composite of $f,g$.`,
        String.raw`Compose $f,g$, then try to compose them a second time.`
      ],
      explain: String.raw`In the Composition world you composed one pair twice and got two arrows, so try the same thing here. The first Compose gives $\sigma_1=(f,g\,;\,h)$. The second attempt is refused, because the composition table has one entry for $f,g$ and that triangle already exists. In a nerve, the horn $\Lambda^2_1$ on $f,g$ has exactly one filler. The refusal counts as reaching the goal, since being told no is exactly what this level wanted to show you.`,
      hints: [String.raw`Do the same Compose twice.`, String.raw`Compose: $f$, $g$. Compose: $f$, $g$ again.`],
      win: [String.raw`The second Compose was refused: $\Lambda^2_1$ has exactly one filler here.`],
      term: String.raw`Unique fillers`,
      math: {
        say: String.raw`Unique inner horn fillers characterise nerves: $X\cong N(\mathcal C)$ for some $\mathcal C$ iff each inner horn $\Lambda^n_i\to X$ has exactly one extension to $\Delta^n$.`,
        proof: String.raw`A second filler of $\Lambda^2_1$ on $(f,g)$ is refused: it would equal $\sigma_1$.`
      }
    },
    /* 0. A blank entry */
    nerve3: {
      title: String.raw`A blank entry`,
      bullets: [
        String.raw`The composition table lists $f,g\mapsto gf$, $g,h\mapsto hg$, $gf,h\mapsto hgf$; the entry for $f,hg$ is blank.`,
        String.raw`Prove a triangle $(f,hg\,;\,hgf)$ exists.`
      ],
      explain: String.raw`The table is missing one entry, the composite of $f$ with $hg$, and in a category associativity says it must be $hgf$. A tetrahedron can supply it. Compose the three listed pairs to get $\sigma_1=(f,g\,;\,gf)$, $\sigma_2=(g,h\,;\,hg)$ and $\sigma_3=(gf,h\,;\,hgf)$. These are the faces $d_3$, $d_0$ and $d_1$ of the tetrahedron on $f,g,h$, and its fourth face is $(f,hg\,;\,hgf)$. The extra arrow $s$ from $a$ to $d$ is a decoy that the table never mentions.`,
      hints: [
        String.raw`Compose everything the composition table allows, then use a tetrahedron.`,
        String.raw`Compose: $f$, $g$. Compose: $g$, $h$. Compose: $gf$, $h$. Tetrahedron: path $f,g,h$; $d_3=\sigma_1$, $d_0=\sigma_2$, $d_1=\sigma_3$. Fill.`
      ],
      win: [String.raw`$\sigma_4=(f,hg\,;\,hgf)$ fills in the blank entry.`],
      term: String.raw`Associativity in a nerve`,
      math: {
        say: String.raw`A 3-simplex of $N(\mathcal C)$ is a chain $a\to b\to c\to d$ with all its composites; associativity $h\circ(g\circ f)=(h\circ g)\circ f$ says its faces are consistent. Inner horns $\Lambda^3_k$ fill uniquely.`,
        proof: String.raw`Fill $\Lambda^3_2$ on $(a,b,c,d)$ with $d_3=\sigma_1$, $d_0=\sigma_2$, $d_1=\sigma_3$; $d_2$ fills the blank.`
      }
    },
    /* 0. Deciding whether a picture is a nerve */
    segalno: {
      title: String.raw`Deciding whether a picture is a nerve`,
      bullets: [
        String.raw`A nerve has exactly one triangle on every pair of arrows that meet.`,
        String.raw`Decide whether this picture is a nerve; for No, name a pair that breaks the rule.`
      ],
      explain: String.raw`From now on you judge pictures. A simplicial set is a nerve when every pair of arrows that meet end to start, identities included, has exactly one triangle with those two legs. Identities are never the problem in a pair like $1_a,f$, since the degenerate triangle $s_0f$ is always there. This picture has $f:a\to b$ and $g:b\to c$ and no triangle at all, so the pair $f,g$ has none. Press Not a nerve and pick that pair.`,
      hints: [String.raw`Is there any triangle with legs $f$ and $g$?`, String.raw`Not a nerve: $f$, then $g$.`],
      win: [String.raw`The pair $f,g$ has no triangle, so this isn't a nerve.`],
      term: String.raw`Spine`,
      math: {
        say: String.raw`$X\cong N(\mathcal C)$ for a category $\mathcal C$ iff every inner horn has a unique filler; equivalently every spine $I^n\to X$ extends uniquely to $\Delta^n$ (the Segal condition).`,
        proof: String.raw`The horn $\Lambda^2_1\to X$ given by $(f,g)$ has no filler.`
      }
    },
    /* 0. A picture that is a nerve */
    segalyes: {
      title: String.raw`A picture that is a nerve`,
      bullets: [
        String.raw`Given $\sigma_1=(f,g\,;\,h)$ on $a\to b\to c$.`,
        String.raw`Decide whether this picture is a nerve.`
      ],
      explain: String.raw`Go through the pairs that meet. Any pair containing an identity, such as $1_a,f$ or $g,1_c$, has its degenerate triangle, $s_0f$ or $s_1g$, and no other. The pair $f,g$ has exactly one triangle, $\sigma_1$. The arrow $h$ starts at $a$ and ends at $c$, and nothing but an identity meets it at either end. So every pair has exactly one triangle, and the picture is the nerve of the category with objects $a,b,c$ and one arrow between each pair in order.`,
      hints: [String.raw`List the pairs that meet. There aren't many.`, String.raw`Press It is a nerve.`],
      win: [String.raw`Every pair has exactly one triangle: this is the nerve of $a\to b\to c$.`],
      term: String.raw`Segal condition`,
      math: {
        say: String.raw`This simplicial set is $\Delta^2=N([2])$: every horn $\Lambda^2_1\to\Delta^2$ has exactly one filler, as composition in the poset $[2]$ is unique.`,
        proof: String.raw`The only non-degenerate horn is $(f,g)$, filled uniquely by $\sigma_1$ with long side $h$.`
      }
    },
    /* 0. Two fillers of one horn */
    twofill: {
      title: String.raw`Two fillers of one horn`,
      bullets: [
        String.raw`Given $\sigma_1=(f,g\,;\,x)$ and $\sigma_2=(f,g\,;\,x')$.`,
        String.raw`Decide whether this picture is a nerve.`
      ],
      explain: String.raw`In this picture the trouble is a doubled triangle rather than a missing one. The pair $f,g$ has two triangles, with different long sides $x$ and $x'$. In the Composition world that was normal, and this picture could well sit inside a quasi-category where $x\simeq x'$. A category, though, has one composite per pair, so this isn't a nerve, and the pair $f,g$ is the evidence.`,
      hints: [
        String.raw`Count the triangles whose legs are $f$ and $g$.`,
        String.raw`Not a nerve: $f$, then $g$.`
      ],
      win: [String.raw`The pair $f,g$ has two triangles: not a nerve.`],
      term: String.raw`Unique fillers`,
      math: {
        say: String.raw`A quasi-category is the nerve of a category iff inner horns fill uniquely. Here $\Lambda^2_1\to X$ given by $(f,g)$ has two distinct fillers.`,
        proof: String.raw`The 2-simplices $\sigma_1,\sigma_2$ both fill the horn $(f,g)$.`
      }
    },
    /* 0. A missing triangle among six arrows */
    hiddenhole: {
      title: String.raw`A missing triangle among six arrows`,
      bullets: [
        String.raw`Given $\sigma_1=(f,g\,;\,x)$, $\sigma_2=(g,h\,;\,y)$, $\sigma_3=(x,h\,;\,z)$ on four vertices.`,
        String.raw`Decide whether this picture is a nerve.`
      ],
      explain: String.raw`Six arrows make more pairs, and composites count as arrows: $x$ and $y$ start and end at vertices like everything else. Go through each vertex and pair what arrives with what leaves. At $b$: $f$ arrives, $g$ and $y$ leave, so check $f,g$ and $f,y$. At $c$: $g$ and $x$ arrive, $h$ leaves, so check $g,h$ and $x,h$. Three of these pairs have their triangle in the list. One does not, and a single pair is enough for a No.`,
      hints: [String.raw`Look at the pairs that pass through $b$.`, String.raw`Not a nerve: $f$, then $y$.`],
      win: [String.raw`The pair $f,y$ has no triangle, so this isn't a nerve.`],
      term: String.raw`Inner horn`,
      math: {
        say: String.raw`In a nerve $(f,g;x)$, $(g,h;y)$, $(x,h;z)$ force a 2-simplex $(f,y;z)$. Here the horn $\Lambda^2_1$ on $(f,y)$ has no filler.`,
        proof: String.raw`No 2-simplex has legs $(f,y)$: the horn $\Lambda^2_1\to X$ they define does not extend.`
      }
    },
    /* 0. A collapsed triangle */
    quotient: {
      title: String.raw`A collapsed triangle`,
      bullets: [
        String.raw`Given $\sigma_1=(1_p,e\,;\,e')$, with $e,e':p\to c$.`,
        String.raw`Decide whether this picture is a nerve.`
      ],
      explain: String.raw`Every arrow $e:p\to c$ comes with the degenerate triangle $s_0e=(1_p,e\,;\,e)$, so the pair $1_p,e$ always has one triangle. Here it has a second, $\sigma_1=(1_p,e\,;\,e')$, with long side $e'$. Two triangles on one pair means this isn't a nerve. You can picture $\sigma_1$ as an honest triangle whose first side was squashed to the single vertex $p$. Pairs that start with an identity are easy to skip, and this one is the culprit.`,
      hints: [
        String.raw`Remember the degenerate triangle on $1_p,e$.`,
        String.raw`Not a nerve: tap the vertex $p$ (its identity), then $e$.`
      ],
      win: [String.raw`The pair $1_p,e$ has two triangles: $s_0e$ and $\sigma_1$.`],
      term: String.raw`Collapsed triangle`,
      math: {
        say: String.raw`$\Delta^2/\Delta^{\{0,1\}}$ is not a nerve: the horn $(1_p,e)$ has two fillers, the degenerate $s_0(e)$ and the image $\sigma$ of the top simplex, with $d_1\sigma=e'\neq e$.`,
        proof: String.raw`$s_0e$ has boundary $(1_p,e;e)$ and $\sigma_1$ has boundary $(1_p,e;e')$: two fillers of one inner horn.`
      }
    },
    /* 0. Attaching a cell */
    disc: {
      title: String.raw`Attaching a cell`,
      bullets: [
        String.raw`Given three vertices $a,b,c$ and no arrows.`,
        String.raw`Draw three arrows that close up and glue a triangle onto them.`
      ],
      explain: String.raw`Start from bare vertices. Draw arrow three times to get $f:a\to b$, $g:b\to c$ and $h:a\to c$. These three form a closed loop with nothing inside, the boundary $\partial\Delta^2$, which as a shape is a circle. Glue triangle now attaches a 2-cell along that loop: the triangle $\sigma_1=(f,g\,;\,h)$, with all three sides already on the board. Compare Compose, which adds a new long side along with the triangle; gluing adds only the inside, which turns the circle you drew into a disc.`,
      hints: [
        String.raw`Glue triangle needs a loop of three arrows: two end to end and one across.`,
        String.raw`Draw arrow: $a,b$. Draw arrow: $b,c$. Draw arrow: $a,c$. Glue triangle: $f,g,h$.`
      ],
      win: [String.raw`You drew $\partial\Delta^2$ and glued a 2-cell onto it: $\sigma_1=(f,g\,;\,h)$.`],
      term: String.raw`Attaching a cell`,
      math: {
        say: String.raw`Given $\partial\Delta^2\to X$, the pushout $X\sqcup_{\partial\Delta^2}\Delta^2$ attaches a 2-cell to $X$ along it. Here $X=\partial\Delta^2$ and the map is the identity.`,
        proof: String.raw`Pushout along $\partial\Delta^2\hookrightarrow\Delta^2$ on the loop of the three drawn edges gives $\Delta^2$.`
      }
    },
    /* 0. Two cells on one boundary */
    sphere: {
      title: String.raw`Two cells on one boundary`,
      bullets: [String.raw`Given the loop $f,g,h$ with no triangle.`, String.raw`Glue two triangles onto it.`],
      explain: String.raw`Glue a triangle onto $f,g,h$, then glue another onto the same three arrows. You get $\sigma_1$ and $\sigma_2$, both with boundary $(f,g\,;\,h)$, and they are different triangles, which a simplicial set happily allows. As a shape, two discs sewn along their common rim make a hollow ball, a 2-sphere; imagine one triangle as the northern hemisphere and the other as the southern. The note before this level counts it: $3-3+2=2$, the Euler characteristic of a sphere. The last level of this world fills such a sphere in.`,
      hints: [
        String.raw`Glue onto the same loop twice.`,
        String.raw`Glue triangle: $f,g,h$. Glue triangle: $f,g,h$ again.`
      ],
      win: [String.raw`Two 2-cells on one boundary form a 2-sphere.`],
      term: String.raw`2-sphere`,
      math: {
        say: String.raw`Attaching two 2-cells along the same map $\partial\Delta^2\to X$ gives $\Delta^2\sqcup_{\partial\Delta^2}\Delta^2$, whose geometric realisation is homeomorphic to $S^2$.`,
        proof: String.raw`Two pushouts of $\partial\Delta^2\hookrightarrow\Delta^2$ along the same loop $(f,g,h)$.`
      }
    },
    /* 0. Skeleta */
    peel: {
      title: String.raw`Skeleta`,
      bullets: [
        String.raw`Given a tetrahedron (a 3-simplex) with its four faces and six arrows.`,
        String.raw`End with the six arrows and exactly one triangle.`
      ],
      explain: String.raw`Peel removes everything of the highest dimension present. The first Peel takes away the tetrahedron and leaves its four faces: that's the 2-skeleton, the hollow shell $\partial\Delta^3$. The second Peel takes away the four triangles and leaves the 1-skeleton, six arrows on four vertices. Now Glue triangle puts back one face along a loop of three arrows, for example $f,g,x$. A skeleton keeps everything up to a dimension; a cell puts back one simplex at a time.`,
      hints: [String.raw`Peel twice, then glue one triangle.`, String.raw`Peel. Peel. Glue triangle: $f,g,x$.`],
      win: [String.raw`Two layers peeled and one triangle restored: $\sigma_5=(f,g\,;\,x)$.`],
      term: String.raw`Skeleton`,
      math: {
        say: String.raw`$\mathrm{sk}_n$ keeps simplices of dimension $\le n$: $\mathrm{sk}_2\Delta^3=\partial\Delta^3$, and $\mathrm{sk}_1\Delta^3$ is its six edges. Attaching one 2-cell along $\partial\Delta^2\hookrightarrow\Delta^2$ restores one face.`,
        proof: String.raw`Take $\mathrm{sk}_2$, then $\mathrm{sk}_1$, then glue one $\Delta^2$ along its boundary.`
      }
    },
    /* 0. Sphere */
    hollowtet: {
      title: String.raw`Sphere`,
      bullets: [
        String.raw`Given six arrows on four vertices: the wire frame of a tetrahedron.`,
        String.raw`Glue its four faces, with nothing inside.`
      ],
      explain: String.raw`The six arrows $f,g,h,x,y,z$ are the edges of a tetrahedron on $a,b,c,d$. Each face needs three arrows that close up: two end to end and one straight across. Of the twenty ways to pick three of the six arrows, only four close up, one for each face: $(f,g\,;\,x)$, $(g,h\,;\,y)$, $(x,h\,;\,z)$ and $(f,y\,;\,z)$. Glue all four and you have $\partial\Delta^3$, a closed shell. The goal checks that the four faces are there and the inside is empty; the next level fills it.`,
      hints: [
        String.raw`A face is two arrows end to end plus the arrow across.`,
        String.raw`Glue triangle: $f,g,x$. Glue triangle: $g,h,y$. Glue triangle: $x,h,z$. Glue triangle: $f,y,z$.`
      ],
      win: [String.raw`$\partial\Delta^3$: four faces glued along six edges, hollow inside.`],
      term: String.raw`Boundary $\partial\Delta^3$`,
      math: {
        say: String.raw`$\partial\Delta^n$ is the union of the $n+1$ faces of $\Delta^n$ glued along their pairwise intersections. For $n=3$: four 2-simplices along six edges, and $|\partial\Delta^3|\cong S^2$.`,
        proof: String.raw`Attach four 2-cells to $\mathrm{sk}_1\Delta^3$ along the four copies of $\partial\Delta^2$ spanned by three vertices.`
      }
    },
    /* 0. Ball */
    ball: {
      title: String.raw`Ball`,
      bullets: [
        String.raw`Given the wire frame of a tetrahedron: six arrows $f,g,h,x,y,z$.`,
        String.raw`Glue the four faces, then glue a tetrahedron inside them.`
      ],
      explain: String.raw`First build the shell from the last level: glue $(f,g\,;\,x)$, $(g,h\,;\,y)$, $(x,h\,;\,z)$ and $(f,y\,;\,z)$. The shell is a sphere, with Euler characteristic $4-6+4=2$. Glue solid takes four triangles that close up, meaning they are exactly the four faces $d_0,\dots,d_3$ of one tetrahedron, and attaches a 3-cell along them. That is the pushout along $\partial\Delta^3\hookrightarrow\Delta^3$, one dimension up from gluing a triangle into a loop. Count again: $4-6+4-1=1$, the same as a single point. The ball can be shrunk to a point; the empty shell cannot.`,
      hints: [
        String.raw`Glue solid needs all four faces first.`,
        String.raw`Glue triangle: $f,g,x$. Glue triangle: $g,h,y$. Glue triangle: $x,h,z$. Glue triangle: $f,y,z$. Glue solid: the four triangles.`
      ],
      win: [String.raw`A 3-cell fills the sphere $\partial\Delta^3$: the result is $\Delta^3$, a ball.`],
      term: String.raw`3-cell`,
      math: {
        say: String.raw`Attaching a 3-cell to $\partial\Delta^3$ along the identity gives $\partial\Delta^3\sqcup_{\partial\Delta^3}\Delta^3=\Delta^3$, which is contractible; $\chi$ goes from $2$ to $1$.`,
        proof: String.raw`Attach four 2-cells to $\mathrm{sk}_1\Delta^3$ to get $\partial\Delta^3$, then one 3-cell along $\partial\Delta^3\hookrightarrow\Delta^3$.`
      }
    },
    /* 0. The coskeleton */
    fillin: {
      title: String.raw`The coskeleton`,
      bullets: [String.raw`Given the loop $f,g,h$ with no triangle.`, String.raw`Fill it in.`],
      explain: String.raw`Peel removes the top layer, and Fill in goes the other way: wherever the board has a complete boundary with nothing inside, it adds exactly one simplex there. This is the coskeleton $\mathrm{cosk}_1$, which adds a triangle for every closed loop of three arrows and a tetrahedron for every closed shell of four triangles, keeping one of each. Here the only boundary is the loop $f,g,h$, so one click adds $\sigma_1=(f,g\,;\,h)$, with no choices to make.`,
      hints: [String.raw`There is one tool.`, String.raw`Press Fill in.`],
      win: [String.raw`The coskeleton filled the loop with $\sigma_1=(f,g\,;\,h)$.`],
      term: String.raw`Coskeleton`,
      math: {
        say: String.raw`$(\mathrm{cosk}_nX)_m=\mathrm{Hom}(\mathrm{sk}_n\Delta^m,X)$: an $m$-simplex of the coskeleton is a compatible family of faces of dimension $\le n$. $\mathrm{cosk}_n$ is right adjoint to $\mathrm{sk}_n$.`,
        proof: String.raw`$\mathrm{cosk}_1(\partial\Delta^2)$ has a unique 2-simplex with the given boundary, so it is $\Delta^2$.`
      }
    },
    /* 0. Skeleton of a coskeleton */
    rebuild: {
      title: String.raw`Skeleton of a coskeleton`,
      bullets: [
        String.raw`Given six arrows on four vertices.`,
        String.raw`End with the four faces of a tetrahedron and no 3-simplex.`
      ],
      explain: String.raw`In the level Sphere this took four Glue triangle moves. Fill in is faster but greedy: it adds the four faces, and then those four faces form a closed shell, so it adds the 3-simplex inside too. One Peel removes the tetrahedron and leaves the shell. In symbols, applied to the six arrows, $\mathrm{sk}_2\,\mathrm{cosk}_1$ is the boundary $\partial\Delta^3$: fill everything, then keep dimensions up to two.`,
      hints: [String.raw`Fill in overshoots by one dimension.`, String.raw`Press Fill in. Then Peel.`],
      win: [String.raw`Fill in, then Peel: the boundary of a tetrahedron.`],
      term: String.raw`$\mathrm{sk}_2\,\mathrm{cosk}_1$`,
      math: {
        say: String.raw`$\mathrm{cosk}_1(\mathrm{sk}_1\Delta^3)=\Delta^3$, since nerves of posets are 1-coskeletal, and $\mathrm{sk}_2\Delta^3=\partial\Delta^3$. So $\mathrm{sk}_2\mathrm{cosk}_1\mathrm{sk}_1\Delta^3=\partial\Delta^3$.`,
        proof: String.raw`The coskeleton adds the four 2-simplices and the 3-simplex; the 2-skeleton discards the 3-simplex.`
      }
    },
    /* 0. Fill the spine */
    spine: {
      title: String.raw`Fill the spine`,
      bullets: [
        String.raw`Given arrows $f,g,h$ end to end.`,
        String.raw`Build a tetrahedron (a 3-simplex) on them, or build a category where it fails.`
      ],
      explain: String.raw`From here on, every goal might be impossible, and part of the puzzle is deciding. The path $f,g,h$ is the <b>spine</b> of a tetrahedron: its edges $01$, $12$ and $23$. Can horn fillings build a whole tetrahedron from it? You already know they can, from Two bracketings. Compose $f,g$, then $g,h$, then $x,h$, and the three triangles are three faces of the tetrahedron on $f,g,h$. Filling that inner horn adds the tetrahedron along with its fourth face, and the goal counts the tetrahedron.`,
      hints: [
        String.raw`You have built this before.`,
        String.raw`Compose: $f$, $g$. Compose: $g$, $h$. Compose: $x$, $h$. Tetrahedron: path $f,g,h$; $d_3=\sigma_1$, $d_0=\sigma_2$, $d_1=\sigma_3$. Fill.`
      ],
      win: [String.raw`Possible: inner horns grew the whole tetrahedron from its spine.`],
      term: String.raw`Inner anodyne`,
      math: {
        say: String.raw`The spine inclusion $\mathrm{Spine}^3\hookrightarrow\Delta^3$ is inner anodyne: it is a composite of pushouts of inner horn inclusions. So it has the left lifting property against inner fibrations.`,
        proof: String.raw`Fill $\Lambda^2_1$ three times for the composites; then $\Lambda^3_2$ gives the 3-simplex on $(a,b,c,d)$.`
      }
    },
    /* 0. A closed loop */
    nofill: {
      title: String.raw`A closed loop`,
      bullets: [
        String.raw`Given $f:a\to b$, $g:b\to c$, $h:a\to c$ and no triangle.`,
        String.raw`Construct $(f,g\,;\,h)$, or build a category where it fails.`
      ],
      explain: String.raw`This loop is a hollow triangle, the shape the Skeleta and cells world capped with Glue triangle, and that tool isn't in this world. Every tool here fills a horn: a shape missing exactly one face. Compose on $f,g$ adds a new arrow with a triangle on it and leaves $h$ alone. To prove the goal impossible, pick the counter-model Hollow triangle, a category with objects $0,1,2$ in which $f$ then $g$ composes to its own arrow $k$, different from $h$. Your picture fits inside it, the triangle $(f,g\,;\,h)$ is false there, and horn fillings can't change that.`,
      hints: [
        String.raw`Is any horn here missing exactly the face you want?`,
        String.raw`This can't be done. Build objects $0,1,2$ with an arrow for each of $f,g,h$, plus one more arrow $k:0\to 2$, and set ($f$'s arrow) then ($g$'s arrow) $=k$.`
      ],
      win: [String.raw`Impossible: in the hollow-triangle category, $f$ then $g$ is $k$, never $h$.`],
      term: String.raw`Not anodyne`,
      math: {
        say: String.raw`$\partial\Delta^2\hookrightarrow\Delta^2$ is not anodyne: anodyne maps are weak homotopy equivalences, but $|\partial\Delta^2|\simeq S^1$ while $|\Delta^2|$ is contractible.`,
        proof: String.raw`Map the loop into the nerve of the category with $f,g,h,k$ and $g\circ f=k\ne h$; every inner horn filling extends there, and $(f,g;h)$ does not exist.`
      }
    },
    /* 0. A square with no diagonal */
    squarehole: {
      title: String.raw`A square with no diagonal`,
      bullets: [
        String.raw`Given $f:a\to b$, $g:b\to d$, $u:a\to c$, $v:c\to d$.`,
        String.raw`Construct one arrow that is a composite of both $f,g$ and $u,v$, or build a category where it fails.`
      ],
      explain: String.raw`You can get from $a$ to $d$ by $f$ then $g$, or by $u$ then $v$. Composing each pair gives an arrow from $a$ to $d$, and the goal asks for a single arrow that composes both. Nothing on the board joins the two ways round: the square is a closed loop of four arrows with a hole in the middle. In the counter-model Square that doesn't commute, $f$ then $g$ is an arrow $x$ and $u$ then $v$ is a different arrow $y$. Your four arrows fit inside it, and no arrow composes both pairs there.`,
      hints: [
        String.raw`Compose each way round. What could join the two results?`,
        String.raw`This can't be done. Build objects $0,1,2,3$, an arrow for each of $f,g,u,v$, and two different arrows $p,q:0\to 3$; set $f$ then $g$ to $p$ and $u$ then $v$ to $q$.`
      ],
      win: [String.raw`Impossible: the two ways round have different composites in the non-commuting square.`],
      term: String.raw`A hole`,
      math: {
        say: String.raw`With no 2-simplex joining the pairs $(f,g)$ and $(u,v)$, nothing forces a common composite: the nerve of the category with $g\circ f=x\ne y=v\circ u$ receives the square and has no common composite.`,
        proof: String.raw`Counter-model: the category on $0,1,2,3$ with two distinct arrows $0\to3$, $x=g\circ f$ and $y=v\circ u$.`
      }
    },
    /* 0. Two parallel arrows */
    parallel: {
      title: String.raw`Two parallel arrows`,
      bullets: [
        String.raw`Given $f,g:a\to b$ and nothing else.`,
        String.raw`Prove $f\simeq g$, or build a category where it fails.`
      ],
      explain: String.raw`Sharing endpoints doesn't make two arrows homotopic. You need a triangle $(f,1_b\,;\,g)$, and every tool here builds triangles out of triangles that already exist. The only triangles on this board are the degenerate ones, $s_0f$, $s_1f$, $s_0g$, $s_1g$ and those on identities, and none of them relates $f$ to $g$. For the proof, choose Two parallel arrows: a category with objects $0,1$ and two different arrows $p,q:0\to1$. In a category $f\simeq g$ means $f=g$, and $p\ne q$.`,
      hints: [
        String.raw`Which triangles exist to start from?`,
        String.raw`This can't be done. Two objects and two different arrows $0\to 1$ are already a category; send $f$ to one and $g$ to the other.`
      ],
      win: [String.raw`Impossible: two distinct parallel arrows in a category aren't homotopic.`],
      term: String.raw`No free homotopy`,
      math: {
        say: String.raw`Parallel edges $f,g:a\to b$ need not be homotopic: in the nerve of the category with two distinct morphisms $p,q:0\to1$ there is no 2-simplex $(p,1;q)$.`,
        proof: String.raw`Map $f\mapsto p$, $g\mapsto q$ into that nerve; a homotopy would force $p=q$.`
      }
    },
    /* 0. A loop filled up to homotopy */
    almostring: {
      title: String.raw`A loop filled up to homotopy`,
      bullets: [
        String.raw`Given $\sigma_1=(f,g\,;\,x)$, $\sigma_2=(x,1_c\,;\,m)$ and $\sigma_3=(h,1_c\,;\,m)$.`,
        String.raw`Construct $(f,g\,;\,h)$, or build a category where it fails.`
      ],
      explain: String.raw`Again a loop $f,g,h$ with no triangle on $h$, and this time it closes. You have $x$ from $f,g$, with $x\simeq m$ and $h\simeq m$. So $h$ is homotopic to a composite of $f,g$ by way of $m$, and homotopic arrows can be swapped into triangles. Swap in $\sigma_2$ into $\sigma_1$ to get $\sigma_4=(f,g\,;\,m)$. Flip $\sigma_3$ to get $\sigma_5=(m,1_c\,;\,h)$, and Swap in once more. The two homotopies did the work a hole can't do.`,
      hints: [
        String.raw`Move the long side from $x$ to $m$, then from $m$ to $h$.`,
        String.raw`Swap in: $\sigma_2$, $\sigma_1$. Flip: $\sigma_3$. Swap in: $\sigma_5$, $\sigma_4$.`
      ],
      win: [String.raw`Possible: $\sigma_6=(f,g\,;\,h)$, carried over by two homotopies.`],
      term: String.raw`Swapping homotopic arrows`,
      math: {
        say: String.raw`If $x\simeq m$ and $h\simeq m$, and $\sigma$ has $d_1\sigma=x$, then there is a 2-simplex with the same legs and long side $h$, via inner horns $\Lambda^3_1,\Lambda^3_2$.`,
        proof: String.raw`Swap in $\sigma_2$ into $\sigma_1$ for $(f,g;m)$; Flip $\sigma_3$ for $(m,1_c;h)$; Swap in again for $(f,g;h)$.`
      }
    },
    /* 0. Two prepared tetrahedra */
    wedge: {
      title: String.raw`Two prepared tetrahedra`,
      bullets: [
        String.raw`Given $\sigma_1=(f,g\,;\,x)$, $\sigma_2=(x,h\,;\,z)$, $\sigma_3=(z,i\,;\,t)$ on the path $f,g,h,i$.`,
        String.raw`Construct $y$ from $g,h$ and $w$ from $h,i$; prove $(f,y\,;\,z)$ and $(x,w\,;\,t)$.`
      ],
      explain: String.raw`Look for tetrahedra. The path $f,g,h$ has faces $\sigma_1$ as $d_3$ and $\sigma_2$ as $d_1$ already, and it lacks $d_0$, a composite of $g,h$. The path $x,h,i$ has $\sigma_2$ as $d_3$ and $\sigma_3$ as $d_1$, and lacks a composite of $h,i$. Compose supplies each missing face, and then each tetrahedron is an inner horn $\Lambda^3_2$ whose missing face $d_2$ is the triangle the goal asks for, which means the goal can be reached in four moves.`,
      hints: [
        String.raw`Each tetrahedron is one composite short.`,
        String.raw`Compose: $g$, $h$. Tetrahedron: path $f,g,h$; $d_3=\sigma_1$, $d_0=\sigma_4$, $d_1=\sigma_2$. Compose: $h$, $i$. Tetrahedron: path $x,h,i$; $d_3=\sigma_2$, $d_0=\sigma_6$, $d_1=\sigma_3$.`
      ],
      win: [String.raw`Possible: $\sigma_5=(f,y\,;\,z)$ and $\sigma_7=(x,w\,;\,t)$.`],
      term: String.raw`Inner horn $\Lambda^3_2$`,
      math: {
        say: String.raw`After composing $g,h$ to $y$, the 2-simplices $(f,g;x)$, $(g,h;y)$, $(x,h;z)$ form a horn $\Lambda^3_2\to X$; likewise for $h,i$ and $w$. Each extends over $\Delta^3$.`,
        proof: String.raw`Fill $\Lambda^2_1$ on $(g,h)$, then $\Lambda^3_2$ on $(a,b,c,d)$ for $(f,y;z)$; repeat with $(h,i)$ and $(a,c,d,e)$ for $(x,w;t)$.`
      }
    },
    /* 0. Half a spine */
    halfspine: {
      title: String.raw`Half a spine`,
      bullets: [
        String.raw`Given $f:a\to b$ and the triangle $\sigma_1=(g,h\,;\,y)$ on $b,c,d$.`,
        String.raw`Construct $(f,g\,;\,x)$ and $(f,y\,;\,z)$, then prove $(x,h\,;\,z)$ with a tetrahedron, or build a category where it fails.`
      ],
      explain: String.raw`This time the starting shape is a triangle with an arrow hanging off its first corner, $\Delta^{01}\cup\Delta^{123}$ in the notation of the note before this level. You need a tetrahedron on the path $f,g,h$. Count its faces: $d_0=(g,h\,;\,y)$ is $\sigma_1$, and Compose can make $d_3=(f,g\,;\,x)$ and $d_2=(f,y\,;\,z)$. That leaves $d_1=(x,h\,;\,z)$ missing, and a tetrahedron missing $d_1$ is the inner horn $\Lambda^3_1$. So two compositions and one tetrahedron do it.`,
      hints: [
        String.raw`Which face of the tetrahedron on $f,g,h$ is $\sigma_1$, and which two can Compose make?`,
        String.raw`Compose: $f$, $g$. Compose: $f$, $y$. Tetrahedron: path $f,g,h$; $d_3=\sigma_2$, $d_0=\sigma_1$, $d_2=\sigma_3$. Fill.`
      ],
      win: [
        String.raw`Possible: $\sigma_4=(x,h\,;\,z)$ and the tetrahedron on $f,g,h$, from the inner horn $\Lambda^3_1$.`
      ],
      term: String.raw`Inner horn $\Lambda^3_1$`,
      math: {
        say: String.raw`The inclusion $\Delta^{\{0,1\}}\cup\Delta^{\{1,2,3\}}\hookrightarrow\Delta^3$ is inner anodyne: fill $\Lambda^2_1$ twice to add the faces $d_3$ and $d_2$, then $\Lambda^3_1$.`,
        proof: String.raw`Fill $\Lambda^2_1$ on $(f,g)$ and on $(f,y)$; fill $\Lambda^3_1$ on $(a,b,c,d)$ with $d_3=\sigma_2$, $d_0=\sigma_1$, $d_2=\sigma_3$; $d_1=(x,h;z)$.`
      }
    },
    /* 0. An open square */
    opensquare: {
      title: String.raw`An open square`,
      bullets: [
        String.raw`Given $f:a\to b$, $v:b\to d$ and $u:a\to c$.`,
        String.raw`Construct $(f,v\,;\,x)$ and $(u,w\,;\,x)$, or build a category where it fails.`
      ],
      explain: String.raw`Three sides of a square, and the fourth side $w:c\to d$ is missing. The first triangle is easy: Compose $f,v$ gives a diagonal $x$. The second triangle $(u,w\,;\,x)$ knows its first leg $u$ and its long side $x$ and wants its second leg: two arrows leaving $a$, the outer horn $\Lambda^2_0$. No tool here fills outer horns. The counter-model Open square is a category with objects $0,1,2,3$, arrows $f,v,u$, the composite $x$, and nothing at all from $2$ to $3$, so $w$ has nowhere to go.`,
      hints: [
        String.raw`Which horn would produce the missing side?`,
        String.raw`This can't be done. Build objects $0,1,2,3$ with arrows for $f:0\to 1$, $v:1\to 3$, $u:0\to 2$ and their composite $0\to 3$, and no arrow from $2$ to $3$.`
      ],
      win: [
        String.raw`Impossible: the missing side comes from an outer horn, and the open square has no arrow from $2$ to $3$.`
      ],
      term: String.raw`Outer horn $\Lambda^2_0$`,
      math: {
        say: String.raw`The inclusion $(\Delta^1\times\{0\})\cup(\partial\Delta^1\times\Delta^1)\hookrightarrow\Delta^1\times\Delta^1$ is left anodyne but not inner anodyne: a quasi-category need not extend it.`,
        proof: String.raw`Counter-model: the nerve of the poset $0<1<3$, $0<2$. It contains the three sides and has no edge $2\to 3$.`
      }
    },
    /* 0. A square and a prism */
    square: {
      title: String.raw`A square and a prism`,
      bullets: [
        String.raw`Given $f,v,u$ and $t$ on five vertices; every horn fills in this level.`,
        String.raw`Construct and prove the five triangles in the goal.`
      ],
      explain: String.raw`This is the open square again, with the outer horns switched on. Compose $f,v$ for the diagonal $x$ ($\sigma_1$). Solve $f\cdot ?\simeq h$ on $u$ and $x$ fills the outer horn $\Lambda^2_0$ and gives the missing side $y:c\to d$ with $\sigma_2=(u,y\,;\,x)$. Now extend everything by $t:d\to e$. Compose $y,t$ for $z$ ($\sigma_3$) and $x,t$ for $w$ ($\sigma_4$). The tetrahedron on $u,y,t$ has faces $\sigma_2,\sigma_3,\sigma_4$ as $d_3,d_0,d_1$, and its missing face is $(u,z\,;\,w)$. The arrows $t'$ and $w_0$ are spares you can ignore.`,
      hints: [
        String.raw`Close the square first, then push both sides along $t$.`,
        String.raw`Compose: $f$, $v$. Solve $f\cdot ?\simeq h$: $u$, $x$. Compose: $y$, $t$. Compose: $x$, $t$. Tetrahedron: path $u,y,t$; $d_3=\sigma_2$, $d_0=\sigma_3$, $d_1=\sigma_4$.`
      ],
      win: [
        String.raw`Possible: one outer horn closed the square and four more fillings built the prism on it.`
      ],
      term: String.raw`Anodyne map`,
      math: {
        say: String.raw`The square $\Delta^1\times\Delta^1$ is two 2-simplices glued along the diagonal. Closing an open square needs an outer horn $\Lambda^2_0$, which fills in a Kan complex; the rest uses inner horns.`,
        proof: String.raw`Fill $\Lambda^2_1$ on $(f,v)$, $\Lambda^2_0$ on $(u,x)$, $\Lambda^2_1$ on $(y,t)$ and $(x,t)$, then $\Lambda^3_2$ on $(a,c,d,e)$ for $(u,z;w)$.`
      }
    },
    /* 0. Lifting a path */
    liftpath: {
      title: String.raw`Lifting a path`,
      bullets: [
        String.raw`In the total space $X$ there's one vertex $x$, over $\bar a$. The base $S$ has the triangle $(\bar f,\bar g\,;\,\bar x)$.`,
        String.raw`Construct a triangle in $X$ that lies over $(\bar f,\bar g\,;\,\bar x)$.`
      ],
      explain: String.raw`The base $S$ has a path $\bar a\to\bar b\to\bar c$ with a triangle on it. In $X$ you have a single vertex $x$ over $\bar a$. The map is a left fibration, so any arrow of $S$ can be lifted from any vertex over its start: Lift arrow from $x$ along $\bar f$ gives an arrow $f$ that ends at a new vertex over $\bar b$. You choose where a lift starts; the map chooses where it ends. Lift $\bar g$ from that new vertex to get $g$. Now $f,g$ is an inner horn over the triangle of $S$, and Compose fills it with a triangle lying over $(\bar f,\bar g\,;\,\bar x)$.`,
      hints: [
        String.raw`Lift twice, then compose the two lifts.`,
        String.raw`Lift arrow: from $x$ (along $\bar f$). Lift arrow: from the new vertex (along $\bar g$). Compose: $f$, $g$.`
      ],
      win: [String.raw`A path of $S$ lifted to $X$, with a triangle over the triangle of $S$.`],
      term: String.raw`Left fibration`,
      math: {
        say: String.raw`$p:X\to S$ is a left fibration if it has the right lifting property against $\Lambda^n_i\hookrightarrow\Delta^n$ for $0\le i<n$. For $n=1$: every edge of $S$ lifts with a prescribed source.`,
        proof: String.raw`Lift $\Lambda^1_0\hookrightarrow\Delta^1$ twice, then the inner horn $\Lambda^2_1$ over the 2-simplex $(\bar f,\bar g;\bar x)$ of $S$.`
      }
    },
    /* 0. A missing first leg, lifted */
    backfill: {
      title: String.raw`A missing first leg, lifted`,
      bullets: [
        String.raw`In $X$: $g:y\to z$ over $\bar g$ and $k:x\to z$ over $\bar x$.`,
        String.raw`Construct $(?,g\,;\,k)$ over $(\bar f,\bar g\,;\,\bar x)$, or press This can't be done.`
      ],
      explain: String.raw`You need an arrow from $x$ to $y$ over $\bar f$ that fits into a triangle with $g$ and $k$. The horn is $g$ and $k$, two arrows arriving at $z$: that is $\Lambda^2_2$, and a left fibration lifts $\Lambda^n_k$ only for $k<n$. The tempting move is Lift arrow from $x$ along $\bar f$, and it lands on a fresh vertex over $\bar b$, which isn't $y$. There are left fibrations over this $S$ where the lift of $\bar f$ from $x$ never reaches $y$, so the goal can fail. Press This can't be done and give the reason.`,
      hints: [
        String.raw`Lift $\bar f$ from $x$ and see where it ends.`,
        String.raw`Press This can't be done; the reason is that a lift along a left fibration has a chosen start, never a chosen end.`
      ],
      win: [String.raw`Impossible: a left fibration chooses where a lift starts, never where it ends.`],
      term: String.raw`No lift of $\Lambda^2_2$`,
      math: {
        say: String.raw`A left fibration need not lift $\Lambda^2_2\hookrightarrow\Delta^2$. Counter-model: the left fibration over $\Delta^2$ classified by a functor $F$ with $F(\bar b)=\{y,y'\}$ and $F(\bar f)(x)=y'$ has no edge $x\to y$.`,
        proof: String.raw`Every move here is a left-anodyne extension, so it maps to the counter-model; there the only lift of $\bar f$ from $x$ ends at $y'\ne y$.`
      }
    },
    /* 0. Closing a lifted square */
    prism: {
      title: String.raw`Closing a lifted square`,
      bullets: [
        String.raw`In $X$: $f:a\to b$, $v:b\to d$, $u:a\to c$. In $S$ the whole square exists, with triangles $(\bar f,\bar v\,;\,\bar x)$ and $(\bar u,\bar w\,;\,\bar x)$.`,
        String.raw`Construct $(f,v\,;\,x)$ and $(u,w\,;\,x)$ over those two triangles.`
      ],
      explain: String.raw`This is the open square from the last world, now lying over a base in which the square is complete. Compose $f,v$: an inner horn, giving the diagonal $x$ and $\sigma_1$ over $(\bar f,\bar v\,;\,\bar x)$. The second triangle knows its first leg $u$ and its long side $x$, which is the outer horn $\Lambda^2_0$, and a left fibration lifts it: Solve $f\cdot ?\simeq h$ on $u,x$ gives $y:c\to d$ and $\sigma_2=(u,y\,;\,x)$ over the second triangle. Lift arrow along $\bar w$ from $c$ would also give an arrow, ending at a new vertex instead of $d$.`,
      hints: [
        String.raw`Diagonal first, then the bottom side.`,
        String.raw`Compose: $f$, $v$. Solve $f\cdot ?\simeq h$: $u$, $x$.`
      ],
      win: [String.raw`The square closes in $X$: a left fibration lifts horns that know their first leg.`],
      term: String.raw`Left horn $\Lambda^2_0$`,
      math: {
        say: String.raw`The inclusion $(\Delta^1\times\{0\})\cup(\partial\Delta^1\times\Delta^1)\hookrightarrow\Delta^1\times\Delta^1$ is left anodyne: a pushout of $\Lambda^2_1$ followed by a pushout of $\Lambda^2_0$. So it lifts against any left fibration.`,
        proof: String.raw`Lift $\Lambda^2_1$ over $(\bar f,\bar v,\bar x)$ for the diagonal, then $\Lambda^2_0$ over $(\bar u,\bar w,\bar x)$ for the missing side.`
      }
    },
    /* 0. An inner fibration over an isomorphism */
    inneronly: {
      title: String.raw`An inner fibration over an isomorphism`,
      bullets: [
        String.raw`In $S$, $\bar f$ has an inverse $\bar g$; the map is only an inner fibration.`,
        String.raw`Construct $(f,?\,;\,1_x)$, or press This can't be done.`
      ],
      explain: String.raw`In $S$, $\bar f:\bar x\to\bar y$ is an isomorphism, with triangles $(\bar f,\bar g\,;\,1)$ and $(\bar g,\bar f\,;\,1)$. In $X$ you have only $f:x\to y$, and you want an arrow back. That arrow would be the second leg of $(f,?\,;\,1_x)$, which is the outer horn $\Lambda^2_0$. An inner fibration lifts inner horns only. For example, the single arrow $x\to y$ mapping onto $\bar f$ is an inner fibration with no arrow from $y$ to $x$ at all. Press This can't be done and name the reason. The next level uses the same board with a left fibration.`,
      hints: [
        String.raw`An inverse is the missing side of an outer horn. Which horns does this map lift?`,
        String.raw`Press This can't be done; the reason is that this map lifts inner horns only.`
      ],
      win: [
        String.raw`Impossible: lying over an isomorphism doesn't make $f$ invertible when only inner horns lift.`
      ],
      term: String.raw`Not conservative`,
      math: {
        say: String.raw`An inner fibration need not be conservative. $\Delta^1\to N(J)$, $J$ the walking isomorphism, is an inner fibration (the nerve of a functor) sending the non-invertible edge to an isomorphism.`,
        proof: String.raw`$X=\Delta^1$ is a counter-model: all inner horns lift against $\Delta^1\to N(J)$, yet no edge $y\to x$ exists.`
      }
    },
    /* 0. A left fibration over an isomorphism */
    conservative: {
      title: String.raw`A left fibration over an isomorphism`,
      bullets: [
        String.raw`The same board, but now the map is a left fibration.`,
        String.raw`Construct a left inverse of $f$ and prove it's a right inverse too.`
      ],
      explain: String.raw`A left fibration lifts $\Lambda^2_0$, so Solve $f\cdot ?\simeq h$ on $f$ and $1_x$ works over the triangle $(\bar f,\bar g\,;\,1)$: it gives an arrow from $y$ to $x$ and $\sigma_1=(f,\cdot\,;\,1_x)$. The board names that arrow $x$, the next free letter, so mind the clash with the vertex $x$. For the other side take the tetrahedron on the path $f$, new arrow, $f$, with corners over $x,y,x,y$: $d_3=\sigma_1$, $d_1=s_0f=(1_x,f\,;\,f)$ and $d_2=s_1f=(f,1_y\,;\,f)$, both degenerate. Its missing face is $d_0$, an outer horn $\Lambda^3_0$, which a left fibration lifts too. A map with this property is <b>conservative</b>.`,
      hints: [
        String.raw`Solve for a left inverse. Then a tetrahedron on $f$, the new arrow, $f$.`,
        String.raw`Solve $f\cdot ?\simeq h$: $f$, $1_x$. Tetrahedron: path $f$, new arrow, $f$; $d_3=\sigma_1$, $d_1=s_0f$, $d_2=s_1f$.`
      ],
      win: [String.raw`$\sigma_2$ makes the new arrow a two-sided inverse: left fibrations are conservative.`],
      term: String.raw`Conservative`,
      math: {
        say: String.raw`Left fibrations are conservative: if $p(f)$ is an isomorphism in $S$ then $f$ is an isomorphism in $X$. The inverse is the lift of $\Lambda^2_0$, and it is two-sided by a lift of $\Lambda^3_0$.`,
        proof: String.raw`Lift $\Lambda^2_0$ over $(\bar f,\bar g;1)$ for $g$; lift $\Lambda^3_0$ on $(x,y,x,y)$ with faces $\sigma_1$, $s_0f$, $s_1f$: the new face is $(g,f;1_y)$.`
      }
    },
    /* 0. Two lifts of one arrow */
    twolifts: {
      title: String.raw`Two lifts of one arrow`,
      bullets: [
        String.raw`From $x$, two paths lie over $\bar x$: $f$ then $g$ ending at $z$, and $k'$ ending at $z'$.`,
        String.raw`Prove $z$ and $z'$ are joined by mutually inverse arrows.`
      ],
      explain: String.raw`Two lifts of the same arrow $\bar x$ from $x$ end at $z$ and $z'$, and the claim is that these ends are isomorphic. Compose $f,g$ to get an arrow $x\to z$ over $\bar x$ (the board calls it $x$). It and $k'$ both leave $x$, forming $\Lambda^2_0$ over the degenerate triangle $s_1\bar x$, so Solve gives an arrow $y:z\to z'$ over $1_{\bar c}$. Solve again on $y$ and $1_z$ for $z:z'\to z$ (letters run out fast here). The tetrahedron on $y,z,y$ with $d_3=\sigma_3$ and the degenerate $d_1=s_0y$, $d_2=s_1y$ is an outer horn $\Lambda^3_0$, as in the last level, and gives the other side.`,
      hints: [
        String.raw`Solve for an arrow from $z$ to $z'$, then invert it as in the last level.`,
        String.raw`Compose: $f$, $g$. Solve $f\cdot ?\simeq h$: $x$, $k'$. Solve $f\cdot ?\simeq h$: $y$, $1_z$. Tetrahedron: path $y,z,y$; $d_3=\sigma_3$, $d_1=s_0y$, $d_2=s_1y$.`
      ],
      win: [
        String.raw`$\sigma_3$ and $\sigma_4$ make $y:z\to z'$ an isomorphism: the two lifts end at isomorphic vertices.`
      ],
      term: String.raw`Uniqueness of lifts`,
      math: {
        say: String.raw`For a left fibration $p$, lifts of an edge with a fixed source are unique up to isomorphism in the fibre: $\Lambda^2_0$ and $\Lambda^3_0$ lift over degenerate simplices.`,
        proof: String.raw`Lift $\Lambda^2_1$; lift $\Lambda^2_0$ over $s_1(\bar x)$ for $y$; lift $\Lambda^2_0$ over $s_0s_0(\bar c)$ for its inverse $z$; lift $\Lambda^3_0$ on $(z,z',z,z')$.`
      }
    },
    /* 0. An arrow with no inverse */
    oneway: {
      title: String.raw`An arrow with no inverse`,
      bullets: [
        String.raw`Given one arrow $f:a\to b$; only inner horns fill.`,
        String.raw`Construct $(f,?\,;\,1_a)$, or build a category where it fails.`
      ],
      explain: String.raw`In the Kan complexes world this was one Solve. Here the missing second leg would come from the outer horn $\Lambda^2_0$, and only inner horns fill. Starting from one arrow $a\to b$, inner fillings only ever produce arrows $a\to a$, $a\to b$ and $b\to b$, so nothing will ever point from $b$ back to $a$. The counter-model One arrow is the category $0\to1$ with a single arrow $u$: it contains $f$ as $u$, satisfies every inner horn, and has no arrow $1\to0$ at all.`,
      hints: [
        String.raw`Which way do arrows made by inner fillings point?`,
        String.raw`This can't be done. Two objects and a single arrow $0\to 1$ form a category with nothing going back.`
      ],
      win: [String.raw`Impossible: in the category $0\to1$ nothing goes back.`],
      term: String.raw`Not every arrow inverts`,
      math: {
        say: String.raw`Not every edge of a quasi-category is an equivalence: $\Delta^1=N(\{0<1\})$ is a quasi-category with no edge $1\to0$.`,
        proof: String.raw`Map $f$ to the non-degenerate edge of $N(\{0<1\})$; a left inverse would be an edge $1\to0$.`
      }
    },
    /* 0. Cancelling without an inverse */
    nocancel: {
      title: String.raw`Cancelling without an inverse`,
      bullets: [
        String.raw`Given $\sigma_1=(f,g\,;\,x)$ and $\sigma_2=(k,g\,;\,x)$.`,
        String.raw`Prove $f\simeq k$, or build a category where it fails.`
      ],
      explain: String.raw`This is Cancelling an arrow from the Kan complexes world. There, the tetrahedron on $f,1_b,g$ had its missing face at $d_3$, an outer horn $\Lambda^3_3$, and Kan let you fill it. Here that face carries a padlock. The counter-model Fork shows it stays locked for good: a category with $p,q:0\to1$, $g:1\to2$, and $p$ then $g$ equal to $q$ then $g$, both $x$, while $p\ne q$. Send $f$ to $p$ and $k$ to $q$; both triangles hold and the goal fails.`,
      hints: [
        String.raw`Remember which face of the tetrahedron was missing in the Kan version.`,
        String.raw`This can't be done. Build two different arrows $p,q:0\to 1$, one arrow $1\to 2$ for $g$ and one $0\to 2$ for $x$; set both $p$ then $g$ and $q$ then $g$ to that last arrow.`
      ],
      win: [
        String.raw`Impossible: without an inverse for $g$, different arrows can compose with $g$ to the same thing.`
      ],
      term: String.raw`No cancellation`,
      math: {
        say: String.raw`Cancellation ($g\circ f\simeq g\circ k\Rightarrow f\simeq k$) needs the outer horn $\Lambda^3_3$, which fills only if $X$ is Kan or $g$ is an equivalence. In the nerve of the fork category it fails.`,
        proof: String.raw`Counter-model: $p\ne q:0\to1$ with $g\circ p=g\circ q=x$.`
      }
    },
    /* 0. A one-sided inverse */
    backpath: {
      title: String.raw`A one-sided inverse`,
      bullets: [
        String.raw`Given $\sigma_1=(f,g\,;\,1_a)$ with $f:a\to b$ and $g:b\to a$.`,
        String.raw`Prove $(g,f\,;\,1_b)$, or build a category where it fails.`
      ],
      explain: String.raw`Going out along $f$ and back along $g$ composes to the identity at $a$, by $\sigma_1$. Going $g$ then $f$ need not compose to the identity at $b$, and the counter-model One-sided inverse shows why: it's a category with arrows $i:0\to1$ and $r:1\to0$ where $i$ then $r$ is the identity of $0$ while $r$ then $i$ is an arrow $\varepsilon:1\to1$ different from the identity. Think of $i$ as including a small set into a bigger one and $r$ as squashing it back down, and send $f\mapsto i$ and $g\mapsto r$.`,
      hints: [
        String.raw`Look for a category where undoing works in one order only.`,
        String.raw`This can't be done. Build $i:0\to 1$, $r:1\to 0$ and $e:1\to 1$, with $i$ then $r=1_0$, $r$ then $i=e$, $e$ then $e=e$, $i$ then $e=i$, $e$ then $r=r$.`
      ],
      win: [String.raw`Impossible: $r$ then $i$ is $\varepsilon$, which isn't the identity.`],
      term: String.raw`Retraction`,
      math: {
        say: String.raw`A one-sided inverse need not be an equivalence: in the category with $r\circ i=1_0$ and $i\circ r=\varepsilon\ne1_1$, the nerve has $(i,r;1_0)$ and no $(r,i;1_1)$.`,
        proof: String.raw`Map $f\mapsto i$, $g\mapsto r$; the goal would force $i\circ r=1_1$.`
      }
    },
    /* 0. An idempotent from a one-sided inverse */
    idem: {
      title: String.raw`An idempotent from a one-sided inverse`,
      bullets: [
        String.raw`Given $\sigma_1=(f,g\,;\,1_a)$, as in the last level.`,
        String.raw`Construct $x$ from $g,f$ and prove $(x,x\,;\,x)$.`
      ],
      explain: String.raw`In the last counter-model, $r$ then $i$ was the arrow $\varepsilon$, and $\varepsilon$ then $\varepsilon$ was $\varepsilon$ again. That holds here in general. Compose $g,f$ to get $x:b\to b$ with $\sigma_2=(g,f\,;\,x)$. Doing $x$ twice means $g,f,g,f$, and the middle $f,g$ composes to $1_a$. First the tetrahedron on $g,f,g$, with $d_3=\sigma_2$, $d_0=\sigma_1$ and degenerate $d_2=s_1g=(g,1_a\,;\,g)$, gives $\sigma_3=(x,g\,;\,g)$. Then the tetrahedron on $x,g,f$ with $\sigma_3,\sigma_2,\sigma_2$ gives $(x,x\,;\,x)$, which is what it means for $x$ to be <b>idempotent</b>.`,
      hints: [
        String.raw`Cancel the middle $f,g$ first: show $(x,g\,;\,g)$.`,
        String.raw`Compose: $g$, $f$. Tetrahedron: path $g,f,g$; $d_3=\sigma_2$, $d_0=\sigma_1$, $d_2=s_1g$. Tetrahedron: path $x,g,f$; $d_3=\sigma_3$, $d_0=\sigma_2$, $d_1=\sigma_2$.`
      ],
      win: [String.raw`$\sigma_4=(x,x\,;\,x)$: a one-sided inverse produces an idempotent.`],
      term: String.raw`Idempotent`,
      math: {
        say: String.raw`If $(f,g;1_a)$ is a 2-simplex and $x$ is a composite of $(g,f)$, then there is a 2-simplex $(x,x;x)$: $x$ is idempotent, by two inner 3-horns.`,
        proof: String.raw`Fill $\Lambda^3_1$ on $(b,a,b,a)$ with $\sigma_2,\sigma_1,s_1g$ for $(x,g;g)$; fill $\Lambda^3_2$ on $(b,b,a,b)$ with $\sigma_3,\sigma_2,\sigma_2$ for $(x,x;x)$.`
      }
    },
    /* 0. Factoring through an inverse */
    detour: {
      title: String.raw`Factoring through an inverse`,
      bullets: [
        String.raw`Given $\sigma_1=(f,g\,;\,1_a)$, with $f$ marked $\cong$, and $h:a\to c$.`,
        String.raw`Prove $h$ is a composite of $f$ and some arrow.`
      ],
      explain: String.raw`You want to reach $c$ from $a$ by going through $b$ first. The detour: take $f$ to $b$, take $g$ back to $a$, then take $h$. So compose $g,h$ to get $x:b\to c$ with $\sigma_2=(g,h\,;\,x)$. The tetrahedron on the path $f,g,h$ has corners over $a,b,a,c$, faces $d_3=\sigma_1$, $d_0=\sigma_2$, and the degenerate face $d_1=s_0h=(1_a,h\,;\,h)$, which is there because $h$ is. The missing face is $d_2=(f,x\,;\,h)$, an inner horn. The mark $\cong$ on $f$ is never used, so this works with any left inverse.`,
      hints: [
        String.raw`First compose $g$ with $h$.`,
        String.raw`Compose: $g$, $h$. Tetrahedron: path $f,g,h$; $d_3=\sigma_1$, $d_0=\sigma_2$ ($d_1=s_0h$ is degenerate). Fill.`
      ],
      win: [String.raw`$\sigma_3=(f,x\,;\,h)$: $h$ factors through $f$.`],
      term: String.raw`Factoring through an inverse`,
      math: {
        say: String.raw`Given a 2-simplex $(f,g;1_a)$, any $h$ out of $a$ factors through $f$: with $x$ a composite of $(g,h)$ there is a 2-simplex $(f,x;h)$, by an inner horn $\Lambda^3_2$.`,
        proof: String.raw`Fill $\Lambda^2_1$ on $(g,h)$ giving $x$; fill $\Lambda^3_2$ on $(a,b,a,c)$ with $\sigma_1,\sigma_2,s_0h$.`
      }
    },
    /* 0. Cancelling an isomorphism */
    mono: {
      title: String.raw`Cancelling an isomorphism`,
      bullets: [
        String.raw`Given $g$ marked $\cong$, $\sigma_1=(f,g\,;\,x)$, $\sigma_2=(k,g\,;\,x')$, $\sigma_3:x\simeq m$, $\sigma_4:x'\simeq m$.`,
        String.raw`Prove $f\simeq k$.`
      ],
      explain: String.raw`This is Cancelling without an inverse, with two changes. The arrow $g$ is an isomorphism, so by Joyal's theorem the padlock on an outer face opens when the edge next to the missing corner is $g$. And the two triangles end at different long sides $x$ and $x'$, so first Swap in $\sigma_3$ and $\sigma_4$ to bring both to $m$: $\sigma_5=(f,g\,;\,m)$ and $\sigma_6=(k,g\,;\,m)$. The tetrahedron on $f,1_b,g$ then has $d_2=\sigma_5$, $d_1=\sigma_6$, degenerate $d_0=s_0g$, and missing $d_3$: the horn $\Lambda^3_3$ with last edge $g$.`,
      hints: [
        String.raw`Give both triangles the same long side, then cancel $g$.`,
        String.raw`Swap in: $\sigma_3$, $\sigma_1$. Swap in: $\sigma_4$, $\sigma_2$. Tetrahedron: path $f,1_b,g$; $d_1=\sigma_6$, $d_2=\sigma_5$. Fill.`
      ],
      win: [String.raw`$\sigma_7=(f,1_b\,;\,k)$: an isomorphism can be cancelled.`],
      term: String.raw`Isomorphisms cancel`,
      math: {
        say: String.raw`If $g$ is an equivalence in a quasi-category, the outer horn $\Lambda^3_3\to X$ whose last edge is $g$ fills. Hence $g\circ f\simeq g\circ k$ implies $f\simeq k$.`,
        proof: String.raw`Swap in to get $(f,g;m)$, $(k,g;m)$; fill $\Lambda^3_3$ on $(a,b,b,c)$ with $d_2=\sigma_5$, $d_1=\sigma_6$, $d_0=s_0g$; $d_3$ is $f\simeq k$.`
      }
    },
    /* 0. Left and right inverses agree */
    twosided: {
      title: String.raw`Left and right inverses agree`,
      bullets: [
        String.raw`Given $\sigma_1=(f,g\,;\,1_a)$, $\sigma_2=(k,f\,;\,1_b)$, $\sigma_3:g\simeq g'$, $\sigma_4:g'\simeq g''$.`,
        String.raw`Prove $(g'',f\,;\,1_b)$.`
      ],
      explain: String.raw`The arrow $g$ undoes $f$ from one side and $k$ from the other. One tetrahedron shows they agree: the path $k,f,g$ with corners over $b,a,b,a$, faces $d_3=\sigma_2$, $d_0=\sigma_1$ and degenerate $d_1=s_0g$, gives $\sigma_6=(k,1_a\,;\,g)$, so $k\simeq g$. The goal names $g''$, two homotopies further along, so Link $\sigma_6$ with $\sigma_3$ and then with $\sigma_4$ to reach $k\simeq g''$. Swap that into $\sigma_2$ and $k$ becomes $g''$. No outer horn was used, so this works in every quasi-category. The triangle $\sigma_5$ with $k'$ is a decoy.`,
      hints: [
        String.raw`Compare $k$ with $g$ first, then walk along the homotopies.`,
        String.raw`Tetrahedron: path $k,f,g$; $d_3=\sigma_2$, $d_0=\sigma_1$. Link: $\sigma_6$, $\sigma_3$. Link: $\sigma_7$, $\sigma_4$. Swap in: $\sigma_8$, $\sigma_2$.`
      ],
      win: [String.raw`$\sigma_9=(g'',f\,;\,1_b)$: $g''$ undoes $f$ from both sides.`],
      term: String.raw`Two-sided inverse`,
      math: {
        say: String.raw`A left inverse $g$ and a right inverse $k$ of $f$ are homotopic, so any arrow homotopic to $g$ is also a right inverse. Only inner horns are used: $f$ is an equivalence in any quasi-category.`,
        proof: String.raw`Fill $\Lambda^3_2$ on $(b,a,b,a)$ for $k\simeq g$; Link twice to $k\simeq g''$; Swap in $g''$ for $k$ in $\sigma_2$.`
      }
    },
    /* 0. Joyal's theorem */
    joyal: {
      title: String.raw`Joyal's theorem`,
      bullets: [
        String.raw`Given $f:a\to b$ marked $\cong$, and $h:a\to b$ without the mark.`,
        String.raw`Construct $x$ and $y$ with $(f,x\,;\,1_a)$, $(y,f\,;\,1_b)$; prove $(y,1_a\,;\,x)$ and $(x,f\,;\,1_b)$.`
      ],
      explain: String.raw`Both Solve tools fill outer horns, and in this world they work only along an arrow marked $\cong$. That is Joyal's theorem in dimension two, and if you try them on $h$ they refuse. On $f$: Solve $f\cdot ?\simeq h$ on $f,1_a$ gives $x$ with $\sigma_1$, and Solve $?\cdot g\simeq h$ on $f,1_b$ gives $y$ with $\sigma_2$. The tetrahedron on $y,f,x$ from Inverses on both sides, with $d_3=\sigma_2$, $d_0=\sigma_1$ and degenerate $d_1=s_0x$, gives $\sigma_3=(y,1_a\,;\,x)$. Swap $\sigma_3$ into $\sigma_2$ and $x$ undoes $f$ on both sides.`,
      hints: [
        String.raw`Solve on both sides of $f$, compare the answers, then substitute.`,
        String.raw`Solve $f\cdot ?\simeq h$: $f$, $1_a$. Solve $?\cdot g\simeq h$: $f$, $1_b$. Tetrahedron: path $y,f,x$; $d_3=\sigma_2$, $d_0=\sigma_1$. Swap in: $\sigma_3$, $\sigma_2$.`
      ],
      win: [
        String.raw`$\sigma_4=(x,f\,;\,1_b)$: outer horns along an isomorphism fill, and $x$ is a two-sided inverse.`
      ],
      term: String.raw`Joyal's theorem`,
      math: {
        say: String.raw`Joyal: in a quasi-category $X$, an edge $f$ is an isomorphism iff every $\Lambda^n_0\to X$ ($n\ge2$) with first edge $f$ extends to $\Delta^n$. Consequently $X$ is a Kan complex iff its homotopy category is a groupoid.`,
        proof: String.raw`Fill $\Lambda^2_0$ and $\Lambda^2_2$ along $f$ for inverses $x,y$; $\Lambda^3_2$ gives $y\simeq x$; transport by Swap in.`
      }
    },
    /* 0. A commuting square */
    natsq: {
      title: String.raw`A commuting square`,
      bullets: [
        String.raw`Given $\sigma_1=(f,\beta\,;\,d)$, $\sigma_2=(\alpha,f'\,;\,d')$ and $\sigma_3=(d,1_{b'}\,;\,d')$.`,
        String.raw`Construct triangles $(f,\beta\,;\,?)$ and $(\alpha,f'\,;\,?)$ with the same long side.`
      ],
      explain: String.raw`From $a$ to $b'$ there are two ways round: along $f$ then $\beta$, or along $\alpha$ then $f'$. A commuting square needs one diagonal that serves both. Right now the two ways round have different diagonals, $d$ in $\sigma_1$ and $d'$ in $\sigma_2$, related by the homotopy $\sigma_3:d\simeq d'$. Swap $\sigma_3$ into $\sigma_1$ and you get $\sigma_4=(f,\beta\,;\,d')$, which shares $d'$ with $\sigma_2$. The pair $\sigma_4,\sigma_2$ is a commuting square from $f$ to $f'$, which you can read as an arrow from $f$ to $f'$ with components $\alpha$ and $\beta$.`,
      hints: [String.raw`The two diagonals are homotopic.`, String.raw`Swap in: $\sigma_3$, $\sigma_1$.`],
      win: [String.raw`$\sigma_4$ and $\sigma_2$ share the diagonal $d'$: a commuting square from $f$ to $f'$.`],
      term: String.raw`Commuting square`,
      math: {
        say: String.raw`A square in $C$ is a map $\Delta^1\times\Delta^1\to C$: two 2-simplices $(f,\beta;d)$ and $(\alpha,f';d)$ sharing the diagonal $d$. It is an edge $f\to f'$ of $\mathrm{Fun}(\Delta^1,C)$.`,
        proof: String.raw`Transport $(f,\beta;d)$ along the homotopy $d\simeq d'$ to get $(f,\beta;d')$, which shares its diagonal with $\sigma_2$.`
      }
    },
    /* 0. Moving an isomorphism across */
    moveacross: {
      title: String.raw`Moving an isomorphism across`,
      bullets: [
        String.raw`Given $\sigma_1=(\bar\alpha,\alpha\,;\,1_{a'})$ and $\sigma_2=(\alpha,p\,;\,q)$.`,
        String.raw`Prove $(\bar\alpha,q\,;\,p)$.`
      ],
      explain: String.raw`In school algebra, $\alpha p=q$ becomes $p=\alpha^{-1}q$ by dividing by $\alpha$. Here the division is a tetrahedron. Take the path $\bar\alpha,\alpha,p$, with corners over $a',a,a',c$. Its first two arrows compose to the identity, recorded by $\sigma_1$ as face $d_3$. Its last two steps are $\sigma_2$, face $d_0$. Its face $d_1$ skips the middle corner and is the identity at $a'$ followed by $p$: the degenerate triangle $s_0p=(1_{a'},p\,;\,p)$. The missing face is $d_2=(\bar\alpha,q\,;\,p)$, an inner horn. The tool you earn, Divide, does this on either side.`,
      hints: [
        String.raw`Start the path by undoing $\alpha$.`,
        String.raw`Tetrahedron: path $\bar\alpha,\alpha,p$; $d_3=\sigma_1$, $d_0=\sigma_2$, $d_1=s_0p$. Fill.`
      ],
      win: [
        String.raw`$\sigma_4=(\bar\alpha,q\,;\,p)$: $\alpha$ moved to the other side. New tool: Divide, which cancels an isomorphism.`
      ],
      term: String.raw`Dividing by an isomorphism`,
      math: {
        say: String.raw`If $(\bar\alpha,\alpha;1_{a'})$ and $(\alpha,p;q)$ are 2-simplices, there is a 2-simplex $(\bar\alpha,q;p)$: left composition with an isomorphism is invertible up to homotopy.`,
        proof: String.raw`Fill $\Lambda^3_2$ on $(a',a,a',c)$ with $d_3=\sigma_1$, $d_0=\sigma_2$, $d_1=s_0p$; the new face $d_2$ is $(\bar\alpha,q;p)$.`
      }
    },
    /* 0. Dividing on the right */
    acrossagain: {
      title: String.raw`Dividing on the right`,
      bullets: [
        String.raw`Given $\sigma_1=(\beta,\bar\beta\,;\,1_b)$, $\sigma_3=(p,\beta\,;\,q)$ and $\sigma_4=(q',1_{b'}\,;\,q)$.`,
        String.raw`Prove $(q',\bar\beta\,;\,p)$.`
      ],
      explain: String.raw`Now $\beta$ sits at the end of $\sigma_3=(p,\beta\,;\,q)$. Divide with $\sigma_1$ moves it across to the right: $\sigma_5=(q,\bar\beta\,;\,p)$. The goal starts with $q'$ instead of $q$, and $\sigma_4$ says $q'\simeq q$. Swap in would want the homotopy pointing from $q$ to $q'$, so use a tetrahedron directly: the path $q',1_{b'},\bar\beta$ with $d_3=\sigma_4$, $d_1=\sigma_5$, and the degenerate $d_0=s_0\bar\beta=(1_{b'},\bar\beta\,;\,\bar\beta)$. The missing face is $d_2=(q',\bar\beta\,;\,p)$.`,
      hints: [
        String.raw`Divide first, then carry the result from $q$ to $q'$.`,
        String.raw`Divide: $\sigma_1$, $\sigma_3$. Tetrahedron: path $q',1_{b'},\bar\beta$; $d_3=\sigma_4$, $d_0=s_0\bar\beta$, $d_1=\sigma_5$. Fill.`
      ],
      win: [String.raw`$\sigma_6=(q',\bar\beta\,;\,p)$: division works on the right too.`],
      term: String.raw`Right division`,
      math: {
        say: String.raw`Given $(\beta,\bar\beta;1_b)$ and a 2-simplex $(p,\beta;q)$ there is a 2-simplex $(q,\bar\beta;p)$, and 2-simplices transport along homotopies of any edge.`,
        proof: String.raw`Divide gives $(q,\bar\beta;p)$; then $\Lambda^3_2$ on $(a,b',b',b)$ with $\sigma_4$, $s_0\bar\beta$, $\sigma_5$ transports along $q'\simeq q$.`
      }
    },
    /* 0. Pasting squares */
    sqpaste: {
      title: String.raw`Pasting squares`,
      bullets: [
        String.raw`Two commuting squares stacked: $f$ to $f'$ (by $\sigma_1,\sigma_2$) and $f'$ to $f''$ (by $\sigma_3,\sigma_4$). $A$ composes $\alpha,\alpha'$ and $B$ composes $\beta,\beta'$.`,
        String.raw`Prove the tall square with sides $A,B$ commutes.`
      ],
      explain: String.raw`Squares are arrows between arrows, so two of them should compose. The tall square goes from $f$ to $f''$ with sides $A$ and $B$, and it needs one diagonal shared by $(f,B\,;\,?)$ and $(A,f''\,;\,?)$. Compose $f,B$ for a diagonal $x$ ($\sigma_7$). Then walk $x$ across the picture with three tetrahedra. Path $f,\beta,\beta'$ with $\sigma_1,\sigma_6,\sigma_7$ gives $(d,\beta'\,;\,x)$. Path $\alpha,f',\beta'$ with $\sigma_2,\sigma_3$ and that gives $(\alpha,d'\,;\,x)$. Path $\alpha,\alpha',f''$ with $\sigma_5,\sigma_4$ and that gives $(A,f''\,;\,x)$.`,
      hints: [
        String.raw`Make the diagonal $x$ from $f$ and $B$, then move it left one tetrahedron at a time.`,
        String.raw`Compose: $f$, $B$. Tetrahedron: path $f,\beta,\beta'$; $d_3=\sigma_1$, $d_0=\sigma_6$, $d_2=\sigma_7$. Tetrahedron: path $\alpha,f',\beta'$; $d_3=\sigma_2$, $d_0=\sigma_3$, $d_1=\sigma_8$. Tetrahedron: path $\alpha,\alpha',f''$; $d_3=\sigma_5$, $d_0=\sigma_4$, $d_2=\sigma_9$.`
      ],
      win: [String.raw`$\sigma_7$ and $\sigma_{10}$ share $x$: the pasted square commutes.`],
      term: String.raw`Pasting squares`,
      math: {
        say: String.raw`$\mathrm{Fun}(\Delta^1,C)$ is a quasi-category when $C$ is: two composable squares have a composite. The prism $\Delta^1\times\Delta^2$ is a union of three 3-simplices, each filled by an inner horn.`,
        proof: String.raw`With $x$ a composite of $(f,B)$: fill $\Lambda^3_1$ on $(a,b,b',b'')$, $\Lambda^3_2$ on $(a,a',b',b'')$, $\Lambda^3_1$ on $(a,a',a'',b'')$; the last face is $(A,f'';x)$.`
      }
    },
    /* 0. A composite of isomorphisms */
    isocomp: {
      title: String.raw`A composite of isomorphisms`,
      bullets: [
        String.raw`Given $f,g$ with inverses $\bar f,\bar g$ ($\sigma_1,\dots,\sigma_4$) and $\sigma_5=(f,g\,;\,x)$.`,
        String.raw`Construct $y$ with $(x,y\,;\,1_a)$ and $(y,x\,;\,1_c)$.`
      ],
      explain: String.raw`As with socks and shoes, the inverse of $f$ then $g$ should be $\bar g$ then $\bar f$. Compose $\bar g,\bar f$ for $y$ ($\sigma_6$). For $(x,y\,;\,1_a)$: Divide $\sigma_3$ into $\sigma_5$ to move $g$ across, $\sigma_7=(x,\bar g\,;\,f)$; then the tetrahedron on $x,\bar g,\bar f$ with $\sigma_7,\sigma_6,\sigma_1$ gives it. For $(y,x\,;\,1_c)$: Divide $\sigma_2$ into $\sigma_6$, $\sigma_9=(y,f\,;\,\bar g)$; then the tetrahedron on $y,f,g$ with $\sigma_9,\sigma_5,\sigma_4$. The arrow $h:c\to a$ points the right way and isn't an inverse of anything.`,
      hints: [
        String.raw`The inverse composes $\bar g$ and $\bar f$. Each side is one Divide and one tetrahedron.`,
        String.raw`Compose: $\bar g$, $\bar f$. Divide: $\sigma_3$, $\sigma_5$. Tetrahedron: path $x,\bar g,\bar f$; $d_3=\sigma_7$, $d_0=\sigma_6$, $d_1=\sigma_1$. Divide: $\sigma_2$, $\sigma_6$. Tetrahedron: path $y,f,g$; $d_3=\sigma_9$, $d_0=\sigma_5$, $d_1=\sigma_4$.`
      ],
      win: [
        String.raw`$\sigma_8=(x,y\,;\,1_a)$ and $\sigma_{10}=(y,x\,;\,1_c)$: a composite of isomorphisms is an isomorphism.`
      ],
      term: String.raw`Isomorphisms compose`,
      math: {
        say: String.raw`For isomorphisms $f,g$ with inverses $\bar f,\bar g$, any composite $x$ of $(f,g)$ has a two-sided inverse, a composite $y$ of $(\bar g,\bar f)$.`,
        proof: String.raw`From $(f,g;x)$ get $(x,\bar g;f)$; fill $\Lambda^3_2$ on $(a,c,b,a)$ for $(x,y;1_a)$. From $(\bar g,\bar f;y)$ get $(y,f;\bar g)$; fill $\Lambda^3_2$ on $(c,a,b,c)$ for $(y,x;1_c)$.`
      }
    },
    /* 0. Inverting a square */
    natiso: {
      title: String.raw`Inverting a square`,
      bullets: [
        String.raw`A commuting square from $f$ to $f'$ with diagonal $d$ and sides $\alpha,\beta$, both isomorphisms with inverses $\bar\alpha,\bar\beta$.`,
        String.raw`Construct a commuting square from $f'$ back to $f$ with sides $\bar\alpha,\bar\beta$.`
      ],
      explain: String.raw`The return square needs a diagonal $x:a'\to b$ shared by $(\bar\alpha,f\,;\,x)$ and $(f',\bar\beta\,;\,x)$. Take the first way round as the definition: compose $\bar\alpha,f$ for $x$ ($\sigma_7$). Now show the second way round reaches $x$ too. Divide $\sigma_1$ into $\sigma_4=(\alpha,f'\,;\,d)$ to get $\sigma_8=(\bar\alpha,d\,;\,f')$. The tetrahedron on $\bar\alpha,f,\beta$, corners over $a',a,b,b'$, with $d_3=\sigma_7$, $d_0=\sigma_3$, $d_2=\sigma_8$, gives $\sigma_9=(x,\beta\,;\,f')$. Divide $\sigma_2$ into $\sigma_9$ and $\beta$ crosses over: $(f',\bar\beta\,;\,x)$.`,
      hints: [
        String.raw`Use $\bar\alpha$ then $f$ as the new diagonal. Divide, tetrahedron, Divide.`,
        String.raw`Compose: $\bar\alpha$, $f$. Divide: $\sigma_1$, $\sigma_4$. Tetrahedron: path $\bar\alpha,f,\beta$; $d_3=\sigma_7$, $d_0=\sigma_3$, $d_2=\sigma_8$. Divide: $\sigma_2$, $\sigma_9$.`
      ],
      win: [
        String.raw`$\sigma_7$ and $\sigma_{10}$ share $x$: the square with invertible sides has an inverse square.`
      ],
      term: String.raw`Natural isomorphism`,
      math: {
        say: String.raw`A natural transformation is an equivalence in $\mathrm{Fun}(K,C)$ iff each component is an equivalence in $C$. This level is the case $K=\Delta^1$: the return square is built from the inverses of the components.`,
        proof: String.raw`From $(\alpha,f';d)$ get $(\bar\alpha,d;f')$; fill $\Lambda^3_1$ on $(a',a,b,b')$ for $(x,\beta;f')$; dividing by $\beta$ gives $(f',\bar\beta;x)$.`
      }
    },
    /* 0. Bare hands */
    barehands: {
      title: String.raw`Bare hands`,
      bullets: [
        String.raw`Given $f\simeq f'$, $g\simeq g'$, and triangles $(f,g\,;\,x)$ and $(f',g'\,;\,x')$.`,
        String.raw`Prove $x\simeq x'$. Your only tool is Tetrahedron.`
      ],
      explain: String.raw`You already know this is true: homotopic arrows have homotopic composites. Earlier you'd have reached for Swap in and Same. They've been taken away, so you'll have to rebuild what those tools do from tetrahedra, and that means deciding for yourself which identity goes where in each one. Every tetrahedron you need has a repeated corner, and one of its faces is a degenerate triangle that you never have to construct. It's worth sketching the corners on paper before clicking anything.`,
      hints: [
        String.raw`Move one arrow at a time: first trade $f$ for $f'$, then $g$ for $g'$, then compare the two composites of $f',g'$.`,
        String.raw`Tetrahedron twice: path $f,1_b,g$ (faces $\sigma_1$, $s_0g$, $\sigma_3$), then path $f',g,1_c$ (faces: the new triangle, $\sigma_2$, $\sigma_4$).`
      ],
      win: [
        String.raw`Composition is well defined on homotopy classes, and you proved it without any of your theorem tools.`
      ],
      term: String.raw`Composition respects homotopy`,
      math: {
        say: String.raw`If $f\simeq f'$ and $g\simeq g'$ then any composite of $(f,g)$ is homotopic to any composite of $(f',g')$. This is what makes composition in the homotopy category $\mathrm{h}\mathcal{C}$ well defined.`,
        proof: String.raw`Fill $\Lambda^3_1$ on $(a,b,b,c)$ to get $(f',g\,;\,x)$, then $\Lambda^3_1$ on $(a,b,c,c)$ with faces $(f',g\,;\,x)$, $(g,1_c\,;\,g')$, $(f',g'\,;\,x')$; the new face is $(x,1_c\,;\,x')$.`
      }
    },
    /* 0. Cancel on the left */
    leftcancel: {
      title: String.raw`Cancel on the left`,
      bullets: [
        String.raw`$f$ is an isomorphism with inverse $\bar f$, and $x$ is a composite of $f$ with $g$ and also of $f$ with $g'$.`,
        String.raw`Prove $g\simeq g'$ using only Tetrahedron and Same.`
      ],
      explain: String.raw`In a group you'd multiply both sides of $fg=fg'$ by $f^{-1}$ and be done. The same idea works here, but there's no multiplying: you have to find the tetrahedron that does it. Think about which three arrows, walked one after another, would let $\bar f$ meet $f$ so that the two of them collapse to an identity, and then ask what the remaining faces say. You'll want to do that once for $g$ and once for $g'$, and then notice that you've made two composites of the same pair.`,
      hints: [
        String.raw`Walk $\bar f$, then $f$, then $g$. Two of the four faces are already yours and a third is degenerate.`,
        String.raw`Tetrahedron: path $\bar f,f,g$ (faces $\sigma_2$, $\sigma_3$, $s_0g$). Tetrahedron: path $\bar f,f,g'$ (faces $\sigma_2$, $\sigma_4$, $s_0g'$). Same on the two new triangles.`
      ],
      win: [String.raw`An isomorphism can be cancelled from the left, up to homotopy.`],
      term: String.raw`Isomorphisms are monic`,
      math: {
        say: String.raw`If $f$ is an isomorphism and $x$ is a composite of both $(f,g)$ and $(f,g')$, then $g\simeq g'$: composition with an isomorphism is injective on homotopy classes.`,
        proof: String.raw`Two fillers of $\Lambda^3_2$ on $(b,a,b,c)$ give $(\bar f,x\,;\,g)$ and $(\bar f,x\,;\,g')$; composites of one pair are homotopic.`
      }
    },
    /* 0. Two ways back */
    tworetractions: {
      title: String.raw`Two ways back`,
      bullets: [
        String.raw`$g$ and $h$ both satisfy $(f,g\,;\,1_a)$ and $(f,h\,;\,1_a)$: each undoes $f$ on the same side.`,
        String.raw`Prove $g\simeq h$, or build a category where it fails.`
      ],
      explain: String.raw`Earlier you showed that a left inverse and a right inverse of the same arrow must agree up to homotopy. Here both arrows undo $f$ on the same side, which isn't quite the same situation. Before you start building tetrahedra, it's worth asking what you'd expect in ordinary mathematics: think of a function $f$ that embeds a small set into a bigger one, and of the different ways of mapping the bigger set back.`,
      hints: [
        String.raw`Try to imagine an ordinary category where an arrow has two different retractions. If one exists, no proof can.`,
        String.raw`This can't be done. Take the last level's category and double it: $i:0\to 1$, two arrows $r,r':1\to 0$ and two loops $e,e'$ on $1$, with $i$ then $r$ and $i$ then $r'$ both $1_0$; associativity then decides every other entry.`
      ],
      win: [
        String.raw`Retractions aren't unique: an arrow can be undone on one side in genuinely different ways.`
      ],
      term: String.raw`Retractions are not unique`,
      math: {
        say: String.raw`A morphism may have several retractions that are not homotopic. Uniqueness of inverses up to homotopy needs a two-sided inverse, or at least one inverse on each side.`,
        proof: String.raw`Counter-model: the category generated by $i:0\to 1$ and $r,r':1\to 0$ with $r\circ i=r'\circ i=1_0$, in which $r\neq r'$.`
      }
    },
    /* 0. Two out of three */
    twoofthree: {
      title: String.raw`Two out of three`,
      bullets: [
        String.raw`$f$ is an isomorphism, and so is $x$, a composite of $f$ then $g$.`,
        String.raw`Construct a two-sided inverse of $g$, or build a category where it fails.`
      ],
      explain: String.raw`Three arrows sit around a triangle, and two of them can be undone. The question is whether the third one has to be undoable as well. If you think it does, you'll need a candidate for the inverse before you can prove anything about it, and the only raw material is $\bar f$, $\bar x$ and the arrows you can compose from them. Checking the candidate on one side is fairly direct. The other side takes longer, because the fact you need about your candidate has to be assembled from a fact about a different arrow.`,
      hints: [
        String.raw`Going from $c$ back to $b$ means going back along $x$ and then forward along $f$. For the hard side, first work out what $g$ followed by $\bar x$ is.`,
        String.raw`Compose $\bar x,f$ (call it $y$). Tetrahedron, four times: paths $\bar f,f,g$; then $\bar f,x,\bar x$; then $g,\bar x,f$; then $\bar x,f,g$.`
      ],
      win: [String.raw`If two of $f$, $g$ and a composite of them are isomorphisms, so is the third.`],
      term: String.raw`Two-out-of-three`,
      math: {
        say: String.raw`Isomorphisms in a quasi-category satisfy two-out-of-three: given a 2-simplex $(f,g\,;\,x)$, if any two of $f$, $g$, $x$ are isomorphisms then so is the third.`,
        proof: String.raw`Let $y$ be a composite of $(\bar x,f)$. $\Lambda^3_2$ on $(b,a,b,c)$ gives $(\bar f,x\,;\,g)$; $\Lambda^3_1$ on $(b,a,c,a)$ gives $(g,\bar x\,;\,\bar f)$; two more inner 3-horns give $(g,y\,;\,1_b)$ and $(y,g\,;\,1_c)$.`
      }
    },
    /* 0. Sandbox */
    sandbox: {
      title: String.raw`Sandbox`,
      bullets: [
        String.raw`Every tool is unlocked and every horn fills.`,
        String.raw`There is no goal. Undo is always available.`
      ],
      explain: String.raw`This board has four vertices and five arrows, and every tool you have earned: Compose, both Solve tools, Tetrahedron, Same, Flip, Link, Swap in, Divide, Add vertex, Draw arrow, Glue triangle and Peel. Every horn fills here, outer ones included. Some things to try: build an inverse and check it's two-sided, compose $f,g,h$ in both bracketings and compare, or glue two triangles on one loop and see what Compose then does with it. The degenerate triangles $s_0f$ and $s_1f$ are in the panel on the right whenever a tetrahedron needs one.`,
      hints: [
        String.raw`Compose two arrows that meet.`,
        String.raw`Compose $f$, $g$, then put a tetrahedron on $f,g,h$.`
      ],
      win: [],
      term: String.raw`Simplicial set`,
      math: {
        say: String.raw`A simplicial set is a functor $\Delta^{op}\to\mathrm{Set}$. Here you build finite ones by hand: add vertices, edges and 2-cells, fill horns, and take skeleta.`,
        proof: String.raw``
      }
    }
  },

  /* ==== why an impossible goal cannot be done ============================= */

  reasons: {
    freshend: {
      label: String.raw`A lift along a left fibration has a chosen start, never a chosen end.`,
      whyNot: String.raw`No lift is involved in that goal: nothing here needs to land on a given vertex.`
    },
    licence: {
      label: String.raw`This map lifts inner horns only; an inverse is an outer horn.`,
      whyNot: String.raw`This map does lift the horn you need.`
    },
    hole: {
      label: String.raw`Horn filling never fills a hole.`,
      whyNot: String.raw`Nothing is hollow here: a horn really is missing one side.`
    },
    backwards: {
      label: String.raw`Inner moves never make an arrow point backwards.`,
      whyNot: String.raw`Direction isn't the problem here.`
    },
    unrelated: {
      label: String.raw`Nothing links arrows that share no triangle.`,
      whyNot: String.raw`These arrows already share a triangle.`
    },
    nocancel: {
      label: String.raw`You can't cancel an arrow that has no inverse.`,
      whyNot: String.raw`No cancelling is needed here.`
    },
    onesided: {
      label: String.raw`A one-sided inverse isn't an isomorphism.`,
      whyNot: String.raw`Both sides are already covered here.`
    },
    shadow: {
      label: String.raw`The base $S$ already decides the answer, and it's the wrong one.`,
      whyNot: String.raw`The base allows this, so a lift exists.`
    }
  },

  /* ==== the notes ========================================================= */

  notes: [
    {
      id: String.raw`simplicial`,
      before: String.raw`faces`,
      title: String.raw`Vertices, arrows, triangles`,
      body: [
        {
          p: String.raw`A <b>simplicial set</b> is a shape built from pieces of a few standard kinds: vertices, arrows between vertices, filled triangles, tetrahedra (3-simplices), and higher versions you'll not need. Pieces are glued along their sides, and every arrow has a direction.`
        },
        {
          diagram: {
            caption: String.raw`One simplicial set: a filled triangle, a tetrahedron, a hollow loop and a stray arrow.`,
            glow: {
              pts: [String.raw`y3`, String.raw`y4`, String.raw`y5`],
              cx: 72,
              cy: 38,
              r: 27,
              op: 0.26
            },
            dots: [
              { id: String.raw`y0`, label: String.raw`0`, x: 4, y: 30 },
              { id: String.raw`y1`, label: String.raw`1`, x: 26, y: 2 },
              { id: String.raw`y2`, label: String.raw`2`, x: 48, y: 30 },
              { id: String.raw`y3`, label: String.raw`3`, x: 72, y: 16 },
              { id: String.raw`y4`, label: String.raw`4`, x: 52, y: 56 },
              { id: String.raw`y5`, label: String.raw`5`, x: 92, y: 56 },
              { id: String.raw`y6`, label: String.raw`6`, x: 72, y: 43 },
              { id: String.raw`y7`, label: String.raw`7`, x: 26, y: 50 },
              { id: String.raw`y8`, label: String.raw`8`, x: 100, y: 6 },
              { id: String.raw`y9`, label: String.raw`9`, x: 108, y: 20 }
            ],
            arrows: [
              { from: String.raw`y0`, to: String.raw`y1` },
              { from: String.raw`y1`, to: String.raw`y2` },
              { from: String.raw`y0`, to: String.raw`y2` },
              { from: String.raw`y2`, to: String.raw`y3` },
              { from: String.raw`y1`, to: String.raw`y3` },
              { from: String.raw`y0`, to: String.raw`y7` },
              { from: String.raw`y7`, to: String.raw`y2` },
              { from: String.raw`y4`, to: String.raw`y5` },
              { from: String.raw`y3`, to: String.raw`y4` },
              { from: String.raw`y3`, to: String.raw`y5` },
              { from: String.raw`y6`, to: String.raw`y4` },
              { from: String.raw`y6`, to: String.raw`y5` },
              { from: String.raw`y6`, to: String.raw`y3` },
              { from: String.raw`y8`, to: String.raw`y9` }
            ],
            fills: [
              [String.raw`y0`, String.raw`y1`, String.raw`y2`],
              {
                pts: [String.raw`y3`, String.raw`y4`, String.raw`y5`],
                grad: {
                  a: 0.02,
                  b: 0.08,
                  x1: 0,
                  y1: 0,
                  x2: 1,
                  y2: 0.6
                }
              },
              {
                pts: [String.raw`y3`, String.raw`y4`, String.raw`y6`],
                grad: {
                  a: 0.05,
                  b: 0.2,
                  x1: 0,
                  y1: 0,
                  x2: 0.8,
                  y2: 1
                }
              },
              {
                pts: [String.raw`y3`, String.raw`y5`, String.raw`y6`],
                grad: {
                  a: 0.1,
                  b: 0.42,
                  x1: 1,
                  y1: 0,
                  x2: 0,
                  y2: 1
                }
              },
              {
                pts: [String.raw`y4`, String.raw`y5`, String.raw`y6`],
                grad: {
                  a: 0.16,
                  b: 0.62,
                  x1: 0,
                  y1: 0,
                  x2: 0,
                  y2: 1
                }
              }
            ]
          }
        },
        {
          p: String.raw`Look at the corners $0,7,2$: there are three arrows going round, but nobody filled in the middle, so they are just three arrows, because a triangle counts only if it's actually there as a piece.`
        },
        {
          p: String.raw`Each triangle has corners numbered $0,1,2$, and its three sides are arrows that run from the lower number to the higher one. The side from $0$ to $1$ is called $d_2$, the side from $1$ to $2$ is $d_0$, and the long side from $0$ to $2$ is $d_1$. The rule behind the names: $d_i$ is the side that skips corner $i$.`
        },
        {
          diagram: {
            dots: [
              { id: String.raw`a`, label: String.raw`0`, x: 15, y: 44 },
              { id: String.raw`b`, label: String.raw`1`, x: 50, y: 10 },
              { id: String.raw`c`, label: String.raw`2`, x: 85, y: 44 }
            ],
            arrows: [
              { from: String.raw`a`, to: String.raw`b`, label: String.raw`d₂` },
              { from: String.raw`b`, to: String.raw`c`, label: String.raw`d₀` },
              { from: String.raw`a`, to: String.raw`c`, label: String.raw`d₁` }
            ],
            fills: [[String.raw`a`, String.raw`b`, String.raw`c`]]
          }
        },
        {
          p: String.raw`The game writes a triangle as $(d_2,\,d_0\,;\,d_1)$: first leg, second leg, semicolon, long side. So $(f,g\,;\,x)$ is the triangle you get by walking $f$, then $g$, with $x$ as the shortcut.`
        },
        { demo: String.raw`tetra-3d` },
        {
          p: String.raw`A tetrahedron works the same way with one more corner. It has corners $0,1,2,3$ and four triangular faces $d_0,\dots,d_3$, and $d_i$ is again the face that skips corner $i$. Tap a face in the picture above to see its name.`
        }
      ]
    },
    {
      id: String.raw`degenerate`,
      before: String.raw`freebies`,
      title: String.raw`Identities and degenerate simplices`,
      body: [
        {
          p: String.raw`Every vertex $a$ comes with an arrow $1_a:a\to a$ that goes nowhere. You can think of it as the vertex itself, stretched into an arrow of length zero. The board draws it as a faint loop, and any tool that asks for an arrow accepts a tap on a vertex as meaning its identity.`
        },
        {
          p: String.raw`One dimension up the same trick gives triangles. An arrow $f:a\to b$ has two flat triangles: $s_0f=(1_a,f\,;\,f)$, the identity at $a$ followed by $f$, and $s_1f=(f,1_b\,;\,f)$, $f$ followed by the identity at $b$. The $s_0$ repeats the first corner of $f$, and $s_1$ repeats the last.`
        },
        {
          diagram: {
            caption: String.raw`The two degenerate triangles on $f$: $s_0f$ repeats $a$, $s_1f$ repeats $b$.`,
            dots: [
              { id: String.raw`a`, label: String.raw`0 = a`, x: 10, y: 44 },
              { id: String.raw`b`, label: String.raw`1 = a`, x: 30, y: 10 },
              { id: String.raw`c`, label: String.raw`2 = b`, x: 50, y: 44 },
              { id: String.raw`d`, label: String.raw`0 = a`, x: 60, y: 44 },
              { id: String.raw`e`, label: String.raw`1 = b`, x: 80, y: 10 },
              { id: String.raw`f`, label: String.raw`2 = b`, x: 98, y: 44 }
            ],
            arrows: [
              {
                from: String.raw`a`,
                to: String.raw`b`,
                label: String.raw`1_a`,
                kind: String.raw`identity`
              },
              { from: String.raw`b`, to: String.raw`c`, label: String.raw`f` },
              { from: String.raw`a`, to: String.raw`c`, label: String.raw`f` },
              { from: String.raw`d`, to: String.raw`e`, label: String.raw`f` },
              {
                from: String.raw`e`,
                to: String.raw`f`,
                label: String.raw`1_b`,
                kind: String.raw`identity`
              },
              { from: String.raw`d`, to: String.raw`f`, label: String.raw`f` }
            ],
            fills: [[String.raw`a`, String.raw`b`, String.raw`c`], [String.raw`d`, String.raw`e`, String.raw`f`]]
          }
        },
        {
          p: String.raw`These are called <b>degenerate</b>, and they are genuine triangles that just happen to have two corners on the same vertex, so on the board they are squashed into a line. They exist in every simplicial set without anyone building them, which is why the panel on the right lists them in their own section, <b>Degenerate triangles</b>.`
        },
        { h: String.raw`Unfolding a flat triangle` },
        {
          p: String.raw`A squashed triangle is hard to look at, so the board can draw the repeated vertex twice. Press the <b>unfold</b> toggle (key U) and each vertex that a triangle uses twice is drawn as two copies, $b$ and $b'$, joined by the identity arrow. Nothing changes in the list of triangles; it's only a way of drawing.`
        },
        {
          diagram: {
            caption: String.raw`A triangle $(f,1_b\,;\,g)$ with its corner $b$ drawn twice.`,
            dots: [
              { id: String.raw`a`, label: String.raw`a`, x: 10, y: 44 },
              { id: String.raw`b`, label: String.raw`b`, x: 50, y: 10 },
              { id: String.raw`c`, label: String.raw`b′`, x: 88, y: 44 }
            ],
            arrows: [
              { from: String.raw`a`, to: String.raw`b`, label: String.raw`f` },
              {
                from: String.raw`b`,
                to: String.raw`c`,
                label: String.raw`1_b`,
                kind: String.raw`identity`
              },
              { from: String.raw`a`, to: String.raw`c`, label: String.raw`g` }
            ],
            fills: [[String.raw`a`, String.raw`b`, String.raw`c`]]
          }
        },
        {
          p: String.raw`Tetrahedra can have repeated corners too, say over $a,b,b,c$, and then some of their faces are degenerate triangles, which the level <i>Repeated corners</i> asks you to spot.`
        }
      ]
    },
    {
      id: String.raw`horns`,
      before: String.raw`compose`,
      title: String.raw`Horns, fillers and composites`,
      body: [
        {
          p: String.raw`Take a simplex, remove its inside, and remove one of its faces as well. What is left is a <b>horn</b>, written $\Lambda^n_k$: $n$ is the dimension, and $k$ is the corner opposite the missing face, so the missing face is $d_k$. A triangle with its long side gone is $\Lambda^2_1$.`
        },
        {
          diagram: {
            dots: [
              { id: String.raw`a`, label: String.raw`0`, x: 12, y: 42 },
              { id: String.raw`b`, label: String.raw`1`, x: 50, y: 12 },
              { id: String.raw`c`, label: String.raw`2`, x: 88, y: 42 }
            ],
            arrows: [
              { from: String.raw`a`, to: String.raw`b`, label: String.raw`d₂` },
              { from: String.raw`b`, to: String.raw`c`, label: String.raw`d₀` },
              { from: String.raw`a`, to: String.raw`c`, label: String.raw`d₁ missing`, dashed: true }
            ]
          }
        },
        {
          p: String.raw`The other two triangle horns: $\Lambda^2_0$ is two arrows leaving corner $0$, missing the side between their ends, and $\Lambda^2_2$ is two arrows arriving at corner $2$. A horn is <b>inner</b> if the missing face is in the middle, $0<k<n$, and <b>outer</b> if $k=0$ or $k=n$.`
        },
        {
          p: String.raw`To <b>fill</b> a horn in a simplicial set $X$ means to find a simplex of $X$ that has the horn's faces as its faces. Formally, a horn in $X$ is a map $\Lambda^n_k\to X$ and a filler extends it to $\Delta^n\to X$. Try it:`
        },
        { demo: String.raw`horn-fill` },
        {
          p: String.raw`For arrows $f:a\to b$ and $g:b\to c$, a filler of their horn $\Lambda^2_1$ is a triangle $(f,g\,;\,x)$. The game calls $x$ a <b>composite</b> of $f$ and $g$, and the triangle is the evidence. The tool Compose fills $\Lambda^2_1$ by drawing a new arrow and the triangle on it.`
        },
        {
          p: String.raw`Fillers need not exist, though: if a simplicial set has $f,g$ end to end and no triangle on them, that horn simply stays open, and much of the game is about working out which horns can be filled in which simplicial sets.`
        }
      ]
    },
    {
      id: String.raw`quasicat`,
      before: String.raw`chain`,
      title: String.raw`Quasi-categories`,
      body: [
        {
          p: String.raw`A <b>quasi-category</b>, also called an <b>$\infty$-category</b>, is a simplicial set in which every inner horn has a filler: $\Lambda^n_k\to X$ extends to $\Delta^n\to X$ whenever $0<k<n$. For $n=2$ that says every two arrows that meet have a composite. For $n=3$ it says three faces of a tetrahedron with the middle face $d_1$ or $d_2$ missing can always be completed.`
        },
        {
          p: String.raw`The worlds Composition, Tetrahedra and Homotopy take place in a quasi-category, so Compose and Tetrahedron always work there. Two small simplicial sets that aren't quasi-categories:`
        },
        {
          diagram: {
            dots: [
              { id: String.raw`a`, label: String.raw`a`, x: 12, y: 42 },
              { id: String.raw`b`, label: String.raw`b`, x: 30, y: 15 },
              { id: String.raw`c`, label: String.raw`c`, x: 48, y: 42 },
              { id: String.raw`d`, label: String.raw`a`, x: 60, y: 42 },
              { id: String.raw`e`, label: String.raw`b`, x: 78, y: 15 },
              { id: String.raw`f`, label: String.raw`c`, x: 96, y: 42 }
            ],
            arrows: [
              { from: String.raw`a`, to: String.raw`b`, label: String.raw`f` },
              { from: String.raw`b`, to: String.raw`c`, label: String.raw`g` },
              { from: String.raw`d`, to: String.raw`e`, label: String.raw`f` },
              { from: String.raw`e`, to: String.raw`f`, label: String.raw`g` },
              { from: String.raw`d`, to: String.raw`f`, label: String.raw`h` }
            ]
          }
        },
        {
          p: String.raw`On the left, the horn $\Lambda^2_1$ itself: $f$ and $g$ meet and have no triangle. On the right, a hollow triangle: the arrow $h$ is there, but there's still no triangle, so the horn on $f,g$ is still unfilled.`
        },
        {
          p: String.raw`If you know ordinary categories: there every pair has exactly one composite. A quasi-category asks only that some composite exists, which leaves room for several.`
        }
      ]
    },
    {
      id: String.raw`triangle`,
      before: String.raw`twoways`,
      title: String.raw`What a triangle witnesses`,
      body: [
        {
          p: String.raw`A triangle $(f,g\,;\,x)$ is a witness: it says that $x$ is a composite of $f$ then $g$. It says <i>a</i> composite. Another triangle $(f,g\,;\,y)$ may certify a different arrow $y$, and then both are composites with equal rights.`
        },
        {
          diagram: {
            dots: [
              { id: String.raw`a`, label: String.raw`a`, x: 15, y: 42 },
              { id: String.raw`b`, label: String.raw`b`, x: 50, y: 12 },
              { id: String.raw`c`, label: String.raw`c`, x: 85, y: 42 }
            ],
            arrows: [
              { from: String.raw`a`, to: String.raw`b`, label: String.raw`f` },
              { from: String.raw`b`, to: String.raw`c`, label: String.raw`g` },
              { from: String.raw`a`, to: String.raw`c`, label: String.raw`x`, bend: 0.12 },
              { from: String.raw`a`, to: String.raw`c`, label: String.raw`y`, bend: -0.12 }
            ],
            fills: [[String.raw`a`, String.raw`b`, String.raw`c`]]
          }
        },
        {
          p: String.raw`Paths in a space are a good picture to keep in mind. Walk along $f$, then along $g$: that is one path from $a$ to $c$. Shift it slightly and you have another path that is just as good a composite, with no reason to prefer either. So in a space there's never one composite of two paths, only many equally good ones.`
        },
        {
          p: String.raw`So composition here is a relation, $x$ is a composite of $f$ and $g$, and each triangle is one instance of it. In the Tetrahedra world you'll compare two composites of the same pair and find a triangle between them.`
        }
      ]
    },
    {
      id: String.raw`simplices`,
      before: String.raw`tetra`,
      title: String.raw`Tetrahedra and their horns`,
      body: [
        {
          p: String.raw`The <b>$n$-simplex</b> $\Delta^n$ has corners $0<1<\dots<n$, an arrow $i\to j$ for every $i<j$, and everything filled. So $\Delta^0$ is a vertex, $\Delta^1$ an arrow, $\Delta^2$ a filled triangle and $\Delta^3$ a tetrahedron. A simplex of a simplicial set $X$ is a map $\Delta^n\to X$.`
        },
        { demo: String.raw`tetra-3d` },
        {
          p: String.raw`A tetrahedron on a path $f,g,h$ from $a$ to $d$ has six edges: the path, the two-step composites $02$ and $13$, and the long edge $03$. Its four faces are $d_3$ (corners $0,1,2$), $d_0$ (corners $1,2,3$), $d_1$ (corners $0,2,3$) and $d_2$ (corners $0,1,3$). Three faces with $d_1$ missing form $\Lambda^3_1$; with $d_2$ missing, $\Lambda^3_2$. Both are inner. The Tetrahedron tool fills them: give it three faces and it returns the fourth.`
        },
        { demo: String.raw`order-maps` },
        {
          p: String.raw`Maps between the shapes act on simplices. The inclusion $[1]\to[2]$ that skips corner $i$ sends a triangle to its face $d_i$. A map $[2]\to[1]$ that sends two corners to one turns an arrow into a degenerate triangle. Here $[n]=\{0<\dots<n\}$. That is why a tetrahedron may sit with two corners on one vertex: it's a map from $\Delta^3$ that happens to send two corners to the same place, and then some of its faces are degenerate triangles.`
        }
      ]
    },
    {
      id: String.raw`diagrams`,
      before: String.raw`assoc`,
      aside: true,
      title: String.raw`Commutative diagrams`,
      body: [
        {
          p: String.raw`In an ordinary category, a square of arrows <b>commutes</b> if the two ways round give the same arrow: $f$ then $\beta$ equals $\alpha$ then $f'$. Pictures like this are how category theorists write equations, and a whole page of algebra can be one square.`
        },
        {
          diagram: {
            caption: String.raw`A commuting square: $\beta\circ f=f'\circ\alpha$ in an ordinary category.`,
            dots: [
              { id: String.raw`a`, label: String.raw`a`, x: 25, y: 10 },
              { id: String.raw`b`, label: String.raw`b`, x: 75, y: 10 },
              { id: String.raw`c`, label: String.raw`a′`, x: 25, y: 50 },
              { id: String.raw`d`, label: String.raw`b′`, x: 75, y: 50 }
            ],
            arrows: [
              { from: String.raw`a`, to: String.raw`b`, label: String.raw`f` },
              { from: String.raw`a`, to: String.raw`c`, label: String.raw`α` },
              { from: String.raw`b`, to: String.raw`d`, label: String.raw`β` },
              { from: String.raw`c`, to: String.raw`d`, label: String.raw`f′` }
            ]
          }
        },
        {
          p: String.raw`In a quasi-category there's no equals sign to put between arrows, because a pair of arrows has many composites, so commuting has to come with a witness. A commuting triangle is just a triangle $(f,g\,;\,x)$ on the board. A commuting square is two triangles, $(f,\beta\,;\,d)$ and $(\alpha,f'\,;\,d)$, sharing their long side $d$, so that both ways round have the same composite.`
        },
        {
          diagram: {
            caption: String.raw`The same square in a quasi-category: two triangles glued along the diagonal $d$.`,
            dots: [
              { id: String.raw`a`, label: String.raw`a`, x: 25, y: 10 },
              { id: String.raw`b`, label: String.raw`b`, x: 75, y: 10 },
              { id: String.raw`c`, label: String.raw`a′`, x: 25, y: 50 },
              { id: String.raw`d`, label: String.raw`b′`, x: 75, y: 50 }
            ],
            arrows: [
              { from: String.raw`a`, to: String.raw`b`, label: String.raw`f` },
              { from: String.raw`a`, to: String.raw`c`, label: String.raw`α` },
              { from: String.raw`b`, to: String.raw`d`, label: String.raw`β` },
              { from: String.raw`c`, to: String.raw`d`, label: String.raw`f′` },
              { from: String.raw`a`, to: String.raw`d`, label: String.raw`d` }
            ],
            fills: [[String.raw`a`, String.raw`b`, String.raw`d`], [String.raw`a`, String.raw`c`, String.raw`d`]]
          }
        },
        {
          p: String.raw`A tetrahedron is a commuting diagram one dimension up: four triangles that fit together, so that every way through it agrees with every other, and the 3-simplex records how. The next level uses one to compare the two bracketings of $f,g,h$, and the Natural transformations world at the end of the game is built entirely on squares like the one above.`
        }
      ]
    },
    {
      id: String.raw`homotopy`,
      before: String.raw`unique`,
      title: String.raw`Homotopy: deforming one path into another`,
      body: [
        {
          p: String.raw`Picture a space, say a sheet of rubber, with two points $a$ and $b$ on it. A <b>path</b> from $a$ to $b$ is a way of walking from one to the other, written as a continuous map $\gamma:[0,1]\to X$ with $\gamma(0)=a$ and $\gamma(1)=b$. Here are two of them, $x$ and $y$.`
        },
        {
          diagram: {
            caption: String.raw`Two paths from $a$ to $b$, and some of the paths in between.`,
            dots: [
              { id: String.raw`a`, label: String.raw`a`, x: 10, y: 30 },
              { id: String.raw`b`, label: String.raw`b`, x: 90, y: 30 }
            ],
            arrows: [
              { from: String.raw`a`, to: String.raw`b`, label: String.raw`x`, bend: 0.32 },
              {
                from: String.raw`a`,
                to: String.raw`b`,
                label: String.raw``,
                bend: 0.16,
                kind: String.raw`identity`
              },
              {
                from: String.raw`a`,
                to: String.raw`b`,
                label: String.raw``,
                bend: 0,
                kind: String.raw`identity`
              },
              {
                from: String.raw`a`,
                to: String.raw`b`,
                label: String.raw``,
                bend: -0.16,
                kind: String.raw`identity`
              },
              { from: String.raw`a`, to: String.raw`b`, label: String.raw`y`, bend: -0.32 }
            ]
          }
        },
        {
          p: String.raw`Now deform it: start with $x$, nudge it a little toward $y$, then a little more, keeping both ends pinned at $a$ and $b$, until it lies exactly on $y$. The dashed curves are snapshots along the way. If you can do that without tearing the path or jumping over a hole, $x$ and $y$ are <b>homotopic</b>. Formally, a homotopy is a continuous $H:[0,1]\times[0,1]\to X$ with $H(s,0)=x(s)$, $H(s,1)=y(s)$, $H(0,t)=a$ and $H(1,t)=b$. The snapshot at time $t$ is the path $s\mapsto H(s,t)$.`
        },
        {
          p: String.raw`The domain of $H$ is a square. Its bottom edge traces $x$, its top edge traces $y$, and its left and right edges are sent to the single points $a$ and $b$. Since the whole left edge goes to $a$, you lose nothing by pinching that edge to one corner. A square with one edge pinched to a point is a triangle.`
        },
        {
          diagram: {
            caption: String.raw`The sweep drawn as a triangle: corner $0$ at $a$, legs $x$ and the constant path at $b$, long side $y$.`,
            dots: [
              { id: String.raw`a`, label: String.raw`a`, x: 12, y: 44 },
              { id: String.raw`b`, label: String.raw`b`, x: 58, y: 10 },
              { id: String.raw`c`, label: String.raw`b`, x: 88, y: 44 }
            ],
            arrows: [
              { from: String.raw`a`, to: String.raw`b`, label: String.raw`x` },
              {
                from: String.raw`b`,
                to: String.raw`c`,
                label: String.raw`1_b`,
                kind: String.raw`identity`
              },
              { from: String.raw`a`, to: String.raw`c`, label: String.raw`y` }
            ],
            fills: [[String.raw`a`, String.raw`b`, String.raw`c`]]
          }
        },
        {
          p: String.raw`If you read off the triangle's sides, the one from corner $0$ to corner $1$ is the bottom edge of the square, which is the path $x$, the one from $0$ to $2$ is the top edge, which is $y$, and the one from $1$ to $2$ is the right edge of the square, where the homotopy stays at $b$ the whole time: the constant path at $b$, which is the identity $1_b$. So a homotopy with fixed ends is exactly a triangle $(x,1_b\,;\,y)$. On the board the two corners over $b$ coincide and the triangle looks flat. Drag the copy apart here to see the sheet in between.`
        },
        { demo: String.raw`split-vertex` },
        {
          p: String.raw`That picture becomes the definition for any simplicial set. Parallel arrows $x,y:a\to b$ are <b>homotopic</b>, written $x\simeq y$, if there's a triangle $(x,1_b\,;\,y)$. Such a triangle is a homotopy from $x$ to $y$, and there may be several different ones.`
        },
        {
          p: String.raw`A few things come for free. The triangle $s_1x=(x,1_b\,;\,x)$ always exists, so $x\simeq x$. Other properties you would expect take work, because the definition is lopsided: $x$ comes first and $1_b$ sits after it. In a quasi-category the coming levels prove that any two composites of the same pair are homotopic (the next level), that $\simeq$ is symmetric and transitive, that a homotopic arrow can replace another inside a triangle, and that $(1_a,x\,;\,y)$ would serve as the definition equally well, and each of those proofs takes a single tetrahedron.`
        }
      ]
    },
    {
      id: String.raw`kan`,
      before: String.raw`undo`,
      title: String.raw`Kan complexes`,
      body: [
        {
          p: String.raw`A simplicial set is a <b>Kan complex</b> if every horn fills, the outer ones included. Here is why that's the right condition for spaces. Given any space, take every way of mapping a triangle, a tetrahedron and so on into it; together they form a simplicial set, the <b>singular complex</b>, and its arrows are paths. Any path can be walked backwards, and that is what outer horns encode, so the singular complex is always a Kan complex.`
        },
        {
          diagram: {
            dots: [
              { id: String.raw`a`, label: String.raw`a`, x: 20, y: 32 },
              { id: String.raw`b`, label: String.raw`b`, x: 50, y: 10 },
              { id: String.raw`c`, label: String.raw`a`, x: 80, y: 32 }
            ],
            arrows: [
              { from: String.raw`a`, to: String.raw`b`, label: String.raw`f` },
              { from: String.raw`a`, to: String.raw`c`, label: String.raw`1_a` },
              { from: String.raw`b`, to: String.raw`c`, label: String.raw`?`, dashed: true }
            ]
          }
        },
        {
          p: String.raw`The outer horn $\Lambda^2_0$ on $f:a\to b$ and $1_a$ asks for an arrow $g:b\to a$ with a triangle $(f,g\,;\,1_a)$: going out along $f$ and back along $g$ is homotopic to the identity $1_a$. That $g$ is a <b>left inverse</b> of $f$. The other outer horn, $\Lambda^2_2$ on $f$ and $1_b$, gives a <b>right inverse</b> $k$ with $(k,f\,;\,1_b)$. An arrow with both is an <b>isomorphism</b>.`
        },
        {
          p: String.raw`So in a Kan complex every arrow is an isomorphism, which is why Kan complexes are also called <b>$\infty$-groupoids</b>. Not every quasi-category is Kan: the single arrow $a\to b$, with nothing else in it, fills every inner horn but has no arrow back from $b$ to $a$.`
        }
      ]
    },
    {
      id: String.raw`paths`,
      before: String.raw`cancel`,
      title: String.raw`Loops and the fundamental group`,
      body: [
        {
          p: String.raw`Keep reading arrows as paths. A path from a point back to itself is a <b>loop</b>. Loops at a point can be composed (walk one, then the other) and inverted (walk it backwards), and up to homotopy this is a group, the <b>fundamental group</b>.`
        },
        {
          diagram: {
            dots: [{ id: String.raw`a`, label: String.raw`p`, x: 30, y: 30 }],
            arrows: [{ from: String.raw`a`, to: String.raw`a`, label: String.raw`ℓ` }]
          }
        },
        {
          p: String.raw`Around a circle the fundamental group is the integers: a loop is classified by how many times it winds round, counted with sign. A loop that winds once can't be shrunk to a point without leaving the circle. A Kan complex records all of this, together with homotopies between homotopies and so on up, which is the sense in which it's a space described by triangles.`
        },
        {
          p: String.raw`In the next level you use outer tetrahedra $\Lambda^3_3$ to cancel arrows, which is unsurprising in a space where every path can be undone; the Isomorphisms world shows how much of this fails once that is no longer true.`
        }
      ]
    },
    {
      id: String.raw`nerve`,
      before: String.raw`nerve`,
      title: String.raw`The nerve of a category`,
      body: [
        {
          p: String.raw`Take an ordinary category: objects, arrows, a composition rule with exactly one answer for each composable pair, identities, associativity. Its <b>nerve</b> $N(\mathcal C)$ is a simplicial set. The vertices are the objects, the arrows are the arrows, a triangle is a composable pair together with its composite, and a tetrahedron is a composable triple together with all its composites.`
        },
        {
          diagram: {
            dots: [
              { id: String.raw`a`, label: String.raw`a`, x: 8, y: 38 },
              { id: String.raw`b`, label: String.raw`b`, x: 34, y: 20 },
              { id: String.raw`c`, label: String.raw`c`, x: 62, y: 38 },
              { id: String.raw`d`, label: String.raw`d`, x: 90, y: 20 }
            ],
            arrows: [
              { from: String.raw`a`, to: String.raw`b`, label: String.raw`f` },
              { from: String.raw`b`, to: String.raw`c`, label: String.raw`g` },
              { from: String.raw`c`, to: String.raw`d`, label: String.raw`h` }
            ]
          }
        },
        {
          p: String.raw`In a nerve every inner horn has <i>exactly one</i> filler, because the composite is determined. Conversely, a simplicial set in which every inner horn has exactly one filler is the nerve of a category. The next levels show you the composition table and politely refuse when you ask for a second composite.`
        },
        { demo: String.raw`tetra-3d` },
        {
          p: String.raw`Associativity becomes a tetrahedron. The tetrahedron on $f,g,h$ has faces $(f,g\,;\,gf)$, $(g,h\,;\,hg)$, $(gf,h\,;\,hgf)$ and $(f,hg\,;\,hgf)$, and the last face says $h(gf)=(hg)f$.`
        },
        {
          p: String.raw`A path of arrows end to end inside a simplex is its <b>spine</b>. In a nerve every spine extends to a full simplex in exactly one way; this is the <b>Segal condition</b>. The later levels of this world ask you to check it on pictures: a spine of two arrows with no triangle, or with two, means the picture isn't a nerve.`
        }
      ]
    },
    {
      id: String.raw`skeleta`,
      before: String.raw`disc`,
      title: String.raw`Skeleta and cells`,
      body: [
        {
          p: String.raw`The <b>$n$-skeleton</b> $\mathrm{sk}_nX$ keeps the simplices of dimension at most $n$ and throws away the rest. $\mathrm{sk}_0$ is the vertices, $\mathrm{sk}_1$ adds the arrows, $\mathrm{sk}_2$ the triangles, and the Peel tool removes whatever the top layer currently is.`
        },
        {
          p: String.raw`The <b>boundary</b> $\partial\Delta^n$ is the skeleton $\mathrm{sk}_{n-1}\Delta^n$: every face, no inside. So $\partial\Delta^2$ is a hollow triangle, and $\partial\Delta^3$ is the hollow shell of a tetrahedron.`
        },
        {
          diagram: {
            dots: [
              { id: String.raw`a`, label: String.raw`a`, x: 15, y: 42 },
              { id: String.raw`b`, label: String.raw`b`, x: 50, y: 12 },
              { id: String.raw`c`, label: String.raw`c`, x: 85, y: 42 }
            ],
            arrows: [
              { from: String.raw`a`, to: String.raw`b`, label: String.raw`f` },
              { from: String.raw`b`, to: String.raw`c`, label: String.raw`g` },
              { from: String.raw`a`, to: String.raw`c`, label: String.raw`h` }
            ],
            ghost: [[String.raw`a`, String.raw`b`, String.raw`c`]]
          }
        },
        {
          p: String.raw`To <b>attach an $n$-cell</b> along a copy of $\partial\Delta^n$ in $X$, glue in a new $\Delta^n$ whose boundary goes onto that copy. Glue triangle does this for $n=2$ and Glue solid for $n=3$. Every simplicial set can be built from vertices by attaching cells, one dimension at a time.`
        },
        {
          p: String.raw`A cell is glued along its whole boundary; a horn filler is glued along all faces but one. That difference matters: in this world you'll turn a circle into a disc, two discs into a sphere, and a sphere into a ball, and a horn filler can never change a shape like that.`
        },
        {
          p: String.raw`The skeleton has a partner, the <b>coskeleton</b>. Where $\mathrm{sk}_n$ forgets everything above dimension $n$, $\mathrm{cosk}_n$ puts one simplex into every complete boundary above dimension $n$, and the Fill in tool applies it.`
        }
      ]
    },
    {
      id: String.raw`spaces`,
      before: String.raw`sphere`,
      title: String.raw`Pictures as spaces`,
      body: [
        {
          p: String.raw`Every board is also a shape you could make from paper and wire: each vertex a point, each arrow a piece of wire, each filled triangle a paper triangle, each 3-simplex a solid block, all glued along their sides. That shape is the <b>geometric realisation</b> $|X|$, and it forgets which way the arrows pointed.`
        },
        {
          diagram: {
            dots: [
              { id: String.raw`a`, label: String.raw`a`, x: 20, y: 46 },
              { id: String.raw`b`, label: String.raw`b`, x: 50, y: 12 },
              { id: String.raw`c`, label: String.raw`c`, x: 80, y: 46 }
            ],
            arrows: [
              { from: String.raw`a`, to: String.raw`b`, label: String.raw`f` },
              { from: String.raw`b`, to: String.raw`c`, label: String.raw`g` },
              { from: String.raw`a`, to: String.raw`c`, label: String.raw`h` }
            ],
            fills: [[String.raw`a`, String.raw`b`, String.raw`c`]]
          }
        },
        {
          p: String.raw`A hollow triangle is a circle and a filled one is a disc, while two triangles glued along the same three sides, as in the next level, make a sphere, and so do the four faces of a hollow tetrahedron. Fill that shell with a 3-simplex and you have a ball. These are different shapes: a loop around the circle can't be shrunk to a point, and the sphere has a hollow inside that the ball does not.`
        },
        {
          p: String.raw`A quick test that tells many of them apart is the <b>Euler characteristic</b>: vertices minus arrows plus triangles minus tetrahedra, counting only non-degenerate pieces. For the disc you get $3-3+1=1$, for the circle $3-3=0$, for the sphere made of two triangles $3-3+2=2$, for the hollow tetrahedron $4-6+4=2$, and for the ball $4-6+4-1=1$, the same as for a single point. Filling a horn adds one simplex and one new face together, so it never changes this number; the next world turns that into a proof technique.`
        }
      ]
    },
    {
      id: String.raw`pushouts`,
      before: String.raw`ball`,
      aside: true,
      title: String.raw`Gluing and pushouts`,
      body: [
        {
          p: String.raw`Gluing two things along a shared part has a name in category theory, a <b>pushout</b>. Say you have a simplicial set $X$ containing a hollow triangle, and a filled triangle $\Delta^2$ whose rim is also a hollow triangle $\partial\Delta^2$. Glue the filled triangle's rim onto the hollow triangle in $X$ and you get a new simplicial set, written $X\cup_{\partial\Delta^2}\Delta^2$.`
        },
        {
          diagram: {
            caption: String.raw`The pushout square for gluing in a triangle.`,
            dots: [
              { id: String.raw`d`, label: String.raw`∂Δ²`, x: 15, y: 10 },
              { id: String.raw`x`, label: String.raw`X`, x: 85, y: 10 },
              { id: String.raw`t`, label: String.raw`Δ²`, x: 15, y: 52 },
              { id: String.raw`p`, label: String.raw`X ∪ Δ²`, x: 85, y: 52 }
            ],
            arrows: [
              { from: String.raw`d`, to: String.raw`x`, label: String.raw`rim in X` },
              { from: String.raw`d`, to: String.raw`t`, label: String.raw`rim` },
              { from: String.raw`x`, to: String.raw`p`, label: String.raw`` },
              { from: String.raw`t`, to: String.raw`p`, label: String.raw`` }
            ]
          }
        },
        {
          p: String.raw`Start reading the square at the top left, where $\partial\Delta^2$ is the shared part, which maps into $X$ (where the rim sits) and into $\Delta^2$ (as the boundary). The bottom right is the glued result, and both $X$ and $\Delta^2$ map into it. The square commutes because the rim lands in the same place either way. The pushout is the smallest thing that receives $X$ and $\Delta^2$ with their rims identified, and nothing else identified.`
        },
        {
          p: String.raw`You have already built a few of these. The sphere of <i>Two cells on one boundary</i> is two discs glued along their common circle: a pushout $\Delta^2\cup_{\partial\Delta^2}\Delta^2$. In the next level you attach a 3-cell to a hollow tetrahedron: a pushout of $\partial\Delta^3\hookrightarrow\Delta^3$ along the shell.`
        },
        {
          p: String.raw`Filling a horn is the same kind of gluing with a different shared part. A horn in $X$ is a map $\Lambda^n_k\to X$, and filling it glues $\Delta^n$ along $\Lambda^n_k\hookrightarrow\Delta^n$. The shared part is the horn rather than the full boundary, and that is why a horn filling brings its missing face along with it.`
        }
      ]
    },
    {
      id: String.raw`anodyne`,
      before: String.raw`spine`,
      title: String.raw`Anodyne maps`,
      body: [
        {
          p: String.raw`Some inclusions $A\hookrightarrow B$ can be built from horn fillings alone: start with $A$, fill a horn, fill another, and arrive at $B$. Close this up under the obvious operations and you get the <b>anodyne</b> maps, the smallest class containing every $\Lambda^n_k\hookrightarrow\Delta^n$ and closed under pushouts, composition and retracts. Using inner horns only gives the <b>inner anodyne</b> maps.`
        },
        {
          p: String.raw`Anodyne maps never change the shape: a horn is a cone, contractible like $\Delta^n$ itself, so gluing $\Delta^n$ along a horn adds nothing topologically interesting. The spine of $\Delta^n$, its path of $n$ arrows, is inner anodyne in $\Delta^n$, which is why a chain of arrows in a quasi-category always extends to a full simplex.`
        },
        {
          diagram: {
            dots: [
              { id: String.raw`a`, label: String.raw`0`, x: 8, y: 38 },
              { id: String.raw`b`, label: String.raw`1`, x: 34, y: 20 },
              { id: String.raw`c`, label: String.raw`2`, x: 62, y: 38 },
              { id: String.raw`d`, label: String.raw`3`, x: 90, y: 20 }
            ],
            arrows: [
              { from: String.raw`a`, to: String.raw`b`, label: String.raw`` },
              { from: String.raw`b`, to: String.raw`c`, label: String.raw`` },
              { from: String.raw`c`, to: String.raw`d`, label: String.raw`` },
              { from: String.raw`a`, to: String.raw`c`, label: String.raw``, dashed: true },
              { from: String.raw`b`, to: String.raw`d`, label: String.raw``, dashed: true },
              { from: String.raw`a`, to: String.raw`d`, label: String.raw``, dashed: true }
            ]
          }
        },
        {
          p: String.raw`The inclusion of the hollow triangle $\partial\Delta^2$ (three arrows in a loop, as in the Skeleta and cells world) into $\Delta^2$ isn't anodyne. The hollow triangle is a circle and the filled one a disc, and horn fillings can't turn one into the other.`
        },
        {
          p: String.raw`In this world some goals are reachable and some are not. When you think a goal is out of reach, say so, and back it up as the next note explains.`
        }
      ]
    },
    {
      id: String.raw`counter`,
      before: String.raw`nofill`,
      title: String.raw`How to prove something is impossible`,
      body: [
        {
          p: String.raw`Showing that a goal can be reached is easy to check, because you just reach it. Showing that it never can be reached is harder, since nobody can try every sequence of moves, so instead you find a <b>counterexample</b>: one concrete category in which everything you were given holds and the goal fails.`
        },
        {
          diagram: {
            dots: [
              { id: String.raw`a`, label: String.raw`0`, x: 20, y: 46 },
              { id: String.raw`b`, label: String.raw`1`, x: 50, y: 12 },
              { id: String.raw`c`, label: String.raw`2`, x: 80, y: 46 }
            ],
            arrows: [
              { from: String.raw`a`, to: String.raw`b`, label: String.raw`f` },
              { from: String.raw`b`, to: String.raw`c`, label: String.raw`g` },
              { from: String.raw`a`, to: String.raw`c`, label: String.raw`h` },
              { from: String.raw`a`, to: String.raw`c`, label: String.raw`k` }
            ]
          }
        },
        {
          p: String.raw`The counterexamples are small ordinary categories (strictly, their nerves), where each pair has exactly one composite. In the picture, $f$ then $g$ composes to $k$, a different arrow from $h$. If you send your board into it, $f$ to $f$, $g$ to $g$ and $h$ to $h$, then in that category the triangle $(f,g\,;\,h)$ is false.`
        },
        {
          p: String.raw`One counterexample is enough because every move you have fills an inner horn, and a category fills every inner horn as well, so anything you could build from the starting board also exists in the counterexample. If the goal were reachable it would hold there, and it does not.`
        },
        {
          p: String.raw`There are two ways to build a useless counterexample. If one of the given triangles fails there, it doesn't contain your board, and if the goal happens to hold there, it proves nothing and you should change it. And if the level lets every arrow be undone, the counterexample has to allow that too.`
        }
      ]
    },
    {
      id: String.raw`zigzag`,
      before: String.raw`halfspine`,
      aside: true,
      title: String.raw`Why composition is associative`,
      body: [
        {
          p: String.raw`You compose two arrows by filling the horn they form, and you've seen that the filler isn't unique. So when there are three arrows $f,g,h$ in a row, there are two ways to compose them, $(f$ then $g)$ then $h$ or $f$ then $(g$ then $h)$, and each involves choices. Why do the two answers agree, even up to homotopy? Here's the argument from the course notes, which turns the question into a statement about shapes.`
        },
        {
          p: String.raw`Name the shapes by their corners. The three arrows on their own are the spine, $\Delta^{01}\cup\Delta^{12}\cup\Delta^{23}$. If you fill the triangle on the first two arrows you get $\Delta^{012}\cup\Delta^{23}$, a filled triangle with $h$ hanging off the end, which is what you need to write down $(f$ then $g)$ then $h$. If you fill the triangle on the last two instead, you get $\Delta^{01}\cup\Delta^{123}$, which is what you need for $f$ then $(g$ then $h)$. And the solid tetrahedron $\Delta^3$ contains both.`
        },
        {
          diagram: {
            caption: String.raw`Each arrow is an inclusion that can be built by filling inner horns.`,
            dots: [
              { id: String.raw`s`, label: String.raw`Δ⁰¹∪Δ¹²∪Δ²³`, x: 50, y: 6 },
              { id: String.raw`l`, label: String.raw`Δ⁰¹²∪Δ²³`, x: 14, y: 30 },
              { id: String.raw`r`, label: String.raw`Δ⁰¹∪Δ¹²³`, x: 86, y: 30 },
              { id: String.raw`t`, label: String.raw`Δ³`, x: 50, y: 56 }
            ],
            arrows: [
              { from: String.raw`s`, to: String.raw`l`, label: String.raw`` },
              { from: String.raw`s`, to: String.raw`r`, label: String.raw`` },
              { from: String.raw`l`, to: String.raw`t`, label: String.raw`` },
              { from: String.raw`r`, to: String.raw`t`, label: String.raw`` }
            ]
          }
        },
        {
          p: String.raw`Every arrow in that picture is an inclusion you can build one inner horn at a time, which is what <b>inner anodyne</b> means. That matters because a quasi-category lets any map out of the smaller shape extend to the bigger one. So start from whichever bracketing you like, on the left or on the right; it extends to a whole tetrahedron. Inside that tetrahedron the other bracketing is sitting there as two of its faces, and the tetrahedron itself is the witness that the two answers are homotopic. That's associativity up to homotopy, and it's exactly what the tetrahedron levels had you do by hand.`
        },
        {
          p: String.raw`The next level hands you the right-hand middle shape, one arrow $f$ next to a filled triangle on $g,h$, and asks you to follow the bottom-right arrow of the picture to the full tetrahedron.`
        }
      ]
    },
    {
      id: String.raw`lifting`,
      before: String.raw`liftpath`,
      title: String.raw`Maps and lifting problems`,
      body: [
        {
          p: String.raw`A <b>map</b> $p:X\to S$ of simplicial sets sends vertices to vertices, arrows to arrows and triangles to triangles, keeping faces. $X$ is called the <b>total space</b> and $S$ the <b>base</b>, and a simplex of $X$ <b>lies over</b> its image in $S$.`
        },
        {
          diagram: {
            dots: [
              { id: String.raw`a`, label: String.raw`a`, x: 15, y: 10 },
              { id: String.raw`b`, label: String.raw`b`, x: 50, y: 10 },
              { id: String.raw`c`, label: String.raw`c`, x: 85, y: 10 },
              { id: String.raw`A`, label: String.raw`p(a)`, x: 15, y: 48 },
              { id: String.raw`B`, label: String.raw`p(b)`, x: 50, y: 48 },
              { id: String.raw`C`, label: String.raw`p(c)`, x: 85, y: 48 }
            ],
            arrows: [
              { from: String.raw`a`, to: String.raw`b`, label: String.raw`f` },
              { from: String.raw`b`, to: String.raw`c`, label: String.raw`g` },
              { from: String.raw`A`, to: String.raw`B`, label: String.raw`pf` },
              { from: String.raw`B`, to: String.raw`C`, label: String.raw`pg` },
              { from: String.raw`a`, to: String.raw`A`, label: String.raw``, dashed: true },
              { from: String.raw`b`, to: String.raw`B`, label: String.raw``, dashed: true },
              { from: String.raw`c`, to: String.raw`C`, label: String.raw``, dashed: true }
            ]
          }
        },
        {
          p: String.raw`A <b>lifting problem</b> gives you a horn in $X$ and a simplex of $S$ whose faces are the images of the horn's faces. A <b>lift</b> fills the horn in $X$ with a simplex lying over the given one.`
        },
        {
          p: String.raw`$p$ is an <b>inner fibration</b> if every lifting problem for an inner horn has a lift. A simplicial set $X$ is a quasi-category exactly when the map from $X$ to a single point is an inner fibration, so ordinary horn filling is lifting over a point. $p$ is a <b>left fibration</b> if lifting problems for $\Lambda^n_k$ with $k<n$ all have lifts. That includes $\Lambda^1_0$, which is a single vertex: any arrow of $S$ lifts from any start you choose, although where the lift ends is up to $p$.`
        },
        {
          p: String.raw`A useful picture for a left fibration: over each vertex of $S$ sits a set (or a space), and each arrow of $S$ carries every element of one set to an element of the next. In the coming levels the same board can be solvable over a left fibration and impossible over an inner one.`
        }
      ]
    },
    {
      id: String.raw`liftsquare`,
      before: String.raw`backfill`,
      aside: true,
      title: String.raw`A lifting problem as a square`,
      body: [
        {
          p: String.raw`Lifting problems are usually drawn as a square, with the inclusion of the horn into the full simplex down the left side. The top is your horn in $X$, the bottom is the simplex in the base $S$, and the right side is the map $p$. The square commutes, because the horn's image is part of the bottom simplex.`
        },
        {
          diagram: {
            caption: String.raw`The dashed arrow is the lift you're asked for.`,
            dots: [
              { id: String.raw`h`, label: String.raw`Λⁿₖ`, x: 15, y: 10 },
              { id: String.raw`x`, label: String.raw`X`, x: 85, y: 10 },
              { id: String.raw`d`, label: String.raw`Δⁿ`, x: 15, y: 52 },
              { id: String.raw`s`, label: String.raw`S`, x: 85, y: 52 }
            ],
            arrows: [
              { from: String.raw`h`, to: String.raw`x`, label: String.raw`horn` },
              { from: String.raw`h`, to: String.raw`d`, label: String.raw`` },
              { from: String.raw`x`, to: String.raw`s`, label: String.raw`p` },
              { from: String.raw`d`, to: String.raw`s`, label: String.raw`simplex` },
              {
                from: String.raw`d`,
                to: String.raw`x`,
                label: String.raw`?`,
                dashed: true,
                kind: String.raw`given`
              }
            ]
          }
        },
        {
          p: String.raw`The dashed diagonal $\Delta^n\to X$ is a simplex of $X$. Going down the left and along the diagonal gives your horn back, so the simplex fills your horn. Going along the diagonal and then down $p$ gives the bottom simplex, so the new simplex lies over the right simplex. In other words, the diagonal has to make both triangles of the square commute.`
        },
        {
          p: String.raw`Every lifting problem in the coming levels has this shape, so in the next level it's worth asking which horn sits in the top left corner of the square you're being given, because that decides whether the dashed arrow can exist.`
        }
      ]
    },
    {
      id: String.raw`joyal`,
      before: String.raw`detour`,
      title: String.raw`Isomorphisms and Joyal's theorem`,
      body: [
        {
          p: String.raw`From this level on, some arrows carry the mark $\cong$: they are isomorphisms, with inverses on both sides up to homotopy. Outer horns don't fill in a general quasi-category, as <i>An arrow with no inverse</i> showed. <b>Joyal's theorem</b> says they do fill along an isomorphism. For $n\ge2$, a horn $\Lambda^n_0$ whose first edge, from corner $0$ to corner $1$, is an isomorphism has a filler, and so does a horn $\Lambda^n_n$ whose last edge is an isomorphism.`
        },
        {
          diagram: {
            dots: [
              { id: String.raw`a`, label: String.raw`0`, x: 20, y: 32 },
              { id: String.raw`b`, label: String.raw`1`, x: 50, y: 10 },
              { id: String.raw`c`, label: String.raw`2`, x: 80, y: 32 }
            ],
            arrows: [
              { from: String.raw`a`, to: String.raw`b`, label: String.raw`f ≅` },
              { from: String.raw`a`, to: String.raw`c`, label: String.raw`h` },
              { from: String.raw`b`, to: String.raw`c`, label: String.raw`?`, dashed: true }
            ]
          }
        },
        {
          p: String.raw`On the board, the Tetrahedron tool shows a padlock on an outer missing face. The padlock opens exactly when the edge next to the missing corner is marked $\cong$, and the Solve tools work only on arrows marked $\cong$.`
        },
        {
          p: String.raw`The converse also holds: an arrow along which all these horns fill is an isomorphism. So a quasi-category in which every arrow is an isomorphism is a Kan complex, and $\infty$-groupoids are the same as Kan complexes. There's a relative version too, which the Lifting world used in spirit: for an inner fibration $p:X\to S$, lifting problems for $\Lambda^n_0$ are solvable when the first edge is an isomorphism in $X$.`
        }
      ]
    },
    {
      id: String.raw`squares`,
      before: String.raw`natsq`,
      title: String.raw`Arrows between arrows`,
      body: [
        {
          p: String.raw`So far arrows have gone between vertices, so now treat an arrow $f:a\to b$ as a thing in its own right and ask what an arrow from $f$ to another arrow $f':a'\to b'$ should be. The answer is a <b>commuting square</b>, with sides $\alpha:a\to a'$ and $\beta:b\to b'$ such that both ways round from $a$ to $b'$ agree.`
        },
        {
          diagram: {
            dots: [
              { id: String.raw`a`, label: String.raw`a`, x: 25, y: 12 },
              { id: String.raw`b`, label: String.raw`b`, x: 75, y: 12 },
              { id: String.raw`c`, label: String.raw`a′`, x: 25, y: 48 },
              { id: String.raw`d`, label: String.raw`b′`, x: 75, y: 48 }
            ],
            arrows: [
              { from: String.raw`a`, to: String.raw`b`, label: String.raw`f` },
              { from: String.raw`a`, to: String.raw`c`, label: String.raw`α` },
              { from: String.raw`b`, to: String.raw`d`, label: String.raw`β` },
              { from: String.raw`c`, to: String.raw`d`, label: String.raw`f′` },
              { from: String.raw`a`, to: String.raw`d`, label: String.raw`d` }
            ],
            fills: [[String.raw`a`, String.raw`b`, String.raw`d`], [String.raw`a`, String.raw`c`, String.raw`d`]]
          }
        },
        {
          p: String.raw`In a quasi-category agreeing means sharing a witness: the square is two triangles $(f,\beta\,;\,d)$ and $(\alpha,f'\,;\,d)$ with the same long side $d$.`
        },
        {
          p: String.raw`These squares are the arrows of a new quasi-category, $\mathrm{Fun}(\Delta^1,C)$, whose vertices are the arrows of $C$. Stacking two squares and pasting them is composition there. Replace the single arrow $\Delta^1$ by a bigger shape $K$ and you get <b>natural transformations</b>, with one square for each arrow of $K$. The last level of the game shows that a square whose sides are isomorphisms can be inverted, by building the return square from horn fillings.`
        }
      ]
    }
  ],

  /* ==== glossary ========================================================== */

  glossary: [
    {
      term: String.raw`Vertex`,
      world: 1,
      essential: false,
      plain: String.raw`A place on the board. Arrows begin and end at vertices, and a vertex on its own is the simplest shape there is.`,
      formal: String.raw`A 0-simplex: a single point of the simplicial set.`,
      eg: String.raw`Every board starts with vertices: in <i>Constructing a composite</i> they are the three corners of a triangle.`,
      see: [String.raw`Arrow (edge)`, String.raw`Simplicial set`]
    },
    {
      term: String.raw`Arrow (edge)`,
      world: 1,
      essential: false,
      plain: String.raw`An arrow from one vertex to another. It has a direction, so an arrow from a to b is not an arrow from b to a.`,
      formal: String.raw`A 1-simplex, with a source vertex and a target vertex.`,
      eg: String.raw`In <i>Constructing a composite</i> you click f and then g, because g starts where f ends.`,
      see: [String.raw`Vertex`, String.raw`Composite`, String.raw`Identity (degenerate simplex)`]
    },
    {
      term: String.raw`Composite`,
      world: 2,
      essential: true,
      plain: String.raw`An arrow $x$ together with a triangle $(f,g\,;\,x)$ as evidence. A pair of arrows can have several.`,
      formal: String.raw`An edge $x$ with a 2-simplex $\sigma$ whose boundary is $(f,g\,;\,x)$. In an $\infty$-category it is unique only up to homotopy.`,
      eg: String.raw`In <i>Two composites of one pair</i> the pair $f,g$ gets two composites, and neither is more correct than the other.`,
      see: [String.raw`Triangle`, String.raw`Homotopy`, String.raw`Associativity`]
    },
    {
      term: String.raw`Triangle`,
      world: 1,
      essential: true,
      plain: String.raw`A 2-simplex with three corners and three faces. It is written by its boundary $(d_2,d_0\,;\,d_1)$.`,
      formal: String.raw`A 2-simplex $\Delta^2\to X$: three vertices, three edges and one face. Faces: $d_2$ joins corners 0, 1; $d_0$ joins 1, 2; $d_1$ joins 0, 2.`,
      eg: String.raw`<i>Reading a triangle</i> asks which triangle has a given long side.`,
      see: [String.raw`Composite`, String.raw`Simplex`, String.raw`Tetrahedron`]
    },
    {
      term: String.raw`Simplex`,
      world: 1,
      essential: false,
      plain: String.raw`A shape of one fixed dimension: a vertex in dimension 0, an arrow in 1, a triangle in 2, a tetrahedron in 3. The game never needs anything above dimension 3.`,
      formal: String.raw`The $n$-simplex $\Delta^n$: the convex hull of $n+1$ vertices, with faces obtained by forgetting one vertex at a time.`,
      eg: String.raw`The tetrahedron in <i>A fourth face</i> is a 3-simplex with four triangles for faces.`,
      see: [String.raw`Triangle`, String.raw`Tetrahedron`, String.raw`Simplicial set`]
    },
    {
      term: String.raw`Face`,
      world: 1,
      essential: false,
      plain: String.raw`One of the sides of a simplex: an edge of a triangle, or a triangle of a tetrahedron. What you are given and what you are asked to fill are always faces.`,
      formal: String.raw`A face of $\Delta^n$ is the image of a coface map $d^i:\Delta^{n-1}\to\Delta^n$, which forgets the vertex $i$.`,
      eg: String.raw`In <i>Reading a triangle</i> you find a triangle from its face $d_1$.`,
      see: [String.raw`Simplex`, String.raw`Horn`, String.raw`Boundary`]
    },
    {
      term: String.raw`Tetrahedron`,
      world: 3,
      essential: true,
      plain: String.raw`A 3-simplex with four triangles for faces that have to agree along their edges. Three faces that fit always leave exactly one more to fill.`,
      formal: String.raw`A 3-simplex $\Delta^3$ with four 2-faces, six edges and four vertices.`,
      eg: String.raw`In <i>Two bracketings</i> the tetrahedron relates the two ways of bracketing three arrows.`,
      see: [String.raw`Horn`, String.raw`Associativity`, String.raw`Simplex`]
    },
    {
      term: String.raw`Simplicial set`,
      world: 1,
      essential: false,
      plain: String.raw`A shape built from vertices, arrows, triangles and tetrahedra, glued so that shared sides agree. Every board in the game is one.`,
      formal: String.raw`A functor $\Delta^{op}\to\mathrm{Set}$: a set of $n$-simplices for each $n$, with face and degeneracy maps satisfying the simplicial identities.`,
      eg: String.raw`<i>Sandbox</i> lets you build one by hand.`,
      see: [String.raw`Simplex`, String.raw`Map`, String.raw`Nerve`]
    },
    {
      term: String.raw`Horn`,
      world: 2,
      essential: true,
      plain: String.raw`A simplex with its inside and one face removed — the situation you are given to complete. Which face is missing decides whether the horn may be filled.`,
      formal: String.raw`$\Lambda^n_k\subset\Delta^n$: the union of all faces of $\Delta^n$ except the one opposite vertex $k$.`,
      eg: String.raw`Every puzzle starts with a horn: three sides of a triangle, or three faces of a tetrahedron.`,
      see: [String.raw`Inner horn`, String.raw`Outer horn`, String.raw`Filler`]
    },
    {
      term: String.raw`Inner horn`,
      world: 2,
      essential: true,
      plain: String.raw`A horn whose missing face is not at either end. These are the ones an $\infty$-category is guaranteed to fill.`,
      formal: String.raw`$\Lambda^n_k$ with $0<k<n$.`,
      eg: String.raw`<i>A fourth face</i> fills $\Lambda^3_2$, a tetrahedron missing a middle face.`,
      see: [String.raw`Horn`, String.raw`Outer horn`, String.raw`Quasi-category (∞-category)`]
    },
    {
      term: String.raw`Filler`,
      world: 2,
      essential: false,
      plain: String.raw`A simplex that completes a horn: the piece the puzzle asks you to add. A filling exists only if the faces already there agree.`,
      formal: String.raw`An extension $\Delta^n\to X$ of a map $\Lambda^n_k\to X$.`,
      eg: String.raw`The new triangle in <i>Constructing a composite</i> is a filler.`,
      see: [String.raw`Horn`, String.raw`Lift`]
    },
    {
      term: String.raw`Identity (degenerate simplex)`,
      world: 1,
      essential: true,
      plain: String.raw`The identity arrow $1_a$ at a vertex, and the degenerate triangles $s_0f$, $s_1f$ built on it.`,
      formal: String.raw`$s_0(v)=1_v$ is the identity edge; $s_0(f)$ and $s_1(f)$ are degenerate 2-simplices.`,
      eg: String.raw`<i>Degenerate triangles</i> shows the two degenerate triangles of an arrow.`,
      see: [String.raw`Arrow (edge)`, String.raw`Associativity`, String.raw`Homotopy`]
    },
    {
      term: String.raw`Degenerate triangle`,
      world: 1,
      essential: true,
      plain: String.raw`A triangle with a repeated corner, such as $s_0f$ or $s_1f$. It exists without being built.`,
      formal: String.raw`$s_0f=(1_a,f\,;\,f)$ and $s_1f=(f,1_b\,;\,f)$ for $f:a\to b$; the degenerate 2-simplices on $f$.`,
      eg: String.raw`<i>Degenerate triangles</i> asks you to find both, and <i>Repeated corners</i> finds one as a face of a tetrahedron.`,
      see: [String.raw`Identity (degenerate simplex)`, String.raw`Face`, String.raw`Triangle`]
    },
    {
      term: String.raw`Associativity`,
      world: 3,
      essential: false,
      plain: String.raw`The two ways of bracketing three arrows are related by a triangle, not by an equation.`,
      formal: String.raw`The two bracketings of $f,g,h$ are faces of a 3-simplex; in a quasi-category they are homotopic, not equal.`,
      eg: String.raw`<i>Two bracketings</i> proves exactly this.`,
      see: [String.raw`Tetrahedron`, String.raw`Homotopy`, String.raw`Quasi-category (∞-category)`]
    },
    {
      term: String.raw`Homotopy`,
      world: 3,
      essential: true,
      plain: String.raw`Parallel arrows $x,y$ joined by a triangle $(x,1_b\,;\,y)$. This is the definition; symmetry and transitivity are theorems.`,
      formal: String.raw`$x\simeq y$ iff some 2-simplex has boundary $(x,1_b\,;\,y)$. In a quasi-category this is an equivalence relation.`,
      eg: String.raw`<i>Comparing two composites</i> shows two different composites are homotopic.`,
      see: [
        String.raw`Equivalence relation`,
        String.raw`Homotopy category`,
        String.raw`Identity (degenerate simplex)`
      ]
    },
    {
      term: String.raw`Equivalence relation`,
      world: 4,
      essential: false,
      plain: String.raw`A relation that is reflexive, symmetric and transitive: everything is related to itself, the relation runs both ways, and it chains. Homotopy of arrows is one.`,
      formal: String.raw`Homotopy of edges is reflexive, symmetric and transitive, so $hX$ has well-defined hom-sets.`,
      eg: String.raw`<i>Transitivity of homotopy</i> builds a chain of homotopies into a single one.`,
      see: [String.raw`Homotopy`, String.raw`Homotopy category`]
    },
    {
      term: String.raw`Quasi-category (∞-category)`,
      world: 2,
      essential: true,
      plain: String.raw`A shape where every inner horn fills. Arrows compose and tetrahedra close, consistently, though not uniquely.`,
      formal: String.raw`A simplicial set with fillers for all inner horns $\Lambda^n_k\to\Delta^n$, $0<k<n$ (Boardman-Vogt, Joyal).`,
      eg: String.raw`Every level except the Skeleta and cells and Anodyne maps worlds happens in one.`,
      see: [String.raw`Inner horn`, String.raw`Nerve`, String.raw`Kan complex`]
    },
    {
      term: String.raw`Homotopy category`,
      world: 4,
      essential: false,
      plain: String.raw`What you get by declaring homotopic arrows to be equal. It is an ordinary category, obtained from the $\infty$-category by forgetting the witnesses.`,
      formal: String.raw`$hX$: objects are the vertices, morphisms are homotopy classes of edges.`,
      eg: String.raw`<i>Chains of homotopies</i> settles a statement that is read in $hX$.`,
      see: [String.raw`Homotopy`, String.raw`Equivalence relation`, String.raw`Nerve`]
    },
    {
      term: String.raw`Outer horn`,
      world: 5,
      essential: true,
      plain: String.raw`A horn missing a face at one of the two ends. A general $\infty$-category need not fill it, except along reversible arrows.`,
      formal: String.raw`$\Lambda^n_0$ or $\Lambda^n_n$.`,
      eg: String.raw`<i>A left inverse</i> fills $\Lambda^2_0$ to produce an inverse; <i>An arrow with no inverse</i> shows a case where no filling exists.`,
      see: [String.raw`Inner horn`, String.raw`Kan complex`, String.raw`Joyal's theorem`]
    },
    {
      term: String.raw`Kan complex`,
      world: 5,
      essential: true,
      plain: String.raw`A simplicial set where every horn fills, inner and outer. Every arrow then has inverses up to homotopy.`,
      formal: String.raw`A simplicial set with fillers for all horns $\Lambda^n_k\to\Delta^n$, $0\le k\le n$.`,
      eg: String.raw`<i>A missing first leg</i> would be impossible in a general $\infty$-category but is fine here.`,
      see: [String.raw`Outer horn`, String.raw`∞-groupoid`, String.raw`Isomorphism (equivalence)`]
    },
    {
      term: String.raw`Left / right inverse`,
      world: 5,
      essential: false,
      plain: String.raw`An arrow that undoes $f$, either before it or after it. One side alone is weaker than an inverse on both sides.`,
      formal: String.raw`$g$ with a triangle $(f,g\,;\,1_a)$ (left inverse), $k$ with $(k,f\,;\,1_b)$ (right inverse).`,
      eg: String.raw`<i>A one-sided inverse</i> has a left inverse but no right one.`,
      see: [String.raw`Isomorphism (equivalence)`, String.raw`Retraction`]
    },
    {
      term: String.raw`Isomorphism (equivalence)`,
      world: 5,
      essential: true,
      plain: String.raw`A reversible arrow: it has inverses on both sides, up to homotopy. Along an isomorphism, outer horns can be filled.`,
      formal: String.raw`An edge with a left and a right inverse up to homotopy; an isomorphism in $hX$.`,
      eg: String.raw`<i>Inverses on both sides</i> builds both inverses and shows they agree.`,
      see: [String.raw`Kan complex`, String.raw`Joyal's theorem`, String.raw`Natural isomorphism`]
    },
    {
      term: String.raw`∞-groupoid`,
      world: 5,
      essential: true,
      plain: String.raw`Another name for a Kan complex: a shape where every arrow reverses. It models a space.`,
      formal: String.raw`By the homotopy hypothesis, Kan complexes model spaces up to homotopy.`,
      eg: String.raw`The Playground, with every tool unlocked, is one.`,
      see: [String.raw`Kan complex`, String.raw`Homotopy hypothesis`, String.raw`Fundamental group`]
    },
    {
      term: String.raw`Homotopy hypothesis`,
      world: 5,
      essential: false,
      plain: String.raw`Kan complexes, where all arrows are invertible, model spaces; and every space can be built this way.`,
      formal: String.raw`The homotopy theory of Kan complexes is equivalent to that of CW complexes; both model homotopy types.`,
      eg: String.raw`<i>Two cells on one boundary</i> builds a 2-sphere from two triangles glued along their rims.`,
      see: [String.raw`∞-groupoid`, String.raw`Kan complex`, String.raw`Geometric realisation`]
    },
    {
      term: String.raw`Fundamental group`,
      world: 5,
      essential: false,
      plain: String.raw`Loops at a point, up to homotopy, with composition. It records which loops can be shrunk to a point.`,
      formal: String.raw`$\pi_1(X,x)$: endomorphisms of $x$ in the homotopy category of a Kan complex $X$.`,
      eg: String.raw`<i>A closed loop</i> shows a loop that cannot be filled in, so its class is not the identity.`,
      see: [String.raw`∞-groupoid`, String.raw`Homotopy hypothesis`]
    },
    {
      term: String.raw`Category`,
      world: 6,
      essential: false,
      plain: String.raw`Objects and arrows between them, where arrows compose and every object has an identity arrow. Composition gives a definite arrow instead of a homotopy class.`,
      formal: String.raw`A category $\mathcal C$: objects, morphisms, associative composition, an identity morphism per object.`,
      eg: String.raw`The composition table in <i>Only one filler</i> is a category's table.`,
      see: [String.raw`Functor`, String.raw`Nerve`, String.raw`Associativity`]
    },
    {
      term: String.raw`Functor`,
      world: 6,
      essential: false,
      plain: String.raw`A map between categories that sends objects to objects and arrows to arrows, keeping composition and identities.`,
      formal: String.raw`A functor $F:\mathcal C\to\mathcal D$ with $F(g\circ f)=F(g)\circ F(f)$ and $F(1_x)=1_{Fx}$.`,
      eg: String.raw`The map you follow in <i>Lifting a path</i> carries one shape onto the other.`,
      see: [String.raw`Category`, String.raw`Map`, String.raw`Natural transformation`]
    },
    {
      term: String.raw`Nerve`,
      world: 6,
      essential: true,
      plain: String.raw`A category drawn as shapes: its vertices are objects, its arrows are maps, and its higher simplices are chains of maps run one after another.`,
      formal: String.raw`$N(\mathcal C)$: $n$-simplices are chains of $n$ composable morphisms. Every inner horn fills uniquely.`,
      eg: String.raw`<i>The composition table</i> is the smallest example, with a single arrow.`,
      see: [String.raw`Category`, String.raw`Segal condition`, String.raw`Spine`]
    },
    {
      term: String.raw`Spine`,
      world: 6,
      essential: true,
      plain: String.raw`The path of consecutive arrows inside a simplex, with everything else thrown away. Whether the spine can be filled, and how many ways, tells you what kind of shape you have.`,
      formal: String.raw`$\mathrm{Spine}^n\subset\Delta^n$: the union of the edges $\{i,i+1\}$. The inclusion is inner anodyne, and filling every spine uniquely is the Segal condition.`,
      eg: String.raw`<i>Fill the spine</i> fills it; <i>Deciding whether a picture is a nerve</i> asks when the filling is unique.`,
      see: [String.raw`Nerve`, String.raw`Segal condition`, String.raw`Inner anodyne map`]
    },
    {
      term: String.raw`Segal condition`,
      world: 6,
      essential: false,
      plain: String.raw`Every spine fills in exactly one way. It is the test that turns a shape into the nerve of a category.`,
      formal: String.raw`$X_n\to X_1\times_{X_0}\cdots\times_{X_0}X_1$ is a bijection for each $n$; equivalent to being a nerve.`,
      eg: String.raw`<i>A picture that is a nerve</i> passes the test; <i>Two fillers of one horn</i> fails it.`,
      see: [String.raw`Spine`, String.raw`Nerve`]
    },
    {
      term: String.raw`Skeleton`,
      world: 7,
      essential: true,
      plain: String.raw`What is left after you throw away everything above a dimension: the vertices alone, or the vertices and arrows.`,
      formal: String.raw`$\mathrm{sk}_nX$: the simplicial subset generated by simplices of dimension $\le n$.`,
      eg: String.raw`<i>Skeleta</i> removes a top-dimensional cell and reveals the skeleton below.`,
      see: [String.raw`Coskeleton`, String.raw`Boundary`, String.raw`Cell`]
    },
    {
      term: String.raw`Boundary`,
      world: 7,
      essential: false,
      plain: String.raw`The rim of a shape with its inside removed: a hollow triangle, or a hollow tetrahedron.`,
      formal: String.raw`$\partial\Delta^n=\mathrm{sk}_{n-1}\Delta^n$: the union of all faces of $\Delta^n$.`,
      eg: String.raw`<i>Sphere</i> starts from the boundary of a tetrahedron.`,
      see: [String.raw`Skeleton`, String.raw`Cell`, String.raw`Horn`]
    },
    {
      term: String.raw`Cell`,
      world: 7,
      essential: true,
      plain: String.raw`A triangle or tetrahedron glued onto its boundary. Adding cells one dimension at a time is how this world builds shapes and takes them apart.`,
      formal: String.raw`Attaching an $n$-cell: glue $\Delta^n$ to $X$ along a map $\partial\Delta^n\to X$ (a pushout).`,
      eg: String.raw`<i>Attaching a cell</i> glues a triangle onto a circle and fills its hole.`,
      see: [String.raw`Boundary`, String.raw`Skeleton`, String.raw`Coskeleton`]
    },
    {
      term: String.raw`Coskeleton`,
      world: 7,
      essential: true,
      plain: String.raw`Fill every hollow shape in the only way possible. If a filling is not forced, the coskeleton leaves it out.`,
      formal: String.raw`$(\mathrm{cosk}_nX)_m=\mathrm{Hom}(\mathrm{sk}_n\Delta^m,X)$; right adjoint to $\mathrm{sk}_n$.`,
      eg: String.raw`<i>The coskeleton</i> builds a coskeleton one dimension at a time.`,
      see: [String.raw`Skeleton`, String.raw`Cell`, String.raw`Nerve`]
    },
    {
      term: String.raw`Geometric realisation`,
      world: 7,
      essential: false,
      plain: String.raw`The space you get by treating the picture as made of solid pieces: vertices become points, arrows become intervals, triangles become filled triangles.`,
      formal: String.raw`$|X|=\mathrm{colim}_{\Delta^n\to X}|\Delta^n|$, gluing topological simplices along their faces.`,
      eg: String.raw`<i>Two cells on one boundary</i> realises to a sphere.`,
      see: [String.raw`Homotopy hypothesis`, String.raw`Euler characteristic`]
    },
    {
      term: String.raw`Euler characteristic`,
      world: 7,
      essential: false,
      plain: String.raw`Vertices minus arrows plus triangles, and so on. Horn filling does not change it, so a hole is preserved.`,
      formal: String.raw`$\chi(X)=\sum_n(-1)^n\,\#\{\text{non-degenerate } n\text{-simplices}\}$ for finite $X$.`,
      eg: String.raw`A hollow triangle has $\chi=0$; filled, $\chi=1$, and no sequence of horn fillings can change that.`,
      see: [String.raw`Geometric realisation`, String.raw`Anodyne map`]
    },
    {
      term: String.raw`Anodyne map`,
      world: 8,
      essential: true,
      plain: String.raw`An inclusion built purely out of horn fillings, so it never changes the shape. If a goal would change the shape, no horn move can reach it.`,
      formal: String.raw`The saturated class generated by $\Lambda^n_k\subset\Delta^n$. $\partial\Delta^2\subset\Delta^2$ is not anodyne.`,
      eg: String.raw`<i>Fill the spine</i> is anodyne; <i>A square with no diagonal</i> is not.`,
      see: [String.raw`Inner anodyne map`, String.raw`Counterexample`, String.raw`Left lifting property`]
    },
    {
      term: String.raw`Inner anodyne map`,
      world: 8,
      essential: false,
      plain: String.raw`Anodyne, but built only from inner horns. It is weaker than anodyne, and it is the one that matches $\infty$-categories.`,
      formal: String.raw`Saturated class generated by $\Lambda^n_k\subset\Delta^n$ with $0<k<n$.`,
      eg: String.raw`The spine inclusion in <i>Fill the spine</i> is inner anodyne.`,
      see: [String.raw`Anodyne map`, String.raw`Spine`]
    },
    {
      term: String.raw`Counterexample`,
      world: 8,
      essential: true,
      plain: String.raw`A shape where the givens hold but the goal cannot be reached. Finding one is how you prove that a goal is impossible.`,
      formal: String.raw`A map to the nerve of a category in which the required simplex does not exist.`,
      eg: String.raw`<i>Two parallel arrows</i> is a counterexample to a homotopy that is not forced.`,
      see: [String.raw`Anodyne map`, String.raw`Nerve`]
    },
    {
      term: String.raw`Left lifting property`,
      world: 8,
      essential: false,
      plain: String.raw`The property of a shape $A\to B$ that every square from it can be filled. Horn inclusions have it against $\infty$-categories, and that is what makes them anodyne.`,
      formal: String.raw`$i:A\to B$ has the left lifting property against $p:X\to S$ if every square $A\to X$, $B\to S$ has a diagonal.`,
      eg: String.raw`In <i>Lifting a path</i> the lift exists exactly because the horn inclusion has this property.`,
      see: [String.raw`Anodyne map`, String.raw`Lifting problem`, String.raw`Inner fibration`]
    },
    {
      term: String.raw`Map`,
      world: 9,
      essential: true,
      plain: String.raw`A rule sending each piece of one shape to a piece of another, keeping faces. The first is called the total space and the second the base.`,
      formal: String.raw`A morphism of simplicial sets $p:X\to S$.`,
      eg: String.raw`In <i>Lifting a path</i> the triangle in $X$ lies over the triangle of the base $S$.`,
      see: [String.raw`Lifting problem`, String.raw`Functor`, String.raw`Simplicial set`]
    },
    {
      term: String.raw`Lift`,
      world: 9,
      essential: true,
      plain: String.raw`A solution to a lifting problem: a simplex of $X$ lying over the given simplex of $S$, extending what is already there.`,
      formal: String.raw`A map $B\to X$ making the square commute.`,
      eg: String.raw`In <i>Two lifts of one arrow</i> two different arrows of $X$ lie over the same arrow of $S$.`,
      see: [String.raw`Lifting problem`, String.raw`Filler`, String.raw`Left fibration`]
    },
    {
      term: String.raw`Lifting problem`,
      world: 9,
      essential: true,
      plain: String.raw`A square: a simplex of the base $S$, part of it already in $X$, and the question whether the rest can be filled in $X$ over that simplex.`,
      formal: String.raw`A square $A\to X$, $B\to S$ with $A\subset B$; find $B\to X$ making both triangles commute.`,
      eg: String.raw`<i>Lifting a path</i> is the first one.`,
      see: [String.raw`Lift`, String.raw`Inner fibration`, String.raw`Left fibration`]
    },
    {
      term: String.raw`Inner fibration`,
      world: 9,
      essential: true,
      plain: String.raw`A map for which every inner horn in $X$ fills over any filler of its image in $S$.`,
      formal: String.raw`$p$ has the right lifting property against $\Lambda^n_k\subset\Delta^n$ for $0<k<n$.`,
      eg: String.raw`In <i>Closing a lifted square</i> only the inner horn may be filled in $X$.`,
      see: [String.raw`Left fibration`, String.raw`Joyal's theorem`, String.raw`Right lifting property`]
    },
    {
      term: String.raw`Left fibration`,
      world: 9,
      essential: true,
      plain: String.raw`A map that lets you lift any arrow of the base from a start you choose, and fill the horns that already know their first arrow.`,
      formal: String.raw`$p$ has the right lifting property against $\Lambda^n_k\subset\Delta^n$ for $0\le k<n$.`,
      eg: String.raw`<i>Lifting a path</i> and <i>A missing first leg, lifted</i> are both about this map.`,
      see: [String.raw`Inner fibration`, String.raw`Lift`, String.raw`Conservative`]
    },
    {
      term: String.raw`Kan fibration`,
      world: 9,
      essential: false,
      plain: String.raw`A map for which every horn in $X$ fills over any filler of its image in $S$ — inner and outer alike.`,
      formal: String.raw`$p$ has the right lifting property against all $\Lambda^n_k\subset\Delta^n$, $0\le k\le n$. A Kan complex is a Kan fibration over a point.`,
      eg: String.raw`An inner fibration is the softer version in <i>Closing a lifted square</i>; a Kan fibration would fill outer horns too.`,
      see: [String.raw`Inner fibration`, String.raw`Left fibration`, String.raw`Kan complex`]
    },
    {
      term: String.raw`Conservative`,
      world: 9,
      essential: false,
      plain: String.raw`A map that does not lose reversibility: an arrow of $X$ is an isomorphism whenever its image in $S$ is.`,
      formal: String.raw`$p$ reflects equivalences: $p(f)$ an equivalence implies $f$ an equivalence.`,
      eg: String.raw`<i>A left fibration over an isomorphism</i> is conservative; <i>An inner fibration over an isomorphism</i> is not.`,
      see: [String.raw`Left fibration`, String.raw`Isomorphism (equivalence)`]
    },
    {
      term: String.raw`Right lifting property`,
      world: 9,
      essential: false,
      plain: String.raw`The property of a map that every square into it can be filled. Fibrations are exactly the maps with this property against horn inclusions.`,
      formal: String.raw`$p:X\to S$ has the right lifting property against $i:A\to B$ if every square $A\to X$, $B\to S$ has a diagonal $B\to X$.`,
      eg: String.raw`Being an inner fibration is the right lifting property against inner horn inclusions.`,
      see: [String.raw`Left lifting property`, String.raw`Inner fibration`]
    },
    {
      term: String.raw`Idempotent`,
      world: 10,
      essential: false,
      plain: String.raw`An arrow $e$ with a triangle $(e,e\,;\,e)$: doing it twice is a composite of doing it once.`,
      formal: String.raw`An edge $e$ with a 2-simplex $(e,e,e)$.`,
      eg: String.raw`<i>An idempotent from a one-sided inverse</i>.`,
      see: [String.raw`Isomorphism (equivalence)`]
    },
    {
      term: String.raw`Retraction`,
      world: 10,
      essential: false,
      plain: String.raw`A one-sided inverse: an arrow that undoes $f$ in one direction only.`,
      formal: String.raw`$r$ with $r\circ f\simeq 1$ is a retraction of $f$; dually a section.`,
      eg: String.raw`<i>A one-sided inverse</i> has a retraction but no section.`,
      see: [String.raw`Left / right inverse`, String.raw`Isomorphism (equivalence)`]
    },
    {
      term: String.raw`Joyal's theorem`,
      world: 10,
      essential: true,
      plain: String.raw`An outer horn can be filled when the arrow it has to undo is an isomorphism.`,
      formal: String.raw`In an $\infty$-category, $\Lambda^n_0\to X$ ($n\ge2$) extends to $\Delta^n$ if its first edge is an equivalence; conversely such an edge is an equivalence.`,
      eg: String.raw`<i>Joyal's theorem</i> is the boss level that uses it.`,
      see: [String.raw`Outer horn`, String.raw`Isomorphism (equivalence)`, String.raw`Inner fibration`]
    },
    {
      term: String.raw`Commuting square`,
      world: 11,
      essential: true,
      plain: String.raw`Two ways round from one corner to the opposite one, plus a filling between them. It is an arrow between arrows.`,
      formal: String.raw`A map $\Delta^1\times\Delta^1\to C$; an edge of $\mathrm{Fun}(\Delta^1,C)$.`,
      eg: String.raw`<i>A commuting square</i> is the first one.`,
      see: [String.raw`Natural transformation`, String.raw`Homotopy`, String.raw`Natural isomorphism`]
    },
    {
      term: String.raw`Natural transformation`,
      world: 11,
      essential: true,
      plain: String.raw`A family of arrows, one per object, that makes every square commute. It is how a construction on objects becomes a construction on maps.`,
      formal: String.raw`An edge of $\mathrm{Fun}(K,C)$, i.e. a map $K\times\Delta^1\to C$.`,
      eg: String.raw`<i>Pasting squares</i> composes two of them.`,
      see: [String.raw`Commuting square`, String.raw`Natural isomorphism`, String.raw`Functor`]
    },
    {
      term: String.raw`Natural isomorphism`,
      world: 11,
      essential: false,
      plain: String.raw`A natural transformation whose every side is reversible. It says two constructions agree everywhere, coherently.`,
      formal: String.raw`An equivalence in $\mathrm{Fun}(K,C)$; equivalently each component is an equivalence in $C$.`,
      eg: String.raw`<i>Inverting a square</i>.`,
      see: [String.raw`Natural transformation`, String.raw`Isomorphism (equivalence)`]
    }
  ],

  /* ==== the ending ======================================================== */

  epilogue: {
    title: String.raw`What you did, and where to go next`,
    html: String.raw`<h3>What you did</h3><p>Every level used one idea. A <b>horn</b> is a simplex with one face and its inside removed, and a move fills it back in. In an ∞-category the inner horns can always be filled, and that single rule replaces the composition law of an ordinary category.</p><p>Filling a horn of two arrows gave you <b>composition</b>, and filling it twice showed that a composite is something you choose, with a triangle as the record of the choice. Tetrahedra then made the choices agree: you proved that any two composites are <b>homotopic</b>, that homotopy is an equivalence relation, that it is respected by composition, and that bracketing three or four arrows makes no difference. Those are exactly the statements needed to say that an ∞-category has a <b>homotopy category</b>, an ordinary category obtained by treating homotopic arrows as equal.</p><p>You saw the two extremes. In the <b>nerve</b> of a category every horn has exactly one filler, so nothing is left to choose. In a <b>Kan complex</b> every horn fills, outer ones included, so every arrow can be undone, and the shape behaves like a space. <b>Joyal's theorem</b> connects them: in an ∞-category an outer horn $\Lambda^n_0$ can be filled exactly when the arrow it starts with is an <b>isomorphism</b>. So a Kan complex is the same thing as an ∞-category in which every arrow is an isomorphism. There is also a relative form, which the lifting world used: for an inner fibration $p:X\to S$, a lifting problem against $\Lambda^n_0\hookrightarrow\Delta^n$ has a solution whenever the first edge is an isomorphism in $X$.</p><p>You also proved things impossible, by placing a picture inside a small category where the goal is false. You built shapes cell by cell, took <b>skeleta</b> and <b>coskeleta</b>, and worked over a second shape through a <b>left fibration</b>, where an arrow over an isomorphism must itself be one. The last world treated arrows as objects: commuting squares are the arrows of $\mathrm{Fun}(\Delta^1,C)$, and you showed that a <b>natural transformation</b> is invertible as soon as each of its components is.</p><h3>Further reading</h3><p><b>1. Ordinary category theory.</b> The game used categories, functors and natural transformations informally. The next things to learn are limits and colimits, adjunctions, and the Yoneda lemma, since every one of them has a higher version. Good places to start are Tom Leinster's <i>Basic Category Theory</i> and Emily Riehl's <i>Category Theory in Context</i>, both free online.</p><p><b>2. Simplicial sets and homotopy.</b> Here a simplicial set was a picture. Formally it is a functor from the category of finite ordered sets, and the pictures are its non-degenerate simplices. Learn the face and degeneracy maps, geometric realisation, and why Kan complexes model spaces. Greg Friedman's <i>An elementary illustrated introduction to simplicial sets</i> is gentle, and Goerss and Jardine's <i>Simplicial Homotopy Theory</i> is the standard reference.</p><p><b>3. Quasi-categories properly.</b> Now redo what you did here in general: mapping spaces, the homotopy category, equivalences, Joyal's lifting theorem, and the fibrations (inner, left and right, Kan, isofibrations). Charles Rezk's notes <i>Introduction to quasicategories</i> and Markus Land's <i>Introduction to Infinity-Categories</i> are written for a first pass. Denis-Charles Cisinski's <i>Higher Categories and Homotopical Algebra</i> goes further.</p><p><b>4. The theory itself.</b> Limits and colimits in an ∞-category, adjunctions, straightening and unstraightening (which turns the left fibrations you met into functors to spaces), presentable and stable ∞-categories. Jacob Lurie's <i>Higher Topos Theory</i> and <i>Higher Algebra</i> are the main sources, and Riehl and Verity's <i>Elements of ∞-Category Theory</i> develops the same material in a way that does not depend on the model.</p><p>A practical suggestion: when a proof in one of these books says a map is inner anodyne, or that some horn can be filled, try drawing the picture and filling it by hand.</p>`
  }
};
