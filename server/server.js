// server.js
'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// express is the main server framework
var express  = require('express');

// all base configurations should come from here.
var config = require('./config/environment');

// connect to the mongoose db. prepopulate db with data if specified in config
var mongoose = require('mongoose');
mongoose.connect(config.mongo.uri, config.mongo.options);


// configure express server
var app = express();
var server = require('http').createServer(app);

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

// required for passport
app.use(session({ secret: 'coffee' })); // session secret

require('./app/routes.js')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
