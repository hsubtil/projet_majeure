import React, { Component } from "react";

export default class Map extends Component {
  constructor(props) {
    super(props);

  }

  componentDidMount(){

    var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

    mapboxgl.accessToken = 'pk.eyJ1Ijoid2FscGl0YSIsImEiOiJjamNqMXJhcGgxdmMzMndvMGczeTE5ZTZsIn0.1-HP4CYxggzJdTZcLky71A';

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/light-v9',
    });


  }

  render() {

    return (

      <div>
        <link href='https://api.mapbox.com/mapbox-gl-js/v0.42.0/mapbox-gl.css' rel='stylesheet' />
        <h2> MAP </h2>
        <div ref={el => this.mapContainer = el} />
      </div>
    )
  }
}