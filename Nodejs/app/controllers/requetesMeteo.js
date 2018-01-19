"use strict";
var CONFIG = require("../../config.json");
process.env.CONFIG = JSON.stringify(CONFIG);
var LOG = require("../utils/log");
var http = require('http');

module.exports = this;

/*
*   param :
*       socket : Client socket
*       json : JSON with all the info for the connection. The json will be send to jee server.
*       cb : callback function (optional)
*   This function is responsible for sending request to JEE server for the connection of a user. It's also responsible of sending the reply. 
*/
this.get_meteo = function (json, cb) {
    LOG.debug("[METEO] In connection with weather webservice");
    var json_string = JSON.stringify(json);
    LOG.debug("[METEO] Parameters " + json_string);
    var return_json= {};
    var wait = 0;

    Object.keys(json).forEach(function(key) {
    var val = json[key];
    var lon = val['lon'];
    var lat = val['lat'];
    LOG.debug("[METEO] Coord " + lon + ", " + lat);

    var param = 'lat=' + lat + '&lon=' + lon + '&APPID=d2379ef141dbadce9f31523a60ca1518';

    var options = {
        host: "api.openweathermap.org",
        path: '/data/2.5/weather?' + param,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    };

    

    wait ++;
    LOG.debug("[METEO] Avant request " + wait);
    var req = http.request(options, function (res) {
        var key2 = key;
        
        LOG.log("[HTTP] -> Send to weather webservice attempt: " + param);
        LOG.log("[HTTP] -> Request to weather webservice with options " + JSON.stringify(options));
        var msg = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            msg += chunk;
        });
        res.on('end', function () {
            // LOG.log("[HTTP] -> Resultat: "+ msg);
            msg = JSON.parse(msg);
            LOG.log(JSON.stringify(msg));
            var result = {};
            if (msg['cod']) {
                if (msg['cod'] == 400) {
                    LOG.error("[METEO] Empty coord. Cannot get meteo.");
                    cb(msg, null);
                }
                else {
                    result["main"] = msg["weather"][0]["main"];
                    result["description"] = msg["weather"][0]["description"];
                    result["icon"] = "http://openweathermap.org/img/w/" + msg["weather"][0]["icon"] + ".png";
                    result["temp"] = msg["main"]["temp"];
                    result["humidity"] = msg["main"]["humidity"];
                    result["wind"] = msg["wind"];
                    LOG.log("[HTTP] -> Resultat: " + JSON.stringify(result));
                    return_json[key2] = result;
                    wait--;
                    if (wait === 0) {
                        LOG.log("[HTTP] -> Resultat Final : " + JSON.stringify(return_json));
                        cb(null, return_json);
                    }
                }
            }
            else {
                LOG.warning("[METEO] No code in meteo WS reply");
            }
        
        });
    });

    req.on('timeout', function () {
        LOG.error("[HTTP] weather webservice reply Timeout");
        if (cb)
            cb("Timeout in the communication with weather webservice.");
    });

    req.on('error', function (e) {
        LOG.error("[HTTP] <- Error in the comm with weather webservice ");
        LOG.error(e);
        socket.emit('node_error', "Error in requetesMeteo.js function:get_meteo");
        LOG.log("[SOCKET] Emit error event");
    });
    //req.write(json_string);
    req.setTimeout(10000);
    req.end();

    });    
}



