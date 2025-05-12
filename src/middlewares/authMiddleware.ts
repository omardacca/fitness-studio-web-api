import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: { userId: string; phoneNumber: string; tenantId: string; role: string; deviceId?: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    console.debug(decoded);
    
    req.user = {
      userId: decoded?.userId,
      phoneNumber: decoded?.phoneNumber,
      tenantId: decoded?.tenantId,
      role: decoded?.role || 'USER',
      deviceId: req.body?.deviceId || req.headers["x-device-id"],
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
