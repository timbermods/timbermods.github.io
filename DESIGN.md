---
name: Timbermods
description: The org hub for Timbermods' Timberborn mods, a lodge wall of walnut boards with a panel for each mod.
colors:
  pine-green: "#2f5d3a"
  fern-light: "#a9d8a3"
  lantern-gold: "#f0d27a"
  walnut: "#56402a"
  walnut-night: "#3a291b"
  walnut-edge: "rgba(40, 26, 14, .55)"
  walnut-edge-night: "rgba(0, 0, 0, .5)"
  walnut-label: "#f4ead6"
  walnut-label-muted: "#decdab"
  brass-nail: "#c19a5b"
  brass-nail-night: "#a88650"
  birch-ground: "#e0d2b4"
  forest-floor: "#1a211a"
  lodge-ink: "#2a2118"
  lodge-ink-night: "#ece3cf"
  tanned-leather: "#5b4a37"
  lichen-grey: "#bdb39c"
  birch-seam: "#bca77f"
  moss-seam: "#3b4636"
  warm-paper: "#f5ecd9"
  moss-panel: "#243126"
  paper-ink: "#2a2118"
  paper-muted: "#5d4c39"
  moss-panel-muted: "#b8b19b"
  paper-rule: "#dccdab"
  moss-panel-rule: "#38493b"
  code-wash: "rgba(42, 33, 24, .08)"
  code-wash-night: "rgba(236, 227, 207, .09)"
  stable-green: "#2c6536"
  stable-green-night: "#9fd49a"
  preview-amber: "#7a4a06"
  preview-amber-night: "#f0c070"
  caution-wash: "#f4dfb3"
  caution-ink: "#663a04"
  caution-wash-night: "#3b301b"
  caution-ink-night: "#f1cf8b"
  log-end: "#e0c79a"
  log-ring: "#c7a878"
  mod-stability-fork: "#b8322a"
  mod-timber-together: "#1a6a77"
  mod-late-game-performance: "#5b3fd0"
  mod-optimized-local-housing: "#2d5f9a"
  mod-hungry-pathing: "#1d4a86"
  mod-mixedstorage: "#8a6a2c"
  mod-persistent-work-areas: "#8a6512"
  mod-tipsy-tail: "#1a6773"
typography:
  display:
    fontFamily: "Anybody, Arial Narrow, sans-serif"
    fontSize: "clamp(3.2rem, 7.5vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.03em"
  display-lost:
    fontFamily: "Anybody, Arial Narrow, sans-serif"
    fontSize: "clamp(2.4rem, 6vw, 4rem)"
    fontWeight: 800
    lineHeight: 1
  headline:
    fontFamily: "Anybody, Arial Narrow, sans-serif"
    fontSize: "clamp(1.7rem, 3.2vw, 2.4rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  numeral:
    fontFamily: "Anybody, Arial Narrow, sans-serif"
    fontSize: "2.6rem"
    fontWeight: 800
    lineHeight: 1
  title:
    fontFamily: "Anybody, Arial Narrow, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  title-sm:
    fontFamily: "Anybody, Arial Narrow, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 800
    lineHeight: 1.2
  subhead:
    fontFamily: "Anybody, Arial Narrow, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.01em"
  label:
    fontFamily: "Anybody, Arial Narrow, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.02em"
  lead:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.92rem"
    fontWeight: 400
    lineHeight: 1.6
  tagline:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.02rem"
    fontWeight: 750
    lineHeight: 1.6
  mono:
    fontFamily: "ui-monospace, Cascadia Code, SF Mono, Consolas, Liberation Mono, monospace"
    fontSize: "0.9em"
rounded:
  hairline: "3px"
  md: "6px"
  lg: "8px"
  pill: "999px"
  round: "50%"
spacing:
  gutter: "clamp(16px, 4vw, 32px)"
  wrap: "1180px"
  panel-gap: "clamp(14px, 2vw, 22px)"
  panel-body: "14px 16px 16px"
  board: "clamp(24px, 3vw, 36px) clamp(18px, 3vw, 36px) clamp(26px, 3vw, 38px)"
  board-gap: "clamp(24px, 4vw, 40px)"
  section: "clamp(40px, 6vw, 72px)"
  tap: "44px"
  button: "48px"
components:
  walnut-board:
    backgroundColor: "{colors.walnut}"
    textColor: "{colors.walnut-label}"
    rounded: "{rounded.lg}"
    padding: "{spacing.board}"
  walnut-board-night:
    backgroundColor: "{colors.walnut-night}"
    textColor: "{colors.walnut-label}"
  mod-panel:
    backgroundColor: "{colors.warm-paper}"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.lg}"
  mod-panel-night:
    backgroundColor: "{colors.moss-panel}"
    textColor: "{colors.lodge-ink-night}"
  mod-panel-body:
    padding: "{spacing.panel-body}"
  button-download:
    backgroundColor: "{colors.mod-timber-together}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
    height: "{spacing.button}"
  pill-category:
    backgroundColor: "{colors.mod-timber-together}"
    textColor: "#ffffff"
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
    textColor: "{colors.preview-amber}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
  caution:
    backgroundColor: "{colors.caution-wash}"
    textColor: "{colors.caution-ink}"
    rounded: "{rounded.md}"
    padding: "8px 10px"
  caution-night:
    backgroundColor: "{colors.caution-wash-night}"
    textColor: "{colors.caution-ink-night}"
  notice:
    backgroundColor: "{colors.warm-paper}"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.lg}"
    padding: "22px 20px"
  steps-sheet:
    backgroundColor: "{colors.warm-paper}"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.md}"
    padding: "22px 24px"
  need-row:
    textColor: "{colors.lodge-ink}"
    height: "46px"
    padding: "6px 2px"
  nav-link:
    textColor: "{colors.lodge-ink}"
    height: "{spacing.tap}"
    padding: "0 12px"
  theme-toggle:
    textColor: "{colors.lodge-ink}"
    rounded: "{rounded.round}"
    size: "{spacing.tap}"
  button-home:
    backgroundColor: "{colors.pine-green}"
    textColor: "{colors.birch-ground}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
    height: "{spacing.button}"
  button-home-night:
    backgroundColor: "{colors.fern-light}"
    textColor: "{colors.forest-floor}"
---

# Design System: Timbermods

## Overview

**Creative North Star: "The Lodge Wall"**

The hub is the wall of a beaver lodge where the mods hang. By day the wall is pale birch boards; at night it is a dark forest floor. Each group of mods (Play together, Big colonies, Build and plan) is mounted on its own walnut board, held at the corners by four brass nail heads, and each mod is a panel nailed to that board: warm paper by day, moss green at night, framed in the mod's own colour and headed by the picture taken from that mod's own site. A player who arrived from one mod's site finds its colour and picture again at once.

The palette is brown, green and wood: birch, walnut, brass, pine and moss. Pine green is the hub's own voice (links, the second line of the wordmark, the step numerals, the logo's tree); the eight mod colours belong to the mods and appear only on their own panels and swatches. Type is a wide, heavy grotesque (Anybody 800) for names and headings over the system sans for reading. The wall is still: no hover lifts, no entrances, no transitions.

The maintainer rejected the previous "Collector's Binder" look (felt, dark PVC binder pages, clear sleeves, sheen, white card stock, a card-fan logo) as too black and white. None of it returns.

**Key Characteristics:**
- Textured ground: birch boards by day (`birch.webp`), forest floor at night (`forest-floor.webp`), both procedural from `assets/img/make_textures.py`.
- One walnut board per group, with four brass nail heads drawn in CSS.
- One panel per mod, framed 5px in the mod's own colour, its own picture as the banner.
- Pine green for the hub's links and wordmark; mod colours only on their own mod.
- Light and dark themes from the OS preference, overridable by the header toggle and remembered in `localStorage` (`tbmods.theme`).
- No motion beyond smooth anchor scrolling, which reduced-motion turns off.

## Colors

A woodland palette: pale birch and dark forest floor for the ground, walnut and brass for the boards, warm paper or moss for the panels, and pine green for everything the hub itself says.

### Primary
- **Pine Green** (pine-green, by day; **Fern Light**, fern-light, at night): every link on the ground and in panels, the green second line of the "Timber / mods" wordmark, the install step numerals, the 404's home button, the logo's pine and the focus ring by day. It is the hub's colour, never a mod's.
- **Lantern Gold** (lantern-gold): the focus ring at night only, where pine would vanish into moss.

### Secondary
- **Walnut** (walnut by day, walnut-night at night, under `walnut.webp` / `walnut-dark.webp`): the board behind each group. Its heading and lead are in **Walnut Label** (walnut-label) and **Walnut Label Muted** (walnut-label-muted) in both themes; its edge is walnut-edge / walnut-edge-night.
- **Brass Nail** (brass-nail, brass-nail-night): the four nail heads on every board, with a pale highlight and a dark rim.

### Tertiary
- **The mod colours** (mod-stability-fork through mod-tipsy-tail): each is taken from that mod's own site and set as `--c` on its panel, its need-index swatch and its notice entry. On the panel it colours the 5px frame, the banner backing, the category pill, the download button and the fact bullets. White text on each passes AA (5.0:1 or more).

### Neutral
- **Birch Ground** (birch-ground) / **Forest Floor** (forest-floor): the page ground under its texture, and the `theme-color` for each scheme.
- **Lodge Ink** (lodge-ink / lodge-ink-night): text on the ground.
- **Tanned Leather** (tanned-leather) / **Lichen Grey** (lichen-grey): secondary text on the ground, the toggle's ring.
- **Birch Seam** (birch-seam) / **Moss Seam** (moss-seam): rules on the ground (header, footer, install, need rows).
- **Warm Paper** (warm-paper) / **Moss Panel** (moss-panel): the mod panels, the notice and the install steps sheet. Panel text is paper-ink by day, lodge-ink-night at night; secondary panel text paper-muted / moss-panel-muted; rules inside panels paper-rule / moss-panel-rule.
- **Stable Green** and **Preview Amber** (with night values): the status pill's outline and text.
- **Caution Wash / Caution Ink** (with night values): the caution strip on beta and young mods.
- **Code Wash** (code-wash / code-wash-night): inline code and the toggle's hover fill.
- **Log End** and **Log Ring** (log-end, log-ring): only in the logo, a log end with two growth rings inside a walnut rim, the pine standing on it.

### Named Rules
**The Own Colour Rule.** A mod's colour comes from its own site and appears only on that mod's panel, swatch and notice entry. The hub never invents a mod's colour and never uses one mod's colour for another or for itself.

**The Pine Voice Rule.** Pine green (fern light at night) is the only colour the hub speaks in: links, the wordmark's second line, numerals, the logo's tree. It is never a mod's frame.

**The Brown and Green Rule.** Grounds, boards and panels stay in wood, brass, paper and moss. No black or white surfaces; pure white appears only as text on a mod colour.

## Typography

**Display Font:** Anybody 700 and 800, self-hosted woff2 under OFL (with Arial Narrow, sans-serif)
**Body Font:** the system sans stack (system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial)
**Label/Mono Font:** Anybody 700 for pills and need targets; the system monospace stack for paths only

**Character:** A wide, sturdy grotesque with the weight of a carved sign for names and headings, over a plain reading sans that stays out of the way.

### Hierarchy
- **Display** (800, clamp(3rem, 7.2vw, 6.4rem), 0.9; clamp(2.6rem, 13vw, 3.4rem) under 620px): the "Timbermods" wordmark over the valley's sky, one line, "mods" in pine. The 404 uses display-lost (800, clamp(2.4rem, 6vw, 4rem), 1).
- **Headline** (800, clamp(1.7rem, 3.2vw, 2.4rem), 1.05): board titles and section titles.
- **Numeral** (800, 2.6rem, 1): install step numbers, in pine.
- **Title** (800, 1.35rem, 1.08): mod names on panels, the notice title, the header wordmark (at line-height 1). Title-sm (800, 1.15rem) for install step titles.
- **Subhead** (700, 1.05rem, 1.2): the need index heading and the install notes headings.
- **Label** (700, 0.78rem, 1, +0.02em): category and status pills. Need-index targets use Anybody 700 at 0.95rem.
- **Body** (400, 1.0625rem, 1.6): reading text; the cover lead is 1.15rem at 46ch max, section leads 64ch max. Panel text runs smaller: tagline (750, 1.02rem), blurb 0.95rem, facts 0.92rem, notes and requirements 0.85 to 0.9rem.

### Named Rules
**The Two Faces Rule.** Anybody for anything that names or heads; the system sans for anything that is read. No third face; monospace only for file paths.

## Layout

A single centred column 1180px wide with a fluid gutter (clamp(16px, 4vw, 32px)). The order is fixed: header bar (min 68px, rule beneath), the valley with the wordmark, cover, three walnut boards, install, footer.

The valley runs the full width under the header (aspect 1280:360, min 230px, max 500px), with the wordmark over its sky at the top of the content column. Below it, the cover is two columns (0.9fr / 1.1fr): the lead and facts on the left, the need index on the right (rows of need and mod name, each mod name led by its colour swatch). Each board holds a head (title and lead, 760px max) and a grid of panels, three across, gap clamp(14px, 2vw, 22px), panels stretched to equal height with the download block pushed to the bottom. Where a board has a spare slot, a notice fills it (the Play together board's "Which one?"). Boards stack with clamp(24px, 4vw, 40px) between them. Install is a three-column steps sheet over three columns of notes.

Responsive: at 1000px the panels go two across and the notice spans the row; at 860px the cover, steps and notes collapse to one column and the wordmark runs on one line; at 620px the panels go one across, banners crop to 16:7, boards tighten (26px 12px 20px, 6px corners, nails inset 8px) and the download button stops wrapping. Interactive targets are at least 44px tall; download buttons 48px.

### Named Rules
**The One Board Per Group Rule.** Every group of mods gets its own walnut board; a mod panel never sits directly on the ground, and nothing but panels and a notice sits on a board.

## Elevation & Depth

Depth is physical and quiet: the board and the panels cast soft drop shadows as if hung on the wall, and the panel's short 2px ledge reads as the paper's thickness. Nothing lifts on hover.

### Shadow Vocabulary
- **Board** (`box-shadow: inset 0 1px 0 rgba(255, 236, 200, .12), 0 18px 30px -22px rgba(0, 0, 0, .7)`): a lit top edge and a long shadow under each walnut board.
- **Panel** (`box-shadow: 0 2px 0 rgba(0, 0, 0, .22), 0 12px 20px -12px rgba(0, 0, 0, .65)`): each mod panel and the notice.
- **Steps sheet** (`box-shadow: 0 2px 0 rgba(0, 0, 0, .12), 0 12px 24px -14px rgba(0, 0, 0, .45)`): the install sheet, lighter because it sits on the ground.
- **Button** (`box-shadow: inset 0 -2px 0 rgba(0, 0, 0, .2)`): a pressed-in bottom edge on the download button.
- **Nail head** (radial gradient, 14px, in each corner at 12px inset): pale highlight, brass head, dark rim.

### Named Rules
**The Still Wall Rule.** Nothing on the wall moves. There are no transitions or animations; hover changes only underline weight, a 10% darkening of the download button, or a faint wash on the toggle. Anchor links scroll smoothly, and reduced-motion turns that off.

## Shapes

Gently rounded, hand-built shapes: boards, panels, the notice and buttons at 8px (boards 6px on phones); the caution strip, steps sheet and skip link at 6px; code and swatches at 3px; pills fully round; the theme toggle a circle. Frames are thick and coloured: 5px in the mod's colour around each panel and under its banner, a 5px double rule in paper-rule around the notice. The logo is a round log end.

## Components

### Buttons
- **Shape:** gently rounded (8px), at least 48px tall.
- **Download:** the mod's colour with white text in the system sans at 750, a download-arrow icon, the version label and the size in a lighter weight. Its fallback link is the repo's Releases page until `site.js` fills in the release.
- **Hover / Focus:** `filter: brightness(.9)`, no transition; the 3px focus ring at 3px offset.
- **Home (404):** pine green with the ground colour as text (fern light with forest floor at night), inline.

### Chips
- **Category pill:** the mod's colour with white label text, 24px tall, left of the meta row.
- **Status pill:** a 1.5px outline in stable green or preview amber (`data-kind="preview"`), hidden until `site.js` knows the release. On a panel with a caution it shows the panel's `data-maturity` instead of Stable.

### Mod panels
- **Corner Style:** 8px, clipped.
- **Background:** warm paper by day, moss panel at night; text in panel ink.
- **Border:** 5px in the mod's own colour; the banner is the mod's own picture (16:10, 16:7 on phones) over a 5px bar of the same colour.
- **Shadow Strategy:** the Panel shadow.
- **Internal Padding:** 14px 16px 16px (12px 14px 14px on phones).
- **Order inside:** meta row (category and status pills), name, tagline, blurb, up to three facts with round bullets in the mod colour, then an optional caution or status line, requirements, the download block and a link row (Website first and bolder, GitHub, Release notes).

### The valley
The page opens on a river valley, the same scene as the org profile's banner: a beaver swimming home with a leafy branch past its stick lodge, above a dam of cut log ends, among pines and birches. It is a CSS background (`--vista`), so it follows the theme toggle: `img/valley-day.svg` in the light theme (pale sky, sun glow, clouds, sunlit water) and `img/valley-dusk.svg` in the dark one (dusk glow, moon, stars, fireflies). Both are drawn by `img/make_valley.py` (vector, fixed seed, no text). `background-position: 66% 100%` keeps the dam, the beaver and the lodge in view as narrow screens crop it. A mask fades it in from the page at the top (0 to 16%) and back out at the bottom (88% to 100%), so it sits in the ground rather than on it. It carries `role="img"` and a description. Nothing in it moves, and it shows no mod: it never needs updating when a mod changes.

### Walnut boards
Walnut under its grain texture, 8px corners, a thin dark edge, the Board shadow and four brass nails. The title and lead are in walnut label colours in both themes.

### Notice
A paper panel without a mod colour, framed by a 5px double rule: a title, a definition list whose entries carry a small square in each mod's colour, and a closing line over a 1.5px ink rule. Below 1000px it spans the whole row.

### Caution
A 6px-cornered strip in caution wash and ink with a stroked warning-triangle icon, for beta and young mods.

### Navigation
- **Header:** the logo and wordmark on the left; Mods, Install, GitHub as 44px-tall ink links (underline on hover) and the 44px round theme toggle (sun by day, moon at night) on the right.
- **Need index:** a list under a 1.5px ink rule; each 46px row pairs a need with a mod name led by a 12px swatch in the mod's colour ringed off the ground. The 404 reuses it with mod names only.

### Install steps
A paper sheet split into three steps by paper rules, each a pine numeral, title and short text; below it three notes, each under a 1.5px ink rule.

### Named Rules
**The Panel, Not Card Rule.** In user-facing text the mods are shown as panels, never "cards". The CSS classes `.card`, `.binder`, `.page`, `.pockets` and `.sleeve` are leftover names from the previous look. `.card` must stay: `assets/site.js` selects `.card[data-repo]` and `scripts/test-site.mjs` reads `<article class="card">`. The others are not read by either and are kept only to avoid churn.

### Markup contract (JS and test hooks)
`assets/site.js` reads these hooks and `scripts/test-site.mjs` (15 checks) tests them. `data/releases.json` is written by the scheduled bot and is never edited by hand.
- `article.card[data-repo][data-asset]` on every mod panel and nowhere else. `data-maturity` goes on every panel that carries a `.caution`, and equals the caution's label.
- Inside each panel: `[data-download]` (an `a.btn` whose fallback href is the repo's Releases page, containing `.btn-label` and `[data-size]`), `[data-note]` (aria-live), `[data-status]` (a hidden pill), `[data-notes]` (the release-notes link, falling back to Releases), and an `h3` with the mod name.
- `[data-generated]` in the footer for the release-data stamp.

## Do's and Don'ts

### Do:
- **Do** mount every group of mods on its own walnut board with four brass nails, and nail every mod to it as a panel framed 5px in its own colour.
- **Do** take each mod's colour and banner picture from that mod's own site (`assets/img/cards/<id>.webp`).
- **Do** keep pine green (fern light at night) for links, the wordmark's second line and numerals.
- **Do** define every themed token three times: in `:root`, under `prefers-color-scheme: dark` guarded by `:root:not([data-theme="light"])`, and under `:root[data-theme="dark"]`.
- **Do** regenerate the ground and board textures with `assets/img/make_textures.py` rather than editing the images.
- **Do** keep tap targets at 44px or more and the 3px focus ring visible in both themes.

### Don't:
- **Don't** bring back felt, dark PVC binder pages, clear sleeves, sheen, white card stock or the card-fan logo; the maintainer dropped that look.
- **Don't** use the word "card" in user-facing text.
- **Don't** use black or white surfaces; the wall is wood, brass, paper and moss.
- **Don't** give a mod pine green, or give the hub a mod's colour.
- **Don't** add hover lifts, transitions, entrances or parallax.
- **Don't** rename `.card`, remove the markup hooks, or edit `data/releases.json`.
