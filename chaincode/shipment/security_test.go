package main

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/hyperledger/fabric-chaincode-go/v2/pkg/cid"
	"github.com/hyperledger/fabric-chaincode-go/v2/shim"
	"github.com/hyperledger/fabric-contract-api-go/v2/contractapi"
	"github.com/stretchr/testify/assert"
	"google.golang.org/protobuf/types/known/timestamppb"
)

// SecurityMockStub implements an in-memory ledger stub for native security unit testing
type SecurityMockStub struct {
	shim.ChaincodeStubInterface
	state map[string][]byte
}

func NewSecurityMockStub() *SecurityMockStub {
	return &SecurityMockStub{
		state: make(map[string][]byte),
	}
}

func (s *SecurityMockStub) GetState(key string) ([]byte, error) {
	val, ok := s.state[key]
	if !ok {
		return nil, nil
	}
	return val, nil
}

func (s *SecurityMockStub) PutState(key string, value []byte) error {
	s.state[key] = value
	return nil
}

func (s *SecurityMockStub) GetTxTimestamp() (*timestamppb.Timestamp, error) {
	return timestamppb.New(time.Now()), nil
}

// SecurityMockClientIdentity simulates caller MSP credentials
type SecurityMockClientIdentity struct {
	cid.ClientIdentity
	mspID string
}

func (c *SecurityMockClientIdentity) GetMSPID() (string, error) {
	return c.mspID, nil
}

// SecurityMockContext satisfies contractapi.TransactionContextInterface
type SecurityMockContext struct {
	contractapi.TransactionContextInterface
	stub           shim.ChaincodeStubInterface
	clientIdentity cid.ClientIdentity
}

func (c *SecurityMockContext) GetStub() shim.ChaincodeStubInterface {
	return c.stub
}

func (c *SecurityMockContext) GetClientIdentity() cid.ClientIdentity {
	return c.clientIdentity
}

// helper to seed shipment state
func seedTestShipment(stub *SecurityMockStub, id, status, owner string) error {
	shipment := Shipment{
		DocType:         "shipment",
		ShipmentID:      id,
		ProductName:     "ColdTrust Test Vaccine Batch",
		Manufacturer:    "ManufacturerMSP",
		Owner:           owner,
		Carrier:         "TransportMSP",
		Recipient:       "RetailerMSP",
		MinTemp:         2.0,
		MaxTemp:         4.0,
		CurrentTemp:     3.0,
		CurrentHumidity: 45.0,
		Location:        "Cold Storage Facility A",
		Status:          status,
		CreatedAt:       time.Now().UTC().Format(time.RFC3339),
		UpdatedAt:       time.Now().UTC().Format(time.RFC3339),
		TelemetryLogs:   []TelemetryLog{},
	}
	data, err := json.Marshal(shipment)
	if err != nil {
		return err
	}
	return stub.PutState(id, data)
}

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
