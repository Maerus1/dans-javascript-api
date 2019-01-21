const authController = require('./controllers/authorization');
const userAuthMiddleware = require('./middleware/userAuth');
const authValidationMiddleware = require('./../common/middleware/authValidation');

exports.routes = function(app){
    app.post('/auth', [
        userAuthMiddleware.fieldsAreValid,
        userAuthMiddleware.credentialsMatch,
        authController.generateRefreshToken,
        authController.generateAccessToken
    ]);
    app.get('/auth/refresh', [
        authValidationMiddleware.validJWTNeeded,
        authValidationMiddleware.verifyRefreshBodyField,
        authValidationMiddleware.validRefreshNeeded,
        authController.generateAccessToken
    ]);
};