# ColdTrust Frontend Application State

**Framework:** React 19  
**Build Tool:** Vite v8  
**Styling System:** Vanilla CSS + Tailwind v4 + ColdTrust Enterprise Design Tokens (`src/index.css`)  
**Icon Library:** Lucide React  
**Build Target:** `frontend/dist/index.html`

---

## 1. Application Layout & Component Architecture

The frontend is structured as a responsive **2-Column Enterprise Command Center Workspace** (`App.jsx`):

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Top Command Header (Navbar)                     │
├────────────────────────────────────────────────────────────────────────┤
│                     Operational KPI Grid (KpiGrid)                     │
├────────────────────────────────────────────────────┬───────────────────┤
│                                                    │                   │
│         Main Consignment Roster (ShipmentTable)    │ Operations        │
│         - Multi-field search                       │ Sidebar           │
│         - Status filter tabs                       │ - Critical Alerts │
│         - Interactive column sorting               │ - Network Topo    │
│         - Mobile card fallback                     │ - Active Feed     │
│                                                    │                   │
└────────────────────────────────────────────────────┴───────────────────┘
```

---

## 2. Component Inventory

| Component Name | File Path | Role & Responsibilities |
| :--- | :--- | :--- |
| `App.jsx` | `frontend/src/App.jsx` | Main application shell, state polling (4s interval), API handlers, toast notifications. |
| `Navbar.jsx` | `src/components/Navbar.jsx` | Enterprise control header, network health indicator, active MSP role selector (`ManufacturerMSP`, `TransportMSP`, `RetailerMSP`, `RegulatorMSP`), mobile menu toggle. |
| `KpiGrid.jsx` | `src/components/KpiGrid.jsx` | Operational metric tiles (Total Assets, In Transit, Delivered, Compromised, Compliance Rate %) with data-driven progress sparklines. |
| `ShipmentTable.jsx` | `src/components/ShipmentTable.jsx` | Dense consignment table with sorting, search, status filtering tabs, and mobile card view fallback ($\le 768\text{px}$). |
| `OperationsSidebar.jsx` | `src/components/OperationsSidebar.jsx` | Right side panel featuring Critical Breach Alerts, Consortium Network Topology status (`Raft Consensus OK`, `4 Peers`), and Active Custody Stream. |
| `AuditTimelineModal.jsx` | `src/components/AuditTimelineModal.jsx` | Slide-over inspection drawer for shipment details, custody route, live telemetry chart, and Fabric revision history. |
| `TemperatureChart.jsx` | `src/components/TemperatureChart.jsx` | Time-series SVG line chart plotting telemetry readings against $2.0^\circ\text{C}$ min and $4.0^\circ\text{C}$ max thresholds, with red breach markers. |
| `RouteMapVisualizer.jsx` | `src/components/RouteMapVisualizer.jsx` | Visual custody progress tracker showing stages from Manufacturer $\rightarrow$ Carrier $\rightarrow$ Destination with active custodian badges. |
| `CreateShipmentModal.jsx` | `src/components/CreateShipmentModal.jsx` | Asset initialization modal drawer with field validation, temperature inputs, and committing state feedback. |
| `TelemetryModal.jsx` | `src/components/TelemetryModal.jsx` | IoT sensor reading simulation modal with temperature slider and breach alert warning banner. |
| `NotificationToast.jsx` | `src/components/NotificationToast.jsx` | Toast notification container for success, error, and breach alerts replacing browser `alert()` popups. |

---

## 3. Build & Responsive Verification Status

* **Production Build Status:** Verified passing cleanly (`npm run build` $\rightarrow$ `✓ built in 343ms`).
* **Responsive Testing Matrix:** Verified across 7 target resolutions ($1920\times 1080$, $1440\times 900$, $1366\times 768$, $1024\times 768$, $768\times 1024$, $480\times 800$, $375\times 812$). Zero horizontal page overflow.
* **Accessibility Checklist:** WCAG AA focus-visible outlines (`:focus-visible`), ARIA modal attributes (`role="dialog"`), `Escape` key listeners, reduced motion support (`prefers-reduced-motion: reduce`).
