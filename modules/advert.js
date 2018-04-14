var db = require("./db")

/** Creates an advert in db **/
exports.create = function(conDetails, req, callback){
    db.connect(conDetails, function(err, data){
        if(err){
            callback(err);
            return;
        }

        var advert = {
            Owner: req.body['username'],
            Content: JSON.stringify(req.body['Content'])
        };

        data.query('INSERT INTO Adverts SET ?', advert, function(err,result){
            console.log("Advert created by: " + advert.Owner)
            callback(err,advert);
        });
        data.end();
    });
};

/** Updates an advert based on advert ID and advert Object provided **/
exports.update = function(conDetails, advertId, advertObj, callback){
    db.connect(conDetails, function(err, data){
        if(err){
            callback(err)
            return;
        }
        advertObj.Content = JSON.stringify(advertObj.Content)
        data.query('UPDATE Adverts SET ? WHERE ID = ' + advertId, advertObj, function(err, result){
            console.log('Updated the advert: ' + advertId)
            callback(err, result);
        })
        data.end();
    })
};

/** Get a advert of a specific id  provided in params **/
exports.getAdvertById = function(condetails, advertid, callback){
    console.log("Getting advert by id="+advertid)
    db.connect(condetails, function(err, data){
        var sql = 'SELECT * FROM Adverts WHERE ID="' + advertid + '"'
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


/** Deletes a review from database with id provided **/
exports.destroy = function(conDetails, id, callback){
    db.connect(conDetails, function(err,data){
        data.query('SELECT drug_name FROM Reviews WHERE id ="'+id+'"', function(err, result){
            data.query('UPDATE Drugs SET totalreviews = totalreviews-1 WHERE name="'+result[0].drug_name+'"', function(err, result){
                console.log('Attempting to delete review (id='+id+')')
                data.query('DELETE FROM Reviews WHERE id = ?', id, function(err, result){
                    if(err){
                        console.log(err)
                    }else{
                        console.log("Deleted reivew (id="+id+")")
                    }
                    data.end();
                });

            })
            callback(err);
        })
    });

};

/** Gets all adverts for all drugs in database **/
exports.getAllAdverts = function(condetails, callback){
    db.connect(condetails, function(err, data){
        if(err){
            console.log(err)
            return;
        }
        var sql = 'SELECT * FROM Reviews';
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

/** Get reviews of a specific drug provided in params **/
exports.getDrugReviews = function(condetails, drug, callback){
    db.connect(condetails, function(err,data){
        var sql = 'SELECT * FROM Reviews WHERE drug_name = "' + drug + '"';
        console.log('Getting reviews of drug: ' + drug);
        try{
            data.query(sql, function(err, result){
                if (err) throw err;
                if(result.length>0){
                    callback(null, result);
                }else{
                    callback(null, false); // No reviews for this drug
                }
            });
            data.end();
        }catch(err){
            console.log(err)
        }
    });
}


/** Get all the adverts of a user based on username provided **/
exports.getUsersAdverts = function(condetails, Owner, callback){
    db.connect(condetails, function(err, data){
        var sql = 'SELECT * FROM Adverts WHERE Owner = "' + Owner + '"'
        data.query(sql, function(err, result){
            if(err){
                console.log(err)
            }
            if(result.length>0){
                callback(null, result)
            }else{
                callback(null, false) // No reviews for this user
            }
        })
        data.end();
    })
}

/** Gets all recent reviews and limits results based on limit param provided**/
exports.getRecentReviews = function(condetails, limit, callback){
    var limit = Math.round(limit)
    db.connect(condetails, function(err, data){
        if(err){
            console.log(err)
            return;
        }
        var sql = 'SELECT * FROM Reviews ORDER BY id DESC LIMIT '+limit;
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