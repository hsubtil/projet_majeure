"use strict";
var CONFIG = require("../../config.json");
process.env.CONFIG = JSON.stringify(CONFIG);
var LOG = require("../utils/log");
// JEE Client
var REQUEST = require("./requetes");
var DB = require("./dbController.js");


var path = require("path");
var http = require('http');
var jwt = require('jsonwebtoken');

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
        *  param : JSON {'mail':"",'password':""}
        *  return : JSON { 'email': "nabil.fekir@ol.com", 'name': "nabil", 'surname': "fekir", 'address': "Rue du stade", 'cp': "69110", 'city': "Decines", 'country': "France", 'birthday': "19-12-93" }
        *  When Front server send an auth event, ask to JEE server if auth is valid or not. 
        */
        socket.on('auth_attempt', function (json_object) {
            LOG.log("[SOCKET] Connection event");
            LOG.log(json_object['email']);
            REQUEST.connection(socket, json_object, function (err) {
               if (!err) {
                   createToken(json_object['email'], socket);
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
            REQUEST.register(socket, json_object, function (error) {
                if (!error) {
                    DB.register(json_object);
                }
            });  
        });

        /*
        *  param : JSON {'mail':''}
        *  return : JSON { 'email': "nabil.fekir@ol.com", 'name': "nabil", 'surname': "fekir", 'address': "Rue du stade", 'cp': "69110", 'city': "Decines", 'country': "France", 'birthday': "19-12-93" }
        *  Request to MongoDB a user profile
        *
        */
        socket.on('request_profile', function (json_object) {
            LOG.log("[SOCKET] Request user profil");
            LOG.debug(json_object);
            checkToken(json_object['token'], socket, function (err) {
                if (!err) {
                    DB.getProfile(json_object['email'], function (res) {
                        socket.emit('request_profile_reply', res);
                    });
                }
            });
        });

         /*
        *  param : JSON { 'token': 'email': "nabil.fekir@ol.com", 'profile':{'name': ....} }
        *  Update in MongoDB a user profile. Not all fields are requierd for the profile. 
        *
        */
        socket.on('update_user_profil', function (json_object) {
            LOG.log("[SOCKET] Update user profil " + json_object['email']);
            checkToken(json_object['token'], socket, function (err) {
                if (!err) {
                    DB.updateUser(json_object['email'], json_object['profile'], function (err) {
                        LOG.debug("Profile updated");
                    })
                }
            });
        })

/***************************************************************************** FAMILIES *****************************************************************************/
        /*
        *  param : JSON {'mail':''}
        *  return : JSON { 'family': [{ 'name': "Monge", 'id': "36496", 'code': "codemonge" }, { 'name': "Fekir", 'id': "18496", 'code': "nabilon" }]}
        *  Request to MongoDB a user families
        *
        */
        socket.on('request_family', function (json_object) {
            LOG.log("[SOCKET] Request family info");
            checkToken(json_object['token'],socket, function (err) {
                if (!err) {
                    DB.getFamilies(json_object['email'], function (res) {
                        socket.emit('request_family_reply', res);
                    })
                }
            });
        });

        /*
            param: json_object : JSON {token:, code}
            Save the family choice of a user.
            
        */
        socket.on('selected_family', function (json_object) {
            LOG.log("[SOCKET] Save selected family.");
            checkToken(json_object['token'], socket, function (err) {
                if (!err) {
                    families_map['families'].push({ 'code': json_object['code'], 'socket': socket });
                    console.log(families_map['families']);
                    LOG.log(families_map);
                    //socket.emit('selected_family_reply', families_map);
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
            param: json_object JSON {'token','email', 'family': [{ 'name': "Monge", 'id': "36496", 'code': "codemonge" }, { 'name': "Fekir", 'id': "18496", 'code': "nabilon" }]}
        */
        socket.on('new_family', function (json_object) {
            LOG.log("[SOCKET] New family ")
            var user = json_object['email'];
            LOG.log("[SOCKET] New family for user "+ JSON.stringify(user));
            checkToken(json_object['token'], socket, function (err) {
                if (!err) {
                    DB.addFamily(json_object['email'], json_object['family'])
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
            LOG.log("[SOCKET] New message.")
            checkToken(json_object['token'], socket, function (err) {
                if (!err) {
                    DB.saveMessage(json_object['msg'], function (err) {
                        if (!err) {
                            console.log(families_map['families']);
                            for (var element in families_map['families']) {
                                LOG.debug(json_object['msg']['code']);
                                if (families_map['families'][element]['code'] === json_object['msg']['code']) {
                                    LOG.log("[SOCKET] Emit new message available event");
                                    console.log(families_map['families'][element]['socket']);
                                    families_map['families'][element]['socket'].emit('new_message_available', json_object['msg']); // Emit new message to all family members connected
                                }
                            }
                            // socket.broadcast.emit('new_message_available', msg); // emit only on a family 
                        }
                    });
                }
            });
        });

        socket.on('load_messages', function (json_object) {
            var family_code = json_object['code'];
            LOG.log("[SOCKET] Load messages for family " + JSON.stringify(family_code))
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

        /*
        *  param : null
        *  return : null
        *  Disconnect a client from the socket_map
        *
        */
        socket.on('disconnect', function () {
            LOG.log("[SOCKET] Client " + socket.id+" disconnect event");
            delete socket_map[socket.id];
        });
    });

}

/**
 * 
 * @param {String} token
 * @param {Sstring} socket
 * @param {Function} cb
 */
function checkToken(token, socket, cb) {
    jwt.verify(token, CONFIG.tokenkey, function (err, decoded) {
        if (err) {
            LOG.error("[AUTH] Token is false !");
            LOG.error(err);
            socket.emit("auth_failed",err);
            cb(err);
        } else {
            LOG.debug("[AUTH] Token is valid");
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
 */
function createToken(email, socket) {
    DB.getProfile(email, function (res) {
        var token = JSON.stringify({ token: jwt.sign(res, CONFIG.tokenkey) });   // If timeout exp: Math.floor(Date.now() / 1000) + (60 * 60),
        LOG.debug(token);
        socket.emit('registration_success', token);
    });
}


