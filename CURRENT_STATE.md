# ColdTrust Enterprise Network — Current System State

**Last Updated:** 2026-08-14  
**Project Name:** ColdTrust – Enterprise Global Cold Chain Network  
**Local Workspace:** `Enterprise-Cold-Chain-Network`  
**GitHub Remote:** `git@github.com:Ramkumarakula/Coldtrust.git` (`main` branch)

---

## 1. Executive Summary

ColdTrust is a production-grade enterprise cold-chain logistics platform built around **Hyperledger Fabric v2.5.16**. It monitors and traces temperature-sensitive consignments (e.g., pharmaceuticals, vaccines, biologics) across a 4-organization supply chain consortium:
- **BioTechLabs** (`ManufacturerMSP`)
- **SwiftLogistics** (`TransportMSP`)
- **MetroHospital** (`RetailerMSP`)
- **FDA / EMEA** (`RegulatorMSP`)

All core subsystems—blockchain consortium topology, Golang smart contract chaincode, layered Node.js/TypeScript REST API backend, React 19 / Vite command center dashboard, and Node.js IoT telemetry simulator—are 100% written, compiled, and verified.

---

## 2. Directory Structure Overview

```
Enterprise-Cold-Chain-Network/
├── .agents/                    # Custom AI agent skills & project rules
│   └── skills/                 # Installed skill packages (coldtrust-enterprise-ui, etc.)
├── .claude/                    # Claude CLI agent settings & skill scripts
├── architecture/               # Diagram generation tools & architectural assets
├── backend/                    # Layered Node.js / TypeScript REST API Service
│   ├── dist/                   # Compiled JavaScript build output
│   ├── src/                    # Controllers, Services, Repositories, Gateway, Validators
│   └── package.json            # Express, @hyperledger/fabric-gateway, Zod, Winston
├── blockchain/                 # Hyperledger Fabric v2.5.16 Infrastructure
│   ├── channel/                # Channel artifacts (genesis.block, coldchain.tx, anchor TXs)
│   ├── compose/                # Docker Compose files (peers, orderer, CouchDB, CAs)
│   ├── config/                 # configtx.yaml channel configuration
│   ├── organizations/          # Cryptographic MSP identities, connection profiles, CAs
│   └── scripts/                # Network startup, channel creation, chaincode deployment
├── chaincode/                  # Smart Contract Source Code
│   └── shipment/               # Golang Chaincode (shipment.go, smartcontract.go, unit tests)
├── docker/                     # Auxiliary Docker configurations
├── docs/                       # Comprehensive Architecture & Engineering Documentation
│   ├── AGENT_SKILLS.md
│   ├── AGENT_LOOP.md
│   ├── ARCHITECTURE_BASELINE.md
│   ├── ARCHITECTURE_CHANGE_PROTOCOL.md
│   ├── BACKEND_STATE.md
│   ├── BLOCKCHAIN_STATE.md
│   ├── DECISIONS.md
│   ├── DESIGN_SYSTEM.md
│   ├── FRONTEND_STATE.md
│   ├── FUTURE_ARCHITECTURE.md
│   ├── GIT_HISTORY.md
│   ├── KNOWN_ISSUES.md
│   ├── MILESTONE_HISTORY.md
│   ├── SESSION_STATE.md
│   ├── API_SPECIFICATION.md
│   ├── CHAINCODE_SPECIFICATION.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── ROADMAP.md
│   ├── SRS.md
│   └── TESTING_GUIDE.md
├── frontend/                   # Operations Dashboard (React 19 + Vite)
│   ├── dist/                   # Production build bundle output
│   ├── src/                    # Components (Navbar, KpiGrid, ShipmentTable, Drawers, Charts)
│   └── package.json            # React 19, Vite 8, Lucide React, Tailwind v4
├── scripts/                    # Master automation scripts (network.sh, e2eTest.ts)
├── simulator/                  # Real-Time IoT Telemetry Simulator
│   ├── dist/                   # Compiled simulator script (simulator.js)
│   └── src/                    # TypeScript simulation engine (simulator.ts)
├── AGENTS.md                   # Primary instruction manual for AI coding agents
├── CURRENT_STATE.md            # Complete system state record (THIS FILE)
├── README.md                   # Project Overview & Quickstart Guide
└── skills-lock.json            # Custom skills registry lock file
```

---

## 3. Subsystem Detailed Inventory

### A. Blockchain Consortium (`blockchain/`)
* **PURPOSE:** Provides immutable, permissioned multi-org ledger consensus and state tracking.
* **TECHNOLOGY:** Hyperledger Fabric v2.5.16, Raft Consensus, CouchDB state database.
* **CURRENT IMPLEMENTATION:**
  * **4 Consortium Orgs:** `ManufacturerMSP`, `TransportMSP`, `RetailerMSP`, `RegulatorMSP`.
  * **17 Docker Containers:** 1 Raft Orderer (`orderer.coldchain.com`), 4 Peer Nodes (`peer0` per Org), 4 CouchDB databases, 4 Certificate Authorities (CAs), and 4 Smart Contract dev containers.
  * **Channel:** `coldchain-channel`.
  * **Connection Profiles:** JSON connection profiles generated in `blockchain/organizations/ccp/`.
* **CURRENT STATUS:** `CONFIGURED`, `IMPLEMENTED`, `VERIFIED`. (Stopped cleanly after e2e tests).
* **ENTRY POINTS:** `./scripts/network.sh up` or `blockchain/scripts/createChannel.sh`.
* **IMPORTANT FILES:** `blockchain/config/configtx.yaml`, `blockchain/compose/docker-compose-peers.yaml`.
* **DO NOT CHANGE WITHOUT REVIEW:** Crypto materials, genesis block config, organization MSP names.

### B. Smart Contract Chaincode (`chaincode/shipment/`)
* **PURPOSE:** Implements chaincode business logic and immutable temperature breach rules.
* **TECHNOLOGY:** Golang (`fabric-contract-api-go`).
* **CURRENT IMPLEMENTATION:**
  * Assets: `Shipment` (ID, Name, Mfg, Carrier, Recipient, Location, Owner, MinTemp, MaxTemp, CurrentTemp, Status, TelemetryLogs).
  * Lifecycle States: `CREATED` $\rightarrow$ `IN_TRANSIT` $\rightarrow$ `COMPROMISED` / `DELIVERED`.
  * Automated Compromise Rule: If telemetry update records `temperature > MaxTemp`, chaincode permanently sets status to `COMPROMISED`.
* **CURRENT STATUS:** `COMPILED`, `TESTED` (unit test suite in `smartcontract_test.go` passed).
* **ENTRY POINT:** `chaincode/shipment/smartcontract.go`.
* **DO NOT CHANGE WITHOUT REVIEW:** State transition rules, temperature breach enforcement logic, struct JSON tags.

### C. Backend REST API Service (`backend/`)
* **PURPOSE:** Provides RESTful API endpoints for client consumption and Fabric Gateway gRPC integration.
* **TECHNOLOGY:** Node.js, TypeScript, Express, `@hyperledger/fabric-gateway`, Zod, Winston.
* **CURRENT IMPLEMENTATION:**
  * Layered Architecture: `Client` $\rightarrow$ `Routes` $\rightarrow$ `Controllers` $\rightarrow$ `Services` $\rightarrow$ `Repositories` $\rightarrow$ `Fabric Gateway` $\rightarrow$ `Blockchain`.
  * Endpoints: `POST /api/shipments`, `GET /api/shipments`, `GET /api/shipments/:id`, `PUT /api/shipments/:id/accept`, `POST /api/shipments/:id/telemetry`, `PUT /api/shipments/:id/receive`, `GET /api/shipments/:id/history`.
  * Interactive Swagger UI at `http://localhost:3000/api-docs` and Health Check at `/health`.
* **CURRENT STATUS:** `COMPILED` (`dist/server.js`), `VERIFIED` via integration tests.
* **ENTRY POINT:** `backend/src/server.ts` / `npm start`.
* **DO NOT CHANGE WITHOUT REVIEW:** API contract schemas, Fabric connection parameters, HTTP status codes.

### D. Operations Dashboard Frontend (`frontend/`)
* **PURPOSE:** Enterprise operations center for monitoring logistics KPIs, consignments, route maps, and audit trails.
* **TECHNOLOGY:** React 19, Vite 8, Lucide React, Vanilla CSS + Tailwind v4 design tokens.
* **CURRENT IMPLEMENTATION:**
  * **2-Column Command Layout:** Top Header (`Navbar`), Operational KPI Grid (`KpiGrid`), Main Consignment Roster (`ShipmentTable`), and Operations Sidebar (`OperationsSidebar`).
  * **Drawers & Visualizers:** Slide-over Audit Drawer (`AuditTimelineModal`), SVG Time-Series Temperature Chart (`TemperatureChart`), Route Map Progress Tracker (`RouteMapVisualizer`), Toast System (`NotificationToast`).
  * **Responsive Grid:** Tested across 7 target viewports ($1920\times 1080$ down to $375\times 812$) with mobile card fallback.
* **CURRENT STATUS:** `COMPILED` (`npm run build` passing cleanly), `DESIGN VERIFIED`.
* **ENTRY POINT:** `frontend/src/main.jsx` / `npm run dev`.
* **DO NOT CHANGE WITHOUT REVIEW:** Design token system (`src/index.css`), API fetch contracts in `App.jsx`.

### E. IoT Telemetry Simulator (`simulator/`)
* **PURPOSE:** Simulates streaming IoT sensors sending real-time ambient temp, humidity, and location updates.
* **TECHNOLOGY:** Node.js, TypeScript, Axios.
* **CURRENT IMPLEMENTATION:**
  * Streams real-time HTTP requests to `POST /api/shipments/:id/telemetry`.
  * Automated breach trigger test cycle.
* **CURRENT STATUS:** `COMPILED` (`dist/simulator.js`), `VERIFIED`.
* **ENTRY POINT:** `cd simulator && npm start`.
* **DO NOT CHANGE WITHOUT REVIEW:** Payload property names matching Zod validator schemas.

---

## 4. Environment & Tooling Assumptions

1. **OS Environment:** Windows 11 host with Ubuntu 22.04 LTS WSL2.
2. **Runtime Binaries:** Node.js (v20+), npm, Go (v1.21+), Docker Desktop with WSL2 backend integration, Git, bash.
3. **Execution Boundary:**
   - Docker / WSL commands require Ubuntu environment execution (`wsl -d Ubuntu bash -c "..."`).
   - Frontend and documentation can be built or verified locally.
4. **Port Allocation:**
   - Backend REST API: `3000` (Swagger UI: `/api-docs`)
   - Frontend Dashboard: `5173` (Fallback: `5174`)
   - Fabric Orderer: `7050`
   - Fabric Peers: `7051` (Manufacturer), `8051` (Transport), `9051` (Retailer), `10051` (Regulator)
   - CouchDB State DBs: `5984`, `6984`, `7984`, `8984`.
