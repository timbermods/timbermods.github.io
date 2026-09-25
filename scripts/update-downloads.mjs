#!/usr/bin/env node
/*
 * Keeps the copies of each mod's ZIP that the "Download several at once" picker joins in the browser.
 *
 *   node scripts/update-downloads.mjs <folder>
 *
 * <folder> holds the current copies (the `downloads` branch; empty on the first run). For every mod panel in
 * index.html (id, data-repo, data-asset, name, --c colour, "Requires"), it picks the release that panel's
 * Download button offers, from data/releases.json, by the same rule as assets/site.js. A mod whose release
 * changed is downloaded, rewritten into the plain form assets/zipmerge.js joins (scripts/downloads-lib.mjs),
 * and saved as <id>-<tag>.zip. It then writes manifest.json, listing each mod with its version, folder, file,
 * size and SHA-256, in page order.
 *
 * Files from the previous manifest are kept one more round, so a browser holding a cached manifest (GitHub's
 * raw files cache for five minutes) still finds its files. When nothing changed it writes nothing. Under GitHub
 * Actions it sets the step output changed=true|false, and .github/workflows/refresh-downloads.yml publishes the
 * folder as the `downloads` branch (one fresh commit each time, so the branch never grows).
 */
import { createHash } from 'node:crypto';
import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalZip, pickRelease, versionLabel } from './downloads-lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.resolve(process.argv[2] || 'downloads');
mkdirSync(out, { recursive: true });

const decode = (s) => s.replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const text = (s) => decode(s.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();

// The mod panels, in page order.
const html = readFileSync(path.join(root, 'index.html'), 'utf8');
const mods = [...html.matchAll(/<article\b([^>]*)>([\s\S]*?)<\/article>/g)]
  .filter(([, attrs]) => /\bdata-repo=/.test(attrs))
  .map(([, attrs, body]) => {
    const attr = (k) => { const m = new RegExp(`\\b${k}="([^"]*)"`).exec(attrs); return m ? decode(m[1]) : ''; };
    const req = /<p class="req">([\s\S]*?)<\/p>/.exec(body);
    return {
      id: attr('id'),
      repo: attr('data-repo'),
      pattern: new RegExp(attr('data-asset') || '\\.zip$', 'i'),
      name: text((/<h3\b[^>]*>([\s\S]*?)<\/h3>/.exec(body) || [])[1] || ''),
      color: (/--c:\s*(#[0-9a-fA-F]{3,8})/.exec(attr('style')) || [])[1] || '',
      requires: req ? text(req[1]).replace(/^Requires\s*/, '') : '',
    };
  });
if (!mods.length) throw new Error('No mod panels (data-repo) found in index.html');

const snapshot = JSON.parse(readFileSync(path.join(root, 'data', 'releases.json'), 'utf8'));
const manifestFile = path.join(out, 'manifest.json');
const previous = existsSync(manifestFile) ? JSON.parse(readFileSync(manifestFile, 'utf8')) : { mods: [] };
const before = new Map(previous.mods.map((m) => [m.id, m]));

const headers = { 'User-Agent': 'timberborn-mods-catalog' };
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
if (token) headers.Authorization = `Bearer ${token}`;

const entries = [];
for (const mod of mods) {
  const picked = pickRelease({ releases: snapshot.repos?.[mod.repo], latest: snapshot.latest?.[mod.repo] }, mod.pattern);
  if (!picked) { console.log(`${mod.id}: no release with a mod ZIP; left out`); continue; }
  const { release, asset } = picked;
  const file = `${mod.id}-${release.tag.replace(/[^\w.-]/g, '_')}.zip`;
  const old = before.get(mod.id);
  let copy;
  if (old && old.source === asset.url && old.sourceSize === asset.size && existsSync(path.join(out, old.file))) {
    copy = { file: old.file, folder: old.folder, size: old.size, sha256: old.sha256 };
  } else {
    const res = await fetch(asset.url, { headers });
    if (!res.ok) throw new Error(`${mod.id}: HTTP ${res.status} for ${asset.url}`);
    let canon;
    try { canon = canonicalZip(Buffer.from(await res.arrayBuffer())); }
    catch (e) { throw new Error(`${mod.id} ${release.tag} (${asset.name}): ${e.message}`); }
    writeFileSync(path.join(out, file), canon.bytes);
    copy = { file, folder: canon.folder, size: canon.bytes.length, sha256: createHash('sha256').update(canon.bytes).digest('hex') };
    console.log(`${mod.id}: ${release.tag}, ${canon.files} files in ${canon.folder}/, ${copy.size} bytes`);
  }
  entries.push({
    id: mod.id, name: mod.name, color: mod.color, requires: mod.requires, repo: mod.repo,
    tag: release.tag, version: versionLabel(release.tag), prerelease: !!release.prerelease, published: release.published,
    notes: release.url, source: asset.url, sourceSize: asset.size, ...copy,
  });
}

// Extracting the joined ZIP must give one folder per mod: two mods may never share one.
const folders = new Map();
for (const e of entries) {
  if (folders.has(e.folder)) throw new Error(`${e.id} and ${folders.get(e.folder)} both unpack to ${e.folder}/`);
  folders.set(e.folder, e.id);
}

const changed = JSON.stringify(entries) !== JSON.stringify(previous.mods);
if (changed) {
  const keep = new Set(['manifest.json', ...entries.map((e) => e.file), ...previous.mods.map((m) => m.file)]);
  for (const f of readdirSync(out)) if (!keep.has(f) && f !== '.git') rmSync(path.join(out, f), { recursive: true, force: true });
  writeFileSync(manifestFile, JSON.stringify({ generated: new Date().toISOString(), mods: entries }, null, 2) + '\n');
  console.log(`Wrote ${manifestFile} (${entries.length} mods)`);
} else {
  console.log('No changes; the copies are current.');
}
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed}\n`);
