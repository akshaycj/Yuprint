import React, { Fragment } from "react";
import { Consumer } from "../../Context/DataContext";
import "./index.css";
import { db } from "../../Utils/config";
import {
  Spin,
  Icon,
  Button,
  message,
  Input,
  Radio,
  TimePicker,
  DatePicker,
  Select,
  Tag
} from "antd";
import { Redirect } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import MapBox from "../Home/MapBox/MapBox";
import moment from "moment";
import logo from "../../Res/logo.svg";
import share from "../../Res/share.svg";

export default props => (
  <Consumer>
    {({ user, setUser }) => (
      <SinglePage {...props} user={user} setUser={setUser} />
    )}
  </Consumer>
);

class SinglePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.user.uid || "test user id",
      mobile: this.props.user.mobile || "test mobile no",
      data: null,
      redirect: false,
      shareUrl: null,
      onNext: false,
      proceed: false,
      address1: "",
      address2: "",
      geoPosition: "",
      asap: true,
      scheduleDate: null,
      scheduleTime: null,
      description: "",
      size: "A4",
      color: "black and white"
    };
  }

  componentDidMount() {
    console.log("props", this.props);
    if (this.props.match.params.id) {
      db.ref("content")
        .child("users")
        .child("Notes")
        .child(this.props.match.params.id)
        .on("value", item => {
          let data = item.val();
          data.key = item.key;
          console.log(data);
          this.setState({ data: data, shareUrl: window.location.href });
        });
    }
  }

  goBack = () => {
    this.setState({ redirect: true });
  };
  handlePrint = () => {
    this.setState({ loading: true });
    var {
      description,
      id,
      address1,
      address2,
      geoPosition,
      asap,
      scheduleDate,
      scheduleTime,
      mobile,
      size,
      color
    } = this.state;
    var data = {
      description: description,
      user: id || "test user",
      mobile: mobile,
      timestamp: new Date().toISOString(),
      urls: {
        url: this.state.data.url,
        type: size,
        color: color
      },
      status: "active",
      address1: address1,
      address2: address2,
      geoPosition: geoPosition,
      asap: asap,
      scheduleDate: moment(scheduleDate).format("L"),
      scheduleTime: moment(scheduleTime).format("LT")
    };
    console.log("data", data);
    db.ref("userOrder")
      .child(id)
      .push(data, err => {
        if (err) {
          message.error("upload failed.");
        }
      });
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

  setGeoPosition = pos => {
    this.setState({ geoPosition: pos });
  };
  inputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  validateData = () => {
    if (!this.state.geoPosition) {
      message.error("Please pin your location to continue");
    } else if (!this.state.address1) {
      message.error("Please enter Door No. / Flat");
    } else if (!this.state.address2) {
      message.error("Please enter a Landmark, Locality");
    } else {
      this.handlePrint();
    }
  };

  handleSizeChange = e => {
    this.setState({ size: e });
  };
  handleColorChange = e => {
    this.setState({ color: e });
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

  handleDescriptionChange = e => {
    this.setState({ description: e.target.value });
  };

  onClear = () => {
    this.setState({
      loading: false,
      description: "",
      onNext: false,
      redirect: true
    });
  };

  handleNext = () => {
    this.setState({ onNext: true });
  };
  copyUrl = () => {};

  render() {
    const { data, onNext, proceed, shareUrl } = this.state;
    const RadioGroup = Radio.Group;
    const { TextArea } = Input;
    const Option = Select.Option;

    return data ? (
      <div className="main-container">
        <div className="navbar">
          <Icon onClick={this.goBack} type="arrow-left" />
          <img alt="logo" src={logo} />
        </div>
        {!onNext ? (
          <div className="contentMainContainer">
            <h2>{data.title.charAt(0).toUpperCase() + data.title.slice(1)}</h2>
            <div className="share-container">
              <h5>
                Uploaded by <span>{data.user}</span>
              </h5>
              <CopyToClipboard
                text={shareUrl}
                onCopy={() => {
                  message.success("URL copied to clipboard");
                }}
              >
                <img alt="share" src={share} />
              </CopyToClipboard>
            </div>
            {/* <div className="tagsContainer">
              {data.tags.map((tag, index) => {
                return <code key={index}>{"#" + tag}&nbsp;</code>;
              })}
            </div> */}

            <p>{data.description}</p>
            <div>
              <h4>Cateory</h4>
              <div className="tag-group">
                {data.tags.map((item, i) => (
                  <Tag key={i}>{item}</Tag>
                ))}
              </div>
            </div>
            <div className="buttonsContainer">
              <Button
                onClick={this.handleNext}
                style={{ background: "#576EE6", color: "white" }}
                className="upload-button "
              >
                <Icon type="printer" />
                Print
              </Button>
              <Button
                style={{ background: "#8A55E8", color: "white" }}
                className="upload-button"
              >
                <Icon type="file" />
                View
              </Button>
            </div>
          </div>
        ) : (
          <Fragment>
            {proceed ? (
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
                <div className="top-content">
                  <h4 style={{ flex: 2 }}>{data.title}</h4>
                </div>
                <div className="dropDown-container">
                  <Select
                    defaultValue="Black and White"
                    style={{ fontSize: 12 }}
                    onChange={this.handleColorChange}
                  >
                    <Option value="Color">Color</Option>
                    <Option value="Black and White">Black and White</Option>
                  </Select>
                  <Select
                    defaultValue="A4"
                    style={{ fontSize: 12 }}
                    onChange={this.handleSizeChange}
                  >
                    <Option value="A4">A4</Option>
                    <Option value="A3">A3</Option>
                    <Option value="A2">A2</Option>
                  </Select>
                </div>
                <div className="timeRadioContainer">
                  <RadioGroup
                    name="timeRadio"
                    onChange={this.handleTimeRadioChange}
                    defaultValue={this.state.asap ? 0 : 1}
                  >
                    <Radio value={0}>ASAP</Radio>
                    <Radio value={1}>SCHEDULE</Radio>
                  </RadioGroup>
                </div>
                <div className="dateAndTime">
                  <DatePicker
                    onChange={this.handleDateChange}
                    value={this.state.scheduleDate}
                    disabled={this.state.asap}
                  />
                  <TimePicker
                    onChange={this.handleTimeChange}
                    value={this.state.scheduleTime}
                    disabled={this.state.asap}
                  />
                </div>
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
                      this.setState({ proceed: true });
                    }}
                  >
                    Next
                  </div>
                </div>
              </Fragment>
            )}
          </Fragment>
        )}
        {this.state.redirect ? <Redirect to="/home" /> : null}
      </div>
    ) : (
      <div className="main-container">
        <div className="spinnerContainer">
          <Spin size="large" />
        </div>
      </div>
    );
  }
}
