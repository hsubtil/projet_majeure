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

    this.comm = props.socket;

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

    this.state_true = {
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
    event.preventDefault();
    try {

      this.state_true.email = this.state.email;
      this.state_true.password = this.state.password;
      this.state_true.name = this.state.name;
      this.state_true.surname = this.state.surname;
      this.state_true.address = this.state.address;
      this.state_true.cp = this.state.cp;
      this.state_true.city = this.state.city;
      this.state_true.country = this.state.country;
      this.state_true.birthday = this.state.birthday;

      console.log(this.state_true.email);
      var json = this.state_true;
      var jjson = await this.comm.emitConnect2(json);
      jjson = JSON.parse(jjson);
      if(jjson.result === true){
        console.log("signed");
        alert("Signed in !")
        this.props.history.push("/Login");

      }
      else{
        console.log("not signed");
        alert("Signed in Failed")
      }
    } catch (e) {
      console.log("CATCH");
      alert(e);
    }
  }

  render() {
    return (
      <div class="Signup">
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
        <FormGroup controlId="address" bsSize="large">
            <ControlLabel>Address</ControlLabel>
            <FormControl
              type="text"
              value={this.state.address}
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
          <Button block bsSize="large" disabled={!this.validateForm()} type="submit" className="yellowBtn">
              Register
            </Button>
        </form>
      </div>
    );
  }

}