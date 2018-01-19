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
      'socket': props.socket,
      'meteo':[]
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
        }
        else{
          console.log("select_family unsuccess");
        }

        }.bind(this));


      }catch(e){
        alert(e);
      }

      try{
        var json_t = {token: localStorage.token, code: this.state.code};
        var self = this.state;
        this.state.socket.emitConnect_gen(json_t, "request_family_meteo", function(json){
        console.log(json.result);
        if(json.result === true){
          console.log("request_family_meteo success");
          var json_group = json.datas;

          this.setState({meteo: json_group});

        }
        else{
          console.log("request_family_meteo unsuccess");
        }

        }.bind(this));


      }catch(e){
        alert(e);
      }

  }


  render() {


          var keys = [];
          var json_meteo_content = [];
          for(var k in this.state.meteo) keys.push(k);

          for (var i = 0; i < keys.length; i++) {
            var arraybis = [keys[i], this.state.meteo[keys[i]].main, this.state.meteo[keys[i]].icon];
            json_meteo_content.push(arraybis);
          }


    var contentsList = json_meteo_content.map(function(content){
        return (
          <Meteo meteo_name={content[0]} meteo_main={content[1]} meteo_icon={content[2]} />
          )
    });

    return (

      <div className="SelectedGroup">
        <div className="lander">
          <h1>Groupe {this.state.name}</h1>
          <p>Code : {this.state.code}</p>
        </div>
        <div class="container">
          <div class="col-lg-12">
            <div class="col-lg-4">
              <Chatroom socket={this.state.socket}/>
            </div>
            <div class="col-lg-8">
              <div class="row">
                <div class="col-lg-8">
                  <Calendar socket={this.state.socket}/>
                </div>  
              </div>   
              <div class="row">
                <div class="col-lg-8">
                  { contentsList }
                </div>
              </div>
              <div class="row">
                <div class="col-lg-8">
                  <Map />
                </div>
              </div>  
            </div>
          </div>  
        </div>  
      </div>
 
    )
  }
}

class Meteo extends Component {

  constructor(props){
    super(props);

    this.state = {
      'meteo_name': props.meteo_name,
      'meteo_main': props.meteo_main,
      'meteo_icon': props.meteo_icon
    };
  }

  render(){

    return(

      <div className="SelectedGroup">
        <div className="lander">
          <h1> METEO </h1>
          <p>Nom : {this.state.meteo_name}</p>
          <p>Meteo : {this.state.meteo_main}</p>
          <img src={this.state.meteo_icon} alt="meteo"></img>
        </div>
      </div>

    )
  }
}