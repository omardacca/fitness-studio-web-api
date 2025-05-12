import { Router } from 'express';
import { getPaymentOptions } from '../../controllers/paymentOptionsController';

const router = Router();

router.get('/', getPaymentOptions);

export default router;
