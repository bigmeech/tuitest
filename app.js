//some way of importing files without having to specify long paths
var path = require('path');
global.__ = function(file) {
    return path.join(__dirname, file);
};

global.abs_path = function(file){
    return __dirname + file
};

//modules
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var errorHandler = require('./lib/errorHandler');
var nunjucks = require('nunjucks');
var cons = require('consolidate');

//libs
var mongoose = require(__('lib/database'));
var app = express();

//routes
var routes = require('./routes/index');
var users = require('./routes/api/users');



// view engine setup
app.engine('html', cons.nunjucks);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

nunjucks.configure('views',{
    autoescape:true,
    express:app,
    watch:false,
    tags:{
        blockStart: '<%',
        blockEnd: '%>',
        variableStart: '<$',
        variableEnd: '$>',
        commentStart: '<#',
        commentEnd: '#>'
    }
})

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//page routes
app.use('/', routes);

//api routes
app.use('/api/users', users);

errorHandler(app);
module.exports = app;
