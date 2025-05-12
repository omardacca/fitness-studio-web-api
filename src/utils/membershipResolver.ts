
import { fetchActiveMemberships } from '../services/userMembershipsService';

export type ActiveMembership = {
  userMembershipUsageId: string;
  userMembershipId: number;
  membershipId: string;
  membershipTitle: string;
  courseTypeId: number;
  usedCount: number;
  allowedCount: number;
  remainingCount: number;
};

export const resolveBestMembershipUsage = async (
  userId: string,
  courseTypeId: number
): Promise<ActiveMembership | null> => {
  const raw = await fetchActiveMemberships(userId);

  const activeMemberships: ActiveMembership[] = raw.map((row) => ({
    userMembershipUsageId: row.id,
    userMembershipId: row.userMembershipId,
    membershipId: row.userMembership.membershipId,
    membershipTitle: row.userMembership.membership.title,
    courseTypeId: row.courseTypeId,
    usedCount: row.usedCount,
    allowedCount: row.allowedCount,
    remainingCount: row.allowedCount - row.usedCount,
  }));

  const valid = activeMemberships
    .filter((entry) => entry.courseTypeId === courseTypeId && entry.remainingCount > 0)
    .sort((a, b) => {
      const aUsed = a.usedCount;
      const bUsed = b.usedCount;

      if (aUsed > 0 && bUsed === 0) return -1;
      if (bUsed > 0 && aUsed === 0) return 1;

      return a.remainingCount - b.remainingCount;
    });

  console.log(valid[0]);
  return valid[0] || null;
};