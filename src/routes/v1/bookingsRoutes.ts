import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { headersMiddleware } from '../../middlewares/headersMiddleware';
import { getMyBookings, bookSession, cancelBooking, getUpcomingUserSessions } from '../../controllers/bookingsController';

const router = Router();

/**
 * @swagger
 * /bookings/me:
 *   get:
 *     summary: Get all bookings for the current user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: X-Tenant-ID
 *         required: true
 *         schema:
 *           type: string
 *           example: demo
 *       - in: header
 *         name: X-Device-ID
 *         required: true
 *         schema:
 *           type: string
 *           example: demo
 *     tags:
 *       - Bookings
 *     responses:
 *       200:
 *         description: List of user bookings
 */
router.get('/me', authMiddleware, headersMiddleware, getMyBookings);

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Book a session
 *     parameters:
 *       - in: header
 *         name: X-Tenant-ID
 *         required: true
 *         schema:
 *           type: string
 *           example: demo
 *       - in: header
 *         name: X-Device-ID
 *         required: true
 *         schema:
 *           type: string
 *           example: demo
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *             properties:
 *               sessionId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Booking created
 *       409:
 *         description: Already booked
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, headersMiddleware, bookSession);

/**
 * @swagger
 * /bookings/{bookingId}:
 *   delete:
 *     summary: Cancel a booking
 *     description: Deletes a user's booking and updates the session's takenSeats count.
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: X-Tenant-ID
 *         required: true
 *         schema:
 *           type: string
 *           example: demo
 *       - in: header
 *         name: X-Device-ID
 *         required: true
 *         schema:
 *           type: string
 *           example: demo
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the booking to cancel
 *     responses:
 *       204:
 *         description: Booking successfully cancelled (no content)
 *       400:
 *         description: Missing or invalid input
 *       404:
 *         description: Booking not found or access denied
 *       500:
 *         description: Internal server error
 */
router.delete('/:bookingId', authMiddleware, headersMiddleware, cancelBooking);

/**
 * @swagger
 * /bookings/upcoming:
 *   get:
 *     summary: Get user's upcoming booked sessions
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: X-Device-ID
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: X-Tenant-ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of upcoming booked sessions
 */
router.get('/upcoming', authMiddleware, headersMiddleware, getUpcomingUserSessions);

export default router;
