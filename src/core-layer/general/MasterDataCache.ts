export abstract class MasterDataCache {
    /**
     * Sets the cache duration in milliseconds
     */
    abstract setCacheDuration(milliseconds: number): void;


    abstract getTable<T>(
        tableName: string,
        fetchFn: () => Promise<Record<string, T>>
    ): Promise<Record<string, T>>;


    abstract getByKey<T>(
        tableName: string,
        key: string,
        fetchFn: () => Promise<T>
    ): Promise<T>;

 
    abstract invalidateTable(tableName: string): void;

    /**
     * Invalidates all cached data
     */
    abstract invalidateAll(): void;
}

