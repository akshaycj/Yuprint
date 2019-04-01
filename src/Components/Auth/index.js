import React, { Component } from "react";
import "./index.css";
import { Icon } from "antd";

export default class extends Component {
  render() {
    return (
      <div className="auth-main">
        <div className="button">
          <Icon type="google" />
          Sign In
        </div>
      </div>
    );
  }
}
