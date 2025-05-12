import { Prisma, PrismaClient, UserMembership } from '@prisma/client';

const prisma = new PrismaClient();

export const assignMembership = async (
  userId: string,
  membershipId: string,
  tx?: Prisma.TransactionClient
): Promise<UserMembership> => {
  const db = tx ?? prisma;

  // Wrap in $transaction only if no external tx provided
  const execute = async (client: Prisma.TransactionClient) => {
    const userMembership = await client.userMembership.create({
      data: {
        userId,
        membershipId,
      },
    });

    const components = await client.membershipComponent.findMany({
      where: { membershipId },
    });

    await client.userMembershipUsage.createMany({
      data: components.map((c) => ({
        userMembershipId: userMembership.id,
        courseTypeId: c.courseTypeId,
        usedCount: 0,
        allowedCount: c.count,
      })),
    });

    return userMembership;
  };

  return tx ? execute(db) : prisma.$transaction(execute);
};


export const getActiveUsagesByUser = async (userId: string) => {
  const raw = await prisma.userMembershipUsage.findMany({
    where: {
      userMembership: {
        userId,
        membership: {
          enabled: true,
        },
      },
    },
    select: {
      id: true,
      userMembershipId: true,
      courseTypeId: true,
      usedCount: true,
      allowedCount: true,
      courseType: {
        select: {
          title: true,
        },
      },
      userMembership: {
        select: {
          id: true,
          membershipId: true,
          membership: {
            select: {
              title: true,
              price: true,
            },
          },
        },
      },
    },
  });

  return raw.filter((entry) => entry.usedCount < entry.allowedCount);
};
