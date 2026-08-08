# ColdTrust — Enterprise Global Cold Chain Consortium Network

[![Hyperledger Fabric](https://img.shields.io/badge/Hyperledger_Fabric-v2.5.16-blue.svg)](https://www.hyperledger.org/use/fabric)
[![Node.js](https://img.shields.io/badge/Node.js-v22.23.2-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19.2-cyan.svg)](https://react.dev/)
[![Docker](https://img.shields.io/badge/Docker_Compose-v29.6-blue.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-Apache_2.0-lightgrey.svg)](LICENSE)

**ColdTrust** is a production-grade enterprise blockchain platform demonstrating how multi-organization global cold chain logistics networks securely monitor, track, and enforce automated temperature compliance for temperature-sensitive cargo (pharmaceuticals, mRNA vaccines, biologics).

---

## 🌟 Architecture & Network Overview

### 4-Organization Consortium Topology
The ColdTrust network runs on **Hyperledger Fabric v2.5.16** across 13 healthy Docker containers:

```text
                               ┌───────────────────────────┐
                               │  OrdererOrg (Raft Orderer)│
                               │  orderer.coldchain.com    │
                               └─────────────┬─────────────┘
                                             │
      ┌──────────────────────┬───────────────┴───────────────┬──────────────────────┐
      │                      │                               │                      │
┌─────▼──────────────┐ ┌─────▼──────────────┐ ┌──────────────▼──────┐ ┌──────────────▼──────┐
│ ManufacturerMSP    │ │ TransportMSP       │ │ RetailerMSP         │ │ RegulatorMSP        │
│ manufacturer.com   │ │ transport.com      │ │ retailer.com        │ │ regulator.com       │
├────────────────────┤ ├────────────────────┤ ├─────────────────────┤ ├─────────────────────┤
│ • peer0.manuf:7051 │ │ • peer0.trans:8051 │ │ • peer0.ret:9051    │ │ • peer0.reg:10051   │
│ • CouchDB (5984)   │ │ • CouchDB (6984)   │ │ • CouchDB (7984)    │ │ • CouchDB (8984)    │
│ • CA (7054)        │ │ • CA (8054)        │ │ • CA (9054)         │ │ • CA (10054)        │
└────────────────────┘ └────────────────────┘ └─────────────────────┘ └─────────────────────┘
```

---

## ⚡ Core Business Features & Automated Rule Engine

1. **Automated Temperature Breach Rule Engine**:
   - Chaincode enforces strict temperature limits (`minTemp` to `maxTemp`).
   - If an IoT sensor logs `temperature > maxTemp` (e.g. `5.6°C > 4.0°C`), the smart contract instantly and immutably transitions shipment status to **`COMPROMISED`**.
   - Status `COMPROMISED` is permanent and can **never** revert to `SAFE`, `IN_TRANSIT`, or `DELIVERED`.

2. **Strict Layered Backend Service** (`backend/`):
   - **TypeScript** throughout.
   - **Layered Architecture**: `Client ──► Routes ──► Controllers ──► Services ──► Repositories ──► Fabric Gateway ──► Blockchain`.
   - **Zod Validation** schemas for all inputs.
   - **Winston Structured Logging** (`logs/application.log` and `logs/error.log`).
   - **Interactive Swagger UI**: Hosted at `http://localhost:3000/api-docs`.

3. **Logistics Operations Dashboard** (`frontend/`):
   - React 19 + Vite dashboard styled for enterprise logistics operators.
   - KPI metrics grid, live status badges, organization switcher, audit timeline drawer, and IoT sensor telemetry simulator.

4. **Real-Time IoT Telemetry Simulator** (`simulator/`):
   - Simulates streaming GPS coordinates, humidity, ambient temperature, and automated breach spikes every 5 seconds.

---

## 🛠️ Quick Start & Local Execution

### 1. Network Requirements
- Linux / WSL2 Ubuntu
- Node.js `v20.x` or `v22.x`
- Docker Engine `v24+` & Docker Compose

### 2. Boot Blockchain Consortium Network
```bash
cd blockchain
./network.sh up createChannel -c coldchain-channel
./scripts/deployCC.sh
```

### 3. Start Backend REST API Service
```bash
cd backend
npm install
npm run build
npm start
```
- API Health Check: `curl http://localhost:3000/health`
- Swagger UI Documentation: `http://localhost:3000/api-docs`

### 4. Launch Logistics Operations Dashboard
```bash
cd frontend
npm install
npm run dev
```
- Open Dashboard in Browser: `http://localhost:5173`

### 5. Launch Real-Time IoT Telemetry Simulator
```bash
cd simulator
npm install
npm start
```

---

## 🧪 End-to-End Test Suite Verification

Run the automated 6-step consortium integration test:
```bash
cd backend
npx ts-node ../scripts/e2eTest.ts
```

```text
====================================================
🚀 COLDTRUST END-TO-END CONSORTIUM SCENARIO TEST
====================================================
1️⃣  [ManufacturerMSP] Creating Shipment Asset SHIP-E2E-8971... Status: CREATED
2️⃣  [TransportMSP] Accepting Custody of SHIP-E2E-8971... Status: IN_TRANSIT
3️⃣  [IoT Sensor] Streaming Normal Telemetry (3.1°C)... Status: IN_TRANSIT
4️⃣  [IoT Sensor] Transmitting Temperature Spike (5.8°C > 4.0°C)... 🚨 LEDGER STATUS: COMPROMISED
5️⃣  [RetailerMSP] Receiving Shipment at Hospital... Status: COMPROMISED
6️⃣  [RegulatorMSP] Auditing Cryptographic Ledger History... Found 5 block commits.

✅ END-TO-END CONSORTIUM SCENARIO TEST PASSED 100%!
```

---

## 🚀 Version 2.0 Roadmap & Future Enhancements

- [ ] **Role-Based Access Control (RBAC)**: JWT authentication & OAuth2 integration with MSP certificate identity binding.
- [ ] **Real IoT Gateway Integration**: Native MQTT / CoAP protocol broker for physical cellular cold-chain hardware.
- [ ] **Hyperledger Explorer**: Embedded web block explorer for channel monitoring.
- [ ] **Metrics & Alerting**: Prometheus & Grafana dashboard for peer gRPC latency and container CPU/memory tracking.
- [ ] **Kubernetes Deployment**: Helm charts for multi-cloud enterprise production deployment.
- [ ] **Mobile Operations App**: React Native mobile app for carrier barcode scanning at pickup and drop-off.

---

## 📄 License
Licensed under the [Apache License, Version 2.0](LICENSE).
