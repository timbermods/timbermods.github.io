/*
 * Download-latest buttons + theme toggle.
 *
 * Each .card carries data-repo ("owner/name") and data-asset (a regex that picks
 * the mod ZIP out of a release's assets). The buttons resolve in three layers so
 * they are never stale and never broken:
 *   1. data/releases.json, a snapshot refreshed by a scheduled GitHub Action
 *      (same-origin, no rate limit, paints immediately)
 *   2. the live GitHub API, cached for 30 minutes in localStorage
 *   3. the plain HTML link, which opens the repo's Releases page (no JS needed)
 */
(() => {
  'use strict';

  const SNAPSHOT_URL = 'data/releases.json';
  const API = 'https://api.github.com/repos/';
  const CACHE_KEY = 'tbmods.live.v1';
  const CACHE_MS = 30 * 60 * 1000;

  // ---------- theme toggle ----------
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const dark = root.dataset.theme
        ? root.dataset.theme === 'dark'
        : matchMedia('(prefers-color-scheme: dark)').matches;
      const next = dark ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('tbmods.theme', next); } catch (e) { /* storage blocked: fine */ }
    });
  }

  // ---------- helpers ----------
  const cards = [...document.querySelectorAll('.card[data-repo]')];

  const readCache = () => {
    try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || { repos: {} }; }
    catch (e) { return { repos: {} }; }
  };
  const writeCache = (cache) => {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch (e) { /* ignore */ }
  };

  const formatSize = (bytes) => bytes >= 1048576
    ? (bytes / 1048576).toFixed(1) + ' MB'
    : Math.max(1, Math.round(bytes / 1024)) + ' KB';

  const formatDate = (iso) => new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

  const versionLabel = (tag) => (/^\d/.test(tag) ? 'v' + tag : tag);

  // Same shape as data/releases.json entries.
  const normalize = (r) => ({
    tag: r.tag_name,
    name: r.name || r.tag_name,
    prerelease: !!r.prerelease,
    draft: !!r.draft,
    published: r.published_at,
    url: r.html_url,
    assets: (r.assets || []).map((a) => ({ name: a.name, size: a.size, url: a.browser_download_url })),
  });

  // The mod ZIP: the card's pattern first, else any ZIP that isn't a source/preset bundle.
  const pickAsset = (release, pattern) => {
    const zips = (release.assets || []).filter((a) => /\.zip$/i.test(a.name));
    return zips.find((a) => pattern.test(a.name)) || zips.find((a) => !/source|preset/i.test(a.name)) || null;
  };

  // ---------- rendering ----------
  function render(card, releases) {
    const pattern = new RegExp(card.dataset.asset || '\\.zip$', 'i');
    const usable = releases
      .filter((r) => !r.draft)
      .map((release) => ({ release, asset: pickAsset(release, pattern) }))
      .filter((x) => x.asset);
    if (!usable.length) return; // leave the plain "Releases page" link in place

    const newest = usable[0]; // GitHub returns newest first
    const stable = usable.find((x) => !x.release.prerelease);
    const primary = stable || newest; // default to stable; fall back to a preview if that's all there is

    const btn = card.querySelector('[data-download]');
    btn.href = primary.asset.url;
    btn.querySelector('.btn-label').textContent = 'Download ' + versionLabel(primary.release.tag);
    btn.querySelector('[data-size]').textContent = formatSize(primary.asset.size);
    btn.setAttribute('aria-label', 'Download ' + card.querySelector('h3').textContent + ' ' + versionLabel(primary.release.tag) + ', ' + formatSize(primary.asset.size) + ' ZIP');

    const notes = card.querySelector('[data-notes]');
    if (notes) notes.href = primary.release.url;

    const pill = card.querySelector('[data-status]');
    if (pill) {
      pill.textContent = primary.release.prerelease ? 'Preview' : 'Stable';
      pill.dataset.kind = primary.release.prerelease ? 'preview' : 'stable';
      pill.hidden = false;
    }

    const note = card.querySelector('[data-note]');
    if (note) {
      note.replaceChildren(document.createTextNode('Released ' + formatDate(primary.release.published)));
      if (newest !== primary) {
        const link = document.createElement('a');
        link.href = newest.release.url;
        link.rel = 'noopener';
        link.textContent = versionLabel(newest.release.tag);
        note.append(document.createTextNode(' · Newer preview: '), link);
      }
    }
  }

  // ---------- data loading ----------
  async function init() {
    if (!cards.length) return;
    const stamp = document.querySelector('[data-generated]');

    // 1. snapshot
    let snapshot = null;
    try {
      const res = await fetch(SNAPSHOT_URL, { cache: 'no-cache' });
      if (res.ok) snapshot = await res.json();
    } catch (e) { /* offline or file:// preview: fall through */ }
    const snapshotAt = snapshot ? Date.parse(snapshot.generated) || 0 : 0;
    if (snapshot) {
      cards.forEach((card) => { const rs = snapshot.repos && snapshot.repos[card.dataset.repo]; if (rs) render(card, rs); });
      if (stamp && snapshotAt) stamp.textContent = 'Release data as of ' + formatDate(snapshot.generated) + '.';
    }

    // 2. live API (cached), best effort
    const cache = readCache();
    let live = 0;
    await Promise.all(cards.map(async (card) => {
      const repo = card.dataset.repo;
      const hit = cache.repos[repo];
      if (hit && hit.at > snapshotAt && Date.now() - hit.at < CACHE_MS) { render(card, hit.releases); live++; return; }
      try {
        const res = await fetch(API + repo + '/releases?per_page=12', { headers: { Accept: 'application/vnd.github+json' } });
        if (!res.ok) return; // rate-limited (403/429) or unavailable: keep the snapshot
        const releases = (await res.json()).map(normalize);
        cache.repos[repo] = { at: Date.now(), releases };
        render(card, releases);
        live++;
      } catch (e) { /* network error: keep snapshot */ }
    }));
    writeCache(cache);
    if (stamp && live === cards.length) stamp.textContent = 'Latest releases checked live from GitHub.';
  }

  init();
})();
