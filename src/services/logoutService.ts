import { CacheFactory } from '../factories/cache/CacheFactory';

const cacheService = CacheFactory.getInstance().create();

export const blacklistToken = async (token: string, expiresIn: number): Promise<void> => {
  await cacheService.set(`blacklist:${token}`, '1', expiresIn);
};

export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  const blacklisted = await cacheService.get(`blacklist:${token}`);
  return blacklisted !== null;
};
