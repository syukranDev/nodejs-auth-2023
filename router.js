const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')

const router = express.Router()
const app = express()
const controller = require('./model/controller')

app.disable("x-powered-by")

//To use req.body
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));

//If payload in request has typo error
app.use((err, req, res, next) => {
    err ? res.status(400).json({ message: 'Invalid JSON'}) : next()
})

app.use('/portal/auth', router)  

router.route('/login')
    .post((...args) => controller.loginUser(...args))

router.route('/verifyToken')
    .post((...args) => controller.verifyToken(...args))

router.route('/logout') 
    .post(
          (...args) => controller.authValidator(...args),
          (...args) => controller.logoutUser(...args)
         )

router.route('/test')
    .post(
          (...args) => controller.authValidator(...args),
          (...args) => controller.test(...args))

app.listen('3003', () => {
    console.log('Connected to PORT 3003!')
})

