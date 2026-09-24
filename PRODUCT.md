# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Timberborn players looking through what the Timbermods organization makes, mostly non-technical. Two ways in:

- **Browsers** arrive from the org's GitHub profile (its "Browse the catalog" link), a forum post or a friend. They
  want to find a mod that fits their problem (co-op, lag, storage, commutes, work areas, meals, a new building), see
  in one line what each one does, and get the right zip without reading a README.
- **Arrivals from one mod's site** already know one mod and want the others, or want a quick download of the one they
  came for. Each mod now has its own site with its own look; this hub is the one place that lists them all side by
  side and links out to each.

Returning players come back to grab a newer release. Co-op groups send the link to each other so every player gets
the same build.

## Product Purpose

The organization hub at **https://timbermods.github.io/** (repo: https://github.com/timbermods/timbermods.github.io):
a catalog of Timbermods' Timberborn mods, one card per mod, each with a **Download** button for that mod's current
release and a link to the mod's own website.

Success, in order:
1. **The visitor finds the mod that fits** and understands it in a line (the tagline) before reading anything else.
2. **They download the right file:** the mod zip of the release the button offers (never a source or preset zip),
   with the version and size on the button, and a clear sign when it is a beta or preview.
3. **They go on to the mod's own site** for the full guide, or to GitHub for release notes and issues.
4. **They install it correctly:** the shared three-step install (zip, extract into `Documents\Timberborn\Mods` with
   the game closed, enable plus requirements) and the co-op rule (same mod version and game version for everyone).

## Positioning

A small collection of unofficial Timberborn mods by one maintainer group, Timbermods, all built for the same game
version and released often. Most of them are made to work in BeaverBuddies co-op. The hub is a shelf, not a
storefront: it doesn't rank, review or sell, it lists each mod as it is now and points to where the full story lives
(the mod's own site). Two of the mods are BeaverBuddies derivatives, and the hub credits thomaswp's original
BeaverBuddies for the multiplayer design.

## Operating Context

**The mods listed**, in card order in `index.html`, grouped on three walnut boards. Each entry gives the exact name,
the card `id`, its accent `--c` (taken from that mod's own site), its category pill and its requirements:

*Play together*
1. **BeaverBuddies Stability Fork** (`beaverbuddies-stability-fork`, `#b8322a`, Multiplayer; Harmony, Mod Settings).
   - Co-op with fewer crashes and desyncs: an independent fork of BeaverBuddies with Steam friend invites, a connection
     panel, teammate cursors and desync fixes.
   - **Feature-complete**: game-update and bug-fix releases only; new features go into MultiColony. GitHub's Latest.
   - Its status line follows its README (the newest release is fixes only and hasn't been played yet). GPL-3.0.
2. **BeaverBuddies MultiColony** (`beaverbuddies-multicolony`, `#1a6a77`, Multiplayer; Harmony, Mod Settings;
   `data-maturity="Beta"` with a Beta caution).
   - Two players, one map, a colony each; the colonies' roads never join, and they trade only at Trading Posts. Or
     share one colony, as in the fork.
   - Pre-releases only (no Latest release), so the pill says **Preview**. Built on the Stability Fork. GPL-3.0.
   - The caution's played and not-played lists follow its README.

*Big colonies*
3. **Late Game Performance** (`late-game-performance`, `#5b3fd0`, Performance; Harmony 2.4.1+, Mod Settings;
   `data-maturity="Young mod"` with a caution).
   - Fewer lag spikes in big colonies by cutting repeated work.
   - A Latest release, often with a newer pre-release, which gives the card a "Newer preview" link. MIT.
4. **Optimized Local Housing** (`optimized-local-housing`, `#2d5f9a`, Housing; nothing extra).
   - Once a day, re-houses adult beavers so total home-to-work travel is as short as possible. Latest.
5. **Hungry Pathing** (`hungry-pathing`, `#1d4a86`, Beaver needs; Harmony 2.4.1+; `data-maturity="Beta"` with a Beta
   caution).
   - Working beavers plan food and water around their shift and eat at the closest stocked storage. Latest, so the
     pill says **Beta**.

*Build and plan*
6. **MixedStorage** (`mixedstorage`, `#8a6a2c`, Storage; Harmony 2.4.1+).
   - Several goods in one warehouse or pile, divided by percentage. Latest. MIT.
7. **Persistent Work Areas** (`persistent-work-areas`, `#8a6512`, Planning; nothing extra).
   - Keeps a building's working-area outline on screen after deselecting it; one-click clear. Latest.
   - The release also carries a `-source.zip`, which the asset regex skips.
8. **The Tipsy Tail** (`the-tipsy-tail`, `#1a6773`, Building; nothing extra).
   - A swim-up pool bar that runs on hauled water. Latest.
   - The release also has source, preset and checksum files; `-mod\.zip$` picks the mod.

**Not listed:** `PerformanceLog` (a 0.x preview mod, v0.1.4 marked Latest, no website yet) and `.github` (the org
profile). Whether PerformanceLog joins the hub is the maintainer's call.

**Game version:** every mod is built for Timberborn **1.1.2.4** (the hero says so; each README agrees). Only the
Steam version on Windows is stated as tested (Stability Fork, MultiColony).

**The refresh process:** `.github/workflows/refresh-releases.yml` runs `node scripts/update-releases.mjs` on a cron
(`17 * * * *`, hourly on paper; GitHub often runs it only every few hours) and on manual dispatch. It commits
`data/releases.json` as github-actions[bot] with the message "Refresh release data" only when it changed, straight to
`main`; Pages then redeploys. In the browser, `assets/site.js` paints from the snapshot first, then checks GitHub live
(two requests per card, cached 30 minutes), and if both fail the button stays a plain link to the repo's Releases
page. The main branch moves several times a day from bot commits: a redesign branch must merge or rebase onto it and
take `main`'s `data/releases.json` on conflict.

**Siblings:** each mod's site (`https://timbermods.github.io/<Repo>/`) and the org profile README in
`timbermods/.github` (`profile/README.md`, `profile/banner.svg`, `profile/cards/*.svg`), which repeats each card's
name, tagline, blurb, accent color and requirements and links back to the hub and `/#install`.

## Capabilities and Constraints

**Stack and hosting:** one static page (`index.html`), `assets/style.css`, `assets/site.js`, no build step, no
dependencies, no external requests besides GitHub's API (Anybody is self-hosted in `assets/fonts/` and text uses the system font stack; nothing from a CDN). GitHub Pages
"legacy" build from `main`, folder `/ (root)`; `.nojekyll` stays. All paths are relative (so it also works from a
project repo), except in `404.html`, which GitHub Pages serves at any missing address and so uses root paths. Preview with `node scripts/serve.mjs` (http://127.0.0.1:8765/). Light and dark themes: tokens on
`:root`, `prefers-color-scheme` guarded by `:root:not([data-theme="light"])`, `:root[data-theme="dark"]`; the toggle
stores `tbmods.theme` in localStorage and an inline head script applies it before first paint.

**Generated vs hand-written:**
- `data/releases.json` is **generated**: `{ generated, repos, latest }`. `repos["owner/name"]` is the newest 12
  non-draft releases, newest first; `latest["owner/name"]` is GitHub's Latest release or `null`. Each release is
  `{ tag, name, prerelease, published, url, assets: [{ name, size, url }] }`. `generated` changes only when the data
  does. Never hand-edit it, never rename or move it (site.js fetches the relative path `data/releases.json`).
- Everything on the cards is **hand-written in `index.html`**: names, taglines, blurbs, facts, categories,
  requirements, cautions, card art (`assets/img/cards/<id>.webp`, captured by `scripts/card-art.py`), accent colors. The only data the page
  takes from releases is the button's version, size and link, the release-notes link, the status pill and the note
  under the button.
- The repo list itself comes from `index.html`: `update-releases.mjs` scans it for every `data-repo="owner/name"`.
  A mod is added by adding a card; nothing else to register.

**Contracts a redesign must keep** (`node scripts/test-site.mjs`, 15 offline checks, run by `.github/workflows/tests.yml`
on every push to `main` and every pull request, Node 22; the bot's pushes don't trigger it):
1. **Each mod is an `<article>` whose opening tag carries `data-repo` and `data-asset`** (and `data-maturity` when it
   has a caution). The test parses `<article …>…</article>` with a regex, so no nested `<article>`, attributes in
   double quotes. The number of `data-repo=` attributes on the whole page must equal the number of cards: never put
   `data-repo` anywhere else in `index.html` (a hero link, a filter, a featured strip). `site.js` selects
   `.card[data-repo]`, so the article keeps class `card`.
2. **Inside each card** `site.js` needs exactly: `[data-download]` (the download `<a>`) containing `.btn-label` and
   `[data-size]`; `[data-notes]` (release-notes link); `[data-status]` (the pill, starts `hidden`; it gets
   `data-kind="stable"` or `"preview"`); `[data-note]` (the "Released <date> · Newer preview: vX" line,
   `aria-live="polite"`); and an `h3` holding the mod's name (used in the button's aria-label and read by the test).
   The test's stub DOM throws on any other selector, so changing or adding selectors in `site.js` means updating the
   stub in `test-site.mjs` too.
3. **Cautions:** any element with class `caution` must sit inside a card (the test counts them page-wide). Its text
   starts with a label and a colon (`Beta: …`), and the card's `data-maturity` equals that label. The pill must never
   read Stable next to a caution. Remove both together when a mod is ready.
4. **No-JS fallback:** each download `href` in the HTML is the repo's `/releases` page (not `/releases/latest`, which
   404s for MultiColony's pre-release-only repo), and the notes link likewise.
5. **Footer stamp:** one `[data-generated]` element (default text "Release data loads from GitHub."); `site.js` sets
   "Release data last changed <date>." from the snapshot, or "Latest releases checked live from GitHub." after a live
   check of every card. Tests assert both strings.
6. **Release choice** (in `site.js`, tested): GitHub's Latest release, however many pre-releases follow it; if it has
   no mod zip, the newest stable in the list; else the newest pre-release, pilled **Preview**. A "Newer preview" link
   appears only for a pre-release published after the offered one. `data-asset` is a regex for the mod zip; with no
   match, any zip without "source" or "preset" in its name.
7. **Rate limits:** at most two GitHub requests per card per visit, none again within 30 minutes (localStorage
   `tbmods.live.v1`); a refused `/releases/latest` keeps the snapshot and caches nothing.
8. **The snapshot script:** reads `index.html` from the repo root, writes `data/releases.json`, fails (leaving the file
   as it was) on any API error other than a 404 from `/releases/latest`, and leaves the file untouched when nothing
   changed. The workflow depends on the paths `scripts/update-releases.mjs` and `data/releases.json`, and needs
   `contents: write`.
9. **Anchors other sites link to:** `#install` (the org profile links `https://timbermods.github.io/#install`) and
   `#mods`; the card ids above are the natural deep links. Keep them.

**Shared files:** the hub does **not** use the shared `release.js` that most mod sites carry (its `site.js` is its own
and follows the same main rule, differing in edge cases). If a `release.js` is ever copied in, it is replaced
byte-for-byte from the shared copy, never edited. `site.js` itself is hub-only and may be changed, with its tests.

**Exact mod names** (as on the cards and the mods' sites): BeaverBuddies Stability Fork, BeaverBuddies MultiColony,
MixedStorage, Persistent Work Areas, Optimized Local Housing, Late Game Performance, The Tipsy Tail, Hungry Pathing.
The org is **Timbermods**; the original mod is **BeaverBuddies** by thomaswp. MultiColony's in-game name is
"BeaverBuddies MultiColony (beta)".

**Keeping copy true:** each card's tagline, facts, caution and status line restate that mod's README. When a mod's
README changes (features, status, requirements), update its card, the needs index if the mod's purpose changed, and
this file. Terms to use: Trading Post (capitalized); MultiColony has no land or borders.

## Brand Commitments

- **Words players use:** never "card", "binder", "pocket" or "sleeve" in anything a visitor reads; say "mod", or
  write the sentence without it. (The `.card` class name stays in the code: the tests and `site.js` need it.)
- **Voice:** fellow players sharing mods they find useful. Plain, exact, friendly; say what each mod does and what it
  needs. Never hype, never "the best", no superlatives the READMEs don't support.
- **Unofficial:** community mods, not affiliated with or endorsed by Mechanistry. The footer says so and credits
  BeaverBuddies by thomaswp and contributors ("the multiplayer design is theirs") for the two BeaverBuddies mods. Keep
  both.
- **No official Timberborn logos or key art.** The hub's mark is its own (a pine tree on a log end,
  `assets/favicon.svg` and the header SVG). Game screenshots of the mods are allowed; they show the game and belong to Mechanistry.
- **Each mod keeps its own identity.** Its card uses that mod's accent color and imagery, consistent with its own site;
  the hub's own look frames the collection without overriding theirs.
- **License:** the hub is MIT (Copyright 2026 Timbermods). Timberborn, its name and artwork are not covered. Each mod
  has its own license (Stability Fork and MultiColony GPL-3.0; MixedStorage and Late Game Performance MIT); the hub
  doesn't restate the others.

## Evidence on Hand

- **Card art:** `assets/img/cards/<card-id>.webp` (960×600), one per mod, each a capture of the signature element
  of that mod's own site (the Stability Fork's log round, MultiColony's two-colony map, Late Game Performance's pit
  board, the seating plan, the hunger board, the MixedStorage panel, the pinned-area plan, the Tipsy Tail on its bar).
  When a mod's site changes its look, recapture its card. Provenance is in each image's `.json` sidecar.
- **Org profile:** `timbermods/.github/profile/`: its hand-made `banner.svg` and one picture per mod in `cards/*.png`,
  rendered by `profile/make_images.py` from this site's pictures.
- **Per-mod sites** each have their own screenshots, icons and demos (MixedStorage: `panel.webp`, `world.webp`;
  MultiColony: mod icon, goods icons, connection-panel screenshot; others per their repos). The hub may link to or
  reuse them only as those sites hold them.
- **Live facts:** release tag, publish date, zip size, prerelease flag and GitHub's Latest marker per mod, from the
  snapshot and the live API. Nothing else is data-driven.
- **Does not exist, must not be faked:** download counts, star or rating figures, player counts, reviews or
  testimonials, "most popular" or "trending" rankings, compatibility matrices beyond what each README states, per-mod
  "tested" claims beyond each README's own status line, and screenshots of mods that have none on hand.
- **Social preview and 404:** `assets/img/og.png` (1200×630, a capture of the cover) and `404.html` exist.

## Product Principles

1. **One line, one button, one link.** Every card answers what it does (tagline), gets the right zip (versioned
   button), and hands off to the mod's own site. Everything else is secondary.
2. **The data decides the version, the maintainer decides the status.** Versions, dates and sizes come only from the
   release data; betas and previews are labeled by the card's caution and the pill, and the two never disagree.
3. **Honest and current.** Each mod described as it is now, with no version history; status taken from its own README,
   never rounder than the mod itself says.
4. **A frame for eight identities.** The hub has a look of its own, but each mod shows up in its own colors and
   imagery, so a player who came from one mod's site recognizes it here.
5. **Never broken, never stale.** The page works with no JavaScript and with GitHub's API rate-limited: plain links to
   Releases, then the snapshot, then live data. A redesign keeps all three layers and every tested hook.
