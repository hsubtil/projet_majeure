import React, { Component } from "react";

export default class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'fam_pos': ""
    };

  }

  componentDidMount(){

      if(localStorage.getItem("token") === null)
      {
        this.props.history.push("/Login");
      }

      try{
        var json_t = {token: localStorage.token, code: localStorage.selectedgroup_code};
        var self = this.state;
        this.comm.emitConnect_gen(json_t, "family_position", function(json){
        console.log(json.result);
        if(json.result === true){
          console.log("family_position_reply");
          var json_group = json.datas;
          
          self.families = json_group;
          this.setState({fam_pos: json_group});
          
        }
        else{
          console.log("family_position_err");
        }

        }.bind(this));


      }catch(e){
        alert(e);
      }

    var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

    mapboxgl.accessToken = 'pk.eyJ1Ijoid2FscGl0YSIsImEiOiJjamNqMXJhcGgxdmMzMndvMGczeTE5ZTZsIn0.1-HP4CYxggzJdTZcLky71A';

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/light-v9',
    });

    var geojson = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-77.032, 38.913]
        },
        properties: {
          title: 'Mapbox',
          description: 'Washington, D.C.'
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-122.414, 37.776]
        },
        properties: {
          title: 'Mapbox',
          description: 'San Francisco, California'
        }
      }]
    };

        // add markers to map
    geojson.features.forEach(function(marker) {

      // make a marker for each feature and add to the map
      new mapboxgl.Marker().setLngLat(marker.geometry.coordinates).addTo(map);
    });

  }

  render() {

    const style = ({
          position: 'absolute',
          //top: 200,
          //bottom: 200,
          width: '150%',
          height: '150%'
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

