/* Dynamic back-navigation for portfolio detail pages.
 * Determines which book the visitor arrived from (Financially Trapped or
 * Portfolio Architecture) via a ?from= parameter or the referrer, and points
 * the back-link / home-nav accordingly. A Verity Architecture link is always
 * present in the nav as a second route home.
 *   ?from=ft  -> Financially Trapped (financially-trapped-hub.html)
 *   ?from=pa  -> Portfolio Architecture (portfolio-architect.html)
 * Default (unknown): Portfolio Architecture, since these portfolios belong to Book Two.
 */
(function () {
  var params = new URLSearchParams(location.search);
  var from = params.get("from");
  if (from !== "ft" && from !== "pa") {
    var r = document.referrer || "";
    if (r.indexOf("portfolio-architect") >= 0) from = "pa";
    else if (r.indexOf("financially-trapped-hub") >= 0) from = "ft";
    else from = "pa";
  }
  var dest = (from === "ft")
    ? { href: "financially-trapped-hub.html", label: "Financially Trapped" }
    : { href: "portfolio-architect.html", label: "Portfolio Architecture" };
  ["backLink", "navHome"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) { el.setAttribute("href", dest.href); el.innerHTML = "&#8592; " + dest.label; }
  });
})();
