export abstract class MasterDataCache {
    /**
     * Fetches or returns cached data for an entire table
     * @param tableName The name of the table to fetch
     * @param fetchFn Function to fetch fresh data if cache is invalid
     */
    abstract getTable<T>(
        tableName: string,
        fetchFn: () => Promise<Record<string, T>>
    ): Promise<Record<string, T>>;

    /**
     * Fetches or returns a cached record by its key
     * @param tableName The name of the table containing the record
     * @param key The key of the record to fetch
     * @param fetchFn Function to fetch fresh data if cache is invalid
     */
    abstract getRecord<T>(
        tableName: string,
        key: string,
        fetchFn: () => Promise<T>
    ): Promise<T>;

    /**
     * Invalidates the cache for a specific table
     */
    abstract invalidateTable(tableName: string): void;

    /**
     * Invalidates all cached data
     */
    abstract invalidateAll(): void;

    /**
     * Sets the cache duration in milliseconds
     */
    abstract setCacheDuration(milliseconds: number): void;
}

