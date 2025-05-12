import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { headersMiddleware } from '../../middlewares/headersMiddleware';
import { assignMembershipToUser, getActiveUserMemberships } from '../../controllers/userMembershipsController';

const router = Router();

/**
 * @swagger
 * /user-memberships:
 *   post:
 *     summary: Assign a membership to a user
 *     tags:
 *       - User Memberships
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - membershipId
 *             properties:
 *               membershipId:
 *                 type: string
 *     responses:
 *       201:
 *         description: User membership assigned
 */
router.post('/', authMiddleware, headersMiddleware, assignMembershipToUser);

/**
 * @swagger
 * /user-memberships/active:
 *   get:
 *     summary: Get all active memberships for the logged-in user
 *     description: Returns a list of active user memberships that have remaining usage for at least one course type.
 *     tags:
 *       - User Memberships
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
 *         description: List of active memberships
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userMembershipId:
 *                     type: string
 *                   membershipId:
 *                     type: string
 *                   membershipTitle:
 *                     type: string
 *                   courseTypeId:
 *                     type: integer
 *                   usedCount:
 *                     type: integer
 *                   allowedCount:
 *                     type: integer
 *                   remainingCount:
 *                     type: integer
 */
router.get('/active', authMiddleware, headersMiddleware, getActiveUserMemberships);

export default router;
