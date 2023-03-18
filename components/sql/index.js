const sql = require('mssql');
const mysql = require('mysql')
const _ = require('lodash');
// const logger = require("../logger").logger

const dbConfig = { 
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'sit_home'
}
var pool;

function dbErrorHandler(err) {
//   logger.error({
//     path: "indexSQL/dbErrorHandler",
//     message: err.message,
//     stack: err.stack,
//     info: 'DB Error Handler'
//   })
  try {
    pool.close();
  } catch (err) {
      console.log({message: err.message})
    // logger.error({
    //   time: new Date(),
    //   path: "mssql_db_helper/closing connection ",
    //   message: _err.message || _err,
    //   stack: _err.stack,
    //   info: 'DB Error Closing Connection'
    // })
  }

  connect()
}

function connect() {
  new mysql.createConnection(dbConfig).connect().then(_pool => {
      pool = _pool;
    //   logger.info({
    //     path: "indexSQL/connect",
    //     info: "Connection pool created",
    //     dbServer: dbConfig.server,
    //     dbName: dbConfig.database
    //   });

      pool.on('error', () => {});

  }, () => {})
.catch(err => {
//   logger.error({
//     path: "indexSQL/ConnectionPool",
//     info: "Connection Error",
//     err_message: err && err.message,
//     err_stack: err && err.stack,
//   });
  throw new Error(err);
})
}

connect();


module.exports.executeQuery = function executeQuery(query, data) {
  return new Promise(function(resolve, reject) {
    let dbRequest = new mysql.Request(pool);

    

    if (data) {
      _.each(data, function(value, key) {
        dbRequest.input(key, value);
      })
    }

    dbRequest.query(query)
      .then(function(recordset) {
        // logger.debug({
        //   path: "indexSQL/executeQuery",
        //   query: query,
        //   queryData: data,
        //   rowsAffected: recordset.rowsAffected,
        //   recordset: recordset.recordset
        // });
		  /*
        if (recordset.rowsAffected == 0) {
          return reject(new Error('no data found'))
        }
		  */
        return resolve(recordset.recordset);
      }).catch(function(err) {
        // logger.error({
        //   path: "indexSQL/executeQuery",
        //   query: query,
        //   queryData: data,
        //   message: err && err.message,
        //   stack: err && err.stack,
        // });
        if (err.message == "No connection is specified for that request.")
          dbErrorHandler(err);

        return reject(err);
      });
  })
}


///////

