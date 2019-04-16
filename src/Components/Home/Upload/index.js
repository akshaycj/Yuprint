import React, { Component } from "react";
import { Upload, Icon, Input, Button, message, Select, List, Spin } from "antd";
import { Consumer } from "../../../Context/DataContext";
import { storage, db } from "./../../../Utils/config";
import "./index.css";
import UploadButton from "./../UploadButton/index";

export default props => (
  <Consumer>{({ user }) => <UploadHome {...props} user={user} />}</Consumer>
);

class UploadHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      description: "",
      loading: false,
      urls: [],
      pending: 0,
      completed: 0,
      progress: 0,
      id: this.props.user.uid || "test user id"
    };
  }
  componentDidMount() {
    console.log("props", this.props.user);
  }

  handleUpload = () => {
    var { id, fileList, completed } = this.state;
    this.setState({ loading: true, pending: fileList.length });

    var that = this;
    let storeFileStorage = fileList.map((item, index) => {
      let uploadFile = storage
        .ref("files")
        .child("users")
        .child(id)
        .child(item.name)
        .put(item);

      uploadFile.on(
        "state_changed",
        function(snapshot) {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          that.setState({ progress });
        },
        function(error) {
          console.error("Something nasty happened", error);
        },
        () => {
          //--> Valanj mook pididkal Detected!!

          // let location = uploadFile.snapshot.ref.location.bucket;
          // var path = uploadFile.snapshot.ref.location.path;
          // let downloadURL = location + "/" + path;
          // let urls = this.state.urls;
          // urls[index] = {
          //   urls: downloadURL,
          //   type: item.paperSize
          // };
          // this.setState({ urls });

          uploadFile.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            let urls = that.state.urls;
            urls[index] = {
              urls: downloadURL,
              type: item.paperSize
            };
            completed = completed + 1;
            that.setState({ urls, completed });
          });
        }
      );
      return uploadFile;
    });
    Promise.all(storeFileStorage).then(() => {
      var { description, id, urls } = this.state;
      db.ref("store")
        .child("orders")
        .child("active")
        .push(
          {
            description: description,
            user: id || "test user",
            mobile: this.props.user.phoneNumber || "test mobileNo",
            timestamp: new Date().toISOString(),
            urls: urls,
            status: "active"
          },
          err => {
            if (err) {
              message.error("upload failed.");
            } else {
              message.success("upload successful");
            }
            this.setState({ loading: false, fileList: [], description: "" });
          }
        );
    });
  };
  handleDelete = index => {
    let fileList = this.state.fileList;
    fileList.splice(index, 1);
    this.setState({ fileList });
  };
  handleSizeChange = (value, item) => {
    item.paperSize = value;
  };
  beforeUpload = file => {
    console.log(file.type);
    let allowedExtensions = ["pdf", "doc", "docx", "xls", "xlsx"];
    let allowedMIMEType = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ];
    if (allowedMIMEType.indexOf(file.type) === -1) {
      message.error(
        `You can only upload  ${allowedExtensions.join(", ")}  file!`
      );
      return false;
    }
    file.paperSize = "A4";
    this.setState(state => ({
      fileList: [...state.fileList, file]
    }));
    return false;
  };
  handleDescriptionChange = e => {
    this.setState({ description: e.target.value });
  };
  render() {
    const { fileList, isFile, loading } = this.state;
    const Option = Select.Option;
    const { TextArea } = Input;
    return (
      <div className="home-main">
        <Upload
          showUploadList={false}
          multiple={true}
          beforeUpload={this.beforeUpload}
        >
          <UploadButton />
        </Upload>
        <div className="list-container">
          <List
            className="list"
            itemLayout="horizontal"
            dataSource={fileList}
            renderItem={(item, index) => (
              <List.Item className="list-item">
                <h4 style={{ flex: 2 }}>{item.name}</h4>
                <Select
                  defaultValue="A4"
                  style={{ flex: 1, width: 50, fontSize: 12 }}
                  onChange={e => this.handleSizeChange(e, item)}
                >
                  <Option value="A4">A4</Option>
                  <Option value="A3">A3</Option>
                  <Option value="A2">A2</Option>
                </Select>
                <Button
                  style={{ flex: 1 }}
                  type="danger"
                  onClick={() => this.handleDelete(index)}
                >
                  <Icon type="delete" />
                </Button>
              </List.Item>
            )}
          />
        </div>
        <TextArea
          rows={4}
          style={{ marginBottom: 20 }}
          placeholder="description ..."
          value={this.state.description}
          onChange={this.handleDescriptionChange}
        />
        <Button
          type="primary"
          onClick={this.handleUpload}
          disabled={fileList.length ? false : true}
        >
          Upload
        </Button>
        {loading ? (
          <div className="loading-indicator">
            <Spin size="large" />
            <h3 style={{ color: "red" }}>Uploading ....</h3>
          </div>
        ) : null}
      </div>
    );
  }
}
