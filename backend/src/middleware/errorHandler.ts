import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger';
import { sendError } from '../utils/response';

export interface AppError extends Error {
  code?: string;
  statusCode?: number;
}

export const errorHandler = (
  err: AppError | ZodError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  logger.error('Unhandled API Error:', err);

  if (err instanceof ZodError) {
    return sendError(
      res,
      'Validation Error: Invalid request body or parameter format',
      'VALIDATION_ERROR',
      400,
      err.errors
    );
  }

  const appErr = err as AppError;
  const message = appErr.message || 'An unexpected internal server error occurred';
  const code = appErr.code || 'INTERNAL_SERVER_ERROR';
  const statusCode = appErr.statusCode || 500;

  return sendError(res, message, code, statusCode);
};
