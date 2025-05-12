// src/routes/v1/instructors.ts
import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { headersMiddleware } from '../../middlewares/headersMiddleware';
import { listInstructorsController } from '../../controllers/instructorController';

const router = Router();

/**
 * @swagger
 * /instructors:
 *   get:
 *     summary: Get list of instructors for tenant
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
 *         description: List of instructors
 */
router.get('/', authMiddleware, headersMiddleware, listInstructorsController);

export default router;
