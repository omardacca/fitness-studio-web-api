import Database from '../factories/Database';

const prisma = Database.getInstance();

export class UserRepository {
  
  async findById(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async findByPhone(phoneNumber: string, tenantId: string, transaction?: any) {
    const db = transaction ?? prisma;
    return db.user.findUnique({
      where: {
        phoneNumber_tenantId: {
          phoneNumber,
          tenantId,
        },
      },
    });    
  }

  async createUser(phoneNumber: string, tenantId: string, role = 'USER', transaction?: any) {
    const db = transaction ?? prisma;
    return db.user.create({
      data: { phoneNumber, tenantId, role, fullName: null, isIncomplete: true },
    });
  }

  async updateUserFullName(userId: string, fullName: string, transaction?: any) {
    const db = transaction ?? prisma;
    return db.user.update({
      where: { id: userId },
      data: { fullName, isIncomplete: false },
    });
  }
}
