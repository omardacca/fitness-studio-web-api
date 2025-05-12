import { Request, Response } from 'express';
import { fetchUserWaitingList, createWaitingListEntry, removeWaitingListEntry } from '../services/waitingListService';

export const getMyWaitingList = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const tenantId = req.tenantId;

    if (!userId || !tenantId) {
      res.status(400).json({ message: 'Missing userId or tenantId' });
      return;
    }

    const list = await fetchUserWaitingList(userId, tenantId);
    res.json(list);
  } catch (error) {
    console.error('Failed to get waiting list:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const joinWaitingList = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { sessionId } = req.body;

    if (!userId || !sessionId) {
      res.status(400).json({ message: 'Missing userId or sessionId' });
      return;
    }

    const entry = await createWaitingListEntry(userId, sessionId);
    res.status(201).json(entry);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({ message: 'Already on waiting list for this session' });
    } else {
      console.error('Failed to join waiting list:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const leaveWaitingList = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { waitlistId } = req.params;

    if (!userId || !waitlistId) {
      res.status(400).json({ message: 'Missing userId or waitingListId' });
      return;
    }

    await removeWaitingListEntry(userId, waitlistId);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === 'Not found or access denied') {
      res.status(404).json({ message: error.message });
    } else {
      console.error('Failed to leave waiting list:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};