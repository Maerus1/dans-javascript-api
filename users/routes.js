const userController = require('./controllers/users');
const userPermissionMiddleware = require('./../common/middleware/authPermission');
const userValidationMiddleware = require('./../common/middleware/authValidation');
const config = require('./../common/config/environment');

const ADMIN = config.permissionLevels.ADMIN;
const SPECIAL = config.permissionLevels.SPECIAL_USER;
const NORMAL = config.permissionLevels.NORMAL_USER;

exports.routes = function(app) {
    app.post('/users', [
        userController.insert
    ]);
    app.get('/users', [
        userValidationMiddleware.validJWTNeeded,
        userPermissionMiddleware.minimumPermissionLevelRequired(SPECIAL),
        userController.list
    ]);
    app.get('/users/:userId', [
        userValidationMiddleware.validJWTNeeded,
        userPermissionMiddleware.minimumPermissionLevelRequired(NORMAL),
        userPermissionMiddleware.sameUserorAdmin,
        userController.getById
    ]);
    app.patch('/users/:userId', [
        userValidationMiddleware.validJWTNeeded,
        userPermissionMiddleware.minimumPermissionLevelRequired(NORMAL),
        userPermissionMiddleware.sameUserorAdmin,
        userController.patchById
    ]);
    app.delete('/users/:userId', [
        userValidationMiddleware.validJWTNeeded,
        userPermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        userController.removeById
    ]);
};