# Smart Contract (Chaincode) Technical Specification
## ColdTrust – Enterprise Global Cold Chain Network

**Document Version:** 1.0.0  
**Date:** August 2026  

---

## 1. Overview & Chaincode Details

The ColdTrust Smart Contract (Chaincode) governs all state modifications for cold chain shipment assets on the Hyperledger Fabric ledger.

| Property | Value |
| :--- | :--- |
| **Contract Name** | `coldchain` |
| **Channel Name** | `coldchain-channel` |
| **Chaincode Language** | Go (`golang`) / TypeScript |
| **State Database** | CouchDB |
| **Package ID / Name** | `coldchain_1.0` |
| **Consortium Orgs** | Manufacturer, Transport, Retailer, Regulator |

---

## 2. Data Models & Data Structures

### 2.1 TelemetryLog Struct

```go
type TelemetryLog struct {
	Timestamp   string  `json:"timestamp"`   // ISO-8601 Timestamp
	Temperature float64 `json:"temperature"` // Sensor temperature in Celsius
	Humidity    float64 `json:"humidity"`    // Relative humidity percentage
	Location    string  `json:"location"`    // GPS / City location description
	RecordedBy  string  `json:"recordedBy"`  // MSP ID of the recording entity
}
```

### 2.2 Shipment Asset Struct

```go
type Shipment struct {
	DocType         string         `json:"docType"`         // Constant: "shipment"
	ShipmentID      string         `json:"shipmentID"`      // Unique Key (e.g. SHIP-1001)
	ProductName     string         `json:"productName"`     // Name of goods (e.g. COVID-19 Vaccines)
	Manufacturer    string         `json:"manufacturer"`    // Manufacturing entity name
	Owner           string         `json:"owner"`           // Current MSP holding custody
	Carrier         string         `json:"carrier"`         // Assigned transport MSP ID
	Recipient       string         `json:"recipient"`       // Target recipient MSP ID
	MinTemp         float64        `json:"minTemp"`         // Minimum safe temperature (°C)
	MaxTemp         float64        `json:"maxTemp"`         // Maximum safe temperature (°C - Default: 4.0°C)
	CurrentTemp     float64        `json:"currentTemp"`     // Latest temperature reading (°C)
	CurrentHumidity float64        `json:"currentHumidity"` // Latest humidity reading (%)
	Location        string         `json:"location"`        // Current GPS location description
	Status          string         `json:"status"`          // CREATED, IN_TRANSIT, COMPROMISED, DELIVERED
	CreatedAt       string         `json:"createdAt"`       // ISO-8601 creation timestamp
	UpdatedAt       string         `json:"updatedAt"`       // ISO-8601 last update timestamp
	TelemetryLogs   []TelemetryLog `json:"telemetryLogs"`   // Array of ingested telemetry points
}
```

---

## 3. Core Chaincode Methods & Specifications

### 3.1 `CreateShipment`
- **Description:** Creates a new cold chain shipment asset on the ledger.
- **Access Permission:** `ManufacturerMSP` ONLY.
- **Signature:** `CreateShipment(ctx, shipmentID, productName, manufacturer, carrier, recipient, minTemp, maxTemp)`
- **Validation Rules:**
  1. `shipmentID` must not be empty and must not already exist on ledger.
  2. `minTemp` must be less than `maxTemp`.
  3. Client MSP ID must equal `ManufacturerMSP`.
- **State Change:** Creates a `Shipment` document with `Status = "CREATED"`.

### 3.2 `AcceptShipment`
- **Description:** Transport company accepts physical custody of the shipment to begin transit.
- **Access Permission:** `TransportMSP` ONLY.
- **Signature:** `AcceptShipment(ctx, shipmentID)`
- **Validation Rules:**
  1. Shipment must exist.
  2. Current status must be `CREATED`.
  3. Caller MSP ID must equal `TransportMSP`.
- **State Change:** Updates `Status = "IN_TRANSIT"` and sets `Owner = "TransportMSP"`.

### 3.3 `RecordTelemetry` (Automated Rule Engine)
- **Description:** Ingests live IoT temperature, humidity, and GPS telemetry.
- **Access Permission:** `TransportMSP` (or designated IoT Simulator caller).
- **Signature:** `RecordTelemetry(ctx, shipmentID, temperature, humidity, location)`
- **Automated Compromise Rule:**
  ```go
  if temperature > shipment.MaxTemp { // MaxTemp default threshold = 4.0°C
      shipment.Status = "COMPROMISED"
  }
  ```
- **Validation Rules:**
  1. Shipment must exist.
  2. If shipment status is already `DELIVERED`, reject new telemetry ingestion.
  3. If shipment status is `COMPROMISED`, append log but preserve `COMPROMISED` status.
- **State Change:** Appends `TelemetryLog`, updates `CurrentTemp`, `CurrentHumidity`, `Location`, and updates `Status` if temperature breach detected.

### 3.4 `ReceiveShipment`
- **Description:** Retailer or Hospital marks shipment as received at destination.
- **Access Permission:** `RetailerMSP` ONLY.
- **Signature:** `ReceiveShipment(ctx, shipmentID)`
- **Validation Rules:**
  1. Shipment must exist.
  2. Current status must be `IN_TRANSIT` or `COMPROMISED`.
  3. Caller MSP ID must equal `RetailerMSP`.
- **State Change:** If status is `IN_TRANSIT`, updates `Status = "DELIVERED"` and `Owner = "RetailerMSP"`. If `COMPROMISED`, remains `COMPROMISED`.

### 3.5 `GetShipment`
- **Description:** Reads current shipment asset state from CouchDB world state.
- **Access Permission:** All Consortium MSPs (`ManufacturerMSP`, `TransportMSP`, `RetailerMSP`, `RegulatorMSP`).
- **Signature:** `GetShipment(ctx, shipmentID)` -> `Shipment`

### 3.6 `GetShipmentHistory`
- **Description:** Retrieves complete immutable transaction history log for a shipment using `GetHistoryForKey`.
- **Access Permission:** All Consortium MSPs (specifically required by `RegulatorMSP`).
- **Signature:** `GetShipmentHistory(ctx, shipmentID)` -> `[]HistoryQueryResult`

---

## 4. State Transition Matrix

| Current State | Invoked Method | Conditions | New State |
| :--- | :--- | :--- | :--- |
| *Non-existent* | `CreateShipment` | Invoked by Manufacturer | `CREATED` |
| `CREATED` | `AcceptShipment` | Invoked by Transport | `IN_TRANSIT` |
| `IN_TRANSIT` | `RecordTelemetry` | `temp <= 4.0°C` | `IN_TRANSIT` |
| `IN_TRANSIT` | `RecordTelemetry` | `temp > 4.0°C` | **`COMPROMISED`** |
| `IN_TRANSIT` | `ReceiveShipment` | Invoked by Retailer | `DELIVERED` |
| `COMPROMISED` | `RecordTelemetry` | Any temp | `COMPROMISED` |
| `COMPROMISED` | `ReceiveShipment` | Invoked by Retailer | `COMPROMISED` |
