# Hornfiller

A puzzle game about higher category theory. The only move is to complete a shape that has a side missing,
and every level is a proof about simplicial sets and ∞-categories.

It is a plain static site: no build step, no server code, no accounts. Progress is saved in the player's own
browser.

## Play it locally

Open `index.html` in a browser. (The maths is typeset with KaTeX from a CDN; offline it falls back to plain text.)

## Put it online

Run `node make-site.js`. It copies the nine files the game needs into `site/`. Upload the **contents** of that
folder anywhere that serves static files.

**Neocities.** Sign in, open the dashboard, and drag the nine files from `site/` into the file list. The game
is then at `https://<yourname>.neocities.org/`.

**GitHub Pages.** Create a repository, put the contents of `site/` in it (at the top level, or in a `docs/`
folder), push, then in the repository's Settings → Pages choose the branch and folder. The game is then at
`https://<user>.github.io/<repo>/`.

**itch.io.** Zip the contents of `site/` so that `index.html` is at the top of the zip, create an HTML project,
and upload the zip.

Every path in the game is relative, so it works from any folder or subpath.

## Files

| file | what it is |
|---|---|
| `index.html`, `style.css`, `components.css` | the page |
| `ui.js` | everything on screen |
| `engine.js` | the rules: simplicial sets, horn filling, goals, counterexample checks |
| `levels.js` | the 62 levels with their solutions |
| `text.js` | level text, theory notes, glossary, ending |
| `tetra3d.js`, `notesview.js` | the 3D tetrahedron and the diagrams in the notes |
| `test.js` | `node test.js` replays every solution and searches for shortcuts (about two minutes) |
| `SPEC*.md`, `FARUM_CATALOGUE.md` | design notes; not needed to play |
