import React, { Component } from "react";
import "./index.css";
import { Icon, message } from "antd";
import { provider, auth } from "./../../Utils/config";

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    auth.getRedirectResult().then(result => {
      console.log("result", result);

      if (result.user) {
        message.success("Yayyy");
      }
    });
  }

  onSignIn = () => {
    auth.signInWithRedirect(provider);
  };

  render() {
    return (
      <div className="auth-main">
        <div className="button" onClick={this.onSignIn}>
          <Icon type="google" />
          Sign In
        </div>
      </div>
    );
  }
}
