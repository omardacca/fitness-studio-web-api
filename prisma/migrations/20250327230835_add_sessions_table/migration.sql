-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "courseTypeId" INTEGER NOT NULL,
    "instructorId" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "totalSeats" INTEGER NOT NULL,
    "takenSeats" INTEGER NOT NULL DEFAULT 0,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Session_tenantId_idx" ON "Session"("tenantId");

-- CreateIndex
CREATE INDEX "Session_courseTypeId_idx" ON "Session"("courseTypeId");

-- CreateIndex
CREATE INDEX "Session_instructorId_idx" ON "Session"("instructorId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_courseTypeId_fkey" FOREIGN KEY ("courseTypeId") REFERENCES "CourseType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
