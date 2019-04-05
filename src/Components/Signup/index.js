import React, { Component } from "react";
import {   Form, Icon, Input, Button, Checkbox, } from "antd";
import { Consumer } from "../../Context/DataContext";
import "./index.css";
import {WrappedNormalLoginForm} from './Form/index.js'

export default props => (
  <Consumer>{({ user }) => <Signup {...props} user={user} />}</Consumer>
);

export class Signup extends Component {
  componentDidMount() {
    console.log("props", this.props.user);
  }
  render() {
    return (
        <WrappedNormalLoginForm user={this.props.user}/>
    );
  }
}
