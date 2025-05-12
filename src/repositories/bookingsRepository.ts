import { resolveBestMembershipUsage } from '../utils/membershipResolver';
import { PrismaClient } from '@prisma/client';
import { CacheFactory } from '../factories/cache/CacheFactory';
import { ApiError } from '../utils/ApiError';

const cacheService = CacheFactory.getInstance().create();
const prisma = new PrismaClient();

export const getBookingsByUser = async (userId: string, tenantId: string) => {
  return await prisma.booking.findMany({
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


export const insertBooking = async (userId: string, sessionId: number, courseTypeId: number) => {
  const usage = await resolveBestMembershipUsage(userId, courseTypeId);
  if (!usage) {
    throw new ApiError(403, 'No available membership for this course');
  }

  return await prisma.$transaction(async (tx) => {
    // ✅ Check if user already booked this session
    const existing = await tx.booking.findUnique({
      where: {
        userId_sessionId: {
          userId,
          sessionId,
        },
      },
    });

    if (existing) {
      throw new ApiError(409, 'You have already booked this session');
    }

    // ✅ Check session availability
    const session = await tx.session.findUnique({
      where: { id: sessionId },
      select: {
        totalSeats: true,
        takenSeats: true,
      },
    });

    if (!session) {
      throw new ApiError(404, 'Session not found');
    }

    if (session.takenSeats >= session.totalSeats) {
      throw new ApiError(409, 'Session is fully booked');
    }

    // ✅ Create booking
    const booking = await tx.booking.create({
      data: {
        userId,
        sessionId,
        userMembershipUsageId: usage.userMembershipUsageId,
      },
    });

    // ✅ Update seat count + usage
    await tx.session.update({
      where: { id: sessionId },
      data: {
        takenSeats: { increment: 1 },
      },
    });

    await tx.userMembershipUsage.update({
      where: { id: usage.userMembershipUsageId },
      data: {
        usedCount: { increment: 1 },
      },
    });

    // ✅ Invalidate Redis cache
    await cacheService.del(`activeMemberships:${userId}`);

    return booking;
  });
};


export const cancelBooking = async (userId: string, bookingId: string) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Find booking
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        sessionId: true,
        userId: true,
        userMembershipUsageId: true,
      },
    });

    if (!booking || booking.userId !== userId) {
      throw new ApiError(404, 'Booking not found or access denied');
    }

    // 2. Delete booking
    await tx.booking.delete({
      where: { id: bookingId },
    });

    // 3. Decrement takenSeats
    await tx.session.update({
      where: { id: booking.sessionId },
      data: {
        takenSeats: { decrement: 1 },
      },
    });

    // 4. Decrement usedCount on usage
    if (booking.userMembershipUsageId) {
      await tx.userMembershipUsage.update({
        where: { id: booking.userMembershipUsageId },
        data: {
          usedCount: { decrement: 1 },
        },
      });
    }

    // 5. Invalidate cache
    await cacheService.del(`activeMemberships:${userId}`);
  });
};


export const findUpcomingSessionsByUser = async (userId: string) => {
  return prisma.booking.findMany({
    where: {
      userId,
      cancelled: false,
      session: {
        dateTime: {
          gt: new Date(),
        },
      },
    },
    include: {
      session: {
        include: {
          courseType: true,
          instructor: true,
        },
      },
    },
    orderBy: {
      session: {
        dateTime: 'asc',
      },
    },
  });
};