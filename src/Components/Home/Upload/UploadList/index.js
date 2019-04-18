import React, { Component } from "react";
import { Select, List, Icon } from "antd";
export default class extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const Option = Select.Option;
    const {
      fileList,
      handleDelete,
      handleSizeChange,
      handleColorChange
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
                  defaultValue="Black and White"
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
            </List.Item>
          )}
        />
      </div>
    );
  }
}
