import { Request, Response } from 'express';
import { createUserMembership, fetchActiveMemberships } from '../services/userMembershipsService';
import { formatUserMembershipsForAppDisplay } from '../formatters/userMembershipsFormatter';

export const assignMembershipToUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { membershipId } = req.body;

    if (!userId || !membershipId) {
      res.status(400).json({ message: 'Missing userId or membershipId' });
      return;
    }

    const result = await createUserMembership({ userId, membershipId });
    res.status(201).json(result);
  } catch (error) {
    console.error('Failed to assign membership:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getActiveUserMemberships = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(400).json({ message: 'Missing userId' });
      return;
    }

    const rawUsages = await fetchActiveMemberships(userId);
    const formatted = formatUserMembershipsForAppDisplay(rawUsages);

    res.json({ memberships: formatted });
  } catch (error) {
    console.error('Failed to get active memberships:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};