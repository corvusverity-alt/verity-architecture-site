/**
 * VERITY ARCHITECTURE — Portfolio Data Store
 * ============================================
 * METHODOLOGY (do not deviate):
 *   deposits[] = real money contributed INTO the account each month only.
 *                Withdrawals are IGNORED — never subtract from deposits.
 *                Source: CONT / EFT / E_TRFIN / TRFINTF transaction types in CSV.
 *
 *   value[]    = end-of-month share price × quantity held for all positions.
 *                Prices scraped from Yahoo Finance at each month's last trading day.
 *                USD holdings converted to CAD at the month's FX rate.
 *                Cash balances NOT included in value (equity only).
 *
 *   dividends[]= DIV transactions from CSV, CAD equivalent.
 *
 * FX rates used: Dec/Jan 1.44 | Feb 1.43 | Mar 1.44 | Apr 1.41 | May 1.38 | Jun 1.421 CAD/USD
 *
 * Coverage notes (TSX-first pricing: tries .TO → .V → .NE → bare):
 *   Centurion 98% | Fortress 100% | Rebate ~90% | Tactical 95% | REITS 100% | FT 100%
 *   Developer 100% (ARTG→ARTG.V, NEXG→NEXG.V now priced)
 *   CDAY→CDAY.NE (NEO/Cboe Canada), MAI→MAI.V (only in Quiet Titan = manual values)
 *   Quiet Titan = brokerage PDF statement values (too many tickers for auto-pricing)
 *
 * BALANCES = live brokerage app values (all holdings + cash, as displayed).
 *   Source: Brokerage app screenshot. Update each month from statement.
 *   Note: Rebate shows negative — margin account with outstanding loan balance.
 *   Note: FT all-time % in brokerage app is distorted by May 14 restructuring.
 *         Our site shows dollar values only — no percentage distortion.
 *
 * TO UPDATE MONTHLY:
 *   1. Run portfolio_scraper.py with new CSV files from Dispatch
 *   2. Paste updated arrays below
 *   3. Update BALANCES from brokerage app screenshot
 *
 * Jun 2026 update: values from monthly account statements. Account→portfolio
 *   mapping confirmed by holdings + year-to-date contributions. USD figures
 *   converted at the statement rate $1 USD = $1.421 CAD.
 */

const PORTFOLIO_DATA = {

  /* ══════════════════════════════════════════════════════════
   * FINANCIALLY TRAPPED — Proof of Concept (reset May 14 2026)
   * Holdings: BANK, QMAX, ENS, BCEE, SRU.UN, CHP.UN, ETSX,
   *           APLE, SGR.UN, AMHE, BN  ($1/day income buys)
   * 100% of holdings priced.
   * ══════════════════════════════════════════════════════════ */
  "Financially Trapped": {
    label:    "Financially Trapped — Starter",
    note:     "Reset May 14 2026. Seeded from ~$31 CAD gold proceeds. $50/month contributions beginning June 2026.",
    months:   ["May 2026", "Jun 2026"],
    deposits: [0,          53.65],
    value:    [31.51,      80.38],
    dividends:[0.10,       0.26]
  },

  /* ══════════════════════════════════════════════════════════
   * 10 ETF (RRSP) — Apr row = FT history pre-transfer
   * Holdings (USD): SCHD, VXUS, FDVV, VYM, VIS, EFAS, EWY, OIH, VNAM
   * Holdings (CAD): VEE, GOLD  — 100% priced both months.
   * ══════════════════════════════════════════════════════════ */
  "10 ETF": {
    label:    "10 ETF Portfolio (RRSP)",
    note:     "RRSP account. May 2026 = first full month post-RRSP transfer.",
    months:   ["May 2026", "Jun 2026"],
    deposits: [301.62,     0],
    value:    [267.00,     288.16],
    dividends:[0,          1.26]
  },

  /* ══════════════════════════════════════════════════════════
   * CENTURION PORTFOLIO  (~62% of holdings priced)
   * ══════════════════════════════════════════════════════════ */
  "Centurion": {
    label:    "Centurion Portfolio",
    note:     "98% of holdings priced (TSX-listed). CDAY now priced via NEO Exchange (.NE). 4 tickers remain unavailable on Yahoo Finance.",
    months:   ["Mar 2026", "Apr 2026", "May 2026", "Jun 2026"],
    deposits: [1000.00,   300.00,    407.00,    200.00],
    value:    [952.32,    1308.12,   1777.17,   2098.95],
    dividends:[0.06,      8.52,      10.66,     15.76]
  },

  /* ══════════════════════════════════════════════════════════
   * FORTRESS 200 USD INCOME  (100% Mar, ~86% Apr/May)
   * ══════════════════════════════════════════════════════════ */
  "Fortress": {
    label:    "Fortress 200 USD Income",
    note:     "USD income portfolio. 100% of holdings priced.",
    months:   ["Mar 2026", "Apr 2026", "May 2026", "Jun 2026"],
    deposits: [200.00,    93.34,     216.20,    213.15],
    value:    [196.59,    308.23,    540.00,    787.24],
    dividends:[0.04,      2.13,      3.31,      3.64]
  },

  /* ══════════════════════════════════════════════════════════
   * QUIET TITAN  — values from "Self-Directed TFSA Account" table
   *               in each monthly statement (full portfolio value).
   * Deposits hidden per display preference (showDeposits:false).
   * Apr 2026 drop: TFSA cash used to pay off linked margin loan.
   * ══════════════════════════════════════════════════════════ */
  "Quiet Titan": {
    label:        "Quiet Titan",
    note:         "Portfolio restructured Apr 2026 — strategy reset to align with book principles.",
    showDeposits: false,
    months:   ["Apr 2026", "May 2026", "Jun 2026"],
    deposits: [0,          0,          0],
    value:    [21049.17,   22376.99,   23635.12],
    dividends:[138.50,     133.32,     147.32]
  },

  /* ══════════════════════════════════════════════════════════
   * THE REBATE PORTFOLIO  (~82% priced)
   * This is a margin account with an outstanding loan balance.
   * Charts show investment activity only (deposits = money added
   * to buy shares; value = share price × quantity). The margin
   * loan is NOT reflected in the charts — it runs counter to the
   * book's teachings and is disclosed via the BALANCES plaque.
   * Live net balance Jun 12 2026: -$365.77 CAD (loan > assets).
   * ══════════════════════════════════════════════════════════ */
  "Rebate": {
    label:    "The Rebate Portfolio",
    note:     "Margin account. Charts show investment side only (shares purchased & their value). Outstanding margin loan is separate and disclosed in the account balance plaque.",
    months:   ["Feb 2026", "Mar 2026", "Apr 2026", "May 2026", "Jun 2026"],
    deposits: [0,          20.00,     220.00,    210.00,     0],
    value:    [0,          0,         242.21,    375.25,     388.75],
    dividends:[0,          0,         0.01,      1.73,       0]
  },

  /* ══════════════════════════════════════════════════════════
   * TACTICAL TAX FREE (TFSA)  (~95% priced)
   * NOTE: Jun 2026 statement pending confirmation — the matching
   *   account shows a lower value/contributions than the recorded
   *   Mar–May history, so June is held until reconciled.
   * ══════════════════════════════════════════════════════════ */
  "Tactical": {
    label:    "Tactical Tax Free",
    months:   ["Mar 2026", "Apr 2026", "May 2026", "Jun 2026"],
    deposits: [500.00,    600.00,    312.56,    500.00],
    value:    [482.85,    1081.58,   1454.35,   2029.22],
    dividends:[0,         3.37,      11.79,     15.60]
  },

  /* ══════════════════════════════════════════════════════════
   * REITS  (100% priced)
   * ══════════════════════════════════════════════════════════ */
  "REITS": {
    label:    "REITS Portfolio",
    months:   ["Apr 2026", "May 2026", "Jun 2026"],
    deposits: [100.00,    100.00,    0],
    value:    [97.93,     205.58,    205.43],
    dividends:[0,         0.31,      1.42]
  },

  /* ══════════════════════════════════════════════════════════
   * DEVELOPER PORTFOLIO  (~71% priced; ARTG, NEXG not on YF)
   * ══════════════════════════════════════════════════════════ */
  "Developer": {
    label:    "Developer Portfolio",
    note:     "7/7 tickers priced (100%). ARTG priced via TSX Venture (ARTG.V), NEXG via (NEXG.V).",
    months:   ["May 2026", "Jun 2026"],
    deposits: [100.00,    100.00],
    value:    [98.83,     187.90],
    dividends:[0,         0]
  },

  /* ══════════════════════════════════════════════════════════
   * WHITESWAN  (active trading account — fast-cycling positions)
   * Month-end statement snapshots now shown.
   * Live balance Jun 12 2026: $105.05 CAD (brokerage app).
   * ══════════════════════════════════════════════════════════ */
  "WhiteSwan": {
    label:    "WhiteSwan Portfolio",
    note:     "Active trading account. Values are month-end statement snapshots.",
    months:   ["Apr 2026", "May 2026", "Jun 2026"],
    deposits: [90.00,     0,          0],
    value:    [null,      null,       106.98],
    dividends:[0,         0,          0.45]
  },

  /* ══════════════════════════════════════════════════════════
   * ACCOUNT BALANCE PLAQUES — gold display on index page
   * Source: Brokerage app screenshot, Jun 12 2026 at 6:48 PM.
   * All values in CAD.
   *
   * NOTE — Financially Trapped all-time % in brokerage app (+26.62%)
   * is DISTORTED by account restructuring (in-kind RRSP transfer May 14).
   * The brokerage calculates gain from the new account's starting point
   * (~$31 gold seed), not from the full portfolio history. Our site shows
   * actual dollar values — no percentage distortion here.
   *
   * NOTE — Rebate Portfolio shows -$365.77 because it is a margin account
   * with an outstanding loan against it. The negative figure is net of
   * the margin balance owed to the broker.
   * ══════════════════════════════════════════════════════════ */
  BALANCES: [
    /* ── TFSA ─────────────────────────────────────────── */
    { name: "Quiet Titan",         balance: 22704.02, href: "quiet-titan.html",       sub: "TFSA · Jun 12, 2026" },
    { name: "Centurion",           balance:  2092.20, href: "centurion.html",          sub: "TFSA · Jun 12, 2026" },
    { name: "Tactical Tax Free",   balance:  2029.22, href: "tactical.html", sub: "TFSA · Jun 2026" },
    { name: "Financially Trapped", balance:    47.15, href: "financially-trapped.html",sub: "TFSA · Proof of Concept · Jun 12, 2026" },
    { name: "REITS",               balance:   212.14, href: "reits.html",              sub: "TFSA · Jun 12, 2026" },
    { name: "WhiteSwan",           balance:   105.05, href: "whiteswan.html",          sub: "TFSA · Active Trading · Jun 12, 2026" },
    { name: "Developer",           balance:   200.58, href: "developer.html",          sub: "TFSA · Jun 12, 2026" },
    /* ── RRSP ─────────────────────────────────────────── */
    { name: "Fortress (RRSP)",     balance:   690.30, href: "fortress.html",           sub: "RRSP · Jun 12, 2026" },
    { name: "10 ETF (RRSP)",       balance:   310.69, href: "10-etf.html",             sub: "RRSP · Jun 12, 2026" },
    /* ── Non-Registered ────────────────────── */
    { name: "The Rebate",          balance:  -365.77, assetBalance: 388.75, href: "rebate.html", sub: "Non-Reg · Asset Value · Jun 12, 2026" }
  ]
};

/* ══════════════════════════════════════════════════════════
 * AUTO-DERIVED BALANCE PLAQUES
 * The gold "Account Balances" plaques (home + hub) now pull each portfolio's
 * LATEST month-end value from the arrays above — so updating the monthly data
 * refreshes the plaques automatically, with no separate balance list to keep.
 * The date in each label follows the portfolio's latest month.
 * Entries flagged `manual:true` keep their hand-set value (e.g. Tactical while
 * its statement is being reconciled).
 * ══════════════════════════════════════════════════════════ */
(function () {
  var map = {
    "Quiet Titan": "Quiet Titan", "Centurion": "Centurion", "Tactical Tax Free": "Tactical",
    "Financially Trapped": "Financially Trapped", "REITS": "REITS", "WhiteSwan": "WhiteSwan",
    "Developer": "Developer", "Fortress (RRSP)": "Fortress", "10 ETF (RRSP)": "10 ETF", "The Rebate": "Rebate"
  };
  (PORTFOLIO_DATA.BALANCES || []).forEach(function (b) {
    if (b.manual) { return; }
    var p = PORTFOLIO_DATA[map[b.name]];
    if (!p || !p.value) { return; }
    var last = p.value.filter(function (v) { return v != null; }).slice(-1)[0];
    if (last == null) { return; }
    if (b.assetBalance != null) { b.assetBalance = last; } else { b.balance = last; }
    var m = p.months && p.months.slice(-1)[0];
    if (m && b.sub) { b.sub = b.sub.replace(/[A-Z][a-z]{2} \d{1,2}, \d{4}/, m); }
  });
})();

if (typeof module !== 'undefined') module.exports = PORTFOLIO_DATA;
