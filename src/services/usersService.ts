import { getUserById } from '../repositories/usersRepository';
import { formatUserProfile } from '../formatters/userFormatter';

export const getUserProfile = async ({
  userId,
  tenantId,
}: {
  userId: string;
  tenantId: string;
}) => {
  const user = await getUserById(userId, tenantId);

  if (!user) {
    throw new Error('User not found');
  }

  return formatUserProfile({
    ...user,
  });
};
