import { Request, Response } from 'express';
import { createOrderWithMembership } from '../services/ordersService';
import { formatOrder } from '../formatters/ordersFormatter';
import Database from '../factories/Database';

export const createOrderController = async (req: Request, res: Response) => {
  const { membershipId, paymentMethodId } = req.body;
  const userId = req.user?.userId;

  if (!userId || !membershipId || !paymentMethodId) {
    res.status(400).json({ message: 'Missing required fields.' });
    return;
  }

  try {
    await Database.getInstance().$transaction(async (tx) => {
      const { order, userMembership } = await createOrderWithMembership({
        userId,
        membershipId,
        paymentMethodId,
        tx,
      });

    res.status(201).json(formatOrder(order, userMembership));
    });
  } catch (error) {
    console.error('❌ Failed to create order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};