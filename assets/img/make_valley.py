"""Draws the valley at the top of the page: valley-day.svg (light theme) and valley-dusk.svg (dark theme), 1280x360.
A river valley with a beaver dam of cut log ends, a stick lodge, and a beaver swimming home with a leafy branch, among
pines and birches. No text: the page's own title sits over the sky. The same scene (same seed, same order of drawing)
is the org profile's banner, drawn by timbermods/.github profile/make_banner.py; change both together.

Vector, procedural (fixed seed), no source images and no generative model. Run from this folder:
    python make_valley.py
"""
import math, os, random

HERE = os.path.dirname(os.path.abspath(__file__))
W, H = 1280, 360
rnd = random.Random()
f1 = lambda v: f"{v:.1f}".rstrip("0").rstrip(".")

DUSK = dict(
    sky=[(0, "#0d1a14"), (.5, "#16281e"), (.78, "#2a3a26"), (1, "#3a3f26")],
    glow=("#eaa94f", .62, "#b8743a", .22), night=True, clouds=False,
    ridge="#1d3226", far="#223829", valley="#1b3023", left="#15261b",
    pond=[(0, "#7c6c3c"), (.22, "#3f5a3f"), (1, "#1c3029")], river=[(0, "#445a3e"), (.06, "#364f39"), (1, "#1c3029")],
    surface=("#e6c885", .55), river_surface=("#d6c28a", .35), ripple=("#cfdcc0", .22), mist=("#f3e3b8", .12),
    bank_left="#111e17", bank_right="#18271c", grass_left="#2c4a2e", grass_right="#2f5230",
    wake="#e6dbb8", seep="#a9cfc0", foam="#d8e8dd", grain=.9,
    crown=["#4f7a3a", "#5f8a44", "#6f9a4a", "#557f3e", "#8fb35e", "#a3c46a"],
)
DAY = dict(
    sky=[(0, "#b7d2cc"), (.45, "#d2e1d1"), (.75, "#ebdfbf"), (1, "#f2d9a6")],
    glow=("#fff1c7", .8, "#f6d99a", .3), night=False, clouds=True,
    ridge="#97b391", far="#89a884", valley="#56845a", left="#5f8a57",
    pond=[(0, "#e6dcb6"), (.22, "#93b3a0"), (1, "#4d7f73")], river=[(0, "#a3bfab"), (.06, "#80a594"), (1, "#4d7f73")],
    surface=("#fff6dc", .8), river_surface=("#fff6dc", .6), ripple=("#ffffff", .4), mist=("#ffffff", .22),
    bank_left="#4d6e3c", bank_right="#577c44", grass_left="#76a052", grass_right="#82ad5b",
    wake="#ffffff", seep="#eaf6f0", foam="#ffffff", grain=.5,
    crown=["#6f9a4a", "#7fa855", "#8fb35e", "#76a04e", "#a3c46a", "#b8d47c"],
)


def stops(pairs):
    return "".join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in pairs)


def pine(x, base, h, colour, tiers=3):
    w = h * .42
    out = [f'<rect x="{f1(x - h * .025)}" y="{f1(base - h * .12)}" width="{f1(h * .05)}" height="{f1(h * .12)}" fill="{colour}"/>']
    for i in range(tiers):
        top = base - h + i * h * .24
        bot = top + h * .46
        hw = w * (.34 + .22 * i)
        out.append(f'<path d="M{f1(x)} {f1(top)} L{f1(x + hw)} {f1(bot)} L{f1(x - hw)} {f1(bot)} Z" fill="{colour}"/>')
    return "".join(out)


def round_tree(x, base, h, colour):
    r = h * .32
    trunk = f'<rect x="{f1(x - 2)}" y="{f1(base - h * .4)}" width="4" height="{f1(h * .4)}" fill="{colour}"/>'
    blobs = "".join(f'<circle cx="{f1(x + dx * r)}" cy="{f1(base - h + r + dy * r)}" r="{f1(r * s)}" fill="{colour}"/>'
                    for dx, dy, s in [(0, 0, 1), (-.7, .5, .8), (.7, .45, .85), (0, .9, .9)])
    return trunk + blobs


def treeline(x0, x1, base_fn, hmin, hmax, colour, step=(10, 18), round_share=0.0):
    out, x = [], x0
    while x < x1:
        h = rnd.uniform(hmin, hmax)
        base = base_fn(x)
        out.append(round_tree(x, base, h * .8, colour) if rnd.random() < round_share else pine(x, base, h, colour))
        x += rnd.uniform(*step)
    return "".join(out)


def ridge_y(x):
    y = 214 - 16 * math.sin(x / 150) - 9 * math.sin(x / 61 + 1.3)
    if x < 470:
        y0 = 214 - 16 * math.sin(470 / 150) - 9 * math.sin(470 / 61 + 1.3)
        y = y0 + (470 - x) * .45
    return y


DAM = [(598, 306), (620, 290), (640, 270), (662, 254), (690, 247), (722, 248), (746, 254), (766, 262), (778, 306)]


def inside(px, py, poly):
    c = False
    for (x1, y1), (x2, y2) in zip(poly, poly[1:] + poly[:1]):
        if (y1 > py) != (y2 > py) and px < (x2 - x1) * (py - y1) / (y2 - y1) + x1:
            c = not c
    return c


def log_end(cx, cy, r):
    rings = "".join(f'<circle cx="{f1(cx)}" cy="{f1(cy)}" r="{f1(r * k)}" fill="none" stroke="#b58a52" stroke-width="1"/>'
                    for k in (.62, .36) if r * k > 2.2)
    return (f'<circle cx="{f1(cx)}" cy="{f1(cy)}" r="{f1(r)}" fill="#5a3b24"/>'
            f'<circle cx="{f1(cx - .5)}" cy="{f1(cy - .5)}" r="{f1(r - 2.2)}" fill="#dcb378"/>' + rings +
            f'<circle cx="{f1(cx)}" cy="{f1(cy)}" r="1.4" fill="#8a6444"/>')


def dam(P):
    pts = " ".join(f"{x},{y}" for x, y in DAM)
    placed = []
    for _ in range(2600):
        r = rnd.uniform(6, 14)
        x, y = rnd.uniform(600, 776), rnd.uniform(248, 306)
        if not inside(x, y, DAM) or any(math.hypot(x - a, y - b) < r + c - 2.5 for a, b, c in placed):
            continue
        placed.append((x, y, r))
    placed.sort(key=lambda p: p[1])
    logs = "".join(log_end(*p) for p in placed)
    sticks = "".join(
        f'<path d="M{f1(x)} {f1(y)} l{f1(math.cos(a) * L)} {f1(math.sin(a) * L)}" stroke="{c}" stroke-width="{f1(sw)}" stroke-linecap="round"/>'
        for x, y, a, L, c, sw in [(rnd.uniform(630, 760), rnd.uniform(246, 262), rnd.uniform(-3.4, -2.8) if rnd.random() < .5 else rnd.uniform(-.35, .25), rnd.uniform(16, 30),
                                    rnd.choice(["#5a3d26", "#6b4a30", "#7a5536"]), rnd.uniform(2.2, 3.6)) for _ in range(7)])
    seep = "".join(f'<path d="M{f1(x)} {f1(y)} q-4 {f1((306 - y) / 2)} -{f1(8 + i * 3)} {f1(306 - y)}" fill="none" stroke="{P["seep"]}" stroke-width="1.6" stroke-linecap="round" opacity=".6"/>'
                   for i, (x, y) in enumerate([(648, 268), (634, 282), (662, 262), (620, 292)]))
    foam = "".join(f'<ellipse cx="{f1(x)}" cy="306" rx="{f1(rx)}" ry="1.8" fill="{P["foam"]}" opacity=".5"/>' for x, rx in [(596, 14), (612, 8), (628, 10)])
    return (f'<clipPath id="damclip"><polygon points="{pts}"/></clipPath><polygon points="{pts}" fill="#2f2117"/>'
            f'<g clip-path="url(#damclip)">{logs}</g>{sticks}{seep}{foam}')


def lodge():
    d = "M998 263 C1002 216 1038 197 1074 197 C1110 197 1146 216 1152 263 Z"
    sticks = []
    for _ in range(70):
        x, y = rnd.uniform(996, 1154), rnd.uniform(196, 264)
        a, L = rnd.uniform(-.9, .9) + (math.pi if rnd.random() < .5 else 0), rnd.uniform(16, 38)
        c = rnd.choice(["#5a3d26", "#6b4a30", "#7d5838", "#8e6640", "#4a3120"])
        sticks.append(f'<path d="M{f1(x)} {f1(y)} l{f1(math.cos(a) * L)} {f1(math.sin(a) * L)}" stroke="{c}" stroke-width="{f1(rnd.uniform(2.6, 4.4))}" stroke-linecap="round"/>')
    mud = "".join(f'<ellipse cx="{f1(rnd.uniform(1012, 1138))}" cy="{f1(rnd.uniform(214, 256))}" rx="{f1(rnd.uniform(6, 13))}" ry="{f1(rnd.uniform(3, 6))}" fill="#2a1d13" opacity=".55"/>' for _ in range(7))
    poke = "".join(f'<path d="M{f1(x)} {f1(y)} l{f1(dx)} {f1(dy)}" stroke="#6b4a30" stroke-width="3" stroke-linecap="round"/>'
                   for x, y, dx, dy in [(1060, 202, -10, -14), (1084, 200, 12, -12), (1072, 199, 2, -17), (1026, 214, -14, -8), (1122, 214, 13, -9)])
    leaves = "".join(f'<ellipse cx="{f1(x)}" cy="{f1(y)}" rx="4.5" ry="2.2" fill="{c}" transform="rotate({a} {f1(x)} {f1(y)})"/>'
                     for x, y, a, c in [(1052, 190, -30, "#6f9d45"), (1094, 190, 25, "#7fae52"), (1016, 206, -40, "#5f8f3e")])
    reflection = f'<g opacity=".08" transform="translate(0 526) scale(1 -1)"><path d="{d}" fill="#3f2b1c"/></g>'
    return (f'<clipPath id="lodgeclip"><path d="{d}"/></clipPath>{reflection}<path d="{d}" fill="#3d2a1b"/>'
            f'<g clip-path="url(#lodgeclip)">{"".join(sticks)}{mud}</g>{poke}{leaves}')


BEAVER = """<g>
  <path d="M846 262 C834 250 812 247 794 251" stroke="#6b4a30" stroke-width="3" fill="none" stroke-linecap="round"/>
  <ellipse cx="800" cy="246" rx="6" ry="2.8" fill="#7aa84f" transform="rotate(-25 800 246)"/>
  <ellipse cx="808" cy="252" rx="6" ry="2.8" fill="#5f8f3e" transform="rotate(20 808 252)"/>
  <ellipse cx="818" cy="245" rx="6" ry="2.8" fill="#86b35a" transform="rotate(-35 818 245)"/>
  <ellipse cx="826" cy="251" rx="5.5" ry="2.6" fill="#6f9d45" transform="rotate(15 826 251)"/>
  <ellipse cx="793" cy="252" rx="5" ry="2.4" fill="#6f9d45" transform="rotate(10 793 252)"/>
  <path d="M876 263 C879 251 902 246 920 252 C929 255 934 259 936 263 Z" fill="#5f3f29"/>
  <path d="M884 256 C896 250 910 250 919 253" stroke="#8a6040" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>
  <ellipse cx="954" cy="263" rx="15" ry="2.6" fill="#33221a"/>
  <path d="M856 263 C852 252 858 243 870 242 C882 241 889 249 887 263 Z" fill="#6e4a31"/>
  <ellipse cx="852" cy="258" rx="8" ry="5.6" fill="#8a6143"/>
  <ellipse cx="846.5" cy="255.5" rx="2.8" ry="2.1" fill="#1d130c"/>
  <circle cx="863" cy="250" r="2.1" fill="#1d130c"/><circle cx="863.7" cy="249.3" r=".7" fill="#f3e3b8"/>
  <circle cx="874" cy="244.5" r="3.2" fill="#553823"/>
  <rect x="848.5" y="261" width="3.4" height="3.2" rx=".6" fill="#f0e3c4"/>
</g>"""


def wake(colour):
    return "".join(f'<path d="M{x} {y} q{dx / 2} {q} {dx} 0" fill="none" stroke="{colour}" stroke-width="1.3" opacity="{o}" stroke-linecap="round"/>'
                   for x, y, dx, q, o in [(938, 266, 44, 2, .5), (975, 269, 50, 2, .38), (1018, 272, 56, 2, .26), (934, 259, 38, -2, .42),
                                          (968, 256, 46, -2, .3), (842, 266, 22, 2, .45), (812, 268, 26, 2, .3)])


def birch(x, base, h, lean, crown):
    marks = "".join(f'<rect x="{f1(x - 3.5 + lean * (base - y) / h)}" y="{f1(y)}" width="{f1(rnd.uniform(3, 6))}" height="1.8" fill="#2a2118"/>'
                    for y in range(int(base - h + 20), int(base - 8), 13))
    trunk = f'<path d="M{f1(x - 3.5)} {base} L{f1(x - 2.5 + lean)} {f1(base - h)} L{f1(x + 2.5 + lean)} {f1(base - h)} L{f1(x + 3.5)} {base} Z" fill="#ece4d2"/>'
    blobs = "".join(f'<ellipse cx="{f1(x + lean + dx)}" cy="{f1(base - h + dy)}" rx="{rx}" ry="{ry}" fill="{c}"/>'
                    for (dx, dy, rx, ry), c in zip([(-16, 8, 20, 16), (14, 4, 22, 17), (-2, -12, 22, 18), (4, 20, 18, 14), (-8, -2, 14, 11), (12, -6, 10, 8)], crown))
    return trunk + marks + blobs


def stump(bank):
    return f"""<path d="M1120 360 L1128 326 C1160 314 1220 308 1280 306 L1280 360 Z" fill="{bank}"/>
<path d="M1150 324 L1152 290 C1158 286 1170 286 1176 290 L1178 322 Z" fill="#6b4a30"/>
<path d="M1151 292 L1164 266 L1177 292 C1170 296 1158 296 1151 292 Z" fill="#dcb378"/>
<path d="M1164 266 L1177 292 C1173 294 1169 295 1166 295 Z" fill="#c1965c"/>
<path d="M1157 286 l4 -3 M1160 279 l3 -2 M1170 283 l3 2 M1167 276 l2 2" stroke="#a97d47" stroke-width="1.1" stroke-linecap="round"/>
<path d="M1156 304 v14 M1164 302 v16 M1172 304 v12" stroke="#553823" stroke-width="1.3" stroke-linecap="round"/>
<g fill="#dcb378"><path d="M1136 322 l7 -3 1 4 z"/><path d="M1184 318 l8 -1 -1 4 z"/><path d="M1196 322 l5 -4 3 4 z"/><path d="M1142 328 l8 0 -3 4 z"/><path d="M1188 326 l6 -2 0 4 z"/></g>"""


def grass(x0, x1, base_fn, colour, n):
    out = []
    for _ in range(n):
        x = rnd.uniform(x0, x1)
        b = base_fn(x)
        h = rnd.uniform(5, 12)
        out.append(f'<path d="M{f1(x)} {f1(b)} l{f1(rnd.uniform(-3, 3))} -{f1(h)} M{f1(x + 2)} {f1(b)} l{f1(rnd.uniform(-1, 4))} -{f1(h * .8)}" stroke="{colour}" stroke-width="1.6" stroke-linecap="round"/>')
    return "".join(out)


def build(P, label):
    rnd.seed(1280360)  # the banner's seed and drawing order: the same valley
    stars = "".join(f'<circle cx="{f1(rnd.uniform(620, 1180))}" cy="{f1(rnd.uniform(14, 120))}" r="{f1(rnd.uniform(.7, 1.5))}" fill="#f3e3b8" opacity="{f1(rnd.uniform(.3, .75))}"/>' for _ in range(22))
    night = ""
    if P["night"]:
        flies = "".join(f'<circle cx="{f1(x)}" cy="{f1(y)}" r="2.2" fill="#ffd98a" filter="url(#glow)"/><circle cx="{f1(x)}" cy="{f1(y)}" r="1.1" fill="#fff4cf"/>'
                        for x, y in [(420, 262), (468, 244), (515, 270), (560, 252), (1172, 236), (1190, 262), (944, 226), (596, 232)])
        night = stars + '<path d="M1196 44 a19 19 0 1 0 17 26 a15 15 0 1 1 -17 -26 Z" fill="#f3e3b8" opacity=".85"/>'
    else:
        flies = ""
    clouds = ""
    if P["clouds"]:
        clouds = '<g fill="#ffffff" opacity=".55" filter="url(#soft)">' + "".join(
            f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}"/>' for x, y, rx, ry in
            [(760, 70, 70, 14), (800, 62, 44, 12), (1060, 44, 90, 15), (1110, 36, 50, 12), (560, 96, 60, 10), (1210, 110, 46, 9)]) + "</g>"
    left_bank = lambda x: 334 + 5 * math.sin(x / 70)
    c0, o0, c1, o1 = P["glow"]
    ripples = "".join(f'<path d="M{x} {y} h{w}" stroke="{P["ripple"][0]}" stroke-width="1" opacity="{P["ripple"][1]}" stroke-linecap="round"/>'
                      for x, y, w in [(470, 314, 60), (380, 320, 44), (540, 322, 36), (1000, 290, 70), (1120, 300, 50), (860, 296, 40), (230, 318, 50)])
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="{label}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">{stops(P["sky"])}</linearGradient>
    <radialGradient id="light" cx="980" cy="240" r="470" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="{c0}" stop-opacity="{o0}"/><stop offset=".4" stop-color="{c1}" stop-opacity="{o1}"/><stop offset="1" stop-color="{c1}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="pond" x1="0" y1="262" x2="0" y2="360" gradientUnits="userSpaceOnUse">{stops(P["pond"])}</linearGradient>
    <linearGradient id="river" x1="0" y1="304" x2="0" y2="360" gradientUnits="userSpaceOnUse">{stops(P["river"])}</linearGradient>
    <radialGradient id="mist"><stop offset="0" stop-color="{P["mist"][0]}" stop-opacity="{P["mist"][1]}"/><stop offset="1" stop-color="{P["mist"][0]}" stop-opacity="0"/></radialGradient>
    <filter id="glow" x="-3" y="-3" width="7" height="7"><feGaussianBlur stdDeviation="2.4"/></filter>
    <filter id="soft" x="-.5" y="-1" width="2" height="3"><feGaussianBlur stdDeviation="6"/></filter>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7"/>
      <feColorMatrix type="matrix" values="0 0 0 0 .95  0 0 0 0 .88  0 0 0 0 .7  0 0 0 .07 0"/>
    </filter>
  </defs>
  <rect width="{W}" height="{H}" fill="url(#sky)"/>
  <rect width="{W}" height="{H}" fill="url(#light)"/>
  {night}{clouds}
  <path d="M300 360 L300 {f1(ridge_y(300))} {" ".join(f"L{x} {f1(ridge_y(x))}" for x in range(300, 1290, 10))} L1280 360 Z" fill="{P["ridge"]}"/>
  {treeline(330, 1280, ridge_y, 16, 32, P["far"], step=(8, 13))}
  {treeline(770, 1290, lambda x: 263, 60, 128, P["valley"], step=(12, 22), round_share=.28)}
  <rect x="740" y="262" width="540" height="98" fill="url(#pond)"/>
  <path d="M740 262.5 H1280" stroke="{P["surface"][0]}" stroke-width="1.2" opacity="{P["surface"][1]}"/>
  <ellipse cx="1010" cy="258" rx="300" ry="20" fill="url(#mist)"/>
  {lodge()}
  {wake(P["wake"])}
  {BEAVER}
  {dam(P)}
  {treeline(-6, 600, lambda x: 305, 26, 58, P["left"], step=(9, 16), round_share=.2)}
  <rect x="0" y="304" width="790" height="56" fill="url(#river)"/>
  <path d="M0 304.5 H596" stroke="{P["river_surface"][0]}" stroke-width="1" opacity="{P["river_surface"][1]}"/>
  {ripples}
  <path d="M0 360 L0 {f1(left_bank(0))} {" ".join(f"L{x} {f1(left_bank(x))}" for x in range(0, 470, 10))} L470 360 Z" fill="{P["bank_left"]}"/>
  {grass(4, 460, left_bank, P["grass_left"], 60)}
  {stump(P["bank_right"])}
  {grass(1128, 1276, lambda x: 322 - (x - 1128) * .1, P["grass_right"], 26)}
  {birch(1222, 314, 196, 4, P["crown"])}
  {birch(1252, 311, 158, -3, P["crown"])}
  {flies}
  <rect width="{W}" height="{H}" filter="url(#grain)" opacity="{P["grain"]}"/>
</svg>
'''


if __name__ == "__main__":
    scene = "a beaver swims home with a leafy branch past its stick lodge, above a dam of logs, among pines and birches."
    for name, P, when in [("valley-day.svg", DAY, "A river valley by day: "), ("valley-dusk.svg", DUSK, "A river valley at dusk: ")]:
        svg = build(P, when + scene)
        open(os.path.join(HERE, name), "w", encoding="utf-8").write(svg)
        print("made", name, len(svg) // 1024, "KB")
