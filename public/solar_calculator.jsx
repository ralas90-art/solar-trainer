import { useState, useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Syne:wght@400;500;600;700;800&display=swap');`;

const css = `
  ${FONTS}

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy:       #0B1724;
    --navy-mid:   #162030;
    --navy-card:  #1C2B3A;
    --navy-light: #243447;
    --slate:      #2E4057;
    --amber:      #F5A623;
    --amber-dim:  #C47E0A;
    --amber-glow: rgba(245,166,35,0.15);
    --white:      #F0F6FF;
    --off-white:  #C8D8E8;
    --muted:      #5C7A96;
    --green:      #22C55E;
    --green-bg:   rgba(34,197,94,0.12);
    --green-dim:  #15803D;
    --red:        #EF4444;
    --red-bg:     rgba(239,68,68,0.12);
    --amber-warn: #F59E0B;
    --amber-warn-bg: rgba(245,158,11,0.12);
    --rule:       rgba(255,255,255,0.07);
    --input-bg:   rgba(255,253,225,0.06);
    --input-border: rgba(245,166,35,0.4);
  }

  body {
    font-family: 'Syne', sans-serif;
    background: var(--navy);
    color: var(--white);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* Grid noise texture overlay */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      radial-gradient(ellipse 80% 60% at 70% 0%, rgba(245,166,35,0.06) 0%, transparent 60%),
      radial-gradient(ellipse 60% 80% at 0% 80%, rgba(11,23,36,0.8) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .app {
    position: relative;
    z-index: 1;
    max-width: 860px;
    margin: 0 auto;
    padding: 28px 20px 60px;
  }

  /* ── Header ─────────────────────────────────────────── */
  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--rule);
  }
  .header-left {}
  .company-tag {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.18em;
    color: var(--amber);
    text-transform: uppercase;
    margin-bottom: 8px;
    opacity: 0.9;
  }
  .app-title {
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    color: var(--white);
  }
  .app-title span { color: var(--amber); }
  .app-subtitle {
    font-family: 'DM Mono', monospace;
    font-size: 10.5px;
    color: var(--muted);
    margin-top: 6px;
    letter-spacing: 0.04em;
  }
  .header-badge {
    background: var(--navy-card);
    border: 1px solid var(--rule);
    border-radius: 8px;
    padding: 10px 14px;
    text-align: right;
    flex-shrink: 0;
  }
  .badge-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    color: var(--muted);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .badge-date {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: var(--off-white);
    margin-top: 3px;
  }

  /* ── Status Banner ───────────────────────────────────── */
  .status-banner {
    border-radius: 10px;
    padding: 18px 22px;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
    border: 1px solid transparent;
  }
  .status-banner.awaiting {
    background: rgba(245,158,11,0.08);
    border-color: rgba(245,158,11,0.25);
  }
  .status-banner.approved {
    background: var(--green-bg);
    border-color: rgba(34,197,94,0.3);
    box-shadow: 0 0 40px rgba(34,197,94,0.08);
  }
  .status-banner.rejected {
    background: var(--red-bg);
    border-color: rgba(239,68,68,0.3);
    box-shadow: 0 0 40px rgba(239,68,68,0.08);
  }
  .status-icon {
    font-size: 28px;
    line-height: 1;
    flex-shrink: 0;
  }
  .status-text {}
  .status-label {
    font-family: 'DM Mono', monospace;
    font-size: 9.5px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    opacity: 0.7;
    margin-bottom: 3px;
  }
  .status-message {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  .status-banner.awaiting .status-message { color: var(--amber-warn); }
  .status-banner.approved .status-message { color: var(--green); }
  .status-banner.rejected .status-message { color: var(--red); }

  /* ── Two-column layout ───────────────────────────────── */
  .cols {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }
  @media (max-width: 620px) { .cols { grid-template-columns: 1fr; } }

  /* ── Section cards ───────────────────────────────────── */
  .section-card {
    background: var(--navy-card);
    border: 1px solid var(--rule);
    border-radius: 12px;
    overflow: hidden;
  }
  .section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 13px 18px;
    background: rgba(255,255,255,0.03);
    border-bottom: 1px solid var(--rule);
  }
  .section-num {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--amber);
    color: var(--navy);
    font-size: 10px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .section-title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--off-white);
  }
  .section-body { padding: 16px 18px; display: flex; flex-direction: column; gap: 14px; }

  /* ── Field ───────────────────────────────────────────── */
  .field {}
  .field-label {
    font-family: 'DM Mono', monospace;
    font-size: 9.5px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .field-hint {
    font-style: italic;
    font-size: 9px;
    opacity: 0.7;
    text-transform: none;
    letter-spacing: 0;
  }
  .field-input-wrap { position: relative; }
  .field-prefix {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    color: var(--amber);
    pointer-events: none;
    font-weight: 500;
  }
  .field-suffix {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: var(--muted);
    pointer-events: none;
  }
  input[type="text"],
  input[type="number"] {
    width: 100%;
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: 7px;
    padding: 10px 12px;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    color: var(--white);
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    -moz-appearance: textfield;
  }
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; }
  input.has-prefix { padding-left: 26px; }
  input.has-suffix { padding-right: 38px; }
  input:focus {
    border-color: var(--amber);
    background: rgba(245,166,35,0.07);
    box-shadow: 0 0 0 3px rgba(245,166,35,0.1);
  }
  input::placeholder { color: var(--muted); opacity: 0.6; }

  /* ── Slider ──────────────────────────────────────────── */
  .slider-wrap { display: flex; align-items: center; gap: 12px; }
  input[type="range"] {
    flex: 1;
    -webkit-appearance: none;
    height: 4px;
    border-radius: 4px;
    background: var(--navy-light);
    outline: none;
    cursor: pointer;
  }
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--amber);
    border: 2px solid var(--navy);
    box-shadow: 0 0 8px rgba(245,166,35,0.5);
    transition: transform 0.15s;
  }
  input[type="range"]::-webkit-slider-thumb:hover { transform: scale(1.2); }
  .slider-val {
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    font-weight: 500;
    color: var(--amber);
    min-width: 42px;
    text-align: right;
  }

  /* ── Output metric ───────────────────────────────────── */
  .metric {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 13px 15px;
    background: rgba(255,255,255,0.025);
    border-radius: 8px;
    border: 1px solid var(--rule);
    transition: border-color 0.2s;
  }
  .metric:hover { border-color: rgba(245,166,35,0.2); }
  .metric-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .metric-value {
    font-family: 'DM Mono', monospace;
    font-size: 19px;
    font-weight: 500;
    color: var(--white);
    letter-spacing: -0.02em;
    transition: color 0.3s;
  }
  .metric-value.highlight { color: var(--amber); }
  .metric-sub {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    color: var(--muted);
    margin-top: 1px;
  }

  /* ── Check rows ──────────────────────────────────────── */
  .checks { display: flex; flex-direction: column; gap: 0; }
  .check-row {
    display: flex;
    align-items: stretch;
    border-bottom: 1px solid var(--rule);
    transition: background 0.25s;
  }
  .check-row:last-child { border-bottom: none; }
  .check-accent {
    width: 4px;
    flex-shrink: 0;
    border-radius: 0;
    transition: background 0.3s;
  }
  .check-row.pass .check-accent { background: var(--green); }
  .check-row.fail .check-accent { background: var(--red); }
  .check-row.warn .check-accent { background: var(--amber-warn); }
  .check-row.pending .check-accent { background: var(--muted); }
  .check-row.pass { background: rgba(34,197,94,0.04); }
  .check-row.fail { background: rgba(239,68,68,0.05); }
  .check-row.warn { background: rgba(245,158,11,0.05); }
  .check-inner {
    flex: 1;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .check-info {}
  .check-name {
    font-size: 12px;
    font-weight: 700;
    color: var(--off-white);
    margin-bottom: 2px;
  }
  .check-rule {
    font-family: 'DM Mono', monospace;
    font-size: 9.5px;
    color: var(--muted);
    letter-spacing: 0.04em;
  }
  .check-pill {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    padding: 5px 12px;
    border-radius: 20px;
    white-space: nowrap;
    flex-shrink: 0;
    letter-spacing: 0.04em;
    transition: all 0.25s;
  }
  .check-row.pass .check-pill {
    background: var(--green-bg);
    color: var(--green);
    border: 1px solid rgba(34,197,94,0.3);
  }
  .check-row.fail .check-pill {
    background: var(--red-bg);
    color: var(--red);
    border: 1px solid rgba(239,68,68,0.3);
  }
  .check-row.warn .check-pill {
    background: var(--amber-warn-bg);
    color: var(--amber-warn);
    border: 1px solid rgba(245,158,11,0.3);
  }
  .check-row.pending .check-pill {
    background: rgba(255,255,255,0.04);
    color: var(--muted);
    border: 1px solid var(--rule);
  }

  /* ── Savings breakdown ───────────────────────────────── */
  .savings-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  @media (max-width: 480px) { .savings-grid { grid-template-columns: 1fr; } }

  /* ── Reset button ────────────────────────────────────── */
  .reset-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    background: transparent;
    border: 1px solid var(--rule);
    border-radius: 7px;
    padding: 8px 16px;
    color: var(--muted);
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    margin-left: auto;
    margin-top: 8px;
  }
  .reset-btn:hover {
    border-color: rgba(245,166,35,0.4);
    color: var(--amber);
  }

  /* ── Footer ──────────────────────────────────────────── */
  .footer {
    margin-top: 36px;
    padding-top: 20px;
    border-top: 1px solid var(--rule);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: gap;
    gap: 12px;
  }
  .footer-left {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    color: var(--muted);
    letter-spacing: 0.08em;
    line-height: 1.6;
  }
  .footer-right {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    color: var(--muted);
    letter-spacing: 0.06em;
    text-align: right;
  }

  /* ── Animate in ──────────────────────────────────────── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .section-card { animation: fadeUp 0.4s ease both; }
  .section-card:nth-child(1) { animation-delay: 0.05s; }
  .section-card:nth-child(2) { animation-delay: 0.1s; }
  .status-banner { animation: fadeUp 0.3s ease both; }
`;

// ─── Helpers ─────────────────────────────────────────────────────────
const fmt = {
  usd: v => v == null || v === "" ? "—" : `$${Number(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  kwh: v => v == null || v === "" ? "—" : `${Number(v).toLocaleString("en-US", { maximumFractionDigits: 0 })} kWh`,
  kw:  v => v == null || v === "" ? "—" : `${Number(v).toFixed(2)} kW`,
  pct: v => v == null || v === "" ? "—" : `${Number(v).toFixed(1)}%`,
};

const today = () => new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

// ─── Main Component ───────────────────────────────────────────────────
export default function SolarCalc() {
  const [vals, setVals] = useState({
    name: "",
    pastDue: "",
    kwhYear: "",
    avgBill: "",
    offset: 80,
    repName: "",
  });

  const set = (k, v) => setVals(p => ({ ...p, [k]: v }));
  const num = k => parseFloat(vals[k]) || 0;

  // ── Computed ──────────────────────────────────────────
  const pastDue  = num("pastDue");
  const kwhYear  = num("kwhYear");
  const avgBill  = num("avgBill");
  const offset   = num("offset");

  const hasData = vals.pastDue !== "" && vals.kwhYear !== "" && vals.avgBill !== "";

  const systemKw      = kwhYear > 0 ? (kwhYear * (offset / 100)) / 1400 : null;
  const annualProd    = systemKw != null ? systemKw * 1400 : null;
  const monthlyOffset = avgBill > 0 ? avgBill * (offset / 100) : null;
  const annualSavings = monthlyOffset != null ? monthlyOffset * 12 : null;
  const yr5savings    = annualSavings != null ? annualSavings * 5 : null;
  const yr25savings   = annualSavings != null ? annualSavings * 25 : null;

  // ── Qualification checks ──────────────────────────────
  const checks = [
    {
      id: "credit",
      name: "Credit Risk Check",
      rule: "Past Due Balance  ≤  $500",
      evaluate: () => {
        if (vals.pastDue === "") return "pending";
        return pastDue > 500 ? "fail" : "pass";
      },
      pill: {
        pass: "✓  PASS — No Balance Issue",
        fail: "🚩  RED FLAG: Credit Risk",
        pending: "Awaiting input",
      },
    },
    {
      id: "bill",
      name: "Minimum Bill Check",
      rule: "Average Monthly Bill  ≥  $100",
      evaluate: () => {
        if (vals.avgBill === "") return "pending";
        return avgBill < 100 ? "fail" : "pass";
      },
      pill: {
        pass: "✓  PASS — Bill Qualifies",
        fail: "⛔  DISQUALIFIED: Bill Too Low",
        pending: "Awaiting input",
      },
    },
    {
      id: "offset",
      name: "Offset Reasonableness",
      rule: "Requested Offset  50% – 120%",
      evaluate: () => {
        if (offset < 50 || offset > 120) return "warn";
        return "pass";
      },
      pill: {
        pass: "✓  PASS — Offset Reasonable",
        warn: "⚠  WARNING: Outside Normal Range",
        pending: "Awaiting input",
      },
    },
  ];

  const results = checks.map(c => ({ ...c, status: c.evaluate() }));
  const allPass = results.every(r => r.status === "pass");
  const anyFail = results.some(r => r.status === "fail");
  const anyWarn = results.some(r => r.status === "warn") && !anyFail;

  const overallStatus = !hasData ? "awaiting"
    : anyFail ? "rejected"
    : allPass ? "approved"
    : "awaiting";

  const bannerContent = {
    awaiting: { icon: "⏳", label: "Status", msg: "Awaiting Data — Complete all input fields to qualify." },
    approved: { icon: "✅", label: "Qualification Status", msg: "APPROVED FOR CONSULTATION — All criteria passed. Proceed to proposal." },
    rejected: { icon: "⛔", label: "Qualification Status", msg: "NOT APPROVED — Review flagged criteria before proceeding." },
  }[overallStatus];

  const reset = () => setVals({ name: "", pastDue: "", kwhYear: "", avgBill: "", offset: 80, repName: "" });

  return (
    <>
      <style>{css}</style>
      <div className="app">

        {/* ── Header ── */}
        <header className="header">
          <div className="header-left">
            <div className="company-tag">[YOUR COMPANY NAME]</div>
            <h1 className="app-title">Bill Diagnostic <span>&</span><br/>Qualification Tool</h1>
            <p className="app-subtitle">Solar Sales Training — Field Calculator</p>
          </div>
          <div className="header-badge">
            <div className="badge-label">Assessment Date</div>
            <div className="badge-date">{today()}</div>
          </div>
        </header>

        {/* ── Status Banner ── */}
        <div className={`status-banner ${overallStatus}`}>
          <div className="status-icon">{bannerContent.icon}</div>
          <div className="status-text">
            <div className="status-label">{bannerContent.label}</div>
            <div className="status-message">{bannerContent.msg}</div>
          </div>
        </div>

        {/* ── Section 1 + 2 (side by side) ── */}
        <div className="cols">

          {/* ── Section 1: Homeowner & Bill Data ── */}
          <div className="section-card">
            <div className="section-header">
              <div className="section-num">1</div>
              <div className="section-title">Homeowner & Bill Data</div>
            </div>
            <div className="section-body">

              <div className="field">
                <div className="field-label">
                  Homeowner Name
                </div>
                <div className="field-input-wrap">
                  <input
                    type="text"
                    placeholder="Full name"
                    value={vals.name}
                    onChange={e => set("name", e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <div className="field-label">
                  Past Due Balance
                  <span className="field-hint">utility account</span>
                </div>
                <div className="field-input-wrap">
                  <span className="field-prefix">$</span>
                  <input
                    type="number"
                    className="has-prefix"
                    placeholder="0.00"
                    min="0"
                    step="1"
                    value={vals.pastDue}
                    onChange={e => set("pastDue", e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <div className="field-label">
                  Trailing 12-Month Usage
                  <span className="field-hint">sum of all months</span>
                </div>
                <div className="field-input-wrap">
                  <span className="field-suffix">kWh</span>
                  <input
                    type="number"
                    className="has-suffix"
                    placeholder="e.g. 9600"
                    min="0"
                    value={vals.kwhYear}
                    onChange={e => set("kwhYear", e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <div className="field-label">
                  Average Monthly Bill
                  <span className="field-hint">annual ÷ 12</span>
                </div>
                <div className="field-input-wrap">
                  <span className="field-prefix">$</span>
                  <input
                    type="number"
                    className="has-prefix"
                    placeholder="e.g. 145.00"
                    min="0"
                    step="0.01"
                    value={vals.avgBill}
                    onChange={e => set("avgBill", e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <div className="field-label">
                  Requested System Offset
                  <span className="field-hint">% of usage to cover</span>
                </div>
                <div className="slider-wrap">
                  <input
                    type="range"
                    min="10"
                    max="130"
                    step="5"
                    value={vals.offset}
                    onChange={e => set("offset", e.target.value)}
                    style={{
                      background: `linear-gradient(to right, var(--amber) 0%, var(--amber) ${(vals.offset - 10) / 1.2}%, var(--navy-light) ${(vals.offset - 10) / 1.2}%, var(--navy-light) 100%)`
                    }}
                  />
                  <div className="slider-val">{vals.offset}%</div>
                </div>
              </div>

            </div>
          </div>

          {/* ── Section 2: System Estimates ── */}
          <div className="section-card">
            <div className="section-header">
              <div className="section-num">2</div>
              <div className="section-title">System Estimates</div>
            </div>
            <div className="section-body">

              <div className="metric">
                <div className="metric-label">Estimated System Size</div>
                <div className={`metric-value ${systemKw ? "highlight" : ""}`}>
                  {systemKw ? fmt.kw(systemKw) : "—"}
                </div>
                <div className="metric-sub">kWh Used × Offset% ÷ 1,400 kWh/kW/yr</div>
              </div>

              <div className="metric">
                <div className="metric-label">Estimated Annual Production</div>
                <div className={`metric-value ${annualProd ? "highlight" : ""}`}>
                  {annualProd ? fmt.kwh(annualProd) : "—"}
                </div>
                <div className="metric-sub">System Size × 1,400 kWh/kW/yr</div>
              </div>

              <div className="metric">
                <div className="metric-label">Monthly Bill Offset</div>
                <div className={`metric-value ${monthlyOffset ? "highlight" : ""}`}>
                  {monthlyOffset ? fmt.usd(monthlyOffset) : "—"}
                </div>
                <div className="metric-sub">Avg Monthly Bill × Offset%</div>
              </div>

              <div className="savings-grid">
                <div className="metric">
                  <div className="metric-label">5-Year Savings</div>
                  <div className="metric-value">{yr5savings ? fmt.usd(yr5savings) : "—"}</div>
                </div>
                <div className="metric">
                  <div className="metric-label">25-Year Savings</div>
                  <div className="metric-value">{yr25savings ? fmt.usd(yr25savings) : "—"}</div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ── Section 3: Qualification Checks ── */}
        <div className="section-card" style={{ marginBottom: 16 }}>
          <div className="section-header">
            <div className="section-num">3</div>
            <div className="section-title">Qualification Checks — Auto-Calculated</div>
          </div>
          <div className="checks">
            {results.map(r => (
              <div key={r.id} className={`check-row ${r.status}`}>
                <div className="check-accent" />
                <div className="check-inner">
                  <div className="check-info">
                    <div className="check-name">{r.name}</div>
                    <div className="check-rule">{r.rule}</div>
                  </div>
                  <div className="check-pill">{r.pill[r.status] || r.pill.pending}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Rep + Reset ── */}
        <div className="section-card">
          <div className="section-header">
            <div className="section-num">4</div>
            <div className="section-title">Rep Information</div>
          </div>
          <div className="section-body">
            <div className="field">
              <div className="field-label">Sales Representative Name</div>
              <div className="field-input-wrap">
                <input
                  type="text"
                  placeholder="Rep full name"
                  value={vals.repName}
                  onChange={e => set("repName", e.target.value)}
                />
              </div>
            </div>
            <button className="reset-btn" onClick={reset}>↺ &nbsp;Clear All Fields</button>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="footer">
          <div className="footer-left">
            [YOUR COMPANY NAME] · Solar Bill Diagnostic Tool<br />
            For Internal Sales Use Only · Confidential &amp; Proprietary
          </div>
          <div className="footer-right">
            Estimates only. Actual savings vary by<br />
            utility rates, usage &amp; system performance.
          </div>
        </footer>

      </div>
    </>
  );
}
