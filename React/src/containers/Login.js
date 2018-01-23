import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./Login.css";

var io = require('socket.io-client');

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      lat:"",
      lon:""
    };

  this.comm = props.socket;
    
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }




  handleSubmit = async event => {
    event.preventDefault();
    try {

      var coord = {coord:{lat:this.state.lat, lon:this.state.lon}};
      var json = {email: this.state.email, password: this.state.password, profile:coord};
      var jjson = await this.comm.emitConnect(json);
      jjson = JSON.parse(jjson);
      console.log(jjson);
      if(jjson.result === true){

        if(jjson.datas.role === "ADMIN"){

        console.log("Admin authentificated");
        this.props.adminHasAuthenticated(true);


        localStorage.setItem("user",jjson.datas.name);
        localStorage.setItem("token", jjson.datas.token);
        localStorage.setItem("email", json.email);

        this.props.history.push("/admin");


        }
        else if (jjson.datas.role === "USER"){

        console.log("User authentificated");
        this.props.userHasAuthenticated(true);



        localStorage.setItem("user",jjson.datas.name);
        localStorage.setItem("token", jjson.datas.token);
        localStorage.setItem("email", json.email);


        alert("authentificated !");
        this.props.history.push("/MainPage");


        }
      }
      else{
        console.log("not authentificated");
        alert("Not authentificated !");
      }
    } catch (e) {
      console.log("CATCH");
      alert(e);
    }
  }

  componentWillMount(){

      if(navigator.geolocation){
         navigator.geolocation.getCurrentPosition(function(position){
            this.state.lat = position.coords.latitude;
            this.state.lon = position.coords.longitude;
         }.bind(this));
      }

  }

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>

          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            className="yellowBtn"
          >
            Login
          </Button>
        </form>
      </div>
    );
  }
}