// src/formatters/instructorFormatter.ts

type RawInstructor = {
  id: string;
  fullName: string;
  imageUrl?: string | null;
  courses: {
    courseType: {
      id: number;
      title: string;
      imageUrl: string;
    };
  }[];
};

export function formatInstructor(instructor: RawInstructor) {
  return {
    instructorId: instructor.id,
    fullName: instructor.fullName,
    imageUrl: instructor.imageUrl,
    // courseTypes: instructor.courses.map((c) => ({
    //   courseTypeId: c.courseType.id,
    //   title: c.courseType.title,
    //   imageUrl: c.courseType.imageUrl,
    // })),
  };
}

export function formatInstructorList(instructors: RawInstructor[]) {
  return instructors.map(formatInstructor);
}
