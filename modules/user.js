// *Some* methods below are by Myles Rankin - 'Mediview' 304CEM Project
var db = require("./db")
var sha256 = require('sha256')

/** Creates a user by Myles Rankin - 'Mediview' 304CEM Project **/
exports.create = function(conDetails, userObj, callback){
    db.connect(conDetails, function(err, data){
        if(err){
            callback(err);
            return;
        }
        data.query('INSERT INTO Users SET ?', userObj, function(err){
            callback(err);
        });
    });
};

/**
 * Updates a user of provided id and updated information within a userObj (Object)
 * @param userobj uses sha256 to ensure no plaintext passwords are stored on updates
 * by Myles Rankin - 'Mediview' 304CEM Project
 */
exports.update = function(conDetails, userid, userObj, callback){
    db.connect(conDetails, function(err, data){
        if(err){
            callback(err)
            return;
        }
        exports.getUserSalt(conDetails, userid, function(err, result){
            if(err){
                console.log(err)
            }
            console.log(result)
            userObj.password = sha256(userObj.password+result[0].salt)
            var tempUserObj = userObj
            console.log(userObj)
            data.query('UPDATE Users SET ? WHERE userid = ' + userid, tempUserObj, function(err, result){
                console.log(userObj)
                console.log('Updated user id: ' + userid + ' with data: ' +  userObj.email)
                callback(err, result);
            })
            data.end();
        })
    })
}

/** Deletes a user of provided id **/
exports.destroy = function(conDetails, id, callback){
    if(err){
        callback(err);
        return;
    }

    data.query('DELETE FROM Users WHERE id = ?', id, function(err, result){
        callback(err,user);
    });
};

/** Checks if username exists **/
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
        data.end();
    });
}

/** Gets all users that exist in database **/
exports.getUsers = function(condetails, callback){
    db.connect(condetails, function(err, data){
        if(err){
            console.log(err)
            return;
        }
        var sql = 'SELECT userid, username, email FROM Users';
        data.query(sql, function(err, result){
            if(err){
                callback(err)
            }else{
                callback(null, result)
            }
        });
        data.end();
    })
}

/** Gets an individal user details from provied username **/
exports.getUser = function(condetails, username, callback){
    db.connect(condetails, function(err,data){
        var sql = 'SELECT userid, username, email FROM Users WHERE username = "' + username + '"';
        console.log('Getting user details of user: ' + username);
        data.query(sql, function(err, result){
            if (err) throw err;
            if(result.length>0){
                console.log(result)
                callback(null, result);
            }else{
                callback(false);
            }
        });
        data.end();
    });
}

/**  Gets userid of a provided username if they exist **/
exports.getUserId = function(condetails, username, callback){
    console.log(username)
    db.connect(condetails, function(err,data){
        var sql = 'SELECT ID FROM Users WHERE username = "' + username + '"';
        console.log(sql)
        data.query(sql, function(err, result){
            if(err) throw err;
            if(result.length>0){
                callback(null, result)
            }else{
                callback(null, false)
            }
        });
        data.end();
    })
}

/**  Gets the user salt of the provided userid, used in authentication **/
exports.getUserSalt = function(condetails, userid, callback){
    db.connect(condetails, function(err,data){
        var sql = 'SELECT salt FROM Users WHERE userid = "' + userid + '"';
        data.query(sql, function(err, result){
            if(err) throw err;
            if(result.length>0){
                callback(null, result)
            }else{
                callback(null, false)
            }
        });
        data.end();
    })
}
