import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./Login.css";


export default class Login extends Component {
  constructor(props) {
    super(props);

    var Comm = require('../tool/comm.js');
    this.comm=new Comm();

    this.state = {
      email: "",
      password: ""
    };

    this.comm.socketConnection("6969");
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  /*handleSubmit = event => {
    //var json = { 'email':"test", 'password':"test"};
    var json = JSON.stringify(this.state);
    alert(json);
    this.comm.emitConnect(json);
  }*/

  handleSubmit = async event => {
    event.preventDefault();
    try {
      var json = this.state;
      this.comm.emitConnect(json,function(bool){
        console.log(bool);
        if(bool === true){
          this.props.userHasAuthenticated(true);
        }
      });
    } catch (e) {
      alert(e);
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
          >
            Login
          </Button>
        </form>
      </div>
    );
  }
}