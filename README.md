# ColdTrust – Enterprise Global Cold Chain Network

![Hyperledger Fabric](https://img.shields.io/badge/Hyperledger_Fabric-v2.5.16-2F3136?style=for-the-badge&logo=hyperledger&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-v22.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-v19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express-v5.x-000000?style=for-the-badge&logo=express&logoColor=white)
![CouchDB](https://img.shields.io/badge/CouchDB-v3.4-E0234E?style=for-the-badge&logo=apachecouchdb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-v29.x-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

**ColdTrust** is a production-grade, decentralized enterprise cold chain management platform built on **Hyperledger Fabric 2.5**. It enables multi-organization supply chain consortium members—**Manufacturers**, **Transport Companies**, **Retailers / Hospitals**, and **Regulators**—to transparently track temperature-sensitive shipments, ingest real-time IoT sensor telemetry, enforce automated smart contract compromise rules, and maintain non-repudiable audit logs.

---

## 🌟 Key Platform Capabilities

- **Consortium Blockchain:** 4 distinct organizations (Manufacturer, Transport, Retailer, Regulator) with custom Certificate Authorities (CAs), Raft Orderer, and peer nodes.
- **Automated Smart Contract Rule Engine:** Automatically marks shipments as `COMPROMISED` on the ledger if temperature exceeds **4.0°C**.
- **CouchDB World State Indexing:** Supports rich queries for shipment status, carrier history, and asset custody.
- **REST API Gateway:** Express.js service leveraging `@hyperledger/fabric-gateway` SDK with gRPC connection pooling and identity wallets.
- **IoT Sensor Telemetry Simulator:** Continuously streams real-time temperature, humidity, and GPS coordinates.
- **Enterprise Web Dashboard:** Modern React 19 visual dashboard with interactive metrics, audit trails, and live telemetry feeds.

---

## 📁 Repository Directory Structure

```
Enterprise-Cold-Chain-Network/
├── architecture/                 # System Architecture & Diagrams
│   ├── ARCHITECTURE.md           # Layered Enterprise Architecture Specification
│   └── DIAGRAMS.md               # Mermaid Diagrams (Consortium, State Machine, Sequence, ERD)
├── backend/                      # Node.js Express REST API Gateway
│   ├── package.json              # Backend Dependencies
│   └── src/                      # API Controllers, Gateway SDK Client, Routes
├── blockchain/                   # Hyperledger Fabric Network Artifacts
│   ├── configtx.yaml             # Channel & Consortium Profile Configurations
│   └── docker/                   # Docker Compose Services for Orderer, Peers, CAs, CouchDB
├── chaincode/                    # Hyperledger Fabric Smart Contracts
│   └── shipment/                 # Go / Node Chaincode Data Models & Logic
├── docker/                       # Infrastructure Docker compose overrides
├── docs/                         # Technical Specifications & Documentation
│   ├── SRS.md                    # Software Requirements Specification
│   ├── CHAINCODE_SPECIFICATION.md# Smart Contract Technical Specification
│   ├── API_SPECIFICATION.md      # OpenAPI/Swagger REST API Specification
│   ├── ROADMAP.md                # Development Roadmap & Milestone Tracker
│   ├── DEPLOYMENT_GUIDE.md       # Step-by-Step Local Deployment Guide
│   └── TESTING_GUIDE.md          # Multi-Level Testing Strategy Guide
├── frontend/                     # React 19 + Vite + TailwindCSS Web Application
│   ├── package.json              # Frontend Dependencies
│   └── src/                      # React Components, Dashboard Pages, State Management
├── scripts/                      # Shell Scripts for Network Bring-Up & Channel Lifecycle
├── simulator/                    # Background IoT Telemetry Stream Generator
└── tests/                        # Automated Unit, Integration & E2E Test Suites
```

---

## 📚 Technical Documentation Index

Detailed architectural specifications are available in the repository:
1. **[Software Requirements Specification (SRS)](docs/SRS.md)**
2. **[System Architecture Specification](architecture/ARCHITECTURE.md)**
3. **[Architecture Diagrams & Flowcharts](architecture/DIAGRAMS.md)**
4. **[Smart Contract Technical Specification](docs/CHAINCODE_SPECIFICATION.md)**
5. **[REST API Specification](docs/API_SPECIFICATION.md)**
6. **[Development Roadmap](docs/ROADMAP.md)**
7. **[Deployment Guide](docs/DEPLOYMENT_GUIDE.md)**
8. **[Testing Guide](docs/TESTING_GUIDE.md)**

---

## ⚡ Quick Start (Local Development)

```bash
# 1. Clone Repository & Navigate to Workspace
cd Enterprise-Cold-Chain-Network

# 2. Review Specifications
cat docs/SRS.md

# 3. Network bring-up (Available starting Milestone 3)
./scripts/network-up.sh
```

---

## 🛡️ License & Governance
Licensed under the [Apache License 2.0](LICENSE). Engineered as an enterprise portfolio demonstration.
