const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
    fname : String,
    lname : String,
    email : String,
    image : String,
    password : String,
    tokens : []
});

/*
** BEFORE SAVING USER
*/
UserSchema.pre('save', function(callback){
    var user = this;

    if (!user.isModified('password')) return callback();

    bcrypt.genSalt(5, function (err, salt) {
        if (err) return callback(err);

        bcrypt.hash(user.password, salt, null, function (err, hash) {
               if (err) return callback(err);
            user.password = hash;
            callback();
        });
    });
});


/*
** VERIFY
*/
UserSchema.methods.verifyPassword = function (password, cb) {
    if (!password) cb(null);
    bcrypt.compare(password, this.password, function (err, isMatch){
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);
