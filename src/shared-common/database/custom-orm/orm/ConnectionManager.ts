export class ConnectionManager {
    private static instance: ConnectionManager;
    private connection: DatabaseConnection | null = null;
    private isConnected: boolean = false;

    private constructor() { }

    static getInstance(): ConnectionManager {
        if (!ConnectionManager.instance) {
            ConnectionManager.instance = new ConnectionManager();
        }
        return ConnectionManager.instance;
    }

    async configureConnection(type: 'sqlite' | 'mssql' | 'odbc', options: any): Promise<void> {
        // If already connected, disconnect first
        if (this.isConnected && this.connection) {
            await this.connection.disconnect();
            this.isConnected = false;
        }

        switch (type) {
            case 'sqlite':
                this.connection = new SQLiteConnection(options);
                break;
            // case 'mssql':
            //     this.connection = new MSSQLConnection(options);
            //     break;
            case 'odbc':
                this.connection = new ODBCConnection(options);
                break;
            default:
                throw new Error('Unsupported database type.');
        }

        // Establish the connection immediately
        await this.connection.connect();
        this.isConnected = true;
    }

    async getConnection(): Promise<DatabaseConnection> {
        if (!this.connection) {
            throw new Error('Database connection is not configured.');
        }

        if (!this.isConnected) {
            await this.connection.connect();
            this.isConnected = true;
        }

        return this.connection;
    }

    async closeConnection(): Promise<void> {
        if (this.connection && this.isConnected) {
            await this.connection.disconnect();
            this.isConnected = false;
        }
    }
}

export interface DatabaseConnection {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    executeQuery(query: string, params?: any[]): Promise<any>;
    tryTransaction(statements: string[]): Promise<void>;
    beginTransaction(): Promise<void>;
    commitTransaction(): Promise<void>;
    rollbackTransaction(): Promise<void>;
}





import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

class SQLiteConnection implements DatabaseConnection {
  private db: Database | null = null;
  private readonly options: { database: string };
  private inTransaction: boolean = false;

  constructor(options: { database: string }) {
    this.options = options;
  }

  async connect(): Promise<void> {
    this.db = await open({
      filename: this.options.database,
      driver: sqlite3.Database,
    });
    console.log(`Connected to SQLite database: ${this.options.database}`);
  }

  async disconnect(): Promise<void> {
    if (this.db) {
      await this.db.close();
      console.log(
        `Disconnected from SQLite database: ${this.options.database}`
      );
    }
  }

  
  async executeQuery(query: string, params: any[] = []): Promise<any> {
    if (!this.db) {
      throw new Error("SQLite database is not connected.");
    }
    try {
      if (query.trim().toUpperCase().startsWith("SELECT")) {
        return await this.db.all(query, params); // Fetch multiple rows for SELECT queries
      } else {
        return await this.db.run(query, params); // Execute other types of queries
      }
    } catch (error:any) {
        throw new Error(error?.message ? error.message : "Error executing SQL");
    }
  }

  async tryTransaction(statements: string[]): Promise<void> {
    if (!this.db) {
      throw new Error("SQLite database is not connected.");
    }
    try {
      await this.db.exec("BEGIN TRANSACTION");

      for (const statement of statements) {
        await this.db.exec(statement);
      }

      await this.db.exec("COMMIT");
    
    } catch (error) {
      await this.db.exec("ROLLBACK");
      throw error;
    }
  }

  async beginTransaction(): Promise<void> {
    if (!this.db) {
      throw new Error("SQLite database is not connected.");
    }
    if (this.inTransaction) {
      throw new Error("Transaction already in progress.");
    }
    await this.db.exec("BEGIN TRANSACTION");
    this.inTransaction = true;
  }

  async commitTransaction(): Promise<void> {
    if (!this.db) {
      throw new Error("SQLite database is not connected.");
    }
    if (!this.inTransaction) {
      throw new Error("No transaction in progress.");
    }
    await this.db.exec("COMMIT");
    this.inTransaction = false;
  }

  async rollbackTransaction(): Promise<void> {
    if (!this.db) {
      throw new Error("SQLite database is not connected.");
    }
    if (!this.inTransaction) {
      throw new Error("No transaction in progress.");
    }
    await this.db.exec("ROLLBACK");
    this.inTransaction = false;
  }
}


import * as odbc from 'odbc';

class ODBCConnection implements DatabaseConnection {
  private connection: odbc.Connection | null = null;
  private readonly options: { connectionString: string };
  private inTransaction: boolean = false;

  constructor(options: { connectionString: string }) {
    this.options = options;
  }

  async connect(): Promise<void> {
    if (!this.connection) {
      this.connection = await odbc.connect(this.options.connectionString);
      // Configure connection settings
      await this.connection.query("SET NOCOUNT ON");
      await this.connection.query("SET XACT_ABORT ON"); // Automatically rollback on error
      console.log('Connected to ODBC database.');
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      if (this.inTransaction) {
        await this.rollbackTransaction();
      }
      await this.connection.close();
      this.connection = null;
      console.log('Disconnected from ODBC database.');
    }
  }

  async executeQuery(query: string, params: any[] = []): Promise<any> {
    if (!this.connection) {
      throw new Error('ODBC database is not connected.');
    }

    try {
      const result = await this.connection.query(query, params);
      return Array.isArray(result) ? result : result ? [result] : [];
    } catch (error: any) {
      console.error('SQL Error:', error);
      if (error.odbcErrors) {
        console.error('ODBC Errors:', JSON.stringify(error.odbcErrors, null, 2));
      }
      throw error;
    }
  }

  async tryTransaction(statements: string[]): Promise<void> {
    if (!this.connection) {
      throw new Error('ODBC database is not connected.');
    }

    try {
      await this.beginTransaction();
      
      for (const statement of statements) {
        await this.executeQuery(statement);
      }

      await this.commitTransaction();
    } catch (error) {
      await this.rollbackTransaction();
      throw error;
    }
  }

  async beginTransaction(): Promise<void> {
    if (!this.connection) {
      throw new Error('ODBC database is not connected.');
    }
    if (this.inTransaction) {
      throw new Error("Transaction already in progress.");
    }
    await this.connection.query("SET IMPLICIT_TRANSACTIONS OFF");
    await this.connection.query("SET XACT_ABORT ON");
    await this.connection.query("BEGIN TRAN");
    this.inTransaction = true;
  }

  async commitTransaction(): Promise<void> {
    if (!this.connection) {
      throw new Error('ODBC database is not connected.');
    }
    if (!this.inTransaction) {
      throw new Error("No transaction in progress.");
    }
    await this.connection.query("COMMIT TRAN");
    this.inTransaction = false;
  }

  async rollbackTransaction(): Promise<void> {
    if (!this.connection) {
      throw new Error('ODBC database is not connected.');
    }
    if (!this.inTransaction) {
      return; // Silently return if no transaction is in progress
    }
    await this.connection.query("IF @@TRANCOUNT > 0 ROLLBACK TRAN");
    this.inTransaction = false;
  }
}
