// DB Module
var mysql = require("mysql")

/** Creates a connection to database with details provided **/
exports.connect = function(conDetails, callback){
    var connection = mysql.createConnection({
        host: conDetails.host,
        user: conDetails.user,
        password: conDetails.password,
        database: conDetails.database
    });
    connection.connect(function(err){
        if(err) callback(err);
        callback(null,connection);
    });
};
