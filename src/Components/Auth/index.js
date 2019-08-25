import React, { Component } from "react";
import "./index.css";
import { Icon, Spin } from "antd";
import { provider, auth, db } from "./../../Utils/config";
import { Consumer } from "../../Context/DataContext";
import { Redirect } from "react-router-dom";
import logo from "../../Res/logo_dark.svg";
import wave from "../../Res/wave.svg";

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
        console.log("normal login");

        this.handleUserData(user);
      }
    });
    if (window.sessionStorage.getItem("pending")) {
      window.sessionStorage.removeItem("pending");
      this.setState({ loading: true });
      auth.getRedirectResult().then(result => {
        if (result.user) {
          //this.handleUserData(result.user); //rafi edited
          this.handleUserData(result.user);
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
        if (data.val()) {
          path = "/home";
        }
        this.setState({ path, redirect: true });
      });
  };

  handleUserData = user => {
    this.setState({ loading: false });
    console.log("user data", user);

    if (user.email) {
      //rafi edited
      // if (user.email !== null) {
      this.props.setUser(user);
      //localStorage.setItem("sign", "0");

      this.userExist(user.uid);
    }
  };

  onSignIn = () => {
    auth.signInWithRedirect(provider).catch(() => {
      window.sessionStorage.removeItem("pending");
    });
    //localStorage.setItem("sign", "1");
    window.sessionStorage.setItem("pending", 1);
  };

  render() {
    var { loading, redirect, path } = this.state;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: `url(${wave})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center bottom",
          width: "100%"
        }}
      >
        <div className="auth-main">
          <div
            style={{
              alignSelf: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <img
              src={logo}
              alt="logo"
              style={{ width: 200, alignSelf: "center" }}
            />
            <h3 style={{ color: "rgba(0, 0, 0, 0.65)", marginTop: 5 }}>
              You Print - We Deliver
            </h3>
          </div>
          {redirect ? <Redirect to={path} /> : null}
          <div className="button-container">
            <div
              className={loading ? "button" : "button grad-back"}
              onClick={this.onSignIn}
            >
              {loading ? (
                <Spin style={{ marginTop: 5 }} />
              ) : (
                <div>
                  <Icon type="google" />
                </div>
              )}
            </div>
            <div className="signin-text">Sign in with Google to continue</div>
          </div>
        </div>
        {/* <div style={{ background: `url(${wave})` }} /> */}
      </div>
    );
  }
}
