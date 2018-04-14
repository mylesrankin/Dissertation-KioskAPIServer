var db = require("./db")

/** Checks if users authentication is valid, used for protecting pages for logged in users only **/
exports.checkAuth = function(conDetails, req, callback){
    if(!req.headers.auth_token){
        callback(null,{status:'Auth_Token-missing'})
        return;
    }else{
        db.connect(conDetails, function(err, data){
            if(err){
                console.log('Connection Error');
                callback(err);
                return;
            }
            var sql = 'SELECT * FROM Authentications WHERE  ="' + req.headers.auth_token + '"';
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
    console.log(req.headers.auth_token)
    if(!req.headers.authtoken){
        callback(null, {status: 'AuthToken-missing'})
    }else{
        db.connect(conDetails, function(err, data){
            var usr = req.headers.User_ID
            console.log('Checking Auth_Token: '+req.headers.authtoken)
            var sql = 'SELECT * FROM Authentications WHERE Auth_Token ="'+ req.headers.authtoken +'" AND User_ID = "'+ targetId +'"';
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
exports.createAuth = function(conDetails, User_ID, token){
    db.connect(conDetails, function(err, data){
        var tempauth = {
            User_ID: User_ID,
            Auth_Token: token
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
        var sql = "DELETE FROM Authentications WHERE Auth_Token ='" + token + "'";
        data.query(sql, function(err,result){
            console.log('Deleting Auth_Token: '+token)
            if(err){
                console.log(err)
            }
        })
        data.end();
    })
}
