import { Request, Response, NextFunction } from 'express';
import { shipmentService, ShipmentService } from '../services/shipment.service';
import { sendSuccess, sendError } from '../utils/response';
import { createShipmentSchema, recordTelemetrySchema, shipmentIDParamSchema } from '../validators/shipment.validator';

export class ShipmentController {
  constructor(private service: ShipmentService = shipmentService) {}

  public createShipment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedData = createShipmentSchema.parse(req.body);
      const result = await this.service.createShipment(validatedData);
      sendSuccess(res, result, 201);
    } catch (error) {
      next(error);
    }
  };

  public acceptShipment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = shipmentIDParamSchema.parse(req.params);
      const result = await this.service.acceptShipment(id);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };

  public recordTelemetry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = shipmentIDParamSchema.parse(req.params);
      const telemetryData = recordTelemetrySchema.parse(req.body);
      const result = await this.service.recordTelemetry({ shipmentID: id, ...telemetryData });
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };

  public receiveShipment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = shipmentIDParamSchema.parse(req.params);
      const result = await this.service.receiveShipment(id);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };

  public getShipment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = shipmentIDParamSchema.parse(req.params);
      const result = await this.service.getShipment(id);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };

  public getShipmentHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = shipmentIDParamSchema.parse(req.params);
      const result = await this.service.getShipmentHistory(id);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };

  public getAllShipments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.getAllShipments();
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };
}

export const shipmentController = new ShipmentController();
