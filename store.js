/* =============================================================================
   VERITY ARCHITECTURE — CART ENGINE  (store.js)
   -----------------------------------------------------------------------------
   Self-contained, provider-agnostic shopping cart for the static site.
   Depends only on store-config.js loaded BEFORE it. No build step, no backend.

   Add to any page:
       <script src="store-config.js"></script>
       <script src="store.js"></script>

   Make any element an add-to-cart / buy-now control:
       <button data-add-to-cart="ft-bundle">Add to Cart</button>
       <button data-buy-now="ft-bundle">Buy Now</button>

   Programmatic API (window.VerityStore):
       .add(id,qty)  .remove(id)  .setQty(id,qty)  .clear()
       .open()  .close()  .checkout()  .items()  .count()  .subtotal()
============================================================================= */
(function () {
  "use strict";

  var CFG = window.VERITY_STORE_CONFIG || { products: {} };
  var KEY = "verity_cart_v1";
  var P   = CFG.products || {};
  var SYM = CFG.currencySymbol || "$";
  var CUR = CFG.currency || "CAD";

  /* ---------- money ---------- */
  function money(n) {
    return SYM + Number(n || 0).toFixed(2);
  }

  /* ---------- storage ---------- */
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      var obj = raw ? JSON.parse(raw) : {};
      // drop any ids no longer in the catalog
      Object.keys(obj).forEach(function (id) { if (!P[id]) delete obj[id]; });
      return obj;
    } catch (e) { return {}; }
  }
  function save(cart) {
    try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {}
  }
  var CART = load();

  /* ---------- core ---------- */
  function items() {
    return Object.keys(CART).map(function (id) {
      return { id: id, qty: CART[id], product: P[id] };
    }).filter(function (x) { return x.product; });
  }
  function count() {
    return items().reduce(function (a, x) { return a + x.qty; }, 0);
  }
  function subtotal() {
    return items().reduce(function (a, x) { return a + x.product.price * x.qty; }, 0);
  }
  function add(id, qty) {
    if (!P[id]) { return; }
    qty = qty || 1;
    CART[id] = (CART[id] || 0) + qty;
    save(CART); render(); toast(P[id].name + " added to cart"); openDrawer();
  }
  function remove(id) { delete CART[id]; save(CART); render(); }
  function setQty(id, q) {
    q = Math.max(0, parseInt(q, 10) || 0);
    if (q === 0) { remove(id); } else { CART[id] = q; save(CART); render(); }
  }
  function clear() { CART = {}; save(CART); render(); }

  /* ---------- styles ---------- */
  function injectCSS() {
    if (document.getElementById("verity-cart-css")) { return; }
    var css = ''
      + ':root{--vc-dark:#1A1A2E;--vc-gold:#C9A84C;--vc-lgold:#F5E6C8;--vc-golddim:#A88830;}'
      + '#vcBtn{position:fixed;top:14px;right:14px;z-index:99999;display:inline-flex;align-items:center;gap:8px;padding:9px 15px;'
      + 'background:rgba(18,22,44,0.92);color:#d9b676;font-family:Georgia,"Times New Roman",serif;font-size:14px;font-weight:bold;'
      + 'letter-spacing:.5px;text-decoration:none;border:1px solid #d9b676;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,.35);'
      + 'cursor:pointer;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);transition:box-shadow .18s,transform .15s;}'
      + '#vcBtn:hover{box-shadow:0 6px 20px rgba(201,168,76,.35);transform:translateY(-1px);}'
      + '#vcBtn .vc-ico{font-size:16px;line-height:1;}'
      + '#vcBtn .vc-badge{min-width:18px;height:18px;padding:0 5px;border-radius:10px;background:var(--vc-gold);color:var(--vc-dark);'
      + 'font-family:Arial,sans-serif;font-size:11px;font-weight:bold;display:none;align-items:center;justify-content:center;}'
      + '#vcBtn.has-items .vc-badge{display:inline-flex;}'
      + '#vcOverlay{position:fixed;inset:0;background:rgba(10,10,20,.55);z-index:100000;opacity:0;pointer-events:none;transition:opacity .2s;}'
      + '#vcOverlay.open{opacity:1;pointer-events:auto;}'
      + '#vcDrawer{position:fixed;top:0;right:0;height:100%;width:380px;max-width:90vw;z-index:100001;background:var(--vc-dark);'
      + 'border-left:3px solid var(--vc-gold);box-shadow:-8px 0 30px rgba(0,0,0,.5);transform:translateX(105%);transition:transform .25s ease;'
      + 'display:flex;flex-direction:column;font-family:Georgia,"Times New Roman",serif;color:#eee;}'
      + '#vcDrawer.open{transform:translateX(0);}'
      + '.vc-head{display:flex;align-items:center;justify-content:space-between;padding:1.1em 1.2em;border-bottom:1px solid rgba(201,168,76,.3);}'
      + '.vc-head h3{color:var(--vc-gold);font-size:1.15em;margin:0;letter-spacing:.03em;}'
      + '.vc-x{background:none;border:none;color:#bbb;font-size:1.5em;cursor:pointer;line-height:1;padding:0 .2em;}'
      + '.vc-x:hover{color:var(--vc-gold);}'
      + '.vc-body{flex:1;overflow-y:auto;padding:0.6em 1.2em;}'
      + '.vc-line{display:flex;gap:.8em;padding:.9em 0;border-bottom:1px solid rgba(255,255,255,.08);}'
      + '.vc-line img{width:46px;height:64px;object-fit:cover;border:1px solid var(--vc-gold);border-radius:3px;flex-shrink:0;}'
      + '.vc-line .vc-info{flex:1;min-width:0;}'
      + '.vc-line .vc-name{font-size:.9em;font-weight:bold;color:#fff;line-height:1.3;}'
      + '.vc-line .vc-blurb{font-size:.72em;color:#9a9ab0;font-style:italic;margin:.15em 0 .4em;}'
      + '.vc-qty{display:inline-flex;align-items:center;border:1px solid rgba(201,168,76,.5);border-radius:4px;overflow:hidden;}'
      + '.vc-qty button{background:transparent;border:none;color:var(--vc-gold);font-size:1em;width:24px;height:24px;cursor:pointer;font-family:Arial,sans-serif;}'
      + '.vc-qty button:hover{background:rgba(201,168,76,.18);}'
      + '.vc-qty span{min-width:26px;text-align:center;font-family:Arial,sans-serif;font-size:.85em;color:#eee;}'
      + '.vc-line .vc-right{text-align:right;display:flex;flex-direction:column;justify-content:space-between;align-items:flex-end;}'
      + '.vc-line .vc-price{color:var(--vc-gold);font-weight:bold;font-size:.95em;}'
      + '.vc-rm{background:none;border:none;color:#8a8aa0;font-family:Arial,sans-serif;font-size:.68em;letter-spacing:.1em;'
      + 'text-transform:uppercase;cursor:pointer;padding:0;}'
      + '.vc-rm:hover{color:#e07070;}'
      + '.vc-empty{text-align:center;color:#9a9ab0;font-style:italic;padding:3em 1em;}'
      + '.vc-empty .vc-ico-lg{font-size:2.4em;color:var(--vc-golddim);display:block;margin-bottom:.4em;}'
      + '.vc-foot{border-top:1px solid rgba(201,168,76,.3);padding:1.1em 1.2em;background:linear-gradient(160deg,#1e1e38,#1A1A2E);}'
      + '.vc-sub{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:.3em;}'
      + '.vc-sub .vc-sublabel{font-family:Arial,sans-serif;font-size:.7em;letter-spacing:.15em;text-transform:uppercase;color:var(--vc-lgold);}'
      + '.vc-sub .vc-subval{color:var(--vc-gold);font-size:1.35em;font-weight:bold;}'
      + '.vc-tax{font-size:.72em;color:#9a9ab0;font-style:italic;margin-bottom:.9em;line-height:1.4;}'
      + '.vc-cta{display:block;width:100%;text-align:center;font-family:Arial,sans-serif;font-size:.8em;font-weight:bold;letter-spacing:.1em;'
      + 'text-transform:uppercase;padding:.85em 1em;border-radius:4px;border:none;cursor:pointer;text-decoration:none;}'
      + '.vc-cta-gold{background:var(--vc-gold);color:var(--vc-dark);margin-bottom:.5em;}'
      + '.vc-cta-gold:hover{background:var(--vc-golddim);}'
      + '.vc-cta-line{background:transparent;color:var(--vc-gold);border:1.5px solid var(--vc-gold);}'
      + '.vc-cta-line:hover{background:rgba(201,168,76,.12);}'
      + '.vc-cta[disabled]{opacity:.4;cursor:not-allowed;pointer-events:none;}'
      + '.vc-policies{text-align:center;font-size:.7em;margin-top:.8em;}'
      + '.vc-policies a{color:#9a9ab0;text-decoration:underline;}'
      + '.vc-notice{background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.4);border-radius:5px;color:var(--vc-lgold);'
      + 'font-size:.75em;line-height:1.5;padding:.7em .8em;margin-bottom:.8em;}'
      + '.vc-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);z-index:100002;'
      + 'background:var(--vc-dark);color:var(--vc-lgold);border:1px solid var(--vc-gold);border-radius:6px;padding:.7em 1.2em;'
      + 'font-family:Georgia,serif;font-size:.85em;box-shadow:0 6px 24px rgba(0,0,0,.45);opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;}'
      + '.vc-toast.show{opacity:1;transform:translateX(-50%) translateY(0);}'
      /* full-page cart (cart.html) */
      + '.vc-page{max-width:760px;margin:0 auto;}'
      + '.vc-page .vc-line img{width:60px;height:84px;}'
      + '.vc-page .vc-line .vc-name{font-size:1.02em;}'
      + '@media(max-width:640px){#vcDrawer{width:100%;}#vcBtn{top:auto;bottom:14px;right:12px;}}';
    var s = document.createElement("style");
    s.id = "verity-cart-css";
    s.textContent = css;
    document.head.appendChild(s);
  }

  /* ---------- DOM scaffold ---------- */
  function buildScaffold() {
    if (document.getElementById("vcBtn")) { return; }

    var btn = document.createElement("button");
    btn.id = "vcBtn";
    btn.setAttribute("aria-label", "Open cart");
    btn.innerHTML = '<span class="vc-ico">&#128722;</span><span class="vc-btn-txt">Cart</span><span class="vc-badge">0</span>';
    btn.addEventListener("click", openDrawer);
    document.body.appendChild(btn);

    var ov = document.createElement("div");
    ov.id = "vcOverlay";
    ov.addEventListener("click", closeDrawer);
    document.body.appendChild(ov);

    var dr = document.createElement("aside");
    dr.id = "vcDrawer";
    dr.setAttribute("role", "dialog");
    dr.setAttribute("aria-label", "Shopping cart");
    dr.innerHTML =
        '<div class="vc-head"><h3>Your Cart</h3><button class="vc-x" aria-label="Close cart">&times;</button></div>'
      + '<div class="vc-body" id="vcBody"></div>'
      + '<div class="vc-foot" id="vcFoot"></div>';
    dr.querySelector(".vc-x").addEventListener("click", closeDrawer);
    document.body.appendChild(dr);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closeDrawer(); }
    });
  }

  /* ---------- render ---------- */
  function lineHTML(x) {
    var pr = x.product;
    return ''
      + '<div class="vc-line">'
      +   '<img src="' + pr.image + '" alt="">'
      +   '<div class="vc-info">'
      +     '<div class="vc-name">' + esc(pr.name) + '</div>'
      +     (pr.blurb ? '<div class="vc-blurb">' + esc(pr.blurb) + '</div>' : '')
      +     '<div class="vc-qty">'
      +       '<button data-vc-dec="' + x.id + '" aria-label="Decrease quantity">&minus;</button>'
      +       '<span>' + x.qty + '</span>'
      +       '<button data-vc-inc="' + x.id + '" aria-label="Increase quantity">+</button>'
      +     '</div>'
      +   '</div>'
      +   '<div class="vc-right">'
      +     '<div class="vc-price">' + money(pr.price * x.qty) + '</div>'
      +     '<button class="vc-rm" data-vc-rm="' + x.id + '">Remove</button>'
      +   '</div>'
      + '</div>';
  }

  function footHTML() {
    var connected = items().some(function (x) { return x.product.checkoutUrl; })
                 || CFG.provider === "gumroad";
    var setupNeeded = count() > 0 && !anyCheckoutConfigured();
    return ''
      + (setupNeeded
          ? '<div class="vc-notice"><strong>Checkout not connected yet.</strong> Paste your hosted checkout links into '
            + '<code>store-config.js</code> to start taking payments. The cart is fully working in the meantime.</div>'
          : '')
      + '<div class="vc-sub"><span class="vc-sublabel">Subtotal</span>'
      +   '<span class="vc-subval">' + money(subtotal()) + ' ' + CUR + '</span></div>'
      + '<div class="vc-tax">' + esc(CFG.taxNote || "") + '</div>'
      + '<button class="vc-cta vc-cta-gold" id="vcCheckout"' + (count() ? '' : ' disabled') + '>Secure Checkout &rarr;</button>'
      + '<a class="vc-cta vc-cta-line" href="' + (CFG.cartPageUrl || "cart.html") + '">View Full Cart</a>'
      + '<div class="vc-policies"><a href="' + (CFG.policiesUrl || "#") + '">Store Policies, Refunds &amp; Privacy</a></div>';
  }

  function render() {
    // cart button badge
    var btn = document.getElementById("vcBtn");
    if (btn) {
      var c = count();
      btn.classList.toggle("has-items", c > 0);
      var b = btn.querySelector(".vc-badge");
      if (b) { b.textContent = c; }
    }

    // drawer body + foot
    var body = document.getElementById("vcBody");
    var foot = document.getElementById("vcFoot");
    if (body && foot) {
      if (count() === 0) {
        body.innerHTML = '<div class="vc-empty"><span class="vc-ico-lg">&#128722;</span>Your cart is empty.<br>'
                       + 'Add the worksheets, ebook, or bundle to get started.</div>';
        foot.innerHTML = '<a class="vc-cta vc-cta-line" href="#" onclick="VerityStore.close();return false;">Continue Shopping</a>';
      } else {
        body.innerHTML = items().map(lineHTML).join("");
        foot.innerHTML = footHTML();
        wireLineControls(body);
        var co = document.getElementById("vcCheckout");
        if (co) { co.addEventListener("click", checkout); }
      }
    }

    // full-page cart, if present
    renderPage();
  }

  function wireLineControls(root) {
    root.querySelectorAll("[data-vc-inc]").forEach(function (el) {
      el.addEventListener("click", function () { setQty(el.getAttribute("data-vc-inc"), CART[el.getAttribute("data-vc-inc")] + 1); });
    });
    root.querySelectorAll("[data-vc-dec]").forEach(function (el) {
      el.addEventListener("click", function () { setQty(el.getAttribute("data-vc-dec"), CART[el.getAttribute("data-vc-dec")] - 1); });
    });
    root.querySelectorAll("[data-vc-rm]").forEach(function (el) {
      el.addEventListener("click", function () { remove(el.getAttribute("data-vc-rm")); });
    });
  }

  /* ---------- full-page cart (cart.html) ---------- */
  function renderPage() {
    var host = document.getElementById("verity-cart-page");
    if (!host) { return; }
    if (count() === 0) {
      host.innerHTML = '<div class="vc-page"><div class="vc-empty" style="color:#666;">'
        + '<span class="vc-ico-lg" style="color:var(--vc-golddim);">&#128722;</span>'
        + 'Your cart is empty.<br><a class="vc-cta vc-cta-line" style="max-width:260px;margin:1.2em auto 0;" href="financially-trapped-hub.html">Browse Books &amp; Bundles</a></div></div>';
      return;
    }
    host.innerHTML =
        '<div class="vc-page" style="background:var(--vc-dark);border:1px solid var(--vc-gold);border-radius:8px;overflow:hidden;">'
      +   '<div class="vc-body" style="padding:0.4em 1.4em;">' + items().map(lineHTML).join("") + '</div>'
      +   '<div class="vc-foot">' + footHTML() + '</div>'
      + '</div>';
    var body = host.querySelector(".vc-body");
    wireLineControls(body);
    var co = host.querySelector("#vcCheckout");
    if (co) { co.addEventListener("click", checkout); }
  }

  /* ---------- checkout ---------- */
  function anyCheckoutConfigured() {
    if (CFG.provider === "gumroad" || CFG.provider === "manual") { return true; }
    return items().every(function (x) { return x.product.checkoutUrl; });
  }

  function checkout() {
    if (count() === 0) { return; }
    var provider = CFG.provider || "lemonsqueezy";

    if (!anyCheckoutConfigured()) {
      alert("Checkout isn't connected yet.\n\nAdd your hosted checkout links to store-config.js (see the go-live checklist) and this button will take real payments.");
      return;
    }

    var list = items();

    // Single distinct product (any quantity): open its hosted checkout directly.
    if (list.length === 1 && list[0].product.checkoutUrl) {
      go(list[0].product.checkoutUrl);
      return;
    }

    // Multiple distinct products.
    if (provider === "gumroad") {
      // Gumroad overlay aggregates via ?wanted=true links; open the first,
      // its overlay carries the rest if products share a Gumroad cart.
      go(list[0].product.checkoutUrl);
      return;
    }

    if (provider === "manual") {
      go(list[0].product.checkoutUrl);
      return;
    }

    // Lemon Squeezy (one product per checkout): the FT products are tiers, so a
    // multi-item cart is rare. Guide the buyer rather than charging twice.
    var names = list.map(function (x) { return "• " + x.product.name; }).join("\n");
    var msg = "Your cart has more than one separate product:\n\n" + names
            + "\n\nEach is bought on its own secure checkout. Tip: the Book One "
            + "Bundle already includes everything at a lower total.\n\n"
            + "Press OK to check out \"" + list[0].product.name + "\" now.";
    if (confirm(msg)) { go(list[0].product.checkoutUrl); }
  }

  function go(url) {
    // most hosted checkouts open cleanly in a new tab; fall back to same tab
    var w = window.open(url, "_blank");
    if (!w) { window.location.href = url; }
  }

  /* ---------- drawer open/close ---------- */
  function openDrawer() {
    injectCSS(); buildScaffold(); render();
    document.getElementById("vcOverlay").classList.add("open");
    document.getElementById("vcDrawer").classList.add("open");
  }
  function closeDrawer() {
    var ov = document.getElementById("vcOverlay"), dr = document.getElementById("vcDrawer");
    if (ov) { ov.classList.remove("open"); }
    if (dr) { dr.classList.remove("open"); }
  }

  /* ---------- toast ---------- */
  var toastTimer;
  function toast(msg) {
    var t = document.getElementById("vcToast");
    if (!t) { t = document.createElement("div"); t.id = "vcToast"; t.className = "vc-toast"; document.body.appendChild(t); }
    t.textContent = msg;
    requestAnimationFrame(function () { t.classList.add("show"); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 1800);
  }

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* ---------- declarative wiring ---------- */
  function wirePageButtons() {
    document.querySelectorAll("[data-add-to-cart]").forEach(function (el) {
      if (el.__vcWired) { return; } el.__vcWired = true;
      el.addEventListener("click", function (e) {
        e.preventDefault();
        add(el.getAttribute("data-add-to-cart"), parseInt(el.getAttribute("data-qty"), 10) || 1);
      });
    });
    document.querySelectorAll("[data-buy-now]").forEach(function (el) {
      if (el.__vcWired) { return; } el.__vcWired = true;
      el.addEventListener("click", function (e) {
        e.preventDefault();
        var id = el.getAttribute("data-buy-now");
        add(id, 1);
        setTimeout(checkout, 250);
      });
    });
  }

  /* ---------- public API ---------- */
  window.VerityStore = {
    add: add, remove: remove, setQty: setQty, clear: clear,
    open: openDrawer, close: closeDrawer, checkout: checkout,
    items: items, count: count, subtotal: subtotal, money: money,
    rewire: wirePageButtons
  };

  /* ---------- init ---------- */
  function init() {
    injectCSS(); buildScaffold(); wirePageButtons(); render();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }

})();
