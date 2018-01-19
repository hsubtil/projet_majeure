"use strict";
var CONFIG = require("../../config.json");
process.env.CONFIG = JSON.stringify(CONFIG);
var LOG = require("../utils/log");
var STATS = require("../utils/stats");
var REQUEST = require("./requetes"); // JEE Client
var DB = require("./dbController.js"); // DB Controller 
var FAMILY = require("../models/familyModel.js");
var METEO = require("./requetesMeteo.js"); // Meteo webservice 
var GOOGLE = require("./google/quickstart.js");
//var ADMIN = require("../../admin/controllers/admin.controller.js");


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
        //ADMIN.addSocket(socket);
        STATS.addSocketToStats();
        socket_map[socket.id] = socket;
        /***************************************************************************** ADMIN *****************************************************************************/
        /*
        socket.on('admin_connection', function () {
            LOG.log("[SOCKET] Admin connection");
            socket.emit('socket_number', ADMIN.socketsOpen);
            LOG.log(ADMIN.socketsOpen);
           /* setInterval(function () {
                LOG.debug("EMIT TEST ADMIN");
                socket.emit('socket_number', ADMIN.socketsOpen);
            }, 5000);
        });

        // Json  with cmd inside
        socket.on('admin', function (json_object) {
            if (json_object) {
                ADMIN.execute(json_object['cmd']);
            } else {
                ADMIN.execute('getNumberSockets');  // For testing
            }
        });
    */
        /***************************************************************************** USERS *****************************************************************************/

        /*
        *  param : JSON {'email':"",'password':"",'profile':{'coord':{'lat':,'lon':}}} 
        *  return : JSON { 'email': "nabil.fekir@ol.com", 'name': "nabil", 'surname': "fekir", 'address': "Rue du stade", 'cp': "69110", 'city': "Decines", 'country': "France", 'birthday': "19-12-93" }
        *  When Front server send an auth event, ask to JEE server if auth is valid or not. 
        */
        socket.on('auth_attempt', function (json_object) {
            LOG.log("[SOCKET] Connection event " + JSON.stringify(json_object['email']));
            LOG.debug(JSON.stringify(json_object));
            var profile = json_object['profile'];
            var coord = json_object['profile'].coord;
            delete json_object['profile']; // Removes json.foo from the dictionary.
            REQUEST.connection(socket, json_object, function (err, res) {
                if (!err) {
                    // Protection if profile is not provided 
                    if (!coord) {   // Test. Changed  from !profile !coord
                        createToken(json_object['email'], res['role'], function (token) {
                            if (token) {
                                socket.emit('auth_success', token);
                            }
                        });
                    } else {
                        DB.updateUser(json_object['email'], profile, function (err) {
                            createToken(json_object['email'], function (token) {
                                if (token) {
                                    STATS.addAuthRequest();
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
                    STATS.addNewUser();
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
                        if (!err) {
                            STATS.addProfileRequest();
                            socket.emit('request_profile_reply', res);
                        }
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
                        DB.updateUser(json_object['email'], json_object['profile'], function (err,res) {
                            if (!err) {
                                LOG.debug("Profile updated");
                                STATS.addProfileRequest();
                                socket.emit('update_user_profil_success', err);
                            }
                            else {
                                LOG.error("[SOCKET] Update user profil error.");
                                socket.emit('node_error', err);
                            }
                        });
                    }
                });
            } else {
                LOG.error("[SOCKET] Update user profil undefined.");
                socket.emit('node_error', "undefined JSON");
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
                            STATS.addFamilyRequest();
                            socket.emit('request_family_reply', res);
                        }
                        else {
                            LOG.error("[SOCKET] Request family error.");
                            //socket.emit('error_family', err);
                        }
                    });
                }
            });
        });

        //TODO Add function for get localisation of all fam

        /*
            param: json_object : JSON {token:, code:}
            Save the family choice of a user.
            
        */
       /* socket.on('select_family', function (json_object) {
            LOG.log("[SOCKET] Save selected family.");
            checkToken(json_object['token'], socket, function (err) {
                if (!err) {
                    families_map['families'].push({ 'code': json_object['code'], 'socket': socket });
                    console.log(families_map['families']);
                    LOG.log(families_map);
                    socket.emit('selected_family_ok');
                } else {
                    LOG.error("[SOCKET] Select family error.");
                    socket.emit('selected_family_ko');   
                }
            });
        });*/

        /*
            param: json_object : JSON {token:, code:}
            Save the family choice of a user.
            
        */
        socket.on('select_family', function (json_object) {
            LOG.log("[SOCKET] Switch family to " + json_object['code']);
            checkToken(json_object['token'], socket, function (err) {
                if (!err) {
                    for (var element in families_map['families']) {
                        LOG.debug(element);
                        if (families_map['families'][element]['socket'] === socket) {
                            families_map['families'].splice(element, 1);  // Remove from family array
                            //families_map['families'].push({ 'code': json_object['next_family_id'], 'socket': socket });  // add to family array
                        }
                    }
                    families_map['families'].push({ 'code': json_object['code'], 'socket': socket });
                    console.log(families_map['families']);
                    socket.emit('select_family_success');
                }
                else {
                    LOG.error("[SOCKET] Switch family error.");
                    socket.emit('select_family_err');   
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
                    STATS.addFamilyRequest();
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
                else {
                    LOG.error("[SOCKET] Switch family error.");
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
            FAMILY.init(family, function (res) {
                checkToken(json_object['token'], socket, function (err) {
                    if (!err) {
                        DB.addFamily(family, function (err) {
                            if (!err) {
                                DB.getFamily(family.name, function (err, reply) {
                                    if (!err) {
                                        LOG.log("[SOCKET] New family for user " + JSON.stringify(user));
                                        DB.addFamilyToUser(user, reply['code'], reply);
                                        STATS.addFamilyRequest();
                                        socket.emit('new_family_success', family.getFamilyJson());
                                    }
                                    else {
                                        LOG.error("[SOCKET] New family error.");
                                        socket.emit('new_family_error');
                                    }
                                });
                            }
                            else
                                LOG.error("[SOCKET] New family error.");
                        });
                    }
                    else
                        LOG.error("[SOCKET] New family error.");
                });
            });
        });

        /*
            param : JSON {'token','email','code'}
        */
        socket.on('add_family_to_user', function (json_object) {
            LOG.log("[SOCKET] Add family to user.");
            checkToken(json_object['token'], socket, function (err) {
                if (!err) {
                    DB.getFamilyWithCode(json_object['code'], function (err, res) {
                        if (!err) {
                            DB.addFamilyToUser(json_object['email'], json_object['code'], res);
                            STATS.addFamilyRequest();
                            socket.emit('add_family_to_user_success',res);
                        }
                        else
                            LOG.error("[SOCKET] Add family to user error. User :" + json_object['email']);
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
                                    LOG.warning("[SOCKET] Emit new message available event");
                                    STATS.addChatRequest();
                                    families_map['families'][element]['socket'].emit('new_message_available', json_object['msg']); // Emit new message to all family members connected
                                }
                            }
                        }
                        else
                            LOG.error("[SOCKET] New message error.");
                    });
                }
            });
        });

        socket.on('load_messages', function (json_object) {
            var family_code = json_object['code'];
            LOG.log("[SOCKET] Load messages for family " + JSON.stringify(family_code));
            if (family_code === "") {
                LOG.error("[SOCKET] Family code is null.");
            } else {
                checkToken(json_object['token'], socket, function (err) {
                    if (!err) {
                        DB.loadMessages(family_code, function (err, msgs) {
                            if (!err) {
                                STATS.addChatRequest();
                                socket.emit('load_messages_reply', msgs);
                            }
                        });
                    }
                });
            }
        });
/***************************************************************************** GOOGLE *****************************************************************************/
        //TODO: ADD remove / modify event + DOC
        // Check C:\Users\Hugo\.credentials
        socket.on('test_google', function (json_object) {
            checkToken(json_object['token'], socket, function (err) {
                
                LOG.log("[SOCKET] In google Api test event.");
                fs.readFile('client_secret.json', function processClientSecrets(err, content) {
                    if (err) {
                        LOG.error('[SOCKET] Google : Error loading client secret file: ' + err);
                        return;
                    }
                    GOOGLE.authorize(JSON.parse(content), function (oAuth) {
                        LOG.debug(json_object['code']);
                        GOOGLE.addCalendar(oAuth, json_object['code'], function (res) {
                            STATS.addGoogleRequest();
                        });
                    });
                });
            });
        });

        /**
        *       param : json_object, JSON {token:, event : {
                                                            'summary': 'Test API mylittleplaner',
                                                            'location': 'CPE Lyon',
                                                            'description': 'A chance to hear more about Google\'s developer products.',
                                                            'start': {
                                                                'dateTime': '2018-01-15T09:10:00',
                                                                'timeZone': 'America/Los_Angeles',
                                                            },
                                                            'end': {
                                                                'dateTime': '2018-01-15T17:12:00',
                                                                'timeZone': 'America/Los_Angeles',
                                                            },
                                                            'attendees': [
                                                                { 'email': 'hs.subtil@gmail.com' },
                                                                { 'email': 'mylittleplaner@gmail.com' },
                                                            ]
                                                            }
        *       return : 
        */
        socket.on('google_set_event', function (json_object) {
         /*   var event = {
                                                            'summary': 'Test API mylittleplaner',
                'location': 'CPE Lyon',
                'description': 'A chance to hear more about Google\'s developer products.',
                'start': {
                                                                'dateTime': '2018-01-15T09:10:00',
                    'timeZone': 'America/Los_Angeles',
                                                            },
                'end': {
                                                                'dateTime': '2018-01-15T17:12:00',
                    'timeZone': 'America/Los_Angeles',
                                                            },
                'attendees': [
                    { 'email': 'hs.subtil@gmail.com' },
                    { 'email': 'mylittleplaner@gmail.com' },
                ]
                                                            };*/
            LOG.log("[SOCKET] In google set event");
            checkToken(json_object['token'], socket, function (err) {
                DB.getFamilyByCode(json_object['code'], function (err, family) {
                    if (!err) {
                        GOOGLE.addEvents(family['calendarId'], json_object['event'], function (err, res) {
                            if (!err) {
                                STATS.addGoogleRequest();
                                LOG.debug("Emit set event success");
                                socket.emit('google_set_event_reply', res);  //TODO : update doc
                            }
                            else {
                                socket.emit('google_set_event_err');
                                LOG.error("[SOCKET] Google Error: cannot set event. " + err);
                            }
                        });
                    }
                });
            });
        });

        /*
        *
        */
        socket.on('google_list_events', function (json_object) {
            LOG.log("[SOCKET] In google list event");
            checkToken(json_object['token'], socket, function (err) {
                DB.getFamilyByCode(json_object['code'], function (err, family) {
                    if (!err) {
                        GOOGLE.listUserEvents(family['calendarId'], function (err, res) {
                            if (!err) {
                                LOG.log("[SOCKET] Emit reply google list events");
                                console.log(res);
                                STATS.addGoogleRequest();
                                socket.emit('google_list_events_reply', res);
                            }
                            else {
                                socket.emit('google_list_events_err');
                                LOG.error("[SOCKET] Google Error: cannot list event. " + err);
                            }
                        });
                    }
                });
            });
        });

        /*
        *  param : JSON {'token','code','eventId'}
        */
        socket.on('google_remove_event', function (json_object) {
            LOG.log("[SOCKET] In google remove event");
            checkToken(json_object['token'], socket, function (err) {
                DB.getFamilyByCode(json_object['code'], function (err, family) {
                    if (!err) {
                        GOOGLE.deleteEvent(family['calendarId'], json_object['eventId'], function (err, res) {
                            if (!err) {
                                LOG.log("[SOCKET] Delete event for family " + json_object['code']);
                                socket.emit('google_remove_event_success', { 'id': json_object['eventId']});
                            }
                            else {
                                socket.emit('google_remove_event_err');
                                LOG.error("[SOCKET] Google Error: cannot list event. " + err);
                            }
                        });
                    }
                });
            });
        });
/***************************************************************************** METEO *****************************************************************************/

        /*
        *  Return
        *  @TODO: Meteo is not working.
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
                            LOG.debug(JSON.stringify(family_members[member]));
                            DB.getProfile(family_members[member]['email'], function (err, profile) {
                                LOG.debug(profile);
                                var name = profile['name'];
                                meteoRequestJson[name] = profile['coord'];
                                lock_increment++;  // Increment lock_increment
                                if (lock_increment === family_members.length) {
                                    METEO.get_meteo(meteoRequestJson, function (err, msgs) {
                                        LOG.debug("[METEO] IN");
                                        if (!err) {
                                            LOG.log("[SOCKET] Resultat Final : " + JSON.stringify(msgs));
                                            STATS.addMeteoRequest();
                                            socket.emit("request_family_meteo_reply", msgs);
                                        } else {
                                            socket.emit("request_family_meteo_err", err);
                                            LOG.error("[SOCKET] Meteo Error: cannot get meteo. " + err);
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
            //Remove from 
            delete socket_map[socket.id];
            STATS.removeSocketFromStats();
            // TODO 
            /*for (var element in families_map['families']) {
                if (families_map['families'][element]['socket'] === socket) {
                    families_map['families'].splice(i, 1);  // Remove from family array
                    LOG.log("[SOCKET] Family map " + socket.id + " delete");
                }
            }*/
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
            socket.emit("invalid_token");  
            if (cb) {
                cb(null);
            }
        }
    });
}

/**
 *
 * @param {String} email
 * @param {String} socket
 *  @param {function} cb
 */
function createToken(email, role, cb) {
    DB.getProfile(email, function (err, res) {
        if (!err) {
            var reply = { "token": jwt.sign(res, CONFIG.tokenkey), "name":res['name'], 'role':role };   // If timeout exp: Math.floor(Date.now() / 1000) + (60 * 60),
            LOG.debug(JSON.stringify(reply));
            cb(reply);
        }
        else
            LOG.error("[AUTH] Error: cannot create token. Profile is not found. " + err);
    });
}



