import React, { Component } from "react";
import {
  Upload,
  Icon,
  Input,
  Button,
  message,
  Select,
  List,
  Spin,
  Tabs,
  Tag
} from "antd";
import { TweenOneGroup } from "rc-tween-one";
import { Consumer } from "../../../Context/DataContext";
import { storage, db } from "./../../../Utils/config";
import "./index.css";

export default props => (
  <Consumer>{({ user }) => <ContentCreator {...props} user={user} />}</Consumer>
);

class ContentCreator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      description: "",
      loading: false,
      title: "",
      tags: ["Tag 1"],
      inputVisible: false,
      inputValue: ""
    };
  }
  handleUpload = () => {
    this.setState({ loading: true });
    let storeFileStorage = this.state.fileList.map((item, index) => {
      let uploadFile = storage
        .ref("global-content")
        .child(item.name)
        .put(item);
      uploadFile.on(
        "state_changed",
        function(snapshot) {
          console.log("snapshot", snapshot);
        },
        function(error) {
          console.error("Something nasty happened", error);
        },
        () => {
          let location = uploadFile.snapshot.ref.location.bucket;
          var path = uploadFile.snapshot.ref.location.path;
          let downloadURL = location + "/" + path;
          this.setState({ url: downloadURL });
          let databasePush = db
            .ref("content")
            .child("users")
            .child("Notes")
            .push(
              {
                title: this.state.title,
                description: this.state.description,
                uid: this.props.user.uid || "test user id",
                user: this.props.user.displayName || "test user name",
                type: "Notes",
                url: downloadURL,
                tags: this.state.tags
              },
              err => {
                if (err) {
                  message.error(`${item.name} upload failed.`);
                } else {
                  message.success(`${item.name} upload successful`);
                }
              }
            );
          return databasePush;
        }
      );
      return uploadFile;
    });
    Promise.all(storeFileStorage).then(() => {
      this.setState({
        loading: false,
        fileList: [],
        title: "",
        description: "",
        tags: []
      });
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
  handleTitleChange = e => {
    this.setState({ title: e.target.value });
  };
  saveInputRef = input => (this.input = input);

  handleTagInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };
  handleTagClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
  };
  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };
  handleTagInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({ tags, inputVisible: false, inputValue: "" });
  };
  forMap = tag => {
    const tagElem = (
      <Tag
        closable
        onClose={e => {
          e.preventDefault();
          this.handleTagClose(tag);
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: "inline-block" }}>
        {tagElem}
      </span>
    );
  };
  render() {
    const { fileList, isFile, loading } = this.state;
    const Option = Select.Option;
    const { TextArea } = Input;
    const { tags, inputVisible, inputValue, title } = this.state;
    const tagChild = tags.map(this.forMap);
    return (
      <div className="home-main">
        <Upload
          showUploadList={false}
          multiple={true}
          beforeUpload={this.beforeUpload}
        >
          <Button>
            <Icon type="upload" /> click to select items
          </Button>
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
        <Input
          placeholder="title"
          style={{ marginBottom: "5%" }}
          value={this.state.title}
          onChange={this.handleTitleChange}
        />
        <TextArea
          rows={4}
          style={{ marginBottom: 20 }}
          placeholder="description ..."
          value={this.state.description}
          onChange={this.handleDescriptionChange}
        />
        <div style={{ marginBottom: 16 }}>
          <TweenOneGroup
            enter={{
              scale: 0.8,
              opacity: 0,
              type: "from",
              duration: 100,
              onComplete: e => {
                e.target.style = "";
              }
            }}
            leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
            appear={false}
          >
            {tagChild}
          </TweenOneGroup>
        </div>
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78, marginBottom: "5%" }}
            value={inputValue}
            onChange={this.handleTagInputChange}
            onBlur={this.handleTagInputConfirm}
            onPressEnter={this.handleTagInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag
            onClick={this.showInput}
            style={{
              background: "#fff",
              borderStyle: "dashed",
              marginBottom: "5%"
            }}
          >
            <Icon type="plus" /> New Tag
          </Tag>
        )}

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
