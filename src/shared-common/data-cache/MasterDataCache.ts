type CacheEntry<T> = {
  data: T[];
  lastUpdated: Date;
};

export class MasterDataCache {
  private static instance: MasterDataCache;
  private cacheMap: Map<string, CacheEntry<any>> = new Map();
  private cacheDuration: number = 1000 * 60 * 60; // 1 hour default

  private constructor() {}

  static getInstance(): MasterDataCache {
    if (!MasterDataCache.instance) {
      MasterDataCache.instance = new MasterDataCache();
    }
    return MasterDataCache.instance;
  }

  setCacheDuration(milliseconds: number) {
    this.cacheDuration = milliseconds;
  }

  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T[]>
  ): Promise<T[]> {
    const cached = this.cacheMap.get(key);
    const now = new Date();

    if (
      cached &&
      now.getTime() - cached.lastUpdated.getTime() < this.cacheDuration
    ) {
      return cached.data;
    }

    // Fetch fresh data
    const freshData = await fetchFn();
    this.cacheMap.set(key, {
      data: freshData,
      lastUpdated: now,
    });

    return freshData;
  }

  invalidateCache(key: string) {
    this.cacheMap.delete(key);
  }

  invalidateAllCaches() {
    this.cacheMap.clear();
  }
} 