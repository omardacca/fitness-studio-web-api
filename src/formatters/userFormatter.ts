import { UserRole } from '@prisma/client';

type RawUser = {
  phoneNumber: string;
  fullName: string | null;
  role: UserRole;
  isIncomplete: boolean;
};

export const formatUserProfile = (user: RawUser) => ({
  phoneNumber: user.phoneNumber,
  fullName: user.fullName,
  role: user.role,
  isIncomplete: user.isIncomplete,
});
