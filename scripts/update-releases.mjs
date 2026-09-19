#!/usr/bin/env node
/*
 * Writes data/releases.json: the release snapshot the site shows first (and falls
 * back to if the live GitHub API is rate-limited).
 *
 * The repos come from the data-repo="owner/name" attributes in index.html, so
 * adding a mod card there is all it takes. Only rewrites the file when the
 * release data actually changed, so a scheduled run does not create empty commits.
 *
 *   node scripts/update-releases.mjs
 *
 * Set GITHUB_TOKEN (Actions provides one) to lift the 60 requests/hour limit.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outFile = path.join(root, 'data', 'releases.json');

const html = await readFile(path.join(root, 'index.html'), 'utf8');
const repos = [...new Set([...html.matchAll(/data-repo="([^"]+)"/g)].map((m) => m[1]))];
if (!repos.length) throw new Error('No data-repo attributes found in index.html');

const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'timberborn-mods-catalog' };
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
if (token) headers.Authorization = `Bearer ${token}`;

const fresh = {};
for (const repo of repos) {
  const res = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=12`, { headers });
  if (!res.ok) throw new Error(`${repo}: HTTP ${res.status} ${await res.text()}`);
  fresh[repo] = (await res.json())
    .filter((r) => !r.draft)
    .map((r) => ({
      tag: r.tag_name,
      name: r.name || r.tag_name,
      prerelease: !!r.prerelease,
      published: r.published_at,
      url: r.html_url,
      assets: (r.assets || []).map((a) => ({ name: a.name, size: a.size, url: a.browser_download_url })),
    }));
  console.log(`${repo}: ${fresh[repo].length} releases, newest ${fresh[repo][0]?.tag ?? 'none'}`);
}

let previous = null;
try { previous = JSON.parse(await readFile(outFile, 'utf8')); } catch { /* first run */ }

if (previous && JSON.stringify(previous.repos) === JSON.stringify(fresh)) {
  console.log('No release changes; data/releases.json left as is.');
} else {
  await mkdir(path.dirname(outFile), { recursive: true });
  await writeFile(outFile, JSON.stringify({ generated: new Date().toISOString(), repos: fresh }, null, 2) + '\n');
  console.log('Wrote data/releases.json');
}
