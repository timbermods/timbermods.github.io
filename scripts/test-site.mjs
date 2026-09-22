#!/usr/bin/env node
/*
 * Offline checks for the catalog's download buttons. No network and no dependencies:
 *   - assets/site.js runs in a vm against a stub DOM, a stub localStorage and a fetch
 *     that answers like GitHub's API (fakeGitHub below);
 *   - scripts/update-releases.mjs runs in a scratch folder with the same fake fetch.
 *
 *   node scripts/test-site.mjs [repo root]      (default: this checkout)
 *
 * Prints one line per check and exits 1 if any check fails.
 */
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import vm from 'node:vm';

const root = path.resolve(process.argv[2] || path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));
const siteJs = readFileSync(path.join(root, 'assets', 'site.js'), 'utf8');

// ---------- fake GitHub ----------

// A release as GitHub's API returns it.
function release(repo, tag, { prerelease = false, published = '2026-09-01T00:00:00Z', zip = true } = {}) {
  const base = `https://github.com/${repo}/releases`;
  return {
    tag_name: tag, name: tag, draft: false, prerelease, published_at: published, html_url: `${base}/tag/${tag}`,
    assets: zip ? [{ name: `Mod-${tag}.zip`, size: 2048, browser_download_url: `${base}/download/${tag}/Mod-${tag}.zip` }] : [],
  };
}

// `count` pre-releases, newest first (v2.0.0-beta<count> down to beta1), all newer than 2026-09-01.
const previews = (repo, count) => Array.from({ length: count }, (_, i) => count - i).map((n) =>
  release(repo, `v2.0.0-beta${n}`, { prerelease: true, published: `2026-09-${String(10 + n).padStart(2, '0')}T00:00:00Z` }));

// The same release as data/releases.json stores it.
const entry = (r) => ({
  tag: r.tag_name, name: r.name, prerelease: r.prerelease, published: r.published_at, url: r.html_url,
  assets: r.assets.map((a) => ({ name: a.name, size: a.size, url: a.browser_download_url })),
});

// A fetch that answers like api.github.com for the repos in `github`: { 'owner/name': { list, latest } },
// `list` newest first. /releases?per_page=N returns the first N; /releases/latest returns `latest` when it
// is given (null means 404), else what GitHub picks: the newest release that is not a draft or pre-release.
// `snapshot` is served as data/releases.json, and `limited` answers 403 to every API call.
// Keep it self-contained: runUpdate passes it by source to the process that runs update-releases.mjs.
function fakeGitHub({ github = {}, snapshot = null, limited = false }, log = []) {
  return async (url) => {
    log.push(String(url));
    const reply = (status, body) => ({ ok: status === 200, status, json: async () => JSON.parse(JSON.stringify(body)), text: async () => JSON.stringify(body) });
    if (url === 'data/releases.json') return snapshot ? reply(200, snapshot) : reply(404, {});
    const m = /^https:\/\/api\.github\.com\/repos\/([\w.-]+\/[\w.-]+)\/releases(\/latest)?(?:\?per_page=(\d+))?$/.exec(url);
    const repo = m && github[m[1]];
    if (!repo) return reply(404, { message: 'Not Found' });
    if (limited) return reply(403, { message: 'API rate limit exceeded' });
    if (!m[2]) return reply(200, repo.list.slice(0, Number(m[3] || 30)));
    const latest = 'latest' in repo ? repo.latest : repo.list.find((r) => !r.draft && !r.prerelease) || null;
    return latest ? reply(200, latest) : reply(404, { message: 'Not Found' });
  };
}

// ---------- assets/site.js in a stub DOM ----------

const unsupported = (selector) => { throw new Error('the stub DOM has no ' + selector); };

function el(text = '') {
  return {
    textContent: text, href: '', rel: '', hidden: true, dataset: {}, children: [],
    setAttribute(k, v) { this[k] = String(v); },
    replaceChildren(...nodes) { this.children = nodes; },
    append(...nodes) { this.children.push(...nodes); },
  };
}

// A .card with the parts site.js fills in; `data` is its dataset. `shown` is what a visitor sees.
function makeCard({ title = 'Mod', ...data } = {}) {
  const label = el('Download latest'), size = el(), btn = el(), notes = el(), pill = el(), note = el();
  btn.querySelector = (s) => ({ '.btn-label': label, '[data-size]': size })[s] || unsupported(s);
  const parts = { '[data-download]': btn, '[data-notes]': notes, '[data-status]': pill, '[data-note]': note, h3: el(title) };
  return {
    dataset: { repo: 'o/r', asset: '^Mod-[\\w.-]+\\.zip$', ...data },
    querySelector: (s) => parts[s] || unsupported(s),
    get shown() {
      return {
        button: label.textContent, href: btn.href, notes: notes.href,
        pill: pill.hidden ? '' : pill.textContent, kind: pill.dataset.kind,
        note: note.children.map((n) => n.textContent).join(''),
      };
    },
  };
}

// The cards in index.html: their data-* attributes (as a dataset), title and cautions, as text.
function pageCards() {
  const html = readFileSync(path.join(root, 'index.html'), 'utf8');
  const decode = (s) => s.replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  const text = (s) => decode(s.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();
  const caution = /<p\b[^>]*\bclass="(?:[^"]*\s)?caution(?:\s[^"]*)?"[^>]*>([\s\S]*?)<\/p>/g;
  const cards = [...html.matchAll(/<article\b([^>]*)>([\s\S]*?)<\/article>/g)]
    .filter(([, attrs]) => /\bdata-repo=/.test(attrs))
    .map(([, attrs, body]) => ({
      data: Object.fromEntries([...attrs.matchAll(/\bdata-([\w-]+)="([^"]*)"/g)]
        .map(([, k, v]) => [k.replace(/-([a-z])/g, (_, c) => c.toUpperCase()), decode(v)])),
      title: text((/<h3\b[^>]*>([\s\S]*?)<\/h3>/.exec(body) || [])[1] || ''),
      cautions: [...body.matchAll(caution)].map(([, inner]) => text(inner)),
    }));
  // Guard the parsing itself: every data-repo and every caution on the page must be accounted for.
  const repos = (html.match(/\bdata-repo="/g) || []).length;
  const cautions = [...html.matchAll(caution)].length;
  if (!cards.length || cards.length !== repos) throw new Error(`read ${cards.length} cards out of index.html, which has ${repos} data-repo attributes`);
  if (cards.reduce((n, c) => n + c.cautions.length, 0) !== cautions) throw new Error(`index.html has ${cautions} cautions, but not all of them are inside a card`);
  return cards;
}

// Runs assets/site.js once over `cards`; resolves once its async work has settled.
async function runSite(cards, answers, { storage = new Map(), log = [] } = {}) {
  const stamp = el('Release data loads from GitHub.');
  const document = {
    documentElement: { dataset: {} },
    querySelector: (s) => (s === '[data-generated]' ? stamp : null),
    querySelectorAll: (s) => (s === '.card[data-repo]' ? cards : []),
    createElement: () => el(),
    createTextNode: (t) => ({ textContent: t }),
  };
  const localStorage = {
    getItem: (k) => (storage.has(k) ? storage.get(k) : null),
    setItem: (k, v) => { storage.set(k, String(v)); },
    removeItem: (k) => { storage.delete(k); },
  };
  const errors = [];
  const onError = (e) => errors.push(e);
  process.on('unhandledRejection', onError);
  try {
    vm.runInNewContext(siteJs, { document, fetch: fakeGitHub(answers, log), localStorage, matchMedia: () => ({ matches: false }), console });
    await new Promise((r) => setTimeout(r, 20)); // every fake answer is already settled
  } finally {
    process.off('unhandledRejection', onError);
  }
  if (errors.length) throw errors[0];
  return { stamp: stamp.textContent, log };
}

// ---------- scripts/update-releases.mjs in a scratch folder ----------

// Calls fn with a scratch folder and removes the folder afterwards.
async function inScratch(fn) {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'tbmods-test-'));
  try { return await fn(dir); } finally { rmSync(dir, { recursive: true, force: true }); }
}

// Runs a copy of update-releases.mjs in `dir`, with an index.html that lists `repos` and GitHub answered by
// fakeGitHub(answers). Returns the data/releases.json it leaves; run it again in the same dir to update that.
function runUpdate(dir, answers, repos) {
  mkdirSync(path.join(dir, 'scripts'), { recursive: true });
  copyFileSync(path.join(root, 'scripts', 'update-releases.mjs'), path.join(dir, 'scripts', 'update-releases.mjs'));
  writeFileSync(path.join(dir, 'index.html'), repos.map((r) => `<article class="card" data-repo="${r}"></article>\n`).join(''));
  writeFileSync(path.join(dir, 'answers.json'), JSON.stringify(answers));
  writeFileSync(path.join(dir, 'fake-fetch.mjs'),
    `import { readFileSync } from 'node:fs';\n` +
    `globalThis.fetch = (${fakeGitHub})(JSON.parse(readFileSync(${JSON.stringify(path.join(dir, 'answers.json'))}, 'utf8')));\n`);
  const env = { ...process.env };
  delete env.GITHUB_TOKEN;
  delete env.GH_TOKEN;
  try {
    execFileSync(process.execPath, ['--import', pathToFileURL(path.join(dir, 'fake-fetch.mjs')).href, path.join(dir, 'scripts', 'update-releases.mjs')], { env, stdio: 'pipe' });
  } catch (e) {
    throw new Error('update-releases.mjs failed: ' + String(e.stderr || e.message).trim());
  }
  return JSON.parse(readFileSync(path.join(dir, 'data', 'releases.json'), 'utf8'));
}

// ---------- checks ----------

let failed = 0;
let passed = 0;
async function check(name, fn) {
  try {
    await fn();
    passed++;
    console.log('ok   ' + name);
  } catch (e) {
    failed++;
    console.log('FAIL ' + name + '\n       ' + (e && e.message ? e.message : e));
  }
}
function same(actual, expected, what) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`${what}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}
function has(text, part, what) {
  if (!String(text).includes(part)) throw new Error(`${what}: expected it to contain ${JSON.stringify(part)}, got ${JSON.stringify(text)}`);
}
function lacks(text, part, what) {
  if (String(text).includes(part)) throw new Error(`${what}: expected no ${JSON.stringify(part)}, got ${JSON.stringify(text)}`);
}

const R = 'o/r';
const stable = release(R, 'v1.0.0');
const behind13 = [...previews(R, 13), stable]; // what GitHub lists, newest first; per_page=12 stops short of v1.0.0

// CAT1: stable used to be picked from the newest 12 releases only, so a run of pre-releases hid it.
await check('offers GitHub\'s Latest release behind 13 newer pre-releases', async () => {
  const card = makeCard();
  await runSite([card], { github: { [R]: { list: behind13 } } });
  same([card.shown.button, card.shown.pill], ['Download v1.0.0', 'Stable'], 'button and pill');
  same(card.shown.href, stable.assets[0].browser_download_url, 'download link');
  has(card.shown.note, 'Newer preview: v2.0.0-beta13', 'note under the button');
});

await check('offers the newest pre-release, marked Preview, when there is no Latest release', async () => {
  const card = makeCard();
  await runSite([card], { github: { [R]: { list: previews(R, 13) } } });
  same([card.shown.button, card.shown.pill, card.shown.kind], ['Download v2.0.0-beta13', 'Preview', 'preview'], 'button and pill');
  lacks(card.shown.note, 'Newer preview', 'note under the button');
});

await check('honours an older release marked Latest by hand', async () => {
  const card = makeCard();
  const newer = release(R, 'v1.1.0', { published: '2026-09-05T00:00:00Z' });
  await runSite([card], { github: { [R]: { list: [newer, stable], latest: stable } } });
  same(card.shown.button, 'Download v1.0.0', 'button');
  lacks(card.shown.note, 'Newer', 'note under the button');
});

await check('falls back to the newest stable release in the list when Latest has no mod ZIP', async () => {
  const card = makeCard();
  const bare = release(R, 'v1.1.0', { published: '2026-09-05T00:00:00Z', zip: false });
  await runSite([card], { github: { [R]: { list: [...previews(R, 2), bare, stable] } } });
  same([card.shown.button, card.shown.pill], ['Download v1.0.0', 'Stable'], 'button and pill');
});

await check('rate-limited: offers the snapshot\'s Latest release even when its list holds only pre-releases', async () => {
  const card = makeCard();
  const snapshot = { generated: '2026-09-22T07:00:00.000Z', repos: { [R]: behind13.slice(0, 12).map(entry) }, latest: { [R]: entry(stable) } };
  await runSite([card], { snapshot, limited: true, github: { [R]: { list: [] } } });
  same([card.shown.button, card.shown.pill], ['Download v1.0.0', 'Stable'], 'button and pill');
  has(card.shown.note, 'Newer preview: v2.0.0-beta13', 'note under the button');
});

await check('rate-limited: a snapshot without a latest field (the old format) still offers its newest stable release', async () => {
  const card = makeCard();
  const snapshot = { generated: '2026-09-22T07:00:00.000Z', repos: { [R]: [...previews(R, 3), stable].map(entry) } };
  await runSite([card], { snapshot, limited: true, github: { [R]: { list: [] } } });
  same([card.shown.button, card.shown.pill], ['Download v1.0.0', 'Stable'], 'button and pill');
  has(card.shown.note, 'Newer preview: v2.0.0-beta3', 'note under the button');
});

await check('makes at most two GitHub requests per card, and none again within 30 minutes', async () => {
  const cards = ['o/a', 'o/b', 'o/c'].map((repo) => makeCard({ repo }));
  const github = Object.fromEntries(cards.map((c) => [c.dataset.repo, { list: [...previews(c.dataset.repo, 2), release(c.dataset.repo, 'v1.0.0')] }]));
  const storage = new Map();
  const first = [], second = [];
  await runSite(cards, { github }, { storage, log: first });
  const api = (log) => log.filter((u) => u.startsWith('https://api.github.com/')).length;
  if (api(first) > 2 * cards.length) throw new Error(`first visit made ${api(first)} GitHub requests for ${cards.length} cards`);
  cards.forEach((c) => same(c.shown.button, 'Download v1.0.0', c.dataset.repo + ' button'));
  const again = cards.map((c) => makeCard({ repo: c.dataset.repo }));
  await runSite(again, { github }, { storage, log: second });
  same(api(second), 0, 'GitHub requests on a second visit');
  again.forEach((c) => same(c.shown.button, 'Download v1.0.0', c.dataset.repo + ' button from the cache'));
});

await check('fetches again over a cached entry from before Latest was kept', async () => {
  const card = makeCard();
  const log = [];
  const old = { repos: { [R]: { at: Date.now(), releases: behind13.slice(0, 12).map((r) => ({ ...entry(r), draft: false })) } } };
  await runSite([card], { github: { [R]: { list: behind13 } } }, { storage: new Map([['tbmods.live.v1', JSON.stringify(old)]]), log });
  same(card.shown.button, 'Download v1.0.0', 'button');
  if (!log.some((u) => u.endsWith('/releases/latest'))) throw new Error('it rendered the old cache entry without asking GitHub for the Latest release');
});

await check('update-releases.mjs records GitHub\'s Latest release per repo, null when there is none', async () => {
  await inScratch((dir) => {
    const data = runUpdate(dir, { github: { [R]: { list: behind13 }, 'o/none': { list: previews('o/none', 2) } } }, [R, 'o/none']);
    same(data.repos[R], behind13.slice(0, 12).map(entry), 'o/r release list');
    same(data.latest && data.latest[R], entry(stable), 'latest for o/r');
    same(data.latest && data.latest['o/none'], null, 'latest for o/none');
    // A snapshot in the old format, with the same lists, is rewritten once to add `latest`.
    writeFileSync(path.join(dir, 'data', 'releases.json'), JSON.stringify({ generated: '2026-09-01T00:00:00.000Z', repos: data.repos }));
    const again = runUpdate(dir, { github: { [R]: { list: behind13 }, 'o/none': { list: previews('o/none', 2) } } }, [R, 'o/none']);
    same(again.latest, data.latest, 'latest after rewriting an old-format snapshot');
  });
});

// CAT2: a card's caution ("Preview: …", "Beta: …") used to sit next to a green Stable pill whenever
// the mod's offered release was not a pre-release. A card with a caution now carries data-maturity.
await check('no card in index.html shows a Stable pill next to a caution', async () => {
  const page = pageCards();
  const problems = [];
  for (const offered of ['a stable release', 'only pre-releases']) {
    const cards = page.map(({ data, title }) => makeCard({ ...data, title }));
    const github = Object.fromEntries(cards.map(({ dataset: { repo } }) =>
      [repo, { list: offered === 'a stable release' ? [...previews(repo, 1), release(repo, 'v1.0.0')] : previews(repo, 2) }]));
    await runSite(cards, { github });
    cards.forEach((card, i) => {
      const { data, cautions } = page[i];
      const { pill, kind } = card.shown;
      // The caution's own label ("Beta" in "Beta: try it on a copy…"), when it starts with one.
      const label = cautions.length ? (/^([A-Z][\w ]{0,20}):/.exec(cautions[0]) || [])[1] : undefined;
      const want = offered === 'only pre-releases' ? 'Preview' : cautions.length ? label : 'Stable';
      if (!pill) problems.push(`${data.repo} with ${offered}: no pill`);
      else if (cautions.length && (pill === 'Stable' || kind === 'stable')) problems.push(`${data.repo} with ${offered}: "${pill}" pill next to "${cautions[0]}"`);
      else if (want && pill !== want) problems.push(`${data.repo} with ${offered}: pill "${pill}", expected "${want}"`);
    });
  }
  if (problems.length) throw new Error(problems.join('\n       '));
});

console.log(`\n${passed}/${passed + failed} checks passed`);
process.exit(failed ? 1 : 0);
