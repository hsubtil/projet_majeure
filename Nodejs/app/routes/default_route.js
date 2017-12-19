// default_route.js
var CONFIG = JSON.parse(process.env.CONFIG);

var http = require('http');
var express = require("express");
var path = require("path");
var fs = require("fs");
var router = express.Router();

module.exports = router;


 /*route
router.get("/", function (request, response) {
    response.send("It works !");
    console.log("[REDIRECT] Redirect to path / ");
});*/

/*
router.post('/', function (request, response) {
    var data = JSON.stringify({
        'login': request.body['login'],
        'password': request.body['password']
    });
    console.log("[HTTP] -> Post /login " + data);
    var options = {
        host: 'localhost',
        port: '8080',
        path: '/FrontAuthWatcherWebService/rest/WatcherAuth',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': data.length
        }
    };

    	var req = http.request(options, function(res) {
          var msg = '';
          res.setEncoding('utf8');
          console.log("[HTTP] Request to JEE server " + JSON.stringify(options));
          
          res.on('data', function(chunk) {
            msg += chunk;
          });
          res.on('end', function() {
                console.log(msg);
                if(msg === "")
            {
                console.log("Empty reply from JEE webservice");	  
                response.send(msg);
            }
            else{
                var reply = JSON.parse(msg);
                    if(reply['validAuth'] === false){
                        console.log("validAuth is false");
                  //      res.end('<html><body>Auth is false</body></html>');
                    response.send(msg);
                }
                else{
                        //response.redirect("/admin");
                        response.send(msg);
                }
            }
          });
        });
        req.write(data);
        req.end();
   

});*/