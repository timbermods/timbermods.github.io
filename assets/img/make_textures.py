"""Makes the hub's surfaces: the ground (pale birch boards by day, a dark forest floor at night) and the walnut
boards each group of mods is mounted on (a day and a night tone). Procedural (numpy and Pillow, fixed seeds); no
source images and no generative model. Tiles repeat. Run from this folder: python make_textures.py"""
import numpy as np
from PIL import Image, ImageFilter


def wrap_noise(rng, n, cell):
    g = rng.normal(0, 1, (n // cell, n // cell)); g = (g - g.min()) / (g.max() - g.min())
    big = np.tile(g, (3, 3))
    up = np.asarray(Image.fromarray((big * 255).astype(np.uint8)).resize((n * 3, n * 3), Image.BICUBIC), float) / 255
    return up[n:2 * n, n:2 * n] - .5


def grain(rng, n, stretch):
    """Wood grain: noise stretched hard along the boards, then softened; tiles because it wraps."""
    g = rng.normal(0, 1, (n, max(4, n // stretch)))
    g = (g - g.min()) / (g.max() - g.min())
    wide = np.tile(g, (1, 3))
    img = Image.fromarray((wide * 255).astype(np.uint8)).resize((n * 3, n), Image.BICUBIC).filter(ImageFilter.GaussianBlur(.6))
    return np.asarray(img, float)[:, n:2 * n] / 255 - .5


def boards(name, seed, base, amp, plank, seam, tone):
    """Horizontal boards `plank` px tall, each a little lighter or darker, with a dark seam between them."""
    rng = np.random.default_rng(seed); N = 512
    v = grain(rng, N, 24) * amp * 2.2 + grain(rng, N, 64) * amp * 1.2 + wrap_noise(rng, N, 32) * amp * .5
    for top in range(0, N, plank):
        v[top:top + plank] += rng.uniform(-tone, tone)
    v[(np.arange(N) % plank) < 2] -= seam
    rgb = np.array(base, float) + v[..., None] * np.array([1.0, .86, .7])
    Image.fromarray(rgb.clip(0, 255).astype(np.uint8)).save(name, quality=90, method=6); print("made", name)


def floor(name, seed, base, amp):
    """The night ground: a dark forest floor, fine speckle over soft patches of moss and earth."""
    rng = np.random.default_rng(seed); N = 512
    v = rng.normal(0, 1, (N, N)) * .25 + wrap_noise(rng, N, 64) * 1.2 + wrap_noise(rng, N, 8) * .8
    moss = wrap_noise(rng, N, 128)
    rgb = np.array(base, float) + v[..., None] * amp
    rgb[..., 1] += moss * amp * 1.6
    rgb[..., 0] -= moss * amp * .6
    Image.fromarray(rgb.clip(0, 255).astype(np.uint8)).save(name, quality=90, method=6); print("made", name)


boards("birch.webp", 8101, (224, 210, 180), 10, 128, 16, 4)       # the day ground: pale birch boards
floor("forest-floor.webp", 8102, (26, 33, 26), 8)                  # the night ground
boards("walnut.webp", 8103, (86, 60, 40), 16, 96, 22, 6)           # the group boards, day
boards("walnut-dark.webp", 8104, (58, 41, 28), 12, 96, 16, 5)      # the group boards, night
