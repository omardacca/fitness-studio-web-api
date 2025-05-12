/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber,tenantId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_phoneNumber_key";

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_tenantId_key" ON "User"("phoneNumber", "tenantId");
