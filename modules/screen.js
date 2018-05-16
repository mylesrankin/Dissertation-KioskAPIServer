var db = require("./db")

/** Gets screen adverts of of a given screen by HID **/
exports.getScreenAdverts = function(condetails, hardwareID, callback){
    db.connect(condetails, function(err,data){
        var sql = 'SELECT * FROM Screen_Groups WHERE ID = (SELECT ID FROM Screens WHERE Hardware_ID = "' + hardwareID + '")';
        console.log(sql)
        console.log('Getting screen adverts of screen ID: ' + hardwareID);
        data.query(sql, function(err, result){
            console.log(result)
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
/** Checks if a HID is valid or not **/
exports.checkHID = function(condetails, hardwareID, callback){
    console.log("Checking HID: "+hardwareID)
    db.connect(condetails, function(err,data){
        var sql = 'SELECT * FROM Screens WHERE Hardware_ID = "' + hardwareID + '"';
        console.log(sql)
        console.log('Getting screen adverts of screen ID: ' + hardwareID);
        data.query(sql, function(err, result){
            console.log(result)
            if (err) throw err;
            if(result.length>0){
                console.log('Got screen data')
                callback(true)
            }else{
                callback(false);
            }
        });
        data.end()
    });
}
/** Gets all screens data **/
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
/** Gets all screen tokens **/
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
/** Gets single token data based on provided token id **/
exports.getSingleToken = function(condetails, token, callback){
    db.connect(condetails, function(err,data){
        var sql = 'SELECT * FROM Screen_Tokens WHERE Token = "'+token+'"';
        data.query(sql, function(err, result){
            console.log(sql)
            console.log(result.length)
            if(err){
                callback(err)
            }
            if(result.length >0){
                callback(null, result)
            }else{
                callback(false)
            }
        });
        data.end()

    });
}
/** Creates a new screen in db **/
exports.createScreen = function(condetails, hardwareid, result, callback){
    db.connect(condetails, function(err,data) {
        var screen = {
            Hardware_ID: hardwareid,
            Owner: result[0].Owner,
            Screen_Group_ID: result[0].Screen_Group
        };
        data.query('INSERT INTO Screens SET ?', screen, function(err,result){
            callback(err,screen);
        });
    })
}
/** Get screen groups by supplied username **/
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
/** Get screen tokens by supplied username  **/
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
/** Get screens by username **/
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
/** Get screen by hardwareid **/
exports.getScreenByHID = function(condetails, HID, callback){
    db.connect(condetails, function(err,data){
        data.query('SELECT * FROM Screens WHERE Hardware_ID =  "'+HID+'"', function(err, result){
            if (err){
                console.log(err)
                callback({"notification":"An error occured"})
            }else{
                callback(null, result);
            }
        });
        data.end()

    });
}
/** Creates a screen group **/
exports.createScreenGroup = function(conDetails, req, callback){
	db.connect(conDetails, function(err, data){
		if(err){
			callback(err);
			return;
		}
		var screenGroup = {
		    Name : req.body['Name'],
			Owners: req.body['Owners']
			//Adverts: req.body['Adverts'],
		};
		data.query('INSERT INTO Screen_Groups SET ?', screenGroup, function(err,result){
			callback(err,screenGroup);
		});
        data.end()
	});
};

/** Deletes a review from database with id provided **/
exports.destroyScreenGroup = function(conDetails, id, callback){
    db.connect(conDetails, function(err,data){
        data.query('DELETE FROM Screen_Groups WHERE ID = ?', id, function(err, result){
            console.log(result)
            if(err){
                console.log(err)
            }else{
                console.log("Deleted screen group (id="+id+")")
                callback(null, {status: "Deleted screen group (id="+id+")"} )
            }
            data.end();
        });

    });

};

/** Creates a screen token **/
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
/** Destroys a screen token from db **/
exports.destroyScreenToken = function(conDetails, req, callback){
    db.connect(conDetails, function(err, data) {
        if (err) {
            callback(err);
            return;
        }
        var Token = req.params.token
        data.query('DELETE FROM Screen_Tokens WHERE Token = ?', Token, function (err, result) {
            callback(err, Token);
        });
        data.end()
    })
};
/** Creates an advert **/
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
/** Generates a screen heartbeat in db **/
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
/** Creates a screen response in db **/
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
/** increments advert impression in db **/
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
/** destroys a screen **/
exports.destroy = function(conDetails, hid, callback){
    db.connect(conDetails, function(err, data) {
        if (err) {
            callback(err);
            return;
        }
        data.query('DELETE FROM Screens WHERE Hardware_ID = ?', hid, function (err, result) {
            if(err){
                callback({status:"Error"})
            }else{
                callback({status:"Success! Deleted screen"})
            }
        });
        data.end()
    })
};



