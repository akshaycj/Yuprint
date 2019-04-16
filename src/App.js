import React, { Component } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./Components/Home";
import Auth from "./Components/Auth";
import Consumer from "./Context/DataContext";
import Signup from "./Components/Signup";
import Otp from "./Components/Otp";
import SinglePage from "./Components/SinglePage";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Consumer>
          <Switch>
            <Route path="/" exact component={Auth} />
            <Route path="/home" exact component={Home} />
            <Route path="/signup" exact component={Signup} />
            <Route path="/otp" exact component={Otp} />
            <Route path="/singlepage" exact component={SinglePage} />
          </Switch>
        </Consumer>
      </BrowserRouter>
    );
  }
}

export default App;
