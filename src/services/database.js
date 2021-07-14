const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.fetchAsString = [oracledb.CLOB];
const dbconfig = require('../config/dbconfig');
const Utils = require('../utils/commonUtils');

async function requestExecute(statement, binds = {}, opts = {}) {
    let connection;
    binds = {
        ...binds, 
        ret: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR, resultSet: true }
    }
    try {
        connection = await oracledb.getConnection(dbconfig);
        let results = await connection.execute(statement, binds, opts);
        const resultSet = results.outBinds.ret;
        const data = await Utils.extractArrayDataFromRs(resultSet);

        // always close the ResultSet
        await resultSet.close();
        return data;
    } catch (error) {
        console.log(error);
        return [];
    } finally {
        if (connection) {
            try {
                // always close connections.
                await connection.close();
            } catch (err) {
                console.log(err);
            }
        }
    }
}

module.exports.execute = requestExecute;