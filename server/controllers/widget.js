let User = require('../models/User');
let Widget = require('../models/Widget');
let tools = require('../tools/tools');
let https = require('https');
let FB = require("fb");
let nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'area.epitech.gdh@gmail.com   ',
        pass: 'nikoumouk'
    }
});

exports.add = function(req, res) {
    User.findOne({ "tokens.id" : req.headers.authorization }, function (err, user){
        if (err || !user) return res.json({ logged : false });

        let widget = new Widget({
            id : req.body.id,
            cl : req.body.cl,
            text : req.body.text,
            icon : req.body.icon,
            parameters : req.body.parameters,
            treated: null
        });

        let search = req.body.parameters;
        if (search)
            widget.parameters = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value) })
        user.widgets.unshift(widget);
        user.save(function (err) {
            (err) ? res.send(err) : res.json({ logged : true });
            tools.lowLevelLog(user.fname + ' ' + user.lname + " added a new widget.");
        });
    });
};

function mailTimer() {
    return new Promise(resolve => {
        User.find({ "widgets.id" : 0 }, function(err, users){
            if (err || !users) return;
            var mailOptions = {
                from: 'area.epitech.gdh@gmail.com',
                to: '',
                subject: '[Area] Alert : It\'s time !',
                text: ''
            };

            users.forEach(function (user){
                let now = new Date();

                let widgets = user.widgets.filter(x => x.id === 0);
                widgets.forEach(function (widget) {
                    if (now.getHours() == widget.parameters.hour && now.getMinutes() == widget.parameters.min){

                        mailOptions.to = user.mail;
                        mailOptions.text = "Hey you ! Like you requested to us it's time ! It's " + widget.parameters.hour + ':' + widget.parameters.min + '.';
                        transporter.sendMail(mailOptions, function(error, info){
                            if (error)
                                tools.criticLevelLog(error);
                            else
                                tools.lowLevelLog("[WIDGET] => MailTimer to : " + user.fname + ' ' + user.lname);
                        });
                    }
                });
            });
        });
    });
}

function mailWeather() {
    return new Promise(resolve => {
        User.find({ "widgets.id" : 1 }, function(err, users){
            if (err || !users) return;
            var mailOptions = {
                from: 'area.epitech.gdh@gmail.com',
                to: '',
                subject: '[Area] Alert : Weather is under ... !',
                text: ''
            };

            users.forEach(function (user){
                let widgets = user.widgets.filter(x => x.id === 1);
                widgets.forEach(function (widget) {
                    https.get("https://api.openweathermap.org/data/2.5/weather?q=" + widget.parameters.loc + "&units=metric&appid=2c19b01f00091ca3924e8a2093784b12", function (resp){
                        let data = '';
                        resp.on('data', (chunk) => {
                            data += chunk;
                        });

                        resp.on('end', () => {
                            data = JSON.parse(data);
                            if (data.cod === 200 && data.main.temp < widget.parameters.temp) {
                                mailOptions.to = user.mail;
                                mailOptions.text = "Hey you ! Like you requested to us the weather in " + widget.parameters.loc + ' is under ' + widget.parameters.temp + '°C.';
                                transporter.sendMail(mailOptions, function(error, info){
                                    if (error)
                                        tools.criticLevelLog(error);
                                    else
                                        tools.lowLevelLog("[WIDGET] => MailWeather to : " + user.fname + ' ' + user.lname);
                                });
                            }
                        });
                    });
                });
            });
        });
    });
}

function mailWeatherO() {
    return new Promise(resolve => {
        User.find({ "widgets.id" : 2 }, function(err, users){
            if (err || !users) return;
            var mailOptions = {
                from: 'area.epitech.gdh@gmail.com',
                to: '',
                subject: '[Area] Alert : Weather is under ... !',
                text: ''
            };

            users.forEach(function (user){
                let widgets = user.widgets.filter(x => x.id === 2);
                widgets.forEach(function (widget) {
                    https.get("https://api.openweathermap.org/data/2.5/weather?q=" + widget.parameters.loc + "&units=metric&appid=2c19b01f00091ca3924e8a2093784b12", function (resp){
                        let data = '';
                        resp.on('data', (chunk) => {
                            data += chunk;
                        });

                        resp.on('end', () => {
                            data = JSON.parse(data);
                            if (data.cod === 200 && data.main.temp > widget.parameters.temp) {
                                mailOptions.to = user.mail;
                                mailOptions.text = "Hey you ! Like you requested to us the weather in " + widget.parameters.loc + ' is over ' + widget.parameters.temp + '°C.';
                                transporter.sendMail(mailOptions, function(error, info){
                                    if (error)
                                        tools.criticLevelLog(error);
                                    else
                                        tools.lowLevelLog("[WIDGET] => MailWeather to : " + user.fname + ' ' + user.lname);
                                });
                            }
                        });
                    });
                });
            });
        });
    });
}

async function runMailTimer() {
    await mailTimer();
}

async function runMailWeather() {
    mailWeather();
    mailWeatherO();
}

exports.run = function() {
    setInterval(()=> {
        runMailTimer().then(function () {})
    }, 60000);

    setInterval(() => {
        runMailWeather().then(function () {})
    }, 1800000);
};

exports.unsubscribe = function(req, res) {
    User.findOne({ "tokens.id" : req.headers.authorization }, function (err, user){
        if (err || !user ) return res.json({ logged : false });

        user.widgets.splice(user.widgets.findIndex(item => item.text === req.body.text), 1);
        user.save(function (err) {
            if (err) return res.json({ logged : false });
            tools.lowLevelLog(user.fname + " " + user.lname + " remove a widget.");
            res.json({ logged: true });
        });
    });
};