import { PaymentOption } from '@prisma/client';
import { PaymentOptionsInterface } from '../types/api';

export const formatPaymentOptions = (items: PaymentOption[]): PaymentOptionsInterface[] => {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
  }));
};
