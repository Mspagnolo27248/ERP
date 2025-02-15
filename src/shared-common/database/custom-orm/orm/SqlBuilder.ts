

export class SqlBuilder implements ISqlBuilder {
  generateWhereClause<T>(
    whereFields: (keyof T)[],
    modelToTableMapping: Record<keyof T, string>,
    filters: Partial<T>
  ): { whereClause: string; parameters: any[] } {
    const parameters: any[] = [];
    const criteria: string[] = whereFields.map((key) => {
      const columnName = modelToTableMapping[key];
      const value = filters[key];
      parameters.push(value);
      return `${columnName}=?`;
    });
    return {
      whereClause: criteria.length > 0 ? `WHERE ${criteria.join(" AND ")}` : "",
      parameters
    };
  }

  generateInsertStatement<T extends Record<string, any>>(
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

  generateUpdateSQL<T extends Record<string, any>>(
    tableName: string,
    instance: T,
    modelToTableMapping: Record<(keyof T), string>,
    keyFields: (keyof T)[],
    identityFields: (keyof T)[]
  ): { sql: string; parameters: any[] } {
    const modelExcludingIdentyFields = this.dropPropertiesFromModel(instance, identityFields);
    const whereValues = this.filterModelByProperties(instance, keyFields);
    
    const { whereClause, parameters: whereParams } = this.generateWhereClause(keyFields, modelToTableMapping, whereValues);
    const { clause: setClause, parameters: setParams } = this.generateSetClause(modelExcludingIdentyFields, modelToTableMapping);

    const sql = `UPDATE ${tableName} ${setClause} ${whereClause}`;
    return { sql, parameters: [...setParams, ...whereParams] };
  }

  generateSetClause<T extends Record<string, any>>(
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

  private dropPropertiesFromModel<T extends Record<string, any>>(model: T, dropFields: (keyof T)[]): T {
    return Object.fromEntries(
      Object.entries(model).filter(([key]) => !dropFields.includes(key as keyof T))
    ) as T;
  }

  private filterModelByProperties<T extends Record<string, any>>(model: T, includeFields: (keyof T)[]): T {
    return Object.fromEntries(
      Object.entries(model).filter(([key]) => includeFields.includes(key as keyof T))
    ) as T;
  }
} 


export interface ISqlBuilder {
    generateWhereClause<T>(
      whereFields: (keyof T)[],
      modelToTableMapping: Record<keyof T, string>,
      filters: Partial<T>
    ): { whereClause: string; parameters: any[] };
  
    generateInsertStatement<T extends Record<string, any>>(
      tableName: string,
      record: T,
      modelToTableMapping: Record<string, string>
    ): { sql: string; parameters: any[] };
  
    generateUpdateSQL<T extends Record<string, any>>(
      tableName: string,
      instance: T,
      modelToTableMapping: Record<string, string>,
      keyFields: (keyof T)[],
      identityFields: (keyof T)[]
    ): { sql: string; parameters: any[] };
  
    generateSetClause<T extends Record<string, any>>(
      model: T,
      modelToTableMapping: Record<string, string>
    ): { clause: string; parameters: any[] };
  }