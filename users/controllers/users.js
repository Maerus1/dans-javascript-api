const UserModel = require('./../models/user');
const bcrypt = require('bcrypt');
const expirationTime = require('./../../common/config/environment').jwtExpiration;

const SALT_ROUNDS = 10;

exports.insert = (req, res) => {
    bcrypt.genSalt(SALT_ROUNDS, function(err, salt){
        bcrypt.hash(req.body.password, salt, function(err, hash){
            req.body.password = hash;
            req.body.permissionLevel = 1;
            UserModel.createUser(req.body)
                .then((result) => {
                    res.status(201).send({ id: result._id });
                });
        });
    });
};

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if(req.query){
        if(req.query.page){
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    UserModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.getById = (req, res) => {
    UserModel.findById(req.cookies.userId)
        .then((result) => {
            res.status(200).send(result);
        });
};

exports.patchById = (req, res) => {
    if(req.body.password){
        bcrypt.genSalt(SALT_ROUNDS, function(err, salt){
            bcrypt.hash(req.body.password, salt, function(err, hash){
                req.body.password = hash;
                UserModel.patchUser(req.cookies.userId, req.body)
                    .then((result) => {
                    res.status(200).send(result);
                });
            });
        });
    }

    
};

exports.removeById = (req, res) => {
    UserModel.removeById(req.cookies.userId)
        .then((result) => {
            res.status(204).send({ "Message": "User removed successfully" });
        })
}