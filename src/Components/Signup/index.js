import React, { Component } from "react";
import { Icon, Input, Button, Tooltip } from "antd";
import { Consumer } from "../../Context/DataContext";
import "./index.css";
import { Redirect } from "react-router-dom";
import logo from "../../Res/logo.svg";

export default props => (
  <Consumer>
    {({ user, setUser }) => <Signup {...props} user={user} setUser={setUser} />}
  </Consumer>
);

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      mobile: "",
      redirect: false
    };
  }
  componentDidMount() {
    var user = this.props.user;
    if (user) {
      this.setState({
        name: this.props.user.displayName,
        email: this.props.user.email
      });
    }
  }

  onName = e => {
    this.setState({
      name: e.target.value
    });
  };

  onEmail = e => {
    this.setState({
      email: e.target.value
    });
  };

  onMobile = e => {
    this.setState({
      mobile: e.target.value
    });
  };

  onSignUp = () => {
    let user = this.props.user;
    user["mobile"] = "+91" + this.state.mobile;
    this.props.setUser(user);
    this.setState({
      redirect: true
    });
  };

  render() {
    return (
      <div className="signUpMainDiv grad-back">
        <img src={logo} alt="logo" style={{ marginBottom: 45 }} />
        {this.state.redirect ? <Redirect to="/otp" /> : null}

        <div className="subDiv">
          <Input
            className="input"
            placeholder="Name"
            value={this.state.name}
            prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
            suffix={
              <Tooltip title="Enter Your Name">
                <Icon type="info-circle" style={{ color: "rgba(0,0,0,.45)" }} />
              </Tooltip>
            }
            onChange={this.onName}
          />
          <Input
            className="input"
            placeholder="Email"
            value={this.state.email}
            prefix={<Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />}
            suffix={
              <Tooltip title="Enter Your Email">
                <Icon type="info-circle" style={{ color: "rgba(0,0,0,.45)" }} />
              </Tooltip>
            }
            onChange={this.onEmail}
          />
          <Input
            className="input"
            value={this.state.mobile}
            placeholder="Mobile Number"
            prefix={<Icon type="phone" style={{ color: "rgba(0,0,0,.25)" }} />}
            suffix={
              <Tooltip title="Enter Your Mobile Number">
                <Icon type="info-circle" style={{ color: "rgba(0,0,0,.45)" }} />
              </Tooltip>
            }
            onChange={this.onMobile}
          />
          <Button type="primary" onClick={this.onSignUp}>
            Sign Up
          </Button>
        </div>
      </div>
    );
  }
}
