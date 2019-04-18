import React, { Component } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./Components/Home";
import Auth from "./Components/Auth";
import Provider from "./Context/DataContext";
import Signup from "./Components/Signup";
import Otp from "./Components/Otp";
import SinglePage from "./Components/SinglePage";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Provider>
          <Switch>
            <Route path="/" exact component={Auth} />
            <Route path="/home" exact component={Home} />
            <Route path="/signup" exact component={Signup} />
            <Route path="/otp" exact component={Otp} />
            <Route path="/singlepage" exact component={SinglePage} />
          </Switch>
        </Provider>
      </BrowserRouter>
    );
  }
}

export default App;
