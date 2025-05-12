import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { CacheFactory } from '../factories/cache/CacheFactory';
import { NotificationFactory } from '../factories/notification/NotificationFactory';
import { RefreshTokenRepository } from '../repositories/refreshTokenRepository.ts';
import { UserRepository } from '../repositories/userRepository';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt';
import { getApiVersionFromRequest } from '../utils/apiVersion';
import { AuthRequest } from '../middlewares/authMiddleware';
import Database from '../factories/Database';

// ✅ Initialize dependencies
const cacheService = CacheFactory.getInstance().create();
const notificationService = NotificationFactory.create();
const authService = new AuthService(cacheService, notificationService);
const userRepository = new UserRepository();
const refreshTokenRepository = new RefreshTokenRepository();

/**
 * ✅ Check if user exists before OTP verification
 */
export const checkUserController = async (req: Request, res: Response): Promise<void> => {
  const phoneNumber = req.query.phoneNumber as string;
  const tenantId = req.tenantId;

  if (!phoneNumber || !tenantId) {
    res.status(400).json({ message: 'Phone number and tenantId required.' });
    return;
  }

  try {
    const user = await userRepository.findByPhone(phoneNumber, tenantId);
    res.json({ exists: !!user });
  } catch (error) {
    console.error(`❌ Error checking user existence:`, error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

/**
 * ✅ Send OTP for login/registration
 */
export const sendOtpController = async (req: AuthRequest, res: Response): Promise<void> => {
  const { phoneNumber } = req.body;
  const tenantId = req.tenantId;
  const deviceId = req.deviceId;
  
  if (!phoneNumber || !deviceId || !tenantId) {
    res.status(400).json({ message: 'Phone number, tenantId and deviceId required.' });
    return;
  }

  try {
    await authService.sendOTP(phoneNumber, tenantId, deviceId);
    res.json({ message: 'OTP sent successfully.' });
  } catch (error) {
    console.error(`❌ Failed to send OTP:`, error);
    res.status(500).json({ message: 'Failed to send OTP.' });
  }
};

/**
 * ✅ Verify OTP and log in user (or create user if new)
 */
export const verifyOtpController = async (req: AuthRequest, res: Response): Promise<void> => {
  const { phoneNumber, otp } = req.body;
  const tenantId = req.tenantId;
  const deviceId = req.deviceId;

  if (!phoneNumber || !otp || !deviceId || !tenantId) {
    res.status(400).json({ message: 'Phone number, OTP, deviceId and tenantId required.' });
    return;
  }

  try {
    const isVerified = await authService.verifyOTP(phoneNumber, otp, tenantId);
    if (!isVerified) {
      res.status(400).json({ message: 'Invalid or expired OTP.' });
      return;
    }

    await Database.getInstance().$transaction(async (tx: any) => {
      let user = await userRepository.findByPhone(phoneNumber, tenantId, tx);
      if (!user) {
        user = await userRepository.createUser(phoneNumber, tenantId, 'USER', tx);
      }

      const accessToken = generateAccessToken({
        userId: user.id,
        phoneNumber: user.phoneNumber,
        tenantId: user.tenantId,
        role: user.role,
      });

      const refreshToken = generateRefreshToken({ userId: user.id, deviceId });

      await refreshTokenRepository.save(user.id, deviceId, refreshToken, tx);

      const apiVersion = getApiVersionFromRequest(req);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: `/api/${apiVersion}/auth/token/refresh`,
      });

      res.json({
        accessToken,
        user: {
          phoneNumber: user.phoneNumber,
          fullName: user.fullName,
          role: user.role,
          isIncomplete: user.isIncomplete,
        },
      });
    });
  } catch (error) {
    console.error(`❌ Error verifying OTP:`, error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

/**
 * ✅ Update user details (Submit full name)
 */
export const updateUserController = async (req: AuthRequest, res: Response): Promise<void> => {
  const { fullName } = req.body;
  const userId = req.user?.userId;
  const tenantId = req.tenantId;
  const deviceId = req.deviceId;

  if (!userId || !tenantId || !deviceId) {
    res.status(401).json({ message: 'Unauthorized request.' });
    return;
  }

  if (!fullName) {
    res.status(400).json({ message: 'Full name is required.' });
    return;
  }

  try {
    await Database.getInstance().$transaction(async (tx: any) => {
      const user = await userRepository.updateUserFullName(userId, fullName, tx);
      await refreshTokenRepository.deleteByDevice(userId, deviceId, tx);
      
      const accessToken = generateAccessToken({
        userId: user.id,
        phoneNumber: user.phoneNumber,
        tenantId: user.tenantId,
        role: user.role,
      });

      const refreshToken = generateRefreshToken({ userId: user.id, deviceId });

      await refreshTokenRepository.save(user.id, deviceId, refreshToken, tx);

      const apiVersion = getApiVersionFromRequest(req);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: `/api/${apiVersion}/auth/token/refresh`,
      });

      res.json({
        accessToken,
        user: {
          phoneNumber: user.phoneNumber,
          fullName: user.fullName,
          role: user.role,
          isIncomplete: false,
        },
      });
    });
  } catch (error) {
    console.error(`❌ Error updating user profile:`, error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

export const refreshTokenController = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    // ✅ Decode the refresh token
    const decoded = verifyToken(refreshToken, true);

    // ✅ Check if refresh token exists in DB
    const storedToken = await refreshTokenRepository.findByToken(refreshToken);
    if (!storedToken) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // ✅ Fetch latest user details
    const user = await userRepository.findById(decoded.userId);

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // ✅ Generate a new access token with updated role
    const newAccessToken = generateAccessToken({
      userId: user.id,
      phoneNumber: user.phoneNumber,
      tenantId: user.tenantId,
      role: user.role,
    });

    res.json({ accessToken: newAccessToken });

  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};