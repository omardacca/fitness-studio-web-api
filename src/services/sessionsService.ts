import {
  getSessionsForDay,
  getSessionById as fetchSessionById,
} from '../repositories/sessionsRepository';
import { formatSessionList } from '../formatters/sessionsFormatter';
import { findAvailableCourses } from '../repositories/sessionsRepository';
import { findManyByIds } from '../repositories/courseTypeRepository';

interface FetchOptions {
  courseTypeId: number | null;
  dateTime: string;
  instructorId: string | null;
  tenantId: string;
}

export const fetchAvailableSessions = async ({
  courseTypeId,
  dateTime,
  instructorId,
  tenantId,
}: FetchOptions) => {
  const sessions = await getSessionsForDay({
    dateTime,
    courseTypeId,
    instructorId,
    tenantId,
  });

  return formatSessionList(sessions);
};

export const getSessionById = async (sessionId: number) => {
  return await fetchSessionById(sessionId);
};

export const getAvailableCourses = async (tenantId: string) => {
  const courseCounts = await findAvailableCourses(tenantId);

  const courseTypeIds = courseCounts.map((entry) => entry.courseTypeId);

  const courseTypes = await findManyByIds(courseTypeIds, tenantId);

  return courseTypes.map((course: any) => {
    const match = courseCounts.find((c) => c.courseTypeId === course.id);
    return {
      courseTypeId: course.id,
      title: course.title,
      imageUrl: course.imageUrl,
      availableCoursesCount: match?._count.courseTypeId ?? 0,
    };
  });
};