# REST API Specification
## ColdTrust – Enterprise Global Cold Chain Network

**Document Version:** 1.0.0  
**Base URL:** `http://localhost:5000/api/v1`  
**Content-Type:** `application/json`  

---

## 1. API Endpoints Summary

| Method | Endpoint Path | Description | Access Role |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | API and Fabric Gateway connection status | Public |
| `POST` | `/shipments` | Create new shipment asset | Manufacturer |
| `POST` | `/shipments/:id/accept` | Accept custody of shipment | Transport |
| `POST` | `/shipments/:id/telemetry` | Post IoT telemetry update | Transport / IoT Sim |
| `POST` | `/shipments/:id/receive` | Receive shipment at destination | Retailer |
| `GET` | `/shipments/:id` | Fetch current shipment state | All Orgs |
| `GET` | `/shipments/:id/history` | Fetch immutable transaction audit history | All Orgs / Regulator |
| `GET` | `/shipments` | Query all shipments (optional filter by status) | All Orgs |

---

## 2. Endpoint Details

### 2.1 GET `/health`
Check backend REST server health and Hyperledger Fabric channel connection.

- **Response `200 OK`**:
```json
{
  "status": "UP",
  "timestamp": "2026-08-09T01:20:00.000Z",
  "fabricGateway": "CONNECTED",
  "channel": "coldchain-channel",
  "chaincode": "coldchain"
}
```

---

### 2.2 POST `/shipments`
Create a new cold chain shipment asset on the blockchain.

- **Request Body**:
```json
{
  "shipmentID": "SHIP-1001",
  "productName": "COVID-19 Vaccines",
  "manufacturer": "BioPharma Corp",
  "carrier": "TransportMSP",
  "recipient": "RetailerMSP",
  "minTemp": 2.0,
  "maxTemp": 4.0
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "message": "Shipment SHIP-1001 created successfully",
  "txId": "a4f89d31b7e2..."
}
```

---

### 2.3 POST `/shipments/:id/accept`
Accept custody of a shipment to begin transit.

- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Custody accepted for shipment SHIP-1001",
  "status": "IN_TRANSIT",
  "txId": "c91e04a2d481..."
}
```

---

### 2.4 POST `/shipments/:id/telemetry`
Ingest real-time IoT sensor readings (Temperature, Humidity, GPS).

- **Request Body**:
```json
{
  "temperature": 4.5,
  "humidity": 42.0,
  "location": "Route I-95, New York"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "shipmentID": "SHIP-1001",
  "status": "COMPROMISED",
  "compromised": true,
  "message": "Telemetry recorded. Temperature threshold breached (>4°C)! Shipment status changed to COMPROMISED."
}
```

---

### 2.5 POST `/shipments/:id/receive`
Mark shipment as delivered at destination.

- **Response `200 OK`**:
```json
{
  "success": true,
  "shipmentID": "SHIP-1001",
  "status": "DELIVERED",
  "message": "Shipment received successfully."
}
```

---

### 2.6 GET `/shipments/:id`
Fetch current shipment asset details.

- **Response `200 OK`**:
```json
{
  "shipmentID": "SHIP-1001",
  "docType": "shipment",
  "productName": "COVID-19 Vaccines",
  "manufacturer": "BioPharma Corp",
  "owner": "TransportMSP",
  "carrier": "TransportMSP",
  "recipient": "RetailerMSP",
  "minTemp": 2.0,
  "maxTemp": 4.0,
  "currentTemp": 4.5,
  "currentHumidity": 42.0,
  "location": "Route I-95, New York",
  "status": "COMPROMISED",
  "telemetryLogs": [
    {
      "timestamp": "2026-08-09T01:25:00Z",
      "temperature": 4.5,
      "humidity": 42.0,
      "location": "Route I-95, New York",
      "recordedBy": "TransportMSP"
    }
  ]
}
```

---

### 2.7 GET `/shipments/:id/history`
Fetch full immutable ledger modification history (Auditing).

- **Response `200 OK`**:
```json
{
  "shipmentID": "SHIP-1001",
  "history": [
    {
      "txId": "tx-001",
      "timestamp": "2026-08-09T01:00:00Z",
      "isDelete": false,
      "value": {
        "status": "CREATED",
        "currentTemp": 3.0
      }
    },
    {
      "txId": "tx-002",
      "timestamp": "2026-08-09T01:10:00Z",
      "isDelete": false,
      "value": {
        "status": "IN_TRANSIT",
        "currentTemp": 3.2
      }
    },
    {
      "txId": "tx-003",
      "timestamp": "2026-08-09T01:25:00Z",
      "isDelete": false,
      "value": {
        "status": "COMPROMISED",
        "currentTemp": 4.5
      }
    }
  ]
}
```

---

### 2.8 GET `/shipments`
Query all shipments on the ledger with optional `status` filter query parameter (`?status=IN_TRANSIT`).

- **Response `200 OK`**:
```json
{
  "total": 1,
  "shipments": [ ... ]
}
```
