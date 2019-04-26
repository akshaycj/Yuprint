import React, { Component } from "react";
import "./index.css";
import { Button, Tag, Icon, Badge } from "antd";
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
    const tags = item.tags
      ? item.tags.slice(0, 4).map((tag, i) => <Tag key={i}>{tag}</Tag>)
      : null;
    return (
      <div className="card-container">
        <div className="inner-body">
          <div>
            <h3>{item.title.charAt(0).toUpperCase() + item.title.slice(1)}</h3>
            <div style={{ display: "flex" }}>
              <h5 style={{ color: "rgba(0, 0, 0, 0.5)" }}>Category: Notes</h5>
              {item.verified ? (
                <Badge
                  count={"Verified"}
                  style={{ marginLeft: 5, backgroundColor: "#52c41a" }}
                />
              ) : null}
            </div>
          </div>
          <div>
            <Button type="dashed" onClick={this.handleOk}>
              View
            </Button>
          </div>
        </div>
        <Collapse isOpened={open}>
          <div>Details : {item.description}</div>
        </Collapse>
        <div className="tag-group">{tags}</div>
        <div className="expand-button-container" onClick={this.handleExpand}>
          <Icon type="caret-down" theme="filled" />
        </div>
        {redirect ? <Redirect to={`/singlepage/${item.key}`} /> : null}
      </div>
    );
  }
}
