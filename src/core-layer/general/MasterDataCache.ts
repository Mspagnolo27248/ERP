export abstract class MasterDataCache {
    abstract getOrFetch<T>(key: string, fetchFn: () => Promise<T[]>): Promise<T[]>;
    abstract getOrFetchByKeys<T>(keyFields: Record<string, any>, fetchFn: () => Promise<T>): Promise<T>;
    abstract invalidateCache(key: string): void;
    abstract invalidateAllCaches(): void;
    abstract setCacheDuration(milliseconds: number): void;
}

