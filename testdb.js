// if(connection.state === 'disconnected'){
//     return respond(null, { status: 'fail', message: 'server down'});
//   }


// Import mysql module
const { result } = require('lodash');
let mysql = require('mysql');

// Setup database connection parameter
let connection = mysql.createConnection({
host: 'localhost',
user: 'root',
password: 'root',
database: 'sit_home'
});

// Connect with the database
connection.connect(function(e) {
if (e) {

// Show error messaage on failure
return console.error('error: ' + e.message);
}

// Show success message if connected
console.log('\nConnected to the MySQL server...\n');
});


let query = 'SELECT * from auth_token'
connection.query(query, function(e, rows) {
    if(e){ 
        console.log(e) 
    }
    else { 
        //Option 1 - To show all query data witout RowDataPacket

        // let result = []
        // for(let row of rows){
        //     let data = {
        //         username: row.username,
        //         auth_token: row.auth_token,
        //         created_date: row.created_date
    
        //     }

        //     result.push(data)
        // }
        // console.log(result)


        //Option 2 
        var data = JSON.parse(JSON.stringify(rows))
        console.log(data)


     
    }
})

connection.end(function(){
    console.log('\nConnection closed.\n');
    });


