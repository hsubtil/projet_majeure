"use strict";
var CONFIG = require("../../config.json");
process.env.CONFIG = JSON.stringify(CONFIG);
var LOG = require("../utils/log");
var REQUEST = require("./requetes"); // JEE Client
var DB = require("./dbController.js"); // DB Controller 
var FAMILY = require("../models/familyModel.js");
var METEO = require("./requetesMeteo.js"); // Meteo webservice 
var GOOGLE = require("./google/quickstart.js");


// const passport = require('passport');

// Modules imports
var path = require("path");
var http = require('http');
var jwt = require('jsonwebtoken');
var fs = require('fs');

module.exports = this;
var io;
var socket_map = {};
var families_map = { 'families':[] };

this.listen = function (server) {
    LOG.debug("In io.controller.js");
    var io = require('socket.io').listen(server);
    // Create new db object

    io.sockets.on('connection', function (socket) {
        LOG.log("[SOCKET] New client " + socket.id);
        socket_map[socket.id] = socket;

        /***************************************************************************** USERS *****************************************************************************/

        /*
        *  param : JSON {'mail':"",'password':"",'profile':{'coord':{'lat':,'lon':}}} // @TODO Add to doc
        *  return : JSON { 'email': "nabil.fekir@ol.com", 'name': "nabil", 'surname': "fekir", 'address': "Rue du stade", 'cp': "69110", 'city': "Decines", 'country': "France", 'birthday': "19-12-93" }
        *  When Front server send an auth event, ask to JEE server if auth is valid or not. 
        */
        socket.on('auth_attempt', function (json_object) {
            LOG.log("[SOCKET] Connection event" + JSON.stringify(json_object['email']));
            REQUEST.connection(socket, json_object, function (err) {
                if (!err) {
                    // Protection if profile is not provided 
                    if (!json_object['profile']) {
                        createToken(json_object['email'], function (token) {
                            if (token) {
                                socket.emit('auth_success', token);
                            }
                        });
                    } else {
                        DB.updateUser(json_object['email'], json_object['profile'], function (err) {
                            createToken(json_object['email'], function (token) {
                                if (token) {
                                    socket.emit('auth_success', token);
                                }
                            });
                        });
                    }
                    // Emit connection for chat
                }
            });
        });

        /*
        *  param : JSON {'mail':"",'password':""}
        *  return : JSON
        *  Registration attempt. If JEE reply with error (user alredy exist or insertion problem), no insertion in MongoDb. 
        */
        socket.on('sign_up_attempt', function (json_object) {
            LOG.log("[SOCKET] Sign Up event");
            LOG.log(json_object);
            var json_jee = { 'email': json_object['email'], 'password': json_object['password'], 'role': "USER" };
            delete json_object['password'];
            REQUEST.register(socket, json_jee, function (error) {
                LOG.log("Error debug");
                LOG.log(error);
                if (!error) {
                    DB.register(json_object);
                    socket.emit('registration_success');
                }
                else {
                    socket.emit('registration_failed', error);
                }
            });
        });

        /*
        *  param : JSON {'token':'mail':''}
        *  return : JSON { 'email': "nabil.fekir@ol.com", 'name': "nabil", 'surname': "fekir", 'address': "Rue du stade", 'cp': "69110", 'city': "Decines", 'country': "France", 'birthday': "19-12-93" }
        *  Request to MongoDB a user profile
        *
        */
        socket.on('request_profile', function (json_object) {
            LOG.log("[SOCKET] Request user profil");
            LOG.debug(json_object);
            checkToken(json_object['token'], socket, function (err) {
                if (!err) {
                    DB.getProfile(json_object['email'], function (err, res) {
                        if (!err)
                            socket.emit('request_profile_reply', res);
                        else
                            socket.emit('node_error', err);
                    });
                }
                else {
                    LOG.log("[SOCKET] Request user profil error.");
                    socket.emit('node_error', err);
                }
            });
        });

        /*
       *  param : JSON { 'token': 'email': "nabil.fekir@ol.com", 'profile':{'name': ....} }
       *  Update in MongoDB a user profile. Not all fields are requierd for the profile. 
       *
       */
        socket.on('update_user_profil', function (json_object) {
            LOG.warning("[SOCKET] Update user profil " + json_object['email']);
            if (json_object != undefined) {
                checkToken(json_object['token'], socket, function (err) {
                    if (!err) {
                        DB.updateUser(json_object['email'], json_object['profile'], function (err) {
                            LOG.debug("Profile updated");
                            socket.emit('update_user_profil_success', err); //@TODO Add to doc
                        });
                    }
                    else {
                        LOG.error("[SOCKET] Update user profil error.");
                        socket.emit('error', err);
                    }
                });
            } else {
                LOG.error("[SOCKET] Update user profil undefined.");
                socket.emit('error', "undefined JSON");
            }

        });

        /***************************************************************************** FAMILIES *****************************************************************************/
        /*
        *  param : JSON {'mail':''}
        *  return : JSON { 'family': [{ 'name': "Monge", 'id': "36496", 'code': "codemonge" }, { 'name': "Fekir", 'id': "18496", 'code': "nabilon" }]}
        *  Request to MongoDB a user families
        *
        */
        socket.on('request_family', function (json_object) {
            LOG.log("[SOCKET] Request family info");
            checkToken(json_object['token'], socket, function (err) {
                if (!err) {
                    DB.getFamilies(json_object['email'], function (err, res) {
                        if (!err) {
                            socket.emit('request_family_reply', res);
                        }
                        else {
                            LOG.log("[SOCKET] Request family error.");
                            //socket.emit('error_family', err);
                        }
                    });
                }
            });
        });

        /*
            param: json_object : JSON {token:, code:}
            Save the family choice of a user.
            
        */
        socket.on('select_family', function (json_object) {
            LOG.log("[SOCKET] Save selected family.");
            checkToken(json_object['token'], socket, function (err) {
                if (!err) {
                    families_map['families'].push({ 'code': json_object['code'], 'socket': socket });
                    console.log(families_map['families']);
                    LOG.log(families_map);
                    socket.emit('selected_family_ok');   // @TODO : Add to doc
                } else {
                    socket.emit('selected_family_ko');   // @TODO : Add to doc
                }
            });
        });

        /*
            param
                json_object:{'token':,'email':,'current_family_id':,'next_family_id'}
            Switch family id for a socket.
        */
        socket.on('switch_family', function (json_object) {
            LOG.log("[SOCKET] Switch family from " + json_object['current_family_id'] + " to " + json_object['next_family_id']);
            checkToken(json_object['token'], socket, function (err) {
                if (!err) {
                    var i = 0;
                    for (var element in families_map['families']) {
                        LOG.debug(i);
                        LOG.debug(element);
                        if (families_map['families'][element]['socket'] === socket) {
                            families_map['families'].splice(i, 1);  // Remove from family array
                            families_map['families'].push({ 'code': json_object['next_family_id'], 'socket': socket });  // add to family array
                        }
                        i++;
                    }
                    LOG.log(families_map['families']);
                }
            });

        });

        /*
            param: json_object JSON {'token','email', 'family': "Monge" }}
            Create a new family and add it to the user families. 
        */
        socket.on('new_family', function (json_object) {
            LOG.log("[SOCKET] New family ");
            var user = json_object['email'];
            var family = new FAMILY();
            family.name = json_object['family'];
            family.generateCode();
            checkToken(json_object['token'], socket, function (err) {
                if (!err) {
                    DB.addFamily(family, function (err) {
                        if (!err) {
                            DB.getFamily(family.name, function (err, reply) {
                                if (!err) {
                                    LOG.log("[SOCKET] New family for user " + JSON.stringify(user));
                                    DB.addFamilyToUser(user, reply);
                                }
                            });
                        }
                    });
                }
            });
        });

        /*
            param : JSON {'token','email','code'}
        */
        socket.on('add_family_to_user', function (json_object) {
            checkToken(json_object['token'], socket, function (err) {
                if (!err) {
                    DB.getFamilyWithCode(json_object['code'], function (err, res) {
                        if (!err) {
                            DB.addFamilyToUser(json_object['email'], json_object['code'], res);
                        }
                    });
                }
            });
        });

        /***************************************************************************** CHAT *****************************************************************************/

        /*
        *  param : json_object, JSON {token:, msg:{code:, user:, date: , content: }}
        *           date format : YYYY-mm-dd HH:MM:ss
        *  return : null
        *  New message event.
        *
        * 
        */
        socket.on('new_message', function (json_object) {
            LOG.log("[SOCKET] New message.");
            checkToken(json_object['token'], socket, function (err) {
                if (!err) {
                    DB.saveMessage(json_object['msg'], function (err) {
                        if (!err) {
                            LOG.debug("VALUE FAMILIES MAP");
                            console.log(families_map['families']);
                            for (var element in families_map['families']) {
                                LOG.debug(json_object['msg']['code']);
                                LOG.debug(families_map['families'][element]);
                                if (families_map['families'][element]['code'] === json_object['msg']['code']) {
                                    LOG.log("[SOCKET] Emit new message available event");
                                    families_map['families'][element]['socket'].emit('new_message_available', json_object['msg']); // Emit new message to all family members connected
                                }
                            }
                        }
                    });
                }
            });
        });

        socket.on('load_messages', function (json_object) {
            var family_code = json_object['code'];
            LOG.log("[SOCKET] Load messages for family " + JSON.stringify(family_code));
            checkToken(json_object['token'], socket, function (err) {
                if (!err) {
                    DB.loadMessages(family_code, function (err, msgs) {
                        if (!err) {
                            socket.emit('load_messages_reply', msgs);
                        }
                    });
                }
            });
        });
/***************************************************************************** GOOGLE *****************************************************************************/
        socket.on('test_google', function () {
            LOG.log("[SOCKET] In google Api test event.");
            fs.readFile('client_secret.json', function processClientSecrets(err, content) {
                if (err) {
                    console.log('Error loading client secret file: ' + err);
                    return;
                }
                // Authorize a client with the loaded credentials, then call the
                // Google Calendar API.
                GOOGLE.authorize(JSON.parse(content), function (oAuth) {
                    GOOGLE.listUserEvents(oAuth);
                });
                //GOOGLE.authorize(JSON.parse(content), GOOGLE.addEvents);
            });
            /*GOOGLE.listEvents(function (res) {
                LOG.debug("[SOCKET] Test Api is ok");
            }); */
            //passport.authenticate('google', { scope: ['profile'] });

        });

        socket.on('google_reply', function () {
            LOG.log("[SOCKET] In google reply");

        });

/***************************************************************************** METEO *****************************************************************************/
     /*   TO REMOVE
        socket.on('get_meteo', function (json_object) {
            LOG.log("[SOCKET] Get_meteo for family ");
            var family_code = json_object['code'];
            LOG.log("[SOCKET] Get_meteo for family " + JSON.stringify(family_code))
            checkToken(json_object['token'], socket, function (err) {
                if (!err) {
                    //TO DO:get localisation of each member of a family (input family_code, output: list localisation)
                    var coords ={"nom1" : {"lat": 45.45, "lon": 34.34}
                                ,"nom2": {"lat": 46.46, "lon": 4.4}
                                ,"nom3" : {"lat": 3.46, "lon": 4.4}
                            };
                    LOG.log("[SOCKET] " + JSON.stringify(coords));
                    //JSON.parse(coords);
                    METEO.get_meteo(coords, function (err, msgs) {
                        if (!err) {
                            LOG.debug("Resultat Final : "+ JSON.stringify(msgs));
                            //socket.emit('load_messages_reply', msgs);
                        }
                    });
                }
            });
        });
        */

        /*
        *  Return 
        */
        socket.on('request_family_meteo', function (json_object) {
            LOG.log("[SOCKET] Request family members");
            var meteoRequestJson = {};
            var lock_increment = 0;
            checkToken(json_object['token'], socket, function (err) {
                if (!err) {
                    DB.getMemberOfFamily(json_object['code'], function (err, family_members) {
                        for (var member in family_members) {
                            LOG.debug(member);
                            LOG.debug("In for " + JSON.stringify(family_members[member]));
                            DB.getProfile(family_members[member]['email'], function (profile) {
                                var name = profile['name'];
                                LOG.debug(profile['coord']);
                                LOG.debug(name);
                                meteoRequestJson[name] = profile['coord'];
                                console.log(JSON.stringify(meteoRequestJson));
                                LOG.debug("member");
                                lock_increment++;  // Increment lock_increment
                                LOG.debug(family_members.length);
                                if (lock_increment === family_members.length) {
                                    LOG.debug("In if ");
                                    METEO.get_meteo(meteoRequestJson, function (err, msgs) {
                                        LOG.debug(" [METEO] IN");
                                        if (!err) {
                                            LOG.debug("Resultat Final : " + JSON.stringify(msgs));
                                        }
                                    });
                                }
                            });
                        }                        
                    });
                }
            });
        });

        socket.on('disconnect', function () {
            LOG.log("[SOCKET] Client " + socket.id + " disconnect event");
            delete socket_map[socket.id];
        });
    });
};

/**
 * 
 * @param {String} token
 * @param {String} socket
 * @param {Function} cb
 */
function checkToken(token, socket, cb) {
    LOG.debug(token);
    jwt.verify(token, CONFIG.tokenkey, function (err, decoded) {
        if (err) {
            LOG.error("[AUTH] Token is false !");
            LOG.error(err);
            socket.emit("auth_failed",err);
            cb(err);
        } else {
            LOG.debug("[AUTH] Token is valid");
            socket.emit("invalid_token");  // @TODO : add to doc
            if (cb) {
                cb(null);
            }
        }
        // @TODO: add error_code if token is false 
    });
}

/**
 *
 * @param {String} email
 * @param {String} socket
 *  @param {function} cb
 */
function createToken(email, cb) {
    DB.getProfile(email, function (err,res) {
        var reply = { "token": jwt.sign(res, CONFIG.tokenkey), "name":res['name'] };   // If timeout exp: Math.floor(Date.now() / 1000) + (60 * 60),
        LOG.debug(JSON.stringify(reply));
        cb(reply);
    });
}



