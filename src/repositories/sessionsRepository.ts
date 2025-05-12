import { PrismaClient } from '@prisma/client';
import { startOfDay, endOfDay } from 'date-fns';

const prisma = new PrismaClient();

interface FilterOptions {
  courseTypeId: number | null;
  dateTime: string;
  instructorId: string | null;
  tenantId: string;
}

export const getSessionsForDay = async ({
  dateTime,
  courseTypeId,
  instructorId,
  tenantId,
}: FilterOptions) => {
  const targetDate = new Date(dateTime);

  return await prisma.session.findMany({
    where: {
      tenantId,
      dateTime: {
        gte: startOfDay(targetDate),
        lte: endOfDay(targetDate),
      },
      ...(courseTypeId && { courseTypeId }),
      ...(instructorId && { instructorId }),
    },
    include: {
      instructor: true,
    },
    orderBy: {
      dateTime: 'asc',
    },
  });
};

export const getSessionById = async (sessionId: number) => {
  return await prisma.session.findUnique({
    where: { id: sessionId },
    select: {
      id: true,
      courseTypeId: true,
    },
  });
};


export const findAvailableCourses = async (tenantId: string) => {
  return prisma.session.groupBy({
    by: ['courseTypeId'],
    where: {
      tenantId,
      dateTime: {
        gte: new Date(), // only future sessions
      },
      takenSeats: {
        lt: prisma.session.fields.totalSeats, // seats available
      },
    },
    _count: {
      courseTypeId: true,
    },
  });
};