# CLAUDE.md

This repo is the Timbermods org hub (timbermods/timbermods.github.io): one static page listing every Timbermods
Timberborn mod, each with a download button for its current release and a link to its own site. No build step,
no dependencies. The mods themselves live in their own repos; the hub carries no mod code. Changes land on `main`
through a PR (CI: `.github/workflows/tests.yml` runs `node scripts/test-site.mjs` on Node 22 for every PR and push to
main).

## Standing rules

- Never launch or drive Timberborn, and never touch installed mods or saves. The maintainer (Kyler) playtests himself.
- Commit on a branch and open a PR. Kyler has said to merge PRs automatically: merge, then check the page live.
- **Never edit `data/releases.json`.** `.github/workflows/refresh-releases.yml` regenerates it hourly
  (`node scripts/update-releases.mjs`) and commits straight to `main` as github-actions[bot]. So `main` moves several
  times a day: before a PR run `git fetch origin && git merge origin/main`, and on a conflict in that file take
  main's copy (`git checkout --theirs data/releases.json`).
- Release versions, sizes and dates are **automatic** (snapshot, then a live GitHub check in `assets/site.js`). Never
  hard-code a version on the page.
- The hub has no shared `release.js`; `assets/site.js` is hub-only. If you change or add a selector in it, update the
  stub DOM in `scripts/test-site.mjs` too (the stub throws on any selector it doesn't know).

## Website

- **Where:** the repo root: `index.html` (opening with the need index, three walnut boards of mods, install, footer),
  `404.html` (uses root paths `/assets/...`; every other path is relative), `assets/style.css`, `assets/site.js`
  (download buttons, theme toggle), `assets/fonts/`, `assets/img/`, `assets/favicon.svg`. Live at
  https://timbermods.github.io/.
- **Published:** GitHub Pages "legacy" build from `main`, folder `/` (`.nojekyll` stays). Merging to main publishes;
  a build takes about a minute.
- **Look:** "The Lodge Wall". Pale birch boards by day and a dark forest floor at night; each group of mods is mounted
  on a walnut board with four brass nail heads; each mod is a panel (warm paper by day, moss green at night) framed in
  that mod's own colour with a picture from its own site. The page opens on a river valley (a beaver, its lodge and
  dam, pines and birches) with the wordmark over its sky: by day in the light theme, at dusk in the dark one. Wood,
  brown and green: Kyler rejected a black/white look.
  The look is fixed: updates extend it and never restyle it.
- **Words:** never "card", "binder", "pocket" or "sleeve" in anything a visitor reads (page text, titles, meta, alt,
  aria labels). Say "mod", or write the sentence without it. The class name `.card` is read by `site.js` and the tests,
  so it stays; `.binder`, `.page`, `.pockets` and `.sleeve` are kept only to avoid churn.
- **Design records (read these before any site change):**
  - `PRODUCT.md`: the facts, voice, and every site contract; its Operating Context lists every mod (id, accent, pill,
    requirements).
  - `DESIGN.md`: the visual system and its named rules, the source of truth for the look.
  - `.impeccable/surfaces/index-html.md`: the direction contract.
  - `.impeccable/design.json`: tokens and component snippets.
  - `.impeccable/critique/`: the pre-redesign critique.

### Design rules (from DESIGN.md; keep them)

- **Own Colours**: each mod's accent is passed as `--c` (inline `style="--c:#…"` on the `article.card` and on its
  need-index `.to` span), taken from that mod's own site. It frames the panel and colours its tag pill, bullets and
  download button. Never recolour a mod or share an accent. Accents: Stability Fork #b8322a, Timber Together #1a6a77,
  MixedStorage #8a6a2c, Persistent Work Areas #8a6512, Optimized Local Housing #2d5f9a, Late Game Performance #5b3fd0,
  The Tipsy Tail #1a6773, Hungry Pathing #1d4a86. A new accent must hold ≥4.5:1 against white (`#fff` text on it).
- **Wood and Green**: the hub's own colours are birch, walnut, brass, paper, moss and pine green, nothing black/white.
  Panels follow the theme (paper by day, moss at night) and set their own `--link`.
- **Two Weights**: only Anybody 700 and 800 ship; Anybody sets names, headings, pills, numerals; running text is the
  system-ui stack; code is ui-monospace.
- **No Motion**: nothing animates (hover only darkens a button); reduced motion also turns off smooth scrolling.
- Tokens (`:root` in `assets/style.css`; dark under `@media (prefers-color-scheme: dark) :root:not([data-theme="light"])`
  and `:root[data-theme="dark"]`), light / dark: ground #e0d2b4 (birch.webp) / #1a211a (forest-floor.webp), ink
  #2a2118 / #ece3cf, muted #5b4a37 / #bdb39c, rule #bca77f / #3b4636, board #56402a (walnut.webp) / #3a291b
  (walnut-dark.webp) with text #f4ead6 and #decdab, nails #c19a5b / #a88650, panel #f5ecd9 / #243126 (ink #2a2118 /
  #ece3cf, muted #5d4c39 / #b8b19b, rule #dccdab / #38493b), link and pine green #2f5d3a / #a9d8a3, focus #2f5d3a /
  #f0d27a, caution #f4dfb3 on #663a04 / #3b301b on #f1cf8b, Stable pill #2c6536 / #9fd49a, Preview pill #7a4a06 /
  #f0c070.
- Fonts: Anybody 700/800, self-hosted in `assets/fonts/` (`anybody-latin-{700,800}-normal.woff2`, `OFL-Anybody.txt`).
  No other webfonts, nothing from a CDN; the only external requests are GitHub's API.
- Textures: `birch.webp`, `forest-floor.webp`, `walnut.webp`, `walnut-dark.webp`, made by `assets/img/make_textures.py`
  (numpy + Pillow, fixed seeds; run it from `assets/img/`). Change the script, don't edit images. Every shipping raster
  carries provenance (`.webp.json` sidecar, or a tEXt chunk in `og.png`): after adding or changing one, run (with `$IMP`
  as in step 6 below) `"$IMP/scripts/impeccable" embed-prompt <file> --prompt "Origin: ..."` (reuse a neighbouring
  sidecar's wording) and check with `embed-prompt --scan .`.
- The logo (header SVG in both pages and `assets/favicon.svg`) is a pine tree on a log end.
- The valley: `assets/img/valley-day.svg` (light) and `valley-dusk.svg` (dark), a CSS background via `--vista` on
  `.vista`, drawn by `assets/img/make_valley.py` (`cd assets/img && python make_valley.py`; vector, fixed seed, no
  text). It is the same scene as the org profile's banner (`timbermods/.github` `profile/make_banner.py`): change the
  two together. It shows no mod, so it never needs updating for a release.
- Mod pictures: `assets/img/cards/<id>.webp`, 960×600, a capture of the element on that mod's own site that shows what
  the mod does. When a mod's site changes it, recapture: `python scripts/card-art.py <id>` (no id = all eight; needs
  Python with playwright + Pillow and installed Microsoft Edge; the selector per mod is in its `JOBS` table, update it
  if the mod's site renamed the element). Then embed provenance. A picture must show what the mod actually does.
- Themes: light and dark; the toggle stores `tbmods.theme` in localStorage and an inline head script (in both pages)
  applies it before first paint. Check both.
- Phones: no horizontal scroll at 390px, tap targets ≥ 44px (download 48px, need rows 46px). Breakpoints 1000px (two
  panels per row, the Which-one notice spans the row), 860px (one-column opening/install), 620px (one panel per row, 16:7 art).
- Don't: recolour a mod or give mods a shared picture; go back to black/white, felt, binder or sleeve looks; add
  Anybody weights or other faces; add motion; make composite images of the mods' pictures; use official Timberborn
  logos/key art or stock/generated imagery; rename or remove markup hooks.
- New components: build them from the tokens and components above (mod panel, board, notice, need index, install
  sheet), match the neighbours, and add them to DESIGN.md.

### Markup hooks (tested; every card keeps all of them)

- `<article class="card" id="<card-id>" style="--c:#…" data-repo="timbermods/<Repo>" data-asset="<zip regex>">`, plus
  `data-maturity="<Label>"` when the card has a caution. Attributes in double quotes, no nested `<article>`, and no
  `data-repo` anywhere else in `index.html` (the test counts them; `update-releases.mjs` reads the repo list from them).
- Inside: an `h3` with the mod's name; `a.btn[data-download]` (fallback href `https://github.com/timbermods/<Repo>/releases`,
  never `/releases/latest`) containing `.btn-label` ("Download latest") and `[data-size]`; `[data-notes]` (same
  `/releases` fallback); `.pill.status[data-status] hidden`; `p.dl-note[data-note] aria-live="polite"`.
- A caution is `<p class="caution">…<svg/>Label: …</p>` inside the card; `data-maturity` equals Label (e.g. `Beta`,
  `Young mod`). Remove both together when a mod is ready. Any `.caution` outside a card fails the test.
- Footer: one `[data-generated]` with default text "Release data loads from GitHub.".
- Anchors: `#top`, `#mods`, `#install` (the org profile links `/#install`) and the eight card ids.

### Content rules

- Describe each mod as it is now. No "New in <version>", "added in …" or version history; that belongs in each mod's
  own release notes.
- Each card's status line and caution wording match that mod's README exactly in substance (read it with
  `gh api repos/timbermods/<Repo>/readme -H "Accept: application/vnd.github.raw"`). Never rounder than the mod says.
  Never invent download counts, ratings, reviews or screenshots.
- Keep the credits: BeaverBuddies by thomaswp and contributors ("The multiplayer design is theirs.") and "Not affiliated
  with or endorsed by Mechanistry" (footer of both pages).
- Terminology: exact names BeaverBuddies Stability Fork, Timber Together, MixedStorage, Persistent Work
  Areas, Optimized Local Housing, Late Game Performance, The Tipsy Tail, Hungry Pathing; the org is Timbermods;
  "Trading Post" capitalised; Timber Together has no land or borders (roads never join except through a Trading Post).
- When you change a card, update its entry in PRODUCT.md's Operating Context too, so the two stay in step.

### Update the website (a mod changed, a mod was added, or a mod's site changed its look)

A new release alone needs **no** edit: the button, size, date, pill and "Newer preview" link update themselves. Edit
the hub when a mod's features, status, requirements or caution change, when a mod is added, or when a mod's site
changes its look.
1. Read the mod: `gh release list -R timbermods/<Repo> -L 5`, `gh release view <tag> -R timbermods/<Repo>`, its README
   (command above) and its site. List what changed for players.
2. Update every place the hub states that fact:
   - its card in `index.html`: `.pill.tag` category, `.tagline`, `.blurb`, the three `.facts` items, `.caution` +
     `data-maturity`, `.status-line` (played/not-played), `.req` ("Requires …"), `data-asset` if the zip name changed;
   - its need-index row on the cover (`nav.needs`: the need and the `--c` swatch);
   - for the two BeaverBuddies mods, the "Play together" page lead and its `.insert` (which one to pick);
   - `.cover-facts` ("Eight mods for Timberborn 1.1.2.4"), `<meta name="description">`, `og:description` ("Eight
     unofficial…") when the count, game version or a one-line summary changes (`grep -n "1.1.2.4\|[Ee]ight" *.html README.md PRODUCT.md`);
   - the install `.notes` if requirements in general change; the footer credit if a new BeaverBuddies derivative lands;
   - `404.html`'s mod list (a copy of the cards' names, URLs and `--c`; **kept in sync by hand**);
   - PRODUCT.md's Operating Context and README's mod list; the org profile (`timbermods/.github`,
     `profile/README.md`) repeats each card's text, accent, category and group: update it in a PR to that repo. Its
     images come from this site: after card art changes here (and is live), run `python profile/make_images.py` there.
3. Adding a mod: copy a whole `<div class="sleeve"><article class="card">…</article></div>` into the right board
   (Play together / Big colonies / Build and plan), set `--c` from the mod's own site, all hooks above, card art via
   `scripts/card-art.py` (add a `JOBS` entry) + provenance, a need-index row, the 404 row, and the counts in step 2.
   A board with an empty spot fills it with an `.insert` notice in an `.insert-sleeve`. The tests read cards from
   `index.html`, so no test edit is needed unless you change `site.js`.
4. Test: `node scripts/test-site.mjs` must print `15/15 checks passed`.
5. Preview: `node scripts/serve.mjs` (serves the repo root at http://127.0.0.1:8765/; missing paths get a plain 404,
   so open `/404.html` directly). Capture light, dark and a 390px phone: with the personal skill,
   `python ~/.claude/skills/impeccable-site-flow/scripts/capsite.py http://127.0.0.1:8765/ <out> "" 404.html`;
   otherwise the Browser pane in both schemes at desktop and mobile. Check the changed card, equal card heights in a
   row, and no horizontal scroll. Stop the server afterwards.
6. Optional: `IMP=$(ls -d ~/.claude/plugins/cache/impeccable/impeccable/*/skills/impeccable | tail -1)`, then
   `"$IMP/scripts/impeccable" detect --json .` (parse from the first `[`). Known false positives (by design; there is
   no `.impeccable/config.json`): `nested-cards` (panels on a board, the notice on a board), `border-accent-on-rounded`
   on `.banner` (the 6px frame continued under the art), `cramped-padding` on `.page`, `.install` and the ruled
   `.needs ul` (clamp()/ruled lists), `flat-type-hierarchy` on 404.html (root-path CSS not loaded), and the
   `design-system-*` advisories for rgba() shadows, `#fff` on accents and small panel font sizes.
7. If the look changed, update DESIGN.md and `.impeccable/design.json`. Update README.md if it repeats the facts.
8. Ship: `git fetch origin && git merge origin/main` → branch → commit → push → `gh pr create`. After Kyler says merge:
   `gh pr merge <n> --merge`, then verify:
   - `gh api repos/timbermods/timbermods.github.io/pages/builds/latest -q .status` is `built`;
   - `curl -s https://timbermods.github.io/ | grep -c "<a changed string>"` finds the change.

### Full redesign

A new look goes through the whole Impeccable flow (init → critique → audit → direction → build → finish review →
DESIGN.md). With the personal skill: "use the impeccable-site-flow skill to redesign this site".
