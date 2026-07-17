/* =============================================================================
   VERITY ARCHITECTURE — COUNTERS  (counters.js)
   -----------------------------------------------------------------------------
   Shared visitor + download counters via the Abacus API. Depends on
   counters-config.js loaded first. No build step, no backend, no secrets.

   Declarative markup (auto-wired on load):
     <span data-visit-hit="visit-ft"></span>          increments once/session, then shows count
     <span data-count-display="visit-ft">…</span>     read-only display (seed + live)
     <a   data-download-counter="dl-excel" href="file.xlsx" download>Download</a>
                                                       increments when a real download link is clicked

   Programmatic:  Counters.hit(key) · Counters.get(key) · Counters.refresh(key)
   Display shown  = seed(key) + live Abacus value.  If Abacus is unreachable the
   seed is shown so the page never reads blank.
============================================================================= */
(function () {
  "use strict";

  var C     = window.VERITY_COUNTERS_CONFIG || {};
  var BASE  = (C.base || "https://abacus.jasoncameron.dev").replace(/\/+$/, "");
  var NS    = C.namespace || "default";
  var SEEDS = C.seeds || {};

  function seed(k) { return Number(SEEDS[k] || 0); }
  function fmt(n)  { return Number(n).toLocaleString("en-CA"); }
  function url(action, k) {
    return BASE + "/" + action + "/" + encodeURIComponent(NS) + "/" + encodeURIComponent(k);
  }

  /* ---- network ---- */
  function req(action, k) {
    return fetch(url(action, k), { cache: "no-store" })
      .then(function (r) {
        if (r.status === 404) { return { value: 0 }; }
        if (!r.ok) { throw new Error("HTTP " + r.status); }
        return r.json();
      })
      .then(function (j) { return (j && typeof j.value === "number") ? j.value : 0; })
      .catch(function () { return null; });          // null = offline / failed
  }
  function hit(k) { return req("hit", k); }
  function get(k) { return req("get", k); }

  /* ---- display ---- */
  function paint(k, live) {
    var val = (live == null) ? seed(k) : (seed(k) + live);
    document.querySelectorAll('[data-count-display="' + esc(k) + '"]').forEach(function (el) {
      el.textContent = fmt(val);
    });
  }
  function refresh(k) { return get(k).then(function (v) { paint(k, v); return v; }); }

  /* ---- init / auto-wire ---- */
  function init() {
    // 1) prime every display immediately with its seed so nothing reads blank
    var displayKeys = {};
    document.querySelectorAll("[data-count-display]").forEach(function (el) {
      displayKeys[el.getAttribute("data-count-display")] = true;
    });

    // 2) page-visit counters — increment once per browser session, else read
    var hitKeys = {};
    document.querySelectorAll("[data-visit-hit]").forEach(function (el) {
      hitKeys[el.getAttribute("data-visit-hit")] = true;
    });
    Object.keys(hitKeys).forEach(function (k) {
      var guard = "vh_" + NS + "_" + k;
      var already;
      try { already = sessionStorage.getItem(guard); } catch (e) { already = null; }
      if (already) {
        refresh(k);
      } else {
        try { sessionStorage.setItem(guard, "1"); } catch (e) {}
        hit(k).then(function (v) { paint(k, v); });
      }
    });

    // 3) remaining read-only displays (that aren't visit-hit keys)
    Object.keys(displayKeys).forEach(function (k) {
      paint(k, null);               // show seed right away
      if (!hitKeys[k]) { refresh(k); }
    });

    // 4) download links — increment on click, don't block the download
    document.querySelectorAll("[data-download-counter]").forEach(function (el) {
      if (el.__vcDl) { return; } el.__vcDl = true;
      el.addEventListener("click", function () {
        var k = el.getAttribute("data-download-counter");
        hit(k).then(function (v) { paint(k, v); });
      });
    });
  }

  /* ---- helpers ---- */
  function esc(s) { return String(s).replace(/["\\]/g, "\\$&"); }

  /* ---- public API ---- */
  window.Counters = {
    hit: hit, get: get, refresh: refresh, paint: paint, seed: seed, config: C
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }

})();
