import { Booking } from '@prisma/client';

export const formatBookingList = (bookings: Booking[]) => {
  return bookings.map(booking => ({
    bookingId: booking.id,
    sessionId: booking.sessionId,
  }));
};


export function formatUpcomingSession(booking: any) {
  const session = booking.session;

  return {
    sessionId: session.id,
    course: {
      courseTypeId: session.courseType.id,
      title: session.courseType.title,
      imageUrl: session.courseType.imageUrl,
    },
    instructor: {
      instructorId: session.instructor.id,
      fullName: session.instructor.fullName,
      imageUrl: session.instructor.imageUrl,
    },
    duration: `${session.duration} min`,
    dateTime: session.dateTime.toISOString(), // or format with dayjs if needed
    takenSeats: session.takenSeats,
    totalSeats: session.totalSeats,
  };
}