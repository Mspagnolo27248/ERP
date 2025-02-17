import { ConnectionManager, DatabaseConnection } from "./ConnectionManager";
import { SqlBuilder } from "./SqlBuilder";

export class BaseModel {
  private static connectionManager = ConnectionManager.getInstance();
  private static sqlBuilder = new SqlBuilder();

  private static async getConnection(): Promise<DatabaseConnection> {
    return await this.connectionManager.getConnection();
  }

  static async findAll<T extends Record<string, any>>(
    this: (new () => T) & typeof BaseModel,
    filter?: Partial<T>
  ): Promise<T[]> {
    const tableName = this.getTableName();
    const { whereClause, parameters } = this.buildWhereClause(filter);
    const sql = `SELECT * FROM ${tableName} ${whereClause}`;
    const db = await this.getConnection();
    const tableRecords = await this.tryExecuteDatabaseOperation(db, sql, parameters);
    return tableRecords.map((record: Record<string, any>) =>
      this.mapRecordToModel<T>(record)
    );

  }

  static async findByKey<T extends Record<string, any>>(
    this: (new () => T) & typeof BaseModel,
    filters: Partial<T>
  ): Promise<T> {
    const tableName = this.getTableName();
    const keyFields: (keyof T)[] = this.getKeyFields();
    this.verifyAllKeyFieldsArePassedByFilter(keyFields, filters);
    const modelToTableMapping = this.getModelToTableFieldMap();
    const { whereClause, parameters } = this.sqlBuilder.generateWhereClause(keyFields, modelToTableMapping, filters);
    const sql = `SELECT * FROM ${tableName} ${whereClause}`;

    const db = await this.getConnection();
    const tableRecords = await this.tryExecuteDatabaseOperation(db, sql, parameters);

    const modelInstances = tableRecords.map((record: Record<string, any>) =>
      this.mapRecordToModel<T>(record)
    );
    return modelInstances[0];
  }

  static async delete<T extends Record<string, any>>(instance: T): Promise<T> {
    const tableName = this.getTableName();
    const model = this.instantiateModelFromDTO(instance);
    const keyFields = this.getKeyFields();
    const modelToColumnMapping = this.getModelToTableFieldMap();
    const { whereClause, parameters } = this.sqlBuilder.generateWhereClause(keyFields, modelToColumnMapping, model);
    const sql = `DELETE FROM ${tableName} ${whereClause}`;
    const db = await this.getConnection();
    const result = await this.tryExecuteDatabaseOperation(db, sql, parameters);
    if(result.count === 0) throw new Error("No rows affected");
    return instance;
  }

  static async update<T extends Record<string, any>>(instance: T): Promise<T> {
    const tableName = this.getTableName();
    const model = this.instantiateModelFromDTO(instance);
    const keyFields = this.getKeyFields();
    const identityFields = this.getIdentityPropeties();
    const modelToTableMapping = this.getModelToTableFieldMap();
    const { sql, parameters } = this.sqlBuilder.generateUpdateSQL(
      tableName,
      model,
      modelToTableMapping,
      keyFields,
      identityFields
    );
    const db = await this.getConnection();
    const result = await this.tryExecuteDatabaseOperation(db, sql, parameters);
    if(result.count === 0) throw new Error("No rows affected");
    return instance;
  }

  static async insert<T extends Record<string, any>>(instance: T): Promise<any> {
    const tableName = this.getTableName();
    const model = this.instantiateModelFromDTO(instance);
    const identityProperties = this.getIdentityPropeties();
    const modelExcludingIdentyProperties = this.dropPropertiesFromModel(model, identityProperties);
    const modelToTableMapping = this.getModelToTableFieldMap();
    const { sql, parameters } = this.sqlBuilder.generateInsertStatement(
      tableName,
      modelExcludingIdentyProperties,
      modelToTableMapping
    );
    const db = await this.getConnection();
    const result = await this.tryExecuteDatabaseOperation(db, sql, parameters);
    if(result.count === 0) throw new Error("No rows affected");
    return instance;
  }

  static async upsert<T extends Record<string, any>>(instance: T): Promise<T> {
    try {
      await this.insert(instance);
    } catch (error) {
      try {
        await this.update(instance);
      } catch (error: any) {
        const msg = error?.message ? error.message : "Error executing SQL";
        throw new Error(msg);
      }
    }
    return instance;
  }

  private static buildWhereClause<T extends Record<string, any>>(
    filter?: Partial<T>
  ): { whereClause: string; parameters: any[] } {
    if (!filter) return { whereClause: "", parameters: [] };

    const whereFields = Object.keys(filter) as (keyof T)[];
    const modelToTableMapping = this.getModelToTableFieldMap();
    return this.sqlBuilder.generateWhereClause(whereFields, modelToTableMapping, filter);
  }

  private static getModelToTableFieldMap(this: typeof BaseModel) {
    const columns =
      Reflect.get(this.prototype, "columns") ||
      {};
    return columns;
  }

  private static getTableName() {
    return Reflect.get(this, "tableName");
  }

  public static getKeyFields<T>(this: typeof BaseModel): (keyof T)[] {
    return Reflect.get(this.prototype, "keyFields") as (keyof T)[];
  }

  private static verifyAllKeyFieldsArePassedByFilter<T>(
    keyFields: (keyof T)[],
    filters: Partial<BaseModel>
  ) {
    if (!filters || Object.keys(filters).length === 0) {
      throw new Error("No filters provided for the search.");
    }

    if (!keyFields) {
      throw new Error(`No Key Fields Defined on ${this.name}`);
    }

    const missingKeys = keyFields.filter((key) => !(key in filters));
    if (missingKeys.length > 0) {
      throw new Error(
        `Missing required key fields in filters: ${missingKeys.join(", ")}`
      );
    }
  }

  private static mapRecordToModel<T extends Record<string, any>>(
    record: Record<string, any>
  ): T {
    const modelToColumnMapping = this.getModelToTableFieldMap();
    const modelInstance = new this() as T;
    const modelKeys = Object.keys(modelInstance);

    modelKeys.forEach((key) => {
      if (modelToColumnMapping[key] == undefined) throw new Error(`Column ${key} is not mapped to any table column`);
      if (record.hasOwnProperty(modelToColumnMapping[key])) {
        modelInstance[key as keyof T] = record[modelToColumnMapping[key]];
      }
    });
    return modelInstance;
  }

  // private static mapModelToRecord<T extends Record<string, any>>(
  //   modelInstance: T
  // ): Record<string, any> {
  //   const modelToColumnMapping = this.getModelToTableFieldMap();
  //   const record: Record<string, any> = {};
  //   Object.keys(modelInstance).forEach((key) => {
  //     const columnName = modelToColumnMapping[key];
  //     if (columnName) {
  //       record[columnName] = (modelInstance as any)[key];
  //     }
  //   });
  //   return record;
  // }

  private static instantiateModelFromDTO<T extends Record<string, any>>(
    dto: T
  ) {
    const target = new this();
    const modelWithUpdatedValues = updateTargetValuesFromSource(target, dto);
    return modelWithUpdatedValues;
  }

  private static getIdentityPropeties() {
    return Reflect.get(this.prototype, "identityFields") || [];
  }

  private static async tryExecuteDatabaseOperation(
    db: DatabaseConnection,
    sql: string,
    params: any[] = []
  ) {
    try {
      const result = await db.executeQuery(sql, params);
      if (!result) throw new Error("Error executing SQL");
      return result;
    } catch (error) {
      if (error instanceof Error) throw error;
      else {
        throw new Error("Error executing SQL");
      }
    }
  }


  private static dropPropertiesFromModel<T extends Record<string, any>>(model: T, dropFields: (keyof T)[]): T {
    return Object.fromEntries(
      Object.entries(model).filter(([key]) => !dropFields.includes(key as keyof T))
    ) as T;
  }
}

function updateTargetValuesFromSource(
  target: Record<string, any>,
  source: Record<string, any>
): Record<string, any> {
  Object.keys(target).forEach((key) => {
    if (key in source) {
      target[key] = source[key];
    }
  });
  return target;
}
