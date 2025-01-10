class DataUtils {  

  public static joinArrays<T extends Record<string, any>, U extends Record<string, any>>(
      array1: T[],
      array2: U[],
      keyMappings: [keyof T, keyof U][]
  ): Array<T & U> {
      const keys1 = keyMappings.map(([key1]) => key1);
      const keys2 = keyMappings.map(([, key2]) => key2);

      const map2 = this.createMapFromArray(array2, keys2);

      return array1
          .map(item1 => {
              const keyValue = this.extractValues(item1, keys1).toString();
              const matchingItem = map2.get(keyValue);

              return matchingItem ? { ...item1, ...matchingItem } : undefined;
          })
          .filter(Boolean) as Array<T & U>;
  }


  public static reduceAndJoinArrays<T extends Record<string, any>, U extends Record<string, any>>(
      array1: T[],
      array2: U[],
      keyMappings: [keyof T, keyof U][]
  ): Array<T & U> {
      const keys1 = keyMappings.map(([key1]) => key1);
      const keys2 = keyMappings.map(([, key2]) => key2);

      const map2 = this.createMapFromArray(array2, keys2);

      return array1.reduce<Array<T & U>>((result, item1) => {
          const keyValue = this.extractValues(item1, keys1).toString();
          const matchingItem = map2.get(keyValue);

          if (matchingItem) {
              result.push({ ...item1, ...matchingItem });
          }

          return result;
      }, []);
  }

  public static async groupByKeys<T>(items: T[], keys: Array<keyof T>): Promise<Record<string, Array<Partial<T>>>> {
      return items.reduce<Record<string, Array<Partial<T>>>>((accumulator, item) => {
          const compositeKey = keys.map(key => item[key]).join("-");

          if (!accumulator[compositeKey]) {
              accumulator[compositeKey] = [];
          }

          accumulator[compositeKey].push(item);
          return accumulator;
      }, {});
  }

  public static aggregateValues<T extends Record<string, any>>(
      data: T[],
      rowKeys: Array<keyof T>,
      columnKeys: Array<keyof T>,
      valueKey: keyof T,
      delimiter: string = "-"
  ): Record<string, Record<string, number>> {
      const result: Record<string, Record<string, number>> = {};

      data.forEach(item => {
          const rowKey = rowKeys.map(key => item[key]).join(delimiter);
          const colKey = columnKeys.map(key => item[key]).join(delimiter);
          const value = item[valueKey];

          if (!result[rowKey]) {
              result[rowKey] = {};
          }

          if (!result[rowKey][colKey]) {
              result[rowKey][colKey] = 0;
          }

          result[rowKey][colKey] += typeof value === "number" ? value : 1;
      });

      return result;
  }

  public static invertObject<T extends Record<string, any>>(object: T): Record<string, keyof T> {
      const inverted: Record<string, keyof T> = {};

      Object.keys(object).forEach(key => {
          const value = object[key];
          inverted[value] = key;
      });

      return inverted;
  }

  public static mapProperties<T, U>(source: T, propertyMap: Record<keyof T, keyof U>): U {
    const result = {} as U;

    (Object.keys(propertyMap) as Array<keyof T>).forEach(sourceKey => {
        const targetKey = propertyMap[sourceKey];
        (result as any)[targetKey] = source[sourceKey];
    });

    return result;}



    private static extractValues<U extends Record<string, any>>(object: U, keys: Array<keyof U>): any[] {
      return keys.map(key => object[key]);
  }


  private static createMapFromArray<U extends Record<string, any>>(array: U[], keys: Array<keyof U>): Map<string, U> {
      return new Map(array.map(item => [this.extractValues(item, keys).toString(), item]));
  }

}
