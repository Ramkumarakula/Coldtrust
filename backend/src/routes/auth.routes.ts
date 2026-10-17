import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, AuthenticatedUser } from '../middleware/authMiddleware';
import { sendSuccess, sendError } from '../utils/response';

const router = Router();

// In-memory demo credentials for consortium roles
const DEMO_USERS: Record<string, { password: string; role: 'Manufacturer' | 'Transport' | 'Retailer'; mspId: string; name: string }> = {
  manufacturer: {
    password: 'Password123!',
    role: 'Manufacturer',
    mspId: 'ManufacturerMSP',
    name: 'BioPharma Corp Admin',
  },
  transport: {
    password: 'Password123!',
    role: 'Transport',
    mspId: 'TransportMSP',
    name: 'SwiftCold Logistics Dispatcher',
  },
  retailer: {
    password: 'Password123!',
    role: 'Retailer',
    mspId: 'RetailerMSP',
    name: 'Apex Central Pharmacy Pharmacist',
  },
};

router.post('/login', (req: Request, res: Response): void => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    sendError(res, 'Username and password are required', 'MISSING_CREDENTIALS', 400);
    return;
  }

  const lookupKey = String(username).toLowerCase().trim();
  const user = DEMO_USERS[lookupKey];

  if (!user || user.password !== String(password)) {
    sendError(res, 'Invalid username or password', 'INVALID_CREDENTIALS', 401);
    return;
  }

  const payload: AuthenticatedUser = {
    username: lookupKey,
    role: user.role,
    mspId: user.mspId,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

  sendSuccess(res, {
    token,
    user: {
      ...payload,
      name: user.name,
    },
  });
});

router.get('/me', (req: Request, res: Response): void => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'Not authenticated', 'UNAUTHORIZED', 401);
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    sendSuccess(res, { user: decoded });
  } catch {
    sendError(res, 'Invalid token', 'INVALID_TOKEN', 401);
  }
});

export default router;
