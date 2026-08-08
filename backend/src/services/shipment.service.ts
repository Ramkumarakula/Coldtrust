import { shipmentRepository, ShipmentRepository } from '../repositories/shipment.repository';
import { HistoryQueryResult, Shipment } from '../types/shipment.types';
import { logger } from '../config/logger';

export class ShipmentService {
  constructor(private repo: ShipmentRepository = shipmentRepository) {}

  public async createShipment(data: {
    shipmentID: string;
    productName: string;
    manufacturer: string;
    carrier: string;
    recipient: string;
    minTemp: number;
    maxTemp: number;
  }): Promise<Shipment> {
    await this.repo.createShipment(
      data.shipmentID,
      data.productName,
      data.manufacturer,
      data.carrier,
      data.recipient,
      data.minTemp,
      data.maxTemp
    );
    return await this.repo.getShipment(data.shipmentID);
  }

  public async acceptShipment(shipmentID: string): Promise<Shipment> {
    await this.repo.acceptShipment(shipmentID);
    return await this.repo.getShipment(shipmentID);
  }

  public async recordTelemetry(data: {
    shipmentID: string;
    temperature: number;
    humidity: number;
    location: string;
  }): Promise<Shipment> {
    await this.repo.recordTelemetry(
      data.shipmentID,
      data.temperature,
      data.humidity,
      data.location
    );
    const updatedShipment = await this.repo.getShipment(data.shipmentID);
    if (updatedShipment.status === 'COMPROMISED') {
      logger.warn(`AUTOMATED BREACH TRIGGERED: Shipment ${data.shipmentID} compromised! Temp: ${data.temperature}°C (Max: ${updatedShipment.maxTemp}°C)`);
    }
    return updatedShipment;
  }

  public async receiveShipment(shipmentID: string): Promise<Shipment> {
    await this.repo.receiveShipment(shipmentID);
    return await this.repo.getShipment(shipmentID);
  }

  public async getShipment(shipmentID: string): Promise<Shipment> {
    return await this.repo.getShipment(shipmentID);
  }

  public async getShipmentHistory(shipmentID: string): Promise<HistoryQueryResult[]> {
    return await this.repo.getShipmentHistory(shipmentID);
  }

  public async getAllShipments(): Promise<Shipment[]> {
    return await this.repo.getAllShipments();
  }
}

export const shipmentService = new ShipmentService();
