var io = require('socket.io-client');
var request_url = "http://192.168.1.100:1337";

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

   emitConnect(json) {
        return new Promise((resolve, reject) => 
        {
        this.socket.emit('auth_attempt',json);
        this.socket.on('auth_success', function (data) {
          console.log("auth_success");

          var json = JSON.stringify({ result : true, datas : data})
          resolve(json);
        });
        this.socket.on('auth_failed', function (data) {
          console.log("auth_failed");

          var json = JSON.stringify({ result : false, datas : data})
          resolve(json);
        });
        this.socket.on('node_error', function (data) {
          console.log("error");

          var json = JSON.stringify({ result : false, datas : data})
          resolve(json);
        });

    })
   }
   emitConnect2(json){
        return new Promise((resolve, reject) => 
        {
        this.socket.emit('sign_up_attempt',json);
        this.socket.on('registration_success', function (data) {
          console.log("registration_success");

          var json = JSON.stringify({ result : true, datas : data})
          resolve(json);
        });
        this.socket.on('registration_failed', function (data) {
          console.log("registration_failed");

          var json = JSON.stringify({ result : false, datas : data})
          resolve(json);
        });
        this.socket.on('node_error', function (data) {
          console.log("error");

          var json = JSON.stringify({ result : false, datas : data})
          resolve(json);
        });

    })
   }
   

}

module.exports = Comm;