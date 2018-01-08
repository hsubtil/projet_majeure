var io = require('socket.io-client');
var request_url = "http://192.168.1.102:1337";

class Comm {
   constructor() {
       this.comm = {};
       this.comm.io = {};
       this.socket = "";
       this.emitOnConnect = this.emitOnConnect.bind(this);
       this.result = null;

   }

   toString() {
       return '';
   }

   
   emitOnConnect(message) {
       this.socket.emit('connection', this.comm.io.uuid, function (test) {
           console.log(test);
       });
   }

   socketConnection(uuid) {
       this.socket = io.connect(request_url); //process.env.SOCKET_URL
       console.log("SOCKETCONNECTION");
       this.comm.io.uuid = uuid;
       this.socket.on('connection', message => { this.emitOnConnect(message) });
   }

   emitConnect(json, CB) {
       this.socket.emit('auth_attempt',json);
       this.socket.on('auth_success', function (data) {
        console.log("auth_success");
        this.result = true;
        CB(this.result);
       });
       this.socket.on('auth_failed', function (data) {
        console.log("auth_failed");
        this.result = false;
        CB(this.result);
       });
       this.socket.on('node_error', function (data) {
        console.log("error");
        this.result = false;
        CB(this.result);
       });
   }
   

}

module.exports = Comm;