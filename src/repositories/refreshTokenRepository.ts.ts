import Database from '../factories/Database';

const prisma = Database.getInstance();

export class RefreshTokenRepository {
  async save(userId: string, deviceId: string, token: string, transaction?: any) {
    const db = transaction ?? prisma;

    return db.refreshToken.upsert({
      where: {
        userId_deviceId: { userId, deviceId },
      },
      update: {
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      create: {
        userId,
        deviceId,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  async deleteByDevice(userId: string, deviceId: string, transaction?: any) {
    const db = transaction ?? prisma;
    return db.refreshToken.deleteMany({
      where: { userId, deviceId },
    });
  }

  async findByToken(token: string) {
    return await prisma.refreshToken.findUnique({
      where: { token },
    });
  }

  async deleteByUserId(userId: string) {
    return await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }
}
