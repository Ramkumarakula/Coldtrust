# Hyperledger Fabric Chaincode Security Unit Test Report

**Project:** ColdTrust – Enterprise Global Cold Chain Network  
**Target Chaincode:** `chaincode/shipment/smartcontract.go` (Go Hyperledger Fabric Contract API v2)  
**Security Test Suite:** `chaincode/shipment/security_test.go`  
**Execution Environment:** Native Go testing framework with in-memory mock ledger stub (`shim.ChaincodeStubInterface`, `cid.ClientIdentity`)  
**Date of Execution:** 2026-10-15  

---

## Overview

This report documents native security unit tests executed against the ColdTrust smart contract (`SmartContract`) in `chaincode/shipment/smartcontract.go`. The tests evaluate key security requirements defined in the chaincode technical specification (`docs/CHAINCODE_SPECIFICATION.md`), including role-based access control (MSP identity enforcement), state machine lifecycle transitions, external input bounds validation, and duplicate transaction replay prevention.

Unit tests were executed directly in memory without spinning up Docker containers or launching live Fabric peers, simulating realistic attack vectors against an in-memory ledger stub.

---

## Test 1: `CreateShipment` — Duplicate Transaction Replay Prevention

- **Function tested:** `CreateShipment` in [`chaincode/shipment/smartcontract.go`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/chaincode/shipment/smartcontract.go#L20-L75)
- **Why this function was chosen:** `CreateShipment` controls initial ledger write access, instantiating new shipment assets, establishing acceptable temperature tolerances (`minTemp`, `maxTemp`), and recording baseline ownership.
- **What it checks:** Tests whether submitting a duplicate transaction with an already-existing `shipmentID` is rejected by the smart contract, preventing an attacker or client retry bug from overwriting existing shipment records or resetting compromised status.
- **Test written:**
```go
// Test 1: CreateShipment - Replay / Duplicate Transaction Submission Prevention
func TestSecurity_CreateShipment_ReplayPrevention(t *testing.T) {
	contract := new(SmartContract)
	stub := NewSecurityMockStub()
	ctx := &SecurityMockContext{
		stub:           stub,
		clientIdentity: &SecurityMockClientIdentity{mspID: "ManufacturerMSP"},
	}

	// Seed existing shipment
	err := seedTestShipment(stub, "SHIP-SEC-001", "CREATED", "ManufacturerMSP")
	assert.NoError(t, err)

	// Attempt duplicate creation of the same shipment ID
	err = contract.CreateShipment(ctx, "SHIP-SEC-001", "Duplicate Vaccine Batch", "ManufacturerMSP", "TransportMSP", "RetailerMSP", "2.0", "4.0")

	// Expect rejection: function must return an error and preserve existing state
	assert.Error(t, err, "Expected CreateShipment to reject duplicate shipment ID submission")
	if err != nil {
		assert.Contains(t, err.Error(), "already exists")
	}
}
```
- **How it was run:**
```bash
cd /home/ramkumar/projects/Enterprise-Cold-Chain-Network/chaincode/shipment && go test -v -run '^TestSecurity_CreateShipment_ReplayPrevention$'
```
- **Actual result:** **PASS**
```
=== RUN   TestSecurity_CreateShipment_ReplayPrevention
--- PASS: TestSecurity_CreateShipment_ReplayPrevention (0.00s)
PASS
ok  	github.com/Ramkumarakula/Coldtrust/chaincode/shipment	0.091s
```
- **Why this test matters:** In a distributed cold chain ledger, ensuring asset identifier uniqueness protects against replay attacks and accidental duplicate writes that could overwrite existing audit histories or overwrite temperature breach states.

---

## Test 2: `AcceptShipment` — Role-Based Access Control / Unauthorized Identity Rejection

- **Function tested:** `AcceptShipment` in [`chaincode/shipment/smartcontract.go`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/chaincode/shipment/smartcontract.go#L78-L111)
- **Why this function was chosen:** `AcceptShipment` transitions shipment custody from manufacturer to transport carrier, updating the asset's `Owner` and `Status` fields on the immutable ledger; the specification explicitly designates this action as `TransportMSP ONLY`.
- **What it checks:** Tests whether the chaincode validates the caller's MSP ID and rejects invocations from unauthorized identities (e.g., `UnauthorizedAttackerMSP` or `RetailerMSP`).
- **Test written:**
```go
// Test 2: AcceptShipment - Access Control / Unauthorized Identity Rejection
func TestSecurity_AcceptShipment_UnauthorizedIdentityRejection(t *testing.T) {
	contract := new(SmartContract)
	stub := NewSecurityMockStub()
	ctx := &SecurityMockContext{
		stub:           stub,
		clientIdentity: &SecurityMockClientIdentity{mspID: "UnauthorizedAttackerMSP"},
	}

	// Seed shipment in CREATED status
	err := seedTestShipment(stub, "SHIP-SEC-002", "CREATED", "ManufacturerMSP")
	assert.NoError(t, err)

	// An unauthorized identity attempts to accept custody
	err = contract.AcceptShipment(ctx, "SHIP-SEC-002")

	// Specification requires: Access Permission: TransportMSP ONLY.
	// The function must reject callers whose MSP ID != TransportMSP.
	assert.Error(t, err, "Expected AcceptShipment to reject invocation from unauthorized identity 'UnauthorizedAttackerMSP'")
}
```
- **How it was run:**
```bash
cd /home/ramkumar/projects/Enterprise-Cold-Chain-Network/chaincode/shipment && go test -v -run '^TestSecurity_AcceptShipment_UnauthorizedIdentityRejection$'
```
- **Actual result:** **FAIL (Security Gap Identified)**
```
=== RUN   TestSecurity_AcceptShipment_UnauthorizedIdentityRejection
    security_test.go:137: 
        	Error Trace:	/home/ramkumar/projects/Enterprise-Cold-Chain-Network/chaincode/shipment/security_test.go:137
        	Error:      	An error is expected but got nil.
        	Test:       	TestSecurity_AcceptShipment_UnauthorizedIdentityRejection
        	Messages:   	Expected AcceptShipment to reject invocation from unauthorized identity 'UnauthorizedAttackerMSP'
--- FAIL: TestSecurity_AcceptShipment_UnauthorizedIdentityRejection (0.00s)
FAIL
exit status 1
FAIL	github.com/Ramkumarakula/Coldtrust/chaincode/shipment	0.093s
```
- **Why this test matters:** Without caller MSP enforcement, rogue consortium participants or unauthorized clients can arbitrarily claim legal custody of high-value shipments on ledger, breaking chain-of-custody accountability.

---

## Test 3: `RecordTelemetry` — Input Boundary Validation on Sensor Readings

- **Function tested:** `RecordTelemetry` in [`chaincode/shipment/smartcontract.go`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/chaincode/shipment/smartcontract.go#L114-L173)
- **Why this function was chosen:** `RecordTelemetry` ingests high-frequency external IoT sensor inputs (temperature, humidity, location) and executes automated breach logic (`temp > maxTemp -> COMPROMISED`).
- **What it checks:** Tests whether the chaincode validates incoming sensor telemetry against realistic physical constraints, specifically testing rejection of physically impossible negative relative humidity (`humidityStr = "-25.0"`).
- **Test written:**
```go
// Test 3: RecordTelemetry - Input Validation on External Sensor Data
func TestSecurity_RecordTelemetry_OutOfRangeInputValidation(t *testing.T) {
	contract := new(SmartContract)
	stub := NewSecurityMockStub()
	ctx := &SecurityMockContext{
		stub:           stub,
		clientIdentity: &SecurityMockClientIdentity{mspID: "TransportMSP"},
	}

	// Seed shipment in IN_TRANSIT status
	err := seedTestShipment(stub, "SHIP-SEC-003", "IN_TRANSIT", "TransportMSP")
	assert.NoError(t, err)

	// Malfunctioning or rogue IoT sensor inputs negative relative humidity (-25.0%)
	err = contract.RecordTelemetry(ctx, "SHIP-SEC-003", "3.2", "-25.0", "Transit Route 9")

	// Chaincode must validate external inputs against physical sensor bounds [0%, 100%]
	assert.Error(t, err, "Expected RecordTelemetry to reject impossible negative humidity value '-25.0'")
}
```
- **How it was run:**
```bash
cd /home/ramkumar/projects/Enterprise-Cold-Chain-Network/chaincode/shipment && go test -v -run '^TestSecurity_RecordTelemetry_OutOfRangeInputValidation$'
```
- **Actual result:** **FAIL (Security Gap Identified)**
```
=== RUN   TestSecurity_RecordTelemetry_OutOfRangeInputValidation
    security_test.go:157: 
        	Error Trace:	/home/ramkumar/projects/Enterprise-Cold-Chain-Network/chaincode/shipment/security_test.go:157
        	Error:      	An error is expected but got nil.
        	Test:       	TestSecurity_RecordTelemetry_OutOfRangeInputValidation
        	Messages:   	Expected RecordTelemetry to reject impossible negative humidity value '-25.0'
--- FAIL: TestSecurity_RecordTelemetry_OutOfRangeInputValidation (0.00s)
FAIL
exit status 1
FAIL	github.com/Ramkumarakula/Coldtrust/chaincode/shipment	0.095s
```
- **Why this test matters:** Cold chain integrity relies on pristine telemetry data; permitting unbounded or corrupt sensor inputs pollutes the immutable ledger and degrades audit confidence for regulatory inspections.

---

## Test 4: `ReceiveShipment` — State Machine Lifecycle Enforcement (Bypass Transit Prevention)

- **Function tested:** `ReceiveShipment` in [`chaincode/shipment/smartcontract.go`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/chaincode/shipment/smartcontract.go#L176-L213)
- **Why this function was chosen:** `ReceiveShipment` marks the terminal delivery of goods at the destination hospital or retailer, sealing the active tracking lifecycle of the shipment.
- **What it checks:** Tests whether the chaincode enforces strict state machine progression by rejecting `ReceiveShipment` calls for goods still in `CREATED` status (i.e. verifying an asset cannot jump directly from creation to delivery without ever entering transport transit).
- **Test written:**
```go
// Test 4: ReceiveShipment - State Machine Lifecycle Enforcement (Bypass Transit Prevention)
func TestSecurity_ReceiveShipment_PrematureLifecycleTransition(t *testing.T) {
	contract := new(SmartContract)
	stub := NewSecurityMockStub()
	ctx := &SecurityMockContext{
		stub:           stub,
		clientIdentity: &SecurityMockClientIdentity{mspID: "RetailerMSP"},
	}

	// Seed shipment in CREATED status (never accepted by transport, never moved in-transit)
	err := seedTestShipment(stub, "SHIP-SEC-004", "CREATED", "ManufacturerMSP")
	assert.NoError(t, err)

	// Destination attempts to mark shipment as DELIVERED directly from CREATED
	err = contract.ReceiveShipment(ctx, "SHIP-SEC-004")

	// Specification requires: Current status must be IN_TRANSIT or COMPROMISED.
	// Function must reject receiving goods that have bypassed the transit lifecycle.
	assert.Error(t, err, "Expected ReceiveShipment to reject delivery receipt for shipment still in CREATED status")
}
```
- **How it was run:**
```bash
cd /home/ramkumar/projects/Enterprise-Cold-Chain-Network/chaincode/shipment && go test -v -run '^TestSecurity_ReceiveShipment_PrematureLifecycleTransition$'
```
- **Actual result:** **FAIL (Security Gap Identified)**
```
=== RUN   TestSecurity_ReceiveShipment_PrematureLifecycleTransition
    security_test.go:178: 
        	Error Trace:	/home/ramkumar/projects/Enterprise-Cold-Chain-Network/chaincode/shipment/security_test.go:178
        	Error:      	An error is expected but got nil.
        	Test:       	TestSecurity_ReceiveShipment_PrematureLifecycleTransition
        	Messages:   	Expected ReceiveShipment to reject delivery receipt for shipment still in CREATED status
--- FAIL: TestSecurity_ReceiveShipment_PrematureLifecycleTransition (0.00s)
FAIL
exit status 1
FAIL	github.com/Ramkumarakula/Coldtrust/chaincode/shipment	0.098s
```
- **Why this test matters:** Bypassing the transit state allows unverified shipments to appear legitimately delivered without ever undergoing temperature compliance logging during shipping, creating severe compliance and public safety risks.

---

## Summary & Findings

| Test Case | Function | Condition / Vector Tested | Result | Finding Type |
| :--- | :--- | :--- | :--- | :--- |
| `TestSecurity_CreateShipment_ReplayPrevention` | `CreateShipment` | Duplicate/replayed transaction rejection | **PASS** | Expected behavior verified |
| `TestSecurity_AcceptShipment_UnauthorizedIdentityRejection` | `AcceptShipment` | Caller MSP RBAC authorization | **FAIL** | **Security Finding:** Missing MSP identity validation |
| `TestSecurity_RecordTelemetry_OutOfRangeInputValidation` | `RecordTelemetry` | Negative humidity input boundary validation | **FAIL** | **Security Finding:** Missing input domain validation |
| `TestSecurity_ReceiveShipment_PrematureLifecycleTransition` | `ReceiveShipment` | Lifecycle state transition enforcement (`CREATED` -> `DELIVERED`) | **FAIL** | **Security Finding:** Missing state prerequisite validation |

- **Total functions tested:** 4
- **Passed:** 1
- **Revealed security gaps (Failed):** 3

### Why Native Chaincode Unit Testing Matters for Blockchain Applications

Unit testing chaincode with native mock stubs is uniquely critical in blockchain environments because of the immutable nature of distributed ledgers. Unlike traditional web applications where unauthorized writes, corrupted database rows, or improper state transitions can be rolled back via database transactions or administrative hotfixes, every committed transaction on Hyperledger Fabric becomes permanent, cryptographically sealed into blocks replicated across all endorsing and ordering peers. If chaincode fails to enforce strict identity checks (`ctx.GetClientIdentity().GetMSPID()`), input domain boundaries, or state-machine preconditions, malicious or malformed transactions will permanently taint the world state and audit trail. Catching these vulnerabilities at the unit test level using fast, deterministic mock stubs ensures that access controls and business invariants are verified before chaincode definition packaging, endorsement policies, and network deployment take place.
