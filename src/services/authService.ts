import { ICache } from '../factories/cache/ICache';
import { INotification } from '../factories/notification/NotificationFactory';

export class AuthService {
  private cache: ICache;
  private notification: INotification;

  constructor(cache: ICache, notification: INotification) {
    this.cache = cache;
    this.notification = notification;
  }

  /**
   * ✅ Send OTP (with rate limiting)
   */
  async sendOTP(phoneNumber: string, tenantId: string, deviceId: string): Promise<void> {
    const redisKey = `otp:${tenantId}:${phoneNumber}`;
    const rateLimitKey = `otp_rate_limit:${tenantId}:${phoneNumber}:${deviceId}`;

    // ✅ Check OTP Rate Limit
    const attempts = await this.cache.get(rateLimitKey);
    if (attempts && parseInt(attempts) >= 3) {
      throw new Error('Too many OTP requests. Try again later.');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.cache.set(redisKey, otp, 300); // OTP expires in 5 minutes
    await this.cache.set(rateLimitKey, (attempts ? parseInt(attempts) + 1 : 1).toString(), 300);

    await this.notification.send(phoneNumber, `Your OTP code is ${otp}`);
  }

  /**
   * ✅ Verify OTP
   */
  async verifyOTP(phoneNumber: string, otp: string, tenantId: string): Promise<boolean> {
    const redisKey = `otp:${tenantId}:${phoneNumber}`;
    const storedOtp = await this.cache.get(redisKey);

    if (storedOtp && storedOtp === otp) {
      await this.cache.del(redisKey);
      return true;
    }

    return false;
  }
}
