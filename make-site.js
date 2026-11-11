// Builds everything needed to upload: ./site (the files to drag into a host)
// and ./hornfiller.zip (the same files, with index.html at the top, for itch.io).
// usage: node make-site.js
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const FILES = ['index.html', 'style.css', 'components.css', 'engine.js', 'levels.js', 'copy.js', 'text.js', 'tetra3d.js', 'notesview.js', 'ui.js'];
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

/* ---- a small zip writer, so the upload package needs no tools ---- */
let CRC_TABLE = null;
function crc32(buf) {
  if (typeof zlib.crc32 === 'function') return zlib.crc32(buf) >>> 0;
  if (!CRC_TABLE) {
    CRC_TABLE = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      CRC_TABLE[n] = c;
    }
  }
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = (c >>> 8) ^ CRC_TABLE[(c ^ buf[i]) & 0xff];
  return (c ^ -1) >>> 0;
}
function dosTime(d) {
  return {
    time: ((d.getHours() & 31) << 11) | ((d.getMinutes() & 63) << 5) | ((d.getSeconds() / 2) & 31),
    date: (((d.getFullYear() - 1980) & 127) << 9) | (((d.getMonth() + 1) & 15) << 5) | (d.getDate() & 31)
  };
}
function writeZip(zipPath, entries) {
  const now = dosTime(new Date());
  const locals = [], centrals = [];
  let offset = 0;
  for (const e of entries) {
    const name = Buffer.from(e.name, 'utf8');
    const raw = e.data;
    const deflated = zlib.deflateRawSync(raw, { level: 9 });
    const useDeflate = deflated.length < raw.length;
    const body = useDeflate ? deflated : raw;
    const crc = crc32(raw);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);            // version needed
    local.writeUInt16LE(0, 6);             // flags
    local.writeUInt16LE(useDeflate ? 8 : 0, 8);
    local.writeUInt16LE(now.time, 10);
    local.writeUInt16LE(now.date, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(body.length, 18);
    local.writeUInt32LE(raw.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);
    locals.push(local, name, body);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);          // version made by
    central.writeUInt16LE(20, 6);          // version needed
    central.writeUInt16LE(0, 8);
    central.writeUInt16LE(useDeflate ? 8 : 0, 10);
    central.writeUInt16LE(now.time, 12);
    central.writeUInt16LE(now.date, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(body.length, 20);
    central.writeUInt32LE(raw.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt16LE(0, 30);          // extra
    central.writeUInt16LE(0, 32);          // comment
    central.writeUInt16LE(0, 34);          // disk
    central.writeUInt16LE(0, 36);          // internal attrs
    central.writeUInt32LE(0, 38);          // external attrs
    central.writeUInt32LE(offset, 42);
    centrals.push(central, name);
    offset += local.length + name.length + body.length;
  }
  const cd = Buffer.concat(centrals);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(cd.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);
  fs.writeFileSync(zipPath, Buffer.concat([Buffer.concat(locals), cd, eocd]));
}

const zipEntries = FILES.concat('.nojekyll').map(f => ({ name: f, data: fs.readFileSync(path.join(out, f)) }));
const zipPath = path.join(__dirname, 'hornfiller.zip');
writeZip(zipPath, zipEntries);

console.log('site/         ' + FILES.length + ' files + .nojekyll, ' + Math.round(total / 1024) + ' KB');
console.log('hornfiller.zip ' + Math.round(fs.statSync(zipPath).size / 1024) + ' KB, index.html at the top');
