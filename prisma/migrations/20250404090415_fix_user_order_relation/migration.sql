/*
  Warnings:

  - The primary key for the `UserMembership` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `UserMembership` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `userMembershipId` on the `UserMembershipUsage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "UserMembershipUsage" DROP CONSTRAINT "UserMembershipUsage_userMembershipId_fkey";

-- AlterTable
ALTER TABLE "UserMembership" DROP CONSTRAINT "UserMembership_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "UserMembership_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "UserMembershipUsage" DROP COLUMN "userMembershipId",
ADD COLUMN     "userMembershipId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userMembershipId" INTEGER,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_userMembershipId_key" ON "Order"("userMembershipId");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "Order_membershipId_idx" ON "Order"("membershipId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMembershipUsage_userMembershipId_courseTypeId_key" ON "UserMembershipUsage"("userMembershipId", "courseTypeId");

-- AddForeignKey
ALTER TABLE "UserMembershipUsage" ADD CONSTRAINT "UserMembershipUsage_userMembershipId_fkey" FOREIGN KEY ("userMembershipId") REFERENCES "UserMembership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userMembershipId_fkey" FOREIGN KEY ("userMembershipId") REFERENCES "UserMembership"("id") ON DELETE SET NULL ON UPDATE CASCADE;
