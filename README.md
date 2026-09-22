# Timberborn Mods catalog

A static, no-build catalog site for the Timberborn mods: BeaverBuddies Stability Fork, BeaverBuddies MultiColony, MixedStorage, Persistent Work Areas, Optimized Local Housing, Late Game Performance and The Tipsy Tail. Each card links to the mod's own site and has a **Download latest** button.

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

1. paints immediately from `data/releases.json`, a snapshot kept fresh by `.github/workflows/refresh-releases.yml` (hourly, or run it from the Actions tab);
2. then checks the GitHub API live (cached 30 minutes) and updates the button;
3. if both fail, the button is still a plain link to the repo's Releases page.

Which release it offers: the newest **stable** release. If a repo only has pre-releases it offers the newest of those and marks the card **Preview**. If a newer pre-release exists than the stable one, a small "Newer preview" link appears under the button.

Refresh the snapshot by hand: `node scripts/update-releases.mjs` (set `GITHUB_TOKEN` to avoid rate limits).

## Adding or changing a mod

Copy an existing `<article class="card">` in `index.html`, then update its `--c` accent colour, `data-repo`, `data-asset`, links and text. Running `scripts/update-releases.mjs` picks up the new repo automatically.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | The page and all seven cards (including inline SVG banners) |
| `assets/style.css` | Styling, light and dark themes |
| `assets/site.js` | Download buttons and theme toggle |
| `assets/img/` | Screenshots for MixedStorage and The Tipsy Tail |
| `data/releases.json` | Release snapshot (generated) |
| `scripts/` | `update-releases.mjs` (snapshot), `serve.mjs` (local preview) |
| `.github/workflows/` | Hourly snapshot refresh |

## License

MIT. See [LICENSE](LICENSE). Timberborn, its name and its artwork belong to Mechanistry and are not covered by this license; the screenshots in `assets/img/` show the game.
