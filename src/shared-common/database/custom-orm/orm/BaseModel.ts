import { ConnectionManager, DatabaseConnection } from "./ConnectionManager";




export class BaseModel {
  private static connectionManager = ConnectionManager.getInstance();

  static get connection(): DatabaseConnection {
    return this.connectionManager.getConnection();
  }

  static async findAll<T extends Record<string, any>>(
    this: typeof BaseModel
  ): Promise<any> {
    const tableName = this.getTableName();
    const db = this.connection;
    const sql = `SELECT * FROM ${tableName}`;
    const rawTableRecords = await this.tryExecuteDatabaseOperation(db, sql);
    const modelInstances = rawTableRecords.map((record: T) =>
      this.mapRecordToModel(record)
    );
    return modelInstances;
  }

  static async findByKey<M extends Record<string, any>>(
    this: typeof BaseModel,
    filters: Partial<M>
  ): Promise<any> {
    const tableName = this.getTableName();
    const keyFields: (keyof M)[] = this.getKeyFields();
    this.verifyAllKeyFieldsArePassedByFilter(keyFields, filters);
    const modelToTableMapping = this.getModelToTableFieldMap();   
    const whereClause = this.generateSqlWhereClause(keyFields,modelToTableMapping,filters);
    const sql = `SELECT * FROM ${tableName} ${whereClause}`;

    const db = this.connection;
    const tableRecords = await this.tryExecuteDatabaseOperation(db, sql);

    const modelInstances:M[] = tableRecords.map((record:Record<string, any>) =>
      this.mapRecordToModel(record)
    );
    return modelInstances[0]; // Return the first matching instance
  }

  static async delete<T extends Record<string, any>>(instance: T): Promise<T> {
    const tableName = this.getTableName();
    const model = this.instantiateModelFromDTO(instance);
    const keyFields = this.getKeyFields();
    const modelToColumnMapping = this.getModelToTableFieldMap();
    const whereClause = this.generateSqlWhereClause(keyFields,modelToColumnMapping,model);
    const sql = `DELETE FROM ${tableName} ${whereClause}`;
    const db = this.connection;
    const result = await this.tryExecuteDatabaseOperation(db, sql); //result is of type any due various DB types.
    return instance; 
  }

  static async update<T extends Record<string, any>>(instance: T): Promise<T> {
    const sql = this.generateUpdateSQL(instance);
    const db = this.connection;
    const result = await this.tryExecuteDatabaseOperation(db, sql);
    return instance;
  }

  static async insert<T extends Record<string, any>>(
    instance: T
  ): Promise<any> {
    const tableName = this.getTableName();
    const model = this.instantiateModelFromDTO(instance);
    const identityProperties = this.getIdentityPropeties();
    const modelExcludingIdentyProperties = dropPropertiesFromModel(
      model,
      identityProperties
    );
    const record = this.mapModelToRecord(modelExcludingIdentyProperties);
    const sql = this.generateInsertStatment(tableName, record);
    const db = this.connection;
    const result = await this.tryExecuteDatabaseOperation(db, sql);
    return instance;

  }



  static async upsert<T extends Record<string, any>>(instance: T): Promise<T> { 
    try {
      await this.insert(instance);
    } catch (error) {
      try{
        await this.update(instance);
      } catch (error:any) {
        const msg = error?.message ? error.message : "Error executing SQL";
        throw new Error(msg);     
      }
    }
    return instance;  
  }

  //Protected methods
  protected static getModelToTableFieldMap(this: typeof BaseModel) {
    const columns =
      Reflect.get(this.prototype, "columns") ||
      {}; /* {'proper1':'tableFiel1'} */
    return columns;
  }

  protected static getTableName() {
    return Reflect.get(this, "tableName");
  }

  protected static getKeyFields<T>(this: typeof BaseModel): (keyof T)[] {
    return Reflect.get(this.prototype, "keyFields") as (keyof T)[];
  }

  protected static verifyAllKeyFieldsArePassedByFilter<T>(
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

  protected static mapRecordToModel<T extends Record<string, any>>(
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

  static mapModelToRecord<T extends Record<string, any>>(
    modelInstance: T
  ): Record<string, any> {
    const modelToColumnMapping = this.getModelToTableFieldMap();
    const record: Record<string, any> = {};
    Object.keys(modelInstance).forEach((key) => {
      const columnName = modelToColumnMapping[key];
      if (columnName) {
        record[columnName] = (modelInstance as any)[key];
      }
    });
    return record;
  }

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
  protected static async tryExecuteDatabaseOperation(
    db: DatabaseConnection,
    sql: string
  ) {
    try {
      await db.connect();
      const result = await db.executeQuery(sql);      
      if (!result) throw new Error("Error executing SQL");
      return result;
    } catch (error) {
      if (error instanceof Error) throw error;
      else {
        throw new Error("Error executing SQL");
      }
    } finally {
      await db.disconnect();
    }
  }

  protected static async tryExecuteDatabaseTransaction(
    db: DatabaseConnection,
    sqlStatements: string[]
  ) {
    try {
      await db.connect();
  await db.tryTransaction(sqlStatements);     
      return true;
    } catch (error) {
      if (error instanceof Error) throw error;
      else {
        throw new Error("Error executing SQL");
      }
    } finally {
      await db.disconnect();
    }
  }

  protected static generateSqlWhereClause<T>(
    whereFields: (keyof T)[],
    modelToTableMapping: Record<keyof T, string>,
    filters: Partial<T>
  ): string {
    const criteria: string[] = whereFields.map((key) => {
      const columnName = modelToTableMapping[key];
      const value = filters[key];
      return `${columnName}=${
        typeof value === "string" ? `'${value}'` : value
      }`;
    });
    const whereClause = `WHERE ${criteria.join(" AND ")}`;
    return whereClause;
  }

  private static generateInsertStatment<T extends Record<string, any>>(
    tableName: string,
    record: T
  ) {
    const tableFields = Object.keys(record).join(", ");
    const fieldValues = Object.entries(record).map(([key, value]) => {
      return typeof value === "string" ? `'${value}'` : value;
    });
    const valuesString = fieldValues.join(", ");
    return `INSERT INTO ${tableName} (${tableFields}) VALUES (${valuesString})`;
  }

  static insertSql<T extends Record<string, any>>(instance: T): string {
    const tableName = this.getTableName();
    const model = this.instantiateModelFromDTO(instance);
    const identityProperties = this.getIdentityPropeties();
    const modelExcludingIdentyProperties = dropPropertiesFromModel(
      model,
      identityProperties
    );
    const record = this.mapModelToRecord(modelExcludingIdentyProperties);
    const sql = this.generateInsertStatment(tableName, record);
    return sql;
  }

  static generateUpdateSQL<T extends Record<string, any>>(instance: T): string {
    const tableName = this.getTableName();
    const model = this.instantiateModelFromDTO(instance);
    const identityFields = this.getIdentityPropeties();
    const modelExcludingIdentyFields = dropPropertiesFromModel(model,identityFields);
    const keyFields = this.getKeyFields();
    const whereValues = filterModelByProperties(model, keyFields);
    const modelToColumnMapping = this.getModelToTableFieldMap();
    const whereClasue = this.generateSqlWhereClause(keyFields, modelToColumnMapping, whereValues);
    const setClause = this.generateSqlSetClause(modelExcludingIdentyFields);

    const sql = `UPDATE ${tableName} ${setClause} ${whereClasue}`;
    return sql;
  }

  protected static generateSqlSetClause<T extends Record<string, any>>(model: T): string {
    const modelToColumnMapping = this.getModelToTableFieldMap();
    const setClause = Object.entries(model).map(([key, value]) => {
      const columnName = modelToColumnMapping[key];
      return `${columnName}=${typeof value === "string" ? `'${value}'` : value}`;
    }).join(", ");
    return `SET ${setClause}`;
  }
}




type Constructor<T> = new (...args: any[]) => T;


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


function dropPropertiesFromModel<T extends Record<string, any>>(model: T, dropFields: (keyof T)[]): T {
  return Object.fromEntries(
    Object.entries(model).filter(([key]) => !dropFields.includes(key as keyof T))
  ) as T;
}

function filterModelByProperties<T extends Record<string, any>>(model: T, includeFields: (keyof T)[]): T {
  return Object.fromEntries(
    Object.entries(model).filter(([key]) => includeFields.includes(key as keyof T))
  ) as T;
}
