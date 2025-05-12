import { Router } from 'express';
import { listCourseTypesController } from '../../controllers/courseTypeController';
import { headersMiddleware } from '../../middlewares/headersMiddleware';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get list of course types for tenant
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
 *         description: List of course types
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, headersMiddleware, listCourseTypesController);

export default router;
