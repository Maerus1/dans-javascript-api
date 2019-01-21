const jwt = require('jsonwebtoken');
const secret = require('./../config/environment').jwtSecret;
const cookieSecret = require('./../config/environment').cookieSecret;
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const UserModel = require('./../../users/models/user');

exports.verifyRefreshBodyField = (req, res, next) => {
    if((req.jwt || req.body) && req.signedCookies.refresh_token){
        return next();
    }
    else{
        return res.status(400).send({ error: 'Must pass refresh_token field' });
    }
};

exports.validRefreshNeeded = (req, res, next) => {
    let buff = Buffer.from(req.signedCookies.refresh_token, 'base64');
    let refresh_token = buff.toString();
    let userId;
    if(req.body.userId){
        userId = req.body.userId;
    }
    else{
        userId = req.jwt.userId;
    }
    bcrypt.compare(userId + secret, refresh_token, function(err, response){
        if(err) return res.status(500).send({ error: 'Something went wrong with the server, please contact your administrator' });
        if(!response) res.status(400).send({ error: 'Invalid refresh token' });
        else{
            return next();
        }
    });
};

exports.validJWTNeeded = (req, res, next) => {
    if(req.signedCookies){
        try{
            
            if(req.signedCookies.access_token && req.signedCookies.refresh_token && req.signedCookies.userId){
                req.jwt = jwt.verify(req.signedCookies.access_token, secret);
                return next();
            }
            else if(req.signedCookies.refresh_token){
                //get the data from the database and send it to req.jwt so I can get a new access token
                UserModel.findById(req.cookies.userId)
                    .then((user) => {
                        req.body = {
                            userId: user.id,
                            email: user.email,
                            permissionLevel: user.permissionLevel,
                            provider: 'email'
                        }
                        return next();
                })
                    .catch((err) => {
                        return res.status(401).send();
                    });
                
            }
            else{
                return res.status(401).send();
            }
        }catch(err){
            return res.status(403).send();
        }
    }
    else{
        return res.status(401).send();
    }
}