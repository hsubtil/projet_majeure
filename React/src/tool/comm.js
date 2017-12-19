var io = require('socket.io-client');
var request_url = "http://192.168.1.101:1337";

class Comm {
   constructor() {
       this.comm = {};
       this.comm.io = {};
       this.socket = "";
       this.emitOnConnect = this.emitOnConnect.bind(this);

   }

   toString() {
       return '';
   }

   
   emitOnConnect(message) {
       console.log("message");
       console.log("socket");
       console.log(this.socket);
       console.log("this.comm.io.uuid");
       console.log(this.comm.io.uuid);
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
   //TO DO : Hugo -> Change JSON parse in NODE project
   emitConnect(json) {
       this.socket.emit('auth_attempt',json);
   }
   
}

module.exports = Comm;