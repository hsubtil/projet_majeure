import React, { Component } from "react";
import "./SelectedGroup.css";
import Calendar from "../components/Calendar";
import Chatroom from "../components/Chatroom";
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

  componentDidMount(){

    var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

    mapboxgl.accessToken = 'pk.eyJ1Ijoid2FscGl0YSIsImEiOiJjamNqMXJhcGgxdmMzMndvMGczeTE5ZTZsIn0.1-HP4CYxggzJdTZcLky71A';
   /* var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9'
    });*/

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/light-v9',
    });


  }

  render() {

    return (

      <div className="SelectedGroup">
        <div className="lander">
          <h1>Groupe {this.state.name}</h1>
          <p>Code : {this.state.code}</p>
        </div>
        <div ref={el => this.mapContainer = el} />
        <br/>
        <br/>

        <Chatroom socket={this.state.socket}/>
        <Calendar socket={this.state.socket}/>

      </div>

    )
  }
}