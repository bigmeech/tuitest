var mongoose = require('mongoose');
var config = require(__('config'));
var dbseed = require(__('lib/dbseed'));

mongoose.connect('mongodb://' + config.database.host + '/' + config.database.name);

var db = mongoose.connection;
db.on('connected', dbseed(mongoose).run);
db.on('error', console.error.bind(console, 'connection error:'));

mongoose.set('debug', true);

module.exports = mongoose;
