var User = require('../models/User');
var tools = require('../tools/tools');
var FB = require("fb"),
    fb = new FB.Facebook({ appId: '299009090787184', appSecret: 'd1e4d684d6fe3d75d2fbbd2809573c68'});

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
        Instagram : {
            token : null
        },
        Google : {
            token : null,
            mail : null,
            idToken : null,
            uid : null,
        },
        connectionType: 0,
        tokens: [{
            validity: 3456000000,
            id: generateToken(45),
            since: Date.now()
        }],
        widgets : []
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
        Instagram : {
            token : null
        },
        Google : {
            token : null,
            mail : null,
            idToken : null,
            uid : null,
        },
        connectionType: 1,
        tokens: [{
            validity : 3456000000,
            id : generateToken(45),
            since : Date.now()
        }],
        widgets : []
    });

    fb.setAccessToken(req.body.accessToken);
    fb.api('/' + req.body.userId + '/feed?fields=message=Hello Fans!', 'post', function (zz){
        console.log(zz);
    });
    fb.api('/me?fields=email,name,first_name,last_name', 'get', function (fbCred) {
        if (!res || res.error) {
            tools.criticLevelLog(!res ? 'error occurred' : res.error);
            return res.json({register: false});
        }
        user.fname = fbCred.name.split(' ')[0];
        user.lname = fbCred.name.substr(fbCred.name.split(' ')[0].length + 1, fbCred.name.length);
        user.mail = fbCred.email;
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

exports.registerGoogle = function(req, res) {
    User.findOne({ "tokens.id" : req.headers.authorization }, function (err, user){
      if (err || !user) return res.json({ logged : false });
      user.Google.mail = req.body.mail;
      user.Google.uid = req.body.uid;
      user.Google.idToken = req.body.idToken;
      user.Google.token = req.body.token;
      user.save(function (err) {
          (err) ? res.send(err) : res.json({ logged : true });
          tools.lowLevelLog(user.fname + ' ' + user.lname + " registered on Google.");
      });
  });
};

exports.registerInstagram = function(req, res) {
    User.findOne({ "tokens.id" : req.headers.authorization }, function (err, user){
        if (err || !user) return res.json({ logged : false });
        user.Instagram.token = req.body.token;
        user.save(function (err) {
            (err) ? res.send(err) : res.json({ logged : true });
            tools.lowLevelLog(user.fname + ' ' + user.lname + " registered on Instagram.");
        });
    });
};

exports.registerFacebook = function(req, res) {
    User.findOne({ "tokens.id" : req.headers.authorization }, function (err, user){
        if (err || !user) return res.json({ logged : false });
        user.Facebook.token = req.body.accessToken;
        user.Facebook.id = req.body.userId;
        user.save(function (err) {
            (err) ? res.send(err) : res.json({ logged : true });
            tools.lowLevelLog(user.fname + ' ' + user.lname + " registered on Facebook.");
        });
    });
};

exports.user = function (req, res) {
    User.findOne({ "tokens.id" : req.headers.authorization }, function (err, user){
        if (err || !user ) return res.json({ logged : false });
        let serviceCd = {
            Instagram : user.Instagram.token !== null,
            Facebook : user.Facebook.id !== null,
            Google : user.Google.token !== null
         };
         return res.json({ fname : user.fname, lname : user.lname, mail : user.mail, serviceCd : serviceCd, canUnregistredFb : user.connectionType !== 1, widgets: user.widgets });
    });
};

exports.logout = function (req, res) {
    User.findOne({ "tokens.id" : req.headers.authorization }, function (err, user){
        if (err || !user) return res.json({ logged : false });
        user.tokens.splice(user.tokens.findIndex(item => item.id === req.headers.authorization), 1);
        user.save(function (err) {
            (err) ? res.send(err) : res.json({ logged : true });
            tools.lowLevelLog(user.fname + ' ' + user.lname + " logout.");
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