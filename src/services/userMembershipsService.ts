import { assignMembership, getActiveUsagesByUser } from '../repositories/userMembershipsRepository';
import { CacheFactory } from '../factories/cache/CacheFactory';
import Database from '../factories/Database';
import { Prisma, UserMembership } from '@prisma/client';

const cacheService = CacheFactory.getInstance().create();
const prisma = Database.getInstance();

export const createUserMembership = async ({
  userId,
  membershipId,
  tx,
}: {
  userId: string;
  membershipId: string;
  tx?: Prisma.TransactionClient;
}): Promise<UserMembership> => {
  // Use the assignMembership function (creates userMembership + usages in transaction)
  const userMembership = await assignMembership(userId, membershipId, tx);

  // Invalidate cache
  const cacheKey = `activeMemberships:${userId}`;
  cacheService.del(cacheKey);
  console.log(`[Cache] Invalidated ${cacheKey}`);

  return userMembership;
};

export const fetchActiveMemberships = async (userId: string) => {
  const cacheKey = `activeMemberships:${userId}`;
  const cached = await cacheService.get(cacheKey);
  if (cached) {
    console.log(`[Cache] Hit ${cacheKey}`);
    return JSON.parse(cached);
  }

  const rows = await getActiveUsagesByUser(userId);

  await cacheService.set(cacheKey, JSON.stringify(rows));
  return rows;
};