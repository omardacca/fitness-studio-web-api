import { getWaitingListByUser, insertWaitingListEntry, deleteWaitingListEntry } from '../repositories/waitingListRepository';
import { formatWaitingList } from '../formatters/waitingListFormatter';

export const fetchUserWaitingList = async (userId: string, tenantId: string) => {
  const data = await getWaitingListByUser(userId, tenantId);
  return formatWaitingList(data);
};

export const createWaitingListEntry = async (userId: string, sessionId: number) => {
  const entry = await insertWaitingListEntry(userId, sessionId);
  return {
    waitlistId: entry.id,
    sessionId: entry.sessionId,
  };
};

export const removeWaitingListEntry = async (userId: string, waitlistId: string) => {
  await deleteWaitingListEntry(userId, waitlistId);
};