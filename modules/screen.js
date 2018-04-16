var db = require("./db")

exports.getScreenAdverts = function(condetails, hardwareID, callback){
    db.connect(condetails, function(err,data){
        var sql = 'SELECT * FROM Screen_Groups WHERE ID = (SELECT ID FROM Screens WHERE Hardware_ID = "' + hardwareID + '")';
        console.log(sql)
        console.log('Getting screen adverts of screen ID: ' + hardwareID);
        data.query(sql, function(err, result){
            if (err) throw err;
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

exports.getScreenTokens = function(condetails, callback){
    db.connect(condetails, function(err,data){
        var sql = 'SELECT * FROM Screen_Tokens';
        data.query(sql, function(err, result){
            console.log(result.length)
            if (err){
                console.log(err)
                callback(err)
            }else{

                if(result.length >0) {
                    callback(result);
                }else{
                    callback({"status":"No-tokens"})
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

exports.getScreenTokensByUser = function(condetails, Owner, callback){
    db.connect(condetails, function(err,data){
        data.query('SELECT * FROM Screen_Tokens WHERE Owner = ?', Owner, function(err, result){
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

/** Updates an advert based on advert ID and advert Object provided **/
exports.updateScreenGroup = function(conDetails, groupid, groupObj, callback){
    db.connect(conDetails, function(err, data){
        if(err){
            callback(err)
            return;
        }
        data.query('UPDATE Screen_Groups SET ? WHERE ID = ' + groupid, groupObj, function(err, result){
            console.log('Updated the advert: ' + groupid)
            callback(err, result);
        })
        data.end();
    })
};

/** Get a advert of a specific id  provided in params **/
exports.getScreenGroupByID = function(condetails, groupid, callback){
    console.log("Getting screengroup by id="+groupid)
    db.connect(condetails, function(err, data){
        var sql = 'SELECT * FROM Screen_Groups WHERE ID="' + groupid + '"'
        data.query(sql, function(err, result){
            if(err){
                console.log(err)
            }
            if(result.length>0){
                callback(null, result)
            }else{
                callback(null, false)
            }
        })
        data.end();
    })
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

exports.createScreenGroup = function(conDetails, req, callback){
	db.connect(conDetails, function(err, data){
		if(err){
			callback(err);
			return;
		}
		var screenGroup = {
			Owners: req.body['Owners'],
			Adverts: req.body['Adverts'],
		};
		data.query('INSERT INTO Screen_Groups SET ?', screenGroup, function(err,result){
			callback(err,screenGroup);
		});
        data.end()
	});
};

exports.createScreenToken = function(conDetails, req, callback){
    db.connect(conDetails, function(err, data){
        if(err){
            callback(err);
            return;
        }
        var screenGroup = {
            Token: req.body['Token'],
            Screen_Group: req.body['Screen_Group'],
            Owner: req.body['Owner']
        };
        data.query('INSERT INTO Screen_Tokens SET ?', screenGroup, function(err,result){
            callback(err,screenGroup);
        });
        data.end()
    });
};

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

exports.heartbeat = function(conDetails, hardwareid, callback){
    db.connect(conDetails, function(err,data){
        if(err){
            callback(err)
            return
        }
        var screen = {
            "Live": new Date()
        }
        data.query('UPDATE Screens SET ? WHERE Hardware_ID = "' + hardwareid+'"', screen, function(err, result){
            console.log('Screen heartbeat! For HID: ' + hardwareid + ' at: ' + new Date())
            if(err) throw err;
            callback(err, result);
        })
        data.end();
    })
}

exports.createResponse = function(conDetails, req, callback){
    db.connect(conDetails, function(err, data){
        if(err){
            callback(err);
            return;
        }
        var response = {
            name: req.body['Name'],
            Email: req.body['Email'],
            OriginAdvertID: req.body['OriginAdvertID']
        };
        console.log(response)
        data.query('INSERT INTO Responses SET ?', response, function(err,result){
            callback(err,response);
        });
        data.end()
    });
};

exports.incrementAdvertImpression = function(conDetails, req, callback){
    db.connect(conDetails, function(err, data){
        if(err){
            callback(err);
            return;
        }
        data.query('UPDATE Adverts SET Impressions = Impressions + 1 WHERE ID ='+req.body['advertid'], function(err,result){
            callback(err,result);
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



