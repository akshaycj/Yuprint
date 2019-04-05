import React, { Component } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./Components/Home";
import Auth from "./Components/Auth";
import Consumer from "./Context/DataContext";
import Signup from "./Components/Signup";
import {OTPConfirm} from './Components/Signup/OTPConfirm/index.js';

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <BrowserRouter>
        <Consumer>
          <Switch>
            <Route path="/" exact component={Auth} />
            <Route path="/home" exact component={Home} />
            <Route path="/signup" exact component={Signup} />
            <Route path="/otpconfirm" exact component={OTPConfirm} />
          </Switch>
        </Consumer>
      </BrowserRouter>
    );
  }
}

export default App;
