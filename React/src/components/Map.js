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

    const style = ({
          position: 'absolute',
          //top: 200,
          //bottom: 200,
          width: '100%',
          height: '100%'
        });

    return (
      <div>
        <div>
          <link href='https://api.mapbox.com/mapbox-gl-js/v0.42.0/mapbox-gl.css' rel='stylesheet' />
        </div>
        <div>
          <h2> MAP </h2>
          <div style={style} ref={el => this.mapContainer = el} />
        </div>
      </div>
    )
  }
}