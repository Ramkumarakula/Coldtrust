import { Request, Response, NextFunction } from 'express';
import { healthService, HealthService } from '../services/health.service';
import { sendSuccess } from '../utils/response';

export class HealthController {
  constructor(private service: HealthService = healthService) {}

  public getSystemHealth = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = this.service.getSystemHealth();
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  };

  public getBlockchainHealth = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.getBlockchainHealth();
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  };

  public getDatabaseHealth = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.getDatabaseHealth();
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  };
}

export const healthController = new HealthController();
