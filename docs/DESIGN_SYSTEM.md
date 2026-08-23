# ColdTrust Visual Design System Guide

**Design Direction:** Premium Enterprise Cold-Chain Logistics Operations Command Center  
**Visual Inspiration:** SAP Fiori / IBM Supply Chain / DHL Operations Control Center  
**Primary CSS Token File:** `frontend/src/index.css`

---

## 1. Design Tokens & CSS Variables

```css
:root {
  /* Surfaces & Backgrounds - Dark Navy & Slate */
  --bg-dark: #0b0f17;
  --bg-surface: #131b2e;
  --bg-surface-hover: #1a243b;
  --bg-surface-active: #222e4a;

  /* Borders & Dividers */
  --border-color: #1e293b;
  --border-light: #28354d;
  --border-focus: #0ea5e9;

  /* Brand Accents - Restrained Ice-Blue / Cyan */
  --accent-primary: #0ea5e9;
  --accent-primary-hover: #0284c7;
  --accent-cyan: #38bdf8;

  /* Status Indicators - Cold Chain Operations */
  --status-created: #6366f1;
  --status-created-bg: rgba(99, 102, 241, 0.12);
  --status-created-border: rgba(99, 102, 241, 0.3);

  --status-in-transit: #38bdf8;
  --status-in-transit-bg: rgba(56, 189, 248, 0.12);
  --status-in-transit-border: rgba(56, 189, 248, 0.3);

  --status-delivered: #10b981;
  --status-delivered-bg: rgba(16, 185, 129, 0.12);
  --status-delivered-border: rgba(16, 185, 129, 0.3);

  --status-compromised: #ef4444;
  --status-compromised-bg: rgba(239, 68, 68, 0.14);
  --status-compromised-border: rgba(239, 68, 68, 0.4);

  /* Typography Colors - High Contrast WCAG AA */
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;

  /* Fonts */
  --font-heading: 'Outfit', 'Inter', -apple-system, sans-serif;
  --font-body: 'Inter', -apple-system, sans-serif;
  --font-mono: 'IBM Plex Mono', 'JetBrains Mono', monospace;

  /* Border Radii */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
}
```

---

## 2. Typography & Hierarchy Standard

* **Headings (`h1`, `h2`, `h3`, `h4`):** `Outfit` / `Inter` (`font-bold`, tracking `-0.01em`, color `#f8fafc`).
* **Body & Labels:** `Inter` (11px–13px crisp data-dense typography, color `#f8fafc` or `#94a3b8`).
* **Technical Identifiers & Telemetry:** `IBM Plex Mono` / `JetBrains Mono` (used for `shipmentID`, `txId`, temperature readings, timestamps, and MSP names).

---

## 3. Visual Language Rules

### Allowed Patterns
* Solid dark navy background (`#0B0F17`) and graphite cards (`#131B2E`) with subtle $1\text{px}$ borders (`#1E293B`).
* High data density with clean scannability.
* Restrained status colors (`CREATED` indigo, `IN_TRANSIT` blue, `DELIVERED` emerald, `COMPROMISED` crimson).
* Subtle accessibility focus-visible outlines (`:focus-visible`).

### Strictly Forbidden Patterns
* ❌ NO Web3 / Crypto aesthetics (no coins, tokens, or glowing blockchain cubes).
* ❌ NO neon cyan glow effects (`box-shadow: 0 0 20px ...`).
* ❌ NO multi-color text gradients (`bg-gradient-to-r from-cyan to-pink`).
* ❌ NO heavy glassmorphic blurs or random floating elements.
* ❌ NO turning the entire application background red when a single shipment is compromised. Red alerts must remain targeted and restrained.
