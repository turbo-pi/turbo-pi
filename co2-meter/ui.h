// Ronde UI voor de CO2-meter (466x466 AMOLED).
// Wordt door co2-meter.yaml via `esphome: includes:` ingeladen.
#pragma once
#include <algorithm>
#include <cmath>
#include <cstdio>
#include <cstring>
#include "esphome.h"

namespace ui {

using esphome::Color;
using Display = esphome::display::Display;
using Font = esphome::font::Font;
using esphome::display::TextAlign;

// ---- Instellingen ---------------------------------------------------------
constexpr int CX = 233, CY = 233;           // middelpunt
constexpr float CO2_MIN = 400.0f;           // begin van de gauge (ppm)
constexpr float CO2_MAX = 2000.0f;          // einde van de gauge (ppm)
constexpr float CO2_OK = 800.0f;            // daarboven "Matig"
constexpr float CO2_WARN = 1200.0f;         // daarboven "Ventileer!"
constexpr int HIST_N = 144;                 // 144 punten x 5 min = 12 uur

// ---- Palet (AMOLED: zwarte achtergrond, verzadigde accenten) --------------
static const Color C_GREEN(0x2E, 0xD5, 0x73);
static const Color C_AMBER(0xFF, 0xB1, 0x2B);
static const Color C_RED(0xFF, 0x4D, 0x5A);
static const Color C_COOL(0x4F, 0xC3, 0xF7);
static const Color C_WARM(0xFF, 0x8A, 0x3D);
static const Color C_TEXT(0xF2, 0xF2, 0xF2);
static const Color C_MUTED(0x8A, 0x8F, 0x98);
static const Color C_GRID(0x2A, 0x2D, 0x33);

struct Fonts {
  Font *huge, *big, *med, *small, *tiny;
};

// ---- Historie -------------------------------------------------------------
struct Series {
  float v[HIST_N];
  Series() {
    for (auto &x : v) x = NAN;
  }
  void push(float x) {
    memmove(v, v + 1, sizeof(float) * (HIST_N - 1));
    v[HIST_N - 1] = x;
  }
  bool stats(float &mn, float &avg, float &mx) const {
    int n = 0;
    float sum = 0;
    mn = INFINITY;
    mx = -INFINITY;
    for (float x : v) {
      if (std::isnan(x)) continue;
      mn = std::min(mn, x);
      mx = std::max(mx, x);
      sum += x;
      n++;
    }
    if (!n) return false;
    avg = sum / n;
    return true;
  }
};
inline Series co2_hist, temp_hist;

// ---- Kleurhulpjes ---------------------------------------------------------
inline float clamp01(float t) { return t < 0 ? 0 : (t > 1 ? 1 : t); }

inline Color scale(Color c, float f) {
  f = clamp01(f);
  return Color((uint8_t)(c.r * f + 0.5f), (uint8_t)(c.g * f + 0.5f), (uint8_t)(c.b * f + 0.5f));
}

inline Color mix(Color a, Color b, float t) {
  t = clamp01(t);
  return Color((uint8_t)(a.r + (b.r - a.r) * t + 0.5f), (uint8_t)(a.g + (b.g - a.g) * t + 0.5f),
               (uint8_t)(a.b + (b.b - a.b) * t + 0.5f));
}

// Groen -> amber -> rood, vloeiend
inline Color co2_color(float ppm) {
  if (ppm <= 700) return C_GREEN;
  if (ppm <= 900) return mix(C_GREEN, C_AMBER, (ppm - 700) / 200);
  if (ppm <= 1100) return C_AMBER;
  if (ppm <= 1400) return mix(C_AMBER, C_RED, (ppm - 1100) / 300);
  return C_RED;
}

// Koel blauw -> groen -> oranje (comfortzone 20-24 graden)
inline Color temp_color(float c) {
  if (c <= 18) return C_COOL;
  if (c <= 21) return mix(C_COOL, C_GREEN, (c - 18) / 3);
  if (c <= 24) return C_GREEN;
  if (c <= 28) return mix(C_GREEN, C_WARM, (c - 24) / 4);
  return C_WARM;
}

inline const char *co2_label(float ppm) {
  if (std::isnan(ppm)) return "Opwarmen";
  if (ppm <= CO2_OK) return "Goede lucht";
  if (ppm <= CO2_WARN) return "Matige lucht";
  return "Ventileer!";
}

// ---- Gauge ----------------------------------------------------------------
// Ring van 270 graden (opening onderaan), met anti-aliasing en kleurverloop.
// Hoek theta: 0 = 12 uur, positief = met de klok mee.
inline void draw_gauge(Display &it, float ro, float ri, float ppm) {
  const float A0 = -2.35619449f;   // -135 graden
  const float SPAN = 4.71238898f;  // 270 graden
  const float DIM = 0.16f;         // helderheid van het (lege) spoor
  bool valid = !std::isnan(ppm);
  float frac = valid ? clamp01((ppm - CO2_MIN) / (CO2_MAX - CO2_MIN)) : 0;
  float tv = A0 + SPAN * frac;

  for (int y = CY - (int)ro - 1; y <= CY + (int)ro + 1; y++) {
    float dy = (float) (y - CY);
    float ady = std::fabs(dy);
    if (ady > ro + 1) continue;
    float xo = std::sqrt(std::max(0.0f, (ro + 1) * (ro + 1) - dy * dy));
    float xi = ady < ri - 1 ? std::sqrt((ri - 1) * (ri - 1) - dy * dy) : 0.0f;
    for (int side = -1; side <= 1; side += 2) {
      for (int k = (int) xi; k <= (int) xo; k++) {
        int x = CX + side * k;
        float dx = (float) (x - CX);
        float d = std::sqrt(dx * dx + dy * dy);
        float cov = std::min(d - ri, ro - d) + 0.5f;
        if (cov <= 0) continue;
        float th = std::atan2(dx, -dy);
        if (std::fabs(th) > -A0) continue;  // opening onderaan
        float at = CO2_MIN + (CO2_MAX - CO2_MIN) * (th - A0) / SPAN;
        bool on = valid && th <= tv;
        it.draw_pixel_at(x, y, scale(co2_color(at), clamp01(cov) * (on ? 1.0f : DIM)));
      }
    }
  }

  // Afgeronde uiteinden
  float rm = (ro + ri) / 2, cr = (ro - ri) / 2;
  auto cap = [&](float th, Color c) {
    it.filled_circle(CX + (int) std::lround(rm * std::sin(th)), CY - (int) std::lround(rm * std::cos(th)), (int) cr, c);
  };
  cap(A0, valid && frac > 0 ? co2_color(CO2_MIN) : scale(co2_color(CO2_MIN), DIM));
  if (frac < 1) cap(-A0, scale(co2_color(CO2_MAX), DIM));
  if (valid && frac > 0) cap(tv, co2_color(ppm));

  // Streepjes bij de drempels
  for (float t : {CO2_OK, CO2_WARN}) {
    float th = A0 + SPAN * (t - CO2_MIN) / (CO2_MAX - CO2_MIN);
    int x1 = CX + (int) std::lround((ri - 4) * std::sin(th)), y1 = CY - (int) std::lround((ri - 4) * std::cos(th));
    int x2 = CX + (int) std::lround((ri - 12) * std::sin(th)), y2 = CY - (int) std::lround((ri - 12) * std::cos(th));
    it.line(x1, y1, x2, y2, C_MUTED);
  }
}

inline void draw_dots(Display &it, int active, int n = 3) {
  int y = CY + 206;
  for (int i = 0; i < n; i++) {
    int x = CX + (i - (n - 1) / 2) * 18;
    if (i == active)
      it.filled_circle(x, y, 4, C_TEXT);
    else
      it.filled_circle(x, y, 3, scale(C_MUTED, 0.5f));
  }
}

// ---- Pagina 1: overzicht --------------------------------------------------
inline void draw_overview(Display &it, const Fonts &f, float ppm, float temp, float hum) {
  it.fill(Color::BLACK);
  bool valid = !std::isnan(ppm);
  Color accent = valid ? co2_color(ppm) : C_MUTED;

  draw_gauge(it, 226, 208, ppm);

  it.printf(CX, CY - 96, f.small, C_MUTED, TextAlign::CENTER, "CO2");
  if (valid)
    it.printf(CX, CY - 22, f.huge, C_TEXT, TextAlign::CENTER, "%.0f", ppm);
  else
    it.printf(CX, CY - 22, f.huge, C_MUTED, TextAlign::CENTER, "--");
  it.printf(CX, CY + 48, f.med, C_MUTED, TextAlign::CENTER, "ppm");
  it.printf(CX, CY + 92, f.med, accent, TextAlign::CENTER, "%s", co2_label(ppm));

  // Temperatuur en vochtigheid in de opening van de ring
  if (std::isnan(temp))
    it.printf(CX - 62, CY + 158, f.med, C_MUTED, TextAlign::CENTER, "--");
  else
    it.printf(CX - 62, CY + 158, f.med, temp_color(temp), TextAlign::CENTER, "%.1f°C", temp);
  it.line(CX, CY + 142, CX, CY + 172, C_GRID);
  if (std::isnan(hum))
    it.printf(CX + 62, CY + 158, f.med, C_MUTED, TextAlign::CENTER, "--");
  else
    it.printf(CX + 62, CY + 158, f.med, C_COOL, TextAlign::CENTER, "%.0f%%", hum);

  draw_dots(it, 0);
}

// ---- Grafiek --------------------------------------------------------------
inline void draw_graph(Display &it, const Fonts &f, const Series &s, int x0, int y0, int w, int h, float ymin,
                       float ymax, Color (*cf)(float), const float *marks, int n_marks) {
  static int ycol[512];
  static float vcol[512];
  if (w > 512) w = 512;

  auto yof = [&](float v) { return y0 + (int) ((1.0f - clamp01((v - ymin) / (ymax - ymin))) * (h - 1) + 0.5f); };

  for (int px = 0; px < w; px++) {
    float pos = px * (HIST_N - 1) / (float) (w - 1);
    int i0 = (int) pos, i1 = std::min(i0 + 1, HIST_N - 1);
    float fr = pos - i0, a = s.v[i0], b = s.v[i1];
    float v;
    if (!std::isnan(a) && !std::isnan(b))
      v = a + (b - a) * fr;
    else
      v = fr < 0.5f ? a : b;
    vcol[px] = v;
    ycol[px] = std::isnan(v) ? -1 : yof(v);
  }

  // Vlak onder de lijn met vervagend kleurverloop
  for (int px = 0; px < w; px++) {
    if (ycol[px] < 0) continue;
    Color c = cf(vcol[px]);
    for (int y = ycol[px]; y < y0 + h; y++) {
      float t = (y - ycol[px]) / (float) h;
      it.draw_pixel_at(x0 + px, y, scale(c, 0.34f * (1.0f - t) * (1.0f - t)));
    }
  }

  // Rasterlijnen met aslabels
  for (int i = 0; i < 4; i++) {
    int y = y0 + (h - 1) * i / 3;
    for (int x = x0; x < x0 + w; x += 7) it.line(x, y, x + 2, y, C_GRID);
    it.printf(x0 - 8, y, f.tiny, C_MUTED, TextAlign::CENTER_RIGHT, "%.0f", ymax - (ymax - ymin) * i / 3);
  }
  // Drempellijnen
  for (int i = 0; i < n_marks; i++) {
    if (marks[i] <= ymin || marks[i] >= ymax) continue;
    int y = yof(marks[i]);
    Color c = scale(cf(marks[i]), 0.75f);
    for (int x = x0; x < x0 + w; x += 10) it.line(x, y, x + 5, y, c);
  }

  // Lijn (3 px dik, gekleurd op waarde)
  int last = -1;
  for (int px = 1; px < w; px++) {
    if (ycol[px] < 0 || ycol[px - 1] < 0) continue;
    Color c = cf(vcol[px]);
    for (int o = -1; o <= 1; o++) it.line(x0 + px - 1, ycol[px - 1] + o, x0 + px, ycol[px] + o, c);
  }
  for (int px = w - 1; px >= 0; px--)
    if (ycol[px] >= 0) {
      last = px;
      break;
    }
  if (last >= 0) {
    it.filled_circle(x0 + last, ycol[last], 8, Color::BLACK);
    it.filled_circle(x0 + last, ycol[last], 6, C_TEXT);
    it.filled_circle(x0 + last, ycol[last], 4, cf(vcol[last]));
  }

  // X-as
  int yl = y0 + h + 26;
  it.printf(x0, yl, f.tiny, C_MUTED, TextAlign::CENTER, "-12u");
  it.printf(x0 + w / 2, yl, f.tiny, C_MUTED, TextAlign::CENTER, "-6u");
  it.printf(x0 + w, yl, f.tiny, C_MUTED, TextAlign::CENTER, "nu");
}

inline void draw_page_header(Display &it, const Fonts &f, const char *title, Color accent) {
  it.circle(CX, CY, 228, scale(accent, 0.35f));
  it.circle(CX, CY, 227, scale(accent, 0.35f));
  it.printf(CX, 62, f.small, C_MUTED, TextAlign::CENTER, "%s", title);
}

// ---- Pagina 2: CO2-grafiek ------------------------------------------------
inline void draw_co2_page(Display &it, const Fonts &f, float ppm) {
  it.fill(Color::BLACK);
  Color accent = std::isnan(ppm) ? C_MUTED : co2_color(ppm);
  draw_page_header(it, f, "CO2 - 12 UUR", accent);

  if (std::isnan(ppm)) {
    it.printf(CX, 118, f.big, C_MUTED, TextAlign::BASELINE_CENTER, "--");
  } else {
    it.printf(CX + 34, 134, f.big, C_TEXT, TextAlign::BASELINE_RIGHT, "%.0f", ppm);
    it.printf(CX + 42, 134, f.small, C_MUTED, TextAlign::BASELINE_LEFT, "ppm");
  }

  float mn, avg, mx;
  bool has = co2_hist.stats(mn, avg, mx);
  float top = 1600;
  if (has) top = std::max(top, CO2_MIN + std::ceil((mx - CO2_MIN) / 300.0f) * 300.0f);
  const float marks[2] = {CO2_OK, CO2_WARN};
  draw_graph(it, f, co2_hist, 84, 165, 320, 150, CO2_MIN, top, co2_color, marks, 2);

  if (has)
    it.printf(CX, 376, f.tiny, C_MUTED, TextAlign::CENTER, "min %.0f  -  gem %.0f  -  max %.0f ppm", mn, avg, mx);
  draw_dots(it, 1);
}

// ---- Pagina 3: temperatuurgrafiek (graden Celsius) ------------------------
inline void draw_temp_page(Display &it, const Fonts &f, float temp) {
  it.fill(Color::BLACK);
  Color accent = std::isnan(temp) ? C_MUTED : temp_color(temp);
  draw_page_header(it, f, "TEMPERATUUR - 12 UUR", accent);

  if (std::isnan(temp)) {
    it.printf(CX, 118, f.big, C_MUTED, TextAlign::BASELINE_CENTER, "--");
  } else {
    it.printf(CX + 34, 134, f.big, C_TEXT, TextAlign::BASELINE_RIGHT, "%.1f", temp);
    it.printf(CX + 42, 134, f.small, C_MUTED, TextAlign::BASELINE_LEFT, "°C");
  }

  float mn, avg, mx;
  bool has = temp_hist.stats(mn, avg, mx);
  float lo = 18, hi = 24;
  if (has) {
    float span = std::max(3.0f, std::ceil((mx - mn + 1.0f) / 3.0f) * 3.0f);
    lo = std::floor((mn + mx) / 2 - span / 2);
    hi = lo + span;
  }
  draw_graph(it, f, temp_hist, 84, 165, 320, 150, lo, hi, temp_color, nullptr, 0);

  if (has)
    it.printf(CX, 376, f.tiny, C_MUTED, TextAlign::CENTER, "min %.1f  -  gem %.1f  -  max %.1f °C", mn, avg, mx);
  draw_dots(it, 2);
}

}  // namespace ui
