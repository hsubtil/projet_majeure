import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NF from "./components/404";
import Login from "./containers/Login";
import Signup from "./containers/Signup";

export default () =>
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/login" exact component={Login} />
    <Route path="/signup" exact component={Signup} />
    <Route component={NF} />
  </Switch>;