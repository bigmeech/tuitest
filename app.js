//some way of importing files with typing fill path
var path = require('path');
global.__ = function(file) {
    return path.join(__dirname, file);
};

var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var errorHandler = require('./lib/errorHandler');
var routes = require('./routes/index');
var users = require('./routes/users');

//libs
var mongoose = require(__('lib/database'));
var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

errorHandler(app);
module.exports = app;
