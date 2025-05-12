import { Prisma } from '@prisma/client';
import Database from '../factories/Database';

export class OrdersRepository {
  private prisma = Database.getInstance();

  async create(data: {
    userId: string;
    membershipId: string;
    paymentMethodId: string;
    status: 'PAID' | 'PENDING';
  }, tx: Prisma.TransactionClient) {
    return tx.order.create({ data });
  }

  async findById(id: number, tx: Prisma.TransactionClient) {
    return tx.order.findUnique({
      where: { id },
      include: {
        membership: true,
        user: true,
      },
    });
  }
}

export const ordersRepository = new OrdersRepository();
