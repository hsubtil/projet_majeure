import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./MainPage.css";
import { Route, Redirect, withRouter } from "react-router";
import Routes from "../Routes";
import AppliedRoute from "../components/AppliedRoute";
import SelectedGroup from "./SelectedGroup";

class MainPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      'families': [],
      'new_name_family':"",
      'join_code':""
    };

  this.comm = props.socket;

  }

  newFamily = async event => {
    event.preventDefault();
    if(localStorage.getItem("token") === null)
    {
      this.props.history.push("/Login");
    }
    try{
      var json = {token: localStorage.token, email: localStorage.email, family: this.state.new_name_family};
      console.log(json);
      var jjson = await this.comm.emitConnect_gen2(json, "new_family");
      if(jjson.result === true){
        alert("Groupe créé !")
      }
      else{
        alert("Groupe non créé !")
      }
    }catch(e){
      alert(e);
    }
    window.location.reload();
  }

  joinFamily = async event => {
    event.preventDefault();
    if(localStorage.getItem("token") === null)
    {
      this.props.history.push("/Login");
    }
    try{
      var json = {token: localStorage.token, email: localStorage.email, code: this.state.join_code};
      console.log(json);
      var jjson = await this.comm.emitConnect_gen2(json, "add_family_to_user");
      if(jjson.result === true){
        alert("Groupe ajouté !")
      }
      else{
        alert("Groupe non ajouté !")
      }
    }catch(e){
      alert(e);
    }
    window.location.reload();
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }


  componentWillMount(){
    if(localStorage.getItem("token") === null)
      {
        this.props.history.push("/Login");
      }

      try{
        var json_t = {token: localStorage.token, email: localStorage.email};
        var self = this.state;
        this.comm.emitConnect_gen(json_t, "request_family", function(json){
        console.log(json.result);
        if(json.result === true){
          console.log("request_family success");
          var json_group = json.datas;
          
          self.families = json_group;
          this.setState({families: json_group});
          
        }
        else{
          console.log("request_family unsuccess");
        }

        }.bind(this));


      }catch(e){
        alert(e);
      }
  }



  render() {

    var test = this.state.families.families;
    var json_families_content = [];

    if (this.state.families.families){
      for (var i = 0; i < this.state.families.families.length; i++) {
        var arraybis = [this.state.families.families[i].name, this.state.families.families[i].code];
        json_families_content.push(arraybis);
      }
    }

    var contentsList = json_families_content.map(function(content){
        return (
          <Famille family_name={content[0]} family_code={content[1]} />
          )
    });

    return (
      <div className="MainPage">
        <div className="lander">
          <h1>Groupes</h1>
          <p>Tout vos groupes à porté de main ! </p>
          <br />
          <ul>{ contentsList }</ul>
          <br />
          <form onSubmit={this.newFamily}>
          <FormGroup controlId="new_name_family" bsSize="large">
              <ControlLabel>Nom nouveau groupe </ControlLabel>
              <FormControl
                autoFocus
                type="text"
                onChange={this.handleChange}
              />
          </FormGroup>

          <Button
            bsSize="large"
            type="submit">
            Créer un groupe
          </Button>
          </form>
          <br />
          <form onSubmit={this.joinFamily}>   
          <FormGroup controlId="join_code" bsSize="large">
              <ControlLabel>Code groupe </ControlLabel>
              <FormControl
                autoFocus
                type="text"
                onChange={this.handleChange}
              />
          </FormGroup>

          <Button
            bsSize="large"
            type="submit">
            Rejoindre un groupe
          </Button>


          </form>

        </div>
      </div>
    );
  }
}

class Famille extends Component {

  constructor(props){
    super(props);

    this.state = {
      'family_name': props.family_name,
      'family_code': props.family_code
    };
  }

  selectFamily = event => {
    console.log(this.state);
    localStorage.setItem("selectedgroup_name", this.state.family_name);
    localStorage.setItem("selectedgroup_code", this.state.family_code);
    window.location.href = "http://localhost:3000" + "/selectedgroup";
  }

  render(){
    return (
        <form>
          <Button
            block
            bsSize="large"
            onClick={this.selectFamily}>
            {this.state.family_name}
          </Button>
          <ControlLabel>Code : {this.state.family_code}</ControlLabel>
          <br />
          <br />

        </form>
      );
  }

}

export default withRouter(MainPage);