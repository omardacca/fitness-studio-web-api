import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getActiveMembershipsWithComponents = async (tenantId: string) => {
    return await prisma.membership.findMany({
      where: {
        tenantId,
        enabled: true,
      },
      include: {
        components: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
};  

export const insertMembershipWithComponents = async ({
  tenantId,
  title,
  price,
  components,
}: {
  tenantId: string;
  title: string;
  price: number;
  components: { courseTypeId: number; count: number }[];
}) => {
  return await prisma.$transaction(async (tx) => {
    const membership = await tx.membership.create({
      data: {
        title,
        price,
        tenantId,
      },
    });

    await tx.membershipComponent.createMany({
      data: components.map((c) => ({
        membershipId: membership.id,
        courseTypeId: c.courseTypeId,
        count: c.count,
      })),
    });

    return {
      ...membership,
      components,
    };
  });
};
