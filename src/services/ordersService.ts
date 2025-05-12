import { Prisma, UserMembership, Order } from '@prisma/client';
import { ordersRepository } from '../repositories/ordersRepository';
import { createUserMembership } from './userMembershipsService';

interface CreateOrderWithMembershipParams {
  userId: string;
  membershipId: string;
  paymentMethodId: string;
  tx: Prisma.TransactionClient;
}

export async function createOrderWithMembership({
  userId,
  membershipId,
  paymentMethodId,
  tx,
}: CreateOrderWithMembershipParams): Promise<{ order: Order; userMembership: UserMembership }> {
  const order = await ordersRepository.create({
    userId,
    membershipId,
    paymentMethodId,
    status: 'PAID',
  }, tx);

  const userMembership = await createUserMembership({ userId, membershipId, tx });
  await tx.order.update({
    where: { id: order.id },
    data: { userMembershipId: userMembership.id },
  });

  return { order, userMembership };
}