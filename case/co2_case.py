"""Parametrische behuizing voor LILYGO T-Display S3 + SCD30 CO2-sensor.

Genereert twee onderdelen voor de Bambu P2S (of elke andere FDM-printer):
  - front_shell.stl : voorkant + wanden, print met de voorkant op het bed
  - back_plate.stl  : achterplaat met standoffs, print met de buitenkant op het bed

Gebruik:
    pip install manifold3d trimesh numpy networkx lxml
    python co2_case.py

Alle maten in mm. Pas de parameters hieronder aan en draai het script opnieuw.
Assenstelsel: X = breedte, Y = hoogte (boven +), Z = diepte (voorkant op z=0,
naar achteren +). Let op: gezien van voren wijst +X naar links.
"""

from pathlib import Path

import numpy as np
import trimesh
from manifold3d import Manifold

# ---------------------------------------------------------------- parameters
WALL = 2.0  # zijwanden
FRONT = 2.0  # dikte voorplaat
BACK = 2.5  # dikte achterplaat
CORNER_R = 4.0  # afronding buitenhoeken
DEPTH = 24.0  # diepte front shell (incl. voorplaat), achterplaat komt erachter

# T-Display S3 (PCB) en display
TD_PCB = (56.5, 28.8)  # glas + frame (gemeten met schuifmaat), lengte x breedte
TD_USB_EXT = 6.0  # PCB met USB-C steekt zoveel uit voorbij het frame aan de USB-kant
TD_CLEAR = 0.5  # speling rondom in de pocket
TD_WINDOW = (44.0, 24.0)  # schermopening (actief gebied ~42.7 x 22.7)
TD_WINDOW_OFFSET = -0.5  # beeldmidden t.o.v. midden van het frame, + = weg van USB
TD_FRAME_H = 5.0  # hoogte van de positioneerrand rond de PCB
TD_BACK_Z = 8.5  # geschatte z van de achterkant van de PCB (vanaf voorkant behuizing)
USB_SIDE = "left"  # "right" of "left", gezien van voren (left past bij rotation: 270)
USB_CUT = (12.0, 7.0)  # USB-C opening (breedte y, hoogte z)
USB_Z = 7.5  # midden van de USB-C opening in z
BUTTON_D = 4.0  # gaten voor de knoppen BOOT en IO14
BUTTON_BEYOND_FRAME = 3.5  # knopcentrum voorbij het frame, richting USB
BUTTON_FROM_MID = 10.0  # afstand knopcentrum tot hartlijn van de PCB

# SCD30: Seeed Grove SCD30 v1.0 (Grove-raster 20 mm), sensormodule naar voren,
# Grove-connector naar de USB-kant
SENS_PCB = (60.0, 40.0)  # lengte x breedte
SENS_CLEAR = 1.0
SENS_STANDOFF_H = 5.0
SENS_HOLES = [(10.0, 38.0), (50.0, 38.0), (2.0, 10.0), (58.0, 10.0)]  # t.o.v. board-hoek (x vanaf de kant weg van de USB), patroon is symmetrisch
SENS_HOLE_D = 1.7  # M2 zelftappend

# Schroeven behuizing (M3 zelftappend, 4x ~16 mm)
BOSS_R = 3.5
BOSS_HOLE_D = 2.6
BOSS_HOLE_DEPTH = 14.0
SCREW_D = 3.4
SCREW_HEAD_D = 6.2

# ------------------------------------------------------------ afgeleide maten
INNER_W = 78.0
W = INNER_W + 2 * WALL
SENS_COMP = (WALL, WALL + SENS_PCB[1] + SENS_CLEAR + 4)  # y-bereik sensorvak
DIVIDER = (SENS_COMP[1], SENS_COMP[1] + 2.0)
TD_POCKET_Y0 = DIVIDER[1] + 1.0
TD_POCKET = (TD_PCB[0] + TD_CLEAR, TD_PCB[1] + TD_CLEAR)
H = TD_POCKET_Y0 + TD_POCKET[1] + 2 * BOSS_R + 3.0
BOSS_C = WALL + BOSS_R - 0.8  # iets in de wand, anders raken ze alleen tangentieel
BOSSES = [(BOSS_C, BOSS_C), (W - BOSS_C, BOSS_C), (BOSS_C, H - BOSS_C), (W - BOSS_C, H - BOSS_C)]

# display-pocket tegen de USB-wand (+X); bij USB rechts wordt alles gespiegeld
TD_X1 = W - WALL - 0.5 - TD_USB_EXT  # USB-kant van het frame
TD_X0 = TD_X1 - TD_POCKET[0]
TD_YC = TD_POCKET_Y0 + TD_POCKET[1] / 2
TD_XC = (TD_X0 + TD_X1) / 2
WIN_XC = TD_XC - TD_WINDOW_OFFSET

SENS_X0 = 9.5  # ruimte aan de connectorkant voor de Grove-stekker
SENS_Y0 = WALL + 2.0


# ------------------------------------------------------------------- helpers
def box(x0, y0, z0, x1, y1, z1):
    return Manifold.cube([x1 - x0, y1 - y0, z1 - z0]).translate([x0, y0, z0])


def cyl(cx, cy, z0, h, r, segs=48):
    return Manifold.cylinder(h, r, r, segs).translate([cx, cy, z0])


def cone(cx, cy, z0, h, r0, r1, segs=48):
    return Manifold.cylinder(h, r0, r1, segs).translate([cx, cy, z0])


def rounded_box(x0, y0, z0, x1, y1, z1, r):
    pts = [(x0 + r, y0 + r), (x1 - r, y0 + r), (x0 + r, y1 - r), (x1 - r, y1 - r)]
    return Manifold.batch_hull([cyl(x, y, z0, z1 - z0, r) for x, y in pts])


def union(parts):
    return Manifold.batch_boolean(parts, manifold3d_op("Add"))


def manifold3d_op(name):
    import manifold3d

    return getattr(manifold3d.OpType, name)


# --------------------------------------------------------------- front shell
def front_shell():
    outer = rounded_box(0, 0, 0, W, H, DEPTH, CORNER_R)
    cavity = rounded_box(WALL, WALL, FRONT, W - WALL, H - WALL, DEPTH + 1, 2.0)
    shell = outer - cavity

    adds = []
    # schroefbussen
    for x, y in BOSSES:
        adds.append(cyl(x, y, FRONT, DEPTH - FRONT, BOSS_R))
    # scheidingswand tussen sensor (koel) en ESP32 (warm)
    adds.append(box(WALL, DIVIDER[0], FRONT, W - WALL, DIVIDER[1], DEPTH))
    # positioneerrand rond het glas/frame van de T-Display (open aan de USB-kant)
    t = 1.2
    y0, y1 = TD_POCKET_Y0, TD_POCKET_Y0 + TD_POCKET[1]
    z1 = FRONT + TD_FRAME_H
    adds += [
        box(TD_X0 - t, y0 - t, FRONT, TD_X1, y0, z1),
        box(TD_X0 - t, y1, FRONT, TD_X1, y1 + t, z1),
        box(TD_X0 - t, y0 - t, FRONT, TD_X0, y1 + t, z1),
    ]
    shell = union([shell] + adds)

    cuts = []
    # schroefgaten in de bussen
    for x, y in BOSSES:
        cuts.append(cyl(x, y, DEPTH - BOSS_HOLE_DEPTH, BOSS_HOLE_DEPTH + 1, BOSS_HOLE_D / 2))
    # schermvenster met afschuining naar buiten
    ww, wh = TD_WINDOW
    ch = 1.0
    cuts.append(
        Manifold.batch_hull(
            [
                box(WIN_XC - ww / 2 - ch, TD_YC - wh / 2 - ch, -1.0, WIN_XC + ww / 2 + ch, TD_YC + wh / 2 + ch, 0.0),
                box(WIN_XC - ww / 2, TD_YC - wh / 2, ch, WIN_XC + ww / 2, TD_YC + wh / 2, FRONT + 0.01),
            ]
        )
    )
    # knoppen
    bx = TD_X1 + BUTTON_BEYOND_FRAME
    for dy in (-BUTTON_FROM_MID, BUTTON_FROM_MID):
        cuts.append(cyl(bx, TD_YC + dy, -1, FRONT + 2, BUTTON_D / 2))
    # USB-C opening in de wand aan de USB-kant (+X)
    uw, uh = USB_CUT
    r = uh / 2
    cuts.append(
        Manifold.batch_hull(
            [
                cyl(0, 0, 0, WALL + 2, r).rotate([0, 90, 0]).translate([W - WALL - 1, TD_YC + sgn * (uw / 2 - r), USB_Z])
                for sgn in (-1, 1)
            ]
        )
    )
    # draaddoorvoer in scheidingswand (bij de USB-kant, daar zit de I2C-connector)
    cuts.append(box(W - WALL - 22, DIVIDER[0] - 1, DEPTH - 7, W - WALL - 10, DIVIDER[1] + 1, DEPTH + 1))

    # ventilatie sensorvak: voorkant
    sy = np.arange(SENS_COMP[0] + 6, SENS_COMP[1] - 4, 4.0)
    for y in sy:
        cuts.append(box(W / 2 - 22, y - 1, -1, W / 2 + 22, y + 1, FRONT + 1))
    # ventilatie sensorvak: zijwanden
    for y in sy:
        cuts.append(box(-1, y - 1, FRONT + 4, WALL + 1, y + 1, DEPTH - 4))
        cuts.append(box(W - WALL - 1, y - 1, FRONT + 4, W + 1, y + 1, DEPTH - 4))
    # ventilatie sensorvak: onderkant
    for x in np.arange(14, W - 14 + 0.1, 4.0):
        cuts.append(box(x - 1, -1, FRONT + 4, x + 1, WALL + 1, DEPTH - 4))
    # ventilatie ESP32-vak: bovenkant (warmte weg)
    for x in np.arange(18, W - 18 + 0.1, 4.0):
        cuts.append(box(x - 1, H - WALL - 1, FRONT + 6, x + 1, H + 1, DEPTH - 4))

    return shell - union(cuts)


# ---------------------------------------------------------------- back plate
def back_plate():
    """Gemodelleerd in assemblagepositie (z = DEPTH .. DEPTH+BACK)."""
    z0 = DEPTH
    plate = rounded_box(0, 0, z0, W, H, z0 + BACK, CORNER_R)

    adds = []
    # standoffs voor de SCD30 (wijzen naar voren, -z)
    for hx, hy in SENS_HOLES:
        adds.append(cyl(SENS_X0 + hx, SENS_Y0 + hy, z0 - SENS_STANDOFF_H, SENS_STANDOFF_H, 2.75))
    # drukpennen die de T-Display tegen de voorkant houden
    pin_z = TD_BACK_Z + 0.3
    for px in (TD_X0 + 4, TD_X1 - 10):
        for py in (TD_POCKET_Y0 + 2.5, TD_POCKET_Y0 + TD_POCKET[1] - 2.5):
            adds.append(cyl(px, py, pin_z, z0 - pin_z, 1.6))
    plate = union([plate] + adds)

    cuts = []
    for hx, hy in SENS_HOLES:
        cuts.append(cyl(SENS_X0 + hx, SENS_Y0 + hy, z0 - SENS_STANDOFF_H - 1, SENS_STANDOFF_H + BACK - 0.6, SENS_HOLE_D / 2))
    # verzonken schroefgaten
    for x, y in BOSSES:
        cuts.append(cyl(x, y, z0 - 1, BACK + 2, SCREW_D / 2))
        cuts.append(cone(x, y, z0 + BACK - 1.5, 1.51, SCREW_D / 2, SCREW_HEAD_D / 2))
    # sleutelgaten voor wandmontage (schroefkop max ~7 mm)
    ky = TD_YC
    for kx in (W / 2 - 20, W / 2 + 20):
        cuts.append(cyl(kx, ky - 3, z0 - 1, BACK + 2, 4.0))
        cuts.append(box(kx - 2.0, ky - 3, z0 - 1, kx + 2.0, ky + 4, z0 + BACK + 1))
    # ventilatie achter de sensor
    for y in np.arange(SENS_COMP[0] + 8, SENS_COMP[1] - 6, 5.0):
        cuts.append(box(W / 2 - 15, y - 1, z0 - 1, W / 2 + 15, y + 1, z0 + BACK + 1))
    return plate - union(cuts)


# ---------------------------------------------------------------------- main
def to_trimesh(m):
    mesh = m.to_mesh()
    return trimesh.Trimesh(vertices=np.asarray(mesh.vert_properties)[:, :3], faces=np.asarray(mesh.tri_verts), process=False)


def mirror_x(m):
    return m.mirror([1, 0, 0]).translate([W, 0, 0])


def main(out_dir=Path(__file__).parent / "stl"):
    out_dir.mkdir(exist_ok=True)
    shell, back = front_shell(), back_plate()
    # het basismodel heeft de USB aan +X = links gezien van voren
    if USB_SIDE == "right":
        shell, back = mirror_x(shell), mirror_x(back)

    # printoriëntatie: shell met voorkant op het bed; achterplaat omgedraaid
    back_print = back.rotate([0, 180, 0]).translate([0, 0, DEPTH + BACK])
    back_print = back_print.translate([-back_print.bounding_box()[0], 0, 0])

    for name, part in (("front_shell", shell), ("back_plate", back_print)):
        tm = to_trimesh(part)
        assert tm.is_watertight, name
        tm.export(out_dir / f"{name}.stl")
        print(f"{name}: {tm.bounds[1] - tm.bounds[0]} mm, watertight={tm.is_watertight}")

    # assemblage voor controle
    to_trimesh(union([shell, back])).export(out_dir / "assembly_preview.stl")

    # 3MF voor Bambu Studio: beide onderdelen naast elkaar op de plaat
    scene = trimesh.Scene()
    scene.add_geometry(to_trimesh(shell), node_name="front_shell", geom_name="front_shell")
    scene.add_geometry(to_trimesh(back_print.translate([W + 10, 0, 0])), node_name="back_plate", geom_name="back_plate")
    scene.export(out_dir / "co2_case.3mf")
    print(f"buitenmaat: {W:.1f} x {H:.1f} x {DEPTH + BACK:.1f} mm")


if __name__ == "__main__":
    main()
