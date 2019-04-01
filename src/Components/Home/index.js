import React, { Component } from "react";
import { Icon } from "antd";
import { Consumer } from "../../Context/DataContext";

export default props => (
  <Consumer>{({ user }) => <Home {...props} user={user} />}</Consumer>
);

export class Home extends Component {
  componentDidMount() {
    console.log("props", this.props.user);
  }
  render() {
    return (
      <div>
        Cj's Starter pack is ready!
        <Icon type="smile" />
      </div>
    );
  }
}
