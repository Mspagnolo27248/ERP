export abstract class MasterDataCache {
    abstract getOrFetch<T>(key: string, fetchFn: () => Promise<T[]>): Promise<T[]>;
    abstract invalidateCache(key: string): void;
    abstract invalidateAllCaches(): void;
    abstract setCacheDuration(milliseconds: number): void;
}

