import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { headersMiddleware } from '../../middlewares/headersMiddleware';
import { createMembership, listActiveMemberships } from '../../controllers/membershipsController';

const router = Router();

/**
 * @swagger
 * /memberships:
 *   get:
 *     summary: List all active memberships
 *     tags:
 *       - Memberships
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
 */
router.get('/', authMiddleware, headersMiddleware, listActiveMemberships);

/**
 * @swagger
 * /memberships:
 *   post:
 *     summary: Create a new membership
 *     tags:
 *       - Memberships
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
 *               - title
 *               - price
 *               - components
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: integer
 *               components:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     courseTypeId:
 *                       type: integer
 *                     count:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Membership created
 */
router.post('/', authMiddleware, headersMiddleware, createMembership);



export default router;
