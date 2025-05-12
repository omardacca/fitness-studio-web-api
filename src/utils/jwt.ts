import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export function generateAccessToken(payload: { userId: string; phoneNumber: string; tenantId: string; role: string }): string {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(payload: { userId: string; deviceId: string }): string {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string, isRefresh = false): { userId: string; phoneNumber: string; tenantId: string; role?: string } {
  return jwt.verify(token, isRefresh ? REFRESH_TOKEN_SECRET : ACCESS_TOKEN_SECRET) as any;
}
