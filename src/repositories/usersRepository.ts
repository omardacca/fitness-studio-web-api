import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getUserById = async (userId: string, tenantId: string) => {
  return await prisma.user.findFirst({
    where: {
      id: userId,
      tenantId,
    },
    select: {
      phoneNumber: true,
      fullName: true,
      role: true,
      isIncomplete: true,
    },
  });
};
