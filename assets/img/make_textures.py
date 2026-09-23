"""Makes the hub's surfaces: the collector's felt mat (light and dark), the binder page's grained PVC, and the soft
sheen of a clear card sleeve. Procedural (numpy and Pillow, fixed seeds); no source images and no generative model.
Tiles repeat. Run from this folder: python make_textures.py"""
import numpy as np
from PIL import Image, ImageFilter

def wrap_noise(rng, n, cell):
    g = rng.normal(0, 1, (n // cell, n // cell)); g = (g - g.min()) / (g.max() - g.min())
    big = np.tile(g, (3, 3))
    up = np.asarray(Image.fromarray((big * 255).astype(np.uint8)).resize((n * 3, n * 3), Image.BICUBIC), float) / 255
    return up[n:2 * n, n:2 * n] - .5

def felt(name, seed, base, amp):
    rng = np.random.default_rng(seed); N = 512
    # nap: short fibres, the noise stretched about 2x along one direction before the blur, then tiled back to N
    fib = rng.normal(0, 1, (N, N // 2))
    fib = np.asarray(Image.fromarray(((fib - fib.min()) / (fib.max() - fib.min()) * 255).astype(np.uint8)).resize((N, N), Image.BICUBIC).filter(ImageFilter.GaussianBlur(.7)), float) / 255 - .5
    v = fib * amp * 2.4 + wrap_noise(rng, N, 64) * amp * .3 + wrap_noise(rng, N, 8) * amp * .7
    rgb = np.array(base, float) + v[..., None]
    Image.fromarray(rgb.clip(0, 255).astype(np.uint8)).save(name, quality=92, method=6); print("made", name)

felt("felt-light.webp", 7101, (220, 216, 207), 16)
felt("felt-dark.webp", 7102, (22, 23, 26), 10)

# the binder page: dark PVC with a fine pebbled grain; the dark theme's page is lifted off its darker felt
def binder(name, seed, base):
    rng = np.random.default_rng(seed); N = 256
    v = wrap_noise(rng, N, 4) * 14 + wrap_noise(rng, N, 16) * 6 + rng.normal(0, 2, (N, N))
    rgb = np.array(base, float) + v[..., None]
    Image.fromarray(rgb.clip(0, 255).astype(np.uint8)).save(name, quality=92, method=6); print("made", name)

binder("binder.webp", 7103, (29, 31, 35))
binder("binder-dark.webp", 7104, (42, 44, 49))

# the sleeve sheen: a soft diagonal band of cool light with alpha, laid over a sleeve and moved on hover or focus
W, H = 600, 840
yy, xx = np.mgrid[0:H, 0:W].astype(float)
d = (xx / W * .8 + yy / H * .6) - .7
band = np.exp(-(d / .09) ** 2) * 110 + np.exp(-((d - .22) / .03) ** 2) * 44
img = np.zeros((H, W, 4)); img[..., 0] = 230; img[..., 1] = 236; img[..., 2] = 245; img[..., 3] = band
Image.fromarray(img.clip(0, 255).astype(np.uint8), "RGBA").save("sheen.webp", quality=80, method=6); print("made sheen.webp")
