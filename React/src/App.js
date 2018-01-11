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
    isAuthenticated: false
  };

  if(localStorage.getItem("token") != null){
    this.state.isAuthenticated = true;
  }

}

userHasAuthenticated = authenticated => {
  this.setState({ isAuthenticated: authenticated });
}

handleLogout = event => {
  this.userHasAuthenticated(false);
  localStorage.removeItem("token");
  localStorage.removeItem("email");
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
      userHasAuthenticated: this.userHasAuthenticated
    };

    return (
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            {this.state.isAuthenticated
            ?
              buttonInstance
            :
            <Navbar.Brand>
              <Link to="/">Projet Majeur</Link>
            </Navbar.Brand>
            }
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
          <Nav pullRight>
            {this.state.isAuthenticated
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
        </Navbar.Collapse>
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);
