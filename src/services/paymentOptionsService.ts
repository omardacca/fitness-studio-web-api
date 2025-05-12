import { paymentOptionsRepository } from '../repositories/paymentOptionsRepository';

export const fetchPaymentOptions = async () => {
  return paymentOptionsRepository.findAll();
};
