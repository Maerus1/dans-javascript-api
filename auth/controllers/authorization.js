const jwtSecret = require('./../../common/config/environment').jwtSecret;
const expirationTime = require('./../../common/config/environment').jwtExpiration;
const refreshExpirationTime = require('./../../common/config/environment').refreshExpiration;
const saltRounds = require('./../../common/config/environment').saltRounds;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

exports.generateRefreshToken = (req, res, next) => {
    try{
        let userId = req.body.userId + jwtSecret;
        bcrypt.genSalt(saltRounds, function(err, salt){
            bcrypt.hash(userId, salt, function(err, hash){
                //send tokens to user
                let buff = Buffer.from(hash);
                let refreshToken = buff.toString('base64');
                let data = {
                    refreshToken: refreshToken
                }
                res.locals.refresh_token = refreshToken;
                //TODO: Add the secure flag in when ready to publish to production
                res.cookie('refresh_token', refreshToken, {maxAge: refreshExpirationTime, httpOnly: true, signed: true});
                return next();
            });
        });
    }catch(err){
        res.status(500).send({ errors:err });
    }
};

exports.generateAccessToken = (req, res) => {
    try{
        //send tokens to user
        let token;
        if(req.body){
            token = jwt.sign(req.body, jwtSecret);
        }
        else{
            token = jwt.sign(req.jwt, jwtSecret);
        }

        let refreshToken;

        if(!res.locals.refresh_token){
            refreshToken = res.locals.refresh_token;
        }
        else{
            refreshToken = req.signedCookies.refresh_token;
        }

        //TODO: Add the secure flag in when ready to publish to production
        res.cookie('access_token', token, {maxAge: expirationTime, httpOnly: true, signed: true});
        res.cookie('userId', req.body.userId, { maxAge: refreshExpirationTime });
        res.status(201).send({ accessToken: token, refreshToken: refreshToken });
    }catch(err){
        res.status(500).send({ errors:err });
    }
};

exports.refreshToken = (req, res) => {
    try{
        req.body = req.jwt;
        let token = jwt.sign(req.body, jwtSecret);
    }catch(err){
        res.status(500).send({ errors:err });
    }
};