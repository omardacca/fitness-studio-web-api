import {
  getActiveMembershipsWithComponents,
  insertMembershipWithComponents,
} from '../repositories/membershipsRepository';
import {
  formatCreatedMembership,
  formatMembershipList,
} from '../formatters/membershipsFormatter';

interface CreateMembershipInput {
  tenantId: string;
  title: string;
  price: number;
  components: { courseTypeId: number; count: number }[];
}

export const listEnabledMemberships = async (tenantId: string) => {
  const memberships = await getActiveMembershipsWithComponents(tenantId);
  return formatMembershipList(memberships);
};

export const createNewMembership = async (data: CreateMembershipInput) => {
  const membership = await insertMembershipWithComponents(data);
  return formatCreatedMembership(membership);
};
