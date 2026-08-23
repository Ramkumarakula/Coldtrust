# ColdTrust Architecture Decision Records (ADRs)

---

## ADR-001: Selection of Hyperledger Fabric v2.5.16 as Blockchain Infrastructure
* **Status:** APPROVED
* **Date:** 2026-08-08
* **Context:** Enterprise cold chain logistics requires high-throughput, private, permissioned data sharing among competitive consortium entities (Manufacturers, Carriers, Hospitals, Regulators) without public transaction fees or public data exposure.
* **Decision:** Adopt **Hyperledger Fabric v2.5.16** with Raft consensus and CouchDB world state storage.
* **Consequences:** Enables fine-grained channel access control, endorsement policies per organization, and deterministic smart contract execution.

---

## ADR-002: Four-Organization Supply Chain Consortium Model
* **Status:** APPROVED
* **Date:** 2026-08-08
* **Context:** Real-world pharmaceutical supply chains involve distinct organizational roles with segregated operational permissions.
* **Decision:** Establish 4 distinct Certificate Authority organizations: `ManufacturerMSP` (BioTechLabs), `TransportMSP` (SwiftLogistics), `RetailerMSP` (MetroHospital), and `RegulatorMSP` (FDA / EMEA).
* **Consequences:** Provides identity-based access control where custody transfers and asset creation are restricted to authorized MSP contexts.

---

## ADR-003: Golang Chaincode Engine with Automated Compromise Rule
* **Status:** APPROVED
* **Date:** 2026-08-08
* **Context:** Temperature breaches during shipment transit irreversibly degrade biologics and vaccines, requiring immediate, immutable asset status updates.
* **Decision:** Implement chaincode in Golang (`fabric-contract-api-go`) containing an automated compromise rule (`temperature > maxTemp => COMPROMISED`).
* **Consequences:** Once triggered, `COMPROMISED` state transitions are permanent and immutably recorded on `coldchain-channel`.

---

## ADR-004: Layered Express + TypeScript REST API Backend with Fabric Gateway
* **Status:** APPROVED
* **Date:** 2026-08-08
* **Context:** Frontend clients and IoT devices require clean HTTP JSON interfaces rather than maintaining native gRPC Fabric SDK connections.
* **Decision:** Build a 5-layer Express/TypeScript REST service using `@hyperledger/fabric-gateway` (gRPC/TLS), Zod payload validation, and Winston logging.
* **Consequences:** Decouples client applications from blockchain protocol details and exposes interactive Swagger UI at `/api-docs`.

---

## ADR-005: React 19 + Vite Command Center Dashboard with Enterprise Design Tokens
* **Status:** APPROVED
* **Date:** 2026-08-14
* **Context:** Operational logistics monitoring requires high data density, real-time telemetry charting, and responsive card fallbacks across mobile and desktop.
* **Decision:** Build frontend using React 19, Vite 8, Lucide React, and a dedicated Enterprise Design System (`src/index.css`).
* **Consequences:** Enables fast HMR, responsive multi-viewport layout ($1920\times 1080$ down to $375\times 812$), and zero external UI library bloat.

---

## ADR-006: ColdTrust Enterprise UI Direction & Skill Authority Hierarchy
* **Status:** APPROVED
* **Date:** 2026-08-14
* **Context:** Project skills installed under `.agents/skills/` include both general web design guidelines and project-specific ColdTrust rules.
* **Decision:** Establish `.agents/skills/coldtrust-enterprise-ui/SKILL.md` as the **Primary Design Authority**. Web3/crypto visual effects, neon glows, and gradient text are strictly prohibited.
* **Consequences:** All future UI refinements must align with SAP / IBM / DHL enterprise operations center visual standards.
