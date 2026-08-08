# System Architecture Specification
## ColdTrust – Enterprise Global Cold Chain Network

**Document Version:** 1.0.0  
**Date:** August 2026  

---

## 1. High-Level Enterprise Architecture

ColdTrust is built using a modern 4-tier decoupled enterprise architecture designed for security, scalability, and seamless integration between physical supply chain sensors and decentralized ledger technology.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION TIER                              │
│         React 19 + Vite + TailwindCSS Modern Enterprise Dashboard        │
└─────────────────────────────────────────────────────────────────────────┘
                                     │  HTTP / REST JSON APIs
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           APPLICATION TIER                              │
│       Express.js REST Gateway + Node Fabric Gateway SDK (gRPC)         │
└─────────────────────────────────────────────────────────────────────────┘
                                     │  gRPC TLS / Identity Certs
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           BLOCKCHAIN TIER                               │
│       Hyperledger Fabric 2.5 Consortium Network (4 Organizations)       │
│  [Org1: Manufacturer] [Org2: Transport] [Org3: Retailer] [Org4: Regulator]│
│               Raft Ordering Service (orderer.coldchain.com)             │
└─────────────────────────────────────────────────────────────────────────┘
                                     │  State Sync / Key-Value
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           PERSISTENCE TIER                              │
│           CouchDB World State Database (Rich Indexing Strategy)         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Consortium Topology & Network Layout

The ColdTrust network operates a multi-organization consortium channel named `coldchain-channel`.

### 2.1 Organizations & Network Components

| Component Name | Organization | Hostname | Port | Container Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `ca.manufacturer.coldchain.com` | Manufacturer | `localhost:7054` | Certificate Authority for Manufacturer identity management |
| `peer0.manufacturer.coldchain.com` | Manufacturer | `localhost:7051` | Peer node endorsing and committing manufacturer transactions |
| `couchdb.manufacturer.coldchain.com` | Manufacturer | `localhost:5984` | World state CouchDB for Manufacturer peer |
| `ca.transport.coldchain.com` | Transport | `localhost:8054` | Certificate Authority for Transport identity management |
| `peer0.transport.coldchain.com` | Transport | `localhost:8051` | Peer node endorsing and committing transport transactions |
| `couchdb.transport.coldchain.com` | Transport | `localhost:6984` | World state CouchDB for Transport peer |
| `ca.retailer.coldchain.com` | Retailer | `localhost:9054` | Certificate Authority for Retailer identity management |
| `peer0.retailer.coldchain.com` | Retailer | `localhost:9051` | Peer node endorsing and committing retailer transactions |
| `couchdb.retailer.coldchain.com` | Retailer | `localhost:7984` | World state CouchDB for Retailer peer |
| `ca.regulator.coldchain.com` | Regulator | `localhost:10054` | Certificate Authority for Regulator identity management |
| `peer0.regulator.coldchain.com` | Regulator | `localhost:10051` | Peer node endorsing and committing regulator transactions |
| `couchdb.regulator.coldchain.com` | Regulator | `localhost:8984` | World state CouchDB for Regulator peer |
| `orderer.coldchain.com` | Consortium | `localhost:7050` | Raft Consensus Ordering Service |

---

## 3. World State & CouchDB Indexing Strategy

Hyperledger Fabric uses **CouchDB** as its state database, enabling rich JSON queries on key-value pairs stored in the ledger.

### 3.1 JSON Document Schema (Shipment Asset)

```json
{
  "docType": "shipment",
  "shipmentID": "SHIP-1001",
  "productName": "COVID-19 Vaccine Vials",
  "manufacturer": "BioPharma Corp",
  "owner": "ManufacturerMSP",
  "carrier": "TransportMSP",
  "recipient": "RetailerMSP",
  "minTemp": 2.0,
  "maxTemp": 4.0,
  "currentTemp": 3.1,
  "currentHumidity": 45.2,
  "location": "Warehouse-Alpha, Boston MA",
  "status": "IN_TRANSIT",
  "createdAt": "2026-08-09T01:00:00Z",
  "updatedAt": "2026-08-09T01:15:00Z",
  "telemetryLogs": [
    {
      "timestamp": "2026-08-09T01:15:00Z",
      "temperature": 3.1,
      "humidity": 45.2,
      "location": "Route I-95 Northbound",
      "recordedBy": "TransportMSP"
    }
  ]
}
```

### 3.2 CouchDB Index Definitions

To ensure high-performance querying across thousands of cold chain shipments, CouchDB indexes are defined in `chaincode/META-INF/statedb/couchdb/indexes/`:

1. **`indexStatus.json`**: Index on `docType` and `status` for quick filtering of active in-transit or compromised shipments.
2. **`indexOwner.json`**: Index on `docType` and `owner` / `carrier` for organization-specific portal views.

---

## 4. Layered Software Architecture

### 4.1 Chaincode Layer (Smart Contract)
- Written in Go / Node.js utilizing the official Fabric Contract API (`fabric-contract-api`).
- Encapsulates cold chain business rules, transaction validation, identity extraction, and state transitions.

### 4.2 Application / API Gateway Layer
- Built with **Node.js** and **Express.js**.
- Uses `@hyperledger/fabric-gateway` (gRPC-based Fabric v2.5 client SDK) to interact with peer nodes.
- Manages connection profiles, user X.509 certificates, wallet enrollment, and REST endpoint exposure.

### 4.3 Simulator Layer
- Background service simulating IoT sensor nodes attached to shipment containers.
- Generates periodic telemetry events (Temperature, Humidity, GPS) and invokes REST API endpoints.

### 4.4 Presentation Layer (Frontend)
- Single-Page Application (SPA) built with **React 19**, **Vite**, and **TailwindCSS**.
- Consumes Express REST APIs to display live telemetry feeds, status metrics, and interactive audit trails.
