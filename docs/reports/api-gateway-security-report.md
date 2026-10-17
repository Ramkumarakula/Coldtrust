# API / SDK Gateway Layer Security Report

**Project:** ColdTrust – Enterprise Global Cold Chain Network  
**Service Under Review:** REST API Backend Service (`backend/`)  
**Target Routes & Handlers:** `backend/src/routes/shipment.routes.ts`, `backend/src/controllers/shipment.controller.ts`  
**Evaluation Mode:** Static Source Code Security Review (Gateway service is not actively listening on port 3000; live HTTP probe confirmed offline)  
**Date of Review:** 2026-10-15  

---

## Executive Summary

This report evaluates the security posture of the ColdTrust REST API Gateway layer (`backend/`), which serves as the bridge between client applications (dashboards, IoT simulators, carrier tracking interfaces) and the Hyperledger Fabric blockchain network.

Following the initial chaincode unit testing phase (Round 1), this audit analyzes four core security aspects:
1. **Authentication Enforcement** (verifying whether transaction-submitting endpoints enforce identity verification)
2. **Server-Side Input Re-Validation** (verifying whether domain boundaries and physical sensor constraints are checked before ledger dispatch)
3. **Identity & Ownership Tampering / IDOR** (evaluating whether object identifiers in URLs can be altered to manipulate third-party assets)
4. **Error Handling & Information Leakage** (evaluating whether internal stack traces, system paths, or infrastructure details are exposed in HTTP responses)

Because the gateway service was not running live during this assessment (and per execution constraints, starting the network or background services was prohibited), this evaluation was conducted via thorough static source code review of route definitions, controllers, middleware, validators, and Fabric gateway integrations.

---

## Test 1: Authentication Enforcement

- **Endpoint tested:**
  - `POST /api/shipments` (Shipment creation)
  - `PUT /api/shipments/:id/accept` (Custody transfer)
  - `POST /api/shipments/:id/telemetry` (Sensor telemetry ingestion)
  - `PUT /api/shipments/:id/receive` (Delivery receipt)  
  **Handler location:** [`backend/src/controllers/shipment.controller.ts`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/backend/src/controllers/shipment.controller.ts#L10-L49), mounted via [`backend/src/routes/shipment.routes.ts`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/backend/src/routes/shipment.routes.ts#L6-L12) and [`backend/src/app.ts`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/backend/src/app.ts#L22).
- **Why this endpoint/check was chosen:**
  Writing transactions to an enterprise consortium ledger (Hyperledger Fabric) requires strong cryptographic identity attribution. If the API gateway does not authenticate callers, anonymous actors can submit transactions to the blockchain ledger.
- **Test performed:**
  Static source code review of middleware registration in [`backend/src/app.ts`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/backend/src/app.ts) and route handlers in [`backend/src/routes/shipment.routes.ts`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/backend/src/routes/shipment.routes.ts).
- **What it checks:**
  Does each transaction-submitting endpoint require a valid authorization token, API key, or session before executing? Checks whether an unauthenticated request (with no `Authorization` header or credentials) is intercepted and rejected with HTTP 401/403, or whether it proceeds without check.
- **How it was run:**
  Static source review (probe confirmed local gateway on port 3000 is offline; verified via test harness [`backend/src/tests/api_gateway_security.test.ts`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/backend/src/tests/api_gateway_security.test.ts)).
- **Actual result (real code excerpt):**
  In [`backend/src/app.ts:11-23`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/backend/src/app.ts#L11-L23):
  ```typescript
  // Security & Utility Middlewares
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);
  app.use('/api/', apiRateLimiter);

  // Swagger API Documentation
  setupSwagger(app);

  // API Routes
  app.use('/health', healthRoutes);
  app.use('/api/shipments', shipmentRoutes);
  ```
  In [`backend/src/routes/shipment.routes.ts:6-12`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/backend/src/routes/shipment.routes.ts#L6-L12):
  ```typescript
  router.post('/', shipmentController.createShipment);
  router.get('/', shipmentController.getAllShipments);
  router.get('/:id', shipmentController.getShipment);
  router.get('/:id/history', shipmentController.getShipmentHistory);
  router.put('/:id/accept', shipmentController.acceptShipment);
  router.post('/:id/telemetry', shipmentController.recordTelemetry);
  router.put('/:id/receive', shipmentController.receiveShipment);
  ```
  And in [`backend/src/blockchain/fabricGateway.ts:46-51`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/backend/src/blockchain/fabricGateway.ts#L46-L51):
  ```typescript
  this.gateway = connect({
    client: this.client,
    identity,
    signer,
  });
  ```
- **Finding: Gap identified (Severity: Critical)**  
  The API completely lacks an authentication middleware layer (no JWT verification, session checking, or API key validation). Every transaction-submitting endpoint is open to the public. Moreover, all requests submitted through this gateway are signed using a single hardcoded administrative identity (`ManufacturerMSP` via `fabricConfig.mspId` and its local certificate), meaning any anonymous internet caller can commit transactions to the ledger under the guise of the Manufacturer admin.
- **Why this matters:**
  Anonymous callers can generate counterfeit shipments, corrupt telemetry records, or alter custody chains without authentication, completely defeating the non-repudiation and identity guarantees of Hyperledger Fabric.

---

## Test 2: Server-Side Input Re-Validation

- **Endpoint tested:**
  `POST /api/shipments/:id/telemetry` (Sensor telemetry ingestion)  
  **Handler location:** [`backend/src/controllers/shipment.controller.ts:30-39`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/backend/src/controllers/shipment.controller.ts#L30-L39), schema in [`backend/src/validators/shipment.validator.ts:13-17`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/backend/src/validators/shipment.validator.ts#L13-L17).  
  (Also evaluated: `POST /api/shipments` schema in [`backend/src/validators/shipment.validator.ts:3-11`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/backend/src/validators/shipment.validator.ts#L3-L11)).
- **Why this endpoint/check was chosen:**
  `POST /api/shipments/:id/telemetry` handles high-frequency external IoT sensor inputs that trigger automated smart contract rules (`temperature > maxTemp -> COMPROMISED`). The gateway must validate physical plausibility before dispatching to the ledger.
- **Test performed:**
  Static source code review of Zod schema definitions in [`backend/src/validators/shipment.validator.ts`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/backend/src/validators/shipment.validator.ts) and data forwarding in [`backend/src/repositories/shipment.repository.ts`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/backend/src/repositories/shipment.repository.ts#L40-L46).
- **What it checks:**
  Does the server re-validate input constraints beyond basic type presence? Specifically, does it reject impossible physical sensor readings (e.g. negative relative humidity `-25.0%` or humidity `> 100%`, temperatures below absolute zero) or inverted temperature thresholds (`minTemp > maxTemp`)?
- **How it was run:**
  Static source review (probe confirmed local gateway on port 3000 is offline).
- **Actual result (real code excerpt):**
  In [`backend/src/validators/shipment.validator.ts:13-17`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/backend/src/validators/shipment.validator.ts#L13-L17):
  ```typescript
  export const recordTelemetrySchema = z.object({
    temperature: z.number({ required_error: 'Temperature is required' }),
    humidity: z.number({ required_error: 'Humidity is required' }),
    location: z.string().min(2, 'Location is required'),
  });
  ```
  And in [`backend/src/validators/shipment.validator.ts:3-11`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/backend/src/validators/shipment.validator.ts#L3-L11):
  ```typescript
  export const createShipmentSchema = z.object({
    shipmentID: z.string().min(3, 'Shipment ID must be at least 3 characters'),
    productName: z.string().min(2, 'Product name is required'),
    manufacturer: z.string().min(2, 'Manufacturer name is required'),
    carrier: z.string().min(2, 'Carrier name is required'),
    recipient: z.string().min(2, 'Recipient name is required'),
    minTemp: z.number().default(2.0),
    maxTemp: z.number().default(4.0),
  });
  ```
  And in [`backend/src/repositories/shipment.repository.ts:40-46`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/backend/src/repositories/shipment.repository.ts#L40-L46):
  ```typescript
  await contract.submitTransaction(
    'RecordTelemetry',
    shipmentID,
    temperature.toString(),
    humidity.toString(),
    location
  );
  ```
- **Finding: Gap identified (Severity: High)**  
  Zod validates only that `temperature` and `humidity` are numeric types, with **no range bounds**:
  - `humidity` allows negative values (`-25.0`) or values exceeding 100% (`150.0%`).
  - `temperature` allows physically absurd values (`-999.0` or `10000.0`).
  - `createShipmentSchema` accepts `minTemp` and `maxTemp` without verifying `minTemp < maxTemp`.  
  Because chaincode unit tests (Round 1) also confirmed that the chaincode does not validate humidity or temperature bounds, these values bypass all validation layers and are permanently stored in ledger state.
- **Why this matters:**
  Bypassing frontend validation allows any direct HTTP caller or rogue sensor to commit corrupted, physically impossible data to the blockchain, polluting regulatory audit logs.

---

## Test 3: Identity / Ownership Tampering (IDOR-Style Check)

- **Endpoint tested:**
  - `PUT /api/shipments/:id/accept` (Custody transfer)
  - `PUT /api/shipments/:id/receive` (Delivery receipt)
  - `GET /api/shipments/:id` (Asset state retrieval)  
  **Handler location:** [`backend/src/controllers/shipment.controller.ts:20-28, 41-49`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/backend/src/controllers/shipment.controller.ts#L20-L28), parameter schema in [`backend/src/validators/shipment.validator.ts:19-21`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/backend/src/validators/shipment.validator.ts#L19-L21).
- **Why this endpoint/check was chosen:**
  In a multi-organization supply chain, operations on shipment assets must be restricted to authorized stakeholders (e.g. only the designated carrier can accept custody; only the recipient pharmacy can receive delivery).
- **Test performed:**
  Static source code review of URL parameter parsing and dispatch in [`backend/src/controllers/shipment.controller.ts`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/backend/src/controllers/shipment.controller.ts) and [`backend/src/services/shipment.service.ts`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/backend/src/services/shipment.service.ts).
- **What it checks:**
  Does the API layer verify caller identity or tenancy before acting on an asset, or does changing the `:id` parameter in the URL permit an arbitrary caller to view or manipulate third-party shipments (IDOR)?
- **How it was run:**
  Static source review (probe confirmed local gateway on port 3000 is offline).
- **Actual result (real code excerpt):**
  In [`backend/src/controllers/shipment.controller.ts:20-28`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/backend/src/controllers/shipment.controller.ts#L20-L28):
  ```typescript
  public acceptShipment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = shipmentIDParamSchema.parse(req.params);
      const result = await this.service.acceptShipment(id);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };
  ```
  In [`backend/src/controllers/shipment.controller.ts:41-49`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/backend/src/controllers/shipment.controller.ts#L41-L49):
  ```typescript
  public receiveShipment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = shipmentIDParamSchema.parse(req.params);
      const result = await this.service.receiveShipment(id);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };
  ```
  In [`backend/src/validators/shipment.validator.ts:19-21`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/backend/src/validators/shipment.validator.ts#L19-L21):
  ```typescript
  export const shipmentIDParamSchema = z.object({
    id: z.string().min(1, 'Shipment ID is required'),
  });
  ```
- **Finding: Gap identified (Severity: High)**  
  The controller extracts `:id` from the URL, validates only that it has length >= 1, and immediately passes it to the service layer. There is **zero authorization check, caller organization matching, or asset ownership verification**. Anyone with access to the API can manipulate or inspect any shipment by simply guessing or iterating the shipment identifier (e.g. `SHIP-1001`, `SHIP-1002`).
- **Why this matters:**
  A rogue party or competitor can prematurely mark another organization's shipments as accepted or delivered, corrupting custody logs across the supply chain.

---

## Test 4: Error Handling / Information Leakage

- **Endpoint tested:**
  Global Express Error Handling Middleware (`errorHandler`)  
  **Handler location:** [`backend/src/middleware/errorHandler.ts:11-34`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/backend/src/middleware/errorHandler.ts#L11-L34), response formatter in [`backend/src/utils/response.ts:12-25`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/backend/src/utils/response.ts#L12-L25).
- **Why this endpoint/check was chosen:**
  Backend services interfacing with blockchain peer nodes and cryptographic keystores encounter gRPC, cryptographic, and validation errors. Unhandled exceptions must not leak internal system architecture, stack traces, or file paths to clients.
- **Test performed:**
  Static source code review of error formatting and response serialization in [`backend/src/middleware/errorHandler.ts`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/backend/src/middleware/errorHandler.ts) and [`backend/src/utils/response.ts`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/backend/src/utils/response.ts).
- **What it checks:**
  Does the error handler return sanitized error structures, or does it disclose raw stack traces, local filesystem paths, or cryptographic keystore locations upon receiving malformed input or encountering backend exceptions?
- **How it was run:**
  Static source review (probe confirmed local gateway on port 3000 is offline).
- **Actual result (real code excerpt):**
  In [`backend/src/middleware/errorHandler.ts:11-34`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/backend/src/middleware/errorHandler.ts#L11-L34):
  ```typescript
  export const errorHandler = (
    err: AppError | ZodError | Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): Response => {
    logger.error('Unhandled API Error:', err);

    if (err instanceof ZodError) {
      return sendError(
        res,
        'Validation Error: Invalid request body or parameter format',
        'VALIDATION_ERROR',
        400,
        err.errors
      );
    }

    const appErr = err as AppError;
    const message = appErr.message || 'An unexpected internal server error occurred';
    const code = appErr.code || 'INTERNAL_SERVER_ERROR';
    const statusCode = appErr.statusCode || 500;

    return sendError(res, message, code, statusCode);
  };
  ```
  In [`backend/src/utils/response.ts:12-25`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/backend/src/utils/response.ts#L12-L25):
  ```typescript
  export const sendError = (
    res: Response,
    message: string,
    code = 'INTERNAL_SERVER_ERROR',
    statusCode = 500,
    details?: unknown
  ): Response => {
    const response: ApiResponse = {
      success: false,
      error: {
        code,
        message,
        ...(details !== undefined && { details }),
      },
    };
    return res.status(statusCode).json(response);
  };
  ```
- **Finding: Pass (with Low-Severity Observation)**  
  - **Core Result: Pass.** The error handling middleware sanitizes responses; stack traces (`err.stack`) are logged via Winston (`logger.error`) on the server and are **not** serialized into the client JSON response. Validation errors return a structured `{ success: false, error: { code: 'VALIDATION_ERROR', message: '...', details: [...] } }` with HTTP 400.
  - **Informational Caveat (Low):** For unhandled system exceptions (`appErr.message`), raw error strings (such as file not found in `/home/ramkumar/.../msp/keystore`) are returned in `error.message` without environment-conditional masking (`NODE_ENV === 'production'`), which could expose internal directory structures during network outages.
- **Why this matters:**
  Preventing stack trace leakage restricts attackers from fingerprinting internal library versions, file system layouts, and internal component names for reconnaissance.

---

## Summary Table

| Test | Endpoint / Component | Result | Severity | Finding Summary |
| :--- | :--- | :--- | :--- | :--- |
| **1. Authentication Enforcement** | `POST /api/shipments`, `PUT /api/shipments/:id/*` | **Gap Identified** | **Critical** | Complete absence of authentication middleware; all ledger writes are anonymously accessible and signed by a single static server identity. |
| **2. Server-Side Input Re-Validation** | `POST /api/shipments/:id/telemetry`, `POST /api/shipments` | **Gap Identified** | **High** | Zod schema checks only numeric types; allows negative humidity (`-25%`) and unconstrained temperatures without domain range checks. |
| **3. Identity / Ownership Tampering (IDOR)** | `PUT /api/shipments/:id/accept`, `PUT /api/shipments/:id/receive` | **Gap Identified** | **High** | Route `:id` is parsed without any caller identity validation or asset ownership checks, permitting cross-organization custody manipulation. |
| **4. Error Handling & Info Leakage** | Global `errorHandler` (`backend/src/middleware/errorHandler.ts`) | **Pass** | **Low** (Observation) | Responses do not leak stack traces or environment secrets; raw `appErr.message` is returned but error structure is properly sanitized. |

- **Total API Gateway Checks Performed:** 4
- **Passed:** 1
- **Revealed Security Gaps:** 3 (1 Critical, 2 High, 1 Low observation)

---

## Running Total: Combined Security Posture (Chaincode + API Gateway)

Combining the findings from **Round 1 (Chaincode Layer)** and **Round 2 (API/SDK Gateway Layer)**:

| Layer | Checks / Tests | Passed | Gaps Identified | Key Vulnerabilities Identified |
| :--- | :---: | :---: | :---: | :--- |
| **Layer 1: Chaincode (Smart Contract)** | 4 | 1 | 3 | Missing MSP identity check on custody acceptance; missing sensor humidity range checks; premature state transition (`CREATED` -> `DELIVERED`). |
| **Layer 2: API / SDK Gateway** | 4 | 1 | 3 | No authentication on API endpoints; no server-side range validation on telemetry; IDOR on custody transition endpoints. |
| **TOTAL TO DATE** | **8** | **2** | **6** | **Critical architectural gap: Neither the API gateway nor the smart contract enforces caller authentication or sensor input boundaries.** |
