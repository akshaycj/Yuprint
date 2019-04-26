import React, { Component } from "react";
import { Consumer } from "../../Context/DataContext";
import "./index.css";
import { db } from "../../Utils/config";

export default props => (
  <Consumer>
    {({ user, setUser }) => (
      <UserOrder {...props} user={user} setUser={setUser} />
    )}
  </Consumer>
);

class UserOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.user.uid || "test user id"
    };
  }
  componentDidMount() {
    const { id } = this.state;
    db.ref("userOrder")
      .child(id)
      .on("value", snapshot => {
        let orderData = [];
        snapshot.forEach(item => {
          // var data = {
          //   key: item.key,
          //   address1: item.val().address1,
          //   address2: item.val().address2,
          //   asap: item.val().asap,
          //   description: item.val().description,
          //   geoPosition: item.val().geoPosition,
          //   mobile: item.val().mobile,
          //   scheduleDate: item.val().scheduleDate,
          //   scheduleTime: item.val().scheduleTime,
          //   status: item.val().status,
          //   timestamp: item.val().timestamp,
          //   urls: item.val().urls,
          //   user: item.val().user
          // };
          var data = item.val();
          data["key"] = item.key;
          orderData.push(data);
        });
        this.setState({ orderData });
        console.log(orderData);
      });
  }

  render() {
    return (
      <div className="">
        <h1>asadsad</h1>
      </div>
    );
  }
}
