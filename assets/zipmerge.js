/*
 * Joins mod ZIPs into one without unpacking them: each part's file records are copied byte for byte and a new
 * central directory is written after them. The parts are the hub's own copies of each mod's release ZIP, which
 * scripts/downloads-lib.mjs rewrites into a plain form (no data descriptors, no ZIP64, one top folder per mod),
 * so this stays small. Used by assets/bundle.js in the browser and by scripts/test-site.mjs in Node.
 */
(function (root) {
  'use strict';

  const TABLE = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })();

  function crc32(bytes) {
    let c = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) c = TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  }

  const utf8 = (s) => new TextEncoder().encode(s);
  const view = (bytes) => new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  // The files of a ZIP, from its central directory: [{ name, offset, recordLength, central }], where `central` is
  // the entry's central directory header (a view into `bytes`) and the local record runs recordLength bytes.
  function readEntries(bytes) {
    const v = view(bytes);
    let eocd = -1;
    for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 22 - 65535); i--) {
      if (v.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
    }
    if (eocd < 0) throw new Error('not a ZIP file');
    const count = v.getUint16(eocd + 10, true);
    let p = v.getUint32(eocd + 16, true);
    const entries = [];
    for (let i = 0; i < count; i++) {
      if (v.getUint32(p, true) !== 0x02014b50) throw new Error('damaged ZIP directory');
      const flags = v.getUint16(p + 8, true), csize = v.getUint32(p + 20, true), offset = v.getUint32(p + 42, true);
      const n = v.getUint16(p + 28, true), m = v.getUint16(p + 30, true), k = v.getUint16(p + 32, true);
      if (flags & 8) throw new Error('ZIP data descriptors are not supported');
      if (csize === 0xffffffff || offset === 0xffffffff) throw new Error('ZIP64 is not supported');
      const name = new TextDecoder().decode(bytes.subarray(p + 46, p + 46 + n));
      if (v.getUint32(offset, true) !== 0x04034b50) throw new Error('damaged ZIP record for ' + name);
      const recordLength = 30 + v.getUint16(offset + 26, true) + v.getUint16(offset + 28, true) + csize;
      entries.push({ name, offset, recordLength, central: bytes.subarray(p, p + 46 + n + m + k) });
      p += 46 + n + m + k;
    }
    return entries;
  }

  function dosTime(date) {
    return {
      time: (date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() >> 1),
      date: ((Math.max(1980, date.getFullYear()) - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
    };
  }

  // A file stored uncompressed: its local record and its central directory header (offset filled in later).
  function storedFile(name, data, when) {
    const nameBytes = utf8(name), crc = crc32(data), t = dosTime(when);
    const local = new Uint8Array(30 + nameBytes.length + data.length), lv = view(local);
    lv.setUint32(0, 0x04034b50, true); lv.setUint16(4, 20, true); lv.setUint16(6, 0x0800, true);
    lv.setUint16(10, t.time, true); lv.setUint16(12, t.date, true); lv.setUint32(14, crc, true);
    lv.setUint32(18, data.length, true); lv.setUint32(22, data.length, true); lv.setUint16(26, nameBytes.length, true);
    local.set(nameBytes, 30); local.set(data, 30 + nameBytes.length);
    const central = new Uint8Array(46 + nameBytes.length), cv = view(central);
    cv.setUint32(0, 0x02014b50, true); cv.setUint16(4, 20, true); cv.setUint16(6, 20, true); cv.setUint16(8, 0x0800, true);
    cv.setUint16(12, t.time, true); cv.setUint16(14, t.date, true); cv.setUint32(16, crc, true);
    cv.setUint32(20, data.length, true); cv.setUint32(24, data.length, true); cv.setUint16(28, nameBytes.length, true);
    central.set(nameBytes, 46);
    return { name, local, central };
  }

  // parts: ZIPs as Uint8Arrays. extra: [{ name, text }] added as stored files after them. Returns the joined ZIP.
  // Refuses a file name that two parts share, so no mod can overwrite another's file.
  function merge(parts, extra = [], when = new Date()) {
    const records = [], centrals = [], seen = new Set();
    let offset = 0;
    const add = (name, record, central) => {
      if (seen.has(name)) throw new Error('two of these ZIPs both contain ' + name);
      seen.add(name);
      const c = central.slice();
      view(c).setUint32(42, offset, true);
      records.push(record); centrals.push(c); offset += record.length;
    };
    for (const bytes of parts) {
      for (const e of readEntries(bytes)) add(e.name, bytes.subarray(e.offset, e.offset + e.recordLength), e.central);
    }
    for (const { name, text } of extra) {
      const f = storedFile(name, utf8(text), when);
      add(f.name, f.local, f.central);
    }
    const cdSize = centrals.reduce((n, c) => n + c.length, 0);
    const out = new Uint8Array(offset + cdSize + 22);
    let p = 0;
    for (const r of records) { out.set(r, p); p += r.length; }
    for (const c of centrals) { out.set(c, p); p += c.length; }
    const v = view(out);
    v.setUint32(p, 0x06054b50, true);
    v.setUint16(p + 8, centrals.length, true); v.setUint16(p + 10, centrals.length, true);
    v.setUint32(p + 12, cdSize, true); v.setUint32(p + 16, offset, true);
    return out;
  }

  const api = { crc32, readEntries, merge };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TimbermodsZip = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
