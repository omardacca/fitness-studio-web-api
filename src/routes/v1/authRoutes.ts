import { Router } from "express";
import { headersMiddleware } from "../../middlewares/headersMiddleware";
import {
  sendOtpController,
  verifyOtpController,
  checkUserController,
  updateUserController,
  refreshTokenController,
} from "../../controllers/authController";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * /auth/users/exists:
 *   get:
 *     summary: Check if user exists
 *     parameters:
 *       - in: query
 *         name: phoneNumber
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: X-Tenant-ID
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: X-Device-ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User existence check successful
 */
router.get("/users/exists", headersMiddleware, checkUserController);

/**
 * @swagger
 * /auth/otp:
 *   post:
 *     summary: Send OTP for login/registration
 *     parameters:
 *       - in: header
 *         name: X-Tenant-ID
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: X-Device-ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */
router.post("/otp", headersMiddleware, sendOtpController);

/**
 * @swagger
 * /auth/otp/verification:
 *   post:
 *     summary: Verify OTP and authenticate user
 *     parameters:
 *       - in: header
 *         name: X-Tenant-ID
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: X-Device-ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 */
router.post("/otp/verification", headersMiddleware, verifyOtpController);

/**
 * @swagger
 * /auth/users/me:
 *   patch:
 *     summary: Update user details (Full Name)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: X-Tenant-ID
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: X-Device-ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *     responses:
 *       200:
 *         description: User details updated
 */
router.patch("/users/me", authMiddleware, headersMiddleware, updateUserController);

/**
 * @swagger
 * /auth/token/refresh:
 *   post:
 *     summary: Refresh access token
 *     parameters:
 *       - in: header
 *         name: X-Tenant-ID
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: X-Device-ID
 *         required: true
 *         schema:
 *           type: string
 *       - in: cookie
 *         name: refreshToken
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Access token refreshed
 */
router.post("/token/refresh", headersMiddleware, refreshTokenController);

export default router;
