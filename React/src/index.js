import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router,Switch, Route } from "react-router-dom";
import App from "./App";

import './assets/css/bootstrap.min.css';
import './assets/css/animate.min.css';
import './assets/sass/light-bootstrap-dashboard.css';
import './assets/css/demo.css';
import './assets/css/pe-icon-7-stroke.css';

//import Admin from "./containers/App/App.jsx";
import registerServiceWorker from "./registerServiceWorker";
//import "./index.css";

ReactDOM.render(
  <Router>
    <Switch>
            <Route path="/" name="Home" component={App}/>
    </Switch>
  </Router>,
  document.getElementById("root")
);
registerServiceWorker();
