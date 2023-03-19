const sql = require('./index')
const utils = require('../../components/utils')
const { query } = require('express')


var refreshToken = (arg) => {
    return new Promise(async (resolve, reject) => {
        const data = {
            username: arg.body.username,
            created_date :  utils.currentDateFormat()
        }

        try {
            const checkUsernameExist = await sql.executeQuery(`SELECT username from auth_token WHERE ?`, {username: arg.body.username})
            if (checkUsernameExist.length>0) {
                const results = JSON.parse(JSON.stringify(checkUsernameExist))
                if (results[0].username.includes(arg.body.username)) { 
                    // console.log('1')
                    const auth_token = utils.generateAuthToken(arg.body.username)
                    const query = `UPDATE auth_token SET auth_token = ? WHERE username =?`
    
                    await sql.executeQuery(query, [auth_token, arg.body.username])
                    return resolve(auth_token)
                }
            } else {
                // console.log('2')
                const auth_token = utils.generateAuthToken(arg.body.username)
                data.auth_token = auth_token

                const query = `INSERT INTO auth_token SET ?`

                await sql.executeQuery(query, data)
                return resolve(auth_token)
            }
        } catch(err) {
            return reject({
                statusCode: 500,
                message: err.message
            })
        }
    })
}

var clearToken = arg => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = {
                username: arg.body.username,
            }
    
            query = `UPDATE auth_token SET auth_token = NULL WHERE ?`
            
            await sql.executeQuery(query, data)
            return resolve()
        } catch (err)  {
            return reject (err)
        }
    })
}

var verifyToken = (arg) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('this is your token := ' + arg.body.auth_token)
            query = `SELECT username, created_date FROM auth_token WHERE ?`

            await sql.executeQuery(query, [arg.body.auth_token])
                .then(records => {
                    console.log(records)
                    if(records ){
                        let { username, created_date}  = records[0]
                        console.log(records)
                        return resolve ({username, created_date})
                    }

                    else return reject({ message: 'Authorization failed'})
                })
                .catch(err => {
                    return reject({ message: 'System Error- SQL query' + err.message})
                })

        } catch(err) {
            return reject (err)
        }
    })
}

module.exports = {
    refreshToken : refreshToken,
    clearToken :  clearToken,
    verifyToken : verifyToken
}