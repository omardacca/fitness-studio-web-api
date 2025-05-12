import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getWaitingListByUser = async (userId: string, tenantId: string) => {
  return await prisma.waitingList.findMany({
    where: {
      userId,
      session: {
        tenantId,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const insertWaitingListEntry = async (userId: string, sessionId: number) => {
  return await prisma.waitingList.create({
    data: {
      userId,
      sessionId,
    },
  });
};

export const deleteWaitingListEntry = async (userId: string, waitingListId: string) => {
  const found = await prisma.waitingList.findUnique({
    where: { id: waitingListId },
  });

  if (!found || found.userId !== userId) {
    throw new Error('Not found or access denied');
  }

  await prisma.waitingList.delete({
    where: { id: waitingListId },
  });
};