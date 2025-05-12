import { Request, Response, NextFunction } from 'express';

export const headersMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const tenantId = req.header('X-Tenant-ID');
  const deviceId = req.header('X-Device-ID');

  if (!tenantId) {
    res.status(400).json({ message: "Tenant ID is required." });
    return;
  }

  if (!deviceId) {
    res.status(400).json({ message: "Device ID is required." });
    return;
  }

  req.tenantId = tenantId;
  req.deviceId = deviceId;

  next();
};
