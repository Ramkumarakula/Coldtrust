# Deployment Guide
## ColdTrust – Enterprise Global Cold Chain Network

**Document Version:** 1.0.0  
**Date:** August 2026  

---

## 1. Environment Prerequisites

Before deploying the ColdTrust network and application stack, verify that your host system satisfies the following software dependencies:

- **OS:** Ubuntu 22.04 LTS / 24.04 LTS (or WSL2 on Windows 11)
- **Docker:** Engine version 24.0+ / Docker Desktop v4.25+
- **Docker Compose:** v2.20+
- **Node.js:** v20.x or v22.x LTS
- **npm:** v10.x+
- **Hyperledger Fabric Tools:** v2.5.x (`peer`, `configtxgen`, `cryptogen`, `fabric-ca-client`)
- **Go:** v1.21+ (if modifying/building Go chaincode)

---

## 2. Directory Structure Overview

```
Enterprise-Cold-Chain-Network/
├── architecture/         # Architectural documentation & Mermaid diagrams
├── backend/              # Node.js Express REST API server & Fabric Gateway SDK
├── blockchain/           # Fabric network configuration, crypto-config, docker-compose
├── chaincode/            # Smart contract business logic (Go/Node)
├── docker/               # Additional container configuration files
├── docs/                 # Complete enterprise specification documents
├── frontend/             # React 19 + Vite + TailwindCSS Web Dashboard
├── scripts/              # Network startup, teardown, and channel setup scripts
├── simulator/            # IoT Telemetry Simulator service
└── tests/                # Automated unit and integration tests
```

---

## 3. Step-by-Step Local Deployment Flow

### Step 3.1: Network Setup & Certificate Generation
Navigate to the root directory and execute network initialization scripts:

```bash
# 1. Grant execution permissions to scripts
chmod +x scripts/*.sh

# 2. Generate Organization Crypto Materials & Channel Artifacts
./scripts/generate-crypto.sh

# 3. Spin up Docker Containers (Orderer, 4 Peernodes, 4 CouchDB instances, 4 CAs)
./scripts/network-up.sh
```

### Step 3.2: Channel Creation & Peer Joining
```bash
# Create channel 'coldchain-channel' and join Manufacturer, Transport, Retailer, and Regulator peers
./scripts/create-channel.sh
```

### Step 3.3: Smart Contract Deployment
```bash
# Package, install, approve, and commit shipment smart contract onto coldchain-channel
./scripts/deploy-chaincode.sh
```

### Step 3.4: Express REST Backend Startup
```bash
cd backend

# Install Node dependencies
npm install

# Enroll admin/user identities in Fabric Gateway wallet
npm run enroll-admin

# Start Express Gateway Server (Runs on port 5000)
npm run dev
```

### Step 3.5: IoT Telemetry Simulator Startup
```bash
cd simulator

# Install dependencies and start continuous IoT telemetry stream
npm install
npm start
```

### Step 3.6: React Web Dashboard Startup
```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite Development Server (Runs on port 5173)
npm run dev
```

Access the Web Dashboard at: `http://localhost:5173`

---

## 4. Teardown & Reset Command

To completely stop and clean up all Docker containers, networks, volumes, and cryptographic state:

```bash
./scripts/network-down.sh
```
