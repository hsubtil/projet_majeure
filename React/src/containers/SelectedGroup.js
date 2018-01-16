import React, { Component } from "react";
import "./SelectedGroup.css";

export default class SelectedGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'name': localStorage.getItem("selectedgroup_name"),
      'code': localStorage.getItem("selectedgroup_code")
    }

  }

  render() {

    console.log(this.state);

    return (

      <div className="SelectedGroup">
        <div className="lander">
          <h1>Groupe {this.state.name}</h1>
        </div>
      </div>

    )
  }
}