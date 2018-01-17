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

        <Chatroom socket={this.state.socket}/>
        <Calendar socket={this.state.socket}/>

      </div>

    )
  }
}