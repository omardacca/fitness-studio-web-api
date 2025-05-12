import { ICache } from './ICache';
import { RedisCache } from './RedisCache';

export class CacheFactory {
  private static instance: CacheFactory;
  private cacheProvider: string;

  private constructor() {
    this.cacheProvider = process.env.CACHE_PROVIDER || 'REDIS';
  }

  public static getInstance(): CacheFactory {
    if (!CacheFactory.instance) {
      CacheFactory.instance = new CacheFactory();
    }
    return CacheFactory.instance;
  }

  public create(): ICache {
    switch (this.cacheProvider.toUpperCase()) {
      case 'REDIS':
        return RedisCache.getInstance(); // ✅ Use Singleton
      default:
        throw new Error(`Unsupported cache provider: ${this.cacheProvider}`);
    }
  }
}
