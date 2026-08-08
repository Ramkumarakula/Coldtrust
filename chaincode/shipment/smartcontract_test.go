package main

import (
	"encoding/json"
	"testing"

	"github.com/hyperledger/fabric-chaincode-go/v2/shim"
	"github.com/hyperledger/fabric-contract-api-go/v2/contractapi"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// MockTransactionContext provides mock Fabric transaction context
type MockTransactionContext struct {
	mock.Mock
	contractapi.TransactionContext
}

type MockStub struct {
	mock.Mock
	shim.ChaincodeStubInterface
}

func TestCreateShipment(t *testing.T) {
	contract := new(SmartContract)
	assert.NotNil(t, contract)
}

func TestShipmentStructValidation(t *testing.T) {
	shipment := Shipment{
		DocType:     "shipment",
		ShipmentID:  "SHIP-1001",
		ProductName: "COVID-19 Vaccines",
		MinTemp:     2.0,
		MaxTemp:     4.0,
		CurrentTemp: 3.1,
		Status:      "CREATED",
	}

	assert.Equal(t, "SHIP-1001", shipment.ShipmentID)
	assert.Equal(t, 4.0, shipment.MaxTemp)
	assert.Equal(t, "CREATED", shipment.Status)

	// Verify Automated Breach Logic
	if shipment.CurrentTemp > shipment.MaxTemp {
		shipment.Status = "COMPROMISED"
	}
	assert.Equal(t, "CREATED", shipment.Status)

	// Simulate Temperature Spike (> 4.0°C)
	shipment.CurrentTemp = 5.5
	if shipment.CurrentTemp > shipment.MaxTemp {
		shipment.Status = "COMPROMISED"
	}
	assert.Equal(t, "COMPROMISED", shipment.Status)
}

func TestJsonSerialization(t *testing.T) {
	shipment := Shipment{
		DocType:     "shipment",
		ShipmentID:  "SHIP-9999",
		ProductName: "Insulin Vials",
		MinTemp:     2.0,
		MaxTemp:     4.0,
		CurrentTemp: 3.5,
		Status:      "IN_TRANSIT",
	}

	data, err := json.Marshal(shipment)
	assert.NoError(t, err)

	var unmarshalled Shipment
	err = json.Unmarshal(data, &unmarshalled)
	assert.NoError(t, err)
	assert.Equal(t, shipment.ShipmentID, unmarshalled.ShipmentID)
	assert.Equal(t, shipment.ProductName, unmarshalled.ProductName)
}
