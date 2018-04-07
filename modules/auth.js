var db = require("./db")

exports.checkScreenAuth = function(conDetails, req, callback){
	console.log(req.headers.authtoken);
	if(req.headers.authtoken === undefined){
		let err = {status:'AuthError: Auth-token missing'};
		return;
	}else{
		db.connect(conDetails, function(err, data){
			if(err){
				console.log('Connection Error');
				callback(err);
				return;
			}
			var sql = 'SELECT * FROM Screens WHERE Hardware_ID ="' + req.headers.hardwareID + '"';
			data.query(sql, function(err, result){
				if(err){
					callback(err);
					return;
				}
				if(result && result.length > 0){
					callback(null, {status:"True"});
				}
				else{
					callback(null, {status:"False"})
				}

			})
		});
	}
}

exports.checkUserAuth = function(conDetails, req, callback){
    console.log(req.headers.authtoken);
    if(req.headers.authtoken === undefined){
        let err = {status:'AuthError: Auth-token missing'};
        return;
    }else{

        db.connect(conDetails, function(err, data){
            if(err){
                console.log('Connection Error');
                callback(err);
                return;
            }
            var sql = 'SELECT * FROM Authentications WHERE authtoken ="' + req.headers.authtoken + '"';
            data.query(sql, function(err, result){
                if(err){
                    callback(err);
                    return;
                }

                if(result && result.length > 0){
                    callback(null, {status:"success"});
                }
                else{
                    callback(null, {status:"fail"})
                }

            })
        });
    }
}
