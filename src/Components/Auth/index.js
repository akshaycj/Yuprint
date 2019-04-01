import React, { Component } from "react";
import "./index.css";
import { Icon, message, Spin } from "antd";
import { provider, auth } from "./../../Utils/config";
import { Consumer } from "../../Context/DataContext";
import { Redirect } from "react-router-dom";

export default props => (
  <Consumer>
    {({ user, setUser }) => <Auth {...props} user={user} setUser={setUser} />}
  </Consumer>
);

export class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      redirect: false
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.handleUserData(user);
      }
    });
    if (localStorage.getItem("sign") === "1") {
      this.setState({ loading: true });
    }

    auth.getRedirectResult().then(result => {
      if (result.user) {
        this.handleUserData(result.user.user);
      }
    });
  }

  handleUserData = user => {
    this.props.setUser(user);
    localStorage.setItem("sign", "0");
    this.setState({ loading: false, redirect: true });
  };

  onSignIn = () => {
    auth.signInWithRedirect(provider);
    localStorage.setItem("sign", "1");
  };

  render() {
    const { loading, redirect } = this.state;
    return (
      <div className="auth-main">
        <div className="button" onClick={this.onSignIn}>
          {loading ? (
            <Spin />
          ) : (
            <div>
              <Icon type="google" />
              Sign In
            </div>
          )}
        </div>
        {redirect ? <Redirect to="/home" /> : null}
      </div>
    );
  }
}
