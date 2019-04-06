import React, { Component } from "react";

const Context = React.createContext(null);

export default class Provider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: []
    };
  }

  setUser = user => {
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
