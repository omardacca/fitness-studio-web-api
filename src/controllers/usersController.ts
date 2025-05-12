import { Request, Response } from 'express';
import { getUserProfile } from '../services/usersService';

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const tenantId = req.headers['x-tenant-id'] as string;
    const deviceId = req.headers['x-device-id'] as string;

    if (!userId || !tenantId || !deviceId) {
      res.status(400).json({ message: 'Missing userId, tenantId, or deviceId' });
      return;
    }

    const profile = await getUserProfile({ userId, tenantId });
    res.json(profile);
  } catch (error) {
    console.error('[Profile] Failed to load user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
