import React, { Component } from "react";
import { Upload, Input, message } from "antd";
import { Consumer } from "../../../Context/DataContext";
import { storage, db } from "./../../../Utils/config";
import "./index.css";
import UploadButton from "./../UploadButton/index";
import ProgressIndicator from "./ProgressIndicator";
import UploadList from "./UploadList";
import loadingIcon from "../../../Res/ball-triangle.svg";
import MapBox from "../MapBox/MapBox";

const Fragment = React.Fragment;

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
      id: this.props.user.uid || "test user id",
      onNext: false
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
          var progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          console.log("progress", progress);

          that.setState({ progress });
        },
        function(error) {
          console.error("Something nasty happened", error);
        },
        () => {
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
    const {
      fileList,
      loading,
      progress,
      pending,
      completed,
      onNext
    } = this.state;

    const { TextArea } = Input;
    return (
      <div className="home-main">
        {loading ? (
          <Fragment>
            <img src={loadingIcon} alt="loading" />
            <ProgressIndicator
              progress={progress}
              completed={completed}
              pending={pending}
            />
          </Fragment>
        ) : (
          <Fragment>
            {fileList.length === 0 ? (
              <Upload
                showUploadList={false}
                multiple={true}
                beforeUpload={this.beforeUpload}
              >
                <UploadButton />
              </Upload>
            ) : (
              <Fragment>
                {onNext ? (
                  <Fragment>
                    <div className="map-content">
                      <MapBox />
                    </div>
                    <div className="upload-button-group">
                      <div
                        className="upload-button upload-button-border"
                        onClick={() => {
                          this.setState({ onNext: false });
                        }}
                      >
                        Prev
                      </div>{" "}
                      <div
                        className="upload-button upload-button-back"
                        onClick={this.handleUpload}
                      >
                        Done
                      </div>
                    </div>
                  </Fragment>
                ) : (
                  <Fragment>
                    <UploadList
                      fileList={fileList}
                      handleSizeChange={this.handleSizeChange}
                      handleDelete={this.handleDelete}
                    />
                    <TextArea
                      rows={4}
                      style={{ marginBottom: 20 }}
                      placeholder="Printing instructions"
                      value={this.state.description}
                      onChange={this.handleDescriptionChange}
                    />
                    <div
                      className="upload-button upload-button-border"
                      onClick={() => {
                        this.setState({ onNext: true });
                      }}
                    >
                      Next
                    </div>
                  </Fragment>
                )}
              </Fragment>
            )}
          </Fragment>
        )}

        {/* <Button
          type="primary"
          onClick={this.handleUpload}
          disabled={fileList.length ? false : true}
        >
          Upload
        </Button> */}
      </div>
    );
  }
}
