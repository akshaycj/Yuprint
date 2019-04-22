import React, { Component } from "react";
import "./index.css";
import { Modal, Button, Tag, Icon } from "antd";
import { Redirect } from "react-router-dom";
import Collapse from "react-collapse";

export default class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      redirect: false,
      open: false
    };
  }

  handleExpand = () => {
    this.setState({ open: !this.state.open });
  };

  handleModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    setTimeout(() => {
      this.setState({ visible: false });
    }, 1);
  };

  handleOk = () => {
    this.setState({ visible: false, redirect: true });
  };

  render() {
    const { item } = this.props;
    const { redirect, open } = this.state;
    return (
      <div className="card-container">
        {/* <Modal
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Return
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleOk}>
              Open File
            </Button>
          ]}
        >
          <h1>{item.title}</h1>
          {item.description}
        </Modal> */}

        <div className="inner-body">
          <div>
            <h3>{item.title.charAt(0).toUpperCase() + item.title.slice(1)}</h3>
            <h5 style={{ color: "rgba(0, 0, 0, 0.5)" }}>Category: Notes</h5>
          </div>
          <div>
            <Button type="dashed" onClick={this.handleOk}>
              View
            </Button>
          </div>
        </div>
        <Collapse isOpened={open}>
          {/* <p>
            {item.description.slice(0, 105) +
              (item.description.length > 105 ? "..." : "")}
          </p> */}
          <div>Details : {item.description}</div>
        </Collapse>
        <div className="tag-group">
          <Tag>GeekBlue</Tag>
          <Tag>GeekBlue</Tag>
          <Tag>GeekBlue</Tag>
        </div>
        <div className="expand-button-container" onClick={this.handleExpand}>
          <Icon type="caret-down" theme="filled" />
        </div>
        {/* <button className="button-openfile">
          <Icon type="download" />
        </button> */}

        {redirect ? <Redirect to={`/singlepage/${item.key}`} /> : null}
      </div>
    );
  }
}
