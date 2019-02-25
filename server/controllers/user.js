var User = require('../models/User');

exports.signup = function(req, res) {
    var user = new User({
        fname : req.body.fname,
        lname : req.body.lname,
        mail : req.body.mail,
        password : req.body.password,
        tokens : [{
            validity : 3456000000,
            id : generateToken(45),
            since : Date.now()
        }]
    });

    var token = user.tokens[0];
    console.log(user);
    User.findOne({ mail : user.mail }, function (err, response){
        if (response) return (res.json({ register : false, alreadyExist : true }));
        user.save(function (err){
            (err) ? res.send(err) : res.json({ register : true, userId : user._id, token : token });
        });
    });
};


/*
** GENERATE TOKEN
*/
function generateToken (len) {
    var buf = []
        , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        , charlen = chars.length;

    for (var i = 0; i < len; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
};

/*
** RANDOM
*/
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
** GET TOKEN INDEX
*/
function getToken(datas, token) {
    var index = -1;
    for (var i = 0; i < datas.length; i++) {
        if (datas[i].id === token)
            return index = i;
    };
    return index;
}