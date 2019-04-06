import React, { Component } from "react";
import { Upload, Icon } from "antd";
import { Consumer } from "../../Context/DataContext";
import "./index.css";

export default props => (
  <Consumer>{({ user }) => <Home {...props} user={user} />}</Consumer>
);

export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: []
    };
  }
  componentDidMount() {
    console.log("props", this.props.user);
  }
  render() {
    const { fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="home-main">
        <Upload fileList={fileList} listType="picture-card">
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
      </div>
    );
  }
}
