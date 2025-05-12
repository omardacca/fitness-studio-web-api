import { WaitingList } from '@prisma/client';

export const formatWaitingList = (entries: WaitingList[]) => {
  return entries.map(entry => ({
    waitlistId: entry.id,
    sessionId: entry.sessionId,
  }));
};
