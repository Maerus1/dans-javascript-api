const jwt = require('jsonwebtoken');
const secret = require('./../config/environment').jwtSecret;
const ADMIN_PERMISSION = 7;

exports.minimumPermissionLevelRequired = (requiredPermissionLevel) => {
    return (req, res, next) => {
        let userPermissionLevel = parseInt(req.body.permissionLevel);
        let userId = req.body.userId;
        if(userPermissionLevel >= requiredPermissionLevel){
            return next();
        }
        else{
            return res.status(403).send();
        }
    };
};

exports.sameUserorAdmin = (req, res, next) => {
    let userPermissionLevel = parseInt(req.body.permissionLevel);
    let userId = req.body.userId;
    if(req.cookies && req.cookies.userId && userId === req.cookies.userId){
        return next();
    }
    else{
        if(userPermissionLevel === ADMIN_PERMISSION){
            return next();
        }
        else{
            return res.status(403).send();
        }
    }
};

exports.sameUserDenied = (req, res, next) => {
    let userId = req.body.userId;
    if(req.cookies.userId !== userId){
        return next();
    }
    else{
        return res.status(400).send();
    }
};