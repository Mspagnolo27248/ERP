import { MasterDataCache } from "../../core-layer/general/MasterDataCache";

type CacheEntry<T> = {
  data: Record<string, T>;
  lastUpdated: Date;
  fetchFn: () => Promise<Record<string, T>>;
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

  private async getOrCreateEntry<T>(
    tableName: string,
    fetchFn: () => Promise<Record<string, T>>
  ): Promise<CacheEntry<T>> {
    let entry = this.cacheMap.get(tableName);
    if (!entry) {
      entry = {
        data: {},
        lastUpdated: new Date(0),
        fetchFn,
      };
      this.cacheMap.set(tableName, entry);
    }

    const now = new Date();
    const isExpired = now.getTime() - entry.lastUpdated.getTime() >= this.cacheDuration;
    
    if (isExpired) {
      const freshData = await fetchFn();
      entry.data = freshData;
      entry.lastUpdated = now;
      entry.fetchFn = fetchFn;
    }

    return entry as CacheEntry<T>;
  }

  async getTable<T>(
    tableName: string,
    fetchFn: () => Promise<Record<string, T>>
  ): Promise<Record<string, T>> {
    const entry = await this.getOrCreateEntry(tableName, fetchFn);
    return entry.data;
  }

  async getByKey<T>(
    tableName: string,
    key: string,
    fetchFn: () => Promise<T>
  ): Promise<T> {
    const entry = this.cacheMap.get(tableName) as CacheEntry<T>;
    if (!entry) {
     return await fetchFn();
    }
    const record = entry.data[key];
    if (record === undefined) {
      throw new Error(`Record ${key} not found in table ${tableName}`);
    }    
    return record;
  }
  

  invalidateTable(tableName: string): void {
    const entry = this.cacheMap.get(tableName);
    if (entry) {
      entry.lastUpdated = new Date(0); // Force next fetch
    }
  }

  invalidateAll(): void {
    for (const entry of this.cacheMap.values()) {
      entry.lastUpdated = new Date(0); // Force next fetch
    }
  }
} 