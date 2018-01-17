import React, { Component } from "react";
import "./SelectedGroup.css";
import Calendar from "../components/Calendar";
import Chatroom from "../components/Chatroom";
import Map from "../components/Map";
<link href='https://api.mapbox.com/mapbox-gl-js/v0.42.0/mapbox-gl.css' rel='stylesheet' />

export default class SelectedGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'name': localStorage.getItem("selectedgroup_name"),
      'code': localStorage.getItem("selectedgroup_code"),
      'socket': props.socket
    }
  }

  componentWillMount(){
      try{
        var json_t = {token: localStorage.token, code: this.state.code};
        var self = this.state;
        this.state.socket.emitConnect_gen(json_t, "select_family", function(json){
        console.log(json.result);
        if(json.result === true){
          console.log("select_family success");
          var json_group = json.datas;
                  
        }
        else{
          console.log("select_family unsuccess");
        }

        }.bind(this));


      }catch(e){
        alert(e);
      }
  }


  render() {

    return (

      <div className="SelectedGroup">
        <div className="lander">
          <h1>Groupe {this.state.name}</h1>
          <p>Code : {this.state.code}</p>
        </div>
        <Map />
        <br/>
        <br/>

        <Chatroom socket={this.state.socket} code={this.state.code}/>
        <Calendar socket={this.state.socket} code={this.state.code}/>

      </div>

    )
  }
}