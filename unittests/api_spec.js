/** Unit tests done in Jasmine **/
var request = require("request");
var apiserver = require("../index.js")
var base_url = "http://localhost:3000/"


function makerandom() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
var random = makerandom()

/// GET API TESTS ///

describe("API GET Routes", function() {
    describe("Getting screens owned by a specific user called 'System'", function() {
        it("returns status code 200", function(done) {
            request.get(base_url+"screens/user/System", function(error, response, body) {
                expect(response.statusCode).toBe(200);
                done();
            });
        });
    });

    describe("Getting data of all screen groups owned by a specific user by Owner called 'System'", function() {
        it("returns status code 200", function(done) {
            request.get(base_url+"screens/groups/user/System", function(error, response, body) {
                expect(response.statusCode).toBe(200);
                done();
            });
        });
    });

    describe("Getting data of all screen group tokens owned by a specific user by Owner without authentication", function() {
        it("returns status code 400", function(done) {
            request.get(base_url+"screen/tokens/user/System", function(error, response, body) {
                expect(response.statusCode).toBe(400);
                done();
            });
        });
    });

    describe("Getting data of all screen group tokens owned by a specific user by Owner with authentication", function() {
        it("returns status code 200", function(done) {
            request.get({
                url: base_url+"screen/tokens/user/System",
                headers: {
                    "authtoken":"-1209705285",
                    "username": "System"
                }
            }, function(error, response, body) {
                expect(response.statusCode).toBe(200);
                done();
            });
        });
    });

    describe("Getting content of a specific advert by ID without auth", function() {
        it("returns status code 401", function(done) {
            request.get(base_url+"screen/advert/1", function(error, response, body) {
                expect(response.statusCode).toBe(401);
                done();
            });
        });
    });

    describe("Getting content of a specific advert by ID with auth", function() {
        it("returns status code 200", function(done) {
            request.get({
                url: base_url+"screen/advert/1",
                headers: {
                    "authtoken":"-1209705285",
                    "username": "System"
                }
            }, function(error, response, body) {
                expect(response.statusCode).toBe(200);
                done();
            });
        });
    });

    describe("Getting content for all adverts for a given screen with invalid/no hardware id", function() {
        it("returns status code 400", function(done) {
            request.get(base_url+"screen/adverts", function(error, response, body) {
                expect(response.statusCode).toBe(400);
                done();
            });
        });
    });

    describe("Getting content of a specific advert by ID with auth", function() {
        it("returns status code 200", function(done) {
            request.get({
                url: base_url+"screen/advert/1",
                json: true,
                headers: {
                    "authtoken":"-1209705285",
                    "username": "System"
                }
            }, function(error, response, body) {
                expect(response.statusCode).toBe(200);
                done();
            });
        });
    });

    describe("Getting the adverts of a valid user", function() {
        it("returns status code 200", function(done) {
            request.get(base_url+"useradverts/System", function(error, response, body) {
                expect(response.statusCode).toBe(200);
                done();
            });
        });
    });

    describe("Getting the adverts of an invalid user", function() {
        it("returns status code 400", function(done) {
            request.get(base_url+"useradverts/invalidusername", function(error, response, body) {
                expect(response.statusCode).toBe(400);
                done();
            });
        });
    });

    describe("Get all responses of a given valid advert id without auth", function() {
        it("returns status code 401", function(done) {
            request.get(base_url+"responses/1", function(error, response, body) {
                expect(response.statusCode).toBe(401);
                done();
            });
        });
    });

    describe("Get all responses of a given valid advert id with auth", function() {
        it("returns status code 200", function(done) {
            request.get({
                url: base_url+"responses/1",
                headers: {
                    "authtoken":"-1209705285",
                    "username": "System"
                }
            }, function(error, response, body) {
                expect(response.statusCode).toBe(200);
                done();
            });
        });
    });


})

/// POST API TESTS ///

describe("API POST Routes", function() {

    describe("Creating an Advert with valid auth", function() {
        it("returns status code 201", function(done) {
            request.post(base_url+"screen/adverts",
                {
                    json: true,
                    body: {
                        'Owner': "System",
                        'Content':'{"title":"test"}'
                    },
                    headers: {
                        "authtoken":"-1209705285",
                        "username": "System"
                    }
                }, function(error, response, body) {
                    expect(response.statusCode).toBe(201);
                    done();
                });
        });
    });

    describe("Sending screen heartbeat with valid hardware id", function() {
        it("returns status code 200", function(done) {
            request.post(base_url+"screen/heartbeat",
                {
                    json: true,
                    headers: {
                        "hardwareid":"58ee06c5661eed347e19b170eafcaf63"
                    }
                }, function(error, response, body) {
                    expect(response.statusCode).toBe(200);
                    done();
                });
        });
    });

    describe("posting screen token for authorisation with a token that exists and new hardware id", function() {
        it("returns status code 201", function(done) {
            request.post(base_url+"screens/aaa-aaa-aaa",
                {
                    json: true,
                    headers: {
                        "hardwareid": random
                    }
                }, function(error, response, body) {
                    expect(response.statusCode).toBe(201);
                    done();
                });
        });
    });

    describe("creating a screen group with valid auth/proposed owner", function() {
        it("returns status code 200", function(done) {
            request.post(base_url+"screen/groups",
                {
                    json: true,
                    body: {
                        'Owners': "System",
                        'Name': random
                    },
                    headers: {
                        "authtoken":"-1209705285",
                        "username": "System"
                    }
                }, function(error, response, body) {
                    expect(response.statusCode).toBe(200);
                    done();
                });
        });
    });

    describe("creating a screen token with valid auth/proposed owner", function() {
        it("returns status code 200", function(done) {
            request.post(base_url+"screen/token/",
                {
                    json: true,
                    body: {
                        'Token': random,
                        'Screen_Group': 2,
                        'Owner': "System"
                    },
                    headers: {
                        "authtoken":"-1209705285",
                        "username":"System"
                    }
                }, function(error, response, body) {
                    expect(response.statusCode).toBe(200);
                    done();
                });
        });
    });

    describe("test for when screen wants to register when a user has opened an advert, if the screen is registered/authenticated", function() {
        it("returns status code 201", function(done) {
            request.post(base_url+"screen/impression",
                {
                    json: true,
                    body: {
                        "advertid": 1
                    },
                    headers: {
                        "hardwareid": "0TzhlwOJ2Z",
                    }
                }, function(error, response, body) {
                    expect(response.statusCode).toBe(201);
                    done();
                });
        });
    });

    describe("Request to check if a hardware id is valid or not, this test provides a valid HID", function() {
        it("returns status code 200", function(done) {
            request.post(base_url+"screen/check-hid",
                {
                    json: true,
                    headers: {
                        "hardwareid": "0TzhlwOJ2Z"
                    }
                }, function(error, response, body) {
                    expect(response.statusCode).toBe(200);
                    done();
                });
        });
    });

    describe("Request to check if a hardware id is valid or not, this test provides an invalid HID", function() {
        it("returns status code 401", function(done) {
            request.post(base_url+"screen/check-hid",
                {
                    json: true,
                    headers: {
                        "hardwareid": "INVALIDHARDWAREID"
                    }
                }, function(error, response, body) {
                    expect(response.statusCode).toBe(401);
                    done();
                });
        });
    });

    describe("creating a new user with a valid username that hasn't been taken", function() {
        it("returns status code 201", function(done) {
            request.post(base_url+"user",
                {
                    json: true,
                    body: {
                        'username': random,
                        'password': random,
                        'email': random,
                    }
                }, function(error, response, body) {
                    expect(response.statusCode).toBe(201);
                    done();
                });
        });
    });

    describe("attempt to login using valid details", function() {
        it("returns status code 200", function(done) {
            request.post(base_url+"user/login",
                {
                    json: true,
                    body: {
                        'username': random,
                        'password': random,
                    }
                }, function(error, response, body) {
                    expect(response.statusCode).toBe(200);
                    done();
                });
        });
    });

    describe("create a form response for an advert with valid HID", function() {
        it("returns status code 200", function(done) {
            request.post(base_url+"response",
                {
                    json: true,
                    body: {
                        'Name': random,
                        'Email': random,
                        'OriginAdvertID': 2
                    },
                    headers: {
                        "hardwareid": random
                    }
                }, function(error, response, body) {
                    expect(response.statusCode).toBe(200);
                    done();
                });
        });
    });

})

/// PUT API TESTS ///

describe("API PUT Routes", function() {

    describe("update an advert with valid auth and permission", function() {
        it("returns status code 200", function(done) {
            request.put(base_url+"screen/adverts/35",
                {
                    json: true,
                    body: {
                        'Owner': "System",
                        'Content': random
                    },
                    headers: {
                        "authtoken":"-1209705285",
                        "username":"System"
                    }
                }, function(error, response, body) {
                    expect(response.statusCode).toBe(200);
                    done();
                });
        });
    });

    describe("update an advert with invalid auth", function() {
        it("returns status code 400", function(done) {
            request.put(base_url+"screen/adverts/35",
                {
                    json: true,
                    body: {
                        'Owner': "System",
                        'Content': random
                    },
                    headers: {
                        "authtoken":"INVALID",
                        "username":"INVALID"
                    }
                }, function(error, response, body) {
                    expect(response.statusCode).toBe(400);
                    done();
                });
        });
    });

    describe("update a screen group with valid auth and permission", function() {
        it("returns status code 200", function(done) {
            request.put(base_url+"screen/groups/16",
                {
                    json: true,
                    body: {
                        'Owners': "System",
                        'Name': "testUNITTEST",
                        'adverts': "(1,2,3,4,5,6,7,8)"
                    },
                    headers: {
                        "authtoken":"-1209705285",
                        "username":"System"
                    }
                }, function(error, response, body) {
                    expect(response.statusCode).toBe(200);
                    done();
                });
        });
    });

})
