import React, { Component } from "react";
import { Select, List, Icon, TimePicker, DatePicker, Radio } from "antd";
import moment from "moment";
export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: null,
      date: null,
      asap: true
    };
  }

  handleTimeChange = e => {
    this.setState({ time: e }, () => {
      this.props.setScheduleTime(moment(this.state.time).format("LT"));
    });
  };

  handleDateChange = e => {
    this.setState({ date: e }, () => {
      this.props.setScheduleDate(moment(this.state.date).format("L"));
    });
  };

  handleTimeRadioChange = e => {
    this.props.handleTimeRadioChange(e.target.value);
    if (!e.target.value) {
      this.setState({ time: null, date: null, asap: true });
    } else {
      this.setState({ asap: false });
    }
  };

  render() {
    const Option = Select.Option;
    const RadioGroup = Radio.Group;
    const {
      fileList,
      handleDelete,
      handleSizeChange,
      handleColorChange,
      handleTimeRadioChange,
      setScheduleTime,
      setScheduleDate
    } = this.props;
    return (
      <div className="list-container">
        <List
          className="list"
          itemLayout="horizontal"
          dataSource={fileList}
          renderItem={(item, index) => (
            <List.Item className="list-item">
              <div className="top-content">
                <h4 style={{ flex: 2 }}>{item.name}</h4>
                <Icon
                  type="delete"
                  style={{ flex: 0.1, color: "red" }}
                  onClick={() => handleDelete(index)}
                />
              </div>
              <div className="dropDown-container">
                <Select
                  defaultValue="Color"
                  style={{ fontSize: 12 }}
                  onChange={e => handleColorChange(e, item)}
                >
                  <Option value="Color">Color</Option>
                  <Option value="Black and White">Black and White</Option>
                </Select>
                <Select
                  defaultValue="A4"
                  style={{ fontSize: 12 }}
                  onChange={e => handleSizeChange(e, item)}
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
                  defaultValue={0}
                >
                  <Radio value={0}>ASAP</Radio>
                  <Radio value={1}>SCHEDULE</Radio>
                </RadioGroup>
              </div>
              <div className="dateAndTime">
                <DatePicker
                  onChange={this.handleDateChange}
                  value={this.state.date}
                  disabled={this.state.asap}
                />
                <TimePicker
                  onChange={this.handleTimeChange}
                  value={this.state.time}
                  disabled={this.state.asap}
                />
              </div>
            </List.Item>
          )}
        />
      </div>
    );
  }
}
