---
name: Timbermods
description: The org hub for unofficial Timberborn mods, a collector's binder with a card for each mod.
colors:
  felt-mat: "#dcd8cf"
  felt-mat-dark: "#16171a"
  binder-ink: "#1f2124"
  binder-ink-dark: "#eceae4"
  slate-muted: "#4c5056"
  slate-muted-dark: "#b3b5b8"
  mat-rule: "#b9b4a8"
  mat-rule-dark: "#34363b"
  pvc-page: "#1d1f23"
  pvc-page-dark: "#2a2c31"
  card-stock: "#fbfaf6"
  card-ink: "#1f2124"
  card-muted: "#4a4e54"
  card-rule: "#dedbd2"
  ledger-blue: "#1d4f8a"
  ledger-blue-dark: "#9cc2f0"
  focus-lamp-dark: "#f0d27a"
  caution-cream: "#fff3dc"
  caution-umber: "#6e3d00"
  stable-green: "#1d6b3a"
  accent-stability-fork: "#b8322a"
  accent-multicolony: "#1a6a77"
  accent-mixedstorage: "#8a6a2c"
  accent-persistent-work-areas: "#8a6512"
  accent-optimized-local-housing: "#2d5f9a"
  accent-late-game-performance: "#5b3fd0"
  accent-tipsy-tail: "#1a6773"
  accent-hungry-pathing: "#1d4a86"
typography:
  display:
    fontFamily: "Anybody, Arial Narrow, sans-serif"
    fontSize: "clamp(3.2rem, 7.5vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Anybody, Arial Narrow, sans-serif"
    fontSize: "clamp(1.7rem, 3.2vw, 2.4rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Anybody, Arial Narrow, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  title-small:
    fontFamily: "Anybody, Arial Narrow, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.01em"
  numeral:
    fontFamily: "Anybody, Arial Narrow, sans-serif"
    fontSize: "2.6rem"
    fontWeight: 800
    lineHeight: 1
  body:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  body-card:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Anybody, Arial Narrow, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.02em"
  mono:
    fontFamily: "ui-monospace, Cascadia Code, SF Mono, Consolas, Liberation Mono, monospace"
    fontSize: "0.9em"
rounded:
  swatch: "2px"
  code: "3px"
  steps-sheet: "4px"
  caution: "6px"
  card: "8px"
  page: "10px"
  sleeve: "12px"
  pill: "999px"
  toggle: "50%"
spacing:
  gutter: "clamp(16px, 4vw, 32px)"
  wrap: "1180px"
  sleeve-inset: "7px"
  card-frame: "6px"
  card-body: "14px 16px 16px"
  pocket-gap: "clamp(14px, 2vw, 22px)"
  page-pad: "clamp(22px, 3vw, 34px) clamp(18px, 3vw, 34px) clamp(24px, 3vw, 36px) clamp(52px, 6vw, 72px)"
  tap-min: "44px"
components:
  card:
    backgroundColor: "{colors.card-stock}"
    textColor: "{colors.card-ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-body}"
  sleeve:
    rounded: "{rounded.sleeve}"
    padding: "{spacing.sleeve-inset}"
  binder-page:
    backgroundColor: "{colors.pvc-page}"
    textColor: "{colors.binder-ink-dark}"
    rounded: "{rounded.page}"
    padding: "{spacing.page-pad}"
  button-download:
    backgroundColor: "{colors.accent-multicolony}"
    textColor: "{colors.card-stock}"
    rounded: "{rounded.card}"
    padding: "8px 16px"
    height: "48px"
  pill-tag:
    backgroundColor: "{colors.accent-multicolony}"
    textColor: "{colors.card-stock}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
    height: "24px"
  pill-status-stable:
    textColor: "{colors.stable-green}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  pill-status-preview:
    textColor: "{colors.caution-umber}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  caution:
    backgroundColor: "{colors.caution-cream}"
    textColor: "{colors.caution-umber}"
    rounded: "{rounded.caution}"
    padding: "8px 10px"
  insert:
    backgroundColor: "{colors.card-stock}"
    textColor: "{colors.card-ink}"
    rounded: "{rounded.card}"
    padding: "22px 20px"
  need-index-row:
    textColor: "{colors.binder-ink}"
    padding: "6px 2px"
    height: "46px"
  theme-toggle:
    textColor: "{colors.binder-ink}"
    rounded: "{rounded.toggle}"
    size: "44px"
---

# Design System: Timbermods

## Overview

**Creative North Star: "The Collector's Binder"**

The hub is a card collector's desk. A felt mat is the page; dark PVC binder pages with three punched ring holes sit on it; each page holds clear sleeves, and each sleeve holds one trading card, one per mod. The binder only holds the cards. Every card is printed in its own mod's colours with art taken from that mod's own site, so a player who arrives from one mod's site recognises it at once. The hub has no brand accent of its own: its chrome is felt, PVC, ink and card stock, and all the colour on the page belongs to the mods.

Density is catalogue-like but calm: a cover with the name set huge in Anybody and a "find by need" index (one row per need, each ending in the mod's name beside a tiny card swatch in its colour), then three binder pages grouped by need, then a shared install sheet and a footer that stamps when the release data last changed. Every card carries the same fields in the same places, like the back of a sewing pattern, so cards compare at a glance. Surfaces are real, produced textures (procedural felt, pebbled PVC, a sleeve sheen made by `assets/img/make_textures.py`); card art is a crop of each mod's own site art. The one moving thing is the sleeve sheen.

The world deliberately refuses the catalogue template it replaced: parchment and forest green, identical dark banners on every card, soft-shadow rounded cards, a hero stat strip.

**Key Characteristics:**
- Neutral hub chrome (felt mat, PVC page, ink); all hue comes from the mods' own accents.
- One card per mod: light stock framed 6px in the mod's accent, the mod's own art in a 16:10 window.
- Fixed card fields in a fixed order on every card.
- Anybody 700/800 for names, headings, pills and numerals; system-ui for reading.
- A single motion: the sleeve sheen slides on hover or focus, and stops under reduced motion.
- Light and dark themes (OS preference, overridable by the toggle); card stock stays light in both.

## Colors

A neutral desk of felt, PVC and ink, lit only by eight borrowed mod accents.

### Primary
There is no hub primary. The eight **mod accents** are card inputs, not hub colours: each is set per card through the `--c` custom property (inline `style="--c:#…"` on the card article and on its need-index entry) and drives that card's frame, art-window backing, tag pill, fact bullets, download button, title underline on hover and the need-index swatch. Each value is taken from the mod's own site:
- **Stability Fork Red** (accent-stability-fork): BeaverBuddies Stability Fork.
- **MultiColony Teal** (accent-multicolony): BeaverBuddies MultiColony.
- **MixedStorage Brass** (accent-mixedstorage): MixedStorage.
- **Work Areas Gold** (accent-persistent-work-areas): Persistent Work Areas.
- **Housing Blue** (accent-optimized-local-housing): Optimized Local Housing.
- **Performance Violet** (accent-late-game-performance): Late Game Performance.
- **Tipsy Tail Aqua** (accent-tipsy-tail): The Tipsy Tail.
- **Pathing Cobalt** (accent-hungry-pathing): Hungry Pathing.

White card-stock text sits on every accent (download button, tag pill), so an accent must hold at least 4.5:1 against white; all eight do at rest.

### Neutral
- **Felt Mat** (felt-mat / felt-mat-dark): the page background under a tiled felt texture; also the colour punched through the ring holes and the 404 button's text.
- **Binder Ink** (binder-ink / binder-ink-dark): text on the mat, header and footer; the heavy 1.5px top rules of the need index and install notes.
- **Slate Muted** (slate-muted / slate-muted-dark): secondary text on the mat (facts line, section leads, footer); the toggle's ring. The dark value doubles as muted text on the PVC page.
- **Mat Rule** (mat-rule / mat-rule-dark): 1px dividers on the mat (header, footer, install, index rows).
- **PVC Page** (pvc-page / pvc-page-dark): the binder page under a pebbled-grain texture. In dark mode the page lifts to the lighter value so it still reads off the darker felt. Page text is binder-ink-dark, secondary page text slate-muted-dark, in both themes.
- **Card Stock** (card-stock): the card, the insert and the install-steps sheet, in both themes.
- **Card Ink / Card Muted / Card Rule** (card-ink, card-muted, card-rule): text, secondary text and 1px dividers on card stock.
- **Ledger Blue** (ledger-blue / ledger-blue-dark): links on the mat; ledger-blue is also the light-theme focus ring and the fixed link colour on card stock.
- **Focus Lamp** (focus-lamp-dark): the 3px focus ring in dark mode.
- **Caution Cream / Caution Umber** (caution-cream, caution-umber): the caution note on a card; umber is also the Preview/Beta status pill.
- **Stable Green** (stable-green): the Stable status pill.

### Named Rules
**The Own Colours Rule.** Each card keeps its own mod's accent, passed in as `--c` and taken from that mod's own site. The hub never recolours a card, never gives two mods one accent to tidy the palette, and never introduces a hub accent that competes with them. A new mod's card gets its accent from its own site.

**The Light Stock Rule.** Card stock stays light (card-stock) in dark mode, with its own ink, muted and rule colours, and its own link colour (the card sets `--link` back to ledger-blue) so dark-theme link blue never lands on light stock.

**The Binder Holds Rule.** Felt, PVC and ink are the hub's only colours. The logo is the one place hub chrome shows mod accents (a fanned hand of three cards), and it uses them as cards, not as a brand colour.

## Typography

**Display Font:** Anybody 800 and 700, self-hosted woff2 (OFL), with Arial Narrow and sans-serif as fallbacks
**Body Font:** system-ui stack
**Label/Mono Font:** Anybody 700 for pills; ui-monospace stack for code

**Character:** Anybody's wide, heavy grotesque reads like the printed name on a trading card and the stamped title on a binder; the system body keeps long card copy plain and quick to read.

### Hierarchy
- **Display** (800, clamp(3.2rem, 7.5vw, 6rem), 0.9, -0.03em): the binder cover's "Timbermods" only, split over two lines on wide screens and one on narrow. The 404 headline uses the same face at clamp(2.4rem, 6vw, 4rem), line-height 1.
- **Headline** (800, clamp(1.7rem, 3.2vw, 2.4rem), 1.05): binder page titles and section titles.
- **Title** (800, 1.35rem, 1.08): mod names on cards and the insert heading; also the brand wordmark. Install step titles use 800 at 1.15rem.
- **Title small** (700, 1.05rem, 1.2): the need index heading and install notes headings; the need index's mod names use 700 at 0.95rem.
- **Numeral** (800, 2.6rem, 1): install step numbers.
- **Body** (400, 1.0625rem, 1.6): mat copy; the cover lead is 1.15rem at 46ch, section leads 64ch.
- **Body card** (0.88 to 1.02rem): the tagline is 750 at 1.02rem, the blurb 0.95rem in card-muted, facts 0.92rem, the status line 0.88rem italic.
- **Label** (700, 0.78rem, 0.02em): tag and status pills. Sentence case, never uppercase-tracked.

### Named Rules
**The Two Weights Rule.** Only Anybody 700 and 800 ship; do not ask for another weight or face. Anybody sets names, headings, pills and numerals; running text is always the system stack.

## Layout

A centred column (wrap, max 1180px, gutter clamp(16px, 4vw, 32px)). The cover is a two-column grid (0.9fr / 1.1fr): name, lead and facts line on the left, the need index on the right. The binder follows: one page per need group, each page padded wide on its spine side (clamp(52px, 6vw, 72px)) to leave room for the ring holes, holding a grid of pockets: three across, two at 1000px and below, one at 620px and below. Cards in a row stretch to equal height; the requirements line takes the free space (margin-top auto) so download buttons line up along a row.

A page with an empty pocket fills it with a printed **insert** (the co-op choice explained); inserts hide below 1000px, where their content would only repeat. At 860px and below the cover, install steps and install notes collapse to one column. At 620px and below the art window narrows to 16:7, sleeves tighten to 4px, the page spine padding drops to 32px with the holes at 7px, and the download button keeps its label, version and size on one line.

Tap targets are at least 44px (nav links, toggle, card links, need rows at 46px, download at 48px).

## Elevation & Depth

Depth is physical, not decorative: a stack of real objects on a desk. The PVC page casts one soft shadow on the felt; each sleeve casts a smaller one on the page; card stock sits flat inside its sleeve. The sleeve's own transparency (a 7% white fill, a 16% white edge brighter along the top at 30%) and the sheen texture make it read as clear plastic. Ring holes are punched through to the mat colour with a dark inner lip.

### Shadow Vocabulary
- **Page on felt** (`box-shadow: 0 18px 30px -22px rgba(0, 0, 0, .7)`): binder pages only.
- **Sleeve on page** (`box-shadow: 0 6px 14px -8px rgba(0, 0, 0, .6)`): sleeves only.

### Named Rules
**The One Motion Rule.** The sleeve sheen is the only motion: on hover or focus-within it slides from the top right to the bottom left and brightens (opacity 0.4 to 0.6, 0.7s, cubic-bezier(.2, .8, .2, 1)). Under reduced motion every transition and animation stops, and smooth scrolling with them. Nothing else animates, enters or parallaxes.

## Shapes

Card-like corners throughout, rounding outward as objects get larger and softer: swatch 2px, code 3px, caution 6px, card and buttons 8px, page 10px, sleeve 12px, pills fully round, the theme toggle a circle. Frames are thick and flat (the card's 6px accent border, continued as a 6px band under the art window; the insert's 6px double rule in card-rule). Lists are ruled, not boxed: 1px rules between rows, a heavier 1.5px ink rule on top. The need index swatch is a tiny card (11 by 15px, 2px corners) in the mod's accent with a pale inner border, echoing the sleeved card.

## Components

### Card (signature)
Trading card stock framed in its mod's accent.
- **Corner Style:** 8px, overflow clipped.
- **Background:** card-stock, card-ink text, in both themes.
- **Border:** 6px solid `--c`.
- **Fixed fields, in order:** art window (the mod's own site art, 16:10, links to the mod's site, hidden from assistive tech and tab order) / meta row (tag pill in `--c`, status pill filled by script) / name (links to the mod's site; underline in `--c` on hover) / tagline / blurb / three facts with `--c` dots / optional caution / optional status line / Requires line / download button with its note / Website, GitHub, Release notes links.
- **Internal Padding:** 14px 16px 16px (12px 14px 14px on phones).

### Sleeve
A clear plastic sleeve around each card, 7px beyond the stock (4px on phones), 12px corners, translucent white fill and edge, the sleeve shadow, and the sheen overlay (the One Motion Rule).

### Binder page
Dark PVC with the pebbled texture, 10px corners, a faint edge (35% black light, 9% white dark), the page shadow, and three ring holes down the spine side: 72px from the top, the middle, and 72px from the bottom, whatever the page's height. Title and lead in page ink and page muted.

### Buttons
- **Download (primary):** fills `--c`, white text 750 weight, 8px corners, min 48px tall, 8px 16px padding, a stroked download arrow, then the version label and a lighter size figure. Hover darkens the fill (brightness .9), which keeps white text above 4.5:1 on every accent. Focus is the global 3px focus ring offset 3px.
- **404 return:** the same button filled with binder ink, text in the mat colour.
- **Theme toggle:** a 44px circle with a 1px muted ring, transparent; sun or moon stroke icon per theme; hover fills with the code tint.

### Chips (pills)
- **Tag:** filled `--c`, white text, label type, fully round, min 24px.
- **Status:** outlined 1.5px in current colour on stock: stable-green for Stable, caution-umber for Preview or a maturity label such as Beta or Young mod. Hidden until release data resolves.

### Caution
Caution-cream panel, umber text at 0.9rem, 6px corners, 8px 10px padding, a stroked warning-triangle SVG. Its label begins with the card's maturity word.

### Insert
A printed card-stock slip in a sleeve's spare pocket: 6px double card-rule border, 8px corners, a title, a ruled definition list whose terms carry a small mod-accent swatch, and a closing line under a 1.5px ink rule.

### Navigation
- **Header:** brand (logo plus Anybody wordmark) left; Mods, Install, GitHub as 650-weight ink text links (underline on hover), then the theme toggle. Wraps on phones.
- **Need index:** a legend: one ruled row per need, the need in 600 weight on the left and the mod name in Anybody 700 with its accent swatch on the right (stacked on phones). The 404 page reuses it to list each mod's own site.

### Install sheet
A single card-stock sheet split into three numbered steps (dividers between, stacking on narrow screens), followed by three install notes under ink top rules on the mat.

### Markup contract (JS and test hooks)
The markup must keep these hooks; `assets/site.js` reads them and `scripts/test-site.mjs` checks them. `data/releases.json` is written by the scheduled bot and is never edited by hand.
- `article.card[data-repo][data-asset]` on every mod card and nowhere else; `data-maturity` on every card that carries a caution, equal to the caution's label (it replaces Stable in the status pill).
- Inside each card: `[data-download]` (an `a.btn` whose fallback href is the repo's Releases page, containing `.btn-label` and `[data-size]`), `[data-note]` (aria-live), `[data-status]` (a hidden pill), `[data-notes]` (release-notes link, fallback to Releases), and an `h3` with the mod name.
- `[data-generated]` in the footer for the release-data stamp.
- Fragment ids `#top`, `#mods`, `#install` and the eight card ids; the theme key `tbmods.theme` applied before first paint.

## Do's and Don'ts

### Do:
- **Do** set every mod colour through `--c` on the card and its need-index entry, with the value taken from the mod's own site (the Own Colours Rule).
- **Do** keep card stock light in dark mode and keep the card's own link colour (the Light Stock Rule).
- **Do** give every card the same fields in the same order, and the mod's own site art in the art window.
- **Do** keep a new accent at 4.5:1 or better against white, since button and pill text is white on it.
- **Do** keep produced textures and card crops reproducible and carrying their provenance JSON beside them.
- **Do** keep the sheen the only motion and stop it under reduced motion (the One Motion Rule).
- **Do** keep tap targets at 44px or more and the 3px focus ring visible in both themes.

### Don't:
- **Don't** recolour cards to a hub palette, give cards one shared banner treatment, or add a hub brand accent.
- **Don't** bring back the replaced catalogue look: parchment and forest green, identical dark banners, soft-shadow rounded cards, a hero stat strip.
- **Don't** add Anybody weights or other display faces, or load fonts or assets from a CDN.
- **Don't** add animation beyond the sleeve sheen.
- **Don't** remove or rename the markup hooks, or edit `data/releases.json`.
