import { Router } from 'express';
import { getMyWaitingList, joinWaitingList, leaveWaitingList } from '../../controllers/waitingListController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { headersMiddleware } from '../../middlewares/headersMiddleware';

const router = Router();

/**
 * @swagger
 * /waiting-list/me:
 *   get:
 *     summary: Get current user's waiting list entries
 *     tags:
 *       - Waiting List
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
 *         description: List of sessions the user is waitlisted for
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   waitingListId:
 *                     type: string
 *                   sessionId:
 *                     type: integer
 *       400:
 *         description: Missing userId or tenantId
 *       500:
 *         description: Internal server error
 */
router.get('/me', authMiddleware, headersMiddleware, getMyWaitingList);

/**
 * @swagger
 * /waiting-list:
 *   post:
 *     summary: Join a session's waiting list
 *     tags:
 *       - Waiting List
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
 *               - sessionId
 *             properties:
 *               sessionId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Added to waiting list
 *       409:
 *         description: Already on waiting list
 */
router.post('/', authMiddleware, headersMiddleware, joinWaitingList);

/**
 * @swagger
 * /waiting-list/{id}:
 *   delete:
 *     summary: Remove self from waiting list
 *     tags:
 *       - Waiting List
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
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Waiting list entry ID
 *     responses:
 *       204:
 *         description: Removed from waiting list
 *       404:
 *         description: Entry not found or not authorized
 */
router.delete('/:waitlistId', authMiddleware, headersMiddleware, leaveWaitingList);

export default router;
