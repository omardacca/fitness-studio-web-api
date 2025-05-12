-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembershipComponent" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "courseTypeId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "MembershipComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMembership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMembershipUsage" (
    "id" TEXT NOT NULL,
    "userMembershipId" TEXT NOT NULL,
    "courseTypeId" INTEGER NOT NULL,
    "usedCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserMembershipUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Membership_tenantId_idx" ON "Membership"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "MembershipComponent_membershipId_courseTypeId_key" ON "MembershipComponent"("membershipId", "courseTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMembershipUsage_userMembershipId_courseTypeId_key" ON "UserMembershipUsage"("userMembershipId", "courseTypeId");

-- AddForeignKey
ALTER TABLE "MembershipComponent" ADD CONSTRAINT "MembershipComponent_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipComponent" ADD CONSTRAINT "MembershipComponent_courseTypeId_fkey" FOREIGN KEY ("courseTypeId") REFERENCES "CourseType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMembership" ADD CONSTRAINT "UserMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMembership" ADD CONSTRAINT "UserMembership_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMembershipUsage" ADD CONSTRAINT "UserMembershipUsage_userMembershipId_fkey" FOREIGN KEY ("userMembershipId") REFERENCES "UserMembership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMembershipUsage" ADD CONSTRAINT "UserMembershipUsage_courseTypeId_fkey" FOREIGN KEY ("courseTypeId") REFERENCES "CourseType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
