import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { headersMiddleware } from '../../middlewares/headersMiddleware';
import { getAvailableSessions } from '../../controllers/sessionsController';
import { getAvailableCoursesController } from '../../controllers/sessionsController';


const router = Router();

/**
 * @swagger
 * /sessions:
 *   get:
 *     summary: Get available sessions
 *     description: Returns a list of sessions filtered by course type, instructor, and date.
 *     tags:
 *       - Sessions
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
 *       - in: query
 *         name: courseTypeId
 *         schema:
 *           type: integer
 *         description: Filter by Course Type ID (optional)
 *       - in: query
 *         name: instructorId
 *         schema:
 *           type: string
 *         description: Filter by Instructor ID (optional)
 *       - in: query
 *         name: dateTime
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date string to fetch sessions for (e.g. 2025-03-30)
 *     responses:
 *       200:
 *         description: List of available sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sessionId:
 *                     type: integer
 *                   courseTypeId:
 *                     type: integer
 *                   instructorId:
 *                     type: string
 *                   instructorName:
 *                     type: string
 *                   instructorImageUrl:
 *                     type: string
 *                     nullable: true
 *                   duration:
 *                     type: integer
 *                   dateTime:
 *                     type: string
 *                     format: date-time
 *                   takenSeats:
 *                     type: integer
 *                   totalSeats:
 *                     type: integer
 *       400:
 *         description: Missing or invalid dateTime
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware, headersMiddleware, getAvailableSessions);

/**
 * @swagger
 * /sessions/available-courses:
 *   get:
 *     summary: Get list of available course types for tenant
 *     tags:
 *       - Sessions
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
 *         description: List of available courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 availableCourses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       courseTypeId:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       imageUrl:
 *                         type: string
 *                       availableCoursesCount:
 *                         type: integer
 */
router.get('/available-courses', authMiddleware, headersMiddleware, getAvailableCoursesController);

export default router;
