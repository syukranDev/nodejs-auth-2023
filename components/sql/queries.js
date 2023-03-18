const sql = require('./index')
const utils = require('../../components/utils')

var refreshToken = (arg) => {
    return new Promise(async (resolve, reject) => {
        const data = {
            username: arg.body.username
        }

        try {
            const auth_token = utils.generateAuthToken(arg.body.username)
            data.auth_token = auth_token

            const query = `IF (NOT EXIST(SELECT * FROM [auth_token] where username=@username))
                           BEGIN 
                                INSERT INTO [auth_token](username, auth_token, created_date)
                                VALUES (@username, @auth_token, GETDATE())
                           END

                           ELSE
                                UPDATE [auth_token] SET auth_token=@auth_token, created_date = GETDATE() WHERE username=@username
                           END`

            await sql.executeQuery(query, data)
            return resolve(auth_token)
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