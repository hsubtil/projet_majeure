import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";
import Home from "./containers/Home";
import NF from "./components/404";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import MainPage from "./containers/MainPage";

  export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/login" exact component={Login} props={childProps} />
    <AppliedRoute path="/signup" exact component={Signup} props={childProps} />
    <AppliedRoute path="/mainpage" exact component={MainPage} props={childProps} />
    <Route component={NF} />
  </Switch>;