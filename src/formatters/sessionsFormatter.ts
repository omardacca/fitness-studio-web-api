import { Session, Instructor } from '@prisma/client';

type SessionWithInstructor = Session & {
  instructor: Instructor;
};

export const formatSessionList = (sessions: SessionWithInstructor[]) => {
  return sessions.map(session => ({
    sessionId: session.id,
    courseTypeId: session.courseTypeId,
    instructorId: session.instructorId,
    instructorName: session.instructor.fullName,
    instructorImageUrl: session.instructor.imageUrl,
    duration: session.duration,
    dateTime: session.dateTime,
    takenSeats: session.takenSeats,
    totalSeats: session.totalSeats,
  }));
};
