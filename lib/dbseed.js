var csvStream = require('csv-stream').createStream,
    path = require('canonical-path'),
    fs = require('fs'),
    _ = require('lodash'),
    config = require(__('config'));
    exec = require('child_process').exec;


var cmdString = 'mongoimport --host ${host} --db ${dbname} --collection ${collectionName} --type ${type} --headerline < ${filepath}';
var commandOptns = {
    host: config.database.host,
    dbname: config.database.name,
    collectionName: 'statements',
    type:'csv',
    filepath:abs_path('/data/data.csv')
};

function createSchema(mongoose, collectionName){
    var Schema, typesDef = {};
    var getData = function(data){
        _.forIn(data, function(value, key){
                typesDef[key] = mongoose.Schema.Types.String
        });
        Schema = new mongoose.Schema(typesDef);
        mongoose.model(collectionName, Schema);
    };
    return _.once(getData);
}

function importCSVData(){
    this.connection.db.collection(commandOptns.collectionName).find().toArray(function(err, cols){
        if(cols.length == 0){
            var commandTemplateFn = _.template(cmdString);
            var child = exec(commandTemplateFn(commandOptns),
                function (err, stdout, stderr) {
                    if (err) throw err;
                    console.log('stdout: ' + stdout);
                });
        }
    })
}

function runDbSeed(mongoose) {
    //create schema
    csv = csvStream();
    fs.createReadStream(commandOptns.filepath).pipe(csv);
    csv.on('error', console.error.bind(console));
    csv.on('data', createSchema(mongoose, commandOptns.collectionName));
    csv.on('end', importCSVData.bind(mongoose));
}

module.exports = function(db){
    return{
        run:runDbSeed.bind(null, db)
    }
};
