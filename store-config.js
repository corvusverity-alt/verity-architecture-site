/* =============================================================================
   VERITY ARCHITECTURE — STORE CONFIG
   -----------------------------------------------------------------------------
   This is the ONLY file you edit to go live. The cart itself (store.js) never
   needs changing. Once you create your checkout account, paste each product's
   hosted checkout link into `checkoutUrl` below and the store starts taking
   real payments. Until then the cart works normally and checkout shows a
   friendly "not connected yet" notice instead of charging anyone.

   RECOMMENDED PROVIDER: a merchant-of-record (Lemon Squeezy or Gumroad).
   They process the card (PCI-safe), collect & remit sales tax for you, AND
   host the secure file download + license key — so you never store secrets,
   card data, or files on this static site.
       • provider:"lemonsqueezy" — lowest fees, one product per checkout.
       • provider:"gumroad"      — true multi-item cart, slightly higher fees.
       • provider:"manual"       — checkout button just links out (e.g. PayPal).
============================================================================= */

window.VERITY_STORE_CONFIG = {

  /* ---- Store-wide settings ------------------------------------------------ */
  currency:       "CAD",
  currencySymbol: "$",
  provider:       "lemonsqueezy",              // "lemonsqueezy" | "gumroad" | "manual"
  taxNote:        "Applicable sales tax is calculated and shown on the secure checkout page before you pay.",
  refundNote:     "Digital goods are delivered instantly. Refund terms are shown before payment — see the Store Policies.",
  policiesUrl:    "store-policies.html",
  thankYouUrl:    "thank-you.html",
  cartPageUrl:    "cart.html",

  /* ---- Product catalog (Financially Trapped — Book One) ------------------- *
     id        : internal key, used by Add-to-Cart buttons (do not change once live)
     name      : full product name shown in cart
     price     : number, in the currency above
     image     : thumbnail file that already lives in the site folder
     checkoutUrl: PASTE your hosted checkout link here to go live ("" = not yet)  */
  products: {

    "ft-worksheets": {
      name:        "Worksheet Pack — Interactive Edition",
      blurb:       "All 16 chapter worksheets (HTML) + Excel worksheet workbook.",
      price:       4.99,
      image:       "ft-cover-2026.jpg",
      checkoutUrl: "https://verityarchitect.lemonsqueezy.com/checkout/buy/1962aa50-3e95-4804-9a1a-43764c76cd4d"
    },

    "ft-bundle": {
      name:        "Book One Bundle — Financially Trapped Complete",
      blurb:       "Ebook (EPUB) + interactive HTML + Excel workbook + 3 portfolio trackers.",
      price:       18.99,
      image:       "ft-cover-2026.jpg",
      checkoutUrl: "https://verityarchitect.lemonsqueezy.com/checkout/buy/4bd08afa-f2f5-40bd-9f39-c6b3241e522e"
    },

    "ft-ebook": {
      name:        "Ebook — Financially Trapped (EPUB)",
      blurb:       "EPUB format. Delivered instantly.",
      price:       8.99,
      image:       "ft-cover-2026.jpg",
      checkoutUrl: "https://verityarchitect.lemonsqueezy.com/checkout/buy/163cdf49-3d19-4c08-bf45-cdce8bf0e66c"
    },

    "ft-interactive": {
      name:        "Interactive Book — Financially Trapped (Fillable HTML)",
      blurb:       "The complete book, fillable right in your browser. Works offline, no account.",
      price:       14.99,
      image:       "ft-cover-2026.jpg",
      checkoutUrl: "https://verityarchitect.lemonsqueezy.com/checkout/buy/cee4f6cb-4e2a-4c68-9fea-a1b590f39c79"
    }

  }
};
