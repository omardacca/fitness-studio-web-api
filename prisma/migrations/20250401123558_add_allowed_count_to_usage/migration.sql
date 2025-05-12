/*
  Warnings:

  - Added the required column `allowedCount` to the `UserMembershipUsage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserMembershipUsage" ADD COLUMN     "allowedCount" INTEGER NOT NULL;
