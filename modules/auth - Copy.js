var db = require("./db")

exports.checkScreenAuth = function(conDetails, req, callback){
	console.log(req.headers.authtoken);
	if(req.headers.authtoken === undefined){
		let err = {status:'AuthError: HardwareID missing'};
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

/** Checks if users authentication is valid, used for protecting pages for logged in users only **/
exports.checkAuth = function(conDetails, req, callback){
    if(!req.headers.authtoken){
        callback(null,{status:'authtoken-missing'})
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
            data.end();
        });

    }
}

/** Matches a users request authentication with the targetid auth owner to ensure they are allowed do anything to it **/
exports.matchUserAuth = function(conDetails, targetId, req, callback){
    if(!req.headers.authtoken){
        callback(null, {status: 'authtoken-missing'})
    }else{
        db.connect(conDetails, function(err, data){
            var usr = req.headers.authuserid
            console.log('Checking authtoken: '+req.headers.authtoken)
            var sql = 'SELECT * FROM Authentications WHERE authtoken ="'+ req.headers.authtoken +'" AND userid = "'+ targetId +'"';
            data.query(sql, function(err, result){
                if(err){
                    console.log(err)
                    callback(err, null)
                }
                if(result.length > 0){
                    callback(null, {status: 'user-authorised'})
                }else{
                    callback(null, {status: 'user-unauthorised'})
                }
            })
            data.end();
        })
    }
}

/** Creates a authentication in database **/
exports.createAuth = function(conDetails, userid, token){
    db.connect(conDetails, function(err, data){
        var tempauth = {
            userid: userid,
            authtoken: token
        }
        var sql = "INSERT INTO Authentications SET ?"
        data.query(sql, tempauth, function(err, result){
            if(err){
                console.log(err)
            }
        })
        data.end();
    })
}

/** Deletes authentication from database **/
exports.destroyAuth = function(conDetails, token){
    db.connect(conDetails, function(err,data){
        var sql = "DELETE FROM Authentications WHERE authtoken ='" + token + "'";
        data.query(sql, function(err,result){
            console.log('Deleting authtoken: '+token)
            if(err){
                console.log(err)
            }
        })
        data.end();
    })
}

