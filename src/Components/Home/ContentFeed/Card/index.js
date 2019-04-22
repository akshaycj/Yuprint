import React, { Component } from "react";
import "./index.css";
import { Modal, Button, Tag } from "antd";
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

  handleModal = () => {
    this.setState({ open: !this.state.open });
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
    const { visible, redirect, open } = this.state;
    return (
      <div className="card-container" onClick={this.handleModal}>
        <Modal
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
        </Modal>

        <h3>{item.title.charAt(0).toUpperCase() + item.title.slice(1)}</h3>
        <h5 style={{ color: "rgba(0, 0, 0, 0.5)" }}>Category: Notes</h5>
        <Collapse isOpened={open}>
          {/* <p>
            {item.description.slice(0, 105) +
              (item.description.length > 105 ? "..." : "")}
          </p> */}
          <div>{item.description}</div>
        </Collapse>
        <div>
          <Tag
            color="green"
            style={{ borderStyle: "dashed", background: "#fff" }}
          >
            geekblue
          </Tag>
          <Tag
            color="green"
            style={{ borderStyle: "dashed", background: "#fff" }}
          >
            geekblue
          </Tag>
          <Tag
            color="green"
            style={{ borderStyle: "dashed", background: "#fff" }}
          >
            geekblue
          </Tag>
          <Tag
            color="green"
            style={{ borderStyle: "dashed", background: "#fff" }}
          >
            geekblue
          </Tag>
        </div>
        {/* <button className="button-openfile">
          <Icon type="download" />
        </button> */}

        {redirect ? <Redirect to={`/singlepage/${item.key}`} /> : null}
      </div>
    );
  }
}
