var User = require("../models/User");

module.exports = {
    lowLevelLog: function (printable) {
        console.log('\x1b[33m%s\x1b[0m%s', getPrintableDate(), printable);
    },
    highLevelLog: function (printable) {
        console.log('\x1b[33m%s\x1b[0m\x1b[34m%s\x1b[0m', getPrintableDate(), printable);
    },
    criticLevelLog: function (printable) {
        console.log('\x1b[33m%s\x1b[0m\x1b[31m%s\x1b[0m', getPrintableDate(), printable);
    },
    auth: function (req, res, next) {
        User.findOne({"tokens.id" : req.headers.authorization }, function (err, user){
           if (err || !user) {
               return res.json({logged: false});
           }
           else {
               next();
           }
        });
    }
};

function getPrintableDate() {
    var date = new Date;
    var printableDate = "[";

    printableDate += date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + " ";
    printableDate += date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "]: ";
    return printableDate;
}