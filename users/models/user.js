const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dans-api', { useNewUrlParser:true });
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String,
    password: String,
    permissionLevel: Number
});

userSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals:true
});

userSchema.findById = function(cb){
    return this.model('Users').find({ id: this.id }, cb)
};

const User = mongoose.model('Users', userSchema);

exports.findByEmail = (email) => {
    return User.find({ email: email });
};

exports.findById = (id) => {
    return User.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createUser = (userData) => {
    const user = new User(userData);
    return user.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        User.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function(err, users){
                if(err) reject(err);
                else resolve(users);
            });
    });
};

exports.patchUser = (id, userData) => {
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(id, userData ,{ new: true }, function(err, updatedUser){
            if(err) reject(err);
            resolve(updatedUser);
        })
    });
};

exports.removeById = (userId) => {
    return new Promise((resolve, reject) => {
        User.deleteOne({_id: userId}, (err) => {
            if(err) reject(err);
            else resolve(err);
        });
    });
};