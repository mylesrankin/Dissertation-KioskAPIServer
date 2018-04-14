var db = require("./db")

exports.getScreenAdverts = function(condetails, hardwareID, callback){
    db.connect(condetails, function(err,data){
        var sql = 'SELECT * FROM Screen_Groups WHERE ID = (SELECT ID FROM Screens WHERE Hardware_ID = "' + hardwareID + '")';
        console.log(sql)
        console.log('Getting screen adverts of screen ID: ' + hardwareID);
        data.query(sql, function(err, result){
            if (err) throw err;
            console.log(result)
			console.log("-----------------")
            if(result.length>0){
                var sql = 'SELECT * FROM Adverts WHERE ID IN ' + result[0].Adverts
                console.log(sql)
                data.query(sql, function(err, result){
                    console.log(result)
                    callback(result)
                })
                data.end()
            }else{
                callback(false);
            }
        });

    });
}


exports.getScreens = function(condetails, callback){
    db.connect(condetails, function(err,data){
        var sql = 'SELECT * FROM Screens';
        console.log(sql)
        data.query(sql, function(err, result){
            console.log(result.length)
            if (err){
            	console.log(err)
				callback({"status":"unknown-error"})
            }else{

            	if(result.length >0) {
                    callback(result);
                }else{
            		callback({"status":"invalid-user"})
				}
            }
        });
        data.end()

    });
}

exports.getScreenGroupsByUser = function(condetails, Owner, callback){
    db.connect(condetails, function(err,data){
        data.query('SELECT * FROM Screen_Groups WHERE Owners = ?', Owner, function(err, result){
            if (err){
                console.log(err)
                callback({"notification":"An error occured"})
            }else{
                callback(result);
            }
        });
        data.end()

    });
}


exports.getScreensByUser = function(condetails, Owner, callback){
    db.connect(condetails, function(err,data){
        data.query('SELECT * FROM Screens WHERE Owner = ?', Owner, function(err, result){
            if (err){
                console.log(err)
                callback({"notification":"An error occured"})
            }else{
                callback(result);
            }
        });
        data.end()

    });
}

exports.createAdvert = function(conDetails, req, callback){
	db.connect(conDetails, function(err, data){
		if(err){
			callback(err);
			return;
		}
		var advert = {
			username: req.body['ID'],
			password: req.body['Owner'],
			email: req.body['Content']
		};
		data.query('INSERT INTO Adverts SET ?', advert, function(err,result){
			callback(err,advert);
		});
        data.end()
	});
};

// OLD METHODS BELOW
exports.destroy = function(conDetails, req, callback){
	if(err){
		callback(err);
		return;
	}
	var username = req.body['username'];

	data.query('DELETE FROM Users WHERE username = ?', username, function(err, result){
		callback(err,user);
	});
    data.end()
};



