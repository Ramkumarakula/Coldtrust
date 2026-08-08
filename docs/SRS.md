# Software Requirements Specification (SRS)
## ColdTrust – Enterprise Global Cold Chain Network

**Document Version:** 1.0.0  
**Date:** August 2026  
**Status:** Approved  
**Author:** Lead Software Engineer & Architecture Team  

---

## 1. Executive Summary & Product Vision

**ColdTrust** is a decentralized, enterprise-grade cold chain management platform engineered on **Hyperledger Fabric 2.5**. The system enables multiple independent, non-trusting supply chain organizations—**Manufacturers**, **Transport Companies**, **Retailers / Hospitals**, and **Regulators**—to securely share real-time and historical shipment telemetry without reliance on a single centralized database operator.

In global cold chain management (such as vaccines, biologics, blood products, and premium perishable food), temperature breaches lead to billions of dollars in spoliation annually and risk human lives. Legacy centralized databases are vulnerable to data tampering, single points of failure, and disputed logs between supply chain participants.

ColdTrust solves this by leveraging a consortium blockchain network where:
1. **Shipments** are tracked as digital assets on an immutable distributed ledger.
2. **IoT Telemetry Streams** (Temperature, Humidity, GPS coordinates) are continuously ingested and validated by smart contracts.
3. **Automated Business Rules** change shipment status to `COMPROMISED` immediately when temperature breaches exceed **4.0°C**.
4. **Regulators** maintain transparent, immutable audit logs for regulatory compliance and dispute resolution.

---

## 2. Business Scenario & Supply Chain Workflow

### 2.1 Participating Organizations (Consortium Members)

| Organization | MSP ID | Primary Responsibilities |
| :--- | :--- | :--- |
| **Manufacturer Org** | `ManufacturerMSP` | Creates cold chain shipments, defines product storage threshold rules (min/max temp), assigns initial carrier. |
| **Transport Org** | `TransportMSP` | Accepts physical custody of shipments, logs location changes, streams continuous IoT sensor telemetry. |
| **Retailer Org** | `RetailerMSP` | Accepts final delivery of shipments, inspects cold chain history, accepts or rejects shipments based on integrity. |
| **Regulator Org** | `RegulatorMSP` | Performs independent audits, queries full state & history across all consortium operations, monitors compliance. |

### 2.2 End-to-End Business Flow

```
[ Manufacturer ] ──(1. Create Shipment)──> [ Blockchain Ledger ]
                                                    │
[ Transport ] ────(2. Accept Custody)──────> [ Blockchain Ledger ]
                                                    │
[ Simulated IoT ] ─(3. Ingest Telemetry)────> [ Smart Contract Validation ]
                                                    │
                                      ┌─────────────┴─────────────┐
                                (Temp <= 4°C)                 (Temp > 4°C)
                                      │                           │
                               [ Status: IN_TRANSIT ]     [ Status: COMPROMISED ]
                                      │                           │
[ Retailer ] ─────(4. Receive Shipment)───────────────────────────┤
                                                                  │
[ Regulator ] ────(5. Immutable Audit & Compliance Verification)──┘
```

---

## 3. Functional Requirements

### FR-1: Shipment Lifecycle Management
- **FR-1.1:** The system shall allow authorized Manufacturer representatives (`ManufacturerMSP`) to create a new shipment record with initial temperature thresholds, product metadata, carrier assignment, and destination.
- **FR-1.2:** The system shall allow authorized Transport representatives (`TransportMSP`) to accept physical custody of a shipment, updating the status from `CREATED` to `IN_TRANSIT`.
- **FR-1.3:** The system shall allow authorized Retailer representatives (`RetailerMSP`) to acknowledge and complete delivery, transitioning shipment status from `IN_TRANSIT` to `DELIVERED`.

### FR-2: IoT Telemetry Ingestion & Automated Rule Engine
- **FR-2.1:** The system shall ingest real-time telemetry records containing `shipmentID`, `temperature`, `humidity`, `gpsLatitude`, `gpsLongitude`, and `timestamp`.
- **FR-2.2 (Automated Rule):** The smart contract shall automatically evaluate incoming temperature readings against storage thresholds. If `temperature > 4.0°C` at any point during transit, the smart contract MUST instantly update shipment status to `COMPROMISED`.
- **FR-2.3:** Once a shipment transitions to `COMPROMISED`, subsequent telemetry updates shall preserve the `COMPROMISED` state, preventing state tampering.

### FR-3: Immutable Audit Trail & Regulatory Compliance
- **FR-3.1:** The system shall provide full transaction history for any shipment asset (`GetShipmentHistory`), detailing every state change, actor MSP ID, transaction ID, and timestamp.
- **FR-3.2:** Authorized Regulator representatives (`RegulatorMSP`) shall have read access to query all active and historical shipments across all consortium members.

### FR-4: REST API & Integration Layer
- **FR-4.1:** The Express Node.js backend shall expose clean REST endpoints wrapped around the Hyperledger Fabric Gateway SDK.
- **FR-4.2:** The API shall support JSON request/response payloads, input validation, structured error codes, and health check monitoring.

### FR-5: Enterprise Visual Dashboard (Frontend)
- **FR-5.1:** The React dashboard shall display real-time metrics (Total Shipments, Active in Transit, Delivered, Compromised).
- **FR-5.2:** The frontend shall render interactive shipment lists with status indicators, search/filter capabilities, and detailed timeline visualizers for telemetry logs.
- **FR-5.3:** The frontend shall provide a live IoT simulation interface to monitor continuous stream updates.

---

## 4. Non-Functional Requirements (NFRs)

### NFR-1: Immutability & Trust
- All state changes MUST be committed through Hyperledger Fabric consensus (Raft orderer) after receiving required chaincode endorsements from consortium peers.
- Historical records MUST be immutable and non-repudiable.

### NFR-2: Performance & Scalability
- The Fabric Gateway backend MUST process telemetry transactions with sub-second response times.
- CouchDB world state indexes MUST support complex queries on `status`, `owner`, `carrier`, and `timestamp`.

### NFR-3: Security & Access Control
- All network communication between peers, orderers, CAs, backend, and clients MUST use TLS (Transport Layer Security).
- Role-Based Access Control (RBAC) MUST be enforced at the smart contract level using client MSP certificates (`ctx.clientIdentity.getMSPID()`).

### NFR-4: Availability & Fault Tolerance
- Peer nodes for each organization MUST run in separate isolated Docker containers.
- The orderer cluster uses Raft crash fault tolerance (CFT).

---

## 5. Consortium Governance & Data Access Control Matrix

| Smart Contract Method | ManufacturerMSP | TransportMSP | RetailerMSP | RegulatorMSP |
| :--- | :---: | :---: | :---: | :---: |
| `CreateShipment` | **ALLOWED** | Denied | Denied | Denied |
| `TransferShipment` | **ALLOWED** | **ALLOWED** | Denied | Denied |
| `AcceptShipment` | Denied | **ALLOWED** | Denied | Denied |
| `RecordTelemetry` | Denied | **ALLOWED** | Denied | Denied |
| `ReceiveShipment` | Denied | Denied | **ALLOWED** | Denied |
| `GetShipment` | **ALLOWED** | **ALLOWED** | **ALLOWED** | **ALLOWED** |
| `GetShipmentHistory` | **ALLOWED** | **ALLOWED** | **ALLOWED** | **ALLOWED** |
| `GetAllShipments` | **ALLOWED** | **ALLOWED** | **ALLOWED** | **ALLOWED** |

---

## 6. System Assumptions & Dependencies

1. **Infrastructure:** Hyperledger Fabric v2.5.x environment running on Docker Desktop / WSL Ubuntu Linux.
2. **State Database:** CouchDB v3.x used for rich queries on ledger state.
3. **Runtime:** Node.js v20+ / v22+ for REST backend service; React 19 + Vite for frontend UI.
