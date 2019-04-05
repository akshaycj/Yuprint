import React, { Component } from "react";
import {   Form, Icon, Input, Button, Checkbox, } from "antd";
import { Redirect } from "react-router-dom";

class NormalLoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state={redirect:false}
  }

  componentDidMount(){
    console.log(this.props.user);
  }
  handleSubmit = (e) => {
    console.log(e);
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        // this.setState({redirect:true})
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
          )}
        </Form.Item>
        <Form.Item>
          {(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} value={this.props.user.email} type="email" placeholder="email" />
          )}
        </Form.Item>
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
    );
  }
}

export const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);
