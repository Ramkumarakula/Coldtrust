# ColdTrust Agent Skills Registry & Authority Hierarchy

**Location:** `.agents/skills/`  
**Purpose:** Defines the specialized AI skills and design authority rules governing development on ColdTrust.

---

## 1. Skill Authority Hierarchy

When resolving conflicts between generic guidelines and project requirements, agents MUST enforce the following strict priority:

```
[ Primary Project Design Authority ]
         │  └─► coldtrust-enterprise-ui (OVERRULE ALL GENERIC STYLES)
         ▼
[ Technical & UX Expertise ]
         ├──► vercel-react-best-practices (React performance & state rules)
         ├──► responsive-design (Grid reflows & target sizing)
         ├──► accessibility (WCAG AA compliance)
         ├──► frontend-design (Copy clarity & typography)
         ├──► ui-ux-pro-max (Data density)
         └──► chart-visualization (SVG time-series chart concepts)
```

---

## 2. Discovered Skills Inventory

### 1. `coldtrust-enterprise-ui` (PRIMARY DESIGN AUTHORITY)
* **PURPOSE:** Enforces ColdTrust enterprise visual direction, dark navy surfaces, ice blue accents, strict no-crypto/Web3 rule, and logistics domain hierarchy.
* **WHEN TO USE:** For all UI design, styling, color palette, layout, and component presentation tasks on ColdTrust.
* **WHAT IT MUST NOT CHANGE:** Backend APIs, smart contract rules, or business logic.

### 2. `vercel-react-best-practices`
* **PURPOSE:** Provides React and Next.js performance optimization rules (memoization, eliminating waterfalls, derived state during render, stable callbacks).
* **WHEN TO USE:** When writing, reviewing, or refactoring React component code.
* **WHAT IT MUST NOT CHANGE:** Business logic or existing component API props.

### 3. `responsive-design`
* **PURPOSE:** Mobile-first responsive layouts, container queries, fluid typography, and mobile card fallbacks.
* **WHEN TO USE:** Implementing layouts across viewports ($1920\times 1080$ down to $375\times 812$).
* **WHAT IT MUST NOT CHANGE:** Desktop data availability or operational functionality.

### 4. `accessibility`
* **PURPOSE:** Enforces WCAG AA compliance (focus-visible outlines, ARIA modal attributes, keyboard escape key handlers, screen reader announcements).
* **WHEN TO USE:** Building interactive UI controls, modals, forms, and alerts.
* **WHAT IT MUST NOT CHANGE:** Visual design system tokens.

### 5. `frontend-design`
* **PURPOSE:** Distinctive enterprise visual identity, typography hierarchy, copy clarity, active voice in buttons.
* **WHEN TO USE:** Refining UI copy, micro-interactions, and visual hierarchy.
* **WHAT IT MUST NOT CHANGE:** Project-specific dark navy color language defined in `coldtrust-enterprise-ui`.

### 6. `ui-ux-pro-max`
* **PURPOSE:** High-density enterprise layout scaling, error summary validation, and operational data priority.
* **WHEN TO USE:** Designing dashboard data density and multi-column layouts.
* **WHAT IT MUST NOT CHANGE:** Must not inject Web3, crypto, or gaming aesthetics into ColdTrust.

### 7. `chart-visualization`
* **PURPOSE:** Principles for visual data display (time-series, thresholds, breach markers).
* **WHEN TO USE:** Conceptualizing temperature telemetry charts.
* **WHAT IT MUST NOT CHANGE:** Must not introduce external API calls to render charts (charts must be self-contained SVG/React components).
