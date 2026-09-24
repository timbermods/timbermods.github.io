"""Recaptures card art for the hub from each mod's live site: assets/img/cards/<card-id>.webp (960x600, cover-fit).

Each card's art is the signature element of that mod's own site, so when a mod's site changes its look, recapture its
card: python scripts/card-art.py [card-id ...]   (no ids = all eight)
Needs Python with playwright and Pillow, and Microsoft Edge installed (it drives the installed Edge).
Afterwards record provenance for each changed file with Impeccable's embed-prompt (see CLAUDE.md).
Once the new art is live, re-render the org profile's images too: in timbermods/.github, python profile/make_images.py.
"""
import io, os, sys
from playwright.sync_api import sync_playwright
from PIL import Image

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "img", "cards")
SITE = "https://timbermods.github.io/"
# card id -> (page, CSS selector of the signature element, or None to use the clip rectangle)
# cards taken from their site's dark mode (Kyler, 2026-09-24: Timber Together's darker map reads better)
DARK = {"timber-together"}
# extra CSS for a capture: Hungry Pathing's board without its slate texture (it read as smoke)
CSS = {"hungry-pathing": ".board, .shift { background-image: none !important; }"}
# steps run on the page before the capture: Persistent Work Areas pins the Farmhouse too, so two outlines show
SETUP = {"persistent-work-areas": """
    document.querySelector('svg.map g.bld[aria-label="Select Farmhouse"]').dispatchEvent(new MouseEvent('click', {bubbles: true}));
    document.querySelector('.ui-toggle').click();
    document.querySelector('[data-deselect]').click();
    document.activeElement && document.activeElement.blur();
"""}
JOBS = {
    "beaverbuddies-stability-fork": (SITE + "BeaverBuddies-Stability-Fork/", ".coop-map", None),
    "timber-together": (SITE + "TimberTogether/", ".hero figure", None),
    "mixedstorage": (SITE + "MixedStorage/", "[data-cabinet]", None),
    "persistent-work-areas": (SITE + "PersistentWorkAreas/", "svg.map", None),
    "optimized-local-housing": (SITE + "OptimizedLocalHousing/", "svg.hall", None),
    "late-game-performance": (SITE + "LateGamePerformance/", ".board", None),
    "the-tipsy-tail": (SITE + "timberborn-tipsy-tail/", ".bar-top img", None),
    "hungry-pathing": (SITE + "HungryPathing/", "svg.shift", None),
}

ids = sys.argv[1:] or list(JOBS)
with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge")
    for card in ids:
        url, sel, clip = JOBS[card]
        page = browser.new_page(viewport={"width": 1440, "height": 900}, color_scheme="dark" if card in DARK else "light", reduced_motion="reduce", device_scale_factor=1.5)
        page.goto(url, wait_until="networkidle")
        if card in SETUP:
            page.evaluate(SETUP[card])
        if card in CSS:
            page.add_style_tag(content=CSS[card])
        page.wait_for_timeout(600)
        png = page.locator(sel).first.screenshot() if sel else page.screenshot(clip=clip)
        page.close()
        im = Image.open(io.BytesIO(png)).convert("RGB")
        tw, th = 960, 600
        s = max(tw / im.width, th / im.height)
        im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
        left, top = (im.width - tw) // 2, (im.height - th) // 2
        im.crop((left, top, left + tw, top + th)).save(os.path.join(OUT, card + ".webp"), quality=82, method=6)
        print("captured", card)
    browser.close()
