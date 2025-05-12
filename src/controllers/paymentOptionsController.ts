import { Request, Response } from 'express';
import { fetchPaymentOptions } from '../services/paymentOptionsService';
import { formatPaymentOptions } from '../formatters/paymentOptionFormatter';

export const getPaymentOptions = async (req: Request, res: Response) => {
  try {
    const items = await fetchPaymentOptions();
    res.json(formatPaymentOptions(items));
  } catch (error) {
    console.error('Failed to fetch payment options:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
