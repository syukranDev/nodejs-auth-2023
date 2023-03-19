const jwt = require('jsonwebtoken')
const SECRET_KEY = 'learn-nodejs'
// const axios = require('axios')
var httpRequest = require('request')
var utils = require('../components/utils')
var Auth = require('./auth')
const auth = new Auth()

let CONCURRENT_LOGIN = true

async function refreshToken(req){
    return await auth.refreshToken(req)
}

async function clearToken(req) {
    return await auth.clearToken(req)
}

const loginUserCtrl = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log(req.body)
            if(req.body.username) {
                //we generate token in utils and saved in db
                var auth_token = await refreshToken(req)
                return resolve({
                    username: req.body.username,
                    auth_token: auth_token
                })
            }
        } catch (err) {
            return reject(err)
        }
    })
}

const verifyTokenCtrl = (req) => {
    return new Promise((resolve, reject) => {
        var bearerHeader = req.headers['authorization']
        if (typeof bearerHeader !== 'undefined') {
            // logger.info()
            var bearer = bearerHeader.split(' ');
            var bearerToken = bearer[1];
            req.body.auth_token = bearerToken;

            const validate = utils.verifyJWT(bearerToken)
             
            console.log(validate) 
            if(validate.signature) { 
                auth.verifyToken(req).then((result) => {
                    console.log('1')
                    return resolve({ message: 'success', data : result})
                }).catch((err) => {
                    return reject (err)
                })
            }
            else { 
                return reject({
                    statusCode: 401,
                    message: "Unathorized!"
                }) 
            }
        } else {
            return reject({
                statusCode: 401,
                message: "Unathorized!"
            })
        }
    })
}

const logoutUserCtrl = (req) => {
    return new Promise(async  (resolve, reject) => {
           await auth.clearToken(req)
                .then((data) => {
                    return resolve('User logout success')
                })
                .catch(err => {
                    return reject(err)
                })
        
    })
}


module.exports.verifyToken = function verifyToken(req, res) {
	//let start_benchmark = process.hrtime();
	// logger.info()
	return verifyTokenCtrl(req)
		.then(function (results) {
			return res.send(results);
		})
		.catch(reason => {
			return res.send(reason);
			//return res.send(reason);
            
		})
};

module.exports.loginUser = function loginUser(req, res) {
    let start_benchmark = process.hrtime();
    // logger.info({})

    return loginUserCtrl(req)
        .then((results) => {
            // printEndLogs
            return res.send(results)
        }).catch(err => {
            return res.send(err)
        })
}

module.exports.test = function test(req, res) {
    return  res.json({ data: { id: 2, bookName: 'Bed Stories 2033'}})
        
}


module.exports.authValidator = function authValidator(req, res, next) {
    req.auth = {};
    let VERIFY_AUTHTOKEN_URL = 'http://localhost:3003/portal/auth/verifyToken'
    var options = {
        "url": VERIFY_AUTHTOKEN_URL,
        "method": "POST",
        timeout: (1000 * 38), // sets timeout to 38 seconds
        data: req.body,
        headers: req.headers
    };
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    httpRequest(options, function (err, response, body) {
        if (err) {
            return res.status(401)
        }else {
            const parsedResponse = JSON.parse(response.body)
            if(response.statusCode == 200){
                req.auth = Object.assign(req.auth, parsedResponse.data)
                return next();
            }else{
                return res.status(response.statusCode)
            }
        }
    })
}

module.exports.logoutUser = function logoutUser(req, res) {
    return logoutUserCtrl(req)
        .then((result) => {
            return res.send(result)
        })
        .catch(err => {
            res.send(err)
        })
        
}