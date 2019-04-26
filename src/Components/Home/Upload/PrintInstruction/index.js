import React, { Fragment } from "react";
import { DatePicker, TimePicker, Input, Radio } from "antd";

const { TextArea } = Input;
const RadioGroup = Radio.Group;

export default ({
  asap,
  scheduleDate,
  scheduleTime,
  description,
  handleTimeRadioChange,
  handleDateChange,
  handleTimeChange,
  handleDescriptionChange
}) => (
  <Fragment>
    <div className="timeRadioContainer">
      <RadioGroup
        name="timeRadio"
        onChange={handleTimeRadioChange}
        defaultValue={asap ? 0 : 1}
      >
        <Radio value={0}>ASAP</Radio>
        <Radio value={1}>SCHEDULE</Radio>
      </RadioGroup>
    </div>
    <div className="dateAndTime">
      <DatePicker
        onChange={handleDateChange}
        value={scheduleDate}
        disabled={asap}
      />
      <TimePicker
        onChange={handleTimeChange}
        value={scheduleTime}
        disabled={asap}
      />
    </div>
    <TextArea
      rows={4}
      style={{ marginBottom: 20 }}
      placeholder="Printing instructions"
      value={description}
      onChange={handleDescriptionChange}
    />
  </Fragment>
);
