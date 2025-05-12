import { Request, Response } from 'express';
import { createNewMembership, listEnabledMemberships } from '../services/membershipsService';

export const listActiveMemberships = async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = req.tenantId;

    if (!tenantId) {
      res.status(400).json({ message: 'Missing tenantId' });
      return;
    }

    const memberships = await listEnabledMemberships(tenantId);
    res.json(memberships);
  } catch (error) {
    console.error('Failed to list memberships:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createMembership = async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = req.tenantId;
    const { title, price, components } = req.body;

    if (!tenantId || !title || !price || !Array.isArray(components)) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const result = await createNewMembership({ tenantId, title, price, components });
    res.status(201).json(result);
  } catch (error) {
    console.error('Failed to create membership:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
