package main

// TelemetryLog stores individual IoT sensor readings
type TelemetryLog struct {
	Timestamp   string  `json:"timestamp"`
	Temperature float64 `json:"temperature"`
	Humidity    float64 `json:"humidity"`
	Location    string  `json:"location"`
	RecordedBy  string  `json:"recordedBy"`
}

// Shipment represents the cold chain asset state on ledger
type Shipment struct {
	DocType         string         `json:"docType"`
	ShipmentID      string         `json:"shipmentID"`
	ProductName     string         `json:"productName"`
	Manufacturer    string         `json:"manufacturer"`
	Owner           string         `json:"owner"`
	Carrier         string         `json:"carrier"`
	Recipient       string         `json:"recipient"`
	MinTemp         float64        `json:"minTemp"`
	MaxTemp         float64        `json:"maxTemp"`
	CurrentTemp     float64        `json:"currentTemp"`
	CurrentHumidity float64        `json:"currentHumidity"`
	Location        string         `json:"location"`
	Status          string         `json:"status"` // CREATED, IN_TRANSIT, COMPROMISED, DELIVERED
	CreatedAt       string         `json:"createdAt"`
	UpdatedAt       string         `json:"updatedAt"`
	TelemetryLogs   []TelemetryLog `json:"telemetryLogs"`
}

// HistoryQueryResult structure for audit trail querying
type HistoryQueryResult struct {
	TxID      string    `json:"txId"`
	Timestamp string    `json:"timestamp"`
	IsDelete  bool      `json:"isDelete"`
	Value     *Shipment `json:"value"`
}
