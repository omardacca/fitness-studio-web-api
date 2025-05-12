import Database from '../factories/Database';

const prisma = Database.getInstance();

export const findAllCourses = async (tenantId: string) => {
  return prisma.courseType.findMany({
    where: { tenantId },
    orderBy: { order: 'asc' },
  });
}

export const findManyByIds = async (ids: number[], tenantId: string) => {
  return prisma.courseType.findMany({
    where: {
      id: { in: ids },
      tenantId,
    },
    orderBy: { title: 'asc' },
  });
}