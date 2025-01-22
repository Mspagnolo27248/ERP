export class ConnectionManager {
    private static instance: ConnectionManager;
    private connection: DatabaseConnection | null = null;

    private constructor() { }

    static getInstance(): ConnectionManager {
        if (!ConnectionManager.instance) {
            ConnectionManager.instance = new ConnectionManager();
        }
        return ConnectionManager.instance;
    }

    configureConnection(type: 'sqlite' | 'mssql' | 'odbc', options: any): void {
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
    }

    getConnection(): DatabaseConnection {
        if (!this.connection) {
            throw new Error('Database connection is not configured.');
        }
        return this.connection;
    }
}

export interface DatabaseConnection {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    executeQuery(query: string, params?: any[]): Promise<any>;
}





import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

class SQLiteConnection implements DatabaseConnection {
    private db: Database | null = null;
    private readonly options: { database: string };

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
            console.log(`Disconnected from SQLite database: ${this.options.database}`);
        }
    }

    async executeQuery(query: string, params: any[] = []): Promise<any> {
        if (!this.db) {
            throw new Error('SQLite database is not connected.');
        }
        if (query.trim().toUpperCase().startsWith('SELECT')) {
            return this.db.all(query, params); // Fetch multiple rows for SELECT queries
        } else {
            return this.db.run(query, params); // Execute other types of queries
        }
    }
}



import * as odbc from 'odbc';

class ODBCConnection implements DatabaseConnection {
  private connection: odbc.Connection | null = null;
  private readonly options: { connectionString: string };

  constructor(options: { connectionString: string }) {
    this.options = options;
  }

  async connect(): Promise<void> {
    this.connection = await odbc.connect(this.options.connectionString);
    console.log('Connected to ODBC database.');
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
      console.log('Disconnected from ODBC database.');
    }
  }

  async executeQuery(query: string, params: any[] = []): Promise<any> {
    if (!this.connection) {
      throw new Error('ODBC database is not connected.');
    }

    // Replace placeholders with parameterized values if needed
    const formattedQuery = this.formatQuery(query, params);
    const result = await this.connection.query(formattedQuery);
    return result;
  }

  private formatQuery(query: string, params: any[]): string {
    if (params.length === 0) return query;
    let index = 0;
    return query.replace(/\?/g, () => {
      const param = params[index++];
      return typeof param === 'string' ? `'${param}'` : param;
    });
  }
}
