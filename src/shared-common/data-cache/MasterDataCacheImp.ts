import { MasterDataCache } from "../../core-layer/general/MasterDataCache";




type CacheEntry<T> = {
  data: T[];
  lastUpdated: Date;
};

  export class MasterDataCacheImp implements MasterDataCache {
  private static instance: MasterDataCacheImp;
  private cacheMap: Map<string, CacheEntry<any>> = new Map();
  private cacheDuration: number = 1000 * 60 * 60; // 1 hour default

  private constructor() {}

  static getInstance(): MasterDataCacheImp {
    if (!MasterDataCacheImp.instance) {
      MasterDataCacheImp.instance = new MasterDataCacheImp();
    }
    return MasterDataCacheImp.instance;
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

  async getOrFetchByKeys<T>(
    keyFields: Record<string, any>,
    fetchFn: () => Promise<T>
  ): Promise<T> {
    const cacheKey = JSON.stringify(keyFields);
    const cached = this.cacheMap.get(cacheKey);
    const now = new Date();

    if (cached && now.getTime() - cached.lastUpdated.getTime() < this.cacheDuration) {
      return cached.data[0];
    }

    const freshData = await fetchFn();
    this.cacheMap.set(cacheKey, {
      data: [freshData],
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