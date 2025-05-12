-- CreateTable
CREATE TABLE "Instructor" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "imageUrl" TEXT,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Instructor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstructorCourse" (
    "instructorId" TEXT NOT NULL,
    "courseTypeId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstructorCourse_pkey" PRIMARY KEY ("instructorId","courseTypeId")
);

-- AddForeignKey
ALTER TABLE "InstructorCourse" ADD CONSTRAINT "InstructorCourse_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstructorCourse" ADD CONSTRAINT "InstructorCourse_courseTypeId_fkey" FOREIGN KEY ("courseTypeId") REFERENCES "CourseType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
