import * as odbc from 'odbc';

// ODBC Connection String (Adjust according to your database)
const connectionString = 'DSN=SQLODBC;UID=mstest;PWD=mstest';

async function main() {
    let connection: odbc.Connection | null = null;

    try {
        // Establish Connection
        connection = await odbc.connect(connectionString);
        console.log('Connected to the database.');

        // SELECT Query
        const selectResult = await connection.query('SELECT * FROM GGSPROD');
        console.log('SELECT Result:', selectResult);

        // INSERT Query
        // const insertResult = await connection.query("INSERT INTO GGSPROD (TPPROD, TPDESC) VALUES (?,?)",['PROD1', 'TEST']);
        // console.log('INSERT Result:', insertResult);
        const insertResult = await connection.query("INSERT INTO GGSPROD (TPPROD, TPDESC) VALUES (?,?)",['PROD1', 'TEST']);
        console.log('INSERT Result:', insertResult);



        // Prepared Statement for INSERT
        const statement = await connection.createStatement();
         await statement.prepare("INSERT INTO GGSPROD (TPPROD, TPDESC) VALUES (?,?)");
         await statement.bind(['PROD2', 'TEST2']);
        const results = await statement.execute();
        console.log('INSERT Result:', results);      


        // UPDATE Query
        const updateResult = await connection.query("UPDATE GGSPROD SET TPDESC = 'new_value' WHERE TPPROD = 'PROD1'");
        console.log('UPDATE Result:', updateResult);

        // DELETE Query
        const deleteResult = await connection.query("DELETE FROM GGSPROD WHERE TPPROD = 'PROD1'");
        console.log('DELETE Result:', deleteResult);

    } catch (error) {
        console.error('Database Error:', error);
    } finally {
        // Close Connection
        if (connection) {
            await connection.close();
            console.log('Connection closed.');
        }
    }
}

main();
