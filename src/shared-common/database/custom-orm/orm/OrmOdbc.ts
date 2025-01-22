import odbc from "odbc";
import { AbstractORM, ORMDatabaseAdapter } from "./AbstractORM";
const  CONNECTION_STRING = 'DSN=AS400;UID=MSTEST;PWD=MSTEST';


export class ODBCORM extends AbstractORM implements ORMDatabaseAdapter  {
  protected static async getConnection() {
    return await odbc.connect(CONNECTION_STRING);
  }

  protected static async executeQuery(db: any, query: string) {
    return await db.query(query);
  }

  protected static async closeConnection(db: any) {
    await db.close();
  }
}
