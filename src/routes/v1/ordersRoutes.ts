import { Router } from 'express';
import { createOrderController } from '../../controllers/ordersController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { headersMiddleware } from '../../middlewares/headersMiddleware';

const router = Router();

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order and assign a membership to the user
 *     tags:
 *       - Orders
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
 *               - paymentMethod
 *             properties:
 *               membershipId:
 *                 type: string
 *                 example: "mem_123"
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, credit]
 *                 example: cash
 *     responses:
 *       201:
 *         description: Order created and membership assigned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderId:
 *                   type: integer
 *                   example: 1
 *                 status:
 *                   type: string
 *                   example: "PAID"
 *                 membership:
 *                   type: object
 *                   properties:
 *                     membershipId:
 *                       type: string
 *                       example: "mem_123"
 *                     title:
 *                       type: string
 *                       example: "Starter Membership"
 *                     price:
 *                       type: integer
 *                       example: 15000
 *                 assigned:
 *                   type: boolean
 *                   example: true
 *                 userMembershipId:
 *                   type: integer
 *                   example: 99
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/', authMiddleware, headersMiddleware, createOrderController);

export default router;
