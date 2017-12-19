import React, { Component } from "react";
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel,
  Button
} from "react-bootstrap";
import "./Signup.css";

export default class Signup extends Component {
  constructor(props) {
    super(props);

    var Comm = require('../tool/comm.js');
    this.comm=new Comm();

    this.state = {
    'email': "",
    'password': "",
    'name': "",
    'surname': "",
    'address': "",
    'cp': "",
    'city': "",
    'country': "",
    'birthday': ""
  };

    this.comm.socketConnection("6969");

  }

  validateForm() {
    return (
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword &&
      this.state.email === this.state.confirmEmail
    );
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    var json = JSON.stringify(this.state);
    alert(json);
    this.comm.emitConnect(json);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
      <FormGroup controlId="name" bsSize="large">
          <ControlLabel>Name</ControlLabel>
          <FormControl
            autoFocus
            type="text"
            value={this.state.name}
            onChange={this.handleChange}
          />
      </FormGroup>
      <FormGroup controlId="surname" bsSize="large">
          <ControlLabel>Surname</ControlLabel>
          <FormControl
            type="text"
            value={this.state.surname}
            onChange={this.handleChange}
          />
      </FormGroup>
      <FormGroup controlId="adress" bsSize="large">
          <ControlLabel>Adress</ControlLabel>
          <FormControl
            type="text"
            value={this.state.adress}
            onChange={this.handleChange}
          />
      </FormGroup>
      <FormGroup controlId="cp" bsSize="large">
          <ControlLabel>Postal Code</ControlLabel>
          <FormControl
            type="text"
            value={this.state.cp}
            onChange={this.handleChange}
          />
      </FormGroup>
      <FormGroup controlId="city" bsSize="large">
          <ControlLabel>City</ControlLabel>
          <FormControl
            type="text"
            value={this.state.city}
            onChange={this.handleChange}
          />
      </FormGroup>
      <FormGroup controlId="country" bsSize="large">
          <ControlLabel>Country</ControlLabel>
          <FormControl
            type="text"
            value={this.state.country}
            onChange={this.handleChange}
          />
      </FormGroup>
      <FormGroup controlId="birthday" bsSize="large">
          <ControlLabel>Birthday</ControlLabel>
          <FormControl
            type="date"
            value={this.state.birthday}
            onChange={this.handleChange}
          />
      </FormGroup>
      <FormGroup controlId="email" bsSize="large">
          <ControlLabel>Email</ControlLabel>
          <FormControl
            type="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
      </FormGroup>
      <FormGroup controlId="confirmEmail" bsSize="large">
          <ControlLabel>Confirm Email</ControlLabel>
          <FormControl
            type="email"
            value={this.state.confirmEmail}
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
      <FormGroup controlId="confirmPassword" bsSize="large">
          <ControlLabel>Confirm Password</ControlLabel>
          <FormControl
            onChange={this.handleChange}
            type="password"
          />
      </FormGroup>
        <Button block bsSize="large" disabled={!this.validateForm()} type="submit">
            Register
          </Button>
      </form>
    );
  }

}