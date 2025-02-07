import { MasterDataCache } from "../../core-layer/general/MasterDataCache";

type CacheEntry<T> = {
  data: Record<string, T>;
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

  setCacheDuration(milliseconds: number): void {
    this.cacheDuration = milliseconds;
  }

  async getTable<T>(
    tableName: string,
    fetchFn: () => Promise<Record<string, T>>
  ): Promise<Record<string, T>> {
    const cached = this.cacheMap.get(tableName);
    const now = new Date();

    if (cached && now.getTime() - cached.lastUpdated.getTime() < this.cacheDuration) {
      return cached.data;
    }

    const freshData = await fetchFn();
    this.cacheMap.set(tableName, {
      data: freshData,
      lastUpdated: now,
    });

    return freshData;
  }

  async getRecord<T>(
    tableName: string,
    key: string,
    fetchFn: () => Promise<T>
  ): Promise<T> {
    const cached = this.cacheMap.get(tableName);
    const now = new Date();

    if (cached && now.getTime() - cached.lastUpdated.getTime() < this.cacheDuration) {
      const record = cached.data[key];
      if (record !== undefined) {
        return record;
      }
    }

    const freshData = await fetchFn();
    
    if (!cached) {
      this.cacheMap.set(tableName, {
        data: { [key]: freshData },
        lastUpdated: now,
      });
    } else {
      cached.data[key] = freshData;
      cached.lastUpdated = now;
    }

    return freshData;
  }

  invalidateTable(tableName: string): void {
    this.cacheMap.delete(tableName);
  }

  invalidateAll(): void {
    this.cacheMap.clear();
  }
} 