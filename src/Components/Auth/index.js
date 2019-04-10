import React, { Component } from "react";
import "./index.css";
import { Icon, Spin } from "antd";
import { provider, auth, db } from "./../../Utils/config";
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
      redirect: false,
      path: "/signup"
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
      auth.getRedirectResult().then(result => {
        if (result.user) {
          this.handleUserData(result.user.user);
        }
      });
    }
  }
  userExist = id => {
    console.log("id", id);

    db.ref("users")
      .child(id)
      .once("value", data => {
        console.log("data", data);
        var path = "/signup";
        if (data) {
          path = "/home";
        }
        this.setState({ path, redirect: true });
      });
  };

  handleUserData = user => {
    this.setState({ loading: false });

    if (user.email ) {    //rafi edited
      // if (user.email !== null) {
      this.props.setUser(user);
      localStorage.setItem("sign", "0");

      this.userExist(user.uid);
    }
  };

  onSignIn = () => {
    auth.signInWithRedirect(provider);
    localStorage.setItem("sign", "1");
  };

  render() {
    var { loading, redirect, path } = this.state;
    return (
      <div className="auth-main">
        {redirect ? <Redirect to={path} /> : null}
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
      </div>
    );
  }
}
