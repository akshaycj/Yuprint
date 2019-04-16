import React, { Component } from "react";
import { Select, List,  Icon } from "antd";

export default class extends Component {
  render() {
    const Option = Select.Option;
    const { fileList, handleDelete, handleSizeChange } = this.props;
    return (
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
                onChange={e => handleSizeChange(e, item)}
              >
                <Option value="A4">A4</Option>
                <Option value="A3">A3</Option>
                <Option value="A2">A2</Option>
              </Select>
              <Icon
                type="delete"
                style={{ flex: 0.5, color: "red" }}
                onClick={() => handleDelete(index)}
              />
            </List.Item>
          )}
        />
      </div>
    );
  }
}
