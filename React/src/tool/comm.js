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

   emitConnect_gen(json, request, CB){
      console.log("emitConnect_gen");
      console.log(request);
      console.log(json);
      this.socket.emit(request,json);
      this.socket.on('request_profile_reply', function (data) {
        console.log("request_profile_reply");

        var json = { result : true, datas : data}
        CB(json);
      });

      this.socket.on('error', function (data) {
        console.log("error");

        var json = JSON.stringify({ result : false, datas : data})
        CB(json);
      });
    }

    emitConnect_gen2(json, request){
        console.log("emitConnect_gen2");
        return new Promise((resolve, reject) => 
        {
        console.log("emitConnect_gen2 dans le Promise");
        this.socket.emit(request,json);
        this.socket.on('error', function (data) {
          console.log("error");

          var json = { result : false, datas : data};
          resolve(json);
        });
        this.socket.on('update_user_profil_success', function(data) {
          console.log("update_user_profil_success");

          var json = { result : true, datas : data};
          resolve(json);          
        });


    })
   }
}

module.exports = Comm;