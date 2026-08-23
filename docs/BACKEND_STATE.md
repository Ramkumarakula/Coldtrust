# ColdTrust Backend REST API State

**Runtime:** Node.js (v20+)  
**Language:** TypeScript (v5.3+)  
**Framework:** Express.js  
**Gateway Integration:** `@hyperledger/fabric-gateway` (v1.4+)  
**Build Target:** `backend/dist/server.js`

---

## 1. Architecture Overview

The backend uses a strict 5-layer architecture separating concerns cleanly:

```
[ HTTP Client / Frontend ]
         │
         ▼
[ Express Router ] (backend/src/routes/)
         │
         ▼
[ Controller Layer ] (backend/src/controllers/) — Parses HTTP requests, formats responses
         │
         ▼
[ Service Layer ] (backend/src/services/) — Implements business logic & rules
         │
         ▼
[ Repository Layer ] (backend/src/repositories/) — Interacts with Fabric Gateway
         │
         ▼
[ Fabric Gateway Connection ] (backend/src/blockchain/fabricGateway.ts) — gRPC/TLS connection
```

---

## 2. API Contract Specification

All API endpoints return standard JSON responses:
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

### Supported Endpoints

| Method | Endpoint | Purpose | Request Body / Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Health Check & Gateway Status | None |
| `GET` | `/api-docs` | Interactive Swagger UI Documentation | None |
| `GET` | `/api/shipments` | Query all cold chain shipments | None |
| `GET` | `/api/shipments/:id` | Read specific shipment details | `id`: Shipment ID string |
| `POST` | `/api/shipments` | Initialize new cold chain consignment | `{ shipmentID, productName, manufacturer, carrier, recipient, minTemp, maxTemp }` |
| `PUT` | `/api/shipments/:id/accept` | Transport custody acceptance | `id`: Shipment ID string |
| `POST` | `/api/shipments/:id/telemetry` | Record IoT sensor reading | `{ temperature, humidity, location }` |
| `PUT` | `/api/shipments/:id/receive` | Retailer destination receipt | `id`: Shipment ID string |
| `GET` | `/api/shipments/:id/history` | Cryptographic audit history trace | `id`: Shipment ID string |

---

## 3. Middleware & Security Infrastructure

* **Validation:** Input payload validation enforced via **Zod** schemas (`backend/src/validators/shipment.validator.ts`). Invalid payloads return `400 Bad Request` with structured field errors.
* **Logging:** Winston structured logger (`backend/src/config/logger.ts`) writing JSON logs to stdout and log files.
* **Request Tracing:** Express middleware logging incoming requests (`method`, `url`, `ip`, `responseTime`).
* **Error Handling:** Global error handler middleware (`backend/src/middleware/errorHandler.ts`) trapping unhandled exceptions without leaking stack traces.
* **Swagger Documentation:** Auto-served OpenAPI specification at `/api-docs` (`backend/src/swagger/swagger.yaml`).
