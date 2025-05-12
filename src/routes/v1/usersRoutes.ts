import { Router } from 'express';
import { getProfile } from '../../controllers/usersController';
import { headersMiddleware } from '../../middlewares/headersMiddleware';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     tags:
 *       - Users
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
 *     responses:
 *       200:
 *         description: User profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 phoneNumber:
 *                   type: string
 *                   example: "1234567890"
 *                 fullName:
 *                   type: string
 *                   example: "John Doe"
 *                 role:
 *                   type: string
 *                   enum: [ADMIN, USER]
 *                 isIncomplete:
 *                   type: boolean
 *                   example: false
 *                 tenantId:
 *                   type: string
 *                   example: "demo"
 *                 deviceId:
 *                   type: string
 *                   example: "device-123"
 *       400:
 *         description: Missing required headers or user context
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/profile', authMiddleware, headersMiddleware, getProfile);

export default router;
