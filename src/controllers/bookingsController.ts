import { Request, Response } from 'express';
import { fetchUserBookings, bookSessionService, cancelUserBooking } from '../services/bookingsService';
import { ApiError } from '../utils/ApiError';
import { findUpcomingSessionsByUser } from '../repositories/bookingsRepository';
import { formatUpcomingSession } from '../formatters/bookingsFormatter';

export const getMyBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const tenantId = req.tenantId;

    if (!userId || !tenantId) {
      res.status(400).json({ message: 'Missing userId or tenantId' });
      return;
    }

    const bookings = await fetchUserBookings(userId, tenantId);
    res.json(bookings);
  } catch (error) {
    console.error('Failed to get user bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const bookSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { sessionId } = req.body;

    if (!userId || !sessionId) {
      res.status(400).json({ message: 'Missing userId or sessionId' });
      return;
    }

    const booking = await bookSessionService(userId, sessionId);
    res.status(201).json(booking);

  } catch (error: any) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error('Booking failed:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const cancelBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { bookingId } = req.params;

    if (!userId || !bookingId) {
      res.status(400).json({ message: 'Missing userId or bookingId' });
      return;
    }

    await cancelUserBooking({ userId, bookingId });

    res.status(204).send();
  } catch (error: any) {
    if (error.message === 'Booking not found or access denied') {
      res.status(404).json({ message: error.message });
    } else {
      console.error('Cancel booking failed:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const getUpcomingUserSessions = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(400).json({ message: 'Missing userId' });
      return;
    }

    const sessions = await findUpcomingSessionsByUser(userId);
    const formatted = sessions.map(formatUpcomingSession);

    res.json({ upcomingSessions: formatted });
  } catch (error) {
    console.error('❌ Failed to fetch upcoming sessions:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};