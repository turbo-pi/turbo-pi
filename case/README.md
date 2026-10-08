# CO2-meter behuizing (T-Display S3 + SCD30)

Parametrisch model in `co2_case.py`. Opnieuw genereren:

```
pip install manifold3d trimesh numpy networkx lxml
python co2_case.py
```

Onderdelen in `stl/`:

| Bestand | Printoriëntatie |
|---|---|
| `co2_case.3mf` | beide onderdelen al goed op de plaat, voor Bambu Studio |
| `front_shell.stl` | voorkant op het bed |
| `back_plate.stl` | buitenkant op het bed (pennen omhoog) |
| `assembly_preview.stl` | alleen ter controle, niet printen |

Printen (Bambu P2S): PLA of PETG, 0,2 mm laag, 3 wanden, 15 % infill, geen support.

Benodigd: 4x M3 x 16 zelftappend (behuizing), 4x M2 x 6 zelftappend (Grove SCD30).

Ontwerp: de SCD30 zit in een apart, geventileerd vak onder de ESP32, gescheiden door een
wand, zodat de warmte van de ESP32 de temperatuur-/CO2-meting zo min mogelijk beïnvloedt.
