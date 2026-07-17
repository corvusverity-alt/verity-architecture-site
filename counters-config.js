/* =============================================================================
   VERITY ARCHITECTURE — COUNTERS CONFIG
   -----------------------------------------------------------------------------
   Real, shared visitor + download counters for the static site, powered by the
   free Abacus counting API (no signup, no API key, no secrets on the site).
   Numbers are stored by Abacus and are the same for every visitor.

   SEEDS: the live counter always starts at 0 on Abacus and climbs from real
   activity. The `seeds` below are a display-only head start added on top, so a
   freshly launched page doesn't read "0". Put your real starting numbers here.
   (This is transparent — the real activity count still increases underneath.)
============================================================================= */

window.VERITY_COUNTERS_CONFIG = {

  base:      "https://abacus.jasoncameron.dev",
  namespace: "verityarchitect.com",          // your domain = your private counter space

  /* ---- Display baselines (edit these to your real starting numbers) ------- */
  seeds: {
    "visit-ft":      0,     // Book 1 — Financially Trapped, page visitors
    "visit-pa":      0,     // Book 2 — Portfolio Architecture, page visitors
    "visit-b3":      0,     // Book 3 — The Architect's Business Escape, page visitors
    "dl-worksheets": 0,     // Worksheet downloads (free samples + paid deliveries)
    "dl-excel":      0      // Excel workbook downloads (free samples + paid deliveries)
  },

  /* ---- Which download counters a completed purchase ticks ----------------- *
     When a buyer lands on  thank-you.html?p=<productId>  after checkout, the
     mapped download counters increment once (a paid "delivery" = a download).
     Point each product's post-purchase redirect at thank-you.html?p=<id>.      */
  deliveryMap: {
    "ft-worksheets": ["dl-worksheets", "dl-excel"],
    "ft-bundle":     ["dl-worksheets", "dl-excel"],
    "ft-ebook":      []
  }
};
