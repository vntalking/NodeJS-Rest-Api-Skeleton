const oracledb = require('oracledb');
const dbConfig = require('./config/dbconfig');

// This class have only purpose test connect to Oracle Database. Not handle logic project.
// Run test: note ./checkConnection.js
let connection;
async function checkConnection() {
  try {
    connection = await oracledb.getConnection( {
      user          : "smarttrees",
      password      : "123456",
      connectString : "10.23.11.130:1521/ORCL"
    });
    console.log(dbConfig)
    console.log('connected to database');
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        // Always close connections
        await connection.close(); 
        console.log('close connection success');
      } catch (err) {
        console.error(err.message);
      }
    }
  }
}

checkConnection();