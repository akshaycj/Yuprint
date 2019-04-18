import React, { Component } from "react";
import { Consumer } from "../../Context/DataContext";
import "./index.css";
import { Spin, Input, Button } from "antd";
import { auth, fire, db } from "../../Utils/config";
import { Redirect } from "react-router-dom";

export default props => (
  <Consumer>
    {({ user, setUser }) => <Otp {...props} user={user} setUser={setUser} />}
  </Consumer>
);

class Otp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: "+917012232634",
      code: "",
      redirect: false,
      spin: false
    };
  }
  componentDidMount() {
    this.setState({ mobile: this.props.user.mobile });
    this.onCreate();
  }

  onCreate = () => {
    var self = this;

    window.recaptchaVerifier = new fire.auth.RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: function(response) {
          console.log("ivide2");
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          self.sendOTP();
        }
      }
    );

    this.sendOTP();
  };

  onSubmit = () => {
    var code = this.state.code;
    if (code !== "") {
      this.setState({ spin: true });
      window.confirmationResult
        .confirm(code)
        .then(
          function(result) {
            // User signed in successfully.
            var user = result.user;
            console.log("user.uid", user.uid);
            this.setState({ spin: false });
            this.saveUser();
            // ...
          }.bind(this)
        )
        .catch(function(error) {
          // User couldn't sign in (bad verification code?)
          // ...
        });
    }
  };

  saveUser = () => {
    const { email, mobile, displayName, uid } = this.props.user;
    localStorage.setItem("mob", mobile);
    db.ref("users")
      .child(uid)
      .set({
        email,
        mobile,
        displayName
      });
    this.setState({ redirect: true });
  };

  sendOTP = () => {
    var phoneNumber = this.state.mobile;
    var appVerifier = window.recaptchaVerifier;
    auth
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then(function(confirmationResult) {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
      })
      .catch(function(error) {
        // Error; SMS not sent
        console.log("errr", error);

        // ...
      });
  };
  render() {
    const { spin, redirect } = this.state;
    return (
      <div className="otpMainDiv grad-back">
        <h1>Enter OTP</h1>
        <div id="recaptcha-container" />
        <Input
          style={{ width: "90vw", height: "6.5vh" }}
          placeholder="Enter Otp"
          onChange={e => {
            this.setState({ code: e.target.value });
          }}
        />
        <Button type="primary" onClick={this.onSubmit}>
          {spin ? <Spin /> : "Enter Otp"}
        </Button>
        {redirect ? <Redirect to="/home" /> : null}
      </div>
    );
  }
}
