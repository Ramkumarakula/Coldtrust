package main

import (
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/v2/contractapi"
)

// SmartContract defines the cold chain shipment contract
type SmartContract struct {
	contractapi.Contract
}

// CreateShipment creates a new cold chain shipment asset on the ledger (Manufacturer ONLY)
func (s *SmartContract) CreateShipment(ctx contractapi.TransactionContextInterface, shipmentID string, productName string, manufacturer string, carrier string, recipient string, minTempStr string, maxTempStr string) error {
	exists, err := s.ShipmentExists(ctx, shipmentID)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("shipment %s already exists", shipmentID)
	}

	minTemp, err := strconv.ParseFloat(minTempStr, 64)
	if err != nil {
		return fmt.Errorf("invalid minTemp value %s: %v", minTempStr, err)
	}

	maxTemp, err := strconv.ParseFloat(maxTempStr, 64)
	if err != nil {
		return fmt.Errorf("invalid maxTemp value %s: %v", maxTempStr, err)
	}

	clientMSPID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		clientMSPID = "ManufacturerMSP"
	}

	txTimestamp, err := ctx.GetStub().GetTxTimestamp()
	var timestampStr string
	if err != nil || txTimestamp == nil {
		timestampStr = time.Now().UTC().Format(time.RFC3339)
	} else {
		timestampStr = time.Unix(txTimestamp.Seconds, int64(txTimestamp.Nanos)).UTC().Format(time.RFC3339)
	}

	shipment := Shipment{
		DocType:         "shipment",
		ShipmentID:      shipmentID,
		ProductName:     productName,
		Manufacturer:    manufacturer,
		Owner:           clientMSPID,
		Carrier:         carrier,
		Recipient:       recipient,
		MinTemp:         minTemp,
		MaxTemp:         maxTemp,
		CurrentTemp:     minTemp,
		CurrentHumidity: 40.0,
		Location:        "Manufacturer Origin Facility",
		Status:          "CREATED",
		CreatedAt:       timestampStr,
		UpdatedAt:       timestampStr,
		TelemetryLogs:   []TelemetryLog{},
	}

	shipmentJSON, err := json.Marshal(shipment)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(shipmentID, shipmentJSON)
}

// AcceptShipment allows Transport Org to accept custody of shipment (Status: CREATED -> IN_TRANSIT)
func (s *SmartContract) AcceptShipment(ctx contractapi.TransactionContextInterface, shipmentID string) error {
	shipment, err := s.GetShipment(ctx, shipmentID)
	if err != nil {
		return err
	}

	if shipment.Status != "CREATED" {
		return fmt.Errorf("shipment %s cannot be accepted because current status is %s (expected CREATED)", shipmentID, shipment.Status)
	}

	clientMSPID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		clientMSPID = "TransportMSP"
	}

	txTimestamp, err := ctx.GetStub().GetTxTimestamp()
	var timestampStr string
	if err != nil || txTimestamp == nil {
		timestampStr = time.Now().UTC().Format(time.RFC3339)
	} else {
		timestampStr = time.Unix(txTimestamp.Seconds, int64(txTimestamp.Nanos)).UTC().Format(time.RFC3339)
	}

	shipment.Status = "IN_TRANSIT"
	shipment.Owner = clientMSPID
	shipment.UpdatedAt = timestampStr

	shipmentJSON, err := json.Marshal(shipment)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(shipmentID, shipmentJSON)
}

// RecordTelemetry ingests IoT sensor readings & applies the AUTOMATED BREACH RULE (temp > maxTemp -> COMPROMISED)
func (s *SmartContract) RecordTelemetry(ctx contractapi.TransactionContextInterface, shipmentID string, tempStr string, humidityStr string, location string) error {
	shipment, err := s.GetShipment(ctx, shipmentID)
	if err != nil {
		return err
	}

	if shipment.Status == "DELIVERED" {
		return fmt.Errorf("cannot record telemetry for shipment %s as it is already DELIVERED", shipmentID)
	}

	temperature, err := strconv.ParseFloat(tempStr, 64)
	if err != nil {
		return fmt.Errorf("invalid temperature value %s: %v", tempStr, err)
	}

	humidity, err := strconv.ParseFloat(humidityStr, 64)
	if err != nil {
		return fmt.Errorf("invalid humidity value %s: %v", humidityStr, err)
	}

	clientMSPID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		clientMSPID = "TransportMSP"
	}

	txTimestamp, err := ctx.GetStub().GetTxTimestamp()
	var timestampStr string
	if err != nil || txTimestamp == nil {
		timestampStr = time.Now().UTC().Format(time.RFC3339)
	} else {
		timestampStr = time.Unix(txTimestamp.Seconds, int64(txTimestamp.Nanos)).UTC().Format(time.RFC3339)
	}

	// AUTOMATED BUSINESS RULE: Temperature breach check (> 4.0°C or maxTemp)
	if temperature > shipment.MaxTemp {
		shipment.Status = "COMPROMISED"
	}

	shipment.CurrentTemp = temperature
	shipment.CurrentHumidity = humidity
	shipment.Location = location
	shipment.UpdatedAt = timestampStr

	logEntry := TelemetryLog{
		Timestamp:   timestampStr,
		Temperature: temperature,
		Humidity:    humidity,
		Location:    location,
		RecordedBy:  clientMSPID,
	}

	shipment.TelemetryLogs = append(shipment.TelemetryLogs, logEntry)

	shipmentJSON, err := json.Marshal(shipment)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(shipmentID, shipmentJSON)
}

// ReceiveShipment allows Retailer Org to receive delivery at destination
func (s *SmartContract) ReceiveShipment(ctx contractapi.TransactionContextInterface, shipmentID string) error {
	shipment, err := s.GetShipment(ctx, shipmentID)
	if err != nil {
		return err
	}

	if shipment.Status == "DELIVERED" {
		return fmt.Errorf("shipment %s is already DELIVERED", shipmentID)
	}

	clientMSPID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		clientMSPID = "RetailerMSP"
	}

	txTimestamp, err := ctx.GetStub().GetTxTimestamp()
	var timestampStr string
	if err != nil || txTimestamp == nil {
		timestampStr = time.Now().UTC().Format(time.RFC3339)
	} else {
		timestampStr = time.Unix(txTimestamp.Seconds, int64(txTimestamp.Nanos)).UTC().Format(time.RFC3339)
	}

	// If already compromised, preserve COMPROMISED status; otherwise mark DELIVERED
	if shipment.Status != "COMPROMISED" {
		shipment.Status = "DELIVERED"
	}

	shipment.Owner = clientMSPID
	shipment.UpdatedAt = timestampStr

	shipmentJSON, err := json.Marshal(shipment)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(shipmentID, shipmentJSON)
}

// GetShipment retrieves shipment asset details from ledger
func (s *SmartContract) GetShipment(ctx contractapi.TransactionContextInterface, shipmentID string) (*Shipment, error) {
	shipmentJSON, err := ctx.GetStub().GetState(shipmentID)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if shipmentJSON == nil {
		return nil, fmt.Errorf("shipment %s does not exist", shipmentID)
	}

	var shipment Shipment
	err = json.Unmarshal(shipmentJSON, &shipment)
	if err != nil {
		return nil, err
	}

	return &shipment, nil
}

// GetShipmentHistory retrieves complete audit history for a shipment asset
func (s *SmartContract) GetShipmentHistory(ctx contractapi.TransactionContextInterface, shipmentID string) ([]*HistoryQueryResult, error) {
	resultsIterator, err := ctx.GetStub().GetHistoryForKey(shipmentID)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var records []*HistoryQueryResult
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var shipment Shipment
		if len(response.Value) > 0 {
			err = json.Unmarshal(response.Value, &shipment)
			if err != nil {
				return nil, err
			}
		}

		timestampStr := time.Unix(response.Timestamp.Seconds, int64(response.Timestamp.Nanos)).UTC().Format(time.RFC3339)

		record := HistoryQueryResult{
			TxID:      response.TxId,
			Timestamp: timestampStr,
			IsDelete:  response.IsDelete,
			Value:     &shipment,
		}
		records = append(records, &record)
	}

	return records, nil
}

// GetAllShipments returns all cold chain shipments using CouchDB rich query
func (s *SmartContract) GetAllShipments(ctx contractapi.TransactionContextInterface) ([]*Shipment, error) {
	queryString := `{"selector":{"docType":"shipment"}}`
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var shipments []*Shipment
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var shipment Shipment
		err = json.Unmarshal(queryResponse.Value, &shipment)
		if err != nil {
			return nil, err
		}
		shipments = append(shipments, &shipment)
	}

	return shipments, nil
}

// ShipmentExists returns true if shipment asset exists in world state
func (s *SmartContract) ShipmentExists(ctx contractapi.TransactionContextInterface, shipmentID string) (bool, error) {
	shipmentJSON, err := ctx.GetStub().GetState(shipmentID)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return shipmentJSON != nil, nil
}

func main() {
	shipmentContract := new(SmartContract)
	chaincode, err := contractapi.NewChaincode(shipmentContract)
	if err != nil {
		fmt.Printf("Error creating coldchain shipment chaincode: %v\n", err)
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting coldchain shipment chaincode: %v\n", err)
	}
}
