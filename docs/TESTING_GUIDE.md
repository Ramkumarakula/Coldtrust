# Testing Strategy & Test Execution Guide
## ColdTrust – Enterprise Global Cold Chain Network

**Document Version:** 1.0.0  
**Date:** August 2026  

---

## 1. Overview & Testing Pyramid

ColdTrust employs a 3-tier testing framework to ensure smart contract reliability, API security, automated compromise rule execution, and UI consistency across consortium organizations.

```
                  ┌────────────────────────┐
                  │   End-to-End E2E Flow  │
                  │   (Simulated IoT Stream│
                  │   & React Dashboard)   │
                  └───────────┬────────────┘
                              │
                  ┌───────────┴────────────┐
                  │   REST API Integration │
                  │   (Supertest / Jest)   │
                  └───────────┬────────────┘
                              │
           ┌──────────────────┴──────────────────┐
           │   Smart Contract Unit Tests         │
           │   (Go test / MockStub Ledger)      │
           └─────────────────────────────────────┘
```

---

## 2. Testing Levels

### 2.1 Level 1: Smart Contract Unit Testing
Unit tests isolate smart contract logic using mock ledger contexts (`MockStub`).

**Key Test Scenarios:**
- `TestCreateShipment`: Verify shipment creation sets status to `CREATED` and validates threshold parameters.
- `TestAcceptShipment`: Verify custody transfer updates owner to `TransportMSP`.
- `TestRecordTelemetry_Normal`: Verify temperature reading `<= 4.0°C` retains status `IN_TRANSIT`.
- `TestRecordTelemetry_Compromised`: Verify temperature reading `> 4.0°C` automatically converts status to `COMPROMISED`.
- `TestReceiveShipment`: Verify retailer receiving logic.
- `TestAccessControl`: Verify MSP access restriction policies.

### 2.2 Level 2: Backend REST API Integration Testing
API integration tests execute HTTP requests against the running Express backend.

**Key Test Commands:**
```bash
cd backend
npm test
```

### 2.3 Level 3: End-to-End Simulated IoT Testing Protocol
1. Launch full Fabric network, REST API backend, and IoT simulator.
2. Observe automated IoT stream emitting telemetry every 5 seconds.
3. Trigger artificial temperature spike to `5.2°C`.
4. Verify HTTP response contains `compromised: true`.
5. Query `GET /api/v1/shipments/SHIP-1001/history` to verify ledger audit log.
6. Verify React Frontend displays red `COMPROMISED` alert badge.
