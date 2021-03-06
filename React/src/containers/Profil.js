import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./Profil.css";
import NotificationSystem from 'react-notification-system';
import {style} from "../variables/Variables.jsx";

export default class Profil extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'email': "",
      'name': "",
      'surname': "",
      'address': "",
      'cp': "",
      'city': "",
      'country': "",
      'birthday': "",
      _notificationSystem: null
    };

  this.comm = props.socket;

  }

  handleRequestProfilUpdate = async event => {
    event.preventDefault();
    if(localStorage.getItem("token") === null)
    {
      this.userHasAuthenticated(false);
      this.adminHasAuthenticated(false);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      this.props.history.push("/Login");
    }
    try{
      var json = {token: localStorage.token, email: localStorage.email, profile: this.state};
      console.log(json);
      var jjson = await this.comm.emitConnect_gen2(json, "update_user_profil");
      if(jjson.result === true){
        //alert("Modifications effectuées !")
        this.state._notificationSystem.addNotification({
                title: (<span data-notify="icon" className="pe-7s-check"></span>),
                message: (
                    <div>
                        <b>Modifications effectuées !</b>
                    </div>
                ),
                level: 'error',
                position: "tc",
                autoDismiss: 4,
            }); 
      }
      else{
        //alert("Modifications non effectuées !")
        this.state._notificationSystem.addNotification({
                title: (<span data-notify="icon" className="pe-7s-close-circle"></span>),
                message: (
                    <div>
                        <b>Modifications non effectuées ! Please try again or reload the page !</b>
                    </div>
                ),
                level: 'error',
                position: "tc",
                autoDismiss: 4,
            }); 
      }
    }catch(e){
      //alert(e);
    }
    window.location.reload();
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  componentWillMount(){
    console.log("componentDidMount");
    if(localStorage.getItem("token") === null)
      {
        this.props.history.push("/Login");
      }

      try{
        var json_t = {token: localStorage.token, email: localStorage.email};
        var self = this.state;
        this.comm.emitConnect_gen(json_t, "request_profile", function(json){

        console.log(json.result);
        if(json.result === true){
          console.log("request_profile success");
          var json_profil = json.datas;
          console.log(json_profil);
          
          self.email = json_profil.email;
          self.cp = json_profil.cp;
          self.name = json_profil.name;
          self.surname = json_profil.surname;
          self.address = json_profil.address;
          self.city = json_profil.city;
          self.country = json_profil.country;
          self.birthday = json_profil.birthday;
          
          this.setState({email: json_profil.email,
               _notificationSystem : this.refs.notificationSystem
          });

        }
        else{
          console.log("request_profile unsuccess");
        }

        }.bind(this));


      }catch(e){
        //alert(e);
      }
  }

  render() {

    const profil = (
      <div class="profil">
        
        <form onSubmit={this.handleRequestProfilUpdate}>
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
          <Button block bsSize="large" className="yellowBtn" type="submit">
              Modifier
            </Button>
        </form>
      </div>
    );
    
    console.log(this.state);


    return (
      <div className="Profil">
        <div className="lander">
          { localStorage.getItem("token") != null
            ? (
              profil
              )
            : (
              <h1> Veuillez vous connecter ! </h1>
            )}
        </div>
      </div>
    );
  }
}