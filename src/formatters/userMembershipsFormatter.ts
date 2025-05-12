import { UserMembership } from '../types/userMemberships';

export function formatUserMembershipsForAppDisplay(usages: any[]): UserMembership[] {
  const groupedByUserMembership = new Map<number, UserMembership>();

  usages.forEach((entry) => {
    const userMembershipId = entry.userMembership.id;
    const title = entry.userMembership.membership.title;
    const price = entry.userMembership.membership.price;
    const courseTypeId = entry.courseTypeId;
    const courseTypeName = entry.courseType.title;
    const usedCount = entry.usedCount;
    const allowedCount = entry.allowedCount;

    if (!groupedByUserMembership.has(userMembershipId)) {
      groupedByUserMembership.set(userMembershipId, {
        membershipId: userMembershipId,
        title,
        price,
        cancelationOptions: {
          hoursBeforeSession: 3,
        },
        features: [],
      });
    }

    groupedByUserMembership.get(userMembershipId)!.features.push({
      courseTypeId,
      courseTypeName,
      sessionCount: allowedCount,
      remainSessionCount: allowedCount - usedCount,
    });
  });

  return [...groupedByUserMembership.values()];
} 