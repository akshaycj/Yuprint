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
      mobile: this.props.user.mobile,
      onNext: false,
      geoPosition: null,
      address1: "",
      address2: ""
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
          let location = uploadFile.snapshot.ref.location.bucket;
          var path = uploadFile.snapshot.ref.location.path;
          let downloadURL = location + "/" + path;
          let urls = that.state.urls;
          urls[index] = {
            url: downloadURL,
            type: item.paperSize,
            color: item.color
          };
          completed = completed + 1;
          that.setState({ urls, completed });
          // uploadFile.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          //   let urls = that.state.urls;
          //   urls[index] = {
          //     url: downloadURL,
          //     type: item.paperSize,
          //     color: item.color
          //   };
          //   completed = completed + 1;
          //   that.setState({ urls, completed });
          // });
        }
      );

      return uploadFile;
    });

    Promise.all(storeFileStorage).then(() => {
      console.log("urls", this.state.urls);

      this.pushData(this.state.urls);
    });
  };

  pushData = urls => {
    var { description, id, address1, address2, geoPosition } = this.state;
    var data = {
      description: description,
      user: id || "test user",
      mobile: this.props.user.phoneNumber || "test mobileNo",
      timestamp: new Date().toISOString(),
      urls: urls,
      status: "active",
      address1: address1,
      address2: address2,
      geoPosition: geoPosition
    };
    console.log("data", data);

    db.ref("store")
      .child("orders")
      .child("active")
      .push(data, err => {
        if (err) {
          message.error("upload failed.");
        } else {
          message.success("upload successful");
        }
        this.onClear();
      });
  };

  onClear = () => {
    this.setState({
      loading: false,
      fileList: [],
      description: "",
      onNext: false
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
  handleColorChange = (value, item) => {
    item.color = value;
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
    file.color = "Black and White";
    this.setState(state => ({
      fileList: [...state.fileList, file]
    }));

    return false;
  };
  handleDescriptionChange = e => {
    this.setState({ description: e.target.value });
  };

  inputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  setGeoPosition = pos => {
    this.setState({ geoPosition: pos });
  };

  validateData = () => {
    if (!this.state.geoPosition) {
      message.error("Please pin your location to continue");
    } else if (!this.state.address1) {
      message.error("Please enter Door No. / Flat");
    } else if (!this.state.address2) {
      message.error("Please enter a Landmark, Locality");
    } else {
      this.handleUpload();
    }
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
                      <MapBox setGeoPosition={this.setGeoPosition} />
                    </div>
                    <div className="address-container">
                      <h5 style={{ color: "red" }}>
                        *Currently available only near CUSAT
                      </h5>
                      <Input
                        type="text"
                        placeholder="Door No. / Flat"
                        name="address1"
                        onChange={this.inputChange}
                        value={this.state.address1}
                      />
                      <Input
                        type="text"
                        placeholder="Landmark, Locality"
                        name="address2"
                        onChange={this.inputChange}
                        value={this.state.address2}
                      />
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
                          onClick={this.validateData}
                        >
                          Done
                        </div>
                      </div>
                    </div>
                  </Fragment>
                ) : (
                  <Fragment>
                    <UploadList
                      fileList={fileList}
                      handleSizeChange={this.handleSizeChange}
                      handleColorChange={this.handleColorChange}
                      handleDelete={this.handleDelete}
                    />
                    <TextArea
                      rows={4}
                      style={{ marginBottom: 20 }}
                      placeholder="Printing instructions"
                      value={this.state.description}
                      onChange={this.handleDescriptionChange}
                    />
                    <div className="upload-button-group">
                      <div
                        className="upload-button cancel-button"
                        onClick={this.onClear}
                      >
                        Cancel
                      </div>{" "}
                      <div
                        className="upload-button upload-button-border"
                        onClick={() => {
                          this.setState({ onNext: true });
                        }}
                      >
                        Next
                      </div>
                    </div>
                  </Fragment>
                )}
              </Fragment>
            )}
          </Fragment>
        )}
      </div>
    );
  }
}
