var User = require('../models/User');
var tools = require('../tools/tools');
var FB = require("fb");

exports.signup = function(req, res) {
    var user = new User({
        fname: req.body.fname,
        lname: req.body.lname,
        mail: req.body.mail,
        password: req.body.password,
        officeId: null,
        Facebook: {
            token: null,
            id: null
        },
        connectionType: 0,
        tokens: [{
            validity: 3456000000,
            id: generateToken(45),
            since: Date.now()
        }]
    });

    var token = user.tokens[0];
    User.findOne({ mail : user.mail }, function (err, response){
        if (response) return (res.json({ register : false, alreadyExist : true }));
        user.save(function (err){
            (err) ? res.send(err) : res.json({ register : true, userId : user._id, token : token });
            tools.lowLevelLog(user.fname + ' ' + user.lname + " created an account");
        });
    });
};

exports.signupOffice = function(req, res) {
    var user = new User({
        fname: req.body.fname,
        lname: req.body.lname,
        mail: req.body.mail,
        password: req.body.password,
        officeId: null,
        Facebook: {
            token: null,
            id: null
        },
        connectionType: 1,
        tokens: [{
            validity : 3456000000,
            id : generateToken(45),
            since : Date.now()
        }]
    });

    var token = user.tokens[0];
    User.findOne({ mail : user.mail }, function (err, response){
        if (response) return (res.json({ register : false, alreadyExist : true }));
        user.save(function (err){
            (err) ? res.send(err) : res.json({ register : true, userId : user._id, token : token });
            tools.lowLevelLog(user.fname + ' ' + user.lname + " created an account");
        });
    });
};

exports.signupFacebook = function(req, res) {
    var user = new User({
        fname: null,
        lname: null,
        mail:  null,
        password: null,
        officeId: null,
        Facebook: {
            token: req.body.accessToken,
            id: req.body.userId
        },
        connectionType: 1,
        tokens: [{
            validity : 3456000000,
            id : generateToken(45),
            since : Date.now()
        }]
    });

    FB.setAccessToken(req.body.accessToken);
    FB.api('/me?fields=name,email', 'get', function (fbCred) {
        if (!res || res.error) {
            tools.criticLevelLog(!res ? 'error occurred' : res.error);
            return res.json({register: false});
        }
        user.fname = fbCred.name.split(' ')[0];
        user.lname = fbCred.name.substr(fbCred.name.split(' ')[0].length + 1, fbCred.name.length);

        let token = user.tokens[0];
        User.findOne({mail: user.mail}, function (err, response) {
            if (response) return (res.json({register: false, alreadyExist: true}));
            user.save(function (err) {
                (err) ? res.send(err) : res.json({register: true, userId: user._id, token: token});
                tools.lowLevelLog(user.fname + ' ' + user.lname + " created an account");
            });
        });
    });
};

exports.signin = function (req, res) {
    console.log(req.body.mail);
    console.log(req.body.password);
    User.findOne({ mail : req.body.mail }, function (err, user){
        if (err) return res.send(err);
        if (!user) {
            tools.lowLevelLog(req.body.mail + " try to login but not registered.");
            return res.json({ logged : false });
        }

        user.verifyPassword(req.body.password, function (err, isMatch) {
            if (err) return res.send(err);
            if (!isMatch) return res.json({ logged : false });

            let newToken = { validity : 3456000000, id : generateToken(45), since : Date.now() };
            user.tokens.push(newToken);
            user.save(function (err) {
                (err) ? res.send(err) : res.json({ logged : true, userId : user._id, token : newToken });
                tools.lowLevelLog(user.fname + ' ' + user.lname + " connected.");
            });
        });
    });
};

exports.signinFacebook = function (req, res) {
    User.findOne({ "Facebook.id" : req.body.userId }, function (err, user){
        if (err) return res.send(err);
        if (!user) {
            tools.lowLevelLog(req.body.mail + " try to login but not registered.");
            return res.json({ logged : false });
        }

            let newToken = { validity : 3456000000, id : generateToken(45), since : Date.now() };
            user.tokens.push(newToken);
            user.Facebook.token = req.body.accessToken;
            user.save(function (err) {
                (err) ? res.send(err) : res.json({ logged : true, userId : user._id, token : newToken });
                tools.lowLevelLog(user.fname + ' ' + user.lname + " connected.");
            });
    });
};


exports.user = function (req, res) {
    User.findOne({ "tokens.id" : req.headers.authorization }, function (err, user){
         if (err) res.json({ logged : false });
         return res.json({ fname : user.fname, lname : user.lname, mail : user.mail });
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