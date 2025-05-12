/*
  Warnings:

  - The primary key for the `Instructor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `InstructorCourse` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `tenantId` to the `InstructorCourse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "InstructorCourse" DROP CONSTRAINT "InstructorCourse_instructorId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_instructorId_fkey";

-- AlterTable
ALTER TABLE "Instructor" DROP CONSTRAINT "Instructor_pkey",
ADD CONSTRAINT "Instructor_pkey" PRIMARY KEY ("id", "tenantId");

-- AlterTable
ALTER TABLE "InstructorCourse" DROP CONSTRAINT "InstructorCourse_pkey",
ADD COLUMN     "tenantId" TEXT NOT NULL,
ADD CONSTRAINT "InstructorCourse_pkey" PRIMARY KEY ("instructorId", "tenantId", "courseTypeId");

-- CreateIndex
CREATE INDEX "Instructor_tenantId_idx" ON "Instructor"("tenantId");

-- AddForeignKey
ALTER TABLE "InstructorCourse" ADD CONSTRAINT "InstructorCourse_instructorId_tenantId_fkey" FOREIGN KEY ("instructorId", "tenantId") REFERENCES "Instructor"("id", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_instructorId_tenantId_fkey" FOREIGN KEY ("instructorId", "tenantId") REFERENCES "Instructor"("id", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;
