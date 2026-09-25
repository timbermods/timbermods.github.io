/*
 * The parts of scripts/update-downloads.mjs that the tests also use.
 *
 * pickRelease: which release a mod's Download button offers (the same rule as render() in assets/site.js).
 * canonicalZip: a mod's release ZIP rewritten into the plain form assets/zipmerge.js joins: files only, each
 * deflated (or stored when that is smaller), UTF-8 names, no data descriptors, no ZIP64, no extra fields.
 * readZip: every file in a ZIP, unpacked and checked against its CRC.
 */
import zlib from 'node:zlib';

// The mod ZIP: the card's pattern first, else any ZIP that isn't a source/preset bundle (site.js pickAsset).
export function pickAsset(release, pattern) {
  const zips = (release.assets || []).filter((a) => /\.zip$/i.test(a.name));
  return zips.find((a) => pattern.test(a.name)) || zips.find((a) => !/source|preset/i.test(a.name)) || null;
}

// releases: newest first, as in data/releases.json. latest: GitHub's Latest, null when there is none.
// GitHub's Latest; if it is unknown or has no mod ZIP, the newest stable release; else the newest pre-release.
export function pickRelease({ releases, latest }, pattern) {
  const usable = (releases || []).filter((r) => !r.draft)
    .map((release) => ({ release, asset: pickAsset(release, pattern) })).filter((x) => x.asset);
  const latestAsset = latest && !latest.draft ? pickAsset(latest, pattern) : null;
  return (latestAsset && { release: latest, asset: latestAsset })
    || usable.find((x) => !x.release.prerelease)
    || usable[0]
    || null;
}

export const versionLabel = (tag) => (/^\d/.test(tag) ? 'v' + tag : tag);

// Every file in a ZIP (directories left out): [{ name, data, time, date }], each unpacked and CRC-checked.
export function readZip(buf) {
  const b = Buffer.from(buf.buffer ? buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) : buf);
  let eocd = -1;
  for (let i = b.length - 22; i >= Math.max(0, b.length - 22 - 65535); i--) {
    if (b.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('not a ZIP file');
  const count = b.readUInt16LE(eocd + 10);
  let p = b.readUInt32LE(eocd + 16);
  const files = [];
  for (let i = 0; i < count; i++) {
    if (b.readUInt32LE(p) !== 0x02014b50) throw new Error('damaged ZIP directory');
    const flags = b.readUInt16LE(p + 8), method = b.readUInt16LE(p + 10);
    const time = b.readUInt16LE(p + 12), date = b.readUInt16LE(p + 14), crc = b.readUInt32LE(p + 16);
    const csize = b.readUInt32LE(p + 20), usize = b.readUInt32LE(p + 24);
    const n = b.readUInt16LE(p + 28), m = b.readUInt16LE(p + 30), k = b.readUInt16LE(p + 32);
    const offset = b.readUInt32LE(p + 42);
    if (csize === 0xffffffff || usize === 0xffffffff || offset === 0xffffffff) throw new Error('ZIP64 is not supported');
    const name = b.subarray(p + 46, p + 46 + n).toString(flags & 0x0800 ? 'utf8' : 'latin1');
    p += 46 + n + m + k;
    if (name.endsWith('/')) continue; // a directory: implied by its files
    if (flags & 1) throw new Error(`${name} is encrypted`);
    if (b.readUInt32LE(offset) !== 0x04034b50) throw new Error(`damaged ZIP record for ${name}`);
    const start = offset + 30 + b.readUInt16LE(offset + 26) + b.readUInt16LE(offset + 28);
    const raw = b.subarray(start, start + csize);
    const data = method === 0 ? Buffer.from(raw) : method === 8 ? zlib.inflateRawSync(raw) : null;
    if (!data) throw new Error(`${name} uses ZIP method ${method}`);
    if (data.length !== usize || zlib.crc32(data) !== crc) throw new Error(`${name} fails its CRC check`);
    files.push({ name, data, time, date });
  }
  return files;
}

// A mod's ZIP in the plain form, and the one top folder every file sits in. Refuses unsafe paths and ZIPs
// that don't hold exactly one top folder: extracting the joined ZIP into Mods must give one folder per mod.
export function canonicalZip(buf) {
  const files = readZip(buf);
  if (!files.length) throw new Error('the ZIP holds no files');
  const tops = new Set();
  for (const f of files) {
    if (f.name.includes('\\') || f.name.startsWith('/') || f.name.split('/').some((s) => s === '..' || s === '')) {
      throw new Error(`unsafe path in the ZIP: ${f.name}`);
    }
    if (!f.name.includes('/')) throw new Error(`${f.name} is not inside the mod's folder`);
    tops.add(f.name.split('/')[0]);
  }
  if (tops.size !== 1) throw new Error(`the ZIP holds ${tops.size} top folders (${[...tops].join(', ')}), not one`);

  const locals = [], centrals = [];
  let offset = 0;
  for (const f of files) {
    const name = Buffer.from(f.name, 'utf8');
    const deflated = zlib.deflateRawSync(f.data, { level: 9 });
    const stored = deflated.length >= f.data.length;
    const body = stored ? f.data : deflated;
    const crc = zlib.crc32(f.data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(stored ? 0 : 8, 8); local.writeUInt16LE(f.time, 10); local.writeUInt16LE(f.date, 12);
    local.writeUInt32LE(crc, 14); local.writeUInt32LE(body.length, 18); local.writeUInt32LE(f.data.length, 22);
    local.writeUInt16LE(name.length, 26);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0); central.writeUInt16LE(20, 4); central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8); central.writeUInt16LE(stored ? 0 : 8, 10);
    central.writeUInt16LE(f.time, 12); central.writeUInt16LE(f.date, 14); central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(body.length, 20); central.writeUInt32LE(f.data.length, 24); central.writeUInt16LE(name.length, 28);
    central.writeUInt32LE(offset, 42);
    locals.push(local, name, body);
    centrals.push(central, name);
    offset += 30 + name.length + body.length;
  }
  const cd = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(offset, 16);
  return { bytes: Buffer.concat([...locals, cd, end]), folder: [...tops][0], files: files.length };
}
