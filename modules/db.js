// DB Module by Myles Rankin
var mysql = require("mysql")
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

exports.disconnect = function(connection,callback){
	connection.disconnect();
};
