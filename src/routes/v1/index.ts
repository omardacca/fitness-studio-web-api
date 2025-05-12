import { Router } from 'express';
import authRoutes from './authRoutes';
import courseTypeRoutes from './courseTypeRoutes';
import { headersMiddleware } from '../../middlewares/headersMiddleware';
import instructorRoutes from './instructors';
import sessionsRoutes from './sessionsRoutes';
import bookingsRoutes from './bookingsRoutes';
import waitingListRoutes from './waitingListRoutes';
import membershipsRoutes from './membershipsRoutes';
import userMemberships from './userMembershipsRoutes';
import usersRoutes from './usersRoutes';
import ordersRoutes from './ordersRoutes';
import paymentRoutes from './paymentRoutes';
// import { authorize } from '../../middlewares/rbacMiddleware';
// import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

router.use('/auth', authRoutes);
router.use('/courses', courseTypeRoutes);
router.use('/instructors', instructorRoutes);
router.use('/sessions', sessionsRoutes);
router.use('/bookings', bookingsRoutes);
router.use('/waiting-list', waitingListRoutes);
router.use('/memberships', membershipsRoutes);
router.use('/user-memberships', userMemberships);
router.use('/users', usersRoutes);
router.use('/orders', ordersRoutes);
router.use('/payment-options', paymentRoutes);
// router.get('/admin-data', authorize(['ADMIN']), someAdminController); // exmaple - ✅ Only ADMINs can access

export default router;
