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
import moment from "moment";
import PrintInstruction from "./PrintInstruction";
import ContentUploadDescription from "./ContentUploadDescription";

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
      id: props.user.uid || "test user id",
      mobile: props.user.mobile,
      onNext: false,
      geoPosition: null,
      address1: "",
      address2: "",
      asap: true,
      scheduleTime: null,
      scheduleDate: null,
      uploadUrl: [],
      title: "",
      tags: ["Tag 1"],
      inputVisible: false,
      inputValue: ""
    };
  }
  componentDidMount() {
    //console.log("props", this.props.user);
  }

  handleUpload = () => {
    var { id, fileList, completed, uploadUrl } = this.state;
    this.setState({ loading: true, pending: fileList.length });
    let urls = [];
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
          uploadUrl[index] = uploadFile.snapshot.ref;
          urls[index] = {
            ...urls[index],
            type: item.paperSize,
            color: item.color
          };
          completed = completed + 1;
          that.setState({ uploadUrl, completed });
        }
      );
      return uploadFile;
    });

    Promise.all(storeFileStorage).then(() => {
      Promise.all(
        uploadUrl.map((item, index) => {
          return item.getDownloadURL().then(function(downloadURL) {
            urls[index].url = downloadURL;
            that.setState({ urls, completed: 0 });
          });
        })
      ).then(() => {
        console.log("urls", this.state.urls);
        this.pushData(this.state.urls);
      });
    });
  };

  pushData = urls => {
    var {
      description,
      id,
      address1,
      address2,
      geoPosition,
      asap,
      scheduleDate,
      scheduleTime
    } = this.state;
    var data = {
      description: description,
      user: id || "test user",
      mobile: this.props.user.phoneNumber || "test mobileNo",
      timestamp: new Date().toISOString(),
      urls: urls,
      status: "active",
      address1: address1,
      address2: address2,
      geoPosition: geoPosition,
      asap: asap,
      scheduleDate: moment(scheduleDate).format("L"),
      scheduleTime: moment(scheduleTime).format("LT")
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

  handleTimeChange = e => {
    this.setState({
      scheduleTime: e
    });
  };

  handleDateChange = e => {
    this.setState({
      scheduleDate: e
    });
  };

  handleTimeRadioChange = e => {
    if (!e.target.value) {
      this.setState({ scheduleTime: null, scheduleDate: null, asap: true });
    } else {
      this.setState({ asap: false });
    }
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

  goToNext = () => {
    if (!this.state.asap) {
      if (!this.state.scheduleDate) {
        message.error("Please select a Date");
      } else if (!this.state.scheduleTime) {
        message.error("Please select the time");
      } else {
        this.setState({ onNext: true });
      }
    } else {
      this.setState({ onNext: true });
    }
  };

  handleTitleChange = e => {
    this.setState({ title: e.target.value });
  };
  render() {
    const {
      fileList,
      loading,
      progress,
      pending,
      completed,
      onNext,
      asap,
      scheduleDate,
      scheduleTime,
      description,
      title,
      inputValue,
      inputVisible
    } = this.state;
    const {
      handleDescriptionChange,
      handleTitleChange,
      handleTimeRadioChange,
      handleDateChange,
      handleTimeChange,
      handleSizeChange,
      handleColorChange,
      handleDelete
    } = this;

    const type = this.props.type;

    const printData = [
      {
        title: "Upload to print",
        content: "You can upload multiple files at the same time",
        src:
          "https://gw.alipayobjects.com/zos/rmsportal/VriUmzNjDnjoFoFFZvuh.svg",
        color: "#13C2C2",
        shadowColor: "rgba(19,194,194,.12)",
        icon: "cloud-upload"
      }
    ];
    const contentData = [
      {
        title: "Upload your files",
        content: "Earn 5% incentive everytime someone takes a print!",
        color: "#F5222D",
        shadowColor: "rgba(245,34,45,.12)",
        icon: "book"
      }
    ];

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
                <UploadButton
                  data={type === "print" ? printData : contentData}
                />
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
                      {...{
                        fileList,
                        handleColorChange,
                        handleSizeChange,
                        handleDelete
                      }}
                    />
                    {type === "print" ? (
                      <PrintInstruction
                        {...{
                          asap,
                          scheduleDate,
                          scheduleTime,
                          description,
                          handleTimeRadioChange,
                          handleDateChange,
                          handleTimeChange,
                          handleDescriptionChange
                        }}
                      />
                    ) : (
                      <ContentUploadDescription
                        {...{
                          title,
                          description,
                          handleTitleChange,
                          handleDescriptionChange
                        }}
                      />
                    )}
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
