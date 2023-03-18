const SECRET_KEY = 'learn-nodejs'

function generateAuthToken(username) {
    let data = {
        username: username,
        date: new Date()
    }

    return jwt.sign(data, SECRET_KEY, { expiresIn: '30m'})
}

const jwt = require('jsonwebtoken')

function verifyJWT(token) {
    return jwt.verify(token, 'learn-nodejs', { complete: true}, (err, decoded) => {
        if (err) {
            return err.message
        } else return decoded
    })
}

module.exports = {
    verifyJWT : verifyJWT,
    generateAuthToken: generateAuthToken
}