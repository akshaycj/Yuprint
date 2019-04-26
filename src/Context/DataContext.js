import React, { Component } from "react";
import { auth } from "../Utils/config";
const Context = React.createContext(null);

export default class Provider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        uid: localStorage.getItem("uid"),
        mobile: localStorage.getItem("mobile")
      }
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        //console.log("user", user);

        this.setState({ user });
      }
    });
  }

  setUser = user => {
    localStorage.setItem("uid", user.uid);
    this.setState({ user });
  };
  render() {
    const { user } = this.state;
    return (
      <Context.Provider
        value={{
          user,
          setUser: this.setUser
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

export const Consumer = Context.Consumer;
