const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()

const SECRET_KEY = 'learn-nodejs'

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the API'
    })
})

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, SECRET_KEY, (err, authData) => {
        if (err) {
            res.sendStatus(403) //forbidden
        } else {
            res.json({
                message: 'Post created....',
                authData: authData
             })
        }
    })
    
})

app.post('/api/login', (req, res) => {
    //Mock user
    const user = {
        id : 1,
        username: 'Syukran',
        email: 'syukran@gmail.com'
    }
    
    jwt.sign({user: user}, SECRET_KEY, { expiresIn:'30s' }, (err, token) => {
        res.json({
            token: token
        })
    })
})

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

function verifyToken(req, res, next) {
    //Get auth header value
    const bearerHeader = req.headers['authorization'];
    //Check if bearer is undefined
    if (typeof(bearerHeader) !== 'undefined') {
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else res.json({ message: 'Unauthorized access'})
}

app.listen(3005, () => {
    console.log('Listening to PORT 3005!')
})