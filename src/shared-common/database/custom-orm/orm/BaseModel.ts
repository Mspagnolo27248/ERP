import { ConnectionManager, DatabaseConnection } from "./ConnectionManager";




export class BaseModel {
  private static connectionManager = ConnectionManager.getInstance();

  static async getConnection(): Promise<DatabaseConnection> {
    return await this.connectionManager.getConnection();
  }

  /**
   * Starts a new database transaction
   * @throws Error if a transaction is already in progress
   */
  static async beginTransaction(): Promise<void> {
    const connection = await this.getConnection();
    await connection.beginTransaction();
  }

  /**
   * Commits the current transaction
   * @throws Error if no transaction is in progress
   */
  static async commitTransaction(): Promise<void> {
    const connection = await this.getConnection();
    await connection.commitTransaction();
  }

  /**
   * Rolls back the current transaction
   * @throws Error if no transaction is in progress
   */
  static async rollbackTransaction(): Promise<void> {
    const connection = await this.getConnection();
    await connection.rollbackTransaction();
  }

  /**
   * Executes a function within a transaction, automatically handling commit and rollback
   * @param callback The async function to execute within the transaction
   * @returns The result of the callback function
   */
  static async executeInTransaction<T>(callback: () => Promise<T>): Promise<T> {
    await this.beginTransaction();
    try {
      const result = await callback();
      await this.commitTransaction();
      return result;
    } catch (error) {
      await this.rollbackTransaction();
      throw error;
    }
  }

  
  static async findAll<T extends Record<string, any>>(
    this: (new () => T) & typeof BaseModel,
    filter?: Partial<T>
  ): Promise<T[]> {
    const tableName = this.getTableName();
    let whereClause = "";
    let params: any[] = [];
    if(filter){
      const whereFields = Object.keys(filter) as (keyof T)[];
      const modelToTableMapping = this.getModelToTableFieldMap();
      const { clause, parameters } = this.generateSqlWhereClause(whereFields, modelToTableMapping, filter);
      whereClause = clause;
      params = parameters;
    }
    const db = await this.getConnection();
    const sql = `SELECT * FROM ${tableName} ${whereClause}`;
    const rawTableRecords = await this.tryExecuteDatabaseOperation(db, sql, params);
    const modelInstances = rawTableRecords.map((record: Record<string, any>) =>
      this.mapRecordToModel<T>(record)
    );
    return modelInstances;
  }

  static async findByKey<T extends Record<string, any>>(
    this: (new () => T) & typeof BaseModel,
    filters: Partial<T>
  ): Promise<T> {
    const tableName = this.getTableName();
    const keyFields: (keyof T)[] = this.getKeyFields();
    this.verifyAllKeyFieldsArePassedByFilter(keyFields, filters);
    const modelToTableMapping = this.getModelToTableFieldMap();   
    const { clause, parameters } = this.generateSqlWhereClause(keyFields, modelToTableMapping, filters);
    const sql = `SELECT * FROM ${tableName} ${clause}`;

    const db = await this.getConnection();
    const tableRecords = await this.tryExecuteDatabaseOperation(db, sql, parameters);

    const modelInstances = tableRecords.map((record: Record<string, any>) =>
      this.mapRecordToModel<T>(record)
    );
    return modelInstances[0]; // Return the first matching instance or undefined if none found
  }

  static async delete<T extends Record<string, any>>(instance: T): Promise<T> {
    const tableName = this.getTableName();
    const model = this.instantiateModelFromDTO(instance);
    const keyFields = this.getKeyFields();
    const modelToColumnMapping = this.getModelToTableFieldMap();
    const { clause, parameters } = this.generateSqlWhereClause(keyFields, modelToColumnMapping, model);
    const sql = `DELETE FROM ${tableName} ${clause}`;
    const db = await this.getConnection();
    const result = await this.tryExecuteDatabaseOperation(db, sql, parameters); //result is of type any due various DB types.
    return instance; 
  }

  static async update<T extends Record<string, any>>(instance: T): Promise<T> {
    const { sql, parameters } = this.generateUpdateSQL(instance);
    const db = await this.getConnection();
    const result = await this.tryExecuteDatabaseOperation(db, sql, parameters);
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
    const modelToTableMapping = this.getModelToTableFieldMap();
    const { sql, parameters } = this.generateInsertStatement(tableName, modelExcludingIdentyProperties, modelToTableMapping);
    const db = await this.getConnection();
    const result = await this.tryExecuteDatabaseOperation(db, sql, parameters);
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

  public static getKeyFields<T>(this: typeof BaseModel): (keyof T)[] {
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

  protected static async tryExecuteDatabaseTransaction(
    db: DatabaseConnection,
    sqlStatements: string[]
  ) {
    try {
      await db.tryTransaction(sqlStatements);     
      return true;
    } catch (error) {
      if (error instanceof Error) throw error;
      else {
        throw new Error("Error executing SQL");
      }
    }
  }

  protected static generateSqlWhereClause<T>(
    whereFields: (keyof T)[],
    modelToTableMapping: Record<keyof T, string>,
    filters: Partial<T>
  ): { clause: string; parameters: any[] } {
    const parameters: any[] = [];
    const criteria: string[] = whereFields.map((key) => {
      const columnName = modelToTableMapping[key];
      const value = filters[key];
      parameters.push(value);
      return `${columnName}=?`;
    });
    return {
      clause: criteria.length > 0 ? `WHERE ${criteria.join(" AND ")}` : "",
      parameters
    };
  }

  private static generateInsertStatement<T extends Record<string, any>>(
    tableName: string,
    record: T,
    modelToTableMapping: Record<string, string>
  ): { sql: string; parameters: any[] } {
    const parameters: any[] = [];
    const tableFields: string[] = [];
    
    Object.keys(record).forEach(modelField => {
      if (modelToTableMapping[modelField]) {
        tableFields.push(modelToTableMapping[modelField]);
        parameters.push(record[modelField]);
      }
    });

    const placeholders = Array(parameters.length).fill('?').join(', ');
    const sql = `INSERT INTO ${tableName} (${tableFields.join(", ")}) VALUES (${placeholders})`;
    return { sql, parameters };
  }

  
  // static insertSql<T extends Record<string, any>>(instance: T): { sql: string; parameters: any[] } {
  //   const tableName = this.getTableName();
  //   const model = this.instantiateModelFromDTO(instance);
  //   const identityProperties = this.getIdentityPropeties();
  //   const modelExcludingIdentyProperties = dropPropertiesFromModel(
  //     model,
  //     identityProperties
  //   );
  //   const modelToTableMapping = this.getModelToTableFieldMap();
  //   return this.generateInsertStatement(tableName, modelExcludingIdentyProperties, modelToTableMapping);
  // }

  static generateUpdateSQL<T extends Record<string, any>>(instance: T): { sql: string; parameters: any[] } {
    const tableName = this.getTableName();
    const model = this.instantiateModelFromDTO(instance);
    const identityFields = this.getIdentityPropeties();
    const modelExcludingIdentyFields = dropPropertiesFromModel(model, identityFields);
    const keyFields = this.getKeyFields();
    const whereValues = filterModelByProperties(model, keyFields);
    const modelToTableMapping = this.getModelToTableFieldMap();
    
    const { clause: whereClause, parameters: whereParams } = this.generateSqlWhereClause(keyFields, modelToTableMapping, whereValues);
    const { clause: setClause, parameters: setParams } = this.generateSqlSetClause(modelExcludingIdentyFields, modelToTableMapping);

    const sql = `UPDATE ${tableName} ${setClause} ${whereClause}`;
    return { sql, parameters: [...setParams, ...whereParams] };
  }

  protected static generateSqlSetClause<T extends Record<string, any>>(
    model: T,
    modelToTableMapping: Record<string, string>
  ): { clause: string; parameters: any[] } {
    const parameters: any[] = [];
    const setClauses: string[] = [];

    Object.entries(model).forEach(([modelField, value]) => {
      const tableField = modelToTableMapping[modelField];
      if (tableField) {
        parameters.push(value);
        setClauses.push(`${tableField}=?`);
      }
    });

    return { 
      clause: `SET ${setClauses.join(", ")}`,
      parameters
    };
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
