// const sql = require('mssql');
// const mysql = require('mysql')
// const _ = require('lodash');
// // const logger = require("../logger").logger

// const dbConfig = { 
//   host: 'localhost',
//   user: 'root',
//   password: 'root',
//   database: 'sit_home'
// }
// var pool;

// function dbErrorHandler(err) {
// //   logger.error({
// //     path: "indexSQL/dbErrorHandler",
// //     message: err.message,
// //     stack: err.stack,
// //     info: 'DB Error Handler'
// //   })
//   try {
//     pool.close();
//   } catch (err) {
//       console.log({message: err.message})
//     // logger.error({
//     //   time: new Date(),
//     //   path: "mssql_db_helper/closing connection ",
//     //   message: _err.message || _err,
//     //   stack: _err.stack,
//     //   info: 'DB Error Closing Connection'
//     // })
//   }

//   connect()
// }

// function connect() {
//   new mysql.createConnection(dbConfig).connect((e) => {
//     if (e) console.log('error: ' + e.message)
//   })
// }

// connect();


// module.exports.executeQuery = function executeQuery(query, data) {
//   return new Promise(function(resolve, reject) {
//     let dbRequest = connect(pool)

    

//     if (data) {
//       _.each(data, function(value, key) {
//         dbRequest.input(key, value);
//       })
//     }

//     dbRequest.query(query)
//       .then(function(recordset) {
//         // logger.debug({
//         //   path: "indexSQL/executeQuery",
//         //   query: query,
//         //   queryData: data,
//         //   rowsAffected: recordset.rowsAffected,
//         //   recordset: recordset.recordset
//         // });
// 		  /*
//         if (recordset.rowsAffected == 0) {
//           return reject(new Error('no data found'))
//         }
// 		  */
//         return resolve(recordset.recordset);
//       }).catch(function(err) {
//         // logger.error({
//         //   path: "indexSQL/executeQuery",
//         //   query: query,
//         //   queryData: data,
//         //   message: err && err.message,
//         //   stack: err && err.stack,
//         // });
//         if (err.message == "No connection is specified for that request.")
//           dbErrorHandler(err);

//         return reject(err);
//       });
//   })
// }


// ///////


///////////////////////////


// Import mysql module
let mysql = require('mysql');

// Define the constructor function
module.exports.executeQuery = function executeQuery(query, data) {
  // Setup database connection parameter
  console.log({
    query: query,
    data: data
  })
  let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'sit_home'
  });
  
  // Return a promise that resolves with the query result
  return new Promise((resolve, reject) => {
    // Connect with the database
    connection.connect(function(e) {
      if (e) {
        // Reject the promise with the error message on failure
        reject('error: ' + e.message);
      } else {
        // Execute the query and return the result
        connection.query(query, data, function(e, rows) {
          if (e) {
            // Reject the promise with the error message on query error
            reject(e);
          } else {
            // Resolve the promise with the query result
            resolve(rows);
          }
        });
      }
    });
    
    // put timeout since have error if declared wihout
    setTimeout(() => {connection.end();}, 1500)
  });
}

