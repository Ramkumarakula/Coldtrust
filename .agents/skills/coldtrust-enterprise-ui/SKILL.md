---
name: coldtrust-enterprise-ui
description: "ColdTrust-specific enterprise UI and UX rules. Use whenever designing, reviewing, refactoring, or polishing the ColdTrust React frontend, including dashboards, shipment operations, telemetry, route visualization, custody tracking, audit history, forms, responsive layouts, and visual interactions."
---

# ColdTrust Enterprise UI

## Product Identity

ColdTrust is an Enterprise Global Cold Chain Network.

It is an operational platform for monitoring and tracing temperature-sensitive shipments across a consortium supply chain.

The primary users are enterprise logistics, pharmaceutical supply-chain, transport, retail, and regulatory teams.

The interface must communicate:

- trust
- operational control
- traceability
- compliance
- precision
- reliability
- security

The product should look like serious enterprise logistics software.

Visual references:

- SAP enterprise operations
- IBM supply-chain platforms
- DHL logistics systems
- Siemens industrial operations software

Do NOT make ColdTrust look like a cryptocurrency application.

---

# Visual Direction

## Overall aesthetic

Premium enterprise command center.

Dark, precise, restrained and information-dense.

Use visual hierarchy rather than decoration.

Prefer:

- dark navy
- graphite surfaces
- restrained ice blue
- subtle cyan accents
- white and cool-gray typography
- controlled semantic status colors
- crisp borders
- consistent spacing
- restrained shadows

Avoid:

- excessive neon
- excessive glow
- excessive gradients
- excessive glassmorphism
- crypto/Web3 aesthetics
- NFT-style visuals
- gaming dashboards
- floating decorative objects
- meaningless animations
- excessive rounded cards

---

# Color Language

Use the existing ColdTrust design tokens whenever available.

Primary:

- deep navy background
- graphite surface
- ice blue primary accent
- restrained cyan secondary accent

Semantic states:

CREATED:
- indigo / neutral staged state

IN_TRANSIT:
- blue / cyan

DELIVERED:
- emerald / safe

COMPROMISED:
- controlled crimson / critical

Important:

Do not turn the entire interface red when a shipment is compromised.

Red should identify the operational problem, not dominate the application.

---

# Information Hierarchy

ColdTrust is an operational application.

Important information must be visually prioritized.

Dashboard priority:

1. Critical shipment conditions
2. Overall shipment status
3. Temperature compliance
4. Current location/custody
5. Network health
6. Shipment activity
7. Audit information

Do not give decorative elements more visual weight than operational data.

---

# Dashboard

The dashboard should immediately answer:

"What is happening across my cold-chain network?"

The first viewport should communicate:

- total shipments
- in-transit shipments
- delivered shipments
- compromised shipments
- compliance rate
- network health
- important alerts
- current shipment activity

Do not fabricate metrics.

Always use real application data.

---

# Shipment Operations

Shipment information should prioritize:

- Shipment ID
- Product
- Status
- Temperature
- Location
- Custodian
- Updated time
- Available actions

Tables should be dense enough for enterprise operations but remain readable.

Use subtle row hover states.

Use consistent status badges.

Avoid unnecessary decorative table elements.

---

# Shipment Details

The shipment investigation experience should follow this hierarchy:

Shipment identity
↓
Current status
↓
Temperature condition
↓
Current custody/location
↓
Route
↓
Telemetry
↓
Blockchain audit history

The user should be able to understand the shipment journey without opening many unrelated dialogs.

---

# Temperature Monitoring

Temperature is a critical business signal.

Clearly communicate:

- current temperature
- minimum allowed temperature
- maximum allowed temperature
- timestamp
- humidity
- location
- breach status

Temperature charts should visually distinguish:

safe readings
threshold boundaries
breach readings

Never fabricate sensor readings.

---

# Route Visualization

Route visualization represents physical supply-chain movement.

Use actual available shipment information.

Typical conceptual flow:

Manufacturer
→ Transport
→ Destination / Retailer

If geographic coordinates are unavailable, create a custody/route visualization instead of pretending that precise GPS data exists.

Never invent geographic precision.

---

# Blockchain Presentation

Blockchain is infrastructure supporting trust.

Do NOT present it as cryptocurrency.

Avoid:

- coins
- tokens
- NFT visuals
- glowing chains
- floating blockchain cubes
- crypto terminology

Instead show meaningful enterprise audit information:

- transaction ID
- organization/MSP
- timestamp
- ledger event
- state transition
- audit history
- recorded telemetry
- custody changes

The user should understand the business event before needing to understand blockchain technology.

---

# Typography

Use the established ColdTrust typography system.

Maintain a clear hierarchy:

Page title
Section heading
Component title
Primary metric
Body
Secondary metadata

Use monospace typography for:

- transaction IDs
- hashes
- telemetry values when appropriate
- technical identifiers

Do not make technical identifiers visually dominant over business information.

---

# Components

Components should feel like parts of one enterprise product.

Maintain consistency across:

- Navbar
- KPI cards
- tables
- shipment cards
- drawers
- forms
- buttons
- badges
- charts
- timelines
- notifications

Avoid introducing a new visual pattern when an existing ColdTrust pattern can be reused.

---

# Responsive Design

ColdTrust must work intentionally across:

1920×1080
1440×900
1366×768
1024×768
768×1024
480×800
375×812

Never allow:

- horizontal page overflow
- clipped controls
- inaccessible dialogs
- overlapping content
- unreadable charts
- broken tables

On small screens, transform complex desktop layouts into appropriate mobile representations rather than simply shrinking them.

Shipment tables may become shipment cards.

Large drawers may become full-screen mobile panels.

---

# Accessibility

Follow WCAG-oriented practices.

Ensure:

- readable contrast
- visible focus states
- keyboard navigation
- accessible form labels
- meaningful button labels
- appropriate ARIA attributes
- touch targets are usable
- information is not communicated through color alone

Never remove focus indicators merely for aesthetics.

---

# Animation

Motion must communicate meaning.

Good uses:

- drawer transitions
- loading indicators
- status changes
- subtle hover transitions
- route progression
- chart entrance

Keep transitions short and restrained.

Avoid:

- constant pulsing
- excessive glowing
- particle effects
- decorative blockchain animations
- unnecessary page transitions

Support reduced-motion preferences where appropriate.

---

# Data Integrity

NEVER invent:

- shipment data
- telemetry
- GPS coordinates
- blockchain transactions
- organization activity
- compliance statistics
- block numbers
- transaction IDs

If data does not exist, represent the absence of data honestly.

Use:

"Not available"

rather than fabricated information.

---

# Technical Boundaries

This skill applies to the FRONTEND ONLY.

Do not modify:

- Hyperledger Fabric
- chaincode
- smart contracts
- CouchDB
- orderer
- peer configuration
- certificate authorities
- blockchain network configuration
- backend business logic
- REST API contracts
- IoT simulator

Preserve existing API contracts and application behavior.

---

# Design Quality Test

Before completing UI work, ask:

1. Does this look like enterprise logistics software?
2. Is operational information more prominent than decoration?
3. Does the interface feel trustworthy?
4. Is the visual system consistent?
5. Does the UI avoid crypto/Web3 aesthetics?
6. Is the responsive behavior intentional?
7. Is the interface accessible?
8. Is all displayed data real?
9. Does the design feel specific to cold-chain logistics?
10. Would a pharmaceutical logistics company consider this a credible internal operations platform?

If not, refine the design before completing the task.
