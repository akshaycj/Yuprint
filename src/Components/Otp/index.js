import React, { Component } from "react";
import { Consumer } from "../../Context/DataContext";
import "./index.css";
import { Icon, Input, Button } from "antd";
export default (props) => (<Consumer>{({ user, setUser }) => <Otp {...props} user={user} setUser={setUser} />}</Consumer>)

class Otp extends Component {
    render() {
        return (
            <div className="otpMainDiv">
                <h1>Enter Otp</h1>
                <Input style={{ width: "90vw" }} placeholder="Enter Otp" />
                <Button type="primary" onClick={this.onOtp}>Enter Otp</Button>
            </div>
        )
    }
}