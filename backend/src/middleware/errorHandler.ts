import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger';
import { sendError } from '../utils/response';

export const errorHandler = (
  err: any,
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

  const message = err.message || 'An unexpected internal server error occurred';
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const statusCode = err.statusCode || 500;

  return sendError(res, message, code, statusCode);
};
