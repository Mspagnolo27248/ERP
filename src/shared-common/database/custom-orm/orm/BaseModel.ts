import { ConnectionManager, DatabaseConnection } from "./ConnectionManager";


export   class BaseModel  {

  private static connectionManager = ConnectionManager.getInstance();

  static get getConnection(): DatabaseConnection {
    return this.connectionManager.getConnection();
  }

  static async findAll<T extends Record<string, any>>(this: typeof BaseModel ): Promise<any> {
    const tableName = this.getTableName();
    const db  =   this.getConnection
    await db.connect();
    const rawTableRecords = await db.executeQuery(`SELECT * FROM ${tableName}`);
    await db.disconnect();
    const modelInstances = rawTableRecords.map((record:T) =>
      this.mapRecordToModel(record, this)
    );
    return modelInstances;
  }


  static async findByKey<T extends Record<string, any>>(this: typeof BaseModel ,filters: Partial<T>): Promise<any> {
    const tableName = this.getTableName();
    if (!filters || Object.keys(filters).length === 0) {
      throw new Error("No filters provided for the search.");
    }

    const keyFields: (keyof T)[] = this.getKeyFields();
    if (!keyFields) {
      throw new Error(`No Key Fields Defined on ${this.name}`)
    }
    const missingKeys = keyFields.filter((key) => !(key in filters));
    if (missingKeys.length > 0) {
      throw new Error(`Missing required key fields in filters: ${missingKeys.join(", ")}`);
    }

    const modelToColumnMapping = this.getModelToTableFieldMap();

    // Construct WHERE clause using key fields
    const criteria: string[] = keyFields.map((key) => {
      const columnName = modelToColumnMapping[key];
      const value = filters[key];
      return `${columnName}=${typeof value === "string" ? `'${value}'` : value}`;
    });
    const whereClause = `WHERE ${criteria.join(" AND ")}`;
    const sql = `SELECT * FROM ${tableName} ${whereClause}`;

    try {
        const db  =   this.getConnection;
        await db.connect();
      const rawRecords = await db.executeQuery(sql); // Execute the query
      await db.disconnect();
      const modelInstances = rawRecords.map((record:T) =>
        this.mapRecordToModel(record, this)
      );
      return modelInstances[0] as T; // Return the first matching instance
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Database error: ${error.message}`);
      } else {
        throw new Error("Unknown error during database operation.");
      }
    }
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

  protected static getKeyFields() {
    return Reflect.get(this.prototype, "keyFields") as [];
  }

  protected static mapRecordToModel<T extends Record<string, any>>(this: typeof BaseModel,record: any, model: Constructor<T>): T {
    const modelToColumnMapping = this.getModelToTableFieldMap();
    const instance = new model();
    const keys = Object.keys(instance);
    keys.forEach((key) => {
      if (record.hasOwnProperty(modelToColumnMapping[key])) {
        (instance as any)[key] = record[modelToColumnMapping[key]]; // Map record properties to instance
      }
    });
    return instance;
  }

}


type Constructor<T> = new (...args: any[]) => T;











