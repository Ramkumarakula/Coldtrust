# Architecture Diagrams & Flowcharts
## ColdTrust – Enterprise Global Cold Chain Network

**Document Version:** 1.0.0  
**Date:** August 2026  

---

## 1. Consortium Network Topology Diagram

The diagram below illustrates the 4-Organization Hyperledger Fabric consortium network infrastructure, including Peer nodes, CouchDB world state databases, Certificate Authorities, and the Raft Orderer.

```mermaid
flowchart TB
    subgraph ConsortiumNetwork["Hyperledger Fabric Consortium Network (channel: coldchain-channel)"]
        subgraph OrdererOrg["Ordering Service"]
            Orderer["orderer.coldchain.com<br/>(Raft Consensus - Port 7050)"]
        end

        subgraph Org1["Manufacturer Org (ManufacturerMSP)"]
            CA1["ca.manufacturer.coldchain.com<br/>Port 7054"]
            Peer1["peer0.manufacturer.coldchain.com<br/>Port 7051"]
            Couch1[("CouchDB Manufacturer<br/>Port 5984")]
            Peer1 <--> Couch1
        end

        subgraph Org2["Transport Org (TransportMSP)"]
            CA2["ca.transport.coldchain.com<br/>Port 8054"]
            Peer2["peer0.transport.coldchain.com<br/>Port 8051"]
            Couch2[("CouchDB Transport<br/>Port 6984")]
            Peer2 <--> Couch2
        end

        subgraph Org3["Retailer Org (RetailerMSP)"]
            CA3["ca.retailer.coldchain.com<br/>Port 9054"]
            Peer3["peer0.retailer.coldchain.com<br/>Port 9051"]
            Couch3[("CouchDB Retailer<br/>Port 7984")]
            Peer3 <--> Couch3
        end

        subgraph Org4["Regulator Org (RegulatorMSP)"]
            CA4["ca.regulator.coldchain.com<br/>Port 10054"]
            Peer4["peer0.regulator.coldchain.com<br/>Port 10051"]
            Couch4[("CouchDB Regulator<br/>Port 8984")]
            Peer4 <--> Couch4
        end

        Peer1 <--> Orderer
        Peer2 <--> Orderer
        Peer3 <--> Orderer
        Peer4 <--> Orderer
    end

    subgraph BackendGateway["Node.js Express Backend Service"]
        GatewaySDK["Fabric Gateway SDK<br/>gRPC Client"]
    end

    subgraph FrontendUI["React Frontend Application"]
        Dashboard["ColdTrust Web UI<br/>Port 5173"]
    end

    subgraph IoTSim["IoT Telemetry Simulator"]
        SensorSim["Sensor Engine"]
    end

    FrontendUI -->|HTTP REST| BackendGateway
    IoTSim -->|HTTP Telemetry Stream| BackendGateway
    BackendGateway -->|gRPC TLS| Peer1
    BackendGateway -->|gRPC TLS| Peer2
```

---

## 2. Shipment Lifecycle State Machine

```mermaid
stateDiagram-v2
    [*] --> CREATED : Manufacturer invokes CreateShipment()

    CREATED --> IN_TRANSIT : Transport invokes AcceptShipment()
    
    state IN_TRANSIT {
        [*] --> Monitoring
        Monitoring --> Monitoring : RecordTelemetry(temp <= 4.0°C)
    }

    IN_TRANSIT --> COMPROMISED : RecordTelemetry(temp > 4.0°C) [AUTO-RULE]
    IN_TRANSIT --> DELIVERED : Retailer invokes ReceiveShipment()

    COMPROMISED --> [*] : Locked state (Spoliation Audit Logged)
    DELIVERED --> [*] : Successfully Delivered
```

---

## 3. End-to-End Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor M as Manufacturer
    actor T as Transport / IoT Sim
    actor R as Retailer / Hospital
    actor Reg as Regulator
    participant API as Express API Gateway
    participant GW as Fabric Gateway SDK
    participant CC as Shipment Chaincode
    participant Ledger as Fabric Ledger & CouchDB

    Note over M,Ledger: Phase 1: Shipment Creation
    M->>API: POST /api/v1/shipments (Create shipment)
    API->>GW: SubmitTx("CreateShipment", ID, Product, Thresholds)
    GW->>CC: Evaluate & Endorse
    CC->>Ledger: PutState(SHIP-1001, Status: CREATED)
    Ledger-->>M: Shipment Created Confirmation

    Note over T,Ledger: Phase 2: Custody Transfer & IoT Telemetry Monitoring
    T->>API: POST /api/v1/shipments/SHIP-1001/accept
    API->>GW: SubmitTx("AcceptShipment", SHIP-1001)
    GW->>CC: Update Status -> IN_TRANSIT
    CC->>Ledger: PutState(SHIP-1001, Status: IN_TRANSIT)

    loop Sensor Streams Every 5 Seconds
        T->>API: POST /api/v1/shipments/SHIP-1001/telemetry (Temp, Humidity, GPS)
        API->>GW: SubmitTx("RecordTelemetry", SHIP-1001, Temp, Humidity, Location)
        GW->>CC: Evaluate Temp Rule (Temp > 4.0°C ?)
        alt Temp <= 4.0°C
            CC->>Ledger: Append Telemetry & Maintain IN_TRANSIT State
        else Temp > 4.0°C (Breach Detected!)
            CC->>Ledger: PutState(SHIP-1001, Status: COMPROMISED)
            Note over CC,Ledger: AUTOMATED RULE: Status permanently set to COMPROMISED
        end
    end

    Note over R,Ledger: Phase 3: Delivery Acceptance
    R->>API: POST /api/v1/shipments/SHIP-1001/receive
    API->>GW: SubmitTx("ReceiveShipment", SHIP-1001)
    GW->>CC: Update Status -> DELIVERED
    CC->>Ledger: PutState(SHIP-1001, Status: DELIVERED)

    Note over Reg,Ledger: Phase 4: Regulatory Compliance Audit
    Reg->>API: GET /api/v1/shipments/SHIP-1001/history
    API->>GW: EvaluateTx("GetShipmentHistory", SHIP-1001)
    GW->>CC: Query Ledger History Iterators
    CC-->>Reg: Return Complete Immutable Key Modification & Telemetry Log
```

---

## 4. Entity Data Model (ERD)

```mermaid
erDiagram
    SHIPMENT {
        string shipmentID PK
        string docType
        string productName
        string manufacturer
        string owner
        string carrier
        string recipient
        double minTemp
        double maxTemp
        double currentTemp
        double currentHumidity
        string location
        string status
        string createdAt
        string updatedAt
    }

    TELEMETRY_RECORD {
        string timestamp PK
        string shipmentID FK
        double temperature
        double humidity
        string location
        string recordedBy
    }

    AUDIT_LOG {
        string txId PK
        string shipmentID FK
        string mspId
        string timestamp
        string action
        boolean isDelete
    }

    SHIPMENT ||--o{ TELEMETRY_RECORD : "contains"
    SHIPMENT ||--o{ AUDIT_LOG : "tracked by"
```
