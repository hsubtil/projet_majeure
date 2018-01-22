import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";
import Home from "./containers/Home";
import NF from "./components/404";
import App from "./containers/App/App.jsx"
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import MainPage from "./containers/MainPage";
import Profil from "./containers/Profil";
import SelectedGroup from "./containers/SelectedGroup";

  export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/login" exact component={Login} props={childProps} />
    <AppliedRoute path="/signup" exact component={Signup} props={childProps} />
    <AppliedRoute path="/mainpage" exact component={MainPage} props={childProps} />
    <AppliedRoute path="/profil" exact component={Profil} props={childProps} />
    <AppliedRoute path="/selectedgroup" exact component={SelectedGroup} props={childProps} />
    <AppliedRoute path="/admin" exact component={App} props={childProps} />
    <AppliedRoute path="/adminuser" exact component={App} props={childProps} />
    <AppliedRoute path="/admintable" exact component={App} props={childProps} />
    <AppliedRoute path="/adminlog" exact component={App} props={childProps} />
    <Route component={NF} />
  </Switch>;