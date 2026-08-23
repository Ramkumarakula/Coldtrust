# ColdTrust Consortium Node Dashboards Specification
## Information Architecture, Page Specifications, and Component Mapping for Hyperledger Fabric Multi-Org Demo

**Document Version:** 1.0.0  
**Date:** August 2026  
**Target Channel:** \coldchain-channel\  
**Consortium Organizations:** \ManufacturerMSP\, \TransportMSP\, \RetailerMSP\, \RegulatorMSP\  

---

## 1. Architectural Baseline & System Foundations

This specification defines the information architecture for adding a **Consortium Node Demo Section** to ColdTrust. The purpose is to provide role-specific operational dashboards for each participant organization in the Hyperledger Fabric network while maintaining a cohesive, unified visual language that proves all four nodes are interacting with the **SAME underlying distributed ledger**.

### 1.1 Implementation Capability Matrix
To strictly ensure no fictional blockchain capabilities are invented, all data elements are categorized under three operational states:

*   **[REAL] Existing Functionality:** Backed by existing Go Smart Contract (\chaincode/shipment/smartcontract.go\), REST API (\ackend/src/\), and running Fabric network (\lockchain/\).
*   **[DEMO] UI/Demo Visualization:** Synthesized or calculated on the frontend to visually represent node identity, topology, or live streaming UI states.
*   **[FUTURE] Future Functionality:** Architectural extensions requiring future chaincode, backend, or Private Data Collection (PDC) updates.

---

## 2. Shared Network Core (Common Layout Elements)

Every node dashboard shares a standardized frame and header to reinforce that all participants are logged into the same **ColdTrust Hyperledger Fabric Consortium Network**.

\\\
+---------------------------------------------------------------------------------------------------+
|  [ColdTrust Network Header]  Channel: coldchain-channel | Block: #1,048 | Fabric v2.5.16 | [Node Switcher] |
+---------------------------------------------------------------------------------------------------+
|  [Active Node Identity Badge] Org: <Current MSP> | Peer: peer0.<org>.coldchain.com | Status: CONNECTED |
+---------------------------------------------------------------------------------------------------+
|  [Consortium Topology Bar]  (Manufacturer) <---> (Transport) <---> (Retailer) <---> (Regulator)   |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|                                     [Role-Specific Workspace]                                      |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
\\\

### Shared Elements Specification:
1.  **ColdTrust Consortium Header:**
    *   **Network Brand:** ColdTrust Enterprise Cold Chain Ledger.
    *   **Channel Indicator:** \coldchain-channel\ **[REAL]**.
    *   **Fabric Health Status:** Gateway connection state (\CONNECTED\) via \GET /health\ **[REAL]**.
    *   **Block & Transaction Counters:** Simulated block height (e.g. Block #1,042) derived from total ledger transactions **[DEMO]**, and real REST API \/health\ uptime **[REAL]**.
    *   **Node Quick-Switcher (Demo Bar):** Segmented control bar allowing instant perspective switching between \ManufacturerMSP\, \TransportMSP\, \RetailerMSP\, and \RegulatorMSP\ for presentation purposes **[DEMO]**.
2.  **Organization & Peer Identity Card:**
    *   Active Organization Name, MSP ID (\ManufacturerMSP\ | \TransportMSP\ | \RetailerMSP\ | \RegulatorMSP\) **[REAL]**.
    *   Peer gRPC Endpoint (e.g. \peer0.manufacturer.coldchain.com:7051\) **[REAL]**.
    *   Cryptographic MSP Identity certificate finger-print badge **[DEMO]**.
3.  **Consortium Network Visualization Widget:**
    *   Interactive 4-node ring topology diagram showing all 4 peer nodes and the Raft Orderer (\orderer.coldchain.com\) **[DEMO]**.
    *   Highlights the active node and visually animates transaction proposal/commit flows across the network when actions are performed **[DEMO]**.
4.  **Immutable Audit Trail Modal & Transaction Feed:**
    *   Displays full ledger history using \GET /api/shipments/:id/history\ **[REAL]**.
    *   Shows exact Fabric Transaction ID (\	xId\), ISO timestamp, submitter identity, and state delta **[REAL]**.

---

## 3. Detailed Organization Node Specifications

---

### A. Manufacturer Dashboard (\ManufacturerMSP\)

#### 1. Page Purpose
The operational origin console for pharmaceutical manufacturers (e.g., BioPharma Corp). Allows creating new shipment assets on the blockchain, configuring safe cold chain temperature thresholds (\ \dots MaxTemp\$), assigning transport carriers and recipients, and authorizing initial physical custody release.

#### 2. Organization Identity
*   **Organization Name:** BioPharma Corp
*   **MSP Identity:** \ManufacturerMSP\ **[REAL]**
*   **Peer Node:** \peer0.manufacturer.coldchain.com:7051\ **[REAL]**
*   **CouchDB State DB:** \http://localhost:5984\ **[REAL]**

#### 3. What This Organization Can See
*   Shipments created by \ManufacturerMSP\ **[REAL]**.
*   Shipment creation transaction signatures on ledger (\	xId\) **[REAL]**.
*   Current transit status and owner MSP of issued shipments **[REAL]**.
*   Temperature compliance logs for dispatched batches **[REAL]**.
*   Handover confirmation when \TransportMSP\ accepts custody **[REAL]**.

#### 4. What This Organization Can Do
*   **Create Shipment Asset:** Mint new cold chain shipment on ledger via \CreateShipment\ (\POST /api/shipments\) **[REAL]**.
*   **Set Temperature Parameters:** Define \minTemp\ and \maxTemp\ thresholds (e.g. 2.0°C - 4.0°C) **[REAL]**.
*   **Assign Supply Chain Partners:** Select \carrier\ (\TransportMSP\) and \ecipient\ (\RetailerMSP\) **[REAL]**.
*   **Export Provenance Certificate:** Generate digital origin proof containing creation \	xId\ **[DEMO]**.

#### 5. Role-Specific Information Mapping
*   **Shipment Info:** \shipmentID\, \productName\, \manufacturer\, \carrier\, \ecipient\, \minTemp\, \maxTemp\, \status\, \createdAt\.
*   **Blockchain/Ledger Info:** Genesis creation \	xId\, chaincode contract invocation logs, channel state commit status.
*   **Peer/Network Status:** \peer0.manufacturer.coldchain.com\ (Port 7051) status = UP, Fabric Gateway = CONNECTED.
*   **Custody Info:** Pre-handover owner = \ManufacturerMSP\ -> Pending custody transfer to \TransportMSP\.
*   **IoT/Temperature Info:** Cold storage baseline temperature before dispatch; live stream once carrier ingests telemetry.
*   **Audit Info:** \GetShipmentHistory\ showing creation event signed by \ManufacturerMSP\.
*   **Notifications/Alerts:** Carrier custody accepted notification, SLA creation receipt, breach notification on active shipments.
*   **KPIs:**
    1. Total Consignments Minted **[REAL]**
    2. Pending Carrier Handovers **[REAL]**
    3. Active In-Transit Batches **[REAL]**
    4. Compliance SLA Rate (%) **[REAL]**

#### 6. Role-Specific Restrictions & Hidden Information
*   **RESTRICTIONS:** Cannot call \AcceptShipment\ (returns HTTP 403 / Fabric authorization error) **[REAL]**. Cannot call \ReceiveShipment\ **[REAL]**. Cannot write telemetry updates **[REAL]**.
*   **HIDDEN INFORMATION:** Competitor manufacturer shipments (filtered in UI view) **[DEMO]**. Transport driver internal fleet routing telemetry unrelated to consignment **[DEMO]**.

---

### B. Transport Dashboard (\TransportMSP\)

#### 1. Page Purpose
The carrier logistics control tower for transport partners (e.g., SwiftCold Logistics). Focused on accepting custody of created shipments, ingesting real-time IoT ambient temperature/humidity telemetry, monitoring route progress, and managing temperature breach incidents.

#### 2. Organization Identity
*   **Organization Name:** SwiftCold Logistics
*   **MSP Identity:** \TransportMSP\ **[REAL]**
*   **Peer Node:** \peer0.transport.coldchain.com:8051\ **[REAL]**
*   **CouchDB State DB:** \http://localhost:6984\ **[REAL]**

#### 3. What This Organization Can See
*   Shipments assigned to \TransportMSP\ as carrier **[REAL]**.
*   Shipments awaiting physical custody acceptance (\status == CREATED\) **[REAL]**.
*   Live IoT telemetry stream (Temperature, Humidity, Location) **[REAL]**.
*   Automated state transitions to \COMPROMISED\ when temperature exceeds \maxTemp\ **[REAL]**.
*   Active custody ownership state (\owner == TransportMSP\) **[REAL]**.

#### 4. What This Organization Can Do
*   **Accept Custody:** Invoke \AcceptShipment\ (\POST /api/shipments/:id/accept\) to transition status to \IN_TRANSIT\ and gain ledger custody **[REAL]**.
*   **Record IoT Telemetry:** Post telemetry updates via \RecordTelemetry\ (\POST /api/shipments/:id/telemetry\) **[REAL]**.
*   **Simulate IoT Sensor Telemetry:** Trigger automated sensor stream or manual spike test via integrated simulator trigger **[DEMO/REAL]**.
*   **Handover to Receiving Dock:** Deliver consignment to recipient destination **[REAL]**.

#### 5. Role-Specific Information Mapping
*   **Shipment Info:** \shipmentID\, \productName\, \origin\, \destination\, \currentTemp\, \currentHumidity\, \location\, \status\.
*   **Blockchain/Ledger Info:** \AcceptShipment\ and \RecordTelemetry\ transaction hashes, CouchDB state updates.
*   **Peer/Network Status:** \peer0.transport.coldchain.com\ (Port 8051) status = UP, gRPC stream active.
*   **Custody Info:** \owner\ = \TransportMSP\ during active transit.
*   **IoT/Temperature Info:** Time-series SVG temperature chart, real-time threshold gauge (Max 4.0°C alert threshold), humidity curve, GPS route polyline.
*   **Audit Info:** Telemetry log commit history stored immutably in \	elemetryLogs\ array on ledger.
*   **Notifications/Alerts:** CRITICAL BREACH ALERT (Temp > 4.0°C), Custody accepted success toast, Arrival proximity alert.
*   **KPIs:**
    1. Assigned Fleet Shipments **[REAL]**
    2. Active In-Transit Custody **[REAL]**
    3. IoT Readings Transmitted **[REAL]**
    4. Temperature Excursion Alerts **[REAL]**

#### 6. Role-Specific Restrictions & Hidden Information
*   **RESTRICTIONS:** Cannot create new shipments (\CreateShipment\) **[REAL]**. Cannot execute final dock receiving (\ReceiveShipment\) **[REAL]**. Cannot edit or overwrite past committed telemetry readings **[REAL]**.
*   **HIDDEN INFORMATION:** Commercial PO purchase prices between Manufacturer and Retailer **[DEMO/FUTURE]**. Unassigned shipments belonging to competing carriers **[DEMO]**.

---

### C. Retailer Dashboard (\RetailerMSP\)

#### 1. Page Purpose
The receiving dock inspection terminal for retail distributors and healthcare facilities (e.g., Apex Pharmacy Networks). Provides arrival monitoring, end-to-end cold chain compliance verification, receiving dock QA check, and final ledger custody acceptance.

#### 2. Organization Identity
*   **Organization Name:** Apex Pharmacy Networks
*   **MSP Identity:** \RetailerMSP\ **[REAL]**
*   **Peer Node:** \peer0.retailer.coldchain.com:9051\ **[REAL]**
*   **CouchDB State DB:** \http://localhost:7984\ **[REAL]**

#### 3. What This Organization Can See
*   Incoming shipments where \ecipient == RetailerMSP\ **[REAL]**.
*   Real-time arrival condition and full transit temperature telemetry curve **[REAL]**.
*   Compromised flag status prior to accepting physical receipt **[REAL]**.
*   Final delivery receiving transactions signed by \RetailerMSP\ **[REAL]**.
*   Historical record of all received consignments **[REAL]**.

#### 4. What This Organization Can Do
*   **Receive Shipment:** Execute \ReceiveShipment\ (\POST /api/shipments/:id/receive\) to transition status to \DELIVERED\ and transfer final custody **[REAL]**.
*   **Execute QA Dock Inspection:** Review end-to-end temperature graph against SLA bounds before accepting **[DEMO]**.
*   **Reject / Flag Compromised Consignment:** Mark dock rejection if status is \COMPROMISED\ **[REAL]**.
*   **Download Receiving & Compliance Manifest:** Export signed receiving manifest **[DEMO]**.

#### 5. Role-Specific Information Mapping
*   **Shipment Info:** \shipmentID\, \productName\, \manufacturer\, \carrier\, \currentTemp\, \status\, \updatedAt\.
*   **Blockchain/Ledger Info:** \ReceiveShipment\ transaction signature, state transition to \DELIVERED\ or \COMPROMISED\.
*   **Peer/Network Status:** \peer0.retailer.coldchain.com\ (Port 9051) status = UP, CouchDB 7984 connected.
*   **Custody Info:** Transfer of custody from \TransportMSP\ to \RetailerMSP\ (\owner == RetailerMSP\).
*   **IoT/Temperature Info:** Complete transit temperature journey chart (Min/Max/Avg recorded during transit), breach highlights.
*   **Audit Info:** Full lifecycle trace from origin creation -> carrier transit -> receiving dock commit.
*   **Notifications/Alerts:** Shipment incoming alert, Receiving dock ready alert, Quality Compromised Alert upon arrival.
*   **KPIs:**
    1. Incoming Deliveries **[REAL]**
    2. Successfully Received & Stocked **[REAL]**
    3. QA Rejected / Compromised **[REAL]**
    4. Average Dock Clearance Time **[DEMO]**

#### 6. Role-Specific Restrictions & Hidden Information
*   **RESTRICTIONS:** Cannot create shipments (\CreateShipment\) **[REAL]**. Cannot accept transport custody (\AcceptShipment\) **[REAL]**. Cannot log in-transit telemetry **[REAL]**.
*   **HIDDEN INFORMATION:** Carrier internal vehicle diagnostics and non-relevant transport fleet data **[DEMO]**. Shipments destined for other retailer networks **[DEMO]**.

---

### D. Regulator Dashboard (\RegulatorMSP\)

#### 1. Page Purpose
The global compliance and oversight authority console (e.g., Global Health & Food Standards Regulatory Authority). Provides complete, unrestricted transparency across the entire consortium network, multi-org auditing, immediate breach detection, and network infrastructure health monitoring.

#### 2. Organization Identity
*   **Organization Name:** Health & Food Standards Authority
*   **MSP Identity:** \RegulatorMSP\ **[REAL]**
*   **Peer Node:** \peer0.regulator.coldchain.com:10051\ **[REAL]**
*   **CouchDB State DB:** \http://localhost:8984\ **[REAL]**

#### 3. What This Organization Can See
*   **Unrestricted Network-Wide Visibility:** ALL shipments across all manufacturers, carriers, and retailers **[REAL]**.
*   **Global Consortium Topology:** Live connection state of all 4 peer nodes and Raft orderer **[REAL/DEMO]**.
*   **Immutable Cryptographic Ledger History:** Full key history via \GetShipmentHistory\ for any asset on \coldchain-channel\ **[REAL]**.
*   **Real-time Breach Radar:** Instant alert feed when any consignment status transitions to \COMPROMISED\ **[REAL]**.
*   **Consortium Performance Metrics:** Total transactions processed, org activity breakdown, failure rates **[REAL/DEMO]**.

#### 4. What This Organization Can Do
*   **Execute Deep Audit Trace:** Inspect cryptographic raw ledger payloads, block transaction IDs, and MSP signatures **[REAL]**.
*   **Filter & Flag Non-Compliant Participants:** Aggregate violation analytics by \manufacturer\ or \carrier\ **[REAL/DEMO]**.
*   **Generate Regulatory Compliance File:** Export audit certificates for regulatory submission **[DEMO]**.
*   **Monitor Peer Consensus & Channel Health:** Verify ledger state synchronization across CouchDB instances **[REAL/DEMO]**.

#### 5. Role-Specific Information Mapping
*   **Shipment Info:** Complete network inventory (\GET /api/shipments\), status breakdown (\CREATED\, \IN_TRANSIT\, \COMPROMISED\, \DELIVERED\).
*   **Blockchain/Ledger Info:** \coldchain-channel\ transaction stream, smart contract invocations, ledger modification history.
*   **Peer/Network Status:** 4/4 Peer Nodes UP (\peer0.manufacturer\, \peer0.transport\, \peer0.retailer\, \peer0.regulator\), 1 Raft Orderer UP.
*   **Custody Info:** Complete custody transfer chain across all orgs (Manufacturer -> Transport -> Retailer).
*   **IoT/Temperature Info:** Cross-consortium temperature excursion heatmap and violation trends.
*   **Audit Info:** Complete, immutable, audit trail for any shipment on ledger.
*   **Notifications/Alerts:** Immediate System-Wide Breach Alert, Org Disconnect Alert, State DB Sync Alert.
*   **KPIs:**
    1. Consortium Total Shipments **[REAL]**
    2. Active Network Compliance Rate (%) **[REAL]**
    3. Total Compromised Incidents **[REAL]**
    4. Consortium Peer Health (4/4 Online) **[REAL/DEMO]**

#### 6. Role-Specific Restrictions & Hidden Information
*   **RESTRICTIONS:** Read-Only Audit Node. Cannot invoke state-mutating transactions (\CreateShipment\, \AcceptShipment\, \RecordTelemetry\, \ReceiveShipment\) **[REAL]**.
*   **HIDDEN INFORMATION:** NONE on the shared \coldchain-channel\ (Regulator possesses full oversight design).

---

## 4. Deliverable Structures (A through J)

### A. Shared Dashboard Structure
*   \Navbar\: ColdTrust Header, Channel Info (\coldchain-channel\), Gateway Status (\CONNECTED\), Demo Role Switcher Bar.
*   \NodeIdentityBanner\: Active MSP ID, Peer gRPC Endpoint, Certificate Status.
*   \ConsortiumTopologyWidget\: Visual 4-node ring network diagram highlighting active node and transaction propagation.
*   \KpiGrid\: Standardized 4-card operational overview (Total, In-Transit, Delivered, Compromised).
*   \AuditTimelineModal\: Shared slide-over ledger history modal consuming \GET /api/shipments/:id/history\.

### B. Manufacturer Dashboard Structure
*   \ManufacturerHeader\: Origin node branding (\BioPharma Corp\).
*   \ActionToolbar\: Primary button \+ Create New Shipment\ (opens \CreateShipmentModal\).
*   \CreatedShipmentsTable\: Roster filtered to origin consignments, displaying assigned carrier, recipient, SLA thresholds, and status.
*   \DispatchedSlaWidget\: Gauge displaying compliance rate of manufactured batches.

### C. Transport Dashboard Structure
*   \TransportHeader\: Carrier node branding (\SwiftCold Logistics\).
*   \CustodyActionPanel\: Banner highlighting assigned shipments awaiting custody acceptance (\AcceptShipment\).
*   LiveTelemetryConsole: SVG \TemperatureChart\ displaying live ambient temperature vs 4.0°C threshold, humidity curve, and route tracker.
*   \TelemetryActionToolbar\: Buttons \Post Telemetry Reading\ and \Trigger Temp Spike (Demo)\.

### D. Retailer Dashboard Structure
*   \RetailerHeader\: Recipient dock branding (\Apex Pharmacy Networks\).
*   \IncomingShipmentsRoster\: Consignments routed to retailer, showing ETA, condition, and breach state.
*   \DockReceivingPanel\: Verification drawer to review end-to-end transit temperature history before clicking \Receive Shipment\.
*   \QualityInspectionBadge\: Visual QA stamp (\COMPLIANT\ vs \QA REJECTED\).

### E. Regulator Dashboard Structure
*   \RegulatorHeader\: Compliance authority branding (\Health & Food Standards Authority\).
*   \ConsortiumHealthGrid\: 4-node peer status indicators (\Manufacturer\, \Transport\, \Retailer\, \Regulator\) with latency and CouchDB sync state.
*   \GlobalBreachRadar\: Real-time incident feed filtering all \COMPROMISED\ assets across the consortium.
*   \MasterLedgerTable\: Unrestricted multi-org shipment list with deep-dive ledger audit button.

### F. Shared Components
1.  \ConsortiumNavbar.jsx\: Top navigation, channel badge, role switcher.
2.  \NodeIdentityBadge.jsx\: MSP badge, peer host, gRPC status.
3.  \KpiCard.jsx\: Standardized metric display card with icon, trend, and count.
4.  \ShipmentStatusBadge.jsx\: Color-coded pill (\CREATED\, \IN_TRANSIT\, \COMPROMISED\, \DELIVERED\).
5.  \AuditTimelineModal.jsx\: Fabric transaction history timeline modal.
6.  \TemperatureChart.jsx\: Time-series SVG line chart with upper bound threshold line (4.0°C).
7.  \ConsortiumTopologyDiagram.jsx\: Animated 4-node network diagram.

### G. Role-Specific Components
1.  \CreateShipmentModal.jsx\ (\ManufacturerMSP\): Form to mint asset on ledger (\CreateShipment\).
2.  \CustodyAcceptanceCard.jsx\ (\TransportMSP\): Card action to accept custody (\AcceptShipment\).
3.  \TelemetryIngestModal.jsx\ (\TransportMSP\): Form/trigger to send telemetry (\RecordTelemetry\).
4.  \DockReceivingModal.jsx\ (\RetailerMSP\): Inspection drawer & receive action (\ReceiveShipment\).
5.  \GlobalBreachRadar.jsx\ (\RegulatorMSP\): Incident table for network-wide compliance violations.
6.  \PeerHealthGrid.jsx\ (\RegulatorMSP\): Multi-node container and CouchDB health monitor grid.

### H. Data That Can Be Real From Current Backend
*   **Shipment List & State:** Fetched from \GET /api/shipments\ (\shipmentID\, \productName\, \manufacturer\, \carrier\, \ecipient\, \minTemp\, \maxTemp\, \currentTemp\, \currentHumidity\, \location\, \status\).
*   **Immutable Transaction History:** Fetched from \GET /api/shipments/:id/history\ (\	xId\, \	imestamp\, \alue\, \isDelete\).
*   **Backend & Gateway Status:** Fetched from \GET /health\ (\status: 
