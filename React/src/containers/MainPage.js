import React, { Component } from "react";
import "./MainPage.css";
import Chatroom from '../components/Chatroom.js';
import Calendar from '../components/Calendar.js';
import "../../node_modules/react-big-calendar/lib/css/react-big-calendar.css";

export default class Home extends Component {
  render() {
    return (
      <div className="MainPage">
        <div className="lander">
          <h1>MAIN PAGE</h1>
          <p>Tout ce qu'il vous faut ici ! </p>
        </div>
        <Chatroom />
        <Calendar />
      </div>
    );
  }
}