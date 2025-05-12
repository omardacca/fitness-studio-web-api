import { getBookingsByUser, insertBooking, cancelBooking } from '../repositories/bookingsRepository';
import { formatBookingList } from '../formatters/bookingsFormatter';
import { getSessionById } from './sessionsService';
import { ApiError } from '../utils/ApiError';

export const fetchUserBookings = async (userId: string, tenantId: string) => {
  const bookings = await getBookingsByUser(userId, tenantId);
  return formatBookingList(bookings);
};

export const bookSessionService = async (userId: string, sessionId: number) => {
  const session = await getSessionById(sessionId);
  if (!session) {
    throw new ApiError(404, 'Session not found');
  }

  return await insertBooking(userId, sessionId, session.courseTypeId);
};

export const cancelUserBooking = async ({
  userId,
  bookingId,
}: {
  userId: string;
  bookingId: string;
}) => {
  await cancelBooking(userId, bookingId);
};