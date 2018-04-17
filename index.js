// Node modules
var express = require('express')
var http = require('http')
var path = require('path')
var bodyParser = require('body-parser')
var sha256 = require('sha256')
var Printer = require('node-printer')

// Custom modules by Myles Rankin
var screen = require('./modules/screen.js')
var db = require("./modules/db")
var user = require("./modules/user")
var advert = require("./modules/advert")
var auth = require("./modules/auth")
var os = require("os")
//var auth = require('./modules/auth.js')
var app = express()

// MySQL DB Details
const dbData = {
    host: "37.122.214.88",
    user: "kiosk-3a9r-u-175546",
    password: "T/hWJGF!Y",
    database: "kiosk-3a9r-u-175546"
}

var publicDir = path.join(__dirname, 'public')

console.log(os.hostname())
app.set('port', process.env.PORT || 3000)

app.use(bodyParser.json()) // Parses json, multi-part (file), url-encoded
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, content-type, Data-Type, Accept, hardwareid, authtoken, username");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
    next();
});

app.get('/', function (req, res) {
    res.send('API Server Aliveggg');
})

app.get('/test', function(req,res){
    res.json({
        status: 'Alive',
        data: {
            title: 'test',
            content: 'more testing'
        }
    })
})

// Screen/Advert Methods

/** Gets data of all screens on db **/
app.get('/screens', function(req,res){
    screen.getScreens(dbData, function(result){
        res.status(200)
        res.json(result)
    })
})

/** Allows client to register as a screen with a token**/

app.post('/screens/:token', function(req, res){
    screen.getSingleToken(dbData, req.params.token, function(err, result) {
        console.log(result)
        if (err == null){
            screen.createScreen(dbData, req.headers.hardwareid, result, function(err, screen) {
                if (err) {
                    res.status(400)
                    res.json({status:"Error: That hardwareid is already in use"})
                } else {
                    res.status(201)
                    res.json({status:"Success! Screen registered"})
                }
            })
        } else if(err == false) {
            res.status(401)//
            res.end('Token does not exist')
        } else {
            res.status(500)
            res.json(err)
        }//
    })
})


/** Gets data of all screens owned by a specific user by Owner**/
app.get('/screens/user/:Owner', function(req,res){
    screen.getScreensByUser(dbData,  req.params.Owner, function(result){
        res.status(200)
        res.json(result)
    })
})

/** Gets data of all screen groups owned by a specific user by Owner**/
app.get('/screens/groups/user/:Owner', function(req,res){
    screen.getScreenGroupsByUser(dbData,  req.params.Owner, function(result){
        console.log(result)
        res.status(200)
        res.json(result)
    })
})

/** Gets data of all screen group tokens owned by a specific user by Owner**/
app.get('/screen/tokens/user/:Owner', function(req,res){
    user.getUserId(dbData, req.params.Owner, function(err, result) {
        if(result[0] != null) {
            auth.matchUserAuth(dbData, result[0].ID, req, function (err, result) {
                console.log(result.status)
                if (result.status === 'user-authorised') {
                    screen.getScreenTokensByUser(dbData,  req.params.Owner, function(result){
                        console.log(result)
                        res.status(200)
                        res.json(result)
                    })
                } else {
                    res.status(400)
                    res.json({status: 'user-unauthorised'})
                }
            })
        }else{
            res.status(401)
            res.json({status:"Error: You are using a user that does not exist"})
        }
    })

})

/** Gets content for a given screen by request body hardware id **/
app.get('/screen/adverts', function(req,res){
    var HID = req.headers['hardwareid']
    screen.getScreenAdverts(dbData, HID, function (result) {
        if(result === false) {
            res.status(400)
            res.end("Error: Invalid or non-existent Hardware ID provided")
        }else{
            res.status(200)
            res.json(result)
        }
    })
})

app.post('/screen/heartbeat', function(req, res){
    screen.heartbeat(dbData, req.headers['hardwareid'], function(err, result){
        if(err){
            res.status(400)
            res.end('Error!')
        }else{
            res.status(200)
            res.end('Heartbeat!')
        }
    })
})

/** Gets content for a given screen by request body hardware id **/
app.get('/useradverts/:owner', function(req,res){
    advert.getUsersAdverts(dbData, req.params.owner, function (err, result) {
        if(result === false) {
            res.status(400)
            res.end("Error: No reviews for this user")
        }else{
            res.status(200)
            res.json(result)
        }
    })

}) //

/** Route for creating an Advert on given Advert Object in Request Body **/
 app.post('/screen/adverts', function(req,res) {
    if(!req.body['username']){
        console.log('Username missing in request')
        res.status(400)
        res.end("Bad request: Username missing")
    }else{
        console.log('An existing user is adding a review')
        // Check if the user adding a review is authorised to add it as them
        user.getUserId(dbData, req.body['username'], function(err, result){
            console.log(result)
            if(result === false){
                res.status(401)
                res.end('User does not exist')
            }else{
                auth.matchUserAuth(dbData, result[0].ID, req, function(err, result){
                    console.log(result)
                    if(result.status === 'user-authorised'){
                        advert.create(dbData, req, function(err,data){
                            if(err){
                                res.status(400)
                                res.end("Error: "+err)
                            }
                            res.status(201)
                            res.end('Success: Advert added')
                        })
                    }else if(result.status === "user-unauthorised"){
                        res.status(401)
                        res.end('You are not authorised to add a review as this user')
                    }else{
                        res.status(401)
                        res.end('No authkey provided')
                    }
                })
            }//
        })
    }
})

/** Route for updating advert based on provided id param [PRIVATE API] auth required, only the owner of the review can update it **/
app.put('/screen/adverts/:advertid', function(req, res){
    console.log(req.body)
    advert.getAdvertById(dbData, req.params.advertid, function(err, result){
        if(!result){
            console.log("Error: Advert with id="+req.params.advertid+" does not exist")
            res.status(400)
            res.json({status: "Error: Advert with id="+req.params.advertid+" does not exist"})
        }else{
            console.log('Getting userid from advert owner: '+result[0].Owner)
            user.getUserId(dbData, result[0].Owner, function(err, result){
                auth.matchUserAuth(dbData, result[0].ID, req, function(err, result){
                    console.log(result.status)
                    if(result.status === 'user-authorised'){
                        console.log('Incoming advert update data')
                        if(req.body){
                            console.log('Attempting update advert (id='+req.params.advertid+')')
                            advert.update(dbData, req.params.advertid, req.body, function(err, result){
                                if(err){
                                    res.status(400)
                                    console.log(err)
                                    res.json(err)
                                }else{
                                    console.log('Advert updated')
                                    res.status(200)
                                    res.json({status: 'Advert updated'})
                                }
                            })
                        }else{
                            console.log("Console Error - No advert obj provided?")
                        }
                    }else{
                        res.status(400)
                        res.json({status: 'user-unauthorised'})
                    }
                })
            })
        }
    })
})

/** Route for updating screen group based on provided id param auth required, only the owner of the screen group can update it **/
app.put('/screen/groups/:groupid', function(req, res){
    console.log(req.body)
    screen.getScreenGroupByID(dbData, req.params.groupid, function(err, result){
        if(!result){
            console.log("Error: screen group with id="+req.params.groupid+" does not exist")
            res.status(400)
            res.json({status: "Error: screen group with id="+req.params.groupid+" does not exist"})
        }else{
            console.log('Getting userid from advert owner: '+result[0].Owners)
            user.getUserId(dbData, result[0].Owners, function(err, result){
                auth.matchUserAuth(dbData, result[0].ID, req, function(err, result){
                    console.log(result.status)
                    if(result.status === 'user-authorised'){
                        console.log('Incoming advert update data')
                        if(req.body){
                            console.log('Attempting update advert (id='+req.params.groupid+')')
                            screen.updateScreenGroup(dbData, req.params.groupid, req.body, function(err, result){
                                if(err){
                                    res.status(400)
                                    console.log(err)
                                    res.json(err)
                                }else{
                                    console.log('Advert updated')
                                    res.status(200)
                                    res.json({status: 'Advert updated'})
                                }
                            })
                        }else{
                            console.log("Console Error - No advert obj provided?")
                        }
                    }else{
                        res.status(400)
                        res.json({status: 'user-unauthorised'})
                    }
                })
            })
        }
    })
})


/** Route for creating a screen group auth required, only the proposed owner of the screen group can create it **/
app.post('/screen/groups/', function(req, res){
    user.getUserId(dbData, req.body['Owners'], function(err, result) {
        auth.matchUserAuth(dbData, result[0].ID, req, function (err, result) {
            console.log(result.status)
            if (result.status === 'user-authorised') {
                console.log('Incoming SG creation data')
                if (req.body) {
                    console.log('Attempting create sg (id=' + req.body['ID'] + ')')
                    screen.createScreenGroup(dbData, req, function (err, result) {
                        if (err) {
                            res.status(400)
                            console.log(err)
                            res.json(err)
                        } else {
                            console.log('SG Created')
                            res.status(200)
                            res.json({status: 'SG Created'})
                        }
                    })
                } else {
                    console.log("Console Error - No advert obj provided?")
                }
            } else {
                res.status(400)
                res.json({status: 'user-unauthorised'})
            }
        })
    })

})

/** Route for creating a screen group auth required, only the proposed owner of the screen group can create it **/
app.post('/screen/token/', function(req, res){
    user.getUserId(dbData, req.body['Owner'], function(err, result) {
        if(result[0] != null) {
            auth.matchUserAuth(dbData, result[0].ID, req, function (err, result) {
                console.log(result.status)
                if (result.status === 'user-authorised') {
                    console.log('Incoming SGT creation data')
                    if (req.body) {
                        console.log('Attempting create sgt (id=' + req.body['ID'] + ')')
                        screen.createScreenToken(dbData, req, function (err, result) {
                            if (err) {
                                res.status(400)
                                res.json({status: 'token-exists'})
                            } else {
                                console.log('SGT Created')
                                res.status(200)
                                res.json({status: 'Screen Token Created'})
                            }
                        })
                    } else {
                        console.log("Console Error - No advert obj provided?")
                    }
                } else {
                    res.status(400)
                    res.json({status: 'user-unauthorised'})
                }
            })
        }else{
            res.status(401)
            res.json({status:"Error: You are using a user that does not exist"})
        }
    })

})


/** Route for deleting a screen group auth required, only the proposed owner of the screen group can delete it **/
app.delete('/screen/token/:token', function(req, res){
    console.log(req.body)
    user.getUserId(dbData, req.headers.username, function(err, result) {
        if(result[0] != null) {
            auth.matchUserAuth(dbData, result[0].ID, req, function (err, result) {
                console.log(result.status)
                if (result.status === 'user-authorised') {
                    console.log('Incoming SGT deletion data')
                    if (req.body) {
                        console.log('Attempting delete sgt (id=' + req.body['ID'] + ')')
                        screen.destroyScreenToken(dbData, req, function (err, result) {
                            if (err) {
                                res.status(400)
                                res.json({status: 'Error when deleting'})
                            } else {
                                res.status(200)
                                res.json({status: 'Screen Token destroyed'})
                            }
                        })
                    } else {
                        console.log("Console Error - No token obj provided?")
                    }
                } else {
                    res.status(400)
                    res.json({status: 'user-unauthorised'})
                }
            })
        }else{
            res.status(401)
            res.json({status:"Error: You are using a user that does not exist"})
        }
    })

})
// Response methods

app.post('/response', function(req, res){
    console.log('test')
    auth.checkHID(dbData, req, function(err, result){
        if(result.status === 'success'){
            res.status(200)
            screen.createResponse(dbData, req, function(err){
                if(err){
                    res.status(400)
                    res.json(err)
                }else{
                    res.json({status:"Response recorded!"})
                }
            })
        }else{
            res.status(401)
            res.json({status:"An error occured. HID Issue?"})
        }
    })
})

app.post('/screen/impression', function(req, res){
    console.log('test')
    if(req.body['advertid']) {
        auth.checkHID(dbData, req, function (err, result) {
            if (result.status === 'success') {
                res.status(200)
                screen.incrementAdvertImpression(dbData, req, function (err, result) {
                    if (err) {
                        res.status(400)
                        res.json(err)
                    } else {
                        res.json({status: "Incremented advert"})
                    }
                })
            } else {
                res.status(401)
                res.json({status: "An error occured. HID Issue?"})
            }
        })
    }else{
        res.status(400)
        res.json({status: "No advert id supplied"})
    }
})

app.post('/screen/check-hid', function(req, res){
    screen.checkHID(dbData, req.headers.hardwareid, function(result){
        console.log(result)
        if(result == false){
            res.status(401)
            res.json({status:false})
        }else{
            res.status(200)
            res.json({status:true})
        }
    })
})

// User methods

/** Route for creating a new user, checks if exists before calling user.create **/
app.post('/user', function(req, res){
    console.log(req.headers)
    db.connect(dbData, function(err,data){
    var sql = 'SELECT * FROM Users WHERE username = "' + req.body['username'] + '"';
    console.log(req.body)
    if(req.body['username'] && req.body['password'] && req.body['email']){
        data.query(sql, function(err, result){
            if (err){
                res.status(400)
                res.end('Error during query')
            }
            if(result.length>0){
                // User exists
                res.status(400);
                res.end("Error - User already exists");

            }else{
                // User does not exist
                var date = Date.now() / 1000 | 0
                var salt = new String(req.body['username']+date).hashCode();
                var userObj = {
                    Username: req.body['username'],
                    Password: sha256(req.body['password']+salt),
                    Email: req.body['email'],
                    Salt: salt
                }
                user.create(dbData, userObj, function(err, data){
                    if(err){
                        res.status(400);
                        res.end("Error - "+err);
                    }
                    res.status(201);
                    res.end("Success - User created");
                });
            }
        });
        data.end();
    }else{
        res.status(400)
        res.end("Error: One or more fields are empty")
    }
    });
})

app.post('/user/login', function(req,res){
    var token = new String(user+(Date.now() / 1000 | 0)).hashCode();
    db.connect(dbData, function(err, data){
        var sql = 'SELECT * FROM Users WHERE username = "' + req.body['username'] + '"';
        data.query(sql, function(err, result){
            if(result.length > 0){
                // User does exist
                console.log(result)
                console.log(sha256(req.body['password']+result[0].Salt))
                if(sha256(req.body['password']+result[0].Salt) == result[0].Password){
                    // authorise
                    auth.createAuth(dbData,result[0].ID,token); // Store authtoken
                    res.send(JSON.stringify({ // Send auth details for client to use
                        'notification' : 'Login Successful',
                        'authtoken' : token,
                        'Username' : result[0].Username,
                        'ID': result[0].ID
                    }));
                    res.status(201);
                    res.end("Authorised");
                    console.log("Authorised user: " + result[0].Username);
                }else{
                    // Do not authorise
                    console.log("No auth");
                    res.status(400);
                    res.end("Wrong password");
                }
            }else{
                // User does not exist
                res.status(400);
                res.end("User does not exist");
            }
        });
        data.end();
    });
})

app.delete('/user/logout', function(req,res){
    console.log(req.headers['authtoken'])
    if(req.headers['authtoken']){
        auth.destroyAuth(dbData, req.headers['authtoken'])
        res.status(200)
        res.end("Logout Success")
    }else{
        res.status(400)
        console.log('no authkey')
        res.end('No authentication token provided to logout')
    }
})

app.post('/echo', function(req,res){
    console.log(JSON.stringify(req.body))
    res.json(req.body)
})

/** Misc **/
String.prototype.hashCode = function(){
    if (Array.prototype.reduce){
        return this.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
    }
    var hash = 0;
    if (this.length === 0) return hash;
    for (var i = 0; i < this.length; i++) {
        var character  = this.charCodeAt(i);
        hash  = ((hash<<5)-hash)+character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

var server = http.createServer(app)
//auth.test()
// Reload code here

server.listen(app.get('port'), function () {
    console.log('Web server listening on port ' + app.get('port'))
})
