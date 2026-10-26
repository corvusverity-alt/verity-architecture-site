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
      checkoutUrl: "https://verityarchitect.lemonsqueezy.com/checkout/buy/dedb8d1d-afec-4ea8-a505-c57928440b3e"
    },

    "ft-bundle": {
      name:        "Book One Bundle — Financially Trapped Complete",
      blurb:       "Ebook (EPUB) + interactive HTML + Excel workbook + 3 portfolio trackers.",
      price:       18.99,
      image:       "ft-cover-2026.jpg",
      checkoutUrl: "https://verityarchitect.lemonsqueezy.com/checkout/buy/e313ccad-95d1-405a-b68b-1535e9ac4655"
    },

    "ft-ebook": {
      name:        "Ebook — Financially Trapped (EPUB)",
      blurb:       "EPUB format. Delivered instantly.",
      price:       8.99,
      image:       "ft-cover-2026.jpg",
      checkoutUrl: "https://verityarchitect.lemonsqueezy.com/checkout/buy/276ccd7f-1826-4e5d-a31b-53b0397029fa"
    },

    "ft-interactive": {
      name:        "Interactive Book — Financially Trapped (Fillable HTML)",
      blurb:       "The complete book, fillable right in your browser. Works offline, no account.",
      price:       14.99,
      image:       "ft-cover-2026.jpg",
      checkoutUrl: "https://verityarchitect.lemonsqueezy.com/checkout/buy/c99eb2c0-3539-4bdd-b430-7f3473ddb6d2"
    },

    /* ---- The Portfolio Architecture — Book Two ---- */
    "pa-ebook": {
      name:        "Ebook — The Portfolio Architecture (EPUB)",
      blurb:       "EPUB format. Delivered instantly.",
      price:       8.99,
      image:       "pa-cover-2026.jpg",
      checkoutUrl: "https://verityarchitect.lemonsqueezy.com/checkout/buy/9859f5c1-6f38-4588-a633-4e6eb765a47f"
    },

    "pa-toolkit": {
      name:        "Worksheet & Tracker Toolkit — The Portfolio Architecture",
      blurb:       "10 fillable Word worksheets + 10 Excel portfolio trackers + how-to guide.",
      price:       9.99,
      image:       "pa-cover-2026.jpg",
      checkoutUrl: "https://verityarchitect.lemonsqueezy.com/checkout/buy/59ede789-70c0-4ef6-9566-a3e058cdf868"
    },

    "pa-interactive": {
      name:        "Interactive Book — The Portfolio Architecture (Fillable HTML)",
      blurb:       "The whole book, fillable in your browser. Autosave, backup, print. Works offline.",
      price:       14.99,
      image:       "pa-cover-2026.jpg",
      checkoutUrl: "https://verityarchitect.lemonsqueezy.com/checkout/buy/b75bff91-c35c-454f-9ebf-12ecac80cd95"
    },

    "pa-bundle": {
      name:        "Complete Bundle — The Portfolio Architecture",
      blurb:       "Ebook (EPUB) + interactive fillable book + Worksheet & Tracker Toolkit.",
      price:       22.99,
      image:       "pa-cover-2026.jpg",
      checkoutUrl: "https://verityarchitect.lemonsqueezy.com/checkout/buy/6f897b89-45a0-4ec3-9c61-518b7eb4609a"
    },

    "architects-bundle": {
      name:        "Full Architects Bundle — Both Books + Everything",
      blurb:       "Both ebooks, both interactive books, all worksheets and every portfolio tracker.",
      price:       29.99,
      image:       "pa-cover-2026.jpg",
      checkoutUrl: "https://verityarchitect.lemonsqueezy.com/checkout/buy/ad970bd0-f490-45a3-b0c1-02020e8ad7c5"
    }

  }
};
