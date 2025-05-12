import { CourseType } from '@prisma/client';

export function formatCourseType(course: CourseType) {
  return {
    courseTypeId: course.id,
    title: course.title,
    imageUrl: course.imageUrl,
  };
}

export function formatCourseTypeList(courses: CourseType[]) {
  return courses.map(formatCourseType);
}
