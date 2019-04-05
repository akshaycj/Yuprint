import React, { Component } from "react";
import {   Form, Icon, Input, Button, Checkbox, } from "antd";
import './index.css'


class OTPConfirmForm extends Component {
  componentDidMount() {
    console.log("props in OTPConfirm", this.props.user);
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="container">
        <h2>OTP Confirmation</h2>
        <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('mobile', {
            rules: [{ required: true, message: 'Please input your mobile number!' }],
          })(
            <Input prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />}  placeholder="mobile" />
          )}
        </Form.Item>
        <Form.Item
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 8 },
          }}
        >
          <Button type="primary" htmlType="submit">Next</Button>
        </Form.Item>
        {/* {this.state.redirect ? <Redirect to="/signup" /> : null} */}
      </Form>
      </div>
    );
  }
}


export const OTPConfirm = Form.create({ name: 'normal_login' })(OTPConfirmForm);
