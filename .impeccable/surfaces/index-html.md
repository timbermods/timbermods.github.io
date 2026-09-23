---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: ["404.html"]
---

# Surface brief: Timbermods hub (index.html, one page)

Scope: the org hub at timbermods.github.io (index.html, assets/, 404.html new). Persuade + a catalog. Audience: Timberborn players browsing what Timbermods makes, and arrivals from one mod's site. Action: find the mod that fits a problem, get its right zip (versioned button), go on to its own site; install right; follow the co-op rule. Proof: each mod's own look (card art from its own site), the release data (version, size, date) and honest cautions. Constraints: scripts/test-site.mjs (15 checks): article.card[data-repo][data-asset][data-maturity when a caution], no data-repo elsewhere, the fixed card hooks site.js uses, caution label = maturity, /releases fallbacks, [data-generated]; data/releases.json is bot-generated and never touched; relative paths; no external requests but GitHub's API; #install, #mods, #top and the eight card ids; the theme toggle (tbmods.theme). Truth: MultiColony's card from its own README (roads never join except through a Trading Post; waiting room; mixed factions not played; beta); Stability Fork feature-complete; Late Game Performance's caution; no invented numbers. Decisions delegated to the agent.

## Direction contract

THESIS: The hub is a collector's binder of trading cards: every Timbermods mod is a card in its own sleeve, printed in its own world's colours and art, so a player who came from one mod's site recognises it at once. The binder only holds them. It refuses the catalog template it wears (parchment and forest green, identical dark banners on six cards, soft-shadow rounded cards, a hero stat strip).

OWN-WORLD: A card collector's desk. Light: a pale grey felt mat (#dcd8cf, produced texture); dark: charcoal felt (#16171a). The binder page is dark PVC (#1d1f23) with punched ring holes, holding clear sleeves with a faint produced sheen. Each card is white card stock (#fbfaf6) framed in its mod's accent (taken from its own site: Stability Fork red #b8322a, MultiColony teal #1a6a77, MixedStorage brass #8a6a2c, Persistent Work Areas gold #8a6512, Optimized Local Housing blue #2d5f9a, Late Game Performance purple #5b3fd0, The Tipsy Tail aqua #1a6773, Hungry Pathing cobalt #1d4a86), with its site's own signature art in the art window. Anybody (display, self-hosted, OFL) for the binder cover and card names; body system-ui.

STORY: One look: Timbermods, unofficial Timberborn mods, a card each; find one by what you need. Then three binder pages grouped by need: Play together (with which co-op mod to pick), Big colonies, Build and plan; the shared install; the footer's data stamp and credits.

FIRST VIEWPORT: The binder cover: "Timbermods" in Anybody, one line of what this is, the facts line (eight mods for Timberborn 1.1.2.4; most made for BeaverBuddies co-op), and a "find by need" index of eight short entries, each linking to a card.

FORM: Collector's Binder, candidate 5 of 7 (seed 8f1ec2f1). Challengers weighed: orienteering map (competitive: a legend that sorts by need; kept that discipline as the need index), sewing pattern envelope (kept: every card has the same fixed fields in the same places, like a pattern's back), step sequencer, neutral software marketing, suminagashi, shadow bazaar (declined). Raises taken: the need index is a legend, one entry per need; fields fixed on every card; each card's colour and art are the mod's own, never the hub's. Signature: the sleeve sheen catches the pointer on hover (a moving highlight; off under reduced motion).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
