import { z } from 'zod';

export const createShipmentSchema = z.object({
  shipmentID: z.string().min(3, 'Shipment ID must be at least 3 characters'),
  productName: z.string().min(2, 'Product name is required'),
  manufacturer: z.string().min(2, 'Manufacturer name is required'),
  carrier: z.string().min(2, 'Carrier name is required'),
  recipient: z.string().min(2, 'Recipient name is required'),
  minTemp: z.number().default(2.0),
  maxTemp: z.number().default(4.0),
});

export const recordTelemetrySchema = z.object({
  temperature: z.number({ required_error: 'Temperature is required' }),
  humidity: z.number({ required_error: 'Humidity is required' }),
  location: z.string().min(2, 'Location is required'),
});

export const shipmentIDParamSchema = z.object({
  id: z.string().min(1, 'Shipment ID is required'),
});
