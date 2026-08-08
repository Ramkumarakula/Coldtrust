import { fabricGateway } from '../blockchain/fabricGateway';
import { HistoryQueryResult, Shipment } from '../types/shipment.types';
import { logger } from '../config/logger';

export class ShipmentRepository {
  public async createShipment(
    shipmentID: string,
    productName: string,
    manufacturer: string,
    carrier: string,
    recipient: string,
    minTemp: number,
    maxTemp: number
  ): Promise<void> {
    const contract = await fabricGateway.getContract();
    logger.info(`Submitting CreateShipment transaction for ID ${shipmentID}`);
    await contract.submitTransaction(
      'CreateShipment',
      shipmentID,
      productName,
      manufacturer,
      carrier,
      recipient,
      minTemp.toString(),
      maxTemp.toString()
    );
  }

  public async acceptShipment(shipmentID: string): Promise<void> {
    const contract = await fabricGateway.getContract();
    logger.info(`Submitting AcceptShipment transaction for ID ${shipmentID}`);
    await contract.submitTransaction('AcceptShipment', shipmentID);
  }

  public async recordTelemetry(
    shipmentID: string,
    temperature: number,
    humidity: number,
    location: string
  ): Promise<void> {
    const contract = await fabricGateway.getContract();
    logger.info(`Submitting RecordTelemetry transaction for ID ${shipmentID} (Temp: ${temperature}°C)`);
    await contract.submitTransaction(
      'RecordTelemetry',
      shipmentID,
      temperature.toString(),
      humidity.toString(),
      location
    );
  }

  public async receiveShipment(shipmentID: string): Promise<void> {
    const contract = await fabricGateway.getContract();
    logger.info(`Submitting ReceiveShipment transaction for ID ${shipmentID}`);
    await contract.submitTransaction('ReceiveShipment', shipmentID);
  }

  public async getShipment(shipmentID: string): Promise<Shipment> {
    const contract = await fabricGateway.getContract();
    const resultBytes = await contract.evaluateTransaction('GetShipment', shipmentID);
    const jsonString = Buffer.from(resultBytes).toString('utf8');
    return JSON.parse(jsonString) as Shipment;
  }

  public async getShipmentHistory(shipmentID: string): Promise<HistoryQueryResult[]> {
    const contract = await fabricGateway.getContract();
    const resultBytes = await contract.evaluateTransaction('GetShipmentHistory', shipmentID);
    const jsonString = Buffer.from(resultBytes).toString('utf8');
    return JSON.parse(jsonString) as HistoryQueryResult[];
  }

  public async getAllShipments(): Promise<Shipment[]> {
    const contract = await fabricGateway.getContract();
    const resultBytes = await contract.evaluateTransaction('GetAllShipments');
    const jsonString = Buffer.from(resultBytes).toString('utf8');
    return JSON.parse(jsonString || '[]') as Shipment[];
  }
}

export const shipmentRepository = new ShipmentRepository();
