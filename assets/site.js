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
 *
 * The button offers the release GitHub marks as Latest (the newest one that is not
 * a draft or a pre-release), however many pre-releases came after it, else the
 * newest pre-release. The release list is for the "Newer preview" link, and for
 * data that has no Latest answer (a snapshot or cache written before it was kept).
 * The live check costs two requests per card (the list and /releases/latest), and
 * unauthenticated visitors get 60 an hour, hence the cache; a refused request
 * keeps the snapshot, which records the Latest release too.
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
  // releases: newest first. latest: GitHub's Latest release, null when the repo has
  // none (only pre-releases), undefined when the data predates it being kept.
  function render(card, { releases, latest }) {
    const pattern = new RegExp(card.dataset.asset || '\\.zip$', 'i');
    const usable = (releases || [])
      .filter((r) => !r.draft)
      .map((release) => ({ release, asset: pickAsset(release, pattern) }))
      .filter((x) => x.asset);
    const latestAsset = latest && !latest.draft ? pickAsset(latest, pattern) : null;

    // GitHub's Latest; if it is unknown or has no mod ZIP, the newest stable release
    // in the list; if there is none, the newest pre-release.
    const primary = (latestAsset && { release: latest, asset: latestAsset })
      || usable.find((x) => !x.release.prerelease)
      || usable[0];
    if (!primary) return; // leave the plain "Releases page" link in place

    // A pre-release published after the offered release gets a small link.
    const newest = usable[0]; // GitHub returns newest first
    const newer = newest && newest.release.prerelease && newest.release.tag !== primary.release.tag
      && Date.parse(newest.release.published) > Date.parse(primary.release.published) ? newest : null;

    const btn = card.querySelector('[data-download]');
    btn.href = primary.asset.url;
    btn.querySelector('.btn-label').textContent = 'Download ' + versionLabel(primary.release.tag);
    btn.querySelector('[data-size]').textContent = formatSize(primary.asset.size);
    // the name starts with the button's visible text, then says which mod (WCAG 2.5.3, label in name)
    btn.setAttribute('aria-label', 'Download ' + versionLabel(primary.release.tag) + ', ' + formatSize(primary.asset.size) + ' ZIP, ' + card.querySelector('h3').textContent);

    const notes = card.querySelector('[data-notes]');
    if (notes) notes.href = primary.release.url;

    const pill = card.querySelector('[data-status]');
    if (pill) {
      // A pre-release is a Preview. A stable release of a mod whose card still has a
      // caution says the card's data-maturity (the caution's label) instead of Stable.
      const label = primary.release.prerelease ? 'Preview' : card.dataset.maturity || 'Stable';
      pill.textContent = label;
      pill.dataset.kind = label === 'Stable' ? 'stable' : 'preview';
      pill.hidden = false;
    }

    const note = card.querySelector('[data-note]');
    if (note) {
      note.replaceChildren(document.createTextNode('Released ' + formatDate(primary.release.published)));
      if (newer) {
        const link = document.createElement('a');
        link.href = newer.release.url;
        link.rel = 'noopener';
        link.textContent = versionLabel(newer.release.tag);
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
      cards.forEach((card) => {
        const repo = card.dataset.repo;
        const releases = snapshot.repos && snapshot.repos[repo];
        // Snapshots written before `latest` was added have none: render picks from the list.
        if (releases) render(card, { releases, latest: snapshot.latest ? snapshot.latest[repo] : undefined });
      });
      // `generated` moves only when the release data changes, not on every scheduled check.
      if (stamp && snapshotAt) stamp.textContent = 'Release data last changed ' + formatDate(snapshot.generated) + '.';
    }

    // 2. live API (cached), best effort
    const cache = readCache();
    let live = 0;
    await Promise.all(cards.map(async (card) => {
      const repo = card.dataset.repo;
      const hit = cache.repos[repo];
      // Entries cached before `latest` was kept (it is null or a release now) are fetched again.
      if (hit && hit.latest !== undefined && hit.at > snapshotAt && Date.now() - hit.at < CACHE_MS) { render(card, hit); live++; return; }
      try {
        const get = (path) => fetch(API + repo + path, { headers: { Accept: 'application/vnd.github+json' } });
        const [list, latest] = await Promise.all([get('/releases?per_page=12'), get('/releases/latest')]);
        // Rate-limited (403/429) or unavailable: keep the snapshot. /releases/latest
        // answers 404 when every release is a pre-release.
        if (!list.ok || !(latest.ok || latest.status === 404)) return;
        const entry = { at: Date.now(), releases: (await list.json()).map(normalize), latest: latest.ok ? normalize(await latest.json()) : null };
        cache.repos[repo] = entry;
        render(card, entry);
        live++;
      } catch (e) { /* network error: keep snapshot */ }
    }));
    writeCache(cache);
    if (stamp && live === cards.length) stamp.textContent = 'Latest releases checked live from GitHub.';
  }

  init();
})();
