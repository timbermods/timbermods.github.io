# Developing the Timbermods site

A static page with no build step and no dependencies. The maintainer rules (what never to edit, the markup hooks,
the checklist for a changed mod) are in [CLAUDE.md](CLAUDE.md). The look is in [DESIGN.md](DESIGN.md).

## Preview

```bash
node scripts/serve.mjs
```

Then open <http://127.0.0.1:8765/>. A missing path gets a plain 404, so open `/404.html` directly.

## Publishing

GitHub Pages builds from `main`, folder `/ (root)`. Merging to `main` publishes in about a minute. Every path is
relative, except in `404.html`: Pages serves it at any missing address, so it uses root paths.

## How "Download latest" works

The buttons never hard-code a version. Each mod's `<article class="card">` carries `data-repo` and `data-asset`, a
regex that picks the mod ZIP from a release's assets. In the browser, `assets/site.js`:

1. paints at once from `data/releases.json`, the release snapshot;
2. then checks the GitHub API live (two requests per mod, cached 30 minutes) and updates the button;
3. if both fail, leaves the button as a plain link to the repo's Releases page.

It offers the release GitHub marks as **Latest**, however many pre-releases follow it. A repo with only pre-releases
gets its newest one, marked **Preview**. A pre-release published after the offered release adds a "Newer preview"
link under the button.

The pill says **Stable** unless the mod has a caution. Then it shows the `data-maturity` label (such as **Beta**), so
the two never disagree.

## The release snapshot

`.github/workflows/refresh-releases.yml` runs `node scripts/update-releases.mjs` every hour (GitHub often runs it
only every few hours; it can also be started from the Actions tab). It commits `data/releases.json` to `main`, so
never edit that file by hand.

The script keeps each repo's newest 12 releases and, under `latest`, GitHub's Latest release (`null` when there is
none). It rewrites the file, and its `generated` time, only when the data changed. The footer reads "Release data last
changed <date>". To run it yourself, set `GITHUB_TOKEN` to avoid rate limits.

## Download several at once

The picker (`#bundle`, `assets/bundle.js`) lets a visitor tick mods and get one ZIP with a folder for each. GitHub
doesn't let a page fetch release downloads, so the hub keeps its own copies on the `downloads` branch:
`.github/workflows/refresh-downloads.yml` runs `node scripts/update-downloads.mjs <folder>` hourly (at :37, after the
snapshot) and whenever `index.html` or the scripts change. For each mod it picks the release its Download button
offers, rewrites that ZIP into a plain form (`scripts/downloads-lib.mjs`) and lists it in `manifest.json` with its
version, folder, size and SHA-256. The branch is replaced by one fresh commit each time, so it never grows; never
edit it by hand. The page reads the copies from `raw.githubusercontent.com`, checks each checksum and joins them with
`assets/zipmerge.js`, without unpacking anything.

To preview the picker with local copies: `node scripts/update-downloads.mjs _mirror`, then open
`http://127.0.0.1:8765/?downloads=_mirror/`. Delete `_mirror` afterwards.

## Tests

```bash
node scripts/test-site.mjs
```

Every check must pass. They run offline: `assets/site.js` against a stub page and a fake GitHub API, and
`update-releases.mjs` and `update-downloads.mjs` in scratch folders against the same fake API, and the ZIP joining. `.github/workflows/tests.yml` runs them on every
pull request and every push to `main`.

## Adding or changing a mod

Copy an existing mod's `<article class="card">` in `index.html`. Set its `--c` accent colour, `data-repo`,
`data-asset`, links and text. The snapshot script finds the new repo by itself. Add the mod to the need index,
`404.html` and the README too; the full checklist is *Update the website* in [CLAUDE.md](CLAUDE.md).

A mod with a caution (`<p class="caution">Beta: …</p>`) also needs `data-maturity` on its `<article>`, set to the
caution's label (`data-maturity="Beta"`). When the mod is ready, remove both. The tests check that they match.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The page, with all eight mods |
| `404.html` | The not-found page, with a link to each mod's site |
| `assets/style.css` | Styles: walnut boards on birch by day, on a forest floor at night |
| `assets/site.js` | The download buttons and the theme toggle |
| `assets/bundle.js`, `assets/zipmerge.js` | The "Download several at once" picker, and the ZIP joining it uses |
| `assets/fonts/` | Anybody, self-hosted (SIL Open Font License, `OFL-Anybody.txt`) |
| `assets/img/` | The opening valley by day and at dusk (`make_valley.py`), the birch, forest-floor and walnut textures (`make_textures.py`), and the social preview `og.png` |
| `assets/img/cards/` | Each mod's picture, a 960×600 capture from its own site |
| `data/releases.json` | The release snapshot (generated) |
| `scripts/` | `serve.mjs` (preview), `test-site.mjs` (tests), `update-releases.mjs` (snapshot), `update-downloads.mjs` + `downloads-lib.mjs` (the picker's copies) |
| `scripts/card-art.py` | Recaptures the mods' pictures from their live sites: `python scripts/card-art.py [id ...]` (Playwright, Pillow, installed Microsoft Edge) |
| `.github/workflows/` | The hourly snapshot refresh (`refresh-releases.yml`), the picker's copies (`refresh-downloads.yml`) and the tests (`tests.yml`) |
