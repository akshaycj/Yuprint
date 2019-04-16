import React, { Component } from "react";
import { Progress } from "antd";

export default class extends Component {
  render() {
    const { progress, completed, pending } = this.props;
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Progress
          type="line"
          strokeColor={{
            to: "#5000e1",
            from: "#2deee8"
          }}
          percent={progress}
          style={{ width: "90%" }}
        />
        <span>
          Files Uploaded: {completed}/{pending}
        </span>
      </div>
    );
  }
}
