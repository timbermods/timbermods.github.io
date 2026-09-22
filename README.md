# Timberborn Mods catalog

A static, no-build catalog site for the Timberborn mods: BeaverBuddies Stability Fork, BeaverBuddies MultiColony, MixedStorage, Persistent Work Areas, Optimized Local Housing, Late Game Performance, The Tipsy Tail and Hungry Pathing. Each card links to the mod's own site and has a **Download latest** button.

## Preview locally

```bash
node scripts/serve.mjs
```

Then open <http://127.0.0.1:8765/>.

## Deploy to GitHub Pages

1. Create a repo (the name `timbermods.github.io` gives you `https://timbermods.github.io/`), and push this folder to it.
2. **Settings → Pages → Build and deployment**: deploy from branch `main`, folder `/ (root)`.

All paths are relative, so it also works from a project repo (`.../some-repo/`).

## How "Download latest" works

The mods release often, so the buttons never hard-code a version. Each card has `data-repo` and `data-asset` (a regex that picks the mod ZIP from the release's assets). In the browser, `assets/site.js`:

1. paints immediately from `data/releases.json`, a snapshot kept fresh by `.github/workflows/refresh-releases.yml` (scheduled hourly, though GitHub often runs it only every few hours; or run it from the Actions tab);
2. then checks the GitHub API live (two requests per mod, cached 30 minutes) and updates the button;
3. if both fail, the button is still a plain link to the repo's Releases page.

Which release it offers: the one GitHub marks as **Latest** (the newest release that isn't a draft or a pre-release), however many pre-releases came after it. If a repo only has pre-releases it offers the newest of those and marks the card **Preview**. If a newer pre-release exists than the offered one, a small "Newer preview" link appears under the button. This is the same rule as the `release.js` on the mods' own sites.

The pill says **Stable** for a stable release, unless the card has a caution: then it shows the card's `data-maturity` (**Beta**, **Preview**, **Prototype**), so it never contradicts the caution.

Refresh the snapshot by hand: `node scripts/update-releases.mjs` (set `GITHUB_TOKEN` to avoid rate limits). For each repo it stores the newest 12 releases and, under `latest`, GitHub's Latest release (`null` when there is none). It rewrites the file, and its `generated` time, only when that data changed, so the footer reads "Release data last changed <date>"; after a live check of every card it says so instead.

## Tests

```bash
node scripts/test-site.mjs
```

Offline checks with no dependencies: `assets/site.js` runs against a stub page and a fake GitHub API, and `scripts/update-releases.mjs` runs in a scratch folder against the same fake API. `.github/workflows/tests.yml` runs them on every push to `main` and every pull request.

## Adding or changing a mod

Copy an existing `<article class="card">` in `index.html`, then update its `--c` accent color, `data-repo`, `data-asset`, links and text. Running `scripts/update-releases.mjs` picks up the new repo automatically.

A card with a caution (`<p class="caution">Beta: …</p>`) also needs `data-maturity` on its `<article>`, set to the caution's label (`data-maturity="Beta"`). When the mod is ready, remove both, and the pill says Stable. `scripts/test-site.mjs` checks that the two match.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | The page and all eight cards (including inline SVG banners) |
| `assets/style.css` | Styling, light and dark themes |
| `assets/site.js` | Download buttons and theme toggle |
| `assets/img/` | Screenshots for MixedStorage and The Tipsy Tail |
| `data/releases.json` | Release snapshot (generated) |
| `scripts/` | `update-releases.mjs` (snapshot), `serve.mjs` (local preview), `test-site.mjs` (tests) |
| `.github/workflows/` | Hourly snapshot refresh (`refresh-releases.yml`) and the tests (`tests.yml`) |

## License

MIT. See [LICENSE](LICENSE). Timberborn, its name and its artwork belong to Mechanistry and are not covered by this license; the screenshots in `assets/img/` show the game.
