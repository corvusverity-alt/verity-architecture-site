/* =============================================================================
   VERITY ARCHITECTURE — WORKSHEET VIDEO PLAYER  (ws-video.js)
   -----------------------------------------------------------------------------
   Adds a "Narrated Video" button + lightbox to a worksheet tutorial page.
   Detects the worksheet number from the filename (ws#-tutorial.html).
   - If videos-config.js has a YouTube ID for that worksheet -> embeds YouTube.
   - Otherwise -> plays the self-hosted videos/ws#.mp4 fallback.
   Depends on videos-config.js being loaded first.
============================================================================= */
(function () {
  "use strict";
  var m = (location.pathname.match(/ws(\d+)-tutorial/i) || [])[1];
  if (!m) { return; }
  var n = parseInt(m, 10);
  var ids = window.WS_VIDEOS || {};
  var titles = window.WS_VIDEO_TITLES || {};
  var yid = String(ids[n] || ids[String(n)] || "").trim();
  var title = titles[n] || titles[String(n)] || ("Worksheet " + n);

  // No video configured for this worksheet yet (YouTube ID blank) -> show nothing.
  // As soon as you paste the YouTube ID into videos-config.js, the button appears.
  if (!yid) { return; }

  function el(tag, css, html) {
    var e = document.createElement(tag);
    if (css) { e.setAttribute("style", css); }
    if (html != null) { e.innerHTML = html; }
    return e;
  }

  // ---- button (top-right, matches the site's gold buttons) ----
  var btn = el("button", "position:fixed;top:14px;right:14px;z-index:99999;display:inline-flex;align-items:center;"
    + "gap:8px;padding:9px 16px;background:#C9A84C;color:#12162c;font-family:Georgia,'Times New Roman',serif;"
    + "font-size:14px;font-weight:bold;letter-spacing:.4px;border:1px solid #C9A84C;border-radius:8px;"
    + "box-shadow:0 2px 12px rgba(0,0,0,0.4);cursor:pointer;",
    '<span style="font-size:13px;">&#9654;</span> Narrated Video');
  btn.setAttribute("aria-label", "Play narrated video for " + title);

  // ---- modal ----
  var modal = el("div", "display:none;position:fixed;inset:0;z-index:100000;background:rgba(6,6,14,0.93);"
    + "align-items:center;justify-content:center;padding:24px;");
  var frame = el("div", "position:relative;width:min(960px,94vw);");
  var cap = el("div", "color:#F5E6C8;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;"
    + "letter-spacing:.18em;text-transform:uppercase;margin-bottom:8px;",
    "Worksheet " + n + " &mdash; " + title);
  var close = el("button", "position:absolute;top:-4px;right:0;background:none;border:none;color:#d9b676;"
    + "font-size:30px;line-height:1;cursor:pointer;", "&times;");
  close.setAttribute("aria-label", "Close video");
  var body = el("div", "width:100%;aspect-ratio:16/9;background:#000;border:2px solid #C9A84C;border-radius:8px;"
    + "overflow:hidden;box-shadow:0 10px 44px rgba(0,0,0,0.65);");

  frame.appendChild(cap);
  frame.appendChild(close);
  frame.appendChild(body);
  modal.appendChild(frame);

  function playerHTML() {
    if (yid) {
      return '<iframe width="100%" height="100%" src="https://www.youtube-nocookie.com/embed/'
        + encodeURIComponent(yid) + '?autoplay=1&rel=0&modestbranding=1" title="' + title
        + '" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen '
        + 'style="display:block;width:100%;height:100%;border:0;"></iframe>';
    }
    return '<video controls autoplay playsinline style="width:100%;height:100%;background:#000;display:block;">'
      + '<source src="videos/ws' + n + '.mp4" type="video/mp4">'
      + 'Your browser does not support embedded video. '
      + '<a href="videos/ws' + n + '.mp4" style="color:#C9A84C;">Download the video</a>.</video>';
  }

  // Pause the page's animated how-to tutorial (voice narration + animation)
  // so its audio doesn't overlap the YouTube video.
  function stopHowTo() {
    try { if (window.speechSynthesis) { window.speechSynthesis.cancel(); } } catch (e) {}
    try { if (window.synth && typeof window.synth.cancel === "function") { window.synth.cancel(); } } catch (e) {}
    try { if (window.CLK && window.CLK.running && typeof window.togglePause === "function") { window.togglePause(); } } catch (e) {}
    try { document.querySelectorAll("audio, video").forEach(function (m) { try { m.pause(); } catch (e) {} }); } catch (e) {}
  }

  function open() { stopHowTo(); modal.style.display = "flex"; body.innerHTML = playerHTML(); }
  function shut() { modal.style.display = "none"; body.innerHTML = ""; }   // clearing stops playback

  btn.addEventListener("click", open);
  close.addEventListener("click", shut);
  modal.addEventListener("click", function (e) { if (e.target === modal) { shut(); } });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { shut(); } });

  function mount() { document.body.appendChild(btn); document.body.appendChild(modal); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else { mount(); }
})();
