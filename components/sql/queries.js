const sql = require('./index')
const utils = require('../../components/utils')


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

module.exports = {
    refreshToken: refreshToken
}