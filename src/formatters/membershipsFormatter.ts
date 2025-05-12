import { Membership, MembershipComponent } from '@prisma/client';

type MembershipWithComponents = Membership & {
  components: MembershipComponent[];
};

export const formatMembershipList = (
  items: MembershipWithComponents[]
) => {
  return items.map((m) => ({
    membershipId: m.id,
    title: m.title,
    price: m.price,
    benefits: ['Small Groups', 'Perfect for beginners'],
    // components: m.components.map((c) => ({
    //   courseTypeId: c.courseTypeId,
    //   count: c.count,
    // })),
  }));
};

export const formatCreatedMembership = ({
    id,
    title,
    price,
    components,
  }: {
    id: string;
    title: string;
    price: number;
    components: { courseTypeId: number; count: number }[];
  }) => {
    return {
      membershipId: id,
      title,
      price,
      components,
    };
  };
  