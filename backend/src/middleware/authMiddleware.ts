import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response';

export const JWT_SECRET = process.env.JWT_SECRET || 'coldtrust-enterprise-coldchain-secret-key-2026';

export interface AuthenticatedUser {
  username: string;
  role: 'Manufacturer' | 'Transport' | 'Retailer';
  mspId: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'Authentication required. Missing or malformed Bearer token.', 'UNAUTHORIZED', 401);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err: any) {
    sendError(res, 'Invalid or expired authentication token.', 'INVALID_TOKEN', 401);
    return;
  }
};
