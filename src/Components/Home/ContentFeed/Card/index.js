import React, { Component } from "react";
import "./index.css";
import { Modal, Button, Icon } from "antd";
import { Redirect } from "react-router-dom";

export default class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      redirect: false
    };
  }

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
    const { visible, redirect } = this.state;
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

        <h3>{item.title}</h3>
        <p>
          {item.description.slice(0, 105) +
            (item.description.length > 105 ? "..." : "")}
        </p>

        {/* <button className="button-openfile">
          <Icon type="download" />
        </button> */}

        {redirect ? <Redirect to={`/singlepage/${item.key}`} /> : null}
      </div>
    );
  }
}
