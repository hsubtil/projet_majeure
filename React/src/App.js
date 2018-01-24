import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem, MenuItem, Dropdown, ButtonToolbar, Glyphicon } from "react-bootstrap";
import Routes from "./Routes";
import RouteNavItem from "./components/RouteNavItem";

import "./App.css";

class App extends Component {

constructor(props) {
  super(props);

  this.state = {
    isAuthenticated: false,
    adminIsAuthenticated: false
  };

  if(localStorage.getItem("token") != null && localStorage.getItem("user_role") === "USER"){
    this.state.isAuthenticated = true;
  }

  if(localStorage.getItem("token") != null && localStorage.getItem("user_role") === "ADMIN"){
    this.state.adminIsAuthenticated = true;
  }

  var Comm = require('./tool/comm.js');
  this.comm=new Comm();
  this.comm.socketConnection("6969");

}

userHasAuthenticated = authenticated => {
  this.setState({ isAuthenticated: authenticated });
}


adminHasAuthenticated = authenticated => {
  this.setState({ adminIsAuthenticated: authenticated });
}

handleLogout = event => {
  this.userHasAuthenticated(false);
  this.adminHasAuthenticated(false);
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("selectedgroup_code");
  localStorage.removeItem("selectedgroup_name");
  localStorage.removeItem("user_role");

  this.props.history.push("/Login");
}

  render() {

    const buttonInstance = (
      <ButtonToolbar>
      <Dropdown id="Dropdown">
        <Dropdown.Toggle
          className="toggle"
          bsSize="large"
          title="menu"
          Menu
          id="dropdown_toggle"
        >
          <Glyphicon bsRole="toggle" glyph="align-justify" />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <RouteNavItem href="/MainPage">Home</RouteNavItem>
          <RouteNavItem href="/Profil">Profil</RouteNavItem>
          <MenuItem divider />
          <RouteNavItem href="/About">About</RouteNavItem>
        </Dropdown.Menu>
        </Dropdown>
      </ButtonToolbar>
    );

    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      adminHasAuthenticated: this.adminHasAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
      adminIsAuthenticated: this.state.adminIsAuthenticated,
      socket: this.comm
    };
//  className="App container"
    return (
      <div>
         <div className="App container">
            <Navbar fluid collapseOnSelect className="navbarcustom yellowBtnSpe">
              <Navbar.Header>
                {this.state.isAuthenticated
                ?
                  buttonInstance
                :
                <Navbar.Brand>
                  <Link to="/">KeepCo</Link>
                </Navbar.Brand>
                }
                <Navbar.Toggle />
              </Navbar.Header>
              <Navbar.Collapse>
              <div className="custombutton yellowA">
                <Nav pullRight>
                {this.state.isAuthenticated || this.state.adminIsAuthenticated
                  ? 
                    <NavItem onClick={this.handleLogout}>Logout</NavItem>
                    : [
                      <RouteNavItem key={1} href="/signup">
                        Signup
                      </RouteNavItem>,
                      <RouteNavItem key={2} href="/login">
                        Login
                      </RouteNavItem>
                    ]}
                </Nav>
              </div>
            </Navbar.Collapse>
            </Navbar>
          </div>
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);
