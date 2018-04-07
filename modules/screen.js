var db = require("./db")

exports.getScreenAdverts = function(condetails, hardwareID, callback){
    db.connect(condetails, function(err,data){
        var sql = 'SELECT * FROM Screen_Groups WHERE ID = (SELECT ID FROM Screens WHERE Hardware_ID = "' + hardwareID + '")';
        console.log('Getting screen adverts of screen ID: ' + hardwareID);
        data.query(sql, function(err, result){
            console.log(result[0].Adverts)

            if (err) throw err;
            if(result.length>0){
                var sql = 'SELECT * FROM Adverts WHERE ID IN ' + result[0].Adverts
                console.log(sql)
                data.query(sql, function(err, result){
                    console.log(result)
                })
                callback(result);
            }else{
                callback(false);
            }
        });
    });
}


// OLD METHODS BELOW
exports.create = function(conDetails, req, callback){

	db.connect(conDetails, function(err, data){
		if(err){
			callback(err);
			return;
		}

		var user = {
			username: req.body['username'],
			password: req.body['password'],
			email: req.body['email']
		};

		data.query('INSERT INTO Users SET ?', user, function(err,result){
			callback(err,user);
		});
	});
};

exports.destroy = function(conDetails, req, callback){
	if(err){
		callback(err);
		return;
	}
	var username = req.body['username'];

	data.query('DELETE FROM Users WHERE username = ?', username, function(err, result){
		callback(err,user);
	});
};

exports.doesUserExist = function(conDetails, req, callback){
	db.connect(conDetails, function(err,data){
		var sql = 'SELECT * FROM Users WHERE username = "' + req.body['username'] + '"';
		console.log(req.body['username']);
		data.query(sql, function(err, result){
			if (err) throw err;
			if(result.length>0){
				return callback(true);
			}else{
				return callback(false);
			}
		});
	});
}

exports.getUsers = function(condetails, callback){
	db.connect(condetails, function(err, data){
		if(err){
			console.log(err)
			return;
		}
		var sql = 'SELECT * FROM Users';
		data.query(sql, function(err, result){
			if(err){
				callback(err)
			}else{
				callback(null, result)
			}
		});
	})
}
