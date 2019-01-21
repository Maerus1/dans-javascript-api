const config = require('./common/config/environment');

const authRouter = require('./auth/routes');
const userRouter = require('./users/routes');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cookieParser = require('cookie-parser');

//api config
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST', 'OPTIONS', 'DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if(req.method == 'OPTIONS'){
        return res.sendStatus(200);
    }
    else{
        return next();
    }
});
//5c2e7902c45b2e04aafb6659
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser(config.cookieSecret));
//routers
authRouter.routes(app);
userRouter.routes(app);

//start
app.listen(config.port, function() {
    console.log(`app listening on port ${config.port}`);
});