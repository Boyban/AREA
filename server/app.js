/*
** Requires and constants variables
 */
const express =     require('express');
const path =        require('path');
const app =         express();
const mongoose =    require('mongoose');
const requestIp =   require('request-ip');
const bodyParser =  require('body-parser');

const userCtrl=     require('./controllers/user');

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
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

router.route('/signup').post(userCtrl.signup);

app.listen(8080, function(){
    tools.lowLevelLog('Server running on 8080.');
});
