/*
** Requires and constants variables
 */
const express =     require('express');
const path =        require('path');
const app =         express();
const mongoose =    require('mongoose');
const requestIp =   require('request-ip');
const bodyParser =  require('body-parser');
const fs = require('fs');

const userCtrl=     require('./controllers/user');
const widgetCtrl =  require('./controllers/widget');

const tools =       require('./tools/tools');

/*
** Database Initialization
 */
mongoose.Promise = require('bluebird');

const connectWithRetry = () => {
  mongoose.connect('mongodb://localhost:27017/area', {
      reconnectTries: 30,
      reconnectInterval: 500,
      poolSize: 10,
      bufferMaxEntries: 0,
      useNewUrlParser: true
  }).then(function (){
      tools.lowLevelLog("Database set up.");
      widgetCtrl.run();
  }).catch(function (err) {
      tools.highLevelLog(err);
      setTimeout(connectWithRetry, 1000)
  });
};

connectWithRetry();

/*
** Express
 */
const router = express.Router();
app.use(express.static("."));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', router);

router.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

router.route('/signup').post(userCtrl.signup);
router.route('/logout').get(userCtrl.logout);
router.route('/signupFacebook').post(userCtrl.signupFacebook);
router.route('/signin').post(userCtrl.signin);
router.route('/signinFacebook').post(userCtrl.signinFacebook);
router.route('/user').get(tools.auth, userCtrl.user);
router.route('/registerGoogle').post(userCtrl.registerGoogle);
router.route('/registerInstagram').post(userCtrl.registerInstagram);
router.route('/registerFacebook').post(userCtrl.registerFacebook);
router.route('/addWidget').post(widgetCtrl.add);

app.listen(8080, function(){
    tools.lowLevelLog('Server running on 8080.');
});


app.get('/about.json', async function(req, res){
    let ip = requestIp.getClientIp(req);

    var apt = {
        client: {
            host: ip
        },
        server: {
            current_time: null,
            services: [{
                name: "Timer",
                actions: [{
                    id: 0,
                    name: "alarm",
                    description: "it's time"
                }]
            }]
        }
    };

    res.json(apt);
});