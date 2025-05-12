import Database from '../factories/Database';

const prisma = Database.getInstance();

export const paymentOptionsRepository = {
  findAll: async () => {
    return prisma.paymentOption.findMany({
      orderBy: { name: 'asc' },
    });
  },
};
