# ColdTrust Architecture Baseline

**Document Status:** ACTIVE BASELINE  
**Subsystem Scope:** End-to-End System Architecture

---

## 1. Current Architecture Flow

The current implementation follows a strict 6-tier enterprise topology:

```
[ Operations Dashboard ] (React 19 / Vite - Port 5173)
         │
         ▼ (HTTP / REST JSON)
[ Backend API Gateway ] (Node.js / Express / TypeScript - Port 3000)
         │
         ▼ (gRPC / TLS via @hyperledger/fabric-gateway)
[ Consortium Peer Nodes ] (4 Orgs: Manufacturer, Transport, Retailer, Regulator)
         │
         ├──► [ Raft Orderer Node ] (orderer.coldchain.com - Port 7050)
         │
         ├──► [ CouchDB State DBs ] (World State Key-Value / JSON Query)
         │
         └──► [ Shipment Chaincode ] (Golang Smart Contract Engine on coldchain-channel)
```

---

## 2. Organization Consortium Roles

ColdTrust models a permissioned 4-Organization Supply Chain Consortium. Each organization has specific operational rights enforced by chaincode identity checks and MSP context:

| Organization Name | MSP ID | Node Endpoints | Primary Operations & Chaincode Functions |
| :--- | :--- | :--- | :--- |
| **BioTechLabs** | `ManufacturerMSP` | `peer0.manufacturer.coldchain.com:7051` | Asset creation (`CreateShipment`), initial threshold setup (`minTemp`, `maxTemp`), batch staging. |
| **SwiftLogistics** | `TransportMSP` | `peer0.transport.coldchain.com:8051` | Transit custody acceptance (`AcceptCustody`), IoT telemetry streaming (`RecordTelemetry`). |
| **MetroHospital** | `RetailerMSP` | `peer0.retailer.coldchain.com:9051` | Final destination receipt (`ReceiveShipment`), verification of thermal integrity on delivery. |
| **FDA / EMEA** | `RegulatorMSP` | `peer0.regulator.coldchain.com:10051` | Read-only audit inspection (`GetShipmentHistory`, `QueryAllShipments`), compliance reporting. |

---

## 3. Intended / Future Architecture (Target State)

The future architecture will introduce an **Autonomous Multi-Agent Systems Engine** for continuous cold chain intelligence:

* **Planning & Research Agents:** Automated route risk prediction based on weather and transit delays.
* **Telemetry Anomaly Agent:** Machine learning anomaly detection evaluating humidity and ambient temperature drifts before breach limits are hit.
* **Automated Audit Agent:** Continuous cryptographic verification of block commit logs across consortium peers.
* **Agent Handoff Protocol:** Event-driven agent communication using standard JSON RPC schema.

---

## 4. Unknown / Needs Decision Items

* **Decentralized Storage:** Whether large payload telemetry (e.g. raw sensor log dumps) should remain in CouchDB world state or be offloaded to IPFS / enterprise blob storage.
* **Production CA PKI Infrastructure:** Transitioning from local `cryptogen` bootstrap certificates to production Fabric CA HSM (Hardware Security Module) integration.
* **TLS Identity Management:** Client certificate enrollment per enterprise user role vs proxy identity mapping at REST API Gateway.
