const UserModel = require('./../../users/models/user');
const bcrypt = require('bcrypt');

exports.fieldsAreValid = (req, res, next) => {
    let errors = [];
    
    if(req.body){
        if(!req.body.email){
            errors.push('Missing email field');
        }
        if(!req.body.password){
            errors.push('Missing password field');
        }
        if(errors.length){
            return res.status(400).send({ errors: errors.join(',') });
        }
        else{
            return next();
        }
    }
    else{
        return res.status(400).send({ errors: 'Missing email and password' });
    }
    
};

exports.credentialsMatch = (req, res, next) => {
    UserModel.findByEmail(req.body.email)
        .then((user) => {
            if(!user[0]){
                res.status(404).send();
            }
            else{
                let hash = user[0].password;
                
                bcrypt.compare(req.body.password, hash, function(err, response){
                    if(err) return res.status(500).send({ error: `There's an issue with the server, please contact your IT technician` });
                    if(!response) return res.status(400).send({ error: 'Invalid email or password' })
                    else {
                        req.body = {
                            userId: user[0]._id,
                            email: user[0].email,
                            permissionLevel: user[0].permissionLevel,
                            provider: 'email'
                        }
                        return next();
                    }
                });
            }
        });
};