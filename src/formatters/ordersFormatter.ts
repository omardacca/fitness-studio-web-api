import { Order, UserMembership } from '@prisma/client';

export function formatOrder(order: Order & { membership?: { title: string; price: number } }, userMembership: UserMembership) {
  return {
    orderId: order.id,
    status: order.status,
    // membership: {
    //   membershipId: order.membershipId,
    //   title: order.membership?.title ?? null,
    //   price: order.membership?.price ?? null,
    // },
    // assigned: !!userMembership,
    // userMembershipId: userMembership.id,
  };
}