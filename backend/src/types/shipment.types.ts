export interface TelemetryLog {
  timestamp: string;
  temperature: number;
  humidity: number;
  location: string;
  recordedBy: string;
}

export interface Shipment {
  docType: string;
  shipmentID: string;
  productName: string;
  manufacturer: string;
  owner: string;
  carrier: string;
  recipient: string;
  minTemp: number;
  maxTemp: number;
  currentTemp: number;
  currentHumidity: number;
  location: string;
  status: 'CREATED' | 'IN_TRANSIT' | 'COMPROMISED' | 'DELIVERED';
  createdAt: string;
  updatedAt: string;
  telemetryLogs: TelemetryLog[];
}

export interface HistoryQueryResult {
  txId: string;
  timestamp: string;
  isDelete: boolean;
  value: Shipment;
}
