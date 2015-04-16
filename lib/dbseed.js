var cvsStream = require('csv-stream');

function runDbSeed(connection){
    console.log(connection);
}

module.exports = function(db){
    return{
        run:runDbSeed.bind(null, db)
    }
};
