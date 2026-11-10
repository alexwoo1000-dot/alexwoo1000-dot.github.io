// Copies the files the game needs into ./site, ready to upload anywhere that serves static files.
// usage: node make-site.js
const fs = require('fs'), path = require('path');
const FILES = ['index.html', 'style.css', 'components.css', 'engine.js', 'levels.js', 'text.js', 'tetra3d.js', 'notesview.js', 'ui.js'];
const out = path.join(__dirname, 'site');
fs.mkdirSync(out, { recursive: true });
let total = 0;
for (const f of FILES) {
  const src = path.join(__dirname, f);
  if (!fs.existsSync(src)) throw new Error('missing ' + f);
  fs.copyFileSync(src, path.join(out, f));
  total += fs.statSync(src).size;
}
// GitHub Pages: do not run the files through Jekyll
fs.writeFileSync(path.join(out, '.nojekyll'), '');
console.log('site/ is ready: ' + FILES.length + ' files, ' + Math.round(total / 1024) + ' KB');
